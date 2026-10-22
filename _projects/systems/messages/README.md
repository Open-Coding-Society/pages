# Messages

`/dm` shows your groups and your direct messages side by side. Groups moved here
from `/student/groups`, so a student reaches a group's chat, members and files the
same way they reach a direct message.

## Files

| File | What it does |
| --- | --- |
| `navigation/dm.md` | The page (`/dm`) and its five dialogs. OCS grammar only; the message list and composer use the chat classes the course chats share (`.announcement-chat`). |
| `navigation/groups-redirect.md`, `navigation/group-dashboard-redirect.md` | `/student/groups/` and `/student/groups/dashboard/` send people to `/dm`. |
| `js/messages-page.js` | Starts the page: who is signed in, the two lists, opening a conversation, the group header buttons, the socket. |
| `js/thread.js` | The open conversation: loads it, follows its socket topic, sends, edits and deletes, and keeps DM read state. |
| `js/message-log.js` | Draws the messages: day dividers, avatars, edit and delete buttons. |
| `js/sidebar.js` | The Groups and Direct messages lists, as `ocs__nav-card` links. |
| `js/new-chat.js` | The New chat dialog. |
| `js/group-dialogs.js` | Find a group (search, join, make a group), Members, and Files. |
| `js/group-formation.js` | Form groups for a class: teachers and admins only. |
| `js/dialogs.js` | Opens and closes an `ocs__modal`; small table and button builders. |
| `js/messages-api.js` | Every Spring and Flask request. |
| `js/chat-socket.js` | The STOMP-over-SockJS connection to Spring's `/ws-chat`. |
| `js/messages-model.js` | Pure functions: one message shape for DMs and groups, labels, roles. |
| `js/formation-model.js` | Pure functions: the steps of forming groups. |
| `tests/*.test.mjs` | Node tests for the two model files. |

The modules import each other with `./` paths only. The page imports `config.js` and
`rich-text.js` with `{{ site.baseurl }}` and passes them to `startMessagesPage`, so no
module needs a `../` path that breaks when files move.

## How a conversation works

- **Sending** goes over REST: `POST /api/dm/conversations/{id}/messages` with `{ body }`,
  or `POST /api/groups/chat/{id}/messages` with `{ name, message }`.
- **Receiving** goes over the socket: the page follows `/topic/dm/{id}` or
  `/topic/group/{id}` for the open conversation. It follows the topic before asking
  for the history, and holds any frame that arrives first until the history is drawn,
  so nothing posted in between is lost. If the socket connects after a conversation
  opened (a `?group=` link), the page fetches what was posted in the meantime. The
  message list skips anything it has already drawn.
- **Your own message** shows when it comes back on the topic, so it is never drawn
  twice. Offline, the page fetches the conversation after a send instead. The send
  already succeeded, so a failed fetch isn't reported as a failed send.
- **Edits and deletes** are `PATCH` and `DELETE` on the message; Spring sends the change
  to everyone on the topic.
- **Which messages are yours:** a DM carries the sender's uid. A saved group message
  stores only the sender's name, and Spring checks that name before an edit or delete,
  so group messages are sent with the account's name and matched by it.
- **Read state** is for DMs only: opening a DM, or a message arriving while the tab is
  visible, posts `/read` and fires `dm:refresh-unread` for the navbar bell
  (`assets/js/api/dm-notifications.js`). The bell's `dm:unread` summary keeps the
  sidebar counts current. Group chat has no unread counts in Spring.

## Endpoints

Spring:

- `GET /api/person/get`, `GET /api/people/search?query=`
- `/api/dm/conversations` (list, start), `/api/dm/conversations/{id}/messages` (read,
  send, edit, delete), `POST /api/dm/conversations/{id}/read`
- `GET /api/groups/person/{personId}` (your groups), `GET /api/groups/search?name=`,
  `GET /api/groups` (Form groups only), `POST /api/groups`, `DELETE /api/groups/{id}`,
  `POST` and `DELETE /api/groups/{id}/members/{personId}`
- `/api/groups/chat/{id}/messages` (read, send, edit, delete), `/api/groups/chat/{id}/files`
- STOMP over SockJS at `/ws-chat` (port 8589 on localhost)

Flask, for Form groups: `POST /api/persona/evaluate-group`, `POST /api/persona/form-groups`.

## Groups the page leaves alone

- **Course chat channels** (`lessons`, `<course>-announcements`, `<course>-week-<n>`) are
  the groups the course pages chat in. They never show in Find a group.
- **Class groups** (`CSSE`, `CSP`, `CSA`, `CSH`, Spring's `courses.class-groups`) follow
  the classes on a student's Profile, and the calendar reads them. They show under
  Groups, but have no Leave button, and Find a group points to the Profile instead of
  offering Join.

## Things to know

- Spring lets any signed-in user delete a group or change its members. The page shows
  Delete only to admins, but the API doesn't check.
- Group names are unique across the site, and group chat history is stored by group
  name.

## Build and test

- Registered as `systems/messages:dev` in `_projects/.makeprojects`, so `make dev` serves
  `/dm`. The generated project Makefile copies `navigation/*.md` to
  `_posts/projects/messages/` and `js/` to `assets/js/projects/messages/`.
- `node --test _projects/systems/messages/tests/*.test.mjs`
