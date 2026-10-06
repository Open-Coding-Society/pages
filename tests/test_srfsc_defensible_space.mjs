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

const { rateFireWeather } = await import("../_projects/systems/srfsc/js/fireWeather.js");

// Mirrors SrfscConditionsTest in the Flask repo so the browser fallback and backend agree.
test("red flag alerts are extreme regardless of weather", () => {
  assert.equal(rateFireWeather(80, 0, ["Red Flag Warning"]).level, "Extreme");
});

test("dry and windy is high; dry or breezy is elevated", () => {
  assert.equal(rateFireWeather(10, 30, []).level, "High");
  assert.equal(rateFireWeather(24, 5, []).level, "Elevated");
  assert.equal(rateFireWeather(60, 18, []).level, "Elevated");
});

test("calm humid weather is normal even with non-fire alerts", () => {
  assert.equal(rateFireWeather(60, 5, ["Extreme Heat Warning"]).level, "Normal");
});

test("missing readings are unknown", () => {
  assert.equal(rateFireWeather(null, null, []).level, "Unknown");
});
