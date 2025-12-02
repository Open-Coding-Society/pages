// Global site-wide theme preferences extracted from dashboard.html
// Applies user-selected colors, fonts, and sizing across all pages.
(function () {
  const PRESETS = {
    Midnight: {
      bg: '#0b1220',
      text: '#e6eef8',
      font:
        "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      size: 14,
      width: 1200,
    },
    Light: {
      bg: '#ffffff',
      text: '#0f172a',
      font:
        "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      size: 14,
      width: 1200,
    },
    Green: {
      bg: '#154734',
      text: '#e6f6ef',
      font:
        "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      size: 14,
      width: 1200,
    },
    Sepia: {
      bg: '#f4ecd8',
      text: '#3b2f2f',
      font: "Georgia, 'Times New Roman', Times, serif",
      size: 14,
      width: 1200,
    },
  };

  const storageKey = 'sitePreferences';

  function hexToRgb(hex) {
    if (!hex) return { r: 0, g: 0, b: 0 };
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  }

  function lightenDarken(hex, amt) {
    const { r, g, b } = hexToRgb(hex);
    const clamp = (v) => Math.max(0, Math.min(255, v));
    const nr = clamp(r + amt);
    const ng = clamp(g + amt);
    const nb = clamp(b + amt);
    return (
      '#' +
      [nr, ng, nb]
        .map((v) => {
          const h = v.toString(16);
          return h.length === 1 ? '0' + h : h;
        })
        .join('')
    );
  }

  function applyPreferences(prefs) {
    const base = PRESETS.Midnight;
    const bg = prefs?.bg || base.bg;
    const text = prefs?.text || base.text;
    const font = prefs?.font || base.font;
    const size = prefs?.size || base.size;
    const width = prefs?.width || base.width;

    const root = document.documentElement;
    root.style.setProperty('--pref-bg-color', bg);
    root.style.setProperty('--pref-text-color', text);
    root.style.setProperty('--pref-font-family', font);
    root.style.setProperty('--pref-font-size', size + 'px');
    root.style.setProperty('--pref-content-max-width', width + 'px');

    // Map to global semantic vars used by SASS/minima/etc.
    const set = (name, value) => root.style.setProperty(name, value);
    set('--background', bg);
    set('--bg-0', bg);
    set('--bg-1', lightenDarken(bg, 8));
    set('--bg-2', lightenDarken(bg, 16));
    set('--bg-3', lightenDarken(bg, 24));
    set('--text', text);
    set('--text-strong', lightenDarken(text, 16));
    set('--white1', text);

  // Panels should be noticeably lighter than the page background
  const panel = lightenDarken(bg, 35);
  const panelMid = lightenDarken(bg, 45);
  const uiBg = lightenDarken(bg, 28);
  const uiBorder = lightenDarken(bg, 40);

    set('--panel', panel);
    set('--panel-mid', panelMid);
    set('--ui-bg', uiBg);
    set('--ui-border', uiBorder);

    // Turn on the high-priority theme class on <html> so global CSS rules
    // can override other themes consistently (Minima, Tailwind, etc.).
    document.documentElement.classList.add('user-theme-active');
  }

  function resetPreferences() {
    const root = document.documentElement;
    // Remove the active theme class so base theme CSS takes over again
    root.classList.remove('user-theme-active');

    // Clear custom properties we set so original CSS variables/values win
    const props = [
      '--pref-bg-color',
      '--pref-text-color',
      '--pref-font-family',
      '--pref-font-size',
      '--pref-content-max-width',
      '--background',
      '--bg-0',
      '--bg-1',
      '--bg-2',
      '--bg-3',
      '--text',
      '--text-strong',
      '--white1',
      '--panel',
      '--panel-mid',
      '--ui-bg',
      '--ui-border',
    ];

    props.forEach((name) => root.style.removeProperty(name));
  }

  function loadStoredPreferences() {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.error('Error loading stored preferences', e);
      return null;
    }
  }

  function init() {
    if (typeof window === 'undefined') return;
    const prefs = loadStoredPreferences();
    if (prefs) {
      applyPreferences(prefs);
    }
  }

  // Expose helpers for dashboard.html to reuse
  window.SitePreferences = {
    applyPreferences,
    resetPreferences,
    PRESETS,
  };

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
