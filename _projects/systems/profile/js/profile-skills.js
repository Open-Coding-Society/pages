// The skill check-in on /profile: four 1-6 ratings for one project, added to the
// student's Skill Passport.
const SKILLS = [
    { id: 'codingAbility', field: 'coding_ability' },
    { id: 'collaboration', field: 'collaboration' },
    { id: 'problemSolving', field: 'problem_solving' },
    { id: 'initiative', field: 'initiative' },
];

export function initSkillCheckIn({ api, form, project, status }) {
    const { pythonURI, fetchOptions } = api;
    const slider = skill => document.getElementById(skill.id);
    const showValue = skill => { document.getElementById(`${skill.id}Val`).textContent = slider(skill).value; };
    for (const skill of SKILLS) slider(skill).addEventListener('input', () => showValue(skill));

    form.addEventListener('submit', async event => {
        event.preventDefault();
        const projectName = project.value.trim();
        if (!projectName) {
            status.textContent = 'Name the project first.';
            project.focus();
            return;
        }
        status.textContent = 'Saving…';
        const ratings = Object.fromEntries(SKILLS.map(skill => [skill.field, Number(slider(skill).value)]));
        try {
            const response = await fetch(`${pythonURI}/api/user/skill-snapshot`, {
                ...fetchOptions,
                method: 'POST',
                body: JSON.stringify({ project_name: projectName, ...ratings }),
            });
            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || `the server answered ${response.status}`);
            }
        } catch (error) {
            console.error('Snapshot error:', error);
            status.textContent = `Couldn't save the check-in: ${error.message}.`;
            return;
        }
        form.reset();
        SKILLS.forEach(showValue);
        status.textContent = `Saved your check-in for ${projectName}.`;
    });
}
