import { FormManager } from './preferences.js';

export function initPreferencesLayout() {
    const root = document.getElementById('tab-content-preferences');
    if (!root || root.dataset.layoutInitialized === 'true') return;
    root.dataset.layoutInitialized = 'true';

    const $ = (selector) => root.querySelector(selector);
    const $$ = (selector) => [...root.querySelectorAll(selector)];

    // ----------------------------------------
    // Section tabs: Appearance, Voice, Tracking
    // ----------------------------------------
    function selectSection(name) {
        $$('.ocs__prefs-section-btn').forEach((button) => {
            const active = button.dataset.section === name;
            button.setAttribute('aria-selected', String(active));
            button.tabIndex = active ? 0 : -1;
        });

        $$('[data-section-pane]').forEach((pane) => {
            pane.hidden = pane.dataset.sectionPane !== name;
        });
    }

    $$('.ocs__prefs-section-btn').forEach((button) => {
        button.addEventListener('click', () => {
            selectSection(button.dataset.section);
        });

        button.addEventListener('keydown', (event) => {
            if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;

            const tabs = $$('.ocs__prefs-section-btn');
            const current = tabs.indexOf(button);
            let next = current;

            if (event.key === 'ArrowRight') next = (current + 1) % tabs.length;
            if (event.key === 'ArrowLeft') next = (current - 1 + tabs.length) % tabs.length;
            if (event.key === 'Home') next = 0;
            if (event.key === 'End') next = tabs.length - 1;

            event.preventDefault();
            tabs[next].focus();
            selectSection(tabs[next].dataset.section);
        });
    });

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
    const startingFrom = $('#prefs-starting-from');
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
            buttonStyle: document.getElementById('pref-button-style')?.value || 'rounded'
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

    function updatePreview() {
        const prefs = readPrefs();
        if (!preview) return;

        preview.style.setProperty('--prefs-preview-bg', prefs.bg);
        preview.style.setProperty('--prefs-preview-text', prefs.text);
        preview.style.setProperty('--prefs-preview-accent', prefs.accent);
        preview.style.setProperty('--prefs-preview-selection', prefs.selectionColor);
        preview.style.setProperty('--prefs-preview-font', prefs.font);
        preview.style.setProperty('--prefs-preview-size', `${prefs.size}px`);

        preview.style.backgroundColor = prefs.bg;
        preview.style.color = prefs.text;
        preview.style.fontFamily = prefs.font;
        preview.style.fontSize = `${prefs.size}px`;

        const bar = $('.ocs__prefs-preview-bar');
        if (bar) {
            bar.style.backgroundColor = prefs.accent;
            bar.style.color = contrastRatio(prefs.accent, '#ffffff') >= 4.5
                ? '#ffffff'
                : '#111111';
        }

        const body = $('.ocs__prefs-preview-body');
        if (body) {
            body.style.backgroundColor = prefs.bg;
            body.style.color = prefs.text;
            body.style.fontFamily = prefs.font;
            body.style.fontSize = `${prefs.size}px`;
        }

        const selection = $('[data-preview="selection"]');
        if (selection) {
            selection.style.backgroundColor = prefs.selectionColor;
            selection.style.color = contrastRatio(prefs.selectionColor, '#ffffff') >= 4.5
                ? '#ffffff'
                : '#111111';
        }

        const link = $('[data-preview="link"]');
        if (link) {
            link.style.color = prefs.accent;
            link.style.textDecoration = 'underline';
        }

        const primaryButton = $('[data-preview="button"]');
        const secondaryButton = $('[data-preview="ghost"]');
        const radius = {
            rounded: '8px',
            square: '0px',
            pill: '999px'
        }[prefs.buttonStyle] || '8px';

        [primaryButton, secondaryButton].forEach((button) => {
            if (button) button.style.borderRadius = radius;
        });

        if (primaryButton) {
            primaryButton.style.backgroundColor = prefs.accent;
            primaryButton.style.color =
                contrastRatio(prefs.accent, '#ffffff') >= 4.5 ? '#ffffff' : '#111111';
        }

        if (secondaryButton) {
            secondaryButton.style.backgroundColor = 'transparent';
            secondaryButton.style.color = prefs.text;
            secondaryButton.style.border = `1px solid ${prefs.accent}`;
        }

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
        if (startingFrom) {
            startingFrom.textContent = event.detail?.name
                ? `Starting from: ${event.detail.name}`
                : 'Custom theme';
        }

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
            FormManager.set(event.detail.prefs);
            document.dispatchEvent(new CustomEvent('prefs:filled', {
                detail: { name: event.detail.name || 'AI theme' }
            }));
        }

        updatePreview();
    });

    // Show the current form values immediately.
    updatePreview();
}
