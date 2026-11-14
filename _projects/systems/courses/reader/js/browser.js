import { readerContext, readerLink, courseWeeks } from './model.js';

export async function startDocumentReader(root, tools) {
  if (!root) return;
  const { readState, writeState, selectedDocuments, createNavigationState, rememberCourse } = tools;
  const membership = JSON.parse(root.dataset.membership);
  const base = root.dataset.baseurl;
  const identity = root.dataset.documentUrl;
  const sidebar = root.querySelector('[data-reader-navigation]');
  const tree = root.querySelector('[data-reader-tree]');
  const selector = root.querySelector('[data-reader-context]');
  const query = root.querySelector('[data-reader-query]');
  const category = root.querySelector('[data-reader-category]');
  const status = root.querySelector('[data-reader-status]');
  const complete = root.querySelector('[data-reader-complete]');
  const pager = root.querySelector('[data-reader-pager]');
  const panel = matchMedia('(max-width: 768px)').matches ? 'mobile' : 'desktop';
  if (panel === 'mobile') sidebar.open = false;
  let context = readerContext(location.search, membership, root.dataset.defaultCourse);
  let topics = readState(location.search);
  let navigation;
  let payload;
  const originalLinks = new WeakMap();

  function node(tag, text, className) {
    const element = document.createElement(tag);
    if (text !== undefined) element.textContent = text;
    if (className) element.className = className;
    return element;
  }

  function completionData() {
    if (!context.course) return {};
    try {
      const saved = JSON.parse(localStorage.getItem(`${context.course}-lesson-completion`) || '{}');
      if (!saved || typeof saved !== 'object' || Array.isArray(saved)) throw new Error('Invalid completion data');
      return saved;
    } catch (error) {
      console.error('Cannot read lesson completion', error);
      status.textContent = 'Saved completion is unavailable. Existing records have not been replaced.';
      return null;
    }
  }

  function updateCompletion() {
    const data = completionData();
    complete.hidden = !context.course;
    complete.disabled = data === null;
    const done = data?.[identity] === true;
    complete.textContent = done ? 'Mark lesson incomplete' : 'Mark lesson complete';
    complete.setAttribute('aria-pressed', String(done));
    complete.classList.toggle('fill', done);
    tree.querySelectorAll('[data-lesson-id]').forEach(link => {
      const completed = data?.[link.dataset.lessonId] === true;
      link.querySelector('[data-lesson-completed]').hidden = !completed;
      link.setAttribute('aria-label', `${link.title}${completed ? ' (completed)' : ''}`);
    });
    tree.querySelectorAll('[data-week-group]').forEach(group => {
      const lessons = [...group.querySelectorAll('[data-lesson-id]')];
      const count = group.querySelector('[data-week-count]');
      const completed = lessons.filter(link => data?.[link.dataset.lessonId] === true).length;
      count.textContent = `${data === null ? '?' : completed}/${lessons.length}`;
      count.setAttribute('aria-label', data === null
        ? `Completion unavailable for ${lessons.length} lessons`
        : `${completed} of ${lessons.length} lessons completed`);
    });
  }

  function icon(className) {
    const element = node('i', undefined, `fas ${className}`);
    element.setAttribute('aria-hidden', 'true');
    return element;
  }

  function lessonLink(document) {
    const link = node('a', undefined, 'ocs__btn small accent document-reader__lesson');
    link.append(icon(document.assignment ? 'fa-file-alt' : 'fa-file-code'), document.title);
    const check = icon('fa-check document-reader__check');
    check.dataset.lessonCompleted = '';
    check.hidden = true;
    link.append(check);
    link.href = readerLink(document.url, base, context, context.course ? '' : writeState(topics));
    link.dataset.lessonId = document.url;
    link.title = document.title;
    if (document.url === identity) {
      link.classList.add('fill');
      link.setAttribute('aria-current', 'page');
    }
    return link;
  }

  function appendLessons(parent, documents) {
    const list = node('ul', undefined, 'ocs__tree document-reader__lessons');
    documents.forEach(document => {
      const item = node('li', undefined, 'ocs__tree-item');
      item.append(lessonLink(document));
      list.append(item);
    });
    parent.append(list);
  }

  function courseTree() {
    const weeks = courseWeeks(payload.documents, context.course);
    const schedule = payload.courses[context.course];
    const sections = [];
    const placed = new Set();
    const currentWeek = Number(membership[context.course].week);
    function appendWeek(parent, group, title) {
      const details = node('details', undefined, 'ocs__tree document-reader__week');
      details.dataset.week = String(group.week);
      details.dataset.weekGroup = '';
      details.open = group.week === currentWeek;
      const summary = node('summary', undefined, 'document-reader__week-summary');
      summary.append(node('span', `W${group.week}`, 'ocs__status-pill ocs__status-pill--good'));
      summary.append(node('span', title || `Week ${group.week}`, 'document-reader__week-title'));
      const count = node('span', undefined, 'ocs__status-pill ocs__status-pill--neutral');
      count.dataset.weekCount = '';
      summary.append(count);
      details.append(summary);
      const intro = node('a', `Week ${group.week} overview`, 'ocs__btn small accent');
      intro.href = `${base}/${context.course}/week-${group.week}/`;
      details.append(intro);
      appendLessons(details, group.lessons);
      parent.append(details);
      sections.push({ id: `week-${group.week}`, element: details,
        isOpen: () => details.open, setOpen: open => { details.open = open; } });
    }
    schedule.sprints.forEach(sprint => {
      const groups = weeks.filter(group => group.week >= sprint.start && group.week <= sprint.end);
      if (!groups.length) return;
      const details = node('details', undefined, 'document-reader__sprint');
      details.open = groups.some(group => group.week === currentWeek);
      details.append(node('summary', `${sprint.id}: ${sprint.title}`));
      const intro = node('a', undefined, 'ocs__btn small accent document-reader__intro');
      intro.append(icon('fa-flag'), 'Sprint overview');
      intro.href = `${base}/${context.course}/sprint-${sprint.id.replace('Sprint', '')}/`;
      details.append(intro);
      groups.forEach(group => { placed.add(group.week); appendWeek(details, group, sprint.weeks[String(group.week)]); });
      tree.append(details);
      sections.push({ id: `sprint-${sprint.id.replace('Sprint', '')}-lessons`, element: details,
        isOpen: () => details.open, setOpen: open => { details.open = open; } });
    });
    weeks.filter(group => !placed.has(group.week)).forEach(group => {
      // No week overview is generated outside the schedule's sprint ranges.
      const section = node('section');
      section.dataset.weekGroup = '';
      const heading = node('h3', `Week ${group.week} `);
      const count = node('span', undefined, 'ocs__status-pill ocs__status-pill--neutral');
      count.dataset.weekCount = '';
      heading.append(count);
      section.append(heading);
      appendLessons(section, group.lessons);
      tree.append(section);
    });
    navigation = createNavigationState(sidebar, context.course, panel, sections);
    navigation.restore();
    return weeks.flatMap(group => group.lessons);
  }

  function topicsTree() {
    const primary = payload.primary || [];
    const selected = selectedDocuments(payload.documents, topics.categories, null,
      { primary, match: topics.match }).filter(document => {
      const text = `${document.title} ${document.description}`.toLowerCase();
      return topics.query.toLowerCase().trim().split(/\s+/).every(word => text.includes(word));
    });
    appendLessons(tree, selected);
    return selected;
  }

  function render() {
    navigation?.destroy();
    navigation = null;
    tree.replaceChildren();
    selector.value = context.course || 'topics';
    status.textContent = context.issue;
    root.querySelector('[data-reader-heading]').textContent = context.course
      ? payload.courses[context.course].title : 'Topics';
    root.querySelector('[data-reader-topic-controls]').hidden = Boolean(context.course);
    query.value = topics.query;
    category.value = topics.categories.length === 1 ? topics.categories[0] : '';
    const home = root.querySelector('[data-reader-home]');
    home.href = context.course ? `${base}/navigation/courses/${context.course}/`
      : `${base}/topics/?${writeState(topics)}`;
    const homeLabel = context.course ? `${context.course.toUpperCase()} home` : 'Topics catalog';
    home.setAttribute('aria-label', homeLabel);
    home.title = homeLabel;
    root.querySelector('[data-reader-full-topics]').href = `${base}/topics/?${writeState(topics)}`;
    const order = context.course ? courseTree() : topicsTree();
    root.querySelector('[data-reader-count]').textContent = `${order.length} documents`;
    const index = order.findIndex(document => document.url === identity);
    pager.hidden = index < 0;
    for (const [hook, label, document] of [['previous', 'Previous', order[index - 1]], ['next', 'Next', order[index + 1]]]) {
      const link = root.querySelector(`[data-reader-${hook}]`);
      const button = root.querySelector(`[data-reader-toolbar-${hook}]`);
      const available = Boolean(document) && index >= 0;
      link.hidden = !available;
      button.hidden = !available;
      if (available) {
        const href = readerLink(document.url, base, context, context.course ? '' : writeState(topics));
        link.textContent = document.title;
        link.href = href;
        button.href = href;
        button.setAttribute('aria-label', `${label} document: ${document.title}`);
        button.title = `${label}: ${document.title}`;
      } else {
        button.removeAttribute('href');
      }
    }
    updateCompletion();
    const indexed = new Set(payload.documents.map(document => base + document.url));
    root.querySelectorAll('[data-reader-main] article a[href]').forEach(link => {
      if (!originalLinks.has(link)) originalLinks.set(link, link.href);
      const url = new URL(originalLinks.get(link));
      if (url.origin !== location.origin || !indexed.has(url.pathname) || url.searchParams.has('context')) return;
      const selected = new URL(readerLink(url.pathname.slice(base.length), base, context,
        context.course ? '' : writeState(topics)), location.origin);
      selected.hash = url.hash;
      url.searchParams.forEach((value, key) => selected.searchParams.append(key, value));
      link.href = selected.href;
    });
    // The article and its live runners/forms are never replaced or reinitialized.
  }

  function updateUrl(replace = false) {
    const url = new URL(location.href);
    const next = new URL(readerLink(identity, base, context, context.course ? '' : writeState(topics)), location.origin);
    for (const key of ['context', 'course', 'category', 'q', 'match', 'view']) url.searchParams.delete(key);
    next.searchParams.forEach((value, key) => url.searchParams.append(key, value));
    history[replace ? 'replaceState' : 'pushState'](null, '', url);
    if (context.course) rememberCourse(context.course);
    render();
  }

  try {
    const response = await fetch(root.dataset.indexUrl);
    if (!response.ok) throw new Error(`Reader index HTTP ${response.status}`);
    payload = await response.json();
    if (!Array.isArray(payload.documents) || !payload.courses) throw new Error('Invalid reader index');
    const categories = [...new Set(payload.documents.flatMap(document => document.categories))].sort();
    categories.forEach(value => {
      const option = node('option', value);
      option.value = value;
      category.append(option);
    });
    if (context.course) rememberCourse(context.course);
    render();
  } catch (error) {
    console.error('Document navigation could not initialize', error);
    status.textContent = 'Document navigation is unavailable. The lesson and submission form remain usable; reload to retry.';
    selector.disabled = true;
    return;
  }
  selector.addEventListener('change', () => {
    context = { course: selector.value === 'topics' ? null : selector.value, issue: '' };
    updateUrl();
  });
  query.addEventListener('input', () => { topics.query = query.value; updateUrl(true); });
  category.addEventListener('change', () => {
    topics.categories = category.value ? [category.value] : [];
    updateUrl();
  });
  complete.addEventListener('click', () => {
    const data = completionData();
    if (!context.course || data === null) return;
    data[identity] = data[identity] !== true;
    try {
      localStorage.setItem(`${context.course}-lesson-completion`, JSON.stringify(data));
    } catch (error) {
      console.error('Cannot save lesson completion', error);
      status.textContent = 'Completion could not be saved. Please try again.';
      return;
    }
    updateCompletion();
    window.dispatchEvent(new CustomEvent('completionChanged', { detail: { itemId: identity, completed: data[identity] } }));
  });
  window.addEventListener('popstate', () => {
    context = readerContext(location.search, membership, root.dataset.defaultCourse);
    topics = readState(location.search);
    render();
  });
  window.addEventListener('completionChanged', updateCompletion);
  window.addEventListener('storage', event => {
    if (event.key === `${context.course}-lesson-completion`) updateCompletion();
  });
  sidebar.addEventListener('toggle', () => navigation?.restorePosition());
}
