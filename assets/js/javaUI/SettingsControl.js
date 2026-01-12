// SettingsControl.js key purpose is key/value management for game settings.
import LocalStorage from "./LocalStorage.js";
import GameEnv from "./GameEnv.js";
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
        sidebar.style.width = isOpen?"70%":"0px";
        sidebar.style.top = isOpen?"15%":"0px";
        sidebar.style.left = isOpen?"15%":"0px";
    }
}

let isOpen = true

// define the SettingsControl class
export class SettingsControl extends LocalStorage{
    constructor(){ //default keys for localStorage
        var keys = {
            userID:"userID",
            isInverted:"isInverted",
            difficulty: "difficulty",
        }; 
        super(keys); //creates this.keys
    }

    reloadGame() {
        // Add code to reload or restart your game here
        // You may want to perform actions like resetting the game state, restarting the level, etc.
        // Example:
        window.location.reload(); // Reload the entire page (this might not be suitable for all scenarios)
        // Alternatively, you may have a custom function to handle game restart logic.
    }
    

    /**
     * Note. Separated from constructor so that class can be created before levels are addeda
     * 
     * Initializes the SettingsControl instance.
     * Loads all keys from local storage.
     * For each key, 
     * * If it exists in local storage, loads and parses its value.
     * * Else when the key does not exist in local storage, sets key to the corresponding GameEnv.js variable.
     */
    initialize(){ 
        // Load all keys from local storage
        this.loadAll();
        
        window.addEventListener("difficulty", (e) => {
            // Update the difficulty value when a difficulty event is fired
            this[this.keys.difficulty] = e.detail.difficulty();
            // Update the difficulty value in the game environment
            GameEnv.difficulty = parseFloat(this[this.keys.difficulty]);
            // Save the difficulty value to local storage
            this.save(this.keys.difficulty);
    
            // Reload the game to apply the new difficulty settings
            this.reloadGame();
        });

        /**
         * Handles a key by checking if it exists in local storage and parsing its value.
         * If the key does not exist in local storage, it sets the key to the current value of the game environment variable.
         *
         * @param {string} key - The localstorae key.
         * @param {*} gameEnvVariable - The corresponding game environment variable.
         * @param {function} [parser=(val) => val] - An optional function to parse the value from local storage.
         * If no parser parameter/function is provided, (val) => val is unchanged.
         * Else if parser is provided, the value is parsed ... e.g.: 
         * * (val) => vall === "true" parses the value as a boolean
         * * (val) =>  parseFloat(val) parses the value as a floating point number
         */
        const handleKey = (key, gameEnvVariable, parser = (val) => val) => {
            if (this[this.keys[key]]) {
                return parser(this[this.keys[key]]);
            } else {
                this[this.keys[key]] = gameEnvVariable;
                return gameEnvVariable;
            }
        };

        /* Call the handleKey function to set up each game environment variable
         * The handleKey function takes three parameters:
            * * key - the local storage key
            * * gameEnvVariable - the corresponding game environment variable
            * * parser - an optional function to parse the value extracted from local storage
        */
        // 'userID', the value is parsed as a string
        GameEnv.userID = handleKey('userID', GameEnv.userID);
        // 'isInverted', the value is parsed to a boolean
        GameEnv.isInverted = handleKey('isInverted', GameEnv.isInverted, (val) => val === "true");
        // 'difficulty', the value is parsed to a floating point number
        GameEnv.difficulty = handleKey('difficulty', GameEnv.difficulty);


        // List for th 'userID' update event
        window.addEventListener("userID", (e)=>{
            // Update the userID value when a userID event is fired
            this[this.keys.userID] = e.detail.userID();
            // Update the userID value in the game environment
            GameEnv.userID = this[this.keys.userID];

            // Save the userID value to local storage
            this.save(this.keys.userID);
        });
        
        // Listen for the 'isInverted' update event
        window.addEventListener("isInverted", (e)=>{ 
            // Update the isInverted value when an invert event is fired
            this[this.keys.isInverted] = e.detail.isInverted();
            // Update the isInverted value in the game environment
            GameEnv.isInverted = this[this.keys.isInverted]; 
            // Save the isInverted value to local storage
            this.save(this.keys.isInverted); 
        });

        window.addEventListener("isTheme", (e)=>{ 
            // Update the isInverted value when an invert event is fired
            this[this.keys.isTheme] = e.detail.isTheme();
            // Update the isInverted value in the game environment
            GameEnv.isTheme = this[this.keys.isTheme]; 
            // Save the isInverted value to local storage
            this.save(this.keys.isTheme); 
        });
 
    }

    /**
     * Getter for the userID property.
     * Creates a div with a text input for the user to enter a userID.
     * The input's value is bound to the GameEnv's userID string.
     * @returns {HTMLDivElement} The div containing the userID input.
     */
    get userIDInput() {
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

        div.append(userID); // wrap input element in div
        return div;
    }

    /**
     * Getter for the isInvertedInput property.
     * Creates a div with a checkbox input for the user to invert the game controls.
     * The checkbox's checked state is bound to the GameEnv's isInverted state.
     * @returns {HTMLDivElement} The div containing the isInverted checkbox.
     */
    get isInvertedInput() {
        const div = document.createElement("div");
        div.innerHTML = "Invert: "; // label
    
        const isInverted = document.createElement("input");  // get user defined invert boolean
        isInverted.type = "checkbox";
        isInverted.checked = GameEnv.isInverted; // GameEnv contains latest isInverted state
    
        isInverted.addEventListener("change", () => { 
            //`dispatch event to update isInverted
            window.dispatchEvent(new CustomEvent("isInverted", { detail: {isInverted:()=>isInverted.checked} }));
        });
    
        div.append(isInverted); // wrap input element in div
        return div;
    }

    get isThemeInput() {
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
        console.log(GameEnv.isLightMode)
        });


        // Append elements to the DOM or wherever appropriate
        div.appendChild(islightMode); 
        return div
        // Append div to your settings container
        // For example:
        // document.getElementById('settingsContainer').appendChild(div);
    }


    /**
     * Getter for the difficultyInput property.
     * Creates a div with a number input for the user to adjust the game difficulty.
     * @returns {HTMLDivElement} The div containing the difficultly input.
     */
    get difficultyInput() {
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
    }
    
    /**
     * Static method to initialize the game settings controller and add the settings controls to the sidebar.
     * Constructs an HTML table/menu from HTML inputs for invert, theme, etc.
     * Each input has an event update associated with it.
     * All elements are appended to the sidebar.
     */
    static sidebar(){
        // Initiliaze Game settings controller 
        var settingsControl = new SettingsControl();
        settingsControl.initialize();

       // Get/Construct HTML input and event update for invert
       var invertControl = settingsControl.isInvertedInput;
       document.getElementById("sidebar").append(invertControl); 

       // Get/Construct HTML input and event update for difficulty
       var difficultyInput = settingsControl.difficultyInput;
       document.getElementById("sidebar").append(difficultyInput);


       // Get/Construct HTML button and event update for theme
       var themeButton = settingsControl.themeButton;
       document.getElementById("sidebar").append(themeButton);


          // Get/Construct HTML input and event update for theme change
        var themeChangeControl = settingsControl.isThemeInput;
        document.getElementById("sidebar").append(themeChangeControl); 

        // Listener, isOpen, and function for sidebar open and close
        var submenuHeight = 0; // calculated height of submenu
        function sidebarPanel(){
            // toggle isOpen
            isOpen = true;
            // open and close properties for sidebar based on isOpen
            backgroundDim.create()
            var sidebar = document.querySelector('.sidebar');
            sidebar.style.width = isOpen?"200px":"0px";
            sidebar.style.paddingLeft = isOpen?"10px":"0px";
            sidebar.style.paddingRight = isOpen?"10px":"0px";
            sidebar.style.top = `calc(${submenuHeight}px + ${GameEnv.top}px)`;
        }
        // settings-button and event listener opens sidebar
        document.getElementById("settings-button").addEventListener("click",sidebarPanel);
        // sidebar-header and event listener closes sidebar
        document.getElementById("sidebar-header").addEventListener("click",sidebarPanel);

        window.addEventListener('load', function() {
            var submenu = document.querySelector('.submenu');
            submenuHeight = submenu.offsetHeight;
        });
    }
    
}

export default SettingsControl;