// The composer's slash commands: a registry, and matching what was typed against it. No DOM.
// command-menu.js shows the menu; thread.js runs a command through the handlers the page gives
// it. A command is { name, group, icon, hint, args?, keywords?, scope? } where scope is
// 'group' or 'dm' for a command only one kind of conversation has (a group's files, a
// direct message's search). The course announcement chats have their own /event commands
// (Courses' calendar-command.js); these are /dm's.

export const COMMAND_GROUPS = Object.freeze([
  { id: 'share', label: 'Share' },
  { id: 'github', label: 'GitHub' },
  { id: 'chat', label: 'This chat' },
  { id: 'message', label: 'Message' },
]);

export const COMMANDS = Object.freeze([
  { name: 'file', group: 'share', icon: 'fa-file-arrow-up', hint: 'Attach files, up to 35 MB each', keywords: ['upload', 'attach'], scope: 'group' },
  { name: 'folder', group: 'share', icon: 'fa-folder-plus', hint: 'Share a whole folder', keywords: ['upload', 'directory'], scope: 'group' },
  { name: 'image', group: 'share', icon: 'fa-image', hint: 'Send an image or screenshot', keywords: ['photo', 'screenshot'] },
  { name: 'code', group: 'share', icon: 'fa-code', hint: 'Post code people can copy and run', args: '[language]', keywords: ['snippet', 'run'] },
  { name: 'gist', group: 'share', icon: 'fa-file-code', hint: 'Save code as a secret gist and post its link', args: '[file name]', keywords: ['github'] },
  { name: 'issue', group: 'github', icon: 'fa-circle-dot', hint: 'Show a GitHub issue', args: 'owner/repo#number' },
  { name: 'pr', group: 'github', icon: 'fa-code-pull-request', hint: 'Show a pull request with its checks', args: 'owner/repo#number', keywords: ['pull'] },
  { name: 'commit', group: 'github', icon: 'fa-code-commit', hint: 'Show a commit', args: 'owner/repo@sha' },
  { name: 'repo', group: 'github', icon: 'fa-book-bookmark', hint: 'Show a repository', args: 'owner/repo', keywords: ['repository'] },
  { name: 'newissue', group: 'github', icon: 'fa-square-plus', hint: 'Open GitHub’s new-issue form, filled in', args: 'owner/repo title', keywords: ['bug', 'report'] },
  { name: 'files', group: 'chat', icon: 'fa-folder-open', hint: 'This group’s shared files', scope: 'group' },
  { name: 'media', group: 'chat', icon: 'fa-photo-film', hint: 'Images and videos shared here', keywords: ['photos', 'images', 'videos', 'gallery'] },
  { name: 'links', group: 'chat', icon: 'fa-link', hint: 'Links shared here, GitHub first' },
  { name: 'pinned', group: 'chat', icon: 'fa-thumbtack', hint: 'Pinned messages', keywords: ['pins'] },
  { name: 'members', group: 'chat', icon: 'fa-users', hint: 'See or add members', scope: 'group', keywords: ['people'] },
  { name: 'search', group: 'chat', icon: 'fa-magnifying-glass', hint: 'Search this chat', scope: 'dm', keywords: ['find'] },
  { name: 'help', group: 'chat', icon: 'fa-circle-question', hint: 'Every command and keyboard shortcut', keywords: ['keys', 'shortcuts'] },
  { name: 'me', group: 'message', icon: 'fa-person-walking', hint: 'Say what you’re doing, in italics', args: 'text' },
  { name: 'shrug', group: 'message', icon: 'fa-face-meh', hint: 'Add ¯\\_(ツ)_/¯ to your message', args: '[text]' },
]);

const fits = (command, kind) => !command.scope || command.scope === kind;

// The menu for what's typed, or null when it isn't a command in progress: "/" and letters,
// with no space yet. Returns [{ id, label, commands }] in the groups' order, with name
// matches before keyword matches inside each group, and groups with no match left out.
export function matchCommands(text, { kind }) {
  const typed = String(text ?? '').match(/^\/([a-z]*)$/i);
  if (!typed) return null;
  const query = typed[1].toLowerCase();
  const byName = COMMANDS.filter(command => fits(command, kind) && command.name.startsWith(query));
  const byKeyword = COMMANDS.filter(command => fits(command, kind) && !byName.includes(command)
    && (command.keywords || []).some(word => word.startsWith(query)));
  const ordered = [...byName, ...byKeyword];
  return COMMAND_GROUPS
    .map(group => ({ ...group, commands: ordered.filter(command => command.group === group.id) }))
    .filter(group => group.commands.length);
}

// "/issue owner/repo#12" → { command, args: 'owner/repo#12' }, or null when the text isn't a
// command this conversation has.
export function parseCommand(text, { kind }) {
  const typed = String(text ?? '').match(/^\/([a-z]+)(?:\s+([\s\S]*))?$/i);
  if (!typed) return null;
  const command = COMMANDS.find(entry => entry.name === typed[1].toLowerCase());
  return command && fits(command, kind) ? { command, args: (typed[2] || '').trim() } : null;
}
