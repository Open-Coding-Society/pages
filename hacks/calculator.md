---
title: JS Calculator
comments: true
hide: true
layout: opencs
description: A modern, responsive calculator built with JavaScript. Features all basic operations and a clean UI.
permalink: /calculator
---

<head>Simple Javascript Calculator</head>
> Play around with this calculator that seems to be missing a few functions... When you're done, go check out the lesson to finish it up!

<!-- Calculator container -->
<div id="animation">
  <div class="calculator-container">
      <!-- Display -->
      <div class="calculator-output" id="output">0</div>
      
      <!-- Row 1 -->
      <div class="calculator-clear">A/C</div>
      <div class="calculator-operation">/</div>
      <div class="calculator-operation">*</div>
      <div class="calculator-operation">-</div>
      
      <!-- Row 2 -->
      <div class="calculator-number">7</div>
      <div class="calculator-number">8</div>
      <div class="calculator-number">9</div>
      <div class="calculator-operation">+</div>
      
      <!-- Row 3 -->
      <div class="calculator-number">4</div>
      <div class="calculator-number">5</div>
      <div class="calculator-number">6</div>
      
      <!-- Row 4 -->
      <div class="calculator-number">1</div>
      <div class="calculator-number">2</div>
      <div class="calculator-number">3</div>
      
      <!-- Row 5 -->
      <div class="calculator-number zero">0</div>
      <div class="calculator-equals">=</div>
  </div>
</div>

<!-- JavaScript implementation -->
<script>
// Calculator state
let firstNumber = null;
let operator = null;
let nextReady = true;

const output = document.getElementById("output");
const numbers = document.querySelectorAll(".calculator-number");
const operations = document.querySelectorAll(".calculator-operation");
const clear = document.querySelectorAll(".calculator-clear");
const equals = document.querySelectorAll(".calculator-equals");

// Number buttons
numbers.forEach(button => {
  button.addEventListener("click", () => {
    number(button.textContent);
  });
});

function number(value) {
  if (nextReady) {
    output.textContent = value;
    nextReady = false;
  } else {
    output.textContent += value;
  }
}

// Operation buttons
operations.forEach(button => {
  button.addEventListener("click", () => {
    operation(button.textContent);
  });
});

function operation(choice) {
  if (firstNumber === null) {
    firstNumber = parseFloat(output.textContent);
    operator = choice;
    nextReady = true;
  } else {
    firstNumber = calculate(firstNumber, parseFloat(output.textContent));
    operator = choice;
    output.textContent = firstNumber;
    nextReady = true;
  }
}

// Calculation logic
function calculate(first, second) {
  let result = 0;
  switch (operator) {
    case "+":
      result = first + second;
      break;
    case "-":
      result = first - second;
      break;
    case "*":
      // TODO: Students add multiplication logic here
      result = "TODO: implement *";
      break;
    case "/":
      // TODO: Students add division logic here
      result = "TODO: implement /";
      break;
    default:
      result = first;
  }
  return result;
}

// Equals button
equals.forEach(button => {
  button.addEventListener("click", () => {
    if (firstNumber !== null && operator !== null) {
      firstNumber = calculate(firstNumber, parseFloat(output.textContent));
      output.textContent = firstNumber;
      firstNumber = null;
      operator = null;
      nextReady = true;
    }
  });
});

// Clear button
clear.forEach(button => {
  button.addEventListener("click", () => {
    firstNumber = null;
    operator = null;
    output.textContent = "0";
    nextReady = true;
  });
});
</script>

<!-- 
Vanta animations just for fun, load JS onto the page
-->
<script src="{{site.baseurl}}/assets/js/three.r119.min.js"></script>
<script src="{{site.baseurl}}/assets/js/vanta.halo.min.js"></script>
<script src="{{site.baseurl}}/assets/js/vanta.birds.min.js"></script>
<script src="{{site.baseurl}}/assets/js/vanta.net.min.js"></script>
<script src="{{site.baseurl}}/assets/js/vanta.rings.min.js"></script>

<script>
// setup vanta scripts as functions
var vantaInstances = {
  halo: VANTA.HALO,
  birds: VANTA.BIRDS,
  net: VANTA.NET,
  rings: VANTA.RINGS
};

// obtain a random vanta function
var vantaInstance = vantaInstances[Object.keys(vantaInstances)[Math.floor(Math.random() * Object.keys(vantaInstances).length)]];

// run the animation
vantaInstance({
  el: "#animation",
  mouseControls: true,
  touchControls: true,
  gyroControls: false
});
</script>
