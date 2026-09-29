// Shared helpers for the /capstone project cards (navigation/capstone.md).
//
// Every card can carry two sets of buttons:
//   main  -- the mentor's own actions (Apply status / Interested / Skip, from the inline
//            mentor script in capstone.md), in an action row pinned to the card's bottom
//            edge so it lines up across every card in a grid row;
//   extra -- project info anyone may see (Mentors / Chat, from cardTools.js), on its own
//            line right under the card text.
// Layout lives in _sass/open-coding/elements/grids/capstone-cards.scss.

// A card's project URL, normalized to a path so it matches the backend's stored URLs.
export function cardUrl(card) {
    const raw = card.dataset.pageUrl || card.querySelector('a')?.getAttribute('href') || '';
    try { return new URL(raw, location.origin).pathname; } catch (e) { return raw; }
}

// The container for one set of buttons ('main' or 'extra'), created on first use.
// Null for a card with no text block.
export function cardActionGroup(card, name) {
    // The <div> holding the h3/description/team paragraphs -- the sibling right after
    // the card's thumbnail link, for every card shape in this grid.
    const body = card.querySelector('a')?.nextElementSibling;
    if (!body) return null;
    const className = name === 'main' ? 'capstone-card-actions' : 'capstone-card-info';
    let group = body.querySelector(`:scope > .${className}`);
    if (group) return group;
    group = document.createElement('div');
    group.className = className;
    if (name === 'main') {
        body.append(group);
    } else {
        // Info sits above the bottom action row whichever script runs first.
        body.insertBefore(group, body.querySelector(':scope > .capstone-card-actions'));
    }
    // Pins the action row to the bottom of the card so rows line up across a grid row.
    card.classList.add('capstone-card--has-actions');
    body.classList.add('capstone-card__body');
    return group;
}
