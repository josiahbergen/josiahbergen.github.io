const BOARD_WIDTH = 12;
const BOARD_HEIGHT = 8;
const CHAR_EMPTY = '·';
const CHAR_SNAKE = 'O';
const CHAR_FOOD = 'x';
const SPEED = 200;

let snake = [];
let direction = { x: 1, y: 0 };
let food = null;
let gameInterval = null;
let isPlaying = false;
let score = 0;

const boardElement = document.getElementById('game-board');
const statusElement = document.getElementById('game-status');

function initGame() {
    snake = [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }];
    direction = { x: 1, y: 0 };
    score = 0;
    placeFood();
    render();
    statusElement.textContent = 'use arrows to move';
    isPlaying = true;
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, SPEED);
}

function stopGame(message) {
    isPlaying = false;
    clearInterval(gameInterval);
    statusElement.textContent = message + ' - press space to restart';
}

function placeFood() {
    let valid = false;
    while (!valid) {
        food = {
            x: Math.floor(Math.random() * BOARD_WIDTH),
            y: Math.floor(Math.random() * BOARD_HEIGHT)
        };
        valid = !snake.some(segment => segment.x === food.x && segment.y === food.y);
    }
}

function gameLoop() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Wall collision
    if (head.x < 0 || head.x >= BOARD_WIDTH || head.y < 0 || head.y >= BOARD_HEIGHT) {
        stopGame('game over');
        return;
    }

    // Self collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        stopGame('game over');
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        placeFood();
    } else {
        snake.pop();
    }

    render();
}

function render() {
    let output = '';
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
            if (snake.some(s => s.x === x && s.y === y)) {
                output += CHAR_SNAKE;
            } else if (food && food.x === x && food.y === y) {
                output += CHAR_FOOD;
            } else {
                output += CHAR_EMPTY;
            }
        }
        output += '\n';
    }
    boardElement.textContent = output;
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (!isPlaying) {
            initGame();
        }
        e.preventDefault(); // Prevent scrolling
    }
    
    if (!isPlaying) return;

    switch (e.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
});

// Initial render of empty board
function initialRender() {
    let output = '';
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
            output += CHAR_EMPTY;
        }
        output += '\n';
    }
    boardElement.textContent = output;
}

initialRender();
