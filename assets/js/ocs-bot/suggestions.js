// assets/js/ocs-bot/suggestions.js
// -----------------------------------------------------------------------------
// Curated starter prompts for the welcome screen. Each becomes a clickable
// card that pre-fills + sends. `icon` is an SVG id resolved in index.js
// (no emoji — crisp monoline icons for a premium look).
// -----------------------------------------------------------------------------

const POOL = [
  { icon: 'compass', text: 'Which course should I start with?' },
  { icon: 'book', text: 'What does the AP CSP course cover?' },
  { icon: 'java', text: 'Take me to the AP CSA Java lessons' },
  { icon: 'gamepad', text: 'How do I build a game in CSSE?' },
  { icon: 'layers', text: 'Explain the full-stack: frontend, Flask, and database' },
  { icon: 'grid', text: "Where are the coding 'hacks' and projects?" },
  { icon: 'trophy', text: 'Show me the leaderboard' },
  { icon: 'search', text: 'How do I search the site?' },
  { icon: 'calendar', text: "Where's the course calendar?" },
  { icon: 'rocket', text: "What is 'Night at the Museum'?" },
  { icon: 'cap', text: 'Help me prep for the AP CSA exam' },
  { icon: 'spark', text: 'Give me a practice FRQ for my course' },
  { icon: 'terminal', text: 'Open the Linux CTF challenges' },
];

export function starterSuggestions(user) {
  const picks = [];
  if (user && (user.isTeacher || user.isAdmin)) {
    // Signed-in teachers/admins get staff-only shortcuts first.
    picks.push({ icon: 'grid', text: 'Open the teacher dashboard' });
    picks.push({ icon: 'trophy', text: 'Show me class analytics' });
  } else if (!user) {
    picks.push({ icon: 'user', text: 'How do I sign up for an OCS account?' });
  }
  // Stable rotation within a session (don't reshuffle on every render).
  const start = (new Date().getHours() * 3) % POOL.length;
  for (let i = 0; picks.length < 5 && i < POOL.length; i++) {
    picks.push(POOL[(start + i) % POOL.length]);
  }
  return picks.slice(0, 5);
}
