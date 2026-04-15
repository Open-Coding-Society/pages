---
layout: post
codemirror: true
title: Real Estate Tycoon
description: >
  A three-level OCS GameEngine adventure — brokerage, open house, and closing — with NPC dialogues,
  clicker kiosks, coins, and scripted level transitions.
author: OCS Pages
permalink: /real-estate-tycoon
toc: false
comments: true
---

## Play

Use **WASD** to move. Walk into characters and press **E** to interact.

- **Level 1 — Brokerage:** Talk to the mentor and loan officer, collect earnest-money coins, tap the **Lead Gen** kiosk, then take the **Town Car** to the listing.
- **Level 2 — Open House:** Meet the seller and inspector, grab the bonus coin, tap refreshments, then take **Escrow** to closing.
- **Level 3 — Closing:** Celebrate with the closer and collect the commission coin.

Use the **level dropdown** in the runner anytime to jump back and practice.

{% capture challenge %}
Ship a full deal cycle: office → showing → closing. Every mechanic here maps to the GameEngine stack — `GameEnvBackground`, `Player`, `Npc` (DialogueSystem buttons), `Clicker`, `Coin`, and multi-level `GameControl` transitions wired in `GameLevelRealEstatePack.js`.
{% endcapture %}

{% capture code %}
import GameControl from '/assets/js/GameEnginev1.1/essentials/GameControl.js';
import { gameLevelClasses } from '/assets/js/realEstateGame/GameLevelRealEstatePack.js';

export { GameControl };
export { gameLevelClasses };
{% endcapture %}

{% include game-runner.html
   runner_id="real-estate-tycoon"
   challenge=challenge
   code=code
   height="520px"
   editor_height="220px"
%}

## Framework map

| Piece | Role in this game |
| ----- | ----------------- |
| `GameEnvBackground` | Office / mansion / title backdrops |
| `Player` | Your agent (`chillguy` sprite) |
| `Npc` | Broker, banker, town car, seller, inspector, escrow portal, closer |
| `DialogueSystem` (via `Npc`) | Branching buttons to advance levels |
| `Clicker` | Lead-gen kiosk + refreshment table |
| `Coin` | Earnest money + commission pickups |
| `GameControl` + 3 level classes | Hub → open house → closing |

Source: `assets/js/realEstateGame/GameLevelRealEstatePack.js`.
