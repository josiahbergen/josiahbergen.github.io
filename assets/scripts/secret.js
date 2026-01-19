(function() {
    let secret = document.getElementById('secret');
    if (!secret) return;
    
    let timeout;
    const href = '/secret/';
    const content = secret.textContent;

    function setup() {
        secret.addEventListener('mouseenter', () => {
            if (secret.tagName === 'A') return;
            timeout = setTimeout(() => {
                secret.innerHTML = `<a href="${href}" id="secret">${content}</a>`;
            }, 1000);
        });
        
        secret.addEventListener('mouseleave', () => {
            clearTimeout(timeout);
            secret.innerHTML = content;
        });
    }
    
    setup();
})();
