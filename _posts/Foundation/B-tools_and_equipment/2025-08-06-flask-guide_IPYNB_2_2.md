---
toc: True
layout: post
data: flask
title: Flask and Backend UIs
description: A Holistic Overview of Flask and Backend Operations
categories: ['Python Flask']
permalink: /flask-overview
menu: nav/flask.html
author: Risha Guha
breadcrumb: True 
---

# Flask, Postman, and Backend UIs

**Focus of this Blog:** Backend fundamentals + real-world application via a demo project

---

## 1. Why This Lesson Matters

Most modern apps talk to a backend. This is where user data lives, permissions are handled, and logic runs.

Students often focus on frontend or visuals. Teaching backend logic introduces them to the engine under the hood.

Knowing how to build and test APIs will help students build real, connected applications.

---

## 2. Core Concepts

### Flask (Python Web Framework)

Flask helps turn Python code into web-accessible endpoints (APIs).

**Key ideas:**

- `@app.route()` is how you define an endpoint (like a URL)
- HTTP methods (`GET`, `POST`, `PUT`, `DELETE`)
- JSON is the main format used to send/receive data

**Example:**

```python
@app.route('/user', methods=['POST'])
def create_user():
    data = request.json
    # Save to database
    return {'message': 'User created'}, 201
```

---

### Postman (API Testing Tool)

Postman lets you send requests to your API without needing a full frontend.

**Students and teachers should show how to:**

- Send a `POST` request with JSON
- View the response (status codes, error messages)
- Chain requests: e.g., login → get token → access protected route

---

### Backend UI (Internal Tools / Dashboards)

Often used by admins, teachers, or managers to interact with the backend directly.

**Can include:**

- Tables of users
- Buttons to delete/update
- Calendar views, etc.

Helps bridge the gap between “just APIs” and a full application.

---

## 3. Project Demo (Main Activity)

### What We Demo-ed:

A real, running backend system using Flask that supports:

- User registration & login (with optional token auth)
- Calendar API: create, list, delete events
- Issues API: submit and track feedback/issues
- Backend UI: simple dashboard that pulls data from these APIs

### Suggested Tinkering Extensions for Teachers:

**Use Postman to:**

- Register a user
- Log in, get back a token
- Create a calendar event
- Submit an issue

**Switch to the backend UI and show:**

- The user now appears in the dashboard
- Events and issues are visible/editable
- *Optional:* Edit something in the UI and check if it reflects when you query via Postman again

---

## 4. Key Messages to Pass to Your Students

- You don’t always need a frontend to test things; APIs can be tested standalone.
- A well-structured backend separates logic from presentation. It’s clean, scalable, and reusable.
- Backend UIs are very helpful and make your systems usable by real people.

---

## 5. Tips for Teaching Backend Logic

- Start with teaching the logic behind Postman and backend requests
- Let students build one route at a time and test it as they go.
- Encourage debugging with print statements/logs.
- Keep the UI simple (e.g., a table of users, or just a form) to focus on function over form.

---

## 6. Wrap-Up

**Recap:** Flask handles routes and logic, Postman helps test, backend UI makes it usable.

**Provide access to:**

- The Flask codebase
- A ready-to-import Postman collection
- Simple UI templates or examples

**Optional challenge:** Let students extend the backend with one more API (e.g., notes, assignments)

---

## Try It Yourself!

Ready to dive in?

We’ve set up a simple Flask starter repo to help you explore everything you learned in this recap. It includes:

- A working backend with user registration, calendar, and issue APIs
- Sample Postman collection to test endpoints
- A basic backend UI to view and manage data

 **[View the Flask Starter Repo](https://github.com/Open-Coding-Society/flask)**

### How to Get Started

1. **Clone the Repo:**

   ```bash
   git clone https://github.com/Open-Coding-Society/flask.git
   cd flask
   ```

2. **Install Dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

3. **Initialize and Run the Server:**

   ```bash
   python scripts/db_init.py
   python __init__.py
   python main.py
   ```

4. **Test with Postman or Visit the UI:**

   - Try hitting the endpoints or log in to the localhost UI using Postman

### 🙌 Bonus Challenge

Try adding your own API route — maybe for notes, assignments, or anything else! Then use Postman to test it.

---

## Flask Survival Sprint

Quick challenge to prove you understand Flask backend basics:

R2D2 just intercepted corrupted API traffic from the backend control room. The system is seconds away from failing route checks.
Only one person can stabilize it in time: you.
Rush to R2D2, answer the Flask quiz correctly, and restore the server before the timer expires.

- Move with WASD or arrow keys.
- Walk to the Quiz Gatekeeper and press e.
- Answer Flask/API questions fast.
- Wrong answer or timeout ends the run.

{% capture flask_survival_challenge %}
Flask Survival Sprint

Reach the gatekeeper and press e to start.
You have 35 seconds total to clear the quiz.
Any wrong answer or timeout = eliminated.
{% endcapture %}

{% capture flask_survival_code %}
import GameControl from '/assets/js/GameEnginev1.1/essentials/GameControl.js';
import GameEnvBackground from '/assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1.1/essentials/Player.js';
import Npc from '/assets/js/GameEnginev1.1/essentials/Npc.js';

class FlaskSurvivalSprint {
   constructor(gameEnv) {
      const width = gameEnv.innerWidth;
      const height = gameEnv.innerHeight;
      const path = gameEnv.path;

      const sprint = {
         started: false,
         completed: false,
         startAt: 0,
         timeLimitMs: 35000
      };
      let storySeen = false;

      const rounds = [
         {
                question: '1) In Flask, which decorator defines a route?',
                options: ['A) @app.route()', 'B) @flask.path()', 'C) @request.route()', 'D) @endpoint()'],
            answer: 'A',
            reason: 'Flask endpoints are defined with @app.route().' 
         },
         {
                question: '2) Which method is typically used to create a new resource?',
                options: ['A) GET', 'B) POST', 'C) DELETE', 'D) PATCH'],
            answer: 'B',
            reason: 'POST is used to create server resources.'
         },
         {
                question: '3) A successful creation often returns which status code?',
                options: ['A) 200', 'B) 204', 'C) 201', 'D) 404'],
            answer: 'C',
            reason: '201 Created is the common response for successful creation.'
         },
         {
                question: '4) How do you usually access JSON body data in Flask?',
                options: ['A) request.body', 'B) request.payload', 'C) request.json', 'D) flask.json()'],
            answer: 'C',
            reason: 'request.json is commonly used to parse JSON payloads.'
         },
         {
                question: '5) Which status code usually means endpoint/resource not found?',
                options: ['A) 401', 'B) 403', 'C) 404', 'D) 500'],
            answer: 'C',
            reason: '404 Not Found means the route or resource does not exist.'
         }
      ];

         function ensureQuizStyles() {
            if (document.getElementById('flask-sprint-quiz-style')) return;
            const style = document.createElement('style');
            style.id = 'flask-sprint-quiz-style';
            style.textContent = [
               '.flask-quiz-overlay { position: absolute; inset: 0; background: rgba(8,12,22,0.8); z-index: 30; display: flex; align-items: center; justify-content: center; padding: 16px; }',
               '.flask-quiz-card { width: min(560px, 96%); background: #0f172a; border: 2px solid #60a5fa; border-radius: 12px; color: #f8fafc; padding: 16px; box-shadow: 0 16px 40px rgba(0,0,0,0.45); }',
               '.flask-quiz-card h4 { margin: 0 0 6px 0; color: #93c5fd; }',
               '.flask-quiz-time { margin: 0 0 10px 0; color: #fde68a; font-weight: 700; }',
               '.flask-quiz-q { margin: 0 0 10px 0; font-size: 1rem; }',
               '.flask-quiz-options { display: grid; gap: 8px; }',
               '.flask-quiz-option { border: 1px solid #334155; border-radius: 8px; background: #1e293b; color: #f8fafc; padding: 10px; text-align: left; cursor: pointer; }',
               '.flask-quiz-option:hover { background: #334155; border-color: #60a5fa; }',
               '.flask-quiz-note { margin-top: 12px; color: #cbd5e1; font-size: 0.9rem; }',
               '.flask-quiz-action { margin-top: 12px; border: none; border-radius: 8px; background: #2563eb; color: #fff; padding: 9px 12px; cursor: pointer; font-weight: 700; }',
               '.flask-quiz-action:hover { background: #1d4ed8; }',
               '.flask-fail-flash { position: absolute; inset: 0; z-index: 80; pointer-events: none; background: #fff; animation: flaskFailFlash 520ms ease-out forwards; }',
               '@keyframes flaskFailFlash { 0% { opacity: 0; filter: brightness(1); } 20% { opacity: 1; filter: brightness(4); } 100% { opacity: 0; filter: brightness(1); } }'
            ].join('');
            document.head.appendChild(style);
         }

         function getQuizHost() {
            const output = document.querySelector('#game-runner-flask-survival-sprint .game-output');
            if (output) {
               output.style.position = 'relative';
               return output;
            }
            return document.body;
         }

         function showRoundModal(round, remainingSec) {
            ensureQuizStyles();
            return new Promise((resolve) => {
               const host = getQuizHost();
               const overlay = document.createElement('div');
               overlay.className = 'flask-quiz-overlay';
               let settled = false;

               const card = document.createElement('div');
               card.className = 'flask-quiz-card';
               card.innerHTML = '<h4>Flask Survival Sprint</h4>' +
                  '<p class="flask-quiz-time">Time left: ' + remainingSec + 's</p>' +
                  '<p class="flask-quiz-q">' + round.question + '</p>';
               const timeLabel = card.querySelector('.flask-quiz-time');

               const timer = setInterval(() => {
                  remainingSec -= 1;
                  if (timeLabel) timeLabel.textContent = 'Time left: ' + Math.max(remainingSec, 0) + 's';
                  if (remainingSec <= 0 && !settled) {
                     settled = true;
                     clearInterval(timer);
                     overlay.remove();
                     resolve(null);
                  }
               }, 1000);

               const options = document.createElement('div');
               options.className = 'flask-quiz-options';

               ['A', 'B', 'C', 'D'].forEach((letter, idx) => {
                  const button = document.createElement('button');
                  button.className = 'flask-quiz-option';
                  button.textContent = round.options[idx];
                  button.addEventListener('click', () => {
                     if (settled) return;
                     settled = true;
                     clearInterval(timer);
                     overlay.remove();
                     resolve(letter);
                  });
                  options.appendChild(button);
               });

               const note = document.createElement('p');
               note.className = 'flask-quiz-note';
               note.textContent = 'Click an answer. Close or refresh counts as a failed run.';

               card.appendChild(options);
               card.appendChild(note);
               overlay.appendChild(card);
               host.appendChild(overlay);
            });
         }

         function showMessageModal(title, message, onClose) {
            ensureQuizStyles();
            const host = getQuizHost();
            const overlay = document.createElement('div');
            overlay.className = 'flask-quiz-overlay';
            const card = document.createElement('div');
            card.className = 'flask-quiz-card';
            card.innerHTML = '<h4>' + title + '</h4><p class="flask-quiz-q">' + message + '</p>';
            const btn = document.createElement('button');
            btn.className = 'flask-quiz-action';
            btn.textContent = 'Continue';
            btn.addEventListener('click', () => {
               overlay.remove();
               if (onClose) onClose();
            });
            card.appendChild(btn);
            overlay.appendChild(card);
            host.appendChild(overlay);
         }

         function showStoryModal(onStart) {
            ensureQuizStyles();
            const host = getQuizHost();
            const overlay = document.createElement('div');
            overlay.className = 'flask-quiz-overlay';
            const card = document.createElement('div');
            card.className = 'flask-quiz-card';
            card.innerHTML =
               '<h4>Mission Briefing</h4>' +
               '<p class="flask-quiz-q">R2D2 intercepted corrupted backend traffic. Flask route checks are failing and the API gateway is collapsing.</p>' +
               '<p class="flask-quiz-q">You have one shot to stabilize the system by clearing this sprint quiz before lockout.</p>';
            const btn = document.createElement('button');
            btn.className = 'flask-quiz-action';
            btn.textContent = 'Start Quiz';
            btn.addEventListener('click', () => {
               overlay.remove();
               if (onStart) onStart();
            });
            card.appendChild(btn);
            overlay.appendChild(card);
            host.appendChild(overlay);
         }

      function stopActiveGame() {
         const stopBtn = document.querySelector('.game-runner-container .stopBtn:not([disabled])');
         if (stopBtn) stopBtn.click();
      }

      function eliminate(message) {
         showMessageModal('ELIMINATED', message + ' Try again.', stopActiveGame);
      }

      function flashFailAndStop() {
         const host = getQuizHost();
         const flash = document.createElement('div');
         flash.className = 'flask-fail-flash';
         host.appendChild(flash);
         setTimeout(() => {
            if (flash.parentNode) flash.remove();
            stopActiveGame();
         }, 540);
      }

      async function runSprintQuiz() {
         if (!storySeen) {
            showStoryModal(async () => {
               storySeen = true;
               await runSprintQuiz();
            });
            return;
         }

         if (sprint.completed) {
            showMessageModal('Already Cleared', 'You already survived this sprint.');
            return;
         }

         if (!sprint.started) {
            sprint.started = true;
            sprint.startAt = Date.now();
         }

         for (let i = 0; i < rounds.length; i++) {
            const elapsed = Date.now() - sprint.startAt;
            const remainingMs = sprint.timeLimitMs - elapsed;
            if (remainingMs <= 0) {
               eliminate('Time expired.');
               return;
            }

            const remainingSec = Math.ceil(remainingMs / 1000);
            const round = rounds[i];
            const input = await showRoundModal(round, remainingSec);

            if (input === null) {
               eliminate('Time expired.');
               return;
            }

            if (Date.now() - sprint.startAt > sprint.timeLimitMs) {
               eliminate('Too slow.');
               return;
            }

            const answer = String(input || '').trim().toUpperCase();
            if (answer !== round.answer) {
               const metric = document.querySelector('[id$="-metric"]');
               if (metric) metric.textContent = 'Eliminated on Q' + (i + 1);
               flashFailAndStop();
               return;
            }
         }

         sprint.completed = true;
         const metric = document.querySelector('[id$="-metric"]');
         if (metric) metric.textContent = 'Flask Sprint Cleared';
         showMessageModal('ACCESS GRANTED', 'You cleared the Flask Survival Sprint.');
      }

      const bgData = {
         name: 'flask_sprint_bg',
         greeting: 'Reach the gatekeeper and clear the Flask quiz.',
         src: path + '/images/gamify/nightowl-background.png',
         pixels: { height: 580, width: 1038 }
      };

      const playerData = {
         id: 'Backend Runner',
         greeting: 'I am ready to prove my Flask skills.',
         src: path + '/images/gamify/chillguy.png',
         SCALE_FACTOR: 5,
         STEP_FACTOR: 1000,
         ANIMATION_RATE: 50,
         INIT_POSITION: { x: 40, y: height - (height / 5) },
         pixels: { height: 384, width: 512 },
         orientation: { rows: 3, columns: 4 },
         down: { row: 0, start: 0, columns: 3 },
         downRight: { row: 1, start: 0, columns: 3, rotate: Math.PI / 16 },
         downLeft: { row: 2, start: 0, columns: 3, rotate: -Math.PI / 16 },
         left: { row: 2, start: 0, columns: 3 },
         right: { row: 1, start: 0, columns: 3 },
         up: { row: 3, start: 0, columns: 3 },
         upLeft: { row: 2, start: 0, columns: 3, rotate: Math.PI / 16 },
         upRight: { row: 1, start: 0, columns: 3, rotate: -Math.PI / 16 },
         hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
         keypress: { up: 87, left: 65, down: 83, right: 68 }
      };

      const gatekeeperData = {
         id: 'Flask Gatekeeper',
         greeting: 'Press e to begin your 35-second Flask sprint.',
         src: path + '/images/gamify/r2_idle.png',
         SCALE_FACTOR: 8,
         ANIMATION_RATE: 100,
         pixels: { width: 505, height: 223 },
         INIT_POSITION: { x: width * 0.4, y: height * 0.72 },
         orientation: { rows: 1, columns: 3 },
         down: { row: 0, start: 0, columns: 3 },
         hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
         interact: function() { runSprintQuiz(); },
         reaction: function() {
            if (this.dialogueSystem) this.showReactionDialogue();
         },
         dialogues: [
            'One sprint. No retries in this run.',
            'Wrong answer or timeout eliminates you.',
            'Press e when ready.'
         ]
      };

      this.classes = [
         { class: GameEnvBackground, data: bgData },
         { class: Player, data: playerData },
         { class: Npc, data: gatekeeperData }
      ];
   }
}

export const gameLevelClasses = [FlaskSurvivalSprint];
export { GameControl };
{% endcapture %}

{% include game-runner.html
    runner_id="flask-survival-sprint"
    challenge=flask_survival_challenge
    code=flask_survival_code
    hide_edit="true"
%}

---

**Let us know what you build!**

Tag us on GitHub or submit an issue to share your progress and achievements! 