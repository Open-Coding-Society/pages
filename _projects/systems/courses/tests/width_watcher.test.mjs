// The week calendar and the Coming up ticker redraw for a new width on the next animation frame
// (WidthWatcher in js/announcement-calendar/width-watcher.js). A redraw inside the ResizeObserver
// callback changed the element's own size while the observer was still reporting sizes, and the
// browser then fired "ResizeObserver loop completed with undelivered notifications" as an error.
import assert from 'node:assert/strict';
import test from 'node:test';

// A ResizeObserver whose report the test sends, and animation frames the test runs.
class FakeResizeObserver {
  static last = null;

  constructor(callback) {
    this.callback = callback;
    this.targets = [];
    this.disconnected = false;
    FakeResizeObserver.last = this;
  }

  observe(target) { this.targets.push(target); }

  disconnect() {
    this.targets = [];
    this.disconnected = true;
  }

  report() { this.callback(this.targets.map((target) => ({ target })), this); }
}

let frames = new Map();
let nextFrame = 1;
globalThis.requestAnimationFrame = (callback) => {
  frames.set(nextFrame, callback);
  nextFrame += 1;
  return nextFrame - 1;
};
globalThis.cancelAnimationFrame = (id) => { frames.delete(id); };
function runFrames() {
  const due = [...frames.values()];
  frames = new Map();
  due.forEach((callback) => callback());
}

const { WidthWatcher } = await import('../js/announcement-calendar/width-watcher.js');

// A strip `width` pixels wide, watched; each redraw records the width it saw.
function watch(width) {
  globalThis.ResizeObserver = FakeResizeObserver;
  frames = new Map();
  const element = { clientWidth: width };
  const redraws = [];
  const watcher = new WidthWatcher(element, () => redraws.push(element.clientWidth));
  return { element, redraws, watcher, observer: FakeResizeObserver.last };
}

test('a new width is redrawn on the next frame, not while the observer is reporting', () => {
  const { element, redraws, observer } = watch(1012);
  element.clientWidth = 492;
  observer.report();
  assert.deepEqual(redraws, [], 'nothing is redrawn inside the resize callback');
  runFrames();
  assert.deepEqual(redraws, [492]);
});

test('a report with the same width, like the first one or the one for a redraw\'s new height, redraws nothing', () => {
  const { element, redraws, observer } = watch(1012);
  observer.report();
  runFrames();
  assert.deepEqual(redraws, []);
  element.clientWidth = 492;
  observer.report();
  runFrames();
  observer.report();
  runFrames();
  assert.deepEqual(redraws, [492]);
});

test('a width that changes again before the frame is redrawn once, at the last width', () => {
  const { element, redraws, observer } = watch(1012);
  element.clientWidth = 700;
  observer.report();
  element.clientWidth = 492;
  observer.report();
  runFrames();
  assert.deepEqual(redraws, [492]);
});

test('stop() disconnects the observer and drops a redraw that hasn\'t run yet', () => {
  const { element, redraws, observer, watcher } = watch(1012);
  element.clientWidth = 492;
  observer.report();
  watcher.stop();
  runFrames();
  assert.deepEqual(redraws, []);
  assert.equal(observer.disconnected, true);
});

test('a browser without ResizeObserver never redraws, and stop() still works', () => {
  delete globalThis.ResizeObserver;
  frames = new Map();
  const element = { clientWidth: 1012 };
  const redraws = [];
  const watcher = new WidthWatcher(element, () => redraws.push(element.clientWidth));
  element.clientWidth = 492;
  watcher.stop();
  runFrames();
  assert.deepEqual(redraws, []);
});
