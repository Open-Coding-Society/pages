// assets/js/ocs-bot/suggestions.js
// -----------------------------------------------------------------------------
// Curated starter prompts for the welcome screen. Each becomes a clickable
// chip that pre-fills + sends. Tuned to what real OCS visitors ask.
// -----------------------------------------------------------------------------

const POOL = [
  { icon: '🧭', text: "Which course should I start with?" },
  { icon: '📚', text: "What does the AP CSP course cover?" },
  { icon: '☕', text: "Take me to the AP CSA Java lessons" },
  { icon: '🎮', text: "How do I build a game in CSSE?" },
  { icon: '🔌', text: "Explain the full-stack: frontend, Flask, and database" },
  { icon: '🧩', text: "Where are the coding 'hacks' and projects?" },
  { icon: '🏆', text: "Show me the leaderboard" },
  { icon: '🔍', text: "How do I search the site?" },
  { icon: '🗓️', text: "Where's the course calendar?" },
  { icon: '🚀', text: "What is 'Night at the Museum'?" },
  { icon: '🧠', text: "Help me prep for the AP CSA exam" },
  { icon: '🔐', text: "Open the Linux CTF challenges" },
];

export function starterSuggestions(user) {
  const picks = [];
  if (!user) picks.push({ icon: '👤', text: 'How do I sign up for an OCS account?' });
  // Stable-ish rotation so it doesn't feel random within a session.
  const start = (new Date().getHours() * 3) % POOL.length;
  for (let i = 0; picks.length < 5 && i < POOL.length; i++) {
    picks.push(POOL[(start + i) % POOL.length]);
  }
  return picks.slice(0, 5);
}
