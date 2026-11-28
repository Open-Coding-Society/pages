import { matchesProject, normalizeSearch } from './model.js';
import { SNAPSHOT_KEY, matchingFilters, readFilters, viewerUrl, writeFilters } from './viewer-model.js';

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
  const initial = readFilters(window.location.search);
  let course = initial.course === 'all' ? 'all' : initial.course.toUpperCase();
  let query = initial.query;
  let year = initial.year === null ? (course === 'CSSE' ? '' : (yearSelect?.value || '')) : initial.year;
  if (!courseButtons.some((button) => button.dataset.course.toUpperCase() === course)) course = 'all';
  if (searchInput) searchInput.value = query;
  if (yearSelect) {
    yearSelect.value = year;
    year = yearSelect.value;
  }

  function filters() {
    return { course, year, query };
  }

  function updateProjectLinks() {
    cards.forEach((card) => {
      const page = new URL(card.dataset.pageUrl, window.location.href);
      if (page.origin !== window.location.origin) return;
      const path = page.pathname.replace(/\/+$/, '');
      card.querySelectorAll('a[href]').forEach((link) => {
        const url = new URL(link.href, window.location.href);
        if (url.origin !== page.origin || url.pathname.replace(/\/+$/, '') !== path) return;
        const target = viewerUrl(url.href, { ...filters(), project: path }, new URL(window.location.href));
        if (target) {
          link.href = target.href;
          link.dataset.capstoneProjectLink = '';
        }
      });
    });
  }

  function saveSnapshot() {
    // A skipped project cannot be opened, so the viewer's previous/next leaves it out.
    const projects = cards.filter((card) => !card.hidden && !card.hasAttribute('data-capstone-skipped')).map((card) => {
      const url = new URL(card.dataset.pageUrl, window.location.href);
      return {
        path: url.pathname.replace(/\/+$/, ''),
        url: url.href,
        title: card.querySelector('h3')?.textContent.trim() || 'Project',
      };
    });
    try {
      window.sessionStorage.setItem(SNAPSHOT_KEY, JSON.stringify({
        ...filters(), projects, scrollY: window.scrollY,
      }));
    } catch (error) {
      console.warn('Could not save Capstone navigation state:', error);
    }
  }

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
      if (!walker.currentNode.parentElement.closest('details, [data-capstone-card-footer]')) nodes.push(walker.currentNode);
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
      const match = !card.hasAttribute('data-capstone-filtered-out') && matchesProject({
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
    const url = writeFilters(new URL(window.location.href), { course, year, query });
    window.history.replaceState(window.history.state, '', url);
    updateProjectLinks();
  }

  function selectCourse(nextCourse, resetYear = true) {
    course = nextCourse;
    if (resetYear && course === 'CSSE' && yearSelect) {
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
  browser.addEventListener('click', (event) => {
    if (event.target.closest('a[data-capstone-project-link]')) saveSnapshot();
  });
  browser.addEventListener('auxclick', (event) => {
    if (event.target.closest('a[data-capstone-project-link]')) saveSnapshot();
  });
  browser.addEventListener('contextmenu', (event) => {
    if (event.target.closest('a[data-capstone-project-link]')) saveSnapshot();
  });
  browser.addEventListener('capstone:filter', applyFilters);
  selectCourse(course, false);
  window.addEventListener('pageshow', () => {
    query = searchInput?.value || '';
    year = yearSelect?.value || '';
    applyFilters();
    const url = new URL(window.location.href);
    if (url.searchParams.has('capstone_return')) {
      url.searchParams.delete('capstone_return');
      window.history.replaceState(window.history.state, '', url);
      try {
        const snapshot = JSON.parse(window.sessionStorage.getItem(SNAPSHOT_KEY));
        if (matchingFilters(snapshot, filters()) && Number.isFinite(snapshot.scrollY)) {
          window.requestAnimationFrame(() => window.scrollTo(0, snapshot.scrollY));
        }
      } catch (error) {
        console.warn('Could not restore Capstone navigation state:', error);
      }
    }
  });
}
