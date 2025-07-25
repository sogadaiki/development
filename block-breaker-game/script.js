const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// UI Elements
const scoreEl = document.getElementById('score');
const speedUpBtn = document.getElementById('speed-up');
const slowDownBtn = document.getElementById('slow-down');
const gameOverBox = document.getElementById('game-over');
const gameWinBox = document.getElementById('game-win');
const finalScoreOverEl = document.getElementById('final-score-over');
const highScoreOverEl = document.getElementById('high-score-over');
const finalScoreWinEl = document.getElementById('final-score-win');
const highScoreWinEl = document.getElementById('high-score-win');
const bgm = document.getElementById('bgm');
const hitSound = document.getElementById('hit-sound');
const breakSound = document.getElementById('break-sound');
const loseSound = document.getElementById('lose-sound');

const livesEl = document.getElementById('lives');

// Game variables
let lives = 3;
let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
let gameRunning = true;
let userInteracted = false;

// Paddle variables
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

// Control variables
let rightPressed = false;
let leftPressed = false;

// Brick variables
let brickRowCount = 4;
let brickColumnCount = 6;
let brickWidth = 60;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
const brickColors = ['#e74c3c', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6'];

// Stage data
const stages = [
    // Stage 1
    {
        brickRowCount: 4,
        brickColumnCount: 6,
        bricks: [
            [1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1]
        ]
    },
    // Stage 2
    {
        brickRowCount: 5,
        brickColumnCount: 7,
        bricks: [
            [0, 1, 1, 1, 1, 1, 0],
            [1, 2, 1, 1, 1, 2, 1],
            [1, 1, Infinity, 1, Infinity, 1, 1],
            [1, 2, 1, 1, 1, 2, 1],
            [0, 1, 1, 1, 1, 1, 0]
        ]
    },
    // Stage 3
    {
        brickRowCount: 6,
        brickColumnCount: 8,
        bricks: [
            [Infinity, 1, 1, 1, 1, 1, 1, Infinity],
            [1, Infinity, 1, 1, 1, 1, Infinity, 1],
            [1, 1, Infinity, 1, 1, Infinity, 1, 1],
            [1, 1, 1, Infinity, Infinity, 1, 1, 1],
            [1, 1, Infinity, 1, 1, Infinity, 1, 1],
            [1, Infinity, 1, 1, 1, 1, Infinity, 1]
        ]
    }
];

let currentStage = 0;
let bricks = [];
let breakableBricksCount = 0;

function initBricks() {
    const stage = stages[currentStage];
    brickRowCount = stage.brickRowCount;
    brickColumnCount = stage.brickColumnCount;
    bricks = [];
    breakableBricksCount = 0;

    for(let c=0; c<brickColumnCount; c++) {
        bricks[c] = [];
        for(let r=0; r<brickRowCount; r++) {
            const health = stage.bricks[r][c];
            const color = brickColors[Math.floor(Math.random() * brickColors.length)];
            bricks[c][r] = { x: 0, y: 0, status: health > 0 ? 1 : 0, color: color, health: health };
            if (health > 0 && health < Infinity) {
                breakableBricksCount++;
            }
        }
    }
}

// Event Listeners
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);
speedUpBtn.addEventListener('click', () => { dx *= 1.2; dy *= 1.2; });
slowDownBtn.addEventListener('click', () => { dx /= 1.2; dy /= 1.2; });

function keyDownHandler(e) {
    if(e.key == 'Right' || e.key == 'ArrowRight') {
        rightPressed = true;
    }
    else if(e.key == 'Left' || e.key == 'ArrowLeft') {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == 'Right' || e.key == 'ArrowRight') {
        rightPressed = false;
    }
    else if(e.key == 'Left' || e.key == 'ArrowLeft') {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function updateScore() {
    score++;
    scoreEl.innerHTML = "Score: " + score;

    if(breakableBricksCount === 0) {
        currentStage++;
        if (currentStage < stages.length) {
            // Next stage
            initBricks();
            x = canvas.width / 2;
            y = canvas.height - 30;
            dx = 2;
            dy = -2;
            paddleX = (canvas.width - paddleWidth) / 2;
        } else {
            // Game win
            showGameWin();
        }
    }
}

function collisionDetection() {
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
            let b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    hitSound.play();
                    if (b.health < Infinity) {
                        b.health--;
                        if (b.health === 0) {
                            b.status = 0;
                            breakableBricksCount--; // Decrement breakableBricksCount here
                            if (userInteracted) breakSound.play(); // Play break sound only after user interaction
                            updateScore();
                        }
                    }
                }
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = '#ecf0f1';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = '#3498db';
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                let brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                let brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                if (bricks[c][r].health === Infinity) {
                    ctx.fillStyle = '#7f8c8d'; // Indestructible
                } else if (bricks[c][r].health === 2) {
                    ctx.fillStyle = '#bdc3c7'; // Hard
                } else {
                    ctx.fillStyle = bricks[c][r].color; // Normal
                }
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function showGameOver() {
    gameOverBox.style.display = 'block';
    gameRunning = false;
    bgm.pause();
    finalScoreOverEl.textContent = `Your Score: ${score}`;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('blockBreakerHighScore', highScore);
    }
    highScoreOverEl.textContent = `High Score: ${highScore}`;
}

function showGameWin() {
    gameWinBox.style.display = 'block';
    gameRunning = false;
    bgm.pause();
    finalScoreWinEl.textContent = `Your Score: ${score}`;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('blockBreakerHighScore', highScore);
    }
    highScoreWinEl.textContent = `High Score: ${highScore}`;
}

function draw() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();

    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
        if (userInteracted) hitSound.play();
    }
    if(y + dy < ballRadius) {
        dy = -dy;
        if (userInteracted) hitSound.play();
    } else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            // Change ball direction based on where it hits the paddle
            let impactPoint = x - (paddleX + paddleWidth / 2);
            let normalizedImpact = impactPoint / (paddleWidth / 2); // Value from -1 (left) to 1 (right)
            let maxDx = 5;
            dx = normalizedImpact * maxDx;
            dy = -dy; // Always bounce up
            if (userInteracted) hitSound.play();
        } else {
            if (userInteracted) loseSound.play();
            lives--;
            livesEl.innerHTML = "".padStart(lives, '❤️');
            if(!lives) {
                showGameOver();
            } else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }

    if(rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

// Start the game
// Use a user interaction to start the audio
document.body.addEventListener('click', () => {
    if (bgm.paused) {
        bgm.play().catch(e => console.error("BGM autoplay failed:", e));
        userInteracted = true;
    }
}, { once: true });

initBricks();
draw();