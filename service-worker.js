---
# Front matter so {{ site.baseurl }} resolves. Served at /service-worker.js, scope /.
---
// Service worker for Open Coding Society. Its only job is Web Push: showing a
// notification on the phone when Spring pushes one (new direct message), and opening
// the conversation when it is tapped. It does not cache or intercept any request,
// so the site behaves exactly as it does without it. Registered on demand by
// assets/js/api/push-notifications.js.

const BASEURL = '{{ site.baseurl }}';
const DM_PATH = `${BASEURL}/dm`;
const ICON = `${BASEURL}/apple-touch-icon.png`;

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

function isMessagesPage(url) {
  const path = new URL(url).pathname.replace(/\/$/, '');
  return path === DM_PATH;
}

self.addEventListener('push', event => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data ? event.data.text() : '' };
  }
  const title = data.title || 'Open Coding Society';
  const url = data.url || '/dm';
  const tag = data.tag || 'ocs';

  event.waitUntil((async () => {
    // Someone reading /dm right now sees the message arrive on the page, and the page
    // marks it read. A banner on top of that would be noise. A test push always shows.
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const readingMessages = windows.some(client => client.focused && isMessagesPage(client.url));
    if (readingMessages && tag !== 'ocs-test') return;

    await self.registration.showNotification(title, {
      body: data.body || '',
      tag,
      renotify: true,
      icon: ICON,
      badge: ICON,
      data: { url },
    });
  })());
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || DM_PATH, self.location.origin).href;

  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const open = windows.find(client => isMessagesPage(client.url));
    if (open) {
      if ('focus' in open) await open.focus();
      if ('navigate' in open) await open.navigate(target);
      return;
    }
    await self.clients.openWindow(target);
  })());
});
