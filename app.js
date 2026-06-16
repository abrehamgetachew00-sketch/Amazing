const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('scoreDisplay');
const gameOverOverlay = document.getElementById('gameOverOverlay');

const gridUnit = 20; // Size of each matrix block
let snake = [{x: 160, y: 140}, {x: 140, y: 140}, {x: 120, y: 140}];
let food = {x: 0, y: 0};
let dx = gridUnit; // Horizontal velocity
let dy = 0;        // Vertical velocity
let score = 0;
let gameLoopInterval;
let changingDirection = false;

function main() {
    if (hasGameEnded()) {
        gameOverOverlay.classList.remove('hidden');
        clearInterval(gameLoopInterval);
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
        ctx.fillRect(part.x, part.y, gridUnit - 2, gridUnit - 2); // 2px margin creates block effect
    });
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);

    const hasEatenFood = snake[0].x === food.x && snake[0].y === food.y;
    if (hasEatenFood) {
        score += 10;
        scoreDisplay.innerText = `SCORE: ${String(score).padStart(4, '0')}`;
        generateFood();
    } else {
        snake.pop(); // Remove tail block if food wasn't consumed
    }
}

function generateFood() {
    food.x = Math.floor(Math.random() * (canvas.width / gridUnit)) * gridUnit;
    food.y = Math.floor(Math.random() * (canvas.height / gridUnit)) * gridUnit;
    
    // Safety check ensuring food doesn't land inside snake body array
    snake.forEach(part => {
        if (part.x === food.x && part.y === food.y) generateFood();
    });
}

function drawFood() {
    ctx.fillStyle = '#2b3022';
    // Classic pixelated checkered food artifact
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
    if (keyPressed === ' ' && hasGameEnded()) {
        resetGame();
    }
}

function hasGameEnded() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= canvas.width;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= canvas.height;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

function resetGame() {
    snake = [{x: 160, y: 140}, {x: 140, y: 140}, {x: 120, y: 140}];
    dx = gridUnit; dy = 0; score = 0;
    scoreDisplay.innerText = "SCORE: 0000";
    gameOverOverlay.classList.add('hidden');
    generateFood();
    clearInterval(gameLoopInterval);
    gameLoopInterval = setInterval(main, 100); // 100ms cycle speed
}

window.addEventListener('keydown', changeDirection);
resetGame();
