export function readerContext(search, membership, defaultCourse) {
  const params = new URLSearchParams(search);
  const context = params.get('context');
  const course = params.get('course');
  if (context === 'topics') return { course: null, issue: '' };
  if (context && context !== 'course') {
    return { course: defaultCourse || null, issue: 'Unknown navigation context. Showing the document default.' };
  }
  if (course && Object.hasOwn(membership, course)) return { course, issue: '' };
  return {
    course: defaultCourse || null,
    issue: course ? 'This document has no placement in that course. Showing its default navigation.' : '',
  };
}

export function readerLink(path, baseurl, context, topicsSearch = '') {
  const params = new URLSearchParams(topicsSearch);
  params.set('context', context.course ? 'course' : 'topics');
  if (context.course) params.set('course', context.course);
  else params.delete('course');
  return `${baseurl}${path}?${params}`;
}

export function courseWeeks(documents, course) {
  const groups = new Map();
  documents.filter(document => document.courses[course]).forEach(document => {
    const week = Number(document.courses[course].week);
    if (!groups.has(week)) groups.set(week, []);
    groups.get(week).push(document);
  });
  return [...groups].sort(([a], [b]) => a - b).map(([week, lessons]) => ({
    week, lessons: lessons.sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true })),
  }));
}
