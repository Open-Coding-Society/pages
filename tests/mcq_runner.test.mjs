import assert from "node:assert/strict";
import test from "node:test";

import { applyMcqPick, formatMcqAnswers, parseMcqPicks, scoreMcq } from "../assets/js/mcq-runner.js";

const questions = [
  { q: "First?", code: "int x;", choices: ["One", "Two"], answer: 1 },
  { q: "Second?", choices: ["Three", "Four", "Five"], answer: 0 },
  { q: "Third?", choices: ["Six", "Seven"], answer: 0 },
];

test("the score counts saved answers, and only matching ones as correct", () => {
  assert.deepEqual(scoreMcq(questions, [1, 2, null]), { answered: 2, correct: 1 });
});

test("the Gist text holds the score line and each question's last saved answer", () => {
  const text = formatMcqAnswers(questions, [1, 2, null]);

  assert.ok(text.startsWith("Score: 1/3 | answers: B,C,-\n"));
  assert.match(text, /Question 1: First\?\nint x;\nLast saved answer: B\. Two\nResult: correct/);
  assert.match(text, /Question 2: Second\?\nLast saved answer: C\. Five\nResult: incorrect/);
  assert.match(text, /Question 3: Third\?\nLast saved answer: none\nResult: not answered/);
});

test("saved picks are restored, and start blank when there are none", () => {
  assert.deepEqual(parseMcqPicks(JSON.stringify([1, null, 0]), questions), [1, null, 0]);
  assert.deepEqual(parseMcqPicks(null, questions), [null, null, null]);
});

test("saved picks that no longer fit the questions count as unanswered", () => {
  assert.deepEqual(parseMcqPicks(JSON.stringify([9, "A"]), questions), [null, null, null]);
  assert.deepEqual(parseMcqPicks('{"not": "a list"}', questions), [null, null, null]);
});

test("unreadable saved picks start over instead of breaking the page", (t) => {
  t.mock.method(console, "warn", () => {});

  assert.deepEqual(parseMcqPicks("{oops", questions), [null, null, null]);
});

test("a check keeps answers saved by another open tab", () => {
  const savedByOtherTab = JSON.stringify([1, 2, null]);

  assert.deepEqual(applyMcqPick(savedByOtherTab, questions, 2, 0), [1, 2, 0]);
});

test("a check replaces only its own question's answer", () => {
  assert.deepEqual(applyMcqPick(JSON.stringify([0, 2, null]), questions, 0, 1), [1, 2, null]);
});
