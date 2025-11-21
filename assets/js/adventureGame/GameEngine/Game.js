import CoreGame from '../../GameEngine/Game.js';
import GameControl from './GameControl.js';

export default {
    main: (environment) => CoreGame.main(environment, GameControl)
};