"""Read-only post-deployment checks against the portfolio's public production host."""
from pathlib import Path
from urllib.request import Request, urlopen, build_opener, HTTPRedirectHandler
from urllib.error import HTTPError
from datetime import datetime, timezone
import hashlib, json, time
ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'dist'
BASE = 'https://www.ibboabdoli.com'
OUT = ROOT / '.qa'
OUT.mkdir(exist_ok=True)
def fetch(path):
    req = Request(BASE + path, headers={'User-Agent': 'PortfolioDeploymentCheck/1.0', 'Cache-Control': 'no-cache', 'Accept-Encoding': 'identity'})
    with urlopen(req, timeout=20) as response:
        return response.status, response.read(), response.headers
expected = (PUBLIC / 'index.html').read_bytes()
for attempt in range(60):
    try:
        status, body, headers = fetch('/')
        if status == 200 and body == expected:
            break
    except (OSError, HTTPError):
        pass
    time.sleep(3)
else:
    raise RuntimeError('Production did not converge to this build within the deployment window')
files = [p for p in PUBLIC.rglob('*.html') if p.name != '404.html']
files += [PUBLIC / name for name in ['robots.txt', 'sitemap.xml', 'og-image.png', 'favicon.ico', 'assets/init.js', 'assets/site.js', 'assets/site.css', 'assets/visuals.css', 'assets/card.css', 'card/ibbo-abdoli.vcf']]
files += list((PUBLIC / 'assets/cv').glob('*.pdf'))
report = {'checked_at': datetime.now(timezone.utc).isoformat(), 'origin': BASE, 'matching_public_resources': [], 'negative_routes': [], 'email_delivery': 'not tested; no form was submitted', 'search_console': 'not accessed'}
for file in files:
    path = '/' + file.relative_to(PUBLIC).as_posix()
    if path.endswith('/index.html'):
        path = path[:-10]
    status, body, headers = fetch(path)
    assert status == 200 and body == file.read_bytes(), f'Deployment content mismatch: {path}'
    assert headers.get('X-Content-Type-Options') == 'nosniff', path
    assert headers.get('Strict-Transport-Security'), path
    policy = headers.get('Content-Security-Policy', '')
    assert "frame-ancestors 'none'" in policy and "'unsafe-inline'" not in policy and "'unsafe-eval'" not in policy, path
    report['matching_public_resources'].append({'path': path, 'status': status, 'sha256': hashlib.sha256(body).hexdigest()})
for path in ['/portfolio-nonexistent-check-20260917/', '/archive/public_html/index.html', '/tests/static_checks.py', '/scripts/build.mjs']:
    try:
        fetch(path)
        raise AssertionError(f'Expected HTTP 404: {path}')
    except HTTPError as error:
        assert error.code == 404, (path, error.code)
        report['negative_routes'].append({'path': path, 'status': error.code})
class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None
try:
    build_opener(NoRedirect).open('https://ibboabdoli.com/card/', timeout=20)
    raise AssertionError('Apex host must redirect permanently')
except HTTPError as error:
    assert error.code in [301, 308], error.code
    assert error.headers.get('Location') == BASE + '/card/'
    report['apex_redirect'] = {'status': error.code, 'destination': error.headers.get('Location')}
report['status'] = 'passed'
(OUT / 'production-report.json').write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps(report, indent=2))
