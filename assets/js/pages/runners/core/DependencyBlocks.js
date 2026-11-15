const LANGUAGES = new Set(['java', 'javascript', 'python', 'pseudocode', 'html', 'css', 'scss']);
const TAG = /^@(provides|dependency|end)\s+([A-Za-z][A-Za-z0-9_.-]*)(?:\s+([a-z]+))?$/;

function fail(message) {
  throw new Error(`Dependency tags: ${message}`);
}

function commentTags(source) {
  const lines = source.match(/[^\n]*\n|[^\n]+$/g) || [];
  const tags = [];
  let offset = 0;
  for (let index = 0; index < lines.length; index++) {
    const start = offset;
    let text = lines[index].trim();
    offset += lines[index].length;
    const blockEnd = text.startsWith('/*') ? '*/' : text.startsWith('<!--') ? '-->' : null;
    if (blockEnd) {
      while (!text.includes(blockEnd) && index + 1 < lines.length) {
        text += `\n${lines[++index].trim()}`;
        offset += lines[index].length;
      }
      if (!text.includes(blockEnd)) {
        if (/@(?:provides|dependency|end)\b/.test(text)) fail('unclosed annotation comment.');
        continue;
      }
      // A declaration must occupy a comment, not share a line with executable source.
      if (!text.endsWith(blockEnd)) continue;
      text = text.replace(/^(?:\/\*\*?|<!--)/, '').slice(0, -blockEnd.length);
    } else if (/^(?:#|\/\/)/.test(text)) {
      text = text.replace(/^(?:#|\/\/)\s*/, '');
    } else {
      continue;
    }
    const declarations = text.split('\n').map((line) => line.replace(/^\s*\*?\s*/, '').trim())
      .filter((line) => /^@(provides|dependency|end)\b/.test(line));
    if (declarations.length > 1) fail('put each annotation in its own header.');
    if (!declarations.length) continue;
    const match = declarations[0].match(TAG);
    if (!match) fail(`invalid annotation "${declarations[0]}".`);
    const [, kind, name, language] = match;
    if (language && (kind === 'end' || !LANGUAGES.has(language))) fail(`invalid language for ${name}.`);
    tags.push({ kind, name, language, start, end: offset });
  }
  return tags;
}

/** Named regions have explicit boundaries so extraction needs no language-specific parser. */
export function parseDependencyBlocks(source, language) {
  const blocks = [];
  const names = new Set();
  let active = null;
  for (const tag of commentTags(source)) {
    if (tag.kind === 'end') {
      if (!active || active.name !== tag.name) fail(`unmatched @end ${tag.name}.`);
      blocks.push({ ...active, bodyEnd: tag.start });
      active = null;
    } else {
      if (active) fail(`nested region ${tag.name} inside ${active.name}.`);
      if (names.has(tag.name)) fail(`duplicate region ${tag.name}.`);
      names.add(tag.name);
      active = { kind: tag.kind, name: tag.name, language: tag.language || language, bodyStart: tag.end };
    }
  }
  if (active) fail(`missing @end ${active.name}.`);
  return blocks;
}

/** Resolve every requested region before modifying anything (Update all is atomic). */
export function updateDependencies(source, language, providers, names) {
  const dependencies = parseDependencyBlocks(source, language).filter((block) => block.kind === 'dependency');
  const available = providers.flatMap((provider) =>
    parseDependencyBlocks(provider.source, provider.language)
      .filter((block) => block.kind === 'provides')
      .map((block) => ({ ...block, source: provider.source, id: provider.id })));
  const replacements = names.map((name) => {
    const destination = dependencies.find((block) => block.name === name);
    if (!destination) throw new Error(`${name}: no dependency region in this runner.`);
    const matches = available.filter((block) => block.name === name);
    if (!matches.length) throw new Error(`${name}: no saved provider. Save its source runner first.`);
    if (matches.length > 1) throw new Error(`${name}: multiple providers; give each reusable block a unique name.`);
    const origin = matches[0];
    if (origin.language !== destination.language) {
      throw new Error(`${name}: cannot transfer ${origin.language} code into ${destination.language}.`);
    }
    return {
      name, start: destination.bodyStart, end: destination.bodyEnd,
      body: origin.source.slice(origin.bodyStart, origin.bodyEnd),
      previous: source.slice(destination.bodyStart, destination.bodyEnd),
      provider: origin.id,
    };
  });
  let code = source;
  for (const replacement of [...replacements].sort((a, b) => b.start - a.start)) {
    code = code.slice(0, replacement.start) + replacement.body + code.slice(replacement.end);
  }
  return { code, replacements };
}
