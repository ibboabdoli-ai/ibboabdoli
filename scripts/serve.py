"""Serve the public build locally with the same security headers as production."""
import json, os
from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'dist'
HEADERS = json.loads((ROOT / 'vercel.json').read_text())['headers'][0]['headers']
class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(PUBLIC), **kwargs)
    def end_headers(self):
        for header in HEADERS:
            self.send_header(header['key'], header['value'])
        super().end_headers()
    def list_directory(self, path):
        self.send_error(404, 'Not found')
        return None
    def log_message(self, format, *args):
        if os.environ.get('VERBOSE_HTTP'):
            super().log_message(format, *args)
if __name__ == '__main__':
    if not PUBLIC.exists():
        raise SystemExit('Run node scripts/build.mjs first')
    server = ThreadingHTTPServer(('127.0.0.1', int(os.environ.get('PORT', '4173'))), Handler)
    print('Serving http://127.0.0.1:4173 with production security headers', flush=True)
    server.serve_forever()
