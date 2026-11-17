---
title: ""
type: "landing"
sections:
  -
    block: "resume-biography-3"
    id: "about"
    content:
      username: "me"
      button:
        text: "Descargar CV · noviembre 2026"
        url: "/files/cv.pdf"
      headings:
        about: "Perfil profesional"
        education: "Formación"
        interests: "Intereses"
    design:
      background:
        gradient_mesh:
          enable: true
      name:
        size: "md"
      avatar:
        size: "medium"
        shape: "circle"
  -
    block: "markdown"
    id: "experience-summary"
    content:
      title: "Experiencia profesional"
      text: |
        Mi trayectoria combina **ciencia de datos, inteligencia artificial y análisis geoespacial** aplicados al medio ambiente, con experiencia en instituciones públicas, investigación y empresas de Chile, Australia y Alemania.

        Desde 2022 coordino el equipo de Ciencia de Datos de la **Superintendencia del Medio Ambiente (SMA)**, donde desarrollo soluciones de automatización, análisis y validación de datos para el seguimiento y la fiscalización ambiental con R, Python y SQL.

        Anteriormente trabajé en visión por computador para robótica agrícola en **Flux Robotics**, modelamiento de carbono forestal en **The Mullion Group**, análisis espacial y cambio climático en la **FAO**, estadística y minería de texto en el **Instituto Nacional de Estadísticas**, y teledetección de la vegetación en el **Karlsruhe Institute of Technology (KIT)**.

        El detalle de mis cargos, responsabilidades y consultorías está en la [sección de Experiencia](/experience/).
    design:
      columns: "1"
  -
    block: "collection"
    id: "publications"
    content:
      title: "Publicaciones seleccionadas"
      text: "Algo de mi trabajo científico"
      count: 10
      filters:
        folders:
          - "publication"
    design:
      view: "citation"
  -
    block: "collection"
    id: "posts"
    content:
      title: "Posts y tutoriales"
      count: 10
      filters:
        folders:
          - "post"
    design:
      view: "article-grid"
      columns: 2
  -
    block: "collection"
    id: "projects"
    content:
      title: "Proyectos"
      count: 10
      filters:
        folders:
          - "project"
    design:
      view: "card"
      columns: 2
  -
    block: "markdown"
    id: "contact"
    content:
      title: "Contacto"
      text: "¡Contáctame para colaborar o conversar sobre oportunidades de trabajo!\n\n[Correo electrónico](mailto:juliancabezas@gmail.com) · [LinkedIn](https://www.linkedin.com/in/juliancabezas) · [GitHub](https://github.com/juliancabezas)"
    design:
      columns: "1"
---
