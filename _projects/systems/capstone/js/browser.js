import { matchesProject, normalizeSearch } from './model.js';

const browser = document.querySelector('[data-capstone-browser]');
if (browser) {
  const cards = [...browser.querySelectorAll('[data-capstone-card]')];
  const searchInput = browser.querySelector('[data-capstone-search]');
  const yearSelect = browser.querySelector('[data-capstone-year]');
  const status = browser.querySelector('[data-capstone-status]');
  const courseButtons = [...browser.querySelectorAll('button[data-course]')];
  const total = cards.length;
  const searchText = new Map(cards.map((card) => [
    card,
    [...card.querySelectorAll('h3, p')].map((element) => element.textContent).join(' '),
  ]));
  let course = new URLSearchParams(window.location.search).get('course')?.toUpperCase() || 'all';
  let query = '';
  let year = course === 'CSSE' ? '' : (yearSelect?.value || '');
  if (!courseButtons.some((button) => button.dataset.course.toUpperCase() === course)) course = 'all';
  if (course === 'CSSE' && yearSelect) yearSelect.value = '';

  function clearHighlights(card) {
    card.querySelectorAll('mark[data-capstone-search-mark]').forEach((mark) => {
      const parent = mark.parentNode;
      mark.replaceWith(mark.textContent);
      parent.normalize();
    });
  }

  function highlightMatches(card, words) {
    if (!words.length) return;
    const walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) {
      if (!walker.currentNode.parentElement.closest('details')) nodes.push(walker.currentNode);
    }
    nodes.forEach((node) => {
      const text = node.data;
      let folded = '';
      const sourceRanges = [];
      for (let index = 0; index < text.length;) {
        const character = String.fromCodePoint(text.codePointAt(index));
        const end = index + character.length;
        const part = normalizeSearch(character);
        folded += part;
        for (let offset = 0; offset < part.length; offset += 1) sourceRanges.push([index, end]);
        index = end;
      }
      const ranges = [];
      words.forEach((word) => {
        for (let position = folded.indexOf(word); position !== -1; position = folded.indexOf(word, position + 1)) {
          ranges.push([sourceRanges[position][0], sourceRanges[position + word.length - 1][1]]);
        }
      });
      if (!ranges.length) return;
      ranges.sort((first, second) => first[0] - second[0]);
      const merged = [];
      ranges.forEach(([start, end]) => {
        const previous = merged.at(-1);
        if (previous && start <= previous[1]) previous[1] = Math.max(previous[1], end);
        else merged.push([start, end]);
      });
      const fragment = document.createDocumentFragment();
      let cursor = 0;
      merged.forEach(([start, end]) => {
        if (start > cursor) fragment.append(document.createTextNode(text.slice(cursor, start)));
        const mark = document.createElement('mark');
        mark.dataset.capstoneSearchMark = '';
        mark.textContent = text.slice(start, end);
        fragment.append(mark);
        cursor = end;
      });
      if (cursor < text.length) fragment.append(document.createTextNode(text.slice(cursor)));
      node.replaceWith(fragment);
    });
  }

  function applyFilters() {
    let visible = 0;
    const words = normalizeSearch(query).split(/\s+/).filter(Boolean);
    cards.forEach((card) => {
      const cardCourse = card.dataset.course || ['CSA', 'CSP', 'CSH', 'CSSE'].find((name) => card.classList.contains(name)) || '';
      const match = matchesProject({
        course: cardCourse,
        year: card.dataset.year,
        text: searchText.get(card),
      }, { course, year, query });
      card.hidden = !match;
      clearHighlights(card);
      if (match) highlightMatches(card, words);
      if (match) visible += 1;
    });
    const filters = [course !== 'all' ? course : '', year].filter(Boolean).join(', ');
    const queryText = query.trim().replace(/\s+/g, ' ');
    if (!queryText && !filters) status.textContent = `Showing ${total} projects.`;
    else if (!queryText) status.textContent = `Showing ${visible} of ${total} projects${filters ? ` (${filters})` : ''}.`;
    else status.textContent = visible
      ? `${visible} ${visible === 1 ? 'project matches' : 'projects match'} "${queryText}"${filters ? ` (${filters})` : ''}.`
      : `No projects match "${queryText}"${filters ? ` (${filters})` : ''}.`;
  }

  function selectCourse(nextCourse) {
    course = nextCourse;
    if (course === 'CSSE' && yearSelect) {
      yearSelect.value = '';
      year = '';
    }
    courseButtons.forEach((button) => {
      const active = button.dataset.course.toUpperCase() === course.toUpperCase();
      button.classList.toggle('fill', active);
      button.classList.toggle('alert-green', active);
      button.setAttribute('aria-pressed', String(active));
    });
    applyFilters();
  }

  courseButtons.forEach((button) => button.addEventListener('click', () => {
    if (button.dataset.course === 'all' && yearSelect) {
      yearSelect.value = '';
      year = '';
    }
    selectCourse(button.dataset.course);
  }));
  yearSelect?.addEventListener('change', () => {
    year = yearSelect.value;
    applyFilters();
  });
  searchInput?.addEventListener('input', () => {
    query = searchInput.value;
    applyFilters();
  });
  selectCourse(course);
  window.addEventListener('pageshow', () => {
    query = searchInput?.value || '';
    year = yearSelect?.value || '';
    applyFilters();
  });
}
