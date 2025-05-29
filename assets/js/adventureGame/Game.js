import GameControl from './GameEngine/GameControl.js';
import Quiz from './Quiz.js';
import Inventory from "./Inventory.js";
import { defaultItems } from "./items.js";
import GameLevelEnd from './GameLevelEnd.js';

class StatsManager {
    constructor(game) {
        this.game = game;
        this.initStatsUI();
    }
    async getNpcProgress(personId) {
        try {
            const response = await fetch(`${this.game.javaURI}/bank/${personId}/npcProgress`, this.fetchOptions);
            if (!response.ok) {
                throw new Error("Failed to fetch questions");
            }
            const npcProgressDictionary = await response.json();
            console.log(npcProgressDictionary);
            return npcProgressDictionary
        } catch (error) {
            console.error("Error fetching Npc Progress:", error);
            return null;
        }
    }
    async fetchStats(personId) {
        const endpoints = {
            balance: this.game.javaURI + '/rpg_answer/getBalance/' + personId,
            questionAccuracy: this.game.javaURI + '/rpg_answer/getQuestionAccuracy/' + personId
        };
    
        for (let [key, url] of Object.entries(endpoints)) {
            try {
                const response = await fetch(url, this.game.fetchOptions);
                const data = await response.json();
                
                if (key === "questionAccuracy") {
                    const accuracyPercent = Math.round((data ?? 0) * 100);
                    document.getElementById(key).innerHTML = `${accuracyPercent}%`;
                    localStorage.setItem(key, `${accuracyPercent}%`);
                } else {
                    document.getElementById(key).innerHTML = data ?? 0;
                    localStorage.setItem(key, data ?? 0);
                }
            } catch (err) {
                console.error(`Error fetching ${key}:`, err);
            }
        }
    }

    async createStats(stats, gname, uid) {
        try {
            const response = await fetch(`${this.game.javaURI}/createStats`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uid, gname, stats })
            });

            if (!response.ok) throw new Error("Network response was not ok");
            return await response.json();
        } catch (error) {
            console.error("Error creating stats:", error);
            return "Error creating stats";
        }
    }

    async getStats(uid) {
        try {
            const response = await fetch(`${this.game.javaURI}/getStats/${uid}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) throw new Error("Network response was not ok");
            return await response.json();
        } catch (error) {
            console.error("Error fetching stats:", error);
            return "Error fetching stats";
        }
    }

    async updateStats(stats, gname, uid) {
        try {
            const response = await fetch(`${this.game.javaURI}/updateStats`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uid, gname, stats })
            });

            if (!response.ok) throw new Error("Network response was not ok");
            return await response.json();
        } catch (error) {
            console.error("Error updating stats:", error);
            return "Error updating stats";
        }
    }

    async updateStatsMCQ(questionId, choiceId, personId) {
        try {
            const response = await fetch(this.game.javaURI + '/rpg_answer/submitMCQAnswer', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ questionId, personId, choiceId })
            });

            if (!response.ok) throw new Error("Network response was not ok");
            if (!response.ok) throw new Error("Network response was not ok");
            return response;
        } catch (error) {
            console.error("Error submitting MCQ answer:", error);
            throw error;
        }
    }

    async transitionToWallstreet(personId) {
        try {
            const response = await fetch(`${this.game.javaURI}/question/transitionToWallstreet/${personId}`, this.game.fetchOptions);
            if (!response.ok) throw new Error("Failed to fetch questions");
            const questionsAnswered = await response.json();
            return questionsAnswered >= 12;
        } catch (error) {
            console.error("Error transitioning to Wallstreet:", error);
            return null;
        }
    }

    initStatsUI() {
        const TOTAL_NPCS = 10;
        const statsWrapper = document.createElement('div');
        statsWrapper.id = 'stats-wrapper';
        Object.assign(statsWrapper.style, {
            position: 'fixed',
            top: '80px',
            right: '0',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'flex-start',
        });

        // Add pixel font if not present
        if (!document.getElementById('pixel-font-link')) {
            const fontLink = document.createElement('link');
            fontLink.id = 'pixel-font-link';
            fontLink.rel = 'stylesheet';
            fontLink.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
            document.head.appendChild(fontLink);
        }

        // Add retro stats styles
        const style = document.createElement('style');
        style.textContent = `
            #stats-button {
                background: #000;
                border: 2px solid #fff;
                padding: 8px;
                cursor: pointer;
                transition: all 0.3s;
                position: relative;
                overflow: hidden;
                box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
                animation: glowBorder 2s infinite alternate;
            }

            #stats-button::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 2px;
                background: rgba(255, 255, 255, 0.5);
                animation: scanline 2s linear infinite;
            }

            #stats-container {
                background: #000;
                border: 3px solid #fff;
                padding: 15px;
                margin-left: 10px;
                min-width: 250px;
                display: none;
                font-family: 'Press Start 2P', cursive;
                color: #fff;
                position: relative;
                box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
                animation: glowBorder 2s infinite alternate;
                opacity: 0;
                transform: translateX(-20px);
                transition: opacity 0.3s, transform 0.3s;
            }

            #stats-wrapper:hover #stats-container,
            #stats-container:focus-within {
                display: block;
                opacity: 1;
                transform: translateX(0);
            }

            #stats-wrapper.pinned #stats-container {
                display: block !important;
                opacity: 1 !important;
                transform: none !important;
            }

            #stats-button {
                background: #000;
                border: 2px solid #fff;
                padding: 8px;
                cursor: pointer;
                transition: all 0.3s;
                position: relative;
                overflow: hidden;
                box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
                animation: glowBorder 2s infinite alternate;
                z-index: 10001;
            }

            #stats-wrapper.pinned #stats-button {
                display: none;
            }

            #stats-container::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(
                    transparent 50%,
                    rgba(0, 0, 0, 0.5) 50%
                );
                background-size: 100% 4px;
                pointer-events: none;
                z-index: 1;
            }

            .pixel-title {
                font-size: 14px;
                margin-bottom: 15px;
                text-align: center;
                color: #ffeb3b;
                text-shadow: 2px 2px #000;
                position: relative;
            }

            .pixel-stat-box {
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid #ffb300;
                margin: 8px 0;
                padding: 8px;
                display: flex;
                align-items: center;
                font-size: 11px;
                position: relative;
                overflow: hidden;
                transition: all 0.3s;
            }

            .pixel-stat-box:hover {
                transform: translateX(5px);
                background: rgba(255, 255, 255, 0.15);
                border-color: #ffd700;
            }

            .pixel-stat-box::after {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(
                    90deg,
                    transparent,
                    rgba(255, 255, 255, 0.2),
                    transparent
                );
                animation: shine 2s infinite;
            }

            #npcs-progress-bar-container {
                position: relative;
                height: 20px;
                background: #000;
                border: 2px solid #ffb300;
                margin-top: 12px;
                overflow: hidden;
            }

            #npcs-progress-bar {
                height: 100%;
                background: repeating-linear-gradient(
                    45deg,
                    #ffd700,
                    #ffd700 10px,
                    #ffb300 10px,
                    #ffb300 20px
                );
                transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                animation: progressPulse 2s infinite;
            }

            #npcs-progress-label {
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                color: #fff;
                text-shadow: 1px 1px #000;
                z-index: 2;
            }

            @keyframes glowBorder {
                0% { box-shadow: 0 0 5px #fff, inset 0 0 5px #fff; }
                100% { box-shadow: 0 0 15px #fff, inset 0 0 8px #fff; }
            }

            @keyframes scanline {
                0% { transform: translateY(-100%); }
                100% { transform: translateY(100%); }
            }

            @keyframes shine {
                0% { left: -100%; }
                100% { left: 100%; }
            }

            @keyframes progressPulse {
                0% { opacity: 0.8; }
                50% { opacity: 1; }
                100% { opacity: 0.8; }
            }

            .pixel-icon {
                width: 18px !important;
                height: 18px !important;
                margin-right: 8px;
                animation: iconFloat 2s infinite alternate;
            }

            @keyframes iconFloat {
                0% { transform: translateY(0); }
                100% { transform: translateY(-3px); }
            }
        `;
        document.head.appendChild(style);

        // Get NPCs talked to count from cookies
        let npcsTalkedTo = 0;
        const cookies = document.cookie.split(';');
        const npcsCookie = cookies.find(cookie => cookie.trim().startsWith('npcsTalkedTo='));
        if (npcsCookie) {
            npcsTalkedTo = parseInt(npcsCookie.split('=')[1]) || 0;
        }

        // Pixel-art icons (using retro-style emojis)
        const coinIcon = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/1fa99.png';
        const accuracyIcon = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/1f3af.png';
        const npcIcon = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/1f9d1-200d-1f3a4.png';
        const statsIcon = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/1f3ae.png';

        // Create the button with retro styling
        const statsButton = document.createElement('div');
        statsButton.id = 'stats-button';
        statsButton.innerHTML = `<img src="${statsIcon}" alt="Stats" title="Show Player Stats" style="width:38px;height:38px;image-rendering:pixelated;" />`;

        // Create the panel with retro styling
        const statsContainer = document.createElement('div');
        statsContainer.id = 'stats-container';
        statsContainer.tabIndex = 0;

        // Add a pin button with retro styling
        const pinButton = document.createElement('button');
        pinButton.id = 'stats-pin-btn';
        pinButton.innerHTML = '📌';
        pinButton.title = 'Pin/unpin';
        Object.assign(pinButton.style, {
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'none',
            border: 'none',
            fontSize: '22px',
            cursor: 'pointer',
            zIndex: '10002',
            color: '#fff',
            textShadow: '2px 2px #000',
            transition: 'transform 0.2s, color 0.2s'
        });

        pinButton.addEventListener('mouseenter', () => {
            pinButton.style.transform = 'scale(1.2)';
            pinButton.style.color = '#ffd700';
        });
        pinButton.addEventListener('mouseleave', () => {
            pinButton.style.transform = '';
            pinButton.style.color = '#fff';
        });
        pinButton.addEventListener('click', (e) => {
            e.stopPropagation();
            setPinnedState(!pinned);
            // Play retro click sound
            const click = new Audio('data:audio/wav;base64,UklGRXEAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YUQAAAB/f39/gICAgICAgH9/f39/f39/f39/f4CAgICAgIB/f39/f39/f39/f3+AgICAgICAgICAgH9/f39/f39/f39/f39/f39/f39/fw==');
            click.volume = 0.3;
            click.play();
        });

        statsContainer.innerHTML = `
            <div class="pixel-title">
                <img class="pixel-icon" src="${statsIcon}" alt="Game" style="width:22px;height:22px;margin-right:8px;vertical-align:middle;" />
                <span>PLAYER STATS</span>
                <img class="pixel-icon" src="${statsIcon}" alt="Game" style="width:22px;height:22px;margin-left:8px;vertical-align:middle;" />
            </div>
            <div class="pixel-stat-box">
                <img class="pixel-icon" src="${coinIcon}" alt="Coin" style="width:22px;height:22px;vertical-align:middle;" />
                <span style="color: #ffb300;">Balance:</span> <span id="balance" style="margin-left: 6px;">0</span>
            </div>
            <div class="pixel-stat-box">
                <img class="pixel-icon" src="${accuracyIcon}" alt="Accuracy" style="width:22px;height:22px;vertical-align:middle;" />
                <span style="color: #ffb300;">Question Accuracy:</span> <span id="questionAccuracy" style="margin-left: 6px;">0%</span>
            </div>
            <div class="pixel-stat-box">
                <img class="pixel-icon" src="${npcIcon}" alt="NPC" style="width:22px;height:22px;vertical-align:middle;" />
                <span style="color: #ffb300;">NPCs Talked To:</span> <span id="npcsTalkedTo" style="margin-left: 6px;">${npcsTalkedTo}</span>
            </div>
            <div id="npcs-progress-bar-container">
                <div id="npcs-progress-bar" style="width: ${(Math.min(npcsTalkedTo, TOTAL_NPCS) / TOTAL_NPCS) * 100}%;"></div>
                <span id="npcs-progress-label">${npcsTalkedTo} / ${TOTAL_NPCS}</span>
            </div>
        `;

        statsContainer.appendChild(pinButton);
        statsWrapper.appendChild(statsButton);
        statsWrapper.appendChild(statsContainer);
        document.body.appendChild(statsWrapper);

        // Add hover sound effect
        const hoverSound = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU');
        hoverSound.volume = 0.2;

        // Add hover effects with sound
        const statBoxes = statsContainer.querySelectorAll('.pixel-stat-box');
        statBoxes.forEach(box => {
            box.addEventListener('mouseenter', () => {
                hoverSound.currentTime = 0;
                hoverSound.play();
            });
        });

        // --- PINNED STATE LOGIC ---
        let pinned = false;
        function setPinnedState(isPinned) {
            pinned = isPinned;
            if (pinned) {
                statsWrapper.classList.add('pinned');
                pinButton.classList.add('pinned');
                statsContainer.style.position = 'fixed';
                statsContainer.style.right = '0';
                statsContainer.style.left = '';
                statsContainer.style.display = 'block';
                statsContainer.style.opacity = '1';
                statsContainer.style.transform = 'none';
                statsContainer.style.pointerEvents = 'auto';
                statsContainer.style.padding = '18px 28px';
                statsContainer.style.overflow = 'visible';
                statsContainer.style.zIndex = '10002';
            } else {
                statsWrapper.classList.remove('pinned');
                pinButton.classList.remove('pinned');
                statsContainer.style.position = '';
                statsContainer.style.right = '';
                statsContainer.style.left = '';
                statsContainer.style.display = '';
                statsContainer.style.opacity = '';
                statsContainer.style.transform = '';
                statsContainer.style.pointerEvents = '';
                statsContainer.style.padding = '';
                statsContainer.style.overflow = '';
                statsContainer.style.zIndex = '';
            }
            // Pin color/rotation
            pinButton.style.color = pinned ? '#ffb300' : '#fff';
            pinButton.style.transform = pinned ? 'rotate(-30deg)' : '';
        }

        // If pinned, prevent hover from closing
        statsWrapper.addEventListener('mouseleave', () => {
            if (!pinned) {
                statsContainer.style.display = 'none';
                statsContainer.style.opacity = '0';
                statsContainer.style.transform = 'translateX(-20px)';
            }
        });

        statsWrapper.addEventListener('mouseenter', () => {
            statsContainer.style.display = 'block';
            // Small delay to ensure display: block is applied before transition
            requestAnimationFrame(() => {
                statsContainer.style.opacity = '1';
                statsContainer.style.transform = 'translateX(0)';
            });
        });

        // Optional: clicking anywhere else unpins
        document.addEventListener('click', (e) => {
            if (pinned && !statsWrapper.contains(e.target)) {
                setPinnedState(false);
            }
        });
        // --- END PINNED STATE LOGIC ---
    }

    updateNpcsTalkedToUI(count) {
        const npcsSpan = document.getElementById('npcsTalkedTo');
        if (npcsSpan) {
            npcsSpan.textContent = count;
        }
        // Update progress bar
        const bar = document.getElementById('npcs-progress-bar');
        const label = document.getElementById('npcs-progress-label');
        if (bar && label) {
            const TOTAL_NPCS = 10;
            bar.style.width = `${(Math.min(count, TOTAL_NPCS) / TOTAL_NPCS) * 100}%`;
            label.textContent = `${count} / ${TOTAL_NPCS}`;
        }
    }

    incrementNpcsTalkedTo() {
        // Get current count from cookies
        let npcsTalkedTo = 0;
        const cookies = document.cookie.split(';');
        const npcsCookie = cookies.find(cookie => cookie.trim().startsWith('npcsTalkedTo='));
        if (npcsCookie) {
            npcsTalkedTo = parseInt(npcsCookie.split('=')[1]) || 0;
        }
        npcsTalkedTo += 1;
        // Update cookie (expires in 30 days)
        document.cookie = `npcsTalkedTo=${npcsTalkedTo}; path=/; max-age=${60*60*24*30}`;
        this.updateNpcsTalkedToUI(npcsTalkedTo);
    }
}

class InventoryManager {
    constructor(game) {
        this.game = game;
        this.inventory = Inventory.getInstance();
    }

    giveItem(itemId, quantity = 1) {
        const item = defaultItems[itemId];
        if (!item) {
            console.error(`Item ${itemId} not found in defaultItems`);
            return false;
        }

        const itemToAdd = {
            ...item,
            quantity: quantity
        };

        return this.inventory.addItem(itemToAdd);
    }

    removeItem(itemId, quantity = 1) {
        return this.inventory.removeItem(itemId, quantity);
    }

    hasItem(itemId) {
        return this.inventory.items.some(item => item.id === itemId);
    }

    getItemQuantity(itemId) {
        const item = this.inventory.items.find(item => item.id === itemId);
        return item ? item.quantity : 0;
    }

    giveStartingItems() {
        this.giveItem('stock_certificate', 5);
        this.giveItem('bond', 3);
        this.giveItem('trading_boost', 2);
        this.giveItem('speed_boost', 2);
        this.giveItem('calculator', 1);
        this.giveItem('market_scanner', 1);
        this.giveItem('rare_coin', 1);
        this.giveItem('trading_manual', 1);
        this.giveItem('roi_calculator', 1);
    }
}

class QuizManager {
    constructor(game) {
        this.game = game;
    }

    async fetchQuestionByCategory(category) {
        try {
            const personId = this.game.id;
            const response = await fetch(
                `${this.game.javaURI}/rpg_answer/getQuestion?category=${category}&personid=${personId}`, 
                this.game.fetchOptions
            );
    
            if (!response.ok) throw new Error("Failed to fetch questions");
            const questions = await response.json();
            return questions;
        } catch (error) {
            console.error("Error fetching question by category:", error);
            return null;
        }
    }
    
    async attemptQuizForNpc(npcCategory, callback = null) {
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
}

class Game {
    constructor(environment) {
        this.environment = environment;
        this.path = environment.path;
        this.gameContainer = environment.gameContainer;
        this.gameCanvas = environment.gameCanvas;
        this.pythonURI = environment.pythonURI;
        this.javaURI = environment.javaURI;
        this.fetchOptions = environment.fetchOptions;
        this.uid = null;
        this.id = null;
        this.gname = null;

        this.statsManager = new StatsManager(this);
        this.inventoryManager = new InventoryManager(this);
        this.quizManager = new QuizManager(this);
        
        this.initUser();
        this.inventoryManager.giveStartingItems();
        this.showGameInstructions();
        
        // Add keyboard event listener for 'H' key
        document.addEventListener('keydown', (event) => {
            if (event.key.toLowerCase() === 'h') {
                this.showGameInstructions();
            }
        });
        
        const gameLevelClasses = environment.gameLevelClasses;
        new GameControl(this, gameLevelClasses).start();
    }

    static main(environment) {
        return new Game(environment);
    }

    initUser() {
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

                const javaURL = this.javaURI + '/rpg_answer/person/' + this.uid;
                return fetch(javaURL, this.fetchOptions);
            })
            .then(response => {
                if (!response || !response.ok) {
                    throw new Error(`Spring server response: ${response?.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (!data) return;
                this.id = data.id;
                this.statsManager.fetchStats(data.id);
            })
            .catch(error => {
                console.error("Error:", error);
            });
    }

    giveItem(itemId, quantity = 1) {
        return this.inventoryManager.giveItem(itemId, quantity);
    }

    removeItem(itemId, quantity = 1) {
        return this.inventoryManager.removeItem(itemId, quantity);
    }

    hasItem(itemId) {
        return this.inventoryManager.hasItem(itemId);
    }

    getItemQuantity(itemId) {
        return this.inventoryManager.getItemQuantity(itemId);
    }

    attemptQuizForNpc(npcCategory, callback = null) {
        return this.quizManager.attemptQuizForNpc(npcCategory, callback);
    }

    showGameInstructions() {
        // Create modal container
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #000;
            padding: 25px;
            border: 4px solid #fff;
            color: white;
            z-index: 10000;
            max-width: 600px;
            width: 90%;
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
            font-family: 'Press Start 2P', cursive;
            animation: glowBorder 2s infinite alternate;
            position: relative;
            overflow: hidden;
        `;

        // Add content
        modal.innerHTML = `
            <style>
                @keyframes glowBorder {
                    0% { box-shadow: 0 0 5px #fff, inset 0 0 5px #fff; }
                    100% { box-shadow: 0 0 15px #fff, inset 0 0 8px #fff; }
                }
                @keyframes scanline {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                }
                @keyframes shine {
                    0% { left: -100%; }
                    100% { left: 100%; }
                }
                .instruction-box {
                    background: rgba(255, 255, 255, 0.1);
                    border: 2px solid #ffb300;
                    margin: 8px 0;
                    padding: 12px;
                    display: flex;
                    align-items: center;
                    font-size: 0.7em;
                    position: relative;
                    overflow: hidden;
                    transition: all 0.3s;
                }
                .instruction-box:hover {
                    transform: translateX(5px);
                    background: rgba(255, 255, 255, 0.15);
                    border-color: #ffd700;
                }
                .instruction-box::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(255, 255, 255, 0.2),
                        transparent
                    );
                    animation: shine 2s infinite;
                }
                .instruction-icon {
                    font-size: 1.2em;
                    margin-right: 15px;
                    color: #ffb300;
                }
                .instruction-label {
                    color: #ffb300;
                    margin-right: 8px;
                }
                .modal-title {
                    font-size: 1.2em;
                    margin-bottom: 20px;
                    text-align: center;
                    color: #ffeb3b;
                    text-shadow: 2px 2px #000;
                    position: relative;
                }
                .button-container {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                    margin-top: 20px;
                }
                .game-button {
                    background: #000;
                    color: #fff;
                    border: 2px solid #ffb300;
                    padding: 12px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-family: 'Press Start 2P', cursive;
                    font-size: 0.7em;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }
                .game-button:hover {
                    transform: translateY(-2px);
                    border-color: #ffd700;
                    box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
                }
                .game-button::after {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: linear-gradient(
                        45deg,
                        transparent,
                        rgba(255, 255, 255, 0.1),
                        transparent
                    );
                    transform: rotate(45deg);
                    animation: shine 2s infinite;
                }
                .scanline {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background: rgba(255, 255, 255, 0.1);
                    animation: scanline 2s linear infinite;
                    pointer-events: none;
                }
            </style>
            <div class="scanline"></div>
            <h2 class="modal-title">
                <span style="color: #4CAF50;">⚡</span> HOW TO PLAY <span style="color: #4CAF50;">⚡</span>
            </h2>
            <div class="instruction-box">
                <span class="instruction-icon">🎮</span>
                <span class="instruction-label">Movement:</span>
                <span>WASD or Arrow Keys to move</span>
            </div>
            <div class="instruction-box">
                <span class="instruction-icon">🗣️</span>
                <span class="instruction-label">Interact:</span>
                <span>Press E near NPCs</span>
            </div>
            <div class="instruction-box">
                <span class="instruction-icon">📊</span>
                <span class="instruction-label">Stats:</span>
                <span>Click stats icon (top-right)</span>
            </div>
            <div class="instruction-box">
                <span class="instruction-icon">🎒</span>
                <span class="instruction-label">Inventory:</span>
                <span>Press I to view items</span>
            </div>
            <div class="instruction-box">
                <span class="instruction-icon">💰</span>
                <span class="instruction-label">Goal:</span>
                <span>Learn finance & earn money!</span>
            </div>
            <div class="instruction-box">
                <span class="instruction-icon">❓</span>
                <span class="instruction-label">Help:</span>
                <span>Press H to show this menu</span>
            </div>
            <div class="button-container">
                <button class="game-button" id="closeInstructions">GOT IT!</button>
            </div>
        `;

        // Close modal on button click
        modal.querySelector('#closeInstructions').addEventListener('click', () => {
            modal.style.opacity = '0';
            modal.style.transform = 'translate(-50%, -50%) scale(0.95)';
            setTimeout(() => modal.remove(), 500);
        });

        // Add fade-in animation
        modal.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        modal.style.opacity = '0';
        modal.style.transform = 'translate(-50%, -50%) scale(0.95)';
        document.body.appendChild(modal);
        
        // Trigger animation after a short delay
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 100);

        // Add sound effects
        const hoverSound = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU');
        hoverSound.volume = 0.2;

        // Add hover sound effects to instruction boxes and buttons
        const elements = modal.querySelectorAll('.instruction-box, .game-button');
        elements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                hoverSound.currentTime = 0;
                hoverSound.play();
            });
        });
    }
}

export default Game;