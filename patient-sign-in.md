---
layout: page
title: Patient Sign In
permalink: /patient-sign-in/
search_exclude: true
show_reading_time: false
---

{% assign data = site.data.capstones.palomar_health %}

<div class="palomar-foundation patient-signin-shell">
  <div class="palomar-topbar">
    <a href="{{ '/capstone/palomarhealth/' | relative_url }}" class="palomar-home-trigger" aria-label="Go to home view">
      <img src="{{ site.baseurl }}/images/capstone/palomar.png" alt="Palomar Health home">
      <span class="home-trigger-label">Home</span>
    </a>
    <div class="palomar-topbar-actions">
      {% for item in data.top_navigation %}
      {% assign item_href = item.link %}
      {% assign item_first = item_href | slice: 0, 1 %}
      {% if item_first == '#' %}
      {% assign item_href = '/capstone/palomarhealth/' | append: item.link %}
      {% endif %}
      <div class="top-nav-item{% if item.submenu %} has-submenu{% endif %}">
        <a href="{{ item_href | relative_url }}" class="btn-{{ item.variant | default: 'secondary' }} top-nav-link{% if item.nav_class %} {{ item.nav_class }}{% endif %}">{{ item.label }}{% if item.submenu %}<span class="top-nav-caret" aria-hidden="true">&#9662;</span>{% endif %}</a>
        {% if item.submenu %}
        <div class="top-nav-dropdown" role="menu" aria-label="{{ item.label }} submenu">
          {% for subitem in item.submenu %}
          {% assign subitem_href = subitem.link %}
          {% assign subitem_first = subitem_href | slice: 0, 1 %}
          {% if subitem_first == '#' %}
          {% assign subitem_href = '/capstone/palomarhealth/' | append: subitem.link %}
          {% endif %}
          <a href="{{ subitem_href | relative_url }}" class="top-nav-dropdown-link" role="menuitem">{{ subitem.label }}</a>
          {% endfor %}
        </div>
        {% endif %}
      </div>
      {% endfor %}
    </div>
  </div>

  <section class="patient-signin-wrap">
    <div class="patient-signin-brand">
      <img src="{{ site.baseurl }}/images/capstone/palomar.png" alt="Palomar Health">
      <p>Palomar Health</p>
    </div>

    <div id="signin-panel">
      <h1>Patient Sign In</h1>
      <p class="signin-intro">Sign in to access appointments, test results, and medical records.</p>
      <p id="signup-success" class="signup-success is-hidden-local">Account created. Please sign in.</p>

      <form class="patient-signin-form" method="post" action="/api/patient/auth/signin">
        <label for="patient-email">Email</label>
        <input id="patient-email" name="email" type="email" required>

        <label for="patient-password">Password</label>
        <input id="patient-password" name="password" type="password" required>

        <div class="patient-signin-row">
          <label class="remember-label" for="patient-remember">
            <input id="patient-remember" name="remember" type="checkbox" value="1">
            Remember me
          </label>
        </div>

        <button type="submit">Sign In</button>
      </form>

      <p class="signup-hint">New patient? <a href="#create-account" id="show-create-account">Create an account</a></p>
    </div>

    <div id="create-account-panel" class="is-hidden-local">
      <hr class="patient-signin-divider">

      <section id="create-account" class="signup-block" aria-label="Create patient account">
        <h2>Create Patient Account</h2>
        <p class="signin-intro">Create your account to manage appointments, records, and care communication.</p>

        <form class="patient-signin-form" id="patient-signup-form" method="post" action="/api/patient/auth/signup">
          <label for="patient-full-name">Full Name</label>
          <input id="patient-full-name" name="full_name" type="text" required>

          <label for="patient-signup-email">Email</label>
          <input id="patient-signup-email" name="email" type="email" required>

          <label for="patient-dob">Date of Birth</label>
          <input id="patient-dob" name="date_of_birth" type="date" required>

          <label for="patient-signup-password">Password</label>
          <input id="patient-signup-password" name="password" type="password" minlength="8" required>

          <label for="patient-confirm-password">Confirm Password</label>
          <input id="patient-confirm-password" name="confirm_password" type="password" minlength="8" required>

          <label class="remember-label" for="patient-agree">
            <input id="patient-agree" name="agree_terms" type="checkbox" value="1" required>
            I agree to the terms and privacy policy.
          </label>

          <button type="submit">Create Account</button>
        </form>

        <p class="signup-hint">Already have an account? <a href="#" id="show-signin">Sign in</a></p>
      </section>
    </div>

    <p class="integration-note">Backend integration note: update the form <code>action</code> URL and auth flow when your API is ready.</p>
  </section>
</div>

<style>
  .patient-signin-shell {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  .patient-signin-wrap {
    max-width: 560px;
    margin: 0 auto 1rem auto;
    padding: 1.5rem;
    border: 1px solid #3a5d84;
    border-radius: 14px;
    background: #101f33;
    color: #e5edf7;
  }

  .patient-signin-brand {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    margin-bottom: 0.8rem;
  }

  .patient-signin-brand img {
    height: 32px;
    width: auto;
    border-radius: 4px;
  }

  .patient-signin-brand p {
    margin: 0;
    color: #cfe0f2;
    font-weight: 700;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    font-size: 0.82rem;
  }

  .patient-signin-wrap h1 {
    margin: 0 0 0.5rem 0;
    font-size: 1.9rem;
    color: #ffffff;
  }

  .patient-signin-wrap p {
    color: #cfe0f2;
  }

  .signin-intro {
    margin-bottom: 1rem;
  }

  .patient-signin-divider {
    border: 0;
    border-top: 1px solid #3a5d84;
    margin: 1.1rem 0;
  }

  .signup-block h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
    color: #ffffff;
  }

  .patient-signin-form {
    display: grid;
    gap: 0.65rem;
    margin-top: 1rem;
  }

  .patient-signin-form label {
    font-weight: 650;
    color: #eaf5ff;
  }

  .patient-signin-form input[type="email"],
  .patient-signin-form input[type="text"],
  .patient-signin-form input[type="date"],
  .patient-signin-form input[type="password"] {
    padding: 0.6rem 0.7rem;
    border: 1px solid #3e6b96;
    border-radius: 8px;
    font-size: 1rem;
    color: #e5edf7;
    background: #13253b;
  }

  .patient-signin-form input[type="email"]:focus,
  .patient-signin-form input[type="text"]:focus,
  .patient-signin-form input[type="date"]:focus,
  .patient-signin-form input[type="password"]:focus {
    outline: none;
    border-color: #6ea5d4;
    box-shadow: 0 0 0 2px rgba(110, 165, 212, 0.25);
  }

  .patient-signin-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0.25rem 0;
    gap: 0.75rem;
  }

  .remember-label {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-weight: 500;
    color: #d9e7f6;
  }

  .patient-signin-row a,
  .signup-hint a {
    color: #9ed4ff;
    text-decoration: none;
  }

  .patient-signin-row a:hover,
  .signup-hint a:hover {
    color: #c6e7ff;
    text-decoration: underline;
  }

  .patient-signin-form button {
    margin-top: 0.35rem;
    padding: 0.65rem 0.85rem;
    border: 1px solid #5f95c2;
    border-radius: 8px;
    background: linear-gradient(135deg, #2d6ea3, #1d4f78);
    color: #ffffff;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
  }

  .patient-signin-form button:hover {
    background: linear-gradient(135deg, #3278b1, #245d8f);
  }

  .signup-hint,
  .integration-note {
    margin-top: 0.9rem;
    font-size: 0.92rem;
  }

  .signup-success {
    margin: 0.3rem 0 0.8rem 0;
    padding: 0.5rem 0.65rem;
    border-radius: 8px;
    border: 1px solid #5f95c2;
    background: rgba(39, 90, 134, 0.28);
    color: #d9ecff;
    font-size: 0.9rem;
  }

  .is-hidden-local {
    display: none;
  }

  .integration-note {
    color: #9fb2c8;
  }

  .integration-note code {
    color: #ffd48a;
  }

  @media (max-width: 640px) {
    .patient-signin-wrap {
      padding: 1.1rem;
      margin-bottom: 0.75rem;
    }

    .patient-signin-wrap h1 {
      font-size: 1.6rem;
    }
  }
</style>

<script>
  (function () {
    var signinPanel = document.getElementById('signin-panel');
    var createPanel = document.getElementById('create-account-panel');
    var showCreateLink = document.getElementById('show-create-account');
    var showSigninLink = document.getElementById('show-signin');
    var signupForm = document.getElementById('patient-signup-form');
    var successNote = document.getElementById('signup-success');

    if (!signinPanel || !createPanel) return;

    function showSignIn() {
      signinPanel.classList.remove('is-hidden-local');
      createPanel.classList.add('is-hidden-local');
    }

    function showCreate() {
      signinPanel.classList.add('is-hidden-local');
      createPanel.classList.remove('is-hidden-local');
      createPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    showSignIn();

    if (window.location.hash === '#create-account') {
      showCreate();
    }

    if (window.location.search.indexOf('created=1') !== -1 && successNote) {
      successNote.classList.remove('is-hidden-local');
    }

    if (showCreateLink) {
      showCreateLink.addEventListener('click', function (event) {
        event.preventDefault();
        showCreate();
      });
    }

    if (showSigninLink) {
      showSigninLink.addEventListener('click', function (event) {
        event.preventDefault();
        showSignIn();
      });
    }

    if (signupForm) {
      signupForm.addEventListener('submit', function (event) {
        event.preventDefault();
        var next = '{{ '/patient-sign-in/' | relative_url }}?created=1';
        window.location.assign(next);
      });
    }
  })();
</script>
