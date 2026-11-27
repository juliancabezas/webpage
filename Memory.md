# Memory.md — aprendizajes del proyecto

Bitácora de lo aprendido trabajando en el sitio. Entradas fechadas; lo más reciente arriba dentro de cada sección.

## Decisiones del usuario
- 2026-11-25 · Rediseño futurista/ambiental completo con `satelite4.jpg` como referencia.
- 2026-11-25 · La imagen satelital va en un **hero dedicado** arriba de la portada; la biografía queda debajo sobre fondo limpio.
- 2026-11-25 · **Oscuro por defecto** pero se conserva el modo claro y el selector de tema.

## Historia y trampas
- 2026-11-18 · Se intentó usar `satelite4.jpg` como fondo de la sección biografía (`resume-biography-3`) y se revirtió
  (commit c8e0214): la foto detrás de texto largo y avatar resta legibilidad. No repetir.
- El Hugo del PATH (WinGet) es 0.145; el build exige 0.170.1 (`.hugo-version`). Herramientas portables verificadas en
  `.migration/tools/` (hugo, golang/go/bin, node/node-v22.23.5-win-x64). Sin Go en PATH, Hugo falla con
  `binary with name "go" not found`.
- En Git Bash, `cat > archivo` sin heredoc espera stdin y se cuelga: escribir con `printf` o heredoc.
- 2026-11-25 · `python` en este Windows es el alias de Microsoft Store y se cuelga: no usarlo en scripts.
- 2026-11-25 · `hugo server` sirve desde disco y bloquea archivos de `public/`: detener el servidor antes de `npm run build`
  (si no: `unlinkat ... being used by another process`).
- 2026-11-25 · Vista previa: `.claude/launch.json` → `.claude/hugo-dev.ps1` antepone las herramientas portables al PATH
  (pasar el PATH en línea dentro de `runtimeArgs` se rompe por el escapado).
- 2026-11-25 · `satelite4.jpg` mide 1280×400: no generar variantes mayores (reescalado inútil). Sirve como `og:image`
  vía `assets/media/sharing.jpg` (HugoBlox usa `media/sharing.*` si la página no tiene imagen destacada).

## Rediseño Orbital (2026-11-25)
- Tema `data/themes/orbital.yaml` + fuentes `data/fonts/orbital.yaml`; capa visual en `assets/css/futuristic.css`
  cargada por `hooks/head-end/theme.html`; firma del pie en `hooks/footer-start/signature.html`.
- Hero propio `hbx/blocks/hero-orbital` (sección `id: hero`, primera en ambas portadas). Contenido en el front matter.
- Contadores CSS de sección (`// 01`): el `counter-reset` debe ir en `body`; en `main` cada sección reinicia en 01.
- Las habilidades de `/experience/` en grilla de 2 columnas quedaban apretadas (título/texto lado a lado): se dejó en
  una columna con acento lateral cian.
- El modo oscuro de HugoBlox es la clase `.dark` en `<html>` (hb-head.js); los tokens `--orb-*` se redefinen ahí.
- Disqus desactivado (`comments.enable: false`), selector de idioma en la cabecera, "Inicio" apunta a `/`.

## Skill frontend-design (2026-11-27)
- Plugin `frontend-design:frontend-design` (instalado por el usuario). Criterios clave: audacia en **un solo lugar**
  y el resto sobrio; una o dos familias tipográficas; números `01/02` solo para secuencias reales; una animación
  orquestada en vez de efectos infinitos dispersos; CTAs que dicen qué hacen; el brief del cliente manda sobre la skill.
- Rasgos que la skill marca como "diseño generado" y que el rediseño Orbital usa: etiquetas mono en MAYÚSCULAS con
  tracking, metadatos unidos con `·`, `// 0N` en secciones no secuenciales, titular con degradado, tarjetas idénticas
  con brillo. Varios los pidió el brief (`// 01`, telemetría mono): tratarlos como decisión del usuario, no corregirlos solos.
- Propuestas priorizadas (P0–P4) en `DIAGNOSTICO.md` → "Revisión con la skill frontend-design".
- Trampa encontrada: los posts de blogdown usan `<pre class="r"><code>` en HTML crudo; Goldmark corta el bloque en la
  primera línea vacía y los comentarios `# …` de R salen como `<h1>`. Solución: bloques de código Markdown.
- Contraste medido en claro: `#0891b2` sobre `#f4fbfb` = 3,5:1 (falla AA); `#0e7490` = 5,1:1. El tema usa `#0891b2`
  aunque CLAUDE.md dice `#0e7490`.
- 2026-11-27 · **Google Fonts de HugoBlox estaba roto**: `functions/typography.html` del módulo pedía
  `wght@500,600,700` (comas) y repetía la familia por rol → la API css2 responde **400** y la fuente no carga
  (Space Grotesk nunca se vio). Override en `layouts/_partials/functions/typography.html`: pesos agrupados por familia y
  separados con `;`. Verificar con `curl -A "<UA de navegador>"` (sin UA también da 400) o `document.fonts` tras `fonts.ready`.
- 2026-11-27 · Implementación en rama `design/frontend-review`: hero con `route` (lat/lon → viewBox 520×224,
  `x=(lon+95)*2`, `y=(62-lat)*2`; `arc` por parada evita que ida y vuelta se superpongan). No usar `lang.FormatNumber`
  para coordenadas SVG: en `es` sale con coma decimal; usar `printf "%.1f"`.
- 2026-11-27 · Copiar archivos desde la caché de módulos los deja de solo lectura: `chmod u+w` antes de editarlos.
- 2026-11-27 · Bloques de código de los posts de blogdown convertidos a Markdown (script Node con desescapado de entidades,
  línea en blanco antes y después de cada bloque porque están entre bloques HTML).

## HugoBlox (módulo `blox`)
- Caché de módulos: `%LOCALAPPDATA%\hugo_cache\modules\filecache\modules\pkg\mod\github.com\!hugo!blox\kit\modules\blox@v0.0.0-20260527025321-61f41d3667f1\`.
  Los bloques viven en `blox/<id>/block.html` y se montan en `layouts/_partials/hbx/blocks/<id>/block.html`.
- Packs de tema en `data/themes/<pack>.yaml` (`format: hugoblox-theme@1`, `type: dual`, `light`/`dark` con `colors` y `surfaces`);
  un pack propio en `data/themes/` del proyecto se elige con `hugoblox.theme.pack`. Los colores admiten hex.
- Packs de fuentes en `data/fonts/<pack>.yaml` (`format: hugoblox-font@1`, `families` heading/body/code); Google Fonts automático.
- Hooks: `functions/get_hook` con `head-start` y `head-end` (se cargan después del CSS del tema → buen lugar para overrides).
- Marcado estable para estilos: secciones `<section id=… class="… hbb-section">`, cabecera `#site-header .navbar .nav-link`,
  títulos de colección como `div.mb-6.text-3xl` (no `h2`), tarjetas con `role=article` y `ring-1`, citas `.pub-list-item`.
