const container = document.querySelector('.snow');

document.addEventListener('DOMContentLoaded', () => {
    const chars = ['*', '+', '.', 'o', 'x', "'", '°', '"', '`'];
    const spawnInterval = 200; // ms
    
    function createParticle() {
        const span = document.createElement('span');
        span.className = 'ascii-particle';
        span.textContent = chars[Math.floor(Math.random() * chars.length)];
        span.style.left = Math.random() * 100 + 'vw';
        
        const duration = Math.random() * 5 + 5; // 5 to 10 secs
        span.style.animationDuration = duration + 's';
        span.style.opacity = Math.random() * 0.5 + 0.2;
        span.style.fontSize = (Math.random() * 0.5 + 0.8) + 'rem';
        
        container.appendChild(span);
        
        setTimeout(() => {
            span.remove();
        }, duration * 1000);
    }
    setInterval(createParticle, spawnInterval);
});
