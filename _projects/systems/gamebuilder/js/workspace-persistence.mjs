/**
 * @module workspace-persistence
 * @description Owns workspace save/load controls and automatic local recovery.
 * @data Keeps a recovery draft separate from the explicit save. Captures exact
 * source and unfinished edits; imports never generate or execute JavaScript.
 * @usage Wire with capture/restore callbacks after runner and form readiness.
 * Errors remain visible and block automatic overwrites until explicit recovery.
 */
import { createWorkspaceStore, parseWorkspace, serializeWorkspace } from './workspace-store.mjs';

function download(text, filename, type) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function createWorkspacePersistence({ root, runner, capture, restore, createNew }) {
  const status = root.querySelector('[data-role="save-status"]');
  const buttons = [...root.querySelectorAll('[data-workspace-action]')];
  const fileInput = root.querySelector('[data-role="workspace-file"]');
  let store;
  let paused = false;
  let applying = false;
  let timer = null;
  let lastDraft = '';
  let lastSaved = '';
  let initial = '';

  function report(message, state = 'info') {
    status.textContent = message;
    status.dataset.state = state;
  }

  function reportError(error) {
    paused = true;
    console.error('GameBuilder workspace persistence failed:', error);
    report(`${error.message} Your current work is still open; export JSON to keep a copy.`, 'error');
  }

  function read(slot) {
    try {
      return store.read(slot);
    } catch (error) {
      reportError(error);
      return null;
    }
  }

  function flush() {
    window.clearTimeout(timer);
    timer = null;
    if (paused || applying || !store) return false;
    try {
      const document = capture();
      const text = serializeWorkspace(document);
      if (text !== lastDraft) {
        store.write('draft', document);
        lastDraft = text;
      }
      report(text === lastSaved
        ? 'Workspace saved in this browser.'
        : 'Recovery draft kept in this browser. Save Workspace keeps a return point.', 'success');
      return true;
    } catch (error) {
      reportError(error);
      return false;
    }
  }

  function changed() {
    if (applying || paused) return;
    report('Changes not yet backed up...', 'info');
    window.clearTimeout(timer);
    timer = window.setTimeout(flush, 200);
  }

  function apply(document) {
    applying = true;
    try {
      restore(document);
    } finally {
      applying = false;
    }
  }

  function confirmReplace() {
    return window.confirm('Replace the open workspace and its recovery draft? Export JSON first if you want to keep this version.');
  }

  function allowExplicitRecovery() {
    // Re-observe the draft only after the user accepts replacing this tab's work.
    read('draft');
    paused = false;
  }

  try {
    store = createWorkspaceStore(window.localStorage, `ocs:gamebuilder:${window.location.pathname}:workspace-v1`);
    const saved = read('saved');
    const draft = read('draft');
    if (saved) lastSaved = serializeWorkspace(saved.document);
    const recovered = draft || saved;
    if (recovered) {
      apply(recovered.document);
      lastDraft = draft ? serializeWorkspace(draft.document) : '';
      if (!paused) report(draft ? 'Recovery draft restored, including code and unfinished edits.'
        : 'Saved workspace restored.', 'success');
    } else if (!paused) {
      report('Automatic draft recovery is on. Saves stay in this browser; export JSON for a portable copy.');
    }
    initial = serializeWorkspace(capture());
  } catch (error) {
    reportError(error);
  }

  async function save(snapshot) {
    if (!store) throw new Error('Browser storage is unavailable; export JSON instead');
    if (paused) throw new Error('Recovery is paused after a storage error. Export your work, then reload or explicitly load/import a workspace.');
    try {
      const document = capture();
      document.editorCode = snapshot.source;
      const record = store.write('saved', document);
      lastSaved = serializeWorkspace(record.document);
      if (!flush()) throw new Error('Workspace saved, but its recovery draft could not be updated');
      report('Workspace saved in this browser. Export JSON to keep it outside this browser.', 'success');
    } catch (error) {
      reportError(error);
      throw error;
    }
  }

  runner.setSaveHandler(save);
  runner.onCodeChange(changed);
  root.querySelector('.engineVersionSelect').addEventListener('change', changed);

  for (const button of buttons) {
    button.addEventListener('click', async () => {
      try {
        switch (button.dataset.workspaceAction) {
          case 'save':
            await runner.save();
            break;
          case 'load': {
            const saved = read('saved');
            if (!saved) {
              if (!paused) report('No saved workspace yet. Use Save Workspace first.');
              return;
            }
            if (!confirmReplace()) return;
            allowExplicitRecovery();
            apply(saved.document);
            lastSaved = serializeWorkspace(saved.document);
            lastDraft = '';
            flush();
            break;
          }
          case 'new':
            if (!confirmReplace()) return;
            if (!store) throw new Error('Browser storage is unavailable; export your work before starting over');
            allowExplicitRecovery();
            apply(createNew());
            lastDraft = '';
            flush();
            break;
          case 'export':
            download(JSON.stringify(JSON.parse(serializeWorkspace(capture())), null, 2),
              'gamebuilder-workspace.json', 'application/json');
            break;
          case 'export-code':
            download(runner.getCode(), 'GameLevelBuilder.js', 'text/javascript');
            break;
          case 'import':
            fileInput.click();
            break;
        }
      } catch (error) {
        reportError(error);
      }
    });
  }

  fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    if (!file) return;
    try {
      if (file.size > 5 * 1024 * 1024) throw new Error('Workspace JSON must be smaller than 5 MB');
      const document = parseWorkspace(await file.text());
      if (!confirmReplace()) return;
      if (store) allowExplicitRecovery();
      apply(document);
      lastDraft = '';
      if (!store || !flush()) report('JSON imported, but browser recovery is unavailable. Export to keep your changes.', 'error');
    } catch (error) {
      console.error('GameBuilder workspace import failed:', error);
      report(`Import failed: ${error.message}. The open workspace was not replaced.`, 'error');
    } finally {
      fileInput.value = '';
    }
  });

  window.addEventListener('pagehide', flush);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush();
  });
  window.addEventListener('beforeunload', (event) => {
    flush();
    const text = serializeWorkspace(capture());
    if ((paused && text !== initial) || text !== lastDraft) {
      event.preventDefault();
      event.returnValue = '';
    }
  });
  window.addEventListener('storage', (event) => {
    if (event.key?.startsWith(`ocs:gamebuilder:${window.location.pathname}:workspace-v1:`) || event.key === null) {
      reportError(new Error('Another tab changed workspace storage. Export your work before reloading'));
    }
  });

  return { changed, flush, recovered: lastDraft !== '' || lastSaved !== '' };
}
