---
layout: post
author: Nikhil, Rohan, Pranav, Aditya, Shriya, Samhita
permalink: /breakout
---


<style>
/* Hub container */
.lesson-hub {
  font-family: "Segoe UI", Roboto, sans-serif;
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px;
}


/* Titles */
.hub-title {
  display: block !important;
  text-align: center;
  font-size: 2.2rem;
  margin-bottom: 10px;
  margin-top: 1px !important;
}


.card-title {
    color: black !important;
}


.card-description {
    color: #303030ff !important;
}


.hub-subtitle {
  text-align: center;
  font-size: 1.1rem;
  margin-bottom: 40px;
}


/* Card container */
.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 25px;
}


/* Individual lesson card */
.lesson-card {
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 20px;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}


.lesson-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}


/* Difficulty badges */
.difficulty-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 0.85rem;
  padding: 5px 12px;
  border-radius: 20px;
  font-weight: bold;
  color: #fff;
}


.difficulty-beginner {
  background: #38a169; /* green */
}


.difficulty-intermediate {
  background: #ed8936; /* orange */
}


.difficulty-advanced {
  background: #e53e3e; /* red */
}


/* Features list */
.card-features {
  margin: 15px 0;
  padding-left: 20px;
}


.card-features li {
  margin-bottom: 8px;
  list-style: disc;
  color: #303030ff !important;
}


/* Buttons */
.card-buttons {
  margin-top: auto;
  display: flex;
  gap: 12px;
}


.btn {
  display: inline-block;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  text-decoration: none;
  transition: background 0.2s ease, transform 0.2s ease;
  font-weight: 600;
}


.btn-lesson {
  background: #4c51bf;
}


.btn-game {
  background: #2b6cb0;
}


.btn:hover {
  transform: scale(1.05);
  opacity: 0.9;
}
</style>


<div class="lesson-hub">
    <h1 class="hub-title">🎮 Breakout Game Learning Hub</h1>
    <p class="hub-subtitle">
        Master game development through two comprehensive learning paths. Start with functional programming fundamentals, then advance to object-oriented design patterns.
    </p>

    <div class="cards-container">
        <!-- Card 1: Functional Breakout -->
        <div class="lesson-card">
            <div class="difficulty-badge difficulty-beginner">Beginner</div>
            <div class="card-header">
                <h2 class="card-title">🛠️ Functional Breakout</h2>
                <p class="card-description">
                    Learn the fundamentals of game development using functional programming. Build your breakout game step-by-step with interactive demos and hands-on coding.
                </p>
            </div>
           
            <ul class="card-features">
                <li>Paddle movement and controls</li>
                <li>Ball physics and bouncing</li>
                <li>Power-ups and special effects</li>
                <li>Interactive quizzes and whiteboard</li>
            </ul>


            <div class="card-buttons">
                <a href="{{site.baseurl}}/functionalbreakoutlesson" class="btn btn-lesson">📚 Start Lessons</a>
                <a href="{{site.baseurl}}/functionalbreakoutgame" class="btn btn-game">🎮 Play Game</a>
            </div>
        </div>


        <!-- Card 2: OOP Breakout -->
        <div class="lesson-card">
            <div class="difficulty-badge difficulty-intermediate">Intermediate</div>
            <div class="card-header">
                <h2 class="card-title">🏗️ OOP Breakout</h2>
                <p class="card-description">
                    Advance to object-oriented programming principles. Learn inheritance, composition, and encapsulation while building a sophisticated breakout game.
                </p>
            </div>
           
            <ul class="card-features">
                <li>Classes and inheritance patterns</li>
                <li>GameObject composition</li>
                <li>Advanced game mechanics</li>
                <li>Code architecture and design</li>
            </ul>


            <div class="card-buttons">
                <a href="{{site.baseurl}}/oopbreakoutlesson" class="btn btn-lesson">📚 Start Lessons</a>
                <a href="{{site.baseurl}}/oopbreakoutgame" class="btn btn-game">🎮 Play Game</a>
            </div>
        </div>
    </div>


    <div style="text-align: center; margin-top: 50px; padding: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 15px; color: white;">
        <h3 style="margin-bottom: 15px;">🎯 Learning Path Recommendation</h3>
        <p style="margin: 0; opacity: 0.9;">
            New to programming? Start with <strong>Functional Breakout</strong> to learn the basics.
            Ready for advanced concepts? Jump into <strong>OOP Breakout</strong> for sophisticated design patterns.
        </p>
    </div>
</div>

