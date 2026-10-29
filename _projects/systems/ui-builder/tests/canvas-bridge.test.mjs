import { test } from 'node:test';
import assert from 'node:assert/strict';
import { READY_EVENT, canvasUrl, createCanvasBridge, makeNonce, waitForCanvas } from '../js/canvas-bridge.js';

const NONCE = '0123456789abcdef0123456789abcdef';

// An editor window that records listeners, so a test can play the canvas's ready event.
function fakeWindow() {
  const listeners = new Map();
  return {
    addEventListener: (type, fn) => listeners.set(fn, type),
    removeEventListener: (type, fn) => listeners.delete(fn),
    fire: (type, detail) => { for (const [fn, kind] of [...listeners]) if (kind === type) fn({ detail }); },
    count: () => listeners.size,
  };
}

function fakeCanvas(nonce = NONCE) {
  const calls = [];
  const canvas = {
    nonce,
    render: (json, options) => { calls.push(['render', JSON.parse(json), options]); return Promise.resolve(); },
    select: (id) => calls.push(['select', id]),
    scrollTo: (id) => calls.push(['scrollTo', id]),
    onSelect: (fn) => { canvas.selectFn = fn; },
    onHover: (fn) => { canvas.hoverFn = fn; },
    onAddRequest: (fn) => { canvas.addFn = fn; },
    onKey: (fn) => { canvas.keyFn = fn; },
  };
  return { canvas, calls };
}

test('nonces are 32 hex characters and the canvas address carries one', () => {
  const nonce = makeNonce();
  assert.match(nonce, /^[0-9a-f]{32}$/);
  assert.notEqual(makeNonce(), nonce);
  assert.equal(canvasUrl('/base/', nonce), `/base/ui-builder/canvas/?nonce=${nonce}`);
  assert.throws(() => canvasUrl('', 'x"><script>'), /nonce/);
});

test('waitForCanvas takes a canvas that is already there, if its nonce matches', async () => {
  const { canvas } = fakeCanvas();
  const iframe = { contentWindow: { OCSUiCanvas: canvas } };
  assert.equal(await waitForCanvas(iframe, { nonce: NONCE, win: fakeWindow() }), canvas);
});

test('waitForCanvas waits for the ready event of this frame\'s canvas with this nonce only', async () => {
  const win = fakeWindow();
  const iframe = { contentWindow: {} };
  const waiting = waitForCanvas(iframe, { nonce: NONCE, win, timeoutMs: 1000 });
  const stale = fakeCanvas('ffffffffffffffffffffffffffffffff').canvas;
  win.fire(READY_EVENT, { nonce: 'ffffffffffffffffffffffffffffffff', canvas: stale });
  const { canvas } = fakeCanvas();
  const impostor = fakeCanvas().canvas;
  win.fire(READY_EVENT, { nonce: NONCE, canvas: impostor });
  iframe.contentWindow.OCSUiCanvas = canvas;
  win.fire(READY_EVENT, { nonce: NONCE, canvas: impostor });
  win.fire(READY_EVENT, { nonce: NONCE, canvas });
  assert.equal(await waiting, canvas);
  assert.equal(win.count(), 0, 'the listener is removed');
});

test('waitForCanvas times out, and a cross-origin frame is not a canvas', async () => {
  const iframe = { get contentWindow() { return { get OCSUiCanvas() { throw new Error('SecurityError'); } }; } };
  await assert.rejects(waitForCanvas(iframe, { nonce: NONCE, win: fakeWindow(), timeoutMs: 5 }), { name: 'CanvasTimeout' });
});

test('the bridge handshakes on every load and re-sends the last render and selection', async () => {
  const win = fakeWindow();
  const listeners = {};
  const iframe = { contentWindow: {}, addEventListener: (type, fn) => { listeners[type] = fn; }, removeEventListener: () => {}, src: '' };
  const selected = [];
  const statuses = [];
  const bridge = createCanvasBridge({ iframe, baseurl: '', win, nonceOf: () => NONCE, onSelect: (id) => selected.push(id), onStatus: (status) => statuses.push(status) });
  assert.equal(iframe.src, `/ui-builder/canvas/?nonce=${NONCE}`);
  bridge.render({ v: 1 }, { realData: true });
  bridge.select('b-000001');
  const first = fakeCanvas();
  iframe.contentWindow.OCSUiCanvas = first.canvas;
  await listeners.load();
  assert.deepEqual(first.calls[0], ['render', { v: 1 }, { realData: true, selectedId: 'b-000001' }]);
  first.canvas.selectFn('b-000002');
  first.canvas.selectFn(42);
  first.canvas.addFn({ sectionId: 's-000001', cellIndex: 'x' });
  assert.deepEqual(selected, ['b-000002', null], 'values from the canvas realm are checked');
  // The frame reloads (a crash, a navigation): a new canvas, no state, everything sent again.
  const second = fakeCanvas();
  iframe.contentWindow = { OCSUiCanvas: second.canvas };
  await listeners.load();
  assert.deepEqual(second.calls[0], ['render', { v: 1 }, { realData: true, selectedId: 'b-000001' }]);
  assert.deepEqual(statuses, ['loading', 'ready', 'loading', 'ready']);
  bridge.destroy();
  second.canvas.selectFn('b-000003');
  assert.equal(selected.length, 2, 'nothing reaches the editor after destroy');
});
