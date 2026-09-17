/* Behaviour for the submissions dashboard: tabs, modals, switches.
   Trimmed to the three the page uses. */
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
  //   <div class="subm-tabs" role="tablist">
  //     <button class="subm-tabs__tab" role="tab" aria-selected="true"
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
  //   <button data-subm-open="confirm">Delete</button>
  //   <dialog class="subm-modal" id="confirm">...</dialog>
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
    root.querySelectorAll('[data-subm-open]').forEach(function (btn) {
      if (!once(btn, 'Open')) return;
      btn.addEventListener('click', function () {
        var dlg = document.getElementById(btn.getAttribute('data-subm-open'));
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

    root.querySelectorAll('[data-subm-close]').forEach(function (btn) {
      if (!once(btn, 'Close')) return;
      btn.addEventListener('click', function () {
        closeDialog(btn.closest('dialog'), 'cancel');
      });
    });

    // Click the backdrop to dismiss. The dialog element's own box is the only
    // thing painted, so a click whose coordinates fall outside it is a
    // backdrop click.
    root.querySelectorAll('dialog.subm-modal').forEach(function (dlg) {
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


  // CSS anchor positioning resolves a shared anchor-name to the LAST element in
  // tree order that carries it, so one global name puts every menu under the last
  // trigger. Give each trigger/menu pair its own name instead.

  // Without the popover API the popovertarget attribute is inert, so the trigger
  // does nothing at all. Wire a click fallback that toggles [data-subm-open],
  // which the stylesheet uses when :popover-open is unavailable.




  // ===========================================================================
  // SWITCH -- keep aria-checked in step for role="switch"
  // ===========================================================================
  // A native checkbox already exposes its state, but role="switch" overrides
  // that mapping and expects aria-checked instead.
  function initSwitches(root) {
    root.querySelectorAll('.subm-switch input[role="switch"]').forEach(function (input) {
      if (!once(input, 'Switch')) return;
      var sync = function () {
        input.setAttribute('aria-checked', input.checked ? 'true' : 'false');
      };
      sync();
      input.addEventListener('change', sync);
    });
  }


  // ===========================================================================
  function init(root) {
    root = root || document;
    initTabs(root);
    initModals(root);
    initSwitches(root);
  }

  window.OCS = { init: init, version: '0.1.0' };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init(document); });
  } else {
    init(document);
  }
})(window, document);
