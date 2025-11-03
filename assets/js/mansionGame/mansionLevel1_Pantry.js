import GameEnvBackground  from "./GameEngine/GameEnvBackground.js";
import Player from "./GameEngine/Player.js";
import Npc from "./GameEngine/Npc.js";
import DialogueSystem from "./GameEngine/DialogueSystem.js";
import MansionLevelMain from './mansionLevelMain.js';

class MansionLevel1_Pantry {
  constructor(gameEnv) {
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    function fadeOutAudioPromise(audio, durationMs = 800) {
      return new Promise(resolve => {
        if (!audio) return resolve();
        const initial = typeof audio.volume === 'number' ? audio.volume : 1;
        const stepMs = 50;
        const steps = Math.max(1, Math.floor(durationMs / stepMs));
        let currentStep = 0;
        const iv = setInterval(() => {
          currentStep++;
          const t = currentStep / steps;
          audio.volume = Math.max(0, initial * (1 - t));
          if (currentStep >= steps) {
            clearInterval(iv);
            audio.volume = 0;
            resolve();
          }
        }, stepMs);
      });
    }

    // Background data
    const image_background = path + "/images/mansionGame/kitchen_pantry.png"; // be sure to include the path
    const image_data_background = {
        name: 'background',
        greeting: "This is the pantry, you will search for ingredients and create a potion.",
        src: image_background,
        pixels: {height: 580, width: 1038},
        mode: 'contain',
    };

    // Update your objective_sprite_data to be more compatible with a Sprite/Npc class:
    const objective_sprite_data = {
        id: 'ObjectiveIcon',
        greeting: "Objective Icon: Find ingredients!",
        src: path + "/images/gamify/objective.png",
        
        // Npc/Sprite required properties
        SCALE_FACTOR: 2, 
        STEP_FACTOR: 0, 
        ANIMATION_RATE: 0, 
    
        // Positioning
        INIT_POSITION: { x: 300, y: 50 }, 
    
        // Image info
        pixels: {height: 606, width: 671}, 
        orientation: {rows: 1, columns: 1}, 
        down: {row: 0, start: 0, columns: 1}, // Required for Npc/Sprite animation initialization
        hitbox: {widthPercentage: 1.0, heightPercentage: 1.0}, // Basic hitbox

        // keypress (optional, but good to set if the Npc class expects it)
        keypress: {} 
    };

    // --- Collectible items setup ---
    // We'll track collected items locally for this pantry level only
    const collectedItems = new Set();

    // Helper: cross off an entry visually on the objective canvas by drawing an X
    function crossOffObjective(itemIndex) {
      // find the objective object instance
      const objectiveObj = gameEnv.gameObjects.find(o => o && o.spriteData && o.spriteData.id === 'ObjectiveIcon');
      if (!objectiveObj || !objectiveObj.canvas) return;

      try {
        // Copy the current objective canvas into an offscreen canvas
        const srcCanvas = objectiveObj.canvas;
        const w = srcCanvas.width;
        const h = srcCanvas.height;
        const off = document.createElement('canvas');
        off.width = w;
        off.height = h;
        const offCtx = off.getContext('2d');

        // Draw the objective's current rendered canvas (this captures its current look)
        offCtx.drawImage(srcCanvas, 0, 0, w, h);

  // Draw a smaller red X stacked vertically on the right side
  const paddingRight = Math.floor(w * 0.06);
  const startY = Math.floor(h * 0.255);
  const gapY = Math.floor(h * 0.064);

  const slotX = w - paddingRight - 555;
  const slotY = startY + (itemIndex * gapY);

  // Make the Xs slightly smaller than before
  const size = Math.max(3, Math.floor(Math.min(w, h) / 48));

  offCtx.strokeStyle = 'white';
  offCtx.lineWidth = Math.max(6, Math.floor(size / 3));

  // Add shadow
  offCtx.shadowColor = 'black';
  offCtx.shadowBlur = Math.floor(size / 1.5);
  offCtx.shadowOffsetX = 2;
  offCtx.shadowOffsetY = 2;

  offCtx.beginPath();
  offCtx.moveTo(slotX - size, slotY - size);
  offCtx.lineTo(slotX + size, slotY + size);
  offCtx.moveTo(slotX + size, slotY - size);
  offCtx.lineTo(slotX - size, slotY + size);
  offCtx.stroke();

  // Reset shadow settings so they don’t affect later drawings
  offCtx.shadowColor = 'transparent';
  offCtx.shadowBlur = 0;
  offCtx.shadowOffsetX = 0;
  offCtx.shadowOffsetY = 0;

        // Replace the objective object's spriteSheet with the new marked image so the mark persists
        const dataURL = off.toDataURL();
        const newImg = new Image();
        newImg.src = dataURL;
        newImg.onload = () => {
          objectiveObj.spriteSheet = newImg;
          // force a redraw
          objectiveObj.draw && objectiveObj.draw();
        };
      } catch (e) {
        console.warn('Failed to cross off objective:', e);
      }
    }

  // Helper: remove an item instance by id and mark objective
    function collectItem(itemId) {
      // find instance
      const obj = gameEnv.gameObjects.find(o => o && o.spriteData && o.spriteData.id === itemId);
      if (obj) {
        // Destroy the object (removes canvas and from gameObjects)
        try { obj.destroy(); } catch (e) { console.warn(e); }
      }
      if (!collectedItems.has(itemId)) {
        collectedItems.add(itemId);
        // cross off the next slot (order determined by itemsOrder)
        const itemsOrder = ['pumpkin_seed', 'candy_apple', 'pepper', 'candycorn'];
        const idx = itemsOrder.indexOf(itemId.toLowerCase()) >= 0 ? itemsOrder.indexOf(itemId.toLowerCase()) : collectedItems.size-1;
        crossOffObjective(idx);
      }

      // final win condition
      if (collectedItems.size >= 4) {
  // small delay so UI updates first, then show a DialogueSystem modal instead of alert
    const sharedMusic = (gameEnv && gameEnv.gameControl) ? gameEnv.gameControl.levelMusic : null;
    fadeOutAudioPromise(sharedMusic, 800).then(() => {
      try {
        if (sharedMusic) {
          try { sharedMusic.pause(); } catch(e) {}
          try { sharedMusic.currentTime = 0; } catch(e) {}
        }
      } catch(e) { /* ignore */ }
    });

      setTimeout(() => {
        try {
          const dsFinal = new DialogueSystem({ id: 'collected_all' + Math.random().toString(36).slice(2, 8) });
          dsFinal.showDialogue('You have collected all the items and completed the level! Click "Collect Key" to exit.', 'Pantry');
          dsFinal.addButtons([
            {
              text: 'COLLECT KEY',
              primary: true,
              action: () => {
              dsFinal.closeDialogue();
            // create the skeleton key image element
              const keyImg = document.createElement('img');
              keyImg.src = '/images/mansionGame/skeleton_key.png'; // <-- change this to your actual image path
              keyImg.alt = 'Skeleton Key';
              keyImg.style.position = 'fixed';
              keyImg.style.top = '50%';
              keyImg.style.left = '50%';
              keyImg.style.transform = 'translate(-50%, -50%) scale(1)';
              keyImg.style.width = '200px';
              keyImg.style.opacity = '0';
              keyImg.style.transition = 'opacity 1s ease, transform 2s ease';
              keyImg.style.zIndex = '9999';
              document.body.appendChild(keyImg);

              keyImg.style.filter = 'drop-shadow(0 0 25px white)';
              keyImg.style.animation = 'keyGlow 2s ease-in-out infinite alternate';

              // Create a keyframe animation for the glow pulse

              const levelMusic = new Audio(path + "/assets/sounds/mansionGame/victory_sound.mp3");
              levelMusic.loop = false;
              levelMusic.volume = 0.1;
              levelMusic.play().catch(err => console.warn('Level music failed to play:', err));

              const styleSheet = document.createElement('style');
              styleSheet.textContent = `
              @keyframes keyGlow {
                0% {
                  filter: drop-shadow(0 0 10px gold) drop-shadow(0 0 20px white);
                }
                100% {
                  filter: drop-shadow(0 0 30px gold) drop-shadow(0 0 50px white);
                }
              }`;
              document.head.appendChild(styleSheet);

              document.body.appendChild(keyImg);

            // fade in
              requestAnimationFrame(() => {
                keyImg.style.opacity = '1';
                keyImg.style.transform = 'translate(-50%, -50%) scale(1.2)';
              });

            // after fade-in, wait then fade out and return to main world
              setTimeout(() => {
                keyImg.style.opacity = '0';
                keyImg.style.transform = 'translate(-50%, -50%) scale(0.8)';

              setTimeout(() => {
                keyImg.remove();

                // === RETURN TO MAIN WORLD LOGIC ===
                if (typeof gameEnv !== 'undefined' && gameEnv.gameControl) {
                  const gameControl = gameEnv.gameControl;

                  // If original level classes (like MansionLevelMain) are stored, restore them
                  gameControl.levelClasses = [MansionLevelMain];
                  gameControl.currentLevelIndex = 0;
                  gameControl.isPaused = false;
                  gameControl.transitionToLevel();
                } else {
                  console.warn('Game environment not found — cannot return to main world.');
                }
              }, 1500); // fade-out delay
            }, 2000); // display key duration
          }
        }
      ]);
    } catch (e) {
      // fallback to alert if DialogueSystem fails for any reason
      alert('You have collected all the items!');
    }
  }, 50);
}
    }

    // Create sprite data helper for items
    // scaleFactor is adjustable per-item (default 8) so you can tweak size easily.
    function makeItemData(id, filename, initX, initY, scaleFactor = 10) {
      return {
        id,
        greeting: `Collectable: ${id}`,
        src: path + '/images/mansionGame/' + filename,
        // Scale factor is adjustable per item
        SCALE_FACTOR: scaleFactor,
        ANIMATION_RATE: 100,
        pixels: { width: 128, height: 128 },
        INIT_POSITION: { x: initX, y: initY },
        orientation: { rows: 1, columns: 1 },
        down: { row: 0, start: 0, columns: 1 },
        hitbox: { widthPercentage: 0.35, heightPercentage: 0.35 }
      };
    }

    // Create small Collectible classes that extend Npc so they get proper canvas and lifecycle
    class CollectibleItem extends Npc {
      constructor(data, gameEnvLocal) {
        super(data, gameEnvLocal);
        // ensure id and spriteData are set
        this.spriteData = data;
      }

      // Show a dialog when item is collected, then remove it on Close
      showItemMessage() {
        const ds = new DialogueSystem({ id: 'collect_' + this.spriteData.id });
        ds.showDialogue(`You found the ${this.spriteData.id.replace('_', ' ')}`, '', this.spriteData.src, `!`);
        ds.addButtons([
          { text: 'Collect', primary: true, action: () => { ds.closeDialogue(); try { collectItem(this.spriteData.id); } catch (e) { console.warn(e); } } }
        ]);
      }
    }

    class PepperItem extends CollectibleItem {
      constructor(data, gameEnvLocal) {
        super(data, gameEnvLocal);
      }

      showItemMessage() {
        const ds = new DialogueSystem({ id: 'pepper_q_' + Math.random().toString(36).slice(2,8) });

        // Question 1
        const q1 = {
          text: 'What is a boolean?',
          options: [
            { text: 'A list of numbers', correct: false },
            { text: 'A true/false variable', correct: true },
            { text: 'A loop construct', correct: false }
          ]
        };

        // Question 2
        const q2 = {
          text: 'Which is an example of an API?',
          options: [
            { text: 'Application Programming Interface', correct: true },
            { text: 'Advanced Process Input', correct: false },
            { text: 'Automated Print Instruction', correct: false }
          ]
        };

        let q1Correct = false;
        let q2Correct = false;

        // Helper to show Q2 after Q1
        const showQ2 = () => {
          ds.showDialogue(q2.text, 'CS Question');
          ds.addButtons(q2.options.map(opt => ({ text: opt.text, primary: opt.correct, action: () => {
            q2Correct = !!opt.correct;
            ds.closeDialogue();
            finishCheck();
          }})));
        };

        const finishCheck = () => {
          if (q1Correct && q2Correct) {
            const ds2 = new DialogueSystem({ id: 'pepper_success_' + Math.random().toString(36).slice(2,8) });
            ds2.showDialogue('Correct! You may take the pepper.', 'Success');
            ds2.addButtons([{ text: 'Collect', primary: true, action: () => { ds2.closeDialogue(); collectItem('pepper'); } }]);
          } else {
            const ds3 = new DialogueSystem({ id: 'pepper_fail_' + Math.random().toString(36).slice(2,8) });
            ds3.showDialogue('One or more answers were incorrect. You must answer both correctly to collect the pepper.', 'Try Again');
          }
        };

        // Show Q1
        ds.showDialogue(q1.text, 'CS Question');
        ds.addButtons(q1.options.map(opt => ({ text: opt.text, primary: opt.correct, action: () => {
          q1Correct = !!opt.correct;
          ds.closeDialogue();
          showQ2();
        }})));
      }
    }

    // Specific pepper reaction with two CS questions before collecting
  // You can tweak these per-item scale factors (numbers are suggested defaults)
  const candycornScale = 20;
  const candyAppleScale = 20;
  const pepperScale = 20;
  const pumpkinSeedScale = 20;

  // Ensure pepper is within x:0.3-0.7 range and y:0.1-0.9
  const pepperData = makeItemData('pepper', 'pepper.png', (width * 0.63), (height * 0.45), pepperScale);

    // Other items
  // Place all items within x:0.3-0.7 and y:0.1-0.9 (scale adjustable above)
  const candycornData = makeItemData('candycorn', 'candycorn.png', (width * 0.4), (height * 0.19), candycornScale);
  const candyAppleData = makeItemData('candy_apple', 'candy_apple.png', (width * 0.6), (height * 0.18), candyAppleScale);
  const pumpkinSeedData = makeItemData('pumpkin_seed', 'pumpkin_seed.png', (width * 0.63), (height * 0.77), pumpkinSeedScale);

  // Wire reactions so that when the engine triggers the spriteData.reaction, it will open the
  // per-item DialogueSystem confirmation and then call collectItem on Close.
  [candycornData, candyAppleData, pumpkinSeedData, pepperData].forEach(d => {
    // keep closure id
    const id = d.id;
    d.reaction = function() {
      try {
        const inst = gameEnv.gameObjects.find(o => o && o.spriteData && o.spriteData.id === id);
        if (inst && typeof inst.showItemMessage === 'function') {
          inst.showItemMessage();
        } else {
          // fallback: immediate collect
          collectItem(id);
        }
      } catch (e) { console.warn('collect reaction failed', e); }
    };
  });

    ////////// new code end

    const sprite_src_mc = path + "/images/gamify/spookMcWalk.png"; // be sure to include the path
        const MC_SCALE_FACTOR = 6;
        const sprite_data_mc = {
            id: 'Spook',
            greeting: "Hi, I am Spook.",
            src: sprite_src_mc,
            SCALE_FACTOR: MC_SCALE_FACTOR,
            STEP_FACTOR: 800,
            ANIMATION_RATE: 10,
            INIT_POSITION: { x: (width / 2 - width / (5 * MC_SCALE_FACTOR)), y: height - (height / MC_SCALE_FACTOR)}, 
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
            hitbox: {widthPercentage: 0.45, heightPercentage: 0.2},
            keypress: {up: 87, left: 65, down: 83, right: 68} // W, A, S, D
        };

    // List of objects definitions for this level (include collectibles)
    this.classes = [
      { class: GameEnvBackground, data: image_data_background },
      { class: Npc, data: objective_sprite_data },
      { class: Player, data: sprite_data_mc },
      // Collectible items use the custom CollectibleItem / PepperItem classes so
      // the dialog and MCQ behavior work as implemented above.
      { class: CollectibleItem, data: candycornData },
      { class: CollectibleItem, data: candyAppleData },
      { class: PepperItem, data: pepperData },
      { class: CollectibleItem, data: pumpkinSeedData }
    ];
  }

}

export default MansionLevel1_Pantry;