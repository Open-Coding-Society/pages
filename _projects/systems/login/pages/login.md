---
layout: page
title: Login
permalink: /login
search_exclude: true
show_reading_time: false
---
<br>

<script src="https://accounts.google.com/gsi/client" async defer></script>

<div class="login-container">
    <!-- Python Login Form -->
    <div class="login-card">
        <h1 id="pythonTitle">User Login</h1>
        <hr>
        <form id="pythonForm" onsubmit="loginBoth(); return false;">
            <div class="form-group">
                <input type="text" id="uid" placeholder="GitHub ID" required>
            </div>
            <div class="form-group">
                <input type="password" id="password" placeholder="Password" required>
            </div>
            <p>
                <button type="submit" class="large primary submit-button">Login</button>
            </p>
            <p id="message" style="color: red;"></p>
            <!-- Shown after login when a student's verification has lapsed -->
            <div id="reverify" style="display: none; text-align: center;">
                <h3>School Email Verification</h3>
                <p>Your verification has lapsed. Sign in with your school Google account to continue.</p>
                <div class="g_id_signin"
                     data-type="standard"
                     data-size="large"
                     data-theme="filled_blue"
                     data-text="signin_with"
                     data-shape="rectangular"
                     data-logo_alignment="left"></div>
                <p id="reverify-status"></p>
            </div>
            <p style="text-align: center;">
                <a href="{{site.baseurl}}/support?topic=reset">Forgot your password?</a>
            </p>
        </form>
    </div>
    <div class="signup-card">
        <h1 id="signupTitle">Sign Up</h1>
        <hr>
        <!-- Google OAuth Section (initially hidden) -->
        <div id="oauth-verification" style="display: none; text-align: center; margin-bottom: 2rem;">
            <h3 style="color: #6366f1; margin-bottom: 1rem;">🎓 School Email Verification</h3>
            <p style="margin-bottom: 1.5rem; color: #d1d5db;">
                Please sign in with your school Google account to verify you're a Poway USD student or teacher.
                <br><strong>You must use an email ending in @stu.powayusd.com or @powayusd.com</strong>
            </p>
            <div id="g_id_onload"
                 data-client_id="{{ site.google_client_id }}"
                 data-callback="handleGoogleSignIn"
                 data-auto_prompt="false">
            </div>
            <div class="g_id_signin" 
                 data-type="standard"
                 data-size="large"
                 data-theme="filled_blue"
                 data-text="signin_with"
                 data-shape="rectangular"
                 data-logo_alignment="left"
                 style="margin-bottom: 1rem;">
            </div>
            <button type="button" class="large secondary" onclick="showSignupForm()" 
                    style="background-color: #6b7280;">
                ← Back to Form
            </button>
            <div id="oauth-status" style="margin-top: 1rem;"></div>
        </div>
        <!-- Signup Form -->
        <form id="signupForm" onsubmit="handleSignupSubmit(event);">
            <div class="form-group">
                <select id="signupRole">
                    <option value="student" selected>I am a Student</option>
                    <option value="mentor">I am a Mentor</option>
                    <option value="guest" id="guestOption" hidden disabled>I am a guest</option>
                </select>
                <p id="guest-note" hidden>
                    A guest can view pages, comment on the microblog and react to posts. It needs no GitHub or school
                    account, and it lasts only a few hours. Guest sign-up is open until <span id="guest-closes"></span>:
                    log in with the same account during a later guest window to come back.
                </p>
            </div>
            <div class="form-group">
                <input type="text" id="name" placeholder="Name" required>
            </div>
            <div class="form-group">
                <input type="text" id="signupUid" placeholder="GitHub ID" required>
            </div>
            <div class="form-group">
                <input type="text" id="signupSid" placeholder="Student ID" required>
            </div>
            <div class="form-group">
                <select id="signupSchool" required>
                    <option value="" disabled selected>Select Your High School</option>
                    <option value="Abraxas High School">Abraxas</option>
                    <option value="Del Norte High School">Del Norte</option>
                    <option value="Mt Carmel High School">Mt Carmel</option>
                    <option value="Poway High School">Poway</option>
                    <option value="Poway to Palomar">Poway to Palomar</option>
                    <option value="Rancho Bernardo High School">Rancho Bernardo</option>
                    <option value="Westview High School">Westview</option>
                </select>
            </div>
            <div class="form-group">
                <input type="email" id="signupEmail" placeholder="Personal (not school) Email" required>
            </div>
            <div class="form-group">
                <input type="password" id="signupPassword" placeholder="Password" required>
            </div>
            <!-- Confirm Password Field -->
            <div class="form-group">
                <input type="password" id="confirmPassword" placeholder="Confirm Password" required>
                <div id="password-validation-message" class="validation-message"></div>
            </div>
            <p>
                <button type="submit" class="large primary submit-button">Sign Up</button>
            </p>
            <!-- Backend Status Display -->
            <div class="backend-status">
                <div id="flaskStatus" class="status-item">
                    <span class="status-icon">⏳</span>
                    <span class="status-text">Flask</span>
                </div>
                <div id="springStatus" class="status-item">
                    <span class="status-icon">⏳</span>
                    <span class="status-text">Spring</span>
                </div>
            </div>
            <div id="overallStatus" class="overall-status hidden"></div>
        </form>
    </div>
</div>

<script type="module">
    import { baseurl, pythonURI, javaURI, fetchOptions, GOOGLE_CLIENT_ID, springEnabled } from '{{site.baseurl}}/assets/js/api/config.js';
    import { loginReturnPath } from '{{site.baseurl}}/assets/js/api/login-return.js';
    import { reverifyNeeded, staffMustVerify, reverify } from '{{site.baseurl}}/assets/js/api/reverify.js';
    import { SPRING_PASSWORD_RULES, meetsSpringPasswordRules, attachPasswordChecklist } from '{{site.baseurl}}/assets/js/api/passwordRules.js';
    import { createBackends } from '{{site.baseurl}}/assets/js/login/backend.js';
    import { createSession } from '{{site.baseurl}}/assets/js/login/session.js';
    import { startLoginPage } from '{{site.baseurl}}/assets/js/login/login-page.js';

    startLoginPage({
        session: createSession(createBackends({ pythonURI, javaURI, fetchOptions, springEnabled })),
        pythonURI, javaURI, fetchOptions, GOOGLE_CLIENT_ID, loginReturnPath,
        reverifyNeeded, staffMustVerify, reverify,
        SPRING_PASSWORD_RULES, meetsSpringPasswordRules, attachPasswordChecklist,
        baseurl,
    });
</script>

<script type="module" src="{{site.baseurl}}/assets/js/api/passwordFields.js"></script>
