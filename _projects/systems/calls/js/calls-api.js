// Spring's /api/calls routes (mvc/calls in the Spring repo). Every request carries the sign-in
// cookie and the X-Origin header from config.js's fetchOptions, and every refusal becomes a
// CallsApiError with Spring's {"reason": ...}, so the page decides what to say from one field.

// Spring's path patterns: ids are positive whole numbers, identities [A-Za-z0-9_-]{1,64}
// (CallApiRestController), so nothing else can reach a route.
const IDENTITY = /^[A-Za-z0-9_-]{1,64}$/;

/** A refused or failed request: the HTTP status (0 when nothing answered), Spring's reason, and Retry-After seconds. */
export class CallsApiError extends Error {
  constructor(status, reason, retryAfter = null) {
    super(`Calls request failed: ${status}${reason ? ` ${reason}` : ''}`);
    this.name = 'CallsApiError';
    this.status = status;
    this.reason = reason;
    this.retryAfter = retryAfter;
  }
}

/** One client for the calls routes; make it with config.js's javaURI and fetchOptions. */
export class CallsApi {
  constructor({ javaURI, fetchOptions, fetch = null }) {
    if (typeof javaURI !== 'string' || !javaURI) throw new TypeError('CallsApi: javaURI must be config.js\'s javaURI');
    if (!fetchOptions || typeof fetchOptions !== 'object') throw new TypeError('CallsApi: fetchOptions must be config.js\'s fetchOptions');
    this.base = `${javaURI.replace(/\/+$/, '')}/api/calls`;
    this.fetchOptions = fetchOptions;
    // Called as a plain function: window.fetch called as a method of this object throws "Illegal invocation".
    this.send = fetch ?? ((url, init) => globalThis.fetch(url, init));
  }

  /** The room of a group, DM or course, made on first use: POST /api/calls. */
  open({ contextType, contextKey, purpose = null }) {
    const body = { contextType, contextKey };
    if (purpose) body.purpose = purpose;
    return this.request('POST', '', body);
  }

  /** A room the signed-in person may join: GET /api/calls/{id}. */
  get(id) {
    return this.request('GET', `/${CallsApi.id(id)}`);
  }

  /** A LiveKit join token {url, token, expiresIn, canModerate}: POST /api/calls/{id}/token. */
  token(id) {
    return this.request('POST', `/${CallsApi.id(id)}/token`);
  }

  /** A moderator cuts someone off until they are resumed. */
  pause(id, identity) {
    return this.participant(id, identity, 'pause');
  }

  /** A moderator lets a paused person back in; 409 WAITING_FOR_SUPERVISOR while the rules keep them paused. */
  resume(id, identity) {
    return this.participant(id, identity, 'resume');
  }

  /** A moderator sends someone out; they get no new token until the call ends. */
  remove(id, identity) {
    return this.participant(id, identity, 'remove');
  }

  /** A moderator ends the call for everyone. */
  end(id) {
    return this.request('POST', `/${CallsApi.id(id)}/end`);
  }

  participant(id, identity, action) {
    if (typeof identity !== 'string' || !IDENTITY.test(identity)) {
      throw new TypeError(`CallsApi.${action}: identity must match [A-Za-z0-9_-]{1,64}`);
    }
    return this.request('POST', `/${CallsApi.id(id)}/participants/${identity}/${action}`);
  }

  async request(method, path, body = undefined) {
    const init = {
      ...this.fetchOptions,
      method,
      headers: { ...this.fetchOptions.headers },
    };
    if (body !== undefined) init.body = JSON.stringify(body);
    let response;
    try {
      response = await this.send(`${this.base}${path}`, init);
    } catch (error) {
      throw Object.assign(new CallsApiError(0, 'NETWORK'), { cause: error });
    }
    let text = '';
    try {
      text = await response.text();
    } catch (error) {
      // The connection dropped while the answer was read: like no answer, unless the status already said no.
      if (response.ok) throw Object.assign(new CallsApiError(0, 'NETWORK'), { cause: error });
    }
    if (!response.ok) {
      const seconds = Number.parseInt(response.headers.get('Retry-After') ?? '', 10);
      throw new CallsApiError(response.status, CallsApi.reasonIn(text), Number.isFinite(seconds) ? seconds : null);
    }
    return text ? JSON.parse(text) : undefined;
  }

  /** Spring's {"reason": ...}, or null for an answer that isn't one (a proxy's error page). */
  static reasonIn(text) {
    try {
      const reason = JSON.parse(text)?.reason;
      return typeof reason === 'string' ? reason : null;
    } catch {
      return null;
    }
  }

  static id(value) {
    if (!Number.isSafeInteger(value) || value < 1) throw new TypeError(`CallsApi: a call id must be a positive whole number, not ${String(value)}`);
    return value;
  }
}
