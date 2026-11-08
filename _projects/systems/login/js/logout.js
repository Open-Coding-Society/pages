import { pythonURI, javaURI, fetchOptions, springEnabled } from './config.js';

// logout from both java and python backends
export async function handleLogout() {
    // import config dynamically since we can't use import in non-module script

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
