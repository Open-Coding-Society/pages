/** Static assets under this project folder (served via Jekyll include, no copies). */
export const FF_PROJECT = '/_projects/games/fortuneFinders';

/** @param {string} siteBase @param {string} file - filename under `images/` */
export function ffImage(siteBase, file) {
  const base = (siteBase || '').replace(/\/$/, '');
  return `${base}${FF_PROJECT}/images/${file}`;
}
