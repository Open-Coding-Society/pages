// To build GameLevels, each contains GameObjects from below imports
import Background from './Background.js'

// Define the assets
const assets = {  
  backgrounds: {
    start: { src: "/images/platformer/backgrounds/water.png" },
  },
};

// Hills Game Level defintion...
const objects = [
  // GameObject(s), the order is important to z-index...
  { name: 'start', id: 'background', class: Background, data: assets.backgrounds.start },
];

const GameSetterStart = {
  tag: 'Start',
  assets: assets,
  objects: objects
};

export default GameSetterStart;