// Redraws something on the next animation frame after its width changes. The week calendar
// (mountWeekView in calendar-feed.js) uses it to switch between its wide and narrow tables, and
// the Coming up ticker (calendar-ticker.js) to check again whether its announcements fit.

/**
 * Watches an element's width and calls `redraw` on the next animation frame after it changes.
 * A redraw inside the ResizeObserver callback would change the element's own size while the
 * observer is still reporting sizes. The browser may then be unable to report the new size in the
 * same frame, and it fires an error event, "ResizeObserver loop completed with undelivered
 * notifications", which Safari shows in its console. A redraw in the next animation frame runs
 * before the observer reports, so the new size is reported normally.
 */
export class WidthWatcher {
  /**
   * @param {Element} element - the element whose width to watch
   * @param {() => void} redraw - called once the new width is laid out
   */
  constructor(element, redraw) {
    this.element = element;
    this.redraw = redraw;
    this.width = element.clientWidth;
    this.frame = 0;
    this.observer = typeof ResizeObserver === 'function' ? new ResizeObserver(() => this.check()) : null;
    this.observer?.observe(element);
  }

  /**
   * The observer's callback. A new width asks for one redraw on the next frame. A report with the
   * same width (the first one, or one for a height a redraw changed) does nothing.
   */
  check() {
    if (this.element.clientWidth === this.width) return;
    this.width = this.element.clientWidth;
    if (this.frame) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      this.redraw();
    });
  }

  /** Stop watching, and drop a redraw that hasn't run yet. */
  stop() {
    this.observer?.disconnect();
    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = 0;
  }
}
