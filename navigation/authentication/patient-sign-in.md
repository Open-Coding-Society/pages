---
layout: page
title: Patient Sign In
permalink: /patient-sign-in
search_exclude: true
show_reading_time: false
---

<div class="patient-signin-wrap">
  <h1>Patient Sign In</h1>
  <p>Sign in to access appointments, test results, and medical records.</p>

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
      <a href="#" aria-disabled="true">Forgot password?</a>
    </div>

    <button type="submit">Sign In</button>
  </form>

  <p class="signup-hint">New patient? <a href="#" aria-disabled="true">Create an account</a></p>

  <p class="integration-note">Backend integration note: update the form <code>action</code> URL and auth flow when your API is ready.</p>
</div>

<style>
  .patient-signin-wrap {
    max-width: 520px;
    margin: 2rem auto;
    padding: 1.5rem;
    border: 1px solid #d4dce8;
    border-radius: 12px;
    background: #ffffff;
  }

  .patient-signin-wrap h1 {
    margin: 0 0 0.5rem 0;
    font-size: 1.9rem;
    color: #102542;
  }

  .patient-signin-wrap p {
    color: #2f3f58;
  }

  .patient-signin-form {
    display: grid;
    gap: 0.65rem;
    margin-top: 1rem;
  }

  .patient-signin-form label {
    font-weight: 650;
    color: #1a2f4d;
  }

  .patient-signin-form input[type="email"],
  .patient-signin-form input[type="password"] {
    padding: 0.6rem 0.7rem;
    border: 1px solid #b8c6d9;
    border-radius: 8px;
    font-size: 1rem;
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
  }

  .patient-signin-form button {
    margin-top: 0.35rem;
    padding: 0.65rem 0.85rem;
    border: 1px solid #2f6da6;
    border-radius: 8px;
    background: #2d6ea3;
    color: #ffffff;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
  }

  .patient-signin-form button:hover {
    background: #255a87;
  }

  .signup-hint,
  .integration-note {
    margin-top: 0.9rem;
    font-size: 0.92rem;
  }

  .integration-note {
    color: #4f6078;
  }
</style>