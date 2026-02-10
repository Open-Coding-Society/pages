/**
 * TouchControls - Virtual D-pad for mobile WASD simulation
 * Creates on-screen buttons that simulate keyboard WASD input
 */
class TouchControls {
    /**
     * @param {object} gameEnv - Game environment
     * @param {object} options - { keyMap, interactLabel, position, id }
     *   keyMap: {up, left, down, right, interact} (keyCodes)
     *   interactLabel: string (e.g. 'e' or 'u')
     *   position: 'left' | 'right' (default: 'left')
     *   id: string (for unique DOM id)
     */
    constructor(gameEnv, options = {}) {
        this.gameEnv = gameEnv;
        this.isVisible = false;
        this.controlsContainer = null;
        this.activeButtons = new Set();
        this.buttonMap = options.mapping;
        this.interactLabel = options.interactLabel;
        this.position = options.position;
        this.domId = options.id || 'touch-controls';
        this.init();
        this.detectMobile();
    }

    /**
     * Detect if device supports touch and show/hide controls accordingly
     */
    detectMobile() {
        const hasTouchscreen = ('ontouchstart' in window) || 
                              (navigator.maxTouchPoints > 0) || 
                              (navigator.msMaxTouchPoints > 0);
        
        // Also check for mobile user agents as backup
        const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Show controls if device has touch capabilities OR is mobile
        if (hasTouchscreen || isMobileUserAgent) {
            this.show();
        } else {
            this.hide();
        }
    }

    /**
     * Initialize the touch controls UI
     */
    init() {
        // Create controls container
        this.controlsContainer = document.createElement('div');
        this.controlsContainer.id = this.domId;
        // Position left or right
        let sideStyle = this.position === 'right' ? 'right: 20px; left: auto;' : 'left: 20px; right: auto;';
        this.controlsContainer.innerHTML = `
            <style>
                #${this.domId} {
                    position: fixed;
                    bottom: 20px;
                    ${sideStyle}
                    z-index: 1000;
                    display: none;
                    user-select: none;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                }
                .dpad-container {
                    position: relative;
                    width: 150px;
                    height: 150px;
                }
                .dpad-button {
                    position: absolute;
                    width: 45px;
                    height: 45px;
                    background: rgba(255, 255, 255, 0.8);
                    border: 2px solid rgba(0, 0, 0, 0.3);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    font-weight: bold;
                    color: #333;
                    cursor: pointer;
                    transition: all 0.1s ease;
                    touch-action: none;
                }
                .interact-button {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 45px;
                    height: 45px;
                    background: rgba(100, 255, 100, 0.8);
                    border: 2px solid rgba(0, 100, 0, 0.5);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    font-weight: bold;
                    color: #004d00;
                    cursor: pointer;
                    transition: all 0.1s ease;
                    touch-action: none;
                }
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(100, 255, 100, 0.7); }
                    70% { box-shadow: 0 0 0 10px rgba(100, 255, 100, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(100, 255, 100, 0); }
                }
                .interact-button.pulse {
                    animation: pulse 2s infinite;
                }
                .dpad-button:active, .dpad-button.pressed {
                    background: rgba(100, 150, 255, 0.9);
                    color: white;
                    transform: scale(0.95);
                }
                .interact-button:active, .interact-button.pressed {
                    background: rgba(50, 200, 50, 0.9);
                    color: white;
                    transform: scale(0.95);
                }
                .dpad-up {
                    top: 0;
                    left: 52px;
                }
                .dpad-left {
                    top: 52px;
                    left: 0;
                }
                .dpad-right {
                    top: 52px;
                    right: 0;
                }
                .dpad-down {
                    bottom: 0;
                    left: 52px;
                }
                @media (max-width: 480px) {
                    .dpad-container {
                        width: 120px;
                        height: 120px;
                    }
                    .dpad-button {
                        width: 36px;
                        height: 36px;
                        font-size: 14px;
                    }
                    .interact-button {
                        width: 45px;
                        height: 45px;
                        font-size: 14px;
                    }
                    .dpad-up, .dpad-down {
                        left: 42px;
                    }
                    .dpad-left, .dpad-right {
                        top: 42px;
                    }
                }
            </style>
            <div class="dpad-container">
                <div class="dpad-button dpad-up" data-direction="up">↑</div>
                <div class="dpad-button dpad-left" data-direction="left">←</div>
                <div class="dpad-button dpad-right" data-direction="right">→</div>
                <div class="dpad-button dpad-down" data-direction="down">↓</div>
                <div class="interact-button" data-direction="interact">${this.interactLabel}</div>
            </div>
        `;

        // Add to DOM
        document.body.appendChild(this.controlsContainer);
        
        // Bind events
        this.bindEvents();
    }

    /**
     * Bind touch events to the virtual buttons
     */
    bindEvents() {
        const buttons = this.controlsContainer.querySelectorAll('[data-direction]');
        
        buttons.forEach(button => {
            const direction = button.dataset.direction;
            
            // Touch events
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handleButtonPress(direction, true);
            });
            
            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.handleButtonPress(direction, false);
            });
            
            button.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                this.handleButtonPress(direction, false);
            });
            
            // Mouse events for desktop testing
            button.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.handleButtonPress(direction, true);
            });
            
            button.addEventListener('mouseup', (e) => {
                e.preventDefault();
                this.handleButtonPress(direction, false);
            });
            
            button.addEventListener('mouseleave', (e) => {
                this.handleButtonPress(direction, false);
            });
        });
    }

    /**
     * Handle virtual button press/release
     * @param {string} direction - The direction button pressed
     * @param {boolean} isPressed - Whether button is pressed or released
     */
    handleButtonPress(direction, isPressed) {
        const keyCode = this.buttonMap[direction];
        const button = this.controlsContainer.querySelector(`[data-direction="${direction}"]`);
        
        if (isPressed) {
            this.activeButtons.add(direction);
            button.classList.add('pressed');
            
            // Simulate keydown event
            this.dispatchKeyEvent('keydown', keyCode);
        } else {
            this.activeButtons.delete(direction);
            button.classList.remove('pressed');
            
            // Simulate keyup event
            this.dispatchKeyEvent('keyup', keyCode);
        }
    }

    /**
     * Dispatch synthetic keyboard events
     * @param {string} type - Event type ('keydown' or 'keyup')
     * @param {number} keyCode - The key code to simulate
     */
    dispatchKeyEvent(type, keyCode) {
        // Map keyCode to key string for WASD/E or IJKL/U
        let key = undefined;
        switch (keyCode) {
            case 87: key = 'w'; break;
            case 65: key = 'a'; break;
            case 83: key = 's'; break;
            case 68: key = 'd'; break;
            case 69: key = 'e'; break;
            case 73: key = 'i'; break;
            case 74: key = 'j'; break;
            case 75: key = 'k'; break;
            case 76: key = 'l'; break;
            case 85: key = 'u'; break;
            default: key = undefined;
        }
        // Special handling: if this is the interact button, set key to match interactLabel if possible
        if (this.buttonMap && this.buttonMap.interact === keyCode && this.interactLabel) {
            key = this.interactLabel;
        }
        const event = new KeyboardEvent(type, {
            keyCode: keyCode,
            which: keyCode,
            key: key,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(event);
    }

    /**
     * Visually highlight the interact button (when near an NPC)
     */
    showInteractButton() {
        const interactButton = this.controlsContainer?.querySelector('.interact-button');
        if (interactButton) {
            interactButton.classList.add('pulse');
        }
    }

    /**
     * Remove highlight from the interact button (when not near an NPC)
     */
    hideInteractButton() {
        const interactButton = this.controlsContainer?.querySelector('.interact-button');
        if (interactButton) {
            interactButton.classList.remove('pulse');
        }
    }

    /**
     * Check if interact button is currently highlighted
     */
    isInteractButtonVisible() {
        const interactButton = this.controlsContainer?.querySelector('.interact-button');
        return interactButton?.classList.contains('pulse') || false;
    }

    /**
     * Show the touch controls
     */
    show() {
        if (this.controlsContainer) {
            this.controlsContainer.style.display = 'block';
            this.isVisible = true;
        }
    }

    /**
     * Hide the touch controls
     */
    hide() {
        if (this.controlsContainer) {
            this.controlsContainer.style.display = 'none';
            this.isVisible = false;
        }
    }

    /**
     * Toggle visibility of touch controls
     */
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    /**
     * Clean up the touch controls
     */
    destroy() {
        if (this.controlsContainer && this.controlsContainer.parentNode) {
            this.controlsContainer.parentNode.removeChild(this.controlsContainer);
        }
    }
}

export default TouchControls;