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
			<img src="{{ site.baseurl }}/images/capstone/website_projects/palomar.png" alt="Palomar Health home">
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
			<img src="{{ site.baseurl }}/images/capstone/website_projects/palomar.png" alt="Palomar Health">
			<p>Palomar Health</p>
		</div>

		<h1>Patient Sign In</h1>
		<p id="patient-signin-message" class="patient-signin-message" role="status" aria-live="polite"></p>

		<div id="patient-signin-panel">
			<p class="signin-intro">Sign in with your existing portal credentials to access appointments, test results, and medical records.</p>

			<form class="patient-signin-form" id="patient-signin-form" method="post" action="#">
				<label for="patient-uid">Patient ID or Username</label>
				<input id="patient-uid" name="uid" type="text" autocomplete="username" required>

				<label for="patient-password">Password</label>
				<input id="patient-password" name="password" type="password" autocomplete="current-password" required>

				<div class="patient-signin-row">
					<label class="remember-label" for="patient-remember">
						<input id="patient-remember" name="remember" type="checkbox" value="1">
						Remember me
					</label>
				</div>

				<button type="submit">Sign In</button>
			</form>

			<p class="signup-hint">New patient? <a href="#create-account" id="patient-show-signup">Create an account</a></p>
		</div>

		<div id="patient-signup-panel" class="is-hidden-local">
			<p class="signin-intro">Create an account to manage appointments, records, and secure portal messages.</p>

			<form class="patient-signin-form" id="patient-signup-form" method="post" action="#">
				<label for="patient-signup-name">Full Name</label>
				<input id="patient-signup-name" name="name" type="text" autocomplete="name" required>

				<label for="patient-signup-uid">Patient ID or Username</label>
				<input id="patient-signup-uid" name="uid" type="text" autocomplete="username" required>

				<label for="patient-signup-email">Email</label>
				<input id="patient-signup-email" name="email" type="email" autocomplete="email" required>

				<label for="patient-signup-password">Password</label>
				<input id="patient-signup-password" name="password" type="password" autocomplete="new-password" minlength="8" required>

				<label for="patient-signup-confirm">Confirm Password</label>
				<input id="patient-signup-confirm" name="confirm_password" type="password" autocomplete="new-password" minlength="8" required>

				<button type="submit">Create Account</button>
			</form>

			<p class="signup-hint">Already have an account? <a href="#sign-in" id="patient-show-signin">Back to sign in</a></p>
		</div>

		<p class="integration-note">This sign-in now uses the existing backend auth endpoint and session cookie flow.</p>
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

	.is-hidden-local {
		display: none;
	}

	.patient-signin-message {
		display: none;
		margin: 0.2rem 0 0.95rem 0;
		padding: 0.65rem 0.8rem;
		border-radius: 8px;
		border: 1px solid transparent;
		font-size: 0.95rem;
		line-height: 1.45;
	}

	.patient-signin-message.is-visible {
		display: block;
	}

	.patient-signin-message.is-success {
		border-color: #5fa578;
		background: rgba(53, 113, 74, 0.3);
		color: #dff8e7;
	}

	.patient-signin-message.is-error {
		border-color: #c47b7b;
		background: rgba(128, 48, 48, 0.28);
		color: #ffe3e3;
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

	.patient-signin-form input[type="text"],
	.patient-signin-form input[type="email"],
	.patient-signin-form input[type="password"] {
		padding: 0.6rem 0.7rem;
		border: 1px solid #3e6b96;
		border-radius: 8px;
		font-size: 1rem;
		color: #e5edf7;
		background: #13253b;
	}

	.patient-signin-form input[type="text"]:focus,
	.patient-signin-form input[type="email"]:focus,
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

	.patient-signin-form button[disabled] {
		opacity: 0.7;
		cursor: wait;
	}

	.patient-signin-form button:hover {
		background: linear-gradient(135deg, #3278b1, #245d8f);
	}

	.signup-hint,
	.integration-note {
		margin-top: 0.9rem;
		font-size: 0.92rem;
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
		var signinPanel = document.getElementById('patient-signin-panel');
		var signupPanel = document.getElementById('patient-signup-panel');
		var showSignupLink = document.getElementById('patient-show-signup');
		var showSigninLink = document.getElementById('patient-show-signin');
		var form = document.getElementById('patient-signin-form');
		var signupForm = document.getElementById('patient-signup-form');
		var uidInput = document.getElementById('patient-uid');
		var passwordInput = document.getElementById('patient-password');
		var rememberInput = document.getElementById('patient-remember');
		var signupNameInput = document.getElementById('patient-signup-name');
		var signupUidInput = document.getElementById('patient-signup-uid');
		var signupEmailInput = document.getElementById('patient-signup-email');
		var signupPasswordInput = document.getElementById('patient-signup-password');
		var signupConfirmInput = document.getElementById('patient-signup-confirm');
		var message = document.getElementById('patient-signin-message');
		var submitButton = form ? form.querySelector('button[type="submit"]') : null;
		var signupButton = signupForm ? signupForm.querySelector('button[type="submit"]') : null;
		var redirectTarget = '{{ "/profile" | relative_url }}';

		if (!signinPanel || !signupPanel || !form || !signupForm || !uidInput || !passwordInput || !message || !submitButton || !signupButton) {
			return;
		}

		function getPythonURI() {
			if (window.pythonURI) {
				return window.pythonURI;
			}

			if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
				return 'http://localhost:8587';
			}

			return 'https://flask.opencodingsociety.com';
		}

		function getPythonURICandidates() {
			var primary = getPythonURI();
			var candidates = [primary];

			if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
				if (primary.indexOf('localhost:8587') !== -1) {
					candidates.push('http://127.0.0.1:8587');
				} else if (primary.indexOf('127.0.0.1:8587') !== -1) {
					candidates.push('http://localhost:8587');
				}
			}

			return candidates;
		}

		function isNetworkError(error) {
			return error instanceof TypeError || (error && typeof error.message === 'string' && error.message.toLowerCase().indexOf('fetch') !== -1);
		}

		async function fetchWithApiFallback(path, options) {
			var candidates = getPythonURICandidates();
			var lastError = null;

			for (var index = 0; index < candidates.length; index++) {
				var apiBase = candidates[index];
				try {
					var response = await fetch(apiBase + path, options);
					return {
						apiBase: apiBase,
						response: response
					};
				} catch (error) {
					lastError = error;
					if (!isNetworkError(error) || index === candidates.length - 1) {
						break;
					}
				}
			}

			throw lastError || new Error('Unable to reach the backend service.');
		}

		function setMessage(text, type) {
			message.textContent = text;
			message.className = 'patient-signin-message is-visible';
			if (type) {
				message.classList.add(type === 'success' ? 'is-success' : 'is-error');
			}
		}

		function clearMessage() {
			message.textContent = '';
			message.className = 'patient-signin-message';
		}

		function showSignIn(preserveMessage) {
			signinPanel.classList.remove('is-hidden-local');
			signupPanel.classList.add('is-hidden-local');
			if (!preserveMessage) {
				clearMessage();
			}
		}

		function showSignup(preserveMessage) {
			signupPanel.classList.remove('is-hidden-local');
			signinPanel.classList.add('is-hidden-local');
			if (!preserveMessage) {
				clearMessage();
			}
		}

		function setSigninSubmitting(isSubmitting) {
			submitButton.disabled = isSubmitting;
			submitButton.textContent = isSubmitting ? 'Signing In...' : 'Sign In';
			uidInput.disabled = isSubmitting;
			passwordInput.disabled = isSubmitting;
			rememberInput.disabled = isSubmitting;
		}

		function setSignupSubmitting(isSubmitting) {
			signupButton.disabled = isSubmitting;
			signupButton.textContent = isSubmitting ? 'Creating Account...' : 'Create Account';
			signupNameInput.disabled = isSubmitting;
			signupUidInput.disabled = isSubmitting;
			signupEmailInput.disabled = isSubmitting;
			signupPasswordInput.disabled = isSubmitting;
			signupConfirmInput.disabled = isSubmitting;
		}

		async function verifySession(apiBase) {
			var verifyResponse = await fetch(apiBase + '/api/id', {
				method: 'GET',
				mode: 'cors',
				cache: 'no-cache',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!verifyResponse.ok) {
				throw new Error('Sign-in completed, but the session could not be verified.');
			}

			return verifyResponse.json();
		}

		if (window.location.hash === '#create-account') {
			showSignup();
		} else {
			showSignIn();
		}

		if (showSignupLink) {
			showSignupLink.addEventListener('click', function (event) {
				event.preventDefault();
				showSignup();
			});
		}

		if (showSigninLink) {
			showSigninLink.addEventListener('click', function (event) {
				event.preventDefault();
				showSignIn();
			});
		}

		form.addEventListener('submit', async function (event) {
			event.preventDefault();
			clearMessage();
			setSigninSubmitting(true);

			var payload = {
				uid: uidInput.value.trim(),
				password: passwordInput.value
			};

			try {
				var authResult = await fetchWithApiFallback('/api/authenticate', {
					method: 'POST',
					mode: 'cors',
					cache: 'no-cache',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(payload)
				});
				var apiBase = authResult.apiBase;
				var response = authResult.response;

				var result = null;
				try {
					result = await response.json();
				} catch (parseError) {
					result = null;
				}

				if (!response.ok) {
					throw new Error((result && (result.message || result.error)) || 'Unable to sign in with those credentials.');
				}

				var sessionUser = await verifySession(apiBase);
				var displayName = (sessionUser && sessionUser.name) || (result && result.user && result.user.name) || payload.uid;
				setMessage('Signed in successfully. Redirecting ' + displayName + ' to the patient portal...', 'success');
				window.setTimeout(function () {
					window.location.assign(redirectTarget);
				}, 700);
			} catch (error) {
				if (isNetworkError(error)) {
					setMessage('Unable to reach the patient portal backend at localhost:8587 or 127.0.0.1:8587. Start the Flask backend and try again.', 'error');
				} else {
					setMessage(error.message || 'Unable to sign in right now. Please try again.', 'error');
				}
			} finally {
				setSigninSubmitting(false);
			}
		});

		signupForm.addEventListener('submit', async function (event) {
			event.preventDefault();
			clearMessage();

			var name = signupNameInput.value.trim();
			var uid = signupUidInput.value.trim();
			var email = signupEmailInput.value.trim();
			var password = signupPasswordInput.value;
			var confirmPassword = signupConfirmInput.value;

			if (password !== confirmPassword) {
				setMessage('Passwords do not match. Please re-enter them.', 'error');
				return;
			}

			if (password.length < 8) {
				setMessage('Password must be at least 8 characters long.', 'error');
				return;
			}

			setSignupSubmitting(true);

			try {
				var signupRequest = await fetchWithApiFallback('/api/user/guest', {
					method: 'POST',
					mode: 'cors',
					cache: 'no-cache',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						name: name,
						uid: uid,
						email: email,
						password: password
					})
				});
				var signupResponse = signupRequest.response;

				var signupResult = null;
				try {
					signupResult = await signupResponse.json();
				} catch (parseError) {
					signupResult = null;
				}

				if (!signupResponse.ok) {
					throw new Error((signupResult && (signupResult.message || signupResult.error)) || 'Unable to create the account right now.');
				}

				uidInput.value = uid;
				passwordInput.value = password;
				signupForm.reset();
				showSignIn(true);
				setMessage('Account created successfully. You can sign in now.', 'success');
			} catch (error) {
				if (isNetworkError(error)) {
					setMessage('Unable to reach the patient portal backend at localhost:8587 or 127.0.0.1:8587. Start the Flask backend and try again.', 'error');
				} else {
					setMessage(error.message || 'Unable to create the account right now.', 'error');
				}
			} finally {
				setSignupSubmitting(false);
			}
		});
	})();
</script>