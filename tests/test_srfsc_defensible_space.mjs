import assert from "node:assert/strict";
import test from "node:test";

const { CHECKLIST_ZONES, scoreChecklist } = await import(
  "../_projects/systems/srfsc/js/defensibleSpace.js"
);

const allItemIds = CHECKLIST_ZONES.flatMap((zone) => zone.items.map((item) => item.id));

test("an empty checklist is rated high risk", () => {
  assert.deepEqual(
    { percent: scoreChecklist(new Set()).percent, level: scoreChecklist(new Set()).level },
    { percent: 0, level: "low" },
  );
});

test("a complete checklist is rated well prepared", () => {
  const score = scoreChecklist(new Set(allItemIds));
  assert.equal(score.percent, 100);
  assert.equal(score.level, "high");
});

test("halfway through the checklist is rated medium", () => {
  const score = scoreChecklist(new Set(allItemIds.slice(0, Math.ceil(allItemIds.length / 2))));
  assert.equal(score.level, "medium");
});

test("checklist item ids are unique so checkbox state cannot collide", () => {
  assert.equal(new Set(allItemIds).size, allItemIds.length);
});
