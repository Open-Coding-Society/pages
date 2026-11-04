// Rich text as browsers and Spring's jsoup read it, for page-rules.js: unsafeRichText, the rich-text
// rule Spring applies too, and linksToComputer, an href or src on the student's own computer, which
// Spring refuses on publish. There is no DOM here, so tags are read the way the HTML tokenizer and
// jsoup's tree building read them. Pure and DOM-free (DESIGN §5, §6).
import { isLoopbackAddress } from './url-rules.js';

const own = (table, key) => (Object.prototype.hasOwnProperty.call(table, key) ? table[key] : undefined);
// The rich text rule Spring applies too (UiBuilderSpecRules), so the editor and Spring agree: in
// each tag, after decoding character references, no script/iframe/object/embed tag or javascript:
// once invisible characters are removed, and no on...= handler once they are spaces. Browsers
// ignore those characters in "java&#9;script:". Tags are read as the browser's HTML tokenizer
// reads them (tagsOf: a ">" inside title=">" doesn't end one), and again as every "<" up to the
// next ">", which is stricter ("< script"). Text outside tags is only text.
const char = (code) => String.fromCharCode(code);
const NOT_PRINTED = new RegExp(`[\\s${char(0)}-${char(0x1f)}${char(0x7f)}-${char(0x9f)}${char(0xa0)}${char(0xad)}`
  + `${char(0x200b)}-${char(0x200f)}${char(0x2028)}-${char(0x202f)}${char(0x2060)}-${char(0x2064)}${char(0xfeff)}]+`, 'g');
const TAG = /<[^>]*>?/g;
const TAG_SPACE = /[\t\n\f\r ]/;
const TAG_SPACE_OR_END = /[\t\n\f\r />]/;
const LETTER = /[A-Za-z]/;
const TAG_NAME = /[^\t\n\f\r />]*/y;
// Spring parses the body with jsoup and refuses these too (UiBuilderSpecRules.unsafeElements):
// elements that run code or whose content a browser reads differently, attributes named on…,
// javascript:/vbscript: in any value, and address attributes whose scheme isn't http, https or
// mailto. There is no DOM here, so the same checks run on each tag the tokenizer finds, which only
// makes the client stricter on malformed markup, never on the rich-text composer's own output.
// On publish Spring also refuses an href or src on the student's own computer (loopback_url).
const CODE_ELEMENTS = new Set(['script', 'iframe', 'object', 'embed', 'noscript', 'template', 'svg', 'math']);
const URL_ATTRIBUTES = new Set(['href', 'src', 'srcset', 'action', 'formaction', 'xlink:href', 'data', 'poster', 'background', 'cite', 'codebase']);
const RICH_ADDRESS_ATTRIBUTES = new Set(['href', 'src']);
const RICH_LINK_SCHEMES = new Set(['http', 'https', 'mailto']);
const ATTR_SCHEME = /^([a-z][a-z0-9+.-]*):/;
// Start tags jsoup never puts in a parsed body (a fragment has no html, head or body of its own,
// and frames belong only in a frameset), the parts of a table, which it keeps only inside a table,
// and how many attributes it reads in one tag.
const DROPPED_TAGS = new Set(['html', 'head', 'body', 'frame', 'frameset']);
const TABLE_PARTS = new Set(['caption', 'col', 'colgroup', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr']);
const MAX_ATTRIBUTES = 512;
// Inside a select jsoup keeps only these start tags; these close it first (another select is
// dropped), and inside a table so do the table's own tags.
const SELECT_KEEPS = new Set(['option', 'optgroup', 'script', 'template']);
const SELECT_CLOSERS = new Set(['select', 'input', 'keygen', 'textarea']);
// Elements whose content is text up to their own end tag. noscript isn't one here: rich-text.js
// reads bodies with DOMParser, which runs no scripts, so a noscript's content is markup there.
const RAW_TEXT = new Set(['script', 'style', 'xmp', 'iframe', 'noembed', 'noframes', 'textarea', 'title']);
// Every digit, as browsers and jsoup read a reference ("&#0000000115;" is "s"); Spring's tag-text
// pass uses the same pattern.
const CHAR_REFERENCE = /&#(?:[xX]([0-9a-fA-F]+)|([0-9]+));?/g;
const FORBIDDEN_IN_TAG = ['<script', '<iframe', '<object', '<embed', 'javascript:', 'vbscript:'];
const EVENT_HANDLER = /[\s/"'`]on\w+\s*=/i;

// Named references a browser (and Spring's jsoup) decode to the punctuation an address is spelled
// with. Matched without regard to case or a final ";": that reads a few non-references as
// references, which only makes unsafeTag stricter (decodeAttribute reads names exactly).
const NAMED_PUNCTUATION = {
  colon: ':', sol: '/', bsol: '\\', period: '.', commat: '@', percnt: '%', num: '#', quest: '?',
  lsqb: '[', lbrack: '[', rsqb: ']', rbrack: ']', amp: '&', tab: '\t', newline: '\n',
};
// Spring's tag-text pass decodes these three whatever follows them ("&Tabscript").
const SPRING_PUNCTUATION = /&(colon|tab|newline);?/gi;

// Text decoded loosely, as Spring's tag-text pass decodes a tag and more: numeric references (a
// code past U+10FFFF is dropped), then colon, tab and newline as Spring reads them, then the names.
function decodeReferences(text) {
  return text.replace(CHAR_REFERENCE, (match, hex, decimal) => {
    const code = hex ? parseInt(hex, 16) : Number(decimal);
    return code <= 0x10ffff ? String.fromCodePoint(code) : '';
  }).replace(SPRING_PUNCTUATION, (match, name) => NAMED_PUNCTUATION[name.toLowerCase()])
    .replace(/&([a-z]+);?/gi, (match, name) => NAMED_PUNCTUATION[name.toLowerCase()] ?? match);
}

// What numeric references from 128 to 159 stand for (windows-1252), as in browsers and jsoup; the
// five codes without a character there stay as they are.
const WINDOWS_1252 = [0x20ac, 0x81, 0x201a, 0x192, 0x201e, 0x2026, 0x2020, 0x2021, 0x2c6, 0x2030, 0x160, 0x2039, 0x152, 0x8d,
  0x17d, 0x8f, 0x90, 0x2018, 0x2019, 0x201c, 0x201d, 0x2022, 0x2013, 0x2014, 0x2dc, 0x2122, 0x161, 0x203a, 0x153, 0x9d, 0x17e, 0x178];
// The named references that can change how an address or a scheme reads: its punctuation, "+",
// "fj", and the spaces and invisible characters that make it no address. jsoup knows 2,125 names;
// every other one stands for a character that changes neither, so it is left as written.
const ADDRESS_REFERENCES = {
  colon: [0x3a], sol: [0x2f], bsol: [0x5c], period: [0x2e], commat: [0x40], num: [0x23], quest: [0x3f], plus: [0x2b],
  lsqb: [0x5b], lbrack: [0x5b], rsqb: [0x5d], rbrack: [0x5d], fjlig: [0x66, 0x6a], Tab: [0x9], NewLine: [0xa],
  nbsp: [0xa0], NonBreakingSpace: [0xa0], shy: [0xad], ensp: [0x2002], emsp: [0x2003], emsp13: [0x2004],
  emsp14: [0x2005], numsp: [0x2007], puncsp: [0x2008], thinsp: [0x2009], ThinSpace: [0x2009], hairsp: [0x200a],
  VeryThinSpace: [0x200a], ZeroWidthSpace: [0x200b], NegativeVeryThinSpace: [0x200b], NegativeThinSpace: [0x200b],
  NegativeMediumSpace: [0x200b], NegativeThickSpace: [0x200b], zwnj: [0x200c], zwj: [0x200d], lrm: [0x200e], rlm: [0x200f],
  MediumSpace: [0x205f], ThickSpace: [0x205f, 0x200a], NoBreak: [0x2060], ApplyFunction: [0x2061], af: [0x2061],
  InvisibleTimes: [0x2062], it: [0x2062], InvisibleComma: [0x2063], ic: [0x2063],
};
const ATTRIBUTE_REFERENCE = /&(?:#(?:[xX]([0-9a-fA-F]+)|([0-9]+));?|([A-Za-z]+[0-9]*)(;?))/g;

// An attribute value as jsoup decodes it for Spring, in one pass: a NUL as written becomes U+FFFD;
// a numeric reference takes every digit and gives U+FFFD past U+10FFFF, windows-1252 from 128 to
// 159, and any other code as it is (0 and surrogates too); a name must match exactly and end with
// ";", though nbsp and shy may end without one when no letter, digit, "=", "-" or "_" follows.
function decodeAttribute(value) {
  return value.replace(/\0/g, char(0xfffd)).replace(ATTRIBUTE_REFERENCE, (match, hex, decimal, name, semicolon, at, text) => {
    if (name === undefined) {
      const code = hex ? parseInt(hex, 16) : Number(decimal);
      if (!(code <= 0x10ffff)) return char(0xfffd);
      return code >= 0x80 && code <= 0x9f ? char(WINDOWS_1252[code - 0x80]) : String.fromCodePoint(code);
    }
    const codes = own(ADDRESS_REFERENCES, name);
    const ends = semicolon || ((name === 'nbsp' || name === 'shy') && !/[A-Za-z0-9=_-]/.test(text[at + match.length] || ''));
    return codes && ends ? String.fromCharCode(...codes) : match;
  });
}

// A tag or attribute name as jsoup keeps it: a NUL becomes U+FFFD, then it is lowercased and
// trimmed as Java's String.trim trims, so control characters at either end go too.
const JAVA_TRIM = new RegExp(`^[${char(0)}-${char(0x20)}]+|[${char(0)}-${char(0x20)}]+$`, 'g');
const nameOf = (raw) => raw.replace(/\0/g, char(0xfffd)).toLowerCase().replace(JAVA_TRIM, '');

// Where a start or end tag ends, from the first letter of its name: the index after its ">", or -1
// when the text ends first (the tokenizer then drops the tag). As in the tokenizer, a quote opens a
// value only where a value starts (right after "=", spaces allowed), so title=">" keeps going and
// a stray quote (x"y=1) opens nothing.
function tagEnd(html, at) {
  let state = 'tag'; // tag, gap, attr, after-attr, before-value, unquoted, or the open quote
  for (; at < html.length; at += 1) {
    const ch = html[at];
    if (state === '"' || state === "'") {
      if (ch === state) state = 'gap';
      continue;
    }
    if (ch === '>') return at + 1;
    const space = TAG_SPACE.test(ch);
    if (state === 'before-value') {
      if (ch === '"' || ch === "'") state = ch;
      else if (!space) state = 'unquoted';
    } else if (state === 'unquoted') {
      if (space) state = 'gap';
    } else if (ch === '/') {
      state = 'gap';
    } else if (space) {
      state = state === 'attr' || state === 'after-attr' ? 'after-attr' : 'gap';
    } else if (ch === '=' && (state === 'attr' || state === 'after-attr')) {
      state = 'before-value';
    } else if (state !== 'tag') {
      state = 'attr'; // a name starts or goes on (an "=" right after a gap is part of it)
    }
  }
  return -1;
}

// After "<!--": "<!-->" and "<!--->" are whole comments; any other ends at "-->" or "--!>".
function commentEnd(html, at) {
  const abrupt = /^-?>/.exec(html.slice(at, at + 2));
  if (abrupt) return at + abrupt[0].length;
  const close = /--!?>/g;
  close.lastIndex = at;
  return close.exec(html) ? close.lastIndex : html.length;
}

// Where a raw-text element's text stops, as jsoup's tokenizer reads it: at its end tag, "</name"
// then a space, "/" or ">". "</" and a letter starts an end tag whose name runs until a space, "/"
// or ">", so it can take in the "<" of the next one ("</x</style>" ends no style). In a textarea or
// title, whose text decodes references, the name takes in more only from a second letter on, and
// jsoup also stops the text at the first "<" and letter that no "</name" (all lower or all upper
// case) comes after, reading the rest as markup.
function rawTextEnd(html, at, name) {
  const rcdata = name === 'textarea' || name === 'title';
  const mentioned = Math.max(html.lastIndexOf(`</${name}`), html.lastIndexOf(`</${name.toUpperCase()}`));
  for (let p = html.indexOf('<', at); p !== -1; p = html.indexOf('<', p)) {
    if (html[p + 1] === '/' && LETTER.test(html[p + 2] || '')) {
      let after = rcdata ? p + 3 : p + 2;
      if (!rcdata || LETTER.test(html[after] || '')) {
        TAG_NAME.lastIndex = after;
        after += TAG_NAME.exec(html)[0].length;
      }
      if (html.slice(p + 2, after).toLowerCase() === name && TAG_SPACE_OR_END.test(html[after] || '')) return p;
      p = after;
    } else if (rcdata && LETTER.test(html[p + 1] || '') && p > mentioned) {
      return p;
    } else {
      p += 1;
    }
  }
  return html.length;
}

// The tags in rich text as the browser's HTML tokenizer finds them: "<" (or "</") starts one only
// before a letter, comments, CDATA sections and "<!…>", "<?…>" or "</…>" stretches are skipped
// whole, and the text inside raw-text elements is never read as tags. (svg and math read some of
// these differently; rich-text.js drops both when it draws a page.)
function tagsOf(html) {
  const tags = [];
  for (let at = html.indexOf('<'); at !== -1;) {
    const closing = html[at + 1] === '/';
    const nameAt = closing ? at + 2 : at + 1;
    let end;
    if (html.startsWith('<!--', at)) {
      end = commentEnd(html, at + 4);
    } else if (html.startsWith('<![CDATA[', at)) {
      // jsoup reads a CDATA section up to "]]>" here (a browser, a comment up to the first ">").
      const close = html.indexOf(']]>', at + 9);
      end = close === -1 ? html.length : close + 3;
    } else if (LETTER.test(html[nameAt] || '')) {
      end = tagEnd(html, nameAt);
      if (end === -1) end = html.length; // cut off, but unsafeTag still reads it: that is stricter
      tags.push(html.slice(at, end));
      TAG_NAME.lastIndex = nameAt;
      const name = nameOf(TAG_NAME.exec(html)[0]);
      if (!closing && name === 'plaintext') break; // everything after it is text
      if (!closing && RAW_TEXT.has(name)) end = rawTextEnd(html, end, name);
    } else if (closing || html[at + 1] === '!' || html[at + 1] === '?') {
      const gt = html.indexOf('>', at + 1);
      end = gt === -1 ? html.length : gt + 1;
    } else {
      end = at + 1; // "<" before anything else is text
    }
    at = html.indexOf('<', end);
  }
  return tags;
}

// A start tag as the tokenizer reads it, or null when `raw` is not one: its name, its attributes in
// order (names as nameOf gives them, values as written) and whether a ">" outside a quoted value
// closes it. The tag name runs until whitespace, "/" or ">"; an attribute name until whitespace,
// "/", "=" or ">" (an "=" can be its first character); a value is quoted or runs until whitespace.
function parseStartTag(raw) {
  if (raw[0] !== '<' || !LETTER.test(raw[1] || '')) return null;
  TAG_NAME.lastIndex = 1;
  const tagName = TAG_NAME.exec(raw)[0];
  const closed = tagEnd(raw, 1) === raw.length;
  const end = closed ? raw.length - 1 : raw.length;
  const attrs = [];
  let at = 1 + tagName.length;
  while (at < end) {
    if (TAG_SPACE.test(raw[at]) || raw[at] === '/') { at += 1; continue; }
    let name = raw[at];
    at += 1;
    for (;;) {
      while (at < end && !TAG_SPACE.test(raw[at]) && raw[at] !== '=' && raw[at] !== '/') { name += raw[at]; at += 1; }
      while (at < end && TAG_SPACE.test(raw[at])) at += 1;
      // jsoup follows an older spec here: a NUL after the spaces that end a name goes on that name.
      if (at >= end || raw[at] !== '\0') break;
      name += raw[at];
      at += 1;
    }
    let value = '';
    if (raw[at] === '=') {
      at += 1;
      while (at < end && TAG_SPACE.test(raw[at])) at += 1;
      const quote = raw[at];
      if (quote === '"' || quote === "'") {
        at += 1;
        while (at < end && raw[at] !== quote) { value += raw[at]; at += 1; }
        at += 1;
      } else {
        while (at < end && !TAG_SPACE.test(raw[at])) { value += raw[at]; at += 1; }
      }
    }
    const key = nameOf(name);
    if (key) attrs.push({ name: key, value });
  }
  return { name: nameOf(tagName), attrs, closed };
}

// An attribute Spring's jsoup pass refuses: a name starting "on", javascript: or vbscript: in its
// value, or an address attribute whose scheme isn't http, https or mailto, once dropped characters
// are removed. The value is decoded as jsoup decodes it and again loosely, which is stricter.
function unsafeAttribute({ name, value }) {
  if (name.startsWith('on')) return true;
  return [decodeAttribute(value), decodeReferences(value)].some((decoded) => {
    const squeezed = decoded.replace(NOT_PRINTED, '').toLowerCase();
    const scheme = URL_ATTRIBUTES.has(name) && ATTR_SCHEME.exec(squeezed);
    return squeezed.includes('javascript:') || squeezed.includes('vbscript:') || (Boolean(scheme) && !RICH_LINK_SCHEMES.has(scheme[1]));
  });
}

function unsafeTag(raw) {
  const tag = decodeReferences(raw);
  const squeezed = tag.replace(NOT_PRINTED, '').toLowerCase();
  if (FORBIDDEN_IN_TAG.some((word) => squeezed.includes(word)) || EVENT_HANDLER.test(tag.replace(NOT_PRINTED, ' '))) return true;
  const start = parseStartTag(raw);
  if (!start) return false;
  return CODE_ELEMENTS.has(start.name) || start.attrs.some(unsafeAttribute);
}

export function unsafeRichText(html) {
  return tagsOf(html).some(unsafeTag) || (html.match(TAG) || []).some(unsafeTag);
}

// Where jsoup's tree building drops start tags from a parsed body: a table part outside a table
// (here, while no more <table> than </table> tags came before it), a tag in a select other than the
// ones a select keeps or the ones that close it, and a form inside a form. The reader it returns
// takes the body's tags in order and gives each start tag that lands, parsed, or null.
function treeReader() {
  let tables = 0;
  let inSelect = false;
  let inForm = false;
  return (raw) => {
    TAG_NAME.lastIndex = 2;
    const closing = raw.startsWith('</') ? nameOf(TAG_NAME.exec(raw)[0]) : '';
    if (closing === 'form' && !inSelect) inForm = false;
    if (closing === 'select' || (closing === 'table' && tables > 0)) inSelect = false;
    if (closing === 'table') tables = Math.max(0, tables - 1);
    const start = parseStartTag(raw);
    if (!start || !start.closed) return null; // jsoup drops a tag the text cuts off
    const { name } = start;
    if (inSelect) {
      const leaves = SELECT_CLOSERS.has(name) || (tables > 0 && (name === 'table' || TABLE_PARTS.has(name)));
      if (leaves) inSelect = false;
      if (name === 'select' || (!leaves && !SELECT_KEEPS.has(name))) return null;
    }
    if (name === 'form' && inForm) return null;
    if (name === 'form') inForm = true;
    if (name === 'select') inSelect = true;
    if (name === 'table') tables += 1;
    return tables > 0 || !TABLE_PARTS.has(name) ? start : null;
  };
}

// Whether an href or src in rich text is on the student's own computer, as Spring's
// linksToComputer finds one with jsoup: in the body parsed whole (treeReader), and again in every
// run from "<" to the next ">" parsed on its own, where no table part lands.
export function linksToComputer(html) {
  const lands = treeReader();
  return tagsOf(html).some((raw) => {
    const start = lands(raw);
    return Boolean(start) && linksHome(start);
  }) || (html.match(TAG) || []).some((run) => tagsOf(run).some((raw) => {
    const start = parseStartTag(raw);
    return Boolean(start) && start.closed && !TABLE_PARTS.has(start.name) && linksHome(start);
  }));
}

// A start tag whose href or src jsoup keeps and urlIssue would call loopback_url: the tag lands in
// the body, and of its first 512 attributes the first of each name counts. The value is decoded as
// jsoup decodes it ("https://local&#104;ost/"), then read as typed (isLoopbackAddress).
function linksHome({ name, attrs }) {
  if (DROPPED_TAGS.has(name)) return false;
  const seen = new Set();
  return attrs.slice(0, MAX_ATTRIBUTES).some((attr) => {
    if (seen.has(attr.name)) return false;
    seen.add(attr.name);
    return RICH_ADDRESS_ATTRIBUTES.has(attr.name) && isLoopbackAddress(decodeAttribute(attr.value));
  });
}
