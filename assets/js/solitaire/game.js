// /assets/js/solitaire/game.js
import { Deck, StockPile, WastePile, FoundationPile, TableauPile } from './models.js';

export class Game {
  constructor(ui) {
    this.ui = ui;

    // Piles
    this.stock = new StockPile();
    this.waste = new WastePile();
    this.foundations = [new FoundationPile(), new FoundationPile(), new FoundationPile(), new FoundationPile()];
    this.tableau = Array.from({ length: 7 }, () => new TableauPile());

    // State
    this.deck = null;
    this.score = 0;
    this.moves = [];
    this.timer = { start: 0, intervalId: null };
  }

  // ---- Lifecycle ----
  newGame() {
    this.reset();
    this.deck = new Deck();
    this.deal();
    this.ui.updateAll(this);
    this.startTimer();
  }

  reset() {
    this.score = 0;
    this.moves = [];
    this.stopTimer();
    this.ui.hideWin();
    this.ui.updateScore(this.score);
    this.ui.updateTime("00:00");

    this.stock = new StockPile();
    this.waste = new WastePile();
    this.foundations = [new FoundationPile(), new FoundationPile(), new FoundationPile(), new FoundationPile()];
    this.tableau = Array.from({ length: 7 }, () => new TableauPile());
  }

  deal() {
    // Tableau: 1..7 columns, last in each faceUp
    for (let col = 0; col < 7; col++) {
      for (let row = 0; row <= col; row++) {
        const card = this.deck.draw();
        card.faceUp = (row === col);
        this.tableau[col].push(card);
      }
    }
    // Rest to stock (face down)
    while (this.deck.size > 0) {
      const c = this.deck.draw();
      c.faceUp = false;
      this.stock.push(c);
    }
  }

  // ---- Rules & Actions ----
  drawFromStock() {
    if (!this.stock.isEmpty) {
      const c = this.stock.pop();
      c.faceUp = true;
      this.waste.push(c);
    } else if (!this.waste.isEmpty) {
      // Reset waste -> stock (turn face down)
      while (!this.waste.isEmpty) {
        const c = this.waste.pop();
        c.faceUp = false;
        this.stock.push(c);
      }
    }
    this.ui.renderPiles(this);
  }

  tryMoveCardById(cardId, targetKind, targetIndex = null) {
    const loc = this.findCard(cardId);
    if (!loc || (loc.card && !loc.card.faceUp)) return false;

    const targetPile = this.getPile(targetKind, targetIndex);
    if (!targetPile) return false;

    if (targetPile.type === 'foundation') {
      if (targetPile.canAccept(loc.card)) {
        this._moveCards(loc.pile, targetPile, 1);
        this.addScore(10);
        this._afterMove(loc.pile);
        return true;
      }
    } else if (targetPile.type === 'tableau') {
      const count = this._movableStackCount(loc.pile, cardId);
      const movingCards = loc.pile.cards.slice(-count);
      if (movingCards.length && targetPile.canAccept(movingCards[0])) {
        this._moveCards(loc.pile, targetPile, count);
        this.addScore(5);
        this._afterMove(loc.pile);
        return true;
      }
    }
    return false;
  }

  autoMoveToFoundation(cardId) {
    const loc = this.findCard(cardId);
    if (!loc || !loc.card || !loc.card.faceUp) return false;
    for (const f of this.foundations) {
      if (f.canAccept(loc.card)) {
        this._moveCards(loc.pile, f, 1);
        this.addScore(10);
        this._afterMove(loc.pile);
        return true;
      }
    }
    return false;
  }

  _afterMove(sourcePile) {
    if (sourcePile?.type === 'tableau' && !sourcePile.isEmpty) {
      const t = sourcePile.top();
      if (!t.faceUp) {
        t.faceUp = true;
        this.addScore(5);
      }
    }
    this.ui.renderPiles(this);
    this.checkWin();
  }

  _movableStackCount(fromPile, cardId) {
    const idx = fromPile.indexOfCardId(cardId);
    if (idx === -1) return 0;
    return fromPile.cards.length - idx;
  }

  _moveCards(fromPile, toPile, count) {
    const slice = fromPile.pop(count);
    if (Array.isArray(slice)) slice.forEach(c => toPile.push(c));
    else toPile.push(slice);
  }

  getPile(kind, index) {
    if (kind === 'stock') return this.stock;
    if (kind === 'waste') return this.waste;
    if (kind === 'foundation') return this.foundations[index];
    if (kind === 'tableau') return this.tableau[index];
    return null;
  }

  findCard(cardId) {
    const wIdx = this.waste.indexOfCardId(cardId);
    if (wIdx !== -1) return { pile: this.waste, card: this.waste.cards[wIdx] };

    for (const f of this.foundations) {
      const idx = f.indexOfCardId(cardId);
      if (idx !== -1) return { pile: f, card: f.cards[idx] };
    }

    for (const t of this.tableau) {
      const idx = t.indexOfCardId(cardId);
      if (idx !== -1) return { pile: t, card: t.cards[idx] };
    }
    return null;
  }

  addScore(points) {
    this.score += points;
    this.ui.updateScore(this.score);
  }

  // ---- Win / Timer ----
  checkWin() {
    const all13 = this.foundations.every(f => f.cards.length === 13);
    if (all13) {
      this.stopTimer();
      this.ui.showWin(this.score, this.ui.currentTimeStr());
      return true;
    }
    return false;
  }

  startTimer() {
    this.timer.start = Date.now();
    this.timer.intervalId = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.timer.start) / 1000);
      const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
      const ss = String(elapsed % 60).padStart(2, '0');
      this.ui.updateTime(`${mm}:${ss}`);
    }, 1000);
  }

  stopTimer() {
    if (this.timer.intervalId) clearInterval(this.timer.intervalId);
    this.timer.intervalId = null;
  }
}
