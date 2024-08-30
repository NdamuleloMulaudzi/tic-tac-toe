// Gameboard module to handle the game board state
const Gameboard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const setMark = (index, mark) => {
    if (board[index] === "") {
      board[index] = mark;
      return true;
    }
    return false;
  };

  const resetBoard = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  return { getBoard, setMark, resetBoard };
})();

// Player factory function to create players
const Player = (name, marker) => {
  return { name, marker };
};

// Game module to control the flow of the game
const Game = (() => {
  let players = [];
  let currentPlayerIndex = 0;
  let gameOver = false;

  const start = (player1Name, player2Name) => {
    players = [Player(player1Name, "X"), Player(player2Name, "O")];
    currentPlayerIndex = 0;
    gameOver = false;
    Gameboard.resetBoard();
    DisplayController.renderBoard();
    DisplayController.setMessage(`${players[currentPlayerIndex].name}'s turn`);
  };

  const playRound = (index) => {
    if (
      gameOver ||
      !Gameboard.setMark(index, players[currentPlayerIndex].marker)
    )
      return;

    DisplayController.renderBoard();

    if (checkWinner(players[currentPlayerIndex].marker)) {
      gameOver = true;
      DisplayController.setMessage(`${players[currentPlayerIndex].name} wins!`);
      DisplayController.showRestartButton();
    } else if (checkTie()) {
      gameOver = true;
      DisplayController.setMessage("It's a tie!");
      DisplayController.showRestartButton();
    } else {
      currentPlayerIndex = 1 - currentPlayerIndex;
      DisplayController.setMessage(
        `${players[currentPlayerIndex].name}'s turn`
      );
    }
  };

  const checkWinner = (marker) => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winningCombinations.some((combination) =>
      combination.every((index) => Gameboard.getBoard()[index] === marker)
    );
  };

  const checkTie = () => {
    return Gameboard.getBoard().every((cell) => cell !== "");
  };

  return { start, playRound };
})();

// DisplayController module to handle UI updates
const DisplayController = (() => {
  const cells = document.querySelectorAll(".cell");
  const messageElement = document.getElementById("game-message");
  const startButton = document.getElementById("start-button");
  const restartButton = document.getElementById("restart-button");
  const player1Input = document.getElementById("player1-name");
  const player2Input = document.getElementById("player2-name");

  cells.forEach((cell, index) => {
    cell.addEventListener("click", () => {
      Game.playRound(index);
    });
  });

  startButton.addEventListener("click", () => {
    const player1Name = player1Input.value || "Player 1";
    const player2Name = player2Input.value || "Player 2";
    Game.start(player1Name, player2Name);
    restartButton.style.display = "none";
  });

  restartButton.addEventListener("click", () => {
    const player1Name = player1Input.value || "Player 1";
    const player2Name = player2Input.value || "Player 2";
    Game.start(player1Name, player2Name);
    restartButton.style.display = "none";
  });

  const renderBoard = () => {
    const board = Gameboard.getBoard();
    cells.forEach((cell, index) => {
      cell.textContent = board[index];
    });
  };

  const setMessage = (message) => {
    messageElement.textContent = message;
  };

  const showRestartButton = () => {
    restartButton.style.display = "block";
  };

  return { renderBoard, setMessage, showRestartButton };
})();

Game.start("Player 1", "Player 2");
