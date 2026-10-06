// ============================================
// srfscAdmin.js
// RESPONSIBILITY: Council admin panel — volunteer list, hazard report triage, posting updates/events.
// Stays hidden unless the backend confirms the viewer is an Admin.
// ============================================
import {
  fetchVolunteers, fetchHazardReports, updateReportStatus, createUpdate, createEvent, getAdminKey, setAdminKey,
} from './srfscApi.js';
import { bindForm, createElement } from './srfscDom.js';

const REPORT_STATUSES = ['New', 'Reviewed', 'Scheduled', 'Resolved'];

function renderVolunteers(container, volunteers) {
  container.replaceChildren();
  if (volunteers.length === 0) {
    container.append(createElement('p', 'srfsc-empty', 'No volunteer signups yet.'));
    return;
  }
  volunteers.forEach((volunteer) => {
    const row = createElement('div', 'srfsc-admin__row');
    row.append(
      createElement('strong', null, volunteer.name),
      createElement('span', null, volunteer.interest),
      createElement('span', null, [volunteer.email, volunteer.phone].filter(Boolean).join(' · ')),
      createElement('span', 'srfsc-admin__muted', volunteer.street || ''),
    );
    container.append(row);
  });
}

function buildStatusSelect(report) {
  const select = createElement('select', 'srfsc-admin__status');
  select.setAttribute('aria-label', `Status for report ${report.id}`);
  REPORT_STATUSES.forEach((status) => {
    const option = createElement('option', null, status);
    option.value = status;
    option.selected = status === report.status;
    select.append(option);
  });
  select.addEventListener('change', async () => {
    const previous = report.status;
    select.disabled = true;
    try {
      report.status = (await updateReportStatus(report.id, select.value)).status;
    } catch (error) {
      select.value = previous;
      alert(`Could not update report #${report.id}: ${error.message}`);
    } finally {
      select.disabled = false;
    }
  });
  return select;
}

function renderReports(container, reports) {
  container.replaceChildren();
  if (reports.length === 0) {
    container.append(createElement('p', 'srfsc-empty', 'No hazard reports yet.'));
    return;
  }
  reports.forEach((report) => {
    const row = createElement('div', 'srfsc-admin__row');
    row.append(
      createElement('strong', null, `#${report.id} ${report.hazard_type}`),
      createElement('span', null, report.location),
      createElement('span', 'srfsc-admin__muted', report.description),
      buildStatusSelect(report),
    );
    container.append(row);
  });
}

function bindPublishingForms() {
  bindForm(document.getElementById('srfsc-admin-update-form'), {
    submitFn: createUpdate,
    successMessage: (update) => `Published "${update.title}". It now shows on the Community page.`,
  });
  bindForm(document.getElementById('srfsc-admin-event-form'), {
    submitFn: createEvent,
    successMessage: (event) => `Added "${event.title}". It now shows on the Events page.`,
  });
}

let formsBound = false;

/** Reveal the admin tools only if the admin-only endpoints answer; otherwise explain why in the gate. */
async function unlockAdmin() {
  const gateMessage = document.getElementById('srfsc-admin-gate-message');
  try {
    const [volunteers, reports] = await Promise.all([fetchVolunteers(), fetchHazardReports()]);
    renderVolunteers(document.getElementById('srfsc-admin-volunteers'), volunteers);
    renderReports(document.getElementById('srfsc-admin-reports'), reports);
    if (!formsBound) { bindPublishingForms(); formsBound = true; }
    document.getElementById('srfsc-admin-gate').hidden = true;
    document.getElementById('srfsc-admin').hidden = false;
  } catch (error) {
    if (error.offline) {
      gateMessage.textContent = 'Admin tools need the SRFSC backend, which is not available on this server yet.';
    } else if (error.status === 401 || error.status === 403) {
      gateMessage.textContent = getAdminKey()
        ? `That key didn't work: ${error.message}`
        : 'This page is for council admins. Enter the council admin key to manage reports, volunteers, events, and updates.';
      setAdminKey('');
    } else {
      gateMessage.textContent = error.message;
    }
  }
}

export function initSrfscAdmin() {
  document.getElementById('srfsc-admin-key-form').addEventListener('submit', (submitEvent) => {
    submitEvent.preventDefault();
    const input = submitEvent.target.elements.admin_key;
    setAdminKey(input.value.trim());
    input.value = '';
    unlockAdmin();
  });
  document.getElementById('srfsc-admin-forget').addEventListener('click', () => {
    setAdminKey('');
    document.getElementById('srfsc-admin').hidden = true;
    document.getElementById('srfsc-admin-gate').hidden = false;
    document.getElementById('srfsc-admin-gate-message').textContent = 'Key cleared from this browser tab.';
  });
  return unlockAdmin();
}
