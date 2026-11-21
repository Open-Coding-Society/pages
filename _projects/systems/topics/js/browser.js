import { selectedDocuments, readState, writeState, groupedMatches, highlightedParts, resultDetails, wrappableParts, topicGroups, categoryCounts, categoriesByCount, showMoreCategory, resultHeading, createSearchIndex, unitGroups } from './model.js';
import { SNAPSHOT_KEY, readSnapshot, orderedDocuments } from './viewer-model.js';

const root = document.querySelector('[data-topics-browser]');
if (root) {
  const query = root.querySelector('#topics-query');
  const view = root.querySelector('#topics-view');
  const filters = [...root.querySelectorAll('input[type="checkbox"]')];
  // Primary topics determine presentation order, not how selections combine.
  const primary = [...root.querySelectorAll('[data-topics-primary] input[type="checkbox"]')].map((filter) => filter.value);
  const secondaryFilters = [...root.querySelectorAll('[data-topics-secondary] input[type="checkbox"]')];
  const matchButtons = [...root.querySelectorAll('[data-topics-match] button[aria-pressed]')];
  const status = root.querySelector('[data-topics-status]');
  const heading = root.querySelector('[data-topics-heading]');
  const cards = [...root.querySelectorAll('[data-topic-url]')];
  const flat = root.querySelector('[data-topics-flat]');
  const flatGrid = flat.querySelector('.topics-browser__results');
  const groupList = root.querySelector('[data-topics-groups]');
  const titleHeading = root.querySelector('[data-topics-title-heading]');
  const bodySection = root.querySelector('[data-topics-body-section]');
  const bodyResults = root.querySelector('[data-topics-body-results]');
  const searchClear = root.querySelector('[data-topics-search-clear]');
  const filterClear = root.querySelector('[data-topics-clear]');
  const cardByUrl = new Map(cards.map((card) => [card.dataset.topicUrl, card]));
  const labels = new Map(filters.map((filter) => [filter.value, filter.closest('label').dataset.topicsLabel]));
  const OTHER = 'other-references';
  // Optional names per topic and unit, from data/topics_units.yml.
  let unitNames;
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
    if (root.dataset.courseContext !== 'true') {
      url.search = writeState(state);
      url.searchParams.set('context', 'topics');
      url.searchParams.set('topics_view', '1');
    }
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

  function chosenCategory() {
    return state.categories.length === 1 ? state.categories[0] : '';
  }

  // One dropdown per lesson: the number and full title; opening it shows the
  // whole description and a link to the lesson.
  function lessonRow(document) {
    const item = element('details', 'topics-browser__category-disclosure');
    item.dataset.topicsLesson = document.url;
    const number = document.title.match(/^\d+\.\d+/)?.[0];
    const summary = element('summary');
    summary.append(element('span', 'ocs__check', number || '›'), ' ',
      element('strong', '', number ? document.title.slice(number.length).trim() : document.title));
    const body = element('div', 'ocs__tree ocs__tree-item');
    const description = (document.description || '').trim();
    body.append(element('p', 'ocs__text', description || 'No description yet.'));
    const actions = element('p', 'ocs__links');
    const open = element('a', 'ocs__btn small accent fill', 'Open lesson →');
    open.dataset.topicsDocument = document.url;
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
    header.append(element('h3', '', `${unitTitle(topic, unit)} (${lessons.length + practice.length})`));
    card.append(header);
    if (lessons.length) {
      const list = element('div', `topics-browser__unit-lessons ${state.view === 'cards' ? 'topics-browser__results' : 'ocs__stack'}`);
      list.tabIndex = 0;
      list.setAttribute('aria-label', `${unitTitle(topic, unit)} lessons`);
      lessons.forEach((lesson) => list.append(state.view === 'cards' ? cardByUrl.get(lesson.url) : lessonRow(lesson)));
      card.append(list);
    }
    if (practice.length) {
      const row = element('p', 'ocs__links topics-browser__practice');
      row.append(element('strong', '', 'Practice'));
      practice.forEach((item) => {
        const link = element('a', 'ocs__btn small accent', item.title);
        link.dataset.topicsDocument = item.url;
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
    const labelsByCategory = new Map(secondaryFilters.map((filter) => [filter.value, filter.closest('label')]));
    const fieldset = root.querySelector('[data-topics-secondary] fieldset');
    categoriesByCount(secondaryFilters.map((filter) => filter.value), counts)
      .forEach((category) => fieldset.append(labelsByCategory.get(category)));
  }

  function render() {
    query.value = state.query;
    view.value = state.view;
    filters.forEach((filter) => { filter.checked = state.categories.includes(filter.value); });
    secondaryFilters.forEach((filter) => {
      filter.closest('label').hidden = !showMoreCategory(counts.get(filter.value) || 0, filter.checked);
    });
    showMatch();
    const rule = { match: state.match };
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
    // Park every card in the flat grid first so rebuilt sections never drop one.
    flatGrid.append(...cards);
    flat.hidden = !searching;
    if (searching) {
      selected.forEach((document) => flatGrid.append(cardByUrl.get(document.url)));
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
      link.dataset.topicsDocument = match.document.url;
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
    heading.textContent = resultHeading(state, labels, count);
    status.classList.toggle('topics-browser__accessible-label', count > 0);
    status.textContent = count ? `${count} ${searching ? 'results' : 'lessons'}` : 'No lessons match these filters and search.';
  }

  function saveViewerState() {
    const ordered = orderedDocuments(root.querySelectorAll('a[data-topics-document]'), documents);
    try {
      window.sessionStorage.setItem(SNAPSHOT_KEY, JSON.stringify({
        state: writeState(state), documents: ordered, scrollY: window.scrollY,
        unitScrolls: [...root.querySelectorAll('.topics-browser__unit-lessons')].map((list) => list.scrollTop),
        openLessons: [...root.querySelectorAll('details[data-topics-lesson][open]')].map((lesson) => lesson.dataset.topicsLesson),
      }));
    } catch (error) {
      console.warn('Could not save Topics navigation state:', error);
    }
  }

  function restoreViewerScroll() {
    const url = new URL(location.href);
    if (!url.searchParams.has('topics_return')) return;
    url.searchParams.delete('topics_return');
    history.replaceState(history.state, '', url);
    const snapshot = readSnapshot(url.search);
    if (snapshot && Number.isFinite(snapshot.scrollY)) {
      window.requestAnimationFrame(() => {
        if (Array.isArray(snapshot.openLessons)) {
          const open = new Set(snapshot.openLessons);
          root.querySelectorAll('details[data-topics-lesson]').forEach((lesson) => {
            lesson.open = open.has(lesson.dataset.topicsLesson);
          });
        }
        if (Array.isArray(snapshot.unitScrolls)) {
          root.querySelectorAll('.topics-browser__unit-lessons').forEach((list, index) => {
            if (Number.isFinite(snapshot.unitScrolls[index])) list.scrollTop = snapshot.unitScrolls[index];
          });
        }
        window.scrollTo(0, snapshot.scrollY);
      });
    }
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
      unitNames = JSON.parse(root.dataset.unitNames || '{}') || {};
      const response = await fetch(root.dataset.indexUrl);
      if (!response.ok) throw new Error(`Topics index HTTP ${response.status}`);
      documents = await response.json();
      if (!window.lunr) throw new Error('Lunr is unavailable');
      index = createSearchIndex(window.lunr, documents);
      counts = categoryCounts(documents);
      query.disabled = false;
      showFilterCounts();
      render();
      root.classList.remove('topics-browser--loading');
      if (root.dataset.courseContext !== 'true') {
        for (const type of ['click', 'auxclick', 'contextmenu']) {
          root.addEventListener(type, (event) => {
            if (event.target.closest('a[data-topics-document]')) saveViewerState();
          });
        }
        restoreViewerScroll();
      }
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
      flatGrid.append(...cards);
      cards.forEach((card) => { card.hidden = false; });
      flat.hidden = false;
      groupList.replaceChildren();
      titleHeading.hidden = true;
      bodySection.hidden = true;
      root.classList.remove('topics-browser--loading');
      query.disabled = true;
      view.disabled = true;
      filters.forEach((filter) => { filter.disabled = true; });
      matchButtons.forEach((button) => { button.disabled = true; });
      filterClear.disabled = true;
      searchClear.disabled = true;
      status.classList.remove('topics-browser__accessible-label');
      status.textContent = 'Topics search is unavailable. Reload to retry; document links remain available.';
    }
  }
  initialize();
}
