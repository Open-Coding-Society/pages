---
layout: page
title: Login
permalink: /guestlogin
search_exclude: true
show_reading_time: false
---
<br>

<div class="login-container">
    <!-- Python Login Form -->
    <div class="login-card">
        <h1 id="pythonTitle">User Login</h1>
        <hr>
        <form id="pythonForm" onsubmit="loginBoth(); return false;">
            <div class="form-group">
                <input type="text" id="uid" placeholder="Username" required>
            </div>
            <div class="form-group">
                <input type="password" id="password" placeholder="Password" required>
            </div>
            <p>
                <button type="submit" class="large primary submit-button">Login</button>
            </p>
            <p id="message" style="color: red;"></p>
        </form>
    </div>
    <div class="signup-card">
        <h1 id="signupTitle">Sign Up</h1>
        <hr>
        <!-- Signup Form (simplified: username + password) -->
        <form id="signupForm" onsubmit="handleSignupSubmit(event);">
            <!-- name removed to keep signup minimal: only username + password -->
            <div class="form-group">
                <input type="text" id="signupUsername" placeholder="Username" required>
            </div>
            <div class="form-group">
                <input type="password" id="signupPassword" placeholder="Password" required>
            </div>
            <!-- Confirm Password Field -->
            <div class="form-group">
                <input type="password" id="confirmPassword" placeholder="Confirm Password" required>
                <div id="password-validation-message" class="validation-message"></div>
            </div>
            <!-- Kasm option removed: not required for simplified signup -->
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
    import { login, pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

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

        if (password.length < 2) {
            confirmField.classList.add('password-length');
            messageDiv.classList.add('error');
            messageDiv.textContent = '✗ Passwords must be at least 2 characters long';
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

        if (password.length < 2) {
            alert('Password must be at least 2 characters long.');
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
        element.classList.remove('pending', 'success', 'error', 'disabled');

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
            case 'disabled':
                element.classList.add('disabled');
                icon.textContent = '⊘';
                text.textContent = `${backend.charAt(0).toUpperCase() + backend.slice(1)} (Disabled)`;
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
        const springDisabled = springEl.classList.contains('disabled');

        overallEl.classList.remove('hidden', 'success', 'partial', 'error');

        // If Spring is disabled (guest mode)
        if (springDisabled) {
            if (flaskSuccess) {
                overallEl.classList.add('success');
                overallEl.textContent = '🎉 Guest account created successfully! You can now login.';
            } else if (flaskError) {
                overallEl.classList.add('error');
                overallEl.textContent = '❌ Account creation failed. Please check your information and try again.';
            }
        } else {
            // Regular mode with both backends
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

        // Store form data (only username and password)
        signupFormData = {
            uid: document.getElementById("signupUsername").value,
            password: document.getElementById("signupPassword").value,
        };

        // Call signup flow
        signup();
    }

    // Initialize password validation when page loads
    window.addEventListener('load', function() {
        const passwordField = document.getElementById('signupPassword');
        const confirmPasswordField = document.getElementById('confirmPassword');

        if (passwordField && confirmPasswordField) {
            // Add debounced validation listeners
            passwordField.addEventListener('input', validatePasswordsDebounced);
            confirmPasswordField.addEventListener('input', validatePasswordsDebounced);
        }
    });

    // Function to handle both Python and Java login simultaneously
    window.loginBoth = function () {
    pythonLogin();
    javaLogin();  // Call Java login
};
    // Function to handle Python login
    window.pythonLogin = function () {
        const options = {
            URL: `${pythonURI}/api/authenticate`,
            callback: pythonDatabase,
            message: "message",
            method: "POST",
            cache: "no-cache",
            body: {
                uid: document.getElementById("uid").value,
                password: document.getElementById("password").value,
            }
        };
        login(options);
    }
    // Function to handle Java login
    window.javaLogin = function () {
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
            window.location.href = '{{site.baseurl}}/profile';
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
        })
        .catch(error => {
            console.error("Login failed:", error.message);
            // Spring login is optional for guest flow; avoid auto-create fallback.
            console.warn("Spring login unavailable; continuing with Flask auth flow.");
        });
};
    // Function to fetch and display Python data
    function pythonDatabase() {
        const URL = `${pythonURI}/api/id`;
        fetch(URL, fetchOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Flask server response: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                window.location.href = '{{site.baseurl}}/profile';
            })
            .catch(error => {
                document.getElementById("message").textContent = `Error: ${error.message}`;
            });
    }  
    window.signup = async function () {
        const signupButton = document.querySelector(".signup-card button");
        // Disable the button and change its color
        signupButton.disabled = true;
        signupButton.classList.add("disabled");
        // Reset status indicators
        updateBackendStatus('flask', 'pending');
        // Mark Spring as disabled for guest accounts
        updateBackendStatus('spring', 'disabled');
        document.getElementById('overallStatus').classList.add('hidden');

        const data = signupFormData && Object.keys(signupFormData).length > 0 ? signupFormData : {
            uid: document.getElementById("signupUsername").value,
            password: document.getElementById("signupPassword").value,
        };

        console.log("Sending this data to Flask (Guest):", JSON.stringify(data, null, 2));
        console.log("Request URL:", `${pythonURI}/api/user/guest`);

        const flaskRequest = {
            ...fetchOptions,
            method: "POST",
            body: JSON.stringify(data)
        };

        try {
            // Flask Backend Request - GUEST endpoint (blocking)
            const response = await fetch(`${pythonURI}/api/user/guest`, flaskRequest);
            const raw = await response.text();

            if (!response.ok) {
                console.log("Flask error details:", raw);
                throw new Error(`Flask: ${response.status} - ${raw}`);
            }

            updateBackendStatus('flask', 'success');
            try {
                const parsed = raw ? JSON.parse(raw) : {};
                console.log("Flask result:", parsed);
            } catch (_) {
                console.log("Flask result (non-JSON):", raw);
            }
        } catch (error) {
            console.error("Flask signup error:", error);
            updateBackendStatus('flask', 'error');
        } finally {
            // Spring is intentionally disabled in guest mode; reflect final overall state.
            setTimeout(updateOverallStatus, 500);
            signupButton.disabled = false;
            signupButton.classList.remove("disabled");
        }
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
