---
microblog: true
toc: false
layout: post
title: Poway Neighborhood Emergency Corps 2026–2027
description: CSP capstone continuing the PNEC project with proposed household preparedness, volunteer coordination, and community information tools.
permalink: /capstone/powaynec-2026-2027/
year: "2026-2027"
---

> **CSP 2026–2027 · Samanvi, Joan, and Ainsley.** We are continuing the previous PNEC team's project. Our team proposes the features below to extend the inherited project, with scope and implementation to be reviewed with PNEC.

## Poway Neighborhood Emergency Corps 2026–2027

<div class="ocs__grid ocs__grid--standard cols-2">
    <div class="ocs__grid-cell ocs__grid-cell--header">Project Summary</div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Why we chose PNEC</strong>
        <p>We chose PNEC to help our community prepare for emergencies. Our team identified wildfires, high temperatures, and earthquakes as reasons to make preparedness information and planning easier to access. The project combines community impact with opportunities to build useful technical skills.</p>
        <a class="ocs__btn alert-green fill small" href="https://pnec.opencodingsociety.com" target="_blank" rel="noopener noreferrer">Existing Project Site</a>
    </div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Project Direction</strong>
        <p>Extend the existing information platform with personalized household planning, preparedness learning, volunteer coordination, and community feedback. These features are proposed work for our team.</p>
        <a class="ocs__btn alert-yellow fill small" href="https://github.com/samanviy17-crypto/team-portfolio/issues/3" target="_blank" rel="noopener noreferrer">Team Feature Plan</a>
    </div>
</div>

<div class="ocs__links ocs__links--wide">
    <a class="ocs__btn large" href="https://github.com/samanviy17-crypto/team-portfolio" target="_blank" rel="noopener noreferrer">GitHub Repository</a>
</div>

---

<div class="ocs__grid ocs__grid--standard cols-2">
    <div class="ocs__grid-cell ocs__grid-cell--header">Inherited Project and Opportunities</div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Existing Foundation</strong>
        <p>The previous team's handoff describes Risk Watch, the Helper Bot, a neighborhood map, member accounts, and a browser-based site editor. We will review these inherited features before extending them.</p>
        <a class="ocs__btn alert-green fill small" href="{% post_url 2026-03-06-powaynec-capstone %}">Previous Team's Handoff</a>
    </div>
    <div class="ocs__grid-cell">
        <strong>Community Participation</strong>
        <p>Our proposed direction connects preparedness information with saved plans, learning activities, volunteer tasks, and feedback from residents.</p>
        <a class="ocs__btn alert-yellow fill small" href="#proposed-improvements">Proposed Improvements</a>
    </div>
</div>

<div class="ocs__links ocs__links--wide">
    <a class="ocs__btn alert-green fill small" href="https://github.com/whitelunarium/Beasts_FrontEnd" target="_blank" rel="noopener noreferrer">Inherited Frontend</a>
    <a class="ocs__btn alert-green fill small" href="https://github.com/whitelunarium/Beasts_Flask" target="_blank" rel="noopener noreferrer">Inherited Backend</a>
</div>

---

## Proposed improvements

<div class="ocs__grid ocs__grid--standard cols-3">
    <div class="ocs__grid-cell ocs__grid-cell--header">Proposed Features and Acceptance Checks</div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>1. Family / household preparedness checklist tracker</strong>
        <p>Save a personalized checklist to each resident account for a 72-hour kit, evacuation plan, and meeting point. Show household progress and remaining tasks alongside the existing preparedness information.</p>
        <p><strong>Proposed acceptance check:</strong> Completed tasks remain saved after signing in again, progress updates correctly, and each household sees only its own checklist.</p>
    </div>
    <div class="ocs__grid-cell">
        <strong>2. Interactive preparedness quiz</strong>
        <p>Ask residents 8–10 questions about their emergency kit, evacuation route, and other preparedness steps. Show a preparedness score and the top actions suggested by their answers.</p>
        <p><strong>Proposed acceptance check:</strong> All questions can be answered with a keyboard, the same answers produce the same score, and recommendations match the gaps identified. The score describes quiz responses, not a guarantee of safety.</p>
    </div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>3. Volunteer shift / task board</strong>
        <p>Let coordinators post door-to-door check-ins, supply drives, and CERT training sessions. Residents and volunteers can claim available slots.</p>
        <p><strong>Proposed acceptance check:</strong> A volunteer can sign up or cancel, the remaining capacity stays accurate, and filled slots cannot be overbooked.</p>
    </div>
    <div class="ocs__grid-cell">
        <strong>4. Post-disaster check-in / well-being board</strong>
        <p>Let residents mark themselves as safe or needing help by neighborhood, with their update visible to their coordinator.</p>
        <p><strong>Proposed acceptance check:</strong> A resident can update their status and timestamp, and only authorized coordinators can view their neighborhood’s reports. The page clearly explains that a check-in does not contact emergency services.</p>
    </div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>5. Multilingual support</strong>
        <p>Offer key pages such as Risk Watch, evacuation information, and the Helper Bot in Spanish and additional languages selected with PNEC. Explore translation support with review of critical information.</p>
        <p><strong>Proposed acceptance check:</strong> A language selector opens the corresponding content, missing translations are clearly identified, and critical preparedness wording is reviewed before publication.</p>
    </div>
    <div class="ocs__grid-cell">
        <strong>6. Donation / supply drive goal tracker</strong>
        <p>List current needs such as flashlights, water, and first-aid kits, with a running progress tracker so residents and local businesses can see how to contribute.</p>
        <p><strong>Proposed acceptance check:</strong> Each drive shows its item, goal, and recorded progress. Authorized volunteers can update totals, and pledges are distinguished from supplies received.</p>
    </div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>7. Report a hazard</strong>
        <p>Provide a resident form for reporting a downed tree, blocked evacuation route, or broken fire hydrant. Route the report to the relevant coordinator or admin dashboard.</p>
        <p><strong>Proposed acceptance check:</strong> Required location and description fields are validated, submitted reports appear for the authorized coordinator, and the form distinguishes community reports from urgent emergency requests.</p>
    </div>
    <div class="ocs__grid-cell">
        <strong>8. Community-driven FAQ feedback</strong>
        <p>Add a “Was this helpful?” option and a way to submit questions that stump the Helper Bot. Volunteers can review gaps and improve the knowledge base.</p>
        <p><strong>Proposed acceptance check:</strong> Feedback is saved, unanswered questions appear in a volunteer review queue, and reviewed FAQ changes can be tracked.</p>
    </div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>9. Weekly tips and tricks</strong>
        <p>Publish weekly preparedness tips and volunteer or learning events. Adapt the topics to current community threats, such as flood preparedness during flooding.</p>
        <p><strong>Proposed acceptance check:</strong> Each update shows a publication date, relevant sources, and upcoming event details. Authorized volunteers can review and update time-sensitive content.</p>
    </div>
</div>

---

## Team and review process

<div class="ocs__grid ocs__grid--standard cols-3">
    <div class="ocs__grid-cell ocs__grid-cell--header">Teammates / Collaborators</div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Joan Kim</strong>
        <p>Scrum Master / Developer</p>
    </div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Ainsley Albert</strong>
        <p>Technologist / Developer 1</p>
    </div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Samanvi Yachareni</strong>
        <p>Technologist / Developer 2</p>
    </div>
</div>

### Iteration process

<div class="ocs__grid ocs__grid--standard cols-3">
    <div class="ocs__grid-cell">
        <h3>1 · Investigate and scope</h3>
        <p>Review the inherited repositories and handoff, reproduce a user problem, and discuss priorities with PNEC. Record the selected scope, owner, and acceptance checks in an issue.</p>
    </div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <h3>2 · Build and test</h3>
        <p>Implement one agreed improvement in a small branch. Test the main workflow, failure cases, keyboard navigation, and phone layouts. Keep screenshots and results with the issue.</p>
    </div>
    <div class="ocs__grid-cell">
        <h3>3 · Review and revise</h3>
        <p>Open a focused PR with the problem, changes, and actual test results. Have a teammate review it, address feedback, and record the next iteration before the class review.</p>
    </div>
</div>

## Evidence for the next iteration

This PR updates the capstone overview only. Feature implementation and stakeholder validation remain future work. The team feature plan is linked above. Subsequent updates should record the selected scope, each teammate's contributions, test results, and review feedback.


**Powered by OCS grids and buttons**

[Buttons]({{ '/index2' | relative_url }}) | [Grids]({{ '/index4' | relative_url }})
