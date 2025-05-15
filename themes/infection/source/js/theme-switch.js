(function() {
  // On page load, set the theme
  const userTheme = localStorage.getItem('theme');
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  if (userTheme === 'dark' || (!userTheme && systemTheme === 'dark')) {
    document.documentElement.classList.add('dark-theme');
    document.body.classList.add('dark-theme');
  } else {
    document.documentElement.classList.remove('dark-theme');
    document.body.classList.remove('dark-theme');
  }

  // Theme switching functionality
  document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');

    // Function to toggle between light and dark mode
    function toggleTheme() {
      // Toggle dark class on html and body elements
      const isDark = document.documentElement.classList.toggle('dark-theme');
      document.body.classList.toggle('dark-theme', isDark);
      localStorage.setItem('theme', isDark ? 'dark' : 'light');

      // Dispatch custom event for Monaco editors
      document.dispatchEvent(new CustomEvent('themeChanged'));
    }

    // Toggle theme when the button is clicked
    themeToggle.addEventListener('click', toggleTheme);

    // Listen for changes in system color scheme preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      const isDark = event.matches;
      document.documentElement.classList.toggle('dark-theme', isDark);
      document.body.classList.toggle('dark-theme', isDark);
    });
  });
})();
