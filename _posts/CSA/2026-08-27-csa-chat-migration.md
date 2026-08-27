---
layout: post
title: Communication System Features
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
- Class-wide announcements and per-week chat already ship ([#24](https://github.com/UGRC-CSA/Pages/pull/24), writeup in [#25](https://github.com/UGRC-CSA/Pages/issues/25)).
- Still to build: a thread on every assignment, and 1:1 direct messages.

## Why not stay on Slack

- Questions land in a general channel with nothing tying them to the assignment, then scroll away and get asked again.
- It's a second login and a second app. The site already knows who you are through its JWT session against the Spring backend.
- Slack messages can't attach to a course, week, assignment, or a person's progress, which is exactly what unread badges, teacher moderation, and "every question about Unit 3" need.
- History, search, and deletion become ours instead of a workspace admin's.

## What already works

![Class-wide announcement chat pinned to the top of the CSA course page]({{site.baseurl}}/images/csa-chat/announcement-chat.png)

*Main announcements page: one class-wide thread per course, pinned above the course timeline. Captured signed out, so it runs in local preview with sample messages.*

![Week 0 card with its per-week chat expanded below the assignment list]({{site.baseurl}}/images/csa-chat/week-chat.png)

*Sub-task chat system/UI: every week card carries its own thread, collapsed by default and scoped to that week.*

Both screenshots are **skeleton UI, not the final version**. Layout, styling, and copy will all change as the feature gets polished.

- `announcement_chat.html` renders one class-wide thread per course, pinned at the top of the page.
- `week_chat.html` renders one thread per week card (W0, W1, and so on), collapsed by default and separate from every other week.
- No backend changes needed. Both talk to the group chat already in `Open-Coding-Society/spring`: REST at `/api/groups`, STOMP over SockJS at `/ws-chat`, broadcasting on `/topic/group/{groupId}`.
- Groups create themselves on first use, so a new course or week works without anyone seeding a `Groups` row.
- Signed-out visitors get the whole UI through a `localStorage` preview mode, which is what the screenshots show.
- Checked against a real local Spring instance rather than a mock: JWT login, group auto-creation, live send and receive over the actual WebSocket ([#25](https://github.com/UGRC-CSA/Pages/issues/25)).

## What we want to add

### A thread on every assignment

The finest grain today is a week, so every assignment inside Week 0 shares one thread.

- One thread per assignment, keyed on its own slug (`csa-week-0-home-page-game-feedback`) instead of the week.
- Shown on the task row in the week card and on the assignment page.
- Same create-on-first-use behavior, so a new assignment never means a new database row.
- An unread count on the task row, so it's obvious where the conversation is.

### Direct messages

Design settled in [#27](https://github.com/UGRC-CSA/Pages/issues/27), nothing built yet.

- Its own backend domain at `mvc/directmessages/`, not two-person Groups. `GroupsApiController` / `GroupChatApiController` ship with membership checks commented out: right for a class chat where everyone can read everything, wrong for a DM.
- Two entities: `DirectMessageConversation` (participantA, participantB, unique and canonicalized so `A.id < B.id`) and `DirectMessage` (conversation, sender, body, sentAt).
- Stored in the database through JPA instead of the S3 JSONL files group chat uses, so "only these two people" is enforced in the query.
- REST under `/api/dm`: list your conversations (identity from `SecurityContextHolder`, no `personId` in the path), get-or-create from `otherPersonId`, and messages with a 403 for non-participants. That check is the security boundary, so it does not get commented out.
- Realtime reuses the same broker: clients send to `/app/dm.send`, the server broadcasts on `/topic/dm/{conversationId}`.
- Sender identity comes from the STOMP `Principal`, not a client-supplied name. `GroupChatWebSocketController.resolveSender()` trusts the client today, and a wrong name in a class feed is survivable where a wrong sender on a DM is not.
- Frontend `_includes/dm_chat.html` reuses the shipped connect/subscribe/send skeleton, plus a conversation list page.
- Still open: read receipts. No `readAt` column yet, which is cheap to add now and a migration later.

### Moderation

- The backend answers `DELETE /api/groups/chat/{groupId}/messages/{messageId}` and nothing in the UI calls it. Teachers need a delete button before this replaces Slack for announcements.

## What has to land first

Straight off the [sprint board](https://github.com/orgs/UGRC-CSA/projects/1):

- **EC2 and infra** (Sathwik, Akhil, Skandan). The Spring backend only runs locally and on the maintainers' deploy, and chat is only as real as the backend behind it. [#5](https://github.com/UGRC-CSA/Pages/issues/5)–[#10](https://github.com/UGRC-CSA/Pages/issues/10) cover provisioning, CI/CD, HTTPS on a real domain, and monitoring. [#26](https://github.com/UGRC-CSA/Pages/issues/26) covers the Groups admin page, where chat-created rows now sit beside roster groups with nothing to tell them apart.
- **CSA page and chat** (Samarth, Akshaj, Tarun). [#11](https://github.com/UGRC-CSA/Pages/issues/11) owns the page, [#13](https://github.com/UGRC-CSA/Pages/issues/13) polishes and extends the widgets, [#15](https://github.com/UGRC-CSA/Pages/issues/15) QAs them across every course and week.
- **DMs** (Perry, Syowns, Leon). [#17](https://github.com/UGRC-CSA/Pages/issues/17) is the design, answered by [#27](https://github.com/UGRC-CSA/Pages/issues/27); [#19](https://github.com/UGRC-CSA/Pages/issues/19) is the conversation list and thread UI; [#21](https://github.com/UGRC-CSA/Pages/issues/21) is the Spring side.

One gap worth repeating: group chat history lives in S3. Without credentials in the deploy environment, send and receive work but scrollback comes back empty. That's already true of `lesson_chat.html`, but it does block a real Slack migration.

## Following along

- Sprint plan: [#28](https://github.com/UGRC-CSA/Pages/issues/28)
- Chat build and verification: [#25](https://github.com/UGRC-CSA/Pages/issues/25), [#24](https://github.com/UGRC-CSA/Pages/pull/24)
- DM design: [#27](https://github.com/UGRC-CSA/Pages/issues/27)
- Board: [UGRC-CSA Pages — Sprint Board](https://github.com/orgs/UGRC-CSA/projects/1)
