import { ButtonFeedback } from './ButtonFeedback.js';
import { EditorManager } from './EditorManager.js';
import { StatsManager } from './StatsManager.js';
import { StorageManager } from './StorageManager.js';

export class BaseRunner {
  constructor(container, options = {}) {
    if (!container) {
      throw new Error('BaseRunner requires a container element');
    }

    this.container = container;
    this.containerId = container.id;
    this.storageKey = options.storageKey || container.dataset.storageKey || '';
    this.statusSelector = options.statusSelector || '.status-text';

    this.editor = null;
    this.defaultCode = '';
    this.initialCode = '';
    this.currentCode = '';
    this.trackStats = true;
    this.codeListeners = new Set();

    this.storage = new StorageManager(this.storageKey);
    this.stats = new StatsManager(container, { statusSelector: this.statusSelector });
    this.editorManager = new EditorManager(container, {
      containerId: this.containerId,
      onChange: (code) => {
        this.currentCode = code;
        this.codeListeners.forEach((listener) => listener(code));
        if (this.trackStats) {
          this.stats.updateFromCode(code);
        }
      },
    });
  }

  applyScopedStyle(cssText) {
    return this.editorManager.applyScopedStyle(cssText);
  }

  setCodeMirrorHeight(height = '300px') {
    return this.editorManager.setCodeMirrorHeight(height);
  }

  setOutputHeight(selector, height = '') {
    if (!height) return;
    return this.applyScopedStyle(
      `#${this.containerId} ${selector} { min-height: ${height}; max-height: ${height}; height: ${height}; }`
    );
  }

  getStoredValue(fallback = '') {
    return this.storage.get(fallback);
  }

  initializeEditor({
    defaultCode = '',
    editorHeight = '',
    enabled = true,
    fallbackCode = '',
    codeMirrorOptions = {},
    trackStats = true,
  } = {}) {
    this.defaultCode = defaultCode ?? '';
    try {
      this.initialCode = this.getStoredValue(this.defaultCode);
    } catch (error) {
      console.error(`Runner ${this.containerId}: stored source could not be read`, error);
      this.updateStatus(`Stored source unavailable: ${error.message}`);
      this.initialCode = this.defaultCode;
    }
    this.currentCode = this.initialCode || fallbackCode || '';
    this.trackStats = trackStats;

    this.editor = this.editorManager.initialize({
      initialCode: this.currentCode,
      editorHeight,
      enabled,
      fallbackCode,
      codeMirrorOptions,
      trackChanges: true,
    });

    if (this.trackStats) {
      this.stats.updateFromCode(this.currentCode);
    }

    return this.editor;
  }

  getValue() {
    return this.editorManager.getValue(this.currentCode ?? this.initialCode ?? this.defaultCode ?? '');
  }

  setValue(value = '') {
    this.currentCode = value;
    this.editorManager.setValue(value);
    if (!this.editor) {
      this.codeListeners.forEach((listener) => listener(value));
    }
    if (this.trackStats) {
      this.stats.updateFromCode(value);
    }
  }

  onCodeChange(listener) {
    this.codeListeners.add(listener);
    return () => this.codeListeners.delete(listener);
  }

  updateStats() {
    this.stats.updateFromCode(this.getValue());
  }

  updateStatus(status) {
    this.stats.updateStatus(status);
  }

  saveToStorage(value = this.getValue()) {
    this.currentCode = value;
    return this.storage.save(value);
  }

  clearStorage() {
    this.storage.clear();
  }

  flashButton(button, temporaryLabel = '✔', duration = 2000) {
    ButtonFeedback.flash(button, temporaryLabel, duration);
  }

  getHookElement(hookName, fallbackSelector = '') {
    if (!hookName) {
      return fallbackSelector ? this.container.querySelector(fallbackSelector) : null;
    }
    const byHook = this.container.querySelector(`[data-hook="${hookName}"]`);
    if (byHook) {
      return byHook;
    }
    return fallbackSelector ? this.container.querySelector(fallbackSelector) : null;
  }

  bindButton(selector, handler, hookName = '') {
    const button = this.getHookElement(hookName, selector);
    if (!button) {
      return null;
    }

    if (typeof handler === 'function') {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        handler(event, button);
      });
    }

    return button;
  }

  bindEditorButtons({
    resetValue = this.defaultCode,
    onClear,
    onSave,
    onCopy,
    saveAction,
    canClear,
    clearFeedback = '✔',
    saveFeedback = '✔ Saved',
    copyFeedback = '✔ Copied',
    feedbackDuration = 2000,
  } = {}) {
    const clearBtn = this.getHookElement('clear', '.clearStorageBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (typeof canClear === 'function' && !canClear()) return;
        this.clearStorage();
        this.setValue(resetValue || '');
        if (typeof onClear === 'function') {
          onClear();
        }
        this.flashButton(clearBtn, clearFeedback, feedbackDuration);
      });
    }

    const saveBtn = this.getHookElement('save', '.saveBtn');
    if (saveBtn) {
      saveBtn.addEventListener('click', async () => {
        saveBtn.disabled = true;
        try {
          if (typeof saveAction === 'function') {
            await saveAction();
          } else {
            this.saveToStorage();
          }
          if (typeof onSave === 'function') {
            await onSave();
          }
          this.flashButton(saveBtn, saveFeedback, feedbackDuration);
        } catch (error) {
          console.error(`Runner ${this.containerId}: save failed`, error);
          this.updateStatus(`Save failed: ${error.message}`);
        } finally {
          saveBtn.disabled = false;
        }
      });
    }

    const copyBtn = this.getHookElement('copy', '.copyBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const code = this.getValue();
        navigator.clipboard.writeText(code).then(() => {
          if (typeof onCopy === 'function') {
            onCopy(code);
          }
          this.flashButton(copyBtn, copyFeedback, feedbackDuration);
        }).catch((error) => {
          console.warn(`Runner ${this.containerId}: copy failed`, error);
        });
      });
    }
  }

  bindShortcut(handler) {
    this.editorManager.bindShortcut(handler);
  }
}

export default BaseRunner;
