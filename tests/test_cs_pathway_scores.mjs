import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test, { beforeEach } from "node:test";

// Browser globals the score model uses.
const storage = new Map();
globalThis.localStorage = {
  getItem: (key) => (storage.has(key) ? storage.get(key) : null),
  setItem: (key, value) => storage.set(key, String(value)),
};
globalThis.window = new EventTarget();

// Stand-in for services/PathwayScoreApi.js so no network is needed.
const savedRequests = [];
let serverAvailable = true;
let serverLevels = [];
globalThis.__pathwayScoreApiStub = {
  fetchLevelScores: async () => serverLevels,
  saveLevelProgress: async (levelKey, percentComplete) => {
    if (!serverAvailable) throw new Error("offline");
    savedRequests.push({ levelKey, percentComplete });
    return { levelKey, percentComplete, finished: percentComplete >= 100 };
  },
};

const source = (await readFile(new URL("../_projects/games/cs-pathway/model/pathwayScores.js", import.meta.url), "utf8"))
  .replace(
    /import \{ fetchLevelScores, saveLevelProgress \} from '..\/services\/PathwayScoreApi.js';/,
    "const { fetchLevelScores, saveLevelProgress } = globalThis.__pathwayScoreApiStub;",
  );
const { completeLevelTask, recordLevelRatio, getCachedScores, getNextLevel, syncScoresFromServer } = await import(
  `data:text/javascript;charset=utf-8,${encodeURIComponent(source)}`
);

beforeEach(() => {
  storage.clear();
  savedRequests.length = 0;
  serverAvailable = true;
  serverLevels = [];
});

test("each finished task raises a level's percent by its share of the tasks", async () => {
  await completeLevelTask("identity-forge", "identity");
  await completeLevelTask("identity-forge", "avatar");
  assert.equal(getCachedScores()["identity-forge"], 40);
  assert.deepEqual(savedRequests.at(-1), { levelKey: "identity-forge", percentComplete: 40 });
});

test("finishing the same task twice does not double count or resend", async () => {
  await completeLevelTask("assessment-observatory", "github-analytics");
  await completeLevelTask("assessment-observatory", "github-analytics");
  assert.equal(savedRequests.length, 1);
  assert.equal(getCachedScores()["assessment-observatory"], 33.3);
});

test("ratio levels cap at 100% even with bonus rounds", async () => {
  await recordLevelRatio("mission-tools", 6, 4);
  assert.equal(getCachedScores()["mission-tools"], 100);
});

test("progress never goes down on the local dashboard", async () => {
  await recordLevelRatio("toolchain-trail", 3, 4);
  await recordLevelRatio("toolchain-trail", 1, 4);
  assert.equal(getCachedScores()["toolchain-trail"], 75);
});

test("logged-out play still updates the local dashboard", async () => {
  serverAvailable = false;
  await completeLevelTask("wayfinding-world", "about-me");
  assert.equal(getCachedScores()["wayfinding-world"], 20);
});

test("server scores are merged into the local cache", async () => {
  serverLevels = [{ levelKey: "mission-tools", percentComplete: 50, finished: false }];
  const scores = await syncScoresFromServer();
  assert.equal(scores["mission-tools"], 50);
});

test("unknown levels and tasks fail fast", () => {
  assert.throws(() => completeLevelTask("not-a-level", "x"), /Unknown CS Pathway level/);
  assert.throws(() => completeLevelTask("identity-forge", "not-a-task"), /Unknown task/);
  assert.throws(() => recordLevelRatio("mission-tools", 1, 0), /totalCount must be positive/);
});

test("score updates notify the dashboard", async () => {
  let notified = null;
  window.addEventListener("cs-pathway-scores-updated", (event) => { notified = event.detail.scores; }, { once: true });
  await recordLevelRatio("toolchain-trail", 2, 4);
  assert.equal(notified["toolchain-trail"], 50);
});

test("levels link forward in play order and the last level has no next level", () => {
  assert.equal(getNextLevel("identity-forge").pagePath, "/cs-pathway/wayfinding");
  assert.equal(getNextLevel("wayfinding-world").key, "mission-tools");
  assert.equal(getNextLevel("mission-tools").key, "assessment-observatory");
  assert.equal(getNextLevel("assessment-observatory").pagePath, "/cs-pathway/toolchain-trail");
  assert.equal(getNextLevel("toolchain-trail"), null);
  assert.throws(() => getNextLevel("not-a-level"), /Unknown CS Pathway level/);
});

test("every level has a short name for the scores bar", () => {
  for (const key of ["identity-forge", "wayfinding-world", "mission-tools", "assessment-observatory"]) {
    assert.ok(getNextLevel(key).shortName, key);
  }
});
