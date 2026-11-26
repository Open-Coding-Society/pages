// Shared test helpers: the real registry (data/event_registry.yml) read with Ruby's YAML, the
// parser Jekyll uses, and the words object the pages write for the browser scripts the way
// _includes/event-texts-json.html does. Tests that use them are skipped where Ruby isn't installed.
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

let hasRuby = true;
try { execFileSync('ruby', ['-v']); } catch (_) { hasRuby = false; }

export const needsRuby = { skip: hasRuby ? false : 'needs Ruby to read the registry YAML' };

let cached = null;

/** The Events registry, as Jekyll reads it. */
export function readRegistry() {
  if (!cached) {
    const file = fileURLToPath(new URL('../data/event_registry.yml', import.meta.url));
    cached = JSON.parse(execFileSync('ruby', ['-ryaml', '-rjson', '-e', 'puts JSON.generate(YAML.load_file(ARGV[0]))', file], { encoding: 'utf8' }));
  }
  return cached;
}

/** An event page's words: the registry's page texts and section labels, under the event's own labels. */
export function pageWords(registry, labels = {}) {
  const sections = Object.fromEntries(registry.sections.map((section) => [section.key, section.label]));
  return { ...registry.texts.page, ...sections, ...labels };
}

/** The words JSON a page writes for its scripts; page is null on the catalog. */
export function browserTexts(registry, page = null) {
  return {
    lifecycle: registry.lifecycle, catalog: registry.texts.catalog, viewer: registry.texts.viewer,
    discussion: registry.discussion, page,
  };
}

/** Mort's six lifecycle keys, in his order, from the registry. */
export const orderOf = (registry) => registry.lifecycle.map((stage) => stage.key);
