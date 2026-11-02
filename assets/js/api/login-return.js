// Keep login destinations on this site, outside authentication pages.
export function safeReturnPath(value, origin, baseurl = '') {
    if (!value) return null;
    try {
        const url = new URL(value, origin);
        const base = baseurl.replace(/\/$/, '');
        if (url.origin !== origin || (base && !url.pathname.startsWith(`${base}/`))) return null;
        // A double slash becomes an external host when assigned as a relative URL.
        if (url.pathname.startsWith('//')) return null;
        const path = url.pathname.slice(base.length).replace(/\/+$/, '');
        if (/^\/(login|logout|signup)(\.html)?$/i.test(path)) return null;
        return url.pathname + url.search + url.hash;
    } catch {
        return null;
    }
}

export function loginReturnPath(loginUrl, referrer, baseurl = '') {
    const url = new URL(loginUrl);
    // An explicit destination takes precedence, including when it is invalid.
    const candidate = url.searchParams.has('returnTo') ? url.searchParams.get('returnTo') : referrer;
    return safeReturnPath(candidate, url.origin, baseurl);
}

export function addLoginReturn(link, currentUrl, baseurl = '') {
    const current = new URL(currentUrl);
    const login = new URL(link.href, current);
    const base = baseurl.replace(/\/$/, '');
    if (login.origin !== current.origin || login.pathname.replace(/\/$/, '') !== `${base}/login`) return;
    const destination = safeReturnPath(current.href, current.origin, baseurl);
    if (destination && !login.searchParams.has('returnTo')) {
        login.searchParams.set('returnTo', destination);
        link.href = login.href;
    }
}
