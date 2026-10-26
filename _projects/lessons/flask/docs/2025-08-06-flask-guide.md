---
toc: true
layout: post
codemirror: true
data: flask
title: Flask, REST Client, and Backend UIs
description: Learn how Flask routes turn Python into API endpoints, test them with the VS Code REST Client, and see how backend UIs let people manage data.
categories:
- Python
- flask
permalink: "/flask/overview"
author: Risha Guha
breadcrumb: true
lesson_group: Flask
---

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

### REST Client (API Testing in VS Code)

Install **REST Client** by Huachao Mao and open the Flask backend repository.
Select its `local` environment, then open `api/user_auth.http` and
`api/user_crud.http`. Choose **Send Request** above one request at a time and
inspect the response status, headers, and body.

**Students and teachers should show how to:**

- Send a `POST` request with JSON
- View the response (status codes, error messages)
- Authenticate through the prompted login request, then use the remembered
  response cookie for protected requests on the same host
- Select `baseUrl` through the backend's REST Client environment settings

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

- Jokes: `hacks/joke.py` and file-backed data in `hacks/jokes.py`
- Users: `api/user.py` and `model/user.py`, including authentication
- Microblog: `api/microblog_api.py` and `model/microblog.py`
- Backend UI: server-rendered Jinja templates for administration

### Suggested Tinkering Extensions for Teachers:

**Use REST Client to:**

- Read `/api/jokes/count` and `/api/jokes` without authentication
- Authenticate with `api/user_auth.http`, then inspect `/api/id`
- Read `/api/microblog?limit=5` with the authenticated cookie
- Send an authenticated empty-content microblog request and inspect its
  validation error without creating a post

**Switch to the backend UI and show:**

- The user now appears in the dashboard
- Compare displayed backend data with the JSON returned by API requests
- *Optional:* Edit something in the UI and check if it reflects when you query via REST Client again

---

## 4. Key Messages to Pass to Your Students

- You don’t always need a frontend to test things; APIs can be tested standalone.
- A well-structured backend separates logic from presentation. It’s clean, scalable, and reusable.
- Backend UIs are very helpful and make your systems usable by real people.

---

## 5. Tips for Teaching Backend Logic

- Start with teaching the logic behind REST Client and backend requests
- Let students build one route at a time and test it as they go.
- Encourage debugging with print statements/logs.
- Keep the UI simple (e.g., a table of users, or just a form) to focus on function over form.

---

## 6. Wrap-Up

**Recap:** Flask handles routes and logic, REST Client helps test, backend UI makes it usable.

**Provide access to:**

- The Flask codebase
- Version-controlled `.http` request files without committed credentials
- Simple UI templates or examples

**Optional challenge:** Let students extend the backend with one more API (e.g., notes, assignments)

**Configure and Run the Server:**

  Follow the backend README for local configuration. Database reset is a
  separate, potentially destructive operation: inspect `scripts/db_init.py`
  and its backup requirements with your teacher rather than running it as a
  routine startup command.

   ```bash
   python main.py
   ```

**Test with REST Client or Visit the UI:**

- Select the local environment and send a request from an `.http` file.
- The full user CRUD sequence requires Admin access. Use a disposable UID,
    set `kasm_server_needed` to `false` unless provisioning is intended, and
    stop before Update/Delete if test-user creation did not succeed.
- Read the [Flask API learning path]({{ site.baseurl }}/python/flask/api)
    for the jokes, user, and microblog request examples.

### 🙌 Bonus Challenge

Try adding your own API route — maybe for notes, assignments, or anything else! Then use REST Client to test it.

---

## Flask Knowledge Check (UI Runner)

{% capture challenge_flask_ui %}
Build a Flask Incident Simulator in outputElement.
1) Start with a mission briefing.
2) Respond to backend incidents that keep growing.
3) Track timer, system integrity, threat level, and streak.
4) Each correct action adds a brand-new incident.
5) Wrong actions hurt integrity and can trigger failure.
{% endcapture %}

{% capture code_flask_ui %}
outputElement.innerHTML = '';

const seedIncidents = [
  {
    q: 'Incident 1: New users cannot register. Which endpoint signature should exist?',
    options: ['@app.route("/register", methods=["POST"])', '@app.register("/register")', '@route.post("/register")'],
    answer: 0,
    success: 'Registration route restored.',
    fail: 'Clients still get 404 on register.'
  },
  {
    q: 'Incident 2: API key leaked in logs. Best immediate fix?',
    options: ['Move secrets to environment variables', 'Commit a new key directly to code', 'Print all headers for debugging'],
    answer: 0,
    success: 'Secrets moved out of source.',
    fail: 'Sensitive data exposure risk increased.'
  },
  {
    q: 'Incident 3: POST /user creates records but returns 200. Better status code?',
    options: ['404', '201', '500'],
    answer: 1,
    success: 'Client contract now matches REST conventions.',
    fail: 'Clients cannot reliably detect creation events.'
  },
  {
    q: 'Incident 4: Handler crashes on JSON parsing. Which Flask attribute helps?',
    options: ['request.payload', 'request.json', 'flask.requestBody'],
    answer: 1,
    success: 'Request body parsing stabilized.',
    fail: 'Malformed request handling remains broken.'
  },
  {
    q: 'Incident 5: Protected route is open to everyone. What should you add?',
    options: ['Authentication/authorization checks', 'More print statements', 'A random sleep timer'],
    answer: 0,
    success: 'Access controls enforced.',
    fail: 'Unauthorized access continues.'
  }
];

const bonusIncidentTemplates = [
  {
    q: 'Incident X: Endpoint allows any origin. Best mitigation?',
    options: ['Configure CORS safely for trusted origins', 'Disable browser security', 'Expose wildcard plus credentials everywhere'],
    answer: 0,
    success: 'Cross-origin policy tightened.',
    fail: 'Cross-origin attack surface widened.'
  },
  {
    q: 'Incident X: Login endpoint is brute-forced. Best immediate defense?',
    options: ['Rate limit and lockout strategy', 'Return stack traces for each attempt', 'Allow unlimited retries'],
    answer: 0,
    success: 'Abuse rate dropped under control.',
    fail: 'Credential stuffing pressure increased.'
  },
  {
    q: 'Incident X: Health checks pass but DB is timing out. Better response?',
    options: ['Add retries with timeout and fallback handling', 'Ignore all DB errors', 'Restart client each query'],
    answer: 0,
    success: 'Database recovery behavior improved.',
    fail: 'Timeout storms continue.'
  },
  {
    q: 'Incident X: Clients send invalid payloads repeatedly. Best API hardening?',
    options: ['Validate schema and return clear 4xx errors', 'Auto-correct unknown fields silently', 'Accept all payloads and hope downstream handles it'],
    answer: 0,
    success: 'Input validation now blocks bad payloads.',
    fail: 'Invalid data keeps polluting requests.'
  }
];

let incidents = [];

const totalMs = 45000;
let index = 0;
let endTime = 0;
let timer = null;
let integrity = 100;
let threat = 20;
let score = 0;
let streak = 0;
let resolved = 0;

const panel = document.createElement('div');
panel.style.maxWidth = '760px';
panel.style.margin = '0 auto';
panel.style.padding = '1rem';
panel.style.border = '1px solid #475569';
panel.style.borderRadius = '10px';
panel.style.background = '#0f172a';
panel.style.color = '#e2e8f0';

const title = document.createElement('h4');
title.textContent = 'Flask Incident Simulator';
panel.appendChild(title);

const intro = document.createElement('p');
intro.textContent = 'Backend alerts are firing. Resolve incidents before threat reaches critical.';
panel.appendChild(intro);

const startBtn = document.createElement('button');
startBtn.textContent = 'Begin Incident Run';
startBtn.style.padding = '0.5rem 0.75rem';
startBtn.style.borderRadius = '8px';
startBtn.style.border = '1px solid #2563eb';
startBtn.style.background = '#2563eb';
startBtn.style.color = '#f8fafc';
startBtn.style.cursor = 'pointer';
panel.appendChild(startBtn);

const questionEl = document.createElement('p');
questionEl.style.marginTop = '0.9rem';
questionEl.style.fontWeight = '700';

const optionsWrap = document.createElement('div');

const dashboard = document.createElement('div');
dashboard.style.display = 'grid';
dashboard.style.gridTemplateColumns = 'repeat(2, minmax(140px, 1fr))';
dashboard.style.gap = '0.45rem';
dashboard.style.marginTop = '0.7rem';

const timerEl = document.createElement('p');
const integrityEl = document.createElement('p');
const threatEl = document.createElement('p');
const streakEl = document.createElement('p');

[timerEl, integrityEl, threatEl, streakEl].forEach((el) => {
  el.style.margin = '0';
  el.style.padding = '0.35rem 0.45rem';
  el.style.border = '1px solid #334155';
  el.style.borderRadius = '8px';
  el.style.background = '#111827';
});

dashboard.appendChild(timerEl);
dashboard.appendChild(integrityEl);
dashboard.appendChild(threatEl);
dashboard.appendChild(streakEl);

const meterWrap = document.createElement('div');
meterWrap.style.marginTop = '0.7rem';

const meterLabel = document.createElement('p');
meterLabel.textContent = 'Threat Meter';
meterLabel.style.margin = '0 0 0.25rem 0';
meterWrap.appendChild(meterLabel);

const meterTrack = document.createElement('div');
meterTrack.style.height = '10px';
meterTrack.style.borderRadius = '999px';
meterTrack.style.background = '#1f2937';

const meterBar = document.createElement('div');
meterBar.style.height = '10px';
meterBar.style.width = '0%';
meterBar.style.borderRadius = '999px';
meterBar.style.background = '#f59e0b';
meterTrack.appendChild(meterBar);
meterWrap.appendChild(meterTrack);

const logTitle = document.createElement('p');
logTitle.textContent = 'Ops Log';
logTitle.style.margin = '0.8rem 0 0.3rem 0';
logTitle.style.fontWeight = '700';

const logEl = document.createElement('div');
logEl.style.padding = '0.5rem';
logEl.style.border = '1px solid #334155';
logEl.style.borderRadius = '8px';
logEl.style.background = '#020617';
logEl.style.fontFamily = 'monospace';
logEl.style.fontSize = '0.9rem';
logEl.style.maxHeight = '120px';
logEl.style.overflowY = 'auto';

const statusEl = document.createElement('p');
statusEl.style.marginTop = '0.8rem';
statusEl.style.fontWeight = '700';

panel.appendChild(dashboard);
panel.appendChild(questionEl);
panel.appendChild(optionsWrap);
panel.appendChild(meterWrap);
panel.appendChild(logTitle);
panel.appendChild(logEl);
panel.appendChild(statusEl);

outputElement.appendChild(panel);

function log(message) {
  const row = document.createElement('div');
  row.textContent = message;
  logEl.prepend(row);
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function updateHUD() {
  const left = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
  timerEl.textContent = 'Time: ' + left + 's';
  timerEl.style.color = left <= 10 ? '#fca5a5' : '#fde68a';
  integrityEl.textContent = 'Integrity: ' + integrity;
  threatEl.textContent = 'Threat: ' + threat;
  streakEl.textContent = 'Streak: ' + streak + ' | Score: ' + score + ' | Cleared: ' + resolved;
  meterBar.style.width = clamp(threat, 0, 100) + '%';
  meterBar.style.background = threat >= 75 ? '#ef4444' : threat >= 45 ? '#f59e0b' : '#22c55e';
}

function cloneIncident(incident, n) {
  return {
    q: incident.q.replace('Incident X', 'Incident ' + n),
    options: incident.options.slice(),
    answer: incident.answer,
    success: incident.success,
    fail: incident.fail
  };
}

function addBonusIncident() {
  const template = bonusIncidentTemplates[Math.floor(Math.random() * bonusIncidentTemplates.length)];
  incidents.push(cloneIncident(template, incidents.length + 1));
}

function finish(message, success) {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  questionEl.textContent = '';
  optionsWrap.innerHTML = '';
  statusEl.textContent = message;
  statusEl.style.color = success ? '#22c55e' : '#ef4444';
  startBtn.textContent = 'Run Again';
  startBtn.style.display = 'inline-block';
  updateHUD();
}

function checkFailState() {
  if (Date.now() >= endTime) {
    finish('Shift complete: You held the system with score ' + score + ' after clearing ' + resolved + ' incidents.', true);
    return true;
  }
  if (integrity <= 0) {
    finish('Mission failed: System integrity collapsed.', false);
    return true;
  }
  if (threat >= 100) {
    finish('Mission failed: Threat reached critical level.', false);
    return true;
  }
  return false;
}

function renderIncident() {
  if (index >= incidents.length) addBonusIncident();
  if (checkFailState()) {
    return;
  }

  const current = incidents[index];
  questionEl.textContent = current.q;
  optionsWrap.innerHTML = '';

  current.options.forEach((optionText, i) => {
    const btn = document.createElement('button');
    btn.textContent = optionText;
    btn.style.margin = '0.25rem 0.35rem 0.25rem 0';
    btn.style.padding = '0.45rem 0.7rem';
    btn.style.borderRadius = '8px';
    btn.style.border = '1px solid #475569';
    btn.style.background = '#1e293b';
    btn.style.color = '#f8fafc';
    btn.style.cursor = 'pointer';
    btn.onclick = () => {
      if (i !== current.answer) {
        integrity = clamp(integrity - 25, 0, 100);
        threat = clamp(threat + 30, 0, 100);
        streak = 0;
        score = Math.max(0, score - 5);
        log('ALERT: ' + current.fail);
        updateHUD();
        if (checkFailState()) return;
        index += 1;
        renderIncident();
        return;
      }
      resolved += 1;
      addBonusIncident();
      const timeBonus = streak >= 1 ? 3000 : 0;
      streak += 1;
      score += 20 + streak * 2;
      threat = clamp(threat - 18, 0, 100);
      integrity = clamp(integrity + 6, 0, 100);
      if (timeBonus > 0) {
        endTime += timeBonus;
        log('BONUS: Combo streak added +3s response time.');
      }
      log('OK: ' + current.success);
      updateHUD();
      index += 1;
      renderIncident();
    };
    optionsWrap.appendChild(btn);
  });
}

function updateTimer() {
  updateHUD();
  checkFailState();
}

startBtn.onclick = () => {
  index = 0;
  incidents = seedIncidents.map((incident, i) => cloneIncident(incident, i + 1));
  integrity = 100;
  threat = 20;
  score = 0;
  streak = 0;
  resolved = 0;
  endTime = Date.now() + totalMs;
  statusEl.textContent = '';
  logEl.innerHTML = '';
  log('SYS: Incident run started.');
  startBtn.style.display = 'none';
  updateHUD();
  renderIncident();
  timer = setInterval(updateTimer, 1000);
};
{% endcapture %}

{% include runners/ui.html
   runner_id="flask_ui_check"
   challenge=challenge_flask_ui
   code=code_flask_ui
   height="320px"
  output_height="420px"
%}

---

**Let us know what you build!**

Tag us on GitHub or submit an issue to share your progress and achievements!
