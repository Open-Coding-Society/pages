// Forecast Retrospective for the Grade Predictor tab of the analytics dashboards.
//
// Every Smart Predict is logged to Spring (/api/grade-forecasts). This panel turns those
// forecasts into a growth loop a student can act on:
//   1. Growth goal: pick one skill and one small action, then check in on a date and see what
//      changed in your rating, your teacher's rating and your records (/api/grade-forecasts/goals).
//   2. Where to focus: a suggested skill, which skill moves the model's forecast most, and
//      questions to ask your teacher where your ratings disagree.
//   3. How well you judge yourself: whether your grade guesses are getting closer to your real
//      grade (from your Grade Calculator; the official gradebook has no API).
import { javaURI, fetchOptions } from '../api/config.js';

// Grade Predictor slider name -> Spring field name and label, in dashboard order.
export const SKILLS = [
    ['attendance', 'attendance', 'Attendance'],
    ['work_habits', 'workHabits', 'Work Habits'],
    ['behavior', 'behavior', 'Behavior'],
    ['timeliness', 'timeliness', 'Timeliness'],
    ['tech_sense', 'techSense', 'Tech Sense'],
    ['tech_talk', 'techTalk', 'Tech Talk'],
    ['tech_growth', 'techGrowth', 'Tech Growth'],
    ['advocacy', 'advocacy', 'Advocacy'],
    ['communication', 'communication', 'Communication'],
    ['integrity', 'integrity', 'Integrity'],
    ['organization', 'organization', 'Organization'],
];
const LABEL = Object.fromEntries(SKILLS.map(([, field, label]) => [field, label]));
const SLIDER = Object.fromEntries(SKILLS.map(([slider, field]) => [field, slider]));
const NOTABLE_GAP = 1; // matches GradeForecastService.NOTABLE_GAP
const DEFAULT_GOAL_DAYS = 14; // matches GrowthGoalService.DEFAULT_DAYS

// Skills a growth goal can target, with a short definition shown when one is picked. AI
// Orchestration is not rated by the predictor, so its goals have no ratings to compare.
export const GOAL_SKILLS = [
    ['attendance', 'Attendance', 'Being in class, on time, and ready to work.'],
    ['workHabits', 'Work Habits', 'Using class time productively and making steady progress.'],
    ['timeliness', 'Timeliness', 'Pacing your work so it is finished and turned in by the deadline.'],
    ['techSense', 'Tech Sense', 'Understanding technical concepts and applying them correctly.'],
    ['techTalk', 'Tech Talk', 'Explaining technical ideas clearly, using the right vocabulary.'],
    ['techGrowth', 'Tech Growth', 'Building new technical skills over time and pushing past what you already know.'],
    ['communication', 'Communication', 'Keeping your team and teacher informed, clearly and on time.'],
    ['integrity', 'Integrity', 'Doing honest work: crediting sources and AI help, and owning your code and mistakes.'],
    ['organization', 'Organization', 'Keeping your tasks, files and code planned, tidy and easy to follow.'],
    ['aiOrchestration', 'AI Orchestration', 'Directing AI tools well: clear prompts, checking and testing what they produce, and understanding what you use.'],
];
const GOAL_LABEL = Object.fromEntries(GOAL_SKILLS.map(([field, label]) => [field, label]));
const DEFINITION = Object.fromEntries(GOAL_SKILLS.map(([field, , definition]) => [field, definition]));
const RATED = new Set(SKILLS.map(([, field]) => field)); // skills the predictor rates

const api = `${javaURI}/api/grade-forecasts`;
let state = { root: null, chart: null, retro: null, goals: null };

/** Renders the panel into root and loads the signed-in user's forecasts and goals. */
export async function initForecastRetrospective(root) {
    if (!root) return;
    injectStyles();
    state.root = root;
    root.innerHTML = `
      <section class="fr">
        <header>
          <h2 class="fr-title">Forecast Retrospective</h2>
          <p class="fr-muted">Use your forecasts to grow: pick one skill, try one small action, and check back to see what changed. Every Smart Predict you run adds to the picture.</p>
        </header>
        <p class="fr-muted" data-fr="status">Loading…</p>
        <div data-fr="body" hidden>
          <div class="fr-card fr-card--goal">
            <div class="fr-step"><span class="fr-step-num">1</span><h3 class="fr-h3">Your growth goal</h3></div>
            <div data-fr="goal"></div>
            <div data-fr="past-goals"></div>
          </div>

          <div class="fr-card">
            <div class="fr-step"><span class="fr-step-num">2</span><h3 class="fr-h3">Where to focus</h3></div>
            <div data-fr="focus-empty" class="fr-muted fr-small" hidden>Run Smart Predict on the sliders above to see how your ratings compare with your teacher's and your records.</div>
            <div data-fr="focus-body">
              <div class="fr-focus" data-fr="focus" hidden></div>
              <div class="fr-levers">
                <button type="button" class="fr-btn fr-btn--ghost" data-fr-action="levers">Which skill would raise my forecast most?</button>
                <div data-fr="levers" class="fr-small"></div>
              </div>
              <div class="fr-table-wrap"><table class="fr-table" data-fr="skills"></table></div>
              <p class="fr-muted fr-small">You · your latest Smart Predict ratings. Teacher · your teacher's evaluation. Records · measured from your submissions (on-time rate). Differences of ${NOTABLE_GAP}+ point are highlighted.</p>
              <div data-fr="questions"></div>
            </div>
          </div>

          <div class="fr-card">
            <div class="fr-step"><span class="fr-step-num">3</span><h3 class="fr-h3">How well do you judge yourself?</h3></div>
            <p class="fr-muted fr-small">Knowing where you stand is a skill. Enter the grade you expect before each Smart Predict; this compares it with your grade in the Grade Calculator at that moment.</p>
            <div data-fr="calibration"></div>
            <div class="fr-tiles" data-fr="tiles"></div>
            <div data-fr="chart-wrap" hidden><div data-fr="chart"></div></div>
          </div>

          <details class="fr-card">
            <summary class="fr-summary">Forecast log</summary>
            <div data-fr="log"></div>
          </details>
        </div>
      </section>`;
    bind();
    await refreshForecastRetrospective();
}

/**
 * Logs one forecast. sliderValues is {slider_name: 1-5} from the Grade Predictor form; guess
 * may be null. Returns the saved forecast, or null when it could not be saved.
 */
export async function recordForecast(sliderValues, modelGrade, guess) {
    const body = { modelGrade, studentGuess: guess };
    SKILLS.forEach(([slider, field]) => { body[field] = sliderValues[slider]; });
    try {
        const res = await fetch(api, { ...fetchOptions, method: 'POST', body: JSON.stringify(body) });
        if (!res.ok) {
            console.warn('Forecast not saved:', res.status, await res.text().catch(() => ''));
            return null;
        }
        return await res.json();
    } catch (e) {
        console.warn('Forecast not saved:', e);
        return null;
    }
}

/** Reloads and redraws the panel. */
export async function refreshForecastRetrospective() {
    if (!state.root) return;
    const status = state.root.querySelector('[data-fr="status"]');
    const body = state.root.querySelector('[data-fr="body"]');
    try {
        const [retroRes, goalsRes] = await Promise.all([fetch(`${api}/retrospective`, fetchOptions), fetch(`${api}/goals`, fetchOptions)]);
        if (retroRes.status === 401 || goalsRes.status === 401) {
            status.textContent = 'Sign in to set growth goals and keep a history of your forecasts.';
            body.hidden = true;
            return;
        }
        if (!retroRes.ok || !goalsRes.ok) throw new Error(`HTTP ${retroRes.status}/${goalsRes.status}`);
        state.retro = await retroRes.json();
        state.goals = await goalsRes.json();
    } catch (e) {
        console.error('Forecast retrospective failed to load:', e);
        status.textContent = 'Could not load your forecasts and goals from the server.';
        body.hidden = true;
        return;
    }
    status.textContent = '';
    body.hidden = false;
    const hasForecasts = state.retro.forecasts.length > 0;
    renderGoal();
    renderPastGoals();
    state.root.querySelector('[data-fr="focus-empty"]').hidden = hasForecasts;
    state.root.querySelector('[data-fr="focus-body"]').hidden = !hasForecasts;
    if (hasForecasts) {
        renderFocus(state.retro.focus);
        renderSkills(state.retro.skills);
        renderQuestions(state.retro.skills);
    }
    renderCalibration(state.retro);
    renderTiles(state.retro);
    renderChart(state.retro);
    renderLog(state.retro.forecasts);
}

// ---------- 1. growth goal ----------

function renderGoal() {
    const box = state.root.querySelector('[data-fr="goal"]');
    const active = state.goals.active;
    if (active) {
        box.innerHTML = activeGoalHtml(active);
        return;
    }
    // The suggested focus can be a skill goals don't offer; then start from the default instead.
    const focus = GOAL_LABEL[state.retro.focus?.skill] ? state.retro.focus : null;
    const suggested = focus?.skill || 'timeliness';
    box.innerHTML = `
      <p class="fr-small">Choose <b>one</b> skill and <b>one</b> small action to try for the next two weeks. Small and specific beats big and vague.</p>
      ${focus ? `<p class="fr-hint">💡 Suggested: <b>${GOAL_LABEL[suggested]}</b>. ${escapeHtml(focus.reason)}</p>` : ''}
      <form data-fr="goal-form" class="fr-form">
        <label class="fr-field"><span>Skill</span>
          <select name="skill" class="fr-input">${GOAL_SKILLS.map(([f, l]) => `<option value="${f}" ${f === suggested ? 'selected' : ''}>${l}${f === suggested && focus ? ' (suggested)' : ''}</option>`).join('')}</select>
          <span class="fr-definition" data-fr="skill-definition">${escapeHtml(DEFINITION[suggested])}</span>
        </label>
        <label class="fr-field"><span>Your action</span>
          <textarea name="action" rows="2" maxlength="200" class="fr-input" placeholder="What will you do differently, and how will you know it worked?"></textarea>
        </label>
        <label class="fr-field fr-field--inline"><span>Check in on</span>
          <input type="date" name="checkInDate" class="fr-input fr-input--date" value="${isoDate(addDays(new Date(), DEFAULT_GOAL_DAYS))}" min="${isoDate(addDays(new Date(), 1))}" max="${isoDate(addDays(new Date(), 60))}">
        </label>
        <div class="fr-row">
          <button type="submit" class="fr-btn">Start my goal</button>
          <span class="fr-small fr-warn" data-fr="goal-error" role="alert"></span>
        </div>
      </form>`;
}

function activeGoalHtml(g) {
    const days = daysUntil(g.checkInDate);
    const when = g.due ? '<span class="fr-pill fr-pill--due">Time to check in</span>'
        : `<span class="fr-muted fr-small">Check in on ${fmtDate(g.checkInDate)} · ${days} day${days === 1 ? '' : 's'} to go</span>`;
    const now = g.now || {};
    const row = (label, start, current, note) => `
      <tr><td>${label}</td><td>${fmt(start)}</td><td>${fmt(current)}</td><td>${change(start, current)}</td><td class="fr-muted fr-small">${note || ''}</td></tr>`;
    return `
      <div class="fr-goal-head">
        <div><span class="fr-label">Working on</span><strong class="fr-goal-skill">${GOAL_LABEL[g.skill]}</strong></div>
        ${when}
      </div>
      <p class="fr-goal-action">“${escapeHtml(g.action)}”</p>
      ${!RATED.has(g.skill) ? `<p class="fr-muted fr-small">${GOAL_LABEL[g.skill]} isn't rated by the predictor, so your check-in is about what you did and what you learned.</p>` : `
      <div class="fr-table-wrap"><table class="fr-table fr-table--compact">
        <thead><tr><th>Since ${fmtDate(g.createdAt)}</th><th>Start</th><th>Now</th><th></th><th></th></tr></thead>
        <tbody>
          ${row('Your rating', g.startSelf, now.self, 'update it with Smart Predict')}
          ${row("Teacher's rating", g.startTeacher, now.teacher, now.teacher == null ? 'not evaluated yet' : '')}
          ${g.skill === 'timeliness' ? row('Records', g.startEvidence, now.evidence, now.evidenceDetail || '') : ''}
        </tbody>
      </table></div>`}
      <form data-fr="checkin-form" class="fr-form">
        <span class="fr-field"><span>How did it go?</span>
          <span class="fr-choices" role="radiogroup">
            <label><input type="radio" name="outcome" value="DID_IT"><span>✅ I did it</span></label>
            <label><input type="radio" name="outcome" value="PARTLY"><span>🌗 Partly</span></label>
            <label><input type="radio" name="outcome" value="NOT_YET"><span>⏳ Not yet</span></label>
          </span>
        </span>
        <label class="fr-field"><span>What did you learn? What will you keep doing? <em class="fr-muted">(optional)</em></span>
          <textarea name="note" rows="2" maxlength="300" class="fr-input"></textarea></label>
        <div class="fr-row">
          <button type="submit" class="fr-btn">${g.due ? 'Check in' : 'Check in early'}</button>
          <button type="button" class="fr-btn fr-btn--link" data-fr-action="drop-goal" data-id="${g.id}">Drop this goal</button>
          <span class="fr-small fr-warn" data-fr="checkin-error" role="alert"></span>
        </div>
      </form>`;
}

function renderPastGoals() {
    const box = state.root.querySelector('[data-fr="past-goals"]');
    const { finished, completed, improved } = state.goals;
    if (!finished.length) {
        box.innerHTML = '';
        return;
    }
    const outcome = { DID_IT: ['✅ Did it', 'good'], PARTLY: ['🌗 Partly', ''], NOT_YET: ['⏳ Not yet', 'warn'] };
    box.innerHTML = `
      <details class="fr-past">
        <summary>Past goals · ${completed} finished, ${improved} improved a rating</summary>
        <ul class="fr-past-list">${finished.map((g) => `
          <li>
            <div class="fr-row fr-row--wrap"><strong>${GOAL_LABEL[g.skill]}</strong>
              <span class="fr-pill fr-pill--${outcome[g.outcome][1]}">${outcome[g.outcome][0]}</span>
              ${g.improved ? '<span class="fr-pill fr-pill--good">rating went up</span>' : ''}
              <span class="fr-muted fr-small">${fmtDate(g.createdAt)} – ${fmtDate(g.checkedInAt)}</span></div>
            <div class="fr-small">“${escapeHtml(g.action)}”</div>
            ${!RATED.has(g.skill) ? '' : `<div class="fr-muted fr-small">Teacher ${fmt(g.startTeacher)} → ${fmt(g.endTeacher)}${g.skill === 'timeliness' ? ` · Records ${fmt(g.startEvidence)} → ${fmt(g.endEvidence)}` : ''} · You ${fmt(g.startSelf)} → ${fmt(g.endSelf)}</div>`}
            ${g.note ? `<div class="fr-small fr-note">${escapeHtml(g.note)}</div>` : ''}
          </li>`).join('')}
        </ul>
      </details>`;
}

async function startGoal(form) {
    const error = state.root.querySelector('[data-fr="goal-error"]');
    const action = form.elements.action.value;
    if (!action.trim()) {
        error.textContent = 'Write the action you will take.';
        return;
    }
    const res = await fetch(`${api}/goals`, {
        ...fetchOptions, method: 'POST',
        body: JSON.stringify({ skill: form.elements.skill.value, action, checkInDate: form.elements.checkInDate.value || null }),
    });
    if (!res.ok) {
        error.textContent = (await res.json().catch(() => ({}))).error || `Could not start the goal (${res.status}).`;
        return;
    }
    await refreshForecastRetrospective();
}

async function checkIn(form) {
    const error = state.root.querySelector('[data-fr="checkin-error"]');
    const outcome = form.querySelector('input[name="outcome"]:checked')?.value;
    if (!outcome) {
        error.textContent = 'Choose how it went.';
        return;
    }
    const res = await fetch(`${api}/goals/${state.goals.active.id}/check-in`, {
        ...fetchOptions, method: 'POST', body: JSON.stringify({ outcome, note: form.elements.note.value }),
    });
    if (!res.ok) {
        error.textContent = (await res.json().catch(() => ({}))).error || `Could not check in (${res.status}).`;
        return;
    }
    await refreshForecastRetrospective();
    state.root.querySelector('[data-fr="past-goals"] details')?.setAttribute('open', '');
}

// ---------- 2. where to focus ----------

function renderFocus(focus) {
    const box = state.root.querySelector('[data-fr="focus"]');
    box.hidden = !focus;
    if (focus) {
        box.innerHTML = `<span class="fr-label">Suggested focus</span><strong>${escapeHtml(LABEL[focus.skill] || focus.skill)}</strong><span>${escapeHtml(focus.reason)}</span>`;
    }
}

function renderSkills(skills) {
    const gapCell = (gap) => {
        if (gap == null) return '<td class="fr-muted">—</td>';
        if (gap >= NOTABLE_GAP) return `<td><span class="fr-pill fr-pill--warn" title="You rate yourself higher">you +${gap}</span></td>`;
        if (gap <= -NOTABLE_GAP) return `<td><span class="fr-pill fr-pill--good" title="You rate yourself lower">you ${gap}</span></td>`;
        return '<td><span class="fr-pill">agree</span></td>';
    };
    const moved = (d) => (d == null || d === 0 ? '' : ` <span class="fr-small ${d > 0 ? 'fr-up' : 'fr-down'}" title="Since your first forecast">${d > 0 ? '▲' : '▼'}${Math.abs(d)}</span>`);
    state.root.querySelector('[data-fr="skills"]').innerHTML = `
      <thead><tr><th>Skill</th><th>You</th><th>Teacher</th><th>Gap</th><th>Records</th><th>Gap</th></tr></thead>
      <tbody>${skills.map((s) => `
        <tr>
          <td>${LABEL[s.skill] || escapeHtml(s.skill)}</td>
          <td>${fmt(s.self)}${moved(s.changeSinceFirst)}</td>
          <td>${fmt(s.teacher)}</td>
          ${gapCell(s.teacherGap)}
          <td title="${escapeHtml(s.evidenceDetail || '')}">${s.evidence == null ? '<span class="fr-muted">—</span>' : `${s.evidence} <span class="fr-muted fr-small">${escapeHtml(s.evidenceDetail)}</span>`}</td>
          ${gapCell(s.evidenceGap)}
        </tr>`).join('')}
      </tbody>`;
}

/** Turns rating gaps with the teacher into questions the student can bring to a conference. */
function renderQuestions(skills) {
    const box = state.root.querySelector('[data-fr="questions"]');
    const questions = skills.filter((s) => s.teacherGap != null && Math.abs(s.teacherGap) >= NOTABLE_GAP)
        .sort((a, b) => Math.abs(b.teacherGap) - Math.abs(a.teacherGap))
        .slice(0, 3)
        .map((s) => (s.teacherGap > 0
            ? `I rated myself ${s.self} in ${LABEL[s.skill]} and you rated me ${fmt(s.teacher)}. What would a ${s.self} look like in class?`
            : `You rated me ${fmt(s.teacher)} in ${LABEL[s.skill]}, higher than my ${s.self}. What are you seeing that I should keep doing?`));
    state.questions = questions;
    box.innerHTML = !questions.length ? '' : `
      <div class="fr-questions">
        <span class="fr-label">Questions to ask your teacher</span>
        ${questions.map((q, i) => `<div class="fr-question"><span>“${escapeHtml(q)}”</span><button type="button" class="fr-btn fr-btn--ghost fr-btn--sm" data-fr-action="copy" data-index="${i}">Copy</button></div>`).join('')}
      </div>`;
}

/**
 * Asks the grade model how much one more point in each skill would raise the forecast, from
 * the latest ratings. The model learned from sample records, so this is a hint, not a promise.
 */
async function showLevers() {
    const out = state.root.querySelector('[data-fr="levers"]');
    const ratings = Object.fromEntries(state.retro.skills.map((s) => [SLIDER[s.skill], s.self]));
    if (Object.values(ratings).some((v) => v == null)) {
        out.textContent = 'Run Smart Predict first so there are ratings to test.';
        return;
    }
    out.textContent = 'Asking the model…';
    try {
        const predict = async (body) => {
            const call = () => fetch(`${javaURI}/api/grade-prediction/predict`, { ...fetchOptions, method: 'POST', body: JSON.stringify(body) });
            let res = await call();
            if (res.status === 400) { // the model lives in memory and needs training again after a restart
                await fetch(`${javaURI}/api/grade-prediction/train`, fetchOptions);
                res = await call();
            }
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return (await res.json()).predicted_final_grade;
        };
        const base = await predict(ratings);
        const results = [];
        for (const [slider, field] of SKILLS) {
            if (ratings[slider] >= 5) continue;
            const raised = await predict({ ...ratings, [slider]: ratings[slider] + 1 });
            results.push({ field, gain: Math.round((raised - base) * 10) / 10 });
        }
        const top = results.filter((r) => r.gain > 0).sort((a, b) => b.gain - a.gain).slice(0, 3);
        out.innerHTML = !top.length
            ? 'One more point in any single skill barely moves the model right now. Pick the skill that matters most to you.'
            : `One more point would raise your forecast most in: ${top.map((r) => `<b>${LABEL[r.field]}</b> (+${r.gain})`).join(', ')}.
               <span class="fr-muted">The model learned from sample data, so treat this as a hint.</span>`;
    } catch (e) {
        console.warn('Lever check failed:', e);
        out.textContent = 'The grade model is not available right now.';
    }
}

// ---------- 3. how well you judge yourself ----------

function renderCalibration(retro) {
    const box = state.root.querySelector('[data-fr="calibration"]');
    const c = retro.calibration;
    const lean = retro.guess.bias == null || Math.abs(retro.guess.bias) < 1 ? ''
        : ` On average you guess <b>${Math.abs(retro.guess.bias)} pts ${retro.guess.bias > 0 ? 'high' : 'low'}</b>${retro.guess.bias > 0 ? ', so check your recent scores before you guess.' : ', so you may be underselling yourself.'}`;
    let message;
    if (!c.gaps.length) {
        message = retro.forecasts.length
            ? 'No guesses to compare yet. Type the grade you expect next to Smart Predict, and add scores to the Grade Calculator.'
            : 'Run Smart Predict with a guess to start.';
    } else if (c.gaps.length === 1) {
        message = `Your guess was <b>${c.latest} pts</b> from your grade at the time. Guess again next time to see a trend.`;
    } else if (c.change < 0) {
        message = `<span class="fr-up">Getting sharper.</span> Your guesses went from <b>${c.first}</b> to <b>${c.latest} pts</b> off.`;
    } else if (c.change > 0) {
        message = `<span class="fr-down">Drifting.</span> Your guesses went from <b>${c.first}</b> to <b>${c.latest} pts</b> off.`;
    } else {
        message = `Steady: your guesses are about <b>${c.latest} pts</b> off.`;
    }
    const spark = c.gaps.length >= 2 ? sparkline(c.gaps) : '';
    box.innerHTML = `<div class="fr-calibration"><div>${message}${lean}</div>${spark}</div>`;
}

function sparkline(values) {
    const w = 140;
    const h = 36;
    const max = Math.max(...values, 1);
    const pts = values.map((v, i) => `${(i / (values.length - 1)) * (w - 4) + 2},${h - 2 - (v / max) * (h - 6)}`).join(' ');
    return `<svg class="fr-spark" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="Gap between your guess and your grade, oldest to newest"><polyline points="${pts}" fill="none" stroke="currentColor" stroke-width="2"/></svg>`;
}

function renderTiles(retro) {
    const tile = (label, value, note) => `
      <div class="fr-tile"><span class="fr-label">${label}</span><span class="fr-tile-value">${value}</span><span class="fr-muted fr-small">${note}</span></div>`;
    state.root.querySelector('[data-fr="tiles"]').innerHTML = [
        tile('Your grade now', fmt(retro.currentGrade, '%'), retro.currentGrade == null ? 'add scores in the Grade Calculator' : 'from your Grade Calculator'),
        tile('Your guesses', biasText(retro.guess), accuracyNote(retro.guess, 'guess')),
        tile('The model', biasText(retro.model), accuracyNote(retro.model, 'forecast')),
    ].join('');
}

function biasText(accuracy) {
    if (accuracy.bias == null) return '—';
    if (Math.abs(accuracy.bias) < 1) return 'On target';
    return `${Math.abs(accuracy.bias)} pts ${accuracy.bias > 0 ? 'high' : 'low'}`;
}

function accuracyNote(accuracy, noun) {
    if (!accuracy.forecasts) return `no ${plural(noun, 2)} yet`;
    const count = `${accuracy.forecasts} ${plural(noun, accuracy.forecasts)}`;
    if (accuracy.meanError == null) return `${count}; add scores in the Grade Calculator to check them`;
    return `vs. your grade now, over ${count}`;
}

function plural(noun, count) {
    if (count === 1) return noun;
    return noun.endsWith('s') ? `${noun}es` : `${noun}s`;
}

function renderChart(retro) {
    const wrap = state.root.querySelector('[data-fr="chart-wrap"]');
    if (state.chart) state.chart.destroy();
    state.chart = null;
    if (!window.ApexCharts || retro.forecasts.length < 2) {
        wrap.hidden = true;
        return;
    }
    wrap.hidden = false;
    const options = {
        chart: { type: 'line', height: 260, toolbar: { show: false }, background: 'transparent', zoom: { enabled: false } },
        series: [
            { name: 'Your guess', data: retro.forecasts.map((f) => f.studentGuess) },
            { name: 'Your grade at the time', data: retro.forecasts.map((f) => f.currentGrade) },
            { name: 'Model forecast', data: retro.forecasts.map((f) => f.modelGrade) },
        ],
        colors: ['#f59e0b', '#34d399', '#60a5fa'],
        stroke: { width: [2, 2, 2], dashArray: [0, 0, 4], curve: 'straight' },
        markers: { size: 4 },
        xaxis: { categories: retro.forecasts.map((f) => fmtDate(f.createdAt)), labels: { style: { colors: '#9ca3af' } } },
        yaxis: { min: 0, max: 100, tickAmount: 5, labels: { style: { colors: '#9ca3af' } } },
        grid: { borderColor: 'rgba(148,163,184,0.25)' },
        legend: { labels: { colors: '#d1d5db' } },
        theme: { mode: 'dark' },
        tooltip: { theme: 'dark', y: { formatter: (v) => (v == null ? '—' : `${v}%`) } },
    };
    state.chart = new window.ApexCharts(state.root.querySelector('[data-fr="chart"]'), options);
    state.chart.render();
}

function renderLog(forecasts) {
    state.root.querySelector('[data-fr="log"]').innerHTML = !forecasts.length ? '<p class="fr-muted fr-small">No forecasts yet.</p>' : `
      <div class="fr-table-wrap"><table class="fr-table">
        <thead><tr><th>When</th><th>Model</th><th>Your guess</th><th>Your grade then</th><th></th></tr></thead>
        <tbody>${[...forecasts].reverse().map((f) => `
          <tr>
            <td>${fmtDate(f.createdAt, true)}</td>
            <td>${fmt(f.modelGrade, '%')}</td>
            <td>${fmt(f.studentGuess, '%')}</td>
            <td>${fmt(f.currentGrade, '%')}</td>
            <td><button type="button" class="fr-btn fr-btn--link" data-fr-action="delete-forecast" data-id="${f.id}">Remove</button></td>
          </tr>`).join('')}
        </tbody>
      </table></div>`;
}

// ---------- events ----------

function bind() {
    const root = state.root;
    root.addEventListener('submit', (e) => {
        if (e.target.matches('[data-fr="goal-form"]')) {
            e.preventDefault();
            startGoal(e.target);
        } else if (e.target.matches('[data-fr="checkin-form"]')) {
            e.preventDefault();
            checkIn(e.target);
        }
    });
    root.addEventListener('change', (e) => {
        if (e.target.name === 'skill' && e.target.closest('[data-fr="goal-form"]')) {
            state.root.querySelector('[data-fr="skill-definition"]').textContent = DEFINITION[e.target.value];
        }
    });
    root.addEventListener('click', async (e) => {
        const button = e.target.closest('[data-fr-action]');
        if (!button) return;
        const id = button.dataset.id;
        switch (button.dataset.frAction) {
            case 'levers':
                await showLevers();
                break;
            case 'copy':
                try {
                    await navigator.clipboard.writeText(state.questions[Number(button.dataset.index)]);
                    button.textContent = 'Copied';
                } catch (err) {
                    button.textContent = 'Select and copy';
                }
                break;
            case 'drop-goal':
                if (!confirm('Drop this goal? It will be removed without a check-in.')) return;
                await fetch(`${api}/goals/${id}`, { ...fetchOptions, method: 'DELETE' });
                await refreshForecastRetrospective();
                break;
            case 'delete-forecast':
                if (!confirm('Remove this forecast from your history?')) return;
                await fetch(`${api}/${id}`, { ...fetchOptions, method: 'DELETE' });
                await refreshForecastRetrospective();
                break;
            default:
        }
    });
}

// ---------- helpers ----------

function fmt(value, suffix = '') {
    return value == null ? '—' : `${value}${suffix}`;
}

function change(before, after) {
    if (before == null || after == null) return '';
    const d = Math.round((after - before) * 10) / 10;
    if (d === 0) return '<span class="fr-muted fr-small">no change</span>';
    return `<span class="fr-small ${d > 0 ? 'fr-up' : 'fr-down'}">${d > 0 ? '▲' : '▼'} ${Math.abs(d)}</span>`;
}

function parseDate(iso) {
    // A bare yyyy-mm-dd is a calendar date; parse it as local midnight, not UTC.
    if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
        const [y, m, d] = iso.split('-').map(Number);
        return new Date(y, m - 1, d);
    }
    return new Date(iso);
}

function fmtDate(iso, withTime = false) {
    if (!iso) return '';
    const options = withTime ? { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' } : { month: 'short', day: 'numeric' };
    return parseDate(iso).toLocaleString(undefined, options);
}

function daysUntil(iso) {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return Math.round((parseDate(iso) - start) / 86400000);
}

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function isoDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function injectStyles() {
    if (document.getElementById('fr-styles')) return;
    const style = document.createElement('style');
    style.id = 'fr-styles';
    // Colors derive from the surrounding text color so the panel fits both dashboard themes.
    style.textContent = `
      .fr { display: grid; gap: 1rem; color: inherit; }
      .fr > div[data-fr="body"] { display: grid; gap: 1rem; }
      .fr [hidden] { display: none !important; }
      .fr-title { font-size: 1.25rem; font-weight: 600; margin: 0 0 .25rem; }
      .fr-h3 { font-size: 1rem; font-weight: 600; margin: 0; }
      .fr-summary { cursor: pointer; font-weight: 600; }
      .fr-muted { opacity: .7; margin: 0; }
      .fr-small { font-size: .8rem; }
      .fr-label { display: block; font-size: .72rem; text-transform: uppercase; letter-spacing: .04em; opacity: .65; }
      .fr-up { color: #34d399; }
      .fr-down, .fr-warn { color: #fbbf24; }
      .fr-card { border: 1px solid color-mix(in srgb, currentColor 18%, transparent); background: color-mix(in srgb, currentColor 4%, transparent); border-radius: .9rem; padding: 1.1rem 1.25rem; display: grid; gap: .8rem; }
      .fr-card--goal { border-color: color-mix(in srgb, #34d399 45%, transparent); }
      .fr-step { display: flex; gap: .65rem; align-items: center; }
      .fr-step-num { flex: none; width: 1.75rem; height: 1.75rem; border-radius: 999px; display: grid; place-items: center; font-weight: 700; font-size: .9rem; background: #059669; color: #fff; }
      .fr-hint { margin: 0; padding: .6rem .8rem; border-radius: .6rem; background: color-mix(in srgb, #60a5fa 12%, transparent); font-size: .88rem; }
      .fr-form { display: grid; gap: .75rem; }
      .fr-field { display: grid; gap: .3rem; font-size: .88rem; border: 0; padding: 0; margin: 0; }
      .fr-field legend { padding: 0; margin-bottom: .3rem; }
      .fr-field--inline { grid-template-columns: auto auto; justify-content: start; align-items: center; gap: .6rem; }
      .fr-input { box-sizing: border-box; width: 100%; border-radius: .45rem; padding: .4rem .55rem; font: inherit; color: inherit;
        background: color-mix(in srgb, currentColor 6%, transparent); border: 1px solid color-mix(in srgb, currentColor 25%, transparent); }
      .fr-input:focus { outline: 2px solid #059669; outline-offset: 1px; }
      .fr-input option { color: #111; }
      .fr-input--date { width: auto; color-scheme: dark light; }
      .fr-definition { font-size: .8rem; opacity: .75; }
      .fr-choices { display: flex; flex-wrap: wrap; gap: .5rem; }
      .fr-choices label { cursor: pointer; position: relative; }
      .fr-choices input { position: absolute; opacity: 0; }
      .fr-choices span { display: inline-block; padding: .4rem .8rem; border-radius: 999px; border: 1px solid color-mix(in srgb, currentColor 30%, transparent); font-size: .88rem; }
      .fr-choices input:checked + span { background: #059669; color: #fff; border-color: #059669; }
      .fr-choices input:focus-visible + span { outline: 2px solid #059669; outline-offset: 2px; }
      .fr-row { display: flex; gap: .75rem; align-items: center; flex-wrap: wrap; }
      .fr-row--wrap { gap: .4rem .6rem; }
      .fr-goal-head { display: flex; justify-content: space-between; align-items: flex-end; gap: .5rem; flex-wrap: wrap; }
      .fr-goal-skill { font-size: 1.3rem; }
      .fr-goal-action { margin: 0; font-size: 1rem; font-style: italic; }
      .fr-past summary { cursor: pointer; font-size: .88rem; font-weight: 600; }
      .fr-past-list { list-style: none; margin: .6rem 0 0; padding: 0; display: grid; gap: .6rem; }
      .fr-past-list li { padding: .6rem .75rem; border-radius: .6rem; border: 1px solid color-mix(in srgb, currentColor 14%, transparent); display: grid; gap: .25rem; }
      .fr-note { border-left: 2px solid color-mix(in srgb, currentColor 30%, transparent); padding-left: .5rem; }
      .fr-focus { display: flex; flex-wrap: wrap; gap: .25rem .6rem; align-items: baseline; border-left: 3px solid #60a5fa; padding: .7rem 1rem; border-radius: .5rem; background: color-mix(in srgb, #60a5fa 10%, transparent); }
      .fr-focus .fr-label { width: 100%; }
      .fr-levers { display: grid; gap: .4rem; justify-items: start; }
      .fr-questions { display: grid; gap: .4rem; }
      .fr-question { display: flex; justify-content: space-between; gap: .75rem; align-items: center; padding: .5rem .7rem; border-radius: .5rem; background: color-mix(in srgb, currentColor 6%, transparent); font-size: .88rem; }
      .fr-calibration { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; font-size: .95rem; }
      .fr-spark { color: #f59e0b; flex: none; }
      .fr-tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: .75rem; }
      .fr-tile { border: 1px solid color-mix(in srgb, currentColor 18%, transparent); border-radius: .75rem; padding: .8rem 1rem; display: flex; flex-direction: column; gap: .15rem; }
      .fr-tile-value { font-size: 1.3rem; font-weight: 600; }
      .fr-table-wrap { overflow-x: auto; }
      .fr-table { width: 100%; border-collapse: collapse; font-size: .88rem; }
      .fr-table th { text-align: left; font-weight: 600; font-size: .72rem; text-transform: uppercase; letter-spacing: .04em; opacity: .65; padding: .4rem .5rem; }
      .fr-table td { padding: .45rem .5rem; border-top: 1px solid color-mix(in srgb, currentColor 12%, transparent); vertical-align: middle; }
      .fr-table--compact td { padding: .3rem .5rem; }
      .fr-pill { font-size: .72rem; padding: .1rem .5rem; border-radius: 999px; border: 1px solid color-mix(in srgb, currentColor 35%, transparent); white-space: nowrap; }
      .fr-pill--good { color: #34d399; border-color: currentColor; }
      .fr-pill--warn { color: #fbbf24; border-color: currentColor; }
      .fr-pill--due { color: #fff; background: #059669; border-color: #059669; }
      .fr-btn { border: 0; border-radius: .5rem; padding: .45rem .95rem; font: inherit; font-weight: 600; cursor: pointer; background: #059669; color: #fff; }
      .fr-btn:hover { background: #047857; }
      .fr-btn--ghost { background: transparent; color: inherit; border: 1px solid color-mix(in srgb, currentColor 30%, transparent); font-weight: 500; font-size: .85rem; }
      .fr-btn--ghost:hover { background: color-mix(in srgb, currentColor 10%, transparent); }
      .fr-btn--sm { padding: .2rem .6rem; font-size: .78rem; flex: none; }
      .fr-btn--link { background: transparent; color: inherit; opacity: .65; font-weight: 400; font-size: .8rem; text-decoration: underline; padding: 0; }
      .fr-btn--link:hover { background: transparent; opacity: 1; color: #f87171; }
      @media (max-width: 520px) { .fr-card { padding: 1rem; } .fr-question { flex-direction: column; align-items: flex-start; } }
    `;
    document.head.appendChild(style);
}
