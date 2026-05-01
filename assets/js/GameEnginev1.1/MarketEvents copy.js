import SoundManager from './SoundManager.js';

class MarketEvents {
    constructor(gameEnv) {
        this.gameEnv = gameEnv;
        this.events = [];
        this.activeEvents = [];
        this.eventHistory = [];
        this.soundManager = new SoundManager();
        this.eventTypes = {
            MARKET_CRASH: 'market_crash',
            BULL_RUN: 'bull_run',
            EARNINGS_SEASON: 'earnings_season',
            FED_ANNOUNCEMENT: 'fed_announcement',
            MERGER_NEWS: 'merger_news',
            IPO: 'ipo',
            NATURAL_DISASTER: 'natural_disaster',
            POLITICAL_EVENT: 'political_event',
            TECH_BREAKTHROUGH: 'tech_breakthrough',
            REGULATORY_CHANGE: 'regulatory_change'
        };
        this.initializeEvents();
    }

    initializeEvents() {
        // Market Crash Event
        this.events.push({
            type: this.eventTypes.MARKET_CRASH,
            title: "Market Crash",
            description: "A sudden market crash has occurred! Stock prices are plummeting.",
            duration: 300, // 5 minutes
            effect: {
                marketVolatility: 2.0,
                priceChange: -0.3,
                tradingVolume: 2.5,
                message: "Market crash! Stock prices are falling rapidly!",
                npcEffect: {
                    speed: 0.7, // NPCs move 30% slower
                    panic: true, // NPCs run around in panic
                    color: "red" // NPCs turn red
                }
            },
            visualEffect: "red_flash",
            soundEffect: "crash_sound"
        });

        // Bull Run Event
        this.events.push({
            type: this.eventTypes.BULL_RUN,
            title: "Bull Market Rally",
            description: "A strong bull market rally is driving prices up!",
            duration: 300,
            effect: {
                marketVolatility: 1.5,
                priceChange: 0.25,
                tradingVolume: 2.0,
                message: "Bull market rally! Prices are soaring!",
                npcEffect: {
                    speed: 1.3, // NPCs move 30% faster
                    happy: true, // NPCs jump with joy
                    color: "green" // NPCs turn green
                }
            },
            visualEffect: "green_flash",
            soundEffect: "rally_sound"
        });

        // Earnings Season Event
        this.events.push({
            type: this.eventTypes.EARNINGS_SEASON,
            title: "Earnings Season",
            description: "Major companies are reporting their earnings this week.",
            duration: 600, // 10 minutes
            effect: {
                marketVolatility: 1.8,
                priceChange: 0.15,
                tradingVolume: 1.8,
                message: "Earnings reports are coming in! Watch for price movements!",
                npcEffect: {
                    speed: 1.1, // NPCs move slightly faster
                    busy: true, // NPCs look busy with papers
                    color: "blue" // NPCs turn blue
                }
            },
            visualEffect: "chart_flash",
            soundEffect: "earnings_sound"
        });

        // Fed Announcement Event
        this.events.push({
            type: this.eventTypes.FED_ANNOUNCEMENT,
            title: "Fed Policy Announcement",
            description: "The Federal Reserve is making a major policy announcement.",
            duration: 180, // 3 minutes
            effect: {
                marketVolatility: 2.2,
                priceChange: 0.2,
                tradingVolume: 2.2,
                message: "Fed announcement! Market is reacting to policy changes!",
                npcEffect: {
                    speed: 0.9, // NPCs move slightly slower
                    serious: true, // NPCs look serious
                    color: "gold" // NPCs turn gold
                }
            },
            visualEffect: "gold_flash",
            soundEffect: "fed_sound"
        });

        // Merger News Event
        this.events.push({
            type: this.eventTypes.MERGER_NEWS,
            title: "Major Merger Announcement",
            description: "Two major companies have announced a merger!",
            duration: 240, // 4 minutes
            effect: {
                marketVolatility: 1.6,
                priceChange: 0.18,
                tradingVolume: 1.9,
                message: "Merger news! Stock prices are reacting to the announcement!"
            },
            visualEffect: "blue_flash",
            soundEffect: "merger_sound"
        });

        // IPO Event
        this.events.push({
            type: this.eventTypes.IPO,
            title: "Major IPO Launch",
            description: "A highly anticipated company is going public!",
            duration: 300,
            effect: {
                marketVolatility: 1.7,
                priceChange: 0.22,
                tradingVolume: 2.1,
                message: "IPO launch! New stock available for trading!"
            },
            visualEffect: "purple_flash",
            soundEffect: "ipo_sound"
        });

        // Natural Disaster Event
        this.events.push({
            type: this.eventTypes.NATURAL_DISASTER,
            title: "Natural Disaster Impact",
            description: "A natural disaster is affecting major markets.",
            duration: 360,
            effect: {
                marketVolatility: 2.3,
                priceChange: -0.25,
                tradingVolume: 2.0,
                message: "Natural disaster! Market is experiencing significant volatility!"
            },
            visualEffect: "red_flash",
            soundEffect: "disaster_sound"
        });

        // Political Event Event
        this.events.push({
            type: this.eventTypes.POLITICAL_EVENT,
            title: "Political Event Impact",
            description: "Major political news is affecting market sentiment.",
            duration: 300,
            effect: {
                marketVolatility: 1.9,
                priceChange: 0.15,
                tradingVolume: 1.7,
                message: "Political news! Market sentiment is shifting!"
            },
            visualEffect: "yellow_flash",
            soundEffect: "political_sound"
        });

        // Tech Breakthrough Event
        this.events.push({
            type: this.eventTypes.TECH_BREAKTHROUGH,
            title: "Tech Industry Breakthrough",
            description: "A major technological breakthrough has been announced!",
            duration: 240,
            effect: {
                marketVolatility: 1.5,
                priceChange: 0.28,
                tradingVolume: 1.8,
                message: "Tech breakthrough! Tech stocks are surging!"
            },
            visualEffect: "blue_flash",
            soundEffect: "tech_sound"
        });

        // Regulatory Change Event
        this.events.push({
            type: this.eventTypes.REGULATORY_CHANGE,
            title: "Regulatory Changes",
            description: "New regulations are affecting market operations.",
            duration: 300,
            effect: {
                marketVolatility: 1.8,
                priceChange: -0.15,
                tradingVolume: 1.6,
                message: "Regulatory changes! Market is adjusting to new rules!"
            },
            visualEffect: "orange_flash",
            soundEffect: "regulatory_sound"
        });
    }

    startEvent(eventType) {
        const event = this.events.find(e => e.type === eventType);
        if (event) {
            this.activeEvents.push({
                ...event,
                startTime: Date.now(),
                endTime: Date.now() + (event.duration * 1000)
            });
            this.applyEventEffects(event);
            this.showEventNotification(event);
            this.playEventEffects(event);
        }
    }

    applyEventEffects(event) {
        // Apply market effects
        if (this.gameEnv.market) {
            this.gameEnv.market.applyEventEffects(event.effect);
        }

        // Apply NPC effects
        if (event.effect.npcEffect) {
            this.applyNPCEffects(event.effect.npcEffect);
        }
    }

    applyNPCEffects(npcEffect) {
        // Find all NPCs in the game
        const npcs = this.gameEnv.gameObjects.filter(obj => obj instanceof NPC);
        
        npcs.forEach(npc => {
            // Apply speed changes
            if (npcEffect.speed) {
                npc.baseSpeed *= npcEffect.speed;
            }

            // Apply visual effects
            if (npcEffect.color) {
                npc.color = npcEffect.color;
            }

            // Apply behavior changes
            if (npcEffect.panic) {
                this.startPanicBehavior(npc);
            } else if (npcEffect.happy) {
                this.startHappyBehavior(npc);
            } else if (npcEffect.busy) {
                this.startBusyBehavior(npc);
            } else if (npcEffect.serious) {
                this.startSeriousBehavior(npc);
            }
        });
    }

    startPanicBehavior(npc) {
        // Make NPCs run around randomly in panic
        const originalBehavior = npc.update;
        npc.update = () => {
            // Random direction changes
            if (Math.random() < 0.1) {
                npc.xVelocity = (Math.random() - 0.5) * 5;
                npc.yVelocity = (Math.random() - 0.5) * 5;
            }
            originalBehavior.call(npc);
        };

        // Reset after event duration
        setTimeout(() => {
            npc.update = originalBehavior;
            npc.xVelocity = 0;
            npc.yVelocity = 0;
        }, 300000); // 5 minutes
    }

    startHappyBehavior(npc) {
        // Make NPCs jump with joy
        const originalBehavior = npc.update;
        npc.update = () => {
            // Add jumping motion
            npc.yVelocity = Math.sin(Date.now() / 200) * 2;
            originalBehavior.call(npc);
        };

        setTimeout(() => {
            npc.update = originalBehavior;
            npc.yVelocity = 0;
        }, 300000);
    }

    startBusyBehavior(npc) {
        // Make NPCs look busy with papers
        const originalBehavior = npc.update;
        npc.update = () => {
            // Add slight movement to simulate busyness
            npc.xVelocity = Math.sin(Date.now() / 1000) * 0.5;
            originalBehavior.call(npc);
        };

        setTimeout(() => {
            npc.update = originalBehavior;
            npc.xVelocity = 0;
        }, 600000); // 10 minutes
    }

    startSeriousBehavior(npc) {
        // Make NPCs move more deliberately
        const originalBehavior = npc.update;
        npc.update = () => {
            // Reduce movement speed and make it more deliberate
            npc.xVelocity *= 0.9;
            npc.yVelocity *= 0.9;
            originalBehavior.call(npc);
        };

        setTimeout(() => {
            npc.update = originalBehavior;
        }, 180000); // 3 minutes
    }

    showEventNotification(event) {
        // Create and show event notification
        const notification = document.createElement('div');
        notification.className = 'market-event-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, rgba(0, 32, 64, 0.98) 0%, rgba(0, 16, 32, 0.98) 100%);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            animation: slideIn 0.5s ease forwards;
            border-left: 4px solid #00ff80;
        `;

        // Add frog emojis based on event type
        let frogEmoji = '🐸';
        switch(event.type) {
            case this.eventTypes.MARKET_CRASH:
                frogEmoji = '🐸💥';
                break;
            case this.eventTypes.BULL_RUN:
                frogEmoji = '🐸🚀';
                break;
            case this.eventTypes.EARNINGS_SEASON:
                frogEmoji = '🐸📊';
                break;
            case this.eventTypes.FED_ANNOUNCEMENT:
                frogEmoji = '🐸🏦';
                break;
            case this.eventTypes.MERGER_NEWS:
                frogEmoji = '🐸🤝';
                break;
            case this.eventTypes.IPO:
                frogEmoji = '🐸📈';
                break;
            case this.eventTypes.NATURAL_DISASTER:
                frogEmoji = '🐸🌪️';
                break;
            case this.eventTypes.POLITICAL_EVENT:
                frogEmoji = '🐸🏛️';
                break;
            case this.eventTypes.TECH_BREAKTHROUGH:
                frogEmoji = '🐸💻';
                break;
            case this.eventTypes.REGULATORY_CHANGE:
                frogEmoji = '🐸📜';
                break;
        }

        notification.innerHTML = `
            <h3 style="margin: 0 0 10px 0; color: #00ff80;">
                ${frogEmoji} ${event.title} ${frogEmoji}
            </h3>
            <p style="margin: 0; font-size: 14px;">${event.description}</p>
            <div style="margin-top: 10px; font-size: 12px; color: rgba(255, 255, 255, 0.7);">
                Duration: ${event.duration / 60} minutes
            </div>
        `;

        document.body.appendChild(notification);

        // Remove notification after event duration
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s ease forwards';
            setTimeout(() => notification.remove(), 500);
        }, event.duration * 1000);
    }

    playEventEffects(event) {
        // Play visual effects
        if (event.visualEffect) {
            this.playVisualEffect(event.visualEffect);
        }

        // Play sound effects
        if (event.soundEffect) {
            this.playSoundEffect(event.soundEffect);
        }
    }

    playVisualEffect(effectType) {
        const effect = document.createElement('div');
        effect.className = `visual-effect ${effectType}`;
        
        // Add frog emoji to visual effects
        const frogEmoji = document.createElement('div');
        frogEmoji.className = 'frog-emoji';
        frogEmoji.textContent = '🐸';
        frogEmoji.style.cssText = `
            position: absolute;
            font-size: 24px;
            pointer-events: none;
            animation: frogBounce 1s ease infinite;
            opacity: 0.8;
        `;
        
        effect.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 999;
            animation: ${effectType} 1s ease forwards;
        `;
        
        effect.appendChild(frogEmoji);
        document.body.appendChild(effect);
        setTimeout(() => effect.remove(), 1000);
    }

    playSoundEffect(soundType) {
        this.soundManager.playSound(soundType);
    }

    setSoundVolume(volume) {
        this.soundManager.setVolume(volume);
    }

    toggleSoundMute() {
        return this.soundManager.toggleMute();
    }

    isSoundMuted() {
        return this.soundManager.isMuted();
    }

    update() {
        // Update active events
        this.activeEvents = this.activeEvents.filter(event => {
            if (Date.now() >= event.endTime) {
                this.eventHistory.push(event);
                return false;
            }
            return true;
        });
    }

    getActiveEvents() {
        return this.activeEvents;
    }

    getEventHistory() {
        return this.eventHistory;
    }

    triggerRandomEvent() {
        const eventTypes = Object.values(this.eventTypes);
        const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        this.startEvent(randomType);
    }
}

export default MarketEvents;