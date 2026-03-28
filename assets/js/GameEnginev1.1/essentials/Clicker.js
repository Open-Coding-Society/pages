// Clicker.js - A Clicker GameObject for GameEnginev1.1
import Npc from "./Npc.js";

class Clicker extends Npc {
    constructor(data = {}, gameEnv = null) {
        // Set up default Clicker properties, allow overrides via data
        const defaultData = {
            id: "Knowledge Clicker",
            greeting: "Click me or collide to earn knowledge points!",
            src: data?.src || "", // Optional sprite/image
            SCALE_FACTOR: 8,
            INIT_POSITION: { x: 0, y: 0 },
            visible: true,
            hitbox: { widthPercentage: 0.2, heightPercentage: 0.2 },
            state: {
                clicks: 0,
                points: 0
            },
            controls: [
                {
                    id: 'toggle-leaderboard',
                    label: 'Leaderboard',
                    onClick: function(self) {
                        if (window.toggleLeaderboard) window.toggleLeaderboard();
                    }
                },
                {
                    id: 'toggle-ai',
                    label: 'Ask AI',
                    onClick: function(self) {
                        if (window.toggleAI) window.toggleAI();
                    }
                }
            ],
            ...data
        };
        super(defaultData, gameEnv);
        this.state = this.state || { clicks: 0, points: 0 };
        this.bindClickHandler();
    }

    bindClickHandler() {
        // Attach to DOM element with id matching this.id (or a custom selector)
        setTimeout(() => {
            const box = document.getElementById(this.id.replace(/\s+/g, '-').toLowerCase()) || document.getElementById('clicker-box');
            if (box) {
                box.addEventListener("click", this.handleClick.bind(this));
                box.addEventListener("touchstart", this.handleClick.bind(this));
            }
        }, 500);
    }

    handleClick(event) {
        this.incrementPoints();
    }

    // Called by engine on collision
    onCollision(player) {
        this.incrementPoints();
    }

    incrementPoints() {
        this.state.clicks += 1;
        this.state.points += 1;
        if (typeof this.react === 'function') this.react('click');
    }

    // Called to update UI or trigger effects
    react(type) {
        if (type === 'click') {
            const pointsEl = document.getElementById('clicker-points');
            if (pointsEl) pointsEl.textContent = this.state.points;
        }
    }
}

export default Clicker;
