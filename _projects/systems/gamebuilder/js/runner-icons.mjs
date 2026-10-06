/**
 * @module runner-icons
 * @description Applies monochrome SVG icons to existing workbench runner
 * controls without changing shared runner pages, hooks, labels, or behavior.
 * @usage Call once with the workbench root after GAME_RUNNER is ready.
 */
export function styleRunnerIcons(root) {
  const paths = {
    run: 'M7 3v18l14-9L7 3z',
    pause: 'M6 3h4v18H6V3zm8 0h4v18h-4V3z',
    stop: 'M4 4h16v16H4V4z',
    fullscreen: 'M2 2h8v2H4v6H2V2zm12 0h8v8h-2V4h-6V2zM2 14h2v6h6v2H2v-8zm18 0h2v8h-8v-2h6v-6z',
    copy: 'M8 2h14v16H8V2zm2 2v12h10V4H10zM2 6h4v2H4v12h10v-2h2v4H2V6z',
    save: 'M3 2h15l4 4v16H2V2h1zm1 2v16h16V7l-3-3H4zm2 1h10v6H6V5zm2 2v2h6V7H8zm-2 7h12v5H6v-5zm2 2v1h8v-1H8z',
    clear: 'M6 6V3h12v3h4v2H2V6h4zm2 0h8V5H8v1zM5 10h14l-1 12H6L5 10zm4 2v8h2v-8H9zm4 0v8h2v-8h-2z'
  };
  for (const [hook, path] of Object.entries(paths)) {
    const button = root.querySelector(`[data-hook="${hook}"]`);
    if (!button) continue;
    if (hook === 'clear') {
      button.title = 'Clear runner code (keep panels and saved workspace)';
      button.setAttribute('aria-label', 'Clear Runner Code');
    }
    button.classList.add('ocs__btn--icon', 'ocs__gamebuilder-svg-control');
    const icon = document.createElement('span');
    icon.className = 'ocs__btn-icon';
    icon.setAttribute('aria-hidden', 'true');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    const shape = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    shape.setAttribute('d', path);
    svg.append(shape);
    icon.append(svg);
    button.replaceChildren(icon);
  }
}
