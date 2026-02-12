/**
 * Adds Previous/Next level navigation buttons to the footer
 * @param {Game} gameInstance - The game instance to control
 */
export function addLevelNavigationButtons(gameInstance) {
    const footer = document.getElementById("masterFooter");
    
    if (!footer) {
        console.warn("Footer element 'masterFooter' not found");
        return;
    }
    
    // Check if buttons already exist to avoid duplicates
    if (document.getElementById("homeButton") || document.getElementById("nextLevelButton") || document.getElementById("prevLevelButton")) {
        console.log("Level navigation buttons already exist");
        return;
    }
    
    // Remove any existing <p> elements from footer
    const paragraphs = footer.querySelectorAll("p");
    paragraphs.forEach(p => p.remove());
    
    // Footer styling is now handled by game-engine.scss (#masterFooter)

    // Create Previous Level button (far left)
    const prevButton = document.createElement("button");
    prevButton.id = "prevLevelButton";
    prevButton.innerText = "Previous Level ↩";
    // Styling handled by game-engine.scss (#prevLevelButton)
    prevButton.onclick = function() {
        console.log("Previous Level button clicked");
        console.log("Transitioning to the previous level...");
        if (gameInstance && gameInstance.gameControl) {
            const currentIndex = gameInstance.gameControl.currentLevelIndex;
            if (currentIndex > 0) {
                gameInstance.gameControl.currentLevelIndex = currentIndex - 1;
                gameInstance.gameControl.transitionToLevel();
            } else {
                console.warn("Already at the first level");
            }
        } else {
            console.error("gameInstance.gameControl not found");
        }
    };

    // Create Next Level button (far right)
    const nextButton = document.createElement("button");
    nextButton.id = "nextLevelButton";
    nextButton.innerText = "Next Level ↪";
    // Styling handled by game-engine.scss (#nextLevelButton)
    nextButton.onclick = function() {
        console.log("Next Level button clicked");
        console.log("Transitioning to the next level...");
        if (gameInstance && gameInstance.gameControl) {
            const currentIndex = gameInstance.gameControl.currentLevelIndex;
            const totalLevels = gameInstance.gameControl.levelClasses.length;
            if (currentIndex < totalLevels - 1) {
                gameInstance.gameControl.currentLevelIndex = currentIndex + 1;
                gameInstance.gameControl.transitionToLevel();
            } else {
                console.warn("Already at the last level");
            }
        } else {
            console.error("gameInstance.gameControl not found");
        }
    };

    // Create a center container for Home and Cheats Menu
    const centerContainer = document.createElement("div");
    centerContainer.className = "game-footer-center";
    // Styling handled by game-engine.scss (.game-footer-center)

    // Create Cheats Menu button (left of Home)
    const cheatsButton = document.createElement("button");
    cheatsButton.id = "cheatsMenuButton";
    cheatsButton.innerText = "Cheats Menu";
    // Styling handled by game-engine.scss (#cheatsMenuButton)
    cheatsButton.onclick = function() {
        console.log("Cheats Menu button clicked");
        openCheatsMenu(gameInstance);
    };
    

    // Create Home button (center)
    const homeButton = document.createElement("button");
    homeButton.id = "homeButton";
    homeButton.innerText = "🏠";
    homeButton.setAttribute("aria-label", "Home");
    homeButton.title = "Home";
    // Styling handled by game-engine.scss (#homeButton)

    homeButton.onclick = function() {
        console.log("Home button clicked");
        console.log("Returning to home...");
        window.location.href = "/gamify/murdermystery";
    };

    // Create Info button (right of Home)
    const infoButton = document.createElement("button");
    infoButton.id = "infoButton";
    infoButton.innerText = "Info";
    // Styling handled by game-engine.scss (#infoButton)
    infoButton.onclick = function() {
        console.log("Info button clicked");
        openInfoMenu();
    };

    /**
     * Creates and opens the info menu popup
     */
    function openInfoMenu() {
        // Check if modal already exists
        if (document.getElementById("infoModal")) {
            document.getElementById("infoModal").style.display = "flex";
            return;
        }

        // Create modal overlay
        const modal = document.createElement("div");
        modal.id = "infoModal";
        modal.style.display = "flex"; // Initially visible
        // Styling handled by game-engine.scss (#infoModal)

        // Create modal content
        const modalContent = document.createElement("div");
        // Styling handled by game-engine.scss (#infoModal > div)

        // Modal title
        const title = document.createElement("h2");
        title.className = "game-modal-title";
        title.innerText = "ℹ️ GAME INFO ℹ️";
        // Styling handled by game-engine.scss (#infoModal .game-modal-title)

        // Info container
        const infoContainer = document.createElement("div");
        infoContainer.className = "game-modal-container";
        // Styling handled by game-engine.scss (.game-modal-container)

        // Placeholder info values
        const infoSection = document.createElement("div");
        infoSection.className = "game-info-section";
        // Styling handled by game-engine.scss (.game-info-section)
        infoSection.innerHTML = `
            <strong>Game Title:</strong> Murder Mystery<br>
            <strong>Version:</strong> 1.0<br>
            <strong>Developer:</strong> DNHS CSSE Feb 2026<br>
            <strong>Controls:</strong> WASD keys to move.<br>
        `;

        // Close button
        const closeButton = document.createElement("button");
        closeButton.className = "game-modal-close";
        closeButton.innerText = "✖ Close";
        // Styling handled by game-engine.scss (.game-modal-close)
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

    // Containers around the Home button
    const leftOfHome = document.createElement("div");
    leftOfHome.className = "game-controls-left";
    leftOfHome.id = "mansion-game-controls-container";
    // Styling handled by game-engine.scss (.game-controls-left, #mansion-game-controls-container)

    const rightOfHome = document.createElement("div");
    rightOfHome.className = "game-controls-right";
    // Styling handled by game-engine.scss (.game-controls-right)

    // Add controls around Home (Home centered in the group)
    centerContainer.appendChild(leftOfHome);
    centerContainer.appendChild(homeButton);
    centerContainer.appendChild(rightOfHome);

    // Create left and right containers for spacing
    const leftContainer = document.createElement("div");
    leftContainer.className = "game-footer-left";
    // Styling handled by game-engine.scss (.game-footer-left)

    const rightContainer = document.createElement("div");
    rightContainer.className = "game-footer-right";
    // Styling handled by game-engine.scss (.game-footer-right)

    // Clear footer before adding new layout
    footer.innerHTML = "";
    // Add buttons to footer in correct positions
    leftContainer.appendChild(prevButton);
    footer.appendChild(leftContainer); // far left (Prev)
    footer.appendChild(centerContainer); // center (Settings, Home, Info/Cheats)
    rightContainer.appendChild(nextButton);
    footer.appendChild(rightContainer); // far right (Next)
    
    // Add Info and Cheats to the right of Home
    rightOfHome.appendChild(infoButton);
    rightOfHome.appendChild(cheatsButton);
    
    console.log("Level navigation and cheats buttons added to footer");
    
    // Return the left-of-home container so Game.js can add Settings/Leaderboard buttons
    return leftOfHome;
}

/**
 * Creates and opens the cheats menu popup with level select
 * @param {Game} gameInstance - The game instance to control
 */
function openCheatsMenu(gameInstance) {
    // Check if modal already exists
    if (document.getElementById("cheatsModal")) {
        document.getElementById("cheatsModal").style.display = "flex";
        return;
    }
    
    // Create modal overlay
    const modal = document.createElement("div");
    modal.id = "cheatsModal";
    modal.style.display = "flex"; // Initially visible
    // Styling handled by game-engine.scss (#cheatsModal)
    
    // Create modal content
    const modalContent = document.createElement("div");
    // Styling handled by game-engine.scss (#cheatsModal > div)
    
    // Modal title
    const title = document.createElement("h2");
    title.className = "game-modal-title";
    title.innerText = "🎮 CHEATS MENU 🎮";
    // Styling handled by game-engine.scss (#cheatsModal .game-modal-title)
    
    // Cheats container
    const cheatsContainer = document.createElement("div");
    cheatsContainer.className = "game-modal-container";
    // Styling handled by game-engine.scss (.game-modal-container)
    
    // Level Select Section
    const levelSelectSection = document.createElement("div");
    levelSelectSection.className = "game-level-select-section";
    // Styling handled by game-engine.scss (.game-level-select-section)
    
    const levelTitle = document.createElement("h3");
    levelTitle.className = "game-section-title";
    levelTitle.innerText = "🚪 LEVEL SELECT 🚪";
    // Styling handled by game-engine.scss (.game-level-select-section .game-section-title)
    levelSelectSection.appendChild(levelTitle);
    
    // Define your levels based on the file list
    const levels = [
        { name: "Level 1", id: "MurderMysteryL1" },
        { name: "Level 3", id: "MurderMysteryL3" },
        { name: "Level 4", id: "MurderMysteryL4" },
    ];
    
    // Create level buttons grid
    const levelGrid = document.createElement("div");
    levelGrid.className = "game-level-grid";
    // Styling handled by game-engine.scss (.game-level-grid)
    
    levels.forEach((level, index) => {
        const levelButton = document.createElement("button");
        levelButton.className = "game-level-button";
        levelButton.innerText = level.name;
        levelButton.title = `Jump to ${level.name}`;
        // Styling handled by game-engine.scss (.game-level-button)
        
        levelButton.onclick = () => {
            console.log(`Jumping to ${level.name} (${level.id})`);
            
            // Close the cheats menu
            const cheatsOverlay = document.getElementById("cheatsMenuOverlay");
            if (cheatsOverlay) {
                cheatsOverlay.remove();
            }
            
            // For mansion game, we need to dynamically import and load the level
            const levelMap = {
                "MurderMysteryL1": () => import('./MurderMysteryL1.js'),
                "MurderMysteryL3": () => import('./MurderMysteryL3.js'),
                "MurderMysteryL4": () => import('./MurderMysteryL4.js'),
            };
            
            if (levelMap[level.id]) {
                levelMap[level.id]().then(module => {
                    const LevelClass = module.default;
                    if (gameInstance && gameInstance.gameControl) {
                        gameInstance.gameControl.levelClasses = [LevelClass];
                        gameInstance.gameControl.currentLevelIndex = 0;
                        gameInstance.gameControl.transitionToLevel();
                    } else {
                        console.error("gameInstance.gameControl not found");
                    }
                }).catch(err => {
                    console.error(`Failed to load level ${level.id}:`, err);
                    alert(`Error loading ${level.name}: ${err.message}`);
                });
            } else {
                console.warn(`Level ${level.id} not found in levelMap`);
            }
            
            modal.style.display = "none";
        };
        
        levelGrid.appendChild(levelButton);
    });
    
    levelSelectSection.appendChild(levelGrid);
    cheatsContainer.appendChild(levelSelectSection);
    
    // Additional cheats placeholder
    const placeholderSection = document.createElement("div");
    placeholderSection.className = "game-placeholder-section";
    // Styling handled by game-engine.scss (.game-placeholder-section)
    
    
    // Close button
    const closeButton = document.createElement("button");
    closeButton.className = "game-modal-close";
    closeButton.innerText = "✖ Close";
    // Styling handled by game-engine.scss (.game-modal-close)
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
    
    console.log("Cheats menu opened with level select");
}

/**
 * Initialize cheats after DOM is ready
 * @param {Game} gameInstance - The game instance to control
 */
export function initCheats(gameInstance) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => addLevelNavigationButtons(gameInstance));
    } else {
        // DOM already loaded
        addLevelNavigationButtons(gameInstance);
    }
}
