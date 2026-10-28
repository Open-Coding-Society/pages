// Linux, Kasm, and Windows/WSL setup-check panel for Toolchain Trail.
// macOS keeps using MacSetupCheck.js and its existing implementation.
// Like the Mac panel, a signed-in student gets a check command that sends the
// report to Spring, and the panel shows it when it arrives; otherwise (or if
// sending fails) they paste it, and pasted reports are only shown, not saved.
import { getReportUploadCommand, getSystemSetupConfig, parseSystemSetupReport } from '../model/systemSetupReport.js';
import { fetchLatestSetupReport, requestReportUploadUrl } from '../services/SetupReportApi.js';
import { copyToClipboard } from '../services/clipboard.js';

const REPORT_POLL_INTERVAL_MS = 4000;

class SystemSetupCheck {
  constructor() {
    this.os = null;
    this.button = null;
    this.overlay = null;
    this.command = '';
    this.reportPollTimer = null;
    this.shownReportedAt = null;
  }

  setOS(os) {
    const config = getSystemSetupConfig(os);
    this.close();
    this.os = config ? os : null;

    if (!config) {
      this.button?.remove();
      this.button = null;
      return;
    }

    if (!this.button) {
      this.button = document.createElement('button');
      this.button.type = 'button';
      this.button.className = 'cs-pathway-system-check-button';
      this.button.addEventListener('click', () => this.open());
      document.body.appendChild(this.button);
    }
    this.button.textContent = `${config.icon} Check my ${config.label} setup`;
  }

  open() {
    if (this.overlay || !this.os) return;
    const config = getSystemSetupConfig(this.os);
    if (!config) return;

    this.overlay = document.createElement('div');
    this.overlay.className = 'cs-pathway-system-check';
    this.overlay.innerHTML = `
      <div class="cs-pathway-system-check__dialog" role="dialog" aria-modal="true" aria-labelledby="system-check-title">
        <button type="button" class="cs-pathway-system-check__close" aria-label="Close">×</button>
        <h2 id="system-check-title">${config.icon} Check my ${this._escape(config.label)} setup</h2>
        <p><strong>1.</strong> In your ${this._escape(config.terminalName)}, go to your <code>blueprints_pages</code> folder and run:</p>
        <div class="cs-pathway-system-check__command">
          <code></code>
          <button type="button" class="cs-pathway-system-check__copy">Copy command</button>
        </div>
        <p class="cs-pathway-system-check__note">The agent only reads versions and settings; it does not install or change anything.
          ${this.os === 'windows' ? 'Run this inside WSL Ubuntu. The report is also copied to the Windows clipboard when <code>clip.exe</code> is available.' : ''}</p>
        <p class="cs-pathway-system-check__status" aria-live="polite"><strong>2.</strong> Paste the report here:</p>
        <textarea rows="7" spellcheck="false" placeholder="=== ${config.reportSystem} SETUP CHECK v1 === ..."></textarea>
        <button type="button" class="cs-pathway-system-check__submit">Check my setup</button>
        <div class="cs-pathway-system-check__results" aria-live="polite"></div>
      </div>`;

    this.command = config.command;
    this.overlay.querySelector('.cs-pathway-system-check__command code').textContent = config.command;
    this.overlay.querySelector('.cs-pathway-system-check__close').addEventListener('click', () => this.close());
    this.overlay.querySelector('.cs-pathway-system-check__copy').addEventListener('click', (event) => copyToClipboard(this.command, event.currentTarget));
    this.overlay.querySelector('.cs-pathway-system-check__submit').addEventListener('click', () => this.showResults());
    this.overlay.addEventListener('click', (event) => {
      if (event.target === this.overlay) this.close();
    });
    this.overlay.addEventListener('keydown', (event) => {
      event.stopPropagation();
      if (event.key === 'Escape') this.close();
    });

    document.body.appendChild(this.overlay);
    this.overlay.querySelector('textarea').focus();
    this.startAutomaticReport();
  }

  // Switches to the command that uploads its report, then watches for it.
  // Without a sign-in or a reachable server the paste flow stays as it is.
  async startAutomaticReport() {
    const overlay = this.overlay;
    let uploadUrl;
    try {
      ({ uploadUrl } = await requestReportUploadUrl());
    } catch (error) {
      console.warn('[SystemSetupCheck] automatic results unavailable, using paste:', error);
      return;
    }
    if (this.overlay !== overlay) return; // closed while waiting

    this.command = getReportUploadCommand(this.os, uploadUrl);
    overlay.querySelector('.cs-pathway-system-check__command code').textContent = this.command;
    overlay.querySelector('.cs-pathway-system-check__copy').textContent = 'Copy command';
    overlay.querySelector('.cs-pathway-system-check__status').textContent =
      'Your report will show up below by itself after you run the command, and is saved to setup-report.md. If it does not, paste it here.';

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
      console.warn('[SystemSetupCheck] could not check for uploaded results:', error);
      return;
    }
    if (this.overlay !== overlay || !uploaded || uploaded.reportedAt === this.shownReportedAt) return;
    this.shownReportedAt = uploaded.reportedAt;

    // The latest report may come from another system (e.g. an earlier Mac check); leave it out.
    const report = parseSystemSetupReport(uploaded.report, this.os);
    if (report.error) return;
    this.renderReport(report);
    const sentAt = new Date(uploaded.reportedAt).toLocaleString();
    overlay.querySelector('.cs-pathway-system-check__status').textContent =
      `Report sent from your terminal on ${sentAt}. Run the command again after fixing anything.`;
  }

  showResults() {
    this.renderReport(parseSystemSetupReport(this.overlay.querySelector('textarea').value, this.os));
  }

  renderReport(report) {
    const results = this.overlay.querySelector('.cs-pathway-system-check__results');
    results.replaceChildren();

    const summary = document.createElement('p');
    summary.className = 'cs-pathway-system-check__summary';
    if (report.error) {
      summary.textContent = report.error;
      summary.classList.add('is-error');
      results.appendChild(summary);
      return;
    }
    summary.textContent = report.ok
      ? `All ${report.totalCount} checks passed. Your setup is ready!`
      : `${report.passedCount} of ${report.totalCount} checks passed. Fix the items marked ✗, then run the agent again.`;
    summary.classList.add(report.ok ? 'is-ok' : 'is-partial');
    results.appendChild(summary);

    if (report.startedAt) {
      const timing = document.createElement('p');
      timing.className = 'cs-pathway-system-check__note';
      const took = report.durationSeconds === null ? '' : `, took ${report.durationSeconds} second${report.durationSeconds === 1 ? '' : 's'}`;
      timing.textContent = `Checked on ${report.startedAt}${took}.`;
      results.appendChild(timing);
    }

    const list = document.createElement('ul');
    for (const item of report.checks) {
      const row = document.createElement('li');
      row.className = item.passed ? 'is-pass' : 'is-fail';
      const label = document.createElement('span');
      label.textContent = `${item.passed ? '✓' : '✗'} ${item.label}`;
      row.appendChild(label);
      if (item.fix) {
        const fix = document.createElement('code');
        fix.textContent = item.fix;
        row.appendChild(fix);
      }
      list.appendChild(row);
    }
    results.appendChild(list);
  }

  close() {
    clearInterval(this.reportPollTimer);
    this.reportPollTimer = null;
    this.overlay?.remove();
    this.overlay = null;
  }

  destroy() {
    this.close();
    this.button?.remove();
    this.button = null;
    this.os = null;
  }

  _escape(value = '') {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }
}

export default SystemSetupCheck;
