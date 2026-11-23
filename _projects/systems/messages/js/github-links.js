// GitHub links: reading one (for a card), finding them in a message, and building one from
// what follows a slash command ("owner/repo#12"). Pure: no DOM, no fetch.

const NAME = '[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})';
const REPO = '[A-Za-z0-9._-]{1,100}';
const PATTERNS = [
  { kind: 'issue', pattern: new RegExp(`^https://github\\.com/(${NAME})/(${REPO})/issues/(\\d+)(?:[/?#].*)?$`) },
  { kind: 'pull', pattern: new RegExp(`^https://github\\.com/(${NAME})/(${REPO})/pull/(\\d+)(?:[/?#].*)?$`) },
  { kind: 'commit', pattern: new RegExp(`^https://github\\.com/(${NAME})/(${REPO})/commit/([0-9a-f]{7,40})(?:[/?#].*)?$`) },
  { kind: 'repo', pattern: new RegExp(`^https://github\\.com/(${NAME})/(${REPO})/?$`) },
];
const GIST = /^https:\/\/gist\.github\.com\/(?:([A-Za-z0-9-]{1,39})\/)?([0-9a-f]{6,64})(?:[/?#].*)?$/;
// Account pages that look like owner/repo but aren't repositories.
const NOT_OWNERS = new Set(['orgs', 'settings', 'marketplace', 'features', 'topics', 'collections', 'sponsors', 'notifications', 'explore', 'login']);
// A link ends at whitespace, a tag, a quote or a closing bracket, and at "&": in a message's
// HTML a space typed after a link is "&nbsp;", and what follows the item (a query) isn't needed.
const URL_PATTERN = /https:\/\/(?:gist\.)?github\.com\/[^\s<>"')\]&]+/g;
const trimUrl = url => url.replace(/[.,;:!?]+$/, '');
const OWNER_REPO = new RegExp(`^(${NAME})/(${REPO})$`);

/**
 * GitHub issues, pull requests, commits, repositories and gists, as links.
 */
export class GitHubLinks {
  /**
   * Reads a GitHub URL. `url` in the result is the link without the parts after the item.
   * @param {string} raw
   * @returns {object|null} { kind, owner, repo, number | sha, url }, or { kind: 'gist',
   *   owner, gistId, url }, or null for anything else
   */
  static parse(raw) {
    const url = String(raw ?? '').trim();
    const gist = url.match(GIST);
    if (gist) return { kind: 'gist', owner: gist[1] || null, gistId: gist[2], url: `https://gist.github.com/${gist[1] ? `${gist[1]}/` : ''}${gist[2]}` };
    for (const { kind, pattern } of PATTERNS) {
      const match = url.match(pattern);
      if (!match || NOT_OWNERS.has(match[1].toLowerCase()) || match[2].endsWith('.git')) continue;
      const [, owner, repo, id] = match;
      const base = `https://github.com/${owner}/${repo}`;
      if (kind === 'repo') return { kind, owner, repo, url: base };
      if (kind === 'commit') return { kind, owner, repo, sha: id, url: `${base}/commit/${id}` };
      return { kind, owner, repo, number: Number(id), url: `${base}/${kind === 'pull' ? 'pull' : 'issues'}/${id}` };
    }
    return null;
  }

  /**
   * The first `max` different GitHub items linked in a body.
   * @param {string} body HTML or text
   * @param {number} max
   * @returns {Array} parse results
   */
  static find(body, max = 3) {
    const found = [];
    const seen = new Set();
    for (const raw of String(body ?? '').match(URL_PATTERN) || []) {
      const link = GitHubLinks.parse(trimUrl(raw));
      if (!link || seen.has(link.url)) continue;
      seen.add(link.url);
      found.push(link);
      if (found.length === max) break;
    }
    return found;
  }

  /**
   * The link for what follows /issue, /pr, /commit or /repo: "owner/repo#12", "#12" or
   * "12" with a repository already known, "owner/repo@sha", "owner/repo", or a full link.
   * @param {string} command 'issue', 'pr', 'commit' or 'repo'
   * @param {string} args what was typed after it
   * @param {string|null} knownRepo the conversation's last "owner/repo"
   * @returns {string|null}
   */
  static urlFor(command, args, knownRepo = null) {
    const text = String(args ?? '').trim();
    if (/^https:\/\/github\.com\//.test(text)) return GitHubLinks.parse(text)?.url ?? null;
    if (command === 'repo') return OWNER_REPO.test(text) ? `https://github.com/${text}` : null;
    if (command === 'commit') {
      const match = text.match(new RegExp(`^(?:(${NAME}/${REPO})@)?([0-9a-f]{7,40})$`));
      const repo = match?.[1] || knownRepo;
      return match && repo ? `https://github.com/${repo}/commit/${match[2]}` : null;
    }
    const match = text.match(new RegExp(`^(?:(${NAME}/${REPO}))?#?(\\d+)$`));
    const repo = match?.[1] || knownRepo;
    if (!match || !repo || !OWNER_REPO.test(repo)) return null;
    return `https://github.com/${repo}/${command === 'pr' ? 'pull' : 'issues'}/${match[2]}`;
  }

  /**
   * GitHub's own new-issue form with a title and body filled in: the student reviews and
   * submits it on GitHub as themselves, so no token is needed.
   * @param {string} repo "owner/repo"
   * @param {{title?: string, body?: string}} fields
   * @returns {string|null}
   */
  static newIssueUrl(repo, { title = '', body = '' } = {}) {
    if (!OWNER_REPO.test(String(repo ?? ''))) return null;
    const url = new URL(`https://github.com/${repo}/issues/new`);
    if (title) url.searchParams.set('title', title.slice(0, 250));
    if (body) url.searchParams.set('body', body.slice(0, 4000));
    return url.toString();
  }

  /**
   * @param {object|null} link a parse result
   * @returns {string|null} its "owner/repo"
   */
  static repoOf(link) {
    return link?.owner && link?.repo ? `${link.owner}/${link.repo}` : null;
  }
}
