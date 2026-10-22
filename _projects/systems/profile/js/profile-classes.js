// The classes card on /profile: lists the student's classes and adds or removes one
// in Flask right away, then keeps Spring's course groups in step (course calendars read them).
async function requestClasses({ pythonURI, fetchOptions }, method, body) {
    const response = await fetch(`${pythonURI}/api/user/class`, {
        ...fetchOptions,
        method,
        ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (!response.ok) throw new Error(`the server answered ${response.status}`);
    const data = await response.json();
    return Array.isArray(data.class) ? data.class : [];
}

// Keep the four course-group memberships aligned with the saved profile classes.
async function syncClassGroupMemberships({ javaURI, fetchOptions }, classes) {
    const response = await fetch(`${javaURI}/api/groups/class-memberships`, {
        ...fetchOptions,
        method: 'PUT',
        body: JSON.stringify({ classes }),
    });
    if (!response.ok) {
        let message = 'Failed to update course group membership';
        try {
            const error = await response.json();
            if (error.error) message = error.error;
        } catch (parseError) {
            console.error('Unable to read group membership error:', parseError);
        }
        throw new Error(message);
    }
    return response.json();
}

// `courses` is [{ code: 'CSA', name: 'Computer Science A' }, ...], from the course data files.
export async function initClasses({ api, list, form, select, status, courses, onChange }) {
    let classes = [];
    const nameOf = code => courses.find(course => course.code === code)?.name ?? code;
    const addButton = form.querySelector('button[type="submit"]');

    function showStatus(message) {
        status.textContent = message;
        status.hidden = !message;
    }

    function messageRow(text) {
        const item = document.createElement('li');
        item.textContent = text;
        return item;
    }

    function classRow(code) {
        const row = document.createElement('div');
        row.className = 'ocs__links';
        const label = document.createElement('strong');
        label.textContent = code;
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'ocs__btn small';
        remove.dataset.removeClass = code;
        remove.setAttribute('aria-label', `Remove ${code}`);
        remove.textContent = 'Remove';
        row.append(label, document.createTextNode(nameOf(code)), remove);
        const item = document.createElement('li');
        item.append(row);
        return item;
    }

    function render() {
        list.replaceChildren(...(classes.length ? classes.map(classRow) : [messageRow('No classes yet. Add the class you are taking.')]));
        const remaining = courses.filter(course => !classes.includes(course.code));
        select.replaceChildren(...(remaining.length
            ? remaining.map(course => new Option(`${course.code} · ${course.name}`, course.code))
            : [new Option('All classes added', '')]));
        select.disabled = remaining.length === 0;
        addButton.disabled = remaining.length === 0;
    }

    // One change at a time: overlapping requests could leave Spring's groups on a stale list.
    let busy = false;
    async function change(request) {
        if (busy) return;
        busy = true;
        select.disabled = true;
        addButton.disabled = true;
        list.querySelectorAll('[data-remove-class]').forEach(button => { button.disabled = true; });
        showStatus('Saving…');
        try {
            classes = await request();
            onChange?.(classes);
            try {
                await syncClassGroupMemberships(api, classes);
                showStatus('Saved');
            } catch (error) {
                console.error('Class saved but group membership sync failed:', error);
                showStatus(`Your classes were saved, but the course groups didn't update: ${error.message}`);
            }
        } catch (error) {
            console.error('Error updating classes:', error);
            showStatus(`Couldn't update your classes: ${error.message}.`);
        } finally {
            busy = false;
            render();
        }
    }

    form.addEventListener('submit', event => {
        event.preventDefault();
        const code = select.value;
        if (code) change(() => requestClasses(api, 'POST', { class: code }));
    });
    list.addEventListener('click', event => {
        const button = event.target.closest('[data-remove-class]');
        if (button) change(() => requestClasses(api, 'POST', { action: 'remove', class: button.dataset.removeClass }));
    });

    try {
        classes = await requestClasses(api, 'GET');
    } catch (error) {
        console.error('Error loading classes:', error);
        list.replaceChildren(messageRow("Couldn't load your classes."));
        return;
    }
    render();
    onChange?.(classes);
    // As before, the groups are re-synced every time the page loads.
    syncClassGroupMemberships(api, classes).catch(error => console.error('Group membership sync failed:', error));
}
