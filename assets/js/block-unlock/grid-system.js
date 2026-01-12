// CHANGES v1.5: Fixed level completion to detect ADJACENT tiles (touching), not same position. Enhanced reset debugging.
import { Tile } from "/assets/js/block-unlock/tile.js";

export class Grid {
    static currentGridData = null;
    static tileLibrary = [1,2,3,4,5,6,7,8,9];

    constructor(Xsize,Ysize,defaultValue=0){
        this.Xsize=Xsize;
        this.Ysize=Ysize;
        this.grid=Array.from({length:Ysize},()=>Array(Xsize).fill(defaultValue));
        this.tileMap={};
        this.subscribers=[];
        this.selectedTile=null;
        this.startGame=false;
        this.borders = []; // Array of border objects {x, y, directions: ['n','s','e','w']}
        this.onLevelComplete = null; // Callback for level completion
        this.isCheckingCompletion = false; // Prevent multiple completion triggers
    }

    SetToGrid(){ Grid.currentGridData=this; }
    subscribe(cb){ this.subscribers.push(cb); }
    notify(x,y){ for(const cb of this.subscribers) cb(x,y,this.get(x,y)); }

    set(x,y,value){ 
        if(x<0||x>=this.Xsize||y<0||y>=this.Ysize) return; 
        this.grid[y][x]=value; 
        this.notify(x,y); 
        
        // Check for level completion after EVERY grid change
        // Use setTimeout to let the grid update complete first
        setTimeout(() => this.checkLevelCompletion(), 50);
    }
    get(x,y){ if(x<0||x>=this.Xsize||y<0||y>=this.Ysize) return null; return this.grid[y][x]; }

    addTile(tile){ if(!tile.direction) tile.direction='north'; const [x,y]=tile.CordLocation; this.tileMap[`${x},${y}`]=tile; this.set(x,y,tile.State); }

    // Add border system
    addBorder(x, y, directions) {
        // directions should be array like ['n', 's', 'e', 'w'] or ['n'] etc.
        if (!Array.isArray(directions)) directions = [directions];
        const validDirs = directions.filter(d => ['n','s','e','w'].includes(d));
        if (validDirs.length > 0) {
            this.borders.push({x, y, directions: validDirs});
        }
    }

    // Check if a position has borders and in which directions
    getBorder(x, y) {
        return this.borders.find(b => b.x === x && b.y === y);
    }

    // Check if a position is placeable (inside border area)
    isPlaceable(x, y) {
        const border = this.getBorder(x, y);
        return border !== undefined;
    }

    // Place tile at position (for number key placement)
    placeTile(x, y, tileState) {
        console.log(`placeTile called: (${x}, ${y}), state: ${tileState}`);
        
        // Check if position is placeable
        if (!this.isPlaceable(x, y)) {
            console.log("Cannot place tile - not in placeable area");
            return false;
        }

        // Don't allow placing keys (7), doors (8), immovable blocks (9), or empty blocks (0)
        if ([0, 7, 8, 9].includes(tileState)) {
            console.log("Cannot place this tile type");
            return false;
        }

        // Remove existing tile if any
        const key = `${x},${y}`;
        if (this.tileMap[key]) {
            console.log("Removing existing tile at position");
            delete this.tileMap[key];
        }

        // Place new tile with proper direction initialization
        const newTile = new Tile([x, y], tileState, 'north');
        console.log(`Created new tile - isPusher: ${newTile.isPusher()}, direction: ${newTile.direction}`);
        
        this.tileMap[key] = newTile;
        this.set(x, y, tileState);
        console.log(`Successfully placed tile ${tileState} at (${x}, ${y})`);
        console.log(`Tile in map - isPusher: ${this.tileMap[key].isPusher()}`);
        return true;
    }

    selectTile(coords){
        const [x,y]=Array.isArray(coords)?coords:[coords,arguments[1]];
        const key=`${x},${y}`;
        const tile=this.tileMap[key];
        
        console.log(`Selecting tile at (${x}, ${y}), placeable: ${this.isPlaceable(x, y)}, tile exists: ${!!tile}`);
        
        // Allow selection of empty placeable areas OR existing tiles in placeable areas
        if (!this.isPlaceable(x, y)) {
            console.log("Cannot select tile - not in placeable area");
            this.selectedTile = null;
            return;
        }
        
        // Can select existing tiles (except immovable blocks) OR empty placeable spaces
        if (tile && tile.State !== 0 && tile.State !== 9) {
            this.selectedTile = tile;
            console.log(`Selected existing tile with state ${tile.State}`);
        } else if (!tile || tile.State === 0) {
            // Allow selection of empty spaces in placeable areas for tile placement
            this.selectedTile = null;
            console.log("Selected empty placeable space");
        } else {
            this.selectedTile = null;
        }
    }

    moveSelected(direction){
        if(!this.selectedTile) return;
        const map={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
        const [dx,dy]=map[direction];
        if(dx===undefined&&dy===undefined) return;

        const [sx,sy]=this.selectedTile.CordLocation;
        const tilesToMove=[];
        if(dx!==0){
            let curX=sx;
            while(curX>=0&&curX<this.Xsize){
                const t=this.tileMap[`${curX},${sy}`];
                if(t&&t.State!==0){ 
                    if(t.State===9) return; 
                    // Check if tile is in placeable area
                    if(!this.isPlaceable(curX, sy)) return;
                    tilesToMove.push(t); 
                } else break;
                curX+=dx;
            }
            const last=tilesToMove[tilesToMove.length-1];
            const newX=last.CordLocation[0]+dx;
            // Check if destination is in placeable area and valid
            if(newX<0||newX>=this.Xsize|| !this.isPlaceable(newX, sy) || (this.tileMap[`${newX},${sy}`]&&this.tileMap[`${newX},${sy}`].State!==0)) return;
        } else if(dy!==0){
            let curY=sy;
            while(curY>=0&&curY<this.Ysize){
                const t=this.tileMap[`${sx},${curY}`];
                if(t&&t.State!==0){ 
                    if(t.State===9) return; 
                    // Check if tile is in placeable area
                    if(!this.isPlaceable(sx, curY)) return;
                    tilesToMove.push(t); 
                } else break;
                curY+=dy;
            }
            const last=tilesToMove[tilesToMove.length-1];
            const newY=last.CordLocation[1]+dy;
            // Check if destination is in placeable area and valid
            if(newY<0||newY>=this.Ysize|| !this.isPlaceable(sx, newY) || (this.tileMap[`${sx},${newY}`]&&this.tileMap[`${sx},${newY}`].State!==0)) return;
        }

        for(let i=tilesToMove.length-1;i>=0;i--){
            const t=tilesToMove[i];
            const [ox,oy]=t.CordLocation;
            const nx=ox+dx, ny=oy+dy;
            delete this.tileMap[`${ox},${oy}`];
            t.CordLocation=[nx,ny];
            this.tileMap[`${nx},${ny}`]=t;
            this.set(ox,oy,0);
            this.set(nx,ny,t.State);
        }
        this.selectedTile=tilesToMove.find(t=>t===this.selectedTile);
    }

    startPushers(){ 
        console.log("=== START PUSHERS CALLED ===");
        console.log("startGame flag:", this.startGame);
        console.log("Total tiles in map:", Object.keys(this.tileMap).length);
        
        let pusherCount = 0;
        let startedCount = 0;
        
        for(const k in this.tileMap){ 
            const t=this.tileMap[k]; 
            if(t && t.isPusher()) {
                pusherCount++;
                console.log(`Found pusher at ${k}, direction: ${t.direction}, isMoving: ${t.isMoving}`);
                const started = t.startPushing(this);
                if(started) startedCount++;
                console.log(`Pusher start result:`, started);
            }
        }
        
        console.log(`Total pushers found: ${pusherCount}, Successfully started: ${startedCount}`);
        console.log("=== END START PUSHERS ===");
    }
    stopAllPushers(){ for(const k in this.tileMap){ const t=this.tileMap[k]; if(t && t.isPusher()) t.stopPushing(); } }

    rotateSelected(clockwise=true){
        if(!this.selectedTile) return;
        if(clockwise) this.selectedTile.rotateClockwise();
        else this.selectedTile.rotateCounterClockwise();
        const [x,y]=this.selectedTile.CordLocation;
        this.notify(x,y);
    }

    // Clear all tiles and borders (for loading new levels)
    clearLevel() {
        console.log("╔════════════════════════════════════╗");
        console.log("║   CLEARING LEVEL - START          ║");
        console.log("╚════════════════════════════════════╝");
        console.log("📊 Before Clear:");
        console.log("  - Total tiles:", Object.keys(this.tileMap).length);
        console.log("  - Tile positions:", Object.keys(this.tileMap));
        console.log("  - Total borders:", this.borders.length);
        console.log("  - startGame flag:", this.startGame);
        
        // Stop all pushers first
        console.log("🛑 Stopping all pushers...");
        this.stopAllPushers();
        
        // Clear everything
        console.log("🗑️ Clearing tileMap...");
        this.tileMap = {};
        
        console.log("🗑️ Clearing borders...");
        this.borders = [];
        
        console.log("🗑️ Clearing selection...");
        this.selectedTile = null;
        
        console.log("🗑️ Resetting completion flag...");
        this.isCheckingCompletion = false;
        
        console.log("✅ Keeping startGame as:", this.startGame);
        
        // Reset grid to empty
        console.log("🧹 Resetting all grid cells to 0...");
        for(let y = 0; y < this.Ysize; y++) {
            for(let x = 0; x < this.Xsize; x++) {
                this.grid[y][x] = 0;
            }
        }
        
        // Notify all cells to update visuals
        console.log("📢 Notifying all cells for visual update...");
        for(let y = 0; y < this.Ysize; y++) {
            for(let x = 0; x < this.Xsize; x++) {
                this.notify(x, y);
            }
        }
        
        console.log("📊 After Clear:");
        console.log("  - Total tiles:", Object.keys(this.tileMap).length);
        console.log("  - Total borders:", this.borders.length);
        console.log("  - startGame flag:", this.startGame);
        console.log("╔════════════════════════════════════╗");
        console.log("║   CLEARING LEVEL - COMPLETE       ║");
        console.log("╚════════════════════════════════════╝");
    }

    // Check if key reached door (level completion)
    checkLevelCompletion() {
        // Prevent multiple simultaneous completion checks
        if (this.isCheckingCompletion) return;
        
        // Find key and door tiles
        let keyTile = null;
        let doorTile = null;
        
        for(const key in this.tileMap) {
            const tile = this.tileMap[key];
            if(tile.State === 7) keyTile = tile; // Key
            if(tile.State === 8) doorTile = tile; // Door
        }
        
        if (!keyTile || !doorTile) {
            return; // No key or door exists
        }
        
        const [keyX, keyY] = keyTile.CordLocation;
        const [doorX, doorY] = doorTile.CordLocation;
        
        // Calculate distance between key and door
        const deltaX = Math.abs(keyX - doorX);
        const deltaY = Math.abs(keyY - doorY);
        
        console.log(`🔍 Completion Check: Key at (${keyX},${keyY}), Door at (${doorX},${doorY}), Distance: Δx=${deltaX}, Δy=${deltaY}`);
        
        // Check if key and door are ADJACENT (touching)
        // They touch if they're 1 tile apart horizontally OR vertically (not diagonally)
        const isTouching = (deltaX === 1 && deltaY === 0) || (deltaX === 0 && deltaY === 1);
        
        if (isTouching) {
            console.log(`✅ KEY IS TOUCHING DOOR! Δx=${deltaX}, Δy=${deltaY}`);
            console.log(`🎉 LEVEL COMPLETE! Key (${keyX},${keyY}) touched Door (${doorX},${doorY})`);
            
            // Prevent multiple triggers
            this.isCheckingCompletion = true;
            
            if(this.onLevelComplete) {
                this.onLevelComplete();
            }
            
            // Reset flag after a delay
            setTimeout(() => {
                this.isCheckingCompletion = false;
            }, 2000);
        } else {
            console.log(`❌ Not touching: Δx=${deltaX}, Δy=${deltaY} (need 1,0 or 0,1)`);
        }
    }
}