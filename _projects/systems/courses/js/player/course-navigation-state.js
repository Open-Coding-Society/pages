export function createNavigationState(root, course, panel, sections, environment = window) {
  const key = `ocs-course-navigation:${course}:${panel}`;
  let state = { sections: {}, scrollTop: 0, lastDocument: null };
  const selection = '.lesson-item.active, .sprint-nav [aria-current="page"], .modal-lesson-item.active';
  let resume = null;

  function selectedRow() {
    return root.querySelector(selection) || resume;
  }

  try {
    const saved = environment.localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed || typeof parsed.sections !== 'object' || parsed.sections === null ||
          Array.isArray(parsed.sections) || !Object.values(parsed.sections).every(value => typeof value === 'boolean') ||
          !Number.isFinite(parsed.scrollTop) || parsed.scrollTop < 0 ||
          (parsed.lastDocument != null && typeof parsed.lastDocument !== 'string')) {
        throw new Error('Invalid saved navigation state');
      }
      state = parsed;
    }
  } catch (error) {
    console.warn(`Cannot restore ${course} ${panel} navigation:`, error);
  }

  function save() {
    const current = root.querySelector(selection);
    if (current?.dataset.lessonId) state.lastDocument = current.href;
    state.sections = Object.fromEntries(sections.map(section => [section.id, section.isOpen()]));
    // Hidden panels have no scroll geometry; retain their last visible position.
    if (root.clientHeight > 0) state.scrollTop = root.scrollTop;
    try {
      environment.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.warn(`Cannot save ${course} ${panel} navigation:`, error);
    }
  }

  function revealSelection() {
    if (root.clientHeight === 0) return;
    const current = selectedRow();
    if (!current) return;
    const row = current.getBoundingClientRect();
    const viewport = root.getBoundingClientRect();
    if (row.top < viewport.top) root.scrollTop += row.top - viewport.top;
    else if (row.bottom > viewport.bottom) root.scrollTop += row.bottom - viewport.bottom;
  }

  function restore() {
    sections.forEach(section => {
      section.setOpen(state.sections[section.id] ?? section.isOpen());
    });
    const active = root.querySelector(selection);
    if (active?.dataset.lessonId) state.lastDocument = active.href;
    if (!active && state.lastDocument) {
      resume = Array.from(root.querySelectorAll('[data-lesson-id]'))
        .find(row => row.dataset.lessonId && row.href === state.lastDocument) || null;
      if (resume) {
        resume.classList.add('navigation-resume');
        resume.title = `Continue reading: ${resume.textContent.trim()}`;
      }
    }
    const current = selectedRow();
    sections.forEach(section => {
      if (current && section.element.contains(current)) section.setOpen(true);
    });
    restorePosition();
    save();
  }

  function restorePosition() {
    if (root.clientHeight === 0) return;
    root.scrollTop = state.scrollTop;
    revealSelection();
  }

  root.addEventListener('scroll', save, { passive: true });
  root.addEventListener('click', save);
  root.addEventListener('navigation-toggle', save);
  root.addEventListener('toggle', save, true);
  environment.addEventListener('pagehide', save);
  return { restore, restorePosition, save };
}
