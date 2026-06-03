// assets/js/ocs-bot/slack.js
// -----------------------------------------------------------------------------
// Live class-Slack helpers for the assistant: the class-question heuristic, the
// capability text (so the model KNOWS it can read Slack and can self-trigger a
// lookup via a [[SLACK: query]] token — same idea as the [[GO:/path]] nav token),
// and context formatting. The network call lives in api.js (fetchSlack); course
// resolution in identity.js. Reads the shared #announcements / #general / #coding
// channels, which cover all periods of CSP, CSA and CSSE.
//
// All of this is DORMANT unless config.SLACK_ENABLED is true (the OCS Slack backend
// + bot token must be deployed first). Until then the bot never mentions Slack.
// -----------------------------------------------------------------------------

const CLASS_RE = new RegExp(
  '\\b(' + [
    'homework', 'hw', 'assignment', 'assignments', 'due', 'deadline', 'late',
    'grade', 'grading', 'graded', 'rubric',
    'project', 'projects', 'capstone', 'sprint', 'sprint9', 'milestone',
    'n@tm', 'natm', 'night at the museum', 'expo', 'cte', 'presentation',
    'panel', 'panelist', 'speaker', 'demo', 'demos',
    'ap test', 'ap exam', 'requirements\\.txt', 'no module', 'modulenotfound',
    'wsl', 'ubuntu', 'deploy', 'deployment', 'blog', 'reflection', 'issue',
    'mortensen', 'mr ?mort', 'announcement', 'announced', 'sign ?off',
    'repo', 'readme', 'this week', 'what.?s due', 'when is',
    'csp', 'csa', 'csse', 'quest', 'gamify', 'lxd', 'clicker',
    'fork', 'forking', 'baseurl', '_config',
  ].join('|') + ')\\b', 'i'
);

export function looksClassRelated(text) { return CLASS_RE.test(text || ''); }

export function formatSlackContext(msgs) {
  if (!msgs || !msgs.length) return '';
  const lines = msgs.map((m) => {
    const links = (m.links && m.links.length) ? '  Links: ' + m.links.join(' ') : '';
    return '- [' + m.channel + ' | ' + m.author + ' | ' + m.date + '] ' + m.text + links;
  });
  return 'LIVE CLASS SLACK CONTEXT (most recent posts across CSP, CSA and CSSE, ' +
         'read-only, from the OCS Slack):\n' + lines.join('\n');
}

// The model can request its own lookup by emitting one of these lines.
export const SLACK_REQUEST_RE = /\[\[SLACK:\s*([^\]\n]+)\]\]/i;

export function capabilityPrompt() {
  return [
    'You can read the school\'s live class Slack: recent posts from #announcements,',
    '#general and #coding, which cover all three courses (CSP, CSA, CSSE), including',
    'homework, deadlines, grading days, quests, events, build fixes, and Mr.',
    'Mortensen\'s announcements. If a student asks whether you can see Slack or check',
    'announcements, say yes and offer to look. When you need class info that was not',
    'already provided to you, request it by outputting a single line exactly like',
    '[[SLACK: short search query]] and nothing else. The system will reply with the',
    'matching posts, and you then answer, citing the channel.',
  ].join(' ');
}
