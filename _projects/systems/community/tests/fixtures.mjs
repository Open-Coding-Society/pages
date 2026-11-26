// Shared test setup: the system's YAML read the way Jekyll reads it, and paths to the other
// systems' modules the demo runs. The repo has no npm YAML parser, so Ruby's Psych (the
// parser Jekyll uses) turns each file into JSON.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const SYSTEM = new URL('../', import.meta.url);
export const REPO = new URL('../../../../', import.meta.url);

export function readYaml(relativePath) {
  const file = fileURLToPath(new URL(relativePath, SYSTEM));
  const json = execFileSync('ruby', ['-ryaml', '-rjson', '-e', 'puts JSON.generate(YAML.safe_load(File.read(ARGV[0])))', file], { encoding: 'utf8' });
  return JSON.parse(json);
}

export const loadSetup = () => readYaml('data/demo.yml');
export const loadTexts = () => readYaml('data/texts.yml');

export const repoFile = relativePath => new URL(relativePath, REPO);
export const readRepoFile = relativePath => readFileSync(repoFile(relativePath), 'utf8');

// Loads a browser module whose own imports can't run under Node (config.js carries Jekyll
// front matter): its import lines are dropped and `stubs` defines what they gave it, as
// tests/microblog_surveys.test.mjs does for microblog.js.
export async function loadWithStubs(relativePath, stubs) {
  const body = readRepoFile(relativePath).replace(/^import .*$/gm, '');
  return import(`data:text/javascript;base64,${Buffer.from(`${stubs}\n${body}`).toString('base64')}`);
}

// The microblog's survey functions, with its config and rate-limit imports stubbed.
export const loadMicroblog = () => loadWithStubs('_projects/systems/microblog/js/microblog.js', [
  'const pythonURI = "http://localhost:8587";',
  'const fetchOptions = {};',
  'const withMicroblogRateLimit = fn => fn;',
].join('\n'));

// Courses' calendar model and the chat reply helpers have no imports, but their folders
// don't mark .js as ES modules, so they load the same way.
export const loadCalendarModel = () => loadWithStubs('_projects/systems/courses/js/announcement-calendar/calendar-model.js', '');
export const loadChatReply = () => loadWithStubs('assets/js/chat/chat-reply.js', '');

// A fixed clock: Thursday 2026-11-19, 10:00 local time.
export const NOW = new Date(2026, 10, 19, 10, 0, 0);
export const fixedNow = () => new Date(NOW.getTime());
