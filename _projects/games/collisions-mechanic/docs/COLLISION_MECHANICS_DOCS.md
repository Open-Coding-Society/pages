---
layout: post
title: Adventure Game - Sample Level Documentation
description: Example of how to document a level while building a team gamify project
category: Gamify
breadcrumb: true
permalink: /gamify/gamelevelwater
---

## Documentation Entry

### Goal

Teach the class what collision mechanics are, how to use them, and how to successfully implement them into their own game.

### Files Added 

- `_projects/games/collisions-mechanic/notebook.src.ipynb`
- `_projects/games/collisions-mechanic/levels/ExampleEnemy.js`
- `_projects/games/collisions-mechanic/levels/GameLevelCollisionMechanicsLessonLevel.js`
- `_projects/games/collisions-mechanic/levels/GameLevelPatrollingGuard.js`
- `_projects/games/collisions-mechanic/levels/ GameLevelPatrollingGuardBroken.js`
- `_projects/games/collisions-mechanic/levels/Guard.js`
- `_projects/games/collisions-mechanic/levels/GuardBroken.js` 
- `_projects/games/collisions-mechanic/images/alien_planet.jpg`
- `_projects/games/collisions-mechanic/images/astro.png`
- `_projects/games/collisions-mechanic/images/ufos.png`

### What We Implemented

We implemented couple game runner cells to demonstrate how collision mechanics work and how to add it into someone's game. We didn't just explain what they are, we showed how to add applications of them, for example adding guards that can kill the player.

### How We Tested

- Ran `make dev`
- Used localhost to confirm our changes were what we wanted before pushing to github.
- Checked that the gamerunner cells worked in localhost and deployed.
- Made sure the sample games had application of collision mechanics (guards, ground, etc.)
- Confirmed that the collision mechanics in the gamerunner was correctly implemented and worked fine.

### What We Learned

- A level is easier to maintain and control when all of the files are in the same project
- Taking your time to document all of your progress slowly over time helps show your progress and document all the small decisions made along the way to get to the final result
- Documentation is a part of the building process, not extra work.

### Next Step

Helping other groups implement collision mechanics and adding better implementations of it in our own game.


