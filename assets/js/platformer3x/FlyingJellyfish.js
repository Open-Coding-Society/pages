import FlyingEnemy from './FlyingEnemy.js';

export class Jellyfish extends FlyingEnemy {
  
    // constructors sets up Character object 
    constructor(canvas, image, data, xPercentage, yPercentage, name, minPosition){
        super(canvas, image, data, xPercentage, yPercentage, name, minPosition);
        this.enemySpeed();
    }
    update() {
        super.update();

    }
}

export default Jellyfish;