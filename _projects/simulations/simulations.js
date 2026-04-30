// assets/js/simulations.js

document.addEventListener("DOMContentLoaded", () => {
  const state = {
    diceCounts: [0, 0, 0, 0, 0, 0],
    totalRolls: 0,
    lastRoll: null,
    flightHistory: [],
  };

  const vocabDefinitions = {
    model: "A model is a simplified version of a real-world system that a program can imitate.",
    input: "An input is information given to the simulation before or during the run.",
    output: "An output is the result produced by the simulation after the model is executed.",
    trial: "A trial is one run of the simulation, such as one dice roll or one flight attempt.",
    randomness: "Randomness means the program uses chance so the same inputs may not always produce the exact same output.",
    assumption: "An assumption is a simplifying choice made by the programmer when the real system is too complex.",
    approximation: "An approximation is an answer that is close enough to be useful, even if it is not perfectly exact.",
  };

  const dicePrompts = [
    "Why do the results usually become more balanced after more trials?",
    "How is experimental probability different from theoretical probability?",
    "Why might a small number of rolls give misleading results?",
    "Where is randomness used in this simulation?",
    "What data does this simulation collect after each trial?",
    "How could you modify this simulation to model two dice instead of one?",
    "Why is a table useful for understanding simulation results?",
    "What is one limitation of this dice simulation?",
  ];

  const flightPrompts = [
    "Which input seems to affect the simulation the most, and why?",
    "Why does the same set of inputs not always guarantee the same outcome?",
    "Which parts of this simulation are realistic, and which parts are simplified?",
    "What assumptions does this model make about flight safety?",
    "How could real data improve this simulation?",
    "Why would a flight simulation be safer than testing risky flights in real life?",
    "What variables are missing from this model?",
    "How does randomness make this simulation different from a normal calculator?",
  ];

  const elements = {
    vocabDefinitionBox: document.getElementById("vocabDefinitionBox"),
    vocabButtons: Array.from(document.querySelectorAll(".vocab-chip")),

    diceHelpButton: document.getElementById("diceHelpButton"),
    diceExplanationPanel: document.getElementById("diceExplanationPanel"),
    diceCube: document.getElementById("diceCube"),
    diceDisplayValue: document.getElementById("diceDisplayValue"),
    lastRollText: document.getElementById("lastRollText"),
    rollOnceButton: document.getElementById("rollOnceButton"),
    rollTenButton: document.getElementById("rollTenButton"),
    rollHundredButton: document.getElementById("rollHundredButton"),
    customRollInput: document.getElementById("customRollInput"),
    customRollButton: document.getElementById("customRollButton"),
    resetDiceButton: document.getElementById("resetDiceButton"),
    totalRollsText: document.getElementById("totalRollsText"),
    mostCommonText: document.getElementById("mostCommonText"),
    leastCommonText: document.getElementById("leastCommonText"),
    diceBarChart: document.getElementById("diceBarChart"),
    diceResultsTableBody: document.getElementById("diceResultsTableBody"),
    copyDiceSummaryButton: document.getElementById("copyDiceSummaryButton"),
    diceReflectionPrompt: document.getElementById("diceReflectionPrompt"),
    newDicePromptButton: document.getElementById("newDicePromptButton"),

    flightHelpButton: document.getElementById("flightHelpButton"),
    flightExplanationPanel: document.getElementById("flightExplanationPanel"),
    resetFlightButton: document.getElementById("resetFlightButton"),
    runFlightButton: document.getElementById("runFlightButton"),
    randomizeFlightButton: document.getElementById("randomizeFlightButton"),
    flightScene: document.getElementById("flightScene"),
    animatedPlane: document.getElementById("animatedPlane"),
    fallingPeopleContainer: document.getElementById("fallingPeopleContainer"),
    explosionEffect: document.getElementById("explosionEffect"),
    safetyScoreText: document.getElementById("safetyScoreText"),
    randomRollText: document.getElementById("randomRollText"),
    outcomeText: document.getElementById("outcomeText"),
    flightResultBox: document.getElementById("flightResultBox"),
    riskBreakdownList: document.getElementById("riskBreakdownList"),
    flightReflectionPrompt: document.getElementById("flightReflectionPrompt"),
    newFlightPromptButton: document.getElementById("newFlightPromptButton"),

    weatherInput: document.getElementById("weatherInput"),
    windInput: document.getElementById("windInput"),
    visibilityInput: document.getElementById("visibilityInput"),
    planeStyleInput: document.getElementById("planeStyleInput"),
    planeAgeInput: document.getElementById("planeAgeInput"),
    maintenanceInput: document.getElementById("maintenanceInput"),
    passengerInput: document.getElementById("passengerInput"),
    pilotInput: document.getElementById("pilotInput"),
    copilotInput: document.getElementById("copilotInput"),
  };

  function safeText(value) {
    return String(value);
  }

  function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomChoice(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function clampNumber(value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, value));
  }

  function formatPercent(value) {
    return `${value.toFixed(1)}%`;
  }

  function togglePanel(panel) {
    if (!panel) return;
    panel.classList.toggle("is-visible");
  }

  function setVocabDefinition(key) {
    if (!elements.vocabDefinitionBox) return;

    const definition = vocabDefinitions[key] || "Choose a vocabulary word to see its meaning.";
    elements.vocabDefinitionBox.textContent = definition;

    elements.vocabButtons.forEach((button) => {
      const isActive = button.dataset.vocab === key;
      button.classList.toggle("active", isActive);
    });
  }

  function initializeVocabularyButtons() {
    elements.vocabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        setVocabDefinition(button.dataset.vocab);
      });
    });
  }

  function rollDieOnce() {
    const result = randomInteger(1, 6);
    state.diceCounts[result - 1] += 1;
    state.totalRolls += 1;
    state.lastRoll = result;
    return result;
  }

  function animateDice(result) {
    if (!elements.diceCube || !elements.diceDisplayValue) return;

    elements.diceCube.classList.remove("is-rolling");
    void elements.diceCube.offsetWidth;
    elements.diceCube.classList.add("is-rolling");
    elements.diceDisplayValue.textContent = safeText(result);
  }

  function calculateDiceProbability(index) {
    if (state.totalRolls === 0) return 0;
    return state.diceCounts[index] / state.totalRolls;
  }

  function calculateDifferenceFromTheoretical(probability) {
    const theoreticalProbability = 1 / 6;
    return probability - theoreticalProbability;
  }

  function getMostCommonDiceValue() {
    if (state.totalRolls === 0) return "N/A";

    let highestCount = -1;
    let highestValue = 1;

    state.diceCounts.forEach((count, index) => {
      if (count > highestCount) {
        highestCount = count;
        highestValue = index + 1;
      }
    });

    return safeText(highestValue);
  }

  function getLeastCommonDiceValue() {
    if (state.totalRolls === 0) return "N/A";

    let lowestCount = Infinity;
    let lowestValue = 1;

    state.diceCounts.forEach((count, index) => {
      if (count < lowestCount) {
        lowestCount = count;
        lowestValue = index + 1;
      }
    });

    return safeText(lowestValue);
  }

  function renderDiceBarChart() {
    if (!elements.diceBarChart) return;

    elements.diceBarChart.innerHTML = "";

    for (let value = 1; value <= 6; value += 1) {
      const index = value - 1;
      const probability = calculateDiceProbability(index);
      const percent = probability * 100;

      const row = document.createElement("div");
      row.className = "dice-bar-row";

      const label = document.createElement("div");
      label.className = "dice-bar-label";
      label.textContent = `Side ${value}`;

      const track = document.createElement("div");
      track.className = "dice-bar-track";

      const fill = document.createElement("div");
      fill.className = "dice-bar-fill";
      fill.style.width = `${percent}%`;

      const percentText = document.createElement("div");
      percentText.className = "dice-bar-percent";
      percentText.textContent = formatPercent(percent);

      track.appendChild(fill);
      row.appendChild(label);
      row.appendChild(track);
      row.appendChild(percentText);

      elements.diceBarChart.appendChild(row);
    }
  }

  function renderDiceTable() {
    if (!elements.diceResultsTableBody) return;

    elements.diceResultsTableBody.innerHTML = "";

    for (let value = 1; value <= 6; value += 1) {
      const index = value - 1;
      const count = state.diceCounts[index];
      const probability = calculateDiceProbability(index);
      const percent = probability * 100;
      const difference = calculateDifferenceFromTheoretical(probability) * 100;

      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${value}</td>
        <td>${count}</td>
        <td>${formatPercent(percent)}</td>
        <td>${difference >= 0 ? "+" : ""}${difference.toFixed(1)}%</td>
        <td>
          <div class="table-mini-bar">
            <div class="table-mini-fill" style="width: ${percent}%"></div>
          </div>
        </td>
      `;

      elements.diceResultsTableBody.appendChild(row);
    }
  }

  function renderDiceStats() {
    if (elements.totalRollsText) {
      elements.totalRollsText.textContent = safeText(state.totalRolls);
    }

    if (elements.mostCommonText) {
      elements.mostCommonText.textContent = getMostCommonDiceValue();
    }

    if (elements.leastCommonText) {
      elements.leastCommonText.textContent = getLeastCommonDiceValue();
    }

    if (elements.lastRollText) {
      elements.lastRollText.textContent = state.lastRoll === null ? "No rolls yet" : `Rolled a ${state.lastRoll}`;
    }
  }

  function renderDiceSimulation() {
    renderDiceStats();
    renderDiceBarChart();
    renderDiceTable();
  }

  function runDiceRolls(amount, animateLast = true) {
    const safeAmount = clampNumber(Number(amount) || 1, 1, 10000);
    let lastResult = null;

    for (let index = 0; index < safeAmount; index += 1) {
      lastResult = rollDieOnce();
    }

    if (animateLast && lastResult !== null) {
      animateDice(lastResult);
    }

    renderDiceSimulation();
  }

  function runAnimatedDiceBatch(amount) {
    const safeAmount = clampNumber(Number(amount) || 1, 1, 10000);

    if (safeAmount > 25) {
      runDiceRolls(safeAmount, true);
      return;
    }

    let completedRolls = 0;

    const intervalId = window.setInterval(() => {
      const result = rollDieOnce();
      animateDice(result);
      renderDiceSimulation();

      completedRolls += 1;

      if (completedRolls >= safeAmount) {
        window.clearInterval(intervalId);
      }
    }, 135);
  }

  function resetDiceSimulation() {
    state.diceCounts = [0, 0, 0, 0, 0, 0];
    state.totalRolls = 0;
    state.lastRoll = null;

    if (elements.diceDisplayValue) {
      elements.diceDisplayValue.textContent = "?";
    }

    renderDiceSimulation();
  }

  function buildDiceSummaryText() {
    const lines = [];
    lines.push("Dice Simulation Summary");
    lines.push(`Total rolls: ${state.totalRolls}`);

    for (let value = 1; value <= 6; value += 1) {
      const index = value - 1;
      const count = state.diceCounts[index];
      const probability = calculateDiceProbability(index) * 100;
      lines.push(`Side ${value}: ${count} rolls, ${formatPercent(probability)}`);
    }

    return lines.join("\n");
  }

  async function copyDiceSummary() {
    const summary = buildDiceSummaryText();

    try {
      await navigator.clipboard.writeText(summary);
      if (elements.copyDiceSummaryButton) {
        elements.copyDiceSummaryButton.textContent = "Copied!";
        window.setTimeout(() => {
          elements.copyDiceSummaryButton.textContent = "Copy Summary";
        }, 1200);
      }
    } catch (error) {
      alert(summary);
    }
  }

  function setupDiceEvents() {
    if (elements.diceHelpButton) {
      elements.diceHelpButton.addEventListener("click", () => togglePanel(elements.diceExplanationPanel));
    }

    if (elements.rollOnceButton) {
      elements.rollOnceButton.addEventListener("click", () => runAnimatedDiceBatch(1));
    }

    if (elements.rollTenButton) {
      elements.rollTenButton.addEventListener("click", () => runAnimatedDiceBatch(10));
    }

    if (elements.rollHundredButton) {
      elements.rollHundredButton.addEventListener("click", () => runDiceRolls(100, true));
    }

    if (elements.customRollButton) {
      elements.customRollButton.addEventListener("click", () => {
        runDiceRolls(elements.customRollInput.value, true);
      });
    }

    if (elements.resetDiceButton) {
      elements.resetDiceButton.addEventListener("click", resetDiceSimulation);
    }

    if (elements.copyDiceSummaryButton) {
      elements.copyDiceSummaryButton.addEventListener("click", copyDiceSummary);
    }

    if (elements.newDicePromptButton) {
      elements.newDicePromptButton.addEventListener("click", () => {
        elements.diceReflectionPrompt.textContent = randomChoice(dicePrompts);
      });
    }
  }

  function getInputValue(element, fallback = "") {
    if (!element) return fallback;
    return element.value;
  }

  function getFlightInputs() {
    return {
      weather: getInputValue(elements.weatherInput, "clear"),
      wind: getInputValue(elements.windInput, "low"),
      visibility: getInputValue(elements.visibilityInput, "normal"),
      planeStyle: getInputValue(elements.planeStyleInput, "standard"),
      planeAge: Number(getInputValue(elements.planeAgeInput, "8")),
      maintenance: getInputValue(elements.maintenanceInput, "average"),
      passengers: Number(getInputValue(elements.passengerInput, "120")),
      pilot: getInputValue(elements.pilotInput, "trained"),
      copilot: getInputValue(elements.copilotInput, "trained"),
    };
  }

  function addRiskDeduction(breakdown, label, amount) {
    if (amount === 0) return;
    breakdown.push({ label, amount });
  }

  function calculateFlightSafetyScore(inputs) {
    const breakdown = [];
    let score = 100;

    const weatherPenalty = {
      clear: 0,
      rain: 12,
      fog: 20,
      storm: 34,
    }[inputs.weather] ?? 0;

    const windPenalty = {
      low: 0,
      medium: 10,
      high: 24,
      extreme: 38,
    }[inputs.wind] ?? 0;

    const visibilityPenalty = {
      excellent: 0,
      normal: 4,
      poor: 18,
      dangerous: 32,
    }[inputs.visibility] ?? 0;

    const planeStylePenalty = {
      modern: 0,
      standard: 5,
      small: 12,
      cargo: 10,
      old: 20,
    }[inputs.planeStyle] ?? 0;

    let agePenalty = 0;
    if (inputs.planeAge > 12) agePenalty += 8;
    if (inputs.planeAge > 25) agePenalty += 12;
    if (inputs.planeAge > 40) agePenalty += 16;

    const maintenancePenalty = {
      excellent: 0,
      average: 7,
      delayed: 18,
      poor: 32,
    }[inputs.maintenance] ?? 0;

    let passengerPenalty = 0;
    if (inputs.passengers > 180) passengerPenalty += 7;
    if (inputs.passengers > 260) passengerPenalty += 9;
    if (inputs.passengers > 340) passengerPenalty += 8;

    const pilotPenalty = {
      expert: 0,
      trained: 7,
      new: 24,
    }[inputs.pilot] ?? 0;

    const copilotPenalty = {
      expert: 0,
      trained: 5,
      new: 16,
    }[inputs.copilot] ?? 0;

    addRiskDeduction(breakdown, "Weather condition", weatherPenalty);
    addRiskDeduction(breakdown, "Wind speed", windPenalty);
    addRiskDeduction(breakdown, "Visibility", visibilityPenalty);
    addRiskDeduction(breakdown, "Plane style", planeStylePenalty);
    addRiskDeduction(breakdown, "Plane age", agePenalty);
    addRiskDeduction(breakdown, "Maintenance quality", maintenancePenalty);
    addRiskDeduction(breakdown, "Passenger load", passengerPenalty);
    addRiskDeduction(breakdown, "Pilot experience", pilotPenalty);
    addRiskDeduction(breakdown, "Copilot experience", copilotPenalty);

    breakdown.forEach((item) => {
      score -= item.amount;
    });

    const clampedScore = clampNumber(score, 3, 98);

    return {
      score: clampedScore,
      breakdown,
    };
  }

  function renderRiskBreakdown(breakdown) {
    if (!elements.riskBreakdownList) return;

    elements.riskBreakdownList.innerHTML = "";

    if (breakdown.length === 0) {
      const item = document.createElement("div");
      item.className = "risk-item";
      item.innerHTML = `<span>No major risk deductions in this model.</span><strong>-0</strong>`;
      elements.riskBreakdownList.appendChild(item);
      return;
    }

    breakdown.forEach((risk) => {
      const item = document.createElement("div");
      item.className = "risk-item";
      item.innerHTML = `<span>${risk.label}</span><strong>-${risk.amount}</strong>`;
      elements.riskBreakdownList.appendChild(item);
    });
  }

  function resetFlightAnimation() {
    if (elements.animatedPlane) {
      elements.animatedPlane.classList.remove("takeoff-success", "takeoff-fail", "shaking");
    }

    if (elements.fallingPeopleContainer) {
      elements.fallingPeopleContainer.innerHTML = "";
    }

    if (elements.explosionEffect) {
      elements.explosionEffect.classList.remove("show-explosion");
    }

    if (elements.flightResultBox) {
      elements.flightResultBox.className = "flight-result-box";
      elements.flightResultBox.textContent = "Choose inputs and run the flight simulation.";
    }

    if (elements.safetyScoreText) elements.safetyScoreText.textContent = "--%";
    if (elements.randomRollText) elements.randomRollText.textContent = "--";
    if (elements.outcomeText) elements.outcomeText.textContent = "Waiting";
  }

  function updateSceneWeather(weather) {
    if (!elements.flightScene) return;

    const isStormy = weather === "storm" || weather === "fog";
    elements.flightScene.classList.toggle("stormy", isStormy);
  }

  function createFallingPeople() {
    if (!elements.fallingPeopleContainer) return;

    const people = ["🧍", "🧍‍♀️", "🧍‍♂️", "🧑"];
    elements.fallingPeopleContainer.innerHTML = "";

    people.forEach((person) => {
      const span = document.createElement("span");
      span.className = "falling-person";
      span.textContent = person;
      elements.fallingPeopleContainer.appendChild(span);
    });
  }

  function describeFlightOutcome(success, score, randomRoll, inputs) {
    if (success) {
      return `
        ✅ Flight succeeded in this simulation.<br>
        Safety score: ${formatPercent(score)}<br>
        Random roll: ${randomRoll.toFixed(1)}<br>
        Because the random roll was lower than or equal to the safety score, the modeled flight succeeded.
      `;
    }

    return `
      ⚠️ Flight failed in this simulation.<br>
      Safety score: ${formatPercent(score)}<br>
      Random roll: ${randomRoll.toFixed(1)}<br>
      The model treated the selected conditions as risky enough that the random roll caused a failed outcome.
    `;
  }

  function runFlightSimulation() {
    resetFlightAnimation();

    const inputs = getFlightInputs();
    updateSceneWeather(inputs.weather);

    const result = calculateFlightSafetyScore(inputs);
    const score = result.score;
    const randomRoll = Math.random() * 100;
    const success = randomRoll <= score;

    renderRiskBreakdown(result.breakdown);

    if (elements.safetyScoreText) elements.safetyScoreText.textContent = formatPercent(score);
    if (elements.randomRollText) elements.randomRollText.textContent = randomRoll.toFixed(1);
    if (elements.outcomeText) elements.outcomeText.textContent = success ? "Success" : "Failed";

    if (elements.animatedPlane) {
      elements.animatedPlane.classList.add("shaking");
    }

    window.setTimeout(() => {
      if (elements.animatedPlane) {
        elements.animatedPlane.classList.remove("shaking");
        elements.animatedPlane.classList.add(success ? "takeoff-success" : "takeoff-fail");
      }

      if (!success) {
        createFallingPeople();

        if (elements.explosionEffect) {
          elements.explosionEffect.classList.add("show-explosion");
        }
      }

      if (elements.flightResultBox) {
        elements.flightResultBox.className = success ? "flight-result-box success-result" : "flight-result-box fail-result";
        elements.flightResultBox.innerHTML = describeFlightOutcome(success, score, randomRoll, inputs);
      }

      state.flightHistory.push({
        inputs,
        score,
        randomRoll,
        success,
      });
    }, 140);
  }

  function randomizeFlightInputs() {
    if (elements.weatherInput) elements.weatherInput.value = randomChoice(["clear", "rain", "fog", "storm"]);
    if (elements.windInput) elements.windInput.value = randomChoice(["low", "medium", "high", "extreme"]);
    if (elements.visibilityInput) elements.visibilityInput.value = randomChoice(["excellent", "normal", "poor", "dangerous"]);
    if (elements.planeStyleInput) elements.planeStyleInput.value = randomChoice(["modern", "standard", "small", "cargo", "old"]);
    if (elements.planeAgeInput) elements.planeAgeInput.value = randomInteger(1, 55);
    if (elements.maintenanceInput) elements.maintenanceInput.value = randomChoice(["excellent", "average", "delayed", "poor"]);
    if (elements.passengerInput) elements.passengerInput.value = randomInteger(30, 360);
    if (elements.pilotInput) elements.pilotInput.value = randomChoice(["expert", "trained", "new"]);
    if (elements.copilotInput) elements.copilotInput.value = randomChoice(["expert", "trained", "new"]);

    const inputs = getFlightInputs();
    updateSceneWeather(inputs.weather);
    const preview = calculateFlightSafetyScore(inputs);

    if (elements.safetyScoreText) elements.safetyScoreText.textContent = formatPercent(preview.score);
    renderRiskBreakdown(preview.breakdown);
  }

  function setupFlightEvents() {
    if (elements.flightHelpButton) {
      elements.flightHelpButton.addEventListener("click", () => togglePanel(elements.flightExplanationPanel));
    }

    if (elements.resetFlightButton) {
      elements.resetFlightButton.addEventListener("click", resetFlightAnimation);
    }

    if (elements.runFlightButton) {
      elements.runFlightButton.addEventListener("click", runFlightSimulation);
    }

    if (elements.randomizeFlightButton) {
      elements.randomizeFlightButton.addEventListener("click", randomizeFlightInputs);
    }

    if (elements.newFlightPromptButton) {
      elements.newFlightPromptButton.addEventListener("click", () => {
        elements.flightReflectionPrompt.textContent = randomChoice(flightPrompts);
      });
    }

    [
      elements.weatherInput,
      elements.windInput,
      elements.visibilityInput,
      elements.planeStyleInput,
      elements.planeAgeInput,
      elements.maintenanceInput,
      elements.passengerInput,
      elements.pilotInput,
      elements.copilotInput,
    ].forEach((input) => {
      if (!input) return;

      input.addEventListener("change", () => {
        const inputs = getFlightInputs();
        updateSceneWeather(inputs.weather);
        const preview = calculateFlightSafetyScore(inputs);

        if (elements.safetyScoreText) {
          elements.safetyScoreText.textContent = formatPercent(preview.score);
        }

        renderRiskBreakdown(preview.breakdown);
      });
    });
  }

  function initializeFlightPreview() {
    const inputs = getFlightInputs();
    updateSceneWeather(inputs.weather);
    const preview = calculateFlightSafetyScore(inputs);
    renderRiskBreakdown(preview.breakdown);

    if (elements.safetyScoreText) {
      elements.safetyScoreText.textContent = formatPercent(preview.score);
    }
  }

  function initializeApp() {
    initializeVocabularyButtons();
    setupDiceEvents();
    setupFlightEvents();
    renderDiceSimulation();
    initializeFlightPreview();
  }

  initializeApp();
});