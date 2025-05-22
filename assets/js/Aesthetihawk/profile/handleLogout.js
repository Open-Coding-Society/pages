// logout from both java and python backends
export async function handleLogout() {
    // import config dynamically since we can't use import in non-module script
    const configModule = await import('{{site.baseurl}}/assets/js/api/config.js');
    const fetchOptions = configModule.fetchOptions;
    const pythonURI = configModule.pythonURI;
    const javaURI = configModule.javaURI;

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

    // redirect to login page
    window.location.href = "{{site.baseurl}}/login";
}
