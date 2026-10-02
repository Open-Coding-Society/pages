---
microblog: true
toc: false
layout: post
title: OCS System UI Redesign — Comprehensive Brainstorm
permalink: /ocs/brainstorm/
---

## Purpose

We are beginning a redesign of the OCS user interfaces and the way students, teachers, mentors, and other users move through the OCS system.

The goal is not simply to make individual pages look better.

We need to step back and ask:

> **What are the key areas of OCS, what does each area own, and how should a user understand where they are and what they can do?**

OCS currently spans three applications:

* **GitHub Pages** — `pages.opencodingsociety.com`
* **Flask** — `flask.opencodingsociety.com`
* **Spring** — `spring.opencodingsociety.com`

The redesign should make these feel like **one OCS system**, even though different applications provide different capabilities.

---

## 1. OCS System Mental Model

A new user should be able to understand OCS through a small number of major concepts.

```text
                         OCS
                          │
       ┌──────────────────┼──────────────────┐
       │                  │                  │
     LEARN              BUILD             CONNECT
       │                  │                  │
    Courses            Capstone        Communication
       │                  │                  │
       └──────────────────┼──────────────────┘
                          │
                    RESOURCES
                          │
                     Learn How
                          │
                       PROFILE
                          │
                    Track Myself
```

The major questions should be:

### 1. Where am I?

**Courses / Capstone**

### 2. What am I doing?

**Assignments / Lessons / Projects**

### 3. How do I do it?

**Resources**

### 4. Who do I work with?

**Communication**

### 5. How am I doing?

**Profile / Dashboard / Grading**

---

## 2. Proposed Top-Level OCS Areas

A possible starting point for the global navigation:

```text
OCS
│
├── Logo/Home
├── Courses
├── Capstone
├── Communication
├── Search/Resources
└── Profile
```

This is a brainstorm, not a final navigation design.

The teams should determine whether:

* Search and Resources belong togetner
* Resources should be called Library, Knowledge, or Explorer
* Communication belongs in the primary navigation
* How do we find alerts or communcation that pertains to me

---

## 3. OCS Logo / Home

**Primary site:** `pages.opencodingsociety.com`

The OCS logo/home experience should be a **low-friction introduction to OCS and Computer Science**.

It should provide an easy entry point for someone who does not yet understand OCS.

## Possible Content

* OCS introduction
* Gamification / login / onboarding / wayfinding
* Introduction to Tools
* OCS program pathway
* Guide for parents
* Course/program information
* Student work
* Catalog of games created by CSSE students
* Examples of projects
* Introduction to the OCS ecosystem

The home experience should answer:

> What is OCS and where do I go?

The home experience is therefore not simply a marketing page. It is the front door into the OCS system.

---

## 4. Courses

**Purpose:** Center of the classroom experience.

Courses contain the instructional structure for:

* CSSE
* CSP
* CSA
* CSH / Honors

Courses should provide:

* Weekly materials
* Pacing
* Sprints
* Weeks
* Lessons
* Assignments
* Student activity
* Course Chat
* Calendar

The Course area should answer:

> **What am I learning and what am I supposed to be doing now?**

### Possible Structure

```text
Courses
│
├── CSSE
│   ├── Announcements | Calendar
│   ├── Sprint
│   ├── Week | Chat
│   ├── Lessons
│   └── Assignments
│
├── CSP
│
├── CSA
│
└── CSH
```

### Course Communication

Courses should not be isolated instructional pages.

Communication can exist at multiple levels:

* Course Chat
* Weekly Chat
* Assignment Chat
* Lesson Discussion
* Teacher announcements
* Student questions
* Student responses

A student should be able to communicate **in the context where the work is happening**.

## 5. Student Lessons

Student-created lessons should be treated as **learning artifacts plus a communication/review experience**.

A lesson is not simply published content.

It can be:

* Taught
* Used by other students
* Discussed
* Reviewed
* Improved
* Graded
* Reflected upon

### Lesson Communication

Each student lesson can have a blog/chat-style communication stream.

Possible interactions:

* Lesson author updates
* Student questions
* Teacher comments
* Peer comments
* Teaching observations
* Follow-up discussion
* Microblogs

### Lesson Reviews

Communication around a lesson can also contain structured feedback:

* Qualitative observations
* Quantitative measures
* Likert-scale reviews
* Peer feedback
* Teacher feedback
* Student feedback
* Teaching observations

Possible model:

```text
Student Lesson
│
├── Lesson Content
│
├── Teaching Activity
│
├── Discussion
│   ├── Questions
│   ├── Microblogs
│   └── Responses
│
└── Reviews
    ├── Qualitative
    ├── Quantitative
    └── Likert
```

The key idea:

> **The lesson is the artifact; the communication and reviews show what happened around the artifact.**

---

## 6. Capstone

**Purpose:** Center for year-long student projects.

Capstone is where students move beyond individual lessons and assignments into **systems and projects**.

It should support the progression of student work across the OCS pathway.

### CSP

Community / nonprofit projects.

Possible activities:

* Create Performance Task
* Community problems
* Nonprofit partners
* Project teams
* Project planning
* Demonstrations
* Reviews

### CSA

OCS System projects.

Students work on real OCS systems with real requirements.

Possible activities:

* System development
* Infrastructure
* System teams
* Technical ownership
* Production-oriented work
* Mentor guidance
* System reviews

### CSH / Honors

Research and advanced projects.

Possible activities:

* Research
* Investigation
* Advanced technical work
* System development
* Mentor / advisor interaction
* Presentation

Capstone should answer:

> **What am I building, who is it for, and how does my work contribute to a real system or community?**

---

## 7. Capstone Communication

Capstone is also a major communication environment.

Each project should have a persistent **chat / blog-style communication space**.

The communication history can become part of the project record.

## Possible Project Communication

* Project updates
* Questions
* Technical discussions
* Student responses
* Project decisions
* Milestone reviews
* Demonstrations
* Reflections
* Mentor feedback
* Mentor guidance

## Mentor Communication

Capstone should provide a structured way for mentors to participate.

Possible interactions:

### Mentor Interest

A mentor can:

* View projects
* Express interest
* Request to become a mentor
* Identify areas of expertise

### Mentor / Project Relationship

Once connected:

* Student/project team communicates with mentor
* Mentor provides guidance
* Mentor provides feedback
* Mentor reviews progress
* Student responds
* Project team records decisions

Possible model:

```text
Capstone Project
│
├── Project Information
├── Team
├── Tasks
├── Milestones
├── Artifact
├── Handoff Materials 
│
└── Communication
    │
    ├── Project Updates
    ├── Student Discussion
    ├── Mentor Interest
    ├── Mentor Guidance
    ├── Mentor Feedback
    ├── Transfer of Knowledge
    └── Responses
```

> The project should tell the story of the work, not just display the final artifact.

---

## 8. Resources / Search

**Working names:**

* Resources
* Library
* Knowledge
* Explorer
* Search

This area should provide a way to find learning resources across the OCS system.

Resources can be used by:

* Courses
* Lessons
* Assignments
* Capstone projects
* Students working independently

Current examples include:

* JavaScript
* Python
* Java
* SASS

Potential resources include:

* Language references
* Examples
* Tutorials
* Documentation
* How-to guides
* Code patterns
* OCS-specific tools
* Project resources

The distinction should be:

> **Courses tell students what they are doing.**
> **Resources help students figure out how to do it.**

Resources should answer:

> **I need to learn or look something up. Where do I find it?**

---

## 9. Profile

**Purpose:** Student identity, progress, activity, and personal dashboard.

Profile begins with:

* Login
* Logout
* Account information

But it should grow into the user's personal view of OCS.

### Identity

* Profile
* Account
* Roles
* Course enrollment
* Groups / teams

### Progress

* Assignments completed
* Lessons completed
* Projects
* Course progress
* Participation
* Activity

### Teaching

Because students teach and grade other students, Profile can also contain:

* Lessons taught
* Students graded
* Student grading panels
* Peer review activity
* Teaching history

### Analytics

* Assignment activity
* Learning activity
* Project activity
* Contributions
* System participation

### Dashboard

The dashboard should answer:

> **What is happening with me in OCS?**

---

## 10. Profile and Grading Communication

Profile and grading should not necessarily be read-only dashboards.

Where appropriate, users should be able to **dialog around the data**.

For example:

```text
Assignment
    │
    ▼
AI / Teacher / Peer Evaluation
    │
    ▼
Grade + Evidence
    │
    ▼
Discussion
    ├── Student Question
    ├── Grader Response
    ├── Follow-up
    └── Resolution
```

This could apply to:

* Assignment feedback
* AI grading
* Peer grading
* Student teaching
* Lesson reviews
* Project reviews

The goal is not to turn every screen into a chat room.

The goal is:

> **When a user needs to discuss a piece of OCS work, the conversation should live with the work.**

---

## 11. Communication

**Purpose:** OCS communication center.

Communication is effectively the OCS equivalent of a combination of Slack / Discord, but integrated directly into the learning system.

However, Communication should be understood as **both a global center and a contextual capability**.

A user should not have to leave an assignment, lesson, or Capstone project simply to communicate about it.

---

## 12. Contextual Communication

Communication can exist directly within:

* Course
* Week
* Sprint
* Assignment
* Student Lesson
* Capstone Project
* Mentor relationship
* Grading

Each context can have its own conversation.

Examples:

```text
Course
└── Course Chat

Week
└── Weekly Chat

Assignment
└── Assignment Chat

Lesson
├── Discussion
└── Reviews

Capstone
├── Project Discussion
└── Mentor Communication

Grading
└── Grading Discussion
```

> The communication should remain associated with the object being discussed.

---

## 13. Communication Center

The Communication Center aggregates activity from across OCS.

Possible categories:

```text
Communication
│
├── Course Chat
├── Weekly Chat
├── Assignment Chat
├── Lesson Discussion
├── Lesson Reviews
├── Capstone Projects
├── Mentor Communication
├── Grading Discussion
└── Direct Messages
```

The Communication Center can show:

* New messages
* Replies
* Mentions
* Feedback
* Reviews
* Mentor activity
* Grading conversations
* Subscribed conversations

The user should be able to move from an alert or conversation directly back to the relevant OCS object.

---

## 14. Communication as a System Capability

Communication should not be thought of as only a **Chat page**.

Instead:

> **Communication is a reusable OCS system capability.**

The same underlying interaction model could support:

* Course Chat
* Weekly Chat
* Assignment Chat
* Student Lesson Discussion
* Lesson Reviews
* Capstone Discussion
* Mentor Feedback
* Grading Dialogue
* Direct Messages

The UI can look different depending on context, but the underlying concepts can remain consistent.

---

## 15. Subscriptions

Users should be able to subscribe/unsubscribe to conversations and contexts.

Examples:

```text
CSSE → Week 4 Chat
CSA → Assignment: API Project
Capstone → RFID Attendance
Lesson → JavaScript Functions
Capstone → Mentor Feedback
```

A user should not have to repeatedly visit every page to see whether something has changed.

The system should know:

> **What conversations and activities does this user care about?**

---

## 16. Alerts

Alerts can be generated from subscribed communication.

Possible alerts:

* New message
* New reply
* Mention
* New mentor interest
* Mentor feedback
* New grading feedback
* New lesson review
* Response to a question
* Assignment discussion activity
* Course announcement

Alerts should be surfaced through the Communication Center.

Possible model:

```text
                  COMMUNICATION
                         │
              ┌──────────┴──────────┐
              │                     │
        Conversations            Alerts
              │                     │
       ┌──────┼──────┐       ┌──────┼──────┐
       │      │      │       │      │      │
     Course  Week  Capstone Mentor Grading Lesson
      Chat   Chat    Chat   Feedback Feedback Review
```

The system could eventually provide both:

* In-application alerts
* Notification indicators
* Optional external notifications

The specific notification mechanism can be determined later.

---

## 17. Flask

**`flask.opencodingsociety.com`**

Flask should remain focused on **core user and administrative information**.

Repository:

`Open-Coding-Society/flask`

Primary responsibilities:

* User tables
* User administration
* Account information
* Roles
* Authentication-related information
* Core information consumed by the Pages application
* Backup / Restore
* Migration of Data
* Archiving Data

Think of Flask as:

> **The administrative identity and account system.**

Flask does not need to own the richer student learning experience.

---

## 19. Spring

**`spring.opencodingsociety.com`**

Spring contains much of the more complex **transactional student data and system behavior**.

Repository:

`Open-Coding-Society/spring`

Examples include:

* AI Grading
* Chat
* Secondary Profile Information
* Assignment transactions
* Grading data
* Student activity
* Complex system services
* Migration of Data
* Archiving Data

Think of Spring as:

> **The transactional engine behind the OCS learning system.**

---

## 20. System Boundary

One goal of the redesign is to make the responsibilities of the three applications clearer.

A starting mental model:

```text
                         OCS
                          │
          ┌───────────────┴────────────────┐
          │                                │
  Student Experience                 System Services
          │                                │
          ▼                                ▼
   GitHub Pages                          Flask
          │                         Identity / Account
          │
          │
          ▼
       Spring
          │
          ├── Transactional Data
          ├── AI Grading
          ├── Communication
          ├── Student Activity
          └── Complex Services
```

This is not intended to be the final technical architecture.

It is a starting point for discussing:

* Ownership
* APIs
* Data boundaries
* Responsibilities
* User experience

---

## 21. Conversation as an OCS Primitive

The emerging design suggests that **Conversation** may become one of the reusable primitives of the OCS system.

Other potential primitives include:

* User
* Course
* Week
* Lesson
* Assignment
* Project
* Review
* Grade
* Mentor
* Subscription
* Alert

These objects can then interact.

For example:

```text
User
 │
 ├── takes → Course
 │
 ├── completes → Assignment
 │
 ├── creates → Lesson
 │
 ├── participates in → Project
 │
 ├── communicates through → Conversation
 │
 ├── receives → Review
 │
 ├── receives → Grade
 │
 ├── subscribes to → Conversation
 │
 └── receives → Alert
```

This could give the OCS system a consistent underlying grammar.

---

## 22. Design Principle: Conversation Lives With the Work

A useful question for every major OCS object is:

> **What is the conversation around this object?**

| OCS Object       | Communication                         |
| ---------------- | ------------------------------------- |
| Course           | Course / weekly chat                  |
| Week             | Weekly discussion                     |
| Assignment       | Assignment discussion                 |
| Student Lesson   | Microblogs, discussion, reviews       |
| Capstone Project | Team discussion, mentor communication |
| Mentor           | Interest, guidance, feedback          |
| Grading          | Student ↔ grader dialogue             |
| Profile          | Personal activity and feedback        |

The important principle is:

> **The conversation should live with the thing being discussed.**

The Communication Center then provides another way to discover and manage those conversations.

---

## 23. OCS Communication Is More Than Chat

The system should distinguish between different types of interaction.

### Discussion

Conversation between participants.

### Microblog

Short-form progress or reflection.

### Review

Structured qualitative or quantitative feedback.

### Rating

A structured measurement such as a Likert scale.

### Feedback

Specific guidance about an artifact or activity.

### Mentor Guidance

Project-specific advice and direction.

### Grading Dialogue

Conversation surrounding an evaluation.

### Alert

A notification that something relevant happened.

These may ultimately share infrastructure while presenting different user experiences.

---

## 24. Proposed OCS Navigation Model

A possible starting point:

```text
OCS
│
├── Home
│
├── Courses
│   ├── CSSE
│   ├── CSP
│   ├── CSA
│   └── CSH
│
├── Capstone
│   ├── Projects
│   ├── Teams
│   └── Mentors
│
├── Resources
│   ├── JavaScript
│   ├── Python
│   ├── Java
│   └── SASS
│
├── Communication
│   ├── Conversations
│   ├── Alerts
│   └── Subscriptions
│
└── Profile
    ├── Dashboard
    ├── Activity
    ├── Assignments
    ├── Lessons Taught
    ├── Grading
    └── Account
```

Again, this is a starting point for discussion.

---

## 25. The Student Mental Model

Ultimately, the interface should make this sequence natural:

```text
                 WHERE AM I?
                      │
              Course / Capstone
                      │
                      ▼
                WHAT AM I DOING?
                      │
             Assignment / Project
                      │
                      ▼
                HOW DO I DO IT?
                      │
                  Resources
                      │
                      ▼
              WHO DO I WORK WITH?
                      │
                 Communication
                      │
                      ▼
                 HOW AM I DOING?
                      │
              Profile / Grading
```

Communication cuts across all of these.

It is not necessarily another destination in the student's mental model.

It is the **interaction layer connecting the destinations**.

---

## 26. Redesign Questions

The team should not begin by asking:

> "How should this page look?"

Instead, begin with:

> **"What job does this part of OCS perform?"**

For every major area, investigate:

1. What exists today?
2. Who uses it?
3. What problem does it solve?
4. What data does it own?
5. What application should provide it?
6. What other systems does it interact with?
7. What should the student see?
8. What should the teacher see?
9. What should the mentor see?
10. What should the administrator see?
11. What communication belongs with it?
12. What should generate an alert?
13. What can a user subscribe to?
14. What should be removed?
15. What should be combined?
16. What should be renamed?

---

## 27. Capstone Team Task

This redesign should be treated as a **system design problem**, not simply a visual redesign.

The first deliverable should therefore be a:

> **Map of the OCS system**

rather than a collection of redesigned pages.

The team should identify:

### Information Architecture

What are the major OCS objects and areas?

### Navigation

How does a user move between them?

### Communication

Where does conversation occur?

### Subscriptions

What can users follow?

### Alerts

What events should notify users?

### Application Boundaries

Which system owns which capability?

### Data Ownership

Where does the authoritative data live?

### UI Patterns

What interactions should be consistent throughout OCS?

---

## 28. Potential Development Sequence

Once the system map is established, the work can progress through:

```text
1. System Map
       ↓
2. Information Architecture
       ↓
3. Navigation
       ↓
4. Communication Model
       ↓
5. Subscription / Alert Model
       ↓
6. Application Boundaries
       ↓
7. Reusable UI Patterns
       ↓
8. Page Redesigns
       ↓
9. API / Data Changes
       ↓
10. Implementation
```

This order is intentional.

> We should avoid redesigning individual pages before we understand the system they belong to.

---

## 29. Final Design Principle

The redesign should make OCS feel less like a collection of pages and more like a **coherent learning system**.

A student should be able to move naturally between:

```text
Learn
  ↓
Practice
  ↓
Build
  ↓
Communicate
  ↓
Get Feedback
  ↓
Reflect
  ↓
Improve
```

And the system should preserve evidence of that activity.

The ultimate question is:

> **Can a student, teacher, or mentor understand what is happening in OCS without having to understand how OCS itself is built?**

If the answer is yes, then the UI architecture is doing its job.
