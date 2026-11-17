# Sitio personal de Julián Cabezas Peña

Sitio estático en español, migrado de Academic/blogdown a
[HugoBlox Academic CV](https://github.com/HugoBlox/hugo-theme-academic-cv).
Dominio de producción: <https://www.juliancabezas.com/>.

## Requisitos

| Herramienta | Versión fijada |
| --- | --- |
| [Hugo](https://github.com/gohugoio/hugo/releases/tag/v0.170.1) | **0.170.1**, última estable verificada el 17 de noviembre de 2026 |
| Node.js | 22.23.5 |
| Go | 1.27.4 |
| Gestor de paquetes | npm, incluido en Node.js |

Instalar Hugo, Node y Go y agregarlos al `PATH`. Git es necesario para resolver
los módulos de Hugo. Las dependencias del tema están fijadas en `go.mod`/`go.sum`
y las de JavaScript en `package-lock.json`. No se necesita R para compilar.

## Desarrollo y comprobaciones

```sh
npm ci
npm run dev
```

Abrir <http://localhost:1313/>. La búsqueda necesita el índice de Pagefind,
que se genera con la compilación de producción.

```sh
npm run build
```

Este comando exige la versión fijada de Hugo, limpia la salida anterior, genera
el sitio optimizado, crea el índice de búsqueda y ejecuta las comprobaciones de
rutas, recursos y enlaces internos. El resultado queda en `public/`.
Para repetir solo las comprobaciones: `npm run verify`.

Prueba de una vista previa de Netlify, en PowerShell:

```powershell
$env:CONTEXT = 'deploy-preview'
$env:DEPLOY_PRIME_URL = 'https://mi-preview.netlify.app'
npm run build
Remove-Item Env:CONTEXT, Env:DEPLOY_PRIME_URL
```

Las vistas previas usan su propia URL, llevan `noindex` y bloquean el rastreo en
`robots.txt`. No incluyen borradores ni publicaciones futuras.

## Estructura y edición

- `config/_default/`: configuración de Hugo, identidad, navegación y módulos.
- `data/authors/me.yaml`: biografía, estudios, experiencia y enlaces del autor.
- `assets/media/authors/me.jpg`: fotografía de perfil.
- `content/_index.md`: bloques de la portada; `content/experience.md`: experiencia.
- `content/publication/`: cuatro publicaciones con metadatos estructurados.
- `content/post/`: tres tutoriales. Sus cuerpos conservan el HTML de blogdown
  dentro de archivos Markdown; los `.Rmd` originales se conservan como fuentes.
  Editar el `.md` publicado: regenerar con blogdown puede crear un `.html`
  duplicado que debe integrarse antes de compilar.
- `content/project/GCBM/`: dos proyectos con informes externos de Power BI.
- `static/img/` y `static/files/`: imágenes y documentos con sus rutas originales.
  `static/files/cv.pdf` contiene el CV de ciencia de datos de noviembre de 2026 y usa un nombre estable para
  evitar diferencias de mayúsculas en los enlaces del tema.
- `layouts/`: compatibilidad para HTML incrustado y cabeceras de Netlify.
- `scripts/`: compilación y validaciones de la migración.

Se conservan los slugs de artículos y publicaciones, los PDF y las imágenes. Las
fichas de inicio, formación y experiencia se actualizaron a partir de
`CV_Julian_Cabezas_Spanish_112026_DataScience.pdf`. Los períodos de formación
conservan la precisión anual del CV; los empleos se muestran por mes y año.
Se retiraron el tema antiguo, su caché y las páginas de demostración (charla,
diapositivas y tutorial de ejemplo). Pueden recuperarse del historial de Git.

## Despliegue en Netlify

1. En Netlify, importar `juliancabezas/webpage` desde GitHub o abrir el proyecto
   existente. Para probar esta migración, habilitar un despliegue de la rama
   `migration/hugo-netlify`; mantener la rama de producción existente hasta
   revisar el resultado.
2. Mantener vacío el **Base directory**. `netlify.toml` define **Build command**:
   `npm run build`, y **Publish directory**: `public`.
3. Netlify leerá las versiones de Hugo, Node y Go del archivo de configuración e
   instalará las dependencias de `package-lock.json`. No hacen falta secretos
   para compilar. Si el proyecto conserva variables antiguas de Hugo o comandos
   de blogdown, retirarlos o alinearlos con `netlify.toml`.
4. Revisar la vista previa y, cuando corresponda, integrar la rama en la rama de
   producción. Conservar `www.juliancabezas.com` como dominio principal. Para otro
   dominio, actualizar `baseURL` en `config/_default/hugo.yaml`.

El comando selecciona `DEPLOY_PRIME_URL` en vistas previas y despliegues de rama;
en producción utiliza el dominio canónico configurado. Se generan `_headers`,
`_redirects`, sitemap, RSS y un índice de búsqueda en español.

Disqus conserva el identificador original. La antigua propiedad Universal
Analytics (`UA-…`) ya no se utiliza: si se desea analítica, configurar un
identificador GA4 real en `hugoblox.analytics.google.measurement_id`.

El contenido incrustado de Power BI, Disqus, el sitio en inglés y las imágenes
externas dependen de sus respectivos servicios. La compilación local no verifica
su disponibilidad ni modifica la configuración de la cuenta de Netlify o el DNS.

## Widget de contacto y correo

Inicio utiliza el bloque oficial [Contact Info de HugoBlox](https://hugoblox.com/blocks/contact-info),
con ubicación, correo, enlaces sociales y su formulario integrado de nombre,
correo, asunto y mensaje. La configuración está en el bloque `contact-info` de
`content/_index.md`; no hay una copia local de la plantilla del widget.

HugoBlox presenta el formulario, pero el envío de correo necesita un servicio
receptor. `show_form: true` y `form_action: https://formsubmit.co/juliancabezas@gmail.com`
lo conectan con **FormSubmit**, sin usar Netlify Forms, claves API ni variables
secretas. Los datos se envían directamente a FormSubmit por HTTPS, y el servicio
gestiona la comprobación antispam y la página de confirmación.

Un script pequeño añade el campo `_next` del servicio con la URL absoluta
`/gracias/` del dominio actual. Así el retorno funciona en el dominio de prueba,
las vistas previas y producción. La página de confirmación no se indexa. Si el
navegador no ejecuta JavaScript, FormSubmit utiliza su propia confirmación.

Para activar la recepción:

1. Desplegar la rama con el widget y enviar un primer mensaje desde el sitio
   publicado. FormSubmit solicitará confirmar el correo destinatario.
2. Abrir el correo de activación recibido en **juliancabezas@gmail.com** y confirmar
   la dirección; revisar spam si no aparece.
3. Enviar otro mensaje y comprobar su recepción. El campo `email` permite responder
   al remitente desde el correo recibido.

La compilación comprueba el formulario, el receptor y sus campos, pero no envía
mensajes ni verifica la entrega. Para cambiar de receptor, actualizar `form_action`
con la URL válida del servicio elegido. No habilitar Netlify Forms para este widget.

Referencia del servicio: [documentación de FormSubmit](https://formsubmit.co/documentation).

## Referencias

- [Configuración de Hugo en Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/hugo/)
- [Documentación de HugoBlox](https://docs.hugoblox.com/)
- Licencia MIT de la plantilla: `LICENSE-HugoBlox.md`.
