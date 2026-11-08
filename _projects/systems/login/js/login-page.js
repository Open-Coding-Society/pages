// The /login page: sign-in, sign-up and Google re-verification. `session` is a FlaskSession, or a
// SpringSession on a site that also runs Spring, so the page never asks which backends it has.
// It is published to assets/js/login/, so the page's starter passes in every shared helper.
export function startLoginPage({
    session, pythonURI, javaURI, fetchOptions, GOOGLE_CLIENT_ID, loginReturnPath,
    reverifyNeeded, staffMustVerify, reverify,
    SPRING_PASSWORD_RULES, meetsSpringPasswordRules, attachPasswordChecklist,
    baseurl,
}) {

    // Capture once so failed attempts and verification steps retain the destination.
    const returnPath = loginReturnPath(window.location.href, document.referrer, baseurl);

    let signupFormData = {};
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
    function updateBackendStatus(backend, status) {
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

        // A Flask-only site (spring: false in _config.yml), or a guest, creates the account in Flask alone.
        if (!signupCreatesSpringAccount()) {
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

    // Whether this sign-up also creates a Spring account: never on a Flask-only site, or for a guest.
    function signupCreatesSpringAccount() {
        return session.createsSpringAccount(signupFormData);
    }

    // A Flask-only site has no Spring account, so sign-up shows only Flask's status.
    if (!session.usesSpring) document.getElementById('springStatus').style.display = 'none';

    // A guest can sign up only while a Teacher or Admin has the Guest Window open, so the option is
    // offered only then. If Flask cannot be asked, it stays hidden.
    async function offerGuestOption() {
        try {
            const response = await fetch(`${pythonURI}/api/guest/window`, fetchOptions);
            const guestWindow = response.ok ? await response.json() : null;
            if (!guestWindow || guestWindow.open !== true) return;
            const option = document.getElementById('guestOption');
            option.hidden = false;
            option.disabled = false;
            // Flask gives UTC with no zone mark: say so, so the time shown is the visitor's own
            document.getElementById('guest-closes').textContent =
                new Date(guestWindow.closes_at + 'Z').toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        } catch (_) {
            // no Guest Window to offer
        }
    }
    offerGuestOption();

    // A mentor or a guest has no student ID or school, so those fields are hidden and not required.
    // A guest is asked for an email only to keep one account, so it is optional for them.
    document.getElementById('signupRole').addEventListener('change', function () {
        const noSchool = this.value === 'mentor' || this.value === 'guest';
        const email = document.getElementById('signupEmail');
        email.required = this.value !== 'guest';
        email.placeholder = this.value === 'guest' ? 'Email (optional, helps you keep one account)' : 'Personal (not school) Email';
        document.getElementById('guest-note').hidden = this.value !== 'guest';
        if (session.usesSpring) document.getElementById('springStatus').style.display = session.createsSpringAccount({ accountType: this.value }) ? '' : 'none';
        ['signupSid', 'signupSchool'].forEach(id => {
            const field = document.getElementById(id);
            field.required = !noSchool;
            field.closest('.form-group').style.display = noSchool ? 'none' : '';
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

        // A mentor or a guest has no student ID or school: do not send what was typed before the role changed.
        const role = document.getElementById("signupRole").value;
        const hasSchool = role !== 'mentor' && role !== 'guest';

        // Store form data
        signupFormData = {
            name: document.getElementById("name").value,
            uid: document.getElementById("signupUid").value,
            sid: hasSchool ? document.getElementById("signupSid").value : '',
            school: hasSchool ? document.getElementById("signupSchool").value : '',
            email: document.getElementById("signupEmail").value,
            password: document.getElementById("signupPassword").value,
            accountType: document.getElementById("signupRole").value,
        };
        if (role === 'guest' && !signupFormData.email) delete signupFormData.email;  // optional for a guest

        // A mentor cannot use a school email, so they skip it and wait for a Teacher/Admin
        // to verify the account. A guest needs no verification at all. A student verifies with
        // Google first.
        if (signupFormData.accountType === 'mentor' || signupFormData.accountType === 'guest') {
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

    // Signs in to Flask, and to Spring at the same time when the site has it, and only redirects after
    // both finish. When Flask refuses, the error shows in #message and the page stays put.
    window.loginBoth = function () {
        const messageEl = document.getElementById('message');
        messageEl.textContent = '';
        const uid = document.getElementById('uid').value;
        const password = document.getElementById('password').value;
        session.signIn(uid, password).then(({ flask: flaskBody, spring }) => {
            // A Flask-only site has no Spring sign-in, so only an answer of false means Spring refused.
            const springLoggedIn = spring !== false;
            const finish = () => {
                // Guests have no profile; direct logins fall back to the home page.
                if (flaskBody && flaskBody.user && flaskBody.user.limited) {
                    window.location.href = returnPath || `${baseurl}/`;
                    return;
                }
                if (springLoggedIn) {
                    window.location.href = returnPath || `${baseurl}/profile`;
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
        }, (error) => {
            console.log(loginErrorText(error));
            messageEl.textContent = loginErrorText(error);
        });
    };
    // The same words config.js's login() uses: a 403 says why (an expired guest, a closed Guest Window,
    // a pending account), and no answer at all means a network, CORS or server problem.
    function loginErrorText(error) {
        if (error.status === 0) return 'Possible CORS or service down error: ' + error.cause;
        const why = error.status === 403 && error.body && error.body.message;
        return 'Login error: ' + error.status + (why ? ' - ' + why : '');
    }
    // A Mentor's verification has lapsed. Only a Teacher or Admin can verify it, and the
    // account still works, so say so and let them carry on.
    function showStaffVerifyNotice(finish) {
        const messageEl = document.getElementById('message');
        const carryOn = springLink(`${baseurl}/profile`, 'Continue');
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
            springLink(`${baseurl}/profile`, 'Continue anyway'),
        );
    }
    function springLink(href, label) {
        const link = document.createElement('a');
        link.href = href;
        link.textContent = label;
        return link;
    }
    async function signup() {
        const signupButton = document.querySelector(".signup-card button");
        // Disable the button and change its color
        signupButton.disabled = true;
        signupButton.classList.add("disabled");
        // Reset status indicators
        updateBackendStatus('flask', 'pending');
        if (signupCreatesSpringAccount()) updateBackendStatus('spring', 'pending');
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

        try {
            // Flask is the blocking source of truth for auth/signup: the session rejects when it refuses.
            const { spring } = await session.signUp(data);

            updateBackendStatus('flask', 'success');
            if (!spring) {
                setTimeout(updateOverallStatus, 500);
                return;
            }

            // Spring is best-effort; do not block signup success on this path.
            spring.then(({ created, error }) => {
                updateBackendStatus('spring', created ? 'success' : 'error');
                setTimeout(() => updateOverallStatus(error), 500);
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
    // What to tell the user when Flask refused the signup. Status 0 means the request itself failed
    // (offline, CORS, server down), so there is no reply from Flask to quote.
    function flaskFailureMessage(error) {
        if (error.status === 0) {
            return 'Could not reach the server. Check your connection and try again.';
        }
        return error.message;
    }
}
