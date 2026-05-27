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
            rewardClaimed: false
        };


        const backgroundData = {
            name: "mummy_tomb",
            greeting: "Search the tomb for offerings to trade with the mummy.",
            src: path + "/images/projects/mansionGame/mummy1.png",
            pixels: { height: 580, width: 1038 },
            mode: "contain"
        };

       
        const sprite_src_mc = path + "/images/projects/mansionGame/spookMcWalk.png";
        const MC_SCALE_FACTOR = 6;
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
            { class: Npc, data: mummyData }
        ];
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


        this.showIntroDialogue();
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
        this.uiContainer.appendChild(this.itemsDisplay);
        this.uiContainer.appendChild(this.statusDisplay);
        document.body.appendChild(this.uiContainer);


        this.refreshUserInterface("Collect the offerings, then press E near the mummy.");
    }


    refreshUserInterface(statusText = null) {
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
                action: () => introDialogue.closeDialogue()
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

