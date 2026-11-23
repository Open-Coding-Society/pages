// What /profile saves and loads. FlaskProfile is the core every site has (OCS for Business):
// the account, classes, personas and skill check-ins, all in Flask. SpringProfile extends it for
// sites that also run Spring (OCS for Education): it saves each account field to Spring's copy
// too, keeps Spring's course groups in step with the classes, and adds Face ID.
// The backends are Login's Backend objects, which the layout's starter makes with createBackends
// (assets/js/login/backend.js). A failed request rejects with the reason the page shows.

export class FlaskProfile {
    constructor({ flask }) {
        this.flask = flask;
    }

    get usesSpring() {
        return false;
    }

    // The signed-in student's details. Rejects when nobody is signed in or Flask can't be reached.
    async loadAccount() {
        const user = await ask(this.flask, '/api/id');
        if (!isObject(user)) throw new Error("Flask's answer isn't an account");
        const { name, uid, email, sid, school } = user;
        return { name, uid, email, sid, school };
    }

    async saveField(key, value) {
        const refused = await refusal(this.flask.request('/api/user', { method: 'PUT', body: { [key]: value } }));
        if (refused) throw new Error("Flask didn't accept it", { cause: refused });
    }

    async classes() {
        return classList(await ask(this.flask, '/api/user/class'));
    }

    // Both resolve the saved classes. groupsError is null here; SpringProfile sets it when the
    // classes saved but its course groups didn't update.
    async addClass(code) {
        return { classes: await this.#changeClasses({ class: code }), groupsError: null };
    }

    async removeClass(code) {
        return { classes: await this.#changeClasses({ action: 'remove', class: code }), groupsError: null };
    }

    async #changeClasses(body) {
        return classList(await ask(this.flask, '/api/user/class', { method: 'POST', body }));
    }

    // A Flask-only site has no course groups, so there is nothing to keep in step.
    async syncCourseGroups(classes) {
        return null;
    }

    async personas() {
        return ask(this.flask, '/api/persona');
    }

    // The student's choices, by category: { student: { persona_id: 1 }, ... }. None when Flask
    // refuses, as the page has always treated it.
    async chosenPersonas() {
        try {
            const answer = await this.flask.request('/api/user/personas');
            return (isObject(answer) && answer.personas) || {};
        } catch (error) {
            if (error.status === 0) throw failure(error);
            return {};
        }
    }

    async choosePersona(personaId) {
        return ask(this.flask, '/api/user/persona', { method: 'POST', body: { persona_id: personaId } }, messageOf);
    }

    // snapshot: { project_name, coding_ability, collaboration, problem_solving, initiative }
    async saveSkillSnapshot(snapshot) {
        return ask(this.flask, '/api/user/skill-snapshot', { method: 'POST', body: snapshot }, messageOf);
    }

    async gameProfile() {
        try {
            return await this.flask.request('/api/profile/game');
        } catch (error) {
            if (error.status === 404) return null;
            throw failure(error);
        }
    }

    async signedInAccount() {
        let user;
        try {
            user = await this.flask.request('/api/id');
        } catch (error) {
            if (error.status === 401 || error.status === 403) return null;
            throw failure(error);
        }
        if (!isObject(user) || typeof user.uid !== 'string' || !user.uid) {
            throw new Error('The account response has no user ID.');
        }
        return user;
    }

    async updateGameProfile(fields) {
        return ask(this.flask, '/api/profile/game', {
            method: 'PUT',
            body: { _game_profile: fields },
        });
    }
}

export class SpringProfile extends FlaskProfile {
    constructor({ flask, spring }) {
        super({ flask });
        this.spring = spring;
    }

    get usesSpring() {
        return true;
    }

    // Flask's save and Spring's are sent together, and both answers are awaited before anything
    // is reported: the form allows a retry once this settles, and a Spring save still on its way
    // could otherwise land after the retry's. Flask's refusal is the one reported.
    async saveField(key, value) {
        const [flaskRefused, springRefused] = await Promise.all([
            refusal(super.saveField(key, value)),
            refusal(this.spring.request('/api/person/update', { method: 'POST', body: { [key]: value } })),
        ]);
        if (flaskRefused) throw flaskRefused;
        if (springRefused) throw new Error("Spring didn't accept it", { cause: springRefused });
    }

    async addClass(code) {
        return this.#withCourseGroups(await super.addClass(code));
    }

    async removeClass(code) {
        return this.#withCourseGroups(await super.removeClass(code));
    }

    // The classes are saved in Flask by now, so a course-group failure is reported, not thrown.
    async #withCourseGroups(result) {
        try {
            await this.syncCourseGroups(result.classes);
            return result;
        } catch (error) {
            return { ...result, groupsError: error.message };
        }
    }

    // Course calendars read these groups, so they follow the student's classes.
    async syncCourseGroups(classes) {
        return ask(this.spring, '/api/groups/class-memberships', { method: 'PUT', body: { classes } },
            (body) => (isObject(body) && body.error) || 'Failed to update course group membership');
    }

    // The Spring account, which says whether a face is registered (faceData).
    async person() {
        return ask(this.spring, '/api/person/get');
    }

    // faceData: the photo as base64 JPEG
    async registerFace(faceData) {
        return ask(this.spring, '/api/face/register', { method: 'POST', body: { faceData } });
    }
}

// SpringProfile only when the site has a Spring backend (createBackends makes it for spring: true).
export function createProfile({ flask, spring }) {
    return spring ? new SpringProfile({ flask, spring }) : new FlaskProfile({ flask });
}

async function ask(backend, path, options, explain) {
    try {
        return await backend.request(path, options);
    } catch (error) {
        throw failure(error, explain);
    }
}

// The reason the page shows after "Couldn't …: ". With no answer it's the browser's own text
// ("Failed to fetch"); otherwise what `explain` finds in the answer, or the status.
function failure(error, explain = () => '') {
    if (typeof error?.status !== 'number') return error;
    const reason = error.status === 0
        ? error.cause?.message || error.message
        : explain(error.body) || `the server answered ${error.status}`;
    return new Error(reason, { cause: error });
}

// Resolves the error a request failed with, or null when it succeeded.
async function refusal(request) {
    try {
        await request;
        return null;
    } catch (error) {
        return error;
    }
}

const messageOf = (body) => (isObject(body) ? body.message : '');

function classList(answer) {
    return isObject(answer) && Array.isArray(answer.class) ? answer.class : [];
}

function isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}
