---
layout: base_chatadpt 
author: Nikhil, Rohan, Pranav, Aditya, Shriya, Samhita
permalink: oopbreakoutlesson
---

<link
   rel="stylesheet"
   href="https://cdn.jsdelivr.net/npm/rippleui@1.12.1/dist/css/styles.css"
/>

<style>
.cards-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin: 2rem 0;
}

.hub-title {
  display: block !important;
  text-align: center;
  font-size: 2.2rem;
  margin-bottom: 10px;
  margin-top: 1px !important;
}

.back-button {
  margin-bottom: 5px !important;
  text-align: center;
}

.card {
  background-color: white !important;
}

.card-header {
  color: black !important;
}

.text-content2 {
  color: black !important;
}

@media (max-width: 768px) {
  .cards-container {
    grid-template-columns: 1fr;
  }
}
</style>

<h1 class="hub-title">OOPs Breakout (3-Part Mini Lesson)</h1>
<p class="back-button"><a href="{{site.baseurl}}/hacks" style="text-decoration:none;color:#007acc;font-weight:bold;">Click here to go back to main page</a></p>
<br>

---

<br>

```mermaid
%%{init: {
  "flowchart": { "nodeSpacing": 70, "rankSpacing": 140, "curve": "linear" }
}}%%
flowchart LR
    A[OOP Mini-Lesson]

    %% invisible hubs to force a second tier (prevents squish)
    A --> H1(( ))
    A --> H2(( ))
    classDef ghost fill:transparent,stroke:transparent;
    class H1,H2 ghost;

    %% main branches (now split across two hubs)
    H1 --> L1[Lesson 1:<br/>Game Class & Inheritance]
    H1 --> L2[Lesson 2:<br/>Paddle Class]
    H1 --> L3[Lesson 3:<br/>Ball Class]
    H2 --> Activity[Whiteboard Activity]
    H2 --> Quizzes[Checkpoint Quizzes]

    %% Lesson 1 details
    L1 --> B1[Big Picture]
    L1 --> B2[GameObject Base]
    L1 --> B3[Child Classes]
    L1 --> B4[Game Conductor]

    %% Lesson 2 details
    L2 --> C1[Attributes]
    L2 --> C2[Methods]

    %% Lesson 3 details
    L3 --> D1[Constructor]
    L3 --> D2[Methods]

    %% Activity details
    Activity --> E1[Draw boxes]
    Activity --> E2[Show inheritance]
    Activity --> E3[Props inside,<br/>methods outside]

    %% Quiz details
    Quizzes --> F1[Inheritance vs Composition]
    Quizzes --> F2[Attributes vs Methods]
    Quizzes --> F3[Constructors & Ball]

    %% palette (same feel)
    style A fill:#e1f5fe,stroke:#000,stroke-width:2px,color:#000
    style L1 fill:#fff3e0,stroke:#000,color:#000
    style L2 fill:#f3e5f5,stroke:#000,color:#000
    style L3 fill:#e8f5e8,stroke:#000,color:#000
    style Activity fill:#fff8e1,stroke:#000,color:#000
    style Quizzes fill:#fce4ec,stroke:#000,color:#000
```

## Lesson Objectives:
  - Introduce object-oriented programming concepts in JavaScript
  - Explain the structure of the Breakout game using classes
  - Compare inheritance, composition, and encapsulation
  - Map game entities (Ball, Paddle, Brick, PowerUp) to class hierarchies
  - Discuss the role of the Game class as a coordinator
  - Prepare students for deeper OOP topics in subsequent lessons

<div class="cards-container">
	<div class="card card-image-cover">
		<div class="card-body">
			<h2 class="card-header">OOP Breakout: Lesson 1</h2>
			<p class="text-content2">The Game class & how inheritance works</p>
			<div class="card-footer">
				<a href="{{ site.baseurl }}/oopbreakoutlesson1"><button class="btn-secondary btn">Go to lesson →</button></a>
			</div>
		</div>
	</div>
	<div class="card card-image-cover">
		<div class="card-body">
			<h2 class="card-header">OOP Breakout: Lesson 2</h2>
			<p class="text-content2">The Paddle class: attributes vs. methods</p>
			<div class="card-footer">
				<a href="{{ site.baseurl }}/oopbreakoutlesson2"><button class="btn-secondary btn">Go to lesson →</button></a>
			</div>
		</div>
	</div>
	<div class="card card-image-cover">
		<div class="card-body">
			<h2 class="card-header">OOP Breakout: Lesson 3</h2>
			<p class="text-content2">The Ball class & constructors</p>
			<div class="card-footer">
				<a href="{{ site.baseurl }}/oopbreakoutlesson3"><button class="btn-secondary btn">Go to lesson →</button></a>
			</div>
		</div>
	</div>
	<div class="card card-image-cover">
		<div class="card-body">
			<h2 class="card-header">OOP Breakout: Expert</h2>
			<p class="text-content2">*Very difficult extra game & lesson (not on mindmap!)</p>
			<div class="card-footer">
				<a href="{{ site.baseurl }}/oopadv"><button class="btn-secondary btn">Go to lesson →</button></a>
			</div>
		</div>
	</div>
</div>

<br>

---

## ACTIVITY: Showcase your learning in the blackboard below. 
- Draw your “class” as a box → properties inside (like health, lives), methods outside (like move(), hitBrick()).
- Draw inheritance → a Paddle class, then draw a “PowerPaddle” subclass that has an extra feature (like shooting lasers).

<br>

<canvas id="c" width="680" height="500" style="border:1px solid #ccc"></canvas>

<script src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.js" integrity="sha512-hOJ0mwaJavqi11j0XoBN1PtOJ3ykPdP6lp9n29WVVVVZxgx9LO7kMwyyhaznGJ+kbZrDN1jFZMt2G9bxkOHWFQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

<script>
  const canvas = new fabric.Canvas('c');
  canvas.isDrawingMode = true; // enable free drawing
  canvas.freeDrawingBrush.color = "white";
  canvas.freeDrawingBrush.width = 5;
  document.addEventListener("keydown", e => {
    if(e.key === "r") canvas.freeDrawingBrush.color = "red";
    if(e.key === "b") canvas.freeDrawingBrush.color = "blue";
    if(e.key === "g") canvas.freeDrawingBrush.color = "green";
    if(e.key === "c") canvas.clear();
  });
</script>

<br>
Press `r` to change brush color to red.
Press `b` to change brush color to blue.
Press `g` to change brush color to green.
Press `c` to clear blackboard. 


# ✅ Checkpoint Quizzes

<div id="oop-breakout-quizzes">
<style>
  #oop-breakout-quizzes { --ok:#118a00; --bad:#b00020; }
  #oop-breakout-quizzes .quiz-card{
    background:#fff;border:2px solid #ddd;border-radius:14px;
    padding:1.2rem;margin:1.2rem 0;box-shadow:0 4px 12px rgba(0,0,0,.05);
    color:#000;
  }
  #oop-breakout-quizzes .quiz-title{font-size:1.2rem;font-weight:700;margin-bottom:.25rem}
  #oop-breakout-quizzes .quiz-sub{margin-bottom:.9rem;color:#333}
  #oop-breakout-quizzes .q{border-radius:10px;padding:.9rem;margin:.7rem 0;border:1px solid #eee}
  #oop-breakout-quizzes .q:nth-child(odd){background:#f7f3ff;}
  #oop-breakout-quizzes .q:nth-child(even){background:#f3fff7;}
  #oop-breakout-quizzes .prompt{font-weight:700;margin-bottom:.4rem}
  #oop-breakout-quizzes .option{display:flex;gap:.45rem;align-items:flex-start;margin:.3rem 0}
  #oop-breakout-quizzes button{
    background:#f7f7f7;color:#000;border:2px solid #000;
    border-radius:999px;padding:.45rem 1rem;
    font-weight:700;cursor:pointer;margin-top:.6rem
  }
  #oop-breakout-quizzes button:hover{background:#000;color:#fff}
  #oop-breakout-quizzes .feedback{margin-top:.5rem;font-weight:700}
  #oop-breakout-quizzes .feedback.ok{color:var(--ok)}
  #oop-breakout-quizzes .feedback.bad{color:var(--bad)}
  #oop-breakout-quizzes .score{margin-top:1rem;font-weight:800}
  #oop-breakout-quizzes code{
    background:#f4f4f4;color:#000;padding:2px 5px;border-radius:4px
  }
</style>


  <!-- Quiz 1 -->
  <div class="quiz-card" data-quiz="1">
    <div class="quiz-title">Lesson 1 Checkpoint</div>
    <div class="quiz-sub">Inheritance vs. Composition</div>
    <div class="q">
      <div class="prompt">1) Which classes inherit from <code>GameObject</code>?</div>
      <label class="option"><input type="checkbox" value="Ball">Ball</label>
      <label class="option"><input type="checkbox" value="Paddle">Paddle</label>
      <label class="option"><input type="checkbox" value="Game">Game</label>
      <label class="option"><input type="checkbox" value="Brick">Brick</label>
    </div>
    <div class="q">
      <div class="prompt">2) What is composition in the <code>Game</code> class?</div>
      <label class="option"><input type="radio" name="q2">Game extends GameObject</label>
      <label class="option"><input type="radio" name="q2">Game owns and manages Ball, Paddle, Bricks</label>
      <label class="option"><input type="radio" name="q2">Game overrides draw()</label>
    </div>
    <button class="check">Check Answers</button>
    <button class="clear">Clear</button>
    <div class="feedback"></div>
  </div>

  <!-- Quiz 2 -->
  <div class="quiz-card" data-quiz="2">
    <div class="quiz-title">Lesson 2 Checkpoint</div>
    <div class="quiz-sub">Attributes vs. Methods</div>
    <div class="q">
      <div class="prompt">1) Which of these are attributes of Paddle?</div>
      <label class="option"><input type="checkbox" value="width">width</label>
      <label class="option"><input type="checkbox" value="color">color</label>
      <label class="option"><input type="checkbox" value="draw()">draw()</label>
      <label class="option"><input type="checkbox" value="update()">update()</label>
    </div>
    <div class="q">
      <div class="prompt">2) Which method makes the paddle respond to keyboard input?</div>
      <label class="option"><input type="radio" name="q2p">reset()</label>
      <label class="option"><input type="radio" name="q2p">update()</label>
      <label class="option"><input type="radio" name="q2p">applyPowerUp()</label>
    </div>
    <button class="check">Check Answers</button>
    <button class="clear">Clear</button>
    <div class="feedback"></div>
  </div>

  <!-- Quiz 3 -->
  <div class="quiz-card" data-quiz="3">
    <div class="quiz-title">Lesson 3 Checkpoint</div>
    <div class="quiz-sub">Constructors & Ball</div>
    <div class="q">
      <div class="prompt">1) What does <code>super(x, y)</code> do in Ball’s constructor?</div>
      <label class="option"><input type="radio" name="q3a">Calls the Game class</label>
      <label class="option"><input type="radio" name="q3a">Calls GameObject constructor</label>
      <label class="option"><input type="radio" name="q3a">Sets speed to default</label>
    </div>
    <div class="q">
      <div class="prompt">2) What does <code>speedUp()</code> change?</div>
      <label class="option"><input type="radio" name="q3b">Ball size only</label>
      <label class="option"><input type="radio" name="q3b">Velocity magnitude</label>
      <label class="option"><input type="radio" name="q3b">Direction and color</label>
    </div>
    <button class="check">Check Answers</button>
    <button class="clear">Clear</button>
    <div class="feedback"></div>
  </div>
</div>

<script>
const answers = {
  1: {multi:["Ball","Paddle","Brick"],single:"Game owns and manages Ball, Paddle, Bricks"},
  2: {multi:["width","color"],single:"update()"},
  3: {multi:[], single:["Calls GameObject constructor","Velocity magnitude"]}
};

document.querySelectorAll('#oop-breakout-quizzes .quiz-card').forEach(card=>{
  card.querySelector('.check').onclick=()=>{
    let id=card.dataset.quiz;
    let fb=card.querySelector('.feedback');
    let correct=true;
    if(id=="1"){
      let chosen=[...card.querySelectorAll('input[type=checkbox]:checked')].map(x=>x.value);
      if(JSON.stringify(chosen.sort())!==JSON.stringify(answers[1].multi.sort())) correct=false;
      let radio=card.querySelector('input[name=q2]:checked');
      if(!radio||radio.parentNode.textContent.trim()!==answers[1].single) correct=false;
    }
    if(id=="2"){
      let chosen=[...card.querySelectorAll('input[type=checkbox]:checked')].map(x=>x.value);
      if(JSON.stringify(chosen.sort())!==JSON.stringify(answers[2].multi.sort())) correct=false;
      let radio=card.querySelector('input[name=q2p]:checked');
      if(!radio||radio.parentNode.textContent.trim()!==answers[2].single) correct=false;
    }
    if(id=="3"){
      let r1=card.querySelector('input[name=q3a]:checked');
      let r2=card.querySelector('input[name=q3b]:checked');
      if(!r1||r1.parentNode.textContent.trim()!==answers[3].single[0]) correct=false;
      if(!r2||r2.parentNode.textContent.trim()!==answers[3].single[1]) correct=false;
    }
    fb.textContent=correct?"✅ Correct!":"❌ Try again.";
    fb.className="feedback "+(correct?"ok":"bad");
  };
  card.querySelector('.clear').onclick=()=>{
    card.querySelectorAll('input').forEach(x=>x.checked=false);
    let fb=card.querySelector('.feedback'); fb.textContent="";
  };
});
</script>

---

## Wrap-up: how the pieces fit

* **Inheritance:** `Ball`, `Paddle`, `Brick`, `PowerUp` extend `GameObject` to share position and override `draw/update`.&#x20;
* **Composition:** `Game` builds the world—instantiates objects, tracks score/lives/level, and runs the loop.&#x20;