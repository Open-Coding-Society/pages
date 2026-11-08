// Requests to one backend, Flask or Spring, at its base URL with the site's fetch options. Each
// request resolves to the answer's JSON, null for an empty body, or its text when it isn't JSON
// (the same rule as Messages' messages-api.js), and rejects with a BackendError.

// Names the request that failed and carries its HTTP status (0 when the server can't be reached)
// and the parsed answer, so callers can show what the server said.
export class BackendError extends Error {
  constructor({ status, method, path, body = null, cause } = {}) {
    super(status ? `${method} ${path} answered HTTP ${status}` : `${method} ${path} could not reach the server`, cause ? { cause } : undefined);
    this.name = 'BackendError';
    this.status = status;
    this.method = method;
    this.path = path;
    this.body = body;
  }
}

export class Backend {
  constructor(baseUrl, fetchOptions) {
    this.baseUrl = baseUrl;
    this.fetchOptions = fetchOptions;
  }

  async request(path, { method = 'GET', body } = {}) {
    const options = { ...this.fetchOptions, method };
    if (body !== undefined) options.body = JSON.stringify(body);
    // The connection can also drop after the headers, while the body is read: that answer never
    // arrived either, so it is status 0 too.
    let response;
    let text;
    try {
      response = await fetch(`${this.baseUrl}${path}`, options);
      text = await response.text();
    } catch (cause) {
      throw new BackendError({ status: 0, method, path, cause });
    }
    const answer = parseAnswer(text);
    if (!response.ok) throw new BackendError({ status: response.status, method, path, body: answer });
    return answer;
  }
}

function parseAnswer(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// One backend for Flask and, only on a site that has Spring (spring: true), one for Spring.
export function createBackends({ pythonURI, javaURI, fetchOptions, springEnabled }) {
  return {
    flask: new Backend(pythonURI, fetchOptions),
    spring: springEnabled ? new Backend(javaURI, fetchOptions) : null,
  };
}
