# Diagnóstico y hoja de ruta — juliancabezas.com

Fecha: 2026-11-25 · Stack: Hugo 0.170.1 + HugoBlox Academic CV (Tailwind 4) · Netlify · ES (`/`) + EN (`/en/`).

## Lo que funciona bien
- Migración limpia desde Academic/blogdown, slugs conservados, build reproducible con versiones fijadas.
- Bilingüe completo, búsqueda con Pagefind, cabeceras de seguridad y `noindex` en previews.
- Contenido sólido: biografía actualizada, experiencia detallada, 4 publicaciones, tutoriales y proyectos GCBM.

## Diagnóstico estético
| # | Hallazgo | Impacto |
|---|----------|---------|
| E1 | Identidad genérica: tema `default` + `teal` y `gradient_mesh` de plantilla; nada evoca satélite, datos o naturaleza. | Alto |
| E2 | Sin hero: la portada abre en la tarjeta de biografía; `satelite4.jpg` sin uso. | Alto |
| E3 | Tipografía `academic` por defecto, sin jerarquía distintiva para títulos, fechas o datos. | Medio |
| E4 | Todas las secciones tienen el mismo tratamiento plano, sin ritmo ni separadores. | Medio |
| E5 | Proyectos GCBM sin imagen destacada (placeholder genérico). | Medio |
| E6 | Footer de plantilla, sin firma propia. | Bajo |

## Diagnóstico funcional
| # | Hallazgo | Impacto |
|---|----------|---------|
| F1 | Hugo del PATH (0.145) ≠ versión exigida (0.170.1) y Go fuera del PATH: el build local falla si no se usan las herramientas portables. | Alto (DX) |
| F2 | Sin imagen social propia (`og:image`/`twitter:card`): se comparte con el icono. | Medio |
| F3 | Navegación: "Inicio" apunta a `/#about`; idioma como ítem "English site" en vez de selector. | Medio |
| F4 | Disqus activo con 3 posts de 2019: peso extra y rastreo de terceros. | Medio |
| F5 | `repository.branch: migration/hugo-netlify` obsoleto (rama de migración). | Bajo |
| F6 | Archivos de RStudio sueltos en la raíz (`.Rhistory`, `helper.R`, `index.Rmd`, `.Rproj`). | Bajo |

## Propuestas (implementadas en esta iteración)
1. **Tema "Orbital"** propio (`data/themes/orbital.yaml`) con la paleta de la imagen: abismo `#030b1a`, cian `#22d3ee`, arrecife `#2dd4bf`, bosque `#34d399`; modo claro `#f4fbfb`/`#06283d`. → E1
2. **Fuentes "Orbital"** (`data/fonts/orbital.yaml`): Space Grotesk / Inter / JetBrains Mono. → E3
3. **Hero orbital** (`layouts/_partials/hbx/blocks/hero-orbital/`): imagen satelital procesada a WebP responsive, overlay degradado, red de nodos SVG animada (respeta reduced-motion), telemetría mono, CTAs a CV y contacto. → E2
4. **Capa visual futurista** (`assets/css/futuristic.css`): etiquetas `// 0N` en títulos de sección, tarjetas HUD con brillo cian, línea de tiempo con nodos en experiencia, navbar de vidrio, scrollbar y selección temáticas. → E4
5. **Footer** con firma "Datos · IA · Territorio" y coordenadas de Santiago. → E6
6. **Imagen destacada** para los proyectos GCBM a partir de la imagen satelital. → E5
7. **SEO social**: `og:image` y `summary_large_image` con la imagen satelital. → F2
8. **Navegación**: "Inicio" → `/`, selector de idioma en la cabecera. → F3
9. **Disqus desactivado**; **rama del repositorio** corregida. → F4, F5
10. `CLAUDE.md` con instrucciones de trabajo y `Memory.md` con aprendizajes. → F1

## Próximos pasos sugeridos
- Mapa interactivo ligero (MapLibre) con proyectos y zonas de trabajo (Los Ríos, Adelaide, Karlsruhe).
- Sección "Proyectos destacados" con métricas (p. ej. ">15 % de los informes de fiscalización de la SMA").
- Nuevos posts sobre IA aplicada a fiscalización ambiental; actualizar los tutoriales de 2019.
- Analítica respetuosa de la privacidad (Plausible o Netlify Analytics) en lugar de Google Analytics.
- Mover los archivos de RStudio a una carpeta `R/` o eliminarlos si ya no se usan blogdown.

## Revisión con la skill `frontend-design` (2026-11-27) — implementada en la rama `design/frontend-review`

Estado: todas las propuestas P0–P4 aplicadas (Q3: numeración reemplazada por un trazo cian corto; T1: IBM Plex Sans + Mono).
Hallazgo adicional durante la implementación: HugoBlox armaba la URL de Google Fonts con comas y Google respondía 400,
así que la fuente de títulos (Space Grotesk) nunca cargó; corregido con un override de `functions/typography.html`.

Revisión del rediseño Orbital (ce30e7b) contra la skill: portada ES/EN, `/experience/`, post `/post/tutorial/`,
proyecto GCBM y 404; oscuro/claro; 375 px y 1440 px. El usuario decide qué se implementa.

**Lectura general.** La dirección (Tierra desde órbita: abismo + cian + bosque) es propia del sujeto y el hero funciona.
El problema es de *dosis*: la skill pide "gastar la audacia en un solo lugar", y hoy el lenguaje HUD se repite en todo
(rejilla de fondo, scanlines, vidrio, esquinas HUD, brillo, `// 0N`, mono en mayúsculas, 4 animaciones infinitas).
Varios recursos coinciden además con los rasgos de diseño generado que la skill enumera: etiquetas mono en mayúsculas
con tracking, metadatos unidos con `·`, numeración `01/02/03` en contenido que no es secuencia, texto con degradado en
el titular y tarjetas idénticas. Parte lo pidió el brief (CLAUDE.md: etiquetas `// 01`, mono de telemetría); ahí manda
el brief, pero se propone afinarlo.

### P0 — Errores funcionales (independientes de la estética)
| # | Cambio | Por qué |
|---|--------|---------|
| F1 | Convertir los `<pre class="r"><code>` de los posts de blogdown en bloques de código Markdown con lenguaje `r` (6 archivos ES/EN, unos 200 bloques). | Goldmark cierra el bloque HTML en la primera línea vacía: los comentarios `# nnodes: …` salen como `<h1>` gigantes dentro del código (9 `h1` falsos en `/post/tutorial/`). Rompe lectura y jerarquía. |
| F2 | Contraste en modo claro: primario `#0891b2` → `#0e7490` (5,1:1, el valor que ya fija CLAUDE.md), bosque `#059669` → `#047857`, arrecife `#0d9488` → `#0f766e`. | Hoy 3,5–3,8:1 sobre `#f4fbfb`/blanco: falla WCAG AA en texto pequeño (`// 01`, fechas, "Actualmente", organización). |
| F3 | Ocultar "En esta página" cuando el índice no tiene enlaces. | En los posts aparece el título con 0 enlaces. |
| F4 | Página 404 con el lenguaje del sitio: mensaje claro, búsqueda y 3 enlaces (Inicio, Posts, Contacto) en lugar de la lista cruda subrayada. | La skill: un error es momento de dar dirección. Hoy es la página menos cuidada. |

### P1 — Concentrar la audacia en el hero
| # | Cambio | Por qué |
|---|--------|---------|
| D1 | **Que la red de nodos signifique algo**: nodos en las posiciones reales (proyección simple) de Santiago, Los Ríos, Adelaide, Canberra y Karlsruhe, unidos en orden cronológico, con lugar y año al pasar o enfocar. La telemetría del hero pasa a ser esa leyenda. | La skill pide abrir con lo más característico del mundo del sujeto. Hoy la red es aleatoria y decorativa; ligada a la trayectoria real es el elemento memorable, y sí es una secuencia. |
| D2 | Una sola animación orquestada: la red se dibuja una vez al cargar (~1,2 s, `stroke-dashoffset`) y queda quieta. Quitar el parpadeo infinito de 15 nodos, el pulso del punto verde y el indicador de scroll animado. | "Un momento orquestado pesa más que efectos dispersos"; lo infinito distrae de leer. |
| D3 | Titular en blanco sólido, sin degradado blanco→cian→verde. | El texto con degradado es un rasgo genérico y resta nitidez; el color ya lo pone la foto. |
| D4 | CTAs: dejar 2 (primario "Descargar CV", secundario "Escribirme") en la tipografía de títulos y en minúsculas normales. Quitar "Ver perfil" (repite el indicador de scroll). | Cada CTA dice exactamente qué pasa; botones mono en mayúsculas son plantilla. |
| D5 | Evitar el nombre duplicado: el hero dice "Julián Cabezas Peña" y la biografía lo repite justo debajo. Opción: en `#about` ocultar o reducir nombre y rol, dejando avatar y redes. | Repetición visible en el primer scroll, sobre todo en móvil. |

### P2 — Silenciar el resto ("quitarse un accesorio")
| # | Cambio | Por qué |
|---|--------|---------|
| Q1 | Quitar la rejilla fija del `body` (o las scanlines del hero; se recomienda la rejilla). | Dos texturas compiten; `background-attachment: fixed` además cuesta repintado en móvil. |
| Q2 | Esquinas HUD y brillo solo en la tarjeta del cargo actual (y opcionalmente un proyecto destacado); el resto con borde sutil sin brillo. | Hoy todas las tarjetas son idénticas. La estructura visual debe codificar información: "esto es lo actual". |
| Q3 | Numeración `// 0N` de secciones: cambiar por una marca no numérica (trazo cian corto) o reservar la telemetría con sentido (lugar/año) para la línea de tiempo. | La skill: números solo si el contenido es secuencia; Publicaciones/Posts/Proyectos/Contacto no lo son. El brief pidió `// 01`: decide el usuario. |
| Q4 | JetBrains Mono solo para datos reales (fechas, coordenadas, código), sin mayúsculas ni tracking ancho; quitarla de botones, eyebrow y firma del pie. | Mono + mayúsculas + tracking en todas partes es el rasgo más reconocible; reservada para datos, gana significado. |
| Q5 | Reducir los `·`: eyebrow "Observación de la Tierra · Ciencia de datos", "IA · Medio ambiente", "R · Python · SQL", "Datos · IA · Territorio", botón "Descargar CV · noviembre 2026". Reescribir como frases o listas reales. | Metadatos con punto medio son plantilla; el botón mezcla acción y fecha (mejor "Descargar CV" con la fecha como texto secundario). |
| Q6 | `/experience/`: las consultorías (`h3` cian grandes con borde) al formato de la línea de tiempo (título normal, año en mono como dato). | Hoy pesan más que los cargos principales; incoherente con la portada. |

### P3 — Tipografía y textos
| # | Cambio | Por qué |
|---|--------|---------|
| T1 | Pasar de 3 familias a 2 claramente distintas. Recomendado: **IBM Plex Sans + IBM Plex Mono** (herencia de instrumentación científica, una superfamilia). Alternativa mínima: quitar Space Grotesk y dejar Inter + JetBrains Mono. | La skill: una o dos familias, elegidas para este proyecto; Space Grotesk + Inter + JetBrains Mono es el trío por defecto de los sitios "tech". |
| T2 | Escala tipográfica explícita (razón ~1,25: 14/16/20/25/31/39/49 px) en tokens `--orb-step-*`; largo de línea ≤ 70 caracteres en biografía y posts. | Hoy cada bloque fija sus tamaños (clamp del hero, `text-3xl` de HugoBlox, `h3` de habilidades). |
| T3 | Textos: "Algo de mi trabajo científico" → algo concreto (p. ej. "Artículos revisados por pares sobre teledetección, humedales y carbono"). Los proyectos GCBM están solo en inglés en el sitio ES: si es intencional, avisarlo con una línea ("Documentación técnica en inglés"). | La skill: el texto es diseño; específico antes que de relleno. |

### P4 — Menores
- Campos del formulario de contacto con los tokens `--orb-*` (hoy grises de Tailwind, fuera de paleta en oscuro).
- Cabecera móvil en dos filas (~95 px): idioma como "ES/EN" y búsqueda dentro del menú para ganar alto.
- Bloques de código con `--orb-surface-solid` y borde `--orb-line` en vez del gris neutro.

### Plan de tokens si se aplica P1–P3
- **Color**: abismo `#030b1a`, superficie `#071a2e`, cian datos `#22d3ee` (claro `#0e7490`), bosque `#34d399`
  (claro `#047857`), hielo `#e6f6fb`. Arrecife queda solo como tono intermedio en la red.
- **Tipo**: Plex Sans (títulos 600, cuerpo 400) + Plex Mono (solo datos).
- **Layout**: hero a sangre con la red-mapa a la derecha y texto a la izquierda; secciones en columna de lectura
  centrada ≤ 72 caracteres; la línea de tiempo es la única estructura con marcadores.
- **Principio**: la audacia vive en el hero (la trayectoria como red geográfica); todo lo demás, sobrio y legible.
