---
layout: post 
feedback: true
hide: true
title: Open Coding Society
description: An Open Pathway to Computer Science
sprite: /images/mario_animation.png
permalink: /
---

<!-- ================= LIQUID SETUP ================= -->

{% assign sprite_file = site.baseurl | append: page.sprite %}
{% assign hash = site.data.mario_metadata %}
{% assign pixels = 256 %}

<!-- ================= GAME ELEMENTS ================= -->

<p id="mario" class="sprite"></p>
<canvas id="fog"></canvas>

<!-- ================= STYLES ================= -->

<style>
  body {
    background-color: black;
  }

  .sprite {
    height: {{pixels}}px;
    width: {{pixels}}px;
    background-image: url('{{sprite_file}}');
    background-repeat: no-repeat;
    position: absolute;
    z-index: 10;
  }

  #mario {
    background-position: 0 0;
  }

  #fog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 999;
  }

  .social-icon {
    filter: invert(1);
  }
</style>

<!-- ================= GAME SCRIPT ================= -->

<script>
  //////////////////// METADATA ////////////////////

  var mario_metadata = {};
  {% for key in hash %}
  mario_metadata["{{key | first}}"] = {
    row: {{key.row}},
    col: {{key.col}},
    frames: {{key.frames}}
  };
  {% endfor %}

  //////////////////// FOG OF WAR ////////////////////

  const fogCanvas = document.getElementById("fog");
  const fogCtx = fogCanvas.getContext("2d");

  function resizeFog() {
    fogCanvas.width = window.innerWidth;
    fogCanvas.height = window.innerHeight;
    fogCtx.fillStyle = "rgba(0,0,0,0.95)";
    fogCtx.fillRect(0, 0, fogCanvas.width, fogCanvas.height);
  }

  function reveal(x, y, radius = 140) {
    fogCtx.globalCompositeOperation = "destination-out";
    const gradient = fogCtx.createRadialGradient(x, y, radius * 0.3, x, y, radius);
    gradient.addColorStop(0, "rgba(0,0,0,1)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    fogCtx.fillStyle = gradient;
    fogCtx.beginPath();
    fogCtx.arc(x, y, radius, 0, Math.PI * 2);
    fogCtx.fill();
    fogCtx.globalCompositeOperation = "source-over";
  }

  window.addEventListener("resize", resizeFog);

  //////////////////// MARIO CLASS ////////////////////

  class Mario {
    constructor(meta) {
      this.meta = meta;
      this.el = document.getElementById("mario");
      this.pixels = {{pixels}};
      this.positionX = 0;
      this.positionY = 200; // starting Y position
      this.speed = 0;
      this.frame = 0;
      this.interval = 100;
      this.timer = null;
    }

animate(state, dx, dy) {
  this.stop();
  const row = state.row * this.pixels;

  this.timer = setInterval(() => {
    const col = (this.frame + state.col) * this.pixels;
    this.el.style.backgroundPosition = `-${col}px -${row}px`;

    this.positionX += dx;
    this.positionY += dy;

    this.el.style.left = `${this.positionX}px`;
    this.el.style.top = `${this.positionY}px`;

    this.frame = (this.frame + 1) % state.frames;

    const rect = this.el.getBoundingClientRect();
    reveal(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }, this.interval);
}


    stop() {
      clearInterval(this.timer);
    }

start(name, dx = 0, dy = 0) {
  this.animate(this.meta[name], dx, dy);
}

  }

  const mario = new Mario(mario_metadata);

  //////////////////// CONTROLS ////////////////////

window.addEventListener("keydown", e => {
  if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;

  switch (e.key.toLowerCase()) {
    case "d":
    case "arrowright":
      mario.start("Walk", 3, 0);
      break;

    case "a":
    case "arrowleft":
      mario.start("WalkL", -3, 0);
      break;

    case "w":
    case "arrowup":
      mario.start("Walk", 0, -3);
      break;

    case "s":
    case "arrowdown":
      mario.start("Walk", 0, 3);
      break;
  }
});



  window.addEventListener("blur", () => mario.stop());

  //////////////////// INIT ////////////////////

  document.addEventListener("DOMContentLoaded", () => {
    resizeFog();
    const scale = window.devicePixelRatio || 1;
    mario.el.style.transform = `scale(${0.2 * scale})`;
    mario.start("Rest", 0);
  });
</script>

<!-- ================= PAGE CONTENT ================= -->
## About

Empower yourself to solve real-world problems, unlock creativity, and open doors to every field—because coding is the language of innovation.

> Invest in your technical skills through Project-based learning.

<div style="display: flex; align-items: flex-start; justify-content: center; gap: 40px; flex-wrap: wrap;">

  <!-- Logo -->
  <div style="text-align: center;">
    <img src="{{site.baseurl}}/images/logo-framed.png" alt="Logo" style="width: 180px; max-width: 100%;">
  </div>

  <!-- QR Code -->
  <div style="text-align: center;">
    <img src="{{site.baseurl}}/images/course-brag/qr.png" alt="QR Code" style="width: 180px; max-width: 100%;">
  </div>

  <!-- Socials -->
  <div style="min-width: 220px;">
    <ul style="list-style: none; padding: 0; font-size: 1.1em;">
      <li>
        <img class="social-icon" src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/gmail.svg" alt="Gmail" style="width: 20px; vertical-align: middle; margin-right: 8px;">
        <a href="mailto:open.coding.society@gmail.com">open.coding.society@gmail.com</a>
      </li>
      <li>
        <img class="social-icon" src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg" alt="LinkedIn" style="width: 20px; vertical-align: middle; margin-right: 8px;">
        <a href="https://linkedin.com/company/open-coding-society" target="_blank">LinkedIn</a>
      </li>
      <li>
        <img class="social-icon" src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/x.svg" alt="X" style="width: 20px; vertical-align: middle; margin-right: 8px;">
        <a href="https://x.com/Open_Coding" target="_blank">@Open_Coding</a>
      </li>
      <li>
        <img class="social-icon" src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/youtube.svg" alt="YouTube" style="width: 20px; vertical-align: middle; margin-right: 8px;">
        <a href="https://www.youtube.com/@OpenCodingSociety" target="_blank">@OpenCodingSociety</a>
      </li>
    </ul>
  </div>
</div>

## Project-based learning

Instructor created projects, project requirements, technical materials, and support.

> Grades are based on projects, time invested, engagement, learned concepts, participation with peers, and live reviews between student(s) and instructor.

- Performing Agile/Scrum development
- Coding, frontend, backend, devops, version control, and using algorithmic thinking
- Creativity, research, design, data structures, and utilizing ChatGPT
- Performing teamwork, team communication and collaboration, peer reviews/grading
- Focus on technical communications through project presentations and student-led teaching

### Time Breakdown

Instructor is extremely focused on work, routines, and culture established in the classroom.

> If individuals, groups and teams, and classroom are effective with class time, homework will not be assigned.

- Learning objectives are scheduled over a Sprint
- Sprints last 2–4 weeks.
- Classroom work is 4+ hours per week.
  - Do not waste time opportunities given.
  - Balance technical time and collaboration time.
- Homework is 1–2 hours per week.  
  - Review materials discussed in class.
  - Mentally prep for next day (ie update issues or kanban).
  - Extra prep should be considered for live reviews.

### Make-up Policy

Instructor believes absences disrupt work culture and routines.

- Communicate absence beforehand with the instructor and team members.
- Make a make-up plan and try to recreate situation missed.

> Instructor believes student is supposed to be in class.  Similar to how an employee is expected to be at work.

- Make-up work is challenging for everyone—not just the person who missed class.
- Time lost in class is extremely hard to make up, since individuals are working with team members, team teaching lessons to the class, or performing live reviews with the teacher.
- Instructor has freedom to adjust instruction during the week according to needs of classroom.  
- Modalities of instruction, for various learning styles, do not stick to published materials only.

![ccr]({{site.baseurl}}/images/course-brag/ccr.png)

## Computer Science and Software Engineering (CSSE) 1,2; Grades 9-12

CSSE 1,2 prepares students for the AP Computer Science pathway. This course focuses on teaching the JavaScript programming language, object-oriented programming and inheritance, and developing algorithmic thinking skills.

> Through game development projects, students will engage in engineering skills, learn fundamentals of programming, work with data structures, and foster collaboration skills with their peers. Tech talks will be conducted by teachers to introduce concepts, provide guidance on tools, and support ideas to establish development requirements. By performing development and exploration, this course aims to raise students' awareness of the tremendous capabilities of computers and software engineering skills across various fields.

- Prerequisites: None
- Meets UC/CSU G requirements
- CSSE 1,2 receives Articulated College Credit to Mira Costa CC CS 111: "Introduction to Computer Science". Mira Costa CC requires and provides free registration to receive UC college credit.

![csse]({{site.baseurl}}/images/course-brag/csse.png)

## Computer Science Principles 1,2 and Data Structures 1; Grades 10-12

Computer Science Principles is designed as a college-level introduction to computer science. The AP Computer Science Principles curriculum is integrated into this course, covering creative development, data, algorithms and programming, computer systems and networks, and the impact of computing.

> Students will work on individual and team projects to build computer systems, write algorithms, analyze for correctness, and engage in discussions about solutions. The course will establish fluency in Python, utilize prerequisite knowledge in JavaScript, and develop fluency in Linux.

- Prerequisites:
  - Rising 10th graders: Computer Science and Software Engineering (CSSE)
  - Rising 11th-12th graders: GPA above 3.5 and expectation of experience with JavaScript or other programming languages
- Meets UC/CSU G requirements, also an alternate for 3rd year D requirement

> Data Structures 1 serves as the third trimester for the Computer Science Principles course. It is the capstone for non-computer science majors/minors and prepares other students to complete the PUSD computer science pathway. Data Structures 1 focuses on creating computer programs independently and includes AP review and AP project time. The course utilizes JavaScript and Python languages to instruct on the imperative and object-oriented programming paradigms. Topics covered include graphical user interfaces, input and output, lists, dictionaries, databases, searching, sorting, and algorithm analysis.

- Prerequisites: AP Computer Science Principles 1,2
- Meets UC/CSU G requirements

![csp]({{site.baseurl}}/images/course-brag/csp24.png)

## Computer Science "A" 1,2 and Data Structures 2; Grades 11-12

AP Computer Science A is an in-depth course that focuses on programming, algorithms, and data structures. The AP Computer Science 'A' curriculum is integrated into this course, which covers the Java programming language and topics such as fundamentals of programming, using objects, writing classes, arrays, array lists, 2D arrays, inheritance, and recursion.

> Students will gain understanding through analysis, coding, and individual and team projects. The course will establish fluency in Java, utilize JavaScript, and work with Linux.

- Prerequisites: a rising 11th or 12th grader
  - AP Computer Science Principles 1,2 and Data Structures 1
  - Or a teacher recommendation with an expectation of understanding JavaScript, OOP, Linux, and Data Structures; foundation in team projects, awareness of agile methodology and GitHub source control.
- Meets UC/CSU G requirements, also an alternate for 4th year C requirement

> Data Structures 2 serves as the third trimester for the Computer Science "A" course and is the capstone for the Del Norte Computer Science Pathway. It is designed as a companion to AP Computer Science 'A'. This course focuses on basic data structures, algorithms, and includes AP preparation for College Board multiple-choice questions (MCQs) and free-response questions (FRQs). The course utilizes the JavaScript and Java languages to instruct on object-oriented programming paradigm programming and design. Topics covered include searching, sorting, hashing, algorithm analysis, collections, lists, stacks, queues, trees, sets, dictionaries, and graphs. The course concludes with team-oriented project-based learning and a final project.

- Prerequisites: AP Computer Science ‘A’ 1,2
- Meets UC/CSU G requirements
- Data Structures 1,2 receives Articulated College Credit to Mira Costa CC for "CS 113: Basic Data Structures and Algorithms". Mira Costa CC requires and provides free registration to receive UC college credit.

![csa]({{site.baseurl}}/images/course-brag/csa24.png)