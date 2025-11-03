---
layout: cs-portfolio-lesson
title: "Submodule 1"
description: "Submodule 1 of Resume Building Mini-Quest"
permalink: /cs-portfolio-quest/resume/submodule_1/
parent: "Resume Building"
team: "Grinders"
submodule: 1
categories: [CSP, Submodule, ResumeBuilding]
tags: [resume, submodule, grinders]
author: "Grinders Team"
date: 2025-10-21
---

# Introduction

  <style>
    body {
      font-family: "Poppins", sans-serif;
      color: #080808ff;
      margin: 0;
      padding: 0;
    }
    
    h1, h2 {
      text-align: center;
      color: #4338ca;
    }
    h1 {
      font-size: 2.5em;
      margin-bottom: 0.3em;
    }
    p {
      text-align: center;
      font-size: 1.1em;
      line-height: 1.6em;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
      gap: 20px;
      margin-top: 40px;
    }
    .stat-card {
      background: #b6b6b6ff;
      padding: 20px;
      border-radius: 16px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      color: #4338ca;
    }
    .stat-card p {
      color: #101011ff !important;
    }
    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 15px rgba(0,0,0,0.15);
    }
    .stat-card h3 {
      color: #4f46e5 !important;
      margin-bottom: 10px;
    }
    .stat-card .percent {
      font-size: 2em;
      color: #4338ca;
      font-weight: bold;
    }
    .careers {
      margin-top: 60px;
      text-align: center;
    }
    .career {
      margin-bottom: 20px;
    }
    .career button {
      background-color: #6366f1;
      color: #fff;
      font-size: 1.2em;
      border: none;
      width: 100%;
      max-width: 700px;
      padding: 15px;
      border-radius: 16px;
      cursor: pointer;
      transition: background 0.3s ease;
    }
    .career button:hover {
      background-color: #4f46e5;
    }
    .career-content {
      max-width: 700px;
      margin: 10px auto 0;
      border-radius: 16px;
      overflow: hidden;
      max-height: 0;
      transition: all 0.5s ease;
      box-shadow: 0 0 0 rgba(0,0,0,0);
      color: #121112ff;
    }
    .career-content.open {
      padding: 20px;
      max-height: 600px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }
    .career-columns {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      text-align: left;
    }
    .career-columns h4 {
      color: #4338ca;
      margin-bottom: 10px;
    }
    ul {
      list-style: disc inside;
      font-size: 0.95em;
      line-height: 1.5em;
    }
    .insights {
      text-align: center;
      margin-top: 60px;
    }
    .insights ul {
      display: inline-block;
      text-align: left;
      margin-top: 10px;
    }
    .footer-quote {
      text-align: center;
      font-style: italic;
      color: #555;
      margin-top: 40px;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .open {
      animation: fadeIn 0.4s ease forwards;
    }

    /* ✅ Added styling for Next Module button */
    .next-module {
      display: flex;
      justify-content: center;
      margin-top: 50px;
    }
    .next-module a {
      background-color: #4f46e5;
      color: #fff;
      padding: 15px 30px;
      border-radius: 12px;
      text-decoration: none;
      font-weight: bold;
      font-size: 1.2em;
      transition: background 0.3s ease;
    }
    .next-module a:hover {
      background-color: #3730a3;
    }
  </style>

  <div class="container">
    <h1>Why Resumes Matter in Tech Careers</h1>
    <p>A strong resume can dramatically increase your chances of landing your dream tech job. Recruiters often spend <strong>6–8 seconds</strong> scanning, so make yours count!</p>

<div class="stats">
      <div class="stat-card">
        <h3>Skills Section</h3>
        <div class="percent">65%</div>
        <p>Recruiters prioritize detailed technical skills sections.</p>
      </div>
      <div class="stat-card">
        <h3>Work Experience</h3>
        <div class="percent">70%</div>
        <p>Hiring managers value relevant, impact-driven experience most.</p>
      </div>
      <div class="stat-card">
        <h3>Education & Certifications</h3>
        <div class="percent">55%</div>
        <p>Degrees or certifications enhance credibility.</p>
      </div>
      <div class="stat-card">
        <h3>Projects & Portfolios</h3>
        <div class="percent">42%</div>
        <p>Personal projects and GitHub links stand out.</p>
      </div>
      <div class="stat-card">
        <h3>ATS Optimization</h3>
        <div class="percent">60%</div>
        <p>60% of resumes are rejected by Applicant Tracking Systems.</p>
      </div>
    </div>

<div class="careers">
      <h2>Explore Tech Career Paths</h2>
      <p>Click a career below to learn about its key responsibilities, skills, and resume focus.</p>

<!-- Template for each career -->
<div class="career">
        <button onclick="toggleCareer(this)">Software Engineer</button>
        <div class="career-content">
          <div class="career-columns">
            <div>
              <h4>Responsibilities</h4>
              <ul>
                <li>Writing, testing, and maintaining code</li>
                <li>Designing and implementing software solutions</li>
                <li>Collaborating with teams to fix issues</li>
                <li>Writing efficient, scalable, maintainable code</li>
              </ul>
            </div>
            <div>
              <h4>Key Skills</h4>
              <ul>
                <li>Java, C++, Python, JavaScript</li>
                <li>React, Angular, Django</li>
                <li>Git, Data Structures, SQL/NoSQL</li>
              </ul>
            </div>
            <div>
              <h4>Resume Focus</h4>
              <ul>
                <li>Highlight tech stacks</li>
                <li>Showcase personal/academic projects</li>
                <li>List measurable achievements</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

<div class="career">
        <button onclick="toggleCareer(this)">Data Scientist</button>
        <div class="career-content">
          <div class="career-columns">
            <div>
              <h4>Responsibilities</h4>
              <ul>
                <li>Analyze datasets and identify trends</li>
                <li>Build predictive ML models</li>
                <li>Communicate insights via visualization</li>
              </ul>
            </div>
            <div>
              <h4>Key Skills</h4>
              <ul>
                <li>Python, R, SQL</li>
                <li>Machine learning, data visualization</li>
                <li>Big data tools (Hadoop, Spark)</li>
              </ul>
            </div>
            <div>
              <h4>Resume Focus</h4>
              <ul>
                <li>Show ML library experience</li>
                <li>Include Kaggle/personal projects</li>
                <li>Quantify accuracy improvements</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

<div class="career">
        <button onclick="toggleCareer(this)">DevOps Engineer</button>
        <div class="career-content">
          <div class="career-columns">
            <div>
              <h4>Responsibilities</h4>
              <ul>
                <li>Automate deployments</li>
                <li>Manage cloud infrastructure</li>
                <li>Monitor and maintain systems</li>
              </ul>
            </div>
            <div>
              <h4>Key Skills</h4>
              <ul>
                <li>CI/CD tools (Jenkins, GitLab CI)</li>
                <li>Cloud (AWS, Azure, GCP)</li>
                <li>Docker, Kubernetes, Terraform</li>
              </ul>
            </div>
            <div>
              <h4>Resume Focus</h4>
              <ul>
                <li>Highlight cloud certifications</li>
                <li>Show automation experience</li>
                <li>Include infrastructure tools</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

<div class="career">
        <button onclick="toggleCareer(this)">Cybersecurity Analyst</button>
        <div class="career-content">
          <div class="career-columns">
            <div>
              <h4>Responsibilities</h4>
              <ul>
                <li>Protect company infrastructure</li>
                <li>Monitor networks for vulnerabilities</li>
                <li>Conduct risk assessments</li>
              </ul>
            </div>
            <div>
              <h4>Key Skills</h4>
              <ul>
                <li>Firewalls, VPNs, IDS</li>
                <li>Encryption and forensics</li>
                <li>Security certifications (CISSP, CEH)</li>
              </ul>
            </div>
            <div>
              <h4>Resume Focus</h4>
              <ul>
                <li>Certifications (CISSP, CEH)</li>
                <li>Incident response experience</li>
                <li>Security tool proficiency</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

<div class="career">
        <button onclick="toggleCareer(this)">Product Manager (Tech)</button>
        <div class="career-content">
          <div class="career-columns">
            <div>
              <h4>Responsibilities</h4>
              <ul>
                <li>Oversee product development</li>
                <li>Define vision and strategy</li>
                <li>Collaborate across teams</li>
              </ul>
            </div>
            <div>
              <h4>Key Skills</h4>
              <ul>
                <li>Agile, Scrum methodologies</li>
                <li>Leadership, communication</li>
                <li>Roadmap planning</li>
              </ul>
            </div>
            <div>
              <h4>Resume Focus</h4>
              <ul>
                <li>Project management tools (JIRA, Asana)</li>
                <li>Cross-functional leadership</li>
                <li>Quantify product impact</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

<div class="career">
        <button onclick="toggleCareer(this)">UX/UI Designer</button>
        <div class="career-content">
          <div class="career-columns">
            <div>
              <h4>Responsibilities</h4>
              <ul>
                <li>Design web/app interfaces</li>
                <li>Create wireframes and prototypes</li>
                <li>Conduct user testing</li>
              </ul>
            </div>
            <div>
              <h4>Key Skills</h4>
              <ul>
                <li>Figma, Sketch, Adobe XD</li>
                <li>User research, prototyping</li>
                <li>HTML/CSS basics</li>
              </ul>
            </div>
            <div>
              <h4>Resume Focus</h4>
              <ul>
                <li>Include portfolio link</li>
                <li>Emphasize A/B testing</li>
                <li>Highlight collaboration</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

</div>

<div class="insights">
      <h2>2024 Tech Hiring Insights</h2>
      <ul>
        <li><strong>Cloud Jobs:</strong> 50% of tech roles require cloud skills.</li>
        <li><strong>Machine Learning:</strong> Demand up 30% in two years.</li>
        <li><strong>Cybersecurity:</strong> 30% global talent shortage.</li>
      </ul>
    </div>

<div class="footer-quote">
      “Your resume is your first interview — make it unforgettable.”
    </div>

    <!-- ✅ Added Next Module Button -->
  <div class="next-module">
      <a href="{{site.baseurl}}/cs-portfolio-quest/resume/submodule_2/">Next Module →</a>
    </div>

  </div>

  <script>
    function toggleCareer(button) {
      const content = button.nextElementSibling;
      content.classList.toggle("open");
    }
  </script>

