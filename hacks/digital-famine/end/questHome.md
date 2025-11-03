---
layout: post 
tailwind: True
title: End Quest
description: >
  Finish off the game of DIGITAL FAMINE and bring back knowledge and skills to your home
author: CodeMaxxers
permalink: /digital-famine/end/
breadcrumb: true
show_videos: false
lxdData:
  Title: "End Modules"
  Description: "Fix your ship and return the knoladge found throught your adventure!"
  Topics:
    - Title: "Sus Transmission"
      Genre: "Project Creation"
      Level: 1
      Description: "Look through incomming transmissing and find the non-malicious transmission"
      Categories: ["end", "Flask", "Spring", "Databases", "Microblogging"]
      Lessons: "/digital-famine/end/submodule_1/"
      Image: "/images/digital-famine/Planet1-Scene.jpg"
      Alt: "End Submodule 1"
    - Title: "Alien Cyberattack"
      Genre: "Project Creation"
      Level: 2
      Description: "This submodule will test you on your media literacy! You will need to apply all your knowledge learned in the media literacy planet to identify fake information in a multiple choice style quiz. You will be able to gather all parts needed to fix the information sector of the ship at the end of the quiz."
      Categories: ["end", "Flask", "Spring", "Databases"]
      Lessons: "/digital-famine/end/submodule_2/"
      Image: "/images/digital-famine/end-3.png"
      Alt: "End Submodule 2"
    - Title: "Autopilot Crash"
      Genre: "Project Creation"
      Level: 3
      Description: "Fix the crash of the autopilot element of the rocketship to get home safe."
      Categories: ["end", "Flask", "Spring", "Databases"]
      Lessons: "/digital-famine/end/submodule_3/"
      Image: "/images/digital-famine/Planet3-Scene.png"
      Alt: "end Submodule 3"
    - Title: "Cyber Defense Protocol"
      Genre: "Project Creation"
      Level: 4
      Description: "Apply your cyber skills to navigate the final security systems and restore the lost knowledge of humanity."
      Categories: ["end", "Flask", "Spring", "Databases"]
      Lessons: "/digital-famine/end/submodule_4/"
      Image: "/images/digital-famine/Planet4-Scene.jpg"
      Alt: "end Submodule 4"
    - Title: "Submodule 5"
      Genre: "Project Creation"
      Level: 5
      Description: "Team-defined end development module"
      Categories: ["end", "Flask", "Spring", "Databases"]
      Lessons: "/digital-famine/end/submodule_5/"
      Image: "/images/digital-famine/CrashingRocket.png"
      Alt: "end Submodule 5"
---

{%- include tailwind/quests/digital-famine.html -%}

<script type="module">
  import { initEndModuleProgression } from '{{site.baseurl}}/assets/js/digitalFamine/endModuleProgression.js';
  
  // Initialize progression system for quest home page
  initEndModuleProgression();
</script>
