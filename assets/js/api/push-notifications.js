import { baseurl, javaURI, fetchOptions, springEnabled } from './config.js';

// Web Push for direct messages: lets this browser (a phone, most usefully) get a
// notification from Spring when a new DM arrives, even with the site closed.
//
//   pushState()    what this browser can do right now (see STATES)
//   enablePush()   ask permission, subscribe, tell Spring; resolves { ok, state, message }
//   disablePush()  unsubscribe here and at Spring
//   resyncPush()   quietly re-send the subscription if the user turned it on earlier;
//                  once per browser session, from the navbar bell (dm-notifications.js),
//                  so Spring never loses a phone
//   sendTestPush() asks Spring to push one notification to this account
//
// Spring side: /api/push (PushApiController). Browser side: /service-worker.js.
// The subscription lives in the browser; Spring keeps a copy per person. Whether the
// user chose to turn it on is remembered in localStorage, which only decides whether
// resyncPush() bothers, so a blocked or cleared browser simply comes back as 'off'.

export const STATES = {
  unsupported: 'This browser cannot show push notifications.',
  install: 'On iPhone and iPad, notifications only work from the Home Screen app: tap Share, then “Add to Home Screen”, and open Messages from there.',
  unavailable: 'Phone notifications are not set up on the server yet.',
  blocked: 'Notifications are blocked for this site. Allow them in your browser’s site settings, then try again.',
  off: 'Phone notifications are off on this device.',
  on: 'Phone notifications are on for this device.',
};

const ENABLED_KEY = 'ocs.push.enabled';
const SW_URL = `${baseurl}/service-worker.js`;
const SW_SCOPE = `${baseurl}/`;

// Which account turned notifications on in this browser. A shared computer signed in as
// someone else must not quietly carry the first person's notifications over to them.
const OWNER_KEY = 'ocs.push.owner';

function remember(on, owner) {
  try {
    if (on) {
      localStorage.setItem(ENABLED_KEY, '1');
      localStorage.setItem(OWNER_KEY, owner);
    } else {
      localStorage.removeItem(ENABLED_KEY);
      localStorage.removeItem(OWNER_KEY);
    }
  } catch {
    // Private mode or blocked storage: resync just won't run automatically.
  }
}

function rememberedOwner() {
  try {
    return localStorage.getItem(OWNER_KEY);
  } catch {
    return null;
  }
}

async function signedInUid() {
  const person = await spring('/api/person/get');
  return person?.uid || null;
}

function remembered() {
  try {
    return localStorage.getItem(ENABLED_KEY) === '1';
  } catch {
    return false;
  }
}

function isApple() {
  const ua = navigator.userAgent || '';
  return /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function isInstalled() {
  return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
}

export function pushSupported() {
  return springEnabled && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

// Browsers want the VAPID public key as bytes, not the base64url string Spring stores.
function keyBytes(base64url) {
  const padded = base64url + '='.repeat((4 - (base64url.length % 4)) % 4);
  const raw = atob(padded.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(raw, char => char.charCodeAt(0));
}

async function spring(path, method = 'GET', body) {
  const options = { ...fetchOptions, method };
  if (body !== undefined) options.body = JSON.stringify(body);
  const response = await fetch(`${javaURI}${path}`, options);
  if (!response.ok) {
    const error = new Error(`${method} ${path} answered HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

let configPromise = null;
function serverConfig() {
  if (!configPromise) {
    configPromise = spring('/api/push/config').catch(error => {
      configPromise = null;
      throw error;
    });
  }
  return configPromise;
}

async function registration() {
  return navigator.serviceWorker.register(SW_URL, { scope: SW_SCOPE });
}

async function currentSubscription() {
  const existing = await navigator.serviceWorker.getRegistration(SW_SCOPE);
  return existing ? existing.pushManager.getSubscription() : null;
}

export async function pushState() {
  if (!pushSupported()) return isApple() && !isInstalled() ? 'install' : 'unsupported';
  if (isApple() && !isInstalled()) return 'install';
  let config;
  try {
    config = await serverConfig();
  } catch {
    return 'unavailable';
  }
  if (!config?.enabled) return 'unavailable';
  if (Notification.permission === 'denied') return 'blocked';
  if (Notification.permission !== 'granted') return 'off';
  const subscription = await currentSubscription().catch(() => null);
  return subscription && remembered() ? 'on' : 'off';
}

export async function enablePush() {
  const state = await pushState();
  if (state !== 'off' && state !== 'on') return { ok: false, state, message: STATES[state] };

  // Must be called from a user gesture on most browsers, so enablePush() is only ever
  // run from a click handler.
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    remember(false);
    const next = permission === 'denied' ? 'blocked' : 'off';
    return { ok: false, state: next, message: STATES[next] };
  }

  try {
    const config = await serverConfig();
    const sw = await registration();
    await navigator.serviceWorker.ready;
    const subscription = await sw.pushManager.getSubscription()
      || await sw.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes(config.publicKey) });
    const uid = await signedInUid();
    if (!uid) throw Object.assign(new Error('not signed in'), { status: 401 });
    await spring('/api/push/subscriptions', 'POST', subscription.toJSON());
    remember(true, uid);
    return { ok: true, state: 'on', message: STATES.on };
  } catch (error) {
    console.warn('Push: could not turn notifications on', error);
    remember(false);
    const message = error.status === 401
      ? 'Sign in again, then turn notifications on.'
      : 'Could not turn phone notifications on. Try again in a moment.';
    return { ok: false, state: 'off', message };
  }
}

// Unsubscribing in the browser is what stops notifications arriving here, and it needs no
// answer from Spring, so it always happens first; only then is "on" forgotten. Telling Spring
// is best effort (it also drops the row the first time a push to it fails), so a slow or
// unreachable Spring can never leave a browser subscribed with nothing left to clean it up.
async function unsubscribeHere() {
  const subscription = await currentSubscription().catch(() => null);
  if (!subscription) {
    remember(false);
    return { gone: true, endpoint: null };
  }
  const endpoint = subscription.endpoint;
  const gone = await subscription.unsubscribe().catch(() => false);
  if (gone) remember(false);
  return { gone, endpoint };
}

function tellSpringGone(endpoint) {
  if (!endpoint) return Promise.resolve();
  return spring('/api/push/subscriptions', 'DELETE', { endpoint }).catch(error => {
    console.warn('Push: Spring did not forget the subscription', error);
  });
}

export async function disablePush() {
  const { gone, endpoint } = await unsubscribeHere();
  await tellSpringGone(endpoint);
  if (!gone) return { ok: false, state: 'on', message: 'Could not turn phone notifications off. Try again in a moment.' };
  return { ok: true, state: 'off', message: STATES.off };
}

// Once per browser session at most: Spring skips unchanged re-sends anyway, but every request
// it doesn't get is one less for its database.
const RESYNCED_KEY = 'ocs.push.resynced';

export async function resyncPush() {
  if (!pushSupported() || !remembered() || Notification.permission !== 'granted') return;
  try {
    if (sessionStorage.getItem(RESYNCED_KEY)) return;
    sessionStorage.setItem(RESYNCED_KEY, '1');
  } catch {
    // Blocked storage: fall through and re-send; Spring treats an unchanged one as a no-op.
  }
  try {
    const subscription = await currentSubscription();
    if (!subscription) {
      remember(false);
      return;
    }
    // Someone else is signed in on this browser now: drop the subscription here (Spring
    // forgets it the first time a push to it fails) rather than move it to them. They can
    // turn notifications on for themselves.
    const uid = await signedInUid();
    if (uid && uid !== rememberedOwner()) {
      await dropLocally(subscription);
      return;
    }
    await spring('/api/push/subscriptions', 'POST', subscription.toJSON());
  } catch (error) {
    if (error.status === 409) {
      // Spring has this browser under another account and won't move it.
      const subscription = await currentSubscription().catch(() => null);
      if (subscription) await dropLocally(subscription);
      return;
    }
    // Offline or signed out: try again next session.
    console.debug('Push: resync skipped', error);
  }
}

async function dropLocally(subscription) {
  // "On" is forgotten only once the browser really let go, so a failure is retried next session.
  if (await subscription.unsubscribe().catch(() => false)) remember(false);
}

// Called while signing out, before the session ends, so the account leaving stops getting
// notifications in this browser. The local unsubscribe runs to completion first (it is what
// matters); only telling Spring is cut off after 3 seconds, so signing out is never held up
// by the network. If the local unsubscribe fails, "on" and its owner stay remembered and the
// next session's owner check drops the subscription.
export async function forgetPushOnSignOut() {
  if (!pushSupported() || !remembered()) return;
  const { endpoint } = await unsubscribeHere();
  await Promise.race([
    tellSpringGone(endpoint),
    new Promise(resolve => setTimeout(resolve, 3000)),
  ]);
}

export function sendTestPush() {
  return spring('/api/push/test', 'POST');
}
