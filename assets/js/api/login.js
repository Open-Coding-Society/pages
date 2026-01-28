import { baseurl, pythonURI, fetchOptions } from './config.js';

console.log("login.js loaded");

document.addEventListener('DOMContentLoaded', function () {
    console.log("Base URL:", baseurl); // Debugging line
    waitForElement('#loginArea', 20, 100).then(loginArea => {
        getCredentials(baseurl)
            .then(data => {
                console.log("Credentials data:", data); // Debugging line
                window.user = data;
                if (data) { // Update the login area based on the data
                    loginArea.innerHTML = `
                        <div class="dropdown">
                            <button class="dropbtn page-link" style="border:none; background:none; cursor:pointer; color:inherit; font-size:inherit; font-family:inherit; padding:0;">${data.name}</button>
                            <div class="dropdown-content hidden">
                                ${data.roles && Array.isArray(data.roles) && data.roles.length > 0
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

                    if (dropdownButton && dropdownContent) {
                        dropdownButton.addEventListener('click', (event) => {
                            event.preventDefault(); // Prevent redirection
                            dropdownContent.classList.toggle('hidden');
                        });

                        // Prevent multiple listeners by using a flag
                        if (!window._loginDropdownListener) {
                            document.addEventListener('click', (event) => {
                                if (!dropdownButton.contains(event.target) && !dropdownContent.contains(event.target)) {
                                    dropdownContent.classList.add('hidden'); // Hide dropdown
                                }
                            });
                            window._loginDropdownListener = true;
                        }
                    }

                    // Update navigation AFTER dropdown is set up
                    waitForElement('.trigger', 20, 100).then(() => {
                        updateNavigation(true); // User is logged in
                    });
                } else {
                    // User is not authenticated, then "Login" link is shown
                    loginArea.innerHTML = `<a href="${baseurl}/login">Login</a>`;
                    waitForElement('.trigger', 20, 100).then(() => {
                        updateNavigation(false); // User is not logged in
                    });
                }
                // Set loginArea opacity to 1
                loginArea.style.opacity = "1";
            })
            .catch(err => {
                console.error("Error fetching credentials: ", err);
                // Show login link on error
                if (loginArea) {
                    loginArea.innerHTML = `<a href="${baseurl}/login">Login</a>`;
                }
                waitForElement('.trigger', 20, 100).then(() => {
                    updateNavigation(false); // Also update nav on error
                });
            });
    });
});

// Wait for an element to exist in the DOM, retrying up to maxAttempts (delay between attempts)
function waitForElement(selector, maxAttempts = 20, interval = 100) {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        function check() {
            const el = document.querySelector(selector);
            if (el) {
                resolve(el);
            } else if (++attempts < maxAttempts) {
                setTimeout(check, interval);
            } else {
                reject(new Error('Element not found: ' + selector));
            }
        }
        check();
    });
}

function getCredentials(baseurl) {
    const URL = pythonURI + '/api/id';
    return fetch(URL, fetchOptions)
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

// Update navigation based on login status and courses
async function updateNavigation(isLoggedIn) {
    const trigger = document.querySelector('.trigger');
    if (!trigger) {
        console.error("Navigation trigger not found!");
        return;
    }

    // Find all page links in navigation
    const links = trigger.querySelectorAll('.page-link');
    console.log("Found links:", links.length);
    
    if (!isLoggedIn) {
        // Not logged in: show "Blogs"
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && (href.includes('/navigation/blogs') || href.includes('/navigation/courses'))) {
                link.setAttribute('href', `${baseurl}/navigation/blogs/`);
                link.textContent = 'Blogs';
                console.log("Updated link to Blogs");
            }
        });
        return;
    }

    // Logged in: fetch user's courses
    console.log("User logged in, fetching courses...");
    try {
        const response = await fetch(`${pythonURI}/api/user/class`, fetchOptions ); 

        if (!response.ok) {
            console.warn("Course fetch failed:", response.status);
            // Error fetching courses, default to Courses page
            updateNavLink(links, `${baseurl}/navigation/courses/`, 'Courses');
            return;
        }

        const data = await response.json();
        console.log("Course data:", data);
        const classes = data.class || [];
        console.log("User classes:", classes);

        const courseMap = {
            'CSSE': { name: 'CSSE', url: `${baseurl}/navigation/courses/csse` },
            'CSP': { name: 'APCSP', url: `${baseurl}/navigation/courses/csp` },
            'CSA': { name: 'APCSA', url: `${baseurl}/navigation/courses/csa` }
        };

        // Filter to valid courses only
        const userCourses = classes
            .filter(cls => courseMap[cls])
            .map(cls => courseMap[cls]);
        
        console.log("Valid user courses:", userCourses);

        if (userCourses.length === 0) {
            // No courses: link to Courses page with message
            console.log("No courses, linking to Courses page");
            updateNavLink(links, `${baseurl}/navigation/courses/`, 'Courses');
        } else if (userCourses.length === 1) {
            // One course: direct link to that course
            const course = userCourses[0];
            console.log("One course, direct link to:", course.name);
            updateNavLink(links, course.url, course.name);
        } else {
            // Multiple courses: link to Courses page with table
            console.log("Multiple courses, linking to Courses page");
            updateNavLink(links, `${baseurl}/navigation/courses/`, 'Courses');
        }

    } catch (error) {
        console.error('Error fetching courses for nav:', error);
        // On error, default to Courses page
        updateNavLink(links, `${baseurl}/navigation/courses/`, 'Courses');
    }
}

// Helper function to update a single nav link
function updateNavLink(links, url, text) {
    console.log("Updating nav link to:", text, url);
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href.includes('/navigation/blog') || href.includes('/navigation/courses'))) {
            link.setAttribute('href', url);
            link.textContent = text;
            console.log("Link updated successfully");
        }
    });
}