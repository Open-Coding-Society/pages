import assert from 'node:assert/strict';
import { test } from 'node:test';

import { CallModel } from '../js/call-model.js';
import { readStrings } from './helpers.mjs';

const strings = readStrings();
const q = (search) => new URLSearchParams(search);

test('a group link names the group', () => {
  assert.deepEqual(CallModel.contextFromQuery(q('?group=12')), { contextType: 'GROUP', contextKey: '12', purpose: null });
});

test('a DM link names the conversation', () => {
  assert.deepEqual(CallModel.contextFromQuery(q('?dm=34')), { contextType: 'DM', contextKey: '34', purpose: null });
});

test('a course link names the course the way Spring stores it', () => {
  assert.deepEqual(CallModel.contextFromQuery(q('?course=csa')), { contextType: 'COURSE', contextKey: 'CSA', purpose: null });
});

test('ids are positive whole numbers', () => {
  for (const bad of ['?group=1e3', '?group=0', '?group=-4', '?group=12abc', '?group=', '?dm=1.5', '?group=99999999999999999999']) {
    assert.equal(CallModel.contextFromQuery(q(bad)), null, bad);
  }
});

test('a course is letters and digits', () => {
  assert.equal(CallModel.contextFromQuery(q('?course=c$a')), null);
  assert.equal(CallModel.contextFromQuery(q('?course=')), null);
});

test('a link naming two places opens neither', () => {
  assert.equal(CallModel.contextFromQuery(q('?group=1&dm=2')), null);
  assert.equal(CallModel.contextFromQuery(q('?group=1&group=2')), null);
});

test('no place at all is null', () => {
  assert.equal(CallModel.contextFromQuery(q('')), null);
});

test('a purpose rides along when it is a plain word', () => {
  assert.equal(CallModel.contextFromQuery(q('?group=12&purpose=standup')).purpose, 'standup');
  assert.equal(CallModel.contextFromQuery(q('?group=12&purpose=Stand%20up')).purpose, null);
});

test('a purpose comes from data, and an unknown one is a meeting', () => {
  assert.equal(CallModel.purposeView('standup', strings).label, strings.purposes.standup.label);
  assert.equal(CallModel.purposeView('party', strings).label, strings.purposes.meeting.label);
  assert.equal(CallModel.purposeView(null, strings).key, 'meeting');
  assert.equal(CallModel.purposeView('toString', strings).key, 'meeting');
});

test('format fills the placeholders it is given and leaves the rest', () => {
  assert.equal(CallModel.format('Remove {name}?', { name: 'Ada' }), 'Remove Ada?');
  assert.equal(CallModel.format('{count} in the call', { count: 3 }), '3 in the call');
  assert.equal(CallModel.format('{other} stays', { name: 'x' }), '{other} stays');
  assert.equal(CallModel.format('{name}', { name: '{count}', count: 9 }), '{count}');
});

test('each Spring reason has its own words', () => {
  const t = strings.text;
  assert.equal(CallModel.reasonText('WAITING_FOR_SUPERVISOR', strings), t.waiting_supervisor);
  assert.equal(CallModel.reasonText('WAITING_FOR_SECOND_ADULT', strings), t.waiting_second_adult);
  assert.equal(CallModel.reasonText('REMOVED', strings), t.removed);
  assert.equal(CallModel.reasonText('NOT_A_MEMBER', strings), t.not_a_member);
  assert.equal(CallModel.reasonText('CALL_NOT_FOUND', strings), t.not_found);
  assert.equal(CallModel.reasonText('UNKNOWN_CONTEXT', strings), t.not_found);
  assert.equal(CallModel.reasonText('MEDIA_UNAVAILABLE', strings), t.unavailable);
  assert.equal(CallModel.reasonText('calls_disabled', strings), t.unavailable);
  assert.equal(CallModel.reasonText('NOT_A_MODERATOR', strings), t.not_a_moderator);
  assert.equal(CallModel.reasonText('PARTICIPANT_NOT_FOUND', strings), t.participant_gone);
  assert.equal(CallModel.reasonText('SOMETHING_NEW', strings), t.refused);
});

test('waiting reasons are the ones the lobby asks again for', () => {
  assert.equal(CallModel.isWaiting('WAITING_FOR_SUPERVISOR'), true);
  assert.equal(CallModel.isWaiting('WAITING_FOR_SECOND_ADULT'), true);
  assert.equal(CallModel.isWaiting('REMOVED'), false);
  assert.equal(CallModel.isWaiting(undefined), false);
});

test('initials come from the first and last words of a name', () => {
  assert.equal(CallModel.initials('Ada Lovelace'), 'AL');
  assert.equal(CallModel.initials('  grace   brewster murray hopper '), 'GH');
  assert.equal(CallModel.initials('Turing'), 'T');
  assert.equal(CallModel.initials(''), '?');
});

test('role labels come from the token metadata and the data file', () => {
  assert.deepEqual(CallModel.roleLabels('{"roles":["ROLE_STUDENT","ROLE_TEACHER"]}', strings), ['Teacher']);
  assert.deepEqual(CallModel.roleLabels('{"roles":["ROLE_MENTOR","ROLE_STUDENT"]}', strings), ['Mentor']);
  assert.deepEqual(CallModel.roleLabels('not json', strings), []);
  assert.deepEqual(CallModel.roleLabels('{"roles":"ROLE_TEACHER"}', strings), []);
  assert.deepEqual(CallModel.roleLabels('', strings), []);
  assert.deepEqual(CallModel.roleLabels('{"roles":["toString"]}', strings), []);
});

test('people show in a steady order: everyone by name, you last', () => {
  const people = [
    { identity: 'me', name: 'Zed', isSelf: true },
    { identity: 'b', name: 'bea' },
    { identity: 'a', name: 'Ada' },
    { identity: 'c', name: 'Cy' },
  ];
  assert.deepEqual(CallModel.order(people).map((p) => p.identity), ['a', 'b', 'c', 'me']);
});

test('a call title says what the call is for', () => {
  assert.equal(CallModel.title({ contextType: 'GROUP', title: 'Team Turing' }, strings), 'Team Turing');
  assert.equal(CallModel.title({ contextType: 'DM', title: null }, strings), strings.text.dm_title);
  assert.equal(CallModel.title(null, strings), strings.text.page_title);
});

test('paused means the server took away sending and hearing', () => {
  assert.equal(CallModel.isPaused({ canPublish: false, canSubscribe: false }), true);
  assert.equal(CallModel.isPaused({ canPublish: true, canSubscribe: true }), false);
  assert.equal(CallModel.isPaused(undefined), false);
});
