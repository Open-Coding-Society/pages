let score = 0;

function addScore(points) {
    score += points;
    document.getElementById("score").innerText = score;
}

function scrollToGame(id) {
    document.getElementById(id).scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function choosePrediction(button, correct) {
    const siblings = button.parentElement.querySelectorAll("button");

    siblings.forEach(btn => {
        btn.classList.remove("correct", "wrong");
    });

    if (correct) {
        button.classList.add("correct");
        addScore(10);
    } else {
        button.classList.add("wrong");
    }
}

function updateSafetyLabel() {
    document.getElementById("safetyLabel").innerText =
        document.getElementById("safetyScore").value;
}

function updateWeatherLabel() {
    document.getElementById("weatherLabel").innerText =
        document.getElementById("weatherDifficulty").value;
}

function updateFlightLabel() {
    document.getElementById("flightLabel").innerText =
        document.getElementById("flightCount").value;
}

function runPlaneSim() {
    const safety = Number(document.getElementById("safetyScore").value);
    const weather = Number(document.getElementById("weatherDifficulty").value);
    const flights = Number(document.getElementById("flightCount").value);

    let crashes = 0;
    let safe = 0;

    let crashChance = (100 - safety + weather) / 140;
    crashChance = Math.max(0.02, Math.min(crashChance, 0.9));

    for (let i = 0; i < flights; i++) {
        if (Math.random() < crashChance) {
            crashes++;
        } else {
            safe++;
        }
    }

    const safePercent = ((safe / flights) * 100).toFixed(1);
    const crashPercent = ((crashes / flights) * 100).toFixed(1);

    document.getElementById("safeFlights").innerText = safe;
    document.getElementById("crashes").innerText = crashes;
    document.getElementById("planeBar").style.width = safePercent + "%";
    document.getElementById("planeBar").innerText = safePercent + "% Safe";

    let risk = "Low";
    if (crashPercent > 35) risk = "High";
    else if (crashPercent > 15) risk = "Medium";

    document.getElementById("riskLevel").innerText = risk;

    document.getElementById("planeFeedback").innerText =
        `Crash rate: ${crashPercent}%. This model assumes safety score and weather difficulty are the main factors.`;

    addScore(15);
}

function updatePointLabel() {
    document.getElementById("pointLabel").innerText =
        document.getElementById("pointCount").value;
}

function runPiSim() {
    const points = Number(document.getElementById("pointCount").value);
    const canvas = document.getElementById("piCanvas");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#7c3aed";
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, 340, 340);

    ctx.beginPath();
    ctx.arc(170, 170, 170, 0, Math.PI * 2);
    ctx.stroke();

    let inside = 0;

    for (let i = 0; i < points; i++) {
        const x = Math.random() * 2 - 1;
        const y = Math.random() * 2 - 1;
        const distance = x * x + y * y;

        const canvasX = (x + 1) * 170;
        const canvasY = (y + 1) * 170;

        if (distance <= 1) {
            inside++;
            ctx.fillStyle = "#14b8a6";
        } else {
            ctx.fillStyle = "#fb7185";
        }

        ctx.fillRect(canvasX, canvasY, 2.5, 2.5);
    }

    const estimate = (4 * inside / points).toFixed(5);
    const error = Math.abs(Math.PI - Number(estimate)).toFixed(5);

    document.getElementById("insideCount").innerText = inside;
    document.getElementById("totalPoints").innerText = points;
    document.getElementById("piEstimate").innerText = estimate;

    document.getElementById("piFeedback").innerText =
        `Error from actual π: ${error}. More points usually reduce error, but randomness still causes variation.`;

    addScore(15);
}