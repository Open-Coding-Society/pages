import { parseDependencyBlocks, updateDependencies } from './DependencyBlocks.js';

const registries = new WeakMap();
const MODE_LANGUAGE = {
  'text/x-java': 'java', 'text/x-python': 'python', 'text/html': 'html', htmlmixed: 'html',
  'text/x-scss': 'scss', 'text/css': 'css', 'text/javascript': 'javascript',
};

export function mountRunnerDependencies(runner, mode) {
  const container = runner.container;
  const document = container.ownerDocument;
  const panel = container.querySelector('.editor-container .control-panel');
  if (!panel) return null;
  let registry = registries.get(document);
  if (!registry) {
    registry = new Map();
    registries.set(document, registry);
  }
  // The document reader may replace a page's runners without a full browser reload.
  for (const [element, entry] of registry) {
    if (!element.isConnected) {
      entry.destroy();
    }
  }

  const languageSelect = container.querySelector('.languageSelect');
  const language = () => languageSelect?.value || MODE_LANGUAGE[mode] || mode || 'javascript';
  const controls = document.createElement('div');
  controls.className = 'runner-dependencies';
  controls.hidden = true;
  const select = document.createElement('select');
  select.className = 'ocs__input';
  select.setAttribute('aria-label', 'Dependencies');
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'ocs__btn';
  button.textContent = 'Update dependency';
  const status = document.createElement('p');
  status.className = 'runner-dependencies-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  status.hidden = true;
  controls.append(select, button);
  panel.append(controls);
  panel.after(status);
  const lastApplied = new Map();
  let lastError = '';

  function report(message, error = null) {
    status.hidden = !message;
    status.textContent = message;
    if (error && message !== lastError) {
      console.error(`Runner ${runner.containerId}: ${message}`, error);
    }
    lastError = error ? message : '';
  }

  function refresh() {
    try {
      const dependencies = parseDependencyBlocks(runner.getValue(), language())
        .filter((block) => block.kind === 'dependency');
      controls.hidden = !dependencies.length;
      const selected = select.value;
      select.replaceChildren();
      for (const name of [...dependencies.map((block) => block.name), ...(dependencies.length > 1 ? ['*'] : [])]) {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name === '*' ? 'Update all' : name;
        select.append(option);
      }
      if ([...select.options].some((option) => option.value === selected)) select.value = selected;
      button.disabled = !dependencies.length;
      if (lastError) report('');
    } catch (error) {
      button.disabled = true;
      report(error.message, error);
    }
  }

  function update() {
    try {
      const current = runner.getValue();
      const names = select.value === '*'
        ? parseDependencyBlocks(current, language()).filter((block) => block.kind === 'dependency').map((block) => block.name)
        : [select.value];
      const providers = [];
      for (const [element, entry] of registry) {
        if (element === container || !element.isConnected) continue;
        const source = entry.runner.getStoredValue(null);
        if (source !== null) providers.push({ source, language: entry.language(), id: element.id });
      }
      const result = updateDependencies(current, language(), providers, names);
      if (result.code === current) {
        report('Dependencies already match the saved source.');
        return;
      }
      const starters = parseDependencyBlocks(runner.defaultCode, language());
      const edited = result.replacements.filter((replacement) => {
        const starter = starters.find((block) => block.kind === 'dependency' && block.name === replacement.name);
        const baseline = lastApplied.get(replacement.name)
          ?? (starter ? runner.defaultCode.slice(starter.bodyStart, starter.bodyEnd) : null);
        return replacement.previous !== baseline && replacement.previous !== replacement.body;
      });
      if (edited.length && !document.defaultView.confirm(
        `Replace your edited dependency code for ${edited.map((item) => item.name).join(', ')}? Your other code will stay unchanged.`)) {
        report('Update cancelled. Your code is unchanged.');
        return;
      }
      runner.setValue(result.code);
      for (const replacement of result.replacements) lastApplied.set(replacement.name, replacement.body);
      container.dataset.dependencyDirty = 'true';
      report(`Updated ${names.join(', ')} from saved source. Save this runner before submitting.`);
    } catch (error) {
      report(error.message, error);
    }
  }

  const unsubscribe = runner.onCodeChange(refresh);
  button.addEventListener('click', update);
  languageSelect?.addEventListener('change', refresh);
  const entry = {
    runner, language,
    saved(value) {
      if (value === runner.getValue()) {
        delete container.dataset.dependencyDirty;
        if (!lastError) report('');
      }
    },
    cleared() {
      delete container.dataset.dependencyDirty;
      lastApplied.clear();
      report('');
    },
    destroy() {
      unsubscribe();
      button.removeEventListener('click', update);
      languageSelect?.removeEventListener('change', refresh);
      controls.remove();
      status.remove();
      registry.delete(container);
    },
  };
  registry.set(container, entry);
  refresh();
  return entry;
}
