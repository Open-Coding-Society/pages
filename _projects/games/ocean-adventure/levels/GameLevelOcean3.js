import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import Npc from '@assets/js/GameEnginev1.1/essentials/Npc.js';
import Barrier from '@assets/js/GameEnginev1.1/essentials/Barrier.js';
import SplineBarrier from '@assets/js/projects/ocean-adventure/levels/SplineBarrier.js';
import Shark from '@assets/js/GameEnginev1.1/Shark.js';

// Leaderboard Manager
class LeaderboardManager {
  constructor() {
    this.storageKey = 'oceanGameLeaderboard';
    this.maxScores = 10;
  }

  addScore(playerName, score) {
    let leaderboard = this.getLeaderboard();
    leaderboard.push({ playerName, score, date: new Date().toISOString() });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, this.maxScores);
    localStorage.setItem(this.storageKey, JSON.stringify(leaderboard));
    return leaderboard;
  }

  getLeaderboard() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  displayLeaderboard() {
    const leaderboard = this.getLeaderboard();
    let html = '<div style="background: rgba(0,0,0,0.8); color: #FFD700; padding: 15px; border-radius: 8px; font-family: Arial, sans-serif;">';
    html += '<h3 style="margin-top: 0; text-align: center;"> LEADERBOARD </h3>';
    if (leaderboard.length === 0) {
      html += '<p style="text-align: center;">No scores yet. Be the first!</p>';
    } else {
      html += '<ol style="margin: 10px 0; padding-left: 20px;">';
      leaderboard.forEach((entry, index) => {
        html += `<li>${entry.playerName}: <strong>${entry.score}</strong> pts</li>`;
      });
      html += '</ol>';
    }
    html += '</div>';
    return html;
  }
}

// Game Scoring System
class GameScorer {
  constructor(gameEnv) {
    this.gameEnv = gameEnv;
    this.score = 0;
    this.coinsCollected = 0;
    this.totalCoins = 0;
    this.scoreboard = null;
    this.createScoreboard();
  }

  createScoreboard() {
    this.scoreboard = document.createElement('div');
    this.scoreboard.id = 'game-scoreboard';
    this.scoreboard.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: #FFD700;
      padding: 15px 20px;
      border-radius: 8px;
      font-family: Arial, sans-serif;
      font-size: 18px;
      font-weight: bold;
      z-index: 1000;
      border: 2px solid #FFD700;
    `;
    this.updateDisplay();
    document.body.appendChild(this.scoreboard);
  }

  updateDisplay() {
    if (this.scoreboard) {
      this.scoreboard.innerHTML = `
        💰 Coins: ${this.coinsCollected}/${this.totalCoins}<br>
        ⭐ Score: ${this.score}
      `;
    }
  }

  collectCoin(points = 10) {
    this.coinsCollected++;
    this.score += points;
    this.updateDisplay();
  }

  setTotalCoins(count) {
    this.totalCoins = count;
    this.updateDisplay();
  }

  finalizeScore(playerName = 'Player') {
    const leaderboard = new LeaderboardManager();
    leaderboard.addScore(playerName, this.score);
    return this.score;
  }

  destroy() {
    if (this.scoreboard && this.scoreboard.parentNode) {
      this.scoreboard.parentNode.removeChild(this.scoreboard);
    }
  }
}

class GameLevelOcean3 {

  constructor(gameEnv) {

    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    console.log("Initializing GameLevelOcean3 with dimensions:", width, height);

    // Initialize scoring system
    gameEnv.gameScorer = new GameScorer(gameEnv);

    // Background
    const bgData = {
        name: 'ocean',
        src: path + "/images/projects/ocean-adventure/bg/space.png",
        pixels: { height: 1200, width: 857 }
    };

    // Player (FIXED)
    const sprite_data_octopus = {
        id: 'Octopus',
        src: path + "/images/projects/ocean-adventure/player/octopus.png",

        SCALE_FACTOR: 7,
        STEP_FACTOR: 400, // CRITICAL FIX
        ANIMATION_RATE: 50,

        INIT_POSITION: { x: 100, y: height - (height/5) },

        pixels: { height: 250, width: 167 },

        orientation: { rows: 3, columns: 2 },
        down: { row: 0, start: 0, columns: 2 },
        left: { row: 1, start: 0, columns: 2 },
        right: { row: 1, start: 0, columns: 2 },
        up: { row: 2, start: 0, columns: 2 },

        hitbox: { widthPercentage: 0.35, heightPercentage: 0.35 },

        keypress: { up: 87, left: 65, down: 83, right: 68 }
    };

    // Goal
    const sprite_data_goldfish = {
        id: 'Goldfish',
        greeting: "You escaped!",
        src: path + "/images/projects/ocean-adventure/npc/gold.png",

        SCALE_FACTOR: 6,
        ANIMATION_RATE: 50,

        INIT_POSITION: { x: width * 0.75, y: height * 0.2 },

        pixels: { width: 200, height: 100 },

        orientation: { rows: 1, columns: 2 },
        down: { row: 0, start: 0, columns: 2 },

        hitbox: { widthPercentage: 0.3, heightPercentage: 0.4 }
    };

    // Coins (collectibles for points)
    const sprite_data_coin = {
        id: 'Coin',
        src: path + "/images/projects/ocean-adventure/npc/gold.png", // Using gold image for coin
        SCALE_FACTOR: 8,
        ANIMATION_RATE: 50,
        pixels: { width: 200, height: 100 },
        orientation: { rows: 1, columns: 2 },
        down: { row: 0, start: 0, columns: 2 },
        hitbox: { widthPercentage: 0.4, heightPercentage: 0.4 }
    };

    // Coin positions throughout the maze
    const coinPositions = [
        { x: width * 0.3, y: height * 0.3 },
        { x: width * 0.5, y: height * 0.25 },
        { x: width * 0.35, y: height * 0.5 },
        { x: width * 0.65, y: height * 0.4 },
        { x: width * 0.4, y: height * 0.65 },
        { x: width * 0.7, y: height * 0.6 }
    ];

    // Shark
    const sprite_data_shark = {
        id: 'Shark',
        src: path + "/images/projects/ocean-adventure/npc/shark.png",

        SCALE_FACTOR: 5,
        ANIMATION_RATE: 100,

        pixels: { height: 225, width: 225 },

        INIT_POSITION: { x: width * 0.5, y: height * 0.5 },

        orientation: { rows: 1, columns: 1 },
        down: { row: 0, start: 0, columns: 1 },

        hitbox: { widthPercentage: 0.3, heightPercentage: 0.5 }
    };

    // SPLINE BARRIERS - Curved barriers around transparent blocks
    const splineBarriers = [
        // Top wall - horizontal curve
        {
            id: 'spline-top',
            splinePoints: [
                { x: 0.2 * width, y: 0.15 * height },
                { x: 0.4 * width, y: 0.12 * height },
                { x: 0.6 * width, y: 0.13 * height },
                { x: 0.8 * width, y: 0.15 * height }
            ],
            visible: true,
            color: '#0096FF',
            lineWidth: 8
        },
        // Bottom wall - horizontal curve
        {
            id: 'spline-bottom',
            splinePoints: [
                { x: 0.2 * width, y: 0.83 * height },
                { x: 0.4 * width, y: 0.86 * height },
                { x: 0.6 * width, y: 0.85 * height },
                { x: 0.8 * width, y: 0.83 * height }
            ],
            visible: true,
            color: '#0096FF',
            lineWidth: 8
        },
        // Left top wall - vertical curve
        {
            id: 'spline-leftTop',
            splinePoints: [
                { x: 0.2 * width, y: 0.15 * height },
                { x: 0.17 * width, y: 0.22 * height },
                { x: 0.18 * width, y: 0.30 * height },
                { x: 0.2 * width, y: 0.35 * height }
            ],
            visible: true,
            color: '#0096FF',
            lineWidth: 8
        },
        // Left bottom wall - vertical curve
        {
            id: 'spline-leftBottom',
            splinePoints: [
                { x: 0.2 * width, y: 0.55 * height },
                { x: 0.17 * width, y: 0.63 * height },
                { x: 0.18 * width, y: 0.72 * height },
                { x: 0.2 * width, y: 0.85 * height }
            ],
            visible: true,
            color: '#0096FF',
            lineWidth: 8
        },
        // Right wall - vertical curve
        {
            id: 'spline-right',
            splinePoints: [
                { x: 0.78 * width, y: 0.15 * height },
                { x: 0.81 * width, y: 0.30 * height },
                { x: 0.81 * width, y: 0.50 * height },
                { x: 0.78 * width, y: 0.85 * height }
            ],
            visible: true,
            color: '#0096FF',
            lineWidth: 8
        },
        // Interior wall w1 - vertical curve
        {
            id: 'spline-w1',
            splinePoints: [
                { x: 0.3 * width, y: 0.25 * height },
                { x: 0.27 * width, y: 0.32 * height },
                { x: 0.28 * width, y: 0.42 * height },
                { x: 0.3 * width, y: 0.55 * height }
            ],
            visible: true,
            color: '#0096FF',
            lineWidth: 8
        },
        // Interior wall w2 - horizontal curve
        {
            id: 'spline-w2',
            splinePoints: [
                { x: 0.45 * width, y: 0.35 * height },
                { x: 0.55 * width, y: 0.32 * height },
                { x: 0.65 * width, y: 0.33 * height },
                { x: 0.7 * width, y: 0.35 * height }
            ],
            visible: true,
            color: '#0096FF',
            lineWidth: 8
        },
        // Interior wall w3 - vertical curve
        {
            id: 'spline-w3',
            splinePoints: [
                { x: 0.45 * width, y: 0.55 * height },
                { x: 0.42 * width, y: 0.62 * height },
                { x: 0.43 * width, y: 0.67 * height },
                { x: 0.45 * width, y: 0.75 * height }
            ],
            visible: true,
            color: '#0096FF',
            lineWidth: 8
        },
        // Interior wall w4 - horizontal curve
        {
            id: 'spline-w4',
            splinePoints: [
                { x: 0.55 * width, y: 0.45 * height },
                { x: 0.60 * width, y: 0.42 * height },
                { x: 0.65 * width, y: 0.43 * height },
                { x: 0.7 * width, y: 0.45 * height }
            ],
            visible: true,
            color: '#0096FF',
            lineWidth: 8
        },
        // Interior wall w5 - vertical curve
        {
            id: 'spline-w5',
            splinePoints: [
                { x: 0.6 * width, y: 0.25 * height },
                { x: 0.57 * width, y: 0.35 * height },
                { x: 0.58 * width, y: 0.45 * height },
                { x: 0.6 * width, y: 0.6 * height }
            ],
            visible: true,
            color: '#0096FF',
            lineWidth: 8
        }
    ];

    this.classes = [
      { class: GameEnvBackground, data: bgData },
      { class: Player, data: sprite_data_octopus },
      { class: Shark, data: sprite_data_shark },
      { class: Npc, data: sprite_data_goldfish },

      // Add coins to the game
      ...coinPositions.map((pos, index) => ({
        class: Npc,
        data: {
          ...sprite_data_coin,
          id: `Coin${index}`,
          INIT_POSITION: pos,
          greeting: "+10 Points!",
          reaction: function() {
            if (gameEnv.gameScorer) {
              gameEnv.gameScorer.collectCoin(10);
            }
            // Find and remove the coin from game after collection
            const coinNpc = gameEnv.gameObjects.find(obj => 
              obj.spriteData && obj.spriteData.id === `Coin${index}`
            );
            if (coinNpc) {
              coinNpc.destroy();
            }
          },
          interact: function(player, npc) {
            if (gameEnv.gameScorer) {
              gameEnv.gameScorer.collectCoin(10);
            }
            // Remove the coin from game after collection
            this.destroy();
          }
        }
      })),

      // Add spline barriers around transparent blocks
      ...splineBarriers.map(sb => ({ class: SplineBarrier, data: sb }))
    ];

    // Set total coins in the scoreboard
    if (gameEnv.gameScorer) {
      gameEnv.gameScorer.setTotalCoins(coinPositions.length);
    }
  }
}

export default GameLevelOcean3;