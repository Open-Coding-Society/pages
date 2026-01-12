// /assets/js/solitaire/ui.js

export class UI {
  constructor() {
    // Screens
    this.menu = document.getElementById('menu');
    this.game = document.getElementById('game_screen');
    this.over = document.getElementById('gameover');

    // Controls
    this.eScore = document.getElementById('score_value');
    this.eTimer = document.getElementById('timer_value');
    this.winBox = document.getElementById('win_message');
    this.winScore = document.getElementById('win_score');
    this.winTime = document.getElementById('win_time');
    this.playAgainBtn = document.getElementById('play_again_btn');

    // Piles (containers)
    this.dom = {
      stock: document.getElementById('stock'),
      waste: document.getElementById('waste'),
      foundations: [
        document.getElementById('foundation_0'),
        document.getElementById('foundation_1'),
        document.getElementById('foundation_2'),
        document.getElementById('foundation_3')
      ],
      tableau: [
        document.getElementById('tableau_0'),
        document.getElementById('tableau_1'),
        document.getElementById('tableau_2'),
        document.getElementById('tableau_3'),
        document.getElementById('tableau_4'),
        document.getElementById('tableau_5'),
        document.getElementById('tableau_6')
      ]
    };

    // Drag state
    this.draggedCardId = null;
    this.dragSource = null; // { kind, index }

    // Controller (injected)
    this.controller = null;
  }

  setController(controller) {
    this.controller = controller;
  }

  // ---- Screen handling ----
  showMenu() {
    this.menu.style.display = 'block';
    this.game.style.display = 'none';
    this.over.style.display = 'none';
  }
  showGame() {
    this.menu.style.display = 'none';
    this.game.style.display = 'block';
    this.over.style.display = 'none';
    this.game.focus();
  }
  showOver(finalScore, timeStr) {
    document.getElementById('final_score').textContent = `Final Score: ${finalScore}`;
    document.getElementById('final_time').textContent = `Time: ${timeStr}`;
    this.menu.style.display = 'none';
    this.game.style.display = 'block';
    this.over.style.display = 'block';
  }

  // ---- Metrics ----
  updateScore(s) { this.eScore.textContent = s; }
  updateTime(t) { this.eTimer.textContent = t; }
  currentTimeStr() { return this.eTimer.textContent; }

  showWin(score, timeStr) {
    this.winScore.textContent = `Score: ${score}`;
    this.winTime.textContent = `Time: ${timeStr}`;
    this.winBox.style.display = 'block';
  }
  hideWin() { this.winBox.style.display = 'none'; }

  // ---- Rendering ----
  updateAll(game) {
    this.showGame();
    this.renderPiles(game);
  }

  renderPiles(game) {
    // Clear
    document.querySelectorAll('.card-pile').forEach(p => p.innerHTML = '');

    // STOCK
    this._renderPileTop(this.dom.stock, game.stock.top());
    this._attachStockHandlers(this.dom.stock);

    // WASTE
    if (game.waste.isEmpty) this.dom.waste.classList.add('empty');
    else this.dom.waste.classList.remove('empty');
    this._renderPileTop(this.dom.waste, game.waste.top());

    // FOUNDATIONS
    game.foundations.forEach((f, i) => {
      this._renderPileTop(this.dom.foundations[i], f.top());
      this._attachDropHandlers(this.dom.foundations[i], 'foundation', i);
    });

    // TABLEAU (stacked)
    game.tableau.forEach((t, i) => {
      const host = this.dom.tableau[i];
      t.cards.forEach((card, idx) => {
        const el = this._createCardElement(card);
        el.style.top = `${idx * 20}px`;
        el.style.zIndex = idx;
        host.appendChild(el);
      });
      this._attachDropHandlers(host, 'tableau', i);
    });
  }

  _renderPileTop(host, topCard) {
    if (!topCard) {
      host.classList.add('empty');
      return;
    }
    host.classList.remove('empty');
    const el = this._createCardElement(topCard);
    host.appendChild(el);
  }

  _createCardElement(card) {
    const el = document.createElement('div');
    el.className = `card ${card.color} ${card.faceUp ? '' : 'face-down'}`;
    el.id = `card_${card.id}`;
    el.setAttribute('data-card-id', card.id);
    el.draggable = card.faceUp;

    el.innerHTML = `
      <div class="card-top">
        <span class="rank">${card.rank}</span>
        <span class="suit">${card.suit}</span>
      </div>
      <div class="card-bottom">
        <span class="rank">${card.rank}</span>
        <span class="suit">${card.suit}</span>
      </div>
    `;

    // Drag events
    el.addEventListener('dragstart', (e) => {
      this.draggedCardId = card.id;
      e.dataTransfer.effectAllowed = 'move';
      el.classList.add('dragging');
    });
    el.addEventListener('dragend', () => {
      el.classList.remove('dragging');
      this.draggedCardId = null;
    });

    // Click: try auto-move to foundation
    el.addEventListener('click', () => {
      this.controller?.handleCardClick(card.id);
    });

    return el;
  }

  _attachDropHandlers(host, kind, index) {
    host.addEventListener('dragover', (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; });
    host.addEventListener('drop', (e) => {
      e.preventDefault();
      if (!this.draggedCardId) return;
      this.controller?.handleDrop(this.draggedCardId, kind, index);
    });
  }

  _attachStockHandlers(host) {
    host.addEventListener('click', () => this.controller?.handleStockClick());
  }
}
