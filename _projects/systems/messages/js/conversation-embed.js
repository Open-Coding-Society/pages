// One conversation shown inside another page: a group's chat or a direct message, such
// as the group chat on a UI Builder page. It builds the part of /dm's thread pane that
// thread.js needs, with /dm's classes so the same skin applies, and .dm--embed
// (sass/_layout.scss) fits it into the host's column. Each embed has its own pane and
// its own socket, so two on one page share nothing. The host imports config.js and
// rich-text.js with {{ site.baseurl }} and hands them in, as /dm does.
//
//   const chat = await mountGroupChat(element, { groupId, config, richText });
//   chat.destroy(); // before the element goes
import { createChatSocket } from './chat-socket.js';
import { LOG_TEXTS, withTexts } from './message-log.js';
import { createMessagesApi } from './messages-api.js';
import { EMPTY_STATES, THREAD_TEXTS, createThread } from './thread.js';

// What an embed says beyond the log's and the pane's wording, and where /dm's wording
// doesn't fit a chat inside another page. The pane's idle state ("Pick a conversation")
// never shows: an embed opens its conversation before the pane reaches the page.
const EMBED_TEXTS = Object.freeze({
  loadFailedHint: 'Check your connection, then reload the page.',
  cancel: 'Cancel',
  signIn: 'Sign in to see this chat.',
  unavailable: 'This chat isn’t available right now.',
  offline: 'Live updates are off. Reload the page to see new messages.',
});

const MOUNTERS = Object.freeze({ group: 'mountGroupChat', dm: 'mountConversation' });
const ID_OPTIONS = Object.freeze({ group: 'groupId', dm: 'conversationId' });

const mountedRoots = new WeakSet(); // an element holds one embed at a time
let embedCount = 0; // numbers each embed's heading id

// The wording an embed uses: the host's `texts` over the English defaults. emptyTitle and
// emptyHint are what an open conversation with no messages says, which differs for a DM.
export function embedTexts(kind, texts = {}) {
  if (!Object.hasOwn(EMPTY_STATES, kind)) {
    throw new TypeError(`embedTexts: kind must be 'group' or 'dm', not ${describe(kind)}`);
  }
  const empty = EMPTY_STATES[kind];
  return withTexts({
    ...LOG_TEXTS, ...THREAD_TEXTS, ...EMBED_TEXTS, emptyTitle: empty.title, emptyHint: empty.hint,
  }, texts);
}

// Spring ids are positive whole numbers. A DM frame's conversationId is compared with ===,
// so an id a page passes as "12" is read as 12.
export function readId(value) {
  const id = typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : value;
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

// Why GET /api/person/get failed. Spring answers 401 when nobody is signed in (403 for an
// account without a role), and /api/person/get answers 404 when a sign-in has no person
// behind it. Anything else, or no answer at all, means chat can't be reached right now.
export function personErrorState(error) {
  return [401, 403, 404].includes(error?.status) ? 'signed-out' : 'unavailable';
}

// The sign-in page under the site's baseurl (config.js exports it).
export function signInHref(baseurl = '') {
  return `${String(baseurl ?? '').replace(/\/+$/, '')}/login`;
}

// A group's chat. readOnly shows it without the composer, and without edit or delete on
// your own messages. formatBody(body, message) changes what each message shows; its
// result is still sanitized.
export async function mountGroupChat(root, {
  groupId, config, richText, readOnly = false, heading = '', texts = {}, formatBody = null,
} = {}) {
  return mount('group', root, { id: groupId, config, richText, readOnly, heading, texts, formatBody });
}

// A direct message. Opening it marks it read, as /dm does, which updates the navbar bell.
export async function mountConversation(root, {
  conversationId, config, richText, heading = '', texts = {},
} = {}) {
  return mount('dm', root, { id: conversationId, config, richText, readOnly: false, heading, texts, formatBody: null });
}

function describe(value) {
  return typeof value === 'string' ? JSON.stringify(value) : String(value);
}

// A wrong call fails here, saying what is wrong, rather than as a chat that half works.
function checkOptions(kind, root, { id, config, richText, readOnly, heading, texts, formatBody }) {
  const name = MOUNTERS[kind];
  if (typeof root?.replaceChildren !== 'function') throw new TypeError(`${name}: root must be an element`);
  if (readId(id) === null) {
    throw new TypeError(`${name}: ${ID_OPTIONS[kind]} must be a positive whole number, not ${describe(id)}`);
  }
  if (typeof config?.javaURI !== 'string' || typeof config.javaWebSocketURI !== 'string'
    || typeof config.fetchOptions !== 'object' || config.fetchOptions === null) {
    throw new TypeError(`${name}: config needs javaURI, javaWebSocketURI and fetchOptions from assets/js/api/config.js`);
  }
  if (typeof readOnly !== 'boolean') throw new TypeError(`${name}: readOnly must be true or false`);
  if (typeof richText?.renderRichMessage !== 'function'
    || (!readOnly && typeof richText.createRichComposer !== 'function')) {
    throw new TypeError(`${name}: richText must be assets/js/chat/rich-text.js`);
  }
  if (typeof heading !== 'string') throw new TypeError(`${name}: heading must be a string`);
  if (texts === null || typeof texts !== 'object' || Array.isArray(texts)) {
    throw new TypeError(`${name}: texts must be an object of strings`);
  }
  if (formatBody !== null && typeof formatBody !== 'function') {
    throw new TypeError(`${name}: formatBody must be a function or null`);
  }
}

function make(tag, className = '') {
  const element = document.createElement(tag);
  if (className) element.className = className;
  return element;
}

function notice(message) {
  const line = make('p', 'dm__notice');
  line.setAttribute('role', 'status');
  line.textContent = message;
  return line;
}

function signInNote(label, href) {
  const line = make('p', 'dm__notice');
  const link = make('a');
  link.href = href;
  link.textContent = label;
  line.appendChild(link);
  return line;
}

// The part of /dm's thread pane (navigation/dm.md) that thread.js uses, with its classes.
// No ids except the heading's, which is numbered, because a page can hold several embeds.
function buildPane(t, { heading, readOnly }) {
  const section = make('section', 'dm__thread');
  const head = make('header', 'dm__thread-head');
  const headingBox = make('div', 'dm__thread-heading');
  const title = make('h3', 'dm__thread-title');
  const subtitle = make('small', 'dm__thread-subtitle');
  headingBox.append(title, subtitle);
  head.appendChild(headingBox);
  if (heading) {
    embedCount += 1;
    title.id = `dm-embed-${embedCount}-title`;
    section.setAttribute('aria-labelledby', title.id);
  } else {
    // The host shows the title, as a UI Builder card does in its header.
    head.hidden = true;
  }
  const status = notice(''); // says when live updates stop
  const messages = make('div', 'dm__log');
  messages.setAttribute('role', 'log');
  messages.setAttribute('aria-live', 'polite');
  messages.setAttribute('tabindex', '0');
  const formStatus = make('p', 'dm__form-status');
  formStatus.setAttribute('role', 'alert');
  formStatus.hidden = true;
  section.append(head, status, messages);

  const elements = { title, subtitle, messages, formStatus };
  if (!readOnly) {
    // thread.js puts the composer in front of Cancel, as on /dm.
    const form = make('form', 'dm__composer');
    form.setAttribute('autocomplete', 'off');
    const cancelEdit = make('button', 'dm__action dm-cancel-edit');
    cancelEdit.type = 'button';
    cancelEdit.hidden = true;
    cancelEdit.textContent = t.cancel;
    const send = make('button', 'dm__send');
    send.type = 'submit';
    send.disabled = true;
    send.textContent = t.send;
    form.append(cancelEdit, send);
    section.appendChild(form);
    Object.assign(elements, { form, cancelEdit, send });
  }
  section.appendChild(formStatus);
  return { section, status, elements };
}

// The signed-in person, or why there is none: 'signed-out' or 'unavailable'.
async function whoIsSignedIn(api) {
  try {
    const person = await api.currentPerson();
    return person?.uid ? { me: person } : { state: 'signed-out' };
  } catch (error) {
    const state = personErrorState(error);
    if (state === 'unavailable') console.warn('Messages: the chat embed could not reach Spring', error);
    return { state };
  }
}

async function mount(kind, root, options) {
  checkOptions(kind, root, options);
  const { config, richText, readOnly, heading, formatBody } = options;
  const id = readId(options.id);
  const t = embedTexts(kind, options.texts);
  // A second embed in the same element would leave the first one's socket open.
  if (mountedRoots.has(root)) {
    throw new Error(`${MOUNTERS[kind]}: this element already holds a chat; destroy() it first`);
  }
  mountedRoots.add(root);

  let thread = null;
  let socket = null;
  let destroyed = false;
  function destroy() {
    if (destroyed) return;
    destroyed = true;
    thread?.destroy();
    socket?.disconnect();
    root.replaceChildren();
    mountedRoots.delete(root);
  }
  const mounted = state => ({ state, destroy });

  const frame = make('div', 'dm dm--embed');
  try {
    // A Flask-only site (spring: false in _config.yml) never calls Spring.
    if (config.springEnabled === false) {
      frame.appendChild(notice(t.unavailable));
      root.replaceChildren(frame);
      return mounted('unavailable');
    }
    frame.appendChild(notice(t.loading));
    root.replaceChildren(frame);

    const api = createMessagesApi(config);
    const { me, state } = await whoIsSignedIn(api);
    if (!me) {
      frame.replaceChildren(state === 'signed-out' ? signInNote(t.signIn, signInHref(config.baseurl)) : notice(t.unavailable));
      return mounted(state);
    }

    const pane = buildPane(t, { heading, readOnly });
    const showOffline = () => {
      pane.status.textContent = t.offline;
    };
    socket = createChatSocket(config.javaWebSocketURI, { onClose: showOffline });
    thread = createThread({
      api, socket, richText, me, readOnly, formatBody,
      elements: pane.elements,
      texts: t,
      emptyState: { title: t.emptyTitle, hint: t.emptyHint },
    });
    thread.open(kind, id, { title: heading, subtitle: '' });
    frame.replaceChildren(pane.section);
    // As on /dm, the history loads over REST while the socket connects; resume() then
    // follows the topic and fetches anything posted in between.
    socket.connect()
      .then(connected => {
        if (destroyed) return;
        if (connected) thread.resume();
        else showOffline();
      })
      .catch(error => {
        console.warn('Messages: the chat embed could not connect', error);
        if (!destroyed) showOffline();
      });
    return mounted('ready');
  } catch (error) {
    destroy();
    throw error;
  }
}
