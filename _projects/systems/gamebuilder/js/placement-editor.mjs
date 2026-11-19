/**
 * @module placement-editor
 * @description
 * Lets a game type's list items be drawn on the shared GAME_RUNNER preview:
 * drag a box (a Platform platform) or click a point (a Racing obstacle).
 * Like the barrier editor, its overlay captures input only while a drawing
 * is in progress and otherwise leaves the runner and the game alone.
 *
 * @data
 * Results are normalized to the preview: a point is `{ x, y }` and a box is
 * `{ x, y, width, height }` with `x, y` its top-left corner. Values are
 * rounded to two decimals, the step of the panel's number fields.
 *
 * @usage
 * `createPlacementEditor(container, onPlaced)` adds the overlay.
 * `start(shape, existing)` begins a drawing, where shape is "box" or "point"
 * and `existing` lists the items already placed so they show for reference.
 * `onPlaced(result)` is called once and the drawing ends; `cancel()` or the
 * Escape key ends it without a result.
 */
import { normalizeCanvasPoint } from './barrier-editor.mjs';

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const SHAPES = ['box', 'point'];
const MIN_BOX_SIZE = 0.01;

const round = (value) => Math.round(value * 100) / 100;

/** The box between two normalized corners, with its top-left first; null when too small to use. */
export function boxBetween(start, end) {
  const box = {
    x: round(Math.min(start.x, end.x)),
    y: round(Math.min(start.y, end.y)),
    width: round(Math.abs(end.x - start.x)),
    height: round(Math.abs(end.y - start.y))
  };
  return box.width >= MIN_BOX_SIZE && box.height >= MIN_BOX_SIZE ? box : null;
}

export function createPlacementEditor(container, onPlaced, onCancel = () => {}) {
  if (!(container instanceof Element)) throw new TypeError('A game preview container is required for drawing');
  if (typeof onPlaced !== 'function') throw new TypeError('A placement callback is required');

  const overlay = document.createElementNS(SVG_NAMESPACE, 'svg');
  overlay.classList.add('ocs__gamebuilder-placement-overlay');
  overlay.setAttribute('viewBox', '0 0 1000 1000');
  overlay.setAttribute('preserveAspectRatio', 'none');
  overlay.setAttribute('aria-hidden', 'true');

  let shape = null;
  let existing = [];
  let dragStart = null;
  let dragEnd = null;

  function svg(name, attributes) {
    const element = document.createElementNS(SVG_NAMESPACE, name);
    for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, String(value));
    return element;
  }

  function boxElement(box, className) {
    const rect = svg('rect', { x: box.x * 1000, y: box.y * 1000, width: box.width * 1000, height: box.height * 1000 });
    rect.classList.add(className);
    return rect;
  }

  function draw() {
    overlay.replaceChildren();
    overlay.classList.toggle('is-active', Boolean(shape));
    if (!shape) return;
    for (const item of existing) {
      if (Number.isFinite(item.width)) {
        overlay.append(boxElement(item, 'ocs__gamebuilder-placement-existing'));
      } else {
        const dot = svg('circle', { cx: item.x * 1000, cy: item.y * 1000, r: 10 });
        dot.classList.add('ocs__gamebuilder-placement-existing');
        overlay.append(dot);
      }
    }
    if (dragStart && dragEnd) {
      const preview = {
        x: Math.min(dragStart.x, dragEnd.x),
        y: Math.min(dragStart.y, dragEnd.y),
        width: Math.abs(dragEnd.x - dragStart.x),
        height: Math.abs(dragEnd.y - dragStart.y)
      };
      overlay.append(boxElement(preview, 'ocs__gamebuilder-placement-draft'));
    }
  }

  function pointFrom(event) {
    return normalizeCanvasPoint(event.clientX, event.clientY, overlay.getBoundingClientRect());
  }

  function finish(result) {
    shape = null;
    dragStart = null;
    dragEnd = null;
    draw();
    onPlaced(result);
  }

  function cancel() {
    if (!shape) return;
    shape = null;
    dragStart = null;
    dragEnd = null;
    draw();
    onCancel();
  }

  overlay.addEventListener('pointerdown', (event) => {
    if (!shape) return;
    event.preventDefault();
    event.stopPropagation();
    if (shape === 'point') {
      const point = pointFrom(event);
      finish({ x: round(point.x), y: round(point.y) });
      return;
    }
    dragStart = pointFrom(event);
    dragEnd = dragStart;
    overlay.setPointerCapture?.(event.pointerId);
    draw();
  });

  overlay.addEventListener('pointermove', (event) => {
    if (shape !== 'box' || !dragStart) return;
    dragEnd = pointFrom(event);
    draw();
  });

  overlay.addEventListener('pointerup', (event) => {
    if (shape !== 'box' || !dragStart) return;
    event.stopPropagation();
    const box = boxBetween(dragStart, pointFrom(event));
    dragStart = null;
    dragEnd = null;
    // A click or a tiny drag keeps the drawing open so the next drag can work.
    if (box) finish(box);
    else draw();
  });

  // Clicks must not reach the game while drawing.
  overlay.addEventListener('click', (event) => {
    if (shape) event.stopPropagation();
  });

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') cancel();
  };
  document.addEventListener('keydown', handleKeyDown);

  container.append(overlay);

  return Object.freeze({
    start(nextShape, nextExisting = []) {
      if (!SHAPES.includes(nextShape)) throw new RangeError(`Unknown drawing shape "${nextShape}"`);
      shape = nextShape;
      existing = nextExisting;
      dragStart = null;
      dragEnd = null;
      draw();
    },
    cancel,
    get isActive() {
      return Boolean(shape);
    },
    destroy() {
      document.removeEventListener('keydown', handleKeyDown);
      overlay.remove();
    }
  });
}
