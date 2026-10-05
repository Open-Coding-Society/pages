// ============================================
// actionPanel.js
// RESPONSIBILITY: "Take action" tabs (volunteer / report / donate) and their forms.
// Any link with data-action-tab="<tab>" elsewhere on the page opens that tab.
// ============================================
import { submitVolunteer, submitHazardReport } from './srfscApi.js';
import { bindForm } from './srfscDom.js';

function selectTab(tabName) {
  document.querySelectorAll('.srfsc-tabs__tab').forEach((tab) => {
    tab.setAttribute('aria-selected', String(tab.dataset.tab === tabName));
  });
  document.querySelectorAll('[data-tab-panel]').forEach((panel) => {
    panel.hidden = panel.dataset.tabPanel !== tabName;
  });
}

/** @param {() => void} onSubmitted called after a successful volunteer signup or report */
export function initActionPanel(onSubmitted) {
  document.querySelectorAll('.srfsc-tabs__tab').forEach((tab) => {
    tab.addEventListener('click', () => selectTab(tab.dataset.tab));
  });
  // Hero and program links jump here with the right tab already open
  document.querySelectorAll('[data-action-tab]').forEach((link) => {
    link.addEventListener('click', () => selectTab(link.dataset.actionTab));
  });

  bindForm(document.getElementById('srfsc-volunteer-form'), {
    submitFn: submitVolunteer,
    successMessage: (result) => result.message,
    onSuccess: onSubmitted,
  });
  bindForm(document.getElementById('srfsc-report-form'), {
    submitFn: submitHazardReport,
    successMessage: (result) => `Report #${result.id} received. The council will review it. Thank you!`,
    onSuccess: onSubmitted,
  });
}
