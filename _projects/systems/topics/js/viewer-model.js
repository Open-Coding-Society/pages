import { readState, writeState } from './model.js';

export const SNAPSHOT_KEY = 'topics-viewer';

export function orderedDocuments(links, documents) {
  const byUrl = new Map(documents.map((document) => [document.url, document]));
  const seen = new Set();
  return [...links].filter((link) => {
    const url = link.dataset.topicsDocument;
    if (link.closest('[hidden]') || seen.has(url) || !byUrl.has(url)) return false;
    seen.add(url);
    return true;
  }).map((link) => {
    const document = byUrl.get(link.dataset.topicsDocument);
    return { url: document.url, title: document.title };
  });
}

export function readSnapshot(search, getStorage = () => window.sessionStorage) {
  try {
    const snapshot = JSON.parse(getStorage().getItem(SNAPSHOT_KEY));
    if (!snapshot || snapshot.state !== writeState(readState(search)) ||
        !Array.isArray(snapshot.documents) || !snapshot.documents.every((document) =>
          typeof document?.url === 'string' && document.url.startsWith('/') &&
          !document.url.startsWith('//') && typeof document.title === 'string')) return null;
    return snapshot;
  } catch (error) {
    console.warn('Could not read Topics navigation state:', error);
    return null;
  }
}

export function viewerDocumentUrl(document, base, search, origin) {
  const url = new URL(`${base}${document.url}`, origin);
  if (url.origin !== origin) throw new Error('Topics document must be on this site');
  url.search = writeState(readState(search));
  url.searchParams.set('context', 'topics');
  url.searchParams.set('topics_view', '1');
  return url;
}

export function neighbors(snapshot, pathname, base, origin) {
  const index = snapshot.documents.findIndex((document) =>
    new URL(`${base}${document.url}`, origin).pathname.replace(/\/+$/, '') === pathname.replace(/\/+$/, ''));
  return index < 0 ? [] : [snapshot.documents[index - 1], snapshot.documents[index + 1]];
}
