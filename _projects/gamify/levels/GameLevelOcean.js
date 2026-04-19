import GameEnvBackground from '/assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1.1/essentials/Player.js';
import Npc from '/assets/js/GameEnginev1.1/essentials/Npc.js';
import GameControl from '/assets/js/GameEnginev1.1/essentials/GameControl.js';
import AiNpc from '/assets/js/GameEnginev1.1/essentials/AiNpc.js';




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
   if (this.score < 0) {
     this.score = 0;
   }
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


   // Background
   const bgData = {
     id: "Water",
     src: path + "/images/projects/gamify/water/reef.png",
     pixels: { height: 597, width: 340 }
   };


   // Player
   const octopusData = {
     id: "Octopus",
     greeting: "Hi I am Octopus!",
     src: path + "/images/projects/gamify/water/octopus.png",
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
     hitbox: { widthPercentage: 0.4, heightPercentage: 0.4 }
   };


   // Goldfish Template
   const goldfishBase = {
     src: path + "/images/projects/gamify/water/gold.png",
     SCALE_FACTOR: 6,
     ANIMATION_RATE: 50,
     pixels: { width: 200, height: 100 },
     orientation: { rows: 1, columns: 2 },
     down: { row: 0, start: 0, columns: 2 },
     hitbox: { widthPercentage: 0.4, heightPercentage: 0.4 }
   };


   // GOLD FISH
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
           obj.spriteData && obj.spriteData.id === `Goldfish${i}`
         );


         if (fish) {
           fish.destroy();
         }
       }
     }
   }));


   // AI NPC
   const sprite_src_ocean = path + "/images/projects/gamify/water/wizard.png";


   const sprite_data_ocean = {
     id: "Professor Ocean",
     greeting: "Hello! I'm a wizard! ✨",
     src: sprite_src_ocean,
     SCALE_FACTOR: 3,
     ANIMATION_RATE: 10,
     pixels: { height: 300, width: 300 },
     INIT_POSITION: { x: width * 0.5, y: height * 0.3 },
     orientation: { rows: 1, columns: 1 },


     down: { row: 0, start: 0, columns: 1 },
     up: { row: 0, start: 0, columns: 1 },
     left: { row: 0, start: 0, columns: 1 },
     right: { row: 0, start: 0, columns: 1 },


     hitbox: { widthPercentage: 0.2, heightPercentage: 0.3 },


     expertise: "ocean",
     chatHistory: [],


     dialogues: [
       "Ask me anything about the ocean!",
       "I know all about sea creatures 🌊",
       "Do you want to learn about marine life?",
       "The ocean is full of amazing mysteries!",
       "Let’s explore the deep sea together!"
     ],


     knowledgeBase: {
       ocean: [
         {
           question: "What is the ocean?",
           answer: "The ocean covers about 71% of Earth!"
         },
         {
           question: "What lives in the ocean?",
           answer: "Millions of species including fish, whales, sharks, and coral!"
         }
       ]
     },


     reaction: function () {
       if (this.dialogueSystem) {
         this.showReactionDialogue();
       }
     },


     interact: function () {
       AiNpc.showInteraction(this);
     }
   };


   // ENEMY
   const sprite_src_enemy = path + "/images/projects/gamify/water/elonMusk.png";


   const sprite_data_enemy = {
     id: "EnemyElon",
     greeting: "You feel a dark presence…",
     src: sprite_src_enemy,
     SCALE_FACTOR: 5,
     ANIMATION_RATE: 0,
     pixels: { height: 256, width: 256 },
     INIT_POSITION: { x: width * 0.2, y: height * 0.2 },
     orientation: { rows: 1, columns: 1 },
     down: { row: 0, start: 0, columns: 1 },
     hitbox: { widthPercentage: 0.4, heightPercentage: 0.4 },
     zIndex: 10,
     isKilling: false,
     hasReacted: false,


     expertise: "chaos",
     chatHistory: [],


     dialogues: [
       "I'm taking over the world! 🌍",
       "Your tweets are no match for me!",
       "The future is mine!",
       "I'll catch you eventually!",
       "You can't escape me!"
     ],


     knowledgeBase: {
       chaos: [
         {
           question: "Who are you?",
           answer: "I am the villain of this realm! Beware my wrath!"
         },
         {
           question: "What do you want?",
           answer: "I want to chase you across all the oceans!"
         }
       ]
     },


     reaction: function () {
       if (!this.hasReacted && gameEnv.gameScorer) {
         gameEnv.gameScorer.deductPoints(10);
         this.hasReacted = true;
         setTimeout(() => {
           this.hasReacted = false;
         }, 500);
       }
     },


     interact: function () {
       AiNpc.showInteraction(this);
     },


     update: function () {
       if (this.isKilling) return;


       const players = this.gameEnv.gameObjects.filter(obj =>
         obj.constructor.name === 'Player'
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


       if (minDist < 40) {
         this.isKilling = true;


         const self = this.gameEnv;


         setTimeout(() => {
           if (self && self.timerInterval) {
             clearInterval(self.timerInterval);
           }
           location.reload();
         }, 2000);
       }
     }
   };


   // ENEMY 2
   const sprite_data_enemy2 = {
     ...sprite_data_enemy,
     id: "EnemyElon2",
     INIT_POSITION: { x: width * 0.8, y: height * 0.5 }
   };


   // ENEMY 3
   const sprite_data_enemy3 = {
     ...sprite_data_enemy,
     id: "EnemyElon3",
     INIT_POSITION: { x: width * 0.5, y: height * 0.1 }
   };


   // ENEMY 4
   const sprite_data_enemy4 = {
     ...sprite_data_enemy,
     id: "EnemyElon4",
     INIT_POSITION: { x: width * 0.3, y: height * 0.7 }
   };


   // LEVEL OBJECTS
   this.classes = [
     { class: GameEnvBackground, data: bgData },
     { class: Player, data: octopusData },
     ...goldfishList,
     { class: Npc, data: sprite_data_ocean },
     { class: Npc, data: sprite_data_enemy },
     { class: Npc, data: sprite_data_enemy2 },
     { class: Npc, data: sprite_data_enemy3 },
     { class: Npc, data: sprite_data_enemy4 }
   ];


   gameEnv.gameScorer.setTotalCoins(10);
 }
}


export default GameLevelOcean;




