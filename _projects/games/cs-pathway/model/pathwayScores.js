// pathwayScores.js
// Per-level score tracking for the CS Pathway game.
// A level's score is its percent complete (0-100). Task-based levels count
// finished tasks; Mission Tools and Toolchain Trail report a done/total ratio.
// Scores are cached in localStorage (so the dashboard works offline/logged out)
// and saved to Spring when the student is signed in.
import { fetchLevelScores, saveLevelProgress } from '../services/PathwayScoreApi.js';

export const SCORES_UPDATED_EVENT = 'cs-pathway-scores-updated';

// Keys match blueprint-spring's CsPathwayLevel enum; pagePath is each level's
// permalink (navigation/*.md) and the array order is the play order.
export const PATHWAY_LEVELS = [
  {
    key: 'identity-forge',
    name: 'Identity Forge',
    shortName: 'Forge',
    pagePath: '/cs-pathway',
    tasks: ['identity', 'course', 'persona', 'avatar', 'theme'],
  },
  {
    key: 'wayfinding-world',
    name: 'Wayfinding World',
    shortName: 'Wayfinding',
    pagePath: '/cs-pathway/wayfinding',
    tasks: ['code-hub', 'persona-trial', 'about-me', 'sprint-success', 'empathy-epic'],
  },
  { key: 'mission-tools', name: 'Mission Tools', shortName: 'Mission', pagePath: '/cs-pathway/mission-tools', tasks: null },
  {
    key: 'assessment-observatory',
    name: 'Assessment Observatory',
    shortName: 'Assessment',
    pagePath: '/cs-pathway/assessment-observatory',
    tasks: ['ai-skill-advisor', 'github-analytics', 'sprint-coach'],
  },
  { key: 'toolchain-trail', name: 'Toolchain Trail', shortName: 'Toolchain', pagePath: '/cs-pathway/toolchain-trail', tasks: null },
];

const TASKS_STORAGE_KEY = 'cs_pathway_level_tasks';
const SCORES_STORAGE_KEY = 'cs_pathway_level_scores';

function findLevel(levelKey) {
  const level = PATHWAY_LEVELS.find((entry) => entry.key === levelKey);
  if (!level) throw new Error(`Unknown CS Pathway level: ${levelKey}`);
  return level;
}

function readJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || {};
  } catch {
    return {};
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`[pathwayScores] could not save ${key}:`, error);
  }
}

/** The level after levelKey in play order, or null for the last level. */
export function getNextLevel(levelKey) {
  const index = PATHWAY_LEVELS.findIndex((entry) => entry.key === levelKey);
  if (index === -1) throw new Error(`Unknown CS Pathway level: ${levelKey}`);
  return PATHWAY_LEVELS[index + 1] || null;
}

/** @returns {Object<string, number>} levelKey -> percent complete */
export function getCachedScores() {
  return readJson(SCORES_STORAGE_KEY);
}

// Progress never goes down, matching the server (CsPathwayScoreService).
function cacheScore(levelKey, percent) {
  const scores = getCachedScores();
  scores[levelKey] = Math.max(scores[levelKey] || 0, percent);
  writeJson(SCORES_STORAGE_KEY, scores);
  window.dispatchEvent(new CustomEvent(SCORES_UPDATED_EVENT, { detail: { scores } }));
  return scores[levelKey];
}

async function recordPercent(levelKey, percent) {
  const rounded = Math.round(Math.min(100, Math.max(0, percent)) * 10) / 10;
  cacheScore(levelKey, rounded);
  try {
    const saved = await saveLevelProgress(levelKey, rounded);
    cacheScore(levelKey, saved.percentComplete);
  } catch (error) {
    // Logged-out play still updates the local dashboard; it syncs on a later save.
    console.warn('[pathwayScores]', error.message);
  }
}

/** Marks one task of a task-based level as done and saves the new percent. */
export function completeLevelTask(levelKey, taskId) {
  const level = findLevel(levelKey);
  if (!level.tasks?.includes(taskId)) {
    throw new Error(`Unknown task "${taskId}" for level ${levelKey}`);
  }
  const allTasks = readJson(TASKS_STORAGE_KEY);
  const done = new Set(allTasks[levelKey] || []);
  if (done.has(taskId)) return Promise.resolve();
  done.add(taskId);
  allTasks[levelKey] = [...done];
  writeJson(TASKS_STORAGE_KEY, allTasks);
  return recordPercent(levelKey, (done.size / level.tasks.length) * 100);
}

/** Saves progress for ratio-based levels (e.g. 3 of 4 workbenches cleared). */
export function recordLevelRatio(levelKey, doneCount, totalCount) {
  findLevel(levelKey);
  if (!(totalCount > 0)) {
    throw new Error(`totalCount must be positive for ${levelKey}`);
  }
  const done = Math.min(Math.max(doneCount, 0), totalCount);
  return recordPercent(levelKey, (done / totalCount) * 100);
}

/** Pulls the signed-in student's saved scores from Spring into the local cache. */
export async function syncScoresFromServer() {
  try {
    const levels = await fetchLevelScores();
    levels.forEach((level) => cacheScore(level.levelKey, level.percentComplete || 0));
  } catch (error) {
    console.warn('[pathwayScores]', error.message);
  }
  return getCachedScores();
}
