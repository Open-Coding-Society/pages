---
layout: fortunefindersCasino
title: Blackjack
permalink: /gamify/blackjack
---

<!-- Bootstrap CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
<style>
    body {
        font-family: 'Poppins', sans-serif;
        background-color: #121212;
        color: #fff;
    }
    .game-container {
        max-width: 800px;
        background-color: #1f1f1f;
        border-radius: 8px;
        box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
    }
    .game-title {
        color: #ff9800;
        border-left: 4px solid #ff9800;
        padding-left: 1rem;
    }
    .card-display {
        display: inline-block;
        width: 60px;
        height: 90px;
        border-radius: 5px;
        border: 2px solid white;
        text-align: center;
        line-height: 90px;
        font-size: 20px;
        font-weight: bold;
        margin: 5px;
        background-color: white;
        color: black;
        position: relative;
    }
    .hearts, .diamonds {
        color: red;
    }
    .clubs, .spades {
        color: black;
    }
    .game-status {
        min-height: 50px;
    }
    .bet-display {
        color: #fff;
        font-weight: bold;
    }
    .hand-section {
        min-height: 130px;
    }
</style>

<body class="m-0 p-0">

<div class="container my-5">
    <div class="game-container p-4">
        <h2 class="game-title mb-4">Blackjack</h2>
        
        <div class="row mb-4">
            <div class="col-md-6">
                <div class="card bg-dark border-secondary mb-3">
                    <div class="card-body">
                        <h3 class="card-title">Balance</h3>
                        <p id="balance" class="fs-4">Loading...</p>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card bg-dark border-secondary mb-3">
                    <div class="card-body">
                        <h3 class="card-title">Place Your Bet</h3>
                        <div class="input-group mb-3">
                            <input type="number" id="betAmount" class="form-control text-center" min="1" value="1000" step="1000">
                            <span class="input-group-text bet-display" id="betValue">$1,000</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row mb-3">
            <div class="col-12">
                <div class="card bg-dark border-secondary">
                    <div class="card-body">
                        <h3 class="card-title">Dealer's Hand</h3>
                        <div id="dealerHand" class="d-flex flex-wrap justify-content-center hand-section"></div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row mb-4">
            <div class="col-12">
                <div class="card bg-dark border-secondary">
                    <div class="card-body">
                        <h3 class="card-title">Your Hand</h3>
                        <div id="playerHand" class="d-flex flex-wrap justify-content-center hand-section"></div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row mb-3">
            <div class="col-12">
                <div class="game-status text-center">
                    <p id="gameStatus" class="fs-5"></p>
                </div>
            </div>
        </div>
        
        <div class="d-flex justify-content-center gap-2">
            <button id="startGame" class="btn btn-success">Start Game</button>
            <button id="hit" class="btn btn-warning" disabled>Hit</button>
            <button id="stand" class="btn btn-info" disabled>Stand</button>
            <button id="exit" class="btn btn-danger">Exit</button>
        </div>
    </div>
</div>

<script type="module">
    import { javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

    const API_URL = `${javaURI}/api/casino/blackjack`;
    let uid = "";
    let personId = null;
    let currentBalance = 0;

    async function fetchUserData() {
        console.log("Fetching user data...");
        try {
            // First get the personId from the user session
            const personResponse = await fetch(`${javaURI}/api/person/get`, fetchOptions);
            if (!personResponse.ok) throw new Error(`Server response: ${personResponse.status}`);

            const personData = await personResponse.json();
            if (!personData || !personData.uid) throw new Error("UID not found in response");

            uid = personData.uid;
            personId = personData.id;
            console.log("UID:", uid, "Person ID:", personId);
            
            // Now fetch bank account data using personId
            const bankResponse = await fetch(`${javaURI}/bank/analytics/person/${personId}`, fetchOptions);
            if (!bankResponse.ok) throw new Error(`Bank data error: ${bankResponse.status}`);
            
            const bankData = await bankResponse.json();
            if (!bankData.success) {
                throw new Error("Failed to load bank data");
            }
            
            currentBalance = Number(bankData.data.balance);
            document.getElementById("balance").innerText = `$${currentBalance.toLocaleString()}`;
            
        } catch (error) {
            console.error("Error fetching user data:", error);
            document.getElementById("gameStatus").innerText = "Error fetching user data. Please log in.";
            document.getElementById("gameStatus").classList.add("text-danger");
        }
    }

    document.addEventListener("DOMContentLoaded", function() {
        fetchUserData();
        
        // Update bet display when user types
        document.getElementById("betAmount").addEventListener("input", function() {
            let betValue = this.value;
            // Allow user to type any value, just update the display
            if (betValue && !isNaN(betValue)) {
                document.getElementById("betValue").innerText = `$${Number(betValue).toLocaleString()}`;
            } else {
                document.getElementById("betValue").innerText = "$0";
            }
        });
    });

    document.getElementById("startGame").addEventListener("click", async function () {
        try {
            await fetchUserData();
            const bet = parseInt(document.getElementById("betAmount").value);
            
            // Check minimum bet requirement
            if (bet < 1000) {
                document.getElementById("gameStatus").innerText = "Sorry, the minimum betting limit is $1,000";
                document.getElementById("gameStatus").className = "fs-5 text-danger";
                return;
            }
            
            if (bet > currentBalance) {
                document.getElementById("gameStatus").innerText = "You don't have enough money for this bet!";
                document.getElementById("gameStatus").className = "fs-5 text-danger";
                return;
            }

            const requestData = { uid, betAmount: bet };

            const response = await fetch(`${API_URL}/start`, {
                ...fetchOptions,
                method: "POST",
                body: JSON.stringify(requestData)
            });

            if (!response.ok) throw new Error("Failed to start game.");
            const data = await response.json();
            updateUI(data);
        } catch (error) {
            document.getElementById("gameStatus").innerText = error.message;
            document.getElementById("gameStatus").className = "fs-5 text-danger";
        }
    });

    document.getElementById("hit").addEventListener("click", async function () {
        try {
            const requestData = { uid };
            const response = await fetch(`${API_URL}/hit`, {
                ...fetchOptions,
                method: "POST",
                body: JSON.stringify(requestData)
            });

            if (!response.ok) throw new Error("Failed to hit.");
            const data = await response.json();
            updateUI(data);
        } catch (error) {
            document.getElementById("gameStatus").innerText = error.message;
            document.getElementById("gameStatus").className = "fs-5 text-danger";
        }
    });

    document.getElementById("stand").addEventListener("click", async function () {
        try {
            const requestData = { uid };
            const response = await fetch(`${API_URL}/stand`, {
                ...fetchOptions,
                method: "POST",
                body: JSON.stringify(requestData)
            });

            if (!response.ok) throw new Error("Failed to stand.");
            const data = await response.json();
            updateUI(data);
        } catch (error) {
            document.getElementById("gameStatus").innerText = error.message;
            document.getElementById("gameStatus").className = "fs-5 text-danger";
        }
    });

    document.getElementById("exit").addEventListener("click", function() {
        window.location.href = "{{site.baseurl}}/gamify";
    });

    function updateUI(data) {
        console.log("API Response:", data);

        let gameState;
        try {
            gameState = typeof data.gameState === "string" ? JSON.parse(data.gameState) : data.gameState;
        } catch (error) {
            console.error("Failed to parse gameState:", error);
            document.getElementById("gameStatus").innerText = "Error processing game state.";
            document.getElementById("gameStatus").className = "fs-5 text-danger";
            return;
        }

        if (!gameState || !gameState.playerHand || !gameState.dealerHand) {
            console.error("Invalid gameState format:", gameState);
            document.getElementById("gameStatus").innerText = "Unexpected response format. Please check the API.";
            document.getElementById("gameStatus").className = "fs-5 text-danger";
            return;
        }

        displayCards(gameState.playerHand, "playerHand");
        displayCards(gameState.dealerHand, "dealerHand");

        // Update balance when game results come back
        if (data.success && data.bank) {
            currentBalance = data.bank.balance;
            document.getElementById("balance").innerText = `$${currentBalance.toLocaleString()}`;
        } else {
            // Refresh the balance from the bank API directly
            fetchUserData();
        }

        // Enable/disable buttons based on game state
        document.getElementById("hit").disabled = data.status === "INACTIVE";
        document.getElementById("stand").disabled = data.status === "INACTIVE";
        document.getElementById("startGame").disabled = data.status === "ACTIVE";

        if (data.status === "INACTIVE") {
            let resultMessage;
            let statusClass;
            if (gameState.result === "WIN") {
                resultMessage = "🎉 You win!";
                statusClass = "fs-5 text-success fw-bold";
            } else if (gameState.result === "LOSE") {
                resultMessage = "💥 You lost!";
                statusClass = "fs-5 text-danger fw-bold";
            } else {
                resultMessage = "🤝 It's a draw!";
                statusClass = "fs-5 text-warning fw-bold";
            }
            document.getElementById("gameStatus").innerText = `${resultMessage} Player: ${gameState.playerScore} | Dealer: ${gameState.dealerScore}`;
            document.getElementById("gameStatus").className = statusClass;
        } else {
            document.getElementById("gameStatus").innerText = `Player: ${gameState.playerScore} | Dealer: ${gameState.dealerScore}`;
            document.getElementById("gameStatus").className = "fs-5";
        }
    }

    function displayCards(cards, elementId) {
        const cardContainer = document.getElementById(elementId);
        cardContainer.innerHTML = "";

        // If it's dealer's hand and game is active, show first card only
        const isDealerHidden = elementId === "dealerHand" && !document.getElementById("hit").disabled;
        
        cards.forEach((card, index) => {
            const cardElement = document.createElement("div");
            cardElement.classList.add("card-display");

            if (isDealerHidden && index > 0) {
                cardElement.innerHTML = "❓";
                cardContainer.appendChild(cardElement);
                return;
            }

            let rank = card.slice(0, -1);
            let suit = card.slice(-1);

            let suitSymbol = "";
            let suitClass = "";
            switch (suit) {
                case "H": suitSymbol = "♥"; suitClass = "hearts"; break;
                case "D": suitSymbol = "♦"; suitClass = "diamonds"; break;
                case "C": suitSymbol = "♣"; suitClass = "clubs"; break;
                case "S": suitSymbol = "♠"; suitClass = "spades"; break;
            }

            cardElement.innerHTML = `<span class="${suitClass}">${rank} ${suitSymbol}</span>`;
            cardContainer.appendChild(cardElement);
        });
    }
</script>
</body>