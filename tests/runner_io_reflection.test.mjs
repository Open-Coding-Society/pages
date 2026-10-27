import assert from "node:assert/strict";
import test from "node:test";

// Minimal page stand-ins: runner-io only needs querySelectorAll, dataset, a few child
// lookups and localStorage.
const storage = new Map();
globalThis.localStorage = {
  getItem: (key) => (storage.has(key) ? storage.get(key) : null),
  setItem: (key, value) => storage.set(key, String(value)),
};
let containers = [];
globalThis.document = { querySelectorAll: () => containers };

function runner({ id, kind, lang, title, question }) {
  const children = {
    ".languageSelect": lang ? { value: lang } : null,
    ".challenge-box": {
      querySelector: (selector) => ({ textContent: selector === "h3" ? title : question }),
    },
  };
  return {
    dataset: { runnerId: id, storageKey: `page_${id}`, ...(kind ? { runnerKind: kind } : {}) },
    querySelector: (selector) => children[selector] ?? null,
  };
}

const { readRunners, readRunnerKinds, unsavedRunners, writeRunners } = await import("../assets/js/runner-io.js");

test.beforeEach(() => {
  storage.clear();
  containers = [
    runner({ id: "loops-0", lang: "python", title: "Code Runner Challenge #1", question: "Print 1 to 3." }),
    runner({ id: "loops-why", kind: "reflection", title: "Reflection #1", question: "Why use a loop?" }),
  ];
});

test("code runners bundle exactly as before and reflections bundle as Markdown", () => {
  storage.set("page_loops-0", "for i in range(1, 4):\n    print(i)");
  storage.set("page_loops-why", "  It avoids repeating code.\n\nIt scales.  ");

  assert.deepEqual(readRunners(), {
    "loops-0.py": { content: "Question: Code Runner Challenge #1\nPrint 1 to 3.\n\nAnswer (runner: loops-0):\n\nfor i in range(1, 4):\n    print(i)" },
    "loops-why.md": { content: "Question: Reflection #1\nWhy use a loop?\n\nAnswer (reflection: loops-why):\n\nIt avoids repeating code.\n\nIt scales." },
  });
  assert.deepEqual(readRunnerKinds(), { "loops-0.py": "code", "loops-why.md": "reflection" });
});

test("an unsubmitted reflection blocks the page submit like an unsaved code runner", () => {
  storage.set("page_loops-0", "print(1)");

  assert.deepEqual(unsavedRunners().map((el) => el.dataset.runnerId), ["loops-why"]);
  assert.deepEqual(readRunnerKinds(), { "loops-0.py": "code" });
});

test("a reflection answer loads back from a gist bundle by id", () => {
  assert.deepEqual(writeRunners({ "loops-why.md": { content: "From the gist." } }), ["loops-why"]);
  assert.equal(storage.get("page_loops-why"), "From the gist.");
});
