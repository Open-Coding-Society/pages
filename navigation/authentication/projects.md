---
layout: aesthetihawk
title: Mentors
permalink: /projects
active_tab: projects
comments: false
microblog: true
---

<style>
  .page-projects .lesson-main > .flex.justify-between.items-center.mb-8 {
    display: block;
    border-bottom: 2px solid rgba(99,102,241,0.35);
    padding-bottom: 1rem;
    margin-bottom: 1.5rem;
  }
  .page-projects .lesson-main > .flex.justify-between.items-center.mb-8::before {
    content: "Mentor Portal";
    display: block;
    font-size: 1.75rem;
    font-weight: 800;
    letter-spacing: 0.02em;
    color: #3b82f6;
    margin-bottom: 0.4rem;
  }
  .page-projects h1 {
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -0.01em;
    background: linear-gradient(90deg, #fff, #a5b4fc);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
</style>

<p class="text-neutral-400 mb-8 max-w-3xl">Browse Capstone projects that are looking for a mentor. Open a project to see the full write-up, then apply to support that team for the rest of their build.</p>

<div id="projects-root" class="max-w-4xl">

  <p id="projects-status" class="text-neutral-400"></p>

  <div id="projects-browser" class="hidden">

    <div class="flex items-center gap-4 mb-6">
      <button id="prevProjectBtn" type="button"
        class="shrink-0 w-14 h-14 flex items-center justify-center rounded-full bg-neutral-800 border border-neutral-700 text-neutral-300 text-2xl hover:bg-neutral-700 hover:border-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-neutral-800 disabled:hover:border-neutral-700 transition"
        aria-label="Previous project">&larr;</button>

      <div class="flex-1 flex justify-center">
        <select id="projectCounter" aria-label="Jump to a specific project"
          class="text-base text-neutral-300 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 cursor-pointer hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"></select>
      </div>

      <button id="nextProjectBtn" type="button"
        class="shrink-0 w-14 h-14 flex items-center justify-center rounded-full bg-neutral-800 border border-neutral-700 text-neutral-300 text-2xl hover:bg-neutral-700 hover:border-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-neutral-800 disabled:hover:border-neutral-700 transition"
        aria-label="Next project">&rarr;</button>
    </div>

    <div id="projectCard"></div>

    <p class="text-sm text-neutral-500 mt-4 text-center sm:hidden">Swipe left or right to browse</p>
  </div>

</div>

<!-- Real capstone projects, generated at build time from _posts/capstone/*.md -->
<script type="application/json" id="capstone-data">
[
{% assign capstonePosts = site.posts | where_exp: "post", "post.path contains '_posts/capstone/'" %}
{% assign printed = 0 %}
{% for post in capstonePosts %}
  {% assign fname = post.path | split: '/' | last %}
  {% if fname contains 'README' or post.url == '/capstone/' %}
    {% continue %}
  {% endif %}
  {% if printed > 0 %},{% endif %}
  {"title": {{ post.title | jsonify }}, "description": {{ post.description | default: "" | jsonify }}, "url": {{ post.url | relative_url | jsonify }}}
  {% assign printed = printed | plus: 1 %}
{% endfor %}
]
</script>

<script type="module">
  const STORAGE_KEY = 'ocsMentorApplications';

  function getAppliedIds() {
    try { return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')); }
    catch (e) { return new Set(); }
  }
  function markApplied(id) {
    const ids = getAppliedIds();
    ids.add(String(id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  }

  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  let projects = [];
  let index = 0;

  const statusEl = document.getElementById('projects-status');
  const browserEl = document.getElementById('projects-browser');
  const cardEl = document.getElementById('projectCard');
  const counterEl = document.getElementById('projectCounter');
  const prevBtn = document.getElementById('prevProjectBtn');
  const nextBtn = document.getElementById('nextProjectBtn');

  try {
    projects = JSON.parse(document.getElementById('capstone-data').textContent);
  } catch (e) {
    projects = [];
  }

  if (!projects.length) {
    statusEl.textContent = 'No capstone projects are available to mentor right now. Check back soon.';
  } else {
    browserEl.classList.remove('hidden');
    counterEl.innerHTML = projects
      .map((p, i) => `<option value="${i}">${i + 1} / ${projects.length} — ${esc(p.title)}</option>`)
      .join('');
    counterEl.addEventListener('change', () => {
      index = parseInt(counterEl.value, 10);
      render();
    });
    render();
  }

  function render() {
    const p = projects[index];
    const id = p.url;
    const applied = getAppliedIds().has(String(id));

    counterEl.value = String(index);
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === projects.length - 1;

    cardEl.innerHTML = `
      <div class="bg-neutral-800 rounded-2xl shadow-lg p-10 border border-neutral-700 min-h-[26rem] flex flex-col">
        <span class="inline-block self-start mb-4 px-4 py-1.5 rounded-full bg-indigo-600/20 text-indigo-300 text-sm font-semibold uppercase tracking-wide">Capstone</span>
        <h2 class="text-3xl font-bold mb-4 break-words leading-tight">
          <a href="${esc(p.url)}" class="hover:text-indigo-300 hover:underline">${esc(p.title)}</a>
        </h2>
        <div class="flex-1 overflow-y-auto pr-2 mb-8 max-h-72">
          <p class="text-lg text-neutral-300 leading-relaxed">${esc(p.description || 'No description provided.')}</p>
        </div>
        <div class="flex flex-wrap gap-4 mt-auto">
          <a href="${esc(p.url)}"
             class="px-6 py-3 rounded-lg text-base font-medium bg-neutral-700 hover:bg-neutral-600 text-neutral-100 transition">
             View Project
          </a>
          <button type="button" class="apply-btn px-6 py-3 rounded-lg text-base font-medium transition ${applied ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}" ${applied ? 'disabled' : ''}>
            ${applied ? 'Invite Pending' : 'Apply Now'}
          </button>
        </div>
      </div>
    `;

    if (!applied) {
      cardEl.querySelector('.apply-btn').addEventListener('click', () => {
        markApplied(id);
        const params = new URLSearchParams({ id: String(id), title: p.title });
        window.location.href = `{{site.baseurl}}/projects/invite-pending?${params.toString()}`;
      });
    }
  }

  prevBtn.addEventListener('click', () => { if (index > 0) { index--; render(); } });
  nextBtn.addEventListener('click', () => { if (index < projects.length - 1) { index++; render(); } });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && !prevBtn.disabled) prevBtn.click();
    if (e.key === 'ArrowRight' && !nextBtn.disabled) nextBtn.click();
  });

  // Lightweight touch-swipe support for mobile browsing.
  let touchStartX = null;
  browserEl.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  browserEl.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      if (dx < 0 && !nextBtn.disabled) nextBtn.click();
      if (dx > 0 && !prevBtn.disabled) prevBtn.click();
    }
    touchStartX = null;
  }, { passive: true });
</script>
