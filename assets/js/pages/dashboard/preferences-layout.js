import { ThemeRenderer } from './preferences.js';

export function initPreferencesLayout() {
    const root = document.getElementById('tab-content-preferences');
    if (!root || root.dataset.layoutInitialized === 'true') return;
    root.dataset.layoutInitialized = 'true';

    const $ = (selector) => root.querySelector(selector);
    const $$ = (selector) => [...root.querySelectorAll(selector)];

    // Appearance / Language & voice / Head tracking are the page's top tabs (dashboard-v2.html).

    // ----------------------------------------
    // Theme source tabs: Presets, My themes, AI
    // ----------------------------------------
    function selectSource(name) {
        $$('.ocs__prefs-segment').forEach((button) => {
            const active = button.dataset.source === name;
            button.setAttribute('aria-selected', String(active));
            button.tabIndex = active ? 0 : -1;
        });

        $$('[data-source-pane]').forEach((pane) => {
            pane.hidden = pane.dataset.sourcePane !== name;
        });
    }

    $$('.ocs__prefs-segment').forEach((button) => {
        button.addEventListener('click', () => selectSource(button.dataset.source));
    });

    // ----------------------------------------
    // Preview and readability checks
    // ----------------------------------------
    const preview = $('#prefs-preview');
    const textCheck = $('#prefs-check-text');
    const accentCheck = $('#prefs-check-accent');

    function readColor(id, fallback) {
        const value = document.getElementById(id)?.value;
        return /^#[0-9a-f]{6}$/i.test(value || '') ? value : fallback;
    }

    function readPrefs() {
        return {
            bg: readColor('pref-bg-color', '#121212'),
            text: readColor('pref-text-color', '#F0F0F0'),
            accent: readColor('pref-accent-color', '#4CAFEF'),
            selectionColor: readColor('pref-selection-color', '#3b82f6'),
            font: document.getElementById('pref-font-family')?.value || 'Inter, system-ui, sans-serif',
            size: Number(document.getElementById('pref-font-size')?.value || 14),
            buttonStyle: document.getElementById('pref-button-style')?.value || 'default'
        };
    }

    function luminance(hex) {
        const rgb = hex.match(/[a-f\d]{2}/gi).map((part) => {
            const channel = parseInt(part, 16) / 255;
            return channel <= 0.04045
                ? channel / 12.92
                : ((channel + 0.055) / 1.055) ** 2.4;
        });

        return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
    }

    function contrastRatio(first, second) {
        const a = luminance(first);
        const b = luminance(second);
        return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    }

    function updateCheck(element, ratio) {
        if (!element) return;

        const passed = ratio >= 4.5;
        element.textContent = `${ratio.toFixed(2)}:1 — ${passed ? 'Good contrast' : 'Needs improvement'}`;
        element.dataset.status = passed ? 'pass' : 'warning';
        element.setAttribute('aria-label',
            `Contrast ratio ${ratio.toFixed(2)} to 1. ${passed ? 'Passes' : 'Below'} the recommended 4.5 to 1 text contrast.`);
    }

    // The site theme sets text colors with !important, so the preview has to as well,
    // or it shows the saved theme instead of the one in the form.
    const paint = (element, property, value) => {
        if (element) element.style.setProperty(property, value, 'important');
    };
    const readableOn = (color) => (contrastRatio(color, '#ffffff') >= 4.5 ? '#ffffff' : '#111111');

    function updatePreview() {
        const prefs = readPrefs();
        if (!preview) return;

        paint(preview, 'background-color', prefs.bg);
        paint(preview, 'color', prefs.text);
        paint(preview, 'font-family', prefs.font);
        paint(preview, 'font-size', `${prefs.size}px`);

        const body = $('.ocs__prefs-preview-body');
        paint(body, 'background-color', prefs.bg);
        paint(body, 'color', prefs.text);

        body?.querySelectorAll('h4, p').forEach((element) => {
            paint(element, 'color', prefs.text);
            paint(element, 'font-family', prefs.font);
        });

        paint($('.ocs__prefs-preview-bar'), 'background-color', prefs.accent);

        const selection = $('[data-preview="selection"]');
        paint(selection, 'background-color', prefs.selectionColor);
        paint(selection, 'color', readableOn(prefs.selectionColor));

        const link = $('[data-preview="link"]');
        paint(link, 'color', prefs.accent);
        paint(link, 'text-decoration', 'underline');

        const primaryButton = $('[data-preview="button"]');
        const secondaryButton = $('[data-preview="ghost"]');
        const radius = {
            default: '12px',   // ocs__btn's own medium shape
            'rounded-all': '0.375rem',
            square: '0',
            pill: '9999px'
        }[prefs.buttonStyle] ?? '12px';

        [primaryButton, secondaryButton].forEach((button) => {
            paint(button, 'border-radius', radius);
            paint(button, 'font-family', prefs.font);
        });

        paint(primaryButton, 'background-color', prefs.accent);
        paint(primaryButton, 'color', readableOn(prefs.accent));

        paint(secondaryButton, 'background-color', 'transparent');
        paint(secondaryButton, 'color', prefs.text);
        paint(secondaryButton, 'border', `1px solid ${prefs.accent}`);

        updateCheck(textCheck, contrastRatio(prefs.bg, prefs.text));
        updateCheck(accentCheck, contrastRatio(prefs.bg, prefs.accent));
    }

    [
        'pref-bg-color',
        'pref-text-color',
        'pref-accent-color',
        'pref-selection-color',
        'pref-font-family',
        'pref-font-size',
        'pref-button-style'
    ].forEach((id) => {
        const control = document.getElementById(id);
        if (!control) return;

        control.addEventListener('input', updatePreview);
        control.addEventListener('change', updatePreview);
    });

    const fontSize = document.getElementById('pref-font-size');
    const fontSizeLabel = document.getElementById('font-size-label');

    fontSize?.addEventListener('input', () => {
        if (fontSizeLabel) fontSizeLabel.textContent = fontSize.value;
    });

    // ThemeRenderer.fill() dispatches this event when a theme is selected.
    document.addEventListener('prefs:filled', (event) => {
        $$('.ocs__prefs-swatch').forEach((button) => {
            const selected = button.dataset.theme === event.detail?.name;
            button.setAttribute('aria-pressed', String(selected));
        });

        updatePreview();
    });

    // Selecting a generated AI theme should open the AI source and refresh preview.
    document.addEventListener('ai-theme:shown', (event) => {
        selectSource('ai');

        if (event.detail?.prefs) {
            // Only the theme's own look. A theme with no size or button style (a built-in holiday
            // palette) leaves the student's unsaved ones in the form.
            const { bg, text, accent, selectionColor, font, decor, size, buttonStyle } = event.detail.prefs;
            ThemeRenderer.fill(event.detail.name || 'AI theme', {
                bg, text, accent, selectionColor, font, decor,
                ...(event.detail.restyle ? { size, buttonStyle } : {}),
            });
        }

        updatePreview();
    });

    // Language & voice has its own Save button; it saves the same form as the Appearance one.
    $('[data-save-all]')?.addEventListener('click', () => {
        document.getElementById('save-preferences').click();
    });

    // Saved preferences load after this script runs, so draw again once they're in the form.
    document.addEventListener('prefs:loaded', updatePreview);

    // Show the current form values immediately.
    updatePreview();
}
