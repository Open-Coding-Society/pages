/**
 * Global site-wide theme preferences — Single-Responsibility, class-based architecture.
 *
 * This script runs on EVERY page (loaded from the layout). It restores the
 * user's saved theme/language/TTS settings before any interactive UI mounts,
 * and exposes a small public API (`window.SitePreferences`) for the dashboard
 * preferences panel and other pages to call into.
 *
 * Each class has exactly one job (SRP) so that bugs and feature changes
 * stay isolated to a single area:
 *
 *   ColorUtils                      – Pure color math (hex → rgb, luminance, lighten/darken).
 *                                     Stateless. Used to derive panel/border/muted colors
 *                                     from the user's chosen background.
 *
 *   TailwindOverrideStyleSheetInjector         – Builds and injects a single <style> block that
 *                                     overrides Tailwind utility classes (bg-neutral-800,
 *                                     text-neutral-400, etc.) so the user's theme wins
 *                                     without editing every component.
 *
 *   ThemePreferencesEngine          – Reads a preferences object and applies it to the page:
 *                                     sets CSS custom properties on <html>, derives panel
 *                                     colors via ColorUtils, and calls the injector.
 *                                     Also handles language application via TranslationLanguageManager.
 *
 *   TranslationLanguageManager      – Google Translate integration: sets googtrans cookies,
 *                                     loads the Translate widget script, and toggles between
 *                                     translated / original page state.
 *
 *   TextToSpeechManager             – Wrapper around the browser SpeechSynthesis API.
 *                                     Reads voice/rate/pitch/volume from saved prefs.
 *
 *   LocalStoragePreferencesStore    – Read-only adapter over localStorage. Returns the
 *                                     preferences object stored under 'sitePreferences'.
 *                                     (The dashboard module owns writes; this file only reads.)
 *
 *   GlobalNodCursor              – Optional accessibility feature: uses MediaPipe + webcam
 *                                     to drive the cursor with head movement on non-dashboard
 *                                     pages (the dashboard owns its own toggle UI).
 *
 *   SitePreferences (window global) – Public API surface. Thin facade that delegates to the
 *                                     classes above. Consumed by dashboard.html and any page
 *                                     that needs to apply / reset / translate / speak.
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
  class TailwindOverrideStyleSheetInjector {
    static STYLE_ID = 'user-theme-override-css';

    /**
     * Inject (or update) the <style> block that overrides Tailwind /
     * theme classes when the user theme is active.
     */
    static inject(opts) {
      const { bg, text, font, size, accent, panel, uiBorder, textMuted,
              selectionColor, buttonStyle } = opts;

      let style = document.getElementById(TailwindOverrideStyleSheetInjector.STYLE_ID);
      if (!style) {
        style = document.createElement('style');
        style.id = TailwindOverrideStyleSheetInjector.STYLE_ID;
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
      const el = document.getElementById(TailwindOverrideStyleSheetInjector.STYLE_ID);
      if (el) el.remove();
    }
  }

  // ============================================
  // RESPONSIBILITY: Map prefs → CSS custom props
  // ============================================
  class ThemePreferencesEngine {
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
      TailwindOverrideStyleSheetInjector.inject({
        bg, text, font, size, accent, panel, uiBorder, textMuted,
        selectionColor, buttonStyle,
      });

      // Apply language translation if set
      const lang = prefs?.language || '';
      TranslationLanguageManager.apply(lang);
    }

    /** Remove all user-theme CSS custom properties and the override sheet */
    static reset() {
      const root = document.documentElement;
      root.classList.remove('user-theme-active');
      TailwindOverrideStyleSheetInjector.remove();

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
  class TranslationLanguageManager {
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
      TranslationLanguageManager.clearCookies();

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
      TranslationLanguageManager._injectHideCSS();
      TranslationLanguageManager.clearCookies();

      if (!langCode) {
        TranslationLanguageManager._removeTranslation();
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
  class TextToSpeechManager {
    /** Get TTS settings from stored preferences */
    static get() {
      const prefs = LocalStoragePreferencesStore.get() || {};
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

      const settings = TextToSpeechManager.get();
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
      if (text) { TextToSpeechManager.speak(text); return true; }
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
  class LocalStoragePreferencesStore {
    static KEY = 'sitePreferences';

    /** Get preferences from localStorage (returns object or null) */
    static get() {
      try {
        const raw = window.localStorage.getItem(LocalStoragePreferencesStore.KEY);
        if (!raw) return null;
        return JSON.parse(raw);
      } catch (e) {
        console.error('Error loading stored preferences', e);
        return null;
      }
    }
  }

  // ============================================
  // RESPONSIBILITY: Site-wide head-tracking runner
  // ============================================
  /** Handles the site-wide nod-based cursor functionality on all pages, independent of the dashboard settings page. */
class GlobalNodCursor {
    static STORAGE_KEY = 'headTrackingPreferences';
    static CALIBRATION_KEY = 'headTrackingCalibration';
    static state = {
      enabled: false,
      sensitivity: 0.45,
    };
    static calibration = {
      centerX: 0.5,
      centerY: 0.5,
      leftX: 0.3,
      rightX: 0.7,
      upY: 0.3,
      downY: 0.7,
      calibrated: false,
    };

    static stream = null;
    static video = null;
    static cursorEl = null;
    static rafId = null;
    static faceLandmarker = null;
    static visionModule = null;
    static lastPoint = null;
    /** Executes the static init() { functionality for this class. */
    static init() {
      // Dashboard owns the toggle UI and tracking lifecycle there.
      if (document.getElementById('pref-head-tracking-enabled')) return;

      GlobalNodCursor._loadState();
      GlobalNodCursor._loadCalibration();
      if (!GlobalNodCursor.state.enabled) return;

      GlobalNodCursor._createCursor();
      GlobalNodCursor._startTracking();

      window.addEventListener('beforeunload', () => {
        GlobalNodCursor._stopTracking();
      });
    }
    /** Executes the static _loadState() { functionality for this class. */
    static _loadState() {
      try {
        const raw = localStorage.getItem(GlobalNodCursor.STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        GlobalNodCursor.state.enabled = !!parsed.enabled;
        const incomingSensitivity = Number(parsed.sensitivity);
        if (Number.isFinite(incomingSensitivity)) {
          GlobalNodCursor.state.sensitivity = Math.min(0.9, Math.max(0.1, incomingSensitivity));
        }
      } catch (e) {
        console.error('global head tracking load state error', e);
      }
    }
    /** Executes the static _saveState() { functionality for this class. */
    static _saveState() {
      try {
        localStorage.setItem(GlobalNodCursor.STORAGE_KEY, JSON.stringify(GlobalNodCursor.state));
      } catch (e) {
        console.error('global head tracking save state error', e);
      }
    }
    /** Executes the static _loadCalibration() { functionality for this class. */
    static _loadCalibration() {
      try {
        const raw = localStorage.getItem(GlobalNodCursor.CALIBRATION_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        const asNum = (v, fallback) => {
          const n = Number(v);
          if (!Number.isFinite(n)) return fallback;
          return Math.max(0, Math.min(1, n));
        };
        GlobalNodCursor.calibration = {
          centerX: asNum(parsed?.centerX, 0.5),
          centerY: asNum(parsed?.centerY, 0.5),
          leftX: asNum(parsed?.leftX, 0.3),
          rightX: asNum(parsed?.rightX, 0.7),
          upY: asNum(parsed?.upY, 0.3),
          downY: asNum(parsed?.downY, 0.7),
          calibrated: !!parsed?.calibrated,
        };
      } catch (e) {
        console.error('global head tracking load calibration error', e);
      }
    }
    /** Executes the static _mapRawToViewport(rawX, rawY) { functionality for this class. */
    static _mapRawToViewport(rawX, rawY) {
      const x = Math.max(0, Math.min(1, rawX));
      const y = Math.max(0, Math.min(1, rawY));
      const c = GlobalNodCursor.calibration;

      if (!c?.calibrated) {
        return { x, y };
      }

      const normalize = (value, min, max) => {
        if (!Number.isFinite(min) || !Number.isFinite(max) || Math.abs(max - min) < 0.001) {
          return 0.5;
        }
        return (value - min) / (max - min);
      };

      return {
        x: Math.max(0, Math.min(1, normalize(x, c.leftX, c.rightX))),
        y: Math.max(0, Math.min(1, normalize(y, c.upY, c.downY))),
      };
    }
    /** Executes the static _createCursor() { functionality for this class. */
    static _createCursor() {
      if (GlobalNodCursor.cursorEl) return;

      let el = document.getElementById('head-tracking-cursor');
      if (!el) {
        el = document.createElement('div');
        el.id = 'head-tracking-cursor';
        el.style.position = 'fixed';
        el.style.width = '18px';
        el.style.height = '18px';
        el.style.border = '2px solid #22d3ee';
        el.style.borderRadius = '9999px';
        el.style.background = 'rgba(34, 211, 238, 0.15)';
        el.style.pointerEvents = 'none';
        el.style.zIndex = '99999';
        el.style.transform = 'translate(-9999px, -9999px)';
        el.style.boxShadow = '0 0 12px rgba(34, 211, 238, 0.5)';
        document.body.appendChild(el);
      }

      GlobalNodCursor.cursorEl = el;
    }
    /** Executes the static _showCursor(x, y) { functionality for this class. */
    static _showCursor(x, y) {
      if (!GlobalNodCursor.cursorEl) return;
      GlobalNodCursor.cursorEl.style.transform = `translate(${Math.round(x - 9)}px, ${Math.round(y - 9)}px)`;
    }
    /** Executes the static _hideCursor() { functionality for this class. */
    static _hideCursor() {
      if (!GlobalNodCursor.cursorEl) return;
      GlobalNodCursor.cursorEl.style.transform = 'translate(-9999px, -9999px)';
    }

    static async _startTracking() {
      if (GlobalNodCursor.stream) return;

      if (!navigator.mediaDevices?.getUserMedia) {
        GlobalNodCursor.state.enabled = false;
        GlobalNodCursor._saveState();
        return;
      }

      try {
        if (!GlobalNodCursor.visionModule) {
          GlobalNodCursor.visionModule = await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/+esm');
        }

        if (!GlobalNodCursor.faceLandmarker) {
          const fileset = await GlobalNodCursor.visionModule.FilesetResolver.forVisionTasks(
            'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
          );
          GlobalNodCursor.faceLandmarker = await GlobalNodCursor.visionModule.FaceLandmarker.createFromOptions(fileset, {
            baseOptions: {
              modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
            },
            runningMode: 'VIDEO',
            numFaces: 1,
          });
        }

        GlobalNodCursor.stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user',
          },
          audio: false,
        });

        if (!GlobalNodCursor.video) {
          const v = document.createElement('video');
          v.autoplay = true;
          v.muted = true;
          v.playsInline = true;
          v.style.position = 'fixed';
          v.style.width = '1px';
          v.style.height = '1px';
          v.style.opacity = '0';
          v.style.pointerEvents = 'none';
          v.style.left = '-9999px';
          document.body.appendChild(v);
          GlobalNodCursor.video = v;
        }

        GlobalNodCursor.video.srcObject = GlobalNodCursor.stream;
        await GlobalNodCursor.video.play();

        GlobalNodCursor.lastPoint = null;
        GlobalNodCursor._runLoop();
      } catch (e) {
        console.error('global head tracking start error', e);
        GlobalNodCursor.state.enabled = false;
        GlobalNodCursor._saveState();
        GlobalNodCursor._stopTracking();
      }
    }
    /** Executes the static _runLoop() { functionality for this class. */
    static _runLoop() {
      if (!GlobalNodCursor.state.enabled || !GlobalNodCursor.faceLandmarker || !GlobalNodCursor.video) {
        return;
      }

      const tick = () => {
        if (!GlobalNodCursor.state.enabled || !GlobalNodCursor.faceLandmarker || !GlobalNodCursor.video) {
          return;
        }

        if (GlobalNodCursor.video.readyState >= 2) {
          const result = GlobalNodCursor.faceLandmarker.detectForVideo(GlobalNodCursor.video, performance.now());
          const landmarks = result?.faceLandmarks?.[0];
          const nose = landmarks?.[1];

          if (nose) {
            const rawX = 1 - nose.x;
            const rawY = nose.y;
            const mapped = GlobalNodCursor._mapRawToViewport(rawX, rawY);
            const targetX = mapped.x * window.innerWidth;
            const targetY = mapped.y * window.innerHeight;

            const alpha = Math.min(0.9, Math.max(0.1, GlobalNodCursor.state.sensitivity));
            if (!GlobalNodCursor.lastPoint) {
              GlobalNodCursor.lastPoint = { x: targetX, y: targetY };
            } else {
              GlobalNodCursor.lastPoint.x += (targetX - GlobalNodCursor.lastPoint.x) * alpha;
              GlobalNodCursor.lastPoint.y += (targetY - GlobalNodCursor.lastPoint.y) * alpha;
            }

            const x = Math.max(0, Math.min(window.innerWidth - 1, GlobalNodCursor.lastPoint.x));
            const y = Math.max(0, Math.min(window.innerHeight - 1, GlobalNodCursor.lastPoint.y));

            GlobalNodCursor._showCursor(x, y);

            const moveEvent = new MouseEvent('mousemove', {
              bubbles: true,
              cancelable: true,
              view: window,
              clientX: x,
              clientY: y,
            });
            window.dispatchEvent(moveEvent);
            const target = document.elementFromPoint(x, y);
            if (target) target.dispatchEvent(moveEvent);
          }
        }

        GlobalNodCursor.rafId = requestAnimationFrame(tick);
      };

      GlobalNodCursor.rafId = requestAnimationFrame(tick);
    }
    /** Executes the static _stopTracking() { functionality for this class. */
    static _stopTracking() {
      if (GlobalNodCursor.rafId) {
        cancelAnimationFrame(GlobalNodCursor.rafId);
        GlobalNodCursor.rafId = null;
      }

      if (GlobalNodCursor.stream) {
        GlobalNodCursor.stream.getTracks().forEach(track => track.stop());
        GlobalNodCursor.stream = null;
      }

      if (GlobalNodCursor.video) {
        GlobalNodCursor.video.pause();
        GlobalNodCursor.video.srcObject = null;
      }

      GlobalNodCursor.lastPoint = null;
      GlobalNodCursor._hideCursor();
    }
  }

  // ============================================================================
  // ORCHESTRATOR
  // ----------------------------------------------------------------------------
  // Wires the SRP classes above into a single bootstrap (`init`) and exposes a
  // small, stable public API on `window.SitePreferences`. Everything below this
  // line is the only code that runs eagerly when the script loads on each page.
  // ============================================================================

  /**
   * Page bootstrap. Runs once per page load, as early as possible (either
   * immediately if the DOM is already parsed, or on `DOMContentLoaded`).
   *
   * Responsibilities:
   *   1. Guard against non-browser environments (SSR / unit tests).
   *   2. Honor the explicit "reset" sentinel — if the user clicked Reset on the
   *      dashboard we leave the site at its built-in defaults and do nothing.
   *   3. Read the saved preferences from localStorage and, if any exist, apply
   *      them via ThemePreferencesEngine (sets CSS variables, injects override
   *      stylesheet, switches Google Translate language).
   *   4. Re-arm the optional global head-tracking feature on non-dashboard pages.
   *      The dashboard owns its own toggle UI, so we skip there to avoid two
   *      controllers fighting over the webcam stream.
   */
  function init() {
    // (1) Guard: bail out cleanly if loaded outside a browser (e.g. node tests).
    if (typeof window === 'undefined') return;

    // (2) Honor the dashboard's explicit "Reset to site defaults" action.
    //     Set by the preferences panel; presence overrides any saved theme.
    const wasReset = window.localStorage.getItem('preferencesReset');
    if (wasReset === 'true') return;

    // (3) Restore the user's saved theme (background, text color, font, accent,
    //     selection color, button shape, language, etc.). No-op for guests.
    const prefs = LocalStoragePreferencesStore.get();
    if (prefs) ThemePreferencesEngine.apply(prefs);

    // (4) Restart head-tracking on every navigation if the user has it enabled,
    //     but only on pages that don't already render the dashboard's own toggle.
    GlobalNodCursor.init();
  }

  // ----------------------------------------------------------------------------
  // PUBLIC API — `window.SitePreferences`
  // ----------------------------------------------------------------------------
  // Stable facade that the dashboard preferences panel (and any other page)
  // calls into. Keep these method names backwards-compatible: changing them
  // requires updating every consumer (search the repo for "SitePreferences.").
  // ----------------------------------------------------------------------------
  window.SitePreferences = {
    // ── Theme application ──────────────────────────────────────────────────
    /** Apply a full preferences object (live preview + persistent style). */
    applyPreferences: prefs => ThemePreferencesEngine.apply(prefs),
    /** Strip all user-theme CSS and revert to the site's built-in defaults. */
    resetPreferences: () => ThemePreferencesEngine.reset(),

    // ── Translation ────────────────────────────────────────────────────────
    /** Switch the page language via Google Translate (empty string = English). */
    applyLanguage: langCode => TranslationLanguageManager.apply(langCode),

    // ── Read-only constants exposed for the dashboard's preset/lang menus ──
    PRESETS,    // Built-in named themes (Site Default, Midnight, Light, ...)
    LANGUAGES,  // Supported translation language codes for the dropdown.

    // ── Text-to-Speech ─────────────────────────────────────────────────────
    /** Speak arbitrary text using the user's saved TTS voice/rate/pitch. */
    speak: (text, opts) => TextToSpeechManager.speak(text, opts),
    /** Speak whatever text is currently highlighted on the page. */
    speakSelection: () => TextToSpeechManager.speakSelection(),
    /** Cancel any in-progress utterance immediately. */
    stopSpeaking: () => TextToSpeechManager.stop(),
    /** True while the browser is mid-utterance (useful for play/pause UI). */
    isSpeaking: () => TextToSpeechManager.isSpeaking(),
    /** Read the saved TTS settings (voice, rate, pitch, volume). */
    getTTSSettings: () => TextToSpeechManager.get(),
  };

  // ----------------------------------------------------------------------------
  // BOOTSTRAP TRIGGER
  // ----------------------------------------------------------------------------
  // Run `init` as early as possible. If the DOM is already parsed (script was
  // injected late, or `defer`/`async` finished after parsing) we run immediately
  // so saved themes don't visibly "flash" in the default colors. Otherwise we
  // wait for `DOMContentLoaded` so element queries inside init/Engine work.
  // ----------------------------------------------------------------------------
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();