---
toc: false
layout: post
title: DSA Website Redesign — TheSprinters
description: A redesign pitch for the Deputy Sheriffs' Association of San Diego County — fixing broken search, non-functional login, and cluttered navigation with a modern full-stack portal.
permalink: /capstone/dsa-redesign/
sticky_rank: 8
---

<style>
  .dsa-repo-links {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin: 1.5rem 0 2rem;
  }
  .dsa-repo-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.65rem 1.2rem;
    background: linear-gradient(135deg, #12314d 0%, #175d84 100%);
    color: #ffffff !important;
    font-weight: 700;
    font-size: 0.95rem;
    border-radius: 12px;
    text-decoration: none !important;
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 4px 16px rgba(4, 14, 24, 0.22);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .dsa-repo-link:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(4, 14, 24, 0.32);
  }
  .dsa-repo-link svg {
    width: 20px;
    height: 20px;
    fill: #ffffff;
  }

  /* ===== Pitch styles ===== */
  .pitch { max-width: 880px; margin: 0 auto; font-family: system-ui, -apple-system, sans-serif; }
  .pitch-hero {
    text-align: center; padding: 2.5rem 1.5rem; margin-bottom: 2rem;
    background: linear-gradient(135deg, #0d2137 0%, #12314d 100%);
    border-radius: 20px; border: 1px solid rgba(251,191,36,0.2);
    position: relative; overflow: hidden;
  }
  .pitch-hero::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse at 30% 80%, rgba(251,191,36,0.06) 0%, transparent 60%);
    pointer-events: none;
  }
  .pitch-hero h2 {
    font-size: 1.8rem !important; font-weight: 800 !important; margin: 0 0 0.5rem !important;
    background: linear-gradient(135deg,#fbbf24,#f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    position: relative;
  }
  .pitch-hero p { color: #94a3b8; font-size: 0.95rem; line-height: 1.6; max-width: 640px; margin: 0 auto; position: relative; }
  .pitch-hero p strong { color: #cbd5e1; }

  .pitch h2 {
    font-size: 1.35rem !important; font-weight: 800 !important; color: #fbbf24 !important;
    border-bottom: 1px solid rgba(251,191,36,0.15); padding-bottom: 8px;
    margin: 2rem 0 1rem !important;
  }
  .pitch h3 { font-size: 1.05rem !important; font-weight: 700 !important; color: #e2e8f0 !important; margin: 1.2rem 0 0.5rem !important; }
  .pitch p { font-size: 0.88rem; color: #94a3b8; line-height: 1.6; margin-bottom: 0.75rem; }
  .pitch strong { color: #e2e8f0; }
  .pitch ul { padding-left: 20px; margin: 0.5rem 0 1rem; }
  .pitch li { font-size: 0.86rem; color: #cbd5e1; margin-bottom: 5px; line-height: 1.5; }
  .pitch a { color: #60a5fa; }
  .pitch .divider { border: none; height: 1px; background: linear-gradient(90deg, transparent, rgba(251,191,36,0.18), transparent); margin: 2rem 0; }

  /* Before / After panels */
  .ba-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 1rem 0; }
  .ba-panel { border-radius: 12px; padding: 18px; }
  .ba-panel.before { background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.2); }
  .ba-panel.after { background: rgba(52,211,153,0.06); border: 1px solid rgba(52,211,153,0.2); }
  .ba-label { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
  .ba-panel.before .ba-label { color: #ef4444; }
  .ba-panel.after .ba-label { color: #34d399; }
  .ba-panel ul { padding-left: 16px; margin: 0; }
  .ba-panel li { font-size: 0.82rem; color: #94a3b8; margin-bottom: 4px; }

  /* Browser mock frame */
  .mock { background: #0b1a2e; border: 1px solid #1e3352; border-radius: 12px; margin: 1rem 0; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
  .mock-chrome { background: #0d1727; padding: 8px 12px; display: flex; align-items: center; gap: 6px; border-bottom: 1px solid #1e3352; }
  .mock-dot { width: 10px; height: 10px; border-radius: 50%; }
  .mock-dot.r { background: #ef4444; } .mock-dot.y { background: #f59e0b; } .mock-dot.g { background: #34d399; }
  .mock-url { flex: 1; margin-left: 10px; padding: 4px 10px; background: #162a46; border-radius: 6px; font-size: 0.7rem; color: #60a5fa; font-family: monospace; }
  .mock-body { padding: 16px; }
  .mock-caption { text-align: center; font-size: 0.72rem; color: #475569; margin: 6px 0 1rem; font-style: italic; }

  /* Visual mockup elements */
  .mock-header { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: rgba(15,40,71,0.95); border-bottom: 1px solid rgba(255,255,255,0.06); border-radius: 8px 8px 0 0; }
  .mock-logo { font-size: 0.72rem; color: #fff; font-weight: 700; display: flex; align-items: center; gap: 6px; }
  .mock-logo::before { content: ''; width: 20px; height: 20px; border-radius: 50%; background: linear-gradient(135deg,#fbbf24,#d97706); display: inline-block; }
  .mock-nav { display: flex; gap: 8px; font-size: 0.62rem; color: #94a3b8; }
  .mock-nav .active { color: #fbbf24; }
  .mock-right { display: flex; gap: 6px; font-size: 0.62rem; align-items: center; }
  .mock-search { padding: 3px 8px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; color: #64748b; }
  .mock-btn { padding: 3px 8px; border-radius: 5px; font-weight: 700; }
  .mock-btn.out { color: #fbbf24; border: 1px solid rgba(251,191,36,0.4); }
  .mock-btn.gold { background: linear-gradient(135deg,#f59e0b,#d97706); color: #1e3a5f; }
  .mock-hero { text-align: center; padding: 16px 14px; background: linear-gradient(170deg, rgba(15,40,71,0.92), rgba(11,26,46,0.96)); }
  .mock-hero h4 { background: linear-gradient(135deg,#fbbf24,#f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 0.9rem !important; margin: 0 0 4px !important; font-weight: 800 !important; }
  .mock-hero p { font-size: 0.66rem !important; color: #7f8ea3 !important; margin: 0 0 6px !important; }
  .mock-tiles { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; padding: 10px 14px; }
  .mock-tile { background: rgba(22,42,70,0.6); border: 1px solid rgba(255,255,255,0.06); border-radius: 6px; padding: 7px; text-align: center; }
  .mock-tile-icon { font-size: 0.85rem; }
  .mock-tile-name { font-size: 0.58rem; color: #fff; font-weight: 700; }
  .mock-tile-desc { font-size: 0.52rem; color: #64748b; }
  .mock-menu-label { font-size: 0.62rem; color: #fff; font-weight: 700; padding: 4px 14px 0; }
  .mock-section { padding: 10px 14px; border-top: 1px solid rgba(255,255,255,0.04); }

  /* Fake form elements for login mock */
  .fake-input { padding: 4px 8px; background: rgba(255,255,255,0.06); border: 1px solid #1e3352; border-radius: 6px; font-size: 0.66rem; color: #64748b; display: block; margin: 4px 0; width: 100%; }
  .fake-error { padding: 5px 8px; background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.3); border-radius: 6px; color: #ef4444; font-size: 0.68rem; margin-top: 6px; }
  .fake-success { padding: 5px 8px; background: rgba(52,211,153,0.12); border: 1px solid rgba(52,211,153,0.3); border-radius: 6px; color: #34d399; font-size: 0.68rem; margin-top: 6px; }

  /* Stats bar */
  .stat-bar { display: flex; gap: 12px; flex-wrap: wrap; margin: 1rem 0; justify-content: center; }
  .stat-item { flex: 1; min-width: 90px; max-width: 150px; background: #162a46; border: 1px solid #1e3352; border-radius: 10px; padding: 12px; text-align: center; }
  .stat-item .n { font-size: 1.5rem; font-weight: 800; color: #fbbf24; display: block; }
  .stat-item .l { font-size: 0.65rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }

  /* Feature number badge */
  .feat-num { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg,#fbbf24,#d97706); color: #1e3a5f; font-weight: 800; font-size: 0.85rem; margin-right: 8px; flex-shrink: 0; }

  /* Summary section */
  .summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 1rem 0; }
  .summary-card { background: rgba(22,42,70,0.5); border: 1px solid #1e3352; border-radius: 10px; padding: 14px; }
  .summary-card h4 { font-size: 0.85rem !important; color: #fbbf24 !important; margin: 0 0 6px !important; }
  .summary-card ul { padding-left: 16px; margin: 0; }
  .summary-card li { font-size: 0.78rem; color: #94a3b8; margin-bottom: 3px; }

  /* CTA */
  .cta-bar { text-align: center; margin: 2rem 0 1rem; }
  .cta-btn { display: inline-block; padding: 0.75rem 2rem; border-radius: 12px; font-weight: 700; font-size: 0.95rem; text-decoration: none !important; transition: transform 0.15s, box-shadow 0.15s; }
  .cta-btn:hover { transform: translateY(-2px); }
  .cta-btn.gold { background: linear-gradient(135deg,#fbbf24,#d97706); color: #1e3a5f !important; box-shadow: 0 4px 16px rgba(251,191,36,0.3); }
  .cta-btn.outline { border: 1px solid rgba(96,165,250,0.4); color: #60a5fa !important; margin-left: 12px; }

  @media (max-width: 700px) {
    .ba-grid, .summary-grid { grid-template-columns: 1fr; }
    .mock-tiles { grid-template-columns: repeat(2, 1fr); }
    .stat-bar { gap: 8px; }
  }
</style>

<div class="pitch">

<!-- ===== PITCH HERO ===== -->
<div class="pitch-hero">
  <h2>Your Website Deserves an Upgrade</h2>
  <p>We rebuilt <strong>dsasd.org</strong> from the ground up. Same mission, same content, same brand &mdash; but faster, cleaner, and built for the way deputies actually use the site. Here are the <strong>3 biggest problems we fixed</strong> and what the new portal looks like.</p>
</div>

<div class="stat-bar">
  <div class="stat-item"><span class="n">3</span><span class="l">Critical Fixes</span></div>
  <div class="stat-item"><span class="n">10+</span><span class="l">Pages Rebuilt</span></div>
  <div class="stat-item"><span class="n">~2</span><span class="l">Scrolls per Page</span></div>
  <div class="stat-item"><span class="n">4,229</span><span class="l">Members Served</span></div>
</div>

<div class="divider"></div>

<!-- ===== FEATURE 1: SEARCH ===== -->
<h2><span class="feat-num">1</span> Search That Members Can Actually Find</h2>

<p>On dsasd.org, the search bar is buried in a WordPress sidebar that doesn't even render on most pages. On mobile, it's completely invisible. Members who want to find a form, a contact number, or a benefit detail have to click through 4+ pages and guess which menu it's under.</p>

<div class="ba-grid">
  <div class="ba-panel before">
    <div class="ba-label">dsasd.org (Before)</div>
    <ul>
      <li>Search hidden in a sidebar widget</li>
      <li>Not visible on mobile at all</li>
      <li>No autocomplete or live results</li>
      <li>Members gave up and called the office</li>
    </ul>
  </div>
  <div class="ba-panel after">
    <div class="ba-label">Our Redesign (After)</div>
    <ul>
      <li>Search in the sticky header &mdash; always visible</li>
      <li>Live results after 2 characters, no Enter needed</li>
      <li>Indexes every page: benefits, events, store, FAQ</li>
      <li>Click a result to jump directly to that section</li>
    </ul>
  </div>
</div>

<div class="mock">
  <div class="mock-chrome">
    <span class="mock-dot r"></span><span class="mock-dot y"></span><span class="mock-dot g"></span>
    <span class="mock-url">dsasd.opencodingsociety.com</span>
  </div>
  <div class="mock-header">
    <div class="mock-logo">DSA San Diego</div>
    <div class="mock-nav"><span class="active">Services</span><span>Community</span><span>Career</span></div>
    <div class="mock-right">
      <span class="mock-search" style="border-color:rgba(251,191,36,0.5);color:#fbbf24">&#128269; Search...</span>
      <span class="mock-btn out">Log In</span>
      <span class="mock-btn gold">Join</span>
    </div>
  </div>
  <div style="padding:10px 14px;background:rgba(11,26,46,0.5)">
    <div style="background:#162a46;border:1px solid rgba(251,191,36,0.3);border-radius:8px;padding:8px 10px;font-size:0.68rem;color:#64748b">
      <div style="color:#fbbf24;font-size:0.6rem;font-weight:700;margin-bottom:6px">SEARCH RESULTS</div>
      <div style="padding:4px 0;border-bottom:1px solid #1e3352;color:#cbd5e1">&#128179; <strong>Benefits</strong> &mdash; Health, dental, vision, life insurance</div>
      <div style="padding:4px 0;border-bottom:1px solid #1e3352;color:#cbd5e1">&#128272; <strong>Legal Defense</strong> &mdash; 24/7 critical incident hotline</div>
      <div style="padding:4px 0;color:#cbd5e1">&#128222; <strong>Contact</strong> &mdash; (858) 486-9009</div>
    </div>
  </div>
</div>
<p class="mock-caption">The new sticky header with live search &mdash; results appear instantly as members type.</p>

<div class="divider"></div>

<!-- ===== FEATURE 2: LOGIN ===== -->
<h2><span class="feat-num">2</span> A Login System That Actually Works</h2>

<p>The current dsasd.org has a "Member Login" link that leads to a broken WordPress form &mdash; no backend, no sessions, no member area. Members click it and get a 404 or a blank page. We built real authentication from scratch.</p>

<div class="ba-grid">
  <div class="ba-panel before">
    <div class="ba-label">dsasd.org (Before)</div>
    <ul>
      <li>Login form submitted into a void &mdash; 404/500 errors</li>
      <li>No user accounts, no sessions</li>
      <li>No member-only content or personalization</li>
      <li>No way to manage member profiles</li>
    </ul>
  </div>
  <div class="ba-panel after">
    <div class="ba-label">Our Redesign (After)</div>
    <ul>
      <li>Full signup/login with secure JWT authentication</li>
      <li>Passwords hashed &mdash; never stored in plain text</li>
      <li>Auto-fills name, badge, station across all pages</li>
      <li>Admin panel for managing member records</li>
    </ul>
  </div>
</div>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:1rem 0">
  <div class="mock">
    <div class="mock-chrome">
      <span class="mock-dot r"></span><span class="mock-dot y"></span><span class="mock-dot g"></span>
      <span class="mock-url" style="color:#ef4444">dsasd.org/login</span>
    </div>
    <div class="mock-body">
      <div style="font-size:0.72rem;color:#fff;font-weight:700;margin-bottom:8px">Member Login</div>
      <div class="fake-input">Username</div>
      <div class="fake-input">Password</div>
      <div class="fake-error">Error: page not found / 500</div>
    </div>
  </div>
  <div class="mock">
    <div class="mock-chrome">
      <span class="mock-dot r"></span><span class="mock-dot y"></span><span class="mock-dot g"></span>
      <span class="mock-url">dsasd.opencodingsociety.com</span>
    </div>
    <div class="mock-body">
      <div style="font-size:0.72rem;color:#fff;font-weight:700;margin-bottom:8px">Member Login</div>
      <div class="fake-input" style="color:#fbbf24;border-color:rgba(251,191,36,0.3)">mrodriguez</div>
      <div class="fake-input" style="color:#fbbf24;border-color:rgba(251,191,36,0.3)">&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;</div>
      <div class="fake-success">Logged in as Deputy M. Rodriguez &mdash; Vista Station</div>
    </div>
  </div>
</div>
<p class="mock-caption">Left: dsasd.org's broken login. Right: our working auth with session persistence and auto-fill.</p>

<div class="divider"></div>

<!-- ===== FEATURE 3: NAVIGATION ===== -->
<h2><span class="feat-num">3</span> One Clean Homepage Instead of 9+ Menu Items</h2>

<p>dsasd.org forces members to navigate through 9+ top-level menu items across multiple page reloads to find basic resources like benefits info, event tickets, or the store. Our redesign puts everything on a single, organized homepage &mdash; 3 clear menus, zero reloads, and only ~2 scrolls to the bottom.</p>

<div class="ba-grid">
  <div class="ba-panel before">
    <div class="ba-label">dsasd.org (Before)</div>
    <ul>
      <li>9+ menu items with confusing sub-dropdowns</li>
      <li>Every click = full page reload</li>
      <li>News section showed only 2 static cards</li>
      <li>Store redirected to an external website</li>
      <li>Not mobile-friendly &mdash; menus break on small screens</li>
    </ul>
  </div>
  <div class="ba-panel after">
    <div class="ba-label">Our Redesign (After)</div>
    <ul>
      <li>3 organized menus: Services, Community, Career</li>
      <li>Single-page app &mdash; smooth scroll, no reloads</li>
      <li>Live news feed, event calendar with RSVP</li>
      <li>In-page store with cart and checkout</li>
      <li>Mobile-first with responsive overlay menu</li>
    </ul>
  </div>
</div>

<div class="mock">
  <div class="mock-chrome">
    <span class="mock-dot r"></span><span class="mock-dot y"></span><span class="mock-dot g"></span>
    <span class="mock-url">dsasd.opencodingsociety.com</span>
  </div>
  <div class="mock-header">
    <div class="mock-logo">DSA San Diego</div>
    <div class="mock-nav"><span class="active">Services</span><span>Community</span><span>Career</span></div>
    <div class="mock-right">
      <span class="mock-search">&#128269; Search...</span>
      <span class="mock-btn out">Log In</span>
      <span class="mock-btn gold">Join</span>
    </div>
  </div>
  <div class="mock-hero">
    <h4>The Strength Behind the Badge</h4>
    <p>Benefits, legal defense, events &mdash; all in one place.</p>
    <div style="display:flex;gap:6px;justify-content:center;margin-top:6px">
      <span class="mock-btn gold" style="font-size:0.6rem">Explore Services</span>
      <span class="mock-btn out" style="font-size:0.6rem">About the DSA</span>
    </div>
    <div style="display:flex;justify-content:center;gap:14px;margin-top:8px;font-size:0.56rem;color:#475569">
      <div><b style="display:block;font-size:0.82rem;color:#fbbf24">4,229</b>Members</div>
      <div><b style="display:block;font-size:0.82rem;color:#fbbf24">70+</b>Years</div>
      <div><b style="display:block;font-size:0.82rem;color:#fbbf24">12</b>Stations</div>
      <div><b style="display:block;font-size:0.82rem;color:#fbbf24">24/7</b>Support</div>
    </div>
  </div>
  <div class="mock-menu-label" style="margin-top:6px">Member Services</div>
  <div class="mock-tiles">
    <div class="mock-tile"><div class="mock-tile-icon">&#128179;</div><div class="mock-tile-name">Benefits</div><div class="mock-tile-desc">Health, dental, vision</div></div>
    <div class="mock-tile"><div class="mock-tile-icon">&#128272;</div><div class="mock-tile-name">Legal Defense</div><div class="mock-tile-desc">24/7 fund</div></div>
    <div class="mock-tile"><div class="mock-tile-icon">&#127891;</div><div class="mock-tile-name">Wellness</div><div class="mock-tile-desc">Peer support</div></div>
    <div class="mock-tile"><div class="mock-tile-icon">&#128196;</div><div class="mock-tile-name">Forms</div><div class="mock-tile-desc">Contracts & docs</div></div>
  </div>
  <div class="mock-menu-label">Community & Info</div>
  <div class="mock-tiles">
    <div class="mock-tile"><div class="mock-tile-icon">&#128240;</div><div class="mock-tile-name">News</div><div class="mock-tile-desc">Latest updates</div></div>
    <div class="mock-tile"><div class="mock-tile-icon">&#128197;</div><div class="mock-tile-name">Events</div><div class="mock-tile-desc">Calendar & RSVP</div></div>
    <div class="mock-tile"><div class="mock-tile-icon">&#127963;</div><div class="mock-tile-name">About</div><div class="mock-tile-desc">Mission & history</div></div>
    <div class="mock-tile"><div class="mock-tile-icon">&#128176;</div><div class="mock-tile-name">Store</div><div class="mock-tile-desc">Official merch</div></div>
  </div>
  <div class="mock-menu-label">Career & Support</div>
  <div class="mock-tiles" style="margin-bottom:10px">
    <div class="mock-tile"><div class="mock-tile-icon">&#127937;</div><div class="mock-tile-name">Rank Path</div><div class="mock-tile-desc">Promotion plan</div></div>
    <div class="mock-tile"><div class="mock-tile-icon">&#10067;</div><div class="mock-tile-name">FAQ</div><div class="mock-tile-desc">Common questions</div></div>
    <div class="mock-tile"><div class="mock-tile-icon">&#128172;</div><div class="mock-tile-name">AI Assistant</div><div class="mock-tile-desc">Chatbot</div></div>
    <div class="mock-tile"><div class="mock-tile-icon">&#128222;</div><div class="mock-tile-name">Contact</div><div class="mock-tile-desc">Visit / call / email</div></div>
  </div>
</div>
<p class="mock-caption">The polished DSA Portal &mdash; every resource organized into 3 menus, ~2 scrolls total.</p>

<div class="divider"></div>

<!-- ===== CTA ===== -->
<div class="cta-bar">
  <a href="{{ site.baseurl }}/sheriff/" class="cta-btn gold">Try the Live Portal</a>
  <a href="https://dsasd.org" target="_blank" class="cta-btn outline">Compare with dsasd.org</a>
</div>

<div class="divider"></div>

<!-- ===== FULL SUMMARY ===== -->
<h2>Everything Else We Built</h2>

<p>Beyond the 3 headline fixes, here's every feature and page included in the redesign:</p>

<div class="summary-grid">
  <div class="summary-card">
    <h4>AI Chatbot</h4>
    <ul>
      <li>18+ preset responses for common DSA questions</li>
      <li>Keyword-matching fallback (no API key needed for demo)</li>
      <li>GPT-4o-mini backend for open-ended questions</li>
    </ul>
  </div>
  <div class="summary-card">
    <h4>Gamification Hub</h4>
    <ul>
      <li>Net Patrol &mdash; canvas game teaching network security</li>
      <li>Robbery Response &mdash; 5-scene tactical decision simulator</li>
      <li>Target Range &mdash; reaction-time shooting trainer</li>
      <li>Badges, leaderboard, and score tracking</li>
    </ul>
  </div>
  <div class="summary-card">
    <h4>Events Calendar</h4>
    <ul>
      <li>Interactive monthly calendar with event dots</li>
      <li>RSVP functionality and filter tabs</li>
      <li>Create Event form for authorized users</li>
    </ul>
  </div>
  <div class="summary-card">
    <h4>DSA Store</h4>
    <ul>
      <li>6 products with category tabs</li>
      <li>Add-to-cart, quantity controls, checkout modal</li>
      <li>Member discount display when logged in</li>
    </ul>
  </div>
  <div class="summary-card">
    <h4>Member Auto-Fill</h4>
    <ul>
      <li>Contact form pre-fills name, badge, station</li>
      <li>Personalized greetings on every sub-page</li>
      <li>Rank pathway highlights current rank</li>
    </ul>
  </div>
  <div class="summary-card">
    <h4>Sub-Pages (All &le; 2 Scrolls)</h4>
    <ul>
      <li>News, FAQ, Contact, Store, Events</li>
      <li>Rank Pathway, About/Info, Gamification</li>
      <li>Each condensed with toggles and compact layouts</li>
    </ul>
  </div>
  <div class="summary-card">
    <h4>Backend API</h4>
    <ul>
      <li>Flask + SQLAlchemy with 6 database tables</li>
      <li>7 REST endpoints (auth, CRUD, chat)</li>
      <li>JWT cookies with cross-subdomain support</li>
    </ul>
  </div>
  <div class="summary-card">
    <h4>Deployment</h4>
    <ul>
      <li>Jekyll frontend on GitHub Pages</li>
      <li>Flask backend on AWS EC2 + Docker</li>
      <li>NGINX reverse proxy with Let's Encrypt SSL</li>
    </ul>
  </div>
</div>

<div class="divider"></div>

</div>

<!-- ===== REPO LINKS ===== -->
<div class="dsa-repo-links">
  <a href="https://github.com/TheSprinters/cap_front" target="_blank" class="dsa-repo-link">
    <svg viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
    Frontend Repository
  </a>
  <a href="https://github.com/TheSprinters/cap_back" target="_blank" class="dsa-repo-link">
    <svg viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
    Backend Repository
  </a>
</div>

{% include dsa-redesign-infograph.html %}
