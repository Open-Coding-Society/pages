//@ts-check

const shopContainer = document.getElementById("shop-container");
const cookieButton = document.getElementById("cookie");
const cookieCountDisplay = document.getElementById("cookie-count");
const gameArea = document.getElementById("game-area");

// Create a tooltip element
const tooltip = document.createElement('div');
tooltip.id = 'tooltip';
tooltip.className = 'absolute hidden bg-black text-white px-2 py-1 rounded text-sm z-10 pointer-events-none';
document.body.appendChild(tooltip);

function addButtonTooltip(button) {
    button.addEventListener('mouseover', (e) => {
        tooltip.innerHTML = button.innerHTML;
        tooltip.style.left = `${e.pageX + 10}px`;
        tooltip.style.top = `${e.pageY + 10}px`;
        tooltip.classList.remove('hidden');
    });
    button.addEventListener('mouseout', () => {
        tooltip.classList.add('hidden');
    });
    button.addEventListener('mousemove', (e) => {
        tooltip.style.left = `${e.pageX + 10}px`;
        tooltip.style.top = `${e.pageY + 10}px`;
    });
}


const cookie = {
  cookieMulti: 1,
  cookies: 0,
  addCookies(amount) {
    this.cookies += amount;
    this.updateDisplay();
    localStorage.setItem("cookies", this.cookies);
  },
  updateDisplay() {
    cookieCountDisplay.innerHTML = this.cookies;
  },
  fetchStoredCookies() {
    const storedCookies = Number(localStorage.getItem("cookies"));
    if (storedCookies) {
      this.cookies = storedCookies;
      this.updateDisplay();
    }
  },
};

const shop = {
  upgrades: [],
  tab: "shop",
  forSale: [],
  updateShopDisplay() {
    shopContainer.innerHTML = "";
    const shopTitle = document.createElement("div");
    shopTitle.className = "text-xl font-bold mb-4 text-center text-white bg-amber-600 rounded-lg p-2";
    shopTitle.innerHTML = "SHOP";
    shopContainer.appendChild(shopTitle);
    const shopSwap = document.createElement("button");
    shopSwap.className = `w-full bg-amber-400 hover:bg-amber-500 text-white font-bold py-2 px-4 rounded border-2 border-amber-600 whitespace-nowrap overflow-hidden text-ellipsis`;
    if (this.tab === "upgrades") shopSwap.innerHTML = "Switch to Shop";
    else shopSwap.innerHTML = "Switch to Upgrades";
    shopSwap.addEventListener("click", () => {
      if (this.tab === "upgrades") shop.switchTab("shop");
      else shop.switchTab("upgrades");
    });
    addButtonTooltip(shopSwap);
    shopContainer.appendChild(shopSwap);
    if (this.tab === "upgrades")
      for (let i = 0; i < this.forSale.length; i++) {
        const forSaleItemInfo = this.forSale[i];

        const shopButton = document.createElement("button");
        shopButton.className = `w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded border-2 border-amber-700 whitespace-nowrap overflow-hidden text-ellipsis`;
        shopButton.innerHTML = `${forSaleItemInfo.emoji} ${forSaleItemInfo.name} (${forSaleItemInfo.price} 🍪)`;
        
        shopButton.addEventListener("click", () => {
          if (cookie.cookies < forSaleItemInfo.price) {
            alert("Insufficient Cookies");
            return;
          }
          cookie.addCookies(-1 * forSaleItemInfo.price);

          gameLoop.updateCookieMulti(
            forSaleItemInfo.name,
            forSaleItemInfo.multiplier,
          );

          shopButton.remove();
        });
        addButtonTooltip(shopButton);
        shopContainer.appendChild(shopButton);
      }
    else if (this.tab === "shop")
      for (let i = 0; i < this.forSale.length; i++) {
        const forSaleItemInfo = this.forSale[i];

        const shopButton = document.createElement("button");
        shopButton.className = `w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded border-2 border-amber-700 whitespace-nowrap overflow-hidden text-ellipsis`;
        shopButton.innerHTML = `${forSaleItemInfo.emoji} ${forSaleItemInfo.name} (${forSaleItemInfo.price} 🍪)`;
        
        shopButton.addEventListener("click", () => {
          if (cookie.cookies < forSaleItemInfo.price) {
            alert("Insufficient Cookies");
            return;
          }
          cookie.addCookies(-1 * forSaleItemInfo.price);

          gameLoop.addAutoClicker(
            forSaleItemInfo.name,
            forSaleItemInfo.cookiesPerSecond,
          );
          this.updateForSalePrice(
            Math.floor(
              forSaleItemInfo.originalPrice *
                (gameLoop.getAmount(forSaleItemInfo.name) + 1),
            ),
            i,
          );
        });
        addButtonTooltip(shopButton);
        shopContainer.appendChild(shopButton);
      }
  },
  addItemForSale(item) {
    this.forSale.push({
      ...item,
      originalPrice: item.price,
    });
    this.updateShopDisplay();
  },
  updateForSalePrice(newPrice, index) {
    this.forSale[index].price = newPrice;
    this.updateShopDisplay();
  },
  switchTab(newTab) {
    this.tab = newTab;
    this.forSale.splice(0, this.forSale.length);
    this.updateShopDisplay();
    if (newTab === "shop") {
      console.log(shopItems);
      for (let i = 0; i < shopItems.length; i++) {
        console.log(shopItems[i]);
        if (gameLoop.getAmount(shopItems[i].name)) {
          console.log(
            "Price is: " +
              shopItems[i].price * (gameLoop.getAmount(shopItems[i].name) + 1),
          );
          this.addItemForSale({
            ...shopItems[i],

            price:
              shopItems[i].price * (gameLoop.getAmount(shopItems[i].name) + 1),
          });
        } else {
          this.addItemForSale({
            ...shopItems[i],

            price: shopItems[i].price,
          });
        }
      }
    } else if (newTab === "upgrades") {
      for (let i = 0; i < this.upgrades.length; i++) {
        if (gameLoop.upgrades[this.upgrades[i].name]) continue;
        this.addItemForSale(this.upgrades[i]);
      }
    }
  },
};

const gameLoop = {
  autoClickers: {},
  upgrades: {},
  cookiesPerSecond: 0,
  intervalId: -1,
  addAutoClicker(itemName, cps) {
    if (this.autoClickers[itemName]) {
      this.autoClickers[itemName] += 1;
    } else {
      this.autoClickers[itemName] = 1;
    }
    this.cookiesPerSecond += cps;
    localStorage.setItem("savedShop", JSON.stringify(this.autoClickers));
    this.runLoop();

    const purchased = shopItems.find((it) => it.name === itemName);
    if (purchased) {
      const newEmoji = new EmojiBuddy(purchased.emoji);
      newEmoji.spawn(Math.random() * 1000, Math.random() * 1000);
    }
  },
  updateCookieMulti(itemName, amt) {
    this.upgrades[itemName] = amt;
    localStorage.setItem("savedUpgrades", JSON.stringify(this.upgrades));
    cookie.cookieMulti += amt;
  },
  runLoop() {
    if (this.intervalId > 0) {
      clearInterval(this.intervalId);
      this.intervalId = 0;
    }
    this.intervalId = setInterval(() => {
      cookie.addCookies(this.cookiesPerSecond);
    }, 1000);
  },
  fetchSavedData() {
    const data = localStorage.getItem("savedShop");
    if (data) {
      // Get the Cookies in our shop
      const cookiePerSecondAndIndexMap = {};
      for (let i = 0; i < shop.forSale.length; i++) {
        cookiePerSecondAndIndexMap[shop.forSale[i].name] = {
          cps: shop.forSale[i].cookiesPerSecond,
          emoji: shop.forSale[i].emoji,
          index: i,
        };
      }

      //get saved autoclickers (local storage)
      const autoClickersData = JSON.parse(data);
      this.autoClickers = autoClickersData;

      //for every item in autoClickers data, find its corresponding cookie from the shop (by its name).
      const keys = Object.keys(this.autoClickers);
      for (let i = 0; i < keys.length; i++) {
        const upgradeName = keys[i];
        const amount = this.autoClickers[upgradeName];
        if (!amount) {
          console.warn(`${upgradeName} not found in the shop.`);
          continue;
        }

        this.cookiesPerSecond +=
          amount * cookiePerSecondAndIndexMap[upgradeName].cps;

        shop.updateForSalePrice(
          Math.floor(
            shop.forSale[cookiePerSecondAndIndexMap[upgradeName].index]
              .originalPrice *
              (amount + 1),
          ),
          cookiePerSecondAndIndexMap[upgradeName].index,
        );
        for (let i = 0; i < amount; i++) {
          const emojiBuddy = new EmojiBuddy(
            cookiePerSecondAndIndexMap[upgradeName].emoji,
          );
          emojiBuddy.spawn(Math.random() * 1000, Math.random() * 1000);
        }
        this.runLoop();
      }
    }
    const upgradeData = localStorage.getItem("savedUpgrades");
    if (upgradeData) {
      this.upgrades = JSON.parse(upgradeData);
      cookie.cookieMulti += this.upgrades["2X Clicks"];
    }
  },
  getAmount(cookieName) {
    return this.autoClickers[cookieName];
  },
};

class EmojiBuddy {
  /**
   * @type {{top: number, left: number, right: number, bottom: number, width: number, height: number}}
   */
  bounds;
  /**
   * @type {number}
   */
  x = 0;
  /**
   * @type {number}
   */
  y = 0;
  /**
   * @type {string}
   */
  emojiString = "";
  /**
   * @type {HTMLElement}
   */
  emoji;
  /**
   * velocity on the y axis
   * @type {number}
   */
  dy = 2;
  /**
   * velocity on the x axis
   * @type {number}
   */
  dx = 2;
  /**
   * Count of repeated bounces on the x axis
   * @type {number}
   */
  bounceErrorsX = 0;
  /**
   * count of repeated bounces on the y axis
   * @type {number}
   */
  bounceErrorsY = 0;
  /**
   *
   * @param {string} emoji
   */
  constructor(emoji) {
    this.emojiString = emoji;
    this.animate = this.animate.bind(this);
  }
  setBounds() {
    if (!gameArea) {
      console.error("gameArea not found");
      return {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
      };
    }
    const rect = gameArea.getBoundingClientRect();
    const bounds = {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      right: rect.right + window.scrollX,
      bottom: rect.bottom + window.scrollY,
      width: rect.width,
      height: rect.height,
    };
    this.bounds = bounds;
    return bounds;
  }
  /**
   * Get bottom style number relative to the gameArea
   * @param {number} x
   * @returns {string}
   */
  getLeftFromX(x) {
    return (this.bounds.left + x).toString();
  }
  /**
   * Get top style number relative to the gameArea
   * @param {number} y
   * @returns {string}
   */
  getTopFromY(y) {
    return (this.bounds.top + y).toString();
  }
  /**
   * Spawns emoji on the page and starts animation
   * @param {number} x
   * @param {number} y
   */
  spawn(x, y) {
    this.setBounds();

    this.x = x % this.bounds.width;
    this.y = y % this.bounds.height;

    const emoji = document.createElement("div");
    emoji.textContent = this.emojiString;
    emoji.style.position = "absolute";
    emoji.style.fontSize = "2rem";
    emoji.style.zIndex = '0';
    emoji.style.pointerEvents = 'none';
    gameArea?.appendChild(emoji);
    emoji.style.left = this.getLeftFromX(this.x);
    emoji.style.top = this.getTopFromY(this.y);

    this.emoji = emoji;
    this.animate();
    return emoji;
  }
  /**
   * Animates the Emoji (Bounces off the walls)
   */
  animate() {
    console.log(this.bounceErrorsX, this.bounceErrorsY);
    this.setBounds();

    this.x += this.dx;
    this.y += this.dy;

    // Bounce off actual bounds
    if (
      Number(this.getLeftFromX(this.x)) <= this.bounds.left ||
      Number(this.getLeftFromX(this.x)) + this.emoji.offsetWidth >=
        this.bounds.right
    ) {
      this.bounceErrorsX++;
      this.dx *= -1;
      console.log("X");
    } else {
      this.bounceErrorsX = 0;
    }
    if (
      Number(this.getTopFromY(this.y)) <= this.bounds.top ||
      Number(this.getTopFromY(this.y)) + this.emoji.offsetHeight >=
        this.bounds.bottom
    ) {
      this.bounceErrorsY++;
      this.dy *= -1;
      console.log("Y");
    } else {
      this.bounceErrorsY = 0;
    }

    if (this.bounceErrorsX > 5) {
      this.x = 0;
    }
    if (this.bounceErrorsY > 5) {
      this.y = 0;
    }

    this.emoji.style.left = `${this.getLeftFromX(this.x)}px`;
    this.emoji.style.top = `${this.getTopFromY(this.y)}px`;

    requestAnimationFrame(this.animate);
  }
  /**
   * Destroys the Emoji
   */
  destroy() {
    this.emoji.remove();
  }
}

const grandma = {
  name: "Grandma",
  emoji: "👵",
  price: 69,
  priceIncrementer: 1.5,
  cookiesPerSecond: 1,
};

const factory = {
  name: "Factory",
  emoji: "🏭",
  price: 400,
  priceIncrementer: 1.4,
  cookiesPerSecond: 4,
};

const mangotemple = {
  name: "Mango Temple",
  emoji: "🥭",
  price: 2000,
  priceIncrementer: 1.2,
  cookiesPerSecond: 10,
};

const bank = {
  name: "Bank",
  emoji: "🏦",
  price: 6741,
  priceIncrementer: 1.1,
  cookiesPerSecond: 20,
};

const shopItems = [];

shopItems.push(grandma);
shopItems.push(factory);
shopItems.push(mangotemple);
shopItems.push(bank);

const x2Click = {
  name: "2X Clicks",
  emoji: "🖱",
  price: 150,
  itemEffected: "click",
  multiplier: 2,
};
shop.upgrades.push(x2Click);

shop.addItemForSale(grandma);
shop.addItemForSale(factory);
shop.addItemForSale(mangotemple);
shop.addItemForSale(bank);
gameLoop.fetchSavedData();
cookie.fetchStoredCookies();
cookieButton.addEventListener("click", () => {
  console.log("COOKIE");
  if (cookie.cookieMulti) {
    cookie.addCookies(1 * cookie.cookieMulti);
  } else {
    cookie.addCookies(1);
  }
  console.log(cookie.cookies);
  gameLoop.getAmount("Grandma");
  gameLoop.getAmount("Factory");
  gameLoop.getAmount("MangoTemple");
  gameLoop.getAmount("Bank");
});