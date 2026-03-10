

class Inventory {
    constructor() {
        if (Inventory.instance) {
            return Inventory.instance;
        }
        Inventory.instance = this;
        
        this.items = [];
        this.maxSlots = 20;
        this.isOpen = false;
        this.injectStyles();
        this.initialize();
        this.addStartingItems();
        this.loadFromCookies();
    }

    injectStyles() {
        const style = document.createElement("style");
        style.textContent = `
            .inventory-container {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.8);
                padding: 20px;
                border-radius: 10px;
                border: 2px solid #ffd700;
                color: white;
                z-index: 1000;
                backdrop-filter: blur(5px);
                box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
                user-select: none;
                width: 400px;
            }

            .inventory-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 10px;
                border-bottom: 2px solid #ffd700;
                cursor: move;
                background: rgba(255, 215, 0, 0.1);
                margin: -20px -20px 20px -20px;
                padding: 12px 20px;
                border-radius: 10px 10px 0 0;
            }

            .inventory-header h2 {
                margin: 0;
                color: #ffd700;
                text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
                font-size: 18px;
                font-weight: bold;
            }

            .close-inventory {
                background: none;
                border: none;
                color: #ffd700;
                font-size: 20px;
                cursor: pointer;
                padding: 0 8px;
                transition: color 0.3s;
            }

            .close-inventory:hover {
                color: #ff6b6b;
            }

            .inventory-grid {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                gap: 10px;
                max-height: 300px;
                overflow-y: auto;
                padding-right: 10px;
            }

            .inventory-grid::-webkit-scrollbar {
                width: 8px;
            }

            .inventory-grid::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
            }

            .inventory-grid::-webkit-scrollbar-thumb {
                background: #ffd700;
                border-radius: 4px;
            }

            .inventory-slot {
                width: 50px;
                height: 50px;
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid #ffd700;
                border-radius: 5px;
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
                cursor: pointer;
                transition: all 0.3s;
            }

            .inventory-slot:hover {
                background: rgba(255, 215, 0, 0.2);
                transform: scale(1.05);
            }

            .empty-slot {
                border: 2px dashed #ffd700;
                opacity: 0.5;
            }

            .item-emoji {
                font-size: 24px;
                text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
            }

            .item-count {
                position: absolute;
                bottom: 2px;
                right: 2px;
                background: rgba(0, 0, 0, 0.8);
                color: #ffd700;
                padding: 2px 4px;
                border-radius: 3px;
                font-size: 12px;
                font-weight: bold;
            }

            .item-tooltip {
                position: fixed;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 8px 12px;
                border-radius: 5px;
                border: 1px solid #ffd700;
                font-size: 14px;
                z-index: 1001;
                white-space: pre-line;
                pointer-events: none;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            }

            .calculator-modal {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
                padding: 20px;
                border-radius: 12px;
                border: 2px solid #ffd700;
                color: white;
                z-index: 1002;
                width: 320px;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
                cursor: move;
                user-select: none;
            }

            .calculator-modal::-webkit-scrollbar {
                width: 6px;
            }

            .calculator-modal::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 3px;
            }

            .calculator-modal::-webkit-scrollbar-thumb {
                background: #ffd700;
                border-radius: 3px;
            }

            .calculator-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                padding-bottom: 8px;
                border-bottom: 1px solid #ffd700;
                cursor: move;
                background: rgba(255, 215, 0, 0.1);
                margin: -20px -20px 15px -20px;
                padding: 12px 20px;
                border-radius: 10px 10px 0 0;
            }

            .calculator-title {
                margin: 0;
                color: #ffd700;
                font-size: 18px;
                font-weight: bold;
            }

            .calculator-close {
                background: none;
                border: none;
                color: #ffd700;
                font-size: 20px;
                cursor: pointer;
                padding: 0 8px;
                transition: color 0.3s;
            }

            .calculator-close:hover {
                color: #ff6b6b;
            }

            .calculator-form {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .calculator-tabs {
                display: flex;
                gap: 8px;
                margin-bottom: 5px;
            }

            .tab-btn {
                flex: 1;
                background: rgba(255, 215, 0, 0.1);
                border: 1px solid #ffd700;
                color: #ffd700;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s;
            }

            .tab-btn:hover {
                background: rgba(255, 215, 0, 0.2);
            }

            .tab-btn.active {
                background: #ffd700;
                color: black;
                font-weight: bold;
            }

            .calculator-input {
                width: 100%;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid #ffd700;
                border-radius: 4px;
                padding: 8px;
                color: white;
                font-size: 14px;
                box-sizing: border-box;
            }

            .calculator-input:focus {
                outline: none;
                border-color: #ff6b6b;
                box-shadow: 0 0 5px rgba(255, 107, 107, 0.3);
            }

            .calculator-button {
                background: #ffd700;
                border: none;
                border-radius: 4px;
                padding: 8px;
                color: black;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s;
                font-size: 14px;
            }

            .calculator-button:hover {
                background: #ff6b6b;
                transform: scale(1.02);
            }

            .calculator-result {
                margin-top: 12px;
                padding: 12px;
                background: rgba(255, 215, 0, 0.1);
                border-radius: 4px;
                text-align: center;
                font-size: 14px;
                color: #ffd700;
                line-height: 1.4;
            }

            .calculator-content {
                display: none;
            }

            .calculator-content.active {
                display: block;
            }

            .trading-tips {
                color: white;
                padding: 10px;
                max-height: 400px;
                overflow-y: auto;
                background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
                border-radius: 8px;
            }

            .trading-tips h3 {
                color: #ffd700;
                text-align: center;
                margin-bottom: 15px;
                font-size: 18px;
                text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
                border-bottom: 2px solid #ffd700;
                padding-bottom: 10px;
            }

            .tip-section {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid #ffd700;
                border-radius: 6px;
                padding: 12px;
                margin-bottom: 12px;
                transition: all 0.3s;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            }

            .tip-section:hover {
                background: rgba(255, 215, 0, 0.1);
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            }

            .tip-section h4 {
                color: #ffd700;
                margin: 0 0 8px 0;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 6px;
                text-shadow: 0 0 5px rgba(255, 215, 0, 0.3);
            }

            .tip-section p {
                margin: 4px 0;
                line-height: 1.3;
                color: #fff;
                font-size: 12px;
            }

            .tip-section p:before {
                content: "•";
                color: #ffd700;
                margin-right: 6px;
            }

            .manual-navigation {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 15px;
                padding-top: 15px;
                border-top: 1px solid rgba(255, 215, 0, 0.3);
            }

            .nav-btn {
                background: linear-gradient(135deg, #ffd700 0%, #ffa500 100%);
                border: none;
                color: #000;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.3s;
                font-weight: bold;
                font-size: 12px;
                text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
            }

            .nav-btn:hover:not(:disabled) {
                transform: scale(1.05);
                box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
            }

            .nav-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none;
            }

            .page-indicator {
                color: #ffd700;
                font-weight: bold;
                text-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
                font-size: 12px;
                background: rgba(0, 0, 0, 0.2);
                padding: 4px 8px;
                border-radius: 4px;
            }

            .manual-page {
                transition: all 0.3s ease-in-out;
                transform: translateX(0);
                opacity: 1;
            }

            .manual-page[style*="display: none"] {
                opacity: 0;
                transform: translateX(100%);
            }

            .manual-page[style*="display: block"] {
                opacity: 1;
                transform: translateX(0);
            }

            .game-blur {
                filter: blur(5px);
                pointer-events: none;
                transition: filter 0.3s ease-in-out;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 998;
            }

            .game-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.3);
                z-index: 999;
                display: none;
                transition: opacity 0.3s ease-in-out;
                pointer-events: none;
            }

            .game-overlay.active {
                display: block;
                opacity: 1;
            }

            .floor-item {
                position: absolute;
                width: 50px;
                height: 50px;
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid #ffd700;
                border-radius: 5px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                transition: all 0.3s;
                z-index: 100;
                backdrop-filter: blur(5px);
                box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
            }

            .floor-item:hover {
                transform: scale(1.1);
                background: rgba(255, 215, 0, 0.2);
                box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
            }

            .floor-item .item-emoji {
                font-size: 24px;
                text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
            }

            .floor-item .item-name {
                font-size: 12px;
                color: #ffd700;
                text-align: center;
                margin-top: 2px;
                text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 45px;
            }
        `;
        document.head.appendChild(style);
    }

    initialize() {
        const container = document.createElement("div");
        container.className = "inventory-container";
        container.id = "inventoryContainer";
        container.style.display = "none";
        container.innerHTML = `
            <div class="inventory-header">
                <h2>Inventory</h2>
                <button class="close-inventory">×</button>
            </div>
            <div class="inventory-grid"></div>
        `;
        document.body.appendChild(container);

        const overlay = document.createElement("div");
        overlay.className = "game-overlay";
        document.body.appendChild(overlay);

        const closeBtn = container.querySelector(".close-inventory");
        closeBtn.addEventListener("click", () => this.close());

        document.addEventListener("keydown", (e) => {
            if (e.key === ".") {
                this.toggle();
            }
        });

        this.makeDraggable(container);
    }

    loadFromCookies() {
        const cookies = document.cookie.split(';');
        
        const gameKeyCookie = cookies.find(cookie => cookie.trim().startsWith('gameKey='));
        if (gameKeyCookie && gameKeyCookie.includes('meteorBlasterKey') && !this.items.some(item => item.id === 'meteor_key')) {
            this.addItem({
                id: 'meteor_key',
                name: 'Meteor Key',
                description: 'A special key earned by completing meteor challenges.',
                emoji: '🌠',
                stackable: false,
                value: 2000
            });
        }

        const meteorKeyCookie = cookies.find(cookie => {
            const trimmedCookie = cookie.trim();
            return trimmedCookie.startsWith('meteorKey=') || 
                   trimmedCookie.startsWith('meteor_key=') || 
                   trimmedCookie.startsWith('meteor=');
        });
        
        if (meteorKeyCookie && !this.items.some(item => item.id === 'meteor_key')) {
            const meteorKeyItem = {
                id: 'meteor_key',
                name: 'Meteor Key',
                description: 'A special key earned by completing meteor challenges.',
                emoji: '🌠',
                stackable: false,
                value: 2000
            };
            this.addItem(meteorKeyItem);
        }

        const achievementCookies = cookies.filter(cookie => cookie.trim().startsWith('achievement_'));
        achievementCookies.forEach(cookie => {
            const [name, value] = cookie.split('=');
            const achievementId = name.replace('achievement_', '').trim();
            
            if (!this.items.some(item => item.id === `achievement_${achievementId}`)) {
                this.addItem({
                    id: `achievement_${achievementId}`,
                    name: achievementId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                    description: `Achievement earned: ${achievementId.replace(/_/g, ' ')}`,
                    emoji: '🏆',
                    stackable: false,
                    value: 500
                });
            }
        });

        const levelCookies = cookies.filter(cookie => cookie.trim().startsWith('level_'));
        levelCookies.forEach(cookie => {
            const [name, value] = cookie.split('=');
            const levelId = name.replace('level_', '').trim();
            
            if (!this.items.some(item => item.id === `level_${levelId}`)) {
                this.addItem({
                    id: `level_${levelId}`,
                    name: `${levelId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Badge`,
                    description: `Completed ${levelId.replace(/_/g, ' ')} level`,
                    emoji: '🎖️',
                    stackable: false,
                    value: 1000
                });
            }
        });

        const quizCookies = cookies.filter(cookie => cookie.trim().startsWith('quiz_'));
        quizCookies.forEach(cookie => {
            const [name, value] = cookie.split('=');
            const quizId = name.replace('quiz_', '').trim();
            
            if (!this.items.some(item => item.id === `quiz_${quizId}`)) {
                this.addItem({
                    id: `quiz_${quizId}`,
                    name: `${quizId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Certificate`,
                    description: `Completed ${quizId.replace(/_/g, ' ')} quiz`,
                    emoji: '📜',
                    stackable: false,
                    value: 500
                });
            }
        });
    }

    saveToCookies() {
        this.items.forEach(item => {
            if (item.id === 'meteor_key') {
                document.cookie = `meteorKey=true;path=/;max-age=31536000`;
            } else if (item.id === 'game_key') {
                document.cookie = `gameKey=true;path=/;max-age=31536000`;
            } else if (item.id.startsWith('achievement_')) {
                document.cookie = `${item.id}=true;path=/;max-age=31536000`;
            } else if (item.id.startsWith('level_')) {
                document.cookie = `${item.id}=true;path=/;max-age=31536000`;
            } else if (item.id.startsWith('quiz_')) {
                document.cookie = `${item.id}=true;path=/;max-age=31536000`;
            }
        });
    }

    addItem(item) {
        if (!item || !item.id) {
            return false;
        }

        if (item.id === 'meteor_key') {
            this.items = this.items.filter(i => i.id !== 'meteor_key');
            this.items.push({ ...item, quantity: 1 });
            this.saveToCookies();
            this.updateDisplay();
            return true;
        }

        const existingItem = this.items.find(i => i.id === item.id);
        
        if (existingItem && existingItem.stackable) {
            existingItem.quantity += item.quantity || 1;
        } else {
            this.items.push({ ...item, quantity: item.quantity || 1 });
        }
        
        this.saveToCookies();
        this.updateDisplay();
        return true;
    }

    removeItem(itemId, amount = 1) {
        const itemIndex = this.items.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return false;

        const item = this.items[itemIndex];
        if (item.quantity > amount) {
            item.quantity -= amount;
        } else {
            this.items.splice(itemIndex, 1);
            if (itemId.startsWith('game_key') || itemId.startsWith('meteor_key') || 
                itemId.startsWith('achievement_') || itemId.startsWith('level_') || 
                itemId.startsWith('quiz_')) {
                document.cookie = `${itemId}=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
            }
        }

        this.updateDisplay();
        this.saveToCookies();
        return true;
    }

    updateDisplay() {
        const grid = document.querySelector(".inventory-grid");
        if (!grid) {
            return;
        }
        grid.innerHTML = "";

        this.items.forEach(item => {
            const slot = document.createElement("div");
            slot.className = "inventory-slot";
            
            const emoji = document.createElement("div");
            emoji.className = "item-emoji";
            emoji.textContent = item.emoji || "❓";
            slot.appendChild(emoji);

            if (item.quantity > 1) {
                const count = document.createElement("div");
                count.className = "item-count";
                count.textContent = item.quantity;
                slot.appendChild(count);
            }

            slot.addEventListener("click", () => {
                if (item.isCalculator) {
                    this.showCalculator(item);
                } else if (item.id === 'trading_manual') {
                    this.showTradingTips();
                }
            });

            slot.addEventListener("mouseover", (e) => {
                const tooltip = document.createElement("div");
                tooltip.className = "item-tooltip";
                tooltip.textContent = `${item.name}\n${item.description || ""}`;
                tooltip.style.left = e.pageX + 10 + "px";
                tooltip.style.top = e.pageY + 10 + "px";
                document.body.appendChild(tooltip);
            });

            slot.addEventListener("mouseout", () => {
                const tooltip = document.querySelector(".item-tooltip");
                if (tooltip) tooltip.remove();
            });

            grid.appendChild(slot);
        });

        const emptySlots = 21 - this.items.length;
        for (let i = 0; i < emptySlots; i++) {
            const slot = document.createElement("div");
            slot.className = "inventory-slot empty-slot";
            grid.appendChild(slot);
        }
    }

    makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = element.querySelector(".calculator-header") || element.querySelector(".inventory-header");
        
        if (!header) return;

        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    showCalculator(item) {
        const modal = document.createElement("div");
        modal.className = "calculator-modal";
        modal.innerHTML = `
            <div class="calculator-header">
                <h2 class="calculator-title">${item.name}</h2>
                <button class="calculator-close">×</button>
            </div>
            <div class="calculator-form">
                <div class="calculator-content" data-page="1">
                    <h3>ROI Calculator</h3>
                    <div class="tip-section">
                        <input type="number" class="calculator-input" id="initialInvestment" placeholder="Initial Investment">
                        <input type="number" class="calculator-input" id="currentValue" placeholder="Current Value">
                        <input type="number" class="calculator-input" id="timePeriod" placeholder="Time Period (months)">
                        <button class="calculator-button">Calculate ROI</button>
                        <div class="calculator-result"></div>
                    </div>
                </div>

                <div class="calculator-content" data-page="2" style="display: none;">
                    <h3>Compound Interest</h3>
                    <div class="tip-section">
                        <input type="number" class="calculator-input" id="principal" placeholder="Principal Amount">
                        <input type="number" class="calculator-input" id="rate" placeholder="Annual Interest Rate (%)">
                        <input type="number" class="calculator-input" id="time" placeholder="Time (years)">
                        <input type="number" class="calculator-input" id="compounds" placeholder="Compounds per year">
                        <button class="calculator-button">Calculate Compound Interest</button>
                        <div class="calculator-result"></div>
                    </div>
                </div>

                <div class="calculator-content" data-page="3" style="display: none;">
                    <h3>Profit/Loss Calculator</h3>
                    <div class="tip-section">
                        <input type="number" class="calculator-input" id="buyPrice" placeholder="Buy Price">
                        <input type="number" class="calculator-input" id="sellPrice" placeholder="Sell Price">
                        <input type="number" class="calculator-input" id="quantity" placeholder="Quantity">
                        <button class="calculator-button">Calculate Profit/Loss</button>
                        <div class="calculator-result"></div>
                    </div>
                </div>

                <div class="manual-navigation">
                    <button class="nav-btn prev-btn" disabled>Previous</button>
                    <span class="page-indicator">Calculator 1 of 3</span>
                    <button class="nav-btn next-btn">Next</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.makeDraggable(modal);

        const closeBtn = modal.querySelector(".calculator-close");
        const prevBtn = modal.querySelector(".prev-btn");
        const nextBtn = modal.querySelector(".next-btn");
        const pageIndicator = modal.querySelector(".page-indicator");
        const pages = modal.querySelectorAll(".calculator-content");
        const calculateBtns = modal.querySelectorAll(".calculator-button");
        const resultDivs = modal.querySelectorAll(".calculator-result");
        let currentPage = 1;

        const updateNavigation = () => {
            prevBtn.disabled = currentPage === 1;
            nextBtn.disabled = currentPage === pages.length;
            pageIndicator.textContent = `Calculator ${currentPage} of ${pages.length}`;
        };

        prevBtn.addEventListener("click", () => {
            if (currentPage > 1) {
                pages[currentPage - 1].style.display = "none";
                currentPage--;
                pages[currentPage - 1].style.display = "block";
                updateNavigation();
            }
        });

        nextBtn.addEventListener("click", () => {
            if (currentPage < pages.length) {
                pages[currentPage - 1].style.display = "none";
                currentPage++;
                pages[currentPage - 1].style.display = "block";
                updateNavigation();
            }
        });

        calculateBtns[0].addEventListener("click", () => {
            const initialInvestment = parseFloat(document.getElementById("initialInvestment").value);
            const currentValue = parseFloat(document.getElementById("currentValue").value);
            const timePeriod = parseFloat(document.getElementById("timePeriod").value);

            if (isNaN(initialInvestment) || isNaN(currentValue) || isNaN(timePeriod)) {
                resultDivs[0].textContent = "Please enter valid numbers";
                return;
            }

            const roi = ((currentValue - initialInvestment) / initialInvestment) * 100;
            const annualizedRoi = (Math.pow(currentValue / initialInvestment, 12 / timePeriod) - 1) * 100;
            resultDivs[0].innerHTML = `
                ROI: ${roi.toFixed(2)}%<br>
                Annualized ROI: ${annualizedRoi.toFixed(2)}%<br>
                Total Profit: $${(currentValue - initialInvestment).toFixed(2)}
            `;
        });

        calculateBtns[1].addEventListener("click", () => {
            const principal = parseFloat(document.getElementById("principal").value);
            const rate = parseFloat(document.getElementById("rate").value);
            const time = parseFloat(document.getElementById("time").value);
            const compounds = parseFloat(document.getElementById("compounds").value);

            if (isNaN(principal) || isNaN(rate) || isNaN(time) || isNaN(compounds)) {
                resultDivs[1].textContent = "Please enter valid numbers";
                return;
            }

            const amount = principal * Math.pow(1 + (rate / 100) / compounds, compounds * time);
            const interest = amount - principal;
            resultDivs[1].innerHTML = `
                Final Amount: $${amount.toFixed(2)}<br>
                Interest Earned: $${interest.toFixed(2)}<br>
                Effective Annual Rate: ${((Math.pow(1 + (rate / 100) / compounds, compounds) - 1) * 100).toFixed(2)}%
            `;
        });

        calculateBtns[2].addEventListener("click", () => {
            const buyPrice = parseFloat(document.getElementById("buyPrice").value);
            const sellPrice = parseFloat(document.getElementById("sellPrice").value);
            const quantity = parseFloat(document.getElementById("quantity").value);

            if (isNaN(buyPrice) || isNaN(sellPrice) || isNaN(quantity)) {
                resultDivs[2].textContent = "Please enter valid numbers";
                return;
            }

            const profit = (sellPrice - buyPrice) * quantity;
            const profitPercentage = ((sellPrice - buyPrice) / buyPrice) * 100;
            resultDivs[2].innerHTML = `
                Profit/Loss: $${profit.toFixed(2)}<br>
                Profit/Loss %: ${profitPercentage.toFixed(2)}%<br>
                Total Value: $${(sellPrice * quantity).toFixed(2)}
            `;
        });

        closeBtn.addEventListener("click", () => {
            modal.remove();
        });
    }

    showTradingTips() {
        const modal = document.createElement("div");
        modal.className = "calculator-modal";
        modal.innerHTML = `
            <div class="calculator-header">
                <h2 class="calculator-title">Trading Manual</h2>
                <button class="calculator-close">×</button>
            </div>
            <div class="calculator-form">
                <div class="trading-tips">
                    <div class="manual-page" data-page="1">
                        <h3>Market Analysis Basics</h3>
                        <div class="tip-section">
                            <h4>📈 Understanding Market Trends</h4>
                            <p>• Learn to identify market trends using price charts</p>
                            <p>• Study support and resistance levels</p>
                            <p>• Analyze trading volume patterns</p>
                            <p>• Identify market cycles and patterns</p>
                            <p>• Use multiple timeframes for confirmation</p>
                        </div>
                        <div class="tip-section">
                            <h4>📊 Technical Indicators</h4>
                            <p>• Moving Averages (MA, EMA)</p>
                            <p>• Relative Strength Index (RSI)</p>
                            <p>• MACD and Bollinger Bands</p>
                            <p>• Stochastic Oscillator</p>
                            <p>• Volume Profile and OBV</p>
                        </div>
                        <div class="tip-section">
                            <h4>📰 Fundamental Analysis</h4>
                            <p>• Company financial statements</p>
                            <p>• Industry trends and news</p>
                            <p>• Economic indicators</p>
                            <p>• Market sentiment analysis</p>
                        </div>
                    </div>

                    <div class="manual-page" data-page="2" style="display: none;">
                        <h3>Risk Management Strategies</h3>
                        <div class="tip-section">
                            <h4>💰 Position Sizing</h4>
                            <p>• Never risk more than 1-2% per trade</p>
                            <p>• Calculate position size based on risk</p>
                            <p>• Use stop-loss orders effectively</p>
                            <p>• Scale in and out of positions</p>
                            <p>• Consider leverage and margin requirements</p>
                        </div>
                        <div class="tip-section">
                            <h4>🎯 Portfolio Management</h4>
                            <p>• Diversify across different assets</p>
                            <p>• Balance risk and reward</p>
                            <p>• Regular portfolio rebalancing</p>
                            <p>• Asset allocation strategies</p>
                            <p>• Risk-adjusted returns calculation</p>
                        </div>
                        <div class="tip-section">
                            <h4>🛡️ Risk Control</h4>
                            <p>• Set maximum drawdown limits</p>
                            <p>• Use trailing stops</p>
                            <p>• Implement hedging strategies</p>
                            <p>• Monitor correlation between assets</p>
                            <p>• Regular risk assessment</p>
                        </div>
                    </div>

                    <div class="manual-page" data-page="3" style="display: none;">
                        <h3>Advanced Trading Strategies</h3>
                        <div class="tip-section">
                            <h4>⚡ Day Trading</h4>
                            <p>• Quick profit taking</p>
                            <p>• Managing multiple positions</p>
                            <p>• Risk management in fast markets</p>
                            <p>• Scalping techniques</p>
                            <p>• High-frequency trading basics</p>
                        </div>
                        <div class="tip-section">
                            <h4>📈 Swing Trading</h4>
                            <p>• Holding positions for days/weeks</p>
                            <p>• Trend following strategies</p>
                            <p>• Managing longer-term positions</p>
                            <p>• Breakout trading</p>
                            <p>• Mean reversion strategies</p>
                        </div>
                        <div class="tip-section">
                            <h4>🎯 Options Trading</h4>
                            <p>• Understanding options basics</p>
                            <p>• Call and put strategies</p>
                            <p>• Options Greeks</p>
                            <p>• Options spreads</p>
                            <p>• Risk management in options</p>
                        </div>
                    </div>

                    <div class="manual-page" data-page="4" style="display: none;">
                        <h3>Psychology & Mindset</h3>
                        <div class="tip-section">
                            <h4>🧠 Trading Psychology</h4>
                            <p>• Control emotions during trades</p>
                            <p>• Develop a trading routine</p>
                            <p>• Learn from losses and wins</p>
                            <p>• Overcoming fear and greed</p>
                            <p>• Building trading confidence</p>
                        </div>
                        <div class="tip-section">
                            <h4>📝 Trading Journal</h4>
                            <p>• Record all trades and outcomes</p>
                            <p>• Analyze patterns in success/failure</p>
                            <p>• Continuous improvement process</p>
                            <p>• Performance metrics tracking</p>
                            <p>• Strategy optimization</p>
                        </div>
                        <div class="tip-section">
                            <h4>🎯 Trading Plan</h4>
                            <p>• Define trading goals</p>
                            <p>• Set up trading rules</p>
                            <p>• Create entry/exit criteria</p>
                            <p>• Regular plan review</p>
                            <p>• Adapt to market conditions</p>
                        </div>
                    </div>

                    <div class="manual-navigation">
                        <button class="nav-btn prev-btn" disabled>Previous</button>
                        <span class="page-indicator">Page 1 of 4</span>
                        <button class="nav-btn next-btn">Next</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.makeDraggable(modal);

        const closeBtn = modal.querySelector(".calculator-close");
        const prevBtn = modal.querySelector(".prev-btn");
        const nextBtn = modal.querySelector(".next-btn");
        const pageIndicator = modal.querySelector(".page-indicator");
        const pages = modal.querySelectorAll(".manual-page");
        let currentPage = 1;

        const updateNavigation = () => {
            prevBtn.disabled = currentPage === 1;
            nextBtn.disabled = currentPage === pages.length;
            pageIndicator.textContent = `Page ${currentPage} of ${pages.length}`;
        };

        prevBtn.addEventListener("click", () => {
            if (currentPage > 1) {
                pages[currentPage - 1].style.display = "none";
                currentPage--;
                pages[currentPage - 1].style.display = "block";
                updateNavigation();
            }
        });

        nextBtn.addEventListener("click", () => {
            if (currentPage < pages.length) {
                pages[currentPage - 1].style.display = "none";
                currentPage++;
                pages[currentPage - 1].style.display = "block";
                updateNavigation();
            }
        });

        closeBtn.addEventListener("click", () => {
            modal.remove();
        });
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.isOpen = true;
        const container = document.getElementById("inventoryContainer");
        if (!container) {
            return;
        }
        container.style.display = "block";
        this.updateDisplay();
        
        const gameContainer = document.getElementById("gameContainer");
        if (gameContainer) {
            gameContainer.classList.add("game-blur");
            
            const overlay = document.querySelector(".game-overlay");
            if (overlay) {
                overlay.classList.add("active");
            }
        }

        if (gameContainer && gameContainer.gameControl) {
            gameContainer.gameControl.pause();
        }
    }

    close() {
        this.isOpen = false;
        const container = document.getElementById("inventoryContainer");
        if (!container) {
            return;
        }
        container.style.display = "none";
        
        const gameContainer = document.getElementById("gameContainer");
        if (gameContainer) {
            gameContainer.classList.remove("game-blur");
            
            const overlay = document.querySelector(".game-overlay");
            if (overlay) {
                overlay.classList.remove("active");
            }
        }
        
        if (gameContainer && gameContainer.gameControl) {
            gameContainer.gameControl.resume();
        }
    }

    static getInstance() {
        if (!Inventory.instance) {
            Inventory.instance = new Inventory();
        }
        return Inventory.instance;
    }

    addStartingItems() {
        this.addItem({
            id: 'roi_calculator',
            name: 'ROI Calculator',
            description: 'Calculate Return on Investment for your trades.',
            emoji: '📊',
            stackable: false,
            value: 300,
            isCalculator: true
        });

        this.addItem({
            id: 'stock_certificate',
            name: 'Stock Certificate',
            description: 'A valuable stock certificate that can be traded for profit.',
            emoji: '📈',
            stackable: true,
            value: 1000,
            quantity: 5
        });

        this.addItem({
            id: 'bond',
            name: 'Government Bond',
            description: 'A safe investment that provides steady returns.',
            emoji: '💵',
            stackable: true,
            value: 500,
            quantity: 3
        });

        this.addItem({
            id: 'trading_boost',
            name: 'Trading Boost',
            description: 'Increases trading profits by 50% for 30 seconds.',
            emoji: '⚡',
            stackable: true,
            value: 200,
            quantity: 2
        });

        this.addItem({
            id: 'speed_boost',
            name: 'Speed Boost',
            description: 'Increases movement speed by 25% for 20 seconds.',
            emoji: '🚀',
            stackable: true,
            value: 150,
            quantity: 2
        });

        this.addItem({
            id: 'trading_manual',
            name: 'Trading Manual',
            description: 'A comprehensive guide to advanced trading strategies.',
            emoji: '📚',
            stackable: false,
            value: 3000,
            quantity: 1
        });
    }
}

export default Inventory; 