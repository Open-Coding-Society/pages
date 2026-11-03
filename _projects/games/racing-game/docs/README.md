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
- Autumn level: race the blue car by steering the red car with **WASD**. Choose **Easy** for a
  deliberately slow outside-edge route with a randomly positioned novice-style loop each lap,
  **Medium** for the simpler racing line, or **Hard** for the offline-trained genetic-algorithm
  controller on the setup screen before the race begins. Easy and Medium wait until the red car
  first moves; Hard starts as soon as the difficulty is selected. Every bot continues racing if the
  player stops. Bot controls always follow its route using the shared car physics; collision or a
  stall never triggers scripted reverse movement.
  Route progress catches up when a car passes multiple waypoints, and both cars stop when the
  official winner is decided.
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
It evaluates three-lap races against the spline barriers, box, and cone, with the same car
dimensions and steering response as the game. It ranks clean completed races ahead of all runs
with barrier or obstacle contacts, then minimizes race time and performs a coordinate-refinement
pass on the best genome. Hard is also trained and scored against deterministic small pushes, and
its route follower re-localizes to the nearby forward route after being nudged off course. Easy
performs a forward 360-degree spin after a cone collision, then resumes its route. The trainer
warm-starts from the currently saved genome and writes the best genome back to
`levels/AutumnBotGenome.js`, which the racing-game build copies with the other level scripts.
Use `--refine=false` to skip the slower local coordinate-refinement pass during a long robust search.
A smaller search is useful for a quicker local run:

```sh
node _projects/games/racing-game/scripts/train-autumn-bot.mjs --generations=32 --population=32 --seed=20261030
```

You can spend more local CPU time for a larger search, for example:

```sh
node _projects/games/racing-game/scripts/train-autumn-bot.mjs --generations=300 --population=96 --seed=20261030
```

The offline simulator and both cars share the same acceleration, braking, coasting, reverse,
steering, maximum-speed, and hitbox settings. It uses the same autumn spline geometry and push-out
response as the game. Clean three-lap finishes rank ahead of collisions, and the fastest clean
finish receives the highest score. Difficulty is chosen on a paused setup screen before the race
starts; movement keys are ignored until a choice is made. The simulator still approximates browser
timing and collisions, so verify a newly trained genome in the game before publishing it. A genetic
algorithm finds the best controller in its search, not a guaranteed globally optimal route.
