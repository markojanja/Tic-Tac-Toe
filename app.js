const Player = (name, mark) => {
  return { name, mark };
};

const gameController = (() => {
  const boxes = document.querySelectorAll(".box");
  let switchPlayer = false;
  let currentPlayer = null;
  const PLAYER_X = Player("Player X", "X");
  const PLAYER_O = Player("PLayer O", "O");

  const switchPlayerTurn = () => {
    switchPlayer = !switchPlayer;
    displayController.setPlayerName(getCurrentPlayer());
  };

  const getCurrentPlayer = () => {
    currentPlayer = switchPlayer ? PLAYER_O.mark : PLAYER_X.mark;

    return currentPlayer;
  };

  // check for the win
  const gameHasWinner = () => {
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 4, 8],
      [2, 4, 6],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
    ];
    return winningCombos.some((combo) => {
      return combo.every((index) => {
        return [...boxes][index].textContent.includes(currentPlayer);
      });
    });
  };
  //check if game is a draw
  const gameIsDraw = () => {
    return [...boxes].every((box) => {
      return box.textContent !== "";
    });
  };

  const handleClick = (e) => {
    let box = e.target;
    displayController.setMark(switchPlayer, box, PLAYER_O, PLAYER_X);
    currentPlayer = switchPlayer ? PLAYER_O.mark : PLAYER_X.mark;
    getCurrentPlayer();
    gameHasWinner() ? getWinner(currentPlayer) : false;
    gameIsDraw() ? getDraw() : false;
    switchPlayerTurn();
  };

  const getWinner = (player) => {
    displayController.displayModal();
    player === PLAYER_X.mark
      ? displayController.setModalMessage(PLAYER_X.name)
      : displayController.setModalMessage(PLAYER_O.name);
  };
  const getDraw = () => {
    displayController.displayModal();
    displayController.setModalDrawMessage();
  };

  const disableClick = () => {
    boxes.forEach((box) => {
      box.removeEventListener("click", handleClick);
    });
  };
  const resetGame = () => {
    switchPlayer = false;
    currentPlayer = null;
    disableClick();
  };

  return { boxes, handleClick, disableClick, getCurrentPlayer, resetGame };
})();

const displayController = (() => {
  const board = gameController.boxes;
  board.forEach((box) => {
    box.addEventListener("click", gameController.handleClick, {
      once: true,
    });
  });

  const setMark = (switchPlayers, box, player1, player2) => {
    switchPlayers
      ? (box.textContent = player1.mark)
      : (box.textContent = player2.mark);
    switchPlayers
      ? (box.style.color = "#ef4444")
      : (box.style.color = "#10b981");
  };

  const displayModal = () => {
    const modalContainer = document.querySelector(".modal-container");
    modalContainer.style.display = "flex";
  };

  const setModalMessage = (player) => {
    const message = document.getElementById("modal-msg");
    message.textContent = `${player} has won`;
    gameController.disableClick();
  };

  const setModalDrawMessage = () => {
    const message = document.getElementById("modal-msg");
    message.textContent = "It's a tie game";
    gameController.disableClick();
  };

  const closeModal = () => {
    const btn = document.querySelector(".modal-btn");
    const modalContainer = document.querySelector(".modal-container");
    btn.addEventListener("click", () => {
      gameController.resetGame();
      modalContainer.style.display = "none";
      board.forEach((box) => {
        box.addEventListener("click", gameController.handleClick, {
          once: true,
        });
        setPlayerName(gameController.getCurrentPlayer());
        box.textContent = "";
      });
    });
  };

  const setPlayerName = (player) => {
    const currentPlayer = document.getElementById("current_player");

    currentPlayer.textContent = `Player ${player} turn!`;
  };

  setPlayerName(gameController.getCurrentPlayer());
  closeModal();

  return {
    setPlayerName,
    setMark,
    displayModal,
    setModalMessage,
    setModalDrawMessage,
  };
})();
