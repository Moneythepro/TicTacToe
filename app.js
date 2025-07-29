const board = document.getElementById("board");
const statusText = document.getElementById("status");
const winnerModal = document.getElementById("winnerModal");
const winnerText = document.getElementById("winnerText");

let currentPlayer = "player1";
let gameState = Array(9).fill(null);
let gameActive = true;

const winSound = new Audio("win.mp3");
const drawSound = new Audio("draw.mp3");
const clickSound = new Audio("click.mp3");

const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function renderBoard() {
  board.innerHTML = "";
  gameState.forEach((cell, i) => {
    const div = document.createElement("div");
    div.classList.add("cell");
    if (cell) div.classList.add(cell);
    div.dataset.index = i;
    div.textContent = cell === "player1" ? "X" : cell === "player2" ? "O" : "";
    div.onclick = () => handleClick(i);
    board.appendChild(div);
  });
}

function handleClick(index) {
  if (!gameActive || gameState[index]) return;

  clickSound.currentTime = 0;
  clickSound.play();
  navigator.vibrate?.(30); // Safe optional chaining

  gameState[index] = currentPlayer;
  renderBoard();

  if (checkWinner()) {
    const winnerName = currentPlayer === "player1" ? "Player 1" : "Player 2";
    statusText.textContent = `${winnerName} Wins!`;
    winnerText.textContent = `${winnerName} Wins 🎉`;
    winnerModal.classList.remove("hidden");
    winSound.play();
    gameActive = false;
  } else if (gameState.every(Boolean)) {
    statusText.textContent = "Draw!";
    winnerText.textContent = "Draw!";
    winnerModal.classList.remove("hidden");
    drawSound.play();
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === "player1" ? "player2" : "player1";
    statusText.textContent = `${currentPlayer === "player1" ? "Player 1" : "Player 2"}'s Turn`;
  }
}

function checkWinner() {
  for (const [a, b, c] of winPatterns) {
    if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
      const cells = document.querySelectorAll(".cell");
      cells[a].classList.add("winner");
      cells[b].classList.add("winner");
      cells[c].classList.add("winner");
      return true;
    }
  }
  return false;
}

function resetGame() {
  gameState = Array(9).fill(null);
  gameActive = true;
  currentPlayer = "player1";
  statusText.textContent = "Player 1's Turn";
  winnerModal.classList.add("hidden");
  renderBoard();
}

renderBoard();
