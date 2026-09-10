export class UiExecutor {
  constructor({ editor, outputElement } = {}) {
    this.editor = editor;
    this.outputElement = outputElement;
    this.currentExecution = null;
  }

  stop() {
    if (this.outputElement) {
      this.outputElement.innerHTML = '';
    }

    if (this.currentExecution && typeof this.currentExecution.stop === 'function') {
      this.currentExecution.stop();
    }

    this.currentExecution = null;
  }

  run() {
    const code = this.editor?.getValue?.() || '';
    this.stop();

    try {
      const outputElement = this.outputElement;
      const userFunction = new Function('outputElement', `
        'use strict';
        ${code}
      `);

      this.currentExecution = userFunction(outputElement);
    } catch (err) {
      if (this.outputElement) {
        this.outputElement.innerHTML = `<div style="color: red; padding: 1rem;">Error: ${err.message}</div>`;
      }
    }
  }
}

export default UiExecutor;
