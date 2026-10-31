// Пререндер маршрутов для GitHub Pages: каждая страница услуг получает
// собственный index.html (HTTP 200) с корректными title/description/canonical.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const dist = 'dist';
const base = 'https://blesk123.ru';

const routes = JSON.parse(readFileSync(new URL('../src/content/seo-pages.json', import.meta.url), 'utf8'));

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const template = readFileSync(join(dist, 'index.html'), 'utf8');

for (const [route, meta] of Object.entries(routes)) {
  const url = `${base}${route}`;
  let html = template.replace(/<title[^>]*>[\s\S]*?<\/title>/, `<title data-rh="true">${esc(meta.title)}</title>`);
  for (const [attribute, key, value] of [
    ['name', 'description', meta.description],
    ['name', 'robots', meta.robots || 'index, follow'],
    ['property', 'og:title', meta.title],
    ['property', 'og:description', meta.description],
    ['property', 'og:url', url],
    ['name', 'twitter:title', meta.title],
    ['name', 'twitter:description', meta.description],
  ]) {
    const pattern = new RegExp(`<meta\\s+${attribute}="${key}"[^>]*>`);
    html = html.replace(pattern, () => `<meta ${attribute}="${key}" content="${esc(value)}" data-rh="true" />`);
  }
  html = html.replace(/<link\s+rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" data-rh="true" />`);
  if (route === '/') {
    writeFileSync(join(dist, 'index.html'), html);
  } else {
    const dir = join(dist, route.slice(1));
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'index.html'), html);
    writeFileSync(join(dist, route.slice(1) + '.html'), html);
  }
  console.log('prerendered', route);
}
