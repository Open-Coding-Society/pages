// AI Theme on the dashboard: a student describes a look and Spring's /api/user/ai-theme
// designs it with their own AI key (or the school's). The result shows in a preview card;
// Try it previews the whole page (Keep / Undo), Save adds it to Custom Themes with its emoji.
// The holidays are suggestions; if the AI can't answer one, the built-in palette
// (SitePreferences.SEASONAL_THEMES) is used, so a holiday theme always works.
import { PreferencesConfig, PreferencesStore, ThemeRenderer } from './preferences.js';

const site = () => window.SitePreferences;
const HOLIDAYS = { Halloween: 'halloween', Thanksgiving: 'thanksgiving', Christmas: 'christmas', "Valentine's": 'valentines' };
const SUGGESTIONS = [...Object.keys(HOLIDAYS), 'ocean at night', 'retro arcade', 'cozy rainy library'];
const NAME_MAX = 30;

/** The holiday key for an unedited holiday suggestion ("halloween", " Halloween "), else undefined */
const holidayFor = prompt => {
    const typed = prompt.trim().toLowerCase().replace('’', "'");
    return Object.entries(HOLIDAYS).find(([label]) => label.toLowerCase() === typed)?.[1];
};

/** Theme names fit the name box (counted in characters, so an emoji isn't split) */
const capName = name => [...name].slice(0, NAME_MAX).join('').trim();

/** WCAG contrast ratio of two #rrggbb colors */
export function contrast(a, b) {
    const lum = hex => {
        const [r, g, bl] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
            .map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
        return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
    };
    const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
}

/** An AI answer ({background, text, ...}) as site prefs, keeping the student's size, language and voice.
 *  wallpaper false keeps the colors and font but leaves out the emoji (decor [] means "no wallpaper"). */
function toPrefs(theme, wallpaper = true) {
    return {
        ...(PreferencesStore.cachedPrefs || PreferencesConfig.SITE_DEFAULT),
        bg: theme.background, text: theme.text, accent: theme.accent,
        selectionColor: theme.selection, font: theme.font, decor: wallpaper ? theme.decor : [],
    };
}

/** A built-in holiday palette in the AI answer's shape */
function holidayTheme(key) {
    const p = site().SEASONAL_THEMES[key];
    return {
        name: p.label, description: `The built-in ${p.label} theme.`,
        background: p.bg, text: p.text, accent: p.accent, selection: p.accent,
        font: PreferencesConfig.SITE_DEFAULT.font, decor: p.decor,
    };
}

/** Set a style that wins over the theme's !important overrides */
const paint = (el, prop, value) => el.style.setProperty(prop, value, 'important');

export function initAiTheme({ javaURI, fetchOptions, profileURL }) {
    const $ = id => document.getElementById(id);
    const form = $('ai-theme-form');
    if (!form || !site()) return;
    const promptEl = $('ai-theme-prompt'), generateBtn = $('ai-theme-generate'), statusEl = $('ai-theme-status');
    const result = $('ai-theme-result'), card = $('ai-theme-preview'), nameInput = $('ai-theme-name');
    let theme = null, lastPrompt = '', previewBar = null;
    const wallpaperBox = $('ai-theme-wallpaper');
    const wallpaper = () => !wallpaperBox || wallpaperBox.checked;
    const prefsFor = t => toPrefs(t, wallpaper());

    const status = (msg, isError = false) => {
        statusEl.textContent = msg;
        statusEl.style.color = isError ? '#f87171' : '';
    };

    // Suggestions: clicking one fills the box; the student can still edit it.
    $('ai-theme-chips').replaceChildren(...SUGGESTIONS.map(text => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = form.closest('.ocs__prefs') ? 'ocs__btn small' : 'px-3 py-1 rounded-full bg-neutral-700 hover:bg-neutral-600 text-white text-sm';
        chip.textContent = text;
        chip.addEventListener('click', () => { promptEl.value = text; promptEl.focus(); });
        return chip;
    }));

    function endPreview(restore) {
        if (!previewBar) return;
        previewBar.remove();
        previewBar = null;
        if (restore) site().cancelPreview();
    }

    function show(next) {
        endPreview(true);
        theme = next;
        $('ai-theme-title').textContent = theme.name;
        $('ai-theme-description').textContent = theme.description;
        $('ai-theme-emoji').textContent = theme.decor.join(' ');
        $('ai-theme-emoji').hidden = !wallpaper();
        $('ai-theme-swatches').replaceChildren(...['background', 'text', 'accent', 'selection'].map(key => {
            const swatch = document.createElement('span');
            swatch.className = 'inline-block w-6 h-6 rounded border';
            swatch.title = `${key} ${theme[key]}`;
            paint(swatch, 'background-color', theme[key]);
            return swatch;
        }));
        paint(card, 'background-color', theme.background);
        paint(card, 'border-color', theme.accent);
        paint(card, 'font-family', theme.font);
        card.querySelectorAll('h4, p, span:not(.inline-block)').forEach(el => {
            paint(el, 'color', theme.text);
            paint(el, 'font-family', theme.font);
        });
        const sample = $('ai-theme-sample-btn');
        paint(sample, 'background-color', theme.accent);
        paint(sample, 'color', theme.background);
        const ratio = contrast(theme.text, theme.background);
        $('ai-theme-badge').textContent = `${ratio >= 4.5 ? 'Readable ✓' : 'Hard to read'} ${ratio.toFixed(1)}:1`;
        nameInput.value = capName(theme.name);
        result.hidden = false;
        // Dashboard v2 (preferences-layout.js) also puts the theme into the form and live preview.
        document.dispatchEvent(new CustomEvent('ai-theme:shown', { detail: { name: theme.name, prefs: prefsFor(theme) } }));
    }

    async function generate(prompt) {
        lastPrompt = prompt;
        generateBtn.disabled = true;
        $('ai-theme-regenerate').disabled = true;
        form.setAttribute('aria-busy', 'true');
        status('Designing your theme…');
        let next = null, error = null;
        try {
            const res = await fetch(`${javaURI}/api/user/ai-theme`, {
                ...fetchOptions, method: 'POST', body: JSON.stringify({ prompt }),
            });
            const body = await res.json().catch(() => ({}));
            if (res.ok) next = body;
            else error = res.status === 401 ? 'Sign in to make an AI theme.' : body.error || `The AI theme service answered ${res.status}.`;
        } catch (_) {
            error = "Couldn't reach the server.";
        }
        const holiday = holidayFor(prompt);
        if (!next && holiday) {
            next = holidayTheme(holiday);
            error = null;
            status(`The AI couldn't answer, so this is the built-in ${next.name} theme.`);
        } else if (next) {
            status('');
        }
        if (error) status(error, true);
        if (next) show(next);
        else {
            // Don't leave an older theme's card (or its preview) up next to the error.
            endPreview(true);
            result.hidden = true;
            theme = null;
        }
        generateBtn.disabled = false;
        $('ai-theme-regenerate').disabled = false;
        form.removeAttribute('aria-busy');
    }

    form.addEventListener('submit', event => {
        event.preventDefault();
        const prompt = promptEl.value.trim();
        if (!prompt) { status('Describe the theme you want first.', true); return; }
        generate(prompt);
    });
    $('ai-theme-regenerate').addEventListener('click', () => lastPrompt && generate(lastPrompt));

    $('ai-theme-try').addEventListener('click', () => {
        if (!theme || previewBar) return;
        site().preview(prefsFor(theme));
        previewBar = document.createElement('div');
        previewBar.setAttribute('role', 'region');
        previewBar.setAttribute('aria-label', 'Theme preview');
        previewBar.className = 'fixed left-0 right-0 bottom-0 z-50 p-3 flex flex-wrap gap-2 items-center justify-center bg-neutral-800 border-t border-neutral-700';
        previewBar.style.paddingBottom = 'calc(0.75rem + env(safe-area-inset-bottom, 0px))';
        const label = document.createElement('span');
        label.textContent = `Previewing ${theme.name}. Nothing is saved yet.`;
        const keep = document.createElement('button');
        keep.type = 'button';
        keep.className = 'px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white';
        keep.textContent = 'Keep';
        keep.addEventListener('click', async () => {
            const prefs = { ...prefsFor(theme), customThemes: PreferencesStore.getThemes() };
            site().setThemeDecor(prefs);
            site().keepPreview();
            endPreview(false);
            await PreferencesStore.set(prefs);
            status(`Applied: ${theme.name}`);
        });
        const undo = document.createElement('button');
        undo.type = 'button';
        undo.className = 'px-3 py-1 rounded bg-neutral-700 hover:bg-neutral-600 text-white';
        undo.textContent = 'Undo';
        undo.addEventListener('click', () => { endPreview(true); status('Preview undone.'); });
        previewBar.append(label, keep, undo);
        document.body.append(previewBar);
        keep.focus();
    });

    $('ai-theme-save').addEventListener('click', async () => {
        if (!theme) return;
        const name = capName(nameInput.value) || capName(theme.name);
        const themes = PreferencesStore.getThemes();
        if (Object.keys(themes).length >= PreferencesConfig.MAX_CUSTOM && !themes[name]) {
            status(`You can keep ${PreferencesConfig.MAX_CUSTOM} custom themes. Delete one first.`, true);
            return;
        }
        const { bg, text, accent, selectionColor, font, size, decor } = prefsFor(theme);
        themes[name] = { bg, text, accent, selectionColor, font, size, decor, source: 'ai' };
        const previewing = Boolean(previewBar);
        await PreferencesStore.setThemes(themes); // re-applies the saved theme
        if (previewing) site().preview(prefsFor(theme));
        ThemeRenderer.setCustom();
        status(`Saved "${name}" to Custom Themes.`);
    });

    // Emoji wallpaper on/off: the card hides the emoji, and an open preview updates right away.
    wallpaperBox?.addEventListener('change', () => {
        $('ai-theme-emoji').hidden = !wallpaper();
        if (theme && previewBar) site().preview(prefsFor(theme));
    });

    showKeyStatus($('ai-theme-key'), javaURI, fetchOptions, profileURL);
}

/** Which key AI Theme will use, from the AI connections saved on the profile page */
async function showKeyStatus(el, javaURI, fetchOptions, profileURL) {
    if (!el) return;
    let text = "Using the school's key.", link = true;
    try {
        const res = await fetch(`${javaURI}/api/ai-connections`, fetchOptions);
        if (res.status === 401) { el.textContent = 'Sign in to use AI Theme.'; return; }
        const { providers = {} } = res.ok ? await res.json() : {};
        const own = ['gemini', 'groq'].find(p => providers[p]?.connected && providers[p]?.modelConfigured);
        if (own) { text = `Using your ${own === 'gemini' ? 'Gemini' : 'Groq'} key.`; link = false; }
    } catch (_) { /* keep the school's-key line */ }
    el.textContent = text + ' ';
    if (link) {
        const a = document.createElement('a');
        a.href = profileURL;
        a.className = 'underline';
        a.textContent = 'Connect your own on Profile →';
        el.append(a);
    }
}
