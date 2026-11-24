// forgeChatContext.js
// What the station helper (levels/ChatHelper.js) knows about Identity Forge:
// its five stations (one per pathwayScores task for this level), which are
// done, and the station the student is standing at. Spring's chat endpoint
// already accepts the "identity-forge" level key, so the helper's answers are
// specific to this page through the progress built here.
import { buildChatProgress } from './chatContext.js';

/** One entry per Identity Forge task, in trail order; gatekeeperId matches the station's NPC. */
export const FORGE_CHAT_STATIONS = [
  {
    id: 'identity',
    gatekeeperId: 'IdentityGatekeeper',
    name: 'Identity Terminal',
    skill: 'Registering your player identity',
    steps: ['Walk to the Identity Terminal and press E.', 'Enter your name to register your identity.'],
  },
  {
    id: 'course',
    gatekeeperId: 'CourseEnlistmentGatekeeper',
    name: 'Course Enlistment',
    skill: 'Planning your CS course pathway',
    steps: ['Press E at Course Enlistment.', 'Answer the questions to map your pathway and future classes.'],
  },
  {
    id: 'persona',
    gatekeeperId: 'PersonaHallGatekeeper',
    name: 'Persona Hall',
    skill: 'Choosing your CS persona',
    steps: ['Press E at Persona Hall.', 'Pick the persona that best matches how you work.'],
  },
  {
    id: 'avatar',
    gatekeeperId: 'AvatarGatekeeper',
    name: 'Avatar Forge',
    skill: 'Designing your avatar',
    steps: ['Press E at the Avatar Forge.', 'Tap a sprite to preview it, then use Done to keep your look.'],
  },
  {
    id: 'theme',
    gatekeeperId: 'WorldThemeGatekeeper',
    name: 'World Theme Portal',
    skill: 'Choosing your world theme',
    steps: ['Press E at the World Theme Portal.', 'Choose a background and watch your world transform.'],
  },
];

/**
 * @param {Object} opts
 * @param {Iterable<string>} opts.completedIds - finished Identity Forge task ids (pathwayScores)
 * @param {string|null} opts.activeGatekeeperId - the in-zone gatekeeper's sprite id, if any;
 *   with no gatekeeper in range the next unfinished station is the one to head for
 * @returns the `progress` object of POST /api/cs-pathway/chat
 */
export function buildForgeChatProgress({ completedIds, activeGatekeeperId }) {
  const done = new Set(completedIds || []);
  const station = FORGE_CHAT_STATIONS.find((entry) => entry.gatekeeperId === activeGatekeeperId)
    || FORGE_CHAT_STATIONS.find((entry) => !done.has(entry.id))
    || null;
  return buildChatProgress({
    stations: FORGE_CHAT_STATIONS,
    completedIds: done,
    activeStation: station ? { name: station.name, skill: station.skill, instructions: station.steps } : null,
  });
}
