// SettingsControl.js key purpose is key/value management for game settings.
import LocalStorage from "./LocalStorage.js";
import GameEnv from "./GameEnv.js";
import GameControl from "./GameControl.js";
import Socket from "./Multiplayer.js";
import Chat from "./Chat.js"
import { enableLightMode, enableDarkMode } from './Document.js';


/* Coding Style Notes
 *
 * SettingsControl is defined as a Class
 * * SettingsControl contains a constructor.
 * * SettingsControl.constructor() is called when SettingsControl is instantiated.
 * * SettingsControl is instantiated in SettingsControl.sidebar().
 * * This coding style allows multiple instances of SettingsControl.
 * * This coding style is a common pattern in JavaScript and is very similar to Java.
 * * Methods are defined as ES6 shorthand
 * 
 * 
 * * Observe, instantiation/scoping/encapulation of this.keys 
 * * * The constructor makes an instance of this.keys by calling super(keys). 
 * * * * Observe the super(keys) call, this calls extended LocalStorage class constructor.
 * * * * Review LocalStorage.js for more details.
 * 
 * * SettingsControl manages keys following Model-View-Control (MVC) design pattern.
 * *  * Model is the LocalStorage class, which enables persistence of settings between sessions.
 * *  * View is the HTML/CSS sidebar, which displays and stores document elements in the DOM.
 * *  * Control is the SettingsControl class, which manages exchange of data between Model and View.
 * 
 * 
 * Usage Notes
 * * call SettingsControl.sidebar() to run the settings sidebar.
 * * * the remainder of SettingsControl supports the sidebar and MVC design for settings keys/values. 
 * 
*/

const backgroundDim = {
    create () {
        this.dim = true // sets the dim to be true when settingControl is opened
        console.log("CREATE DIM")
        const dimDiv = document.createElement("div");
        dimDiv.id = "dim";
        dimDiv.style.backgroundColor = "black";
        dimDiv.style.width = "100%";
        dimDiv.style.height = "100%";
        dimDiv.style.position = "absolute";
        dimDiv.style.opacity = "0.8";
        document.body.append(dimDiv);
        dimDiv.style.zIndex = "9998"
        dimDiv.addEventListener("click", this.remove)
    },
    remove () {
        this.dim = false
        console.log("REMOVE DIM");
        const dimDiv = document.getElementById("dim");
        dimDiv.remove();
        isOpen = false
        const sidebar = document.getElementById("sidebar")
        sidebar.style.width = "0px";
        sidebar.style.left = "-100px"
        sidebar.style.top = "15%"
    }
}

let isOpen = true

// define the SettingsControl class
// export class SettingsControl extends LocalStorage{
//     constructor(){ //default keys for localStorage
//         var keys = {
//             userID:"userID",
//             currentLevel:"currentLevel",
//             isInverted:"isInverted",
//             gameSpeed:"gameSpeed",
//             gravity:"gravity",
//             difficulty: "difficulty",
//         }; 
//         super(keys); //creates this.keys
//     }

//     reloadGame() {
//         // Add code to reload or restart your game here
//         // You may want to perform actions like resetting the game state, restarting the level, etc.
//         // Example:
//         window.location.reload(); // Reload the entire page (this might not be suitable for all scenarios)
//         // Alternatively, you may have a custom function to handle game restart logic.
//     }
    

//     /**
//      * Note. Separated from constructor so that class can be created before levels are addeda
//      * 
//      * Initializes the SettingsControl instance.
//      * Loads all keys from local storage.
//      * For each key, 
//      * * If it exists in local storage, loads and parses its value.
//      * * Else when the key does not exist in local storage, sets key to the corresponding GameEnv.js variable.
//      */
//     initialize(){ 
//         // Load all keys from local storage
//         this.loadAll();
        
//         window.addEventListener("difficulty", (e) => {
//             // Update the difficulty value when a difficulty event is fired
//             this[this.keys.difficulty] = e.detail.difficulty();
//             // Update the difficulty value in the game environment
//             GameEnv.difficulty = parseFloat(this[this.keys.difficulty]);
//             // Save the difficulty value to local storage
//             this.save(this.keys.difficulty);
    
//             // Reload the game to apply the new difficulty settings
//             this.reloadGame();
//         });

//         /**
//          * Handles a key by checking if it exists in local storage and parsing its value.
//          * If the key does not exist in local storage, it sets the key to the current value of the game environment variable.
//          *
//          * @param {string} key - The localstorae key.
//          * @param {*} gameEnvVariable - The corresponding game environment variable.
//          * @param {function} [parser=(val) => val] - An optional function to parse the value from local storage.
//          * If no parser parameter/function is provided, (val) => val is unchanged.
//          * Else if parser is provided, the value is parsed ... e.g.: 
//          * * (val) => vall === "true" parses the value as a boolean
//          * * (val) =>  parseFloat(val) parses the value as a floating point number
//          */
//         const handleKey = (key, gameEnvVariable, parser = (val) => val) => {
//             if (this[this.keys[key]]) {
//                 return parser(this[this.keys[key]]);
//             } else {
//                 this[this.keys[key]] = gameEnvVariable;
//                 return gameEnvVariable;
//             }
//         };

//         /* Call the handleKey function to set up each game environment variable
//          * The handleKey function takes three parameters:
//             * * key - the local storage key
//             * * gameEnvVariable - the corresponding game environment variable
//             * * parser - an optional function to parse the value extracted from local storage
//         */
//         // 'userID', the value is parsed as a string
//         GameEnv.userID = handleKey('userID', GameEnv.userID);
//         // 'currentLevel', the value is parsed as a an index into the GameEnv.levels array
//         GameEnv.currentLevel = handleKey('currentLevel', GameEnv.levels[Number(this[this.keys.currentLevel])]);
//         // 'isInverted', the value is parsed to a boolean
//         GameEnv.isInverted = handleKey('isInverted', GameEnv.isInverted, (val) => val === "true");
//         // 'gameSpeed', the value is parsed to a floating point number
//         GameEnv.gameSpeed = handleKey('gameSpeed', GameEnv.gameSpeed, parseFloat);
//         // 'gravity', the value is parsed to a floating point number
//         GameEnv.gravity = handleKey('gravity', GameEnv.gravity, parseFloat);
//         // 'difficulty', the value is parsed to a floating point number
//         GameEnv.difficulty = handleKey('difficulty', GameEnv.difficulty);


//         // List for th 'userID' update event
//         window.addEventListener("userID", (e)=>{
//             // Update the userID value when a userID event is fired
//             this[this.keys.userID] = e.detail.userID();
//             // Update the userID value in the game environment
//             GameEnv.userID = this[this.keys.userID];

//             Socket.sendData("name",GameEnv.userID);
//             // Save the userID value to local storage
//             this.save(this.keys.userID);
//         });
        
//         // Listen for the 'resize' update event
//         window.addEventListener("resize",()=>{ 
//             // Update the current level index when the level changes
//             this[this.keys.currentLevel] = GameEnv.levels.indexOf(GameEnv.currentLevel);
//             // Save the current level index to local storage
//             this.save(this.keys.currentLevel); 
//         });

//         // Listen for the 'isInverted' update event
//         window.addEventListener("isInverted", (e)=>{ 
//             // Update the isInverted value when an invert event is fired
//             this[this.keys.isInverted] = e.detail.isInverted();
//             // Update the isInverted value in the game environment
//             GameEnv.isInverted = this[this.keys.isInverted]; 
//             // Save the isInverted value to local storage
//             this.save(this.keys.isInverted); 
//         });

//         // Listen for the 'gameSpeed' update event
//         window.addEventListener("gameSpeed",(e)=>{ 
//             // Update the gameSpeed value when a speed event is fired
//             this[this.keys.gameSpeed] = e.detail.gameSpeed();
//             // Update the gameSpeed value in the game environment
//             GameEnv.gameSpeed = parseFloat(this[this.keys.gameSpeed]); 
//             // Save the gameSpeed value to local storage
//             this.save(this.keys.gameSpeed); 
//         });

//         // Listen for the 'gravity' update event
//         window.addEventListener("gravity",(e)=>{ 
//             // Update the gravity value when a gravity event is fired
//             this[this.keys.gravity] = e.detail.gravity();
//             // Update the gravity value in the game environment
//             GameEnv.gravity = parseFloat(this[this.keys.gravity]); 
//             // Save the gravity value to local storage
//             this.save(this.keys.gravity); 
//         });

//         // Listen for the 'gravity' update event
//         window.addEventListener("difficulty",(e)=>{ 
//             // Update the gravity value when a gravity event is fired
//             this[this.keys.difficulty] = e.detail.difficulty();
//             // Update the gravity value in the game environment
//             GameEnv.difficulty = parseFloat(this[this.keys.difficulty]); 
//             // Save the gravity value to local storage
//             this.save(this.keys.difficulty); 
//         });

//         window.addEventListener("isTheme", (e)=>{ 
//             // Update the isInverted value when an invert event is fired
//             this[this.keys.isTheme] = e.detail.isTheme();
//             // Update the isInverted value in the game environment
//             GameEnv.isTheme = this[this.keys.isTheme]; 
//             // Save the isInverted value to local storage
//             this.save(this.keys.isTheme); 
//         });
 
//     }

//     /**
//      * Getter for the userID property.
//      * Creates a div with a text input for the user to enter a userID.
//      * The input's value is bound to the GameEnv's userID string.
//      * @returns {HTMLDivElement} The div containing the userID input.
//      */
//     get userIDInput() {
//         const div = document.createElement("div");
//         div.innerHTML = "User ID: "; // label

//         const userID = document.createElement("input");  // get user defined userID
//         userID.type = "text";
//         userID.value = GameEnv.userID; // GameEnv contains latest userID
//         userID.maxLength = 10; // set maximum length to 10 characters
//         userID.className = "input userID";    // custom style in platformer-styles.scss

//         userID.addEventListener("change", () => { 
//             // dispatch event to update userID
//             window.dispatchEvent(new CustomEvent("userID", { detail: {userID:()=>userID.value} }));
//         });

//         Socket.sendData("name",GameEnv.userID)

//         div.append(userID); // wrap input element in div
//         return div;
//     }

//     /**
//      * Getter for the levelTable property.
//      * Creates a table with a row for each game level.
//      * Each row contains the level number and the level tag.
//      * Passive levels are skipped and not added to the table.
//      * @returns {HTMLTableElement} The table containing the game levels.
//      */
//     get levelTable(){
//         // create table element
//         var t = document.createElement("table");
//         t.className = "table levels";
//         //create table header
//         var header = document.createElement("tr");
//         var th1 = document.createElement("th");
//         th1.innerText = "#";
//         header.append(th1);
//         var th2 = document.createElement("th");
//         th2.innerText = "Level Tag";
//         header.append(th2);
//         t.append(header);

//         // Create table rows/data
//         for(let i = 0, count = 1; i < GameEnv.levels.length; i++){
//             if (GameEnv.levels[i].passive) //skip passive levels
//                 continue; 
//             // add level to table
//             var row = document.createElement("tr");
//             var td1 = document.createElement("td");
//             td1.innerText = String(count++); //human counter
//             row.append(td1);
//             // place level name in button   
//             var td2 = document.createElement("td");
//             td2.innerText = GameEnv.levels[i].tag;
//             row.append(td2);
//             // listen for row click
//             row.addEventListener("click",()=>{ // when player clicks on the row
//                 //transition to selected level
//                 GameControl.transitionToLevel(GameEnv.levels[i]); // resize event is triggered in transitionToLevel
//             })
//             // add level row to table
//             t.append(row);
//         }

//         return t; //returns <table> element
//     }

//     /**
//      * Getter for the isInvertedInput property.
//      * Creates a div with a checkbox input for the user to invert the game controls.
//      * The checkbox's checked state is bound to the GameEnv's isInverted state.
//      * @returns {HTMLDivElement} The div containing the isInverted checkbox.
//      */
//     get isInvertedInput() {
//         const div = document.createElement("div");
//         div.innerHTML = "Invert: "; // label
    
//         const isInverted = document.createElement("input");  // get user defined invert boolean
//         isInverted.type = "checkbox";
//         isInverted.checked = GameEnv.isInverted; // GameEnv contains latest isInverted state
    
//         isInverted.addEventListener("change", () => { 
//             //`dispatch event to update isInverted
//             window.dispatchEvent(new CustomEvent("isInverted", { detail: {isInverted:()=>isInverted.checked} }));
//         });
    
//         div.append(isInverted); // wrap input element in div
//         return div;
//     }

//     get isThemeInput() {
//         const localstorage = window.localStorage
//         const lightmodekey = "islightMode"
//         const div = document.createElement("div");
//         div.innerHTML = "Theme Change:"; // label
//         const localStorageLightModeToggle = localstorage.getItem(lightmodekey)
        
//         if (localStorageLightModeToggle) {
//             GameEnv.isLightMode = localStorageLightModeToggle.toLowerCase() === "true"
//         }


//         const islightMode = document.createElement("input");  // get user defined lightmode boolean
//         islightMode.type = "checkbox";
//         if (GameEnv.isLightMode) {
//             enableLightMode();
//             islightMode.checked = true;
//         } else {
//             enableDarkMode();
//             islightMode.checked = false;
//         }
//         islightMode.addEventListener('change', () => {
//             if (islightMode.checked) {
//                 enableLightMode();
//                 GameEnv.isLightMode = true;
//                 localstorage.setItem(lightmodekey, GameEnv.isLightMode)
//             } else {
//                 enableDarkMode();
//                 GameEnv.isLightMode = false;
//                 localstorage.setItem(lightmodekey, GameEnv.isLightMode)
//             }
//         console.log(GameEnv.isLightMode)
//         });


//         // Append elements to the DOM or wherever appropriate
//         div.appendChild(islightMode); 
//         return div
//         // Append div to your settings container
//         // For example:
//         // document.getElementById('settingsContainer').appendChild(div);
//     }

//     /**
//      * Getter for the gameSpeedInput property.
//      * Creates a div with a number input for the user to adjust the game speed.
//      * The input's value is bound to the GameEnv's gameSpeed state.
//      * @returns {HTMLDivElement} The div containing the gameSpeed input.
//      */

//     get gameSpeedInput() {
//         const div = document.createElement("div");
//         div.innerHTML = "Game Speed: "; // label
    
//         const gameSpeed = document.createElement("input");  // get user defined game speed
//         gameSpeed.type = "number";
//         gameSpeed.min = 1.0;
//         gameSpeed.max = 8.0;
//         gameSpeed.step = 0.1;
//         gameSpeed.default = 2.0; // customed property for default value
//         gameSpeed.value = GameEnv.gameSpeed; // GameEnv contains latest game speed
//         gameSpeed.className = "input gameSpeed";    // custom style in platformer-styles.scss
    
//         gameSpeed.addEventListener("change", () => { 
//             // check values are within range
//             const value = parseFloat(gameSpeed.value).toFixed(1);
//             gameSpeed.value = (value < gameSpeed.min || value > gameSpeed.max || isNaN(value)) ? gameSpeed.default : value;
//             // dispatch event to update game speed
//             window.dispatchEvent(new CustomEvent("gameSpeed", { detail: {gameSpeed:()=>gameSpeed.value} }));
//         });
    
//         div.append(gameSpeed); // wrap input element in div
//         return div;
//     }

//     /**
//      * Getter for the gravityInput property.
//      * Creates a div with a number input for the user to adjust the game gravity.
//      * The input's value is bound to the GameEnv's gravity state.
//      * @returns {HTMLDivElement} The div containing the gravity input.
//      */
//     get gravityInput() {
//         const div = document.createElement("div");
//         div.innerHTML = "Gravity: "; // label
    
//         const gravity = document.createElement("input");  // get user defined gravity
//         gravity.type = "number";
//         gravity.min = 1.0;
//         gravity.max = 8.0;
//         gravity.step = 0.1;
//         gravity.default = 3.0; // customed property for default value
//         gravity.value = GameEnv.gravity; // GameEnv contains latest gravity
//         gravity.className = "input gravity";    // custom style in platformer-styles.scss
    
//         gravity.addEventListener("change", () => { 
//             // check values are within range
//             const value = parseFloat(gravity.value).toFixed(1);
//             gravity.value = (value < gravity.min || value > gravity.max || isNaN(value)) ? gravity.default : value;
//             // dispatch event to update gravity
//             window.dispatchEvent(new CustomEvent("gravity", { detail: {gravity:()=>gravity.value} }));
//         });
    
//         div.append(gravity); // wrap input element in div
//         return div;
//     }


//     /**
//      * Getter for the difficultyInput property.
//      * Creates a div with a number input for the user to adjust the game difficulty.
//      * @returns {HTMLDivElement} The div containing the difficultly input.
//      */
//     get difficultyInput() {
//         const div = document.createElement("div");
//         div.innerHTML = "Difficulty: "; // label
    
//         const difficulty = document.createElement("select"); // dropdown for difficulty
//         const options = ["Easy", "Normal", "Hard", "Impossible"];
    
//         options.forEach(option => {
//             const opt = document.createElement("option");
//             opt.value = option.toLowerCase();
//             opt.text = option;
//             difficulty.add(opt);
//         });
    
//         difficulty.value = GameEnv.difficulty; // GameEnv contains latest difficulty
    
//         difficulty.addEventListener("change", () => {
//             // dispatch event to update difficulty
//             window.dispatchEvent(new CustomEvent("difficulty", { detail: { difficulty: () => difficulty.value } }));
//         });
    
//         div.append(difficulty); // wrap select element in div
//         return div;
//     }
    
//     get multiplayerButton() {
//         const div = document.createElement("div");
//         div.innerHTML = "Multiplayer: "; // label
    
//         const button = document.createElement("button"); // button for Multiplayer
//         button.innerText = String(Socket.shouldBeSynced);
    
//         button.addEventListener("click", () => {
//             // dispatch event to update difficulty
//             button.innerText = String(Socket.changeStatus());
//         });
    
//         div.append(button); // wrap button element in div
//         return div;
//     }

//     get chatButton() {
//         const div = document.createElement("div");
//         div.innerHTML = "Chat: "; // label
    
//         const button = document.createElement("button"); // button for Multiplayer
//         button.innerText = "open";
//     /**
//      * Chat class to make the chat more refined and functional
//      */
//         var ChatClass = new Chat([]);
//         var chatBoxContainer =  ChatClass.chatBoxContainer;
//         var chatBox = chatBoxContainer.children.namedItem("chatBox");
//         var chatInput = chatBoxContainer.children.namedItem("chatInput");
//         var chatButton = chatBoxContainer.children.namedItem("chatButton");
//         chatBoxContainer.style.display = "none";
//         chatBoxContainer.style.zIndex = 2;
//         chatBoxContainer.style.position = "absolute";
//         chatBoxContainer.style.top = "70%";
//         chatBoxContainer.style.left = "50%";
//         chatBoxContainer.style.width = "50%";
//         chatBoxContainer.style.height = "30%";
//         chatBoxContainer.style.backgroundColor = "grey";
//         chatBoxContainer.style.opacity = "65%";
//         chatBoxContainer.style.borderRadius = "1%";
//         chatBox.style.position = "relative";
//         chatBox.style.resize = "both";
//         chatBox.style.overflow = "auto";
//         chatBox.style.height = "90%";
//         chatBox.style.width = "100%";
//         chatBox.style.top = "0%";
//         chatInput.style.position = "relative";
//         chatInput.style.bottom = "0%";
//         chatInput.style.height = "10%"
//         chatInput.style.width = "80%";
//         chatButton.style.position = "relative";
//         chatButton.style.height = "10%";
//         chatButton.style.width = "20%";
//         chatButton.style.bottom = "0%";


//         document.getElementById("sidebar").insertAdjacentElement("afterend",chatBoxContainer);

//         var isShown = false;
//         button.addEventListener("click", () => {
//             isShown=!isShown;
//             if(isShown){
//                 chatBoxContainer.style.display = "block";
//                 button.innerText = "close";
//             }else{
//                 chatBoxContainer.style.display = "none";
//                 button.innerText = "open"
//             }
//         });
    
//         div.append(button); // wrap button element in div
//         return div;
//     }

//     get playerCount(){
//         const div = document.createElement("div");
//         const text = document.createElement("p");
//         const button = document.createElement("button");

//         text.innerText = "1/10 players";
//         button.innerText = "check player count";

//         function update(d){
//             text.innerText = String(d)+"/10 players";
//         }
//         Socket.createListener("playerCount",update);
//         button.addEventListener("click",()=>{
//             Socket.removeAllListeners("playerCount")
//             Socket.createListener("playerCount",update);
//             Socket.socket.emit("checkPlayers","");
//         });
//         div.append(text);
//         div.append(button);
//         return div;
//     }

//     /**
//      * Static method to initialize the game settings controller and add the settings controls to the sidebar.
//      * Constructs an HTML table/menu from GameEnv.levels[] and HTML inputs for invert, game speed, and gravity.
//      * Each input has an event update associated with it.
//      * All elements are appended to the sidebar.
//      */
//     static sidebar(){
//         // Initiliaze Game settings controller 
//         var settingsControl = new SettingsControl();
//         settingsControl.initialize();

//        // Get/Construct an HTML table/menu from GameEnv.levels[]
//        var levels = settingsControl.levelTable;
//        document.getElementById("sidebar").append(levels);

//        // Get/Construct HTML input and event update for invert
//        var invertControl = settingsControl.isInvertedInput;
//        document.getElementById("sidebar").append(invertControl); 

//        var hintsSection = document.createElement("div")
//        hintsSection.innerHTML = "Toggle fun facts: "
//        // Store the updated toggle state in local storage
//     // Create the hints button (checkbox)
//         var hintsButton = document.createElement("input");
//         hintsButton.type = "checkbox";

//         // Reference the hints section
//         const hints = document.getElementsByClassName("fun_facts")[0];

//         // Check localStorage for existing funFact state and set the initial state
//         const localStorage = localStorage.getItem('funFact');
//         if (localStorageFunFact !== null) {
//             GameEnv.funFact = localStorageFunFact.toLowerCase() === "true";
//         } else {
//             // Default value if nothing is found in localStorage
//             GameEnv.funFact = true;
//         }

//         // Set the initial state of hints and the checkbox based on GameEnv.funFact
//         if (GameEnv.funFact) {
//             hints.style.display = "unset";
//             hintsButton.checked = true;
//         } else {
//             hints.style.display = "none";
//             hintsButton.checked = false;
//         }

//         // Add the button to the DOM (assuming there is an element to append it to)
//         document.body.appendChild(hintsButton);

//         // Add event listener to the button to update display and localStorage
//         hintsButton.addEventListener("click", () => {
//             if (!hintsButton.checked) {
//                 hints.style.display = "none";
//                 GameEnv.funFact = false;
//             } else {
//                 hints.style.display = "unset";
//                 GameEnv.funFact = true;
//             }
//             localStorage.setItem('funFact', GameEnv.funFact);
//             console.log(GameEnv.funFact);
//         });

       
    
//        hintsSection.append(hintsButton)
//        document.getElementById("sidebar").append(hintsSection)

//        // Get/Construct HTML input and event update fo game speed
//        var userID = settingsControl.userIDInput;
//        document.getElementById("sidebar").append(userID);

//        // Get/Construct HTML input and event update for game speed 
//        var gameSpeed = settingsControl.gameSpeedInput;
//        document.getElementById("sidebar").append(gameSpeed);

//        // Get/Construct HTML input and event update for gravity
//        var gravityInput = settingsControl.gravityInput;
//        document.getElementById("sidebar").append(gravityInput);

//        // Get/Construct HTML input and event update for difficulty
//        var difficultyInput = settingsControl.difficultyInput;
//        document.getElementById("sidebar").append(difficultyInput);

//        // Get/Construct HTML button and event update for multiplayer
//        var multiplayerButton = settingsControl.multiplayerButton;
//        document.getElementById("sidebar").append(multiplayerButton);

//        // Get/Construct HTML button and event update for theme
//        var themeButton = settingsControl.themeButton;
//        document.getElementById("sidebar").append(themeButton);

//        // Get/Construct HTML button and event update for multiplayer
//        var chatButton = settingsControl.chatButton;
//        document.getElementById("sidebar").append(chatButton);

//         // Get/Construct HTML button and event update for multiplayer
//         var playerCount = settingsControl.playerCount;
//         document.getElementById("sidebar").append(playerCount);

//           // Get/Construct HTML input and event update for theme change
//         var themeChangeControl = settingsControl.isThemeInput;
//         document.getElementById("sidebar").append(themeChangeControl); 

//         // Listener, isOpen, and function for sidebar open and close
//         var submenuHeight = 0; // calculated height of submenu
//         function sidebarPanel(){
//             // toggle isOpen
//             isOpen = true;
//             // open and close properties for sidebar based on isOpen
//             backgroundDim.create()
//             var sidebar = document.querySelector('.sidebar');
//             sidebar.style.width = isOpen?"200px":"0px";
//             sidebar.style.paddingLeft = isOpen?"10px":"0px";
//             sidebar.style.paddingRight = isOpen?"10px":"0px";
//             sidebar.style.top = `calc(${submenuHeight}px + ${GameEnv.top}px)`;
//         }
//         // settings-button and event listener opens sidebar
//         document.getElementById("settings-button").addEventListener("click",sidebarPanel);

//         window.addEventListener('load', function() {
//             var submenu = document.querySelector('.submenu');
//             submenuHeight = submenu.offsetHeight;
//         });
//     }
    
// }

const SettingsControl = {
    initialize () {
       const sidebarDiv = document.getElementById("sidebar")
       const sidebarContents = this.createSidebar()

       document.getElementById("settings-button").addEventListener("click", this.openSettings)
    },

    openSettings () {
        const submenu = document.querySelector('.submenu');
        const submenuHeight = submenu.offsetHeight;
        // toggle isOpen
        isOpen = true;
        // open and close properties for sidebar based on isOpen
        backgroundDim.create()
        const sidebar = document.querySelector('.sidebar');
        sidebar.style.width = isOpen?"200px":"0px";
        sidebar.style.paddingLeft = isOpen?"10px":"0px";
        sidebar.style.paddingRight = isOpen?"10px":"0px";
        sidebar.style.paddingTop = "10px"
        sidebar.style.top = `calc(${submenuHeight}px + ${GameEnv.top}px)`;
        sidebar.style.left = '0px'

        sidebar.hidden = false
    },

    createSidebar () {
        const levels = this.levelTable();
        document.getElementById("sidebar").append(levels);
        // Get/Construct HTML input and event update fo game speed
        const userID = this.userIDInput();
        document.getElementById("sidebar").append(userID);
 
        // Get/Construct HTML input and event update for game speed 
        const gameSpeed = this.gameSpeedInput();
        document.getElementById("sidebar").append(gameSpeed);
 
        // Get/Construct HTML input and event update for gravity
        const gravityInput = this.gravityInput();
        document.getElementById("sidebar").append(gravityInput);
 
        // Get/Construct HTML input and event update for difficulty
        const difficultyInput = this.difficultyInput();
        document.getElementById("sidebar").append(difficultyInput);
 
        // Get/Construct HTML button and event update for multiplayer
        const multiplayerButton = this.multiplayerButton();
        document.getElementById("sidebar").append(multiplayerButton);
 
        // Get/Construct HTML button and event update for multiplayer
        const chatButton = this.chatButton();
        document.getElementById("sidebar").append(chatButton);
 
         // Get/Construct HTML button and event update for multiplayer
         const playerCount = this.playerCount();
         document.getElementById("sidebar").append(playerCount);
 
           // Get/Construct HTML input and event update for theme change
         const themeChangeControl = this.isThemeInput();
         document.getElementById("sidebar").append(themeChangeControl);

         const hintsButton = this.hintsButton();
         document.getElementById("sidebar").append(hintsButton);
     }, 

    hintsButton() {
        const container = document.createElement("div")
        const title = document.createElement("span")
        title.textContent = "Show Hints: "
        const hintsButton = document.createElement("input");
        hintsButton.type = "checkbox";

        // Reference the hints section
        const hints = document.getElementsByClassName("fun_facts")[0];

        // Check localStorage for existing funFact state and set the initial state
        const localStorageFunFact = window.localStorage.getItem('funFact');

        if (localStorageFunFact !== null) {
            GameEnv.funFact = localStorageFunFact.toLowerCase() === "true";
        } else {
            // Default value if nothing is found in localStorage
            GameEnv.funFact = true;
        }

        // Set the initial state of hints and the checkbox based on GameEnv.funFact
        if (GameEnv.funFact) {
            hints.style.display = "unset";
            hintsButton.checked = true;
        } else {
            hints.style.display = "none";
            hintsButton.checked = false;
        }

        // Add event listener to the button to update display and localStorage
        hintsButton.addEventListener("click", () => {
            if (!hintsButton.checked) {
                hints.style.display = "none";
                GameEnv.funFact = false;
            } else {
                hints.style.display = "unset";
                GameEnv.funFact = true;
            }

            localStorage.setItem('funFact', GameEnv.funFact);
        });
                    
        container.append(title)
        container.append(hintsButton)

        return container
    },

     levelTable() {
        // create table element
        const t = document.createElement("table");
        t.className = "table levels";
        //create table header
        const header = document.createElement("tr");
        const th1 = document.createElement("th");
        th1.innerText = "#";
        header.append(th1);
        const th2 = document.createElement("th");
        th2.innerText = "Level Tag";
        header.append(th2);
        t.append(header);

        // Create table rows/data
        for(let i = 0, count = 1; i < GameEnv.levels.length; i++){
            if (GameEnv.levels[i].passive) //skip passive levels
                continue; 
            // add level to table
            const row = document.createElement("tr");
            const td1 = document.createElement("td");
            td1.innerText = String(count++); //human counter
            row.append(td1);
            // place level name in button   
            const td2 = document.createElement("td");
            td2.innerText = GameEnv.levels[i].tag;
            row.append(td2);
            // listen for row click
            row.addEventListener("click",()=>{ // when player clicks on the row
                //transition to selected level
                GameControl.transitionToLevel(GameEnv.levels[i]); // resize event is triggered in transitionToLevel
            })
            // add level row to table
            t.append(row);
        }

        return t; //returns <table> element
    },

    gameSpeedInput() {
        const div = document.createElement("div");
        div.innerHTML = "Game Speed: "; // label
    
        const gameSpeed = document.createElement("input");  // get user defined game speed
        gameSpeed.type = "number";
        gameSpeed.min = 1.0;
        gameSpeed.max = 8.0;
        gameSpeed.step = 0.1;
        gameSpeed.default = 2.0; // customed property for default value
        gameSpeed.value = GameEnv.gameSpeed; // GameEnv contains latest game speed
        gameSpeed.className = "input gameSpeed";    // custom style in platformer-styles.scss
    
        gameSpeed.addEventListener("change", () => { 
            // check values are within range
            const value = parseFloat(gameSpeed.value).toFixed(1);
            gameSpeed.value = (value < gameSpeed.min || value > gameSpeed.max || isNaN(value)) ? gameSpeed.default : value;
            // dispatch event to update game speed
            window.dispatchEvent(new CustomEvent("gameSpeed", { detail: {gameSpeed:()=>gameSpeed.value} }));
        });
    
        div.append(gameSpeed); // wrap input element in div
        return div;
    },

    userIDInput () {
        const div = document.createElement("div");
        div.innerHTML = "User ID: "; // label

        const userID = document.createElement("input");  // get user defined userID
        userID.type = "text";
        userID.value = GameEnv.userID; // GameEnv contains latest userID
        userID.maxLength = 10; // set maximum length to 10 characters
        userID.className = "input userID";    // custom style in platformer-styles.scss

        userID.addEventListener("change", () => { 
            // dispatch event to update userID
            window.dispatchEvent(new CustomEvent("userID", { detail: {userID:()=>userID.value} }));
        });

        Socket.sendData("name",GameEnv.userID)

        div.append(userID); // wrap input element in div
        return div;
    },

    playerCount(){
        const div = document.createElement("div");
        const text = document.createElement("p");
        const button = document.createElement("button");

        text.innerText = "1/10 players";
        button.innerText = "check player count";

        function update(d){
            text.innerText = String(d)+"/10 players";
        }
        Socket.createListener("playerCount",update);
        button.addEventListener("click",()=>{
            Socket.removeAllListeners("playerCount")
            Socket.createListener("playerCount",update);
            Socket.socket.emit("checkPlayers","");
        });
        div.append(text);
        div.append(button);
        return div;
    },

    multiplayerButton() {
        const div = document.createElement("div");
        div.innerHTML = "Multiplayer: "; // label
    
        const button = document.createElement("button"); // button for Multiplayer
        button.innerText = String(Socket.shouldBeSynced);
    
        button.addEventListener("click", () => {
            // dispatch event to update difficulty
            button.innerText = String(Socket.changeStatus());
        });
    
        div.append(button); // wrap button element in div
        return div;
    },

    difficultyInput() {
        const div = document.createElement("div");
        div.innerHTML = "Difficulty: "; // label
    
        const difficulty = document.createElement("select"); // dropdown for difficulty
        const options = ["Easy", "Normal", "Hard", "Impossible"];
    
        options.forEach(option => {
            const opt = document.createElement("option");
            opt.value = option.toLowerCase();
            opt.text = option;
            difficulty.add(opt);
        });
    
        difficulty.value = GameEnv.difficulty; // GameEnv contains latest difficulty
    
        difficulty.addEventListener("change", () => {
            // dispatch event to update difficulty
            window.dispatchEvent(new CustomEvent("difficulty", { detail: { difficulty: () => difficulty.value } }));
        });
    
        div.append(difficulty); // wrap select element in div
        return div;
    },

    chatButton() {
        const div = document.createElement("div");
        div.innerHTML = "Chat: "; // label
    
        const button = document.createElement("button"); // button for Multiplayer
        button.innerText = "open";
    /**
     * Chat class to make the chat more refined and functional
     */
        const ChatClass = new Chat([]);
        const chatBoxContainer =  ChatClass.chatBoxContainer;
        const chatBox = chatBoxContainer.children.namedItem("chatBox");
        const chatInput = chatBoxContainer.children.namedItem("chatInput");
        const chatButton = chatBoxContainer.children.namedItem("chatButton");
        chatBoxContainer.style.display = "none";
        chatBoxContainer.style.zIndex = 2;
        chatBoxContainer.style.position = "absolute";
        chatBoxContainer.style.top = "70%";
        chatBoxContainer.style.left = "50%";
        chatBoxContainer.style.width = "50%";
        chatBoxContainer.style.height = "30%";
        chatBoxContainer.style.backgroundColor = "grey";
        chatBoxContainer.style.opacity = "65%";
        chatBoxContainer.style.borderRadius = "1%";
        chatBox.style.position = "relative";
        chatBox.style.resize = "both";
        chatBox.style.overflow = "auto";
        chatBox.style.height = "90%";
        chatBox.style.width = "100%";
        chatBox.style.top = "0%";
        chatInput.style.position = "relative";
        chatInput.style.bottom = "0%";
        chatInput.style.height = "10%"
        chatInput.style.width = "80%";
        chatButton.style.position = "relative";
        chatButton.style.height = "10%";
        chatButton.style.width = "20%";
        chatButton.style.bottom = "0%";


        document.getElementById("sidebar").insertAdjacentElement("afterend",chatBoxContainer);

        var isShown = false;
        button.addEventListener("click", () => {
            isShown=!isShown;
            if(isShown){
                chatBoxContainer.style.display = "block";
                button.innerText = "close";
            }else{
                chatBoxContainer.style.display = "none";
                button.innerText = "open"
            }
        });
    
        div.append(button); // wrap button element in div
        return div;
    },

    isThemeInput() {
        const localstorage = window.localStorage
        const lightmodekey = "islightMode"
        const div = document.createElement("div");
        div.innerHTML = "Theme Change:"; // label
        const localStorageLightModeToggle = localstorage.getItem(lightmodekey)
        
        if (localStorageLightModeToggle) {
            GameEnv.isLightMode = localStorageLightModeToggle.toLowerCase() === "true"
        }

        const islightMode = document.createElement("input");  // get user defined lightmode boolean
        islightMode.type = "checkbox";
        if (GameEnv.isLightMode) {
            enableLightMode();
            islightMode.checked = true;
        } else {
            enableDarkMode();
            islightMode.checked = false;
        }

        islightMode.addEventListener('change', () => {
            if (islightMode.checked) {
                enableLightMode();
                GameEnv.isLightMode = true;
                localstorage.setItem(lightmodekey, GameEnv.isLightMode)
            } else {
                enableDarkMode();
                GameEnv.isLightMode = false;
                localstorage.setItem(lightmodekey, GameEnv.isLightMode)
            }
        })

        div.appendChild(islightMode); 

        return div
    },

    gravityInput() {
        const div = document.createElement("div");
        div.innerHTML = "Gravity: "; // label
    
        const gravity = document.createElement("input");  // get user defined gravity
        gravity.type = "number";
        gravity.min = 1.0;
        gravity.max = 8.0;
        gravity.step = 0.1;
        gravity.default = 3.0; // customed property for default value
        gravity.value = GameEnv.gravity; // GameEnv contains latest gravity
        gravity.className = "input gravity";    // custom style in platformer-styles.scss
    
        gravity.addEventListener("change", () => { 
            // check values are within range
            const value = parseFloat(gravity.value).toFixed(1)  ;
            gravity.value = (value < gravity.min || value > gravity.max || isNaN(value)) ? gravity.default : value;
            // dispatch event to update gravity
            window.dispatchEvent(new CustomEvent("gravity", { detail: {gravity:()=>gravity.value} }));
        });
    
        div.append(gravity); // wrap input element in div
        return div;
    },

    reload () {
        window.location.reload()
    }
}

export default SettingsControl;