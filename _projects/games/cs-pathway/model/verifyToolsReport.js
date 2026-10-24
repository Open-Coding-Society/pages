// verifyToolsReport.js
// Parses the output of `bash scripts/verifyToolsTerminal.sh` pasted into the
// "Check my Mac setup" panel. Pure functions only, so the panel and its tests
// share one parser. This is self-reported output: it helps students find
// setup gaps, it is not proof that the tools are installed.

const MAX_PASTE_LENGTH = 20000;
const OVERALL_LINE = /^Overall:\s*(PASS|WARN|FAIL)\s*$/;
const SUMMARY_LINE = /^Summary:\s*(\d+) passed, (\d+) warned, (\d+) failed\s*$/;
const CHECK_LINE = /^\[(PASS|WARN|FAIL)\]\s+(.+)$/;
const NEXT_STEP_LINE = /^-\s+(.+)$/;
const STARTED_LINE = /^Started:\s*(.+)$/;
const DURATION_LINE = /^Duration:\s*(\d+) seconds?\s*$/;

/**
 * @returns {{ok: boolean, overall: string|null, error: string|null,
 *            checks: Array<{label: string, status: 'PASS'|'WARN'|'FAIL'}>,
 *            nextSteps: string[], counts: {passed: number, warned: number, failed: number}|null,
 *            startedAt: string|null, durationSeconds: number|null}}
 * startedAt and durationSeconds are null for output from older copies of the script.
 * ok is true for PASS and WARN: the verifier treats warnings (optional tools) as non-blocking.
 */
export function parseVerifyToolsOutput(pasted) {
  const text = String(pasted || '').slice(0, MAX_PASTE_LENGTH).replace(/\x1b\[[0-9;]*m/g, '');
  const lines = text.split(/\r?\n/).map((line) => line.trim());

  const overall = lines.map((line) => OVERALL_LINE.exec(line)).find(Boolean)?.[1] || null;
  if (!overall) {
    return failure('No verification results found. Run the verify step, then paste everything from "Environment verification" to the end.');
  }

  const checks = [];
  const nextSteps = [];
  let inNextSteps = false;
  for (const line of lines) {
    if (line === 'Next steps') {
      inNextSteps = true;
      continue;
    }
    const check = CHECK_LINE.exec(line);
    if (check) {
      checks.push({ status: check[1], label: check[2].trim() });
      continue;
    }
    const step = inNextSteps && NEXT_STEP_LINE.exec(line);
    if (step) nextSteps.push(step[1].trim());
  }

  const summary = lines.map((line) => SUMMARY_LINE.exec(line)).find(Boolean);
  const counts = summary
    ? { passed: Number(summary[1]), warned: Number(summary[2]), failed: Number(summary[3]) }
    : null;

  const startedAt = lines.map((line) => STARTED_LINE.exec(line)).find(Boolean)?.[1].trim() || null;
  const duration = lines.map((line) => DURATION_LINE.exec(line)).find(Boolean);
  const durationSeconds = duration ? Number(duration[1]) : null;

  return { ok: overall !== 'FAIL', overall, error: null, checks, nextSteps, counts, startedAt, durationSeconds };
}

function failure(error) {
  return { ok: false, overall: null, error, checks: [], nextSteps: [], counts: null, startedAt: null, durationSeconds: null };
}
