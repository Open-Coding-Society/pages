---
layout: post
title: Adventure Game - Platformer Level Documentation
description: Example of how to document a level while building a team gamify project
category: Gamify
breadcrumb: true
permalink: /gravity_blog
---


## Steps


First, we needed a level for platformers. Our current level didn't feature much, if any, gravity. So the first step was to make a level that featured gravity. So we made a level that was fully a platformer game, with spikes, moving platforms, and a flag at the end. After doing this, we split up the gravity into multiple pieces and explained each piece. That’s it for the lesson.


The next step was implementing other teams’ lessons. The first one we added was the music. This one was pretty simple. All we had to do was copy the file that they had, add a few lines to the gamerunner, and change the music that is loads. In our case, we needed a more dark, spacey music.


The next implementation was enemy death. For this one, we decided to add it to the meteor level, where meteors fly at you from the right. Since the main character is a spaceship, we made it so the spaceship could shoot lasar beams at the meteors to destroy them. However, if you were to shoot all four of the meteors, there would be no more threat. So we made it so when the meteor is destroyed, it comes back in the next cycle. 


The last implementation that we did was local storage. That one was also added to the platformer level. For this one, we added coins that if collected, would add to the leaderboard. Then you could save those scores. This one was pretty simple. 


There were a lot of bugs in this process, as there should. Specific bugs include the gamerunner not working, coderunner not working, or the page not loading at all. These were fixed, and some actually lead to a better lesson.


## Lesson Focus


This lesson used astroplatformer.js as the base for the lesson, as it had the platformer feature we were teaching.


### Goal


Our goal was to teach our classmates how to make a functional platformer game with good gravity that makes logical sense


### Files Added


- `_projects/astronaut-platformer-game/levels/astroplatformer.js`
- `_projects/astronaut-platformer-game/levels/astromaze.jpeg`
- `_projects/astronaut-platformer-game/levels/astrometeor.png`
- `_projects/astronaut-platformer-game/levels/astrodeath.png`
- `_projects/astronaut-platformer-game/levels/astrostory.png`
- `_projects/astronaut-platformer-game/levels/astromusic.png`


### What We Implemented


- Added a planet background using `GameEnvBackground`
- Configured Astronaut as the main player
- Added spikes as enemy objects
- Added platform interactions and movement setup
- Kept all assets inside the `_projects/astronaut-platformer-game` structure


### How We Tested


- Ran `make dev`
- Opened the local site and loaded the platformer lesson
- Checked that the background loaded correctly
- Verified the player sprite rendered and moved
- Confirmed enemy/NPC objects appeared in the level
- Made sure the gamerunner cells worked
- Made sure the coins could be collected
- Made sure music could be played


### What We Learned


- A level is easier to maintain when assets and code stay grouped by project
- Documentation is important to track how code works and the process that is takes
- Even when doing something as simple as gravity, the code can get complex and must be broken down to ensure that classmates understand


### Next Step


Help classmates implement our lesson into their levels





