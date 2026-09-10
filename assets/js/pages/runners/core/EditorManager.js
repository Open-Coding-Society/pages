export class EditorManager {
  constructor(container, { containerId = '', onChange } = {}) {
    this.container = container;
    this.containerId = containerId || container.id;
    this.onChange = onChange;
    this.editor = null;
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

  initialize({
    initialCode = '',
    editorHeight = '',
    enabled = true,
    fallbackCode = '',
    codeMirrorOptions = {},
    trackChanges = true,
  } = {}) {
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
    this.editor.setValue(initialCode || fallbackCode || '');

    if (trackChanges && typeof this.onChange === 'function') {
      this.editor.on('change', () => {
        this.onChange(this.editor.getValue());
      });
      this.onChange(this.editor.getValue());
    }

    return this.editor;
  }

  getValue(fallback = '') {
    if (this.editor) {
      return this.editor.getValue();
    }

    const textarea = this.container.querySelector('.editor-textarea');
    return textarea ? textarea.value : fallback;
  }

  setValue(value = '') {
    if (this.editor) {
      this.editor.setValue(value);
      return;
    }

    const textarea = this.container.querySelector('.editor-textarea');
    if (textarea) {
      textarea.value = value;
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

export default EditorManager;
