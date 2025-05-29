---
layout: base
title: Login
permalink: /duallogin
search_exclude: true
---

{% include nav/home.html %}

<style>
.login-container {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap; /* allows the cards to wrap onto the next line if the screen is too small */
}

.login-card {
    margin-top: 0; /* remove the top margin */
    width: 45%;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 20px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
    margin-bottom: 20px;
    overflow-x: auto; /* Enable horizontal scrolling */
}

.login-card h1 {
    margin-bottom: 20px;
}

.login-card table {
    width: 100%;
    margin-top: 20px;
}

.details-button {
    display: block;
    width: 100%;
    padding: 10px;
    margin-top: 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    text-align: center; /* center the text */
}

.details-button:hover {
    background-color: #0056b3;
}
</style>

<div class="login-container">
    <!-- Java Login Form -->
    <div class="login-card">
        <h1 id="javaTitle"> User Login (Java)</h1>
        <form id="javaForm" onsubmit="javaLogin(); return false;">
            <p>
                <label>
                    User ID:
                    <input type="text" name="uid" id="uid" required>
                </label>
            </p>
            <p>
                <label>
                    Password:
                    <input type="password" name="password" id="password" required>
                </label>
            </p>
            <p>
                <button type="submit">Login</button>
            </p>
            <p id="java-message" style="color: red;"></p>
        </form>
        <!-- Data Table Layout -->
        <table id="javaTable">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>ID</th>
                    <th>Age</th>
                    <th>Roles</th>
                </tr>
            </thead>
            <tbody id="javaResult">
                <!-- javascript generated data -->
            </tbody>
        </table>
        <a href="{{ site.baseurl }}/javaUI" id="javaButton" class="details-button">Java Details</a>
    </div>
    <!-- Python Login Form -->
    <div class="login-card">
        <h1 id="pythonTitle">User Login (Python)</h1>
        <form id="pythonForm" onsubmit="pythonLogin(); return false;">
            <p>
                <label>
                    User ID:
                    <input type="text" name="python-uid" id="python-uid" required>
                </label>
            </p>
            <p>
                <label>
                    Password:
                    <input type="password" name="python-password" id="python-password" required>
                </label>
            </p>
            <p>
                <button type="submit">Login</button>
            </p>
            <p id="python-message" style="color: red;"></p>
        </form>
        <table id="pythonTable">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>UID</th>
                    <th>Role</th>
                    <th>KASM Server</th>
                    <th>Classes</th>
                </tr>
            </thead>
            <tbody id="pythonResult">
                <!-- javascript generated data -->
            </tbody>
        </table>
        <a href="{{ site.baseurl }}/profile" id="pythonButton" class="details-button">User Profile</a>
    </div>
</div>

<script type="module">
    import { login, javaURI, pythonURI, fetchOptions } from '{{ site.baseurl }}/assets/js/api/config.js';

    // Function to handle Java login
    window.javaLogin = function() {
        const options = {
            URL: `${javaURI}/authenticate`,
            callback: javaDatabase,
            message: "java-message",
            method: "POST",
            cache: "no-cache",
            body: {
                uid: document.getElementById("uid").value,
                password: document.getElementById("password").value,
            }
        };
        login(options);
    }

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
                loginForm.style.display = 'none';
                dataTable.style.display = 'block';
                dataButton.style.display = 'block';

                const tr = document.createElement("tr");
                const name = document.createElement("td");
                const id = document.createElement("td");
                const age = document.createElement("td");
                const roles = document.createElement("td");

                // stuff for bathroom pass
                localStorage.setItem("name", data.name);

                name.textContent = data.name;
                id.textContent = data.email;
                age.textContent = data.age;
                roles.textContent = data.roles.map(role => role.name).join(', ');
                tr.appendChild(name);
                tr.appendChild(id);
                tr.appendChild(age);
                tr.appendChild(roles);
                resultContainer.appendChild(tr);
            })
            .catch(error => {
                console.error("Java Database Error:", error);
                const errorMsg = `Java Database Error: ${error.message}`;
                const tr = document.createElement("tr");
                const td = document.createElement("td");
                td.textContent = errorMsg;
                tr.appendChild(td);
                resultContainer.appendChild(tr);
            });
    }

    // Function to handle Python login
    window.pythonLogin = function() {
        const options = {
            URL: `${pythonURI}/api/authenticate`,
            callback: pythonDatabase,
            message: "python-message",
            method: "POST",
            cache: "no-cache",
            body: {
                uid: document.getElementById("python-uid").value,
                password: document.getElementById("python-password").value,
            }
        };
        login(options);
    }

    // Function to fetch and display Python data
    function pythonDatabase() {
        const URL = `${pythonURI}/api/id`;
        const loginForm = document.getElementById('pythonForm');
        const dataTable = document.getElementById('pythonTable');
        const dataButton = document.getElementById('pythonButton');
        const resultContainer = document.getElementById("pythonResult");
        resultContainer.innerHTML = '';

        fetch(URL, fetchOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Flask server response: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                loginForm.style.display = 'none';
                dataTable.style.display = 'block';
                dataButton.style.display = 'block';

                const tr = document.createElement("tr");
                const id = document.createElement("td");
                const name = document.createElement("td");
                const uid = document.createElement("td");
                const role = document.createElement("td");
                const profile = document.createElement("td");
                const kasm = document.createElement("td");
                const classes = document.createElement("td");

                id.textContent = data.id;
                name.textContent = data.name;
                uid.textContent = data.uid;
                role.textContent = data.role;
                kasm.textContent = data.kasm_server_needed;

                if (Array.isArray(data.sections)) {
                    classes.innerHTML = data.sections.map(section => `${section.abbreviation} - ${section.name}`).join('<br>');
                } else {
                    classes.textContent = '';
                }

                tr.appendChild(id);
                tr.appendChild(name);
                tr.appendChild(uid);
                tr.appendChild(role);
                tr.appendChild(kasm);
                tr.appendChild(classes);
                resultContainer.appendChild(tr);
                //window.location.reload();
            })
            .catch(error => {
                loginForm.style.display = 'block';
                dataTable.style.display = 'none';
                dataButton.style.display = 'none';
                console.error("Python Database Error:", error);
                const errorMsg = `Python Database Error: ${error.message}`;
                const tr = document.createElement("tr");
                const td = document.createElement("td");
                td.textContent = errorMsg;
                tr.appendChild(td);
                resultContainer.appendChild(tr);
            });
    }

    // Call relevant database functions on page load
    window.onload = function() {
        javaDatabase();
        pythonDatabase();
    };
</script>
