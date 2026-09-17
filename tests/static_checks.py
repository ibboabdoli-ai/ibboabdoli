"""Dependency-free checks for built public pages and assets."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote, urljoin
import base64, hashlib, json, re, struct
import xml.etree.ElementTree as ET
ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT/'dist'
BASE = 'https://www.ibboabdoli.com'
class Page(HTMLParser):
    def __init__(self,text):
        super().__init__(convert_charrefs=True)
        self.tags=[]; self.ids=[]; self.h1=0; self.feed(text)
    def handle_starttag(self,tag,attrs):
        a=dict(attrs); self.tags.append((tag,a))
        if 'id' in a:self.ids.append(a['id'])
        if tag=='h1':self.h1+=1
        assert not any(k.lower().startswith('on') for k in a), ('inline event',tag)
        assert 'style' not in a and tag!='style', ('inline style',tag)
    def find(self,tag,**attrs):
        return [a for t,a in self.tags if t==tag and all(a.get(k)==v for k,v in attrs.items())]
def route(path):
    clean=unquote(urlsplit(path).path)
    candidate=PUBLIC/clean.lstrip('/')
    if candidate.is_dir():candidate=candidate/'index.html'
    assert candidate.resolve().is_relative_to(PUBLIC.resolve()),clean
    return candidate
pages={}
for file in PUBLIC.rglob('*.html'):
    text=file.read_text(); p=Page(text); path='/'+file.relative_to(PUBLIC).as_posix()
    if path.endswith('index.html'):path=path[:-10]
    pages[path]=(p,text)
    assert len(p.ids)==len(set(p.ids)),f'duplicate IDs: {path}'
    assert p.h1==1,f'h1 count: {path}: {p.h1}'
    assert p.find('title'),f'missing title: {path}'
    if path=='/404.html':continue
    assert p.find('link',rel='canonical',href=BASE+path),f'canonical: {path}'
    assert len(p.find('meta',name='description'))==1,f'description: {path}'
    assert p.find('meta',property='og:image'),f'OG image: {path}'
    assert p.find('html')[0].get('lang') in ['sv','en'],path
config=json.loads((ROOT/'vercel.json').read_text())
csp=next(h['value'] for h in config['headers'][0]['headers'] if h['key']=='Content-Security-Policy')
checks=0
for path,(p,text) in pages.items():
    for tag,attrs in p.tags:
        value=attrs.get('href') or attrs.get('src')
        if not value:continue
        url=urlsplit(urljoin(BASE+path,value))
        if url.scheme not in ['http','https'] or url.netloc!=urlsplit(BASE).netloc:continue
        target=route(url.path)
        assert target.is_file(),f'Broken link {path} -> {value}'
        checks+=1
        if url.fragment and target.suffix=='.html':
            assert unquote(url.fragment) in Page(target.read_text()).ids,f'Missing fragment {path} -> {value}'
    for inline in re.findall(r'<script\b[^>]*type="application/ld\+json"[^>]*>(.*?)</script>',text,re.S):
        data=json.loads(inline); assert data.get('@context')=='https://schema.org'
        digest=base64.b64encode(hashlib.sha256(inline.encode()).digest()).decode()
        assert "'sha256-"+digest+"'" in csp,f'Missing CSP hash: {path}'
    for alt in p.find('link',rel='alternate'):
        if alt.get('hreflang') not in ['sv','en','x-default']:continue
        other_path=urlsplit(alt['href']).path
        other=pages[other_path][0]
        if alt['hreflang']=='x-default':continue
        lang=p.find('html')[0]['lang']
        assert other.find('link',rel='alternate',hreflang=lang,href=BASE+path),f'Nonreciprocal alternate {path}'
root=ET.parse(PUBLIC/'sitemap.xml').getroot()
ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
sitemap_urls=[]
for item in root.findall('s:url',ns):
    loc=item.find('s:loc',ns).text; sitemap_urls.append(loc)
    assert loc.startswith(BASE+'/') and route(loc).is_file(),loc
    assert item.find('s:lastmod',ns).text=='2026-09-17'
assert len(sitemap_urls)==11 and len(set(sitemap_urls))==11
assert set(sitemap_urls)=={BASE+p for p in pages if p!='/404.html'}
assert 'Sitemap: '+BASE+'/sitemap.xml' in (PUBLIC/'robots.txt').read_text()
assert 'public_html' not in [p.name for p in PUBLIC.iterdir()]
for private in ['archive','docs','scripts','tests','maintenance','.git']:
    assert not (PUBLIC/private).exists(),f'Private output leaked: {private}'
cv_files=list((PUBLIC/'assets/cv').glob('*.pdf'))
assert len(cv_files)>=2
for cv in cv_files:
    assert cv.read_bytes().startswith(b'%PDF-') and cv.stat().st_size>10000,cv
for home in ['/','/en/']:
    downloads=[a.get('href') for tag,a in pages[home][0].tags if tag=='a' and 'download' in a and (a.get('href') or '').lower().endswith('.pdf')]
    assert len(downloads)==2,f'Expected exactly two visible CV downloads on {home}: {downloads}'
    assert len(set(downloads))==2,f'Duplicate CV download links on {home}: {downloads}'
assert struct.unpack('>II',(PUBLIC/'og-image.png').read_bytes()[16:24])==(1200,630)
for case in (PUBLIC/'cases').glob('*/index.html'):
    assert 'TechArticle' in case.read_text()
assert 'innerHTML' not in (PUBLIC/'assets/site.js').read_text()
tawk=(PUBLIC/'assets/tawk.js').read_text()
assert 'embed.tawk.to/6895ddde56ddd81926b30080/1j24mlbt5' in tawk
assert 'https://*.tawk.to' in csp and 'wss://*.tawk.to' in csp and 'frame-src https://*.tawk.to' in csp
for home in ['/', '/en/']:
    assert 'https://ai.ibboabdoli.com' in pages[home][1]
assert any(r.get('source')=='/ai' and r.get('destination')=='https://ai.ibboabdoli.com' for r in config['redirects'])
print(json.dumps({'status':'passed','html_pages':len(pages),'indexable_urls':len(sitemap_urls),'internal_links_and_assets_checked':checks,'cv_files':len(cv_files),'active_cv_downloads_per_home':2,'og_image':'1200x630','csp':'hashes verified','legacy':'excluded'},indent=2))
