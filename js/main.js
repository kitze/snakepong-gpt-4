const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gameSpeedInput = document.getElementById("gameSpeed");

const scoreDisplay = document.getElementById("score");

// Snake game variables
let snake = [
  { x: 200, y: 200 },
  { x: 190, y: 200 },
  { x: 180, y: 200 },
  { x: 170, y: 200 },
  { x: 160, y: 200 }
];
let dx = 10;
let dy = 0;

const obstacles = [];

function createObstacle() {
  const obstacle = {
    x: Math.floor(Math.random() * (canvas.width / 10)) * 10,
    y: Math.floor(Math.random() * (canvas.height / 10)) * 10,
    type: "bomb",
  };

  obstacles.push(obstacle);
}

function drawObstacles() {
  obstacles.forEach((obstacle) => {
    ctx.fillStyle = "red";
    ctx.fillRect(obstacle.x, obstacle.y, 10, 10);
  });
}

function checkSnakeObstacleCollision() {
  const head = snake[0];

  obstacles.forEach((obstacle) => {
    if (head.x === obstacle.x && head.y === obstacle.y) {
      if (obstacle.type === "bomb") {
        // If the snake collides with a bomb, it's game over
        gameOver();
      } else {
        // If the snake collides with a ramp, it jumps to the opposite side
        if (dx !== 0) {
          head.x = canvas.width - head.x;
        } else {
          head.y = canvas.height - head.y;
        }
      }
    }
  });
}


// Main game loop
let lastRender = performance.now();
let lastObstacleSpawn = performance.now();

function gameLoop(timestamp) {
  if (isGameOver) {
    return; // Do not update the game state when the game is over
  }
  const gameSpeed = getGameSpeed();
  const score = parseInt(scoreDisplay.textContent);
  const snakeSpeed = Math.max(20, 120 - score * 2 - gameSpeed * 8);
  const ballSpeed = parseFloat(gameSpeed) * 0.5;

  // Calculate the time since the last render
  const deltaTime = timestamp - lastRender;

  if (deltaTime >= snakeSpeed) {
    clearCanvas();
    drawSnake();
    moveSnake();
    drawBall();
    moveBall(timestamp);
    drawObstacles();
    checkBallSnakeCollision();
    checkSnakeObstacleCollision();

    // Update the last render timestamp
    lastRender = timestamp;
  }

  // Spawn a new obstacle every 5 seconds
  if (timestamp - lastObstacleSpawn >= 5000) {
    createObstacle();
    lastObstacleSpawn = timestamp;
  }

  // Use requestAnimationFrame for the game loop
  requestAnimationFrame(gameLoop);
}

// Clear the canvas
function clearCanvas() {
  ctx.fillStyle = 'black';
  ctx.strokeStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

// Draw the snake
function drawSnake() {
  for (let part of snake) {
    ctx.fillStyle = 'lightgreen';
    ctx.strokeStyle = 'darkgreen';
    ctx.fillRect(part.x, part.y, 10, 10);
    ctx.strokeRect(part.x, part.y, 10, 10);
  }
}


const restartButton = document.getElementById("restartButton");
restartButton.addEventListener("click", restartGame);

function restartGame() {
  // Hide the game over banner
  const gameOverBanner = document.getElementById("gameOverBanner");
  gameOverBanner.style.display = "none";

  // Reset the game state
  snake = [
    { x: 200, y: 200 },
    { x: 190, y: 200 },
    { x: 180, y: 200 },
    { x: 170, y: 200 },
    { x: 160, y: 200 },
  ];
  dx = 10;
  dy = 0;
  obstacles.length = 0;
  scoreDisplay.textContent = "0";
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = 4;
  ball.dy = 4;

  // Reset the game over state and lastRender
  isGameOver = false;
  lastRender = performance.now();

  // Restart the game loop
  requestAnimationFrame(gameLoop);
}
let isGameOver = false;

//append to array of high scores
function logHighScoreToLocalStorage(score) {
  const scores = JSON.parse(localStorage.getItem("highScores")) || [];
  scores.push(score);
  localStorage.setItem("highScores", JSON.stringify(scores));
}

// Move the snake
function gameOver() {
  isGameOver = true;
  clearCanvas();

  // Show the game over banner
  const gameOverBanner = document.getElementById("gameOverBanner");
  gameOverBanner.style.display = "block";

  // Display the final score

  const finalScore = document.getElementById("finalScore");
  finalScore.textContent = scoreDisplay.textContent;
  logHighScoreToLocalStorage(scoreDisplay.textContent);

}
function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  // Check if the snake is out of bounds
  if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
    gameOver();
    return;
  }

  snake.unshift(head);
  snake.pop();
}

// Pong game variables
const ball = { x: canvas.width / 2, y: canvas.height / 2, dx: 4, dy: 4, radius: 6 };


// Draw the ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.closePath();
}

let lastBallUpdate = performance.now();

let FIXED_GAME_SPEED = 5;

const getGameSpeed = () => {
  // return gameSpeedInput.value

  return FIXED_GAME_SPEED;
}
function moveBall(timestamp) {
  const gameSpeed = getGameSpeed();
  const ballSpeed = parseFloat(gameSpeed) * 2.5;

  // Calculate the time since the last ball update
  const deltaTime = timestamp - lastBallUpdate;

  ball.x += ball.dx * ballSpeed * deltaTime / 1000;
  ball.y += ball.dy * ballSpeed * deltaTime / 1000;

  // Check for wall collisions
  if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
    ball.dx = -ball.dx;
  }

  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
    ball.dy = -ball.dy;
  }

  // Update the last ball update timestamp
  lastBallUpdate = timestamp;
}


// Check for ball and snake collision
function checkBallSnakeCollision() {
  const head = snake[0];

  if (
    head.x < ball.x + ball.radius &&
    head.x + 10 > ball.x - ball.radius &&
    head.y < ball.y + ball.radius &&
    head.y + 10 > ball.y - ball.radius
  ) {
    // Move ball to a new random position
    ball.x = Math.random() * (canvas.width - 2 * ball.radius) + ball.radius;
    ball.y = Math.random() * (canvas.height - 2 * ball.radius) + ball.radius;

    // Increase snake length
    snake.push({});

    // Update score
    scoreDisplay.textContent = parseInt(scoreDisplay.textContent) + 1;
  }
}

const LEFT_KEY = 37;
const UP_KEY = 38;
const RIGHT_KEY = 39;
const DOWN_KEY = 40;
const A_KEY = 65;
const W_KEY = 87;
const D_KEY = 68;
const S_KEY = 83;

function resizeCanvas() {
  const canvas = document.getElementById('gameCanvas');
  const container = document.getElementById('gameContainer');
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  const padding = 0; // Adjust this value for the desired padding

  const targetAspectRatio = 4 / 3; // Desired aspect ratio (e.g., 4:3)
  const containerAspectRatio = (containerWidth - 2 * padding) / (containerHeight - 2 * padding);

  if (containerAspectRatio > targetAspectRatio) {
    canvas.height = containerHeight - 2 * padding;
    canvas.width = (containerHeight - 2 * padding) * targetAspectRatio;
  } else {
    canvas.width = containerWidth - 2 * padding;
    canvas.height = (containerWidth - 2 * padding) / targetAspectRatio;
  }

  canvas.style.padding = `${padding}px`;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();


// Update the canvas size when the window is resized
window.addEventListener('resize', resizeCanvas);

document.addEventListener("keydown", (event) => {
  const keyPressed = event.keyCode;

  if ((keyPressed === LEFT_KEY || keyPressed === A_KEY)) {
    changeDirection("LEFT");
  }

  if ((keyPressed === UP_KEY || keyPressed === W_KEY)) {
    changeDirection("UP");
  }

  if ((keyPressed === RIGHT_KEY || keyPressed === D_KEY)) {
    changeDirection("RIGHT");
  }

  if ((keyPressed === DOWN_KEY || keyPressed === S_KEY)) {
    changeDirection("DOWN");
  }
});

// const touchAreaUp = document.getElementById("touchAreaUp");
// const touchAreaDown = document.getElementById("touchAreaDown");
// const touchAreaLeft = document.getElementById("touchAreaLeft");
// const touchAreaRight = document.getElementById("touchAreaRight");
//
// touchAreaUp.addEventListener("touchstart", () => changeDirection("UP"));
// touchAreaDown.addEventListener("touchstart", () => changeDirection("DOWN"));
// touchAreaLeft.addEventListener("touchstart", () => changeDirection("LEFT"));
// touchAreaRight.addEventListener("touchstart", () => changeDirection("RIGHT"));


requestAnimationFrame(gameLoop);

function changeDirection(direction) {
  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;

  if (direction === "LEFT" && !goingRight) {
    dx = -10;
    dy = 0;
  }

  if (direction === "UP" && !goingDown) {
    dx = 0;
    dy = -10;
  }

  if (direction === "RIGHT" && !goingLeft) {
    dx = 10;
    dy = 0;
  }

  if (direction === "DOWN" && !goingUp) {
    dx = 0;
    dy = 10;
  }
}

gameLoop();

const showHighScoresButton = document.getElementById("showHighScoresButton");
const highScoresModal = document.getElementById("highScoresModal");
const closeHighScoresModal = document.getElementById("closeHighScoresModal");
const highScoresList = document.getElementById("highScoresList");

function showHighScores() {
  highScoresModal.style.display = "block";
  displayHighScores();
}

function hideHighScores() {
  highScoresModal.style.display = "none";
}

function displayHighScores() {
  const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
  highScoresList.innerHTML = "";

  //limit to 10 high scores, sort from highest to lowest, remove 0, display unique scores
  const filtered = highScores.filter((score, index, self) => {
    return index === self.indexOf(score);
  }).sort((a, b) => b - a).slice(0, 10);

  filtered.forEach((score, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = `#${index + 1}: ${score}`;
    highScoresList.appendChild(listItem);
  });
}

showHighScoresButton.addEventListener("click", showHighScores);
closeHighScoresModal.addEventListener("click", hideHighScores);
window.addEventListener("click", (event) => {
  if (event.target === highScoresModal) {
    hideHighScores();
  }
});

let touchStartX = null;
let touchStartY = null;
let touchEndX = null;
let touchEndY = null;
const swipeThreshold = 50;

function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
  touchEndX = event.touches[0].clientX;
  touchEndY = event.touches[0].clientY;
}

function handleTouchEnd() {
  if (touchStartX === null || touchStartY === null || touchEndX === null || touchEndY === null) {
    return;
  }

  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // Horizontal swipe
    if (deltaX > swipeThreshold) {
      changeDirection("RIGHT");
    } else if (deltaX < -swipeThreshold) {
      changeDirection("LEFT");
    }
  } else {
    // Vertical swipe
    if (deltaY > swipeThreshold) {
      changeDirection("DOWN");
    } else if (deltaY < -swipeThreshold) {
      changeDirection("UP");
    }
  }

  // Reset touch coordinates
  touchStartX = null;
  touchStartY = null;
  touchEndX = null;
  touchEndY = null;
}

document.addEventListener("touchstart", handleTouchStart);
document.addEventListener("touchmove", handleTouchMove);
document.addEventListener("touchend", handleTouchEnd);
