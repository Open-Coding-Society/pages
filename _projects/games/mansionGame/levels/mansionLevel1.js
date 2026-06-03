import GameEnvBackground from "@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js";
import Player from "@assets/js/GameEnginev1.1/essentials/Player.js";
import Npc from "@assets/js/GameEnginev1.1/essentials/Npc.js";
import DialogueSystem from "@assets/js/GameEnginev1.1/essentials/DialogueSystem.js";
import MansionLevelMain from "./mansionLevelMain.js";


class MansionLevel1 {
    constructor(gameEnv) {
        const width = gameEnv.innerWidth;
        const height = gameEnv.innerHeight;
        const path = gameEnv.path;


        this.gameEnv = gameEnv;
        this.nextUnlockedLevelKey = "mansionGame_level2_unlocked";
        this.levelState = {
            collectedArtifacts: new Set(),
            artifactIds: ["sun_idol", "ancient_scroll", "desert_gem"],
            rewardClaimed: false,
            timeLeft: 45 
        };

        this.gameStarted = false; 

        this.bgMusic = null; 
        this.audioVolume = 2.0; 
        this.fetchSpookyMusic();


        const backgroundData = {
            name: "mummy_tomb",
            greeting: "Search the tomb for offerings to trade with the mummy.",
            src: path + "/images/projects/mansionGame/mummy1.png",
            pixels: { height: 580, width: 1038 },
            mode: "contain"
        };

       
        const sprite_src_mc = path + "/images/projects/mansionGame/spookMcWalk.png";
        const MC_SCALE_FACTOR = 6;
        
        this.playerStartPosition = { x: 50, y: height - (height / MC_SCALE_FACTOR) };

        const sprite_data_player = {
            id: 'Spook',
            greeting: "Hi, I am Spook.",
            src: sprite_src_mc,
            SCALE_FACTOR: MC_SCALE_FACTOR,
            STEP_FACTOR: 800,
            ANIMATION_RATE: 10,
            INIT_POSITION: { x: 50, y: height - (height / MC_SCALE_FACTOR)},
            pixels: {height: 2400, width: 3600},
            orientation: {rows: 2, columns: 3},
            down: {row: 1, start: 0, columns: 3},
            downRight: {row: 1, start: 0, columns: 3, rotate: Math.PI/16},
            downLeft: {row: 0, start: 0, columns: 3, rotate: -Math.PI/16},
            left: {row: 0, start: 0, columns: 3},
            right: {row: 1, start: 0, columns: 3},
            up: {row: 1, start: 0, columns: 3},
            upLeft: {row: 0, start: 0, columns: 3, rotate: Math.PI/16},
            upRight: {row: 1, start: 0, columns: 3, rotate: -Math.PI/16},
            hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
            keypress: { 
                up: 87,    // W key
                left: 65,  // A key
                down: 83,  // S key
                right: 68  // D key
            }
        };

        const createArtifactData = ({ id, label, src, x, y, scaleFactor = 12, pixels }) => ({
            id,
            greeting: `Press E to collect the ${label}.`,
            src,
            SCALE_FACTOR: scaleFactor,
            STEP_FACTOR: 0,
            ANIMATION_RATE: 0,
            INIT_POSITION: { x, y },
            pixels,
            orientation: { rows: 1, columns: 1 },
            down: { row: 0, start: 0, columns: 1 },
            hitbox: { widthPercentage: 0.55, heightPercentage: 0.55 },
            keypress: {},
            itemLabel: label,
            interact: function() {
                this.parentLevel?.collectArtifact(this.spriteData.id, this.spriteData.itemLabel);
            }
        });


        const mummyData = {
            id: "Temple Mummy",
            greeting: "Bring me the offerings and I will reveal the tomb key.",
            src: path + "/images/projects/mansionGame/sphinxclear.png",
            SCALE_FACTOR: 5,
            STEP_FACTOR: 0,
            ANIMATION_RATE: 0,
            INIT_POSITION: { x: width * 0.73, y: height * 0.42 },
            pixels: { height: 545, width: 506 },
            orientation: { rows: 1, columns: 1 },
            down: { row: 0, start: 0, columns: 1 },
            up: { row: 0, start: 0, columns: 1 },
            left: { row: 0, start: 0, columns: 1 },
            right: { row: 0, start: 0, columns: 1 },
            downLeft: { row: 0, start: 0, columns: 1 },
            downRight: { row: 0, start: 0, columns: 1 },
            upLeft: { row: 0, start: 0, columns: 1 },
            upRight: { row: 0, start: 0, columns: 1 },
            hitbox: { widthPercentage: 0.4, heightPercentage: 0.75 },
            keypress: {},
            interact: function() {
                this.parentLevel?.talkToMummy(this);
            }
        };

        // Spider 1: Bottom Right Corner
        const spiderEnemyData = {
            id: "Tomb Spider 1",
            greeting: "", 
            src: path + "/images/projects/mansionGame/spider.png", 
            SCALE_FACTOR: 8,
            STEP_FACTOR: 0,
            ANIMATION_RATE: 0,
            INIT_POSITION: { x: width * 0.85, y: height * 0.75 }, 
            pixels: { height: 256, width: 256 }, 
            orientation: { rows: 1, columns: 1 },
            down: { row: 0, start: 0, columns: 1 },
            hitbox: { widthPercentage: 0.7, heightPercentage: 0.7 },
            keypress: {}
        };

        // NEW: Spider 2: Top Left Corner
        const spiderTopLeftData = {
            id: "Tomb Spider 2",
            greeting: "", 
            src: path + "/images/projects/mansionGame/spider.png", 
            SCALE_FACTOR: 8,
            STEP_FACTOR: 0,
            ANIMATION_RATE: 0,
            INIT_POSITION: { x: width * 0.2, y: height * 0.15 }, 
            pixels: { height: 256, width: 256 }, 
            orientation: { rows: 1, columns: 1 },
            down: { row: 0, start: 0, columns: 1 },
            hitbox: { widthPercentage: 0.7, heightPercentage: 0.7 },
            keypress: {}
        };


        const artifactSprites = [
            createArtifactData({
                id: "sun_idol",
                label: "Sun Idol",
                src: path + "/images/projects/mansionGame/gold.png",
                x: width * 0.2,
                y: height * 0.35,
                scaleFactor: 13,
                pixels: { height: 279, width: 291 }
            }),
            createArtifactData({
                id: "ancient_scroll",
                label: "Ancient Scroll",
                src: path + "/images/projects/mansionGame/map.png",
                x: width * 0.48,
                y: height * 0.27,
                scaleFactor: 14,
                pixels: { height: 102, width: 128 }
            }),
            createArtifactData({
                id: "desert_gem",
                label: "Desert Gem",
                src: path + "/images/projects/mansionGame/ruby.png",
                x: width * 0.62,
                y: height * 0.72,
                scaleFactor: 12,
                pixels: { height: 236, width: 370 }
            })
        ];


        this.classes = [
            { class: GameEnvBackground, data: backgroundData },
            { class: Player, data: sprite_data_player },
            ...artifactSprites.map((data) => ({ class: Npc, data })),
            { class: Npc, data: mummyData },
            { class: Npc, data: spiderEnemyData },
            { class: Npc, data: spiderTopLeftData } // Injects Top-Left Spider
        ];
    }

    async fetchSpookyMusic() {
        try {
            const searchTerm = encodeURIComponent("egyptian tomb mystery");
            const url = `https://itunes.apple.com/search?term=${searchTerm}&media=music&limit=5`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                const randomTrack = data.results[Math.floor(Math.random() * data.results.length)];
                if (randomTrack.previewUrl) {
                    this.bgMusic = new Audio(randomTrack.previewUrl);
                    this.bgMusic.loop = true;
                    this.bgMusic.volume = this.audioVolume;

                    if (this.gameStarted) {
                        this.bgMusic.play().catch(err => console.log("Audio update blocked:", err));
                    }
                }
            }
        } catch (error) {
            console.warn("iTunes Music API failed to fetch audio context:", error);
        }
    }


    initialize() {
        this.createUserInterface();

        const gameObjects = this.gameEnv.gameObjects || [];
        this.artifactObjects = gameObjects.filter((object) =>
            this.levelState.artifactIds.includes(object?.spriteData?.id)
        );

        this.artifactObjects.forEach((artifact) => {
            artifact.parentLevel = this;
        });

        this.mummyNpc = gameObjects.find((object) => object?.spriteData?.id === "Temple Mummy");
        if (this.mummyNpc) {
            this.mummyNpc.parentLevel = this;
        }

        // UPDATED: Finds all gameObjects whose IDs contain the word "Spider"
        this.spiderEnemies = gameObjects.filter((object) => 
            object?.spriteData?.id && object.spriteData.id.includes("Spider")
        );
        
        this.playerInstance = gameObjects.find((object) => object instanceof Player);


        this.showIntroDialogue();
        this.startTimer(); 
        this.startCollisionTracking(); 
        this.startFlashlightTracking(); 
    }

    startFlashlightTracking() {
        this.stopFlashlightTracking();
        
        this.flashlightOverlay = document.createElement("div");
        Object.assign(this.flashlightOverlay.style, {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100vw",
            height: "100vh",
            pointerEvents: "none",
            zIndex: "900", 
            background: "rgba(8, 5, 2, 0.95)"
        });
        document.body.appendChild(this.flashlightOverlay);

        this.flashlightInterval = window.setInterval(() => {
            if (this.flashlightOverlay && this.playerInstance) {
                
                let centerX = Number(this.playerInstance.x) + 100; 
                let centerY = Number(this.playerInstance.y) + 100;
                
                if (this.playerInstance.canvas) {
                    const rect = this.playerInstance.canvas.getBoundingClientRect();
                    centerX = rect.left + (rect.width / 2);
                    centerY = rect.top + (rect.height / 2);
                }
                
                this.flashlightOverlay.style.background = `radial-gradient(circle 220px at ${centerX}px ${centerY}px, transparent 10%, rgba(8, 5, 2, 0.95) 80%)`;
            }
        }, 16); 
    }

    stopFlashlightTracking() {
        if (this.flashlightInterval) {
            window.clearInterval(this.flashlightInterval);
            this.flashlightInterval = null;
        }
        if (this.flashlightOverlay?.parentNode) {
            this.flashlightOverlay.parentNode.removeChild(this.flashlightOverlay);
        }
        this.flashlightOverlay = null;
    }

    // UPDATED: Iterates through the active spiders array dynamically
    startCollisionTracking() {
        this.stopCollisionTracking();
        
        this.collisionInterval = window.setInterval(() => {
            if (!this.playerInstance || !this.spiderEnemies || !this.gameStarted || this.levelState.rewardClaimed) return;

            const px = this.playerInstance.x;
            const py = this.playerInstance.y;

            this.spiderEnemies.forEach((spider) => {
                const sx = spider.x;
                const sy = spider.y;

                const distance = Math.sqrt(Math.pow(px - sx, 2) + Math.pow(py - sy, 2));
                
                if (distance < 65) {
                    this.handleHazardCollision();
                }
            });
        }, 100); 
    }

    stopCollisionTracking() {
        if (this.collisionInterval) {
            window.clearInterval(this.collisionInterval);
            this.collisionInterval = null;
        }
    }

    handleHazardCollision() {
        if (this.playerInstance) {
            this.playerInstance.x = this.playerStartPosition.x;
            this.playerInstance.y = this.playerStartPosition.y;
        }

        this.levelState.timeLeft = Math.max(0, this.levelState.timeLeft - 5);
        this.refreshUserInterface("⚠️ You touched a tomb spider! Position reset (-5s)!");

        if (this.statusDisplay) {
            this.statusDisplay.style.color = "#ff4444";
            setTimeout(() => {
                if (this.statusDisplay) this.statusDisplay.style.color = "#f3d98b";
            }, 1200);
        }
    }


    createUserInterface() {
        this.removeUserInterface();


        this.uiContainer = document.createElement("div");
        this.uiContainer.id = "mummy-level-ui";
        Object.assign(this.uiContainer.style, {
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: "1000",
            background: "rgba(23, 16, 8, 0.88)",
            border: "2px solid #d2b36c",
            borderRadius: "12px",
            padding: "14px 18px",
            color: "#f6e9c8",
            fontFamily: "Georgia, serif",
            minWidth: "220px",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.35)"
        });


        this.titleDisplay = document.createElement("div");
        this.titleDisplay.textContent = "Tomb Offerings";
        Object.assign(this.titleDisplay.style, {
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "4px"
        });

        this.timerDisplay = document.createElement("div");
        Object.assign(this.timerDisplay.style, {
            fontSize: "15px",
            fontWeight: "bold",
            color: "#ff7070",
            marginBottom: "10px"
        });

        this.itemsDisplay = document.createElement("div");
        this.statusDisplay = document.createElement("div");
        Object.assign(this.statusDisplay.style, {
            marginTop: "10px",
            fontSize: "14px",
            color: "#f3d98b"
        });


        this.uiContainer.appendChild(this.titleDisplay);
        this.uiContainer.appendChild(this.timerDisplay);
        this.uiContainer.appendChild(this.itemsDisplay);
        this.uiContainer.appendChild(this.statusDisplay);
        document.body.appendChild(this.uiContainer);


        this.refreshUserInterface("Collect the offerings, then press E near the mummy.");
    }


    refreshUserInterface(statusText = null) {
        if (this.timerDisplay) {
            this.timerDisplay.textContent = `⏳ Time Left: ${this.levelState.timeLeft}s`;
        }

        if (this.itemsDisplay) {
            const labels = {
                sun_idol: "Sun Idol",
                ancient_scroll: "Ancient Scroll",
                desert_gem: "Desert Gem"
            };


            this.itemsDisplay.innerHTML = this.levelState.artifactIds
                .map((artifactId) => {
                    const collected = this.levelState.collectedArtifacts.has(artifactId);
                    return `<div style="margin: 6px 0; color: ${collected ? "#9be38d" : "#f6e9c8"};">${collected ? "☑" : "☐"} ${labels[artifactId]}</div>`;
                })
                .join("");
        }


        if (statusText && this.statusDisplay) {
            this.statusDisplay.textContent = statusText;
        }
    }

    startTimer() {
        this.stopTimer();
        this.timerInterval = window.setInterval(() => {
            if (this.levelState.rewardClaimed) {
                this.stopTimer();
                return;
            }

            this.levelState.timeLeft -= 1;
            this.refreshUserInterface();

            if (this.levelState.timeLeft <= 0) {
                this.stopTimer();
                this.handleTimeOut();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            window.clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    handleTimeOut() {
        this.stopCollisionTracking();
        this.stopFlashlightTracking();
        
        if (this.bgMusic) {
            this.bgMusic.pause();
        }

        const timeoutDialogue = new DialogueSystem({
            id: `mummy_timeout_${Date.now()}`
        });

        timeoutDialogue.showDialogue(
            "The tomb doors slammed shut! You ran out of time to assemble the offerings.",
            "Tomb Trap",
            this.gameEnv.path + "/images/projects/mansionGame/sphinxclear.png"
        );

        timeoutDialogue.addButtons([
            {
                text: "Retry Level",
                primary: true,
                action: () => {
                    timeoutDialogue.closeDialogue();
                    this.restartLevel();
                }
            }
        ]);
    }

    restartLevel() {
        if (this.bgMusic) {
            this.bgMusic.currentTime = 0;
        }

        const gameControl = this.gameEnv?.gameControl;
        if (!gameControl) return;
        
        gameControl.isPaused = false;
        gameControl.transitionToLevel(); 
    }


    showIntroDialogue() {
        const introDialogue = new DialogueSystem({
            id: `mummy_intro_${Date.now()}`
        });


        introDialogue.showDialogue(
            "Search the tomb for three offerings. Bring them to the mummy to earn the key.",
            "Explorer",
            this.gameEnv.path + "/images/projects/mansionGame/sphinxclear.png"
        );


        introDialogue.addButtons([
            {
                text: "Start",
                primary: true,
                action: () => {
                    introDialogue.closeDialogue();
                    this.startTimer();
                    this.gameStarted = true; 

                    if (this.bgMusic) {
                        this.bgMusic.play().catch(err => console.log("Audio play blocked:", err));
                    }
                }
            }
        ]);
    }


    collectArtifact(artifactId, artifactLabel) {
        if (this.levelState.collectedArtifacts.has(artifactId)) {
            this.refreshUserInterface(`${artifactLabel} is already in your bag.`);
            return;
        }


        const artifactObject = this.gameEnv.gameObjects.find((object) => object?.spriteData?.id === artifactId);
        if (artifactObject) {
            try {
                artifactObject.destroy();
            } catch (error) {
                console.warn(`Failed to remove ${artifactId}`, error);
            }
        }


        this.levelState.collectedArtifacts.add(artifactId);
        this.refreshUserInterface(`Collected ${artifactLabel}.`);


        const collectDialogue = new DialogueSystem({
            id: `mummy_collect_${artifactId}_${Date.now()}`
        });


        collectDialogue.showDialogue(
            `You collected the ${artifactLabel}.`,
            "Artifact",
            this.gameEnv.path + "/images/projects/mansionGame/mummy_boy.png"
        );


        collectDialogue.addButtons([
            {
                text: "Close",
                primary: true,
                action: () => collectDialogue.closeDialogue()
            }
        ]);
    }


    talkToMummy(mummyNpc) {
        const remainingArtifacts = this.levelState.artifactIds.length - this.levelState.collectedArtifacts.size;


        if (this.levelState.rewardClaimed) {
            this.showReturnDialogue(mummyNpc);
            return;
        }


        if (remainingArtifacts > 0) {
            mummyNpc.dialogueSystem?.showDialogue(
                `You still owe me ${remainingArtifacts} offering${remainingArtifacts === 1 ? "" : "s"}.`,
                "Temple Mummy",
                mummyNpc.spriteData.src
            );
            this.refreshUserInterface("The mummy wants every offering before trading the key.");
            return;
        }

        this.stopTimer();
        this.stopCollisionTracking();
        this.stopFlashlightTracking();
        this.levelState.rewardClaimed = true;
        this.unlockNextLevel();
        this.refreshUserInterface("All offerings delivered. The mummy reveals the key.");


        mummyNpc.dialogueSystem?.showDialogue(
            "You have honored the tomb. Take this key and continue deeper into the ruins.",
            "Temple Mummy",
            mummyNpc.spriteData.src
        );


        this.showKeyReward();
    }

    showReturnDialogue(mummyNpc) {
        if (!mummyNpc?.dialogueSystem) {
            this.returnToLobby();
            return;
        }

        mummyNpc.dialogueSystem.showDialogue(
            "You beat Level 1. Return to the mansion lobby when you are ready.",
            "Temple Mummy",
            mummyNpc.spriteData.src
        );

        mummyNpc.dialogueSystem.addButtons([
            {
                text: "Return to Lobby",
                primary: true,
                action: () => {
                    mummyNpc.dialogueSystem.closeDialogue();
                    this.returnToLobby();
                }
            },
            {
                text: "Stay Here",
                action: () => mummyNpc.dialogueSystem.closeDialogue()
            }
        ]);
    }

    unlockNextLevel() {
        try {
            window.localStorage.setItem(this.nextUnlockedLevelKey, "true");
        } catch (error) {
            console.warn(`Failed to save ${this.nextUnlockedLevelKey}`, error);
        }
    }

    returnToLobby() {
        this.stopCollisionTracking();
        this.stopFlashlightTracking();
        if (this.bgMusic) {
            this.bgMusic.pause();
            this.bgMusic.currentTime = 0;
        }

        const gameControl = this.gameEnv?.gameControl;
        if (!gameControl) {
            return;
        }

        gameControl.levelClasses = [MansionLevelMain];
        gameControl.currentLevelIndex = 0;
        gameControl.isPaused = false;
        gameControl.transitionToLevel();
    }


    showKeyReward() {
        if (this.keyPopup?.parentNode) {
            this.keyPopup.parentNode.removeChild(this.keyPopup);
        }


        this.keyPopup = document.createElement("div");
        Object.assign(this.keyPopup.style, {
            position: "fixed",
            inset: "0",
            zIndex: "2000",
            background: "rgba(0, 0, 0, 0.78)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#f5e9b5",
            fontFamily: "Georgia, serif"
        });


        const keyImage = document.createElement("div");
        keyImage.textContent = "🗝️";
        Object.assign(keyImage.style, {
            fontSize: "96px",
            marginBottom: "18px",
            textShadow: "0 0 20px gold",
            transform: "translateY(-4px)"
        });


        const rewardText = document.createElement("div");
        rewardText.textContent = "You earned the Tomb Key";
        Object.assign(rewardText.style, {
            fontSize: "30px",
            fontWeight: "bold",
            marginBottom: "10px"
        });


        const rewardSubtext = document.createElement("div");
        rewardSubtext.textContent = "This level is ready to branch into the next mummy puzzle.";
        Object.assign(rewardSubtext.style, {
            fontSize: "16px",
            textAlign: "center",
            padding: "0 20px",
            marginBottom: "18px"
        });

        const buttonRow = document.createElement("div");
        Object.assign(buttonRow.style, {
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            justifyContent: "center"
        });

        const returnButton = document.createElement("button");
        returnButton.textContent = "Return to Lobby";
        Object.assign(returnButton.style, {
            padding: "10px 18px",
            borderRadius: "999px",
            border: "none",
            background: "#d2b36c",
            color: "#221508",
            fontWeight: "bold",
            cursor: "pointer"
        });
        returnButton.addEventListener("click", () => this.returnToLobby());

        const stayButton = document.createElement("button");
        stayButton.textContent = "Keep Exploring";
        Object.assign(stayButton.style, {
            padding: "10px 18px",
            borderRadius: "999px",
            border: "1px solid #d2b36c",
            background: "transparent",
            color: "#f5e9b5",
            fontWeight: "bold",
            cursor: "pointer"
        });
        stayButton.addEventListener("click", () => {
            if (this.keyPopup?.parentNode) {
                this.keyPopup.parentNode.removeChild(this.keyPopup);
            }
            this.keyPopup = null;
        });

        buttonRow.appendChild(returnButton);
        buttonRow.appendChild(stayButton);


        this.keyPopup.appendChild(keyImage);
        this.keyPopup.appendChild(rewardText);
        this.keyPopup.appendChild(rewardSubtext);
        this.keyPopup.appendChild(buttonRow);
        document.body.appendChild(this.keyPopup);
    }


    removeUserInterface() {
        if (this.uiContainer?.parentNode) {
            this.uiContainer.parentNode.removeChild(this.uiContainer);
        }
        this.uiContainer = null;
    }


    destroy() {
        this.stopTimer();
        this.stopCollisionTracking();
        this.stopFlashlightTracking();

        if (this.bgMusic) {
            this.bgMusic.pause();
            this.bgMusic.currentTime = 0;
            this.bgMusic = null;
        }

        if (this.keyPopupTimer) {
            window.clearTimeout(this.keyPopupTimer);
            this.keyPopupTimer = null;
        }


        if (this.keyPopup?.parentNode) {
            this.keyPopup.parentNode.removeChild(this.keyPopup);
        }
        this.keyPopup = null;


        this.removeUserInterface();
    }
}


export default MansionLevel1;