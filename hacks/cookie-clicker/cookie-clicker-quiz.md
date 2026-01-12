---
layout: lessonbase
title: Local Storage in Cookie Clicker
permalink: /cookie-clicker-game-docs/quiz/
sidebar: true
wide: true
sidebar_title: Cookie Clicker
lesson_links: [{url: /cookie-clicker-game-docs, text: 1. Introduction}, {url: /cookie-clicker-game-docs/oop, text: 2. OOP}, {url: /cookie-clicker-game-docs/class-architecture, text: 3. Classes}, {url: /cookie-clicker-game-docs/localstorage, text: 4. Localstorage},{url: /cookie-clicker-game-docs/quiz, text: 5. OOP Quiz}]
enable_progress: true
---
# Quick OOP Quiz: JS Classes 🎯

Test your knowledge about JavaScript classes.

<div id="quiz-root" style="margin-top:1rem;">
  <form id="quizForm"></form>

  <div style="margin-top:.5rem;">
    <button id="quizSubmit" type="button">Check</button>
    <button id="quizReset" type="button" style="margin-left:.5rem;">Reset</button>
  </div>

  <div id="quizResult" style="margin-top:.75rem;"></div>
</div>

<script>
(function () {
  const QUESTIONS = [
    {
      q: "What does a constructor do in a class?",
      choices: [
        "Initializes a new instance's state",
        "Makes a static method",
        "Imports a parent class",
        "Deletes an object from memory"
      ],
      answer: 0
    },
    {
      q: "Inside a class method, what does 'this' usually refer to?",
      choices: ["The class itself", "The current instance", "The window", "The prototype object"],
      answer: 1
    },
    {
      q: "How do you make one class inherit from another?",
      choices: [
        "class Child: Parent {}",
        "class Child implements Parent {}",
        "class Child extends Parent {}",
        "class Child inherits Parent {}"
      ],
      answer: 2
    },
    {
      q: "What does 'super()' do in a subclass constructor?",
      choices: [
        "Calls the parent's constructor",
        "Creates a static field",
        "Freezes the object",
        "Binds all methods"
      ],
      answer: 0
    },
    {
  q: "What keyword is used to define a class in JavaScript?",
  choices: [
    "object",
    "class",
    "function",
    "new"
  ],
  answer: 1
},
{
  q: "Which keyword is used to create a new object from a class?",
  choices: [
    "build",
    "instance",
    "new",
    "create"
  ],
  answer: 2
},
{
  q: "What does the 'extends' keyword do in a class definition?",
  choices: [
    "Copies methods into another class",
    "Creates a subclass that inherits from a parent",
    "Links a static field to the child",
    "Deletes parent methods"
  ],
  answer: 1
}

  ];

  const form = document.getElementById("quizForm");
  const submitBtn = document.getElementById("quizSubmit");
  const resetBtn = document.getElementById("quizReset");
  const resultBox = document.getElementById("quizResult");

  // Render questions
  form.innerHTML = QUESTIONS.map((q, i) => {
    const name = `q${i}`;
    const opts = q.choices.map((c, j) => {
      const id = `${name}_opt${j}`;
      return `
        <label for="${id}" style="display:block; margin:.15rem 0;">
          <input type="radio" name="${name}" id="${id}" value="${j}" />
          ${c}
        </label>
      `;
    }).join("");
    return `
      <fieldset style="margin:.6rem 0; border:1px solid #ddd; padding:.5rem;">
        <legend>${i+1}. ${q.q}</legend>
        ${opts}
      </fieldset>
    `;
  }).join("");

  // Grade
  submitBtn.addEventListener("click", () => {
    let score = 0;
    QUESTIONS.forEach((q, i) => {
      const chosen = form.querySelector(`input[name="q${i}"]:checked`);
      const val = chosen ? parseInt(chosen.value, 10) : -1;
      if (val === q.answer) score++;
    });
    resultBox.textContent = `Score: ${score}/${QUESTIONS.length}`;
  });

  // Reset
  resetBtn.addEventListener("click", () => {
    form.querySelectorAll("input[type=radio]").forEach(r => r.checked = false);
    resultBox.textContent = "";
  });
})();
</script>