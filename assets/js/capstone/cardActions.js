// Shared helpers for the /capstone project cards (navigation/capstone.md).
//
// Every card can carry one action row pinned to its bottom edge: the mentor buttons
// (Apply / Interested / Skip, from the inline mentor script in capstone.md) and the
// Mentors / Chat buttons (cardTools.js) both go into it. Layout lives in
// _sass/open-coding/elements/grids/capstone-cards.scss.

// A card's project URL, normalized to a path so it matches the backend's stored URLs.
export function cardUrl(card) {
    const raw = card.dataset.pageUrl || card.querySelector('a')?.getAttribute('href') || '';
    try { return new URL(raw, location.origin).pathname; } catch (e) { return raw; }
}

// The card's action row, created on first use. Null for a card with no text block.
export function cardActionRow(card) {
    const existing = card.querySelector('.capstone-card-actions');
    if (existing) return existing;
    // The <div> holding the h3/description/team paragraphs -- the sibling right after
    // the card's thumbnail link, for every card shape in this grid.
    const body = card.querySelector('a')?.nextElementSibling;
    if (!body) return null;
    const row = document.createElement('div');
    row.className = 'capstone-card-actions';
    body.appendChild(row);
    // Pins the row to the bottom of the card so rows line up across a grid row.
    card.classList.add('capstone-card--has-actions');
    body.classList.add('capstone-card__body');
    return row;
}
