// ChatApi.js
// Spring endpoint for the chat helper (blueprint-spring: mvc/toolchain, ToolchainChatApiRestController).
// The student comes from the JWT cookie; Gemini answers using the progress the page sends.
import { javaURI, fetchOptions } from '@assets/js/api/config.js';

const CHAT_URL = `${javaURI}/api/cs-pathway/chat`;

/** Thrown when the server can't answer; `status` lets the UI pick a friendly message. */
export class ChatError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ChatError';
    this.status = status;
  }
}

/**
 * @param {{levelKey: string, question: string, progress: object, history: Array<{role: string, text: string}>}} request
 * @returns {Promise<string>} the helper's answer
 */
export async function askChatHelper({ levelKey, question, progress, history }) {
  const response = await fetch(CHAT_URL, {
    ...fetchOptions,
    method: 'POST',
    body: JSON.stringify({ levelKey, question, progress, history }),
  });
  let body = null;
  try {
    body = await response.json();
  } catch {
    // A proxy error page is not JSON; the status code below still explains the failure.
  }
  if (!response.ok || typeof body?.answer !== 'string') {
    throw new ChatError(body?.error || `The chat helper failed (HTTP ${response.status})`, response.status);
  }
  return body.answer;
}
