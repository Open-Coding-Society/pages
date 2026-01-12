---
layout: page
title: Login (DEBUG)
permalink: /loginDebugJava
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
</div>



<script type="module">
    import { login, pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';
    
    function parseJwt(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }
    
    
    // Function to handle both Python and Java login simultaneously
    window.loginBoth = function () {
        javaLogin();  // Call Java login
    };

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
