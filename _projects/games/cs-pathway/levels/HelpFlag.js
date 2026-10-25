// HelpFlag.js
// Tiny red flag in the corner of a level. One click sends a pre-written help
// request to the teacher (saved in Spring, listed on /mvc/cs-pathway/read).
// The level supplies getRequest() so the message names the student's current station.
import { sendHelpRequest } from '../services/HelpRequestApi.js';

const STATUS_VISIBLE_MS = 8000;
// Matches Spring's cooldown, so the flag is not clickable while the server would refuse it.
const COOLDOWN_MS = 60 * 1000;

class HelpFlag {
  /**
   * @param {{getRequest: () => {levelKey: string, station: string|null, message: string}}} options
   */
  constructor({ getRequest }) {
    if (typeof getRequest !== 'function') {
      throw new Error('HelpFlag needs a getRequest function');
    }
    this.getRequest = getRequest;
    this.sending = false;
    this.statusTimer = null;
    this.cooldownTimer = null;

    this.root = document.createElement('div');
    this.root.className = 'cs-pathway-help-flag';
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.className = 'cs-pathway-help-flag__button';
    this.button.textContent = '⚑';
    this.button.title = 'Stuck? Click to ask your teacher for help';
    this.button.setAttribute('aria-label', 'Ask your teacher for help');
    this.button.addEventListener('click', () => this.send());
    this.status = document.createElement('p');
    this.status.className = 'cs-pathway-help-flag__status';
    this.status.setAttribute('aria-live', 'polite');
    this.status.hidden = true;
    this.root.append(this.status, this.button);
    document.body.appendChild(this.root);
  }

  async send() {
    if (this.sending || this.button.disabled) return;
    this.sending = true;
    this.button.disabled = true;
    const request = this.getRequest();
    this.showStatus('Sending your help request...');
    try {
      await sendHelpRequest(request);
      this.showStatus(`Your teacher was notified: "${request.message}"`, 'sent');
      this.startCooldown(COOLDOWN_MS);
    } catch (error) {
      console.warn('[HelpFlag] help request failed:', error);
      this.showStatus(this.describeFailure(error), 'error');
      if (error.status === 429 && error.retryAfterSeconds) {
        this.startCooldown(error.retryAfterSeconds * 1000);
      } else {
        this.button.disabled = false;
      }
    } finally {
      this.sending = false;
    }
  }

  describeFailure(error) {
    if (error.status === 401 || error.status === 403) {
      return 'Sign in first so your teacher knows who needs help. You can also raise your hand.';
    }
    if (error.status === 429) {
      return 'Your teacher already has your help request. Hang tight!';
    }
    return 'The help request did not go through. Please raise your hand instead.';
  }

  startCooldown(milliseconds) {
    this.button.disabled = true;
    clearTimeout(this.cooldownTimer);
    this.cooldownTimer = setTimeout(() => {
      this.button.disabled = false;
    }, milliseconds);
  }

  showStatus(text, tone = '') {
    clearTimeout(this.statusTimer);
    this.status.textContent = text;
    this.status.dataset.tone = tone;
    this.status.hidden = false;
    if (tone) {
      this.statusTimer = setTimeout(() => {
        this.status.hidden = true;
      }, STATUS_VISIBLE_MS);
    }
  }

  destroy() {
    clearTimeout(this.statusTimer);
    clearTimeout(this.cooldownTimer);
    this.root.remove();
  }
}

export default HelpFlag;
