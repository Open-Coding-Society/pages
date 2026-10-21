// Review card: reviews of a capstone from its mentors, N@tM visitors, partners
// and teachers, on the capstone's own page.
//
//   {% include ocs_review_card.html roles="mentor,community,teacher" issues="UGRC-CSA/Pages" board="https://github.com/orgs/UGRC-CSA/projects/1" %}
//
// Every [data-ocs-review] element fills itself in. A review is a microblog post
// on the page (the Flask /api/microblog the Microblog panel uses), so it also
// shows in that panel. Its role, scores and ask ride in the post's data as
// `review`, and the backend hands each data key back at the top level of the post.
//
//   - Anyone can read the reviews. Signed out, they come from the public page
//     list (/api/microblog/topics, then /api/microblog/page/<key>); signed in,
//     from /api/microblog?pagePath=.
//   - A signed-in, verified account can post one. New guest and mentor accounts
//     wait for a teacher to verify them (the backend answers 403), so a team
//     member can type a review in for someone else, at the N@tM booth or after
//     a mentor meeting. The review then says who typed it in.
//   - With issues="owner/repo", a signed-in reader can turn a review into a
//     GitHub issue: GitHub's new-issue form opens filled in, and with board=
//     it puts the issue on the team's board.
//
// Names show by first name only, because signed-out visitors can read the
// reviews. The card is existing OCS elements (ocs__card, ocs__links, ocs__btn,
// ocs__split, ocs__checklist, ocs__stats, ocs__grid--card, ocs__status-pill,
// ocs__toggle, ocs__input, ocs__callout) and has no CSS of its own.

import { parseBoardUrl } from './kanban-board.js';

export const MAX_CONTENT = 280;   // the backend refuses longer posts
const MAX_NEXT = 120;
const MAX_NAME = 40;
const PAGE_LIMIT = 200;           // the signed-in list's own default

export const ROLES = [
  { key: 'mentor', label: 'Mentor', list: 'Mentor reviews', someone: 'A mentor' },
  { key: 'community', label: 'Community', list: 'Community feedback', someone: 'A visitor' },
  { key: 'partner', label: 'Partner', list: 'Partner reviews', someone: 'A partner' },
  { key: 'teacher', label: 'Teacher', list: 'Teacher reviews', someone: 'A teacher' },
];

// What a Sprint 3 review covers: the project, a working demonstration, and how
// it is made, each scored 1 to 5.
export const SCORES = [
  { key: 'project', label: 'The project', short: 'Project' },
  { key: 'demo', label: 'The working demo', short: 'Demo' },
  { key: 'made', label: "How it's made", short: "How it's made" },
];

const roleOf = (key) => ROLES.find((role) => role.key === key);

export class ReviewError extends Error {
  constructor(kind, message) {
    super(message);
    this.name = 'ReviewError';
    this.kind = kind;   // 'empty' | 'long' | 'role' | 'auth' | 'network'
  }
}

/* ── Roles ───────────────────────────────────────────────────────────── */

// The roles a page asks for, in the order it names them ("mentor,community").
// A page that names none the card knows asks for all of them.
export function pickRoles(text) {
  const names = String(text || '').split(',').map((name) => name.trim().toLowerCase()).filter(Boolean);
  const picked = [...new Set(names)].map(roleOf).filter(Boolean);
  return picked.length ? picked : ROLES;
}

// The role an account reviews in when it posts for itself. Anyone else
// (a student) is typing in someone else's review.
const OWN_ROLES = { Mentor: 'mentor', Teacher: 'teacher', Admin: 'teacher' };
export const ownRole = (accountRole) => OWN_ROLES[accountRole] || '';

/* ── Reading posts ───────────────────────────────────────────────────── */

const firstName = (name) => String(name || '').trim().split(/\s+/)[0];
const clean = (value, max) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

function cleanScores(scores) {
  const kept = {};
  SCORES.forEach(({ key }) => {
    const value = scores?.[key];
    if (Number.isInteger(value) && value >= 1 && value <= 5) kept[key] = value;
  });
  return kept;
}

// Flask writes datetime.utcnow().isoformat(): UTC, with no zone on the end.
function utcTime(stamp) {
  if (typeof stamp !== 'string' || !stamp) return null;
  const zoned = /(?:[zZ]|[+-]\d\d:?\d\d)$/.test(stamp) ? stamp : `${stamp}Z`;
  const time = Date.parse(zoned);
  return Number.isNaN(time) ? null : time;
}

// A microblog post as a review, or null when it isn't one.
export function reviewFromPost(post) {
  const review = post?.review;
  if (!review || typeof review !== 'object' || !roleOf(review.role)) return null;
  const text = clean(post.content, MAX_CONTENT);
  if (!text) return null;
  const recorded = review.recorded === true;
  return {
    id: post.id,
    role: review.role,
    text,
    next: clean(review.next, MAX_NEXT),
    scores: cleanScores(review.scores),
    by: recorded ? clean(review.by, MAX_NAME) : '',
    recorded,
    poster: firstName(post.userName),
    time: utcTime(post.timestamp),
  };
}

/* ── Summary ─────────────────────────────────────────────────────────── */

const latestOf = (reviews) => reviews.reduce((latest, review) => (
  review.time !== null && (latest === null || review.time > latest) ? review.time : latest
), null);

// How many reviews each of the page's roles has, and each question's average
// over the reviews that answered it.
export function summarize(reviews, roles) {
  const averages = {};
  SCORES.forEach(({ key }) => {
    const values = reviews.map((review) => review.scores[key]).filter((value) => value !== undefined);
    averages[key] = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
  });
  return {
    count: reviews.length,
    latest: latestOf(reviews),
    roles: roles.map((role) => {
      const theirs = reviews.filter((review) => review.role === role.key);
      return { ...role, count: theirs.length, latest: latestOf(theirs) };
    }),
    averages,
  };
}

/* ── Writing a review ────────────────────────────────────────────────── */

// The microblog post for a review. topicPath is the page's permalink, the
// same key the Microblog panel posts with. own is the poster's own role
// (ownRole); a review in any other role always says someone typed it in, so
// a student can't post what reads as a mentor's or a teacher's review.
export function buildPost({ text, next, role, own, scores, by, recorded, topicPath }) {
  const content = String(text || '').trim();
  if (!content) throw new ReviewError('empty', 'Write what stood out before posting.');
  if (content.length > MAX_CONTENT) throw new ReviewError('long', `Keep the review to ${MAX_CONTENT} characters.`);
  if (!roleOf(role)) throw new ReviewError('role', 'Choose who the review is from.');
  const review = { role, scores: cleanScores(scores) };
  const ask = clean(next, MAX_NEXT);
  if (ask) review.next = ask;
  if (recorded || role !== own) {
    const name = clean(by, MAX_NAME);
    if (name) review.by = name;
    review.recorded = true;
  }
  return { content, topicPath, data: { review } };
}

/* ── Turning a review into an issue ──────────────────────────────────── */

const REPO = /^[A-Za-z0-9-]+\/[A-Za-z0-9._-]+$/;

// GitHub's projects= parameter takes an organization's board as "org/number".
function projectOf(board) {
  const ref = parseBoardUrl(board || '');
  if (!ref || ref.personal) return '';
  const [, owner, , number] = ref.apiPath.split('/');   // orgs/<owner>/projectsV2/<number>
  return `${owner}/${number}`;
}

function issueTitle(review) {
  if (review.next) return review.next;
  const sentence = review.text.split(/(?<=[.!?])\s/)[0];
  return sentence.length > 70 ? `${sentence.slice(0, 69)}…` : sentence;
}

// GitHub's new-issue form, filled in from a review. Issues are public, so the
// body names the reviewer's role and not the reviewer.
export function issueLink({ repo, board, pageUrl, review }) {
  if (!REPO.test(String(repo || ''))) return '';
  const scores = SCORES.filter(({ key }) => review.scores[key] !== undefined)
    .map(({ key, label }) => `${label.toLowerCase()} ${review.scores[key]}`);
  const body = [
    `From a ${roleOf(review.role).label.toLowerCase()} review on ${pageUrl}#reviews`,
    '',
    review.text.split('\n').map((line) => `> ${line}`).join('\n'),
    '',
    review.next ? `Asked for next: ${review.next}` : null,
    scores.length ? `Scores, 1 to 5: ${scores.join(', ')}` : null,
  ].filter((line) => line !== null).join('\n');
  const query = new URLSearchParams({ title: issueTitle(review), body });
  const project = projectOf(board);
  if (project) query.set('projects', project);
  return `https://github.com/${repo}/issues/new?${query}`;
}

/* ── Loading ─────────────────────────────────────────────────────────── */

async function request(url, fetchImpl, fetchOptions) {
  try {
    return await fetchImpl(url, fetchOptions);
  } catch (err) {
    throw new ReviewError('network', `The backend didn't answer: ${err.message}`);
  }
}

function expectOk(response) {
  if (response.status === 401 || response.status === 403) {
    throw new ReviewError('auth', 'Sign in to see the reviews on this page.');
  }
  if (!response.ok) throw new ReviewError('network', `The backend answered ${response.status}.`);
  return response.json();
}

// Who is reading (signed in, signed out, or waiting for a teacher to verify
// their account) and the page's reviews, newest first.
export async function loadReviews({ api, topicPath, fetchImpl = fetch, fetchOptions = {} }) {
  const path = encodeURIComponent(topicPath);
  let viewer = { state: 'signed-out', name: '', role: '' };
  const me = await request(`${api}/api/id`, fetchImpl, fetchOptions);
  if (me.ok) {
    const account = await me.json();
    viewer = { state: 'signed-in', name: firstName(account.name), role: account.role || '' };
  } else if (me.status === 403) {
    viewer = { ...viewer, state: 'pending' };
  } else if (me.status !== 401) {
    throw new ReviewError('network', `The backend answered ${me.status}.`);
  }

  let posts;
  if (viewer.state === 'signed-in') {
    posts = (await expectOk(await request(`${api}/api/microblog?pagePath=${path}`, fetchImpl, fetchOptions))).microblogs;
  } else {
    // A page gets its topic with its first post, so no topic means no reviews yet.
    const topic = await request(`${api}/api/microblog/topics?pagePath=${path}`, fetchImpl, fetchOptions);
    if (topic.status === 404) {
      posts = [];
    } else {
      const { pageKey } = await expectOk(topic);
      const page = await request(`${api}/api/microblog/page/${encodeURIComponent(pageKey)}?limit=${PAGE_LIMIT}`, fetchImpl, fetchOptions);
      posts = (await expectOk(page)).microblogs;
    }
  }
  return { viewer, reviews: (posts || []).map(reviewFromPost).filter(Boolean) };
}

/* ── Drawing ─────────────────────────────────────────────────────────── */

let nextFieldId = 0;   // form controls need ids that are unique on the page

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

const pill = (tone, text) => el('span', `ocs__status-pill ocs__status-pill--${tone}`, text);
const shortDay = (time) => new Date(time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

function setStatus(section, text) {
  const status = section.querySelector('[data-hook="status"]');
  status.textContent = text;
  status.hidden = !text;
}

// A row of pill buttons where the chosen one is filled with the accent, the
// way the kanban's team filter is.
function choiceButton(label, on, onClick) {
  const button = el('button', `ocs__btn small pill${on ? ' accent fill' : ''}`, label);
  button.type = 'button';
  button.setAttribute('aria-pressed', String(on));
  button.addEventListener('click', onClick);
  return button;
}

function markChoice(button, on) {
  button.classList.toggle('accent', on);
  button.classList.toggle('fill', on);
  button.setAttribute('aria-pressed', String(on));
}

function cardView(section, { viewer, reviews, post }) {
  const mount = section.querySelector('[data-hook="mount"]');
  const roles = pickRoles(section.dataset.roles);
  const issues = section.dataset.issues || '';
  const board = section.dataset.boardUrl || '';
  const pageUrl = `${window.location.origin}${window.location.pathname}`;
  const state = { reviews, filter: 'all' };

  const summaryArea = el('div', 'ocs__keypoints');
  const listArea = el('div', 'ocs__keypoints');
  const formArea = el('div', 'ocs__keypoints');

  function renderSummary() {
    const summary = summarize(state.reviews, roles);
    section.querySelector('[data-hook="meta"]').textContent = summary.count
      ? `${summary.count} review${summary.count === 1 ? '' : 's'}${summary.latest === null ? '' : ` · latest ${shortDay(summary.latest)}`}`
      : 'No reviews yet';

    const who = el('ul', 'ocs__checklist');
    summary.roles.forEach((role) => {
      const item = el('li');
      const mark = role.count ? el('span', 'ocs__check', '✓') : el('span', 'ocs__checklist-box');
      mark.setAttribute('aria-hidden', 'true');
      const text = el('span');
      const count = role.count
        ? ` · ${role.count}${role.latest === null ? '' : `, latest ${shortDay(role.latest)}`}`
        : ' · none yet';
      text.append(el('strong', '', role.list), count);
      item.append(mark, text);
      who.appendChild(item);
    });

    const stats = el('div', 'ocs__stats');
    SCORES.forEach(({ key, label }) => {
      const stat = el('div', 'ocs__stat');
      const average = summary.averages[key];
      stat.append(el('span', 'ocs__stat-value', average === null ? '–' : average.toFixed(1)), el('span', 'ocs__stat-label', label));
      stats.appendChild(stat);
    });

    // Plain columns: ocs__split stretches them to the taller one, and a grid
    // inside would spread its rows down that height.
    const whoColumn = el('div');
    whoColumn.append(el('span', 'ocs__label', 'Who has reviewed'), who);
    const scoreColumn = el('div');
    scoreColumn.append(el('span', 'ocs__label', 'Average score, 1 to 5'), stats);
    const split = el('div', 'ocs__split');
    split.append(whoColumn, scoreColumn);
    summaryArea.replaceChildren(split);
  }

  function reviewItem(review) {
    const item = el('div', 'ocs__grid-cell');
    item.setAttribute('role', 'listitem');
    const body = el('div', 'ocs__keypoints');
    const role = roleOf(review.role);

    const tags = el('div', 'ocs__links');
    tags.appendChild(pill(review.role === 'community' ? 'neutral' : 'good', role.label));
    body.appendChild(tags);

    body.appendChild(el('span', '', review.text));
    if (review.next) {
      const next = el('span');
      next.append(el('strong', '', 'Next:'), ` ${review.next}`);
      body.appendChild(next);
    }
    // Each score stays on one line; the line breaks only between scores.
    const scores = SCORES.filter(({ key }) => review.scores[key] !== undefined)
      .map(({ key, short }) => `${short} ${review.scores[key]}`.replace(/ /g, ' '));
    if (scores.length) body.appendChild(el('span', 'ocs__text', scores.join(' · ')));
    const who = review.recorded ? `${review.by || role.someone} · typed in by ${review.poster}` : review.poster;
    body.appendChild(el('span', 'ocs__text', review.time === null ? who : `${who} · ${shortDay(review.time)}`));

    const link = viewer.state === 'signed-in' ? issueLink({ repo: issues, board, pageUrl, review }) : '';
    if (link) {
      const actions = el('div', 'ocs__links');
      const turn = el('a', 'ocs__btn small pill', 'Turn into issue');
      turn.href = link;
      turn.target = '_blank';
      turn.rel = 'noopener';
      actions.appendChild(turn);
      body.appendChild(actions);
    }
    item.appendChild(body);
    return item;
  }

  function renderList(focusFilter) {
    const parts = [el('span', 'ocs__label', 'What reviewers said')];
    if (!state.reviews.length) {
      parts.push(el('div', 'ocs__text', 'No reviews yet. Send this page’s review link to your mentors, and bring it to N@tM.'));
      listArea.replaceChildren(...parts);
      return;
    }
    const present = ROLES.filter((role) => state.reviews.some((review) => review.role === role.key));
    if (state.filter !== 'all' && !present.some((role) => role.key === state.filter)) state.filter = 'all';
    if (present.length >= 2) {
      const filters = el('div', 'ocs__links');
      filters.setAttribute('role', 'group');
      filters.setAttribute('aria-label', 'Show reviews from');
      [['all', 'All', state.reviews.length], ...present.map((role) => [role.key, role.label, state.reviews.filter((review) => review.role === role.key).length])]
        .forEach(([value, label, count]) => {
          const button = choiceButton(`${label} (${count})`, state.filter === value, () => {
            state.filter = value;
            renderList(value);
          });
          button.dataset.filter = value;
          filters.appendChild(button);
        });
      parts.push(filters);
    }
    // A card grid, one column on a phone. The class order keeps the attribute
    // from ending in "-card", which a capstone's *-infograph include restyles
    // (_sass/capstone/infograph.scss).
    const list = el('div', 'ocs__grid--card ocs__grid');
    list.setAttribute('role', 'list');
    state.reviews
      .filter((review) => state.filter === 'all' || review.role === state.filter)
      .forEach((review) => list.appendChild(reviewItem(review)));
    parts.push(list);
    listArea.replaceChildren(...parts);
    if (focusFilter) listArea.querySelector(`[data-filter="${focusFilter}"]`)?.focus();
  }

  // The form is drawn once, so what someone is typing survives new reviews
  // and filter clicks; its buttons change state in place.
  function renderForm() {
    const heading = el('span', 'ocs__label', 'Leave a review');
    if (viewer.state !== 'signed-in') {
      const note = el('div', 'ocs__callout ocs__keypoints');
      if (viewer.state === 'pending') {
        note.appendChild(el('span', '', 'Your account is waiting for a teacher to verify it. Once it is verified you can post reviews here. Until then, a team member can type yours in.'));
      } else {
        note.appendChild(el('span', '', 'Reviews are posted from an OCS account, so each one shows who wrote it. Mentors and teachers can sign in to post. At N@tM, leave your review at the team’s booth, and a team member will type it in with you.'));
        const actions = el('div', 'ocs__links');
        const signIn = el('a', 'ocs__btn small pill accent fill', 'Sign in');
        signIn.href = section.dataset.loginUrl;
        actions.appendChild(signIn);
        note.appendChild(actions);
      }
      formArea.replaceChildren(heading, note);
      return;
    }

    const id = (name) => `ocs-review-${name}-${nextFieldId}`;
    nextFieldId += 1;
    const own = ownRole(viewer.role);
    const pickable = roles.map((role) => role.key);
    const draft = {
      role: pickable.includes(own) ? own : (pickable.includes('community') ? 'community' : pickable[0]),
      scores: {},
      recordedTouched: false,
    };

    const form = el('form', 'ocs__keypoints');
    form.noValidate = true;
    form.appendChild(el('span', 'ocs__text', `Signed in as ${viewer.name || 'you'}.`));

    // Who the review is from
    const roleRow = el('div', 'ocs__keypoints');
    const roleLabel = el('span', 'ocs__label', 'Who is the review from?');
    roleLabel.id = id('role');
    const roleButtons = el('div', 'ocs__links');
    roleButtons.setAttribute('role', 'group');
    roleButtons.setAttribute('aria-labelledby', roleLabel.id);
    roles.forEach((role) => {
      const button = choiceButton(role.label, draft.role === role.key, () => {
        draft.role = role.key;
        roleButtons.querySelectorAll('button').forEach((b) => markChoice(b, b === button));
        syncRecorded();
      });
      roleButtons.appendChild(button);
    });
    roleRow.append(roleLabel, roleButtons);
    form.appendChild(roleRow);

    // The three scores
    form.appendChild(el('span', 'ocs__text', 'Scores are optional. 1 is not there yet, 5 is ready to use.'));
    SCORES.forEach(({ key, label }) => {
      const row = el('div', 'ocs__keypoints');
      const rowLabel = el('span', 'ocs__label', label);
      rowLabel.id = id(`score-${key}`);
      const buttons = el('div', 'ocs__links');
      buttons.setAttribute('role', 'group');
      buttons.setAttribute('aria-labelledby', rowLabel.id);
      [1, 2, 3, 4, 5].forEach((n) => {
        const button = choiceButton(String(n), false, () => {
          draft.scores[key] = draft.scores[key] === n ? undefined : n;
          buttons.querySelectorAll('button').forEach((b, i) => markChoice(b, draft.scores[key] === i + 1));
        });
        button.setAttribute('aria-label', `${label}: ${n}`);
        buttons.appendChild(button);
      });
      row.append(rowLabel, buttons);
      form.appendChild(row);
    });

    // What stood out, and what to do next
    const textRow = el('div', 'ocs__keypoints');
    const textLabel = el('label', 'ocs__label', 'What stood out?');
    // cols and size of 1 leave the width to the grid, so the fields fill the
    // card and never push a phone-width card wider.
    const text = el('textarea', 'ocs__input');
    text.id = id('text');
    textLabel.htmlFor = text.id;
    text.rows = 3;
    text.cols = 1;
    text.maxLength = MAX_CONTENT;
    text.placeholder = 'What worked, what was confusing, what you would use';
    const counter = el('span', 'ocs__text', `0 / ${MAX_CONTENT}`);
    text.addEventListener('input', () => { counter.textContent = `${text.value.length} / ${MAX_CONTENT}`; });
    textRow.append(textLabel, text, counter);

    const nextRow = el('div', 'ocs__keypoints');
    const nextLabel = el('label', 'ocs__label', 'What should they build or fix next? ');
    nextLabel.appendChild(el('span', 'ocs__text', '(optional)'));
    const next = el('input', 'ocs__input');
    next.type = 'text';
    next.size = 1;
    next.id = id('next');
    nextLabel.htmlFor = next.id;
    next.maxLength = MAX_NEXT;
    next.placeholder = 'One thing, in a few words';
    nextRow.append(nextLabel, next);
    form.append(textRow, nextRow);

    // Typing a review in for someone else
    const toggle = el('label', 'ocs__toggle');
    const recorded = el('input', 'ocs__toggle-input');
    recorded.type = 'checkbox';
    recorded.id = id('recorded');
    const track = el('span', 'ocs__toggle-track');
    track.setAttribute('aria-hidden', 'true');
    toggle.append(recorded, track, el('span', 'ocs__toggle-label', 'I’m typing this in for someone else, at the booth or after a meeting'));
    const nameWrap = el('div');
    const nameRow = el('div', 'ocs__keypoints');
    const nameLabel = el('label', 'ocs__label', 'Their first name ');
    nameLabel.appendChild(el('span', 'ocs__text', '(optional, shows on this page)'));
    const name = el('input', 'ocs__input');
    name.type = 'text';
    name.size = 1;
    name.id = id('name');
    nameLabel.htmlFor = name.id;
    name.maxLength = MAX_NAME;
    name.autocomplete = 'off';
    nameRow.append(nameLabel, name);
    nameWrap.appendChild(nameRow);
    function setRecorded(on) {
      recorded.checked = on;
      nameWrap.hidden = !on;
    }
    // A review in a role that isn't the account's own always says who typed
    // it in (buildPost holds to that too), so the toggle is held on for it.
    const lockedWrap = el('div');
    lockedWrap.appendChild(el('span', 'ocs__text', 'Only mentor and teacher accounts post in their own name, so this review will say you typed it in.'));
    function syncRecorded() {
      const required = draft.role !== own;
      recorded.disabled = required;
      lockedWrap.hidden = !required;
      if (required) setRecorded(true);
      else if (!draft.recordedTouched) setRecorded(false);
    }
    recorded.addEventListener('change', () => {
      draft.recordedTouched = true;
      setRecorded(recorded.checked);
    });
    syncRecorded();
    form.append(toggle, lockedWrap, nameWrap);

    // Posting
    const actions = el('div', 'ocs__links');
    const submit = el('button', 'ocs__btn accent fill', 'Post review');
    submit.type = 'submit';
    const status = el('span', 'ocs__text');
    status.setAttribute('role', 'status');
    actions.append(submit, status);
    form.appendChild(actions);

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (submit.disabled) return;
      let payload;
      try {
        payload = buildPost({
          text: text.value, next: next.value, role: draft.role, own, scores: draft.scores,
          by: name.value, recorded: recorded.checked, topicPath: section.dataset.topicPath,
        });
      } catch (err) {
        status.textContent = err.message;
        if (err.kind === 'empty' || err.kind === 'long') text.focus();
        return;
      }
      submit.disabled = true;
      submit.textContent = 'Posting…';
      status.textContent = '';
      try {
        const created = reviewFromPost(await post(payload));
        if (created) state.reviews.unshift(created);
        renderSummary();
        renderList();
        // Clear the review but keep the role and the toggle, so the next
        // visitor at the booth starts from the same setup.
        text.value = '';
        next.value = '';
        name.value = '';
        counter.textContent = `0 / ${MAX_CONTENT}`;
        draft.scores = {};
        form.querySelectorAll('[aria-label*=": "]').forEach((b) => markChoice(b, false));
        status.textContent = 'Posted. The Microblog panel lists it too after the page reloads.';
      } catch (err) {
        status.textContent = `The review didn't post: ${err.message}`;
      } finally {
        submit.disabled = false;
        submit.textContent = 'Post review';
      }
    });

    formArea.replaceChildren(heading, form);
  }

  renderSummary();
  renderList();
  renderForm();
  const body = el('div', 'ocs__keypoints');
  body.append(summaryArea, listArea, formArea);
  mount.replaceChildren(body);
  mount.hidden = false;
}

/* ── Mounting ────────────────────────────────────────────────────────── */

async function copyLink(section) {
  const link = `${window.location.origin}${window.location.pathname}#${section.id}`;
  try {
    await navigator.clipboard.writeText(link);
    setStatus(section, `Copied ${link}. Send it to your mentors, or show it at the booth.`);
  } catch (_) {
    setStatus(section, `Copy this link: ${link}`);
  }
}

async function mountCard(section) {
  section.querySelector('[data-hook="copy"]').addEventListener('click', () => copyLink(section));
  setStatus(section, 'Loading reviews…');
  try {
    // config.js goes through Jekyll, so it is loaded here rather than imported
    // at the top, where the tests would trip over its front matter.
    const { pythonURI, fetchOptions } = await import('./api/config.js');
    const { createPost } = await import('./api/microblog.js');
    const { viewer, reviews } = await loadReviews({ api: pythonURI, topicPath: section.dataset.topicPath, fetchOptions });
    setStatus(section, '');
    cardView(section, { viewer, reviews, post: createPost });
  } catch (err) {
    if (!(err instanceof ReviewError)) console.error('Review card: could not draw the reviews', err);
    setStatus(section, err.kind === 'auth'
      ? 'Sign in to see the reviews on this page.'
      : "The reviews didn't load. The backend may be down, so try again later.");
  }
}

// Each card loads when it comes within 400px of the screen, like the kanban.
function mountWhenNear(section) {
  if (section.dataset.mounted) return;
  section.dataset.mounted = 'true';
  const start = () => mountCard(section).catch((err) => console.error('Review card: load failed', err));
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
  const mountAll = () => document.querySelectorAll('[data-ocs-review]').forEach(mountWhenNear);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountAll);
  else mountAll();
}
