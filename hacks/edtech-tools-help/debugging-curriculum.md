---
layout: opencs
title: Game Debugging Curriculum
description: Complete lesson materials for teaching game debugging with browser DevTools and the adventure game
permalink: /gamify/debugging-curriculum
categories: [CSSE, Game Development, Computer Science]
---

<style>
.curriculum-hero {
    background: linear-gradient(135deg, rgba(100,200,255,0.15), rgba(150,100,255,0.15));
    border: 2px solid rgba(100,200,255,0.3);
    padding: 40px;
    border-radius: 12px;
    margin-bottom: 40px;
    text-align: center;
}

.curriculum-title {
    font-size: 2.5em;
    font-weight: bold;
    color: #64b4ff;
    margin-bottom: 15px;
}

.curriculum-subtitle {
    font-size: 1.2em;
    color: var(--text);
    margin-bottom: 20px;
}

.quick-stats {
    display: flex;
    justify-content: center;
    gap: 30px;
    flex-wrap: wrap;
    margin-top: 20px;
}

.stat-item {
    text-align: center;
}

.stat-number {
    font-size: 2em;
    color: var(--ok);
    font-weight: bold;
}

.stat-label {
    font-size: 0.9em;
    color: var(--text);
}

.materials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin: 30px 0;
}

.material-card {
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(100,200,255,0.2);
    border-radius: 8px;
    padding: 20px;
    transition: all 0.3s;
}

.material-card:hover {
    background: rgba(100,200,255,0.1);
    border-color: rgba(100,200,255,0.5);
    transform: translateY(-2px);
}

.material-icon {
    font-size: 2.5em;
    margin-bottom: 10px;
}

.material-title {
    font-size: 1.2em;
    font-weight: bold;
    color: #64b4ff;
    margin-bottom: 10px;
}

.material-description {
    font-size: 0.9em;
    color: var(--text);
    line-height: 1.5;
    margin-bottom: 15px;
}

.material-link {
    display: inline-block;
    background: rgba(100,200,255,0.3);
    color: #fff;
    padding: 8px 16px;
    border-radius: 6px;
    text-decoration: none;
    font-weight: bold;
    font-size: 0.9em;
    transition: all 0.2s;
}

.material-link:hover {
    background: rgba(100,200,255,0.6);
}

.timeline-section {
    background: rgba(0,0,0,0.2);
    border-left: 4px solid var(--brand);
    padding: 20px;
    margin: 30px 0;
    border-radius: 8px;
}

.timeline-header {
    font-size: 1.3em;
    font-weight: bold;
    color: #64b4ff;
    margin-bottom: 20px;
}

.lesson-block {
    background: rgba(100,200,255,0.1);
    border: 1px solid rgba(100,200,255,0.2);
    padding: 15px;
    margin: 12px 0;
    border-radius: 6px;
}

.lesson-number {
    display: inline-block;
    background: rgba(100,200,255,0.3);
    color: #64b4ff;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.85em;
    font-weight: bold;
    margin-bottom: 8px;
}

.lesson-title {
    font-size: 1.1em;
    font-weight: bold;
    color: #fff;
    margin: 8px 0;
}

.lesson-time {
    font-size: 0.85em;
    color: var(--text);
}

.lesson-objectives {
    font-size: 0.9em;
    color: #ccc;
    margin-top: 8px;
    padding-left: 15px;
    border-left: 2px solid rgba(100,200,255,0.3);
}

.standards-section {
    background: rgba(150,100,150,0.1);
    border: 1px solid rgba(150,100,150,0.3);
    padding: 20px;
    border-radius: 8px;
    margin: 20px 0;
}

.standards-title {
    font-weight: bold;
    color: #d08fff;
    margin-bottom: 12px;
    font-size: 1.1em;
}

.standard-item {
    margin: 8px 0;
    padding-left: 15px;
    border-left: 2px solid rgba(150,100,150,0.3);
    font-size: 0.95em;
    color: #ccc;
}

.target-audience {
    background: rgba(100,200,100,0.1);
    border: 1px solid rgba(100,200,100,0.3);
    padding: 20px;
    border-radius: 8px;
    margin: 20px 0;
}

.audience-title {
    font-weight: bold;
    color: var(--ok);
    margin-bottom: 12px;
    font-size: 1.1em;
}

.audience-item {
    margin: 8px 0;
    padding-left: 15px;
    border-left: 2px solid rgba(100,200,100,0.3);
}

.resource-warning {
    background: rgba(255,150,100,0.15);
    border: 2px solid rgba(255,150,100,0.3);
    padding: 15px;
    border-radius: 6px;
    margin: 20px 0;
    color: #ffaa88;
}

.resource-warning strong {
    color: #ff8844;
}

.comparison-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin: 20px 0;
}

.comparison-card {
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(100,200,255,0.2);
    padding: 15px;
    border-radius: 6px;
}

.comparison-card-title {
    font-weight: bold;
    color: #64b4ff;
    margin-bottom: 10px;
    font-size: 1.05em;
}

.comparison-card-list {
    list-style-position: inside;
    margin: 8px 0;
    font-size: 0.9em;
    color: #ccc;
}

.comparison-card-list li {
    margin: 4px 0;
}

.cta-section {
    background: linear-gradient(135deg, rgba(100,200,255,0.15), rgba(150,100,255,0.15));
    border: 2px solid rgba(100,200,255,0.3);
    padding: 30px;
    border-radius: 12px;
    text-align: center;
    margin-top: 40px;
}

.cta-title {
    font-size: 1.5em;
    font-weight: bold;
    color: #64b4ff;
    margin-bottom: 15px;
}

.cta-button {
    display: inline-block;
    background: rgba(100,200,255,0.4);
    color: #fff;
    padding: 12px 28px;
    border-radius: 6px;
    text-decoration: none;
    font-weight: bold;
    font-size: 1.05em;
    transition: all 0.3s;
    margin: 8px;
}

.cta-button:hover {
    background: rgba(100,200,255,0.7);
    transform: translateY(-2px);
}

.cta-button.primary {
    background: rgba(100,255,100,0.4);
    color: #fff;
}

.cta-button.primary:hover {
    background: rgba(100,255,100,0.7);
}

@media (max-width: 768px) {
    .curriculum-hero {
        padding: 25px;
    }
    .curriculum-title {
        font-size: 1.8em;
    }
    .quick-stats {
        gap: 15px;
    }
    .comparison-grid {
        grid-template-columns: 1fr;
    }
}
</style>

<div class="curriculum-hero">
    <div class="curriculum-title"> Game Debugging Curriculum</div>
    <div class="curriculum-subtitle">Teaching Browser DevTools through the Adventure Game</div>
    <div class="quick-stats">
        <div class="stat-item">
            <div class="stat-number">4</div>
            <div class="stat-label">Lessons</div>
        </div>
        <div class="stat-item">
            <div class="stat-number">8-10</div>
            <div class="stat-label">Hours</div>
        </div>
        <div class="stat-item">
            <div class="stat-number">100%</div>
            <div class="stat-label">Hands-On</div>
        </div>
        <div class="stat-item">
            <div class="stat-number">CSSE</div>
            <div class="stat-label">Grade</div>
        </div>
    </div>
</div>

---

## 📚 Curriculum Overview

This comprehensive debugging curriculum teaches students how to use browser Developer Tools to understand, debug, and fix real game code. Through hands-on exploration of the adventure game, students learn professional debugging techniques they'll use in their entire programming careers.

### What Students Will Learn

 Open and navigate browser Developer Tools
 Execute JavaScript in the console to inspect game objects
 Use the Inspector to understand HTML structure
 Read and interpret error messages
 Set breakpoints and step through code execution
 Trace event-driven code flow (key presses → game responses)
 Debug and fix character interaction systems
 Verify fixes and test their solutions

---

##  Target Audience

<div class="target-audience">
<div class="audience-title">Who Should Use This?</div>

<div class="audience-item">
<strong>Primary:</strong> CSSE (Computer Science & Software Engineering) students, grades 9-12
</div>

<div class="audience-item">
<strong>Also suitable for:</strong> AP Computer Science Principles, general programming courses, game development clubs
</div>

<div class="audience-item">
<strong>Prerequisites:</strong> Basic JavaScript knowledge, understanding of functions and objects, familiarity with the adventure game
</div>
</div>

---

## 📖 Complete Materials

<div class="materials-grid">

<div class="material-card">
<div class="material-icon">🎬</div>
<div class="material-title">Main Debugging Guide</div>
<div class="material-description">
Comprehensive lesson covering console basics, element inspection, code understanding, breakpoints, and character interactions. Includes the mini-game challenge where students fix a broken NPC.
</div>
<a href="{{site.baseurl}}/gamify/debugging" class="material-link">→ View Guide</a>
</div>

<div class="material-card">
<div class="material-icon">📝</div>
<div class="material-title">Code Reference Guide</div>
<div class="material-description">
Deep dive into the NPC and Player classes. Explains how interactions work, shows common bugs, provides debugging commands, and includes a quiz to test understanding.
</div>
<a href="{{site.baseurl}}/hacks/edtech-tools-help/debug-code-reference" class="material-link">→ View Reference</a>
</div>

<div class="material-card">
<div class="material-icon"></div>
<div class="material-title">Interactive Challenge</div>
<div class="material-description">
Side-by-side game and console interface where students debug a broken NPC. Includes hints, step-by-step challenges, and verification system. Best used after Lessons 1-3.
</div>
<a href="{{site.baseurl}}/gamify/debug-npc-challenge" class="material-link">→ Start Challenge</a>
</div>

<div class="material-card">
<div class="material-icon">👨‍🏫</div>
<div class="material-title">Teacher's Guide</div>
<div class="material-description">
Complete lesson plans for all 4 lessons, assessment rubrics, differentiation strategies, common misconceptions, and classroom management tips.
</div>
<a href="{{site.baseurl}}/hacks/edtech-tools-help/debugging-teachers-guide" class="material-link">→ View Guide</a>
</div>

</div>

---

## 🕐 Lesson Sequence

<div class="timeline-section">
<div class="timeline-header">4-Day Unit (30-45 minutes per lesson)</div>

<div class="lesson-block">
<span class="lesson-number">LESSON 1</span>
<div class="lesson-title">Console Basics & Game Inspection</div>
<div class="lesson-time">⏱️ 25-30 minutes</div>
<div class="lesson-objectives">
• Open DevTools and the console
• Execute JavaScript commands
• Inspect game objects and properties
• Understand game architecture
</div>
</div>

<div class="lesson-block">
<span class="lesson-number">LESSON 2</span>
<div class="lesson-title">Code Structure & Interaction Flow</div>
<div class="lesson-time">⏱️ 30-35 minutes</div>
<div class="lesson-objectives">
• Use Inspector to view HTML structure
• Understand class-based code (NPC, Player)
• Trace the interaction pipeline
• Identify where initialization happens
</div>
</div>

<div class="lesson-block">
<span class="lesson-number">LESSON 3</span>
<div class="lesson-title">Breakpoints & Execution Control</div>
<div class="lesson-time">⏱️ 35-45 minutes</div>
<div class="lesson-objectives">
• Set breakpoints in the Sources tab
• Step through code (over, into, out)
• Inspect variables during execution
• Understand event-driven code flow
• Understand `.bind(this)` usage
</div>
</div>

<div class="lesson-block">
<span class="lesson-number">LESSON 4</span>
<div class="lesson-title">The Debugging Challenge</div>
<div class="lesson-time">⏱️ 40-50 minutes</div>
<div class="lesson-objectives">
• Apply all techniques to a real problem
• Identify and fix the broken NPC
• Verify the solution works
• Explain the debugging process
• Reflect on learning
</div>
</div>

</div>

---

## 📋 Standards Alignment

<div class="standards-section">

<div class="standards-title">AP Computer Science Principles</div>

<div class="standard-item">
<strong>Big Idea 4: Programming</strong> - Students will demonstrate how to program a solution that allows for the creation of virtual worlds, simulations, and games
</div>

<div class="standard-item">
<strong>Learning Objective 4.2:</strong> Program implementation requires robust code that handles errors gracefully
</div>

</div>

<div class="standards-section">

<div class="standards-title">CSTA Standards (Level 3A)</div>

<div class="standard-item">
Algorithms & Programming: Decompose problems into sub-problems to facilitate the design, implementation, and review of programs
</div>

<div class="standard-item">
Testing & Debugging: Evaluate and refine computational artifacts
</div>

</div>

---

## 🗂️ How to Use These Materials

### For Teachers

<div class="comparison-grid">

<div class="comparison-card">
<div class="comparison-card-title">📅 Full Unit (8-10 hours)</div>
<ul class="comparison-card-list">
<li>Day 1: Complete Lesson 1</li>
<li>Day 2: Complete Lesson 2</li>
<li>Day 3: Complete Lesson 3</li>
<li>Day 4: Complete Challenge</li>
<li>Optional: Extensions & projects</li>
</ul>
</div>

<div class="comparison-card">
<div class="comparison-card-title">⚡ Condensed (4-5 hours)</div>
<ul class="comparison-card-list">
<li>Combine Lessons 1-2 (single 50-min session)</li>
<li>Lesson 3 (40-45 min)</li>
<li>Challenge Session (40-50 min)</li>
<li>Skip detailed code analysis</li>
</ul>
</div>

</div>

### For Students

**The recommended path:**

1. **Start here:** [Main Debugging Guide]({{site.baseurl}}/gamify/debugging) - Read Parts 1-2
2. **Then study:** [Code Reference]({{site.baseurl}}/hacks/edtech-tools-help/debug-code-reference) - Deep dive into the game code
3. **Practice:** Work through the [Interactive Challenge]({{site.baseurl}}/gamify/debug-npc-challenge)
4. **Reflect:** Answer the reflection questions in Part 7 of the guide

---

## ⚙️ Technical Requirements

<div class="resource-warning">
<strong>Before starting:</strong> Verify these requirements are met
</div>

**Hardware:**
- One computer per student (or pair programming)
- Monitor/projector for teacher demos

**Software:**
- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Built-in browser DevTools (included in all modern browsers)
- No plugins or extensions required!

**Internet:**
- Access to https://pages.opencodingsociety.com (or your deployment)
- Sufficient bandwidth for game to load

**Skill Requirements:**
- Basic JavaScript understanding (functions, objects)
- Familiaritychanging with the adventure game (WASD movement, E to interact)
- Ability to use keyboard and mouse

---

## 🎓 Learning Outcomes

By the end of this curriculum, students will be able to:

### Knowledge
- ✓ Identify the three main DevTools panels (Console, Inspector, Sources)
- ✓ Explain what null, undefined, and error states mean
- ✓ Understand constructor functions and why initialization matters
- ✓ Describe how event listeners work in JavaScript

### Skills
- ✓ Execute console commands to inspect running programs
- ✓ Set breakpoints and step through code execution
- ✓ Use search/find to locate code in large projects
- ✓ Read error messages and interpret what went wrong
- ✓ Fix code bugs using console manipulation

### Practices
- ✓ Approach problems systematically rather than randomly
- ✓ Verify fixes and test solutions thoroughly
- ✓ Document bugs and solutions clearly
- ✓ Learn from errors rather than fear them

---

## 📊 Assessment

All materials include:

 **Formative assessments** - Exit tickets, check-your-understanding activities
 **Performance tasks** - The debugging challenge itself
 **Reflection prompts** - Self-assessment and metacognition
 **Scoring rubric** - Clear criteria for evaluating student work

See the [Teacher's Guide]({{site.baseurl}}/hacks/edtech-tools-help/debugging-teachers-guide) for detailed assessment rubrics.

---

##  Extensions & Next Steps

### For Advanced Students
- Create custom bugs in the game
- Trade bug-fixing challenges with peers
- Explore additional DevTools features (performance, network)
- Debug more complex game systems

### Real-World Applications
- Professional game development (Unity, Unreal plugins use same tools)
- Web development (React, Vue debugging)
- Software Quality Assurance (QA)
- Technical support and troubleshooting

---

## 🆘 Troubleshooting

### Game won't load?
- Clear browser cache (Ctrl+Shift+Del)
- Try incognito/private mode
- Check internet connection
- Wait 10-15 seconds for full load

### DevTools buttons don't appear?
- Refresh page after opening DevTools
- Try F12 or Ctrl+Shift+I
- Use right-click → Inspect Element

### Console commands fail?
- Wait for game to fully load (5+ seconds)
- Check for red errors first
- Verify your syntax matches example exactly
- Ask for help!

### NPC interaction doesn't work in game?
- Make sure you're next to the NPC (close!)
- Press 'E' key (not Enter)
- Check console for any red error messages
- In challenge: verify you haven't already fixed it!

---

## 💬 Feedback & Support

This curriculum is designed to be practical and low-barrier. If you have feedback:

1. **Document the issue:** What didn't work? What would be better?
2. **Share findings:** Other teachers benefit from your experience
3. **Iterate together:** Debugging is collaborative!

---

<div class="cta-section">
<div class="cta-title">Ready to Get Started?</div>

<div style="margin-top: 20px;">
    <a href="{{site.baseurl}}/gamify/debugging" class="cta-button primary">📖 Start with Main Guide</a>
    <a href="{{site.baseurl}}/hacks/edtech-tools-help/debugging-teachers-guide" class="cta-button">👨‍🏫 See Teacher's Guide</a>
</div>

<div style="margin-top: 20px; font-size: 0.95em; color: var(--text);">
Students: Jump straight to the <a href="{{site.baseurl}}/gamify/debugging">guide</a>
<br>
Teachers: Start with the <a href="{{site.baseurl}}/hacks/edtech-tools-help/debugging-teachers-guide">teacher's guide</a> for lesson plans
<br>
Advanced? Try the <a href="{{site.baseurl}}/gamify/debug-npc-challenge">interactive challenge</a> after Lesson 3
</div>

</div>

---

## 📚 Additional Resources

- [MDN Web Docs: Browser DevTools](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Tools_and_setup/What_are_browser_developer_tools)
- [Chrome DevTools Official Documentation](https://developer.chrome.com/docs/devtools/)
- [JavaScript Console API Reference](https://developer.mozilla.org/en-US/docs/Web/API/Console)
- [Debugging Best Practices](https://developer.mozilla.org/en-US/docs/Learn_web_development_checklist#learn_the_technologies_needed_to_program_for_the_web)

---

**Version:** 1.0 | **Last Updated:** 2025 | **Target Grade:** CSSE (9-12)
