import GameEnvBackground from './essentials/GameEnvBackground.js';
import Player from './essentials/Player.js';
import Npc from './essentials/Npc.js';
import Barrier from './essentials/Barrier.js';
import Shark from './Shark.js';

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
    html += '<h3 style="margin-top: 0; text-align: center;">🏆 LEADERBOARD 🏆</h3>';
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

class GameLevelOcean {

  constructor(gameEnv) {

    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    // Initialize scoring system
    gameEnv.gameScorer = new GameScorer(gameEnv);

    // Background
    const bgData = {
        name: 'ocean',
        src: path + "/images/gamify/water/space.png",
        pixels: { height: 1200, width: 857 }
    };

    // Player (FIXED)
    const sprite_data_octopus = {
        id: 'Octopus',
        src: path + "/images/gamify/water/octopus.png",

        SCALE_FACTOR: 5,
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
        src: path + "/images/gamify/water/gold.png",

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
        src: path + "/images/gamify/water/gold.png", // Using gold image for coin
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
        src: path + "/images/gamify/water/shark.png",

        SCALE_FACTOR: 5,
        ANIMATION_RATE: 100,

        pixels: { height: 225, width: 225 },

        INIT_POSITION: { x: width * 0.5, y: height * 0.5 },

        orientation: { rows: 1, columns: 1 },
        down: { row: 0, start: 0, columns: 1 },

        hitbox: { widthPercentage: 0.3, heightPercentage: 0.5 }
    };

    // WALLS (REAL FIX APPLIED)
    const wallStyle = {
        color: 'rgba(0,150,255,0.5)',
        visible: true,
        collidable: true, //  IMPORTANT
        hitbox: { widthPercentage: 1.0, heightPercentage: 1.0 }
    };

    const mazeWalls = [
        { id:'top', x:0.2, y:0.15, width:0.6, height:0.02 },
        { id:'bottom', x:0.2, y:0.83, width:0.6, height:0.02 },

        { id:'leftTop', x:0.2, y:0.15, width:0.02, height:0.20 },
        { id:'leftBottom', x:0.2, y:0.55, width:0.02, height:0.30 },
        { id:'right', x:0.78, y:0.15, width:0.02, height:0.7 },

        { id:'w1', x:0.3, y:0.25, width:0.02, height:0.3 },
        { id:'w2', x:0.45, y:0.35, width:0.25, height:0.02 },
        { id:'w3', x:0.45, y:0.55, width:0.02, height:0.2 },
        { id:'w4', x:0.55, y:0.45, width:0.15, height:0.02 },
        { id:'w5', x:0.6, y:0.25, width:0.02, height:0.35 }
    ].map(w => ({ ...w, ...wallStyle }));

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

      ...mazeWalls.map(w => ({ class: Barrier, data: w }))
    ];

    // Set total coins in the scoreboard
    if (gameEnv.gameScorer) {
      gameEnv.gameScorer.setTotalCoins(coinPositions.length);
    }
  }
}

export default GameLevelOcean;