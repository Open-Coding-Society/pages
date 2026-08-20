---
layout: page
title: Support
permalink: /support
search_exclude: true
show_reading_time: false
---
<br>

<script src="https://accounts.google.com/gsi/client" async defer></script>

<style>
    .support-topic-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
    }
    .support-topic-item {
        padding: 1rem 1.25rem;
        cursor: pointer;
        border: 1px solid rgba(255, 255, 255, 0.15);
        background-color: rgba(255, 255, 255, 0.04);
        border-radius: 6px;
        transition: background-color 0.2s ease, border-color 0.2s ease;
    }
    .support-topic-item:hover {
        background-color: rgba(255, 255, 255, 0.09);
        border-color: rgba(255, 255, 255, 0.3);
    }

    .support-back-row {
        display: flex;
        justify-content: flex-end;
        margin-top: 2rem;
    }

    #support-reset-wizard {
        display: none;
        width: 100%;
        min-height: 100vh;
        box-sizing: border-box;
        padding: 3rem 1.5rem;
        justify-content: center;
    }
    #support-reset-wizard.active {
        display: flex;
        animation: supportFadeIn 0.4s ease;
    }
    .support-wizard-inner {
        width: 100%;
        max-width: 480px;
    }

    .support-step { display: none; opacity: 0; }
    .support-step.active { display: block; animation: supportStepIn 0.4s ease forwards; }
    .support-step.leaving { display: block; animation: supportStepOut 0.25s ease forwards; }

    @keyframes supportFadeIn {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes supportStepIn {
        from { opacity: 0; transform: translateY(16px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes supportStepOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-16px); }
    }
</style>

<!-- Landing view: list of support topics -->
<div id="support-topics-container" style="max-width: 700px; margin: 0 auto; padding: 0 1.5rem;">
    <ul class="support-topic-list">
        <li class="support-topic-item" onclick="openSupportTopic('reset')">Password Reset</li>
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
                <input type="text" id="resetUid" placeholder="GitHub ID" required>
            </div>
            <p>
                <button type="button" class="large primary submit-button" onclick="startOAuthReset()">Verify with School Account</button>
            </p>
        </div>
        <div id="reset-step-oauth" class="support-step" style="text-align: center; margin-bottom: 1.5rem;">
            <p style="margin-bottom: 1rem; color: #d1d5db;">
                Sign in with your <strong>@stu.powayusd.com</strong> school Google account to verify it's you.
            </p>
            <div id="reset-g_id_signin_container" style="display: flex; justify-content: center; margin-bottom: 1rem;"></div>
            <div id="reset-oauth-status" style="margin-top: 1rem;"></div>
            <p id="reset-ticket-row" style="display: none; margin-top: 1rem;">
                <button type="button" class="large secondary submit-button" onclick="requestResetTicket(this)">Request a Ticket Instead</button>
            </p>
        </div>
        <div id="reset-step-password" class="support-step">
            <div class="form-group">
                <input type="password" id="resetNewPassword" placeholder="New Password" required>
            </div>
            <div class="form-group">
                <input type="password" id="resetConfirmPassword" placeholder="Confirm New Password" required>
            </div>
            <p id="reset-password-validation-message"></p>
            <p>
                <button type="button" class="large primary submit-button" onclick="submitOAuthResetPassword()">Set New Password</button>
            </p>
        </div>
        <p id="reset-message" style="color: red;"></p>
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
        statusDiv.innerHTML = `<div class="${isError ? 'oauth-error' : 'oauth-success'}">${message}</div>`;
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

        if (window.google && window.google.accounts) {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleGoogleResetSignIn
            });
            window.google.accounts.id.renderButton(
                document.getElementById('reset-g_id_signin_container'),
                { type: 'standard', size: 'large', theme: 'filled_blue', text: 'signin_with', shape: 'rectangular' }
            );
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

        if (password.length < 8) {
            alert('Password must be at least 8 characters long.');
            return;
        }
        if (password !== confirmPassword) {
            alert('Passwords do not match. Please try again.');
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
