// One event page (layout: event, img2). The static page never claims a live state: the site
// rebuilds only on a push, so the browser moves the stage pill from Published to Active to
// Completed by the clock. The Sample pill is never touched. "Ask a question" opens the
// Microblog panel, and the latest questions show on the page when the event turned the
// Microblog on (Liquid writes no discussion section otherwise).
import { EventDiscussion } from './event-discussion.js';
import { EventTexts } from './event-texts.js';
import { EventTime } from './event-time.js';

/** The live parts of an event page. */
export class EventPage {
  /**
   * @param {HTMLElement} root - the article[data-event-page]
   * @param {{texts: object, topic: Function, pythonURI: string, fetchOptions: object, now?: Function,
   *   console?: Console, fetch?: Function}} options
   *   texts are the page's words (EventTexts.read); topic is the Microblog's MicroblogTopic class;
   *   pythonURI and fetchOptions come from config.js
   */
  constructor(root, { texts, topic, pythonURI, fetchOptions, now = () => new Date(), console: log = globalThis.console, fetch }) {
    this.root = root;
    this.texts = texts;
    this.topic = topic;
    this.pythonURI = pythonURI;
    this.fetchOptions = fetchOptions;
    this.now = now;
    this.console = log;
    this.fetch = fetch;
  }

  /**
   * Updates the stage pill, offers "Ask a question" when the Microblog panel is on the page, and
   * lists the latest questions when the page has their list.
   * @returns {EventPage}
   */
  start() {
    this.showStage();
    this.offerQuestions();
    const list = this.root.querySelector('[data-event-discussion-list]');
    if (list) {
      this.discussion = new EventDiscussion(list, {
        topic: this.topic, pythonURI: this.pythonURI, fetchOptions: this.fetchOptions, texts: this.texts.page,
        shown: this.texts.discussion.shown, fetch: this.fetch, console: this.console,
      });
      this.discussion.start();
    }
    return this;
  }

  /**
   * Shows the later of the built stage and the clock's on the stage pill. In a time zone the
   * browser doesn't know, the built pill stays and the page warns once.
   */
  showStage() {
    const data = this.root.dataset;
    let window;
    try {
      window = EventTime.window({ day: data.eventDay, start: data.eventStart, end: data.eventEnd, zone: data.eventZone });
    } catch (error) {
      if (!(error instanceof RangeError)) throw error;
      this.console.warn(`Events: this browser doesn't know the time zone ${data.eventZone}, so the page keeps its built stage`, error);
      return;
    }
    const order = this.texts.lifecycle.map((stage) => stage.key);
    EventTexts.showStage(this.root.querySelector('[data-event-pill]'), this.texts.lifecycle, EventTime.stage(data.eventStage, this.now(), window, order));
  }

  /**
   * Shows "Ask a question" when the Microblog's toggle is on the page, and makes it click the toggle.
   */
  offerQuestions() {
    const offer = this.root.querySelector('[data-event-discuss]');
    const toggle = this.root.ownerDocument.getElementById('microblog-toggle-btn');
    if (!offer || !toggle) return;
    offer.hidden = false;
    offer.querySelector('button').addEventListener('click', () => toggle.click());
  }
}
