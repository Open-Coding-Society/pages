export function setViewerLink(link, destination, { hideWhenUnavailable = false } = {}) {
  if (!destination) {
    link.removeAttribute('href');
    link.hidden = hideWhenUnavailable;
    if (!hideWhenUnavailable) link.setAttribute('aria-disabled', 'true');
    return;
  }
  link.hidden = false;
  link.removeAttribute('aria-disabled');
  link.href = destination.href;
  link.setAttribute('aria-label', destination.label);
  link.title = destination.title;
}

export function mountViewerAction(slot, action, { removeClasses = [] } = {}) {
  action.classList.remove(...removeClasses);
  action.classList.add('small');
  action.setAttribute('data-viewer-action', '');
  slot.append(action);
}

export function fitViewerAbove(viewer, target) {
  const minimumTop = Number.parseFloat(window.getComputedStyle(target).top);
  if (!Number.isFinite(minimumTop)) throw new Error('Viewer target must have a fixed top position');
  const update = () => {
    const top = Math.max(minimumTop, Math.ceil(viewer.getBoundingClientRect().bottom));
    target.style.setProperty('--page-viewer-top', `${top}px`);
  };
  const observer = new ResizeObserver(update);
  observer.observe(viewer);
  window.addEventListener('resize', update);
  window.addEventListener('scroll', update, { passive: true });
  update();
  return () => {
    observer.disconnect();
    window.removeEventListener('resize', update);
    window.removeEventListener('scroll', update);
    target.style.removeProperty('--page-viewer-top');
  };
}
