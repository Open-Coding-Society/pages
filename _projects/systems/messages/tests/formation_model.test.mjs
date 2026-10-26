import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createRequests, formationError, moveMember, priorExperienceRow, randomGroups, renameGroups, replaceUnlocked,
  stagedGroups, studentsInClass, teamName, toggleLock, unlockedStudents, useAiGrouping,
} from '../js/formation-model.js';

const ada = { id: 1, uid: 'ada', name: 'Ada' };
const grace = { id: 2, uid: 'grace', name: 'Grace' };
const alan = { id: 3, uid: 'alan', name: 'Alan' };
const linus = { id: 4, uid: 'linus', name: 'Linus' };
const katherine = { id: 5, uid: 'katherine', name: 'Katherine' };

// Same sequence every run, so shuffles are repeatable.
function seededRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

test('studentsInClass collects each member once from the groups in that period and course', () => {
  const groups = [
    { period: '3', course: 'CSA', members: [ada, grace] },
    { period: 3, course: 'CSA', members: [grace, alan] },
    { period: '3', course: 'CSP', members: [linus] },
    { period: '4', course: 'CSA', members: [katherine] },
  ];
  assert.deepEqual(studentsInClass(groups, '3', 'CSA'), [ada, grace, alan]);
});

test('formationError asks for a class and period, a size from 2 to 10, and enough students', () => {
  assert.equal(formationError({ period: '', course: 'CSA', size: 4 }, 10), 'Choose a class and a period.');
  assert.equal(formationError({ period: '3', course: 'CSA', size: 1 }, 10), 'Group size must be 2 to 10.');
  assert.equal(formationError({ period: '3', course: 'CSA', size: 11 }, 10), 'Group size must be 2 to 10.');
  assert.equal(formationError({ period: '3', course: 'CSA', size: 4 }, 3),
    'Period 3 CSA has 3 students in its groups, fewer than one group of 4.');
  assert.equal(formationError({ period: '3', course: 'CSA', size: 4 }, 4), '');
});

test('useAiGrouping needs personas for two groups and for half the class', () => {
  assert.equal(useAiGrouping(8, 4, 12), true);
  assert.equal(useAiGrouping(7, 4, 12), false);
  assert.equal(useAiGrouping(9, 2, 20), false);
  assert.equal(useAiGrouping(10, 2, 20), true);
});

test('randomGroups puts every student in exactly one group of the chosen size', () => {
  const students = [ada, grace, alan, linus, katherine];
  const groups = randomGroups(students, 2, seededRandom(42));
  assert.deepEqual(groups.map(group => group.user_uids.length), [2, 2, 1]);
  assert.deepEqual(groups.flatMap(group => group.user_uids).sort(), ['ada', 'alan', 'grace', 'katherine', 'linus']);
  assert.ok(groups.every(group => group.team_score === null));
  assert.deepEqual(randomGroups(students, 2, seededRandom(42)), groups);
});

test('teamName letters the first 26 teams, then numbers them', () => {
  assert.equal(teamName('Team', 0), 'Team A');
  assert.equal(teamName('Squad', 25), 'Squad Z');
  assert.equal(teamName('Team', 26), 'Team 27');
});

test('stagedGroups names each suggested group and finds its students', () => {
  const suggestion = { groups: [{ user_uids: ['ada', 'grace'], team_score: 81.5 }, { user_uids: ['alan', 'ghost'], team_score: 64 }] };
  const staged = stagedGroups(suggestion, [ada, grace, alan], { prefix: 'Team', period: '3', course: 'CSA' });
  assert.deepEqual(staged, [
    { name: 'Team A', period: '3', course: 'CSA', score: 81.5, locked: false, members: [ada, grace] },
    { name: 'Team B', period: '3', course: 'CSA', score: 64, locked: false, members: [alan, { id: null, uid: 'ghost', name: 'ghost' }] },
  ]);
});

test('moveMember moves a student and unlocks the group they left, without changing the input', () => {
  const staged = [
    { name: 'Team A', locked: true, score: 80, members: [ada, grace] },
    { name: 'Team B', locked: false, score: 70, members: [alan] },
  ];
  const moved = moveMember(staged, 0, 'grace', 1);
  assert.deepEqual(moved.map(group => group.members.map(member => member.uid)), [['ada'], ['alan', 'grace']]);
  assert.equal(moved[0].locked, false);
  assert.equal(staged[0].members.length, 2);
  assert.equal(staged[0].locked, true);
  assert.equal(moveMember(staged, 0, 'grace', 0), staged);
});

test('toggleLock flips one group', () => {
  const staged = [{ name: 'Team A', locked: false, members: [] }, { name: 'Team B', locked: true, members: [] }];
  assert.deepEqual(toggleLock(staged, 0).map(group => group.locked), [true, true]);
  assert.deepEqual(toggleLock(staged, 1).map(group => group.locked), [false, false]);
});

test('unlockedStudents lists the students in unlocked groups', () => {
  const staged = [
    { name: 'Team A', locked: true, members: [ada] },
    { name: 'Team B', locked: false, members: [grace, alan] },
    { name: 'Team C', locked: false, members: [linus] },
  ];
  assert.deepEqual(unlockedStudents(staged), [grace, alan, linus]);
});

test('replaceUnlocked refills the unlocked groups in place and keeps locked ones', () => {
  const staged = [
    { name: 'Team A', period: '3', course: 'CSA', locked: true, score: 90, members: [ada] },
    { name: 'Team B', period: '3', course: 'CSA', locked: false, score: 60, members: [grace, alan] },
    { name: 'Team C', period: '3', course: 'CSA', locked: false, score: 50, members: [linus] },
  ];
  const regenerated = { groups: [{ user_uids: ['linus', 'grace'], team_score: 75 }, { user_uids: ['alan'], team_score: null }] };
  const result = replaceUnlocked(staged, regenerated, [grace, alan, linus], 'Team');
  assert.deepEqual(result.map(group => [group.name, group.locked, group.score, group.members.map(m => m.uid)]), [
    ['Team A', true, 90, ['ada']],
    ['Team B', false, 75, ['linus', 'grace']],
    ['Team C', false, null, ['alan']],
  ]);
});

test('replaceUnlocked adds a newly named group when the new grouping has more groups, and drops emptied ones', () => {
  const staged = [
    { name: 'Team A', period: '3', course: 'CSA', locked: false, score: null, members: [ada, grace, alan] },
    { name: 'Team B', period: '3', course: 'CSA', locked: true, score: null, members: [linus] },
  ];
  const more = { groups: [{ user_uids: ['ada'], team_score: null }, { user_uids: ['grace', 'alan'], team_score: null }] };
  assert.deepEqual(replaceUnlocked(staged, more, [ada, grace, alan], 'Team').map(group => [group.name, group.members.length]),
    [['Team A', 1], ['Team B', 1], ['Team C', 2]]);

  const fewer = { groups: [] };
  assert.deepEqual(replaceUnlocked(staged, fewer, [], 'Team').map(group => group.name), ['Team B']);
});

test('renameGroups letters the staged groups again under a new prefix, keeping students and locks', () => {
  const staged = [
    { name: 'CSA P3 Team A', locked: true, members: [ada] },
    { name: 'CSA P3 Team C', locked: false, members: [grace] },
  ];
  const renamed = renameGroups(staged, 'CSA P3 Sprint 4');
  assert.deepEqual(renamed.map(group => group.name), ['CSA P3 Sprint 4 A', 'CSA P3 Sprint 4 B']);
  assert.deepEqual(renamed.map(group => [group.locked, group.members]), [[true, [ada]], [false, [grace]]]);
  assert.equal(staged[0].name, 'CSA P3 Team A');
});

test('createRequests sends each non-empty group with the ids of the students found', () => {
  const staged = [
    { name: 'Team A', period: '3', course: 'CSA', locked: false, members: [ada, { id: null, uid: 'ghost', name: 'ghost' }] },
    { name: 'Team B', period: '3', course: 'CSA', locked: false, members: [] },
  ];
  assert.deepEqual(createRequests(staged), [{ name: 'Team A', period: '3', course: 'CSA', memberIds: [1] }]);
});

test('priorExperienceRow checks a past group before it is sent to Flask', () => {
  const fields = { size: '4', studentRating: '5', teacherRating: '4', personas: ['Planner', 'Closer'], note: '  Clear roles ' };
  const row = priorExperienceRow(fields, 1700000000000);
  assert.deepEqual(row, {
    ts: 1700000000000, source: 'inline_prior_experience', prev_group_size: 4, personas: ['Planner', 'Closer'],
    student_rating_1to5: 5, teacher_rating_1to5: 4, note: 'Clear roles',
  });
  assert.throws(() => priorExperienceRow({ ...fields, size: '12' }, 0), /group size must be 2 to 10/);
  assert.throws(() => priorExperienceRow({ ...fields, studentRating: '0' }, 0), /ratings must be 1 to 5/);
  assert.throws(() => priorExperienceRow({ ...fields, teacherRating: '9' }, 0), /ratings must be 1 to 5/);
  assert.throws(() => priorExperienceRow({ ...fields, personas: [] }, 0), /at least one persona/);
});
