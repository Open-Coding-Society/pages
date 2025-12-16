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
    
    // Make footer a flex container for full width and prevent button cutoff
    footer.style.display = "flex";
    footer.style.justifyContent = "space-between";
    footer.style.alignItems = "center";
    footer.style.flexWrap = "wrap";
    footer.style.width = "100vw";
    footer.style.maxWidth = "100vw";
    footer.style.boxSizing = "border-box";
    footer.style.overflowX = "auto";

    // Create Previous Level button (far left)
    const prevButton = document.createElement("button");
    prevButton.id = "prevLevelButton";
    prevButton.innerText = "Previous Level ↩";
    prevButton.className = "medium filledHighlight primary";
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
    prevButton.style.cssText = `
        background-color: #f26767ff;
        font-weight: bold;
        font-size: 12px;
        font: 'Press Start 2P', monospace;
    `;

    // Create Next Level button (far right)
    const nextButton = document.createElement("button");
    nextButton.id = "nextLevelButton";
    nextButton.innerText = "Next Level ↪";
    nextButton.className = "medium filledHighlight primary";
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
    nextButton.style.cssText = `
        background-color: #6ae378ff;
        font-weight: bold;
        font-size: 12px;
        font: 'Press Start 2P', monospace;
    `;

    // Create a center container for Home and Cheats Menu
    const centerContainer = document.createElement("div");
    centerContainer.style.display = "flex";
    centerContainer.style.justifyContent = "center";
    centerContainer.style.alignItems = "center";
    centerContainer.style.gap = "10px";
    centerContainer.style.flex = "0 1 auto";

    // Create Cheats Menu button (left of Home)
    const cheatsButton = document.createElement("button");
    cheatsButton.id = "cheatsMenuButton";
    cheatsButton.innerText = "Cheats Menu";
    cheatsButton.className = "medium filledHighlight primary";
    cheatsButton.onclick = function() {
        console.log("Cheats Menu button clicked");
        openCheatsMenu(gameInstance);
    };
    cheatsButton.style.cssText = `
        background-color: #a46ae3ff;
        font-weight: bold;
        font-size: 12px;
        font: 'Press Start 2P', monospace;
    `;
    

    // Create Home button (center)
   const homeButton = document.createElement("button");
    homeButton.id = "homeButton";
    homeButton.innerText = "🏠";
    // Remove class-based styling so it's just the emoji; apply minimal styles to remove border/background
    homeButton.className = "";
    homeButton.setAttribute("aria-label", "Home");
    homeButton.title = "Home";
    homeButton.style.cssText = `
        background: transparent;
        border: none;
        padding: 0;
        margin: 0;
        font-size: 40px;
        line-height: 1;
        cursor: pointer;
        box-shadow: none;
        outline: none;
        -webkit-appearance: none;
    `;
    // Optional: prevent focus outline on click (keep keyboard accessibility if desired)
    homeButton.onfocus = () => homeButton.style.outline = "none";

    homeButton.onclick = function() {
        console.log("Home button clicked");
        console.log("Returning to home...");
        window.location.href = "/gamify/mansionGame";
    };

    // Create Info button (right of Home)
    const infoButton = document.createElement("button");
    infoButton.id = "infoButton";
    infoButton.innerText = "Info";
    infoButton.className = "medium filledHighlight primary";
    infoButton.onclick = function() {
        console.log("Info button clicked");
        openInfoMenu();
    };
     infoButton.style.cssText = `
        background-color: #e67e22;
        font-weight: bold;
        font-size: 12px;
        font: 'Press Start 2P', monospace;
    `;

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
        modal.style.cssText = `
            display: flex;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            justify-content: center;
            align-items: center;
            z-index: 10000;
            backdrop-filter: blur(5px);
        `;

        // Create modal content
        const modalContent = document.createElement("div");
        modalContent.style.cssText = `
            background: linear-gradient(145deg, #34495e, #2c3e50);
            border: 4px solid #e67e22;
            border-radius: 15px;
            padding: 30px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 0 30px rgba(230, 126, 34, 0.5);
            font-family: 'Press Start 2P', monospace;
            color: #ecf0f1;
        `;

        // Modal title
        const title = document.createElement("h2");
        title.innerText = "ℹ️ GAME INFO ℹ️";
        title.style.cssText = `
            text-align: center;
            color: #e67e22;
            margin-bottom: 25px;
            font-size: 18px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        `;

        // Info container
        const infoContainer = document.createElement("div");
        infoContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 15px;
        `;

        // Placeholder info values
        const infoSection = document.createElement("div");
        infoSection.style.cssText = `
            background: rgba(0, 0, 0, 0.3);
            padding: 15px;
            border-radius: 10px;
            border: 2px solid #e67e22;
            text-align: left;
            color: #e67e22;
            font-size: 12px;
        `;
        infoSection.innerHTML = `
            <strong>Game Title:</strong> Mansion Adventure<br>
            <strong>Version:</strong> 1.0.0<br>
            <strong>Developer:</strong> DNHS CSSE Per. 1<br>
            <strong>Description:</strong> Find all the keys to escape the haunted mansion!<br>
            <strong>Controls:</strong> WASD keys to move.<br>
            <strong>More info coming soon...</strong>
        `;

        // Close button
        const closeButton = document.createElement("button");
        closeButton.innerText = "✖ Close";
        closeButton.style.cssText = `
            margin-top: 20px;
            padding: 12px 20px;
            background: linear-gradient(145deg, #e67e22, #d35400);
            color: white;
            border: 2px solid #ecf0f1;
            border-radius: 8px;
            cursor: pointer;
            font-size: 12px;
            font-family: 'Press Start 2P', monospace;
            width: 100%;
            transition: all 0.3s ease;
        `;
        closeButton.onmouseover = () => {
            closeButton.style.transform = "scale(1.05)";
        };
        closeButton.onmouseout = () => {
            closeButton.style.transform = "scale(1)";
        };
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

    // Add Cheats Menu, Home, and Info to center container
    centerContainer.appendChild(cheatsButton);
    centerContainer.appendChild(homeButton);
    centerContainer.appendChild(infoButton);

    // Clear footer before adding new layout
    footer.innerHTML = "";
    // Add buttons to footer in correct positions
    footer.appendChild(prevButton); // far left
    footer.appendChild(centerContainer); // center
    footer.appendChild(nextButton); // far right
    console.log("Level navigation and cheats buttons added to footer");
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
    modal.style.cssText = `
        display: flex;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        justify-content: center;
        align-items: center;
        z-index: 10000;
        backdrop-filter: blur(5px);
    `;
    
    // Create modal content
    const modalContent = document.createElement("div");
    modalContent.style.cssText = `
        background: linear-gradient(145deg, #2c3e50, #34495e);
        border: 4px solid #a46ae3ff;
        border-radius: 15px;
        padding: 30px;
        max-width: 600px;
        max-height: 80vh;
        width: 90%;
        overflow-y: auto;
        box-shadow: 0 0 30px rgba(164, 106, 227, 0.5);
        font-family: 'Press Start 2P', monospace;
        color: #ecf0f1;
    `;
    
    // Modal title
    const title = document.createElement("h2");
    title.innerText = "🎮 CHEATS MENU 🎮";
    title.style.cssText = `
        text-align: center;
        color: #a46ae3ff;
        margin-bottom: 25px;
        font-size: 18px;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    `;
    
    // Cheats container
    const cheatsContainer = document.createElement("div");
    cheatsContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 15px;
    `;
    
    // Level Select Section
    const levelSelectSection = document.createElement("div");
    levelSelectSection.style.cssText = `
        background: rgba(0, 0, 0, 0.3);
        padding: 20px;
        border-radius: 10px;
        border: 2px solid #a46ae3ff;
    `;
    
    const levelTitle = document.createElement("h3");
    levelTitle.innerText = "🚪 LEVEL SELECT 🚪";
    levelTitle.style.cssText = `
        text-align: center;
        color: #a46ae3ff;
        margin-bottom: 15px;
        font-size: 14px;
    `;
    levelSelectSection.appendChild(levelTitle);
    
    // Define your levels based on the file list
    const levels = [
        { name: "Main Menu", id: "mansionLevelMain" },
        { name: "Level 1: Pantry", id: "mansionLevel1_Pantry" },
        { name: "Level 1", id: "mansionLevel1" },
        { name: "Level 2", id: "mansionLevel2" },
        { name: "Level 3", id: "mansionLevel3" },
        { name: "Level 4: Casino", id: "mansionLevel4" },
        { name: "Level 5", id: "mansionLevel5" },
        { name: "Level 6: Battle Room", id: "mansionLevel6_BattleRoom" },
        { name: "Level 6", id: "mansionLevel6" }
    ];
    
    // Create level buttons grid
    const levelGrid = document.createElement("div");
    levelGrid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
        margin-top: 15px;
    `;
    
    levels.forEach((level, index) => {
        const levelButton = document.createElement("button");
        levelButton.innerText = level.name;
        levelButton.title = `Jump to ${level.name}`;
        levelButton.style.cssText = `
            padding: 15px 10px;
            background: linear-gradient(145deg, #3498db, #2980b9);
            color: white;
            border: 2px solid #ecf0f1;
            border-radius: 8px;
            cursor: pointer;
            font-size: 10px;
            font-family: 'Press Start 2P', monospace;
            transition: all 0.3s ease;
            font-weight: bold;
            text-align: center;
            line-height: 1.3;
        `;
        
        levelButton.onmouseover = () => {
            levelButton.style.transform = "scale(1.05)";
            levelButton.style.background = "linear-gradient(145deg, #2ecc71, #27ae60)";
        };
        levelButton.onmouseout = () => {
            levelButton.style.transform = "scale(1)";
            levelButton.style.background = "linear-gradient(145deg, #3498db, #2980b9)";
        };
        
        levelButton.onclick = () => {
            console.log(`Jumping to ${level.name} (${level.id})`);
            
            // Close the cheats menu
            const cheatsOverlay = document.getElementById("cheatsMenuOverlay");
            if (cheatsOverlay) {
                cheatsOverlay.remove();
            }
            
            // For mansion game, we need to dynamically import and load the level
            const levelMap = {
                "mansionLevelMain": () => import('../mansionLevelMain.js'),
                "mansionLevel1_Pantry": () => import('../mansionLevel1_Pantry.js'),
                "mansionLevel1": () => import('../mansionLevel1.js'),
                "mansionLevel2": () => import('../mansionLevel2.js'),
                "mansionLevel3": () => import('../mansionLevel3.js'),
                "mansionLevel4": () => import('../mansionLevel4.js'),
                "mansionLevel5": () => import('../mansionLevel5.js'),
                "mansionLevel6_BattleRoom": () => import('../mansionLevel6_BattleRoom.js'),
                "mansionLevel6": () => import('../mansionLevel6.js')
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
    placeholderSection.style.cssText = `
        background: rgba(0, 0, 0, 0.3);
        padding: 15px;
        border-radius: 10px;
        border: 2px solid #95a5a6;
        text-align: center;
    `;
    
    
    // Close button
    const closeButton = document.createElement("button");
    closeButton.innerText = "✖ Close";
    closeButton.style.cssText = `
        margin-top: 20px;
        padding: 12px 20px;
        background: linear-gradient(145deg, #e74c3c, #c0392b);
        color: white;
        border: 2px solid #ecf0f1;
        border-radius: 8px;
        cursor: pointer;
        font-size: 12px;
        font-family: 'Press Start 2P', monospace;
        width: 100%;
        transition: all 0.3s ease;
    `;
    closeButton.onmouseover = () => {
        closeButton.style.transform = "scale(1.05)";
    };
    closeButton.onmouseout = () => {
        closeButton.style.transform = "scale(1)";
    };
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
