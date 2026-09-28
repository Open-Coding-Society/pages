---
layout: page
title: Login
permalink: /login
search_exclude: true
show_reading_time: false
---
<br>

<script src="https://accounts.google.com/gsi/client" async defer></script>

<!-- Student/Mentor selector: switches the signup form and wording. Where an account goes after
     login (student, pending mentor, verified mentor) is always decided by Spring's roles. -->
<section class="login-role">
    <h3 class="login-role__title">Create an Account</h3>
    <div class="ocs__links login-role__options" role="group" aria-label="Account type" aria-describedby="accountRoleHint">
        <button type="button" class="ocs__btn pill accent fill" data-account-role="student" aria-pressed="true">Student</button>
        <button type="button" class="ocs__btn pill" data-account-role="mentor" aria-pressed="false">Mentor</button>
    </div>
    <div id="accountRoleHint" class="login-role__hint">Students sign up with their school information and Google account.</div>
</section>

<div class="login-container">
    <!-- Python Login Form -->
    <div class="login-card">
        <h1 id="pythonTitle">User Login</h1>
        <hr>
        <div id="loginPending" class="login-notice login-notice--pending" role="status" hidden>
            <h3>Verification Pending</h3>
            <p>Your mentor account has not been verified yet. Please wait for an administrator to approve your account before accessing the mentor portal.</p>
            <p>Your account and signup information are saved, so you won't need to register again.</p>
        </div>
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
            <div id="message" class="login-message" role="alert"></div>
            <p>
                <a href="{{site.baseurl}}/support?topic=reset">Forgot your password?</a>
            </p>
        </form>
    </div>
    <div class="signup-card">
        <h1 id="signupTitle">Sign Up</h1>
        <hr>
        <div id="signupMentorPending" class="login-notice login-notice--pending" role="status" hidden>
            <h3>Mentor Verification Pending</h3>
            <p>Your mentor account has been created successfully. An administrator must verify your account before you can access the mentor portal.</p>
            <p>You will be able to log in normally once your account has been verified.</p>
        </div>
        <!-- Google OAuth Section (initially hidden) -->
        <div id="oauth-verification" hidden>
            <h3>Google Account Verification</h3>
            <p id="oauth-copy-student">
                Sign in with any Google account. Poway USD student accounts receive immediate access;
                other accounts will await administrator approval.
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
                 data-logo_alignment="left">
            </div>
            <button type="button" class="large secondary" onclick="showSignupForm()">
                ← Back to Form
            </button>
            <div id="oauth-status"></div>
        </div>
        <!-- Signup Form -->
        <form id="signupForm" onsubmit="handleSignupSubmit(event);">
            <p id="mentorSignupNote" class="login-notice" hidden>
                You are creating a <strong>mentor account</strong>. Mentor accounts require administrator verification before access to the mentor portal is granted.
            </p>
            <div class="form-group">
                <input type="text" id="name" placeholder="Name" required>
            </div>
            <div class="form-group">
                <input type="text" id="signupUid" placeholder="GitHub ID" aria-describedby="github-id-validation-message" required>
                <div id="github-id-validation-message" class="validation-message error" aria-live="polite"></div>
            </div>
            <div class="form-group" id="signupSidGroup">
                <input type="text" id="signupSid" placeholder="Student ID" required>
            </div>
            <div class="form-group" id="signupSchoolGroup">
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
            <div class="form-group" id="signupBusinessEmailGroup" hidden>
                <input type="email" id="signupBusinessEmail" placeholder="Business / Work Email">
            </div>
            <div class="form-group">
                <input type="password" id="signupPassword" placeholder="Password" required>
            </div>
            <!-- Confirm Password Field -->
            <div class="form-group">
                <input type="password" id="confirmPassword" placeholder="Confirm Password" required>
                <div id="password-validation-message" class="validation-message"></div>
            </div>
            <p id="kasmNeededGroup">
                <label class="switch">
                    <span class="toggle">
                        <input type="checkbox" name="kasmNeeded" id="kasmNeeded">
                        <span class="slider"></span>
                    </span>
                    <span class="label-text">Kasm Server Needed</span>
                </label>
            </p>
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
    import { login, pythonURI, javaURI, fetchOptions, GOOGLE_CLIENT_ID } from '{{site.baseurl}}/assets/js/api/config.js';
    import { fetchPerson, roleNames } from '{{site.baseurl}}/assets/js/api/role-view.js';

    let signupFormData = {};
    let verifiedSchoolEmail = null;
    let signupIdToken = null;
    let validationTimeout = null;

    // Kept as references so the Flask chip can be detached for mentors and restored.
    const flaskStatusEl = document.getElementById('flaskStatus');
    const springStatusEl = document.getElementById('springStatus');

    function isMentorMode() {
        return document.querySelector('[data-account-role="mentor"]').getAttribute('aria-pressed') === 'true';
    }

    // Selected option uses the OCS "accent fill" pill; the other stays a plain pill.
    function selectAccountRole(button) {
        document.querySelectorAll('[data-account-role]').forEach(option => {
            const selected = option === button;
            option.setAttribute('aria-pressed', String(selected));
            option.classList.toggle('accent', selected);
            option.classList.toggle('fill', selected);
        });
        updateSignupModeUI();
    }

    const STUDENT_ID_AS_GITHUB_ID_PATTERN = /^\d{7}$/;

    function validateGithubId() {
        const githubIdField = document.getElementById('signupUid');
        const messageDiv = document.getElementById('github-id-validation-message');

        // This check only makes sense for students, who might mistakenly type their
        // 7-digit student ID into what's asking for a GitHub username. Mentors don't
        // have a student ID to confuse it with, and aren't necessarily asked for a
        // GitHub account at all (see updateSignupModeUI) -- so skip it for them.
        if (isMentorMode()) {
            githubIdField.setCustomValidity('');
            messageDiv.textContent = '';
            return true;
        }

        const isStudentId = STUDENT_ID_AS_GITHUB_ID_PATTERN.test(githubIdField.value.trim());
        const message = isStudentId ? 'Enter your GitHub ID, not your 7-digit student ID.' : '';

        githubIdField.setCustomValidity(message);
        messageDiv.textContent = message;
        return !isStudentId;
    }

    document.getElementById('signupUid').addEventListener('input', validateGithubId);

    // Mentor signup drops Student ID, school and the Google step, and asks for a business
    // email instead (see signupMentor). A hidden-but-required field still blocks form
    // submission, so the required attribute has to come off, not just the display.
    function updateSignupModeUI() {
        const isMentor = isMentorMode();
        const sidGroup = document.getElementById('signupSidGroup');
        const schoolGroup = document.getElementById('signupSchoolGroup');
        const sidField = document.getElementById('signupSid');
        const schoolField = document.getElementById('signupSchool');
        const emailField = document.getElementById('signupEmail');

        sidGroup.hidden = isMentor;
        schoolGroup.hidden = isMentor;
        sidField.required = !isMentor;
        schoolField.required = !isMentor;
        emailField.placeholder = isMentor ? 'Personal Email' : 'Personal (not school) Email';
        // Spring requires a business email for mentors (shown to the admin on the mentor ticket).
        document.getElementById('signupBusinessEmailGroup').hidden = !isMentor;
        document.getElementById('signupBusinessEmail').required = isMentor;
        document.getElementById('mentorSignupNote').hidden = !isMentor;
        document.getElementById('signupMentorPending').hidden = true;
        document.getElementById('signupTitle').textContent = isMentor ? 'Mentor Sign Up' : 'Sign Up';
        document.getElementById('accountRoleHint').textContent = isMentor
            ? 'Mentor accounts require administrator verification before access to the mentor portal is granted.'
            : 'Students sign up with their school information and Google account.';
        document.getElementById('uid').placeholder = isMentor ? 'Username' : 'GitHub ID';
        // Mentor accounts are created in Spring only. .status-item sets display, which
        // overrides the hidden attribute, so the Flask chip is detached instead.
        if (isMentor) flaskStatusEl.remove();
        else if (!flaskStatusEl.isConnected) springStatusEl.before(flaskStatusEl);
        document.getElementById('overallStatus').classList.add('hidden');
        window.showSignupForm();

        // "GitHub ID" is a student-signup concept (matches their GitHub Classroom
        // handle); a mentor has no reason to have or know one. The field is still
        // required -- it's their login username either way -- just relabeled, and
        // re-validated immediately so a leftover "not your student ID" message from
        // switching modes doesn't linger.
        const uidField = document.getElementById('signupUid');
        uidField.placeholder = isMentor ? 'Username' : 'GitHub ID';
        validateGithubId();

        // Mentors have no use for Kasm servers. Hidden (not required), same as sid/school
        // above -- the checkbox stays unchecked while hidden, so no extra guard is needed
        // where its .checked value gets read further down.
        const kasmGroup = document.getElementById('kasmNeededGroup');
        const kasmField = document.getElementById('kasmNeeded');
        kasmGroup.hidden = isMentor;
        if (isMentor) kasmField.checked = false;
    }

    document.querySelectorAll('[data-account-role]').forEach(button => button.addEventListener('click', () => selectAccountRole(button)));

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

        if (password.length < 8) {
            confirmField.classList.add('password-length');
            messageDiv.classList.add('error');
            messageDiv.textContent = '✗ Passwords must be at least 8 characters long';
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

        if (!validateGithubId()) {
            document.getElementById('signupUid').reportValidity();
            document.getElementById('signupUid').focus();
            return false;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match. Please try again.');
            document.getElementById('confirmPassword').focus();
            return false;
        }

        if (password.length < 8) {
            alert('Password must be at least 8 characters long.');
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

    function updateOverallStatus() {
        const flaskEl = document.getElementById('flaskStatus');
        const springEl = document.getElementById('springStatus');
        const overallEl = document.getElementById('overallStatus');

        const flaskSuccess = flaskEl.classList.contains('success');
        const springSuccess = springEl.classList.contains('success');
        const flaskError = flaskEl.classList.contains('error');
        const springError = springEl.classList.contains('error');

        overallEl.classList.remove('hidden', 'success', 'partial', 'error');

        if (flaskSuccess && springSuccess) {
            overallEl.classList.add('success');
            overallEl.textContent = '🎉 Account created on both backends! You can now login.';
        } else if (flaskSuccess && springError) {
            overallEl.classList.add('partial');
            overallEl.textContent = '⚠️ Flask account created successfully! Spring failed but you can still login.';
        } else if (flaskError && springSuccess) {
            overallEl.classList.add('partial');
            overallEl.textContent = '⚠️ Spring account created! Flask failed - please try again.';
        } else if (flaskError && springError) {
            overallEl.classList.add('error');
            overallEl.textContent = '💥 Both backends failed. Please check your information and try again.';
        }
    }

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

        if (isMentorMode()) {
            signupMentor();
            return;
        }

        // Store form data
        signupFormData = {
            role: 'student',
            name: document.getElementById("name").value,
            uid: document.getElementById("signupUid").value,
            sid: document.getElementById("signupSid").value,
            school: document.getElementById("signupSchool").value,
            email: document.getElementById("signupEmail").value,
            password: document.getElementById("signupPassword").value,
            kasm_server_needed: document.getElementById("kasmNeeded").checked,
        };

        // Students verify with Google before the account is created
        showOAuthVerification();
    }

    function showOAuthVerification() {
        document.getElementById('signupForm').hidden = true;
        document.getElementById('oauth-verification').hidden = false;
    }

    window.showSignupForm = function() {
        document.getElementById('oauth-verification').hidden = true;
        document.getElementById('signupForm').hidden = false;
        clearOAuthStatus();
    }

    // Mentor accounts live in Spring only. Spring's /api/person/create accepts a signup
    // without a Google token only when accountType is exactly "mentor"; the account is
    // created as ROLE_PENDING with a MentorTicket that an admin approves.
    async function signupMentor() {
        const signupButton = document.querySelector('#signupForm button[type="submit"]');
        const overallEl = document.getElementById('overallStatus');
        signupButton.disabled = true;
        updateBackendStatus('spring', 'pending');
        overallEl.classList.add('hidden');
        overallEl.classList.remove('success', 'partial', 'error');

        let errorMessage = null;
        try {
            const response = await fetch(`${javaURI}/api/person/create`, {
                ...fetchOptions,
                method: "POST",
                body: JSON.stringify({
                    accountType: "mentor",
                    name: document.getElementById("name").value,
                    uid: document.getElementById("signupUid").value,
                    email: document.getElementById("signupEmail").value,
                    businessEmail: document.getElementById("signupBusinessEmail").value,
                    password: document.getElementById("signupPassword").value,
                }),
            });
            if (!response.ok) {
                const raw = await response.text();
                let detail = raw;
                try { detail = JSON.parse(raw).error || raw; } catch (_) { /* keep raw text */ }
                errorMessage = `Mentor signup failed: ${detail || response.status}`;
            }
        } catch (error) {
            errorMessage = `Mentor signup failed: ${error.message}`;
        }

        signupButton.disabled = false;
        if (errorMessage) {
            console.error(errorMessage);
            updateBackendStatus('spring', 'error');
            overallEl.classList.remove('hidden');
            overallEl.classList.add('error');
            overallEl.textContent = `💥 ${errorMessage}`;
            return;
        }
        updateBackendStatus('spring', 'success');
        document.getElementById('signupForm').hidden = true;
        document.getElementById('signupMentorPending').hidden = false;
    }

    function clearOAuthStatus() {
        document.getElementById('oauth-status').innerHTML = '';
    }

    function showOAuthStatus(message, isError = false) {
        const statusDiv = document.getElementById('oauth-status');
        statusDiv.innerHTML = `<div class="${isError ? 'oauth-error' : 'oauth-success'}">${message}</div>`;
    }

    window.handleGoogleSignIn = function(response) {
        try {
            const userInfo = parseJwt(response.credential);
            const email = userInfo.email;
            verifiedSchoolEmail = email;
            signupIdToken = response.credential;
            signupFormData.email = email;
            showOAuthStatus(`✅ Google account selected: ${email}`);

            setTimeout(() => {
                document.getElementById('oauth-verification').hidden = true;
                document.getElementById('signupForm').hidden = false;

                console.log("About to call signup() with stored data:", signupFormData);
                console.log("pythonURI:", pythonURI);


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
        updateSignupModeUI();

        const passwordField = document.getElementById('signupPassword');
        const confirmPasswordField = document.getElementById('confirmPassword');

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

    // Local-only preview: typing "mentor" as the GitHub ID skips both real backends
    // entirely and drops you straight on /capstone/ flagged as an approved mentor, so
    // the mentor hover actions (see navigation/capstone.md) can be checked without a
    // real Spring account working through OAuth signup + admin approval. Gated to
    // localhost so it can never fire against the deployed site. Remove once the mentor
    // feature no longer needs this shortcut to preview.
    function isDevMentorPreview(uid) {
        const isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
        return isLocalhost && uid.trim().toLowerCase() === 'mentor';
    }

    // Function to handle both Python and Java login simultaneously
    window.loginBoth = function () {
        if (isDevMentorPreview(document.getElementById('uid').value)) {
            localStorage.setItem('ocsDevMentorPreview', 'true');
            window.location.href = '{{site.baseurl}}/capstone/';
            return;
        }

        // Wrap both logins in Promises and only redirect after both finish
        let javaPromise = new Promise((resolve) => {
            window.javaLogin(resolve);
        });
        let pythonPromise = new Promise((resolve) => {
            window.pythonLogin(resolve);
        });
        document.getElementById('loginPending').hidden = true;
        Promise.allSettled([javaPromise, pythonPromise]).then(async ([javaOutcome, pythonOutcome]) => {
            // Spring decides the mentor/student view (see role-view.js). Mentors exist
            // only in Spring, so a Flask failure is tolerated in pythonLogin's onFailure;
            // students may exist only in Flask, so a Flask success alone still logs in.
            const person = await fetchPerson();
            if (person && roleNames(person).includes('ROLE_PENDING') && await hasPendingMentorTicket()) {
                // A mentor awaiting approval must not reach the mentor portal.
                document.getElementById('message').textContent = '';
                document.getElementById('loginPending').hidden = false;
                logoutSpring();
                return;
            }
            if (person || pythonOutcome.value === true) {
                window.location.href = '{{site.baseurl}}/profile';
                return;
            }
            document.getElementById('message').textContent = await describeLoginFailure(javaOutcome.value);
        });
    };

    // ROLE_PENDING alone can't tell a pending mentor from other unapproved signups,
    // so ask Spring whether this account has an open mentor application.
    async function hasPendingMentorTicket() {
        try {
            const response = await fetch(`${javaURI}/api/person/mentor/ticket/status`, fetchOptions);
            return response.ok && !!(await response.json()).pending;
        } catch (error) {
            console.warn('Could not read mentor ticket status:', error.message);
            return false;
        }
    }

    // Drops the Spring session so a pending mentor isn't left half signed in.
    function logoutSpring() {
        fetch(`${javaURI}/api/logout`, { ...fetchOptions, method: 'POST' })
            .catch(error => console.warn('Spring logout after pending login failed:', error.message));
    }

    // Explains why login did not reach a live Spring session. Mentor accounts live in
    // Spring only, so the Spring login result is what tells a bad password from a real
    // "not verified yet" account.
    async function describeLoginFailure(springLogin) {
        if (springLogin?.reason === 'rejected') {
            return `Invalid login (${springLogin.status}).`;
        }
        if (springLogin?.reason === 'unreachable') {
            return 'Could not reach the Spring server. Make sure it is running, then try again.';
        }
        return 'Spring accepted the login but the session was not kept. Open this site at http://localhost:4500 (not 127.0.0.1) and try again.';
    }
    // Function to handle Python login
    window.pythonLogin = function (done) {
        const options = {
            URL: `${pythonURI}/api/authenticate`,
            callback: function() {
                pythonDatabase();
                if (done) done(true);
            },
            message: "message",
            // Spring is authoritative (see loginBoth above); a Flask-only failure
            // (no matching row, e.g. for a Spring-only mentor account) must not
            // block completion or leave a stale error message in place.
            onFailure: function() {
                document.getElementById("message").textContent = "";
                if (done) done(false);
            },
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
        const signupURL = `${javaURI}/api/person/create`;
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
                    const rejection = new Error("Invalid login");
                    rejection.outcome = { ok: false, reason: 'rejected', status: response.status };
                    throw rejection;
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
                    const sessionError = new Error(`Spring server response: ${response.status}`);
                    sessionError.outcome = { ok: false, reason: 'session', status: response.status };
                    throw sessionError;
                }
                return response.json();
            })
            .then(data => {
                console.log("Java database response:", data);
                if (done) done({ ok: true });
            })
            .catch(error => {
                console.error("Login failed:", error.message);
                // Spring login is optional for students; mentor mode reads this outcome to explain the failure.
                console.warn("Spring login unavailable; continuing with Flask auth flow.");
                if (done) done(error.outcome || { ok: false, reason: 'unreachable' });
            });
    };
    // Function to fetch and display Python data
    function pythonDatabase() {
        // Skip the /api/id fetch due to CORS restrictions with credentials mode.
        // The user is already authenticated (token in cookie); loginBoth() decides
        // where to send them once the Student/Mentor choice has been checked.
        console.log("Authentication successful.");
    }  
    window.signup = function () {
        const signupButton = document.querySelector(".signup-card button");
        // Disable the button and change its color
        signupButton.disabled = true;
        signupButton.classList.add("disabled");
        // Reset status indicators
        updateBackendStatus('flask', 'pending');
        updateBackendStatus('spring', 'pending');
        document.getElementById('overallStatus').classList.add('hidden');

        const data = signupFormData && Object.keys(signupFormData).length > 0 ? signupFormData : {
            role: 'student',
            name: document.getElementById("name").value,
            uid: document.getElementById("signupUid").value,
            sid: document.getElementById("signupSid").value,
            school: document.getElementById("signupSchool").value,
            email: document.getElementById("signupEmail").value,
            password: document.getElementById("signupPassword").value,
            kasm_server_needed: document.getElementById("kasmNeeded").checked,
        };

        const signupDataJava = {
            uid: data.uid,
            sid: data.sid,
            email: data.email,
            dob: "11-01-2024",
            name: data.name,
            password: data.password,
            kasmServerNeeded: data.kasm_server_needed,
            idToken: signupIdToken,
            // Only "mentor" takes Spring's no-idToken path (see signupMentor); students
            // keep the mandatory Google verification.
            accountType: data.role,
        };

        if (verifiedSchoolEmail) {
            console.log("Account created with verified school email:", verifiedSchoolEmail);
        }

        console.log("Sending this data to Flask:", JSON.stringify(data, null, 2));
        console.log("Request URL:", `${pythonURI}/api/user`);

        // Flask Backend Request
        const flaskPromise = fetch(`${pythonURI}/api/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                updateBackendStatus('flask', 'success');
                return response.json();
            } else {
                return response.text().then(errorText => {
                    console.log("Flask error details:", errorText);
                    throw new Error(`Flask: ${response.status} - ${errorText}`);
                });
            }
        })
        .catch(error => {
            console.error("Flask signup error:", error);
            updateBackendStatus('flask', 'error');
            throw error;
        });

        // Spring Backend Request
        const springPromise = fetch(`${javaURI}/api/person/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(signupDataJava)
        })
        .then(response => {
            if (response.ok) {
                updateBackendStatus('spring', 'success');
                return response.json();
            } else {
                throw new Error(`Spring: ${response.status}`);
            }
        })
        .catch(error => {
            console.error("Spring signup error:", error);
            updateBackendStatus('spring', 'error');
            throw error;
        });

        // Handle both requests
        Promise.allSettled([flaskPromise, springPromise])
            .then(results => {
                const [flaskResult, springResult] = results;

                console.log("Flask result:", flaskResult);
                console.log("Spring result:", springResult);

                // Update overall status after both complete
                setTimeout(updateOverallStatus, 500);

                // Re-enable button
                signupButton.disabled = false;
                signupButton.classList.remove("disabled");
            });
    }
    function javaDatabase() {
        const URL = `${javaURI}/api/person/get`;
        fetch(URL, fetchOptions)
            .then(response => {
                if (!response.ok) {
                    const sessionError = new Error(`Spring server response: ${response.status}`);
                    sessionError.outcome = { ok: false, reason: 'session', status: response.status };
                    throw sessionError;
                }
                return response.json();
            })
            .catch(error => {
                console.error("Java Database Error:", error);
            });
    }
</script>
