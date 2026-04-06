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

    this.storage = new StorageManager(this.storageKey);
    this.stats = new StatsManager(container, { statusSelector: this.statusSelector });
    this.editorManager = new EditorManager(container, {
      containerId: this.containerId,
      onChange: (code) => {
        this.currentCode = code;
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
    this.initialCode = this.getStoredValue(this.defaultCode);
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
    if (this.trackStats) {
      this.stats.updateFromCode(value);
    }
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

  bindButton(selector, handler) {
    const button = this.container.querySelector(selector);
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
    clearFeedback = '✔',
    saveFeedback = '✔ Saved',
    copyFeedback = '✔ Copied',
    feedbackDuration = 2000,
  } = {}) {
    const clearBtn = this.container.querySelector('.clearStorageBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.clearStorage();
        this.setValue(resetValue || '');
        if (typeof onClear === 'function') {
          onClear();
        }
        this.flashButton(clearBtn, clearFeedback, feedbackDuration);
      });
    }

    const saveBtn = this.container.querySelector('.saveBtn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        this.saveToStorage();
        if (typeof onSave === 'function') {
          onSave();
        }
        this.flashButton(saveBtn, saveFeedback, feedbackDuration);
      });
    }

    const copyBtn = this.container.querySelector('.copyBtn');
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
