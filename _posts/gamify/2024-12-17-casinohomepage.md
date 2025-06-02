---
layout: fortunefindersCasino
title: Casino Homepage
permalink: /gamify/casinohomepage
---

<style>
    body {
        text-align: center;
        font-family: 'Arial', sans-serif;
        background-size: cover;
        color: white;
        margin: 0;
        padding: 0;
        overflow-x: hidden;
        position: relative;
    }
    .container {
        max-width: 800px;
        margin: 50px auto;
        padding: 20px;
        background-color: rgba(0, 0, 0, 0.85);
        border-radius: 15px;
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.7);
        border: 2px solid #28a745;
        position: relative;
        overflow: hidden;
    }
    .game-boxes {
        display: grid;
        grid-template-columns: 1fr;
        gap: 20px;
    }
    @media (min-width: 600px) {
        .game-boxes {
            grid-template-columns: 1fr 1fr;
        }
    }
    .game-box {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-decoration: none;
        padding: 20px;
        background: linear-gradient(145deg, #000000, #333333);
        color: white;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4);
        border: 2px solid #28a745;
        transition: transform 0.3s, background-color 0.4s, box-shadow 0.3s;
        position: relative;
        overflow: hidden;
        cursor: pointer;
    }
    .game-box:hover {
        background: linear-gradient(145deg, #28a745, #c0392b);
        transform: scale(1.1);
        box-shadow: 0 10px 20px rgba(40, 167, 69, 0.6);
    }
    .leaderboard {
        margin-top: 40px;
        padding: 20px;
        background: rgba(0, 0, 0, 0.8);
        border-radius: 10px;
        border: 2px solid #ffc107;
    }
    
    .floating-symbol {
        position: absolute;
        font-size: 2em;
        opacity: 0.7;
        animation: float 5s infinite ease-in-out;
    }
    @keyframes float {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        50% { transform: translateY(-50px) rotate(180deg); opacity: 0.5; }
        100% { transform: translateY(0) rotate(360deg); opacity: 1; }
    }
</style>

<h1> Casino Homepage </h1>
<div class="container">
    <div class="game-boxes">
        <div class="game-box" onclick="location='./blackjack'">
            <h2>Blackjack</h2>
            <p>Try your hand at beating the dealer!</p>
        </div>
        <div class="game-box" onclick="location='./dices'">
            <h2>Dices</h2>
            <p>Test your luck with the roll of a dice.</p>
        </div>
        <div class="game-box" onclick="location='./mines'">
            <h2>Mines</h2>
            <p>Navigate the board without triggering the mines.</p>
        </div>
        <div class="game-box" onclick="location='./poker'">
            <h2>Poker</h2>
            <p>Challenge your skills in this classic card game.</p>
        </div>
    </div>  
</div>
