# Calls

Video calls for a group, a direct message or a class, at `/calls/?group=<id>`, `?dm=<id>` or
`?course=<code>`. People get there from the Call link in a group's or DM's header in Messages
(`/dm`). The page is built from the OCS grammar only (`_sass/open-coding/elements/`), so this
system has no stylesheet.

The media goes through a LiveKit server. Spring (`mvc/calls`, spring#287) decides who may join,
hands out the join tokens and keeps the safety rules: a mentor waits in the lobby until a teacher
is in the call, and is paused the moment the last teacher leaves.

See [Calls architecture](docs/ARCHITECTURE.md) for the modules, the page's states and the tests.

## Turning calls on

Calls are off by default, with two switches, and either one hides them:

- Pages `_config.yml`: `enabled: false` under `calls:`. With it off, or on a Flask-only site (`spring: false`),
  `/calls/` only says calls aren't turned on, `/dm` has no Call link, and nothing is asked of Spring.
- Spring: `calls.enabled=false` in its settings. Its routes then answer 404, and the page says calls
  aren't available.

To turn them on: run a LiveKit server, give Spring `LIVEKIT_URL`, `LIVEKIT_API_KEY` and
`LIVEKIT_API_SECRET` with `calls.enabled=true` (Spring's `docs/calls-deployment.md`), then set
the Pages switch in `_config.yml`:

```yaml
calls:
  enabled: true
```

## What's on the page

| Part | Built from |
|---|---|
| The room's name, and its purpose when it isn't a meeting | `h1`, `ocs__card-header`, `ocs__status-pill` |
| Lobby: your camera, Mic and Camera toggles, Join | `ocs__card`, `ocs__embed ocs__embed--video` on a `<video>`, `ocs__btn` with `aria-pressed` |
| Toolbar: how many are in, Mic, Camera, Share screen, Leave | `ocs__viewer` (sticks to the top), `ocs__links` |
| A shared screen, across the top | `ocs__embed ocs__embed--video` and a caption |
| One cell per person: camera or initials, name, role, Speaking, Muted, Paused | `ocs__grid ocs__grid--col2` (two big cells a row, up to `large_cells_up_to` people) or `ocs__grid ocs__grid--card` for a bigger call; `ocs__grid-cell`, `ocs__avatar`, `ocs__status-pill` |
| Beside the call: people, and the group's or DM's chat | `ocs__split ocs__split--aside-end`, `ocs__card`, Messages' `mountGroupChat` / `mountConversation` |
| A teacher's tools: Pause or Resume and Remove behind each Manage, End call for everyone | `<details>`, `ocs__btn alert-red`, an `ocs__modal` to confirm |
| Notices: waiting for a teacher, paused, sound held back, refused | `ocs__callout` |

One person's cell, as the page builds it:

```html
<div class="ocs__grid ocs__grid--col2">
  <div class="ocs__grid-cell ocs__stack" data-identity="...">
    <div><video class="ocs__embed ocs__embed--video" autoplay playsinline muted aria-label="Ada Lovelace"></video></div>
    <strong>Ada Lovelace</strong>
    <p class="ocs__links"><b class="ocs__status-pill">Teacher</b><b class="ocs__status-pill ocs__status-pill--good">Speaking</b></p>
  </div>
</div>
```

- `playsinline` keeps iPhone Safari from opening a video full screen.
- Videos are muted; everyone's sound plays from separate audio elements in a hidden wrapper.
- With a camera off, the card shows `<abbr class="ocs__avatar" title="Ada Lovelace">AL</abbr>`
  in the video's place.
- Elements that set `display` beat the `hidden` attribute, so the page adds and removes them
  instead of hiding them.
- Share screen only shows where the browser can share a screen. iPhone Safari can't.

## Words and purposes

Every word the page shows is in `data/calls.yml` (published as `site.data.projects.calls.calls`).
The page hands it to `CallPage.start` as JSON. The same file lists the purposes a link can ask for
with `&purpose=standup` (`meeting` by default, matching Spring's `calls.purposes`), the labels for
the roles a join token carries, and how the lobby waits for a teacher: it looks at the room every
`wait_retry_seconds` and asks for a token again when someone comes or goes.

## Try it

1. Start Spring with calls on and LiveKit set up. Locally, `livekit-server --dev` gives the key
   `devkey` and the secret `secret`.
2. In `_config.yml`, set `enabled: true` under `calls:`, then run `make`.
3. Sign in, open a group in `/dm` and press Call, then Join. Open the same link in a second
   browser signed in as someone else in the group.
4. To see the safety rules, join first as a mentor: the lobby says it's waiting for a teacher.
   Join as a teacher in another browser, and the mentor goes in. When the teacher leaves, the
   mentor is paused.

## Tests

```bash
node --test _projects/systems/calls/tests/*.test.mjs
```

```bash
bundle exec ruby scripts/test_calls_page.rb
```

The node tests run the real modules on the Messages system's fake DOM, with a fake LiveKit
(`tests/fake-livekit.mjs`) and a scripted Spring. The Ruby test renders `/calls/` and `/dm`
through Jekyll for each switch setting, and checks that `/dm` with calls off is byte for byte what
it was before the Call link.
