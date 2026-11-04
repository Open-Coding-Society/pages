/**
 * @module barrier-editor
 * @description
 * Adds a temporary point-placement overlay to the shared GAME_RUNNER preview.
 * It captures normalized points only while a barrier is being edited and
 * otherwise leaves runner controls and game input untouched.
 *
 * @data
 * The overlay renders builder barrier records with normalized `{ x, y }`
 * points. Click coordinates are clamped and rounded to four decimal places.
 *
 * @usage
 * Create the editor with the runner's `.gameContainer` and a point callback.
 * Call `setBarriers(barriers, activeId)` after placement state changes, then
 * call `destroy()` when the workbench is torn down.
 */
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const COORDINATE_PRECISION = 10000;

export function normalizeCanvasPoint(clientX, clientY, rect) {
  if (!rect || rect.width <= 0 || rect.height <= 0) {
    throw new RangeError('The barrier placement surface must have a non-zero size');
  }

  const round = (value) => Math.round(value * COORDINATE_PRECISION) / COORDINATE_PRECISION;
  return {
    x: round(Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))),
    y: round(Math.max(0, Math.min(1, (clientY - rect.top) / rect.height)))
  };
}

export function createBarrierPlacementEditor(container, onPointAdded) {
  if (!(container instanceof Element)) {
    throw new TypeError('A game preview container is required for barrier placement');
  }
  if (typeof onPointAdded !== 'function') {
    throw new TypeError('A point placement callback is required');
  }

  const overlay = document.createElementNS(SVG_NAMESPACE, 'svg');
  overlay.classList.add('ocs__gamebuilder-barrier-overlay');
  overlay.setAttribute('viewBox', '0 0 1000 1000');
  overlay.setAttribute('preserveAspectRatio', 'none');
  overlay.setAttribute('aria-hidden', 'true');

  let barriers = [];
  let activeId = null;

  function draw() {
    overlay.replaceChildren();
    overlay.classList.toggle('is-active', Boolean(activeId));

    for (const barrier of barriers) {
      if (barrier.visible === false && barrier.id !== activeId) continue;
      if (!Array.isArray(barrier.points) || barrier.points.length === 0) continue;

      const path = document.createElementNS(SVG_NAMESPACE, 'path');
      let pathData = `M ${barrier.points[0].x * 1000},${barrier.points[0].y * 1000}`;
      for (let index = 0; index < barrier.points.length - 1; index++) {
        const p0 = barrier.points[index - 1] || barrier.points[index];
        const p1 = barrier.points[index];
        const p2 = barrier.points[index + 1];
        const p3 = barrier.points[index + 2] || p2;
        const control1 = {
          x: (p1.x + (p2.x - p0.x) / 6) * 1000,
          y: (p1.y + (p2.y - p0.y) / 6) * 1000
        };
        const control2 = {
          x: (p2.x - (p3.x - p1.x) / 6) * 1000,
          y: (p2.y - (p3.y - p1.y) / 6) * 1000
        };
        pathData += ` C ${control1.x},${control1.y} ${control2.x},${control2.y} ${p2.x * 1000},${p2.y * 1000}`;
      }
      path.classList.add('ocs__gamebuilder-barrier-line');
      if (barrier.id === activeId) path.classList.add('is-active');
      path.setAttribute('d', pathData);
      overlay.append(path);

      if (barrier.id === activeId) barrier.points.forEach((point, index) => {
        const marker = document.createElementNS(SVG_NAMESPACE, 'circle');
        marker.classList.add('ocs__gamebuilder-barrier-point');
        marker.classList.add('is-active');
        marker.setAttribute('cx', String(point.x * 1000));
        marker.setAttribute('cy', String(point.y * 1000));
        marker.setAttribute('r', '12');
        marker.setAttribute('aria-label', `Point ${index + 1}`);
        overlay.append(marker);
      });
    }
  }

  overlay.addEventListener('click', (event) => {
    if (!activeId) return;
    event.stopPropagation();
    const point = normalizeCanvasPoint(
      event.clientX,
      event.clientY,
      overlay.getBoundingClientRect()
    );
    onPointAdded(activeId, point);
  });

  container.append(overlay);
  draw();

  return Object.freeze({
    setBarriers(nextBarriers, nextActiveId = null) {
      if (!Array.isArray(nextBarriers)) {
        throw new TypeError('Barrier placement expects a list of barriers');
      }
      barriers = nextBarriers;
      activeId = nextActiveId;
      draw();
    },
    destroy() {
      overlay.remove();
    }
  });
}
