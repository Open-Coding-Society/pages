import { readState, writeState } from './model.js';

const nav = document.querySelector('.topics-document-nav');
if (nav) {
  const context = writeState(readState(location.search));
  const returnLink = nav.querySelector('[data-topics-return]');
  const returnUrl = new URL(returnLink.href);
  returnUrl.search = context;
  returnLink.href = returnUrl.href;

  async function connectDocumentLinks() {
    try {
      const response = await fetch(new URL('./data.json', import.meta.url));
      if (!response.ok) throw new Error(`Topics links HTTP ${response.status}`);
      const documents = await response.json();
      const base = returnUrl.pathname.replace(/\/topics\/$/, '');
      const links = new Map(documents.map((document) => [base + document.url, base + document.viewUrl]));
      document.querySelectorAll('main a[href]').forEach((link) => {
        if (link.closest('.topics-document-nav')) return;
        const url = new URL(link.href);
        if (url.origin !== location.origin || !links.has(url.pathname)) return;
        url.pathname = links.get(url.pathname);
        const params = new URLSearchParams(url.search);
        const state = new URLSearchParams(context);
        for (const [key, value] of state) params.append(key, value);
        url.search = params.toString();
        link.href = url.href;
      });
    } catch (error) {
      console.error('Topics document links could not initialize', error);
      const message = document.createElement('p');
      message.setAttribute('role', 'status');
      message.textContent = 'Topic link context is unavailable. Linked documents may open in their original context.';
      nav.after(message);
    }
  }
  connectDocumentLinks();
}
