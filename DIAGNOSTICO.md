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
