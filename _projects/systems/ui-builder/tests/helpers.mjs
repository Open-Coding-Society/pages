// Shared test helpers: the real registry YAML read with Ruby's YAML (the parser Jekyll uses),
// merged and normalized the way the page does it, plus a deterministic id generator.
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { mergeRegistry, normalizeRegistry } from '../js/registry.js';

export let hasRuby = true;
try { execFileSync('ruby', ['-v']); } catch (_) { hasRuby = false; }

export const needsRuby = { skip: hasRuby ? false : 'needs Ruby to read the registry YAML' };

export function dataPath(name) {
  return fileURLToPath(new URL(`../data/${name}`, import.meta.url));
}

export function readYaml(name) {
  return JSON.parse(execFileSync('ruby', ['-ryaml', '-rjson', '-e', 'puts JSON.generate(YAML.load_file(ARGV[0]))', dataPath(name)], { encoding: 'utf8' }));
}

let cached = null;
export function loadRegistry() {
  if (!cached) {
    const merged = mergeRegistry(readYaml('ui_builder.yml'), readYaml('ui_builder_school.yml'));
    cached = normalizeRegistry(merged, { courseTitles: { csp: 'Computer Science Principles' } });
  }
  return cached;
}

// s-000001, b-000002, … so tests can predict ids.
export function counterIds() {
  let n = 0;
  return (kind) => `${kind}-${String(++n).padStart(6, '0')}`;
}
