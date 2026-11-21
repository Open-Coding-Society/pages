// The URL hash names the section, so links can open it directly and the
// browser's Back button returns to the last one.

/**
 * The section to show for a URL hash: the one it names when the page has it and
 * the viewer may open it, otherwise the page's first section.
 * @param {string} hash location.hash, such as "#growth"
 * @param {string[]} sections the page's section names; the first is the default
 * @param {(name: string) => boolean} [canOpen] false for a section this viewer can't use
 * @returns {string}
 */
export function sectionForHash(hash, sections, canOpen = () => true) {
  const wanted = hash.replace(/^#/, "");
  return sections.includes(wanted) && canOpen(wanted) ? wanted : sections[0];
}

/**
 * Marks the sidebar link of the shown section as current. The sidebar include
 * puts data-sidebar-section only on the current page's links, in both the side
 * column and the phone menu.
 * @param {ParentNode} root
 * @param {string} name
 */
export function markSidebarSection(root, name) {
  root.querySelectorAll("[data-sidebar-section]").forEach((link) => {
    if (link.dataset.sidebarSection === name) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  });
}

/**
 * Shows the section the hash names now and each time the hash changes.
 * @param {string[]} sections the page's section names; the first is the default
 * @param {(name: string) => unknown} show shows one section and may return a promise
 * @param {(name: string) => boolean} [canOpen] false for a section this viewer can't use
 */
export function followSectionHash(sections, show, canOpen) {
  if (!sections.length) throw new Error("followSectionHash needs at least one section name");

  function open() {
    const name = sectionForHash(location.hash, sections, canOpen);
    markSidebarSection(document, name);
    Promise.resolve()
      .then(() => show(name))
      .catch((error) => console.error(`Could not open the ${name} section:`, error));
  }

  window.addEventListener("hashchange", open);
  open();
}
