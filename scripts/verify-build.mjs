import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve('public');
const preview = ['deploy-preview', 'branch-deploy'].includes(process.env.CONTEXT)
  || process.env.HUGO_ENVIRONMENT === 'preview';
const origin = new URL(preview ? process.env.DEPLOY_PRIME_URL : 'https://www.juliancabezas.com/').origin;
const required = [
  'index.html', 'experience/index.html', 'publication/index.html', 'post/index.html', 'project/index.html',
  'gracias/index.html',
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
  'en/index.html', 'en/experience/index.html', 'en/publication/index.html',
  'en/post/index.html', 'en/project/index.html', 'en/thank-you/index.html',
  'en/publication/igars-samovar/index.html', 'en/publication/lecs-carbono/index.html',
  'en/publication/lecs-respiracion/index.html', 'en/publication/lecs-riqueza/index.html',
  'en/post/parallel-r-windows/index.html', 'en/post/parallel-cluster-function/index.html',
  'en/post/large-datasets-r-sqlite/index.html',
  'en/project/gcbm/pilot_losrios_v02/index.html', 'en/project/gcbm/pilot_losrios_v0_6_4/index.html',
  'en/files/cv.pdf', 'en/index.xml', 'en/sitemap.xml',
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
const english = readFileSync(path.join(root, 'en/index.html'), 'utf8');
assert(/href=["']?\/en\/["'\s>]/.test(home), 'English site debe enlazar a /en/');
assert(!home.includes('https://en.juliancabezas.com'), 'El enlace inglés apunta al sitio antiguo');
assert(/<html\b[^>]*lang=["']?en-US["'\s>]/i.test(english), 'Idioma incorrecto en /en/');
assert(english.includes('I am a data scientist') && english.includes('Artificial intelligence and data science'), 'Falta el perfil en inglés');
assert(!english.includes('Soy científico de datos') && !english.includes('Coordinación del equipo'), 'Perfil o tarjetas sin traducir');
assert.equal(english.split('experience-summary-card').length - 1, 6, 'Deben aparecer seis trabajos en inglés');
assert(/href=["']?\/["'\s>][^>]*hreflang=["']?es["'\s>]/.test(english), 'Falta el regreso local al sitio español');
assert(english.includes(`${origin}/en/`), 'Canonical inglés incorrecto');
assert(english.includes('https://formsubmit.co/juliancabezas@gmail.com'), 'Falta el formulario inglés');
const contactForm = home.match(/<form\b[^>]*\baction=["']?https:\/\/formsubmit\.co\/juliancabezas@gmail\.com["'\s>][\s\S]*?<\/form>/i)?.[0];
assert(contactForm, 'Falta el formulario de contacto en el HTML estático');
assert(/\bmethod=["']?POST["'\s>]/i.test(contactForm), 'El formulario debe enviar por POST');
assert(!/\bdata-netlify\b|\bnetlify-honeypot\b/i.test(home), 'El contacto no debe usar Netlify Forms');
for (const field of ['name', 'email', 'subject', 'message']) {
  assert(new RegExp(`\\bname=["']?${field}["'\\s>]`).test(contactForm), `Falta el campo ${field}`);
}

let checked = 0;
const failures = [];
for (const file of required.filter(file => file.endsWith('.html'))) {
  const html = readFileSync(path.join(root, file), 'utf8');
  if (file.startsWith('en/')) {
    for (const link of html.matchAll(/<a\b[^>]*href=["']?\/(?:experience|post|publication|project)\/[^>]*>/g)) {
      assert(/hreflang=["']?es["'\s>]/.test(link[0]), `Enlace de inglés a contenido español fuera del selector: ${file}`);
    }
  }
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
