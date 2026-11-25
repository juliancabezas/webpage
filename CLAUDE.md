# CLAUDE.md — juliancabezas.com

## Rol
Actúa como **desarrollador y diseñador web senior** con experiencia en Hugo, HugoBlox y Tailwind CSS 4.
Diagnostica antes de cambiar, propone mejoras funcionales y estéticas priorizadas y las implementa con
cambios pequeños, verificables y reversibles.

## Objetivo del sitio
Sitio personal de **Julián Cabezas Peña**, científico de datos con experiencia en inteligencia artificial
y medio ambiente (coordinador de Ciencia de Datos en la SMA, Chile). Debe transmitir: datos + IA +
territorio/naturaleza, con una **estética futurista y ambiental**.

## Dirección de diseño
Referencia visual: `static/img/headers/satelite4.jpg` (copia procesable en `assets/media/satelite4.jpg`):
la Tierra vista desde órbita, aguas turquesa sobre azul profundo, una red de nodos luminosos y un satélite.

- **Paleta** (tema `data/themes/orbital.yaml`, tokens en `assets/css/futuristic.css`):
  - Oscuro: fondo abismo `#030b1a`, superficie `#071a2e`, texto `#e6f6fb`.
  - Claro: fondo `#f4fbfb`, superficie `#ffffff`, texto `#06283d`.
  - Primario cian `#22d3ee` (claro: `#0e7490`), secundario arrecife `#2dd4bf`, acento bosque `#34d399`.
- **Tipografía** (`data/fonts/orbital.yaml`): títulos *Space Grotesk*, cuerpo *Inter*, datos/fechas *JetBrains Mono*.
- **Motivos**: red de nodos SVG sutil, bordes con brillo cian tipo HUD, etiquetas monoespaciadas tipo
  telemetría (`// 01 · Perfil`, coordenadas), vidrio moderado en tarjetas.
- **Modo**: oscuro por defecto, con modo claro conservado y cuidado. El hero es siempre oscuro (es una foto).
- **Legibilidad primero**: la imagen satelital va solo en el hero con overlay degradado; nunca detrás de
  texto largo (un intento así fue revertido, ver `Memory.md`).
- Contraste WCAG AA, foco visible, `prefers-reduced-motion` respetado en toda animación.

## Reglas de trabajo
- **Bilingüe siempre**: todo cambio de contenido o estructura se hace en paralelo en `content/` (ES, raíz)
  y `content-en/` (EN, `/en/`), y en `data/authors/me.yaml` / `data/en/authors/me.yaml`.
- No editar los módulos de HugoBlox: sobrescribir copiando a `layouts/` con la misma ruta, o usar hooks
  (`layouts/_partials/hooks/head-end/*.html`). Bloques propios en `layouts/_partials/hbx/blocks/<id>/block.html`.
- CSS propio en `assets/css/`, cargado con `minify | fingerprint` + SRI (patrón de `legacy-styles.html`).
  Preferir clases propias para componentes nuevos; las utilidades Tailwind nuevas dependen de `hugo_stats.json`.
- No cambiar slugs, rutas de publicaciones/posts ni nombres de archivos en `static/` (enlaces existentes).
- No commitear sin que el usuario lo pida. El PDF del CV en la raíz no se versiona.

## Herramientas y comprobaciones
El Hugo del PATH del sistema es antiguo (0.145) y Go no está en el PATH. Usar las herramientas portables:

```sh
T=/c/Proyectos/webpagepersonal/.migration/tools
export PATH="$T/hugo:$T/golang/go/bin:$T/node/node-v22.23.5-win-x64:$PATH"
npm run dev      # http://localhost:1313/
npm run build    # Hugo 0.170.1 + Pagefind + scripts/verify-build.mjs
```

Antes de dar un cambio por terminado: `npm run build` sin errores y revisión visual de portada ES y EN,
`/experience/`, un post y un proyecto, en oscuro y claro, a 375 px y escritorio.

## Memoria del proyecto
Anota en **`Memory.md`** todo lo que aprendas y no sea obvio leyendo el código: decisiones del usuario,
trampas del tema, rutas de módulos, cosas que fallaron y por qué. Una entrada fechada por aprendizaje.
El diagnóstico y la hoja de ruta están en `DIAGNOSTICO.md`.
