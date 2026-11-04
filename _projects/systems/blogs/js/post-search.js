// A search bar for a blogs catalog. A page turns it on with post_search: true,
// the way post_filter narrows the catalog, and a host such as a course's Blogs
// page passes search=true; _includes/blog-catalog.html draws the bar and calls
// createPostSearch. Typing hides the cards whose title and description don't
// contain every word typed, highlights the words where they appear in the
// cards that stay, and keeps the catalog's order. The query stays in the
// address as ?q=, the parameter Topics uses, so a search can be reloaded or
// shared.
// Test: node --test tests/post_search.test.mjs

// Lowercase and without accents, so "pokemon" finds "Pokémon".
function normalize(text) {
  return String(text ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

// A card matches when each word of the query is somewhere in its text.
export function matchesQuery(text, query) {
  const haystack = normalize(text);
  return normalize(query).split(/\s+/).filter(Boolean).every(word => haystack.includes(word));
}

// The [start, end) spans of text where a word of the query appears, in order
// and merged where they touch. They are found in the same lowercase, accent-free
// form matchesQuery uses, then mapped back to the original letters.
export function matchRanges(text, query) {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  let folded = '';
  const origin = []; // origin[i] is the [start, end) of text that folded[i] came from
  let index = 0;
  for (const char of String(text ?? '')) {
    const piece = normalize(char);
    if (piece) {
      for (let k = 0; k < piece.length; k++) origin.push([index, index + char.length]);
    } else if (origin.length) {
      origin[origin.length - 1][1] = index + char.length; // a separate accent stays with its letter
    }
    folded += piece;
    index += char.length;
  }
  const spans = [];
  for (const word of words) {
    for (let at = folded.indexOf(word); at !== -1; at = folded.indexOf(word, at + 1)) {
      spans.push([origin[at][0], origin[at + word.length - 1][1]]);
    }
  }
  spans.sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const [start, end] of spans) {
    const last = merged[merged.length - 1];
    if (last && start <= last[1]) last[1] = Math.max(last[1], end);
    else merged.push([start, end]);
  }
  return merged;
}

// Splits [start, end) spans over a run of text nodes into each node's own
// spans; lengths are the nodes' text lengths in order. A description such as
// Java<strong>Script</strong> holds one word in two nodes.
export function rangesByNode(lengths, ranges) {
  let offset = 0;
  return lengths.map(length => {
    const start = offset;
    offset += length;
    return ranges
      .map(([from, to]) => [Math.max(from, start) - start, Math.min(to, offset) - start])
      .filter(([from, to]) => to > from);
  });
}

// Wraps the parts of the element's text that match the query in <mark>,
// matching over its whole text so markup inside it can't hide a word. The
// marks are built from text nodes, so a title or description is never read as
// HTML. Returns whether anything was marked.
function markMatches(element, query) {
  const doc = element.ownerDocument;
  const walker = doc.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const texts = [];
  while (walker.nextNode()) texts.push(walker.currentNode);
  const ranges = matchRanges(texts.map(node => node.data).join(''), query);
  if (!ranges.length) return false;
  rangesByNode(texts.map(node => node.data.length), ranges).forEach((spans, i) => {
    if (!spans.length) return;
    const node = texts[i];
    const parts = [];
    let cursor = 0;
    for (const [start, end] of spans) {
      if (start > cursor) parts.push(doc.createTextNode(node.data.slice(cursor, start)));
      const mark = doc.createElement('mark');
      mark.textContent = node.data.slice(start, end);
      parts.push(mark);
      cursor = end;
    }
    if (cursor < node.data.length) parts.push(doc.createTextNode(node.data.slice(cursor)));
    node.replaceWith(...parts);
  });
  return true;
}

export function readQuery(search) {
  return new URLSearchParams(search).get('q') || '';
}

// Keeps the page's other parameters; a blank query removes q.
export function writeQuery(search, query) {
  const params = new URLSearchParams(search);
  if (query.trim()) params.set('q', query);
  else params.delete('q');
  const text = params.toString();
  return text ? `?${text}` : '';
}

// "3 documents", "1 of 3 documents", or why nothing is showing.
export function statusText(shown, total, query) {
  const documents = count => `${count} ${count === 1 ? 'document' : 'documents'}`;
  if (!query.trim()) return documents(total);
  if (!shown) return `No documents match "${query.trim()}".`;
  return `${shown} of ${documents(total)}`;
}

// input: the search field; clear: the Clear Search button; status: the line
// under the bar that counts the results; cards: the catalog's <li>s, each with
// its title and description in data-post-search-text, and its title link and
// description marked data-post-search-field for the highlights. The field and
// button arrive disabled, so they only work once this has run.
export function createPostSearch({ input, clear, status, cards }, environment = window) {
  // Each highlighted field keeps a copy of its original content to put back.
  const fields = new Map(cards.map(card => [card, [...card.querySelectorAll('[data-post-search-field]')]
    .map(element => ({ element, original: [...element.childNodes].map(node => node.cloneNode(true)) }))]));
  let marked = [];

  function render() {
    const query = input.value;
    let shown = 0;
    marked.forEach(({ element, original }) => element.replaceChildren(...original.map(node => node.cloneNode(true))));
    marked = [];
    cards.forEach(card => {
      card.hidden = !matchesQuery(card.dataset.postSearchText, query);
      if (card.hidden) return;
      shown += 1;
      if (query.trim()) fields.get(card).forEach(field => { if (markMatches(field.element, query)) marked.push(field); });
    });
    clear.disabled = !query;
    status.textContent = statusText(shown, cards.length, query);
  }

  function update() {
    const { pathname, search, hash } = environment.location;
    environment.history.replaceState(null, '', `${pathname}${writeQuery(search, input.value)}${hash}`);
    render();
  }

  input.value = readQuery(environment.location.search);
  input.disabled = false;
  render();
  input.addEventListener('input', update);
  clear.addEventListener('click', () => {
    input.value = '';
    update();
    input.focus();
  });
}
