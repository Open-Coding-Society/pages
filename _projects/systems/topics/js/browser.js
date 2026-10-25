import { selectedDocuments, readState, writeState, groupedMatches, highlightedParts, resultDetails, wrappableParts, topicGroups, categoryCounts, unitGroups } from './model.js';

const root = document.querySelector('[data-topics-browser]');
if (root) {
  const query = root.querySelector('#topics-query');
  const view = root.querySelector('#topics-view');
  const filters = [...root.querySelectorAll('input[type="checkbox"]')];
  // Topic Filter values; every other checked box belongs to the Categories Filter.
  const primary = [...root.querySelectorAll('[data-topics-primary] input[type="checkbox"]')].map((filter) => filter.value);
  const secondary = filters.map((filter) => filter.value).filter((value) => !primary.includes(value));
  const matchButtons = [...root.querySelectorAll('[data-topics-match] button')];
  const status = root.querySelector('[data-topics-status]');
  const heading = root.querySelector('[data-topics-heading]');
  const cards = [...root.querySelectorAll('[data-topic-url]')];
  const flat = root.querySelector('[data-topics-flat]');
  const flatGrid = flat.querySelector('.topics-browser__results');
  const groupList = root.querySelector('[data-topics-groups]');
  const nav = root.querySelector('[data-topics-nav]');
  const more = root.querySelector('[data-topics-more]');
  const shortcuts = root.querySelector('[data-topics-shortcuts]');
  const overview = root.querySelector('[data-topics-overview]');
  const titleHeading = root.querySelector('[data-topics-title-heading]');
  const bodySection = root.querySelector('[data-topics-body-section]');
  const bodyResults = root.querySelector('[data-topics-body-results]');
  const searchClear = root.querySelector('[data-topics-search-clear]');
  const filterClear = root.querySelector('[data-topics-clear]');
  const cardByUrl = new Map(cards.map((card) => [card.dataset.topicUrl, card]));
  const labels = new Map(filters.map((filter) => [filter.value, filter.closest('label').dataset.topicsLabel]));
  const OTHER = 'other-references';
  // Optional names per topic and unit, from data/topics_units.yml.
  const unitNames = JSON.parse(root.dataset.unitNames || '{}') || {};
  // The sidebar offers this many of the remaining categories as shortcuts.
  const SHORTCUTS = 12;
  let state = readState(location.search);
  if (!state.categories.length && root.dataset.initialCategory) {
    state.categories = [root.dataset.initialCategory];
  }
  let documents = [];
  let counts = new Map();
  let index;
  // A shared ?match=and link shows AND while the index loads (the buttons stay disabled).
  showMatch();

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function wrappable(text) {
    const fragment = document.createDocumentFragment();
    wrappableParts(text).forEach((part, index) => {
      if (index) fragment.append(document.createElement('wbr'));
      fragment.append(part);
    });
    return fragment;
  }

  // Excerpts are document text, so long URLs get <wbr> break points.
  function highlight(target, text, positions, excerpt = false) {
    const content = (value) => (excerpt ? wrappable(value) : document.createTextNode(value));
    target.replaceChildren(...highlightedParts(text, positions, excerpt).map((part) => {
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

  // The sidebar, tiles and shortcuts all select exactly one category (or none for All).
  function choose(category) {
    filters.forEach((filter) => { filter.checked = filter.value === category; });
    if (query.value) query.value = '';
    update();
    root.scrollIntoView({ block: 'start' });
  }

  function chosenCategory() {
    return state.categories.length === 1 ? state.categories[0] : '';
  }

  // Topics with no published lessons stay in Advanced filters but get no link or tile.
  function liveTopics() {
    return primary.filter((topic) => counts.get(topic));
  }

  // A real link (shareable, opens in a new tab) that the page handles in place.
  function categoryLink(category, text) {
    const link = element('a');
    link.href = `?${writeState({ categories: category ? [category] : [], match: 'or', query: '', view: state.view })}`;
    link.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey) return;
      event.preventDefault();
      choose(category);
    });
    const active = !state.query.trim() && (category ? chosenCategory() === category : !state.categories.length);
    if (active) {
      link.setAttribute('aria-current', 'page');
      link.append(element('strong', '', text));
    } else {
      link.append(text);
    }
    return link;
  }

  function renderNav() {
    nav.replaceChildren(...['', ...liveTopics()].map((topic) => {
      const item = element('div', 'ocs__tree-item');
      item.append(categoryLink(topic, topic ? labels.get(topic) : 'All topics'), ' ',
        element('span', 'ocs__status', String(topic ? counts.get(topic) : documents.length)));
      return item;
    }));
    const extra = secondary.filter((category) => counts.get(category))
      .sort((a, b) => counts.get(b) - counts.get(a)).slice(0, SHORTCUTS);
    shortcuts.replaceChildren(...extra.map((category) => {
      const shortcut = element('button', `ocs__btn small accent${chosenCategory() === category ? ' fill' : ''}`,
        `${labels.get(category)} · ${counts.get(category)}`);
      shortcut.type = 'button';
      shortcut.addEventListener('click', () => choose(category));
      return shortcut;
    }));
    more.hidden = !extra.length;
  }

  function unitRange(members) {
    const units = unitGroups(members).map((group) => group.unit).filter((unit) => unit !== null);
    if (!units.length) return '';
    return units.length === 1 ? ` · Unit ${units[0]}` : ` · Units ${units[0]}–${units[units.length - 1]}`;
  }

  // Landing view: one tile per topic across the full width.
  function renderOverview() {
    overview.replaceChildren(...liveTopics().map((topic) => {
      const members = documents.filter((document) => document.categories.includes(topic));
      const tile = element('button', 'ocs__hub-card');
      tile.type = 'button';
      tile.append(element('strong', 'ocs__hub-card-title', labels.get(topic)),
        element('span', 'ocs__text', `${members.length} lessons${unitRange(members)}`));
      tile.addEventListener('click', () => choose(topic));
      return tile;
    }));
  }

  // One dropdown per lesson: the number and full title; opening it shows the
  // whole description and a link to the lesson.
  function lessonRow(document) {
    const item = element('details', 'topics-browser__category-disclosure');
    const number = document.title.match(/^\d+\.\d+/)?.[0];
    const summary = element('summary');
    summary.append(element('span', 'ocs__check', number || '›'), ' ',
      element('strong', '', number ? document.title.slice(number.length).trim() : document.title));
    const body = element('div', 'ocs__tree ocs__tree-item');
    const description = (document.description || '').trim();
    body.append(element('p', 'ocs__text', description || 'No description yet.'));
    const actions = element('p', 'ocs__links');
    const open = element('a', 'ocs__btn small accent fill', 'Open lesson →');
    open.href = contextLink(document);
    actions.append(open);
    body.append(actions);
    item.append(summary, body);
    return item;
  }

  function unitTitle(topic, unit) {
    if (unit === null) return 'More lessons';
    const name = unitNames[topic]?.[unit];
    return name ? `Unit ${unit}: ${name}` : `Unit ${unit}`;
  }

  // A card per unit: its lessons, then its quizzes and FRQ practice as buttons.
  // Units sit two across so a big topic fits on one screen.
  function unitCard(topic, { unit, lessons, practice }) {
    const card = element('section', 'ocs__grid-cell ocs__stack');
    const header = element('header');
    header.append(element('h3', '', unitTitle(topic, unit)),
      element('span', 'ocs__status', `${lessons.length} lessons`));
    card.append(header);
    if (lessons.length) {
      const list = element('div', state.view === 'cards' ? 'topics-browser__results' : 'ocs__stack');
      lessons.forEach((lesson) => list.append(state.view === 'cards' ? cardByUrl.get(lesson.url) : lessonRow(lesson)));
      card.append(list);
    }
    if (practice.length) {
      const row = element('p', 'ocs__links');
      row.append(element('strong', '', 'Practice'));
      practice.forEach((item) => {
        const link = element('a', 'ocs__btn small accent', item.title);
        link.href = contextLink(item);
        row.append(link);
      });
      card.append(row);
    }
    return card;
  }

  function topicSection({ key, documents: members }, titled) {
    const section = element('section', 'ocs__stack');
    if (titled) {
      const title = element('h2', '', `${labels.get(key) || 'Other references'} `);
      title.append(element('span', 'topics-browser__count', `(${members.length})`));
      section.append(title);
    }
    const units = element('div', 'ocs__grid ocs__grid--col2');
    units.append(...unitGroups(members).map((group) => unitCard(key, group)));
    section.append(units);
    return section;
  }

  function showFilterCounts() {
    filters.forEach((filter) => {
      filter.closest('label').append(` (${counts.get(filter.value) || 0})`);
    });
  }

  function headingText(searching) {
    if (searching) return `Results for “${state.query.trim()}”`;
    if (!state.categories.length) return 'All topics';
    return chosenCategory() ? labels.get(chosenCategory()) : 'Filtered lessons';
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
    renderNav();
    heading.textContent = headingText(searching);
    // Park every card in the flat grid first so rebuilt sections never drop one.
    flatGrid.append(...cards);
    const landing = !searching && !state.categories.length;
    flat.hidden = !searching;
    if (landing) renderOverview(); else overview.replaceChildren();
    if (searching) {
      selected.forEach((document) => flatGrid.append(cardByUrl.get(document.url)));
      groupList.replaceChildren();
    } else if (landing) {
      groupList.replaceChildren();
    } else {
      const topics = topicGroups(selected, state.categories, primary, OTHER);
      // A single chosen category is already the page heading.
      const titled = topics.length > 1 || !chosenCategory();
      groupList.replaceChildren(...topics.map((topic) => topicSection(topic, titled)));
    }
    titleHeading.hidden = !searching || !groups.title.length;
    bodySection.hidden = !searching || !groups.body.length;
    root.querySelector('[data-topics-title-count]').textContent = `(${groups.title.length})`;
    root.querySelector('[data-topics-body-count]').textContent = `(${groups.body.length})`;
    searchClear.disabled = !state.query;
    filterClear.disabled = !state.categories.length;
    bodyResults.replaceChildren();
    for (const match of groups.body) {
      const details = resultDetails(match.document, primary);
      const link = element('a', 'ocs__nav-card');
      link.href = contextLink(match.document);
      const file = element('span', 'ocs__nav-card-kicker');
      file.append(wrappable(details.file));
      file.title = details.path;
      const title = element('span', 'ocs__nav-card-title');
      title.append(wrappable(match.document.title));
      const excerpt = element('span', 'ocs__text');
      highlight(excerpt, match.document[match.field], match.positions, true);
      // ocs__status, not ocs__status-pill: pills never wrap, and a long
      // category like Algorithms-with-Selection-and-Repetition outgrows a phone.
      const subjects = document.createElement('span');
      const chips = [
        ...details.subjects,
        ...(root.dataset.courseContext === 'true' ? match.document.weeks || [] : []),
      ];
      chips.forEach((label) => subjects.append(element('span', 'ocs__status', label), ' '));
      link.append(file, title, excerpt, subjects);
      bodyResults.append(link);
    }
    const count = selected.length + (searching ? groups.body.length : 0);
    if (landing) status.textContent = `${documents.length} lessons in ${liveTopics().length} topics. Pick one to see its lessons by unit.`;
    else status.textContent = count ? `${count} lessons` : 'No lessons match these filters and search.';
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
      counts = categoryCounts(documents);
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
