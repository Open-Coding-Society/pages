/**
 * Dashboard Preferences Module — SRP + Class-based architecture.
 * 
 * This module manages all user preferences for the dashboard including:
 * - Theme colors, fonts, and display settings
 * - Text-to-speech configuration
 * - Language/translation preferences
 * - Preset and custom themes
 * - Backend API synchronization
 * 
 * Classes (Single Responsibility each):
 *   PreferencesConfig    – Shared constants & defaults
 *   FormatConverter      – frontend ↔ backend format conversion
 *   PreferencesAPI       – All fetch() calls to the backend
 *   PreferencesStore     – localStorage + caching layer
 *   FormManager          – Read / populate the HTML form
 *   ThemeRenderer        – Render preset & custom theme buttons
 *   TTSPanel             – TTS voice dropdown & test button
 *   TranslationHelper    – Cookie cleanup & clean reload
 *   StatusDisplay        – Flash status messages
 *   PreferencesController – Orchestrator: wires everything, handles events
 */

// ============================================
// CONFIGURATION: Shared constants
// ============================================
export class PreferencesConfig {
    static SITE_DEFAULT = {
        bg: '#121212',
        text: '#F0F0F0',
        font: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
        size: 14,
        accent: '#4CAFEF'
    };

    static PRESETS = window.SitePreferences?.PRESETS || {
        'Site Default': PreferencesConfig.SITE_DEFAULT,
        'Midnight': { bg: '#0b1220', text: '#e6eef8', font: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial", size: 14, accent: '#3b82f6' },
        'Light': { bg: '#ffffff', text: '#0f172a', font: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial", size: 14, accent: '#2563eb' },
        'Green': { bg: '#154734', text: '#e6f6ef', font: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial", size: 14, accent: '#10b981' },
        'Sepia': { bg: '#f4ecd8', text: '#3b2f2f', font: "Georgia, 'Times New Roman', Times, serif", size: 14, accent: '#b45309' },
        'Cyberpunk': { bg: '#0a0a0f', text: '#f0f0f0', font: "'Source Code Pro', monospace", size: 14, accent: '#f72585' },
        'Ocean': { bg: '#0c1929', text: '#e0f2fe', font: "'Open Sans', Arial, sans-serif", size: 15, accent: '#06b6d4' }
    };

    static MAX_CUSTOM = 10;
    static LOCAL_STORAGE_KEY = 'sitePreferences';
    static LOCAL_THEMES_KEY = 'siteThemes';
}

// ============================================
// RESPONSIBILITY: Convert between frontend & backend formats
// ============================================
export class FormatConverter {
    /** Frontend prefs → backend payload */
    static toBackend(prefs) {
        return {
            backgroundColor: prefs.bg,
            textColor: prefs.text,
            fontFamily: prefs.font,
            fontSize: prefs.size,
            accentColor: prefs.accent,
            selectionColor: prefs.selectionColor || '#3b82f6',
            buttonStyle: prefs.buttonStyle || 'rounded',
            language: prefs.language || '',
            ttsVoice: prefs.ttsVoice || '',
            ttsRate: prefs.ttsRate || 1.0,
            ttsPitch: prefs.ttsPitch || 1.0,
            ttsVolume: prefs.ttsVolume || 1.0,
            customThemes: JSON.stringify(prefs.customThemes || {})
        };
    }

    /** Backend payload → frontend prefs (returns null when data is empty) */
    static toFrontend(backendPrefs) {
        if (!backendPrefs) return null;

        const hasBg = backendPrefs.backgroundColor && backendPrefs.backgroundColor !== '';
        const hasText = backendPrefs.textColor && backendPrefs.textColor !== '';
        if (!hasBg && !hasText) return null;

        let customThemes = {};
        try { customThemes = backendPrefs.customThemes ? JSON.parse(backendPrefs.customThemes) : {}; }
        catch (_) { customThemes = {}; }

        const d = PreferencesConfig.SITE_DEFAULT;
        return {
            bg: backendPrefs.backgroundColor || d.bg,
            text: backendPrefs.textColor || d.text,
            font: backendPrefs.fontFamily || d.font,
            size: backendPrefs.fontSize || d.size,
            accent: backendPrefs.accentColor || d.accent,
            selectionColor: backendPrefs.selectionColor || d.accent,
            buttonStyle: backendPrefs.buttonStyle || 'rounded',
            language: backendPrefs.language || '',
            ttsVoice: backendPrefs.ttsVoice || '',
            ttsRate: backendPrefs.ttsRate || 1.0,
            ttsPitch: backendPrefs.ttsPitch || 1.0,
            ttsVolume: backendPrefs.ttsVolume || 1.0,
            customThemes
        };
    }
}

// ============================================
// RESPONSIBILITY: All backend fetch() calls
// ============================================
export class PreferencesAPI {
    static isLoggedIn = false;
    static backendPrefsExist = false;
    static javaURI = null;
    static fetchOptions = null;

    /** Initialize with API config */
    static init(javaURI, fetchOptions) {
        PreferencesAPI.javaURI = javaURI;
        PreferencesAPI.fetchOptions = fetchOptions;
    }

    /** Check login by hitting the person endpoint */
    static async checkLoginStatus() {
        try {
            const res = await fetch(`${PreferencesAPI.javaURI}/api/person/get`, PreferencesAPI.fetchOptions);
            PreferencesAPI.isLoggedIn = res.ok;
            return res.ok;
        } catch (_) {
            console.log('Login check failed, assuming guest user');
            PreferencesAPI.isLoggedIn = false;
            return false;
        }
    }

    /** Fetch preferences from backend (returns frontend-format or null) */
    static async fetchPreferences() {
        try {
            const res = await fetch(`${PreferencesAPI.javaURI}/api/user/preferences`, PreferencesAPI.fetchOptions);

            if (res.status === 401) {
                PreferencesAPI.isLoggedIn = false;
                return null;
            }
            if (res.ok) {
                PreferencesAPI.isLoggedIn = true;
                const data = await res.json();
                if (data && data.id) {
                    PreferencesAPI.backendPrefsExist = true;
                    return FormatConverter.toFrontend(data);
                }
                PreferencesAPI.backendPrefsExist = false;
                return null;
            }
            return null;
        } catch (e) {
            console.error('fetchPreferences error', e);
            PreferencesAPI.isLoggedIn = false;
            return null;
        }
    }

    /** Save (POST or PUT) preferences to backend */
    static async savePreferences(prefs) {
        try {
            const method = PreferencesAPI.backendPrefsExist ? 'PUT' : 'POST';
            const res = await fetch(`${PreferencesAPI.javaURI}/api/user/preferences`, {
                ...PreferencesAPI.fetchOptions,
                method,
                body: JSON.stringify(FormatConverter.toBackend(prefs))
            });
            if (res.ok) { PreferencesAPI.backendPrefsExist = true; return true; }
            return false;
        } catch (e) {
            console.error('savePreferences error', e);
            return false;
        }
    }

    /** Delete preferences from backend */
    static async deletePreferences() {
        try {
            const res = await fetch(`${PreferencesAPI.javaURI}/api/user/preferences`, {
                ...PreferencesAPI.fetchOptions,
                method: 'DELETE'
            });
            if (res.ok) { PreferencesAPI.backendPrefsExist = false; return true; }
            return false;
        } catch (e) {
            console.error('deletePreferences error', e);
            return false;
        }
    }
}

// ============================================
// RESPONSIBILITY: localStorage + in-memory cache
// ============================================
export class PreferencesStore {
    static cachedPrefs = null;

    /** Apply prefs via the global SitePreferences engine */
    static applyToPage(prefs) {
        if (window.SitePreferences?.applyPreferences) {
            window.SitePreferences.applyPreferences(prefs);
        }
    }

    /**
     * Load preferences: reset-flag → backend → localStorage → null.
     * Also applies them to the page and syncs localStorage.
     */
    static async load() {
        try {
            const wasReset = localStorage.getItem('preferencesReset');
            if (wasReset === 'true') {
                localStorage.removeItem('preferencesReset');
                return null;
            }

            const loggedIn = await PreferencesAPI.checkLoginStatus();
            if (loggedIn) {
                const backendPrefs = await PreferencesAPI.fetchPreferences();
                if (backendPrefs) {
                    PreferencesStore.cachedPrefs = backendPrefs;
                    PreferencesStore.applyToPage(backendPrefs);
                    localStorage.setItem(PreferencesConfig.LOCAL_STORAGE_KEY, JSON.stringify(backendPrefs));
                    return backendPrefs;
                }
            }

            const raw = localStorage.getItem(PreferencesConfig.LOCAL_STORAGE_KEY);
            if (raw) {
                const prefs = JSON.parse(raw);
                PreferencesStore.cachedPrefs = prefs;
                PreferencesStore.applyToPage(prefs);
                return prefs;
            }
            return null;
        } catch (e) {
            console.error('loadPreferences error', e);
            return null;
        }
    }

    /** Save prefs to cache + localStorage + backend (if logged in) */
    static async save(prefs) {
        try {
            PreferencesStore.cachedPrefs = prefs;
            PreferencesStore.applyToPage(prefs);
            FormManager.populate(prefs);

            localStorage.removeItem('preferencesReset');
            localStorage.setItem(PreferencesConfig.LOCAL_STORAGE_KEY, JSON.stringify(prefs));

            if (PreferencesAPI.isLoggedIn) {
                const ok = await PreferencesAPI.savePreferences(prefs);
                if (!ok) StatusDisplay.show('Saved locally (backend unavailable)');
            }
        } catch (e) {
            console.error('savePreferences error', e);
            localStorage.setItem(PreferencesConfig.LOCAL_STORAGE_KEY, JSON.stringify(prefs));
        }
    }

    /** Load custom themes from cache or localStorage */
    static loadThemes() {
        if (PreferencesStore.cachedPrefs?.customThemes) {
            return PreferencesStore.cachedPrefs.customThemes;
        }
        try {
            const raw = localStorage.getItem(PreferencesConfig.LOCAL_THEMES_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch (_) { return {}; }
    }

    /** Save custom themes (embedded in the preferences object) */
    static async saveThemes(themesObj) {
        try {
            const current = PreferencesStore.cachedPrefs
                || await PreferencesStore.load()
                || { ...PreferencesConfig.SITE_DEFAULT };
            current.customThemes = themesObj;
            await PreferencesStore.save(current);
            localStorage.setItem(PreferencesConfig.LOCAL_THEMES_KEY, JSON.stringify(themesObj));
        } catch (e) {
            console.error('saveThemes error', e);
            localStorage.setItem(PreferencesConfig.LOCAL_THEMES_KEY, JSON.stringify(themesObj));
        }
    }
}

// ============================================
// RESPONSIBILITY: Read / populate the HTML form
// ============================================
export class FormManager {
    /** Read every form input into a prefs object */
    static readValues() {
        return {
            bg: document.getElementById('pref-bg-color').value,
            text: document.getElementById('pref-text-color').value,
            font: document.getElementById('pref-font-family').value,
            size: Number(document.getElementById('pref-font-size').value),
            accent: document.getElementById('pref-accent-color').value,
            language: document.getElementById('pref-language').value,
            ttsVoice: document.getElementById('pref-tts-voice').value,
            ttsRate: Number(document.getElementById('pref-tts-rate').value),
            ttsPitch: Number(document.getElementById('pref-tts-pitch').value),
            ttsVolume: Number(document.getElementById('pref-tts-volume').value),
            selectionColor: document.getElementById('pref-selection-color').value,
            buttonStyle: document.getElementById('pref-button-style').value,
            customThemes: PreferencesStore.loadThemes()
        };
    }

    /** Push a prefs object into every form input */
    static populate(prefs) {
        if (!prefs) return;
        const d = PreferencesConfig.SITE_DEFAULT;
        document.getElementById('pref-bg-color').value = prefs.bg || d.bg;
        document.getElementById('pref-text-color').value = prefs.text || d.text;
        document.getElementById('pref-font-family').value = prefs.font || d.font;
        document.getElementById('pref-font-size').value = prefs.size || d.size;
        document.getElementById('font-size-label').textContent = prefs.size || d.size;
        document.getElementById('pref-accent-color').value = prefs.accent || d.accent;
        document.getElementById('pref-language').value = prefs.language || '';

        if (prefs.ttsVoice) document.getElementById('pref-tts-voice').value = prefs.ttsVoice;
        document.getElementById('pref-tts-rate').value = prefs.ttsRate || 1;
        document.getElementById('tts-rate-label').textContent = prefs.ttsRate || 1.0;
        document.getElementById('pref-tts-pitch').value = prefs.ttsPitch || 1;
        document.getElementById('tts-pitch-label').textContent = prefs.ttsPitch || 1.0;
        document.getElementById('pref-tts-volume').value = prefs.ttsVolume || 1;
        document.getElementById('tts-volume-label').textContent = Math.round((prefs.ttsVolume || 1) * 100);

        document.getElementById('pref-selection-color').value = prefs.selectionColor || '#3b82f6';
        document.getElementById('pref-button-style').value = prefs.buttonStyle || 'rounded';
    }
}

// ============================================
// RESPONSIBILITY: Flash a status message
// ============================================
export class StatusDisplay {
    static show(msg) {
        const el = document.getElementById('preferences-status');
        if (!el) return;
        el.textContent = msg;
        setTimeout(() => { el.textContent = ''; }, 2500);
    }
}

// ============================================
// RESPONSIBILITY: Render preset & custom theme buttons
// ============================================
export class ThemeRenderer {
    /** Build preset theme buttons in #preset-themes */
    static renderPresets() {
        const container = document.getElementById('preset-themes');
        if (!container) return;
        container.innerHTML = '';

        Object.keys(PreferencesConfig.PRESETS).forEach(name => {
            const p = PreferencesConfig.PRESETS[name];
            const btn = document.createElement('button');
            btn.className = 'px-3 py-2 rounded bg-neutral-700 hover:bg-neutral-600 text-white text-sm flex items-center gap-2';
            btn.innerHTML = `<span class="w-3 h-3 rounded-full" style="background:${p.accent}"></span> ${name}`;
            btn.addEventListener('click', async () => {
                const currentLang = document.getElementById('pref-language')?.value || PreferencesStore.cachedPrefs?.language || '';
                const currentTTS = {
                    ttsVoice: PreferencesStore.cachedPrefs?.ttsVoice || '',
                    ttsRate: PreferencesStore.cachedPrefs?.ttsRate || 1.0,
                    ttsPitch: PreferencesStore.cachedPrefs?.ttsPitch || 1.0,
                    ttsVolume: PreferencesStore.cachedPrefs?.ttsVolume || 1.0
                };
                await PreferencesStore.save({
                    ...p,
                    language: currentLang,
                    ...currentTTS,
                    customThemes: PreferencesStore.loadThemes()
                });
                StatusDisplay.show('Applied: ' + name + ' - Reloading...');
                setTimeout(() => TranslationHelper.cleanReload(), 200);
            });
            container.appendChild(btn);
        });
    }

    /** Build custom theme buttons in #custom-themes */
    static renderCustom() {
        const container = document.getElementById('custom-themes');
        if (!container) return;
        container.innerHTML = '';

        const themes = PreferencesStore.loadThemes();
        const keys = Object.keys(themes);
        if (!keys.length) {
            container.innerHTML = '<p class="text-neutral-500 text-sm">No custom themes yet</p>';
            return;
        }

        keys.forEach(name => {
            const theme = themes[name];
            const wrap = document.createElement('div');
            wrap.className = 'flex gap-2';

            const btn = document.createElement('button');
            btn.className = 'flex-1 px-3 py-2 rounded bg-neutral-700 hover:bg-neutral-600 text-white text-sm text-left flex items-center gap-2';
            btn.innerHTML = `<span class="w-3 h-3 rounded-full" style="background:${theme.accent || '#3b82f6'}"></span> ${name}`;
            btn.addEventListener('click', async () => {
                const currentLang = document.getElementById('pref-language')?.value || PreferencesStore.cachedPrefs?.language || '';
                const currentTTS = {
                    ttsVoice: PreferencesStore.cachedPrefs?.ttsVoice || '',
                    ttsRate: PreferencesStore.cachedPrefs?.ttsRate || 1.0,
                    ttsPitch: PreferencesStore.cachedPrefs?.ttsPitch || 1.0,
                    ttsVolume: PreferencesStore.cachedPrefs?.ttsVolume || 1.0
                };
                await PreferencesStore.save({
                    ...theme,
                    language: currentLang,
                    ...currentTTS,
                    customThemes: PreferencesStore.loadThemes()
                });
                StatusDisplay.show('Applied: ' + name + ' - Reloading...');
                setTimeout(() => TranslationHelper.cleanReload(), 200);
            });

            const del = document.createElement('button');
            del.className = 'px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs';
            del.textContent = 'X';
            del.title = 'Delete';
            del.addEventListener('click', async () => {
                const t = PreferencesStore.loadThemes();
                if (t[name]) delete t[name];
                await PreferencesStore.saveThemes(t);
                ThemeRenderer.renderCustom();
                StatusDisplay.show('Deleted: ' + name);
            });

            wrap.appendChild(btn);
            wrap.appendChild(del);
            container.appendChild(wrap);
        });
    }

    /** Save current form values as a named custom theme */
    static async saveThemeAs(name) {
        if (!name) { StatusDisplay.show('Enter a theme name'); return; }
        const themes = PreferencesStore.loadThemes();
        if (Object.keys(themes).length >= PreferencesConfig.MAX_CUSTOM && !themes[name]) {
            StatusDisplay.show('Max themes reached');
            return;
        }
        themes[name] = FormManager.readValues();
        await PreferencesStore.saveThemes(themes);
        ThemeRenderer.renderCustom();
        StatusDisplay.show('Saved: ' + name);
        document.getElementById('new-theme-name').value = '';
    }
}

// ============================================
// RESPONSIBILITY: TTS voices & test button
// ============================================
export class TTSPanel {
    /** Populate the voice <select> with available browser voices */
    static populateVoices() {
        const select = document.getElementById('pref-tts-voice');
        if (!select) return;

        const voices = speechSynthesis.getVoices();
        select.innerHTML = '';

        if (voices.length === 0) {
            select.innerHTML = '<option value="">No voices available</option>';
            return;
        }

        const defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.textContent = 'Default Voice';
        select.appendChild(defaultOpt);

        const voicesByLang = {};
        voices.forEach(v => {
            const lang = v.lang.split('-')[0];
            if (!voicesByLang[lang]) voicesByLang[lang] = [];
            voicesByLang[lang].push(v);
        });

        Object.keys(voicesByLang)
            .sort((a, b) => { if (a === 'en') return -1; if (b === 'en') return 1; return a.localeCompare(b); })
            .forEach(lang => {
                const group = document.createElement('optgroup');
                group.label = lang.toUpperCase();
                voicesByLang[lang].forEach(voice => {
                    const opt = document.createElement('option');
                    opt.value = voice.name;
                    opt.textContent = `${voice.name} (${voice.lang})`;
                    group.appendChild(opt);
                });
                select.appendChild(group);
            });

        if (PreferencesStore.cachedPrefs?.ttsVoice) {
            select.value = PreferencesStore.cachedPrefs.ttsVoice;
        }
    }

    /** Speak the test-text input using current form TTS settings */
    static test() {
        if (!('speechSynthesis' in window)) {
            StatusDisplay.show('Text-to-speech not supported');
            return;
        }
        speechSynthesis.cancel();

        const text = document.getElementById('tts-test-text').value || 'Hello, this is a test.';
        const utterance = new SpeechSynthesisUtterance(text);

        const voiceName = document.getElementById('pref-tts-voice').value;
        if (voiceName) {
            const voice = speechSynthesis.getVoices().find(v => v.name === voiceName);
            if (voice) utterance.voice = voice;
        }

        utterance.rate = Number(document.getElementById('pref-tts-rate').value) || 1;
        utterance.pitch = Number(document.getElementById('pref-tts-pitch').value) || 1;
        utterance.volume = Number(document.getElementById('pref-tts-volume').value) || 1;

        speechSynthesis.speak(utterance);
    }
}

// ============================================
// RESPONSIBILITY: Cookie cleanup & clean reload
// ============================================
export class TranslationHelper {
    /** Wipe every googtrans cookie variant & remove GT DOM elements */
    static clearCookies() {
        const domain = window.location.hostname;
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`;
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain}`;
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.localhost';
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
        document.cookie = 'googtrans=/en/en; path=/;';
        document.cookie = `googtrans=/en/en; path=/; domain=${domain}`;
        document.cookie = `googtrans=/en/en; path=/; domain=.${domain}`;

        const gtFrame = document.querySelector('.goog-te-banner-frame');
        if (gtFrame) gtFrame.remove();
        const gtMenu = document.querySelector('.goog-te-menu-frame');
        if (gtMenu) gtMenu.remove();

        document.body.style.top = '';
        document.body.classList.remove('translated-ltr', 'translated-rtl');
    }

    /** Clear cookies then navigate to a clean URL */
    static cleanReload() {
        TranslationHelper.clearCookies();
        window.location.href = window.location.href.split('#')[0];
    }
}

// ============================================
// RESPONSIBILITY: Save a specific section of prefs
// ============================================
export class SectionSaver {
    /** Merge a section's form values into the current prefs and save */
    static async save(section) {
        const current = PreferencesStore.cachedPrefs
            || await PreferencesStore.load()
            || { ...PreferencesConfig.SITE_DEFAULT };
        const form = FormManager.readValues();

        if (section === 'text') {
            current.font = form.font;
            current.size = form.size;
            current.text = form.text;
        } else if (section === 'colors') {
            current.bg = form.bg;
            current.accent = form.accent;
            current.selectionColor = form.selectionColor;
            current.buttonStyle = form.buttonStyle;
        } else if (section === 'tts') {
            current.ttsVoice = form.ttsVoice;
            current.ttsRate = form.ttsRate;
            current.ttsPitch = form.ttsPitch;
            current.ttsVolume = form.ttsVolume;
        }

        current.customThemes = PreferencesStore.loadThemes();
        await PreferencesStore.save(current);
        StatusDisplay.show('Saved ' + section);
    }
}

// ============================================
// ORCHESTRATOR: Wires everything, attaches events
// ============================================
export class PreferencesController {
    /** Main initialisation — called on DOMContentLoaded */
    static async init() {
        // Step 1: Load & apply saved preferences
        const saved = await PreferencesStore.load();

        // Step 2: Render theme buttons
        ThemeRenderer.renderPresets();
        ThemeRenderer.renderCustom();

        // Step 3: Initialise TTS voice list
        if ('speechSynthesis' in window) {
            TTSPanel.populateVoices();
            speechSynthesis.onvoiceschanged = TTSPanel.populateVoices;
        }

        // Step 4: Populate form
        FormManager.populate(saved || PreferencesConfig.SITE_DEFAULT);

        // Step 5: Login status hint
        if (PreferencesAPI.isLoggedIn) {
            StatusDisplay.show(saved ? 'Preferences synced from your account' : 'No saved preferences found - using defaults');
        }

        // Step 6: Wire up all event listeners
        PreferencesController._bindSliderLabels();
        PreferencesController._bindButtons();
        PreferencesController._bindLivePreview();
    }

    // --- Private helper: slider label updates ---
    static _bindSliderLabels() {
        document.getElementById('pref-font-size').addEventListener('input', e => {
            document.getElementById('font-size-label').textContent = e.target.value;
        });
        document.getElementById('pref-tts-rate').addEventListener('input', e => {
            document.getElementById('tts-rate-label').textContent = e.target.value;
        });
        document.getElementById('pref-tts-pitch').addEventListener('input', e => {
            document.getElementById('tts-pitch-label').textContent = e.target.value;
        });
        document.getElementById('pref-tts-volume').addEventListener('input', e => {
            document.getElementById('tts-volume-label').textContent = Math.round(e.target.value * 100);
        });
    }

    // --- Private helper: button click handlers ---
    static _bindButtons() {
        // TTS test
        document.getElementById('tts-test-btn').addEventListener('click', TTSPanel.test);

        // Section save buttons
        document.querySelectorAll('.save-section-btn').forEach(btn => {
            btn.addEventListener('click', async function () {
                await SectionSaver.save(this.dataset.section);
                StatusDisplay.show('Saved! Reloading...');
                setTimeout(() => TranslationHelper.cleanReload(), 200);
            });
        });

        // Save All
        document.getElementById('save-preferences').addEventListener('click', async () => {
            await PreferencesStore.save(FormManager.readValues());
            StatusDisplay.show('Preferences saved! Reloading...');
            setTimeout(() => TranslationHelper.cleanReload(), 200);
        });

        // Reset
        document.getElementById('restore-styles').addEventListener('click', async () => {
            if (PreferencesAPI.isLoggedIn) {
                const deleted = await PreferencesAPI.deletePreferences();
                if (!deleted) {
                    StatusDisplay.show('Failed to delete from server, trying again...');
                    await PreferencesAPI.deletePreferences();
                }
            }

            localStorage.removeItem(PreferencesConfig.LOCAL_STORAGE_KEY);
            localStorage.removeItem(PreferencesConfig.LOCAL_THEMES_KEY);
            localStorage.setItem('preferencesReset', 'true');
            PreferencesStore.cachedPrefs = null;
            PreferencesAPI.backendPrefsExist = false;

            if (window.SitePreferences?.resetPreferences) {
                window.SitePreferences.resetPreferences();
            }

            FormManager.populate(PreferencesConfig.SITE_DEFAULT);
            document.getElementById('pref-language').value = '';

            StatusDisplay.show('Preferences reset! Reloading...');
            setTimeout(() => TranslationHelper.cleanReload(), 300);
        });

        // Custom theme save / enter-key
        document.getElementById('save-theme-btn').addEventListener('click', async () => {
            await ThemeRenderer.saveThemeAs(document.getElementById('new-theme-name').value.trim());
        });
        document.getElementById('new-theme-name').addEventListener('keypress', async e => {
            if (e.key === 'Enter') await ThemeRenderer.saveThemeAs(e.target.value.trim());
        });
    }

    // --- Private helper: live preview for selection-color & button-style ---
    static _bindLivePreview() {
        ['pref-selection-color', 'pref-button-style'].forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            const handler = () => {
                const stored = localStorage.getItem(PreferencesConfig.LOCAL_STORAGE_KEY);
                if (!stored && !PreferencesStore.cachedPrefs) return;
                const current = PreferencesStore.cachedPrefs || (stored ? JSON.parse(stored) : null);
                if (!current) return;
                const form = FormManager.readValues();
                current.selectionColor = form.selectionColor;
                current.buttonStyle = form.buttonStyle;
                PreferencesStore.applyToPage(current);
            };
            el.addEventListener('change', handler);
            el.addEventListener('input', handler);
        });
    }
}

// ============================================
// PUBLIC API: Initialize the preferences module
// ============================================
export function initializePreferences(javaURI, fetchOptions) {
    // Initialize API config
    PreferencesAPI.init(javaURI, fetchOptions);

    // Boot orchestrator on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => PreferencesController.init());

    // Expose global functions for compatibility
    window.loadPreferences = () => PreferencesStore.load();
    window.checkLoginStatus = () => PreferencesAPI.checkLoginStatus();

    // Early localStorage flash (before DOMContentLoaded)
    try {
        const wasReset = localStorage.getItem('preferencesReset');
        if (wasReset !== 'true') {
            const raw = localStorage.getItem(PreferencesConfig.LOCAL_STORAGE_KEY);
            if (raw) {
                const prefs = JSON.parse(raw);
                PreferencesStore.cachedPrefs = prefs;
                PreferencesStore.applyToPage(prefs);
            }
        }
    } catch (e) {
        console.error('Initial localStorage load error', e);
    }
}
