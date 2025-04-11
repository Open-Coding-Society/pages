---
layout: finance
title: Blackjack
permalink: /gamify/blackjack
---

<style>
    body {
        font-family: Arial, sans-serif;
        text-align: center;
        background-color: #121212;
        color: white;
    }
    .container {
        width: 40%;
        margin: auto;
        background-color: #222;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0px 0px 10px #fff;
    }
    button {
        background-color: black;
        color: white;
        border: 1px solid white;
        padding: 10px;
        margin: 5px;
        cursor: pointer;
    }
    button:disabled {
        background-color: grey;
        cursor: not-allowed;
    }
    .error {
        color: red;
        font-weight: bold;
    }
    .success {
        color: green;
        font-weight: bold;
    }
    .card {
        display: inline-block;
        width: 50px;
        height: 75px;
        border-radius: 5px;
        border: 2px solid white;
        text-align: center;
        line-height: 75px;
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
    #balance {
        font-size: 1.2em;
        margin-bottom: 15px;
    }
    input[type="number"] {
        width: 100px;
        padding: 8px;
        margin: 5px;
        background-color: #333;
        color: white;
        border: 1px solid white;
    }
</style>

<div class="container">
    <h1>Blackjack Game</h1>
    <div id="balance">Balance: Loading...</div>
    
    <label for="betAmount">Bet Amount (Min: $1,000):</label>
    <input type="number" id="betAmount" min="1000" value="1000" step="1000">
    <span id="betValue">$1,000</span>
    
    <div>
        <button id="startGame">Start Game</button>
        <button id="hit" disabled>Hit</button>
        <button id="stand" disabled>Stand</button>
        <button id="exit">Exit</button>
    </div>
    
    <h2>Dealer's Hand</h2>
    <div id="dealerHand"></div>
    <h2>Your Hand</h2>
    <div id="playerHand"></div>
    <p id="gameStatus"></p>
</div>

<script type="module">
    import { javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

    const API_URL = `${javaURI}/api/casino/blackjack`;
    let uid = "";
    let currentBalance = 0;

    async function getUID() {
        console.log("Fetching UID...");
        try {
            const response = await fetch(`${javaURI}/api/person/get`, fetchOptions);
            if (!response.ok) throw new Error(`Server response: ${response.status}`);

            const data = await response.json();
            if (!data || !data.uid) throw new Error("UID not found in response");

            uid = data.uid;
            currentBalance = data.balanceDouble || 0;
            document.getElementById("balance").innerText = `Balance: $${currentBalance.toLocaleString()}`;
            console.log("UID:", uid);
        } catch (error) {
            console.error("Error fetching UID:", error);
            document.getElementById("gameStatus").innerText = "Error fetching UID. Please log in.";
        }
    }

    document.addEventListener("DOMContentLoaded", function() {
        getUID();
        
        document.getElementById("betAmount").addEventListener("input", function() {
            let betValue = this.value;
            if (betValue < 1000) {
                this.value = 1000;
                betValue = 1000;
            }
            document.getElementById("betValue").innerText = `$${Number(betValue).toLocaleString()}`;
        });
    });

    document.getElementById("startGame").addEventListener("click", async function () {
        try {
            await getUID();
            const bet = parseInt(document.getElementById("betAmount").value);
            
            if (bet > currentBalance) {
                document.getElementById("gameStatus").innerText = "You don't have enough money for this bet!";
                document.getElementById("gameStatus").className = "error";
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
            document.getElementById("gameStatus").className = "error";
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
            document.getElementById("gameStatus").className = "error";
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
            document.getElementById("gameStatus").className = "error";
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
            document.getElementById("gameStatus").className = "error";
            return;
        }

        if (!gameState || !gameState.playerHand || !gameState.dealerHand) {
            console.error("Invalid gameState format:", gameState);
            document.getElementById("gameStatus").innerText = "Unexpected response format. Please check the API.";
            document.getElementById("gameStatus").className = "error";
            return;
        }

        displayCards(gameState.playerHand, "playerHand");
        displayCards(gameState.dealerHand, "dealerHand");

        // Update balance if available
        if (data.balance !== undefined) {
            currentBalance = data.balance;
            document.getElementById("balance").innerText = `Balance: $${currentBalance.toLocaleString()}`;
        }

        // Enable/disable buttons based on game state
        document.getElementById("hit").disabled = data.status === "INACTIVE";
        document.getElementById("stand").disabled = data.status === "INACTIVE";
        document.getElementById("startGame").disabled = data.status === "ACTIVE";

        if (data.status === "INACTIVE") {
            let resultMessage;
            if (gameState.result === "WIN") {
                resultMessage = "🎉 You win!";
                document.getElementById("gameStatus").className = "success";
            } else if (gameState.result === "LOSE") {
                resultMessage = "💥 You lost!";
                document.getElementById("gameStatus").className = "error";
            } else {
                resultMessage = "🤝 It's a draw!";
                document.getElementById("gameStatus").className = "";
            }
            document.getElementById("gameStatus").innerText = `${resultMessage} Player: ${gameState.playerScore} | Dealer: ${gameState.dealerScore}`;
        } else {
            document.getElementById("gameStatus").innerText = `Player: ${gameState.playerScore} | Dealer: ${gameState.dealerScore}`;
            document.getElementById("gameStatus").className = "";
        }
    }

    function displayCards(cards, elementId) {
        const cardContainer = document.getElementById(elementId);
        cardContainer.innerHTML = "";

        // If it's dealer's hand and game is active, show first card only
        const isDealerHidden = elementId === "dealerHand" && !document.getElementById("hit").disabled;
        
        cards.forEach((card, index) => {
            const cardElement = document.createElement("div");
            cardElement.classList.add("card");

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