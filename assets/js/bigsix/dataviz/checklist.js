// ============================================================
//  checklist.js — Single Responsibility: Completion checklist + export
//  Path: assets/js/bigsix/dataviz/checklist.js
//
//  Owns everything related to Step 6:
//    - Rendering checklist items
//    - Toggling checked state
//    - Exporting progress as JSON
//
//  EXPORTS:
//    initChecklist(checklist)
// ============================================================

// ============================================================
//  WORKER 1 — renderChecklist
//  Single responsibility: build checklist item DOM.
// ============================================================
function renderChecklist(checklist) {
    const container = document.getElementById('checklistItems');
    if (!container) return;
    container.innerHTML = '';
  
    checklist.forEach(item => {
      const div = document.createElement('div');
      div.className = 'checklist-item';
  
      const cb = document.createElement('input');
      cb.type      = 'checkbox';
      cb.className = 'ck';
      cb.value     = item.value;
  
      const lbl = document.createElement('span');
      lbl.textContent = item.label;
  
      div.appendChild(cb);
      div.appendChild(lbl);
  
      // Toggle green style on the row
      cb.addEventListener('change', () => div.classList.toggle('checked', cb.checked));
  
      // Clicking anywhere on the row toggles the checkbox
      div.addEventListener('click', e => {
        if (e.target !== cb) {
          cb.checked = !cb.checked;
          div.classList.toggle('checked', cb.checked);
        }
      });
  
      container.appendChild(div);
    });
  }
  
  // ============================================================
  //  WORKER 2 — exportNotes
  //  Single responsibility: collect checked items + notes and
  //  render a JSON export summary.
  // ============================================================
  function exportNotes() {
    const mastery = [...document.querySelectorAll('.ck')]
      .filter(x => x.checked)
      .map(x => x.value);
  
    const exportEl = document.getElementById('exportOut');
    if (!exportEl) return;
  
    exportEl.textContent = JSON.stringify({
      exported_at:       new Date().toISOString(),
      mastery_checklist: mastery,
      jpql_query:        document.getElementById('jpqlOut')?.textContent || '',
      specifications:    document.getElementById('specOut')?.textContent || '',
      pagination_result: document.getElementById('pageOut')?.textContent || '',
      notes:             document.getElementById('notes')?.value         || '',
    }, null, 2);
  }
  
  // ============================================================
  //  ORCHESTRATOR — initChecklist
  //  Renders checklist and wires the export button.
  // ============================================================
  export function initChecklist(checklist) {
    renderChecklist(checklist);
    document.getElementById('exportBtn')?.addEventListener('click', exportNotes);
  }