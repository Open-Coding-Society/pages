// ============================================================
//  data.js — Single Responsibility: All lesson content
//  Path: assets/js/bigsix/dataviz/data.js
//
//  Every piece of hardcoded content lives here.
//  Edit this file to update data without touching any logic.
//
//  EXPORTS:
//    CONFIG
// ============================================================

export const CONFIG = {

    STORAGE_KEY: 'dataviz_combined_v2',
  
    STEPS: ['step1','step2','step3','step4','step5','step6'],
  
    // ── Mock database defaults ────────────────────────────────
    DEFAULT_DB: [
      { id:1, name:'TechNova',     industry:'AI',         location:'San Diego', size:1200, skills:['Python','TensorFlow','Docker'] },
      { id:2, name:'HealthBridge', industry:'Healthcare', location:'Austin',    size:300,  skills:['Java','Spring','MySQL'] },
      { id:3, name:'FinEdge',      industry:'Finance',    location:'New York',  size:850,  skills:['Kotlin','AWS','Redis'] },
      { id:4, name:'CloudPeak',    industry:'Software',   location:'Seattle',   size:420,  skills:['Go','Kubernetes','GCP'] },
    ],
  
    // ── Company builder random fill data ─────────────────────
    CHEAT_NAMES:  ['NovaEdge','Skyline','Quantum','BlueHarbor','ApexForge','CipherLabs','NorthStar'],
    CHEAT_CITIES: ['San Diego','Austin','Seattle','Boston','Denver','Miami','Chicago'],
    CHEAT_SKILLS: [
      'Java, Spring, AWS',
      'Python, TensorFlow, Docker',
      'Go, Kubernetes, Redis',
      'Kotlin, Android, Firebase',
    ],
  
    // ── Pagination demo data ──────────────────────────────────
    PAGINATION_SAMPLE: [
      { id:1,  name:'Alice Corp',        size:100 },
      { id:2,  name:'Bob Industries',    size:200 },
      { id:3,  name:'Carol Solutions',   size:150 },
      { id:4,  name:'Dave Enterprises',  size:300 },
      { id:5,  name:'Eve Technologies',  size:120 },
      { id:6,  name:'Frank Systems',     size:250 },
      { id:7,  name:'Grace Analytics',   size:180 },
      { id:8,  name:'Henry Ventures',    size:220 },
      { id:9,  name:'Ivy Labs',          size:90  },
      { id:10, name:'Jack Dynamics',     size:280 },
    ],
  
    // ── Scenario checker ─────────────────────────────────────
    SCENARIOS: {
      '1': {
        best:   ['Specifications','Pageable','DTO Projection'],
        reason: 'Needs filtering (Specifications), pagination/sorting (Pageable), and optimised output (DTO Projection).',
      },
      '2': {
        best:   ['JPQL','Specifications'],
        reason: 'ANY-of collection checks and size comparisons work well with JPQL MEMBER OF or Specifications.',
      },
      '3': {
        best:   ['Specifications'],
        reason: 'Composable, optional free-text filters are exactly what Specifications are designed for.',
      },
    },
  
    // ── Exit quiz ─────────────────────────────────────────────
    QUIZ: [
      {
        q:    'Which approach is best for optional, composable filters?',
        opts: ['Derived Query','JPQL','Specifications','Native SQL'],
        a:    2,
        explanation: 'Specifications let you chain optional filters with .and()/.or() — perfect for dynamic queries.',
      },
      {
        q:    'What does returning DTOs improve?',
        opts: ['Security only','Performance by reducing payload size','Authentication speed','Transaction handling'],
        a:    1,
        explanation: 'DTOs let you return only what the client needs, reducing response size and improving performance.',
      },
      {
        q:    'To sort and limit results in Spring Data, you use…',
        opts: ['Specifications','Pageable with PageRequest','@Transactional','JOIN FETCH'],
        a:    1,
        explanation: 'PageRequest.of(page, size, Sort.by(...)) gives full control over pagination and sorting.',
      },
      {
        q:    'In JPQL, what does MEMBER OF check?',
        opts: ['Whether a field is null','If an item exists in a collection field','The sort order','User permission levels'],
        a:    1,
        explanation: 'MEMBER OF checks if a value is inside a collection, e.g. :skill MEMBER OF c.skills.',
      },
    ],
  
    // ── Completion checklist ──────────────────────────────────
    CHECKLIST: [
      { value:'crud',     label:'I understand CRUD (Create, Read, Update, Delete)' },
      { value:'derived',  label:'I can write derived query methods' },
      { value:'jpql',     label:'I can write JPQL with JOINs & filters' },
      { value:'spec',     label:'I can chain Specifications for dynamic filtering' },
      { value:'pageable', label:'I can use Pageable for sorting & pagination' },
      { value:'dto',      label:'I know when to use DTOs for performance' },
    ],
  };