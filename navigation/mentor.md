---
layout: post
title: My Capstone Projects
permalink: /mentor
search_exclude: true
show_reading_time: false
menu: nav/homejava.html
---

{% include nav/homejava.html %}

<div class="mentor-page">
  <div id="mentor-loading" class="mentor-state">Loading your projects…</div>

  <div id="mentor-denied" class="mentor-state mentor-state--denied" style="display:none;">
    This page is for capstone mentors. If you have just signed up, an admin still needs
    to approve your account and attach you to a project.
  </div>

  <div id="mentor-empty" class="mentor-state" style="display:none;">
    You are not attached to any capstone projects yet. An admin assigns these.
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

<script src="https://cdnjs.cloudflare.com/ajax/libs/sockjs-client/1.5.1/sockjs.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/stomp.js/2.3.3/stomp.min.js"></script>

<script type="module">
  import { javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

  // Mirrors _includes/lesson_chat.html: locally the websocket connector is a second
  // Tomcat port, in prod it is the same host.
  const CHAT_SOCKET_PORT = 8589;
  function chatSocketEndpoint() {
    const uri = new URL(javaURI);
    if (uri.hostname === 'localhost' || uri.hostname === '127.0.0.1') {
      return `${uri.protocol}//${uri.hostname}:${CHAT_SOCKET_PORT}/ws-chat`;
    }
    return javaURI + '/ws-chat';
  }

  const state = {
    projects: [],
    activeId: null,
    displayName: 'Mentor',
    client: null,
    subscription: null,
    connected: false,
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

    // GET /api/groups is scoped server-side for mentors, so whatever comes back is
    // already the correct set. Deliberately no client-side filtering: the browser is
    // not the place that decides what a mentor may see.
    let groups;
    try {
      const res = await fetch(`${javaURI}/api/groups`, fetchOptions);
      if (!res.ok) { show('mentor-denied'); return; }
      groups = await res.json();
    } catch (err) {
      console.error('Mentor: project list failed', err);
      show('mentor-denied');
      return;
    }

    state.projects = Array.isArray(groups) ? groups : [];
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
          <span class="mentor-project__name">${esc(p.name || 'Untitled project')}</span>
          <span class="mentor-project__meta">${esc(p.course || '')}${p.period ? ' · Period ' + esc(p.period) : ''}</span>
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
    el('mentor-title').textContent = project.name || 'Untitled project';
    el('mentor-meta').textContent =
      [project.course, project.period ? `Period ${project.period}` : null].filter(Boolean).join(' · ');
    el('mentor-members').textContent = '';
    el('mentor-chat').innerHTML = '';

    await loadMembers(id);
    await loadMessages(id);
    await connect(id);
  }

  async function loadMembers(id) {
    try {
      const res = await fetch(`${javaURI}/api/groups/${id}`, fetchOptions);
      if (!res.ok) return;
      const detail = await res.json();
      const members = detail.groupMembers || detail.members || [];
      if (members.length) {
        el('mentor-members').textContent =
          'Team: ' + members.map(m => m.name || m.uid).join(', ');
      }
    } catch (err) {
      console.warn('Mentor: member list unavailable', err);
    }
  }

  async function loadMessages(id) {
    try {
      const res = await fetch(`${javaURI}/api/groups/chat/${id}/messages`, fetchOptions);
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

  function connect(id) {
    return new Promise(resolve => {
      if (typeof SockJS === 'undefined' || typeof Stomp === 'undefined') {
        setStatus('Live chat unavailable; showing history only.');
        return resolve(false);
      }
      if (state.subscription) { try { state.subscription.unsubscribe(); } catch (e) {} }
      if (state.client && state.connected) { try { state.client.disconnect(); } catch (e) {} }
      state.connected = false;

      setStatus('Connecting…');
      const client = Stomp.over(new SockJS(chatSocketEndpoint()));
      client.debug = null;
      state.client = client;

      client.connect({}, () => {
        state.connected = true;
        setStatus('Connected');
        el('mentor-input').disabled = false;
        el('mentor-send').disabled = false;
        state.subscription = client.subscribe(`/topic/group/${id}`, frame => {
          try { appendMessage(JSON.parse(frame.body)); scrollChat(); }
          catch (err) { console.warn('Mentor: bad frame', err); }
        });
        resolve(true);
      }, err => {
        console.warn('Mentor: chat connection failed', err);
        state.connected = false;
        setStatus('Disconnected; showing history only.');
        el('mentor-input').disabled = true;
        el('mentor-send').disabled = true;
        resolve(false);
      });
    });
  }

  function send() {
    const input = el('mentor-input');
    const text = input.value.trim();
    if (!text || !state.connected || !state.activeId) return;
    try {
      state.client.send('/app/groups.chat', {}, JSON.stringify({
        context: 'sendMessage',
        groupId: state.activeId,
        sender: state.displayName,
        message: text,
        image: null,
        date: new Date().toISOString(),
      }));
      input.value = '';
    } catch (err) {
      console.error('Mentor: send failed', err);
      setStatus('Message failed to send.');
    }
  }

  el('mentor-send').addEventListener('click', send);
  el('mentor-input').addEventListener('keydown', e => { if (e.key === 'Enter') send(); });

  init();
</script>
