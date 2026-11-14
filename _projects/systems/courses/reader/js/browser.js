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
  const currentButton = root.querySelector('[data-reader-complete]');
  const pager = root.querySelector('[data-reader-pager]');
  // Course home, sprint, week and Blogs pages are overviews, not documents:
  // no review circle, and the tree marks their sprint or week instead.
  const overview = {
    kind: root.dataset.overview || '',
    sprint: Number(root.dataset.overviewSprint),
    week: Number(root.dataset.overviewWeek),
  };
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
    const done = data?.[identity] === true;
    [currentButton, ...tree.querySelectorAll('[data-reader-complete]')].forEach(button => {
      button.hidden = !context.course || Boolean(overview.kind);
      button.disabled = data === null;
      button.setAttribute('aria-pressed', String(done));
      button.title = done ? 'Reviewed (select to undo)' : 'Mark reviewed';
      button.classList.toggle('fill', done);
      button.querySelector('[data-reader-complete-icon]').className = done ? 'fas fa-check' : 'fa-regular fa-circle';
    });
    tree.querySelectorAll('[data-lesson-id]').forEach(link => {
      const completed = data?.[link.dataset.lessonId] === true;
      // The current document shows its state on its review circle instead.
      link.querySelector('[data-lesson-completed]').hidden = !completed
        || (Boolean(context.course) && link.dataset.lessonId === identity);
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
    const progress = root.querySelector('[data-reader-count]').querySelector('[data-reader-progress]');
    if (progress) {
      const lessons = new Set([...tree.querySelectorAll('[data-lesson-id]')].map(link => link.dataset.lessonId));
      const completed = [...lessons].filter(id => data?.[id] === true).length;
      progress.textContent = `${data === null ? '?' : completed}/${lessons.size}`;
      progress.setAttribute('aria-label', data === null
        ? `Course progress unavailable for ${lessons.size} lessons`
        : `${completed} of ${lessons.size} course lessons completed`);
    }
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

  function reviewButton(title) {
    const button = node('button', undefined, 'document-reader__complete ocs__btn ocs__btn--icon small accent');
    button.type = 'button';
    button.dataset.readerComplete = '';
    button.setAttribute('aria-label', `Reviewed: ${title}`);
    const glyph = node('i', undefined, 'fa-regular fa-circle');
    glyph.setAttribute('aria-hidden', 'true');
    glyph.dataset.readerCompleteIcon = '';
    button.append(glyph);
    button.addEventListener('click', toggleCompletion);
    return button;
  }

  function appendLessons(parent, documents) {
    const list = node('ul', undefined, 'ocs__tree document-reader__lessons');
    documents.forEach(document => {
      const item = node('li', undefined, 'ocs__tree-item');
      if (context.course && document.url === identity) {
        item.classList.add('document-reader__active');
        item.append(reviewButton(document.title));
      }
      item.append(lessonLink(document));
      list.append(item);
    });
    parent.append(list);
  }

  // Desktop scrolls the current row (document, or this overview's sprint/week,
  // or on course home the resumed document) near the top. navigation.restore()
  // already opened its sprint and week and kept the student's other saved sections.
  function scrollCurrentNearTop() {
    const row = tree.querySelector('[aria-current="page"]') || tree.querySelector('.navigation-resume');
    if (!row?.getBoundingClientRect || sidebar.clientHeight === 0) return;
    const offset = row.getBoundingClientRect().top - sidebar.getBoundingClientRect().top;
    sidebar.scrollTop += offset - sidebar.clientHeight / 4;
  }

  // The overview being read: course-navigation-state opens its ancestors.
  function markCurrent(link) {
    link.dataset.readerOverview = '';
    link.setAttribute('aria-current', 'page');
    link.classList.add('document-reader__overview-current');
    if (link.classList.contains('ocs__btn')) link.classList.add('fill');
  }

  function courseTree() {
    const weeks = courseWeeks(payload.documents, context.course);
    const schedule = payload.courses[context.course];
    const sections = [];
    const placed = new Set();
    const currentWeek = Number(membership[context.course].week);
    // Reading order for < >: each sprint and week overview comes before its lessons.
    const order = [];
    // Sprint and week rows share one treatment: the S or W pill holds the arrow and,
    // being plain text inside the summary, toggles the folder; the title opens the overview.
    function folder(className, pillText, titleText, href, current) {
      const details = node('details', undefined, `document-reader__folder ${className}`);
      const summary = node('summary', undefined, 'document-reader__folder-summary');
      const pill = node('span', undefined, 'ocs__btn small pill document-reader__folder-pill');
      pill.append(icon('fa-chevron-right document-reader__folder-arrow'), pillText);
      const title = node('a', titleText, 'document-reader__folder-title');
      title.href = href;
      if (current) markCurrent(title);
      summary.append(pill, title);
      details.append(summary);
      order.push({ title: titleText, href, current });
      return { details, summary, title };
    }
    function section(id, details) {
      sections.push({ id, element: details, isOpen: () => details.open, setOpen: open => { details.open = open; } });
    }
    function appendWeek(parent, group, title) {
      const { details, summary, title: weekTitle } = folder('ocs__tree document-reader__week', `W${group.week}`,
        title || `Week ${group.week}`, `${base}/${context.course}/week-${group.week}/`,
        overview.kind === 'week' && overview.week === group.week);
      details.dataset.week = String(group.week);
      details.dataset.weekGroup = '';
      details.open = group.week === currentWeek;
      weekTitle.dataset.weekTitle = '';
      const count = node('span', undefined, 'ocs__status-pill ocs__status-pill--neutral');
      count.dataset.weekCount = '';
      summary.append(count);
      appendLessons(details, group.lessons);
      order.push(...group.lessons);
      parent.append(details);
      section(`week-${group.week}`, details);
    }
    schedule.sprints.forEach(sprint => {
      const groups = weeks.filter(group => group.week >= sprint.start && group.week <= sprint.end);
      if (!groups.length) return;
      const number = sprint.id.replace('Sprint', '');
      const { details, title: sprintTitle } = folder('document-reader__sprint', `S${number}`,
        String(sprint.title || '').trim() || `Sprint ${number}`, `${base}/${context.course}/sprint-${number}/`,
        overview.kind === 'sprint' && `Sprint${overview.sprint}` === sprint.id);
      sprintTitle.dataset.sprintTitle = '';
      details.open = groups.some(group => group.week === currentWeek);
      groups.forEach(group => { placed.add(group.week); appendWeek(details, group, sprint.weeks[String(group.week)]); });
      tree.append(details);
      section(`sprint-${number}-lessons`, details);
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
      order.push(...group.lessons);
      tree.append(section);
    });
    navigation = createNavigationState(sidebar, context.course, panel, sections);
    navigation.restore();
    if (panel === 'desktop') scrollCurrentNearTop();
    return order;
  }

  function topicsTree() {
    const primary = payload.primary || [];
    const selected = selectedDocuments(payload.documents.filter(document => document.topics !== false), topics.categories, null,
      { primary, match: topics.match }).filter(document => {
      const text = `${document.title} ${document.description}`.toLowerCase();
      return topics.query.toLowerCase().trim().split(/\s+/).every(word => text.includes(word));
    });
    appendLessons(tree, selected);
    return selected;
  }

  // Previous/next around this page. Course order includes the sprint and week
  // overviews; course home continues the last document the student read
  // (course-navigation-state's resume row).
  function neighbors(order) {
    if (overview.kind === 'home') {
      const row = tree.querySelector('.navigation-resume');
      const document = row && order.find(entry => entry.url === row.dataset.lessonId);
      return [undefined, document ? { ...document, href: row.href, resume: true } : undefined];
    }
    const index = order.findIndex(entry => (overview.kind ? entry.current : entry.url === identity));
    return index < 0 ? [] : [order[index - 1], order[index + 1]];
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
    const total = root.querySelector('[data-reader-count]');
    if (context.course) {
      const progress = node('span', undefined, 'ocs__status-pill ocs__status-pill--neutral');
      progress.dataset.readerProgress = '';
      total.replaceChildren(node('span', 'Course Progress'), progress);
    } else {
      total.textContent = `${order.length} documents`;
    }
    const [previous, next] = neighbors(order);
    pager.hidden = !previous && !next;
    for (const [hook, label, document] of [['previous', 'Previous', previous], ['next', next?.resume ? 'Continue' : 'Next', next]]) {
      const link = root.querySelector(`[data-reader-${hook}]`);
      const button = root.querySelector(`[data-reader-toolbar-${hook}]`);
      const available = Boolean(document);
      link.hidden = !available;
      button.hidden = !available;
      if (available) {
        const href = document.href || readerLink(document.url, base, context, context.course ? '' : writeState(topics));
        link.replaceChildren(...(hook === 'previous'
          ? [icon('fa-chevron-left'), ` ${document.title}`]
          : [`${document.title} `, icon('fa-chevron-right')]));
        const description = document.resume ? `Continue reading: ${document.title}` : `${label} document: ${document.title}`;
        link.setAttribute('aria-label', description);
        link.href = href;
        button.href = href;
        button.setAttribute('aria-label', description);
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
  function toggleCompletion() {
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
  }
  currentButton.addEventListener('click', toggleCompletion);
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
