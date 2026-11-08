// logout from both java and python backends. Callers pass config.js's values, since this
// script is published to assets/js/api/ and must not import config.js itself.
export async function handleLogout({ pythonURI, javaURI, fetchOptions, springEnabled }) {

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
