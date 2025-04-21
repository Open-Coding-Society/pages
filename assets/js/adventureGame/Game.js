import GameControl from './GameEngine/GameControl.js';
import Quiz from './Quiz.js';
import Inventory from "./Inventory.js";
import { defaultItems } from "./items.js";

class Game {
    constructor() {
        // initialize user and launch GameControl 
        this.main(environment);
        console.log("Initializing game inventory...");
        this.inventory = Inventory.getInstance();
        
        // Give starting items to the player
        this.giveStartingItems();
    }

    // initialize user and launch GameControl 
    static main(environment) {
        // setting Web Application path
        this.environment = environment;
        this.path = environment.path;

        // setting Element IDs
        this.gameContainer = environment.gameContainer;
        this.gameCanvas = environment.gameCanvas;

        // setting API environment variables 
        this.pythonURI = environment.pythonURI;
        this.javaURI = environment.javaURI;
        this.fetchOptions = environment.fetchOptions;

        // prepare user data for scoring and stats 
        this.uid;
        this.id;
        this.initUser();
        this.initStatsUI();

        this.gname = null;

        // start the game immediately
        const gameLevelClasses = environment.gameLevelClasses;
        new GameControl(this, gameLevelClasses).start();
    }

    static initUser() {
        const pythonURL = this.pythonURI + '/api/id';
        fetch(pythonURL, this.fetchOptions)
            .then(response => {
                if (response.status !== 200) {
                    console.error("HTTP status code: " + response.status);
                    return null;
                }
                return response.json();
            })
            .then(data => {
                if (!data) return;
                this.uid = data.uid;
                console.log("User ID:", this.uid);

                const javaURL = this.javaURI + '/rpg_answer/person/' + this.uid;
                return fetch(javaURL, this.fetchOptions);
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Spring server response: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (!data) return;
                this.id = data.id;
                this.fetchStats(data.id);
            })
            .catch(error => {
                console.error("Error:", error);
            });
    }

    static fetchStats(personId) {
        const endpoints = {
            balance: this.javaURI + '/rpg_answer/getBalance/' + personId,
            questionAccuracy: this.javaURI + '/rpg_answer/getQuestionAccuracy/' + personId
        };
    
        for (let [key, url] of Object.entries(endpoints)) {
            fetch(url, this.fetchOptions)
                .then(response => response.json())
                .then(data => {
                    if (key === "questionAccuracy") {
                        const accuracyPercent = Math.round((data ?? 0) * 100);
                        document.getElementById(key).innerHTML = `${accuracyPercent}%`;
                        localStorage.setItem(key, `${accuracyPercent}%`);
                    } else {
                        document.getElementById(key).innerHTML = data ?? 0;
                        localStorage.setItem(key, data ?? 0);
                    }
                })
                .catch(err => console.error(`Error fetching ${key}:`, err));
        }
    }

    static async createStats(stats, gname, uid) {
        try {
            const response = await fetch(`${this.javaURI}/createStats`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ uid, gname, stats })
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error creating stats:", error);
            return "Error creating stats";
        }
    }

    static async getStats(uid) {
        try {
            const response = await fetch(`${this.javaURI}/getStats/${uid}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching stats:", error);
            return "Error fetching stats";
        }
    }

    static async updateStats(stats, gname, uid) {
        try {
            const response = await fetch(`${this.javaURI}/updateStats`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ uid, gname, stats })
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error updating stats:", error);
            return "Error updating stats";
        }
    }

    static async fetchQuestionByCategory(category) {
        try {
            const personId = this.id;
            const response = await fetch(
                `${this.javaURI}/rpg_answer/getQuestion?category=${category}&personid=${personId}`, 
                this.fetchOptions
            );
    
            if (!response.ok) {
                throw new Error("Failed to fetch questions");
            }
    
            const questions = await response.json();
            console.log(questions);
            return questions;
        } catch (error) {
            console.error("Error fetching question by category:", error);
            return null;
        }
    }
    
    static async attemptQuizForNpc(npcCategory, callback = null) {
        const personId = this.id;
    
        try {
            const response = await this.fetchQuestionByCategory(npcCategory);
            const allQuestions = response?.questions || [];
    
            if (allQuestions.length === 0) {
                alert(`✅ You've already completed all of ${npcCategory}'s questions!`);
                return;
            }
    
            const quiz = new Quiz();
            quiz.initialize();
            quiz.openPanel(npcCategory, callback, allQuestions);
    
        } catch (error) {
            console.error("Error during NPC quiz attempt:", error);
            alert("⚠️ There was a problem loading the quiz. Please try again.");
        }
    }
    
    static async updateStatsMCQ(questionId, choiceId, personId) {
        try {
            console.log("Submitting answer with:", { questionId, choiceId, personId });

            const response = await fetch(this.javaURI + '/rpg_answer/submitMCQAnswer', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ questionId, personId, choiceId })
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            return response;
        } catch (error) {
            console.error("Error submitting MCQ answer:", error);
            throw error;
        }
    }

    static async transitionToWallstreet(personId) {
        try {
            const response = await fetch(`${this.javaURI}/question/transitionToWallstreet/${personId}`, this.fetchOptions);
            if (!response.ok) {
                throw new Error("Failed to fetch questions");
            }
            const questionsAnswered = await response.json();
            return questionsAnswered >=12;
        } catch (error) {
            console.error("Error transitioning to Paradise:", error);
            return null;
        }
    }

    static initStatsUI() {
        const statsContainer = document.createElement('div');
        statsContainer.id = 'stats-container';
        statsContainer.style.position = 'fixed';
        statsContainer.style.top = '75px';
        statsContainer.style.right = '10px';
        statsContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        statsContainer.style.color = 'white';
        statsContainer.style.padding = '10px';
        statsContainer.style.borderRadius = '5px';
    
        const cookies = document.cookie.split(';');
        const gameKeyCookie = cookies.find(cookie => cookie.trim().startsWith('gameKey='));
        const meteorKeyStatus = gameKeyCookie ? '✅ Meteor Key Earned' : '❌ Meteor Key Not Earned';
    
        statsContainer.innerHTML = `
            <div>Balance: <span id="balance">0</span></div>
            <div>Question Accuracy: <span id="questionAccuracy">0%</span></div>
            <div style="color: ${gameKeyCookie ? '#00ff00' : '#ff4444'}">${meteorKeyStatus}</div>
        `;
        document.body.appendChild(statsContainer);
    }

    // Add method to give items to player
    giveItem(itemId, quantity = 1) {
        console.log("Giving item:", itemId, "quantity:", quantity);
        const item = defaultItems[itemId];
        if (!item) {
            console.error(`Item ${itemId} not found in defaultItems`);
            return false;
        }

        const itemToAdd = {
            ...item,
            quantity: quantity
        };

        console.log("Adding item to inventory:", itemToAdd);
        return this.inventory.addItem(itemToAdd);
    }

    // Add method to remove items from player
    removeItem(itemId, quantity = 1) {
        return Inventory.getInstance().removeItem(itemId, quantity);
    }

    // Add method to check if player has an item
    hasItem(itemId) {
        return Inventory.getInstance().items.some(item => item.id === itemId);
    }

    // Add method to get item quantity
    getItemQuantity(itemId) {
        const item = Inventory.getInstance().items.find(item => item.id === itemId);
        return item ? item.quantity : 0;
    }

    // Add method to give starting items
    giveStartingItems() {
        console.log("Giving starting items to player...");
        
        // Trading items
        this.giveItem('stock_certificate', 5);  // 5 stock certificates
        this.giveItem('bond', 3);               // 3 bonds
        
        // Power-ups
        this.giveItem('trading_boost', 2);      // 2 trading boosts
        this.giveItem('speed_boost', 2);        // 2 speed boosts
        
        // Tools
        this.giveItem('calculator', 1);         // 1 calculator
        this.giveItem('market_scanner', 1);     // 1 market scanner
        
        // Collectibles
        this.giveItem('rare_coin', 1);          // 1 rare coin
        this.giveItem('trading_manual', 1);     // 1 trading manual

        // Add ROI Calculator
        console.log("Adding ROI Calculator...");
        this.giveItem('roi_calculator', 1);     // 1 ROI Calculator
    }
}
export default Game;