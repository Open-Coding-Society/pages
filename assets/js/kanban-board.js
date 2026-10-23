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
// doesn't answer, the last copy stays up with a note saying so.
//
// Every board names its columns its own way ("Todo", "📋 To Do", "Ready"), so
// familiar names are grouped into five shared stages, the same five as the OCS
// issue lifecycle (Parking Lot, ToDo, In Progress, In Review, Done); any other
// column keeps its own name, and cards with no status get a "No status"
// column. Only UGRC-CSA's note columns ("Team Map", "Reflections") are left
// out. Each card shows the evidence for its column's gate: its checklist
// progress and the pull requests linked to it.
//
// The filters, counts and backlog toggle are existing OCS elements
// (ocs__links, ocs__btn, ocs__status-pill, ocs__toggle); the columns and cards
// are the ocs__kanban element (_sass/open-coding/elements/kanban/).

const API = 'https://api.github.com';
const FRESH_MS = 10 * 60 * 1000;       // a saved board is reused this long
const META_MS = 24 * 60 * 60 * 1000;   // and its title and field ids this long
const MAX_PAGES = 5;                   // 100 cards a page
// Accept is the only header, so the browser sends no CORS preflight first.
const HEADERS = { Accept: 'application/vnd.github+json' };

/* ── Stages ──────────────────────────────────────────────────────────── */

export const STAGES = [
  { key: 'backlog', label: 'Backlog' },
  { key: 'todo', label: 'To do' },
  { key: 'doing', label: 'In progress' },
  { key: 'review', label: 'In review' },
  { key: 'done', label: 'Done' },
];

// Tried in this order, so "In review" never lands in "In progress". Blocked
// or waiting work is still in progress, not a column to leave out.
const STAGE_RULES = [
  ['review', /review|\bqa\b|testing/i],
  ['done', /done|shipped|complete|closed|merged|released|deployed|finished|resolved/i],
  ['doing', /progress|doing|active|\bwip\b|building|block|hold|wait|stuck/i],
  ['todo', /to ?do|ready|next|planned|sprint/i],
  ['backlog', /backlog|parking|idea|planning|icebox|someday|triage|\bnew\b/i],
];

// The stage a status belongs to, or null when its name isn't a familiar one
// (that column then keeps its own name).
export function stageOf(status) {
  if (!status) return 'backlog';   // GitHub's "No Status" column
  const rule = STAGE_RULES.find(([, pattern]) => pattern.test(status));
  return rule ? rule[0] : null;
}

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
  const wanted = String(name).toLowerCase();
  const found = fields.find((f) => f.data_type === type && f.name.toLowerCase() === wanted);
  return found ? { id: found.id, name: found.name, options: (found.options || []).map(optionName) } : null;
}

// The fields the embed reads, found by name in any case: the status (or the
// board's first single-select), the field to filter by, a People multi-select,
// Priority and Topic single-selects and a Shipped date. Linked pull requests is
// GitHub's own field, found by its type. Assignees come with each issue, not as
// a field.
export function pickFields(fields, filterName) {
  const firstSingle = fields.find((f) => f.data_type === 'single_select');
  const prs = fields.find((f) => f.data_type === 'linked_pull_requests');
  return {
    status: findField(fields, 'single_select', 'Status') || (firstSingle ? findField(fields, 'single_select', firstSingle.name) : null),
    group: filterName ? findField(fields, 'single_select', filterName) : null,
    people: findField(fields, 'multi_select', 'People'),
    shipped: findField(fields, 'date', 'Shipped'),
    priority: findField(fields, 'single_select', 'Priority'),
    topic: findField(fields, 'single_select', 'Topic'),
    prs: prs ? { id: prs.id, name: prs.name, options: [] } : null,
  };
}

/* ── Normalizing ─────────────────────────────────────────────────────── */

// An option such as "Everyone" is for cards the whole team shares: it isn't
// a filter of its own, and its cards show under every group.
const SHARED = /^(everyone|all|whole team|shared)$/i;

// Columns that hold notes about the team rather than work (UGRC-CSA's
// "📌 Team Map" and "🪞 Reflections") are left off the embed.
const HIDDEN = /team map|reflection/i;

const LABELS = Object.fromEntries(STAGES.map((stage) => [stage.key, stage.label]));

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
// with a familiar name share their stage's column ("Todo" and "Ready" are both
// To do), so a board shows only the stages it has; any other status keeps a
// column of its own name, so no card goes missing. Cards with no status get a
// "No status" column first, as on GitHub. Backlog columns start hidden behind
// a toggle, and so does No status on a board that has a Backlog of its own.
export function normalizeBoard({ project, fields, items }, { filterName = '', url } = {}) {
  const picked = pickFields(fields, filterName);
  const columns = [];
  const columnOf = new Map();   // status name → its column, or null when hidden
  const columnFor = (status) => {
    if (!columnOf.has(status)) {
      let column = null;
      if (!HIDDEN.test(status)) {
        const stage = stageOf(status);
        const key = stage || `status:${status}`;
        column = columns.find((c) => c.key === key);
        if (!column) {
          // The backlog keeps the board's own name for it ("Parking Lot",
          // "Icebox"); the other stages use the embed's.
          const label = stage === 'backlog' ? status : (stage ? LABELS[stage] : status);
          column = { key, label, stage, toggle: stage === 'backlog' };
          columns.push(column);
        } else if (stage === 'backlog') {
          column.label = LABELS.backlog;   // two of the board's columns share it
        }
      }
      columnOf.set(status, column);
    }
    return columnOf.get(status);
  };
  (picked.status?.options || []).forEach(columnFor);
  const hasBacklog = columns.some((c) => c.stage === 'backlog');
  let noStatus = null;

  const cards = [];
  let updated = null;
  for (const item of items) {
    const status = optionName(valueOf(item, picked.status));
    let column;
    if (status) {
      column = columnFor(status);
    } else {
      noStatus = noStatus || { key: 'none', label: 'No status', stage: 'backlog', toggle: hasBacklog };
      column = noStatus;
    }
    if (!column) continue;
    const { stage } = column;
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
      title: content.title || 'Untitled card',
      url: ownPage ? content.html_url : `${url}?pane=issue&itemId=${item.id}`,
      number: draft ? null : (content.number ?? null),
      stage,
      status,
      column: column.key,
      group: optionName(valueOf(item, picked.group)),
      priority: optionName(valueOf(item, picked.priority)),
      topic: optionName(valueOf(item, picked.topic)),
      people,
      checklist: checklistOf(content.body),
      prs: linkedPrs(valueOf(item, picked.prs)),
      shipped: dayOf(valueOf(item, picked.shipped)) || (stage === 'done' ? dayOf(content.merged_at || content.closed_at) : null),
    });
    if (!updated || item.updated_at > updated) updated = item.updated_at;
  }
  if (noStatus) columns.unshift(noStatus);

  // A filter button for each option some card has; an option nobody has
  // picked would only ever show an empty board.
  const options = picked.group?.options || [];
  const used = new Set(cards.map((card) => card.group));
  return {
    title: project?.title || 'Project board',
    url,
    filterName: picked.group?.name || '',
    groups: options.filter((name) => !SHARED.test(name) && used.has(name)),
    shared: options.filter((name) => SHARED.test(name)),
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
export async function refreshBoard(ref, { filterName = '', meta = null, metaAt = 0, fetchImpl = fetch, now = Date.now() } = {}) {
  if (ref.repo) return refreshRepoBoard(ref, { filterName, fetchImpl, now });
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
  const picked = pickFields(fields, filterName);
  const ids = [picked.status, picked.group, picked.people, picked.shipped, picked.priority, picked.topic, picked.prs]
    .filter(Boolean).map((f) => f.id);
  const items = [];
  let next = `${API}/${ref.apiPath}/items?per_page=100${ids.length ? `&fields=${ids.join(',')}` : ''}`;
  for (let page = 0; next && page < MAX_PAGES; page += 1) {
    const result = await getJson(next, fetchImpl, now);
    items.push(...result.body);
    next = result.next;
  }
  return {
    board: normalizeBoard({ project: { title }, fields, items }, { filterName, url: ref.url }),
    meta: { title, fields },
    metaAt: fetchedMetaAt,
    fetchedAt: now,
  };
}

// A repository's issues, shaped like a project board so the
// rest of the embed draws them unchanged. Each issue's column comes from a
// label with a familiar stage name ("in progress", "in review", "backlog"),
// otherwise: closed → Done, open and assigned → In progress, open → To do.
// The filter (filter="Assignee") makes a button for each assignee.
const REPO_STATUSES = ['Backlog', 'To do', 'In progress', 'In review', 'Done'];

export function repoStatusOf(issue) {
  for (const label of issue.labels || []) {
    const stage = stageOf(typeof label === 'string' ? label : label.name);
    if (stage) return REPO_STATUSES[STAGES.findIndex((s) => s.key === stage)];
  }
  if (issue.state === 'closed') return 'Done';
  return (issue.assignees || []).length ? 'In progress' : 'To do';
}

export function repoToProject(repo, issues, filterName = '') {
  const people = [...new Set(issues.flatMap((issue) => (issue.assignees || []).map((p) => p.login)))];
  const fields = [{ id: 1, name: 'Status', data_type: 'single_select', options: REPO_STATUSES.map((name) => ({ name })) }];
  if (filterName) fields.push({ id: 2, name: filterName, data_type: 'single_select', options: people.map((name) => ({ name })) });
  const items = issues
    // Pull requests aren't work items, and issues closed as "not planned" were dropped.
    .filter((issue) => !issue.pull_request && issue.state_reason !== 'not_planned')
    .map((issue) => ({
      id: issue.id,
      content_type: 'Issue',
      content: issue,
      updated_at: issue.updated_at,
      fields: [
        { id: 1, value: { name: repoStatusOf(issue) } },
        ...(filterName && issue.assignees?.[0] ? [{ id: 2, value: { name: issue.assignees[0].login } }] : []),
      ],
    }));
  return { project: { title: `${repo} — issues` }, fields, items };
}

async function refreshRepoBoard(ref, { filterName = '', fetchImpl = fetch, now = Date.now() } = {}) {
  const issues = [];
  let next = `${API}/${ref.apiPath}/issues?state=all&per_page=100`;
  for (let page = 0; next && page < MAX_PAGES; page += 1) {
    const result = await getJson(next, fetchImpl, now);
    issues.push(...result.body);
    next = result.next;
  }
  const payload = repoToProject(ref.repo, issues, filterName);
  return {
    board: normalizeBoard(payload, { filterName, url: ref.url }),
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

// One column's cards: done work most recently shipped first (undated last),
// every other column in the board's own order.
export function columnCards(cards, column) {
  const list = cards.filter((card) => card.column === column.key);
  if (column.stage === 'done') list.sort((a, b) => (b.shipped || '').localeCompare(a.shipped || ''));
  return list;
}

/* ── Drawing ─────────────────────────────────────────────────────────── */

const PER_COLUMN = 5;

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

const PR_MARKS = { merged: ' ✓', open: '', draft: ' draft', closed: ' closed' };

// The evidence a card carries for its column's gate: how much of its checklist
// is ticked, and the pull requests linked to it. Pills, in the accent when
// complete (every box ticked, a PR merged). They are text, not links: the
// whole card is already a link, and the issue lists its pull requests.
function evidence(card) {
  const pills = [];
  if (card.checklist) {
    const { done, total } = card.checklist;
    const pill = statusPill(done === total ? 'good' : 'neutral', `☑ ${done}/${total}`);
    pill.title = `Checklist: ${done} of ${total} done`;
    pills.push(pill);
  }
  (card.prs || []).forEach((pr) => {
    const pill = statusPill(pr.state === 'merged' ? 'good' : 'neutral', `PR #${pr.number}${PR_MARKS[pr.state]}`);
    pill.title = `Pull request #${pr.number} (${pr.state}): ${pr.title}`;
    pills.push(pill);
  });
  if (!pills.length) return null;
  const row = el('div', 'ocs__kanban-evidence');
  row.append(...pills);
  return row;
}

// One card: a link to the issue, pull request or draft. Above the name, its
// group (when every group is showing) and its number; under it, its people,
// once done the day it shipped, its Priority and Topic when the board has
// them, then its evidence.
function cardLink(card, showGroup) {
  const link = el('a', 'ocs__kanban-item');
  link.href = card.url;
  link.target = '_blank';
  link.rel = 'noopener';
  const kicker = [showGroup && card.group, card.number && `#${card.number}`].filter(Boolean).join(' · ');
  if (kicker) link.appendChild(el('div', 'ocs__kanban-kicker', kicker));
  link.appendChild(el('div', 'ocs__kanban-name', card.title));
  const note = [card.people.join(', '), card.stage === 'done' && card.shipped && shortDay(card.shipped)].filter(Boolean).join(' · ');
  if (note) link.appendChild(el('div', 'ocs__kanban-note', note));
  if (card.priority) link.appendChild(el('div', 'ocs__kanban-note', `Priority: ${card.priority}`));
  if (card.topic) link.appendChild(el('div', 'ocs__kanban-note', `Topic: ${card.topic}`));
  const proof = evidence(card);
  if (proof) link.appendChild(proof);
  return link;
}

// A board drawn into its section. It keeps what the reader chose (group,
// backlog, opened columns) across refreshes.
function boardView(section) {
  const mount = section.querySelector('[data-hook="mount"]');
  const state = { group: 'all', backlog: false, open: new Set() };
  let board = null;
  let warned = false;   // about a filter field the board doesn't have, once

  // render() rebuilds everything, so put focus back on the control that was used.
  function renderAndFocus(selector) {
    render();
    mount.querySelector(selector)?.focus();
  }

  // The filter buttons (selected one in the accent fill) and the backlog
  // toggle share one ocs__links row; the row is left out when it would be empty.
  function controls(cards) {
    const row = el('div', 'ocs__links');
    if (board.groups.length >= 2) {
      row.appendChild(el('span', 'ocs__text', board.filterName));
      [['all', 'All'], ...board.groups.map((group) => [group, group])].forEach(([value, label], i) => {
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
    const toggled = new Set(board.columns.filter((column) => column.toggle).map((column) => column.key));
    const backlog = cards.filter((card) => toggled.has(card.column)).length;
    if (backlog) {
      const toggle = el('label', 'ocs__toggle');
      const input = el('input', 'ocs__toggle-input');
      input.type = 'checkbox';
      input.checked = state.backlog;
      input.dataset.backlog = '';
      input.addEventListener('change', () => {
        state.backlog = input.checked;
        renderAndFocus('[data-backlog]');
      });
      const track = el('span', 'ocs__toggle-track');
      track.setAttribute('aria-hidden', 'true');
      // The toggle uses the board's own name for its backlog ("Parking Lot").
      const named = board.columns.find((col) => col.stage === 'backlog' && col.key !== 'none');
      toggle.append(input, track, el('span', 'ocs__toggle-label', `${named ? named.label : LABELS.backlog} (${backlog})`));
      row.appendChild(toggle);
    }
    return row.childElementCount ? [row] : [];
  }

  // One column: its name and count over its first PER_COLUMN cards, then a
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
    if (!list.length) item.appendChild(el('div', 'ocs__text', 'Nothing here'));
    const open = state.open.has(col.key);
    (open ? list : list.slice(0, PER_COLUMN)).forEach((card) => item.appendChild(cardLink(card, showGroup)));
    if (list.length > PER_COLUMN) {
      const more = el('a', 'ocs__status-pill ocs__status-pill--neutral', open ? 'Show less' : `+${list.length - PER_COLUMN} more`);
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
      .filter((col) => state.backlog || !col.toggle)
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
      const changed = board.updated
        ? ` · last change ${new Date(board.updated).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
        : '';
      section.querySelector('[data-hook="meta"]').textContent = `${count} card${count === 1 ? '' : 's'}${changed}`;
      mount.hidden = false;
      render();
    },
  };
}

/* ── Mounting ────────────────────────────────────────────────────────── */

// What the reader is told when GitHub doesn't hand over a fresh board,
// depending on whether a saved copy is on screen.
function notice(entry, error) {
  const saved = entry?.board ? `Showing the copy saved ${shortTime(entry.fetchedAt)}. ` : '';
  if (error.kind === 'missing') {
    return saved ? `${saved}GitHub no longer shows this board publicly.`
      : 'This board is private or the link is wrong. Only public boards can be shown here.';
  }
  if (error.kind === 'auth') return `${saved}GitHub shows this board's cards only to people signed in to GitHub.`;
  if (error.kind === 'limit') {
    const reset = error.resetAt ? ` It resets at ${shortTime(error.resetAt)}.` : '';
    return `${saved}GitHub's hourly limit for visitors on this network was reached.${reset}`;
  }
  return `${saved}GitHub didn't answer.`;
}

async function mountBoard(section) {
  const ref = parseBoardUrl(section.dataset.boardUrl || '');
  if (!ref) {
    setStatus(section, "This isn't the address of a GitHub project board.");
    return;
  }
  // Asking would cost three of the 60 requests and always come back 401.
  if (ref.personal) {
    setStatus(section, "GitHub shows a personal board's cards only to people signed in to GitHub, so only boards owned by an organization can be shown here.");
    return;
  }
  const filterName = section.dataset.filter || '';
  const key = `ocs-kanban:v4:${ref.apiPath}:${filterName}`;
  const view = boardView(section);
  let entry = readEntry(key);
  if (entry?.board) view.show(entry.board);

  const state = cacheState(entry, Date.now());
  if (state === 'fresh') return;
  if (state === 'blocked') {
    setStatus(section, notice(entry, new BoardError('limit', '', entry.retryAt)));
    return;
  }
  if (!entry?.board) setStatus(section, 'Loading the board from GitHub…');
  try {
    entry = await refreshBoard(ref, { filterName, meta: entry?.meta, metaAt: entry?.metaAt });
    writeEntry(key, entry);
    view.show(entry.board);
    setStatus(section, '');
  } catch (err) {
    if (!(err instanceof BoardError)) console.error('Kanban board: could not draw the board', err);
    const error = err instanceof BoardError ? err : new BoardError('network', err.message);
    // Don't ask again before the limit resets (or for 10 minutes if GitHub didn't say).
    if (error.kind === 'limit') writeEntry(key, { ...entry, retryAt: error.resetAt || Date.now() + FRESH_MS });
    setStatus(section, notice(entry, error));
  }
}

// Each board loads when it comes within 400px of the screen, so a board far
// down a long page costs no requests until someone scrolls to it.
function mountWhenNear(section) {
  if (section.dataset.mounted) return;
  section.dataset.mounted = 'true';
  const start = () => mountBoard(section).catch((err) => console.error('Kanban board: load failed', err));
  if (!('IntersectionObserver' in window)) {
    start();
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();
    start();
  }, { rootMargin: '400px 0px' });
  observer.observe(section);
}

if (typeof document !== 'undefined') {
  const mountAll = () => document.querySelectorAll('[data-ocs-kanban]').forEach(mountWhenNear);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountAll);
  else mountAll();
}
