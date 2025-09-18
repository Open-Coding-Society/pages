---
layout: post
tailwind: True
title: Onboarding Adventure
description: >
  A guided sequence of hands-on and learning tasks to help you master the frameworks that power our course.
author: John Mortensen
courses: {'csse': {'week': 1}, 'csp': {'week': 1}, 'csa': {'week': 1}}
type: hacks 
permalink: /hacks
lxdData:
  Title: "Learning Experience Designer Home"
  Description: "Explore LxD topics and interactive games to obtain mastery in key oboarding topics... collaboration, design thinking, coding skills, etc."
  Prequisites:
    - title: "Tools Intro"
      link: "/tools"
    - title: "Desktop O/S"
      link: "/tools/os"
  Topics:
    - Title: "Agile Collaboration"
      Genre: "Teamwork"
      Level: 1
      Description: "Learn how to work effectively in coding teams using Agile methods."
      Categories: ["Agile", "Collaboration", "Sprint"]
      Game: "/gamify/end"
      Lessons: "/agile"
      Image: "/images/agile.webp"
      Alt: "Agile Collaboration Game"
    - Title: "Snake Game"
      Genre: "Coding"
      Level: "1"
      Description: "Hands-on choding challenge to change the appearance of the Snake game."
      Categories: ["JavaScript", "Game Play", "Game Coding", "Reptile Life"]
      Game: "/snake"
      Lessons: "/agile/pair_trio"
      Image: "/images/snake.png"
      Alt: "Snake eating Apples"
    - Title: "Debugging Challenge"
      Genre: "Debugging"
      Level: 2
      Description: "Sharpen your debugging skills with real-world coding analysis using inspect."
      Categories: ["Debugging", "Logic", "Code Review"]
      Game: "/snake"
      Lessons: "/snake/debug"
      Image: "/images/debug.png"
    - Title: "Design Thinking"
      Genre: "Creativity"
      Level: 1
      Description: "Practice problem-solving and innovation with design thinking activities."
      Categories: ["Design", "Innovation", "Empathy"]
      Game: "/gamify/adventureGame/"
      Lessons: "/sprints/week1"
      Image: "/images/design_think.png"
      Alt: "Design Thinking"
    - Title: "Calculator"
      Genre: "Coding"
      Level: "1"
      Description: "Hands-on choding challenge to add function to a Calculator."
      Categories: ["JavaScript", "Styling", "Buttons", "Math"]
      Game: "/calculator"
      Lessons: "/calculator/lesson"
      Image: "/images/calculator.png"
      Alt: "Calculator functions"
    - Title: "RPG Game"
      Genre: "Coding"
      Level: "Intermediate"
      Description: "Learn the basics of JS and object oriented programming as you dive deep into the world of game coding. "
      Categories: ["JavaScript", "OOP", "Game Coding", "Marine Life"]
      Game: "/rpg/latest"
      Lessons: "/rpg/latest/lesson"
      Image: "/images/toolkit-nav-buttons/rpg.png"
      Alt: "Underwater RPG Adventure"
    
---

{%- include tailwind/lxd.html -%}
