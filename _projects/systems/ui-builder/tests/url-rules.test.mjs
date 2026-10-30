import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  apiUrlPolicy, embedPolicy, foldText, hostOf, isLoopbackAddress, isLoopbackHost, isOcsHost, normalizeHost, safeImage, safeLink, slugIssue,
  slugMatches, suggestSlug, videoEmbedOf,
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

test('addresses are read as typed, the way Spring reads them, not as the browser would repair them', () => {
  for (const value of ['https:/team.github.io/logo.png', 'https:team.github.io', 'https://@example.com/', 'https:///example.com', 'https://@/x']) {
    assert.equal(safeLink(value, SITE), null, value);
    assert.equal(safeImage(value, SITE), null, value);
    assert.equal(embedPolicy(value, { pageOrigin: SITE.pageOrigin }).ok, false, value);
  }
  assert.equal(videoEmbedOf('https:/youtu.be/dQw4w9WgXcQ'), null);
  assert.equal(safeLink('HTTPS://Example.com:443/a/@ada?x=@y#@z', SITE).href, 'https://example.com/a/@ada?x=@y#@z', 'an @ after the host is only part of the path');
});

test('site paths keep no dot segments, typed or encoded, so none can become a //host link', () => {
  for (const value of ['/..//evil.com/x', '/.%2e//evil.com/x', '/%2E%2E//evil.com', '/a/../..//evil.com/x', '/.//evil.com', '/a/..', '/%2e/x']) {
    assert.equal(safeLink(value, SITE), null, value);
    assert.equal(safeImage(value, SITE), null, value);
  }
  for (const value of ['/search?q=/../x', '/csp/#../top', '/.well-known/x', '/files/v1.2/x', '/...']) {
    assert.equal(safeLink(value, SITE).href, value, value);
  }
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
  for (const value of ['ftp://x/y', 'javascript:1', 'https://u:p@example.com/api', 'not a url', '', 'https:team.github.io/api', 'https://@example.com/api']) {
    assert.equal(apiUrlPolicy(value, page).ok, false, value);
  }
});

test('the student computer is named only as Spring takes it: http://localhost or http://127.0.0.1', () => {
  const edit = { pageHost: 'pages.opencodingsociety.com', pageProtocol: 'https:', mode: 'edit' };
  for (const value of ['http://localhost:8587/api/jokes', 'HTTP://LOCALHOST:8587', 'http://127.0.0.1', 'http://127.0.0.1:5000/api?x=1#y']) {
    assert.equal(apiUrlPolicy(value, edit).ok, true, value);
  }
  // The browser would reach each of these, but Spring refuses them.
  for (const value of ['http:/localhost:5000/api', 'http:localhost:5000/api', 'http://127.1:5000/api', 'http://0x7f.0.0.1/api', 'http://localhost./api']) {
    assert.deepEqual([apiUrlPolicy(value, edit).ok, apiUrlPolicy(value, edit).reason], [false, 'policy_loopback_form'], value);
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

// The same verdicts as Spring's isLoopbackHost and its urlIssue in PUBLISH mode, which reads the host
// as typed: if the two differed, a page would pass here and be refused at Publish.
test('isLoopbackHost and isLoopbackAddress name the student\'s computer exactly as Spring does', () => {
  for (const host of ['localhost', 'LOCALHOST', 'localhost.', 'team.localhost', 'a.b.localhost.', '.localhost', '127.0.0.1', '127.1.2.3',
    '127.255.255.255', '127.000.000.001', '[::1]', '0.0.0.0', '0.0.0.0.', '[::]', '[::].', '[::ffff:127.0.0.1]', '[::FFFF:127.1.2.3]',
    '[::ffff:7f00:1]', '[::ffff:7fff:ffff].']) {
    assert.equal(isLoopbackHost(host), true, host);
  }
  for (const host of ['localhost..', 'localhost.example.com', 'mylocalhost', '127.1', '0177.0.0.1', '128.0.0.1', '10.0.0.1', '[0:0:0:0:0:0:0:1]',
    '[::2]', '::1', '0.0.0.1', '127.0.0.1x', '', null, '[0:0:0:0:0:0:0:0]', '[::ffff:128.0.0.1]', '[::ffff:8000:1]', '[::ffff:0:0]', '[::127.0.0.1]',
    '[0:0:0:0:0:ffff:7f00:1]', '[::ffff:7f00:00001]', '[::ffff:127.0.0]']) {
    assert.equal(isLoopbackHost(host), false, String(host));
  }
  for (const value of ['https://localhost/', 'HTTPS://LocalHost:8443/x', 'https://localhost./x', 'https://team.localhost/', 'https://127.0.0.1:4100/team.png',
    'https://127.000.000.001/', 'https://[::1]:8443/', 'https://0.0.0.0./x', 'http://localhost:4100/x', 'http://127.0.0.1/', ' https://localhost/ ',
    'https://[::]/', 'https://[::ffff:127.0.0.1]:8443/', 'https://[::ffff:7f00:1]/']) {
    assert.equal(isLoopbackAddress(value), true, value);
  }
  // A browser sends the first seven to this computer too, but Spring passes them, so the two change together.
  for (const value of ['https://127.1/', 'https://0177.0.0.1/', 'https://2130706433/', 'https://0x7f.0.0.1/', 'https://[0:0:0:0:0:0:0:1]/',
    'https://[0:0:0:0:0:ffff:7f00:1]/', 'https://%6Cocalhost/',
    'https://localhost../x', 'https://localhost.example.com/', 'https://flood.example.com/', '/csp/', 'mailto:a@b.example', 'https://user@localhost/',
    'http://localhost./', 'http://[::1]/', '', null, 42]) {
    assert.equal(isLoopbackAddress(value), false, String(value));
  }
});

// Spring trims an address as JavaScript's trim does (trimLikeJavaScript), so around an address only
// tab, line breaks and space are dropped; U+001C to U+001F, which Java calls whitespace, and every
// other control character stay and make the value no address on both sides.
test('around an address, a control character is dropped only where JavaScript\'s trim drops it, as in Spring', () => {
  const dropped = new Set([0x9, 0xa, 0xb, 0xc, 0xd, 0x20]);
  const controls = [...Array(0x21).keys(), ...[...Array(0x21).keys()].map((n) => 0x7f + n)]; // U+0000-U+0020, U+007F-U+009F
  for (const code of controls) {
    const ch = String.fromCharCode(code);
    for (const value of [`${ch}https://localhost/`, `https://localhost/${ch}`, `${ch}http://localhost:4000/`]) {
      assert.equal(isLoopbackAddress(value), dropped.has(code), `${code.toString(16)} ${JSON.stringify(value)}`);
    }
    assert.equal(safeLink(`${ch}https://example.com/`, SITE) !== null, dropped.has(code), code.toString(16));
  }
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
  assert.equal(foldText('Káñbán BOARD'), 'kanban board');
});

test('slugMatches follows the registry pattern, and reserved words still match it', () => {
  const registry = { limits: { slug_pattern: '^[a-z0-9_-]{3,64}$', reserved_slugs: ['admin'] } };
  assert.equal(slugMatches('team_3', registry), true, 'a widened pattern is used everywhere');
  assert.equal(slugIssue('team_3', registry), null);
  assert.equal(slugMatches('admin', registry), true, 'a page published before its word was reserved still opens');
  assert.equal(slugIssue('admin', registry), 'slug_reserved');
  assert.equal(slugMatches('team_3', { limits: {} }), false, 'without a pattern, the default one');
  for (const value of ['ab', 'Team', '../x', null, 42]) assert.equal(slugMatches(value, registry), false, String(value));
});
