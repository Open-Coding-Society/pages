// helpRequestMessage.js
// Pre-written text for the red flag help button, so a stuck student can ask
// their teacher for help with one click instead of typing a message.
// No imports: tests load this file on its own.

export const MAX_HELP_MESSAGE_LENGTH = 500; // same cap as Spring's CsPathwayHelpRequestService

/**
 * @param {{levelName: string, stationName?: string|null, osLabel?: string|null, stuck?: boolean}} context
 * @returns {string} the message sent to the teacher
 */
export function buildHelpRequestMessage({ levelName, stationName = null, osLabel = null, stuck = false }) {
  if (!levelName) {
    throw new Error('buildHelpRequestMessage needs a levelName');
  }
  const place = stationName ? `at ${stationName} in ${levelName}` : `in ${levelName}`;
  const system = osLabel ? ` on ${osLabel}` : '';
  const stuckNote = stuck ? ' I have been stuck here for a while.' : '';
  const message = `I need help ${place}${system}.${stuckNote} Can you come help me?`;
  return message.slice(0, MAX_HELP_MESSAGE_LENGTH);
}
