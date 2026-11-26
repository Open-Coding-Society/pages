# Calls architecture

How `/calls/` fits together: which module does what, the states the page goes through, and what
each test covers. The Spring side is `mvc/calls` in the Spring repo (its `docs/calls-architecture.md`).

## Modules

Each module exports one class (two in `calls-api.js`). Helpers are static, used like Java's `Math`
(`CallModel.format(...)`); anything with state or UI is made with `new`. Modules import each other
with `./` only. The page script imports `config.js`, `rich-text.js` and Messages'
`conversation-embed.js` with `{{ site.baseurl }}` and hands them in.

| Module | Class | What it does |
|---|---|---|
| `call-page.js` | `CallPage` | Starts the page: reads the link, opens the room, runs the lobby, gets the token, then the call, the people and the chat. |
| `calls-api.js` | `CallsApi`, `CallsApiError` | Spring's `/api/calls` routes, with the sign-in cookie and `X-Origin`. A refusal keeps Spring's `{"reason"}` and `Retry-After`. |
| `call-model.js` | `CallModel` | Pure helpers: the room a link names, the words for each reason, initials, role labels, the order people show in, paused or not. |
| `call-room.js` | `CallRoom` | One LiveKit room: connects, sends the lobby's tracks, plays everyone's sound, and turns LiveKit's events into a few the page redraws on. |
| `call-lobby.js` | `CallLobby` | The preview, the Mic and Camera toggles and Join. It owns the camera and microphone until a join works. |
| `call-stage.js` | `CallStage` | Shared screens, and one cell per person: two big cells a row while the call is small, the card grid once it grows. Each person keeps one `<video>` for the whole call. |
| `call-controls.js` | `CallControls` | The toolbar. |
| `call-people.js` | `CallPeople` | The people list, and a teacher's Pause, Resume, Remove and End. |
| `call-confirm.js` | `CallConfirm` | The modal that asks before Remove or End. |
| `call-dom.js` | `CallDom` | The element shapes, all from the grammar; text goes in as text. |
| `livekit-script.js` | `LiveKitScript` | Loads livekit-client 2.23.0 from cdnjs once, with its integrity hash. Only `/calls/` loads it. |
| `call-link.js` | `CallLink` | The address of a group's or DM's call. |
| `call-entry.js` | `CallEntry` | Calls' hook in Messages: the Call link, and the "call is on" line once Spring confirms it. |

## The page's states

`CallPage.start` resolves with the page; `page.state` says where it is.

| State | When | What shows |
|---|---|---|
| `unavailable` | a Flask-only site; Spring's calls off (404 `calls_disabled`), unreachable or 5xx | a callout, and Try again when Spring didn't answer |
| `no-room` | the link names no group, DM or course, or two of them | a callout and a link to Messages |
| `signed-out` | 401 | a callout and Sign in |
| `refused` | 403 `NOT_A_MEMBER`, 404 `UNKNOWN_CONTEXT`, 403 `REMOVED` | a callout |
| `lobby` | the room is open; also after a 503 for the token or a failed connection | the lobby |
| `waiting` | the token is refused with `WAITING_FOR_SUPERVISOR` or `WAITING_FOR_SECOND_ADULT` | the lobby says why and keeps the preview. Every `wait_retry_seconds` it looks at the room (`GET /api/calls/{id}`) and asks for a token again when someone has come or gone, or after `wait_looks_per_try` looks. A refused token is a red 403 line in the browser's console, and the room's 200 isn't. |
| `ready` | connected | the toolbar, the stage and the people list |
| `ended` | you left, were removed, a teacher ended the call, or it dropped | a callout; Rejoin after leaving or a drop |

The chat beside the call opens with the lobby and stays when the call ends. A course call has no
chat beside it.

## The safety rules during a call

Spring pauses someone by taking away both publishing and subscribing (`CallGrants.PAUSED`).
`CallRoom` sees it as a permissions change on your own participant: the page shows a notice and
turns the toolbar's buttons off. When Spring gives them back, whatever you had on comes back on.
Someone else being paused shows as a Paused pill. A teacher's Resume can be refused with 409
`WAITING_FOR_SUPERVISOR`, which reads "They stay paused until a teacher is in the call."

## Messages' hook

`/dm` loads `call-entry.js` only when calls are on. Opening a group or DM points the Call link at its
call. Spring's `callServer` frame on the open topic goes to `CallEntry.frame`. A frame saying the call
ended clears the line. Any other frame is only a hint: the line shows after `GET /api/calls/{id}`
answers with a live room in that same group or DM, which also means the viewer may join. A frame
someone fakes on a group topic shows nothing.

## Tests

| File | Covers |
|---|---|
| `tests/call_model.test.mjs` | links, purposes, placeholders, reasons, initials, role labels, order, paused |
| `tests/calls_api.test.mjs` | routes, cookie and `X-Origin`, reasons, `Retry-After`, no answer, bad ids and identities |
| `tests/call_room.test.mjs` | connecting, devices, speakers, screen share, pause and resume, each way a call ends, leaving |
| `tests/call_page.test.mjs` | the whole page: each state, the lobby, the call, a teacher's tools, the chat beside it, destroy |
| `tests/call_entry.test.mjs` | the Call link, the confirmed "call is on" line, faked frames |
| `tests/call_link.test.mjs` | the link addresses |
| `tests/module_classes.test.mjs` | every module exports only classes |
| `tests/system.test.mjs` | published paths, `./` imports, every string in `data/calls.yml` used, the pinned LiveKit build |
| `tests/test_calls_page.rb` | `/calls/` and `/dm` rendered by Jekyll for each switch setting |
