---
layout: post
title: Calendar smart card (prototype)
description: >
  The class calendar as an ocs__ card that any page can add with one line,
  the same school-week calendar that sits above the class announcements.
permalink: /csa/calendar-card
course: csa
comments: false
---

## What it is

This is the calendar from the class announcements, made into its own `ocs__` card. Any page can add it with one line:

```liquid
{% raw %}{% include ocs_calendar_card.html course="csa" %}{% endraw %}
```

It sets itself up:

- **Signed in:** it shows your class's events from the OCS calendar, the same ones the announcements create.
- **Signed out:** it shows the school week, with holidays and days off from the school calendar, and asks you to sign in.
- **Click an event** to see its details inside the card. **Today** brings you back after you browse to other weeks.
- **It fits where you put it.** At full width the week shows as five columns. In a sidebar, a two-column layout or on a phone, the days stack into a list.
- **It's styled in SASS** with the `ocs__` grammar: `ocs__card ocs__calendar` with a size of `small`, `medium` or `large`. The colors follow the site theme.

## Live

This card uses real data: the CSA calendar if you're signed in, otherwise the school week.

{% include ocs_calendar_card.html course="csa" %}

## Sample week

The cards below use `sample="true"`, so you can see a full week of events without signing in. Nothing is saved.

### Sizes

`size="small"`

{% include ocs_calendar_card.html course="csa" size="small" sample=true %}

`size="medium"` (the default)

{% include ocs_calendar_card.html course="csa" sample=true %}

`size="large"`

{% include ocs_calendar_card.html course="csa" size="large" sample=true %}

### In a narrow space

The same card in a two-column layout, the width of a sidebar. On the right is CSP filtered to period 3 (`period="3"`). The period-4-only office hours is hidden there.

<div class="ocs__split">
{% include ocs_calendar_card.html course="csa" size="small" sample=true %}
{% include ocs_calendar_card.html course="csp" period="3" size="small" sample=true %}
</div>

## Options

| Option | Values | Default |
|---|---|---|
| `course` | `csa`, `csp`, `csse`, `csh`, or `all` | the page's `course`, otherwise `all` |
| `period` | one class period, for example `3` | every period |
| `size` | `small`, `medium`, `large` | `medium` |
| `title` | the card heading | "CSA calendar", or "Class calendar" for `all` |
| `sample` | `true` shows example events | off |

## How it's built

- `_includes/ocs_calendar_card.html` is the card. It adds the school calendar data and the script once per page, however many cards the page has.
- `assets/js/chat/calendar/calendar-card.js` sets up every card on the page. It reuses the announcement calendar's code: the same week view, event cards and backend calls.
- `_sass/open-coding/elements/calendar/_main.scss` holds the styles. The sizes come from a SASS map, the same pattern as the `ocs__btn` sizes.
