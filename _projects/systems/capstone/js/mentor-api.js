// Every Spring request the Capstone mentor controls make. The mentor is the signed-in session.

export class CapstoneApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'CapstoneApiError';
    this.status = status;
  }
}

export function createCapstoneApi({ javaURI, fetchOptions, text, fetchImpl = (...args) => fetch(...args) }) {
  async function readError(response) {
    const body = await response.json().catch(() => null);
    return new CapstoneApiError(response.status, typeof body?.message === 'string' && body.message
      ? body.message : text.error_failed);
  }

  async function request(path, { method = 'GET', body, credentials = fetchOptions.credentials } = {}) {
    let response;
    try {
      response = await fetchImpl(`${javaURI}/api/person/capstones${path}`, {
        ...fetchOptions,
        method,
        credentials,
        cache: 'no-store', // A card must show what the server holds now.
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      });
    } catch (error) {
      throw new CapstoneApiError(0, text.error_unreachable);
    }
    if (!response.ok) throw await readError(response);
    return response.json();
  }

  return {
    // Public, so a stale sign-in cookie can't hide approved mentors from a visitor.
    approvedMentors: () => request('/mentors', { credentials: 'omit' }),

    async person() {
      const response = await fetchImpl(`${javaURI}/api/person/get`, { ...fetchOptions, cache: 'no-store' });
      return response.ok ? response.json() : null;
    },

    choices: () => request(''),
    setChoice: (project, status) => request('/choice', { method: 'PUT', body: { project, status } }),
    requestProject: (project) => request('/request', { method: 'POST', body: { project } }),
    cancelRequest: (project) => request('/request', { method: 'DELETE', body: { project } }),
    resetChoices: () => request('/choices', { method: 'DELETE' }),
  };
}
