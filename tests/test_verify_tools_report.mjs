import assert from "node:assert/strict";
import { execFile, execFileSync } from "node:child_process";
import { readFile, rm } from "node:fs/promises";
import { createServer } from "node:http";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const source = await readFile(new URL("../_projects/games/cs-pathway/model/verifyToolsReport.js", import.meta.url), "utf8");
const { parseVerifyToolsOutput } = await import(`data:text/javascript;charset=utf-8,${encodeURIComponent(source)}`);

// Real output from scripts/verifyToolsTerminal.sh on a Mac (one warning, one failure).
const MAC_OUTPUT = `Environment verification for /Users/student/blueprints_pages
Detected platform: macos

Tool installations
[PASS] git installed
[PASS] ruby installed
[PASS] bundler installed
[PASS] python installed (python3)
[PASS] pip installed (pip3)
[PASS] java available
[PASS] node available

Repository and project setup
[PASS] git repository found at /Users/student/blueprints_pages
[PASS] _config.yml baseurl is consistent with repo name
[PASS] venv set up at /Users/student/blueprints_pages/venv
[PASS] Gemfile.lock present (bundle install has run)
[PASS] jekyll runs via bundle exec

Git identity
[PASS] git global user.name set
[PASS] git global user.email set
Summary: 14 passed, 1 warned, 1 failed
Overall: FAIL

Warnings and failures
[WARN] jupyter available
[FAIL] _config.yml github_repo matches repo directory name

Next steps
  - only needed for _notebooks/; install it with 'python3 -m pip install notebook' if you plan to use notebooks.
  - set github_repo to 'blueprints_pages' in _config.yml, or rename the local clone to match.`;

test("reads checks, counts, and next steps from verifier output", () => {
  const report = parseVerifyToolsOutput(MAC_OUTPUT);
  assert.equal(report.error, null);
  assert.equal(report.overall, "FAIL");
  assert.equal(report.ok, false);
  assert.deepEqual(report.counts, { passed: 14, warned: 1, failed: 1 });
  assert.equal(report.checks.length, 16);
  assert.deepEqual(report.checks.at(-1), { status: "FAIL", label: "_config.yml github_repo matches repo directory name" });
  assert.equal(report.nextSteps.length, 2);
  assert.match(report.nextSteps[1], /^set github_repo to 'blueprints_pages'/);
});

test("warnings alone still count as set up", () => {
  const report = parseVerifyToolsOutput("[PASS] git installed\n[WARN] java available\nSummary: 1 passed, 1 warned, 0 failed\nOverall: WARN");
  assert.equal(report.ok, true);
  assert.equal(report.overall, "WARN");
});

test("finds results inside extra Terminal text, Windows line endings, and colors", () => {
  const pasted = `ada@mac blueprints_pages % bash scripts/verifyToolsTerminal.sh\r\n\x1b[32m[PASS] git installed\x1b[0m\r\nSummary: 1 passed, 0 warned, 0 failed\r\nOverall: PASS\r\nada@mac blueprints_pages %`;
  const report = parseVerifyToolsOutput(pasted);
  assert.equal(report.ok, true);
  assert.equal(report.checks[0].label, "git installed");
});

test("text without verifier results asks for the whole output", () => {
  for (const pasted of ["", "zsh: permission denied: ./scripts/verifyToolsTerminal.sh", "[PASS] git installed"]) {
    const report = parseVerifyToolsOutput(pasted);
    assert.equal(report.ok, false);
    assert.match(report.error, /No verification results found/);
  }
});

// Contract test: run the real verifier here and make sure every result it prints is understood.
test("parses the real verifyToolsTerminal.sh output on this machine", () => {
  const script = fileURLToPath(new URL("../scripts/verifyToolsTerminal.sh", import.meta.url));
  let output;
  try {
    output = execFileSync("bash", [script], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  } catch (error) {
    output = error.stdout; // exit code 1 just means a check failed
  }
  const report = parseVerifyToolsOutput(output);
  assert.equal(report.error, null);
  assert.ok(["PASS", "WARN", "FAIL"].includes(report.overall));
  const { passed, warned, failed } = report.counts;
  assert.equal(report.checks.length, passed + warned + failed);
  assert.match(report.startedAt, /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);
  assert.ok(Number.isInteger(report.durationSeconds) && report.durationSeconds >= 0);
});

test("output from an older script without date and duration still parses", () => {
  const report = parseVerifyToolsOutput(MAC_OUTPUT);
  assert.equal(report.startedAt, null);
  assert.equal(report.durationSeconds, null);
});

test("reads when the checks ran and how long they took", () => {
  const report = parseVerifyToolsOutput(
    "Started: 2026-10-06 09:51:35 PDT\n[PASS] git installed\n\nDuration: 3 seconds\nSummary: 1 passed, 0 warned, 0 failed\nOverall: PASS",
  );
  assert.equal(report.startedAt, "2026-10-06 09:51:35 PDT");
  assert.equal(report.durationSeconds, 3);
});

// --report is how the game gets results without copy and paste: the script must
// send exactly what it printed and keep a copy in setup-report.md.
test("--report saves the results to setup-report.md and sends them to the upload URL", async () => {
  const script = fileURLToPath(new URL("../scripts/verifyToolsTerminal.sh", import.meta.url));
  const reportFile = new URL("../setup-report.md", import.meta.url);
  const uploads = [];
  const server = createServer((request, response) => {
    let body = "";
    request.on("data", (chunk) => (body += chunk));
    request.on("end", () => {
      uploads.push({ method: request.method, url: request.url, contentType: request.headers["content-type"], body });
      response.end('{"saved":true}');
    });
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const uploadUrl = `http://127.0.0.1:${server.address().port}/api/cs-pathway/setup-report/ABCD2345`;

  let stdout;
  try {
    // Not execFileSync: it would block this process, and the server above could not answer.
    ({ stdout } = await promisify(execFile)("bash", [script, "--report", uploadUrl], { encoding: "utf8" }));
  } catch (error) {
    stdout = error.stdout; // exit code 1 just means a check failed
  } finally {
    server.close();
  }

  try {
    assert.equal(uploads.length, 1);
    assert.equal(uploads[0].method, "POST");
    assert.equal(uploads[0].url, "/api/cs-pathway/setup-report/ABCD2345");
    assert.equal(uploads[0].contentType, "text/plain");
    const uploaded = parseVerifyToolsOutput(uploads[0].body);
    assert.equal(uploaded.error, null);
    assert.deepEqual(uploaded, parseVerifyToolsOutput(stdout));
    assert.match(stdout, /Sent these results to the game/);

    const saved = await readFile(reportFile, "utf8");
    assert.match(saved, /^# Setup report/);
    assert.ok(saved.includes(uploads[0].body));
  } finally {
    await rm(reportFile, { force: true });
  }
});

test("--report refuses anything that is not an https or localhost upload URL", () => {
  const script = fileURLToPath(new URL("../scripts/verifyToolsTerminal.sh", import.meta.url));
  for (const badUrl of ["", "ABCD2345", "http://example.com/api/cs-pathway/setup-report/ABCD2345"]) {
    assert.throws(
      () => execFileSync("bash", [script, "--report", badUrl], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }),
      (error) => error.status === 2 && /not an upload URL/.test(error.stderr),
    );
  }
});
