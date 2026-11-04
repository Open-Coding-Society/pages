// "Form groups" (teachers and admins): the persona-based grouping from the Wayfinding
// capstone. It takes everyone already in a group for one class and period, asks Flask
// how many have picked a persona on their Profile, and has Flask suggest groups when enough have;
// otherwise the groups are random. Students can be moved and groups locked before the
// unlocked ones are regrouped, and Save makes each group with its members.
import { button, cell, createDialog } from './dialogs.js';
import {
  PERSONAS, createRequests, formationError, moveMember, priorExperienceRow, randomGroups, renameGroups, replaceUnlocked,
  stagedGroups, studentsInClass, toggleLock, unlockedStudents, useAiGrouping,
} from './formation-model.js';

export function initGroupFormation({ elements, api, onSaved }) {
  let staged = [];
  let plan = null; // { course, period, size, prefix, byPersona, feedbackRows } behind the staged groups
  let busy = false;

  elements.pastPersonas.replaceChildren(...PERSONAS.map(persona => {
    const label = document.createElement('label');
    label.className = 'ocs__toggle';
    const input = document.createElement('input');
    input.className = 'ocs__toggle-input';
    input.type = 'checkbox';
    input.value = persona;
    const track = document.createElement('span');
    track.className = 'ocs__toggle-track';
    const text = document.createElement('span');
    text.className = 'ocs__toggle-label';
    text.textContent = persona;
    label.append(input, track, text);
    return label;
  }));

  function setBusy(value, text) {
    busy = value;
    [elements.suggest, elements.regroup, elements.save].forEach(control => { control.disabled = value; });
    if (text !== undefined) elements.status.textContent = text;
  }

  // Group names are unique across the site, so the default prefix names the class and
  // period: "CSA P3 Team A" for period 3 doesn't collide with period 4's.
  function readPlan() {
    const course = elements.course.value;
    const period = elements.period.value;
    return {
      course,
      period,
      size: Number.parseInt(elements.size.value, 10),
      prefix: elements.prefix.value.trim() || `${course} P${period} Team`,
    };
  }

  function pastGroupRows() {
    if (!elements.past.open) return [];
    return [priorExperienceRow({
      size: elements.pastSize.value,
      studentRating: elements.pastStudentRating.value,
      teacherRating: elements.pastTeacherRating.value,
      personas: [...elements.pastPersonas.querySelectorAll('input:checked')].map(input => input.value),
      note: elements.pastNote.value,
    }, Date.now())];
  }

  async function groupStudents(students, size, feedbackRows, byPersona) {
    if (byPersona) {
      try {
        const suggestion = await api.formGroups(students.map(student => student.uid), size, feedbackRows);
        if (Array.isArray(suggestion?.groups)) return { suggestion, byPersona: true };
      } catch (error) {
        console.warn('Messages: Flask could not form groups, so they are random', error);
      }
    }
    return { suggestion: { groups: randomGroups(students, size) }, byPersona: false };
  }

  function moveSelect(index, member) {
    const select = document.createElement('select');
    select.className = 'ocs__input';
    select.setAttribute('aria-label', `Move ${member.name} to another group`);
    select.append(new Option('Stays here', String(index)));
    staged.forEach((group, other) => {
      if (other !== index) select.append(new Option(`Move to ${group.name}`, String(other)));
    });
    select.addEventListener('change', () => {
      staged = moveMember(staged, index, member.uid, Number(select.value));
      render();
    });
    return select;
  }

  function groupCard(group, index) {
    const card = document.createElement('section');
    card.className = 'ocs__card';
    const header = document.createElement('div');
    header.className = 'ocs__card-header';
    const title = document.createElement('h4');
    title.className = 'ocs__section-title';
    title.textContent = typeof group.score === 'number' ? `${group.name} · score ${group.score.toFixed(1)}` : group.name;
    const lock = button(group.locked ? 'Locked' : 'Lock', group.locked ? 'ocs__btn small accent fill' : 'ocs__btn small', () => {
      staged = toggleLock(staged, index);
      render();
    });
    lock.setAttribute('aria-pressed', String(group.locked));
    header.append(title, lock);

    const rows = group.members.map(member => {
      const row = document.createElement('tr');
      const move = document.createElement('td');
      move.appendChild(moveSelect(index, member));
      row.append(cell(`${member.name} (@${member.uid})`), move);
      return row;
    });
    const wrap = document.createElement('div');
    wrap.className = 'ocs__table-wrap';
    const table = document.createElement('table');
    table.className = 'ocs__table';
    const body = document.createElement('tbody');
    body.append(...rows);
    table.appendChild(body);
    wrap.appendChild(table);
    card.append(header, wrap);
    return card;
  }

  function render() {
    elements.staging.classList.toggle('hidden', staged.length === 0);
    elements.groups.replaceChildren(...staged.map(groupCard));
  }

  async function suggest(event) {
    event.preventDefault();
    if (busy) return;
    const config = readPlan();
    let feedbackRows;
    try {
      feedbackRows = pastGroupRows();
    } catch (error) {
      elements.status.textContent = error.message;
      return;
    }
    setBusy(true, 'Finding the class…');
    try {
      const students = studentsInClass(await api.allGroups() || [], config.period, config.course);
      const problem = formationError(config, students.length);
      if (problem) {
        elements.status.textContent = problem;
        return;
      }
      elements.status.textContent = 'Checking personas…';
      let enoughPersonas = false;
      try {
        const coverage = await api.personaCoverage(students.map(student => student.uid));
        const withPersonas = (coverage?.members || []).filter(member => member.personas?.length).length;
        enoughPersonas = useAiGrouping(withPersonas, config.size, students.length);
      } catch (error) {
        console.warn('Messages: Flask could not check personas, so groups are random', error);
      }
      const { suggestion, byPersona } = await groupStudents(students, config.size, feedbackRows, enoughPersonas);
      plan = { ...config, byPersona, feedbackRows };
      staged = stagedGroups(suggestion, students, config);
      render();
      if (byPersona) {
        elements.method.textContent = typeof suggestion.average_score === 'number'
          ? `Grouped by persona. Average team score: ${suggestion.average_score.toFixed(1)}.`
          : 'Grouped by persona.';
      } else {
        elements.method.textContent = enoughPersonas
          ? 'Random groups: Flask could not group by persona just now.'
          : 'Random groups: too few of these students have picked a persona.';
      }
      elements.status.textContent = `${students.length} students in ${staged.length} groups. Nothing is saved until you press Save groups.`;
    } catch (error) {
      console.warn('Messages: could not suggest groups', error);
      elements.status.textContent = 'Could not load the class. Try again.';
    } finally {
      setBusy(false);
    }
  }

  async function regroup() {
    if (busy || !plan) return;
    const students = unlockedStudents(staged);
    if (!students.length) {
      elements.status.textContent = 'Unlock a group to regroup its students.';
      return;
    }
    setBusy(true, 'Regrouping the unlocked groups…');
    try {
      const { suggestion } = await groupStudents(students, plan.size, plan.feedbackRows, plan.byPersona);
      staged = replaceUnlocked(staged, suggestion, students, plan.prefix);
      render();
      elements.status.textContent = 'Regrouped the unlocked groups.';
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    if (busy || !staged.length) return;
    const requests = createRequests(staged);
    setBusy(true, `Making ${requests.length} groups…`);
    const made = [];
    const failed = [];
    for (const request of requests) {
      try {
        await api.createGroup(request);
        made.push(request.name);
      } catch (error) {
        console.warn(`Messages: could not make ${request.name}`, error);
        failed.push(error.status === 409 ? `${request.name} (that name is taken)` : request.name);
      }
    }
    // Keep only what wasn't made, so pressing Save again retries just those.
    staged = staged.filter(group => !made.includes(group.name));
    render();
    setBusy(false, failed.length
      ? `Made ${made.length} of ${requests.length} groups. Not made: ${failed.join(', ')}.`
      : `Made ${made.length} groups. Students see them under Groups.`);
    if (made.length) onSaved();
  }

  // Editing the name renames the staged groups in place, so a save that hit a taken
  // name can be tried again without regrouping anyone.
  elements.prefix.addEventListener('input', () => {
    if (busy || !staged.length) return;
    const { prefix } = readPlan();
    staged = renameGroups(staged, prefix);
    if (plan) plan.prefix = prefix;
    render();
  });

  const dialog = createDialog(elements.dialog);
  elements.form.addEventListener('submit', suggest);
  elements.regroup.addEventListener('click', regroup);
  elements.save.addEventListener('click', save);
  elements.open.addEventListener('click', () => dialog.open(elements.open));
}
