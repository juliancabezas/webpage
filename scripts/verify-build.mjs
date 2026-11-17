import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve('public');
const preview = ['deploy-preview', 'branch-deploy'].includes(process.env.CONTEXT)
  || process.env.HUGO_ENVIRONMENT === 'preview';
const origin = new URL(preview ? process.env.DEPLOY_PRIME_URL : 'https://www.juliancabezas.com/').origin;
const required = [
  'index.html', 'experience/index.html', 'publication/index.html', 'post/index.html', 'project/index.html',
  'publication/igars-samovar/index.html',
  'publication/lecs-carbono/index.html',
  'publication/lecs-respiracion/index.html',
  'publication/lecs-riqueza/index.html',
  'post/paralelizando-r-en-windows-usando-el-paquete-parallel/index.html',
  'post/tutorial/index.html', 'post/tutorial-2/index.html',
  'project/gcbm/pilot_losrios_v02/index.html',
  'project/gcbm/pilot_losrios_v0_6_4/index.html',
  'files/CV_Julian_Cabezas_Spanish_04_2019.pdf',
  'files/cv.pdf',
  'sitemap.xml', 'robots.txt', '_headers', '_redirects', 'pagefind/pagefind.js',
];

// Compare path segments exactly, even on Windows, to catch Linux hosting errors.
function exactFile(relative) {
  let current = root;
  for (const segment of relative.split('/').filter(Boolean)) {
    if (!existsSync(current) || !statSync(current).isDirectory()
      || !readdirSync(current).includes(segment)) return false;
    current = path.join(current, segment);
  }
  return existsSync(current) && statSync(current).isFile();
}

for (const file of required) assert(exactFile(file), `Falta la ruta publicada: ${file}`);
const home = readFileSync(path.join(root, 'index.html'), 'utf8');
for (const id of ['about', 'publications', 'posts', 'projects', 'contact']) {
  assert(new RegExp(`id=["']?${id}(?:["'\\s>])`).test(home), `Falta la sección #${id}`);
}
assert(home.includes('Julián Cabezas'), 'Falta la identidad del autor');
assert(!home.includes('Dr. Alex Johnson'), 'La portada conserva el perfil de demostración');

let checked = 0;
const failures = [];
for (const file of required.filter(file => file.endsWith('.html'))) {
  const html = readFileSync(path.join(root, file), 'utf8');
  const pageURL = new URL(file.replace(/index\.html$/, ''), `${origin}/`);
  const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<!--[^]*?-->/g, '');
  for (const match of markup.matchAll(/\s(?:href|src)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'<>`=]+))/gi)) {
    const reference = (match[1] ?? match[2] ?? match[3]).replaceAll('&amp;', '&');
    if (!reference || reference.startsWith('#') || /^(?:data|mailto|tel|javascript):/i.test(reference)) continue;
    const url = new URL(reference, pageURL);
    if (url.origin !== origin) continue;
    let relative = decodeURIComponent(url.pathname).replace(/^\//, '');
    if (!relative || relative.endsWith('/')) relative += 'index.html';
    if (!exactFile(relative) && !exactFile(`${relative}/index.html`)) {
      failures.push(`${file}: ${reference}`);
    }
    checked++;
  }
  if (preview) assert(/name=["']?robots["']?\s+content=["']noindex, nofollow/.test(html), `Falta noindex: ${file}`);
}
assert.equal(failures.length, 0, `Enlaces o recursos locales inexistentes:\n${[...new Set(failures)].join('\n')}`);
const robots = readFileSync(path.join(root, 'robots.txt'), 'utf8');
assert(preview ? robots.includes('Disallow: /') : robots.includes(`Sitemap: ${origin}/sitemap.xml`));
assert(readFileSync(path.join(root, 'index.html'), 'utf8').includes(`${origin}/`), 'Base URL incorrecta');
assert(/^\/\*\r?\n  X-Content-Type-Options: nosniff/m.test(readFileSync(path.join(root, '_headers'), 'utf8')), 'Formato de cabeceras Netlify inválido');
assert(/media\/authors\/me[^\s"'<>]*\.(?:jpg|webp)/.test(home), 'Falta la foto de perfil');
console.log(`Verificación correcta: ${required.length} rutas, ${checked} enlaces/recursos locales y política de indexación.`);
