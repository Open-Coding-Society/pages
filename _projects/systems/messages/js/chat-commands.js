// What the slash commands do in an open conversation. thread.js makes one ChatCommands per
// pane and hands it the pieces it works with; the commands themselves are listed in
// slash-commands.js.
//
// It also remembers, in this browser only, the repository each conversation last named, so
// "/pr 12" works after "/pr owner/repo#11".
import { CodeBlocks } from './code-model.js';
import { GitHubLinks } from './github-links.js';

const GIST_URL = /^https:\/\/gist\.github\.com\/[\w-]+\/[0-9a-f]+$/;
const OWNER_REPO = /^[\w.-]+\/[\w.-]+$/;

/**
 * What the slash commands do in one pane.
 */
export class ChatCommands {
  /** The most a direct message holds (Spring's DirectMessage body column). */
  static DM_MAX_LENGTH = 2000;

  /**
   * @param {*} value
   * @returns {string} the value as text that HTML shows as it is
   */
  static escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => `&#${character.charCodeAt(0)};`);
  }

  /**
   * @param {object} options
   * @param {object} options.elements title, formStatus, imageInput, filesInput, folderInput
   * @param {object} options.composer the rich composer
   * @param {object|null} options.codeBox the pane's CodeComposer
   * @param {object} options.api the Messages API
   * @param {object} options.me the signed-in person
   * @param {object} options.text the pane's wording
   * @param {Function} options.conversation gives the open { kind, id }
   * @param {Function} options.send send(html) sends a message as if typed
   * @param {Function} options.say say(text) shows a status line
   * @param {Function} options.onCommand onCommand(name, args) runs what the page owns
   *   (panels, members, search, help)
   * @param {string} options.profileUrl where Profile's Gist card is
   */
  constructor({
    elements, composer, codeBox, api, me, text, conversation, send, say, onCommand = () => {}, profileUrl = '/profile',
  }) {
    Object.assign(this, { elements, composer, codeBox, api, me, text, conversation, send, say, onCommand, profileUrl });
  }

  // ── The repository a conversation last named ─────────────────────────────────────
  /** @returns {string} the localStorage key for the open conversation's repository */
  repoKey() {
    const { kind, id } = this.conversation() || {};
    return `ocs-messages-repo:${kind}:${id}`;
  }

  /** @returns {string|null} the "owner/repo" the open conversation last named */
  knownRepo() {
    try {
      return localStorage.getItem(this.repoKey());
    } catch {
      return null;
    }
  }

  /**
   * Remembers a link's repository for the open conversation.
   * @param {string} url a GitHub link
   */
  rememberRepo(url) {
    const repo = GitHubLinks.repoOf(GitHubLinks.parse(url));
    if (!repo) return;
    try {
      localStorage.setItem(this.repoKey(), repo);
    } catch {
      // Without storage, the next command just needs the repository again.
    }
  }

  // ── Slash commands ──────────────────────────────────────────────────────────────
  /**
   * Runs a slash command.
   * @param {object} command a SlashCommands.ALL entry
   * @param {string} args what was typed after its name
   */
  run(command, args) {
    const kind = this.conversation()?.kind;
    const { elements, text } = this;
    this.say('');
    switch (command.name) {
      case 'file':
        elements.filesInput?.click();
        break;
      case 'folder':
        elements.folderInput?.click();
        break;
      case 'image':
        elements.imageInput?.click();
        break;
      case 'code':
      case 'gist':
        this.codeBox?.open(command.name, {
          language: command.name === 'code' ? args : '',
          filename: command.name === 'gist' ? args : '',
          // A code block in a direct message has to fit the message; a gist sends only its link.
          maxLength: command.name === 'code' && kind === 'dm' ? ChatCommands.DM_MAX_LENGTH - 200 : CodeBlocks.MAX_LENGTH,
        });
        break;
      case 'issue':
      case 'pr':
      case 'commit':
      case 'repo':
        this.postLink(command.name, args);
        break;
      case 'newissue':
        this.newIssue(args);
        break;
      case 'me':
        if (args) this.send(`<i>${ChatCommands.escapeHtml(args)}</i>`);
        break;
      case 'shrug':
        this.send(`${ChatCommands.escapeHtml(args)} ¯\\_(ツ)_/¯`.trim());
        break;
      default:
        this.onCommand(command.name, args);
    }
  }

  /**
   * /issue, /pr, /commit, /repo: the GitHub link, as a message.
   * @param {string} name the command's name
   * @param {string} args
   */
  postLink(name, args) {
    const url = GitHubLinks.urlFor(name, args, this.knownRepo());
    if (!url) {
      this.say(this.text.badGitHubRef);
      this.composer.setHTML(`/${name}&nbsp;${ChatCommands.escapeHtml(args)}`);
      return;
    }
    this.rememberRepo(url);
    this.send(url);
  }

  /**
   * /newissue [owner/repo] title: GitHub's own new-issue form, filled in, in a new tab. The
   * student checks it and submits it on GitHub as themselves.
   * @param {string} args
   */
  newIssue(args) {
    const { text } = this;
    const [first = '', ...rest] = args.split(/\s+/);
    const named = OWNER_REPO.test(first);
    const repo = named ? first : this.knownRepo();
    const title = (named ? rest.join(' ') : args).trim();
    const body = text.newIssueBody.replace('{chat}', this.elements.title.textContent).replace('{link}', window.location.href);
    const url = repo ? GitHubLinks.newIssueUrl(repo, { title, body }) : null;
    if (!url) {
      this.say(text.newIssueNeedsRepo);
      return;
    }
    this.rememberRepo(`https://github.com/${repo}`);
    window.open(url, '_blank', 'noopener');
  }

  // ── Gists ───────────────────────────────────────────────────────────────────────
  /**
   * Saves code as a secret gist with the student's own GitHub token (Spring keeps it, from
   * Profile's Gist card).
   * @param {string} language
   * @param {string} code
   * @param {string} filename
   * @returns {Promise<string|null>} the gist's URL, or null after saying why it couldn't
   */
  async saveGist(language, code, filename) {
    const { text, elements } = this;
    try {
      const result = await this.api.createGist({ [filename]: { content: code } }, `Shared in OCS Messages: ${elements.title.textContent}`);
      // Spring checks this too; a link put in the chat should be a gist and nothing else.
      if (!GIST_URL.test(String(result?.url || ''))) throw new Error('Spring returned no gist URL');
      return result.url;
    } catch (error) {
      console.warn('Messages: could not save the gist', error);
      if (error?.status === 409) {
        const link = document.createElement('a');
        link.href = `${this.profileUrl}#gist-connection-heading`;
        link.textContent = text.gistConnectLink;
        elements.formStatus.replaceChildren(`${text.gistConnect} `, link);
        elements.formStatus.hidden = false;
      } else {
        this.say(text.gistFailed);
      }
      return null;
    }
  }
}
