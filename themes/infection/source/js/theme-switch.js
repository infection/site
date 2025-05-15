(function() {
  // Theme switching functionality
  document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');

    // Check for saved theme preference or respect OS preference
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const storedTheme = localStorage.getItem('theme');

    // If the user has explicitly chosen a theme, use that
    if (storedTheme) {
      document.body.classList.toggle('dark-theme', storedTheme === 'dark');
    }
    // Otherwise, use the OS preference
    else if (prefersDarkScheme.matches) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    }

    // Toggle theme when the button is clicked
    themeToggle.addEventListener('click', function() {
      document.body.classList.toggle('dark-theme');

      // Update localStorage
      const isDarkTheme = document.body.classList.contains('dark-theme');
      localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    });
  });
})();
