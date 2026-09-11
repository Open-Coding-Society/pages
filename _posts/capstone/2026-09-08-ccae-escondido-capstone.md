---
microblog: true
toc: false
layout: post
title: California Center for the Arts, Escondido
permalink: /capstone/ccae/
---

<style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Space+Grotesk:wght@400;600;700;800;900&display=swap');

    /* Global Wrapper */
    .ccae-wrapper {
        font-family: 'Space Grotesk', sans-serif;
        color: #d9dde2;
        line-height: 1.7;
        font-size: 1.1rem;
        position: relative;
        padding-bottom: 5rem;
        background: linear-gradient(to bottom, #101014 0%, #000000 100%);
        overflow: hidden; 
    }

    /* Interactive Particle Canvas Layer */
    #particleCanvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        pointer-events: none; /* Lets clicks pass through to the cards */
    }

    /* Ambient Glow */
    .ambient-glow {
        position: absolute;
        top: 30%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100vw;
        height: 500px;
        background: radial-gradient(ellipse at center, rgba(250, 204, 21, 0.08) 0%, transparent 60%);
        filter: blur(60px);
        z-index: 0;
        pointer-events: none;
    }

    /* Section Containers */
    .section-wrapper {
        position: relative;
        width: 100%;
        padding-top: 4rem; 
        padding-bottom: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        z-index: 5;
    }

    /* Background Headers */
    .env-header {
        position: absolute;
        top: 55%; 
        left: 50%;
        font-family: 'Space Grotesk', sans-serif;
        text-transform: uppercase;
        font-weight: 800; 
        text-align: center;
        color: rgba(255, 255, 255, 0.15); 
        white-space: nowrap; 
        z-index: 1; 
        pointer-events: none;
        user-select: none;
        opacity: 0;
        transition: transform 1.5s cubic-bezier(0.25, 1, 0.5, 1), 
                    letter-spacing 1.5s cubic-bezier(0.25, 1, 0.5, 1), 
                    padding-left 1.5s cubic-bezier(0.25, 1, 0.5, 1),
                    opacity 1.5s ease-out;
    }

    /* Project Summary Header */
    .header-summary {
        font-size: 11vw; 
        line-height: 1.3; 
        letter-spacing: -3vw; 
        padding-left: -3vw; 
        transform: translate(-50%, -50%) scale(0.95);
    }
    .header-summary.visible {
        transform: translate(-50%, -50%) scale(1);
        letter-spacing: 4vw; 
        padding-left: 4vw; 
        opacity: 1; 
    }

    /* Strengths Header */
    .header-strengths {
        font-size: 8.5vw; 
        line-height: 1.4; 
        letter-spacing: -1vw; 
        padding-left: -1vw; 
        transform: translate(-50%, -50%) scale(0.95);
    }
    .header-strengths.visible {
        transform: translate(-50%, -50%) scale(1);
        letter-spacing: 1.5vw; 
        padding-left: 1.5vw; 
        opacity: 1; 
    }

    /* Intro Typography */
    .intro-text {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1.25rem; 
        font-weight: 400;
        color: #e5e7eb;
        margin-top: 3rem;
        margin-bottom: 3rem;
        text-align: center;
        max-width: 850px;
        margin-left: auto;
        margin-right: auto;
        line-height: 1.7;
        position: relative;
        z-index: 5;
    }

    /* Fluid Layouts */
    .circle-row {
        display: flex;
        justify-content: center;
        gap: 4.5rem; 
        margin-bottom: 3rem;
        flex-wrap: wrap;
        position: relative;
        z-index: 5;
    }

    .circle-row.top-row .card-container:nth-child(2) {
        transform: translateY(40px);
    }
    .circle-row.bottom-row .card-container:nth-child(1) {
        transform: translateY(-20px);
    }

    /* Invisible Anchor */
    .card-container {
        width: 380px;
        height: 380px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* The Morphing Shape */
    .circle-card {
        width: 300px; 
        height: 300px;
        border-radius: 50%;
        background-color: rgba(22, 22, 26, 0.4); 
        transform: translateZ(0);
        backdrop-filter: blur(0px); 
        -webkit-backdrop-filter: blur(0px);
        border: 1px solid rgba(250, 204, 21, 0.3); 
        box-shadow: 0 0 50px rgba(250, 204, 21, 0.15), inset 0 0 30px rgba(250, 204, 21, 0.05);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center; 
        box-sizing: border-box;
        position: absolute;
        z-index: 10;
        
        transition: width 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
                    height 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
                    border-radius 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
                    background-color 0.5s ease,
                    box-shadow 0.7s ease,
                    border 0.5s ease,
                    backdrop-filter 1s ease,
                    -webkit-backdrop-filter 1s ease;
        cursor: pointer;
    }

    .card-container.visible .circle-card {
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
    }

    /* Expansive Hover State */
    .card-container:hover .circle-card {
        width: 360px; 
        height: 360px; 
        border-radius: 32px; 
        background-color: rgba(22, 22, 26, 0.65); 
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        box-shadow: 0 25px 60px rgba(250, 204, 21, 0.25);
        border: 1px solid rgba(250, 204, 21, 0.6);
        z-index: 20;
    }

    /* Smooth Title Gliding */
    .title-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        border-bottom: none !important; 
        margin: 0;
        transform: translateY(0);
        transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
        z-index: 2;
    }
    
    .card-container:hover .title-wrapper {
        transform: translateY(-80px); 
    }

    .card-title {
        font-family: 'Playfair Display', serif;
        color: #ffffff !important;
        font-size: 1.8rem;
        font-weight: 600;
        margin: 0;
        text-align: center;
        border-bottom: none !important; 
    }

    /* Stabilized Hidden Content */
    .card-content {
        position: absolute;
        top: 130px; 
        left: 0;
        width: 100%;
        padding: 0 2.5rem; 
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        opacity: 0;
        visibility: hidden;
        z-index: 1;
    }

    .card-container:hover .card-content {
        opacity: 1;
        visibility: visible;
    }

    .card-content p {
        width: 260px; /* Locks the text width to prevent layout shifts */
        color: #ffffff !important;
        font-size: 1.05rem;
        margin: 0 0 1.25rem 0; 
        line-height: 1.6;
        opacity: 0;
        transform: translateY(20px);
        transition: color 0.5s ease, opacity 0.5s ease, transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
    }
    
    .card-content .btn-group {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.5s ease, transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
    }

    .card-container:hover .card-content p {
        color: #d1d5db !important;
        opacity: 1;
        transform: translateY(0);
        transition-delay: 0.1s; 
    }
    .card-container:hover .card-content .btn-group {
        opacity: 1;
        transform: translateY(0);
        transition-delay: 0.2s; 
    }

    /* Standard Buttons */
    .ocs_btn {
        font-family: 'Space Grotesk', sans-serif;
        border-radius: 8px;
        font-weight: 600;
        text-decoration: none;
        padding: 0.6rem 1.25rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        font-size: 0.9rem;
        letter-spacing: 0.5px;
    }
    .ocs_btn:hover {
        transform: translateY(-2px);
    }
    .btn-group {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
        justify-content: center;
    }
    
    /* Highlight Main Github Button */
    .ocs_btn.large-yellow {
        background: transparent; 
        color: #ffffff; 
        border: 2px solid #ffffff; /* Starts with white outline */
        margin-bottom: 2rem;
        font-size: 1.2rem;
        font-weight: 600;
        padding: 1.2rem 3rem;
        border-radius: 40px;
        box-shadow: 0 0 30px rgba(250, 204, 21, 0.35); /* Persistent yellow ambient glow */
        position: relative;
        z-index: 5;
        transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
    }
    .ocs_btn.large-yellow:hover {
        background: #facc15; /* Fills yellow on hover */
        border-color: #facc15;
        color: #111827; 
        font-weight: 800; /* Boldens text */
        letter-spacing: -0.5px; /* Counters bold expansion to keep button stable */
        transform: translateY(-3px) scale(1.02);
        box-shadow: 0 15px 40px rgba(250, 204, 21, 0.5);
    }

    /* Card Inner Buttons */
    .ocs_btn.card-btn { 
        background-color: transparent; 
        color: #ffffff; 
        border: 1px solid rgba(255, 255, 255, 0.4); 
    }
    .ocs_btn.card-btn:hover { 
        background-color: rgba(250, 204, 21, 0.15); 
        color: #facc15; 
        border-color: #facc15;
    }

    /* Scroll Animations */
    .scroll-fade {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 1s cubic-bezier(0.2, 0.8, 0.2, 1), transform 1s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    .scroll-fade.visible {
        opacity: 1;
        transform: translateY(0);
    }
</style>

<div class="ccae-wrapper">
    <canvas id="particleCanvas"></canvas>
    <div class="ambient-glow"></div>

    <p class="intro-text scroll-fade">
        The Escondido Arts has sophisticated elements which will be good to learn as we progress toward our journey of ideation and improvement. They have strength in Events and Ticket sales, lacking in personalization and information navigation.
    </p>

    <div class="scroll-fade" style="text-align: center;">
        <a class="ocs_btn large-yellow" href="https://github.com/tristan-chiu0/CCAE-FE">
            Github Repository
        </a>
    </div>

    <!-- Project Summary Section -->
    <div class="section-wrapper">
        <div class="env-header header-summary">PROJECT<br>SUMMARY</div>
        
        <div class="circle-row top-row">
            <div class="card-container scroll-fade">
                <div class="circle-card">
                    <div class="title-wrapper">
                        <h3 class="card-title">Main Problems</h3>
                    </div>
                    <div class="card-content">
                        <p>The website is aesthetically busy and navigation is complicated. Different domains exist for some pages, causing disjointed user flows.</p>
                        <div class="btn-group">
                            <a class="ocs_btn card-btn" href="https://artcenter.org/">See Original</a>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card-container scroll-fade">
                <div class="circle-card">
                    <div class="title-wrapper">
                        <h3 class="card-title">Project Direction</h3>
                    </div>
                    <div class="card-content">
                        <p>Refurbish the site to be streamlined and less busy. We will overhaul the search feature, fix bugs, and introduce interactive designs.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Strengths vs Improvement Section -->
    <div class="section-wrapper" style="margin-top: 3rem;">
        <div class="env-header header-strengths">STRENGTHS<br>VS<br>IMPROVEMENTS</div>
        
        <!-- Top Row: 3 Circles -->
        <div class="circle-row top-row">
            <div class="card-container scroll-fade">
                <div class="circle-card">
                    <div class="title-wrapper">
                        <h3 class="card-title">Dynamic UI</h3>
                    </div>
                    <div class="card-content">
                        <p>A changing background creates visual interest and professional polish.</p>
                        <div class="btn-group">
                            <a class="ocs_btn card-btn" href="https://artcenter.org/">View Example</a>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card-container scroll-fade">
                <div class="circle-card">
                    <div class="title-wrapper">
                        <h3 class="card-title">Navigation Clarity</h3>
                    </div>
                    <div class="card-content">
                        <p>Site-in-Site transitions are inconsistent and confusing for users.</p>
                        <div class="btn-group">
                            <a class="ocs_btn card-btn" href="https://www.ccaemuseum.org/">Museum Entry</a>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card-container scroll-fade">
                <div class="circle-card">
                    <div class="title-wrapper">
                        <h3 class="card-title">Backend Integrations</h3>
                    </div>
                    <div class="card-content">
                        <p>Data pulls from live inventory, but ticket buttons are poorly placed.</p>
                        <div class="btn-group">
                            <a class="ocs_btn card-btn" href="https://artcenter.org/events/">Events</a>
                            <a class="ocs_btn card-btn" href="https://artcenter.org/event/kintsugi-workshop-2/2026-09-12/">Bug</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Bottom Row: 2 Circles -->
        <div class="circle-row bottom-row">
            <div class="card-container scroll-fade">
                <div class="circle-card">
                    <div class="title-wrapper">
                        <h3 class="card-title">Information Arch</h3>
                    </div>
                    <div class="card-content">
                        <p>Multiple nested "About" pages reduce discoverability and overall clarity.</p>
                        <div class="btn-group">
                            <a class="ocs_btn card-btn" href="https://artcenter.org/about/">About Pages</a>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card-container scroll-fade">
                <div class="circle-card">
                    <div class="title-wrapper">
                        <h3 class="card-title">Basic Bugs</h3>
                    </div>
                    <div class="card-content">
                        <p>Sitemap redirects nowhere, and contact links in privacy policies are broken.</p>
                        <div class="btn-group">
                            <a class="ocs_btn card-btn" href="https://artcenter.org/about/privacy/">Privacy</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <p class="scroll-fade" style="text-align: center; color: #6b7280; font-size: 0.95rem; margin-top: 5rem; font-family: 'Space Grotesk', sans-serif; position: relative; z-index: 5;">
        Team: Mateo Amador, Tristan Chiu, Yue (Barbara) Zhao<br>
        <strong>Powered by OCS grids and buttons</strong><br>
        <a href="{{site.baseurl}}/index2" style="color: #facc15; text-decoration: none;">[Buttons]</a> | 
        <a href="{{site.baseurl}}/index4" style="color: #facc15; text-decoration: none;">[Grids]</a>
    </p>
</div>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        // Intersection Observer for scroll fades
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.scroll-fade, .env-header, .card-container').forEach((el) => {
            observer.observe(el);
        });

        // 2D Physics Particle Canvas
        const canvas = document.getElementById('particleCanvas');
        const ctx = canvas.getContext('2d');
        const wrapper = document.querySelector('.ccae-wrapper');
        let width, height;

        function resizeCanvas() {
            width = canvas.width = wrapper.clientWidth;
            height = canvas.height = wrapper.scrollHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const particles = [];
        const numParticles = 45;

        // Generate starting dots
        for(let i=0; i<numParticles; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: -Math.random() * 1 - 0.5, // Drift upward natively
                radius: Math.random() * 2.5 + 1.5
            });
        }

        // Track cursor for mouse repulsion
        let mouse = { x: -1000, y: -1000 };
        wrapper.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);
            
            for(let i=0; i<particles.length; i++) {
                let p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                // Enforce upward drift
                p.vy -= 0.01;
                if(p.vy < -1.5) p.vy = -1.5;

                // Screen Wrap
                if (p.y + p.radius < 0) {
                    p.y = height + p.radius;
                    p.x = Math.random() * width;
                    p.vy = -Math.random() * 1 - 0.5;
                }
                if (p.x > width + p.radius) p.x = -p.radius;
                if (p.x < -p.radius) p.x = width + p.radius;

                // Deflect off mouse
                let dx = mouse.x - p.x;
                let dy = mouse.y - p.y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 100) {
                    let force = (100 - dist) / 100;
                    p.vx -= (dx / dist) * force * 0.6;
                    p.vy -= (dy / dist) * force * 0.6;
                }

                // Elastic collision (bumping into each other)
                for(let j = i + 1; j < particles.length; j++) {
                    let p2 = particles[j];
                    let dx2 = p2.x - p.x;
                    let dy2 = p2.y - p.y;
                    let dist2 = Math.sqrt(dx2*dx2 + dy2*dy2);
                    let minDist = p.radius + p2.radius + 2; 

                    if (dist2 < minDist) {
                        let angle = Math.atan2(dy2, dx2);
                        let targetX = p.x + Math.cos(angle) * minDist;
                        let targetY = p.y + Math.sin(angle) * minDist;
                        let ax = (targetX - p2.x) * 0.05;
                        let ay = (targetY - p2.y) * 0.05;
                        p.vx -= ax;
                        p.vy -= ay;
                        p2.vx += ax;
                        p2.vy += ay;
                    }
                }
                
                // Kinetic friction limits velocity spikes
                p.vx *= 0.98;
                p.vy *= 0.98;

                // Draw glowing dots
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                ctx.shadowBlur = 12;
                ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
                ctx.fill();
            }
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    });
</script>