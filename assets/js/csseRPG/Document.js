// lightMode.js
export function enableLightMode() {
    // Code to enable light mode
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
}

// darkMode.js
export function enableDarkMode() {
    // Code to enable dark mode
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
}