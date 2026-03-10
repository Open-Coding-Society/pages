---
toc: true
layout: post
title: "D.A.D. Website Redesign Proposal"
description: "A detailed analysis and redesign plan for the Doing Exceptional Deeds (D.A.D.) nonprofit website — featuring 3 key improvements with mockups, implementation plans, and team work splits"
courses: {'csp': {'week': 0}}
type: human
categories: [Capstone]
permalink: /blogs/dad-redesign
---

<style>
  /* ===== Blog-wide Styles ===== */
  .blog-hero-dad {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 2rem;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }
  .blog-hero-dad img {
    width: 100%;
    display: block;
    border-radius: 16px;
  }
  .blog-hero-dad-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0,0,0,0.85));
    padding: 2rem;
    color: #fff;
  }
  .blog-hero-dad-overlay h1 {
    font-size: 2rem;
    margin: 0 0 0.25rem 0;
    color: #e85d3a;
  }
  .blog-hero-dad-overlay p {
    margin: 0;
    font-size: 1rem;
    opacity: 0.9;
  }

  /* Section Cards */
  .feature-section-dad {
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 16px;
    padding: 2rem;
    margin: 2.5rem 0;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  }
  .feature-section-dad h2 {
    color: #e85d3a;
    border-bottom: 2px solid #e85d3a;
    padding-bottom: 0.5rem;
    margin-top: 0;
  }

  /* Tags */
  .tag-main-dad {
    display: inline-block;
    background: #e85d3a;
    color: #fff;
    padding: 4px 14px;
    border-radius: 20px;
    font-weight: 700;
    font-size: 0.8rem;
    margin-bottom: 1rem;
  }
  .tag-small-dad {
    display: inline-block;
    background: #3a3a3a;
    color: #e85d3a;
    padding: 4px 14px;
    border-radius: 20px;
    font-weight: 600;
    font-size: 0.8rem;
    margin-bottom: 1rem;
  }

  /* Comparison Container */
  .comparison-grid-dad {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin: 1.5rem 0;
  }
  @media (max-width: 768px) {
    .comparison-grid-dad {
      grid-template-columns: 1fr;
    }
  }
  .comparison-card-dad {
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #333;
    background: #111;
  }
  .comparison-card-dad img {
    width: 100%;
    display: block;
  }
  .comparison-label-dad {
    text-align: center;
    padding: 0.6rem;
    font-weight: 700;
    font-size: 0.9rem;
    letter-spacing: 1px;
  }
  .label-before-dad {
    background: #8b0000;
    color: #fff;
  }
  .label-after-dad {
    background: #2e7d32;
    color: #fff;
  }

  /* Mockup Box */
  .mockup-box-dad {
    background: #0d1117;
    border: 2px dashed #e85d3a;
    border-radius: 14px;
    padding: 1.5rem;
    margin: 1.5rem 0;
    text-align: center;
  }
  .mockup-box-dad img {
    max-width: 100%;
    border-radius: 10px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.5);
  }
  .mockup-box-dad p {
    margin-top: 0.75rem;
    font-style: italic;
    color: #aaa;
    font-size: 0.85rem;
  }

  /* Work Split Table */
  .work-split-dad {
    width: 100%;
    border-collapse: collapse;
    margin: 1.25rem 0;
    font-size: 0.9rem;
  }
  .work-split-dad th {
    background: #e85d3a;
    color: #fff;
    padding: 10px 14px;
    text-align: left;
    font-weight: 700;
  }
  .work-split-dad td {
    padding: 10px 14px;
    border-bottom: 1px solid #333;
    color: #ddd;
  }
  .work-split-dad tr:nth-child(even) td {
    background: rgba(232,93,58,0.05);
  }

  /* Benefits List */
  .benefits-list-dad {
    list-style: none;
    padding: 0;
  }
  .benefits-list-dad li {
    padding: 0.5rem 0 0.5rem 2rem;
    position: relative;
    color: #ccc;
  }
  .benefits-list-dad li::before {
    content: "✔";
    position: absolute;
    left: 0;
    color: #2e7d32;
    font-weight: bold;
    font-size: 1.1rem;
  }

  /* Implementation Steps */
  .impl-steps-dad {
    counter-reset: step-dad;
    list-style: none;
    padding: 0;
  }
  .impl-steps-dad li {
    counter-increment: step-dad;
    padding: 0.6rem 0 0.6rem 3rem;
    position: relative;
    color: #ccc;
    margin-bottom: 0.25rem;
  }
  .impl-steps-dad li::before {
    content: counter(step-dad);
    position: absolute;
    left: 0;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #e85d3a;
    color: #fff;
    font-weight: 700;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0.5rem;
  }

  /* Info Box */
  .info-box-dad {
    background: rgba(232,93,58,0.1);
    border-left: 4px solid #e85d3a;
    padding: 1rem 1.25rem;
    border-radius: 0 10px 10px 0;
    margin: 1.25rem 0;
    color: #ddd;
  }
</style>

<!-- ===== HERO BANNER ===== -->
<div class="blog-hero-dad">
  <img src="{{site.baseurl}}/images/blogs/dad/dad_hero.png" alt="D.A.D. Homepage Current State" onerror="this.style.height='300px';this.style.background='linear-gradient(135deg,#1a1a1a,#2d1810)';this.alt='D.A.D. Website Banner'">
  <div class="blog-hero-dad-overlay">
    <h1>Doing Exceptional Deeds (D.A.D.)</h1>
    <p>Website Redesign Proposal &mdash; Elevating Impact Through Better Digital Presence</p>
  </div>
</div>

## About the Organization

**Doing Exceptional Deeds (D.A.D.)** is a 501(c)(3) nonprofit organization based in **San Marcos, CA 92078**. Their mission is to **uplift individuals and strengthen communities across generations** through character-first programs that build confidence, character, accountability, and purpose.

D.A.D. serves youth, young adults, student-athletes, and seniors through thoughtfully designed initiatives that support personal growth, life-skills development, mentorship, and community engagement. They also offer a **community-based Student Success Advisory model** designed to support students from middle school through high school.

<div class="info-box-dad">
  <strong>Location:</strong> 420 Station Road, San Marcos, CA 92078 &nbsp;|&nbsp;
  <strong>Type:</strong> 501(c)(3) Nonprofit &nbsp;|&nbsp;
  <strong>EIN:</strong> #3302138
</div>

After reviewing the D.A.D. website, we identified **three key improvements** — one major redesign and two smaller enhancements — that would dramatically improve their digital presence, donor engagement, and program visibility.

---

<!-- =========================================================== -->
<!--                  FEATURE 1 — MAIN FEATURE                   -->
<!-- =========================================================== -->

<div class="feature-section-dad">

<span class="tag-main-dad">MAIN FEATURE</span>

## Feature 1: Complete Homepage Redesign with Impact Storytelling

### The Problem

The current D.A.D. homepage has several UX and design issues:

- **Cluttered layout** with text-heavy mission statement that's hard to scan
- **Small, hard-to-read fonts** throughout the page
- **Navigation bar** is cramped with small text and a bright red/orange background that overwhelms the content
- **No clear visual hierarchy** — the "About Us," "Exceptional Projects," "Donate," and "Get Involved" buttons are presented equally without guiding the user's journey
- **Mission section** is a wall of text with no visual breaks, icons, or imagery to support readability.
- **No impact metrics** visible above the fold (number of youth served, programs offered, etc.)
- **Footer is minimal** with just address and copyright — no social proof or calls to action

<div class="mockup-box-dad">
  <img src="{{site.baseurl}}/images/blogs/dad/dad_current_home.png" alt="Current D.A.D. Homepage" onerror="this.style.height='300px';this.style.background='#222';this.alt='Current homepage with cluttered layout and text-heavy content'">
  <p>Current homepage — small text, cramped navigation, text-heavy mission section</p>
</div>

### The Solution

We will completely redesign the homepage with a focus on **impact storytelling** and **clear user journeys**:

- **Full-width hero section** with a compelling background image, bold tagline, and two clear CTAs ("Donate" and "Learn More")
- **Impact metrics bar** showing key numbers (youth served, programs, years active) with animated counters
- **Visual mission section** with icons, short paragraphs, and side-by-side images instead of wall-of-text
- **Program spotlight cards** with images, brief descriptions, and links to individual program pages
- **Testimonial carousel** featuring quotes from families and community members
- **Prominent donation CTA** section with progress bar and impact statements ("$50 sponsors one student for a month")

### Implementation Plan

<ol class="impl-steps-dad">
  <li><strong>Content strategy session</strong> — Work with D.A.D. leadership to identify key stories, impact metrics, and program highlights to feature on the homepage.</li>
  <li><strong>Design the new homepage layout</strong> — Create wireframes and high-fidelity mockups in Figma with the full-width hero, impact bar, program cards, and testimonial sections.</li>
  <li><strong>Build reusable component library</strong> — Develop the hero section, metric counter, program card, testimonial carousel, and donation CTA as reusable Wix/custom components.</li>
  <li><strong>Implement responsive design</strong> — Ensure the homepage looks excellent on mobile, tablet, and desktop with appropriate breakpoints and touch targets.</li>
  <li><strong>Content population &amp; SEO optimization</strong> — Add real content, optimize images, write meta descriptions, and ensure fast load times.</li>
  <li><strong>Analytics setup</strong> — Add event tracking for CTAs, donation clicks, and program page visits to measure engagement improvements.</li>
</ol>

### Benefits

<ul class="benefits-list-dad">
  <li>First impression goes from text-heavy to <strong>visually compelling</strong> in under 3 seconds</li>
  <li>Impact metrics build <strong>immediate credibility</strong> with donors and partners</li>
  <li>Clear CTAs guide visitors toward <strong>donating or getting involved</strong></li>
  <li>Program cards make it easy to discover and learn about <strong>specific initiatives</strong></li>
  <li>Testimonials provide <strong>social proof</strong> and emotional connection</li>
  <li>Mobile-optimized design ensures <strong>50%+ of visitors</strong> on phones have a great experience</li>
</ul>

### Mockup: Before vs. After

<div class="comparison-grid-dad">
  <div class="comparison-card-dad">
    <div class="comparison-label-dad label-before-dad">BEFORE — Current Homepage</div>
    <div style="background: #fff; padding: 1rem; min-height: 380px;">
      <div style="text-align: center; margin-bottom: 0.5rem;">
        <div style="width: 25px; height: 25px; background: #e85d3a; border-radius: 4px; margin: 0 auto 0.25rem;"></div>
        <div style="font-family: serif; color: #222; font-size: 1rem; font-weight: 700;">Doing ExceptionAL Deeds</div>
        <div style="color: #888; font-size: 0.6rem;">A 501C (3) NON-PROFIT ORGANIZATION</div>
      </div>
      <div style="background: #e85d3a; padding: 0.3rem; display: flex; justify-content: center; gap: 1rem; border-radius: 4px; margin-bottom: 0.75rem;">
        <span style="color: #fff; font-size: 0.55rem;">HOME</span>
        <span style="color: #fff; font-size: 0.55rem;">Athlete Portal</span>
        <span style="color: #fff; font-size: 0.55rem;">Programs</span>
        <span style="color: #fff; font-size: 0.55rem;">More</span>
      </div>
      <div style="background: #eee; border-radius: 6px; height: 80px; margin-bottom: 0.5rem; display: flex; align-items: center; justify-content: center;">
        <span style="color: #aaa; font-size: 0.7rem;">[Team Photo]</span>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 0.25rem; margin-bottom: 0.5rem;">
        <div style="background: #e85d3a; padding: 0.3rem; text-align: center; border-radius: 3px;">
          <div style="color: #fff; font-size: 0.5rem; font-weight: 700;">ABOUT US</div>
        </div>
        <div style="background: #e85d3a; padding: 0.3rem; text-align: center; border-radius: 3px;">
          <div style="color: #fff; font-size: 0.45rem; font-weight: 700;">Exceptional PROJECTS</div>
        </div>
        <div style="background: #e85d3a; padding: 0.3rem; text-align: center; border-radius: 3px;">
          <div style="color: #fff; font-size: 0.5rem; font-weight: 700;">DONATE</div>
        </div>
        <div style="background: #e85d3a; padding: 0.3rem; text-align: center; border-radius: 3px;">
          <div style="color: #fff; font-size: 0.45rem; font-weight: 700;">GET INVOLVED</div>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1.5fr; gap: 0.5rem;">
        <div style="background: #eee; border-radius: 6px; height: 70px; display: flex; align-items: center; justify-content: center;">
          <span style="color: #aaa; font-size: 0.6rem;">[Photo]</span>
        </div>
        <div>
          <div style="color: #222; font-size: 0.65rem; font-weight: 600; margin-bottom: 0.25rem;">Our Mission:</div>
          <div style="color: #555; font-size: 0.5rem; line-height: 1.3;">At Doing Exceptional Deeds (D.A.D), our mission is to uplift individuals and strengthen communities across generations through character-first programs that build confidence, character, accountability, and purpose...</div>
        </div>
      </div>
    </div>
  </div>
  <div class="comparison-card-dad">
    <div class="comparison-label-dad label-after-dad">AFTER — Impact-Driven Homepage</div>
    <div style="background: #111; padding: 1rem; min-height: 380px;">
      <!-- Hero -->
      <div style="background: linear-gradient(135deg, #2d1810, #1a1a2e); border-radius: 10px; padding: 1.25rem; margin-bottom: 0.75rem; text-align: center;">
        <div style="color: #e85d3a; font-size: 0.7rem; font-weight: 700; letter-spacing: 2px; margin-bottom: 0.25rem;">DOING EXCEPTIONAL DEEDS</div>
        <div style="color: #fff; font-size: 1.1rem; font-weight: 800; margin-bottom: 0.25rem;">Empowering Youth.<br>Strengthening Communities.</div>
        <div style="color: #aaa; font-size: 0.65rem; margin-bottom: 0.5rem;">Character-first programs serving San Diego County since 2021</div>
        <div style="display: flex; justify-content: center; gap: 0.5rem;">
          <span style="background: #e85d3a; color: #fff; padding: 5px 16px; border-radius: 20px; font-size: 0.7rem; font-weight: 700;">Donate Now</span>
          <span style="border: 1px solid #fff; color: #fff; padding: 5px 16px; border-radius: 20px; font-size: 0.7rem;">Learn More</span>
        </div>
      </div>
      <!-- Impact Metrics -->
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.5rem; margin-bottom: 0.75rem;">
        <div style="background: #1a1a2e; border-radius: 8px; padding: 0.5rem; text-align: center; border: 1px solid #e85d3a33;">
          <div style="color: #e85d3a; font-size: 1.2rem; font-weight: 800;">500+</div>
          <div style="color: #888; font-size: 0.55rem;">Youth Served</div>
        </div>
        <div style="background: #1a1a2e; border-radius: 8px; padding: 0.5rem; text-align: center; border: 1px solid #e85d3a33;">
          <div style="color: #e85d3a; font-size: 1.2rem; font-weight: 800;">8+</div>
          <div style="color: #888; font-size: 0.55rem;">Active Programs</div>
        </div>
        <div style="background: #1a1a2e; border-radius: 8px; padding: 0.5rem; text-align: center; border: 1px solid #e85d3a33;">
          <div style="color: #e85d3a; font-size: 1.2rem; font-weight: 800;">4</div>
          <div style="color: #888; font-size: 0.55rem;">Years of Impact</div>
        </div>
      </div>
      <!-- Program Cards -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
        <div style="background: #1a1a1a; border-radius: 8px; overflow: hidden; border: 1px solid #333;">
          <div style="background: linear-gradient(45deg, #e85d3a, #c0392b); height: 45px; display: flex; align-items: center; justify-content: center;">
            <span style="font-size: 1.2rem;">⚽</span>
          </div>
          <div style="padding: 0.4rem;">
            <div style="color: #e85d3a; font-size: 0.65rem; font-weight: 700;">Youth Athletics</div>
            <div style="color: #888; font-size: 0.5rem;">Building character through sports</div>
          </div>
        </div>
        <div style="background: #1a1a1a; border-radius: 8px; overflow: hidden; border: 1px solid #333;">
          <div style="background: linear-gradient(45deg, #2980b9, #1a5276); height: 45px; display: flex; align-items: center; justify-content: center;">
            <span style="font-size: 1.2rem;">📚</span>
          </div>
          <div style="padding: 0.4rem;">
            <div style="color: #2980b9; font-size: 0.65rem; font-weight: 700;">Student Advisory</div>
            <div style="color: #888; font-size: 0.5rem;">Middle school to high school</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

### Work Split

<table class="work-split-dad">
  <thead>
    <tr><th>Team Member</th><th>Role / Tasks</th></tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Neil</strong></td>
      <td><strong>Full-Stack Homepage Build</strong> — Implement the hero section, impact metrics bar with animated counters, and responsive layout. Build the testimonial carousel component and donation CTA section.</td>
    </tr>
    <tr>
      <td><strong>Moiz</strong></td>
      <td><strong>Content Strategy & SEO</strong> — Work with D.A.D. leadership to gather stories, metrics, and testimonials. Write all homepage copy, optimize images, write meta descriptions, and configure analytics tracking.</td>
    </tr>
    <tr>
      <td><strong>Akhil</strong></td>
      <td><strong>UI/UX Design & Program Cards</strong> — Design the complete homepage wireframe and high-fidelity mockups in Figma. Build the program spotlight card components and ensure design consistency across all sections.</td>
    </tr>
  </tbody>
</table>

</div>

---

<!-- =========================================================== -->
<!--               FEATURE 2 — SMALL FEATURE #1                  -->
<!-- =========================================================== -->

<div class="feature-section-dad">

<span class="tag-small-dad">SMALL FEATURE</span>

## Feature 2: Donation Flow Redesign with Impact Visualization

### The Problem

The current website has a "Donate" button in the navigation bar area, but there is no dedicated donation page with compelling visuals, impact breakdowns, or a streamlined giving experience. Potential donors have to navigate away from the main site without understanding how their contribution makes a difference. There are no suggested donation amounts, no recurring donation option easily visible, and no visual showing the tangible impact of different giving levels.

<div class="mockup-box-dad">
  <img src="{{site.baseurl}}/images/blogs/dad/dad_current_donate.png" alt="Current Donation Experience" onerror="this.style.height='180px';this.style.background='#222';this.alt='Current donate button is just a nav link with no dedicated page'">
  <p>Current donation experience — a simple navigation button with no dedicated impact-driven donation page</p>
</div>

### The Solution

We will create a **dedicated Donation Page** with:

- **Impact tiers** — Visual cards showing what each donation level accomplishes ($25, $50, $100, $250, $500)
- **Progress bar** — A community fundraising goal tracker to motivate giving
- **Quick donate buttons** — Pre-set amounts with a custom amount option for fast donations
- **Recurring giving toggle** — Easy one-click switch between one-time and monthly donations
- **Photo + story section** — A brief story of a youth who benefited from donations, with before/after impact imagery

### Implementation Plan

<ol class="impl-steps-dad">
  <li><strong>Design the donation page</strong> — Create wireframes with impact tiers, progress bar, and story section. Get feedback from D.A.D. team on messaging.</li>
  <li><strong>Build impact tier cards</strong> — Develop interactive cards that visually show what each donation level accomplishes with icons and animations.</li>
  <li><strong>Integrate payment processing</strong> — Connect donation buttons to their existing payment processor (Wix payments / PayPal) with recurring donation support.</li>
  <li><strong>Add community progress tracker</strong> — Build a real-time progress bar showing how close they are to their current fundraising goal.</li>
</ol>

### Benefits

<ul class="benefits-list-dad">
  <li>Donors see <strong>exactly how their money helps</strong> — increasing average gift size</li>
  <li>Pre-set amounts with impact descriptions <strong>reduce decision paralysis</strong></li>
  <li>Recurring donation toggle can <strong>increase lifetime donor value by 5x</strong></li>
  <li>Community progress bar creates <strong>urgency and social motivation</strong></li>
  <li>Storytelling section builds <strong>emotional connection</strong> that drives giving</li>
</ul>

### Mockup: Before vs. After

<div class="comparison-grid-dad">
  <div class="comparison-card-dad">
    <div class="comparison-label-dad label-before-dad">BEFORE — Basic Donate Button</div>
    <div style="background: #fff; padding: 1.25rem; min-height: 280px;">
      <div style="background: #e85d3a; padding: 0.3rem; display: flex; justify-content: center; gap: 1.5rem; border-radius: 4px; margin-bottom: 2rem;">
        <span style="color: #fff; font-size: 0.6rem;">HOME</span>
        <span style="color: #fff; font-size: 0.6rem;">Programs</span>
        <span style="color: #fff; font-size: 0.6rem; font-weight: 700; text-decoration: underline;">DONATE</span>
        <span style="color: #fff; font-size: 0.6rem;">More</span>
      </div>
      <div style="text-align: center; padding: 2rem;">
        <div style="color: #888; font-size: 0.8rem;">↗ Redirects to external payment page</div>
        <div style="color: #aaa; font-size: 0.7rem; margin-top: 1rem;">No impact information</div>
        <div style="color: #aaa; font-size: 0.7rem;">No suggested amounts</div>
        <div style="color: #aaa; font-size: 0.7rem;">No recurring option visibility</div>
      </div>
    </div>
  </div>
  <div class="comparison-card-dad">
    <div class="comparison-label-dad label-after-dad">AFTER — Impact-Driven Donation Page</div>
    <div style="background: #111; padding: 1.25rem; min-height: 280px;">
      <div style="text-align: center; margin-bottom: 0.75rem;">
        <div style="color: #e85d3a; font-size: 0.85rem; font-weight: 800;">Make a Difference Today</div>
        <div style="color: #888; font-size: 0.6rem;">Your gift directly supports youth in San Diego County</div>
      </div>
      <!-- Progress Bar -->
      <div style="margin-bottom: 0.75rem;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.2rem;">
          <span style="color: #aaa; font-size: 0.55rem;">$12,400 raised</span>
          <span style="color: #aaa; font-size: 0.55rem;">Goal: $20,000</span>
        </div>
        <div style="background: #333; border-radius: 10px; height: 10px; overflow: hidden;">
          <div style="background: linear-gradient(90deg, #e85d3a, #f39c12); height: 100%; width: 62%; border-radius: 10px;"></div>
        </div>
      </div>
      <!-- Donation Tiers -->
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.4rem; margin-bottom: 0.75rem;">
        <div style="background: #1a1a2e; border: 1px solid #333; border-radius: 8px; padding: 0.4rem; text-align: center;">
          <div style="color: #e85d3a; font-size: 0.9rem; font-weight: 800;">$25</div>
          <div style="color: #888; font-size: 0.5rem;">Supplies for 1 student</div>
        </div>
        <div style="background: #1a1a2e; border: 2px solid #e85d3a; border-radius: 8px; padding: 0.4rem; text-align: center;">
          <div style="color: #e85d3a; font-size: 0.55rem; font-weight: 700;">MOST POPULAR</div>
          <div style="color: #e85d3a; font-size: 0.9rem; font-weight: 800;">$50</div>
          <div style="color: #888; font-size: 0.5rem;">1 month mentorship</div>
        </div>
        <div style="background: #1a1a2e; border: 1px solid #333; border-radius: 8px; padding: 0.4rem; text-align: center;">
          <div style="color: #e85d3a; font-size: 0.9rem; font-weight: 800;">$100</div>
          <div style="color: #888; font-size: 0.5rem;">Full program session</div>
        </div>
      </div>
      <!-- Toggle + CTA -->
      <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 0.5rem;">
        <span style="color: #888; font-size: 0.6rem;">One-time</span>
        <div style="width: 32px; height: 16px; background: #e85d3a; border-radius: 8px; position: relative;">
          <div style="width: 12px; height: 12px; background: #fff; border-radius: 50%; position: absolute; right: 2px; top: 2px;"></div>
        </div>
        <span style="color: #e85d3a; font-size: 0.6rem; font-weight: 700;">Monthly</span>
      </div>
      <div style="background: #e85d3a; border-radius: 20px; padding: 0.5rem; text-align: center;">
        <span style="color: #fff; font-size: 0.75rem; font-weight: 700;">Donate $50/month →</span>
      </div>
    </div>
  </div>
</div>

### Work Split

<table class="work-split-dad">
  <thead>
    <tr><th>Team Member</th><th>Role / Tasks</th></tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Akhil</strong></td>
      <td><strong>Content & Impact Storytelling</strong> — Gather real impact stories from D.A.D., write donation tier descriptions, and create the compelling narrative section with before/after impact imagery.</td>
    </tr>
    <tr>
      <td><strong>Neil</strong></td>
      <td><strong>Payment Integration & Backend</strong> — Connect donation buttons to Wix Payments / PayPal, implement recurring donation logic, and build the real-time community progress tracker with database integration.</td>
    </tr>
    <tr>
      <td><strong>Moiz</strong></td>
      <td><strong>UI Design & Frontend Build</strong> — Design the donation page layout, build the impact tier cards with animations, the one-time/monthly toggle, and the quick donate button grid.</td>
    </tr>
  </tbody>
</table>

</div>

---

<!-- =========================================================== -->
<!--               FEATURE 3 — SMALL FEATURE #2                  -->
<!-- =========================================================== -->

<div class="feature-section-dad">

<span class="tag-small-dad">SMALL FEATURE</span>

## Feature 3: Program Pages with Registration & Photo Gallery

### The Problem

The current website mentions several programs (youth athletics, student advisory, mentorship, community engagement) but the details are buried in the long mission text on the homepage. There are no dedicated program pages with:
- Clear descriptions of what each program offers
- Photos or videos showing programs in action
- Registration or sign-up forms for interested families
- Schedules, locations, or eligibility information

Interested families must contact D.A.D. directly just to learn basic information about available programs.

<div class="mockup-box-dad">
  <img src="{{site.baseurl}}/images/blogs/dad/dad_current_programs.png" alt="Current Program Information" onerror="this.style.height='200px';this.style.background='#222';this.alt='Program info buried in mission text'">
  <p>Current state — program information is embedded in the mission text with no dedicated pages or sign-up forms</p>
</div>

### The Solution

We will create **individual Program Pages** each featuring:

- **Hero banner** with a program-specific photo and title
- **Overview section** with goals, age groups, schedule, and location
- **Photo gallery** with a lightbox viewer showing the program in action
- **Registration form** embedded directly on the page for easy sign-ups
- **FAQ section** specific to each program
- **Related programs** sidebar linking to other D.A.D. initiatives

### Implementation Plan

<ol class="impl-steps-dad">
  <li><strong>Gather program details</strong> — Work with D.A.D. staff to document each program's description, schedule, eligibility, location, and collect photos/videos.</li>
  <li><strong>Design the program page template</strong> — Create a reusable page template in Figma with hero, overview, gallery, registration, and FAQ sections.</li>
  <li><strong>Build the photo gallery component</strong> — Implement a responsive photo grid with lightbox viewer, lazy loading, and optional video support.</li>
  <li><strong>Create the registration form</strong> — Build a form with fields for parent/guardian info, student info, program selection, and medical/emergency contacts, connected to email notifications.</li>
</ol>

### Benefits

<ul class="benefits-list-dad">
  <li>Families can <strong>learn about and sign up for programs</strong> without calling or emailing</li>
  <li>Photo galleries provide <strong>visual proof of impact</strong> and build trust</li>
  <li>Dedicated pages improve <strong>SEO rankings</strong> for program-related searches</li>
  <li>Registration forms <strong>reduce admin workload</strong> by automating intake</li>
  <li>Reusable template makes it <strong>easy to add new programs</strong> in the future</li>
</ul>

### Mockup: Before vs. After

<div class="comparison-grid-dad">
  <div class="comparison-card-dad">
    <div class="comparison-label-dad label-before-dad">BEFORE — Text Buried in Homepage</div>
    <div style="background: #fff; padding: 1.25rem; min-height: 280px;">
      <div style="display: grid; grid-template-columns: 1fr 1.5fr; gap: 0.75rem;">
        <div style="background: #eee; border-radius: 6px; height: 120px; display: flex; align-items: center; justify-content: center;">
          <span style="color: #aaa; font-size: 0.6rem;">[Coaching Photo]</span>
        </div>
        <div>
          <div style="background: #e85d3a; height: 4px; width: 50px; border-radius: 2px; margin-bottom: 0.3rem;"></div>
          <div style="color: #222; font-size: 0.65rem; font-weight: 600; margin-bottom: 0.25rem;">Our Mission:</div>
          <div style="color: #555; font-size: 0.45rem; line-height: 1.4;">At Doing Exceptional Deeds (D.A.D), our mission is to uplift individuals and strengthen communities across generations through character-first programs that build confidence, character, accountability, and purpose. We serve youth, young adults, student athletes, and seniors through thoughtfully designed initiatives that support personal growth, life-skills development, mentorship, and community engagement — meeting people where they are and guiding them toward their full potential...</div>
        </div>
      </div>
      <div style="text-align: center; margin-top: 1.5rem;">
        <div style="color: #aaa; font-size: 0.7rem;">No dedicated program pages</div>
        <div style="color: #aaa; font-size: 0.7rem;">No registration forms</div>
        <div style="color: #aaa; font-size: 0.7rem;">No photo galleries</div>
      </div>
    </div>
  </div>
  <div class="comparison-card-dad">
    <div class="comparison-label-dad label-after-dad">AFTER — Dedicated Program Page</div>
    <div style="background: #111; padding: 1.25rem; min-height: 280px;">
      <!-- Program Hero -->
      <div style="background: linear-gradient(135deg, #2d1810, #e85d3a33); border-radius: 8px; padding: 0.75rem; margin-bottom: 0.75rem;">
        <div style="color: #e85d3a; font-size: 0.6rem; font-weight: 700; letter-spacing: 1px;">D.A.D. PROGRAMS</div>
        <div style="color: #fff; font-size: 0.9rem; font-weight: 800;">Youth Athletics &amp; Character Building</div>
        <div style="color: #aaa; font-size: 0.55rem;">Ages 8-18 · San Marcos, CA · Saturdays 9am-12pm</div>
      </div>
      <!-- Photo Grid -->
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.3rem; margin-bottom: 0.75rem;">
        <div style="background: #2a2a2a; border-radius: 6px; height: 45px; display: flex; align-items: center; justify-content: center;">
          <span style="font-size: 1rem;">⚽</span>
        </div>
        <div style="background: #2a2a2a; border-radius: 6px; height: 45px; display: flex; align-items: center; justify-content: center;">
          <span style="font-size: 1rem;">🏃</span>
        </div>
        <div style="background: #2a2a2a; border-radius: 6px; height: 45px; display: flex; align-items: center; justify-content: center;">
          <span style="font-size: 1rem;">🤝</span>
        </div>
      </div>
      <!-- Quick Info -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem; margin-bottom: 0.75rem;">
        <div style="background: #1a1a2e; border-radius: 6px; padding: 0.4rem; border-left: 3px solid #e85d3a;">
          <div style="color: #e85d3a; font-size: 0.55rem; font-weight: 700;">📅 Schedule</div>
          <div style="color: #aaa; font-size: 0.5rem;">Saturdays, 9am–12pm</div>
        </div>
        <div style="background: #1a1a2e; border-radius: 6px; padding: 0.4rem; border-left: 3px solid #2980b9;">
          <div style="color: #2980b9; font-size: 0.55rem; font-weight: 700;">📍 Location</div>
          <div style="color: #aaa; font-size: 0.5rem;">San Marcos, CA</div>
        </div>
      </div>
      <!-- Register CTA -->
      <div style="background: #e85d3a; border-radius: 20px; padding: 0.5rem; text-align: center;">
        <span style="color: #fff; font-size: 0.7rem; font-weight: 700;">Register Your Child →</span>
      </div>
    </div>
  </div>
</div>

### Work Split

<table class="work-split-dad">
  <thead>
    <tr><th>Team Member</th><th>Role / Tasks</th></tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Moiz</strong></td>
      <td><strong>Content Gathering & Page Copy</strong> — Coordinate with D.A.D. staff to collect program details, photos, schedules, and eligibility info. Write descriptions and FAQ entries for each program page.</td>
    </tr>
    <tr>
      <td><strong>Akhil</strong></td>
      <td><strong>Registration Form & Backend</strong> — Build the registration form with validation, connect it to email notifications, and set up the database for storing registrations and program data.</td>
    </tr>
    <tr>
      <td><strong>Neil</strong></td>
      <td><strong>Photo Gallery & Page Template</strong> — Design and build the reusable program page template, implement the responsive photo gallery with lightbox viewer and lazy loading.</td>
    </tr>
  </tbody>
</table>

</div>

---

## Team Work Distribution Summary

The table below shows how tasks are distributed to ensure each team member gains **well-rounded experience** across different skill areas:

<table class="work-split-dad">
  <thead>
    <tr><th>Member</th><th>Feature 1 (Main)</th><th>Feature 2 (Small)</th><th>Feature 3 (Small)</th></tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Akhil</strong></td>
      <td>UI/UX Design & Components</td>
      <td>Content & Impact Storytelling</td>
      <td>Registration Form & Backend</td>
    </tr>
    <tr>
      <td><strong>Neil</strong></td>
      <td>Full-Stack Homepage Build</td>
      <td>Payment Integration & Backend</td>
      <td>Photo Gallery & Page Template</td>
    </tr>
    <tr>
      <td><strong>Moiz</strong></td>
      <td>Content Strategy & SEO</td>
      <td>UI Design & Frontend Build</td>
      <td>Content Gathering & Page Copy</td>
    </tr>
  </tbody>
</table>

<div class="info-box-dad">
  <strong>Key takeaway:</strong> Every member rotates across <em>different responsibilities</em> — design, frontend, backend, content, and integration — ensuring well-rounded experience and balanced workload across all three features. No one person is stuck doing the same type of task for every feature.
</div>
