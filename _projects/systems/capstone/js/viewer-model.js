export const SNAPSHOT_KEY = 'capstone-viewer';

export function readFilters(search) {
  const params = new URLSearchParams(search);
  return {
    course: params.get('course') || 'all',
    year: params.has('year') ? params.get('year') : null,
    query: params.get('q') || '',
  };
}

export function writeFilters(url, filters) {
  url.searchParams.set('course', filters.course);
  url.searchParams.set('year', filters.year);
  if (filters.query) url.searchParams.set('q', filters.query);
  else url.searchParams.delete('q');
  return url;
}

function projectPath(path, origin) {
  if (!path || !path.startsWith('/') || path.startsWith('//')) return null;
  const url = new URL(path, origin);
  if (url.origin !== origin || url.search || url.hash || url.pathname === '/') return null;
  return url.pathname.replace(/\/+$/, '') || null;
}

export function readViewerContext(url) {
  if (url.searchParams.get('capstone_view') !== '1') return null;
  const project = projectPath(url.searchParams.get('capstone_project'), url.origin);
  if (!project) return null;
  return {
    project,
    course: url.searchParams.get('capstone_course') || 'all',
    year: url.searchParams.get('capstone_year') || '',
    query: url.searchParams.get('capstone_q') || '',
  };
}

export function viewerUrl(href, context, currentUrl) {
  const url = new URL(href, currentUrl);
  const root = projectPath(context.project, currentUrl.origin);
  if (!root || url.origin !== currentUrl.origin ||
      (url.pathname !== root && !url.pathname.startsWith(`${root}/`))) return null;
  url.searchParams.set('capstone_view', '1');
  url.searchParams.set('capstone_project', root);
  url.searchParams.set('capstone_course', context.course);
  url.searchParams.set('capstone_year', context.year);
  if (context.query) url.searchParams.set('capstone_q', context.query);
  else url.searchParams.delete('capstone_q');
  return url;
}

export function matchingSnapshot(snapshot, context) {
  return matchingFilters(snapshot, context) &&
    Array.isArray(snapshot.projects) && snapshot.projects.some((project) => project?.path === context.project);
}

export function matchingFilters(snapshot, filters) {
  return snapshot && snapshot.course === filters.course &&
    snapshot.year === filters.year && snapshot.query === filters.query;
}
