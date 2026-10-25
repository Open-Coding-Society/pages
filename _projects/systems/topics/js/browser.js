import { selectedDocuments, readState, writeState, groupedMatches, highlightedParts, resultDetails, wrappableParts, topicGroups, categoryCounts } from './model.js';

const root = document.querySelector('[data-topics-browser]');
if (root) {
  const query = root.querySelector('#topics-query');
  const view = root.querySelector('#topics-view');
  const filters = [...root.querySelectorAll('input[type="checkbox"]')];
  // Topic Filter values; every other checked box belongs to the Categories Filter.
  const primary = [...root.querySelectorAll('[data-topics-primary] input[type="checkbox"]')].map((filter) => filter.value);
  const matchButtons = [...root.querySelectorAll('[data-topics-match] button')];
  const status = root.querySelector('[data-topics-status]');
  const cards = [...root.querySelectorAll('[data-topic-url]')];
  const flat = root.querySelector('[data-topics-flat]');
  const flatGrid = flat.querySelector('.topics-browser__results');
  const groupList = root.querySelector('[data-topics-groups]');
  const labels = new Map(filters.map((filter) => [filter.value, filter.closest('label').dataset.topicsLabel]));
  const OTHER = 'other-references';
  const collapsed = new Set();
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
  // A shared ?match=and link shows AND while the index loads (the buttons stay disabled).
  showMatch();

  function wrappable(text) {
    const fragment = document.createDocumentFragment();
    wrappableParts(text).forEach((part, index) => {
      if (index) fragment.append(document.createElement('wbr'));
      fragment.append(part);
    });
    return fragment;
  }

  // Excerpts are document text, so long URLs get <wbr> break points.
  function highlight(element, text, positions, excerpt = false) {
    const content = (value) => (excerpt ? wrappable(value) : document.createTextNode(value));
    element.replaceChildren(...highlightedParts(text, positions, excerpt).map((part) => {
      if (!part.highlighted) return content(part.text);
      const mark = document.createElement('mark');
      mark.append(content(part.text));
      return mark;
    }));
  }

  function contextLink(document) {
    const original = cardByUrl.get(document.url).querySelector('h2 a');
    const url = new URL(original.href);
    if (root.dataset.courseContext !== 'true') url.search = writeState(state);
    return url.href;
  }

  // The current choice is the filled button with aria-pressed="true".
  function showMatch() {
    matchButtons.forEach((button) => {
      const pressed = button.value === state.match;
      button.setAttribute('aria-pressed', String(pressed));
      button.classList.toggle('fill', pressed);
    });
  }

  // One collapsible section per topic; collapsing survives re-renders.
  function topicSection({ key, documents: members }) {
    const section = document.createElement('details');
    section.className = 'topics-browser__category-disclosure';
    section.open = !collapsed.has(key);
    section.addEventListener('toggle', () => {
      if (section.open) collapsed.delete(key); else collapsed.add(key);
    });
    const summary = document.createElement('summary');
    const heading = document.createElement('h3');
    const count = document.createElement('span');
    count.className = 'topics-browser__count';
    count.textContent = `(${members.length})`;
    heading.append(`${labels.get(key) || 'Other references'} `, count);
    summary.append(heading);
    const grid = document.createElement('div');
    grid.className = 'topics-browser__results';
    members.forEach((member) => grid.append(cardByUrl.get(member.url)));
    section.append(summary, grid);
    return section;
  }

  function showFilterCounts() {
    const counts = categoryCounts(documents);
    filters.forEach((filter) => {
      filter.closest('label').append(` (${counts.get(filter.value) || 0})`);
    });
  }

  function render() {
    query.value = state.query;
    view.value = state.view;
    filters.forEach((filter) => { filter.checked = state.categories.includes(filter.value); });
    showMatch();
    const rule = { primary, match: state.match };
    const searching = Boolean(state.query.trim());
    const matches = searching && index ? index.query((search) => {
      const tokens = window.lunr.tokenizer(state.query);
      search.term(tokens, { boost: 10 });
      search.term(tokens, { wildcard: window.lunr.Query.wildcard.TRAILING });
    }) : [];
    const groups = groupedMatches(documents, state.categories, matches, rule);
    const selected = searching ? groups.title.map((match) => match.document) :
      selectedDocuments(documents, state.categories, null, rule);
    const visible = new Set(selected.map((document) => document.url));
    cards.forEach((card) => { card.hidden = !visible.has(card.dataset.topicUrl); });
    const titlePositions = new Map(groups.title.map((match) => [match.document.url, match.positions]));
    documents.forEach((document) => {
      const link = cardByUrl.get(document.url).querySelector('h2 a');
      highlight(link, document.title, titlePositions.get(document.url) || []);
      link.href = contextLink(document);
    });
    // Park every card in the flat grid first so rebuilt groups never drop one.
    flatGrid.append(...cards);
    flat.hidden = !searching;
    if (searching) {
      selected.forEach((document) => flatGrid.append(cardByUrl.get(document.url)));
      groupList.replaceChildren();
    } else {
      groupList.replaceChildren(...topicGroups(selected, state.categories, primary, OTHER).map(topicSection));
    }
    root.classList.toggle('topics-browser--list', !searching && state.view === 'list');
    titleHeading.hidden = !searching || !groups.title.length;
    bodySection.hidden = !searching || !groups.body.length;
    root.querySelector('[data-topics-title-count]').textContent = `(${groups.title.length})`;
    root.querySelector('[data-topics-body-count]').textContent = `(${groups.body.length})`;
    searchClear.disabled = !state.query;
    filterClear.disabled = !state.categories.length;
    bodyResults.replaceChildren();
    for (const match of groups.body) {
      const details = resultDetails(match.document, primary);
      const link = document.createElement('a');
      link.className = 'ocs__nav-card';
      link.href = contextLink(match.document);
      const file = document.createElement('span');
      file.className = 'ocs__nav-card-kicker';
      file.append(wrappable(details.file));
      file.title = details.path;
      const title = document.createElement('span');
      title.className = 'ocs__nav-card-title';
      title.append(wrappable(match.document.title));
      const excerpt = document.createElement('span');
      excerpt.className = 'ocs__text';
      highlight(excerpt, match.document[match.field], match.positions, true);
      // ocs__status, not ocs__status-pill: pills never wrap, and a long
      // category like Algorithms-with-Selection-and-Repetition outgrows a phone.
      const subjects = document.createElement('span');
      const labels = [
        ...details.subjects,
        ...(root.dataset.courseContext === 'true' ? match.document.weeks || [] : []),
      ];
      labels.forEach((label) => {
        const chip = document.createElement('span');
        chip.className = 'ocs__status';
        chip.textContent = label;
        subjects.append(chip, ' ');
      });
      link.append(file, title, excerpt, subjects);
      bodyResults.append(link);
    }
    const count = selected.length + (searching ? groups.body.length : 0);
    status.textContent = count ? `${count} documents` :
      'No documents match these categories and search.';
  }

  function update() {
    state = {
      categories: filters.filter((filter) => filter.checked).map((filter) => filter.value),
      match: state.match,
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
      showFilterCounts();
      render();
      query.addEventListener('input', update);
      filters.forEach((filter) => filter.addEventListener('change', update));
      matchButtons.forEach((button) => {
        button.disabled = false;
        button.addEventListener('click', () => {
          state.match = button.value;
          update();
        });
      });
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
