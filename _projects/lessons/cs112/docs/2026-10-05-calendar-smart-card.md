---
layout: post
title: Calendar smart card (prototype)
description: >
  The class calendar as an ocs__ card that any page can add with one line,
  the same school-week calendar that sits above the class announcements.
permalink: /csa/calendar-card
course: csa
comments: false
lesson_group: "cs112"
articulation: {"institution":"MiraCosta College","course":"CS112"}
categories: []
---

## What it is

This is the calendar from the class announcements, made into its own `ocs__` card. Any page can add it with one line:

```liquid
{% raw %}{% include ocs_calendar_card.html course="csa" %}{% endraw %}
```

It sets itself up:

- **Signed in:** it shows your class's events from the OCS calendar, the same ones the announcements create.
- **Signed out:** it shows the school week, with holidays and days off from the school calendar, and asks you to sign in.
- **Each event is one pill on one line.** A long name ends in "…": hover for the whole name, or click the event to see its details inside the card. A busy day shows three events and "+N more". **Today** brings you back after you browse to other weeks.
- **It fits where you put it.** At full width the week shows as five columns. In a sidebar, a two-column layout or on a phone, it shows one row per day.
- **It's built from existing `ocs__` elements** (`ocs__card`, `ocs__table`, `ocs__links`, `ocs__btn`), so it has no CSS of its own and its colors follow the site theme.

## Live

This card uses real data: the CSA calendar if you're signed in, otherwise the school week.

{% include ocs_calendar_card.html course="csa" %}

## Sample week

The cards below use `sample="true"`, so you can see a full week of events without signing in. Nothing is saved.

{% include ocs_calendar_card.html course="csa" sample=true %}

### In a narrow space

The same card in a two-column layout, the width of a sidebar. On the right is CSP, which meets in periods 3 and 4. The card shows events for both periods. Open an event to see which period it is for: the office hours is only for period 4.

<div class="ocs__split">
{% include ocs_calendar_card.html course="csa" sample=true %}
{% include ocs_calendar_card.html course="csp" sample=true %}
</div>

## Options

| Option | Values | Default |
|---|---|---|
| `course` | `csa`, `csp`, `csse`, `csh`, or `all` | the page's `course`, otherwise `all` |
| `title` | the card heading | "CSA calendar", or "Class calendar" for `all` |
| `sample` | `true` shows example events | off |

## How it's built

- `_includes/ocs_calendar_card.html` is the card. It adds the school calendar data and the script once per page, however many cards the page has.
- `assets/js/chat/calendar/calendar-card.js` sets up every card on the page. It reuses the announcement calendar's code: the same week view, event cards and backend calls.
- It has no stylesheet of its own. Every part is an existing `ocs__` element, and the one-row-per-day layout is a second table shape the script picks from the card's width.
