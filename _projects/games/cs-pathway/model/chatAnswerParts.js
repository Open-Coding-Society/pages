// chatAnswerParts.js
// Splits a Station Helper answer into plain text and code, so the chat can show each
// command (and anything else the student must type exactly) with a Copy button.
// Spring's ToolchainChatService tells Gemini to put each command in its own ``` block
// and other exact text in single backticks.

// A first fence line like ```bash names the language; it is not part of the command.
const FENCE_LANGUAGE = /^[A-Za-z0-9_+-]+$/;

/**
 * @param {string} answer - the helper's reply
 * @returns {Array<{type: 'text'|'block'|'inline', text: string}>} in reading order;
 *   'block' is a fenced command, 'inline' is backticked text inside a sentence
 */
export function splitAnswerIntoParts(answer) {
  const parts = [];
  const pieces = String(answer ?? '').split('```');
  pieces.forEach((piece, index) => {
    const insideFence = index % 2 === 1;
    if (insideFence) {
      addBlock(parts, piece);
    } else {
      addTextWithInlineCode(parts, piece);
    }
  });
  return parts;
}

function addBlock(parts, piece) {
  const lines = piece.split('\n');
  if (lines.length > 1 && FENCE_LANGUAGE.test(lines[0].trim())) lines.shift();
  const code = lines.join('\n').trim();
  // An answer cut off mid-fence still shows what arrived as code.
  if (!code) return;
  // The code box starts its own line, so the line break Gemini puts before a fence would
  // show as a blank line.
  const previous = parts[parts.length - 1];
  if (previous?.type === 'text') {
    previous.text = previous.text.replace(/\s+$/, '');
    if (!previous.text) parts.pop();
  }
  parts.push({ type: 'block', text: code });
}

function addTextWithInlineCode(parts, piece) {
  // `code` on one line; a lone backtick stays plain text.
  const inlineCode = /`([^`\n]+)`/g;
  let last = 0;
  for (const match of piece.matchAll(inlineCode)) {
    addText(parts, piece.slice(last, match.index));
    const code = match[1].trim();
    if (code) parts.push({ type: 'inline', text: code });
    last = match.index + match[0].length;
  }
  addText(parts, piece.slice(last));
}

function addText(parts, text) {
  // Same for the line break after a fence.
  const afterBlock = parts[parts.length - 1]?.type === 'block';
  const shown = afterBlock ? text.replace(/^\s+/, '') : text;
  if (shown) parts.push({ type: 'text', text: shown });
}
