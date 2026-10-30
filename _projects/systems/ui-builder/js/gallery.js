// The gallery at /ui-builder/gallery/ (DESIGN §11): every published page as an ocs__nav-card,
// with a course filter (asked of Spring, which also decides what a signed-out visitor may see:
// pages approved for everyone) and a search over titles, descriptions and bylines (in the
// browser). ?course= and &q= keep both in the address. A Flask-only site has no published pages,
// so it shows a notice and makes no Spring request.
//
//   startGallery(root, {registry, config, store}) → {ready, destroy()}
import { textOf } from './registry.js';
import { foldText, safeImage, slugMatches } from './url-rules.js';
import { browserOffline, element } from './blocks-project.js';
import { storeErrorText } from './page-store.js';
import { h, toDOM } from './vnode.js';

const QUERY_MAX = 100;

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

// The filters an address asks for: a known course code (else all) and a search of at most 100 characters.
export function galleryRequest(search, registry) {
  const params = new URLSearchParams(search);
  const course = params.get('course') || '';
  const known = (registry.courses || []).some((option) => option && option.value === course);
  return { course: known ? course : '', q: (params.get('q') || '').trim().slice(0, QUERY_MAX) };
}

// Pages whose title, description, byline or course name holds every word of the search.
export function filterGallery(items, query, registry) {
  const words = foldText(query).split(/\s+/).filter(Boolean);
  if (!words.length) return items;
  const labels = new Map((registry.courses || []).map((option) => [option.value, option.label]));
  return items.filter((item) => {
    const haystack = foldText([item.title, item.description, item.byline, labels.get(item.course) || item.course].join(' '));
    return words.every((word) => haystack.includes(word));
  });
}

export function startGallery(root, deps = {}) {
  const { registry, config = {}, store } = deps;
  if (!root || typeof root.replaceChildren !== 'function') throw new TypeError('UI Builder startGallery: root must be an element');
  if (!isObject(registry) || !isObject(registry.text)) throw new TypeError('UI Builder startGallery: registry is required (registry.js readRegistry)');
  const doc = deps.doc || root.ownerDocument;
  const win = deps.win || doc.defaultView || globalThis.window;
  const location = deps.location || win.location;
  const history = deps.history || win.history;
  const say = (key, vars) => textOf(registry, key, vars);
  const baseurl = String(config.baseurl || '').replace(/\/+$/, '');
  const pageOrigin = location.origin;
  const cookieDomain = isObject(registry.security) && typeof registry.security.cookie_domain === 'string' ? registry.security.cookie_domain : '';
  const draw = (vnode) => toDOM(vnode, { doc });
  const courseLabel = (code) => ((registry.courses || []).find((option) => option && option.value === code) || {}).label || '';
  const state = { ...galleryRequest(location.search, registry), items: null, failed: false, error: null };

  // Why the pages didn't load, worded like the viewer: "Check your connection" only when this
  // browser knows it is offline; otherwise OCS didn't answer, or answered why (storeErrorText).
  function loadProblem(error) {
    if (error && error.name === 'OfflineError') return say(browserOffline() ? 'gallery.load_failed' : 'gallery.no_answer');
    const { key, vars } = storeErrorText(error);
    return say(key, vars);
  }
  const loaded = new Map(); // course → its pages, so switching back costs no request
  let request = 0;
  let destroyed = false;
  const cleanups = [];

  const makePage = () => h('a', { class: 'ocs__btn accent fill', href: `${baseurl}/ui-builder/` }, say('gallery.make_page'));
  const head = draw(h('header', { class: 'ocs__stack' },
    h('h1', null, say('gallery.title')),
    h('p', { class: 'ocs__text ocs__lead' }, say('gallery.lead')),
    h('div', { class: 'ocs__links' }, makePage())));
  const page = element(doc, 'div', { className: 'ocs__container ocs__stack' });
  page.appendChild(head);

  // A Flask-only site keeps pages in the browser; there is nothing to list.
  if (config.springEnabled === false || !store || !store.capabilities || !store.capabilities.gallery || typeof store.gallery !== 'function') {
    page.appendChild(draw(h('div', { class: 'ocs__callout', role: 'status' }, say('gallery.spring_off'))));
    root.replaceChildren(page);
    return { ready: Promise.resolve(), destroy() {} };
  }

  // The filters: OCS fields side by side in an ocs__split, which also keeps the search box
  // inside a phone's width (an input's size alone renders far wider in Safari).
  const filters = element(doc, 'div', { className: 'ocs__split' });
  const searchField = element(doc, 'div', { className: 'ocs__field' });
  searchField.append(
    element(doc, 'label', { className: 'ocs__label', text: say('gallery.search_label'), attrs: { for: 'ui-gallery-search' } }),
    element(doc, 'input', { className: 'ocs__input', attrs: { id: 'ui-gallery-search', type: 'search', placeholder: say('gallery.search_placeholder'), maxlength: String(QUERY_MAX), autocomplete: 'off' } }),
  );
  const courseField = element(doc, 'div', { className: 'ocs__field' });
  const select = element(doc, 'select', { className: 'ocs__input', attrs: { id: 'ui-gallery-course' } });
  for (const option of [{ value: '', label: say('gallery.course_all') }, ...(registry.courses || [])]) {
    const node = element(doc, 'option', { text: option.label, attrs: { value: option.value } });
    if (option.value === state.course) node.setAttribute('selected', '');
    select.appendChild(node);
  }
  courseField.append(element(doc, 'label', { className: 'ocs__label', text: say('gallery.course_label'), attrs: { for: 'ui-gallery-course' } }), select);
  filters.append(searchField, courseField);
  const search = searchField.querySelector('input');
  search.value = state.q;
  const signedOut = element(doc, 'div'); // a plain wrapper, so hidden works on it
  signedOut.hidden = true;
  const count = element(doc, 'p', { className: 'ocs__text', attrs: { role: 'status', 'aria-live': 'polite' } });
  const results = element(doc, 'div');
  page.append(filters, signedOut, count, results);
  root.replaceChildren(page);

  function syncAddress() {
    const params = new URLSearchParams();
    if (state.course) params.set('course', state.course);
    if (state.q) params.set('q', state.q);
    const query = params.toString();
    try {
      history.replaceState(history.state, '', `${location.pathname}${query ? `?${query}` : ''}${location.hash || ''}`);
    } catch (_) {
      // Some embedded browsers refuse replaceState; the filters still work, only the address lags.
    }
  }

  function card(item) {
    const picture = safeImage(item.image, { baseurl, pageOrigin, cookieDomain });
    const image = picture ? h('img', {
      class: 'ocs__image-frame ocs__image-frame--cover', src: picture.src, alt: '', loading: 'lazy',
      referrerpolicy: /^https:/i.test(picture.src) ? 'no-referrer' : undefined, crossorigin: picture.ocsHost ? 'anonymous' : undefined,
    }) : null;
    const kicker = courseLabel(item.course);
    // Encoded, so the link stays one address whatever the registry's slug pattern lets through.
    return h('a', { class: 'ocs__nav-card', href: `${baseurl}/ui-builder/view/?page=${encodeURIComponent(item.slug)}` },
      image,
      kicker ? h('span', { class: 'ocs__nav-card-kicker' }, kicker) : null,
      h('span', { class: 'ocs__nav-card-title' }, item.title || say('blocks.untitled')),
      item.description ? h('span', { class: 'ocs__text' }, item.description) : null,
      item.byline ? h('span', { class: 'ocs__text' }, say('gallery.by', { byline: item.byline })) : null,
      item.visibility === 'SIGNED_IN' ? h('strong', { class: 'ocs__status' }, say('gallery.members_only')) : null);
  }

  function render() {
    if (state.failed) {
      count.textContent = '';
      const retry = draw(h('div', { class: 'ocs__stack' },
        h('div', { class: 'ocs__callout' }, loadProblem(state.error)),
        h('div', { class: 'ocs__links' }, h('button', { type: 'button', class: 'ocs__btn' }, say('gallery.retry')))));
      retry.querySelector('button').addEventListener('click', () => { load(); });
      results.replaceChildren(retry);
      return;
    }
    if (state.items === null) {
      count.textContent = say('gallery.loading');
      results.replaceChildren();
      return;
    }
    const shown = filterGallery(state.items, state.q, registry).filter((item) => slugMatches(item.slug, registry));
    if (!shown.length) {
      count.textContent = say(state.items.length ? 'gallery.empty_filtered' : 'gallery.empty');
      results.replaceChildren();
      return;
    }
    count.textContent = shown.length === 1 ? say('gallery.count_one') : say('gallery.count', { count: shown.length });
    results.replaceChildren(draw(h('nav', { class: 'ocs__nav-grid', 'aria-label': say('gallery.results_label') }, shown.map(card))));
  }

  async function load() {
    request += 1;
    const mine = request;
    const course = state.course;
    state.failed = false;
    state.error = null;
    state.items = loaded.has(course) ? loaded.get(course) : null;
    render();
    if (state.items !== null) return;
    try {
      const items = await store.gallery({ course });
      if (destroyed || mine !== request) return;
      loaded.set(course, items);
      state.items = items;
    } catch (error) {
      if (destroyed || mine !== request) return;
      if (!error || error.name !== 'OfflineError') console.error('UI Builder gallery: the pages could not load', error);
      state.failed = true;
      state.error = error;
    }
    render();
  }

  // Signed-out visitors see only pages approved for everyone; say so, with a way to sign in.
  async function noteSignedOut() {
    if (typeof store.whoami !== 'function') return;
    let person = null;
    try {
      person = await store.whoami();
    } catch (_) {
      return; // unknown: no note rather than a wrong one
    }
    if (destroyed || person) return;
    const line = element(doc, 'p', { className: 'ocs__text', text: `${say('gallery.signed_out')} ` });
    line.appendChild(element(doc, 'a', { text: say('blocks.live_sign_in_link'), attrs: { href: `${baseurl}/login` } }));
    signedOut.replaceChildren(line);
    signedOut.hidden = false;
  }

  const onSearch = () => {
    state.q = search.value.trim().slice(0, QUERY_MAX);
    syncAddress();
    render();
  };
  const onCourse = () => {
    state.course = galleryRequest(`?course=${encodeURIComponent(select.value)}`, registry).course;
    syncAddress();
    load();
  };
  search.addEventListener('input', onSearch);
  select.addEventListener('change', onCourse);
  cleanups.push(() => search.removeEventListener('input', onSearch), () => select.removeEventListener('change', onCourse));

  return {
    ready: Promise.all([load(), noteSignedOut()]).then(() => undefined),
    destroy() {
      destroyed = true;
      cleanups.splice(0).forEach((cleanup) => cleanup());
    },
  };
}
