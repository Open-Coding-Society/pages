function toggleTheme() {
  const bodyElement = document.body;
  const isDarkMode = bodyElement.classList.contains('dark-mode');
  if (isDarkMode) {
    bodyElement.classList.remove('dark-mode'); // Switch to light mode
  } else {
    bodyElement.classList.add('dark-mode'); // Switch to dark mode
  }
}
