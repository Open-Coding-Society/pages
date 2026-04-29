import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import Coin from '@assets/js/GameEnginev1.1/Coin.js';
import Leaderboard from '@assets/js/GameEnginev1.1/essentials/Leaderboard.js';
class localStorageDemo {
    constructor(gameEnv) {
        let width = gameEnv.innerWidth;
        let height = gameEnv.innerHeight;
        let path = gameEnv.path;

        // ── Instantiate Leaderboard early so coin logic can reference it ──
        const leaderboard = new Leaderboard(null, {
            gameName: 'CoinsCollected',
            initiallyHidden: false   // show it immediately
        });

        // ── Listen for coin collection events and submit to leaderboard ──
        document.addEventListener('coinCollected', (e) => {
            const total = e.detail.total;

            // Retrieve or prompt for a stored player name (only asks once per session)
            let playerName = sessionStorage.getItem('playerName');
            if (!playerName) {
                playerName = prompt('Enter your name for the leaderboard:') || 'Anonymous';
                sessionStorage.setItem('playerName', playerName);
            }

            // Submit the running coin total as the current score
            leaderboard.submitScore(playerName, total, 'CoinsCollected').catch(err => {
                console.warn('[Leaderboard] submitScore failed:', err);
            });
        });

        // Background data  (fixed: was referencing undefined image_src_forest)
        const image_src_desert = path + "/_projects/local-storage/images/forest.png";
        const image_data_desert = {
            name: 'forest',
            src: image_src_desert,          // ← was image_src_forest (bug fix)
            pixels: { height: 580, width: 1038 }
        };

        // Player data for Chillguy
        const sprite_src_chillguy = path + "/_projects/local-storage/images/chillguy.png";
        const CHILLGUY_SCALE_FACTOR = 5;
        const sprite_data_chillguy = {
            id: 'Chill Guy',
            src: sprite_src_chillguy,
            SCALE_FACTOR: CHILLGUY_SCALE_FACTOR,
            STEP_FACTOR: 1000,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: 0.0, y: 0.9 },
            pixels: { height: 384, width: 512 },
            orientation: { rows: 3, columns: 4 },
            down:      { row: 0, start: 0, columns: 3 },
            downRight: { row: 1, start: 0, columns: 3, rotate:  Math.PI / 16 },
            downLeft:  { row: 2, start: 0, columns: 3, rotate: -Math.PI / 16 },
            left:      { row: 2, start: 0, columns: 3 },
            right:     { row: 1, start: 0, columns: 3 },
            up:        { row: 3, start: 0, columns: 3 },
            upLeft:    { row: 2, start: 0, columns: 3, rotate:  Math.PI / 16 },
            upRight:   { row: 1, start: 0, columns: 3, rotate: -Math.PI / 16 },
            hitbox: { widthPercentage: 0.45, heightPercentage: 0.4 },
            keypress: { up: 87, left: 65, down: 83, right: 68 }
        };

        const sprite_data_coin = {
            id: 'coin',
            greeting: false,
            INIT_POSITION: { x: 0.6, y: 0.6 },
            width: 40,
            height: 70,
            color: '#FFD700',
            hitbox: { widthPercentage: 0.2, heightPercentage: 0.2 },
            zIndex: 12,
            value: 1,
            reaction: function () {
                if (!this.collected) {
                    this.collected = true;

                    const coinsCollected = parseInt(localStorage.getItem('coinsCollected') || '0');
                    const newTotal = coinsCollected + this.value;
                    localStorage.setItem('coinsCollected', newTotal);

                    console.log(`Coin collected! Total coins: ${newTotal}`);

                    // coinCollected event is picked up by the leaderboard listener above
                    document.dispatchEvent(new CustomEvent('coinCollected', {
                        detail: { value: this.value, total: newTotal }
                    }));
                }
            },
            interact: function () {
                if (!this.collected) {
                    this.collected = true;
                    const coinsCollected = parseInt(localStorage.getItem('coinsCollected') || '0');
                    const newTotal = coinsCollected + this.value;
                    localStorage.setItem('coinsCollected', newTotal);
                    console.log(`Coin collected! Total coins: ${newTotal}`);
                }
            }
        };

        // Leaderboard is already mounted above; omit it from classes to avoid a
        // second instantiation by the game engine.
        this.classes = [
            { class: GameEnvBackground, data: image_data_desert },
            { class: Player,           data: sprite_data_chillguy },
            { class: Coin,             data: sprite_data_coin },
        ];
    }
}

export default localStorageDemo;