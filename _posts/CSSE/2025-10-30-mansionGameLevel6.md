---
layout: post
title: Mansion Game - Level 6
comments: True
permalink: /gamify/blogs/mansion6
authors: Anish G, Samarth H, James B, Pranay K, Vihaan B, Krish K
---

# Level 6 Game Blog

This is the final level of our class game, level 6. Created by the Tinkerers (CSSE Period 1, Tri 1 of 2025).

## Game Overview

#### Introduction

This level will provide the player with the final key that they need to escape the haunted mansion. However, unlike the other levels where there were games or puzzles to be solved, this level offers a twist: A boss fight.

<details>
    <summary><strong>Rooms</strong></summary>
    This level has 2 rooms: an intro chamber and the boss room.
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Intro Chamber</title>
</head>
<body>

<h5>Intro Chamber</h5>

<p>
    This intro chamber is mostly empty, only having torches and chairs in the background. However, it does have a zombie that will speak if "e" is clicked.
</p>

<p>
    <img src="{{site.baseurl}}/images/MansionGameBlog/IntroChamberWithStuff.png" alt="Intro Chamber with Items">
</p>

<p>
    As you can see in the image, the room is mostly barren, as that is a trend we noticed right before a boss fight. There is also an arrow pointing towards the door in case the player missed that somehow. This room has no fights, as it would be unfair to hurt the player before the big boss fight.
</p>

<h4>Zombie NPC</h4>

<p>
    In the image, you can see a zombie NPC in the room. This NPC doesn't attack. However, when you go up to him and click "e", he gives dialogues trying to demotivate you.
</p>

<p>
    <img src="{{site.baseurl}}/images/MansionGameBlog/ZombieDialogueBlog.png" alt="Zombie Dialogue">
</p>

<p>The zombie has a selection of dialogue to say:</p>

<ul>
    <li>"I heard the boss is waiting for you..."</li>
    <li>"Enter if you dare... he's waiting for you..."</li>
    <li>"I heard the Reaper himself was in there."</li>
    <li>"The Reaper'll get you good."</li>
    <li>"You have no chance... his power is unstoppable..."</li>
    <li>"No one has survived a battle against the Reaper."</li>
    <li>"Haha! You want to battle my boss? You'll die within the first minute..."</li>
    <li>etc.</li>
</ul>

<h4>Cutscene into Boss Room</h4>

<p>
    When the player walks up to the door and clicks "e", a prompt shows up asking the player if they are sure that they want to go through. If they click "Not ready", the prompt closes. However, if they click "Enter the doors", a small cutscene shows up, in which the words "YOUR FATE HAS BEEN SEALED" get written on the screen and then are deleted.
</p>

<p>
    <img src="{{site.baseurl}}/images/MansionGameBlog/CutsceneToBoss.png" alt="Cutscene to Boss">
</p>

<p>
    After the words disappear, you are transported into the second room. This is the boss room.
</p>

<h4>Boss Room</h4>

<p>
    In this room, there is the actual boss fight. This boss fight is designed to be hard to the point that the player takes multiple attempts to beat it.
</p>

<p>ADD BOSS ROOM IMAGE HERE WHEN FINISHED</p>

</body>
</html>


</details>

<details>
  <summary><strong>The Reaper</strong></summary>

  <p>The boss of this level is the skeleton reaper.</p>

  <img src="{{site.baseurl}}/images/mansionGame/Reaper.png" alt="Reaper">

  <p>As you can see in the image, the boss is a hooded skeleton with 4 floating arms around him. In the game, he chases you around and if he collides with you, you will die.</p>

  <h4>Attacks ⚔️</h4>

  <p>
    The boss uses 2 long range weapons in this fight—arrows and fireballs. We were planning to implement a scythe, but were unable to do so within the time allotted for this project.
  </p>

  <img src="{{site.baseurl}}/images/mansionGame/arrow.png" alt="Arrow">
  <img src="{{site.baseurl}}/images/mansionGame/fireball.png" alt="Fireball">
  <img src="{{site.baseurl}}/images/MansionGameBlog/ScytheForBlog.jpg" alt="Scythe">

  <p>
    The arrow and fireball just move straight towards where the player was when it was shot. The scythe is more complicated as it is an elliptical path towards the player. This path is shown
    <a href="https://www.desmos.com/calculator/9nzlkqn87k" target="_blank" rel="noopener noreferrer">here</a>.
  </p>

</details>

<h2>Our team's challenges 💀</h2>

<p>
  The OpenCS Game Engine is an amazing game engine, but it's not designed for a fast-paced combat level like this. It is designed for adventure-like games, so creating a boss fight with it was a unique challenge.
</p>
<!-- ADD ONTO CHALLENGES -->
<ul>
    <li>Often times, we needed to read through the game engine's code to find bugs.</li>
    <li>We ran out of GitHub Copilot uses, which slowed down development</li>
    <li>We had lots of issues with creating the equation to calculate the scythe's elliptical orbit.</li>
</ul>

<h2>Organization/Planning 📓</h2>

<p>
  We did the preliminary ideation for our level on
  <a href="https://docs.google.com/document/d/1Mc77JEsYcTKB2S5DKD96scVaUmgesCg-mYmKgBUQ8_U/edit?usp=sharing" target="_blank" rel="noopener noreferrer">
    this Google Doc
  </a>.
  Then, we took our ideas and put them onto a kanban board on GitHub which you can view
  <a href="https://github.com/orgs/CompSciTeam/projects/17" target="_blank" rel="noopener noreferrer">here</a>.
</p>

<p>
  We assigned team members to each task to keep ourselves organized, and we marked things as completed/in progress/scrapped to know what we had to do next. We also kept track of our problems and objectives each time we encountered issues. Below is an example of issues we identified and debugged on 11/2/2025:
</p>

<img src="{{site.baseurl}}/images/MansionGameBlog/ExampleGitHubIssue.png" alt="Example GitHub Issue">


## Key Files 🔑
All of the code for all of the levels were in /assets/js/mansionGame.

- `/assets/js/mansionGame/mansionLevel6.js` and `/assets/js/mansionGame/mansionLevel6_BattleRoom.js` were where we wrote the logic for each room, and defined the background and objects for each.
- In `/assets/js/mansionGame/CustomGameClasses/`, we made additions to the game engine by creating:
  - `FightingPlayer.js` is a special type of `Player` that can shoot a projectile by pressing SPACE. We were promised this file by the Penguins team but they abandoned us so we made it ourselves :(
  - `Boss.js` is where we define the code for the Reaper (extends Enemy class)
  - `Projectile.js` is where we define the code for the arrows and fireballs and their collision.
  - `Boomerang.js` is a type of projectile that travels in an ellipse back to its source. We ran out of time to implement this though.
  - `DeathScreen.js` and `EndScreen.js` are functions to handle the different screens for us.
  - `HealthBars.js` draws the boss health and player health to the screen.
  - `Arm.js` is a scrapped boss mechanic. We don't use this file.
- All of the images for our game are in `/images/mansionGame`
- All of the sounds for our game are in `/assets/sounds/mansionGame`