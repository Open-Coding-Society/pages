// What the calls tests share: the real strings from data/calls.yml, read through Ruby's YAML
// (this repo has no npm, so no YAML parser for Node), and a fetch that answers from a script.
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

let cached = null;

/** data/calls.yml as the page hands it to CallPage.start (site.data.projects.calls.calls | jsonify). */
export function readStrings() {
  if (!cached) {
    const file = fileURLToPath(new URL('../data/calls.yml', import.meta.url));
    cached = JSON.parse(execFileSync('ruby', ['-ryaml', '-rjson', '-e', 'puts JSON.generate(YAML.load_file(ARGV[0]))', file], { encoding: 'utf8' }));
  }
  return structuredClone(cached);
}

/** A Response-like answer: status, JSON or text body, and headers. */
export function answer(status, body = null, headers = {}) {
  const lower = Object.fromEntries(Object.entries(headers).map(([key, value]) => [key.toLowerCase(), String(value)]));
  const text = body === null ? '' : (typeof body === 'string' ? body : JSON.stringify(body));
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: (name) => lower[String(name).toLowerCase()] ?? null },
    text: async () => text,
  };
}

/**
 * A fetch that hands each request to `route(method, path, init)` and records it. The route returns
 * an answer(), or throws to act like a network failure. Paths are relative to the javaURI.
 */
export function scriptedFetch(javaURI, route) {
  const calls = [];
  const fetch = async (url, init = {}) => {
    const path = String(url).startsWith(javaURI) ? String(url).slice(javaURI.length) : String(url);
    const call = { url: String(url), path, method: init.method ?? 'GET', init, body: init.body ? JSON.parse(init.body) : null };
    calls.push(call);
    return route(call.method, path, call);
  };
  return { fetch, calls };
}

export const CONFIG = Object.freeze({
  javaURI: 'http://localhost:8585',
  javaWebSocketURI: 'http://localhost:8589',
  pythonURI: 'http://localhost:8587',
  baseurl: '',
  springEnabled: true,
  fetchOptions: Object.freeze({
    method: 'GET',
    mode: 'cors',
    cache: 'default',
    credentials: 'include',
    headers: Object.freeze({ 'Content-Type': 'application/json', 'X-Origin': 'client' }),
  }),
});
