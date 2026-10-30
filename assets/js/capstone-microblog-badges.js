// The capstone list (navigation/capstone.md): a red count on each capstone card
// whose page has new microblog posts for the signed-in author, from
// assets/js/api/microblog-notifications.js. A card is matched to its page by
// its data-page-url, or else its first link.

import { baseurl } from './api/config.js';
import { normalizePagePath, onMicroblogUnread } from './api/microblog-notifications.js';

function cardPath(card) {
    const href = card.dataset.pageUrl || card.querySelector('a[href]')?.getAttribute('href');
    if (!href) return null;
    try {
        return normalizePagePath(new URL(href, location.href).pathname, baseurl);
    } catch (_) {
        return null;
    }
}

function renderCard(card, count, title) {
    let badge = card.querySelector('.microblog-unread-badge--card');
    if (!count) {
        badge?.remove();
        delete card.dataset.microblogUnreadCard;
        return;
    }
    if (!badge) {
        badge = document.createElement('span');
        badge.className = 'microblog-unread-badge microblog-unread-badge--card';
        card.appendChild(badge);
    }
    card.dataset.microblogUnreadCard = '';
    badge.textContent = count > 99 ? '99+' : String(count);
    badge.title = `${count} new microblog post${count === 1 ? '' : 's'} on ${title || 'this capstone'}`;
    badge.setAttribute('aria-label', badge.title);
}

const cards = [...document.querySelectorAll('#capstone-grid > div')].map(card => ({
    card,
    path: cardPath(card),
    title: card.querySelector('h3')?.textContent.trim(),
}));

onMicroblogUnread(({ byPage }) => {
    cards.forEach(({ card, path, title }) => renderCard(card, (path && byPage[path]) || 0, title));
});
