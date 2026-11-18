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
        text: "Download CV (Spanish, November 2026)"
        url: "/en/files/cv.pdf"
      headings:
        about: "Professional profile"
        education: "Education"
        interests: "Interests"
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
    block: "experience-summary"
    id: "experience-summary"
    content:
      title: "Professional experience"
      username: "me"
      text: "My career combines data science, artificial intelligence and geospatial analysis in Chile, Australia and Germany."
      detail: "Full details of my roles, responsibilities and consultancy work are available in the [Experience section](/en/experience/)."
  -
    block: "collection"
    id: "publications"
    content:
      title: "Selected publications"
      text: "Some of my scientific work"
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
      title: "Posts and tutorials"
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
      title: "Projects"
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
      title: "Contact"
      subtitle: "Have a collaboration proposal, a question or a job opportunity?"
      username: "me"
      visit_title: "Location"
      address:
        lines:
          - "Santiago, Chile"
      connect_title: "Get in touch"
      text: "Have a collaboration proposal, a question or a job opportunity? Send me a message."
      email: "juliancabezas@gmail.com"
      social:
        - icon: "brands/linkedin"
          url: "https://www.linkedin.com/in/juliancabezas"
          label: "LinkedIn"
        - icon: "brands/github"
          url: "https://github.com/juliancabezas"
          label: "GitHub"
        - icon: "academicons/google-scholar"
          url: "https://scholar.google.com/citations?user=SzsXwHQAAAAJ&hl=en"
          label: "Google Scholar"
      show_form: true
      form_action: "https://formsubmit.co/juliancabezas@gmail.com"
---
