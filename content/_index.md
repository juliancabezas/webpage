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
        text_color_light: true
        image:
          filename: "satelite4.jpg"
          size: "cover"
          position: "center"
          filters:
            brightness: 0.35
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
