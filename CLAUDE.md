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
  - Primario cian `#22d3ee` (claro: `#0e7490`), acento bosque `#34d399` (claro: `#047857`). Todo texto en claro ≥ 4,5:1.
- **Tipografía** (`data/fonts/orbital.yaml`): *IBM Plex Sans* para títulos y lectura, *IBM Plex Mono* solo para datos
  reales (fechas, coordenadas, código). Escala 1,25 en tokens `--orb-step-*`.
- **Elemento memorable**: el hero con la trayectoria como red geográfica (front matter `route`), que se dibuja una vez
  al cargar. Lo llamativo vive ahí; el resto es sobrio.
- **Contención** (revisión con la skill `frontend-design`, ver `DIAGNOSTICO.md`): sin numeración `// 0N` en secciones
  (no son secuencia), sin mayúsculas con tracking en etiquetas, sin metadatos unidos con `·`, sin texto con degradado,
  sin animaciones infinitas. Brillo y esquinas HUD solo en lo que es "actual" (cargo vigente). Vidrio moderado en tarjetas.
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
