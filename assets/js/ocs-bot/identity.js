// assets/js/ocs-bot/identity.js
// -----------------------------------------------------------------------------
// Resolves which course the student is in, preferring their ACCOUNT data (the
// section/class returned by /api/id) over the page path. So a CSA student gets
// CSA behavior anywhere on the site, not only on /csa pages.
// -----------------------------------------------------------------------------

export const COURSE_LABEL = { csp: 'AP CSP', csa: 'AP CSA', csse: 'CSSE' };

function courseFromUser(user) {
  if (!user) return null;
  const hay = JSON.stringify([
    user.sections, user.classes, user.section, user.abbreviation, user.course, user.role,
  ]).toLowerCase();
  if (/\bcsse\b/.test(hay)) return 'csse';
  if (/\bcsa\b/.test(hay)) return 'csa';
  if (/\bcsp\b/.test(hay)) return 'csp';
  return null;
}

function courseFromPath(pathname) {
  const p = (pathname || '').toLowerCase();
  if (p.indexOf('/csse') !== -1) return 'csse';
  if (p.indexOf('/csa') !== -1) return 'csa';
  if (p.indexOf('/csp') !== -1) return 'csp';
  return null;
}

// Account data first, page path second.
export function resolveCourse(user, pathname) {
  return courseFromUser(user) || courseFromPath(pathname) || null;
}
