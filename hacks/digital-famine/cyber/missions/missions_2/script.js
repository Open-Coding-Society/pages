const form = document.getElementById("lab-form");
const codenameInput = document.getElementById("input-codename");
const passcodeInput = document.getElementById("input-passcode");
const toggleSecure = document.getElementById("toggle-secure");

const logOutput = document.getElementById("log-output");
const indicatorBreach = document.getElementById("indicator-breach");
const indicatorTelemetry = document.getElementById("indicator-telemetry");
const meterBar = document.getElementById("meter-bar");
const meterStatus = document.getElementById("meter-status");
const wormhole = document.getElementById("wormhole");
const badgeStatus = document.getElementById("badge-status");
const badgeCode = document.getElementById("badge-code");
const successCode = document.getElementById("success-code");

const attemptsEl = document.getElementById("stat-attempts");
const breachesEl = document.getElementById("stat-breaches");
const secureEl = document.getElementById("stat-secure");

const AGENT_DB = [
  { codename: "GhostWolf", passcode: "hunter2", clearance: "Top Secret" },
  { codename: "NightFox", passcode: "wrath238", clearance: "Secret" },
  { codename: "AstraZero", passcode: "blueNova!", clearance: "Confidential" },
];

const PAYLOAD = "' OR '1'='1";

const stats = {
  attempts: 0,
  breaches: 0,
  secureRuns: 0,
};

let threatLevel = 20;

const sqlTemplates = {
  insecure: (codename, passcode) =>
    `SELECT * FROM agents WHERE codename = '${codename}' AND passcode = '${passcode}';`,
  secure: "SELECT * FROM agents WHERE codename = ? AND passcode = ?;",
};

const renderStats = () => {
  attemptsEl.textContent = stats.attempts;
  breachesEl.textContent = stats.breaches;
  secureEl.textContent = stats.secureRuns;
};

const updateIndicators = ({ breach, message }) => {
  indicatorBreach.textContent = `Breach Status: ${breach ? "ACTIVE" : "CONTAINED"}`;
  indicatorTelemetry.textContent = `Telemetry: ${message}`;

  indicatorBreach.classList.toggle("breach", breach);
  indicatorTelemetry.classList.toggle("breach", breach);

  indicatorBreach.classList.toggle("safe", !breach);
  indicatorTelemetry.classList.toggle("safe", !breach);
};

const updateMeter = ({ breach, neutralised, success }) => {
  if (breach) {
    threatLevel = Math.min(100, threatLevel + 40);
  } else if (neutralised) {
    threatLevel = Math.max(15, threatLevel - 35);
  } else if (success) {
    threatLevel = Math.max(15, threatLevel - 10);
  } else {
    threatLevel = Math.max(15, threatLevel - 5);
  }

  meterBar.style.width = `${threatLevel}%`;
  meterBar.classList.remove("warning", "danger");

  if (threatLevel > 70) {
    meterBar.classList.add("danger");
    meterStatus.textContent = "Status: Critical Breach";
    wormhole.classList.add("wormhole--unstable");
  } else if (threatLevel > 45) {
    meterBar.classList.add("warning");
    meterStatus.textContent = "Status: Breach Warning";
    wormhole.classList.add("wormhole--unstable");
  } else {
    meterStatus.textContent = "Status: Stable";
    wormhole.classList.remove("wormhole--unstable");
  }
};

const logResult = ({ query, rows, secureMode }) => {
  const rowsDisplay =
    rows.length > 0
      ? rows.map((row, index) => `${index + 1}. ${row.codename} — ${row.clearance}`).join("\n  ")
      : "0 rows returned";

  logOutput.textContent = [
    `$ ${query}`,
    "",
    "Result:",
    rowsDisplay,
    "",
    secureMode ? "[Secure Mode ENABLED]" : "[Secure Mode DISABLED]",
  ].join("\n");
};

const runQuery = (codename, passcode, secureMode) => {
  const isPayload = codename.includes(PAYLOAD) || passcode.includes(PAYLOAD);

  if (!secureMode && isPayload) {
    return {
      query: sqlTemplates.insecure(codename, passcode),
      rows: AGENT_DB,
      breach: true,
      neutralised: false,
      success: false,
      message: "All agent records leaked. Wormhole remains open.",
      secureMode,
    };
  }

  const matches = AGENT_DB.filter(
    (agent) => agent.codename === codename && agent.passcode === passcode,
  );

  const neutralised = secureMode && isPayload && matches.length === 0;

  return {
    query: secureMode ? sqlTemplates.secure : sqlTemplates.insecure(codename, passcode),
    rows: matches,
    breach: matches.length === 0,
    neutralised,
    success: matches.length > 0,
    message:
      matches.length === 0
        ? "Payload treated as literal text. Wormhole collapse confirmed."
        : `Agent ${matches[0].codename} authenticated with clearance ${matches[0].clearance}.`,
    secureMode,
  };
};

const updateBadges = ({ breach, neutralised }) => {
  if (breach) {
    badgeStatus.textContent = "ALERT: Wormhole open — payload bypassed authentication.";
    badgeStatus.classList.add("breach");
    badgeCode.textContent = "—";
    successCode.textContent = "Pending";
  } else if (neutralised) {
    badgeStatus.textContent = "Payload neutralised. Wormhole collapsing.";
    badgeStatus.classList.remove("breach");
    badgeCode.textContent = "BRAVO-4M8Q";
    successCode.textContent = "BRAVO-4M8Q";
  } else {
    badgeStatus.textContent = "Valid agent authenticated. Keep monitoring incoming traffic.";
    badgeStatus.classList.remove("breach");
    badgeCode.textContent = "BRAVO-4M8Q";
    successCode.textContent = "BRAVO-4M8Q";
  }
};

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const codename = codenameInput.value.trim();
  const passcode = passcodeInput.value.trim();
  const secureMode = toggleSecure.checked;

  const result = runQuery(codename, passcode, secureMode);

  stats.attempts += 1;
  if (result.breach && !result.neutralised) {
    stats.breaches += 1;
  }
  if (secureMode && (result.neutralised || result.success)) {
    stats.secureRuns += 1;
  }

  renderStats();
  logResult(result);
  updateIndicators(result);
  updateMeter(result);
  updateBadges(result);
});

codenameInput.value = "GhostWolf";
passcodeInput.value = "hunter2";
renderStats();
updateMeter({ breach: false, neutralised: false, success: true });
badgeStatus.textContent = "No breaches detected.";
badgeCode.textContent = "—";
successCode.textContent = "Pending";
