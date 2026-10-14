export function selectedDocuments(documents, categories, rankedIds = null) {
  const selected = documents.filter((document) =>
    categories.every((category) => document.categories.includes(category)));
  if (rankedIds === null) return selected;
  const byUrl = new Map(selected.map((document) => [document.url, document]));
  return rankedIds.filter((url) => byUrl.has(url)).map((url) => byUrl.get(url));
}

export function readState(search) {
  const params = new URLSearchParams(search);
  return {
    categories: [...new Set(params.getAll('category').map((value) => value.toLowerCase()))],
    query: params.get('q') || '',
    view: params.get('view') === 'list' ? 'list' : 'cards',
  };
}

export function writeState(state) {
  const params = new URLSearchParams();
  state.categories.forEach((category) => params.append('category', category));
  if (state.query) params.set('q', state.query);
  if (state.view === 'list') params.set('view', 'list');
  return params.toString();
}

export function matchPositions(result, field) {
  const metadata = result.matchData.metadata;
  return Object.values(metadata).flatMap((fields) => fields[field]?.position || []);
}

export function groupedMatches(documents, categories, results) {
  const selected = new Map(selectedDocuments(documents, categories).map((document) => [document.url, document]));
  const title = [];
  const body = [];
  for (const result of results) {
    const document = selected.get(result.ref);
    if (!document) continue;
    const titlePositions = matchPositions(result, 'title');
    if (titlePositions.length) {
      title.push({ document, positions: titlePositions });
    } else {
      const field = matchPositions(result, 'content').length ? 'content' : 'description';
      body.push({ document, field, positions: matchPositions(result, field) });
    }
  }
  return { title, body };
}

export function highlightedParts(text, positions, excerpt = false) {
  const ranges = positions.map(([start, length]) => [Math.max(0, start), Math.min(text.length, start + length)])
    .filter(([start, end]) => end > start).sort((a, b) => a[0] - b[0]);
  const first = ranges[0]?.[0] || 0;
  const start = excerpt ? Math.max(0, first - 70) : 0;
  const end = excerpt ? Math.min(text.length, Math.max(start + 180, ranges[0]?.[1] || 0)) : text.length;
  const parts = [];
  if (start) parts.push({ text: '…', highlighted: false });
  let cursor = start;
  for (const [from, to] of ranges) {
    if (from >= end || to <= cursor) continue;
    if (from > cursor) parts.push({ text: text.slice(cursor, from), highlighted: false });
    const begin = Math.max(cursor, from);
    const stop = Math.min(end, to);
    parts.push({ text: text.slice(begin, stop), highlighted: true });
    cursor = stop;
  }
  if (cursor < end) parts.push({ text: text.slice(cursor, end), highlighted: false });
  if (end < text.length) parts.push({ text: '…', highlighted: false });
  return parts;
}
