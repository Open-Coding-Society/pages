---
layout: cs-portfolio-lesson
title: "Search & Data Filtering with Spring Boot"
description: "Search & Data Filtering with Spring Boot"
permalink: /cs-portfolio-quest/data-viz/submodule_2/
parent: "Data Visualization"
team: "Applicators"
submodule: 2
categories: [CSP, Submodule, DataVisualization]
tags: [spring-boot, search, jpql, pagination]
author: "Applicators Team"
date: 2025-10-21
microblog: true
---

# Submodule 2 · Search & Data Filtering — **Concluding Module (Black · Interactive · Compact)**

<style>
:root{
  /* Dark default theme */
  --bg:#0b0b0b;
  --text:#e6e6e6;
  --muted:#c0c0c0; --muted-2:#999;
  --border:#2a2a2a;
  --panel:#141414; --panel-2:#1b1b1b;
  --accent:#60a5fa; --accent-2:#a78bfa;
}
*{box-sizing:border-box}
html,body{height:100%}
body{
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;
  background:var(--bg); color:var(--text);
  max-width:1200px; margin:0 auto; padding:20px; line-height:1.6;
}
.container{padding:28px 0}
h1,h2,h3{color:var(--text); margin-top:20px}
p,li,label,small{color:var(--muted)}
a{color:var(--accent); text-decoration:none}
a:hover{text-decoration:underline}

/* Cards / panels */
.card,.panel,.out{
  background:var(--panel);
  border:1px solid var(--border);
  border-radius:12px;
  padding:14px;
  margin:12px 0;
  color:var(--text);
}
.rule{border:none;border-top:1px solid var(--border);margin:18px 0}
.out,pre,code{
  background:var(--panel-2);
  border:1px solid var(--border);
  border-radius:10px;
  color:#f1f5f9;
  white-space:pre-wrap;
  word-break:break-word;
  font-family:ui-monospace,Consolas;
  font-size:13px;
  padding:10px;
}

/* Inputs / buttons */
input,textarea,select{
  width:100%;
  padding:10px;
  border:1px solid var(--border);
  border-radius:10px;
  background:var(--panel-2);
  color:var(--text);
  font-family:ui-monospace;
  font-size:13px;
  margin:8px 0;
}
textarea{min-height:110px}
button{
  background:var(--panel-2);
  color:var(--text);
  border:1px solid var(--border);
  padding:10px 14px;
  border-radius:10px;
  cursor:pointer;
  font-weight:700;
  margin:6px 6px 6px 0;
  transition:all .2s ease;
}
button:hover{
  transform:translateY(-1px);
  border-color:#555;
  background:#1e1e1e;
}

/* Grid */
.grid{display:grid; gap:12px}
.grid-2{grid-template-columns:repeat(2,minmax(0,1fr))}
.grid-3{grid-template-columns:repeat(3,minmax(0,1fr))}
@media(max-width:920px){.grid-3{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:640px){.grid-2,.grid-3{grid-template-columns:1fr}}

/* Pills / tables */
.badge{display:inline-block;border:1px solid var(--border);border-radius:999px;padding:2px 8px;color:#aaa;font-size:11px;margin-left:6px}
.pill{display:inline-block;padding:3px 8px;border-radius:999px;border:1px solid var(--border);color:#ccc}
.ok{border-color:#22c55e;color:#22c55e}
.warn{border-color:#f59e0b;color:#f59e0b}
.err{border-color:#ef4444;color:#ef4444}
.table th,.table td{border:1px solid var(--border);padding:10px;text-align:left;color:#ccc}

/* Quiz options */
.quiz .opt{
  border:1px solid var(--border);
  border-radius:10px;
  padding:10px;
  margin:6px 0;
  cursor:pointer;
  color:#ddd;
  background:var(--panel-2);
  transition:all .2s ease;
}
.quiz .opt.sel{border-color:#777;background:#1a1a1a}
.quiz .opt.good{border-color:#22c55e;background:#0f2b1b;color:#b6f5c2}
.quiz .opt.bad{border-color:#ef4444;background:#2b0f0f;color:#fbbebe}

/* Learning Recap grid (auto-fit, no overflow) */
.recap{
  display:grid;
  gap:12px;
  grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
  align-items:stretch;
}
.recap-block{
  border:1px solid var(--border);
  border-radius:12px;
  background:var(--panel);
  padding:14px;
  display:flex;
  flex-direction:column;
  gap:8px;
}
.recap-h{display:flex;align-items:center;justify-content:space-between}
.recap-title{font-weight:800;color:var(--text)}
.recap-chip{font-size:11px;color:#bbb;border:1px solid var(--border);border-radius:999px;padding:2px 8px;background:#1e1e1e}
.recap-list{display:grid;gap:8px;margin-top:6px}
.recap-row{display:grid;grid-template-columns:max-content 1fr;gap:10px;align-items:start}
.recap-key{color:#aaa;word-break:break-word}
.recap-val{color:#f3f4f6;min-width:0}
.recap-val code{background:var(--panel-2);color:#f3f4f6;border-radius:6px;padding:2px 6px;font-size:12px;white-space:normal;word-break:break-word}

/* Section desc */
.block-desc{
  background:linear-gradient(90deg,rgba(96,165,250,.1),rgba(167,139,250,.1));
  border-left:3px solid var(--accent);
  padding:8px 12px;
  border-radius:8px;
  color:#e2e8f0;
  font-size:14px;
  margin:6px 0 10px;
}

/* Nav tabs with gradient outline */
.nav{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0 14px;position:relative;isolation:isolate}
.nav button{
  position:relative;
  background:var(--panel);
  color:#eee;
  border:none;
  padding:10px 14px;
  border-radius:12px;
  cursor:pointer;
  font-weight:800;
  transition:all .25s ease;
  z-index:0;
}
.nav button::before{
  content:"";
  position:absolute; inset:0; border-radius:inherit; padding:1px;
  background:linear-gradient(90deg,#3b82f6,#8b5cf6,#10b981);
  -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
  -webkit-mask-composite:xor; mask-composite:exclude;
  pointer-events:none; z-index:-1;
}
.nav button:hover{
  animation:btn-bounce .18s ease-out, btn-vibrate .12s linear;
  color:#fff;
}
.nav button.active{
  box-shadow:0 0 0 3px rgba(59,130,246,.15) inset;
}
.nav button.active::before{
  background:linear-gradient(90deg,#60a5fa,#a78bfa,#34d399);
  box-shadow:0 0 10px rgba(96,165,250,.45);
}
@keyframes btn-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
@keyframes btn-vibrate{0%,100%{transform:translateX(0)}25%{transform:translateX(-.8px)}75%{transform:translateX(.8px)}}

/* Hidden helper */
.hidden{display:none}
.note{font-size:12px;color:#aaa}
</style>


<body>
<div class="container">
  <h1>Submodule 2: Search & Data Filtering — Conclusion <span class="badge">recap + interactive</span></h1>
  <p>This closing module cements core skills: derived queries, JPQL, Specifications, and Pageable. Use the widgets to prove mastery, then export your checklist.</p>

  <!-- Tabs -->
  <div class="nav" role="tablist" aria-label="Submodule 2 Navigation">
    <button class="active" data-tab="recap" role="tab" aria-selected="true" aria-controls="recap">Learning Recap</button>
    <button data-tab="builder" role="tab" aria-selected="false" aria-controls="builder">Final Query Builder</button>
    <button data-tab="paging" role="tab" aria-selected="false" aria-controls="paging">Pagination Lab</button>
    <button data-tab="scenario" role="tab" aria-selected="false" aria-controls="scenario">Scenario Checker</button>
    <button data-tab="quiz" role="tab" aria-selected="false" aria-controls="quiz">Exit Quiz</button>
    <button data-tab="checklist" role="tab" aria-selected="false" aria-controls="checklist">Checklist & Export</button>
  </div>

  <!-- LEARNING RECAP -->
  <section id="recap" class="card" role="tabpanel">
    <h3>Learning Recap</h3>
    <p class="block-desc"><strong>What this shows:</strong> A compact summary of the main techniques you practiced, grouped by topic. </p>

    <div class="recap">
      <!-- Column 1 -->
      <div class="recap-block">
        <div class="recap-h">
          <div class="recap-title">Derived Queries</div>
          <div class="recap-chip">Spring Data</div>
        </div>
        <div class="recap-list">
          <div class="recap-row"><div class="recap-key">Equality</div><div class="recap-val"><code>findByLocation(String)</code></div></div>
          <div class="recap-row"><div class="recap-key">Multi-field</div><div class="recap-val"><code>findByLocationAndIndustry(..)</code></div></div>
          <div class="recap-row"><div class="recap-key">Compare</div><div class="recap-val"><code>findByExperienceGreaterThan(..)</code></div></div>
          <div class="recap-row"><div class="recap-key">Like</div><div class="recap-val"><code>findByFirstNameContaining(..)</code></div></div>
          <div class="recap-row"><div class="recap-key">Order/Limit</div><div class="recap-val"><code>findTop10ByOrderByExperienceDesc()</code></div></div>
        </div>
      </div>

      <!-- Column 2 -->
      <div class="recap-block">
        <div class="recap-h">
          <div class="recap-title">JPQL & Native</div>
          <div class="recap-chip">@Query</div>
        </div>
        <div class="recap-list">
          <div class="recap-row"><div class="recap-key">Filter</div><div class="recap-val"><code>@Query("c.size &gt; :min")</code></div></div>
          <div class="recap-row"><div class="recap-key">Join</div><div class="recap-val"><code>JOIN c.skills s</code></div></div>
          <div class="recap-row"><div class="recap-key">Projection</div><div class="recap-val"><code>SELECT new DTO(...)</code></div></div>
          <div class="recap-row"><div class="recap-key">Native</div><div class="recap-val"><code>nativeQuery = true</code></div></div>
        </div>
      </div>

      <!-- Column 3 -->
      <div class="recap-block">
        <div class="recap-h">
          <div class="recap-title">Specs & Pageable</div>
          <div class="recap-chip">Advanced</div>
        </div>
        <div class="recap-list">
          <div class="recap-row"><div class="recap-key">Specs Chain</div><div class="recap-val"><code>where(a).and(b).or(c)</code></div></div>
          <div class="recap-row"><div class="recap-key">Optional</div><div class="recap-val"><code>return null;</code> to skip unused filters</div></div>
          <div class="recap-row"><div class="recap-key">Page</div><div class="recap-val"><code>findAll(Pageable)</code></div></div>
          <div class="recap-row"><div class="recap-key">Sort</div><div class="recap-val"><code>PageRequest.of(p,s,Sort)</code></div></div>
        </div>
      </div>
    </div>
  </section>

  <!-- FINAL QUERY BUILDER -->
  <section id="builder" class="card hidden" role="tabpanel">
    <h3>Final Query Builder</h3>
    <p class="block-desc"><strong>What this shows:</strong> A JPQL query and a matching Specification chain assembled from your criteria.</p>

    <div class="grid grid-2">
      <div class="panel">
        <label><input type="checkbox" id="qLoc"/> Filter by Location</label>
        <input id="vLoc" placeholder="e.g., NYC" disabled/>
        <label><input type="checkbox" id="qInd"/> Filter by Industry</label>
        <select id="vInd" disabled>
          <option>Tech</option><option>Finance</option><option>Healthcare</option><option>Education</option>
        </select>
        <label><input type="checkbox" id="qSkill"/> Require Skill</label>
        <input id="vSkill" placeholder="e.g., Java" disabled/>
        <label><input type="checkbox" id="qMinExp"/> Min Experience</label>
        <input id="vMinExp" type="number" min="0" placeholder="e.g., 5" disabled/>
        <label><input type="checkbox" id="qAny"/> Any of multiple skills</label>
        <input id="vAny" placeholder="comma skills: Java,AWS" disabled/>
        <button onclick="buildFinalQuery()">Build</button>
      </div>
      <div class="panel">
        <strong>JPQL</strong>
        <pre id="jpqlOut" class="out">SELECT u FROM User u</pre>
        <strong>Specifications</strong>
        <pre id="specOut" class="out">Specification.where(null)</pre>
      </div>
    </div>
  </section>

  <!-- PAGINATION LAB -->
  <section id="paging" class="card hidden" role="tabpanel">
    <h3>Pagination Lab</h3>
    <p class="block-desc"><strong>What this shows:</strong> Which records appear for the chosen page/size/sort.</p>

    <div class="grid grid-2">
      <div class="panel">
        <label>page</label><input id="pg" type="number" min="0" value="0"/>
        <label>size</label><input id="sz" type="number" min="1" value="5"/>
        <label>sort (field,asc|desc)</label><input id="sort" placeholder="exp,desc"/>
        <button onclick="runPaging()">Apply</button>
      </div>
      <div class="panel">
        <pre id="pageOut" class="out">No results yet…</pre>
      </div>
    </div>
  </section>

  <!-- SCENARIO CHECKER -->
  <section id="scenario" class="card hidden" role="tabpanel">
    <h3>Capstone Scenario Checker</h3>
    <p class="block-desc"><strong>What this shows:</strong> Recommended tool(s) for each scenario and why.</p>

    <div class="panel">
      <select id="scenarioSel">
        <option value="1">Search public users in NYC with Java skill, sort by experience desc, top 20</option>
        <option value="2">Companies with any of {Kubernetes, AWS} skill tags and size > 500</option>
        <option value="3">Free-text name contains 'son' & experience ≥ 7 (composable filters)</option>
      </select>
      <div class="grid grid-2">
        <div>
          <label>Your pick</label>
          <select id="approach">
            <option>Derived Query</option>
            <option>JPQL</option>
            <option>Specifications</option>
            <option>Pageable</option>
            <option>DTO Projection</option>
          </select>
          <button onclick="scoreScenario()">Check</button>
        </div>
        <div>
          <pre id="scenarioOut" class="out">Select a scenario and approach, then "Check".</pre>
        </div>
      </div>
    </div>
  </section>

  <!-- EXIT QUIZ -->
  <section id="quiz" class="card hidden" role="tabpanel">
    <h3>Exit Quiz (5 Qs)</h3>
    <p class="block-desc"><strong>What this shows:</strong> Instant feedback on key concepts from the module.</p>
    <div id="qBox" class="quiz"></div>
    <button onclick="grade()">Grade</button>
    <div id="qScore" style="margin-top:8px"></div>
  </section>

  <!-- CHECKLIST + EXPORT -->
  <section id="checklist" class="card hidden" role="tabpanel">
    <h3>Completion Checklist</h3>
    <p class="block-desc"><strong>What this shows:</strong> Your self-evaluation and an exportable JSON of your notes and outputs.</p>

    <div class="grid grid-2">
      <div class="panel">
        <label><input type="checkbox" class="ck" value="derived"/> I can write derived methods with multi-field + ordering</label>
        <label><input type="checkbox" class="ck" value="jpql"/> I can write JPQL joins + projections</label>
        <label><input type="checkbox" class="ck" value="spec"/> I can chain Specifications with optional params</label>
        <label><input type="checkbox" class="ck" value="pageable"/> I can paginate & sort with Pageable</label>
        <label><input type="checkbox" class="ck" value="dto"/> I can return DTOs for lean responses</label>
        <button onclick="exportNotes()">Export Notes</button>
      </div>
      <div class="panel">
        <strong>Notes (editable)</strong>
        <textarea id="notes" placeholder="Key takeaways, gotchas, next steps..."></textarea>
        <pre id="exportOut" class="out">Your export will appear here…</pre>
      </div>
    </div>
  </section>

  <hr class="rule"/>
  <small class="note">Tip: Keep controllers thin; push composition into a search service. Favor Specs for optional filters, Pageable for sort/limit, and DTOs for lean payloads.</small>
</div>

<script>
// ---------- TABS ----------
document.querySelectorAll('.nav button').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.nav button').forEach(b=>{
      b.classList.remove('active'); b.setAttribute('aria-selected','false');
    });
    btn.classList.add('active'); btn.setAttribute('aria-selected','true');
    const t = btn.dataset.tab;
    document.querySelectorAll('section[role="tabpanel"]').forEach(s=>s.classList.add('hidden'));
    document.getElementById(t).classList.remove('hidden');
  });
});

// ---------- Helpers ----------
const $ = id => document.getElementById(id);

// ---------- Query Builder Finals ----------
const enablers = [
  ['qLoc','vLoc'], ['qInd','vInd'], ['qSkill','vSkill'], ['qMinExp','vMinExp'], ['qAny','vAny']
];
function setEnabled(ckId, inputId){
  const on = $(ckId).checked;
  const el = $(inputId);
  el.disabled = !on;
  if(!on){ el.value = ''; }
}
function initEnablers(){
  enablers.forEach(([c,i])=>{
    const ck = $(c);
    ck.addEventListener('change', ()=> setEnabled(c,i));
    setEnabled(c,i); // set initial state
  });
}

function buildFinalQuery(){
  const parts=[], spec=[]; const params = {};

  if($('qLoc').checked && $('vLoc').value.trim()){
    parts.push('u.location = :location'); spec.push('hasLocation(location)');
    params.location = $('vLoc').value.trim();
  }
  if($('qInd').checked){
    parts.push('u.industry = :industry'); spec.push('hasIndustry(industry)');
    params.industry = $('vInd').value;
  }
  if($('qSkill').checked && $('vSkill').value.trim()){
    parts.push(':skill MEMBER OF u.skills'); spec.push('hasSkill(skill)');
    params.skill = $('vSkill').value.trim();
  }
  if($('qMinExp').checked && $('vMinExp').value){
    parts.push('u.experience >= :minExperience'); spec.push('hasMinExperience(minExperience)');
    params.minExperience = Number($('vMinExp').value);
  }
  if($('qAny').checked && $('vAny').value.trim()){
    parts.push('EXISTS (SELECT s FROM u.skills s WHERE s IN :anySkills)');
    spec.push('hasAnySkills(anySkills)');
    params.anySkills = $('vAny').value.split(',').map(s=>s.trim()).filter(Boolean);
  }

  const jpql = parts.length ? `SELECT u FROM User u WHERE ${parts.join(' AND ')}` : 'SELECT u FROM User u';
  const sc = spec.length ? `Specification.where(${spec[0]})${spec.slice(1).map(x=>' .and('+x+')').join('')}` : 'Specification.where(null)';

  $('jpqlOut').textContent = jpql + '\n\nParams: ' + JSON.stringify(params, null, 2);
  $('specOut').textContent = sc;
}

// ---------- Pagination Lab ----------
let sample = [
  {id:1, first:'Alice', exp:5,  loc:'NYC'},
  {id:2, first:'Bob',   exp:3,  loc:'SF'},
  {id:3, first:'Carol', exp:8,  loc:'NYC'},
  {id:4, first:'Dave',  exp:2,  loc:'Austin'},
  {id:5, first:'Eve',   exp:6,  loc:'SF'},
  {id:6, first:'Frank', exp:10, loc:'Boston'},
  {id:7, first:'Grace', exp:4,  loc:'NYC'},
  {id:8, first:'Henry', exp:7,  loc:'Seattle'},
  {id:9, first:'Ivy',   exp:1,  loc:'NYC'},
  {id:10,first:'Jack',  exp:9,  loc:'LA'}
];

function runPaging(){
  let page = Math.max(0, parseInt($('pg').value||0));
  let size = Math.max(1, parseInt($('sz').value||5));
  let sort = ($('sort').value||'').trim();

  let data = [...sample];
  if(sort){
    const [field,dirRaw] = sort.split(','); const dir = (dirRaw||'asc').toLowerCase();
    data.sort((a,b)=> ((a[field] > b[field]) - (a[field] < b[field])) * (dir==='desc'?-1:1));
  }

  const total = data.length, totalPages = Math.ceil(total/size);
  page = Math.min(page, Math.max(totalPages-1,0));
  const start = page*size, end = start+size;
  const rows = data.slice(start,end);

  $('pageOut').textContent =
    `page=${page}, size=${size}, sort=${sort||'(none)'}\n`+
    `total=${total}, totalPages=${totalPages}\n\n`+
    (rows.map(r=>`${r.id}. ${r.first} — exp:${r.exp}, loc:${r.loc}`).join('\n') || 'No data');
}

// ---------- Scenario Checker ----------
function scenarioAnswer(id){
  switch(id){
    case '1': return ['Specifications','Pageable','DTO Projection'];
    case '2': return ['JPQL','Specifications'];
    case '3': return ['Specifications'];
    default: return [];
  }
}
function scoreScenario(){
  const sel=$('scenarioSel').value;
  const pick=$('approach').value;
  const good = scenarioAnswer(sel).includes(pick);
  const extra = scenarioAnswer(sel).join(' + ');
  $('scenarioOut').textContent = (good? 'Good choice.' : 'Prefer a different tool.')+
    `\nRecommended: ${extra}\n`+
    (sel==='1' ? 'Specs for filters, Pageable for sort/limit, DTO for lean payload.' :
     sel==='2' ? 'Use JPQL JOIN or Specs (MEMBER OF) + size predicate.' :
     'Specs chain: name contains + exp ≥ threshold.');
}

// ---------- Exit Quiz ----------
const quiz=[
  {q:'Which is best for optional, combinable filters?', opts:['Derived query','JPQL','Specifications','Native SQL'], a:2},
  {q:'What does returning DTOs primarily improve?', opts:['Security','Performance (payload)','Authentication','Transactions'], a:1},
  {q:'To sort + limit results you should use…', opts:['Specifications only','Pageable','@Transactional','@OrderBy only'], a:1},
  {q:'A query "name contains x AND experience >= y" maps cleanly to…', opts:['Derived only','JPQL only','Specifications chain','Native SQL only'], a:2},
  {q:'MEMBER OF in JPQL is used to…', opts:['Check collection membership','Encrypt params','Paginate results','Create indexes'], a:0}
];
const picks={};
function renderQuiz(){
  const box=$('qBox'); box.innerHTML='';
  quiz.forEach((it,i)=>{
    const wrap=document.createElement('div');
    wrap.innerHTML=`<div style="margin:6px 0"><strong>Q${i+1}.</strong> ${it.q}</div>`;
    it.opts.forEach((o,oi)=>{
      const el=document.createElement('div'); el.className='opt'; el.textContent=o; el.dataset.i=i; el.dataset.oi=oi;
      el.onclick=()=>{
        picks[i]=oi;
        box.querySelectorAll(`.opt[data-i="${i}"]`).forEach(x=>x.classList.remove('sel'));
        el.classList.add('sel');
      };
      wrap.appendChild(el);
    });
    box.appendChild(wrap);
  });
}
function grade(){
  let s=0;
  document.querySelectorAll('.opt').forEach(el=>el.classList.remove('good','bad'));
  quiz.forEach((it,i)=>{
    const pick=picks[i];
    if (pick === it.a){ s++; const el=document.querySelector(`.opt[data-i="${i}"][data-oi="${pick}"]`); if(el) el.classList.add('good'); }
    else if (pick!=null){ const el=document.querySelector(`.opt[data-i="${i}"][data-oi="${pick}"]`); if(el) el.classList.add('bad'); }
  });
  $('qScore').textContent=`Score: ${s}/${quiz.length}`;
}

// ---------- Export Notes ----------
function exportNotes(){
  const checks=[...document.querySelectorAll('.ck')].filter(x=>x.checked).map(x=>x.value);
  const obj={
    time:new Date().toISOString(),
    mastery:checks,
    jpql:$('jpqlOut').textContent,
    spec:$('specOut').textContent,
    paging: $('pageOut').textContent,
    scenario: $('scenarioOut').textContent,
    notes: $('notes').value
  };
  $('exportOut').textContent = JSON.stringify(obj,null,2);
}

// Init
initEnablers();
renderQuiz();
</script>
</body>

