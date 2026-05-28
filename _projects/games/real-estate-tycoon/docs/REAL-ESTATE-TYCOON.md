---
layout: post
title: Real Estate Tycoon - Design Notes
description: Architecture and design document for the Real Estate Tycoon game
category: Real Estate Tycoon
breadcrumb: true
permalink: /real-estate-tycoon/docs
---

## Overview

Real Estate Tycoon is the most advanced game built on GameEnginev1.1. It combines a full MVC architecture with real-time market simulation, negotiation battles, and a complete financial management system.

## Directory Structure

```
_projects/real-estate-tycoon/
├── Makefile
├── levels/
│   ├── GameLevelMarketHub.js      # Main world (hub level)
│   ├── GameLevelPropertyDeal.js   # Base negotiation battle class
│   ├── GameLevelResidential.js    # Residential property deals
│   ├── GameLevelCommercial.js     # Commercial property deals
│   ├── GameLevelLuxury.js         # Luxury property deals
│   └── GameLevelWinScreen.js      # Victory screen + leaderboard
├── model/
│   ├── PortfolioManager.js        # Financial data (localStorage)
│   ├── MarketEngine.js            # Live market simulation
│   └── PropertyDatabase.js        # 16 property catalog
├── images/
│   ├── city_background.svg        # Main city skyline
│   ├── bg_residential.svg         # Residential deal background
│   ├── bg_commercial.svg          # Commercial deal background
│   ├── bg_luxury.svg              # Luxury deal (sunset beach)
│   ├── player_investor.svg        # Player character sprite
│   ├── broker_residential.svg     # Sarah NPC
│   ├── broker_commercial.svg      # Marcus NPC
│   ├── broker_luxury.svg          # Victoria NPC (top hat)
│   ├── bank_manager.svg           # Bank NPC
│   └── property_manager.svg       # Alex NPC
└── docs/
    └── REAL-ESTATE-TYCOON.md
```

## Game Systems

### Market Engine (MarketEngine.js)

A singleton that simulates the real estate market:

- **Brownian motion pricing**: Prices drift randomly with mean reversion toward 1.0
- **Market events**: 10 event types randomly triggered every 25-85 seconds
- **Event types**: Housing Boom, Recession, Tech Expansion, Fed Rate Hike, Luxury Surge, etc.
- **Price history**: Tracks up to 60 data points per category for the win-screen chart
- **localStorage**: Market state persists across page refreshes (5-min TTL)

### Portfolio Manager (PortfolioManager.js)

Full financial CRUD with localStorage persistence:

- **Starting capital**: $500,000
- **Buy properties**: Deducts from cash, adds to portfolio
- **Sell properties**: Returns market-adjusted sale price
- **Upgrade properties**: Up to level 3, each upgrade costs 15-45% of purchase price and boosts rent 30%
- **Loans**: Take up to 65% of net worth, 6.5% annual interest
- **Rent collection**: Prorated by elapsed time (1 real minute = 1 game day)
- **Net worth**: Cash + property values × market multipliers − debt
- **Leaderboard**: Top 10 scores persisted in localStorage

### Property Database (PropertyDatabase.js)

16 properties across 3 types and 3 tiers:

| Type | Count | Price Range | Monthly Rent |
|------|-------|-------------|--------------|
| Residential | 6 | $145K – $1.4M | $1,150 – $11,000 |
| Commercial | 6 | $210K – $2.8M | $2,100 – $32,000 |
| Luxury | 5 | $3.2M – $18M | $24,000 – $175,000 |

### Negotiation Battle (GameLevelPropertyDeal.js)

Extends the PeppaBattleLevelBase pattern with real estate theming:

- **Laser system**: Player fires "offers" (cyan) at seller, seller fires "counter-offers" (red)
- **Inspection coins**: Collect 📄 documents scattered on the ground for 1% price discount each
- **Seller HP bar**: Deplete to close the deal at discount
- **Shield system**: Player loses "shields" when hit (varies by difficulty tier)
- **Difficulty scaling**:
  - Residential: 10 HP seller, 4 shields, 1.8s counter interval
  - Commercial: 15 HP seller, 3 shields, 1.3s counter interval
  - Luxury: 20 HP seller, 2 shields, 1.0s counter interval

### Market Hub (GameLevelMarketHub.js)

The main game world with 6 systems running simultaneously:

1. **Portfolio HUD** (top-right): Real-time net worth, cash, income, debt, market prices
2. **Market ticker** (bottom): Scrolling animated price feed + event announcements
3. **Event banner**: Animated notification when market events trigger
4. **Rent coins**: Floating animated coins spawn every 2.5s from owned properties
5. **NPC labels**: Floating labels above each NPC with name + role
6. **Win condition check**: Monitors net worth → triggers WinScreen at $5M

## Progression System

```
$500K cash
    │
    ▼
Buy Residential Properties (Sarah)
    │
    ▼ (3 properties owned)
Commercial Market Unlocked (Marcus)
    │
    ▼ (6 properties owned)
Luxury Market Unlocked (Victoria)
    │
    ▼ ($5M net worth)
🏆 TYCOON STATUS ACHIEVED
```

## Win Screen (GameLevelWinScreen.js)

- Full stats breakdown (8 stat cards)
- Portfolio listing with monthly rent per property
- Top-10 leaderboard (localStorage-persisted, cross-session)
- Canvas market history chart (3 lines: residential/commercial/luxury)
- "Play Again" button resets portfolio
