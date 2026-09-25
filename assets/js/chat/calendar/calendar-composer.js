// The two ways a teacher adds events from the composer. Both can set the same
// fields; only the input differs.

import {
  addDays, appendEventMarkers, buildQuickSyntaxExample, CLASS_PERIODS, DEFAULT_PRIORITY,
  escapeHtml, EVENT_TYPES, formatPeriods, formatShortDate, nextSchoolDay, parseQuickSyntax,
  PRIORITIES, PRIORITY_LABELS, quickDateChoices, todayIso, TYPE_LABELS,
} from './calendar-model.js';

/* ── V1: Add-to-calendar button ──────────────────────────────────────── */

// V1 — "Add to calendar" button in the composer.
// The teacher writes the announcement as usual, clicks 📅, fills a small form,
// and Send posts the message and creates the calendar event together.
// Pattern follows the /calendar modal in _includes/group_dashboard.html.


function firstLine(text) {
  return String(text || '').split('\n').map((line) => line.trim()).find(Boolean)?.slice(0, 80) || '';
}

export function mountAttachForm(ctx) {
  // Students keep the plain composer; only teachers can put things on the class calendar.
  if (!ctx.isTeacher()) return { unmount() {} };

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'calendar-attach-toggle';
  toggle.setAttribute('aria-pressed', 'false');
  toggle.innerHTML = '<i class="fas fa-calendar-plus" aria-hidden="true"></i><span>Add to calendar</span>';
  ctx.slots.composerTools.appendChild(toggle);

  const panel = document.createElement('div');
  panel.className = 'calendar-attach-panel';
  panel.hidden = true;
  const defaultDate = nextSchoolDay(ctx.weeks, addDays(todayIso(), 1));
  panel.innerHTML = `
    <div class="calendar-attach-header">
      <span><i class="fas fa-calendar-plus" aria-hidden="true"></i> Calendar event for this announcement</span>
      <button type="button" class="calendar-attach-close" aria-label="Remove calendar event">&times;</button>
    </div>
    <div class="calendar-attach-grid">
      <label class="calendar-field calendar-field--wide">Title
        <input type="text" name="title" maxlength="120" placeholder="e.g. Unit 3 Quiz">
      </label>
      <label class="calendar-field">Date
        <input type="date" name="date" value="${defaultDate}">
      </label>
      <label class="calendar-field">Type
        <select name="type">${EVENT_TYPES.map((t) => `<option value="${t.value}">${t.label}</option>`).join('')}</select>
      </label>
      <label class="calendar-field calendar-field--full">Details (optional)
        <input type="text" name="description" maxlength="300" placeholder="e.g. One page of handwritten notes allowed">
      </label>
    </div>
    <div class="calendar-quick-dates" role="group" aria-label="Quick dates"></div>
    <div class="calendar-choice-row" role="radiogroup" aria-label="Priority">
      <span class="calendar-choice-label">Priority</span>
      ${PRIORITIES.map((p) => `<button type="button" class="calendar-priority-option" data-priority="${p.value}" role="radio" aria-checked="${p.value === DEFAULT_PRIORITY}">${p.label}</button>`).join('')}
    </div>
    <div class="calendar-choice-row" role="group" aria-label="Class periods">
      <span class="calendar-choice-label">Periods</span>
      ${CLASS_PERIODS.map((p) => `<button type="button" class="calendar-period-option" data-period="${p}" aria-pressed="${ctx.coursePeriods.includes(p)}">${p}</button>`).join('')}
      <span class="calendar-choice-hint">none selected = every period</span>
    </div>
    <p class="calendar-attach-hint">Send posts the announcement <em>and</em> adds an all-day event to the ${ctx.course.toUpperCase()} calendar.</p>
    <p class="calendar-attach-error" role="alert" hidden></p>`;
  ctx.slots.composerPanel.appendChild(panel);

  const titleInput = panel.querySelector('[name="title"]');
  const dateInput = panel.querySelector('[name="date"]');
  const typeSelect = panel.querySelector('[name="type"]');
  const descriptionInput = panel.querySelector('[name="description"]');
  const errorEl = panel.querySelector('.calendar-attach-error');
  let priority = DEFAULT_PRIORITY;

  quickDateChoices(ctx.weeks).forEach(({ label, date }) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'calendar-quick-date';
    chip.textContent = `${label} · ${formatShortDate(date)}`;
    chip.addEventListener('click', () => { dateInput.value = date; });
    panel.querySelector('.calendar-quick-dates').appendChild(chip);
  });

  panel.querySelectorAll('.calendar-priority-option').forEach((option) => {
    option.addEventListener('click', () => {
      priority = option.dataset.priority;
      panel.querySelectorAll('.calendar-priority-option')
        .forEach((o) => o.setAttribute('aria-checked', String(o === option)));
    });
  });

  const periodButtons = [...panel.querySelectorAll('.calendar-period-option')];
  periodButtons.forEach((button) => {
    button.addEventListener('click', () => {
      button.setAttribute('aria-pressed', String(button.getAttribute('aria-pressed') !== 'true'));
    });
  });
  const selectedPeriods = () => periodButtons
    .filter((b) => b.getAttribute('aria-pressed') === 'true').map((b) => b.dataset.period);

  function setOpen(open) {
    panel.hidden = !open;
    toggle.setAttribute('aria-pressed', String(open));
    toggle.classList.toggle('is-active', open);
    errorEl.hidden = true;
    if (open && !titleInput.value) titleInput.value = firstLine(ctx.composer.editor.innerText);
    if (open) titleInput.focus();
  }

  toggle.addEventListener('click', () => setOpen(panel.hidden));
  panel.querySelector('.calendar-attach-close').addEventListener('click', () => setOpen(false));

  function showError(text) {
    errorEl.textContent = text;
    errorEl.hidden = false;
  }

  return {
    async beforeSend({ html }) {
      if (panel.hidden) return { html };
      const title = titleInput.value.trim();
      if (!title) { showError('Give the calendar event a title (or close the panel to send without one).'); return null; }
      if (!dateInput.value) { showError('Pick a date for the event.'); return null; }
      try {
        const event = await ctx.getStore().createEvent({
          title,
          date: dateInput.value,
          type: typeSelect.value,
          priority,
          periods: selectedPeriods(),
          description: descriptionInput.value.trim(),
        });
        return { html: appendEventMarkers(html, [event]) };
      } catch (err) {
        console.error('Announcement calendar demo: create event failed', err);
        showError(`Couldn't create the calendar event: ${err.message}`);
        return null;
      }
    },
    afterSend() {
      titleInput.value = '';
      descriptionInput.value = '';
      dateInput.value = defaultDate;
      setOpen(false);
    },
    unmount() {
      toggle.remove();
      panel.remove();
    },
  };
}

/* ── V2: Quick syntax ────────────────────────────────────────────────── */

// V2 — Slack-style quick syntax.
// The teacher types the weekly plan the way they did in Slack; every
// "[Day]: Title" line is detected live and shown as a chip under the composer.
// Send creates one calendar event per day and posts the message without the
// syntax lines: the teacher's own words stay, the events show as cards.


const tagList = (options) => options.map((o) => `<code>#${o.tags[0]}</code> ${o.label}`).join(', ');

function htmlToText(html) {
  const holder = document.createElement('div');
  holder.innerHTML = html;
  return holder.textContent;
}

// Split the composer HTML into lines on <br>, drop the ones the parser marks
// as syntax, and keep whatever else the teacher wrote (formatting included).
function withoutSyntaxLines(html, parseOptions) {
  const segments = html.split(/<br\s*\/?>/i);
  const { syntaxLines } = parseQuickSyntax(segments.map(htmlToText).join('\n'), parseOptions);
  const kept = segments.filter((_, i) => !syntaxLines[i]);
  while (kept.length && !htmlToText(kept[0]).trim()) kept.shift();
  while (kept.length && !htmlToText(kept[kept.length - 1]).trim()) kept.pop();
  return kept.join('<br>');
}

export function mountQuickSyntax(ctx) {
  if (!ctx.isTeacher()) return { unmount() {} };

  const parseOptions = { weeks: ctx.weeks, schoolYear: ctx.schoolYear, defaultPeriods: ctx.coursePeriods };
  const defaultPeriodsLabel = formatPeriods(ctx.coursePeriods) || 'every period';

  const panel = document.createElement('div');
  panel.className = 'quick-syntax';
  panel.innerHTML = `
    <div class="quick-syntax-header">
      <span class="quick-syntax-title"><i class="fas fa-magic" aria-hidden="true"></i> Detected events</span>
      <span class="quick-syntax-week"></span>
      <button type="button" class="quick-syntax-example">Insert example</button>
    </div>
    <div class="quick-syntax-chips" aria-live="polite"></div>
    <details class="quick-syntax-help">
      <summary>Syntax</summary>
      <ul>
        <li><b>When:</b> <code>[Mon]: Title</code>, a range <code>[Wed - Thu]: Title</code>, or a date <code>[10/9]: Title</code>. <code>Week of 9/28</code> or <code>Week 7</code> picks the week for day names (default: this school week)</li>
        <li><b>Priority:</b> <code>*</code> = High and <code>**</code> = Urgent before the title, or ${tagList(PRIORITIES)} anywhere. Default Normal</li>
        <li><b>Type:</b> ${tagList(EVENT_TYPES)}. Default Daily plan; like in Slack, <code>*</code> also means Check-in and <code>**</code> Graded. Tags win over asterisks</li>
        <li><b>Periods:</b> <code>#P1</code>–<code>#P5</code>, several for more than one (<code>#P3 #P4</code>). Default ${escapeHtml(defaultPeriodsLabel)}</li>
        <li><b>Details:</b> <code>• detail</code> on the next line</li>
        <li><b>Posting:</b> these lines become event cards and are left out of the message; anything else you write is posted as is</li>
        <li><kbd>Shift</kbd>+<kbd>Enter</kbd> for a new line, <kbd>Enter</kbd> sends</li>
      </ul>
    </details>`;
  ctx.slots.composerPanel.appendChild(panel);

  const chipsEl = panel.querySelector('.quick-syntax-chips');
  const weekEl = panel.querySelector('.quick-syntax-week');
  const skipped = new Set();
  let parsed = { entries: [] };

  function render() {
    parsed = parseQuickSyntax(ctx.composer.editor.innerText, parseOptions);
    weekEl.textContent = parsed.entries.some((e) => e.fromWeekday)
      ? `Day names = week of ${formatShortDate(parsed.weekStart)} (${parsed.weekSource})` : '';
    chipsEl.innerHTML = '';
    if (!parsed.entries.length) {
      chipsEl.innerHTML = '<span class="quick-syntax-empty">Type <code>[Mon]: Title</code> on its own line to put it on the calendar.</span>';
      return;
    }
    parsed.entries.forEach((entry) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'quick-syntax-chip';
      chip.setAttribute('aria-pressed', String(!skipped.has(entry.key)));
      chip.title = skipped.has(entry.key) ? 'Skipped — click to include' : 'Click to skip this one';
      const meta = [
        PRIORITY_LABELS[entry.priority],
        TYPE_LABELS[entry.type] || entry.type,
        formatPeriods(entry.periods),
        entry.dates.map(formatShortDate).join(', '),
      ].filter(Boolean).join(' · ');
      chip.innerHTML = `<span class="quick-syntax-chip-day">${escapeHtml(entry.dayLabel)}</span>`
        + `<span class="quick-syntax-chip-title">${escapeHtml(entry.title)}</span>`
        + `<span class="quick-syntax-chip-meta">${escapeHtml(meta)}</span>`;
      chip.addEventListener('click', () => {
        if (skipped.has(entry.key)) skipped.delete(entry.key); else skipped.add(entry.key);
        render();
      });
      chipsEl.appendChild(chip);
    });
  }

  panel.querySelector('.quick-syntax-example').addEventListener('click', () => {
    const example = buildQuickSyntaxExample(ctx.weeks, { periods: ctx.coursePeriods });
    ctx.composer.editor.innerHTML = example.split('\n').map(escapeHtml).join('<br>');
    ctx.composer.editor.dispatchEvent(new Event('input'));
    ctx.composer.focus();
  });

  render();

  return {
    onComposerInput: render,
    async beforeSend({ html }) {
      const wanted = parsed.entries.filter((entry) => !skipped.has(entry.key));
      // Nothing detected, or every chip switched off: post the message as written.
      if (!wanted.length) return { html };
      try {
        const store = ctx.getStore();
        const created = [];
        // One add_event per day (not /add_events): the bulk endpoint forces the
        // events private to the sender, which would hide them from students.
        for (const entry of wanted) {
          for (const date of entry.dates) {
            created.push(await store.createEvent({
              title: entry.title,
              date,
              type: entry.type,
              priority: entry.priority,
              periods: entry.periods,
              description: entry.description,
            }));
          }
        }
        const words = withoutSyntaxLines(html, parseOptions);
        const count = `${created.length} ${created.length === 1 ? 'event' : 'events'}`;
        return { html: appendEventMarkers(words || `📅 Added ${count} to the calendar`, created) };
      } catch (err) {
        console.error('Announcement calendar demo: quick syntax create failed', err);
        chipsEl.insertAdjacentHTML('afterbegin', `<span class="quick-syntax-error" role="alert">Couldn't create events: ${escapeHtml(err.message)}</span>`);
        return null;
      }
    },
    afterSend() { skipped.clear(); render(); },
    unmount() { panel.remove(); },
  };
}
