// tile.js
export class Tile {
    static spriteLibrary = [
        null,                          // 0 - empty
        "/images/block-unlock/block.png",       // 1 - Block
        "/images/block-unlock/pusher.png",     // 2 - Pusher
        "/images/block-unlock/heavy.png",      // 3 - Heavy Block
        "/images/block-unlock/rotater.png",    // 4 - Rotater
        "/images/block-unlock/sliderH.png",    // 5 - Slider Horizontal
        "/images/block-unlock/sliderV.png",    // 6 - Slider Vertical
        "/images/block-unlock/key.png",        // 7 - Key
        "/images/block-unlock/door.png",       // 8 - Door
        "/images/block-unlock/immovable.png"   // 9 - Immoveable
    ];

    constructor(cords, tileState, direction = 'north') {
        this.CordLocation = cords;
        this.State = tileState;
        this.direction = ['north','east','south','west'].includes(direction) ? direction : 'north';
        this.isMoving = false;
    }

    get sprite() {
        return Tile.spriteLibrary[this.State] || null;
    }

    isPusher() {
        return this.State === 2;
    }

    setDirection(direction) {
        const valid = ['north','east','south','west'];
        if (!valid.includes(direction)) return false;
        this.direction = direction;
        return true;
    }

    rotateClockwise() {
        const order = ['north','east','south','west'];
        const idx = order.indexOf(this.direction);
        this.direction = order[(idx+1)%4];
        return this.direction;
    }

    rotateCounterClockwise() {
        const order = ['north','east','south','west'];
        const idx = order.indexOf(this.direction);
        this.direction = order[(idx+3)%4];
        return this.direction;
    }

    startPushing(grid) {
        // Only start if tile is pusher, not already moving, AND game started
        if (!this.isPusher() || this.isMoving || !grid.startGame) return false;
        this.isMoving = true;
        this._continuousPush(grid);
        return true;
    }

    _continuousPush(grid) {
        if (!this.isMoving) return;
        const dirMap = {"north":[0,-1],"east":[1,0],"south":[0,1],"west":[-1,0]};
        const [dx,dy] = dirMap[this.direction] ?? [0,0];
        const [x,y] = this.CordLocation;
        const nextX = x+dx, nextY = y+dy;
        if (nextX<0||nextX>=grid.Xsize||nextY<0||nextY>=grid.Ysize) { this.isMoving=false; return; }
        const nextKey = `${nextX},${nextY}`;
        const nextTile = grid.tileMap[nextKey];

        if (!nextTile || nextTile.State===0) {
            this._moveTo(grid,nextX,nextY);
            setTimeout(()=>this._continuousPush(grid),100);
        } else if (nextTile.State===9) {
            this.isMoving=false;
        } else {
            if (this._canPushBlock(grid,nextX,nextY,dx,dy)) {
                this._pushBlock(grid,nextX,nextY,dx,dy);
                this._moveTo(grid,nextX,nextY);
                setTimeout(()=>this._continuousPush(grid),100);
            } else this.isMoving=false;
        }
    }

    _moveTo(grid,toX,toY){
        const [fromX,fromY]=this.CordLocation;
        delete grid.tileMap[`${fromX},${fromY}`];
        grid.set(fromX,fromY,0);
        this.CordLocation=[toX,toY];
        grid.tileMap[`${toX},${toY}`]=this;
        grid.set(toX,toY,this.State);
    }

    _canPushBlock(grid,startX,startY,dx,dy){
        const blocks=[];
        let cx=startX, cy=startY;
        while(cx>=0&&cx<grid.Xsize&&cy>=0&&cy<grid.Ysize){
            const key=`${cx},${cy}`;
            const t=grid.tileMap[key];
            if(!t||t.State===0) break;
            else if(t.State===9) return false;
            else {blocks.push(t); cx+=dx; cy+=dy;}
        }
        if(cx<0||cx>=grid.Xsize||cy<0||cy>=grid.Ysize) return false;
        return blocks.length>0;
    }

    _pushBlock(grid,startX,startY,dx,dy){
        const blocks=[];
        let cx=startX, cy=startY;
        while(cx>=0&&cx<grid.Xsize&&cy>=0&&cy<grid.Ysize){
            const key=`${cx},${cy}`;
            const t=grid.tileMap[key];
            if(!t||t.State===0) break;
            else if(t.State===9) return;
            else {blocks.push(t); cx+=dx; cy+=dy;}
        }
        for(let i=blocks.length-1;i>=0;i--){
            const b=blocks[i];
            const [ox,oy]=b.CordLocation;
            const nx=ox+dx, ny=oy+dy;
            delete grid.tileMap[`${ox},${oy}`];
            b.CordLocation=[nx,ny];
            grid.tileMap[`${nx},${ny}`]=b;
            grid.set(ox,oy,0);
            grid.set(nx,ny,b.State);
        }
    }

    stopPushing(){this.isMoving=false;}
}
