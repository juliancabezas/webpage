---
title: ""
type: "landing"
sections:
  -
    block: "hero-orbital"
    id: "hero"
    content:
      username: "me"
      eyebrow: "Científico de datos en la Superintendencia del Medio Ambiente"
      tagline: "Inteligencia artificial y ciencia de datos aplicadas al medio ambiente"
      text: "Diseño modelos de machine learning, automatizaciones y algoritmos de validación que convierten datos en decisiones. Coordino el equipo de Ciencia de Datos de la Superintendencia del Medio Ambiente de Chile."
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
          note: "Algoritmos de series de tiempo en el Karlsruhe Institute of Technology"
          label: "e"
        - place: "Santiago"
          lat: -33.45
          lon: -70.66
          year: "2018"
          arc: 0.12
          note: "Estadística y minería de texto en el INE; análisis de datos para la FAO"
        - place: "Adelaide"
          lat: -34.93
          lon: 138.60
          year: "2020"
          note: "Máster en Ciencia de Datos; deep learning y visión por computador"
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
      text: "Mi trayectoria combina inteligencia artificial, ciencia de datos y estadística aplicadas a problemas ambientales, en Chile, Australia y Alemania."
      detail: "El detalle de mis cargos, responsabilidades y consultorías está en la [sección de Experiencia](/experience/)."
  -
    block: "collection"
    id: "publications"
    content:
      title: "Publicaciones seleccionadas"
      text: "Investigación con modelos estadísticos y machine learning sobre humedales, carbono y dinámica de la vegetación."
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
      text: "Tutoriales de R para trabajar con bases de datos más grandes que la memoria y paralelizar cálculos."
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
