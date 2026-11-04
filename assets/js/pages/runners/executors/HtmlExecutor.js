// Renders the editor's HTML straight into the page, like a %%html notebook cell.
// The output is part of the page, so ocs__ classes and the theme's CSS variables apply.
export class HtmlExecutor {
  constructor({ editor, outputElement } = {}) {
    this.editor = editor;
    this.outputElement = outputElement;
  }

  stop() {
    if (this.outputElement) {
      this.outputElement.innerHTML = '';
    }
  }

  run() {
    const code = this.editor?.getValue?.() || '';
    const outputElement = this.outputElement;
    if (!outputElement) {
      throw new Error('HtmlExecutor requires an output element');
    }

    // Start clean, so a value an earlier script set on the output box does not stick around.
    outputElement.removeAttribute('style');
    outputElement.innerHTML = code;
    this.runScripts();

    // Lets a lesson check what was rendered, for example to auto-grade a challenge.
    outputElement.dispatchEvent(new CustomEvent('runner:rendered', {
      bubbles: true,
      detail: { code, outputElement },
    }));
  }

  // innerHTML does not run <script> tags. Run them in order, each in its own
  // function scope (like UI_RUNNER cells), so running again cannot redeclare a const.
  runScripts() {
    const outputElement = this.outputElement;
    outputElement.querySelectorAll('script').forEach((script) => {
      if (script.src || script.type === 'module') {
        const fresh = document.createElement('script');
        [...script.attributes].forEach((attr) => fresh.setAttribute(attr.name, attr.value));
        fresh.textContent = script.textContent;
        script.replaceWith(fresh);
        return;
      }

      try {
        new Function('outputElement', script.textContent)(outputElement);
      } catch (err) {
        const message = document.createElement('div');
        message.className = 'ocs__callout';
        message.textContent = `Script error: ${err.message}`;
        outputElement.appendChild(message);
      }
    });
  }
}

export default HtmlExecutor;
