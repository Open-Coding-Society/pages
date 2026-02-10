import GameEnvBackground from '/assets/js/GameEnginev1.5/GameEnvBackground.js';

class MurderMysteryL2 {
    constructor(gameEnv) {
        const path = gameEnv.path;
        const width = gameEnv.innerWidth;
        const height = gameEnv.innerHeight;
        const bgData = {
            name: 'custom_bg',
            src: path + "/images/gamebuilder/alien_planet.jpg",
            pixels: { height: 600, width: 1000 }
        };

        this.classes = [
                  { class: GameEnvBackground, data: bgData }
        ];
    }
}

export default MurderMysteryL2;