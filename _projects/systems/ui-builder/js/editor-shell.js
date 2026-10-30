// The editing shell's markup (DESIGN §10): the top bar, the More menu, the outline, canvas and
// inspector panes, the banner slot and the feedback line. It owns only presentation: the
// Preview/Code switch, the device buttons and the canvas size (scaled to fit, with the zoom
// shown), the pane toggles below 1440px and the menu's keyboard behaviour. editor-edit.js wires
// the actions.
import { el, icon, iconButton } from './editor-fields.js';

const WIDE = '(min-width: 1440px)';

// The device width shown at `scale` so it fits `available` pixels; width 0 is the pane itself.
export function fitScale(available, deviceWidth) {
  const room = Math.max(1, Math.floor(available));
  const width = deviceWidth > 0 ? Math.floor(deviceWidth) : room;
  return { width, scale: width > room ? room / width : 1 };
}

export function buildShell({ doc = globalThis.document, registry, say, caps = {}, baseurl = '', win = doc.defaultView }) {
  const devices = (Array.isArray(registry.devices) ? registry.devices : []).filter((device) => device && typeof device.key === 'string');
  const wrap = (child, hidden = true) => el(doc, 'span', { class: 'ui-builder-wrap', hidden }, child);
  // Icon and words: ocs__btn--icon spaces them (a flex button drops a leading space).
  const back = el(doc, 'a', { class: 'ocs__btn ocs__btn--icon small', href: `${String(baseurl).replace(/\/+$/, '')}/ui-builder/` }, icon(doc, 'fa-arrow-left'), say('back'));
  const title = el(doc, 'button', { type: 'button', class: 'ocs__btn small ocs__truncate ui-builder-title' }, '');
  const saveState = el(doc, 'strong', { class: 'ocs__status-pill ocs__status-pill--neutral' }, '');
  const publishState = el(doc, 'strong', { class: 'ocs__status-pill' }, '');
  const undo = iconButton(doc, { name: 'fa-rotate-left', label: say('undo') });
  const redo = iconButton(doc, { name: 'fa-rotate-right', label: say('redo') });
  const deviceButtons = new Map(devices.map((device) => [device.key, el(doc, 'button', {
    type: 'button', class: 'ocs__btn small', 'aria-pressed': 'false', title: say('device_label', { label: device.label }),
  }, device.label)]));
  // Preview draws the page; Code shows the HTML its page file holds (editor-code.js).
  const viewButtons = new Map([
    ['preview', el(doc, 'button', { type: 'button', class: 'ocs__btn ocs__btn--icon small', 'aria-pressed': 'false' }, icon(doc, 'fa-eye'), say('view_preview'))],
    ['code', el(doc, 'button', { type: 'button', class: 'ocs__btn ocs__btn--icon small', 'aria-pressed': 'false' }, icon(doc, 'fa-code'), say('view_code'))],
  ]);
  const devicesGroup = el(doc, 'div', { class: 'ocs__links ui-builder-devices', role: 'group', 'aria-label': say('device_group') }, [...deviceButtons.values()]);
  const realInput = el(doc, 'input', { type: 'checkbox', class: 'ocs__toggle-input', id: 'ui-real-data', 'aria-describedby': 'ui-real-data-help' });
  const realData = el(doc, 'div', { class: 'ui-builder-wrap', hidden: true },
    el(doc, 'label', { class: 'ocs__toggle', title: say('real_data_help') }, realInput, el(doc, 'span', { class: 'ocs__toggle-track', 'aria-hidden': 'true' }), el(doc, 'span', { class: 'ocs__toggle-label' }, say('real_data'))),
    el(doc, 'small', { id: 'ui-real-data-help', class: 'ui-builder-visually-hidden' }, say('real_data_help')));
  const outlineToggle = el(doc, 'button', { type: 'button', class: 'ocs__btn ocs__btn--icon small ui-builder-pane-toggle', 'aria-expanded': 'false', 'aria-controls': 'ui-outline' }, icon(doc, 'fa-list'), say('outline_toggle'));
  const inspectorToggle = el(doc, 'button', { type: 'button', class: 'ocs__btn ocs__btn--icon small ui-builder-pane-toggle', 'aria-expanded': 'false', 'aria-controls': 'ui-inspector' }, icon(doc, 'fa-sliders'), say('inspector_toggle'));
  const preview = el(doc, 'a', { class: 'ocs__btn ocs__btn--icon small', href: '#', target: '_blank', rel: 'noopener' }, icon(doc, 'fa-eye'), say('preview_draft'));
  const live = el(doc, 'a', { class: 'ocs__btn ocs__btn--icon small', href: '#', target: '_blank', rel: 'noopener' }, icon(doc, 'fa-arrow-up-right-from-square'), say('open_live'));
  const publish = el(doc, 'button', { type: 'button', class: 'ocs__btn small accent fill' }, say('publish'));
  const more = el(doc, 'button', { type: 'button', class: 'ocs__btn ocs__btn--icon small', 'aria-haspopup': 'menu', 'aria-expanded': 'false', 'aria-controls': 'ui-more-menu' }, icon(doc, 'fa-ellipsis'), say('more'));
  const menuNames = ['export_page', 'export_json', 'show_html', ...(caps.revisions ? ['revisions'] : []), 'page_settings'];
  const menuItems = new Map(menuNames.map((name) => [name, el(doc, 'button', { type: 'button', role: 'menuitem', tabindex: '-1', class: 'ui-builder-menu-item' }, say(name))]));
  const menu = el(doc, 'div', { class: 'ui-builder-menu', id: 'ui-more-menu', role: 'menu', 'aria-label': say('more') }, [...menuItems.values()]);
  const menuWrap = el(doc, 'div', { class: 'ui-builder-menu-wrap', hidden: true }, menu);
  const previewWrap = wrap(preview, false);
  const liveWrap = wrap(live);
  const publishWrap = wrap(publish, !caps.publish);

  const bar = el(doc, 'div', { class: 'ui-builder-bar', role: 'group', 'aria-label': say('toolbar_label') },
    el(doc, 'div', { class: 'ocs__links ui-builder-bar-group' }, back, title, saveState, publishState),
    el(doc, 'div', { class: 'ocs__links ui-builder-bar-group' }, undo, redo,
      el(doc, 'div', { class: 'ocs__links ui-builder-views', role: 'group', 'aria-label': say('view_group') }, [...viewButtons.values()]), devicesGroup, realData),
    el(doc, 'div', { class: 'ocs__links ui-builder-bar-group' }, outlineToggle, inspectorToggle, previewWrap, liveWrap, publishWrap,
      el(doc, 'div', { class: 'ui-builder-more' }, more, menuWrap)));

  const outlinePane = el(doc, 'section', { class: 'ui-builder-pane ui-builder-outline', id: 'ui-outline', 'aria-label': say('outline') });
  const zoom = el(doc, 'output', { class: 'ui-builder-note' }, '');
  const canvasStatus = el(doc, 'output', { class: 'ui-builder-note', 'aria-live': 'polite' }, say('canvas_loading'));
  const iframe = el(doc, 'iframe', { class: 'ui-builder-frame', title: say('canvas_title') });
  const viewport = el(doc, 'div', { class: 'ui-builder-viewport' }, iframe);
  const reload = el(doc, 'button', { type: 'button', class: 'ocs__btn small accent' }, say('canvas_reload'));
  const failed = el(doc, 'div', { class: 'ui-builder-wrap', hidden: true }, el(doc, 'div', { class: 'ocs__callout', role: 'alert' }, say('canvas_failed'), ' ', reload));
  const stagebar = el(doc, 'div', { class: 'ui-builder-stagebar' }, zoom, canvasStatus);
  const codePane = el(doc, 'div', { class: 'ui-builder-code-pane', hidden: true });
  const stage = el(doc, 'section', { class: 'ui-builder-stage', 'aria-label': say('canvas_title') }, stagebar, failed, viewport, codePane);
  const inspectorPane = el(doc, 'section', { class: 'ui-builder-pane ui-builder-inspector', id: 'ui-inspector', 'aria-labelledby': 'ui-inspector-title', tabindex: '-1' });
  const body = el(doc, 'div', { class: 'ui-builder-body' }, outlinePane, stage, inspectorPane);
  const banners = el(doc, 'div', { class: 'ocs__stack ui-builder-banners' });
  const feedbackText = el(doc, 'strong', null, '');
  const dismiss = iconButton(doc, { name: 'fa-xmark', label: say('dismiss') });
  const dismissWrap = wrap(dismiss);
  const feedback = el(doc, 'div', { class: 'ui-builder-feedback', role: 'status', 'aria-live': 'polite' }, feedbackText, dismissWrap);
  // The feedback line sits under the bar, so an answer such as Publish's list of problems stays
  // on screen: under the panes, which fill the window's height, it was below the bottom edge.
  const element = el(doc, 'div', { class: 'ui-builder-shell' }, bar, banners, feedback, body);

  // ---- devices and the canvas size
  // A phone-sized editor starts on the phone preview; anything wider on the desktop one.
  const has = (key) => devices.some((item) => item.key === key);
  let device = win.innerWidth < 768 && has('phone') ? 'phone' : (has('desktop') ? 'desktop' : (devices[0] && devices[0].key));
  function fit() {
    const chosen = devices.find((item) => item.key === device);
    const { width, scale } = fitScale(viewport.clientWidth, chosen ? Number(chosen.width) || 0 : 0);
    const height = Math.max(1, viewport.clientHeight) / scale;
    viewport.style.setProperty('--ui-frame-width', `${width}px`);
    viewport.style.setProperty('--ui-frame-height', `${Math.round(height)}px`);
    viewport.style.setProperty('--ui-frame-scale', String(scale));
    viewport.style.setProperty('--ui-frame-left', `${Math.max(0, Math.floor((viewport.clientWidth - (width * scale)) / 2))}px`);
    zoom.textContent = say('zoom', { percent: Math.round(scale * 100) });
  }
  function setDevice(key) {
    if (!deviceButtons.has(key)) return;
    device = key;
    for (const [name, button] of deviceButtons) {
      const on = name === key;
      button.setAttribute('aria-pressed', String(on));
      // The grammar's selected look, so the pressed state shows as well as being announced.
      button.classList.toggle('accent', on);
      button.classList.toggle('fill', on);
    }
    fit();
  }
  for (const [key, button] of deviceButtons) button.addEventListener('click', () => setDevice(key));

  // ---- the view: the preview, or the page's code in its place (the device sizes don't apply to it)
  let view = 'preview';
  function setView(name) {
    if (!viewButtons.has(name)) return;
    view = name;
    for (const [key, button] of viewButtons) {
      const on = key === name;
      button.setAttribute('aria-pressed', String(on));
      button.classList.toggle('accent', on);
      button.classList.toggle('fill', on);
    }
    const code = name === 'code';
    stagebar.hidden = code;
    viewport.hidden = code;
    devicesGroup.hidden = code;
    codePane.hidden = !code;
    if (!code) fit();
  }
  const observer = typeof win.ResizeObserver === 'function' ? new win.ResizeObserver(() => fit()) : null;
  if (observer) observer.observe(viewport);
  else win.addEventListener('resize', fit);

  // ---- panes: always open from 1440px; below, the toggles open them
  const wide = win.matchMedia ? win.matchMedia(WIDE) : { matches: true, addEventListener() {} };
  function setPane(name, open) {
    const toggle = name === 'outline' ? outlineToggle : inspectorToggle;
    if (open) body.setAttribute(`data-${name}-open`, '');
    else body.removeAttribute(`data-${name}-open`);
    toggle.setAttribute('aria-expanded', String(open));
    // The grammar draws fill only with accent: both, as the device buttons do, show it open.
    toggle.classList.toggle('accent', open);
    toggle.classList.toggle('fill', open);
    fit();
  }
  const paneOpen = (name) => wide.matches || body.hasAttribute(`data-${name}-open`);
  outlineToggle.addEventListener('click', () => setPane('outline', !body.hasAttribute('data-outline-open')));
  inspectorToggle.addEventListener('click', () => setPane('inspector', !body.hasAttribute('data-inspector-open')));

  // ---- the More menu
  const items = () => [...menuItems.values()].filter((item) => !item.disabled);
  function openMenu(focusFirst = true) {
    menuWrap.hidden = false;
    more.setAttribute('aria-expanded', 'true');
    if (focusFirst && items()[0]) items()[0].focus();
  }
  function closeMenu(returnFocus = true) {
    if (menuWrap.hidden) return;
    menuWrap.hidden = true;
    more.setAttribute('aria-expanded', 'false');
    if (returnFocus) more.focus();
  }
  more.addEventListener('click', () => (menuWrap.hidden ? openMenu() : closeMenu()));
  more.addEventListener('keydown', (event) => { if (event.key === 'ArrowDown') { event.preventDefault(); openMenu(); } });
  menu.addEventListener('keydown', (event) => {
    const list = items();
    const at = list.indexOf(doc.activeElement);
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const next = list[(at + (event.key === 'ArrowDown' ? 1 : -1) + list.length) % list.length];
      if (next) next.focus();
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      (event.key === 'Home' ? list[0] : list[list.length - 1]).focus();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      closeMenu();
    } else if (event.key === 'Tab') {
      closeMenu(false);
    }
  });
  // Capture phase: the menu closes and focus is back on More before the item opens a dialog,
  // so the dialog returns focus there and not to a hidden menu item.
  menu.addEventListener('click', (event) => { if (event.target.closest('[role="menuitem"]')) closeMenu(true); }, true);
  const outside = (event) => { if (!menuWrap.hidden && !event.target.closest('.ui-builder-more')) closeMenu(false); };
  doc.addEventListener('click', outside, true);

  setDevice(device);
  setView('preview');
  return {
    element, title, saveState, publishState, undo, redo, realInput, realData, preview, previewWrap, live, liveWrap,
    publish, publishWrap, menuItems, outlinePane, inspectorPane, iframe, viewport, stage, canvasStatus, failed, reload,
    banners, feedbackText, dismiss, dismissWrap, feedback, outlineToggle, inspectorToggle, viewButtons, codePane,
    get device() { return device; },
    get view() { return view; },
    setDevice, setView, fit, setPane, paneOpen, closeMenu,
    destroy() {
      if (observer) observer.disconnect();
      else win.removeEventListener('resize', fit);
      doc.removeEventListener('click', outside, true);
    },
  };
}
