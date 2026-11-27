import assert from 'node:assert/strict';
import test from 'node:test';

// What the Messages page offers an account. Spring's MentorRules keep an account with ROLE_MENTOR and no
// teacher or admin role to its team's groups, so the page offers it no direct messages, no finding or making
// groups and no adding or removing people. Everyone else keeps all three.
const { Allowances } = await import('../js/allowances.js');

const person = (...names) => ({ id: 1, roles: names.map(name => ({ name })) });
const everything = { directMessages: true, findGroups: true, manageMembers: true };
const teamGroupsOnly = { directMessages: false, findGroups: false, manageMembers: false };

test('a mentor talks only in their team groups', () => {
  assert.deepEqual({ ...Allowances.for(person('ROLE_USER', 'ROLE_MENTOR')) }, teamGroupsOnly);
});

test('students, teachers and admins keep everything', () => {
  assert.deepEqual({ ...Allowances.for(person('ROLE_USER', 'ROLE_STUDENT')) }, everything);
  assert.deepEqual({ ...Allowances.for(person('ROLE_USER', 'ROLE_TEACHER')) }, everything);
  assert.deepEqual({ ...Allowances.for(person('ROLE_USER', 'ROLE_ADMIN')) }, everything);
});

test('a teacher or admin who also mentors is treated as a teacher or admin, as Spring does', () => {
  assert.deepEqual({ ...Allowances.for(person('ROLE_MENTOR', 'ROLE_TEACHER')) }, everything);
  assert.deepEqual({ ...Allowances.for(person('ROLE_MENTOR', 'ROLE_ADMIN')) }, everything);
});

test('roles written as plain names count the same', () => {
  assert.deepEqual({ ...Allowances.for({ id: 1, roles: ['ROLE_USER', 'ROLE_MENTOR'] }) }, teamGroupsOnly);
});

test('the answer can not be changed by the page that asked', () => {
  const allowed = Allowances.for(person('ROLE_USER'));
  assert.throws(() => { allowed.directMessages = false; }, TypeError);
});

test('the words the page shows depend only on the answers', () => {
  const everyone = Allowances.for(person('ROLE_USER'));
  const teamOnly = Allowances.for(person('ROLE_USER', 'ROLE_MENTOR'));
  assert.equal(Allowances.emptyDirectMessagesText(everyone), undefined);
  assert.equal(Allowances.emptyDirectMessagesText(teamOnly), 'Direct messages are off for your account. Talk with people in your groups.');
  assert.deepEqual(Allowances.threadTexts(everyone), {});
  assert.deepEqual(Allowances.threadTexts(teamOnly), { idleHint: 'Pick one of your groups.' });
  assert.equal(Allowances.rejoinNote(everyone), 'You can join it again from Find a group.');
  assert.equal(Allowances.rejoinNote(teamOnly), 'A member of the group can add you back.');
});

test('a control the account may use is shown and enabled, and one it may not is hidden', () => {
  const control = () => {
    const classes = new Set(['hidden']);
    return { disabled: true, classList: { add: c => classes.add(c), remove: c => classes.delete(c), contains: c => classes.has(c) } };
  };
  const offered = control();
  Allowances.offer(offered, true);
  assert.equal(offered.disabled, false);
  assert.equal(offered.classList.contains('hidden'), false);
  const withheld = control();
  Allowances.offer(withheld, false);
  assert.equal(withheld.classList.contains('hidden'), true);
  assert.equal(withheld.disabled, true);
});

test('a member Spring marks as a mentor gets the mentor tag', () => {
  assert.equal(Allowances.memberTag({ mentor: true }), 'mentor');
  assert.equal(Allowances.memberTag({ mentor: false }), '');
  assert.equal(Allowances.memberTag({}), '');
});
