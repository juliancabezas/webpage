---
title: ""
type: "landing"
sections:
  -
    block: "hero-orbital"
    id: "hero"
    content:
      username: "me"
      eyebrow: "Observación de la Tierra y ciencia de datos"
      tagline: "Inteligencia artificial y ciencia de datos para el medio ambiente"
      text: "Convierto datos satelitales, ambientales y regulatorios en modelos, automatizaciones y decisiones. Coordino el equipo de Ciencia de Datos de la Superintendencia del Medio Ambiente de Chile."
      buttons:
        - text: "Descargar CV"
          url: "/files/cv.pdf"
          primary: true
        - text: "Escribirme"
          url: "#contact"
      # Trayectoria en orden cronológico; dibuja la red del hero (label: posición de la etiqueta n|s|e|w).
      route_title: "Trayectoria"
      route:
        - place: "Santiago"
          lat: -33.45
          lon: -70.66
          year: "2010"
          note: "Ingeniería en Recursos Naturales, Universidad de Chile"
          label: "e"
        - place: "Karlsruhe"
          lat: 49.01
          lon: 8.40
          year: "2016"
          note: "Teledetección en el Karlsruhe Institute of Technology"
          label: "e"
        - place: "Santiago"
          lat: -33.45
          lon: -70.66
          year: "2018"
          arc: 0.12
          note: "Estadística en el INE y la FAO"
        - place: "Adelaide"
          lat: -34.93
          lon: 138.60
          year: "2020"
          note: "Máster en Ciencia de Datos y visión por computador"
          label: "w"
        - place: "Canberra"
          lat: -35.28
          lon: 149.13
          year: "2020"
          note: "Modelamiento de carbono forestal con The Mullion Group"
          label: "n"
        - place: "Santiago"
          lat: -33.45
          lon: -70.66
          year: "2022"
          arc: 0.14
          note: "Ciencia de datos en la Superintendencia del Medio Ambiente"
  -
    block: "resume-biography-3"
    id: "about"
    content:
      username: "me"
      button:
        text: "Descargar CV (noviembre 2026)"
        url: "/files/cv.pdf"
      headings:
        about: "Perfil profesional"
        education: "Formación"
        interests: "Intereses"
    design:
      background:
        gradient_mesh:
          enable: false
      name:
        size: "md"
      avatar:
        size: "medium"
        shape: "circle"
  -
    block: "experience-summary"
    id: "experience-summary"
    content:
      title: "Experiencia profesional"
      username: "me"
      text: "Mi trayectoria combina ciencia de datos, inteligencia artificial y análisis geoespacial en Chile, Australia y Alemania."
      detail: "El detalle de mis cargos, responsabilidades y consultorías está en la [sección de Experiencia](/experience/)."
  -
    block: "collection"
    id: "publications"
    content:
      title: "Publicaciones seleccionadas"
      text: "Artículos y presentaciones sobre teledetección, humedales y dinámica de la vegetación."
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
      text: "Documentación técnica en inglés."
      count: 10
      filters:
        folders:
          - "project"
    design:
      view: "card"
      columns: 2
  -
    block: "contact-info"
    id: "contact"
    content:
      title: "Contacto"
      subtitle: "¿Tienes una propuesta de colaboración, una consulta o una oportunidad de trabajo?"
      username: "me"
      visit_title: "Ubicación"
      address:
        lines:
          - "Santiago, Chile"
      connect_title: "Conversemos"
      text: "¿Tienes una propuesta de colaboración, una consulta o una oportunidad de trabajo? Envíame un mensaje."
      email: "juliancabezas@gmail.com"
      social:
        - icon: "brands/linkedin"
          url: "https://www.linkedin.com/in/juliancabezas"
          label: "LinkedIn"
        - icon: "brands/github"
          url: "https://github.com/juliancabezas"
          label: "GitHub"
        - icon: "academicons/google-scholar"
          url: "https://scholar.google.com/citations?user=SzsXwHQAAAAJ&hl=es"
          label: "Google Scholar"
      show_form: true
      form_action: "https://formsubmit.co/juliancabezas@gmail.com"
---
