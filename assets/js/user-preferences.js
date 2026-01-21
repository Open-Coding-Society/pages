// Global site-wide theme preferences
// Applies user-selected colors, fonts, sizing, and language translation across all pages.
(function () {
  // Supported languages for translation
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
      text: '#FF80AA',
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
      text: '#A52A2A',
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
    
    // Styling preferences
    const selectionColor = prefs?.selectionColor || accent;
    const buttonStyle = prefs?.buttonStyle || 'rounded';

    const root = document.documentElement;
    root.style.setProperty('--pref-bg-color', bg);
    root.style.setProperty('--pref-text-color', text);
    root.style.setProperty('--pref-font-family', font);
    root.style.setProperty('--pref-font-size', size + 'px');
    root.style.setProperty('--pref-accent-color', accent);
    root.style.setProperty('--pref-selection-color', selectionColor);

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
    set('--theme', lightBg ? "base" : "dark"); // For Mermaid charts

    // Panels contrast with background
    const panel = adjustColor(bg, 25 * dir);
    const panelMid = adjustColor(bg, 35 * dir);
    const uiBg = adjustColor(bg, 20 * dir);
    const uiBorder = adjustColor(bg, 45 * dir);

    set('--panel', panel);
    set('--panel-mid', panelMid);
    set('--ui-bg', uiBg);
    set('--ui-border', uiBorder);
    
    // Text colors that work on panels - muted text should still be readable
    // For light backgrounds: we want a medium-dark gray that contrasts with white
    // For dark backgrounds: we want a medium-light gray that contrasts with dark
    let textMuted;
    if (lightBg) {
      // Light background: use a dark gray for muted text (good contrast on white)
      textMuted = '#6b7280'; // Tailwind gray-500, works well on light backgrounds
    } else {
      // Dark background: make the light text slightly dimmer
      textMuted = adjustColor(text, -60);
    }
    set('--text-muted', textMuted);

    // Turn on the high-priority theme class on <html> so global CSS rules
    // can override other themes consistently (Minima, Tailwind, etc.).
    document.documentElement.classList.add('user-theme-active');

    // Inject CSS to override Tailwind classes with our theme colors
    injectThemeOverrideCSS({
      bg, text, font, size, accent, panel, uiBorder, textMuted,
      selectionColor, buttonStyle
    });

    // Apply language translation if set
    const lang = prefs?.language || '';
    applyLanguage(lang);
  }

  function injectThemeOverrideCSS(opts) {
    const { bg, text, font, size, accent, panel, uiBorder, textMuted,
            selectionColor, buttonStyle } = opts;
    
    const styleId = 'user-theme-override-css';
    let style = document.getElementById(styleId);
    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      document.head.appendChild(style);
    }
    
    // Generate button border-radius based on style
    let btnRadius = '0.375rem'; // rounded (default)
    if (buttonStyle === 'square') btnRadius = '0';
    else if (buttonStyle === 'pill') btnRadius = '9999px';
    
    // Override Tailwind's neutral background classes when theme is active
    style.textContent = `
      html.user-theme-active,
      html.user-theme-active body {
        background-color: ${bg} !important;
        color: ${text} !important;
        font-family: ${font} !important;
        font-size: ${size}px !important;
      }
      
      /* Selection highlight color */
      html.user-theme-active ::selection {
        background-color: ${selectionColor} !important;
        color: white !important;
      }
      html.user-theme-active ::-moz-selection {
        background-color: ${selectionColor} !important;
        color: white !important;
      }
      
      /* Button border-radius based on style */
      html.user-theme-active button,
      html.user-theme-active .btn,
      html.user-theme-active [class*="rounded"] button,
      html.user-theme-active input[type="submit"],
      html.user-theme-active input[type="button"] {
        border-radius: ${btnRadius} !important;
      }
      
      /* Main content areas */
      html.user-theme-active .bg-neutral-900,
      html.user-theme-active .bg-neutral-800 {
        background-color: ${bg} !important;
      }
      
      /* Sidebar and panels - slightly different shade */
      html.user-theme-active .fixed.left-0.bg-neutral-800,
      html.user-theme-active div[class*="bg-neutral-800"].border {
        background-color: ${panel} !important;
      }
      
      /* Cards and content blocks */
      html.user-theme-active .rounded-lg.bg-neutral-800,
      html.user-theme-active .p-4.rounded-lg.bg-neutral-800 {
        background-color: ${panel} !important;
      }
      
      /* Text colors */
      html.user-theme-active .text-neutral-100,
      html.user-theme-active .text-neutral-50,
      html.user-theme-active .text-white {
        color: ${text} !important;
      }
      
      html.user-theme-active .text-neutral-400,
      html.user-theme-active .text-neutral-500 {
        color: ${textMuted} !important;
      }
      
      /* Gray text classes - common for descriptions */
      html.user-theme-active .text-gray-300,
      html.user-theme-active .text-gray-400,
      html.user-theme-active .text-gray-500,
      html.user-theme-active .text-gray-600 {
        color: ${textMuted} !important;
      }
      
      /* Blog post meta and descriptions - these have hardcoded colors in themes */
      html.user-theme-active .post-meta,
      html.user-theme-active .post-meta-description {
        color: ${textMuted} !important;
      }
      
      /* Borders */
      html.user-theme-active .border-neutral-700,
      html.user-theme-active .border-neutral-600 {
        border-color: ${uiBorder} !important;
      }
      
      /* Accent colors for links and active states */
      html.user-theme-active .text-blue-500,
      html.user-theme-active .border-blue-500 {
        color: ${accent} !important;
        border-color: ${accent} !important;
      }
      
      /* Input fields */
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
      
      /* Lesson player overrides - these have hardcoded dark colors */
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
      
      /* Module cards in lesson player */
      html.user-theme-active .module-card,
      html.user-theme-active [class*="bg-neutral"],
      html.user-theme-active [class*="bg-gray"],
      html.user-theme-active [class*="bg-slate"],
      html.user-theme-active [class*="bg-zinc"] {
        background-color: ${panel} !important;
        color: ${text} !important;
      }
      
      /* All headings and paragraphs */
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
      
      /* Except for buttons and special elements */
      html.user-theme-active button,
      html.user-theme-active .btn,
      html.user-theme-active a.btn {
        color: inherit !important;
      }
    `;
  }

  // Google Translate integration
  function applyLanguage(langCode) {
    // Store the selected language
    document.documentElement.setAttribute('data-translate-lang', langCode);
    
    // Add CSS to hide Google Translate bar (injected once)
    if (!document.getElementById('google-translate-hide-css')) {
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
    
    // Clear any existing Google Translate cookies first
    clearGoogleTranslateCookies();
    
    if (!langCode) {
      // Remove translation - reset to original
      removeGoogleTranslate();
      return;
    }

    // Set the Google Translate cookie to the desired language
    const domain = window.location.hostname;
    document.cookie = `googtrans=/en/${langCode}; path=/`;
    document.cookie = `googtrans=/en/${langCode}; path=/; domain=${domain}`;
    document.cookie = `googtrans=/en/${langCode}; path=/; domain=.${domain}`;

    // Initialize Google Translate if not already loaded
    if (!window.googleTranslateElementInit) {
      window.googleTranslateElementInit = function() {
        new google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: Object.keys(LANGUAGES).filter(k => k).join(','),
          layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        }, 'google_translate_element');
      };
    }

    // Create hidden container for Google Translate widget
    if (!document.getElementById('google_translate_element')) {
      const container = document.createElement('div');
      container.id = 'google_translate_element';
      container.style.cssText = 'position: fixed; top: -9999px; left: -9999px; visibility: hidden;';
      document.body.appendChild(container);
    }

    // Load Google Translate script if not present
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.head.appendChild(script);
    }

    // Wait for Google Translate to be ready, then trigger translation
    const attemptTranslation = (attempts = 0) => {
      if (attempts > 50) return; // Give up after 5 seconds
      
      const select = document.querySelector('.goog-te-combo');
      if (select) {
        select.value = langCode;
        select.dispatchEvent(new Event('change'));
      } else {
        setTimeout(() => attemptTranslation(attempts + 1), 100);
      }
    };
    
    setTimeout(() => attemptTranslation(), 500);
  }

  function clearGoogleTranslateCookies() {
    const domain = window.location.hostname;
    // Clear all possible googtrans cookie variations
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain}`;
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.localhost';
  }

  function removeGoogleTranslate() {
    clearGoogleTranslateCookies();
    
    // Try to reset Google Translate to show original via the select dropdown
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = '';
      select.dispatchEvent(new Event('change'));
    }
    
    // Try clicking the "Show original" button in the banner frame
    try {
      const frame = document.querySelector('.goog-te-banner-frame');
      if (frame && frame.contentDocument) {
        const restoreBtn = frame.contentDocument.querySelector('.goog-te-button button');
        if (restoreBtn) restoreBtn.click();
      }
    } catch (e) {
      // Cross-origin frame access may fail, that's okay
    }
    
    // If translation is still stuck, we need to reload the page
    // Check if page is currently translated
    const isTranslated = document.documentElement.classList.contains('translated-ltr') || 
                         document.documentElement.classList.contains('translated-rtl') ||
                         document.querySelector('html.translated-ltr, html.translated-rtl');
    
    if (isTranslated) {
      // Force reload to clear translation
      window.location.reload();
    }
  }

  // Text-to-Speech functionality
  function getTTSSettings() {
    const prefs = loadStoredPreferences() || {};
    return {
      voice: prefs.ttsVoice || '',
      rate: parseFloat(prefs.ttsRate) || 1,
      pitch: parseFloat(prefs.ttsPitch) || 1,
      volume: parseFloat(prefs.ttsVolume) || 1
    };
  }

  function speak(text, options = {}) {
    if (!('speechSynthesis' in window)) {
      console.warn('Text-to-speech not supported in this browser');
      return null;
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const settings = getTTSSettings();
    const utterance = new SpeechSynthesisUtterance(text);

    // Apply saved voice
    const voiceName = options.voice || settings.voice;
    if (voiceName) {
      const voices = speechSynthesis.getVoices();
      const voice = voices.find(v => v.name === voiceName);
      if (voice) utterance.voice = voice;
    }

    // Apply settings (options override saved settings)
    utterance.rate = options.rate !== undefined ? options.rate : settings.rate;
    utterance.pitch = options.pitch !== undefined ? options.pitch : settings.pitch;
    utterance.volume = options.volume !== undefined ? options.volume : settings.volume;

    speechSynthesis.speak(utterance);
    return utterance;
  }

  function speakSelection() {
    const selection = window.getSelection();
    const text = selection ? selection.toString().trim() : '';
    if (text) {
      speak(text);
      return true;
    }
    return false;
  }

  function stopSpeaking() {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  }

  function isSpeaking() {
    return 'speechSynthesis' in window && speechSynthesis.speaking;
  }

  function resetPreferences() {
    const root = document.documentElement;
    root.classList.remove('user-theme-active');

    // Remove injected CSS
    const overrideStyle = document.getElementById('user-theme-override-css');
    if (overrideStyle) {
      overrideStyle.remove();
    }

    const props = [
      '--pref-bg-color',
      '--pref-text-color',
      '--pref-font-family',
      '--pref-font-size',
      '--pref-accent-color',
      '--pref-selection-color',
      '--pref-cursor-style',
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
    applyLanguage,
    PRESETS,
    LANGUAGES,
    // TTS functions
    speak,
    speakSelection,
    stopSpeaking,
    isSpeaking,
    getTTSSettings,
  };

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();