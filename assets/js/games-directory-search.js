// Client-side filter for the games directory grid. Scoped to already-rendered
// game_directory cards, so it needs no search index — matching is a simple
// substring test against each card's data-title/data-topic/data-description.
(function () {
  function initGamesDirectorySearch() {
    var grid = document.querySelector('.js-games-grid');
    if (!grid) return;

    var input = document.querySelector('.js-games-search-input');
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.js-games-card'));
    var topicButtons = Array.prototype.slice.call(document.querySelectorAll('.js-games-topic-filter'));
    var emptyMessage = document.querySelector('.js-games-empty');
    var activeTopic = null;

    function cardMatchesQuery(card, query) {
      if (query === '') return true;
      var title = (card.getAttribute('data-title') || '').toLowerCase();
      var topic = (card.getAttribute('data-topic') || '').toLowerCase();
      var description = (card.getAttribute('data-description') || '').toLowerCase();
      return title.indexOf(query) !== -1 || topic.indexOf(query) !== -1 || description.indexOf(query) !== -1;
    }

    function applyFilters() {
      var query = (input && input.value || '').trim().toLowerCase();
      var visibleCount = 0;

      cards.forEach(function (card) {
        var topic = card.getAttribute('data-topic') || '';
        var visible = cardMatchesQuery(card, query) && (!activeTopic || topic === activeTopic);
        card.hidden = !visible;
        if (visible) visibleCount++;
      });

      topicButtons.forEach(function (button) {
        var topic = button.getAttribute('data-topic');
        var topicHasMatch = cards.some(function (card) {
          return (card.getAttribute('data-topic') || '') === topic && cardMatchesQuery(card, query);
        });
        button.hidden = !topicHasMatch;
        button.classList.toggle('games-directory__topic--active', topic === activeTopic);
      });

      if (emptyMessage) emptyMessage.hidden = visibleCount !== 0;
    }

    if (input) {
      input.addEventListener('input', applyFilters);
    }

    topicButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var topic = button.getAttribute('data-topic');
        activeTopic = activeTopic === topic ? null : topic;
        applyFilters();
      });
    });

    applyFilters();
  }

  if (document.readyState !== 'loading') {
    initGamesDirectorySearch();
  } else {
    document.addEventListener('DOMContentLoaded', initGamesDirectorySearch);
  }
})();
