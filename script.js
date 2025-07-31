const cells = document.querySelectorAll('.cell');
const status = document.getElementById('status');
const resetButton = document.getElementById('reset');
const winLine = document.getElementById('win-line');

let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameActive = true;

const winningConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function handleClick(event) {
  const index = event.target.dataset.index;
  if (board[index] || !gameActive || currentPlayer !== 'X') return;  // Prevent clicks during AI turn

  board[index] = currentPlayer;
  event.target.textContent = currentPlayer;
  event.target.classList.add(currentPlayer.toLowerCase());

  if (checkWin(currentPlayer)) {
    status.textContent = ${currentPlayer} wins!;
    gameActive = false;
    drawWinningLine();
    return;
  }

  if (board.every(cell => cell)) {
    status.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = 'O';
  status.textContent = AI (O)'s turn;

  // Trigger AI move after a short delay for better UX
  setTimeout(aiMove, 500);  // 0.5 second delay to simulate "thinking"
}

function checkWin(player) {
  for (let condition of winningConditions) {
    if (condition.every(index => board[index] === player)) {
      winningCondition = condition;  // Store the winning combo for line drawing
      return true;
    }
  }
  return false;
}

function resetGame() {
  board = Array(9).fill(null);
  currentPlayer = 'X';
  gameActive = true;
  status.textContent = Player ${currentPlayer}'s turn;
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('x', 'o');
  });
  winLine.innerHTML = '';  // Clear the winning line
}

// Simple Random AI (Beatable)
function aiMove() {
  if (!gameActive) return;

  // Find all empty cells
  let emptyCells = [];
  for (let i = 0; i < board.length; i++) {
    if (!board[i]) emptyCells.push(i);
  }

  // Pick a random empty cell
  if (emptyCells.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const move = emptyCells[randomIndex];

    board[move] = 'O';
    cells[move].textContent = 'O';
    cells[move].classList.add('o');
  }

  if (checkWin('O')) {
    status.textContent = 'AI (O) wins!';
    gameActive = false;
    drawWinningLine();
    return;
  }

  if (board.every(cell => cell)) {
    status.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = 'X';
  status.textContent = Player ${currentPlayer}'s turn;
}

// Draw green line connecting the winning spots
function drawWinningLine() {
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  const [start, , end] = winningCondition;  // Get start and end indices of the win combo
  const startCell = cells[start].getBoundingClientRect();
  const endCell = cells[end].getBoundingClientRect();
  const boardRect = document.getElementById('board').getBoundingClientRect();

  // Calculate relative positions
  const x1 = startCell.left - boardRect.left + startCell.width / 2;
  const y1 = startCell.top - boardRect.top + startCell.height / 2;
  const x2 = endCell.left - boardRect.left + endCell.width / 2;
  const y2 = endCell.top - boardRect.top + endCell.height / 2;

  line.setAttribute('x1', x1);
  line.setAttribute('y1', y1);
  line.setAttribute('x2', x2);
  line.setAttribute('y2', y2);

  winLine.appendChild(line);
}

let winningCondition;  // To store the winning combo

cells.forEach(cell => cell.addEventListener('click', handleClick));
resetButton.addEventListener('click', resetGame);
