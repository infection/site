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

  // Function to toggle between light and dark mode
  function toggleTheme() {
    // Toggle dark class on html and body elements
    const isDark = document.documentElement.classList.toggle('dark-theme');
    document.body.classList.toggle('dark-theme', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  document.addEventListener('click', function(event) {
      if (event.target.matches('#theme-toggle')
          || event.target.matches('#theme-toggle-icon')
      ) {
          toggleTheme();
      }
  });

  // Listen for changes in system color scheme preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    const isDark = event.matches;
    document.documentElement.classList.toggle('dark-theme', isDark);
    document.body.classList.toggle('dark-theme', isDark);
  });
})();
