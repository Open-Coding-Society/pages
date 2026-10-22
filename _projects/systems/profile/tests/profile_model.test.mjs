import assert from 'node:assert/strict';
import test from 'node:test';
import {
    ACCOUNT_FIELDS, changedFields, firstSentence, initialsOf, personaSections, personaTitle, personaTraits, setupSteps,
} from '../js/profile-model.js';

const LOADED = { name: 'Ada Lovelace', uid: 'adalovelace', email: 'ada@example.com', sid: '1234567', school: 'Del Norte High School' };

test('only the fields a student edited are saved', () => {
    const current = { ...LOADED, email: 'ada.new@example.com' };
    assert.deepEqual(changedFields(LOADED, current).map(field => field.key), ['email']);
});

test('saving with nothing edited sends nothing, so the User ID is never re-sent', () => {
    assert.deepEqual(changedFields(LOADED, { ...LOADED }), []);
    assert.deepEqual(changedFields(LOADED, { ...LOADED, name: '  Ada Lovelace  ' }), []);
});

test('a cleared field is not saved', () => {
    assert.deepEqual(changedFields(LOADED, { ...LOADED, sid: '   ' }), []);
});

test('changing the User ID is flagged as signing the student out', () => {
    const [field] = changedFields(LOADED, { ...LOADED, uid: 'ada2' });
    assert.equal(field.key, 'uid');
    assert.equal(field.signsOut, true);
    assert.equal(ACCOUNT_FIELDS.filter(f => f.signsOut).length, 1);
});

test('initials come from the first and last word of the name', () => {
    assert.equal(initialsOf('Ada Lovelace'), 'AL');
    assert.equal(initialsOf('ada king lovelace'), 'AL');
    assert.equal(initialsOf('Cher'), 'C');
    assert.equal(initialsOf('   '), '?');
    assert.equal(initialsOf(null), '?');
});

const PERSONAS = [
    { id: 1, category: 'student', alias: 'indy', bio_map: { title: 'Technologist' } },
    { id: 2, category: 'student', alias: 'salem', bio_map: { title: 'Scrummer' } },
    { id: 5, category: 'social', alias: 'pixel', bio_map: { title: 'Gamer' } },
    { id: 13, category: 'fantasy', alias: 'flash' },
];

test('persona sections keep the category order and find each choice', () => {
    const sections = personaSections(PERSONAS, { student: { persona_id: 2 } });
    assert.deepEqual(sections.map(s => s.key), ['student', 'social', 'achievement', 'fantasy']);
    assert.equal(personaTitle(sections[0].chosen), 'Scrummer');
    assert.equal(sections[0].options.length, 2);
    assert.equal(sections[1].chosen, null);
    assert.deepEqual(sections[2].options, []);
});

test('a persona with no title falls back to its alias', () => {
    assert.equal(personaTitle(PERSONAS[3]), 'flash');
    assert.equal(personaTitle(undefined), 'Unnamed');
});

test('a persona card shows the first sentence and the traits', () => {
    assert.equal(firstSentence('Music is my language and my escape. I express emotions through sound.'), 'Music is my language and my escape.');
    assert.equal(firstSentence('I ship code fast'), 'I ship code fast');
    assert.equal(firstSentence('Version 2.0 is out. More soon.'), 'Version 2.0 is out.');
    assert.equal(firstSentence(undefined), '');
    assert.deepEqual(personaTraits({ bio_map: { archetype: ['Introvert', '', 7, 'Analytical'] } }), ['Introvert', 'Analytical']);
    assert.deepEqual(personaTraits({ bio_map: {} }), []);
});

test('setup steps show loading until each part answers', () => {
    const steps = setupSteps({});
    assert.deepEqual(steps.map(s => s.href), ['#classes', '#persona', '#face-id', '#github']);
    assert.ok(steps.every(s => s.done === null && s.value === 'Checking…'));
});

test('setup steps report what is done and what is left', () => {
    const steps = Object.fromEntries(setupSteps({ classes: ['CSA', 'CSP'], personaCount: 2, faceRegistered: false, gistConnected: true })
        .map(s => [s.key, s]));
    assert.deepEqual([steps.classes.done, steps.classes.value], [true, 'CSA · CSP']);
    assert.deepEqual([steps.persona.done, steps.persona.value], [false, '2 of 4']);
    assert.deepEqual([steps.face.done, steps.face.value], [false, 'Not set']);
    assert.deepEqual([steps.github.done, steps.github.value], [true, 'Connected']);
    assert.equal(setupSteps({ classes: [] })[0].value, 'None yet');
});
