---
layout: post
title: "OCS Curriculum Mapping Matrix: Trimester 2 Learning Plan"
description: "Student-taught lessons about the OCS system for CS 111 to CS 113: schedule, weekly matrix, grading, lifecycle and publish checklist."
permalink: /csa/trimester-2-plan/
---

Students teach the class **about the OCS system**. Each lesson shows a real OCS feature, then the CS topic behind it: **predict → change → test → explain**.

We build on Trimester 1, Weeks 1–12. Students who need to review a prerequisite should revisit the relevant [APCSA lesson](https://pages.opencodingsociety.com/navigation/courses/csa/) and bring a specific question.

## Schedule (as set by the teacher)

| Day | What happens |
|---|---|
| **Mon, Nov 9** | **Kickoff:** the plan, the owner rotation, and a first look at the OCS system |
| **Mon** (after Nov 9) | **Review** of what we should know, and a **grading check-in** (Points and Progress on AP). No new lesson. |
| **Tue** | PBL + **last 15 min: student teaching session** |
| **Wed** | PBL |
| **Thu** | PBL + **last 15 min: student teaching session** |
| **Fri** | PBL |

Lessons are on Tue and Thu, never on two days in a row.

**Each lesson has three parts in the calendar:** it is *assigned* (owner and dates), it *opens* Tuesday after the introduction, and it *closes* at the next Monday check-in, which is the close day. A Monday holiday still counts as the close day. Once your work is submitted and AI graded, you can work on PBL.

**Teaching rules:**
- The owner sets a phone alarm, gets up on their own, takes control of the class, and rings the bell only when ready to teach.
- Teach table by table, or two tables at a time with the TV. **4-person instruction is not allowed.** Every table uses the same material.

**What fits in the 15 minutes** (Week 8 example):

| When | Time | Activity |
|---|---|---|
| Tue | 4 min | Show the real OCS feature: delete a DM and see the request |
| Tue | 5 min | Tech Talk: objective, success criteria, the starter bug |
| Tue | 6 min | Popcorn Hack: predict, then run the starter |
| Thu | 6 min | MCQ Check (4 questions) |
| Thu | 6 min | Guided start on Hack 1, with questions answered |
| Thu | 3 min | Closure: what is required, how to submit, when it closes |
| Homework | about 30 min | Hacks 1 to 3 (about 10 min each). The Reference Guide is for reading, not class time. |

## Curriculum Mapping Matrix

| Week | OCS System Feature | System / Network Layer | MiraCosta Course | Target CS Topic | Tue: Show it in OCS, then teach (15 min) | Thu: Prove (15 min) |
|---|---|---|---|---|---|---|
| **1** Nov 10 | **Session Cookies** | **HTTP Header Payload** (Stateless State) | **CS 111** | String parsing, substring matching, basic token validation conditional logic | Log in to OCS and find the session cookie in DevTools. Then: why does `contains("OCSSESSION")` also match `notOCSSESSION`? | Change it to `equals`. Test normal, look-alike and missing cookies. |
| **2** Nov 17 | **Chat CRUD Operations** | **HTTP REST API** (`POST`, `GET`, `PUT`, `DELETE`) | **CS 111** | Object variable mutation, data modeling, basic class methods | Post and edit an OCS chat message, and show each request in the Network tab. Then trace the `Message` object. | Fix `update()`. Test a valid edit and a missing ID. |
| **3** Nov 24* | **Role-Based Permissions (RBAC)** | **HTTP Gateway Middleware** / Guard Routing | **CS 112** | Interfaces, Abstract Classes, Polymorphic method overriding | Compare what an admin and a student can do in OCS. Then trace `canDelete()` through an interface, an abstract base class and an override. | Implement one rule. Test the owner, a non-owner and a logged-out user. |
| **4** Dec 1 | **Text & Image Chat Feed** | **HTTP File upload** / Polymorphic JSON payload | **CS 112** | Class Inheritance (`ImageMessage` extends a base `Message` class) | Post an image in OCS chat and show the JSON. Then predict the `render()` output for a mixed list. | Override `render()`. Reject an unsupported file type. |
| **5** Dec 8 | **Real-Time Update Alerts** | **WebSocket Broadcast Engine** (Bi-directional stream) | **CS 112** | Event-Driven Architecture, Asynchronous handlers, Observer Pattern | Open two OCS windows: one sends, the other gets the alert. Then trace subscribe, notify and unsubscribe. | Remove a listener. Show that it gets no more alerts. |
| **6** Dec 15 | **CS 112 Checkpoint** | (no new feature) | **CS 112** | Contracts and ordering (Collectables lesson) | A `Catalog<T extends Collectable>` stores the records, and a `Registry` analyzes them. Compare `Registry`'s `sortNatural()`, `sortByField()` and `orderBy()`. | Predict each method's output on a new record set. |
| **7** Jan 5 | **Sequential Chat Streams** | **WebSocket Message Stream** ingestion | **CS 113** | FIFO Queues, Doubly/Singly Linked Lists, chronological appending | Send fast messages in OCS chat and see that they arrive in order. Then use cards to track `head` and `tail`. | Write `enqueue()`. Test an empty, a 1-item and a 3-item queue. |
| **8** Jan 12 | **History Editing / Deletion** | **HTTP Mutation Routing** down to the memory layer | **CS 113** | Linked List Node traversal, index searching, and memory pointer manipulation | Edit and delete a message in OCS chat history. Then predict what the starter `delete(0)` does and run it *(see the example below)*. | Answer the MCQ, then start Hack 1: fix `delete()`. Test the head, middle, tail and an invalid index. |
| **9** Jan 19* | **Group Alert Routing** | **WebSocket Session Lookup** registry | **CS 113** | Hash Maps / Hash Tables | Send an alert to one OCS group. Then: how does `get(groupId)` find that group? What is a collision? | Fix `register()`. Test a repeated entry and a missing key. |
| **10** Jan 26 | **Group Alert Routing (cont.)** | WebSocket Session Lookup registry | **CS 113** | Adjacency Lists (mapping Group ID keys to connection values) | Leave an OCS group and show that no more alerts arrive. Then trace `groupId → set of sessions` and compare it with `Registry.groupBy()`. | Alert one group only. Handle a disconnected session. |
| **11** Feb 2 | **CS 113 Checkpoint** | (no new feature) | **CS 113** | Queue vs. list vs. map | Name the structure behind each OCS feature in Weeks 7 to 10, then pick a structure for 3 cases. | Fix one bug. Justify the choice with step counts. |
| **12** Feb 9 | **Review: all features** | Full request path | **CS 111–113** | Transfer to a new case | Trace one OCS request from end to end: a user leaves a group but stays connected. | Make one change. Test it and explain it. |

Dates are each week's Tuesday. \* Confirm with the teacher: Thanksgiving may cancel Thu, Nov 26, and Mon, Jan 18 is a holiday, so it counts as that week's close day. Winter break (Dec 19 to Jan 1) has no work.

If an OCS feature can't be shown live (for example, it isn't built yet), the owner says so and uses the prepared code demo instead.

## Example Lesson: Week 8, Removing a DM (History Deletion)

A DM thread is a list of messages in order. The textbook way to delete one is to unlink its node. **The real OCS does a soft delete:** `DELETE /api/dm/conversations/{id}/messages/{messageId}` keeps the row, clears its body and sets `deleted=true`, so the order and read markers are kept (`DirectMessageService.deleteMessage`). Only the sender may delete. The lesson teaches both ways.

The lesson follows the teacher's **1.02 Variables** model: Reference Guide, Real-Life Application, Tech Talk, Code Examples, Popcorn Hack, MCQ Check, 3 Homework Hacks (`delete(index)`, `deleteById`, soft delete), Grading Plan and LxD Cycle. 

The lesson has 5 code runners: an example, a popcorn starter, `delete(index)`, `deleteById` and soft delete. The three hack runners each end with `N / N passed`. The earlier `HistoryDeletion.java` files were the peer-tested first version; the starter bug below is unchanged.

```java
// Starter code: delete the node at index
Node cur = head;
for (int i = 0; i < index; i++) {
    cur = cur.next;
}
cur.next = cur.next.next;
```

**MCQ:** Start with `A → B → C → D` and run with `index = 0`. What is the result?
A) `B,C,D`  **B) `A,C,D`**  C) empty  D) exception

**Answer: B.** `head` still points to A, so the code removes B, not A.

| Test (fresh list each time) | Expected after the fix |
|---|---|
| `A,B,C,D`: delete 0 / 2 / 3 | `B,C,D` / `A,B,D` / `A,B,C` |
| `A`: delete 0 | empty |
| Index −1, or index ≥ size | `IndexOutOfBoundsException`; list unchanged |

Hack 2 adds `deleteById(id)`, which searches and then unlinks. Hack 3 adds `softDeleteById(id)`, which keeps the node and marks it `[deleted]`, the way OCS does.

## Proposed Grading (1 Point Total), following the 1.02 Variables lesson

Each lesson is one OCS assignment worth 1 point, split the same way as the teacher's 1.02 Variables lesson:

| Part | Points | What earns the points |
|---|---|---|
| Popcorn (in class) | 0.2 | The in-class task is done and its checker line is in the submission notes |
| MCQ | 0.2 | All correct; partial credit for some correct |
| Homework Hacks 1 to 3 | 0.6 | Each hack's runner prints `N / N passed` (e.g. Week 8: 0.2 / 0.15 / 0.25) |
| **Total** | **1.0** | |

- Submission is `code`: the code runners are submitted as a Gist for AI grading (`assignment_submission_type: code`).
- Popcorn hacks not finished in class come out of the rubric, as the teacher asked.
- The 1 to 3 hours a week covers the two 15-minute sessions plus the homework hacks (about 10 minutes each).

**Lifecycle, using the teacher's six steps:**

| Step | Who | What |
|---|---|---|
| 1. Design | Owner | Lesson, front matter, Grading Plan |
| 2. Open | Teacher | The teacher merges the lesson into the teacher's repo, and the sync script creates the Spring assignment |
| 3. Prepare / Test | Owner + teacher | Grade three sample answers (good, code-only, wrong) and check that the AI grade matches. Revise if it doesn't. |
| 4. Teach / Administer | Owner | Tue and Thu sessions; students submit |
| 5. Grade / Override | Owner (as Student Teacher) + teacher | Review the AI grades at the Monday check-in and propose overrides. The teacher approves them. Similarity concerns and petitions stay with the teacher. |
| 6. Close | Teacher | Close at the Monday check-in. Unfinished or ungraded work **stays visible** as unresolved; it is never marked complete. |

While the assignment is open, students can read the AI feedback, revise and resubmit.

## Lesson Owners

- Lesson owners and peer testers rotate, so every student has a named contribution. Owners test with a peer before Tuesday, teach table by table, and answer questions in Microblog/Chat.
- Owners are listed in `assignment_creator_uids`, which is how OCS knows who grades the lesson. Lessons use `team_teach: true`, so each student's homework waits for their feedback on the student-taught lesson.
- Owners review their lesson's grades at the Monday check-in (step 5 above).

**Presenter roster** (to fill in with the teacher; one owner or pair per week, never four):

| Week | Presenter(s) | Peer tester |
|---|---|---|
| 1 | | |
| … | | |
| 12 | | |

- Keep dates out of lessons. Link each lesson to its course/week, its calendar entry and its submission, and show each student their status and next action.

## Before Any Lesson Is Published

- [ ] The starter code runs and shows the intended bug. The fixed version passes all required tests.
- [ ] A peer ran it and tried one edge case.
- [ ] Front matter uses `course` and `week` (no `categories`), plus `assignment: true`, `team_teach: true`, `assignment_submission_type: code`, `assignment_creator_uids` and `points: 1.0`, the same as the 1.02 Variables lesson.
- [ ] All grading keys are present, including creators. The teacher removed `assignment: true` from incomplete lessons on Oct 2 (`b20aeb4`).
- [ ] The lesson body has no schedule text, and every runner ends with `N / N passed`.
- [ ] The lesson appears on the course page when built locally.
- [ ] The presenter is named in the roster, and the calendar has the lesson's open and close days.
- [ ] The Tue and Thu parts fit in 15 minutes each.
- [ ] The Education Team has reviewed it and approved publication.
- [ ] **Known gap:** the Topics page (`/topics/view/csa/cs113/`) only lists lessons with `categories`, because `topics.rb` doesn't read `course` yet. Until it does, the lesson can't appear there.
