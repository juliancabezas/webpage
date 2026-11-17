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
        Mi trayectoria combina ciencia de datos, inteligencia artificial y análisis geoespacial en Chile, Australia y Alemania.

        - **Científico de datos y coordinador del equipo de Ciencia de Datos · Superintendencia del Medio Ambiente (SMA)**

          *Febrero de 2022–actualidad · Santiago, Chile.* Coordinación de equipo, automatización y validación de datos para el seguimiento y la fiscalización ambiental con R, Python y SQL.

        - **Machine Learning Engineer · Flux Robotics**

          *Marzo–noviembre de 2021 · Adelaide, Australia · Jornada parcial.* Desarrollo e implementación de modelos de visión por computador con Detectron2 y PyTorch para robótica agrícola.

        - **Profesional en modelamiento de emisiones forestales · The Mullion Group**

          *Marzo de 2020–febrero de 2022 · Canberra, Australia · Jornada parcial.* Implementación del modelo GCBM para estimar emisiones forestales en Chile con R, Python y SQL.

        - **Profesional de apoyo (National Project Personnel) · FAO**

          *Febrero–noviembre de 2019 · Santiago, Chile.* Análisis espacial para la ENCCRV, apoyo al Anexo Técnico de Resultados REDD+ y a la postulación al Fondo Verde del Clima.

        - **Analista estadístico · Instituto Nacional de Estadísticas**

          *Marzo de 2018–enero de 2019 · Santiago, Chile.* Análisis de encuestas con R y SAS y clasificación automática de textos de la Encuesta Nacional de Empleo.

        - **Remote Sensing Scientist · Karlsruhe Institute of Technology (KIT)**

          *Abril de 2016–octubre de 2017 · Karlsruhe, Alemania.* Detección de perturbaciones de la vegetación con series de tiempo Landsat, BFAST y LandTrendR en el proyecto SaMovar.

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
