---
layout: page
title: Toolkits
permalink: /toolkit-login
search_exclude: true
---

{% include nav/homejava.html %}

<style>
    .submit-button {
        width: 100%;
        padding: 1rem;
        color: black;
        border: none;
        border-radius: 10px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        padding: 1rem;
    }

    .login-container {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
    }

    .login-card {
        margin-top: 0;
        /* remove the top margin */
        width: 45%;
        border: 1px solid rgba(255, 255, 255, 0.5);
        border-radius: 10px;
        padding: 20px;
        box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
        margin-bottom: 20px;
        overflow-x: auto;
        /* Enable horizontal scrolling */
    }

    .login-card h1 {
        margin-bottom: 20px;
    }

    .signup-card {
        margin-top: 0;
        /* remove the top margin */
        width: 45%;
        border: 1px solid rgba(255, 255, 255, 0.5);
        border-radius: 10px;
        padding: 20px;
        box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
        margin-bottom: 20px;
        overflow-x: auto;
        /* Enable horizontal scrolling */
    }

    .signup-card h1 {
        margin-bottom: 20px;
    }

    .form-group {
        position: relative;
        margin-bottom: 1.5rem;
    }

    .form-group ion-icon {
        position: absolute;
        top: 50%;
        left: 10px;
        /* Adjust based on desired spacing */
        transform: translateY(-50%);
        font-size: 1.5rem;
        /* Adjust the size of the icon */
        color: rgba(255, 255, 255, 0.4);
        pointer-events: none;
        /* Ensure the icon does not interfere with input focus */
    }

    .form-input {
        width: 100%;
        padding: 1rem 1rem 1rem 3rem;
        /* Add left padding to make room for the icon */
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        font-size: 1rem;
        color: white;
        transition: all 0.3s ease;
    }

    .form-input::placeholder {
        color: rgba(255, 255, 255, 0.4);
    }

    .form-input:focus {
        outline: none;
        border-color: rgba(255, 255, 255, 0.3);
        background: rgba(255, 255, 255, 0.1);
        box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.05);
    }

    .form-input:-webkit-autofill,
    .form-input:-webkit-autofill:hover,
    .form-input:-webkit-autofill:focus,
    .form-input:-webkit-autofill:active {
        -webkit-background-clip: text;
        -webkit-text-fill-color: #ffffff;
        transition: background-color 5000s ease-in-out 0s;
        box-shadow: inset 0 0 20px 20px #23232329;

    }

    .glowOnHover {
        //this makes it actually glow
        border: none;
        outline: none;
        color: #fff;
        background: #1e1e1e;
        cursor: pointer;
        position: relative;
        z-index: 0;
        border-radius: 10px;
    }

    .glowOnHover:before {
        content: '';
        background: linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000);
        position: absolute;
        top: -2px;
        left: -2px;
        background-size: 400%;
        z-index: -1;
        filter: blur(5px);
        width: calc(100% + 4px);
        height: calc(100% + 4px);
        animation: glowing 20s linear infinite;
        opacity: 0;
        transition: opacity .3s ease-in-out;
        border-radius: 10px;
    }

    .glowOnHover:hover:before {
        opacity: 1;
    }

    .glowOnHover:after {
        z-index: -1;
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        background: #1e1e1e;
        left: 0;
        top: 0;
        border-radius: 10px;
    }

    @keyframes glowing {
        0% {
            background-position: 0 0;
        }

        50% {
            background-position: 400% 0;
        }

        100% {
            background-position: 0 0;
        }
    }

    table {
        width: 100%;
        margin-top: 20px;
        border-collapse: collapse;
    }

    table,
    th,
    td {
        border: 1px solid #ddd;
    }

    th,
    td {
        padding: 10px;
        text-align: left;
    }

    .message {
        color: red;
        margin-top: 10px;
    }

    .details-button {
        display: block;
        margin-top: 20px;
        padding: 10px;
        text-align: center;
        background-color: #28a745;
        color: white;
        text-decoration: none;
        border-radius: 5px;
    }

    .details-button:hover {
        background-color: #218838;
    }
</style>

<div class="login-container">
    <div class="login-card">
        <h1>User Login (Java)</h1>
        <form id="javaForm" onsubmit="javaLogin(); return false;">
            <!-- UID -->
            <div class="form-group">
                <input type="text" class="form-input" id="uid" placeholder="UID" required>
                <ion-icon name="id-card-outline"></ion-icon>
            </div>
            <!-- Password -->
            <div class="form-group">
                <ion-icon name="lock-closed-outline"></ion-icon>
                <input type="password" class="form-input" id="password" placeholder="Password" required>
            </div>
            <!-- login button -->
            <p>
                <button type="submit" class="glowOnHover submit-button">Login</button>
            </p>
            <p id="java-message" class="message"></p>
        </form>
        <!-- Data Table -->
        <table id="javaTable" style="display: none;">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Github Id</th>
                    <th>Email</th>
                    <th>Age</th>
                    <th>Roles</th>
                </tr>
            </thead>
            <tbody id="javaResult">
                <!-- JavaScript-generated data -->
            </tbody>
        </table>
        <a href="{{ site.baseurl }}/javaUI" id="javaButton" class="details-button" style="display: none;">Java
            Details</a>
    </div>
</div>
<script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
<script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
<script type="module">
    import { login, javaURI, fetchOptions } from '{{ site.baseurl }}/assets/js/api/config.js';

    // Function to handle Java login
    window.javaLogin = function () {
        const options = {
            URL: `${javaURI}/authenticate`,
            callback: javaDatabase,
            message: "java-message",
            method: "POST",
            cache: "no-cache",
            body: {
                uid: document.getElementById("uid").value,
                password: document.getElementById("password").value,
            },
        };
        login(options);
    };

    // Function to fetch and display Java data
    function javaDatabase() {
        const URL = `${javaURI}/api/person/get`;
        const loginForm = document.getElementById('javaForm');
        const dataTable = document.getElementById('javaTable');
        const dataButton = document.getElementById('javaButton');
        const resultContainer = document.getElementById("javaResult");
        resultContainer.innerHTML = '';

        fetch(URL, fetchOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Spring server response: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Check if email ends with "@gmail.com" and prompt user to update profile
                if (data.email === `${data.uid}@gmail.com`) {
                    alert('You need to update your name and email in the profile page to complete account setup.');
                }

                loginForm.style.display = 'none';
                dataTable.style.display = 'block';
                dataButton.style.display = 'block';

                const tr = document.createElement("tr");
                const name = document.createElement("td");
                const ghid = document.createElement("td");
                const id = document.createElement("td");
                const age = document.createElement("td");
                const roles = document.createElement("td");

                name.textContent = data.name;
                ghid.textContent = data.uid;
                //store ghid in localStorage
                localStorage.setItem("ghid", data.uid);
                id.textContent = data.email;
                age.textContent = data.age;
                roles.textContent = data.roles.map(role => role.name).join(', ');

                tr.appendChild(name);
                tr.appendChild(ghid);
                tr.appendChild(id);
                tr.appendChild(age);
                tr.appendChild(roles);
                resultContainer.appendChild(tr);

                // Redirect to the student calendar after successful data fetch
                sessionStorage.setItem("loggedIn", "true");
                setTimeout(() => {
                    window.location.href = "{{ site.baseurl }}/profile";
                }, 5000);
            })
            .catch(error => {
                console.error("Java Database Error:", error);
                const errorMsg = `Java Database Error: ${error.message}`;
                const tr = document.createElement("tr");
                const td = document.createElement("td");
                td.textContent = errorMsg;
                td.colSpan = 4;
                tr.appendChild(td);
                resultContainer.appendChild(tr);
            });
    }

    window.onload = function () {
        javaDatabase();
    };
</script>

