// The classes card on /profile: lists the student's classes and adds or removes one
// right away. On a site that runs Spring, the profile also keeps Spring's course groups
// in step (course calendars read them).

// `courses` is [{ code: 'CSA', name: 'Computer Science A' }, ...], from the course data files.
export async function initClasses({ profile, list, form, select, status, courses, onChange }) {
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
            const saved = await request();
            classes = saved.classes;
            onChange?.(classes);
            if (saved.groupsError) {
                console.error('Class saved but group membership sync failed:', saved.groupsError);
                showStatus(`Your classes were saved, but the course groups didn't update: ${saved.groupsError}`);
            } else {
                showStatus('Saved');
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
        if (code) change(() => profile.addClass(code));
    });
    list.addEventListener('click', event => {
        const button = event.target.closest('[data-remove-class]');
        if (button) change(() => profile.removeClass(button.dataset.removeClass));
    });

    try {
        classes = await profile.classes();
    } catch (error) {
        console.error('Error loading classes:', error);
        list.replaceChildren(messageRow("Couldn't load your classes."));
        return;
    }
    render();
    onChange?.(classes);
    // As before, the groups are re-synced every time the page loads (a FlaskProfile has none).
    profile.syncCourseGroups(classes).catch(error => console.error('Group membership sync failed:', error));
}
