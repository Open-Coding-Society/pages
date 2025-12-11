---
title: JS Calculator
comments: true
hide: true
layout: opencs
description: A modern, responsive calculator built with JavaScript. Features all basic operations and a clean UI.
permalink: /calculator
---

<!-- Add a container for the animation -->
<div id="animation">
  <div class="calculator-container">
      <!-- Display -->
      <div class="calculator-output" id="output">0</div>
      
      <!-- Row 1: Clear, Special ops -->
      <div class="calculator-clear">A/C</div>
      <div class="calculator-special" data-action="sqrt">√</div>
      <div class="calculator-special" data-action="percent">%</div>
      <div class="calculator-operation">/</div>
      
      <!-- Row 2 -->
      <div class="calculator-number">7</div>
      <div class="calculator-number">8</div>
      <div class="calculator-number">9</div>
      <div class="calculator-operation">*</div>
      
      <!-- Row 3 -->
      <div class="calculator-number">4</div>
      <div class="calculator-number">5</div>
      <div class="calculator-number">6</div>
      <div class="calculator-operation">-</div>
      
      <!-- Row 4 -->
      <div class="calculator-number">1</div>
      <div class="calculator-number">2</div>
      <div class="calculator-number">3</div>
      <div class="calculator-operation">+</div>
      
      <!-- Row 5 -->
      <div class="calculator-number zero">0</div>
      <div class="calculator-number">.</div>
      <div class="calculator-equals">=</div>
  </div>
</div>

<!-- JavaScript (JS) implementation of the calculator. -->
<script>
// Initialize calculator state
var firstNumber = null;
var operator = null;
var nextReady = true;
var lastResult = null;

// Build objects containing key elements
const output = document.getElementById("output");
const numbers = document.querySelectorAll(".calculator-number");
const operations = document.querySelectorAll(".calculator-operation");
const clear = document.querySelectorAll(".calculator-clear");
const equals = document.querySelectorAll(".calculator-equals");
const specials = document.querySelectorAll(".calculator-special");

// Format number for display (handle long decimals)
function formatNumber(num) {
    if (num === null || isNaN(num)) return "Error";
    if (!isFinite(num)) return "Error";
    
    // Handle very large or very small numbers
    if (Math.abs(num) > 999999999 || (Math.abs(num) < 0.0000001 && num !== 0)) {
        return num.toExponential(4);
    }
    
    // Round to avoid floating point issues
    let result = Math.round(num * 100000000) / 100000000;
    let str = result.toString();
    
    // Truncate if too long
    if (str.length > 12) {
        if (str.includes('.')) {
            result = parseFloat(result.toPrecision(10));
            str = result.toString();
        }
    }
    
    return str;
}

// Number buttons listener
numbers.forEach(button => {
    button.addEventListener("click", function() {
        number(button.textContent);
    });
});

// Number action
function number(value) {
    if (value !== ".") {
        if (nextReady) {
            output.innerHTML = value;
            if (value !== "0") {
                nextReady = false;
            }
        } else {
            // Limit input length
            if (output.innerHTML.length < 12) {
                output.innerHTML = output.innerHTML + value;
            }
        }
    } else {
        // Decimal handling - only one decimal allowed
        if (output.innerHTML.indexOf(".") === -1) {
            if (nextReady) {
                output.innerHTML = "0.";
                nextReady = false;
            } else {
                output.innerHTML = output.innerHTML + value;
            }
        }
    }
}

// Operation buttons listener
operations.forEach(button => {
    button.addEventListener("click", function() {
        operation(button.textContent);
    });
});

// Operator action
function operation(choice) {
    if (firstNumber === null) {
        firstNumber = parseFloat(output.innerHTML);
        nextReady = true;
        operator = choice;
        return;
    }
    
    // Chain calculations
    firstNumber = calculate(firstNumber, parseFloat(output.innerHTML));
    operator = choice;
    output.innerHTML = formatNumber(firstNumber);
    nextReady = true;
}

// Calculator - performs the actual math
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
            result = first * second;
            break;
        case "/":
            if (second === 0) {
                return NaN; // Division by zero
            }
            result = first / second;
            break;
        default:
            result = first;
            break;
    }
    return result;
}

// Special operations listener
specials.forEach(button => {
    button.addEventListener("click", function() {
        const action = button.dataset.action;
        specialOperation(action);
    });
});

// Special operations (single number operations)
function specialOperation(action) {
    let currentValue = parseFloat(output.innerHTML);
    let result;
    
    switch (action) {
        case "sqrt":
            if (currentValue < 0) {
                output.innerHTML = "Error";
                nextReady = true;
                return;
            }
            result = Math.sqrt(currentValue);
            break;
        case "percent":
            if (firstNumber !== null) {
                // Calculate percentage of first number
                result = (firstNumber * currentValue) / 100;
            } else {
                result = currentValue / 100;
            }
            break;
        default:
            return;
    }
    
    output.innerHTML = formatNumber(result);
    nextReady = true;
}

// Equals button listener
equals.forEach(button => {
    button.addEventListener("click", function() {
        equal();
    });
});

// Equal action
function equal() {
    if (firstNumber === null || operator === null) {
        return;
    }
    
    firstNumber = calculate(firstNumber, parseFloat(output.innerHTML));
    output.innerHTML = formatNumber(firstNumber);
    lastResult = firstNumber;
    firstNumber = null;
    operator = null;
    nextReady = true;
}

// Clear button listener
clear.forEach(button => {
    button.addEventListener("click", function() {
        clearCalc();
    });
});

// A/C action - full clear
function clearCalc() {
    firstNumber = null;
    operator = null;
    output.innerHTML = "0";
    nextReady = true;
}

// Keyboard support
document.addEventListener("keydown", function(event) {
    const key = event.key;
    
    if (key >= "0" && key <= "9") {
        number(key);
    } else if (key === ".") {
        number(".");
    } else if (key === "+" || key === "-" || key === "*" || key === "/") {
        operation(key);
    } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        equal();
    } else if (key === "Escape" || key === "c" || key === "C") {
        clearCalc();
    } else if (key === "Backspace") {
        // Allow backspace to delete last character
        if (!nextReady && output.innerHTML.length > 1) {
            output.innerHTML = output.innerHTML.slice(0, -1);
        } else {
            output.innerHTML = "0";
            nextReady = true;
        }
    }
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
