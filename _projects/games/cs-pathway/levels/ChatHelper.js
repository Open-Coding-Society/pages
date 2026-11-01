// ChatHelper.js
// Station Helper: a 💬 button in the bottom-right of the game box that opens a chat
// panel above it, so a student can ask for help at any station. Answers come
// from Gemini through Spring (services/ChatApi.js), which is told where the student
// is through getProgress() (see model/chatContext.js).
import { askChatHelper } from '../services/ChatApi.js';
import { chatGreeting, recentHistory, MAX_CHAT_QUESTION_LENGTH } from '../model/chatContext.js';
import { splitAnswerIntoParts } from '../model/chatAnswerParts.js';

const COPIED_LABEL_MS = 1500;

class ChatHelper {
  /**
   * @param {{levelKey: string, getProgress: () => object, mountTo: HTMLElement}} options -
   *   getProgress returns buildChatProgress() for the student's current state; mountTo is
   *   the game container, so the panel scales with the map like the other HUD panels
   */
  constructor({ levelKey, getProgress, mountTo }) {
    if (!levelKey || typeof getProgress !== 'function' || !mountTo) {
      throw new Error('ChatHelper needs a levelKey, a getProgress function and an element to mount in');
    }
    this.levelKey = levelKey;
    this.getProgress = getProgress;
    this.turns = []; // { role: 'student'|'helper', text, local? }
    this.greetedStation = undefined;
    this.sending = false;

    this.root = document.createElement('div');
    this.root.className = 'cs-pathway-chat';
    this.root.innerHTML = `
      <section class="cs-pathway-chat__panel" aria-label="Station helper" hidden>
        <header class="cs-pathway-chat__header">
          <h2 class="cs-pathway-chat__title">STATION HELPER</h2>
          <button type="button" class="cs-pathway-chat__close" aria-label="Close the station helper">−</button>
        </header>
        <div class="cs-pathway-chat__log" role="log" aria-live="polite"></div>
        <form class="cs-pathway-chat__form">
          <input class="cs-pathway-chat__input" type="text" maxlength="${MAX_CHAT_QUESTION_LENGTH}"
            placeholder="Ask about this station..." aria-label="Your question" autocomplete="off">
          <button type="submit" class="cs-pathway-chat__send">Send</button>
        </form>
        <p class="cs-pathway-chat__note">AI answers can be wrong. Never paste passwords or tokens.</p>
      </section>
      <button type="button" class="cs-pathway-chat__button" aria-label="Ask the station helper" aria-expanded="false"
        title="Ask the station helper">💬</button>`;
    mountTo.appendChild(this.root);

    this.panel = this.root.querySelector('.cs-pathway-chat__panel');
    this.log = this.root.querySelector('.cs-pathway-chat__log');
    this.input = this.root.querySelector('.cs-pathway-chat__input');
    this.sendButton = this.root.querySelector('.cs-pathway-chat__send');
    this.toggleButton = this.root.querySelector('.cs-pathway-chat__button');

    this.toggleButton.addEventListener('click', () => this.setOpen(this.panel.hidden));
    this.root.querySelector('.cs-pathway-chat__close').addEventListener('click', () => this.setOpen(false));
    this.root.querySelector('.cs-pathway-chat__form').addEventListener('submit', (event) => {
      event.preventDefault();
      this.ask();
    });
    // The game listens for keys on document/window (movement, E to open a station);
    // keep keys typed here from walking the player or opening stations.
    const keepKeysInChat = (event) => {
      if (event.key === 'Escape') this.setOpen(false);
      event.stopPropagation();
    };
    this.root.addEventListener('keydown', keepKeysInChat);
    this.root.addEventListener('keyup', (event) => event.stopPropagation());
  }

  setOpen(open) {
    this.panel.hidden = !open;
    this.toggleButton.setAttribute('aria-expanded', String(open));
    if (!open) {
      this.toggleButton.focus();
      return;
    }
    this.greetIfStationChanged();
    this.input.focus();
  }

  /** Says where the student is, again whenever they moved on to another station. */
  greetIfStationChanged() {
    const progress = this.getProgress();
    if (progress.stationName === this.greetedStation) return;
    this.greetedStation = progress.stationName;
    this.addTurn({ role: 'helper', text: chatGreeting(progress), local: true });
  }

  async ask() {
    const question = this.input.value.trim();
    if (!question || this.sending) return;
    this.greetIfStationChanged();
    const history = recentHistory(this.turns);
    this.addTurn({ role: 'student', text: question });
    this.input.value = '';
    this.setSending(true);
    const thinking = this.addTurn({ role: 'helper', text: 'Thinking...', local: true });
    try {
      const answer = await askChatHelper({
        levelKey: this.levelKey,
        question,
        progress: this.getProgress(),
        history,
      });
      this.removeTurn(thinking);
      this.addTurn({ role: 'helper', text: answer });
    } catch (error) {
      console.warn('[ChatHelper] question failed:', error);
      this.removeTurn(thinking);
      this.addTurn({ role: 'helper', text: this.describeFailure(error), local: true, tone: 'error' });
    } finally {
      this.setSending(false);
      this.input.focus();
    }
  }

  describeFailure(error) {
    if (error.status === 401 || error.status === 403) {
      return 'Sign in so the helper can answer.';
    }
    // Spring's messages (busy, too soon, too long) are written for students.
    if (error.status && error.status !== 404 && error.message && !/HTTP \d+/.test(error.message)) {
      return error.message;
    }
    return "The helper isn't available right now. Ask your teacher for help.";
  }

  setSending(sending) {
    this.sending = sending;
    this.sendButton.disabled = sending;
  }

  addTurn(turn) {
    this.turns.push(turn);
    const bubble = document.createElement('div');
    bubble.className = `cs-pathway-chat__message cs-pathway-chat__message--${turn.role}`;
    if (turn.tone) bubble.dataset.tone = turn.tone;
    if (turn.role === 'helper' && !turn.local) {
      this.renderAnswer(bubble, turn.text);
    } else {
      bubble.textContent = turn.text;
    }
    turn.element = bubble;
    this.log.appendChild(bubble);
    this.log.scrollTop = this.log.scrollHeight;
    return turn;
  }

  /** Answers are built from text nodes, never parsed as HTML; each piece of code gets a Copy button. */
  renderAnswer(bubble, answer) {
    splitAnswerIntoParts(answer).forEach((part) => {
      if (part.type === 'text') {
        bubble.append(part.text);
        return;
      }
      const wrapper = document.createElement(part.type === 'block' ? 'div' : 'span');
      wrapper.className = part.type === 'block' ? 'cs-pathway-chat__command' : 'cs-pathway-chat__inline';
      const code = document.createElement('code');
      code.className = 'cs-pathway-chat__code';
      code.textContent = part.text;
      wrapper.append(code, this.createCopyButton(part.text));
      bubble.append(wrapper);
    });
  }

  createCopyButton(text) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'cs-pathway-chat__copy';
    button.textContent = 'Copy';
    button.setAttribute('aria-label', `Copy ${text}`);
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(text);
        button.textContent = 'Copied!';
      } catch (error) {
        // Clipboard access needs https (or localhost) and permission; the code can still be selected.
        console.warn('[ChatHelper] copy failed:', error);
        button.textContent = 'Select it';
      }
      setTimeout(() => { button.textContent = 'Copy'; }, COPIED_LABEL_MS);
    });
    return button;
  }

  removeTurn(turn) {
    this.turns = this.turns.filter((other) => other !== turn);
    turn.element?.remove();
  }

  destroy() {
    this.root.remove();
  }
}

export default ChatHelper;
