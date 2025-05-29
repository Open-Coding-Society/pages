---
toc: false
comments: false
layout: post
title: OOP, Multiplayer
description: Start a discussion on setting up two or more players in a game.  A key part of doing this is understanding all attributes in GameObject and GameEnv, serializing and deserializing this information over the internet.
type: devops
courses: { csse: {week: 18} }
---

## Multiplayer
This is a dialog on how to make a Multiplayer game. 

It may or may not be consistent with this [Implementation Ticket](https://github.com/open-coding-society/teacher_portfolio/issues/46)

### Multiplayer Game Loop
Adjust the game loop to accommodate real-time updates from the server.
Touch Point: Modify the game loop to integrate server updates and adjust the timing mechanism.

### Player Actions
Player actions (like moving and jumping) are likely handled locally on the client side. In a multiplayer setup, these actions need to be sent to the server.
Touch Point: Modify handlePlayerAction to emit player actions to the server.

### JSON Representation
JSON or a similar data format can be used to represent game objects when transmitting them between the server and clients.
Touch Point: Serialize and deserialize game objects to/from JSON for network transmission.

### GameObject Lifecycle
Consider how GameObjects are created, updated, and destroyed in a multiplayer context.
Touch Point: Modify GameObject and GameLevel methods to handle synchronization and instantiation/destruction across clients.

### Server-Side Game State
The server needs to maintain the authoritative game state.
Touch Point: The server listens for player actions, updates the game state, and broadcasts the updated state to all connected clients.

### Synchronization
Ensure that all clients are synchronized with the server's authoritative game state.
Touch Point: Clients listen for updates from the server and adjust their local game state accordingly.

### Player Identification
Identify different players and associate their actions with their corresponding GameObjects.
Touch Point: Add a player identifier to emitted actions and update GameObjects accordingly.

### Networking (WebSocket):
Establishing and handling WebSocket connections for real-time communication.
Touch Point: Integrate WebSocket handling on both the client and server sides.

### Error Handling
Implement robust error handling to handle network failures and unexpected scenarios.
Touch Point: Enhance error handling mechanisms on both the client and server sides.

### Single Player Layout
```text
GameEnv
|   ├── Attributes:
│   |   ├── levels
│   |   ├── gameObjects
|   │   └── ...
|   |
|   ├── Methods: 
│   |    ├── update: update, draw
│   |    ├── destroy: all gameObjects
│   |    └── ...
│
├── GameObject
│   ├── Player: sprite animation, wasd
│   ├── Background: fit to screen, scrolling 
│   ├── Platform: fixed to bottom, scrolling
│   └── ...
│
├── GameLevel
|   ├── Tag: key
│   ├── Attributes:
│   |   ├── playerAssets
│   |   ├── backgroundAssets
│   |   ├── platformAssets
│   |   └── ...
|   |
│   └── Methods: 
│   |    ├── load: "new" GameObject created from assets
│   |    └── ...
|
└── GameControl
│   ├── Methods: 
|   |    ├── gameLoop: drive action of game level
│   |    ├── transitionToLevel: destroys and creates objects for game level
│   |    └── ...
|   |
│   └── ...
```

## Game States
Some of the definitions above talk about "game state".

### Positions and States of Game Objects
The location, velocity, and state (e.g., alive, dead) of each game object (players, enemies, platforms, etc.).

### Player Scores and Stats
Scores, achievements, or any other player-specific statistics.

### Level Information
Details about the current level, such as the background, platform configuration, and any other level-specific attributes.

### Time and Game Clock
Information about the current time within the game, which is crucial for handling events, animations, and other time-dependent actions.

### Event Queue or Log
A log of events or actions that have occurred, which can be used for synchronization and debugging.

### Game Configuration
Settings and configurations that affect the game's behavior, such as gravity, game speed, or other global parameters.

### Player Identification and Session Information:
Unique identifiers for players, their session information, and any relevant details for tracking and managing player connections.
## Client / Server Code

To make a game multiplayer or enable two machines to share the same GameLevel with different players, you would indeed need to introduce a mechanism for communication between the two instances. WebSockets are a commonly used technology for real-time bidirectional communication between clients and servers, and they can be a good choice for multiplayer games.

- Server-Side Logic
  - Implement a server to manage the game state, including the current game level, player positions, and other relevant data.
  - Use a WebSocket library on the server to handle communication with clients.

- Client-Side Logic
  - Modify the existing game code on the client to interact with the server via WebSockets.
  - When a player acts (e.g., moves the character), send that action to the server.
  - Receive updates from the server, such as the positions of other players, and update the local game state accordingly.

- Synchronization
  - Ensure that the server is the authority on the game state. All clients should receive updates from the server and synchronize their local state accordingly.
  - Implement mechanisms for handling latency and potential synchronization issues between clients.

- WebSockets:
  - Use WebSockets to establish a persistent connection between the clients and the server.
  - Send messages back and forth between the server and clients to keep them in sync.


### Code Outlines
Client Code Sample: JavaScript

```javascript

<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/3.0.3/socket.io.js"></script>

// Client-side using JavaScript and Socket.IO
const socket = io.connect('http://localhost:5000');   // change to server for multi player

socket.on('gameState', (updatedGameState) => {
  // Update the local game state based on the server updates
});

// When the player performs an action
function handlePlayerAction(action) {
  // Send the action to the server
  socket.emit('playerAction', action);
  // Local client may update its state immediately, but the authoritative state comes from the server
}
```

Server Code Sample: Python

```python
from flask import Flask, render_template
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('connect')
def handle_connect():
    # Handle new player connection

@socketio.on('playerAction')
def handle_player_action(action):
    # Handle player actions and update the game state
    # Broadcast the updated state to all connected clients
    socketio.emit('gameState', updated_game_state)

if __name__ == '__main__':
    socketio.run(app)
```

## Hacks

An early step to building a multiplayer game requires thinking and structuring code so that data can be updated from the server.

### Review Elements and Data

To abstract data to the server, you must 1st study what that data might be.  Then, serializing data into JSON.  Inspecting on the browser enables the developer to see some of the data described in this article, here is Element data ...

```xml
<canvas id="background" width="754" height="331" style="width: 754px; height: 331px; position: absolute; left: 0px; top: 60px; filter: none;"></canvas>

<canvas id="platform" width="540" height="160" style="width: 754px; height: 44.6815px; position: absolute; left: 0px; top: 391px; filter: none;"></canvas>

<canvas id="character" width="74" height="74" style="filter: none; width: 74px; height: 74px; position: absolute; left: 0px; top: 316.481px;"></canvas>
```

### Serialize Data
The objective is to log data in objects each time it is changed.  Since the refresh rate is fast, it is probably a lot faster than the change rate.  Logging should be associated with the change rate.

Sample of serializing Character data
```javascript

    // log Character element change
    logElement() {
        var jsonifiedElement = this.stringifyElement();
        if (jsonifiedElement !== this.jsonifiedElement) {
            console.log(jsonifiedElement);
            this.jsonifiedElement = jsonifiedElement;
        }
    }

    // strigify Character key data
    stringifyElement() {
        var element = this.canvas;
        if (element && element.id) {
            // Convert the relevant properties of the element to a string for comparison
            return JSON.stringify({
                id: element.id,
                width: element.width,
                height: element.height,
                style: element.style.cssText,
                position: {
                    left: element.style.left,
                    top: element.style.top
                },
                filter: element.style.filter
            });
        }
    }
```