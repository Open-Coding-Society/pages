// "Data from your API" (DESIGN §7.1, D9): read a student's JSON API safely and map its items to
// cards, lists, tables or numbers. fetchJson never sends cookies or a referrer, refuses
// redirects, times out and caps the reply; doctor explains each failure with the exact fix.
// Pure apart from the injected fetch.
import { apiUrlPolicy, hostOf, safeImage, safeLink } from './url-rules.js';

export const SLOTS = Object.freeze(['title', 'text', 'image', 'link', 'value', 'label']);
// list_path for "The whole reply". "" is a list not picked yet, which listIn guesses.
export const WHOLE_REPLY = '.';
const PATH = /^[A-Za-z0-9_.[\]-]{0,120}$/;
const KEY = /^[A-Za-z0-9_-]{1,60}$/; // a key the path syntax can address
const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
const PRIVATE = /^(uid|useruid|user_uid|email|sid|password|passwd|token|jwt|secret|grade.*|ap_exam|phone|address|birth.*|dob)$/i;
const POLICY_TEXT = new Set(['policy_https', 'policy_loopback_form', 'policy_loopback_view', 'policy_private_host']);
const FIELD_SAMPLE = 20;
const MAX_FIELDS = 100;
const SEARCH_NODES = 500;
const BACKSLASH = String.fromCharCode(92);

const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
const typeOf = (value) => (value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value);

// "data.items[0].name" → ['data', 'items', '0', 'name']; null when the path breaks the rule.
export function pathTokens(path) {
  if (typeof path !== 'string' || !PATH.test(path)) return null;
  return path.replace(/\[([^\]]*)\]/g, '.$1').split('.').filter(Boolean);
}

// Reads parsed JSON by path: own properties and array indexes only, so a reply can never reach
// __proto__ or constructor. "" and "." are the value itself.
export function getPath(value, path) {
  const tokens = pathTokens(path);
  if (!tokens) return undefined;
  let node = value;
  for (const token of tokens) {
    if (UNSAFE_KEYS.has(token)) return undefined;
    if (Array.isArray(node)) {
      if (!/^\d{1,9}$/.test(token) || Number(token) >= node.length) return undefined;
      node = node[Number(token)];
    } else if (isPlainObject(node) && hasOwn(node, token)) {
      node = node[token];
    } else {
      return undefined;
    }
  }
  return node;
}

const lastToken = (path) => {
  const tokens = pathTokens(path);
  return tokens && tokens.length ? tokens[tokens.length - 1] : '';
};

// Where the items are: '' when the reply is a list, the shallowest list of objects inside it
// ("data.items"; the longest one wins a tie), or null when the reply holds no list.
export function findListPath(json) {
  if (Array.isArray(json)) return '';
  if (!isPlainObject(json)) return null;
  let best = null;
  const queue = [{ value: json, path: '', depth: 0 }];
  for (let visited = 0; queue.length && visited < SEARCH_NODES; visited += 1) {
    const { value, path, depth } = queue.shift();
    for (const key of Object.keys(value)) {
      const childPath = path ? `${path}.${key}` : key;
      if (!KEY.test(key) || UNSAFE_KEYS.has(key) || childPath.length > 120) continue;
      const child = value[key];
      if (Array.isArray(child)) {
        const score = [child.slice(0, FIELD_SAMPLE).some(isPlainObject) ? 1 : 0, -depth, child.length];
        if (!best || score[0] > best.score[0] || (score[0] === best.score[0] && (score[1] > best.score[1]
          || (score[1] === best.score[1] && score[2] > best.score[2])))) best = { path: childPath, score };
      } else if (isPlainObject(child) && depth < 3) {
        queue.push({ value: child, path: childPath, depth: depth + 1 });
      }
    }
  }
  return best ? best.path : null;
}

// The list a block with no list picked yet ("") shows: '' when the reply is a list, else the list
// of objects findListPath finds, else null. A list inside the reply that is empty or holds plain
// values is never guessed, so {"joke": …, "comments": []} stays one joke, as published pages have
// shown it. Show code writes this rule out, findListPath's limits included (SNIPPET_FIND), so a
// change here is a change there too.
export function guessListPath(json) {
  const found = findListPath(json);
  if (found === null) return null;
  const list = getPath(json, found);
  return found === '' || (Array.isArray(list) && list.slice(0, FIELD_SAMPLE).some(isPlainObject)) ? found : null;
}

// The items in a reply, by the one rule the editor, its preview and the published page share: the
// list at list_path (WHOLE_REPLY reads the reply itself); with no list_path picked yet, the list
// guessListPath finds; else one object is a list of one ({"joke": …}), and anything else has no items.
export function listIn(json, listPath) {
  const path = typeof listPath === 'string' ? listPath : '';
  const mapped = getPath(json, path);
  if (Array.isArray(mapped)) return mapped;
  const found = path ? null : guessListPath(json);
  const guess = found === null ? undefined : getPath(json, found);
  if (Array.isArray(guess)) return guess;
  return isPlainObject(mapped) ? [mapped] : [];
}

// The fields of the first items as [{path, type}] (type first seen that isn't null). Nested
// objects add one level ("author.name"); lists of plain values have the one field ".".
export function fieldsOf(items) {
  const fields = new Map();
  const note = (path, value) => {
    if (!fields.has(path)) {
      if (fields.size < MAX_FIELDS) fields.set(path, typeOf(value));
    } else if (fields.get(path) === 'null' && value !== null) {
      fields.set(path, typeOf(value));
    }
  };
  for (const item of (Array.isArray(items) ? items : []).slice(0, FIELD_SAMPLE)) {
    if (!isPlainObject(item)) {
      if (item !== null && typeof item !== 'object') note('.', item);
      continue;
    }
    for (const key of Object.keys(item)) {
      if (!KEY.test(key) || UNSAFE_KEYS.has(key)) continue;
      note(key, item[key]);
      if (!isPlainObject(item[key])) continue;
      for (const sub of Object.keys(item[key])) {
        if (KEY.test(sub) && !UNSAFE_KEYS.has(sub)) note(`${key}.${sub}`, item[key][sub]);
      }
    }
  }
  return [...fields].map(([path, type]) => ({ path, type }));
}

export function isPrivateField(path) {
  return PRIVATE.test(lastToken(path));
}

// Fields no page may show (ids, emails, passwords, grades…): paths from strings or {path}.
export function privateKeys(fields) {
  return (Array.isArray(fields) ? fields : [])
    .map((field) => (typeof field === 'string' ? field : field && field.path))
    .filter((path) => typeof path === 'string' && isPrivateField(path));
}

const GUESS = {
  title: /^(title|name|joke|heading|headline|question|subject|username|display_?name|full_?name)$/i,
  text: /^(text|description|desc|body|content|summary|details|bio|answer|message|comment|excerpt|about)$/i,
  image: /^(image|image_?url|img|picture|photo|photo_?url|avatar|avatar_?url|thumbnail|thumb|icon|logo|cover)$/i,
  link: /^(url|link|href|website|homepage|html_?url|permalink|web_?url)$/i,
  value: /^(value|count|total|score|amount|number|votes|likes|points|haha|views|quantity|price)$/i,
  label: /^(label|category|type|kind|tag|unit)$/i, // the title is the fallback
};
const ID_LIKE = /^(?:id|uuid|.*_id|.*Id)$/;

// A first guess for every slot from field names and types; private fields are never picked.
export function guessMapping(fields) {
  const list = (Array.isArray(fields) ? fields : [])
    .map((field) => (typeof field === 'string' ? { path: field, type: 'string' } : field))
    .filter((field) => isPlainObject(field) && typeof field.path === 'string' && pathTokens(field.path) && !isPrivateField(field.path));
  const scalar = (field) => ['string', 'number', 'boolean'].includes(field.type);
  const isString = (field) => field.type === 'string';
  const pick = (pattern, accept, taken = []) => {
    const found = list.find((field) => pattern.test(lastToken(field.path)) && accept(field) && !taken.includes(field.path));
    return found ? found.path : '';
  };
  const firstOf = (accept) => (list.find(accept) || {}).path || '';
  const title = pick(GUESS.title, scalar) || firstOf(isString);
  const text = pick(GUESS.text, isString, [title]);
  const image = pick(GUESS.image, isString);
  const link = pick(GUESS.link, isString, [image]);
  const value = pick(GUESS.value, scalar, [title]) || firstOf((field) => field.type === 'number' && !ID_LIKE.test(lastToken(field.path)));
  const label = pick(GUESS.label, scalar, [value]) || title;
  return { title_path: title, text_path: text, image_path: image, link_path: link, value_path: value, label_path: label };
}

function scalarText(value) {
  if (typeof value === 'string') return value.trim();
  return (typeof value === 'number' && Number.isFinite(value)) || typeof value === 'boolean' ? String(value) : '';
}

// Cut to max UTF-16 units without leaving half of a surrogate pair at the end.
function capText(text, max) {
  if (text.length <= max) return text;
  const code = text.charCodeAt(max - 1);
  return text.slice(0, code >= 0xd800 && code <= 0xdbff ? max - 1 : max);
}

// "/static/x.png" from an API means that API's host, not this site.
function resolved(value, sourceUrl) {
  if (!value || !sourceUrl || !/^\/(?![/\\])/.test(value)) return value;
  try {
    return new URL(value, sourceUrl).href;
  } catch (_) {
    return ''; // no usable base: drop the relative address rather than guess
  }
}

// Addresses are refused, not cut: a shortened address could point somewhere else.
const urlValue = (value, max, check) => (value && value.length <= max && check(value) ? value : '');

// API items → [{title, text, image, link, value, label}]: strings only, trimmed and capped.
// Images and links that safeImage/safeLink refuse become "", and a slot mapped to a private field
// stays empty even when a page asks for it.
export function mapItems(items, mapping, { limit, itemChars, baseurl = '', pageOrigin, cookieDomain = '', sourceUrl = '' } = {}) {
  if (!Number.isInteger(limit) || limit < 0) throw new TypeError('UI Builder api-data: mapItems needs a whole-number limit');
  if (!Number.isInteger(itemChars) || itemChars < 1) throw new TypeError('UI Builder api-data: mapItems needs itemChars');
  const paths = {};
  for (const slot of SLOTS) {
    const path = isPlainObject(mapping) && hasOwn(mapping, `${slot}_path`) ? mapping[`${slot}_path`] : '';
    paths[slot] = typeof path === 'string' && path && pathTokens(path) && !isPrivateField(path) ? path : '';
  }
  const links = { baseurl, pageOrigin, cookieDomain };
  return (Array.isArray(items) ? items : []).slice(0, limit).map((item) => {
    const out = {};
    for (const slot of SLOTS) out[slot] = paths[slot] ? scalarText(getPath(item, paths[slot])) : '';
    for (const slot of ['title', 'text', 'value', 'label']) out[slot] = capText(out[slot], itemChars);
    out.image = urlValue(resolved(out.image, sourceUrl), itemChars, (value) => safeImage(value, links));
    out.link = urlValue(resolved(out.link, sourceUrl), itemChars, (value) => safeLink(value, links));
    return out;
  });
}

const header = (response, name) => (response && response.headers && typeof response.headers.get === 'function'
  ? response.headers.get(name) || '' : '');

function dropBody(response) {
  const body = response && response.body;
  // The reply is unwanted either way, so a failed cancel changes nothing for the caller.
  if (body && typeof body.cancel === 'function') body.cancel().catch(() => {});
}

// Reads at most maxBytes; null when the reply is bigger. Every read races `stop`, so a body that
// never ends can't outlive the timeout even when fetchImpl ignores the abort signal.
async function readCapped(response, maxBytes, stop) {
  const body = response.body;
  if (!body || typeof body.getReader !== 'function') {
    const text = await Promise.race([response.text(), stop]);
    return text.length > maxBytes ? null : text;
  }
  const reader = body.getReader();
  const chunks = [];
  let total = 0;
  for (;;) {
    let step;
    try {
      step = await Promise.race([reader.read(), stop]);
    } catch (error) {
      reader.cancel().catch(() => {}); // free the connection; the error below is the result
      throw error;
    }
    const { done, value } = step;
    if (done) break;
    if (!value || typeof value.byteLength !== 'number') throw new TypeError('UI Builder api-data: the reply stream sent something other than bytes');
    const bytes = ArrayBuffer.isView(value) ? new Uint8Array(value.buffer, value.byteOffset, value.byteLength) : new Uint8Array(value);
    total += bytes.byteLength;
    if (total > maxBytes) {
      reader.cancel().catch(() => {}); // stop the download; the result is "too big" either way
      return null;
    }
    chunks.push(bytes);
  }
  const all = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    all.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder('utf-8').decode(all);
}

async function probe(fetchImpl, url, signal, stop) {
  try {
    await Promise.race([fetchImpl(url, { mode: 'no-cors', credentials: 'omit', referrerPolicy: 'no-referrer', cache: 'no-store', signal }), stop]);
    return true;
  } catch (_) {
    return false; // nothing answered: the network error is the finding
  }
}

// One GET of a student's API → {ok, status, ms, json?, error?, reason?, contentType, url, host,
// loopback, timeoutMs, maxChars}. error is one of policy, mixed_content, timeout, network,
// blocked_read, auth, not_found, http, not_json, too_big, empty. mode/pageHost/pageProtocol feed
// apiUrlPolicy ('view' unless the editor says otherwise); maxChars caps the reply in bytes.
export async function fetchJson(url, {
  fetchImpl = (...args) => globalThis.fetch(...args), timeoutMs, maxChars, mode = 'view', pageHost = '',
  pageProtocol = 'https:', now = () => Date.now(),
} = {}) {
  if (typeof fetchImpl !== 'function') throw new TypeError('UI Builder api-data: fetchImpl must be a function');
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1) throw new TypeError('UI Builder api-data: timeoutMs must be a positive whole number');
  if (!Number.isInteger(maxChars) || maxChars < 1) throw new TypeError('UI Builder api-data: maxChars must be a positive whole number');
  const started = now();
  const policy = apiUrlPolicy(url, { pageHost, pageProtocol, mode });
  const base = {
    ok: false, status: 0, ms: 0, contentType: '', url: policy.url || '', host: policy.host || hostOf(url) || '',
    loopback: policy.loopback === true, timeoutMs, maxChars,
  };
  if (!policy.ok) return { ...base, error: policy.reason === 'mixed_content' ? 'mixed_content' : 'policy', reason: policy.reason };
  const controller = new AbortController();
  let timedOut = false;
  let timer = null;
  // Rejects at the timeout; raced by every await below. Its own handler keeps a rejection that
  // nobody awaits any more (the reply was already read) from being reported as unhandled.
  const stop = new Promise((resolve, reject) => {
    timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
      reject(Object.assign(new Error('UI Builder api-data: timed out'), { name: 'AbortError' }));
    }, timeoutMs);
  });
  stop.catch(() => {});
  const done = (fields) => ({ ...base, ms: Math.max(0, now() - started), ...fields });
  try {
    let response;
    try {
      response = await Promise.race([fetchImpl(policy.url, {
        method: 'GET', mode: 'cors', credentials: 'omit', referrerPolicy: 'no-referrer', redirect: 'error',
        cache: 'no-store', headers: { Accept: 'application/json' }, signal: controller.signal,
      }), stop]);
    } catch (error) {
      if (timedOut) return done({ error: 'timeout' });
      // CORS and network failures both reject with a TypeError. An opaque answer to a no-cors
      // probe means the server is up but didn't let this page read the reply.
      if (!error || error.name !== 'TypeError') return done({ error: 'network' });
      const reached = await probe(fetchImpl, policy.url, controller.signal, stop);
      return done({ error: timedOut ? 'timeout' : reached ? 'blocked_read' : 'network' });
    }
    const status = Number(response && response.status) || 0;
    const contentType = header(response, 'content-type');
    const answer = (fields) => done({ status, contentType, ...fields });
    const refuse = (error) => {
      dropBody(response);
      return answer({ error });
    };
    if (status === 401 || status === 403) return refuse('auth');
    if (status === 404) return refuse('not_found');
    if (status < 200 || status > 299) return refuse('http');
    const length = header(response, 'content-length');
    if (length && Number(length) > maxChars) return refuse('too_big');
    const text = await readCapped(response, maxChars, stop);
    if (text === null) return answer({ error: 'too_big' });
    const clean = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
    if (!clean.trim()) return answer({ error: 'empty' });
    try {
      return answer({ ok: true, json: JSON.parse(clean) });
    } catch (_) {
      return answer({ error: 'not_json' });
    }
  } catch (_) {
    // The reply broke off while it was read: our timeout, or a dropped connection.
    return done({ error: timedOut ? 'timeout' : 'network' });
  } finally {
    clearTimeout(timer);
  }
}

function originOf(pageOrigin) {
  try {
    return new URL(pageOrigin).origin;
  } catch (_) {
    return String(pageOrigin || ''); // shown as typed when it isn't a URL
  }
}

// Advice for a fetchJson result: [{level, key, vars}] with key under registry text.doctor.
// level: ok, info, warning, error, or action (a button: open_link with vars.url). listPath is the
// block's list_path: the count and the private-field warning are about the items the block shows.
export function doctor(result, { url = '', pageOrigin = '', privateKeyList, listPath = '' } = {}) {
  if (!isPlainObject(result)) return [];
  const out = [];
  const add = (level, key, vars = {}) => out.push({ level, key, vars });
  const host = result.host || hostOf(url) || '';
  const link = result.url || url;
  if (result.ok) {
    const path = typeof listPath === 'string' ? listPath : '';
    const items = listIn(result.json, path);
    // No list picked and none to guess: the block shows the reply as one item, so a count would
    // say little. Name the list the reply holds instead (empty for now, or of plain values, which
    // is never guessed); a reply with no list at all has no list of items.
    if (!path && guessListPath(result.json) === null) {
      add('ok', 'ok_object', { ms: result.ms });
      const found = findListPath(result.json);
      const list = found === null ? undefined : getPath(result.json, found);
      if (!Array.isArray(list)) add('warning', 'empty');
      else add('info', list.length ? 'ok_list_plain' : 'ok_list_empty', { path: found });
    } else {
      add('ok', items.length === 1 ? 'ok_one' : 'ok', { ms: result.ms, count: items.length });
    }
    const keys = Array.isArray(privateKeyList) ? privateKeyList : privateKeys(fieldsOf(items));
    if (keys.length) add('warning', 'private_keys', { keys: keys.join(', ') });
    // It works now, but visitors can't reach the student's computer.
    if (result.loopback) add('info', 'policy_loopback_view');
    return out;
  }
  switch (result.error) {
    case 'policy':
      if (POLICY_TEXT.has(result.reason)) add('error', result.reason);
      else add('error', 'policy', { reason: String(result.reason || '') });
      break;
    case 'mixed_content': add('error', 'mixed_content'); break;
    case 'timeout': add('error', 'timeout', { seconds: Math.round((Number(result.timeoutMs) || 0) / 1000) }); break;
    case 'blocked_read': add('error', 'blocked_read', { host, origin: originOf(pageOrigin) }); break;
    case 'auth': add('error', 'auth'); break;
    case 'not_found': add('error', 'not_found', { host }); break;
    case 'http': add('error', 'http', { host, status: result.status }); break;
    case 'not_json': add('error', 'not_json', { host }); break;
    case 'too_big': add('error', 'too_big', { max: result.maxChars }); break;
    case 'empty': add('error', 'empty'); break;
    default: add('error', 'network', { host }); break;
  }
  // Opening the link shows what the browser hid: an error page, a 502, or JSON.
  if (link && ['blocked_read', 'http', 'not_json'].includes(result.error)) add('action', 'open_link', { url: link });
  // Chrome asks before a page may reach apps on the student's own computer.
  if (result.loopback && ['network', 'blocked_read', 'timeout'].includes(result.error)) add('info', 'loopback_hint');
  return out;
}

// JSON is valid JavaScript; "<" is escaped so the snippet can't end a <script> it is pasted into.
const literal = (value) => JSON.stringify(value).replace(/</g, `${BACKSLASH}u003c`);

// Show code's parts, which codeSnippet joins. Each starts on a new line and the last ends with one.
const SNIPPET_READ = String.raw`
// Reads a path like "data.items[0].name" from the reply. It never runs code from the reply.
function getPath(value, path) {
  return String(path || '').replace(/\[(\w+)\]/g, '.$1').split('.').filter(Boolean).reduce(
    (node, key) => (node !== null && typeof node === 'object' && Object.hasOwn(node, key) ? node[key] : undefined),
    value,
  );
}

function textAt(item, path) {
  const value = path ? getPath(item, path) : '';
  return value === null || value === undefined || typeof value === 'object' ? '' : String(value);
}`;

// listIn's rule for a list not picked yet (guessListPath), written out for students. The code
// must find the same items as the block, so it keeps findListPath's limits too.
const SNIPPET_FIND = String.raw`
// LIST_PATH "" means "Find the list for me", so this finds the items the way the UI Builder does.
// A reply that is a list is the items. Otherwise the list of objects nearest the top of the reply
// is (the longest one when two are as near). With no such list, a reply that is an object is one
// item. Like the UI Builder, it looks at 500 objects and four names deep (like a.b.c.items) at
// most. It only follows names made of letters, digits, _ and - (never JavaScript's own __proto__,
// constructor or prototype) in a path of 120 characters at most, and checks the first 20 entries
// of a list for objects.
function findItems(reply) {
  const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
  if (Array.isArray(reply)) return reply;
  let best = null;
  const queue = isObject(reply) ? [{ node: reply, path: '', depth: 0 }] : [];
  for (let looked = 0; queue.length && looked < 500; looked += 1) {
    const { node, path, depth } = queue.shift();
    for (const [key, value] of Object.entries(node)) {
      const at = path ? path + '.' + key : key;
      if (!/^[\w-]{1,60}$/.test(key) || ['__proto__', 'constructor', 'prototype'].includes(key) || at.length > 120) continue;
      if (Array.isArray(value) && value.slice(0, 20).some(isObject)) {
        // The queue goes one level at a time, so a list found later is never nearer the top.
        if (!best || (depth === best.depth && value.length > best.items.length)) best = { items: value, depth };
      } else if (isObject(value) && depth < 3) {
        queue.push({ node: value, path: at, depth: depth + 1 });
      }
    }
  }
  if (best) return best.items;
  return isObject(reply) ? [reply] : [];
}`;

// loadItems reads the list at LIST_PATH, one object as one item. In the code for a list not picked
// yet it first hands an empty LIST_PATH to findItems, and still reads a path a student types in.
function snippetLoad(withFind) {
  const find = withFind ? '\n  if (!LIST_PATH) return findItems(reply);' : '';
  return String.raw`
async function loadItems() {
  // No cookies, no referrer and no redirects: the rules the UI Builder uses for your API.
  const response = await fetch(API_URL, {
    credentials: 'omit', referrerPolicy: 'no-referrer', redirect: 'error', headers: { Accept: 'application/json' },
  });
  if (!response.ok) throw new Error('HTTP ' + response.status);
  const reply = await response.json();${find}
  const list = getPath(reply, LIST_PATH);
  if (Array.isArray(list)) return list;
  return list !== null && typeof list === 'object' ? [list] : [];
}`;
}

const SNIPPET_SHOW = String.raw`
// textContent shows text and never runs HTML, so nothing in the reply can run on your page.
function showItems(container, items) {
  container.replaceChildren();
  for (const item of items) {
    const card = document.createElement('div');
    card.className = 'ocs__card';
    const title = document.createElement('h3');
    title.textContent = textAt(item, FIELDS.title);
    const text = document.createElement('p');
    text.textContent = textAt(item, FIELDS.text);
    card.append(title, text);
    const image = textAt(item, FIELDS.image);
    if (image.startsWith('https://')) {
      const img = document.createElement('img');
      img.src = image;
      img.alt = '';
      card.append(img);
    }
    const link = textAt(item, FIELDS.link);
    if (link.startsWith('https://')) {
      const a = document.createElement('a');
      a.href = link;
      a.textContent = link;
      a.rel = 'noopener noreferrer';
      card.append(a);
    }
    container.append(card);
  }
}

loadItems()
  .then((items) => showItems(document.getElementById('api-data'), items))
  .catch((error) => console.error('Could not load the API', error));
`;

// "Show code": plain JavaScript for students to learn from. It draws the items the block shows as
// cards, reading them as listIn does: a picked list (source.list_path) is read as it is, one
// object as one item. For a list not picked yet ("") the code also has findItems, so it finds the
// list each time it runs, as the block does, with or without a Test in the editor.
export function codeSnippet(source) {
  const src = isPlainObject(source) ? source : {};
  const text = (key) => (hasOwn(src, key) && typeof src[key] === 'string' ? src[key] : '');
  const pathOf = (key) => (pathTokens(text(key)) ? text(key) : '');
  const fields = {};
  for (const slot of SLOTS) fields[slot] = isPrivateField(pathOf(`${slot}_path`)) ? '' : pathOf(`${slot}_path`);
  const listPath = pathOf('list_path');
  return [
    '// Generated by the OCS UI Builder. CPT rules: if you reuse this code, say that the OCS UI Builder generated it.',
    '// Put <div id="api-data"></div> where the items should appear.',
    `const API_URL = ${literal(text('url').trim())};`,
    `const LIST_PATH = ${literal(listPath)};`,
    `const FIELDS = ${literal(fields)};`,
    SNIPPET_READ,
    ...(listPath ? [] : [SNIPPET_FIND]),
    snippetLoad(!listPath),
    SNIPPET_SHOW,
  ].join('\n');
}
