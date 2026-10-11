export const COURSE_ORDER = ['csse', 'csp', 'csa', 'csh'];
const STORAGE_KEY = 'ocs-selected-course';

export function normalizeCourse(value) {
  const course = String(value || '').trim().toLowerCase().replace(/^ap(?=cs[pa]$)/, '');
  return COURSE_ORDER.includes(course) ? course : null;
}

export function savedCourse(storage = localStorage) {
  try {
    return normalizeCourse(storage.getItem(STORAGE_KEY));
  } catch (error) {
    console.warn('Cannot read selected course:', error);
    return null;
  }
}

export function rememberCourse(value, storage = localStorage) {
  const course = normalizeCourse(value);
  if (!course) throw new Error(`Unknown course: ${value}`);
  try {
    storage.setItem(STORAGE_KEY, course);
  } catch (error) {
    console.warn('Cannot save selected course:', error);
  }
}

export function selectEntryCourse(classes, selected, fallback = 'csse') {
  const enrolled = (Array.isArray(classes) ? classes : [classes])
    .map(normalizeCourse).filter(Boolean);
  const remembered = normalizeCourse(selected);
  if (enrolled.length) {
    return enrolled.includes(remembered) ? remembered : COURSE_ORDER.find(course => enrolled.includes(course));
  }
  return remembered || normalizeCourse(fallback) || 'csse';
}

export function courseEntryUrl(baseurl, course) {
  const normalized = normalizeCourse(course);
  if (!normalized) throw new Error(`Unknown course: ${course}`);
  return `${baseurl}/navigation/courses/${normalized}/`;
}
