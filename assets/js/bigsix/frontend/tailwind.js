// ============================================================
//  tailwind.js — Single Responsibility: Tailwind preview
//  Path: assets/js/bigsix/frontend/tailwind.js
//
//  Owns everything related to the Tailwind step:
//    - Mapping Tailwind class names to real CSS values
//    - Applying those values to the preview element
//    - Generating and displaying the class string
//
//  EXPORTS:
//    initTailwind()  — call once on DOMContentLoaded
// ============================================================

// ── Tailwind class → CSS value maps ──────────────────────────
// These mirror the Tailwind default theme values so the preview
// works without importing the full Tailwind CSS file.

const COLOR_MAP = {
    'bg-blue-600 text-white':    { bg: '#2563eb', color: 'white' },
    'bg-purple-600 text-white':  { bg: '#9333ea', color: 'white' },
    'bg-emerald-600 text-white': { bg: '#059669', color: 'white' },
    'bg-rose-600 text-white':    { bg: '#e11d48', color: 'white' },
    'bg-amber-400 text-black':   { bg: '#f59e0b', color: 'black' },
    'bg-slate-800 text-white':   { bg: '#1e293b', color: 'white' },
  };
  
  const PADDING_MAP = {
    'p-2': '8px',
    'p-4': '16px',
    'p-6': '24px',
    'p-8': '32px',
  };
  
  const RADIUS_MAP = {
    'rounded-none': '0',
    'rounded':      '4px',
    'rounded-lg':   '8px',
    'rounded-2xl':  '16px',
    'rounded-full': '9999px',
  };
  
  const SHADOW_MAP = {
    '':           'none',
    'shadow-sm':  '0 1px 2px rgba(0,0,0,0.2)',
    'shadow-md':  '0 4px 6px rgba(0,0,0,0.3)',
    'shadow-xl':  '0 20px 25px rgba(0,0,0,0.4)',
    'shadow-2xl': '0 25px 50px rgba(0,0,0,0.5)',
  };
  
  
  // ============================================================
  //  WORKER 1 — buildStyles
  //  Single responsibility: convert Tailwind class selections into
  //  a plain CSS object. Pure function — no DOM access.
  // ============================================================
  
  /**
   * Convert selected Tailwind class names into a CSS style object.
   *
   * @param {string} padding - Padding class (e.g. 'p-4')
   * @param {string} color   - Color class (e.g. 'bg-blue-600 text-white')
   * @param {string} radius  - Border radius class (e.g. 'rounded-lg')
   * @param {string} shadow  - Shadow class (e.g. 'shadow-md')
   * @returns {object}       - CSS property/value pairs
   */
  function buildStyles(padding, color, radius, shadow) {
    const colorVal = COLOR_MAP[color] || { bg: '#2563eb', color: 'white' };
    return {
      padding:      PADDING_MAP[padding]  || '16px',
      background:   colorVal.bg,
      color:        colorVal.color,
      borderRadius: RADIUS_MAP[radius]    || '8px',
      boxShadow:    SHADOW_MAP[shadow]    || 'none',
    };
  }
  
  
  // ============================================================
  //  WORKER 2 — applyStylesToElement
  //  Single responsibility: write a style object onto a DOM element.
  // ============================================================
  
  /**
   * Apply a CSS style object to a DOM element.
   *
   * @param {HTMLElement} el     - Target element
   * @param {object}      styles - CSS property/value pairs
   */
  function applyStylesToElement(el, styles) {
    Object.assign(el.style, styles);
  }
  
  
  // ============================================================
  //  WORKER 3 — buildClassString
  //  Single responsibility: generate the HTML snippet showing the
  //  combined class string. Pure function — no DOM access.
  // ============================================================
  
  /**
   * Build the HTML snippet for the class display code block.
   *
   * @param {string[]} classes - Array of Tailwind class strings
   * @returns {string}         - Formatted HTML snippet
   */
  function buildClassString(classes) {
    const combined = classes.filter(Boolean).join(' ');
    return `<div class="${combined}">\n  Tailwind Card\n</div>`;
  }
  
  
  // ============================================================
  //  ORCHESTRATOR — applyTailwind (internal)
  //  Reads current dropdown values, delegates to workers, updates DOM.
  // ============================================================
  function applyTailwind() {
    const padding = document.getElementById('twPadding').value;
    const color   = document.getElementById('twColor').value;
    const radius  = document.getElementById('twRadius').value;
    const shadow  = document.getElementById('twShadow').value;
  
    // Apply styles to the preview element
    const styles  = buildStyles(padding, color, radius, shadow);
    applyStylesToElement(document.getElementById('twPreview'), styles);
  
    // Update the class string display
    document.getElementById('twClassDisplay').textContent =
      buildClassString([padding, color, radius, shadow]);
  }
  
  
  // ============================================================
  //  ORCHESTRATOR — initTailwind
  //  Wires all four dropdowns to applyTailwind and runs initial render.
  //  Called once on DOMContentLoaded from frontend_lesson.md.
  // ============================================================
  
  /**
   * Initialise the Tailwind preview section.
   * Call once on DOMContentLoaded.
   */
  export function initTailwind() {
    // Wire all four dropdowns — each calls applyTailwind on change
    ['twPadding', 'twColor', 'twRadius', 'twShadow'].forEach(id => {
      document.getElementById(id).addEventListener('change', applyTailwind);
    });
  
    // Render initial state from the default selected values
    applyTailwind();
  }