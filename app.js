const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Fixed canvas coordinate resolutions
canvas.width = 560;
canvas.height = 400;

const funnyBugs = [
    "NullPointerException", "CSS centered a div wrongly", 
    "Git Merge Conflict", "Uncaught Promises", 
    "AWS bill $42,000", "Production Database dropped", 
    "Legacy Code nightmares", "Infinite loop spawned"
];

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let bugs = [];
let score = 0;
let burnout = 0;
let gameInterval;
let spawnRate = 2000; // ms
let lastSpawn = 0;

class Bug {
    constructor() {
        this.x = Math.random() * (canvas.width - 150) + 20;
        this.y = 0;
        this.speed = Math.random() * 1.2 + 0.8;
        this.text = funnyBugs[Math.floor(Math.random() * funnyBugs.length)];
        this.keyTrigger = alphabet[Math.floor(Math.random() * alphabet.length)];
    }

    draw() {
        ctx.fillStyle = '#ff5555';
        ctx.font = '12px monospace';
        ctx.fillText(`[${this.keyTrigger}] ${this.text}`, this.x, this.y);
    }

    update() {
        this.y += this.speed;
    }
}

function gameLoop(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Spawn mechanism
    if (timestamp - lastSpawn > spawnRate) {
        bugs.push(new Bug());
        lastSpawn = timestamp;
        if(spawnRate > 600) spawnRate -= 50; // Accelerate game difficulty
    }

    // Process bugs
    for (let i = bugs.length - 1; i >= 0; i--) {
        bugs[i].update();
        bugs[i].draw();

        // Bug hit bottom (Crashes production)
        if (bugs[i].y > canvas.height) {
            burnout += 20;
            document.getElementById('burnoutFill').style.width = `${burnout}%`;
            bugs.splice(i, 1);

            if (burnout >= 100) {
                endGame();
                return;
            }
        }
    }

    if (burnout < 100) {
        gameInterval = requestAnimationFrame(gameLoop);
    }
}

// Sniping bugs using typing keys
window.addEventListener('keydown', (e) => {
    const pressedKey = e.key.toUpperCase();
    // Find closest falling bug matching that key
    let targetIndex = -1;
    let highestY = -1;

    for (let i = 0; i < bugs.length; i++) {
        if (bugs[i].keyTrigger === pressedKey && bugs[i].y > highestY) {
            highestY = bugs[i].y;
            targetIndex = i;
        }
    }

    if (targetIndex !== -1) {
        bugs.splice(targetIndex, 1);
        score += 1;
        document.getElementById('score').innerText = score;
    }
});

function endGame() {
    cancelAnimationFrame(gameInterval);
    document.getElementById('gameOverScreen').classList.remove('hidden');
}

function resetGame() {
    bugs = [];
    score = 0;
    burnout = 0;
    spawnRate = 2000;
    document.getElementById('score').innerText = "0";
    document.getElementById('burnoutFill').style.width = "0%";
    document.getElementById('gameOverScreen').classList.add('hidden');
    lastSpawn = performance.now();
    gameInterval = requestAnimationFrame(gameLoop);
}

// Initial start
lastSpawn = performance.now();
gameInterval = requestAnimationFrame(gameLoop);
