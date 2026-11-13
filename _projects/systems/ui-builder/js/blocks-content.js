// Markup for the built-in blocks, copied from real ocs__ grammar usage (each renderer names the
// file it follows). Settings may be missing, the wrong type or hostile (published specs come from
// servers and other students), so values are read with ownValue/textValue, every URL goes through
// url-rules.js and every visible string comes from the registry. Theme trap: preset themes force
// the text color of p, span, div, li, label and small, so accent-colored text sits in other tags.
import { defOf, textOf } from './registry.js';
import { embedPolicy, hostOf, safeImage, safeLink, videoEmbedOf } from './url-rules.js';
import { SANDBOX, h, rich } from './vnode.js';

// Spring caps every spec string at 20 000 characters (DESIGN 9.6); nothing valid is longer.
const TEXT_CAP = 20000;
// The check mark the capstone pages write; decorative and aria-hidden.
const CHECK_MARK = String.fromCharCode(0x2713);
const VIDEO_ALLOW = 'fullscreen; picture-in-picture; encrypted-media';
const EMBED_HEIGHTS = new Set(['short', 'medium', 'tall']);
export const LIVE_TYPES = Object.freeze(['chat', 'members', 'message_me', 'kanban', 'feedback', 'announcements', 'calendar', 'api_data']);
// Live blocks whose owner module draws a whole card of its own (liveCard).
const OWNER_CARDS = new Set(['kanban', 'calendar']);

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

/* ---------- reading settings ---------- */

// Own properties only, so neither a "__proto__" key nor anything on Object.prototype is read.
export function ownValue(object, key) {
  return isObject(object) && Object.prototype.hasOwnProperty.call(object, key) ? object[key] : undefined;
}

// Strings stay strings and finite numbers become text; anything else is empty.
export function textValue(value) {
  if (typeof value === 'string') return value.length > TEXT_CAP ? value.slice(0, TEXT_CAP) : value;
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return '';
}

export function lineOf(settings, id) {
  return textValue(ownValue(settings, id)).trim();
}

function say(ctx, key, vars) {
  return textOf(ctx.registry, key, vars);
}

function blockDef(ctx, type) {
  return defOf(ctx.registry, 'block', type) || {};
}

function fieldOf(ctx, type, id) {
  const fields = blockDef(ctx, type).fields;
  return (Array.isArray(fields) && fields.find((field) => field && field.id === id)) || {};
}

function labelOf(ctx, type) {
  const { label } = blockDef(ctx, type);
  return typeof label === 'string' ? label : type;
}

// A list setting, cut to the registry's max_items for that field.
function listOf(settings, id, ctx, type) {
  const value = ownValue(settings, id);
  if (!Array.isArray(value)) return [];
  const { max_items: maxItems } = fieldOf(ctx, type, id);
  const limit = Number.isInteger(maxItems) ? maxItems : (ctx.registry.limits || {}).list_max;
  return value.slice(0, Number.isInteger(limit) && limit > 0 ? limit : 20);
}

function cookieDomainOf(ctx) {
  const domain = ownValue(ctx.registry.security, 'cookie_domain');
  return typeof domain === 'string' ? domain : '';
}

// A link a visitor can follow, or null. Links to other sites open in a new tab (vnode.js adds
// rel "noopener noreferrer nofollow") and name their host in a title.
export function linkTo(raw, ctx) {
  const link = safeLink(raw, { baseurl: ctx.baseurl, pageOrigin: ctx.pageOrigin });
  if (!link) return null;
  if (/^mailto:/i.test(link.href)) {
    return { attrs: { href: link.href, rel: 'nofollow' }, host: null, fallback: link.href.slice(7) };
  }
  if (!link.external) return { attrs: { href: link.href }, host: null, fallback: link.host || link.href };
  const attrs = { href: link.href, target: '_blank', title: say(ctx, 'blocks.external_host', { host: link.host }) };
  return { attrs, host: link.host, fallback: link.host };
}

/* ---------- shared pieces ---------- */

const para = (text) => (text ? h('p', { class: 'ocs__text' }, text) : null);

function hostPill(ctx, host) {
  return host ? h('strong', { class: 'ocs__status' }, say(ctx, 'blocks.external_host', { host })) : null;
}

// Title row of a card: _includes/profile-ai-connections.html (ocs__card-header, a title and an action).
function cardHeader(title, extra) {
  return h('div', { class: 'ocs__card-header' }, title ? h('h3', { class: 'ocs__section-title' }, title) : null, extra);
}

// a.ocs__btn links in an ocs__links row, as in _posts/capstone/2026-09-11-pnec-capstone.md.
function buttonRow(items, emphasizeFirst, ctx) {
  const buttons = [];
  for (const item of items) {
    const target = linkTo(ownValue(item, 'url'), ctx);
    if (!target) continue;
    const className = emphasizeFirst && !buttons.length ? 'ocs__btn accent fill' : 'ocs__btn';
    buttons.push(h('a', { class: className, ...target.attrs }, lineOf(item, 'label') || target.fallback));
  }
  return buttons.length ? h('div', { class: 'ocs__links' }, buttons) : null;
}

// A card that sends the visitor to the link in a new tab, for what can't load inside the page.
function linkCard(title, raw, ctx, message) {
  const target = linkTo(raw, ctx);
  if (!target && !message) return null;
  const label = target && target.host ? say(ctx, 'blocks.embed_new_tab', { host: target.host }) : title;
  return h('section', { class: 'ocs__card' },
    cardHeader(title, target ? hostPill(ctx, target.host) : null),
    para(message),
    target ? h('div', { class: 'ocs__links' }, h('a', { class: 'ocs__btn', ...target.attrs }, label)) : null);
}

/* ---------- content blocks ---------- */

// _posts/capstone/2026-09-11-pnec-capstone.md: badge, heading, ocs__lead, ocs__links. The badge is a
// <strong> so presets keep its accent; its <div> stops ocs__stack stretching the pill full width.
function hero(settings, ctx) {
  const badge = lineOf(settings, 'badge');
  const lead = lineOf(settings, 'lead');
  return h('header', { class: 'ocs__stack' },
    badge ? h('div', null, h('strong', { class: 'ocs__badge' }, badge)) : null,
    h('h1', null, lineOf(settings, 'title') || say(ctx, 'blocks.untitled')),
    lead ? h('p', { class: 'ocs__text ocs__lead' }, lead) : null,
    buttonRow(listOf(settings, 'links', ctx, 'hero'), true, ctx));
}

// ocs__section-title as in ocs-intelligence-capstone.md. The line under it is p.ocs__text, not
// ocs__description, whose margin: 0 auto would center it away from the left-aligned title.
function heading(settings) {
  const text = lineOf(settings, 'text');
  const subtitle = lineOf(settings, 'subtitle');
  if (!text && !subtitle) return null;
  const level = ownValue(settings, 'level');
  const tag = level === '3' || level === 3 ? 'h3' : 'h2';
  return [text ? h(tag, { class: 'ocs__section-title' }, text) : null, para(subtitle)];
}

// div.ocs__text / div.ocs__callout around rich text (ocs-intelligence-capstone.md, presence pages).
function richBlock(className) {
  return (settings) => {
    const body = textValue(ownValue(settings, 'body'));
    return body.trim() ? h('div', { class: className }, rich(body)) : null;
  };
}

// img.ocs__image-frame as in _posts/capstone/Presence/2026-10-11-presence-system-pipeline.md.
// Images on cookie-domain hosts load without cookies; no image sends this page as the referrer.
function image(settings, ctx) {
  const picture = safeImage(ownValue(settings, 'src'), { baseurl: ctx.baseurl, pageOrigin: ctx.pageOrigin, cookieDomain: cookieDomainOf(ctx) });
  if (!picture) return null;
  const cover = ownValue(settings, 'fit') === 'cover';
  const attrs = { class: cover ? 'ocs__image-frame ocs__image-frame--cover' : 'ocs__image-frame', src: picture.src, alt: lineOf(settings, 'alt'), loading: 'lazy' };
  if (/^https:/i.test(picture.src)) attrs.referrerpolicy = 'no-referrer';
  if (picture.ocsHost) attrs.crossorigin = 'anonymous';
  const caption = lineOf(settings, 'caption');
  return h('figure', null, h('img', attrs), caption ? h('figcaption', null, caption) : null);
}

// The ocs__links row of _posts/capstone/2026-09-11-pnec-capstone.md, first button accent fill.
function buttons(settings, ctx) {
  return buttonRow(listOf(settings, 'links', ctx, 'buttons'), ownValue(settings, 'emphasize_first') !== false, ctx);
}

// section.ocs__card with the title/action row of _includes/profile-ai-connections.html.
function card(settings, ctx) {
  const title = lineOf(settings, 'title');
  const body = textValue(ownValue(settings, 'body'));
  const [link] = listOf(settings, 'links', ctx, 'card');
  const target = link ? linkTo(ownValue(link, 'url'), ctx) : null;
  const button = target ? h('a', { class: 'ocs__btn', ...target.attrs }, lineOf(link, 'label') || target.fallback) : null;
  if (!title && !body.trim() && !button) return null;
  return h('section', { class: 'ocs__card' },
    title || button ? cardHeader(title, button) : null,
    body.trim() ? h('div', { class: 'ocs__text' }, rich(body)) : null);
}

// ocs__keypoints in ocs-intelligence-capstone.md. The check is a <b>, not that page's <span>, so
// preset themes keep its accent.
function keypoints(settings, ctx) {
  const points = listOf(settings, 'items', ctx, 'keypoints').map((item) => {
    const title = lineOf(item, 'title');
    const text = lineOf(item, 'text');
    if (!title && !text) return null;
    return h('div', { class: 'ocs__keypoint' },
      h('b', { class: 'ocs__check', 'aria-hidden': 'true' }, CHECK_MARK),
      h('span', null, title ? h('strong', null, title) : null, title && text ? h('br') : null, text));
  }).filter(Boolean);
  return points.length ? h('div', { class: 'ocs__keypoints' }, points) : null;
}

// ocs__checklist with li.done / li.open as in _posts/capstone/Presence/2026-09-12-presence-system-summary.md.
// The box carries the state as an image label: an aria-label on the <li> itself would replace the
// task's words in some screen readers.
function checklist(settings, ctx) {
  const rows = listOf(settings, 'items', ctx, 'checklist').map((item) => {
    const text = lineOf(item, 'text');
    if (!text) return null;
    const done = ownValue(item, 'done') === true;
    return h('li', { class: done ? 'done' : 'open' },
      h('span', { class: 'ocs__checklist-box', role: 'img', 'aria-label': say(ctx, done ? 'blocks.checklist_done' : 'blocks.checklist_todo') }),
      h('span', null, text));
  }).filter(Boolean);
  return rows.length ? h('ul', { class: 'ocs__checklist' }, rows) : null;
}

// ocs__stats in ocs-intelligence-capstone.md. No preset-proof rule colors .ocs__stat-value, so it
// is a <strong> rather than that page's <span> (the class already sets its size and weight).
function stats(settings, ctx) {
  const tiles = listOf(settings, 'items', ctx, 'stats').map((item) => {
    const value = lineOf(item, 'value');
    const label = lineOf(item, 'label');
    if (!value && !label) return null;
    return h('div', { class: 'ocs__stat' }, h('strong', { class: 'ocs__stat-value' }, value), h('span', { class: 'ocs__stat-label' }, label));
  }).filter(Boolean);
  return tiles.length ? h('div', { class: 'ocs__stats' }, tiles) : null;
}

const positive = (value, fallback) => (Number.isInteger(value) && value > 0 ? value : fallback);

// The table field: one row per line, cells split by "|", blank lines skipped, cut to the limits,
// every row padded to the widest one. page-model.js should count rows and cells the same way.
export function parseTable(value, { maxRows = 50, maxCols = 8 } = {}) {
  const rows = [];
  for (const raw of (typeof value === 'string' ? value : '').split(/\r\n|\r|\n/)) {
    if (rows.length >= maxRows) break;
    if (raw.trim()) rows.push(raw.split('|').slice(0, maxCols).map((cell) => cell.trim()));
  }
  const width = rows.reduce((most, row) => Math.max(most, row.length), 0);
  return rows.map((row) => row.concat(Array(width - row.length).fill('')));
}

// ocs__table-wrap > ocs__table with th scope="col", as in ocs-intelligence-phase-0.md.
function table(settings, ctx) {
  const limits = ctx.registry.limits || {};
  const rows = parseTable(ownValue(settings, 'data'), { maxRows: positive(limits.table_rows, 50), maxCols: positive(limits.table_cols, 8) });
  if (!rows.length) return ctx.mode === 'canvas' ? para(say(ctx, 'blocks.table_empty')) : null;
  const [head, ...body] = rows;
  const caption = lineOf(settings, 'caption');
  return h('div', { class: 'ocs__table-wrap' },
    h('table', { class: 'ocs__table' },
      caption ? h('caption', null, caption) : null,
      h('thead', null, h('tr', null, head.map((cell) => h('th', { scope: 'col' }, cell)))),
      body.length ? h('tbody', null, body.map((row) => h('tr', null, row.map((cell) => h('td', null, cell))))) : null));
}

// nav.ocs__nav-grid > a.ocs__nav-card with kicker and title spans (ocs-intelligence-capstone.md);
// the grammar recolors those two spans under presets itself. The host pill is a <strong>.
function linkCards(settings, ctx) {
  const cards = listOf(settings, 'items', ctx, 'link_cards').map((item) => {
    const target = linkTo(ownValue(item, 'url'), ctx);
    const title = lineOf(item, 'title');
    if (!target || !title) return null;
    const kicker = lineOf(item, 'kicker');
    const text = lineOf(item, 'text');
    return h('a', { class: 'ocs__nav-card', ...target.attrs },
      kicker ? h('span', { class: 'ocs__nav-card-kicker' }, kicker) : null,
      h('span', { class: 'ocs__nav-card-title' }, title),
      text ? h('span', { class: 'ocs__text' }, text) : null,
      hostPill(ctx, target.host));
  }).filter(Boolean);
  return cards.length ? h('nav', { class: 'ocs__nav-grid' }, cards) : null;
}

function initialsOf(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => Array.from(word)[0]).join('').toUpperCase();
}

// abbr.ocs__avatar beside the name, as on _projects/systems/profile/layouts/profile.html (an abbr
// keeps the accent under presets), in an ocs__entity-list like presence-system-technical.md.
function team(settings, ctx) {
  const people = listOf(settings, 'items', ctx, 'team').map((item) => {
    const name = lineOf(item, 'name');
    if (!name) return null;
    const target = linkTo(ownValue(item, 'url'), ctx);
    return h('li', null, h('div', { class: 'ocs__keypoint' },
      h('abbr', { class: 'ocs__avatar', title: name }, initialsOf(name)),
      h('div', null,
        h('strong', null, target ? h('a', target.attrs, name) : name),
        h('br'),
        h('span', null, lineOf(item, 'role') || say(ctx, 'blocks.team_role_none')))));
  }).filter(Boolean);
  if (!people.length) return null;
  const title = lineOf(settings, 'title');
  return [title ? h('h3', { class: 'ocs__section-title' }, title) : null, h('ul', { class: 'ocs__entity-list' }, people)];
}

// pre > code, text only: code never runs and is never highlighted from author input.
function code(settings, ctx) {
  const source = textValue(ownValue(settings, 'code'));
  if (!source.trim()) return null;
  const language = lineOf(settings, 'language');
  const block = h('pre', null, h('code', null, source));
  return language ? h('figure', null, h('figcaption', null, say(ctx, 'blocks.code_label', { language })), block) : block;
}

/* ---------- video and embed: click-to-load ---------- */

// The placeholder card (ocs__card + the ocs__card-header row of profile-ai-connections.html + an
// ocs__links row). Its button carries an already validated address in data-ui-embed-src; the
// viewer swaps the card for embedFrame(...) when it is pressed, so nothing loads before.
function mediaCard(ctx, { title, host, caption, button, kind }) {
  return h('section', { class: 'ocs__card', 'data-ui-embed': kind },
    cardHeader(title, hostPill(ctx, host)),
    para(caption),
    button ? h('div', { class: 'ocs__links' }, button) : null);
}

function video(settings, ctx) {
  const title = lineOf(settings, 'title') || labelOf(ctx, 'video');
  const caption = lineOf(settings, 'caption');
  const raw = ownValue(settings, 'url');
  const player = videoEmbedOf(raw);
  if (!player) return linkCard(title, raw, ctx, ctx.mode === 'canvas' ? say(ctx, 'blocks.video_unsupported') : '');
  if (ctx.mode === 'export') {
    // A page file has no player: the button opens the original video.
    const target = linkTo(raw, ctx);
    const button = target ? h('a', { class: 'ocs__btn accent fill', ...target.attrs }, say(ctx, 'blocks.video_play')) : null;
    return h('section', { class: 'ocs__card' }, cardHeader(title, hostPill(ctx, target && target.host)), para(caption), button ? h('div', { class: 'ocs__links' }, button) : null);
  }
  const button = h('button', { type: 'button', class: 'ocs__btn accent fill', 'data-ui-embed-kind': 'video', 'data-ui-embed-src': player.src, 'data-ui-embed-title': title }, say(ctx, 'blocks.video_play'));
  return mediaCard(ctx, { title, host: hostOf(player.src), caption, button, kind: 'video' });
}

function embedOptions(ctx) {
  const blocked = Array.isArray(ctx.blockedHosts) ? ctx.blockedHosts.filter((host) => typeof host === 'string') : [];
  return { pageOrigin: ctx.pageOrigin, blockedHosts: blocked, cookieDomain: cookieDomainOf(ctx) };
}

function heightOf(settings) {
  const height = ownValue(settings, 'height');
  return EMBED_HEIGHTS.has(height) ? height : 'medium';
}

// Apps on cookie-domain hosts, this site and blocked hosts get a new-tab link card instead.
function embed(settings, ctx) {
  const title = lineOf(settings, 'title') || labelOf(ctx, 'embed');
  const raw = ownValue(settings, 'url');
  if (ctx.mode === 'export') return linkCard(title, raw, ctx, '');
  const policy = embedPolicy(raw, embedOptions(ctx));
  if (policy.ok) {
    const button = h('button', { type: 'button', class: 'ocs__btn accent fill', 'data-ui-embed-kind': 'app', 'data-ui-embed-src': policy.src, 'data-ui-embed-title': title, 'data-ui-embed-height': heightOf(settings) }, say(ctx, 'blocks.embed_open'));
    return mediaCard(ctx, { title, host: policy.host, caption: '', button, kind: 'app' });
  }
  let message = say(ctx, 'blocks.embed_blocked');
  if (policy.reason === 'ocs_host') message = say(ctx, 'blocks.embed_ocs_host', { host: policy.host });
  else if (policy.reason === 'embed_https') message = ctx.mode === 'canvas' ? say(ctx, 'errors.embed_https') : '';
  return linkCard(title, raw, ctx, message);
}

// The iframe for a pressed placeholder button ({kind, src, title, height} from its data-ui-embed-*
// attributes). The address is checked again, so an edited attribute can't frame anything else.
export function embedFrame({ kind, src, title, height } = {}, ctx) {
  if (!ctx || !isObject(ctx.registry)) throw new Error('UI Builder embedFrame: ctx.registry is required');
  const name = textValue(title).trim();
  if (kind === 'video') {
    const player = videoEmbedOf(src);
    if (!player || player.src !== src) return null;
    // src last: the sandbox and referrer policy are in place before the frame has an address.
    return h('iframe', { class: 'ocs__embed ocs__embed--video', title: name, sandbox: SANDBOX, allow: VIDEO_ALLOW, referrerpolicy: 'strict-origin-when-cross-origin', loading: 'lazy', src: player.src });
  }
  if (kind !== 'app') return null;
  const policy = embedPolicy(src, embedOptions(ctx));
  if (!policy.ok) return null;
  const size = EMBED_HEIGHTS.has(height) ? height : 'medium';
  return h('iframe', { class: `ocs__embed ocs__embed--${size}`, title: name, sandbox: SANDBOX, allow: 'fullscreen', referrerpolicy: 'no-referrer', loading: 'lazy', src: policy.src });
}

/* ---------- live blocks ---------- */

function courseLabel(ctx, code) {
  const course = (ctx.registry.courses || []).find((option) => option && option.value === code);
  return course ? course.label : code;
}

// Static stand-ins the canvas shows instead of live data (the canvas never mounts comms, boards or
// embeds). Text comes from text.blocks.sample_*, else the block's help.
export function designSample(type, settings, ctx) {
  switch (type) {
    case 'chat':
    case 'members': {
      const group = lineOf(ownValue(settings, 'group'), 'name');
      return para(group ? say(ctx, `blocks.sample_${type}`, { group }) : say(ctx, 'blocks.sample_no_group'));
    }
    case 'message_me': {
      const fallback = fieldOf(ctx, 'message_me', 'label').default;
      const label = lineOf(settings, 'label') || (typeof fallback === 'string' && fallback) || labelOf(ctx, 'message_me');
      return [para(lineOf(settings, 'note')),
        h('div', { class: 'ocs__links' }, h('button', { type: 'button', class: 'ocs__btn accent fill', tabindex: '-1' }, label)),
        para(say(ctx, 'blocks.sample_message_me'))];
    }
    case 'kanban': {
      const host = hostOf(ownValue(settings, 'url'));
      return para(host ? say(ctx, 'blocks.sample_kanban', { host }) : say(ctx, 'errors.kanban_bad_url'));
    }
    case 'feedback':
      return [para(lineOf(settings, 'prompt')), para(say(ctx, 'blocks.sample_feedback'))];
    case 'api_data': {
      const host = hostOf(ownValue(ownValue(settings, 'source'), 'url'));
      return para(host ? say(ctx, 'blocks.sample_api_data', { host }) : say(ctx, 'blocks.sample_no_source'));
    }
    default: {
      const key = `blocks.sample_${type}`;
      const course = lineOf(settings, 'course') || lineOf(ctx.pageSettings, 'course');
      const text = say(ctx, key, { course: courseLabel(ctx, course) });
      const { help } = blockDef(ctx, type);
      return para(text !== key ? text : (typeof help === 'string' ? help : ''));
    }
  }
}

// The frame every live block shares (DESIGN 6). viewer.js mounts the live content into
// [data-ui-live-mount] and reports progress in [data-ui-live-status]; the canvas shows a sample.
// The kanban and calendar mount their owners' own cards, with a title and an Open link, so on a
// live page their frame is no card: the block's title waits in [data-ui-live-header], a plain
// wrapper that blocks-live.js hides once the owner's card is in. One card, one title.
export function liveCard(type, settings, ctx, node) {
  const canvas = ctx.mode === 'canvas';
  const header = cardHeader(lineOf(settings, 'title') || labelOf(ctx, type), null);
  // A stable id so a block (the feedback form) can point a control's aria-describedby at its status.
  const nodeId = node && typeof node.id === 'string' && /^[sb]-[a-z0-9]{6,12}$/.test(node.id) ? node.id : '';
  const statusAttrs = { 'data-ui-live-status': '', role: 'status' };
  if (nodeId) statusAttrs.id = `ui-live-status-${nodeId}`;
  const status = h('div', statusAttrs, canvas ? null : say(ctx, 'blocks.live_loading'));
  const mount = h('div', { 'data-ui-live-mount': '' }, canvas ? designSample(type, settings, ctx) : null);
  if (!canvas && OWNER_CARDS.has(type)) {
    return h('section', { 'data-ui-live': type }, h('div', { 'data-ui-live-header': '' }, header), status, mount);
  }
  return h('section', { class: 'ocs__card', 'data-ui-live': type }, header, status, mount);
}

export const contentRenderers = Object.freeze({
  hero,
  heading,
  text: richBlock('ocs__text'),
  image,
  video,
  buttons,
  card,
  callout: richBlock('ocs__callout'),
  keypoints,
  checklist,
  stats,
  table,
  link_cards: linkCards,
  team,
  code,
  divider: () => h('hr'),
  embed,
  ...Object.fromEntries(LIVE_TYPES.map((type) => [type, (settings, ctx, node) => liveCard(type, settings, ctx, node)])),
});
