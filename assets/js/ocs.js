/**
 * OCS Design System -- behaviour layer
 * =============================================================================
 * Zero dependencies. Progressive enhancement: every component styled by
 * _sass/ocs works without this file; this adds keyboard semantics and the
 * behaviours CSS cannot express.
 *
 *   <script src="/assets/js/ocs.js" defer><\/script>
 * (the closing tag is escaped above so this file stays safe to inline)
 *
 * Everything is namespaced under window.OCS and initialises on DOMContentLoaded.
 * Call OCS.init(root) again after injecting markup dynamically -- it is
 * idempotent and will not double-bind.
 * =============================================================================
 */
(function (window, document) {
  'use strict';

  var BOUND = 'ocsBound';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function once(el, key) {
    if (el.dataset[BOUND + key]) return false;
    el.dataset[BOUND + key] = '1';
    return true;
  }

  // ===========================================================================
  // TABS -- roving tabindex + arrow-key navigation (WAI-ARIA tabs pattern)
  // ===========================================================================
  // Markup:
  //   <div class="ocs-tabs" role="tablist">
  //     <button class="ocs-tabs__tab" role="tab" aria-selected="true"
  //             aria-controls="panel-1" id="tab-1">Usage</button>
  //   </div>
  //   <div id="panel-1" role="tabpanel" aria-labelledby="tab-1">...</div>
  function initTabs(root) {
    root.querySelectorAll('[role="tablist"]').forEach(function (list) {
      if (!once(list, 'Tabs')) return;

      var tabs = function () {
        return Array.prototype.slice.call(
          list.querySelectorAll('[role="tab"]:not([disabled])')
        );
      };

      function select(tab, focus) {
        // Normalise EVERY tab, disabled ones included. Iterating only the
        // enabled set left a previously-selected tab that has since been
        // disabled holding a stale tabIndex=0.
        Array.prototype.forEach.call(
          list.querySelectorAll('[role="tab"]'),
          function (t) {
            if (t.disabled || t.getAttribute('aria-disabled') === 'true') {
              t.tabIndex = -1;
              t.setAttribute('aria-selected', 'false');
            }
          }
        );

        tabs().forEach(function (t) {
          var on = t === tab;
          t.setAttribute('aria-selected', on ? 'true' : 'false');
          // Roving tabindex: only the selected tab is in the tab order.
          t.tabIndex = on ? 0 : -1;
          var panelId = t.getAttribute('aria-controls');
          if (panelId) {
            var panel = document.getElementById(panelId);
            if (panel) panel.hidden = !on;
          }
        });
        if (focus) tab.focus();
        list.dispatchEvent(
          new CustomEvent('ocs:tabchange', { bubbles: true, detail: { tab: tab } })
        );
      }

      // Establish the initial roving state. The `:not([disabled])` matters: a
      // tablist whose selected tab is ALSO disabled would otherwise put the
      // only tabIndex=0 on an unfocusable element and drive every enabled tab
      // to -1, leaving zero keyboard-reachable tabs (WCAG 2.1.1).
      var current = list.querySelector('[role="tab"][aria-selected="true"]:not([disabled])')
                 || tabs()[0];
      if (current) select(current, false);

      list.addEventListener('click', function (e) {
        var tab = e.target.closest('[role="tab"]');
        // Ignore clicks on disabled tabs -- tabs() excludes them, so selecting
        // one would produce the same zero-focusable-tabs state.
        if (tab && list.contains(tab) && tabs().indexOf(tab) !== -1) {
          select(tab, false);
        }
      });

      list.addEventListener('keydown', function (e) {
        var items = tabs();
        var i = items.indexOf(document.activeElement);
        if (i === -1) return;

        var vertical = list.getAttribute('aria-orientation') === 'vertical';
        var next = vertical ? 'ArrowDown' : 'ArrowRight';
        var prev = vertical ? 'ArrowUp' : 'ArrowLeft';
        var target = null;

        if (e.key === next) target = items[(i + 1) % items.length];
        else if (e.key === prev) target = items[(i - 1 + items.length) % items.length];
        else if (e.key === 'Home') target = items[0];
        else if (e.key === 'End') target = items[items.length - 1];

        if (target) {
          e.preventDefault();
          select(target, true);
        }
      });
    });
  }

  // ===========================================================================
  // MODALS -- open/close via data attributes, on top of native <dialog>
  // ===========================================================================
  //   <button data-ocs-open="confirm">Delete</button>
  //   <dialog class="ocs-modal" id="confirm">...</dialog>
  // <dialog> support: Chrome 37+, Firefox 98+, Safari 15.4+. The fallback path
  // below is non-modal -- no focus trap, no inerting -- but it must at least be
  // CLOSABLE. Calling dlg.close() unguarded threw a TypeError there and left an
  // un-dismissable overlay on screen.
  function closeDialog(dlg, value) {
    if (!dlg) return;
    if (typeof dlg.close === 'function') dlg.close(value);
    else dlg.removeAttribute('open');

    // WCAG 2.4.3: return focus to whatever opened it. The native modal path
    // does this for us; the fallback path does not, and neither does a dialog
    // opened programmatically.
    var opener = dlg.__ocsOpener;
    if (opener && document.contains(opener) && typeof opener.focus === 'function') {
      opener.focus();
    }
    dlg.__ocsOpener = null;
  }

  function initModals(root) {
    root.querySelectorAll('[data-ocs-open]').forEach(function (btn) {
      if (!once(btn, 'Open')) return;
      btn.addEventListener('click', function () {
        var dlg = document.getElementById(btn.getAttribute('data-ocs-open'));
        if (!dlg) return;
        // Remember the trigger so focus can be restored on close.
        dlg.__ocsOpener = btn;
        // showModal(), not the `open` attribute -- `open` renders non-modally
        // and skips the browser's focus trap.
        if (typeof dlg.showModal === 'function') dlg.showModal();
        else {
          dlg.setAttribute('open', '');
          // The fallback gets no automatic focus move; do it by hand so the
          // dialog is at least reachable.
          var first = dlg.querySelector('button, [href], input, select, textarea');
          if (first) first.focus();
        }
      });
    });

    root.querySelectorAll('[data-ocs-close]').forEach(function (btn) {
      if (!once(btn, 'Close')) return;
      btn.addEventListener('click', function () {
        closeDialog(btn.closest('dialog'), 'cancel');
      });
    });

    // Click the backdrop to dismiss. The dialog element's own box is the only
    // thing painted, so a click whose coordinates fall outside it is a
    // backdrop click.
    root.querySelectorAll('dialog.ocs-modal').forEach(function (dlg) {
      if (!once(dlg, 'Backdrop')) return;

      // Escape and <form method="dialog"> close natively. On browsers with real
      // <dialog> support showModal() already restores focus to the previously
      // focused element, so this listener is belt-and-braces there; it is the
      // ONLY thing that restores focus on the setAttribute('open') fallback
      // path, which has no native behaviour at all.
      dlg.addEventListener('close', function () {
        var opener = dlg.__ocsOpener;
        if (opener && document.contains(opener) && typeof opener.focus === 'function') {
          opener.focus();
        }
        dlg.__ocsOpener = null;
      });

      dlg.addEventListener('click', function (e) {
        if (e.target !== dlg) return;
        var r = dlg.getBoundingClientRect();
        var outside =
          e.clientX < r.left || e.clientX > r.right ||
          e.clientY < r.top || e.clientY > r.bottom;
        if (outside) closeDialog(dlg, 'dismiss');
      });
    });
  }

  // ===========================================================================
  // MENUS -- roving focus, arrow keys, type-ahead (WAI-ARIA menu pattern)
  // ===========================================================================
  //   <button popovertarget="m1">Actions</button>
  //   <div class="ocs-menu" id="m1" popover role="menu">
  //     <button class="ocs-menu__item" role="menuitem">Rename</button>
  //   </div>
  // The popover API landed in Safari 17 / Chrome 114 / Firefox 125. Calling
  // hidePopover() unguarded threw a TypeError on anything older, which left the
  // menu permanently open. The file already guards showModal() the same way.
  function closeMenu(menu) {
    if (typeof menu.hidePopover === 'function' && menu.matches(':popover-open')) {
      menu.hidePopover();
    } else {
      menu.removeAttribute('data-ocs-open');
      menu.style.display = 'none';
    }
  }

  // CSS anchor positioning resolves a shared anchor-name to the LAST element in
  // tree order that carries it, so one global name puts every menu under the last
  // trigger. Give each trigger/menu pair its own name instead.
  function linkAnchor(menu) {
    if (!menu.id) return;
    if (!(CSS && CSS.supports && CSS.supports('anchor-name', '--a'))) return;
    var name = '--ocs-anchor-' + menu.id.replace(/[^A-Za-z0-9_-]/g, '-');
    var triggers = document.querySelectorAll('[popovertarget="' + CSS.escape(menu.id) + '"]');
    if (!triggers.length) return;
    triggers.forEach(function (t) { t.style.setProperty('anchor-name', name); });
    menu.style.setProperty('position-anchor', name);
  }

  // Without the popover API the popovertarget attribute is inert, so the trigger
  // does nothing at all. Wire a click fallback that toggles [data-ocs-open],
  // which the stylesheet uses when :popover-open is unavailable.
  function legacyToggle(menu) {
    if (typeof menu.showPopover === 'function') return;
    document.querySelectorAll('[popovertarget="' + CSS.escape(menu.id) + '"]').forEach(function (t) {
      if (!once(t, 'MenuTrigger')) return;
      t.setAttribute('aria-haspopup', 'menu');
      t.setAttribute('aria-expanded', 'false');
      t.addEventListener('click', function (e) {
        e.preventDefault();
        var open = menu.hasAttribute('data-ocs-open');
        if (open) {
          closeMenu(menu);
        } else {
          menu.setAttribute('data-ocs-open', '');
          menu.style.display = '';
          var first = menu.querySelector('[role="menuitem"]:not(:disabled)');
          if (first) first.focus();
        }
        t.setAttribute('aria-expanded', String(!open));
      });
    });
  }

  function initMenus(root) {
    root.querySelectorAll('.ocs-menu[role="menu"]').forEach(function (menu) {
      if (!once(menu, 'Menu')) return;
      linkAnchor(menu);
      legacyToggle(menu);

      var typed = '';
      var typedAt = 0;

      function items() {
        return Array.prototype.slice.call(
          menu.querySelectorAll('[role="menuitem"]:not(:disabled):not([aria-disabled="true"])')
        );
      }

      function focusAt(i) {
        var list = items();
        if (!list.length) return;
        // Wrap in both directions.
        var idx = ((i % list.length) + list.length) % list.length;
        list[idx].focus();
      }

      // Opening should land focus on the first item, not leave it on the
      // trigger -- otherwise the arrow keys have nothing to move from.
      menu.addEventListener('toggle', function (e) {
        if (e.newState !== 'open') return;
        typed = '';
        // The toggle event fires after the popover is already shown, so the
        // items are focusable now. Do NOT defer with requestAnimationFrame --
        // rAF is paused in a hidden tab, which would strand focus on the
        // trigger and leave the arrow keys with nothing to move from.
        focusAt(0);
      });

      menu.addEventListener('keydown', function (e) {
        var list = items();
        var i = list.indexOf(document.activeElement);

        if (e.key === 'ArrowDown')      { e.preventDefault(); focusAt(i + 1); }
        else if (e.key === 'ArrowUp')   { e.preventDefault(); focusAt(i - 1); }
        else if (e.key === 'Home')      { e.preventDefault(); focusAt(0); }
        else if (e.key === 'End')       { e.preventDefault(); focusAt(list.length - 1); }
        else if (e.key === 'Tab')       { closeMenu(menu); }
        // The popover API light-dismisses on Escape, but the fallback path has no
        // UA behaviour to rely on, and the ARIA menu pattern wants focus back on
        // the trigger either way. Do not preventDefault, so native dismissal still
        // runs where it exists; closeMenu() is a no-op if the UA got there first.
        else if (e.key === 'Escape') {
          closeMenu(menu);
          var opener = document.querySelector('[popovertarget="' + CSS.escape(menu.id) + '"]');
          if (opener) opener.focus();
        }
        else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
          // Type-ahead: keystrokes within 700ms accumulate into a prefix.
          var now = Date.now();
          typed = (now - typedAt < 700) ? typed + e.key : e.key;
          typedAt = now;
          var match = list.findIndex(function (el) {
            return el.textContent.trim().toLowerCase().indexOf(typed.toLowerCase()) === 0;
          });
          if (match > -1) { e.preventDefault(); focusAt(match); }
        }
      });

      // Activating an item closes the menu, as a menu is a command surface.
      menu.addEventListener('click', function (e) {
        if (e.target.closest('[role="menuitem"]')) closeMenu(menu);
      });
    });
  }

  // ===========================================================================
  // TOASTS
  // ===========================================================================
  // WCAG 2.2.1 (Timing Adjustable): an auto-dismissing message must be
  // pausable. The timer stops while the pointer is over the toast or focus is
  // inside it, and resumes on leave.
  var ICONS = {
    success: 'M3 8.5 6.5 12 13 4.5',
    info: 'M8 7.2v4M8 4.9v.9',
    warning: 'M8 6.6v3M8 11.4v.7',
    danger: 'M8 6.6v3M8 11.4v.7'
  };

  function region() {
    var el = document.querySelector('.ocs-toast-region');
    if (!el) {
      el = document.createElement('div');
      el.className = 'ocs-toast-region';
      el.setAttribute('role', 'region');
      el.setAttribute('aria-label', 'Notifications');
      document.body.appendChild(el);
    }
    return el;
  }

  function toast(opts) {
    opts = opts || {};
    var variant = opts.variant || 'info';
    var duration = opts.duration == null ? 5000 : opts.duration;

    var el = document.createElement('div');
    el.className = 'ocs-toast ocs-toast--' + variant;
    // Failures interrupt; everything else waits its turn.
    el.setAttribute('role', variant === 'danger' ? 'alert' : 'status');

    var svg =
      '<svg class="ocs-toast__icon" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">' +
      (variant === 'warning' || variant === 'danger'
        ? '<path d="M8 2.5 14.5 13.5h-13z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>'
        : variant === 'info'
        ? '<circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" stroke-width="1.4"/>'
        : '') +
      '<path d="' + (ICONS[variant] || ICONS.info) +
      '" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    el.innerHTML =
      svg +
      '<div class="ocs-toast__content">' +
      (opts.title ? '<p class="ocs-toast__title"></p>' : '') +
      '<p></p></div>' +
      '<button class="ocs-toast__close" aria-label="Dismiss">' +
      '<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">' +
      '<path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></button>';

    // textContent, never innerHTML -- toast copy can contain user data.
    if (opts.title) el.querySelector('.ocs-toast__title').textContent = opts.title;
    el.querySelector('.ocs-toast__content p:last-child').textContent = opts.message || '';

    region().appendChild(el);

    var timer = null;
    var remaining = duration;
    var startedAt = 0;

    function dismiss() {
      clearTimeout(timer);
      if (reduceMotion.matches) {
        el.remove();
        return;
      }
      el.style.transition = 'opacity 150ms, transform 150ms';
      el.style.opacity = '0';
      el.style.transform = 'translateX(12px)';
      setTimeout(function () { el.remove(); }, 160);
    }

    function resume() {
      // A duration of 0 means "persistent -- caller dismisses it". Without this
      // guard the `remaining <= 0` branch below reads 0 as "budget spent" and
      // destroys the toast on the first mouseleave or focusout.
      if (duration <= 0) return;

      // If the budget is already spent, go now. Returning early here would
      // strand the toast on screen forever -- which is exactly what happens
      // when a background tab throttles timers to ~1s and the pause lands
      // after the nominal duration has already elapsed.
      if (remaining <= 0) {
        dismiss();
        return;
      }
      startedAt = Date.now();
      timer = setTimeout(dismiss, remaining);
    }

    function pause() {
      if (!timer) return;
      clearTimeout(timer);
      timer = null;
      // Clamped: a long task or a throttled tab can make the elapsed time
      // exceed the remaining budget and drive this negative.
      remaining = Math.max(0, remaining - (Date.now() - startedAt));
    }

    el.querySelector('.ocs-toast__close').addEventListener('click', dismiss);
    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', resume);
    el.addEventListener('focusin', pause);
    el.addEventListener('focusout', resume);

    if (duration > 0) resume();
    return { element: el, dismiss: dismiss };
  }

  // ===========================================================================
  // SWITCH -- keep aria-checked in step for role="switch"
  // ===========================================================================
  // A native checkbox already exposes its state, but role="switch" overrides
  // that mapping and expects aria-checked instead.
  function initSwitches(root) {
    root.querySelectorAll('.ocs-switch input[role="switch"]').forEach(function (input) {
      if (!once(input, 'Switch')) return;
      var sync = function () {
        input.setAttribute('aria-checked', input.checked ? 'true' : 'false');
      };
      sync();
      input.addEventListener('change', sync);
    });
  }

  // ===========================================================================
  // TABLE SCROLL REGIONS -- only focusable when actually scrollable
  // ===========================================================================
  // A tabindex="0" on a region that does not scroll adds a dead tab stop.
  function initScrollRegions(root) {
    root.querySelectorAll('.ocs-table-wrap').forEach(function (wrap) {
      var update = function () {
        var scrollable = wrap.scrollWidth > wrap.clientWidth + 1;
        if (scrollable) wrap.setAttribute('tabindex', '0');
        else wrap.removeAttribute('tabindex');
      };

      // Always re-evaluate, even on a repeat init.
      update();
      if (!once(wrap, 'Scroll')) return;

      if (window.ResizeObserver) {
        var ro = new ResizeObserver(update);
        // Observe the wrapper AND its content. scrollWidth can change without
        // the wrapper's own box changing at all -- rows appended by script, or
        // a webfont swapping in and re-measuring the columns. Observing only
        // the wrapper misses both.
        ro.observe(wrap);
        if (wrap.firstElementChild) ro.observe(wrap.firstElementChild);
      }

      // Belt and braces. ResizeObserver callbacks are throttled or dropped
      // entirely while a tab is backgrounded, which leaves the region without
      // its tab stop -- i.e. unreachable by keyboard -- once the tab returns.
      window.addEventListener('resize', update);

      // Font loading changes text metrics after first paint.
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(update).catch(function () {});
      }

      // A final pass once everything has settled.
      window.addEventListener('load', update);
    });
  }

  // ===========================================================================
  function init(root) {
    root = root || document;
    initTabs(root);
    initMenus(root);
    initModals(root);
    initSwitches(root);
    initScrollRegions(root);
  }

  window.OCS = { init: init, toast: toast, version: '0.1.0' };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init(document); });
  } else {
    init(document);
  }
})(window, document);
