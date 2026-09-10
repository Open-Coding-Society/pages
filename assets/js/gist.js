/**
 * gist.js — the shared envelope.
 *
 * Turns a bundle of files into a URL. That is the whole job.
 *
 * This module deliberately knows nothing about code runners, grading, lessons
 * or any widget's markup. Anything that can produce a `files` object can use it,
 * and it must never import a producer — the feature that needs both is the only
 * place they meet.
 *
 *   import { exportToGist } from '/assets/js/gist.js';
 *   const url = await exportToGist(files, { type: 'submission' });
 */

import { javaURI } from '/assets/js/api/config.js';

/** Filename of the manifest describing what an envelope contains. */
export const MANIFEST = 'ocs.json';

const DEFAULT_DESCRIPTION = 'Exported from Open Coding Society';

/**
 * Send a bundle of files off and get back a URL pointing at them.
 *
 * @param {Object} files  { "name.java": { content: "..." }, ... }
 * @param {Object} [opts]
 * @param {string} [opts.type]         what this bundle is, e.g. 'submission'.
 *                                     Written into the manifest so whoever opens
 *                                     it can tell whether it is theirs to handle.
 * @param {string} [opts.description]  human-readable label
 * @returns {Promise<string>} the URL
 */
export async function exportToGist(files, opts = {}) {
  if (!files || Object.keys(files).length === 0) {
    throw new Error('exportToGist: no files to send');
  }

  // Copy, so stamping the manifest never mutates the caller's object.
  const payload = { ...files };

  if (opts.type) {
    payload[MANIFEST] = {
      content: JSON.stringify({
        type: opts.type,
        version: 1,
        source: window.location.pathname,
        createdAt: new Date().toISOString(),
      }, null, 2),
    };
  }

  const res = await fetch(`${javaURI}/api/grades/create-gist`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Origin': 'client',
    },
    body: JSON.stringify({
      files: payload,
      description: opts.description || DEFAULT_DESCRIPTION,
    }),
  });

  if (!res.ok) {
    // 401/403 is by far the most common failure and deserves its own message,
    // otherwise callers surface the literal word "Forbidden" to a student.
    if (res.status === 401 || res.status === 403) {
      throw new Error('Sign in before exporting.');
    }
    throw new Error(`Export failed (${res.status})`);
  }

  const { url } = await res.json();
  if (!url) throw new Error('Export succeeded but returned no URL');
  return url;
}

/**
 * Read the manifest out of a bundle, if it has one.
 * Lets a consumer check `type` before trying to render someone else's payload.
 *
 * @param {Object} files
 * @returns {Object|null}
 */
export function readManifest(files) {
  const raw = files?.[MANIFEST]?.content;
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Pull the gist id out of anything a person is likely to paste.
 *
 * Accepts a bare id, a gist URL with or without a username, and a trailing
 * revision or /edit segment.
 *   https://gist.github.com/user/3f7a1b...  -> 3f7a1b...
 *   https://gist.github.com/3f7a1b...       -> 3f7a1b...
 *   3f7a1b...                               -> 3f7a1b...
 *
 * @param {string} urlOrId
 * @returns {string|null}
 */
export function gistIdFrom(urlOrId) {
  if (!urlOrId) return null;
  const text = String(urlOrId).trim();

  if (/^[a-fA-F0-9]{6,64}$/.test(text)) return text;

  // Last hex-looking path segment wins; ignores /edit, /revisions, #file-...
  const segments = text.split(/[/#?]/).filter(Boolean);
  for (let i = segments.length - 1; i >= 0; i--) {
    if (/^[a-fA-F0-9]{6,64}$/.test(segments[i])) return segments[i];
  }
  return null;
}

/**
 * Open an envelope: given its URL (or id), get the files back.
 *
 * Goes through the backend rather than GitHub directly — gists are created
 * secret, and the token that can read them lives on the server.
 *
 * @param {string} urlOrId
 * @returns {Promise<{files: Object, description: string, manifest: Object|null}>}
 */
export async function importFromGist(urlOrId) {
  const id = gistIdFrom(urlOrId);
  if (!id) throw new Error('That does not look like a gist link.');

  const res = await fetch(`${javaURI}/api/grades/read-gist/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'X-Origin': 'client' },
  });

  if (!res.ok) {
    if (res.status === 404) throw new Error('No gist found for that link.');
    if (res.status === 401 || res.status === 403) throw new Error('Sign in to open this.');
    throw new Error(`Could not open gist (${res.status})`);
  }

  const { files, description } = await res.json();
  return { files: files || {}, description, manifest: readManifest(files) };
}
