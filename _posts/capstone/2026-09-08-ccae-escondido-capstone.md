---
microblog: true
toc: false
layout: post
title: California Center for the Arts, Escondido
permalink: /capstone/ccae/
---

<style>
    /* Custom Artsy & Clean UI Styles */
    .ccae-wrapper {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #5a5a5a;
        line-height: 1.6;
    }
    .intro-text {
        font-size: 1.1rem;
        color: #6c757d;
        margin-bottom: 2rem;
    }
    .ocs_grid-cell {
        background-color: #ffffff;
        border-radius: 16px;
        padding: 1.75rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
        transition: transform 0.25s ease, box-shadow 0.25s ease;
        border: 1px solid #f4f1f8;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
    .ocs_grid-cell:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
    }
    .ocs_grid-cell--header {
        background: linear-gradient(135deg, #f3e8ff 0%, #e8f4f8 100%); /* Soft Pastel Gradient */
        border: none;
        align-items: center;
        justify-content: center;
        text-align: center;
    }
    .ocs_grid-cell--header h2 {
        color: #5c4b8a;
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
    }
    .ocs_grid-cell--accent {
        background-color: #fcfbfe;
    }
    .cell-title {
        color: #4a4a4a;
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
        border-bottom: 2px solid #e8f4f8;
        padding-bottom: 0.25rem;
    }
    
    /* Pastel Aesthetic Buttons */
    .ocs_btn {
        border-radius: 20px;
        font-weight: 600;
        text-decoration: none;
        padding: 0.5rem 1rem;
        margin-top: auto;
        display: inline-block;
        transition: filter 0.2s ease;
    }
    .ocs_btn:hover {
        filter: brightness(0.95);
    }
    .ocs_btn.large {
        background-color: #e8f4f8;
        color: #31708f;
        margin-bottom: 2rem;
    }
    .btn-group {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin-top: 1rem;
    }
    .ocs_btn.alert-green { background-color: #eafaf1; color: #27ae60; border: 1px solid #d5f5e3; }
    .ocs_btn.alert-yellow { background-color: #fef9e7; color: #d4ac0d; border: 1px solid #fcf3cf; }
    .ocs_btn.alert-red { background-color: #fdedec; color: #e74c3c; border: 1px solid #fadbd8; }
</style>

<div class="ccae-wrapper">
    <p class="intro-text">
        The Escondido Arts has sophisticated elements which will be good to learn as we progress toward our journey of ideation and improvement. They have strength in Events and Ticket sales, lacking in personalization and information navigation.
    </p>

    <a class="ocs_btn large" href="https://github.com/tristan-chiu0/CCAE-FE">
        Github Repository
    </a>

    <!-- First Grid Section -->
    <div class="ocs_grid ocs_grid--standard cols-2" style="margin-bottom: 2rem;">
        <div class="ocs_grid-cell ocs_grid-cell--header">
            <h2>Project Summary</h2>
        </div>
        
        <div class="ocs_grid-cell ocs_grid-cell--accent">
            <strong class="cell-title">Main Problems</strong>
            <p>The website is aesthetically busy and navigation is complicated and hard to follow. It also has different domains for some pages, and is overall difficult to navigate and find what someone might be looking for.</p>
            <a class="ocs_btn alert-green fill small" href="https://artcenter.org/">
                See Original
            </a>
        </div>
        
        <div class="ocs_grid-cell ocs_grid-cell--accent" style="grid-column: span 2;">
            <strong class="cell-title">Project Direction</strong>
            <p>This capstone project aims to refurbish the California Center For The Performing Arts Escondido website to be more streamlined, organized, and less busy. It will overhaul the search feature to be more intelligent, fix any visual bugs, introduce a dynamic and artistic design, and will replace generic walls of text with something more interactive.</p>
        </div>
    </div>

    <!-- Second Grid Section -->
    <div class="ocs_grid ocs_grid--standard cols-2" style="margin-bottom: 1.5rem;">
        <div class="ocs_grid-cell ocs_grid-cell--header">
            <h2>Strengths vs Improvement For Website</h2>
        </div>
        
        <div class="ocs_grid-cell ocs_grid-cell--accent">
            <strong class="cell-title">Dynamic UI</strong>
            <p>A changing background creates visual interest and professional polish.</p>
            <a class="ocs_btn alert-green fill small" href="https://artcenter.org/">
                View Example
            </a>
        </div>
        
        <div class="ocs_grid-cell">
            <strong class="cell-title">Navigation Clarity</strong>
            <p>Site-in-Site transitions are inconsistent and confusing for users.</p>
            <a class="ocs_btn alert-yellow fill small" href="https://www.ccaemuseum.org/">
                Museum Entry Point
            </a>
        </div>
        
        <div class="ocs_grid-cell ocs_grid-cell--accent">
            <strong class="cell-title">Backend Integration</strong>
            <p>Data sourcing is evident; events page pulls live ticket inventory and concerts page pulls from real dates. One thing that could be improved is having the Buy Tickets button placed directly on each concert performance grid image for easily accessibility. Some of the events when clicked on also have the buy tickets button twice.</p>
            <div class="btn-group">
                <a class="ocs_btn alert-green fill small" href="https://artcenter.org/events/">Events Page</a>
                <a class="ocs_btn alert-green fill small" href="https://artcenter.org/concerts-performances/">Concerts Page</a>
                <a class="ocs_btn alert-red fill small" href="https://artcenter.org/event/kintsugi-workshop-2/2026-09-12/">Two Ticket Btn</a>
            </div>
        </div>
        
        <div class="ocs_grid-cell">
            <strong class="cell-title">Information Architecture</strong>
            <p>Multiple nested "About" pages reduce discoverability and clarity.</p>
            <a class="ocs_btn alert-yellow fill small" href="https://artcenter.org/about/">
                About Pages
            </a>
        </div>
        
        <div class="ocs_grid-cell">
            <strong class="cell-title">Header Network</strong>
            <p>The smaller black header and main-header have links to the same pages.</p>
            <a class="ocs_btn alert-red fill small" href="https://artcenter.org/about/">
                Header Above
            </a>
        </div>
        
        <div class="ocs_grid-cell">
            <strong class="cell-title">Basic Bugs and Polish</strong>
            <p>Sitemap footer redirects nowhere, some links don't work like the contact link at the end of the privacy policy.</p>
            <div class="btn-group">
                <a class="ocs_btn alert-red fill small" href="https://artcenter.org/about/">Scroll Down</a>
                <a class="ocs_btn alert-red fill small" href="https://artcenter.org/about/privacy/">Privacy Page</a>
            </div>
        </div>
    </div>

    <p style="text-align: center; color: #888; font-size: 0.9rem; margin-top: 2rem;">
        Team: Mateo Amador, Tristan Chiu, Yue (Barbara) Zhao<br>
        <strong>Powered by OCS grids and buttons</strong><br>
        <a href="{{site.baseurl}}/index2" style="color: #31708f;">[Buttons]</a> | 
        <a href="{{site.baseurl}}/index4" style="color: #31708f;">[Grids]</a>
    </p>
</div>