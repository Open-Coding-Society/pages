---
layout: post
title: Trading Bot (Bank Game) - Overview
description: Complete documentation for the gamified trading system with indicators, ML, sentiment analysis, backtesting, and paper trading
category: Gamify
breadcrumb: true
permalink: /gamify/fortuneFinders/quant/overview
---

## Directory Structure

Project-facing source is embedded as a web application with modular frontend + backend API integration.

```text
Frontend (Jekyll Page / UI)
├── App Container (#App)
├── Tabs/
│   ├── Data
│   ├── Indicators
│   ├── ML
│   ├── News
│   ├── Backtest
│   └── Paper Trade
├── Tutorial System
├── Charts (Plotly)
└── Styling (CSS Variables + Components)

Backend (API Endpoints)
├── /bank/quant/market/history
├── /bank/quant/indicators/calc
├── /bank/quant/ml/train
├── /bank/quant/news/*
├── /bank/quant/backtest/*
└── /bank/portfolio/*
```

## System Architecture

- Market Data Service → OHLCV data  
- Indicator Service → MA, RSI, MACD, BB  
- ML Service → Linear Regression, Random Forest, LSTM  
- News Service → sentiment + headlines  
- Backtest Service → strategy simulation  
- Portfolio Service → paper trading  

## Build + Dev Workflow

```bash
bundle exec jekyll serve
```

Backend:

```bash
./mvnw spring-boot:run
```

## Application Flow

1. Load Data  
2. Indicators  
3. Train ML  
4. News  
5. Backtest  
6. Paper Trade  

## Notes

- Full trading pipeline (data → ML → execution)
- Built as both simulator + teaching system
