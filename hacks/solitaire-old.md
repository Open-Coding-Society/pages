---
layout: opencs
title: Solitaire Game
permalink: /solitaire-old/
---

<style>
    body {
        font-family: Arial, sans-serif;
    }
    
    .wrap {
        margin-left: auto;
        margin-right: auto;
        max-width: 1000px;
    }

    .game-container {
        display: none;
        padding: 20px;
        background: #0f7b0f;
        border-radius: 10px;
        min-height: 600px;
    }

    .game-container:focus {
        outline: none;
    }

    /* All screens style */
    #gameover p, #menu p {
        font-size: 20px;
    }

    #gameover a, #menu a {
        font-size: 30px;
        display: block;
        margin: 10px 0;
    }

    #gameover a:hover, #menu a:hover {
        cursor: pointer;
    }

    #gameover a:hover::before, #menu a:hover::before {
        content: ">";
        margin-right: 10px;
    }

    #menu {
        display: block;
    }

    #gameover {
        display: none;
    }

    /* Game Board Styles */
    .game-board {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 10px;
        margin-top: 20px;
    }

    .foundation-row {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 10px;
        margin-bottom: 20px;
    }

    .card-pile {
        width: 80px;
        height: 110px;
        border: 2px solid #333;
        border-radius: 8px;
        position: relative;
        background: #fff;
        cursor: pointer;
    }

    .card-pile.empty {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.3);
    }

    .card-pile.foundation {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.5);
    }

    .card {
        width: 76px;
        height: 106px;
        border: 1px solid #000;
        border-radius: 6px;
        background: #fff;
        position: absolute;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 4px;
        font-size: 12px;
        font-weight: bold;
        user-select: none;
    }

    .card.red {
        color: #d00;
    }

    .card.black {
        color: #000;
    }

    .card.face-down {
        background: #004d9f;
        background-image: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255,255,255,.1) 10px,
            rgba(255,255,255,.1) 20px
        );
    }

    .card.face-down * {
        display: none;
    }

    .card.dragging {
        z-index: 1000;
        transform: rotate(5deg);
    }

    .card.highlighted {
        box-shadow: 0 0 10px #ffff00;
    }

    .card-top {
        text-align: left;
    }

    .card-bottom {
        text-align: right;
        transform: rotate(180deg);
    }

    .suit {
        font-size: 16px;
    }

    .tableau-pile {
        min-height: 300px;
    }

    .stock-pile, .waste-pile {
        width: 80px;
        height: 110px;
    }

    .game-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }

    .score-display {
        color: white;
        font-size: 18px;
        font-weight: bold;
    }

    .timer-display {
        color: white;
        font-size: 16px;
    }

    .game-buttons {
        display: flex;
        gap: 10px;
    }

    .game-buttons button {
        padding: 8px 16px;
        background: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
    }

    .game-buttons button:hover {
        background: #45a049;
    }

    .win-message {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 30px;
        border-radius: 10px;
        text-align: center;
        font-size: 24px;
        z-index: 2000;
        display: none;
    }
      /* Modal Styles */
    .modal {
        position: fixed;
        z-index: 2000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0,0,0,0.7);
    }
    
    .modal-content {
        background-color: #f8f9fa; 
        margin: 5% auto;
        padding: 20px;
        border: 1px solid #888;
        width: 80%;
        max-width: 700px;
        border-radius: 10px;
        max-height: 80vh;
        overflow-y: auto;
        color: #000;
    }
    
    .close {
        color: #6c757d;
        float: right;
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
    }
    
    .close:hover,
    .close:focus {
        color: black;
        text-decoration: none;
    }
    
    .instructions-container h4 {
        margin-top: 20px;
        color: #2c3e50;
        border-bottom: 1px solid #eee;
        padding-bottom: 5px;
    }
    
    .instructions-container ul {
        padding-left: 20px;
    }
    #instructions_modal, 
    #instructions_modal * {
        color: #000 !important;
    }


</style>

<h2>Solitaire</h2>
<div class="container">
    <div class="container bg-secondary" style="text-align:center;">
        <!-- Main Menu -->
        <div id="menu" class="py-4 text-light">
            <p>Welcome to Klondike Solitaire</p>
            <p>Move all cards to the foundation piles, organized by suit from Ace to King</p>
            <a id="new_game" class="link-alert">new game</a>
            <a id="instructions" class="link-alert">how to play</a>
        </div>
        <!-- Game Over -->
        <div id="gameover" class="py-4 text-light">
            <p>Game Over!</p>
            <p id="final_score">Final Score: 0</p>
            <p id="final_time">Time: 00:00</p>
            <a id="new_game1" class="link-alert">new game</a>
            <a id="menu_return" class="link-alert">main menu</a>
        </div>
        <!-- Game Screen -->
        <div id="game_screen" class="game-container wrap" tabindex="1">
            <div class="game-controls">
                <div class="score-display">Score: <span id="score_value">0</span></div>
                <div class="timer-display">Time: <span id="timer_value">00:00</span></div>
                <div class="game-buttons">
                    <button id="hint_btn">Hint</button>
                    <button id="undo_btn">Undo</button>
                    <button id="restart_btn">Restart</button>
                </div>
            </div>
            <div class="foundation-row">
                <div id="stock" class="card-pile stock-pile" data-pile="stock"></div>
                <div id="waste" class="card-pile waste-pile empty" data-pile="waste"></div>
                <div class="card-pile empty"></div>
                <div id="foundation_0" class="card-pile foundation" data-pile="foundation" data-index="0"></div>
                <div id="foundation_1" class="card-pile foundation" data-pile="foundation" data-index="1"></div>
                <div id="foundation_2" class="card-pile foundation" data-pile="foundation" data-index="2"></div>
                <div id="foundation_3" class="card-pile foundation" data-pile="foundation" data-index="3"></div>
            </div>
            <div class="game-board">
                <div id="tableau_0" class="card-pile tableau-pile" data-pile="tableau" data-index="0"></div>
                <div id="tableau_1" class="card-pile tableau-pile" data-pile="tableau" data-index="1"></div>
                <div id="tableau_2" class="card-pile tableau-pile" data-pile="tableau" data-index="2"></div>
                <div id="tableau_3" class="card-pile tableau-pile" data-pile="tableau" data-index="3"></div>
                <div id="tableau_4" class="card-pile tableau-pile" data-pile="tableau" data-index="4"></div>
                <div id="tableau_5" class="card-pile tableau-pile" data-pile="tableau" data-index="5"></div>
                <div id="tableau_6" class="card-pile tableau-pile" data-pile="tableau" data-index="6"></div>
            </div>
            <div id="win_message" class="win-message">
                <h3>Congratulations!</h3>
                <p>You Won!</p>
                <p id="win_score"></p>
                <p id="win_time"></p>
                <button id="play_again_btn">Play Again</button>
            </div>
        </div>
    </div>
    <div id="instructions_modal" class="modal" style="display: none;">
    <div class="modal-content">
        <span class="close">&times;</span>
        <h3>How to Play Klondike Solitaire</h3>
        <div class="instructions-container">
        <h4>Objective</h4>
        <p style="background-color: #d4f7d4; padding: 5px; border-radius: 4px;">
            Move all cards to the four foundation piles, building each suit in ascending order from Ace to King.
        </p>
        <h4>Game Layout</h4>
        <ul>
            <li><strong>Tableau:</strong> Seven piles where you build descending sequences of alternating colors</li>
            <li><strong>Foundations:</strong> Four piles where you build ascending sequences by suit (Ace to King)</li>
            <li><strong>Stock:</strong> The deck of remaining cards (click to draw)</li>
            <li><strong>Waste:</strong> Where drawn cards from the stock are placed</li>
        </ul>
        <h4>Rules</h4>
        <ul>
            <li>Only Kings can be placed on empty tableau piles</li>
            <li>Build tableau piles in descending order (King to Ace) with alternating colors</li>
            <li>Build foundation piles in ascending order (Ace to King) by suit</li>
            <li>You can move face-up cards from one tableau pile to another</li>
            <li>You can move cards from the waste pile to tableau or foundation piles</li>
            <li>Click the stock pile to draw new cards</li>
            <li>When the stock is empty, you can reset it from the waste pile</li>
        </ul>
        <h4>Scoring</h4>
        <ul>
            <li>+5 points for each card moved to tableau</li>
            <li>+10 points for each card moved to foundation</li>
            <li>+5 points for turning over a face-down card in tableau</li>
        </ul>
        <h4>Controls</h4>
        <ul>
            <li><strong>Click:</strong> Select and move cards (or draw from stock)</li>
            <li><strong>Drag & Drop:</strong> Move cards between piles</li>
            <li><strong>Hint Button:</strong> Get a suggestion for a move</li>
            <li><strong>Undo Button:</strong> Reverse your last move</li>
            <li><strong>Restart Button:</strong> Start a new game</li>
        </ul>
        </div>
    </div>
    </div>
</div>

<script>
(() => {
    // -------------------------------
    // Core Models
    // -------------------------------
    class Card {
        constructor(suit, rank, color, value) {
            this.suit = suit;     // '♠', '♣', '♦', '♥'
            this.rank = rank;     // 'A', '2', ... 'K'
            this.color = color;   // 'red' | 'black'
            this.value = value;   // 1..13
            this.faceUp = false;
            this.id = `${rank}${suit}`;
        }
    }

    class Deck {
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

    // Base Pile
    class Pile {
        constructor(type) {
            this.type = type; // 'stock', 'waste', 'foundation', 'tableau'
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

    class StockPile extends Pile {
        constructor() { super('stock'); }
    }

    class WastePile extends Pile {
        constructor() { super('waste'); }
    }

    class FoundationPile extends Pile {
        constructor() { super('foundation'); }
        canAccept(card) {
            if (this.isEmpty) return card.rank === 'A';
            const top = this.top();
            return (card.suit === top.suit && card.value === top.value + 1);
        }
    }

    class TableauPile extends Pile {
        constructor() { super('tableau'); }
        canAccept(card) {
            if (this.isEmpty) return card.rank === 'K';
            const top = this.top();
            return (card.color !== top.color && card.value === top.value - 1);
        }
    }

    // -------------------------------
    // Game Controller
    // -------------------------------
    class Game {
        constructor(ui) {
            this.ui = ui;

            // Piles
            this.stock = new StockPile();
            this.waste = new WastePile();
            this.foundations = [new FoundationPile(), new FoundationPile(), new FoundationPile(), new FoundationPile()];
            this.tableau = [new TableauPile(), new TableauPile(), new TableauPile(), new TableauPile(), new TableauPile(), new TableauPile(), new TableauPile()];

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
            this.tableau = [new TableauPile(), new TableauPile(), new TableauPile(), new TableauPile(), new TableauPile(), new TableauPile(), new TableauPile()];
        }

        deal() {
            // Deal tableau: 1..7 columns, last in each faceUp
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
                // Single card to foundation
                if (targetPile.canAccept(loc.card)) {
                    this._moveCards(loc.pile, targetPile, 1);
                    this.addScore(10);
                    this._afterMove(loc.pile);
                    return true;
                }
            } else if (targetPile.type === 'tableau') {
                // Can be a stack move in tableau
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
            // Flip top of tableau if needed
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
            // count card + all cards under it (already ordered visually)
            const idx = fromPile.indexOfCardId(cardId);
            if (idx === -1) return 0;
            return fromPile.cards.length - idx;
        }

        _moveCards(fromPile, toPile, count) {
            const slice = fromPile.pop(count);
            if (Array.isArray(slice)) {
                slice.forEach(c => toPile.push(c));
            } else {
                toPile.push(slice);
            }
        }

        getPile(kind, index) {
            if (kind === 'stock') return this.stock;
            if (kind === 'waste') return this.waste;
            if (kind === 'foundation') return this.foundations[index];
            if (kind === 'tableau') return this.tableau[index];
            return null;
        }

        findCard(cardId) {
            // waste
            const wIdx = this.waste.indexOfCardId(cardId);
            if (wIdx !== -1) return { pile: this.waste, card: this.waste.cards[wIdx] };

            // foundations
            for (const f of this.foundations) {
                const idx = f.indexOfCardId(cardId);
                if (idx !== -1) return { pile: f, card: f.cards[idx] };
            }

            // tableau
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

    // -------------------------------
    // UI / View
    // -------------------------------
    class UI {
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
            this._attachStockHandlers(this.dom.stock, game);

            // WASTE
            if (game.waste.isEmpty) this.dom.waste.classList.add('empty'); else this.dom.waste.classList.remove('empty');
            this._renderPileTop(this.dom.waste, game.waste.top());

            // FOUNDATIONS
            game.foundations.forEach((f, i) => {
                this._renderPileTop(this.dom.foundations[i], f.top());
                this._attachDropHandlers(this.dom.foundations[i], 'foundation', i, game);
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
                this._attachDropHandlers(host, 'tableau', i, game);
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
                // The controller will decide what to do
                controller.handleCardClick(card.id);
            });

            return el;
        }

        _attachDropHandlers(host, kind, index, game) {
            host.addEventListener('dragover', (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; });
            host.addEventListener('drop', (e) => {
                e.preventDefault();
                if (!this.draggedCardId) return;
                controller.handleDrop(this.draggedCardId, kind, index);
            });
        }

        _attachStockHandlers(host, game) {
            host.addEventListener('click', () => controller.handleStockClick());
        }
    }

    // -------------------------------
    // Controller (wires UI <-> Game)
    // -------------------------------
    class Controller {
        constructor(game, ui) {
            this.game = game;
            this.ui = ui;
        }
        startNewGame() { this.game.newGame(); }
        restart() { this.game.newGame(); }
        handleStockClick() {
            this.game.drawFromStock();
        }
        handleCardClick(cardId) {
            // Try automove from waste/tableau to foundation
            if (this.game.autoMoveToFoundation(cardId)) return;
            // Otherwise no-op (students can extend to smart hints here)
        }
        handleDrop(cardId, targetKind, targetIndex) {
            this.game.tryMoveCardById(cardId, targetKind, targetIndex);
        }
        showMenu() { this.ui.showMenu(); }
        showOver() {
            this.ui.showOver(this.game.score, this.ui.currentTimeStr());
        }
        hint() {
            // Simple hint: tell player the obvious strategies (students can improve)
            alert("Hint: Move Aces to foundations. Uncover face-down tableau cards. Build alternating colors down.");
        }
        undo() {
            // Placeholder for students: push/pop from game.moves and revert
            alert("Undo feature: implement by pushing moves to a stack and reversing them.");
        }
        handleWin() {
            // Called by Game via UI.showWin already; could add fireworks, etc.
        }
    }

    // -------------------------------
    // Bootstrap / Events
    // -------------------------------
    const ui = new UI();
    const game = new Game(ui);
    const controller = new Controller(game, ui);

    // Expose minimal API for HTML button
    document.getElementById('new_game').onclick = () => controller.startNewGame();
    document.getElementById('new_game1').onclick = () => controller.startNewGame();
    document.getElementById('menu_return').onclick = () => controller.showMenu();
    document.getElementById('restart_btn').onclick = () => controller.restart();
    document.getElementById('hint_btn').onclick = () => controller.hint();
    document.getElementById('undo_btn').onclick = () => controller.undo();
    document.getElementById('play_again_btn').onclick = () => controller.restart();

    // Keyboard: press Space on menu to start
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && ui.menu.style.display !== 'none') controller.startNewGame();
    });

    // Initial screen
    ui.showMenu();
})();
   // Get the modal
    const modal = document.getElementById("instructions_modal");
    const instructionsBtn = document.getElementById("instructions");
    const closeBtn = document.getElementsByClassName("close")[0];
    
    // Open modal when instructions is clicked
    instructionsBtn.onclick = function() {
      modal.style.display = "block";
    }
    
    // Close modal when X is clicked
    closeBtn.onclick = function() {
      modal.style.display = "none";
    }
    
    // Close modal when clicking outside content
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
      if (event.key === "Escape" && modal.style.display === "block") {
        modal.style.display = "none";
      }
    });
    document.body.style.overflow = "hidden"; // Prevent scrolling behind modal
    document.body.style.overflow = "auto"; // Re-enable scrolling

</script>