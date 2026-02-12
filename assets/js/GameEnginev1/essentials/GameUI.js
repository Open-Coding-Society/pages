/**
 * GameUI - Handles game user interface elements
 * Provides navigation controls, level selection, and info modals
 */
export default class GameUI {
    constructor(game, config = {}) {
        this.game = game;
        this.gameControl = game.gameControl;
        this.config = {
            showNavigation: config.showNavigation !== false,
            showLevelSelect: config.showLevelSelect !== false,
            showInfo: config.showInfo !== false,
            homeUrl: config.homeUrl || '/',
            gameInfo: config.gameInfo || {},
            ...config
        };
        this.controlsContainer = null;
    }

    /**
     * Initialize all UI elements
     */
    init() {
        if (this.config.showNavigation) {
            this.addNavigationControls();
        }
    }

    /**
     * Adds navigation buttons to the footer
     * Styled by game-engine.scss
     */
    addNavigationControls() {
        const footer = document.getElementById("masterFooter");
        
        if (!footer) {
            console.warn("Footer element 'masterFooter' not found");
            return;
        }
        
        // Check if buttons already exist to avoid duplicates
        if (document.getElementById("homeButton")) {
            console.log("Navigation controls already exist");
            return;
        }
        
        // Remove any existing <p> elements from footer
        const paragraphs = footer.querySelectorAll("p");
        paragraphs.forEach(p => p.remove());
        
        // Create Previous Level button
        const prevButton = this.createButton("prevLevelButton", "Previous Level ↩", () => {
            this.navigateLevel(-1);
        });

        // Create Next Level button
        const nextButton = this.createButton("nextLevelButton", "Next Level ↪", () => {
            this.navigateLevel(1);
        });

        // Create center container
        const centerContainer = document.createElement("div");
        centerContainer.className = "game-footer-center";

        // Create Home button
        const homeButton = this.createButton("homeButton", "🏠", () => {
            window.location.href = this.config.homeUrl;
        });
        homeButton.setAttribute("aria-label", "Home");
        homeButton.title = "Home";

        // Create Info button (if enabled)
        let infoButton = null;
        if (this.config.showInfo) {
            infoButton = this.createButton("infoButton", "Info", () => {
                this.openInfoModal();
            });
        }

        // Create Cheats Menu button (if level select enabled)
        let cheatsButton = null;
        if (this.config.showLevelSelect) {
            cheatsButton = this.createButton("cheatsMenuButton", "Cheats Menu", () => {
                this.openCheatsModal();
            });
        }

        // Containers around the Home button
        const leftOfHome = document.createElement("div");
        leftOfHome.className = "game-controls-left";
        leftOfHome.id = "game-controls-container";

        const rightOfHome = document.createElement("div");
        rightOfHome.className = "game-controls-right";

        // Add controls around Home
        centerContainer.appendChild(leftOfHome);
        centerContainer.appendChild(homeButton);
        centerContainer.appendChild(rightOfHome);

        // Create left and right containers for spacing
        const leftContainer = document.createElement("div");
        leftContainer.className = "game-footer-left";

        const rightContainer = document.createElement("div");
        rightContainer.className = "game-footer-right";

        // Clear footer before adding new layout
        footer.innerHTML = "";
        
        // Add buttons to footer
        leftContainer.appendChild(prevButton);
        footer.appendChild(leftContainer);
        footer.appendChild(centerContainer);
        rightContainer.appendChild(nextButton);
        footer.appendChild(rightContainer);
        
        // Add Info and Cheats to the right of Home
        if (infoButton) rightOfHome.appendChild(infoButton);
        if (cheatsButton) rightOfHome.appendChild(cheatsButton);
        
        console.log("Game navigation controls initialized");
        
        // Store reference for external use (e.g., adding custom buttons)
        this.controlsContainer = leftOfHome;
        return leftOfHome;
    }

    /**
     * Create a button element
     */
    createButton(id, text, onClick) {
        const button = document.createElement("button");
        button.id = id;
        button.innerText = text;
        button.onclick = onClick;
        return button;
    }

    /**
     * Navigate to a different level
     * @param {number} direction - -1 for previous, 1 for next
     */
    navigateLevel(direction) {
        const currentIndex = this.gameControl.currentLevelIndex;
        const totalLevels = this.gameControl.levelClasses.length;
        const newIndex = currentIndex + direction;

        if (newIndex < 0) {
            console.warn("Already at the first level");
            return;
        }
        if (newIndex >= totalLevels) {
            console.warn("Already at the last level");
            return;
        }

        console.log(`Navigating to level ${newIndex + 1}`);
        this.gameControl.currentLevelIndex = newIndex;
        this.gameControl.transitionToLevel();
    }

    /**
     * Get level metadata including friendly names
     */
    getLevelMetadata() {
        return this.gameControl.levelClasses.map((LevelClass, index) => {
            const friendlyName = LevelClass.friendlyName || 
                                LevelClass.name || 
                                `Level ${index + 1}`;
            return {
                name: friendlyName,
                className: LevelClass.name,
                index: index,
                levelClass: LevelClass
            };
        });
    }

    /**
     * Opens the cheats/level selection modal
     */
    openCheatsModal() {
        // Check if modal already exists
        if (document.getElementById("cheatsModal")) {
            document.getElementById("cheatsModal").style.display = "flex";
            return;
        }
        
        // Create modal overlay
        const modal = document.createElement("div");
        modal.id = "cheatsModal";
        modal.style.display = "flex";
        
        // Create modal content
        const modalContent = document.createElement("div");
        
        // Modal title
        const title = document.createElement("h2");
        title.className = "game-modal-title";
        title.innerText = "🎮 CHEATS MENU 🎮";
        
        // Cheats container
        const cheatsContainer = document.createElement("div");
        cheatsContainer.className = "game-modal-container";
        
        // Level Select Section
        const levelSelectSection = document.createElement("div");
        levelSelectSection.className = "game-level-select-section";
        
        const levelTitle = document.createElement("h3");
        levelTitle.className = "game-section-title";
        levelTitle.innerText = "🚪 LEVEL SELECT 🚪";
        levelSelectSection.appendChild(levelTitle);
        
        // Get levels from game control
        const levels = this.getLevelMetadata();
        
        // Create level buttons grid
        const levelGrid = document.createElement("div");
        levelGrid.className = "game-level-grid";
        
        levels.forEach((level) => {
            const levelButton = document.createElement("button");
            levelButton.className = "game-level-button";
            levelButton.innerText = level.name;
            levelButton.title = `Jump to ${level.name}`;
            
            levelButton.onclick = () => {
                console.log(`Jumping to ${level.name}`);
                this.gameControl.currentLevelIndex = level.index;
                this.gameControl.transitionToLevel();
                modal.style.display = "none";
            };
            
            levelGrid.appendChild(levelButton);
        });
        
        levelSelectSection.appendChild(levelGrid);
        cheatsContainer.appendChild(levelSelectSection);
        
        // Close button
        const closeButton = document.createElement("button");
        closeButton.className = "game-modal-close";
        closeButton.innerText = "✖ Close";
        closeButton.onclick = () => {
            modal.style.display = "none";
        };
        
        // Assemble modal
        modalContent.appendChild(title);
        modalContent.appendChild(cheatsContainer);
        modalContent.appendChild(closeButton);
        modal.appendChild(modalContent);
        
        // Add modal to document
        document.body.appendChild(modal);
        
        // Close modal when clicking outside
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.style.display = "none";
            }
        };
        
        console.log("Cheats menu opened");
    }

    /**
     * Opens the info modal
     */
    openInfoModal() {
        // Check if modal already exists
        if (document.getElementById("infoModal")) {
            document.getElementById("infoModal").style.display = "flex";
            return;
        }

        // Create modal overlay
        const modal = document.createElement("div");
        modal.id = "infoModal";
        modal.style.display = "flex";

        // Create modal content
        const modalContent = document.createElement("div");

        // Modal title
        const title = document.createElement("h2");
        title.className = "game-modal-title";
        title.innerText = "ℹ️ GAME INFO ℹ️";

        // Info container
        const infoContainer = document.createElement("div");
        infoContainer.className = "game-modal-container";

        // Info section
        const infoSection = document.createElement("div");
        infoSection.className = "game-info-section";
        
        const gameInfo = this.config.gameInfo;
        infoSection.innerHTML = `
            <strong>Game Title:</strong> ${gameInfo.title || 'Game'}<br>
            <strong>Version:</strong> ${gameInfo.version || '1.0'}<br>
            <strong>Developer:</strong> ${gameInfo.developer || 'Game Developer'}<br>
            <strong>Controls:</strong> ${gameInfo.controls || 'Use arrow keys or WASD to move.'}<br>
        `;

        // Close button
        const closeButton = document.createElement("button");
        closeButton.className = "game-modal-close";
        closeButton.innerText = "✖ Close";
        closeButton.onclick = () => {
            modal.style.display = "none";
        };

        // Assemble modal
        infoContainer.appendChild(infoSection);
        modalContent.appendChild(title);
        modalContent.appendChild(infoContainer);
        modalContent.appendChild(closeButton);
        modal.appendChild(modalContent);
        
        // Add modal to document
        document.body.appendChild(modal);
        
        // Close modal when clicking outside
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.style.display = "none";
            }
        };
        
        console.log("Info menu opened");
    }

    /**
     * Get the controls container for adding custom buttons
     */
    getControlsContainer() {
        return this.controlsContainer;
    }
}
