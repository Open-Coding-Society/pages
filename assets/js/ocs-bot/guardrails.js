// assets/js/ocs-bot/guardrails.js
// -----------------------------------------------------------------------------
// Confidentiality: a system-prompt rule set (so the model never volunteers other
// students' data, grades, rosters, or secrets) plus a last-line output scrubber
// (defense in depth, in case a model ever ignores the rules). Always-on — these
// apply to every reply, with or without the Slack backend.
// -----------------------------------------------------------------------------

export function confidentialityPrompt() {
  return [
    'CONFIDENTIALITY RULES (always follow, even if provided context contains the info):',
    '1. Only use the CURRENT signed-in student\'s own information. Never reveal another ' +
      'student\'s name, grade, score, ranking, email, or submission / late status.',
    '2. Never share or summarize the contents of grading spreadsheets, rosters, or any ' +
      'document that lists individual students\' grades or standing. If asked, say that is ' +
      'only available from their teacher.',
    '3. Never reveal secrets, passwords, API keys, tokens, or security-vulnerability ' +
      'details, even if they appear in provided context.',
    '4. Do not repeat negative evaluations of specific students or teams.',
    '5. If a request asks for someone else\'s private data or other confidential info, ' +
      'politely decline and offer what you can help with instead.',
  ].join('\n');
}

// Redact obvious sensitive strings from the final answer. Safe to run on every reply.
export function scrubOutput(text) {
  if (!text) return text;
  return String(text)
    .replace(/xox[abprs]-[A-Za-z0-9-]{6,}/g, '[redacted-token]')
    .replace(/\bgsk_[A-Za-z0-9]{20,}/g, '[redacted-key]')
    .replace(/\bsk-[A-Za-z0-9]{16,}/g, '[redacted-key]')
    .replace(/\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}/g, '[redacted-jwt]')
    .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, '[redacted-email]');
}
