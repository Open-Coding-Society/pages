---
layout: post 
feedback: true
hide: true
title: Open Coding Society
description: An Open Pathway to Computer Science
sprite: /images/mario_animation.png
permalink: /
---

<!-- Liquid:  statements-->

<!--- Concatenation of site URL to frontmatter sprite  --->
{% assign sprite_file = site.baseurl | append: page.sprite %}
<!--- Has is a list variable containing mario metadata for sprite --->
{% assign hash = site.data.mario_metadata %}  
<!--- Size width/height of Sprit images --->
{% assign pixels = 256 %}

<!--- HTML for page contains <p> tag named "Mario" and class properties for a "sprite"  -->

<p id="mario" class="sprite"></p>
  
<!--- Embedded Cascading Style Sheet (CSS) rules, 
        define how HTML elements look 
--->
<style>

  /*CSS style rules for the id and class of the sprite...
  */
  .sprite {
    height: {{pixels}}px;
    width: {{pixels}}px;
    background-image: url('{{sprite_file}}');
    background-repeat: no-repeat;
  }

  /*background position of sprite element
  */
  #mario {
    background-position: calc({{animations[0].col}} * {{pixels}} * -1px) calc({{animations[0].row}} * {{pixels}}* -1px);
  }

  .social-icon {
    filter: invert(1);
  }
</style>

<!--- Embedded executable code--->
<script>
  ////////// convert YML hash to javascript key:value objects /////////

  var mario_metadata = {}; //key, value object
  {% for key in hash %}  
  
  var key = "{{key | first}}"  //key
  var values = {} //values object
  values["row"] = {{key.row}}
  values["col"] = {{key.col}}
  values["frames"] = {{key.frames}}
  mario_metadata[key] = values; //key with values added

  {% endfor %}

  ////////// game object for player /////////

  class Mario {
    constructor(meta_data) {
      this.tID = null;  //capture setInterval() task ID
      this.positionX = 0;  // current position of sprite in X direction
      this.currentSpeed = 0;
      this.marioElement = document.getElementById("mario"); //HTML element of sprite
      this.pixels = {{pixels}}; //pixel offset of images in the sprite, set by liquid constant
      this.interval = 100; //animation time interval
      this.obj = meta_data;
      this.marioElement.style.position = "absolute";
    }

    animate(obj, speed) {
      let frame = 0;
      const row = obj.row * this.pixels;
      this.currentSpeed = speed;

      this.tID = setInterval(() => {
        const col = (frame + obj.col) * this.pixels;
        this.marioElement.style.backgroundPosition = `-${col}px -${row}px`;
        this.marioElement.style.left = `${this.positionX}px`;

        this.positionX += speed;
        frame = (frame + 1) % obj.frames;

        const viewportWidth = window.innerWidth;
        if (this.positionX > viewportWidth - this.pixels) {
          document.documentElement.scrollLeft = this.positionX - viewportWidth + this.pixels;
        }
      }, this.interval);
    }

    startWalking() {
      this.stopAnimate();
      this.animate(this.obj["Walk"], 3);
    }

    startWalkingL() {
      this.stopAnimate();
      this.animate(this.obj["WalkL"], -3);
    }

    startRunning() {
      this.stopAnimate();
      this.animate(this.obj["Run1"], 6);
    }

    startRunningL() {
      this.stopAnimate();
      this.animate(this.obj["Run1L"], -6);
    }

    startPuffing() {
      this.stopAnimate();
      this.animate(this.obj["Puff"], 0);
    }

    startPuffingL() {
      this.stopAnimate();
      this.animate(this.obj["PuffL"], 0);
    }

    startCheering() {
      this.stopAnimate();
      this.animate(this.obj["Cheer"], 0);
    }

    startCheeringL() {
      this.stopAnimate();
      this.animate(this.obj["CheerL"], 0);
    }

    startFlipping() {
      this.stopAnimate();
      this.animate(this.obj["Flip"], 0);
    }

    startFlippingL() {
      this.stopAnimate();
      this.animate(this.obj["FlipL"], 0);
    }

    startResting() {
      this.stopAnimate();
      this.animate(this.obj["Rest"], 0);
    }

    startRestingL() {
      this.stopAnimate();
      this.animate(this.obj["RestL"], 0);
    }

    stopAnimate() {
      clearInterval(this.tID);
    }
  }

  const mario = new Mario(mario_metadata);

  ////////// event control /////////

// Add event listener for keydown event
  window.addEventListener("keydown", (event) => {
      const activeElement = document.activeElement;
      const isTyping = activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA";
      if (isTyping) return; // ✅ Skip game controls while typing in forms

      if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
          event.preventDefault();
          if (event.repeat) {
              mario.startCheering();
          } else {
              if (mario.currentSpeed === 0) {
                  mario.startWalking();
              } else if (mario.currentSpeed === 3) {
                  mario.startRunning();
              }
          }
      } else if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
          event.preventDefault();
          if (event.repeat) {
              mario.startCheeringL();
          } else {
              if (mario.currentSpeed === 0) {
                  mario.startWalkingL();
              } else if (mario.currentSpeed === 3) {
                  mario.startRunningL();
              }
          }
      } else if (event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
          event.preventDefault();
          mario.startFlipping();
      } else if (event.key === "ArrowDown" || event.key === "s" || event.key === "S") {
          event.preventDefault();
          mario.startResting();
      }
  });
  
  // Add event listener for touchstart events
  window.addEventListener("touchstart", (event) => {
      event.preventDefault(); // prevent default browser action
      const touchX = event.touches[0].clientX;
      const screenWidth = window.innerWidth;
      const centerThreshold = screenWidth * 0.1; // 10% of the screen width on either side of the center

      if (touchX > screenWidth / 2 + centerThreshold) {
          // move right
          if (mario.currentSpeed === 0) {
              mario.startWalking();
          } else if (mario.currentSpeed === 3) {
              mario.startRunning();
          }
      } else if (touchX < screenWidth / 2 - centerThreshold) {
          // move left
          if (mario.currentSpeed === 0) {
              mario.startWalkingL();
          } else if (mario.currentSpeed === 3) {
              mario.startRunningL();
          }
      } else {
          // touch near the center, make Mario puff
          mario.startPuffing();
      }
  });

  //stop animation on window blur
  window.addEventListener("blur", () => {
    mario.stopAnimate();
  });

  //start animation on window focus
  window.addEventListener("focus", () => {
     mario.startFlipping();
  });

  //start animation on page load or page refresh
  document.addEventListener("DOMContentLoaded", () => {
    // adjust sprite size for high pixel density devices
    const scale = window.devicePixelRatio;
    const sprite = document.querySelector(".sprite");
    sprite.style.transform = `scale(${0.2 * scale})`;
    mario.startResting();
  });

</script>

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
