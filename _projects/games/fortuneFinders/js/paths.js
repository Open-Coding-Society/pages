/** Static images under `images/fortuneFinders/` (committed deploy copy). */
export const FF_PROJECT = '/images/fortuneFinders';

/** @param {string} siteBase @param {string} file - filename under `images/fortuneFinders/` */
export function ffImage(siteBase, file) {
  const base = (siteBase || '').replace(/\/$/, '');
  return `${base}${FF_PROJECT}/${file}`;
}
