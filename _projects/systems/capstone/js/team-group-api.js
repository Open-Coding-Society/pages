/**
 * The Spring requests a capstone team chat makes. Every method answers { ok, status, data, reason }:
 * data is the JSON Spring sent (or null), and reason is the code Spring gives when one of its mentor
 * rules refused the request (see MentorRules in Spring), so the page can show its own words for it.
 * A request that never reaches Spring answers status 0 instead of throwing.
 */
export class TeamGroupApi {
  /**
   * @param {object} options
   * @param {string} options.javaURI Spring's address, from config.js.
   * @param {object} options.fetchOptions The site's fetch options, which send the sign-in cookie.
   * @param {Function} [options.fetch] The fetch to use; tests pass their own. The default calls the
   *   browser's fetch as a plain function, since the browser refuses it as a method of another object.
   */
  constructor({ javaURI, fetchOptions, fetch = (url, options) => globalThis.fetch(url, options) }) {
    this.javaURI = javaURI;
    this.fetchOptions = fetchOptions;
    this.fetch = fetch;
  }

  /** The signed-in person: GET /api/person/get. */
  me() {
    return this.request('GET', '/api/person/get');
  }

  /** The groups a person belongs to, with their members: GET /api/groups/person/{id}. */
  groupsOf(personId) {
    return this.request('GET', `/api/groups/person/${encodeURIComponent(personId)}`);
  }

  /**
   * The group with exactly this name, or null in data. Spring's search matches part of a name,
   * so the exact match is picked here.
   */
  async findByName(name) {
    const answer = await this.request('GET', `/api/groups/search?name=${encodeURIComponent(name)}`);
    if (!answer.ok) return answer;
    const match = Array.isArray(answer.data) ? answer.data.find(group => group?.name === name) : null;
    return { ...answer, data: match ?? null };
  }

  /** Sends one request and reads its JSON, whatever the status. */
  async request(method, path) {
    let response;
    try {
      response = await this.fetch(`${this.javaURI}${path}`, { ...this.fetchOptions, method });
    } catch {
      return { ok: false, status: 0, data: null, reason: '' };
    }
    let data = null;
    try {
      data = await response.json();
    } catch (error) {
      // A refusal may come without a body; a success always has one, so an unreadable one is a failure.
      if (response.ok) {
        console.warn(`Team chat: ${method} ${path} answered ${response.status} without readable JSON`, error);
        return { ok: false, status: response.status, data: null, reason: '' };
      }
    }
    const reason = !response.ok && typeof data?.reason === 'string' ? data.reason : '';
    return { ok: response.ok, status: response.status, data, reason };
  }
}
