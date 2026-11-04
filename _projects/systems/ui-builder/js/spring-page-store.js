// Pages saved to Spring's mvc/uibuilder (DESIGN §7.3, §9.5). It has LocalPageStore's methods with
// the same signatures, so the editor never asks which store it has; refs say where a page lives
// ({kind: 'spring'} here, {kind: 'local'} still handled by LocalPageStore). Every request sends
// config.js fetchOptions' headers (X-Origin: client, Content-Type: application/json, which
// Spring's request guard requires on every route, reads included) with credentials: 'include'.
// Non-2xx answers become the typed errors of page-store.js; no answer at all is an OfflineError.
// Answers are checked before use: only the fields the shapes in §9.5 name are passed on.
import {
  ApiError, ConflictError, LocalPageStore, NotFoundError, OfflineError, SlugTakenError, pageFields,
} from './page-store.js';
import { textOf } from './registry.js';

const API = '/api/ui-builder';
const BLOCK_ID = /^b-[a-z0-9]{6,12}$/;
const MAX_DETAILS = 200;
const TEACHER_ROLES = new Set(['ROLE_TEACHER', 'ROLE_ADMIN']);

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const own = (value, key) => (isObject(value) && Object.prototype.hasOwnProperty.call(value, key) ? value[key] : undefined);
const str = (value) => (typeof value === 'string' ? value : null);
const int = (value) => (Number.isSafeInteger(value) ? value : null);
const bool = (value) => value === true;

function idOf(value) {
  const id = typeof value === 'string' && /^\d{1,16}$/.test(value) ? Number(value) : value;
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function leaseOf(value) {
  if (!isObject(value)) return null;
  return { holderName: str(value.holderName), expiresAt: int(value.expiresAt), mine: bool(value.mine) };
}

// PageSummary (§9.5) with the store's ref and base added.
function summaryOf(raw) {
  const id = idOf(own(raw, 'id'));
  const version = int(own(raw, 'version'));
  if (id === null || version === null) return null;
  return {
    ref: { kind: 'spring', id },
    base: version,
    id,
    slug: str(raw.slug),
    title: str(raw.title) || '',
    description: str(raw.description) || '',
    byline: str(raw.byline) || '',
    course: str(raw.course) || '',
    image: str(raw.image) || '',
    status: str(raw.status) || 'DRAFT',
    visibility: str(raw.visibility) || 'SIGNED_IN',
    publicRequested: bool(raw.publicRequested),
    publicUntil: int(raw.publicUntil),
    publicPending: bool(raw.publicPending),
    // Spring says outright whether the approval ran out and which version it approved; older
    // answers have neither, so publicExpired stays undefined and the publicUntil fallback decides.
    publicExpired: typeof raw.publicExpired === 'boolean' ? raw.publicExpired : undefined,
    publicVersion: int(raw.publicVersion),
    groupId: idOf(raw.groupId),
    groupName: str(raw.groupName),
    ownerName: str(raw.ownerName),
    isOwner: bool(raw.isOwner),
    version,
    updatedAt: int(raw.updatedAt),
    updatedByName: str(raw.updatedByName),
    publishedAt: int(raw.publishedAt),
    publishedVersion: int(raw.publishedVersion),
    hasUnpublishedChanges: bool(raw.hasUnpublishedChanges),
    lease: leaseOf(raw.lease),
  };
}

function detailsOf(value) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, MAX_DETAILS).filter(isObject).map((item) => ({
    nodeId: str(item.nodeId), field: str(item.field), key: str(item.key) || 'invalid',
  }));
}

const STATUS_CODES = { 400: 'bad_request', 401: 'unauthorized', 403: 'forbidden', 404: 'not_found', 409: 'conflict', 413: 'too_large' };

// A refusal → the typed error the editor branches on (by .name). Bodies are {error, ...}.
function refusal(status, body, { ref = null, base = null } = {}) {
  const code = str(own(body, 'error')) || STATUS_CODES[status] || (status >= 500 ? 'server' : 'http');
  if (status === 404) return new NotFoundError({ status, error: code, body });
  if (status === 409 && code === 'version_conflict') {
    return new ConflictError({
      ref, base, body,
      current: { base: int(own(body, 'currentVersion')), savedByName: str(own(body, 'savedByName')), savedAt: int(own(body, 'savedAt')) },
    });
  }
  if (status === 409 && (code === 'slug_taken' || code === 'slug_locked')) return new SlugTakenError({ status, error: code, body });
  return new ApiError({ status, error: code, details: detailsOf(own(body, 'details')), body });
}

const badResponse = (status) => new ApiError({ status, error: 'bad_response' });

export class SpringPageStore extends LocalPageStore {
  #javaURI;
  #fetchOptions;
  #fetch;
  #timeoutMs;
  #teacher = false;

  constructor({ javaURI, fetchOptions, fetchImpl = (...args) => globalThis.fetch(...args), timeoutMs = 20000, ...local } = {}) {
    super(local);
    if (typeof javaURI !== 'string' || !/^https?:\/\/[^/]/.test(javaURI)) throw new TypeError('SpringPageStore: javaURI must be config.js javaURI');
    if (!isObject(fetchOptions)) throw new TypeError('SpringPageStore: fetchOptions must be config.js fetchOptions');
    if (typeof fetchImpl !== 'function') throw new TypeError('SpringPageStore: fetchImpl must be a function');
    if (!Number.isInteger(timeoutMs) || timeoutMs < 1) throw new TypeError('SpringPageStore: timeoutMs must be a positive whole number');
    this.#javaURI = javaURI.replace(/\/+$/, '');
    this.#fetchOptions = fetchOptions;
    this.#fetch = fetchImpl;
    this.#timeoutMs = timeoutMs;
  }

  get capabilities() {
    return { cloud: true, publish: true, visibility: true, revisions: true, leases: true, teams: true, gallery: true, teacher: this.#teacher };
  }

  // One request → parsed JSON (null for an empty body). keepalive lets a release outlive the page.
  async #request(method, path, { body, keepalive = false, context = {} } = {}) {
    const headers = { ...(isObject(this.#fetchOptions.headers) ? this.#fetchOptions.headers : {}) };
    // Spring's guard needs both; header names are case-insensitive, so a differently cased copy counts.
    const named = (name) => Object.keys(headers).some((key) => key.toLowerCase() === name);
    if (!named('content-type')) headers['Content-Type'] = 'application/json';
    if (!named('x-origin')) headers['X-Origin'] = 'client';
    const init = { ...this.#fetchOptions, method, headers, mode: 'cors', credentials: 'include', cache: 'no-store' };
    // POSTs Spring reads no body from still say they are JSON, so they carry an empty object.
    if (body !== undefined) init.body = JSON.stringify(body);
    else if (method === 'POST' || method === 'PUT') init.body = '{}';
    let timer = null;
    let timedOut = false;
    if (keepalive) init.keepalive = true;
    else {
      const controller = new AbortController();
      init.signal = controller.signal;
      timer = setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, this.#timeoutMs);
    }
    const fetchImpl = this.#fetch; // called unbound: window.fetch refuses another `this`
    let status;
    let text;
    try {
      const response = await fetchImpl(`${this.#javaURI}${path}`, init);
      status = Number(response && response.status) || 0;
      text = await response.text();
    } catch (error) {
      throw new OfflineError({ reason: timedOut ? 'timeout' : 'network', cause: error });
    } finally {
      clearTimeout(timer);
    }
    let json = null;
    if (text) {
      try {
        json = JSON.parse(text);
      } catch (_) {
        json = undefined; // an HTML error page from a proxy, say
      }
    }
    if (status < 200 || status > 299) throw refusal(status, json === undefined ? null : json, context);
    if (json === undefined) throw badResponse(status);
    return json;
  }

  #pagePath(ref, suffix = '') {
    if (!isObject(ref) || ref.kind !== 'spring') throw new TypeError('SpringPageStore: ref must be {kind: "spring", id}');
    const id = idOf(ref.id);
    if (id === null) throw new NotFoundError({ status: 0 });
    return `${API}/pages/${id}${suffix}`;
  }

  // A PageDetail → {base, meta, page}: the summary as meta and the draft spec as page.
  #detail(json) {
    const meta = summaryOf(json);
    if (!meta || !isObject(own(json, 'spec'))) throw badResponse(200);
    return { base: meta.base, meta, page: json.spec };
  }

  #fields(page, fields = {}) {
    const out = pageFields(page, fields);
    if (!out.title.trim() && this.registry) out.title = textOf(this.registry, 'blocks.untitled');
    // A save without groupId keeps the page's group; groupId: null removes it.
    if (isObject(fields) && Object.prototype.hasOwnProperty.call(fields, 'groupId')) out.groupId = fields.groupId === null ? null : idOf(fields.groupId);
    return out;
  }

  // Slugs follow the registry's slug_pattern, which Spring's ui-builder.limits.slug-pattern
  // mirrors, so changing the rule there reaches every published route here too. A slug goes into
  // a request path, so without a rule nothing is sent, and a dot segment never is.
  #isSlug(slug) {
    const rule = own(own(this.registry, 'limits'), 'slug_pattern');
    if (typeof slug !== 'string' || typeof rule !== 'string' || !rule || slug === '.' || slug === '..') return false;
    return new RegExp(rule).test(slug);
  }

  /* ---- the four methods both stores have ---- */

  async list({ scope = 'mine', course } = {}) {
    const query = scope === 'class'
      ? `?scope=class${typeof course === 'string' && course ? `&course=${encodeURIComponent(course)}` : ''}`
      : '?scope=mine';
    const json = await this.#request('GET', `${API}/pages${query}`);
    if (!Array.isArray(json)) throw badResponse(200);
    return json.map(summaryOf).filter(Boolean);
  }

  async classPages({ course } = {}) {
    return this.list({ scope: 'class', course });
  }

  async create(page, { fields } = {}) {
    const json = await this.#request('POST', `${API}/pages`, { body: { ...this.#fields(page, fields), spec: page } });
    const detail = this.#detail(json);
    return { ref: detail.meta.ref, ...detail };
  }

  async open(ref) {
    if (isObject(ref) && ref.kind === 'local') return super.open(ref);
    const detail = this.#detail(await this.#request('GET', this.#pagePath(ref)));
    return { page: detail.page, base: detail.base, meta: detail.meta };
  }

  // newRevision: the save that resolves a conflict (Keep mine). Spring then keeps it as a revision
  // of its own instead of updating the newest one in place, so the copy it replaces stays there.
  async save(ref, page, { base, fields, newRevision = false } = {}) {
    if (isObject(ref) && ref.kind === 'local') return super.save(ref, page, { base, fields });
    const body = { version: base === undefined ? null : base, spec: page, ...this.#fields(page, fields) };
    if (newRevision === true) body.newRevision = true;
    return this.#detail(await this.#request('PUT', this.#pagePath(ref), { body, context: { ref, base } }));
  }

  async remove(ref) {
    if (isObject(ref) && ref.kind === 'local') return super.remove(ref);
    await this.#request('DELETE', this.#pagePath(ref));
    return undefined;
  }

  /* ---- Spring only ---- */

  // The signed-in person, or null when nobody is (401, 403 or 404 from /api/person/get).
  async whoami() {
    let json;
    try {
      json = await this.#request('GET', '/api/person/get');
    } catch (error) {
      if (error && [401, 403, 404].includes(error.status)) return null;
      throw error;
    }
    const personId = idOf(own(json, 'id'));
    if (personId === null) return null;
    const roles = (Array.isArray(json.roles) ? json.roles : [])
      .map((role) => (typeof role === 'string' ? role : str(own(role, 'name'))))
      .filter((role) => typeof role === 'string');
    const isTeacher = roles.some((role) => TEACHER_ROLES.has(role));
    this.#teacher = isTeacher;
    return { personId, name: str(json.name) || '', roles, isTeacher };
  }

  async publish(ref, { base, slug } = {}) {
    const body = { version: base === undefined ? null : base };
    if (typeof slug === 'string' && slug) body.slug = slug;
    return this.#detail(await this.#request('POST', this.#pagePath(ref, '/publish'), { body, context: { ref, base } }));
  }

  async unpublish(ref) {
    return this.#detail(await this.#request('POST', this.#pagePath(ref, '/unpublish')));
  }

  // A teacher's PUBLIC approves one published copy: publishedVersion is the one they looked at.
  // Spring answers 409 published_changed when a newer publish has replaced it since.
  async setVisibility(ref, { visibility, until, publishedVersion } = {}) {
    const body = { visibility };
    if (until !== undefined && until !== null) body.until = until;
    if (Number.isSafeInteger(publishedVersion)) body.publishedVersion = publishedVersion;
    return this.#detail(await this.#request('POST', this.#pagePath(ref, '/visibility'), { body }));
  }

  async bulkPublic({ course, until } = {}) {
    const body = { course };
    if (until !== undefined && until !== null) body.until = until;
    const json = await this.#request('POST', `${API}/pages/visibility/bulk`, { body });
    const updated = int(own(json, 'updated'));
    if (updated === null) throw badResponse(200);
    return { updated };
  }

  async revisions(ref) {
    const json = await this.#request('GET', this.#pagePath(ref, '/revisions'));
    if (!Array.isArray(json)) throw badResponse(200);
    return json.filter(isObject).map((row) => ({
      revisionId: idOf(row.revisionId), pageVersion: int(row.pageVersion), kind: str(row.kind) || 'SAVE',
      savedByName: str(row.savedByName), savedAt: int(row.savedAt),
    })).filter((row) => row.revisionId !== null);
  }

  async revision(ref, revisionId) {
    const id = idOf(revisionId);
    if (id === null) throw new NotFoundError({ status: 0 });
    const json = await this.#request('GET', this.#pagePath(ref, `/revisions/${id}`));
    if (!isObject(json) || !isObject(json.spec)) throw badResponse(200);
    return {
      revisionId: id, pageVersion: int(json.pageVersion), kind: str(json.kind) || 'SAVE', savedByName: str(json.savedByName),
      savedAt: int(json.savedAt), spec: json.spec, page: json.spec,
    };
  }

  async restore(ref, revisionId, { base } = {}) {
    const id = idOf(revisionId);
    if (id === null) throw new NotFoundError({ status: 0 });
    const body = { version: base === undefined ? null : base };
    return this.#detail(await this.#request('POST', this.#pagePath(ref, `/revisions/${id}/restore`), { body, context: { ref, base } }));
  }

  async lease(ref) {
    return this.#leaseView(await this.#request('POST', this.#pagePath(ref, '/lease')));
  }

  async takeLease(ref) {
    return this.#leaseView(await this.#request('POST', this.#pagePath(ref, '/lease/take')));
  }

  // keepalive: true for pagehide, so the request is still sent while the page goes away.
  async releaseLease(ref, { keepalive = false } = {}) {
    await this.#request('DELETE', this.#pagePath(ref, '/lease'), { keepalive: keepalive === true });
  }

  #leaseView(json) {
    const lease = leaseOf(json);
    if (!lease || lease.expiresAt === null) throw badResponse(200);
    return lease;
  }

  async refreshEditors(ref) {
    return this.#detail(await this.#request('POST', this.#pagePath(ref, '/editors/refresh')));
  }

  async slugAvailable(slug) {
    const json = await this.#request('GET', `${API}/slug-available?slug=${encodeURIComponent(String(slug ?? ''))}`);
    if (!isObject(json)) throw badResponse(200);
    const out = { slug: str(json.slug) || '', available: bool(json.available) };
    if (str(json.reason)) out.reason = json.reason;
    return out;
  }

  // PublishedView (§9.5): the copy this viewer may see. Malformed slugs are never sent.
  async published(slug) {
    if (!this.#isSlug(slug)) throw new NotFoundError({ status: 0 });
    const json = await this.#request('GET', `${API}/published/${encodeURIComponent(slug)}`);
    if (!isObject(json) || !isObject(json.spec)) throw badResponse(200);
    const groups = {};
    for (const [id, group] of Object.entries(isObject(json.groups) ? json.groups : {})) {
      if (/^[1-9]\d{0,15}$/.test(id) && isObject(group) && typeof group.name === 'string') groups[id] = { name: group.name, viewerIsMember: bool(group.viewerIsMember) };
    }
    const madeBy = isObject(json.madeBy) ? json.madeBy : {};
    const viewer = isObject(json.viewer) ? json.viewer : {};
    return {
      slug: str(json.slug) || slug, title: str(json.title) || '', description: str(json.description) || '',
      byline: str(json.byline) || '', course: str(json.course) || '', image: str(json.image) || '',
      publishedAt: int(json.publishedAt), publishedVersion: int(json.publishedVersion),
      visibility: str(json.visibility) || 'SIGNED_IN', spec: json.spec, canEdit: bool(json.canEdit),
      pageId: idOf(json.pageId), madeBy: { owner: str(madeBy.owner), group: str(madeBy.group) }, groups,
      viewer: { signedIn: bool(viewer.signedIn), name: str(viewer.name) },
    };
  }

  async gallery({ course } = {}) {
    const query = typeof course === 'string' && course ? `?course=${encodeURIComponent(course)}` : '';
    const json = await this.#request('GET', `${API}/published${query}`);
    if (!Array.isArray(json)) throw badResponse(200);
    return json.filter((item) => isObject(item) && this.#isSlug(item.slug)).map((item) => ({
      slug: item.slug, title: str(item.title) || '', description: str(item.description) || '', byline: str(item.byline) || '',
      course: str(item.course) || '', image: str(item.image) || '', publishedAt: int(item.publishedAt),
      visibility: str(item.visibility) || 'SIGNED_IN',
    }));
  }

  async myGroups() {
    const json = await this.#request('GET', `${API}/my-groups`);
    if (!Array.isArray(json)) throw badResponse(200);
    return json.filter(isObject).map((group) => ({ id: idOf(group.id), name: str(group.name) }))
      .filter((group) => group.id !== null && group.name);
  }

  async messageOwner(slug) {
    if (!this.#isSlug(slug)) throw new NotFoundError({ status: 0 });
    const json = await this.#request('POST', `${API}/published/${encodeURIComponent(slug)}/message-owner`);
    const conversationId = idOf(own(json, 'conversationId'));
    if (conversationId === null) throw badResponse(200);
    return { conversationId };
  }

  // The names in a published members block's group: names only, nothing else is passed on.
  async members(slug, blockId) {
    if (!this.#isSlug(slug) || typeof blockId !== 'string' || !BLOCK_ID.test(blockId)) {
      throw new NotFoundError({ status: 0 });
    }
    const json = await this.#request('GET', `${API}/published/${encodeURIComponent(slug)}/members/${blockId}`);
    if (!Array.isArray(json)) throw badResponse(200);
    return json.filter((item) => isObject(item) && typeof item.name === 'string' && item.name.trim()).map((item) => ({ name: item.name }));
  }
}
