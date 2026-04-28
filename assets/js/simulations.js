let score = 0;

function addScore(points) {
    score += points;
    document.getElementById("score").innerText = score;
}

function choosePlanePrediction(button, correct) {
    if (correct) {
        button.classList.add("correct");
        addScore(10);
    } else {
        button.classList.add("wrong");
    }
}

function choosePiPrediction(button, correct) {
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

function updateFlightLabel() {
    document.getElementById("flightLabel").innerText =
        document.getElementById("flightCount").value;
}

function runPlaneSim() {
    const safety = Number(document.getElementById("safetyScore").value);
    const flights = Number(document.getElementById("flightCount").value);

    let safe = 0;
    let crashes = 0;

    const crashChance = (100 - safety) / 100;

    for (let i = 0; i < flights; i++) {
        if (Math.random() < crashChance) {
            crashes++;
        } else {
            safe++;
        }
    }

    const safePercent = ((safe / flights) * 100).toFixed(1);

    document.getElementById("safeFlights").innerText = safe;
    document.getElementById("crashes").innerText = crashes;
    document.getElementById("planeBar").style.width = safePercent + "%";
    document.getElementById("planeBar").innerText = safePercent + "% Safe";

    document.getElementById("planeFeedback").innerText =
        "Higher safety scores lower the crash probability, but randomness means results can still vary.";

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

    ctx.strokeStyle = "#6366f1";
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, 320, 320);

    ctx.beginPath();
    ctx.arc(160, 160, 160, 0, Math.PI * 2);
    ctx.stroke();

    let inside = 0;

    for (let i = 0; i < points; i++) {
        const x = Math.random() * 2 - 1;
        const y = Math.random() * 2 - 1;

        const distance = x * x + y * y;

        const canvasX = (x + 1) * 160;
        const canvasY = (y + 1) * 160;

        if (distance <= 1) {
            inside++;
            ctx.fillStyle = "#22c55e";
        } else {
            ctx.fillStyle = "#f97316";
        }

        ctx.fillRect(canvasX, canvasY, 3, 3);
    }

    const pi = (4 * inside / points).toFixed(4);

    document.getElementById("insideCount").innerText = inside;
    document.getElementById("totalPoints").innerText = points;
    document.getElementById("piEstimate").innerText = pi;

    document.getElementById("piFeedback").innerText =
        "More random points usually make the estimate closer to π, but it is still an approximation.";

    addScore(15);
}