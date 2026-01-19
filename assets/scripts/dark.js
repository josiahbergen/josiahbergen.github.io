(function() {
    const toggle = document.getElementById('dark-mode-toggle');
    const stored = localStorage.getItem('darkMode');
    const isDark = stored === 'true' || (stored === null && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) document.body.classList.add('dark-mode');
    toggle.textContent = isDark ? '◐' : '☀';

    toggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-mode');
        toggle.textContent = isDark ? '◐' : '☀';
        localStorage.setItem('darkMode', isDark);
    });
})();