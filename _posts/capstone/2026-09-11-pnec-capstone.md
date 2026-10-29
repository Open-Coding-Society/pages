---
microblog: true
toc: false
layout: post
title: Poway Neighborhood Emergency Corps 2026–2027
description: CSP capstone continuing the PNEC project with proposed household preparedness, volunteer coordination, and community information tools.
permalink: /capstone/powaynec-2026-2027/
year: "2026-2027"
---
 {% assign pnec_data = site.data.pnec_capstone %}

  <section class="ocs__card" aria-labelledby="pnec-story">
    <p class="ocs__badge">Our Community · Emergency Preparedness</p>
    <h2 id="pnec-story">The Story of PNEC</h2>
    <p class="ocs__lead">Neighbors helping neighbors prepare for the unexpected.</p>

    <p>Founded in 2011, Poway Neighborhood Emergency Corps (PNEC) is an all-volunteer nonprofit dedicated to helping Poway residents prepare for emergencies and support one another.</p>

    <div class="ocs__grid ocs__grid--col2">
      <div class="ocs__visual">
        <h3>What PNEC Does</h3>
        <ul>
          <li>Educates residents about wildfires, earthquakes, and other hazards.</li>
          <li>Shares emergency planning tips and preparedness resources.</li>
          <li>Connects neighbors through community outreach.</li>
        </ul>
      </div>
      <div class="ocs__visual">
        <h3>Why It Matters</h3>
        <ul>
          <li>Helps families prepare before disasters happen.</li>
          <li>Encourages neighbors to look out for one another.</li>
          <li>Builds a more informed and resilient community.</li>
        </ul>
      </div>
    </div>

    <p>PNEC's mission is simple: help Poway become a community where residents are prepared, informed, and ready to help their neighbors.</p>

    <div class="ocs__links">
      <a class="ocs__btn accent fill" href="https://powaynec.com/" target="_blank" rel="noopener noreferrer">Visit Official PNEC Website ↗</a>
    </div>
  </section>

{% assign pnec_data = site.data.pnec_capstone %}

<div class="ocs__stack ocs__stack--wide">
  <header class="ocs__card">
    <p class="ocs__badge">CSP 2026–2027 · Community capstone</p>
    <h2>Prepared neighbors. A stronger Poway.</h2>
    <p class="ocs__lead">Samanvi, Joan, and Ainsley are continuing the previous PNEC team's project. Our team proposes the features below to extend the inherited project, with scope and implementation to be reviewed with PNEC.</p>
    <nav class="ocs__links" aria-label="PNEC project sections">
      <a class="ocs__btn accent fill" href="#team-kanban-board">Team Kanban Board</a>
      <a class="ocs__btn accent fill" href="#proposed-improvements">Nine proposed improvements</a>
      <a class="ocs__btn accent fill" href="#team-and-review">Meet the team</a>
      <a class="ocs__btn accent fill" href="#delivery-lifecycle">GitHub lifecycle</a>
    </nav>
  </header>

  <section class="ocs__card" aria-labelledby="team-kanban-board">
    <p class="ocs__badge">Plan · Track · Review</p>
    <h2 id="team-kanban-board">Team Kanban Board</h2>
    <p>Follow our team's actual issues, assignments, and progress on GitHub.</p>
    {% if pnec_data.Board %}
    {% include ocs_kanban_board.html url=pnec_data.Board.url filter=pnec_data.Board.filter title=pnec_data.Board.title issue_metadata=pnec_data.Board.issue_metadata %}
    {% endif %}
    <div class="ocs__links">
      <a class="ocs__btn small pill" href="{{ pnec_data.Board.project_url | escape }}" target="_blank" rel="noopener noreferrer">Open personal GitHub Project ↗</a>
      <a href="https://github.com/samanviy17-crypto/team-portfolio" target="_blank" rel="noopener noreferrer">Browse the team repository</a>
    </div>
    <p class="ocs__text">Cards load from our public repository issues. Stage labels determine columns first; otherwise, closed issues appear in Done, assigned open issues in In progress, and other open issues in To do. These columns are derived from issue data and may differ from our personal GitHub Project.</p>
    <p class="ocs__text">Filter by an issue's first assignee; each card lists all assignees. The shared board reuses cached data for 10 minutes and checks GitHub again on a later page load. Pull requests and issues closed as not planned are omitted. Issue closure alone does not establish stakeholder acceptance.</p>
    <p class="ocs__text">When present, Priority and Estimate labels show our proposed team priority and Fibonacci-hour effort estimate, not logged hours or Product Owner approval. One assignee coordinates each issue; individual academic contributions remain each student's responsibility.</p>
  </section>

  <section class="ocs__card" aria-labelledby="about-pnec">
    <h2 id="about-pnec">About PNEC</h2>
    <p>Poway Neighborhood Emergency Corps (PNEC) helps Poway residents prepare for emergencies by sharing preparedness information, coordinating with the city and first-response agencies, organizing preparedness activities, and encouraging neighbors to help one another. Our capstone improves the existing PNEC website to make this preparedness information easier to find and use.</p>
    <a href="https://powaynec.com/" target="_blank" rel="noopener noreferrer">Visit the official PNEC website ↗</a>
  </section>

  <section class="ocs__card" aria-labelledby="project-overview">
    <p class="ocs__badge">Project overview</p>
    <h2 id="project-overview">Why we chose PNEC</h2>
    <p>We chose PNEC to help our community prepare for emergencies. Our team identified wildfires, high temperatures, and earthquakes as reasons to make preparedness information and planning easier to access. The project combines community impact with opportunities to build useful technical skills.</p>
    <div class="ocs__grid ocs__grid--col2">
      <div class="ocs__visual">
        <h3>Project direction</h3>
        <p>Extend the existing information platform with personalized household planning, preparedness learning, volunteer coordination, and community feedback. These features are proposed work for our team.</p>
        <a href="https://github.com/samanviy17-crypto/team-portfolio/issues/3" target="_blank" rel="noopener noreferrer">Read the Team Feature Plan ↗</a>
      </div>
      <div class="ocs__visual">
        <h3>Community participation</h3>
        <p>Our proposed direction connects preparedness information with saved plans, learning activities, volunteer tasks, and feedback from residents.</p>
        <a href="https://pnec.opencodingsociety.com" target="_blank" rel="noopener noreferrer">Visit the existing project site ↗</a>
      </div>
    </div>
  </section>

  <section class="ocs__card" aria-labelledby="inherited-foundation">
    <p class="ocs__badge">Inherited project and opportunities</p>
    <h2 id="inherited-foundation">Build on the existing foundation</h2>
    <p>The previous team's handoff describes Risk Watch, the Helper Bot, a neighborhood map, member accounts, and a browser-based site editor. We will review these inherited features before extending them.</p>
    <ul class="ocs__entity-list" aria-label="Inherited features">
      <li>Risk Watch</li><li>Helper Bot</li><li>Neighborhood map</li><li>Member accounts</li><li>Browser-based site editor</li>
    </ul>
    <div class="ocs__links">
      <a href="{{ '/capstone/powaynec/' | relative_url }}">Previous Team's Handoff</a>
      <a href="https://github.com/whitelunarium/Beasts_FrontEnd" target="_blank" rel="noopener noreferrer">Inherited Frontend ↗</a>
      <a href="https://github.com/whitelunarium/Beasts_Flask" target="_blank" rel="noopener noreferrer">Inherited Backend ↗</a>
    </div>
  </section>

  <section class="ocs__card" aria-labelledby="proposed-improvements">
    <p class="ocs__badge">Proposed features and acceptance checks</p>
    <h2 id="proposed-improvements">Nine ways to support our community</h2>
    <p>These are proposals for review, not claims of completed features. Each improvement includes an acceptance check to guide a future implementation.</p>
    <div class="ocs__grid ocs__grid--col2">
    <section class="ocs__visual" aria-labelledby="pnec-feature-1">
      <span class="ocs__badge">Proposed improvement 01</span>
      <h3 id="pnec-feature-1">Family / household preparedness checklist tracker</h3>
      <p>Save a personalized checklist to each resident account for a 72-hour kit, evacuation plan, and meeting point. Show household progress and remaining tasks alongside the existing preparedness information.</p>
      <div class="ocs__callout"><p><strong>Proposed acceptance check:</strong> Completed tasks remain saved after signing in again, progress updates correctly, and each household sees only its own checklist.</p></div>
    </section>
    <section class="ocs__visual" aria-labelledby="pnec-feature-2">
      <span class="ocs__badge">Proposed improvement 02</span>
      <h3 id="pnec-feature-2">Interactive preparedness quiz</h3>
      <p>Ask residents 8–10 questions about their emergency kit, evacuation route, and other preparedness steps. Show a preparedness score and the top actions suggested by their answers.</p>
      <div class="ocs__callout"><p><strong>Proposed acceptance check:</strong> All questions can be answered with a keyboard, the same answers produce the same score, and recommendations match the gaps identified. The score describes quiz responses, not a guarantee of safety.</p></div>
    </section>
    <section class="ocs__visual" aria-labelledby="pnec-feature-3">
      <span class="ocs__badge">Proposed improvement 03</span>
      <h3 id="pnec-feature-3">Volunteer shift / task board</h3>
      <p>Let coordinators post door-to-door check-ins, supply drives, and CERT training sessions. Residents and volunteers can claim available slots.</p>
      <div class="ocs__callout"><p><strong>Proposed acceptance check:</strong> A volunteer can sign up or cancel, the remaining capacity stays accurate, and filled slots cannot be overbooked.</p></div>
    </section>
    <section class="ocs__visual" aria-labelledby="pnec-feature-4">
      <span class="ocs__badge">Proposed improvement 04</span>
      <h3 id="pnec-feature-4">Post-disaster check-in / well-being board</h3>
      <p>Let residents mark themselves as safe or needing help by neighborhood, with their update visible to their coordinator.</p>
      <div class="ocs__callout"><p><strong>Proposed acceptance check:</strong> A resident can update their status and timestamp, and only authorized coordinators can view their neighborhood’s reports. The page clearly explains that a check-in does not contact emergency services.</p></div>
    </section>
    <section class="ocs__visual" aria-labelledby="pnec-feature-5">
      <span class="ocs__badge">Proposed improvement 05</span>
      <h3 id="pnec-feature-5">Multilingual support</h3>
      <p>Offer key pages such as Risk Watch, evacuation information, and the Helper Bot in Spanish and additional languages selected with PNEC. Explore translation support with review of critical information.</p>
      <div class="ocs__callout"><p><strong>Proposed acceptance check:</strong> A language selector opens the corresponding content, missing translations are clearly identified, and critical preparedness wording is reviewed before publication.</p></div>
    </section>
    <section class="ocs__visual" aria-labelledby="pnec-feature-6">
      <span class="ocs__badge">Proposed improvement 06</span>
      <h3 id="pnec-feature-6">Donation / supply drive goal tracker</h3>
      <p>List current needs such as flashlights, water, and first-aid kits, with a running progress tracker so residents and local businesses can see how to contribute.</p>
      <div class="ocs__callout"><p><strong>Proposed acceptance check:</strong> Each drive shows its item, goal, and recorded progress. Authorized volunteers can update totals, and pledges are distinguished from supplies received.</p></div>
    </section>
    <section class="ocs__visual" aria-labelledby="pnec-feature-7">
      <span class="ocs__badge">Proposed improvement 07</span>
      <h3 id="pnec-feature-7">Report a hazard</h3>
      <p>Provide a resident form for reporting a downed tree, blocked evacuation route, or broken fire hydrant. Route the report to the relevant coordinator or admin dashboard.</p>
      <div class="ocs__callout"><p><strong>Proposed acceptance check:</strong> Required location and description fields are validated, submitted reports appear for the authorized coordinator, and the form distinguishes community reports from urgent emergency requests.</p></div>
    </section>
    <section class="ocs__visual" aria-labelledby="pnec-feature-8">
      <span class="ocs__badge">Proposed improvement 08</span>
      <h3 id="pnec-feature-8">Community-driven FAQ feedback</h3>
      <p>Add a “Was this helpful?” option and a way to submit questions that stump the Helper Bot. Volunteers can review gaps and improve the knowledge base.</p>
      <div class="ocs__callout"><p><strong>Proposed acceptance check:</strong> Feedback is saved, unanswered questions appear in a volunteer review queue, and reviewed FAQ changes can be tracked.</p></div>
    </section>
    <section class="ocs__visual" aria-labelledby="pnec-feature-9">
      <span class="ocs__badge">Proposed improvement 09</span>
      <h3 id="pnec-feature-9">Weekly tips and tricks</h3>
      <p>Publish weekly preparedness tips and volunteer or learning events. Adapt the topics to current community threats, such as flood preparedness during flooding.</p>
      <div class="ocs__callout"><p><strong>Proposed acceptance check:</strong> Each update shows a publication date, relevant sources, and upcoming event details. Authorized volunteers can review and update time-sensitive content.</p></div>
    </section>
    </div>
  </section>

  <section class="ocs__card" aria-labelledby="team-and-review">
    <p class="ocs__badge">Teammates / Collaborators</p>
    <h2 id="team-and-review">Our team and review process</h2>
    <div class="ocs__grid ocs__grid--col2">
      <div class="ocs__visual"><h3>Joan Kim</h3><p>Scrum Master / Developer</p></div>
      <div class="ocs__visual"><h3>Ainsley Albert</h3><p>Technologist / Developer 1</p></div>
      <div class="ocs__visual"><h3>Samanvi Yachareni</h3><p>Technologist / Developer 2</p></div>
    </div>
    <h3>Iteration process</h3>
    <ol>
<li><h3>1 · Investigate and scope</h3><p>Review the inherited repositories and handoff, reproduce a user problem, and discuss priorities with PNEC. Record the selected scope, owner, and acceptance checks in an issue.</p></li>
<li><h3>2 · Build and test</h3><p>Implement one agreed improvement in a small branch. Test the main workflow, failure cases, keyboard navigation, and phone layouts. Keep screenshots and results with the issue.</p></li>
<li><h3>3 · Review and revise</h3><p>Open a focused PR with the problem, changes, and actual test results. Have a teammate review it, address feedback, and record the next iteration before the class review.</p></li>
    </ol>
  </section>

  <section class="ocs__card" aria-labelledby="delivery-lifecycle">
    <p class="ocs__badge">GitHub issues · Evidence · Review</p>
    <h2 id="delivery-lifecycle">Our five-stage Kanban lifecycle</h2>
    <p>Mr. Mortensen is our Product Owner. Samanvi, Joan, and Ainsley are the Scrum Team. These are the required stage criteria, not claims that our cards have already passed them. All 20 proposals in the <a href="https://github.com/samanviy17-crypto/team-portfolio/issues/42">Product Backlog #42</a> await his approval.</p>
    <p class="ocs__callout">October 21 board audit: the current columns are Backlog, Todo, In Progress, Testing and Done. Renaming Testing to In Review requires teacher approval. Issues <a href="https://github.com/samanviy17-crypto/team-portfolio/issues/31">#31</a>–<a href="https://github.com/samanviy17-crypto/team-portfolio/issues/34">#34</a> still need scope, priority and owner decisions; Done issues <a href="https://github.com/samanviy17-crypto/team-portfolio/issues/1">#1</a> and <a href="https://github.com/samanviy17-crypto/team-portfolio/issues/5">#5</a>–<a href="https://github.com/samanviy17-crypto/team-portfolio/issues/9">#9</a> lack confirmed acceptance evidence in the reviewed records. These gaps remain pending; no board statuses or assignments were changed.</p>
    <div class="ocs__grid ocs__grid--col2">
      <section class="ocs__visual"><h3>1 · Parking Lot (Backlog)</h3>
        <ul><li>Hold a success meeting with the teacher, Product Owner, mentors or community stakeholders.</li><li>Use empathy research, interviews or surveys to understand user needs and a point of view (POV).</li><li>Explore solutions with “How might we?” (HMW).</li><li>Define a proposed design and acceptance criteria before committing resources.</li></ul>
        <p><strong>Exit:</strong> An understood, actionable solution ready for prioritization.</p>
      </section>
      <section class="ocs__visual"><h3>2 · To Do</h3>
        <ul><li>Agree on weighted priority with the Product Owner.</li><li>Confirm one accountable owner and the authorized scope.</li></ul>
        <p><strong>Exit:</strong> Prioritized, owned and ready to start.</p>
      </section>
      <section class="ocs__visual"><h3>3 · In Progress</h3>
        <ul><li>Implement an authorized prototype in code.</li><li>Complete unit tests and retain actual results.</li><li>Create and link a focused pull request.</li></ul>
        <p><strong>Exit:</strong> Development evidence is complete.</p>
      </section>
      <section class="ocs__visual"><h3>4 · In Review</h3>
        <ul><li>Deploy to an appropriate, approved testing or review environment.</li><li>Run system tests and present the outcome to reviewers.</li><li>Obtain acceptance from the authorized reviewer.</li></ul>
        <p><strong>Exit:</strong> The solution satisfies its acceptance criteria.</p>
      </section>
      <section class="ocs__visual"><h3>5 · Done</h3>
        <ul><li>Deliver the accepted outcome.</li><li>Retain evidence in the GitHub issue.</li><li>Link key commits and pull request history.</li></ul>
        <p><strong>Exit:</strong> Accepted delivery and its evidence are retained. Proposed or incomplete work is not Done.</p>
      </section>
    </div>
    <h3>Choose the right issue format</h3>
    <div class="ocs__grid ocs__grid--col2">
      <div class="ocs__visual"><h3>Quick Issue</h3><p>Use for a small bug, revision, non-invasive prototype or minor improvement. Record the applicable problem, task, owner, acceptance checks, commits, PR and tests.</p><p>It may start in To Do or In Progress when understood and appropriately authorized. It does not bypass approval for our proposed backlog.</p></div>
      <div class="ocs__visual"><h3>Formal Issue</h3><p>Use for research, new features and substantial changes. Include user needs, stakeholder evidence, POV/HMW, alternatives, design, acceptance criteria, priority and owner.</p><p>Then link implementation tasks, unit/system tests, commits, PRs, presentation, review and final acceptance. Missing evidence stays pending.</p></div>
    </div>
    <p class="ocs__callout">Both templates are prepared locally in the team repository's issue-template directory; publication is pending. No issues, assignments or Kanban statuses were changed.</p>
  </section>

  <section class="ocs__card" aria-labelledby="real-project-evidence">
    <h2 id="real-project-evidence">Connect the lifecycle to real PNEC work</h2>
    <div class="ocs__grid ocs__grid--col2">
      <div class="ocs__visual"><h3>Planning and research</h3><ul><li><a href="https://github.com/samanviy17-crypto/team-portfolio/issues/42">#42 · Product Backlog and API research</a>: 20 proposed scopes; Product Owner approval and priorities remain pending.</li><li><a href="https://github.com/samanviy17-crypto/team-portfolio/issues/14">#14 · Official weather alerts</a>: open proposal with research, dependencies and acceptance criteria; not an approved live integration.</li></ul></div>
      <div class="ocs__visual"><h3>Implementation and testing evidence</h3><ul><li><a href="https://github.com/samanviy17-crypto/team-portfolio/issues/8">#8 · Authentication and recovery</a>: open issue describing existing local implementation and tests; production is unverified.</li><li><a href="https://github.com/samanviy17-crypto/team-portfolio/issues/11">#11 · Authentication testing</a> and <a href="https://github.com/samanviy17-crypto/team-portfolio/issues/10">#10 · Reliability tests</a>: closed historical issues; closure does not prove deployment or Product Owner acceptance.</li><li><a href="https://github.com/samanviy17-crypto/team-portfolio/issues/25">#25 · Coordination acceptance testing</a>: open proposed testing scope, awaiting approval.</li></ul></div>
    </div>
    <p>Review the <a href="https://github.com/samanviy17-crypto/team-portfolio/issues/43">API and full-stack evidence #43</a> and <a href="https://github.com/samanviy17-crypto/team-portfolio/issues/44">Phase 1 assignment hub #44</a>. Issue states were inspected on October 21, 2026; they may change. Existing status inconsistencies are preserved rather than silently corrected.</p>
    <p>Working accounts, saved preparedness data and owner analytics belong to the PNEC frontend and Flask database. This capstone page is informational. Local verification does not establish public API availability, production persistence or accepted delivery; production 404/CORS diagnosis and deployment still require the EC2 administrator.</p>
  </section>

  <section class="ocs__card" aria-labelledby="microblog-updates">
    <h2 id="microblog-updates">Keep project updates in the existing Microblog</h2>
    <p>Use the page's Microblog button to open the existing OCS panel. Keep meeting notes, issue links, stakeholder feedback and short progress updates together. Clearly distinguish plans, local tests, reviewer decisions and accepted outcomes.</p>
    <ul><li>Link the relevant issue and describe the next step.</li><li>Record decisions with the reviewer and date; do not invent approval.</li><li>Never post passwords, tokens, resident records or sensitive household information.</li></ul>
    <p class="ocs__callout">The OCS Microblog uses the course site's services and accounts, separate from PNEC accounts. The panel is reused, not duplicated. Posting and persistence require those services and authorization; they have not been verified against production in this update.</p>
  </section>

  <section class="ocs__card" aria-labelledby="next-iteration">
    <h2 id="next-iteration">Evidence for the next iteration</h2>
    <p>This update organizes the capstone overview only. The nine improvements remain proposals; this page does not establish implementation or stakeholder validation. Subsequent updates should record the selected scope, each teammate's contributions, test results, and review feedback.</p>
    <p>The <a href="https://github.com/samanviy17-crypto/team-portfolio/issues/3" target="_blank" rel="noopener noreferrer">team feature plan</a> and Kanban board provide the next steps for review.</p>
    <p class="ocs__callout">Built with standard OCS components and shared Sass. Explore the <a href="https://github.com/samanviy17-crypto/pages/tree/main/_sass/open-coding/elements/buttons">OCS button styles</a> and <a href="https://github.com/samanviy17-crypto/pages/tree/main/_sass/open-coding/elements/grids">OCS grid styles</a>.</p>
  </section>
</div>
