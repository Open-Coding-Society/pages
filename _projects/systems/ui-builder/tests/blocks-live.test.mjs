import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as messagesModel from '../../messages/js/messages-model.js';
import { embedTexts } from '../../messages/js/conversation-embed.js';
import * as calendarModel from '../../courses/js/announcement-calendar/calendar-model.js';
import { textOf } from '../js/registry.js';
import { announcementText, createLiveMounts, microblogPageKey, mountLiveBlocks } from '../js/blocks-live.js';
import { escapeHTML } from '../js/vnode.js';
import { createDocument, createEvent, settle, text } from './fixtures/live/dom.mjs';
import {
  MODULE_URLS, ORIGIN, blocksOf, drawPage, fakeCalendarCard, fakeConversationEmbed, fakeKanban, fakeMicroblog, fetchRouter, json,
  moduleLoader, mountOf, pageOf, statusOf,
} from './fixtures/live/pages.mjs';
import { loadRegistry, needsRuby } from './helpers.mjs';

const JAVA = 'https://spring.opencodingsociety.com';
const PYTHON = 'https://flask.opencodingsociety.com';
const CONFIG = Object.freeze({
  springEnabled: true, javaURI: JAVA, javaWebSocketURI: JAVA, pythonURI: PYTHON, baseurl: '/preview',
  fetchOptions: { method: 'GET', mode: 'cors', credentials: 'include', headers: { 'Content-Type': 'application/json', 'X-Origin': 'client' } },
});
const RICH_TEXT = { renderRichMessage(container, raw) { container.textContent = raw; }, createRichComposer() { return {}; } };
const GROUP = { id: 7, name: 'Binary Beasts' };
const SIGNED_IN = { springSignedIn: true, flaskSignedIn: true, guest: false };
const view = (extra = {}) => ({
  slug: 'flood-watch', canEdit: false, madeBy: { owner: 'Ada', group: 'Binary Beasts' },
  groups: { 7: { name: 'Binary Beasts', viewerIsMember: true } }, viewer: { signedIn: true, name: 'Grace' }, ...extra,
});

function storeFake() {
  const calls = [];
  return {
    calls,
    members: async (slug, blockId) => { calls.push(['members', slug, blockId]); return [{ name: 'Ada Lovelace' }, { name: 'grace' }]; },
    messageOwner: async (slug) => { calls.push(['messageOwner', slug]); return { conversationId: 44 }; },
  };
}

async function live(registry, blocks, options = {}) {
  const page = pageOf([blocks], options.pageSettings);
  const doc = createDocument();
  const root = drawPage(doc, page, registry);
  const fakes = {
    conversationEmbed: fakeConversationEmbed(), kanban: fakeKanban(), calendarCard: fakeCalendarCard(), calendarModel, microblog: fakeMicroblog(), ...options.fakes,
  };
  const loader = moduleLoader(fakes);
  const router = fetchRouter(options.routes || {});
  const navigated = [];
  const store = options.store === undefined ? storeFake() : options.store;
  const ctx = {
    registry, baseurl: '/preview', pageOrigin: ORIGIN, pageProtocol: 'https:', slug: options.slug === undefined ? 'flood-watch' : options.slug,
    pageKey: 'page-flood-watch', doc, fetchImpl: router.fetchImpl, storage: null, loadModule: loader.loadModule, navigate: (url) => navigated.push(url),
    services: {
      config: { ...CONFIG, ...options.config }, richText: RICH_TEXT, messagesModel, modules: MODULE_URLS, store,
      view: options.view === undefined ? view() : options.view, viewer: options.viewer || SIGNED_IN,
    },
  };
  const mounts = createLiveMounts(root, page, ctx);
  await mounts.ready;
  const ids = blocksOf(page).map((block) => block.id);
  return {
    page, doc, root, fakes, loader, router, navigated, store, mounts, ids,
    status: (index) => statusOf(root, ids[index]), mount: (index) => mountOf(root, ids[index]),
  };
}

const say = (registry, key, vars) => textOf(registry, key, vars);

// The browser reporting no network for the length of `run` (Node's navigator has no onLine).
async function whileOffline(run) {
  Object.defineProperty(globalThis.navigator, 'onLine', { value: false, configurable: true });
  try {
    await run();
  } finally {
    delete globalThis.navigator.onLine;
  }
}

test('the registry words the chat with every key conversation-embed.js reads', needsRuby, () => {
  const registry = loadRegistry();
  assert.deepEqual(Object.keys(registry.text.chat).sort(), Object.keys(embedTexts('group')).sort());
});

test('a Flask-only site shows a notice for Spring blocks and loads nothing', needsRuby, async () => {
  const registry = loadRegistry();
  // Feedback too: its posts are filed under the published address, and only Spring publishes.
  const blocks = [['chat', { group: GROUP }], ['members', { group: GROUP }], ['message_me', {}], ['announcements', { course: 'csp' }], ['calendar', {}], ['feedback', {}]];
  const run = await live(registry, blocks, { config: { springEnabled: false }, view: null, slug: null });
  for (let index = 0; index < blocks.length; index += 1) assert.equal(text(run.status(index)), say(registry, 'blocks.live_needs_spring'), blocks[index][0]);
  assert.deepEqual(run.loader.loaded, []);
  assert.deepEqual(run.router.calls, []);
  assert.deepEqual(run.store.calls, []);
});

test('signed out: a sign-in link; a showcase guest (Flask only): the guest wording', needsRuby, async () => {
  const registry = loadRegistry();
  const blocks = [['chat', { group: GROUP }], ['members', { group: GROUP }], ['message_me', {}], ['announcements', { course: 'csp' }]];
  const out = await live(registry, blocks, { viewer: { springSignedIn: false, flaskSignedIn: false, guest: false } });
  for (let index = 0; index < 4; index += 1) {
    assert.equal(text(out.status(index)), `${say(registry, 'blocks.live_sign_in')} ${say(registry, 'blocks.live_sign_in_link')}`);
    assert.equal(out.status(index).querySelector('a').getAttribute('href'), '/preview/login');
  }
  const guest = await live(registry, blocks, { viewer: { springSignedIn: false, flaskSignedIn: true, guest: true } });
  assert.deepEqual([0, 1, 2, 3].map((index) => text(guest.status(index))),
    ['view.guest_comms', 'view.guest_members', 'view.guest_message_me', 'view.guest_announcements'].map((key) => say(registry, key)));
  assert.deepEqual([...out.loader.loaded, ...guest.loader.loaded], []);
});

test('group chat mounts for members, each block on its own; others get a notice and Message us', needsRuby, async () => {
  const registry = loadRegistry();
  const run = await live(registry, [['chat', { group: GROUP, title: 'Team chat' }], ['chat', { group: GROUP }]]);
  const { mounts } = run.fakes.conversationEmbed;
  assert.equal(mounts.length, 2, 'two chat blocks, two embeds');
  assert.notEqual(mounts[0].root, mounts[1].root);
  assert.equal(mounts[0].root, run.mount(0));
  assert.equal(mounts[0].options.groupId, 7);
  assert.equal(mounts[0].options.readOnly, false);
  assert.equal(mounts[0].options.heading, '', 'the card header already shows the title');
  assert.equal(mounts[0].options.config.javaURI, JAVA);
  assert.equal(mounts[0].options.texts.signIn, say(registry, 'chat.signIn'));
  assert.equal(mounts[0].options.texts.emptyHint, say(registry, 'chat.emptyHint'));
  assert.equal(run.status(0).hidden, true);

  const outsider = await live(registry, [['chat', { group: GROUP }]], { view: view({ groups: { 7: { name: 'Binary Beasts', viewerIsMember: false } } }) });
  assert.equal(outsider.fakes.conversationEmbed.mounts.length, 0);
  assert.equal(text(outsider.status(0)), say(registry, 'blocks.live_not_member', { group: 'Binary Beasts' }));
  const button = outsider.mount(0).querySelector('button');
  button.click();
  await settle();
  assert.deepEqual(outsider.store.calls, [['messageOwner', 'flood-watch']]);
  assert.deepEqual(outsider.navigated, ['/preview/dm?dm=44']);

  const channel = await live(registry, [['chat', { group: { id: 9, name: 'csp-announcements' } }]], { view: view({ groups: { 9: { name: 'csp-announcements', viewerIsMember: true } } }) });
  assert.equal(text(channel.status(0)), say(registry, 'errors.group_not_allowed'));
  const unset = await live(registry, [['chat', { group: null }]]);
  assert.equal(text(unset.status(0)), say(registry, 'blocks.sample_no_group'));
  // A draft has no published view: its editors see the chat.
  const draft = await live(registry, [['chat', { group: GROUP }]], { view: null, slug: null });
  assert.equal(draft.fakes.conversationEmbed.mounts.length, 1);
});

test('team members are names only, from the published members route', needsRuby, async () => {
  const registry = loadRegistry();
  const run = await live(registry, [['members', { group: GROUP }]]);
  assert.deepEqual(run.store.calls, [['members', 'flood-watch', run.ids[0]]]);
  assert.deepEqual(run.mount(0).querySelectorAll('li strong').map(text), ['Ada Lovelace', 'grace']);
  assert.deepEqual(run.mount(0).querySelectorAll('li abbr').map(text), ['AL', 'G']);
  assert.equal(run.mount(0).querySelector('abbr.ocs__avatar').getAttribute('title'), 'Ada Lovelace');

  const empty = await live(registry, [['members', { group: GROUP }]], { store: { members: async () => [] } });
  assert.equal(text(empty.status(0)), say(registry, 'live.members_empty'));
  const gone = await live(registry, [['members', { group: GROUP }]], { store: { members: async () => { throw Object.assign(new Error('x'), { name: 'NotFoundError' }); } } });
  assert.equal(text(gone.status(0)), say(registry, 'live.members_unavailable'));
  const draft = await live(registry, [['members', { group: GROUP }]], { slug: null, view: null });
  assert.equal(text(draft.status(0)), say(registry, 'live.members_unpublished'));
  // A slug is checked against the registry's pattern, so widening it there reaches the live blocks.
  const widened = { ...registry, limits: { ...registry.limits, slug_pattern: '^[a-z0-9_-]{3,64}$' } };
  const underscore = await live(widened, [['members', { group: GROUP }]], { slug: 'team_3', view: view({ slug: 'team_3' }) });
  assert.deepEqual(underscore.store.calls, [['members', 'team_3', underscore.ids[0]]]);
  const malformed = await live(registry, [['members', { group: GROUP }]], { slug: 'team_3', view: view({ slug: 'team_3' }) });
  assert.equal(text(malformed.status(0)), say(registry, 'live.members_unpublished'));
});

test('Message us opens a DM with the owner; the owner sees what it is for instead', needsRuby, async () => {
  const registry = loadRegistry();
  const run = await live(registry, [['message_me', { label: 'Ask us', note: 'Questions?' }]]);
  assert.equal(text(run.mount(0).querySelector('p')), 'Questions?');
  const button = run.mount(0).querySelector('button.ocs__btn');
  assert.equal(text(button), 'Ask us');
  button.click();
  assert.equal(button.disabled, true, 'one press, one request');
  button.click();
  await settle();
  assert.deepEqual(run.store.calls, [['messageOwner', 'flood-watch']]);
  assert.deepEqual(run.navigated, ['/preview/dm?dm=44']);

  const owner = await live(registry, [['message_me', {}]], { viewer: { ...SIGNED_IN, isOwner: true } });
  assert.equal(owner.mount(0).querySelector('button'), null);
  assert.equal(text(owner.status(0)), say(registry, 'blocks.sample_message_me'));

  const failing = await live(registry, [['message_me', {}]], { store: { messageOwner: async () => { throw Object.assign(new Error('x'), { name: 'OfflineError' }); } } });
  failing.mount(0).querySelector('button').click();
  await settle();
  assert.equal(text(failing.status(0)), say(registry, 'live.message_me_failed'), 'a server that is down is not "offline"');
  await whileOffline(async () => {
    failing.mount(0).querySelector('button').click();
    await settle();
    assert.equal(text(failing.status(0)), say(registry, 'live.offline'));
  });
  assert.equal(failing.mount(0).querySelector('button').disabled, false, 'it can be tried again');
  assert.deepEqual(failing.navigated, []);

  const own = await live(registry, [['message_me', {}]], { store: { messageOwner: async () => { throw Object.assign(new Error('x'), { name: 'ApiError', error: 'own_page', status: 400 }); } } });
  own.mount(0).querySelector('button').click();
  await settle();
  assert.equal(text(own.status(0)), say(registry, 'blocks.sample_message_me'));
});

test('announcements find the course channel by exact name and show it read-only, markers as text', needsRuby, async (t) => {
  t.mock.method(console, 'warn', () => {}); // the offline case below warns, as it should
  const registry = loadRegistry();
  const search = `${JAVA}/api/groups/search?name=csp-announcements`;
  const routes = { [search]: json([{ id: 3, name: 'csp-announcements-old' }, { id: 4, name: 'csp-announcements' }]) };
  const run = await live(registry, [['announcements', { course: 'csp', limit: 5 }], ['announcements', { course: 'csp' }]], { routes });
  assert.equal(run.router.calls.length, 1, 'one lookup per course per page');
  assert.equal(run.router.calls[0].init.credentials, 'include');
  const [first, second] = run.fakes.conversationEmbed.mounts;
  assert.equal(first.options.groupId, 4);
  assert.equal(first.options.readOnly, true);
  assert.equal(second.options.groupId, 4);
  // Markers as Courses writes them (calendar-model.js), so a change to their format shows up here.
  const event = { id: '42', date: '2026-10-30', priority: 'P1', type: 'deadline', title: 'Sprint <b>review', periods: ['3', '4'], description: 'Bring demos' };
  const body = calendarModel.appendEventMarkers('Sprint review Friday<br>', [event, { ...event, id: '43', title: '' }]);
  const shown = first.options.formatBody(body);
  assert.ok(!shown.includes('[[event'), 'the marker is not shown as data');
  assert.ok(shown.includes('Sprint &lt;b&gt;review'), 'what the marker carried is escaped');
  const date = new Date('2026-10-30T12:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  assert.equal(shown, `Sprint review Friday<br>${escapeHTML(say(registry, 'live.announcement_event', { title: event.title, date }))}`
    + `<br>${escapeHTML(say(registry, 'live.announcement_event', { title: say(registry, 'live.announcement_event_untitled'), date }))}`, 'one line per event');
  assert.equal(shown, announcementText(body, (key, vars) => say(registry, key, vars), calendarModel.extractEventMarkers));
  // Only teachers post announcements: an empty channel doesn't ask visitors to say hi.
  assert.equal(first.options.texts.emptyTitle, say(registry, 'live.announcements_empty_title'));
  assert.equal(first.options.texts.emptyHint, say(registry, 'live.announcements_empty_hint'));
  assert.equal(first.options.texts.signIn, say(registry, 'chat.signIn'), 'the rest is the chat wording');

  const missing = await live(registry, [['announcements', { course: 'csa' }]], { routes: { [`${JAVA}/api/groups/search?name=csa-announcements`]: json([]) } });
  assert.equal(text(missing.status(0)), say(registry, 'live.announcements_missing', { course: registry.courses.find((c) => c.value === 'csa').label }));
  const down = await live(registry, [['announcements', { course: 'csp' }]]);
  assert.equal(text(down.status(0)), say(registry, 'live.load_failed'), 'a server that is down is not "offline"');
  await whileOffline(async () => {
    const offline = await live(registry, [['announcements', { course: 'csp' }]]);
    assert.equal(text(offline.status(0)), say(registry, 'live.offline'));
  });
});

test('the class calendar uses the owner\'s card, with the block\'s course or the page\'s', needsRuby, async () => {
  const registry = loadRegistry();
  const run = await live(registry, [['calendar', { course: '', title: 'When' }], ['calendar', { course: 'csa', title: '' }]], { viewer: { springSignedIn: false } });
  const { cards } = run.fakes.calendarCard;
  assert.deepEqual(cards.map((card) => card.options), [{ course: 'csp', title: 'When' }, { course: 'csa', title: '' }]);
  assert.deepEqual(cards[0].mountOptions, { springEnabled: true });
  assert.equal(cards[0].section.parentNode, run.mount(0));
  // One card, one title: the owner's card carries the title, so the block's own steps aside.
  const frame = run.root.querySelector(`[data-ui-node="${run.ids[0]}"] [data-ui-live]`);
  assert.equal(frame.getAttribute('class'), null, 'the frame around the owner\'s card is not a card');
  assert.equal(frame.querySelector('[data-ui-live-header]').hidden, true);
  run.mounts.destroy();
  assert.equal(cards[0].unmounted, true);
  assert.equal(cards[0].section.parentNode, null);
  assert.equal(frame.querySelector('[data-ui-live-header]').hidden, false, 'the block\'s title is back once the card is gone');
});

test('a board waits for "Show our board" unless the viewer can edit the page', needsRuby, async () => {
  const registry = loadRegistry();
  const url = 'https://github.com/orgs/UGRC-CSA/projects/1';
  const run = await live(registry, [['kanban', { url, filter: 'Team', title: 'Our board' }]]);
  assert.deepEqual(run.loader.loaded, [], 'no GitHub request before the press');
  const header = run.root.querySelector(`[data-ui-node="${run.ids[0]}"] [data-ui-live-header]`);
  assert.equal(text(header), 'Our board', 'the button waits under the block\'s title');
  assert.equal(header.hidden, false);
  const button = run.mount(0).querySelector('button');
  assert.equal(text(button), say(registry, 'blocks.live_show_board'));
  button.click();
  await settle();
  const [board] = run.fakes.kanban.boards;
  assert.deepEqual(board.options, { url, filter: 'Team', title: 'Our board' });
  assert.equal(board.refreshed, 1);
  assert.equal(board.section.parentNode, run.mount(0));
  assert.equal(run.doc.activeElement, run.mount(0));
  assert.equal(header.hidden, true, 'the board\'s own card has the title now');

  const editor = await live(registry, [['kanban', { url }]], { viewer: { ...SIGNED_IN, canEdit: true } });
  assert.equal(editor.fakes.kanban.boards.length, 1, 'editors see it at once');
  const bad = await live(registry, [['kanban', { url: 'https://github.com/users/ada/projects/2/x' }]], { viewer: { ...SIGNED_IN, canEdit: true } });
  assert.equal(text(bad.status(0)), say(registry, 'errors.kanban_bad_url'));
  editor.mounts.destroy();
  assert.equal(editor.fakes.kanban.boards[0].unmounted, true);
});

test('feedback reads the page\'s microblog topic and posts to it, first names only', needsRuby, async () => {
  const registry = loadRegistry();
  const key = microblogPageKey('/ui-builder/view/?page=flood-watch');
  assert.equal(key, 'ui-builder_view_page_flood-watch', 'the key Flask makes from that path');
  const read = `${PYTHON}/api/microblog/page/${key}?limit=20`;
  let posts = [{ userName: 'Ada Lovelace', content: '<b>Great</b> map', timestamp: '2026-10-28T17:00:00.123456', userUid: 'ada' }];
  const routes = { [read]: () => json({ microblogs: posts }) };
  const run = await live(registry, [['feedback', { title: 'Feedback', prompt: 'What next?' }]], { routes });
  const items = run.mount(0).querySelectorAll('li');
  assert.equal(items.length, 1);
  assert.ok(text(items[0]).startsWith('Ada · '), 'first name, then the time');
  assert.ok(text(items[0]).endsWith('<b>Great</b> map'), 'content is text');
  assert.equal(items[0].querySelector('time').getAttribute('datetime'), '2026-10-28T17:00:00.123Z', 'Flask times are UTC');
  assert.ok(!run.mount(0).innerHTML.includes('ada<'), 'no uid on the page');

  const form = run.mount(0).querySelector('form');
  const label = form.querySelector('label');
  const box = form.querySelector('textarea');
  assert.equal(text(label), 'What next?');
  assert.equal(label.getAttribute('for'), box.getAttribute('id'));
  assert.equal(box.getAttribute('maxlength'), '280');
  // The textarea points at the card's own status line (a role=status region that is always on the
  // page), so a screen reader hears the validation message against this field.
  const statusId = `ui-live-status-${run.ids[0]}`;
  assert.equal(run.status(0).getAttribute('id'), statusId);
  assert.ok((box.getAttribute('aria-describedby') || '').split(' ').includes(statusId), 'aria-describedby names the status line');
  form.dispatchEvent(createEvent('submit'));
  await settle();
  assert.equal(text(run.status(0)), say(registry, 'live.feedback_check', { max: 280 }));
  assert.equal(box.getAttribute('aria-invalid'), 'true', 'an empty submit marks the field invalid');
  assert.deepEqual(run.fakes.microblog.posts, []);

  box.value = '  Add rain data  ';
  posts = [{ userName: 'Grace Hopper', content: 'Add rain data', timestamp: '2026-10-28T18:00:00Z' }, ...posts];
  form.dispatchEvent(createEvent('submit'));
  await settle();
  assert.deepEqual(run.fakes.microblog.posts, [{ content: 'Add rain data', topicPath: '/ui-builder/view/?page=flood-watch' }]);
  assert.equal(box.value, '');
  assert.equal(box.getAttribute('aria-invalid'), null, 'cleared once the feedback is accepted');
  assert.equal(text(run.status(0)), say(registry, 'live.feedback_sent'));
  assert.equal(run.mount(0).querySelectorAll('li').length, 2, 'the list reloads');

  run.fakes.microblog.error = Object.assign(new Error('wait'), { name: 'MicroblogRateLimitError' });
  box.value = 'Again';
  form.dispatchEvent(createEvent('submit'));
  await settle();
  assert.equal(text(run.status(0)), say(registry, 'live.feedback_wait'));
  assert.equal(box.value, 'Again', 'nothing typed is lost');
});

test('feedback without Flask sign-in shows the posts and a sign-in link; unpublished pages wait', needsRuby, async () => {
  const registry = loadRegistry();
  const key = microblogPageKey('/ui-builder/view/?page=flood-watch');
  const run = await live(registry, [['feedback', {}]], {
    viewer: { springSignedIn: false, flaskSignedIn: false }, routes: { [`${PYTHON}/api/microblog/page/${key}`]: json({ message: 'Page topic not found' }, 404) },
  });
  assert.equal(run.mount(0).querySelector('form'), null);
  assert.equal(run.mount(0).querySelector('a').getAttribute('href'), '/preview/login');
  assert.ok(text(run.mount(0)).includes(say(registry, 'live.feedback_none')), 'a page nobody posted on yet');
  const draft = await live(registry, [['feedback', {}]], { slug: null, view: null });
  assert.equal(text(draft.status(0)), say(registry, 'live.feedback_unpublished'));
  assert.deepEqual(draft.router.calls, []);
});

test('one failing block reports in its own card; mounts that finish late are shut down', needsRuby, async (t) => {
  const warned = t.mock.method(console, 'warn', () => {});
  const registry = loadRegistry();
  const broken = { async mountGroupChat() { throw new Error('socket library missing'); } };
  const run = await live(registry, [['chat', { group: GROUP }], ['members', { group: GROUP }]], { fakes: { conversationEmbed: broken } });
  assert.equal(text(run.status(0)), say(registry, 'live.load_failed'));
  assert.equal(warned.mock.callCount(), 1, 'the failure is logged for whoever debugs it');
  assert.equal(run.mount(1).querySelectorAll('li').length, 2, 'the next block still mounts');

  let release;
  const slow = fakeConversationEmbed();
  const gate = new Promise((resolve) => { release = resolve; });
  const late = { mounts: slow.mounts, async mountGroupChat(root, options) { await gate; return slow.mountGroupChat(root, options); } };
  const page = pageOf([[['chat', { group: GROUP }]]]);
  const doc = createDocument();
  const root = drawPage(doc, page, registry);
  const loader = moduleLoader({ conversationEmbed: late });
  const mounts = createLiveMounts(root, page, {
    registry, baseurl: '', pageOrigin: ORIGIN, slug: 'flood-watch', doc, loadModule: loader.loadModule,
    services: { config: CONFIG, richText: RICH_TEXT, messagesModel, modules: MODULE_URLS, store: storeFake(), view: view(), viewer: SIGNED_IN },
  });
  await settle();
  mounts.destroy();
  release();
  await mounts.ready;
  assert.equal(slow.mounts.length, 1);
  assert.equal(slow.mounts[0].destroyed, true, 'the page left before the chat was ready');
});

test('cards are matched to their blocks by id and type, and mount once', needsRuby, async () => {
  const registry = loadRegistry();
  const page = pageOf([[['members', { group: GROUP }], ['text', { body: 'Hi' }]]]);
  const doc = createDocument();
  const root = drawPage(doc, page, registry);
  // A stray card that claims to be a chat, and a copy of the members card.
  const [members] = blocksOf(page);
  const wrapper = root.querySelector(`[data-ui-node="${members.id}"]`);
  const forged = doc.createElement('section');
  forged.setAttribute('data-ui-live', 'chat');
  wrapper.appendChild(forged);
  const store = storeFake();
  const handle = await mountLiveBlocks(root, page, {
    registry, baseurl: '', pageOrigin: ORIGIN, slug: 'flood-watch', doc, loadModule: async () => { throw new Error('nothing to load'); },
    services: { config: CONFIG, richText: RICH_TEXT, messagesModel, modules: MODULE_URLS, store, view: view(), viewer: SIGNED_IN },
  });
  assert.deepEqual(store.calls, [['members', 'flood-watch', members.id]], 'the forged card is skipped and members mounts once');
  handle.destroy();
  assert.equal(mountOf(root, members.id).childNodes.length, 0);
  assert.throws(() => createLiveMounts(root, page, {}), TypeError);
});
