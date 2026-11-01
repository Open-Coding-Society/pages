// chatContext.js
// What the chat helper (levels/ChatHelper.js) knows about the student: the
// station they are on, what they finished, and their OS. Spring passes it to
// Gemini with every question (blueprint-spring: ToolchainChatService).
// No imports: tests load this file on its own.

export const MAX_CHAT_QUESTION_LENGTH = 500; // same cap as Spring's ToolchainChatService
export const MAX_CHAT_HISTORY_TURNS = 8; // Spring keeps only the last 8 turns too

/** A station step is plain text or { text, commands }; the helper needs both as one line. */
export function describeStep(step) {
  if (typeof step === 'string') return step;
  const commands = Array.isArray(step?.commands) ? step.commands : [];
  return [step?.text || '', ...commands].filter(Boolean).join(' ');
}

/**
 * @param {Object} opts
 * @param {Array<{id: string, name: string}>} opts.stations - every station, in trail order
 * @param {Iterable<string>} opts.completedIds - ids of the verified stations
 * @param {{name: string, skill?: string, instructions?: Array}|null} opts.activeStation - the station
 *   being worked on, with instructions already for the student's OS; null when the trail is done
 * @param {'active'|'stuck'} [opts.activeStatus]
 * @param {{line?: string}|null} [opts.failure] - the active station's last failed check, if any
 * @param {string|null} [opts.osLabel] - e.g. "macOS"
 * @returns the `progress` object of POST /api/cs-pathway/chat
 */
export function buildChatProgress({ stations, completedIds, activeStation, activeStatus = 'active', failure = null, osLabel = null }) {
  if (!Array.isArray(stations)) {
    throw new Error('buildChatProgress needs the list of stations');
  }
  const completed = new Set(completedIds || []);
  return {
    stationName: activeStation?.name || null,
    stationSkill: activeStation?.skill || null,
    stationStatus: activeStation ? (failure ? 'failed' : activeStatus) : null,
    os: osLabel || null,
    completedStations: stations.filter((station) => completed.has(station.id)).map((station) => station.name),
    totalStations: stations.length,
    stationSteps: (activeStation?.instructions || []).map(describeStep).filter(Boolean),
    failedChecks: failure?.line ? [failure.line] : [],
  };
}

/** The helper's first message: where the student is, so they know it can see their progress. */
export function chatGreeting(progress) {
  const done = `${progress.completedStations.length} of ${progress.totalStations} stations verified`;
  if (!progress.stationName) {
    return `You've finished the trail (${done})! Ask me anything about the tools you set up.`;
  }
  const status = progress.stationStatus === 'failed'
    ? ' A check failed there, so ask me what it means.'
    : '';
  return `You're at ${progress.stationName} (${done}).${status} Ask me anything about this station.`;
}

/** The last turns sent with a question; local-only turns (greetings, error notices) are left out. */
export function recentHistory(turns) {
  return turns.filter((turn) => !turn.local).slice(-MAX_CHAT_HISTORY_TURNS)
    .map(({ role, text }) => ({ role, text }));
}
