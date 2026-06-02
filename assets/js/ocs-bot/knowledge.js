// assets/js/ocs-bot/knowledge.js
// -----------------------------------------------------------------------------
// The OCS Assistant's ground truth: who the site is, where things live, and
// what the curriculum covers. Every path here is a REAL permalink verified
// against the pages.opencodingsociety.com repo — the bot is told to only link
// to paths in this index, so it can never invent a broken URL.
// -----------------------------------------------------------------------------

export const SITE = {
  name: 'Open Coding Society',
  short: 'OCS',
  url: 'https://pages.opencodingsociety.com',
  tagline:
    'A student-driven computer science program — AP CSP, AP CSA, and CS & Software Engineering — built around real projects, "hacks", and a full-stack (GitHub Pages + JavaScript + Flask + Spring) teaching platform.',
};

// Each entry: { name, path, keywords[], desc, group }
// group is used to organize the bot's understanding and the welcome screen.
export const NAV_INDEX = [
  // ---- Getting around ----
  { name: 'Home', path: '/home', group: 'Main', keywords: ['home', 'homepage', 'start', 'landing'], desc: 'The OCS home page and gamified entry point.' },
  { name: 'Courses', path: '/navigation/courses/', group: 'Main', keywords: ['courses', 'classes', 'tracks', 'curriculum'], desc: 'Directory of all OCS courses.' },
  { name: 'Lessons / Blogs', path: '/navigation/blogs/', group: 'Main', keywords: ['blogs', 'lessons', 'posts', 'materials', 'index', 'all lessons'], desc: 'Central hub linking every lesson and blog across the courses.' },
  { name: 'About OCS', path: '/navigation/about', group: 'Main', keywords: ['about', 'mission', 'who', 'info', 'open coding society'], desc: 'About the Open Coding Society.' },
  { name: 'Search', path: '/search/', group: 'Main', keywords: ['search', 'find', 'lookup'], desc: 'Search every page and lesson on the site.' },

  // ---- Accounts ----
  { name: 'Log in', path: '/login', group: 'Account', keywords: ['login', 'log in', 'sign in', 'signin'], desc: 'Sign in to your OCS account (needed to save chats, track progress, and submit work).' },
  { name: 'Sign up', path: '/signup', group: 'Account', keywords: ['signup', 'sign up', 'register', 'create account', 'join'], desc: 'Create a new OCS account.' },
  { name: 'Profile', path: '/profile', group: 'Account', keywords: ['profile', 'my account', 'settings', 'avatar'], desc: 'Your profile, stats, and account settings.' },
  { name: 'Logout', path: '/logout', group: 'Account', keywords: ['logout', 'log out', 'sign out'], desc: 'Sign out of your account.' },

  // ---- Courses ----
  { name: 'AP Computer Science Principles (CSP)', path: '/navigation/courses/csp', group: 'Courses', keywords: ['csp', 'ap csp', 'computer science principles', 'principles', 'web dev', 'flask', 'cpt', 'create task'], desc: 'AP CSP: 9 sprints covering JavaScript & Python foundations, full-stack web apps (frontend → Flask backend → database), the AP Create Performance Task, and exam prep.' },
  { name: 'AP Computer Science A (CSA)', path: '/navigation/courses/csa', group: 'Courses', keywords: ['csa', 'ap csa', 'computer science a', 'java', 'data structures', 'frq', 'objects', 'inheritance'], desc: 'AP CSA: Java programming, OOP, data structures, algorithms, and Free-Response Question (FRQ) practice across College Board units.' },
  { name: 'CS & Software Engineering (CSSE)', path: '/navigation/courses/csse', group: 'Courses', keywords: ['csse', 'software engineering', 'game dev', 'game development', 'javascript games', 'rpg', 'platformer'], desc: 'CSSE: 6 sprints focused on JavaScript, OOP, and building web games (breakout, platformer, RPG) for Night at the Museum.' },
  { name: 'CSA Lessons', path: '/navigation/csa-lessons/', group: 'Courses', keywords: ['csa lessons', 'java lessons', 'csa units'], desc: 'The full CSA lesson list.' },
  { name: 'CSA Multiple Choice Practice', path: '/csa/mcq', group: 'Courses', keywords: ['mcq', 'multiple choice', 'csa practice', 'ap practice', 'quiz'], desc: 'AP CSA multiple-choice practice questions.' },

  // ---- CSP curriculum highlights ----
  { name: 'CSP Big Idea 3 — Algorithms & Programming', path: '/csp/big-idea-3', group: 'CSP Topics', keywords: ['big idea 3', 'algorithms', 'programming', 'variables', 'loops', 'conditionals', 'functions', 'lists'], desc: 'The core programming Big Idea: variables, data types, control flow, lists, and procedures.' },
  { name: 'CSP Programming Fundamentals', path: '/csp/big-idea/fundamentals', group: 'CSP Topics', keywords: ['fundamentals', 'basics', 'getting started programming', 'data types'], desc: 'Foundations of programming for CSP.' },
  { name: 'CSP Pseudocode Lesson', path: '/csp/pseudocode/lesson/', group: 'CSP Topics', keywords: ['pseudocode', 'ap pseudocode', 'exam reference'], desc: 'AP CSP pseudocode / exam reference sheet practice.' },
  { name: 'CSP Errors & Debugging', path: '/csp/errors/p3/lesson/', group: 'CSP Topics', keywords: ['errors', 'debugging', 'bugs', 'fix'], desc: 'Finding and fixing errors in programs.' },
  { name: 'CSP Safe Computing', path: '/csp/big-idea-5/safe-computing/', group: 'CSP Topics', keywords: ['safe computing', 'security', 'privacy', 'big idea 5', 'ethics', 'impact'], desc: 'Cybersecurity, privacy, and the impact of computing (Big Idea 5).' },
  { name: 'CSP Compression Quest', path: '/csp/big-idea-2/compression-quest', group: 'CSP Topics', keywords: ['compression', 'data', 'big idea 2', 'lossy', 'lossless'], desc: 'Data & compression (Big Idea 2).' },

  // ---- Agile / process ----
  { name: 'Agile Development', path: '/agile/', group: 'Process', keywords: ['agile', 'scrum', 'standup', 'kanban', 'teamwork', 'sprint'], desc: 'How OCS teams work: Agile, Scrum, standups, and Kanban.' },
  { name: 'Agile — Teams', path: '/agile/teams', group: 'Process', keywords: ['teams', 'roles', 'collaboration', 'group'], desc: 'Team roles and collaboration practices.' },

  // ---- Projects, hacks & games ----
  { name: 'CS Portfolio Quest', path: '/cs-portfolio-quest', group: 'Projects', keywords: ['portfolio', 'quest', 'big six', 'showcase', 'ai', 'analytics', 'backend', 'frontend', 'data viz', 'resume'], desc: 'A guided multi-track quest (AI, analytics, backend, frontend, data-viz, resume) for building your CS portfolio.' },
  { name: 'The Big Six', path: '/bigsix', group: 'Projects', keywords: ['big six', 'bigsix', 'the big 6', 'quest game'], desc: 'The Big Six project quest and game.' },
  { name: 'Breakout Game Lesson', path: '/breakout', group: 'Projects', keywords: ['breakout', 'game', 'oop game', 'collision', 'canvas'], desc: 'Build the Breakout game while learning OOP and game loops.' },
  { name: 'Connect Four', path: '/connect4/play/', group: 'Projects', keywords: ['connect 4', 'connect four', 'connect4', 'board game'], desc: 'Play Connect Four; lessons cover the game logic and algorithms.' },
  { name: 'Calculator', path: '/calculator', group: 'Projects', keywords: ['calculator', 'math', 'dom', 'javascript tool'], desc: 'An interactive JavaScript calculator project.' },
  { name: 'Binary Math', path: '/binary-math', group: 'Projects', keywords: ['binary', 'number systems', 'base 2', 'bits', 'conversion'], desc: 'Interactive binary number visualizer and converter.' },
  { name: 'Cookie Clicker Game', path: '/cookie-clicker-game/', group: 'Projects', keywords: ['cookie clicker', 'idle game', 'localstorage'], desc: 'The Cookie Clicker game project with OOP and localStorage lessons.' },
  { name: 'Custom Pong', path: '/custompong', group: 'Projects', keywords: ['pong', 'arcade', 'game'], desc: 'Build your own Pong game.' },
  { name: 'Digital Famine (Cybersecurity Game)', path: '/digital-famine/', group: 'Projects', keywords: ['digital famine', 'cybersecurity', 'media literacy', 'vault', 'security game'], desc: 'A narrative cybersecurity & media-literacy game with missions.' },
  { name: 'CodeGraph', path: '/codegraph', group: 'Projects', keywords: ['codegraph', 'graph', 'data structures', 'visualization'], desc: 'A graph data-structure visualization tool.' },
  { name: 'Crypto Portfolio', path: '/crypto/portfolio', group: 'Projects', keywords: ['crypto', 'portfolio', 'mining', 'blockchain'], desc: 'Crypto portfolio and mining simulation project.' },

  // ---- Capstone ----
  { name: 'Capstone Projects', path: '/capstone/', group: 'Capstone', keywords: ['capstone', 'final project', 'showcase', 'senior project'], desc: 'Hub of student capstone projects (year-end real-world builds).' },
  { name: 'Capstone — RCR Railroad', path: '/capstone/rcr/', group: 'Capstone', keywords: ['rcr', 'railroad', 'poway midland'], desc: 'Poway–Midland Railroad digital experience capstone.' },
  { name: 'Capstone — PowayNEC', path: '/capstone/powaynec-showcase/', group: 'Capstone', keywords: ['powaynec', 'pnec', 'emergency'], desc: 'Poway Neighborhood Emergency Corps capstone showcase.' },
  { name: 'Capstone — College Bound', path: '/capstone/college-bound', group: 'Capstone', keywords: ['college bound', 'college', 'planning'], desc: 'College-planning platform capstone.' },

  // ---- Tools, progress & games ----
  { name: 'Leaderboard', path: '/leaderboard', group: 'Tools', keywords: ['leaderboard', 'rankings', 'points', 'standings'], desc: 'Student leaderboard and rankings.' },
  { name: 'Dashboard', path: '/dashboard', group: 'Tools', keywords: ['dashboard', 'overview', 'progress'], desc: 'Your activity dashboard.' },
  { name: 'Snapshot (Portfolio)', path: '/snapshot', group: 'Tools', keywords: ['snapshot', 'portfolio', 'skills', 'assessment'], desc: 'A snapshot of your skills and portfolio.' },
  { name: 'Calendar', path: '/student/calendar', group: 'Tools', keywords: ['calendar', 'schedule', 'due dates', 'events'], desc: 'Course calendar and schedule.' },
  { name: 'Study Tracker', path: '/studytracker', group: 'Tools', keywords: ['study tracker', 'study', 'track', 'habits'], desc: 'Track what you have studied.' },
  { name: 'Grade Predictor', path: '/grade-predictor', group: 'Tools', keywords: ['grade predictor', 'grade', 'predict'], desc: 'Predict your grade.' },
  { name: 'AP Score / Exam Predictor', path: '/exam-predictor', group: 'Tools', keywords: ['exam predictor', 'ap score', 'score predictor', 'predict exam'], desc: 'Estimate your AP exam readiness/score.' },
  { name: 'Linux CTF', path: '/linuxctf', group: 'Tools', keywords: ['linux', 'ctf', 'command line', 'terminal', 'capture the flag'], desc: 'Learn the Linux command line through Capture-the-Flag challenges.' },
  { name: 'Java UI', path: '/javaUI', group: 'Tools', keywords: ['java ui', 'java gui', 'swing'], desc: 'Java user-interface lessons and demos.' },
  { name: 'API Documentation (Java/Spring)', path: '/java/apidocumentation', group: 'Tools', keywords: ['api docs', 'api documentation', 'endpoints', 'spring api'], desc: 'Documentation for the Java/Spring backend APIs.' },
  { name: 'RPG Game', path: '/rpg/latest', group: 'Tools', keywords: ['rpg', 'role playing', 'adventure game'], desc: 'The OCS RPG learning game.' },
  { name: 'Mansion Game', path: '/gamify/mansionGame', group: 'Tools', keywords: ['mansion', 'gamify', 'adventure'], desc: 'The gamified Mansion learning game.' },

  // ---- Teacher / staff (only relevant to signed-in teachers & admins) ----
  { name: 'Teacher Tools', path: '/teacher', group: 'Teacher', keywords: ['teacher', 'staff', 'class', 'roster', 'students', 'grade book'], desc: 'Teacher tools — manage classes, students, and grading (teachers/admins only).' },
  { name: 'Analytics Dashboard', path: '/analytics-dashboard', group: 'Teacher', keywords: ['analytics', 'class analytics', 'progress', 'metrics', 'reports', 'insights'], desc: 'Class analytics and student-progress dashboards (teachers/admins).' },
  { name: 'Grade Predictor', path: '/grade-predictor', group: 'Teacher', keywords: ['grade predictor', 'grades', 'predict'], desc: 'Grade prediction tool.' },
];

// High-level course facts the model can answer from directly (no link needed).
export const COURSE_FACTS = `
COURSES OFFERED (3 main tracks + a college track):
• AP Computer Science Principles (CSP) — 9 sprints. Path: JavaScript & Python foundations → build a web app for "Night at the Museum" (N@tM) → full-stack Create Performance Task (Flask backend, JWT auth, REST APIs, a database) → deployment (AWS EC2) → data structures/data science → AP exam prep → passion project. Great for first-time and broad CS learners.
• AP Computer Science A (CSA) — Java focused. College Board units: Primitive Types (U1), Using Objects (U2), Booleans & if (U3), Iteration (U4), Writing Classes (U5), Arrays/ArrayList, 2D Arrays, Inheritance (U9), Recursion (U10). Heavy on OOP, data structures, algorithms, and FRQ practice. Best if you want the Java AP exam.
• CS & Software Engineering (CSSE) — 6 sprints, game-development focused: JavaScript foundations + student teaching, build web games (Breakout, platformer, RPG) using OOP and a shared game engine, leaderboards/WebSockets, ending in a portfolio + N@tM showcase.
• CWGU — a Western Governors University (D299) college track for dual-credit students.

THE STACK STUDENTS LEARN (CSP full-stack):
Frontend (GitHub Pages: HTML/CSS/JavaScript) → JavaScript logic/events → Flask (Python) backend on AWS EC2 → data services. Auth uses JWT cookies. The OCS platform itself is the textbook: this very site is a Jekyll site, the Python backend is "flask.opencodingsociety.com", and there is also a Java/Spring backend ("spring.opencodingsociety.com").

KEY RITUALS: Agile/Scrum with standups & Kanban; "hacks" (hands-on coding assignments); "popcorn hacks" (quick in-lesson challenges); and "Night at the Museum" (N@tM), the public showcase where students demo their projects.
`.trim();
