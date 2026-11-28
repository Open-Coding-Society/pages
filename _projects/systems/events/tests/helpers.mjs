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

/** A registry word wrapped the way markedRegistry wraps it. */
export const mark = (text) => `⟦${text}⟧`;

/** What is left of a text once every wrapped (registry) word is taken out. */
export const unmarked = (text) => String(text).replace(/⟦[^⟧]*⟧/g, '');

/**
 * A copy of the registry with every word wrapped in ⟦ ⟧ (stage words and descriptions, section
 * labels, every text and the viewer's words), so a test can tell a word the registry gave from one
 * a script spells.
 */
export function markedRegistry() {
  const copy = structuredClone(readRegistry());
  const wrapAll = (words) => Object.fromEntries(Object.entries(words).map(([key, value]) => [key, mark(value)]));
  copy.lifecycle = copy.lifecycle.map((stage) => ({ ...stage, label: mark(stage.label), description: mark(stage.description) }));
  copy.sections = copy.sections.map((section) => ({ ...section, label: mark(section.label) }));
  copy.texts = Object.fromEntries(Object.entries(copy.texts).map(([name, words]) => [name, wrapAll(words)]));
  copy.viewer = wrapAll(copy.viewer);
  return copy;
}

/** The real registry's words a page can show, as written there. */
export function registryWords(registry = readRegistry()) {
  return [
    ...registry.lifecycle.flatMap((stage) => [stage.label, stage.description]),
    ...registry.sections.map((section) => section.label),
    ...Object.values(registry.texts).flatMap((words) => Object.values(words)),
    registry.viewer.label,
  ];
}

/** The registry words, unwrapped, that a page's text shows: none when every word came from the registry. */
export function wordsSpelledBy(text) {
  const left = unmarked(text);
  return registryWords().filter((word) => left.includes(word));
}
