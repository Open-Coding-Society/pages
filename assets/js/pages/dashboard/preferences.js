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
 * Classes use standard get/set naming where applicable:
 *   PreferencesConfig    – Shared constants & defaults
 *   FormatConverter      – frontend ↔ backend format conversion (toBackend / toFrontend)
 *   PreferencesAPI       – Backend fetch: get(), set(), delete(), checkLogin()
 *   PreferencesStore     – Cache layer: get(), set(), getThemes(), setThemes(), apply()
 *   FormManager          – HTML form: get() reads inputs, set() populates inputs
 *   ThemeRenderer        – Preset/custom buttons: setPresets(), setCustom(), set(name)
 *   TTSPanel             – Voice list: set() populates, test() speaks sample
 *   TranslationHelper    – Cookie cleanup & clean reload
 *   StatusDisplay        – Flash messages: set(msg)
 *   SectionSaver         – Section-level save: set(section)
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
    static async checkLogin() {
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
    static async get() {
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
    static async set(prefs) {
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
    static async delete() {
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
    static apply(prefs) {
        if (window.SitePreferences?.applyPreferences) {
            window.SitePreferences.applyPreferences(prefs);
        }
    }

    /**
     * Load preferences: reset-flag → backend → localStorage → null.
     * Also applies them to the page and syncs localStorage.
     */
    static async get() {
        try {
            const wasReset = localStorage.getItem('preferencesReset');
            if (wasReset === 'true') {
                localStorage.removeItem('preferencesReset');
                return null;
            }

            const loggedIn = await PreferencesAPI.checkLogin();
            if (loggedIn) {
                const backendPrefs = await PreferencesAPI.get();
                if (backendPrefs) {
                    PreferencesStore.cachedPrefs = backendPrefs;
                    PreferencesStore.apply(backendPrefs);
                    localStorage.setItem(PreferencesConfig.LOCAL_STORAGE_KEY, JSON.stringify(backendPrefs));
                    return backendPrefs;
                }
            }

            const raw = localStorage.getItem(PreferencesConfig.LOCAL_STORAGE_KEY);
            if (raw) {
                const prefs = JSON.parse(raw);
                PreferencesStore.cachedPrefs = prefs;
                PreferencesStore.apply(prefs);
                return prefs;
            }
            return null;
        } catch (e) {
            console.error('loadPreferences error', e);
            return null;
        }
    }

    /** Save prefs to cache + localStorage + backend (if logged in) */
    static async set(prefs) {
        try {
            PreferencesStore.cachedPrefs = prefs;
            PreferencesStore.apply(prefs);
            FormManager.set(prefs);

            localStorage.removeItem('preferencesReset');
            localStorage.setItem(PreferencesConfig.LOCAL_STORAGE_KEY, JSON.stringify(prefs));

            if (PreferencesAPI.isLoggedIn) {
                const ok = await PreferencesAPI.set(prefs);
                if (!ok) StatusDisplay.set('Saved locally (backend unavailable)');
            }
        } catch (e) {
            console.error('savePreferences error', e);
            localStorage.setItem(PreferencesConfig.LOCAL_STORAGE_KEY, JSON.stringify(prefs));
        }
    }

    /** Load custom themes from cache or localStorage */
    static getThemes() {
        if (PreferencesStore.cachedPrefs?.customThemes) {
            return PreferencesStore.cachedPrefs.customThemes;
        }
        try {
            const raw = localStorage.getItem(PreferencesConfig.LOCAL_THEMES_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch (_) { return {}; }
    }

    /** Save custom themes (embedded in the preferences object) */
    static async setThemes(themesObj) {
        try {
            const current = PreferencesStore.cachedPrefs
                || await PreferencesStore.get()
                || { ...PreferencesConfig.SITE_DEFAULT };
            current.customThemes = themesObj;
            await PreferencesStore.set(current);
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
    static get() {
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
            customThemes: PreferencesStore.getThemes()
        };
    }

    /** Push a prefs object into every form input */
    static set(prefs) {
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
    static set(msg) {
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
    static setPresets() {
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
                await PreferencesStore.set({
                    ...p,
                    language: currentLang,
                    ...currentTTS,
                    customThemes: PreferencesStore.getThemes()
                });
                StatusDisplay.set('Applied: ' + name + ' - Reloading...');
                setTimeout(() => TranslationHelper.cleanReload(), 200);
            });
            container.appendChild(btn);
        });
    }

    /** Build custom theme buttons in #custom-themes */
    static setCustom() {
        const container = document.getElementById('custom-themes');
        if (!container) return;
        container.innerHTML = '';

        const themes = PreferencesStore.getThemes();
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
                await PreferencesStore.set({
                    ...theme,
                    language: currentLang,
                    ...currentTTS,
                    customThemes: PreferencesStore.getThemes()
                });
                StatusDisplay.set('Applied: ' + name + ' - Reloading...');
                setTimeout(() => TranslationHelper.cleanReload(), 200);
            });

            const del = document.createElement('button');
            del.className = 'px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs';
            del.textContent = 'X';
            del.title = 'Delete';
            del.addEventListener('click', async () => {
                const t = PreferencesStore.getThemes();
                if (t[name]) delete t[name];
                await PreferencesStore.setThemes(t);
                ThemeRenderer.setCustom();
                StatusDisplay.set('Deleted: ' + name);
            });

            wrap.appendChild(btn);
            wrap.appendChild(del);
            container.appendChild(wrap);
        });
    }

    /** Save current form values as a named custom theme */
    static async set(name) {
        if (!name) { StatusDisplay.set('Enter a theme name'); return; }
        const themes = PreferencesStore.getThemes();
        if (Object.keys(themes).length >= PreferencesConfig.MAX_CUSTOM && !themes[name]) {
            StatusDisplay.set('Max themes reached');
            return;
        }
        themes[name] = FormManager.get();
        await PreferencesStore.setThemes(themes);
        ThemeRenderer.setCustom();
        StatusDisplay.set('Saved: ' + name);
        document.getElementById('new-theme-name').value = '';
    }
}

// ============================================
// RESPONSIBILITY: TTS voices & test button
// ============================================
export class TTSPanel {
    /** Populate the voice <select> with available browser voices */
    static set() {
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
            StatusDisplay.set('Text-to-speech not supported');
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
// RESPONSIBILITY: Head calibration persistence + mapping
// ============================================
export class HeadCalibrationManager {
    static STORAGE_KEY = 'headTrackingCalibration';
    static data = HeadCalibrationManager._defaultCalibration();
    static refs = {
        status: null
    };

    static _defaultCalibration() {
        return {
            centerX: 0.5,
            centerY: 0.5,
            leftX: 0.3,
            rightX: 0.7,
            upY: 0.3,
            downY: 0.7,
            calibrated: false
        };
    }

    static _sanitize(data) {
        const d = HeadCalibrationManager._defaultCalibration();
        const num = (v, fallback) => {
            const n = Number(v);
            if (!Number.isFinite(n)) return fallback;
            return Math.max(0, Math.min(1, n));
        };
        return {
            centerX: num(data?.centerX, d.centerX),
            centerY: num(data?.centerY, d.centerY),
            leftX: num(data?.leftX, d.leftX),
            rightX: num(data?.rightX, d.rightX),
            upY: num(data?.upY, d.upY),
            downY: num(data?.downY, d.downY),
            calibrated: !!data?.calibrated
        };
    }

    static _normalizeUserId(value) {
        if (value === null || value === undefined) return null;
        const normalized = String(value).trim();
        return normalized ? normalized : null;
    }

    static init(statusRef) {
        HeadCalibrationManager.refs.status = statusRef || null;
        HeadCalibrationManager.loadLocal();
    }

    static setStatus(message, isError = false) {
        if (!HeadCalibrationManager.refs.status) return;
        HeadCalibrationManager.refs.status.textContent = message;
        HeadCalibrationManager.refs.status.style.color = isError ? '#f87171' : '';
    }

    static loadLocal() {
        try {
            const raw = localStorage.getItem(HeadCalibrationManager.STORAGE_KEY);
            if (!raw) {
                HeadCalibrationManager.data = HeadCalibrationManager._defaultCalibration();
                return HeadCalibrationManager.data;
            }
            HeadCalibrationManager.data = HeadCalibrationManager._sanitize(JSON.parse(raw));
            return HeadCalibrationManager.data;
        } catch (e) {
            console.error('head calibration load local error', e);
            HeadCalibrationManager.data = HeadCalibrationManager._defaultCalibration();
            return HeadCalibrationManager.data;
        }
    }

    static saveLocal() {
        try {
            localStorage.setItem(HeadCalibrationManager.STORAGE_KEY, JSON.stringify(HeadCalibrationManager.data));
        } catch (e) {
            console.error('head calibration save local error', e);
        }
    }

    static capture(point, rawX, rawY) {
        if (!Number.isFinite(rawX) || !Number.isFinite(rawY)) {
            HeadCalibrationManager.setStatus('No face landmark found. Keep your face in frame and try again.', true);
            return false;
        }

        if (point === 'center') {
            HeadCalibrationManager.data.centerX = rawX;
            HeadCalibrationManager.data.centerY = rawY;
        } else if (point === 'left') {
            HeadCalibrationManager.data.leftX = rawX;
        } else if (point === 'right') {
            HeadCalibrationManager.data.rightX = rawX;
        } else if (point === 'up') {
            HeadCalibrationManager.data.upY = rawY;
        } else if (point === 'down') {
            HeadCalibrationManager.data.downY = rawY;
        }

        const complete = [
            HeadCalibrationManager.data.leftX,
            HeadCalibrationManager.data.rightX,
            HeadCalibrationManager.data.upY,
            HeadCalibrationManager.data.downY
        ].every(Number.isFinite);
        HeadCalibrationManager.data.calibrated = !!complete;
        HeadCalibrationManager.saveLocal();
        HeadCalibrationManager.setStatus(`Captured ${point}.`);
        return true;
    }

    static reset() {
        HeadCalibrationManager.data = HeadCalibrationManager._defaultCalibration();
        HeadCalibrationManager.saveLocal();
        HeadCalibrationManager.setStatus('Calibration reset to defaults.');
    }

    static mapRawToViewport(rawX, rawY) {
        const x = Math.max(0, Math.min(1, rawX));
        const y = Math.max(0, Math.min(1, rawY));
        const c = HeadCalibrationManager.data;

        if (!c?.calibrated) {
            return { x, y };
        }

        const normalize = (value, min, max) => {
            if (!Number.isFinite(min) || !Number.isFinite(max) || Math.abs(max - min) < 0.001) {
                return 0.5;
            }
            return (value - min) / (max - min);
        };

        const nx = normalize(x, c.leftX, c.rightX);
        const ny = normalize(y, c.upY, c.downY);
        return {
            x: Math.max(0, Math.min(1, nx)),
            y: Math.max(0, Math.min(1, ny))
        };
    }

    static async _getCurrentUserId() {
        if (!PreferencesAPI.javaURI || !PreferencesAPI.fetchOptions) return null;
        const res = await fetch(`${PreferencesAPI.javaURI}/api/person/get`, PreferencesAPI.fetchOptions);
        if (!res.ok) return null;
        const person = await res.json();
        return HeadCalibrationManager._normalizeUserId(
            person?.id || person?.uid || person?.username || person?.name || null
        );
    }

    static async saveToBackend() {
        try {
            const userId = HeadCalibrationManager._normalizeUserId(await HeadCalibrationManager._getCurrentUserId());
            if (!userId) {
                HeadCalibrationManager.setStatus('You must be logged in to save calibration to backend.', true);
                return false;
            }

            const payload = {
                userId,
                body: `${userId}-calibration`,
                metadata: HeadCalibrationManager._sanitize(HeadCalibrationManager.data)
            };

            const res = await fetch(`${PreferencesAPI.javaURI}/api/content/HEAD_CALIBRATION`, {
                ...PreferencesAPI.fetchOptions,
                method: 'POST',
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                HeadCalibrationManager.setStatus(`Failed to save calibration (${res.status}).`, true);
                return false;
            }

            HeadCalibrationManager.setStatus('Calibration saved to backend.');
            return true;
        } catch (e) {
            console.error('save calibration backend error', e);
            HeadCalibrationManager.setStatus('Could not save calibration (network/server error).', true);
            return false;
        }
    }

    static async loadFromBackend() {
        try {
            const userId = HeadCalibrationManager._normalizeUserId(await HeadCalibrationManager._getCurrentUserId());
            if (!userId) {
                HeadCalibrationManager.setStatus('You must be logged in to load calibration.', true);
                return false;
            }

            const res = await fetch(`${PreferencesAPI.javaURI}/api/content/HEAD_CALIBRATION`, PreferencesAPI.fetchOptions);
            if (!res.ok) {
                HeadCalibrationManager.setStatus(`Failed to load calibration list (${res.status}).`, true);
                return false;
            }

            const allRows = await res.json();
            const expectedBody = `${userId}-calibration`;
            const matches = Array.isArray(allRows)
                ? allRows.filter(row => {
                    const rowUserId = HeadCalibrationManager._normalizeUserId(row?.userId);
                    const rowBody = HeadCalibrationManager._normalizeUserId(row?.body);
                    return rowUserId === userId || rowBody === expectedBody;
                })
                : [];

            if (!matches.length) {
                HeadCalibrationManager.setStatus(`No saved calibration found for ${userId}.`, true);
                return false;
            }

            const picked = matches.reduce((best, row) => {
                if (!best) return row;
                return Number(row?.id || 0) > Number(best?.id || 0) ? row : best;
            }, null);

            HeadCalibrationManager.data = HeadCalibrationManager._sanitize(picked?.metadata || {});
            HeadCalibrationManager.data.calibrated = true;
            HeadCalibrationManager.saveLocal();
            HeadCalibrationManager.setStatus(`Loaded calibration for ${userId}.`);
            return true;
        } catch (e) {
            console.error('load calibration backend error', e);
            HeadCalibrationManager.setStatus('Could not load calibration (network/server error).', true);
            return false;
        }
    }
}

// ============================================
// RESPONSIBILITY: Camera-based head tracking cursor
// ============================================
export class HeadTrackingController {
    static STORAGE_KEY = 'headTrackingPreferences';
    static BLINK_EAR_THRESHOLD = 0.15;
    static BLINK_COOLDOWN_MS = 550;
    static state = {
        enabled: false,
        sensitivity: 0.45
    };
    static refs = {
        toggle: null,
        toggleTrack: null,
        toggleDot: null,
        sensitivity: null,
        sensitivityLabel: null,
        status: null,
        calibrationStatus: null,
        captureCenterBtn: null,
        captureLeftBtn: null,
        captureRightBtn: null,
        captureUpBtn: null,
        captureDownBtn: null,
        saveCalibrationBtn: null,
        loadCalibrationBtn: null,
        resetCalibrationBtn: null
    };

    static stream = null;
    static video = null;
    static cursorEl = null;
    static rafId = null;
    static faceLandmarker = null;
    static visionModule = null;
    static lastPoint = null;
    static lastRawPoint = null;
    static blinkState = {
        isClosed: false,
        lastClickAt: 0
    };

    static init() {
        HeadTrackingController.refs.toggle = document.getElementById('pref-head-tracking-enabled');
        HeadTrackingController.refs.toggleTrack = document.getElementById('head-tracking-toggle-track');
        HeadTrackingController.refs.toggleDot = document.getElementById('head-tracking-toggle-dot');
        HeadTrackingController.refs.sensitivity = document.getElementById('pref-head-tracking-sensitivity');
        HeadTrackingController.refs.sensitivityLabel = document.getElementById('head-tracking-sensitivity-label');
        HeadTrackingController.refs.status = document.getElementById('head-tracking-status');
        HeadTrackingController.refs.calibrationStatus = document.getElementById('head-calibration-status');
        HeadTrackingController.refs.captureCenterBtn = document.getElementById('head-calibrate-center');
        HeadTrackingController.refs.captureLeftBtn = document.getElementById('head-calibrate-left');
        HeadTrackingController.refs.captureRightBtn = document.getElementById('head-calibrate-right');
        HeadTrackingController.refs.captureUpBtn = document.getElementById('head-calibrate-up');
        HeadTrackingController.refs.captureDownBtn = document.getElementById('head-calibrate-down');
        HeadTrackingController.refs.saveCalibrationBtn = document.getElementById('head-calibration-save');
        HeadTrackingController.refs.loadCalibrationBtn = document.getElementById('head-calibration-load');
        HeadTrackingController.refs.resetCalibrationBtn = document.getElementById('head-calibration-reset');

        if (!HeadTrackingController.refs.toggle || !HeadTrackingController.refs.status) return;

        HeadTrackingController._loadState();
        HeadCalibrationManager.init(HeadTrackingController.refs.calibrationStatus);
        HeadTrackingController._createCursor();

        HeadTrackingController.refs.toggle.checked = !!HeadTrackingController.state.enabled;
        HeadTrackingController._syncToggleVisual();
        if (HeadTrackingController.refs.sensitivity) {
            HeadTrackingController.refs.sensitivity.value = String(HeadTrackingController.state.sensitivity);
        }
        HeadTrackingController._updateSensitivityLabel();

        HeadTrackingController.refs.toggle.addEventListener('change', async (e) => {
            await HeadTrackingController.setEnabled(!!e.target.checked);
        });

        if (HeadTrackingController.refs.sensitivity) {
            HeadTrackingController.refs.sensitivity.addEventListener('input', () => {
                const raw = Number(HeadTrackingController.refs.sensitivity.value);
                HeadTrackingController.state.sensitivity = Number.isFinite(raw) ? raw : 0.45;
                HeadTrackingController._updateSensitivityLabel();
                HeadTrackingController._saveState();
            });
        }

        const capture = point => {
            if (!HeadTrackingController.lastRawPoint) {
                HeadCalibrationManager.setStatus('Start head tracking and keep your face visible before capturing.', true);
                return;
            }
            HeadCalibrationManager.capture(point, HeadTrackingController.lastRawPoint.x, HeadTrackingController.lastRawPoint.y);
        };

        HeadTrackingController.refs.captureCenterBtn?.addEventListener('click', () => capture('center'));
        HeadTrackingController.refs.captureLeftBtn?.addEventListener('click', () => capture('left'));
        HeadTrackingController.refs.captureRightBtn?.addEventListener('click', () => capture('right'));
        HeadTrackingController.refs.captureUpBtn?.addEventListener('click', () => capture('up'));
        HeadTrackingController.refs.captureDownBtn?.addEventListener('click', () => capture('down'));
        HeadTrackingController.refs.saveCalibrationBtn?.addEventListener('click', () => HeadCalibrationManager.saveToBackend());
        HeadTrackingController.refs.loadCalibrationBtn?.addEventListener('click', () => HeadCalibrationManager.loadFromBackend());
        HeadTrackingController.refs.resetCalibrationBtn?.addEventListener('click', () => HeadCalibrationManager.reset());

        if (HeadTrackingController.state.enabled) {
            HeadTrackingController.setEnabled(true);
        } else {
            HeadTrackingController._setStatus('Head tracking is off.');
        }

        window.addEventListener('beforeunload', () => {
            HeadTrackingController._stopTracking();
        });
    }

    static async setEnabled(enabled) {
        HeadTrackingController.state.enabled = !!enabled;
        HeadTrackingController._saveState();

        if (HeadTrackingController.refs.toggle) {
            HeadTrackingController.refs.toggle.checked = HeadTrackingController.state.enabled;
        }
        HeadTrackingController._syncToggleVisual();

        if (!HeadTrackingController.state.enabled) {
            HeadTrackingController._stopTracking();
            HeadTrackingController._setStatus('Head tracking disabled.');
            return;
        }

        await HeadTrackingController._startTracking();
    }

    static _loadState() {
        try {
            const raw = localStorage.getItem(HeadTrackingController.STORAGE_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            HeadTrackingController.state.enabled = !!parsed.enabled;
            const incomingSensitivity = Number(parsed.sensitivity);
            if (Number.isFinite(incomingSensitivity)) {
                HeadTrackingController.state.sensitivity = Math.min(0.9, Math.max(0.1, incomingSensitivity));
            }
        } catch (e) {
            console.error('head tracking load state error', e);
        }
    }

    static _saveState() {
        try {
            localStorage.setItem(HeadTrackingController.STORAGE_KEY, JSON.stringify(HeadTrackingController.state));
        } catch (e) {
            console.error('head tracking save state error', e);
        }
    }

    static _updateSensitivityLabel() {
        if (!HeadTrackingController.refs.sensitivityLabel) return;
        HeadTrackingController.refs.sensitivityLabel.textContent = HeadTrackingController.state.sensitivity.toFixed(2);
    }

    static _setStatus(message, isError = false) {
        if (!HeadTrackingController.refs.status) return;
        HeadTrackingController.refs.status.textContent = message;
        HeadTrackingController.refs.status.style.color = isError ? '#f87171' : '';
    }

    static _syncToggleVisual() {
        const { toggleTrack, toggleDot } = HeadTrackingController.refs;
        if (!toggleTrack || !toggleDot) return;

        const enabled = !!HeadTrackingController.state.enabled;
        toggleTrack.classList.toggle('bg-cyan-500', enabled);
        toggleTrack.classList.toggle('bg-neutral-600', !enabled);
        toggleDot.style.transform = enabled ? 'translateX(20px)' : 'translateX(0px)';
    }

    static _createCursor() {
        if (HeadTrackingController.cursorEl) return;
        const el = document.createElement('div');
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
        HeadTrackingController.cursorEl = el;
    }

    static _showCursor(x, y) {
        if (!HeadTrackingController.cursorEl) return;
        HeadTrackingController.cursorEl.style.transform = `translate(${Math.round(x - 9)}px, ${Math.round(y - 9)}px)`;
    }

    static _hideCursor() {
        if (!HeadTrackingController.cursorEl) return;
        HeadTrackingController.cursorEl.style.transform = 'translate(-9999px, -9999px)';
    }

    static _eyeAspectRatio(landmarks, topIndex, bottomIndex, leftIndex, rightIndex) {
        const top = landmarks?.[topIndex];
        const bottom = landmarks?.[bottomIndex];
        const left = landmarks?.[leftIndex];
        const right = landmarks?.[rightIndex];
        if (!top || !bottom || !left || !right) return null;

        const vertical = Math.abs(top.y - bottom.y);
        const horizontal = Math.abs(left.x - right.x);
        if (horizontal < 0.0001) return null;
        return vertical / horizontal;
    }

    static _dispatchBlinkClick(x, y) {
        const target = document.elementFromPoint(x, y);
        if (!target) return;

        const pointerDown = new PointerEvent('pointerdown', {
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y,
            button: 0,
            pointerType: 'mouse'
        });
        const pointerUp = new PointerEvent('pointerup', {
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y,
            button: 0,
            pointerType: 'mouse'
        });

        const mouseDown = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: x,
            clientY: y,
            button: 0
        });
        const mouseUp = new MouseEvent('mouseup', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: x,
            clientY: y,
            button: 0
        });
        const click = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: x,
            clientY: y,
            button: 0
        });

        target.dispatchEvent(pointerDown);
        target.dispatchEvent(mouseDown);
        target.dispatchEvent(pointerUp);
        target.dispatchEvent(mouseUp);
        target.dispatchEvent(click);
    }

    static _handleBlinkClick(landmarks, x, y) {
        const leftEar = HeadTrackingController._eyeAspectRatio(landmarks, 159, 145, 33, 133);
        const rightEar = HeadTrackingController._eyeAspectRatio(landmarks, 386, 374, 362, 263);
        if (!Number.isFinite(leftEar) || !Number.isFinite(rightEar)) {
            HeadTrackingController.blinkState.isClosed = false;
            return;
        }

        const avgEar = (leftEar + rightEar) / 2;
        const isClosedNow = avgEar < HeadTrackingController.BLINK_EAR_THRESHOLD;
        const now = performance.now();
        const canClick = now - HeadTrackingController.blinkState.lastClickAt > HeadTrackingController.BLINK_COOLDOWN_MS;

        if (isClosedNow && !HeadTrackingController.blinkState.isClosed && canClick) {
            HeadTrackingController._dispatchBlinkClick(x, y);
            HeadTrackingController.blinkState.lastClickAt = now;
        }

        HeadTrackingController.blinkState.isClosed = isClosedNow;
    }

    static async _startTracking() {
        if (!navigator.mediaDevices?.getUserMedia) {
            HeadTrackingController._setStatus('Camera API is not available in this browser.', true);
            HeadTrackingController.state.enabled = false;
            HeadTrackingController._saveState();
            if (HeadTrackingController.refs.toggle) HeadTrackingController.refs.toggle.checked = false;
            HeadTrackingController._syncToggleVisual();
            return;
        }

        HeadTrackingController._setStatus('Requesting camera access...');

        try {
            if (!HeadTrackingController.visionModule) {
                HeadTrackingController.visionModule = await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/+esm');
            }

            if (!HeadTrackingController.faceLandmarker) {
                const fileset = await HeadTrackingController.visionModule.FilesetResolver.forVisionTasks(
                    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
                );
                HeadTrackingController.faceLandmarker = await HeadTrackingController.visionModule.FaceLandmarker.createFromOptions(fileset, {
                    baseOptions: {
                        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'
                    },
                    runningMode: 'VIDEO',
                    numFaces: 1
                });
            }

            HeadTrackingController.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'user'
                },
                audio: false
            });

            if (!HeadTrackingController.video) {
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
                HeadTrackingController.video = v;
            }

            HeadTrackingController.video.srcObject = HeadTrackingController.stream;
            await HeadTrackingController.video.play();

            HeadTrackingController.lastPoint = null;
            HeadTrackingController._runLoop();
            HeadTrackingController._setStatus('Head tracking active. Move your head to steer the cursor.');
        } catch (e) {
            console.error('head tracking start error', e);
            HeadTrackingController._setStatus('Could not start head tracking. Check camera permission.', true);
            HeadTrackingController.state.enabled = false;
            HeadTrackingController._saveState();
            if (HeadTrackingController.refs.toggle) HeadTrackingController.refs.toggle.checked = false;
            HeadTrackingController._syncToggleVisual();
            HeadTrackingController._stopTracking();
        }
    }

    static _runLoop() {
        if (!HeadTrackingController.state.enabled || !HeadTrackingController.faceLandmarker || !HeadTrackingController.video) {
            return;
        }

        const tick = () => {
            if (!HeadTrackingController.state.enabled || !HeadTrackingController.faceLandmarker || !HeadTrackingController.video) {
                return;
            }

            if (HeadTrackingController.video.readyState >= 2) {
                const result = HeadTrackingController.faceLandmarker.detectForVideo(HeadTrackingController.video, performance.now());
                const landmarks = result?.faceLandmarks?.[0];
                const nose = landmarks?.[1];

                if (nose) {
                    const rawX = 1 - nose.x;
                    const rawY = nose.y;
                    HeadTrackingController.lastRawPoint = { x: rawX, y: rawY };

                    const mapped = HeadCalibrationManager.mapRawToViewport(rawX, rawY);
                    const targetX = mapped.x * window.innerWidth;
                    const targetY = mapped.y * window.innerHeight;

                    const alpha = Math.min(0.9, Math.max(0.1, HeadTrackingController.state.sensitivity));
                    if (!HeadTrackingController.lastPoint) {
                        HeadTrackingController.lastPoint = { x: targetX, y: targetY };
                    } else {
                        HeadTrackingController.lastPoint.x += (targetX - HeadTrackingController.lastPoint.x) * alpha;
                        HeadTrackingController.lastPoint.y += (targetY - HeadTrackingController.lastPoint.y) * alpha;
                    }

                    const x = Math.max(0, Math.min(window.innerWidth - 1, HeadTrackingController.lastPoint.x));
                    const y = Math.max(0, Math.min(window.innerHeight - 1, HeadTrackingController.lastPoint.y));

                    HeadTrackingController._showCursor(x, y);

                    const moveEvent = new MouseEvent('mousemove', {
                        bubbles: true,
                        cancelable: true,
                        view: window,
                        clientX: x,
                        clientY: y
                    });
                    window.dispatchEvent(moveEvent);
                    const target = document.elementFromPoint(x, y);
                    if (target) target.dispatchEvent(moveEvent);

                    HeadTrackingController._handleBlinkClick(landmarks, x, y);
                }
            }

            HeadTrackingController.rafId = requestAnimationFrame(tick);
        };

        HeadTrackingController.rafId = requestAnimationFrame(tick);
    }

    static _stopTracking() {
        if (HeadTrackingController.rafId) {
            cancelAnimationFrame(HeadTrackingController.rafId);
            HeadTrackingController.rafId = null;
        }

        if (HeadTrackingController.stream) {
            HeadTrackingController.stream.getTracks().forEach(t => t.stop());
            HeadTrackingController.stream = null;
        }

        if (HeadTrackingController.video) {
            HeadTrackingController.video.pause();
            HeadTrackingController.video.srcObject = null;
        }

        HeadTrackingController.lastPoint = null;
        HeadTrackingController.lastRawPoint = null;
        HeadTrackingController.blinkState.isClosed = false;
        HeadTrackingController._hideCursor();
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
    static async set(section) {
        const current = PreferencesStore.cachedPrefs
            || await PreferencesStore.get()
            || { ...PreferencesConfig.SITE_DEFAULT };
        const form = FormManager.get();

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

        current.customThemes = PreferencesStore.getThemes();
        await PreferencesStore.set(current);
        StatusDisplay.set('Saved ' + section);
    }
}

// ============================================
// ORCHESTRATOR: Wires everything, attaches events
// ============================================
export class PreferencesController {
    /** Main initialisation — called on DOMContentLoaded */
    static async init() {
        // Step 1: Load & apply saved preferences
        let saved = null;
        try {
            saved = await PreferencesStore.get();
        } catch (e) {
            console.error('Error loading preferences during init', e);
        }

        // Step 2: Render theme buttons (must run even if prefs load fails)
        ThemeRenderer.setPresets();
        ThemeRenderer.setCustom();

        // Step 3: Initialise TTS voice list
        if ('speechSynthesis' in window) {
            TTSPanel.set();
            speechSynthesis.onvoiceschanged = TTSPanel.set;
        }

        // Step 4: Set form values from saved prefs (or defaults)
        FormManager.set(saved || PreferencesConfig.SITE_DEFAULT);

        // Step 4.5: Initialise camera-driven head-tracking cursor controls
        HeadTrackingController.init();

        // Step 5: Login status hint
        if (PreferencesAPI.isLoggedIn) {
            StatusDisplay.set(saved ? 'Preferences synced from your account' : 'No saved preferences found - using defaults');
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
                await SectionSaver.set(this.dataset.section);
                StatusDisplay.set('Saved! Reloading...');
                setTimeout(() => TranslationHelper.cleanReload(), 200);
            });
        });

        // Save All
        document.getElementById('save-preferences').addEventListener('click', async () => {
            await PreferencesStore.set(FormManager.get());
            StatusDisplay.set('Preferences saved! Reloading...');
            setTimeout(() => TranslationHelper.cleanReload(), 200);
        });

        // Reset
        document.getElementById('restore-styles').addEventListener('click', async () => {
            if (PreferencesAPI.isLoggedIn) {
                const deleted = await PreferencesAPI.delete();
                if (!deleted) {
                    StatusDisplay.set('Failed to delete from server, trying again...');
                    await PreferencesAPI.delete();
                }
            }

            localStorage.removeItem(PreferencesConfig.LOCAL_STORAGE_KEY);
            localStorage.removeItem(PreferencesConfig.LOCAL_THEMES_KEY);
            localStorage.removeItem(HeadTrackingController.STORAGE_KEY);
            localStorage.removeItem(HeadCalibrationManager.STORAGE_KEY);
            localStorage.setItem('preferencesReset', 'true');
            PreferencesStore.cachedPrefs = null;
            PreferencesAPI.backendPrefsExist = false;

            await HeadTrackingController.setEnabled(false);

            if (window.SitePreferences?.resetPreferences) {
                window.SitePreferences.resetPreferences();
            }

            FormManager.set(PreferencesConfig.SITE_DEFAULT);
            document.getElementById('pref-language').value = '';

            StatusDisplay.set('Preferences reset! Reloading...');
            setTimeout(() => TranslationHelper.cleanReload(), 300);
        });

        // Custom theme save / enter-key
        document.getElementById('save-theme-btn').addEventListener('click', async () => {
            await ThemeRenderer.set(document.getElementById('new-theme-name').value.trim());
        });
        document.getElementById('new-theme-name').addEventListener('keypress', async e => {
            if (e.key === 'Enter') await ThemeRenderer.set(e.target.value.trim());
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
                const form = FormManager.get();
                current.selectionColor = form.selectionColor;
                current.buttonStyle = form.buttonStyle;
                PreferencesStore.apply(current);
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

    // Boot orchestrator — module scripts are deferred so DOMContentLoaded
    // may have already fired by the time this runs. Handle both cases.
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        PreferencesController.init();
    } else {
        document.addEventListener('DOMContentLoaded', () => PreferencesController.init());
    }

    // Expose global functions for compatibility
    window.loadPreferences = () => PreferencesStore.get();
    window.checkLoginStatus = () => PreferencesAPI.checkLogin();

    // Early localStorage flash (before DOMContentLoaded)
    try {
        const wasReset = localStorage.getItem('preferencesReset');
        if (wasReset !== 'true') {
            const raw = localStorage.getItem(PreferencesConfig.LOCAL_STORAGE_KEY);
            if (raw) {
                const prefs = JSON.parse(raw);
                PreferencesStore.cachedPrefs = prefs;
                PreferencesStore.apply(prefs);
            }
        }
    } catch (e) {
        console.error('Initial localStorage load error', e);
    }
}
