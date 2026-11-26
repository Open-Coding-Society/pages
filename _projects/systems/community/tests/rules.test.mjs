// The rule classes: who a person is, who may message whom, who reads and posts where.
// Run: node --test _projects/systems/community/tests/rules.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CommunityRoles } from '../js/community-roles.js';
import { DmPolicy } from '../js/dm-policy.js';
import { ChannelRules } from '../js/channel-rules.js';

// Roles arrive from Spring as objects ({ name }) and from setup files as plain names.
const staff = { id: 1, name: 'Demo Staff 1', roles: [{ name: 'ROLE_STAFF' }] };
const moderator = { id: 3, name: 'Demo Moderator', roles: ['ROLE_MODERATOR'] };
const lp1 = { id: 11, name: 'Demo LP 1', roles: ['ROLE_LP'], series: ['s1', 's2'] };
const lp2 = { id: 12, name: 'Demo LP 2', roles: ['ROLE_LP'], series: ['s1'] };
const lp4 = { id: 14, name: 'Demo LP 4', roles: ['ROLE_LP'], series: ['s2'] };
const lpNone = { id: 17, name: 'Demo LP 7', roles: ['ROLE_LP'], series: [] };
const visitor = { id: 99, name: 'Someone', roles: ['ROLE_USER'] };

const all = { id: 100, title: 'All members', kind: 'updates', series: null };
const s1Updates = { id: 101, title: 'Demo Series 1 updates', kind: 'updates', series: 's1' };
const s2Updates = { id: 102, title: 'Demo Series 2 updates', kind: 'updates', series: 's2' };
const s1 = { id: 201, title: 'Demo Series 1', kind: 'series', series: 's1' };
const s2 = { id: 202, title: 'Demo Series 2', kind: 'series', series: 's2' };
const s3 = { id: 203, title: 'Demo Series 3', kind: 'series', series: 's3' };
const channels = [all, s1Updates, s2Updates, s1, s2, s3];

test('staff and moderators can moderate, an LP cannot', () => {
  assert.equal(CommunityRoles.canModerate(staff), true);
  assert.equal(CommunityRoles.canModerate(moderator), true);
  assert.equal(CommunityRoles.canModerate(lp1), false);
  assert.equal(CommunityRoles.isStaff(moderator), false);
});

test('roleOf names the highest role', () => {
  assert.equal(CommunityRoles.roleOf(staff), 'staff');
  assert.equal(CommunityRoles.roleOf({ roles: ['ROLE_LP', 'ROLE_MODERATOR'] }), 'moderator');
  assert.equal(CommunityRoles.roleOf(lp1), 'lp');
  assert.equal(CommunityRoles.roleOf(visitor), 'none');
  assert.equal(CommunityRoles.roleOf(null), 'none');
});

test('tabsFor gives review only to people who moderate', () => {
  assert.deepEqual(CommunityRoles.tabsFor(lp1), ['updates', 'groups', 'inbox', 'calendar']);
  assert.deepEqual(CommunityRoles.tabsFor(moderator), ['updates', 'groups', 'inbox', 'calendar', 'review']);
  assert.deepEqual(CommunityRoles.tabsFor(visitor), []);
});

test('an LP can message staff and moderators, and staff can message anyone', () => {
  assert.deepEqual(DmPolicy.canStart(lp1, staff), { allowed: true, reason: '' });
  assert.deepEqual(DmPolicy.canStart(lp1, moderator), { allowed: true, reason: '' });
  assert.deepEqual(DmPolicy.canStart(staff, lp4), { allowed: true, reason: '' });
});

test('an LP cannot message another LP by default', () => {
  assert.deepEqual(DmPolicy.canStart(lp1, lp2), { allowed: false, reason: 'lp-to-lp' });
});

test('co-investors mode needs a shared series and both opted in', () => {
  const mode = 'co-investors';
  assert.equal(DmPolicy.canStart(lp1, lp2, { mode, sharesSeries: false, bothOptedIn: true }).reason, 'not-shared');
  assert.equal(DmPolicy.canStart(lp1, lp2, { mode, sharesSeries: true, bothOptedIn: false }).reason, 'not-opted-in');
  assert.equal(DmPolicy.canStart(lp1, lp2, { mode, sharesSeries: true, bothOptedIn: true }).allowed, true);
  assert.throws(() => DmPolicy.canStart(lp1, lp2, { mode: 'anyone' }), TypeError);
});

test('nobody messages themselves, and a visitor messages no one', () => {
  assert.equal(DmPolicy.canStart(staff, staff).reason, 'self');
  assert.equal(DmPolicy.canStart(visitor, staff).reason, 'not-member');
});

test('recipientsFor an LP lists only staff and moderators', () => {
  const people = [staff, moderator, lp1, lp2, lp4];
  assert.deepEqual(DmPolicy.recipientsFor(lp1, people).map(person => person.id), [1, 3]);
  assert.deepEqual(DmPolicy.recipientsFor(staff, people).map(person => person.id), [3, 11, 12, 14]);
  const optedIn = person => [11, 12, 14].includes(person.id);
  const coInvestors = DmPolicy.recipientsFor(lp1, people, { mode: 'co-investors', optedIn }).map(person => person.id);
  assert.deepEqual(coInvestors, [1, 3, 12, 14], 'LP 2 shares s1 and LP 4 shares s2');
});

test('only staff post in updates; every member reads all-members updates', () => {
  assert.deepEqual(ChannelRules.canPost(lp1, all), { allowed: false, reason: 'staff-only' });
  assert.deepEqual(ChannelRules.canPost(moderator, all), { allowed: false, reason: 'staff-only' });
  assert.deepEqual(ChannelRules.canPost(staff, all), { allowed: true, reason: '' });
  assert.equal(ChannelRules.canRead(lpNone, all), true);
  assert.equal(ChannelRules.canRead(visitor, all), false);
});

test('a member of another series cannot read or post there', () => {
  assert.equal(ChannelRules.canRead(lp4, s1), false);
  assert.equal(ChannelRules.canRead(lp4, s1Updates), false);
  assert.deepEqual(ChannelRules.canPost(lp4, s1), { allowed: false, reason: 'not-member' });
  assert.equal(ChannelRules.canRead(staff, s3), true, 'staff are in every series');
});

test('a muted member can read but cannot post', () => {
  assert.equal(ChannelRules.canRead(lp2, s1), true);
  assert.deepEqual(ChannelRules.canPost(lp2, s1, { muted: true }), { allowed: false, reason: 'muted' });
  assert.deepEqual(ChannelRules.canPost(lp2, s1), { allowed: true, reason: '' });
});

test('readable keeps the setup order', () => {
  assert.deepEqual(ChannelRules.readable(lp4, channels).map(channel => channel.id), [100, 102, 202]);
});

test('replyTargets puts the update\'s own series first and skips groups you cannot post in', () => {
  assert.deepEqual(ChannelRules.replyTargets(lp1, all, channels).map(channel => channel.id), [201, 202]);
  assert.deepEqual(ChannelRules.replyTargets(lp1, s2Updates, channels).map(channel => channel.id), [202, 201]);
  const mutedInS1 = channelId => channelId === 201;
  assert.deepEqual(ChannelRules.replyTargets(lp1, all, channels, { isMuted: mutedInS1 }).map(channel => channel.id), [202]);
  assert.deepEqual(ChannelRules.replyTargets(lpNone, all, channels), []);
});
