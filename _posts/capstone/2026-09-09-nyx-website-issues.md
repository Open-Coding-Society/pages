---
microblog: true
toc: false
layout: post
title: Nyx Website Build Issues
description: One main GitHub issue and six sub-issues for the FRC Team Nyx 11744 website rebuild, each written out in full and ready to copy into the repository.
permalink: /capstone/nyx-website/issues/
sticky_rank: 2
year: "2026-2027"
---

<style>
.nyxcap {
  --nyx-void: #05060e;
  --nyx-deep: #0a0c18;
  --nyx-surface: rgba(255,255,255,0.035);
  --nyx-line: rgba(255,255,255,0.10);
  --nyx-line-soft: rgba(255,255,255,0.06);
  --nyx-text: #e8e9f2;
  --nyx-muted: #9ba0b8;
  --nyx-dim: #6f7490;
  --nyx-violet: #8b6bff;
  --nyx-cyan: #4fd6e8;
  --nyx-radius: 18px;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border-radius: 24px;
  background: var(--nyx-void);
  color: var(--nyx-text);
  padding: 0;
  margin: 1.5rem 0 2.5rem;
  border: 1px solid var(--nyx-line-soft);
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Inter, Roboto, sans-serif;
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
}

/* ---------- star field ---------- */
.nyxcap__sky {
  position: absolute;
  inset: -20%;
  z-index: 0;
  pointer-events: none;
}
.nyxcap__stars {
  position: absolute;
  inset: 0;
  background-repeat: repeat;
  opacity: 0.55;
}
.nyxcap__stars--far {
  background-image:
    radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.75), transparent),
    radial-gradient(1px 1px at 70% 12%, rgba(255,255,255,0.55), transparent),
    radial-gradient(1px 1px at 45% 78%, rgba(255,255,255,0.6), transparent),
    radial-gradient(1px 1px at 88% 62%, rgba(255,255,255,0.45), transparent),
    radial-gradient(1px 1px at 12% 88%, rgba(255,255,255,0.5), transparent);
  background-size: 260px 260px;
  animation: nyxDriftFar 240s linear infinite;
}
.nyxcap__stars--near {
  background-image:
    radial-gradient(1.6px 1.6px at 30% 20%, rgba(200,215,255,0.95), transparent),
    radial-gradient(1.6px 1.6px at 82% 48%, rgba(190,175,255,0.8), transparent),
    radial-gradient(1.4px 1.4px at 55% 85%, rgba(255,255,255,0.75), transparent);
  background-size: 420px 420px;
  opacity: 0.5;
  animation: nyxDriftNear 150s linear infinite;
}
.nyxcap__neb {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(60% 45% at 18% 0%, rgba(120,86,255,0.30), transparent 70%),
    radial-gradient(55% 40% at 88% 8%, rgba(56,182,214,0.16), transparent 72%),
    radial-gradient(80% 60% at 50% 120%, rgba(90,64,200,0.14), transparent 70%);
}
@keyframes nyxDriftFar  { to { background-position: 260px 130px; } }
@keyframes nyxDriftNear { to { background-position: -420px 210px; } }

.nyxcap__inner {
  position: relative;
  z-index: 1;
  padding: clamp(28px, 5vw, 64px);
}

/* ---------- type ---------- */
.nyxcap p, .nyxcap li { color: var(--nyx-muted); font-size: 0.97rem; }
.nyxcap strong { color: var(--nyx-text); font-weight: 650; }
.nyxcap__eyebrow {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.7rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--nyx-violet);
  margin: 0 0 14px;
}
.nyxcap__title {
  font-size: clamp(2rem, 5.4vw, 3.4rem);
  line-height: 1.04;
  letter-spacing: -0.025em;
  font-weight: 750;
  color: #fff;
  margin: 0 0 16px;
  text-shadow: 0 0 60px rgba(139,107,255,0.35);
}
.nyxcap__lede {
  font-size: clamp(1rem, 2.1vw, 1.18rem);
  color: #c6c9dd;
  max-width: 60ch;
  margin: 0 0 28px;
}
.nyxcap h2 {
  font-size: clamp(1.3rem, 2.8vw, 1.7rem);
  color: #fff;
  font-weight: 700;
  letter-spacing: -0.015em;
  margin: 0 0 6px;
  border: 0;
  padding: 0;
}
.nyxcap h3 {
  font-size: 1rem;
  color: #fff;
  font-weight: 650;
  margin: 0 0 6px;
  letter-spacing: -0.005em;
}
.nyxcap__kicker {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.66rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--nyx-dim);
  margin: 0 0 10px;
}
.nyxcap__section { margin-top: clamp(44px, 7vw, 76px); }
.nyxcap__section > p { max-width: 66ch; }

/* ---------- chips + meta ---------- */
.nyxcap__row { display: flex; flex-wrap: wrap; gap: 8px; }
.nyxcap__chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 13px;
  border-radius: 999px;
  border: 1px solid var(--nyx-line);
  background: var(--nyx-surface);
  color: #d5d8e8;
  font-size: 0.8rem;
  backdrop-filter: blur(6px);
}
.nyxcap__chip i {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--nyx-violet);
  box-shadow: 0 0 10px rgba(139,107,255,0.9);
}
.nyxcap__meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1px;
  margin-top: 34px;
  border-radius: var(--nyx-radius);
  overflow: hidden;
  border: 1px solid var(--nyx-line-soft);
  background: var(--nyx-line-soft);
}
.nyxcap__meta div { background: rgba(8,9,20,0.82); padding: 16px 18px; }
.nyxcap__meta dt {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.62rem; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--nyx-dim); margin: 0 0 5px;
}
.nyxcap__meta dd { margin: 0; color: #fff; font-size: 0.95rem; font-weight: 600; }

/* ---------- cards ---------- */
.nyxcap__grid {
  display: grid;
  gap: 14px;
  margin-top: 22px;
}
.nyxcap__grid--2 { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
.nyxcap__grid--3 { grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); }
.nyxcap__card {
  border: 1px solid var(--nyx-line-soft);
  border-radius: var(--nyx-radius);
  background: linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.015));
  padding: 20px 22px;
  transition: transform .28s cubic-bezier(.2,.8,.3,1), border-color .28s ease, box-shadow .28s ease;
}
.nyxcap__card:hover {
  transform: translateY(-3px);
  border-color: rgba(139,107,255,0.42);
  box-shadow: 0 14px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,107,255,0.12);
}
.nyxcap__card p { margin: 0; font-size: 0.9rem; }
.nyxcap__num {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.68rem;
  color: var(--nyx-cyan);
  letter-spacing: 0.14em;
  display: block;
  margin-bottom: 9px;
}

/* ---------- stats ---------- */
.nyxcap__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 14px;
  margin-top: 26px;
}
.nyxcap__stat {
  border-radius: var(--nyx-radius);
  border: 1px solid var(--nyx-line-soft);
  background: rgba(255,255,255,0.03);
  padding: 20px;
  text-align: center;
}
.nyxcap__stat b {
  display: block;
  font-size: clamp(1.7rem, 4vw, 2.3rem);
  font-weight: 750;
  color: #fff;
  line-height: 1;
  letter-spacing: -0.03em;
}
.nyxcap__stat span {
  display: block;
  margin-top: 8px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.62rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--nyx-dim);
}

/* ---------- palette ---------- */
.nyxcap__swatches { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 22px; }
.nyxcap__sw {
  flex: 1 1 110px;
  border-radius: 14px;
  border: 1px solid var(--nyx-line-soft);
  padding: 14px;
  min-height: 84px;
  display: flex;
  align-items: flex-end;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.64rem;
  letter-spacing: 0.08em;
  color: rgba(255,255,255,0.72);
}

/* ---------- site map ---------- */
.nyxcap__map { margin-top: 22px; border-top: 1px solid var(--nyx-line-soft); }
.nyxcap__leaf {
  display: grid;
  grid-template-columns: minmax(120px, 180px) 1fr;
  gap: 8px 22px;
  padding: 15px 4px;
  border-bottom: 1px solid var(--nyx-line-soft);
  transition: background .25s ease, padding-left .25s ease;
}
.nyxcap__leaf:hover { background: rgba(139,107,255,0.06); padding-left: 12px; }
.nyxcap__leaf b { color: #fff; font-weight: 620; font-size: 0.98rem; }
.nyxcap__leaf span { color: var(--nyx-muted); font-size: 0.9rem; }

/* ---------- rounds ---------- */
.nyxcap__rounds { margin-top: 24px; display: grid; gap: 0; }
.nyxcap__round {
  position: relative;
  padding: 0 0 30px 34px;
  border-left: 1px solid var(--nyx-line);
}
.nyxcap__round:last-child { border-left-color: transparent; padding-bottom: 0; }
.nyxcap__round::before {
  content: "";
  position: absolute;
  left: -6px; top: 4px;
  width: 11px; height: 11px;
  border-radius: 50%;
  background: var(--nyx-violet);
  box-shadow: 0 0 0 4px rgba(139,107,255,0.16), 0 0 16px rgba(139,107,255,0.8);
}
.nyxcap__round p { margin: 4px 0 0; font-size: 0.92rem; }

/* ---------- checks ---------- */
.nyxcap__checks { list-style: none; padding: 0; margin: 20px 0 0; display: grid; gap: 11px; }
.nyxcap__checks li {
  display: grid;
  grid-template-columns: 22px 1fr;
  gap: 12px;
  align-items: start;
  font-size: 0.94rem;
}
.nyxcap__checks li::before {
  content: "";
  width: 15px; height: 15px;
  margin-top: 5px;
  border-radius: 5px;
  border: 1px solid rgba(79,214,232,0.55);
  background: rgba(79,214,232,0.10);
}

/* ---------- note + footer ---------- */
.nyxcap__note {
  margin-top: 24px;
  border-radius: var(--nyx-radius);
  border: 1px solid rgba(139,107,255,0.28);
  background: linear-gradient(135deg, rgba(139,107,255,0.10), rgba(79,214,232,0.05));
  padding: 20px 24px;
}
.nyxcap__note p { margin: 0; color: #d3d6e8; }
.nyxcap__foot {
  margin-top: clamp(44px, 7vw, 70px);
  padding-top: 22px;
  border-top: 1px solid var(--nyx-line-soft);
  display: flex;
  flex-wrap: wrap;
  gap: 10px 26px;
  justify-content: space-between;
  align-items: center;
}
.nyxcap__foot p { margin: 0; font-size: 0.82rem; color: var(--nyx-dim); }
.nyxcap a { color: var(--nyx-cyan); text-decoration: none; border-bottom: 1px solid rgba(79,214,232,0.35); }
.nyxcap a:hover { color: #8ff0ff; }

/* ---------- reveal ---------- */
.nyxcap [data-nyx-reveal] {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity .7s cubic-bezier(.2,.8,.3,1), transform .7s cubic-bezier(.2,.8,.3,1);
}
.nyxcap [data-nyx-reveal].is-in { opacity: 1; transform: none; }

@media (prefers-reduced-motion: reduce) {
  .nyxcap__stars, .nyxcap__stars--far, .nyxcap__stars--near { animation: none; }
  .nyxcap [data-nyx-reveal] { opacity: 1; transform: none; transition: none; }
  .nyxcap__card:hover { transform: none; }
  .nyxcap__leaf:hover { padding-left: 4px; }
}
</style>
<style>
.nyxcap__issue {
  margin-top: 22px;
  border: 1px solid var(--nyx-line-soft);
  border-radius: var(--nyx-radius);
  background: rgba(255,255,255,0.028);
  overflow: hidden;
  transition: border-color .28s ease, box-shadow .28s ease;
}
.nyxcap__issue:hover {
  border-color: rgba(139,107,255,0.34);
  box-shadow: 0 14px 40px rgba(0,0,0,0.45);
}
.nyxcap__issuehead {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--nyx-line-soft);
  background: rgba(255,255,255,0.022);
}
.nyxcap__issuehead h3 { margin: 0; font-size: 0.99rem; }
.nyxcap__tag {
  display: inline-block;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.6rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--nyx-cyan);
  margin-bottom: 6px;
}
.nyxcap__copy {
  border: 1px solid rgba(139,107,255,0.4);
  background: rgba(139,107,255,0.12);
  color: #d9d2ff;
  border-radius: 999px;
  padding: 6px 15px;
  font-size: 0.76rem;
  font-family: inherit;
  cursor: pointer;
  transition: background .22s ease, transform .22s ease, color .22s ease;
}
.nyxcap__copy:hover { background: rgba(139,107,255,0.24); transform: translateY(-1px); color: #fff; }
.nyxcap__copy.is-done { background: rgba(79,214,232,0.2); border-color: rgba(79,214,232,0.5); color: #bff3fb; }
.nyxcap pre.nyxcap__md {
  margin: 0;
  padding: 20px 22px 24px;
  max-height: 340px;
  overflow: auto;
  background: rgba(3,4,10,0.72);
  color: #c3c7de;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.775rem;
  line-height: 1.62;
  white-space: pre-wrap;
  word-break: break-word;
  border: 0;
  border-radius: 0;
}
.nyxcap pre.nyxcap__md::-webkit-scrollbar { width: 9px; }
.nyxcap pre.nyxcap__md::-webkit-scrollbar-thumb { background: rgba(139,107,255,0.35); border-radius: 9px; }
.nyxcap__labels {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.66rem;
  color: var(--nyx-dim);
  padding: 12px 22px 16px;
  border-top: 1px solid var(--nyx-line-soft);
  letter-spacing: 0.06em;
}
.nyxcap__steps { counter-reset: nyxstep; list-style: none; padding: 0; margin: 20px 0 0; display: grid; gap: 12px; }
.nyxcap__steps li {
  counter-increment: nyxstep;
  display: grid;
  grid-template-columns: 30px 1fr;
  gap: 14px;
  align-items: start;
  font-size: 0.94rem;
}
.nyxcap__steps li::before {
  content: counter(nyxstep);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.72rem;
  color: var(--nyx-violet);
  border: 1px solid rgba(139,107,255,0.4);
  border-radius: 50%;
  width: 26px; height: 26px;
  display: grid; place-items: center;
  margin-top: 1px;
}
@media (prefers-reduced-motion: reduce) {
  .nyxcap__copy:hover { transform: none; }
}
</style>

<div class="nyxcap">
  <div class="nyxcap__sky" aria-hidden="true">
    <div class="nyxcap__neb"></div>
    <div class="nyxcap__stars nyxcap__stars--far"></div>
    <div class="nyxcap__stars nyxcap__stars--near"></div>
  </div>

  <div class="nyxcap__inner">

    <header data-nyx-reveal>
      <p class="nyxcap__eyebrow">AP CSP Capstone &nbsp;&bull;&nbsp; 2026 to 2027</p>
      <h1 class="nyxcap__title">Nyx Website Build Issues</h1>
      <p class="nyxcap__lede">
        The website plan broken into work anyone on the team can pick up. One main issue holds the direction,
        and six sub-issues carry the actual building. Every block below is a full issue body, already written,
        ready to copy straight into the repository.
      </p>
      <div class="nyxcap__row">
        <span class="nyxcap__chip"><i></i>Aryan M</span>
        <span class="nyxcap__chip"><i></i>Pranay K</span>
        <span class="nyxcap__chip"><i></i>Raymond L</span>
      </div>
      <dl class="nyxcap__meta">
        <div><dt>Structure</dt><dd>1 main, 6 subs</dd></div>
        <div><dt>Status</dt><dd>Ready to open</dd></div>
        <div><dt>Rounds</dt><dd>Three</dd></div>
        <div><dt>Companion</dt><dd><a href="/capstone/nyx-website/">Ideation page</a></dd></div>
      </dl>
    </header>

    <section class="nyxcap__section" data-nyx-reveal>
      <p class="nyxcap__kicker">Before you paste</p>
      <h2>Four steps to get these open</h2>
      <ol class="nyxcap__steps">
        <li>Create the suggested labels in the repository first, otherwise they get skipped and never come back.</li>
        <li>Open the main issue so it gets a number, and use the heading above each block as the issue title.</li>
        <li>Open the six sub-issues and replace the placeholder at the top of each one with the main issue number.</li>
        <li>Attach the six to the main issue if sub-issues are turned on, and give each one an owner.</li>
      </ol>
    </section>

    <section class="nyxcap__section" data-nyx-reveal>
      <p class="nyxcap__kicker">The work</p>
      <h2>Seven issues, in order</h2>
      <p>
        The main issue holds the direction and the blocking question. The six under it are ordered by round,
        so sub-issues 1, 2, 4, and 5 are Round 1 work, and 3 and 6 wait for later.
      </p>
      <article class="nyxcap__issue">
        <div class="nyxcap__issuehead">
          <div>
            <span class="nyxcap__tag">Main issue</span>
            <h3>Rebuild the Nyx team website with a dark matter theme, a 3D robot, and smooth motion</h3>
          </div>
          <button type="button" class="nyxcap__copy" data-nyx-copy>Copy Markdown</button>
        </div>
        <pre class="nyxcap__md">## Summary

Rebuild the Team Nyx 11744 website. The current site works and has the right pages, but it does not yet make a visitor feel anything, and it does not clearly answer the question most people arrive with, which is whether they can be part of this team.

The new site leans into the name. Nyx is the goddess of night, so the site should look like deep space, feel calm and expensive, move smoothly, and put the robot at the center of it.

## Why this matters

The site is the front door to everything the team does:

- Educate high school students about robotics
- Provide real engineering competition experience
- Connect students who care about the same thing

We currently have around 60 students learning CAD, mechanical, electrical, software, and outreach. The site should make that obvious in about five seconds.

## Who we are building for

| Visitor | What they want |
| --- | --- |
| Students who might join | Can I do this with no experience, and how do I sign up |
| Parents | Is this real, organized, and safe |
| Sponsors | Is this team serious, and where does my name go |
| Judges, teams, mentors | The robot, the build process, the outreach numbers |

If a page does not serve one of these four, it does not get built yet.

## Direction

- Near black base with depth, one accent color used sparingly, white and soft gray text
- A slow drifting star field behind the whole site, quiet enough that you only notice it if you look
- Rounded corners, thin low contrast borders, generous spacing, no hard boxes
- A 3D model of the robot you can grab and spin, pending permission to publish the CAD
- Motion that is smooth and gentle and never makes you wait to read something

## Scope

Seven destinations, flat, no submenus:

Home, The Robot, Team, What You Learn, Outreach, Sponsors, Join

## Out of scope for now

- Member login or any account system
- A blog or news feed
- Store or merchandise
- Anything that needs a backend beyond a form handler

## Build order

We build in three rounds and each round has to work before the next one starts.

1. **Round 1, structure and content.** Every page exists, the flow works, the words are real, plain dark styling only.
2. **Round 2, atmosphere.** Star field, glow, page transitions, motion pass.
3. **Round 3, the robot.** The 3D model, the subsystem walkthrough, and the polish pass.

Reason for the order: if we start with the 3D robot, we finish the season with a great hero section and five empty pages.

## Sub-issues

- [ ] Sub-issue 1: Design system and dark matter visual language
- [ ] Sub-issue 2: Home page and the star field hero
- [ ] Sub-issue 3: The Robot page and the 3D model viewer
- [ ] Sub-issue 4: Team page and What You Learn page
- [ ] Sub-issue 5: Outreach, Sponsors, and the Join flow
- [ ] Sub-issue 6: Motion, accessibility, and performance pass

Replace each line above with the real issue number once the six are open, so GitHub links them.

## Blocking question

Are we allowed to publish the robot CAD on a public site? Ask the leads and mentors before anyone starts sub-issue 3. A full yes, a simplified yes, and a not yet are all workable, but the answer changes what gets built.

## Definition of done

- [ ] All seven pages exist with real content, no placeholder text anywhere
- [ ] The site reads well on a phone before it reads well on a desktop
- [ ] The theme is consistent across every page
- [ ] Nothing on the site is broken or unreadable with motion turned off
- [ ] Two people who are not on the team can find how to join without being told</pre>
        <p class="nyxcap__labels">Labels: epic, website, design</p>
      </article>
      <article class="nyxcap__issue">
        <div class="nyxcap__issuehead">
          <div>
            <span class="nyxcap__tag">Sub-issue 1</span>
            <h3>Design system and dark matter visual language</h3>
          </div>
          <button type="button" class="nyxcap__copy" data-nyx-copy>Copy Markdown</button>
        </div>
        <pre class="nyxcap__md">Part of #MAIN

## Context

Everything else depends on this. If the palette, the type, and the spacing are not settled first, each page ends up looking slightly different and we spend the rest of the season fixing it.

The theme is deep space, not a cartoon galaxy. Think of a real telescope image: mostly very dark, a lot of empty room, a few small points of light.

## What to build

A single place where the theme lives, so every page pulls from it instead of inventing its own values.

### Color

- A near black base, a deep blue black rather than pure black, so the screen still has depth
- One accent color used sparingly, a violet or an electric cyan, for links, buttons, and the active nav item
- White for headlines, soft gray for body text, so hierarchy reads without effort
- Team colors kept for accents and the logo, not painted across whole sections
- Two or three surface shades for anything that sits above the background

### Type

- One clean geometric sans for headlines, set large and tight
- A comfortable reading font for body, never below 16px on desktop
- A monospace face in small doses for the team number, the season year, and stat labels

### Shape and spacing

- Generous corner radius on anything card shaped
- Thin low contrast borders instead of hard outlines, and a soft glow instead of a drop shadow
- A spacing scale that everything snaps to, with big gaps between sections
- When in doubt, add space and remove a border

### Shared pieces

- Nav bar, sticky, shrinking into a slimmer version after you scroll past the hero
- Mobile nav as a full screen overlay that fades in over the background rather than pushing the page around
- Footer with contact, socials, and a link to join
- Buttons in primary and secondary
- A card, a stat, and a section heading, all built once and reused

## Design notes

- Design the phone version first, treat desktop as the upgrade
- Check contrast on every text color against the real background, since light text on near black is easy to get wrong
- The focus ring for keyboard users should look like it belongs to the theme, not like a browser default

## Checklist

- [ ] Palette locked and written down with the actual values
- [ ] Type scale locked, headline and body fonts chosen
- [ ] Spacing scale and corner radius locked
- [ ] Nav, footer, buttons, and card built and reused
- [ ] Mobile nav overlay working
- [ ] Focus states designed, not left as the default
- [ ] One sample page assembled from only these pieces, to prove the system holds up

## Definition of done

Any teammate can build a new page using only the shared pieces and it looks like it belongs to the same site.</pre>
        <p class="nyxcap__labels">Labels: design, foundation, round-1</p>
      </article>
      <article class="nyxcap__issue">
        <div class="nyxcap__issuehead">
          <div>
            <span class="nyxcap__tag">Sub-issue 2</span>
            <h3>Home page and the star field hero</h3>
          </div>
          <button type="button" class="nyxcap__copy" data-nyx-copy>Copy Markdown</button>
        </div>
        <pre class="nyxcap__md">Part of #MAIN

## Context

The home page has one job, which is to make someone feel something and then send them somewhere useful. It should read as five short scenes rather than one long wall of content.

## What to build

### Hero

- The robot in the star field, the team name, the number 11744, and one honest line about who we are
- Two buttons only, one to join and one to meet the robot
- Nothing else competing for attention

Until sub-issue 3 lands, the hero uses a still photo of the robot in the same spot. The layout should not change when the 3D model replaces it.

### Star field background

- A slow drifting field of stars behind the whole site, layered so distant stars barely move and near particles move a little more
- Slow enough that you only notice it if you stop and look, no twinkling, nothing flying past
- A soft dark nebula gradient behind the hero that fades out as you scroll
- The background gets quieter in text heavy sections, because readability wins over atmosphere
- It loads after the text, never before it

### The rest of the page

1. **Who we are.** Two or three sentences in plain language, no mission statement voice. Something a parent could read out loud without cringing.
2. **By the numbers.** Around 60 students, five disciplines, the season, outreach hours. Small and quiet, counting up once as they scroll into view.
3. **What you would actually do.** Five cards for CAD, mechanical, electrical, software, and outreach. Icon, one sentence, and a link into What You Learn.
4. **Season snapshot.** The current robot, the next event, the last result. This is what makes the site feel alive instead of frozen in September.
5. **Closing call.** One line, one button, then the footer.

"No experience needed" should appear somewhere on this page in plain words.

## Design notes

- Sections fade and lift in gently as they enter view, once, and never again
- Nothing should require waiting on an animation before you can read
- The whole page has to be understandable with the star field turned off

## Checklist

- [ ] Hero laid out and working with a placeholder robot image
- [ ] Star field built, layered, and slow
- [ ] Nebula gradient behind the hero, fading on scroll
- [ ] All five sections built with real content
- [ ] Stat counters animate once on view
- [ ] Discipline cards link into the right sections
- [ ] Page is readable and correct on a phone
- [ ] Page still works with the background disabled

## Definition of done

Someone who has never heard of Nyx can scroll this page once and explain what the team is and how to join.</pre>
        <p class="nyxcap__labels">Labels: page, design, round-1</p>
      </article>
      <article class="nyxcap__issue">
        <div class="nyxcap__issuehead">
          <div>
            <span class="nyxcap__tag">Sub-issue 3</span>
            <h3>The Robot page and the 3D model viewer</h3>
          </div>
          <button type="button" class="nyxcap__copy" data-nyx-copy>Copy Markdown</button>
        </div>
        <pre class="nyxcap__md">Part of #MAIN

## Blocking question, resolve this first

Are we allowed to publish the robot CAD on a public site? Ask the leads and mentors before starting. Three possible answers and all three are workable:

- **Full yes.** Export a lightweight model from the CAD, simplify it until it loads fast, and use it in the hero and on this page.
- **Partial yes.** Use a simplified or stylized version, just the frame and the main mechanism. This may honestly look better anyway.
- **Not yet.** Use a slow rotating photo turntable of the real robot, or a wireframe, and swap the model in later.

The page must not depend on the model existing.

## Context

This is the page for judges, other teams, and anyone who is already interested and wants proof. It is allowed to be the most technical page on the site.

## What to build

### The viewer

- The model at the top of the page, larger than in the hero, with a short spec line under it
- It starts already slowly turning, so people know it is interactive
- Grabbing it feels weighted, with a little momentum on release, and it eases back to its resting angle if left alone
- Hovering or tapping a subsystem dims the rest and brings up a short label
- A fallback image for phones, slow connections, and browsers that cannot handle it, so nobody ever sees a blank rectangle
- If the model has not loaded within a couple of seconds, show the fallback and stop waiting

### The rest of the page

- A subsystem walkthrough where selecting a part highlights it and explains what it does in two sentences, written for someone who does not know what a swerve module is
- A build season timeline from kickoff through competition, with photos, showing the mess and the fixes and not only the finished robot
- A short "what we would change" section, because being honest about that is what actually impresses judges
- Links to the CAD and the code repository, if the team is comfortable making them public

## Design notes

- The model sits in the same star field, lit so it looks like it belongs in the scene
- Controls should be obvious without instructions, drag to rotate and pinch or scroll to zoom
- Keep the file small. A beautiful model that takes ten seconds to load is worse than a good photo.

## Checklist

- [ ] Permission question answered and written down in this issue
- [ ] Model exported and simplified, or the chosen fallback prepared
- [ ] Viewer working on desktop with drag, momentum, and rest position
- [ ] Touch controls working on a phone
- [ ] Fallback image path tested by simulating a slow connection
- [ ] Subsystem highlighting and labels written
- [ ] Build timeline built with real photos
- [ ] "What we would change" section written
- [ ] Hero on the home page updated to use the same model

## Definition of done

A visitor can spin the robot, learn what three of its subsystems do, and see how the season went, all on one page, and none of it breaks if the model fails to load.</pre>
        <p class="nyxcap__labels">Labels: page, 3d, design, round-3</p>
      </article>
      <article class="nyxcap__issue">
        <div class="nyxcap__issuehead">
          <div>
            <span class="nyxcap__tag">Sub-issue 4</span>
            <h3>Team page and What You Learn page</h3>
          </div>
          <button type="button" class="nyxcap__copy" data-nyx-copy>Copy Markdown</button>
        </div>
        <pre class="nyxcap__md">Part of #MAIN

## Context

These two pages carry most of the weight for the people we actually want to reach. Parents read the team page carefully. Students decide whether to join based on What You Learn.

## Team page

Faces, not a directory.

- Leadership first, then subteam leads, then everyone else in a simple grid
- Photos in soft rounded frames with a gentle glow on hover, plus name, grade, subteam, and one line about what they work on
- A short mentors section, because mentors are what make a parent trust a team
- A group photo big enough to actually look at
- First name and last initial for students, and only photos we have permission to post

## What You Learn page

This is the page that turns interest into a signup, and it is the one most team sites do badly. Be concrete, name the real tools, and let a student who has never touched a drill press picture themselves using one.

Each discipline gets its own section with a real photo from the shop, the tool list, and a line about what a new member does in their first month.

### Mechanical

Drills and drivers, clamps, drill press, chop saw, circular saw, jigsaw, allen keys. Cutting, drilling, fastening, and learning why a part failed.

### Electrical

Wire strippers, ferrule crimpers, Anderson Powerpole crimpers, JST crimpers. Clean wiring, connectors that do not fail mid match, and reading a wiring diagram.

### CAD

Designing parts that can actually be manufactured, working inside a shared assembly, and revising a design after it does not fit.

### Software

Controls, autonomous routines, and testing on a real machine that pushes back.

### Outreach

Running events, writing to sponsors, and explaining the team to people who have never heard of FRC.

### Also on this page

- A short safety note, since it is one of the first things a parent looks for
- A line about collaboration, because learning to work with a team is half of what this actually teaches
- A link to Join at the bottom

## Checklist

- [ ] Team grid built, responsive, with hover states
- [ ] Bios and photos collected with permission
- [ ] Mentors section written
- [ ] Group photo added
- [ ] Five discipline sections written with real tool lists
- [ ] Shop photos taken on purpose, not pulled from a group chat
- [ ] First month description written for each discipline
- [ ] Safety note written
- [ ] Both pages end with a link to Join

## Definition of done

A student with zero experience can read What You Learn and name one thing they would get to do in their first month.</pre>
        <p class="nyxcap__labels">Labels: page, content, round-1</p>
      </article>
      <article class="nyxcap__issue">
        <div class="nyxcap__issuehead">
          <div>
            <span class="nyxcap__tag">Sub-issue 5</span>
            <h3>Outreach, Sponsors, and the Join flow</h3>
          </div>
          <button type="button" class="nyxcap__copy" data-nyx-copy>Copy Markdown</button>
        </div>
        <pre class="nyxcap__md">Part of #MAIN

## Context

Three pages that all end in someone taking an action. Outreach ends in a visit request, Sponsors ends in an email, Join ends in a form. If any of them ends without a next step, it failed.

## Outreach

- What the team does beyond competition, told as a few short stories with photos rather than a list of statistics
- Include the numbers, students reached and hours served, but let the photos do the work
- A way for schools and community groups to request a visit

## Sponsors

Two audiences on one page, current sponsors and future ones, so the page splits cleanly.

- Current sponsors as clean logos on the dark background, sized by tier, with no busy frames around them
- A plain explanation of where the money goes, which for us is parts, tooling, registration, and travel
- Tiers with what each one gets, including logo placement on the robot, the shirts, and the site
- A short contact form and a one page sponsorship packet available to download
- Logos need a version that works on a dark background, which usually means asking sponsors for a light or white variant

## Join

The shortest page on the site.

- When we meet, where we meet, what to bring
- "No experience required" stated at the top in plain words
- The signup form, broken into two or three small steps with a progress indicator if it is long, because a long single form is where people quit
- A smaller option for anyone not ready to sign up, which just collects an email for the next info night
- A clear confirmation after submitting, saying what happens next and roughly when

## Design notes

- Form fields styled to match the theme, with visible labels rather than placeholder text as the label
- Errors shown next to the field, in plain language
- Every one of these three pages ends with exactly one clear next step

## Checklist

- [ ] Outreach stories written with photos
- [ ] Outreach numbers confirmed as accurate
- [ ] Visit request path working
- [ ] Sponsor logos collected in a dark background friendly format
- [ ] Tier list written and approved by the leads
- [ ] Sponsorship packet written and linked
- [ ] Join form built and tested end to end
- [ ] Confirmation message written
- [ ] Form submissions actually reach a real inbox, tested twice

## Definition of done

Someone can sign up, and someone else can ask about sponsoring, and both messages land somewhere a person will read them.</pre>
        <p class="nyxcap__labels">Labels: page, content, forms, round-1</p>
      </article>
      <article class="nyxcap__issue">
        <div class="nyxcap__issuehead">
          <div>
            <span class="nyxcap__tag">Sub-issue 6</span>
            <h3>Motion, accessibility, and performance pass</h3>
          </div>
          <button type="button" class="nyxcap__copy" data-nyx-copy>Copy Markdown</button>
        </div>
        <pre class="nyxcap__md">Part of #MAIN

## Context

The last round. Everything exists by now, so this issue is about making the site feel finished and making sure the atmosphere never got in the way of using it.

The test for the whole site: someone can scroll any page and never wait on an animation before they can read something.

## Motion

- Sections fade and lift gently as they enter view, once, and never again
- Easing starts fast and settles softly, never a linear slide
- Page changes cross fade rather than cut, so the star field feels continuous and the site feels like one place
- Buttons and cards respond immediately on hover with a small lift and a soft glow, because instant feedback is what makes an interface feel expensive
- Counters animate once when they scroll into view
- No scroll jacking. If scrolling does not do what the user asked, the whole thing turns annoying fast.

## Accessibility

- Respect reduced motion. The star field goes still and transitions become simple fades.
- Every link and button reachable by keyboard, with a visible focus ring that fits the theme
- Real alt text on photos, not filenames
- Body text well above the minimum contrast ratio against the real background, and gray on gray is not a style
- Headings in a sensible order on every page
- Tested once with a screen reader on the home page and the join page

## Performance

- The home page is readable quickly on a phone on school wifi
- Text loads first, then the star field, then the 3D model
- Images compressed and sized for the slot they sit in
- The 3D model has a size budget agreed on before it ships
- Test on a real phone, not only on a desktop with the window made small

## Content that ages

- Anything with a date on it, like the season or the next event, is easy to update in one place
- A short note in the repository saying where to change it, so next year's team can do it without asking

## Checklist

- [ ] Motion pass across every page
- [ ] Page transitions working
- [ ] Reduced motion honored everywhere
- [ ] Keyboard navigation tested on all seven pages
- [ ] Focus rings styled
- [ ] Alt text written for every image
- [ ] Contrast checked on every text color
- [ ] Loading order verified: text, then background, then model
- [ ] Tested on a real phone on a slow connection
- [ ] Season dependent content documented in one place

## Definition of done

The site feels smooth, works with motion off, works with a keyboard only, and loads fast on a phone.</pre>
        <p class="nyxcap__labels">Labels: polish, accessibility, performance, round-3</p>
      </article>
    </section>

    <section class="nyxcap__section" data-nyx-reveal>
      <p class="nyxcap__kicker">After they are open</p>
      <h2>Keeping it honest</h2>
      <ul class="nyxcap__checks">
        <li>Assign an owner to each sub-issue so nobody waits on someone else to finish</li>
        <li>Answer the CAD permission question early, since sub-issue 3 cannot start without it</li>
        <li>Do not start Round 2 work before the Round 1 pages actually exist</li>
        <li>Close a sub-issue only when its definition of done is met, not when the code is written</li>
      </ul>
    </section>

    <footer class="nyxcap__foot">
      <p>FRC Team Nyx 11744 &nbsp;&middot;&nbsp; Aryan M, Pranay K, Raymond L</p>
      <p>One main issue and six sub-issues</p>
    </footer>

  </div>
</div>

<script>
(function () {
  var root = document.querySelector('.nyxcap');
  if (!root) return;

  var items = root.querySelectorAll('[data-nyx-reveal]');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.04 });
    items.forEach(function (el) { io.observe(el); });
  }

  root.querySelectorAll('[data-nyx-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var pre = btn.closest('.nyxcap__issue').querySelector('pre');
      var text = pre.textContent;
      var done = function () {
        btn.textContent = 'Copied';
        btn.classList.add('is-done');
        setTimeout(function () {
          btn.textContent = 'Copy Markdown';
          btn.classList.remove('is-done');
        }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallback(text, done); });
      } else {
        fallback(text, done);
      }
    });
  });

  function fallback(text, done) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch (e) {}
    document.body.removeChild(ta);
  }
})();
</script>
