---
toc: true
layout: post
title: "DSA Website Redesign Proposal"
description: "A detailed analysis and redesign plan for the Deputy Sheriffs' Association of San Diego County website — featuring 3 key improvements with mockups, implementation plans, and team work splits."
courses: {'csp': {'week': 0}}
type: human
categories: [Capstone]
permalink: /blogs/dsa-redesign
---

<style>
  /* ===== Blog-wide Styles ===== */
  .blog-hero {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 2rem;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }
  .blog-hero img {
    width: 100%;
    display: block;
    border-radius: 16px;
  }
  .blog-hero-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0,0,0,0.85));
    padding: 2rem;
    color: #fff;
  }
  .blog-hero-overlay h1 {
    font-size: 2rem;
    margin: 0 0 0.25rem 0;
    color: #d4a853;
  }
  .blog-hero-overlay p {
    margin: 0;
    font-size: 1rem;
    opacity: 0.9;
  }

  /* Section Cards */
  .feature-section {
    background: #1a1a2e;
    border: 1px solid #2a2a4a;
    border-radius: 16px;
    padding: 2rem;
    margin: 2.5rem 0;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  }
  .feature-section h2 {
    color: #d4a853;
    border-bottom: 2px solid #d4a853;
    padding-bottom: 0.5rem;
    margin-top: 0;
  }

  /* Tags */
  .tag-main {
    display: inline-block;
    background: #d4a853;
    color: #000;
    padding: 4px 14px;
    border-radius: 20px;
    font-weight: 700;
    font-size: 0.8rem;
    margin-bottom: 1rem;
  }
  .tag-small {
    display: inline-block;
    background: #3a3a5a;
    color: #d4a853;
    padding: 4px 14px;
    border-radius: 20px;
    font-weight: 600;
    font-size: 0.8rem;
    margin-bottom: 1rem;
  }

  /* Comparison Container */
  .comparison-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin: 1.5rem 0;
  }
  @media (max-width: 768px) {
    .comparison-grid {
      grid-template-columns: 1fr;
    }
  }
  .comparison-card {
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #333;
    background: #111;
  }
  .comparison-card img {
    width: 100%;
    display: block;
  }
  .comparison-label {
    text-align: center;
    padding: 0.6rem;
    font-weight: 700;
    font-size: 0.9rem;
    letter-spacing: 1px;
  }
  .label-before {
    background: #8b0000;
    color: #fff;
  }
  .label-after {
    background: #2e7d32;
    color: #fff;
  }

  /* Mockup Box */
  .mockup-box {
    background: #0d1117;
    border: 2px dashed #d4a853;
    border-radius: 14px;
    padding: 1.5rem;
    margin: 1.5rem 0;
    text-align: center;
  }
  .mockup-box img {
    max-width: 100%;
    border-radius: 10px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.5);
  }
  .mockup-box p {
    margin-top: 0.75rem;
    font-style: italic;
    color: #aaa;
    font-size: 0.85rem;
  }

  /* Work Split Table */
  .work-split {
    width: 100%;
    border-collapse: collapse;
    margin: 1.25rem 0;
    font-size: 0.9rem;
  }
  .work-split th {
    background: #d4a853;
    color: #000;
    padding: 10px 14px;
    text-align: left;
    font-weight: 700;
  }
  .work-split td {
    padding: 10px 14px;
    border-bottom: 1px solid #2a2a4a;
    color: #ddd;
  }
  .work-split tr:nth-child(even) td {
    background: rgba(212,168,83,0.05);
  }

  /* Benefits List */
  .benefits-list {
    list-style: none;
    padding: 0;
  }
  .benefits-list li {
    padding: 0.5rem 0 0.5rem 2rem;
    position: relative;
    color: #ccc;
  }
  .benefits-list li::before {
    content: "✔";
    position: absolute;
    left: 0;
    color: #2e7d32;
    font-weight: bold;
    font-size: 1.1rem;
  }

  /* Implementation Steps */
  .impl-steps {
    counter-reset: step;
    list-style: none;
    padding: 0;
  }
  .impl-steps li {
    counter-increment: step;
    padding: 0.6rem 0 0.6rem 3rem;
    position: relative;
    color: #ccc;
    margin-bottom: 0.25rem;
  }
  .impl-steps li::before {
    content: counter(step);
    position: absolute;
    left: 0;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #d4a853;
    color: #000;
    font-weight: 700;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0.5rem;
  }

  /* Info Box */
  .info-box {
    background: rgba(212,168,83,0.1);
    border-left: 4px solid #d4a853;
    padding: 1rem 1.25rem;
    border-radius: 0 10px 10px 0;
    margin: 1.25rem 0;
    color: #ddd;
  }

  /* Arrow between comparison */
  .arrow-center {
    text-align: center;
    font-size: 2rem;
    color: #d4a853;
    margin: 0.5rem 0;
  }
</style>

<!-- ===== HERO BANNER ===== -->
<div class="blog-hero">
  <img src="{{site.baseurl}}/images/blogs/dsa/dsa_hero.png" alt="DSA Homepage Current State" onerror="this.style.height='300px';this.style.background='linear-gradient(135deg,#1a1a2e,#16213e)';this.alt='DSA Website Banner'">
  <div class="blog-hero-overlay">
    <h1>Deputy Sheriffs' Association of San Diego County</h1>
    <p>Website Redesign Proposal &mdash; Improving UX, Engagement &amp; Accessibility</p>
  </div>
</div>

## About the Client

The **Deputy Sheriffs' Association of San Diego County (DSA)** is the labor union representing the dedicated officers of the San Diego Sheriff's Department. With **70 years** of service and over **4,229 members**, the DSA provides essential benefits, organizes events, and advocates for its deputies. Their website serves as the primary digital hub for member resources, news, store access, and community engagement.

<div class="info-box">
  <strong>Location:</strong> 13881 Danielson Street, Poway, CA 92064 &nbsp;|&nbsp;
  <strong>Phone:</strong> (858) 486-9009 &nbsp;|&nbsp;
  <strong>Email:</strong> info@dsasd.org
</div>

After a thorough review of the DSA website, we identified **three key areas** for improvement — one major feature overhaul and two smaller enhancements — that would significantly boost user experience, accessibility, and engagement.

---

<!-- =========================================================== -->
<!--                  FEATURE 1 — MAIN FEATURE                   -->
<!-- =========================================================== -->

<div class="feature-section">

<span class="tag-main">MAIN FEATURE</span>

## Feature 1: Interactive Member Dashboard & Resource Hub

### The Problem

Currently, the DSA website has a static layout where members must navigate through multiple pages and dropdowns to find benefits, forms, event tickets, and meeting minutes. The FAQ section answers common questions but doesn't provide personalized, quick access to resources. The "Latest News" section only shows two cards (newsletter and minutes) with minimal interactivity.

<div class="mockup-box">
  <img src="{{site.baseurl}}/images/blogs/dsa/dsa_current_news.png" alt="Current Latest News Section" onerror="this.style.height='250px';this.style.background='#222';this.alt='Current news section showing two static cards'">
  <p>Current "Latest News" section — only 2 static cards with limited interactivity</p>
</div>

### The Solution

We propose building an **Interactive Member Dashboard** that consolidates all member resources into a single, personalized hub. After logging in, members will see:

- **Quick-access tiles** for their most-used resources (benefits, forms, event tickets)
- **Live news feed** with filterable categories (newsletters, meeting minutes, announcements, events)
- **Upcoming events calendar** with RSVP functionality
- **Document center** with searchable, categorized forms and downloads
- **Personalized notifications** for new releases and important updates

### Implementation Plan

<ol class="impl-steps">
  <li><strong>Audit existing content architecture</strong> — Map all current pages, resources, documents, and user flows to identify consolidation opportunities.</li>
  <li><strong>Design the dashboard wireframe</strong> — Create a responsive grid layout with quick-access tiles, live feed column, and sidebar calendar using Figma.</li>
  <li><strong>Build the component library</strong> — Develop reusable UI components: resource tile cards, news feed items, calendar widget, search/filter bar.</li>
  <li><strong>Implement the backend API</strong> — Create endpoints for fetching news, events, documents, and member-specific preferences (WordPress REST API or custom).</li>
  <li><strong>Integrate authentication</strong> — Connect the existing login system to serve personalized dashboard content based on membership status.</li>
  <li><strong>User testing &amp; iteration</strong> — Conduct usability tests with a small group of DSA members and iterate based on feedback.</li>
</ol>

### Benefits

<ul class="benefits-list">
  <li>Members find resources in <strong>1 click</strong> instead of navigating 3-4 pages</li>
  <li>Increases engagement with news, events, and benefits information</li>
  <li>Reduces support inquiries by making information self-service</li>
  <li>Modern, professional look that reflects the DSA's prestige</li>
  <li>Mobile-responsive design ensures access on patrol or on-the-go</li>
</ul>

### Mockup: Before vs. After

<div class="comparison-grid">
  <div class="comparison-card">
    <div class="comparison-label label-before">BEFORE — Current Layout</div>
    <div style="background: #1e1e1e; padding: 1.5rem; min-height: 320px;">
      <div style="background: #d4d4d4; border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem;">
        <div style="color: #8b6914; font-weight: 700; text-align: center; font-size: 1.1rem;">March 2026 Newsletter</div>
        <hr style="border-color: #999;">
        <div style="color: #333; text-align: center; font-size: 0.85rem;">Click the button below to read the latest DSA Newsletter.</div>
        <div style="text-align: center; margin-top: 0.75rem;">
          <span style="background: #8b6914; color: #fff; padding: 6px 18px; border-radius: 4px; font-size: 0.8rem;">Read More ›</span>
        </div>
      </div>
      <div style="background: #d4d4d4; border-radius: 8px; padding: 1.5rem;">
        <div style="color: #8b6914; font-weight: 700; text-align: center; font-size: 1.1rem;">Minutes 01.22.26</div>
        <hr style="border-color: #999;">
        <div style="color: #333; text-align: center; font-size: 0.85rem;">Click the button below to read the latest DSA board meeting minutes.</div>
        <div style="text-align: center; margin-top: 0.75rem;">
          <span style="background: #8b6914; color: #fff; padding: 6px 18px; border-radius: 4px; font-size: 0.8rem;">Read More ›</span>
        </div>
      </div>
    </div>
  </div>
  <div class="comparison-card">
    <div class="comparison-label label-after">AFTER — Interactive Dashboard</div>
    <div style="background: #0f1923; padding: 1.5rem; min-height: 320px;">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem;">
        <div style="background: linear-gradient(135deg, #d4a853, #b8922e); border-radius: 10px; padding: 0.75rem; text-align: center;">
          <div style="font-size: 1.5rem;">📋</div>
          <div style="color: #000; font-weight: 700; font-size: 0.75rem;">Benefits</div>
        </div>
        <div style="background: linear-gradient(135deg, #3a6ea5, #2c5282); border-radius: 10px; padding: 0.75rem; text-align: center;">
          <div style="font-size: 1.5rem;">🎫</div>
          <div style="color: #fff; font-weight: 700; font-size: 0.75rem;">Events</div>
        </div>
        <div style="background: linear-gradient(135deg, #4a6741, #2e7d32); border-radius: 10px; padding: 0.75rem; text-align: center;">
          <div style="font-size: 1.5rem;">📄</div>
          <div style="color: #fff; font-weight: 700; font-size: 0.75rem;">Forms</div>
        </div>
        <div style="background: linear-gradient(135deg, #6b3fa0, #553098); border-radius: 10px; padding: 0.75rem; text-align: center;">
          <div style="font-size: 1.5rem;">🛒</div>
          <div style="color: #fff; font-weight: 700; font-size: 0.75rem;">Store</div>
        </div>
      </div>
      <div style="background: #1a2332; border-radius: 8px; padding: 0.75rem; margin-bottom: 0.5rem;">
        <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
          <span style="background: #d4a853; color: #000; padding: 2px 10px; border-radius: 12px; font-size: 0.7rem; font-weight: 600;">All</span>
          <span style="background: #2a3a4a; color: #aaa; padding: 2px 10px; border-radius: 12px; font-size: 0.7rem;">News</span>
          <span style="background: #2a3a4a; color: #aaa; padding: 2px 10px; border-radius: 12px; font-size: 0.7rem;">Minutes</span>
          <span style="background: #2a3a4a; color: #aaa; padding: 2px 10px; border-radius: 12px; font-size: 0.7rem;">Events</span>
        </div>
        <div style="background: #0f1923; border-radius: 6px; padding: 0.5rem; margin-bottom: 0.4rem; border-left: 3px solid #d4a853;">
          <div style="color: #d4a853; font-size: 0.75rem; font-weight: 600;">📰 March 2026 Newsletter</div>
          <div style="color: #888; font-size: 0.65rem;">Posted 3 days ago</div>
        </div>
        <div style="background: #0f1923; border-radius: 6px; padding: 0.5rem; border-left: 3px solid #3a6ea5;">
          <div style="color: #6ba3d6; font-size: 0.75rem; font-weight: 600;">📅 Board Meeting — Jan 22</div>
          <div style="color: #888; font-size: 0.65rem;">Minutes available</div>
        </div>
      </div>
    </div>
  </div>
</div>

### Work Split

<table class="work-split">
  <thead>
    <tr><th>Team Member</th><th>Role / Tasks</th></tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Akhil</strong></td>
      <td><strong>Backend & API Development</strong> — Build REST API endpoints for fetching news, events, documents, and member preferences. Set up database schema for dashboard content. Integrate with existing authentication system.</td>
    </tr>
    <tr>
      <td><strong>Neil</strong></td>
      <td><strong>UI/UX Design & Frontend Layout</strong> — Design the dashboard wireframes in Figma. Build the responsive grid layout, quick-access tile components, and news feed UI. Implement the filter/search bar functionality.</td>
    </tr>
    <tr>
      <td><strong>Moiz</strong></td>
      <td><strong>Calendar Widget & Notifications</strong> — Develop the interactive events calendar with RSVP features. Build the notification system for new content. Implement the document center with search and categorization.</td>
    </tr>
  </tbody>
</table>

</div>

---

<!-- =========================================================== -->
<!--               FEATURE 2 — SMALL FEATURE #1                  -->
<!-- =========================================================== -->

<div class="feature-section">

<span class="tag-small">SMALL FEATURE</span>

## Feature 2: Modernized FAQ with Smart Search & Live Chat

### The Problem

The current FAQ section uses a simple accordion layout with 5 static questions. Members must read through each question to find relevant answers. There is no search functionality, no way to ask new questions, and the FAQ content can become outdated without a content management workflow.

<div class="mockup-box">
  <img src="{{site.baseurl}}/images/blogs/dsa/dsa_current_faq.png" alt="Current FAQ Section" onerror="this.style.height='200px';this.style.background='#222';this.alt='Current FAQ with basic accordion'">
  <p>Current FAQ — basic accordion with 5 static questions and no search</p>
</div>

### The Solution

We will redesign the FAQ into a **Smart FAQ Hub** featuring:

- **Instant search bar** that filters questions as the user types
- **Categorized sections** (Membership, Benefits, Store, Events, Legal) with icons
- **Expandable answers** with rich formatting, links, and embedded contact forms
- **"Didn't find your answer?" live chat button** that connects to a simple support chatbot or email form

### Implementation Plan

<ol class="impl-steps">
  <li><strong>Content audit & categorization</strong> — Review all existing FAQ content, gather additional common questions from DSA staff, and organize into logical categories.</li>
  <li><strong>Build the search component</strong> — Implement a client-side fuzzy search using a lightweight JavaScript library (e.g., Fuse.js) that instantly filters questions.</li>
  <li><strong>Redesign the accordion UI</strong> — Create a modern, categorized accordion with icons, smooth animations, and rich answer formatting.</li>
  <li><strong>Add the live chat / contact widget</strong> — Integrate a floating support button that opens a simple contact form or chatbot.</li>
</ol>

### Benefits

<ul class="benefits-list">
  <li>Members find answers instantly via search instead of scanning all questions</li>
  <li>Categories make browsing intuitive for different member needs</li>
  <li>Live chat fallback ensures no question goes unanswered</li>
  <li>Richer answer formatting allows embedding links, images, and forms</li>
</ul>

### Mockup: Before vs. After

<div class="comparison-grid">
  <div class="comparison-card">
    <div class="comparison-label label-before">BEFORE — Static FAQ</div>
    <div style="background: #f5f5f5; padding: 1.25rem; min-height: 280px;">
      <div style="color: #333; font-size: 0.8rem; font-weight: 700; margin-bottom: 0.75rem;">Frequently Asked Questions</div>
      <div style="background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 0.6rem; margin-bottom: 0.5rem;">
        <div style="color: #8b6914; font-size: 0.75rem; font-weight: 600;">How can I support the DSA? <span style="float:right">▼</span></div>
      </div>
      <div style="background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 0.6rem; margin-bottom: 0.5rem;">
        <div style="color: #8b6914; font-size: 0.75rem; font-weight: 600;">How do I purchase event tickets? <span style="float:right">▶</span></div>
      </div>
      <div style="background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 0.6rem; margin-bottom: 0.5rem;">
        <div style="color: #8b6914; font-size: 0.75rem; font-weight: 600;">Do I have to be a DSA member? <span style="float:right">▶</span></div>
      </div>
      <div style="background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 0.6rem; margin-bottom: 0.5rem;">
        <div style="color: #8b6914; font-size: 0.75rem; font-weight: 600;">Can I be a member if I'm not active? <span style="float:right">▶</span></div>
      </div>
      <div style="background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 0.6rem;">
        <div style="color: #8b6914; font-size: 0.75rem; font-weight: 600;">What are the DSA Store hours? <span style="float:right">▶</span></div>
      </div>
    </div>
  </div>
  <div class="comparison-card">
    <div class="comparison-label label-after">AFTER — Smart FAQ Hub</div>
    <div style="background: #0f1923; padding: 1.25rem; min-height: 280px;">
      <div style="background: #1a2332; border: 1px solid #d4a853; border-radius: 8px; padding: 0.6rem; margin-bottom: 0.75rem; display: flex; align-items: center;">
        <span style="color: #d4a853; margin-right: 0.5rem;">🔍</span>
        <span style="color: #666; font-size: 0.75rem;">Search FAQs...</span>
      </div>
      <div style="display: flex; gap: 0.4rem; margin-bottom: 0.75rem; flex-wrap: wrap;">
        <span style="background: #d4a853; color: #000; padding: 3px 10px; border-radius: 12px; font-size: 0.65rem; font-weight: 600;">All</span>
        <span style="background: #1a2332; color: #aaa; padding: 3px 10px; border-radius: 12px; font-size: 0.65rem;">👤 Membership</span>
        <span style="background: #1a2332; color: #aaa; padding: 3px 10px; border-radius: 12px; font-size: 0.65rem;">💰 Benefits</span>
        <span style="background: #1a2332; color: #aaa; padding: 3px 10px; border-radius: 12px; font-size: 0.65rem;">🛒 Store</span>
      </div>
      <div style="background: #1a2332; border-radius: 8px; padding: 0.6rem; margin-bottom: 0.4rem; border-left: 3px solid #d4a853;">
        <div style="color: #d4a853; font-size: 0.75rem; font-weight: 600;">How can I support the DSA?</div>
        <div style="color: #aaa; font-size: 0.65rem; margin-top: 0.25rem;">Multiple avenues to show your support — donate directly, support a fundraiser...</div>
      </div>
      <div style="background: #1a2332; border-radius: 8px; padding: 0.6rem; margin-bottom: 0.4rem;">
        <div style="color: #ccc; font-size: 0.75rem; font-weight: 600;">How do I purchase event tickets? <span style="float:right; color:#555;">▶</span></div>
      </div>
      <div style="background: #1a2332; border-radius: 8px; padding: 0.6rem; margin-bottom: 0.75rem;">
        <div style="color: #ccc; font-size: 0.75rem; font-weight: 600;">What are the DSA Store hours? <span style="float:right; color:#555;">▶</span></div>
      </div>
      <div style="background: #d4a853; border-radius: 20px; padding: 0.5rem; text-align: center;">
        <span style="color: #000; font-size: 0.75rem; font-weight: 700;">💬 Didn't find your answer? Chat with us</span>
      </div>
    </div>
  </div>
</div>

### Work Split

<table class="work-split">
  <thead>
    <tr><th>Team Member</th><th>Role / Tasks</th></tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Neil</strong></td>
      <td><strong>Content Audit & Categorization</strong> — Review and organize all FAQ content, create category structure, write any new Q&A entries based on common member inquiries.</td>
    </tr>
    <tr>
      <td><strong>Moiz</strong></td>
      <td><strong>Frontend Search & UI</strong> — Build the fuzzy search component with Fuse.js, redesign the accordion UI with icons, smooth animations, and rich formatting support.</td>
    </tr>
    <tr>
      <td><strong>Akhil</strong></td>
      <td><strong>Live Chat & Contact Widget</strong> — Implement the floating support chat button, build the contact form fallback, and integrate chat/email routing logic.</td>
    </tr>
  </tbody>
</table>

</div>

---

<!-- =========================================================== -->
<!--               FEATURE 3 — SMALL FEATURE #2                  -->
<!-- =========================================================== -->

<div class="feature-section">

<span class="tag-small">SMALL FEATURE</span>

## Feature 3: Enhanced Navigation with Mega Menu & Mobile Optimization

### The Problem

The current navigation bar has 9+ top-level items, several with dropdown sub-menus. On desktop, the dropdowns are basic hover menus. On mobile, the navigation experience is not optimized — items can be difficult to tap, and the deep menu hierarchy makes it hard to find specific pages quickly. The search icon in the header is small and easily overlooked.

<div class="mockup-box">
  <img src="{{site.baseurl}}/images/blogs/dsa/dsa_current_nav.png" alt="Current Navigation Bar" onerror="this.style.height='80px';this.style.background='#222';this.alt='Current nav bar with 9+ items and small dropdowns'">
  <p>Current navigation — crowded top bar with basic hover dropdowns</p>
</div>

### The Solution

We will implement a **Mega Menu** system with:

- **Grouped sub-navigation panels** that open on hover (desktop) or tap (mobile), showing all sub-pages at a glance with descriptions and icons
- **Prominent search bar** integrated into the navigation with autocomplete suggestions
- **Mobile-first hamburger menu** with a full-screen slide-out panel, large touch targets, and breadcrumb navigation
- **Sticky header** that compresses on scroll for more content visibility

### Implementation Plan

<ol class="impl-steps">
  <li><strong>Map the information architecture</strong> — Document all pages and their hierarchy, identify groupings for mega menu panels.</li>
  <li><strong>Design the mega menu panels</strong> — Create desktop and mobile designs with clear groupings, icons, and descriptions for each section.</li>
  <li><strong>Build the responsive navigation component</strong> — Implement the mega menu with CSS Grid, smooth transitions, and accessible keyboard navigation.</li>
  <li><strong>Add search with autocomplete</strong> — Build a prominent search bar that suggests pages, news articles, and FAQ entries as the user types.</li>
</ol>

### Benefits

<ul class="benefits-list">
  <li>All sub-pages visible at a glance without hunting through dropdowns</li>
  <li>Mobile users can navigate the full site with ease</li>
  <li>Search autocomplete helps members find exactly what they need</li>
  <li>Sticky header ensures navigation is always accessible</li>
  <li>Meets modern accessibility standards (WCAG 2.1 AA)</li>
</ul>

### Mockup: Before vs. After

<div class="comparison-grid">
  <div class="comparison-card">
    <div class="comparison-label label-before">BEFORE — Basic Dropdown Nav</div>
    <div style="background: #1a1a1a; padding: 0.75rem; min-height: 200px;">
      <div style="display: flex; align-items: center; gap: 0.75rem; background: #222; padding: 0.6rem 1rem; border-radius: 8px; flex-wrap: wrap;">
        <div style="width: 30px; height: 30px; background: #444; border-radius: 50%;"></div>
        <span style="color: #4a90d9; font-size: 0.7rem; font-weight: 600;">Home</span>
        <span style="color: #aaa; font-size: 0.7rem;">About Us ▾</span>
        <span style="color: #aaa; font-size: 0.7rem;">MOA ▾</span>
        <span style="color: #aaa; font-size: 0.7rem;">DSA Store ▾</span>
        <span style="color: #aaa; font-size: 0.7rem;">Members ▾</span>
        <span style="color: #aaa; font-size: 0.7rem;">Benefits ▾</span>
        <span style="color: #aaa; font-size: 0.7rem;">Media ▾</span>
        <span style="color: #aaa; font-size: 0.7rem;">Contact</span>
        <span style="color: #aaa; font-size: 0.7rem;">iQue</span>
        <span style="background: #4a90d9; color: #fff; font-size: 0.65rem; padding: 3px 10px; border-radius: 4px;">LOG OUT</span>
      </div>
      <div style="margin-top: 0.75rem; margin-left: 5rem;">
        <div style="background: #333; border: 1px solid #444; border-radius: 4px; padding: 0.4rem; width: 120px;">
          <div style="color: #aaa; font-size: 0.65rem; padding: 0.2rem 0; border-bottom: 1px solid #444;">Our Team</div>
          <div style="color: #aaa; font-size: 0.65rem; padding: 0.2rem 0; border-bottom: 1px solid #444;">History</div>
          <div style="color: #aaa; font-size: 0.65rem; padding: 0.2rem 0;">Foundation</div>
        </div>
      </div>
      <div style="color: #666; font-size: 0.7rem; text-align: center; margin-top: 1.5rem;">Small dropdowns, no descriptions, no icons</div>
    </div>
  </div>
  <div class="comparison-card">
    <div class="comparison-label label-after">AFTER — Mega Menu Navigation</div>
    <div style="background: #0f1923; padding: 0.75rem; min-height: 200px;">
      <div style="display: flex; align-items: center; gap: 0.75rem; background: #1a2332; padding: 0.6rem 1rem; border-radius: 8px;">
        <div style="width: 30px; height: 30px; background: #d4a853; border-radius: 50%;"></div>
        <span style="color: #d4a853; font-size: 0.7rem; font-weight: 600;">Home</span>
        <span style="color: #fff; font-size: 0.7rem; font-weight: 500; text-decoration: underline; text-decoration-color: #d4a853;">About ▾</span>
        <span style="color: #ccc; font-size: 0.7rem;">Resources ▾</span>
        <span style="color: #ccc; font-size: 0.7rem;">Members ▾</span>
        <span style="color: #ccc; font-size: 0.7rem;">Media ▾</span>
        <div style="flex: 1;"></div>
        <div style="background: #2a3a4a; border-radius: 6px; padding: 3px 10px; display: flex; align-items: center; gap: 4px;">
          <span style="color: #d4a853; font-size: 0.7rem;">🔍</span>
          <span style="color: #666; font-size: 0.65rem;">Search...</span>
        </div>
      </div>
      <div style="background: #1a2332; border: 1px solid #2a3a4a; border-radius: 0 0 10px 10px; padding: 0.75rem; margin-top: 2px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.75rem;">
        <div>
          <div style="color: #d4a853; font-size: 0.7rem; font-weight: 700; margin-bottom: 0.3rem;">🏛️ About DSA</div>
          <div style="color: #aaa; font-size: 0.6rem; padding: 0.15rem 0;">Our Team & Leadership</div>
          <div style="color: #aaa; font-size: 0.6rem; padding: 0.15rem 0;">70-Year History</div>
          <div style="color: #aaa; font-size: 0.6rem; padding: 0.15rem 0;">DSA Foundation</div>
        </div>
        <div>
          <div style="color: #d4a853; font-size: 0.7rem; font-weight: 700; margin-bottom: 0.3rem;">📋 Services</div>
          <div style="color: #aaa; font-size: 0.6rem; padding: 0.15rem 0;">Contract Negotiations</div>
          <div style="color: #aaa; font-size: 0.6rem; padding: 0.15rem 0;">Legal Defense</div>
          <div style="color: #aaa; font-size: 0.6rem; padding: 0.15rem 0;">Political Action</div>
        </div>
        <div>
          <div style="color: #d4a853; font-size: 0.7rem; font-weight: 700; margin-bottom: 0.3rem;">📞 Connect</div>
          <div style="color: #aaa; font-size: 0.6rem; padding: 0.15rem 0;">Contact Us</div>
          <div style="color: #aaa; font-size: 0.6rem; padding: 0.15rem 0;">Social Media</div>
          <div style="color: #aaa; font-size: 0.6rem; padding: 0.15rem 0;">iQue Portal</div>
        </div>
      </div>
    </div>
  </div>
</div>

### Work Split

<table class="work-split">
  <thead>
    <tr><th>Team Member</th><th>Role / Tasks</th></tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Moiz</strong></td>
      <td><strong>Information Architecture & Design</strong> — Map all pages into mega menu groupings, design the panel layouts and icons, create the mobile slide-out wireframe.</td>
    </tr>
    <tr>
      <td><strong>Akhil</strong></td>
      <td><strong>Responsive Frontend Build</strong> — Implement the mega menu with CSS Grid, build the mobile hamburger/slide-out panel, add smooth transitions and sticky header behavior.</td>
    </tr>
    <tr>
      <td><strong>Neil</strong></td>
      <td><strong>Search & Accessibility</strong> — Build the search autocomplete component, ensure full keyboard navigation (WCAG 2.1 AA), and perform cross-browser/device testing.</td>
    </tr>
  </tbody>
</table>

</div>

---

## Team Work Distribution Summary

The table below shows how tasks are distributed to ensure each team member gains **well-rounded experience** across different skill areas:

<table class="work-split">
  <thead>
    <tr><th>Member</th><th>Feature 1 (Main)</th><th>Feature 2 (Small)</th><th>Feature 3 (Small)</th></tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Akhil</strong></td>
      <td>Backend & API</td>
      <td>Live Chat & Contact Widget</td>
      <td>Responsive Frontend Build</td>
    </tr>
    <tr>
      <td><strong>Neil</strong></td>
      <td>UI/UX Design & Layout</td>
      <td>Content Audit & Strategy</td>
      <td>Search & Accessibility</td>
    </tr>
    <tr>
      <td><strong>Moiz</strong></td>
      <td>Calendar & Notifications</td>
      <td>Frontend Search & UI</td>
      <td>IA & Design</td>
    </tr>
  </tbody>
</table>

<div class="info-box">
  <strong>Key takeaway:</strong> Every member touches a <em>different area</em> in each feature — backend, frontend, design, content, testing — ensuring well-rounded skill development and no single-role silos.
</div>
