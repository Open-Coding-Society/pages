// Kanban board: a capstone team's GitHub project board, live on any page.
//
//   {% include ocs_kanban_board.html url="https://github.com/orgs/UGRC-CSA/projects/1" filter="Team" %}
//
// Every [data-ocs-kanban] element on the page fills itself in. The board comes
// straight from GitHub's REST API for projects, which answers without a token
// for public boards owned by an organization. (A private board reads as 404,
// and a personal board's cards as 401, so neither can be shown.)
// Visitors without a token share a limit of 60 requests an hour per network,
// so a board is kept in localStorage: reused for 10 minutes, and its title and
// field ids for a day. A first visit costs one request for the project, one for
// its fields and one per 100 cards; a repeat visit, only the cards. When GitHub
// doesn't answer, the last copy stays up with a note saying so. A team
// without an organization can show its repository's issues instead (see
// repoToProject).
//
// Nothing about columns or wording is written here. The stages, the field
// names and everything the board says come from _data/kanban.yml, which the
// include puts on the page, and a capstone can rename, merge, collapse or hide
// its own board's columns with a columns list (see boardConfig). Every board
// names its columns its own way ("Todo", "📋 To Do", "Ready"), so a status with
// a stage's words joins that stage's column; any other status keeps a column of
// its own name, and cards with no status get a column too. Each card shows the
// evidence for its column's gate: its checklist progress and the pull requests
// linked to it.
//
// The filters, counts and toggle are existing OCS elements (ocs__links,
// ocs__btn, ocs__status-pill, ocs__toggle); the columns and cards are the
// ocs__kanban element (_sass/open-coding/elements/kanban/).
//
// A page that makes its boards from its own data (the UI Builder) puts the
// include's empty board on the page with template=true and the defaults with
// ocs_kanban_board_data.html, then calls createKanbanSection for each board
// and mountKanbanBoard to start it. Those sections are marked manual, so the
// boards this script starts by itself (mountAll) are only the include's.

const API = 'https://api.github.com';
const FRESH_MS = 10 * 60 * 1000;       // a saved board is reused this long
const META_MS = 24 * 60 * 60 * 1000;   // and its title and field ids this long
const MAX_PAGES = 5;                   // 100 cards a page
// Accept is the only header, so the browser sends no CORS preflight first.
const HEADERS = { Accept: 'application/vnd.github+json' };

/* ── Settings ────────────────────────────────────────────────────────── */

const listOf = (value) => (Array.isArray(value) ? value : []);

// A name's words, for matching: "📋 To-Do" → ["to", "do"].
const wordsOf = (name) => String(name ?? '').toLowerCase().match(/[\p{L}\p{M}\p{N}]+/gu) || [];

// A status is looked up by its words, so case, emoji and punctuation don't
// matter ("Team Map" finds "📌 Team Map").
const nameKey = (name) => wordsOf(name).join(' ') || String(name ?? '').trim().toLowerCase();

// The settings a board is drawn with: the site's defaults (_data/kanban.yml)
// and the capstone's own columns list, whose entries each name one of its
// board's statuses:
//   { status: 'Todo', label: 'ToDo' }          its own column, by this name
//   { status: 'Ground 0', stage: 'backlog' }   into that stage's column
//   { status: 'Done', collapsed: true }        its column starts collapsed (false: open)
//   { status: 'Notes', hidden: true }          left off the board
export function boardConfig(defaults, columns, issueMetadata = false) {
  const data = defaults || {};
  const overrides = new Map();
  listOf(columns).forEach((column) => {
    if (column && String(column.status ?? '').trim()) overrides.set(nameKey(column.status), column);
  });
  return {
    stages: listOf(data.stages).filter((stage) => stage?.key).map((stage) => ({
      key: String(stage.key),
      label: String(stage.label ?? stage.key),
      labelKey: nameKey(stage.label ?? stage.key),
      words: listOf(stage.words).map(wordsOf).filter((phrase) => phrase.length),
      collapsed: Boolean(stage.collapsed),
      boardName: Boolean(stage.board_name),
      done: Boolean(stage.done),
    })),
    shared: listOf(data.shared).map(nameKey),
    fields: data.fields || {},
    cardFields: [...listOf(data.card_fields), ...(issueMetadata ? ['Estimate'] : [])],
    issueMetadata,
    issues: data.issues || {},
    perColumn: Number(data.per_column) > 0 ? Number(data.per_column) : Infinity,
    text: data.text || {},
    overrides,
  };
}

// One of the settings' sentences, with {n}, {name} and the like filled in.
function textOf(config, key, values = {}) {
  return String(config.text[key] ?? '').replace(/\{(\w+)\}/g, (match, name) => (name in values ? String(values[name]) : match));
}

/* ── Stages ──────────────────────────────────────────────────────────── */

// Whether a status's words hold one of a stage's phrases: each word of the
// phrase starts a word of the status, in a row, so "block" matches "Blocked"
// and "to do" matches "📋 To-Do".
const hasPhrase = (words, phrase) => words.some((_, i) => phrase.every((part, j) => words[i + j]?.startsWith(part)));

// The stage a status belongs to: the one it is named for ("In review"), else
// the one whose words it has, or null when it has none (that column then
// keeps its own name). A status with words from two stages ("Waiting for
// review") belongs to the later one.
function stageFor(status, config) {
  const name = nameKey(status);
  const words = wordsOf(status);
  return config.stages.find((stage) => stage.labelKey === name)
    || [...config.stages].reverse().find((stage) => stage.words.some((phrase) => hasPhrase(words, phrase)))
    || null;
}

export const stageOf = (status, config) => stageFor(status, config)?.key ?? null;

/* ── Board address and fields ────────────────────────────────────────── */

const BOARD_PATH = /^\/(orgs|users)\/([A-Za-z0-9-]+)\/projects\/(\d+)(?:\/|$)/;

// "https://github.com/orgs/UGRC-CSA/projects/1/views/2" → the API path and the
// board's own address. Anything that isn't a GitHub project board is null.
// A personal board (/users/...) is marked: GitHub answers 401 for its cards
// without a token, so only boards owned by an organization can be shown.
// A repository's issues as a board, e.g.
// "https://github.com/rex0dex/fops-pages/issues" (the address must end in
// /issues; a plain repository address still isn't a board). Its issues are
// public, so this works for personal repositories too.
const REPO_PATH = /^\/([A-Za-z0-9-]+)\/([A-Za-z0-9._-]+)\/issues\/?$/;

export function parseBoardUrl(address) {
  let url;
  try { url = new URL(address); } catch (_) { return null; }
  if (url.protocol !== 'https:' || url.hostname !== 'github.com') return null;
  const match = url.pathname.match(BOARD_PATH);
  if (!match) {
    const repo = url.pathname.match(REPO_PATH);
    if (!repo || repo[1] === 'orgs' || repo[1] === 'users') return null;
    const [, owner, name] = repo;
    return { apiPath: `repos/${owner}/${name}`, url: `https://github.com/${owner}/${name}/issues`, repo: `${owner}/${name}`, personal: false };
  }

  const [, kind, owner, number] = match;
  return {
    apiPath: `${kind}/${owner}/projectsV2/${number}`,
    url: `https://github.com/${kind}/${owner}/projects/${number}`,
    personal: kind === 'users',
  };
}

// Option names come back as { raw, html }.
const optionName = (option) => (typeof option?.name === 'string' ? option.name : option?.name?.raw) || '';

function findField(fields, type, name) {
  if (!name) return null;
  const wanted = String(name).toLowerCase();
  const found = fields.find((f) => f.data_type === type && f.name.toLowerCase() === wanted);
  return found ? { id: found.id, name: found.name, options: (found.options || []).map(optionName) } : null;
}

// The fields the embed reads, found by the settings' names in any case: the
// status (or the board's first single-select), the field to filter by, a
// people multi-select, a shipped date and the single-selects a card shows
// (card_fields). Linked pull requests is GitHub's own field, found by its
// type. Assignees come with each issue, not as a field.
export function pickFields(fields, filterName, config) {
  const names = config.fields;
  const firstSingle = fields.find((f) => f.data_type === 'single_select');
  const prs = fields.find((f) => f.data_type === 'linked_pull_requests');
  return {
    status: findField(fields, 'single_select', names.status) || (firstSingle ? findField(fields, 'single_select', firstSingle.name) : null),
    group: filterName ? findField(fields, 'single_select', filterName) : null,
    people: findField(fields, 'multi_select', names.people),
    shipped: findField(fields, 'date', names.shipped),
    prs: prs ? { id: prs.id, name: prs.name, options: [] } : null,
    details: config.cardFields.map((name) => findField(fields, 'single_select', name)).filter(Boolean),
  };
}

/* ── Normalizing ─────────────────────────────────────────────────────── */

function valueOf(item, field) {
  if (!field) return null;
  return (item.fields || []).find((f) => f.id === field.id)?.value ?? null;
}

const dayOf = (iso) => (iso ? String(iso).slice(0, 10) : null);

// The boxes in a card's checklist ("- [x] Unit tested", "1. [ ] Deployed"),
// leaving out examples inside code blocks: the evidence of how far it is
// through its column's gate.
const TASK = /^\s*(?:[-*+]|\d+[.)])\s+\[([ xX])\](?:\s|$)/;
function checklistOf(body) {
  let done = 0;
  let total = 0;
  let fenced = false;
  for (const line of String(body || '').split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) fenced = !fenced;
    const box = !fenced && TASK.exec(line);
    if (!box) continue;
    total += 1;
    if (box[1] !== ' ') done += 1;
  }
  return total ? { done, total } : null;
}

// Pull requests linked to the card's issue, each merged, open, draft or closed.
function linkedPrs(value) {
  return (Array.isArray(value) ? value : [])
    .filter((pr) => String(pr?.html_url || '').startsWith('https://github.com/'))
    .map((pr) => ({
      number: pr.number,
      url: pr.html_url,
      title: pr.title || '',
      state: pr.merged_at ? 'merged' : pr.draft ? 'draft' : pr.state === 'closed' ? 'closed' : 'open',
    }));
}

// The board as the embed draws it: its columns and its work cards, each card
// with just what is shown. GitHub's own payload (card bodies and all) is
// never kept.
//
// Columns follow the board's Status options, in the board's order. Statuses
// with a stage's words share that stage's column ("Todo" and "Ready" are both
// To do), so a board shows only the stages it has; any other status keeps a
// column of its own name, so no card goes missing. The capstone's columns
// list is applied first. Cards with no status get a column at the front, as
// on GitHub, collapsed along with the board's other collapsed columns.
export function normalizeBoard({ project, fields, items }, { filterName = '', url, config }) {
  const picked = pickFields(fields, filterName, config);
  const columns = [];
  const columnOf = new Map();   // status name → its column, or null when hidden
  const columnFor = (status) => {
    if (!columnOf.has(status)) {
      const own = config.overrides.get(nameKey(status)) || {};
      let column = null;
      if (!own.hidden) {
        const named = String(own.stage ?? '').toLowerCase();
        const stage = config.stages.find((s) => s.key.toLowerCase() === named) || stageFor(status, config);
        const key = own.label || !stage ? `status:${status}` : stage.key;
        column = columns.find((c) => c.key === key);
        if (!column) {
          // A board_name stage (the backlog) keeps the board's own name for
          // its column ("Parking Lot", "Icebox").
          const label = own.label || (!stage || stage.boardName ? status : stage.label);
          column = { key, label: String(label), stage: stage?.key ?? null, collapsed: Boolean(stage?.collapsed), done: Boolean(stage?.done) };
          columns.push(column);
        } else if (stage?.boardName) {
          column.label = stage.label;   // two of the board's statuses share it
        }
        if (typeof own.collapsed === 'boolean') column.collapsed = own.collapsed;
      }
      columnOf.set(status, column);
    }
    return columnOf.get(status);
  };
  (picked.status?.options || []).forEach(columnFor);
  let noStatus = null;

  const cards = [];
  let updated = null;
  for (const item of items) {
    const status = optionName(valueOf(item, picked.status));
    let column;
    if (status) {
      column = columnFor(status);
    } else {
      noStatus = noStatus || { key: 'none', label: textOf(config, 'no_status'), stage: null, collapsed: false, done: false };
      column = noStatus;
    }
    if (!column) continue;
    const content = item.content || {};
    const draft = item.content_type === 'DraftIssue';
    const people = [
      ...(valueOf(item, picked.people)?.options || []).map(optionName),
      ...(content.assignees || []).map((person) => person.login),
    ].filter((name, i, all) => name && all.indexOf(name) === i);
    // A draft has no page of its own; it opens in the board's side pane. So
    // does any card whose link isn't on github.com.
    const ownPage = !draft && String(content.html_url || '').startsWith('https://github.com/');
    cards.push({
      id: item.id,
      title: content.title || textOf(config, 'untitled'),
      url: ownPage ? content.html_url : `${url}?pane=issue&itemId=${item.id}`,
      number: draft ? null : (content.number ?? null),
      stage: column.stage,
      status,
      column: column.key,
      group: optionName(valueOf(item, picked.group)),
      people,
      details: picked.details
        .map((field) => ({ name: field.name, value: optionName(valueOf(item, field)) }))
        .filter((detail) => detail.value),
      checklist: checklistOf(content.body),
      prs: linkedPrs(valueOf(item, picked.prs)),
      // Finished work shows the day it shipped: the Shipped date, or the day it merged or closed.
      shipped: column.done ? (dayOf(valueOf(item, picked.shipped)) || dayOf(content.merged_at || content.closed_at)) : null,
    });
    if (!updated || item.updated_at > updated) updated = item.updated_at;
  }
  if (noStatus) {
    noStatus.collapsed = columns.some((column) => column.collapsed);
    columns.unshift(noStatus);
  }

  // A filter button for each option some card has; an option nobody has
  // picked would only ever show an empty board. Shared options (Everyone)
  // are for cards the whole team shares: their cards show under every button.
  const options = picked.group?.options || [];
  const used = new Set(cards.map((card) => card.group));
  const isShared = (name) => config.shared.includes(nameKey(name));
  return {
    title: project?.title || textOf(config, 'title'),
    url,
    filterName: picked.group?.name || '',
    groups: options.filter((name) => !isShared(name) && used.has(name)),
    shared: options.filter(isShared),
    columns,
    cards,
    updated,
  };
}

/* ── Fetching ────────────────────────────────────────────────────────── */

export class BoardError extends Error {
  constructor(kind, message, resetAt = null) {
    super(message);
    this.name = 'BoardError';
    this.kind = kind;         // 'missing' | 'auth' | 'limit' | 'network'
    this.resetAt = resetAt;   // when a rate limit lifts (ms), if GitHub said
  }
}

// GitHub pages long lists with a Link header: <url>; rel="next", <url>; rel="last".
function nextLink(header) {
  const match = /<([^>]+)>;\s*rel="next"/.exec(header || '');
  return match ? match[1] : null;
}

async function getJson(url, fetchImpl, now) {
  let response;
  let body;
  try {
    response = await fetchImpl(url, { headers: HEADERS });
    if (response.ok) body = await response.json();
  } catch (err) {
    throw new BoardError('network', `GitHub didn't answer: ${err.message}`);
  }
  if (response.ok) return { body, next: nextLink(response.headers.get('link')) };
  if (response.status === 404) throw new BoardError('missing', 'No public board at this address');
  if (response.status === 401) throw new BoardError('auth', 'GitHub shows these cards only to signed-in users');
  const headers = response.headers;
  if (response.status === 429 || (response.status === 403 && (headers.get('x-ratelimit-remaining') === '0' || headers.has('retry-after')))) {
    const reset = Number(headers.get('x-ratelimit-reset'));
    const retryAfter = Number(headers.get('retry-after'));
    const resetAt = reset ? reset * 1000 : (retryAfter ? now + retryAfter * 1000 : null);
    throw new BoardError('limit', "GitHub's hourly limit for this network was reached", resetAt);
  }
  throw new BoardError('network', `GitHub answered ${response.status}`);
}

// A fresh copy of the board. The project's title and field ids are reused
// from `meta` when they are under a day old (metaAt), so a refresh is usually
// just the cards: per_page=100, following Link rel="next" for up to 5 pages.
export async function refreshBoard(ref, { filterName = '', config, meta = null, metaAt = 0, fetchImpl = fetch, now = Date.now() } = {}) {
  if (ref.repo) return refreshRepoBoard(ref, { filterName, config, fetchImpl, now });
  let { title, fields } = meta || {};
  let fetchedMetaAt = metaAt;
  if (!meta || now - metaAt >= META_MS) {
    const [project, fieldList] = await Promise.all([
      getJson(`${API}/${ref.apiPath}`, fetchImpl, now),
      getJson(`${API}/${ref.apiPath}/fields`, fetchImpl, now),
    ]);
    title = project.body.title;
    fields = fieldList.body;
    fetchedMetaAt = now;
  }
  const picked = pickFields(fields, filterName, config);
  const ids = [...new Set([picked.status, picked.group, picked.people, picked.shipped, picked.prs, ...picked.details]
    .filter(Boolean).map((f) => f.id))];
  const items = [];
  let next = `${API}/${ref.apiPath}/items?per_page=100${ids.length ? `&fields=${ids.join(',')}` : ''}`;
  for (let page = 0; next && page < MAX_PAGES; page += 1) {
    const result = await getJson(next, fetchImpl, now);
    items.push(...result.body);
    next = result.next;
  }
  return {
    board: normalizeBoard({ project: { title }, fields, items }, { filterName, url: ref.url, config }),
    meta: { title, fields },
    metaAt: fetchedMetaAt,
    fetchedAt: now,
  };
}

// A repository's issues, shaped like a project board so the rest of the embed
// draws them unchanged: each stage is a status, by its label. An issue joins
// the stage of its first label with a stage's name or words ("in review",
// "backlog"); otherwise the settings' issues say which stage closed, assigned
// and other open issues join. The filter (filter="Assignee") makes a button
// for each assignee.
export function repoStatusOf(issue, config) {
  for (const label of issue.labels || []) {
    const stage = stageFor(typeof label === 'string' ? label : label.name, config);
    if (stage) return stage.label;
  }
  const where = config.issues;
  const key = issue.state === 'closed' ? where.closed : (issue.assignees || []).length ? where.assigned : where.open;
  return config.stages.find((stage) => stage.key === key)?.label ?? '';
}

export function repoToProject(repo, issues, filterName, config) {
  const people = [...new Set(issues.flatMap((issue) => (issue.assignees || []).map((p) => p.login)))];
  const fields = [{ id: 1, name: String(config.fields.status ?? ''), data_type: 'single_select', options: config.stages.map((stage) => ({ name: stage.label })) }];
  if (filterName) fields.push({ id: 2, name: filterName, data_type: 'single_select', options: people.map((name) => ({ name })) });
  // Issue metadata is opt-in; existing boards keep their original fields.
  const details = config.issueMetadata ? [
    { id: 3, name: 'Priority', pattern: /^Priority: (P0 Critical|P1 High|P2 Medium|P3 Low)$/ },
    { id: 4, name: 'Estimate', pattern: /^Estimate: ((?:1|2|3|5|8|13|21) hours)$/ },
  ] : [];
  fields.push(...details.map(({ id, name }) => ({ id, name, data_type: 'single_select' })));
  const items = issues
    // Pull requests aren't work items, and issues closed as "not planned" were dropped.
    .filter((issue) => !issue.pull_request && issue.state_reason !== 'not_planned')
    .map((issue) => ({
      id: issue.id,
      content_type: 'Issue',
      content: issue,
      updated_at: issue.updated_at,
      fields: [
        { id: 1, value: { name: repoStatusOf(issue, config) } },
        ...(filterName && issue.assignees?.[0] ? [{ id: 2, value: { name: issue.assignees[0].login } }] : []),
        ...details.flatMap((field) => {
          const match = (issue.labels || []).map((label) => typeof label === 'string' ? label : label.name)
            .map((name) => field.pattern.exec(name || '')).find(Boolean);
          const value = match?.[1];
          return value ? [{ id: field.id, value: { name: value } }] : [];
        }),
      ],
    }));
  return { project: { title: textOf(config, 'issues_title', { repo }) }, fields, items };
}

async function refreshRepoBoard(ref, { filterName = '', config, fetchImpl = fetch, now = Date.now() } = {}) {
  const issues = [];
  let next = `${API}/${ref.apiPath}/issues?state=all&per_page=100`;
  for (let page = 0; next && page < MAX_PAGES; page += 1) {
    const result = await getJson(next, fetchImpl, now);
    issues.push(...result.body);
    next = result.next;
  }
  const payload = repoToProject(ref.repo, issues, filterName, config);
  return {
    board: normalizeBoard(payload, { filterName, url: ref.url, config }),
    meta: null,
    metaAt: 0,
    fetchedAt: now,
  };
}

/* ── Saved copies ────────────────────────────────────────────────────── */

// What a saved entry allows: draw it as is (fresh), draw it and fetch a new
// one (stale), draw it without asking GitHub before its limit resets
// (blocked), or nothing saved yet (empty).
export function cacheState(entry, now) {
  if (!entry) return 'empty';
  if (entry.retryAt > now) return 'blocked';
  if (!entry.board) return 'empty';
  return now - entry.fetchedAt < FRESH_MS ? 'fresh' : 'stale';
}

// localStorage can be missing or throw (a private window, blocked site data).
// The board then works from memory for the visit.
function safeStorage() {
  try { return globalThis.localStorage || null; } catch (_) { return null; }
}

export function readEntry(key, storage = safeStorage()) {
  try { return JSON.parse(storage.getItem(key)) || null; } catch (_) { return null; }
}

export function writeEntry(key, entry, storage = safeStorage()) {
  try { storage.setItem(key, JSON.stringify(entry)); } catch (_) { /* full or blocked: memory only */ }
}

/* ── Columns ─────────────────────────────────────────────────────────── */

// The cards a team filter shows: that team's own, plus the whole team's.
export function filterCards(board, group) {
  if (group === 'all') return board.cards;
  return board.cards.filter((card) => card.group === group || board.shared.includes(card.group));
}

// One column's cards: finished work most recently shipped first (undated
// last), every other column in the board's own order.
export function columnCards(cards, column) {
  const list = cards.filter((card) => card.column === column.key);
  if (column.done) list.sort((a, b) => (b.shipped || '').localeCompare(a.shipped || ''));
  return list;
}

/* ── Drawing ─────────────────────────────────────────────────────────── */

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

const statusPill = (tone, text) => el('span', `ocs__status-pill ocs__status-pill--${tone}`, text);

// "2026-10-09" is a calendar day: read it at local noon so no time zone moves it.
const shortDay = (day) => new Date(`${day}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

function shortTime(ms) {
  const date = new Date(ms);
  const sameDay = date.toDateString() === new Date().toDateString();
  return date.toLocaleString(undefined, sameDay
    ? { hour: 'numeric', minute: '2-digit' }
    : { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function setStatus(section, text) {
  const status = section.querySelector('[data-hook="status"]');
  status.textContent = text;
  status.hidden = !text;
}

// The evidence a card carries for its column's gate: how much of its checklist
// is ticked, and the pull requests linked to it. Pills, in the accent when
// complete (every box ticked, a PR merged). They are text, not links: the
// whole card is already a link, and the issue lists its pull requests.
function evidence(card, say) {
  const pills = [];
  if (card.checklist) {
    const { done, total } = card.checklist;
    const pill = statusPill(done === total ? 'good' : 'neutral', say('checklist', { done, total }));
    pill.title = say('checklist_title', { done, total });
    pills.push(pill);
  }
  (card.prs || []).forEach((pr) => {
    const pill = statusPill(pr.state === 'merged' ? 'good' : 'neutral', say(`pr_${pr.state}`, { n: pr.number }));
    pill.title = say('pr_title', { n: pr.number, title: pr.title });
    pills.push(pill);
  });
  if (!pills.length) return null;
  const row = el('div', 'ocs__kanban-evidence');
  row.append(...pills);
  return row;
}

// One card: a link to the issue, pull request or draft. Above the name, its
// group (when every group is showing) and its number; under it, its people,
// once done the day it shipped, the card_fields the board has, then its
// evidence.
function cardLink(card, showGroup, say) {
  const link = el('a', 'ocs__kanban-item');
  link.href = card.url;
  link.target = '_blank';
  link.rel = 'noopener';
  const kicker = [showGroup && card.group, card.number && `#${card.number}`].filter(Boolean).join(' · ');
  if (kicker) link.appendChild(el('div', 'ocs__kanban-kicker', kicker));
  link.appendChild(el('div', 'ocs__kanban-name', card.title));
  const note = [card.people.join(', '), card.shipped && shortDay(card.shipped)].filter(Boolean).join(' · ');
  if (note) link.appendChild(el('div', 'ocs__kanban-note', note));
  card.details.forEach(({ name, value }) => link.appendChild(el('div', 'ocs__kanban-note', say('card_field', { name, value }))));
  const proof = evidence(card, say);
  if (proof) link.appendChild(proof);
  return link;
}

// A board drawn into its section. It keeps what the reader chose (group,
// collapsed columns shown, opened columns) across refreshes.
function boardView(section, config) {
  const say = (key, values) => textOf(config, key, values);
  const mount = section.querySelector('[data-hook="mount"]');
  const state = { group: 'all', expanded: false, open: new Set() };
  let board = null;
  let warned = false;   // about a filter field the board doesn't have, once

  // render() rebuilds everything, so put focus back on the control that was used.
  function renderAndFocus(selector) {
    render();
    mount.querySelector(selector)?.focus();
  }

  // The filter buttons (selected one in the accent fill) and the toggle for
  // collapsed columns share one ocs__links row; the row is left out when it
  // would be empty.
  function controls(cards) {
    const row = el('div', 'ocs__links');
    if (board.groups.length >= 2) {
      row.appendChild(el('span', 'ocs__text', board.filterName));
      [['all', say('all')], ...board.groups.map((group) => [group, group])].forEach(([value, label], i) => {
        const on = state.group === value;
        const button = el('button', `ocs__btn small pill${on ? ' accent fill' : ''}`, label);
        button.type = 'button';
        button.dataset.group = String(i);
        button.setAttribute('aria-pressed', String(on));
        button.addEventListener('click', () => {
          state.group = value;
          state.open.clear();
          renderAndFocus(`[data-group="${i}"]`);
        });
        row.appendChild(button);
      });
    }
    const collapsed = board.columns.filter((col) => col.collapsed);
    const keys = new Set(collapsed.map((col) => col.key));
    const count = cards.filter((card) => keys.has(card.column)).length;
    if (count) {
      const toggle = el('label', 'ocs__toggle');
      const input = el('input', 'ocs__toggle-input');
      input.type = 'checkbox';
      input.checked = state.expanded;
      input.dataset.expand = '';
      input.addEventListener('change', () => {
        state.expanded = input.checked;
        renderAndFocus('[data-expand]');
      });
      const track = el('span', 'ocs__toggle-track');
      track.setAttribute('aria-hidden', 'true');
      // Named for the column when the board collapses just one ("Parking Lot");
      // the No status column only goes along with it.
      const named = collapsed.filter((col) => col.key !== 'none');
      const name = named.length === 1 ? named[0].label : say('collapsed_columns');
      toggle.append(input, track, el('span', 'ocs__toggle-label', say('toggle', { name, n: count })));
      row.appendChild(toggle);
    }
    return row.childElementCount ? [row] : [];
  }

  // One column: its name and count over its first per_column cards, then a
  // "+N more" pill that opens the rest. data-stage picks the color of the line
  // across its top; a column of the board's own (no stage) gets the plain one.
  function column(col, cards, showGroup) {
    const list = columnCards(cards, col);
    const index = board.columns.indexOf(col);
    const item = el('li', 'ocs__kanban-column');
    if (col.stage) item.dataset.stage = col.stage;
    const heading = el('div');
    heading.append(el('strong', '', col.label), ' ', statusPill('neutral', String(list.length)));
    item.appendChild(heading);
    if (!list.length) item.appendChild(el('div', 'ocs__text', say('empty')));
    const open = state.open.has(col.key);
    (open ? list : list.slice(0, config.perColumn)).forEach((card) => item.appendChild(cardLink(card, showGroup, say)));
    if (list.length > config.perColumn) {
      const more = el('a', 'ocs__status-pill ocs__status-pill--neutral', open ? say('less') : say('more', { n: list.length - config.perColumn }));
      more.href = '#';
      more.dataset.columnToggle = String(index);
      more.setAttribute('aria-expanded', String(open));
      more.addEventListener('click', (e) => {
        e.preventDefault();
        if (open) state.open.delete(col.key);
        else state.open.add(col.key);
        renderAndFocus(`[data-column-toggle="${index}"]`);
      });
      // ocs__keypoint keeps the pill its own width instead of the column's.
      const row = el('div', 'ocs__keypoint');
      row.appendChild(more);
      item.appendChild(row);
    }
    return item;
  }

  function render() {
    const cards = filterCards(board, state.group);
    const showGroup = state.group === 'all' && board.groups.length > 0;
    const columns = el('ul', 'ocs__kanban-board');
    board.columns
      .filter((col) => state.expanded || !col.collapsed)
      .forEach((col) => columns.appendChild(column(col, cards, showGroup)));
    const body = el('div', 'ocs__keypoints');
    body.append(...controls(cards), columns);
    mount.replaceChildren(body);
  }

  return {
    show(next) {
      board = next;
      // A group that left the board since the last copy falls back to all.
      if (state.group !== 'all' && !board.groups.includes(state.group)) state.group = 'all';
      if (section.dataset.filter && !board.filterName && !warned) {
        warned = true;
        console.warn(`Kanban board: ${board.url} has no single-select field named "${section.dataset.filter}", so it shows without a filter.`);
      }
      if (!section.hasAttribute('data-title-fixed')) {
        section.querySelector('[data-hook="title"]').textContent = board.title;
        section.setAttribute('aria-label', board.title);
      }
      const count = board.cards.length;
      const meta = [say(count === 1 ? 'one_card' : 'cards', { n: count })];
      if (board.updated) {
        meta.push(say('last_change', { date: new Date(board.updated).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) }));
      }
      section.querySelector('[data-hook="meta"]').textContent = meta.join(' · ');
      mount.hidden = false;
      render();
    },
  };
}

/* ── Mounting ────────────────────────────────────────────────────────── */

// What the reader is told when GitHub doesn't hand over a fresh board,
// depending on whether a saved copy is on screen.
function notice(entry, error, say) {
  const saved = entry?.board ? `${say('saved', { time: shortTime(entry.fetchedAt) })} ` : '';
  if (error.kind === 'missing') return saved ? `${saved}${say('gone')}` : say('missing');
  if (error.kind === 'auth') return `${saved}${say('auth')}`;
  if (error.kind === 'limit') {
    const reset = error.resetAt ? ` ${say('resets', { time: shortTime(error.resetAt) })}` : '';
    return `${saved}${say('limit')}${reset}`;
  }
  return `${saved}${say('no_answer')}`;
}

function readJson(node) {
  try { return node ? JSON.parse(node.textContent) : null; } catch (_) { return null; }
}

// A short fingerprint of a board's settings, so a copy saved under other
// settings (the capstone changed its columns list) isn't drawn.
function fingerprint(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) hash = (Math.imul(hash, 31) + text.charCodeAt(i)) | 0;
  return (hash >>> 0).toString(36);
}

// The include puts the site's defaults on the page once, and each board's
// own columns list inside its section, both as JSON. A page that has the
// defaults already can pass them instead.
function settingsOf(section, defaults = readJson(document.getElementById('ocs-kanban-defaults'))) {
  if (!defaults) return null;
  const columns = readJson(section.querySelector('script[data-hook="columns"]'));
  const issueMetadata = section.dataset.issueMetadata === 'true';
  // Preserve existing cache keys for boards that have not opted in.
  const settings = issueMetadata ? [defaults, columns, true] : [defaults, columns];
  return { config: boardConfig(defaults, columns, issueMetadata), stamp: fingerprint(JSON.stringify(settings)) };
}

// One look at a board: the saved copy at once, then GitHub's when that copy is
// stale. `run` is its mount's: the view keeps what the reader chose across
// refreshes, and once the signal is aborted (unmounted) nothing is drawn.
async function loadBoard(section, run) {
  const settings = settingsOf(section, run.defaults);
  if (!settings) {
    console.error('Kanban board: the page has no #ocs-kanban-defaults; add the board with _includes/ocs_kanban_board.html (or the defaults with _includes/ocs_kanban_board_data.html).');
    return;
  }
  const { config, stamp } = settings;
  const say = (key, values) => textOf(config, key, values);
  const ref = parseBoardUrl(section.dataset.boardUrl || '');
  if (!ref) {
    setStatus(section, say('not_a_board'));
    return;
  }
  // Asking would cost three of the 60 requests and always come back 401.
  if (ref.personal) {
    setStatus(section, say('personal'));
    return;
  }
  const filterName = section.dataset.filter || '';
  const key = `ocs-kanban:v5:${ref.apiPath}:${filterName}:${stamp}`;
  run.view = run.view || boardView(section, config);
  const { view } = run;
  let entry = readEntry(key);
  if (entry?.board) view.show(entry.board);

  const state = cacheState(entry, Date.now());
  if (state === 'fresh') return;
  if (state === 'blocked') {
    setStatus(section, notice(entry, new BoardError('limit', '', entry.retryAt), say));
    return;
  }
  if (!entry?.board) setStatus(section, say('loading'));
  // The mount's signal stops requests still out when the board is unmounted.
  const fetchImpl = (url, init) => fetch(url, { ...init, signal: run.signal });
  try {
    entry = await refreshBoard(ref, { filterName, config, meta: entry?.meta, metaAt: entry?.metaAt, fetchImpl });
    if (run.signal.aborted) return;
    writeEntry(key, entry);
    view.show(entry.board);
    setStatus(section, '');
  } catch (err) {
    if (run.signal.aborted) return;
    if (!(err instanceof BoardError)) console.error('Kanban board: could not draw the board', err);
    const error = err instanceof BoardError ? err : new BoardError('network', err.message);
    // Don't ask again before the limit resets (or for 10 minutes if GitHub didn't say).
    if (error.kind === 'limit') writeEntry(key, { ...entry, retryAt: error.resetAt || Date.now() + FRESH_MS });
    setStatus(section, notice(entry, error, say));
  }
}

// Each section's mount, so mounting one twice is harmless.
const mounts = new WeakMap();

// Starts the board in a section and returns { refresh(), unmount() }. The
// board loads when it comes within 400px of the screen, so a board far down a
// long page costs no requests until someone scrolls to it; refresh() loads it
// now (from the saved copy while that is fresh). unmount() stops watching the
// screen and any request still out, and empties the board. `defaults` are
// _data/kanban.yml's, for a page without #ocs-kanban-defaults.
export function mountKanbanBoard(section, { defaults } = {}) {
  if (mounts.has(section)) return mounts.get(section);
  const before = section.getAttribute('data-mounted');
  const controller = new AbortController();
  const run = { defaults, signal: controller.signal, view: null };
  let observer = null;
  let loading = null;

  const load = () => {
    if (controller.signal.aborted) return Promise.resolve();
    observer?.disconnect();
    observer = null;
    loading = loading || loadBoard(section, run)
      .catch((err) => console.error('Kanban board: load failed', err))
      .finally(() => { loading = null; });
    return loading;
  };

  const handle = {
    refresh: load,
    unmount() {
      if (controller.signal.aborted) return;
      controller.abort();
      observer?.disconnect();
      mounts.delete(section);
      const mount = section.querySelector('[data-hook="mount"]');
      mount.replaceChildren();
      mount.hidden = true;
      section.querySelector('[data-hook="meta"]').textContent = '';
      setStatus(section, '');
      if (before === null) section.removeAttribute('data-mounted');
      else section.setAttribute('data-mounted', before);
    },
  };
  mounts.set(section, handle);
  section.dataset.mounted = 'true';

  if ('IntersectionObserver' in globalThis) {
    observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) load();
    }, { rootMargin: '400px 0px' });
    observer.observe(section);
  } else {
    load();
  }
  return handle;
}

// The include's boards: every section in `root` that isn't mounted yet.
// Sections from createKanbanSection are marked manual and wait for their
// page's own mountKanbanBoard.
export function mountAll(root = document) {
  return [...root.querySelectorAll('[data-ocs-kanban]:not([data-mounted])')].map((section) => mountKanbanBoard(section));
}

// A board for a page that makes its own: a copy of the include's empty
// section (template=true) with this board's values, marked manual. The page
// adds it, then calls mountKanbanBoard(section). columns is a capstone's
// columns list, as the include's columns option takes it.
export function createKanbanSection({ url = '', filter = '', title = '', columns = null } = {}, doc = document) {
  const empty = doc.querySelector('template[data-ocs-template="kanban"]')?.content.querySelector('[data-ocs-kanban]');
  if (!empty) {
    throw new Error('Kanban board: the page has no board template; add {% include ocs_kanban_board.html template=true %}.');
  }
  const section = doc.importNode(empty, true);
  const address = String(url ?? '').trim();
  section.dataset.boardUrl = address;
  section.dataset.filter = String(filter ?? '').trim();
  // Only a board's own address on GitHub gets the Open on GitHub link.
  const link = section.querySelector('a.ocs__btn');
  if (parseBoardUrl(address)) link.href = address;
  else link.remove();
  const name = String(title ?? '').trim();
  if (name) {
    section.querySelector('[data-hook="title"]').textContent = name;
    section.setAttribute('aria-label', name);
    section.setAttribute('data-title-fixed', '');
  }
  if (Array.isArray(columns) && columns.length) {
    const list = doc.createElement('script');
    list.type = 'application/json';
    list.dataset.hook = 'columns';
    // Escaped like the include's, so the list can't end its script element.
    list.textContent = JSON.stringify(columns).replace(/</g, '\\u003c');
    section.querySelector('[data-hook="mount"]').after(list);
  }
  section.dataset.mounted = 'manual';
  return section;
}

if (typeof document !== 'undefined') {
  const start = () => mountAll();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
}
