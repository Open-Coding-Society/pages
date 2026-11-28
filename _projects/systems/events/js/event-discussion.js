// "Questions and Discussion" on an event page: the event's latest Microblog posts, read
// from the Microblog's own storage through Flask's public page-topic route, so signed-out
// visitors see them too. The topic is the page's permalink, the same one the Microblog panel
// posts to; asking a question happens in that panel, which needs a sign-in.

/** The latest questions from an event's Microblog topic. */
export class EventDiscussion {
  /**
   * @param {HTMLElement} root - the div[data-event-discussion-list], whose data-event-topic is the page's permalink
   * @param {{topic: Function, pythonURI: string, fetchOptions: object, texts: object, shown: number,
   *   fetch?: Function, console?: Console}} options
   *   topic is the Microblog's MicroblogTopic class, which reads the topic and holds the rules for
   *   showing a post; texts are the page's words; shown is how many posts to list
   */
  constructor(root, { topic, pythonURI, fetchOptions, texts, shown, fetch, console: log = globalThis.console }) {
    this.root = root;
    this.topic = topic;
    this.pythonURI = pythonURI;
    this.fetchOptions = fetchOptions;
    this.texts = texts;
    this.shown = shown;
    this.fetch = fetch;
    this.console = log;
  }

  /**
   * Reads the topic and lists its newest posts: "no questions yet" before anyone posts (Flask has
   * no topic then), and "couldn't load" with one warning when the read fails.
   * @returns {Promise<void>}
   */
  async start() {
    let answer;
    try {
      answer = await this.topic.latest({
        pythonURI: this.pythonURI, fetchOptions: this.fetchOptions, path: this.root.dataset.eventTopic, limit: this.shown, fetch: this.fetch,
      });
    } catch (error) {
      this.console.warn('Events: the latest questions could not load', error);
      this.say(this.texts.discussion_failed);
      return;
    }
    if (answer.posts.length === 0) {
      this.say(this.texts.discussion_none);
      return;
    }
    const list = this.root.ownerDocument.createElement('ul');
    list.className = 'ocs__entity-list';
    answer.posts.slice(0, this.shown).forEach((post) => list.append(this.item(post)));
    this.root.replaceChildren(list);
  }

  /**
   * One post as text only: its writer's first name, its time and its words, by the Microblog's rules.
   * @param {{userName?: string, content?: string, timestamp?: string}} post - as Flask sends it
   * @returns {HTMLLIElement}
   */
  item(post) {
    const doc = this.root.ownerDocument;
    const item = doc.createElement('li');
    const name = doc.createElement('strong');
    name.textContent = this.topic.firstName(post.userName) || this.texts.discussion_someone;
    item.append(name);
    const when = this.topic.timeOf(post.timestamp);
    if (when) {
      const time = doc.createElement('time');
      time.className = 'ocs__text';
      time.setAttribute('datetime', when.toISOString());
      time.textContent = this.topic.timeLabel(when);
      item.append(' ', time);
    }
    const words = doc.createElement('p');
    words.textContent = typeof post.content === 'string' ? post.content : '';
    item.append(words);
    return item;
  }

  /**
   * Shows one line in place of the list.
   * @param {string} text
   */
  say(text) {
    const line = this.root.ownerDocument.createElement('p');
    line.className = 'ocs__text';
    line.textContent = text;
    this.root.replaceChildren(line);
  }
}
