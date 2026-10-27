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
                </select>
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
    import { login, pythonURI, javaURI, fetchOptions, GOOGLE_CLIENT_ID, springEnabled } from '{{site.baseurl}}/assets/js/api/config.js';
    import { reverifyNeeded, staffMustVerify, reverify } from '{{site.baseurl}}/assets/js/api/reverify.js';
    import { SPRING_PASSWORD_RULES, meetsSpringPasswordRules, attachPasswordChecklist } from '{{site.baseurl}}/assets/js/api/passwordRules.js';

    let signupFormData = {};
    let verifiedSchoolEmail = null;
    let validationTimeout = null;

    // Password validation with debouncing (1.5 second delay)
    function validatePasswordsDebounced() {
        // Clear existing timeout
        if (validationTimeout) {
            clearTimeout(validationTimeout);
        }

        // Set new timeout for 1.5 seconds
        validationTimeout = setTimeout(() => {
            validateForm();
        }, 1500);
    }

    function validateForm() {
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const confirmField = document.getElementById('confirmPassword');
        const messageDiv = document.getElementById('password-validation-message');

        // Clear previous validation styles
        confirmField.classList.remove('password-match', 'password-mismatch', 'password-length');
        messageDiv.classList.remove('success', 'error');

        // Don't validate if confirm password is empty
        if (confirmPassword === '') {
            messageDiv.textContent = '';
            return true;
        }

        if (!meetsSpringPasswordRules(password)) {
            confirmField.classList.add('password-length');
            messageDiv.classList.add('error');
            messageDiv.textContent = `✗ ${SPRING_PASSWORD_RULES}`;
            return false;
        }

        if (password === confirmPassword) {
            confirmField.classList.add('password-match');
            messageDiv.classList.add('success');
            messageDiv.textContent = '✓ Passwords match';
            return true;
        } else {
            confirmField.classList.add('password-mismatch');
            messageDiv.classList.add('error');
            messageDiv.textContent = '✗ Passwords do not match';
            return false;
        }
    }

    // Form submission validation
    function validateSignupForm() {
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match. Please try again.');
            document.getElementById('confirmPassword').focus();
            return false;
        }

        if (!meetsSpringPasswordRules(password)) {
            alert(SPRING_PASSWORD_RULES);
            document.getElementById('signupPassword').focus();
            return false;
        }

        return true;
    }

    // Backend status management
    function updateBackendStatus(backend, status, message = '') {
        const element = document.getElementById(`${backend}Status`);
        const icon = element.querySelector('.status-icon');
        const text = element.querySelector('.status-text');

        // Remove existing status classes
        element.classList.remove('pending', 'success', 'error');

        switch(status) {
            case 'pending':
                element.classList.add('pending');
                icon.textContent = '⏳';
                text.textContent = backend.charAt(0).toUpperCase() + backend.slice(1);
                break;
            case 'success':
                element.classList.add('success');
                icon.textContent = '✅';
                text.textContent = `${backend.charAt(0).toUpperCase() + backend.slice(1)} ✓`;
                break;
            case 'error':
                element.classList.add('error');
                icon.textContent = '❌';
                text.textContent = `${backend.charAt(0).toUpperCase() + backend.slice(1)} ✗`;
                break;
        }
    }

    function updateOverallStatus(springErrorMessage = '', flaskErrorMessage = '') {
        const flaskEl = document.getElementById('flaskStatus');
        const springEl = document.getElementById('springStatus');
        const overallEl = document.getElementById('overallStatus');

        const flaskSuccess = flaskEl.classList.contains('success');
        const springSuccess = springEl.classList.contains('success');
        const flaskError = flaskEl.classList.contains('error');
        const springError = springEl.classList.contains('error');

        overallEl.classList.remove('hidden', 'success', 'partial', 'error');

        // A Flask-only site (spring: false in _config.yml) creates the account in Flask alone.
        if (!springEnabled) {
            overallEl.classList.add(flaskSuccess ? 'success' : 'error');
            overallEl.textContent = flaskSuccess
                ? '🎉 Account created! You can now login.'
                : `❌ Signup failed: ${flaskErrorMessage || 'the account could not be created.'} Please check your details and try again.`;
            return;
        }
        if (flaskSuccess && springSuccess) {
            overallEl.classList.add('success');
            overallEl.textContent = '🎉 Account created on both backends! You can now login.';
        } else if (flaskSuccess && springError) {
            overallEl.classList.add('partial');
            // Without a Spring account, DMs, calendar and announcements fail after login,
            // so say why Spring failed instead of implying everything works.
            overallEl.textContent = '⚠️ Flask account created, but Spring signup failed'
                + (springErrorMessage ? `: ${springErrorMessage}` : '.')
                + ' DMs, calendar and announcements need a working Spring account. Ask your teacher to fix it before logging in.';
        } else if (flaskError && springSuccess) {
            overallEl.classList.add('partial');
            overallEl.textContent = '⚠️ Spring account created! Flask failed - please try again.';
        } else if (flaskError) {
            // Flask is tried first and Spring only after Flask succeeds, so Spring was not tried
            overallEl.classList.add('error');
            overallEl.textContent = `❌ Signup failed: ${flaskErrorMessage || 'the account could not be created.'}`
                + ' Please check your details and try again.';
        }
    }

    // A Flask-only site has no Spring account, so sign-up shows only Flask's status.
    if (!springEnabled) document.getElementById('springStatus').style.display = 'none';

    // A mentor has no student ID or school, so those fields are hidden and not required.
    document.getElementById('signupRole').addEventListener('change', function () {
        const isMentor = this.value === 'mentor';
        ['signupSid', 'signupSchool'].forEach(id => {
            const field = document.getElementById(id);
            field.required = !isMentor;
            field.closest('.form-group').style.display = isMentor ? 'none' : '';
        });
    });

    window.handleSignupSubmit = function(event) {
        event.preventDefault();

        // Validate form
        const form = document.getElementById('signupForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Check password confirmation
        if (!validateSignupForm()) {
            return;
        }

        // Store form data
        signupFormData = {
            name: document.getElementById("name").value,
            uid: document.getElementById("signupUid").value,
            sid: document.getElementById("signupSid").value,
            school: document.getElementById("signupSchool").value,
            email: document.getElementById("signupEmail").value,
            password: document.getElementById("signupPassword").value,
            accountType: document.getElementById("signupRole").value,
        };

        // A mentor cannot use a school email, so they skip it and wait for a Teacher/Admin
        // to verify the account. A student verifies with Google first.
        if (signupFormData.accountType === 'mentor') {
            signup();
        } else {
            showOAuthVerification();
        }
    }

    function showOAuthVerification() {
        // Starting a signup drops any re-verification that was waiting on the same Google button
        reverifying = false;
        document.getElementById('reverify').style.display = 'none';
        document.getElementById('signupForm').style.display = 'none';
        document.getElementById('oauth-verification').style.display = 'block';
    }

    window.showSignupForm = function() {
        document.getElementById('oauth-verification').style.display = 'none';
        document.getElementById('signupForm').style.display = 'block';
        clearOAuthStatus();
    }

    function clearOAuthStatus() {
        document.getElementById('oauth-status').innerHTML = '';
    }

    function showOAuthStatus(message, isError = false) {
        const statusDiv = document.getElementById('oauth-status');
        statusDiv.innerHTML = `<div class="${isError ? 'oauth-error' : 'oauth-success'}">${message}</div>`;
    }

    // After login, a student whose verification has lapsed signs in with Google once more.
    // The same Google button callback serves signup and this, so it needs to know which.
    let reverifying = false;
    let afterReverify = null;

    async function finishReverify(idToken) {
        const status = document.getElementById('reverify-status');
        status.className = '';
        status.textContent = 'Checking with Google...';
        const result = await reverify(pythonURI, fetchOptions, idToken);
        if (!result.ok) {
            status.className = 'oauth-error';
            status.textContent = result.message;
            return;
        }
        reverifying = false;
        document.getElementById('reverify').style.display = 'none';
        afterReverify();
    }

    window.handleGoogleSignIn = function(response) {
        if (reverifying) {
            finishReverify(response.credential);
            return;
        }
        try {
            const userInfo = parseJwt(response.credential);
            const email = userInfo.email;
            if (!email.endsWith('@stu.powayusd.com') && !email.endsWith('@powayusd.com')) {
                showOAuthStatus('❌ You must use your school email address ending with @stu.powayusd.com or @powayusd.com', true);
                return;
            }
            verifiedSchoolEmail = email;
            signupFormData.idToken = response.credential;
            showOAuthStatus(`✅ School email verified: ${email}`);

            setTimeout(() => {
                document.getElementById('oauth-verification').style.display = 'none';
                document.getElementById('signupForm').style.display = 'block';

                signup();
            }, 1500);

        } catch (error) {
            console.error("Error handling Google Sign-In:", error);
            showOAuthStatus('❌ Error processing Google Sign-In. Please try again.', true);
        }
    }

    function parseJwt(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }

    // Initialize password validation when page loads
    window.addEventListener('load', function() {
        const passwordField = document.getElementById('signupPassword');
        const confirmPasswordField = document.getElementById('confirmPassword');

        attachPasswordChecklist(passwordField);

        if (passwordField && confirmPasswordField) {
            // Add debounced validation listeners
            passwordField.addEventListener('input', validatePasswordsDebounced);
            confirmPasswordField.addEventListener('input', validatePasswordsDebounced);
        }

        if (window.google && window.google.accounts) {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleGoogleSignIn
            });
        }
    });

    // Function to handle both Python and Java login simultaneously
    window.loginBoth = function () {
        // Wrap both logins in Promises and only redirect after both finish. A Flask-only site
        // (spring: false in _config.yml) signs in to Flask alone, so Spring counts as logged in.
        let javaPromise = springEnabled
            ? new Promise((resolve) => { window.javaLogin(resolve); })
            : Promise.resolve(true);
        let pythonPromise = new Promise((resolve) => {
            window.pythonLogin(resolve);
        });
        // pythonPromise only settles when Flask accepts the login; on a Flask failure
        // login() shows the error in #message and the page stays put.
        Promise.all([javaPromise, pythonPromise]).then(([springLoggedIn, flaskBody]) => {
            const finish = () => {
                if (springLoggedIn) {
                    window.location.href = '{{site.baseurl}}/profile';
                    return;
                }
                showSpringLoginWarning();
            };
            if (reverifyNeeded(flaskBody)) {
                reverifying = true;
                afterReverify = finish;
                document.getElementById('reverify').style.display = 'block';
                return;
            }
            if (staffMustVerify(flaskBody)) {
                showStaffVerifyNotice(finish);
                return;
            }
            finish();
        });
    };
    // A Mentor's verification has lapsed. Only a Teacher or Admin can verify it, and the
    // account still works, so say so and let them carry on.
    function showStaffVerifyNotice(finish) {
        const messageEl = document.getElementById('message');
        const carryOn = springLink('{{site.baseurl}}/profile', 'Continue');
        carryOn.addEventListener('click', (event) => {
            event.preventDefault();
            finish();
        });
        messageEl.innerHTML = '';
        messageEl.append(
            'Your verification has lapsed. Ask your Teacher or Admin to verify your account. ',
            carryOn,
        );
    }
    // Flask accepted the login but Spring did not. The navbar would still show the
    // user as signed in, while every Spring feature returns 401, so say so here.
    function showSpringLoginWarning() {
        const messageEl = document.getElementById('message');
        messageEl.innerHTML = '';
        messageEl.append(
            'Signed in to Flask, but the Spring server rejected this login, so DMs, calendar and announcements will not work. '
            + 'Your Spring password may differ from your Flask password. ',
            springLink(`${javaURI}/mvc/person/reset`, 'Reset your Spring password'),
            ' or ask your teacher, then log in again. ',
            springLink('{{site.baseurl}}/profile', 'Continue anyway'),
        );
    }
    function springLink(href, label) {
        const link = document.createElement('a');
        link.href = href;
        link.textContent = label;
        return link;
    }
    // Function to handle Python login
    window.pythonLogin = function (done) {
        const options = {
            URL: `${pythonURI}/api/authenticate`,
            callback: function(body) {
                if (done) done(body);
            },
            message: "message",
            method: "POST",
            cache: "no-cache",
            body: {
                uid: document.getElementById("uid").value,
                password: document.getElementById("password").value,
            }
        };
        login(options);
        // If login() is not async, call done() immediately
        // if (done) done();
    }
    // Function to handle Java login
    window.javaLogin = function (done) {
        const loginURL = `${javaURI}/authenticate`;
        const databaseURL = `${javaURI}/api/person/get`;
        const userCredentials = JSON.stringify({
            uid: document.getElementById("uid").value,
            password: document.getElementById("password").value,
        });
        const loginOptions = {
            ...fetchOptions,
            method: "POST",
            body: userCredentials,
        };
        console.log("Attempting Java login...");
        fetch(loginURL, loginOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Invalid login");
                }
                return response.text();
            })
            .then(data => {
                console.log("Login successful!", data);
                // Do not redirect here
                // Fetch database after login success using fetchOptions
                return fetch(databaseURL, fetchOptions);
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Spring server response: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Java database response:", data);
                if (done) done(true);
            })
            .catch(error => {
                console.error("Spring login failed:", error.message);
                if (done) done(false);
            });
    };
    window.signup = async function () {
        const signupButton = document.querySelector(".signup-card button");
        // Disable the button and change its color
        signupButton.disabled = true;
        signupButton.classList.add("disabled");
        // Reset status indicators
        updateBackendStatus('flask', 'pending');
        if (springEnabled) updateBackendStatus('spring', 'pending');
        document.getElementById('overallStatus').classList.add('hidden');

        const data = signupFormData && Object.keys(signupFormData).length > 0 ? signupFormData : {
            name: document.getElementById("name").value,
            uid: document.getElementById("signupUid").value,
            sid: document.getElementById("signupSid").value,
            school: document.getElementById("signupSchool").value,
            email: document.getElementById("signupEmail").value,
            password: document.getElementById("signupPassword").value,
        };

        // Never log `data`: it holds the plaintext password and the Google ID token.

        const flaskRequest = {
            ...fetchOptions,
            method: "POST",
            body: JSON.stringify(data)
        };

        const springRequest = {
            ...fetchOptions,
            method: "POST",
            body: JSON.stringify(data)
        };

        try {
            // Flask is the blocking source of truth for auth/signup.
            const flaskResponse = await fetch(`${pythonURI}/api/user`, flaskRequest);
            const flaskRaw = await flaskResponse.text();

            let flaskData;
            try {
                flaskData = flaskRaw ? JSON.parse(flaskRaw) : {};
            } catch (_) {
                flaskData = null;
            }
            // Not a JSON object (an error page from a proxy, or "null"): a failure, and do not show its text
            if (flaskData === null || typeof flaskData !== 'object') {
                flaskData = { success: false };
            }

            if (!flaskResponse.ok || flaskData.success === false) {
                const flaskMessage = flaskData.message || `Flask signup failed (${flaskResponse.status})`;
                throw new Error(flaskMessage);
            }

            updateBackendStatus('flask', 'success');
            if (!springEnabled) {
                setTimeout(updateOverallStatus, 500);
                return;
            }

            // Spring is best-effort; do not block signup success on this path.
            fetch(`${javaURI}/api/person/create`, springRequest)
                .then(async (springResponse) => {
                    const springRaw = await springResponse.text();
                    let springErrorMessage = '';
                    if (springResponse.ok) {
                        updateBackendStatus('spring', 'success');
                    } else {
                        console.warn("Spring signup failed:", springResponse.status, springRaw);
                        springErrorMessage = readSpringError(springRaw, springResponse.status);
                        updateBackendStatus('spring', 'error');
                    }
                    setTimeout(() => updateOverallStatus(springErrorMessage), 500);
                })
                .catch((springError) => {
                    console.warn("Spring signup error:", springError.message);
                    updateBackendStatus('spring', 'error');
                    setTimeout(() => updateOverallStatus('Spring server unreachable'), 500);
                });
        } catch (error) {
            console.error("Flask signup error:", error);
            updateBackendStatus('flask', 'error');
            setTimeout(() => updateOverallStatus('', flaskFailureMessage(error)), 500);
        } finally {
            signupButton.disabled = false;
            signupButton.classList.remove("disabled");
        }
    }
    // What to tell the user when Flask refused the signup. A TypeError means fetch() itself failed
    // (offline, CORS, server down), so there is no reply from Flask to quote.
    function flaskFailureMessage(error) {
        if (error instanceof TypeError) {
            return 'Could not reach the server. Check your connection and try again.';
        }
        return error.message;
    }
    // Spring's /api/person/create answers errors as {"error": "..."}, e.g. a uid conflict.
    function readSpringError(raw, status) {
        try {
            const body = JSON.parse(raw);
            if (body && body.error) return body.error;
        } catch (_) { /* not JSON */ }
        return `HTTP ${status}`;
    }
    function javaDatabase() {
        const URL = `${javaURI}/api/person/get`;
        fetch(URL, fetchOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Spring server response: ${response.status}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error("Java Database Error:", error);
            });
    }
</script>

<script type="module" src="{{site.baseurl}}/assets/js/api/passwordFields.js"></script>
