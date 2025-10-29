import GameObject from './GameObject.js';

/*
boomerang objects are projectiles that travel in an ellipse from
(sourcex, sourcey) to (targetx, targety)

Used to create the scythe in Quest of Spook final boss battle (tinkerers)
*/

// Template class -- VERIFY THIS
class Boomerang extends GameObject {
    constructor(gameEnv = null, targetx, targety, sourcex, sourcey) {
        super(gameEnv);
        // Add code here for the Scythe the Reaper weilds

        // finalized ellipse attributes, DO NOT CHANGE this - tinkerers
        this.target_coords = (targetx, targety); // player coords at scythe thrown
        this.source_coords = (sourcex, sourcey); // reaper coords at scythe thrown
        this.ellipse_center = ((targetx+sourcex)/2, (targety+sourcey)/2);
        this.ellipse_width = Math.sqrt((targetx-sourcex)**2 + (targety-sourcey)**2);
        this.ellipse_height = this.ellipse_height/20;
        this.ellipse_tilt = Math.atan((sourcey-targety)/(sourcex-targetx));
        this.radian_prog = 0;

        this.revComplete = false;
    }

    update(){
        if (this.radian_prog > Math.PI*2){
            this.revComplete = true;
            return true; // already reached boss
        } else {
            this.radian_prog += .05; // experiment with diff radian increments to change speed
            let x_coord = (
                this.ellipse_center[0] + 
                (this.ellipse_width/2)*Math.cos(this.radian_prog)*Math.cos(this.ellipse_tilt) -
                (this.ellipse_height)*Math.sin(this.radian_prog)*Math.sin(this.ellipse_tilt)
            );

            let y_coord = (
                this.ellipse_center[1] +
                (this.ellipse_width/2)*Math.cos(this.radian_prog)*Math.sin(this.ellipse_tilt) +
                (this.ellipse_height)*Math.sin(this.radian_prog)*Math.cos(this.ellipse_tilt)
            );

            this.position.x = x_coord;
            this.position.y = y_coord;

        }
    }  
}

export default Boomerang;