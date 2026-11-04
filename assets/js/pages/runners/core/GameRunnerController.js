/**
 * Page-scoped GAME_RUNNER integration for source changes and successful saves.
 * Consumers may install an awaited workspace-save hook without replacing the
 * shared editor. Saved source and complete-workspace persistence are distinct.
 */
export function createGameRunnerController({ runner, runnerId, container, engineSelect, run, stop }) {
  let saveHandler = null;
  let savedSnapshot = null;
  try {
    const source = runner.storage.get(null);
    if (source !== null) {
      savedSnapshot = { schemaVersion: 1, runnerId, storageKey: runner.storageKey, source, revision: null };
    }
  } catch (error) {
    console.error(`Runner ${runnerId}: stored source could not be read`, error);
    runner.updateStatus(`Stored source unavailable: ${error.message}`);
  }

  return Object.freeze({
    setCode(code) {
      if (typeof code !== 'string') throw new TypeError('Game runner code must be a string');
      runner.setValue(code);
    },
    getCode: () => runner.getValue(),
    onCodeChange: (listener) => runner.onCodeChange(listener),
    getSaveState: () => savedSnapshot && { ...savedSnapshot },
    confirmClear: () => !saveHandler || window.confirm('Clear the open editor code? The recovery draft will also change. Your saved workspace is kept.'),
    setSaveHandler(handler) {
      if (handler !== null && typeof handler !== 'function') {
        throw new TypeError('Workspace save handler must be a function or null');
      }
      saveHandler = handler;
    },
    async save() {
      if (!runner.storageKey) throw new Error('This runner has no persistent storage key');
      const source = runner.getValue();
      runner.saveToStorage(source);
      savedSnapshot = {
        schemaVersion: 1, runnerId, storageKey: runner.storageKey,
        source, revision: crypto.randomUUID()
      };
      container.dispatchEvent(new CustomEvent('ocs:runner-saved', {
        bubbles: true, detail: { ...savedSnapshot }
      }));
      if (saveHandler) await saveHandler({ ...savedSnapshot });
      return { ...savedSnapshot };
    },
    getEngineVersion: () => engineSelect.value,
    setEngineVersion(version) {
      if (![...engineSelect.options].some((option) => option.value === version)) {
        throw new TypeError(`Unsupported game engine: ${version}`);
      }
      engineSelect.value = version;
    },
    run,
    stop
  });
}
