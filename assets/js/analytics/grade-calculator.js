// Grade Calculator for the Grade Predictor tab of the analytics dashboards.
//
// The official gradebook has no API this site can read, so students copy their assignments and
// scores in themselves. The grade is total points: points earned over points possible. The
// sheet is saved to Spring (/api/grade-calculator) and answers two questions: "what happens to
// my grade if I get X on this?" (what-if scores) and "what do I need on this to reach a B?"
// (neededScore). The grade rules match GradeCalculatorService in Spring; keep the two in step.
import { javaURI, fetchOptions } from '../api/config.js';

const api = `${javaURI}/api/grade-calculator`;
const SAVE_DELAY_MS = 800;
export const TARGETS = [['A', 90], ['B', 80], ['C', 70], ['D', 60]];

// ---------- grade math (pure, mirrors GradeCalculatorService) ----------

function counts(entry, includeWhatIf) {
    return entry.earned != null && entry.earned !== '' && Number(entry.possible) > 0
        && (includeWhatIf || !entry.whatIf);
}

/** Points earned and possible over the entries that count. */
function totals(entries, includeWhatIf) {
    return entries.filter((e) => counts(e, includeWhatIf)).reduce(
        (sum, e) => ({ earned: sum.earned + Number(e.earned), possible: sum.possible + Number(e.possible) }),
        { earned: 0, possible: 0 });
}

const round1 = (value) => (value == null ? null : Math.round(value * 10) / 10);
const percent = ({ earned, possible }) => (possible === 0 ? null : earned / possible * 100);

/** { current, projected } in percent, rounded to 0.1; current leaves out what-if scores. */
export function calculate(sheet) {
    return { current: round1(percent(totals(sheet.entries, false))), projected: round1(percent(totals(sheet.entries, true))) };
}

/**
 * The score needed on entries[index] for the projected grade to reach target percent, keeping
 * every other what-if score. With total points the answer is direct: the other entries give
 * earned E over possible P, so the score x on an entry worth p needs (E + x) / (P + p) >= target.
 * Returns { status, needed, possible, percent, worst, best }, where status is 'reachable',
 * 'secured' (any score works) or 'unreachable' (even full marks fall short).
 */
export function neededScore(sheet, index, target) {
    const entry = sheet.entries[index];
    const possible = Number(entry?.possible);
    if (!entry || !(possible > 0)) return null;
    const others = totals(sheet.entries.filter((_, i) => i !== index), true);
    const allPossible = others.possible + possible;
    const worst = others.earned / allPossible * 100;
    const best = (others.earned + possible) / allPossible * 100;
    const result = (status, needed) => ({
        status, needed: round1(needed), possible, percent: needed == null ? null : round1(needed / possible * 100),
        worst: round1(worst), best: round1(best),
    });
    if (worst >= target) return result('secured', 0);
    if (best < target) return result('unreachable', null);
    return result('reachable', target / 100 * allPossible - others.earned);
}

export function letter(value) {
    if (value == null) return '—';
    const found = TARGETS.find(([, min]) => value >= min);
    return found ? found[0] : 'F';
}

// ---------- UI ----------

// A filled-in sheet a student can load to see how the calculator works before entering their own.
const EXAMPLE_SHEET = {
    entries: [
        { name: 'Unit 1 Test', earned: 42, possible: 50, whatIf: false },
        { name: 'Portfolio Project', earned: 88, possible: 100, whatIf: false },
        { name: 'Homework 1', earned: 10, possible: 10, whatIf: false },
        { name: 'Homework 2', earned: 7, possible: 10, whatIf: false },
        { name: 'Unit 2 Test', earned: 45, possible: 50, whatIf: true },
        { name: 'Final Project', earned: null, possible: 100, whatIf: false },
    ],
};

let state = { root: null, sheet: { entries: [] }, onSaved: null, saveTimer: null, classAssignments: null };

/**
 * Renders the calculator into root and loads the signed-in user's sheet. onSaved() runs after
 * each successful save, so the dashboard can refresh anything that uses the current grade.
 */
export async function initGradeCalculator(root, { onSaved } = {}) {
    if (!root) return;
    injectStyles();
    state = { ...state, root, onSaved };
    root.innerHTML = `
      <section class="gc">
        <header>
          <h2 class="gc-title">Grade Calculator</h2>
          <p class="gc-muted">See your grade, try "what if" scores, and find out what you need on upcoming work. Copy your scores from your gradebook; only you can see and edit this.</p>
        </header>
        <p class="gc-muted" data-gc="status">Loading your grade calculator…</p>
        <div data-gc="body" hidden>
          <div class="gc-grade" data-gc="grade"></div>

          <div class="gc-start" data-gc="start" hidden>
            <strong>New here?</strong>
            <span>Add your assignments in step 1, or load an example to see how it works. You can clear it any time.</span>
            <button type="button" class="gc-btn gc-btn--ghost" data-gc-action="example">Load an example</button>
          </div>

          <div class="gc-card">
            <div class="gc-step"><span class="gc-step-num">1</span><div>
              <h3 class="gc-h3">Add your scores</h3>
              <p class="gc-muted gc-small">One row per assignment, with the points you earned and the points it was worth. Leave <b>Score</b> blank if it isn't graded yet; you can still plan for it in step 2.</p>
            </div></div>
            <div class="gc-table-wrap"><table class="gc-table" data-gc="entries"></table></div>
            <div class="gc-row gc-row--wrap">
              <button type="button" class="gc-btn gc-btn--ghost" data-gc-action="add-entry">+ Add an assignment</button>
              <select class="gc-input gc-input--select" data-gc="class-assignments" aria-label="Add one of your class assignments">
                <option value="">…or pick a class assignment</option>
              </select>
            </div>
          </div>

          <div class="gc-card">
            <div class="gc-step"><span class="gc-step-num">2</span><div>
              <h3 class="gc-h3">Explore</h3>
              <p class="gc-muted gc-small">Two ways to plan ahead. Nothing here changes your real scores.</p>
            </div></div>
            <div class="gc-explore">
              <div class="gc-tool">
                <h4 class="gc-h4">What if I get…?</h4>
                <p class="gc-muted gc-small">Turn on <b>What if</b> for any assignment in step 1 and type the score you imagine. The orange marker on the grade bar shows where you would land.</p>
                <div data-gc="whatif-summary" class="gc-small"></div>
              </div>
              <div class="gc-tool">
                <h4 class="gc-h4">What do I need?</h4>
                <label class="gc-field"><span>On this assignment</span><select class="gc-input gc-input--select" data-gc="need-entry"></select></label>
                <label class="gc-field"><span>To finish with</span><select class="gc-input gc-input--select" data-gc="need-target">
                  ${TARGETS.map(([l, v]) => `<option value="${v}">${l === 'A' ? 'an' : 'a'} ${l} (${v}%)</option>`).join('')}
                  <option value="custom">a custom %…</option>
                </select></label>
                <label class="gc-field" data-gc="need-custom-wrap" hidden><span>Target %</span><input type="number" min="0" max="100" step="0.1" class="gc-input gc-input--num" data-gc="need-custom" value="85"></label>
                <p class="gc-need" data-gc="need-result" role="status"></p>
              </div>
            </div>
          </div>

          <details class="gc-help">
            <summary>How is my grade calculated?</summary>
            <ul>
              <li>Your grade is <b>all the points you earned divided by all the points possible</b>, so every point counts the same. A 100-point project counts ten times as much as a 10-point homework.</li>
              <li>Assignments with a blank score are ignored until they have one.</li>
              <li><b>What if</b> scores only affect the "with what-if scores" number and the orange marker, never your grade now.</li>
              <li>Your teacher's gradebook is the official grade. This is a planning tool, so small differences (rounding, extra credit) are normal.</li>
            </ul>
          </details>

          <div class="gc-row gc-row--between">
            <p class="gc-muted gc-small" data-gc="save-status" role="status"></p>
            <button type="button" class="gc-btn gc-btn--link" data-gc-action="clear">Clear everything</button>
          </div>
        </div>
      </section>`;
    bind();
    await load();
    loadClassAssignments();
}

async function load() {
    const status = state.root.querySelector('[data-gc="status"]');
    try {
        const res = await fetch(api, fetchOptions);
        if (res.status === 401) {
            status.textContent = 'Sign in to use the grade calculator.';
            return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setSheet((await res.json()).sheet);
    } catch (e) {
        console.error('Grade calculator failed to load:', e);
        status.textContent = 'Could not load your grade calculator from the server.';
        return;
    }
    status.textContent = '';
    state.root.querySelector('[data-gc="body"]').hidden = false;
    renderAll();
}

function setSheet(sheet) {
    state.sheet = { entries: sheet.entries.map((e) => ({ name: e.name, earned: e.earned, possible: e.possible, whatIf: !!e.whatIf })) };
}

async function loadClassAssignments() {
    const select = state.root.querySelector('[data-gc="class-assignments"]');
    try {
        const res = await fetch(`${javaURI}/api/assignments/`, fetchOptions);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const list = await res.json();
        state.classAssignments = list
            .filter((a) => a.name && Number(a.points) > 0)
            .sort((a, b) => String(b.dueDate || '').localeCompare(String(a.dueDate || '')));
        if (!state.classAssignments.length) throw new Error('none');
        select.insertAdjacentHTML('beforeend', state.classAssignments
            .map((a, i) => `<option value="${i}">${escapeHtml(a.name)} (${Number(a.points)} pts)</option>`).join(''));
    } catch (e) {
        select.hidden = true; // the add button still works
    }
}

function renderAll() {
    state.root.querySelector('[data-gc="start"]').hidden = state.sheet.entries.length > 0;
    renderEntries();
    renderNeedOptions();
    renderSummary();
}

function renderEntries() {
    state.root.querySelector('[data-gc="entries"]').innerHTML = state.sheet.entries.length ? `
      <thead><tr><th>Assignment</th><th>Score</th><th></th><th title="Try a score you haven't received yet">What if</th><th></th></tr></thead>
      <tbody>${state.sheet.entries.map((e, i) => `
        <tr class="${e.whatIf ? 'gc-whatif' : ''}">
          <td><input class="gc-input" data-entry="${i}" data-field="name" value="${escapeHtml(e.name ?? '')}" maxlength="100" aria-label="Assignment name"></td>
          <td><span class="gc-score">
            <input class="gc-input gc-input--num" type="number" min="0" step="0.5" data-entry="${i}" data-field="earned" value="${e.earned ?? ''}" placeholder="—" aria-label="Score">
            <span class="gc-muted">out of</span>
            <input class="gc-input gc-input--num" type="number" min="0" step="0.5" data-entry="${i}" data-field="possible" value="${e.possible ?? ''}" aria-label="Points possible">
          </span></td>
          <td class="gc-muted gc-small" data-entry-pct="${i}"></td>
          <td><label class="gc-switch"><input type="checkbox" data-entry="${i}" data-field="whatIf" ${e.whatIf ? 'checked' : ''} aria-label="What-if score"><span></span></label></td>
          <td><button type="button" class="gc-btn gc-btn--icon" data-gc-action="remove-entry" data-index="${i}" title="Remove assignment" aria-label="Remove assignment">✕</button></td>
        </tr>`).join('')}
      </tbody>` : '<tbody><tr><td class="gc-muted">No assignments yet. Add your first one below.</td></tr></tbody>';
    renderEntryPercents();
}

function renderEntryPercents() {
    state.sheet.entries.forEach((e, i) => {
        const cell = state.root.querySelector(`[data-entry-pct="${i}"]`);
        if (!cell) return;
        const ok = e.earned != null && e.earned !== '' && Number(e.possible) > 0;
        cell.textContent = ok ? `${round1(Number(e.earned) / Number(e.possible) * 100)}%` : (e.whatIf ? '' : 'not graded');
    });
}

function renderNeedOptions() {
    const select = state.root.querySelector('[data-gc="need-entry"]');
    const previous = select.value;
    const candidates = state.sheet.entries
        .map((e, i) => ({ e, i }))
        .filter(({ e }) => e.name && Number(e.possible) > 0 && (e.whatIf || e.earned == null || e.earned === ''));
    select.innerHTML = candidates.length
        ? candidates.map(({ e, i }) => `<option value="${i}">${escapeHtml(e.name)} (${e.possible} pts)</option>`).join('')
        : '<option value="">Add an assignment without a score first</option>';
    if (candidates.some(({ i }) => String(i) === previous)) select.value = previous;
}

function renderSummary() {
    const { current, projected } = calculate(state.sheet);
    const hasWhatIf = state.sheet.entries.some((e) => e.whatIf && counts(e, true));
    const delta = current != null && projected != null ? round1(projected - current) : null;
    const pos = (v) => `${Math.max(0, Math.min(100, v))}%`;
    const now = totals(state.sheet.entries, false);
    state.root.querySelector('[data-gc="grade"]').innerHTML = current == null && projected == null ? `
        <div class="gc-grade-empty">Your grade will appear here once you enter a score.</div>` : `
        <div class="gc-grade-top">
          <div><span class="gc-label">Your grade now</span>
            <span class="gc-grade-value">${current == null ? '—' : `${current}%`}</span>
            <span class="gc-letter">${letter(current)}</span>
            ${current == null ? '' : `<span class="gc-muted gc-small">${round1(now.earned)} of ${round1(now.possible)} points</span>`}</div>
          ${hasWhatIf ? `<div class="gc-grade-whatif"><span class="gc-label">With what-if scores</span>
            <span class="gc-grade-value gc-grade-value--sm">${projected}%</span>
            <span class="gc-letter gc-letter--whatif">${letter(projected)}</span>
            ${delta == null ? '' : `<span class="gc-small ${delta >= 0 ? 'gc-up' : 'gc-down'}">${delta > 0 ? '+' : ''}${delta} pts</span>`}</div>` : ''}
        </div>
        <div class="gc-bar" aria-hidden="true">
          <span style="left:0;width:60%" class="gc-band gc-band--f">F</span>
          <span style="left:60%;width:10%" class="gc-band gc-band--d">D</span>
          <span style="left:70%;width:10%" class="gc-band gc-band--c">C</span>
          <span style="left:80%;width:10%" class="gc-band gc-band--b">B</span>
          <span style="left:90%;width:10%" class="gc-band gc-band--a">A</span>
          ${current != null ? `<i class="gc-marker" style="left:${pos(current)}" title="Now ${current}%"></i>` : ''}
          ${hasWhatIf && projected != null ? `<i class="gc-marker gc-marker--whatif" style="left:${pos(projected)}" title="With what-if scores ${projected}%"></i>` : ''}
        </div>`;

    state.root.querySelector('[data-gc="whatif-summary"]').innerHTML = !hasWhatIf
        ? '<span class="gc-muted">No what-if scores yet.</span>'
        : `With your what-if scores you would have <b>${projected}%</b> (${letter(projected)})${delta == null ? '' : `, ${delta === 0 ? 'the same as now' : `${Math.abs(delta)} pts ${delta > 0 ? 'higher' : 'lower'} than now`}`}.`;
    renderEntryPercents();
    renderNeedResult();
}

function renderNeedResult() {
    const out = state.root.querySelector('[data-gc="need-result"]');
    const index = state.root.querySelector('[data-gc="need-entry"]').value;
    const targetSelect = state.root.querySelector('[data-gc="need-target"]').value;
    state.root.querySelector('[data-gc="need-custom-wrap"]').hidden = targetSelect !== 'custom';
    const target = targetSelect === 'custom' ? Number(state.root.querySelector('[data-gc="need-custom"]').value) : Number(targetSelect);
    if (index === '' || !(target >= 0 && target <= 100)) {
        out.textContent = '';
        return;
    }
    const entry = state.sheet.entries[Number(index)];
    const r = neededScore(state.sheet, Number(index), target);
    if (!r) {
        out.textContent = '';
        return;
    }
    const name = escapeHtml(entry.name);
    if (r.status === 'secured') {
        out.innerHTML = `<span class="gc-need-badge gc-need-badge--good">Already there</span> You finish at <b>${target}%</b> or above whatever you get on ${name}. Even a 0 leaves you at ${r.worst}%.`;
    } else if (r.status === 'unreachable') {
        out.innerHTML = `<span class="gc-need-badge gc-need-badge--warn">Out of reach</span> Even a perfect ${r.possible}/${r.possible} on ${name} only gets you to ${r.best}%. Look for other assignments to raise, or ask your teacher about options.`;
    } else {
        out.innerHTML = `<span class="gc-need-badge">You need</span> <b>${r.needed} out of ${r.possible}</b> (${r.percent}%) on ${name}. A 0 would leave you at ${r.worst}%; a perfect score would get you to ${r.best}%.`;
    }
}

// ---------- events ----------

function bind() {
    const root = state.root;
    root.addEventListener('input', (e) => {
        const t = e.target;
        if (t.dataset.entry != null && t.type !== 'checkbox') {
            const entry = state.sheet.entries[Number(t.dataset.entry)];
            entry[t.dataset.field] = t.dataset.field === 'name' ? t.value : (t.value === '' ? null : Number(t.value));
            renderNeedOptions();
            changed();
        } else if (t.dataset.gc === 'need-custom') {
            renderNeedResult();
        }
    });
    root.addEventListener('change', (e) => {
        const t = e.target;
        if (t.dataset.entry != null && t.type === 'checkbox') {
            const entry = state.sheet.entries[Number(t.dataset.entry)];
            entry.whatIf = t.checked;
            t.closest('tr').classList.toggle('gc-whatif', entry.whatIf);
            if (t.checked && (entry.earned == null || entry.earned === '')) {
                t.closest('tr').querySelector('[data-field="earned"]').focus();
            }
            renderNeedOptions();
            changed();
        } else if (t.dataset.gc === 'need-entry' || t.dataset.gc === 'need-target') {
            renderNeedResult();
        } else if (t.dataset.gc === 'class-assignments' && t.value !== '') {
            const a = state.classAssignments[Number(t.value)];
            state.sheet.entries.push({ name: a.name, earned: null, possible: Number(a.points), whatIf: false });
            t.value = '';
            renderAll();
            changed();
        }
    });
    root.addEventListener('click', (e) => {
        const action = e.target.closest('[data-gc-action]');
        if (!action) return;
        switch (action.dataset.gcAction) {
            case 'add-entry':
                state.sheet.entries.push({ name: `Assignment ${state.sheet.entries.length + 1}`, earned: null, possible: 100, whatIf: false });
                break;
            case 'remove-entry':
                state.sheet.entries.splice(Number(action.dataset.index), 1);
                break;
            case 'example':
                setSheet(EXAMPLE_SHEET);
                break;
            case 'clear':
                if (!confirm('Clear all assignments and scores from your grade calculator?')) return;
                setSheet({ entries: [] });
                break;
            default:
                return;
        }
        renderAll();
        changed();
    });
}

function changed() {
    renderSummary();
    setSaveStatus('Saving soon…');
    clearTimeout(state.saveTimer);
    state.saveTimer = setTimeout(save, SAVE_DELAY_MS);
}

async function save() {
    const sheet = { entries: state.sheet.entries.map((e) => ({ name: e.name, earned: e.earned, possible: e.possible, whatIf: !!e.whatIf })) };
    try {
        const res = await fetch(api, { ...fetchOptions, method: 'PUT', body: JSON.stringify(sheet) });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            setSaveStatus(`Not saved yet: ${err.error || `server returned ${res.status}`}. Fix that and it will save.`, true);
            return;
        }
        setSaveStatus(`All changes saved · ${new Date().toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}`);
        if (state.onSaved) state.onSaved();
    } catch (e) {
        setSaveStatus('Not saved: could not reach the server. Your changes are still on this page.', true);
    }
}

function setSaveStatus(text, problem = false) {
    const el = state.root.querySelector('[data-gc="save-status"]');
    if (!el) return;
    el.textContent = text;
    el.classList.toggle('gc-warn', problem);
}

function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function injectStyles() {
    if (document.getElementById('gc-styles')) return;
    const style = document.createElement('style');
    style.id = 'gc-styles';
    // Colors derive from the surrounding text color so the panel fits both dashboard themes.
    style.textContent = `
      .gc { display: grid; gap: 1rem; color: inherit; }
      .gc > div[data-gc="body"] { display: grid; gap: 1rem; }
      .gc [hidden] { display: none !important; }
      .gc-title { font-size: 1.25rem; font-weight: 600; margin: 0 0 .25rem; }
      .gc-h3 { font-size: 1rem; font-weight: 600; margin: 0 0 .15rem; }
      .gc-h4 { font-size: .9rem; font-weight: 600; margin: 0 0 .35rem; }
      .gc-muted { opacity: .7; margin: 0; }
      .gc-small { font-size: .8rem; }
      .gc-label { display: block; font-size: .72rem; text-transform: uppercase; letter-spacing: .04em; opacity: .65; }
      .gc-up { color: #34d399; }
      .gc-down, .gc-warn { color: #fbbf24; }
      .gc-card { border: 1px solid color-mix(in srgb, currentColor 18%, transparent); background: color-mix(in srgb, currentColor 4%, transparent); border-radius: .9rem; padding: 1.1rem 1.25rem; display: grid; gap: .85rem; }
      .gc-step { display: flex; gap: .75rem; align-items: flex-start; }
      .gc-step-num { flex: none; width: 1.75rem; height: 1.75rem; border-radius: 999px; display: grid; place-items: center; font-weight: 700; font-size: .9rem; background: #2563eb; color: #fff; }
      .gc-start { display: flex; flex-wrap: wrap; gap: .4rem .75rem; align-items: center; padding: .8rem 1rem; border-radius: .75rem; background: color-mix(in srgb, #2563eb 12%, transparent); border: 1px solid color-mix(in srgb, #2563eb 35%, transparent); }
      .gc-row { display: flex; gap: .6rem; align-items: center; }
      .gc-row--wrap { flex-wrap: wrap; }
      .gc-row--between { justify-content: space-between; flex-wrap: wrap; }
      .gc-field { display: grid; gap: .25rem; font-size: .85rem; margin-bottom: .5rem; }
      .gc-grade { border-radius: .9rem; padding: 1rem 1.25rem; border: 1px solid color-mix(in srgb, currentColor 18%, transparent); display: grid; gap: .8rem; }
      .gc-grade-empty { opacity: .7; }
      .gc-grade-top { display: flex; flex-wrap: wrap; gap: 1rem 2.5rem; align-items: flex-end; }
      .gc-grade-top > div { display: flex; flex-wrap: wrap; align-items: baseline; gap: .1rem .5rem; }
      .gc-grade-top .gc-label { width: 100%; }
      .gc-grade-value { font-size: 2.2rem; font-weight: 700; line-height: 1.1; }
      .gc-grade-value--sm { font-size: 1.5rem; }
      .gc-letter { font-weight: 700; padding: .05rem .5rem; border-radius: .4rem; background: #2563eb; color: #fff; }
      .gc-letter--whatif { background: #f59e0b; color: #111; }
      .gc-bar { position: relative; height: 1.6rem; border-radius: .5rem; }
      .gc-band { position: absolute; top: 0; height: 100%; display: grid; place-items: center; font-size: .72rem; font-weight: 600; color: rgba(255,255,255,.85); }
      .gc-band--f { background: #7f1d1d; border-radius: .5rem 0 0 .5rem; }
      .gc-band--d { background: #9a3412; }
      .gc-band--c { background: #a16207; }
      .gc-band--b { background: #15803d; }
      .gc-band--a { background: #166534; border-radius: 0 .5rem .5rem 0; }
      .gc-marker { position: absolute; top: -.35rem; width: 4px; height: 2.3rem; margin-left: -2px; background: #fff; border-radius: 2px; box-shadow: 0 0 0 2px #2563eb; }
      .gc-marker--whatif { background: #f59e0b; box-shadow: 0 0 0 2px #111; }
      .gc-table-wrap { overflow-x: auto; }
      .gc-table { width: 100%; border-collapse: collapse; font-size: .88rem; }
      .gc-table th { text-align: left; font-weight: 600; font-size: .72rem; text-transform: uppercase; letter-spacing: .04em; opacity: .65; padding: .35rem .4rem; }
      .gc-table td { padding: .35rem .4rem; border-top: 1px solid color-mix(in srgb, currentColor 12%, transparent); vertical-align: middle; }
      .gc-whatif td { background: color-mix(in srgb, #f59e0b 12%, transparent); }
      .gc-input { width: 100%; min-width: 8rem; box-sizing: border-box; border-radius: .45rem; padding: .4rem .55rem; font: inherit; color: inherit;
        background: color-mix(in srgb, currentColor 6%, transparent); border: 1px solid color-mix(in srgb, currentColor 25%, transparent); }
      .gc-input:focus { outline: 2px solid #2563eb; outline-offset: 1px; }
      .gc-input option { color: #111; }
      .gc-input--num { min-width: 4rem; max-width: 5rem; }
      .gc-input--select { min-width: 9rem; }
      .gc-score { display: inline-flex; align-items: center; gap: .35rem; white-space: nowrap; }
      .gc-switch { position: relative; display: inline-block; width: 2.4rem; height: 1.35rem; cursor: pointer; }
      .gc-switch input { opacity: 0; width: 0; height: 0; position: absolute; }
      .gc-switch span { position: absolute; inset: 0; border-radius: 999px; background: color-mix(in srgb, currentColor 25%, transparent); transition: background .15s; }
      .gc-switch span::after { content: ''; position: absolute; top: .15rem; left: .15rem; width: 1.05rem; height: 1.05rem; border-radius: 999px; background: #fff; transition: transform .15s; }
      .gc-switch input:checked + span { background: #f59e0b; }
      .gc-switch input:checked + span::after { transform: translateX(1.05rem); }
      .gc-switch input:focus-visible + span { outline: 2px solid #2563eb; outline-offset: 2px; }
      .gc-explore { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; }
      .gc-tool { border: 1px dashed color-mix(in srgb, currentColor 25%, transparent); border-radius: .75rem; padding: .9rem 1rem; }
      .gc-need { margin: .25rem 0 0; font-size: .92rem; line-height: 1.5; }
      .gc-need-badge { display: inline-block; font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .03em; padding: .1rem .5rem; border-radius: 999px; background: #2563eb; color: #fff; margin-right: .25rem; }
      .gc-need-badge--good { background: #15803d; }
      .gc-need-badge--warn { background: #b45309; }
      .gc-help { font-size: .88rem; }
      .gc-help summary { cursor: pointer; font-weight: 600; }
      .gc-help ul { margin: .5rem 0 0 1.1rem; padding: 0; display: grid; gap: .35rem; }
      .gc-btn { border: 0; border-radius: .5rem; padding: .45rem .9rem; font: inherit; font-weight: 600; cursor: pointer; background: #2563eb; color: #fff; }
      .gc-btn--ghost { background: transparent; color: inherit; border: 1px solid color-mix(in srgb, currentColor 30%, transparent); font-size: .85rem; }
      .gc-btn--ghost:hover { background: color-mix(in srgb, currentColor 10%, transparent); }
      .gc-btn--icon { background: transparent; color: inherit; opacity: .55; padding: .2rem .45rem; }
      .gc-btn--icon:hover { opacity: 1; color: #f87171; }
      .gc-btn--link { background: transparent; color: inherit; opacity: .6; font-size: .8rem; text-decoration: underline; padding: 0; }
      .gc-btn--link:hover { opacity: 1; color: #f87171; }
      @media (max-width: 520px) { .gc-card { padding: 1rem; } .gc-grade-value { font-size: 1.8rem; } .gc-input { min-width: 6.5rem; } }
    `;
    document.head.appendChild(style);
}
