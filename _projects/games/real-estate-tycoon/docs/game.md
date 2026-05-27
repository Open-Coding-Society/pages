---
layout: post
title: Real Estate Tycoon - Overview
description: Project documentation and how-to-play guide for Real Estate Tycoon
category: Real Estate Tycoon
breadcrumb: true
permalink: /real-estate-tycoon/overview
---

## How to Play

Use **WASD** to move your investor around the city. Walk up to any NPC and press **E** to interact.

**Goal:** Grow your net worth from $500,000 to $5,000,000 to win.

### NPCs on the Map

| Character | Role |
| --- | --- |
| 🏠 Sarah — Residential Broker | Browse homes, condos, and apartments |
| 📋 Alex — Property Manager | View portfolio, collect rent, upgrade properties |
| 🏢 Marcus — Commercial Broker | Unlocks after owning 3+ properties |
| 💎 Victoria — Luxury Broker | Unlocks after owning 6+ properties |
| 🏦 First National Bank | Take loans or repay debt |

### Property Deal Battles

When you enter a deal level, press **SPACE** to fire offers at the seller. Collect 📄 inspection documents to discount the final price (each doc = -1%). The seller fires counter-offers back — avoid them or lose negotiation shields. Reduce the seller's stubbornness bar to zero to close the deal.

### Market System

Prices update in real time via Brownian motion and random market events (housing boom, recession, tech boom, etc.). Watch the market ticker at the bottom and the HUD in the top-right corner.

---

## Directory Structure

```text
_projects/games/real-estate-tycoon/
├── notebook.src.ipynb            ← Main game page at /real-estate-tycoon
├── levels/
│   ├── GameLevelMarketHub.js     ← City hub: player, NPCs, HUD, ticker, coins
│   ├── GameLevelPropertyDeal.js  ← Base class for negotiation battle levels
│   ├── GameLevelResidential.js   ← Residential deal (10 HP seller)
│   ├── GameLevelCommercial.js    ← Commercial deal (15 HP, unlocks at 3 props)
│   ├── GameLevelLuxury.js        ← Luxury deal (20 HP, unlocks at 6 props)
│   └── GameLevelWinScreen.js     ← Win screen: leaderboard + market price chart
├── model/
│   ├── MarketEngine.js           ← Brownian motion + market events (singleton)
│   ├── PortfolioManager.js       ← Cash, properties, loans (localStorage)
│   └── PropertyDatabase.js       ← 17 property definitions across 3 tiers
├── images/                       ← SVG sprites for all characters and backgrounds
└── docs/                         ← This documentation
```

## Framework Map

| Engine Piece | Role in this game |
| --- | --- |
| `GameEnvBackground` | City hub and deal-room backgrounds |
| `Player` | The investor character (WASD movement) |
| `Npc` | All 5 city NPCs with interact callbacks |
| `GameControl` | Hub → deal sub-levels → win screen transitions |
| `MarketEngine` | Singleton managing live price multipliers + events |
| `PortfolioManager` | Singleton persisting all player financials to localStorage |
| `PropertyDatabase` | Static data store for all 17 purchasable properties |

Source: `_projects/games/real-estate-tycoon/`
