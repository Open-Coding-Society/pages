// Blackjack.js - A simple embedded Blackjack game for our mansion game's casino level
class BlackjackGameManager {
    constructor(gameEnv) {
        this.gameEnv = gameEnv;
        this.money = 1000;
        this.currentBet = 0;
        this.goalMoney = 10000;
        this.gameActive = false;
        this.overlay = null;
        this.roundInProgress = false;
    }
// Start the games
    startGame() {
        if (this.gameActive) return;
        this.gameActive = true;
        this.createOverlay();
    }
// Overlay
    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.id = 'blackjack-overlay';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 10000;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 20px;
            opacity: 0;
            transition: opacity 0.8s ease-in-out;
        `;
// Fade out the main game canvas        
        if (this.gameEnv && this.gameEnv.canvas) {
            this.gameEnv.canvas.style.transition = 'opacity 0.8s ease-in-out';
            this.gameEnv.canvas.style.opacity = '0';
        }
// Game container
        const gameContainer = document.createElement('div');
        gameContainer.id = 'embedded-blackjack';
        gameContainer.style.cssText = `
            width: 90%;
            max-width: 900px;
            background: transparent;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
        `;
// Money display and instructions
        const moneyDisplay = document.createElement('div');
        moneyDisplay.id = 'money-display';
        moneyDisplay.style.cssText = `
            font-size: 24px;
            font-weight: bold;
            color: #2ecc71;
            text-align: center;
            margin-bottom: 20px;
        `;
        moneyDisplay.innerHTML = `Current Money: $${this.money} | Goal: $${this.goalMoney}`;
// Instructions
        const instructions = document.createElement('div');
        instructions.style.cssText = `
            background: #f39c12;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            color: white;
            font-weight: bold;
            text-align: center;
        `;
        instructions.innerHTML = `
            🎰 CASINO CHALLENGE 🎰<br>
            Choose your bet amount and try to reach $10,000!
        `;
// Append elements
        gameContainer.appendChild(moneyDisplay);
        gameContainer.appendChild(instructions);
        this.overlay.appendChild(gameContainer);
        document.body.appendChild(this.overlay);
// Fade in overlay        
        setTimeout(() => {
            this.overlay.style.opacity = '1';
        }, 50);

        this.loadBlackjackHTML(gameContainer);
    }
// Update money display
    updateMoneyDisplay() {
        const moneyDisplay = document.getElementById('money-display');
        const moneyColor = this.money >= 0 ? '#2ecc71' : '#e74c3c';
        const moneyText = this.money >= 0 ? `$${this.money}` : `-$${Math.abs(this.money)} (DEBT)`;
        moneyDisplay.innerHTML = `<span style="color: ${moneyColor}">Current Money: ${moneyText}</span> | <span style="color: white;">Goal: $${this.goalMoney}</span>`;
    }
// Load HTML structure
    loadBlackjackHTML(container) {
        const blackjackHTML = `
            <div id="betting-area" style="background: #34495e; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
                <h3 style="color: white; margin-bottom: 15px;">Select Your Bet:</h3>
                <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                    <button class="bet-btn" data-bet="100" style="padding: 15px 25px; font-size: 18px; font-weight: bold; background: #27ae60; color: white; border: none; border-radius: 8px; cursor: pointer;">$100</button>
                    <button class="bet-btn" data-bet="500" style="padding: 15px 25px; font-size: 18px; font-weight: bold; background: #3498db; color: white; border: none; border-radius: 8px; cursor: pointer;">$500</button>
                    <button class="bet-btn" data-bet="1000" style="padding: 15px 25px; font-size: 18px; font-weight: bold; background: #f39c12; color: white; border: none; border-radius: 8px; cursor: pointer;">$1,000</button>
                    <button class="bet-btn" data-bet="2500" style="padding: 15px 25px; font-size: 18px; font-weight: bold; background: #e67e22; color: white; border: none; border-radius: 8px; cursor: pointer;">$2,500</button>
                    <button class="bet-btn" data-bet="5000" style="padding: 15px 25px; font-size: 18px; font-weight: bold; background: #c0392b; color: white; border: none; border-radius: 8px; cursor: pointer;">$5,000</button>
                    <button class="bet-btn" data-bet="all" style="padding: 15px 25px; font-size: 18px; font-weight: bold; background: #8e44ad; color: white; border: none; border-radius: 8px; cursor: pointer;">ALL IN</button>
                </div>
                <p id="bet-message" style="color: white; margin-top: 15px; font-size: 16px;">Choose a bet amount to start playing!</p>
            </div>
            <div id="game-container" style="background: transparent; display: none;">
                <div style="background: #2c3e50; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <p id="current-bet-display" style="color: white; font-size: 20px; font-weight: bold; text-align: center; margin: 0;">Current Bet: $0</p>
                </div>
                <div id="dealer-area" class="player-area">
                    <h2 style="color: white;">Dealer's Hand: <span id="dealer-score">0</span></h2>
                    <div class="hand-container">
                        <div id="dealer-cards" class="cards-container"></div>
                        <div id="dealer-points" class="points-list" style="color: white;"></div>
                    </div>
                </div>
                <div id="player-area" class="player-area">
                    <h2 style="color: white;">Your Hand: <span id="player-score">0</span></h2>
                    <div class="hand-container">
                        <div id="player-cards" class="cards-container"></div>
                        <div id="player-points" class="points-list" style="color: white;"></div>
                    </div>
                </div>
                <div id="game-controls">
                    <button id="hit-btn">Hit</button>
                    <button id="stand-btn">Stand</button>
                    <button id="new-bet-btn" style="background: #3498db;">New Bet</button>
                    <button id="exit-casino-btn" style="background: #e74c3c; color: white;">Exit Casino</button>
                </div>
                <p id="message" style="color: white; font-weight: bold; text-align: center; font-size: 18px;"></p>
            </div>
        `;

        container.innerHTML += blackjackHTML;
        this.initializeBlackjack();
    }
// Initialize game logic
    initializeBlackjack() {
        setTimeout(() => {
            const bettingArea = document.getElementById("betting-area");
            const gameContainer = document.getElementById("game-container");
            const dealerCardsEl = document.getElementById("dealer-cards");
            const playerCardsEl = document.getElementById("player-cards");
            const messageEl = document.getElementById("message");
            const betMessage = document.getElementById("bet-message");
            const currentBetDisplay = document.getElementById("current-bet-display");

            const hitBtn = document.getElementById("hit-btn");
            const standBtn = document.getElementById("stand-btn");
            const newBetBtn = document.getElementById("new-bet-btn");
            const exitBtn = document.getElementById("exit-casino-btn");

            let deck = [];
            let playerHand = [];
            let dealerHand = [];
            let gameOver = false;

            // Bet button handlers
            const betButtons = document.querySelectorAll('.bet-btn');
            betButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const betValue = btn.dataset.bet;
                    let betAmount;
                    
                    if (betValue === 'all') {
                        betAmount = this.money;
                    } else {
                        betAmount = parseInt(betValue);
                    }
                    
                    // Check if player has enough money
                    if (betAmount > this.money) {
                        betMessage.textContent = `Not enough money! You only have $${this.money}`;
                        betMessage.style.color = '#e74c3c';
                        return;
                    }
                    
                    if (this.money <= 0) {
                        betMessage.textContent = "You're out of money! Try exiting and re-entering the casino.";
                        betMessage.style.color = '#e74c3c';
                        return;
                    }
                    
                    // Place bet and start game
                    this.currentBet = betAmount;
                    this.money -= betAmount;
                    this.updateMoneyDisplay();
                    
                    currentBetDisplay.textContent = `Current Bet: $${this.currentBet}`;
                    bettingArea.style.display = 'none';
                    gameContainer.style.display = 'block';
                    
                    startRound();
                });
            });
// Game logic functions
            const createDeck = () => {
                const suits = ["♠", "♥", "♦", "♣"];
                const values = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
                let newDeck = [];
                for (let suit of suits) {
                    for (let value of values) newDeck.push({value, suit});
                }
                return shuffle(newDeck);
            };

            const shuffle = (deck) => {
                for (let i = deck.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [deck[i], deck[j]] = [deck[j], deck[i]];
                }
                return deck;
            };

            const getCardValue = (card) => {
                if (["J","Q","K"].includes(card.value)) return 10;
                if (card.value === "A") return 11;
                return parseInt(card.value);
            };

            const calculateHand = (hand) => {
                let value = 0, aceCount = 0;
                for (let card of hand) {
                    value += getCardValue(card);
                    if (card.value === "A") aceCount++;
                }
                while (value > 21 && aceCount > 0) { value -= 10; aceCount--; }
                return value;
            };

            const renderHand = (hand, container, pointsContainer) => {
                container.innerHTML = "";
                pointsContainer.innerHTML = "";
                for (let card of hand) {
                    const cardEl = document.createElement("div");
                    cardEl.classList.add("card");
                    cardEl.textContent = `${card.value}${card.suit}`;
                    cardEl.style.color = (card.suit==="♥"||card.suit==="♦")?"red":"white";
                    container.appendChild(cardEl);
                }
                pointsContainer.textContent = calculateHand(hand);
            };

            const renderDealerInitial = () => {
                dealerCardsEl.innerHTML = "";
                const firstCard = dealerHand[0];
                
                const cardEl1 = document.createElement("div");
                cardEl1.classList.add("card");
                cardEl1.textContent = `${firstCard.value}${firstCard.suit}`;
                cardEl1.style.color = (firstCard.suit==="♥"||firstCard.suit==="♦")?"red":"white";
                dealerCardsEl.appendChild(cardEl1);

                const cardEl2 = document.createElement("div");
                cardEl2.classList.add("card");
                cardEl2.textContent = "🂠";
                dealerCardsEl.appendChild(cardEl2);

                document.getElementById("dealer-points").textContent = getCardValue(firstCard);
            };
// End round
            const endRound = (result) => {
                gameOver = true;
                this.roundInProgress = false;
                
                if (result === 'win') {
                    // Win: Get back bet + winnings
                    this.money += (this.currentBet * 2);
                    messageEl.textContent = `🎉 You Win! Won $${this.currentBet}`;
                    messageEl.style.color = '#2ecc71';
                } else if (result === 'push') {
                    // Push: Get bet back
                    this.money += this.currentBet;
                    messageEl.textContent = `🤝 Push! Your $${this.currentBet} is returned`;
                    messageEl.style.color = '#f39c12';
                } else {
                    // Loss: Money already deducted
                    messageEl.textContent = `😢 You Lost $${this.currentBet}`;
                    messageEl.style.color = '#e74c3c';
                }
                
                this.updateMoneyDisplay();
                
                // Check for win condition
                if (this.money >= this.goalMoney) {
                    setTimeout(() => {
                        this.exitGame();
                        // Trigger level win callback if provided
                        if (this.onWin && typeof this.onWin === 'function') {
                            this.onWin();
                        }
                    }, 2000);
                }
                
                // Check for loss condition
                if (this.money <= 0) {
                    setTimeout(() => {
                        messageEl.textContent += " | You're out of money! Exit and try again.";
                    }, 1000);
                }
            };
// Check game over conditions
            const checkGameOver = () => {
                const playerValue = calculateHand(playerHand);
                const dealerValue = calculateHand(dealerHand);

                if (playerValue > 21) {
                    endRound('loss');
                } else if (dealerValue > 21) {
                    endRound('win');
                } else if (gameOver) {
                    if (playerValue > dealerValue) {
                        endRound('win');
                    } else if (dealerValue > playerValue) {
                        endRound('loss');
                    } else {
                        endRound('push');
                    }
                }
            };
// Start a new round
            const startRound = () => {
                this.roundInProgress = true;
                deck = createDeck();
                playerHand = [deck.pop(), deck.pop()];
                dealerHand = [deck.pop(), deck.pop()];
                gameOver = false;

                renderHand(playerHand, playerCardsEl, document.getElementById("player-points"));
                renderDealerInitial();
                messageEl.textContent = "Game started. Hit or Stand?";
                messageEl.style.color = 'white';
            };

            const hit = () => {
                if (gameOver) return;
                playerHand.push(deck.pop());
                renderHand(playerHand, playerCardsEl, document.getElementById("player-points"));
                const playerValue = calculateHand(playerHand);
                
                if (playerValue > 21) {
                    checkGameOver();
                } else if (playerValue === 21) {
                    messageEl.textContent = "21! You might want to stand...";
                } else {
                    messageEl.textContent = `You have ${playerValue}. Hit or Stand?`;
                }
            };

            const stand = () => {
                if (gameOver) return;

                dealerCardsEl.children[1].textContent = `${dealerHand[1].value}${dealerHand[1].suit}`;
                dealerCardsEl.children[1].style.color = (dealerHand[1].suit==="♥"||dealerHand[1].suit==="♦") ? "red" : "white";
                document.getElementById("dealer-points").textContent = calculateHand(dealerHand);

                while (calculateHand(dealerHand) < 17) {
                    const card = deck.pop();
                    dealerHand.push(card);
                    const cardEl = document.createElement("div");
                    cardEl.classList.add("card");
                    cardEl.textContent = `${card.value}${card.suit}`;
                    cardEl.style.color = (card.suit==="♥"||card.suit==="♦")?"red":"white";
                    dealerCardsEl.appendChild(cardEl);
                    document.getElementById("dealer-points").textContent = calculateHand(dealerHand);
                }

                gameOver = true;
                checkGameOver();
            };

            const newBet = () => {
                gameContainer.style.display = 'none';
                bettingArea.style.display = 'block';
                betMessage.textContent = "Choose a bet amount to start playing!";
                betMessage.style.color = 'white';
                this.currentBet = 0;
                currentBetDisplay.textContent = "Current Bet: $0";
            };

            hitBtn.addEventListener("click", hit);
            standBtn.addEventListener("click", stand);
            newBetBtn.addEventListener("click", newBet);
            exitBtn.addEventListener("click", () => this.exitGame());
        }, 100);
    }
// Exit game
    exitGame() {
        if (this.overlay) {
            this.overlay.style.opacity = '0';
            
            if (this.gameEnv && this.gameEnv.canvas) {
                this.gameEnv.canvas.style.opacity = '1';
            }
            
            setTimeout(() => {
                if (this.overlay && this.overlay.parentNode) {
                    document.body.removeChild(this.overlay);
                }
                this.overlay = null;
            }, 800);
        }
        this.gameActive = false;
        
        // Reset money to $1000 when exiting
        this.money = 1000;
        this.currentBet = 0;
    }

    resetLevel() {
        this.money = 1000;
        this.exitGame();
        window.location.reload();
    }
}

export default BlackjackGameManager;

// End of Blackjack.js