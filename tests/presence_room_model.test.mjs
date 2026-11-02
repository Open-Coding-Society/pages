import test from "node:test";
import assert from "node:assert/strict";
import {
  apiErrorText, cardEnding, chooseRoomId, currentEnrollment, enrollmentLabel, hasUnknownMember, memberRows,
  normalizeCardNumber, periodChoices, periodLabel, periodsForRoom, roomMembers,
} from "../assets/js/capstone/presence-room-model.js";

const rooms = [{ id: 3 }, { id: 7 }];

test("keeps the room from the URL when it exists", () => {
  assert.equal(chooseRoomId(rooms, 7), 7);
});

test("falls back to the first room when the URL names a missing room", () => {
  assert.equal(chooseRoomId(rooms, 99), 3);
});

test("has no room to show when none exist", () => {
  assert.equal(chooseRoomId([], 1), null);
});

test("shows only the last 4 digits of a card", () => {
  assert.equal(cardEnding("186143099593"), "•••• 9593");
});

test("accepts a card number with spaces and rejects anything else", () => {
  assert.equal(normalizeCardNumber(" 1861 4309 9593 "), "186143099593");
  assert.equal(normalizeCardNumber("12ab"), null);
  assert.equal(normalizeCardNumber(""), null);
});

test("uses the server's message for an error, or the status code", () => {
  assert.equal(apiErrorText({ status: 404, data: { message: "no user with uid x" } }), "no user with uid x");
  assert.equal(apiErrorText({ status: 502, data: null }), "Request failed (502)");
});

const member = (uid, period_name = null) => ({ uid, period_name });

test("reads each member's period from the room", () => {
  const room = { member_uids: ["kush"], members: [{ uid: "kush", name: "Kush Shah", period_name: "Period A" }] };
  assert.deepEqual(roomMembers(room), [member("kush", "Period A")]);
});

test("treats member_uids as every period when the room has no members list", () => {
  assert.deepEqual(roomMembers({ member_uids: ["a", "b"] }), [member("a"), member("b")]);
  assert.deepEqual(roomMembers({}), []);
});

test("lists each member with their name, period and the cards whose user_id is theirs", () => {
  const users = [{ uid: "kush", name: "Kush Shah", id: 5 }, { uid: "ruta", name: "Ruta S", id: 6 }];
  const tags = [{ tag_uid: "111", user_id: 5 }, { tag_uid: "222", user_id: 9 }];
  assert.deepEqual(memberRows([member("kush", "Period A"), member("ruta")], users, tags), [
    { uid: "kush", name: "Kush Shah", period_name: "Period A", cards: ["111"] },
    { uid: "ruta", name: "Ruta S", period_name: null, cards: [] },
  ]);
});

test("does not mix up two people with the same name", () => {
  const users = [{ uid: "a", name: "Sam Lee", id: 1 }, { uid: "b", name: "Sam Lee", id: 2 }];
  const tags = [{ tag_uid: "111", user_id: 2, user_name: "Sam Lee" }];
  assert.deepEqual(memberRows([member("a"), member("b")], users, tags).map((row) => row.cards), [[], ["111"]]);
});

test("shows a member missing from the user list by uid, with no cards guessed", () => {
  assert.deepEqual(memberRows([member("new")], [], [{ tag_uid: "1", user_id: 3 }]), [
    { uid: "new", name: "new", period_name: null, cards: [] },
  ]);
});

test("notices a member the cached user list does not have yet", () => {
  assert.equal(hasUnknownMember(["a", "b"], [{ uid: "a" }]), true);
  assert.equal(hasUnknownMember(["a"], [{ uid: "a" }]), false);
});

const enrollRooms = [{ id: 3, name: "Presence Demo Room", periods: ["Period A", "Period B"] }, { id: 7, name: "Club", periods: [] }];

test("finds a room's periods, or none for an unknown room", () => {
  assert.deepEqual(periodsForRoom(enrollRooms, 3), ["Period A", "Period B"]);
  assert.deepEqual(periodsForRoom(enrollRooms, 99), []);
});

test("offers a student only real periods, or every period in a room without a schedule", () => {
  assert.deepEqual(periodChoices(["Period A", "Period B"]), ["Period A", "Period B"]);
  assert.deepEqual(periodChoices([]), [null]);
});

test("offers staff every period first, in any room", () => {
  assert.deepEqual(periodChoices(["Period A"], { staff: true }), [null, "Period A"]);
  assert.deepEqual(periodChoices([], { staff: true }), [null]);
});

test("names a null period All periods", () => {
  assert.equal(periodLabel(null), "All periods");
  assert.equal(periodLabel("Period A"), "Period A");
});

test("shows the first enrollment with the person's name, room and period", () => {
  const me = {
    uid: "user", name: "Test User",
    enrollments: [{ room_id: 3, room: "Presence Demo Room", period_name: "Period A" }, { room_id: 7, room: "Club", period_name: null }],
  };
  assert.equal(currentEnrollment(me).room_id, 3);
  assert.equal(enrollmentLabel(me), "Test User - Presence Demo Room, Period A");
  assert.equal(enrollmentLabel({ ...me, enrollments: [me.enrollments[1]] }), "Test User - Club, All periods");
});

test("has no enrollment when the person has not joined a room", () => {
  assert.equal(currentEnrollment({ uid: "user", name: "Test User", enrollments: [] }), null);
});
