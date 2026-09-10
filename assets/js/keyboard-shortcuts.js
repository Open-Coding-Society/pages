// Keyboard shortcuts for main pages (Alt+Shift+key)
// Uses Alt+Shift modifier to avoid overriding browser defaults
// (Ctrl+C=copy, Ctrl+S=save, Ctrl+P=print, etc.)
//
// Uses e.code (physical key position) instead of e.key because
// Alt+Shift can produce accented characters on some OS/browser
// combos (e.g. Alt+Shift+C → Ç on macOS).

/**
 * Manages keyboard shortcuts and help overlay
 * Responsibility: Orchestrate keyboard event handling and overlay UI
 */
class KeyboardShortcutsManager {
    constructor() {
        this.shortcuts = {
            'KeyC': '/student/calendar',
            'KeyH': '/',               // home page
            'KeyP': '/profile',        // profile page
            'KeyS': '/student',        // student toolkit
            'KeyT': '/teacher',        // teacher toolkit
            'KeyL': '/login',          // login page
            'KeyU': '/signup',         // signup page
        };
        this.helpCodes = new Set(['Slash', 'Period']);
        this.overlay = null;
        this.initialize();
    }

    /**
     * Responsibility: Initialize the keyboard shortcuts manager
     */
    initialize() {
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
    }

    /**
     * Responsibility: Create the HTML structure for the overlay
     */
    createOverlayHTML() {
        const div = document.createElement('div');
        div.id = 'keyboard-shortcuts-overlay';
        div.innerHTML = `
            <div class="ks-backdrop"></div>
            <div class="ks-modal">
                <h3>Keyboard Shortcuts</h3>
                <p class="ks-hint">Press <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>key</kbd></p>
                <table>
                    <tr><td><kbd>C</kbd></td><td>Calendar</td></tr>
                    <tr><td><kbd>H</kbd></td><td>Home</td></tr>
                    <tr><td><kbd>P</kbd></td><td>Profile</td></tr>
                    <tr><td><kbd>S</kbd></td><td>Student Toolkit</td></tr>
                    <tr><td><kbd>T</kbd></td><td>Teacher Toolkit</td></tr>
                    <tr><td><kbd>L</kbd></td><td>Login</td></tr>
                    <tr><td><kbd>U</kbd></td><td>Signup</td></tr>
                    <tr><td><kbd>?</kbd></td><td>Show this help</td></tr>
                </table>
                <p class="ks-close-hint">Press <kbd>Esc</kbd> or click outside to close</p>
            </div>
        `;
        return div;
    }

    /**
     * Responsibility: Inject CSS styles for the overlay
     */
    injectOverlayStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #keyboard-shortcuts-overlay { position:fixed; inset:0; z-index:99999; display:flex; align-items:center; justify-content:center; }
            #keyboard-shortcuts-overlay .ks-backdrop { position:absolute; inset:0; background:rgba(0,0,0,0.6); }
            #keyboard-shortcuts-overlay .ks-modal { position:relative; background:#1e1e2e; color:#cdd6f4; border:1px solid #45475a; border-radius:12px; padding:24px 32px; max-width:400px; width:90%; font-family:system-ui,sans-serif; box-shadow:0 8px 32px rgba(0,0,0,0.4); }
            #keyboard-shortcuts-overlay .ks-modal h3 { margin:0 0 4px; font-size:1.2em; color:#f5f5f5; }
            #keyboard-shortcuts-overlay .ks-hint { margin:0 0 16px; font-size:0.85em; color:#a6adc8; }
            #keyboard-shortcuts-overlay table { width:100%; border-collapse:collapse; }
            #keyboard-shortcuts-overlay td { padding:6px 8px; border-bottom:1px solid #313244; }
            #keyboard-shortcuts-overlay td:first-child { width:40px; text-align:center; }
            #keyboard-shortcuts-overlay kbd { display:inline-block; background:#313244; border:1px solid #45475a; border-radius:4px; padding:2px 7px; font-size:0.85em; font-family:inherit; color:#cdd6f4; }
            #keyboard-shortcuts-overlay .ks-close-hint { margin:14px 0 0; font-size:0.8em; color:#6c7086; text-align:center; }
        `;
        document.head.appendChild(style);
    }

    /**
     * Responsibility: Attach event listeners to overlay elements
     */
    attachOverlayListeners(overlayElement) {
        overlayElement.querySelector('.ks-backdrop').addEventListener('click', () => this.hideHelp());
    }

    /**
     * Responsibility: Initialize the overlay (one-time setup)
     */
    initializeOverlay() {
        this.overlay = this.createOverlayHTML();
        this.injectOverlayStyles();
        this.attachOverlayListeners(this.overlay);
        document.body.appendChild(this.overlay);
    }

    /**
     * Responsibility: Show the help overlay
     */
    showHelp() {
        if (!this.overlay) {
            this.initializeOverlay();
        }
        this.overlay.style.display = 'flex';
    }

    /**
     * Responsibility: Hide the help overlay
     */
    hideHelp() {
        if (this.overlay) {
            this.overlay.style.display = 'none';
        }
    }

    /**
     * Responsibility: Navigate to a destination URL
     */
    navigate(destination) {
        const baseurl = window.baseurl || '';
        let url = destination;
        if (baseurl && !url.startsWith(baseurl)) {
            url = baseurl + url;
        }
        window.location.href = url;
    }

    /**
     * Responsibility: Check if the active element is in edit mode
     */
    isInEditMode() {
        const tag = document.activeElement?.tagName?.toLowerCase();
        if (tag === 'input' || tag === 'textarea' || document.activeElement?.isContentEditable) {
            return true;
        }
        if (document.activeElement?.closest('.CodeMirror')) {
            return true;
        }
        return false;
    }

    /**
     * Responsibility: Validate if a keyboard event should trigger shortcuts
     */
    isValidShortcutEvent(event) {
        // Must have Alt+Shift modifiers
        if (!event.altKey || !event.shiftKey) {
            return false;
        }
        // Cannot have Ctrl/Meta to avoid browser shortcuts
        if (event.metaKey || event.ctrlKey) {
            return false;
        }
        // Cannot be in edit mode
        if (this.isInEditMode()) {
            return false;
        }
        return true;
    }

    /**
     * Responsibility: Route keyboard code to appropriate shortcut handler
     */
    processShortcut(code) {
        // Help overlay
        if (this.helpCodes.has(code)) {
            this.showHelp();
            return true;
        }

        // Navigate shortcuts
        if (this.shortcuts[code]) {
            this.navigate(this.shortcuts[code]);
            return true;
        }

        return false;
    }

    /**
     * Responsibility: Handle keydown events
     */
    handleKeydown(event) {
        // Close overlay on Escape
        if (event.key === 'Escape' && this.overlay && this.overlay.style.display !== 'none') {
            this.hideHelp();
            event.preventDefault();
            return;
        }

        // Process shortcuts if event is valid
        if (this.isValidShortcutEvent(event)) {
            if (this.processShortcut(event.code)) {
                event.preventDefault();
            }
        }
    }
}

// Initialize the manager when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new KeyboardShortcutsManager();
    });
} else {
    new KeyboardShortcutsManager();
}
