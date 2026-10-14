import { selectedDocuments, readState, writeState, groupedMatches, highlightedParts } from './model.js';

const root = document.querySelector('[data-topics-browser]');
if (root) {
  const query = root.querySelector('#topics-query');
  const view = root.querySelector('#topics-view');
  const filters = [...root.querySelectorAll('input[type="checkbox"]')];
  const status = root.querySelector('[data-topics-status]');
  const cards = [...root.querySelectorAll('[data-topic-url]')];
  const results = root.querySelector('[data-topics-results]');
  const titleHeading = root.querySelector('[data-topics-title-heading]');
  const bodySection = root.querySelector('[data-topics-body-section]');
  const bodyResults = root.querySelector('[data-topics-body-results]');
  const searchClear = root.querySelector('[data-topics-search-clear]');
  const filterClear = root.querySelector('[data-topics-clear]');
  const cardByUrl = new Map(cards.map((card) => [card.dataset.topicUrl, card]));
  let state = readState(location.search);
  if (!state.categories.length && root.dataset.initialCategory) {
    state.categories = [root.dataset.initialCategory];
  }
  let documents = [];
  let index;

  function highlight(element, text, positions, excerpt = false) {
    element.replaceChildren(...highlightedParts(text, positions, excerpt).map((part) => {
      if (!part.highlighted) return document.createTextNode(part.text);
      const mark = document.createElement('mark');
      mark.textContent = part.text;
      return mark;
    }));
  }

  function contextLink(document) {
    const original = cardByUrl.get(document.url).querySelector('h2 a');
    const url = new URL(original.href);
    if (root.dataset.courseContext !== 'true') url.search = writeState(state);
    return url.href;
  }

  function render() {
    query.value = state.query;
    view.value = state.view;
    filters.forEach((filter) => { filter.checked = state.categories.includes(filter.value); });
    const searching = Boolean(state.query.trim());
    const matches = searching && index ? index.query((search) => {
      const tokens = window.lunr.tokenizer(state.query);
      search.term(tokens, { boost: 10 });
      search.term(tokens, { wildcard: window.lunr.Query.wildcard.TRAILING });
    }) : [];
    const groups = groupedMatches(documents, state.categories, matches);
    const selected = searching ? groups.title.map((match) => match.document) :
      selectedDocuments(documents, state.categories);
    const visible = new Set(selected.map((document) => document.url));
    cards.forEach((card) => { card.hidden = !visible.has(card.dataset.topicUrl); });
    const titlePositions = new Map(groups.title.map((match) => [match.document.url, match.positions]));
    documents.forEach((document) => {
      const link = cardByUrl.get(document.url).querySelector('h2 a');
      highlight(link, document.title, titlePositions.get(document.url) || []);
      link.href = contextLink(document);
    });
    selected.forEach((document) => results.append(cardByUrl.get(document.url)));
    root.classList.toggle('topics-browser--list', !searching && state.view === 'list');
    titleHeading.hidden = !searching || !groups.title.length;
    bodySection.hidden = !searching || !groups.body.length;
    root.querySelector('[data-topics-title-count]').textContent = `(${groups.title.length})`;
    root.querySelector('[data-topics-body-count]').textContent = `(${groups.body.length})`;
    searchClear.disabled = !state.query;
    filterClear.disabled = !state.categories.length;
    bodyResults.replaceChildren();
    for (const match of groups.body) {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = contextLink(match.document);
      const excerpt = document.createElement('p');
      highlight(excerpt, match.document[match.field], match.positions, true);
      const title = document.createElement('p');
      title.className = 'topics-browser__text-title';
      title.textContent = match.document.title;
      link.append(excerpt, title);
      item.append(link);
      bodyResults.append(item);
    }
    const count = selected.length + (searching ? groups.body.length : 0);
    status.textContent = count ? `${count} documents` :
      'No documents match these categories and search.';
  }

  function update() {
    state = {
      categories: filters.filter((filter) => filter.checked).map((filter) => filter.value),
      query: query.value,
      view: view.value,
    };
    const search = writeState(state);
    history.replaceState(null, '', `${location.pathname}${search ? `?${search}` : ''}`);
    render();
  }

  async function initialize() {
    try {
      const response = await fetch(root.dataset.indexUrl);
      if (!response.ok) throw new Error(`Topics index HTTP ${response.status}`);
      documents = await response.json();
      if (!window.lunr) throw new Error('Lunr is unavailable');
      index = window.lunr(function () {
        this.ref('url');
        this.field('title', { boost: 10 });
        this.field('description', { boost: 3 });
        this.field('content');
        this.metadataWhitelist = ['position'];
        documents.forEach((document) => this.add(document));
      });
      query.disabled = false;
      render();
      query.addEventListener('input', update);
      filters.forEach((filter) => filter.addEventListener('change', update));
      view.addEventListener('change', update);
      filterClear.addEventListener('click', () => {
        filters.forEach((filter) => { filter.checked = false; });
        update();
      });
      searchClear.addEventListener('click', () => {
        query.value = '';
        update();
        query.focus();
      });
      window.addEventListener('popstate', () => { state = readState(location.search); render(); });
    } catch (error) {
      console.error('Topics search could not initialize', error);
      status.textContent = 'Topics search is unavailable. Reload to retry; document links remain available.';
    }
  }
  initialize();
}
