document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("board");
  const statusDisplay = document.getElementById("status");
  const resetButton = document.getElementById("resetBtn");
  const toggleModeButton = document.getElementById("toggleModeBtn");

  let gameActive = true;
  let currentPlayer = "X";
  let gameState = ["", "", "", "", "", "", "", "", ""];
  let playAgainstAI = false;

  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const handleCellPlayed = (clickedCell, clickedCellIndex) => {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
    clickedCell.classList.add(currentPlayer);
  };

  const handlePlayerChange = () => {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = `It's ${currentPlayer}'s turn`;
  };

  const handleResultValidation = () => {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
      const winCondition = winningConditions[i];
      let a = gameState[winCondition[0]];
      let b = gameState[winCondition[1]];
      let c = gameState[winCondition[2]];
      if (a === "" || b === "" || c === "") {
        continue;
      }
      if (a === b && b === c) {
        roundWon = true;
        break;
      }
    }

    if (roundWon) {
      statusDisplay.innerHTML = `Player ${currentPlayer} has won!`;
      gameActive = false;
      return;
    }

    let roundDraw = !gameState.includes("");
    if (roundDraw) {
      statusDisplay.innerHTML = `Game ended in a draw!`;
      gameActive = false;
      return;
    }

    handlePlayerChange();
  };

  const handleCellClick = (clickedCellEvent) => {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute("data-index"));

    if (gameState[clickedCellIndex] !== "" || !gameActive) {
      return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();

    if (playAgainstAI && gameActive) {
      handleAIMove();
    }
  };

  const handleAIMove = () => {
    let availableCells = gameState
      .map((cell, index) => (cell === "" ? index : null))
      .filter((index) => index !== null);
    let randomIndex =
      availableCells[Math.floor(Math.random() * availableCells.length)];
    let randomCell = document.querySelector(
      `.cell[data-index='${randomIndex}']`
    );

    handleCellPlayed(randomCell, randomIndex);
    handleResultValidation();
  };

  const handleRestartGame = () => {
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = `It's ${currentPlayer}'s turn`;
    document.querySelectorAll(".cell").forEach((cell) => {
      cell.innerHTML = "";
      cell.classList.remove("X");
      cell.classList.remove("O");
    });
  };

  const toggleMode = () => {
    playAgainstAI = !playAgainstAI;
    toggleModeButton.innerHTML = playAgainstAI
      ? "Play Against Human"
      : "Play Against AI";
    handleRestartGame();
  };

  document
    .querySelectorAll(".cell")
    .forEach((cell) => cell.addEventListener("click", handleCellClick));
  resetButton.addEventListener("click", handleRestartGame);
  toggleModeButton.addEventListener("click", toggleMode);

  statusDisplay.innerHTML = `It's ${currentPlayer}'s turn`;
});
