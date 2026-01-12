---
layout: cs-portfolio-lesson
title: "Submodule 1: Building Company Profiles with Spring Boot & REST APIs"
description: "Spring Boot RESTful Company Profile System"
permalink: /cs-portfolio-quest/data-viz/submodule_1/
parent: "Data Visualization"
team: "Applicators"
submodule: 1
categories: [CSP, Submodule, DataVisualization]
tags: [spring-boot, rest, jpa, sqlite]
author: "Applicators Team"
date: 2025-10-21
microblog: true
---

# Submodule 1 · Company Profile & REST APIs — Minimal Interactive (Styling Preserved)


<style>
html,body{height:100%}
h1{margin:16px 0 8px;border-bottom:1px solid var(--b);padding-bottom:8px}
.container{padding:18px}

.nav{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0 14px}
.nav button {
  position: relative;
  background: linear-gradient(180deg, #111, #0b0b0b);
  color: #e0e0e0;
  border: none; /* remove default border, we'll use pseudo-outline */
  padding: 9px 12px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.25s ease;
  z-index: 0;
}

/* gradient border using ::before pseudo-element */
.nav button::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px; /* thickness of gradient outline */
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #10b981);
  -webkit-mask: 
    linear-gradient(#fff 0 0) content-box, 
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  pointer-events: none;
  z-index: -1;
}

/* hover bounce + vibrate animation */
.nav button:hover {
  color: #fff;
  animation: btn-bounce 180ms ease-out, btn-vibrate 120ms linear;
}

/* active tab: stronger gradient glow */
.nav button.active::before {
  background: linear-gradient(90deg, #60a5fa, #a78bfa, #34d399);
  box-shadow: 0 0 10px rgba(96,165,250,0.6);
}


/* keep your existing .nav button.active visual style; no transform here */
@keyframes btn-bounce{
  0%,100%{ transform: translateY(0); }
  50%{ transform: translateY(-3px); }
}
@keyframes btn-vibrate{
  0%,100%{ transform: translateX(0); }
  25%{ transform: translateX(-0.8px); }
  75%{ transform: translateX(0.8px); }
}
.nav button.active{
  background: linear-gradient(180deg, #2563eb, #1e40af); /* vibrant active */
  color:#fff;
  border-color:#3b82f6;
  box-shadow:0 0 8px rgba(59,130,246,0.5);
}
/* ---------------------------------- */

.card{border:1px solid var(--b);border-radius:10px;padding:14px;margin:12px 0;background:transparent}
label{color:var(--muted);display:block;margin:10px 0 4px}
input,textarea,select{
  width:100%; padding:10px; border:1px solid var(--b); border-radius:8px;
  background:var(--p2); color:var(--fg); font-family:ui-monospace,SFMono-Regular,Consolas
}
/* ---- dark endpoint dropdown (select#ep) ---- */
select#ep{
  background-color:#000;
  color:#fff;
  border:1px solid #333;
}
select#ep:focus{
  outline:1px solid #3b82f6;
  border-color:#3b82f6;
}
select#ep option{
  background-color:#111;
  color:#fff;
}
/* ------------------------------------------- */

textarea{min-height:110px}
pre{
  margin:10px 0; background:var(--p2); border:1px solid var(--b);
  border-radius:8px; padding:12px; overflow:auto; color:#eee
}
.badge{display:inline-block;border:1px solid var(--b);border-radius:999px;padding:2px 8px;color:var(--hint);font-size:11px;margin-left:6px}
.btn{background:#141414;color:var(--fg);border:1px solid var(--b);padding:9px 12px;border-radius:8px;cursor:pointer;font-weight:700}
.btn:hover{border-color:#aaa}
.out{white-space:pre-wrap}
.hidden{display:none}

.quiz .opt{border:1px solid var(--b);border-radius:8px;padding:8px;margin:6px 0;cursor:pointer;color:var(--muted)}
.quiz .opt.sel{border-color:#aaa;color:#fff}
.quiz .opt.good{border-color:#3f3}
.quiz .opt.bad{border-color:#f55}

small.hint{color:var(--hint)}
hr{border:none;border-top:1px solid var(--b);margin:18px 0}
.kbd{font-family:ui-monospace,SFMono-Regular,Consolas;border:1px solid var(--b);border-radius:6px;padding:2px 6px;background:#111;color:#ddd}
.grid{display:grid;gap:10px}
.grid-2{grid-template-columns:repeat(2,minmax(0,1fr))}

/* subtle description text blocks under each tab title */
.tab-desc{
  color:#f1f5f9;                 
  background:rgba(37,99,235,0.07); 
  border-left:4px solid #3b82f6;   
  padding:10px 14px;
  margin:8px 0 14px;
  border-radius:6px;
  font-size:15px;
  line-height:1.6;
}
.tab-desc strong{
  display:block;
  font-size:16px;
  font-weight:700;
  color:#93c5fd; 
  margin-bottom:3px;
}
.quiz .opt.sel{
  border-color:#aaa;
  color:#fff;
  background:#1a1a1a;
}

/* After grading: correct = green, wrong = red */
.quiz .opt.good{
  border-color:#22c55e;
  background:#12351f;  /* deep green */
  color:#c8f3d2;
}
.quiz .opt.bad{
  border-color:#ef4444;
  background:#3a1313;  /* deep red */
  color:#f6caca;
}

</style>

<body>
<div class="container">
  <h1> Submodule 1 · Company Profile & REST APIs <span class="badge">minimal</span></h1>
  <p style="color:#bdbdbd;margin:6px 0 12px">
    Goals: CRUD with Spring Boot + JPA, Many-to-Many, custom query. Most content is interactive ↓
  </p>

  <div class="nav">
    <button class="active" data-tab="sim">API Simulator</button>
    <button data-tab="kata">Code Kata</button>
    <button data-tab="quiz">Quick Quiz</button>
    <button data-tab="build">Build Company</button>
    <button data-tab="snips">Spring Snips</button>
  </div>

  <!-- API SIMULATOR -->
  <section id="sim" class="card">
    <!-- added description + learning objective -->
    <p class="tab-desc">
  <strong>Description:</strong> Experiment with a live mock REST API connected to an in-memory database. You can send POST, GET, PUT, and DELETE requests to create, read, update, and remove company records. The “Response” panel instantly displays the simulated JSON output just like a real server would return.<br>
  <span class="learn"><strong>Learning Objective:</strong> Learn how RESTful endpoints behave in practice, how payloads and HTTP methods interact, and how client-server communication works without requiring a backend server setup.</span>
</p>


    <div class="grid grid-2">
      <div>
        <label>Endpoint</label>
        <select id="ep" onchange="uiEP()">
          <option>POST /api/companies</option>
          <option>GET /api/companies</option>
          <option>GET /api/companies/{id}</option>
          <option>PUT /api/companies/{id}</option>
          <option>DELETE /api/companies/{id}</option>
        </select>
        <p class="tab-desc sub">
  <strong>Request Setup:</strong> Choose your endpoint and, if needed, specify the path parameter. This defines what operation the API will perform.
</p>

      </div>
      <div id="pidWrap" class="hidden">
        <label>Path <span class="kbd">{id}</span></label>
        <input id="pid" type="number" min="1" placeholder="e.g., 1"/>
      </div>
    </div>

    <div id="bodyWrap" class="card" style="margin-top:10px">
      <label>Body (JSON)</label>
      <p class="tab-desc sub">
  <strong>Request Body:</strong> Enter or modify the JSON payload that will be sent to the API for POST and PUT operations.
</p>
      <textarea id="body">{
  "name": "TechCorp",
  "industry": "Software",
  "location": "San Francisco",
  "size": 150,
  "skills": ["Java","Spring"],
  "roles": ["Backend","DevOps"]
}</textarea>
      <div>
        <button class="btn" onclick="send()">Send</button>
        <button class="btn" onclick="resetDB()">Reset DB</button>
      </div>
      <label style="margin-top:10px">Response <small id="status" class="hint"></small></label>
      <p class="tab-desc sub">
  <strong>Data Returned:</strong> The simulated server response showing either the object created, retrieved, or an error message.
</p>

      <pre id="out" class="out">Try a request!</pre>
    </div>

    <div class="card">
      <label>Current Companies</label>
      <p class="tab-desc sub">
  <strong>Database Snapshot:</strong> View all company records currently stored in the in-memory dataset after your requests.
</p>
      <div id="list"></div>
    </div>
  </section>

  <!-- CODE KATA -->
  <section id="kata" class="card hidden">
    <!-- added description + learning objective -->
<p class="tab-desc">
  <strong>Description:</strong> Practice building repository query methods using Spring Data’s derived query syntax. Type a valid method declaration and check your syntax instantly. This helps reinforce how naming conventions automatically generate SQL under the hood.<br>
  <span class="learn"><strong>Learning Objective:</strong> Strengthen your ability to construct expressive, readable data-access methods and understand how JPA abstracts database operations through convention over configuration.</span>
</p>


    <p><strong>One-liner:</strong> Derived query returning companies where <code>size &gt; minSize</code>.</p>
    <p class="tab-desc sub">
  <strong>Code Input:</strong> Write a Spring Data JPA derived query that matches the described condition. Press “Check” to validate syntax.
</p>
    <input id="kataIn" placeholder="List<Company> findBySizeGreaterThan(Integer minSize);" />
    <div style="margin-top:8px">
      <button class="btn" onclick="checkKata()">Check</button>
      <span id="kataMsg" style="margin-left:8px"></span>
    </div>
    <p class="tab-desc sub">
  <strong>Hint Section:</strong> Expand for guidance on correct naming conventions used by Spring Data repositories.
</p>
    <details style="margin-top:10px"><summary>Hint</summary><small class="hint">Use Spring Data naming: <code>findBy&lt;Field&gt;GreaterThan(param)</code>.</small></details>
  </section>

  <!-- QUIZ -->
  <section id="quiz" class="card hidden">
    <!-- added description + learning objective -->
<p class="tab-desc">
  <strong>Description:</strong> A short self-check that tests your understanding of Spring Boot annotations, ORM mapping, and asynchronous programming concepts. Each question reinforces key patterns from the lessons above.<br>
  <span class="learn"><strong>Learning Objective:</strong> Verify your grasp of core Spring framework terminology, differentiate between controller and service layers, and recognize how async processing improves backend responsiveness.</span>
</p>


    <div id="quizBox" class="quiz"></div>
    <button class="btn" onclick="grade()" style="margin-top:8px">Grade</button>
    <div id="score" style="margin-top:8px"></div>
  </section>

  <!-- BUILDER -->
  <section id="build" class="card hidden">
    <!-- added description + learning objective -->
<p class="tab-desc">
  <strong>Description:</strong> Use this form to simulate adding a new company record to your in-memory database. You can manually input details or click <em>Cheat Fill</em> to generate realistic sample data instantly. Once submitted, the record is appended to the dataset and displayed below in formatted JSON.<br>
  <span class="learn"><strong>Learning Objective:</strong> Explore how frontend inputs become structured JSON requests, how POST payloads are formatted, and how backend APIs would process entity creation and persistence.</span>
</p>

<p class="tab-desc sub">
  <strong>Form Inputs:</strong> Fill out the company details below or click “Cheat Fill” to auto-populate realistic sample data.
</p>
    <div class="grid grid-2">
      <div><label>Name</label><input id="bName" placeholder="Acme Inc"/></div>
      <div><label>Industry</label><select id="bInd"><option>Software</option><option>AI</option><option>Healthcare</option><option>Finance</option></select></div>
      <div><label>Location</label><input id="bLoc" placeholder="San Diego"/></div>
      <div><label>Size</label><input id="bSize" type="number" min="1" placeholder="50"/></div>
      <div><label>Skills (comma)</label><input id="bSkills" placeholder="Java, Spring"/></div>
      <div><label>Roles (comma)</label><input id="bRoles" placeholder="Backend, QA"/></div>
    </div>
    <div style="display:flex;gap:8px;margin-top:8px">
      <button class="btn" onclick="cheatFill()">Cheat Fill</button>
      <button class="btn" onclick="builderAdd()">Add</button>
    </div>
    <p class="tab-desc sub">
  <strong>Data Returned:</strong> Displays the exact JSON object that would be sent in a real POST request to the backend API.
</p>
    <pre id="bOut" class="out"></pre>
  </section>

  <!-- SPRING SNIPS (kept tiny; look & feel unchanged) -->
  <section id="snips" class="card hidden">
    <!-- added description + learning objective -->
<p class="tab-desc">
  <strong>Description:</strong> Reference key fragments from a simplified Spring Boot project, including repository definitions, controller endpoints, and configuration properties. Each snippet mirrors the functionality of your simulator for quick comparison.<br>
  <span class="learn"><strong>Learning Objective:</strong> Understand how the controller delegates requests to the service layer, how JPA repositories simplify data queries, and how configuration files establish the link between application and database.</span>
</p>


    <details open>
      <summary>Repository</summary>
      <pre>public interface CompanyRepository extends JpaRepository&lt;Company, Long&gt; {
  List&lt;Company&gt; findByIndustry(String industry);
  List&lt;Company&gt; findBySizeGreaterThan(Integer minSize);
  @Query("SELECT c FROM Company c JOIN c.skills s WHERE s.name = :skill")
  List&lt;Company&gt; findBySkillName(@Param("skill") String skill);
}</pre>
    </details>
    <details>
      <summary> Controller</summary>
      <pre>@RestController
@RequestMapping("/api/companies")
class CompanyController {
  @Autowired CompanyService svc;
  @PostMapping public ResponseEntity&lt;Company&gt; create(@RequestBody Company c){
    return new ResponseEntity<>(svc.createCompany(c), HttpStatus.CREATED);
  }
  @GetMapping("/{id}") public Company one(@PathVariable Long id){ return svc.getCompanyById(id); }
  @GetMapping public List&lt;Company&gt; all(){ return svc.getAllCompanies(); }
}</pre>
    </details>
    <details>
      <summary> application.properties</summary>
      <pre>spring.datasource.url=jdbc:sqlite:company_profiles.db
spring.datasource.driver-class-name=org.sqlite.JDBC
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true</pre>
    </details>
    <small class="hint">Entities/service omitted to keep it short—practice via Simulator & Builder.</small>
  </section>

  <hr/>
  <small class="hint">Styling background preserved; content trimmed; interactions unchanged.</small>
</div>

<script>
// Tabs (UI behavior unchanged)
document.querySelectorAll('.nav button').forEach(btn=>{
  btn.onclick=()=>{
    document.querySelectorAll('.nav button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const t=btn.dataset.tab;
    document.querySelectorAll('section').forEach(s=>s.classList.add('hidden'));
    document.getElementById(t).classList.remove('hidden');
  };
});

// In-memory DB (for Simulator + Builder)
let db=[
  {id:1,name:"TechNova",industry:"AI",location:"San Diego",size:1200,skills:["Python","TensorFlow"],roles:["ML Engineer","DS"]},
  {id:2,name:"HealthBridge",industry:"Healthcare",location:"Austin",size:300,skills:["Java","Spring"],roles:["Backend Engineer"]}
];
let nextId=3;

const $=(id)=>document.getElementById(id);
const ep=$('ep'), pidWrap=$('pidWrap'), pid=$('pid'), bodyWrap=$('bodyWrap'), bodyEl=$('body'), out=$('out'), statusEl=$('status'), list=$('list');

function cheatFill(){
  // Simple helpers
  const pick = (arr)=> arr[Math.floor(Math.random()*arr.length)];
  const names = ["NovaEdge", "Skyline Dynamics", "QuantumLeaf", "Blue Harbor", "ApexForge", "Vector Labs", "Northstar Systems"];
  const cities = ["San Diego", "Austin", "Seattle", "Boston", "Denver", "Raleigh", "Phoenix"];
  const skillSets = [
    ["Java","Spring"],
    ["Python","Pandas"],
    ["React","TypeScript"],
    ["Kotlin","Android"],
    ["Go","gRPC"],
    ["AWS","Terraform"],
    ["SQL","JPA"]
  ];
  const roleSets = [
    ["Backend","DevOps"],
    ["Frontend","UI Engineer"],
    ["ML Engineer","Data Scientist"],
    ["Mobile","QA"],
    ["SRE","Platform"],
    ["Analyst","BI Engineer"],
    ["Full-stack","Product Engineer"]
  ];

  // Fill fields
  $('bName').value = pick(names) + " Inc.";
  $('bLoc').value  = pick(cities);
  $('bSize').value = Math.floor(Math.random()*1800) + 20; // 20..1819

  // Industry (use the existing <select> options)
  const indSel = $('bInd');
  const indOptions = [...indSel.options].map(o=>o.value);
  indSel.value = pick(indOptions);

  // Skills & Roles (comma-separated)
  const skills = pick(skillSets);
  const roles  = pick(roleSets);
  $('bSkills').value = skills.join(", ");
  $('bRoles').value  = roles.join(", ");
}

function uiEP(){
  const val=ep.value;
  const needsId=val.includes('{id}');
  pidWrap.classList.toggle('hidden',!needsId);
  bodyWrap.classList.toggle('hidden',!(val.startsWith('POST')||val.startsWith('PUT')));
}
function renderList(){
  list.innerHTML=db.map(c=>`
    <div style="border:1px solid #333;border-radius:8px;padding:8px;margin:6px 0">
      <strong>${escapeHtml(c.name)}</strong> <span class="badge">${escapeHtml(c.industry)}</span><br/>
      ${escapeHtml(c.location)} · size ${c.size}<br/>
      ${(c.skills||[]).map(s=>`<span class="badge">${escapeHtml(s)}</span>`).join(' ')}
    </div>
  `).join('');
}
function escapeHtml(s){return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'","&#039;");}
function parseJSON(txt){try{return JSON.parse(txt||'{}');}catch(e){throw new Error('Invalid JSON body');}}
function normCompany(o){return {name:o.name??'Unnamed',industry:o.industry??'Unknown',location:o.location??'Unknown',size:Number(o.size??0),skills:Array.isArray(o.skills)?o.skills:[],roles:Array.isArray(o.roles)?o.roles:[]};}
function setStatus(code){statusEl.textContent=code;}

function send(){
  const [method,path]=ep.value.split(' ');
  let res=null;
  try{
    if(method==='POST'&&path==='/api/companies'){
      const obj=normCompany(parseJSON(bodyEl.value)); obj.id=nextId++; db.push(obj); setStatus(201); res=obj;
    }else if(method==='GET'&&path==='/api/companies'){
      setStatus(200); res=db;
    }else if(method==='GET'&&path==='/api/companies/{id}'){
      const id=Number(pid.value); const f=db.find(x=>x.id===id);
      if(!f){setStatus(404);res={error:'Not found'};}else{setStatus(200);res=f;}
    }else if(method==='PUT'&&path==='/api/companies/{id}'){
      const id=Number(pid.value); const i=db.findIndex(x=>x.id===id);
      if(i===-1){setStatus(404);res={error:'Not found'};}
      else{const obj=normCompany(parseJSON(bodyEl.value)); db[i]={...db[i],...obj,id}; setStatus(200); res=db[i];}
    }else if(method==='DELETE'&&path==='/api/companies/{id}'){
      const id=Number(pid.value); const before=db.length; db=db.filter(x=>x.id!==id);
      if(db.length===before){setStatus(404);res={error:'Not found'};} else {setStatus(204); res={};}
    }else{ setStatus(400); res={error:'Unsupported operation'}; }
  }catch(err){ setStatus(400); res={error:err.message}; }
  out.textContent=JSON.stringify(res,null,2);
  renderList();
}
function resetDB(){
  db=[
    {id:1,name:"TechNova",industry:"AI",location:"San Diego",size:1200,skills:["Python","TensorFlow"],roles:["ML Engineer","DS"]},
    {id:2,name:"HealthBridge",industry:"Healthcare",location:"Austin",size:300,skills:["Java","Spring"],roles:["Backend Engineer"]}
  ];
  nextId=3; setStatus(200); out.textContent="Database reset."; renderList();
}

// Code Kata checker
function checkKata(){
  const v=($('kataIn').value||'').trim().replace(/\s+/g,' ');
  const ok=/^List<\s*Company\s*>\s*findBySizeGreaterThan\s*\(\s*Integer\s+\w+\s*\);\s*$/i.test(v);
  const msg=$('kataMsg');
  msg.textContent= ok ? '✅ Correct derived query.' : '❌ Try: List<Company> findBySizeGreaterThan(Integer minSize);';
  msg.style.color= ok ? '#bfffbf' : '#ffb3b3';
}

// Quiz (minimal)
const quizData=[
  {q:'Marks a REST controller?', opts:['@Controller','@RestController','@Service','@Repository'], a:1},
  {q:'@JoinTable is for…', opts:['PK','table name','join table & columns','ID strategy'], a:2},
  {q:'CompletableFuture is…', opts:['sync I/O','blocking DB','async computation','ORM'], a:2}
];
const selections={};
function renderQuiz(){
  const box=$('quizBox'); box.innerHTML='';
  quizData.forEach((item,i)=>{
    const wrap=document.createElement('div');
    wrap.innerHTML=`<div style="margin:8px 0 4px"><strong>Q${i+1}.</strong> ${item.q}</div>`;
    item.opts.forEach((o,oi)=>{
      const opt=document.createElement('div');
      opt.className='opt'; opt.textContent=o; opt.dataset.i=i; opt.dataset.oi=oi;
      opt.onclick=()=>{
        selections[i]=oi;
        box.querySelectorAll(`.opt[data-i="${i}"]`).forEach(el=>el.classList.remove('sel'));
        opt.classList.add('sel');
      };
      wrap.appendChild(opt);
    });
    box.appendChild(wrap);
  });
}
function grade(){
  let score=0;
  document.querySelectorAll('.opt').forEach(el=>el.classList.remove('good','bad'));
  quizData.forEach((item,i)=>{
    const pick=selections[i];
    if(pick===item.a) score++;
    const opts=[...document.querySelectorAll(`.opt[data-i="${i}"]`)];
    opts[item.a].classList.add('good');
    if(pick!=null && pick!==item.a) opts[pick].classList.add('bad');
  });
  $('score').textContent=`Score: ${score}/${quizData.length}`;
}

// Builder
function builderAdd(){
  const obj={
    id:nextId++,
    name:($('bName').value||'New Co').trim(),
    industry:$('bInd').value,
    location:($('bLoc').value||'Unknown').trim(),
    size:Number($('bSize').value||0),
    skills:($('bSkills').value||'').split(',').map(s=>s.trim()).filter(Boolean),
    roles:($('bRoles').value||'').split(',').map(s=>s.trim()).filter(Boolean)
  };
  db.push(obj); $('bOut').textContent=JSON.stringify(obj,null,2); setStatus(201); renderList();
}

// Init
uiEP(); renderList(); renderQuiz();
</script>
</body>

