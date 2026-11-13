// MacSetupCheck.js
// "Set up & check my Mac" button + panel for Toolchain Trail (shown when macOS is
// the selected OS). A web page cannot run programs on the student's Mac, so the
// panel walks them through commands to paste into their own Terminal:
// turn on the Mac setup agent, run the install script, then the verifier.
// For a signed-in student the verify command sends its results to Spring, which
// saves them, and the panel shows them as soon as they arrive. Otherwise (or if
// sending fails) they paste the verifier's output back; pasted results are only
// shown, not saved. Styles: sass/setup-check.scss.
import { parseVerifyToolsOutput } from '../model/verifyToolsReport.js';
import { fetchLatestSetupReport, requestReportUploadUrl } from '../services/SetupReportApi.js';
import { copyToClipboard } from '../services/clipboard.js';

const VERIFY_SCRIPT = 'bash scripts/verifyToolsTerminal.sh';
const REPORT_POLL_INTERVAL_MS = 4000;

// Scripts are committed without the execute bit, so run them with bash.
const SETUP_STEPS = Object.freeze([
  {
    title: 'Turn on the Mac setup agent',
    command: 'source scripts/mac_setup_agent.zsh',
    detail: 'From now on, when a setup command fails in this Terminal, the agent prints a 💡 tip with the fix.',
  },
  {
    title: 'Install your tools',
    command: 'bash scripts/activate_macos.sh',
    detail: 'Installs Python, Ruby, and the class Ruby gems with Homebrew (install Homebrew from brew.sh first). This can take several minutes.',
  },
  {
    title: 'Load the new tools',
    command: 'source ~/.zshrc',
    detail: 'The install script adds the tools to your shell settings; this makes this Terminal use them.',
  },
  {
    title: 'Verify your tools',
    command: `${VERIFY_SCRIPT} | tee /dev/tty | pbcopy`,
    detail: 'Prints PASS, WARN, or FAIL for each check and copies the results to your clipboard.',
  },
]);
const AUTO_REPORT_DETAIL = 'Prints PASS, WARN, or FAIL for each check, saves them to setup-report.md, and sends them here.';

const SUMMARY_TEXT = {
  PASS: 'All checks passed. Your Mac is set up!',
  WARN: 'Set up, with warnings for optional tools. You can keep going.',
  FAIL: 'Some checks failed. Follow the next steps, then run the verify step again.',
};

class MacSetupCheck {
  constructor() {
    this.button = null;
    this.overlay = null;
    this.reportPollTimer = null;
    this.shownReportedAt = null;
  }

  setVisible(visible) {
    if (visible && !this.button) {
      this.button = document.createElement('button');
      this.button.type = 'button';
      this.button.className = 'cs-pathway-mac-check-button';
      this.button.textContent = '🍎 Set up & check my Mac';
      this.button.addEventListener('click', () => this.open());
      document.body.appendChild(this.button);
    } else if (!visible && this.button) {
      this.button.remove();
      this.button = null;
      this.close();
    }
  }

  open() {
    if (this.overlay) return;
    this.overlay = document.createElement('div');
    this.overlay.className = 'cs-pathway-mac-check';
    this.overlay.innerHTML = `
      <div class="cs-pathway-mac-check__dialog" role="dialog" aria-modal="true" aria-labelledby="mac-check-title">
        <button type="button" class="cs-pathway-mac-check__close" aria-label="Close">×</button>
        <h2 id="mac-check-title">Set up &amp; check my Mac</h2>
        <p>Open <strong>Terminal</strong> on your Mac and <code>cd</code> into your <code>blueprints_pages</code> folder.
          Then copy each command below into that Terminal, in order.</p>
        <ol class="cs-pathway-mac-check__steps"></ol>
        <p class="cs-pathway-mac-check__status" aria-live="polite"><strong>Last step:</strong> paste the verification results here.</p>
        <textarea rows="7" spellcheck="false" placeholder="Environment verification for ..."></textarea>
        <button type="button" class="cs-pathway-mac-check__submit">Check my results</button>
        <div class="cs-pathway-mac-check__results" aria-live="polite"></div>
      </div>`;

    const stepList = this.overlay.querySelector('.cs-pathway-mac-check__steps');
    SETUP_STEPS.forEach((step) => stepList.appendChild(this.renderStep(step)));
    this.startAutomaticReport(stepList.lastElementChild);

    this.overlay.querySelector('.cs-pathway-mac-check__close').addEventListener('click', () => this.close());
    this.overlay.querySelector('.cs-pathway-mac-check__submit').addEventListener('click', () => this.showResults());
    this.overlay.addEventListener('click', (event) => {
      if (event.target === this.overlay) this.close();
    });
    // Keep typing in the panel from moving the player; Escape closes it.
    this.overlay.addEventListener('keydown', (event) => {
      event.stopPropagation();
      if (event.key === 'Escape') this.close();
    });

    document.body.appendChild(this.overlay);
    this.overlay.querySelector('.cs-pathway-mac-check__copy')?.focus();
  }

  renderStep(step) {
    const item = document.createElement('li');
    item.className = 'cs-pathway-mac-check__step';

    const title = document.createElement('strong');
    title.textContent = step.title;

    const commandRow = document.createElement('div');
    commandRow.className = 'cs-pathway-mac-check__command';
    const command = document.createElement('code');
    command.textContent = step.command;
    const copyButton = document.createElement('button');
    copyButton.type = 'button';
    copyButton.className = 'cs-pathway-mac-check__copy';
    copyButton.textContent = 'Copy';
    // Read the command when clicked: the verify step's command changes once a report code arrives.
    copyButton.addEventListener('click', () => copyToClipboard(command.textContent, copyButton));
    commandRow.append(command, copyButton);

    const detail = document.createElement('p');
    detail.className = 'cs-pathway-mac-check__note';
    detail.textContent = step.detail;

    item.append(title, commandRow, detail);
    return item;
  }


  // Switches the verify step to the command that uploads its results, then watches for them.
  // Without a sign-in or a reachable server the paste flow above stays as it is.
  async startAutomaticReport(verifyStepItem) {
    const overlay = this.overlay;
    let uploadUrl;
    try {
      ({ uploadUrl } = await requestReportUploadUrl());
    } catch (error) {
      console.warn('[MacSetupCheck] automatic results unavailable, using paste:', error);
      return;
    }
    if (this.overlay !== overlay) return; // closed while waiting

    verifyStepItem.querySelector('code').textContent = `${VERIFY_SCRIPT} --report ${uploadUrl}`;
    verifyStepItem.querySelector('.cs-pathway-mac-check__note').textContent = AUTO_REPORT_DETAIL;
    verifyStepItem.querySelector('.cs-pathway-mac-check__copy').textContent = 'Copy';
    overlay.querySelector('.cs-pathway-mac-check__status').textContent =
      'Your results will show up below by themselves after the verify step. If they do not, paste them here.';

    this.shownReportedAt = null;
    this.showUploadedReport();
    this.reportPollTimer = setInterval(() => this.showUploadedReport(), REPORT_POLL_INTERVAL_MS);
  }

  async showUploadedReport() {
    const overlay = this.overlay;
    let uploaded;
    try {
      uploaded = await fetchLatestSetupReport();
    } catch (error) {
      // Keep polling: one failed check (Wi-Fi blip, server restart) should not end the wait.
      console.warn('[MacSetupCheck] could not check for uploaded results:', error);
      return;
    }
    if (this.overlay !== overlay || !uploaded || uploaded.reportedAt === this.shownReportedAt) return;

    this.shownReportedAt = uploaded.reportedAt;
    this.renderReport(parseVerifyToolsOutput(uploaded.report));
    const sentAt = new Date(uploaded.reportedAt).toLocaleString();
    overlay.querySelector('.cs-pathway-mac-check__status').textContent =
      `Results sent from your Terminal on ${sentAt}. Run the verify step again after fixing anything.`;
  }

  showResults() {
    this.renderReport(parseVerifyToolsOutput(this.overlay.querySelector('textarea').value));
  }

  renderReport(report) {
    const results = this.overlay.querySelector('.cs-pathway-mac-check__results');
    results.replaceChildren();

    const summary = document.createElement('p');
    summary.className = 'cs-pathway-mac-check__summary';
    if (report.error) {
      summary.textContent = report.error;
      summary.classList.add('is-error');
      results.appendChild(summary);
      return;
    }
    const counts = report.counts
      ? ` (${report.counts.passed} passed, ${report.counts.warned} warned, ${report.counts.failed} failed)`
      : '';
    summary.textContent = SUMMARY_TEXT[report.overall] + counts;
    summary.classList.add(report.overall === 'PASS' ? 'is-ok' : report.overall === 'WARN' ? 'is-partial' : 'is-error');
    results.appendChild(summary);

    if (report.startedAt) {
      const timing = document.createElement('p');
      timing.className = 'cs-pathway-mac-check__note';
      const took = report.durationSeconds === null ? '' : `, took ${report.durationSeconds} second${report.durationSeconds === 1 ? '' : 's'}`;
      timing.textContent = `Checked on ${report.startedAt}${took}.`;
      results.appendChild(timing);
    }

    const list = document.createElement('ul');
    for (const check of report.checks) {
      const item = document.createElement('li');
      item.className = `is-${check.status.toLowerCase()}`;
      const icon = check.status === 'PASS' ? '✓' : check.status === 'WARN' ? '!' : '✗';
      item.textContent = `${icon} ${check.label}`;
      list.appendChild(item);
    }
    results.appendChild(list);

    if (report.nextSteps.length > 0) {
      const heading = document.createElement('p');
      heading.className = 'cs-pathway-mac-check__next-heading';
      heading.textContent = 'Next steps';
      const steps = document.createElement('ul');
      steps.className = 'cs-pathway-mac-check__next-steps';
      report.nextSteps.forEach((text) => {
        const step = document.createElement('li');
        step.textContent = text;
        steps.appendChild(step);
      });
      results.append(heading, steps);
    }
  }

  close() {
    clearInterval(this.reportPollTimer);
    this.reportPollTimer = null;
    this.overlay?.remove();
    this.overlay = null;
  }

  destroy() {
    this.setVisible(false);
  }
}

export default MacSetupCheck;
