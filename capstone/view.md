---
toc: false
layout: post
title: Capstone Project
description: Capstone project detail view
permalink: /capstone/view/
---

<link rel="stylesheet" href="/assets/css/new-capstone.css">

<div id="cv-root"></div>

<style>
.cv-error   { color: #9ca3af; text-align: center; padding: 4rem 0; font-size: 1.1rem; }
.cv-loading { color: #6b7280; text-align: center; padding: 4rem 0; }
</style>

<script>
(function(){
  const root = document.getElementById('cv-root');
  const id   = new URLSearchParams(location.search).get('id');

  if (!id) { root.innerHTML = '<p class="cv-error">No project ID specified.</p>'; return; }

  // ── Local (sessionStorage) project ──────────────────────────────────────────
  if (id.startsWith('local_')) {
    try {
      const all = JSON.parse(sessionStorage.getItem('ncLP') || '[]');
      const p   = all.find(x => x.id === id);
      if (p) { renderProject(p); return; }
    } catch (e) { /* fall through to error */ }
    root.innerHTML = '<p class="cv-error">Project not found in this session. It may have been cleared when the tab was refreshed.</p>';
    return;
  }

  // ── Remote (backend) project ─────────────────────────────────────────────────
  const API = window.javaURI || 'http://localhost:8585';
  root.innerHTML = '<p class="cv-loading">Loading project…</p>';
  fetch(`${API}/api/capstones/${encodeURIComponent(id)}`, { credentials: 'include' })
    .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(renderProject)
    .catch(() => {
      root.innerHTML = '<p class="cv-error">Could not load project. The server may be unavailable.</p>';
    });

  // ── Renderer ─────────────────────────────────────────────────────────────────
  function esc(s) {
    return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function lines(v) {
    return Array.isArray(v) ? v : String(v||'').split('\n').map(s=>s.trim()).filter(Boolean);
  }

  function renderProject(p) {
    document.title = (p.title || 'Capstone') + ' — Capstone';
    const tech   = lines(p.tech);
    const kps    = lines(p.keyPoints);
    const impact = lines(p.impact);
    const team   = Array.isArray(p.teamMembers)
      ? p.teamMembers
      : String(p.teamMembers||'').split('\n').map(s=>s.trim()).filter(Boolean);
    const link   = p.pageUrl || '#';
    const course = (p.courseCode||'').toUpperCase();

    root.innerHTML = `
<div class="cv-infograph">
  <div class="cv-header">
    <span class="cv-badge">${esc(course || 'Design-Based Research Capstone')}</span>
    <h1 class="cv-title">${esc(p.title)}</h1>
    <p class="cv-description">${esc(p.description || p.about || '')}</p>
  </div>

  <div class="cv-card">
    <div class="cv-card-grid">

      <div class="cv-visual">
        ${p.imageUrl
          ? `<a href="${esc(link)}" class="cv-image-link">
               <img src="${esc(p.imageUrl)}" alt="${esc(p.title)}" class="cv-image">
               <div class="cv-overlay"><span>View Project</span></div>
             </a>`
          : `<div class="cv-image-placeholder">${esc((p.title||'?').slice(0,3).toUpperCase())}</div>`
        }
        <div class="cv-status">${esc(p.status||'In Development')}</div>
        <div class="cv-team">
          <span class="cv-team-label">Project Leads</span>
          <span class="cv-team-name">${esc(team.join(', '))}</span>
        </div>
      </div>

      <div class="cv-content">
        <h2 class="cv-project-title">${esc(p.title)}</h2>
        <p class="cv-subtitle">${esc(p.subtitle||'')}</p>
        <div class="cv-keypoints">
          ${kps.map(k=>`<div class="cv-keypoint"><span class="cv-check">✓</span><span>${esc(k)}</span></div>`).join('')}
        </div>
        <div class="cv-tech-stack">
          ${tech.map(t=>`<span class="cv-tech-tag">${esc(t)}</span>`).join('')}
        </div>
      </div>

      <div class="cv-details">
        <h3 class="cv-section-title">About</h3>
        <p class="cv-about">${esc(p.about || p.description || '')}</p>
        ${impact.length ? `
        <h3 class="cv-section-title">Impact</h3>
        <div class="cv-impact-list">
          ${impact.map(i=>`<div class="cv-impact-item">${esc(i)}</div>`).join('')}
        </div>` : ''}
        ${link !== '#' ? `<a href="${esc(link)}" class="cv-btn" target="_blank" rel="noopener">Learn More</a>` : ''}
      </div>

    </div>
  </div>
</div>`;
  }
})();
</script>
