// Runs Show code's snippet (api-data.js codeSnippet) the way a student's page would: in a realm of
// its own (node:vm), with a fetch that answers `reply` and the small fake DOM. runSnippet returns
// the title of each card it draws, so a test can compare them with the items the block shows;
// snippetItems returns the items its loadItems finds, to compare with listIn's.
import vm from 'node:vm';
import { createDocument, text } from './live/dom.mjs';

async function run(code, reply) {
  const doc = createDocument();
  const container = doc.createElement('div');
  container.id = 'api-data';
  doc.body.appendChild(container);
  const errors = [];
  const fetch = async () => ({ ok: true, status: 200, json: async () => reply });
  const context = vm.createContext({ fetch, document: doc, console: { error: (...args) => errors.push(args.join(' ')) } });
  // The snippet ends with its loadItems() promise, which runInContext hands back.
  await vm.runInContext(code, context);
  if (errors.length) throw new Error(`runSnippet: the snippet failed: ${errors.join('; ')}`);
  return { container, context };
}

export async function runSnippet(code, reply) {
  const { container } = await run(code, reply);
  return container.querySelectorAll('.ocs__card h3').map(text);
}

// The snippet's own lists belong to its realm, which assert's deep equality tells apart: the items
// come back in a list of this realm. They are the reply's own values, so a test can compare them
// by identity.
export async function snippetItems(code, reply) {
  const { context } = await run(code, reply);
  return [...(await context.loadItems())];
}
