---
layout: post
title: Programming Lessons Fundamentals
description: Interactive lessons combining programming concepts with engaging games. Master variables, data abstractions, mathematical operations, and procedures through hands-on practice.
toc: False
comments: False
permalink: /csp/programming-lessons/fundamentals
courses: {'csp': {'week': 8}}
type: coding
menu: nav/csp_units/csp_programming_lessons.html
---

<style>
:root {
    --prog-bg-start: #18144d;
    --prog-bg-end: #0a0524;
    --prog-card-bg: rgba(16, 12, 48, 0.78);
    --prog-border: rgba(82, 64, 196, 0.45);
    --prog-highlight: #6655ff;
    --prog-highlight-soft: rgba(102, 85, 255, 0.58);
    --prog-accent: #2d9bff;
    --prog-text-primary: #f2f5ff;
    --prog-text-secondary: rgba(225, 229, 255, 0.78);
    --prog-text-muted: rgba(200, 205, 242, 0.65);
    --prog-shadow: 0 22px 40px rgba(14, 9, 43, 0.55);
    --prog-radius-lg: 32px;
    --prog-radius-md: 18px;
    --prog-radius-sm: 12px;
    --prog-transition: 220ms ease;
}

.prog-wrapper {
    position: relative;
    margin: 0 auto;
    padding: 48px clamp(16px, 4vw, 56px);
    border-radius: var(--prog-radius-lg);
    background: radial-gradient(110% 150% at 50% 0%, rgba(102, 85, 255, 0.55) 0%, rgba(22, 16, 64, 0.92) 43%, rgba(6, 4, 18, 0.95) 100%);
    color: var(--prog-text-primary);
    box-shadow: var(--prog-shadow);
    overflow: hidden;
}

.prog-wrapper::after {
    content: "";
    position: absolute;
    inset: -120px -220px auto -80px;
    height: 360px;
    background: radial-gradient(40% 40% at 30% 30%, rgba(102, 85, 255, 0.38) 0%, rgba(102, 85, 255, 0) 100%);
    opacity: 0.7;
    z-index: 0;
    pointer-events: none;
}

.prog-wrapper > * {
    position: relative;
    z-index: 1;
}

.prog-hero {
    display: grid;
    gap: 32px;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    align-items: center;
    margin-bottom: 48px;
}

.prog-hero-left {
    display: flex;
    flex-direction: column;
    gap: 28px;
}

.prog-stepper {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    padding: 14px 18px;
    border-radius: 999px;
    background: rgba(20, 14, 58, 0.7);
    border: 1px solid rgba(109, 95, 255, 0.3);
    width: fit-content;
}

.prog-step {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 16px;
    border-radius: 999px;
    background: rgba(30, 22, 72, 0.6);
    border: 1px solid rgba(109, 95, 255, 0.2);
    transition: var(--prog-transition);
}

.prog-step.is-active {
    background: rgba(102, 85, 255, 0.25);
    border-color: rgba(102, 85, 255, 0.5);
}

.prog-step.is-current {
    background: linear-gradient(135deg, rgba(102, 85, 255, 0.45), rgba(45, 155, 255, 0.45));
    border-color: var(--prog-accent);
}

.prog-step-icon {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: rgba(200, 205, 242, 0.25);
    border: 2px solid rgba(200, 205, 242, 0.4);
    transition: var(--prog-transition);
}

.prog-step.is-active .prog-step-icon {
    background: rgba(102, 85, 255, 0.35);
    border-color: var(--prog-highlight);
}

.prog-step.is-current .prog-step-icon {
    background: var(--prog-accent);
    border-color: var(--prog-accent);
}

.prog-step-label {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--prog-text-muted);
}

.prog-step.is-active .prog-step-label {
    color: var(--prog-text-secondary);
}

.prog-step.is-current .prog-step-label {
    color: var(--prog-text-primary);
}

.prog-hero h1 {
    margin: 0;
    font-size: clamp(2.2rem, 5vw, 3rem);
    line-height: 1.15;
}

.prog-hero p {
    margin: 0;
    font-size: 1.1rem;
    line-height: 1.55;
    color: var(--prog-text-secondary);
}

.prog-hero-right {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18px;
}

.prog-progress-meter {
    position: relative;
    width: 72px;
    height: 220px;
    padding: 5px;
    border-radius: 40px;
    background: linear-gradient(160deg, rgba(76, 63, 222, 0.35), rgba(21, 13, 68, 0.85));
    border: 1px solid rgba(110, 123, 255, 0.35);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 22px 32px rgba(12, 8, 36, 0.5);
}

.prog-progress-fill {
    position: absolute;
    left: 5px;
    right: 5px;
    bottom: 5px;
    height: 0;
    border-radius: 36px;
    background: linear-gradient(180deg, rgba(125, 95, 255, 0.2) 0%, rgba(91, 122, 255, 0.6) 45%, rgba(41, 122, 255, 0.92) 100%);
    transition: height 350ms ease;
}

.prog-progress-value {
    position: relative;
    margin-top: 14px;
    font-weight: 700;
    font-size: 1.8rem;
    letter-spacing: 0.04em;
    text-align: center;
}

[data-progress-message] {
    font-size: 0.98rem;
    line-height: 1.5;
    color: var(--prog-text-secondary);
    text-align: center;
}

.prog-info-grid {
    display: grid;
    gap: 22px;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    margin-bottom: 42px;
}

.prog-card {
    padding: 28px;
    border-radius: var(--prog-radius-md);
    background: var(--prog-card-bg);
    border: 1px solid var(--prog-border);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03), 0 22px 32px rgba(8, 5, 25, 0.42);
}

.prog-card h2 {
    margin-top: 0;
    margin-bottom: 14px;
    font-size: 1.5rem;
}

.prog-card h3 {
    margin-top: 18px;
    margin-bottom: 12px;
    font-size: 1.15rem;
    color: var(--prog-accent);
}

.prog-card ul {
    margin: 0;
    padding-left: 18px;
    color: var(--prog-text-secondary);
}

.prog-card ul li + li {
    margin-top: 8px;
}

.prog-lesson-section {
    margin-bottom: 48px;
}

.prog-lesson-section header {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 24px;
}

.prog-lesson-section h2 {
    margin: 0;
    font-size: 1.8rem;
}

.prog-lesson-section p {
    margin: 0;
    color: var(--prog-text-muted);
}

.prog-lesson-groups {
    display: grid;
    gap: 20px;
}

.prog-module-card {
    padding: 24px 24px 20px;
    border-radius: var(--prog-radius-md);
    background: rgba(18, 13, 52, 0.78);
    border: 1px solid rgba(102, 85, 255, 0.2);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.02), 0 12px 22px rgba(11, 6, 31, 0.4);
}

.prog-module-header {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 18px;
}

.prog-module-header h3 {
    margin: 0;
    font-size: 1.25rem;
}

.prog-module-count {
    font-size: 0.95rem;
    color: rgba(179, 191, 255, 0.75);
}

.prog-lessons-list {
    display: grid;
    gap: 12px;
}

.prog-lesson-item {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 16px;
    padding: 14px 18px;
    border-radius: var(--prog-radius-sm);
    background: rgba(14, 10, 42, 0.55);
    border: 1px solid rgba(102, 85, 255, 0.12);
    cursor: pointer;
    transition: var(--prog-transition);
}

.prog-lesson-item:hover:not(.is-locked) {
    background: rgba(18, 13, 52, 0.75);
    border-color: rgba(102, 85, 255, 0.3);
}

.prog-lesson-item.is-locked {
    opacity: 0.5;
    cursor: not-allowed;
}

.prog-lesson-item input[type="checkbox"] {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    width: 22px;
    height: 22px;
    border-radius: 6px;
    border: 2px solid rgba(102, 85, 255, 0.4);
    background: rgba(30, 22, 72, 0.6);
    cursor: pointer;
    transition: var(--prog-transition);
}

.prog-lesson-item input[type="checkbox"]:checked {
    background: linear-gradient(135deg, var(--prog-highlight), var(--prog-accent));
    border-color: var(--prog-accent);
}

.prog-lesson-item input[type="checkbox"]:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.prog-lesson-title {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.prog-lesson-title span:first-child {
    font-size: 1rem;
    font-weight: 500;
    color: var(--prog-text-primary);
}

.prog-lesson-title span:last-child {
    font-size: 0.85rem;
    color: var(--prog-text-muted);
}

.prog-lesson-link {
    padding: 8px 16px;
    border-radius: 999px;
    border: 1px solid rgba(109, 95, 255, 0.35);
    background: linear-gradient(135deg, rgba(93, 76, 255, 0.8), rgba(55, 122, 255, 0.8));
    color: var(--prog-text-primary);
    font-weight: 600;
    font-size: 0.9rem;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: var(--prog-transition);
}

.prog-lesson-link:hover:not(.is-locked) {
    transform: translateY(-2px);
    box-shadow: 0 12px 20px rgba(55, 122, 255, 0.35);
}

.prog-lesson-link.is-locked {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
}

@media (max-width: 768px) {
    .prog-lesson-item {
        grid-template-columns: auto 1fr;
        grid-template-rows: auto auto;
    }

    .prog-lesson-link {
        grid-column: 2;
        justify-self: end;
    }
}
</style>

<div class="prog-wrapper">
    <div class="prog-hero">
        <div class="prog-hero-left">
            <div class="prog-stepper">
                <div class="prog-step" data-step="beginner">
                    <div class="prog-step-icon"></div>
                    <span class="prog-step-label">Beginner</span>
                </div>
                <div class="prog-step" data-step="intermediate">
                    <div class="prog-step-icon"></div>
                    <span class="prog-step-label">Intermediate</span>
                </div>
                <div class="prog-step" data-step="advanced">
                    <div class="prog-step-icon"></div>
                    <span class="prog-step-label">Advanced</span>
                </div>
                <div class="prog-step" data-step="expert">
                    <div class="prog-step-icon"></div>
                    <span class="prog-step-label">Expert</span>
                </div>
            </div>

            <h1>Programming Lessons with Games</h1>
            <p>
                Learn programming fundamentals through interactive games and hands-on practice.
                Each lesson combines theory with engaging challenges featuring Peppa Pig, Flappy Bird, and more.
                Complete lessons sequentially to unlock the next challenge!
            </p>
        </div>

        <div class="prog-hero-right">
            <div class="prog-progress-meter">
                <div class="prog-progress-fill" data-progress-fill></div>
            </div>
            <div class="prog-progress-value" data-progress-value>0%</div>
            <p data-progress-message>Start your journey by completing the first lesson!</p>
        </div>
    </div>

    <div class="prog-info-grid">
        <div class="prog-card">
            <h2>🎮 Game-Based Learning</h2>
            <ul>
                <li>Peppa Pig Maze - Learn variables through gameplay</li>
                <li>Flappy Bird - Understand data abstractions</li>
                <li>Interactive calculators - Master mathematical operations</li>
                <li>Crab procedures - Practice calling functions</li>
            </ul>
        </div>

        <div class="prog-card">
            <h2>📚 Core Concepts</h2>
            <ul>
                <li>Variables and assignments (Python & JavaScript)</li>
                <li>Data types and abstractions</li>
                <li>Mathematical expressions and algorithms</li>
                <li>Procedures and function calls</li>
            </ul>
        </div>

        <div class="prog-card">
            <h2>🔓 Sequential Unlocking</h2>
            <ul>
                <li>Complete lessons in order to progress</li>
                <li>Mark lessons complete to unlock the next</li>
                <li>Track your progress with the meter</li>
                <li>Progress saves automatically in your browser</li>
            </ul>
        </div>
    </div>

    <section class="prog-lesson-section">
        <header>
            <h2>📖 Lesson Roadmap</h2>
            <p>Complete each lesson and game to unlock the next challenge. Your progress is saved automatically.</p>
        </header>
        <div class="prog-lesson-groups" data-lesson-groups></div>
    </section>
</div>

<script>
(function() {
    const steps = [
        { id: 'beginner', threshold: 0, message: 'Start your journey by completing the first lesson!' },
        { id: 'intermediate', threshold: 25, message: 'Great progress! Keep going to unlock more lessons.' },
        { id: 'advanced', threshold: 50, message: 'Halfway there! You\'re mastering the fundamentals.' },
        { id: 'expert', threshold: 75, message: 'Almost done! Finish strong to complete all lessons.' }
    ];

    const arrowIcon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    function init(progress) {
        const root = document.querySelector('[data-lesson-groups]');
        const fillEl = document.querySelector('[data-progress-fill]');
        const valueEl = document.querySelector('[data-progress-value]');
        const messageEl = document.querySelector('[data-progress-message]');
        const stepper = document.querySelector('.prog-stepper');

        if (!root) {
            console.warn('Programming Lessons: root element not found');
            return;
        }

        const state = progress.getState();
        const modules = state.orderedModules;
        const moduleMeta = [];
        let totalCompleted = 0;

        modules.forEach((module) => {
            const card = document.createElement('div');
            card.className = 'prog-module-card';

            const header = document.createElement('div');
            header.className = 'prog-module-header';

            const heading = document.createElement('h3');
            heading.innerHTML = module.label;
            header.appendChild(heading);

            const count = document.createElement('span');
            count.className = 'prog-module-count';
            header.appendChild(count);

            card.appendChild(header);

            const list = document.createElement('div');
            list.className = 'prog-lessons-list';
            card.appendChild(list);

            const lessonMeta = [];

            module.lessons.forEach((lesson) => {
                const row = document.createElement('label');
                row.className = 'prog-lesson-item';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.dataset.lessonSlug = lesson.slug;
                row.appendChild(checkbox);

                const text = document.createElement('div');
                text.className = 'prog-lesson-title';
                const titleSpan = document.createElement('span');
                titleSpan.textContent = lesson.title;
                const slugSpan = document.createElement('span');
                slugSpan.textContent = lesson.slug.replace(/-/g, '.');
                text.appendChild(titleSpan);
                text.appendChild(slugSpan);
                row.appendChild(text);

                const link = document.createElement('a');
                link.className = 'prog-lesson-link';
                link.href = lesson.url;
                link.innerHTML = 'Open' + arrowIcon;
                link.addEventListener('click', (event) => {
                    if (!progress.isUnlocked(lesson.slug)) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                });
                row.appendChild(link);

                checkbox.addEventListener('change', () => {
                    progress.setCompleted(lesson.slug, checkbox.checked);
                });

                list.appendChild(row);

                lessonMeta.push({
                    slug: lesson.slug,
                    checkbox,
                    link,
                    row
                });
            });

            root.appendChild(card);
            moduleMeta.push({ countEl: count, lessons: lessonMeta });
        });

        progress.subscribe((state) => {
            moduleMeta.forEach((meta) => {
                let moduleCompleted = 0;
                meta.lessons.forEach((item) => {
                    const slug = item.slug;
                    const isCompleted = state.completed.has(slug);
                    const isUnlocked = state.unlocked.has(slug) || isCompleted;

                    item.checkbox.checked = isCompleted;
                    item.checkbox.disabled = !isUnlocked;
                    item.checkbox.title = isUnlocked ? 'Mark this lesson complete when you finish.' : 'Locked until the previous lesson is complete.';

                    item.row.classList.toggle('is-locked', !isUnlocked);

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
                        totalCompleted += 1;
                    }
                });
                meta.countEl.textContent = moduleCompleted + '/' + meta.lessons.length + ' complete';
            });

            if (fillEl) {
                fillEl.style.height = state.percent + '%';
            }
            if (valueEl) {
                valueEl.textContent = state.percent + '%';
            }

            let currentStep = steps[0];
            steps.forEach((step) => {
                if (state.percent >= step.threshold) {
                    currentStep = step;
                }
            });

            if (messageEl) {
                messageEl.textContent = currentStep.message;
            }

            if (stepper) {
                Array.from(stepper.querySelectorAll('[data-step]')).forEach((el) => {
                    const id = el.getAttribute('data-step');
                    const stepConfig = steps.find((step) => step.id === id);
                    if (!stepConfig) {
                        return;
                    }
                    const isPassed = state.percent >= stepConfig.threshold;
                    el.classList.toggle('is-active', isPassed);
                    el.classList.toggle('is-current', currentStep.id === id);
                });
            }
        });
    }

    function waitForProgress() {
        if (window.ProgrammingLessonsProgress) {
            init(window.ProgrammingLessonsProgress);
        } else {
            document.addEventListener('programming-lessons-progress-update', function handleReady() {
                if (window.ProgrammingLessonsProgress) {
                    init(window.ProgrammingLessonsProgress);
                    document.removeEventListener('programming-lessons-progress-update', handleReady);
                }
            });
        }
    }

    waitForProgress();
})();
</script>
