---
microblog: true
toc: false
layout: post
title: FRC Team Nyx 11744 Website
description: A capstone rebuild of the Team Nyx 11744 robotics website around a dark matter and deep space theme, an interactive 3D robot, and motion that stays out of the reader's way.
permalink: /capstone/nyx-website/
sticky_rank: 1
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

<div class="nyxcap">
  <div class="nyxcap__sky" aria-hidden="true">
    <div class="nyxcap__neb"></div>
    <div class="nyxcap__stars nyxcap__stars--far"></div>
    <div class="nyxcap__stars nyxcap__stars--near"></div>
  </div>

  <div class="nyxcap__inner">

    <!-- HERO -->
    <header data-nyx-reveal>
      <p class="nyxcap__eyebrow">AP CSP Capstone &nbsp;&bull;&nbsp; 2026 to 2027</p>
      <h1 class="nyxcap__title">FRC Team Nyx 11744 Website</h1>
      <p class="nyxcap__lede">
        Nyx is the goddess of night, so the team site should look like deep space, feel calm and expensive,
        move smoothly, and put the robot at the center of it. This is the rebuild of that site, planned
        around the people who actually land on it.
      </p>
      <div class="nyxcap__row">
        <span class="nyxcap__chip"><i></i>Aryan M</span>
        <span class="nyxcap__chip"><i></i>Pranay K</span>
        <span class="nyxcap__chip"><i></i>Raymond L</span>
      </div>
      <dl class="nyxcap__meta">
        <div><dt>Status</dt><dd>In progress</dd></div>
        <div><dt>Team</dt><dd>FRC Nyx 11744</dd></div>
        <div><dt>Build order</dt><dd>Three rounds</dd></div>
        <div><dt>Current site</dt><dd><a href="https://frc-nyx.vercel.app/">frc-nyx.vercel.app</a></dd></div>
      </dl>
    </header>

    <!-- PROBLEM -->
    <section class="nyxcap__section" data-nyx-reveal>
      <p class="nyxcap__kicker">The problem</p>
      <h2>A site that works but does not land</h2>
      <p>
        Nyx already has a website. It loads, it has the right pages, and the dark look is a good starting point.
        What it does not do yet is make someone feel something in the first five seconds, and it does not clearly
        answer the question almost every visitor arrives with, which is some version of
        <strong>"what is this team and can I be part of it."</strong>
      </p>
      <div class="nyxcap__stats">
        <div class="nyxcap__stat"><b>60</b><span>Students learning</span></div>
        <div class="nyxcap__stat"><b>5</b><span>Disciplines taught</span></div>
        <div class="nyxcap__stat"><b>7</b><span>Pages planned</span></div>
        <div class="nyxcap__stat"><b>5s</b><span>To make the case</span></div>
      </div>
    </section>

    <!-- AUDIENCE -->
    <section class="nyxcap__section" data-nyx-reveal>
      <p class="nyxcap__kicker">Who it is for</p>
      <h2>Four visitors, four questions</h2>
      <p>Every page decision traces back to one of these. If a page does not serve one of them, it does not get built yet.</p>
      <div class="nyxcap__grid nyxcap__grid--2">
        <div class="nyxcap__card">
          <span class="nyxcap__num">01</span>
          <h3>Students who might join</h3>
          <p>Usually a freshman or sophomore with zero experience. Am I allowed to be new, what would I actually get to do, and how do I sign up.</p>
        </div>
        <div class="nyxcap__card">
          <span class="nyxcap__num">02</span>
          <h3>Parents</h3>
          <p>Is this real, organized, and safe. What does the team teach, who runs it, when does it meet, and how do I reach someone.</p>
        </div>
        <div class="nyxcap__card">
          <span class="nyxcap__num">03</span>
          <h3>Sponsors</h3>
          <p>Local businesses and engineering companies. Is this team serious, where would our name go, and how do we say yes.</p>
        </div>
        <div class="nyxcap__card">
          <span class="nyxcap__num">04</span>
          <h3>Judges, teams, and mentors</h3>
          <p>The robot, the build process, the CAD, and the outreach numbers. They go straight to the robot page.</p>
        </div>
      </div>
    </section>

    <!-- GOALS -->
    <section class="nyxcap__section" data-nyx-reveal>
      <p class="nyxcap__kicker">What the site has to do</p>
      <h2>Three jobs, plus one quiet one</h2>
      <div class="nyxcap__grid nyxcap__grid--3">
        <div class="nyxcap__card">
          <h3>Make joining easy</h3>
          <p>Make someone want to join, then make joining take under a minute.</p>
        </div>
        <div class="nyxcap__card">
          <h3>Show what you learn</h3>
          <p>Concrete skills and real tools, not slogans. Mechanical, electrical, CAD, software, and outreach.</p>
        </div>
        <div class="nyxcap__card">
          <h3>Give sponsors a door</h3>
          <p>A reason to reach out and an obvious place to do it.</p>
        </div>
      </div>
      <p style="margin-top:18px;">
        The quiet fourth job is memory. Next year nobody will remember the details of this season unless the site keeps them.
      </p>
    </section>

    <!-- THEME -->
    <section class="nyxcap__section" data-nyx-reveal>
      <p class="nyxcap__kicker">The look</p>
      <h2>Dark matter and deep space</h2>
      <p>
        Not a cartoon galaxy with bright nebulas everywhere. Closer to a real telescope image: mostly very dark,
        a lot of empty room, and a few small points of light, with the robot as the thing lit up in front of you.
      </p>
      <div class="nyxcap__swatches" aria-hidden="true">
        <div class="nyxcap__sw" style="background:#05060e;">Void base</div>
        <div class="nyxcap__sw" style="background:#0f1226;">Surface</div>
        <div class="nyxcap__sw" style="background:linear-gradient(140deg,#6b46ff,#8b6bff);">Accent</div>
        <div class="nyxcap__sw" style="background:linear-gradient(140deg,#2fb6cc,#4fd6e8);color:#052027;">Signal</div>
        <div class="nyxcap__sw" style="background:#e8e9f2;color:#1a1c2b;">Text</div>
      </div>
      <div class="nyxcap__grid nyxcap__grid--3">
        <div class="nyxcap__card">
          <h3>The background</h3>
          <p>A slow field of stars drifting behind the whole site, layered so far stars barely move. Slow enough that you only notice it if you stop and look.</p>
        </div>
        <div class="nyxcap__card">
          <h3>Shape and space</h3>
          <p>Rounded, soft, and roomy. Thin low contrast borders instead of hard boxes. When in doubt, add space and remove a border.</p>
        </div>
        <div class="nyxcap__card">
          <h3>Type</h3>
          <p>One clean geometric sans set large for headlines, a comfortable reading face for body, and a little monospace for the team number and stat labels.</p>
        </div>
      </div>
    </section>

    <!-- ROBOT -->
    <section class="nyxcap__section" data-nyx-reveal>
      <p class="nyxcap__kicker">The centerpiece</p>
      <h2>A robot you can grab and spin</h2>
      <p>
        A real 3D model of the robot floating in the star field, already turning slowly so people know it is
        interactive, with a little momentum when you let go. Hovering a subsystem dims the rest and brings up a
        short label, which is a natural way to teach someone what a swerve module is.
      </p>
      <div class="nyxcap__note">
        <p>
          <strong>Open question that blocks this.</strong> Are we allowed to publish the robot CAD on a public site?
          We ask the leads and mentors first, and the page is designed so it never depends on the model existing.
        </p>
      </div>
      <div class="nyxcap__grid nyxcap__grid--3">
        <div class="nyxcap__card">
          <span class="nyxcap__num">If yes</span>
          <h3>Full model</h3>
          <p>Export from the CAD, simplify it until it loads fast, and use it in the hero and on the robot page.</p>
        </div>
        <div class="nyxcap__card">
          <span class="nyxcap__num">If partly</span>
          <h3>Simplified model</h3>
          <p>Just the frame and the main mechanism. Honestly this might look better anyway.</p>
        </div>
        <div class="nyxcap__card">
          <span class="nyxcap__num">If not yet</span>
          <h3>Photo turntable</h3>
          <p>A slow rotating set of real photos or a wireframe, with the model swapped in later.</p>
        </div>
      </div>
    </section>

    <!-- MOTION -->
    <section class="nyxcap__section" data-nyx-reveal>
      <p class="nyxcap__kicker">How it moves</p>
      <h2>Calm and confident, not showing off</h2>
      <p>
        The test is whether someone can scroll a whole page and never wait on an animation before they can read
        something. Sections fade and lift in gently once. Page changes cross fade so the star field feels
        continuous. Buttons answer instantly on hover, because immediate feedback is what makes an interface feel
        expensive. No scroll jacking, and reduced motion settings are respected everywhere.
      </p>
    </section>

    <!-- MAP -->
    <section class="nyxcap__section" data-nyx-reveal>
      <p class="nyxcap__kicker">Where everything lives</p>
      <h2>Seven pages, flat, no submenus</h2>
      <div class="nyxcap__map">
        <div class="nyxcap__leaf"><b>Home</b><span>Five short scenes: the hero, who we are, the numbers, what you would do, and one clear call to join.</span></div>
        <div class="nyxcap__leaf"><b>The Robot</b><span>The interactive model, a subsystem walkthrough, the build timeline, and an honest note on what we would change.</span></div>
        <div class="nyxcap__leaf"><b>Team</b><span>Faces, not a directory. Leads, members, and the mentors that make a parent trust a team.</span></div>
        <div class="nyxcap__leaf"><b>What You Learn</b><span>The page that turns interest into a signup. Real tools named, and what a new member does in their first month.</span></div>
        <div class="nyxcap__leaf"><b>Outreach</b><span>A few short stories with photos, the numbers behind them, and a way to request a visit.</span></div>
        <div class="nyxcap__leaf"><b>Sponsors</b><span>Clean logos on dark, where the money goes, the tiers, and a short way to start a conversation.</span></div>
        <div class="nyxcap__leaf"><b>Join</b><span>The shortest page on the site. When, where, what to bring, and a form that does not make you quit.</span></div>
      </div>
    </section>

    <!-- ROUNDS -->
    <section class="nyxcap__section" data-nyx-reveal>
      <p class="nyxcap__kicker">Design Based Research</p>
      <h2>Built in three rounds</h2>
      <p>Same idea as a build season. Each round has to work on its own before the next one starts.</p>
      <div class="nyxcap__rounds">
        <div class="nyxcap__round">
          <h3>Round 1 &nbsp;&middot;&nbsp; Structure and content</h3>
          <p>Every page exists, the flow works, the words are real, and it looks acceptable in plain dark styling. No star field, no 3D model.</p>
        </div>
        <div class="nyxcap__round">
          <h3>Round 2 &nbsp;&middot;&nbsp; Atmosphere</h3>
          <p>The star field, the glow, the page transitions, and the motion pass. This is where it starts to feel like Nyx.</p>
        </div>
        <div class="nyxcap__round">
          <h3>Round 3 &nbsp;&middot;&nbsp; The robot</h3>
          <p>The 3D model, the subsystem walkthrough, and a polish pass across accessibility and speed.</p>
        </div>
      </div>
      <p style="margin-top:22px;">
        The reason for that order is simple. If we start with the 3D robot, we end the season with an amazing hero
        section and five empty pages.
      </p>
    </section>

    <!-- DONE -->
    <section class="nyxcap__section" data-nyx-reveal>
      <p class="nyxcap__kicker">How we know it worked</p>
      <h2>What done looks like</h2>
      <ul class="nyxcap__checks">
        <li>All seven pages exist with real content and no placeholder text anywhere</li>
        <li>The site reads well on a phone before it reads well on a desktop</li>
        <li>Nothing breaks or becomes unreadable with motion turned off</li>
        <li>Body text stays well above the minimum contrast ratio on the dark background</li>
        <li>Two people who are not on the team can find how to join without being told</li>
        <li>Season content can be updated next year without asking us how</li>
      </ul>
    </section>

    <footer class="nyxcap__foot">
      <p>FRC Team Nyx 11744 &nbsp;&middot;&nbsp; Aryan M, Pranay K, Raymond L</p>
      <p>Tracked in GitHub as one main issue and six sub-issues</p>
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
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

  items.forEach(function (el) { io.observe(el); });
})();
</script>
