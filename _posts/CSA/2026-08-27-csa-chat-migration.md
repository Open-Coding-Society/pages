---
layout: post
title: Moving CSA off Slack, one assignment at a time
description: >
  Class discussion is moving out of Slack and into the course site. Announcements
  and week chats already ship; next up is a thread on every assignment and 1:1
  direct messages.
comments: true
permalink: /csa/chat-migration
author: UGRC-CSA
---

## What's changing

- CSA discussion lives in Slack today. We're moving it onto the course site, next to the work it's about.
- Class-wide announcements and per-week chat already ship on the CSA page ([#24](https://github.com/UGRC-CSA/Pages/pull/24), writeup in [#25](https://github.com/UGRC-CSA/Pages/issues/25)).
- Still to build: a chat thread on every assignment, and 1:1 direct messages between people on the site.

## Why not stay on Slack

- A question about "Framework for Sprints" ends up in a general channel with nothing tying it to the assignment. The answer scrolls away and the next student asks it again.
- Slack is a second login and a second app. The site already knows who you are through the JWT session it holds against the Spring backend.
- Slack messages can't be attached to a course, a week, an assignment, or a person's progress. Unread badges on a task row, teacher moderation, "show me every question about Unit 3" all need the messages in our own database.
- History, search, and deletion become ours instead of a workspace admin's.

## What already works

![Class-wide announcement chat pinned to the top of the CSA course page]({{site.baseurl}}/images/csa-chat/announcement-chat.png)

*Main announcements page: one class-wide thread per course, pinned above the course timeline. Captured signed out, so it is running in local preview mode with sample messages.*

![Week 0 card with its per-week chat expanded below the assignment list]({{site.baseurl}}/images/csa-chat/week-chat.png)

*Sub-task chat system/UI: every week card carries its own thread, collapsed by default and scoped to that week. Same preview mode, same sample messages.*

- `_includes/announcement_chat.html` renders one class-wide thread per course, pinned at the top of the course page.
- `_includes/week_chat.html` renders one thread per week card (W0, W1, and so on), collapsed by default and separate from every other week.
- No backend changes were needed. Both widgets talk to the group chat already in `Open-Coding-Society/spring`: REST at `/api/groups`, STOMP over SockJS at `/ws-chat`, broadcasting on `/topic/group/{groupId}`.
- Groups create themselves on first use, so a new course or a new week works the first time someone opens it. Nobody has to seed a `Groups` row by hand.
- Signed-out visitors still get the whole UI. The widget falls back to a local preview mode backed by `localStorage`, which is what both screenshots above are showing.
- Both widgets were checked against a real local Spring instance rather than a mock: JWT login, group auto-creation, and live send/receive over the actual WebSocket. Full detail in [#25](https://github.com/UGRC-CSA/Pages/issues/25).

## What we want to add

### A thread on every assignment

The finest grain right now is a week, so every assignment inside Week 0 shares a single thread.

- One thread per assignment, keyed on the assignment's own slug (`csa-week-0-home-page-game-feedback`) instead of just the week.
- Rendered on the task row in the week card and on the assignment page itself.
- Same create-on-first-use behavior, so adding an assignment never means adding a database row.
- An unread count on the task row, so it's obvious where the conversation is.

### Direct messages

The design is settled in [#27](https://github.com/UGRC-CSA/Pages/issues/27) and nothing is built yet.

- A new backend domain at `mvc/directmessages/`, not two-person Groups. Access control is the whole feature here, and `GroupsApiController` / `GroupChatApiController` currently ship with their membership checks commented out. That's the right call for a class chat where everyone can read everything, and the wrong one for a DM.
- Two entities: `DirectMessageConversation` (participantA, participantB, unique and canonicalized so `A.id < B.id`) and `DirectMessage` (conversation, sender, body, sentAt).
- Stored in the database through JPA instead of the S3 JSONL files group chat uses. "Only these two people" has to be enforced in the query, and JPA gives us that.
- REST under `/api/dm`: list your conversations (identity read from `SecurityContextHolder`, no `personId` in the path), get-or-create a conversation from `otherPersonId`, and fetch messages with a 403 for anyone who isn't a participant. That check is the security boundary, so it does not get commented out.
- Realtime reuses the same broker rather than standing up a second endpoint. Clients send to `/app/dm.send`; the server broadcasts on `/topic/dm/{conversationId}`.
- Sender identity comes from the STOMP `Principal`, not from a name the client supplies. `GroupChatWebSocketController.resolveSender()` trusts the client today. A wrong display name in a class feed is survivable; a wrong sender on a private message is not.
- The frontend is `_includes/dm_chat.html`, reusing the connect/subscribe/send skeleton from the shipped widgets, plus a conversation list page.
- Open question: read receipts. There's no `readAt` column in the model above. Adding one now is cheap, and adding it after people have conversations is a migration.

### Moderation

- The backend already answers `DELETE /api/groups/chat/{groupId}/messages/{messageId}`, and nothing in the UI calls it. Teachers need a delete button before this replaces Slack for announcements.

## What has to land first

Straight off the [sprint board](https://github.com/orgs/UGRC-CSA/projects/1):

- **EC2 and infra** (Sathwik, Akhil, Skandan). The Spring backend only runs locally and on the maintainers' existing deploy, and chat is only as real as the backend it points at. [#5](https://github.com/UGRC-CSA/Pages/issues/5)–[#10](https://github.com/UGRC-CSA/Pages/issues/10) cover provisioning, CI/CD, HTTPS on a real domain, and monitoring. [#26](https://github.com/UGRC-CSA/Pages/issues/26) covers the Groups admin page, which now has chat-created rows sitting next to roster groups in one table with nothing to tell them apart.
- **CSA page and chat** (Samarth, Akshaj, Tarun). [#11](https://github.com/UGRC-CSA/Pages/issues/11) owns the page, [#13](https://github.com/UGRC-CSA/Pages/issues/13) polishes and extends the widgets, [#15](https://github.com/UGRC-CSA/Pages/issues/15) QAs them across every course and week.
- **DMs** (Perry, Syowns, Leon). [#17](https://github.com/UGRC-CSA/Pages/issues/17) is the design, now answered by [#27](https://github.com/UGRC-CSA/Pages/issues/27); [#19](https://github.com/UGRC-CSA/Pages/issues/19) is the conversation list and thread UI; [#21](https://github.com/UGRC-CSA/Pages/issues/21) is the Spring side.

One known gap worth repeating: group chat history lives in S3. Without credentials in the deploy environment, live send and receive work fine but scrollback comes back empty. That's already true of `lesson_chat.html`, so it isn't new, but it does block a real Slack migration.

## Following along

- Sprint plan: [#28](https://github.com/UGRC-CSA/Pages/issues/28)
- Chat build and verification: [#25](https://github.com/UGRC-CSA/Pages/issues/25), [#24](https://github.com/UGRC-CSA/Pages/pull/24)
- DM design: [#27](https://github.com/UGRC-CSA/Pages/issues/27)
- Board: [UGRC-CSA Pages — Sprint Board](https://github.com/orgs/UGRC-CSA/projects/1)
