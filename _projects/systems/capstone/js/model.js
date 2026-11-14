export function normalizeSearch(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
}

export function matchesProject(project, { course = 'all', year = '', query = '' } = {}) {
  const projectCourse = (project.course || '').toUpperCase();
  const selectedCourse = course.toUpperCase();
  if (selectedCourse !== 'ALL' && projectCourse !== selectedCourse) return false;
  if (year && (project.year || '') !== year) return false;
  const words = normalizeSearch(query).split(/\s+/).filter(Boolean);
  const text = normalizeSearch(project.text || '');
  return words.every((word) => text.includes(word));
}
