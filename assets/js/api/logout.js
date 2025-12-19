import { pythonURI, javaURI, fetchOptions } from './config.js';

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

    // logout from java backend
    try {
        await fetch(javaURI + '/my/logout', {
            ...fetchOptions,
            method: 'POST',
            credentials: 'include'
        });
    } catch (e) {
        // log error but continue
        console.error('java logout failed:', e);
    }

}
