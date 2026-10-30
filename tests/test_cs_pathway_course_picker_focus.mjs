import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(
  new URL("../_projects/games/cs-pathway/model/coursePickerFocus.js", import.meta.url),
  "utf8",
);
const { keepPickerToItsOwnRunner, GAME_RUNNER_SELECTOR } = await import(
  `data:text/javascript;charset=utf-8,${encodeURIComponent(source)}`
);

// A DOM element that only knows which game runner (if any) it sits inside.
const elementIn = (runner) => ({
  closest: (selector) => (selector === GAME_RUNNER_SELECTOR ? runner : null),
});

function setUp() {
  const pickerRunner = { name: "course picker runner" };
  const courseGameRunner = { name: "CSSE game runner" };
  const pickerControl = {
    isPaused: false,
    pause() { this.isPaused = true; },
    resume() { this.isPaused = false; },
  };
  const game = { activeGameControl: pickerControl };
  const doc = new EventTarget();
  const stop = keepPickerToItsOwnRunner(
    { gameControl: pickerControl, gameContainer: elementIn(pickerRunner), game },
    doc,
  );
  const click = (target) => {
    const event = new Event("pointerdown");
    Object.defineProperty(event, "target", { value: target });
    doc.dispatchEvent(event);
  };
  return { pickerRunner, courseGameRunner, pickerControl, game, click, stop };
}

test("playing the course game below pauses the course picker", () => {
  const { courseGameRunner, pickerControl, click } = setUp();
  click(elementIn(courseGameRunner));
  assert.equal(pickerControl.isPaused, true);
});

test("clicking back on the course picker resumes it", () => {
  const { pickerRunner, courseGameRunner, pickerControl, click } = setUp();
  click(elementIn(courseGameRunner));
  click(elementIn(pickerRunner));
  assert.equal(pickerControl.isPaused, false);
});

test("clicking a dialogue button outside every game (Skip) leaves the picker paused", () => {
  const { courseGameRunner, pickerControl, click } = setUp();
  click(elementIn(courseGameRunner));
  click(elementIn(null));
  assert.equal(pickerControl.isPaused, true);
});

test("clicks while the cookie gate is open leave the picker to the gate", () => {
  const { pickerRunner, pickerControl, game, click } = setUp();
  pickerControl.pause(); // the gate pauses the picker while it runs
  game.activeGameControl = { name: "cookie gate" };
  click(elementIn(pickerRunner));
  assert.equal(pickerControl.isPaused, true);
});

test("after the level is destroyed, clicks no longer pause the picker", () => {
  const { courseGameRunner, pickerControl, click, stop } = setUp();
  stop();
  click(elementIn(courseGameRunner));
  assert.equal(pickerControl.isPaused, false);
});
