//iife module pattern to create anything gameboard related
const Gameboard = (() => {
  const board = Array(9).fill("");

  const resetBoard = () => board.fill("");

  const getBoard = () => board;

  // to print board to console
  const printBoard = () => {
    console.log(`${board[0]} | ${board[1]} | ${board[2]}`);
    console.log("---------");
    console.log(`${board[3]} | ${board[4]} | ${board[5]}`);
    console.log("---------");
    console.log(`${board[6]} | ${board[7]} | ${board[8]}`);
  };

  const setMove = (index, marker) => {
    if (board[index] === "") {
      board[index] = marker;
      return true;
    } else {
      console.log("Illegal Move");
      return false;
    }
  };

  return { getBoard, setMove, resetBoard, printBoard };
})();

// create player using factory function
const createPlayer = (name, marker) => {
  return { name, marker };
};

// game flow controller modules
const GameController = (() => {
  const board = Gameboard;
  const player1 = createPlayer("Player One", "X");
  const player2 = createPlayer("Player Two", "O");
  let activePlayer = player1;
  let gameOver = false;

  const changeTurn = () => {
    activePlayer = activePlayer === player1 ? player2 : player1;
  };

  const getActivePlayer = () => activePlayer;

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

  const checkWinner = () => {
    return winCondition.some((combo) => combo.every((index) => board.getBoard()[index] === activePlayer.marker));
  };

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn`);
  };

  const playRound = (index) => {
    if (gameOver || !board.setMove(index, activePlayer.marker)) {
      return;
    }

    if (checkWinner()) {
      gameOver = true;
      board.printBoard();
      console.log(`${activePlayer.name} wins`);
      return;
    }

    if (board.getBoard().every((cell) => cell != "")) {
      gameOver = true;
      board.printBoard();
      console.log("Is a tie!");
      return;
    }

    changeTurn();
    printNewRound();
  };

  const resetGame = () => {
    board.resetBoard();
    activePlayer = player1;
    gameOver = false;
    console.log("Game reset!");
    printNewRound();
  };
  return { printNewRound, getActivePlayer, playRound, resetGame };
})();

const game = GameController;

const DisplayController = (() => {})();
