export default function handleThemeToggle() {
  const htmlElement = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const themeToggleIcon = themeToggle.querySelector('#theme-toggle-icon');

  let currentTheme = localStorage.getItem('theme') || 'dark';
  htmlElement.setAttribute('data-bs-theme', currentTheme);

  function updateIcon(theme) {
    if (!themeToggleIcon) return;

    const iconClass = theme === 'dark' ? 'bi-moon-fill' : 'bi-sun-fill';
    const oppositeClass = theme === 'dark' ? 'bi-sun-fill' : 'bi-moon-fill';

    if (themeToggleIcon.classList.length === 0) {
      themeToggleIcon.classList.add(iconClass);
    } else {
      themeToggleIcon.classList.replace(oppositeClass, iconClass);
    }
  }

  updateIcon(currentTheme);

  themeToggle.addEventListener('click', function () {
    currentTheme =
      htmlElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
    htmlElement.setAttribute('data-bs-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateIcon(currentTheme);
  });
}
