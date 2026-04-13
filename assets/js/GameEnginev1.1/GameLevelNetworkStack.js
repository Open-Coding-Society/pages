// GameLevelNetworkStack.js
// A simple collect-the-network-nodes game using GameEngine v1.1

import GameEnvBackground from './essentials/GameEnvBackground.js';
import Player from './essentials/Player.js';
import Npc from './essentials/Npc.js';

class GameLevelNetworkStack {
  constructor(gameEnv) {
    const width = gameEnv.innerWidth;
    const height = gameEnv.innerHeight;
    const path = gameEnv.path;

    this.collectedNodes = 0;
    this.totalNodes = 4;
    this.won = false;
    this.gameEnv = gameEnv;

    const bgData = {
      name: 'osi-stack',
      greeting: 'Learn the OSI stack by collecting the network nodes!',
      src: path + '/images/gamify/comics/network-stack/7-layers-of-osi-model.png',
      pixels: { height: 800, width: 1600 }
    };

    const playerData = {
      id: 'NetworkHero',
      greeting: 'Collect all nodes and reach full network sync!',
      src: path + '/images/gamify/chillguy.png',
      SCALE_FACTOR: 5,
      STEP_FACTOR: 900,
      ANIMATION_RATE: 50,
      INIT_POSITION: { x: width * 0.05, y: height * 0.85 },
      pixels: { height: 384, width: 512 },
      orientation: { rows: 4, columns: 3 },
      down: { row: 0, start: 0, columns: 3 },
      downRight: { row: 1, start: 0, columns: 3, rotate: Math.PI / 16 },
      downLeft: { row: 2, start: 0, columns: 3, rotate: -Math.PI / 16 },
      right: { row: 1, start: 0, columns: 3 },
      left: { row: 2, start: 0, columns: 3 },
      up: { row: 3, start: 0, columns: 3 },
      upRight: { row: 1, start: 0, columns: 3, rotate: -Math.PI / 16 },
      upLeft: { row: 2, start: 0, columns: 3, rotate: Math.PI / 16 },
      hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
      keypress: { up: 87, left: 65, down: 83, right: 68 }
    };

    const nodeSprites = [
      {
        id: 'AppNode',
        greeting: 'Application Layer node: interact with E to secure.',
        src: path + '/images/gamify/chillguy.png',
        SCALE_FACTOR: 6,
        ANIMATION_RATE: 40,
        INIT_POSITION: { x: width * 0.22, y: height * 0.30 },
        pixels: { height: 384, width: 512 },
        orientation: { rows: 4, columns: 3 },
        down: { row: 0, start: 0, columns: 3 },
        hitbox: { widthPercentage: 0.7, heightPercentage: 0.7 }
      },
      {
        id: 'NetworkNode',
        greeting: 'Network Layer node: interact with E to secure.',
        src: path + '/images/gamify/chillguy.png',
        SCALE_FACTOR: 6,
        ANIMATION_RATE: 40,
        INIT_POSITION: { x: width * 0.52, y: height * 0.32 },
        pixels: { height: 384, width: 512 },
        orientation: { rows: 4, columns: 3 },
        down: { row: 0, start: 0, columns: 3 },
        hitbox: { widthPercentage: 0.7, heightPercentage: 0.7 }
      },
      {
        id: 'TransportNode',
        greeting: 'Transport Layer node: interact with E to secure.',
        src: path + '/images/gamify/chillguy.png',
        SCALE_FACTOR: 6,
        ANIMATION_RATE: 40,
        INIT_POSITION: { x: width * 0.30, y: height * 0.60 },
        pixels: { height: 384, width: 512 },
        orientation: { rows: 4, columns: 3 },
        down: { row: 0, start: 0, columns: 3 },
        hitbox: { widthPercentage: 0.7, heightPercentage: 0.7 }
      },
      {
        id: 'DataLinkNode',
        greeting: 'Data Link Layer node: interact with E to secure.',
        src: path + '/images/gamify/chillguy.png',
        SCALE_FACTOR: 6,
        ANIMATION_RATE: 40,
        INIT_POSITION: { x: width * 0.70, y: height * 0.52 },
        pixels: { height: 384, width: 512 },
        orientation: { rows: 4, columns: 3 },
        down: { row: 0, start: 0, columns: 3 },
        hitbox: { widthPercentage: 0.7, heightPercentage: 0.7 }
      }
    ];

    // helper to collect node
    const collectNode = (node) => {
      if (!node || !node.visible) return;
      node.visible = false;
      if (node.canvas) node.style.display = 'none';
      this.collectedNodes += 1;
      if (this.collectedNodes >= this.totalNodes && !this.won) {
        this.won = true;
        if (this.gameEnv && this.gameEnv.gameControl) {
          setTimeout(() => {
            alert('🎉 All network nodes secured! Level complete!');
            this.gameEnv.gameControl.endLevel();
          }, 100);
        }
      }
    };

    const nodeObjects = nodeSprites.map(data => ({
      class: Npc,
      data: {
        ...data,
        visible: true,
        interact: function () {
          collectNode(this);
        },
        reaction: function () {
          // Inform the player to press E to collect
          if (this.dialogueSystem) {
            this.showReactionDialogue();
          } else {
            console.log(this.greeting);
          }
        }
      }
    }));

    this.classes = [
      { class: GameEnvBackground, data: bgData },
      { class: Player, data: playerData },
      ...nodeObjects
    ];
  }

  initialize() {
    this.collectedNodes = 0;
    this.won = false;
  }

  update() {
    const ctx = this.gameEnv.ctx;
    if (!ctx) return;

    ctx.save();
    ctx.font = '24px monospace';
    ctx.fillStyle = 'rgba(0,180,255,0.9)';
    ctx.fillText(`Network nodes secure: ${this.collectedNodes} / ${this.totalNodes}`, 16, 34);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`Press E when you touch a node`, 16, 64);
    if (this.won) {
      ctx.fillStyle = '#00FF00';
      ctx.fillText('Network stack synchronized! Good job! ', 16, 94);
    }
    ctx.restore();
  }
}

export default GameLevelNetworkStack;
