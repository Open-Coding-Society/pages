---
layout: cs-portfolio-lesson
title: "Submodule 6"
description: "Submodule 6 of Resume Building Mini-Quest"
permalink: /cs-portfolio-quest/resume/submodule_6/
parent: "Resume Building"
team: "Grinders"
submodule: 6
categories: [CSP, Submodule, ResumeBuilding]
tags: [resume, submodule, grinders]
author: "Grinders Team"
date: 2025-10-29
---

<html lang="en">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interview Preparation with ELIO</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <style>
        .video-container {
            position: relative;
            background: #000;
            aspect-ratio: 16/9;
        }
        #videoElement, #playbackVideo {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .recording-indicator {
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(255, 0, 0, 0.9);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            display: none;
            align-items: center;
            gap: 8px;
            animation: pulse 1.5s ease-in-out infinite;
        }
        .recording-indicator.active {
            display: flex;
        }
        .recording-dot {
            width: 10px;
            height: 10px;
            background: white;
            border-radius: 50%;
            animation: blink 1s infinite;
        }        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
        }
        .timer {
            position: absolute;
            top: 10px;
            left: 10px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            display: none;
        }
        .timer.active {
            display: block;
        }
        .elio-container {
            background: transparent;
            border-radius: 15px;
            padding: 20px;
        }
        .elio-avatar {
            perspective: 1000px;
            width: 150px;
            height: 150px;
            margin: 0 auto 20px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .elio-bot {
            --ELIO-ROTATION-DURATION: 4s;
            transform-style: preserve-3d;
            animation: rotateRight var(--ELIO-ROTATION-DURATION) linear infinite alternate;
        }
        .elio-head {
            position: relative;
            width: 4rem;
            height: 2.5rem;
            border-radius: 48% 53% 45% 55% / 79% 79% 20% 22%;
            background: linear-gradient(to right, white 45%, gray);
        }
        .elio-eyeChamber {
            width: 3rem;
            height: 1.8rem;
            position: relative;
            left: 50%;
            top: 55%;
            border-radius: 45% 53% 45% 48% / 62% 59% 35% 34%;
            background-color: #0c203c;
            box-shadow: 0px 0px 2px 2px white, inset 0px 0px 0px 2px black;
            transform: translate(-50%, -50%);
            animation: moveRight var(--ELIO-ROTATION-DURATION) linear infinite alternate;
        }
        .elio-eye {
            width: 0.8rem;
            height: 1rem;
            position: absolute;
            border-radius: 50%;
        }
        .elio-eye:first-child {
            left: 8px;
            top: 50%;
            background: repeating-linear-gradient(65deg, #9bdaeb 0px, #9bdaeb 1px, white 2px);
            box-shadow: inset 0px 0px 5px #04b8d5, 0px 0px 15px 1px #0bdaeb;
            transform: translate(0, -50%) rotate(-65deg);
        }
        .elio-eye:nth-child(2) {
            right: 8px;
            top: 50%;
            background: repeating-linear-gradient(-65deg, #9bdaeb 0px, #9bdaeb 1px, white 2px);
            box-shadow: inset 0px 0px 5px #04b8d5, 0px 0px 15px 1px #0bdaeb;
            transform: translate(0, -50%) rotate(65deg);
        }
        .elio-body {
            width: 4rem;
            height: 5rem;
            position: relative;
            margin-block-start: 0.15rem;
            border-radius: 47% 53% 45% 55% / 12% 9% 90% 88%;
            background: linear-gradient(to right, white 35%, gray);
        }
        .elio-hand {
            position: absolute;
            left: -1rem;
            top: 0.5rem;
            width: 1.3rem;
            height: 3.5rem;
            border-radius: 40%;
            background: linear-gradient(to left, white 15%, gray);
            box-shadow: 5px 0px 5px rgba(0, 0, 0, 0.25);
            transform: rotateY(55deg) rotateZ(10deg);
        }
        .elio-hand:first-child {
            animation: compensateRotation var(--ELIO-ROTATION-DURATION) linear infinite alternate;
        }
        .elio-hand:nth-child(2) {
            left: 92%;
            background: linear-gradient(to right, white 15%, gray);
            transform: rotateY(55deg) rotateZ(-10deg);
            animation: compensateRotationRight var(--ELIO-ROTATION-DURATION) linear infinite alternate;
        }
        .elio-scanner {
            width: 0;
            height: 0;
            position: absolute;
            left: 60%;
            top: 10%;
            border-top: 120px solid #9bdaeb;
            border-left: 150px solid transparent;
            border-right: 150px solid transparent;
            transform-origin: top left;
            mask: linear-gradient(to right, white, transparent 35%);
            display: none;
        }
        .elio-scanner.active {
            display: block;
            animation: glow 2s cubic-bezier(0.86, 0, 0.07, 1) infinite;
        }
        .elio-scannerOrigin {
            position: absolute;
            width: 6px;
            aspect-ratio: 1;
            border-radius: 50%;
            left: 60%;
            top: 10%;
            background: #9bdaeb;
            box-shadow: inset 0px 0px 5px rgba(0, 0, 0, 0.5);
            animation: moveRight var(--ELIO-ROTATION-DURATION) linear infinite;
            display: none;
        }
        .elio-scannerOrigin.active {
            display: block;
        }
        @keyframes rotateRight {
            from { transform: rotateY(0deg); }
            to { transform: rotateY(25deg); }
        }
        @keyframes moveRight {
            from { transform: translate(-50%, -50%); }
            to { transform: translate(-40%, -50%); }
        }
        @keyframes compensateRotation {
            from { transform: rotateY(55deg) rotateZ(10deg); }
            to { transform: rotatey(30deg) rotateZ(10deg); }
        }
        @keyframes compensateRotationRight {
            from { transform: rotateY(55deg) rotateZ(-10deg); }
            to { transform: rotateY(70deg) rotateZ(-10deg); }
        }
        .question-box {
            background: rgba(102, 126, 234, 0.1);
            border: 2px solid #667eea;
            border-radius: 10px;
            padding: 20px;
            min-height: 100px;
        }
    </style>
    <div class="max-w-4xl mx-auto p-4">
        <h1 class="text-3xl font-bold mb-2 text-center text-white">Complete Interview Preparation Guide</h1>
        <p class="text-gray-400 mb-6 text-center">Master every aspect of interviewing, then practice with ELIO</p>
        <!-- Progress Bar -->
        <div class="border border-gray-700 rounded p-3 mb-6 bg-gray-800">
            <div class="flex justify-between text-sm mb-2 text-gray-300">
                <span>Progress</span><span id="progressLabel">Section 1 / 10</span>
            </div>
            <div class="w-full bg-gray-700 rounded h-2">
                <div id="progressBar" class="bg-blue-600 h-2 rounded transition-all" style="width:10%"></div>
            </div>
        </div>
        <!-- SECTION 1: INTERVIEW MINDSET -->
        <section data-step="0" class="bg-gray-800 rounded-lg shadow p-6 mb-4 border border-gray-700">
            <h2 class="text-2xl font-semibold mb-4 text-white">1. Interview Mindset</h2>
            <p class="mb-4 text-gray-300">Interviews are conversations, not interrogations. The interviewer wants you to succeed. Remember: pausing to think shows thoughtfulness, not weakness.</p>
            <div class="bg-gray-700 p-4 rounded mb-4">
                <h3 class="font-semibold mb-2 text-white">Key Principles:</h3>
                <ul class="list-disc list-inside space-y-2 text-gray-300">
                    <li>It's okay to say "Let me think about that for a moment"</li>
                    <li>Ask clarifying questions - it shows critical thinking</li>
                    <li>Be authentic - don't try to be someone you're not</li>
                    <li>Focus on the conversation, not perfection</li>
                </ul>
            </div>
            <div class="mb-4">
                <h3 class="font-semibold mb-2 text-white">Watch: Interview Mindset Tips</h3>
                <div class="bg-gray-700 rounded p-8 text-center text-gray-400">
                    [YouTube Video Placeholder - Interview Mindset]
                    <br>Embed URL here
                </div>
            </div>
            <label class="block font-medium mb-2 text-white">Your Reflection:</label>
            <textarea id="mindset" rows="4" class="w-full border border-gray-600 bg-gray-700 text-white rounded px-3 py-2" placeholder="What mindset will you bring to your next interview?"></textarea>
        </section>
        <!-- SECTION 2: VOCAL TONE & PACING -->
        <section data-step="1" class="bg-gray-800 rounded-lg shadow p-6 mb-4 border border-gray-700">
            <h2 class="text-2xl font-semibold mb-4">2. Vocal Tone & Pacing</h2>
            <p class="mb-4">Your voice conveys confidence. Speak clearly, at a moderate pace, with varied tone to maintain engagement.</p>
            <div class="bg-gray-700 p-4 rounded mb-4">
                <h3 class="font-semibold mb-2 text-white">Best Practices:</h3>
                <ul class="list-disc list-inside space-y-2 text-gray-300">
                    <li><strong>Volume:</strong> Speak loud enough to be heard clearly</li>
                    <li><strong>Pace:</strong> Not too fast (anxious) or too slow (uncertain)</li>
                    <li><strong>Tone:</strong> Vary your pitch - avoid monotone</li>
                    <li><strong>Pauses:</strong> Use strategic pauses for emphasis</li>
                    <li><strong>Signposting:</strong> "First... Second... Finally..."</li>
                </ul>
            </div>
            <div class="mb-4">
                <h3 class="font-semibold mb-2 text-white">Watch: Vocal Communication Skills</h3>
                <div class="bg-gray-700 rounded p-8 text-center text-gray-400">
                    [YouTube Video Placeholder - Vocal Tone]
                    <br>Embed URL here
                </div>
            </div>
            <label class="block font-medium mb-2 text-white">Your Notes:</label>
            <textarea id="toneNotes" rows="4" class="w-full border border-gray-600 bg-gray-700 text-white rounded px-3 py-2" placeholder="What will you focus on improving?"></textarea>
        </section>
        <!-- SECTION 3: BODY LANGUAGE -->
        <section data-step="2" class="bg-gray-800 rounded-lg shadow p-6 mb-4 border border-gray-700">
            <h2 class="text-2xl font-semibold mb-4">3. Body Language Mastery</h2>
            <p class="mb-4">Non-verbal communication can make or break an interview. Your body language should convey confidence and engagement.</p>
            <div class="grid md:grid-cols-2 gap-4 mb-4">
                <div class="bg-gray-700 p-4 rounded">
                    <h3 class="font-semibold mb-2 text-white">✓ Do:</h3>
                    <ul class="list-disc list-inside space-y-1 text-sm">
                        <li>Maintain eye contact (70-80% of time)</li>
                        <li>Sit up straight, lean slightly forward</li>
                        <li>Use hand gestures naturally</li>
                        <li>Smile genuinely</li>
                        <li>Keep arms uncrossed and open</li>
                        <li>Nod to show understanding</li>
                    </ul>
                </div>
                <div class="bg-gray-700 p-4 rounded">
                    <h3 class="font-semibold mb-2 text-white">✗ Don't:</h3>
                    <ul class="list-disc list-inside space-y-1 text-sm">
                        <li>Fidget or tap nervously</li>
                        <li>Cross arms defensively</li>
                        <li>Look at phone or around room</li>
                        <li>Slouch or lean back too far</li>
                        <li>Touch face excessively</li>
                        <li>Rock back and forth</li>
                    </ul>
                </div>
            </div>
            <div class="mb-4">
                <h3 class="block font-medium mb-2 text-white">Watch: Body Language in Interviews</h3>
                <div class="bg-gray-700 rounded p-8 text-center text-gray-400">
                    [YouTube Video Placeholder - Body Language]
                    <br>Embed URL here
                </div>
            </div>
            <label class="block font-medium mb-2 text-white">Two Improvements You'll Try:</label>
            <textarea id="bodyNotes" rows="4" class="w-full border border-gray-600 bg-gray-700 text-white rounded px-3 py-2" placeholder="e.g., maintain better eye contact, stop fidgeting with pen"></textarea>
        </section>
        <!-- SECTION 4: THE STAR METHOD -->
        <section data-step="3" class="bg-gray-800 rounded-lg shadow p-6 mb-4 border border-gray-700">
            <h2 class="text-2xl font-semibold mb-4 text-white">4. The STAR Method</h2>
            <p class="mb-4 text-white">Structure your answers to behavioral questions using STAR: Situation, Task, Action, Result.</p>
            <div class="bg-gray-700 p-4 rounded mb-4">
                <div class="space-y-3">
                    <div>
                        <strong class="text-white">S - Situation:</strong> Set the context (1-2 sentences)
                    </div>
                    <div>
                        <strong class="text-white">T - Task:</strong> What was your responsibility?
                    </div>
                    <div>
                        <strong class="text-white">A - Action:</strong> What did YOU specifically do?
                    </div>
                    <div>
                        <strong class="text-white">R - Result:</strong> What was the outcome? (Include metrics if possible)
                    </div>
                </div>
            </div>
            <div class="bg-gray-700 p-4 rounded mb-4">
                <h3 class="font-semibold mb-2 text-white">Example:</h3>
                <p class="text-sm text-white"><strong>Q: Tell me about a time you solved a difficult problem.</strong></p>
                <p class="text-sm mt-2 text-white"><strong>S:</strong> During my robotics competition, our robot kept failing the autonomous phase.</p>
                <p class="text-sm text-white"><strong>T:</strong> As the lead programmer, I needed to debug and fix the issue before competition day.</p>
                <p class="text-sm text-white"><strong>A:</strong> I systematically tested each sensor, found a calibration error, and rewrote the positioning algorithm.</p>
                <p class="text-sm text-white"><strong>R:</strong> We placed 2nd in regionals, improving our autonomous score by 40%.</p>
            </div>
            <div class="mb-4">
                <h3 class="font-semibold mb-2 text-white">Watch: STAR Method Explained</h3>
                <div class="bg-gray-700 rounded p-8 text-center text-white">
                    [YouTube Video Placeholder - STAR Method]
                    <br>Embed URL here
                </div>
            </div>
            <label class="block font-medium mb-2 text-white">Your STAR Example:</label>
            <textarea id="starExample" rows="6" class="w-full border border-gray-600 bg-gray-700 text-white rounded px-3 py-2" placeholder="Write a STAR answer for: 'Tell me about a time you worked in a team'"></textarea>
        </section>
        <!-- SECTION 5: COMMON QUESTIONS -->
        <section data-step="4" class="bg-gray-800 rounded-lg shadow p-6 mb-4 border border-gray-700">
            <h2 class="text-2xl font-semibold mb-4 text-white">5. Common Interview Questions</h2>
            <p class="mb-4 text-gray-300">Prepare answers for these frequently asked questions.</p>
            <div class="space-y-4 mb-4">
                <div class="border-l-4 border-blue-500 pl-4">
                    <p class="font-semibold mb-2 text-white">"Tell me about yourself"</p>
                    <p class="text-sm text-gray-600">30-60 second pitch: Present → Academic interests → Key projects → Future goals</p>
                </div>
                <div class="border-l-4 border-blue-500 pl-4">
                    <p class="font-semibold mb-2 text-white">"Why do you want this position/internship?"</p>
                    <p class="text-sm text-gray-600">Research the company + Align with your interests + Specific examples</p>
                </div>
                <div class="border-l-4 border-blue-500 pl-4">
                    <p class="font-semibold">"What's your greatest strength/weakness?"</p>
                    <p class="text-sm text-gray-600">Strength: Relevant skill + Example | Weakness: Real but improving + Action taken</p>
                </div>
                <div class="border-l-4 border-blue-500 pl-4">
                    <p class="font-semibold">"Tell me about a challenge you overcame"</p>
                    <p class="text-sm text-gray-600">Use STAR method - focus on your actions and learning</p>
                </div>
            </div>
            <div class="mb-4">
                <h3 class="font-semibold mb-2">Watch: Answering Common Questions</h3>
                <div class="bg-gray-700 rounded p-8 text-center text-gray-500">
                    [YouTube Video Placeholder - Common Questions]
                    <br>Embed URL here
                </div>
            </div>
            <label class="block font-medium mb-2 text-white">Draft Your "Tell Me About Yourself":</label>
            <textarea id="aboutYourself" rows="5" class="w-full border border-gray-600 bg-gray-700 text-white rounded px-3 py-2" placeholder="Write your 60-second pitch..."></textarea>
        </section>
        <!-- SECTION 6: PROJECT DEMOS -->
        <section data-step="5" class="bg-gray-800 rounded-lg shadow p-6 mb-4 border border-gray-700">
            <h2 class="text-2xl font-semibold mb-4 text-white">6. Presenting Your Projects</h2>
            <p class="mb-4 text-gray-300">You have 60-90 seconds to make your project compelling. Follow this structure:</p>
            <div class="bg-gray-700 rounded p-8 text-center text-gray-400">
                <h3 class="font-semibold mb-2 white-text">Project Pitch Formula:</h3>
                <ol class="list-decimal list-inside space-y-2">
                    <li><strong>What:</strong> Project name and purpose (1 sentence)</li>
                    <li><strong>Why:</strong> Problem it solves (1 sentence)</li>
                    <li><strong>How:</strong> Tech stack and your role (2-3 sentences)</li>
                    <li><strong>Impact:</strong> Results, metrics, or learning (1-2 sentences)</li>
                </ol>
            </div>
            <div class="bg-gray-700 p-4 rounded mb-4">
                <h3 class="font-semibold mb-2 text-white">Example:</h3>
                <p class="text-sm">"I built SchoolHub, a student-teacher communication platform. Many students missed assignment updates, so I created a centralized system. Using React for the frontend and Firebase for real-time data, I implemented features like instant notifications and file sharing. As the solo developer, I handled everything from UI design to backend logic. The app is now used by 200+ students in my school, reducing missed assignments by 35%."</p>
            </div>
            <div class="mb-4">
                <h3 class="font-semibold mb-2">Watch: How to Demo Your Projects</h3>
                <div class="bg-gray-700 rounded p-8 text-center text-gray-400">
                    [YouTube Video Placeholder - Project Demos]
                    <br>Embed URL here
                </div>
            </div>
            <label class="block font-medium mb-2 text-white">Your Project Pitch (60-90 seconds):</label>
            <textarea id="projectPitch" rows="6" class="w-full border border-gray-600 bg-gray-700 text-white rounded px-3 py-2" placeholder="Write your project pitch using the formula above..."></textarea>
        </section>
        <!-- SECTION 7: TECHNICAL EXPLANATIONS -->
        <section data-step="6" class="bg-gray-800 rounded-lg shadow p-6 mb-4 border border-gray-700">
            <h2 class="text-2xl font-semibold mb-4 text-white">7. Explaining Technical Concepts</h2>
            <p class="mb-4 text-gray-300">You'll need to explain code, algorithms, or technical decisions. Make it simple and clear.</p>
            <div class="bg-gray-700 p-4 rounded mb-4">
                <h3 class="font-semibold mb-2 text-white">The "Explain to a 5th Grader" Rule:</h3>
                <ul class="list-disc list-inside space-y-2 text-gray-300">
                    <li>Start with the big picture, then dive into details</li>
                    <li>Use analogies: "It's like..." or "Think of it as..."</li>
                    <li>Avoid jargon unless necessary, then define it</li>
                    <li>Walk through your thought process step-by-step</li>
                    <li>Use your hands to gesture/visualize concepts</li>
                </ul>
            </div>
            <div class="bg-gray-700 p-4 rounded mb-4">
                <h3 class="font-semibold mb-2 text-white">Example: Explaining Recursion</h3>
                <p class="text-sm text-white"><strong>Bad:</strong> "Recursion is when a function calls itself with a base case to prevent infinite loops."</p>
                <p class="text-sm mt-2 text-white"><strong>Good:</strong> "Recursion is like Russian nesting dolls. Each doll opens to reveal a smaller doll inside, until you reach the tiniest one that doesn't open - that's your base case. In code, a function keeps calling itself with smaller problems until it hits that 'tiniest doll' and can finally give an answer."</p>
            </div>
            <div class="mb-4">
                <h3 class="font-semibold mb-2 text-white">Watch: Explaining Technical Concepts</h3>
                <div class="bg-gray-700 rounded p-8 text-center text-gray-400">
                    [YouTube Video Placeholder - Technical Explanations]
                    <br>Embed URL here
                </div>
            </div>
            <label class="block font-medium mb-2 text-white">Practice: Explain a concept you know well (e.g., loops, APIs, databases):</label>
            <textarea id="technicalExplanation" rows="5" class="w-full border border-gray-600 bg-gray-700 text-white rounded px-3 py-2" placeholder="Explain a technical concept using simple language and analogies..."></textarea>
        </section>
        <!-- SECTION 8: QUESTIONS TO ASK -->
        <section data-step="7" class="bg-gray-800 rounded-lg shadow p-6 mb-4 border border-gray-700">
            <h2 class="text-2xl font-semibold mb-4 text-white">8. Questions YOU Should Ask</h2>
            <p class="mb-4 text-gray-300">Asking thoughtful questions shows engagement and genuine interest. Always prepare 2-3 questions.</p>
            <div class="grid md:grid-cols-2 gap-4 mb-4 bg-gray-700 ">
                <div class="border p-4 rounded">
                    <h3 class="font-semibold mb-2 text-white">Great Questions:</h3>
                    <ul class="list-disc list-inside space-y-2 text-gray-300">
                        <li>"What does a typical day look like for someone in this role?"</li>
                        <li>"What's the team culture like?"</li>
                        <li>"What technologies will I be working with?"</li>
                        <li>"What's the biggest challenge facing your team right now?"</li>
                        <li>"How do you measure success for this position?"</li>
                        <li>"What opportunities are there for learning and growth?"</li>
                    </ul>
                </div>
                <div class="border p-4 rounded">
                    <h3 class="font-semibold mb-2 text-white">Avoid These:</h3>
                    <ul class="list-disc list-inside space-y-2 text-gray-300">
                        <li>"What does your company do?" (Research first!)</li>
                        <li>"How much does this pay?" (Wait for them to bring it up)</li>
                        <li>"How soon can I get promoted?"</li>
                        <li>"Do you check social media?" (Assume yes)</li>
                        <li>Anything easily found on their website</li>
                    </ul>
                </div>
            </div>
            <div class="mb-4">
                <h3 class="font-semibold mb-2 text-white">Watch: Smart Questions to Ask Interviewers</h3>
                <div class="bg-gray-700 rounded p-8 text-center text-gray-400">
                    [YouTube Video Placeholder - Questions to Ask]
                    <br>Embed URL here
                </div>
            </div>
            <label class="block font-medium mb-2 text-white">Your Prepared Questions (write 3):</label>
            <textarea id="questionsToAsk" rows="5" class="w-full border border-gray-600 bg-gray-700 text-white rounded px-3 py-2" placeholder="Write 3 thoughtful questions..."></textarea>
        </section>
        <!-- SECTION 9: HANDLING TOUGH QUESTIONS -->
        <section data-step="8" class="bg-gray-800 rounded-lg shadow p-6 mb-4 border border-gray-700">
            <h2 class="text-2xl font-semibold mb-4 text-white">9. Handling Difficult Questions</h2>
            <p class="mb-4 text-gray-300">Sometimes you'll face unexpected or challenging questions. Here's how to handle them gracefully.</p>
            <div class="space-y-4 mb-4">
                <div class="bg-gray-700 p-4 rounded mb-4">
                    <h3 class="font-semibold mb-2 text-white">If you don't know the answer:</h3>
                    <p class="text-sm">"That's a great question. I'm not familiar with [topic] yet, but here's how I would approach learning it..." OR "I don't know off the top of my head, but my approach would be to research [X] and [Y]."</p>
                </div>
                <div class="bg-gray-700 p-4 rounded mb-4">
                    <h3 class="font-semibold mb-2 text-white">If you need clarification:</h3>
                    <p class="text-sm">"Just to make sure I understand - are you asking about [restate question]?" This shows you're thoughtful and want to give the right answer.</p>
                </div>               
                <div class="bg-gray-700 p-4 rounded mb-4">
                    <h3 class="font-semibold mb-2 text-white">If you need time to think:</h3>
                    <p class="text-sm">"That's an interesting question. Let me think for a moment..." Then actually take 5-10 seconds to organize your thoughts.</p>
                </div>                
                <div class="bg-gray-700 p-4 rounded mb-4">
                    <h3 class="font-semibold mb-2 text-white">If asked about a weakness/failure:</h3>
                    <p class="text-sm">Be honest but brief. Focus more on what you learned and how you've improved. "I used to struggle with [X], so I [action taken], and now I [improvement]."</p>
                </div>
            </div>            
            <div class="mb-4">
                <h3 class="font-semibold mb-2 text-white">Watch: Navigating Tough Interview Questions</h3>
                <div class="bg-gray-700 rounded p-8 text-center text-gray-400">
                    [YouTube Video Placeholder - Tough Questions]
                    <br>Embed URL here
                </div>
            </div>            
            <label class="block font-medium mb-2 text-white">How will you handle a question you don't know?</label>
            <textarea id="toughQuestions" rows="4" class="w-full border border-gray-600 bg-gray-700 text-white rounded px-3 py-2" placeholder="Write your strategy..."></textarea>
        </section>
        <!-- SECTION 10: MOCK INTERVIEW WITH ELIO -->
        <section data-step="9" class="bg-gray-800 rounded-lg shadow p-6 mb-4 border border-gray-700">
            <h2 class="text-2xl font-semibold mb-4 text-white">10. Practice Interview with ELIO</h2>
            <p class="text-2xl  mb-4 text-white">Now it's time to put everything into practice! ELIO will conduct a mock interview with you.</p>           
            <div class="grid md:grid-cols-2 gap-4 bg-gray-800 ">
                <!-- ELIO Bot Section -->
                <div class="elio-container">
                    <div class="elio-avatar">
                        <div class="elio-bot">
                            <div class="elio-head">
                                <div class="elio-eyeChamber">
                                    <div class="elio-eye"></div>
                                    <div class="elio-eye"></div>
                                </div>
                            </div>
                            <div class="elio-body">
                                <div class="elio-hand"></div>
                                <div class="elio-hand"></div>
                                <div class="elio-scanner" id="elioScanner"></div>
                                <div class="elio-scannerOrigin" id="elioScannerOrigin"></div>
                            </div>
                        </div>
                    </div>
                    <h3 class="text-xl font-bold text-center mb-4" style="font-semibold mb-2 text-white">ELIO - AI Interview Coach</h3>                 
                    <div class="question-box mb-4">
                        <p id="elioQuestion" class="text-center font-medium">Click "Start Interview" to begin!</p>
                    </div>                    
                    <div class="flex flex-col gap-2">
                        <button id="startInterviewBtn" onclick="startELIOInterview()" class="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700">
                            Start Interview
                        </button>
                        <button id="nextQuestionBtn" onclick="nextQuestion()" class="bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 hidden">
                            Next Question
                        </button>
                        <button id="endInterviewBtn" onclick="endELIOInterview()" class="bg-red-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-600 hidden">
                            End Interview
                        </button>
                    </div>
                </div>                
                <!-- Video Recording Section -->
                <div>
                    <h3 class="text-lg font-semibold mb-2 text-center text-white">Your Video</h3>
                    <div class="video-container rounded-lg overflow-hidden mb-3">
                        <video id="videoElement" autoplay muted></video>
                        <video id="playbackVideo" controls style="display:none;"></video>                        
                        <div class="recording-indicator" id="recordingIndicator">
                            <div class="recording-dot"></div>
                            <span>REC</span>
                        </div>                        
                        <div class="timer" id="timer">00:00</div>                        
                        <div id="videoPlaceholder" class="absolute inset-0 flex items-center justify-center text-white text-center">
                            <div>
                                <div class="text-5xl mb-2">📹</div>
                                <div>Click "Start Recording" below</div>
                            </div>
                        </div>
                    </div>                    
                    <div class="flex flex-col gap-2">
                        <button id="startRecordingBtn" onclick="startRecording()" class="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700">
                            Start Recording
                        </button>
                        <button id="stopRecordingBtn" onclick="stopRecording()" class="bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 hidden">
                            Stop Recording
                        </button>
                        <button id="downloadBtn" onclick="downloadVideo()" class="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 hidden">
                            Download Video
                        </button>
                    </div>
                </div>
            </div>            
        </section>
        <!-- Navigation Buttons -->
        <div class="flex justify-between mt-6">
            <button id="prevBtn" class="px-6 py-3 bg-red-700 rounded-lg font-semibold hover:bg-red-400 text-white" disabled>
                Previous
            </button>
            <button id="nextBtn" class="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
                Next
            </button>
        </div>
    </div>
    <script>
        // Navigation Logic
        const steps = document.querySelectorAll('section[data-step]');
        let currentStep = 0;
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const progressBar = document.getElementById('progressBar');
        const progressLabel = document.getElementById('progressLabel');
        // Form field IDs for auto-save
        const fieldIds = ["mindset", "toneNotes", "bodyNotes", "starExample", "aboutYourself", 
                         "projectPitch", "technicalExplanation", "questionsToAsk", "toughQuestions"];
        const state = {};
        // Restore from localStorage
        try {
            const saved = JSON.parse(localStorage.getItem('interview_prep_state'));
            if (saved) Object.assign(state, saved);
            fieldIds.forEach(id => {
                const el = document.getElementById(id);
                if (el && state[id]) el.value = state[id];
            });
        } catch(e) {}
        function showStep(i) {
            currentStep = Math.max(0, Math.min(steps.length - 1, i));
            steps.forEach((s, idx) => s.classList.toggle('hidden', idx !== currentStep));
            prevBtn.disabled = currentStep === 0;
            nextBtn.textContent = currentStep === steps.length - 1 ? "Finish" : "Next";
            const pct = ((currentStep + 1) / steps.length) * 100;
            progressBar.style.width = pct + '%';
            progressLabel.textContent = `Section ${currentStep + 1} / ${steps.length}`;
        }
        nextBtn.addEventListener('click', () => {
            if (currentStep < steps.length - 1) showStep(currentStep + 1);
            else alert("You've completed all sections! Ready to practice with ELIO.");
        });
        prevBtn.addEventListener('click', () => showStep(currentStep - 1));
        // Auto-save functionality
        fieldIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', () => {
                    state[id] = el.value;
                    localStorage.setItem('interview_prep_state', JSON.stringify(state));
                });
            }
        });
        showStep(0);
        // ============================================
        // ELIO INTERVIEW BOT LOGIC
        // ============================================
        let apiKey = 'YOUR_API_KEY_HERE'; 
        let conversationHistory = [];
        let interviewActive = false;
        let currentQuestionIndex = 0;
        const interviewQuestions = [
            "Tell me about yourself.",
            "Why are you interested in this position?",
            "Describe a project you're proud of.",
            "Tell me about a time you faced a challenge and how you overcame it.",
            "What's your greatest strength?",
            "Where do you see yourself in 5 years?",
            "Do you have any questions for me?"
        ];
        const ELIO_SYSTEM_PROMPT = `You are ELIO (Expert Learning Interview Officer), a friendly AI interview coach for high school students.
Your role: Conduct realistic mock interviews, ask follow-up questions, and provide brief encouraging feedback.
CRITICAL RULES:
- Ask ONE interview question at a time
- After the student answers, give brief feedback (1-2 sentences): "Good job on..." or "Consider adding..."
- Then move to the next question when they're ready
- Be encouraging but honest
- Keep feedback concise and actionable
- Sound like a real interviewer - professional but friendly`;
        async function startELIOInterview() {
            interviewActive = true;
            currentQuestionIndex = 0;
            conversationHistory = []; 
            document.getElementById('startInterviewBtn').classList.add('hidden');
            document.getElementById('nextQuestionBtn').classList.remove('hidden');
            document.getElementById('endInterviewBtn').classList.remove('hidden');
            // Activate ELIO scanner animation
            document.getElementById('elioScanner').classList.add('active');
            document.getElementById('elioScannerOrigin').classList.add('active');
            askQuestion();
        }
        function askQuestion() {
            if (currentQuestionIndex < interviewQuestions.length) {
                const question = interviewQuestions[currentQuestionIndex];
                document.getElementById('elioQuestion').textContent = question;
                speakText(question);
            } else {
                document.getElementById('elioQuestion').textContent = "Great job! That concludes our interview. Review your recording to see how you did!";
                speakText("Great job! That concludes our interview.");
                document.getElementById('nextQuestionBtn').classList.add('hidden');  
                // Deactivate scanner
                document.getElementById('elioScanner').classList.remove('active');
                document.getElementById('elioScannerOrigin').classList.remove('active');
            }
        }
        function nextQuestion() {
            currentQuestionIndex++;
            askQuestion();
        }
        function endELIOInterview() {
            interviewActive = false;
            document.getElementById('elioQuestion').textContent = "Interview ended. Click 'Start Interview' to try again!";
            document.getElementById('startInterviewBtn').classList.remove('hidden');
            document.getElementById('nextQuestionBtn').classList.add('hidden');
            document.getElementById('endInterviewBtn').classList.add('hidden');
            // Deactivate scanner
            document.getElementById('elioScanner').classList.remove('active');
            document.getElementById('elioScannerOrigin').classList.remove('active');
            currentQuestionIndex = 0;
        }
        // Text-to-Speech for ELIO
        function speakText(text) {
            if (!window.speechSynthesis) return;
            if (speechSynthesis.speaking) {
                speechSynthesis.cancel();
            }
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;
            const voices = speechSynthesis.getVoices();
            const maleVoice = voices.find(voice =>
                voice.lang.startsWith('en') && (
                    voice.name.includes("David") || 
                    voice.name.includes("James") ||
                    voice.name.includes("Male")
                )
            );
            if (maleVoice) {
                utterance.voice = maleVoice;
            }
            window.speechSynthesis.speak(utterance);
        }
        // Ensure voices are loaded
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => {
                speechSynthesis.getVoices();
            };
        }
        // ============================================
        // VIDEO RECORDING LOGIC
        // ============================================
        let mediaRecorder;
        let recordedChunks = [];
        let stream;
        let timerInterval;
        let seconds = 0;
        const videoElement = document.getElementById('videoElement');
        const playbackVideo = document.getElementById('playbackVideo');
        const startRecordingBtn = document.getElementById('startRecordingBtn');
        const stopRecordingBtn = document.getElementById('stopRecordingBtn');
        const downloadBtn = document.getElementById('downloadBtn');
        const recordingIndicator = document.getElementById('recordingIndicator');
        const timer = document.getElementById('timer');
        const videoPlaceholder = document.getElementById('videoPlaceholder');
        async function startRecording() {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 1280 },
                        height: { ideal: 720 }
                    },
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        sampleRate: 44100
                    }
                });
                videoElement.srcObject = stream;
                videoPlaceholder.style.display = 'none';
                await new Promise(resolve => setTimeout(resolve, 500));
                recordedChunks = [];
                const options = {
                    mimeType: 'video/webm;codecs=vp9,opus',
                    videoBitsPerSecond: 2500000
                };
                if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                    options.mimeType = 'video/webm';
                }
                mediaRecorder = new MediaRecorder(stream, options);
                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        recordedChunks.push(event.data);
                    }
                };
                mediaRecorder.onstop = () => {
                    const blob = new Blob(recordedChunks, { type: 'video/webm' });
                    const url = URL.createObjectURL(blob);                    
                    videoElement.style.display = 'none';
                    playbackVideo.style.display = 'block';
                    playbackVideo.src = url;                   
                    stream.getTracks().forEach(track => track.stop());                    
                    downloadBtn.classList.remove('hidden');
                };
                mediaRecorder.start();
                startRecordingBtn.classList.add('hidden');
                stopRecordingBtn.classList.remove('hidden');
                recordingIndicator.classList.add('active');
                timer.classList.add('active');
                seconds = 0;
                updateTimer();
                timerInterval = setInterval(updateTimer, 1000);
            } catch (error) {
                console.error('Error accessing media devices:', error);
                alert('Could not access camera/microphone. Please allow permissions.');
            }
        }
        function stopRecording() {
            if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                mediaRecorder.stop();                
                stopRecordingBtn.classList.add('hidden');
                recordingIndicator.classList.remove('active');
                timer.classList.remove('active');
                clearInterval(timerInterval);
            }
        }
        function updateTimer() {
            seconds++;
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            timer.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
        function downloadVideo() {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `elio_interview_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`;
            a.click();
            URL.revokeObjectURL(url);
            alert('Interview video downloaded!');
        }
    </script>
</html>

