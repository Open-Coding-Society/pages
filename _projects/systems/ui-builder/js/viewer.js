// The page viewer at /ui-builder/view/ (DESIGN §11): ?page=<slug> shows a published page,
// ?draft=<springId> a draft to its editors and teachers, ?local=<localId> a page saved in this
// browser. The page is rendered with render.js and drawn with toDOM (rich text through
// rich-content.js), then its live blocks mount (blocks-live.js) and its click-to-load embeds are
// wired (blocks-project.js). An attribution bar above the page says who made it, with Edit for
// people who can edit it and Report for everyone. It refuses to run inside a frame, makes no
// Spring request on a Flask-only site, and stops every live block when the page is hidden.
//
//   startViewer(root, {registry, config, richText, messagesModel, modules, store})
//     → {ready, destroy()}
import { textOf } from './registry.js';
import { renderPage } from './render.js';
import { contentRenderers } from './blocks-content.js';
import { createRichHooks } from './rich-content.js';
import { createLiveMounts } from './blocks-live.js';
import { browserOffline, getJson, wireEmbeds } from './blocks-project.js';
import { LOCAL_ID, isPageDocument, storeErrorText } from './page-store.js';
import { hostOf, slugMatches } from './url-rules.js';
import { h, toDOM } from './vnode.js';

const SPRING_ID = /^[1-9]\d{0,15}$/;
const SPRING_COMMS = new Set(['chat', 'members', 'message_me', 'announcements']);
const FLASK_CHECK_MS = 8000;

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

// Which page the address asks for. ?page wins over ?draft, which wins over ?local.
export function viewRequest(search, registry) {
  const params = new URLSearchParams(search);
  if (params.has('page')) {
    const slug = params.get('page');
    // The registry's slug shape only: a page published before its word was reserved still opens.
    return slugMatches(slug, registry) ? { mode: 'page', slug } : { mode: 'page', slug: null };
  }
  if (params.has('draft')) {
    const id = params.get('draft');
    return SPRING_ID.test(id) && Number.isSafeInteger(Number(id)) ? { mode: 'draft', id: Number(id) } : { mode: 'draft', id: null };
  }
  if (params.has('local')) {
    const id = params.get('local');
    return LOCAL_ID.test(id) ? { mode: 'local', id } : { mode: 'local', id: null };
  }
  return { mode: 'none' };
}

function blockTypes(page) {
  const types = new Set();
  for (const section of Array.isArray(page.sections) ? page.sections : []) {
    for (const cell of isObject(section) && Array.isArray(section.cells) ? section.cells : []) {
      for (const block of isObject(cell) && Array.isArray(cell.blocks) ? cell.blocks : []) {
        if (isObject(block) && block.hidden !== true && typeof block.type === 'string') types.add(block.type);
      }
    }
  }
  return types;
}

// mailto: with the registry's wording; "'" is escaped too, since vnode.js refuses quotes in an href.
function reportHref(say, pageUrl) {
  const part = (text) => encodeURIComponent(text).replace(/'/g, '%27');
  return `mailto:?subject=${part(say('view.report_subject'))}&body=${part(say('view.report_body', { url: pageUrl }))}`;
}

export function startViewer(root, deps = {}) {
  const { registry, config = {}, richText, messagesModel = {}, modules = {}, store } = deps;
  if (!root || typeof root.replaceChildren !== 'function') throw new TypeError('UI Builder startViewer: root must be an element');
  if (!isObject(registry) || !isObject(registry.text)) throw new TypeError('UI Builder startViewer: registry is required (registry.js readRegistry)');
  if (!store || typeof store.open !== 'function') throw new TypeError('UI Builder startViewer: store must be a LocalPageStore or SpringPageStore');
  const doc = deps.doc || root.ownerDocument;
  const win = deps.win || doc.defaultView || globalThis.window;
  const location = deps.location || win.location;
  const say = (key, vars) => textOf(registry, key, vars);
  const baseurl = String(config.baseurl || '').replace(/\/+$/, '');
  const springEnabled = config.springEnabled !== false;
  const pageOrigin = location.origin;
  const here = `${location.pathname}${location.search}`;
  let session = null;
  let generation = 0;

  const draw = (vnode) => toDOM(vnode, { doc });
  const link = (text, href, extra = {}) => h('a', { href, ...extra }, text);

  // A message in place of the page: a callout with an optional link or button after it.
  function notice(text, { action = null, onRetry = null } = {}) {
    const box = draw(h('div', { class: 'ocs__container ocs__stack' },
      h('div', { class: 'ocs__callout', role: 'status' }, text, action ? [' ', action] : null),
      onRetry ? h('div', { class: 'ocs__links' }, h('button', { type: 'button', class: 'ocs__btn', 'data-ui-viewer-retry': '' }, say('view.retry'))) : null));
    if (onRetry) box.querySelector('[data-ui-viewer-retry]').addEventListener('click', onRetry);
    root.replaceChildren(box);
  }

  const signIn = () => link(say('blocks.live_sign_in_link'), `${baseurl}/login`);
  const builderLink = () => link(say('view.open_builder'), `${baseurl}/ui-builder/`);

  function teardown() {
    if (!session) return;
    session.live.destroy();
    session.embeds.destroy();
    session = null;
  }

  // Being framed is how clickjacking starts, so the viewer only offers a way out.
  if (win.top !== win.self) {
    notice(say('view.framed'), { action: link(say('view.open_directly'), here, { target: '_blank' }) });
    return { ready: Promise.resolve(), destroy() {} };
  }

  const request = viewRequest(location.search, registry);

  async function whoami() {
    if (!springEnabled || typeof store.whoami !== 'function') return null;
    try {
      return await store.whoami();
    } catch (_) {
      return null; // who is viewing only refines the live blocks; the page shows either way
    }
  }

  // Flask's /api/id answers 200 to anyone signed in to Flask, guests included.
  async function flaskSignedIn() {
    const answer = await getJson({ fetchImpl: deps.fetchImpl, config }, `${String(config.pythonURI || '').replace(/\/+$/, '')}/api/id`, { timeoutMs: FLASK_CHECK_MS });
    return answer.ok;
  }

  // The page, and what is known about the viewer before anything else is asked.
  async function open() {
    if (request.mode === 'page') {
      const view = await store.published(request.slug);
      // PublishedView has no owner id (public data never carries person ids): the owner is the
      // editor whose name is the owner's. Spring still refuses own_page if a twin slips through.
      const isOwner = view.canEdit && Boolean(view.madeBy.owner) && view.madeBy.owner === view.viewer.name;
      return {
        page: view.spec, view, slug: view.slug, pageKey: `page-${view.slug}`, editHref: view.canEdit && view.pageId ? `?page=${view.pageId}` : null,
        viewer: { springSignedIn: view.viewer.signedIn, canEdit: view.canEdit, isOwner },
      };
    }
    if (request.mode === 'draft') {
      const { page, meta } = await store.open({ kind: 'spring', id: request.id });
      const slug = meta.status === 'PUBLISHED' ? meta.slug : null;
      return {
        page, view: null, meta, slug, pageKey: `draft-${request.id}`, editHref: `?page=${request.id}`,
        viewer: { springSignedIn: true, canEdit: true, isOwner: meta.isOwner === true },
      };
    }
    const { page, meta } = await store.open({ kind: 'local', id: request.id });
    return {
      page, view: null, meta, slug: null, pageKey: `local-${request.id}`, editHref: `?local=${request.id}`,
      viewer: { springSignedIn: false, canEdit: true, isOwner: true },
    };
  }

  async function viewerOf(opened, types) {
    const signedIn = opened.viewer.springSignedIn;
    const comms = [...types].some((type) => SPRING_COMMS.has(type));
    // Flask is asked only when it changes something: feedback posting, or a signed-out visitor
    // who may be a showcase guest (signed in to Flask only).
    const askFlask = (types.has('feedback') && Boolean(opened.slug)) || (springEnabled && comms && !signedIn);
    const [person, flask] = await Promise.all([
      opened.mode !== 'page' || signedIn ? whoami() : null,
      askFlask ? flaskSignedIn() : false,
    ]);
    const springSignedIn = signedIn || person !== null;
    return {
      springSignedIn, flaskSignedIn: flask, guest: !springSignedIn && flask,
      personId: person ? person.personId : null, isTeacher: Boolean(person && person.isTeacher),
      canEdit: opened.viewer.canEdit, isOwner: opened.viewer.isOwner,
    };
  }

  function barOf(opened) {
    const items = [];
    const edit = opened.editHref ? link(say('view.edit'), `${baseurl}/ui-builder/${opened.editHref}`, { class: 'ocs__btn small' }) : null;
    if (opened.mode === 'page') {
      const { owner, group } = opened.view.madeBy;
      let madeBy = '';
      if (owner && group) madeBy = say('view.made_by_group', { name: owner, group });
      else if (owner || group) madeBy = say('view.made_by', { name: owner || group });
      items.push(h('strong', { class: 'ocs__badge' }, say('view.attribution')), madeBy ? h('span', { class: 'ocs__text' }, madeBy) : null, edit,
        link(say('view.report'), reportHref(say, location.href), { class: 'ocs__btn small' }));
    } else {
      const draft = opened.mode === 'draft';
      items.push(h('strong', { class: 'ocs__badge' }, say(draft ? 'view.draft_badge' : 'view.local_badge')),
        h('span', { class: 'ocs__text' }, say(draft ? 'view.draft_note' : 'view.local_note')), edit,
        opened.slug ? link(say('view.open_live'), `${baseurl}/ui-builder/view/?page=${encodeURIComponent(opened.slug)}`, { class: 'ocs__btn small' }) : null);
    }
    return h('div', { class: 'ocs__container', 'data-ui-viewer-bar': '' }, h('div', { class: 'ocs__links' }, items));
  }

  // Why the page didn't load. "Check your connection" only when this browser knows it is offline;
  // otherwise OCS didn't answer, or answered why (page-store.js storeErrorText words that).
  function loadProblem(error) {
    if (error && error.name === 'OfflineError') return say(browserOffline() ? 'view.load_failed' : 'view.no_answer');
    const { key, vars } = storeErrorText(error);
    return say(key, vars);
  }

  function showError(error) {
    const name = error && error.name;
    if (name === 'NotFoundError') {
      if (request.mode === 'page') notice(say('view.not_found'), { action: signIn() });
      else if (request.mode === 'draft') notice(say('view.draft_not_found'), { action: builderLink() });
      else notice(say('view.local_not_found'), { action: builderLink() });
    } else if (error && error.status === 401) {
      notice(say('view.sign_in_to_see'), { action: signIn() });
    } else if (error && (error.error === 'storage_blocked' || error.error === 'corrupt')) {
      notice(say('view.local_unreadable'), { action: builderLink() });
    } else {
      if (name !== 'OfflineError') console.error('UI Builder viewer: the page could not load', error);
      notice(loadProblem(error), { onRetry: () => { load(); } });
    }
  }

  async function show(opened, mine) {
    const page = opened.page;
    if (!isPageDocument(page)) {
      const newer = isObject(page) && Number.isInteger(page.schemaVersion) && page.schemaVersion > 1;
      notice(say(newer ? 'errors.bad_schema_version' : 'view.broken'));
      return;
    }
    const types = blockTypes(page);
    const blockedHosts = [hostOf(config.javaURI), hostOf(config.pythonURI)].filter(Boolean);
    const hooks = createRichHooks({ richText, baseurl, pageOrigin, doc });
    const renderCtx = { registry, mode: 'view', baseurl, pageOrigin, renderers: contentRenderers, blockedHosts };
    const article = toDOM(renderPage(page, renderCtx), { doc, renderRich: hooks.renderRich });
    root.replaceChildren(draw(barOf(opened)), article);
    const settings = isObject(page.page) ? page.page : {};
    const title = typeof settings.title === 'string' && settings.title.trim() ? settings.title.trim() : say('blocks.untitled');
    doc.title = say('view.document_title', { title });
    const current = { live: { destroy() {} }, embeds: wireEmbeds(article, renderCtx) };
    session = current;
    const viewer = await viewerOf(opened, types);
    if (mine !== generation) return;
    const live = createLiveMounts(article, page, {
      registry, baseurl, pageOrigin, pageProtocol: location.protocol, slug: opened.slug, pageKey: opened.pageKey, doc,
      fetchImpl: deps.fetchImpl, storage: deps.sessionStorage, now: deps.now, loadModule: deps.loadModule,
      navigate: typeof deps.navigate === 'function' ? deps.navigate : (url) => location.assign(url),
      services: { config, richText, messagesModel, modules, store, view: opened.view, viewer },
    });
    current.live = live;
    await live.ready;
  }

  async function load() {
    generation += 1;
    const mine = generation;
    teardown();
    if (request.mode === 'none') {
      notice(say('view.no_page'), { action: springEnabled ? link(say('view.open_gallery'), `${baseurl}/ui-builder/gallery/`) : builderLink() });
      return;
    }
    // A Flask-only site has no published pages and never calls Spring.
    if (!springEnabled && request.mode !== 'local') {
      notice(say('view.spring_off'), { action: builderLink() });
      return;
    }
    if (request.slug === null || request.id === null) {
      showError({ name: 'NotFoundError' });
      return;
    }
    notice(say('view.loading'));
    let opened;
    try {
      opened = { mode: request.mode, ...(await open()) };
    } catch (error) {
      if (mine === generation) showError(error);
      return;
    }
    if (mine !== generation) return;
    try {
      await show(opened, mine);
    } catch (error) {
      console.error('UI Builder viewer: the page could not be shown', error);
      if (mine === generation) notice(say('view.broken'));
    }
  }

  // pagehide stops sockets and timers (and keeps the page eligible for the back/forward cache);
  // a page restored from that cache loads again.
  const onHide = () => {
    generation += 1;
    teardown();
  };
  const onShow = (event) => {
    if (event && event.persisted) load();
  };
  win.addEventListener('pagehide', onHide);
  win.addEventListener('pageshow', onShow);
  return {
    ready: load(),
    destroy() {
      onHide();
      win.removeEventListener('pagehide', onHide);
      win.removeEventListener('pageshow', onShow);
    },
  };
}
