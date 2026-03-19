---
toc: false
layout: post
title: Poway Symphony Orchestra Sign In
description: Sign in page for the Poway Symphony Orchestra capstone experience
permalink: /capstone/powayorchestra/signin/
sticky_rank: 1
---

<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap');
  :root {
    --navy: #0c1a2e;
    --navy-mid: #14273f;
    --navy-light: #1e3a5a;
    --gold: #c8a84b;
    --gold-light: #e2c97a;
    --gold-pale: #f5ead4;
    --cream: #faf6ef;
    --white: #ffffff;
    --text-mid: rgba(250, 246, 239, 0.78);
    --border: rgba(200, 168, 75, 0.24);
    --success: #9fd0a4;
    --error: #efb0a5;
  }

  article.post .post-header {
    display: none !important;
  }

  article.post,
  article.post .post-content,
  article.post .post-content.e-content {
    margin: 0 !important;
    max-width: none !important;
    padding: 0 !important;
    width: 100% !important;
  }

  .pso-signin-page {
    background: var(--navy);
    color: var(--cream);
    font-family: 'Cormorant Garamond', Georgia, serif;
    width: 92vw;
    max-width: none;
    margin: 0 auto 2rem;
    margin-left: calc(50% - 46vw);
    margin-right: calc(50% - 46vw);
    min-height: 100vh;
  }

  .pso-topbar {
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--navy);
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    height: 64px;
    gap: 1rem;
  }

  .pso-home-trigger {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    color: var(--gold-light);
    font-family: 'Playfair Display', serif;
    font-size: 1rem;
    letter-spacing: 0.04em;
    text-decoration: none;
    flex-shrink: 0;
    padding: 0;
  }

  .pso-home-trigger .pso-treble {
    font-size: 1.6rem;
    line-height: 1;
    color: var(--gold);
  }

  .pso-home-trigger:hover {
    color: var(--gold);
  }

  .pso-topbar-nav {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    flex-wrap: wrap;
  }

  .top-nav-item {
    position: relative;
  }

  .top-nav-link {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-family: 'Jost', sans-serif;
    font-size: 0.78rem;
    font-weight: 400;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    text-decoration: none;
    padding: 0.45rem 0.85rem;
    border-radius: 2px;
    transition: color 0.2s, background 0.2s;
    white-space: nowrap;
    color: var(--cream);
    background: transparent;
    border: 1px solid transparent;
    cursor: pointer;
  }

  .top-nav-link:hover {
    color: var(--gold-light);
    border-color: var(--border);
  }

  .top-nav-link.btn-primary {
    background: var(--gold);
    color: var(--navy);
    border-color: var(--gold);
    font-weight: 500;
  }

  .top-nav-link.btn-primary:hover {
    background: var(--gold-light);
    border-color: var(--gold-light);
    color: var(--navy);
  }

  .top-nav-caret {
    font-size: 0.6rem;
    opacity: 0.7;
  }

  .top-nav-dropdown {
    display: none;
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    background: var(--navy-mid);
    border: 1px solid var(--border);
    border-radius: 3px;
    min-width: 200px;
    z-index: 200;
    padding: 0.4rem 0;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  }

  .top-nav-item.has-submenu:hover .top-nav-dropdown {
    display: block;
  }

  .top-nav-dropdown-link {
    display: block;
    font-family: 'Jost', sans-serif;
    font-size: 0.78rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-decoration: none;
    padding: 0.55rem 1.1rem;
    color: var(--cream);
    transition: background 0.15s, color 0.15s;
    cursor: pointer;
  }

  .top-nav-dropdown-link:hover {
    background: var(--navy-light);
    color: var(--gold-light);
  }

  .pso-signin-shell {
    min-height: calc(100vh - 64px);
    background:
      radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200, 168, 75, 0.08) 0%, transparent 70%),
      linear-gradient(180deg, var(--navy) 0%, #0a1526 100%);
    padding: 3.5rem 2rem 4rem;
  }

  .pso-signin-inner {
    width: 100%;
    max-width: 1380px;
    margin: 0 auto;
  }

  .pso-signin-hero {
    text-align: center;
    margin-bottom: 2rem;
  }

  .pso-signin-eyebrow {
    font-family: 'Jost', sans-serif;
    font-size: 0.72rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 1.2rem;
  }

  .pso-signin-hero h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.4rem, 6vw, 4.5rem);
    font-weight: 700;
    color: var(--white);
    line-height: 1.1;
    margin-bottom: 0.7rem;
  }

  .pso-signin-subtitle {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: clamp(1rem, 2vw, 1.3rem);
    color: var(--gold-light);
    margin-bottom: 1.4rem;
  }

  .pso-signin-rule {
    width: 80px;
    height: 1px;
    background: linear-gradient(to right, transparent, var(--gold), transparent);
    margin: 0 auto 1.6rem;
  }

  .pso-signin-copy {
    max-width: 760px;
    margin: 0 auto;
    font-size: 1.08rem;
    color: var(--text-mid);
    line-height: 1.8;
  }

  .pso-signin-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
    gap: 1.5rem;
    margin-top: 2.25rem;
  }

  .pso-signin-card,
  .pso-signin-panel {
    background: var(--navy-mid);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 2rem;
    box-shadow: 0 12px 34px rgba(0, 0, 0, 0.24);
  }

  .pso-signin-card h2,
  .pso-signin-panel h3 {
    font-family: 'Playfair Display', serif;
    color: var(--white);
    font-size: 1.8rem;
    margin-bottom: 0.55rem;
  }

  .pso-signin-section-copy {
    color: var(--text-mid);
    font-size: 1.02rem;
    line-height: 1.75;
    margin-bottom: 1.35rem;
  }

  .pso-signin-form {
    display: grid;
    gap: 1rem;
  }

  .pso-field {
    display: grid;
    gap: 0.45rem;
  }

  .pso-field label {
    color: var(--gold-light);
    font-family: 'Jost', sans-serif;
    font-size: 0.78rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .pso-field input {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 12px;
    color: var(--white);
    font-family: 'Jost', sans-serif;
    font-size: 0.98rem;
    min-height: 52px;
    padding: 0.9rem 1rem;
  }

  .pso-field input:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(200, 168, 75, 0.16);
    outline: none;
  }

  .pso-field input::placeholder {
    color: rgba(250, 246, 239, 0.48);
  }

  .pso-form-actions,
  .pso-panel-links,
  .pso-auth-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
  }

  .pso-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: 'Jost', sans-serif;
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    text-decoration: none;
    padding: 0.85rem 1.5rem;
    border-radius: 2px;
    transition: all 0.2s;
    cursor: pointer;
    border: 1px solid transparent;
  }

  .pso-button-primary {
    background: var(--gold);
    color: var(--navy);
    border-color: var(--gold);
  }

  .pso-button-primary:hover {
    background: var(--gold-light);
    border-color: var(--gold-light);
    color: var(--navy);
  }

  .pso-button-secondary {
    background: transparent;
    color: var(--cream);
    border-color: rgba(200, 168, 75, 0.5);
  }

  .pso-button-secondary:hover {
    border-color: var(--gold);
    color: var(--gold-light);
    background: rgba(200, 168, 75, 0.06);
  }

  .pso-inline-link,
  .pso-panel-links a {
    color: var(--gold-light);
    text-decoration: none;
  }

  .pso-inline-link:hover,
  .pso-panel-links a:hover {
    color: var(--white);
    text-decoration: underline;
  }

  .pso-auth-message {
    display: none;
    margin-top: 1rem;
    padding: 0.95rem 1rem;
    border-radius: 4px;
    font-family: 'Jost', sans-serif;
    font-size: 0.9rem;
    letter-spacing: 0.03em;
  }

  .pso-auth-message.is-visible {
    display: block;
  }

  .pso-auth-message.is-info {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: var(--cream);
  }

  .pso-auth-message.is-success {
    background: rgba(159, 208, 164, 0.12);
    border: 1px solid rgba(159, 208, 164, 0.35);
    color: var(--success);
  }

  .pso-auth-message.is-error {
    background: rgba(239, 176, 165, 0.12);
    border: 1px solid rgba(239, 176, 165, 0.3);
    color: var(--error);
  }

  .pso-auth-actions {
    display: none;
    margin-top: 1rem;
  }

  .pso-auth-actions.is-visible {
    display: flex;
  }

  .pso-panel-list {
    list-style: none;
    margin: 0 0 1.5rem;
    padding: 0;
    border-left: 2px solid var(--border);
    padding-left: 1rem;
  }

  .pso-panel-list li {
    font-size: 0.98rem;
    color: var(--text-mid);
    padding: 0.35rem 0;
  }

  .pso-panel-label {
    display: block;
    margin-bottom: 0.2rem;
    color: var(--gold);
    font-family: 'Jost', sans-serif;
    font-size: 0.7rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  @media (max-width: 900px) {
    .pso-signin-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 700px) {
    .pso-signin-page {
      width: 100%;
      margin-left: 0;
      margin-right: 0;
      margin-bottom: 0;
    }

    .pso-topbar {
      padding: 0 1rem;
    }

    .pso-topbar-nav {
      gap: 0.1rem;
    }

    .top-nav-link {
      padding: 0.4rem 0.5rem;
      font-size: 0.7rem;
    }

    .pso-signin-shell {
      padding: 2.5rem 1.2rem 3rem;
    }

    .pso-signin-inner {
      width: 100%;
    }

    .pso-signin-card,
    .pso-signin-panel {
      padding: 1.4rem;
    }

    .pso-form-actions,
    .pso-panel-links,
    .pso-auth-actions {
      flex-direction: column;
      align-items: stretch;
    }

    .pso-button {
      width: 100%;
    }
  }
</style>

<div class="pso-signin-page">
  <div class="pso-topbar">
    <a class="pso-home-trigger" href="{{ '/capstone/powayorchestra/' | relative_url }}">
      <span class="pso-treble">𝄞</span>
      <span>PSO</span>
    </a>

    <nav class="pso-topbar-nav" aria-label="Main navigation">
      <div class="top-nav-item has-submenu">
        <a href="{{ '/capstone/powayorchestra/#about' | relative_url }}" class="top-nav-link">About <span class="top-nav-caret">&#9662;</span></a>
        <div class="top-nav-dropdown">
          <a href="{{ '/capstone/powayorchestra/#about' | relative_url }}" class="top-nav-dropdown-link">Our Mission</a>
          <a href="{{ '/capstone/powayorchestra/#foundation' | relative_url }}" class="top-nav-dropdown-link">Foundation</a>
          <a href="{{ '/capstone/powayorchestra/#news' | relative_url }}" class="top-nav-dropdown-link">News</a>
        </div>
      </div>

      <div class="top-nav-item has-submenu">
        <a href="{{ '/capstone/powayorchestra/#concerts' | relative_url }}" class="top-nav-link">Concerts <span class="top-nav-caret">&#9662;</span></a>
        <div class="top-nav-dropdown">
          <a href="{{ '/capstone/powayorchestra/#concerts' | relative_url }}" class="top-nav-dropdown-link">2025-2026 Season</a>
          <a href="{{ '/capstone/powayorchestra/#tickets' | relative_url }}" class="top-nav-dropdown-link">Buy Tickets</a>
          <a href="{{ '/capstone/powayorchestra/#media' | relative_url }}" class="top-nav-dropdown-link">Videos and Recordings</a>
        </div>
      </div>

      <div class="top-nav-item has-submenu">
        <a href="{{ '/capstone/powayorchestra/#support' | relative_url }}" class="top-nav-link">Support <span class="top-nav-caret">&#9662;</span></a>
        <div class="top-nav-dropdown">
          <a href="{{ '/capstone/powayorchestra/#donate' | relative_url }}" class="top-nav-dropdown-link">Donor and Sponsor Program</a>
          <a href="{{ '/capstone/powayorchestra/#donate' | relative_url }}" class="top-nav-dropdown-link">Volunteer</a>
        </div>
      </div>

      <div class="top-nav-item">
        <a href="{{ '/capstone/powayorchestra/#conductor' | relative_url }}" class="top-nav-link">Conductor</a>
      </div>

      <div class="top-nav-item has-submenu">
        <a href="{{ '/capstone/powayorchestra/#musicians' | relative_url }}" class="top-nav-link">Musicians <span class="top-nav-caret">&#9662;</span></a>
        <div class="top-nav-dropdown">
          <a href="{{ '/capstone/powayorchestra/#musicians' | relative_url }}" class="top-nav-dropdown-link">Join the Orchestra</a>
          <a href="{{ '/capstone/powayorchestra/#musicians' | relative_url }}" class="top-nav-dropdown-link">Musician Info</a>
        </div>
      </div>

      <div class="top-nav-item">
        <a href="{{ '/capstone/powayorchestra/#contact' | relative_url }}" class="top-nav-link">Contact</a>
      </div>

      <div class="top-nav-item">
        <a href="{{ '/capstone/powayorchestra/signin/' | relative_url }}" class="top-nav-link">Sign In</a>
      </div>

      <div class="top-nav-item">
        <a href="{{ '/capstone/powayorchestra/#donate' | relative_url }}" class="top-nav-link btn-primary">Donate</a>
      </div>
    </nav>
  </div>

  <section class="pso-signin-shell">
    <div class="pso-signin-inner">
      <div class="pso-signin-hero">
        <p class="pso-signin-eyebrow">Poway Center for the Performing Arts · Est. 2004</p>
        <h1>Poway Symphony Orchestra</h1>
        <p class="pso-signin-subtitle">Member and Patron Sign In</p>
        <div class="pso-signin-rule"></div>
        <p class="pso-signin-copy">
          Sign in to continue to orchestra resources, concert updates, and account tools while staying inside the Poway Symphony Orchestra experience.
        </p>
      </div>

      <div class="pso-signin-grid">
        <section class="pso-signin-card">
          <h2>Sign In</h2>
          <p class="pso-signin-section-copy">
            Use the same account you use across the site. After a successful sign-in, this page will return you to the orchestra homepage automatically.
          </p>

          <form class="pso-signin-form" id="pso-signin-form">
            <div class="pso-field">
              <label for="pso-uid">Email</label>
              <input id="pso-uid" name="uid" type="email" autocomplete="username" placeholder="your email address" required>
            </div>

            <div class="pso-field">
              <label for="pso-password">Password</label>
              <input id="pso-password" name="password" type="password" autocomplete="current-password" placeholder="Enter your password" required>
            </div>

            <div class="pso-form-actions">
              <button class="pso-button pso-button-primary" id="pso-submit-button" type="submit">Sign In</button>
              <a class="pso-inline-link" href="{{ '/login' | relative_url }}">Open the full site login page</a>
            </div>
          </form>

          <p class="pso-auth-message" id="pso-auth-message" role="status" aria-live="polite"></p>
          <div class="pso-auth-actions" id="pso-auth-actions">
            <a class="pso-button pso-button-secondary" href="{{ '/capstone/powayorchestra/' | relative_url }}">Continue to Orchestra Home</a>
            <a class="pso-button pso-button-secondary" href="{{ '/profile' | relative_url }}">Open Profile</a>
          </div>
        </section>

        <aside class="pso-signin-panel">
          <h3>Quick Access</h3>
          <p class="pso-signin-section-copy">
            After signing in, you can move directly back into the orchestra site for season details, musician information, and supporter resources.
          </p>

          <ul class="pso-panel-list">
            <li>
              <span class="pso-panel-label">Season</span>
              Browse the current concert season and ticket links.
            </li>
            <li>
              <span class="pso-panel-label">Musicians</span>
              Return to audition, rehearsal, and member information.
            </li>
            <li>
              <span class="pso-panel-label">Support</span>
              Jump back to donations, sponsor support, and contact details.
            </li>
          </ul>

          <h3>Need Help?</h3>
          <p class="pso-signin-section-copy">
            New here? Create an account first, or head back to the orchestra page for venue, ticketing, and contact information.
          </p>

          <div class="pso-panel-links">
            <a href="{{ '/signup' | relative_url }}">Create an Account</a>
            <a href="{{ '/capstone/powayorchestra/#contact' | relative_url }}">Orchestra Contact Info</a>
            <a href="https://powaycenter.com" target="_blank" rel="noopener">Poway Center Tickets</a>
          </div>
        </aside>
      </div>
    </div>
  </section>
</div>

<script type="module">
  import { baseurl, pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

  const form = document.getElementById('pso-signin-form');
  const message = document.getElementById('pso-auth-message');
  const actions = document.getElementById('pso-auth-actions');
  const submitButton = document.getElementById('pso-submit-button');
  const homeUrl = `${baseurl}/capstone/powayorchestra/`;

  function setMessage(type, text) {
    message.className = `pso-auth-message is-visible is-${type}`;
    message.textContent = text;
  }

  function clearMessage() {
    message.className = 'pso-auth-message';
    message.textContent = '';
  }

  function showActions() {
    actions.classList.add('is-visible');
  }

  async function checkExistingSession() {
    try {
      const response = await fetch(`${pythonURI}/api/id`, fetchOptions);
      if (!response.ok) return;

      const data = await response.json();
      if (data && data.name) {
        setMessage('success', `You are already signed in as ${data.name}.`);
        showActions();
      }
    } catch (error) {
      console.warn('Unable to verify existing session.', error);
    }
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearMessage();
    actions.classList.remove('is-visible');
    submitButton.disabled = true;
    submitButton.textContent = 'Signing In';
    setMessage('info', 'Signing you in and preparing your orchestra session...');

    const credentials = {
      uid: document.getElementById('pso-uid').value.trim(),
      password: document.getElementById('pso-password').value
    };

    try {
      const pythonRequest = fetch(`${pythonURI}/api/authenticate`, {
        ...fetchOptions,
        method: 'POST',
        body: JSON.stringify(credentials)
      });

      const javaRequest = fetch(`${javaURI}/authenticate`, {
        ...fetchOptions,
        method: 'POST',
        body: JSON.stringify(credentials)
      }).catch(() => null);

      const [pythonResult, javaResult] = await Promise.allSettled([pythonRequest, javaRequest]);
      if (pythonResult.status !== 'fulfilled' || !pythonResult.value.ok) {
        throw new Error('Sign in failed. Check your credentials and try again.');
      }

      if (javaResult.status === 'fulfilled' && javaResult.value && !javaResult.value.ok) {
        console.warn('Secondary Spring login did not complete successfully.');
      }

      setMessage('success', 'Sign in successful. Returning you to the orchestra page...');
      showActions();
      window.setTimeout(() => {
        window.location.href = homeUrl;
      }, 1200);
    } catch (error) {
      setMessage('error', error.message);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Sign In';
    }
  });

  checkExistingSession();
</script>