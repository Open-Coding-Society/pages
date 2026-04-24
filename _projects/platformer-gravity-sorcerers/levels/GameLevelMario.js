import GameEnvBackground from '/assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Barrier from '/assets/js/GameEnginev1.1/essentials/Barrier.js';
import PlatformerPlayer from './custom/PlatformerPlayer.js';
import Npc from '/assets/js/GameEnginev1.1/essentials/Npc.js';


class GameLevelMario {
	static displayName = 'Mario Platformer';

	constructor(gameEnv) {
		const path = gameEnv.path;
		const width = gameEnv.innerWidth;
		const height = gameEnv.innerHeight;
		console.log('Initializing GameLevelMario with path:', path, 'width:', width, 'height:', height);

		const marioJumpAudioSrc = path + '/images/projects/platformer-gravity-sorcerers/mario-jump.mp3';
		const marioThemeAudioSrc = path + '/images/projects/platformer-gravity-sorcerers/mario-theme.mp3';
		this.levelMusic = new Audio(marioThemeAudioSrc);
		this.levelMusic.loop = true;
		this.levelMusic.preload = 'auto';
		this.levelMusic.volume = 0.35;

		const tryStartLevelMusic = () => {
			if (!this.levelMusic) return;
			if (!this.levelMusic.paused) return;
			this.levelMusic.play().catch(() => {});
		};

		tryStartLevelMusic();

		const startOnInteraction = () => {
			tryStartLevelMusic();
			if (this.levelMusic && !this.levelMusic.paused) {
				window.removeEventListener('keydown', startOnInteraction);
				window.removeEventListener('pointerdown', startOnInteraction);
			}
		};

		window.addEventListener('keydown', startOnInteraction);
		window.addEventListener('pointerdown', startOnInteraction);

		const image_src_bg = path + "/images/projects/platformer-gravity-sorcerers/oldmariobg.png";
		const image_data_bg = {
			id: 'MarioBG',
			src: image_src_bg,
			pixels: {height: 670, width: 1192}
		};

		const floorData = {
			id: 'mario-floor',
			x: 0,
			y: 0.88,
			width: 1,
			height: 0.1,
			color: 'rgba(133, 94, 66, 0.95)',
			visible: false,
			hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
		};

		const platform1Data = {
			id: 'mario-platform-1',
			x: 75/1118,
			y: 491/760,
			width: 39/1118,
			height: 49/760,
			color: 'rgba(133, 94, 66, 0.95)',
			visible: false,
			hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
		};

		const platform2Data = {
			id: 'mario-platform-2',
			x: 887/1110,
			y: 622/757,
			width: 150/1110,
			height: 45/757,
			color: 'rgba(133, 94, 66, 0.95)',
			visible: false,
			hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
		};

		const platform3Data = {
			id: 'mario-platform-3',
			x: 922/1110,
			y: 575/757,
			width: 114/1110,
			height: 47/757,
			color: 'rgba(133, 94, 66, 0.95)',
			visible: false,
			hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
		};

		const platform4Data = {
			id: 'mario-platform-4',
			x: 958/1110,
			y: 531/757,
			width: 76/1110,
			height: 46/757,
			color: 'rgba(133, 94, 66, 0.95)',
			visible: false,
			hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
		};

		const platform5Data = {
			id: 'mario-platform-5',
			x: 998/1110,
			y: 489/757,
			width: 37/1110,
			height: 47/757,
			color: 'rgba(133, 94, 66, 0.95)',
			visible: false,
			hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
		};

		const platform6Data = {
			id: 'mario-platform-6',
			x: 297/1110,
			y: 492/757,
			width: 40/1110,
			height: 46/757,
			color: 'rgba(133, 94, 66, 0.95)',
			visible: false,
			hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
		}; 

		const platform7Data = {
			id: 'mario-platform-7',
			x: 702/1110,
			y: 490/757,
			width: 76/1110,
			height: 48/757,
			color: 'rgba(133, 94, 66, 0.95)',
			visible: false,
			hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
		};

		const platform8Data = {
			id: 'mario-platform-8',
			x: 404/1110,
			y: 309/757,
			width: 113/1110,
			height: 47/757,
			color: 'rgba(133, 94, 66, 0.95)',
			visible: false,
			hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
		}; 

		const platform9Data = {
			id: 'mario-platform-9',
			x: 664/1110,
			y: 310/757,
			width: 151/1110,
			height: 46/757,
			color: 'rgba(133, 94, 66, 0.95)',
			visible: false,
			hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
		}; 

		const spriteSrc = path + '/images/projects/platformer-gravity-sorcerers/mario.png';
		const playerData = {
			id: 'Mario',
			greeting: 'Let\'s-a go!',
			src: spriteSrc,
			SCALE_FACTOR: 10,
			STEP_FACTOR: 1600,
			ANIMATION_RATE: 20,
			INIT_POSITION: {
				x: width * 0.1,
				y: height * 0.3,
			},
			pixels: { height: 384, width: 288 },
			orientation: { rows: 2, columns: 3 },
			down: { row: 0, start: 0, columns: 3 },
			downRight: { row: 0, start: 0, columns: 3 },
			downLeft: { row: 1, start: 0, columns: 3 },
			left: { row: 1, start: 0, columns: 3 },
			right: { row: 0, start: 0, columns: 3 },
			up: { row: 0, start: 0, columns: 3 },
			upLeft: { row: 1, start: 0, columns: 3 },
			upRight: { row: 0, start: 0, columns: 3 },
			hitbox: { widthPercentage: 0.2, heightPercentage: 0.2 },
			debugHitbox: false,
			debugHitboxColor: 'rgba(57, 255, 20, 0.95)',
			jumpSoundSrc: marioJumpAudioSrc,
			jumpSoundVolume: 0.8,
			keypress: { up: 87, left: 65, down: 83, right: 68 },
			jumpVelocity: 6,
			gravityAcceleration: 0.12,
		};

		const sprite_src_toad = path + "/images/projects/platformer-gravity-sorcerers/jumping-toad.png";
        const sprite_greet_toad = "toad";
        const sprite_data_toad = {
            id: 'Toad',
            greeting: sprite_greet_toad,
            src: sprite_src_toad,
            SCALE_FACTOR: 10,
            ANIMATION_RATE: 8,
            pixels: {width: 2400, height: 200},
            INIT_POSITION: {x: 0.6 * width, y: 0.8 * height},
            orientation: {rows: 1, columns: 12},
            down: {row: 0, start: 0, columns: 12, mirror: true},
            hitbox: {widthPercentage: 0.1, heightPercentage: 0.2},
            dialogues: [
                "Are you ready to play some archery?"
            ],
            reaction: function() {
                console.log("Toad collision");
            },
            
            // This is where the interactions for starting the game are handled
            interact: function() {
                // Clear any existing dialogue first to prevent duplicates
                if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) {
                    this.dialogueSystem.closeDialogue();
                }
                
                // Create a new dialogue system if needed
                if (!this.dialogueSystem) {
                    this.dialogueSystem = new DialogueSystem();
                }
                
                // Show portal dialogue with buttons
                this.dialogueSystem.showDialogue(
                    "hallo i is toad. platformers are really cool!",
                    "Toad",
                    this.spriteData.src
                );
                
                // Add buttons directly to the dialogue
                this.dialogueSystem.addButtons([
                    {
                        text: "ELIMINATE TOAD",
                        primary: true,
                        action: () => {
                            this.dialogueSystem.closeDialogue();

                            // Make the NPC disappear after interaction
                            this.destroy();
                        }
                    }
                ]);
            }
        };

		this.classes = [
			{ class: GameEnvBackground, data: image_data_bg },
			{ class: Barrier, data: floorData },
			{ class: PlatformerPlayer, data: playerData },
			{ class: Barrier, data: platform1Data },
			{ class: Barrier, data: platform2Data },
			{ class: Barrier, data: platform3Data },
			{ class: Barrier, data: platform4Data },
			{ class: Barrier, data: platform5Data },
			{ class: Barrier, data: platform6Data },
			{ class: Barrier, data: platform7Data },
			{ class: Barrier, data: platform8Data },
			{ class: Barrier, data: platform9Data },
			{ class: Npc, data: sprite_data_toad },
		];
	}
}

export default GameLevelMario;
