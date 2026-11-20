import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';

// role-view.js reads localStorage and reloads the page; stub both for Node.
const storage = new Map();
globalThis.localStorage = {
    getItem: key => (storage.has(key) ? storage.get(key) : null),
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: key => storage.delete(key),
};
let reloads = 0;
globalThis.window = { location: { reload: () => { reloads += 1; } } };

const { viewFor, roleNames, isMentorAccount, switchView, clearRoleViewCache } =
    await import('../assets/js/api/role-view.js');

beforeEach(() => {
    storage.clear();
    reloads = 0;
});

test('roleNames reads role names from a person and tolerates a missing one', () => {
    assert.deepEqual(roleNames({ roles: [{ name: 'ROLE_USER' }, { name: 'ROLE_MENTOR' }] }), ['ROLE_USER', 'ROLE_MENTOR']);
    assert.deepEqual(roleNames(null), []);
});

test('only ROLE_MENTOR makes a mentor account', () => {
    assert.equal(isMentorAccount(['ROLE_USER']), false);
    assert.equal(isMentorAccount(['ROLE_USER', 'ROLE_MENTOR']), true);
});

test('a student account always gets the student view, whatever is stored', () => {
    storage.set('ocsViewAs', 'mentor');
    assert.equal(viewFor(['ROLE_USER']), 'student');
});

test('a mentor account gets the mentor view unless it chose the student view', () => {
    assert.equal(viewFor(['ROLE_MENTOR']), 'mentor');
    storage.set('ocsViewAs', 'student');
    assert.equal(viewFor(['ROLE_MENTOR']), 'student');
});

test('switchView flips a mentor between views and reloads the page', () => {
    switchView(['ROLE_MENTOR']);
    assert.equal(storage.get('ocsViewAs'), 'student');
    switchView(['ROLE_MENTOR']);
    assert.equal(storage.has('ocsViewAs'), false);
    assert.equal(reloads, 2);
});

test('clearRoleViewCache forgets the cached sidebar and the view choice', () => {
    storage.set('ocsViewAs', 'student');
    storage.set('ocsMentorSidebar', 'mentor');
    clearRoleViewCache();
    assert.equal(storage.size, 0);
});
