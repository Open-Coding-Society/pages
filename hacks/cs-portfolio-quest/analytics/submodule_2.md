---
layout: certchatbot
title: "Submodule 2: Certificates and Badges"
description: "Submodule 2 of Analytics/Admin Mini-Quest"
permalink: /cs-portfolio-quest/analytics/submodule_2/
parent: "Analytics/Admin"
team: "Curators"
submodule: 2
categories: [CSP, Submodule, Analytics/Admin]
tags: [analytics, submodule, curators]
author: "Curators Team"
date: 2025-10-21
microblog: true
---

# Submodule 2: Certfication

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    background-color: #121212;
    color: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    padding: 2rem;
    min-height: 100vh;
  }
  .container {
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
  .cert-yellow:hover {
    box-shadow: 0 10px 26px rgba(15, 241, 102, 0.36);
    transform: translateY(-4px);
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
  .skills-card {
    background: #1e1e1e;
    border-radius: 12px;
    padding: 2rem;
    margin-bottom: 2rem;
  }
  .skill-item {
    margin-bottom: 1.75rem;
  }
  .skill-item:last-child {
    margin-bottom: 0;
  }
  .skill-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
    font-size: 0.95rem;
  }
  .skill-name {
    font-weight: 600;
    color: #ffffff;
  }
  .skill-percentage {
    font-weight: 700;
    color: #ea8c33;
  }
  .skill-bar {
    background: #2a2a2a;
    height: 10px;
    border-radius: 6px;
    overflow: hidden;
    position: relative;
  }
  .skill-progress {
    height: 100%;
    background: linear-gradient(90deg, #ea8c33 0%, #d67324 100%);
    border-radius: 6px;
    transition: width 0.3s ease;
    box-shadow: 0 0 8px rgba(234, 140, 51, 0.5);
  }
  .badges-card {
    background: #1e1e1e;
    border-radius: 12px;
    padding: 2rem;
    margin-bottom: 2rem;
  }
  .badges-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  .badge {
    padding: 1rem 1.5rem;
    border-radius: 10px;
    font-size: 0.9rem;
    font-weight: 600;
    text-align: center;
    border: 2px solid;
    transition: transform 0.2s, box-shadow 0.2s;
    cursor: default;
  }
  .badge:hover {
    transform: translateY(-2px);
  }
  .badge-red {
    background: linear-gradient(135deg, #c0392b 0%, #a93226 100%);
    border-color: #e74c3c;
    box-shadow: 0 2px 8px rgba(231, 76, 60, 0.3);
  }
  .badge-red:hover {
    box-shadow: 0 4px 12px rgba(231, 76, 60, 0.4);
  }
  .badge-orange {
    background: linear-gradient(135deg, #d68910 0%, #bf790f 100%);
    border-color: #f39c12;
    box-shadow: 0 2px 8px rgba(243, 156, 18, 0.3);
  }
  .badge-orange:hover {
    box-shadow: 0 4px 12px rgba(243, 156, 18, 0.4);
  }
  .badge-purple {
    background: linear-gradient(135deg, #6c3483 0%, #5b2c6f 100%);
    border-color: #8e44ad;
    box-shadow: 0 2px 8px rgba(142, 68, 173, 0.3);
  }
  .badge-purple:hover {
    box-shadow: 0 4px 12px rgba(142, 68, 173, 0.4);
  }
  .badge-teal {
    background: linear-gradient(135deg, #138d75 0%, #117864 100%);
    border-color: #16a085;
    box-shadow: 0 2px 8px rgba(22, 160, 133, 0.3);
  }
  .badge-teal:hover {
    box-shadow: 0 4px 12px rgba(22, 160, 133, 0.4);
  }
  .badge-yellow {
    background: linear-gradient(135deg, #d4ac0d 0%, #b7950b 100%);
    border-color: #f1c40f;
    box-shadow: 0 2px 8px rgba(241, 196, 15, 0.3);
  }
  .badge-yellow:hover {
    box-shadow: 0 4px 12px rgba(241, 196, 15, 0.4);
  }
  .badges-footer {
    font-size: 0.9rem;
    color: #b0b0b0;
  }
  #certCanvas {
    display: none;
  }
  @media (max-width: 768px) {
    body {
      padding: 1rem;
    }
    .certificates-grid {
      grid-template-columns: 1fr;
    }
    .badges-grid {
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    }
    .section-title {
      font-size: 1.25rem;
    }
  }
  #lessonCompleteButton {
    display: none !important;
  }

</style>

<div class="container">
  
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

  
<!-- Instructional Card -->
<div style="
  width: 100%;
  background-color: #121212;
  border: 1px solid #d1d9e0;
  border-radius: 16px;
  padding: 24px;
  margin-top: 40px;
  box-shadow: 0 2px 8px rgba(117, 47, 47, 0.08);
  font-family: 'Segoe UI', Tahoma, sans-serif;
  line-height: 1.6;
">

  <h2 style="text-align: center; color: #004182;">How to Fill Out Your Certification</h2>

  <!-- Screenshot image -->
  <center><img src="{{site.baseurl}}/images/cs-portfolio-quest/analytics/LinkdenReqs.png" height="625"></center>


  <p style="text-align: center; max-width: 800px; margin: 0 auto 20px auto;">
    Use the example above as a reference when adding your certification on LinkedIn. Below is a guide explaining what to fill out in each section.
  </p>

  <ul style="list-style-type: none; padding-left: 0; max-width: 800px; margin: 0 auto;">
    <li><strong>Name:</strong> Enter the official title of your certificate (e.g., “Python Data Analysis Certificate” or “AWS Certified Developer”).</li>
    <li><strong>Issuing Organization:</strong> Type the name of the organization that granted the certificate (e.g., “Coursera,” “Google,” “Microsoft”).</li>
    <li><strong>Issue Date:</strong> Select the month and year when you received your certification.</li>
    <li><strong>Expiration Date:</strong> Leave this blank if the certification never expires, or fill in the date when it becomes invalid.</li>
    <li><strong>Credential ID:</strong> If your certificate includes a unique ID number, enter it here. Otherwise, you can leave it empty.</li>
    <li><strong>Credential URL:</strong> Paste the link where your certificate can be verified or viewed online (for example, the public certificate link from your organization).</li>
  </ul>

  <h3 style="color: #004182; margin-top: 30px; text-align: center;">Optional Sections</h3>
  <ul style="list-style-type: none; padding-left: 0; max-width: 800px; margin: 0 auto;">
    <li><strong>Skills:</strong> Add relevant skills that this certification demonstrates, such as “Cybersecurity,” “Cloud Computing,” or “Data Analysis.”</li>
    <li><strong>Media:</strong> Upload a copy of your certificate (PDF or image) or link to a project or document that showcases your achievement.</li>
  </ul>

  <p style="text-align: center; color: #333; margin-top: 20px;">
    Once everything is complete, click <strong>Save</strong> to publish your certification to your LinkedIn profile.
  </p>
</div>


<canvas id="certCanvas"></canvas>

<script type="module">
// Provide a safe global stub immediately so inline onclick handlers won't fail
window.downloadCert = async function () {
  // temporary stub while module initializes
  alert('Preparing certificate... If this message persists, the certificate system failed to initialize.');
};

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
        } else {
          console.log(`Request failed with status ${res.status}`);
        }
      } catch (err) {
        console.log(`Error fetching credentials: ${err}`);
      }
      return 'Student Name';
    }

    async function downloadCert(course, org, date) {
      const name = await getCredentials();

      const canvas = document.getElementById('certCanvas');
      const ctx = canvas.getContext('2d');

      canvas.width = 1400;
      canvas.height = 1000;

      // Background - elegant cream
      ctx.fillStyle = '#f8f6f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Outer border - navy
      ctx.strokeStyle = '#2c3e50';
      ctx.lineWidth = 25;
      ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

      // Inner border - gold accent
      ctx.strokeStyle = '#c9b037';
      ctx.lineWidth = 3;
      ctx.strokeRect(80, 80, canvas.width - 160, canvas.height - 160);

      // Decorative corners
      ctx.fillStyle = '#c9b037';
      ctx.beginPath();
      ctx.arc(80, 80, 15, 0, Math.PI * 2);
      ctx.arc(canvas.width - 80, 80, 15, 0, Math.PI * 2);
      ctx.arc(80, canvas.height - 80, 15, 0, Math.PI * 2);
      ctx.arc(canvas.width - 80, canvas.height - 80, 15, 0, Math.PI * 2);
      ctx.fill();

      // Title
      ctx.fillStyle = '#2c3e50';
      ctx.font = 'bold 60px Georgia';
      ctx.textAlign = 'center';
      ctx.fillText('CERTIFICATE', canvas.width / 2, 200);

      ctx.font = 'bold 48px Georgia';
      ctx.fillText('OF COMPLETION', canvas.width / 2, 260);

      // Decorative line under title
      ctx.strokeStyle = '#c9b037';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(400, 290);
      ctx.lineTo(1000, 290);
      ctx.stroke();

      // "This is to certify that"
      ctx.fillStyle = '#2c3e50';
      ctx.font = '28px Arial';
      ctx.fillText('This is to certify that', canvas.width / 2, 380);

      // Student name (from API)
      ctx.fillStyle = '#ea8c33';
      ctx.font = 'italic bold 52px Georgia';
      ctx.fillText(name, canvas.width / 2, 470);

      // Underline
      ctx.strokeStyle = '#ea8c33';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(400, 490);
      ctx.lineTo(1000, 490);
      ctx.stroke();

      // "has successfully completed"
      ctx.fillStyle = '#2c3e50';
      ctx.font = '28px Arial';
      ctx.fillText('has successfully completed the course', canvas.width / 2, 560);

      // Course name
      ctx.fillStyle = '#2c3e50';
      ctx.font = 'bold 44px Arial';
      ctx.fillText(course, canvas.width / 2, 650);

      // Organization
      ctx.fillStyle = '#555';
      ctx.font = '26px Arial';
      ctx.fillText('Issued by ' + org, canvas.width / 2, 710);

  // Date — use current date to ensure certificate is issued today
  const issuanceDate = new Date();
  const formattedDate = issuanceDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  // match the Advanced Python Programming accent (red) for the date
  ctx.fillStyle = '#2c3e50';
  ctx.font = 'bold 24px Arial';
  ctx.fillText('Date: ' + formattedDate, canvas.width / 2, 800);

      // Signature line
      ctx.strokeStyle = '#2c3e50';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(500, 880);
      ctx.lineTo(900, 880);
      ctx.stroke();

      // signature name: larger and lifted above the line to match 'OF COMPLETION'
      ctx.fillStyle = '#555';
      ctx.font = 'bold 48px Georgia';
      // place slightly above the signature line
      ctx.fillText('John Mortenson', canvas.width / 2, 860);

      // Trigger download
      const link = document.createElement('a');
      link.download = `${course.replace(/\s+/g, '_')}_Certificate.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }

    function addToLinkedIn(courseName) {
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


    // replace the stub with the real implementation
    window.downloadCert = downloadCert;
    window.addToLinkedIn = addToLinkedIn;

  } catch (err) {
    console.error('Failed to initialize certificate downloader:', err);
    // keep the user-friendly stub already assigned above
  }
})();

</script>