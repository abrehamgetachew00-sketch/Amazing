const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('scoreDisplay');
const gameOverOverlay = document.getElementById('gameOverOverlay');

const gridUnit = 20; 
let snake = [{x: 160, y: 140}, {x: 140, y: 140}, {x: 120, y: 140}];
let food = {x: 0, y: 0};
let dx = gridUnit; 
let dy = 0;        
let score = 0;
let gameLoopInterval;
let changingDirection = false;

function main() {
    if (hasBittenSelf()) {
        triggerNewGameOver();
        return;
    }

    changingDirection = false;
    clearCanvas();
    drawFood();
    moveSnake();
    drawSnake();
}

function clearCanvas() {
    ctx.fillStyle = '#c7d1b3';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    ctx.fillStyle = '#2b3022';
    snake.forEach(part => {
        ctx.fillRect(part.x, part.y, gridUnit - 2, gridUnit - 2); 
    });
}

function moveSnake() {
    // 1. Calculate the raw next position of the head
    let nextX = snake[0].x + dx;
    let nextY = snake[0].y + dy;

    // 2. WALL WRAPAROUND LOGIC
    // If head goes past the left edge, teleport to the right edge
    if (nextX < 0) {
        nextX = canvas.width - gridUnit;
    } 
    // If head goes past the right edge, teleport to the left edge
    else if (nextX >= canvas.width) {
        nextX = 0;
    }

    // If head goes past the top edge (North), teleport to bottom edge (South)
    if (nextY < 0) {
        nextY = canvas.height - gridUnit;
    } 
    // If head goes past the bottom edge (South), teleport to top edge (North)
    else if (nextY >= canvas.height) {
        nextY = 0;
    }

    const head = {x: nextX, y: nextY};
    snake.unshift(head);

    const hasEatenFood = snake[0].x === food.x && snake[0].y === food.y;
    if (hasEatenFood) {
        score += 10;
        scoreDisplay.innerText = `SCORE: ${String(score).padStart(4, '0')}`;
        generateFood();
    } else {
        snake.pop(); 
    }
}

function generateFood() {
    food.x = Math.floor(Math.random() * (canvas.width / gridUnit)) * gridUnit;
    food.y = Math.floor(Math.random() * (canvas.height / gridUnit)) * gridUnit;
    
    snake.forEach(part => {
        if (part.x === food.x && part.y === food.y) generateFood();
    });
}

function drawFood() {
    ctx.fillStyle = '#2b3022';
    ctx.fillRect(food.x + 4, food.y + 4, gridUnit - 8, gridUnit - 8);
}

function changeDirection(event) {
    if (changingDirection) return;

    const keyPressed = event.key;
    const goingUp = dy === -gridUnit;
    const goingDown = dy === gridUnit;
    const goingRight = dx === gridUnit;
    const goingLeft = dx === -gridUnit;

    if ((keyPressed === 'ArrowLeft' || keyPressed === 'a') && !goingRight) {
        dx = -gridUnit; dy = 0; changingDirection = true;
    }
    if ((keyPressed === 'ArrowUp' || keyPressed === 'w') && !goingDown) {
        dx = 0; dy = -gridUnit; changingDirection = true;
    }
    if ((keyPressed === 'ArrowRight' || keyPressed === 'd') && !goingLeft) {
        dx = gridUnit; dy = 0; changingDirection = true;
    }
    if ((keyPressed === 'ArrowDown' || keyPressed === 's') && !goingUp) {
        dx = 0; dy = gridUnit; changingDirection = true;
    }
    if (keyPressed === ' ' && hasBittenSelf()) {
        resetGame();
    }
}

// NEW GAME OVER METHOD: Only checks body self-collisions
function hasBittenSelf() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    return false;
}

// Enhanced presentation Game Over sequence
function triggerNewGameOver() {
    clearInterval(gameLoopInterval);
    
    // Invert the LCD screen colors quickly to create a retro crash flash effect
    ctx.fillStyle = '#2b3022';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    setTimeout(() => {
        gameOverOverlay.innerHTML = `
            <h2>CRASHED!</h2>
            <p style="font-size: 0.8rem; margin-bottom: 10px;">You bit your own tail matrix.</p>
            <p>Press SPACE to Try Again</p>
        `;
        gameOverOverlay.classList.remove('hidden');
    }, 150);
}

function resetGame() {
    snake = [{x: 160, y: 140}, {x: 140, y: 140}, {x: 120, y: 140}];
    dx = gridUnit; dy = 0; score = 0;
    scoreDisplay.innerText = "SCORE: 0000";
    gameOverOverlay.classList.add('hidden');
    generateFood();
    clearInterval(gameLoopInterval);
    gameLoopInterval = setInterval(main, 100); 
}

window.addEventListener('keydown', changeDirection);
resetGame();
