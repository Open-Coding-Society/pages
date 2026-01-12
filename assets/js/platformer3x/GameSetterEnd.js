// GameSetHills.js Key objective is to define objects for a GameLevel
import GameSet from './GameSet.js';
// To build GameLevels, each contains GameObjects from below imports
import Background from './Background.js'

// Define the assets
const assets = {  
  backgrounds: {
    end: { src: "/images/platformer/backgrounds/game_over.png" },
  },
};

// Hills Game Level defintion...
const objects = [
  // GameObject(s), the order is important to z-index...
  { name: 'end', id: 'background', class: Background, data: assets.backgrounds.end },
];

const GameSetterEnd = {
  tag: 'End',
  assets: assets,
  objects: objects
};

export default GameSetterEnd;
