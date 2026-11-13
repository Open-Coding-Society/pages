import assert from "node:assert/strict";
import test from "node:test";

// Students pick which runners a code submission sends (issue #71). Minimal page stand-ins:
// runner-io only needs querySelectorAll, dataset, a few child lookups, localStorage and events.
const storage = new Map();
globalThis.localStorage = {
  getItem: (key) => (storage.has(key) ? storage.get(key) : null),
  setItem: (key, value) => storage.set(key, String(value)),
  removeItem: (key) => storage.delete(key),
};
let containers = [];
const events = [];
globalThis.document = {
  querySelectorAll: () => containers,
  dispatchEvent: (event) => events.push(event),
};

function runner({ id, kind, lang = "python", title }) {
  const children = {
    ".languageSelect": kind ? null : { value: lang },
    ".challenge-box": { querySelector: (selector) => ({ textContent: selector === "h3" ? title : "Do the task." }) },
  };
  return {
    dataset: { runnerId: id, storageKey: `page_${id}`, ...(kind ? { runnerKind: kind } : {}) },
    querySelector: (selector) => children[selector] ?? null,
  };
}

const io = await import("../assets/js/runner-io.js");
const { submissionError } = await import("../assets/js/runner-submission.js");

const ids = (els) => els.map((el) => el.dataset.runnerId);

test.beforeEach(() => {
  storage.clear();
  events.length = 0;
  containers = [
    runner({ id: "warmup", title: "Code Runner Challenge #1" }),
    runner({ id: "hack-1", title: "Popcorn Hack #1" }),
    runner({ id: "hack-2", lang: "java", title: "Homework Hack" }),
    runner({ id: "why", kind: "reflection", title: "Reflection #1" }),
  ];
});

test("nothing is selected by default, so lesson creators never mark runners", () => {
  assert.deepEqual(io.selectedRunners(), []);
  assert.match(submissionError(), /Select at least one runner/);
});

test("selecting a runner survives a reload and can be undone", () => {
  io.setRunnerSelected(containers[1], true);
  assert.equal(storage.get("page_hack-1__submit"), "true");
  assert.deepEqual(ids(io.selectedRunners()), ["hack-1"]);

  io.setRunnerSelected(containers[1], false);
  assert.equal(storage.has("page_hack-1__submit"), false);
  assert.deepEqual(io.selectedRunners(), []);
});

test("every change is announced so the toggles and the submit panel stay in step", () => {
  io.setRunnerSelected(containers[2], true);
  io.setRunnerSelected(containers[2], false);

  assert.deepEqual(events.map((e) => [e.type, e.detail.selected]), [
    [io.SELECTION_CHANGE_EVENT, true],
    [io.SELECTION_CHANGE_EVENT, false],
  ]);
});

test("unsaved runners that were not selected never block the submit", () => {
  storage.set("page_hack-1", "print('hack')");
  io.setRunnerSelected(containers[1], true);

  assert.equal(io.unsavedRunners().length, 3, "the other runners are still unsaved");
  assert.equal(submissionError(), null);
});

test("a selected runner with nothing saved blocks the submit and is named", () => {
  storage.set("page_hack-1", "print('hack')");
  io.setRunnerSelected(containers[1], true);
  io.setRunnerSelected(containers[2], true);

  assert.deepEqual(ids(io.submissionStatus().selectedUnsaved), ["hack-2"]);
  assert.match(submissionError(), /Save these selected runners.*Homework Hack/);
});

test("only selected runners are bundled, keeping their usual file names", () => {
  storage.set("page_warmup", "print('practice')");
  storage.set("page_hack-2", "System.out.println(1);");
  storage.set("page_why", "Loops avoid repetition.");
  io.setRunnerSelected(containers[2], true);
  io.setRunnerSelected(containers[3], true);

  assert.deepEqual(Object.keys(io.readRunners({ selectedOnly: true })), ["hack-2.java", "why.md"]);
  assert.deepEqual(io.readRunnerKinds({ selectedOnly: true }), { "hack-2.java": "code", "why.md": "reflection" });
  // Without the option every saved runner is read, as the Gist export button expects.
  assert.deepEqual(Object.keys(io.readRunners()), ["warmup.py", "hack-2.java", "why.md"]);
});

test("unnamed runners keep their position-based name when earlier runners are skipped", () => {
  containers = [runner({ title: "Practice" }), runner({ title: "Popcorn Hack" })];
  containers.forEach((el, i) => { el.dataset.storageKey = `page_unnamed_${i}`; storage.set(`page_unnamed_${i}`, "x = 1"); });
  io.setRunnerSelected(containers[1], true);

  assert.deepEqual(Object.keys(io.readRunners({ selectedOnly: true })), ["runner_2.py"]);
});

test("the manifest summary lists submitted and skipped runners by id and title", () => {
  storage.set("page_hack-1", "print('hack')");
  storage.set("page_warmup", "print('practice')");
  io.setRunnerSelected(containers[1], true);

  assert.deepEqual(io.runnerSelectionSummary(), {
    total: 4,
    submitted: [{ id: "hack-1", title: "Popcorn Hack #1" }],
    skipped: [
      { id: "warmup", title: "Code Runner Challenge #1" },
      { id: "hack-2", title: "Homework Hack" },
      { id: "why", title: "Reflection #1" },
    ],
  });
});

test("a page with no runners cannot be submitted", () => {
  containers = [];
  assert.match(submissionError(), /no runners/);
});
