---
layout: post
title: CS Pathway Game - Team Contributions
description: An overview of our mansion game, behind the scenes
category: Gamify
breadcrumb: true
permalink: /kanbans2026
---

# Kanban Boards

Overall Kanban Board: <https://github.com/orgs/cssedelnortetri2027/projects/1>

# Racing Game

The tutorial course is a two-player race:

- Red car: steer with **WASD** and press **F** for a 30% speed boost lasting 3 seconds.
- Autumn level: race the blue car by steering the red car with **WASD**. Choose **Easy** for the
  simpler racing line or **Hard** for the offline-trained genetic-algorithm controller on the
  setup screen before the race begins.
- Other levels continue to use the arrow keys to control the blue car.

Each car's boost then recharges for 5 seconds. Its matching red or blue meter sits at the
corresponding edge of the screen and fills as the boost becomes available again.

### Training the autumn AI offline

The AI mode loads its saved genome from `levels/AutumnBotGenome.js`; players do not train it in the
browser. From the repository root, run:

```sh
node _projects/games/racing-game/scripts/train-autumn-bot.mjs
```

The trainer uses a deterministic seed and defaults to 80 generations of 48 candidate controllers.
It evaluates three-lap races, penalizes spline contacts, and warm-starts from the currently saved
genome. It writes the best genome back to `levels/AutumnBotGenome.js`, which the racing-game build
copies with the other level scripts. A smaller search is useful for a quicker local run:

```sh
node _projects/games/racing-game/scripts/train-autumn-bot.mjs --generations=32 --population=32 --seed=20261030
```

You can spend more local CPU time for a larger search, for example:

```sh
node _projects/games/racing-game/scripts/train-autumn-bot.mjs --generations=300 --population=96 --seed=20261030
```

The fitness function rewards completing three laps quickly and penalizes spline-barrier contacts;
incomplete races rank below completed ones. The offline simulator and both cars share the same
acceleration, braking, coasting, reverse, steering, maximum-speed, and hitbox settings. The simulator
uses the same autumn spline geometry and push-out response as the game. Difficulty is chosen on a
paused setup screen before the race starts; movement keys are ignored until a choice is made. The
simulator still approximates browser timing and collisions, so verify a newly trained genome in the
game before publishing it. A genetic algorithm finds the best controller in its search, not a
guaranteed globally optimal route.
