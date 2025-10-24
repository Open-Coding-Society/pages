const form = document.getElementById("breach-form");
const consoleLog = document.getElementById("console-log");
const secureToggle = document.getElementById("secure-toggle");
const indicatorBreach = document.getElementById("indicator-breach");
const indicatorTelemetry = document.getElementById("indicator-telemetry");

const AGENT_DB = [
  { codename: "GhostWolf", passcode: "hunter2", clearance: "Top Secret" },
  { codename: "NightFox", passcode: "wrath238", clearance: "Secret" },
  { codename: "AstraZero", passcode: "blueNova!", clearance: "Confidential" },
];

const PAYLOAD = "' OR '1'='1";

const templates = {
  insecure: (codename, passcode) =>
    `SELECT * FROM agents WHERE codename = '${codename}' AND passcode = '${passcode}';`,
  secure: "SELECT * FROM agents WHERE codename = ? AND passcode = ?;",
};

const printToConsole = (lines) => {
  consoleLog.textContent = `$ ${lines.join("\n$ ")}`;
};

const setIndicators = ({ breach, message }) => {
  indicatorBreach.textContent = `Breach Status: ${breach ? "ACTIVE" : "CONTAINED"}`;
  indicatorTelemetry.textContent = `Telemetry: ${message}`;

  indicatorBreach.classList.remove("indicator--neutral", "indicator--breach", "indicator--safe");
  indicatorTelemetry.classList.remove("indicator--neutral", "indicator--breach", "indicator--safe");

  if (breach) {
    indicatorBreach.classList.add("indicator--breach");
    indicatorTelemetry.classList.add("indicator--breach");
  } else {
    indicatorBreach.classList.add("indicator--safe");
    indicatorTelemetry.classList.add("indicator--safe");
  }
};

const runQuery = (codename, passcode, secureMode) => {
  const isPayload = codename.includes(PAYLOAD) || passcode.includes(PAYLOAD);

  if (!secureMode && isPayload) {
    return {
      query: templates.insecure(codename, passcode),
      rows: AGENT_DB,
      breach: true,
      message: "All agent records leaked. Wormhole remains open.",
    };
  }

  const matched = AGENT_DB.filter(
    (agent) => agent.codename === codename && agent.passcode === passcode,
  );

  return {
    query: secureMode ? templates.secure : templates.insecure(codename, passcode),
    rows: matched,
    breach: matched.length === 0,
    message:
      matched.length === 0
        ? "Payload treated as literal text. Wormhole collapse confirmed."
        : `Agent ${matched[0].codename} authenticated with clearance ${matched[0].clearance}.`,
  };
};

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const codename = form.codename.value.trim();
  const passcode = form.passcode.value.trim();
  const secureMode = secureToggle.checked;

  const result = runQuery(codename, passcode, secureMode);
  const rowsDisplay =
    result.rows.length > 0
      ? result.rows.map((row, index) => `${index + 1}. ${row.codename} — ${row.clearance}`).join("\n  ")
      : "0 rows returned";

  printToConsole([
    result.query,
    "",
    "Result:",
    rowsDisplay,
    "",
    secureMode ? "[Secure Mode ENABLED]" : "[Secure Mode DISABLED]",
  ]);

  setIndicators({ breach: result.breach, message: result.message });
});

form.codename.value = "GhostWolf";
form.passcode.value = "hunter2";
