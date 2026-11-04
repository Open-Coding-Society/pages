// The account form on /profile: fills in the student's details, enables Save only
// when a field really changed, and saves only those fields.
import { ACCOUNT_FIELDS, changedFields } from './profile-model.js';

// Flask keeps the profile, and a site that runs Spring keeps a copy there too, so a field
// is saved to Flask and, when springEnabled, to Spring.
async function saveField({ pythonURI, javaURI, springEnabled, putUpdate, postUpdate }, key, value) {
    const body = { [key]: value };
    const [flaskSaved, springSaved] = await Promise.all([
        putUpdate({ URL: `${pythonURI}/api/user`, body }),
        springEnabled ? postUpdate({ URL: `${javaURI}/api/person/update`, body }) : true,
    ]);
    if (!flaskSaved || !springSaved) throw new Error(`${flaskSaved ? 'Spring' : 'Flask'} didn't accept it`);
}

// The student's details from Flask's /api/id, or null when they can't be loaded.
async function loadAccount({ pythonURI, fetchOptions }) {
    try {
        const response = await fetch(`${pythonURI}/api/id`, fetchOptions);
        if (!response.ok) throw new Error(`the server answered ${response.status}`);
        const { name, uid, email, sid, school } = await response.json();
        return { name, uid, email, sid, school };
    } catch (error) {
        console.error('Error loading the account:', error);
        return null;
    }
}

// Resolves with the loaded details, or null when the student isn't signed in.
export async function initAccountForm({ api, form, saveButton, status, onSaved }) {
    const inputFor = field => document.getElementById(field.inputId);
    const readValues = () => Object.fromEntries(ACCOUNT_FIELDS.map(field => [field.key, inputFor(field).value]));
    // The values the page loaded. Compared only after they arrive: comparing against the
    // still-empty fields made every field look edited, so Save re-sent all of them, the User ID included.
    let loaded = null;
    const pending = () => (loaded ? changedFields(loaded, readValues()) : []);

    function refresh() {
        const dirty = pending().length > 0;
        saveButton.disabled = !dirty;
        status.textContent = dirty ? 'Unsaved changes' : '';
    }

    form.addEventListener('input', refresh);
    form.addEventListener('change', refresh);
    window.addEventListener('beforeunload', event => {
        if (pending().length === 0) return;
        event.preventDefault();
        event.returnValue = '';
    });

    form.addEventListener('submit', async event => {
        event.preventDefault();
        const fields = pending();
        if (fields.length === 0) return;
        const signsOut = fields.some(field => field.signsOut);
        if (signsOut && !window.confirm('Changing your User ID signs you out. You sign in again with the new ID. Save it?')) return;

        const values = readValues();
        saveButton.disabled = true;
        status.textContent = 'Saving…';
        // The User ID goes last: the session may stop working once it changes.
        const ordered = [...fields.filter(field => !field.signsOut), ...fields.filter(field => field.signsOut)];
        try {
            for (const field of ordered) {
                const value = values[field.key].trim();
                await saveField(api, field.key, value);
                loaded[field.key] = value;
            }
        } catch (error) {
            console.error('Error saving the account form:', error);
            refresh();
            status.textContent = `Couldn't save: ${error.message}. Try again.`;
            return;
        }
        status.textContent = 'Saved';
        onSaved?.({ ...loaded });
        if (signsOut) window.location.href = `${window.baseurl ?? ''}/`;
        else if (fields.some(field => field.reloadsPage)) window.location.reload();
    });

    const found = await loadAccount(api);
    if (!found?.uid) {
        status.textContent = "Couldn't load your account. Are you signed in?";
        return null;
    }
    for (const field of ACCOUNT_FIELDS) inputFor(field).value = found[field.key] ?? '';
    // Read back from the inputs: a school that isn't in the list leaves the select empty.
    loaded = readValues();
    refresh();
    return { ...loaded };
}
