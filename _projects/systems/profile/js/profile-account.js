// The account form on /profile: fills in the student's details, enables Save only
// when a field really changed, and saves only those fields.
import { ACCOUNT_FIELDS, changedFields } from './profile-model.js';

// The student's details, or null when they can't be loaded.
async function loadAccount(profile) {
    try {
        return await profile.loadAccount();
    } catch (error) {
        console.error('Error loading the account:', error);
        return null;
    }
}

// Resolves with the loaded details, or null when the student isn't signed in. Each field is
// saved through the profile: to Flask and, on a site that runs Spring, to Spring's copy too.
export async function initAccountForm({ profile, form, saveButton, status, onSaved }) {
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
                await profile.saveField(field.key, value);
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

    const found = await loadAccount(profile);
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
