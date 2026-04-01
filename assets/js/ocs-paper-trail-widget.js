import { pythonURI, javaURI, fetchOptions } from './api/config.js';

const OCS_PAPER_TRAIL_ID = 'ocs-paper-trail-widget';
const OCS_PAPER_TRAIL_TOGGLE = 'ocs-paper-trail-toggle';
const OCS_PAPER_TRAIL_BODY = 'ocs-paper-trail-body';
const OCS_PAPER_TRAIL_REFRESH = 'ocs-paper-trail-refresh';

function safeGet(source, keys, fallback = null) {
  if (!source || !keys || !Array.isArray(keys)) return fallback;
  for (const key of keys) {
    if (typeof source[key] !== 'undefined' && source[key] !== null) {
      return source[key];
    }
  }
  return fallback;
}

function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return '0m';
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }
  return `${minutes}m`;
}

function formatDate(value) {
  if (!value) return 'Unknown';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString(undefined, {
    weekday: 'short', month: 'short', day: 'numeric'
  });
}

function injectStyles() {
  if (document.getElementById('ocs-paper-trail-widget-styles')) return;
  const style = document.createElement('style');
  style.id = 'ocs-paper-trail-widget-styles';
  style.textContent = `
    #${OCS_PAPER_TRAIL_ID} {
      position: fixed;
      bottom: 18px;
      right: 18px;
      z-index: 10050;
      font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #f8fafc;
      width: min(380px, calc(100vw - 24px));
      box-sizing: border-box;
    }

    #${OCS_PAPER_TRAIL_ID} .paper-trail-toggle {
      width: 100%;
      border: none;
      border-radius: 28px;
      padding: 12px 18px;
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: white;
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 18px 50px rgba(15, 23, 42, 0.22);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    #${OCS_PAPER_TRAIL_ID} .paper-trail-panel {
      margin-top: 12px;
      background: rgba(15, 23, 42, 0.96);
      border: 1px solid rgba(148, 163, 184, 0.18);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 24px 60px rgba(15, 23, 42, 0.28);
      backdrop-filter: blur(10px);
    }

    #${OCS_PAPER_TRAIL_ID} .paper-trail-header {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 14px;
      padding: 20px 20px 0;
    }

    #${OCS_PAPER_TRAIL_ID} .paper-trail-title {
      font-size: 1rem;
      font-weight: 800;
      letter-spacing: 0.02em;
      margin: 0;
    }

    #${OCS_PAPER_TRAIL_ID} .paper-trail-subtitle {
      margin: 6px 0 0;
      font-size: 0.84rem;
      color: #94a3b8;
      line-height: 1.5;
    }

    #${OCS_PAPER_TRAIL_ID} .paper-trail-close {
      border: none;
      background: transparent;
      color: #cbd5e1;
      font-size: 1.35rem;
      cursor: pointer;
    }

    #${OCS_PAPER_TRAIL_ID} .paper-trail-content {
      padding: 0 20px 18px;
    }

    #${OCS_PAPER_TRAIL_ID} .paper-trail-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      margin-top: 18px;
    }

    #${OCS_PAPER_TRAIL_ID} .paper-trail-card {
      background: #0f172a;
      border: 1px solid rgba(148, 163, 184, 0.14);
      border-radius: 16px;
      padding: 14px 14px 16px;
    }

    #${OCS_PAPER_TRAIL_ID} .paper-trail-card h4 {
      margin: 0 0 6px;
      font-size: 0.82rem;
      color: #94a3b8;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      font-weight: 700;
    }

    #${OCS_PAPER_TRAIL_ID} .paper-trail-card p {
      margin: 0;
      font-size: 1.15rem;
      font-weight: 700;
      color: #f8fafc;
    }

    #${OCS_PAPER_TRAIL_ID} .paper-trail-body {
      margin-top: 14px;
    }

    #${OCS_PAPER_TRAIL_ID} .paper-trail-section {
      margin-top: 18px;
    }

    #${OCS_PAPER_TRAIL_ID} .paper-trail-section h3 {
      margin: 0 0 10px;
      font-size: 0.95rem;
      font-weight: 700;
      color: #e2e8f0;
    }

    #${OCS_PAPER_TRAIL_ID} .paper-trail-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: 10px;
    }

    #${OCS_PAPER_TRAIL_ID} .paper-trail-item {
      background: #111827;
      border: 1px solid rgba(148, 163, 184, 0.12);
      border-radius: 14px;
      padding: 12px 14px;
      font-size: 0.9rem;
      color: #cbd5e1;
      line-height: 1.5;
    }

    #${OCS_PAPER_TRAIL_ID} .paper-trail-item strong {
      color: #f8fafc;
    }

    #${OCS_PAPER_TRAIL_ID} .paper-trail-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-top: 16px;
    }

    #${OCS_PAPER_TRAIL_ID} .paper-trail-refresh {
      border: 1px solid rgba(148, 163, 184, 0.18);
      background: transparent;
      border-radius: 999px;
      padding: 10px 14px;
      color: #f8fafc;
      cursor: pointer;
      font-size: 0.9rem;
      transition: background 0.2s ease;
    }

    #${OCS_PAPER_TRAIL_ID} .paper-trail-refresh:hover {
      background: rgba(148, 163, 184, 0.08);
    }

    #${OCS_PAPER_TRAIL_ID} .paper-trail-status {
      font-size: 0.85rem;
      color: #94a3b8;
    }

    @media (max-width: 420px) {
      #${OCS_PAPER_TRAIL_ID} {
        right: 12px;
        left: 12px;
      }
    }
  `;
  document.head.appendChild(style);
}

function createWidgetMarkup() {
  return `
    <button id="${OCS_PAPER_TRAIL_TOGGLE}" class="paper-trail-toggle" type="button" aria-expanded="false" aria-controls="${OCS_PAPER_TRAIL_BODY}">
      <span>OCS Paper Trail</span>
      <span>📜</span>
    </button>
    <div class="paper-trail-panel" hidden>
      <div class="paper-trail-header">
        <div>
          <h2 class="paper-trail-title">Paper Trail Transparency</h2>
          <p class="paper-trail-subtitle">Student activity, session history, and issue signals in one dashboard.</p>
        </div>
        <button class="paper-trail-close" type="button" aria-label="Close paper trail panel">×</button>
      </div>
      <div id="${OCS_PAPER_TRAIL_BODY}" class="paper-trail-content">
        <p class="paper-trail-status">Loading your activity...</p>
      </div>
    </div>
  `;
}

function getSignalCards(summary, sessions, issues) {
  const signals = [];
  const totalSessions = Number(safeGet(summary, ['totalSessions', 'sessions', 'session_count'], 0));
  const totalTime = Number(safeGet(summary, ['totalTimeSpentSeconds', 'timeSpentSeconds', 'total_time_seconds'], 0));
  const recentIssues = Number(safeGet(summary, ['recentIssues', 'issuesGeneratedThisWeek', 'issue_count', 'issues_count'], null));
  const issueCount = Number(isNaN(recentIssues) ? 0 : recentIssues) || (issues ? issues.length : 0);
  const activeSessions = Array.isArray(sessions) ? sessions.filter(Boolean) : [];
  const docsMissing = activeSessions.filter((session) => {
    const documented = safeGet(session, ['documentation', 'notes', 'summary', 'hasDocumentation'], null);
    return documented === false || typeof documented === 'undefined';
  }).length;
  const averageSessionTime = activeSessions.length === 0 ? 0 : activeSessions.reduce((sum, session) => sum + Number(safeGet(session, ['sessionDurationSeconds', 'duration', 'timeSpentSeconds'], 0)), 0) / activeSessions.length;

  if (totalSessions === 0) {
    signals.push('No tracked coding sessions found yet. Start a new session and document your work to build your paper trail.');
  }
  if (issueCount === 0) {
    signals.push('No recent GitHub issues were generated. Create at least one issue to document the work you completed.');
  }
  if (activeSessions.length > 0 && averageSessionTime < 900) {
    signals.push('Your work sessions are shorter than 15 minutes. Try longer focused sessions for clearer progress signals.');
  }
  if (docsMissing > 0) {
    signals.push(`There are ${docsMissing} session${docsMissing === 1 ? '' : 's'} without documented notes. Add a short summary for each session.`);
  }
  if (signals.length === 0) {
    signals.push('Your paper trail looks healthy. Keep tracking your work and creating issues for new sessions.');
  }

  return signals.map((signal) => `<li class="paper-trail-item"><strong>Signal:</strong> ${signal}</li>`).join('');
}

function buildRecentSessions(sessions) {
  if (!Array.isArray(sessions) || sessions.length === 0) {
    return '<p class="paper-trail-status">No recent development sessions were recorded yet.</p>';
  }
  const recent = sessions.slice(-3).reverse();
  return `
    <ul class="paper-trail-list">
      ${recent.map((session) => {
        const title = safeGet(session, ['pageTitle', 'lessonTitle', 'activityName'], 'Session');
        const started = formatDate(safeGet(session, ['sessionStartTime', 'startedAt', 'startTime'], null));
        const duration = formatDuration(Number(safeGet(session, ['sessionDurationSeconds', 'durationSeconds', 'duration'], 0)));
        const files = safeGet(session, ['activeFiles', 'filesEdited', 'fileList'], []);
        const issueTag = safeGet(session, ['issueCount', 'createdIssues', 'issuesGenerated'], 0);

        const fileText = Array.isArray(files) && files.length > 0 ? files.slice(0, 3).join(', ') : 'No file activity tracked';
        return `
          <li class="paper-trail-item">
            <strong>${title}</strong><br />
            ${started} · ${duration}<br />
            ${fileText}<br />
            ${issueTag ? `<strong>Issues:</strong> ${issueTag}` : '<strong>Issues:</strong> none'}
          </li>
        `;
      }).join('')}
    </ul>
  `;
}

function buildIssueSummary(summary, issues) {
  const weeklyIssues = Number(safeGet(summary, ['recentIssues', 'issuesGeneratedThisWeek', 'issue_count', 'issues_count'], null));
  const issueCount = Number(isNaN(weeklyIssues) ? 0 : weeklyIssues) || (issues ? issues.length : 0);
  const issueList = Array.isArray(issues) && issues.length > 0 ? issues.slice(-3).map((issue) => {
    const title = safeGet(issue, ['title', 'issueTitle', 'name'], 'GitHub issue');
    const url = safeGet(issue, ['url', 'html_url', 'link'], '#');
    return `<li class="paper-trail-item"><strong><a href="${url}" target="_blank" rel="noreferrer noopener" style="color:#93c5fd;text-decoration:none;">${title}</a></strong></li>`;
  }).join('') : '<li class="paper-trail-item">No recent issue records available.</li>';

  return `
    <div class="paper-trail-section">
      <h3>Issue & Documentation Summary</h3>
      <div class="paper-trail-card">
        <h4>Generated issues</h4>
        <p>${issueCount}</p>
      </div>
      <ul class="paper-trail-list">${issueList}</ul>
    </div>
  `;
}

function buildSummaryGrid(summary, sessions, issues) {
  const totalSessions = Number(safeGet(summary, ['totalSessions', 'sessions', 'session_count'], 0));
  const totalTime = Number(safeGet(summary, ['totalTimeSpentSeconds', 'timeSpentSeconds', 'total_time_seconds'], 0));
  const completedLessons = Number(safeGet(summary, ['totalCompletions', 'completedLessons', 'lessonsCompleted'], 0));
  const activeFiles = Array.from(new Set([].concat(...(Array.isArray(sessions) ? sessions.map((session) => safeGet(session, ['activeFiles', 'filesEdited', 'fileList'], [])) : [])))).filter(Boolean);

  return `
    <div class="paper-trail-grid">
      <div class="paper-trail-card">
        <h4>Tracked sessions</h4>
        <p>${totalSessions}</p>
      </div>
      <div class="paper-trail-card">
        <h4>Time spent</h4>
        <p>${formatDuration(totalTime)}</p>
      </div>
      <div class="paper-trail-card">
        <h4>Lessons completed</h4>
        <p>${completedLessons}</p>
      </div>
      <div class="paper-trail-card">
        <h4>Files edited</h4>
        <p>${activeFiles.length > 0 ? activeFiles.slice(0, 4).join(', ') : 'No files tracked'}</p>
      </div>
    </div>
  `;
}

function buildWidgetContent(summary, sessions, issues) {
  return `
    ${buildSummaryGrid(summary, sessions, issues)}
    <div class="paper-trail-section">
      <h3>Activity signals</h3>
      <ul class="paper-trail-list">${getSignalCards(summary, sessions, issues)}</ul>
    </div>
    <div class="paper-trail-section">
      <h3>Recent sessions</h3>
      ${buildRecentSessions(sessions)}
    </div>
    ${buildIssueSummary(summary, issues)}
    <div class="paper-trail-footer">
      <button id="${OCS_PAPER_TRAIL_REFRESH}" class="paper-trail-refresh" type="button">Refresh</button>
      <div class="paper-trail-status">Updated live from OCS activity APIs.</div>
    </div>
  `;
}

function createContainer() {
  const widget = document.createElement('div');
  widget.id = OCS_PAPER_TRAIL_ID;
  widget.innerHTML = createWidgetMarkup();
  document.body.appendChild(widget);

  const toggle = document.getElementById(OCS_PAPER_TRAIL_TOGGLE);
  const closeButton = widget.querySelector('.paper-trail-close');
  const panel = widget.querySelector('.paper-trail-panel');
  const body = document.getElementById(OCS_PAPER_TRAIL_BODY);

  if (!toggle || !closeButton || !panel || !body) return;

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    panel.hidden = expanded;
    if (!expanded) {
      loadPaperTrailData(body);
    }
  });

  closeButton.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', 'false');
    panel.hidden = true;
  });
}

async function fetchJson(url) {
  const response = await fetch(url, fetchOptions);
  if (!response.ok) {
    const error = new Error(`Request failed: ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

async function fetchStudentSummary() {
  return await fetchJson(`${javaURI}/api/ocs-analytics/user/summary`);
}

async function fetchStudentSessions() {
  return await fetchJson(`${javaURI}/api/ocs-analytics/user/detailed`);
}

async function fetchStudentIssues() {
  try {
    return await fetchJson(`${pythonURI}/api/analytics/github/user/issues`);
  } catch (error) {
    return null;
  }
}

function showWidgetError(container, error) {
  container.innerHTML = `
    <p class="paper-trail-status">Unable to load paper trail.</p>
    <p class="paper-trail-status">${error.message || 'Please sign in or try again later.'}</p>
  `;
}

async function loadPaperTrailData(container) {
  container.innerHTML = '<p class="paper-trail-status">Refreshing activity data…</p>';

  try {
    const [summary, sessions, issues] = await Promise.all([
      fetchStudentSummary().catch(() => ({})),
      fetchStudentSessions().catch(() => []),
      fetchStudentIssues().catch(() => null)
    ]);

    const sessionList = Array.isArray(sessions) ? sessions : (safeGet(sessions, ['sessions', 'data'], []) || []);
    const widgetHTML = buildWidgetContent(summary, sessionList, issues);
    container.innerHTML = widgetHTML;

    const refreshButton = document.getElementById(OCS_PAPER_TRAIL_REFRESH);
    if (refreshButton) {
      refreshButton.addEventListener('click', () => loadPaperTrailData(container));
    }
  } catch (error) {
    showWidgetError(container, error);
  }
}

function initPaperTrailWidget() {
  if (document.getElementById(OCS_PAPER_TRAIL_ID)) return;
  injectStyles();
  createContainer();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPaperTrailWidget);
  } else {
    initPaperTrailWidget();
  }
}
