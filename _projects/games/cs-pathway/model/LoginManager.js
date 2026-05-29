/**
 * LoginManager - MODEL Layer
 *
 * Handles all authentication API calls (login, signup, status check)
 * and renders the built-in auth flow panel used by game levels.
 *
 * Designed for separation of concerns:
 *   - API logic lives here, not in game level controllers
 *   - All public methods return { success, code, body } JSON
 *   - UI (showPanel) accepts a theme object so it stays game-neutral
 *   - Long-term home: /assets/js/api/ (not cs-pathway specific)
 *
 * API endpoints used:
 *   POST /api/authenticate  - Login (Flask)
 *   POST /api/user          - Signup (Flask)
 *   POST /api/person/create - Signup (Spring, non-blocking)
 *   GET  /api/id            - Auth status check
 */

import { pythonURI, javaURI, fetchOptions, baseurl } from '@assets/js/api/config.js';

class LoginManager {

  // ── API Methods ────────────────────────────────────────────────────────────

  /**
   * Check if user currently has a valid JWT session.
   * @returns {{ success: boolean, code: number, body: object|null }}
   */
  static async isAuthenticated() {
    try {
      const res = await fetch(`${pythonURI}/api/id`, fetchOptions);
      if (!res.ok) {
        return { success: false, code: res.status, body: null };
      }
      const data = await res.json();
      const authenticated = Boolean(data && data.uid);
      return { success: authenticated, code: res.status, body: authenticated ? data : null };
    } catch (err) {
      return { success: false, code: 0, body: { error: err.message } };
    }
  }

  /**
   * Log in with GitHub ID and password.
   * @param {string} uid
   * @param {string} password
   * @returns {{ success: boolean, code: number, body: object|null }}
   */
  static async login(uid, password) {
    try {
      const res = await fetch(`${pythonURI}/api/authenticate`, {
        ...fetchOptions,
        method: 'POST',
        body: JSON.stringify({ uid, password }),
      });
      if (!res.ok) {
        return { success: false, code: res.status, body: { error: `Login failed (${res.status})` } };
      }
      // Fetch user identity so caller can prefill forms
      const idRes = await fetch(`${pythonURI}/api/id`, fetchOptions);
      const userData = idRes.ok ? await idRes.json() : null;
      return { success: true, code: res.status, body: userData };
    } catch (err) {
      return { success: false, code: 0, body: { error: err.message } };
    }
  }

  /**
   * Sign up a new student account on Flask and Spring backends.
   * Spring registration is non-blocking; Flask success is required.
   * @param {{ name, uid, sid, school, email, password }} data
   * @returns {{ success: boolean, code: number, body: object|null }}
   */
  static async signup({ name, uid, sid, school, email, password }) {
    try {
      const flaskRes = await fetch(`${pythonURI}/api/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, uid, sid, school, email, password, kasm_server_needed: false }),
      });

      if (!flaskRes.ok) {
        const errText = await flaskRes.text().catch(() => '');
        return { success: false, code: flaskRes.status, body: { error: errText.slice(0, 120) } };
      }

      // Spring registration — fire-and-forget, do not block on result
      fetch(`${javaURI}/api/person/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid, sid, email, name, password,
          dob: '11-01-2024',
          kasmServerNeeded: false,
        }),
      }).catch(() => {});

      return { success: true, code: flaskRes.status, body: { uid, name, email } };
    } catch (err) {
      return { success: false, code: 0, body: { error: err.message } };
    }
  }

  // ── Guest Methods ─────────────────────────────────────────────────────────

  /**
   * Create a local-only guest session using email as the uid.
   * No API call is made — guest state is stored in localStorage only.
   * Guests can later upgrade to a Student account via upgradeGuestToStudent().
   *
   * @param {{ name: string, email: string }} data
   * @returns {{ success: boolean, code: number, body: object|null }}
   */
  static guestLogin({ name, email }) {
    if (!name || !email) {
      return { success: false, code: 400, body: { error: 'Name and email are required for guest access.' } };
    }
    const guestData = { name, uid: email, email, role: 'guest' };
    try {
      localStorage.setItem('ocs_guest_session', JSON.stringify(guestData));
    } catch (_) {}
    return { success: true, code: 200, body: guestData };
  }

  /**
   * Check if the current session is a guest (local-only, no JWT).
   * @returns {{ name: string, uid: string, email: string, role: 'guest' } | null}
   */
  static getGuestSession() {
    try {
      const raw = localStorage.getItem('ocs_guest_session');
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  /**
   * Upgrade a guest to a full student account.
   * Clears the guest session after successful signup so the user
   * is seamlessly transitioned to authenticated state.
   *
   * @param {{ name, uid, sid, school, email, password }} studentData
   * @returns {Promise<{ success: boolean, code: number, body: object|null }>}
   */
  static async upgradeGuestToStudent(studentData) {
    const result = await LoginManager.signup(studentData);
    if (result.success) {
      try { localStorage.removeItem('ocs_guest_session'); } catch (_) {}
    }
    return result;
  }

  // ── Nav Update ────────────────────────────────────────────────────────────

  /**
   * Update the OCS header nav (#loginArea) to reflect the logged-in user.
   * Mirrors the logic in /assets/js/api/login.js so a mid-session login
   * (e.g. via the game panel) is reflected immediately without a page reload.
   *
   * @param {{ name: string, uid: string, roles?: Array }} userData
   */
  static updateNavMenu(userData) {
    const loginArea = document.getElementById('loginArea');
    if (!loginArea || !userData) return;

    // Build roles line if present
    const rolesHtml = userData.roles && Array.isArray(userData.roles) && userData.roles.length > 0
      ? `<div style="padding:8px 16px;color:#888;font-size:0.95em;">
           Roles: ${userData.roles.map(r => r.name).join(', ')}
         </div><hr style="margin:4px 0;">`
      : '';

    loginArea.innerHTML = `
      <div class="dropdown">
        <button class="dropbtn page-link"
          style="border:none;background:none;cursor:pointer;color:inherit;font-size:inherit;font-family:inherit;padding:0;">
          ${userData.name}
        </button>
        <div class="dropdown-content hidden">
          ${rolesHtml}
          <a href="${baseurl}/profile">Profile</a>
          <a href="${baseurl}/logout">Logout</a>
        </div>
      </div>
    `;

    const btn     = loginArea.querySelector('.dropbtn');
    const content = loginArea.querySelector('.dropdown-content');
    if (btn && content) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        content.classList.toggle('hidden');
      });
      if (!window._loginDropdownListener) {
        document.addEventListener('click', (e) => {
          if (!btn.contains(e.target) && !content.contains(e.target)) {
            content.classList.add('hidden');
          }
        });
        window._loginDropdownListener = true;
      }
    }

    loginArea.style.opacity = '1';
    window.user = userData;
  }

  // ── UI Panel ───────────────────────────────────────────────────────────────

  /**
   * Show the built-in auth panel (choose → login / signup).
   * Resolves with { success, code, body } once the user logs in,
   * or { success: false, code: 0, body: null } if they cancel.
   *
   * @param {object} theme  - uiTheme from the calling game level
   * @returns {Promise<{ success: boolean, code: number, body: object|null }>}
   */
  static showPanel(theme = {}) {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      Object.assign(overlay.style, {
        position: 'fixed', inset: '0', zIndex: '10001',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
        background: theme.overlayBackground || 'rgba(13,13,26,0.72)',
      });

      const panel = document.createElement('section');
      Object.assign(panel.style, {
        width: '90%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto',
        padding: '24px 28px', borderRadius: '10px',
        fontFamily: '"Courier New", monospace',
        background: theme.background || 'rgba(13,13,26,0.92)',
        border: `2px solid ${theme.borderColor || '#4ecca3'}`,
        color: theme.textColor || '#e0e0e0',
        boxShadow: theme.boxShadow || '0 0 20px rgba(78,204,163,0.18)',
      });

      // ── DOM helpers ──────────────────────────────────────────────────────
      const s = (el, styles) => Object.assign(el.style, styles);

      const mkText = (tag, text, styles = {}) => {
        const el = document.createElement(tag);
        el.textContent = text;
        s(el, styles);
        return el;
      };

      const mkInput = (type, placeholder, autocomplete) => {
        const el = document.createElement('input');
        el.type = type;
        el.placeholder = placeholder;
        el.autocomplete = autocomplete || 'off';
        s(el, {
          width: '100%', boxSizing: 'border-box',
          background: theme.inputBackground || '#1a1a2e',
          border: `1px solid ${theme.borderColor || '#4ecca3'}`,
          borderRadius: '4px', padding: '8px',
          color: theme.textColor || '#e0e0e0',
          fontFamily: '"Courier New", monospace',
          marginBottom: '8px',
        });
        ['keydown', 'keyup', 'keypress'].forEach(ev =>
          el.addEventListener(ev, e => e.stopPropagation())
        );
        return el;
      };

      const mkBtn = (text, primary) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = text;
        s(btn, {
          background: primary ? (theme.buttonBackground || '#4ecca3') : (theme.secondaryButtonBackground || '#1a1a2e'),
          color: primary ? (theme.buttonTextColor || '#0d0d1a') : (theme.secondaryButtonTextColor || '#e0e0e0'),
          border: primary ? 'none' : `1px solid ${theme.borderColor || '#4ecca3'}`,
          borderRadius: '4px', padding: '10px 16px',
          fontFamily: '"Courier New", monospace',
          fontWeight: primary ? 'bold' : 'normal',
          cursor: 'pointer',
        });
        return btn;
      };

      const mkStatus = () => {
        const el = document.createElement('div');
        s(el, { fontSize: '12px', marginTop: '8px', minHeight: '18px', whiteSpace: 'pre-wrap' });
        return el;
      };

      const mkRow = (...btns) => {
        const row = document.createElement('div');
        s(row, { display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap', gap: '8px', marginTop: '8px' });
        btns.forEach(b => row.appendChild(b));
        return row;
      };

      const accent = theme.accentColor || '#4ecca3';
      const muted  = theme.secondaryTextColor || '#c7f2d4';
      const red    = '#ff6b6b';

      const close = (result) => { overlay.remove(); resolve(result); };

      // ── Views ────────────────────────────────────────────────────────────
      const renderView = (view, prefill = {}) => {
        panel.innerHTML = '';
        panel.appendChild(mkText('div', '⚔ IDENTITY TERMINAL', {
          color: accent, fontSize: '15px', fontWeight: 'bold',
          letterSpacing: '2px', textTransform: 'uppercase',
          marginBottom: '4px', textAlign: 'center',
        }));

        // ── Choose ───────────────────────────────────────────────────────
        if (view === 'choose') {
          panel.appendChild(mkText('p', 'Sign in with your student account, or continue as a Guest.', {
            fontSize: '12px', color: muted, marginBottom: '16px', textAlign: 'center',
          }));

          const loginBtn  = mkBtn('Log In',            true);
          const signupBtn = mkBtn('Sign Up',            false);
          const guestBtn  = mkBtn('Continue as Guest',  false);
          const cancelBtn = mkBtn('Cancel',             false);

          loginBtn.addEventListener('click',  () => renderView('login'));
          signupBtn.addEventListener('click', () => renderView('signup'));
          guestBtn.addEventListener('click',  () => renderView('guest'));
          cancelBtn.addEventListener('click', () => close({ success: false, code: 0, body: null }));

          const row = document.createElement('div');
          s(row, { display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px', marginTop: '8px' });
          [loginBtn, signupBtn, guestBtn, cancelBtn].forEach(b => row.appendChild(b));
          panel.appendChild(row);
        }

        // ── Login ────────────────────────────────────────────────────────
        if (view === 'login') {
          panel.appendChild(mkText('div', 'LOG IN', {
            color: accent, fontSize: '13px', letterSpacing: '1px',
            marginBottom: '14px', marginTop: '8px',
          }));

          const uidInput  = mkInput('text',     'GitHub ID', 'username');
          const passInput = mkInput('password', 'Password',  'current-password');
          const status    = mkStatus();

          if (prefill.uid) uidInput.value = prefill.uid;

          const submitBtn = mkBtn('Log In', true);
          const backBtn   = mkBtn('← Back', false);
          const cancelBtn = mkBtn('Cancel', false);

          const doLogin = async () => {
            const uid  = uidInput.value.trim();
            const pass = passInput.value;
            if (!uid || !pass) {
              status.style.color = red;
              status.textContent = 'Please fill in all fields.';
              return;
            }
            submitBtn.disabled = true;
            status.style.color = muted;
            status.textContent = 'Logging in…';

            const result = await LoginManager.login(uid, pass);

            if (!result.success) {
              status.style.color = red;
              status.textContent = result.code === 401
                ? 'Invalid credentials. Try again.'
                : (result.body?.error || `Login failed (${result.code}).`);
              submitBtn.disabled = false;
              return;
            }

            status.style.color = accent;
            status.textContent = '✓ Logged in! Loading profile…';
            setTimeout(() => close(result), 800);
          };

          submitBtn.addEventListener('click', doLogin);
          uidInput.addEventListener('keydown',  e => { if (e.key === 'Enter') { e.preventDefault(); doLogin(); } });
          passInput.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); doLogin(); } });
          backBtn.addEventListener('click',   () => renderView('choose'));
          cancelBtn.addEventListener('click', () => close({ success: false, code: 0, body: null }));

          panel.appendChild(uidInput);
          panel.appendChild(passInput);
          panel.appendChild(status);
          panel.appendChild(mkRow(backBtn, cancelBtn, submitBtn));
          setTimeout(() => uidInput.focus(), 0);
        }

        // ── Signup ───────────────────────────────────────────────────────
        if (view === 'signup') {
          panel.appendChild(mkText('div', 'CREATE ACCOUNT', {
            color: accent, fontSize: '13px', letterSpacing: '1px',
            marginBottom: '14px', marginTop: '8px',
          }));

          const nameInput   = mkInput('text',     'Name',                        'name');
          const uidInput    = mkInput('text',     'GitHub ID',                   'username');
          const sidInput    = mkInput('text',     'Student ID',                  'off');

          const schoolSel = document.createElement('select');
          s(schoolSel, {
            width: '100%', boxSizing: 'border-box',
            background: theme.inputBackground || '#1a1a2e',
            border: `1px solid ${theme.borderColor || '#4ecca3'}`,
            borderRadius: '4px', padding: '8px',
            color: theme.textColor || '#e0e0e0',
            fontFamily: '"Courier New", monospace',
            marginBottom: '8px',
          });
          [
            ['',                           'Select Your High School', true],
            ['Abraxas High School',        'Abraxas'],
            ['Del Norte High School',      'Del Norte'],
            ['Mt Carmel High School',      'Mt Carmel'],
            ['Poway High School',          'Poway'],
            ['Poway to Palomar',           'Poway to Palomar'],
            ['Rancho Bernardo High School','Rancho Bernardo'],
            ['Westview High School',       'Westview'],
          ].forEach(([val, label, disabled]) => {
            const opt = document.createElement('option');
            opt.value = val; opt.textContent = label;
            if (!val) { opt.disabled = true; opt.selected = true; }
            schoolSel.appendChild(opt);
          });

          const emailInput  = mkInput('email',    'Personal (not school) Email', 'email');
          const passInput   = mkInput('password', 'Password',                    'new-password');
          const pass2Input  = mkInput('password', 'Confirm Password',             'new-password');
          const status      = mkStatus();

          const submitBtn = mkBtn('Create Account', true);
          const backBtn   = mkBtn('← Back',         false);
          const cancelBtn = mkBtn('Cancel',          false);

          const doSignup = async () => {
            const name     = nameInput.value.trim();
            const uid      = uidInput.value.trim();
            const sid      = sidInput.value.trim();
            const school   = schoolSel.value;
            const email    = emailInput.value.trim();
            const password = passInput.value;
            const confirm  = pass2Input.value;

            if (!name || !uid || !sid || !school || !email || !password) {
              status.style.color = red;
              status.textContent = 'Please fill in all fields.';
              return;
            }
            if (password.length < 8) {
              status.style.color = red;
              status.textContent = 'Password must be at least 8 characters.';
              return;
            }
            if (password !== confirm) {
              status.style.color = red;
              status.textContent = 'Passwords do not match.';
              return;
            }

            submitBtn.disabled = true;
            status.style.color = muted;
            status.textContent = 'Creating account…';

            const result = await LoginManager.signup({ name, uid, sid, school, email, password });

            if (!result.success) {
              status.style.color = red;
              status.textContent = result.body?.error || `Signup failed (${result.code}).`;
              submitBtn.disabled = false;
              return;
            }

            status.style.color = accent;
            status.textContent = '✓ Account created! Logging in…';
            submitBtn.disabled = false;

            // Auto-proceed to login with uid prefilled after brief pause
            setTimeout(() => renderView('login', { uid }), 1200);
          };

          submitBtn.addEventListener('click', doSignup);
          backBtn.addEventListener('click',   () => renderView('choose'));
          cancelBtn.addEventListener('click', () => close({ success: false, code: 0, body: null }));

          [nameInput, uidInput, sidInput, schoolSel, emailInput, passInput, pass2Input, status]
            .forEach(el => panel.appendChild(el));
          panel.appendChild(mkRow(backBtn, cancelBtn, submitBtn));
          setTimeout(() => nameInput.focus(), 0);
        }

        // ── Guest ────────────────────────────────────────────────────────
        if (view === 'guest') {
          panel.appendChild(mkText('div', 'CONTINUE AS GUEST', {
            color: accent, fontSize: '13px', letterSpacing: '1px',
            marginBottom: '6px', marginTop: '8px',
          }));
          panel.appendChild(mkText('p', 'Your progress is saved locally. You can upgrade to a student account later.', {
            fontSize: '11px', color: muted, marginBottom: '12px',
          }));

          const nameInput  = mkInput('text',  'Name',  'name');
          const emailInput = mkInput('email', 'Email (used as your guest ID)', 'email');
          const status     = mkStatus();

          const submitBtn = mkBtn('Enter as Guest', true);
          const backBtn   = mkBtn('← Back',         false);
          const cancelBtn = mkBtn('Cancel',          false);

          const doGuest = () => {
            const name  = nameInput.value.trim();
            const email = emailInput.value.trim();
            if (!name || !email) {
              status.style.color = red;
              status.textContent = 'Please enter your name and email.';
              return;
            }
            const result = LoginManager.guestLogin({ name, email });
            if (!result.success) {
              status.style.color = red;
              status.textContent = result.body?.error || 'Could not create guest session.';
              return;
            }
            status.style.color = accent;
            status.textContent = '✓ Entering as guest…';
            setTimeout(() => close(result), 600);
          };

          submitBtn.addEventListener('click', doGuest);
          nameInput.addEventListener('keydown',  e => { if (e.key === 'Enter') { e.preventDefault(); doGuest(); } });
          emailInput.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); doGuest(); } });
          backBtn.addEventListener('click',   () => renderView('choose'));
          cancelBtn.addEventListener('click', () => close({ success: false, code: 0, body: null }));

          [nameInput, emailInput, status].forEach(el => panel.appendChild(el));
          panel.appendChild(mkRow(backBtn, cancelBtn, submitBtn));
          setTimeout(() => nameInput.focus(), 0);
        }
      };

      overlay.appendChild(panel);
      document.body.appendChild(overlay);
      renderView('choose');
    });
  }
}

export default LoginManager;
