// ============================================================
//  query-builder.js — Single Responsibility: Kata + Company builder + Query builder
//  Path: assets/js/bigsix/dataviz/query-builder.js
//
//  Owns Steps 2 and 3:
//    - Derived query kata check
//    - Company builder random fill and add
//    - Filter checkbox enable/disable
//    - JPQL and Specifications query generation
//
//  EXPORTS:
//    initQueryBuilder(config, db, nextId)
// ============================================================

// ============================================================
//  WORKER 1 — checkKata
//  Single responsibility: validate the derived query method signature.
// ============================================================
function checkKata() {
    const v  = (document.getElementById('kataIn')?.value || '').trim().replace(/\s+/g,' ');
    const ok = /^List\s*<\s*Company\s*>\s*findBySizeGreaterThan\s*\(\s*(Integer|int)\s+\w+\s*\)\s*;?\s*$/i.test(v);
    const el = document.getElementById('kataMsg');
    if (!el) return;
    el.textContent        = ok
      ? '✅ Correct! findBySizeGreaterThan follows Spring Data naming conventions.'
      : '❌ Not quite. Try: List<Company> findBySizeGreaterThan(Integer minSize);';
    el.style.background   = ok ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)';
    el.style.color        = ok ? '#86efac' : '#fca5a5';
    el.style.padding      = '8px 12px';
    el.style.borderRadius = '8px';
  }
  
  // ============================================================
  //  WORKER 2 — cheatFill
  //  Single responsibility: populate builder fields with random data.
  // ============================================================
  function cheatFill(config) {
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];
    document.getElementById('bName').value   = pick(config.CHEAT_NAMES) + ' Inc';
    document.getElementById('bLoc').value    = pick(config.CHEAT_CITIES);
    document.getElementById('bSize').value   = Math.floor(Math.random() * 1800) + 20;
    document.getElementById('bSkills').value = pick(config.CHEAT_SKILLS);
  }
  
  // ============================================================
  //  WORKER 3 — builderAdd
  //  Single responsibility: validate builder form and push a new
  //  company to the shared db array.
  // ============================================================
  function builderAdd(db, getNextId) {
    const name = (document.getElementById('bName')?.value || '').trim();
    if (!name) { document.getElementById('bOut').textContent = '⚠ Please enter a company name.'; return; }
    const obj = {
      id:       getNextId(),
      name,
      industry: document.getElementById('bInd')?.value || 'Unknown',
      location: (document.getElementById('bLoc')?.value || 'Unknown').trim(),
      size:     Math.max(0, Number(document.getElementById('bSize')?.value) || 0),
      skills:   (document.getElementById('bSkills')?.value || '').split(',').map(s => s.trim()).filter(Boolean),
    };
    db.push(obj);
    document.getElementById('bOut').textContent = '✅ Company added:\n' + JSON.stringify(obj, null, 2);
  }
  
  // ============================================================
  //  WORKER 4 — enableFilters
  //  Single responsibility: toggle filter inputs based on checkboxes.
  // ============================================================
  function enableFilters() {
    [['qLoc','vLoc'],['qInd','vInd'],['qSize','vSize'],['qSkill','vSkill']].forEach(([cId, iId]) => {
      const on = document.getElementById(cId)?.checked;
      const inp = document.getElementById(iId);
      if (!inp) return;
      inp.disabled = !on;
      if (!on) inp.value = '';
    });
  }
  
  // ============================================================
  //  WORKER 5 — buildQuery
  //  Single responsibility: read filter state and generate
  //  JPQL + Specifications strings.
  // ============================================================
  function buildQuery() {
    const $ = id => document.getElementById(id);
    const parts = [], spec = [];
  
    if ($('qLoc')?.checked && $('vLoc')?.value.trim()) {
      parts.push(`c.location = :location`);
      spec.push(`hasLocation("${$('vLoc').value.trim()}")`);
    }
    if ($('qInd')?.checked) {
      parts.push(`c.industry = :industry`);
      spec.push(`hasIndustry("${$('vInd')?.value}")`);
    }
    if ($('qSize')?.checked && $('vSize')?.value) {
      parts.push(`c.size >= :minSize`);
      spec.push(`hasMinSize(${$('vSize').value})`);
    }
    if ($('qSkill')?.checked && $('vSkill')?.value.trim()) {
      parts.push(`:skill MEMBER OF c.skills`);
      spec.push(`hasSkill("${$('vSkill').value.trim()}")`);
    }
  
    if ($('jpqlOut')) {
      $('jpqlOut').textContent = parts.length
        ? `SELECT c FROM Company c\nWHERE ${parts.join('\n  AND ')}`
        : 'SELECT c FROM Company c';
    }
    if ($('specOut')) {
      $('specOut').textContent = spec.length
        ? `Specification.where(${spec[0]})` + spec.slice(1).map(x => `\n  .and(${x})`).join('')
        : 'Specification.where(null)';
    }
  }
  
  // ============================================================
  //  ORCHESTRATOR — initQueryBuilder
  //  Wires all buttons for steps 2 and 3.
  // ============================================================
  export function initQueryBuilder(config, db, getNextId) {
    document.getElementById('kataBtn')?.addEventListener('click', checkKata);
    document.getElementById('cheatBtn')?.addEventListener('click', () => cheatFill(config));
    document.getElementById('builderBtn')?.addEventListener('click', () => builderAdd(db, getNextId));
    document.getElementById('buildQueryBtn')?.addEventListener('click', buildQuery);
  
    ['qLoc','qInd','qSize','qSkill'].forEach(id =>
      document.getElementById(id)?.addEventListener('change', enableFilters)
    );
    enableFilters();
  }