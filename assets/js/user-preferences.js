/**
 * Global site-wide theme preferences — SRP + Class-based architecture.
 *
 * Classes use standard get/set naming where applicable:
 *   ColorUtils        – Pure color math (hex→rgb, luminance, adjust)
 *   CSSInjector       – Builds and injects the override <style> block
 *   ThemeEngine        – Reads prefs → sets CSS custom properties + injects overrides
 *   LanguageManager    – Google Translate integration
 *   TTSManager         – TTS wrapper: get() settings, speak(), stop()
 *   PreferencesStore   – localStorage: get() reads stored prefs
 *   SitePreferences    – Orchestrator: wires everything together, exposes public API
 */
(function () {

  // ============================================
  // CONFIGURATION: Shared constants
  // ============================================
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

  // ============================================
  // RESPONSIBILITY: Pure color math utilities
  // ============================================
  class ColorUtils {
    /** Convert hex string to { r, g, b } */
    static hexToRgb(hex) {
      if (!hex) return { r: 0, g: 0, b: 0 };
      hex = hex.replace('#', '');
      if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
      const bigint = parseInt(hex, 16);
      return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
      };
    }

    /** Perceived luminance 0-1 */
    static getLuminance(hex) {
      const { r, g, b } = ColorUtils.hexToRgb(hex);
      return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    }

    /** True when background is perceptually light */
    static isLightColor(hex) {
      return ColorUtils.getLuminance(hex) > 0.5;
    }

    /** Shift every channel by amt (positive = lighten, negative = darken) */
    static adjustColor(hex, amt) {
      const { r, g, b } = ColorUtils.hexToRgb(hex);
      const clamp = v => Math.max(0, Math.min(255, v));
      return (
        '#' +
        [clamp(r + amt), clamp(g + amt), clamp(b + amt)]
          .map(v => {
            const h = v.toString(16);
            return h.length === 1 ? '0' + h : h;
          })
          .join('')
      );
    }
  }

  // ============================================
  // RESPONSIBILITY: Build & inject override CSS
  // ============================================
  class CSSInjector {
    static STYLE_ID = 'user-theme-override-css';

    /**
     * Inject (or update) the <style> block that overrides Tailwind /
     * theme classes when the user theme is active.
     */
    static inject(opts) {
      const { bg, text, font, size, accent, panel, uiBorder, textMuted,
              selectionColor, buttonStyle } = opts;

      let style = document.getElementById(CSSInjector.STYLE_ID);
      if (!style) {
        style = document.createElement('style');
        style.id = CSSInjector.STYLE_ID;
        document.head.appendChild(style);
      }

      let btnRadius = '0.375rem';
      if (buttonStyle === 'square') btnRadius = '0';
      else if (buttonStyle === 'pill') btnRadius = '9999px';

      style.textContent = `
        html.user-theme-active,
        html.user-theme-active body {
          background-color: ${bg} !important;
          color: ${text} !important;
          font-family: ${font} !important;
          font-size: ${size}px !important;
        }
        html.user-theme-active ::selection {
          background-color: ${selectionColor} !important;
          color: white !important;
        }
        html.user-theme-active ::-moz-selection {
          background-color: ${selectionColor} !important;
          color: white !important;
        }
        html.user-theme-active button,
        html.user-theme-active .btn,
        html.user-theme-active [class*="rounded"] button,
        html.user-theme-active input[type="submit"],
        html.user-theme-active input[type="button"] {
          border-radius: ${btnRadius} !important;
        }
        html.user-theme-active .bg-neutral-900,
        html.user-theme-active .bg-neutral-800 {
          background-color: ${bg} !important;
        }
        html.user-theme-active .fixed.left-0.bg-neutral-800,
        html.user-theme-active div[class*="bg-neutral-800"].border {
          background-color: ${panel} !important;
        }
        html.user-theme-active .rounded-lg.bg-neutral-800,
        html.user-theme-active .p-4.rounded-lg.bg-neutral-800 {
          background-color: ${panel} !important;
        }
        html.user-theme-active .text-neutral-100,
        html.user-theme-active .text-neutral-50,
        html.user-theme-active .text-white {
          color: ${text} !important;
        }
        html.user-theme-active .text-neutral-400,
        html.user-theme-active .text-neutral-500 {
          color: ${textMuted} !important;
        }
        html.user-theme-active .text-gray-300,
        html.user-theme-active .text-gray-400,
        html.user-theme-active .text-gray-500,
        html.user-theme-active .text-gray-600 {
          color: ${textMuted} !important;
        }
        html.user-theme-active .post-meta,
        html.user-theme-active .post-meta-description {
          color: ${textMuted} !important;
        }
        html.user-theme-active .border-neutral-700,
        html.user-theme-active .border-neutral-600 {
          border-color: ${uiBorder} !important;
        }
        html.user-theme-active .text-blue-500,
        html.user-theme-active .border-blue-500 {
          color: ${accent} !important;
          border-color: ${accent} !important;
        }
        html.user-theme-active .bg-neutral-700 {
          background-color: ${panel} !important;
        }
        html.user-theme-active input,
        html.user-theme-active select,
        html.user-theme-active textarea {
          background-color: ${panel} !important;
          color: ${text} !important;
          border-color: ${uiBorder} !important;
        }
        html.user-theme-active .lesson-player {
          background-color: ${bg} !important;
        }
        html.user-theme-active .lesson-sidebar {
          background-color: ${panel} !important;
          border-color: ${uiBorder} !important;
        }
        html.user-theme-active .lesson-sidebar,
        html.user-theme-active .sidebar-header,
        html.user-theme-active .sprint-nav,
        html.user-theme-active .sprint-section,
        html.user-theme-active .lesson-item {
          background-color: ${panel} !important;
          color: ${text} !important;
        }
        html.user-theme-active .lesson-main,
        html.user-theme-active .main-content,
        html.user-theme-active .lesson-content,
        html.user-theme-active .content-wrapper {
          background-color: ${bg} !important;
          color: ${text} !important;
        }
        html.user-theme-active .sidebar-header h2,
        html.user-theme-active .sidebar-header p,
        html.user-theme-active .sprint-toggle,
        html.user-theme-active .lesson-title {
          color: ${text} !important;
        }
        html.user-theme-active .progress-bar-sidebar {
          background-color: ${uiBorder} !important;
        }
        html.user-theme-active .module-card,
        html.user-theme-active [class*="bg-neutral"],
        html.user-theme-active [class*="bg-gray"],
        html.user-theme-active [class*="bg-slate"],
        html.user-theme-active [class*="bg-zinc"] {
          background-color: ${panel} !important;
          color: ${text} !important;
        }
        html.user-theme-active h1,
        html.user-theme-active h2,
        html.user-theme-active h3,
        html.user-theme-active h4,
        html.user-theme-active h5,
        html.user-theme-active h6,
        html.user-theme-active p,
        html.user-theme-active li,
        html.user-theme-active span,
        html.user-theme-active div {
          color: ${text} !important;
        }
        html.user-theme-active button,
        html.user-theme-active .btn,
        html.user-theme-active a.btn {
          color: inherit !important;
        }
      `;
    }

    /** Remove the injected override <style> element */
    static remove() {
      const el = document.getElementById(CSSInjector.STYLE_ID);
      if (el) el.remove();
    }
  }

  // ============================================
  // RESPONSIBILITY: Map prefs → CSS custom props
  // ============================================
  class ThemeEngine {
    /**
     * Apply a preferences object to the document via CSS custom properties,
     * priority-color tokens, and the override stylesheet.
     */
    static apply(prefs) {
      const base = SITE_DEFAULT;
      const bg = prefs?.bg || base.bg;
      const text = prefs?.text || base.text;
      const font = prefs?.font || base.font;
      const size = prefs?.size || base.size;
      const accent = prefs?.accent || base.accent;
      const selectionColor = prefs?.selectionColor || accent;
      const buttonStyle = prefs?.buttonStyle || 'rounded';

      const root = document.documentElement;
      const set = (name, value) => root.style.setProperty(name, value);

      // Core preference variables
      set('--pref-bg-color', bg);
      set('--pref-text-color', text);
      set('--pref-font-family', font);
      set('--pref-font-size', size + 'px');
      set('--pref-accent-color', accent);
      set('--pref-selection-color', selectionColor);

      // Derived background shades
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

      // Panel / UI surface tokens
      const panel = ColorUtils.adjustColor(bg, 25 * dir);
      const panelMid = ColorUtils.adjustColor(bg, 35 * dir);
      const uiBg = ColorUtils.adjustColor(bg, 20 * dir);
      const uiBorder = ColorUtils.adjustColor(bg, 45 * dir);

      set('--panel', panel);
      set('--panel-mid', panelMid);
      set('--ui-bg', uiBg);
      set('--ui-border', uiBorder);

      // Muted text
      const textMuted = lightBg ? '#6b7280' : ColorUtils.adjustColor(text, -60);
      set('--text-muted', textMuted);

      // Priority / semantic colours
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

      // Activate the theme class
      root.classList.add('user-theme-active');

      // Inject Tailwind override stylesheet
      CSSInjector.inject({
        bg, text, font, size, accent, panel, uiBorder, textMuted,
        selectionColor, buttonStyle,
      });

      // Apply language translation if set
      const lang = prefs?.language || '';
      LanguageManager.apply(lang);
    }

    /** Remove all user-theme CSS custom properties and the override sheet */
    static reset() {
      const root = document.documentElement;
      root.classList.remove('user-theme-active');
      CSSInjector.remove();

      const props = [
        '--pref-bg-color', '--pref-text-color', '--pref-font-family',
        '--pref-font-size', '--pref-accent-color', '--pref-selection-color',
        '--pref-cursor-style', '--background',
        '--bg-0', '--bg-1', '--bg-2', '--bg-3',
        '--text', '--text-strong', '--text-muted', '--white1',
        '--panel', '--panel-mid', '--ui-bg', '--ui-border',
      ];
      props.forEach(name => root.style.removeProperty(name));
    }
  }

  // ============================================
  // RESPONSIBILITY: Google Translate integration
  // ============================================
  class LanguageManager {
    /** Inject the CSS that hides the Google Translate toolbar */
    static _injectHideCSS() {
      if (document.getElementById('google-translate-hide-css')) return;
      const style = document.createElement('style');
      style.id = 'google-translate-hide-css';
      style.textContent = `
        .goog-te-banner-frame, .goog-te-balloon-frame { display: none !important; }
        body { top: 0 !important; position: static !important; }
        .skiptranslate { display: none !important; }
        .goog-te-gadget { display: none !important; }
        #google_translate_element { display: none !important; }
      `;
      document.head.appendChild(style);
    }

    /** Clear all googtrans cookie variations */
    static clearCookies() {
      const domain = window.location.hostname;
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain}`;
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.localhost';
    }

    /** Attempt to revert Google Translate to the original page language */
    static _removeTranslation() {
      LanguageManager.clearCookies();

      const select = document.querySelector('.goog-te-combo');
      if (select) {
        select.value = '';
        select.dispatchEvent(new Event('change'));
      }

      try {
        const frame = document.querySelector('.goog-te-banner-frame');
        if (frame && frame.contentDocument) {
          const restoreBtn = frame.contentDocument.querySelector('.goog-te-button button');
          if (restoreBtn) restoreBtn.click();
        }
      } catch (_) { /* cross-origin – ok */ }

      const isTranslated =
        document.documentElement.classList.contains('translated-ltr') ||
        document.documentElement.classList.contains('translated-rtl') ||
        document.querySelector('html.translated-ltr, html.translated-rtl');

      if (isTranslated) window.location.reload();
    }

    /**
     * Apply a language translation (or remove if langCode is empty).
     * @param {string} langCode – ISO language code, e.g. 'es', 'fr', ''
     */
    static apply(langCode) {
      document.documentElement.setAttribute('data-translate-lang', langCode);
      LanguageManager._injectHideCSS();
      LanguageManager.clearCookies();

      if (!langCode) {
        LanguageManager._removeTranslation();
        return;
      }

      // Set cookies for the desired language
      const domain = window.location.hostname;
      document.cookie = `googtrans=/en/${langCode}; path=/`;
      document.cookie = `googtrans=/en/${langCode}; path=/; domain=${domain}`;
      document.cookie = `googtrans=/en/${langCode}; path=/; domain=.${domain}`;

      // Initialise Google Translate element (once)
      if (!window.googleTranslateElementInit) {
        window.googleTranslateElementInit = function () {
          new google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: Object.keys(LANGUAGES).filter(k => k).join(','),
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          }, 'google_translate_element');
        };
      }

      if (!document.getElementById('google_translate_element')) {
        const container = document.createElement('div');
        container.id = 'google_translate_element';
        container.style.cssText = 'position:fixed;top:-9999px;left:-9999px;visibility:hidden;';
        document.body.appendChild(container);
      }

      if (!document.getElementById('google-translate-script')) {
        const script = document.createElement('script');
        script.id = 'google-translate-script';
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.head.appendChild(script);
      }

      // Poll until the combo-box appears, then trigger the switch
      const attemptTranslation = (attempts = 0) => {
        if (attempts > 100) return;
        const select = document.querySelector('.goog-te-combo');
        if (select) {
          select.value = langCode;
          select.dispatchEvent(new Event('change'));
        } else {
          setTimeout(() => attemptTranslation(attempts + 1), 50);
        }
      };
      attemptTranslation();
    }
  }

  // ============================================
  // RESPONSIBILITY: Text-to-Speech wrapper
  // ============================================
  class TTSManager {
    /** Get TTS settings from stored preferences */
    static get() {
      const prefs = PreferencesStore.get() || {};
      return {
        voice: prefs.ttsVoice || '',
        rate: parseFloat(prefs.ttsRate) || 1,
        pitch: parseFloat(prefs.ttsPitch) || 1,
        volume: parseFloat(prefs.ttsVolume) || 1,
      };
    }

    /** Speak the given text, optionally overriding saved settings */
    static speak(text, options = {}) {
      if (!('speechSynthesis' in window)) {
        console.warn('Text-to-speech not supported in this browser');
        return null;
      }
      speechSynthesis.cancel();

      const settings = TTSManager.get();
      const utterance = new SpeechSynthesisUtterance(text);

      const voiceName = options.voice || settings.voice;
      if (voiceName) {
        const voice = speechSynthesis.getVoices().find(v => v.name === voiceName);
        if (voice) utterance.voice = voice;
      }

      utterance.rate = options.rate !== undefined ? options.rate : settings.rate;
      utterance.pitch = options.pitch !== undefined ? options.pitch : settings.pitch;
      utterance.volume = options.volume !== undefined ? options.volume : settings.volume;

      speechSynthesis.speak(utterance);
      return utterance;
    }

    /** Speak whatever text is currently selected on the page */
    static speakSelection() {
      const sel = window.getSelection();
      const text = sel ? sel.toString().trim() : '';
      if (text) { TTSManager.speak(text); return true; }
      return false;
    }

    /** Cancel ongoing speech */
    static stop() {
      if ('speechSynthesis' in window) speechSynthesis.cancel();
    }

    /** True while the browser is actively speaking */
    static isSpeaking() {
      return 'speechSynthesis' in window && speechSynthesis.speaking;
    }
  }

  // ============================================
  // RESPONSIBILITY: localStorage read / write
  // ============================================
  class PreferencesStore {
    static KEY = 'sitePreferences';

    /** Get preferences from localStorage (returns object or null) */
    static get() {
      try {
        const raw = window.localStorage.getItem(PreferencesStore.KEY);
        if (!raw) return null;
        return JSON.parse(raw);
      } catch (e) {
        console.error('Error loading stored preferences', e);
        return null;
      }
    }
  }

  // ============================================
  // ORCHESTRATOR: Wires classes, exposes public API, runs init
  // ============================================
  function init() {
    if (typeof window === 'undefined') return;

    // If user explicitly reset, skip applying any prefs
    const wasReset = window.localStorage.getItem('preferencesReset');
    if (wasReset === 'true') return;

    const prefs = PreferencesStore.get();
    if (prefs) ThemeEngine.apply(prefs);
  }

  // Public API consumed by dashboard.html and other pages
  window.SitePreferences = {
    applyPreferences: prefs => ThemeEngine.apply(prefs),
    resetPreferences: () => ThemeEngine.reset(),
    applyLanguage: langCode => LanguageManager.apply(langCode),
    PRESETS,
    LANGUAGES,
    // TTS
    speak: (text, opts) => TTSManager.speak(text, opts),
    speakSelection: () => TTSManager.speakSelection(),
    stopSpeaking: () => TTSManager.stop(),
    isSpeaking: () => TTSManager.isSpeaking(),
    getTTSSettings: () => TTSManager.get(),
  };

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();