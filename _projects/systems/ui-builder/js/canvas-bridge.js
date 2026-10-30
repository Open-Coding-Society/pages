// The editor's side of the canvas protocol (DESIGN §7.4). The canvas is a same-origin iframe of
// /ui-builder/canvas/?nonce=<n> that exposes window.OCSUiCanvas. The nonce makes the handshake
// race-free: the editor only talks to the canvas instance it loaded, never to a stale one or to
// another page the frame was navigated to. The canvas keeps no state, so every iframe load is
// handshaken again and gets its callbacks, the last render and the selection re-sent.

export const READY_EVENT = 'ocs:ui-canvas-ready';
const NONCE = /^[a-z0-9]{16,64}$/;

export function makeNonce(cryptoImpl = globalThis.crypto) {
  const bytes = new Uint8Array(16);
  cryptoImpl.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function canvasUrl(baseurl, nonce) {
  if (!NONCE.test(String(nonce))) throw new Error('UI Builder canvas: bad nonce');
  return `${String(baseurl || '').replace(/\/+$/, '')}/ui-builder/canvas/?nonce=${nonce}`;
}

// Reading another window's globals throws when it isn't same-origin (an error page, a link that
// escaped): that simply means "no canvas yet".
function canvasOf(iframe) {
  try {
    const win = iframe.contentWindow;
    const canvas = win && win.OCSUiCanvas;
    return canvas && typeof canvas === 'object' ? canvas : null;
  } catch (_) {
    return null;
  }
}

function matches(canvas, nonce) {
  return Boolean(canvas) && canvas.nonce === nonce && typeof canvas.render === 'function';
}

// Resolves with the iframe's OCSUiCanvas once its nonce matches: at once if it is already there,
// else when the canvas announces itself on the editor window. Rejects after timeoutMs.
export function waitForCanvas(iframe, { nonce, timeoutMs = 10000, win = globalThis.window, setTimer = setTimeout, clearTimer = clearTimeout } = {}) {
  const existing = canvasOf(iframe);
  if (matches(existing, nonce)) return Promise.resolve(existing);
  return new Promise((resolve, reject) => {
    let timer = null;
    const done = () => {
      clearTimer(timer);
      win.removeEventListener(READY_EVENT, onReady);
    };
    function onReady(event) {
      const detail = event && event.detail;
      if (!detail || detail.nonce !== nonce) return;
      const canvas = canvasOf(iframe);
      if (!canvas || detail.canvas !== canvas || !matches(canvas, nonce)) return;
      done();
      resolve(canvas);
    }
    win.addEventListener(READY_EVENT, onReady);
    timer = setTimer(() => {
      done();
      reject(Object.assign(new Error('UI Builder canvas: the canvas did not load'), { name: 'CanvasTimeout' }));
    }, timeoutMs);
  });
}

// Owns the iframe: loads it, handshakes on every load and re-sends the last render. Callbacks:
// onSelect(id|null), onHover(id|null), onAddRequest({sectionId, cellIndex}), onKey(keyEvent:
// the key fields plus nodeId, the part with focus), onStatus('loading'|'ready'|'failed', error?).
export function createCanvasBridge({
  iframe, baseurl = '', win = globalThis.window, timeoutMs = 10000, nonceOf = makeNonce,
  onSelect = () => {}, onHover = () => {}, onAddRequest = () => {}, onKey = () => {}, onStatus = () => {},
} = {}) {
  let nonce = null;
  let canvas = null;
  let attempt = 0;
  let destroyed = false;
  let last = null; // {specJson, options} of the newest render
  let selectedId = null;

  // Values coming back from the canvas realm are read with typeof checks only.
  const idOf = (value) => (typeof value === 'string' && value ? value : null);
  const callbacks = {
    select: (id) => { if (!destroyed) onSelect(idOf(id)); },
    hover: (id) => { if (!destroyed) onHover(idOf(id)); },
    add: (request) => {
      if (destroyed || !request || typeof request !== 'object') return;
      const sectionId = idOf(request.sectionId);
      const cellIndex = Number.isInteger(request.cellIndex) ? request.cellIndex : 0;
      if (sectionId) onAddRequest({ sectionId, cellIndex });
    },
    key: (event) => { if (!destroyed && event && typeof event === 'object') onKey(event); },
  };

  function send(target) {
    if (!last) return Promise.resolve();
    return Promise.resolve(target.render(last.specJson, { ...last.options, selectedId }))
      .catch((error) => onStatus('failed', error));
  }

  async function handshake() {
    const mine = ++attempt;
    canvas = null;
    onStatus('loading');
    try {
      const found = await waitForCanvas(iframe, { nonce, timeoutMs, win });
      if (mine !== attempt || destroyed) return;
      found.onSelect(callbacks.select);
      found.onHover(callbacks.hover);
      found.onAddRequest(callbacks.add);
      found.onKey(callbacks.key);
      canvas = found;
      await send(found);
      if (mine === attempt && !destroyed) onStatus('ready');
    } catch (error) {
      if (mine === attempt && !destroyed) onStatus('failed', error);
    }
  }

  function load() {
    nonce = nonceOf();
    canvas = null;
    iframe.src = canvasUrl(baseurl, nonce);
  }

  iframe.addEventListener('load', handshake);
  load();

  return {
    get ready() { return Boolean(canvas); },
    render(page, { realData = false } = {}) {
      last = { specJson: JSON.stringify(page), options: { realData: realData === true } };
      return canvas ? send(canvas) : Promise.resolve();
    },
    select(id) {
      selectedId = idOf(id);
      if (canvas) canvas.select(selectedId);
    },
    scrollTo(id) {
      if (canvas && idOf(id)) canvas.scrollTo(id);
    },
    focus() {
      try {
        iframe.focus();
        if (iframe.contentWindow) iframe.contentWindow.focus();
      } catch (_) {
        // the frame is mid-load or not ours; focusing the element is enough
      }
    },
    reload: load,
    destroy() {
      destroyed = true;
      attempt += 1;
      iframe.removeEventListener('load', handshake);
    },
  };
}
