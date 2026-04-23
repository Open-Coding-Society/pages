class AiNpcSession {
  constructor(npcId = 'npc') {
    this.npcId = npcId;
    this._abortController = new AbortController();
    this._active = true;
    this._timeouts = new Set();
    this._listeners = [];
  }

  get signal() {
    return this._abortController.signal;
  }

  isActive() {
    return this._active && !this.signal.aborted;
  }

  setTimeout(callback, delay) {
    const id = setTimeout(() => {
      this._timeouts.delete(id);
      if (!this.isActive()) return;
      callback();
    }, delay);

    this._timeouts.add(id);
    return id;
  }

  addListener(target, eventName, handler, options) {
    if (!target || typeof target.addEventListener !== 'function') return;

    target.addEventListener(eventName, handler, options);
    this._listeners.push({ target, eventName, handler, options });
  }

  cancel() {
    if (!this._active) return;
    this._active = false;

    try {
      this._abortController.abort();
    } catch (_error) {
      // no-op
    }

    this._timeouts.forEach((id) => clearTimeout(id));
    this._timeouts.clear();

    this._listeners.forEach(({ target, eventName, handler, options }) => {
      try {
        target.removeEventListener(eventName, handler, options);
      } catch (_error) {
        // no-op
      }
    });
    this._listeners = [];
  }
}

export default AiNpcSession;
