---
layout: post
title: Poker Game
permalink: /gamify/poker
---
<style>
    /* Styles the main content area */
    .container {
        font-family: Arial, sans-serif;
        max-width: 400px;
        width: 100%;
        background-color: #2b2b2b;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        color: #fff;
        margin: 20px auto;
    }
    label {
        display: block;
        margin: 10px 0 5px;
        color: #ccc;
    }
    input, button {
        width: 100%;
        padding: 10px;
        margin-bottom: 15px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
    button {
        background-color: #007bff;
        color: #fff;
        border: none;
        cursor: pointer;
    }
    button:hover {
        background-color: #0056b3;
    }
    h2 {
        text-align: center;
        color: #fff;
    }
    .cards-container {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
    }
    .card {
        padding: 10px;
        margin: 5px;
        border-radius: 4px;
        background: linear-gradient(135deg, #f39c12, #e74c3c);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        color: white;
        font-size: 1.2em;
        font-weight: bold;
        text-align: center;
        width: 80px;
        height: 120px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border: 2px solid #fff;
        position: relative;
    }
    .win-message {
        margin-top: 20px;
        font-size: 18px;
        color: #fff;
        text-align: center;
    }
</style>

<div class="container">
    <h2>Poker Game</h2>
    <form id="pokerForm">
        <label for="betAmount">Bet Amount:</label>
        <input type="number" id="betAmount" name="betAmount" required min="500">
        <button type="submit">Play Poker</button>
    </form>
    <div id="cardsDisplay" class="cards-container" style="display: none;"></div>
    <div id="resultMessage" class="win-message" style="display: none;"></div>
</div>

<script type="module">
    import { javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

    document.addEventListener('DOMContentLoaded', () => {
        const pokerForm = document.getElementById('pokerForm');

        pokerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const betAmount = parseFloat(document.getElementById('betAmount').value);
            const options = {
                ...fetchOptions,
                body: JSON.stringify({ bet: betAmount }),
            };

            try {
                const response = await fetch(`${javaURI}/api/casino/poker/play`, options);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                if (result && result.playerHand && result.dealerHand && result.playerWin !== undefined && result.updatedBalance !== undefined) {
                    displayCards(result.playerHand, result.dealerHand);
                    displayResult(result.playerWin, result.updatedBalance);
                } else {
                    alert('Unexpected response format. Please check the API.');
                }
            } catch (error) {
                console.error('Error during fetch:', error);
                alert('An error occurred. Please try again.');
            }
        });
    });

    function displayCards(playerHand, dealerHand) {
        const cardsContainer = document.getElementById('cardsDisplay');
        cardsContainer.style.display = 'flex';
        cardsContainer.innerHTML = '';
        const playerCardElements = playerHand.map(card => `<div class="card">${card.rank} ${card.suit}</div>`).join('');
        const dealerCardElements = dealerHand.map(card => `<div class="card">${card.rank} ${card.suit}</div>`).join('');
        cardsContainer.innerHTML = `
            <div>
                <h3>Your Hand</h3>
                ${playerCardElements}
            </div>
            <div>
                <h3>Dealer's Hand</h3>
                ${dealerCardElements}
            </div>
        `;
    }

    function displayResult(playerWin, updatedBalance) {
        const resultMessage = document.getElementById('resultMessage');
        resultMessage.style.display = 'block';
        const message = playerWin
            ? `You won! 🎉\nUpdated Balance: $${updatedBalance}`
            : `You lost! 😞\nUpdated Balance: $${updatedBalance}`;
        resultMessage.textContent = message;
    }
</script>