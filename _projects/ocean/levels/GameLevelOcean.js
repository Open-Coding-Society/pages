
import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import Npc from '@assets/js/GameEnginev1.1/essentials/Npc.js';
import Shark from '@assets/js/GameEnginev1.1/Shark.js';

// SCORE SYSTEM
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
      background: rgba(0,0,0,0.8);
      color: #FFD700;
      padding: 15px 20px;
      border-radius: 8px;
      font-family: Arial;
      font-size: 18px;
      font-weight: bold;
      z-index: 1000;
      border: 2px solid #FFD700;
    `;
    this.updateDisplay();
    document.body.appendChild(this.scoreboard);
  }

  updateDisplay() {
    this.scoreboard.innerHTML = `
      💰 Collected: ${this.coinsCollected}/${this.totalCoins}<br>
      ⭐ Score: ${this.score}
    `;
  }

  collectCoin(points = 10) {
    this.coinsCollected++;
    this.score += points;
    this.updateDisplay();
  }

  deductPoints(points = 10) {
    this.score -= points;
    if (this.score < 0) this.score = 0;
    this.updateDisplay();
  }

  setTotalCoins(count) {
    this.totalCoins = count;
    this.updateDisplay();
  }
}

// GAME LEVEL
class GameLevelOcean {
  constructor(gameEnv) {
    const path = gameEnv.path;
    const width = gameEnv.innerWidth;
    const height = gameEnv.innerHeight;

    gameEnv.gameScorer = new GameScorer(gameEnv);

    // 💥 GLOBAL COLLISION LOCK
    gameEnv.elonHitCooldown = false;

    // BACKGROUND
    const bgData = {
      id: "Water",
      src: path + "/images/projects/ocean/bg/reef.png",
      pixels: { height: 597, width: 340 }
    };

    // PLAYER (OCTOPUS) — NOW HANDLES COLLISION
    const octopusData = {
      id: "Octopus",
      greeting: "Hi I am Octopus!",
      src: path + "/images/projects/ocean/player/octopus.png",
      SCALE_FACTOR: 5,
      ANIMATION_RATE: 100,
      INIT_POSITION: { x: width * 0.7, y: height * 0.6 },
      pixels: { height: 250, width: 167 },
      orientation: { rows: 3, columns: 2 },
      up: { row: 2, start: 0, columns: 2 },
      left: { row: 1, start: 0, columns: 2 },
      right: { row: 1, start: 0, columns: 2 },
      down: { row: 0, start: 0, columns: 2 },
      idle: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.4, heightPercentage: 0.4 },

      // 💥 COLLISION FIX (THIS IS THE IMPORTANT PART)
      update: function () {
        if (!this.gameEnv?.gameObjects) return;

        const enemies = this.gameEnv.gameObjects.filter(
          obj => obj.spriteData?.id?.includes("EnemyElon")
        );

        for (const enemy of enemies) {
          const dx = enemy.position.x - this.position.x;
          const dy = enemy.position.y - this.position.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 40) {
            if (!this.gameEnv.elonHitCooldown) {
              this.gameEnv.elonHitCooldown = true;

              if (this.gameEnv.gameScorer) {
                this.gameEnv.gameScorer.deductPoints(10);
              }

              setTimeout(() => {
                this.gameEnv.elonHitCooldown = false;
              }, 1000);
            }
          }
        }
      }
    };

    // GOLD FISH
    const goldfishBase = {
      src: path + "/images/projects/ocean/npc/gold.png",
      SCALE_FACTOR: 6,
      ANIMATION_RATE: 50,
      pixels: { width: 200, height: 100 },
      orientation: { rows: 1, columns: 2 },
      down: { row: 0, start: 0, columns: 2 },
      hitbox: { widthPercentage: 0.4, heightPercentage: 0.4 }
    };

    const goldfishList = Array.from({ length: 10 }).map((_, i) => ({
      class: Npc,
      data: {
        ...goldfishBase,
        id: `Goldfish${i}`,
        greeting: "+10 Points!",
        INIT_POSITION: {
          x: Math.random() * (width - 100),
          y: Math.random() * (height - 100)
        },
        reaction: function () {
          if (gameEnv.gameScorer) {
            gameEnv.gameScorer.collectCoin(10);
          }
          const fish = gameEnv.gameObjects.find(obj =>
            obj.spriteData?.id === `Goldfish${i}`
          );
          if (fish) fish.destroy();
        }
      }
    }));

    // AI NPC
    const sprite_src_ocean = path + "/images/projects/ocean/npc/wizard.png";
    const sprite_data_ocean = {
      id: "Professor Ocean",
      greeting: "Hello! I'm a wizard! ✨",
      src: sprite_src_ocean,
      SCALE_FACTOR: 3,
      ANIMATION_RATE: 10,
      pixels: { height: 300, width: 300 },
      INIT_POSITION: { x: width * 0.5, y: height * 0.3 },
      orientation: { rows: 1, columns: 1 },
      hitbox: { widthPercentage: 0.2, heightPercentage: 0.3 }
    };

    // ENEMIES (NO MORE SCORING INSIDE THEM)
    const sprite_src_enemy = path + "/images/projects/ocean/npc/elonMusk.png";

    const baseEnemy = {
      src: sprite_src_enemy,
      SCALE_FACTOR: 5,
      ANIMATION_RATE: 0,
      pixels: { height: 256, width: 256 },
      orientation: { rows: 1, columns: 1 },
      hitbox: { widthPercentage: 0.4, heightPercentage: 0.4 },
      zIndex: 10,
      isKilling: false,

      update: function () {
        if (this.isKilling) return;

        const players = this.gameEnv.gameObjects.filter(
          obj => obj.constructor.name === "Player"
        );

        if (players.length === 0) return;

        let nearest = players[0];
        let minDist = Infinity;

        for (const player of players) {
          const dx = player.position.x - this.position.x;
          const dy = player.position.y - this.position.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < minDist) {
            minDist = dist;
            nearest = player;
          }
        }

        const speed = 1.2;
        const dx = nearest.position.x - this.position.x;
        const dy = nearest.position.y - this.position.y;
        const angle = Math.atan2(dy, dx);

        this.position.x += Math.cos(angle) * speed;
        this.position.y += Math.sin(angle) * speed;
      }
    };

    const sprite_data_enemy = { ...baseEnemy, id: "EnemyElon", INIT_POSITION: { x: width * 0.2, y: height * 0.2 } };
    const sprite_data_enemy2 = { ...baseEnemy, id: "EnemyElon2", INIT_POSITION: { x: width * 0.8, y: height * 0.5 } };
    const sprite_data_enemy3 = { ...baseEnemy, id: "EnemyElon3", INIT_POSITION: { x: width * 0.5, y: height * 0.1 } };
    const sprite_data_enemy4 = { ...baseEnemy, id: "EnemyElon4", INIT_POSITION: { x: width * 0.3, y: height * 0.7 } };

    // SHARK
    const sprite_src_shark = path + "/images/projects/ocean/npc/shark.png";

    const sprite_data_shark = {
      id: "SharkEnemy",
      src: sprite_src_shark,
      SCALE_FACTOR: 6,
      ANIMATION_RATE: 0,
      pixels: { height: 256, width: 256 },
      INIT_POSITION: { x: width * 0.6, y: height * 0.9 },
      orientation: { rows: 1, columns: 1 },
      hitbox: { widthPercentage: 0.4, heightPercentage: 0.4 },
      update: function () {
        if (this.isKilling) return;

        const players = this.gameEnv.gameObjects.filter(
          obj => obj.constructor.name === "Player"
        );

        if (players.length === 0) return;

        let nearest = players[0];
        let minDist = Infinity;

        for (const player of players) {
          const dx = player.position.x - this.position.x;
          const dy = player.position.y - this.position.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < minDist) {
            minDist = dist;
            nearest = player;
          }
        }

        const speed = 2.2;
        const dx = nearest.position.x - this.position.x;
        const dy = nearest.position.y - this.position.y;
        const angle = Math.atan2(dy, dx);

        this.position.x += Math.cos(angle) * speed;
        this.position.y += Math.sin(angle) * speed;
      }
    };

    this.classes = [
      { class: GameEnvBackground, data: bgData },
      { class: Player, data: octopusData },
      ...goldfishList,
      { class: Npc, data: sprite_data_ocean },

      { class: Npc, data: sprite_data_enemy },
      { class: Npc, data: sprite_data_enemy2 },
      { class: Npc, data: sprite_data_enemy3 },
      { class: Npc, data: sprite_data_enemy4 },

      { class: Shark, data: sprite_data_shark }
    ];

    gameEnv.gameScorer.setTotalCoins(10);
  }
}

export default GameLevelOcean;