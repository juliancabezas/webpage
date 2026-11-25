---
title: ""
type: "landing"
sections:
  -
    block: "hero-orbital"
    id: "hero"
    content:
      username: "me"
      eyebrow: "Observación de la Tierra · Ciencia de datos"
      tagline: "Inteligencia artificial y ciencia de datos para el medio ambiente"
      text: "Convierto datos satelitales, ambientales y regulatorios en modelos, automatizaciones y decisiones. Coordino el equipo de Ciencia de Datos de la Superintendencia del Medio Ambiente de Chile."
      scroll_label: "Ir al perfil"
      buttons:
        - text: "Ver perfil"
          url: "#about"
          primary: true
        - text: "Descargar CV"
          url: "/files/cv.pdf"
        - text: "Contacto"
          url: "#contact"
      telemetry:
        - label: "Base"
          value: "Santiago, Chile"
        - label: "Foco"
          value: "IA · Medio ambiente"
        - label: "Stack"
          value: "R · Python · SQL"
        - label: "Territorios"
          value: "CL · AU · DE"
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
