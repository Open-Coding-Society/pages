---
layout: post
tailwind: True
title: "Analytics and Certificates Hub"
description: "A consolidated module for viewing analytics, managing certificates, and completing the mastery quest."
author: "CSA 2025-26"
permalink: /bigsix/analytics_module
---

<style>
  /* Styles from submodule_2.md */
  .cert-container {
    max-width: 1200px;
    margin: 0 auto;
  }
  .section-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .certificates-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
  }
  .cert-card {
    border-radius: 12px;
    padding: 2rem;
    position: relative;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .cert-card:hover {
    transform: translateY(-4px);
  }
  .cert-red {
    background: linear-gradient(135deg, #d94a38 0%, #c23b2a 100%);
    box-shadow: 0 4px 12px rgba(217, 74, 56, 0.3);
  }
  .cert-red:hover {
    box-shadow: 0 8px 20px rgba(217, 74, 56, 0.4);
  }
  .cert-orange {
    background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
    box-shadow: 0 4px 12px rgba(243, 156, 18, 0.3);
  }
  .cert-orange:hover {
    box-shadow: 0 8px 20px rgba(243, 156, 18, 0.4);
  }
  .cert-purple {
    background: linear-gradient(135deg, #8e44ad 0%, #6c3483 100%);
    box-shadow: 0 4px 12px rgba(142, 68, 173, 0.3);
  }
  .cert-purple:hover {
    box-shadow: 0 8px 20px rgba(142, 68, 173, 0.4);
  }
  .cert-teal {
    background: linear-gradient(135deg, #16a085 0%, #138d75 100%);
    box-shadow: 0 4px 12px rgba(22, 160, 133, 0.32);
  }
  .cert-teal:hover {
    box-shadow: 0 10px 26px rgba(22, 160, 133, 0.4);
    transform: translateY(-4px);
  }
  .cert-yellow {
    background: linear-gradient(135deg, #f1c40f 0%, #d4ac0d 100%);
    box-shadow: 0 4px 12px rgba(241, 196, 15, 0.28);
    color: #111;
  }
  .cert-yellow:hover {
    box-shadow: 0 10px 26px rgba(241, 196, 15, 0.36);
    transform: translateY(-4px);
  }
  .cert-green {
    background: linear-gradient(135deg, #1a7336ff 0%, #348340ff 100%);
    box-shadow: 0 4px 12px rgba(75, 173, 68, 0.3); grid-column: 1 / -1;
  }
  .cert-badge {
    background: rgba(0, 0, 0, 0.2);
    color: #fff;
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 600;
    display: inline-block;
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .cert-title {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
    line-height: 1.3;
  }
  .cert-org {
    font-size: 0.95rem;
    opacity: 0.9;
    margin-bottom: 0.25rem;
  }
  .cert-date {
    font-size: 0.85rem;
    opacity: 0.8;
    margin-bottom: 1.25rem;
  }
  .cert-actions {
    display: flex;
    gap: 0.75rem;
  }
  .btn {
    padding: 0.6rem 1.25rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s;
  }
  .btn-download {
    background: rgba(0, 0, 0, 0.25);
    color: #fff;
  }
  .btn-download:hover {
    background: rgba(0, 0, 0, 0.35);
  }
  .btn-share {
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
  }
  .btn-share:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  #certCanvas {
    display: none;
  }

  /* Styles from submodule_3.md */
  .analytics-container {
    background-color: #121212;
    color: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    padding: 2rem;
    min-height: 100vh;
  }
  .page-title {
    font-size: 2rem;
    color: #ea8c33;
    margin-bottom: 2rem;
    font-weight: bold;
  }
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  .metric-card {
    background: #1e1e1e;
    border-radius: 12px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    border: 1px solid #2a2a2a;
  }
  .metric-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .metric-title {
    color: #b0b0b0;
    font-size: 0.9rem;
  }
  .metric-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
  }
  .metric-value {
    font-size: 2.5rem;
    font-weight: bold;
    margin: 0.5rem 0;
    color: #ea8c33;
  }
  .metric-subtitle {
    color: #808080;
    font-size: 0.85rem;
  }
  .toolbar {
    background: #1e1e1e;
    padding: 1rem 1.5rem;
    margin-bottom: 1.5rem;
    border: 1px solid #2a2a2a;
    border-radius: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .toolbar-title {
    font-size: 1.3rem;
    font-weight: bold;
    color: #ea8c33;
  }
  .download-btn {
    background: linear-gradient(135deg, #ea8c33 0%, #d67324 100%);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 12px rgba(234, 140, 51, 0.3);
    font-weight: 600;
  }
  .download-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(234, 140, 51, 0.4);
  }
  .table-container {
    background: #1e1e1e;
    border: 1px solid #2a2a2a;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 2rem;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  thead {
    background: #252525;
    border-bottom: 2px solid #ea8c33;
  }
  th {
    padding: 1rem 0.75rem;
    text-align: left;
    font-weight: bold;
    color: #ea8c33;
    font-size: 0.9rem;
    cursor: pointer;
    user-select: none;
    border-right: 1px solid #2a2a2a;
    transition: background 0.2s;
  }
  th:last-child {
    border-right: none;
  }
  th:hover {
    background: #2e2e2e;
  }
  th.center {
    text-align: center;
  }
  .sort-indicator {
    display: inline-block;
    margin-left: 0.25rem;
    font-size: 0.7rem;
    opacity: 0.5;
  }
  th.active .sort-indicator {
    opacity: 1;
    color: #ea8c33;
  }
  tbody tr {
    border-bottom: 1px solid #2a2a2a;
    cursor: pointer;
    transition: background 0.2s;
  }
  tbody tr:hover {
    background: #252525;
  }
  tbody tr.expanded {
    background: #272727;
  }
  td {
    padding: 1rem 0.75rem;
    font-size: 0.9rem;
    border-right: 1px solid #2a2a2a;
  }
  td:last-child {
    border-right: none;
  }
  td.center {
    text-align: center;
  }
  .student-name {
    color: #ea8c33;
    font-weight: 600;
  }
  .grade-display {
    display: inline-block;
    min-width: 45px;
    text-align: center;
    font-weight: bold;
    font-size: 1rem;
  }
  .grade-a { color: #10b981; }
  .grade-b { color: #3b82f6; }
  .grade-c { color: #f59e0b; }
  .grade-d { color: #ef4444; }
  .grade-f { color: #dc2626; }
  .grade-none { color: #6b7280; }
  .progress-info {
    font-size: 0.75rem;
    color: #808080;
    margin-top: 0.25rem;
  }
  .progress-bar-container {
    width: 100%;
    max-width: 100px;
    height: 8px;
    background: #2a2a2a;
    border-radius: 4px;
    margin: 0.25rem auto;
    overflow: hidden;
  }
  .progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #ea8c33 0%, #d67324 100%);
    transition: width 0.3s;
    border-radius: 4px;
  }
  .detail-row {
    display: none;
    background: #1a1a1a;
    border-top: 2px solid #ea8c33;
  }
  .detail-row.active {
    display: table-row;
  }
  .detail-content {
    padding: 2rem;
  }
  .detail-header {
    font-size: 1.3rem;
    font-weight: bold;
    color: #ea8c33;
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid #ea8c33;
  }
  .modules-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  .module-box {
    background: #252525;
    border: 1px solid #2a2a2a;
    border-radius: 8px;
    padding: 1.25rem;
  }
  .module-box h4 {
    color: #ea8c33;
    font-size: 1.1rem;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid #2a2a2a;
    font-weight: 600;
  }
  .lesson-item {
    display: flex;
    justify-content: space-between;
    padding: 0.6rem 0;
    font-size: 0.9rem;
    border-bottom: 1px solid #1e1e1e;
  }
  .lesson-item:last-child {
    border-bottom: none;
  }
  .lesson-label {
    color: #b0b0b0;
  }
  .module-summary {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 2px solid #2a2a2a;
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    color: #ea8c33;
    font-size: 1rem;
  }
  .info-box {
    background: #1e1e1e;
    border: 1px solid #2a2a2a;
    border-radius: 12px;
    padding: 1.5rem;
    margin-top: 2rem;
  }
  .info-box h3 {
    font-size: 1rem;
    color: #ea8c33;
    margin-bottom: 1rem;
    font-weight: 600;
  }
  .legend-grid {
    display: flex;
    gap: 2rem;
    font-size: 0.9rem;
    flex-wrap: wrap;
  }
  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .legend-color {
    width: 16px;
    height: 16px;
    border-radius: 3px;
    border: 1px solid #2a2a2a;
  }
  .expand-icon {
    display: inline-block;
    margin-right: 0.5rem;
    font-size: 0.8rem;
    color: #ea8c33;
    transition: transform 0.2s;
  }
  tr.expanded .expand-icon {
    transform: rotate(90deg);
  }
</style>

## Admin Analytics Dashboard
This dashboard provides a comprehensive overview of student performance for administrators and teachers. At the top, you'll find key real-time metrics such as the class average grade, the average number of modules completed per student, the top-performing student, and the overall progress rate of the class. Below the metrics, the interactive gradebook table lists all students and their progress and average grade for each module. You can sort the table by clicking on the column headers or click on a student's row to expand it and view a detailed breakdown of their grades for each lesson. You can also export the entire gradebook as a CSV file for your records.

<div class="analytics-container">
  <h1 class="page-title">Student Grading Overview</h1>
  <div class="metrics-grid">
    <div class="metric-card">
      <div class="metric-header">
        <span class="metric-title">Class Average</span>
        <div class="metric-icon" style="background: rgba(234, 140, 51, 0.2);">📊</div>
      </div>
      <div class="metric-value" id="class-average">84.5%</div>
      <div class="metric-subtitle" id="students-enrolled">6 students enrolled</div>
    </div>
    <div class="metric-card">
      <div class="metric-header">
        <span class="metric-title">Average Modules Completed</span>
        <div class="metric-icon" style="background: rgba(16, 185, 129, 0.2);">✅</div>
      </div>
      <div class="metric-value" id="modules-completed">0</div>
      <div class="metric-subtitle">Out of 25 total</div>
    </div>
    <div class="metric-card">
      <div class="metric-header">
        <span class="metric-title">Top Performer</span>
        <div class="metric-icon" style="background: rgba(59, 130, 246, 0.2);">🏆</div>
      </div>
      <div class="metric-value" id="top-grade">96%</div>
      <div class="metric-subtitle" id="top-scorer">Patel, Priya</div>
    </div>
    <div class="metric-card">
      <div class="metric-header">
        <span class="metric-title">Progress Rate</span>
        <div class="metric-icon" style="background: rgba(139, 92, 246, 0.2);">📈</div>
      </div>
      <div class="metric-value" id="progress-percentage">0%</div>
      <div class="metric-subtitle">Average completion</div>
    </div>
  </div>
  <div class="toolbar">
    <div class="toolbar-title">Class Gradebook</div>
    <button class="download-btn" onclick="downloadReport()">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
      Export Report
    </button>
  </div>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th onclick="sortTable('name')" id="th-name" class="active">
            Student Name
            <span class="sort-indicator">▼</span>
          </th>
          <th class="center" onclick="sortTable('module1')" id="th-module1">
            Module 1
            <span class="sort-indicator">▼</span>
          </th>
          <th class="center" onclick="sortTable('module2')" id="th-module2">
            Module 2
            <span class="sort-indicator">▼</span>
          </th>
          <th class="center" onclick="sortTable('module3')" id="th-module3">
            Module 3
            <span class="sort-indicator">▼</span>
          </th>
          <th class="center" onclick="sortTable('module4')" id="th-module4">
            Module 4
            <span class="sort-indicator">▼</span>
          </th>
          <th class="center" onclick="sortTable('module5')" id="th-module5">
            Module 5
            <span class="sort-indicator">▼</span>
          </th>
          <th class="center">Overall</th>
        </tr>
      </thead>
      <tbody id="tableBody">
      </tbody>
    </table>
  </div>
  <div class="info-box">
    <h3>Grading Scale</h3>
    <div class="legend-grid">
      <div class="legend-item">
        <div class="legend-color" style="background: #10b981;"></div>
        <span>A (90-100%)</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background: #3b82f6;"></div>
        <span>B (80-89%)</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background: #f59e0b;"></div>
        <span>C (70-79%)</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background: #ef4444;"></div>
        <span>D (60-69%)</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background: #dc2626;"></div>
        <span>F (Below 60%)</span>
      </div>
    </div>
  </div>
</div>

## Free Response Question
Test your knowledge with a free-response question. This interactive section presents you with a question related to the analytics concepts. You can type your answer in the text box and click the 'Grade' button to submit it to an AI-powered grading system. You will receive instant feedback on your response.

<div class="frq-box" id="quest-frq" style="border:1px solid #2c2c2e; padding:1rem; border-radius:8px; margin:1.5rem 0; background:#1c1c1e; color:#e5e5ea; font-weight:300;">
  <b>FRQ:</b> <span id="frq-question">Placeholder FRQ: Describe what analytics or metrics you aim to collect and how you’ll present them.</span><br><br>
  <textarea id="frq-answer" rows="5" placeholder="Type your response here..." style="width:100%; border-radius:6px; border:1px solid #3a3a3c; padding:0.5rem; margin-top:0.5rem; background:#2c2c2e; color:#f2f2f7;"></textarea>
  <p></p>
  <button id="frq-grade-btn" style="margin-top:10px; background:#2c2c2e; color:#e5e5ea; border:1px solid #3a3a3c; padding:0.4rem 0.75rem; border-radius:6px;">Grade</button>
  <div id="frq-feedback"></div>
</div>

## Certificates and Badges
Once you have demonstrated mastery by completing the required modules, you can claim your certificates here. This section displays the individual certificates you have earned for each module, as well as your overall CS Portfolio Mastery Certificate. You can download each certificate as a high-quality PNG image to save for your records. Additionally, you can easily share your achievements on your LinkedIn profile by clicking the 'Add to LinkedIn' button, which will pre-populate the certificate information for you.

<div class="cert-container">
  <h2 class="section-title">Individual Module Certificates</h2>
  <div class="certificates-grid">
    <div class="cert-card cert-orange">
      <span class="cert-badge">Verified</span>
      <h3 class="cert-title">Frontend Development</h3>
      <div class="cert-org">Open Coding Society</div>
      <div class="cert-date">November 2025</div>
      <div class="cert-actions">
        <button class="btn btn-download" onclick="downloadCert('Frontend Development', 'Open Coding Society', 'November 2025')">⬇ Download</button>
      </div>
    </div>
    <div class="cert-card cert-red">
      <span class="cert-badge">Verified</span>
      <h3 class="cert-title">Backend Development</h3>
      <div class="cert-org">Open Coding Society</div>
      <div class="cert-date">November 2025</div>
      <div class="cert-actions">
        <button class="btn btn-download" onclick="downloadCert('Backend Development', 'Open Coding Society', 'November 2025')">⬇ Download</button>
      </div>
    </div>
    <div class="cert-card cert-purple">
      <span class="cert-badge">Verified</span>
      <h3 class="cert-title">Data Visualization</h3>
      <div class="cert-org">Open Coding Society</div>
      <div class="cert-date">November 2025</div>
      <div class="cert-actions">
        <button class="btn btn-download" onclick="downloadCert('Data Visualization', 'Open Coding Society', 'November 2025')">⬇ Download</button>
      </div>
    </div>
    <div class="cert-card cert-teal">
      <span class="cert-badge">Verified</span>
      <h3 class="cert-title">Resume Building</h3>
      <div class="cert-org">Open Coding Society</div>
      <div class="cert-date">November 2025</div>
      <div class="cert-actions">
        <button class="btn btn-download" onclick="downloadCert('Resume Building', 'Open Coding Society', 'November 2025')">⬇ Download</button>
      </div>
    </div>
    <div class="cert-card cert-yellow">
      <span class="cert-badge">Verified</span>
      <h3 class="cert-title">AI Usage</h3>
      <div class="cert-org">Open Coding Society</div>
      <div class="cert-date">November 2025</div>
      <div class="cert-actions">
        <button class="btn btn-download" onclick="downloadCert('AI Usage', 'Open Coding Society', 'November 2025')">⬇ Download</button>
      </div>
    </div>
  </div>
  <h2 class="section-title">Overall Certificate</h2>
  <div class="certificates-grid">
    <div class="cert-card cert-green" >
      <span class="cert-badge">Verified</span>
      <h3 class="cert-title">Overall CS Portfolio Certificate</h3>
      <div class="cert-org">Open Coding Society</div>
      <div class="cert-date">November 2025</div>
      <div class="cert-actions">
        <button class="btn btn-download" onclick="downloadCert('Computer Science Portfolio - Full Stack Development', 'Open Coding Society', 'November 2025')">⬇ Download</button>
        <button class="btn btn-share" onclick="addToLinkedIn('Computer Science Portfolio - Full Stack Development Java Usage')">Add to LinkedIn</button>
      </div>
    </div>
  </div>
</div>
<canvas id="certCanvas"></canvas>

<script type="module">
  // Combined script from all submodules

  // --- From submodule_2.md (Certificates) ---
  (async () => {
    try {
      const cfg = await import('{{ site.baseurl }}/assets/js/api/config.js');
      const { pythonURI, fetchOptions } = cfg;

      async function getCredentials() {
        try {
          const res = await fetch(`${pythonURI}/api/id`, {
            ...fetchOptions,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
          if (res.ok) {
            const data = await res.json();
            return data.name || 'Student Name';
          }
        } catch (err) {
          console.log(`Error fetching credentials: ${err}`);
        }
        return 'Student Name';
      }

      window.downloadCert = async function(course, org, date) {
        const name = await getCredentials();
        const canvas = document.getElementById('certCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 1400;
        canvas.height = 1000;
        ctx.fillStyle = '#f8f6f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 25;
        ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);
        ctx.strokeStyle = '#c9b037';
        ctx.lineWidth = 3;
        ctx.strokeRect(80, 80, canvas.width - 160, canvas.height - 160);
        ctx.fillStyle = '#c9b037';
        ctx.beginPath();
        ctx.arc(80, 80, 15, 0, Math.PI * 2);
        ctx.arc(canvas.width - 80, 80, 15, 0, Math.PI * 2);
        ctx.arc(80, canvas.height - 80, 15, 0, Math.PI * 2);
        ctx.arc(canvas.width - 80, canvas.height - 80, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 60px Georgia';
        ctx.textAlign = 'center';
        ctx.fillText('CERTIFICATE', canvas.width / 2, 200);
        ctx.font = 'bold 48px Georgia';
        ctx.fillText('OF COMPLETION', canvas.width / 2, 260);
        ctx.strokeStyle = '#c9b037';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(400, 290);
        ctx.lineTo(1000, 290);
        ctx.stroke();
        ctx.fillStyle = '#2c3e50';
        ctx.font = '28px Arial';
        ctx.fillText('This is to certify that', canvas.width / 2, 380);
        ctx.fillStyle = '#ea8c33';
        ctx.font = 'italic bold 52px Georgia';
        ctx.fillText(name, canvas.width / 2, 470);
        ctx.strokeStyle = '#ea8c33';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(400, 490);
        ctx.lineTo(1000, 490);
        ctx.stroke();
        ctx.fillStyle = '#2c3e50';
        ctx.font = '28px Arial';
        ctx.fillText('has successfully completed the course', canvas.width / 2, 560);
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 44px Arial';
        ctx.fillText(course, canvas.width / 2, 650);
        ctx.fillStyle = '#555';
        ctx.font = '26px Arial';
        ctx.fillText('Issued by ' + org, canvas.width / 2, 710);
        const issuanceDate = new Date();
        const formattedDate = issuanceDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 24px Arial';
        ctx.fillText('Date: ' + formattedDate, canvas.width / 2, 800);
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(500, 880);
        ctx.lineTo(900, 880);
        ctx.stroke();
        ctx.fillStyle = '#555';
        ctx.font = 'bold 48px Georgia';
        ctx.fillText('John Mortenson', canvas.width / 2, 860);
        const link = document.createElement('a');
        link.download = `${course.replace(/\s+/g, '_')}_Certificate.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }

      window.addToLinkedIn = function(courseName) {
        const certId = 'CSPORTFOLIO-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        const url = new URL('https://www.linkedin.com/profile/add');
        url.searchParams.append('startTask', 'CERTIFICATION_NAME');
        url.searchParams.append('name', courseName);
        url.searchParams.append('organizationName', 'Open Coding Society');
        url.searchParams.append('issueYear', new Date().getFullYear());
        url.searchParams.append('issueMonth', new Date().getMonth() + 1);
        url.searchParams.append('certId', certId);
        url.searchParams.append('certUrl', window.location.origin + '/cs-portfolio-verify/' + certId);
        window.open(url.toString(), '_blank');
      }
    } catch (err) {
      console.error('Failed to initialize certificate downloader:', err);
    }
  })();

  // --- From submodule_3.md (Analytics Dashboard) ---
  (async () => {
    const { javaURI, pythonURI, fetchOptions } = await import('{{ site.baseurl }}/assets/js/api/config.js');

    async function getAdminCredentials() {
      try {
        const res = await fetch(`${pythonURI}/api/id`, { ...fetchOptions, method: "GET", headers: { "Content-Type": "application/json" } });
        if (res.ok) {
          const data = await res.json();
          return data.role;
        }
      } catch (err) { console.log(`Error: ${err}`); }
    }

    window.addEventListener('load', async () => {
      try {
        const role = await getAdminCredentials();
        if (role !== 'Admin') {
          // Hide admin-only content instead of redirecting
          const adminContent = document.querySelector('.analytics-container');
          if(adminContent) adminContent.innerHTML = '<h1>Access Denied</h1><p>You do not have permission to view this page.</p>';
        } else {
          mainAnalytics();
        }
      } catch (err) { console.error('Error checking credentials:', err); }
    });

    window.downloadReport = async function() {
      let csv = 'Student Name,Overall Average,Module 1 Progress,Module 1 Average,Module 2 Progress,Module 2 Average,Module 3 Progress,Module 3 Average,Module 4 Progress,Module 4 Average,Module 5 Progress,Module 5 Average\n';
      const data = await fetchPeople();
      const { students } = data;
      students.forEach(s => {
        const overall = calculateOverallAverage(s.modules);
        csv += [s.name, overall, s.modules['Module 1'].progress + '%', calculateModuleAverage(s.modules['Module 1']), s.modules['Module 2'].progress + '%', calculateModuleAverage(s.modules['Module 2']), s.modules['Module 3'].progress + '%', calculateModuleAverage(s.modules['Module 3']), s.modules['Module 4'].progress + '%', calculateModuleAverage(s.modules['Module 4']), s.modules['Module 5'].progress + '%', calculateModuleAverage(s.modules['Module 5'])].join(',') + '\n';
      });
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'studentvue_analytics_report.csv';
      a.click();
    }

    async function getLessonData() {
      try {
        const res = await fetch(`${javaURI}/api/stats`, { ...fetchOptions, method: "GET", headers: { "Content-Type": "application/json" } });
        if (!res.ok) return;
        return await res.json();
      } catch (err) { console.log(`Error: ${err}`); }
    }

    async function fetchPeople() {
      const students = [];
      const completions = [];
      const grades = [];
      let topScorer = { username: null, score: 0 };
      const lessonData = await getLessonData();

      for (let id = 1; id <= 75; id++) {
        try {
          const res = await fetch(`${javaURI}/api/person/${id}`, { ...fetchOptions, method: "GET", headers: { "Content-Type": "application/json" } });
          if (res.status === 404) continue;
          if (res.ok) {
            const data = await res.json();
            const filtered = lessonData.filter(item => item.username === data.uid);
            const lesson_modules = { 'AI Usage': 3, 'Backend Development': 6, 'Data Visualization': 3, 'Frontend Development': 6, 'Resume Building': 6 };
            const moduleStats = {};
            Object.keys(lesson_modules).forEach(m => { moduleStats[m] = { time: 0, percentComplete: 0 }; });
            const finishedCounts = {};
            Object.keys(lesson_modules).forEach(m => finishedCounts[m] = 0);
            filtered.forEach(item => {
              const mod = item.module;
              if (lesson_modules[mod] !== undefined) {
                moduleStats[mod].time += item.time || 0;
                if (item.finished) finishedCounts[mod] += 1;
              }
            });
            Object.keys(lesson_modules).forEach(m => {
              const totalSubmodules = lesson_modules[m];
              const finished = finishedCounts[m];
              moduleStats[m].percentComplete = (finished / totalSubmodules) * 100;
            });
            const frontendCompletion = moduleStats["Frontend Development"].percentComplete;
            const backendCompletion = moduleStats["Backend Development"].percentComplete;
            const datavizCompletion = moduleStats["Data Visualization"].percentComplete;
            const resumeCompletion = moduleStats["Resume Building"].percentComplete;
            const aiCompletion = moduleStats["AI Usage"].percentComplete;
            const averageCompletion = (frontendCompletion + backendCompletion + datavizCompletion + resumeCompletion + aiCompletion) / 5;
            completions.push(averageCompletion);
            const moduleGrades = {};
            Object.keys(lesson_modules).forEach(m => {
              const totalSubmodules = lesson_modules[m];
              const grades = [];
              for (let sub = 1; sub <= totalSubmodules; sub++) {
                const entry = filtered.find(item => item.module === m && item.submodule === sub);
                if (entry && entry.grades && typeof entry.grades === 'number') {
                  grades.push(entry.grades * 100);
                } else {
                  grades.push(55);
                }
              }
              moduleGrades[m] = grades;
            });
            const moduleAverages = Object.values(moduleGrades).map(arr => arr.reduce((a, b) => a + b, 0) / arr.length);
            const overallAverageGrade = moduleAverages.reduce((a, b) => a + b, 0) / moduleAverages.length;
            grades.push(overallAverageGrade);
            if (overallAverageGrade > topScorer.score) {
              topScorer.username = data.uid;
              topScorer.score = overallAverageGrade;
            }
            const modules = { "Module 1": { progress: frontendCompletion, lessons: moduleGrades["Frontend Development"] }, "Module 2": { progress: backendCompletion, lessons: moduleGrades["Backend Development"] }, "Module 3": { progress: datavizCompletion, lessons: moduleGrades["Data Visualization"] }, "Module 4": { progress: resumeCompletion, lessons: moduleGrades["Resume Building"] }, "Module 5": { progress: aiCompletion, lessons: moduleGrades["AI Usage"] } };
            students.push({ id: data.id, name: data.name, modules });
          }
        } catch (err) { console.log(err); }
      }
      return { students, completions, grades, topScorer };
    }

    function calculateModuleAverage(moduleData) {
      const completed = moduleData.lessons.filter(s => s > 0);
      if (completed.length === 0) return 0;
      return Math.round(completed.reduce((a, b) => a + b, 0) / completed.length);
    }

    function calculateOverallAverage(modules) {
      let total = 0, count = 0;
      Object.values(modules).forEach(m => { m.lessons.forEach(s => { if (s > 0) { total += s; count++; } }); });
      return count > 0 ? Math.round(total / count) : 0;
    }

    async function mainAnalytics() {
      const data = await fetchPeople();
      const { students, completions, grades, topScorer } = data;
      const percentageAverage = completions.length > 0 ? completions.reduce((sum, value) => sum + value, 0) / completions.length : 0;
      const modulesCompletedAverage = 25 * percentageAverage / 100;
      const gradesAverage = grades.length > 0 ? grades.reduce((sum, value) => sum + value, 0) / grades.length : 0;
      const displayPercentage = Number(percentageAverage).toFixed(2);
      const displayModulesCompleted = Number(modulesCompletedAverage).toFixed(2);
      const displayGradesAveraged = Number(gradesAverage).toFixed(2);
      
      document.getElementById("progress-percentage").innerText = `${displayPercentage}%`;
      document.getElementById("modules-completed").innerText = `${displayModulesCompleted}`;
      document.getElementById("students-enrolled").innerText = `${students.length} students enrolled`;
      document.getElementById("class-average").innerText = `${displayGradesAveraged}%`;
      document.getElementById("top-grade").innerText = `${topScorer.score}%`;
      document.getElementById("top-scorer").innerText = `${topScorer.username}`;

      let currentSort = { key: 'name', direction: 'asc' };
      let expandedRow = null;

      function getGradeClass(score) {
        if (score >= 90) return 'grade-a';
        if (score >= 80) return 'grade-b';
        if (score >= 70) return 'grade-c';
        if (score >= 60) return 'grade-d';
        if (score > 0) return 'grade-f';
        return 'grade-none';
      }

      function renderTable() {
        const tbody = document.getElementById('tableBody');
        tbody.innerHTML = '';
        const sorted = [...students].sort((a, b) => {
          if (currentSort.key === 'name') {
            return currentSort.direction === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
          } else {
            const moduleKey = 'Module ' + currentSort.key.slice(-1);
            const avgA = calculateModuleAverage(a.modules[moduleKey]);
            const avgB = calculateModuleAverage(b.modules[moduleKey]);
            return currentSort.direction === 'asc' ? avgA - avgB : avgB - avgA;
          }
        });
        sorted.forEach(student => {
          const overall = calculateOverallAverage(student.modules);
          const isExpanded = expandedRow === student.id;
          const row = document.createElement('tr');
          row.onclick = () => toggleDetails(student.id);
          if (isExpanded) row.classList.add('expanded');
          let html = `<td><span class="expand-icon">${isExpanded ? '▼' : '▶'}</span><span class="student-name">${student.name}</span></td>`;
          Object.entries(student.modules).forEach(([name, data]) => {
            const avg = calculateModuleAverage(data);
            html += `<td class="center"><div class="grade-display ${getGradeClass(avg)}">${avg > 0 ? avg + '%' : '--'}</div><div class="progress-bar-container"><div class="progress-bar" style="width: ${data.progress.toFixed(2)}%"></div></div><div class="progress-info">${data.progress.toFixed(2)}% Complete</div></td>`;
          });
          html += `<td class="center"><div class="grade-display ${getGradeClass(overall)}" style="font-size: 1.2rem;">${overall}%</div></td>`;
          row.innerHTML = html;
          tbody.appendChild(row);
          const detailRow = document.createElement('tr');
          detailRow.className = 'detail-row';
          if (isExpanded) detailRow.classList.add('active');
          detailRow.id = `detail-${student.id}`;
          detailRow.innerHTML = `<td colspan="7"><div class="detail-content"><div class="detail-header">Grade Details - ${student.name}</div><div class="modules-grid">${Object.entries(student.modules).map(([name, data]) => `<div class="module-box"><h4>${name}</h4>${data.lessons.map((score, i) => `<div class="lesson-item"><span class="lesson-label">Lesson ${i + 1}</span><span class="grade-display ${getGradeClass(score)}">${score > 0 ? score + '%' : 'Not Started'}</span></div>`).join('')}<div class="module-summary"><span>Module Average:</span><span class="${getGradeClass(calculateModuleAverage(data))}">${calculateModuleAverage(data) > 0 ? calculateModuleAverage(data) + '%' : '--'}</span></div></div>`).join('')}</div></div></td>`;
          tbody.appendChild(detailRow);
        });
      }

      function toggleDetails(id) {
        expandedRow = expandedRow === id ? null : id;
        renderTable();
      }

      window.sortTable = function(key) {
        if (currentSort.key === key) {
          currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
          currentSort = { key, direction: 'asc' };
        }
        document.querySelectorAll('th').forEach(th => th.classList.remove('active'));
        document.getElementById('th-' + key).classList.add('active');
        renderTable();
      }
      renderTable();
    }
  })();

  // --- From questHome.md (FRQ) ---
  (async () => {
    const { javaURI } = await import('{{ site.baseurl }}/assets/js/api/config.js');
    const btn = document.getElementById('frq-grade-btn');
    btn.addEventListener('click', async () => {
      const q = document.getElementById('frq-question').textContent.trim();
      const a = document.getElementById('frq-answer').value.trim();
      const fb = document.getElementById('frq-feedback');
      if (!a) { fb.innerHTML = '<span style="color:red;">Please enter your response before submitting.</span>'; return; }
      btn.disabled = true;
      fb.innerHTML = 'Grading...';
      try {
        const res = await fetch(`${javaURI}/api/gemini-frq/grade`, {
          method: 'POST',
          mode: 'cors',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: q, answer: a })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const result = await res.json();
        let feedbackText = '';
        try {
          feedbackText = result.candidates?.[0]?.content?.parts?.[0]?.text || result.feedback || JSON.stringify(result);
        } catch(_) {}
        const formatted = (feedbackText || 'No feedback returned.').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g,'<br>');
        fb.innerHTML = formatted;
      } catch (e) {
        fb.innerHTML = `<span style="color:red;">An error occurred while grading. Please try again. (${e.message})</span>`;
      } finally {
        btn.disabled = false;
      }
    });
  })();
</script>