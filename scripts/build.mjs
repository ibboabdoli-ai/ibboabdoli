import { cpSync, mkdirSync, rmSync, existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
const root = process.cwd();
const out = resolve(root, 'dist');
rmSync(out, { recursive: true, force: true });
mkdirSync(out);
const publicFiles = ['index.html','404.html','robots.txt','sitemap.xml','assets','en','card','cases','privacy','favicon.ico','favicon.svg','favicon-48x48.png','apple-touch-icon.png','og-image.png','og-image.svg','icon-192.png','icon-512.png'];
for (const name of publicFiles) {
  if (!existsSync(join(root, name))) throw new Error(`Missing public file: ${name}`);
  cpSync(join(root, name), join(out, name), { recursive: true });
}
function scan(dir) {
  for (const item of readdirSync(dir, { withFileTypes: true })) {
    const file = join(dir, item.name);
    if (item.isDirectory()) scan(file);
    else if (item.name.endsWith('.html')) {
      let html = readFileSync(file, 'utf8');
      const migrated = html.replaceAll('https://formspree.io/f/xqapdadv', '/api/contact');
      if (migrated !== html) {
        writeFileSync(file, migrated);
        html = migrated;
      }
      if (/\son[a-z]+\s*=/i.test(html) || /<style\b/i.test(html) || /\sstyle\s*=/i.test(html)) throw new Error(`Inline executable/style content: ${file}`);
      if (!html.includes('Page not found') && !html.includes('https://www.ibboabdoli.com/')) throw new Error(`Canonical host missing: ${file}`);
    }
  }
}
scan(out);
console.log('Built explicit public allowlist into dist; contact forms use /api/contact; archive, scripts and documentation excluded.');
