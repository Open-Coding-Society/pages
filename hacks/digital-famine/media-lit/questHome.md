---
layout: post 
tailwind: True
title: Media Literacy Quest
description: >
  Learn about media literacy and help defend Media Literacy Planet from foreign invaders. Build your shield level by completing the modules. 
author: CSP 2025-26
permalink: /digital-famine/media-lit/
breadcrumb: true
lxdData:
  Title: "Mastery of Media Literacy Modules"
  Description: "Complete your Media Literacy journey and unlock your vault and defend your planet!"
  Topics:
    - Title: "Awareness"
      Genre: "Integration"
      Level: 1
      Description: "First line of defense from foreign invaders. To understand media literacy, you first need to become aware of it's subconcious effects"
      Categories: ["Certificate", "Integration", "Achievement"]
      Lessons: "/digital-famine/media-lit/submodule_1/"
      Image: "/images/digital-famine/mediaawareness.png"
      Alt: "Analytics Submodule 1"
    - Title: "Bias Detector"
      Genre: "Integration"
      Level: 2
      Description: "Second line of defense from foreign invaders. The news you read can have underlying biases that you might not even be aware of."
      Categories: ["Certificate", "Integration", "Achievement"]
      Lessons: "/digital-famine/media-lit/submodule_2/"
      Image: "/images/digital-famine/mediabias.png"
      Alt: "Analytics Submodule 2"
    - Title: "Truth Scanner"
      Genre: "Integration"
      Level: 3
      Description: "Third line of defense from foreign invaders. News headlines can seem believable, but are they really?"
      Categories: ["Certificate", "Integration", "Achievement"]
      Lessons: "/digital-famine/media-lit/submodule_3/"
      Image: "/images/digital-famine/radar.png"
      Alt: "Analytics Submodule 3"
    - Title: "Bias Sort"
      Genre: "Integration"
      Level: 4
      Description: "Final line of defense from foreign invaders. Sort the headlines to practice understanding of bias and wording."
      Categories: ["Certificate", "Integration", "Achievement"]
      Lessons: "/digital-famine/media-lit/submodule_4/"
      Image: "/images/digital-famine/Sort.png"
      Alt: "Analytics Submodule 4"
    - Title: "Vault"
      Genre: "Integration"
      Level: 4
      Description: "Enter the vault code with numbers gathered through the mission to get your Media Literacy certificate"
      Categories: ["Certificate", "Integration", "Achievement"]
      Lessons: "/digital-famine/media-lit/submodule_5/"
      Image: "/images/digital-famine/congratulations.png"
      Alt: "Analytics Submodule 5"
---
{%- include tailwind/cs-portfolio-quest_info.html -%}

<style>
/* Galaxy background like Submodule 2 */
body {
  min-height: 100vh;
  background: url('{{ site.baseurl }}/hacks/digital-famine/media-lit/media/assets/spacebackground.jpg') no-repeat center center fixed;
  background-size: cover;
}

/* Optional: overlay for better contrast */
body::before {
  content: '';
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(135deg, rgba(53,62,116,0.6), rgba(147,132,213,0.6));
  z-index: -1;
}
</style>
