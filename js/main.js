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

// Main game loop
function gameLoop() {

  const gameSpeed = gameSpeedInput.value;
  const snakeSpeed = 100 - gameSpeed * 8;
  const ballSpeed = parseFloat(gameSpeed) * 0.5;

  setTimeout(() => {
    clearCanvas();
    drawSnake();
    moveSnake();
    drawBall();
    moveBall(ballSpeed);
    checkBallSnakeCollision();
    gameLoop();
  }, snakeSpeed);
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

// Move the snake
function gameOver() {
  alert("Game Over");
  location.reload();
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

// Move the ball
function moveBall(speedMultiplier) {
  ball.x += ball.dx * speedMultiplier;
  ball.y += ball.dy * speedMultiplier;

  // Check for wall collisions
  if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
    ball.dx = -ball.dx;
  }

  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
    ball.dy = -ball.dy;
  }
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
document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;
  const A_KEY = 65;
  const D_KEY = 68;
  const W_KEY = 87;
  const S_KEY = 83;

  const keyPressed = event.keyCode;
  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;

  if ((keyPressed === LEFT_KEY || keyPressed === A_KEY) && !goingRight) {
    dx = -10;
    dy = 0;
  }

  if ((keyPressed === UP_KEY || keyPressed === W_KEY) && !goingDown) {
    dx = 0;
    dy = -10;
  }

  if ((keyPressed === RIGHT_KEY || keyPressed === D_KEY) && !goingLeft) {
    dx = 10;
    dy = 0;
  }

  if ((keyPressed === DOWN_KEY || keyPressed === S_KEY) && !goingUp) {
    dx = 0;
    dy = 10;
  }
}

gameLoop();
