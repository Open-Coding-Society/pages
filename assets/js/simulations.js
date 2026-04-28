function checkScenario(button, isGoodSimulation) {
    const feedback = document.getElementById("scenario-feedback");

    if (isGoodSimulation) {
        button.classList.add("correct");
        feedback.innerText = "✅ Yes! This is a good use of simulation because real testing could be dangerous, expensive, slow, or repetitive.";
    } else {
        button.classList.add("wrong");
        feedback.innerText = "❌ Not really. This situation is simple enough that a simulation is probably unnecessary.";
    }
}

function updateCoinLabel() {
    document.getElementById("coinFlipsLabel").innerText = document.getElementById("coinFlips").value;
}

function runCoinSim() {
    const flips = Number(document.getElementById("coinFlips").value);
    let heads = 0;
    let tails = 0;

    for (let i = 0; i < flips; i++) {
        if (Math.random() < 0.5) {
            heads++;
        } else {
            tails++;
        }
    }

    const percent = ((heads / flips) * 100).toFixed(1);

    document.getElementById("headsResult").innerText = heads;
    document.getElementById("tailsResult").innerText = tails;
    document.getElementById("headsPercent").innerText = percent + "%";
    document.getElementById("coinBar").style.width = percent + "%";
    document.getElementById("coinBar").innerText = percent + "% Heads";
}

function resetCoin() {
    document.getElementById("headsResult").innerText = "0";
    document.getElementById("tailsResult").innerText = "0";
    document.getElementById("headsPercent").innerText = "0%";
    document.getElementById("coinBar").style.width = "0%";
    document.getElementById("coinBar").innerText = "";
}

function updateDiceLabel() {
    document.getElementById("diceRollsLabel").innerText = document.getElementById("diceRolls").value;
}

function runDiceSim() {
    const rolls = Number(document.getElementById("diceRolls").value);
    const counts = {};

    for (let total = 2; total <= 12; total++) {
        counts[total] = 0;
    }

    for (let i = 0; i < rolls; i++) {
        const die1 = Math.floor(Math.random() * 6) + 1;
        const die2 = Math.floor(Math.random() * 6) + 1;
        counts[die1 + die2]++;
    }

    let maxCount = 0;
    let winner = 2;

    for (let total = 2; total <= 12; total++) {
        if (counts[total] > maxCount) {
            maxCount = counts[total];
            winner = total;
        }
    }

    let output = "";

    for (let total = 2; total <= 12; total++) {
        const percent = (counts[total] / maxCount) * 100;
        output += `
            <div class="dice-row">
                <span>${total}</span>
                <div class="dice-bar-wrap">
                    <div class="dice-bar" style="width:${percent}%"></div>
                </div>
                <span>${counts[total]}</span>
            </div>
        `;
    }

    document.getElementById("diceResults").innerHTML = output;
    document.getElementById("diceWinner").innerText =
        `🏆 Most common total: ${winner}. Usually, 7 wins because it has the most possible dice combinations.`;
}

function runWeatherSim() {
    const sunny = Number(document.getElementById("sunnyProb").value);
    const cloudy = Number(document.getElementById("cloudyProb").value);
    const rainy = Number(document.getElementById("rainyProb").value);
    const stormy = Number(document.getElementById("stormyProb").value);

    const total = sunny + cloudy + rainy + stormy;

    if (total !== 100) {
        document.getElementById("weatherFeedback").innerText = "⚠️ Your probabilities must add up to 100%.";
        return;
    }

    const options = [
        { name: "☀️ Sunny", weight: sunny },
        { name: "☁️ Cloudy", weight: cloudy },
        { name: "🌧️ Rainy", weight: rainy },
        { name: "⛈️ Stormy", weight: stormy }
    ];

    const counts = {
        "☀️ Sunny": 0,
        "☁️ Cloudy": 0,
        "🌧️ Rainy": 0,
        "⛈️ Stormy": 0
    };

    let html = "";

    for (let day = 1; day <= 30; day++) {
        const rand = Math.random() * 100;
        let runningTotal = 0;

        for (let i = 0; i < options.length; i++) {
            runningTotal += options[i].weight;

            if (rand <= runningTotal) {
                counts[options[i].name]++;
                html += `<div class="weather-day">Day ${day}<br>${options[i].name}</div>`;
                break;
            }
        }
    }

    document.getElementById("weatherResults").innerHTML = html;

    document.getElementById("weatherFeedback").innerText =
        `Summary: Sunny ${counts["☀️ Sunny"]}, Cloudy ${counts["☁️ Cloudy"]}, Rainy ${counts["🌧️ Rainy"]}, Stormy ${counts["⛈️ Stormy"]}`;
}

function updateCarLabel() {
    document.getElementById("carCountLabel").innerText = document.getElementById("carCount").value;
}

function runTrafficSim() {
    const green = Number(document.getElementById("greenProb").value);
    const yellow = Number(document.getElementById("yellowProb").value);
    const red = Number(document.getElementById("redProb").value);
    const total = green + yellow + red;

    if (total !== 100) {
        document.getElementById("trafficWait").innerText = "Error";
        document.getElementById("trafficCounts").innerText = "⚠️ Probabilities must add up to 100%.";
        return;
    }

    const cars = Number(document.getElementById("carCount").value);

    const counts = {
        Green: 0,
        Yellow: 0,
        Red: 0
    };

    let totalWait = 0;

    for (let i = 0; i < cars; i++) {
        const rand = Math.random() * 100;

        if (rand < green) {
            counts.Green++;
            totalWait += 0;
        } else if (rand < green + yellow) {
            counts.Yellow++;
            totalWait += 10;
        } else {
            counts.Red++;
            totalWait += 45;
        }
    }

    const averageWait = (totalWait / cars).toFixed(2);

    document.getElementById("trafficWait").innerText = averageWait;
    document.getElementById("trafficCounts").innerText =
        `Green: ${counts.Green}, Yellow: ${counts.Yellow}, Red: ${counts.Red}`;
}