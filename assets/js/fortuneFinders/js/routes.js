/**
 * Fortune Finders URL map — keep in sync with `permalink:` in each markdown file.
 * Use ffUrl(gameEnv.path, FF_ROUTES.*) in level scripts.
 */
export const FF_ROUTES = {
  game: '/gamify/fortuneFinders',
  quant: '/gamify/fortuneFinders/quant',
  quantOverview: '/gamify/fortuneFinders/quant/overview',
  quantLesson: '/gamify/fortuneFinders/quant-lesson',
  futures: '/gamify/fortuneFinders/futures',
  futuresLesson: '/gamify/fortuneFinders/futures-lesson',
  optionsLesson: '/gamify/fortuneFinders/options-lesson',
};

/** @param {string} siteBase - `gameEnv.path` / `{{ site.baseurl }}` */
export function ffUrl(siteBase, route) {
  const base = (siteBase || '').replace(/\/$/, '');
  const path = route.startsWith('/') ? route : `/${route}`;
  return `${base}${path}`;
}
