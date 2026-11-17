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
