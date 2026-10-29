// Pages and fakes for the runtime tests: a page builder with predictable ids, the viewer's
// rendering (render.js + toDOM into the fake DOM), and stand-ins for the other systems' modules
// (conversation-embed.js, kanban-board.js, calendar-card.js, microblog.js) that record calls.
// Courses' calendar-model.js is pure, so tests hand out the real one.
import { renderPage } from '../../../js/render.js';
import { contentRenderers } from '../../../js/blocks-content.js';
import { toDOM } from '../../../js/vnode.js';

export const ORIGIN = 'https://pages.opencodingsociety.com';

export function pageOf(blocksBySection, settings = {}) {
  let n = 0;
  const id = (kind) => `${kind}-${String(++n).padStart(6, '0')}`;
  return {
    schemaVersion: 1,
    kind: 'ocs-ui-page',
    page: { title: 'Flood Watch', description: 'We map floods.', byline: 'Binary Beasts', course: 'csp', width: 'contained', image: '', ...settings },
    sections: blocksBySection.map((blocks) => ({
      id: id('s'), type: 'stack', settings: {}, hidden: false,
      cells: [{ blocks: blocks.map(([type, blockSettings = {}, extra = {}]) => ({ id: id('b'), type, settings: blockSettings, hidden: false, ...extra })) }],
    })),
  };
}

export const blocksOf = (page) => page.sections.flatMap((section) => section.cells.flatMap((cell) => cell.blocks));

// The text a rich field shows, without rich-text.js: enough for runtime tests.
export const renderRich = (container, raw) => container.appendChild(container.ownerDocument.createTextNode(raw));

// The page as the viewer draws it, inside a root element in the fake document.
export function drawPage(doc, page, registry, extra = {}) {
  const root = doc.createElement('div');
  doc.body.appendChild(root);
  const ctx = { registry, mode: 'view', baseurl: '', pageOrigin: ORIGIN, renderers: contentRenderers, ...extra };
  root.appendChild(toDOM(renderPage(page, ctx), { doc, renderRich }));
  return root;
}

export const cardOf = (root, blockId) => root.querySelector(`[data-ui-node="${blockId}"] [data-ui-live]`);
export const statusOf = (root, blockId) => root.querySelector(`[data-ui-node="${blockId}"] [data-ui-live-status]`);
export const mountOf = (root, blockId) => root.querySelector(`[data-ui-node="${blockId}"] [data-ui-live-mount]`);

// Messages' conversation-embed.js: records each mount and puts a marker in its root.
export function fakeConversationEmbed() {
  const mounts = [];
  return {
    mounts,
    async mountGroupChat(root, options) {
      const record = { root, options, destroyed: false };
      mounts.push(record);
      const marker = root.ownerDocument.createElement('div');
      marker.setAttribute('class', 'dm dm--embed');
      root.replaceChildren(marker);
      return { state: 'ready', destroy() { record.destroyed = true; root.replaceChildren(); } };
    },
  };
}

// kanban-board.js: parseBoardUrl like the real one for the two board shapes, sections that record mounts.
export function fakeKanban() {
  const boards = [];
  return {
    boards,
    parseBoardUrl(address) {
      return /^https:\/\/github\.com\/(?:orgs\/[\w-]+\/projects\/\d+|[\w-]+\/[\w.-]+\/issues)$/.test(address) ? { url: address } : null;
    },
    createKanbanSection(options, doc) {
      const section = doc.createElement('section');
      section.setAttribute('data-ocs-kanban', '');
      section.setAttribute('data-mounted', 'manual');
      boards.push({ options, section, refreshed: 0, unmounted: false });
      return section;
    },
    mountKanbanBoard(section) {
      const board = boards.find((entry) => entry.section === section);
      return { refresh() { board.refreshed += 1; return Promise.resolve(); }, unmount() { board.unmounted = true; } };
    },
  };
}

// calendar-card.js: records the course, title and springEnabled each card got.
export function fakeCalendarCard() {
  const cards = [];
  return {
    cards,
    createCalendarCardSection(options, doc) {
      const section = doc.createElement('section');
      section.setAttribute('data-ocs-calendar', '');
      cards.push({ options, section, mountOptions: null, unmounted: false });
      return section;
    },
    mountCalendarCard(section, options) {
      const card = cards.find((entry) => entry.section === section);
      card.mountOptions = options;
      return { refresh() {}, unmount() { card.unmounted = true; } };
    },
  };
}

// microblog.js: createPost records the post, or throws the error it is told to.
export function fakeMicroblog() {
  const posts = [];
  return {
    posts,
    error: null,
    async createPost(post) {
      if (this.error) throw this.error;
      posts.push(post);
      return { id: posts.length, ...post };
    },
  };
}

// A loadModule that hands out the fakes by the URL the page would pass.
export const MODULE_URLS = Object.freeze({
  conversationEmbed: '/assets/js/projects/messages/conversation-embed.js',
  kanban: '/assets/js/kanban-board.js',
  calendarCard: '/assets/js/chat/calendar/calendar-card.js',
  calendarModel: '/assets/js/chat/calendar/calendar-model.js',
  microblog: '/assets/js/api/microblog.js',
});

export function moduleLoader(fakes) {
  const loaded = [];
  const byUrl = Object.fromEntries(Object.entries(MODULE_URLS).map(([name, url]) => [url, name]));
  return {
    loaded,
    loadModule: async (url) => {
      const name = byUrl[url];
      loaded.push(name);
      if (!name || !fakes[name]) throw new Error(`no fake for ${url}`);
      return fakes[name];
    },
  };
}

// A fetch that answers by URL: routes map a URL prefix to a Response or a function returning one.
export function fetchRouter(routes) {
  const calls = [];
  const fetchImpl = async (url, init = {}) => {
    calls.push({ url, init });
    const prefix = Object.keys(routes).find((candidate) => url.startsWith(candidate));
    if (!prefix) throw new TypeError(`Failed to fetch ${url}`);
    const answer = routes[prefix];
    return typeof answer === 'function' ? answer(url, init) : answer.clone();
  };
  return { calls, fetchImpl };
}

export const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
