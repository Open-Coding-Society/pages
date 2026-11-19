// What the slash commands and a message's More menu do in an open conversation. thread.js
// makes one ChatCommands per pane and hands it the pieces it works with; the commands
// themselves are listed in slash-commands.js.
//
// It also remembers, in this browser only, the repository each conversation last named, so
// "/pr 12" works after "/pr owner/repo#11", and keeps the message a "New GitHub issue" was
// started from until that /newissue runs.
import { MAX_CODE_LENGTH } from './code-model.js';
import { plainText } from './conversation-model.js';
import { findGitHubLinks, githubUrlFor, newIssueUrl, parseGitHubUrl, repoOf } from './github-links.js';

// A direct message holds at most this much (Spring's DirectMessage body column).
export const DM_MAX_LENGTH = 2000;

export const escapeHtml = value => String(value).replace(/[&<>"']/g, character => `&#${character.charCodeAt(0)};`);

const GIST_URL = /^https:\/\/gist\.github\.com\/[\w-]+\/[0-9a-f]+$/;
const OWNER_REPO = /^[\w.-]+\/[\w.-]+$/;

export class ChatCommands {
  // elements: title, formStatus, imageInput, filesInput, folderInput. composer: the rich
  // composer. codeBox: code-composer.js. conversation(): the open { kind, id }. send(html)
  // sends a message as if typed; say(text) shows a status line. onCommand(name, args) runs
  // what the page owns (panels, members, search, help). text: the pane's wording.
  constructor({
    elements, composer, codeBox, api, me, text, conversation, send, say, onCommand = () => {}, profileUrl = '/profile',
  }) {
    Object.assign(this, { elements, composer, codeBox, api, me, text, conversation, send, say, onCommand, profileUrl });
    this.issueQuote = null;
  }

  // ── The repository a conversation last named ─────────────────────────────────────
  repoKey() {
    const { kind, id } = this.conversation() || {};
    return `ocs-messages-repo:${kind}:${id}`;
  }

  knownRepo() {
    try {
      return localStorage.getItem(this.repoKey());
    } catch {
      return null;
    }
  }

  rememberRepo(url) {
    const repo = repoOf(parseGitHubUrl(url));
    if (!repo) return;
    try {
      localStorage.setItem(this.repoKey(), repo);
    } catch {
      // Without storage, the next command just needs the repository again.
    }
  }

  // A /newissue drafted from a message and then not run doesn't quote it later.
  clearQuote() {
    this.issueQuote = null;
  }

  // ── Slash commands ──────────────────────────────────────────────────────────────
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
          maxLength: kind === 'dm' ? DM_MAX_LENGTH - 200 : MAX_CODE_LENGTH,
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
        if (args) this.send(`<i>${escapeHtml(args)}</i>`);
        break;
      case 'shrug':
        this.send(`${escapeHtml(args)} ¯\\_(ツ)_/¯`.trim());
        break;
      default:
        this.onCommand(command.name, args);
    }
  }

  // /issue, /pr, /commit, /repo: the GitHub link, as a message.
  postLink(name, args) {
    const url = githubUrlFor(name, args, this.knownRepo());
    if (!url) {
      this.say(this.text.badGitHubRef);
      this.composer.setHTML(`/${name}&nbsp;${escapeHtml(args)}`);
      return;
    }
    this.rememberRepo(url);
    this.send(url);
  }

  // /newissue [owner/repo] title: GitHub's own new-issue form, filled in, in a new tab. The
  // student checks it and submits it on GitHub as themselves.
  newIssue(args) {
    const { text } = this;
    const [first = '', ...rest] = args.split(/\s+/);
    const named = OWNER_REPO.test(first);
    const repo = named ? first : this.knownRepo();
    const title = (named ? rest.join(' ') : args).trim();
    const link = window.location.href;
    const chat = this.elements.title.textContent;
    const quote = this.issueQuote;
    const body = quote
      ? text.issueQuote.replace('{text}', plainText(quote.body).replace(/\n/g, '\n> '))
        .replace('{sender}', quote.isSelf ? this.me.name : quote.senderName).replace('{chat}', chat).replace('{link}', link)
      : text.newIssueBody.replace('{chat}', chat).replace('{link}', link);
    const url = repo ? newIssueUrl(repo, { title, body }) : null;
    if (!url) {
      this.say(text.newIssueNeedsRepo);
      return;
    }
    this.issueQuote = null;
    this.rememberRepo(`https://github.com/${repo}`);
    window.open(url, '_blank', 'noopener');
  }

  // ── A message's More menu ───────────────────────────────────────────────────────
  // Copy its words, or start a GitHub issue from it: "/newissue owner/repo <its words>" goes
  // in the composer (the chat's last repository, or the one the message links to), and
  // Enter opens GitHub's form with the message quoted.
  async more(action, message) {
    if (!message) return;
    const { text } = this;
    if (action === 'copy') {
      try {
        await navigator.clipboard.writeText(plainText(message.body));
        this.say(text.copiedMessage);
      } catch {
        this.say(text.copyMessageFailed);
      }
      return;
    }
    if (action === 'issue') {
      this.issueQuote = message;
      const repo = this.knownRepo() || repoOf(findGitHubLinks(message.body)[0]);
      const title = plainText(message.body).slice(0, 120);
      this.composer.setHTML(`/newissue&nbsp;${repo ? `${escapeHtml(repo)}&nbsp;` : ''}${escapeHtml(title)}`);
      this.composer.focus();
      this.say(repo ? '' : text.issueNeedsRepo);
    }
  }

  // ── Gists ───────────────────────────────────────────────────────────────────────
  // Saves code as a secret gist with the student's own GitHub token (Spring keeps it, from
  // Profile's Gist card). Resolves the gist's URL, or null after saying why it couldn't.
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
