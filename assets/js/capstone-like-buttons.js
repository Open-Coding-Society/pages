(function(){
  var STORAGE_LIKES = 'ocscapstoneLikes';
  var STORAGE_LIKED = 'ocscapstoneLiked';

  function safeJsonParse(value, fallback) {
    try {
      return JSON.parse(value || 'null') || fallback;
    } catch (err) {
      return fallback;
    }
  }

  function saveJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn('Unable to save likes to localStorage.', err);
    }
  }

  function normaliseKey(raw) {
    if (!raw) return 'capstone-card';
    return String(raw)
      .trim()
      .toLowerCase()
      .replace(/^\/+|\/+$/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9_-]/g, '-');
  }

  function buildLikeButton(projectKey, title, initialCount, isLiked) {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'capstone-like-button' + (isLiked ? ' liked' : '');
    button.setAttribute('aria-pressed', String(isLiked));
    button.setAttribute('aria-label', (isLiked ? 'Unlike ' : 'Like ') + title + '. ' + initialCount + ' like' + (initialCount === 1 ? '' : 's') + '.');

    var icon = document.createElement('span');
    icon.className = 'like-icon';
    icon.innerText = '❤️';

    var count = document.createElement('span');
    count.className = 'like-count';
    count.innerText = String(initialCount);

    button.appendChild(icon);
    button.appendChild(count);

    button.addEventListener('click', function() {
      var currentLikes = Number(likes[projectKey] || 0);
      var likedNow = !button.classList.contains('liked');
      var nextCount = Math.max(0, currentLikes + (likedNow ? 1 : -1));

      if (likedNow) {
        button.classList.add('liked');
        likedState[projectKey] = true;
      } else {
        button.classList.remove('liked');
        delete likedState[projectKey];
      }

      likes[projectKey] = nextCount;
      saveJson(STORAGE_LIKES, likes);
      saveJson(STORAGE_LIKED, likedState);

      count.innerText = String(nextCount);
      button.setAttribute('aria-pressed', String(likedNow));
      button.setAttribute('aria-label', (likedNow ? 'Unlike ' : 'Like ') + title + '. ' + nextCount + ' like' + (nextCount === 1 ? '' : 's') + '.');
    });

    return {button: button, countElement: count};
  }

  var likes = safeJsonParse(localStorage.getItem(STORAGE_LIKES), {});
  var likedState = safeJsonParse(localStorage.getItem(STORAGE_LIKED), {});
  var cards = Array.from(document.querySelectorAll('#capstone-grid > .capstone-item'));

  cards.forEach(function(card) {
    var link = card.querySelector('a[href]');
    var titleEl = card.querySelector('h3 a');
    var title = titleEl ? titleEl.textContent.trim() : card.textContent.trim().slice(0, 50);
    var href = link ? link.getAttribute('href') : title;
    var projectKey = normaliseKey(href || title);
    var currentCount = Number(likes[projectKey] || 0);
    var isLiked = Boolean(likedState[projectKey]);

    var infoBlock = card.children[1];
    if (!infoBlock) return;

    var likeRow = document.createElement('div');
    likeRow.className = 'capstone-like-row';

    var buttonData = buildLikeButton(projectKey, title, currentCount, isLiked);
    likeRow.appendChild(buttonData.button);

    infoBlock.appendChild(likeRow);
  });
})();
