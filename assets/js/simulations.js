function toggleAnswer() {
    const ans = document.getElementById("answer");
    ans.classList.toggle("hidden");
}

function runCoin() {
    let heads = 0;
    let tails = 0;
    let flips = 20;

    for (let i = 0; i < flips; i++) {
        if (Math.random() < 0.5) heads++;
        else tails++;
    }

    document.getElementById("coinOutput").innerText =
        `Heads: ${heads}\nTails: ${tails}`;
}

function runDice() {
    let counts = {};

    for (let i = 0; i < 1000; i++) {
        let total = Math.floor(Math.random()*6)+1 + Math.floor(Math.random()*6)+1;
        counts[total] = (counts[total] || 0) + 1;
    }

    let output = "";
    for (let t in counts) {
        output += `${t}: ${counts[t]}\n`;
    }

    document.getElementById("diceOutput").innerText = output;
}

function runWeather() {
    const weather = ["Sunny", "Cloudy", "Rainy", "Stormy"];
    const probs = [0.5, 0.25, 0.15, 0.10];

    let result = {};

    for (let i = 0; i < 30; i++) {
        let rand = Math.random();
        let sum = 0;

        for (let j = 0; j < probs.length; j++) {
            sum += probs[j];
            if (rand < sum) {
                result[weather[j]] = (result[weather[j]] || 0) + 1;
                break;
            }
        }
    }

    let output = "";
    for (let w in result) {
        output += `${w}: ${result[w]} days\n`;
    }

    document.getElementById("weatherOutput").innerText = output;
}