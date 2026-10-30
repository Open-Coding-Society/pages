import test from "node:test";
import assert from "node:assert/strict";
import {
  apiErrorText, cardEnding, chooseRoomId, hasUnknownMember, memberRows, normalizeCardNumber,
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

test("lists each member with their name and the cards whose user_id is theirs", () => {
  const users = [{ uid: "kush", name: "Kush Shah", id: 5 }, { uid: "ruta", name: "Ruta S", id: 6 }];
  const tags = [{ tag_uid: "111", user_id: 5 }, { tag_uid: "222", user_id: 9 }];
  assert.deepEqual(memberRows(["kush", "ruta"], users, tags), [
    { uid: "kush", name: "Kush Shah", cards: ["111"] },
    { uid: "ruta", name: "Ruta S", cards: [] },
  ]);
});

test("does not mix up two people with the same name", () => {
  const users = [{ uid: "a", name: "Sam Lee", id: 1 }, { uid: "b", name: "Sam Lee", id: 2 }];
  const tags = [{ tag_uid: "111", user_id: 2, user_name: "Sam Lee" }];
  assert.deepEqual(memberRows(["a", "b"], users, tags).map((row) => row.cards), [[], ["111"]]);
});

test("shows a member missing from the user list by uid, with no cards guessed", () => {
  assert.deepEqual(memberRows(["new"], [], [{ tag_uid: "1", user_id: 3 }]), [{ uid: "new", name: "new", cards: [] }]);
});

test("notices a member the cached user list does not have yet", () => {
  assert.equal(hasUnknownMember(["a", "b"], [{ uid: "a" }]), true);
  assert.equal(hasUnknownMember(["a"], [{ uid: "a" }]), false);
});
