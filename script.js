// Gameboard Module (handles the game board state)
const Gameboard = (() => {
  const board = Array(9).fill(""); // Initialize 3x3 board

  const resetBoard = () => board.fill(""); // Reset the board to empty

  const getBoard = () => board;

  const setMove = (index, marker) => {
    if (board[index] === "") {
      board[index] = marker;
      return true;
    } else {
      return false; // Invalid move
    }
  };

  return { getBoard, setMove, resetBoard };
})();

// Player creation factory function
const createPlayer = (name, marker) => {
  return { name, marker };
};

// Display Controller (handles DOM updates and announcements)
const DisplayController = (() => {
  const announceElement = document.querySelector(".announce");
  const boardContainer = document.querySelector(".board");
  const startGameButton = document.getElementById("start-game");
  const restartGameButton = document.getElementById("restart-game");

  // Set the announcement message
  const setAnnounce = (message) => {
    announceElement.textContent = message;
  };

  const updateBoard = () => {
    boardContainer.innerHTML = ""; // Clear previous board

    Gameboard.getBoard().forEach((cell, index) => {
      const cellDiv = document.createElement("div");
      cellDiv.classList.add("cell");
      cellDiv.id = `cell-${index}`;
      cellDiv.textContent = cell;
      cellDiv.addEventListener("click", () => GameController.playRound(index));
      boardContainer.appendChild(cellDiv);
    });
  };

  const toggleSections = (showGame) => {
    if (showGame) {
      // Show the game section and hide the header
      document.querySelector("header").style.display = "none";
      document.querySelector("main").style.display = "flex";
    } else {
      // Show the header and hide the game section
      document.querySelector("header").style.display = "flex";
      document.querySelector("main").style.display = "none";
    }
  };

  const updatePlayerNames = (player1Name, player2Name) => {
    document.querySelector(".player1").textContent = `${player1Name} (X)`;
    document.querySelector(".player2").textContent = `${player2Name} (O)`;
  };

  return {
    setAnnounce,
    updateBoard,
    toggleSections,
    updatePlayerNames, // Expose this method for use
    startGameButton,
    restartGameButton,
  };
})();

// Game Controller (handles the game logic)
const GameController = (() => {
  let player1, player2, activePlayer, gameOver;

  const winCondition = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const startGame = (player1Name, player2Name) => {
    // Create players with names from input
    player1 = createPlayer(player1Name || "Player 1", "X");
    player2 = createPlayer(player2Name || "Player 2", "O");
    activePlayer = player1;
    gameOver = false;

    // Hide the header and show the game
    DisplayController.toggleSections(true);

    // Update player names in the DOM
    DisplayController.updatePlayerNames(player1.name, player2.name);

    Gameboard.resetBoard();
    DisplayController.updateBoard();
    DisplayController.setAnnounce(`${activePlayer.name}'s turn!`);
  };

  const playRound = (index) => {
    if (gameOver || !Gameboard.setMove(index, activePlayer.marker)) {
      DisplayController.setAnnounce("Illegal Move!");
      return;
    }

    DisplayController.updateBoard(); // Update the board after the move

    if (checkWinner()) {
      gameOver = true;
      DisplayController.setAnnounce(`${activePlayer.name} wins!`);
      return;
    }

    if (Gameboard.getBoard().every((cell) => cell !== "")) {
      gameOver = true;
      DisplayController.setAnnounce("It's a tie!");
      return;
    }

    activePlayer = activePlayer === player1 ? player2 : player1;
    DisplayController.setAnnounce(`${activePlayer.name}'s turn!`);
  };

  const checkWinner = () => {
    return winCondition.some((combo) => combo.every((index) => Gameboard.getBoard()[index] === activePlayer.marker));
  };

  const resetGame = () => {
    Gameboard.resetBoard();
    activePlayer = player1;
    gameOver = false;
    DisplayController.toggleSections(false);
    DisplayController.setAnnounce("Game reset! Start a new game.");
  };

  return { startGame, playRound, resetGame };
})();

// Event listeners for buttons
DisplayController.startGameButton.addEventListener("click", () => {
  const player1Name = document.getElementById("p1-name").value;
  const player2Name = document.getElementById("p2-name").value;

  // Start the game with player names
  GameController.startGame(player1Name, player2Name);
});

DisplayController.restartGameButton.addEventListener("click", () => {
  GameController.resetGame();
});
