export class BaseRunner {
  constructor(container, options = {}) {
    if (!container) {
      throw new Error('BaseRunner requires a container element');
    }

    this.container = container;
    this.containerId = container.id;
    this.storageKey = options.storageKey || container.dataset.storageKey || '';
    this.statusSelector = options.statusSelector || '.status-text';
    this.statusElement = container.querySelector(this.statusSelector);
    this.editor = null;
    this.defaultCode = '';
    this.initialCode = '';
    this.currentCode = '';
  }

  applyScopedStyle(cssText) {
    const style = document.createElement('style');
    style.textContent = cssText;
    document.head.appendChild(style);
    return style;
  }

  setCodeMirrorHeight(height = '300px') {
    return this.applyScopedStyle(`#${this.containerId} .CodeMirror { height: ${height}; }`);
  }

  getStoredValue(fallback = '') {
    if (!this.storageKey) return fallback;
    const savedCode = localStorage.getItem(this.storageKey);
    return savedCode !== null ? savedCode : fallback;
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

    if (!enabled) {
      return null;
    }

    const textarea = this.container.querySelector('.editor-textarea');
    if (!textarea || typeof CodeMirror === 'undefined') {
      console.warn(`Runner ${this.containerId}: CodeMirror editor unavailable`);
      return null;
    }

    this.setCodeMirrorHeight(editorHeight || '300px');
    this.editor = CodeMirror.fromTextArea(textarea, codeMirrorOptions);
    this.editor.setValue(this.currentCode);

    if (trackStats) {
      this.editor.on('change', () => {
        this.currentCode = this.editor.getValue();
        this.updateStats();
      });
      this.updateStats();
    }

    return this.editor;
  }

  getValue() {
    if (this.editor) {
      return this.editor.getValue();
    }
    return this.currentCode ?? this.initialCode ?? this.defaultCode ?? '';
  }

  setValue(value = '') {
    this.currentCode = value;
    if (this.editor) {
      this.editor.setValue(value);
      return;
    }

    const textarea = this.container.querySelector('.editor-textarea');
    if (textarea) {
      textarea.value = value;
    }
  }

  updateStats() {
    if (!this.editor) return;

    const code = this.editor.getValue();
    const lineCountSpan = this.container.querySelector('.lineCount');
    const charCountSpan = this.container.querySelector('.charCount');

    if (lineCountSpan) {
      lineCountSpan.textContent = `Lines: ${code.split('\n').length}`;
    }
    if (charCountSpan) {
      charCountSpan.textContent = `Characters: ${code.length}`;
    }
  }

  updateStatus(status) {
    if (this.statusElement) {
      this.statusElement.textContent = status;
    }
  }

  saveToStorage(value = this.getValue()) {
    if (this.storageKey) {
      localStorage.setItem(this.storageKey, value);
    }
    this.currentCode = value;
    return value;
  }

  clearStorage() {
    if (this.storageKey) {
      localStorage.removeItem(this.storageKey);
    }
  }

  flashButton(button, temporaryLabel = '✔', duration = 2000) {
    if (!button) return;
    const original = button.innerHTML;
    button.innerHTML = temporaryLabel;
    setTimeout(() => {
      button.innerHTML = original;
    }, duration);
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
    if (!this.editor || typeof handler !== 'function') return;

    const existing = this.editor.getOption('extraKeys') || {};
    this.editor.setOption('extraKeys', {
      ...existing,
      'Ctrl-Enter': handler,
      'Cmd-Enter': handler,
    });
  }
}

export default BaseRunner;
