"""Refresh only JSON-LD CSP hashes after editing published structured data."""
from pathlib import Path
import re, json, hashlib, base64
ROOT = Path(__file__).resolve().parents[1]
files = [ROOT/'index.html',ROOT/'card/index.html']
for directory in ['cases','en','privacy']:
    files.extend((ROOT/directory).rglob('index.html'))
hashes = set()
for path in files:
    for text in re.findall(r'<script\b[^>]*type="application/ld\+json"[^>]*>(.*?)</script>',path.read_text(), re.S):
        hashes.add("'sha256-"+base64.b64encode(hashlib.sha256(text.encode()).digest()).decode()+"'")
config_path = ROOT/'vercel.json'
config = json.loads(config_path.read_text())
for rule in config['headers']:
    for header in rule['headers']:
        if header['key'].lower() == 'content-security-policy':
            header['value'] = re.sub(r'script-src [^;]+;', "script-src 'self' "+' '.join(sorted(hashes))+';',header['value'])
config_path.write_text(json.dumps(config,indent=2)+'\n')
print(f'Refreshed {len(hashes)} structured-data hashes')
