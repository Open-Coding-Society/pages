---
layout: post
codemirror: True
title: Sprint 5 Multiplayer Lesson
permalink: /sprintingsnails/multiplayer
author: Salma Zaghloul
---
# Multiplayer Games
## What are they?
In our context, multiplayer games are our familiar .js levels, however more than one player can connect to play at the same time. Think of Among Us, or Fortnite.

---

## How does it work, exactly?
Our game file is connected to an external server in the backend, that is constantly communicating and exchanging information with the front end. The server handles connections, player counts, diconnections, and most importnantly, player identification.

### Connection
When a player connects, the server assigns them a randomly generated ID (SID).

```py
@socketio.on('connect')
def handle_connect():
    global playercount
    sid = request.sid
    # Spawn at random or default position
    players[sid] = {"x": 100, "y": 100,}
    playercount = playercount + 1
    print(f"[SERVER] Player joined: {sid} and count = " + f" {playercount}")
    socketio.emit('player_update', {"players": players})
```
Notes:
- The server sets 'playercount' to a global variable, to allow communication between the front and backends.
    - Explanation: If the variable is local, it cannot be printed, sent, etc.
- In the instance someone joins, the server requests and generates a new id and assigns it to the player.
- The server then increases the player count, before printing it in the console.

### Disconnection
Similar to player connection, the server must handle the event of a player disconnecting.
```py
@socketio.on('disconnect')
def handle_disconnect():
    sid = request.sid
    if sid in players:
        del players[sid]
        print(f"[SERVER] Player disconnected: {sid} and count = " f"{playercount}")
        print(f"{playercount}")
        socketio.emit('player_left', {"sid": sid})
        socketio.emit('player_update', {"players": players})
```
Notes:
- In the event of a disconnection, the server looks up the "identification" of the player.
- It then deletes this person's SID
- This action effectively lowers the player count on its own, so there is no need to include it in this string.
---
# How do I add this to my game?
### Initializing your .md and .js
- First, update the .md file that generates your game level to contain this:
```
---
layout: opencs
title: Multiplayer
permalink: /gamify/mylevel
socket_io: true
--- 
```

- Then, implement the server into your .js file. Here's ours as an example if needed: PLEASE REFERENCE THIS IF YOU'RE STUCK!

<div class="button-container" id="btns">
  <a href="https://github.com/Salma-Zag/Tri2team/blob/main/assets/js/projects/multiplayer/levels/GameLevelMultiplayer.js" class="button large btn-start">Multiplayer.js</a>
</div>


Under your *const* definitions, add these strings of code.

```js
 // const socket = io("wss://flask-ws.opencodingsociety.com", { transports: ["websocket"] });
const socket = io("ws://localhost:8590", { transports: ["websocket"] });
        
        let myid = null;

        socket.on("connect", () => {
            console.log("connected:", socket.id);
        });
```
### IMPORTANT TO NOTE ABOUT CONST DEFINITION:
This line,
'const socket = io("ws://localhost:8590", { transports: ["websocket"] });' 
is for local host use. When committing to deployed use, comment out this previous line and uncomment the one above it 
'("const socket = io("wss://flask-ws.opencodingsociety.com", { transports: ["websocket"] });")'.

For context, when you deploy your level, this portion of code should now look like:
```js
const socket = io("wss://flask-ws.opencodingsociety.com", { transports: ["websocket"] });
// const socket = io("ws://localhost:8590", { transports: ["websocket"] });
        
        let myid = null;

        socket.on("connect", () => {
            console.log("connected:", socket.id);
        });
```

# Rendering other players
Now, we have simply connected the server to your game. And technically, players are now joining each other when a tab is opened. But they can't see each other. Let's fix that!

### Step 1: RemotePlayerVisualizer class
#### Initializing
- This class id placed *before* your GameLevel class
- This class is what will render or "draw" players into the level
- Think of it as the painter that is drawing on to your "canvas" (game).
- This requires you to import GameObject
```
import GameObject from '/assets/js/GameEnginev1.1/essentials/GameObject.js';
```
---
#### Breakdown
The class itself should be the first class in your file, right under your import!

### Code and Comments
Here's ours, with a detailed breakdown of the key components in the comments:
```js
class RemotePlayerVisualizer extends GameObject {
    constructor(data = null, gameEnv = null) {
        super(gameEnv);
        this.remotePlayersRef = data?.remotePlayers || {}; // This tells the engine: "The image you're about to clone will match the relative position of the player it generates with".
        this.SCALE_FACTOR = 3.5;
        this.frameWidth = 569 / 13;   // sprite sheet width / columns
        this.frameHeight = 36;         // sprite sheet height
        this.spriteImage = null;
    }

    update() {
        // Load the sprite image once on first call
        if (!this.spriteImage) {
            const img = new Image();
            img.src = "/images/gamebuilder/sprites/kirby.png";
            this.spriteImage = img; // "spriteImage" is the variable containing the sprite that will be cloned
        }
        this.draw();
    }

    draw() {
        // Don't draw until the image is loaded
        if (!this.spriteImage?.complete) return;

        const ctx = this.gameEnv.ctx;

        const drawWidth = this.frameWidth * this.SCALE_FACTOR; // matches the scale of the sprite.
        const drawHeight = this.frameHeight * this.SCALE_FACTOR;

        for (const sid in this.remotePlayersRef) {
            const p = this.remotePlayersRef[sid];
            console.log("drawing remote player at:", p.x, p.y);
            ctx.drawImage(
                this.spriteImage,
                0, 0,  
                this.frameWidth, //framewidth/height refer to the dementions of one frame (of the sprite).
                this.frameHeight,
                p.x, p.y, 
                drawWidth,  
                drawHeight 
            );
        }
    }

    resize() {}
    destroy() { this.spriteImage = null; }
}
```

### Detailed Semantics and Key
    This class:
        - Will load your player sprite only once, and clone it per player that joins.
        - Will tell the engine to attach each clone to the separate player movements
        - In short, ensure players can see each other.

    - `remotePlayersRef`: Matches the new clone to the new player and their positions on the screen. Basically: "The image you're about to clone will match the relative position of the player it generates with".
    - 'spriteImage': The variable that contains the player sprite.
    - 'SCALE_FACTOR': It's very particular, but essentially matches the size of the new players to the original. Can be changed.

---
## Step 2: Synchronizing Screens (NetworkSynchronizer class)
This class goes directly under our previous class. It makes sure player screens are up to date with each other.

This also extends GameObject. The class tells the engine to constantly search for each player's position within GameObject, then emits it to the game itself. (Every 50 milliseconds, in our case.)

### Code and comments:
```js
class NetworkSynchronizer extends GameObject {
    constructor(data = null, gameEnv = null) {
        super(gameEnv);
        this.socket = data?.socket; // Establishes Socket.IO connection
        this.playerInstance = null; // References the local player
        this.lastEmit = 0; // Little timestamps between emits, to prevent constant emission
        this.emitDelay = 50; // Time (in ms) between delays
    }

    update() {
        if (!this.playerInstance) {
            this.playerInstance = this.gameEnv?.gameObjects?.find(
                obj => obj instanceof Player
            );
        }

        if (!this.playerInstance || !this.socket) return;

        const now = Date.now();
        if (now - this.lastEmit < this.emitDelay) return;

        this.socket.emit("move", {
            x: this.playerInstance.position?.x ?? this.playerInstance.x,
            y: this.playerInstance.position?.y ?? this.playerInstance.y
    });    
    this.lastEmit = now;
 
    }

    draw() {}
    resize() {}
    destroy() {}
}
```

## Step 3: Initializing the Socket.IO Connection
This will establish the conneciton to WebSocket(our server) and set up the event handlers. In other words, what should trigger when someone connects (cloning the sprite) or disconnects (deleting the clone.)

We will add four different handlers:
    - 'connect': Called when client successfully connects to server
    - 'player_update': Called when server broadcasts updated player positions
    - 'player_left': Called when a player disconnects
    - 'disconnect': Called when client loses connection to server

### Code and Comments
```js
class GameLevelMultiplayer {
    constructor(gameEnv) {
        // Player data, bg data, and so on will be up here as usual.
        const path = gameEnv.path;
        const width = gameEnv.innerWidth;
        const height = gameEnv.innerHeight;

        const socket = io("ws://localhost:8590", { transports: ["websocket"] });

        let myId = null;
        const remotePlayers = {};

        socket.on("connect", () => { // Defines what will happen if someone connects
            console.log("connected:", socket.id);
            myId = socket.id; //Assigns and id to the new player.
        });

        socket.on("player_update", (data) => { // Defines what will happen if someone moves
            if (!data?.players) return;

            const players = data.players;

            for (const sid in players) {
                if (sid === socket.id) continue;

                if (!remotePlayers[sid]) {
                    remotePlayers[sid] = {
                        x: players[sid].x,
                        y: players[sid].y,
                        color: this.getRandomColor(), // purely optional.
                    };
                } else {
                    remotePlayers[sid].x = players[sid].x;
                    remotePlayers[sid].y = players[sid].y;
                }
            }

            for (const sid in remotePlayers) {
                if (!players[sid]) {
                    delete remotePlayers[sid];
                }
            }
        });
        socket.on("player_left", (data) => { // Defines what will happen if someone disconnects
            if (remotePlayers[data.sid]) {
                delete remotePlayers[data.sid];
            }
        });
        socket.on("disconnect", () => { // Does NOT define, simply logs.
            console.log("disconnected from server");
        });
    }
}
```
---
## Step 4: Configuring all components
All this is is an updated version of this.classes, that will cater to our new multiplayer compenents. 

However, our objects must go in a certain order, or else it won't work.
    **Why?**
        - The game engine initializes classes in the order you put them down. NetworkSynchronizer must come before RemotePlayerVisualizer so that NetworkSynchronizer can find the Player instance in gameEnv.gameObjects. When out of order, it will have nothing to search and will abort the command, leaving everything dyscfunctional.
    **What Order?**
        - GameEnvBackground (renders background image)
        - Player (renders local player, handles input)
        - NetworkSynchronizer (syncs local player position to server)
        - RemotePlayerVisualizer (renders remote players)

### Code
```js


        this.classes = [
            { class: GameEnvBackground, data: bgData },
            { class: Player, data: playerData },
            { class: NetworkSynchronizer, data: { socket: socket } },
            { class: RemotePlayerVisualizer, data: { remotePlayers: remotePlayers } }
        ];
```


---

## Further Developements
Our game level and engine are dynamic and are bound to update in the future. Keep an eye out!

Additional features:
- Notifying the host when a player joins
- Lobbies (to help people find one another)
- Lobby codes
- Levels
- Gravity (jump logic, velocity)
- Troubleshooting