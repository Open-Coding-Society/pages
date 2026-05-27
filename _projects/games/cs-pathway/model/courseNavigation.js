import { baseurl, pythonURI, fetchOptions } from '@assets/js/api/config.js';

export async function refreshCourseNavigation(isLoggedIn = true) {
  const trigger = document.querySelector('.trigger');
  if (!trigger) {
    return;
  }

  const links = trigger.querySelectorAll('.page-link');

  if (!isLoggedIn) {
    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (href && (href.includes('/navigation/blogs') || href.includes('/navigation/courses'))) {
        link.setAttribute('href', `${baseurl}/navigation/blogs/`);
        link.textContent = 'Blogs';
      }
    });
    return;
  }

  try {
    const response = await fetch(`${pythonURI}/api/user/class`, fetchOptions);
    if (!response.ok) {
      updateCourseLinks(links, `${baseurl}/navigation/courses/`, 'Courses');
      return;
    }

    const data = await response.json();
    const classes = Array.isArray(data?.class) ? data.class : [];
    const courseMap = {
      CSSE: { name: 'CSSE', url: `${baseurl}/navigation/courses/csse` },
      CSP: { name: 'APCSP', url: `${baseurl}/navigation/courses/csp` },
      CSA: { name: 'APCSA', url: `${baseurl}/navigation/courses/csa` },
    };

    const userCourses = classes
      .filter((className) => courseMap[className])
      .map((className) => courseMap[className]);

    if (userCourses.length === 1) {
      updateCourseLinks(links, userCourses[0].url, userCourses[0].name);
    } else {
      updateCourseLinks(links, `${baseurl}/navigation/courses/`, 'Courses');
    }
  } catch (error) {
    console.error('Course navigation refresh failed:', error);
    updateCourseLinks(links, `${baseurl}/navigation/courses/`, 'Courses');
  }
}

function updateCourseLinks(links, url, text) {
  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (href && (href.includes('/navigation/blog') || href.includes('/navigation/courses'))) {
      link.setAttribute('href', url);
      link.textContent = text;
    }
  });
}
