// Exports a page as JSON (the editor's Export JSON) and as an ordinary Jekyll page file (front
// matter + the page's ocs__ markup) that a student adds through the normal fork-and-PR flow, the
// inspectable artifact like GameBuilder's code. Everything author-typed is escaped: Jekyll runs
// Liquid over the whole file, so the only Liquid in it is include tags built from validated values.
//
// ctx: the render context (registry, baseurl, pageOrigin, renderers) plus sanitizeRich (from
// rich-content.js), validators.kanbanCanonicalUrl (the editor passes kanban-board.js
// parseBoardUrl(url)?.url), slug (the published slug, if any) and strict (tests).
import { defOf, liveTypes, textOf } from './registry.js';
import { renderBlock, renderPage, renderSection } from './render.js';
import { contentRenderers, lineOf, ownValue } from './blocks-content.js';
import { slugIssue, suggestSlug } from './url-rules.js';
import { comment, h, liquid, toHTML } from './vnode.js';

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

/* ---------- JSON ---------- */

// Structural keys first, in reading order; everything else alphabetically. Same page, same file.
const KEY_ORDER = ['schemaVersion', 'kind', 'id', 'type', 'title', 'description', 'byline', 'course', 'width', 'image', 'page', 'settings', 'hidden', 'cells', 'blocks', 'sections'];
const rankOf = (key) => {
  const rank = KEY_ORDER.indexOf(key);
  return rank === -1 ? KEY_ORDER.length : rank;
};

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (!isObject(value)) return value;
  const keys = Object.keys(value).sort((a, b) => rankOf(a) - rankOf(b) || (a < b ? -1 : a > b ? 1 : 0));
  // A null-prototype copy keeps a "__proto__" key as plain data.
  const out = Object.create(null);
  for (const key of keys) out[key] = canonical(value[key]);
  return out;
}

export function pageToJSON(page) {
  return `${JSON.stringify(canonical(page), null, 2)}\n`;
}

/* ---------- front matter ---------- */

const char = (code) => String.fromCharCode(code);
// Controls (C0 with tab and newline, DEL, C1 with NEL), the line and paragraph separators, BOM and
// the two noncharacters: YAML ends a line at some of them and libyaml refuses the others, so one
// stray character could otherwise start a new front matter key or break the build.
const NOT_FOR_YAML = new RegExp(`[${char(0)}-${char(0x1f)}${char(0x7f)}-${char(0x9f)}${char(0x2028)}${char(0x2029)}${char(0xfeff)}${char(0xfffe)}${char(0xffff)}]`, 'g');

// Lone surrogates can't be written as UTF-8, so they are dropped too.
function wellFormed(text) {
  let out = '';
  for (let index = 0; index < text.length; index += 1) {
    const code = text.charCodeAt(index);
    if (code >= 0xd800 && code <= 0xdbff) {
      const next = text.charCodeAt(index + 1);
      if (next >= 0xdc00 && next <= 0xdfff) {
        out += text.slice(index, index + 2);
        index += 1;
      }
    } else if (code < 0xdc00 || code > 0xdfff) {
      out += text[index];
    }
  }
  return out;
}

export function frontMatterText(value) {
  return wellFormed(typeof value === 'string' ? value : '').replace(NOT_FOR_YAML, ' ').replace(/ {2,}/g, ' ').trim();
}

// A JSON string is a valid YAML double-quoted scalar: ": # [ {" stay inside the quotes.
function yamlValue(value) {
  return JSON.stringify(frontMatterText(value));
}

/* ---------- live blocks in a page file ---------- */

// Canonical board addresses only: https://github.com/orgs/<org>/projects/<n> or <owner>/<repo>/issues.
const KANBAN_URL = /^https:\/\/github\.com\/[A-Za-z0-9][A-Za-z0-9._/-]{0,200}$/;
const KANBAN_FILTER = /^[A-Za-z0-9 _-]{0,40}$/;
const COURSE_CODE = /^[a-z0-9_-]{1,16}$/;

function liveNote(type, ctx) {
  const def = defOf(ctx.registry, 'block', type);
  return comment(textOf(ctx.registry, 'blocks.needs_live_viewer', { label: (def && def.label) || type }));
}

// Titles go next to the include as escaped text, never into its parameters.
function titleHeading(settings) {
  const title = lineOf(settings, 'title');
  return title ? h('h3', { class: 'ocs__section-title' }, title) : null;
}

function kanbanInclude(settings, ctx) {
  const canonicalUrl = ctx.validators && ctx.validators.kanbanCanonicalUrl;
  const url = typeof canonicalUrl === 'function' ? canonicalUrl(lineOf(settings, 'url')) : null;
  if (typeof url !== 'string' || !KANBAN_URL.test(url)) return liveNote('kanban', ctx);
  const params = [`url="${url}"`];
  const filter = lineOf(settings, 'filter');
  if (filter && KANBAN_FILTER.test(filter)) params.push(`filter="${filter}"`);
  return [titleHeading(settings), liquid(`{% include ocs_kanban_board.html ${params.join(' ')} %}`)];
}

function courseCodeOf(ctx, value) {
  const code = typeof value === 'string' ? value.trim() : '';
  const known = (ctx.registry.courses || []).some((course) => course && course.value === code);
  return known && COURSE_CODE.test(code) ? code : '';
}

// The block's course, else the page's, else every course ("all"), like the include's own default.
function calendarInclude(settings, ctx) {
  const course = courseCodeOf(ctx, ownValue(settings, 'course')) || courseCodeOf(ctx, ownValue(ctx.pageSettings, 'course')) || 'all';
  return [titleHeading(settings), liquid(`{% include ocs_calendar_card.html course="${course}" %}`)];
}

function exportRenderer(type) {
  if (type === 'kanban') return kanbanInclude;
  if (type === 'calendar') return calendarInclude;
  return (settings, ctx) => liveNote(type, ctx);
}

function exportContext(ctx) {
  if (!isObject(ctx) || !isObject(ctx.registry)) throw new Error('UI Builder export: ctx.registry is required');
  const renderers = { ...(isObject(ctx.renderers) ? ctx.renderers : contentRenderers) };
  for (const type of liveTypes(ctx.registry)) renderers[type] = exportRenderer(type);
  return { ...ctx, mode: 'export', renderers };
}

function serialize(vnode, ctx) {
  return toHTML(vnode, { sanitizeRich: ctx.sanitizeRich, strict: ctx.strict === true });
}

/* ---------- page file ---------- */

// The page file: layout, title, description and a /student-pages/ permalink (the published slug,
// else one made from the title), then the page's markup. Hidden sections and blocks are left out.
export function pageToMarkdown(page, ctx) {
  const c = exportContext(ctx);
  const settings = isObject(ownValue(page, 'page')) ? page.page : {};
  const title = frontMatterText(lineOf(settings, 'title')) || textOf(c.registry, 'blocks.untitled');
  const slug = typeof c.slug === 'string' && slugIssue(c.slug, c.registry) === null ? c.slug : suggestSlug(title);
  const note = frontMatterText(textOf(c.registry, 'editor.export_permalink_note'));
  const frontMatter = [
    '---',
    'layout: opencs',
    `title: ${yamlValue(title)}`,
    `description: ${yamlValue(lineOf(settings, 'description'))}`,
    `permalink: ${yamlValue(`/student-pages/${slug}/`)}${note ? ` # ${note}` : ''}`,
    '---',
  ];
  return `${frontMatter.join('\n')}\n${serialize(renderPage(page, c), c)}\n`;
}

// One block's page-file markup, for the code view (shown even while the block is hidden).
export function blockHTML(block, ctx) {
  const c = exportContext(ctx);
  return serialize(renderBlock(isObject(block) ? { ...block, hidden: false } : block, c), c);
}

// A section's page-file markup with its blocks left out, for the code view: the section's own tag
// and, for columns, one div per column.
export function sectionHTML(section, ctx) {
  if (!isObject(section)) return '';
  const c = exportContext(ctx);
  const cells = (Array.isArray(section.cells) ? section.cells : []).map((cell) => ({ ...(isObject(cell) ? cell : {}), blocks: [] }));
  return serialize(renderSection({ ...section, hidden: false, cells }, c), c);
}
