// /assets/js/solitaire/models.js

// --------- Core Models ---------
export class Card {
  constructor(suit, rank, color, value) {
    this.suit = suit;   // '♠', '♣', '♦', '♥'
    this.rank = rank;   // 'A'...'K'
    this.color = color; // 'red' | 'black'
    this.value = value; // 1..13
    this.faceUp = false;
    this.id = `${rank}${suit}`;
  }
}

export class Deck {
  constructor() {
    this.suits = ['♠', '♣', '♦', '♥'];
    this.ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
    this.suitColors = {'♠':'black','♣':'black','♦':'red','♥':'red'};
    this.cards = [];
    this.build();
    this.shuffle();
  }
  build() {
    this.cards = [];
    for (const s of this.suits) {
      for (const r of this.ranks) {
        this.cards.push(new Card(s, r, this.suitColors[s], this.ranks.indexOf(r) + 1));
      }
    }
  }
  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }
  draw() { return this.cards.pop(); }
  get size() { return this.cards.length; }
}

// --------- Piles ---------
export class Pile {
  constructor(type) {
    this.type = type; // 'stock','waste','foundation','tableau'
    this.cards = [];
  }
  top() { return this.cards[this.cards.length - 1]; }
  push(card) { this.cards.push(card); }
  pop(n = 1) {
    if (n === 1) return this.cards.pop();
    return this.cards.splice(-n, n);
  }
  get isEmpty() { return this.cards.length === 0; }
  indexOfCardId(cardId) { return this.cards.findIndex(c => c.id === cardId); }
}

export class StockPile extends Pile { constructor() { super('stock'); } }
export class WastePile extends Pile { constructor() { super('waste'); } }

export class FoundationPile extends Pile {
  constructor() { super('foundation'); }
  canAccept(card) {
    if (this.isEmpty) return card.rank === 'A';
    const top = this.top();
    return (card.suit === top.suit && card.value === top.value + 1);
  }
}

export class TableauPile extends Pile {
  constructor() { super('tableau'); }
  canAccept(card) {
    if (this.isEmpty) return card.rank === 'K';
    const top = this.top();
    return (card.color !== top.color && card.value === top.value - 1);
  }
}
