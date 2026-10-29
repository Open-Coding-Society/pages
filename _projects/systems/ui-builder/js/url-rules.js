// Every URL a page author types goes through here before it can reach an href, a src or a
// fetch. Pure: callers pass the page origin and the site's baseurl in.

// Whitespace, control characters, zero-width and direction-override characters, and backslashes.
// Browsers silently drop or rewrite these (a "\" becomes "/"), which lets a link point somewhere
// other than what it looks like, so any of them rejects the whole value.
const UNSAFE = /[\s\u0000-\u001f\u007f-\u009f\u00ad\u061c\u180e\u200b-\u200f\u202a-\u202e\u2028\u2029\u2060-\u2064\u2066-\u2069\ufeff\\]/;
const IPV4 = /^\d{1,3}(?:\.\d{1,3}){3}$/;
// Spring accepts only these two loopback names in a draft's API link, so the editor does too.
const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1']);
const PRIVATE_SUFFIXES = ['.localhost', '.local', '.internal', '.lan', '.home', '.corp'];
const YOUTUBE_HOSTS = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com', 'youtu.be', 'youtube-nocookie.com', 'www.youtube-nocookie.com']);
const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;
const DRIVE_ID = /^[A-Za-z0-9_-]{10,}$/;

function clean(value) {
  const raw = typeof value === 'string' ? value.trim() : '';
  return raw && !UNSAFE.test(raw) ? raw : null;
}

function parse(raw, base) {
  try {
    return base ? new URL(raw, base) : new URL(raw);
  } catch (_) {
    return null;
  }
}

function originOf(pageOrigin) {
  const url = parse(pageOrigin || '');
  return url ? url.origin : null;
}

export function normalizeHost(host) {
  return String(host || '').toLowerCase().replace(/\.+$/, '');
}

export function isLoopbackHost(host) {
  return LOOPBACK_HOSTS.has(normalizeHost(host));
}

export function isOcsHost(host, { cookieDomain = '' } = {}) {
  const domain = normalizeHost(cookieDomain);
  const name = normalizeHost(host);
  return Boolean(domain && name) && (name === domain || name.endsWith(`.${domain}`));
}

export function hostOf(value) {
  const raw = clean(value);
  const url = raw && parse(raw);
  return url && url.hostname ? normalizeHost(url.hostname) : null;
}

// A site path: one leading slash (never "//" or "/\"), resolving to this site's own origin.
// It is returned with the baseurl in front, the way {{ site.baseurl }} links are written.
function sitePath(raw, { baseurl = '', pageOrigin } = {}) {
  if (!/^\/(?![/\\])/.test(raw)) return null;
  const origin = originOf(pageOrigin) || 'https://site.invalid';
  const url = parse(raw, origin);
  if (!url || url.origin !== origin) return null;
  const base = String(baseurl || '').replace(/\/+$/, '');
  return `${base}${url.pathname}${url.search}${url.hash}`;
}

function httpsUrl(raw) {
  const url = parse(raw);
  if (!url || url.protocol !== 'https:' || url.username || url.password || !url.hostname) return null;
  return url;
}

// A link a visitor can click: https, mailto, or a path on this site. Returns null for anything
// else (javascript:, data:, http:, protocol-relative, hidden characters, user:pass@ prefixes).
export function safeLink(value, { baseurl = '', pageOrigin } = {}) {
  const raw = clean(value);
  if (!raw) return null;
  if (raw.startsWith('/')) {
    const href = sitePath(raw, { baseurl, pageOrigin });
    return href ? { href, external: false, host: null } : null;
  }
  if (/^mailto:/i.test(raw)) {
    return /^mailto:[^<>"'`]+$/i.test(raw) ? { href: raw, external: true, host: null } : null;
  }
  const url = httpsUrl(raw);
  if (!url) return null;
  const host = normalizeHost(url.hostname);
  return { href: url.href, external: url.origin !== originOf(pageOrigin), host };
}

// An image: https or a site path, never data:, blob: or http:. ocsHost marks images on hosts
// that receive the site's login cookies, which the renderer loads without cookies.
export function safeImage(value, { baseurl = '', pageOrigin, cookieDomain = '' } = {}) {
  const raw = clean(value);
  if (!raw) return null;
  if (raw.startsWith('/')) {
    const src = sitePath(raw, { baseurl, pageOrigin });
    return src ? { src, ocsHost: false } : null;
  }
  const url = httpsUrl(raw);
  if (!url) return null;
  return { src: url.href, ocsHost: isOcsHost(url.hostname, { cookieDomain }) };
}

// Whether an app may be shown inside an iframe. Hosts under the cookie domain (student team
// servers) would receive every visitor's login cookies, so they get a new-tab link instead.
export function embedPolicy(value, { pageOrigin, blockedHosts = [], cookieDomain = '' } = {}) {
  const raw = clean(value);
  const url = raw && httpsUrl(raw);
  if (!url) return { ok: false, reason: 'embed_https', host: hostOf(value) };
  const host = normalizeHost(url.hostname);
  if (url.origin === originOf(pageOrigin)) return { ok: false, reason: 'same_origin', host };
  if (blockedHosts.map(normalizeHost).includes(host)) return { ok: false, reason: 'blocked', host };
  if (isOcsHost(host, { cookieDomain })) return { ok: false, reason: 'ocs_host', host };
  return { ok: true, src: url.href, host };
}

function youtubeId(url) {
  const host = normalizeHost(url.hostname);
  if (!YOUTUBE_HOSTS.has(host)) return null;
  if (host === 'youtu.be') return url.pathname.split('/')[1] || null;
  if (url.pathname === '/watch') return url.searchParams.get('v');
  const match = url.pathname.match(/^\/(?:shorts|embed|live)\/([^/?#]+)/);
  return match ? match[1] : null;
}

function startSeconds(url) {
  const value = url.searchParams.get('t') || url.searchParams.get('start') || '';
  const match = value.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/);
  if (!value || !match) return 0;
  return (Number(match[1] || 0) * 3600) + (Number(match[2] || 0) * 60) + Number(match[3] || 0);
}

// YouTube and Google Drive links → the provider's embeddable player address. YouTube goes
// through youtube-nocookie.com; Drive share links (/view, /edit) become /preview.
export function videoEmbedOf(value) {
  const raw = clean(value);
  const url = raw && httpsUrl(raw);
  if (!url) return null;
  const id = youtubeId(url);
  if (id) {
    if (!YOUTUBE_ID.test(id)) return null;
    const start = startSeconds(url);
    return { provider: 'youtube', src: `https://www.youtube-nocookie.com/embed/${id}${start ? `?start=${start}` : ''}` };
  }
  if (normalizeHost(url.hostname) === 'drive.google.com') {
    const match = url.pathname.match(/^\/file\/d\/([^/]+)\/(?:view|preview|edit)?$/);
    if (match && DRIVE_ID.test(match[1])) return { provider: 'drive', src: `https://drive.google.com/file/d/${match[1]}/preview` };
  }
  return null;
}

function isPrivateHost(host) {
  const name = normalizeHost(host);
  return IPV4.test(name) || name.startsWith('[') || name === 'localhost'
    || PRIVATE_SUFFIXES.some((suffix) => name.endsWith(suffix));
}

// Where "Data from your API" may read from. https always (but not IP addresses or private
// names). A backend on the student's own computer (http://localhost or 127.0.0.1) only while
// editing, or when this site itself runs on localhost.
export function apiUrlPolicy(value, { pageHost = '', pageProtocol = 'https:', mode = 'view' } = {}) {
  const raw = clean(value);
  const url = raw && parse(raw);
  if (!url || url.username || url.password) return { ok: false, loopback: false, reason: 'policy_https' };
  const host = normalizeHost(url.hostname);
  if (url.protocol === 'http:' && isLoopbackHost(host)) {
    if (mode === 'edit' || isLoopbackHost(pageHost)) return { ok: true, loopback: true, url: url.href, host };
    return { ok: false, loopback: true, reason: 'policy_loopback_view', host };
  }
  if (url.protocol === 'http:') {
    return { ok: false, loopback: false, reason: pageProtocol === 'https:' ? 'mixed_content' : 'policy_https', host };
  }
  if (url.protocol !== 'https:') return { ok: false, loopback: false, reason: 'policy_https', host };
  if (isPrivateHost(host)) return { ok: false, loopback: false, reason: 'policy_private_host', host };
  return { ok: true, loopback: false, url: url.href, host };
}

export function slugIssue(slug, registry) {
  const limits = (registry && registry.limits) || {};
  const pattern = new RegExp(limits.slug_pattern || '^[a-z0-9](?:[a-z0-9-]{1,62}[a-z0-9])$');
  if (typeof slug !== 'string' || !pattern.test(slug)) return 'slug_invalid';
  if ((limits.reserved_slugs || []).includes(slug)) return 'slug_reserved';
  return null;
}

// "Flood Watch: Team 3!" → "flood-watch-team-3".
export function suggestSlug(title) {
  const base = String(title || '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64)
    .replace(/-+$/g, '');
  return base.length >= 3 ? base : `${base || 'my'}-page`.replace(/^-/, '');
}
