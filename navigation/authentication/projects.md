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
    <p>Discover Capstone projects looking for a mentor. Rotate through the carousel to
      browse them, and apply to support the teams you're interested in.</p>
    <button id="mp-enter-btn" type="button" class="mp-btn mp-btn--primary mp-btn--lg">Mentor</button>
  </div>

  <div id="mp-app" style="display:none;">

    <div class="mp-hero">
      <div>
        <h1 class="mp-hero__title">Mentor Portal</h1>
        <p class="mp-hero__subtitle">Browse Capstone projects looking for a mentor with the
          carousel below. Mark the ones you'd like to support &mdash; open a project any
          time to read the full write-up first.</p>
      </div>
      <div class="mp-stats">
        <div class="mp-stat">
          <span class="mp-stat__value" id="mp-stat-total">0</span>
          <span class="mp-stat__label">Open</span>
        </div>
        <div class="mp-stat mp-stat--interested" id="mp-stat-interested-wrap" tabindex="0">
          <span class="mp-stat__value" id="mp-stat-interested">0</span>
          <span class="mp-stat__label">Interested</span>
          <div class="mp-stat-popover" id="mp-interested-popover">
            <p class="mp-shortlist__empty">Projects you mark Interested will show up here.</p>
          </div>
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
      <div class="mp-layout">
        <div class="mp-main">
          <div class="mp-stage">
            <div class="mp-carousel-stage">
              <button id="mp-carousel-prev" type="button" class="mp-carousel-arrow mp-carousel-arrow--prev" aria-label="Previous project">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              <div class="mp-carousel" id="mp-carousel">
                <div class="mp-carousel__track" id="mp-carousel-track"></div>
              </div>
              <button id="mp-carousel-next" type="button" class="mp-carousel-arrow mp-carousel-arrow--next" aria-label="Next project">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>

            <div class="mp-detail" id="mp-detail"></div>
          </div>

          <div class="mp-actions">
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

          <div id="mp-confirm-popup" class="mp-confirm" style="display:none;">
            <div class="mp-confirm__text">
              Marked interested in <strong id="mp-confirm-title"></strong>. Apply now, or keep it in your shortlist for later.
            </div>
            <div class="mp-confirm__actions">
              <button id="mp-confirm-apply" type="button" class="mp-btn mp-btn--primary mp-btn--sm">Apply now</button>
              <button id="mp-confirm-dismiss" type="button" class="mp-btn mp-btn--ghost mp-btn--sm">Maybe later</button>
            </div>
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
            <p class="sm:hidden" style="font-size:0.75rem;opacity:0.7;">Use the arrows or click a project to rotate the carousel</p>
          </div>
        </div>

        <aside class="mp-rail">
          <div class="mp-rail__card">
            <div class="mp-rail__title">Your Shortlist</div>
            <div id="mp-shortlist" class="mp-shortlist">
              <p class="mp-shortlist__empty">Projects you mark Interested will show up here.</p>
            </div>
          </div>
          <div class="mp-rail__card">
            <div class="mp-rail__title">Shortcuts</div>
            <ul class="mp-tips">
              <li><span class="mp-kbd">&larr;</span> Previous project</li>
              <li><span class="mp-kbd">&rarr;</span> Next project</li>
              <li>Click any project in the carousel to jump to it</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>

  </div>

  <div id="mp-overlay" class="mp-overlay" style="display:none;">
    <div class="mp-overlay__panel">
      <div class="mp-overlay__header">
        <span class="mp-overlay__title">All projects</span>
        <button id="mp-overlay-close" type="button" class="mp-overlay__close" aria-label="Close">&times;</button>
      </div>
      <input id="mp-overlay-search" type="text" class="mp-overlay__search" placeholder="Search projects by name&hellip;">
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
  import { javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

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
  const markSkipped = (id) => addToIdSet(SKIPPED_KEY, id);

  // "Interested" (the shortlist) is persisted to the mentor's account on the
  // Spring backend so it follows them across browsers/devices, not just this
  // one. localStorage is kept only as an instant-paint cache for before the
  // network round trip resolves (or if the request fails / not logged in).
  function markApplied(id) { addToIdSet(APPLIED_KEY, id); }

  async function loadInterestsFromServer() {
    try {
      const res = await fetch(`${javaURI}/api/mentor/interests`, fetchOptions);
      if (!res.ok) return null;
      const rows = await res.json();
      return Array.isArray(rows) ? rows.map(r => String(r.projectUrl)) : [];
    } catch (err) {
      console.error('Mentor Portal: could not load saved interests', err);
      return null;
    }
  }

  async function pushInterestToServer(url, title) {
    try {
      await fetch(`${javaURI}/api/mentor/interests`, {
        ...fetchOptions,
        method: 'POST',
        body: JSON.stringify({ url, title }),
      });
    } catch (err) {
      console.error('Mentor Portal: could not save interest to your account', err);
    }
  }

  // Marking a project "Interested" (above) only saves it to the mentor's own
  // shortlist. Actually applying to mentor a specific project is a second,
  // separate approval -- it requires a real ROLE_MENTOR account and goes
  // through an admin/teacher review queue (capstone/read.html on the backend),
  // exactly like becoming a mentor in the first place does. This map resolves
  // a project's url (all we have client-side) to the numeric capstone id the
  // /api/capstones/{id}/apply endpoint needs.
  let capstoneIdByUrl = {};

  async function loadCapstoneIds() {
    try {
      const res = await fetch(`${javaURI}/api/capstones`, fetchOptions);
      if (!res.ok) return;
      const rows = await res.json();
      if (!Array.isArray(rows)) return;
      capstoneIdByUrl = {};
      rows.forEach(row => { capstoneIdByUrl[String(row.url)] = row.id; });
    } catch (err) {
      console.error('Mentor Portal: could not load capstone project ids', err);
    }
  }

  async function submitApplication(url, title) {
    const capstoneId = capstoneIdByUrl[String(url)];
    if (!capstoneId) {
      notify("Can't apply yet — this project hasn't synced to the backend.", false);
      return;
    }
    try {
      const res = await fetch(`${javaURI}/api/capstones/${capstoneId}/apply`, {
        ...fetchOptions,
        method: 'POST',
      });
      const text = await res.text();
      if (res.status === 403) {
        notify('You need to be an approved mentor to apply — sign up as a mentor and wait for admin approval.', false);
      } else if (res.status === 409) {
        notify(text || "You're already a mentor on this project.", false);
      } else if (res.ok) {
        notify(`Applied to mentor ${title} — an admin will review it.`, true);
      } else {
        notify("Couldn't submit that application. Try again in a bit.", false);
      }
    } catch (err) {
      console.error('Mentor Portal: apply request failed', err);
      notify("Couldn't reach the server to apply. Try again in a bit.", false);
    }
  }

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

  const browserEl = el('mp-browser');
  const emptyEl = el('mp-empty');
  const carouselTrackEl = el('mp-carousel-track');
  const detailEl = el('mp-detail');
  const skipBtn = el('mp-skip-btn');
  const interestedBtn = el('mp-interested-btn');
  const progressText = el('mp-progress-text');
  const progressFill = el('mp-progress-fill');
  const statTotal = el('mp-stat-total');
  const statInterested = el('mp-stat-interested');
  const statSkipped = el('mp-stat-skipped');

  let initialized = false;

  function initials(title) {
    const t = String(title || '?').trim();
    return t ? t.charAt(0).toUpperCase() : '?';
  }

  // Picks one of 5 on-brand gradient variants per title, so a run of
  // no-image projects doesn't render as identical blue tiles.
  function fallbackVariant(title) {
    const s = String(title || '');
    let hash = 0;
    for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
    return (hash % 5) + 1;
  }

  function galleryHtml(images, title) {
    if (!Array.isArray(images) || images.length === 0) {
      return `<div class="mp-gallery"><div class="mp-fallback mp-fallback--${fallbackVariant(title)}"><span class="mp-fallback__initial">${esc(initials(title))}</span></div></div>`;
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

  function shortlistThumbHtml(p) {
    if (Array.isArray(p.images) && p.images.length) {
      return `<img class="mp-shortlist__thumb" src="${esc(p.images[0])}" alt="" loading="lazy">`;
    }
    return `<div class="mp-shortlist__thumb"></div>`;
  }

  function renderShortlist() {
    const applied = getAppliedIds();
    const shortlisted = projects.filter(p => applied.has(String(p.url)));
    const html = !shortlisted.length
      ? `<p class="mp-shortlist__empty">Projects you mark Interested will show up here.</p>`
      : shortlisted.map(p => `
          <a class="mp-shortlist__item" href="${esc(p.url)}">
            ${shortlistThumbHtml(p)}
            <span class="mp-shortlist__title">${esc(p.title)}</span>
          </a>
        `).join('');
    // Same content in two places: the always-visible side rail, and a
    // popover under the "Interested" stat (hover it any time to jump to
    // a project you've shortlisted, even on screens too narrow for the rail).
    const railEl = el('mp-shortlist');
    if (railEl) railEl.innerHTML = html;
    const popoverEl = el('mp-interested-popover');
    if (popoverEl) popoverEl.innerHTML = html;
  }

  function updateStats() {
    statTotal.textContent = String(projects.length);
    statInterested.textContent = String(getAppliedIds().size);
    statSkipped.textContent = String(getSkippedIds().size);
    renderShortlist();
  }

  function renderDetail() {
    const p = projects[index];
    const applied = getAppliedIds().has(String(p.url));

    detailEl.classList.remove('mp-detail--fade');
    detailEl.innerHTML = `
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
    wireGallery(detailEl);
    void detailEl.offsetWidth;
    detailEl.classList.add('mp-detail--fade');

    interestedBtn.disabled = applied;
    interestedBtn.title = applied ? 'Already in your shortlist' : "I'm interested in mentoring this project";

    progressText.textContent = `${index + 1} / ${projects.length}`;
    progressFill.style.width = `${projects.length > 1 ? (index / (projects.length - 1)) * 100 : 100}%`;
    updateStats();
  }

  // Absolute-positioned "coverflow" layout: every slide's transform is a
  // function of its distance from the active index, so navigating just
  // recomputes these and the CSS transition animates the whole rotation.
  function layoutCarousel() {
    const slides = carouselTrackEl.querySelectorAll('.mp-carousel__slide');
    const spacing = 108;
    slides.forEach((slide, i) => {
      const offset = i - index;
      const abs = Math.abs(offset);
      const scale = offset === 0 ? 1 : Math.max(0.55, 1 - abs * 0.16);
      const opacity = abs > 4 ? 0 : Math.max(0, 1 - abs * 0.28);
      slide.style.transform = `translate(-50%, -50%) translateX(${offset * spacing}px) scale(${scale})`;
      slide.style.opacity = String(opacity);
      slide.style.zIndex = String(100 - abs);
      slide.style.pointerEvents = abs > 4 ? 'none' : 'auto';
      slide.classList.toggle('is-active', offset === 0);
    });
  }

  function goTo(newIndex) {
    const count = projects.length;
    index = ((newIndex % count) + count) % count; // loop both directions
    layoutCarousel();
    renderDetail();
  }

  let confirmTimer = null;
  let confirmProject = null;

  function showConfirmPopup(p) {
    clearTimeout(confirmTimer);
    confirmProject = p;
    el('mp-confirm-title').textContent = p.title;
    el('mp-confirm-popup').style.display = 'flex';
    confirmTimer = setTimeout(hideConfirmPopup, 8000);
  }

  function hideConfirmPopup() {
    clearTimeout(confirmTimer);
    el('mp-confirm-popup').style.display = 'none';
  }

  function handleInterested() {
    const p = projects[index];
    if (!p || getAppliedIds().has(String(p.url))) return;

    markApplied(p.url);
    pushInterestToServer(p.url, p.title);
    notify(`Interested in ${p.title}`, true);
    showConfirmPopup(p);
    goTo(index + 1);
  }

  function notify(text, accent) {
    if (typeof Toastify !== 'function') return;
    Toastify({
      text,
      duration: 2200,
      gravity: 'top',
      position: 'right',
      style: { background: accent ? '#007ACC' : '#2A2D2D' },
    }).showToast();
  }

  function handleSkip() {
    const p = projects[index];
    if (!p) return;
    hideConfirmPopup();
    markSkipped(p.url);
    notify(`Skipped ${p.title}`, false);
    goTo(index + 1);
  }

  // ---- Browse-all overlay ---------------------------------------------------

  function overlayThumbHtml(p) {
    if (Array.isArray(p.images) && p.images.length) {
      return `<img class="mp-overlay__thumb" src="${esc(p.images[0])}" alt="" loading="lazy">`;
    }
    return `<div class="mp-overlay__thumb"></div>`;
  }

  function renderOverlayGrid(filterText) {
    const applied = getAppliedIds();
    const skipped = getSkippedIds();
    const q = String(filterText || '').trim().toLowerCase();
    const rows = projects
      .map((p, i) => ({ p, i }))
      .filter(({ p }) => !q || p.title.toLowerCase().includes(q));

    if (!rows.length) {
      el('mp-overlay-grid').innerHTML = `<div class="mp-overlay__empty">No projects match &ldquo;${esc(filterText)}&rdquo;.</div>`;
      return;
    }

    el('mp-overlay-grid').innerHTML = rows.map(({ p, i }) => {
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
        hideConfirmPopup();
        closeOverlay();
        goTo(Number(btn.dataset.index));
      });
    });
  }

  function openOverlay() {
    el('mp-overlay-search').value = '';
    renderOverlayGrid('');
    el('mp-overlay').style.display = 'flex';
    el('mp-overlay-search').focus();
  }

  function closeOverlay() {
    el('mp-overlay').style.display = 'none';
  }

  // ---- Init ---------------------------------------------------------------

  function carouselSlideHtml(p, i) {
    const art = (Array.isArray(p.images) && p.images.length)
      ? `<img class="mp-carousel__img" src="${esc(p.images[0])}" alt="" loading="lazy">`
      : `<div class="mp-fallback mp-fallback--${fallbackVariant(p.title)}"><span class="mp-fallback__initial">${esc(initials(p.title))}</span></div>`;
    return `
      <button type="button" class="mp-carousel__slide" data-index="${i}" aria-label="${esc(p.title)}">
        <span class="mp-carousel__art">${art}</span>
        <span class="mp-carousel__title">${esc(p.title)}</span>
      </button>
    `;
  }

  function initCarousel() {
    carouselTrackEl.innerHTML = projects.map((p, i) => carouselSlideHtml(p, i)).join('');
    carouselTrackEl.querySelectorAll('.mp-carousel__slide').forEach(slide => {
      slide.addEventListener('click', () => {
        const i = Number(slide.dataset.index);
        if (i === index) {
          window.location.href = projects[i].url;
        } else {
          hideConfirmPopup();
          goTo(i);
        }
      });
    });

    browserEl.style.display = 'block';
    goTo(index);

    el('mp-carousel-prev').addEventListener('click', () => { hideConfirmPopup(); goTo(index - 1); });
    el('mp-carousel-next').addEventListener('click', () => { hideConfirmPopup(); goTo(index + 1); });
    skipBtn.addEventListener('click', handleSkip);
    interestedBtn.addEventListener('click', handleInterested);
    el('mp-browse-open').addEventListener('click', openOverlay);
    el('mp-overlay-close').addEventListener('click', closeOverlay);
    el('mp-overlay').addEventListener('click', (e) => { if (e.target.id === 'mp-overlay') closeOverlay(); });
    el('mp-overlay-search').addEventListener('input', (e) => renderOverlayGrid(e.target.value));

    el('mp-confirm-dismiss').addEventListener('click', hideConfirmPopup);
    el('mp-confirm-apply').addEventListener('click', () => {
      if (confirmProject) submitApplication(confirmProject.url, confirmProject.title);
      hideConfirmPopup();
    });

    // "Interested" stat: hover (desktop) or click/tap (touch) to preview the
    // shortlist without needing the side rail, which is hidden on narrow screens.
    const interestedStatWrap = el('mp-stat-interested-wrap');
    interestedStatWrap.addEventListener('click', (e) => {
      e.stopPropagation();
      interestedStatWrap.classList.toggle('mp-stat--open');
    });
    document.addEventListener('click', () => interestedStatWrap.classList.remove('mp-stat--open'));

    document.addEventListener('keydown', (e) => {
      if (el('mp-overlay').style.display === 'flex') {
        if (e.key === 'Escape') closeOverlay();
        return;
      }
      if (browserEl.style.display === 'none') return;
      if (e.key === 'ArrowRight') { hideConfirmPopup(); goTo(index + 1); }
      if (e.key === 'ArrowLeft') { hideConfirmPopup(); goTo(index - 1); }
    });
  }

  async function init() {
    if (initialized) return;
    initialized = true;

    try {
      const raw = JSON.parse(el('capstone-data').textContent);
      projects = raw.map(p => ({ ...p, images: Array.isArray(p.images) ? p.images : [] }));
    } catch (e) {
      projects = [];
    }
    updateStats();

    // Reconcile the shortlist with whatever's actually saved to the mentor's
    // account. If the request fails (offline, or not really logged in --
    // remember the "Mentor" button above is a public bypass, not real auth)
    // this just falls back to whatever was already cached in localStorage.
    const serverUrls = await loadInterestsFromServer();
    if (serverUrls) {
      localStorage.setItem(APPLIED_KEY, JSON.stringify(serverUrls));
      updateStats();
    }
    loadCapstoneIds();

    if (!projects.length) {
      emptyEl.style.display = 'block';
      return;
    }
    initCarousel();
  }
</script>
