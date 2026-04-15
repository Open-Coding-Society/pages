---
Title: Safe Passage Heals Dynamic Event Calendar System Technical Doc
description: Use this document as reference for how to operate the software system and for troubleshooting
permalink: /sph/readme/
---

# System Operation Procedure
Prerequisites

Backend service must be running and reachable at the URL in login-sph.BASE.
Browser must allow cookies for the backend origin (credentials: 'include' is used).
TLS or correct host mapping if not using localhost.
Start / Verify Backend

Ensure the backend process is started and listening on port configured in login-sph.BASE. Example to test reachability:
sh
curl -i -c cookie.txt http://localhost:8421/api/id
Login flow (what the page does)

User fills Username and Password on the Login tab.
login-sph.handleLogin sends POST /api/authenticate with JSON { uid, password } and credentials included.
On success the page redirects to /events/calendar/.
On failure the UI shows an error via login-sph.showMsg.
Signup flow

User fills required fields on the Sign Up tab.
login-sph.handleSignup posts to /api/user. Email vs phone is determined with a simple isEmail check.
On success a success message displays and the UI switches to the Login tab via login-sph.switchTab.
Session & Logout

On page load a GET to /api/id checks for an active session; if present, login-sph.showLoggedIn renders the logged-in panel.
Logout calls DELETE /api/authenticate in login-sph.logout and resets UI.
# Troubleshooting Guide
Symptoms -> Likely cause -> Steps to resolve

1. "Could not reach the server. Is it running?" shown on actions
Cause: Frontend cannot connect to the backend at login-sph.BASE.
Fix:
Verify backend process is running and listening on the configured host/port.
Use curl to confirm:
sh
curl -v http://localhost:8421/api/id
 - If backend uses HTTPS or a different host/port, update [login-sph.BASE](http://_vscodecontentref_/19).

2. Authentication always fails (401)
Cause: Wrong credentials or backend authentication logic rejects requests.
Fix:
Verify the credentials are correct.
Check backend logs for the authentication error.
Confirm the POST body matches expected fields: uid and password.
Ensure server sets session cookie and responds with Set-Cookie; browser must accept it.

3. Session not persisted across requests
Cause: Cookies not sent/accepted or CORS misconfiguration.
Fix:
Ensure backend sets cookies with proper SameSite and Secure attributes for your environment.
Confirm backend allows credentials (CORS Access-Control-Allow-Credentials: true) and lists origin.
Test with curl using cookie jar:

4. Redirects not happening after login
Cause: The frontend redirects to /events/calendar/ only when response is OK.
Fix:
Inspect response body from POST /api/authenticate — ensure server returns 2xx on success.
Check for JavaScript errors in browser console that may interrupt the redirect.

5. Signup fails with "Sign up failed." or server message

Cause: Validation errors, duplicate username, missing fields, or admin secret incorrect.
Fix:
Inspect error message returned by the backend (shown in UI when provided).
Ensure email/phone fields are set correctly; the frontend sends either email or phone depending on isEmail.
Check backend logs for validation errors.

6. UI not updating (tabs, messages, logged-in panel)

Cause: JS errors or element IDs changed.
Fix:
Open browser console, check for uncaught exceptions.
Verify required element IDs still match what code expects (loginBtn, signupBtn, loginMsg, signupMsg, authForms, loggedIn, userInfoBox).
See functions: login-sph.switchTab, login-sph.showMsg, login-sph.clearMsg.

7. CORS / preflight errors

Cause: Backend not configured for cross-origin requests with credentials.
Fix:
Ensure Access-Control-Allow-Origin is not "*" when using credentials. Use explicit origin and include Access-Control-Allow-Credentials: true.
Allow required headers: Content-Type, and methods: GET, POST, DELETE.
Debugging tips

Use browser DevTools > Network to inspect requests/responses and cookies.
Inspect console for runtime JS errors.
Check backend logs for the request path and returned status/body.
Reproduce via curl to isolate frontend vs backend issues.