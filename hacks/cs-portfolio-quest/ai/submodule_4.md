---
layout: post
title: "AI Usage Certification"
description: "Complete your AI Usage Quest and earn your official certification from Open Coding Society. Add it to your LinkedIn profile to showcase your skills."
permalink: /cs-portfolio-quest/ai/submodule_4/
parent: "AI Usage"
team: "Thinkers"
submodule: 5
categories: [CSP, Submodule, AIUsage]
tags: [ai, submodule, thinkers, certificate]
author: "Thinkers Team"
date: 2025-10-21
---

# AI Usage Quest Certification

Congratulations on completing the AI Usage Quest! Earn your official certification from **Open Coding Society**.

<img src="{{site.baseurl}}/images/docx/Quests_QuestOfCode-AIUsage-Thinkers_image5.png" height="625">

---

## Complete All Submodules

<div id="checklist-container">
    <h3>Prerequisites Checklist:</h3>
    
    <div id="check-submodule-1">
        <span id="icon-1">⏳</span>
        <strong>Submodule 1: Resume & Interview Prep</strong>
        <p>Transform resume bullets and practice behavioral questions</p>
    </div>
    
    <div id="check-submodule-2">
        <span id="icon-2">⏳</span>
        <strong>Submodule 2: Prompt Engineering</strong>
        <p>Master the 4-component prompt framework</p>
    </div>
    
    <div id="check-submodule-3">
        <span id="icon-3">⏳</span>
        <strong>Submodule 3: Real Project Example</strong>
        <p>Follow the Flask/Spring migration walkthrough</p>
    </div>
    
    <div id="progress-container">
        <div id="overall-progress">0% Complete</div>
    </div>
</div>

<div id="status-message"></div>

---

## Your Certificate Preview

<div id="cert-preview">
    <h2>AI Usage Quest Certificate</h2>
    <p>This certifies that</p>
    
    <input type="text" id="student-name" placeholder="Enter your full name" maxlength="50" />
    
    <p>has successfully completed the AI Usage Quest, demonstrating proficiency in:</p>
    
    <div>
        <p>✓ AI-powered resume optimization</p>
        <p>✓ Advanced prompt engineering techniques</p>
        <p>✓ Real-world project implementation with AI</p>
        <p>✓ Secure coding practices with AI assistance</p>
    </div>
    
    <p><strong>Issued by Open Coding Society</strong><br><span id="cert-date">October 2025</span></p>
</div>

---

## Claim Your Certificate

<button id="download-btn" onclick="downloadCertificate()" disabled>Download Certificate (PDF)</button>
<button id="linkedin-btn" onclick="addToLinkedIn()" disabled>Add to LinkedIn Profile</button>
<button id="verify-btn" onclick="checkCompletion()">Check Status</button>

---

## How to Add This Certificate to LinkedIn

**When you click "Add to LinkedIn Profile":**

1. **Organization:** Select "Open Coding Society"
2. **Certificate Name:** "AI Usage Quest - Prompt Engineering & Development"
3. **Credential ID:** Auto-filled with your unique ID
4. **Issue Date:** Current month/year
5. **Skills:** AI Prompting, ChatGPT, Code Review, Resume Writing

**Pro Tip:** Add this to your "Licenses & Certifications" section!

<img src="{{site.baseurl}}/images/docx/Quests_QuestOfCode-AIUsage-Thinkers_image2.png" height="625">

---

## Why This Certificate Matters

**Career Boost** - Show employers you can effectively use AI tools  
**Verified Skills** - Official recognition from Open Coding Society  
**Stand Out** - Differentiate yourself from other candidates  

---

## FAQ

**Is this certificate recognized by employers?**  
Yes! Open Coding Society is recognized on LinkedIn. Many employers look for AI proficiency.

**How long to appear on LinkedIn?**  
Immediately! It's added to your profile within seconds.

**Can I retake any submodule?**  
Yes! Revisit and improve submissions anytime before claiming.

**Will I get a physical certificate?**  
You'll receive a PDF you can print. LinkedIn credential is digital and verifiable.

---

<script>
const SUBMODULES = ['submodule-1', 'submodule-2', 'submodule-3', 'submodule-4'];

function checkCompletion() {
    const completion = {};
    SUBMODULES.forEach(m => {
        completion[m] = localStorage.getItem(`ai-${m}-completed`) === 'true';
    });
    
    SUBMODULES.forEach((module, idx) => {
        const item = document.getElementById(`check-${module}`);
        const icon = document.getElementById(`icon-${idx + 1}`);
        if (completion[module]) {
            item.style.background = '#d4edda';
            icon.textContent = '✅';
        } else {
            item.style.background = '#f8f9fa';
            icon.textContent = '⏳';
        }
    });
    
    const completed = SUBMODULES.filter(m => completion[m]).length;
    const percentage = (completed / SUBMODULES.length) * 100;
    const bar = document.getElementById('overall-progress');
    bar.textContent = `${Math.round(percentage)}% Complete`;
    bar.style.width = `${percentage}%`;
    
    const allDone = SUBMODULES.every(m => completion[m]);
    document.getElementById('download-btn').disabled = !allDone;
    document.getElementById('linkedin-btn').disabled = !allDone;
    
    const msg = document.getElementById('status-message');
    if (allDone) {
        msg.style.background = '#d4edda';
        msg.style.color = '#155724';
        msg.textContent = 'All submodules complete! Your certificate is ready!';
    } else {
        const remaining = SUBMODULES.filter(m => !completion[m]).length;
        msg.style.background = '#fff3cd';
        msg.style.color = '#856404';
        msg.textContent = `${remaining} submodule${remaining > 1 ? 's' : ''} remaining to unlock certificate.`;
    }
    msg.style.display = 'block';
    msg.style.padding = '15px';
    msg.style.margin = '20px 0';
    msg.style.borderRadius = '8px';
}

function downloadCertificate() {
    const name = document.getElementById('student-name').value.trim();
    if (!name) {
        alert('Please enter your name first!');
        return;
    }
    
    const certId = 'AICERT-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    localStorage.setItem('ai-quest-certificate', JSON.stringify({
        name: name,
        id: certId,
        date: new Date().toISOString(),
        modules: SUBMODULES
    }));
    
    // Generate simple PDF preview
    const certHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>AI Quest Certificate</title>
            <style>
                body { font-family: Georgia, serif; text-align: center; padding: 50px; }
                .cert { background: white; padding: 60px; max-width: 800px; margin: 0 auto; border: 3px solid #667eea; }
                h1 { font-size: 48px; color: #667eea; }
                .name { font-size: 36px; font-weight: bold; color: #764ba2; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="cert">
                <h1>Certificate of Completion</h1>
                <h2>AI Usage Quest</h2>
                <p>This certifies that</p>
                <div class="name">${name}</div>
                <p>has successfully completed the AI Usage Quest</p>
                <p><strong>Issued by Open Coding Society</strong><br>${new Date().toLocaleDateString()}</p>
                <p style="font-size: 12px; color: #666; margin-top: 40px;">Certificate ID: ${certId}</p>
            </div>
            <script>window.onload = () => setTimeout(() => window.print(), 500);<\/script>
        </body>
        </html>
    `;
    
    const win = window.open('', '_blank');
    win.document.write(certHTML);
    win.document.close();
    
    const msg = document.getElementById('status-message');
    msg.style.background = '#d4edda';
    msg.style.color = '#155724';
    msg.textContent = `Certificate ready! ID: ${certId}`;
    msg.style.display = 'block';
}

function addToLinkedIn() {
    const name = document.getElementById('student-name').value.trim();
    if (!name) {
        alert('Please enter your name and download certificate first!');
        return;
    }
    
    let certId;
    const saved = localStorage.getItem('ai-quest-certificate');
    if (saved) {
        certId = JSON.parse(saved).id;
    } else {
        certId = 'AICERT-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    }
    
    const url = new URL('https://www.linkedin.com/profile/add');
    url.searchParams.append('startTask', 'CERTIFICATION_NAME');
    url.searchParams.append('name', 'AI Usage Quest - Prompt Engineering & Development');
    url.searchParams.append('organizationName', 'Open Coding Society');
    url.searchParams.append('issueYear', new Date().getFullYear());
    url.searchParams.append('issueMonth', new Date().getMonth() + 1);
    url.searchParams.append('certId', certId);
    url.searchParams.append('certUrl', window.location.origin + '/ai-quest-verify/' + certId);
    
    window.open(url.toString(), '_blank');
    
    const msg = document.getElementById('status-message');
    msg.style.background = '#d4edda';
    msg.style.color = '#155724';
    msg.textContent = 'Opening LinkedIn... Follow prompts to add certification!';
    msg.style.display = 'block';
}


function generatePrintableCertificate(certData) {
    const certHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>AI Quest Certificate</title>
            <style>
                body { font-family: Georgia, serif; text-align: center; padding: 50px; }
                .cert { background: white; padding: 60px; max-width: 800px; margin: 0 auto; border: 3px solid #667eea; }
                h1 { font-size: 48px; color: #667eea; }
                .name { font-size: 36px; font-weight: bold; color: #764ba2; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="cert">
                <h1>Certificate of Completion</h1>
                <h2>AI Usage Quest</h2>
                <p>This certifies that</p>
                <div class="name">${certData.name}</div>
                <p>has successfully completed the AI Usage Quest</p>
                <p><strong>Issued by Open Coding Society</strong><br>${new Date(certData.issueDate).toLocaleDateString()}</p>
                <p style="font-size: 12px; color: #666; margin-top: 40px;">Certificate ID: ${certData.id}</p>
            </div>
            <script>window.onload = () => setTimeout(() => window.print(), 500);<\/script>
        </body>
        </html>
    `;
    
    const win = window.open('', '_blank');
    win.document.write(certHTML);
    win.document.close();
}

document.getElementById('cert-date').textContent = new Date().toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
});

document.addEventListener('DOMContentLoaded', checkCompletion);
</script>

{%- include tailwind/cs-portfolio-quest-lessons_info.html -%}