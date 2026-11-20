---
microblog: true
toc: false
layout: post
title: OCS-in-a-Kit Capstone
description: Turning Open Coding Society's classroom platform into a school-neutral, installable kit.
permalink: /capstone/ocs-in-a-kit/
sticky_rank: 1
year: "2026-2027"
capstone_project:
  course: CSA
  school_year: "2026-2027"
  title: "OCS-in-a-Kit"
  image: "/images/OCS-Kit-Capstone.png"
  description: "Open Coding Society built a full classroom platform with lessons, a code runner, grading, chat, and hall passes, but it was wired to one school, with names, logins, and settings hard coded in. OCS-in-a-Kit turns that into a product any school or organization can run on its own. An admin picks a kit, answers a few questions, and gets a working copy with no coding required. Vanilla is a basic site with accounts and a blog. Education adds a full CS classroom: lessons, code runner, assignments, grading, an AI tutor, and hall pass. Business drops the classroom features for chat, calendar, and an AI chatbot aimed at organizations. Every kit bundles the same three codebases, a Portfolio frontend plus Flask and Spring backends, and admins can turn individual features on or off later without reinstalling."
  team: "Shayan, Dhyan, Darshan, Jim"
---

{% assign data = site.data.ocs_in_a_kit_infograph %}
<div class="ocs__container" style="max-width: 1400px;">
<div class="ocs__badge">Design-Based Research Capstone</div>
<h1>{{ data.Title }}</h1>
<p class="ocs__description" style="max-width: none; margin: 0 0 1rem;">Open Coding Society's classroom platform, packaged so any school or organization can run their own copy.</p>

<nav class="ocs__capstone-nav">
  <div class="ocs__links ocs__links--wide">
    <a href="#stages" class="ocs__btn pill">Five Stages</a>
    <a href="#problem" class="ocs__btn pill">The Problem</a>
    <a href="#who" class="ocs__btn pill">Who It's For</a>
    <a href="#features" class="ocs__btn pill">What You Get</a>
    <a href="#compare" class="ocs__btn pill">Compare Kits</a>
    <a href="#walkthrough" class="ocs__btn pill">Example</a>
    <a href="#future" class="ocs__btn pill">Future</a>
    <a href="#considerations" class="ocs__btn pill">Considerations</a>
    <a href="#how-its-built" class="ocs__btn pill">How It's Built</a>
    <a href="#versioning" class="ocs__btn pill">Versioning</a>
    <a href="#install" class="ocs__btn pill">install.sh</a>
    <a href="#default-ui" class="ocs__btn pill">Default UIs</a>
  </div>
</nav>

<div class="ocs__card" id="stages">
  <h3 class="ocs__section-title">Five Stages: Start With an Idea, Grow As You Need</h3>
  <p>Each stage builds on the one before.</p>
  <div class="ocs__diagram">
    <pre class="mermaid">flowchart LR
    P[1. Prototype
Explore and learn] --> R[2. Production
Go live with confidence]
    R --> X[3. Extended Services
Add what you need]
    X --> E[4. Education
Teach and inspire]
    E --> B[5. Business
Go further together]</pre>
  </div>
  <div class="ocs__table-wrap">
    <table class="ocs__table">
      <thead><tr><th>Stage</th><th>Status</th><th>What is next</th></tr></thead>
      <tbody>
        <tr><td>1. Prototype</td><td><span class="ocs__status-pill ocs__status-pill--good">Mostly built</span></td><td>Events: admin screen and scrolling ticker (in progress)</td></tr>
        <tr><td>2. Production</td><td><span class="ocs__status-pill ocs__status-pill--warn">Partly built</span></td><td>Docker and nginx setup exist; S3 file storage and backup and restore guides are missing</td></tr>
        <tr><td>3. Extended Services</td><td><span class="ocs__status-pill ocs__status-pill--warn">In progress</span></td><td>Chat (Flask) and calendar (Spring) are in the kits; OCS Email is missing</td></tr>
        <tr><td>4. Education</td><td><span class="ocs__status-pill ocs__status-pill--warn">Needs UI</span></td><td>A default UI for the Education kit</td></tr>
        <tr><td>5. Business</td><td><span class="ocs__status-pill ocs__status-pill--warn">Needs UI</span></td><td>A default UI for the Business kit</td></tr>
      </tbody>
    </table>
  </div>
</div>

<div class="ocs__card" id="problem">
  <h3 class="ocs__section-title">The Problem</h3>
  <p>Open Coding Society built a full classroom platform: lessons, a code runner, grading, chat, hall passes. It's wired to one school, with names, logins, and settings hard-coded in. Other schools had no easy way to use it.</p>
  <p><strong>OCS-in-a-Kit</strong> turns that into a product. Pick what you want, answer a few questions, and get your own working copy. No coding required.</p>
</div>

<div class="ocs__card" id="who">
  <h3 class="ocs__section-title">Who It's For</h3>
  <div class="ocs__table-wrap">
    <table class="ocs__table">
      <thead><tr><th>Kit</th><th>Who picks it</th></tr></thead>
      <tbody>
        <tr><td><strong>Vanilla</strong></td><td>Anyone who wants a basic site for users: accounts, profiles, a blog. Add features later.</td></tr>
        <tr><td><strong>Education</strong></td><td>A teacher or school running a CS classroom: lessons, code runner, assignments, grading, AI tutor, hall pass.</td></tr>
        <tr><td><strong>Business</strong></td><td>A company serving its own members. No classroom features, just chat and posts, calendar, AI chatbot, analytics, profiles.</td></tr>
      </tbody>
    </table>
  </div>
</div>

<div class="ocs__card" id="features">
  <h3 class="ocs__section-title">What You Get</h3>
  <p>Every kit starts with the same core (login, accounts, blog) and adds from there.</p>
  <div class="ocs__keypoints">
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span><strong>Lessons &amp; code runner:</strong> students run Python/JS/Java in the browser</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span><strong>Assignments &amp; grading:</strong> submissions, grades, quizzes, AI feedback</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span><strong>AI chatbot &amp; tutor:</strong> keys stay on the server</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span><strong>Games:</strong> a built-in game engine, leaderboards, multiplayer</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span><strong>Chat, calendar, hall pass:</strong> the day-to-day classroom tools</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span><strong>Extras:</strong> finance simulation, resumes, face login, more</span></div>
  </div>
  <p>Admins can turn any feature on or off later. No reinstall needed.</p>
</div>

<div class="ocs__card" id="compare">
  <h3 class="ocs__section-title">Compare the Kits</h3>
  <p>Every feature in one table. "Add-on" means no kit includes it by default, but an admin can turn it on any time.</p>
  <div class="ocs__table-wrap">
    <table class="ocs__table">
      <thead><tr><th>Feature</th><th>Vanilla</th><th>Education</th><th>Business</th></tr></thead>
      <tbody>
        <tr><td>Login, accounts, blog</td><td>✓</td><td>✓</td><td>✓</td></tr>
        <tr><td>Lessons</td><td></td><td>✓</td><td></td></tr>
        <tr><td>Code runner</td><td></td><td>✓</td><td></td></tr>
        <tr><td>Assignments &amp; grading</td><td></td><td>✓</td><td></td></tr>
        <tr><td>AI grading</td><td></td><td>✓</td><td></td></tr>
        <tr><td>Hall pass</td><td></td><td>✓</td><td></td></tr>
        <tr><td>Game engine</td><td></td><td>✓</td><td></td></tr>
        <tr><td>AI chatbot</td><td></td><td>✓</td><td>✓</td></tr>
        <tr><td>Chat &amp; posts</td><td></td><td>✓</td><td>✓</td></tr>
        <tr><td>Calendar</td><td></td><td>✓</td><td>✓</td></tr>
        <tr><td>Analytics</td><td></td><td>✓</td><td>✓</td></tr>
        <tr><td>Resumes &amp; profiles</td><td></td><td>✓</td><td>✓</td></tr>
        <tr><td>Finance simulation</td><td>Add-on</td><td>Add-on</td><td>Add-on</td></tr>
        <tr><td>Kasm workspaces</td><td>Add-on</td><td>Add-on</td><td>Add-on</td></tr>
        <tr><td>Face login</td><td>Add-on</td><td>Add-on</td><td>Add-on</td></tr>
        <tr><td>Demo examples</td><td>Add-on</td><td>Add-on</td><td>Add-on</td></tr>
        <tr><td><strong>Roles</strong></td><td>Admin, Editor, User</td><td>Admin, Teacher, Student</td><td>Admin, Manager, Member</td></tr>
      </tbody>
    </table>
  </div>
  <p>Only the Admin can turn features on or off. The other roles can use whatever is switched on.</p>
</div>

<div class="ocs__card" id="walkthrough">
  <h3 class="ocs__section-title">Example: A Teacher Sets Up a Classroom</h3>
  <p>A teacher at a school with no website wants a classroom platform for their CS students.</p>
  <div class="ocs__diagram">
    <pre class="mermaid">flowchart TD
    A[Teacher runs the install script] --> B[A setup page opens in the browser]
    B --> C[Picks the Education kit]
    C --> D[Types the school name
and passwords]
    D --> E[Optional: adds an AI key
for the tutor and grading]
    E --> F[Installer checks the computer,
downloads release v0.2.0,
and sets everything up]
    F --> G[Done page shows the site address
and the accounts]
    G --> H[Teacher logs in as Admin]
    H --> I[Students sign up as Students]
    H --> J[Teacher turns features on or off
from the dashboard]</pre>
  </div>
  <div class="ocs__table-wrap">
    <table class="ocs__table">
      <thead><tr><th>Step</th><th>What the teacher does</th><th>What happens for them</th></tr></thead>
      <tbody>
        <tr><td>1</td><td>Runs one script</td><td>A setup page opens in their browser and walks them through the rest</td></tr>
        <tr><td>2</td><td>Answers a few questions</td><td>Kit, school name, passwords, optional API keys. Blank passwords are generated for them</td></tr>
        <tr><td>3</td><td>Waits a few minutes</td><td>The site and both backends are installed and started</td></tr>
        <tr><td>4</td><td>Logs in</td><td>Lessons, code runner, grading, and hall pass are ready</td></tr>
        <tr><td>5</td><td>Changes their mind later</td><td>Features switch on or off without reinstalling, and nothing is lost</td></tr>
      </tbody>
    </table>
  </div>
</div>

<div class="ocs__card" id="future">
  <h3 class="ocs__section-title">Future</h3>
  <div class="ocs__keypoints">
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span>Finish Events: admin screen, scrolling ticker, events page, photo gallery</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span>Give the Education and Business kits their own default UI</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span>Add S3 file storage and backup and restore guides for production</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span>Add OCS Email to Extended Services</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span>Move the rest of OCS's old site content into the kit with the import tool</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span>Add a hosted option for schools without their own server</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span>Get a real school to pilot it end to end</span></div>
  </div>
</div>

<div class="ocs__card" id="considerations">
  <h3 class="ocs__section-title">Considerations</h3>
  <div class="ocs__table-wrap">
    <table class="ocs__table">
      <tbody>
        <tr><td>Privacy</td><td>Grading, hall pass, and chat handle real student data</td></tr>
        <tr><td>Self hosting</td><td>Needs Docker. Not every admin can run that</td></tr>
        <tr><td>Staying in sync</td><td>OCS's own site keeps changing. The import tool brings updates in behind a scrub check, but someone has to run it</td></tr>
      </tbody>
    </table>
  </div>
</div>

<div class="ocs__card" id="how-its-built">
  <h3 class="ocs__section-title">How It's Built</h3>
  <p>Every kit uses the same 3 codebases: a Portfolio website, a Flask backend, and a Spring backend. A kit is just a preset list of features and role names, so a fix reaches every kit at once.</p>
  <div class="ocs__diagram">
    <pre class="mermaid">flowchart TD
    K[Pick a kit:
Vanilla / Education / Business] --> P[Portfolio
frontend website]
    K --> F[Flask backend
logins, AI chat,
code runner, social]
    K --> S[Spring backend
people, assignments,
calendar, hall pass]</pre>
  </div>
  <p>Content comes from OCS's original site through an automated scrub step that strips anything school specific (names, logins, secrets) before it's added in.</p>
  <div class="ocs__diagram">
    <pre class="mermaid">flowchart LR
    U[OCS's original site] -->|scan| Sg[Suggest features]
    Sg -->|import| G{Scrub gate}
    G -->|pass| Kt[Kit codebase]
    G -->|blocked| Fx[Fix & re-run]</pre>
  </div>
  <p>Installing is one script, <code>./install.sh</code>. It opens a setup page, then downloads the 3 codebases at the pinned release, sets them up, and starts the site. The website runs on GitHub Pages and the backends run in Docker.</p>
</div>

<div class="ocs__card" id="versioning">
  <h3 class="ocs__section-title">Versioning and Packaging</h3>
  <p>Four repositories ship as one kit, so they are released together. The current release is v0.2.0.</p>
  <div class="ocs__grid ocs__grid--standard cols-4">
    <div class="ocs__grid-cell"><strong>OCS-Kit</strong><br>Installer, import tool, and the one catalog of kits and features.</div>
    <div class="ocs__grid-cell"><strong>OCS-Kit-Pages</strong><br>The Jekyll website. Hides links for features that are off.</div>
    <div class="ocs__grid-cell"><strong>OCS-Kit-Flask</strong><br>Python backend. Answers 404 for features that are off.</div>
    <div class="ocs__grid-cell"><strong>OCS-Kit-Spring</strong><br>Java backend. Answers 404 for features that are off.</div>
  </div>
  <h4 class="ocs__section-title">From change to release</h4>
  <div class="ocs__grid ocs__grid--standard cols-4">
    <div class="ocs__grid-cell"><strong>1</strong><br>Change on a branch, reviewed in a pull request</div>
    <div class="ocs__grid-cell"><strong>2</strong><br>Checks confirm every repo's catalog copy matches</div>
    <div class="ocs__grid-cell"><strong>3</strong><br>Tag the same version, such as v0.2.0, on all four repos</div>
    <div class="ocs__grid-cell"><strong>4</strong><br>Backend images build from the <code>v*</code> tag, and the installer pins that version</div>
  </div>
</div>

<div class="ocs__card" id="install">
  <h3 class="ocs__section-title">How install.sh Begins</h3>
  <p>The script lives in the OCS-Kit repo. It is a small launcher that finds Python 3.8 or newer and runs the installer.</p>
  <div class="ocs__grid ocs__grid--standard cols-4">
    <div class="ocs__grid-cell"><strong>1</strong><br>Clone the OCS-Kit repo and run <code>./install.sh</code></div>
    <div class="ocs__grid-cell"><strong>2</strong><br>A setup page checks the computer and asks for the kit, school name, passwords, and keys</div>
    <div class="ocs__grid-cell"><strong>3</strong><br>It downloads the website and both backends at the pinned release, v0.2.0</div>
    <div class="ocs__grid-cell"><strong>4</strong><br>It writes the settings, applies the catalog, and starts everything</div>
  </div>
  <h4 class="ocs__section-title">Templates and upstreams</h4>
  <div class="ocs__grid ocs__grid--standard cols-3">
    <div class="ocs__grid-cell"><strong>Upstream</strong><br>The Open Coding Society repos (pages, flask, spring). An import tool brings features into the kit repos one at a time, behind a scrub check.</div>
    <div class="ocs__grid-cell"><strong>Kit repos</strong><br>OCS-Kit-Pages, OCS-Kit-Flask, and OCS-Kit-Spring. They hold the clean, school-neutral code and the release tags.</div>
    <div class="ocs__grid-cell"><strong>School copy</strong><br>The school's own website repo, made from OCS-Kit-Pages. The kit release is merged into it, and its main branch is never rewritten.</div>
  </div>
</div>

<div class="ocs__card" id="default-ui">
  <h3 class="ocs__section-title">A Default UI for Every Kit</h3>
  <p>A kit should look finished the moment it is installed.</p>
  <div class="ocs__table-wrap">
    <table class="ocs__table">
      <thead><tr><th>Kit</th><th>Default UI</th><th>Status</th></tr></thead>
      <tbody>
        <tr><td>Vanilla</td><td>Portfolio</td><td><span class="ocs__status-pill ocs__status-pill--good">Exists</span></td></tr>
        <tr><td>Education</td><td>A customer-facing Education UI</td><td><span class="ocs__status-pill ocs__status-pill--warn">Needs UI</span></td></tr>
        <tr><td>Business</td><td>Portfolio today; needs its own Business UI</td><td><span class="ocs__status-pill ocs__status-pill--warn">Needs UI</span></td></tr>
      </tbody>
    </table>
  </div>
</div>

<div class="ocs__capstone-footer">
  <div class="ocs__team"><span class="ocs__team-label">Project Team</span><span class="ocs__team-name">{{ data.Team | join: ", " }}</span></div>
  <div class="ocs__status">In Development</div>
</div>
</div>
