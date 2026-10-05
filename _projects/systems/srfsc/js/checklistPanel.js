// ============================================
// checklistPanel.js
// RESPONSIBILITY: Render the defensible-space checklist and its readiness meter.
// Scoring rules live in defensibleSpace.js; nothing leaves the browser.
// ============================================
import { CHECKLIST_ZONES, scoreChecklist } from './defensibleSpace.js';
import { createElement } from './srfscDom.js';

export function initChecklistPanel() {
  const container = document.getElementById('srfsc-checklist');
  const meterFill = document.getElementById('srfsc-meter-fill');
  const meterLabel = document.getElementById('srfsc-meter-label');
  const checked = new Set();

  const updateScore = () => {
    const score = scoreChecklist(checked);
    meterFill.style.width = `${score.percent}%`;
    meterFill.dataset.level = score.level;
    meterLabel.textContent = `${score.percent}% · ${score.label}`;
  };

  CHECKLIST_ZONES.forEach((zone) => {
    const group = createElement('fieldset', 'srfsc-zone');
    group.append(createElement('legend', 'srfsc-zone__title', zone.title));
    zone.items.forEach((item) => {
      const label = createElement('label', 'srfsc-zone__item');
      const box = document.createElement('input');
      box.type = 'checkbox';
      box.addEventListener('change', () => {
        if (box.checked) checked.add(item.id); else checked.delete(item.id);
        updateScore();
      });
      label.append(box, createElement('span', null, item.text));
      group.append(label);
    });
    container.append(group);
  });
  updateScore();
}
