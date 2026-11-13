// Pure helpers for the profile settings page (/profile).
// No DOM and no network here, so `node --test tests/profile_model.test.mjs` covers them.

// The fields the account form's Save button covers, and what saving each one does.
export const ACCOUNT_FIELDS = [
    { key: 'name', inputId: 'nameChangeInput', label: 'Full name', reloadsPage: true },
    { key: 'uid', inputId: 'uidChangeInput', label: 'User ID', signsOut: true },
    { key: 'email', inputId: 'emailChangeInput', label: 'Email' },
    { key: 'sid', inputId: 'sidChangeInput', label: 'Student ID' },
    { key: 'school', inputId: 'schoolChangeInput', label: 'High school', reloadsPage: true },
];

// The fields whose trimmed value differs from what the page loaded. A blank field is
// never saved, the same rule the page has always had.
export function changedFields(loaded, current, fields = ACCOUNT_FIELDS) {
    return fields.filter(field => {
        const now = String(current[field.key] ?? '').trim();
        return now !== '' && now !== String(loaded[field.key] ?? '').trim();
    });
}

// "Ada Lovelace" -> "AL", "cher" -> "C". Used for the avatar when there is no picture.
export function initialsOf(name) {
    const words = String(name ?? '').trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return '?';
    const last = words.length > 1 ? words[words.length - 1][0] : '';
    return (words[0][0] + last).toUpperCase();
}

export const PERSONA_CATEGORIES = [
    { key: 'student', label: 'Student archetype', prompt: 'How you approach learning and teamwork' },
    { key: 'social', label: 'Social interest', prompt: 'Your hobbies and social interests' },
    { key: 'achievement', label: 'Achievement', prompt: 'What drives and motivates you' },
    { key: 'fantasy', label: 'Fantasy persona', prompt: 'Your aspirational superpower' },
];

export function personaTitle(persona) {
    return persona?.bio_map?.title || persona?.alias || 'Unnamed';
}

export function personaDescription(persona) {
    return persona?.bio_map?.description || '';
}

// A persona's traits, such as ["Introvert", "Analytical", "Independent"].
export function personaTraits(persona) {
    const traits = persona?.bio_map?.archetype;
    return Array.isArray(traits) ? traits.filter(trait => typeof trait === 'string' && trait.trim() !== '') : [];
}

// The first sentence of a description, for a persona card. The card's tooltip has the rest.
export function firstSentence(text) {
    const trimmed = String(text ?? '').trim();
    const match = trimmed.match(/^.+?[.!?](?=\s|$)/s);
    return match ? match[0] : trimmed;
}

// One entry per category, in display order: its options and the one the student chose (or null).
// `selected` is the Flask shape: { student: { persona_id: 1 }, ... }.
export function personaSections(allPersonas, selected) {
    return PERSONA_CATEGORIES.map(category => {
        const options = allPersonas.filter(persona => persona.category === category.key);
        const chosenId = selected?.[category.key]?.persona_id;
        const chosen = options.find(persona => persona.id === chosenId) ?? null;
        return { ...category, options, chosen };
    });
}

// The setup checklist at the top of the page. A value of null means that part hasn't loaded yet.
// Face ID and GitHub are saved in Spring, so a Flask-only site (springEnabled false) leaves them out.
export function setupSteps({ classes = null, personaCount = null, faceRegistered = null, gistConnected = null },
    { springEnabled = true } = {}) {
    const loading = 'Checking…';
    const steps = [
        {
            key: 'classes', label: 'Classes', href: '#classes', done: classes ? classes.length > 0 : null,
            value: classes === null ? loading : (classes.length ? classes.join(' · ') : 'None yet'),
        },
        {
            key: 'persona', label: 'Persona', href: '#persona', done: personaCount === null ? null : personaCount === PERSONA_CATEGORIES.length,
            value: personaCount === null ? loading : `${personaCount} of ${PERSONA_CATEGORIES.length}`,
        },
        {
            key: 'face', label: 'Face ID', href: '#face-id', done: faceRegistered, needsSpring: true,
            value: faceRegistered === null ? loading : (faceRegistered ? 'Registered' : 'Not set'),
        },
        {
            key: 'github', label: 'GitHub', href: '#github', done: gistConnected, needsSpring: true,
            value: gistConnected === null ? loading : (gistConnected ? 'Connected' : 'Not linked'),
        },
    ];
    return springEnabled ? steps : steps.filter(step => !step.needsSpring);
}
