// ChatHelper.js
// Station Helper HUD panel inside the game box, top-right across from the player
// profile: a student can ask for help at any station. It starts minimized to its
// title bar so it doesn't cover the stations on the right of the map. Answers come
// from Gemini through Spring (services/ChatApi.js), which is told where the student
// is through getProgress() (see model/chatContext.js).
import { askChatHelper } from '../services/ChatApi.js';
import { chatGreeting, recentHistory, MAX_CHAT_QUESTION_LENGTH } from '../model/chatContext.js';

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

    this.root = document.createElement('section');
    this.root.className = 'cs-pathway-chat';
    this.root.setAttribute('aria-label', 'Station helper');
    this.root.innerHTML = `
      <header class="cs-pathway-chat__header">
        <h2 class="cs-pathway-chat__title">STATION HELPER</h2>
        <button type="button" class="cs-pathway-chat__toggle" aria-expanded="false"
          aria-label="Open the station helper" title="Ask for help with this station">+</button>
      </header>
      <div class="cs-pathway-chat__body" hidden>
        <div class="cs-pathway-chat__log" role="log" aria-live="polite"></div>
        <form class="cs-pathway-chat__form">
          <input class="cs-pathway-chat__input" type="text" maxlength="${MAX_CHAT_QUESTION_LENGTH}"
            placeholder="Ask about this station..." aria-label="Your question" autocomplete="off">
          <button type="submit" class="cs-pathway-chat__send">Send</button>
        </form>
        <p class="cs-pathway-chat__note">AI answers can be wrong. Never paste passwords or tokens.</p>
      </div>`;
    mountTo.appendChild(this.root);

    this.body = this.root.querySelector('.cs-pathway-chat__body');
    this.log = this.root.querySelector('.cs-pathway-chat__log');
    this.input = this.root.querySelector('.cs-pathway-chat__input');
    this.sendButton = this.root.querySelector('.cs-pathway-chat__send');
    this.toggleButton = this.root.querySelector('.cs-pathway-chat__toggle');

    this.toggleButton.addEventListener('click', () => this.setOpen(this.body.hidden));
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
    this.body.hidden = !open;
    this.root.classList.toggle('cs-pathway-chat--open', open);
    this.toggleButton.textContent = open ? '−' : '+';
    this.toggleButton.setAttribute('aria-expanded', String(open));
    this.toggleButton.setAttribute('aria-label', open ? 'Minimize the station helper' : 'Open the station helper');
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
      return 'Sign in so the helper can answer. You can also use the red flag to ask your teacher.';
    }
    // Spring's messages (busy, too soon, too long) are written for students.
    if (error.status && error.status !== 404 && error.message && !/HTTP \d+/.test(error.message)) {
      return error.message;
    }
    return "The helper isn't available right now. Use the red flag to ask your teacher.";
  }

  setSending(sending) {
    this.sending = sending;
    this.sendButton.disabled = sending;
  }

  addTurn(turn) {
    this.turns.push(turn);
    const bubble = document.createElement('p');
    bubble.className = `cs-pathway-chat__message cs-pathway-chat__message--${turn.role}`;
    if (turn.tone) bubble.dataset.tone = turn.tone;
    bubble.textContent = turn.text; // answers are plain text; never parsed as HTML
    turn.element = bubble;
    this.log.appendChild(bubble);
    this.log.scrollTop = this.log.scrollHeight;
    return turn;
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
