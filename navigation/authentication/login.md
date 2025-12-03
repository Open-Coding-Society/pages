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
                 data-client_id="65827797404-ccjleg7jg4g2an8ddpmhnlca4ii2gk8q.apps.googleusercontent.com"
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
    import { login, pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

    let signupFormData = {};
    let verifiedSchoolEmail = null;
    let validationTimeout = null;
    const GOOGLE_CLIENT_ID = "65827797404-ccjleg7jg4g2an8ddpmhnlca4ii2gk8q.apps.googleusercontent.com";

    // Password validation with debouncing (1.5 second delay)
    function validatePasswordsDebounced() {
        // Clear existing timeout
        if (validationTimeout) {
            clearTimeout(validationTimeout);
        }

        // Set new timeout for 1.5 seconds
        validationTimeout = setTimeout(() => {
            validatePasswords();
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

        // Store form data
        signupFormData = {
            name: document.getElementById("name").value,
            uid: document.getElementById("signupUid").value,
            sid: document.getElementById("signupSid").value,
            school: document.getElementById("signupSchool").value,
            email: document.getElementById("signupEmail").value,
            password: document.getElementById("signupPassword").value,
            kasm_server_needed: document.getElementById("kasmNeeded").checked,
        };

        // Show OAuth verification
        showOAuthVerification();
    }

    function showOAuthVerification() {
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

    window.handleGoogleSignIn = function(response) {
        try {
            const userInfo = parseJwt(response.credential);
            const email = userInfo.email;
            if (!email.endsWith('@stu.powayusd.com') && !email.endsWith('@powayusd.com')) {
                showOAuthStatus('❌ You must use your school email address ending with @stu.powayusd.com or @powayusd.com', true);
                return;
            }
            verifiedSchoolEmail = email;
            showOAuthStatus(`✅ School email verified: ${email}`);

            setTimeout(() => {
                document.getElementById('oauth-verification').style.display = 'none';
                document.getElementById('signupForm').style.display = 'block';

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

    // Function to handle both Python and Java login simultaneously
    window.loginBoth = function () {
    javaLogin();  // Call Java login
    pythonLogin();
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
                throw new Error("Invalid login");
            }
            return response.json();
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
            // If login fails, attempt account creation
            if (error.message === "Invalid login") {
                // alert("Login for Spring failed. Creating a new Java account...");
                const signupData = JSON.stringify({
                    uid: document.getElementById("uid").value,
                    sid: "0000000",
                    email: document.getElementById("uid").value + "@gmail.com",
                    dob: "11-01-2024", // Static date, can be modified
                    name: document.getElementById("uid").value,
                    password: document.getElementById("password").value,
                    kasmServerNeeded: false,
                });
                const signupOptions = {
                    ...fetchOptions,
                    method: "POST",
                    body: signupData,
                };
                fetch(signupURL, signupOptions)
                    .then(signupResponse => {
                        if (!signupResponse.ok) {
                            throw new Error("Account creation failed!");
                        }
                        return signupResponse.json();
                    })
                    .then(signupResult => {
                        console.log("Account creation successful!", signupResult);
                        // alert("Account Creation Successful. Logging you into Flask/Spring!");
                        // Retry login after account creation
                        return fetch(loginURL, loginOptions);
                    })
                    .then(newLoginResponse => {
                        if (!newLoginResponse.ok) {
                            throw new Error("Login failed after account creation");
                        }
                        console.log("Login successful after account creation!");
                        // Fetch database after successful login
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
                    .catch(newLoginError => {
                        console.error("Error after account creation:", newLoginError.message);
                    });
            } else {
                console.log("Logged in!");
            }
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
                    throw new Error(`Spring server response: ${response.status}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error("Java Database Error:", error);
            });
    }
</script>
