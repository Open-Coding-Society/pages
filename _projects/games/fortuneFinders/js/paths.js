/** Static images copied to `images/projects/fortuneFinders/` at build time. */
export const FF_PROJECT = '/images/fortuneFinders';

/** @param {string} siteBase @param {string} file - filename under `images/` */
export function ffImage(siteBase, file) {
  const base = (siteBase || '').replace(/\/$/, '');
  return `${base}${FF_PROJECT}/images/${file}`;
}
