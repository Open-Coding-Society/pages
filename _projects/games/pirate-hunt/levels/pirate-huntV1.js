import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import CollectibleItem from '@assets/js/GameEnginev1.1/essentials/Coin.js';

class GameLevelPirateHunt {
    // Initializes the pirate hunt level with background, player, NPCs, and the heist checklist UI
    constructor(gameEnv) {
        console.log("Initializing GameLevelPirate...");

        const width = gameEnv.innerWidth;
        const height = gameEnv.innerHeight;
        const path = gameEnv.path;

        /* ---------------- HEIST CHECKLIST UI ---------------- */

        const existing = document.getElementById('pirate-checklist');
        if (existing) existing.remove();

        const checklistEl = document.createElement('div');
        checklistEl.id = 'pirate-checklist';
        checklistEl.style.cssText = `
            position: fixed;
            top: 60px;
            right: 20px;
            background: rgba(20, 10, 0, 0.85);
            border: 2px solid #c8a44a;
            border-radius: 10px;
            padding: 14px 18px;
            color: #f5e6c8;
            font-family: 'Georgia', serif;
            font-size: 15px;
            z-index: 9999;
            min-width: 175px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.6);
        `;
        checklistEl.innerHTML = `
            <div style="font-weight:bold; margin-bottom:10px; color:#c8a44a; font-size:16px; border-bottom:1px solid #c8a44a; padding-bottom:6px;">🏴‍☠️ Heist List</div>
            <div id="check-goldbar"  style="margin:6px 0;">☐ Gold Bar</div>
            <div id="check-chest"    style="margin:6px 0;">☐ Chest</div>
            <div id="check-map"      style="margin:6px 0;">☐ Map</div>
            <div id="check-ruby"     style="margin:6px 0;">☐ Ruby</div>
        `;
        document.body.appendChild(checklistEl);

        // Marks a checklist item as collected by updating its text, style, and dataset flag
        function checkOff(id, label) {
            const el = document.getElementById(id);
            if (el && !el.dataset.collected) {
                el.dataset.collected = 'true';
                el.innerHTML = '☑ ' + label;
                el.style.textDecoration = 'line-through';
                el.style.color = '#7fbf7f';
            }
        }

        /* Hide the leaderboard/coin counter bar — this level uses its own checklist */
        const leaderboardHeader = document.querySelector('.leaderboard-header');
        if (leaderboardHeader) leaderboardHeader.style.display = 'none';

        /* ---------------- BACKGROUND ---------------- */

        const bgDataPath = path + "/images/gamebuilder/bg/Ship.jpg";

        const bgData = {
            name: "custom_bg",
            src: bgDataPath,
            pixels: { height: 600, width: 800 }
        };

        /* ---------------- PLAYER ---------------- */

        const playerData = {
            id: 'lost sailor',
            src: path + "/images/gamebuilder/sprites/mcarchie.png",
            SCALE_FACTOR: 6,
            STEP_FACTOR: 1000,
            ANIMATION_RATE: 30,
            INIT_POSITION: { x: 650, y: 430 },

            pixels: { height: 256, width: 256 },
            orientation: { rows: 4, columns: 4 },

            down: { row: 0, start: 0, columns: 4 },
            downRight: { row: 2, start: 0, columns: 3, rotate: Math.PI / 16 },
            downLeft: { row: 1, start: 0, columns: 3, rotate: -Math.PI / 16 },
            right: { row: 2, start: 0, columns: 4 },
            left: { row: 1, start: 0, columns: 4 },
            up: { row: 3, start: 0, columns: 4 },
            upRight: { row: 2, start: 0, columns: 3, rotate: -Math.PI / 16 },
            upLeft: { row: 1, start: 0, columns: 3, rotate: Math.PI / 16 },

            hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
            keypress: { up: 87, left: 65, down: 83, right: 68 }
        };

        /* ---------------- ITEM 1 ---------------- */

        const itemData1 = {
            id: 'Gold bar',
            src: path + "/images/gamebuilder/sprites/gold.png",
            SCALE_FACTOR: 12,
            ANIMATION_RATE: 100008,
            INIT_POSITION: { x: 730, y: 350 },
            pixels: { height: 279, width: 291 },
            orientation: { rows: 1, columns: 1 },
            down: { row: 0, start: 0, columns: 1 },
            hitbox: { widthPercentage: 0.4, heightPercentage: 0.6 },
            onCollect: () => checkOff('check-goldbar', 'Gold Bar')
        };

        /* ---------------- ITEM 2 ---------------- */

        const itemData2 = {
            id: 'Chest',
            src: path + "/images/gamebuilder/sprites/chest.png",
            SCALE_FACTOR: 7,
            ANIMATION_RATE: 1000000008,
            INIT_POSITION: { x: 390, y: 555 },
            pixels: { height: 449, width: 487 },
            orientation: { rows: 1, columns: 1 },
            down: { row: 0, start: 0, columns: 1 },
            hitbox: { widthPercentage: 0.4, heightPercentage: 0.6 },
            onCollect: () => checkOff('check-chest', 'Chest')
        };

        /* ---------------- ITEM 3 ---------------- */

        const itemData3 = {
            id: 'Map',
            src: path + "/images/gamebuilder/sprites/map.png",
            SCALE_FACTOR: 14,
            ANIMATION_RATE: 1000000008,
            INIT_POSITION: { x: 520, y: 320 },
            pixels: { height: 102, width: 128 },
            orientation: { rows: 1, columns: 1 },
            down: { row: 0, start: 0, columns: 1 },
            hitbox: { widthPercentage: 0.4, heightPercentage: 0.6 },
            onCollect: () => checkOff('check-map', 'Map')
        };

        /* ---------------- ITEM 4 ---------------- */

        const itemData4 = {
            id: 'Ruby',
            src: path + "/images/gamebuilder/sprites/ruby.png",
            SCALE_FACTOR: 12,
            ANIMATION_RATE: 1000000008,
            INIT_POSITION: { x: 1185, y: 555 },
            pixels: { height: 236, width: 370 },
            orientation: { rows: 1, columns: 1 },
            down: { row: 0, start: 0, columns: 1 },
            hitbox: { widthPercentage: 0.4, heightPercentage: 0.6 },
            onCollect: () => checkOff('check-ruby', 'Ruby')
        };

        /* -------- LEVEL OBJECTS -------- */

        this.checklistEl = checklistEl;

        this.classes = [
            { class: GameEnvBackground, data: bgData },
            { class: Player, data: playerData },

            { class: CollectibleItem, data: itemData1 },
            { class: CollectibleItem, data: itemData2 },
            { class: CollectibleItem, data: itemData3 },
            { class: CollectibleItem, data: itemData4 }
        ];
    }

    // Removes the heist checklist UI element from the DOM when the level is destroyed
    destroy() {
        // Restore leaderboard header for other levels
        const leaderboardHeader = document.querySelector('.leaderboard-header');
        if (leaderboardHeader) leaderboardHeader.style.display = '';

        if (this.checklistEl) {
            this.checklistEl.remove();
        }
    }
}

export default GameLevelPirateHunt;
