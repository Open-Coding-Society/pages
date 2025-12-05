// Global site-wide theme preferences
// Applies user-selected colors, fonts, and sizing across all pages.
(function () {
  const PRESETS = {
    Midnight: {
      bg: '#0b1220',
      text: '#e6eef8',
      font: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      size: 14,
      accent: '#3b82f6',
    },
    Light: {
      bg: '#ffffff',
      text: '#0f172a',
      font: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      size: 14,
      accent: '#2563eb',
    },
    Green: {
      bg: '#154734',
      text: '#e6f6ef',
      font: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      size: 14,
      accent: '#10b981',
    },
    Sepia: {
      bg: '#f4ecd8',
      text: '#3b2f2f',
      font: "Georgia, 'Times New Roman', Times, serif",
      size: 14,
      accent: '#b45309',
    },
    Cyberpunk: {
      bg: '#0a0a0f',
      text: '#f0f0f0',
      font: "'Source Code Pro', monospace",
      size: 14,
      accent: '#f72585',
    },
    Ocean: {
      bg: '#0c1929',
      text: '#e0f2fe',
      font: "'Open Sans', Arial, sans-serif",
      size: 15,
      accent: '#06b6d4',
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

  function getLuminance(hex) {
    const { r, g, b } = hexToRgb(hex);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  }

  function isLightColor(hex) {
    return getLuminance(hex) > 0.5;
  }

  function adjustColor(hex, amt) {
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
    const accent = prefs?.accent || base.accent;

    const root = document.documentElement;
    root.style.setProperty('--pref-bg-color', bg);
    root.style.setProperty('--pref-text-color', text);
    root.style.setProperty('--pref-font-family', font);
    root.style.setProperty('--pref-font-size', size + 'px');
    root.style.setProperty('--pref-accent-color', accent);

    const set = (name, value) => root.style.setProperty(name, value);
    
    // Determine if background is light or dark
    const lightBg = isLightColor(bg);
    const dir = lightBg ? -1 : 1; // Darken for light bg, lighten for dark bg

    set('--background', bg);
    set('--bg-0', bg);
    set('--bg-1', adjustColor(bg, 8 * dir));
    set('--bg-2', adjustColor(bg, 16 * dir));
    set('--bg-3', adjustColor(bg, 24 * dir));
    set('--text', text);
    set('--text-strong', adjustColor(text, lightBg ? -20 : 20));
    set('--white1', text);

    // Panels contrast with background
    const panel = adjustColor(bg, 25 * dir);
    const panelMid = adjustColor(bg, 35 * dir);
    const uiBg = adjustColor(bg, 20 * dir);
    const uiBorder = adjustColor(bg, 45 * dir);

    set('--panel', panel);
    set('--panel-mid', panelMid);
    set('--ui-bg', uiBg);
    set('--ui-border', uiBorder);
    
    // Text colors that work on panels
    const textMuted = adjustColor(text, lightBg ? 40 : -40);
    set('--text-muted', textMuted);

    // Turn on the high-priority theme class on <html> so global CSS rules
    // can override other themes consistently (Minima, Tailwind, etc.).
    document.documentElement.classList.add('user-theme-active');
  }

  function resetPreferences() {
    const root = document.documentElement;
    root.classList.remove('user-theme-active');

    const props = [
      '--pref-bg-color',
      '--pref-text-color',
      '--pref-font-family',
      '--pref-font-size',
      '--pref-accent-color',
      '--background',
      '--bg-0',
      '--bg-1',
      '--bg-2',
      '--bg-3',
      '--text',
      '--text-strong',
      '--text-muted',
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
