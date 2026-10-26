// The persona card on /profile: a summary of the four choices and, for each group
// still open (or every group while changing), a row of persona cards. Clicking a card
// saves that choice right away.
import { firstSentence, personaDescription, personaSections, personaTitle, personaTraits } from './profile-model.js';

function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}

function pill(text, tone) {
    return element('span', `ocs__status-pill ocs__status-pill--${tone}`, text);
}

// The choices made so far, two to a row. Open groups show their cards below instead.
function summaryList(sections) {
    const list = element('ul', 'ocs__entity-list ocs__hub-grid');
    for (const section of sections.filter(entry => entry.chosen)) {
        const item = element('li');
        item.append(
            element('small', null, section.label),
            document.createElement('br'),
            element('strong', null, personaTitle(section.chosen)),
        );
        list.append(item);
    }
    return list;
}

function personaCard(persona, section) {
    const isChosen = section.chosen?.id === persona.id;
    const card = element('button', isChosen ? 'ocs__hub-card ocs__hub-card--selected' : 'ocs__hub-card');
    card.type = 'button';
    card.dataset.personaId = String(persona.id);
    card.setAttribute('aria-pressed', String(isChosen));
    card.title = personaDescription(persona);

    const traits = element('span', 'ocs__links');
    if (isChosen) traits.append(pill('Your pick', 'good'));
    for (const trait of personaTraits(persona)) traits.append(pill(trait, 'neutral'));

    const body = element('span', 'ocs__stack');
    body.append(
        element('strong', 'ocs__hub-card-title', personaTitle(persona)),
        element('small', null, firstSentence(personaDescription(persona))),
        traits,
    );
    card.append(body);
    return card;
}

function pickerGroup(section) {
    const group = element('div');
    group.id = `category-${section.key}`;
    group.setAttribute('role', 'group');
    group.setAttribute('aria-labelledby', `category-${section.key}-title`);
    const title = element('h3', 'ocs__section-title', section.label);
    title.id = `category-${section.key}-title`;
    const grid = element('div', 'ocs__hub-grid');
    grid.append(...section.options.map(persona => personaCard(persona, section)));
    group.append(title, element('p', 'ocs__text', section.prompt), grid);
    return group;
}

export async function initPersonas({ api, container, progress, editButton, onChange }) {
    const { pythonURI, fetchOptions } = api;
    let personas = [];
    let selected = {};
    let editing = false;

    async function load() {
        const [allResponse, mineResponse] = await Promise.all([
            fetch(`${pythonURI}/api/persona`, fetchOptions),
            fetch(`${pythonURI}/api/user/personas`, fetchOptions),
        ]);
        if (!allResponse.ok) throw new Error(`the server answered ${allResponse.status}`);
        personas = await allResponse.json();
        selected = mineResponse.ok ? ((await mineResponse.json()).personas ?? {}) : {};
    }

    function render() {
        const sections = personaSections(personas, selected);
        const chosen = sections.filter(section => section.chosen).length;
        const complete = chosen === sections.length;
        progress.textContent = `${chosen} of ${sections.length} chosen`;
        progress.className = `ocs__status-pill ocs__status-pill--${complete ? 'good' : 'neutral'}`;
        editButton.hidden = chosen === 0;
        editButton.textContent = editing ? 'Done' : 'Change';
        // Open groups are always shown; chosen ones only while changing.
        const shown = sections.filter(section => editing || !section.chosen);
        container.replaceChildren(...(chosen && !editing ? [summaryList(sections)] : []), ...shown.map(pickerGroup));
        onChange?.(chosen, complete);
    }

    async function choose(card) {
        const group = card.closest('[role="group"]');
        const cards = [...group.querySelectorAll('button')];
        cards.forEach(button => { button.disabled = true; });
        card.setAttribute('aria-busy', 'true');
        card.querySelector('.ocs__links')?.prepend(pill('Saving…', 'good'));
        try {
            const response = await fetch(`${pythonURI}/api/user/persona`, {
                ...fetchOptions,
                method: 'POST',
                body: JSON.stringify({ persona_id: Number(card.dataset.personaId) }),
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(data.message || `the server answered ${response.status}`);
            await load();
            render();
        } catch (error) {
            console.error('Persona selection failed:', error);
            cards.forEach(button => { button.disabled = false; });
            card.removeAttribute('aria-busy');
            card.querySelector('.ocs__links')?.firstElementChild?.remove();
            let alert = group.querySelector('[role="alert"]');
            if (!alert) {
                alert = element('p', 'ocs__text');
                alert.setAttribute('role', 'alert');
                group.append(alert);
            }
            alert.textContent = `Couldn't save that choice: ${error.message}.`;
        }
    }

    container.addEventListener('click', event => {
        const card = event.target.closest('button[data-persona-id]');
        if (card && card.getAttribute('aria-pressed') !== 'true') choose(card);
    });
    editButton.addEventListener('click', () => {
        editing = !editing;
        render();
    });

    try {
        await load();
    } catch (error) {
        console.error('Error loading personas:', error);
        container.replaceChildren(element('p', 'ocs__text', `Couldn't load personas: ${error.message}.`));
        progress.textContent = 'Unavailable';
        return;
    }
    render();
}
