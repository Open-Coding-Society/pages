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
    prevButton.innerText = "Previous Level";
    prevButton.className = "medium filledHighlight primary";
    prevButton.onclick = function() {
        console.log("Previous Level button clicked");
        console.log("Transitioning to the previous level...");
        gameInstance.loadPreviousLevel();
    };

    // Create Next Level button (far right)
    const nextButton = document.createElement("button");
    nextButton.id = "nextLevelButton";
    nextButton.innerText = "Next Level";
    nextButton.className = "medium filledHighlight primary";
    nextButton.onclick = function() {
        console.log("Next Level button clicked");
        console.log("Transitioning to the next level...");
        gameInstance.loadNextLevel();
    };

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

    // Create Home button (center)
    const homeButton = document.createElement("button");
    homeButton.id = "homeButton";
    homeButton.innerText = "Home";
    homeButton.className = "medium filledHighlight primary";
    homeButton.onclick = function() {
        console.log("Home button clicked");
        console.log("Returning to home...");
        gameInstance.returnHome();
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
        <strong>Developer:</strong> Your Name Here<br>
        <strong>Description:</strong> Placeholder description for your game.<br>
        <strong>Controls:</strong> Arrow keys to move, Space to jump.<br>
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
 * Creates and opens the cheats menu popup
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
        border: 4px solid #3498db;
        border-radius: 15px;
        padding: 30px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 0 30px rgba(52, 152, 219, 0.5);
        font-family: 'Press Start 2P', monospace;
        color: #ecf0f1;
    `;
    
    // Modal title
    const title = document.createElement("h2");
    title.innerText = "🎮 CHEATS MENU 🎮";
    title.style.cssText = `
        text-align: center;
        color: #3498db;
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
    
    const placeholderSection = document.createElement("div");
    placeholderSection.style.cssText = `
        background: rgba(0, 0, 0, 0.3);
        padding: 15px;
        border-radius: 10px;
        border: 2px solid #95a5a6;
        text-align: center;
    `;
    placeholderSection.innerText = "More cheats coming soon...";
    placeholderSection.style.color = "#95a5a6";
    placeholderSection.style.fontSize = "10px";
    
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
    cheatsContainer.appendChild(placeholderSection);
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
