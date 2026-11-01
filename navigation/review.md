---
layout: page
title: Review a project
permalink: /review
search_exclude: true
show_reading_time: false
description: Scan a project's QR code and write a microblog review from your phone.
---
{%- comment -%}
The phone review page. A project page with a microblog shows a QR code (the panel's "QR"
button) that points here with ?topic=<the page's permalink>. A visitor scans it, types a
name and a review, and posts: the page makes the guest account Flask needs behind the
scenes (while a Teacher or Admin has the Guest Window open), signs it in, and posts on that
page's topic, so nobody takes over the team's computer. A student or teacher can sign in
with their own account instead. Flask does the work: POST /api/user (a guest),
POST /api/authenticate, POST /api/microblog.
Helpers and their tests: assets/js/api/microblog-review.js, tests/microblog_review.test.mjs.
{%- endcomment -%}
{%- assign microblog_posts = site.posts | where: "microblog", true -%}

<div class="review-page" data-review-page>
  <section class="review-head">
    {%- comment -%} An h2: a project stylesheet hides every h1 site-wide, and the layout's own title is an h2 {%- endcomment -%}
    <h2 id="review-title" class="review-title">Loading…</h2>
    <p class="review-topic"><a id="review-topic-link" href="#">Open the project page</a></p>
  </section>

  <!-- No ?topic= in the address, or one that is not a page on this site -->
  <section id="review-no-topic" class="ocs__callout review-callout" hidden>
    This address names no project. Scan the QR code on a project page, or open its
    <strong>Microblog</strong> panel and press <strong>QR code</strong> to get one.
  </section>

  <!-- Guest sign-up is closed and nobody is signed in -->
  <section id="review-closed" class="ocs__callout review-callout" hidden>
    Reviews are closed right now. Ask a teacher to open the <strong>Guest Window</strong>,
    then reload this page.
  </section>

  <!-- Write the review. The name is asked only when nobody is signed in. -->
  <section id="review-compose" class="ocs__card review-card" hidden>
    <form id="review-form" class="review-form">
      <div id="review-name-field" class="ocs__field">
        <label class="ocs__label" for="review-name">Your name</label>
        <input class="ocs__input" id="review-name" type="text" autocomplete="name" minlength="2" maxlength="60" placeholder="Shown with your review">
      </div>
      <p id="review-identity" class="review-identity" hidden>
        <span>Posting as <strong id="review-user-name"></strong></span>
        <button type="button" id="review-logout" class="review-link">Not you?</button>
      </p>
      <div class="ocs__field">
        <label class="ocs__label" for="review-content">Your review</label>
        <textarea class="ocs__input review-textarea" id="review-content" rows="5" maxlength="280" required
                  placeholder="What stood out? What would make it better?"></textarea>
        <small><span id="review-remaining">280</span> characters left</small>
      </div>
      <button type="submit" id="review-submit" class="ocs__btn accent fill review-submit">Post review</button>
      <p id="review-message" class="review-message" aria-live="polite"></p>
    </form>
    <p id="review-signin-offer" class="review-note review-center">
      Student or teacher? <button type="button" id="review-signin-toggle" class="review-link">Sign in with your account</button>
    </p>
  </section>

  <!-- An existing account: Flask only, posting needs no Spring login -->
  <section id="review-signin" class="ocs__card review-card" hidden>
    <form id="signin-form" class="review-form">
      <div class="ocs__field">
        <label class="ocs__label" for="login-uid">Username or GitHub ID</label>
        <input class="ocs__input" id="login-uid" type="text" autocomplete="username" autocapitalize="off" required>
      </div>
      <div class="ocs__field">
        <label class="ocs__label" for="login-password">Password</label>
        <input class="ocs__input" id="login-password" type="password" autocomplete="current-password" required>
      </div>
      <button type="submit" id="login-submit" class="ocs__btn accent fill review-submit">Sign in</button>
      <p id="login-message" class="review-message" aria-live="polite"></p>
    </form>
    <p class="review-note review-center">
      <button type="button" id="review-signin-back" class="review-link">Back to the review</button>
    </p>
  </section>

  <!-- What others said -->
  <section id="review-posts" class="review-posts" hidden>
    <h2 class="review-posts-title">Reviews so far</h2>
    <ol id="review-post-list" class="review-post-list"></ol>
  </section>

  <!-- For the team: the QR code to show. Hidden until asked for, so a phone never loads it. -->
  <section class="review-share">
    <button type="button" id="review-qr-toggle" class="ocs__btn pill">Show QR code for this page</button>
    <div id="review-qr" class="review-qr" hidden>
      <div id="review-qr-image" class="review-qr-image" aria-label="QR code"></div>
      <p class="review-qr-link"><a id="review-qr-url" href="#"></a></p>
      <p class="review-note">Scanning opens this page. Keep the Guest Window open so visitors can post.</p>
    </div>
  </section>
</div>

<script type="module">
import { pythonURI, fetchOptions, baseurl } from '{{ site.baseurl }}/assets/js/api/config.js';
import { fetchPosts, createPost, fetchCurrentUser } from '{{ site.baseurl }}/assets/js/api/microblog.js';
import { topicFromSearch, titleForTopic, buildReviewUrl, remainingChars, guestCredentials } from '{{ site.baseurl }}/assets/js/api/microblog-review.js';

// permalink -> title for every post that has a microblog, so the heading names the project
const titles = {
{%- for post in microblog_posts -%}
  {%- if post.permalink -%}
  {{ post.permalink | jsonify }}: {{ post.title | jsonify }},
  {%- endif -%}
{%- endfor -%}
};

const $ = id => document.getElementById(id);
const show = (id, visible = true) => { $(id).hidden = !visible; };
const say = (id, text, tone = '') => { const el = $(id); el.textContent = text; el.dataset.tone = tone; };

// Who is signed in (null: nobody), and whether a guest may be made right now
let user = null;
let guestWindowOpen = false;

const topic = topicFromSearch(location.search);
if (!topic) {
  $('review-title').textContent = 'Which project?';
  $('review-topic-link').parentElement.hidden = true;
  show('review-no-topic');
  // The QR section stays: a team can still make a code once they add ?topic=
  $('review-qr-toggle').disabled = true;
} else {
  $('review-title').textContent = titleForTopic(topic, titles);
  document.title = `Review: ${$('review-title').textContent}`;
  $('review-topic-link').href = `${baseurl}${topic}`;
  start();
}

async function start() {
  [user, guestWindowOpen] = await Promise.all([fetchCurrentUser(), askGuestWindow()]);
  render();
  loadPosts();
}

// A guest can be made only while a Teacher or Admin has the Guest Window open
async function askGuestWindow() {
  try {
    const response = await fetch(`${pythonURI}/api/guest/window`, fetchOptions);
    const guestWindow = response.ok ? await response.json() : null;
    return Boolean(guestWindow && guestWindow.open === true);
  } catch (_) {
    return false;  // Flask could not be asked: treat the window as closed
  }
}

// Three states: signed in (review only), signed out with the window open (name + review),
// signed out with the window closed (a note, and sign-in for those with an account)
function render() {
  show('review-signin', false);
  if (user) {
    $('review-user-name').textContent = user.name || user.uid;
    show('review-identity');
    show('review-name-field', false);
    $('review-name').required = false;
    show('review-signin-offer', false);
    show('review-closed', false);
    show('review-compose');
    return;
  }
  show('review-identity', false);
  show('review-name-field');
  $('review-name').required = true;
  show('review-signin-offer');
  show('review-closed', !guestWindowOpen);
  show('review-compose', guestWindowOpen);
  if (!guestWindowOpen) show('review-signin');
}

$('review-signin-toggle').onclick = () => { show('review-compose', false); show('review-closed', false); show('review-signin'); $('login-uid').focus(); };
$('review-signin-back').onclick = render;

// Reads Flask's refusal ({"message": ...}) so the visitor sees why, not just a number
async function reasonFrom(response, fallback) {
  const body = await response.clone().json().catch(() => null);
  return (body && body.message) || fallback;
}

async function authenticate(uid, password) {
  return fetch(`${pythonURI}/api/authenticate`, {
    ...fetchOptions, method: 'POST', cache: 'no-cache', body: JSON.stringify({ uid, password }),
  });
}

// The guest account behind a visitor's name: made and signed in without showing a login.
// A username clash (two random tails alike) is retried once with a new tail.
async function signInAsGuest(name) {
  for (let attempt = 0; attempt < 2; attempt++) {
    const { uid, password } = guestCredentials(name);
    const created = await fetch(`${pythonURI}/api/user`, {
      ...fetchOptions, method: 'POST', body: JSON.stringify({ name, uid, password, accountType: 'guest' }),
    });
    if (!created.ok) {
      const why = await reasonFrom(created, `Could not start your review (HTTP ${created.status})`);
      if (attempt === 0 && /taken|duplicate|already/i.test(why)) continue;
      throw new Error(why);
    }
    const signedIn = await authenticate(uid, password);
    if (!signedIn.ok) throw new Error(await reasonFrom(signedIn, `Could not sign you in (HTTP ${signedIn.status})`));
    return (await fetchCurrentUser()) || { name, uid };
  }
  throw new Error('Could not start your review. Please try again.');
}

// An existing account
$('signin-form').onsubmit = async event => {
  event.preventDefault();
  const button = $('login-submit');
  button.disabled = true;
  say('login-message', 'Signing in…');
  try {
    const signedIn = await authenticate($('login-uid').value.trim(), $('login-password').value);
    if (!signedIn.ok) throw new Error(await reasonFrom(signedIn, `Sign-in failed (HTTP ${signedIn.status})`));
    user = (await fetchCurrentUser()) || { name: $('login-uid').value };
    say('login-message', '');
    render();
    $('review-content').focus();
    loadPosts();
  } catch (error) {
    say('login-message', error.message, 'error');
  } finally {
    button.disabled = false;
  }
};

$('review-logout').onclick = async () => {
  await fetch(`${pythonURI}/api/authenticate`, { ...fetchOptions, method: 'DELETE' }).catch(() => {});
  user = null;
  render();
};

// The review itself
$('review-content').addEventListener('input', () => {
  $('review-remaining').textContent = remainingChars($('review-content').value);
});

$('review-form').onsubmit = async event => {
  event.preventDefault();
  const content = $('review-content').value.trim();
  if (!content) return;
  const button = $('review-submit');
  button.disabled = true;
  try {
    if (!user) {
      say('review-message', 'Starting your review…');
      user = await signInAsGuest($('review-name').value.trim());
      render();
    }
    say('review-message', 'Posting…');
    // Resolves to the saved post; a refusal throws ("HTTP error! status: 401"), as does
    // the shared 30 second cooldown between posts. Either way the draft stays in the box.
    await createPost({ content, topicPath: topic, data: { channel: 'chat' } });
    $('review-content').value = '';
    $('review-remaining').textContent = remainingChars('');
    say('review-message', 'Posted. Thank you!', 'ok');
    loadPosts();
  } catch (error) {
    if (/status: 401/.test(error.message)) {
      user = null;
      render();
      say('review-message', 'Your session ended. Post again to continue.', 'error');
      return;
    }
    say('review-message', error.message, 'error');
  } finally {
    button.disabled = false;
  }
};

async function loadPosts() {
  try {
    const data = await fetchPosts(topic);
    const posts = (data.microblogs || []).slice(0, 20);
    const list = $('review-post-list');
    list.replaceChildren(...posts.map(post => {
      const item = document.createElement('li');
      const who = document.createElement('strong');
      who.textContent = post.userName || 'Someone';
      const what = document.createElement('p');
      what.textContent = post.content;
      item.append(who, what);
      return item;
    }));
    show('review-posts', posts.length > 0);
  } catch (_) {
    // Reading needs a login; before the first post the list simply stays hidden
    show('review-posts', false);
  }
}

// The QR code: drawn by the vendored qrcode-generator, loaded only when asked for
$('review-qr-toggle').onclick = async () => {
  const box = $('review-qr');
  if (!box.hidden) { box.hidden = true; return; }
  const url = buildReviewUrl({ origin: location.origin, baseurl, topicPath: topic });
  if (!url) return;
  if (!window.qrcode) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = '{{ site.baseurl }}/assets/js/vendor/qrcode.js';
      script.onload = resolve;
      script.onerror = () => reject(new Error('QR library failed to load'));
      document.head.appendChild(script);
    });
  }
  const code = window.qrcode(0, 'M');
  code.addData(url);
  code.make();
  $('review-qr-image').innerHTML = code.createSvgTag({ cellSize: 6, margin: 12, scalable: true, title: 'QR code for this review page' });
  $('review-qr-url').textContent = url;
  $('review-qr-url').href = url;
  box.hidden = false;
};
</script>
