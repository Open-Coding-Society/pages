---
layout: post
title: Programming Fundamentals - P4
description: An introduction to College Board's Big Idea 3, part one.  This is a collection of Python lessons to help students understand the fundamental algorithm and programming elementes required by College Board's AP Computer Science Principles curriculum.
toc: False
comments: False
permalink: /csp/big-idea/p4/fundamentals
courses: {'csp': {'week': 8}}
type: coding
menu: /nav/csp_units/csp_unit3_p4_fundamentals.html
---

<style>
:root {
    --p4-space-xs: 8px;
    --p4-space-sm: 16px;
    --p4-space-md: 24px;
    --p4-space-lg: 32px;
    --p4-space-xl: 48px;
    --p4-space-2xl: 64px;
    --p4-radius-xs: 8px;
    --p4-radius-sm: 12px;
    --p4-radius-md: 16px;
    --p4-radius-lg: 24px;
    --p4-radius-xl: 32px;
    --p4-radius-full: 9999px;
    
    /* Modern Color Palette */
    --p4-clr-primary: #6366f1;
    --p4-clr-primary-light: #818cf8;
    --p4-clr-primary-dark: #4f46e5;
    --p4-clr-secondary: #06b6d4;
    --p4-clr-accent: #f59e0b;
    --p4-clr-success: #10b981;
    --p4-clr-warning: #f59e0b;
    --p4-clr-error: #ef4444;
    
    /* Surface Colors */
    --p4-clr-surface: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.98));
    --p4-clr-surface-elevated: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(51, 65, 85, 0.98));
    --p4-clr-surface-glass: rgba(255, 255, 255, 0.05);
    --p4-clr-surface-glass-strong: rgba(255, 255, 255, 0.1);
    
    /* Text Colors */
    --p4-clr-text-primary: #f8fafc;
    --p4-clr-text-secondary: #cbd5e1;
    --p4-clr-text-muted: #94a3b8;
    --p4-clr-text-disabled: #64748b;
    
    /* Border Colors */
    --p4-clr-border: rgba(148, 163, 184, 0.2);
    --p4-clr-border-strong: rgba(148, 163, 184, 0.4);
    --p4-clr-border-focus: var(--p4-clr-primary);
    
    /* Shadows */
    --p4-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --p4-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --p4-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --p4-shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    --p4-shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    --p4-shadow-glow: 0 0 20px rgba(99, 102, 241, 0.3);
    --p4-shadow-glow-strong: 0 0 40px rgba(99, 102, 241, 0.5);
    
    /* Transitions */
    --p4-transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
    --p4-transition-normal: 250ms cubic-bezier(0.4, 0, 0.2, 1);
    --p4-transition-slow: 350ms cubic-bezier(0.4, 0, 0.2, 1);
    --p4-transition-bounce: 500ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
    
    /* Gradients */
    --p4-gradient-primary: linear-gradient(135deg, var(--p4-clr-primary), var(--p4-clr-primary-light));
    --p4-gradient-success: linear-gradient(135deg, var(--p4-clr-success), #34d399);
    --p4-gradient-warning: linear-gradient(135deg, var(--p4-clr-warning), #fbbf24);
    --p4-gradient-surface: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.9));
    --p4-gradient-glass: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
}

.post-header > h3,
.post-header > .page-description {
    display: none;
}

.p4-shell {
    position: relative;
    margin: 0 auto;
    padding: clamp(var(--p4-space-lg), 4vw, var(--p4-space-2xl));
    border-radius: var(--p4-radius-xl);
    background: var(--p4-clr-surface);
    color: var(--p4-clr-text-primary);
    box-shadow: var(--p4-shadow-2xl), var(--p4-shadow-glow);
    overflow: hidden;
    backdrop-filter: blur(20px);
    border: 1px solid var(--p4-clr-border);
}

.p4-shell::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: var(--p4-gradient-primary);
    opacity: 0.6;
}

.p4-shell::after {
    content: "";
    position: absolute;
    inset: -200px -300px auto -200px;
    height: clamp(300px, 40vw, 500px);
    background: radial-gradient(ellipse at 30% 20%, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.1) 50%, transparent 70%);
    pointer-events: none;
    animation: float 20s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(2deg); }
}

.p4-shell > * {
    position: relative;
    z-index: 1;
}

.p4-hero {
    display: grid;
    gap: clamp(var(--p4-space-lg), 4vw, var(--p4-space-2xl));
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    align-items: start;
    margin-bottom: clamp(var(--p4-space-xl), 4vw, var(--p4-space-2xl));
}

.p4-hero__copy {
    display: grid;
    align-content: start;
    gap: var(--p4-space-lg);
}

.p4-badge {
    width: fit-content;
    padding: var(--p4-space-xs) var(--p4-space-md);
    border-radius: var(--p4-radius-full);
    border: 1px solid var(--p4-clr-border);
    background: var(--p4-gradient-glass);
    backdrop-filter: blur(10px);
    font-size: 0.875rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--p4-clr-text-secondary);
    box-shadow: var(--p4-shadow-sm);
    transition: var(--p4-transition-normal);
}

.p4-badge:hover {
    transform: translateY(-2px);
    box-shadow: var(--p4-shadow-md);
    border-color: var(--p4-clr-primary);
}

.p4-hero__copy h1 {
    margin: 0;
    font-size: clamp(2.5rem, 5vw, 3.75rem);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.02em;
    background: var(--p4-gradient-primary);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.p4-hero__lead {
    margin: 0;
    max-width: 560px;
    font-size: 1.05rem;
    line-height: 1.6;
    color: var(--p4-clr-text-secondary);
    animation: fadeInUp 0.8s ease-out 0.2s both;
}

.p4-stepper {
    display: flex;
    flex-wrap: wrap;
    gap: var(--p4-space-xs);
    padding: var(--p4-space-sm) var(--p4-space-md);
    border-radius: var(--p4-radius-full);
    background: var(--p4-clr-surface-glass);
    backdrop-filter: blur(20px);
    border: 1px solid var(--p4-clr-border);
    box-shadow: var(--p4-shadow-lg);
    animation: fadeInUp 0.8s ease-out 0.4s both;
}

.p4-stepper span {
    position: relative;
    padding: var(--p4-space-xs) var(--p4-space-md);
    border-radius: var(--p4-radius-full);
    font-weight: 600;
    font-size: 0.875rem;
    letter-spacing: 0.025em;
    color: var(--p4-clr-text-muted);
    border: 1px solid transparent;
    background: var(--p4-clr-surface-glass);
    transition: var(--p4-transition-normal);
    cursor: pointer;
    user-select: none;
}

.p4-stepper span::after {
    content: "";
    position: absolute;
    right: -6px;
    top: 50%;
    width: 12px;
    height: 2px;
    background: var(--p4-clr-border);
    transform: translateY(-50%);
    border-radius: 1px;
}

.p4-stepper span:last-child::after {
    display: none;
}

.p4-stepper span:hover {
    transform: translateY(-1px);
    color: var(--p4-clr-text-secondary);
    background: var(--p4-clr-surface-glass-strong);
}

.p4-stepper span.is-active {
    color: var(--p4-clr-text-primary);
    border-color: var(--p4-clr-primary);
    background: var(--p4-gradient-primary);
    box-shadow: var(--p4-shadow-glow);
    transform: translateY(-2px);
}

.p4-stepper span.is-current {
    transform: translateY(-3px) scale(1.05);
    box-shadow: var(--p4-shadow-glow-strong);
}

.p4-quick-links {
    display: flex;
    flex-wrap: wrap;
    gap: var(--p4-space-sm);
    margin-top: var(--p4-space-md);
    animation: fadeInUp 0.8s ease-out 0.6s both;
}

.p4-quick-links__action,
.p4-quick-links__ghost {
    display: inline-flex;
    align-items: center;
    gap: var(--p4-space-xs);
    padding: var(--p4-space-sm) var(--p4-space-md);
    border-radius: var(--p4-radius-full);
    border: 1px solid var(--p4-clr-border);
    background: var(--p4-clr-surface-glass);
    backdrop-filter: blur(10px);
    color: var(--p4-clr-text-secondary);
    text-decoration: none;
    transition: var(--p4-transition-normal);
    font-weight: 600;
    font-size: 0.875rem;
    box-shadow: var(--p4-shadow-sm);
}

.p4-quick-links__action:hover {
    border-color: var(--p4-clr-primary);
    color: var(--p4-clr-text-primary);
    background: var(--p4-gradient-primary);
    box-shadow: var(--p4-shadow-glow);
    transform: translateY(-2px) scale(1.02);
}

.p4-quick-links__action:active {
    transform: translateY(-1px) scale(0.98);
}

.p4-quick-links__ghost {
    border-style: dashed;
    opacity: 0.6;
    cursor: not-allowed;
}

.p4-hero__dashboard {
    display: grid;
    gap: var(--p4-space-lg);
    padding: var(--p4-space-lg);
    border-radius: var(--p4-radius-lg);
    background: var(--p4-clr-surface-elevated);
    backdrop-filter: blur(20px);
    border: 1px solid var(--p4-clr-border);
    box-shadow: var(--p4-shadow-xl), var(--p4-shadow-glow);
    text-align: center;
    animation: fadeInUp 0.8s ease-out 0.8s both;
}

.p4-orb {
    --progress-angle: 0deg;
    position: relative;
    margin: 0 auto;
    width: clamp(180px, 25vw, 220px);
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    background: conic-gradient(
        var(--p4-gradient-primary) var(--progress-angle), 
        var(--p4-clr-surface-glass) 0deg
    );
    display: grid;
    place-items: center;
    box-shadow: 
        inset 0 0 20px rgba(255, 255, 255, 0.1),
        var(--p4-shadow-2xl),
        var(--p4-shadow-glow);
    transition: var(--p4-transition-slow);
    animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
    0%, 100% { 
        box-shadow: 
            inset 0 0 20px rgba(255, 255, 255, 0.1),
            var(--p4-shadow-2xl),
            var(--p4-shadow-glow);
    }
    50% { 
        box-shadow: 
            inset 0 0 30px rgba(255, 255, 255, 0.15),
            var(--p4-shadow-2xl),
            var(--p4-shadow-glow-strong);
    }
}

.p4-orb::after {
    content: "";
    width: 75%;
    height: 75%;
    border-radius: 50%;
    background: var(--p4-clr-surface-elevated);
    backdrop-filter: blur(10px);
    border: 2px solid var(--p4-clr-border);
    box-shadow: 
        inset 0 4px 8px rgba(0, 0, 0, 0.1),
        inset 0 -2px 4px rgba(255, 255, 255, 0.05);
}

.p4-orb__value {
    position: absolute;
    font-size: 2.75rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    background: var(--p4-gradient-primary);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 1;
}

.p4-stage {
    width: fit-content;
    margin: 0 auto;
    padding: var(--p4-space-xs) var(--p4-space-md);
    border-radius: var(--p4-radius-full);
    border: 1px solid var(--p4-clr-border);
    background: var(--p4-gradient-glass);
    backdrop-filter: blur(10px);
    font-size: 0.875rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--p4-clr-text-secondary);
    box-shadow: var(--p4-shadow-sm);
    transition: var(--p4-transition-normal);
}

.p4-stage:hover {
    transform: translateY(-1px);
    box-shadow: var(--p4-shadow-md);
}

.p4-stage-message {
    margin: 0;
    font-size: 1.125rem;
    color: var(--p4-clr-text-secondary);
    line-height: 1.6;
    font-weight: 500;
}

.p4-stage-next {
    margin: 0;
    font-size: 0.875rem;
    color: var(--p4-clr-text-muted);
    line-height: 1.5;
}

.p4-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: var(--p4-space-sm);
    margin: 0;
    padding: 0;
    list-style: none;
}

.p4-stats li {
    padding: var(--p4-space-md);
    border-radius: var(--p4-radius-md);
    background: var(--p4-clr-surface-glass);
    backdrop-filter: blur(10px);
    border: 1px solid var(--p4-clr-border);
    text-align: center;
    transition: var(--p4-transition-normal);
    box-shadow: var(--p4-shadow-sm);
}

.p4-stats li:hover {
    transform: translateY(-2px);
    box-shadow: var(--p4-shadow-md);
    border-color: var(--p4-clr-primary);
}

.p4-stats strong {
    display: block;
    font-size: 1.5rem;
    font-weight: 800;
    background: var(--p4-gradient-primary);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: var(--p4-space-xs);
}

.p4-stats span {
    font-size: 0.875rem;
    color: var(--p4-clr-text-muted);
    font-weight: 500;
}

.p4-dashboard-nav {
    margin-top: var(--p4-space-lg);
    padding: var(--p4-space-lg);
    border-radius: var(--p4-radius-lg);
    background: var(--p4-clr-surface-glass);
    backdrop-filter: blur(18px);
    border: 1px solid var(--p4-clr-border);
    box-shadow: var(--p4-shadow-lg);
    display: grid;
    gap: var(--p4-space-md);
}

.p4-dashboard-nav__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--p4-space-sm);
}

.p4-dashboard-nav__header h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--p4-clr-text-primary);
    background: var(--p4-gradient-primary);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.p4-module-nav {
    display: flex;
    flex-wrap: wrap;
    gap: var(--p4-space-xs);
}

.p4-module-nav a {
    display: inline-flex;
    align-items: center;
    gap: var(--p4-space-xs);
    padding: var(--p4-space-xs) var(--p4-space-sm);
    border-radius: var(--p4-radius-full);
    border: 1px solid var(--p4-clr-border);
    background: var(--p4-clr-surface-glass);
    color: var(--p4-clr-text-secondary);
    text-decoration: none;
    font-size: 0.8rem;
    font-weight: 600;
    transition: var(--p4-transition-normal);
}

.p4-module-nav a:hover {
    border-color: var(--p4-clr-primary);
    color: var(--p4-clr-text-primary);
    background: var(--p4-gradient-primary);
    transform: translateY(-1px);
    box-shadow: var(--p4-shadow-glow);
}

.p4-nav-toggle {
    display: inline-flex;
    align-items: center;
    gap: var(--p4-space-xs);
    padding: var(--p4-space-xs) var(--p4-space-sm);
    border-radius: var(--p4-radius-full);
    border: 1px solid var(--p4-clr-border);
    background: var(--p4-clr-surface-glass);
    color: var(--p4-clr-text-secondary);
    font-weight: 600;
    font-size: 0.8rem;
    cursor: pointer;
    transition: var(--p4-transition-normal);
    box-shadow: var(--p4-shadow-sm);
}

.p4-nav-toggle:hover {
    border-color: var(--p4-clr-primary);
    color: var(--p4-clr-text-primary);
    background: var(--p4-gradient-primary);
    box-shadow: var(--p4-shadow-glow);
    transform: translateY(-1px);
}

.p4-nav-toggle__icon {
    width: 14px;
    height: 14px;
    transition: transform var(--p4-transition-normal);
}

.p4-nav-toggle.is-expanded .p4-nav-toggle__icon {
    transform: rotate(180deg);
}

.p4-lesson-table {
    display: grid;
    gap: var(--p4-space-xs);
    max-height: 0;
    overflow: hidden;
    transition: max-height var(--p4-transition-slow) ease-out;
}

.p4-lesson-table.is-expanded {
    max-height: 640px;
}

.p4-lesson-row {
    display: grid;
    grid-template-columns: 48px 1fr auto auto;
    gap: var(--p4-space-sm);
    align-items: center;
    padding: var(--p4-space-sm) var(--p4-space-md);
    border-radius: var(--p4-radius-md);
    background: var(--p4-clr-surface-glass);
    border: 1px solid var(--p4-clr-border);
    text-decoration: none;
    color: inherit;
    transition: var(--p4-transition-normal);
    position: relative;
    overflow: hidden;
}

.p4-lesson-row::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: var(--p4-gradient-primary);
    opacity: 0;
    transition: var(--p4-transition-normal);
}

.p4-lesson-row:hover {
    transform: translateY(-1px);
    box-shadow: var(--p4-shadow-md);
    border-color: var(--p4-clr-primary);
}

.p4-lesson-row:hover::before {
    opacity: 1;
}

.p4-lesson-row.is-completed {
    border-color: var(--p4-clr-success);
    background: linear-gradient(135deg, var(--p4-clr-surface-glass), rgba(16, 185, 129, 0.12));
}

.p4-lesson-row.is-current {
    border-color: var(--p4-clr-primary);
    background: linear-gradient(135deg, var(--p4-clr-surface-glass), rgba(99, 102, 241, 0.12));
    box-shadow: var(--p4-shadow-glow);
}

.p4-lesson-row.is-locked {
    opacity: 0.55;
    border-style: dashed;
    cursor: not-allowed;
}

.p4-lesson-number {
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--p4-clr-text-primary);
    text-align: center;
    background: var(--p4-gradient-primary);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.p4-lesson-info {
    display: grid;
    gap: var(--p4-space-xs);
}

.p4-lesson-title {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--p4-clr-text-primary);
}

.p4-lesson-description {
    margin: 0;
    font-size: 0.8rem;
    color: var(--p4-clr-text-secondary);
}

.p4-lesson-status {
    justify-self: end;
    font-size: 0.7rem;
    font-weight: 600;
    padding: var(--p4-space-xs) var(--p4-space-sm);
    border-radius: var(--p4-radius-full);
    border: 1px solid var(--p4-clr-border);
    background: var(--p4-clr-surface-glass);
    display: inline-flex;
    align-items: center;
    gap: 4px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.p4-lesson-status.is-completed {
    background: var(--p4-gradient-success);
    border-color: var(--p4-clr-success);
    color: var(--p4-clr-text-primary);
}

.p4-lesson-status.is-current {
    background: var(--p4-gradient-primary);
    border-color: var(--p4-clr-primary);
    color: var(--p4-clr-text-primary);
}

.p4-lesson-status.is-locked {
    color: var(--p4-clr-text-disabled);
}

.p4-lesson-progress {
    display: flex;
    align-items: center;
    gap: var(--p4-space-xs);
    justify-content: flex-end;
}

.p4-lesson-progress-bar {
    width: 70px;
    height: 6px;
    border-radius: var(--p4-radius-full);
    background: var(--p4-clr-surface-glass);
    border: 1px solid var(--p4-clr-border);
    overflow: hidden;
}

.p4-lesson-progress-fill {
    height: 100%;
    border-radius: var(--p4-radius-full);
    background: var(--p4-gradient-primary);
    transition: width var(--p4-transition-normal);
}

.p4-lesson-progress-text {
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--p4-clr-text-muted);
    min-width: 32px;
    text-align: right;
}

.p4-empty-state {
    margin: 0;
    padding: var(--p4-space-md);
    border-radius: var(--p4-radius-md);
    border: 1px dashed var(--p4-clr-border);
    background: var(--p4-clr-surface-glass);
    color: var(--p4-clr-text-secondary);
    text-align: center;
    font-size: 0.85rem;
}

.p4-ap-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--p4-space-xs);
    padding: var(--p4-space-xs) var(--p4-space-md);
    border-radius: var(--p4-radius-full);
    border: 1px solid var(--p4-clr-border);
    background: var(--p4-gradient-primary);
    color: var(--p4-clr-text-primary);
    font-weight: 600;
    font-size: 0.85rem;
    text-decoration: none;
    transition: var(--p4-transition-normal);
    box-shadow: var(--p4-shadow-glow);
}

.p4-ap-link:hover {
    transform: translateY(-1px);
    box-shadow: var(--p4-shadow-xl);
}

.p4-ap-link svg {
    width: 14px;
    height: 14px;
}

.p4-roadmap {
    margin-bottom: clamp(var(--p4-space-xl), 4vw, var(--p4-space-2xl));
}

.p4-roadmap header {
    display: flex;
    flex-direction: column;
    gap: var(--p4-space-sm);
    margin-bottom: var(--p4-space-xl);
    text-align: center;
}

.p4-roadmap h2 {
    margin: 0;
    font-size: 2rem;
    font-weight: 800;
    background: var(--p4-gradient-primary);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.p4-roadmap p {
    margin: 0;
    color: var(--p4-clr-text-muted);
    font-size: 1.125rem;
    max-width: 600px;
    margin: 0 auto;
}

.p4-module-grid {
    display: grid;
    gap: clamp(var(--p4-space-md), 2.8vw, var(--p4-space-lg));
}

.p4-module {
    padding: var(--p4-space-lg);
    border-radius: var(--p4-radius-lg);
    background: var(--p4-clr-surface-elevated);
    backdrop-filter: blur(20px);
    border: 1px solid var(--p4-clr-border);
    box-shadow: var(--p4-shadow-lg);
    display: grid;
    gap: var(--p4-space-md);
    transition: var(--p4-transition-normal);
    position: relative;
    overflow: hidden;
}

.p4-module::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--p4-gradient-primary);
    opacity: 0;
    transition: var(--p4-transition-normal);
}

.p4-module:hover {
    transform: translateY(-2px);
    box-shadow: var(--p4-shadow-xl);
    border-color: var(--p4-clr-primary);
}

.p4-module:hover::before {
    opacity: 1;
}

.p4-module.is-active {
    border-color: var(--p4-clr-primary);
    box-shadow: var(--p4-shadow-xl), var(--p4-shadow-glow);
    transform: translateY(-2px);
}

.p4-module.is-active::before {
    opacity: 1;
}

.p4-module.is-complete {
    border-color: var(--p4-clr-success);
    background: linear-gradient(135deg, var(--p4-clr-surface-elevated), rgba(16, 185, 129, 0.05));
}

.p4-module.is-complete::before {
    background: var(--p4-gradient-success);
    opacity: 1;
}

.p4-module__header {
    display: grid;
    gap: var(--p4-space-md);
}

.p4-module__title-row {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: var(--p4-space-sm);
    align-items: baseline;
}

.p4-module__title-row h3 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--p4-clr-text-primary);
    background: var(--p4-gradient-primary);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.p4-module__count {
    font-size: 0.875rem;
    color: var(--p4-clr-text-muted);
    font-weight: 600;
    padding: var(--p4-space-xs) var(--p4-space-sm);
    background: var(--p4-clr-surface-glass);
    border-radius: var(--p4-radius-sm);
    border: 1px solid var(--p4-clr-border);
}

.p4-module__meter {
    position: relative;
    width: 100%;
    height: 12px;
    border-radius: var(--p4-radius-full);
    background: var(--p4-clr-surface-glass);
    border: 1px solid var(--p4-clr-border);
    overflow: hidden;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.p4-module__meter-fill {
    width: 0;
    height: 100%;
    border-radius: var(--p4-radius-full);
    background: var(--p4-gradient-primary);
    transition: width var(--p4-transition-slow);
    position: relative;
    overflow: hidden;
}

.p4-module__meter-fill::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: shimmer 2s infinite;
}

@keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}

.p4-lessons {
    display: grid;
    gap: var(--p4-space-sm);
}

.p4-lesson {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: var(--p4-space-md);
    align-items: center;
    padding: var(--p4-space-md);
    border-radius: var(--p4-radius-md);
    background: var(--p4-clr-surface-glass);
    backdrop-filter: blur(10px);
    border: 1px solid var(--p4-clr-border);
    transition: var(--p4-transition-normal);
    position: relative;
    overflow: hidden;
}

.p4-lesson::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: var(--p4-gradient-primary);
    opacity: 0;
    transition: var(--p4-transition-normal);
}

.p4-lesson:hover {
    transform: translateY(-1px);
    box-shadow: var(--p4-shadow-md);
    border-color: var(--p4-clr-primary);
}

.p4-lesson:hover::before {
    opacity: 1;
}

.p4-lesson.is-complete {
    border-color: var(--p4-clr-success);
    background: linear-gradient(135deg, var(--p4-clr-surface-glass), rgba(16, 185, 129, 0.1));
}

.p4-lesson.is-complete::before {
    background: var(--p4-gradient-success);
    opacity: 1;
}

.p4-lesson.is-next {
    border-color: var(--p4-clr-primary);
    background: linear-gradient(135deg, var(--p4-clr-surface-glass), rgba(99, 102, 241, 0.1));
    box-shadow: var(--p4-shadow-glow);
    transform: translateY(-1px);
}

.p4-lesson.is-next::before {
    background: var(--p4-gradient-primary);
    opacity: 1;
}

.p4-lesson.is-locked {
    opacity: 0.5;
    border-style: dashed;
    cursor: not-allowed;
}

.p4-lesson.is-locked:hover {
    transform: none;
    box-shadow: none;
    border-color: var(--p4-clr-border);
}

.p4-lesson input[type="checkbox"] {
    width: 20px;
    height: 20px;
    accent-color: var(--p4-clr-primary);
    margin: 0;
    cursor: pointer;
    transition: var(--p4-transition-normal);
}

.p4-lesson input[type="checkbox"]:hover {
    transform: scale(1.1);
}

.p4-lesson__text {
    display: grid;
    gap: var(--p4-space-xs);
}

.p4-lesson__title {
    font-weight: 600;
    font-size: 1rem;
    color: var(--p4-clr-text-primary);
    line-height: 1.4;
}

.p4-lesson__meta {
    font-size: 0.875rem;
    color: var(--p4-clr-text-muted);
    font-weight: 500;
}

.p4-lesson__link {
    display: inline-flex;
    align-items: center;
    gap: var(--p4-space-xs);
    padding: var(--p4-space-sm) var(--p4-space-md);
    border-radius: var(--p4-radius-full);
    border: 1px solid var(--p4-clr-border);
    background: var(--p4-clr-surface-glass);
    backdrop-filter: blur(10px);
    color: var(--p4-clr-primary);
    text-decoration: none;
    font-weight: 600;
    font-size: 0.875rem;
    transition: var(--p4-transition-normal);
    box-shadow: var(--p4-shadow-sm);
}

.p4-lesson__link:hover {
    border-color: var(--p4-clr-primary);
    color: var(--p4-clr-text-primary);
    background: var(--p4-gradient-primary);
    transform: translateY(-1px);
    box-shadow: var(--p4-shadow-glow);
}

.p4-lesson__link:active {
    transform: translateY(0);
}

.p4-lesson.is-locked .p4-lesson__link {
    pointer-events: none;
    color: var(--p4-clr-text-disabled);
    background: var(--p4-clr-surface-glass);
    border-color: var(--p4-clr-border);
    opacity: 0.5;
}


.p4-section-note {
    margin: 0;
    color: var(--p4-clr-text-muted);
    font-size: 0.95rem;
}

/* Remove old card styles - now using table layout */

/* Enhanced Progress Bar Styling */
.p4-module__meter {
    position: relative;
    width: 100%;
    height: 16px;
    border-radius: var(--p4-radius-full);
    background: var(--p4-clr-surface-glass);
    border: 1px solid var(--p4-clr-border);
    overflow: hidden;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.p4-module__meter-fill {
    width: 0;
    height: 100%;
    border-radius: var(--p4-radius-full);
    background: var(--p4-gradient-primary);
    transition: width var(--p4-transition-slow);
    position: relative;
    overflow: hidden;
}

.p4-module__meter-fill::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: progress-shimmer 2s infinite;
}

@keyframes progress-shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}

.p4-module__meter-fill::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.2) 50%, transparent 70%);
    animation: progress-glow 3s infinite;
}

@keyframes progress-glow {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.8; }
}

/* Enhanced lesson progress indicators */
.p4-lesson__progress {
    display: flex;
    align-items: center;
    gap: var(--p4-space-sm);
    margin-top: var(--p4-space-sm);
}

.p4-lesson__progress-bar {
    flex: 1;
    height: 6px;
    border-radius: var(--p4-radius-full);
    background: var(--p4-clr-surface-glass);
    border: 1px solid var(--p4-clr-border);
    overflow: hidden;
}

.p4-lesson__progress-fill {
    height: 100%;
    border-radius: var(--p4-radius-full);
    background: var(--p4-gradient-primary);
    transition: width var(--p4-transition-normal);
    position: relative;
}

.p4-lesson__progress-fill::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    animation: mini-shimmer 2s infinite;
}

@keyframes mini-shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}

.p4-lesson__progress-text {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--p4-clr-text-muted);
    min-width: 40px;
    text-align: right;
}

</style>

<div class="p4-shell">
    <section class="p4-hero">
        <div class="p4-hero__copy">
            <span class="p4-badge">Fall 2024 &ndash; Period 4</span>
            <h1>Big Idea 3 · Programming Fundamentals</h1>
            <p class="p4-hero__lead">
                Track your nine-module path, light up the progress orb, and unlock quick actions as each lesson clicks into place.
            </p>
            <nav class="p4-stepper" data-stepper>
                <span data-step="start">Start</span>
                <span data-step="learn">Learn</span>
                <span data-step="practice">Practice</span>
                <span data-step="quiz">Quiz</span>
                <span data-step="victory">Victory!</span>
            </nav>
            <div class="p4-quick-links" data-quick-links>
                <span class="p4-quick-links__ghost">Progress a little more to unlock quick actions.</span>
            </div>
        </div>
        <aside class="p4-hero__dashboard">
            <div class="p4-orb" data-progress-ring>
                <span class="p4-orb__value" data-progress-value>0%</span>
            </div>
            <div class="p4-stage" data-progress-stage>Start</div>
            <p class="p4-stage-message" data-progress-message>Check off a lesson to begin your journey.</p>
            <p class="p4-stage-next" data-progress-next>Keep building momentum to reveal the next level.</p>
            <ul class="p4-stats">
                <li>
                    <strong data-stat-complete>0</strong>
                    <span>Lessons cleared</span>
                </li>
                <li>
                    <strong data-stat-remaining>0</strong>
                    <span>Lessons remaining</span>
                </li>
                <li>
                    <strong data-stat-modules>0</strong>
                    <span>Modules mastered</span>
                </li>
            </ul>
            <div class="p4-dashboard-nav">
                <div class="p4-dashboard-nav__header">
                    <h3>Lesson Navigation</h3>
                    <button class="p4-nav-toggle" data-nav-toggle type="button">
                        <span class="p4-nav-toggle__text">Show All Lessons</span>
                        <svg class="p4-nav-toggle__icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                        </svg>
                    </button>
                </div>
                <div class="p4-module-nav" data-module-nav></div>
                <div class="p4-lesson-table" data-lesson-nav></div>
                <a class="p4-ap-link" href="https://apstudents.collegeboard.org/courses/ap-computer-science-principles" target="_blank" rel="noopener">
                    AP Curriculum Guide
                    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M7.293 14.707a1 1 0 010-1.414L11.586 9 7.293 4.707a1 1 0 111.414-1.414l5.5 5.5a1 1 0 010 1.414l-5.5 5.5a1 1 0 01-1.414 0z"></path>
                        <path d="M4 4a1 1 0 011-1h6a1 1 0 010 2H6v10h5a1 1 0 110 2H5a1 1 0 01-1-1V4z"></path>
                    </svg>
                </a>
            </div>
        </aside>
    </section>

    <section class="p4-roadmap">
        <header>
            <h2>Roadmap to Victory</h2>
            <p class="p4-section-note">Work top to bottom—every check powers the orb and opens the next level.</p>
        </header>
        
        <div class="p4-module-grid" data-lessons-root></div>
    </section>

</div>

<script>
(function() {
    const root = document.querySelector('[data-lessons-root]');
    if (!root) {
        return;
    }

    const stepper = document.querySelector('[data-stepper]');
    const ringEl = document.querySelector('[data-progress-ring]');
    const valueEl = document.querySelector('[data-progress-value]');
    const stageEl = document.querySelector('[data-progress-stage]');
    const messageEl = document.querySelector('[data-progress-message]');
    const nextEl = document.querySelector('[data-progress-next]');
    const statsComplete = document.querySelector('[data-stat-complete]');
    const statsRemaining = document.querySelector('[data-stat-remaining]');
    const statsModules = document.querySelector('[data-stat-modules]');
    const quickLinks = document.querySelector('[data-quick-links]');
    const moduleNav = document.querySelector('[data-module-nav]');
    const lessonNav = document.querySelector('[data-lesson-nav]');
    const navToggle = document.querySelector('[data-nav-toggle]');

    const arrowIcon = '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path fill="currentColor" d="M7.3 4.3l1.4-1.4 7.4 7.4-7.4 7.4-1.4-1.4 5.3-5.3-5.3-5.3z"/></svg>';

    const steps = [
        { id: 'start', threshold: 0, message: 'Check off a lesson to begin your journey.' },
        { id: 'learn', threshold: 10, message: 'You are building momentum. Keep learning!' },
        { id: 'practice', threshold: 40, message: 'Time to practice and refine your understanding.' },
        { id: 'quiz', threshold: 70, message: 'Quiz yourself and lock in the concepts.' },
        { id: 'victory', threshold: 99, message: 'Victory! You mastered every lesson in this unit.' }
    ];

    function buildAction(label, href, accent) {
        const link = document.createElement('a');
        link.className = 'p4-quick-links__action';
        link.href = href;
        link.textContent = label;
        if (accent) {
            link.style.borderColor = 'var(--p4-clr-accent)';
            link.style.background = 'rgba(74, 116, 255, 0.65)';
            link.style.color = '#fff';
        }
        return link;
    }

    // Fluid table-like lesson navigation system
    function buildLessonRow(lesson, state, index) {
        const row = document.createElement('a');
        row.className = 'p4-lesson-row';
        row.href = lesson.url;
        row.textContent = ''; // Clear any existing content
        
        const isCompleted = state.completed.has(lesson.slug);
        const isUnlocked = state.unlocked.has(lesson.slug);
        const isCurrent = state.orderedLessons.findIndex(l => l.slug === lesson.slug) === 
                         state.orderedLessons.findIndex(l => !state.completed.has(l.slug));
        
        // Add status classes
        if (isCompleted) row.classList.add('is-completed');
        if (isCurrent && !isCompleted) row.classList.add('is-current');
        if (!isUnlocked) row.classList.add('is-locked');
        
        // Lesson number
        const number = document.createElement('div');
        number.className = 'p4-lesson-number';
        number.textContent = String(index + 1).padStart(2, '0');
        row.appendChild(number);
        
        // Lesson info
        const info = document.createElement('div');
        info.className = 'p4-lesson-info';
        
        const title = document.createElement('h4');
        title.className = 'p4-lesson-title';
        title.textContent = lesson.title;
        info.appendChild(title);
        
        const description = document.createElement('p');
        description.className = 'p4-lesson-description';
        description.textContent = getLessonDescription(lesson.slug);
        info.appendChild(description);
        
        row.appendChild(info);
        
        // Status indicator
        const status = document.createElement('div');
        status.className = 'p4-lesson-status';
        if (isCompleted) {
            status.classList.add('is-completed');
            status.innerHTML = '✓ Completed';
        } else if (isCurrent) {
            status.classList.add('is-current');
            status.innerHTML = '→ Current';
        } else if (!isUnlocked) {
            status.classList.add('is-locked');
            status.innerHTML = '🔒 Locked';
        } else {
            status.innerHTML = '⏳ Available';
        }
        row.appendChild(status);
        
        // Progress indicator
        const progress = document.createElement('div');
        progress.className = 'p4-lesson-progress';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'p4-lesson-progress-bar';
        
        const progressFill = document.createElement('div');
        progressFill.className = 'p4-lesson-progress-fill';
        progressFill.style.width = isCompleted ? '100%' : '0%';
        progressBar.appendChild(progressFill);
        
        const progressText = document.createElement('div');
        progressText.className = 'p4-lesson-progress-text';
        progressText.textContent = isCompleted ? '100%' : '0%';
        
        progress.appendChild(progressBar);
        progress.appendChild(progressText);
        row.appendChild(progress);
        
        return row;
    }

    function getLessonDescription(slug) {
        const descriptions = {
            '3-1-1': 'Learn about Python variables and how to store data.',
            '3-1-2': 'Explore different Python data types and their uses.',
            '3-1-3': 'Master JavaScript variables and data storage.',
            '3-1-4': 'Understand JavaScript data types and conversions.',
            '3-2-1': 'Introduction to data abstraction concepts.',
            '3-2-2': 'Practice with data abstraction techniques.',
            '3-3-1': 'Mathematical expressions in Python.',
            '3-3-2': 'Advanced mathematical operations.',
            '3-4-1': 'Working with strings in Python.',
            '3-4-2': 'String manipulation and formatting.',
            '3-5-1': 'Boolean logic and conditions.',
            '3-5-2': 'Complex boolean expressions.',
            '3-6-1': 'Conditional statements and control flow.',
            '3-6-2': 'Advanced conditional logic.',
            '3-7-1': 'Nested conditionals and complex decisions.',
            '3-7-2': 'Best practices for nested conditionals.',
            '3-8-1': 'Introduction to loops and iteration.',
            '3-8-2': 'Advanced iteration techniques.',
            '3-9-1': 'Developing algorithms step by step.',
            '3-9-2': 'Algorithm design patterns.',
            '3-10-1': 'Python lists and data structures.',
            '3-10-2': 'Advanced list operations and methods.'
        };
        return descriptions[slug] || 'Continue your programming journey with this lesson.';
    }

    function setupLessonNavigation(progress) {
        if (!lessonNav || !navToggle) return;
        
        const lessons = progress.getLessons();
        if (!lessons || !lessons.length) {
            lessonNav.innerHTML = '<p class="p4-empty-state">Lessons will appear here once they are published.</p>';
            return;
        }
        
        // Toggle functionality
        navToggle.addEventListener('click', () => {
            const table = lessonNav;
            const isExpanded = table.classList.contains('is-expanded');
            
            if (isExpanded) {
                table.classList.remove('is-expanded');
                navToggle.classList.remove('is-expanded');
                navToggle.querySelector('.p4-nav-toggle__text').textContent = 'Show All Lessons';
            } else {
                table.classList.add('is-expanded');
                navToggle.classList.add('is-expanded');
                navToggle.querySelector('.p4-nav-toggle__text').textContent = 'Hide Lessons';
            }
        });
        
        // Update lesson rows when progress changes
        progress.subscribe((state) => {
            lessonNav.innerHTML = '';
            lessons.forEach((lesson, index) => {
                const row = buildLessonRow(lesson, state, index);
                lessonNav.appendChild(row);
            });
        });
    }

    function init(progress) {
        const modules = progress.getModules();
        if (!modules || !modules.length) {
            root.innerHTML = '<p style="color: rgba(208, 216, 255, 0.7);">Lessons will appear here once they are published.</p>';
            return;
        }

        // Setup the new lesson navigation system
        setupLessonNavigation(progress);

        root.innerHTML = '';
        if (moduleNav) {
            moduleNav.innerHTML = '';
        }

        const moduleMeta = [];
        const moduleOrder = [];

        modules.forEach((module) => {
            moduleOrder.push(module.key);

            if (moduleNav) {
                const chip = document.createElement('a');
                chip.href = '#module-' + module.key;
                chip.textContent = module.label;
                moduleNav.appendChild(chip);
            }

            const card = document.createElement('article');
            card.className = 'p4-module';
            card.id = 'module-' + module.key;

            const header = document.createElement('div');
            header.className = 'p4-module__header';

            const titleRow = document.createElement('div');
            titleRow.className = 'p4-module__title-row';

            const heading = document.createElement('h3');
            heading.innerHTML = module.label;
            titleRow.appendChild(heading);

            const count = document.createElement('span');
            count.className = 'p4-module__count';
            count.textContent = '0 / ' + module.lessons.length + ' complete';
            titleRow.appendChild(count);

            header.appendChild(titleRow);

            const meter = document.createElement('div');
            meter.className = 'p4-module__meter';
            const meterFill = document.createElement('div');
            meterFill.className = 'p4-module__meter-fill';
            meter.appendChild(meterFill);
            header.appendChild(meter);

            card.appendChild(header);

            const list = document.createElement('div');
            list.className = 'p4-lessons';
            card.appendChild(list);

            const lessonMeta = [];

            module.lessons.forEach((lesson) => {
                const row = document.createElement('label');
                row.className = 'p4-lesson';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.dataset.lessonSlug = lesson.slug;
                row.appendChild(checkbox);

                const text = document.createElement('div');
                text.className = 'p4-lesson__text';

                const title = document.createElement('div');
                title.className = 'p4-lesson__title';
                title.textContent = lesson.title;
                text.appendChild(title);

                const meta = document.createElement('div');
                meta.className = 'p4-lesson__meta';
                meta.textContent = lesson.slug.replace(/-/g, '.');
                text.appendChild(meta);

                row.appendChild(text);

                const link = document.createElement('a');
                link.className = 'p4-lesson__link';
                link.href = lesson.url;
                link.innerHTML = 'Open' + arrowIcon;
                row.appendChild(link);

                checkbox.addEventListener('change', () => {
                    progress.setCompleted(lesson.slug, checkbox.checked);
                });

                list.appendChild(row);

                lessonMeta.push({
                    slug: lesson.slug,
                    checkbox,
                    row,
                    link
                });
            });

            root.appendChild(card);
            moduleMeta.push({
                key: module.key,
                card,
                countEl: count,
                meterFill,
                lessons: lessonMeta,
                totalLessons: module.lessons.length
            });
        });

        progress.subscribe((state) => {
            const totalLessons = state.total;
            const completedLessons = state.completed.size;
            const remainingLessons = Math.max(totalLessons - completedLessons, 0);
            const nextLesson = state.orderedLessons.find((lesson) => !state.completed.has(lesson.slug)) || null;
            const lastCompleted = [...state.completed].reduce((acc, slug) => {
                const lesson = state.orderedLessons.find((item) => item.slug === slug);
                if (!lesson) {
                    return acc;
                }
                if (!acc) {
                    return lesson;
                }
                return state.orderedLessons.indexOf(lesson) > state.orderedLessons.indexOf(acc) ? lesson : acc;
            }, null);

            let modulesCleared = 0;

            moduleMeta.forEach((meta) => {
                let moduleCompleted = 0;
                meta.lessons.forEach((item) => {
                    const slug = item.slug;
                    const isCompleted = state.completed.has(slug);
                    const isUnlocked = state.unlocked.has(slug) || isCompleted;
                    const isNext = nextLesson && slug === nextLesson.slug && !isCompleted;

                    item.checkbox.checked = isCompleted;
                    item.checkbox.disabled = !isUnlocked;
                    item.checkbox.title = isUnlocked ? 'Mark this lesson complete when you finish.' : 'Locked until the previous lesson is complete.';

                    item.row.classList.toggle('is-locked', !isUnlocked);
                    item.row.classList.toggle('is-complete', isCompleted);
                    item.row.classList.toggle('is-next', isNext);

                    if (item.link) {
                        if (!isUnlocked) {
                            item.link.classList.add('is-locked');
                            item.link.setAttribute('aria-disabled', 'true');
                            item.link.tabIndex = -1;
                            item.link.title = 'Locked until the previous lesson is complete.';
                        } else {
                            item.link.classList.remove('is-locked');
                            item.link.removeAttribute('aria-disabled');
                            item.link.removeAttribute('tabindex');
                            item.link.removeAttribute('title');
                        }
                    }

                    if (isCompleted) {
                        moduleCompleted += 1;
                    }
                });

                const ratio = meta.totalLessons ? Math.round((moduleCompleted / meta.totalLessons) * 100) : 0;
                meta.countEl.textContent = moduleCompleted + ' / ' + meta.totalLessons + ' complete';
                meta.meterFill.style.width = ratio + '%';
                meta.card.classList.toggle('is-complete', moduleCompleted === meta.totalLessons && meta.totalLessons > 0);
                meta.card.classList.toggle('is-active', nextLesson && nextLesson.moduleKey === meta.key);

                if (moduleCompleted === meta.totalLessons && meta.totalLessons > 0) {
                    modulesCleared += 1;
                }
            });

            if (ringEl) {
                ringEl.style.setProperty('--progress-angle', (state.percent * 3.6) + 'deg');
            }
            if (valueEl) {
                valueEl.textContent = state.percent + '%';
            }
            if (statsComplete) {
                statsComplete.textContent = completedLessons;
            }
            if (statsRemaining) {
                statsRemaining.textContent = remainingLessons;
            }
            if (statsModules) {
                statsModules.textContent = modulesCleared;
            }

            let currentStep = steps[0];
            steps.forEach((step) => {
                if (state.percent >= step.threshold) {
                    currentStep = step;
                }
            });

            if (stageEl) {
                stageEl.textContent = currentStep.id === 'victory' && remainingLessons === 0 ? 'Victory' : currentStep.id.charAt(0).toUpperCase() + currentStep.id.slice(1);
            }
            if (messageEl) {
                messageEl.textContent = currentStep.message;
            }

            if (nextEl) {
                if (nextLesson) {
                    const locked = !state.unlocked.has(nextLesson.slug);
                    if (locked) {
                        nextEl.textContent = 'Next lesson locked: ' + nextLesson.title + ' — clear the current level first.';
                    } else {
                        nextEl.innerHTML = 'Next lesson: <a href="' + nextLesson.url + '">' + nextLesson.title + '</a>';
                    }
                } else {
                    nextEl.textContent = 'Victory unlocked — every lesson in this unit is complete!';
                }
            }

            if (quickLinks) {
                quickLinks.innerHTML = '';
                if (nextLesson) {
                    if (state.unlocked.has(nextLesson.slug)) {
                        quickLinks.appendChild(buildAction('Continue · ' + nextLesson.slug.replace(/-/g, '.'), nextLesson.url, true));
                    } else {
                        const ghost = document.createElement('span');
                        ghost.className = 'p4-quick-links__ghost';
                        ghost.textContent = 'Finish this level to unlock a continue shortcut.';
                        quickLinks.appendChild(ghost);
                    }
                } else {
                    quickLinks.appendChild(buildAction('Celebrate Victory', '#module-' + moduleOrder[moduleOrder.length - 1], true));
                }

                if (lastCompleted) {
                    quickLinks.appendChild(buildAction('Review · ' + lastCompleted.slug.replace(/-/g, '.'), lastCompleted.url));
                }

                quickLinks.appendChild(buildAction('View Module Map', '#module-' + moduleOrder[0]));
            }

            if (stepper) {
                Array.from(stepper.querySelectorAll('[data-step]')).forEach((el) => {
                    const id = el.getAttribute('data-step');
                    const config = steps.find((step) => step.id === id);
                    if (!config) {
                        return;
                    }
                    const isPassed = state.percent >= config.threshold;
                    el.classList.toggle('is-active', isPassed);
                    el.classList.toggle('is-current', currentStep.id === id);
                });
            }
        });
    }

    function waitForProgress() {
        if (window.P4Progress) {
            init(window.P4Progress);
        } else {
            document.addEventListener('p4-progress-update', function handleReady() {
                if (window.P4Progress) {
                    init(window.P4Progress);
                    document.removeEventListener('p4-progress-update', handleReady);
                }
            });
        }
    }

    waitForProgress();
})();
</script>
