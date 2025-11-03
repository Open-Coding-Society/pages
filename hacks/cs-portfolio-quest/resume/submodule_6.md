---
layout: cs-portfolio-lesson
title: "Interview"
description: "Test your skills against an interview bot"
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
    <div class="w-full bg-gray-200 rounded h-2 mt-2">
      <div id="progressBar" class="bg-blue-600 h-2 rounded" style="width:10%"></div>
    </div>
  </div>

  <!-- STEP 1: Mindset -->
  <section data-step="0" class="space-y-3">
    <h2 class="text-xl font-semibold">Interview mindset</h2>
    <p>Interviews are conversations — it’s okay to pause, think, and ask clarifying questions.</p>
    <details class="border rounded p-3">
      <summary class="font-medium cursor-pointer">What to remember</summary>
      <ul class="list-disc ml-5 mt-2 text-sm">
        <li>Say “Let me think for a moment.”</li>
        <li>Ask clarifying questions.</li>
        <li>Be authentic and concise.</li>
      </ul>
    </details>
    <div class="border rounded p-3">
      <div class="font-medium mb-2">Watch: Interview Mindset Tips</div>
      <iframe
        class="w-full rounded"
        style="aspect-ratio: 16/9;"
        src="https://www.youtube.com/embed/ZdjJdoEwCY4"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
      </iframe>
    </div>
    <div>
      <label class="block text-sm font-medium">Your reflection</label>
      <textarea id="mindset" rows="3" class="w-full border rounded px-3 py-2" placeholder="What mindset will you bring?"></textarea>
    </div>
    <div><button id="toStep2" class="px-3 py-2 border rounded">Continue →</button></div>
  </section>

  <!-- STEP 2: Voice -->
  <section data-step="1" class="space-y-3 hidden">
    <h2 class="text-xl font-semibold">Vocal tone & pacing</h2>
    <p class="text-gray-700">Speak clearly, vary tone, and use pauses for emphasis.</p>
    <details class="border rounded p-3">
      <summary class="font-medium cursor-pointer">Best practices</summary>
      <ul class="list-disc ml-5 mt-2 text-sm">
        <li><b>Volume:</b> Audible and steady</li>
        <li><b>Pace:</b> Not too fast/slow</li>
        <li><b>Tone:</b> Avoid monotone</li>
        <li><b>Pauses:</b> Use for structure</li>
      </ul>
    </details>
    <div class="border rounded p-3">
      <div class="font-medium mb-2">Watch: Vocal Communication</div>
      <div id="vocalVideoContainer">
        <iframe
          id="vocalVideoFrame"
          class="w-full rounded"
          style="aspect-ratio: 9/16; max-height: 500px;"
          src="https://www.youtube.com/embed/OIpb3FSWXK0"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>
      </div>
      <div class="flex justify-between mt-2">
        <button id="prevVocalVideo" class="px-3 py-2 border rounded text-sm" style="visibility: hidden;">← Previous Video</button>
        <span id="vocalVideoCounter" class="text-sm self-center">Video 1 / 2</span>
        <button id="nextVocalVideo" class="px-3 py-2 border rounded text-sm">Next Video →</button>
      </div>
    </div>
    <div>
      <label class="block text-sm font-medium">Your notes</label>
      <textarea id="toneNotes" rows="3" class="w-full border rounded px-3 py-2" placeholder="What will you practice?"></textarea>
    </div>
    <div><button id="toStep3" class="px-3 py-2 border rounded">Continue →</button></div>
  </section>

  <!-- STEP 3: Body language -->
  <section data-step="2" class="space-y-3 hidden">
    <h2 class="text-xl font-semibold">Body language mastery</h2>
    <p>Non-verbal cues can make or break an interview.</p>
    <div class="grid md:grid-cols-2 gap-3">
      <div class="border rounded p-3">
        <div class="font-semibold mb-1"> Do</div>
        <ul class="list-disc ml-5 text-sm space-y-1">
          <li>Eye contact (70–80%)</li><li>Open posture</li><li>Natural gestures</li><li>Genuine smile</li>
        </ul>
      </div>
      <div class="border rounded p-3">
        <div class="font-semibold mb-1">Don’t</div>
        <ul class="list-disc ml-5 text-sm space-y-1">
          <li>Fidgeting</li><li>Crossed arms</li><li>Phone checking</li><li>Slouching</li>
        </ul>
      </div>
    </div>
    <div>
      <label class="block text-sm font-medium">Two improvements you’ll try</label>
      <textarea id="bodyNotes" rows="3" class="w-full border rounded px-3 py-2" placeholder="e.g., maintain eye contact, stop fidgeting"></textarea>
    </div>
    <div><button id="toStep4" class="px-3 py-2 border rounded">Continue →</button></div>
  </section>

  <!-- STEP 4: STAR -->
  <section data-step="3" class="space-y-3 hidden">
    <h2 class="text-xl font-semibold">STAR method</h2>
    <details class="border rounded p-3">
      <summary class="font-medium cursor-pointer">Quick breakdown</summary>
      <ul class="list-disc ml-5 mt-2 text-sm">
        <li><b>S:</b> Situation</li><li><b>T:</b> Task</li><li><b>A:</b> Action</li><li><b>R:</b> Result (with metrics)</li>
      </ul>
    </details>
    <div class="border rounded p-3">
      <div class="font-medium mb-2">Example</div>
      <p class="text-sm">“I debugged our autonomous robot, fixed a sensor calibration, and improved our score by 40%.”</p>
    </div>
    <div>
      <label class="block text-sm font-medium">Your STAR answer</label>
      <textarea id="starExample" rows="5" class="w-full border rounded px-3 py-2" placeholder="Tell me about a time you worked in a team..."></textarea>
    </div>
    <div><button id="toStep5" class="px-3 py-2 border rounded">Continue →</button></div>
  </section>

  <!-- STEP 5: Common Qs -->
  <section data-step="4" class="space-y-3 hidden">
    <h2 class="text-xl font-semibold">Common interview questions</h2>
    <div class="space-y-3">
      <div class="border-l-4 border-blue-500 pl-4">
        <div class="font-semibold mb-1">“Tell me about yourself”</div>
        <p class="text-sm text-gray-600">Present → Interests → Projects → Goals</p>
      </div>
      <div class="border-l-4 border-blue-500 pl-4">
        <div class="font-semibold mb-1">“Why this role?”</div>
        <p class="text-sm text-gray-600">Company research + alignment + examples</p>
      </div>
    </div>
    <div>
      <label class="block text-sm font-medium">Draft your 60-second pitch</label>
      <textarea id="aboutYourself" rows="5" class="w-full border rounded px-3 py-2" placeholder="Write your pitch..."></textarea>
    </div>
    <div><button id="toStep6" class="px-3 py-2 border rounded">Continue →</button></div>
  </section>

  <!-- STEP 6: Project demo -->
  <section data-step="5" class="space-y-3 hidden">
    <h2 class="text-xl font-semibold">Presenting your projects</h2>
    <div class="border rounded p-3">
      <div class="font-medium mb-2">Pitch formula</div>
      <ol class="list-decimal ml-5 text-sm space-y-1">
        <li><b>What</b> (name + purpose)</li>
        <li><b>Why</b> (problem)</li>
        <li><b>How</b> (stack + role)</li>
        <li><b>Impact</b> (metrics/learning)</li>
      </ol>
    </div>
    <div>
      <label class="block text-sm font-medium">Your project pitch (60–90s)</label>
      <textarea id="projectPitch" rows="5" class="w-full border rounded px-3 py-2" placeholder="Write your pitch..."></textarea>
    </div>
    <div><button id="toStep7" class="px-3 py-2 border rounded">Continue →</button></div>
  </section>

  <!-- STEP 7: Explain tech -->
  <section data-step="6" class="space-y-3 hidden">
    <h2 class="text-xl font-semibold">Explain a technical concept</h2>
    <details class="border rounded p-3">
      <summary class="font-medium cursor-pointer">“Explain to a 5th grader” rule</summary>
      <ul class="list-disc ml-5 mt-2 text-sm">
        <li>Big picture → details</li><li>Analogy</li><li>Define jargon</li><li>Step-by-step</li>
      </ul>
    </details>
    <div>
      <label class="block text-sm font-medium">Your explanation</label>
      <textarea id="technicalExplanation" rows="5" class="w-full border rounded px-3 py-2" placeholder="Loops, APIs, databases, etc."></textarea>
    </div>
    <div><button id="toStep8" class="px-3 py-2 border rounded">Continue →</button></div>
  </section>

  <!-- STEP 8: Your questions -->
  <section data-step="7" class="space-y-3 hidden">
    <h2 class="text-xl font-semibold">Questions YOU should ask</h2>
    <div class="grid md:grid-cols-2 gap-3">
      <div class="border rounded p-3">
        <div class="font-semibold mb-1">Great questions</div>
        <ul class="list-disc ml-5 text-sm space-y-1">
          <li>“Typical day for this role?”</li><li>“Team culture?”</li><li>“Tech stack?”</li>
        </ul>
      </div>
      <div class="border rounded p-3">
        <div class="font-semibold mb-1">Avoid</div>
        <ul class="list-disc ml-5 text-sm space-y-1">
          <li>“What does your company do?”</li><li>Immediate pay/promotion</li>
        </ul>
      </div>
    </div>
    <div>
      <label class="block text-sm font-medium">Write 3 questions</label>
      <textarea id="questionsToAsk" rows="4" class="w-full border rounded px-3 py-2" placeholder="Your questions..."></textarea>
    </div>
    <div><button id="toStep9" class="px-3 py-2 border rounded">Continue →</button></div>
  </section>

  <!-- STEP 9: Tough questions -->
  <section data-step="8" class="space-y-3 hidden">
    <h2 class="text-xl font-semibold">Handling tough questions</h2>
    <details class="border rounded p-3">
      <summary class="font-medium cursor-pointer">If you don’t know</summary>
      <p class="text-sm mt-2">“I’m not sure yet — I’d approach it by …”</p>
    </details>
    <details class="border rounded p-3">
      <summary class="font-medium cursor-pointer">If you need time</summary>
      <p class="text-sm mt-2">“Let me think for a moment …”</p>
    </details>
    <div>
      <label class="block text-sm font-medium">Your strategy</label>
      <textarea id="toughQuestions" rows="4" class="w-full border rounded px-3 py-2" placeholder="Write your approach..."></textarea>
    </div>
    <div><button id="toStep10" class="px-3 py-2 border rounded">Practice with ELIO →</button></div>
  </section>

  <!-- STEP 10: ELIO mock interview -->
  <section data-step="9" class="space-y-3 hidden">
    <h2 class="text-xl font-semibold">Practice interview with ELIO</h2>
    <div class="grid md:grid-cols-2 gap-3">
      <!-- ELIO Coach -->
      <div class="border rounded p-3">
        <div class="font-medium mb-2 text-center">ELIO — AI Interview Coach</div>
        <div class="flex justify-center mb-3">
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
        </div>
        <div class="border rounded p-3 mb-3">
          <p id="elioQuestion" class="text-center font-medium">Click “Start Interview” to begin!</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button id="startInterviewBtn" class="px-3 py-2 border rounded">Start Interview</button>
          <button id="nextQuestionBtn" class="px-3 py-2 border rounded hidden">Next Question</button>
          <button id="endInterviewBtn" class="px-3 py-2 border rounded hidden">End Interview</button>
        </div>
      </div>
      <!-- Video -->
      <div class="border rounded p-3">
        <div class="font-medium mb-2 text-center">Your Video</div>
        <div class="video-container relative rounded overflow-hidden border">
          <video id="videoElement" autoplay muted></video>
          <video id="playbackVideo" controls style="display:none;"></video>
          <div class="recording-indicator" id="recordingIndicator">
            <div class="recording-dot"></div><span>REC</span>
          </div>
          <div class="timer" id="timer">00:00</div>
          <div id="videoPlaceholder" class="absolute inset-0 flex items-center justify-center text-gray-700 text-center bg-gray-50">
            <div>
              <div class="text-5xl mb-2">📹</div>
              <div>Click “Start Recording” below</div>
            </div>
          </div>
        </div>
        <div class="flex flex-wrap gap-2 mt-3">
          <button id="startRecordingBtn" class="px-3 py-2 border rounded">Start Recording</button>
          <button id="stopRecordingBtn" class="px-3 py-2 border rounded hidden">Stop Recording</button>
          <button id="downloadBtn" class="px-3 py-2 border rounded hidden">Download Video</button>
        </div>
      </div>
    </div>
    <!-- Save / Submit like Submodule 3 -->
    <div class="grid md:grid-cols-2 gap-2">
      <button id="saveDraft" class="px-3 py-2 border rounded">Save Draft</button>
      <button id="submitFinal" class="px-3 py-2 border rounded">Submit Final</button>
    </div>
    <p id="saveMessage" class="text-sm"></p>
  </section>

  <!-- Bottom Navigation (Submodule 3 style: no generic Next, only Previous + Next Module) -->
  <div class="flex justify-between mt-4">
    <button id="prevBtn" class="px-3 py-2 border rounded" disabled>Previous</button>
    <button
      id="nextModuleBtnNav"
      data-href="/cs-portfolio-quest/resume/"
      class="px-3 py-2 border rounded hidden bg-red-600 text-white disabled:opacity-60"
      disabled
    >Next Module →</button>
  </div>

  <!-- Floating Selected Sprite -->
<video id="floating-sprite" width="150" height="160" loop muted playsinline style="
  position: fixed;
  bottom: 20px;
  right: -200px;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  display: none;
  z-index: 1000;
">
  <source id="floating-source" src="" type="video/mp4">
</video>


</div>

<style>
  /* ELIO visuals (light theme compatible) */
  .video-container { position: relative; background: #000; aspect-ratio: 16/9; }
  #videoElement, #playbackVideo { width: 100%; height: 100%; object-fit: cover; }
  .recording-indicator { position: absolute; top: 10px; right: 10px; background: rgba(255,0,0,.9); color:#fff; padding:8px 16px; border-radius:20px; font-weight:700; display:none; align-items:center; gap:8px; animation:pulse 1.5s ease-in-out infinite; }
  .recording-indicator.active { display:flex; }
  .recording-dot { width:10px; height:10px; background:#fff; border-radius:50%; animation:blink 1s infinite; }
  .timer { position:absolute; top:10px; left:10px; background:rgba(0,0,0,.7); color:#fff; padding:8px 16px; border-radius:20px; font-weight:700; display:none; }
  .timer.active { display:block; }
  @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }

  .elio-avatar { perspective: 1000px; width: 150px; height: 150px; }
  .elio-bot { --ELIO-ROTATION-DURATION: 4s; transform-style: preserve-3d; animation: rotateRight var(--ELIO-ROTATION-DURATION) linear infinite alternate; }
  .elio-head { position: relative; width: 4rem; height: 2.5rem; border-radius: 48% 53% 45% 55% / 79% 79% 20% 22%; background: linear-gradient(to right, white 45%, gray); }
  .elio-eyeChamber { width: 3rem; height: 1.8rem; position: relative; left: 50%; top: 55%; border-radius: 45% 53% 45% 48% / 62% 59% 35% 34%; background-color: #0c203c; box-shadow: 0 0 2px 2px white, inset 0 0 0 2px black; transform: translate(-50%,-50%); animation: moveRight var(--ELIO-ROTATION-DURATION) linear infinite alternate; }
  .elio-eye { width: .8rem; height: 1rem; position:absolute; border-radius:50%; }
  .elio-eye:first-child { left:8px; top:50%; background: repeating-linear-gradient(65deg, #9bdaeb 0px, #9bdaeb 1px, white 2px); box-shadow: inset 0 0 5px #04b8d5, 0 0 15px 1px #0bdaeb; transform: translate(0,-50%) rotate(-65deg); }
  .elio-eye:nth-child(2) { right:8px; top:50%; background: repeating-linear-gradient(-65deg, #9bdaeb 0px, #9bdaeb 1px, white 2px); box-shadow: inset 0 0 5px #04b8d5, 0 0 15px 1px #0bdaeb; transform: translate(0,-50%) rotate(65deg); }
  .elio-body { width: 4rem; height: 5rem; position: relative; margin-block-start:.15rem; border-radius: 47% 53% 45% 55% / 12% 9% 90% 88%; background: linear-gradient(to right, white 35%, gray); }
  .elio-hand { position:absolute; left:-1rem; top:.5rem; width:1.3rem; height:3.5rem; border-radius:40%; background: linear-gradient(to left, white 15%, gray); box-shadow: 5px 0 5px rgba(0,0,0,.25); transform: rotateY(55deg) rotateZ(10deg); }
  .elio-hand:nth-child(2) { left:92%; background: linear-gradient(to right, white 15%, gray); transform: rotateY(55deg) rotateZ(-10deg); }
  .elio-scanner { width:0; height:0; position:absolute; left:60%; top:10%; border-top:120px solid #9bdaeb; border-left:150px solid transparent; border-right:150px solid transparent; transform-origin: top left; mask: linear-gradient(to right, white, transparent 35%); display:none; }
  .elio-scanner.active { display:block; animation: glow 2s cubic-bezier(.86,0,.07,1) infinite; }
  .elio-scannerOrigin { position:absolute; width:6px; aspect-ratio:1; border-radius:50%; left:60%; top:10%; background:#9bdaeb; box-shadow: inset 0 0 5px rgba(0,0,0,.5); display:none; }
  .elio-scannerOrigin.active { display:block; }
  @keyframes rotateRight { from{transform:rotateY(0)} to{transform:rotateY(25deg)} }
  @keyframes moveRight { from{transform:translate(-50%,-50%)} to{transform:translate(-40%,-50%)} }
</style>

<script>
document.addEventListener('DOMContentLoaded', () => {
  // --------- Vocal Video Navigation ----------
  const vocalVideos = [
    "https://www.youtube.com/embed/OIpb3FSWXK0",
    "https://www.youtube.com/embed/ZW4CfKuumUs"
  ];
  let currentVocalVideoIndex = 0;

  const vocalVideoFrame = document.getElementById('vocalVideoFrame');
  const prevVocalBtn = document.getElementById('prevVocalVideo');
  const nextVocalBtn = document.getElementById('nextVocalVideo');
  const vocalVideoCounter = document.getElementById('vocalVideoCounter');

  function updateVocalVideo() {
    vocalVideoFrame.src = vocalVideos[currentVocalVideoIndex];
    vocalVideoCounter.textContent = `Video ${currentVocalVideoIndex + 1} / ${vocalVideos.length}`;

    // Hide/show buttons based on position
    if (currentVocalVideoIndex === 0) {
      prevVocalBtn.style.visibility = 'hidden';
    } else {
      prevVocalBtn.style.visibility = 'visible';
    }

    if (currentVocalVideoIndex === vocalVideos.length - 1) {
      nextVocalBtn.style.visibility = 'hidden';
    } else {
      nextVocalBtn.style.visibility = 'visible';
    }
  }

  prevVocalBtn?.addEventListener('click', () => {
    if (currentVocalVideoIndex > 0) {
      currentVocalVideoIndex--;
      updateVocalVideo();
    }
  });

  nextVocalBtn?.addEventListener('click', () => {
    if (currentVocalVideoIndex < vocalVideos.length - 1) {
      currentVocalVideoIndex++;
      updateVocalVideo();
    }
  });

  // --------- State & storage (Submodule 3 pattern) ----------
  const STORAGE_KEY = "interview_prep_module6_v1";
  const state = { step: 0, submitted: false };

  const fieldIds = ["mindset","toneNotes","bodyNotes","starExample","aboutYourself","projectPitch","technicalExplanation","questionsToAsk","toughQuestions"];
  const $  = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  const steps = $$('section[data-step]');
  const progressBar   = $('#progressBar');
  const progressLabel = $('#progressLabel');

  const prevBtn = $('#prevBtn');
  const nextModuleBtnNav = $('#nextModuleBtnNav');

  const saveDraftBtn = $('#saveDraft');
  const submitFinalBtn = $('#submitFinal');
  const saveMessage = $('#saveMessage');

  // restore
  try{
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved){
      state.submitted = !!saved.submitted;
      fieldIds.forEach(id => { const el = $("#"+id); if (el && saved[id]) el.value = saved[id]; });
    }
  }catch(e){}

  function persist(){
    const out = { submitted: state.submitted };
    fieldIds.forEach(id => { const el = $("#"+id); if (el) out[id] = el.value; });
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(out)); }catch(e){}
  }
  fieldIds.forEach(id => { const el = $("#"+id); if (el) el.addEventListener('input', persist); });

  // navigation (Submodule 3 style: internal buttons + bottom Previous)
  function showStep(i){
    state.step = Math.max(0, Math.min(steps.length-1, i));
    steps.forEach((el,idx)=>el.classList.toggle('hidden', idx!==state.step));
    const pct = ((state.step+1)/steps.length)*100;
    progressBar.style.width = pct + '%';
    progressLabel.textContent = `Step ${state.step+1} / ${steps.length}`;
    prevBtn.disabled = state.step===0;

    const onLast = state.step === steps.length - 1;
    nextModuleBtnNav.classList.toggle('hidden', !onLast);
    nextModuleBtnNav.disabled = !state.submitted;
    nextModuleBtnNav.classList.toggle('bg-green-600', !!state.submitted);
    nextModuleBtnNav.classList.toggle('bg-red-600', !state.submitted);

    persist();
  }
  prevBtn.addEventListener('click', ()=>showStep(state.step-1));

  // internal “Continue →” buttons (IDs toStep2..toStep10)
  const jumpers = [
    ["#toStep2",1],["#toStep3",2],["#toStep4",3],["#toStep5",4],
    ["#toStep6",5],["#toStep7",6],["#toStep8",7],["#toStep9",8],["#toStep10",9]
  ];
  jumpers.forEach(([sel,idx])=>{ const b = $(sel); if (b) b.addEventListener('click', ()=>showStep(idx)); });

  if (nextModuleBtnNav){
    nextModuleBtnNav.addEventListener('click', (e)=>{
      e.preventDefault();
      if (!state.submitted){ alert("Submit Final first."); return; }
      const href = nextModuleBtnNav.getAttribute('data-href');
      if (href) window.location.href = href;
    });
  }

  // Save / Submit
  saveDraftBtn?.addEventListener('click', ()=>{
    persist();
    saveMessage.textContent = "Draft saved on this device.";
    saveMessage.className = "text-sm text-green-700";
  });

  submitFinalBtn?.addEventListener('click', async ()=>{
    // You can add a real POST later if desired
    state.submitted = true;
    persist();
    saveMessage.textContent = "Submitted! Your practice set is marked complete.";
    saveMessage.className = "text-sm text-green-700";
    nextModuleBtnNav.disabled = false;
    nextModuleBtnNav.classList.remove('bg-red-600');
    nextModuleBtnNav.classList.add('bg-green-600');
  });

  // ----- Bind ELIO buttons (critical for speech to trigger via user gesture)
  document.getElementById('startInterviewBtn')?.addEventListener('click', startELIOInterview);
  document.getElementById('nextQuestionBtn')?.addEventListener('click', nextQuestion);
  document.getElementById('endInterviewBtn')?.addEventListener('click', endELIOInterview);

  // Warm up voices as early as possible (some browsers need this)
  if (window.speechSynthesis) {
    const warm = () => { speechSynthesis.onvoiceschanged = null; speechSynthesis.getVoices(); };
    speechSynthesis.onvoiceschanged = warm;
    setTimeout(() => speechSynthesis.getVoices(), 200);
  }

  // ------- Boot
  showStep(0);
});

/* ============================
   ELIO Interview Bot
============================ */
let interviewActive = false;
let currentQuestionIndex = 0;
const interviewQuestions = [
  "Tell me about yourself.",
  "Why are you interested in this position?",
  "Describe a project you're proud of.",
  "Tell me about a challenge and how you overcame it.",
  "What's your greatest strength?",
  "Where do you see yourself in 5 years?",
  "Do you have any questions for me?"
];

const startBtn = () => document.getElementById('startInterviewBtn');
const nextBtn  = () => document.getElementById('nextQuestionBtn');
const endBtn   = () => document.getElementById('endInterviewBtn');

function startELIOInterview(){
  interviewActive = true;
  currentQuestionIndex = 0;
  startBtn()?.classList.add('hidden');
  nextBtn()?.classList.remove('hidden');
  endBtn()?.classList.remove('hidden');
  document.getElementById('elioScanner')?.classList.add('active');
  document.getElementById('elioScannerOrigin')?.classList.add('active');
  askQuestion();
}
function askQuestion(){
  const qEl = document.getElementById('elioQuestion');
  if (currentQuestionIndex < interviewQuestions.length){
    const q = interviewQuestions[currentQuestionIndex];
    qEl.textContent = q;
    speakText(q); // say it out loud
  } else {
    qEl.textContent = "Great job! That concludes our interview. Review your recording.";
    speakText("Great job! That concludes our interview.");
    nextBtn()?.classList.add('hidden');
    document.getElementById('elioScanner')?.classList.remove('active');
    document.getElementById('elioScannerOrigin')?.classList.remove('active');
  }
}
function nextQuestion(){ currentQuestionIndex++; askQuestion(); }
function endELIOInterview(){
  interviewActive = false;
  document.getElementById('elioQuestion').textContent = "Interview ended. Click “Start Interview” to try again!";
  startBtn()?.classList.remove('hidden');
  nextBtn()?.classList.add('hidden');
  endBtn()?.classList.add('hidden');
  document.getElementById('elioScanner')?.classList.remove('active');
  document.getElementById('elioScannerOrigin')?.classList.remove('active');
  currentQuestionIndex = 0;
}

// ---- Robust TTS: waits for voices if needed, with fallback
function speakText(text){
  if (!('speechSynthesis' in window)) return;

  const trySpeak = () => {
    if (speechSynthesis.speaking) speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 1.0;
    u.pitch = 1.0;
    u.volume = 1.0;
    const voices = speechSynthesis.getVoices() || [];
    const preferred = voices.find(v =>
      v.lang?.toLowerCase().startsWith('en') &&
      (v.name?.includes('David') || v.name?.includes('James') || v.name?.toLowerCase().includes('male'))
    ) || voices.find(v => v.lang?.toLowerCase().startsWith('en')) || null;
    if (preferred) u.voice = preferred;
    window.speechSynthesis.speak(u);
  };

  const voicesNow = speechSynthesis.getVoices();
  if (!voicesNow || voicesNow.length === 0){
    const once = () => { speechSynthesis.onvoiceschanged = null; trySpeak(); };
    speechSynthesis.onvoiceschanged = once;
    // safety fallback in case onvoiceschanged never fires
    setTimeout(() => { if (speechSynthesis.getVoices().length) trySpeak(); }, 400);
  } else {
    trySpeak();
  }
}

/* ============================
   Video Recording
============================ */
let mediaRecorder, recordedChunks = [], stream, timerInterval, seconds = 0;
const videoElement = document.getElementById('videoElement');
const playbackVideo = document.getElementById('playbackVideo');
const startRecordingBtn = document.getElementById('startRecordingBtn');
const stopRecordingBtn = document.getElementById('stopRecordingBtn');
const downloadBtn = document.getElementById('downloadBtn');
const recordingIndicator = document.getElementById('recordingIndicator');
const timer = document.getElementById('timer');
const videoPlaceholder = document.getElementById('videoPlaceholder');

startRecordingBtn?.addEventListener('click', startRecording);
stopRecordingBtn?.addEventListener('click', stopRecording);
downloadBtn?.addEventListener('click', downloadVideo);

async function startRecording(){
  try{
    stream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 44100 }
    });
    videoElement.srcObject = stream;
    videoPlaceholder.style.display = 'none';
    await new Promise(r=>setTimeout(r, 400));
    recordedChunks = [];
    const options = { mimeType: 'video/webm;codecs=vp9,opus', videoBitsPerSecond: 2500000 };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) options.mimeType = 'video/webm';
    mediaRecorder = new MediaRecorder(stream, options);
    mediaRecorder.ondataavailable = e => { if (e.data.size>0) recordedChunks.push(e.data); };
    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type:'video/webm' });
      const url = URL.createObjectURL(blob);
      videoElement.style.display = 'none';
      playbackVideo.style.display = 'block';
      playbackVideo.src = url;
      stream.getTracks().forEach(t=>t.stop());
      downloadBtn.classList.remove('hidden');
    };
    mediaRecorder.start();
    startRecordingBtn.classList.add('hidden');
    stopRecordingBtn.classList.remove('hidden');
    recordingIndicator.classList.add('active');
    timer.classList.add('active');
    seconds = 0; updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
  }catch(err){
    console.error(err);
    alert('Could not access camera/microphone. Please allow permissions.');
  }
}
function stopRecording(){
  if (mediaRecorder && mediaRecorder.state!=='inactive'){
    mediaRecorder.stop();
    stopRecordingBtn.classList.add('hidden');
    recordingIndicator.classList.remove('active');
    timer.classList.remove('active');
    clearInterval(timerInterval);
  }
}
function updateTimer(){
  seconds++;
  const m = Math.floor(seconds/60), s = seconds%60;
  timer.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}
function downloadVideo(){
  const blob = new Blob(recordedChunks, { type:'video/webm' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url;
  a.download = `elio_interview_${new Date().toISOString().slice(0,19).replace(/:/g,'-')}.webm`;
  a.click(); URL.revokeObjectURL(url);
  alert('Interview video downloaded!');
}

// ✅ Floating MP4 sprite logic
const floatingSprite = document.getElementById("floating-sprite");
const floatingSource = document.getElementById("floating-source");

// On page load, check if a character was selected in Submodule 1
const savedCharacter = localStorage.getItem("selectedCharacter");
if (savedCharacter) {
  showFloatingSprite(savedCharacter);
}

function showFloatingSprite(charId) {
  const spriteMap = {
    "char1": "{{site.baseurl}}/hacks/cs-portfolio-quest/resume/sprites/elephant_6.mp4",
    "char2": "{{site.baseurl}}/hacks/cs-portfolio-quest/resume/sprites/hamster_6.mp4",
    "char3": "{{site.baseurl}}/hacks/cs-portfolio-quest/resume/sprites/monkey_6.mp4"
  };

  const src = spriteMap[charId];
  if (src) {
    floatingSource.src = src;
    floatingSprite.load();
    floatingSprite.style.display = "block";
    floatingSprite.play();
  }
}

</script>
