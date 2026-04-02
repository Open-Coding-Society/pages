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
//    QueryBuilder
// ============================================================

export class QueryBuilder {
  #config;
  #db;
  #getNextId;

  constructor(config, db, getNextId) {
    this.#config    = config;
    this.#db        = db;
    this.#getNextId = getNextId;
  }

  // ============================================================
  //  PRIVATE WORKER 1 — #checkKata
  //  Single responsibility: validate the derived query method signature.
  // ============================================================
  #checkKata() {
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
  //  PRIVATE WORKER 2 — #cheatFill
  //  Single responsibility: populate builder fields with random data.
  // ============================================================
  #cheatFill() {
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];
    document.getElementById('bName').value   = pick(this.#config.CHEAT_NAMES) + ' Inc';
    document.getElementById('bLoc').value    = pick(this.#config.CHEAT_CITIES);
    document.getElementById('bSize').value   = Math.floor(Math.random() * 1800) + 20;
    document.getElementById('bSkills').value = pick(this.#config.CHEAT_SKILLS);
  }

  // ============================================================
  //  PRIVATE WORKER 3 — #builderAdd
  //  Single responsibility: validate builder form and push a new
  //  company to the shared db array.
  // ============================================================
  #builderAdd() {
    const name = (document.getElementById('bName')?.value || '').trim();
    if (!name) { document.getElementById('bOut').textContent = '⚠ Please enter a company name.'; return; }
    const obj = {
      id:       this.#getNextId(),
      name,
      industry: document.getElementById('bInd')?.value || 'Unknown',
      location: (document.getElementById('bLoc')?.value || 'Unknown').trim(),
      size:     Math.max(0, Number(document.getElementById('bSize')?.value) || 0),
      skills:   (document.getElementById('bSkills')?.value || '').split(',').map(s => s.trim()).filter(Boolean),
    };
    this.#db.push(obj);
    document.getElementById('bOut').textContent = '✅ Company added:\n' + JSON.stringify(obj, null, 2);
  }

  // ============================================================
  //  PRIVATE WORKER 4 — #enableFilters
  //  Single responsibility: toggle filter inputs based on checkboxes.
  // ============================================================
  #enableFilters() {
    [['qLoc','vLoc'],['qInd','vInd'],['qSize','vSize'],['qSkill','vSkill']].forEach(([cId, iId]) => {
      const on = document.getElementById(cId)?.checked;
      const inp = document.getElementById(iId);
      if (!inp) return;
      inp.disabled = !on;
      if (!on) inp.value = '';
    });
  }

  // ============================================================
  //  PRIVATE WORKER 5 — #buildQuery
  //  Single responsibility: read filter state and generate
  //  JPQL + Specifications strings.
  // ============================================================
  #buildQuery() {
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
  //  init — Wires all buttons for steps 2 and 3.
  // ============================================================
  init() {
    document.getElementById('kataBtn')?.addEventListener('click', () => this.#checkKata());
    document.getElementById('cheatBtn')?.addEventListener('click', () => this.#cheatFill());
    document.getElementById('builderBtn')?.addEventListener('click', () => this.#builderAdd());
    document.getElementById('buildQueryBtn')?.addEventListener('click', () => this.#buildQuery());

    ['qLoc','qInd','qSize','qSkill'].forEach(id =>
      document.getElementById(id)?.addEventListener('change', () => this.#enableFilters())
    );
    this.#enableFilters();
  }
}
