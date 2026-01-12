class GameObject {
    constructor(canvas2D/* ADD STUFF HERE
    add some parameters here to customize game object (maybe width, height, color, x/y position, etc.) */) {
        this.c = canvas2D;
        /* ADD STUFF HERE
     set appropriate properites here */
    }
    update() {
        /* ADD STUFF HERE
     draw this object on the canvas*/
    }
   isCollidingWith(player) {
       /* ADD STUFF HERE (PART 2)
     (part 2) - check if this game object is colliding with the player, return true or false */
   }
}