// Checked boxes in the same filter are alternatives (Java or Python); the Topic and
// Categories filters narrow each other (Java and Algorithms). `primary` lists the
// Topic Filter values; every other checked value belongs to the Categories Filter.
// With `match: 'and'`, every checked Topic Filter box is required (Java and Spring).
export function filterGroups(categories, { primary = [], match = 'or' } = {}) {
  const topics = categories.filter((category) => primary.includes(category));
  const others = categories.filter((category) => !primary.includes(category));
  const topicGroups = match === 'and' ? topics.map((topic) => [topic]) : [topics];
  return [...topicGroups, others].filter((group) => group.length);
}

export function selectedDocuments(documents, categories, rankedIds = null, rule = {}) {
  const groups = filterGroups(categories, rule);
  const selected = documents.filter((document) =>
    groups.every((group) => group.some((category) => document.categories.includes(category))));
  if (rankedIds === null) return selected;
  const byUrl = new Map(selected.map((document) => [document.url, document]));
  return rankedIds.filter((url) => byUrl.has(url)).map((url) => byUrl.get(url));
}

export function readState(search) {
  const params = new URLSearchParams(search);
  return {
    categories: [...new Set(params.getAll('category').map((value) => value.toLowerCase()))],
    match: params.get('match')?.toLowerCase() === 'and' ? 'and' : 'or',
    query: params.get('q') || '',
    view: params.get('view') === 'cards' ? 'cards' : 'list',
  };
}

export function writeState(state) {
  const params = new URLSearchParams();
  state.categories.forEach((category) => params.append('category', category));
  if (state.match === 'and') params.set('match', 'and');
  if (state.query) params.set('q', state.query);
  if (state.view === 'cards') params.set('view', 'cards');
  return params.toString();
}

export function matchPositions(result, field) {
  const metadata = result.matchData.metadata;
  return Object.values(metadata).flatMap((fields) => fields[field]?.position || []);
}

export function groupedMatches(documents, categories, results, rule = {}) {
  const selected = new Map(selectedDocuments(documents, categories, null, rule).map((document) => [document.url, document]));
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

export function resultDetails(document, primary = []) {
  const path = document.path || '';
  const labels = document.labels || document.categories;
  return {
    file: document.source || (path.split('/').pop() || document.url).replace(/_IPYNB_2_\.md$/, '.ipynb'),
    path,
    subjects: [...labels].sort((a, b) =>
      Number(primary.includes(b.toLowerCase())) - Number(primary.includes(a.toLowerCase()))),
  };
}

// A URL or file name has nowhere to wrap, so on a phone it would push its card
// wider than the screen. Split long words after / . _ = & ? # - and at least
// every `longest` characters; the browser may break at a <wbr> between parts.
export function wrappableParts(text, longest = 20) {
  const parts = [''];
  for (const word of text.split(/(\s+)/)) {
    if (word.length <= longest) {
      parts[parts.length - 1] += word;
      continue;
    }
    const pieces = word.match(/[^/._=&?#-]*[/._=&?#-]*/g).filter(Boolean)
      .flatMap((piece) => piece.match(new RegExp(`.{1,${longest}}`, 'gs')));
    parts[parts.length - 1] += pieces[0];
    parts.push(...pieces.slice(1));
  }
  return parts;
}

// Browsing groups each document under one topic so the page reads as sections,
// not one long grid. Checked topics (in Topic Filter order) take precedence,
// otherwise every primary topic does; a document joins the first topic it has,
// and documents with none go to `other`. Empty groups are left out.
export function topicGroups(documents, categories, primary = [], other = 'other') {
  const checked = primary.filter((topic) => categories.includes(topic));
  const order = checked.length ? checked : primary;
  const groups = new Map([...order, other].map((key) => [key, []]));
  for (const document of documents) {
    const key = order.find((topic) => document.categories.includes(topic)) || other;
    groups.get(key).push(document);
  }
  return [...groups].filter(([, members]) => members.length)
    .map(([key, members]) => ({ key, documents: members }));
}

export function categoryCounts(documents) {
  const counts = new Map();
  documents.forEach((document) => document.categories.forEach((category) =>
    counts.set(category, (counts.get(category) || 0) + 1)));
  return counts;
}

// Lesson titles name their unit: "1.01 Variables", "Unit 2 Quiz" or
// "MCQ1 - Unit 1 Quiz". A year such as "2016 FRQ 3" is not a unit, so a bare
// number needs the ".01" part.
export function unitOf(title) {
  const match = title.match(/^(\d+)\.\d+\s/) || title.match(/\bunit\s+(\d+)\b/i);
  return match ? Number(match[1]) : null;
}

// Quizzes and FRQ practice sit apart from the lessons that teach.
export function isPractice(title) {
  return /\b(quiz|frq|mcq\d*)\b|practice/i.test(title);
}

// Units in number order, then lessons without a unit. Each unit lists its
// lessons (titles sort naturally, so 1.02 comes before 1.10) and its practice.
export function unitGroups(documents) {
  const groups = new Map();
  for (const document of documents) {
    const unit = unitOf(document.title);
    if (!groups.has(unit)) groups.set(unit, []);
    groups.get(unit).push(document);
  }
  const byTitle = (a, b) => a.title.localeCompare(b.title, undefined, { numeric: true });
  return [...groups].sort(([a], [b]) => (a ?? Infinity) - (b ?? Infinity))
    .map(([unit, members]) => {
      const sorted = members.sort(byTitle);
      return {
        unit,
        documents: sorted,
        lessons: sorted.filter((document) => !isPractice(document.title)),
        practice: sorted.filter((document) => isPractice(document.title)),
      };
    });
}
