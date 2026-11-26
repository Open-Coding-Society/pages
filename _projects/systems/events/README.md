# Events

Events is the Jekyll part of the Event Management System Mort described on
[pages#2089](https://github.com/Open-Coding-Society/pages/pull/2089): an event page for each
event (`layout: event`, his "Example Event Viewer") and the `/events/` catalog (his "Upcoming
Events"). Every event comes from front matter, and each event's discussion is its Microblog topic.
The sources live here, and `make` copies them to the paths the rest of the site loads them from.

See [Events architecture](docs/ARCHITECTURE.md) for how the pages, the generator and the scripts
fit together.

## An event is a post

An event is a post in `_posts/events/<YYYY-MM-DD>-<slug>.md` with Mort's front matter and an
explicit `permalink: /events/<slug>/`. The permalink keeps the address stable, and the
Microblog topic is the permalink.

**Never commit a `status: draft` file.** The repo is public on GitHub, so drafts stay in the
Event Builder (Flask) until they are published. The generator drops a draft that slips in, unless
the build uses `--unpublished`.

People find events on `/events/` and its category filter, not in site search: `/search/` only
redirects to `/topics/`, and Topics leaves out documents with `hide: true`, which every event
gets. Search engines find each event through its page, its title and description tags and its
schema.org Event data.

| Field | Needed | What it is |
|---|---|---|
| `layout` | yes | `event` |
| `title` | yes | text that isn't blank |
| `date` | yes | the day, `YYYY-MM-DD` |
| `status` | yes | one of the lifecycle keys below |
| `permalink` | yes | `/events/<slug>/`, a lowercase slug with hyphens |
| `description` | | one line, under the title and on the card |
| `start_time`, `end_time` | | quoted 24-hour `"HH:MM"` (an unquoted `10:00` reads as a number); an end needs a start and must come after it |
| `categories` | | a list of text; the catalog's filter buttons, one per category whatever its case |
| `event_type` | | a key of `event_types` in the registry |
| `location` | | `name`, `address`, and `url`: an https link to a map or directions |
| `organizer` | | `name`, and `uids`: login uids who become the Microblog page's authors |
| `registration` | | `enabled` (true or false) and `capacity` (a whole number of 1 or more), for the Event Service |
| `attachments` | | a list of `{type, id}`: a type from `attachment_types`, and a lowercase slug used once |
| `features` | | `microblog`, `registration`, `attendance`, `gallery`, each true or false; a key left out takes `events.features` |
| `timezone` | | an Area/City name or `UTC`, over `events.timezone` |
| `image`, `image_alt` | | the photo at the top: a site path or an http(s) link, and its alt text, which is needed with it |
| `image_credit` | | `name`, and `url` (https or a site path): the chip under the photo |
| `presenters` | | a list of `{name, role}`; the organizer is listed first |
| `schedule` | | a list of `{time: "HH:MM", title, detail}` |
| `presentation` | | a site path or https link to the event's UI Builder page |
| `labels` | | this event's own words for a section or a page text, like `labels: {presenters: Speakers}` |
| `sample` | | `true` on a sample: a Sample pill and note, and no schema.org data |

A wrong value stops the build with the file and the field, for example
`_posts/events/2027-03-15-workshop.md: image_alt is needed with image`.

## The lifecycle

Mort's six stages, in his order, live in `data/event_registry.yml`, each one word plus a short
description. An organization renames a label there; no template or script spells one.

| Stage | Word | Description | In the catalog |
|---|---|---|---|
| `draft` | Draft | Being written | no, and never built |
| `published` | Published | Details are out | yes |
| `registration` | Registration Open | Taking RSVPs | yes |
| `active` | Active | Happening now | yes |
| `completed` | Completed | Over; files and photos stay | yes |
| `archived` | Archived | Kept but not listed | no, but the page is still built |

The site rebuilds only on a push, so the browser keeps the pill current: it shows the later of the
built stage and the clock's (Published before the start, Active during the event, Completed after
it). Draft and Archived don't move. Until the Event Service can take RSVPs, `registration` shows
as Published, so a page never says Registration Open without a way to register.

## Settings

The `events:` block in `_config.yml` holds the site defaults:

- `timezone`: the zone `start_time` and `end_time` are in. Keep it the same as `default_timezone`
  in Flask's `model/dataconfigs/event_rules.json`.
- `join_url`: where the catalog's Join Us button goes (`/signup` here). Leave it out for no button.
- `page_size`: how many cards `/events/` shows at a time, a whole number from 1 to 48.
- `features`: what an event turns on when its own `features` block leaves a key out. Here only
  the Microblog is on, since registration, check-in and the gallery need a Flask record and an
  organizer. With no `features` setting, a key an event leaves out is off.

`timezone` and `page_size` are needed once there are events. The build also needs `future: true`,
or Jekyll would skip every event dated after today without saying so.

## Discussion

When an event's `features.microblog` is on, the page gets the site's Microblog panel and a
Questions and Discussion part that lists the topic's latest posts, read from Flask's public
`GET /api/microblog/page/<key>`, so signed-out visitors see them too. Ask a question opens the
panel, where posting needs a sign-in. The page key comes from the Microblog's
`js/microblog-topic.js` (`MicroblogTopic`), the one copy of Flask's key, which the UI Builder's
feedback block uses too. With the Microblog off there is no discussion part and no panel.

## Flask only or Flask + Spring

Events works the same on both. The pages call only Flask's public Microblog read, and nothing
calls Spring.

## Files

| Source | Published to | What it is |
|---|---|---|
| `index.md` | `navigation/projects/events/index.md` | `/events/` |
| `layouts/event.html` | `_layouts/event.html` | `layout: event`: only the include below |
| `_includes/event-body.html` | `_includes/projects/events/` | the event page (img2) |
| `_includes/events-catalog.html`, `event-card.html` | `_includes/projects/events/` | the catalog (img3) and one card |
| `_includes/event-texts-json.html` | `_includes/projects/events/` | the registry's words for the scripts |
| `data/event_registry.yml` | `_data/projects/events/` | every visible word and choice |
| `plugins/events.rb` | `_plugins/projects/events/` | the generator (`Events`) |
| `js/` | `assets/js/projects/events/` | `EventTime`, `EventPager`, `EventCatalog`, `EventPage`, `EventDiscussion`, `EventViewer`, `EventTexts`, and `viewer.js`'s `startViewer` |
| `docs/ARCHITECTURE.md` | `/systems/events/architecture/` | how it fits together |
| `tests/` | not published | the tests and their fixture |

`distribution.json` opts into the standard folders and maps the page, the root layout and the
plugin as exceptions. Git ignores the published copies: edit the sources here.

## How to try it

1. Run `make` (or `make dev`; Events is `systems/events:dev`).
2. Open `/events/`. The labelled sample, Mort's own example, has the Sample and Published pills.
3. Open it. The page has the title, date line, place, three section cards and Questions and
   Discussion. Ask a question opens the Microblog panel.
4. Opened from the card, the viewer bar has Events (back to the same category and page), previous
   and next, and the Microblog button.
5. To try your own, copy the sample to `_posts/events/` with a new date, slug and permalink, and
   leave out `sample: true`.

## Tests

- `bundle exec ruby scripts/test_events.rb`: the generator's checks and settings, and the pages
  built in a temporary Jekyll site from the published files.
- `node --test tests/events.test.mjs`: the browser classes on Messages' fake DOM.
- `node --test tests/microblog_topic.test.mjs`: the Microblog page key and the public read.

## Removing Events from a kit

Delete `_posts/events/`, the `events:` block in `_config.yml` and the `systems/events:dev` line in
`_projects/.makeprojects`. That is all on a fresh checkout. A checkout that built Events before
keeps its published copies until `_projects/systems/events/` is deleted too, because `make` cleans
up only projects whose sources are gone (`scripts/clean_removed_projects.rb`).
