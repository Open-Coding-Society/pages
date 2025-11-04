// To build GameLevels, each contains GameObjects from below imports
import GameEnvBackground from './GameEngine/GameEnvBackground.js';
import Player from './GameEngine/Player.js';
import Enemy from './GameEngine/Enemy.js';
import GameControl from './GameEngine/GameControl.js';
import Character from './GameEngine/Character.js';
import Npc from './GameEngine/Npc.js';
import GameLevel6 from './mansionLevel6.js';


class MansionLevel5 {
  constructor(gameEnv) {
    this.gameEnv = gameEnv; // Store gameEnv reference
	let width = gameEnv.innerWidth;
	let height = gameEnv.innerHeight;
	let path = gameEnv.path;
    this.width = width;
    this.height = height;

    // Pause DOM audio elements
    try {
        const audioElements = document.querySelectorAll('audio'); // Selects all <audio> elements
        audioElements.forEach(audio => {
            try { if (!audio.paused) audio.pause(); } catch (e) {}
        });
    } catch (e) { /* ignore */ }
	// Background data
	const image_background = path + "/images/mansionGame/background_lvl5.png"; // be sure to include the path
	const image_data_background = {
		name: 'background',
		greeting: "This is the library, you will fight hordes of enemies, survive as long as possible.",
		src: image_background,
		pixels: {height: 1280, width: 720},
		mode: 'stretch'
	};

	//data for player
	const sprite_player = path + "/images/mansionGame/full_anims_spook.png"; // be sure to include the path
	const player_scale_factor = 5;
	const sprite_data_player = {
        id: 'Player',
        greeting: "I am the player for level 5",
        src: sprite_player,
        SCALE_FACTOR: player_scale_factor,
        STEP_FACTOR: 2000,
        ANIMATION_RATE: 20,
        INIT_POSITION: { x: 0, y: 0 }, 
        pixels: {width: 1500, height: 120},
        orientation: {rows: 2, columns: 25},
		down: {row: 1, start: 0, columns: 3},
		downRight: {row: 1, start: 0, columns: 3, mirror: true, rotate: Math.PI/16},
		downLeft: {row: 1, start: 0, columns: 3, rotate: -Math.PI/16},
		left: {row: 1, start: 0, columns: 3},
		right: {row: 1, start: 0, columns: 3, mirror: true},
		up: {row: 1, start: 0, columns: 3},
		upLeft: {row: 0, start: 0, columns: 3, rotate: Math.PI/16},
		upRight: {row: 1, start: 0, columns: 3, mirror: true, rotate: Math.PI/-16},
		hitbox: {widthPercentage: 0.45, heightPercentage: 0.2},
		keypress: {up: 87, left: 65, down: 83, right: 68, shoot: 67},
        shoot: {row: 2, columns: 25}
	};

    const player = new Player(sprite_data_player, this.gameEnv);

    // add player to game
    this.gameEnv.gameObjects.push(player);

    const sprite_src_zombie = path + "/images/mansionGame/zombieNpc.png";

	const sprite_data_enemy = {
        id: 'ZombieEnemy',
        greeting: "Zombie dead",
        src: sprite_src_zombie,
        SCALE_FACTOR: 4,
        ANIMATION_RATE: 100,
        pixels: {width: 3600, height: 1200},
        INIT_POSITION: { x: width / 2, y: height / 4 },
        orientation: {rows: 1, columns: 3},
		down: {row: 0, start: 0, columns: 3},
        hitbox: { widthPercentage: 0.4, heightPercentage: 0.4 },
        zIndex: 10,
        isKilling: false, // Flag to prevent multiple kills
        
        // The update method with all functionality inline
        update: function() {
            // // Skip update if already in killing process
            // if (this.isKilling) {
            //     return;
            // }
            
            // // player
            // let nearest = player;


            // // Move towards nearest player
            // const speed = 0.8; // Adjust speed as needed
            // const dx = nearest.position.x - this.position.x;
            // const dy = nearest.position.y - this.position.y;
            // const angle = Math.atan2(dy, dx);
            
            // // Update position
            // this.position.x += Math.cos(angle) * speed;
            // this.position.y += Math.sin(angle) * speed;
            
            // // Check for collision with player
            // {
            //     // Calculate distance for hitbox collision
            //     const playerX = nearest.position.x + nearest.width / 2;
            //     const playerY = nearest.position.y + nearest.height / 2;
            //     const enemyX = this.position.x + this.width / 2;
            //     const enemyY = this.position.y + this.height / 2;
                
            //     const dx = playerX - enemyX;
            //     const dy = playerY - enemyY;
            //     const distance = Math.sqrt(dx*dx + dy*dy);
                
            //     // Hitbox collision - adjust values as needed
            //     const collisionThreshold = (nearest.width * nearest.hitbox.widthPercentage + 
            //                             this.width * this.hitbox.widthPercentage) / 2;
                
            //     if (distance < collisionThreshold) {
            //         // Set killing flag to prevent repeated kills
            //         this.isKilling = true;
                    
            //         // === PLAYER DEATH: ALL FUNCTIONALITY INLINE ===
                    
            //         // 1. Play death animation - particle effect
            //         const playerX = nearest.position.x;
            //         const playerY = nearest.position.y;
                    
            //         // Create explosion effect
            //         for (let i = 0; i < 20; i++) {
            //             const particle = document.createElement('div');
            //             particle.style.position = 'absolute';
            //             particle.style.width = '5px';
            //             particle.style.height = '5px';
            //             particle.style.backgroundColor = 'red';
            //             particle.style.left = `${playerX + nearest.width/2}px`;
            //             particle.style.top = `${playerY + nearest.height/2}px`;
            //             particle.style.zIndex = '9999';
            //             document.body.appendChild(particle);
                        
            //             // Animate particles outward
            //             const angle = Math.random() * Math.PI * 2;
            //             const speed = Math.random() * 5 + 2;
            //             const distance = Math.random() * 100 + 50;
                        
            //             const destX = Math.cos(angle) * distance;
            //             const destY = Math.sin(angle) * distance;
                        
            //             particle.animate(
            //                 [
            //                     { transform: 'translate(0, 0)', opacity: 1 },
            //                     { transform: `translate(${destX}px, ${destY}px)`, opacity: 0 }
            //                 ],
            //                 {
            //                     duration: 1000,
            //                     easing: 'ease-out',
            //                     fill: 'forwards'
            //                 }
            //             );
                        
            //             // Remove particle after animation
            //             setTimeout(() => {
            //                 if (particle.parentNode) {
            //                     particle.parentNode.removeChild(particle);
            //                 }
            //             }, 1000);
            //         }
                    
            //         // 2. Show death message dialog
            //         const deathMessage = document.createElement('div');
            //         deathMessage.style.position = 'fixed';
            //         deathMessage.style.top = '50%';
            //         deathMessage.style.left = '50%';
            //         deathMessage.style.transform = 'translate(-50%, -50%)';
            //         deathMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            //         deathMessage.style.color = '#FF0000';
            //         deathMessage.style.padding = '30px';
            //         deathMessage.style.borderRadius = '10px';
            //         deathMessage.style.fontFamily = "'Press Start 2P', sans-serif";
            //         deathMessage.style.fontSize = '24px';
            //         deathMessage.style.textAlign = 'center';
            //         deathMessage.style.zIndex = '10000';
            //         deathMessage.style.border = '3px solid #FF0000';
            //         deathMessage.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.5)';
            //         deathMessage.style.width = '400px';
            //         deathMessage.innerHTML = `
            //             <div style="margin-bottom: 20px;">☠️ YOU DIED ☠️</div>
            //             <div style="font-size: 16px; margin-bottom: 20px;">The zombies got you!</div>
            //             <div style="font-size: 14px;">Respawning in 2 seconds...</div>
            //         `;
                    
            //         document.body.appendChild(deathMessage);
                    
            //         // Remove message after delay
            //         setTimeout(() => {
            //             if (deathMessage.parentNode) {
            //                 deathMessage.parentNode.removeChild(deathMessage);
            //             }
            //         }, 2000);
                    
            //         // 3. Reset the level after a short delay using page reload for reliability
            //         setTimeout(() => {
            //             // Clean up any lingering resources before reload
            //             if (self && self.timerInterval) {
            //                 clearInterval(self.timerInterval);
            //             }
                        
            //             // Force a complete page reload - most reliable way to reset
            //             location.reload();
            //         }, 2000); // 2 second delay before reset
            //     }
            // }
        }
    };

    // Level 6 door
    const sprite_src_level6door = path + "/images/mansionGame/door_lvl5.png";
    const sprite_greet_level6door = "You beat level 5! Would you like to enter level 6? Press E";
    const sprite_data_level6door = {
        id: 'Level6Door',
        greeting: sprite_greet_level6door,
        src: sprite_src_level6door,
        SCALE_FACTOR: 1,
        ANIMATION_RATE: 100,
        pixels: {width: 256, height: 256},
        INIT_POSITION: { x: 100, y: 100 },
        orientation: {rows: 1, columns: 1},
        down: {row: 0, start: 0, columns: 1},
        hitbox: {widthPercentage: 0.2, heightPercentage: 0.3},
        dialogues: ["Level 6 awaits. Do you wish to enter?"],
        reaction: function() {},
        interact: function() {
            if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) this.dialogueSystem.closeDialogue();
            if (!this.dialogueSystem) this.dialogueSystem = new DialogueSystem();
            this.dialogueSystem.showDialogue("Would you like to enter Level 6?", "Level 6", this.spriteData.src);
            this.dialogueSystem.addButtons([
            { text: "Enter", primary: true, action: () => {
                this.dialogueSystem.closeDialogue();
                if (gameEnv && gameEnv.gameControl) {
                    const gameControl = gameEnv.gameControl;
                    gameControl._originalLevelClasses = gameControl.levelClasses;
                    gameControl.levelClasses = [GameLevel6];
                    gameControl.currentLevelIndex = 0;
                    gameControl.isPaused = false;
                    gameControl.transitionToLevel();
                }
            } },
            { text: "Not Now", action: () => { this.dialogueSystem.closeDialogue(); } }
            ]);
        }
    };

    this.finishDoorData = sprite_data_level6door;

    const laser_image = path + "/images/gamify/laser_bolt.png"  // be sure to include the path
    this.laserData = {
      id: "Laser",
      src: laser_image,
      SCALE_FACTOR: 20,
      ANIMATION_RATE: 50,
      pixels: { height: 500, width: 500 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
    }

    
    this.lasers = [];
    this.lastShotTime = 0;
    this.shootCooldown = 500;

	// List of objects defnitions for this level
	this.classes = [
	  { class: GameEnvBackground, data: image_data_background }
	];

    // Store sprite_data_enemy for later use
    this.enemyTemplate = sprite_data_enemy;
    this.playerRef = player;

    this.zombiesKilled = 0;
    this.zombies = 0;
    this.spawnZombies = true;

    this.zombieList = [];

    // zombie spawner
    this.startZombieSpawner();
    // shoot key
    this.bindShootKey();

    // start checking for collisions
    this.start();
  }

    bindShootKey() {
        window.addEventListener("keydown", (event) => {
            if (event.code === "KeyC") {
                this.shootLaser();
            }
        })
    }

    shootLaser() {
        const currentTime = Date.now()
        if (currentTime - this.lastShotTime < this.shootCooldown) return

        this.lastShotTime = currentTime

        const player = this.playerRef;

        if (!player) {
            console.error("Player not found")
            return
        }

        console.log("Shooting lasers")

        const laserNum = 8;

        for (let i = 0; i < laserNum; i++)
        {
            const laserData = {
                ...this.laserData,
                id: `Laser-${Math.random().toString(36).substring(2, 9)}`,
                INIT_POSITION: {
                    x: player.position.x + player.width / 2 - 10,
                    y: player.position.y - 20,
                },
            }
    
            const laser = new Character(laserData, this.gameEnv)
    
            // generate lasers in circle
            laser.velocity = { x: Math.cos((i * Math.PI * 2)/laserNum)*5, y: Math.sin((i * Math.PI * 2)/laserNum)*5 }

            const outerInstance = this;
    
            laser.update = function () {
                this.position.y += this.velocity.y
                this.position.x += this.velocity.x

                setTimeout(() => {
                    const index = this.gameEnv.gameObjects.indexOf(this)
                    if (index !== -1) {
                        this.gameEnv.gameObjects.splice(index, 1)
                    }

                    const index2 = outerInstance.lasers.indexOf(this)
                    if (index2 !== -1)
                    {
                        outerInstance.lasers.splice(index2, 1)
                    }
                    

                    this.collisionWidth = 0;
                    this.collisionHeight = 0;
                    this.destroy()
                }, 5000);
    
                this.draw()
            }
    
            this.lasers.push(laser)
            this.gameEnv.gameObjects.push(laser)
        }
    }

    isColliding(obj1, obj2) {
        return (
          obj1.position.x < obj2.position.x + obj2.width &&
          obj1.position.x + obj1.width > obj2.position.x &&
          obj1.position.y < obj2.position.y + obj2.height &&
          obj1.position.y + obj1.height > obj2.position.y
        )
    }

    checkCollisions() {
        // Check for laser-zombie collisions
        for (let i = this.lasers.length - 1; i >= 0; i--) {
            const laser = this.lasers[i]

            for (let j = this.zombieList.length - 1; j >= 0; j--) {
            const zombie = this.zombieList[j]

            if (this.isColliding(laser, zombie)) {
                // delete zombie from lists
                const z_index = this.gameEnv.gameObjects.indexOf(zombie)
                if (z_index !== -1) {
                    this.gameEnv.gameObjects.splice(z_index, 1)
                }

                const z_index2 = this.zombieList.indexOf(zombie)
                if (z_index2 !== -1)
                {
                    this.zombieList.splice(z_index2, 1)
                }

                // delete laser from lists
                const l_index = this.gameEnv.gameObjects.indexOf(laser)
                if (l_index !== -1) {
                    this.gameEnv.gameObjects.splice(l_index, 1)
                }

                const l_index2 = this.lasers.indexOf(laser)
                if (l_index2 !== -1)
                {
                    this.lasers.splice(l_index2, 1)
                }

                // kinda funny solution to disable colliders
                laser.collisionHeight = 0;
                laser.collisionWidth = 0;
                zombie.collisionHeight = 0;
                zombie.collisionWidth = 0;
                
                laser.destroy();
                zombie.destroy();


                this.zombiesKilled += 1;
                break;
            }
            }
        }
    }

    // Method to spawn a batch of zombies
    spawnZombieBatch() {
        const numZombies = 1; // spawn zombies per batch
        
        for (let i = 0; i < numZombies; i++) {
            const side = Math.floor(Math.random() * 4);
            let pos_x, pos_y;

            switch(side) {
                case 0: // top
                    pos_x = Math.random() * this.width;
                    pos_y = -50;
                break;
                case 1: // right
                    pos_x = this.width + 50;
                    pos_y = Math.random() * this.height;
                break;
                case 2: // bottom
                    pos_x = Math.random() * this.width;
                    pos_y = this.height + 50;
                break;
                case 3: // left
                    pos_x = -50;
                    pos_y = Math.random() * this.height;
                break;
            }
            
            this.zombies += 1;

            // Create new enemy with the spawning position
            const zombieData = {
                ...this.enemyTemplate,
                id: `Zombie${this.zombies}`,
                INIT_POSITION: { x: pos_x, y: pos_y }
            };

            const zombie = new Enemy(zombieData, this.gameEnv);

            // Add the new zombie to the game
            this.gameEnv.gameObjects.push(zombie);
            this.zombieList.push(zombie);
        }
    }

    // Method to start the zombie spawning timer
    startZombieSpawner() {
        if(this.spawnZombies)
        {
            // Szombies spawn every 2 seconds
            setInterval(() => {
                this.spawnZombieBatch();
            }, 5000);
        }
    }

    updateZombies() 
    {
        for (let i = 0; i < this.zombieList.length; i++)
        {
            let currentZombie = this.zombieList[i];

            // Skip update if already in killing process
            if (currentZombie.isKilling) {
                return;
            }
            
            
            // player
            let nearest = this.playerRef;
    
    
            // Move towards nearest player
            const speed = 1.2; // Adjust speed as needed
            const dx = nearest.position.x - currentZombie.position.x;
            const dy = nearest.position.y - currentZombie.position.y;
            const angle = Math.atan2(dy, dx);
            
            // Update position
            currentZombie.position.x += Math.cos(angle) * speed;
            currentZombie.position.y += Math.sin(angle) * speed;
            
            // Check for collision with player
            {
                if (this.isColliding(nearest, currentZombie)) {
                    // Set killing flag to prevent repeated kills
                    currentZombie.isKilling = true;
                    
                    // === PLAYER DEATH: ALL FUNCTIONALITY INLINE ===
                    
                    // 1. Play death animation - particle effect
                    const playerX = nearest.position.x;
                    const playerY = nearest.position.y;
                    
                    // Create explosion effect
                    for (let i = 0; i < 20; i++) {
                        const particle = document.createElement('div');
                        particle.style.position = 'absolute';
                        particle.style.width = '5px';
                        particle.style.height = '5px';
                        particle.style.backgroundColor = 'red';
                        particle.style.left = `${playerX + nearest.width/2}px`;
                        particle.style.top = `${playerY + nearest.height/2}px`;
                        particle.style.zIndex = '9999';
                        document.body.appendChild(particle);
                        
                        // Animate particles outward
                        const angle = Math.random() * Math.PI * 2;
                        const speed = Math.random() * 5 + 2;
                        const distance = Math.random() * 100 + 50;
                        
                        const destX = Math.cos(angle) * distance;
                        const destY = Math.sin(angle) * distance;
                        
                        particle.animate(
                            [
                                { transform: 'translate(0, 0)', opacity: 1 },
                                { transform: `translate(${destX}px, ${destY}px)`, opacity: 0 }
                            ],
                            {
                                duration: 1000,
                                easing: 'ease-out',
                                fill: 'forwards'
                            }
                        );
                        
                        // Remove particle after animation
                        setTimeout(() => {
                            if (particle.parentNode) {
                                particle.parentNode.removeChild(particle);
                            }
                        }, 1000);
                    }
                    
                    // 2. Show death message dialog
                    const deathMessage = document.createElement('div');
                    deathMessage.style.position = 'fixed';
                    deathMessage.style.top = '50%';
                    deathMessage.style.left = '50%';
                    deathMessage.style.transform = 'translate(-50%, -50%)';
                    deathMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                    deathMessage.style.color = '#FF0000';
                    deathMessage.style.padding = '30px';
                    deathMessage.style.borderRadius = '10px';
                    deathMessage.style.fontFamily = "'Press Start 2P', sans-serif";
                    deathMessage.style.fontSize = '24px';
                    deathMessage.style.textAlign = 'center';
                    deathMessage.style.zIndex = '10000';
                    deathMessage.style.border = '3px solid #FF0000';
                    deathMessage.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.5)';
                    deathMessage.style.width = '400px';
                    deathMessage.innerHTML = `
                        <div style="margin-bottom: 20px;">☠️ YOU DIED ☠️</div>
                        <div style="font-size: 16px; margin-bottom: 20px;">The zombies got you!</div>
                        <div style="font-size: 14px;">Respawning in 2 seconds...</div>
                    `;
                    
                    document.body.appendChild(deathMessage);
                    
                    // Remove message after delay
                    setTimeout(() => {
                        if (deathMessage.parentNode) {
                            deathMessage.parentNode.removeChild(deathMessage);
                        }
                    }, 2000);
                    
                    // 3. Reset the level after a short delay using page reload for reliability
                    setTimeout(() => {
                        // Clean up any lingering resources before reload
                        if (self && self.timerInterval) {
                            clearInterval(self.timerInterval);
                        }
                        
                        // Force a complete page reload - most reliable way to reset
                        location.reload();
                    }, 2000); // 2 second delay before reset
                }
            }
        }
    }

    start()
    {
        // create kills text
        const kills = document.createElement('div');
        kills.style.position = 'fixed';
        kills.style.top = '90%';
        kills.style.left = '10%';
        kills.style.transform = 'translate(-50%, -50%)';
        kills.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        kills.style.color = '#00ff0dff';
        kills.style.padding = '10px';
        kills.style.borderRadius = '10px';
        kills.style.fontFamily = "'Press Start 2P', sans-serif";
        kills.style.fontSize = '12px';
        kills.style.textAlign = 'center';
        kills.style.zIndex = '10000';
        kills.style.border = '1px solid #139b5cff';
        kills.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';
        kills.style.width = '200px';
        kills.innerHTML = `
            <div style="font-size: 14px;">${0} zombie kills</div>
        `;

        const tutorial = document.createElement('div');
        tutorial.style.position = 'fixed';
        tutorial.style.top = '80%';
        tutorial.style.right = '10%';
        tutorial.style.transform = 'translate(-50%, -50%)';
        tutorial.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        tutorial.style.color = '#3700ffff';
        tutorial.style.padding = '10px';
        tutorial.style.borderRadius = '10px';
        tutorial.style.fontFamily = "'Press Start 2P', sans-serif";
        tutorial.style.fontSize = '12px';
        tutorial.style.textAlign = 'center';
        tutorial.style.zIndex = '10000';
        tutorial.style.border = '1px solid #581066ff';
        tutorial.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';
        tutorial.style.width = '200px';
        tutorial.innerHTML = `
            <div>
            'W','A','S','D' to move around <br>
            'C' to shoot <br>
            Kill 10 zombies to progress <br>
            Press 'E' to enter the door at the end
            </div>
        `
        
        document.body.appendChild(tutorial);
        document.body.appendChild(kills);

        // update and collisions every 15 milliseconds
        setInterval(() => {
            this.updateZombies();
            this.checkCollisions();

            kills.innerHTML = `
                <div style="font-size: 14px;">${this.zombiesKilled} zombie kills</div>
            `;

            if (this.zombiesKilled >= 10 && this.spawnZombies) 
            {
                document.body.removeChild(tutorial);
                document.body.removeChild(kills);

                console.log("Level completed")
                this.spawnZombies = false;
                const finishDoor = new Npc(this.finishDoorData, this.gameEnv);
                this.gameEnv.gameObjects.push(finishDoor);
            }
        }, 15);
    }
}

export default MansionLevel5;