// Sprint Reflection and Growth Over Time, the first two tabs of the Retrospective page (/retrospective).
//
// Sprints come from the school calendar (_data/school_calendar.yml, embedded by the layout): when a
// teacher opens the page, any calendar sprint that is missing or whose dates moved is saved to
// Spring. Teachers and admins can also add, edit and delete sprints by hand under Manage sprints.
// For each sprint a student ranks the Ground 0 evaluation items
// (T01-T12 technical, P01-P10 professional, 0 = not entered, 1-5), writes a summary per section,
// and answers the retrospective questions. The teacher adds their own rank and a comment beside
// every item, and the student sees both. The reflection reads as numbered steps with a progress
// line each. Growth Over Time charts each item across the year's sprints. Everything is stored in
// Spring (/api/sprint-retros); the items come from SprintRetroTemplate there, so this file only
// relies on their ids.
import { javaURI, fetchOptions } from '../api/config.js';

const api = `${javaURI}/api/sprint-retros`;
const SPRINT_KEY = 'sprint-retro:sprint';
const COLORS = ['#60a5fa', '#34d399', '#f59e0b', '#f472b6', '#a78bfa', '#22d3ee', '#f87171', '#a3e635'];
// Answers shown side by side in "Your words over time".
const STORY_KEYS = ['techRetro', 'proRetro', 'techGoal', 'commitBehavior'];

class SignedOut extends Error {}

const shared = { loaded: null, template: null, sprints: [], canManage: false, calendarNames: new Set() };
const ref = { root: null, sprintId: null, mode: 'mine', studentId: null, roster: [], view: null, dirty: false, editingId: null };
const growth = { root: null, personId: null, progress: null, chart: null, viewKey: 'sections', perspective: 'self' };

// ---------- shared ----------

async function call(path, options = {}) {
    const res = await fetch(`${api}${path}`, { ...fetchOptions, cache: 'no-store', ...options });
    if (res.status === 401) throw new SignedOut();
    if (!res.ok) {
        let message = '';
        try { message = (await res.json()).error || ''; } catch { /* not JSON */ }
        throw new Error(message || (res.status === 403 ? 'Only teachers can do this.' : `Request failed (${res.status})`));
    }
    return res.status === 204 ? null : res.json();
}

/**
 * The sprints in the school calendar: each starts the Monday of its "Sprint N Start" week and ends
 * the Friday of its "Sprint N Retrospective" week. weeks is the calendar file's weeks map.
 */
export function calendarSprints(weeks) {
    const found = new Map();
    Object.keys(weeks || {}).map(Number).sort((a, b) => a - b).forEach((number) => {
        const week = weeks[number];
        const match = /Sprint (\d+) (Start|Retrospective)/.exec(week.notes || '');
        if (!match) return;
        const name = `Sprint ${match[1]}`;
        const sprint = found.get(name) || { name };
        if (match[2] === 'Start') sprint.startDate = week.monday;
        else sprint.endDate = week.friday;
        found.set(name, sprint);
    });
    return [...found.values()].filter((sprint) => sprint.startDate && sprint.endDate);
}

function readCalendar() {
    const element = document.getElementById('retro-school-calendar');
    try {
        return calendarSprints(element ? JSON.parse(element.textContent) : {});
    } catch (e) {
        console.warn('Could not read the school calendar:', e);
        return [];
    }
}

/**
 * A teacher's visit saves any calendar sprint that is missing or whose dates moved. Spring matches
 * by name and never deletes, so sprints added by hand are kept. Returns every stored sprint.
 */
async function syncedSprints(stored, calendar) {
    const inStep = calendar.every((entry) => stored.some((s) => s.name === entry.name
        && s.startDate === entry.startDate && s.endDate === entry.endDate));
    if (inStep) return stored;
    try {
        return await call('/calendar', { method: 'PUT', body: JSON.stringify({ sprints: calendar }) });
    } catch (e) {
        console.warn('Could not update the sprints from the calendar:', e);
        return stored;
    }
}

/** Loads the template and sprint list once per page, or again when force is true. */
async function loadShared(force = false) {
    if (!shared.loaded || force) {
        shared.loaded = Promise.all([call('/template'), call('')]).then(async ([template, list]) => {
            const calendar = readCalendar();
            shared.template = template;
            shared.canManage = list.canManage;
            shared.calendarNames = new Set(calendar.map((entry) => entry.name));
            shared.sprints = list.canManage && calendar.length ? await syncedSprints(list.sprints, calendar) : list.sprints;
        });
        shared.loaded.catch(() => { shared.loaded = null; });
    }
    return shared.loaded;
}

function sections() {
    return shared.template.evaluations.flatMap((evaluation) => evaluation.sections.map((section) => ({ ...section, evaluation })));
}

function itemsById() {
    const map = {};
    sections().forEach((section) => section.items.forEach((item) => { map[item.id] = { ...item, section }; }));
    return map;
}

function prompts() {
    return Object.fromEntries(shared.template.evaluations.flatMap((e) => e.prompts.map((p) => [p.key, p.label])));
}

function readStore(key) {
    try { return localStorage.getItem(key); } catch { return null; }
}

function writeStore(key, value) {
    try { localStorage.setItem(key, value); } catch { /* storage unavailable */ }
}

/** The remembered sprint if it still exists, else the latest one that has started, else the first. */
function defaultSprintId() {
    const remembered = Number(readStore(SPRINT_KEY));
    if (shared.sprints.some((s) => s.id === remembered)) return remembered;
    const today = new Date().toISOString().slice(0, 10);
    const started = shared.sprints.filter((s) => s.startDate <= today);
    const pick = started.length ? started[started.length - 1] : shared.sprints[0];
    return pick ? pick.id : null;
}

function sprintDates(sprint) {
    const fmtDay = (d) => new Date(`${d}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    return sprint.endDate ? `${fmtDay(sprint.startDate)} – ${fmtDay(sprint.endDate)}` : `from ${fmtDay(sprint.startDate)}`;
}

function fmtWhen(value) {
    if (!value) return '';
    return new Date(value).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function escapeHtml(text) {
    return String(text ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function signedOutMessage(status, body) {
    status.textContent = 'Sign in to reflect on your sprints and see your growth.';
    status.hidden = false;
    body.hidden = true;
}

// ---------- Sprint Reflection ----------

/** Renders the Sprint Reflection tab into root. */
export async function initSprintReflection(root) {
    if (!root) return;
    injectStyles();
    ref.root = root;
    root.innerHTML = `
      <section class="sr">
        <header>
          <h2 class="sr-title">Sprint Reflection</h2>
          <p class="sr-muted">Rank yourself on each item, write about the evidence behind your ranks, and compare them with your teacher's. 0 means not entered yet.</p>
        </header>
        <p class="sr-muted" data-sr="status">Loading…</p>
        <div class="sr-stack" data-sr="body" hidden>
          <details class="sr-card" data-sr="manage" hidden>
            <summary class="sr-summary">Manage sprints <span class="sr-muted sr-small">(teachers)</span></summary>
            <div data-sr="manage-list"></div>
            <form class="sr-manage-form" data-sr="manage-form">
              <label class="sr-field"><span class="sr-label">Name</span><input class="sr-input" name="sprintName" maxlength="100" placeholder="Sprint 3" required></label>
              <label class="sr-field"><span class="sr-label">Start</span><input class="sr-input sr-input--date" type="date" name="startDate" required></label>
              <label class="sr-field"><span class="sr-label">End (optional)</span><input class="sr-input sr-input--date" type="date" name="endDate"></label>
              <div class="sr-row">
                <button type="submit" class="sr-btn" data-sr="manage-submit">Add sprint</button>
                <button type="button" class="sr-btn sr-btn--ghost" data-sr="manage-cancel" hidden>Cancel</button>
              </div>
              <p class="sr-small" data-sr="manage-status" role="status"></p>
            </form>
            <p class="sr-muted sr-small">Every sprint uses the Ground 0 items, so students can compare their ranks across the year. A sprint students have reflected on cannot be deleted. Sprints marked School calendar are added from the school calendar each time a teacher opens this page, and their dates follow it; add a sprint by hand for anything the calendar does not list.</p>
          </details>
          <div class="sr-card sr-bar">
            <label class="sr-field"><span class="sr-label">Sprint</span><select class="sr-input" data-sr="sprint"></select></label>
            <label class="sr-field" data-sr="student-wrap" hidden><span class="sr-label">Student</span><select class="sr-input" data-sr="student"></select></label>
            <p class="sr-muted sr-small" data-sr="sprint-meta"></p>
          </div>
          <div class="sr-card" data-sr="no-sprints" hidden>
            <p class="sr-muted" data-sr="no-sprints-text"></p>
          </div>
          <form class="sr-stack" data-sr="form" novalidate></form>
        </div>
      </section>`;
    bindReflection();
    try {
        await loadShared();
    } catch (e) {
        const status = root.querySelector('[data-sr="status"]');
        if (e instanceof SignedOut) return signedOutMessage(status, root.querySelector('[data-sr="body"]'));
        status.textContent = `Could not load sprint reflections: ${e.message}`;
        return;
    }
    root.querySelector('[data-sr="status"]').hidden = true;
    root.querySelector('[data-sr="body"]').hidden = false;
    // Teachers and admins only review students; students fill in their own reflection.
    ref.mode = shared.canManage ? 'review' : 'mine';
    root.querySelector('[data-sr="student-wrap"]').hidden = !shared.canManage;
    root.querySelector('[data-sr="manage"]').hidden = !shared.canManage;
    ref.sprintId = defaultSprintId();
    renderSprintSelect();
    renderManageList();
    await loadReflection();
}

function renderSprintSelect() {
    const select = ref.root.querySelector('[data-sr="sprint"]');
    select.innerHTML = shared.sprints.map((s) => `<option value="${s.id}">${escapeHtml(s.name)}</option>`).join('');
    select.disabled = !shared.sprints.length;
    if (ref.sprintId) select.value = String(ref.sprintId);
    const sprint = shared.sprints.find((s) => s.id === ref.sprintId);
    ref.root.querySelector('[data-sr="sprint-meta"]').textContent = sprint ? sprintDates(sprint) : '';
    const none = ref.root.querySelector('[data-sr="no-sprints"]');
    none.hidden = shared.sprints.length > 0;
    ref.root.querySelector('[data-sr="no-sprints-text"]').textContent = shared.canManage
        ? 'No sprints yet. Add one under Manage sprints and your students will see it here.'
        : 'Your teacher has not opened a sprint for reflection yet. Check back soon.';
}

async function loadReflection() {
    const form = ref.root.querySelector('[data-sr="form"]');
    ref.dirty = false;
    if (!ref.sprintId) {
        form.innerHTML = '';
        return;
    }
    form.innerHTML = '<p class="sr-muted">Loading…</p>';
    try {
        if (ref.mode === 'review') {
            await loadRoster();
            if (!ref.studentId) {
                form.innerHTML = '<p class="sr-muted">No students to review yet.</p>';
                return;
            }
            ref.view = await call(`/${ref.sprintId}/reflections/${ref.studentId}`);
        } else {
            ref.view = await call(`/${ref.sprintId}/reflection`);
        }
        renderForm();
    } catch (e) {
        form.innerHTML = `<p class="sr-warn">${escapeHtml(e instanceof SignedOut ? 'Sign in again to continue.' : e.message)}</p>`;
    }
}

async function loadRoster() {
    ref.roster = await call(`/${ref.sprintId}/reflections`);
    if (!ref.roster.some((r) => r.personId === ref.studentId)) {
        ref.studentId = ref.roster.length ? ref.roster[0].personId : null;
    }
    const select = ref.root.querySelector('[data-sr="student"]');
    select.innerHTML = ref.roster.map((r) => {
        const mark = r.reviewed ? '✓ reviewed' : r.submitted ? `submitted · ${r.ranked} ranked` : 'not started';
        return `<option value="${r.personId}">${escapeHtml(r.name || r.uid)} (${mark})</option>`;
    }).join('');
    if (ref.studentId) select.value = String(ref.studentId);
}

function renderForm() {
    const view = ref.view;
    const review = ref.mode === 'review';
    const student = view.student;
    const teacher = view.teacher;
    const form = ref.root.querySelector('[data-sr="form"]');
    const ranked = Object.keys(student.ranks).length;
    const totalItems = sections().reduce((n, s) => n + s.items.length, 0);
    // The teacher's columns stay out of a student's way until there is feedback to put in them.
    const showTeacher = review || Boolean(view.teacherUpdatedAt);
    const steps = shared.template.evaluations.map((evaluation) => ({ id: `eval-${evaluation.key}`, title: evaluation.title }));
    const stepHead = (id, title) => `<div class="sr-step"><span class="sr-step-num">${steps.findIndex((step) => step.id === id) + 1}</span><h3 class="sr-h3">${title}</h3></div>`;

    const who = review ? escapeHtml(view.personName || 'This student') : 'You';
    const savedLine = view.updatedAt ? `${who} saved ${fmtWhen(view.updatedAt)} · ${ranked} of ${totalItems} ranked` : `${who} ${review ? 'has' : 'have'} not saved this reflection yet`;
    const feedbackLine = view.teacherUpdatedAt
        ? `Teacher feedback from ${escapeHtml(view.teacherName || 'your teacher')} · ${fmtWhen(view.teacherUpdatedAt)}`
        : 'No teacher feedback yet';

    form.innerHTML = `
      <div class="sr-card sr-status-card">
        <div><span class="sr-label">${review ? 'Student' : 'Your reflection'}</span><span>${savedLine}</span></div>
        <div><span class="sr-label">Teacher</span><span>${feedbackLine}</span></div>
      </div>
      <nav class="sr-steps" aria-label="Parts of this reflection">
        ${steps.map((step, i) => `
          <button type="button" class="sr-stepchip" data-jump="sr-step-${step.id}">
            <span class="sr-step-num">${i + 1}</span>
            <span class="sr-stepchip-text"><span class="sr-stepchip-title">${escapeHtml(step.title)}</span><span class="sr-small sr-muted" data-step-status="${step.id}"></span></span>
          </button>`).join('')}
      </nav>
      ${!review && teacher.overall ? `
        <div class="sr-card sr-card--teacher">
          <span class="sr-label">Overall comment from your teacher</span>
          <p class="sr-quote">${escapeHtml(teacher.overall)}</p>
        </div>` : ''}
      ${shared.template.evaluations.map((evaluation) => evaluationCard(evaluation, student, teacher, review, showTeacher, stepHead)).join('')}
      ${review ? `
        <div class="sr-card sr-card--teacher">
          <label class="sr-field"><span class="sr-label">Overall comment for ${escapeHtml(view.personName || 'the student')}</span>
            <textarea class="sr-input" rows="3" maxlength="2000" data-overall>${escapeHtml(teacher.overall || '')}</textarea></label>
        </div>` : ''}
      <div class="sr-savebar">
        <button type="submit" class="sr-btn">${review ? 'Save feedback' : 'Save reflection'}</button>
        <span class="sr-small" data-sr="save-status" role="status"></span>
      </div>`;
    updateProgress();
}

/** Recounts what is ranked and written, for the step guide and each section. */
function updateProgress() {
    const form = ref.root.querySelector('[data-sr="form"]');
    const review = ref.mode === 'review';
    const rankSelector = review ? '[data-trank]' : '[data-rank]';
    const filled = (elements) => elements.filter((el) => Number(el.value)).length;
    const setStatus = (id, text, done) => {
        const status = form.querySelector(`[data-step-status="${id}"]`);
        if (!status) return;
        status.textContent = text;
        status.closest('.sr-stepchip').toggleAttribute('data-done', done);
    };
    form.querySelectorAll('[data-eval]').forEach((card) => {
        card.querySelectorAll('[data-section]').forEach((section) => {
            const ranks = [...section.querySelectorAll(rankSelector)];
            const count = section.querySelector('[data-section-count]');
            count.textContent = `${filled(ranks)} of ${ranks.length} ranked`;
            count.toggleAttribute('data-done', filled(ranks) === ranks.length);
        });
        const ranks = [...card.querySelectorAll(rankSelector)];
        const texts = [...card.querySelectorAll('[data-text]')];
        const written = texts.filter((el) => el.value.trim()).length;
        setStatus(`eval-${card.dataset.eval}`, review
            ? `${filled(ranks)} of ${ranks.length} ranked by you`
            : `${filled(ranks)} of ${ranks.length} ranked · ${written} of ${texts.length} written`,
        filled(ranks) === ranks.length && written === texts.length);
    });
}

function evaluationCard(evaluation, student, teacher, review, showTeacher, stepHead) {
    const levels = Object.fromEntries(evaluation.levels.map((l) => [l.rank, l.name]));
    const rankOptions = (selected) => [0, ...evaluation.levels.map((l) => l.rank)]
        .map((r) => `<option value="${r}" ${r === (selected || 0) ? 'selected' : ''}>${r === 0 ? '0 · not entered' : `${r} · ${escapeHtml(levels[r])}`}</option>`).join('');
    const rankText = (r) => (r ? `${r} · ${escapeHtml(levels[r])}` : '<span class="sr-muted">—</span>');
    return `
      <div class="sr-card" id="sr-step-eval-${evaluation.key}" data-eval="${evaluation.key}">
        ${stepHead(`eval-${evaluation.key}`, escapeHtml(evaluation.title))}
        <span class="sr-part">Rank each area</span>
        ${showTeacher ? '' : '<p class="sr-muted sr-small">Your teacher\'s rank and comments will appear beside yours once they review this sprint.</p>'}
        <details class="sr-levels">
          <summary class="sr-small">What the ranks mean</summary>
          <table class="sr-table sr-table--compact"><tbody>
            ${evaluation.levels.map((l) => `<tr><td><b>${l.rank} · ${escapeHtml(l.name)}</b></td><td>${escapeHtml(l.description)}</td></tr>`).join('')}
          </tbody></table>
          ${showTeacher ? '<p class="sr-muted sr-small">Match compares your rank with your teacher\'s: − teacher ranked you lower · = the same · + teacher ranked you higher.</p>' : ''}
        </details>
        ${evaluation.sections.map((section) => `
          <div class="sr-section" data-section="${section.key}">
            <h4 class="sr-h4">${escapeHtml(section.title)} <span class="sr-count" data-section-count></span></h4>
            <div class="sr-table-wrap"><table class="sr-table">
              <thead><tr><th>ID</th><th>Area</th><th>${review ? 'Student' : 'You'}</th>${showTeacher ? '<th>Teacher</th><th>Match</th><th>Teacher comment</th>' : ''}</tr></thead>
              <tbody>${section.items.map((item) => {
                  const self = student.ranks[item.id];
                  const mine = teacher.ranks[item.id];
                  const comment = teacher.comments[item.id] || '';
                  return `<tr>
                    <td class="sr-id">${item.id}</td>
                    <td>${escapeHtml(item.area)}</td>
                    <td>${review ? rankText(self) : `<select class="sr-input sr-input--rank" data-rank="${item.id}" aria-label="Your rank for ${escapeHtml(item.area)}">${rankOptions(self)}</select>`}</td>
                    ${showTeacher ? `<td>${review ? `<select class="sr-input sr-input--rank" data-trank="${item.id}" aria-label="Teacher rank for ${escapeHtml(item.area)}">${rankOptions(mine)}</select>` : rankText(mine)}</td>
                    <td data-match="${item.id}">${matchCell(self, mine)}</td>
                    <td class="sr-comment">${review
                        ? `<input class="sr-input" maxlength="1000" data-tcomment="${item.id}" value="${escapeHtml(comment)}" placeholder="Comment" aria-label="Comment on ${escapeHtml(item.area)}">`
                        : (comment ? escapeHtml(comment) : '<span class="sr-muted">—</span>')}</td>` : ''}
                  </tr>`;
              }).join('')}</tbody>
            </table></div>
            <label class="sr-field"><span class="sr-label">Summary</span><span class="sr-prompt">${escapeHtml(section.prompt)}</span>
              ${review
                  ? `<p class="sr-quote">${student.text[section.key] ? escapeHtml(student.text[section.key]) : '<span class="sr-muted">No summary yet.</span>'}</p>`
                  : `<textarea class="sr-input" rows="3" maxlength="2000" data-text="${section.key}">${escapeHtml(student.text[section.key] || '')}</textarea>`}
            </label>
            ${review
                ? `<label class="sr-field"><span class="sr-label">Your comment on this summary</span><input class="sr-input" maxlength="1000" data-tcomment="${section.key}" value="${escapeHtml(teacher.comments[section.key] || '')}"></label>`
                : (teacher.comments[section.key] ? `<p class="sr-teacher-note"><span class="sr-label">Teacher</span>${escapeHtml(teacher.comments[section.key])}</p>` : '')}
          </div>`).join('')}
        <span class="sr-part sr-part--next">${review ? 'Their reflection' : 'Reflect in writing'}</span>
        <div class="sr-prompts">
          ${evaluation.prompts.map((p, i) => `
            <label class="sr-field"><span class="${i === 0 ? 'sr-h4' : 'sr-label'}">${escapeHtml(p.label)}</span>
              ${review
                  ? `<p class="sr-quote">${student.text[p.key] ? escapeHtml(student.text[p.key]) : '<span class="sr-muted">—</span>'}</p>`
                  : `<textarea class="sr-input" rows="${i === 0 ? 3 : 2}" maxlength="2000" data-text="${p.key}">${escapeHtml(student.text[p.key] || '')}</textarea>`}
            </label>`).join('')}
        </div>
      </div>`;
}

function matchCell(self, teacher) {
    if (!self || !teacher) return '<span class="sr-muted">—</span>';
    if (teacher < self) return '<span class="sr-match sr-match--low" title="Teacher ranked lower">−</span>';
    if (teacher > self) return '<span class="sr-match sr-match--high" title="Teacher ranked higher">+</span>';
    return '<span class="sr-match sr-match--same" title="Same rank">=</span>';
}

function collect(form) {
    const ranks = {};
    const value = (el) => Number(el.value);
    if (ref.mode === 'review') {
        const comments = {};
        form.querySelectorAll('[data-trank]').forEach((el) => { if (value(el)) ranks[el.dataset.trank] = value(el); });
        form.querySelectorAll('[data-tcomment]').forEach((el) => { if (el.value.trim()) comments[el.dataset.tcomment] = el.value; });
        return { ranks, comments, overall: form.querySelector('[data-overall]').value };
    }
    const text = {};
    form.querySelectorAll('[data-rank]').forEach((el) => { if (value(el)) ranks[el.dataset.rank] = value(el); });
    form.querySelectorAll('[data-text]').forEach((el) => { if (el.value.trim()) text[el.dataset.text] = el.value; });
    return { ranks, text };
}

async function save(form) {
    const status = form.querySelector('[data-sr="save-status"]');
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    status.className = 'sr-small';
    status.textContent = 'Saving…';
    try {
        const path = ref.mode === 'review' ? `/${ref.sprintId}/reflections/${ref.studentId}/feedback` : `/${ref.sprintId}/reflection`;
        ref.view = await call(path, { method: 'PUT', body: JSON.stringify(collect(form)) });
        ref.dirty = false;
        if (ref.mode === 'review') await loadRoster();
        renderForm();
        const saved = ref.root.querySelector('[data-sr="save-status"]');
        saved.className = 'sr-small sr-ok';
        saved.textContent = `Saved ${fmtWhen(new Date())}`;
        if (growth.root) refreshGrowth();
    } catch (e) {
        button.disabled = false;
        status.className = 'sr-small sr-warn';
        status.textContent = e instanceof SignedOut ? 'Your session ended. Sign in again, then save.' : e.message;
    }
}

function confirmLeave() {
    return !ref.dirty || window.confirm('You have unsaved changes. Leave without saving?');
}

function bindReflection() {
    const root = ref.root;
    root.addEventListener('change', async (event) => {
        const target = event.target;
        if (target.matches('[data-sr="sprint"]')) {
            if (!confirmLeave()) { target.value = String(ref.sprintId); return; }
            ref.sprintId = Number(target.value);
            writeStore(SPRINT_KEY, String(ref.sprintId));
            renderSprintSelect();
            await loadReflection();
        } else if (target.matches('[data-sr="student"]')) {
            if (!confirmLeave()) { target.value = String(ref.studentId); return; }
            ref.studentId = Number(target.value);
            await loadReflection();
        }
    });
    root.addEventListener('input', (event) => {
        if (!event.target.closest('[data-sr="form"]')) return;
        ref.dirty = true;
        const status = root.querySelector('[data-sr="save-status"]');
        if (status) { status.className = 'sr-small sr-muted'; status.textContent = 'Unsaved changes'; }
        const id = event.target.dataset.rank || event.target.dataset.trank;
        const match = id && root.querySelector(`[data-match="${id}"]`);
        if (match) {
            const self = ref.mode === 'review' ? ref.view.student.ranks[id] : Number(event.target.value);
            const teacher = ref.mode === 'review' ? Number(event.target.value) : ref.view.teacher.ranks[id];
            match.innerHTML = matchCell(self, teacher);
        }
        updateProgress();
    });
    // Step guide jumps; they do not change what gets saved.
    root.addEventListener('click', (event) => {
        const jump = event.target.closest('[data-jump]');
        if (!jump) return;
        const target = document.getElementById(jump.dataset.jump);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    root.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (event.target.matches('[data-sr="form"]')) await save(event.target);
        if (event.target.matches('[data-sr="manage-form"]')) await saveSprint(event.target);
    });
    root.addEventListener('click', async (event) => {
        const button = event.target.closest('button');
        if (!button) return;
        if (button.dataset.editSprint) {
            startEdit(Number(button.dataset.editSprint));
        } else if (button.dataset.deleteSprint) {
            await deleteSprint(Number(button.dataset.deleteSprint));
        } else if (button.matches('[data-sr="manage-cancel"]')) {
            startEdit(null);
        }
    });
    window.addEventListener('beforeunload', (event) => {
        if (ref.dirty) { event.preventDefault(); event.returnValue = ''; }
    });
}

// ---------- Manage sprints (teachers) ----------

function renderManageList() {
    const list = ref.root.querySelector('[data-sr="manage-list"]');
    list.innerHTML = !shared.sprints.length ? '<p class="sr-muted sr-small">No sprints yet.</p>' : `
      <div class="sr-table-wrap"><table class="sr-table">
        <thead><tr><th>Sprint</th><th>Dates</th><th></th></tr></thead>
        <tbody>${shared.sprints.map((s) => `
          <tr>
            <td>${escapeHtml(s.name)}${shared.calendarNames.has(s.name) ? ' <span class="sr-pill">School calendar</span>' : ''}</td>
            <td>${sprintDates(s)}</td>
            <td class="sr-actions">
              <button type="button" class="sr-btn sr-btn--ghost sr-btn--sm" data-edit-sprint="${s.id}">Edit</button>
              <button type="button" class="sr-btn sr-btn--link" data-delete-sprint="${s.id}">Delete</button>
            </td>
          </tr>`).join('')}
        </tbody>
      </table></div>`;
}

function startEdit(id) {
    const form = ref.root.querySelector('[data-sr="manage-form"]');
    const sprint = shared.sprints.find((s) => s.id === id);
    ref.editingId = sprint ? id : null;
    const { sprintName, startDate, endDate } = form.elements;
    sprintName.value = sprint ? sprint.name : '';
    startDate.value = sprint ? sprint.startDate : '';
    endDate.value = sprint && sprint.endDate ? sprint.endDate : '';
    form.querySelector('[data-sr="manage-submit"]').textContent = sprint ? 'Save changes' : 'Add sprint';
    form.querySelector('[data-sr="manage-cancel"]').hidden = !sprint;
    form.querySelector('[data-sr="manage-status"]').textContent = '';
    if (sprint) sprintName.focus();
}

async function saveSprint(form) {
    const status = form.querySelector('[data-sr="manage-status"]');
    const { sprintName, startDate, endDate } = form.elements;
    const body = { name: sprintName.value, startDate: startDate.value || null, endDate: endDate.value || null };
    status.className = 'sr-small';
    status.textContent = 'Saving…';
    try {
        const editing = ref.editingId;
        const saved = await call(editing ? `/${editing}` : '', { method: editing ? 'PUT' : 'POST', body: JSON.stringify(body) });
        await loadShared(true);
        startEdit(null);
        status.className = 'sr-small sr-ok';
        status.textContent = editing ? `Saved ${saved.name}.` : `Added ${saved.name}. Students can reflect on it now.`;
        if (!editing && confirmLeave()) {
            ref.sprintId = saved.id;
            writeStore(SPRINT_KEY, String(saved.id));
            renderSprintSelect();
            renderManageList();
            await loadReflection();
        } else {
            renderSprintSelect();
            renderManageList();
        }
        if (growth.root) refreshGrowth();
    } catch (e) {
        status.className = 'sr-small sr-warn';
        status.textContent = e.message;
    }
}

async function deleteSprint(id) {
    const sprint = shared.sprints.find((s) => s.id === id);
    if (!sprint || !window.confirm(`Delete ${sprint.name}?`)) return;
    const status = ref.root.querySelector('[data-sr="manage-status"]');
    try {
        await call(`/${id}`, { method: 'DELETE' });
        await loadShared(true);
        if (ref.sprintId === id) ref.sprintId = defaultSprintId();
        renderSprintSelect();
        renderManageList();
        status.className = 'sr-small sr-ok';
        status.textContent = `Deleted ${sprint.name}.`;
        await loadReflection();
        if (growth.root) refreshGrowth();
    } catch (e) {
        status.className = 'sr-small sr-warn';
        status.textContent = e.message;
    }
}

// ---------- Growth Over Time ----------

/** Renders the Growth Over Time tab into root. */
export async function initGrowthOverTime(root) {
    if (!root) return;
    injectStyles();
    growth.root = root;
    root.innerHTML = `
      <section class="sr">
        <header>
          <h2 class="sr-title">Growth Over Time</h2>
          <p class="sr-muted">How your Ground 0 ranks, and your teacher's, change from sprint to sprint, and what you wrote along the way.</p>
        </header>
        <p class="sr-muted" data-sg="status">Loading…</p>
        <div class="sr-stack" data-sg="body" hidden>
          <div class="sr-card sr-bar" data-sg="viewer" hidden>
            <label class="sr-field"><span class="sr-label">Showing</span><select class="sr-input" data-sg="person"></select></label>
          </div>
          <div class="sr-tiles" data-sg="tiles"></div>
          <div class="sr-card">
            <div class="sr-row sr-row--between">
              <h3 class="sr-h3">Ranks across the year</h3>
              <div class="sr-row">
                <select class="sr-input sr-input--auto" data-sg="view" aria-label="What to chart"></select>
                <div class="sr-seg" data-sg="perspective" role="group" aria-label="Whose ranks">
                  <button type="button" data-perspective="self" aria-pressed="true">Self</button>
                  <button type="button" data-perspective="teacher" aria-pressed="false">Teacher</button>
                </div>
              </div>
            </div>
            <p class="sr-muted sr-small" data-sg="chart-note"></p>
            <div data-sg="chart"></div>
          </div>
          <div class="sr-card">
            <h3 class="sr-h3">Change since the first sprint</h3>
            <p class="sr-muted sr-small">First rank → latest rank for each item, largest growth first.</p>
            <div data-sg="changes"></div>
          </div>
          <details class="sr-card">
            <summary class="sr-summary">Every rank by sprint</summary>
            <p class="sr-muted sr-small">Self · teacher for each item.</p>
            <div data-sg="all"></div>
          </details>
          <div class="sr-card">
            <h3 class="sr-h3">In your words</h3>
            <p class="sr-muted sr-small">Your retrospective answers each sprint, and your teacher's overall comment.</p>
            <div data-sg="story"></div>
          </div>
        </div>
      </section>`;
    bindGrowth();
    await refreshGrowth();
}

async function refreshGrowth() {
    const root = growth.root;
    const status = root.querySelector('[data-sg="status"]');
    const body = root.querySelector('[data-sg="body"]');
    try {
        await loadShared();
        if (shared.canManage && !root.querySelector('[data-sg="person"]').options.length) await loadGrowthPeople();
        growth.progress = await call(growth.personId ? `/progress/${growth.personId}` : '/progress');
    } catch (e) {
        if (e instanceof SignedOut) return signedOutMessage(status, body);
        status.textContent = `Could not load your growth: ${e.message}`;
        status.hidden = false;
        return;
    }
    status.hidden = true;
    body.hidden = false;
    renderViewSelect();
    renderGrowth();
}

async function loadGrowthPeople() {
    const select = growth.root.querySelector('[data-sg="person"]');
    growth.root.querySelector('[data-sg="viewer"]').hidden = false;
    const last = shared.sprints[shared.sprints.length - 1];
    const roster = last ? await call(`/${last.id}/reflections`) : [];
    select.innerHTML = `<option value="">My own growth</option>${roster.map((r) => `<option value="${r.personId}">${escapeHtml(r.name || r.uid)}</option>`).join('')}`;
}

function renderViewSelect() {
    const select = growth.root.querySelector('[data-sg="view"]');
    const options = [`<option value="sections">Section averages</option>`];
    shared.template.evaluations.forEach((evaluation) => {
        options.push(`<optgroup label="${escapeHtml(evaluation.title)}">${evaluation.sections.map((s) => `<option value="section:${s.key}">${escapeHtml(s.title)}</option>`).join('')}</optgroup>`);
    });
    options.push(`<optgroup label="One item, self vs teacher">${growth.progress.items.map((i) => `<option value="item:${i.id}">${i.id} ${escapeHtml(i.area)}</option>`).join('')}</optgroup>`);
    select.innerHTML = options.join('');
    select.value = growth.viewKey;
    if (select.value !== growth.viewKey) { growth.viewKey = 'sections'; select.value = 'sections'; }
}

const average = (values) => {
    const known = values.filter((v) => v != null);
    return known.length ? Math.round((known.reduce((a, b) => a + b, 0) / known.length) * 10) / 10 : null;
};
const first = (values) => values.find((v) => v != null) ?? null;
const last = (values) => [...values].reverse().find((v) => v != null) ?? null;

/** Per sprint, the average of every item's rank from one perspective. */
function overall(progress, perspective) {
    return progress.sprints.map((_, i) => average(progress.items.map((item) => item[perspective][i])));
}

function renderGrowth() {
    const progress = growth.progress;
    const person = growth.personId ? 'This student' : 'You';
    const reflected = progress.sprints.filter((_, i) => progress.items.some((item) => item.self[i] != null)
        || Object.keys(progress.text[i] || {}).length).length;
    const selfAvg = overall(progress, 'self');
    const teacherAvg = overall(progress, 'teacher');
    const changes = progress.items.map((item) => ({
        item,
        selfFrom: first(item.self), selfTo: last(item.self),
        teacherFrom: first(item.teacher), teacherTo: last(item.teacher),
        known: item.self.filter((v) => v != null).length,
        teacherKnown: item.teacher.filter((v) => v != null).length,
    }));
    const growing = changes.filter((c) => c.known > 1 && c.selfTo - c.selfFrom > 0).sort((a, b) => (b.selfTo - b.selfFrom) - (a.selfTo - a.selfFrom));
    const latestIndex = progress.sprints.map((_, i) => i).filter((i) => progress.items.some((item) => item.self[i] != null && item.teacher[i] != null)).pop();
    const gaps = latestIndex == null ? [] : progress.items
        .filter((item) => item.self[latestIndex] != null && item.teacher[latestIndex] != null)
        .map((item) => ({ item, gap: item.teacher[latestIndex] - item.self[latestIndex] }))
        .sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap));

    const trend = (values) => {
        const from = first(values);
        const to = last(values);
        if (to == null) return { value: '—', note: 'no ranks yet' };
        if (from === to || values.filter((v) => v != null).length < 2) return { value: to.toFixed(1), note: 'average of all items' };
        const delta = Math.round((to - from) * 10) / 10;
        return { value: to.toFixed(1), note: `${delta > 0 ? '+' : ''}${delta} since the first sprint`, cls: delta > 0 ? 'sr-ok' : 'sr-warn' };
    };
    const tile = (label, value, note, cls = '') => `<div class="sr-tile"><span class="sr-label">${label}</span><span class="sr-tile-value">${value}</span><span class="sr-small ${cls}">${note}</span></div>`;
    const selfTrend = trend(selfAvg);
    const teacherTrend = trend(teacherAvg);
    growth.root.querySelector('[data-sg="tiles"]').innerHTML = [
        tile('Sprints reflected', `${reflected} of ${progress.sprints.length}`, reflected ? 'with ranks or writing' : 'start in Sprint Reflection'),
        tile('Self rank', selfTrend.value, selfTrend.note, selfTrend.cls),
        tile('Teacher rank', teacherTrend.value, teacherTrend.note, teacherTrend.cls),
        tile('Most growth', growing.length ? escapeHtml(growing[0].item.area) : '—',
            growing.length ? `${growing[0].selfFrom} → ${growing[0].selfTo} (self)` : 'needs ranks from two sprints'),
        tile('Biggest gap with teacher', gaps.length && gaps[0].gap !== 0 ? escapeHtml(gaps[0].item.area) : '—',
            gaps.length && gaps[0].gap !== 0 ? `teacher ${gaps[0].gap > 0 ? '+' : ''}${gaps[0].gap} vs self, ${escapeHtml(progress.sprints[latestIndex].name)}` : (gaps.length ? 'you and your teacher agree' : 'needs teacher ranks')),
    ].join('');

    renderChart();

    const delta = (from, to, count) => {
        if (from == null || to == null) return '<span class="sr-muted">—</span>';
        if (count < 2) return `${to} <span class="sr-muted">(one sprint)</span>`;
        const d = to - from;
        const cls = d > 0 ? 'sr-ok' : d < 0 ? 'sr-warn' : 'sr-muted';
        return `${from} → ${to} <span class="${cls}">${d > 0 ? '+' : ''}${d === 0 ? '±0' : d}</span>`;
    };
    const sorted = [...changes].filter((c) => c.selfTo != null || c.teacherTo != null)
        .sort((a, b) => ((b.selfTo ?? 0) - (b.selfFrom ?? 0)) - ((a.selfTo ?? 0) - (a.selfFrom ?? 0)));
    growth.root.querySelector('[data-sg="changes"]').innerHTML = !sorted.length
        ? `<p class="sr-muted sr-small">${person === 'You' ? 'Rank yourself in Sprint Reflection' : 'No ranks yet'}; changes appear once there are ranks from two sprints.</p>`
        : `<div class="sr-table-wrap"><table class="sr-table">
            <thead><tr><th>ID</th><th>Area</th><th>Self</th><th>Teacher</th></tr></thead>
            <tbody>${sorted.map((c) => `<tr><td class="sr-id">${c.item.id}</td><td>${escapeHtml(c.item.area)}</td><td>${delta(c.selfFrom, c.selfTo, c.known)}</td><td>${delta(c.teacherFrom, c.teacherTo, c.teacherKnown)}</td></tr>`).join('')}</tbody>
          </table></div>`;

    growth.root.querySelector('[data-sg="all"]').innerHTML = !progress.sprints.length ? '<p class="sr-muted sr-small">No sprints yet.</p>' : `
      <div class="sr-table-wrap"><table class="sr-table sr-table--compact">
        <thead><tr><th>Item</th>${progress.sprints.map((s) => `<th>${escapeHtml(s.name)}</th>`).join('')}</tr></thead>
        <tbody>${progress.items.map((item) => `<tr><td><span class="sr-id">${item.id}</span> ${escapeHtml(item.area)}</td>${progress.sprints.map((_, i) =>
            `<td>${item.self[i] ?? '–'} · ${item.teacher[i] ?? '–'}</td>`).join('')}</tr>`).join('')}</tbody>
      </table></div>`;

    const labels = prompts();
    const story = progress.sprints.map((sprint, i) => ({ sprint, text: progress.text[i] || {}, overall: progress.teacherOverall[i] }))
        .filter((s) => STORY_KEYS.some((k) => s.text[k]) || s.overall);
    growth.root.querySelector('[data-sg="story"]').innerHTML = !story.length
        ? '<p class="sr-muted sr-small">Nothing written yet. Your answers to the retrospective questions will collect here, sprint by sprint.</p>'
        : `<ol class="sr-story">${story.map((s) => `
            <li>
              <span class="sr-h4">${escapeHtml(s.sprint.name)}</span>
              ${STORY_KEYS.filter((k) => s.text[k]).map((k) => `<div><span class="sr-label">${escapeHtml(labels[k])}</span><p class="sr-quote">${escapeHtml(s.text[k])}</p></div>`).join('')}
              ${s.overall ? `<p class="sr-teacher-note"><span class="sr-label">Teacher</span>${escapeHtml(s.overall)}</p>` : ''}
            </li>`).join('')}</ol>`;
}

function chartSeries() {
    const progress = growth.progress;
    const key = growth.viewKey;
    const perspective = growth.perspective;
    if (key.startsWith('item:')) {
        const item = progress.items.find((i) => i.id === key.slice(5));
        return { series: [{ name: 'Self', data: item.self }, { name: 'Teacher', data: item.teacher }], dashed: [0, 4], note: `${item.id} ${item.area}: your rank and your teacher's.`, both: true };
    }
    if (key.startsWith('section:')) {
        const section = sections().find((s) => s.key === key.slice(8));
        const ids = new Set(section.items.map((i) => i.id));
        const series = progress.items.filter((i) => ids.has(i.id)).map((i) => ({ name: `${i.id} ${i.area}`, data: i[perspective] }));
        return { series, note: `${section.title}, ${perspective === 'self' ? 'self' : 'teacher'} ranks.` };
    }
    const series = sections().map((section) => {
        const ids = new Set(section.items.map((i) => i.id));
        const rows = progress.items.filter((i) => ids.has(i.id));
        return { name: section.title, data: progress.sprints.map((_, s) => average(rows.map((r) => r[perspective][s]))) };
    });
    return { series, note: `Average ${perspective === 'self' ? 'self' : 'teacher'} rank in each section.` };
}

function renderChart() {
    const target = growth.root.querySelector('[data-sg="chart"]');
    const note = growth.root.querySelector('[data-sg="chart-note"]');
    if (growth.chart) { growth.chart.destroy(); growth.chart = null; }
    const progress = growth.progress;
    const { series, dashed, note: text, both } = chartSeries();
    growth.root.querySelector('[data-sg="perspective"]').hidden = Boolean(both);
    const hasData = series.some((s) => s.data.some((v) => v != null));
    if (!progress.sprints.length || !hasData) {
        target.innerHTML = '';
        note.textContent = progress.sprints.length ? 'No ranks to chart yet.' : 'No sprints yet.';
        return;
    }
    note.textContent = `${text}${progress.sprints.length === 1 ? ' Lines appear once there is a second sprint.' : ''}`;
    if (!window.ApexCharts) {
        target.innerHTML = '<p class="sr-muted sr-small">The chart library did not load; see "Every rank by sprint" below.</p>';
        return;
    }
    target.innerHTML = '';
    growth.chart = new window.ApexCharts(target, {
        chart: { type: 'line', height: 300, toolbar: { show: false }, background: 'transparent', zoom: { enabled: false } },
        series,
        colors: both ? ['#f59e0b', '#34d399'] : COLORS,
        stroke: { width: 2, curve: 'straight', dashArray: dashed || 0 },
        markers: { size: 5 },
        xaxis: { categories: progress.sprints.map((s) => s.name), labels: { style: { colors: '#9ca3af' } } },
        yaxis: { min: 0, max: 5, tickAmount: 5, labels: { style: { colors: '#9ca3af' }, formatter: (v) => (v == null ? '' : Number(v).toFixed(0)) } },
        grid: { borderColor: 'rgba(148,163,184,0.25)' },
        legend: { labels: { colors: '#d1d5db' } },
        theme: { mode: 'dark' },
        tooltip: { theme: 'dark', y: { formatter: (v) => (v == null ? 'not ranked' : String(v)) } },
    });
    growth.chart.render();
}

function bindGrowth() {
    const root = growth.root;
    root.addEventListener('change', async (event) => {
        if (event.target.matches('[data-sg="view"]')) {
            growth.viewKey = event.target.value;
            renderChart();
        } else if (event.target.matches('[data-sg="person"]')) {
            growth.personId = event.target.value ? Number(event.target.value) : null;
            await refreshGrowth();
        }
    });
    root.addEventListener('click', (event) => {
        const button = event.target.closest('[data-perspective]');
        if (!button) return;
        growth.perspective = button.dataset.perspective;
        root.querySelectorAll('[data-perspective]').forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
        renderChart();
    });
}

// ---------- styles ----------

function injectStyles() {
    if (document.getElementById('sr-styles')) return;
    const style = document.createElement('style');
    style.id = 'sr-styles';
    // Same visual language as the Forecast Retrospective (fr-*): colors derive from the text color.
    style.textContent = `
      .sr { display: grid; gap: 1rem; color: inherit; }
      .sr [hidden] { display: none !important; }
      .sr-stack { display: grid; gap: 1rem; }
      .sr-title { font-size: 1.25rem; font-weight: 600; margin: 0 0 .25rem; }
      .sr-h3 { font-size: 1.05rem; font-weight: 600; margin: 0; }
      .sr-h4 { display: block; font-size: .95rem; font-weight: 600; margin: 0; }
      .sr-muted { opacity: .7; margin: 0; }
      .sr-small { font-size: .8rem; }
      .sr-label { display: block; font-size: .72rem; text-transform: uppercase; letter-spacing: .04em; opacity: .65; }
      .sr-ok { color: #34d399; }
      .sr-warn { color: #fbbf24; }
      .sr-card { border: 1px solid color-mix(in srgb, currentColor 18%, transparent); background: color-mix(in srgb, currentColor 4%, transparent); border-radius: .9rem; padding: 1.1rem 1.25rem; display: grid; gap: .8rem; }
      .sr-card--teacher { border-color: color-mix(in srgb, #60a5fa 50%, transparent); background: color-mix(in srgb, #60a5fa 8%, transparent); }
      .sr-summary { cursor: pointer; font-weight: 600; }
      .sr-bar { display: flex; flex-wrap: wrap; gap: .75rem 1.25rem; align-items: flex-end; }
      .sr-row { display: flex; gap: .6rem; align-items: center; flex-wrap: wrap; }
      .sr-row--between { justify-content: space-between; }
      .sr-field { display: grid; gap: .3rem; font-size: .88rem; }
      .sr-prompt { font-size: .82rem; opacity: .8; }
      .sr-input { box-sizing: border-box; width: 100%; border-radius: .45rem; padding: .4rem .55rem; font: inherit; color: inherit;
        background: color-mix(in srgb, currentColor 6%, transparent); border: 1px solid color-mix(in srgb, currentColor 25%, transparent); }
      .sr-input:focus { outline: 2px solid #059669; outline-offset: 1px; }
      .sr-input option, .sr-input optgroup { color: #111; }
      .sr-input--date { width: auto; color-scheme: dark light; }
      .sr-input--rank { width: auto; min-width: 9.5rem; padding: .25rem .4rem; }
      .sr-input--auto { width: auto; }
      .sr-bar .sr-input { min-width: 12rem; }
      textarea.sr-input { resize: vertical; }
      .sr-seg { display: inline-flex; border: 1px solid color-mix(in srgb, currentColor 30%, transparent); border-radius: .5rem; overflow: hidden; }
      .sr-seg button { border: 0; background: transparent; color: inherit; font: inherit; font-size: .85rem; padding: .4rem .8rem; cursor: pointer; }
      .sr-seg button[aria-pressed="true"] { background: #059669; color: #fff; }
      .sr-status-card { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); font-size: .9rem; }
      .sr-card[id] { scroll-margin-top: 4.5rem; }
      .sr-step { display: flex; gap: .65rem; align-items: center; }
      .sr-step-num { flex: none; width: 1.75rem; height: 1.75rem; border-radius: 999px; display: grid; place-items: center; font-weight: 700; font-size: .9rem; background: #059669; color: #fff; }
      .sr-steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: .6rem; }
      .sr-stepchip { display: flex; gap: .65rem; align-items: center; text-align: left; font: inherit; color: inherit; cursor: pointer; padding: .6rem .8rem; border-radius: .75rem;
        border: 1px solid color-mix(in srgb, currentColor 18%, transparent); background: color-mix(in srgb, currentColor 4%, transparent); }
      .sr-stepchip:hover, .sr-stepchip:focus-visible { border-color: #059669; outline: none; }
      .sr-stepchip[data-done] { border-color: color-mix(in srgb, #34d399 55%, transparent); }
      .sr-stepchip[data-done] [data-step-status] { color: #34d399; opacity: 1; }
      .sr-stepchip-text { display: grid; gap: .1rem; min-width: 0; }
      .sr-stepchip-title { font-weight: 600; font-size: .9rem; }
      .sr-part { display: block; font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #34d399; }
      .sr-part--next { padding-top: .8rem; border-top: 1px solid color-mix(in srgb, currentColor 12%, transparent); }
      .sr-count { font-size: .74rem; font-weight: 500; opacity: .7; margin-left: .4rem; white-space: nowrap; }
      .sr-count[data-done] { color: #34d399; opacity: 1; }
      .sr-levels summary { cursor: pointer; opacity: .8; }
      .sr-section { display: grid; gap: .6rem; padding-top: .8rem; border-top: 1px solid color-mix(in srgb, currentColor 12%, transparent); }
      .sr-prompts { display: grid; gap: .7rem; padding-top: .8rem; border-top: 1px solid color-mix(in srgb, currentColor 12%, transparent); }
      .sr-table-wrap { overflow-x: auto; }
      .sr-table { width: 100%; border-collapse: collapse; font-size: .88rem; }
      .sr-table th { text-align: left; font-weight: 600; font-size: .72rem; text-transform: uppercase; letter-spacing: .04em; opacity: .65; padding: .4rem .5rem; white-space: nowrap; }
      .sr-table td { padding: .45rem .5rem; border-top: 1px solid color-mix(in srgb, currentColor 12%, transparent); vertical-align: middle; }
      .sr-table--compact td { padding: .3rem .5rem; }
      .sr-comment { min-width: 12rem; }
      .sr-id { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .8rem; opacity: .75; white-space: nowrap; }
      .sr-match { display: inline-grid; place-items: center; width: 1.6rem; height: 1.6rem; border-radius: 999px; font-weight: 700; }
      .sr-match--low { color: #fbbf24; background: color-mix(in srgb, #fbbf24 15%, transparent); }
      .sr-match--high { color: #34d399; background: color-mix(in srgb, #34d399 15%, transparent); }
      .sr-match--same { color: #60a5fa; background: color-mix(in srgb, #60a5fa 15%, transparent); }
      .sr-quote { margin: 0; white-space: pre-wrap; border-left: 2px solid color-mix(in srgb, currentColor 30%, transparent); padding-left: .6rem; }
      .sr-teacher-note { margin: 0; padding: .5rem .7rem; border-radius: .5rem; background: color-mix(in srgb, #60a5fa 12%, transparent); font-size: .88rem; white-space: pre-wrap; }
      .sr-pill { font-size: .72rem; font-weight: 500; padding: .1rem .5rem; border-radius: 999px; border: 1px solid color-mix(in srgb, currentColor 35%, transparent); margin-left: .4rem; }
      .sr-savebar { position: sticky; bottom: 0; display: flex; gap: .9rem; align-items: center; padding: .75rem 1rem; border-radius: .75rem;
        background: color-mix(in srgb, #171717 92%, transparent); border: 1px solid color-mix(in srgb, currentColor 18%, transparent); backdrop-filter: blur(4px); z-index: 5; }
      .sr-manage-form { display: flex; flex-wrap: wrap; gap: .75rem; align-items: flex-end; }
      .sr-manage-form .sr-field { min-width: 10rem; }
      .sr-manage-form p { flex-basis: 100%; margin: 0; }
      .sr-actions { white-space: nowrap; text-align: right; }
      .sr-tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: .75rem; }
      .sr-tile { border: 1px solid color-mix(in srgb, currentColor 18%, transparent); border-radius: .75rem; padding: .8rem 1rem; display: flex; flex-direction: column; gap: .15rem; }
      .sr-tile-value { font-size: 1.2rem; font-weight: 600; }
      .sr-story { list-style: none; margin: 0; padding: 0; display: grid; gap: .9rem; }
      .sr-story li { display: grid; gap: .5rem; padding: .8rem 1rem; border-radius: .7rem; border: 1px solid color-mix(in srgb, currentColor 14%, transparent); }
      .sr-btn { border: 0; border-radius: .5rem; padding: .45rem .95rem; font: inherit; font-weight: 600; cursor: pointer; background: #059669; color: #fff; }
      .sr-btn:hover { background: #047857; }
      .sr-btn:disabled { opacity: .6; cursor: default; }
      .sr-btn--ghost { background: transparent; color: inherit; border: 1px solid color-mix(in srgb, currentColor 30%, transparent); font-weight: 500; }
      .sr-btn--ghost:hover { background: color-mix(in srgb, currentColor 10%, transparent); }
      .sr-btn--sm { padding: .2rem .6rem; font-size: .78rem; }
      .sr-btn--link { background: transparent; color: inherit; opacity: .65; font-weight: 400; font-size: .8rem; text-decoration: underline; padding: 0 .3rem; }
      .sr-btn--link:hover { background: transparent; opacity: 1; color: #f87171; }
      @media (max-width: 520px) { .sr-card { padding: 1rem; } .sr-bar .sr-input { min-width: 0; } }
    `;
    document.head.appendChild(style);
}
