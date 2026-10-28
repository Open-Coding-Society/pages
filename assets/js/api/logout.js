import { pythonURI, javaURI, fetchOptions, springEnabled } from './config.js';

// Forget this student's theme, so the next person on this computer starts from the default
// (login.js loads each student's own theme from Spring when they sign in).
function forgetTheme() {
    ['sitePreferences', 'siteThemeDecor', 'sitePreferencesOwner'].forEach(key => localStorage.removeItem(key));
}

// logout from both java and python backends
export async function handleLogout() {
    // import config dynamically since we can't use import in non-module script

    window.loggingOut = true; // tells login.js not to sync the theme back while this page signs out
    forgetTheme();

    // logout from python backend
    try {
        await fetch(pythonURI + '/api/authenticate', {
            ...fetchOptions,
            method: 'DELETE'
        });
    } catch (e) {
        // log error but continue
        console.error('python logout failed:', e);
    }

    // logout from java backend, unless the site runs Flask only (spring: false in _config.yml)
    if (!springEnabled) return;
    try {
        await fetch(javaURI + '/api/logout', {
            ...fetchOptions,
            method: 'POST',
        });
    } catch (e) {
        // log error but continue
        console.error('java logout failed:', e);
    }
}
