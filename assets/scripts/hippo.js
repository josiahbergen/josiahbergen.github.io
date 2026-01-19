
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('hippo').addEventListener('click', () => {
        const sound = new Audio('/assets/sounds/horn.mp3');
        sound.play();    
        setTimeout(spawnConfetti, 300);
    });
});

function spawnConfetti() {
    confetti(Object.assign({}, 
        { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }, 
        { particleCount: 100, origin: { x: 0.5, y: 0.5 }}));
}
