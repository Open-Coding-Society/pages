// Starts every part of /profile (layouts/profile.html in this system) and keeps the
// identity card and the setup checklist at the top of the page in step with them.
// `api` holds the shared helpers the layout imports with the site's baseurl
// ({ pythonURI, javaURI, springEnabled, fetchOptions, putUpdate, postUpdate }), so these
// modules only import each other, with ./ paths. springEnabled is false on a Flask-only
// site, where the layout leaves out the Face ID and Gist cards.
import { initAccountForm } from './profile-account.js';
import { initClasses } from './profile-classes.js';
import { initFaceRegistration } from './profile-face.js';
import { initPersonas } from './profile-personas.js';
import { initSkillCheckIn } from './profile-skills.js';
import { initialsOf, setupSteps } from './profile-model.js';

const byId = id => document.getElementById(id);

function renderIdentity(user) {
    const name = user.name?.trim() || 'Your profile';
    byId('profileName').textContent = name;
    const avatar = byId('profileAvatar');
    avatar.textContent = initialsOf(user.name);
    avatar.title = name;
    byId('profileHandle').textContent = [user.uid && `@${user.uid}`, user.email].filter(Boolean).join(' · ');
    byId('profileSchool').textContent = user.school || '';
}

// Returns update(partial): merge what one part of the page learned and redraw the list.
function createSetupChecklist(list, springEnabled) {
    const state = {};
    function render() {
        list.replaceChildren(...setupSteps(state, { springEnabled }).map(step => {
            const item = document.createElement('li');
            const mark = document.createElement('span');
            mark.className = 'ocs__check';
            mark.setAttribute('aria-hidden', 'true');
            mark.textContent = step.done ? '✓' : '○';
            const link = document.createElement('a');
            link.href = step.href;
            link.textContent = step.label;
            const value = document.createElement('span');
            value.className = `ocs__status-pill ocs__status-pill--${step.done ? 'good' : 'neutral'}`;
            value.textContent = step.value;
            item.append(mark, link, value);
            return item;
        }));
    }
    render();
    return partial => {
        Object.assign(state, partial);
        render();
    };
}

// The Gist include (_includes/profile-gist-connection.html) sets data-connected on its
// state line when GitHub answers. A new state line without it means the check failed.
function watchGistConnection(updateSetup) {
    const state = byId('gist-connection-state');
    if (!state) return;
    const read = () => updateSetup({ gistConnected: state.dataset.connected === 'true' });
    new MutationObserver(read)
        .observe(state, { attributes: true, attributeFilter: ['data-connected'], childList: true, characterData: true, subtree: true });
    // GitHub may have answered before this module ran.
    if (state.dataset.connected !== undefined) read();
}

function readCourses() {
    try {
        return JSON.parse(byId('profileCourses').textContent);
    } catch (error) {
        console.error('The course list is not valid JSON:', error);
        return [];
    }
}

export function initProfilePage(api) {
    const updateSetup = createSetupChecklist(byId('profileSetup'), api.springEnabled);
    const report = part => error => console.error(`Error starting the ${part}:`, error);

    initAccountForm({
        api,
        form: byId('profileSettingsForm'),
        saveButton: byId('saveChangesBtn'),
        status: byId('saveStatus'),
        onSaved: renderIdentity,
    }).then(user => {
        if (user) renderIdentity(user);
    }).catch(report('account form'));

    initClasses({
        api,
        list: byId('classesContainer'),
        form: byId('addClassForm'),
        select: byId('addClassSelect'),
        status: byId('classesStatus'),
        courses: readCourses(),
        onChange: classes => updateSetup({ classes }),
    }).catch(report('classes'));

    initPersonas({
        api,
        container: byId('personaSelectionContainer'),
        progress: byId('personaProgress'),
        editButton: byId('personaEditBtn'),
        onChange: (personaCount, complete) => {
            updateSetup({ personaCount });
            byId('skillsCard').hidden = !complete;
        },
    }).catch(report('personas'));

    initSkillCheckIn({
        api,
        form: byId('skillSnapshotForm'),
        project: byId('snapshotProjectName'),
        status: byId('snapshotStatus'),
    });

    // Face ID and the Gist connection are saved in Spring.
    if (!api.springEnabled) return;

    initFaceRegistration({
        api,
        pill: byId('regStatusText'),
        openButton: byId('openScannerBtn'),
        modal: byId('webcamOverlay'),
        video: byId('webcamControl'),
        canvas: byId('captureCanvas'),
        status: byId('scannerStatus'),
        captureButton: byId('captureFaceBtn'),
        onChange: faceRegistered => updateSetup({ faceRegistered }),
    }).catch(report('Face ID check'));

    watchGistConnection(updateSetup);
}
