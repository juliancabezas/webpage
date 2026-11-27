---
title: ""
type: "landing"
sections:
  -
    block: "hero-orbital"
    id: "hero"
    content:
      username: "me"
      eyebrow: "Earth observation and data science"
      tagline: "Artificial intelligence and data science for the environment"
      text: "I turn satellite, environmental and regulatory data into models, automation and decisions. I lead the Data Science team at Chile's Superintendency of the Environment."
      buttons:
        - text: "Download CV"
          url: "/en/files/cv.pdf"
          primary: true
        - text: "Write to me"
          url: "#contact"
      # Career path in chronological order; draws the hero network (label: label position n|s|e|w).
      route_title: "Career path"
      route:
        - place: "Santiago"
          lat: -33.45
          lon: -70.66
          year: "2010"
          note: "Natural Resources Engineering, Universidad de Chile"
          label: "e"
        - place: "Karlsruhe"
          lat: 49.01
          lon: 8.40
          year: "2016"
          note: "Remote sensing at the Karlsruhe Institute of Technology"
          label: "e"
        - place: "Santiago"
          lat: -33.45
          lon: -70.66
          year: "2018"
          arc: 0.12
          note: "Statistics at INE and FAO"
        - place: "Adelaide"
          lat: -34.93
          lon: 138.60
          year: "2020"
          note: "Master of Data Science and computer vision"
          label: "w"
        - place: "Canberra"
          lat: -35.28
          lon: 149.13
          year: "2020"
          note: "Forest carbon modelling with The Mullion Group"
          label: "n"
        - place: "Santiago"
          lat: -33.45
          lon: -70.66
          year: "2022"
          arc: 0.14
          note: "Data science at the Superintendency of the Environment"
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
      title: "Professional experience"
      username: "me"
      text: "My career combines data science, artificial intelligence and geospatial analysis in Chile, Australia and Germany."
      detail: "Full details of my roles, responsibilities and consultancy work are available in the [Experience section](/en/experience/)."
  -
    block: "collection"
    id: "publications"
    content:
      title: "Selected publications"
      text: "Papers and conference work on remote sensing, wetlands and vegetation dynamics."
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
