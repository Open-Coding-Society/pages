const DEFAULT_INDEX_URL = 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/';

let runtimePromise = null;
let loaderPromise = null;

function ensureLoader(indexURL) {
  if (typeof globalThis.loadPyodide === 'function') {
    return Promise.resolve();
  }

  if (typeof document === 'undefined') {
    return Promise.reject(new Error('The browser Python engine is unavailable.'));
  }

  if (!loaderPromise) {
    loaderPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      const timeout = setTimeout(() => {
        script.remove();
        reject(new Error('Python download timed out. Check your connection and run again.'));
      }, 60000);
      script.src = `${indexURL}pyodide.js`;
      script.crossOrigin = 'anonymous';
      script.onload = () => {
        clearTimeout(timeout);
        if (typeof globalThis.loadPyodide === 'function') {
          resolve();
        } else {
          reject(new Error('The browser Python engine did not initialize.'));
        }
      };
      script.onerror = () => {
        clearTimeout(timeout);
        script.remove();
        reject(new Error('The browser Python engine could not be downloaded. Check your connection and run again.'));
      };
      document.head.appendChild(script);
    }).catch((error) => {
      loaderPromise = null;
      throw error;
    });
  }

  return loaderPromise;
}

async function loadRuntime(indexURL) {
  await ensureLoader(indexURL);

  if (!runtimePromise) {
    let timeout;
    const deadline = new Promise((resolve, reject) => {
      timeout = setTimeout(() => reject(new Error('Python initialization timed out. Check your connection and run again.')), 60000);
    });
    runtimePromise = Promise.race([globalThis.loadPyodide({ indexURL }), deadline]).catch((error) => {
      runtimePromise = null;
      throw error;
    }).finally(() => clearTimeout(timeout));
  }

  return runtimePromise;
}

export class PyodideExecutor {
  constructor({ outputElement, execTimeElement, indexURL = DEFAULT_INDEX_URL } = {}) {
    this.outputElement = outputElement;
    this.execTimeElement = execTimeElement;
    this.indexURL = indexURL;
  }

  async run(code = '') {
    if (!this.outputElement) {
      throw new Error('PyodideExecutor requires an output element');
    }

    const startTime = Date.now();
    this.outputElement.textContent = '⏳ Loading Python in your browser...';
    if (this.execTimeElement) this.execTimeElement.textContent = '';

    let runtime;
    let globals;
    let executionError = null;
    let output = '';

    try {
      runtime = await loadRuntime(this.indexURL);
      this.outputElement.textContent = '⏳ Running...';

      runtime.runPython([
        'import sys',
        'from io import StringIO',
        '__runner_output = StringIO()',
        'sys.stdout = __runner_output',
        'sys.stderr = __runner_output',
      ].join('\n'));

      try {
        // Each run starts fresh, even though widgets share the downloaded runtime.
        globals = runtime.runPython('dict(__name__="__main__")');
        runtime.runPython(code, { globals });
      } catch (error) {
        executionError = error;
      }

      output = runtime.runPython('__runner_output.getvalue()');
    } catch (error) {
      executionError = error;
    } finally {
      globals?.destroy();
      if (runtime) {
        try {
          runtime.runPython('sys.stdout = sys.__stdout__\nsys.stderr = sys.__stderr__');
        } catch (restoreError) {
          if (!executionError) executionError = restoreError;
        }
      }
    }

    if (executionError) {
      const message = executionError.message || String(executionError);
      this.outputElement.textContent = output ? output + '\nError: ' + message : 'Error: ' + message;
      return;
    }

    this.outputElement.textContent = output || '[no output]';
    if (this.execTimeElement) {
      this.execTimeElement.textContent = `⏱ Execution time: ${Date.now() - startTime}ms (browser)`;
    }
  }
}

export default PyodideExecutor;
