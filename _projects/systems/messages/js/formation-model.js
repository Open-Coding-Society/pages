// Pure helpers for Form groups (teachers and admins): the persona-based grouping from
// the Wayfinding capstone. A staged group is
//   { name, period, course, score, locked, members: [{ id, uid, name }] }
// and every change returns new groups instead of editing the old ones.

const MIN_SIZE = 2;
const MAX_SIZE = 10;

export const PERSONAS = ['Technologist', 'Scrummer', 'Planner', 'Closer'];

// The class is everyone already in a group for that period and course, such as the
// class group that profile class changes keep current.
export function studentsInClass(groups, period, course) {
  const seen = new Set();
  const students = [];
  groups
    .filter(group => String(group.period) === String(period) && group.course === course)
    .forEach(group => (group.members || []).forEach(member => {
      if (seen.has(member.id)) return;
      seen.add(member.id);
      students.push(member);
    }));
  return students;
}

export function formationError({ period, course, size }, studentCount) {
  if (!period || !course) return 'Choose a class and a period.';
  if (!(size >= MIN_SIZE && size <= MAX_SIZE)) return `Group size must be ${MIN_SIZE} to ${MAX_SIZE}.`;
  if (studentCount < size) {
    return `Period ${period} ${course} has ${studentCount} students in its groups, fewer than one group of ${size}.`;
  }
  return '';
}

// Flask's grouping only helps when enough of the students have picked a persona:
// enough for two groups, and at least half the class.
export const useAiGrouping = (withPersonas, size, total) => withPersonas >= Math.max(size * 2, Math.ceil(total * 0.5));

// Same shape as Flask's /api/persona/form-groups answer, so both go through stagedGroups.
export function randomGroups(students, size, random = Math.random) {
  const shuffled = [...students];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const groups = [];
  for (let i = 0; i < shuffled.length; i += size) {
    groups.push({ user_uids: shuffled.slice(i, i + size).map(student => student.uid), team_score: null });
  }
  return groups;
}

export const teamName = (prefix, index) => `${prefix} ${index < 26 ? String.fromCharCode(65 + index) : index + 1}`;

function membersFor(uids, students) {
  return uids.map(uid => students.find(student => student.uid === uid) || { id: null, uid, name: uid });
}

export function stagedGroups(suggestion, students, { prefix, period, course }) {
  return suggestion.groups.map((group, index) => ({
    name: teamName(prefix, index),
    period,
    course,
    score: group.team_score ?? null,
    locked: false,
    members: membersFor(group.user_uids, students),
  }));
}

// Moving a student out of a locked group unlocks it, since it is no longer the group
// that was locked.
export function moveMember(staged, fromIndex, uid, toIndex) {
  if (fromIndex === toIndex) return staged;
  const member = staged[fromIndex].members.find(candidate => candidate.uid === uid);
  if (!member) return staged;
  return staged.map((group, index) => {
    if (index === fromIndex) return { ...group, locked: false, members: group.members.filter(m => m.uid !== uid) };
    if (index === toIndex) return { ...group, members: [...group.members, member] };
    return group;
  });
}

// A taken name blocks a save (group names are unique), so a new prefix renames every
// staged group without regrouping anyone.
export const renameGroups = (staged, prefix) => staged.map((group, index) => ({ ...group, name: teamName(prefix, index) }));

export const toggleLock = (staged, index) => staged.map((group, i) => (i === index ? { ...group, locked: !group.locked } : group));

export const unlockedStudents = staged => staged.filter(group => !group.locked).flatMap(group => group.members);

// Refills the unlocked groups, in order, with a new grouping of their students. Extra
// new groups get the next unused names; unlocked groups left over are dropped.
export function replaceUnlocked(staged, regrouped, students, prefix) {
  const fresh = regrouped.groups.map(group => ({ score: group.team_score ?? null, members: membersFor(group.user_uids, students) }));
  const result = staged.map(group => {
    if (group.locked) return group;
    const next = fresh.shift();
    return next ? { ...group, ...next } : null;
  }).filter(Boolean);

  const template = staged[0] || {};
  const names = new Set(result.map(group => group.name));
  let index = 0;
  fresh.forEach(next => {
    while (names.has(teamName(prefix, index))) index += 1;
    const name = teamName(prefix, index);
    names.add(name);
    result.push({ name, period: template.period, course: template.course, locked: false, ...next });
  });
  return result;
}

// One POST /api/groups body per group: Spring adds the members in the same request.
export function createRequests(staged) {
  return staged
    .filter(group => group.members.length > 0)
    .map(group => ({
      name: group.name,
      period: group.period,
      course: group.course,
      memberIds: group.members.map(member => member.id).filter(id => id !== null && id !== undefined),
    }));
}

// A past group's results, which Flask's form-groups uses to weigh persona mixes.
export function priorExperienceRow({ size, studentRating, teacherRating, personas, note }, timestamp) {
  const previousSize = Number.parseInt(size, 10);
  const student = Number.parseInt(studentRating, 10);
  const teacher = Number.parseInt(teacherRating, 10);
  if (!(previousSize >= MIN_SIZE && previousSize <= MAX_SIZE)) {
    throw new Error(`The past group size must be ${MIN_SIZE} to ${MAX_SIZE}.`);
  }
  const ratingOk = rating => rating >= 1 && rating <= 5;
  if (!ratingOk(student) || !ratingOk(teacher)) throw new Error('The past group ratings must be 1 to 5.');
  if (!personas.length) throw new Error('Pick at least one persona that was in the past group.');
  return {
    ts: timestamp,
    source: 'inline_prior_experience',
    prev_group_size: previousSize,
    personas,
    student_rating_1to5: student,
    teacher_rating_1to5: teacher,
    note: String(note || '').trim(),
  };
}
