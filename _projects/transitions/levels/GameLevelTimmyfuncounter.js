import GameEnvBackground from './essentials/GameEnvBackground.js';
import Player from './essentials/Player.js';
import Npc from './essentials/Npc.js';
import Barrier from './essentials/Barrier.js';

class GameLevelTimmyfuncounter {
    constructor(gameEnv) {
        this.gameEnv = gameEnv;
        const path = gameEnv.path;
        const width = gameEnv.innerWidth;
        const height = gameEnv.innerHeight;

        const bgData = {
            name: "custom_bg",
            src: path + "/images/gamebuilder/bg/blackandwhite.jpg",
            pixels: { height: 720, width: 1280 }
        };

        const playerData = {
            id: 'playerData',
            src: path + "/images/gamebuilder/sprites/kirby.png",
            SCALE_FACTOR: 8,
            STEP_FACTOR: 1000,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: 60, y: 278 },
            pixels: { height: 36, width: 569 },
            orientation: { rows: 1, columns: 13 },
            down: { row: 0, start: 0, columns: 3 },
            left: { row: 0, start: 0, columns: 3 },
            right: { row: 0, start: 0, columns: 3 },
            up: { row: 0, start: 0, columns: 3 },
            hitbox: { widthPercentage: 0.2, heightPercentage: 0.2 },
            keypress: { up: 87, left: 65, down: 83, right: 68 }
        };

        const music = new Audio(path + "/assets/audio/SubwaySurfers.mp3");
        music.loop = true;
        music.volume = 0.5;

        const npcData3 = {
            id: 'Popcorn',
            greeting: '"You won!"',
            src: path + "/images/gamebuilder/sprites/doorpopcorn.png",
            SCALE_FACTOR: 4,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: 1500, y: 100 },
            pixels: { height: 400, width: 430 },
            orientation: { rows: 1, columns: 1 },
            down: { row: 0, start: 0, columns: 1 },
            hitbox: { widthPercentage: 0.1, heightPercentage: 0.1 },
            dialogues: [],
            interact: function() { 
                if (this.dialogueSystem) { 
                    this.showRandomDialogue(); 
                }
                if (!this.listenerAdded) {
                    this.listenerAdded = true; 
                    document.addEventListener("keydown", (e) => {
                        if (e.key.toLowerCase() === "e") {
                            window.location.href = "timmyhooray.html";
                        }
                    });
                }
            }
        };

        const npcData1 = {
            id: 'Garret',
            greeting: '"Catch me if you can!"',
            src: path + "/images/gamebuilder/sprites/Garret2.png",
            SCALE_FACTOR: 4,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: width - 250, y: height / 2 }, 
            pixels: { height: 523, width: 477 },
            orientation: { rows: 1, columns: 1 },
            down: { row: 0, start: 0, columns: 1 },
            hitbox: { widthPercentage: 0.4, heightPercentage: 0.6 },
            dialogues: ['"Good luck! You will need it..."'],
            interact: () => {
                if (window.isPaused) return; 
                clearInterval(window.gameTimerInterval);
                if (window.currentSteps <= window.stepGoal) {
                    window.hoorayLevelRef.saveToLeaderboard(window.currentSteps);
                    alert(`🎉 SUCCESS! You caught Garrett in ${window.currentSteps} steps! Use the popcorn to leave.`);
                } else {
                    alert(`TOO SLOW! You took ${window.currentSteps} steps.`);
                }
                location.reload();
            }
        };

        const mazeWalls = [
            { x: 0, y: 0, width: width, height: 20 },
            { x: 0, y: height - 20, width: width, height: 20 },
            { x: width * 0.2, y: 0, width: 20, height: height * 0.6 },
            { x: width * 0.4, y: height * 0.4, width: 20, height: height * 0.6 },
            { x: width * 0.6, y: 0, width: 20, height: height * 0.6 },
            { x: width * 0.8, y: height * 0.4, width: 20, height: height * 0.6 }
        ];

        const wallClasses = mazeWalls.map(wall => ({
            class: Barrier,
            data: { id: "wall_" + Math.random(), x: wall.x, y: wall.y, width: wall.width, height: wall.height, visible: false }
        }));

        window.addEventListener("load", () => {
            alert("Catch Garrett! 10 seconds starts now!");
            music.play().catch(e => console.log("Audio blocked"));

            const STEP_GOAL = 300;
            window.currentSteps = 0;
            window.stepGoal = STEP_GOAL;
            window.timeLeft = 10;
            window.isPaused = false;

            // --- Injecting Dynamic CSS for Animations ---
            const styleSheet = document.createElement("style");
            styleSheet.textContent = `
                @keyframes flash {
                    0% { opacity: 1; }
                    50% { opacity: 0.1; }
                    100% { opacity: 1; }
                }
                .flashing-text {
                    animation: flash 1s infinite;
                    font-size: 1.5rem;
                    color: #ffd700;
                    margin-bottom: 30px;
                    font-family: 'Courier New', Courier, monospace;
                    font-weight: bold;
                    letter-spacing: 2px;
                }
                .huge-game-over {
                    font-size: 10rem;
                    margin: 0;
                    color: #ff0000;
                    text-shadow: 0 0 20px #ff0000, 0 0 40px #8b0000;
                    font-family: 'Arial Black', sans-serif;
                    font-weight: 900;
                    letter-spacing: -5px;
                }
            `;
            document.head.appendChild(styleSheet);

            // --- UI Container: Bottom Middle HUD ---
            const hudContainer = document.createElement("div");
            hudContainer.style.cssText = "position:fixed; bottom:20px; left:50%; transform:translateX(-50%); display:flex; gap:15px; z-index:10000; align-items:center;";
            document.body.appendChild(hudContainer);

            const stepCounterEl = document.createElement("div");
            stepCounterEl.style.cssText = "color:white; font-size:24px; font-family:Arial; background:rgba(0,0,0,0.8); padding:10px 20px; border-radius:10px; border: 2px solid #ffd700;";
            stepCounterEl.textContent = `Steps: 0 / ${STEP_GOAL}`;
            hudContainer.appendChild(stepCounterEl);

            const timerEl = document.createElement("div");
            timerEl.style.cssText = "color:white; font-size:24px; font-family:monospace; background:rgba(255,0,0,0.8); padding:10px 20px; border-radius:10px; border: 2px solid white;";
            timerEl.textContent = `Time: ${window.timeLeft}s`;
            hudContainer.appendChild(timerEl);

            const menuBtn = document.createElement("button");
            menuBtn.textContent = "⚙️ MENU";
            menuBtn.style.cssText = "position:fixed; bottom:20px; right:20px; z-index:10001; padding:12px 20px; cursor:pointer; background:#4CAF50; border:2px solid black; border-radius:8px; font-weight:bold;";
            document.body.appendChild(menuBtn);

            const menuPanel = document.createElement("div");
            menuPanel.id = "game-menu-panel";
            menuPanel.style.cssText = "position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); width:300px; background:rgba(20,20,20,0.95); color:white; padding:30px; border-radius:15px; display:none; z-index:10005; border:3px solid #ffd700; text-align:center; font-family:Arial;";
            menuPanel.innerHTML = `
                <h2 style='margin-top:0; color:#ffd700;'>GAME PAUSED</h2>
                <button id='resume-btn' style='width:100%; padding:12px; margin:10px 0; cursor:pointer; background:#4CAF50; color:white; border:none; border-radius:5px; font-weight:bold;'>▶ RESUME</button>
                <button id='lb-btn' style='width:100%; padding:12px; margin:10px 0; cursor:pointer; background:#2196F3; color:white; border:none; border-radius:5px; font-weight:bold;'>🏆 LEADERBOARD</button>
            `;
            document.body.appendChild(menuPanel);


            const lossOverlay = document.createElement("div");
            lossOverlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.95); display:none; justify-content:center; align-items:center; z-index:20000; flex-direction:column; text-align:center;";
            lossOverlay.innerHTML = `
                <h1 class="huge-game-over">GAME OVER</h1>
                <p class="flashing-text">CLICK BELOW TO RESTART SYSTEM</p>
                <button onclick="location.reload()" style="
                    padding:20px 40px; 
                    cursor:pointer; 
                    background:#ff0000; 
                    color:white; 
                    border:4px solid white; 
                    font-size:80px; 
                    font-family:'Arial Black'; 
                    border-radius:10px; 
                    box-shadow: 0 0 20px rgba(255,0,0,0.6);
                ">TRY AGAIN</button>
            `;
            document.body.appendChild(lossOverlay);

            const toggleMenu = () => {
                window.isPaused = !window.isPaused;
                menuPanel.style.display = window.isPaused ? "block" : "none";
                if (window.isPaused) music.pause();
                else music.play();
            };

            menuBtn.onclick = toggleMenu;
            document.getElementById('resume-btn').onclick = toggleMenu;
            document.getElementById('lb-btn').onclick = () => {
                this.updateLeaderboardDisplay();
                document.getElementById("leaderboard-panel").style.display = "block";
            };

            window.gameTimerInterval = setInterval(() => {
                if (!window.isPaused) {
                    window.timeLeft--;
                    timerEl.textContent = `Time: ${window.timeLeft}s`;
                    if (window.timeLeft <= 5) timerEl.style.borderColor = "red";
                    if (window.timeLeft <= 0) {
                        clearInterval(window.gameTimerInterval);
                        lossOverlay.style.display = "flex";
                        music.pause();
                    }
                }
            }, 1000);

            document.addEventListener("keydown", (e) => {
                if (window.isPaused) {
                    e.stopImmediatePropagation(); 
                    return; 
                }
                const movementKeys = [87, 65, 83, 68];
                if (movementKeys.includes(e.keyCode)) {
                    window.currentSteps++;
                    stepCounterEl.textContent = `Steps: ${window.currentSteps} / ${STEP_GOAL}`;
                }
            });
        });

        this.classes = [
            { class: GameEnvBackground, data: bgData },
            { class: Player, data: playerData },
            { class: Npc, data: npcData3 },
            { class: Npc, data: npcData1 },
            ...wallClasses
        ];

        window.hoorayLevelRef = this;
    }

    saveToLeaderboard(steps) {
        let scores = JSON.parse(localStorage.getItem("mazeScores")) || [];
        scores.push({ steps: steps, date: new Date().toLocaleTimeString() });
        scores.sort((a, b) => a.steps - b.steps);
        scores = scores.slice(0, 5); 
        localStorage.setItem("mazeScores", JSON.stringify(scores));
    }

    updateLeaderboardDisplay() {
        let panel = document.getElementById("leaderboard-panel");
        if (!panel) {
            panel = document.createElement("div");
            panel.id = "leaderboard-panel";
            panel.style.cssText = "position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); width:320px; background:rgba(10,10,10,0.98); color:white; padding:20px; border-radius:15px; display:none; z-index:10010; font-family:Arial; border:3px solid #ffd700; text-align:center;";
            document.body.appendChild(panel);
        }
        const scores = JSON.parse(localStorage.getItem("mazeScores")) || [];
        let html = "<h2 style='color:#ffd700;'>🏆 Top 5 Runs</h2>";
        scores.forEach((s, i) => {
            html += `<p>${i + 1}. <b>${s.steps} steps</b></p>`;
        });
        html += "<button id='close-lb' style='margin-top:10px; cursor:pointer; padding:5px 15px;'>Close</button>";
        panel.innerHTML = html;
        document.getElementById("close-lb").onclick = () => panel.style.display = "none";
    }
}

export default GameLevelTimmyfuncounter;