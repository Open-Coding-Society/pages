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
    --p4-bg-start: #18144d;
    --p4-bg-end: #0a0524;
    --p4-card-bg: rgba(16, 12, 48, 0.78);
    --p4-border: rgba(82, 64, 196, 0.45);
    --p4-highlight: #6655ff;
    --p4-highlight-soft: rgba(102, 85, 255, 0.58);
    --p4-accent: #2d9bff;
    --p4-text-primary: #f2f5ff;
    --p4-text-secondary: rgba(225, 229, 255, 0.78);
    --p4-text-muted: rgba(200, 205, 242, 0.65);
    --p4-shadow: 0 22px 40px rgba(14, 9, 43, 0.55);
    --p4-radius-lg: 32px;
    --p4-radius-md: 18px;
    --p4-radius-sm: 12px;
    --p4-transition: 220ms ease;
}

.p4-wrapper {
    position: relative;
    margin: 0 auto;
    padding: 48px clamp(16px, 4vw, 56px);
    border-radius: var(--p4-radius-lg);
    background: radial-gradient(110% 150% at 50% 0%, rgba(102, 85, 255, 0.55) 0%, rgba(22, 16, 64, 0.92) 43%, rgba(6, 4, 18, 0.95) 100%);
    color: var(--p4-text-primary);
    box-shadow: var(--p4-shadow);
    overflow: hidden;
}

.p4-wrapper::after {
    content: "";
    position: absolute;
    inset: -120px -220px auto -80px;
    height: 360px;
    background: radial-gradient(40% 40% at 30% 30%, rgba(102, 85, 255, 0.38) 0%, rgba(102, 85, 255, 0) 100%);
    opacity: 0.7;
    z-index: 0;
    pointer-events: none;
}

.p4-wrapper > * {
    position: relative;
    z-index: 1;
}

.p4-hero {
    display: grid;
    gap: 32px;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    align-items: center;
    margin-bottom: 48px;
}

.p4-hero-left {
    display: flex;
    flex-direction: column;
    gap: 28px;
}

.p4-stepper {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    padding: 14px 18px;
    border-radius: 999px;
    background: rgba(20, 14, 58, 0.7);
    border: 1px solid rgba(109, 95, 255, 0.3);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.p4-stepper span {
    position: relative;
    padding: 10px 24px 10px 22px;
    border-radius: 999px;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: var(--p4-text-muted);
    border: 1px solid transparent;
    background: linear-gradient(135deg, rgba(34, 28, 88, 0.65), rgba(18, 14, 64, 0.65));
    transition: var(--p4-transition);
}

.p4-stepper span::after {
    content: "";
    position: absolute;
    right: -12px;
    top: 50%;
    width: 20px;
    height: 2px;
    background: rgba(110, 123, 255, 0.4);
    transform: translateY(-50%);
}

.p4-stepper span:last-child::after {
    display: none;
}

.p4-stepper span.is-active {
    color: #fff;
    border-color: rgba(110, 123, 255, 0.65);
    box-shadow: 0 0 16px rgba(110, 123, 255, 0.35);
    background: linear-gradient(135deg, rgba(93, 76, 255, 0.95), rgba(55, 122, 255, 0.95));
}

.p4-stepper span.is-current {
    transform: translateY(-2px);
}

.p4-period-badge {
    width: fit-content;
    padding: 6px 16px;
    border-radius: 999px;
    font-size: 0.9rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: rgba(192, 210, 255, 0.85);
    background: rgba(39, 33, 110, 0.65);
    border: 1px solid rgba(110, 107, 255, 0.3);
}

.p4-hero h1 {
    margin: 14px 0 12px;
    font-size: clamp(2.2rem, 4vw, 3.1rem);
    letter-spacing: 0.04em;
    text-shadow: 0 10px 30px rgba(44, 39, 112, 0.7);
}

.p4-hero p {
    max-width: 600px;
    font-size: 1.05rem;
    line-height: 1.7;
    color: var(--p4-text-secondary);
}

.p4-progress-card {
    justify-self: end;
    width: min(280px, 70vw);
    padding: 26px 24px;
    border-radius: var(--p4-radius-md);
    background: rgba(17, 13, 55, 0.78);
    border: 1px solid rgba(114, 100, 255, 0.35);
    box-shadow: 0 30px 45px rgba(9, 4, 30, 0.55);
    text-align: center;
}

.p4-progress-meter {
    position: relative;
    margin: 0 auto 20px;
    width: 96px;
    height: 240px;
    border-radius: 48px;
    padding: 6px;
    background: linear-gradient(160deg, rgba(76, 63, 222, 0.45), rgba(33, 21, 86, 0.92));
    border: 1px solid rgba(110, 123, 255, 0.35);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.p4-progress-track {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 42px;
    background: rgba(10, 7, 32, 0.72);
    overflow: hidden;
}

.p4-progress-fill {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 0;
    border-radius: 42px 42px 12px 12px;
    background: linear-gradient(180deg, rgba(125, 95, 255, 0.12) 0%, rgba(91, 122, 255, 0.32) 18%, rgba(54, 134, 255, 0.68) 56%, rgba(41, 122, 255, 0.92) 100%);
    box-shadow: 0 -10px 20px rgba(95, 122, 255, 0.35);
    transition: height 360ms ease;
}

.p4-progress-value {
    display: inline-block;
    margin-bottom: 6px;
    font-size: 2.2rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: #fff;
    text-shadow: 0 12px 24px rgba(29, 79, 198, 0.45);
}

[data-progress-message] {
    font-size: 0.98rem;
    line-height: 1.5;
    color: var(--p4-text-secondary);
}

.p4-info-grid {
    display: grid;
    gap: 22px;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    margin-bottom: 42px;
}

.p4-card {
    padding: 28px;
    border-radius: var(--p4-radius-md);
    background: var(--p4-card-bg);
    border: 1px solid var(--p4-border);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03), 0 22px 32px rgba(8, 5, 25, 0.42);
}

.p4-card h2 {
    margin-top: 0;
    margin-bottom: 14px;
    font-size: 1.5rem;
}

.p4-card h3 {
    margin-top: 18px;
    margin-bottom: 12px;
    font-size: 1.15rem;
    color: var(--p4-accent);
}

.p4-card ul {
    margin: 0;
    padding-left: 18px;
    color: var(--p4-text-secondary);
}

.p4-card ul li + li {
    margin-top: 8px;
}

.p4-lesson-section {
    margin-bottom: 48px;
}

.p4-lesson-section header {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 24px;
}

.p4-lesson-section h2 {
    margin: 0;
    font-size: 1.8rem;
}

.p4-lesson-section p {
    margin: 0;
    color: var(--p4-text-muted);
}

.p4-lesson-groups {
    display: grid;
    gap: 20px;
}

.p4-module-card {
    padding: 24px 24px 20px;
    border-radius: var(--p4-radius-md);
    background: rgba(18, 13, 52, 0.78);
    border: 1px solid rgba(102, 85, 255, 0.2);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.02), 0 12px 22px rgba(11, 6, 31, 0.4);
}

.p4-module-header {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 18px;
}

.p4-module-header h3 {
    margin: 0;
    font-size: 1.25rem;
}

.p4-module-count {
    font-size: 0.95rem;
    color: rgba(179, 191, 255, 0.75);
}

.p4-lessons-list {
    display: grid;
    gap: 10px;
}

.p4-lesson-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 16px;
    border-radius: var(--p4-radius-sm);
    background: rgba(10, 7, 32, 0.72);
    border: 1px solid rgba(72, 62, 162, 0.45);
    transition: var(--p4-transition);
}

.p4-lesson-item.is-locked {
    opacity: 0.55;
    border-style: dashed;
    cursor: not-allowed;
}

.p4-lesson-item.is-locked .p4-lesson-link {
    pointer-events: none;
    color: var(--p4-text-muted);
}

.p4-lesson-item.is-locked input[type="checkbox"] {
    cursor: not-allowed;
}

.p4-lesson-item:hover {
    transform: translateY(-1px);
    border-color: rgba(131, 152, 255, 0.7);
    box-shadow: 0 10px 22px rgba(16, 28, 88, 0.35);
}

.p4-lesson-item input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: var(--p4-highlight);
}

.p4-lesson-title {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.p4-lesson-title span:first-child {
    font-weight: 600;
    color: #fff;
}

.p4-lesson-title span:last-child {
    font-size: 0.9rem;
    color: var(--p4-text-muted);
}

.p4-lesson-link {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--p4-accent);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.p4-lesson-link:hover {
    color: #7ab0ff;
}

.p4-lesson-link.is-locked {
    pointer-events: none;
    color: var(--p4-text-muted);
}

.p4-lesson-link svg {
    width: 16px;
    height: 16px;
}

@media (max-width: 720px) {
    .p4-wrapper {
        padding: 36px 20px 42px;
    }
    .p4-stepper {
        justify-content: center;
    }
    .p4-progress-card {
        justify-self: stretch;
    }
}
</style>

<div class="p4-wrapper">
    <section class="p4-hero">
        <div class="p4-hero-left">
            <nav class="p4-stepper" data-stepper>
                <span data-step="start">Start</span>
                <span data-step="learn">Learn</span>
                <span data-step="practice">Practice</span>
                <span data-step="quiz">Quiz</span>
                <span data-step="victory">Victory!</span>
            </nav>
            <div>
                <div class="p4-period-badge">Fall 2024 &ndash; Period 4</div>
                <h1>Big Idea 3: Programming Fundamentals</h1>
                <p>
                    Track every lesson in the Period 4 pathway for Big Idea 3. Move through fundamentals at your own pace,
                    mark lessons as complete, and watch your progress light up as you head toward Victory!
                </p>
            </div>
        </div>
        <aside class="p4-progress-card">
            <div class="p4-progress-meter">
                <div class="p4-progress-track">
                    <div class="p4-progress-fill" data-progress-fill></div>
                </div>
            </div>
            <div class="p4-progress-value" data-progress-value>0%</div>
            <div data-progress-message>Check off a lesson to begin your journey.</div>
        </aside>
    </section>

    <section class="p4-info-grid">
        <article class="p4-card">
            <h2>What You Will Learn</h2>
            <h3>Part 1 &mdash; Fundamentals (This Unit)</h3>
            <ul>
                <li>3.1 Variables</li>
                <li>3.2 Data Abstraction</li>
                <li>3.3 Mathematical Expressions</li>
                <li>3.4 Strings</li>
                <li>3.5 Booleans</li>
                <li>3.6 Conditionals</li>
                <li>3.7 Nested Conditionals</li>
                <li>3.8 Iteration</li>
                <li>3.10 Lists</li>
            </ul>
            <h3>Part 2 &mdash; Core Concepts (Next Unit)</h3>
            <ul>
                <li>3.9 Developing Algorithms</li>
                <li>3.11 Search</li>
                <li>3.12 Calling Procedures</li>
                <li>3.13 Developing Procedures &amp; Procedural Abstraction</li>
                <li>3.14 Libraries</li>
                <li>3.15 Random Values</li>
                <li>3.16 Simulations</li>
                <li>3.17 Algorithmic Efficiency</li>
                <li>3.18 Undecidable Problems</li>
            </ul>
        </article>
        <article class="p4-card">
            <h2>Why It Matters</h2>
            <p>
                Algorithmic thinking is the backbone of the Create Performance Task and every technical project you build
                this year. These lessons fuel the skills you will use for full-stack development, data science, and the
                AP exam.
            </p>
            <p>
                As you work, connect each concept back to real projects. The more often you apply these fundamentals, the
                more confident you will be on assessments and when building your own software.
            </p>
        </article>
        <article class="p4-card">
            <h2>How to Stay Sharp</h2>
            <ul>
                <li>Review new vocabulary before diving into code cells.</li>
                <li>Experiment inside Jupyter notebooks and push beyond the sample hacks.</li>
                <li>Reflect in your blog about wins, blockers, and how you solved them.</li>
                <li>Ask questions early and pair up to debug complex problems.</li>
            </ul>
        </article>
    </section>

    <section class="p4-lesson-section">
        <header>
            <h2>Lesson Progress Tracker</h2>
            <p>Mark lessons as complete to build momentum and unlock the next stage.</p>
        </header>
        <div id="p4-lessons-root" class="p4-lesson-groups" data-lessons-root></div>
    </section>

    <section class="p4-card">
        <h2>Key Terms to Know</h2>
        <ul>
            <li><strong>Algorithm</strong>: A step-by-step procedure for solving a problem or performing a task.</li>
            <li><strong>Pseudocode</strong>: A way to describe algorithms using a mixture of natural language and programming elements.</li>
            <li><strong>College Board Pseudocode</strong>: The AP Exam language for describing programming logic.</li>
            <li><strong>Debugging</strong>: The process of finding and fixing errors in a program.</li>
            <li><strong>Debugger</strong>: A tool that allows developers to step through code and inspect variables.</li>
            <li><strong>Control Structures</strong>: Constructs that control the flow of execution (loops, conditionals, etc.).</li>
        </ul>
    </section>

    <section class="p4-card">
        <h2>Resource</h2>
        <p>For official AP CSP guidance, visit the <a class="p4-lesson-link" href="https://apstudents.collegeboard.org/courses/ap-computer-science-principles" target="_blank" rel="noopener">College Board AP CSP page <svg viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M15.5 15.5h-11v-11H10V3h-5.5A1.5 1.5 0 003 4.5v11A1.5 1.5 0 004.5 17h11a1.5 1.5 0 001.5-1.5V10h-1.5v5.5zM12 3v1.5h2.79L9 10.29l1.21 1.21L16 5.71V8.5h1.5V3H12z"></path></svg></a>.</p>
    </section>
</div>

<script>
(function() {
    const root = document.querySelector('[data-lessons-root]');
    if (!root) {
        return;
    }

    const stepper = document.querySelector('[data-stepper]');
    const fillEl = document.querySelector('[data-progress-fill]');
    const valueEl = document.querySelector('[data-progress-value]');
    const messageEl = document.querySelector('[data-progress-message]');

    const steps = [
        { id: 'start', threshold: 0, message: 'Check off a lesson to begin your journey.' },
        { id: 'learn', threshold: 10, message: 'You are building momentum. Keep learning!' },
        { id: 'practice', threshold: 40, message: 'Time to practice and refine your understanding.' },
        { id: 'quiz', threshold: 70, message: 'Quiz yourself and lock in the concepts.' },
        { id: 'victory', threshold: 99, message: 'Victory! You mastered every lesson in this unit.' }
    ];

    function init(progress) {
        const modules = progress.getModules();
        if (!modules || !modules.length) {
            root.innerHTML = '<p style="color: rgba(200, 205, 242, 0.7);">Lessons will appear here once they are published.</p>';
            return;
        }

        root.innerHTML = '';
        const moduleMeta = [];
        const arrowIcon = '<svg viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M7.3 4.3l1.4-1.4 7.4 7.4-7.4 7.4-1.4-1.4 5.3-5.3-5.3-5.3z"/></svg>';

        modules.forEach((module) => {
            const card = document.createElement('article');
            card.className = 'p4-module-card';

            const header = document.createElement('header');
            header.className = 'p4-module-header';

            const heading = document.createElement('h3');
            heading.innerHTML = module.label;
            header.appendChild(heading);

            const count = document.createElement('span');
            count.className = 'p4-module-count';
            header.appendChild(count);

            card.appendChild(header);

            const list = document.createElement('div');
            list.className = 'p4-lessons-list';
            card.appendChild(list);

            const lessonMeta = [];

            module.lessons.forEach((lesson) => {
                const row = document.createElement('label');
                row.className = 'p4-lesson-item';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.dataset.lessonSlug = lesson.slug;
                row.appendChild(checkbox);

                const text = document.createElement('div');
                text.className = 'p4-lesson-title';
                const titleSpan = document.createElement('span');
                titleSpan.textContent = lesson.title;
                const slugSpan = document.createElement('span');
                slugSpan.textContent = lesson.slug.replace(/-/g, '.');
                text.appendChild(titleSpan);
                text.appendChild(slugSpan);
                row.appendChild(text);

                const link = document.createElement('a');
                link.className = 'p4-lesson-link';
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
