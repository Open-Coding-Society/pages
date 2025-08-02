import { baseurl, pythonURI, fetchOptions } from './config.js';

console.log("login.js loaded");

document.addEventListener('DOMContentLoaded', function() {
    console.log("Base URL:", baseurl); // Debugging line
    getCredentials(baseurl) // Call the function to get credentials
        .then(data => {
            console.log("Credentials data:", data); // Debugging line
            window.user = data;
            const loginArea = document.getElementById('loginArea');
            if (data) { // Update the login area based on the data
                loginArea.innerHTML = `
                    <div class="dropdown">
                        <button class="dropbtn">${data.name}</button>
                        <div class="dropdown-content hidden">
                            ${
                                data.roles && Array.isArray(data.roles) && data.roles.length > 0
                                    ? `<div class="roles-list" style="padding: 8px 16px; color: #888; font-size: 0.95em;">
                                        Roles: ${data.roles.map(role => role.name).join(", ")}
                                       </div>
                                       <hr style="margin: 4px 0;">`
                                    : ''
                            }
                            <a href="${baseurl}/profile">Profile</a>
                            <a href="${baseurl}/logout">Logout</a>
                        </div>
                    </div>
                `;

                // Add click event listener for dropdown toggle
                const dropdownButton = loginArea.querySelector('.dropbtn');
                const dropdownContent = loginArea.querySelector('.dropdown-content');

                dropdownButton.addEventListener('click', (event) => {
                    event.preventDefault(); // Prevent redirection
                    if (dropdownContent.classList.contains('hidden')) {
                        dropdownContent.classList.remove('hidden');
                    } else {
                        dropdownContent.classList.add('hidden');
                    }
                });

                // Add event listener to hide dropdown when clicking outside
                document.addEventListener('click', (event) => {
                    if (!dropdownButton.contains(event.target) && !dropdownContent.contains(event.target)) {
                        dropdownContent.classList.add('hidden'); // Hide dropdown
                    }
                });
            } else {
                // User is not authenticated, then "Login" link is shown
                loginArea.innerHTML = `<a href="${baseurl}/login">Login</a>`;
            }
            // Set loginArea opacity to 1
            loginArea.style.opacity = "1";
        })
        .catch(err => {
            console.error("Error fetching credentials: ", err);
            // Show login link on error
            const loginArea = document.getElementById('loginArea');
            if (loginArea) {
                loginArea.innerHTML = `<a href="${baseurl}/login">Login</a>`;
            }
        });
});

function getCredentials(baseurl) {
    const URL = pythonURI + '/api/id';
    return fetch(URL, {
        ...fetchOptions,
        credentials: 'include' // Add this to include cookies
    })
    .then(response => {
        if (!response.ok) {
            console.warn("HTTP status code: " + response.status);
            return null;
        }
        return response.json();
    })
    .then(data => {
        if (data === null) return null;
        console.log("User data:", data);
        return data;
    })
    .catch(err => {
        console.error("Fetch error: ", err);
        // Return null instead of throwing to handle the error gracefully
        return null;
    });
}
