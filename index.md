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

<!-- Mobile Controls -->
<div id="controls">
  <button data-dir="up">▲</button>
  <div class="middle">
    <button data-dir="left">◀</button>
    <button data-dir="down">▼</button>
    <button data-dir="right">▶</button>
  </div>
</div>

<!-- ================= STYLES ================= -->

<style>
body {
  background-color: black;
}

/* Prevent touch behavior only on game elements */
#mario,
#controls,
#controls button {
  touch-action: none;
}


  .sprite {
    height: {{pixels}}px;
    width: {{pixels}}px;
    background-image: url('{{sprite_file}}');
    background-repeat: no-repeat;
    position: absolute;
    z-index: 1001;
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

  /* ================= MOBILE CONTROLS ================= */

  #controls {
    position: fixed;
    bottom: 20px;
    left: 20px;
    z-index: 2000;
    user-select: none;
  }

  #controls .middle {
    display: flex;
    justify-content: center;
  }

  #controls button {
    width: 60px;
    height: 60px;
    margin: 6px;
    font-size: 24px;
    border-radius: 12px;
    border: none;
    background: rgba(255, 255, 255, 0.15);
    color: white;
    backdrop-filter: blur(6px);
  }

  #controls button:active {
    background: rgba(255, 255, 255, 0.35);
  }
  #controls {
  display: none;
}

@media (max-width: 768px) {
  #controls {
    display: block;
  }
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
    fogCtx.fillStyle = "rgba(0,0,0,0.6)";
    fogCtx.fillRect(0, 0, fogCanvas.width, fogCanvas.height);
  }

  window.addEventListener("resize", resizeFog);

  //////////////////// MARIO CLASS ////////////////////

  class Mario {
    constructor(meta) {
      this.meta = meta;
      this.el = document.getElementById("mario");
      this.pixels = {{pixels}};
      this.positionX = 0;
      this.positionY = 200;
      this.frame = 0;
      this.interval = 16;
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
        hole.cx = rect.left + rect.width / 2;
        hole.cy = rect.top + rect.height / 2;
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

  //////////////////// FOG HOLE ////////////////////

  const hole = {
    cx: 0,
    cy: 0,
    radius: 0,
    targetRadius: 0,
    expanding: false,
    startTime: null,
    duration: 6000
  };

  function drawFogWithHole() {
    fogCtx.globalCompositeOperation = 'source-over';
    fogCtx.fillStyle = 'rgba(0,0,0,0.6)';
    fogCtx.fillRect(0, 0, fogCanvas.width, fogCanvas.height);

    const grad = fogCtx.createRadialGradient(
      hole.cx, hole.cy, hole.radius * 0.2,
      hole.cx, hole.cy, hole.radius
    );

    grad.addColorStop(0, 'rgba(0,0,0,1)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');

    fogCtx.globalCompositeOperation = 'destination-out';
    fogCtx.fillStyle = grad;
    fogCtx.fillRect(0, 0, fogCanvas.width, fogCanvas.height);
    fogCtx.globalCompositeOperation = 'source-over';
  }

  function animateFog(ts) {
    if (!hole.startTime) hole.startTime = ts;
    const p = Math.min(1, (ts - hole.startTime) / hole.duration);
    hole.radius = hole.targetRadius * p;
    drawFogWithHole();
    if (p < 1) requestAnimationFrame(animateFog);
    else fogCanvas.style.display = 'none';
  }

  //////////////////// INPUT (KEYBOARD + TOUCH) ////////////////////

  const keys = { left: false, right: false, up: false, down: false };

  function updateMovement() {
    const dx = (keys.right ? 5 : 0) + (keys.left ? -5 : 0);
    const dy = (keys.down ? 5 : 0) + (keys.up ? -5 : 0);

    if (!dx && !dy) {
      mario.stop();
      return;
    }

    mario.start(keys.left && !keys.right ? "WalkL" : "Walk", dx, dy);
  }

  window.addEventListener("keydown", e => {
    switch (e.key.toLowerCase()) {
      case "a":
      case "arrowleft": keys.left = true; break;
      case "d":
      case "arrowright": keys.right = true; break;
      case "w":
      case "arrowup": keys.up = true; break;
      case "s":
      case "arrowdown": keys.down = true; break;
    }
    updateMovement();
  });

  window.addEventListener("keyup", e => {
    switch (e.key.toLowerCase()) {
      case "a":
      case "arrowleft": keys.left = false; break;
      case "d":
      case "arrowright": keys.right = false; break;
      case "w":
      case "arrowup": keys.up = false; break;
      case "s":
      case "arrowdown": keys.down = false; break;
    }
    updateMovement();
  });

document.querySelectorAll("#controls button").forEach(btn => {
  const dir = btn.dataset.dir;

  btn.addEventListener("pointerdown", e => {
    e.preventDefault();
    keys[dir] = true;
    updateMovement();
  });

  btn.addEventListener("pointerup", () => {
    keys[dir] = false;
    updateMovement();
  });

  btn.addEventListener("pointercancel", () => {
    keys[dir] = false;
    updateMovement();
  });

  btn.addEventListener("pointerleave", () => {
    keys[dir] = false;
    updateMovement();
  });
});


  //////////////////// INIT ////////////////////

  document.addEventListener("DOMContentLoaded", () => {
    resizeFog();
    mario.el.style.transform = `scale(${0.2 * (window.devicePixelRatio || 1)})`;
    mario.start("Rest");

    const rect = mario.el.getBoundingClientRect();
    hole.cx = rect.left + rect.width / 2;
    hole.cy = rect.top + rect.height / 2;
    hole.targetRadius = Math.hypot(fogCanvas.width, fogCanvas.height);
    requestAnimationFrame(animateFog);
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

### Project-based learning (PBL)

> Conventional learning, such as tests, is used only for diagnostic purposes, allowing students to make corrections before grading. In AP or Articulated courses, tests are also used to establish standing against College Board or community college requirements.

In PBL, student progress and understanding are assessed continuously through project checkpoints, analytics, teacher observation, and verbal discussions, both individually and within teams.

Learning begins with instructor-created materials, including schema foundations, project-starter code, project requirements, and ongoing support.

Student grades are primarily based on project work, time invested, engagement, learned concepts, participation with peers, project analytics, and live reviews between student(s) and instructor.

These are sample indicators of success:

- Performing Agile/Scrum methodologies to promote iterative improvement  
- Coding, frontend, backend, DevOps, version control, and algorithmic thinking  
- Creativity, research, design, data structures, and responsible use of AI  
- Teamwork, communication, collaboration, and peer reviews/grading  
- Technical communication through project presentations and student-led teaching

### Time Breakdown

Instructor is extremely focused on work, routines, and culture established in the classroom.

> If individuals, groups, and teams use class time effectively, homework will generally not be assigned.

- Learning objectives are scheduled over a Sprint
- Sprints last 2–4 weeks
- Classroom work is 4+ hours per week, including weeks with Pro-Grow, Parent Conferences, or other shortened school instruction time.
  - Make the most of every opportunity in class
  - Balance technical work with collaboration and team activities
- Homework can be 1–2 hours per week, primarily to prepare for classroom and team work
  - Review materials discussed in class
  - Mentally prepare for the next day (e.g., update issues or Kanban)
  - Complete additional preparation if you miss class, fall behind, or have upcoming live reviews

### Make-up Policy

Instructor believes absences disrupt work culture and routines.

- Communicate absences in advance with the instructor and team members
- Make a plan to recreate the situation or work missed in class
- Do not disrupt class to make up missed work; be responsible by coordinating with peers or the instructor during office hours

> Students are expected to be in class, similar to workplace expectations.

- Make-up work is challenging for everyone, not just the student who missed class
- Time lost in class is difficult to recover, since individuals work closely with teams, lead lessons, or participate in live reviews
- The instructor reserves the right to adjust instruction during the week according to classroom needs; the schedule is typically adjusted week by week
- Modalities of instruction are flexible to support different learning styles and may go beyond published materials

![ccr]({{site.baseurl}}/images/course-brag/ccr.png)

## Computer Science and Software Engineering (CSSE) 1,2; Grades 9-12

CSSE 1,2 prepares students for the AP Computer Science pathway. This course focuses on teaching the JavaScript programming language, object-oriented programming and inheritance, and developing algorithmic thinking skills.

> Through game development projects, students will engage in engineering skills, learn fundamentals of programming, work with data structures, and foster collaboration skills with their peers. Tech talks conducted by teachers and students introduce concepts, provide guidance on tools, and support ideas to establish development requirements. By performing development and exploration, this course raises students' awareness of the tremendous capabilities of computers and software engineering skills across various fields.

- Prerequisites: None
- Meets UC/CSU G requirements
- CSSE 1,2 receives Articulated College Credit to Mira Costa CC CS 111: "Introduction to Computer Science". Mira Costa CC requires and provides free registration to receive UC college credit.

![csse]({{site.baseurl}}/images/course-brag/csse.png)

## Computer Science Principles 1,2 and Data Structures 1; Grades 10-12

Computer Science Principles is designed as a college-level introduction to computer science. The AP Computer Science Principles curriculum is integrated into this course, covering creative development, data, algorithms and programming, computer systems and networks, and the impact of computing.

> Students work on individual and team projects to build computer systems, write algorithms, analyze for correctness, and engage in discussions about solutions. The course establishes fluency in Python, utilizes prerequisite knowledge in JavaScript, and develops fluency in Linux.

- Prerequisites:
  - Rising 10th graders: Computer Science and Software Engineering (CSSE)
  - Rising 11th–12th graders: GPA above 3.5 and prior experience with JavaScript or other programming languages, including familiarity with version control using GitHub, basic Linux command-line operations, and development in VSCode or a similar IDE.
  - Meets UC/CSU G requirements, also an alternate for 3rd year D requirement

> Data Structures 1 serves as the third trimester for the Computer Science Principles course. It is the capstone for non-computer science majors/minors and prepares other students to complete the PUSD computer science pathway. Data Structures 1 focuses on creating computer projects in small groups, with the instructor serving as a guide rather than a director, and includes AP review and AP project time.

Through Open Coding Society–supported project guidelines and tracking, students engage in authentic educational or technical projects that may include industry- or community-informed problem contexts, as available. Projects emphasize iterative development using principles from **agile-scrum methodologies** and **design-based research**, with multiple refinement cycles leading to a functional prototype suitable for a business client, educational use, or contribution to Open Coding Society initiatives.

The course utilizes **JavaScript and Python languages, the Flask framework and supporting libraries, SQL databases, and object-oriented programming paradigms**. Topics covered include graphical user interfaces, input and output, lists, dictionaries, databases, searching, sorting, and algorithm analysis.

- Prerequisites: AP Computer Science Principles 1,2; Data Structures 1
- Meets UC/CSU G requirements

![csp]({{site.baseurl}}/images/course-brag/csp24.png)

## Computer Science "A" 1,2 and Data Structures 2; Grades 11-12

AP Computer Science A is an in-depth course focusing on programming, algorithms, and data structures. The AP Computer Science 'A' curriculum is integrated into this course, covering the Java programming language and topics such as fundamentals of programming, using objects, writing classes, arrays, array lists, 2D arrays, inheritance, and recursion.

> Students gain understanding through analysis, coding, and individual and team projects. The course establishes fluency in Java, builds on JavaScript skills, and incorporates Linux usage.

- **Prerequisites:** Rising 11th or 12th grader
  - AP Computer Science Principles 1,2 and Data Structures 1
  - Or teacher recommendation, with expectation of understanding JavaScript, Python, OOP, Linux, and Data Structures; foundation in team projects, awareness of agile methodology, design-based research, and GitHub source control
- Meets UC/CSU G requirements, also an alternate for 4th year C requirement

> Data Structures 2 serves as the third trimester for the Computer Science “A” course and is the **course-level capstone** for AP Computer Science A. This course builds directly on previously defined pathway knowledge, **advancing former personal or group ideas** into more robust systems guided by clearer requirements, enhanced algorithmic solutions, and testing for performance, reliability, and reuse. In parallel, the course includes AP preparation for College Board multiple-choice questions (MCQs) and free-response questions (FRQs).

Through Open Coding Society–supported project guidelines and tracking, teams define, refine, and extend prior work to address sponsor-informed or system-defined requirements, as available. Projects may advance a prototype in response to **direct stakeholder feedback**, support production services, or contribute to a deployed system or Open Coding Society initiative. These projects emphasize **technology growth, authentic problems, and meaningful stakeholder engagement**.

The course utilizes **Java with the Spring framework**, with the option to also use **Python with Flask**, or combine both environments as appropriate, to instruct object-oriented programming, system design, and abstraction. Topics covered include searching, sorting, hashing, algorithm analysis, collections, lists, stacks, queues, trees, sets, dictionaries, and graphs.

- Prerequisites: AP Computer Science ‘A’ 1,2  
- Meets UC/CSU G requirements  
- Data Structures 1,2 receives Articulated College Credit to Mira Costa CC for "CS 113: Basic Data Structures and Algorithms". Mira Costa CC requires and provides free registration to receive UC college credit.

![csa]({{site.baseurl}}/images/course-brag/csa24.png)

## Computer Science "H" 1,2 (12th grade)

Computer Science "H" is a **year-long, senior-only, interdisciplinary honors course**, serving as the **Pathway Capstone** aligned with CTE and PLTW capstone expectations.

> This course functions as a high school senior thesis and a **culminating honors experience**, emphasizing professional collaboration, technical documentation, public presentation, and the development of a fully realized solution to a real-world problem.

Students work in teams to identify a real-world problem, conduct research, design and prototype a solution, and present their work to an external audience. The project integrates computer science with related disciplines such as engineering, biomedical science, or other applied fields. Team members may contribute through thesis or project components from their respective disciplines to support interdisciplinary work.

- **Prerequisites for Computer Science students:** Completion of AP Computer Science A 1,2 and Data Structures 1,2 (or teacher recommendation), with demonstrated proficiency in:
  - Programming in Java and/or Python
  - Object-oriented programming and algorithmic problem solving
  - Version control and collaborative workflows using GitHub
  - Linux command-line navigation and scripting
  - Development in VSCode or a similar IDE
  - Participation in team-based projects and iterative development cycles (e.g., agile methodologies, design-based research)

- **Optional prerequisites for Engineering, Biomedical Science, or other applied discipline students:** Defined by their program advisement and aligned with PLTW course expectations.

> Student projects are tracked and guided using Open Coding Society–supported project guidelines, including enrollment, issue tracking, and iterative review cycles, ensuring progress is documented and supported across disciplines.

This capstone emphasizes creating a **student-designed solution to a real-world problem**, integrating computer science with other applied fields while highlighting professional collaboration, technical documentation, and public presentation.
