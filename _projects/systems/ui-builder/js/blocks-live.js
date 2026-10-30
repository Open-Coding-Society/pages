// Live blocks on a published page (DESIGN §8): group chat, team members, Message us, class
// announcements and calendar, the kanban board and visitor feedback (Data from your API is
// blocks-project.js). blocks-content.js liveCard draws each card; mountLiveBlocks finds the cards,
// matches each to its block in the page by its wrapper's data-ui-node, and mounts it once into
// its [data-ui-live-mount], reporting progress and refusals in its [data-ui-live-status]. A card
// that fails says so in its own status and never stops the others. Other systems' modules
// (Messages' conversation-embed.js, kanban-board.js, Courses' calendar-card.js and
// calendar-model.js, microblog.js) are loaded by URL from ctx.services.modules, so nothing here
// imports across systems.
//
// ctx: {registry, baseurl, pageOrigin, pageProtocol, slug, pageKey, doc, fetchImpl, storage, now,
//   loadModule?(url), navigate?(url), services: {config, richText, messagesModel, modules, store,
//   view, viewer: {springSignedIn, flaskSignedIn, guest, personId, isTeacher, canEdit, isOwner}}}.
import { findNode } from './page-model.js';
import { defOf, liveTypes, textOf } from './registry.js';
import { lineOf, ownValue } from './blocks-content.js';
import { element, getJson, liveParts, mountApiData, showStatus, browserOffline } from './blocks-project.js';
import { slugMatches } from './url-rules.js';
import { escapeHTML, h, toDOM } from './vnode.js';

const FEEDBACK_MAX = 280; // the Flask microblog's limit
const FEEDBACK_SHOWN = 20;

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

function idOf(value) {
  const id = typeof value === 'string' && /^\d{1,16}$/.test(value) ? Number(value) : value;
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

// "2026-10-30" is a calendar day: read at local noon so no time zone moves it.
function shortDay(day) {
  const date = new Date(`${day}T12:00:00`);
  return Number.isNaN(date.getTime()) ? day : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function initialsOf(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => Array.from(word)[0]).join('').toUpperCase();
}

/* ---------- context ---------- */

function textsOf(table) {
  if (!isObject(table)) return {};
  return Object.fromEntries(Object.entries(table).filter(([, value]) => typeof value === 'string'));
}

function liveContext(ctx, page, isStopped) {
  if (!isObject(ctx) || !isObject(ctx.registry)) throw new TypeError('UI Builder mountLiveBlocks: ctx.registry is required');
  const services = isObject(ctx.services) ? ctx.services : {};
  const config = isObject(services.config) ? services.config : {};
  const view = isObject(services.view) ? services.view : null;
  const who = isObject(services.viewer) ? services.viewer : {};
  const modules = isObject(services.modules) ? services.modules : {};
  const baseurl = String(typeof ctx.baseurl === 'string' ? ctx.baseurl : config.baseurl || '').replace(/\/+$/, '');
  const pick = (value) => (slugMatches(value, ctx.registry) ? value : null);
  const loadModule = typeof ctx.loadModule === 'function' ? ctx.loadModule : (url) => import(url);
  const loaded = new Map();
  return {
    ...ctx,
    say: (key, vars) => textOf(ctx.registry, key, vars),
    config,
    // config.js always says; a site without the setting keeps Spring on, as config.js does.
    springEnabled: config.springEnabled !== false,
    richText: services.richText,
    messagesModel: isObject(services.messagesModel) ? services.messagesModel : {},
    store: services.store || null,
    view,
    viewer: {
      springSignedIn: who.springSignedIn === true,
      flaskSignedIn: who.flaskSignedIn === true,
      guest: who.guest === true,
      canEdit: who.canEdit === true || (view !== null && view.canEdit === true),
      isOwner: who.isOwner === true,
    },
    baseurl,
    slug: pick(ctx.slug) || pick(view && view.slug),
    pageCourse: lineOf(isObject(ownValue(page, 'page')) ? page.page : {}, 'course'),
    signInHref: `${baseurl}/login`,
    chatTexts: textsOf(ownValue(ctx.registry.text, 'chat')),
    stopped: isStopped,
    groupLookups: new Map(),
    navigate: typeof ctx.navigate === 'function' ? ctx.navigate : (url) => globalThis.location.assign(url),
    load(name) {
      const url = ownValue(modules, name);
      if (typeof url !== 'string' || !url) return Promise.reject(new Error(`UI Builder: the page gave no address for the ${name} module`));
      if (!loaded.has(url)) loaded.set(url, Promise.resolve().then(() => loadModule(url)));
      return loaded.get(url);
    },
  };
}

/* ---------- gates (DESIGN §8) ---------- */

// No Spring: a notice. Signed out of Spring but in to Flask (a showcase guest): the guest
// wording. Signed out entirely: a sign-in link.
function gate(c, type, guestKey) {
  const def = defOf(c.registry, 'block', type) || {};
  if (def.needs === 'spring' && !c.springEnabled) return { text: c.say('blocks.live_needs_spring') };
  if (!guestKey || c.viewer.springSignedIn) return null;
  if (c.viewer.guest) return { text: c.say(guestKey) };
  return { text: c.say('blocks.live_sign_in'), link: { text: c.say('blocks.live_sign_in_link'), href: c.signInHref } };
}

function failure(c, error) {
  if (error && error.name === 'OfflineError' && browserOffline()) return { text: c.say('live.offline') };
  if (error && error.status === 401) return { text: c.say('blocks.live_sign_in'), link: { text: c.say('blocks.live_sign_in_link'), href: c.signInHref } };
  return { text: c.say('live.load_failed') };
}

const tell = (status, said) => showStatus(status, said.text, said);
const nothing = Object.freeze({ destroy() {} });
// Says why the block shows nothing (a gate, a missing setting) and mounts nothing.
const refuse = (status, said) => {
  tell(status, said);
  return nothing;
};

function isRestricted(c, name) {
  const { isClassGroup, isCourseChannel } = c.messagesModel;
  const group = { name };
  return (typeof isClassGroup === 'function' && isClassGroup(group)) || (typeof isCourseChannel === 'function' && isCourseChannel(group));
}

function courseCodeOf(c, value) {
  const code = typeof value === 'string' ? value.trim() : '';
  return (c.registry.courses || []).some((course) => course && course.value === code) ? code : '';
}

function courseLabel(c, code) {
  const course = (c.registry.courses || []).find((option) => option && option.value === code);
  return course ? course.label : code;
}

/* ---------- Message us (also the chat's fallback for visitors outside the group) ---------- */

function messageError(c, error) {
  if (error && error.error === 'own_page') return { text: c.say('blocks.sample_message_me') };
  if (error && error.name === 'OfflineError' && browserOffline()) return { text: c.say('live.offline') };
  if (error && error.status === 401) return failure(c, error);
  return { text: c.say('live.message_me_failed') };
}

function messageButton(c, settings, status) {
  const field = ((defOf(c.registry, 'block', 'message_me') || {}).fields || []).find((candidate) => candidate && candidate.id === 'label');
  const label = lineOf(settings, 'label') || (field && typeof field.default === 'string' ? field.default : '')
    || (defOf(c.registry, 'block', 'message_me') || {}).label || '';
  const button = element(c.doc, 'button', { className: 'ocs__btn accent fill', text: label, attrs: { type: 'button' } });
  button.addEventListener('click', async () => {
    if (button.disabled) return;
    button.disabled = true;
    showStatus(status, c.say('live.message_me_opening'));
    try {
      const id = idOf(ownValue(await c.store.messageOwner(c.slug), 'conversationId'));
      if (id === null) throw new Error('UI Builder: Spring named no conversation');
      c.navigate(`${c.baseurl}/dm?dm=${id}`);
    } catch (error) {
      button.disabled = false;
      tell(status, messageError(c, error));
    }
  });
  const row = element(c.doc, 'div', { className: 'ocs__links' });
  row.appendChild(button);
  return row;
}

const canMessage = (c) => Boolean(c.slug && c.store && typeof c.store.messageOwner === 'function' && !c.viewer.isOwner);

async function mountMessageMe(card, block, c, { status, mount }) {
  const stop = gate(c, 'message_me', 'view.guest_message_me');
  if (stop) return refuse(status, stop);
  if (!c.slug || !c.store || typeof c.store.messageOwner !== 'function') return refuse(status, { text: c.say('live.message_me_unpublished') });
  const note = lineOf(block.settings, 'note');
  mount.replaceChildren(...(note ? [element(c.doc, 'p', { className: 'ocs__text', text: note })] : []));
  // The owner would only be messaging themselves: they see what visitors will use it for.
  if (c.viewer.isOwner) showStatus(status, c.say('blocks.sample_message_me'));
  else {
    mount.appendChild(messageButton(c, block.settings, status));
    showStatus(status, '');
  }
  return { destroy() { mount.replaceChildren(); } };
}

/* ---------- group chat and team members ---------- */

async function mountChat(card, block, c, { status, mount }) {
  const stop = gate(c, 'chat', 'view.guest_comms');
  if (stop) return refuse(status, stop);
  const group = ownValue(block.settings, 'group');
  const groupId = idOf(ownValue(group, 'id'));
  if (groupId === null) return refuse(status, { text: c.say('blocks.sample_no_group') });
  const known = c.view && isObject(c.view.groups) ? ownValue(c.view.groups, String(groupId)) : undefined;
  const name = (known && known.name) || lineOf(group, 'name');
  if (isRestricted(c, name)) return refuse(status, { text: c.say('errors.group_not_allowed') });
  // A convenience, not access control (Spring doesn't check group-chat membership yet). Drafts
  // and browser pages have no published view; only editors open those.
  if (c.view && !(known && known.viewerIsMember === true)) {
    showStatus(status, c.say('blocks.live_not_member', { group: name }));
    if (canMessage(c)) mount.replaceChildren(messageButton(c, block.settings, status));
    return { destroy() { mount.replaceChildren(); } };
  }
  const embed = await c.load('conversationEmbed');
  if (c.stopped()) return nothing;
  const chat = await embed.mountGroupChat(mount, {
    groupId, config: c.config, richText: c.richText, readOnly: false, heading: '', texts: c.chatTexts,
  });
  showStatus(status, '');
  return { destroy() { chat.destroy(); } };
}

async function mountMembers(card, block, c, { status, mount }) {
  const stop = gate(c, 'members', 'view.guest_members');
  if (stop) return refuse(status, stop);
  if (!c.slug || !c.store || typeof c.store.members !== 'function') return refuse(status, { text: c.say('live.members_unpublished') });
  let names;
  try {
    names = await c.store.members(c.slug, block.id);
  } catch (error) {
    if (error && error.name === 'NotFoundError') return refuse(status, { text: c.say('live.members_unavailable') });
    throw error;
  }
  if (c.stopped()) return nothing;
  if (!names.length) return refuse(status, { text: c.say('live.members_empty') });
  // The Team block's markup: an ocs__avatar abbr (it keeps the accent under presets) and the name.
  mount.replaceChildren(toDOM(h('ul', { class: 'ocs__entity-list' }, names.map(({ name }) => h('li', null,
    h('div', { class: 'ocs__keypoint' }, h('abbr', { class: 'ocs__avatar', title: name }, initialsOf(name)), h('strong', null, name))))), { doc: c.doc }));
  showStatus(status, '');
  return { destroy() { mount.replaceChildren(); } };
}

/* ---------- class announcements and calendar ---------- */

// Event markers are calendar data, not words: Courses' own parser (calendar-model.js
// extractEventMarkers) takes them out, and each event becomes one short line under the message.
// The result is HTML for the chat's sanitizer, so everything a marker carried is escaped.
export function announcementText(body, say, extractEventMarkers) {
  const { html, events } = extractEventMarkers(String(body ?? ''));
  const lines = events.map((event) => escapeHTML(say('live.announcement_event', {
    title: String(event.title || '').trim() || say('live.announcement_event_untitled'), date: shortDay(event.date),
  })));
  return [html, ...lines].filter(Boolean).join('<br>');
}

// The course's announcement channel, by exact name, as the course pages find it. Never created.
function announcementGroup(c, course) {
  const name = `${course}-announcements`;
  if (!c.groupLookups.has(name)) {
    c.groupLookups.set(name, getJson(c, `${String(c.config.javaURI || '').replace(/\/+$/, '')}/api/groups/search?name=${encodeURIComponent(name)}`).then((answer) => {
      if (answer.offline) throw Object.assign(new Error('UI Builder: Spring did not answer'), { name: 'OfflineError' });
      if (!answer.ok) throw Object.assign(new Error(`UI Builder: group search answered ${answer.status}`), { status: answer.status });
      const match = (Array.isArray(answer.json) ? answer.json : []).find((group) => isObject(group) && group.name === name);
      return match ? idOf(match.id) : null;
    }));
  }
  return c.groupLookups.get(name);
}

async function mountAnnouncements(card, block, c, { status, mount }) {
  const stop = gate(c, 'announcements', 'view.guest_announcements');
  if (stop) return refuse(status, stop);
  const course = courseCodeOf(c, ownValue(block.settings, 'course'));
  if (!course) return refuse(status, { text: c.say('errors.bad_course') });
  const groupId = await announcementGroup(c, course);
  if (c.stopped()) return nothing;
  if (!groupId) return refuse(status, { text: c.say('live.announcements_missing', { course: courseLabel(c, course) }) });
  const [embed, calendarModel] = await Promise.all([c.load('conversationEmbed'), c.load('calendarModel')]);
  if (c.stopped()) return nothing;
  const { extractEventMarkers } = calendarModel;
  if (typeof extractEventMarkers !== 'function') throw new TypeError('UI Builder: calendar-model.js has no extractEventMarkers');
  const chat = await embed.mountGroupChat(mount, {
    groupId, config: c.config, richText: c.richText, readOnly: true, heading: '',
    // Only teachers post here, so an empty channel doesn't invite visitors to say hi.
    texts: { ...c.chatTexts, emptyTitle: c.say('live.announcements_empty_title'), emptyHint: c.say('live.announcements_empty_hint') },
    formatBody: (body) => announcementText(body, c.say, extractEventMarkers),
  });
  showStatus(status, '');
  return { destroy() { chat.destroy(); } };
}

// The kanban and calendar cards bring their own title and Open link (blocks-content.js liveCard):
// while one is in, the block's own title steps aside, so the page shows one card with one title.
function showOwnTitle(card, shown) {
  const header = card.querySelector('[data-ui-live-header]');
  if (header) header.hidden = !shown;
}

// The calendar card shows the school week to visitors who aren't signed in, so it has no sign-in gate.
async function mountCalendar(card, block, c, { status, mount }) {
  const stop = gate(c, 'calendar', null);
  if (stop) return refuse(status, stop);
  const course = courseCodeOf(c, ownValue(block.settings, 'course')) || courseCodeOf(c, c.pageCourse);
  const calendar = await c.load('calendarCard');
  if (c.stopped()) return nothing;
  const section = calendar.createCalendarCardSection({ course, title: lineOf(block.settings, 'title') }, c.doc);
  mount.replaceChildren(section);
  let mounted = null;
  try {
    mounted = calendar.mountCalendarCard(section, { springEnabled: c.springEnabled });
  } catch (error) {
    section.remove();
    throw error;
  }
  showOwnTitle(card, false);
  showStatus(status, '');
  return { destroy() { mounted.unmount(); section.remove(); showOwnTitle(card, true); } };
}

/* ---------- kanban board ---------- */

// GitHub allows 60 unsigned requests an hour per network, so a published board waits for a
// press of "Show our board" (DESIGN D15); people who can edit the page see it at once.
async function mountKanban(card, block, c, { status, mount }) {
  const url = lineOf(block.settings, 'url');
  if (!url) return refuse(status, { text: c.say('errors.kanban_bad_url') });
  let board = null;
  let section = null;
  const start = async () => {
    const kanban = await c.load('kanban');
    if (c.stopped()) return;
    if (!kanban.parseBoardUrl(url)) {
      mount.replaceChildren();
      showStatus(status, c.say('errors.kanban_bad_url'));
      return;
    }
    section = kanban.createKanbanSection({ url, filter: lineOf(block.settings, 'filter'), title: lineOf(block.settings, 'title') }, c.doc);
    mount.replaceChildren(section);
    board = kanban.mountKanbanBoard(section);
    board.refresh();
    showOwnTitle(card, false);
    showStatus(status, '');
  };
  const handle = { destroy() { if (board) board.unmount(); if (section) section.remove(); mount.replaceChildren(); showOwnTitle(card, true); } };
  if (c.viewer.canEdit) {
    await start();
    return handle;
  }
  const button = element(c.doc, 'button', { className: 'ocs__btn accent fill', text: c.say('blocks.live_show_board'), attrs: { type: 'button' } });
  button.addEventListener('click', () => {
    button.disabled = true;
    showStatus(status, c.say('blocks.live_loading'));
    // The button goes with the click, so focus moves to where the board appears.
    mount.setAttribute('tabindex', '-1');
    start().then(() => mount.focus(), (error) => {
      console.warn('UI Builder: the kanban board could not load', error);
      button.disabled = false;
      tell(status, failure(c, error));
    });
  });
  const row = element(c.doc, 'div', { className: 'ocs__links' });
  row.appendChild(button);
  mount.replaceChildren(row);
  showStatus(status, '');
  return handle;
}

/* ---------- visitor feedback (the Flask microblog) ---------- */

// The Flask microblog's Topic._generate_page_key, so the public read finds the topic a post made.
export function microblogPageKey(topicPath) {
  return String(topicPath).replace(/^\/+|\/+$/g, '').replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_').slice(0, 100).replace(/^_+|_+$/g, '');
}

// Flask writes UTC times without a zone; without the Z, Date would read them as local time.
function postTime(value) {
  if (typeof value !== 'string' || !value) return null;
  const date = new Date(/(?:[zZ]|[+-]\d\d:?\d\d)$/.test(value) ? value : `${value}Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

// First names only: visitors on public pages see who wrote, not their full name.
function postView(post, c) {
  const name = (typeof post.userName === 'string' ? post.userName.trim().split(/\s+/)[0] : '') || c.say('live.feedback_someone');
  const when = postTime(post.timestamp);
  return h('li', null,
    h('strong', null, name),
    when ? [' ', h('time', { datetime: when.toISOString() }, c.say('live.feedback_time', {
      time: when.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
    }))] : null,
    h('br'),
    h('span', null, typeof post.content === 'string' ? post.content : ''));
}

function feedbackForm(c, block, status, { onSend }) {
  const doc = c.doc;
  const id = `ui-feedback-${block.id}`;
  const form = element(doc, 'form', { className: 'ocs__stack', attrs: { novalidate: '' } });
  const field = element(doc, 'div', { className: 'ocs__field' });
  const label = element(doc, 'label', { className: 'ocs__label', text: lineOf(block.settings, 'prompt') || c.say('live.feedback_label'), attrs: { for: id } });
  // The status line is the card's own role=status region (always on the page); point the textarea
  // at it so a screen reader hears the "write your feedback first" message against this field.
  const describedBy = [`${id}-help`, status && status.id].filter(Boolean).join(' ');
  const input = element(doc, 'textarea', { className: 'ocs__input', attrs: { id, rows: '3', maxlength: String(FEEDBACK_MAX), 'aria-describedby': describedBy } });
  const help = element(doc, 'small', { text: c.say('live.feedback_help', { max: FEEDBACK_MAX }), attrs: { id: `${id}-help` } });
  const send = element(doc, 'button', { className: 'ocs__btn accent fill', text: c.say('live.feedback_send'), attrs: { type: 'submit' } });
  const row = element(doc, 'div', { className: 'ocs__links' });
  field.append(label, input, help);
  row.appendChild(send);
  form.append(field, row);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (send.disabled) return;
    const content = input.value.trim();
    if (!content || content.length > FEEDBACK_MAX) {
      // Say what's wrong in the status region (it is already on the page) before focus moves, and
      // mark the field invalid; both are undone once the feedback is sent.
      input.setAttribute('aria-invalid', 'true');
      onSend(null);
      input.focus();
      return;
    }
    input.removeAttribute('aria-invalid');
    send.disabled = true;
    onSend(content).then((sent) => {
      send.disabled = false;
      if (sent) input.value = '';
    });
  });
  return form;
}

async function mountFeedback(card, block, c, { status, mount }) {
  // Posts are filed under the published address, and only Spring publishes.
  const stop = gate(c, 'feedback', null);
  if (stop) return refuse(status, stop);
  if (!c.slug) return refuse(status, { text: c.say('live.feedback_unpublished') });
  const topicPath = `/ui-builder/view/?page=${c.slug}`;
  const pythonURI = String(c.config.pythonURI || '').replace(/\/+$/, '');
  const list = element(c.doc, 'div');
  let alive = true;

  const load = async () => {
    const answer = await getJson(c, `${pythonURI}/api/microblog/page/${microblogPageKey(topicPath)}?limit=${FEEDBACK_SHOWN}`);
    if (!alive) return;
    // 404: nobody has posted yet, so Flask has no topic for this page.
    const posts = answer.ok && isObject(answer.json) && Array.isArray(answer.json.microblogs) ? answer.json.microblogs.filter(isObject) : [];
    if (!answer.ok && answer.status !== 404) {
      tell(status, { text: c.say(answer.offline ? 'live.offline' : 'live.feedback_load_failed') });
      return;
    }
    list.replaceChildren(posts.length
      ? toDOM(h('ul', { class: 'ocs__entity-list' }, posts.slice(0, FEEDBACK_SHOWN).map((post) => postView(post, c))), { doc: c.doc })
      : element(c.doc, 'p', { className: 'ocs__text', text: c.say('live.feedback_none') }));
  };

  const send = async (content) => {
    if (content === null) {
      showStatus(status, c.say('live.feedback_check', { max: FEEDBACK_MAX }));
      return false;
    }
    showStatus(status, c.say('live.feedback_sending'));
    try {
      const microblog = await c.load('microblog');
      await microblog.createPost({ content, topicPath });
    } catch (error) {
      if (alive) showStatus(status, c.say(error && error.name === 'MicroblogRateLimitError' ? 'live.feedback_wait' : 'live.feedback_failed'));
      return false;
    }
    if (!alive) return true;
    showStatus(status, c.say('live.feedback_sent'));
    await load();
    return true;
  };

  if (c.viewer.flaskSignedIn) mount.replaceChildren(feedbackForm(c, block, status, { onSend: send }), list);
  else {
    const line = element(c.doc, 'p', { className: 'ocs__text', text: `${c.say('live.feedback_sign_in')} ` });
    line.appendChild(element(c.doc, 'a', { text: c.say('blocks.live_sign_in_link'), attrs: { href: c.signInHref } }));
    mount.replaceChildren(line, list);
  }
  showStatus(status, '');
  await load();
  return { destroy() { alive = false; mount.replaceChildren(); } };
}

/* ---------- mounting ---------- */

const MOUNTERS = Object.freeze({
  chat: mountChat,
  members: mountMembers,
  message_me: mountMessageMe,
  announcements: mountAnnouncements,
  calendar: mountCalendar,
  kanban: mountKanban,
  feedback: mountFeedback,
  api_data: (card, block, c) => mountApiData(card, block, c),
});

function destroyQuietly(handle) {
  try {
    if (handle && typeof handle.destroy === 'function') handle.destroy();
  } catch (error) {
    console.warn('UI Builder: a live block did not shut down cleanly', error);
  }
}

async function mountCard(card, block, c) {
  const parts = liveParts(card);
  if (!parts.status || !parts.mount) return null;
  try {
    return await MOUNTERS[block.type](card, block, c, parts);
  } catch (error) {
    console.warn(`UI Builder: the ${block.type} block could not load`, error);
    if (!c.stopped()) tell(parts.status, failure(c, error));
    return null;
  }
}

// Starts every live card under root at once and returns {ready, destroy()} straight away, so
// a page leaving can stop them even while some are still loading; a mount that finishes after
// destroy() is shut down as it arrives.
export function createLiveMounts(root, page, ctx) {
  let stopped = false;
  const c = liveContext({ ...ctx, doc: (ctx && ctx.doc) || root.ownerDocument }, page, () => stopped);
  const live = liveTypes(c.registry);
  const handles = [];
  const seen = new Set();
  const jobs = [];
  for (const card of root.querySelectorAll('[data-ui-live]')) {
    const type = card.getAttribute('data-ui-live');
    const wrapper = card.closest('[data-ui-node]');
    const id = wrapper ? wrapper.getAttribute('data-ui-node') : '';
    const found = id && !seen.has(id) && live.has(type) && Object.prototype.hasOwnProperty.call(MOUNTERS, type) ? findNode(page, id) : null;
    if (!found || found.kind !== 'block' || found.node.type !== type) continue;
    seen.add(id);
    jobs.push(mountCard(card, found.node, c).then((handle) => {
      if (stopped) destroyQuietly(handle);
      else if (handle) handles.push(handle);
    }));
  }
  return {
    ready: Promise.all(jobs).then(() => undefined),
    destroy() {
      stopped = true;
      handles.splice(0).forEach(destroyQuietly);
    },
  };
}

// Contract C: resolves once every card has mounted (or said why not) with {destroy()}.
export async function mountLiveBlocks(root, page, ctx) {
  const mounts = createLiveMounts(root, page, ctx);
  await mounts.ready;
  return { destroy: mounts.destroy };
}
