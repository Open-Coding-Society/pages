---
layout: post
title: Trading Bot (Bank Game) - Overview
description: Overview of the Fortune Finders quant trading UI and its Spring backend dependencies
category: Gamify
breadcrumb: true
permalink: /gamify/fortuneFinders/quant/overview
---

## Quick summary

Fortune Finders and the quant bot are **static Jekyll pages**. They call a **Spring Boot API** at `/bank` and `/bank/quant/*` (default `http://localhost:8585` in dev). Market prices use server-side config (`MARKET_PROVIDER`, optional `ALPHAVANTAGE_API_KEY`); Yahoo mode needs no key. News sentiment is currently stubbed on the backend.

---

## Fortune Finders pages

| Page | Link |
|------|------|
| Game | [Fortune Finders v1.1](/gamify/fortuneFindersv1-1) |
| Quant bot | [Trading bot](/gamify/fortuneFinders/quant) |
| Quant lesson | [Coding behind quant](/gamify/fortuneFinders/quant-lesson) |
| Futures mini-game | [Futures](/gamify/fortuneFinders/futures) |
| Futures lesson | [Coding behind futures](/gamify/fortuneFinders/futures-lesson) |
| Options lesson | [Coding behind options](/gamify/fortuneFinders/options-lesson) |

Canonical URLs are defined in [`js/routes.js`](../js/routes.js) (`FF_ROUTES`). See [LINKS.md](../LINKS.md) for the full route map.

---

## Quant bot UI (frontend)

The trading bot page is a single-page app with tabs:

| Tab | Purpose |
|-----|---------|
| Data | Load OHLCV history and price/volume charts |
| Indicators | MA, RSI, MACD, Bollinger Bands |
| ML | Train models (Linear Regression, Random Forest, LSTM) |
| News | Sentiment + headlines (backend stub today) |
| Backtest | Strategy simulation |
| Paper Trade | Simulated buy/sell + portfolio |

**Typical flow:** Load Data → Indicators → Train ML → News → Backtest → Paper Trade

Charts use Plotly; styling uses CSS variables. A built-in tutorial walks through each step.

---

## How to run locally

**Site (Jekyll):**

```bash
bundle exec jekyll serve
```

**Backend (Spring, separate repo — `pagesBackend`):**

```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
export MARKET_PROVIDER=yahoo
./mvnw spring-boot:run
```

The quant page picks the API base in JavaScript (e.g. `http://localhost:8585` on localhost). No market-data API keys belong in this frontend repo.

---

## Backend architecture

The frontend only calls HTTP endpoints. Logic lives in Spring:

| Layer | Role |
|-------|------|
| Market data | OHLCV bars for charts and trading |
| Indicators | MA, RSI, MACD, BB |
| ML | Model training and predictions |
| News | Sentiment + headlines (stub) |
| Backtest | Strategy simulation |
| Portfolio | Paper trading balances and orders |

Main API paths used by the quant UI:

- `/bank/quant/market/history`
- `/bank/quant/indicators/calc`
- `/bank/quant/ml/train`
- `/bank/quant/news/*`
- `/bank/quant/backtest/*`
- `/bank/quant/paper/*`
- `/bank/byPerson`, deposit/withdraw (bank balance)

---

## What the backend must include

You cannot copy only `mvc/bank/` to a new server and expect the quant bot to work. Required pieces:

### 1. `mvc/bank/` — accounts and API entry

- `BankApiController` — routes the quant UI uses (`/bank/byPerson`, `/bank/quant/*`, etc.)
- `Bank` entity, repositories, loan/risk services
- **Why:** per-user money and game state

### 2. `mvc/quant/` — trading engine (required)

`BankApiController` depends on quant services. Without this package the app will not compile.

| Service | UI feature |
|---------|------------|
| `MarketDataService` | Price charts, history, paper-trade pricing |
| `IndicatorService` | MA / RSI / Bollinger / MACD |
| `NewsService` | News sentiment panel |
| `MLService` | Train / predict |
| `BacktestService` | Strategy backtests |
| `PaperTradeService` | Paper buy/sell + portfolio |

### 3. `market-data/*.csv` — offline fallback

Sample OHLCV under `classpath:market-data/` (e.g. AAPL, TSLA) when live providers fail.

### 4. Security + CORS

- Quant routes must be reachable from your Jekyll origin (e.g. `http://localhost:4000`, GitHub Pages URL)
- `SecurityConfig` typically permits `/api/bank/**` for unauthenticated quant requests in dev

### 5. Database + `Person`

Quant calls use `personId`. `/bank/byPerson` and paper trading need a real `Person` + `Bank` row (e.g. SQLite in dev).

### 6. Beyond quant (full Fortune Finders / casino)

| Frontend area | Backend (examples) |
|---------------|-------------------|
| Map (`FinTech.js`) | `/bank/{id}/npcProgress`, quest routes |
| Bank / loans / analytics | `/bank/analytics/*`, `/bank/requestLoan` |
| Casino | Blackjack, poker, mines, dice + balance |
| Stocks / crypto pages | Separate stock/crypto controllers |

Moving only `bank/` covers quant + basic deposit/withdraw, not the full RPG or casino.

### 7. Build dependencies

ML uses Weka and Smile in the Spring `pom.xml` — server-side only, not in PRpages.

---

## Market data API keys (backend only)

Configure on the **Spring server** (`pagesBackend`), not in PRpages.

| Setting | Env var | Default | Purpose |
|---------|---------|---------|---------|
| Provider | `MARKET_PROVIDER` → `market.provider` | `auto` | `auto` \| `yahoo` \| `alphavantage` |
| Alpha Vantage key | `ALPHAVANTAGE_API_KEY` → `alphavantage.apiKey` | (empty) | Required if provider is `alphavantage` |
| Local CSV fallback | `market.local.enabled` | `true` | Use `classpath:market-data/<TICKER>.csv` |

**Provider behavior:**

- **yahoo** — no API key; unofficial Yahoo HTTP endpoints (good for local dev)
- **alphavantage** — requires Alpha Vantage key
- **auto** — Alpha Vantage if key exists, else Yahoo, then local CSV if enabled

**Examples:**

```bash
# Yahoo (no key)
export MARKET_PROVIDER=yahoo
./mvnw spring-boot:run
```

```bash
# Alpha Vantage
export ALPHAVANTAGE_API_KEY=your_key_here
export MARKET_PROVIDER=alphavantage
./mvnw spring-boot:run
```

Or in `pagesBackend/.env` (do not commit secrets):

```properties
market.provider=yahoo
# alphavantage.apiKey=YOUR_KEY
# market.provider=auto
```
For alpha advantage a new account must be created to obtain a key and the use is very limited. Highly recommended to use yahoo finance.

**News sentiment** — no API key today; `NewsService` returns sample data in memory.

**ML / indicators / backtest** — no external API key; runs on server-side bars.

Other keys in `pagesBackend/.env` (Gemini, OpenAI gamify, GitHub) are documented in `pagesBackend/README.md` and are **not** used for `/bank/quant/market/history`.

---

## Frontend fallback (when backend is down)

The quant bot page can load **recent AAPL placeholder bars** when `/bank/quant/market/history` fails (live Nasdaq fetch, then embedded snapshot). See `_posts/gamify/2026-02-09-quantbot.md` — useful for demos when Spring is offline.

---

## Project layout (PRpages)

| Path | Role |
|------|------|
| `02-v1-FortuneFinders.md` | Main game entry |
| `js/FinTech.js`, `routes.js`, `paths.js` | Game logic + URLs |
| `levels/` | Map levels (Airport, Futures, Options, Wallstreet) |
| `posts/` | Quant bot, futures mini-game, lessons |
| `docs/README.md` | This overview (also published at quant/overview) |
| `images/` | Futures SVG assets |

Shared game engine: `assets/js/GameEnginev1.1/essentials/`.
