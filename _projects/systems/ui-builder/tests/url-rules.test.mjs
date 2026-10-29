import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  apiUrlPolicy, embedPolicy, hostOf, isLoopbackHost, isOcsHost, normalizeHost, safeImage, safeLink, slugIssue,
  suggestSlug, videoEmbedOf,
} from '../js/url-rules.js';

const SITE = { baseurl: '', pageOrigin: 'https://pages.opencodingsociety.com' };
const COOKIE = { cookieDomain: 'opencodingsociety.com' };

test('safeLink accepts https, mailto and site paths', () => {
  assert.deepEqual(safeLink('https://github.com/x/y', SITE), { href: 'https://github.com/x/y', external: true, host: 'github.com' });
  assert.deepEqual(safeLink('  https://example.com  ', SITE), { href: 'https://example.com/', external: true, host: 'example.com' });
  assert.deepEqual(safeLink('https://pages.opencodingsociety.com/csp/', SITE).external, false);
  assert.deepEqual(safeLink('/csp/sprint-3/', SITE), { href: '/csp/sprint-3/', external: false, host: null });
  assert.deepEqual(safeLink('/csp/?q=a#top', { baseurl: '/pages/', pageOrigin: SITE.pageOrigin }).href, '/pages/csp/?q=a#top');
  assert.deepEqual(safeLink('mailto:team@example.com', SITE), { href: 'mailto:team@example.com', external: true, host: null });
});

test('safeLink rejects every way a link can hide where it goes', () => {
  const bad = [
    'javascript:alert(1)', 'JaVaScRiPt:alert(1)', ' javascript:alert(1)', 'data:text/html,<b>x</b>', 'vbscript:x',
    'http://example.com', '//evil.example', '/\\evil.example', '/\\/evil.example', '\\\\evil.example',
    'https://user:pw@example.com', 'https://pages.opencodingsociety.com@evil.example', 'https://exa mple.com',
    'https://example.com/\tx', 'https://example.com/\nx', 'https://exam\u200bple.com', 'https://example.com/\u202eexe.txt',
    'file:///etc/passwd', 'ftp://example.com', 'example.com', 'mailto:<x>', '', null, undefined, 42, {},
  ];
  for (const value of bad) assert.equal(safeLink(value, SITE), null, JSON.stringify(value));
});

test('safeImage allows https and site files and flags cookie-domain hosts', () => {
  assert.deepEqual(safeImage('https://raw.githubusercontent.com/a/b/main/x.png', { ...SITE, ...COOKIE }), { src: 'https://raw.githubusercontent.com/a/b/main/x.png', ocsHost: false });
  assert.deepEqual(safeImage('https://team.opencodingsociety.com/x.png', { ...SITE, ...COOKIE }).ocsHost, true);
  assert.deepEqual(safeImage('https://OPENCODINGSOCIETY.com./x.png', { ...SITE, ...COOKIE }).ocsHost, true);
  assert.deepEqual(safeImage('/images/logo.png', { baseurl: '/b', pageOrigin: SITE.pageOrigin }), { src: '/b/images/logo.png', ocsHost: false });
  for (const value of ['data:image/png;base64,AAAA', 'http://example.com/x.png', 'blob:https://x/1', '//cdn.example/x.png', 'javascript:1']) {
    assert.equal(safeImage(value, SITE), null, value);
  }
});

test('embedPolicy keeps cookie-domain hosts, this site and blocked hosts out of iframes', () => {
  const opts = { pageOrigin: SITE.pageOrigin, blockedHosts: ['spring.opencodingsociety.com'], ...COOKIE };
  assert.deepEqual(embedPolicy('https://ada.github.io/app/', opts), { ok: true, src: 'https://ada.github.io/app/', host: 'ada.github.io' });
  assert.equal(embedPolicy('https://team.opencodingsociety.com/', opts).reason, 'ocs_host');
  assert.equal(embedPolicy('https://pages.opencodingsociety.com/x', opts).reason, 'same_origin');
  assert.equal(embedPolicy('https://spring.opencodingsociety.com/', { ...opts, cookieDomain: '' }).reason, 'blocked');
  assert.equal(embedPolicy('http://ada.github.io/', opts).reason, 'embed_https');
  assert.equal(embedPolicy('javascript:alert(1)', opts).reason, 'embed_https');
});

test('videoEmbedOf turns YouTube and Drive links into their players', () => {
  const yt = 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ';
  assert.deepEqual(videoEmbedOf('https://www.youtube.com/watch?v=dQw4w9WgXcQ'), { provider: 'youtube', src: yt });
  assert.deepEqual(videoEmbedOf('https://youtu.be/dQw4w9WgXcQ'), { provider: 'youtube', src: yt });
  assert.deepEqual(videoEmbedOf('https://youtube.com/shorts/dQw4w9WgXcQ'), { provider: 'youtube', src: yt });
  assert.deepEqual(videoEmbedOf('https://www.youtube.com/embed/dQw4w9WgXcQ'), { provider: 'youtube', src: yt });
  assert.equal(videoEmbedOf('https://youtu.be/dQw4w9WgXcQ?t=1m30s').src, `${yt}?start=90`);
  assert.equal(videoEmbedOf('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42').src, `${yt}?start=42`);
  assert.deepEqual(videoEmbedOf('https://drive.google.com/file/d/1AbCdEfGhIjKlMnOp/view?usp=sharing'), { provider: 'drive', src: 'https://drive.google.com/file/d/1AbCdEfGhIjKlMnOp/preview' });
  for (const value of ['https://www.youtube.com/watch?v=short', 'https://youtu.be/<script>', 'http://youtu.be/dQw4w9WgXcQ', 'https://vimeo.com/1', 'https://drive.google.com/drive/folders/x', 'https://evil.example/watch?v=dQw4w9WgXcQ']) {
    assert.equal(videoEmbedOf(value), null, value);
  }
});

test('apiUrlPolicy: https always, the student computer only while editing', () => {
  const page = { pageHost: 'pages.opencodingsociety.com', pageProtocol: 'https:' };
  assert.deepEqual(apiUrlPolicy('https://flask.opencodingsociety.com/api/jokes', page), { ok: true, loopback: false, url: 'https://flask.opencodingsociety.com/api/jokes', host: 'flask.opencodingsociety.com' });
  assert.equal(apiUrlPolicy('http://127.0.0.1:8587/api/jokes', { ...page, mode: 'edit' }).ok, true);
  assert.equal(apiUrlPolicy('http://localhost:8587/api/jokes', { ...page, mode: 'edit' }).loopback, true);
  assert.equal(apiUrlPolicy('http://localhost:8587/api/jokes', { ...page, mode: 'view' }).reason, 'policy_loopback_view');
  assert.equal(apiUrlPolicy('http://localhost:8587/api/jokes', { ...page, mode: 'canvas' }).ok, false);
  assert.equal(apiUrlPolicy('http://localhost:8587/api/jokes', { pageHost: 'localhost', mode: 'view' }).ok, true, 'a site running on localhost may read local APIs');
  assert.equal(apiUrlPolicy('http://example.com/api', page).reason, 'mixed_content');
  assert.equal(apiUrlPolicy('http://[::1]:8587/api', { ...page, mode: 'edit' }).ok, false, 'Spring refuses [::1], so the editor does too');
  for (const value of ['https://10.0.0.1/api', 'https://[::1]/api', 'https://printer.local/api', 'https://localhost/api', 'https://db.internal/x']) {
    assert.equal(apiUrlPolicy(value, page).reason, 'policy_private_host', value);
  }
  for (const value of ['ftp://x/y', 'javascript:1', 'https://u:p@example.com/api', 'not a url', '']) {
    assert.equal(apiUrlPolicy(value, page).ok, false, value);
  }
});

test('hosts are compared lowercased without a trailing dot', () => {
  assert.equal(normalizeHost('Pages.OpenCodingSociety.COM.'), 'pages.opencodingsociety.com');
  assert.equal(isOcsHost('evilopencodingsociety.com', COOKIE), false);
  assert.equal(isOcsHost('a.b.opencodingsociety.com', COOKIE), true);
  assert.equal(isOcsHost('opencodingsociety.com', { cookieDomain: '' }), false);
  assert.equal(isLoopbackHost('LOCALHOST'), true);
  assert.equal(hostOf('https://GitHub.com/x'), 'github.com');
  assert.equal(hostOf('javascript:1'), null);
});

test('slugs follow the registry pattern and avoid reserved words', () => {
  const registry = { limits: { slug_pattern: '^[a-z0-9](?:[a-z0-9-]{1,62}[a-z0-9])$', reserved_slugs: ['admin', 'gallery'] } };
  assert.equal(slugIssue('flood-watch', registry), null);
  assert.equal(slugIssue('admin', registry), 'slug_reserved');
  for (const value of ['ab', '-x-', 'Flood', 'a_b', 'x'.repeat(65), '', null]) assert.equal(slugIssue(value, registry), 'slug_invalid', String(value));
  assert.equal(suggestSlug('Flood Watch: Team 3!'), 'flood-watch-team-3');
  assert.equal(suggestSlug('Café Résumé'), 'cafe-resume');
  assert.equal(suggestSlug(''), 'my-page');
  assert.equal(suggestSlug('ab'), 'ab-page');
  assert.ok(suggestSlug('x'.repeat(200)).length <= 64);
});
