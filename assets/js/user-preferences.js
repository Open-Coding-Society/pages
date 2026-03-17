/**
 * User Preferences System — Refactored with Single Responsibility Principle (SRP)
 *
 * Architecture:
 *   1. ConfigManager    — Constants, presets, and site defaults (data only)
 *   2. ColorUtils       — Pure color math functions (hex->rgb, luminance, adjust)
 *   3. StorageManager   — localStorage read/write (single storage concern)
 *   4. ThemeEngine      — Sets CSS custom properties on :root (NO style injection)
 *   5. TranslationEngine— Google Translate lifecycle (load, set cookie, remove)
 *   6. TTSEngine        — Text-to-speech speak / stop / settings
 *   7. PreferencesFacade— Orchestrator that wires engines together & exposes public API
 *
 * ALL visual styling lives in _sass/open-coding/user-preferences.scss.
 * JS only sets custom properties and toggles the .user-theme-active class.
 */
(function () {
  'use strict';

  /* ===================================================================
   * 1. ConfigManager — owns ALL static data (presets, languages, keys)
   * Reason to change: adding a preset, language, or default value
   * =================================================================== */
  const ConfigManager = (() => {
    const LANGUAGES = {
      '': { name: 'Default (No Translation)', code: '' },
      'es': { name: 'Spanish', code: 'es' },
      'fr': { name: 'French', code: 'fr' },
      'de': { name: 'German', code: 'de' },
      'it': { name: 'Italian', code: 'it' },
      'pt': { name: 'Portuguese', code: 'pt' },
      'ru': { name: 'Russian', code: 'ru' },
      'zh-CN': { name: 'Chinese (Simplified)', code: 'zh-CN' },
      'zh-TW': { name: 'Chinese (Traditional)', code: 'zh-TW' },
      'ja': { name: 'Japanese', code: 'ja' },
      'ko': { name: 'Korean', code: 'ko' },
      'ar': { name: 'Arabic', code: 'ar' },
      'hi': { name: 'Hindi', code: 'hi' },
      'vi': { name: 'Vietnamese', code: 'vi' },
      'th': { name: 'Thai', code: 'th' },
      'nl': { name: 'Dutch', code: 'nl' },
      'pl': { name: 'Polish', code: 'pl' },
      'tr': { name: 'Turkish', code: 'tr' },
      'uk': { name: 'Ukrainian', code: 'uk' },
      'he': { name: 'Hebrew', code: 'he' },
      'fa': { name: 'Persian (Farsi)', code: 'fa' },
    };

    const SITE_DEFAULT = {
      bg: '#121212',
      text: '#F0F0F0',
      font: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      size: 14,
      accent: '#4CAFEF',
    };

    const PRESETS = {
      'Site Default': SITE_DEFAULT,
      Midnight: {
        bg: '#0b1220', text: '#e6eef8',
        font: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
        size: 14, accent: '#3b82f6',
      },
      Light: {
        bg: '#ffffff', text: '#FF80AA',
        font: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
        size: 14, accent: '#2563eb',
      },
      Green: {
        bg: '#154734', text: '#e6f6ef',
        font: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
        size: 14, accent: '#10b981',
      },
      Sepia: {
        bg: '#f4ecd8', text: '#A52A2A',
        font: "Georgia, 'Times New Roman', Times, serif",
        size: 14, accent: '#b45309',
      },
      Cyberpunk: {
        bg: '#0a0a0f', text: '#f0f0f0',
        font: "'Source Code Pro', monospace",
        size: 14, accent: '#f72585',
      },
      Ocean: {
        bg: '#0c1929', text: '#e0f2fe',
        font: "'Open Sans', Arial, sans-serif",
        size: 15, accent: '#06b6d4',
      },
    };

    const STORAGE_KEY = 'sitePreferences';
    const RESET_FLAG_KEY = 'preferencesReset';

    return Object.freeze({ LANGUAGES, SITE_DEFAULT, PRESETS, STORAGE_KEY, RESET_FLAG_KEY });
  })();


  /* ===================================================================
   * 2. ColorUtils — pure functions for color math
   * Reason to change: new color algorithm needed
   * =================================================================== */
  const ColorUtils = (() => {
    function hexToRgb(hex) {
      if (!hex) return { r: 0, g: 0, b: 0 };
      hex = hex.replace('#', '');
      if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
      const bigint = parseInt(hex, 16);
      return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
    }

    function getLuminance(hex) {
      const { r, g, b } = hexToRgb(hex);
      return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    }

    function isLightColor(hex) { return getLuminance(hex) > 0.5; }

    function adjustColor(hex, amt) {
      const { r, g, b } = hexToRgb(hex);
      const clamp = v => Math.max(0, Math.min(255, v));
      return '#' + [clamp(r + amt), clamp(g + amt), clamp(b + amt)]
        .map(v => { const h = v.toString(16); return h.length === 1 ? '0' + h : h; })
        .join('');
    }

    return Object.freeze({ hexToRgb, getLuminance, isLightColor, adjustColor });
  })();


  /* ===================================================================
   * 3. StorageManager — read / write / clear localStorage
   * Reason to change: storage backend changes (e.g. IndexedDB)
   * =================================================================== */
  const StorageManager = (() => {
    function load() {
      try {
        const raw = window.localStorage.getItem(ConfigManager.STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch (e) { console.error('StorageManager.load error', e); return null; }
    }

    function save(prefs) {
      try { window.localStorage.setItem(ConfigManager.STORAGE_KEY, JSON.stringify(prefs)); }
      catch (e) { console.error('StorageManager.save error', e); }
    }

    function clear() { window.localStorage.removeItem(ConfigManager.STORAGE_KEY); }

    function wasReset() {
      return window.localStorage.getItem(ConfigManager.RESET_FLAG_KEY) === 'true';
    }

    return Object.freeze({ load, save, clear, wasReset });
  })();


  /* ===================================================================
   * 4. ThemeEngine — sets CSS custom properties on :root
   * Responsibility: compute derived palette, write properties, toggle class.
   * ALL visual rules (selectors, overrides) live in SASS — not here.
   * =================================================================== */
  const ThemeEngine = (() => {
    // List of every custom property this engine writes (used by reset)
    const ALL_PROPS = [
      '--pref-bg-color', '--pref-text-color', '--pref-font-family',
      '--pref-font-size', '--pref-accent-color', '--pref-selection-color',
      '--pref-btn-radius',
      '--background', '--bg-0', '--bg-1', '--bg-2', '--bg-3',
      '--text', '--text-strong', '--text-muted', '--white1', '--theme',
      '--panel', '--panel-mid', '--ui-bg', '--ui-border',
      '--priority-p0', '--priority-p1', '--priority-p2', '--priority-p3',
    ];

    /**
     * Compute derived CSS values from user prefs and write them as
     * custom properties on <html>. SASS consumes these via var().
     */
    function apply(prefs) {
      const base = ConfigManager.SITE_DEFAULT;
      const bg     = prefs?.bg     || base.bg;
      const text   = prefs?.text   || base.text;
      const font   = prefs?.font   || base.font;
      const size   = prefs?.size   || base.size;
      const accent = prefs?.accent || base.accent;
      const selectionColor = prefs?.selectionColor || accent;
      const buttonStyle    = prefs?.buttonStyle    || 'rounded';

      const root = document.documentElement;
      const set  = (n, v) => root.style.setProperty(n, v);

      // Core properties (consumed by SASS Section 1 & 2)
      set('--pref-bg-color', bg);
      set('--pref-text-color', text);
      set('--pref-font-family', font);
      set('--pref-font-size', size + 'px');
      set('--pref-accent-color', accent);
      set('--pref-selection-color', selectionColor);

      // Button radius as a custom property (consumed by SASS Section 5)
      let btnRadius = '0.375rem';
      if (buttonStyle === 'square') btnRadius = '0';
      else if (buttonStyle === 'pill') btnRadius = '9999px';
      set('--pref-btn-radius', btnRadius);

      // Derived palette
      const lightBg = ColorUtils.isLightColor(bg);
      const dir = lightBg ? -1 : 1;

      set('--background', bg);
      set('--bg-0', bg);
      set('--bg-1', ColorUtils.adjustColor(bg, 8 * dir));
      set('--bg-2', ColorUtils.adjustColor(bg, 16 * dir));
      set('--bg-3', ColorUtils.adjustColor(bg, 24 * dir));
      set('--text', text);
      set('--text-strong', ColorUtils.adjustColor(text, lightBg ? -20 : 20));
      set('--white1', text);
      set('--theme', lightBg ? 'base' : 'dark');

      set('--panel',     ColorUtils.adjustColor(bg, 25 * dir));
      set('--panel-mid', ColorUtils.adjustColor(bg, 35 * dir));
      set('--ui-bg',     ColorUtils.adjustColor(bg, 20 * dir));
      set('--ui-border', ColorUtils.adjustColor(bg, 45 * dir));

      set('--text-muted', lightBg ? '#6b7280' : ColorUtils.adjustColor(text, -60));

      // Semantic priority colours
      if (lightBg) {
        set('--priority-p0', '#b91c1c');
        set('--priority-p1', '#c2410c');
        set('--priority-p2', '#a16207');
        set('--priority-p3', '#15803d');
      } else {
        set('--priority-p0', '#dc2626');
        set('--priority-p1', '#ea580c');
        set('--priority-p2', '#eab308');
        set('--priority-p3', '#22c55e');
      }

      // Toggle class — SASS rules only fire when this class is present
      root.classList.add('user-theme-active');
    }

    /** Remove all user-theme properties so the site reverts to defaults. */
    function reset() {
      const root = document.documentElement;
      root.classList.remove('user-theme-active');
      ALL_PROPS.forEach(p => root.style.removeProperty(p));
    }

    return Object.freeze({ apply, reset });
  })();


  /* ===================================================================
   * 5. TranslationEngine — Google Translate integration
   * Reason to change: translation provider changes
   * =================================================================== */
  const TranslationEngine = (() => {
    function _clearCookies() {
      const domain = window.location.hostname;
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain}`;
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.localhost';
    }

    function _remove() {
      _clearCookies();
      const select = document.querySelector('.goog-te-combo');
      if (select) { select.value = ''; select.dispatchEvent(new Event('change')); }
      try {
        const frame = document.querySelector('.goog-te-banner-frame');
        if (frame && frame.contentDocument) {
          const btn = frame.contentDocument.querySelector('.goog-te-button button');
          if (btn) btn.click();
        }
      } catch (_) { /* cross-origin */ }

      const isTranslated =
        document.documentElement.classList.contains('translated-ltr') ||
        document.documentElement.classList.contains('translated-rtl');
      if (isTranslated) window.location.reload();
    }

    function _ensureWidget() {
      if (!window.googleTranslateElementInit) {
        window.googleTranslateElementInit = function () {
          new google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: Object.keys(ConfigManager.LANGUAGES).filter(k => k).join(','),
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          }, 'google_translate_element');
        };
      }
      if (!document.getElementById('google_translate_element')) {
        const c = document.createElement('div');
        c.id = 'google_translate_element';
        c.style.cssText = 'position:fixed;top:-9999px;left:-9999px;visibility:hidden;';
        document.body.appendChild(c);
      }
      if (!document.getElementById('google-translate-script')) {
        const s = document.createElement('script');
        s.id = 'google-translate-script';
        s.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        s.async = true;
        document.head.appendChild(s);
      }
    }

    function _pollForCombo(langCode, attempts) {
      if (attempts > 100) return;
      const select = document.querySelector('.goog-te-combo');
      if (select) { select.value = langCode; select.dispatchEvent(new Event('change')); }
      else setTimeout(() => _pollForCombo(langCode, attempts + 1), 50);
    }

    function apply(langCode) {
      document.documentElement.setAttribute('data-translate-lang', langCode);
      _clearCookies();
      if (!langCode) { _remove(); return; }
      const domain = window.location.hostname;
      document.cookie = `googtrans=/en/${langCode}; path=/`;
      document.cookie = `googtrans=/en/${langCode}; path=/; domain=${domain}`;
      document.cookie = `googtrans=/en/${langCode}; path=/; domain=.${domain}`;
      _ensureWidget();
      _pollForCombo(langCode, 0);
    }

    return Object.freeze({ apply });
  })();


  /* ===================================================================
   * 6. TTSEngine — Text-to-Speech
   * Reason to change: speech API changes or new TTS provider
   * =================================================================== */
  const TTSEngine = (() => {
    function getSettings() {
      const prefs = StorageManager.load() || {};
      return {
        voice:  prefs.ttsVoice  || '',
        rate:   parseFloat(prefs.ttsRate)   || 1,
        pitch:  parseFloat(prefs.ttsPitch)  || 1,
        volume: parseFloat(prefs.ttsVolume) || 1,
      };
    }

    function speak(text, options = {}) {
      if (!('speechSynthesis' in window)) { console.warn('TTS not supported'); return null; }
      speechSynthesis.cancel();
      const settings  = getSettings();
      const utterance = new SpeechSynthesisUtterance(text);
      const voiceName = options.voice || settings.voice;
      if (voiceName) {
        const voice = speechSynthesis.getVoices().find(v => v.name === voiceName);
        if (voice) utterance.voice = voice;
      }
      utterance.rate   = options.rate   !== undefined ? options.rate   : settings.rate;
      utterance.pitch  = options.pitch  !== undefined ? options.pitch  : settings.pitch;
      utterance.volume = options.volume !== undefined ? options.volume : settings.volume;
      speechSynthesis.speak(utterance);
      return utterance;
    }

    function speakSelection() {
      const sel = window.getSelection();
      const text = sel ? sel.toString().trim() : '';
      if (text) { speak(text); return true; }
      return false;
    }

    function stop()       { if ('speechSynthesis' in window) speechSynthesis.cancel(); }
    function isSpeaking() { return 'speechSynthesis' in window && speechSynthesis.speaking; }

    return Object.freeze({ getSettings, speak, speakSelection, stop, isSpeaking });
  })();


  /* ===================================================================
   * 7. PreferencesFacade — orchestrator & public API
   * Reason to change: wiring between engines changes
   * =================================================================== */
  const PreferencesFacade = (() => {
    function applyPreferences(prefs) {
      ThemeEngine.apply(prefs);
      TranslationEngine.apply(prefs?.language || '');
    }

    function resetPreferences() { ThemeEngine.reset(); }
    function applyLanguage(code) { TranslationEngine.apply(code); }

    function init() {
      if (typeof window === 'undefined') return;
      if (StorageManager.wasReset()) return;
      const prefs = StorageManager.load();
      if (prefs) applyPreferences(prefs);
    }

    return Object.freeze({
      applyPreferences,
      resetPreferences,
      applyLanguage,
      PRESETS:    ConfigManager.PRESETS,
      LANGUAGES:  ConfigManager.LANGUAGES,
      speak:          TTSEngine.speak,
      speakSelection: TTSEngine.speakSelection,
      stopSpeaking:   TTSEngine.stop,
      isSpeaking:     TTSEngine.isSpeaking,
      getTTSSettings: TTSEngine.getSettings,
    });
  })();


  /* ===================================================================
   * Bootstrap
   * =================================================================== */
  window.SitePreferences = PreferencesFacade;

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    PreferencesFacade.init();
  } else {
    document.addEventListener('DOMContentLoaded', () => PreferencesFacade.init());
  }
})();
