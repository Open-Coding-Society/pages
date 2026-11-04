// AI Theme on the dashboard: a student describes a look and Spring's /api/user/ai-theme
// designs it with their own AI key (or the school's). The result shows in a preview card;
// Try it previews the whole page (Keep / Undo), Save adds it to Custom Themes with its emoji.
// The holidays are suggestions; if the AI can't answer one, the built-in palette
// (SitePreferences.SEASONAL_THEMES) is used, so a holiday theme always works.
import { PreferencesConfig, PreferencesStore, ThemeRenderer } from './preferences.js';

const site = () => window.SitePreferences;
const HOLIDAYS = { Halloween: 'halloween', Thanksgiving: 'thanksgiving', Christmas: 'christmas', "Valentine's": 'valentines' };
// One idea per kind: a holiday, a place, a game, a movie.
const SUGGESTIONS = ['Halloween', 'cozy rainy library', 'retro arcade', 'space movie'];
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

/** An AI answer ({background, text, ...}) as site prefs, keeping the student's language and voice.
 *  wallpaper false keeps the colors and font but leaves out the emoji (decor [] means "no wallpaper").
 *  restyle true also takes the theme's text size and button style. */
function toPrefs(theme, wallpaper = true, restyle = false) {
    return {
        ...(PreferencesStore.cachedPrefs || PreferencesConfig.SITE_DEFAULT),
        bg: theme.background, text: theme.text, accent: theme.accent,
        selectionColor: theme.selection, font: theme.font, decor: wallpaper ? theme.decor : [],
        ...(restyle ? { size: theme.size, buttonStyle: theme.buttonStyle } : {}),
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

export function initAiTheme({ javaURI, fetchOptions }) {
    const $ = id => document.getElementById(id);
    const form = $('ai-theme-form');
    if (!form || !site()) return;
    const promptEl = $('ai-theme-prompt'), generateBtn = $('ai-theme-generate'), statusEl = $('ai-theme-status');
    const result = $('ai-theme-result'), card = $('ai-theme-preview'), nameInput = $('ai-theme-name');
    let theme = null, lastPrompt = '', previewBar = null;
    const wallpaperBox = $('ai-theme-wallpaper');
    const wallpaper = () => !wallpaperBox || wallpaperBox.checked;
    // The built-in holiday palettes have no size or button style to apply.
    const restyle = t => Boolean(t.buttonStyle);
    const prefsFor = t => toPrefs(t, wallpaper(), restyle(t));

    const status = (msg, isError = false) => {
        statusEl.textContent = msg;
        statusEl.style.color = isError ? '#f87171' : '';
    };

    // Suggestions: clicking one fills the box; the student can still edit it.
    $('ai-theme-chips').replaceChildren(...SUGGESTIONS.map(text => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'ocs__btn small ocs__prefs-suggestion';
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
            swatch.className = 'ocs__prefs-ai-swatch';
            swatch.title = `${key} ${theme[key]}`;
            paint(swatch, 'background-color', theme[key]);
            return swatch;
        }));
        paint(card, 'background-color', theme.background);
        paint(card, 'border-color', theme.accent);
        paint(card, 'font-family', theme.font);
        card.querySelectorAll('h4, p, span:not(.ocs__prefs-ai-swatch)').forEach(el => {
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
        document.dispatchEvent(new CustomEvent('ai-theme:shown', { detail: { name: theme.name, prefs: prefsFor(theme), restyle: restyle(theme) } }));
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
        previewBar.className = 'ocs__prefs-ai-bar';
        const label = document.createElement('span');
        label.textContent = `Previewing ${theme.name}. Nothing is saved yet.`;
        const keep = document.createElement('button');
        keep.type = 'button';
        keep.className = 'ocs__btn small accent fill';
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
        undo.className = 'ocs__btn small';
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
        const { bg, text, accent, selectionColor, font, size, buttonStyle, decor } = prefsFor(theme);
        themes[name] = { bg, text, accent, selectionColor, font, size, buttonStyle, decor, source: 'ai' };
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
}
