const BOARD_WIDTH = 16;
const BOARD_HEIGHT = 8;
const CHAR_SHEEP = 'w';
const CHAR_FLOWER = '"';
const CHAR_GRASS = '.';
const CHAR_EMPTY = ' ';

let sheep = { x: 8, y: 4 };
let flowers = [];
let meadow = [];
let score = 0;
let isPlaying = false;

const boardElement = document.getElementById('game-board');
const statusElement = document.getElementById('game-status');

function initGame() {
    // Generate static meadow
    meadow = [];
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        meadow[y] = [];
        for (let x = 0; x < BOARD_WIDTH; x++) {
            meadow[y][x] = Math.random() > 0.8 ? CHAR_GRASS : CHAR_EMPTY;
        }
    }
    
    sheep = { x: Math.floor(BOARD_WIDTH / 2), y: Math.floor(BOARD_HEIGHT / 2) };
    flowers = [];
    score = 0;
    spawnFlower();
    render();
    statusElement.textContent = 'use arrows to graze';
    isPlaying = true;
}

function spawnFlower() {
    if (flowers.length > 3) return;
    let x, y;
    do {
        x = Math.floor(Math.random() * BOARD_WIDTH);
        y = Math.floor(Math.random() * BOARD_HEIGHT);
    } while ((x === sheep.x && y === sheep.y) || flowers.some(f => f.x === x && f.y === y));
    flowers.push({ x, y });
}

function render() {
    let output = '';
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
            let char = '';
            if (x === sheep.x && y === sheep.y) {
                char = CHAR_SHEEP;
            } else {
                const flower = flowers.find(f => f.x === x && f.y === y);
                if (flower) {
                    char = CHAR_FLOWER;
                } else if (meadow[y][x] === CHAR_GRASS) {
                    char = `<span class="grass">${CHAR_GRASS}</span>`;
                } else {
                    char = CHAR_EMPTY;
                }
            }
            output += char + ' ';
        }
        output += '\n';
    }
    boardElement.innerHTML = output;
}

document.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.key) || e.code === 'Space') {
        e.preventDefault();
    }

    if (e.code === 'Space') {
        initGame();
        return;
    }
    
    if (!isPlaying) return;

    let newPos = { ...sheep };
    if (e.key === 'ArrowUp') newPos.y--;
    if (e.key === 'ArrowDown') newPos.y++;
    if (e.key === 'ArrowLeft') newPos.x--;
    if (e.key === 'ArrowRight') newPos.x++;

    // Boundary check
    if (newPos.x >= 0 && newPos.x < BOARD_WIDTH && newPos.y >= 0 && newPos.y < BOARD_HEIGHT) {
        sheep = newPos;
        statusElement.textContent = 'use arrows to graze';

        // Eat flower
        const flowerIndex = flowers.findIndex(f => f.x === sheep.x && f.y === sheep.y);
        if (flowerIndex !== -1) {
            flowers.splice(flowerIndex, 1);
            score++;
            statusElement.textContent = 'baaa';
            spawnFlower();
        }

        // Randomly spawn more flowers
        if (Math.random() > 0.95) spawnFlower();

        render();
    }
});

// Check if user is on mobile device
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
        || (window.innerWidth <= 768);
}

// Hide game on mobile
if (isMobile()) {
    const gameWrapper = document.querySelector('.game-wrapper');
    if (gameWrapper) {
        gameWrapper.style.display = 'none';
    }
}

// Initial state
function initialRender() {
    initGame();
}

initialRender();
