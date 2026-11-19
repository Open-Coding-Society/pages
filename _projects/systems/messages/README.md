# Messages

`/dm` shows your groups and your direct messages side by side. Groups moved here
from `/student/groups`, so a student reaches a group's chat, members and files the
same way they reach a direct message.

## Files

| File | What it does |
| --- | --- |
| `navigation/dm.md` | The page (`/dm`) and its six dialogs, styled by `sass/` under `.dm`. It fills the window under the site header: `full_width: true` widens the layout, and a few lines of inline script measure the header into `--dm-top` and, on a phone, swap the list for the open conversation. The message list keeps the `chat-*` class names the course chats use, but none of their `.announcement-chat` rules. |
| `navigation/groups-redirect.md`, `navigation/group-dashboard-redirect.md` | `/student/groups/` and `/student/groups/dashboard/` send people to `/dm`. |
| `js/messages-page.js` | Starts the page: who is signed in, the two lists, opening a conversation, the group header buttons, the socket. |
| `js/conversation-embed.js` | One group chat or direct message inside another page, such as a UI Builder page. See [Embedding a conversation](#embedding-a-conversation). |
| `js/thread.js` | The open conversation: loads it, follows its socket topic, sends, edits and deletes, and keeps DM read state. An embed's pane can also be read-only, use the host's wording and be destroyed. |
| `js/message-log.js` | Draws the messages: day dividers, avatars, reply, pin, edit and delete buttons, pin notes, and the image viewer; code blocks, shared files and link cards come from the modules below. Also the small text helpers the pane and the embed share. |
| `js/sidebar.js` | The Groups and Direct messages lists, as `ocs__nav-card` links, each starting with an `ocs__avatar` of the name's initials. |
| `js/new-chat.js` | The New chat dialog. |
| `js/group-dialogs.js` | Find a group (search, join, make a group) and Members (with Delete group at the bottom, for admins). |
| `js/files-model.js` | Pure functions for shared files: planning a share (folders keep their paths, clutter is skipped, taken names become "name (2)"), the `[[files:…]]` marker, sizes, icons, and the folder tree. |
| `js/group-files.js` | `GroupFiles`: one group's shared files. The list without bytes, one file's bytes, a folder's files for a .zip, and uploads with progress, three at a time. |
| `js/composer-files.js` | The composer's Attach menu, the Files and Folder pickers, dropping files or folders on the conversation, and sharing them before the message sends. |
| `js/attachments.js` | The tray above the composer: what waits to be shared, what was left out and why, and each item's upload progress. Also walks a dropped folder. |
| `js/conversation-panel.js` | The Shared panel: a conversation's Files (groups), Media, Links and Pinned, in the grammar's tabs. |
| `js/files-panel.js` | The Shared panel's Files tab: a group's files as folders, with breadcrumbs, a name filter, previews, downloads and a folder as .zip. |
| `js/conversation-model.js` | Pure functions for pins (`[[pin:<id>]]` messages), and the links and media a conversation holds. |
| `js/file-actions.js`, `js/file-viewer.js` | What a shared file's buttons do (download, preview, open a folder, .zip), and the preview: an image, video, sound, PDF or the start of a text file. |
| `js/zip-store.js` | A stored (uncompressed) ZIP writer, so a shared folder downloads as one file. |
| `js/popup-menu.js` | A menu a button opens (`ocs__menu`), with the arrow keys, Escape and click-away. |
| `js/slash-commands.js` | The slash commands, grouped, and matching what's typed against them. |
| `js/command-menu.js` | The slash-command menu over the composer (`ocs__menu`, `role="listbox"`): ↑ ↓, Enter or Tab, Escape. |
| `js/code-model.js`, `js/code-composer.js` | The `[[code:…]]` marker and its languages, and the code box `/code` and `/gist` open above the composer. |
| `js/chat-commands.js` | `ChatCommands`: what the slash commands and a message's More menu do in the open conversation (GitHub links, `/newissue`, gists, `/me`, `/shrug`), and the repository each chat last named. |
| `js/code-block.js` | A code block in the log: the code as text, Copy, Run and Save as gist. |
| `js/file-rows.js` | The files a message shares, as `ocs__file` rows with their buttons, and small previews for a few images. |
| `js/message-more.js` | A message's More menu (Copy text, Add to calendar, New GitHub issue): one menu for everything that isn't Reply, Pin, Edit or Delete. |
| `js/github-links.js` | Reading GitHub links (issues, pull requests, commits, repos, gists) and building one from "owner/repo#12". |
| `js/shortcuts.js`, `js/help-dialog.js` | The keyboard shortcuts, and `/help`'s list of them and of every slash command, drawn from the same lists the page runs on. |
| `js/github-cards.js` | Live cards (`ocs__link-card`) for the GitHub links in a message: an issue's or pull request's title, state, author, size and checks; a commit; a repository; a gist. |
| `js/delete-group.js` | The Delete group dialog: says what deleting takes away, and waits for the group's name. |
| `js/group-formation.js` | Form groups for a class: teachers and admins only. |
| `js/dialogs.js` | Opens and closes an `ocs__modal`; small table and button builders. |
| `js/messages-api.js` | Every Spring and Flask request. |
| `js/message-search.js` | The search box in a direct message's header: debounced query for that chat, matches listed under the header with the match marked, and jumping to the one picked. |
| `js/schedule-model.js` | "Add to calendar" without the page: the plain text of a message, the date and time it mentions (today, Friday, Nov 20, 3pm...), a starting title, and the request Spring's calendar takes. A message is turned into text once, and the description it writes holds no raw `<`, because `/student/calendar` shows a description as HTML. |
| `js/schedule-dialog.js` | The dialog opened by Add to calendar in a message's More menu: title, day and optional time, then saves one event to your own calendar. A reply's `[[reply:...]]` marker is left out of the text (`richText.stripChatMarkers`). |
| `js/chat-socket.js` | The STOMP-over-SockJS connection to Spring's `/ws-chat`, one for `/dm` and one for each embed. |
| `js/messages-model.js` | Pure functions: one message shape for DMs and groups, labels, roles. |
| `js/formation-model.js` | Pure functions: the steps of forming groups. |
| `sass/` | The `/dm` skin, scoped under `.dm`. File rows, menus and progress bars are the shared grammar (`ocs__file`, `ocs__menu`, `ocs__progress` in `_sass/open-coding/elements/`); `sass/` only places them; `.dm--embed` in `_layout.scss` fits an embed into its host's column. It has no palette or scale of its own: `_tokens.scss` aliases the site's theme tokens and the shared scale in `_sass/open-coding/mixins/_variables.scss`, and no partial holds a literal colour. See [Styling under a user theme](#styling-under-a-user-theme). |
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
  sidebar's DM counts current. Groups have their own counts
  (`GET /api/groups/chat/unread`): opening a group, or a message arriving while it is
  open, posts `/api/groups/chat/{id}/read` and fires `dm:group-read` for the bell.
- **The bell** counts conversations waiting: each person with unread DMs, plus each
  group with unread messages. Spring counts a group by reading its whole chat file, so
  the bell asks about groups when a page loads, when the tab comes back to the front
  and at most every two minutes, not on its 30-second DM poll. Its `dm:unread`
  summary carries the group counts too (`groups`, by group id), and the sidebar takes
  them from there instead of asking Spring again. `/dm` asks once itself, when the
  groups load.

## Sharing files and folders

In a group chat, Attach (or dropping anything on the conversation) adds files or a whole
folder to the tray above the composer; Send uploads them, then sends the message. In a
direct message only an image can be attached: Spring stores shared files for groups only.

- **Paths.** A file from a folder keeps its folders: `team-site/css/main.css`. Spring
  stores it at that path under the group's shared files, so the Files panel shows the
  folder as it was.
- **What's left out.** `.git`, `node_modules`, `__pycache__`, `.venv`, `venv`,
  `.ipynb_checkpoints`, `.DS_Store` and `Thumbs.db` are skipped (a dropped folder of that
  name isn't even opened), and the tray says how many. A file over 35 MB is set aside too:
  Spring and nginx take 50 MB bodies and base64 makes a file a third bigger. A share holds
  at most 500 files, and at most 50 loose ones (more go in a folder).
- **Names already taken.** A second `report.pdf` goes up as `report (2).pdf`, and a second
  `project` folder as `project (2)`, so an older message's file isn't replaced. Send asks
  Spring for the group's list first, because the page only hears about shares in the open
  conversation: a list kept from earlier could miss a teammate's file of the same name.
  Spring never writes over a shared file either: when two people share `notes.md` at the
  same moment, the second upload is refused (409), and the page shares that file again as
  `notes (2).md`. A refused file inside a folder is left off the message, which says so,
  since renaming it alone would split its folder.
- **The message.** It starts with a `[[files:…]]` marker after any reply marker:
  `f~path~size` for a file and `d~path~count~size` for a folder, separated by `;`, with
  `%`, `[`, `]`, `|`, `;`, `~`, `<`, `>`, `&` and control characters escaped as `%XX`.
  The log shows each as an `ocs__file` row (Preview, Download; a folder's Open and .zip),
  and up to four shared images as small previews. A file that fails is left off the
  message, which says so; if the message itself fails after the upload, the next Send
  sends it without uploading again.
- **The socket.** Spring's `sendFileServer` frame now names the file and its size but not
  its bytes, and the page adds nothing to the log for it (the share's message lists the
  files); it only marks the group's file list out of date.
- **The Files tab** of the Shared panel (or a folder's Open) lists the group's files as
  they are when it opens, as folders with breadcrumbs, filters by name, previews (images, video, sound, PDF, the
  first 512 KB of text and code), downloads, and zips a folder (up to 1 GB, built in the
  browser).

## Pins and the Shared panel

- **Pins.** Each message has a Pin button. Pinning sends a message of its own,
  `[[pin:<message id>]]` (`[[unpin:…]]` to take it off), so every member sees the same pins
  without new storage, like Slack's "pinned a message". The log shows it as one line,
  "Ada pinned a message: …", whose words jump to the message, and marks the pinned
  message. Deleting the pin message takes the pin away. `currentPins` replays them in order.
- **Shared** (in the conversation header, for groups and direct messages) opens the panel:
  Files (groups only), Media (images sent in messages, and shared image and video files),
  Links (GitHub first) and Pinned, each with a count. Media, Links and Pinned read the
  messages the conversation already loaded, so opening them asks Spring for nothing.
  Show in the chat closes the panel and marks the message.

## Slash commands and code

Typing `/` at the start of a message opens the command menu, grouped and narrowed as you
type (a command's keywords count too: `/upload` finds `/file` and `/folder`). ↑ ↓ move,
Enter or Tab picks, Escape closes. A command that needs words (`/issue owner/repo#12`)
is filled in for you to finish, and Enter (or Send) then runs it instead of sending it.

| Group | Commands |
| --- | --- |
| Share | `/file`, `/folder` (groups), `/image`, `/code [language]`, `/gist [file name]` |
| GitHub | `/issue`, `/pr`, `/commit`, `/repo` post the link (`owner/repo#12`, `owner/repo@sha`, `owner/repo`; after one, `#12` is enough in that chat), `/newissue owner/repo title` opens GitHub's new-issue form filled in |
| This chat | `/files` (groups), `/media`, `/links`, `/pinned`, `/members` (groups), `/search` (direct messages), `/help` |
| Message | `/me text` (in italics), `/shrug [text]` |

- **Code blocks.** `/code` opens a code box above the composer (a language, Tab
  indents, Ctrl or Cmd+Enter sends); the message's text goes with it as a caption. The
  code travels as `[[code:<language>|<code>]]` with `%`, `[`, `]`, `|`, `<`, `>`, `&` and
  control characters escaped, and the log draws it as text in a `pre`, never as markup.
  Each block has Copy, Save as gist, and for Python, Java and JavaScript, Run: the same
  `/run/python`, `/run/javascript` (Flask) and `/run/java` (Spring) routes the lesson
  code runners use, with the output shown under it. A direct message holds 2,000
  characters, so longer code there should be a gist.
- **Gists.** `/gist` and Save as gist call `POST /api/grades/create-gist` with the
  student's own GitHub token (Profile's GitHub Gist connection), making a secret gist.
  Without a token Spring answers 409 and the page links to that card.
- **The repository a chat last named** is kept in this browser's localStorage
  (`ocs-messages-repo:<kind>:<id>`), a convenience only.
- The course announcement chats have their own `/event` commands (Courses'
  `calendar-command.js`), unchanged.

## Keys

| Keys | What it does |
| --- | --- |
| Ctrl or ⌘ + K | Find a conversation: type, then Enter opens the first match |
| Alt or ⌥ + ↑ / ↓ | The conversation above or below, in the sidebar's order (left to a field being typed in, except the conversation search and an empty message box) |
| Ctrl or ⌘ + / | Show every slash command |
| Enter / Shift+Enter / Ctrl or ⌘+Enter | Send / new line (in a list, the next item) / send from the code box |
| Esc | Close a menu, a reply or an edit |

`/help` opens "Commands and keys", which lists these and every command. The message box's
placeholder says "Write a message, or type / for commands".

## GitHub cards

Up to three GitHub links in a message get a card under it (`ocs__link-card`, in
`_sass/open-coding/elements/link-cards`). The card is drawn from the link at once
(`owner/repo #12`) and filled in when it scrolls near the screen: an issue's title, state
(Open, Closed, Not planned), author, comments and labels; a pull request's title, state
(Open, Draft, Merged, Closed), author, files and lines changed, and for an open one its
checks (passed, failed, running); a commit's first line, author and lines; a repository's
description, language, stars, forks and open issues; a gist's description and files.

- **GitHub's limit.** Without a token GitHub allows 60 requests an hour for a whole
  network, and a school is one network. So an item is fetched once, kept 10 minutes in
  memory and in localStorage (`ocs-github:<path>`), asked for only when on screen, and an
  open pull request's checks are the only second request. After a 403 or 429 for the limit
  (its headers, which GitHub's CORS exposes, or the body's "rate limit"), no card asks
  again until GitHub's reset time (`ocs-github:limited-until`), and each says when details
  come back. A private or missing item says so.
- **Gists** are read through Spring's `GET /api/grades/read-gist/{id}`, which uses the
  server's token and doesn't count against the network.
- **More** on a message: Copy text, and New GitHub issue, which puts
  `/newissue owner/repo <the message's words>` in the composer (the repository the chat
  last named, or the one the message links to). Enter opens GitHub's new-issue form with the
  message quoted and a link back, and the student submits it as themselves.

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
| `imageMessage`, `filesMessage` | Image; Files (what a reply quotes when the message has no text) |
| `sharedButNotSent` | Your files are shared, but the message didn’t send. Press Send to try again. |
| `folderFiles` | {files} · {size} (a shared folder's line) |
| `previewFile`, `downloadFile`, `openFolder`, `zipFolder` | Preview {name}; Download {name}; Open {name} in Files; Download {name} as a .zip (button labels) |
| `imagePreview` | {name}, shared by {sender} |
| `pinMessage`, `unpinMessage`, `pinned` | Pin; Unpin; Pinned |
| `pinnedNote`, `unpinnedNote`, `aMessage` | {name} pinned a message:; {name} unpinned a message:; a message |
| `pinFailed` | Could not change the pin. Try again. |
| `copyCode`, `copied`, `copyFailed`, `runCode`, `running`, `output`, `runFailed`, `noOutput`, `saveGist`, `savedGist` | A code block's buttons and its output |
| `codeMessage`, `badGitHubRef`, `newIssueNeedsRepo`, `newIssueBody`, `tooLongForDm`, `gistConnect`, `gistConnectLink`, `gistFailed` | Slash commands' and gists' messages |
| `moreActions`, `copyText`, `newIssue`, `copiedMessage`, `copyMessageFailed`, `issueQuote`, `issueNeedsRepo` | A message's More menu |
| `openImage`, `closeImage` | View image from {name} larger; Close image (the image viewer) |
| `today`, `yesterday` | Today; Yesterday (day dividers; older days use the browser's date format) |

`{name}`, `{sender}`, `{files}` and `{size}` are filled in. `thread.js` also has `idleTitle`,
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
  counts alone, so the group stays on the navbar bell until it's opened in `/dm`.
- An embed has no Attach and no Members or Files dialog (`createDialog` in `dialogs.js`
  leaves a `document` listener it can't take back). Files shared in the group still list
  under their message, and preview and download from there.
- Clicking an image in an embed opens it in the log's own viewer, not a new tab. The
  viewer is built on the first click inside the embed's `.dm` root, and `destroy()` takes
  it and its Escape listener off the page, so unlike the dialogs it leaves nothing behind.
- If the connection drops, the embed says live updates are off and, like `/dm`, doesn't
  reconnect. Sending still works, and fetches the conversation afterwards.
- The composer toolbar's labels come from `rich-text.js` and read the same in every chat.

## Endpoints

Spring:

- `GET /api/person/get`, `GET /api/people/search?query=`
- `/api/dm/conversations` (list, start), `/api/dm/conversations/{id}/messages` (read,
  send, edit, delete), `POST /api/dm/conversations/{id}/read`,
  `GET /api/dm/search?q=` (your direct messages only, 2-100 characters, newest 50;
  add `&conversationId=` for one chat, which is what the page does; group chats are
  not searched)
- `POST /api/calendar/add_event` (Add to calendar: `title`, `date`, `description`, `type`, `period`; no
  `individual`, so Spring files the event under whoever is signed in -- a blank one would show it to everyone.
  The calendar keeps a date only, so a time is written into the title and description)
- `GET /api/groups/person/{personId}` (your groups), `GET /api/groups/search?name=`,
  `GET /api/groups` (Form groups only), `POST /api/groups`, `DELETE /api/groups/{id}`,
  `POST` and `DELETE /api/groups/{id}/members/{personId}`
- `/api/groups/chat/{id}/messages` (read, send, edit, delete),
  `GET /api/groups/chat/unread`, `POST /api/groups/chat/{id}/read`
- Shared files: `POST /api/groups/chat/{id}/files` (`{filename, base64Data}`, sent with
  XMLHttpRequest for its progress; 409 when that path is already shared),
  `GET /api/groups/chat/{id}/files/index` (paths, sizes and who shared them, no bytes) and
  `GET /api/groups/chat/{id}/files/content?path=` (one file's bytes). The index and content
  routes, and the 409, are new in Spring's `feat/group-files-index`, which has to deploy
  before this page.
- STOMP over SockJS at `/ws-chat` (port 8589 on localhost)

Flask, for Form groups: `POST /api/persona/evaluate-group`, `POST /api/persona/form-groups`.

Code blocks' Run: `POST {pythonURI}/run/python`, `POST {pythonURI}/run/javascript` and
`POST {javaURI}/run/java` with `{ code }`, answered `{ output }` (the lesson runners' routes).
Gists: `POST /api/grades/create-gist` (Spring). GitHub cards read `api.github.com` directly.

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

## Styling under a user theme

A student's theme (`assets/js/user-preferences.js`, `_sass/open-coding/theme/user-preferences.scss`)
overrides more than colours, and three of its rules decide how `sass/` is written:

- Every `p`, `span`, `div`, `small`, `label`, `li` and heading gets the text colour with
  `!important`, so a muted colour on one of them does nothing. Secondary text uses the
  `dm-quiet` mixin instead, which keeps the text colour and lowers the opacity; it reads
  the same with a theme and without one. Elements the theme leaves alone (`strong`,
  `time`, `abbr`, `kbd`, buttons) can still take a colour.
- Every `button` gets the panel background and an accent border from
  `.user-theme-active button`, and `color: inherit !important`. Button rules here start
  with `.dm ` to outrank the first, and Send sets its label colour with `!important` so
  the page colour, not the text colour, sits on the accent.
- The grammar turns every `ocs__nav-card-title` to the accent with `!important`. In a
  list of people that colours every name, so the list sets them back to the text colour
  and keeps the accent for the selected row and the unread count.

The image viewer's `z-index` is one above the site header's (`_sass/open-coding/navbar.scss`),
because it is modal and the header would otherwise sit over its close button.

## Build and test

- Registered as `systems/messages:dev` in `_projects/.makeprojects`, so `make dev` serves
  `/dm`. The generated project Makefile copies `navigation/*.md` to
  `_posts/projects/messages/` and `js/` to `assets/js/projects/messages/`, which is where a
  host imports `conversation-embed.js` from.
- `node --test _projects/systems/messages/tests/*.test.mjs`. The pane, log, embed,
  composer and file-sharing tests run on `tests/fake-dom.mjs`, which has no layout or editing engine: how
  the embed looks, and what the browser types into the composer, still need a check in a
  browser.
