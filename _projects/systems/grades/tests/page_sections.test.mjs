import assert from "node:assert/strict";
import test from "node:test";

import { followSectionHash, markSidebarSection, sectionForHash } from "../js/page-sections.js";

const SECTIONS = ["sprint", "growth", "forecast"];

// A sidebar link as markSidebarSection sees it.
function fakeLink(section) {
  const attributes = new Map();
  return {
    dataset: { sidebarSection: section },
    setAttribute: (name, value) => attributes.set(name, value),
    removeAttribute: (name) => attributes.delete(name),
    current: () => attributes.get("aria-current"),
  };
}

function fakeSidebar(sections) {
  const links = sections.map(fakeLink);
  return { links, querySelectorAll: () => links };
}

test("the hash opens the section it names", () => {
  assert.equal(sectionForHash("#growth", SECTIONS), "growth");
  assert.equal(sectionForHash("forecast", SECTIONS), "forecast");
});

test("no hash or an unknown one opens the first section", () => {
  assert.equal(sectionForHash("", SECTIONS), "sprint");
  assert.equal(sectionForHash("#grade", SECTIONS), "sprint");
});

test("a section the viewer can't open falls back to the first", () => {
  const studentCanOpen = (name) => name !== "all-submissions";
  const submissions = ["my-submissions", "created-assignments", "all-submissions"];
  assert.equal(sectionForHash("#all-submissions", submissions, studentCanOpen), "my-submissions");
  assert.equal(sectionForHash("#created-assignments", submissions, studentCanOpen), "created-assignments");
});

test("only the shown section's sidebar links are current, in the side column and the phone menu", () => {
  const sidebar = fakeSidebar(["sprint", "growth", "forecast", "sprint", "growth", "forecast"]);
  markSidebarSection(sidebar, "growth");
  assert.deepEqual(sidebar.links.map((link) => link.current() ?? null), [null, "true", null, null, "true", null]);

  markSidebarSection(sidebar, "forecast");
  assert.deepEqual(sidebar.links.map((link) => link.current() ?? null), [null, null, "true", null, null, "true"]);
});

test("the page shows the hash's section on load and again when the hash changes", async (t) => {
  const listeners = {};
  const sidebar = fakeSidebar(SECTIONS);
  const shown = [];
  // Node has no browser globals, so the test lends the page's three and takes them back.
  Object.assign(globalThis, {
    location: { hash: "#forecast" },
    document: sidebar,
    window: { addEventListener: (type, listener) => { listeners[type] = listener; } },
  });
  t.after(() => { delete globalThis.location; delete globalThis.document; delete globalThis.window; });

  followSectionHash(SECTIONS, (name) => shown.push(name));
  await Promise.resolve();
  assert.deepEqual(shown, ["forecast"]);
  assert.equal(sidebar.links[2].current(), "true");

  globalThis.location.hash = "#growth";
  listeners.hashchange();
  await Promise.resolve();
  assert.deepEqual(shown, ["forecast", "growth"]);
  assert.equal(sidebar.links[1].current(), "true");
  assert.equal(sidebar.links[2].current(), undefined);
});

test("a page with no sections is a mistake, not a blank page", () => {
  assert.throws(() => followSectionHash([], () => {}), /at least one section/);
});
