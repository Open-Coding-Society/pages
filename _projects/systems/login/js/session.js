// Sign-up, sign-in, logout and the signed-in user. FlaskSession is the core every site has (OCS
// for Business); SpringSession extends it for sites that also run Spring (OCS for Education) and
// does each step on Spring too. Flask's step must work. Spring's is reported, never thrown, so a
// Spring failure never undoes a Flask account or sign-in.
import { BackendError } from './backend.js';

export class FlaskSession {
  constructor({ flask }) {
    this.flask = flask;
  }

  get usesSpring() {
    return false;
  }

  // Whether signing up this account also creates a Spring account.
  createsSpringAccount(account) {
    return false;
  }

  // Creates the account in Flask. Resolves { flask: true, spring }, where spring is null here and,
  // in SpringSession, a promise of Spring's own result, so the page can show Flask's result first.
  // Rejects with a BackendError whose message is what to show (status 0: Flask is unreachable).
  async signUp(account) {
    let answer;
    try {
      answer = await this.flask.request('/api/user', { method: 'POST', body: account });
    } catch (error) {
      if (error.status === 0) throw error;
      throw signUpRefused(error.status, error.body);
    }
    // Not a JSON object (an error page from a proxy, or "null") is a failure too. Flask answers a
    // created account with 200.
    if (!isObject(answer) || answer.success === false) throw signUpRefused(200, answer);
    return { flask: true, spring: null };
  }

  // Signs in to Flask. Resolves Flask's answer, which says whether the student must re-verify.
  // Rejects with a BackendError (status 0: Flask is unreachable).
  async signIn(uid, password) {
    const answer = await this.flask.request('/api/authenticate', { method: 'POST', body: { uid, password } });
    return { flask: isObject(answer) ? answer : undefined };
  }

  async signOut() {
    try {
      await this.flask.request('/api/authenticate', { method: 'DELETE' });
    } catch (error) {
      console.error('python logout failed:', error);
    }
  }

  // The signed-in user, or null when nobody is signed in or Flask can't be reached.
  async currentUser() {
    try {
      return await this.flask.request('/api/id');
    } catch (error) {
      if (error.status) console.warn('HTTP status code: ' + error.status);
      else console.error('Fetch error: ', error);
      return null;
    }
  }
}

export class SpringSession extends FlaskSession {
  constructor({ flask, spring }) {
    super({ flask });
    this.spring = spring;
  }

  get usesSpring() {
    return true;
  }

  // A guest never gets a Spring account: it would be a full account.
  createsSpringAccount(account) {
    return account.accountType !== 'guest';
  }

  // After Flask accepts the account, creates it in Spring as well. `spring` is a promise of
  // { created, error } that never rejects; error is Spring's own text, "HTTP <status>", or
  // "Spring server unreachable".
  async signUp(account) {
    const result = await super.signUp(account);
    if (!this.createsSpringAccount(account)) return result;
    return { ...result, spring: this.#createSpringAccount(account) };
  }

  async #createSpringAccount(account) {
    try {
      await this.spring.request('/api/person/create', { method: 'POST', body: account });
      return { created: true, error: '' };
    } catch (error) {
      console.warn('Spring signup failed:', error.status, error.body);
      return { created: false, error: springErrorText(error) };
    }
  }

  // Signs in to Flask and Spring at the same time. Rejects only when Flask refuses; spring is
  // false when only Spring refused.
  async signIn(uid, password) {
    const spring = this.#signInToSpring(uid, password);
    const { flask } = await super.signIn(uid, password);
    return { flask, spring: await spring };
  }

  async #signInToSpring(uid, password) {
    try {
      await this.spring.request('/authenticate', { method: 'POST', body: { uid, password } });
      await this.spring.request('/api/person/get');
      return true;
    } catch (error) {
      console.error('Spring login failed:', error.message);
      return false;
    }
  }

  async signOut() {
    await super.signOut();
    try {
      await this.spring.request('/api/logout', { method: 'POST' });
    } catch (error) {
      console.error('java logout failed:', error);
    }
  }

  // Whether Spring still has this browser signed in. Resolves false when Spring refuses, and
  // rejects when Spring can't be reached, since then nothing is known.
  async springSignedIn() {
    try {
      await this.spring.request('/api/person/get');
      return true;
    } catch (error) {
      if (error.status === 0) throw error;
      return false;
    }
  }
}

// SpringSession only when the site has a Spring backend (createBackends makes it for spring: true).
export function createSession({ flask, spring }) {
  return spring ? new SpringSession({ flask, spring }) : new FlaskSession({ flask });
}

function signUpRefused(status, answer) {
  const message = isObject(answer) && answer.message ? answer.message : `Flask signup failed (${status})`;
  const error = new BackendError({ status, method: 'POST', path: '/api/user', body: answer });
  error.message = message;
  return error;
}

// Spring's /api/person/create answers errors as {"error": "..."}, for example a uid conflict.
function springErrorText(error) {
  if (error.status === 0) return 'Spring server unreachable';
  return isObject(error.body) && error.body.error ? error.body.error : `HTTP ${error.status}`;
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
