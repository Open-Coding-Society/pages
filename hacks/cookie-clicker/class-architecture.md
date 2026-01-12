---
layout: lessonbase
title: Cookie Clicker Game Documentation
permalink: /cookie-clicker-game-docs/class-architecture
sidebar: true
wide: true
sidebar_title: Cookie Clicker
lesson_links: [{url: /cookie-clicker-game-docs, text: 1. Introduction}, {url: /cookie-clicker-game-docs/oop, text: 2. OOP}, {url: /cookie-clicker-game-docs/class-architecture, text: 3. Classes}, {url: /cookie-clicker-game-docs/localstorage, text: 4. Localstorage},{url: /cookie-clicker-game-docs/quiz, text: 5. OOP Quiz}]
enable_progress: true
---

# Lesson: Understanding the Shop Object

## 1. What is the `shop`?

```mermaid
graph TD
    SHOP["shop Object"]
    SHOP --> P["Properties"]
    SHOP --> M["Methods"]
```
---

## 2. Properties
In the cookie clicker game, the shop has the following properties:
- `forSale` → list of items you can buy (like Grandma or Factory)
- `upgrades` → special one-time boosts (like 2X clicks)
- `tab` → tells the shop whether to show “Shop” items or “Upgrades”

Properties are like the memory of the object.

```mermaid
classDiagram
    class Shop {
      forSale : Item[]
      upgrades : Upgrade[]
      tab : String
    }
```
---

## 3. Methods
The shop also runs functions:
- `updateShopDisplay()` → rebuilds the shop UI on screen
- `addItemForSale(item)` → adds an item to the list
- `updateForSalePrice(newPrice, index)` → raises the price after you buy something
- `switchTab(newTab)` → switches between “Shop” and “Upgrades”

Methods are the actions the object knows how to perform.
```mermaid
graph LR
    A["updateShopDisplay()"]
    B["addItemForSale(item)"]
    C["updateForSalePrice(newPrice, index)"]
    D["switchTab(newTab)"]

    A -->|UI| SHOP
    B -->|Add| SHOP
    C -->|Price change| SHOP
    D -->|Switch| SHOP
```
---

## 4. How it Connects to Other Parts
The shop doesn’t work alone. It connects to:
- `cookie` object → checks if you have enough cookies and deducts the cost
- `gameLoop` object → gives you auto-clickers or upgrades when you buy
- UI (`shopContainer`) → updates the buttons the player sees

This makes the shop a hub that ties together money, gameplay, and visuals.
```mermaid
flowchart TD
    SHOP["shop"]
    COOKIE["cookie"]
    GAME["gameLoop"]
    UI["UI (shopContainer)"]

    SHOP <--> COOKIE
    SHOP <--> GAME
    SHOP <--> UI
```
---

## 5. What You Can Learn From It
- Encapsulation → All shop logic is inside one object, so the code is organized
- Separation of concerns → Shop only handles buying and displaying; cookies and gameLoop handle their own jobs
- Scalability → You can add new items or upgrades without rewriting the whole shop

```mermaid
mindmap
  root((Shop Lessons))
    Encapsulation
    Separation_of_concerns
    Scalability
```

---
#### Take a guess on how the code works, where do the purchased shopItems go to?
Type the answer (including the object it is stored in (Hint: Its in gameLoop)):  
<input id="checkInput" type="text" placeholder="Type here..."
       style="padding:6px;border:1px solid #ccc;border-radius:6px;" />

<script>
const field = document.getElementById("checkInput");
field.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const val = field.value.trim().toLowerCase();
    if (val === "gameloop.upgrades" || val === "gameloop.autoclickers") {
      field.style.borderColor = "green";
      field.style.backgroundColor = "#496e46ff"; // light green
    } else {
      field.style.borderColor = "red";
      field.style.backgroundColor = "#6b3c40ff"; // light red
    }
  }
});
</script>

<details>
<summary>Answer:</summary>
<br>
- If it’s an upgrade (like 2x clicks), it goes to **gameLoop.upgrades**  
<br>
- If it’s an autoclicker (like a grandma), it goes to **gameLoop.autoClickers**
</details>



## Takeaway
When learning JavaScript and object-oriented design, notice how each object in your game has a clear role. By keeping properties and methods grouped, your code becomes easier to read, expand, and debug.

```mermaid
flowchart TD

CLICK["Player clicks Buy button"]
CHECK{"Enough cookies?"}

CLICK --> CHECK
CHECK -- No --> ALERT["Show 'Not enough cookies'"]
CHECK -- Yes --> DEDUCT["cookie.addCookies(-price)"]
DEDUCT --> UPDATE["gameLoop adds upgrade or auto-clicker"]
UPDATE --> REFRESH["shop.updateShopDisplay updates UI"]

```


```mermaid
flowchart TD

CLICK["Player clicks Buy button"]
CHECK{"Enough cookies?"}

CLICK --> CHECK
CHECK -- No --> ALERT["Show 'Not enough cookies'"]
CHECK -- Yes --> DEDUCT["cookie.addCookies(-price)"]
DEDUCT --> UPDATE["gameLoop adds upgrade or auto-clicker"]
UPDATE --> REFRESH["shop.updateShopDisplay updates UI"]

```
