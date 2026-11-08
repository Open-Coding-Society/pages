import { BackendError } from '../js/backend.js';

// A fake backend: `answers` maps "METHOD /path" to a value to resolve, or to a function that
// throws. Every request is recorded as "METHOD /path", and its body in `bodies` under that key, as
// the JSON a real Backend would send at that moment (a later change to the object doesn't show).
export function fakeBackend(answers = {}) {
  const calls = [];
  const bodies = {};
  return {
    calls,
    bodies,
    async request(path, { method = 'GET', body } = {}) {
      const key = `${method} ${path}`;
      calls.push(key);
      if (body !== undefined) bodies[key] = JSON.parse(JSON.stringify(body));
      const answer = answers[key];
      return typeof answer === 'function' ? answer() : answer ?? null;
    },
  };
}

export const refuse = (status, body = null, method = 'POST', path = '/') => () => { throw new BackendError({ status, method, path, body }); };
export const unreachable = () => () => { throw new BackendError({ status: 0, method: 'GET', path: '/', cause: new TypeError('Failed to fetch') }); };
