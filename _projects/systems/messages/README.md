# Messages

`/dm` shows your groups and your direct messages side by side. Groups moved here
from `/student/groups`, so a student reaches a group's chat, members and files the
same way they reach a direct message.

## Files

| File | What it does |
| --- | --- |
| `navigation/dm.md` | The page (`/dm`) and its six dialogs, styled by `sass/` under `.dm`. The message list keeps the `chat-*` class names the course chats use, but none of their `.announcement-chat` rules. |
| `navigation/groups-redirect.md`, `navigation/group-dashboard-redirect.md` | `/student/groups/` and `/student/groups/dashboard/` send people to `/dm`. |
| `js/messages-page.js` | Starts the page: who is signed in, the two lists, opening a conversation, the group header buttons, the socket. |
| `js/conversation-embed.js` | One group chat or direct message inside another page, such as a UI Builder page. See [Embedding a conversation](#embedding-a-conversation). |
| `js/thread.js` | The open conversation: loads it, follows its socket topic, sends, edits and deletes, and keeps DM read state. An embed's pane can also be read-only, use the host's wording and be destroyed. |
| `js/message-log.js` | Draws the messages: day dividers, avatars, edit and delete buttons. Also the small text helpers the pane and the embed share. |
| `js/sidebar.js` | The Groups and Direct messages lists, as `ocs__nav-card` links. |
| `js/new-chat.js` | The New chat dialog. |
| `js/group-dialogs.js` | Find a group (search, join, make a group), Members (with Delete group at the bottom, for admins), and Files. |
| `js/delete-group.js` | The Delete group dialog: says what deleting takes away, and waits for the group's name. |
| `js/group-formation.js` | Form groups for a class: teachers and admins only. |
| `js/dialogs.js` | Opens and closes an `ocs__modal`; small table and button builders. |
| `js/messages-api.js` | Every Spring and Flask request. |
| `js/chat-socket.js` | The STOMP-over-SockJS connection to Spring's `/ws-chat`, one for `/dm` and one for each embed. |
| `js/messages-model.js` | Pure functions: one message shape for DMs and groups, labels, roles. |
| `js/formation-model.js` | Pure functions: the steps of forming groups. |
| `sass/` | The `/dm` skin, scoped under `.dm`; `.dm--embed` in `_layout.scss` fits an embed into its host's column. |
| `tests/*.test.mjs` | Node tests: the two model files, the sidebar, the message log, the pane, the embed, and the shared composer's `enterKey` and `destroy()`. |
| `tests/fake-dom.mjs` | A small stand-in for the browser DOM that the pane, log, embed and composer tests run on. |

The modules import each other with `./` paths only. The page imports `config.js` and
`rich-text.js` with `{{ site.baseurl }}` and passes them to `startMessagesPage`, so no
module needs a `../` path that breaks when files move.

## How a conversation works

- **Sending** goes over REST: `POST /api/dm/conversations/{id}/messages` with `{ body }`,
  or `POST /api/groups/chat/{id}/messages` with `{ message, image }` (Spring takes the
  sender from the session).
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
  stores only the sender's name, the signed-in account's, and Spring checks that name
  before an edit or delete, so the page matches your group messages by your name.
- **Read state:** opening a DM, or a message arriving while the tab is visible, posts
  `/read` and fires `dm:refresh-unread` for the navbar bell
  (`assets/js/api/dm-notifications.js`). The bell's `dm:unread` summary keeps the
  sidebar's DM counts current. Groups have their own counts for the sidebar
  (`GET /api/groups/chat/unread`): opening a group, or a message arriving while it is
  open, posts `/api/groups/chat/{id}/read`. The bell counts DMs only.

## Embedding a conversation

`js/conversation-embed.js` shows one conversation inside another page: a group's chat
(`mountGroupChat`) or a direct message (`mountConversation`). It builds the part of
`/dm`'s thread pane that `thread.js` needs, inside `div.dm.dm--embed` and with `/dm`'s
classes, so the same skin applies. `.dm--embed` keeps it in the host's column instead of
bleeding out of the wrapper, and gives the log a fixed height. Each embed has its own
pane and its own socket, so two on one page don't affect each other.

The build copies it with the other modules, so a page imports it from
`assets/js/projects/messages/` and hands in `config.js` and `rich-text.js`, as `/dm` does:

```html
<div id="teamChat"></div>
<script type="module">
  import * as config from '{{ site.baseurl }}/assets/js/api/config.js';
  import * as richText from '{{ site.baseurl }}/assets/js/chat/rich-text.js';
  import { mountGroupChat } from '{{ site.baseurl }}/assets/js/projects/messages/conversation-embed.js';

  const chat = await mountGroupChat(document.getElementById('teamChat'), { groupId: 12, config, richText });
  // Before the element goes: chat.destroy();
</script>
```

| Call | Options |
| --- | --- |
| `mountGroupChat(root, options)` | `groupId` (required), `config`, `richText`, `readOnly = false`, `heading = ''`, `texts = {}`, `formatBody = null` |
| `mountConversation(root, options)` | `conversationId` (required), `config`, `richText`, `heading = ''`, `texts = {}` |

- `config` is `assets/js/api/config.js`: `javaURI`, `javaWebSocketURI` and `fetchOptions`,
  `baseurl` for the sign-in link, and `springEnabled`. With `springEnabled: false` (a
  Flask-only site) the embed makes no request at all.
- An id is a positive whole number, or a string of digits.
- `readOnly` leaves out the composer, and edit and delete on your own messages.
- `heading` is shown above the log and names the chat for screen readers. Leave it empty
  when the host shows the title, as a UI Builder card does in its header.
- `formatBody(body, message)` returns what a message shows. The result still goes through
  the sanitizer, Edit still loads the body as sent, and if it throws the message shows
  as sent.
- `texts` is the host's wording for any key in the table below. Other keys, and values
  that aren't strings, are ignored, so a host can pass a bigger table.

Both return a promise of `{ state, destroy() }`. A wrong call rejects with a `TypeError`
that names the problem, and mounts nothing.

| `state` | When | The embed shows |
| --- | --- | --- |
| `ready` | Signed in to Spring | The conversation. |
| `signed-out` | `GET /api/person/get` answered 401, 403 or 404 | A link to `{baseurl}/login` worded by `texts.signIn`. No socket is opened. |
| `unavailable` | `spring: false`, or Spring didn't answer | `texts.unavailable`. |

`destroy()` stops following the topic, closes the socket (one still connecting too), takes
back the listeners the pane and its composer put on `document` and `window`, and empties
`root`. An element holds one embed at a time, so destroy it before mounting another.

| Key | Default |
| --- | --- |
| `loading` | Loading messages… |
| `emptyTitle`, `emptyHint` | No messages yet; Say hi to your group. (a DM: Say hi.) |
| `loadFailedTitle`, `loadFailedHint` | Could not load these messages; Check your connection, then reload the page. |
| `signIn` | Sign in to see this chat. |
| `unavailable` | This chat isn’t available right now. |
| `offline` | Live updates are off. Reload the page to see new messages. |
| `placeholder`, `send`, `save`, `cancel` | Type a message…; Send; Save; Cancel |
| `sendFailed` | Could not send the message. Try again. |
| `editFailed` | Could not save your edit. Try again. |
| `editOfDeleted` | That message was deleted, so your edit was not saved. |
| `deleteFailed` | Could not delete the message. Try again. |
| `waitForSave` | Wait for your message to finish saving first. |
| `you`, `edited`, `deleted` | You; (edited); This message was deleted. |
| `editMessage`, `deleteMessage` | Edit message; Delete message (button labels) |
| `imageFrom` | Image from {name} |
| `today`, `yesterday` | Today; Yesterday (day dividers; older days use the browser's date format) |
| `fileShared`, `fileSharedBySomeone` | {sender} shared a file:; A file was shared: |
| `fileGone`, `fileFailed` | {filename} is no longer shared with this group.; Could not download {filename}. Try again. |

`{name}`, `{sender}` and `{filename}` are filled in. `thread.js` also has `idleTitle`,
`idleHint` and `imageUnreadable`, which only `/dm` shows.

Under the embed, `createThread` takes `readOnly`, `emptyState` (`{ title, hint }`), `texts`
and `formatBody`, makes `onDmRead`, `onGroupRead` and `onFileShared` optional, and returns
`destroy()` next to `open`, `close` and `resume`. `/dm` passes none of the new options.
The composer comes from `assets/js/chat/rich-text.js`: its `destroy()` removes the
composer's `document` and `window` listeners and closes its emoji panel, and
`enterKey: 'newline'` makes Enter start a new line for form fields; chats keep the
default, `'send'`.

Things to know:

- Spring doesn't check group membership for group chat: any signed-in account can read and
  post to a group's chat by id, and anyone can subscribe to its topic. Showing a chat only
  to members is the host's choice (the UI Builder checks `viewerIsMember`), not access
  control.
- A DM embed marks the conversation read, as `/dm` does. A group embed leaves group unread
  counts alone; only `/dm` shows them.
- An embed has no image attach and no Members or Files dialog (`createDialog` in
  `dialogs.js` leaves a `document` listener it can't take back). A shared-file line in the
  log still downloads the file.
- If the connection drops, the embed says live updates are off and, like `/dm`, doesn't
  reconnect. Sending still works, and fetches the conversation afterwards.
- The composer toolbar's labels come from `rich-text.js` and read the same in every chat.

## Endpoints

Spring:

- `GET /api/person/get`, `GET /api/people/search?query=`
- `/api/dm/conversations` (list, start), `/api/dm/conversations/{id}/messages` (read,
  send, edit, delete), `POST /api/dm/conversations/{id}/read`
- `GET /api/groups/person/{personId}` (your groups), `GET /api/groups/search?name=`,
  `GET /api/groups` (Form groups only), `POST /api/groups`, `DELETE /api/groups/{id}`,
  `POST` and `DELETE /api/groups/{id}/members/{personId}`
- `/api/groups/chat/{id}/messages` (read, send, edit, delete), `/api/groups/chat/{id}/files`,
  `GET /api/groups/chat/unread`, `POST /api/groups/chat/{id}/read`
- STOMP over SockJS at `/ws-chat` (port 8589 on localhost)

Flask, for Form groups: `POST /api/persona/evaluate-group`, `POST /api/persona/form-groups`.

## Groups the page leaves alone

- **Course chat channels** (`lessons`, `<course>-announcements`, `<course>-week-<n>`) are
  the groups the course pages chat in. They never show in Find a group.
- **Class groups** (`CSSE`, `CSP`, `CSA`, `CSH`, Spring's `courses.class-groups`) follow
  the classes on a student's Profile, and the calendar reads them. They show under
  Groups, but have no Leave or Delete, and Find a group points to the Profile instead
  of offering Join.

## Deleting a group

- Only site admins can delete a group, and never a class group (`canDeleteGroup`).
  Delete isn't in the conversation header with the everyday buttons. It's a "Delete
  group" section at the bottom of the group's Members dialog.
- "Delete this group" opens a dialog that warns what goes: the group's grades and any
  assignments it submitted are deleted, and its members lose the group, its chat and its
  files. Delete stays off until the group's name is typed
  (`confirmsGroupName`: capitals count, extra spaces don't). Only then does the page
  call `DELETE /api/groups/{id}`.

## Things to know

- Spring lets any signed-in user delete a group or change its members. The page offers
  Delete only to admins, but the API doesn't check.
- Deleting a group deletes its Spring record: its member list, its grades and, by
  cascade, any assignments submitted as the group. Its chat and files stay in S3 under
  the group's name, where this page can't open them, since it looks groups up by id. A
  new group with the same name starts with an empty chat, since making a group writes a
  new chat file, but it lists the old group's files.
- Group names are unique across the site, and group chat history is stored by group
  name.

## Build and test

- Registered as `systems/messages:dev` in `_projects/.makeprojects`, so `make dev` serves
  `/dm`. The generated project Makefile copies `navigation/*.md` to
  `_posts/projects/messages/` and `js/` to `assets/js/projects/messages/`, which is where a
  host imports `conversation-embed.js` from.
- `node --test _projects/systems/messages/tests/*.test.mjs`. The pane, log, embed and
  composer tests run on `tests/fake-dom.mjs`, which has no layout or editing engine: how
  the embed looks, and what the browser types into the composer, still need a check in a
  browser.
