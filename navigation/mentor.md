---
layout: post
title: My Capstone Projects
permalink: /mentor
search_exclude: true
show_reading_time: false
menu: nav/homejava.html
---

<!-- The nav comes from the `menu:` front matter above, which _layouts/post.html renders.
     Including it here as well rendered two navbars with duplicate element ids. -->

<div class="mentor-page">
  <div id="mentor-loading" class="mentor-state">Loading your projects…</div>

  <div id="mentor-denied" class="mentor-state mentor-state--denied" style="display:none;">
    This page is for capstone mentors. If you have just signed up, an admin still needs
    to approve your account and attach you to a project.
  </div>

  <div id="mentor-empty" class="mentor-state" style="display:none;">
    You are not attached to any capstone projects yet. An admin assigns these from the capstone database page.
  </div>

  <div id="mentor-ui" class="mentor-layout" style="display:none;">
    <nav aria-label="Your capstone projects">
      <ul id="mentor-projects" class="mentor-projects"></ul>
    </nav>

    <section class="mentor-panel" aria-live="polite">
      <h2 id="mentor-title" class="mentor-panel__title">Select a project</h2>
      <div id="mentor-meta" class="mentor-panel__meta"></div>
      <div id="mentor-members" class="mentor-members"></div>

      <div id="mentor-chat" class="mentor-chat"></div>

      <div class="mentor-compose">
        <input id="mentor-input" class="mentor-compose__input" type="text"
               placeholder="Message the team…" disabled autocomplete="off">
        <button id="mentor-send" class="mentor-compose__send" type="button" disabled>Send</button>
      </div>
      <div id="mentor-status" class="mentor-status"></div>
    </section>
  </div>
</div>

<script type="module">
  import { javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

  const state = {
    projects: [],
    activeId: null,
    displayName: 'Mentor',
  };

  const el = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
                                  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  function show(which) {
    ['mentor-loading', 'mentor-denied', 'mentor-empty', 'mentor-ui'].forEach(id => {
      el(id).style.display = (id === which) ? (id === 'mentor-ui' ? 'grid' : 'block') : 'none';
    });
  }

  function setStatus(text) { el('mentor-status').textContent = text; }

  async function init() {
    let person;
    try {
      const res = await fetch(`${javaURI}/api/person/get`, fetchOptions);
      if (!res.ok) { show('mentor-denied'); return; }
      person = await res.json();
    } catch (err) {
      console.error('Mentor: identity lookup failed', err);
      show('mentor-denied');
      return;
    }

    // Spring owns roles; Flask's /api/id only carries a single role string.
    const roles = Array.isArray(person.roles) ? person.roles.map(r => r.name) : [];
    if (!roles.includes('ROLE_MENTOR')) { show('mentor-denied'); return; }
    state.displayName = person.name || person.uid || 'Mentor';

    // The capstone projects this mentor is attached to. Scoped server-side by the
    // caller's identity, so whatever comes back is already the correct set --
    // deliberately no client-side filtering, the browser does not decide this.
    let projects;
    try {
      const res = await fetch(`${javaURI}/api/capstones/mine`, fetchOptions);
      if (!res.ok) { show('mentor-denied'); return; }
      projects = await res.json();
    } catch (err) {
      console.error('Mentor: project list failed', err);
      show('mentor-denied');
      return;
    }

    state.projects = Array.isArray(projects) ? projects : [];
    if (state.projects.length === 0) { show('mentor-empty'); return; }

    renderProjects();
    show('mentor-ui');
    selectProject(state.projects[0].id);
  }

  function renderProjects() {
    el('mentor-projects').innerHTML = state.projects.map(p => `
      <li>
        <button class="mentor-project" type="button" data-id="${esc(p.id)}"
                aria-current="${p.id === state.activeId}">
          <span class="mentor-project__name">${esc(p.title || p.slug || 'Untitled project')}</span>
          <span class="mentor-project__meta">${esc(p.slug || '')}</span>
        </button>
      </li>`).join('');

    el('mentor-projects').querySelectorAll('.mentor-project').forEach(btn => {
      btn.addEventListener('click', () => selectProject(Number(btn.dataset.id)));
    });
  }

  async function selectProject(id) {
    state.activeId = id;
    const project = state.projects.find(p => p.id === id);
    if (!project) return;

    renderProjects();
    el('mentor-title').textContent = project.title || project.slug || 'Untitled project';
    // Link straight through to the capstone page this row mirrors.
    el('mentor-meta').innerHTML = project.url
      ? `<a href="${esc(project.url)}">View the full capstone page &rarr;</a>`
      : '';
    el('mentor-members').textContent = project.description || '';
    el('mentor-chat').innerHTML = '';

    await loadMessages(id);
    el('mentor-input').disabled = false;
    el('mentor-send').disabled = false;
    setStatus('');
  }


  async function loadMessages(id) {
    try {
      const res = await fetch(`${javaURI}/api/capstones/${id}/messages`, fetchOptions);
      if (!res.ok) {
        // A 403 here is the scoping doing its job, not a bug.
        setStatus(res.status === 403 ? 'You do not have access to this project.' : 'Could not load messages.');
        return;
      }
      const messages = await res.json();
      (Array.isArray(messages) ? messages : []).forEach(appendMessage);
      scrollChat();
    } catch (err) {
      console.error('Mentor: message load failed', err);
      setStatus('Could not load messages.');
    }
  }

  function appendMessage(msg) {
    const when = msg.date ? new Date(msg.date).toLocaleString() : '';
    const div = document.createElement('div');
    div.className = 'mentor-msg';
    div.innerHTML = `<span class="mentor-msg__sender">${esc(msg.sender || msg.name || 'unknown')}</span>` +
                    `<span class="mentor-msg__date">${esc(when)}</span><br>${esc(msg.message)}`;
    el('mentor-chat').appendChild(div);
  }

  function scrollChat() {
    const chat = el('mentor-chat');
    chat.scrollTop = chat.scrollHeight;
  }


  async function send() {
    const input = el('mentor-input');
    const text = input.value.trim();
    if (!text || !state.activeId) return;
    const button = el('mentor-send');
    button.disabled = true;
    try {
      const res = await fetch(`${javaURI}/api/capstones/${state.activeId}/messages`, {
        ...fetchOptions,
        method: 'POST',
        body: JSON.stringify({ name: state.displayName, message: text }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const messages = await res.json();
      el('mentor-chat').innerHTML = '';
      (Array.isArray(messages) ? messages : []).forEach(appendMessage);
      scrollChat();
      input.value = '';
      setStatus('');
    } catch (err) {
      console.error('Mentor: send failed', err);
      setStatus('Message failed to send.');
    } finally {
      button.disabled = false;
    }
  }

  el('mentor-send').addEventListener('click', send);
  el('mentor-input').addEventListener('keydown', e => { if (e.key === 'Enter') send(); });

  init();
</script>
