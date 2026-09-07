---
layout: aesthetihawk
title: Mentors
permalink: /projects
active_tab: projects
comments: false
microblog: true
---

<style>
  /* The layout's default "Mentors" heading is replaced by the hero below. */
  .page-projects .lesson-main > .flex.justify-between.items-center.mb-8 {
    display: none;
  }
</style>

<div id="mp-root" class="mp-page">

  <div id="mp-gate-landing" class="mp-state mp-state--landing">
    <svg class="mp-state__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
    </svg>
    <div class="mp-state__title">Mentor Portal</div>
    <p>Discover Capstone projects looking for a mentor. Swipe through the ones that catch
      your eye, skip the rest, and apply to support the teams you're interested in.</p>
    <button id="mp-enter-btn" type="button" class="mp-btn mp-btn--primary mp-btn--lg">Mentor</button>
  </div>

  <div id="mp-app" style="display:none;">

    <div class="mp-hero">
      <div>
        <h1 class="mp-hero__title">Mentor Portal</h1>
        <p class="mp-hero__subtitle">Swipe through Capstone projects looking for a mentor.
          Skip the ones that aren't a fit, and mark the ones you'd like to support &mdash;
          open a project any time to read the full write-up first.</p>
      </div>
      <div class="mp-stats">
        <div class="mp-stat">
          <span class="mp-stat__value" id="mp-stat-total">0</span>
          <span class="mp-stat__label">Open</span>
        </div>
        <div class="mp-stat mp-stat--interested">
          <span class="mp-stat__value" id="mp-stat-interested">0</span>
          <span class="mp-stat__label">Interested</span>
        </div>
        <div class="mp-stat mp-stat--skipped">
          <span class="mp-stat__value" id="mp-stat-skipped">0</span>
          <span class="mp-stat__label">Skipped</span>
        </div>
      </div>
    </div>

    <div id="mp-empty" class="mp-end" style="display:none;">
      <div class="mp-end__title">No projects need a mentor right now</div>
      <p>Check back soon &mdash; new Capstone projects are added throughout the term.</p>
    </div>

    <div id="mp-browser" style="display:none;">
      <div class="mp-stage">
        <div class="mp-deck" id="mp-deck"></div>
      </div>

      <div class="mp-actions">
        <button id="mp-back-btn" type="button" class="mp-action-btn mp-action-btn--back" aria-label="Back to previous project" title="Back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <button id="mp-skip-btn" type="button" class="mp-action-btn mp-action-btn--skip" aria-label="Skip this project" title="Skip">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
        <button id="mp-interested-btn" type="button" class="mp-action-btn mp-action-btn--interested" aria-label="I'm interested in mentoring this project" title="Interested">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
          </svg>
        </button>
      </div>

      <div class="mp-progress">
        <span id="mp-progress-text">1 / 1</span>
        <div class="mp-progress__bar"><div class="mp-progress__fill" id="mp-progress-fill" style="width:0%;"></div></div>
        <button id="mp-browse-open" type="button" class="mp-browse-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"/>
          </svg>
          Browse all projects
        </button>
        <p class="sm:hidden" style="font-size:0.75rem;opacity:0.7;">Swipe left to skip, right if you're interested</p>
      </div>
    </div>

    <div id="mp-end-stack" class="mp-end" style="display:none;">
      <div class="mp-end__title">You've reviewed every project</div>
      <p>Nice work &mdash; check back later for new Capstone projects, or start over below.</p>
      <button id="mp-restart-btn" type="button" class="mp-btn mp-btn--primary">Start over</button>
    </div>

  </div>

  <div id="mp-overlay" class="mp-overlay" style="display:none;">
    <div class="mp-overlay__panel">
      <div class="mp-overlay__header">
        <span class="mp-overlay__title">All projects</span>
        <button id="mp-overlay-close" type="button" class="mp-overlay__close" aria-label="Close">&times;</button>
      </div>
      <div id="mp-overlay-grid" class="mp-overlay__grid"></div>
    </div>
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
  {"title": {{ post.title | jsonify }}, "description": {{ post.description | default: "" | jsonify }}, "url": {{ post.url | relative_url | jsonify }}, "images": {{ post.images | jsonify }}}
  {% assign printed = printed | plus: 1 %}
{% endfor %}
]
</script>

<script type="module">
  const APPLIED_KEY = 'ocsMentorApplications';
  const SKIPPED_KEY = 'ocsMentorSkipped';

  function getIdSet(key) {
    try { return new Set(JSON.parse(localStorage.getItem(key) || '[]')); }
    catch (e) { return new Set(); }
  }
  function addToIdSet(key, id) {
    const ids = getIdSet(key);
    ids.add(String(id));
    localStorage.setItem(key, JSON.stringify([...ids]));
  }
  const getAppliedIds = () => getIdSet(APPLIED_KEY);
  const getSkippedIds = () => getIdSet(SKIPPED_KEY);
  const markApplied = (id) => addToIdSet(APPLIED_KEY, id);
  const markSkipped = (id) => addToIdSet(SKIPPED_KEY, id);

  function esc(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  const el = id => document.getElementById(id);

  // ---- Entry gate ---------------------------------------------------------
  //
  // TEMP: entry is a public "Mentor" button for now — no real ROLE_MENTOR check.
  // To restore the real gate later, swap the click handler below for something like:
  //
  //   import { javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';
  //   const res = await fetch(`${javaURI}/api/person/get`, fetchOptions);
  //   const person = await res.json();
  //   const roles = Array.isArray(person.roles) ? person.roles.map(r => r.name) : [];
  //   if (!roles.includes('ROLE_MENTOR')) { /* show a denied state */ return; }
  //
  // and only then reveal #mp-app, the same way enterPortal() does below.

  function enterPortal() {
    el('mp-gate-landing').style.display = 'none';
    el('mp-app').style.display = 'block';
    init();
  }

  el('mp-enter-btn').addEventListener('click', enterPortal);

  // ---- Deck state ---------------------------------------------------------

  let projects = [];
  let index = 0;

  const deckEl = el('mp-deck');
  const browserEl = el('mp-browser');
  const emptyEl = el('mp-empty');
  const endEl = el('mp-end-stack');
  const backBtn = el('mp-back-btn');
  const skipBtn = el('mp-skip-btn');
  const interestedBtn = el('mp-interested-btn');
  const progressText = el('mp-progress-text');
  const progressFill = el('mp-progress-fill');
  const statTotal = el('mp-stat-total');
  const statInterested = el('mp-stat-interested');
  const statSkipped = el('mp-stat-skipped');

  let cardRoot = null;
  let contentEl = null;
  let initialized = false;

  function initials(title) {
    const t = String(title || '?').trim();
    return t ? t.charAt(0).toUpperCase() : '?';
  }

  function galleryHtml(images, title) {
    if (!Array.isArray(images) || images.length === 0) {
      return `<div class="mp-gallery"><div class="mp-fallback"><span class="mp-fallback__initial">${esc(initials(title))}</span></div></div>`;
    }
    const multi = images.length > 1;
    const slides = images.map((src, i) =>
      `<div class="mp-gallery__slide"><img class="mp-gallery__img" src="${esc(src)}" alt="${esc(title)} screenshot ${i + 1}" draggable="false"></div>`
    ).join('');
    const dots = images.map((_, i) => `<span class="mp-gallery__dot${i === 0 ? ' mp-gallery__dot--active' : ''}"></span>`).join('');
    return `
      <div class="mp-gallery" data-count="${images.length}" data-img-index="0">
        <div class="mp-gallery__track">${slides}</div>
        ${multi ? `
          <button type="button" class="mp-gallery__zone mp-gallery__zone--prev" aria-label="Previous image"></button>
          <button type="button" class="mp-gallery__zone mp-gallery__zone--next" aria-label="Next image"></button>
          <button type="button" class="mp-gallery__arrow mp-gallery__arrow--prev" aria-label="Previous image">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button type="button" class="mp-gallery__arrow mp-gallery__arrow--next" aria-label="Next image">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
          </button>
          <span class="mp-gallery__counter">1 / ${images.length}</span>
          <div class="mp-gallery__dots">${dots}</div>
        ` : ''}
      </div>
    `;
  }

  function setGalleryIndex(galleryEl, newIndex) {
    const count = Number(galleryEl.dataset.count || 0);
    if (!count) return;
    const clamped = Math.max(0, Math.min(count - 1, newIndex));
    galleryEl.dataset.imgIndex = String(clamped);
    galleryEl.querySelector('.mp-gallery__track').style.transform = `translateX(-${clamped * 100}%)`;
    const counter = galleryEl.querySelector('.mp-gallery__counter');
    if (counter) counter.textContent = `${clamped + 1} / ${count}`;
    galleryEl.querySelectorAll('.mp-gallery__dot').forEach((d, i) => d.classList.toggle('mp-gallery__dot--active', i === clamped));
  }

  function wireGallery(root) {
    const galleryEl = root.querySelector('.mp-gallery');
    if (!galleryEl || !galleryEl.dataset.count) return;
    const prev = () => setGalleryIndex(galleryEl, Number(galleryEl.dataset.imgIndex) - 1);
    const next = () => setGalleryIndex(galleryEl, Number(galleryEl.dataset.imgIndex) + 1);
    galleryEl.querySelectorAll('.mp-gallery__zone--prev, .mp-gallery__arrow--prev').forEach(b =>
      b.addEventListener('click', (e) => { e.stopPropagation(); prev(); }));
    galleryEl.querySelectorAll('.mp-gallery__zone--next, .mp-gallery__arrow--next').forEach(b =>
      b.addEventListener('click', (e) => { e.stopPropagation(); next(); }));
  }

  function updateStats() {
    statTotal.textContent = String(projects.length);
    statInterested.textContent = String(getAppliedIds().size);
    statSkipped.textContent = String(getSkippedIds().size);
  }

  function renderCardContent() {
    const p = projects[index];
    const applied = getAppliedIds().has(String(p.url));

    contentEl.innerHTML = `
      ${galleryHtml(p.images, p.title)}
      <div class="mp-card__body">
        <span class="mp-card__pill">Capstone</span>
        <h2 class="mp-card__title"><a href="${esc(p.url)}">${esc(p.title)}</a></h2>
        <div class="mp-card__desc">${esc(p.description || 'No description provided yet.')}</div>
        <div class="mp-card__footer">
          <a href="${esc(p.url)}" class="mp-btn mp-btn--ghost mp-btn--sm">View full write-up &rarr;</a>
        </div>
      </div>
    `;
    wireGallery(contentEl);
    cardRoot.querySelectorAll('.mp-stamp').forEach(s => { s.style.opacity = 0; });

    interestedBtn.disabled = applied;
    interestedBtn.title = applied ? 'Invite already sent' : 'Interested — apply to mentor this project';
    backBtn.disabled = index === 0;

    progressText.textContent = `${index + 1} / ${projects.length}`;
    progressFill.style.width = `${projects.length > 1 ? (index / (projects.length - 1)) * 100 : 100}%`;
    updateStats();
  }

  function showCard() {
    renderCardContent();
    cardRoot.classList.remove('mp-card--leaving-left', 'mp-card--leaving-right', 'mp-card--dragging');
    cardRoot.style.transform = '';
    cardRoot.classList.add('mp-card--entering');
    void cardRoot.offsetWidth;
    requestAnimationFrame(() => cardRoot.classList.remove('mp-card--entering'));
  }

  function showEndOfStack() {
    browserEl.style.display = 'none';
    endEl.style.display = 'block';
    updateStats();
  }

  function handleInterested() {
    const p = projects[index];
    if (!p || getAppliedIds().has(String(p.url))) return;
    cardRoot.classList.remove('mp-card--dragging');
    cardRoot.classList.add('mp-card--leaving-right');
    setTimeout(() => {
      markApplied(p.url);
      const params = new URLSearchParams({ id: String(p.url), title: p.title });
      window.location.href = `{{site.baseurl}}/projects/invite-pending?${params.toString()}`;
    }, 300);
  }

  function handleSkip() {
    const p = projects[index];
    if (!p) return;
    markSkipped(p.url);
    cardRoot.classList.remove('mp-card--dragging');
    cardRoot.classList.add('mp-card--leaving-left');
    setTimeout(() => {
      if (index + 1 >= projects.length) {
        index = projects.length;
        showEndOfStack();
      } else {
        index++;
        showCard();
      }
    }, 300);
  }

  function handleBack() {
    if (index === 0) return;
    cardRoot.classList.remove('mp-card--dragging');
    cardRoot.style.transform = '';
    index--;
    showCard();
  }

  // ---- Drag-to-swipe ------------------------------------------------------

  let drag = null;

  function onPointerMove(e) {
    if (!drag) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (!drag.moved && Math.hypot(dx, dy) > 10) {
      drag.moved = true;
      drag.card.classList.add('mp-card--dragging');
    }
    if (drag.moved) {
      e.preventDefault();
      drag.dx = dx;
      drag.card.style.transform = `translate(${dx}px, ${dy * 0.15}px) rotate(${dx / 14}deg)`;
      const interestedStamp = drag.card.querySelector('.mp-stamp--interested');
      const skipStamp = drag.card.querySelector('.mp-stamp--skip');
      if (interestedStamp) interestedStamp.style.opacity = String(Math.max(0, Math.min(1, dx / 110)));
      if (skipStamp) skipStamp.style.opacity = String(Math.max(0, Math.min(1, -dx / 110)));
    }
  }

  function onPointerUp() {
    document.removeEventListener('pointermove', onPointerMove);
    if (!drag) return;
    const { card, moved, dx = 0 } = drag;
    drag = null;
    if (!moved) return;

    const THRESHOLD = 110;
    const p = projects[index];
    const applied = p && getAppliedIds().has(String(p.url));

    if (dx > THRESHOLD && !applied) {
      handleInterested();
    } else if (dx < -THRESHOLD) {
      handleSkip();
    } else {
      card.classList.remove('mp-card--dragging');
      card.style.transform = '';
      card.querySelectorAll('.mp-stamp').forEach(s => { s.style.opacity = 0; });
    }
  }

  function onPointerDown(e) {
    if (e.button !== undefined && e.button !== 0) return;
    drag = { startX: e.clientX, startY: e.clientY, moved: false, card: cardRoot };
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp, { once: true });
  }

  // ---- Browse-all overlay ---------------------------------------------------

  function overlayThumbHtml(p) {
    if (Array.isArray(p.images) && p.images.length) {
      return `<img class="mp-overlay__thumb" src="${esc(p.images[0])}" alt="" loading="lazy">`;
    }
    return `<div class="mp-overlay__thumb"></div>`;
  }

  function openOverlay() {
    const applied = getAppliedIds();
    const skipped = getSkippedIds();
    el('mp-overlay-grid').innerHTML = projects.map((p, i) => {
      const isApplied = applied.has(String(p.url));
      const isSkipped = skipped.has(String(p.url));
      const badge = isApplied
        ? `<span class="mp-overlay__badge mp-overlay__badge--interested">Interested</span>`
        : isSkipped ? `<span class="mp-overlay__badge mp-overlay__badge--skipped">Skipped</span>` : '';
      return `
        <button type="button" class="mp-overlay__item" data-index="${i}">
          ${overlayThumbHtml(p)}
          <span class="mp-overlay__item-title">${esc(p.title)}</span>
          ${badge}
        </button>
      `;
    }).join('');
    el('mp-overlay-grid').querySelectorAll('.mp-overlay__item').forEach(btn => {
      btn.addEventListener('click', () => {
        index = Number(btn.dataset.index);
        closeOverlay();
        browserEl.style.display = 'block';
        endEl.style.display = 'none';
        showCard();
      });
    });
    el('mp-overlay').style.display = 'flex';
  }

  function closeOverlay() {
    el('mp-overlay').style.display = 'none';
  }

  // ---- Init ---------------------------------------------------------------

  function initDeck() {
    deckEl.innerHTML = `
      <div class="mp-card" id="mp-card">
        <span class="mp-stamp mp-stamp--interested">Interested</span>
        <span class="mp-stamp mp-stamp--skip">Skip</span>
        <div class="mp-card__content"></div>
      </div>
    `;
    cardRoot = el('mp-card');
    contentEl = cardRoot.querySelector('.mp-card__content');
    cardRoot.addEventListener('pointerdown', onPointerDown);

    browserEl.style.display = 'block';
    showCard();

    backBtn.addEventListener('click', handleBack);
    skipBtn.addEventListener('click', handleSkip);
    interestedBtn.addEventListener('click', handleInterested);
    el('mp-restart-btn').addEventListener('click', () => {
      index = 0;
      endEl.style.display = 'none';
      browserEl.style.display = 'block';
      showCard();
    });
    el('mp-browse-open').addEventListener('click', openOverlay);
    el('mp-overlay-close').addEventListener('click', closeOverlay);
    el('mp-overlay').addEventListener('click', (e) => { if (e.target.id === 'mp-overlay') closeOverlay(); });

    document.addEventListener('keydown', (e) => {
      if (el('mp-overlay').style.display === 'flex') {
        if (e.key === 'Escape') closeOverlay();
        return;
      }
      if (browserEl.style.display === 'none') return;
      if (e.key === 'ArrowRight' && !interestedBtn.disabled) interestedBtn.click();
      if (e.key === 'ArrowLeft') skipBtn.click();
    });
  }

  function init() {
    if (initialized) return;
    initialized = true;

    try {
      const raw = JSON.parse(el('capstone-data').textContent);
      projects = raw.map(p => ({ ...p, images: Array.isArray(p.images) ? p.images : [] }));
    } catch (e) {
      projects = [];
    }
    updateStats();

    if (!projects.length) {
      emptyEl.style.display = 'block';
      return;
    }
    initDeck();
  }
</script>
