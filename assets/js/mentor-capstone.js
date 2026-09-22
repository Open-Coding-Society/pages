import { javaURI, fetchOptions } from './api/config.js';
import { fetchPosts, createPost } from './api/microblog.js';

// Mentor capstone actions: hover Apply/Interested/Skip on each capstone card,
// a top-right widget summarizing a mentor's picks, and per-project comments
// reusing the existing microblog API (topicPath scoped per project).
//
// Backend contract this expects (documented in docs/mentor-capstone-api.md):
//   GET  {javaURI}/api/person/get              -> { roles: [{ name }], ... }  (existing)
//   GET  {javaURI}/api/capstone/mentor/status   -> [{ projectId, status, ... }]
//   PUT  {javaURI}/api/capstone/mentor/status   <- { projectId, projectTitle, projectUrl, status }
// Until that endpoint ships, statuses are cached in localStorage so the UI
// keeps working end to end during frontend development.

const STATUS = { APPLIED: 'APPLIED', INTERESTED: 'INTERESTED', SKIPPED: 'SKIPPED' };

function slugify(text) {
  const slug = (text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'project';
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}

async function getMentorSession() {
  try {
    const response = await fetch(`${javaURI}/api/person/get`, fetchOptions);
    if (!response.ok) return null;
    const data = await response.json();
    const roles = Array.isArray(data && data.roles) ? data.roles : [];
    if (!roles.some(role => role.name === 'ROLE_MENTOR')) return null;
    return data;
  } catch (error) {
    console.error('Mentor capstone: failed to resolve session', error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Local preview mode — visual QA without a live Spring/Flask login.
// On localhost/127.0.0.1 this turns on automatically (same dev-host check
// config.js already uses for pythonURI/javaURI) so the feature is visible the
// moment you run the dev server — no query param to remember. On any other
// host it stays off unless you explicitly pass ?mentorPreview=1 (sticks via
// localStorage on this browser only); ?mentorPreview=0 forces it off anywhere,
// including on localhost. This never talks to the real backend and never
// creates a real account — it only fakes the client-side ROLE_MENTOR check so
// the hover actions and widget are visible. Saved statuses stay in this
// browser's localStorage; the real PUT to {javaURI}/api/capstone/mentor/status
// will fail (logged, not thrown) since there's no real mentor session, and
// comments will only load if a real Flask backend is reachable — the popover
// shows "unavailable" otherwise.
// ---------------------------------------------------------------------------

const PREVIEW_KEY = 'mentor_capstone_preview';

function isLocalDevHost() {
  return location.hostname === 'localhost' || location.hostname === '127.0.0.1';
}

function readPreviewParam() {
  try {
    return new URLSearchParams(location.search).get('mentorPreview');
  } catch (error) {
    return null;
  }
}

function isPreviewMentorActive() {
  try {
    const stored = localStorage.getItem(PREVIEW_KEY);
    if (stored === '1') return true;
    if (stored === '0') return false;
  } catch (error) {
    // localStorage unavailable — fall through to the dev-host default below.
  }
  return isLocalDevHost();
}

function setPreviewMentorActive(active) {
  try {
    // Store '0' explicitly (rather than clearing the key) so an explicit
    // opt-out sticks even on localhost, where preview mode defaults to on.
    localStorage.setItem(PREVIEW_KEY, active ? '1' : '0');
  } catch (error) {
    // Preview mode is a local convenience only — safe to no-op here.
  }
}

function previewMentorSession() {
  return { id: 'preview-mentor', roles: [{ name: 'ROLE_MENTOR' }] };
}

function localStatusKey(mentorId) {
  return `mentor_capstone_status_${mentorId}`;
}

function readLocalStatuses(mentorId) {
  try {
    return JSON.parse(localStorage.getItem(localStatusKey(mentorId)) || '{}');
  } catch (error) {
    console.warn('Mentor capstone: local status cache unreadable, resetting', error);
    return {};
  }
}

function writeLocalStatuses(mentorId, statuses) {
  try {
    localStorage.setItem(localStatusKey(mentorId), JSON.stringify(statuses));
  } catch (error) {
    console.warn('Mentor capstone: could not persist local status cache', error);
  }
}

async function fetchRemoteStatuses() {
  const response = await fetch(`${javaURI}/api/capstone/mentor/status`, fetchOptions);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function saveRemoteStatus(project, status) {
  const response = await fetch(`${javaURI}/api/capstone/mentor/status`, {
    ...fetchOptions,
    method: 'PUT',
    body: JSON.stringify({
      projectId: project.id,
      projectTitle: project.title,
      projectUrl: project.url,
      status
    })
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

function collectProjects() {
  const grid = document.getElementById('capstone-grid');
  if (!grid) return [];
  return Array.from(grid.children).map(card => {
    const titleEl = card.querySelector('h3 a, h3');
    const title = titleEl ? titleEl.textContent.trim() : (card.textContent || '').trim().slice(0, 60);
    const link = card.querySelector('a');
    return {
      card,
      id: slugify(title),
      title,
      url: card.dataset.pageUrl || (link ? link.getAttribute('href') : '') || ''
    };
  });
}

// ---------------------------------------------------------------------------
// Top-right widget
// ---------------------------------------------------------------------------

function buildWidget() {
  const existing = document.getElementById('mentor-widget');
  if (existing) return existing;

  const widget = document.createElement('div');
  widget.id = 'mentor-widget';
  widget.className = 'mentor-widget';
  widget.innerHTML = `
    <button type="button" class="ocs__btn small pill mentor-widget-toggle" aria-expanded="false">
      Mentor Picks<span class="mentor-widget-count" id="mentor-widget-count">0</span>
    </button>
    <div class="mentor-widget-panel" role="menu" aria-label="Your interested and skipped projects">
      <div class="mentor-widget-section">
        <h3 class="ocs__section-title">Interested</h3>
        <ul class="mentor-widget-list" id="mentor-widget-interested"></ul>
      </div>
      <div class="mentor-widget-section">
        <h3 class="ocs__section-title">Skipped</h3>
        <ul class="mentor-widget-list" id="mentor-widget-skipped"></ul>
      </div>
      <p class="mentor-widget-sync-note" id="mentor-widget-sync-note" hidden></p>
    </div>
  `;
  document.body.appendChild(widget);

  const toggle = widget.querySelector('.mentor-widget-toggle');
  toggle.addEventListener('click', () => {
    const isOpen = widget.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
  document.addEventListener('click', event => {
    if (!widget.contains(event.target)) {
      widget.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  return widget;
}

function renderList(el, items, emptyText) {
  el.innerHTML = items.length
    ? items.map(p => `<li><a href="${escapeHtml(p.url || '#')}">${escapeHtml(p.title)}</a></li>`).join('')
    : `<li class="mentor-widget-empty">${emptyText}</li>`;
}

function renderWidget(projects, statuses) {
  const widget = buildWidget();
  const countEl = widget.querySelector('#mentor-widget-count');
  const interestedEl = widget.querySelector('#mentor-widget-interested');
  const skippedEl = widget.querySelector('#mentor-widget-skipped');

  const byStatus = status => projects.filter(p => statuses[p.id] === status);
  const interested = byStatus(STATUS.INTERESTED);
  const skipped = byStatus(STATUS.SKIPPED);

  countEl.textContent = String(interested.length);
  renderList(interestedEl, interested, 'No interested projects yet.');
  renderList(skippedEl, skipped, 'No skipped projects yet.');
}

function showSyncNote(message) {
  buildWidget();
  const note = document.getElementById('mentor-widget-sync-note');
  if (!note) return;
  note.textContent = message || '';
  note.hidden = !message;
}

// ---------------------------------------------------------------------------
// Per-card Apply / Interested / Skip / Comment controls
// ---------------------------------------------------------------------------

function updateCardButtons(card, status) {
  card.querySelectorAll('.mentor-card-actions [data-status]').forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.status === status);
  });
}

function buildCardActions(project) {
  const row = document.createElement('div');
  row.className = 'mentor-card-actions';
  row.innerHTML = `
    <button type="button" class="ocs__btn small alert-green fill" data-status="${STATUS.APPLIED}">Apply</button>
    <button type="button" class="ocs__btn small alert-yellow fill" data-status="${STATUS.INTERESTED}">Interested</button>
    <button type="button" class="ocs__btn small alert-red fill" data-status="${STATUS.SKIPPED}">Skip</button>
    <button type="button" class="ocs__btn small pill mentor-comment-btn" aria-label="Comment on ${escapeHtml(project.title)}">💬</button>
  `;
  return row;
}

// ---------------------------------------------------------------------------
// Comments (reuses assets/js/api/microblog.js, scoped per project)
// ---------------------------------------------------------------------------

function commentTopicPath(project) {
  return `capstone:${project.id}`;
}

function renderComments(listEl, posts) {
  const items = Array.isArray(posts) ? posts : [];
  listEl.innerHTML = items.length
    ? items.map(post => `<li class="mentor-comment-item"><strong>${escapeHtml(post.author || post.username || 'Mentor')}</strong> — ${escapeHtml(post.content || '')}</li>`).join('')
    : '<li class="mentor-widget-empty">No comments yet. Be the first.</li>';
}

async function openCommentPopover(project, anchorButton) {
  document.querySelectorAll('.mentor-comment-popover').forEach(el => el.remove());

  const popover = document.createElement('div');
  popover.className = 'mentor-comment-popover';
  popover.innerHTML = `
    <strong>${escapeHtml(project.title)} — comments</strong>
    <ul class="mentor-comment-list" id="mentor-comment-list"><li class="mentor-widget-empty">Loading…</li></ul>
    <form class="mentor-comment-form">
      <textarea placeholder="Add a comment for this project's team…" required></textarea>
      <button type="submit" class="ocs__btn small accent fill">Post comment</button>
    </form>
  `;
  anchorButton.closest('.mentor-card-actions').appendChild(popover);

  const closeOnOutsideClick = event => {
    if (!popover.contains(event.target) && event.target !== anchorButton) {
      popover.remove();
      document.removeEventListener('click', closeOnOutsideClick, true);
    }
  };
  setTimeout(() => document.addEventListener('click', closeOnOutsideClick, true), 0);

  const listEl = popover.querySelector('#mentor-comment-list');
  const topicPath = commentTopicPath(project);

  try {
    const posts = await fetchPosts(topicPath);
    renderComments(listEl, posts);
  } catch (error) {
    console.error('Mentor capstone: failed to load comments for', project.id, error);
    listEl.innerHTML = '<li class="mentor-widget-empty">Comments unavailable right now.</li>';
  }

  popover.querySelector('form').addEventListener('submit', async event => {
    event.preventDefault();
    const textarea = event.target.querySelector('textarea');
    const content = textarea.value.trim();
    if (!content) return;
    try {
      await createPost({ content, topicPath });
      textarea.value = '';
      const posts = await fetchPosts(topicPath);
      renderComments(listEl, posts);
    } catch (error) {
      console.error('Mentor capstone: failed to post comment for', project.id, error);
    }
  });
}

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------

async function init() {
  const previewParam = readPreviewParam();
  if (previewParam === '1') setPreviewMentorActive(true);
  if (previewParam === '0') setPreviewMentorActive(false);

  const previewActive = isPreviewMentorActive();
  const session = previewActive ? previewMentorSession() : await getMentorSession();
  if (!session) return; // not a mentor — leave the page untouched

  if (previewActive) {
    console.info('Mentor capstone: preview mode active (no real login). Add ?mentorPreview=0 to the URL to turn it off.');
  }

  const mentorId = session.id || session.uid || session.email || 'mentor';
  const projects = collectProjects();
  const statuses = readLocalStatuses(mentorId);

  buildWidget();
  try {
    const remote = await fetchRemoteStatuses();
    remote.forEach(entry => {
      statuses[entry.projectId] = entry.status;
    });
    writeLocalStatuses(mentorId, statuses);
  } catch (error) {
    console.warn('Mentor capstone: mentor status API not reachable yet, using local cache', error);
    showSyncNote("Showing locally saved picks — syncing to your account isn't available yet.");
  }

  projects.forEach(project => {
    project.card.classList.add('mentor-capstone-card');
    const actions = buildCardActions(project);
    project.card.appendChild(actions);
    updateCardButtons(project.card, statuses[project.id]);

    actions.addEventListener('click', async event => {
      const button = event.target.closest('button');
      if (!button) return;

      // Buttons keep keyboard focus after a click, which would otherwise keep
      // this row visible forever via the :focus-within rule below (that rule
      // exists so keyboard users tabbing in can see the row at all). Clearing
      // focus right after a mouse click lets the row correctly hide again
      // once the pointer leaves the card.
      button.blur();

      if (button.classList.contains('mentor-comment-btn')) {
        openCommentPopover(project, button);
        return;
      }

      const status = button.dataset.status;
      if (!status) return;

      statuses[project.id] = status;
      writeLocalStatuses(mentorId, statuses);
      updateCardButtons(project.card, status);
      renderWidget(projects, statuses);

      try {
        await saveRemoteStatus(project, status);
      } catch (error) {
        console.error('Mentor capstone: failed to save status to account for', project.id, error);
        showSyncNote('Saved locally — will sync to your account once available.');
      }
    });
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      document.querySelectorAll('.mentor-comment-popover').forEach(el => el.remove());
    }
  });

  renderWidget(projects, statuses);
}

document.addEventListener('DOMContentLoaded', init);
