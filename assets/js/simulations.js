let totalSimulations = 0;
let totalTrials = 0;
let lessonScore = 0;

function clampValue(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function updateTopStats(trialsAdded, scoreAdded) {
    totalSimulations += 1;
    totalTrials += trialsAdded;
    lessonScore += scoreAdded;

    document.getElementById("totalSimulations").innerText = totalSimulations;
    document.getElementById("totalTrials").innerText = totalTrials;
    document.getElementById("lessonScore").innerText = lessonScore;
}

function updateSafetyLabel() {
    const value = document.getElementById("planeSafety").value;
    document.getElementById("safetyLabel").innerText = value;
}

function updateWeatherLabel() {
    const value = document.getElementById("weatherRisk").value;
    document.getElementById("weatherLabel").innerText = value;
}

function updateFlightLabel() {
    const value = document.getElementById("flightTrials").value;
    document.getElementById("flightLabel").innerText = value;
}

function resetAirplaneAnimation() {
    const airplane = document.getElementById("airplane");
    const crashFlash = document.getElementById("crashFlash");

    airplane.classList.remove("takeoff", "land", "crash", "shake");
    crashFlash.classList.remove("show");

    void airplane.offsetWidth;
    void crashFlash.offsetWidth;
}

function animateAirplane(outcome) {
    const airplane = document.getElementById("airplane");
    const crashFlash = document.getElementById("crashFlash");

    resetAirplaneAnimation();

    if (outcome === "Crash") {
        airplane.classList.add("crash");
        setTimeout(function () {
            crashFlash.classList.add("show");
        }, 1900);
    } else if (outcome === "Rough Landing") {
        airplane.classList.add("shake");
        setTimeout(function () {
            airplane.classList.remove("shake");
            airplane.classList.add("land");
        }, 1300);
    } else {
        airplane.classList.add("takeoff");
    }
}

function calculateAirplaneRisk(safety, engine, weather, weight, fuel) {
    const safetyBenefit = safety * 0.38;
    const engineBenefit = engine * 0.27;
    const fuelBenefit = fuel * 0.18;

    const weatherPenalty = weather * 0.34;
    const weightPenalty = weight * 0.24;

    let successScore = 50 + safetyBenefit + engineBenefit + fuelBenefit - weatherPenalty - weightPenalty;

    successScore = clampValue(successScore, 5, 98);

    return successScore;
}

function runAirplaneSimulation() {
    const safety = clampValue(Number(document.getElementById("planeSafety").value), 0, 100);
    const engine = clampValue(Number(document.getElementById("enginePower").value), 0, 100);
    const weather = clampValue(Number(document.getElementById("weatherRisk").value), 0, 100);
    const weight = clampValue(Number(document.getElementById("planeWeight").value), 0, 100);
    const fuel = clampValue(Number(document.getElementById("fuelLevel").value), 0, 100);
    const trials = clampValue(Number(document.getElementById("flightTrials").value), 1, 1000);

    const successProbability = calculateAirplaneRisk(safety, engine, weather, weight, fuel) / 100;

    let safeFlights = 0;
    let crashes = 0;

    for (let i = 0; i < trials; i++) {
        if (Math.random() < successProbability) {
            safeFlights++;
        } else {
            crashes++;
        }
    }

    const safePercent = (safeFlights / trials) * 100;
    const crashPercent = (crashes / trials) * 100;

    let outcome = "Successful Flight";
    let riskLevel = "Low";

    if (crashPercent >= 45) {
        outcome = "Crash";
        riskLevel = "High";
    } else if (crashPercent >= 20) {
        outcome = "Rough Landing";
        riskLevel = "Medium";
    }

    document.getElementById("safeFlights").innerText = safeFlights;
    document.getElementById("crashes").innerText = crashes;
    document.getElementById("flightOutcome").innerText = outcome;
    document.getElementById("successRate").innerText = safePercent.toFixed(1) + "%";
    document.getElementById("crashRate").innerText = crashPercent.toFixed(1) + "%";
    document.getElementById("flightProgress").style.width = safePercent.toFixed(1) + "%";
    document.getElementById("flightProgress").innerText = safePercent.toFixed(1) + "% safe";

    animateAirplane(outcome);

    document.getElementById("airplaneFeedback").innerText =
        "Model result: " + outcome +
        ". This simulation used safety, engine power, weather, weight, and fuel as simplified factors. " +
        "A real airplane model would need much more data, so this is useful but limited.";

    updateTopStats(trials, 20);
}

function resetAirplaneSimulation() {
    resetAirplaneAnimation();

    document.getElementById("safeFlights").innerText = "0";
    document.getElementById("crashes").innerText = "0";
    document.getElementById("flightOutcome").innerText = "Ready";
    document.getElementById("successRate").innerText = "0%";
    document.getElementById("crashRate").innerText = "0%";
    document.getElementById("flightProgress").style.width = "0%";
    document.getElementById("flightProgress").innerText = "0%";
    document.getElementById("airplaneFeedback").innerText =
        "Enter values and run the simulation to test the plane.";
}

function getRandomDieValue() {
    return Math.floor(Math.random() * 6) + 1;
}

function setDiceFace(element, value) {
    element.innerText = value;
}

function resetDiceSimulation() {
    document.getElementById("dieOne").innerText = "1";
    document.getElementById("dieTwo").innerText = "1";
    document.getElementById("mostCommonSum").innerText = "—";
    document.getElementById("diceTotalRolls").innerText = "0";
    document.getElementById("predictionResult").innerText = "—";
    document.getElementById("diceBars").innerHTML = "";
    document.getElementById("diceFeedback").innerText =
        "Run the dice simulation to see the distribution.";
}

function buildDiceBars(counts, maxCount) {
    let html = "";

    for (let sum = 2; sum <= 12; sum++) {
        const count = counts[sum];
        const width = maxCount === 0 ? 0 : (count / maxCount) * 100;

        html += `
            <div class="dice-row">
                <strong>${sum}</strong>
                <div class="dice-bar-track">
                    <div class="dice-bar-fill" style="width:${width}%"></div>
                </div>
                <span>${count}</span>
            </div>
        `;
    }

    return html;
}

function runDiceSimulation() {
    const dieOne = document.getElementById("dieOne");
    const dieTwo = document.getElementById("dieTwo");
    const trials = clampValue(Number(document.getElementById("diceTrials").value), 1, 10000);
    const prediction = Number(document.getElementById("dicePrediction").value);

    dieOne.classList.add("rolling");
    dieTwo.classList.add("rolling");

    let animationTicks = 0;

    const animationInterval = setInterval(function () {
        setDiceFace(dieOne, getRandomDieValue());
        setDiceFace(dieTwo, getRandomDieValue());

        animationTicks++;

        if (animationTicks >= 12) {
            clearInterval(animationInterval);
            finishDiceSimulation(trials, prediction);
        }
    }, 80);
}

function finishDiceSimulation(trials, prediction) {
    const dieOne = document.getElementById("dieOne");
    const dieTwo = document.getElementById("dieTwo");

    dieOne.classList.remove("rolling");
    dieTwo.classList.remove("rolling");

    const counts = {};

    for (let sum = 2; sum <= 12; sum++) {
        counts[sum] = 0;
    }

    let lastDieOne = 1;
    let lastDieTwo = 1;

    for (let i = 0; i < trials; i++) {
        const first = getRandomDieValue();
        const second = getRandomDieValue();
        const sum = first + second;

        counts[sum]++;

        lastDieOne = first;
        lastDieTwo = second;
    }

    setDiceFace(dieOne, lastDieOne);
    setDiceFace(dieTwo, lastDieTwo);

    let maxCount = 0;
    let mostCommon = 2;

    for (let sum = 2; sum <= 12; sum++) {
        if (counts[sum] > maxCount) {
            maxCount = counts[sum];
            mostCommon = sum;
        }
    }

    const predictionText = prediction === mostCommon ? "Correct" : "Not this time";

    document.getElementById("mostCommonSum").innerText = mostCommon;
    document.getElementById("diceTotalRolls").innerText = trials;
    document.getElementById("predictionResult").innerText = predictionText;
    document.getElementById("diceBars").innerHTML = buildDiceBars(counts, maxCount);

    let explanation = "The most common sum was " + mostCommon + ". ";

    if (mostCommon === 7) {
        explanation += "This matches the expected pattern because 7 has the most possible dice combinations.";
    } else {
        explanation += "With randomness, the most common result can vary, especially with fewer trials. Try increasing the number of rolls.";
    }

    document.getElementById("diceFeedback").innerText = explanation;

    updateTopStats(trials, 20);
}

document.addEventListener("DOMContentLoaded", function () {
    updateSafetyLabel();
    updateWeatherLabel();
    updateFlightLabel();
});