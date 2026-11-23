import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createBackends } from '../../login/js/backend.js';
import { FlaskProfile, SpringProfile, createProfile } from '../js/profile-backend.js';

// The layout's starter builds the profile from Login's backends, so these tests do the same:
// createProfile(createBackends(...)) with the real Backend, and only the network is fake.
const FLASK = 'http://flask.test';
const SPRING = 'http://spring.test';
const fetchOptions = {
    method: 'GET', mode: 'cors', cache: 'default', credentials: 'include',
    headers: { 'Content-Type': 'application/json', 'X-Origin': 'client' },
};

// A fake network. `answers` maps "METHOD url" to { status, body } (status 200 when left out), to
// an Error, which fetch throws when no answer arrives, or to a function that returns a promise of
// either, for an answer that arrives later. Every request is recorded with its JSON body.
function network(answers = {}) {
    const requests = [];
    globalThis.fetch = async (url, options) => {
        const key = `${options.method} ${url}`;
        requests.push({ key, body: options.body === undefined ? undefined : JSON.parse(options.body), credentials: options.credentials });
        const answer = typeof answers[key] === 'function' ? await answers[key]() : answers[key] ?? { body: null };
        if (answer instanceof Error) throw answer;
        const status = answer.status ?? 200;
        const text = answer.body === null || answer.body === undefined ? '' : JSON.stringify(answer.body);
        return { ok: status >= 200 && status < 300, status, text: async () => text };
    };
    return requests;
}

const profileOn = (springEnabled) => createProfile(createBackends({ pythonURI: FLASK, javaURI: SPRING, fetchOptions, springEnabled }));
const keys = (requests) => requests.map((request) => request.key);
const bodyOf = (requests, key) => requests.find((request) => request.key === key)?.body;
const noAnswer = () => new TypeError('Failed to fetch');

// What Flask's /api/id sends: the whole account (minus the password) and role flags.
const ID_ANSWER = {
    id: 7, uid: 'adalovelace', name: 'Ada Lovelace', email: 'ada@example.com', sid: '1234567', school: 'Del Norte High School',
    role: 'User', pfp: null, class: ['CSA'], grade_data: null, ap_exam: null, game_profile: null, active: true,
    last_verified: null, verification_state: 'verified', sections: [], is_admin: false, is_teacher: false, limited: false,
};
const SNAPSHOT = { project_name: 'Sprint 1', coding_ability: 4, collaboration: 5, problem_solving: 3, initiative: 6 };

// Every FlaskProfile method once, in the order the page uses them.
async function useEveryFlaskMethod(profile) {
    await profile.loadAccount();
    await profile.saveField('email', 'ada@new.example');
    await profile.classes();
    await profile.addClass('CSP');
    await profile.removeClass('CSA');
    await profile.syncCourseGroups(['CSP']);
    await profile.personas();
    await profile.chosenPersonas();
    await profile.choosePersona(3);
    await profile.saveSkillSnapshot(SNAPSHOT);
}

const FLASK_ANSWERS = {
    [`GET ${FLASK}/api/id`]: { body: ID_ANSWER },
    [`GET ${FLASK}/api/user/class`]: { body: { uid: 'adalovelace', class: ['CSA'] } },
    [`POST ${FLASK}/api/user/class`]: { body: { uid: 'adalovelace', class: ['CSA', 'CSP'] } },
    [`GET ${FLASK}/api/persona`]: { body: [] },
    [`GET ${FLASK}/api/user/personas`]: { body: { personas: {}, total_selected: 0 } },
    [`POST ${FLASK}/api/user/persona`]: { status: 201, body: { message: 'Persona selected', persona_id: 3, category: 'student' } },
    [`POST ${FLASK}/api/user/skill-snapshot`]: { status: 201, body: { id: 1, ...SNAPSHOT } },
};

test('game profile distinguishes no progress from a backend failure', async () => {
    const url = `GET ${FLASK}/api/profile/game`;
    network({ [url]: { status: 404 } });
    assert.equal(await profileOn(false).gameProfile(), null);
    const saved = { game_profile: { 'identity-forge': { progress: { identityUnlocked: true } } } };
    network({ [url]: { body: saved } });
    assert.deepEqual(await profileOn(false).gameProfile(), saved);
    network({ [url]: { status: 500 } });
    await assert.rejects(profileOn(false).gameProfile(), /500/);
});

test('onboarding can check sign-in and update game data through Profile', async () => {
    const id = `GET ${FLASK}/api/id`;
    const game = `PUT ${FLASK}/api/profile/game`;
    network({ [id]: { status: 401 } });
    assert.equal(await profileOn(false).signedInAccount(), null);
    network({ [id]: { status: 500 } });
    await assert.rejects(profileOn(false).signedInAccount(), /500/);
    const requests = network({
        [id]: { body: ID_ANSWER },
        [game]: { body: { onboarding_unlock_identity: true } },
    });
    const profile = profileOn(false);
    assert.equal((await profile.signedInAccount()).uid, ID_ANSWER.uid);
    await profile.updateGameProfile({ onboarding_unlock_identity: true });
    assert.deepEqual(bodyOf(requests, game), { _game_profile: { onboarding_unlock_identity: true } });
});

test('FlaskProfile never calls Spring', async () => {
    const requests = network(FLASK_ANSWERS);
    const profile = profileOn(false);
    assert.equal(profile.usesSpring, false);
    await useEveryFlaskMethod(profile);
    assert.deepEqual(keys(requests), [
        `GET ${FLASK}/api/id`,
        `PUT ${FLASK}/api/user`,
        `GET ${FLASK}/api/user/class`,
        `POST ${FLASK}/api/user/class`,
        `POST ${FLASK}/api/user/class`,
        `GET ${FLASK}/api/persona`,
        `GET ${FLASK}/api/user/personas`,
        `POST ${FLASK}/api/user/persona`,
        `POST ${FLASK}/api/user/skill-snapshot`,
    ]);
});

test('each Flask save sends the same body the profile page always sent, with the sign-in cookie', async () => {
    const requests = network(FLASK_ANSWERS);
    await useEveryFlaskMethod(profileOn(false));
    assert.deepEqual(bodyOf(requests, `PUT ${FLASK}/api/user`), { email: 'ada@new.example' });
    const classChanges = requests.filter((request) => request.key === `POST ${FLASK}/api/user/class`).map((request) => request.body);
    assert.deepEqual(classChanges, [{ class: 'CSP' }, { action: 'remove', class: 'CSA' }]);
    assert.deepEqual(bodyOf(requests, `POST ${FLASK}/api/user/persona`), { persona_id: 3 });
    assert.deepEqual(bodyOf(requests, `POST ${FLASK}/api/user/skill-snapshot`), SNAPSHOT);
    assert.ok(requests.every((request) => request.credentials === 'include'));
});

test('FlaskProfile.syncCourseGroups makes no request', async () => {
    const requests = network();
    assert.equal(await profileOn(false).syncCourseGroups(['CSA', 'CSP']), null);
    assert.deepEqual(requests, []);
});

test('loadAccount keeps only the five fields the account form shows', async () => {
    network({ [`GET ${FLASK}/api/id`]: { body: ID_ANSWER } });
    assert.deepEqual(await profileOn(false).loadAccount(), {
        name: 'Ada Lovelace', uid: 'adalovelace', email: 'ada@example.com', sid: '1234567', school: 'Del Norte High School',
    });
});

test('loadAccount rejects when nobody is signed in or the answer is not an account', async () => {
    network({ [`GET ${FLASK}/api/id`]: { status: 401, body: { message: 'Token is missing' } } });
    await assert.rejects(profileOn(false).loadAccount());
    network({ [`GET ${FLASK}/api/id`]: { body: 'Service Unavailable' } });
    await assert.rejects(profileOn(false).loadAccount());
});

test('classes, addClass and removeClass read the list from Flask, or an empty one', async () => {
    network({ [`GET ${FLASK}/api/user/class`]: { body: { uid: 'adalovelace' } } });
    assert.deepEqual(await profileOn(false).classes(), []);
    network({ [`POST ${FLASK}/api/user/class`]: { body: { uid: 'adalovelace', class: ['CSP'] } } });
    assert.deepEqual(await profileOn(false).removeClass('CSA'), { classes: ['CSP'], groupsError: null });
});

test('chosenPersonas is no choices when Flask refuses, and rejects when Flask can\'t be reached', async () => {
    const chosen = { student: { persona_id: 1, category: 'student' } };
    network({ [`GET ${FLASK}/api/user/personas`]: { body: { personas: chosen, total_selected: 1 } } });
    assert.deepEqual(await profileOn(false).chosenPersonas(), chosen);
    network({ [`GET ${FLASK}/api/user/personas`]: { status: 404, body: { message: 'User not found' } } });
    assert.deepEqual(await profileOn(false).chosenPersonas(), {});
    network({ [`GET ${FLASK}/api/user/personas`]: noAnswer() });
    await assert.rejects(profileOn(false).chosenPersonas(), { message: 'Failed to fetch' });
});

// The page shows these after "Couldn't …: ", so they keep the words the page has always used.
test('a failed request gives the reason the page shows, in the same words as before', async () => {
    network({ [`POST ${FLASK}/api/user/class`]: { status: 500, body: { message: 'Internal error' } } });
    await assert.rejects(profileOn(false).addClass('CSP'), { message: 'the server answered 500' });
    network({ [`GET ${FLASK}/api/persona`]: noAnswer() });
    await assert.rejects(profileOn(false).personas(), { message: 'Failed to fetch' });
    network({ [`POST ${FLASK}/api/user/persona`]: { status: 404, body: { message: 'Persona not found' } } });
    await assert.rejects(profileOn(false).choosePersona(99), { message: 'Persona not found' });
    network({ [`POST ${FLASK}/api/user/persona`]: { status: 502 } });
    await assert.rejects(profileOn(false).choosePersona(3), { message: 'the server answered 502' });
    network({ [`POST ${FLASK}/api/user/skill-snapshot`]: { status: 400, body: { message: 'project_name is required' } } });
    await assert.rejects(profileOn(false).saveSkillSnapshot({ ...SNAPSHOT, project_name: '' }), { message: 'project_name is required' });
});

test('FlaskProfile.saveField says Flask refused when it did or could not be reached', async () => {
    network({ [`PUT ${FLASK}/api/user`]: { status: 400, body: { message: 'Email is taken' } } });
    await assert.rejects(profileOn(false).saveField('email', 'ada@new.example'), { message: "Flask didn't accept it" });
    network({ [`PUT ${FLASK}/api/user`]: noAnswer() });
    await assert.rejects(profileOn(false).saveField('email', 'ada@new.example'), { message: "Flask didn't accept it" });
});

test('SpringProfile.saveField saves to Flask then Spring and names the backend that failed', async () => {
    const requests = network();
    await profileOn(true).saveField('name', 'Ada King');
    assert.deepEqual(keys(requests), [`PUT ${FLASK}/api/user`, `POST ${SPRING}/api/person/update`]);
    assert.deepEqual(bodyOf(requests, `POST ${SPRING}/api/person/update`), { name: 'Ada King' });

    network({ [`POST ${SPRING}/api/person/update`]: { status: 500 } });
    await assert.rejects(profileOn(true).saveField('name', 'Ada King'), { message: "Spring didn't accept it" });
    network({ [`PUT ${FLASK}/api/user`]: { status: 500 } });
    await assert.rejects(profileOn(true).saveField('name', 'Ada King'), { message: "Flask didn't accept it" });
    // Both refused: Flask is named, as the page always did.
    network({ [`PUT ${FLASK}/api/user`]: { status: 500 }, [`POST ${SPRING}/api/person/update`]: noAnswer() });
    await assert.rejects(profileOn(true).saveField('name', 'Ada King'), { message: "Flask didn't accept it" });
});

// The account form lets the student save again once this settles, so a Spring save still on its
// way could land after the retry and put back the older value.
test('SpringProfile.saveField waits for Spring to answer even when Flask refuses', async () => {
    let answerSpring;
    network({
        [`PUT ${FLASK}/api/user`]: { status: 500 },
        [`POST ${SPRING}/api/person/update`]: () => new Promise((resolve) => { answerSpring = resolve; }),
    });
    let settled = false;
    const outcome = profileOn(true).saveField('email', 'ada@new.example').then(() => 'saved', (error) => error.message);
    outcome.then(() => { settled = true; });
    await new Promise((resolve) => setTimeout(resolve, 0));
    assert.equal(settled, false, 'saveField finished before Spring answered');
    answerSpring({ body: null });
    assert.equal(await outcome, "Flask didn't accept it");
});

test('SpringProfile.addClass keeps the Flask save when the course groups fail', async () => {
    const added = { [`POST ${FLASK}/api/user/class`]: { body: { uid: 'adalovelace', class: ['CSA', 'CSP'] } } };
    network({ ...added, [`PUT ${SPRING}/api/groups/class-memberships`]: { status: 500 } });
    assert.deepEqual(await profileOn(true).addClass('CSP'), { classes: ['CSA', 'CSP'], groupsError: 'Failed to update course group membership' });
    network({ ...added, [`PUT ${SPRING}/api/groups/class-memberships`]: { status: 409, body: { error: 'Group CSP is full' } } });
    assert.deepEqual(await profileOn(true).addClass('CSP'), { classes: ['CSA', 'CSP'], groupsError: 'Group CSP is full' });
    network({ ...added, [`PUT ${SPRING}/api/groups/class-memberships`]: noAnswer() });
    assert.deepEqual(await profileOn(true).addClass('CSP'), { classes: ['CSA', 'CSP'], groupsError: 'Failed to fetch' });
});

test('SpringProfile.removeClass gives the course groups the new class list', async () => {
    const requests = network({ [`POST ${FLASK}/api/user/class`]: { body: { uid: 'adalovelace', class: ['CSP'] } } });
    assert.deepEqual(await profileOn(true).removeClass('CSA'), { classes: ['CSP'], groupsError: null });
    assert.deepEqual(keys(requests), [`POST ${FLASK}/api/user/class`, `PUT ${SPRING}/api/groups/class-memberships`]);
    assert.deepEqual(bodyOf(requests, `PUT ${SPRING}/api/groups/class-memberships`), { classes: ['CSP'] });
});

test('SpringProfile changes no course groups when Flask refuses the class', async () => {
    const requests = network({ [`POST ${FLASK}/api/user/class`]: { status: 500 } });
    await assert.rejects(profileOn(true).addClass('CSP'), { message: 'the server answered 500' });
    assert.deepEqual(keys(requests), [`POST ${FLASK}/api/user/class`]);
});

test('SpringProfile reads the Spring account and registers a face in Spring', async () => {
    const person = { id: 42, uid: 'adalovelace', name: 'Ada Lovelace', faceData: null };
    const requests = network({ [`GET ${SPRING}/api/person/get`]: { body: person } });
    const profile = profileOn(true);
    assert.deepEqual(await profile.person(), person);
    await profile.registerFace('base64-jpeg');
    assert.deepEqual(keys(requests), [`GET ${SPRING}/api/person/get`, `POST ${SPRING}/api/face/register`]);
    assert.deepEqual(bodyOf(requests, `POST ${SPRING}/api/face/register`), { faceData: 'base64-jpeg' });
    network({ [`POST ${SPRING}/api/face/register`]: { status: 413 } });
    await assert.rejects(profile.registerFace('base64-jpeg'), { message: 'the server answered 413' });
});

test('createProfile picks SpringProfile only with a spring backend', () => {
    const flaskOnly = profileOn(false);
    assert.ok(flaskOnly instanceof FlaskProfile);
    assert.ok(!(flaskOnly instanceof SpringProfile));
    const withSpring = profileOn(true);
    assert.ok(withSpring instanceof SpringProfile);
    assert.equal(withSpring.usesSpring, true);
});
