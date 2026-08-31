---
layout: page
title: Support
permalink: /support
search_exclude: true
show_reading_time: false
---
<br>

<script src="https://accounts.google.com/gsi/client" async defer></script>

<!-- Landing view: list of support topics -->
<div id="support-topics-container" class="support-topics-container">
    <ul class="support-topic-list">
        <li class="support-topic-item" role="button" tabindex="0" onclick="openSupportTopic('reset')">Password Reset</li>
    </ul>
    <div class="support-back-row">
        <a href="{{site.baseurl}}/login">← Back to Login</a>
    </div>
</div>

<!-- OAuth + Student ID Verified Password Reset: takes over the full page when opened -->
<div id="support-reset-wizard">
    <div class="support-wizard-inner">
        <h1>Let's Reset Your Password</h1>
        <hr>
        <div id="reset-step-uid" class="support-step active">
            <div class="form-group">
                <input type="text" id="resetUid" placeholder="GitHub ID" aria-label="GitHub ID" required>
            </div>
            <p>
                <button type="button" class="large primary submit-button" onclick="startOAuthReset()">Verify with School Account</button>
            </p>
        </div>
        <div id="reset-step-oauth" class="support-step support-step-centered">
            <p class="support-oauth-hint">
                Sign in with your <strong>@stu.powayusd.com</strong> school Google account to verify it's you.
            </p>
            <div id="reset-g_id_signin_container" class="support-g-signin-container"></div>
            <div id="reset-oauth-status" class="support-oauth-status"></div>
            <p id="reset-ticket-row" class="support-ticket-row">
                <button type="button" class="large secondary submit-button" onclick="requestResetTicket(this)">Request a Ticket Instead</button>
            </p>
        </div>
        <div id="reset-step-password" class="support-step">
            <div class="form-group">
                <input type="password" id="resetNewPassword" placeholder="New Password" aria-label="New Password" minlength="8" required>
            </div>
            <div class="form-group">
                <input type="password" id="resetConfirmPassword" placeholder="Confirm New Password" aria-label="Confirm New Password" minlength="8" required>
            </div>
            <p id="reset-password-validation-message"></p>
            <p>
                <button type="button" class="large primary submit-button" onclick="submitOAuthResetPassword()">Set New Password</button>
            </p>
        </div>
        <p id="reset-message" class="support-reset-message"></p>
        <div class="support-back-row">
            <a href="#" onclick="backToSupportTopics(); return false;">← Back</a>
        </div>
    </div>
</div>

<script type="module">
    import { javaURI, fetchOptions, GOOGLE_CLIENT_ID } from '{{site.baseurl}}/assets/js/api/config.js';

    // ---- Support topic navigation ----
    window.openSupportTopic = function(topic) {
        if (topic !== 'reset') return;
        document.getElementById('support-topics-container').style.display = 'none';
        document.getElementById('support-reset-wizard').classList.add('active');
    }

    // .support-topic-item is a `role="button"` <li> (not a real <button>/<a>, to keep the
    // existing visual design) -- this is what makes it keyboard-activatable, since a
    // non-form element's onclick doesn't fire on Enter/Space by default the way a real
    // button's does.
    document.addEventListener('keydown', function(event) {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        const target = event.target;
        if (!(target instanceof HTMLElement) || target.getAttribute('role') !== 'button') return;
        event.preventDefault();
        target.click();
    });

    window.backToSupportTopics = function() {
        document.getElementById('support-reset-wizard').classList.remove('active');
        document.getElementById('support-topics-container').style.display = '';
        resetWizardState();
    }

    function resetWizardState() {
        resetUidValue = null;
        resetTokenValue = null;
        document.getElementById('resetUid').value = '';
        document.getElementById('resetNewPassword').value = '';
        document.getElementById('resetConfirmPassword').value = '';
        document.getElementById('reset-message').textContent = '';
        document.getElementById('reset-oauth-status').innerHTML = '';
        document.getElementById('reset-ticket-row').style.display = 'none';
        goToResetStep('reset-step-uid');
    }

    // Animates between the reset wizard's steps: the outgoing step fades/slides out,
    // then the incoming step fades/slides in (see supportStepIn/Out keyframes above).
    function goToResetStep(stepId) {
        document.querySelectorAll('.support-step').forEach(step => {
            if (step.id === stepId) {
                step.classList.remove('leaving');
                step.classList.add('active');
            } else if (step.classList.contains('active')) {
                step.classList.remove('active');
                step.classList.add('leaving');
                setTimeout(() => step.classList.remove('leaving'), 300);
            }
        });
    }

    // ---- OAuth + Student ID Verified Password Reset ----
    // The digit-match check is re-verified server-side against a server-verified Google ID
    // token (see /mvc/person/reset/oauth/verify) — this client code only relays the raw
    // credential and renders the UI states the backend tells it about.
    let resetUidValue = null;
    let resetTokenValue = null;

    function showResetOAuthStatus(message, isError = false) {
        const statusDiv = document.getElementById('reset-oauth-status');
        statusDiv.textContent = '';
        const messageEl = document.createElement('div');
        messageEl.className = isError ? 'oauth-error' : 'oauth-success';
        messageEl.textContent = message;
        statusDiv.appendChild(messageEl);
    }

    window.startOAuthReset = function() {
        const uid = document.getElementById('resetUid').value.trim();
        if (!uid) {
            document.getElementById('reset-message').textContent = 'Please enter your GitHub ID.';
            return;
        }
        resetUidValue = uid;
        document.getElementById('reset-message').textContent = '';

        goToResetStep('reset-step-oauth');

        // Clear before rendering so re-entering this step (e.g. going back and retrying
        // with a different uid) doesn't stack a second sign-in button in the container.
        const signinContainer = document.getElementById('reset-g_id_signin_container');
        signinContainer.textContent = '';

        if (window.google && window.google.accounts) {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleGoogleResetSignIn
            });
            window.google.accounts.id.renderButton(
                signinContainer,
                { type: 'standard', size: 'large', theme: 'filled_blue', text: 'signin_with', shape: 'rectangular' }
            );
        } else {
            // The GSI script (loaded via <script src="https://accounts.google.com/gsi/client">)
            // failed to load or hasn't finished yet -- without this, the user is left staring
            // at an empty container with no sign-in button and no explanation.
            showResetOAuthStatus('❌ Could not load Google sign-in. Please check your connection and try again.', true);
        }
    }

    window.handleGoogleResetSignIn = function(response) {
        showResetOAuthStatus('Verifying your school account...');

        fetch(`${javaURI}/mvc/person/reset/oauth/verify`, {
            ...fetchOptions,
            method: 'POST',
            body: JSON.stringify({ uid: resetUidValue, idToken: response.credential }),
        })
        .then(res => {
            if (res.status === 429) {
                showResetOAuthStatus('❌ Too many reset attempts. Please try again later, or request a ticket below.', true);
                document.getElementById('reset-ticket-row').style.display = 'block';
                return null;
            }
            if (!res.ok) {
                showResetOAuthStatus('❌ We could not verify that this school account belongs to this user. Please check your GitHub ID and try again with your own school account.', true);
                return null;
            }
            return res.json();
        })
        .then(data => {
            if (!data || !data.verified) return;
            resetTokenValue = data.resetToken;
            showResetOAuthStatus('✅ School account verified!');
            setTimeout(() => {
                goToResetStep('reset-step-password');
            }, 1000);
        })
        .catch(error => {
            console.error('Reset verification failed:', error);
            showResetOAuthStatus('❌ Something went wrong verifying your account. Please try again.', true);
        });
    }

    // Fires when a rate-limited user asks for admin help instead of waiting out the
    // window. Creates (or reuses, if one's already open) a ResetTicket for this uid; an
    // admin resolves it from the Spring person/read portal, granting a batch of 5 extra
    // attempts. Doesn't require the OAuth step to have succeeded, since the whole point
    // is to cover the case where the user can't get through it right now.
    window.requestResetTicket = function(btn) {
        if (!resetUidValue) return;
        btn.disabled = true;

        fetch(`${javaURI}/mvc/person/reset/ticket`, {
            ...fetchOptions,
            method: 'POST',
            body: JSON.stringify({ uid: resetUidValue }),
        })
        .then(res => {
            if (!res.ok) throw new Error('ticket-failed');
            showResetOAuthStatus('✅ Ticket submitted! An admin will grant you more attempts soon.');
            btn.style.display = 'none';
        })
        .catch(error => {
            console.error('Reset ticket request failed:', error);
            showResetOAuthStatus('❌ Could not submit a ticket. Please try again.', true);
            btn.disabled = false;
        });
    }

    function validateResetForm() {
        const password = document.getElementById('resetNewPassword').value;
        const confirmPassword = document.getElementById('resetConfirmPassword').value;
        const confirmField = document.getElementById('resetConfirmPassword');
        const messageDiv = document.getElementById('reset-password-validation-message');

        confirmField.classList.remove('password-match', 'password-mismatch', 'password-length');
        messageDiv.classList.remove('success', 'error');

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

    window.submitOAuthResetPassword = function() {
        const password = document.getElementById('resetNewPassword').value;
        const confirmPassword = document.getElementById('resetConfirmPassword').value;
        const validationMessage = document.getElementById('reset-password-validation-message');

        if (password.length < 8) {
            validationMessage.classList.add('error');
            validationMessage.textContent = 'Password must be at least 8 characters long.';
            return;
        }
        if (password !== confirmPassword) {
            validationMessage.classList.add('error');
            validationMessage.textContent = 'Passwords do not match. Please try again.';
            return;
        }
        if (!resetUidValue || !resetTokenValue) {
            document.getElementById('reset-message').style.color = 'red';
            document.getElementById('reset-message').textContent = 'Your verification expired. Please start over.';
            return;
        }

        fetch(`${javaURI}/mvc/person/reset/oauth/complete`, {
            ...fetchOptions,
            method: 'POST',
            body: JSON.stringify({ uid: resetUidValue, resetToken: resetTokenValue, newPassword: password }),
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('reset-failed');
            }
            document.getElementById('reset-message').style.color = 'green';
            document.getElementById('reset-message').textContent = '✅ Password updated! Redirecting to login...';
            resetUidValue = null;
            resetTokenValue = null;
            setTimeout(() => {
                window.location.href = '{{site.baseurl}}/login';
            }, 1500);
        })
        .catch(error => {
            console.error('Reset completion failed:', error);
            document.getElementById('reset-message').style.color = 'red';
            document.getElementById('reset-message').textContent = 'Could not update your password. Your verification may have expired — please start over.';
        });
    }

    window.addEventListener('load', function() {
        const resetPasswordField = document.getElementById('resetNewPassword');
        const resetConfirmPasswordField = document.getElementById('resetConfirmPassword');
        if (resetPasswordField && resetConfirmPasswordField) {
            resetPasswordField.addEventListener('input', validateResetForm);
            resetConfirmPasswordField.addEventListener('input', validateResetForm);
        }

        // Deep-link support: ?topic=reset skips the topic list and jumps straight
        // into the password reset wizard (used by the "Forgot your password?" link
        // elsewhere on the site, so it doesn't force an extra click once /support
        // grows to cover more than just password reset).
        const params = new URLSearchParams(window.location.search);
        if (params.get('topic') === 'reset') {
            openSupportTopic('reset');
        }
    });
</script>
