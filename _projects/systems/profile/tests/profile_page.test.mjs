import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fakeEvent, installFakeDom, settle } from '../../messages/tests/fake-dom.mjs';
import { createBackends } from '../../login/js/backend.js';
import { createProfile } from '../js/profile-backend.js';
import { initProfilePage } from '../js/profile-page.js';

// /profile as a student uses it: the real modules on a fake page (the Messages system's fake DOM,
// since this repo has no jsdom), started the way the layout's starter starts them, with fake Flask
// and Spring servers in place of the network.
const FLASK = 'http://flask.test';
const SPRING = 'http://spring.test';
const fetchOptions = {
    method: 'GET', mode: 'cors', cache: 'default', credentials: 'include',
    headers: { 'Content-Type': 'application/json', 'X-Origin': 'client' },
};

const COURSES = [
    { code: 'CSSE', name: 'Computer Science and Software Engineering' },
    { code: 'CSP', name: 'Computer Science Principles' },
    { code: 'CSA', name: 'Computer Science A' },
    { code: 'CSH', name: 'Computer Science Honors' },
];
const PERSONAS = [
    { id: 1, category: 'student', alias: 'indy', bio_map: { title: 'Technologist', description: 'Builds tools. Ships often.', archetype: ['Analytical'] } },
    { id: 2, category: 'student', alias: 'salem', bio_map: { title: 'Scrummer', description: 'Runs the board.' } },
    { id: 5, category: 'social', alias: 'gamer', bio_map: { title: 'Gamer', description: 'Plays strategy games.' } },
    { id: 6, category: 'social', alias: 'artist', bio_map: { title: 'Artist', description: 'Draws every day.' } },
    { id: 9, category: 'achievement', alias: 'leader', bio_map: { title: 'Leader', description: 'Leads the team.' } },
    { id: 13, category: 'fantasy', alias: 'wizard', bio_map: { title: 'Wizard', description: 'Casts spells.' } },
];

// What the page logs to the console is kept here instead of printed, so a test can check it.
const logged = [];
console.error = (...args) => logged.push(args[0]);
console.warn = (...args) => logged.push(args[0]);

// Fake Flask and Spring servers, with the answers the real ones send. On a Flask-only site no Spring
// server is running, so a request to it gets no answer. `refuse` maps "METHOD url" to an error answer.
function servers({ spring, refuse = {} }) {
    const state = {
        user: {
            id: 7, uid: 'adalovelace', name: 'Ada Lovelace', email: 'ada@example.com', sid: '1234567', school: 'Del Norte High School',
            role: 'User', pfp: null, class: ['CSA'], active: true, is_admin: false, is_teacher: false, limited: false,
        },
        classes: ['CSA'],
        chosen: { student: { persona_id: 1, category: 'student' } },
        person: { id: 42, uid: 'adalovelace', name: 'Ada Lovelace', faceData: null },
    };
    const requests = [];
    globalThis.fetch = async (url, options) => {
        const { origin, pathname } = new URL(url);
        const key = `${options.method} ${origin}${pathname}`;
        const body = options.body === undefined ? undefined : JSON.parse(options.body);
        requests.push({ key, origin, body });
        if (origin === SPRING && !spring) throw new TypeError('Failed to fetch');
        const answer = refuse[key] ?? answerFor(state, key, body) ?? { status: 404, body: { message: `no route for ${key}` } };
        const status = answer.status ?? 200;
        return { ok: status >= 200 && status < 300, status, text: async () => (answer.body === undefined ? '' : JSON.stringify(answer.body)) };
    };
    return { state, requests };
}

function answerFor(state, key, body) {
    switch (key) {
        case `GET ${FLASK}/api/id`: return { body: state.user };
        case `PUT ${FLASK}/api/user`: Object.assign(state.user, body); return { body: state.user };
        case `GET ${FLASK}/api/user/class`: return { body: { uid: state.user.uid, class: state.classes } };
        case `POST ${FLASK}/api/user/class`:
            state.classes = body.action === 'remove' ? state.classes.filter((code) => code !== body.class) : [...state.classes, body.class];
            return { body: { uid: state.user.uid, class: state.classes } };
        case `GET ${FLASK}/api/persona`: return { body: PERSONAS };
        case `GET ${FLASK}/api/user/personas`: return { body: { personas: state.chosen, total_selected: Object.keys(state.chosen).length } };
        case `POST ${FLASK}/api/user/persona`: {
            const { id, category } = PERSONAS.find((persona) => persona.id === body.persona_id);
            state.chosen[category] = { persona_id: id, category };
            return { status: 201, body: { message: 'Persona selected', persona_id: id, category } };
        }
        case `POST ${FLASK}/api/user/skill-snapshot`: return { status: 201, body: { id: 1, ...body } };
        case `POST ${SPRING}/api/person/update`: Object.assign(state.person, body); return { body: state.person };
        case `PUT ${SPRING}/api/groups/class-memberships`: return { body: { classes: body.classes } };
        case `GET ${SPRING}/api/person/get`: return { body: state.person };
        default: return null;
    }
}

// The elements index.md gives the modules. The Face ID card is built only on a Spring
// site, as in the layout. The page's setup list ignores the Gist card when it isn't there.
function buildPage({ spring }) {
    const { document, window } = installFakeDom();
    document.getElementById = (id) => document.documentElement.querySelector(`[id="${id}"]`);
    // Messages' fake DOM has no prepend() or firstElementChild, which the persona cards use.
    const element = Object.getPrototypeOf(document.createElement('span'));
    element.prepend = function prepend(...nodes) {
        nodes.forEach((node) => this.insertBefore(typeof node === 'string' ? document.createTextNode(node) : node, this.firstChild));
    };
    Object.defineProperty(element, 'firstElementChild', { configurable: true, get() { return this.children[0] ?? null; } });
    globalThis.Option = function Option(text, value) {
        const option = document.createElement('option');
        option.textContent = text;
        option.value = value;
        return option;
    };
    window.location = { href: 'https://site.test/profile', reload() {} };
    window.confirm = () => true;

    const add = (parent, tag, id, attributes = {}) => {
        const node = document.createElement(tag);
        if (id) node.id = id;
        for (const [name, value] of Object.entries(attributes)) node.setAttribute(name, value);
        parent.append(node);
        return node;
    };
    const { body } = document;
    add(body, 'script', 'profileCourses').textContent = JSON.stringify(COURSES);
    for (const [tag, id] of [['abbr', 'profileAvatar'], ['h2', 'profileName'], ['p', 'profileHandle'], ['p', 'profileSchool'], ['ul', 'profileSetup']]) add(body, tag, id);
    const account = add(body, 'form', 'profileSettingsForm');
    add(account, 'p', 'saveStatus');
    add(account, 'button', 'saveChangesBtn', { type: 'submit' });
    for (const id of ['nameChangeInput', 'uidChangeInput', 'emailChangeInput', 'sidChangeInput']) add(account, 'input', id);
    add(account, 'select', 'schoolChangeInput');
    add(body, 'ul', 'classesContainer');
    const addClass = add(body, 'form', 'addClassForm');
    add(addClass, 'select', 'addClassSelect');
    add(addClass, 'button', 'addClassBtn', { type: 'submit' });
    add(body, 'p', 'classesStatus', { hidden: '' });
    add(body, 'span', 'personaProgress');
    add(body, 'button', 'personaEditBtn', { hidden: '' });
    add(body, 'div', 'personaSelectionContainer');
    const skills = add(body, 'section', 'skillsCard', { hidden: '' });
    const snapshot = add(skills, 'form', 'skillSnapshotForm');
    add(snapshot, 'input', 'snapshotProjectName');
    const sliders = ['codingAbility', 'collaboration', 'problemSolving', 'initiative'].map((id) => {
        add(snapshot, 'output', `${id}Val`).textContent = '3';
        return Object.assign(add(snapshot, 'input', id), { value: '3' });
    });
    add(snapshot, 'p', 'snapshotStatus');
    snapshot.reset = () => {
        document.getElementById('snapshotProjectName').value = '';
        sliders.forEach((slider) => { slider.value = '3'; });
    };
    if (spring) {
        add(body, 'span', 'regStatusText');
        add(body, 'button', 'openScannerBtn');
        const scanner = add(body, 'div', 'webcamOverlay', { class: 'ocs__modal hidden' });
        add(scanner, 'button', null, { 'data-close-scanner': '' });
        for (const [tag, id] of [['video', 'webcamControl'], ['canvas', 'captureCanvas'], ['p', 'scannerStatus'], ['button', 'captureFaceBtn']]) add(scanner, tag, id);
    }
    return (id) => document.getElementById(id);
}

// Opens /profile on a site with or without Spring, as the layout's starter does, and waits for it to load.
async function openProfile({ spring, refuse = {} }) {
    logged.length = 0;
    const { state, requests } = servers({ spring, refuse });
    const byId = buildPage({ spring });
    initProfilePage({ profile: createProfile(createBackends({ pythonURI: FLASK, javaURI: SPRING, fetchOptions, springEnabled: spring })) });
    await settle();
    return { state, requests, byId };
}

const writes = (requests) => requests.filter((request) => !request.key.startsWith('GET ')).map(({ key, body }) => [key, body]);
const setupList = (byId) => byId('profileSetup').children.map((item) => item.textContent);

async function editAndSave(byId, id, value) {
    byId(id).value = value;
    byId('profileSettingsForm').dispatchEvent(fakeEvent('input'));
    byId('profileSettingsForm').dispatchEvent(fakeEvent('submit'));
    await settle();
}

async function addClass(byId, code) {
    byId('addClassSelect').value = code;
    byId('addClassForm').dispatchEvent(fakeEvent('submit'));
    await settle();
}

async function removeClass(byId, code) {
    const button = byId('classesContainer').querySelector(`[data-remove-class="${code}"]`);
    byId('classesContainer').dispatchEvent(fakeEvent('click', { target: button }));
    await settle();
}

async function choosePersona(byId, id) {
    const card = byId('personaSelectionContainer').querySelector(`button[data-persona-id="${id}"]`);
    byId('personaSelectionContainer').dispatchEvent(fakeEvent('click', { target: card }));
    await settle();
}

async function saveCheckIn(byId, project) {
    byId('snapshotProjectName').value = project;
    byId('skillSnapshotForm').dispatchEvent(fakeEvent('submit'));
    await settle();
}

test('a Flask-only profile page never asks Spring, from loading to every save', async () => {
    const { requests, byId } = await openProfile({ spring: false });
    assert.equal(byId('profileName').textContent, 'Ada Lovelace');
    assert.deepEqual(setupList(byId), ['✓ClassesCSA', '○Persona1 of 4']);

    await editAndSave(byId, 'emailChangeInput', 'ada@new.example');
    await addClass(byId, 'CSP');
    await removeClass(byId, 'CSA');
    await choosePersona(byId, 5);
    await saveCheckIn(byId, 'Sprint 1');

    assert.deepEqual(requests.filter((request) => request.origin !== FLASK), []);
    assert.deepEqual(writes(requests), [
        [`PUT ${FLASK}/api/user`, { email: 'ada@new.example' }],
        [`POST ${FLASK}/api/user/class`, { class: 'CSP' }],
        [`POST ${FLASK}/api/user/class`, { action: 'remove', class: 'CSA' }],
        [`POST ${FLASK}/api/user/persona`, { persona_id: 5 }],
        [`POST ${FLASK}/api/user/skill-snapshot`, { project_name: 'Sprint 1', coding_ability: 3, collaboration: 3, problem_solving: 3, initiative: 3 }],
    ]);
    assert.equal(byId('saveStatus').textContent, 'Saved');
    assert.equal(byId('classesStatus').textContent, 'Saved');
    assert.equal(byId('personaProgress').textContent, '2 of 4 chosen');
    assert.equal(byId('snapshotStatus').textContent, 'Saved your check-in for Sprint 1.');
    assert.deepEqual(logged, []);
});

test("with Spring, Save sends the edited field to Flask and to Spring's copy", async () => {
    const { requests, byId } = await openProfile({ spring: true });
    await editAndSave(byId, 'emailChangeInput', 'ada@new.example');
    assert.deepEqual(writes(requests).filter(([key]) => !key.includes('class-memberships')), [
        [`PUT ${FLASK}/api/user`, { email: 'ada@new.example' }],
        [`POST ${SPRING}/api/person/update`, { email: 'ada@new.example' }],
    ]);
    assert.equal(byId('saveStatus').textContent, 'Saved');
    assert.deepEqual(logged, []);
});

test("with Spring, the course groups follow the student's classes on load and after each change", async () => {
    const { requests, byId } = await openProfile({ spring: true });
    await addClass(byId, 'CSP');
    await removeClass(byId, 'CSA');
    const groups = requests.filter((request) => request.key === `PUT ${SPRING}/api/groups/class-memberships`).map((request) => request.body);
    assert.deepEqual(groups, [{ classes: ['CSA'] }, { classes: ['CSA', 'CSP'] }, { classes: ['CSP'] }]);
    assert.equal(byId('classesStatus').textContent, 'Saved');
    assert.deepEqual(logged, []);
});

test("when Spring's course groups refuse, the class stays saved and the page says why", async () => {
    const refuse = { [`PUT ${SPRING}/api/groups/class-memberships`]: { status: 409, body: { error: 'Group CSP is full' } } };
    const { state, byId } = await openProfile({ spring: true, refuse });
    await addClass(byId, 'CSP');
    assert.deepEqual(state.classes, ['CSA', 'CSP']);
    assert.equal(byId('classesStatus').textContent, "Your classes were saved, but the course groups didn't update: Group CSP is full");
    assert.ok(byId('classesContainer').querySelector('[data-remove-class="CSP"]'));
    assert.deepEqual(setupList(byId)[0], '✓ClassesCSA · CSP');
    // The refusal also meets the sync every page load makes, which logs its own line.
    assert.deepEqual(logged, ['Group membership sync failed:', 'Class saved but group membership sync failed:']);
});

test('with Spring, Face ID and GitHub join the setup list, and Face ID reads Spring', async () => {
    const { byId } = await openProfile({ spring: true });
    assert.equal(byId('regStatusText').textContent, 'Not registered');
    assert.deepEqual(setupList(byId), ['✓ClassesCSA', '○Persona1 of 4', '○Face IDNot set', '○GitHubChecking…']);
    assert.deepEqual(logged, []);
});

test('a refused save shows the same words as before', async () => {
    const refuse = {
        [`POST ${FLASK}/api/user/class`]: { status: 500, body: { message: 'Internal error' } },
        [`POST ${SPRING}/api/person/update`]: { status: 403 },
        [`POST ${FLASK}/api/user/persona`]: { status: 404, body: { message: 'Persona not found' } },
    };
    const { byId } = await openProfile({ spring: true, refuse });
    await addClass(byId, 'CSP');
    assert.equal(byId('classesStatus').textContent, "Couldn't update your classes: the server answered 500.");
    await editAndSave(byId, 'sidChangeInput', '7654321');
    assert.equal(byId('saveStatus').textContent, "Couldn't save: Spring didn't accept it. Try again.");
    await choosePersona(byId, 6);
    assert.equal(byId('personaSelectionContainer').querySelector('[role="alert"]').textContent, "Couldn't save that choice: Persona not found.");
});

test('when nobody is signed in, the account form says so', async () => {
    const { byId } = await openProfile({ spring: false, refuse: { [`GET ${FLASK}/api/id`]: { status: 401, body: { message: 'Token is missing' } } } });
    assert.equal(byId('saveStatus').textContent, "Couldn't load your account. Are you signed in?");
});
