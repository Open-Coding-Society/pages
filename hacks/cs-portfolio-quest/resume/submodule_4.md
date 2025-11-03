---
layout: cs-portfolio-lesson
title: "Submodule 4"
description: "Submodule 4 of Resume Building Mini-Quest"
permalink: /cs-portfolio-quest/resume/submodule_4/
parent: "Resume Building"
team: "Grinders"
submodule: 4
categories: [CSP, Submodule, ResumeBuilding]
tags: [resume, submodule, grinders]
author: "Grinders Team"
date: 2025-10-21
---

<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

<style>
  :root {
    --text: inherit;
    --muted: #888;
    --border: rgba(127,127,127,0.35);
    --accent: #2563eb;
    --bg-muted: rgba(127,127,127,0.08);
  }
  .container { max-width: 860px; margin: 0 auto; padding: 16px; color: var(--text); }
  h1 { font-size: 1.5rem; margin: 0 0 6px 0; font-weight: 700; }
  .lead { color: var(--muted); margin: 0 0 12px 0; }
  .row { display: flex; gap: 12px; flex-wrap: wrap; }
  .btn { display: inline-block; padding: 8px 12px; border: 1px solid var(--border); border-radius: 6px; background: transparent; color: var(--text); cursor: pointer; }
  .btn.primary { border-color: var(--accent); color: #fff; background: var(--accent); }
  .card { border: 1px solid var(--border); border-radius: 6px; padding: 12px; background: transparent; }
  .choice { flex: 1 1 260px; text-align: left; }
  .choice:hover { border-color: var(--accent); }
  .choice small { display:block; color: var(--muted); margin-top: 4px; }
  .hidden { display: none; }
  #resumePreview { margin-top: 8px; }
  .previewHeader { display:flex; align-items:center; gap:10px; }
  .avatar { width: 40px; height: 40px; border-radius: 50%; display:flex; align-items:center; justify-content:center; border:1px solid var(--border); }
  .sectionTitle { font-weight: 700; margin: 10px 0 6px 0; }
  .exp { border-left: 4px solid var(--border); padding-left: 8px; margin: 8px 0; }
  .muted { color: var(--muted); }
</style>

<div class="container">
  <h1>Resume PDF Generator</h1>
  <p class="lead">Download your resume based on your previous inputs and choose your preferred layout style.</p>

  <div id="fetchStatus" class="muted" role="status"></div>

  <div id="layoutPicker" class="card hidden" aria-live="polite" style="margin-top:12px;">
    <h2 style="margin:0 0 8px 0; font-size:1.1rem; font-weight:600;">Choose your resume style</h2>
    <div class="row">
      <button id="classicBtn" class="btn choice">Classic<small>Clean & Professional</small></button>
      <button id="modernBtn" class="btn choice">Modern<small>Bold headings, subtle accents</small></button>
    </div>
  </div>

  <div id="pdfActions" class="hidden" style="margin:12px 0;">
    <button id="downloadBtn" class="btn primary">Download as PDF</button>
  </div>

  <div class="card" style="margin-top:8px;">
    <div style="display:flex; align-items:center; justify-content:space-between;">
      <h2 style="margin:0; font-size:1rem; font-weight:600;">Preview <span id="previewLabel" class="muted" style="font-weight:400;"></span></h2>
    </div>
    <div id="resumePreview"></div>
  </div>
</div>

<script>
(function() {
  let resumeData = null;
  let chosenLayout = null;

  const fetchStatus = document.getElementById('fetchStatus');
  const layoutPicker = document.getElementById('layoutPicker');
  const downloadBtn = document.getElementById('downloadBtn');
  const resumePreview = document.getElementById('resumePreview');
  const pdfActions = document.getElementById('pdfActions');
  const previewLabel = document.getElementById('previewLabel');
  const classicBtn = document.getElementById('classicBtn');
  const modernBtn = document.getElementById('modernBtn');

  function determineApiUrl() {
    if (window.location.hostname === 'localhost') {
      return 'http://localhost:8585/api/resume/me';
    } else if (window.location.hostname === 'pages.opencodingsociety.com') {
      return 'https://spring.opencodingsocity.com/api/resume/me';
    }
    return '';
  }

  async function fetchResume() {
    fetchStatus.textContent = '';
    let url = determineApiUrl();
    if (!url) {
      fetchStatus.textContent = 'Unrecognized host. Cannot fetch resume data.';
      return;
    }
    try {
      let res = await fetch(url, { credentials: 'include' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      let data = await res.json();
      if (!data || !data.professionalSummary) throw new Error('No resume data found. Complete previous modules first.');
      resumeData = data;
      layoutPicker.classList.remove('hidden');
    } catch (e) {
      fetchStatus.textContent = 'Error fetching resume: ' + (e && e.message ? e.message : e);
      resumePreview.innerHTML = '<div>Nothing to preview.</div>';
    }
  }

  function renderPreview(layout, data) {
    const { professionalSummary, experiences = [] } = data;
    if (layout === 'classic') {
      previewLabel.textContent = '(Classic)';
      return (
        '<div>' +
        '<div class="sectionTitle">Your Name</div>' +
        '<div class="muted" style="margin-bottom:8px; font-style:italic;">' + escapeHtml(professionalSummary) + '</div>' +
        '<div class="sectionTitle">Experience</div>' +
        experiences.map(function(e) {
          return (
            '<div class="exp">' +
            '<div style="font-weight:700;">' + escapeHtml(e.jobTitle) + '</div>' +
            '<div class="muted" style="font-size:0.9rem;">' + escapeHtml(e.company) + ' • ' + escapeHtml(e.dates) + '</div>' +
            '<div style="white-space:pre-line;">' + escapeHtml(e.description) + '</div>' +
            '</div>'
          );
        }).join('') +
        '</div>'
      );
    }
    if (layout === 'modern') {
      previewLabel.textContent = '(Modern)';
      return (
        '<div>' +
        '<div class="previewHeader"><div class="avatar">👤</div><div><div style="font-weight:700;">Your Name</div><div style="color:#2c62b6;">' + escapeHtml(professionalSummary) + '</div></div></div>' +
        '<div class="sectionTitle" style="color:#2c62b6;">Experience</div>' +
        experiences.map(function(e) {
          return (
            '<div class="exp" style="border-left-color:#2c62b6;">' +
            '<div style="font-weight:700; color:#1a2b4d;">' + escapeHtml(e.jobTitle) + '</div>' +
            '<div class="muted" style="font-size:0.9rem;">' + escapeHtml(e.company) + ' • ' + escapeHtml(e.dates) + '</div>' +
            '<div style="white-space:pre-line;">' + escapeHtml(e.description) + '</div>' +
            '</div>'
          );
        }).join('') +
        '</div>'
      );
    }
    return '';
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderPdf(layout, data) {
    const { professionalSummary, experiences = [] } = data;
    const doc = new window.jspdf.jsPDF({ unit: 'pt', format: 'a4' });
    let y = 48;

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('Your Name', 40, y);
    y += 28;

    // Summary
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    if (layout === 'classic') {
      doc.setTextColor(70, 70, 70);
    } else {
      doc.setTextColor(44, 98, 182);
    }
    doc.text(professionalSummary || '', 40, y, { maxWidth: 520 });
    y += 30;

    // Section header
    if (layout === 'classic') {
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Experience', 40, y);
    } else {
      doc.setTextColor(44, 98, 182);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('EXPERIENCE', 40, y);
    }
    y += 20;

    // Experiences
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    experiences.forEach(function(ex) {
      doc.setFont('helvetica', 'bold');
      if (layout === 'modern') {
        doc.setTextColor(26, 43, 77);
      } else {
        doc.setTextColor(0, 0, 0);
      }
      doc.text(ex.jobTitle || '', 48, y);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(130, 142, 158);
      doc.text(((ex.company || '') + ' • ' + (ex.dates || '')), 48, y + 16);

      doc.setTextColor(70, 70, 70);
      let desc = ex.description || '';
      doc.text(desc, 48, y + 32, { maxWidth: 480 });
      y += 54 + 6 * ((desc.match(/\n/g) || []).length);
      doc.setTextColor(0, 0, 0);
    });

    doc.save('Resume.pdf');
  }

  // UI handlers
  if (classicBtn) classicBtn.onclick = function() {
    if (!resumeData) return;
    chosenLayout = 'classic';
    resumePreview.innerHTML = renderPreview('classic', resumeData);
    pdfActions.classList.remove('hidden');
  };
  if (modernBtn) modernBtn.onclick = function() {
    if (!resumeData) return;
    chosenLayout = 'modern';
    resumePreview.innerHTML = renderPreview('modern', resumeData);
    pdfActions.classList.remove('hidden');
  };
  if (downloadBtn) downloadBtn.onclick = function() {
    if (!chosenLayout || !resumeData) return;
    renderPdf(chosenLayout, resumeData);
  };

  // Start
  fetchResume();
})();
</script>
