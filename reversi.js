const BOARD_SIZE = 8;
const SQUARE_LENGTH = 100;
const EMPTY = 0;
const BLACK = 1;
const WHITE = -1;

var button = document.getElementById("a");
button.onclick = function () {
  newGame(WHITE);
};

var button2 = document.getElementById("b");
button2.onclick = function () {
  newGame(BLACK);
}

var button3 = document.getElementById("c");
button3.onclick = function () {
  newGame(null);
}

function getInitialBoard() {
  var initialBoard = [];
  for (var i = 0; i < BOARD_SIZE + 2; i++)
    initialBoard[i] = [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY];
  initialBoard[5][4] = BLACK;
  initialBoard[4][5] = BLACK;
  initialBoard[4][4] = WHITE;
  initialBoard[5][5] = WHITE;
  return initialBoard;
}

function fillCircle(x, y, r, color) {
  context.beginPath();
  context.arc(x, y, r, 0, 2 * Math.PI, true);
  context.fillStyle = color;
  context.fill();
}

function getBoardCoordinate(axis) {
  var rect = canvas.getBoundingClientRect();
  switch (axis) {
    case "x":
      return Math.ceil((event.pageX - rect.left) / SQUARE_LENGTH);
    case "y":
      return Math.ceil((event.pageY - rect.top) / SQUARE_LENGTH);
  }
}

var Reversi = function (board, turn) {
  this.board = board;
  this.turn = turn;
}

Reversi.prototype.drawDisks = function () {
  for (boardCoordinateX = 1; boardCoordinateX <= BOARD_SIZE; boardCoordinateX++)
    for (boardCoordinateY = 1; boardCoordinateY <= BOARD_SIZE; boardCoordinateY++)
      switch (this.board[boardCoordinateX][boardCoordinateY]) {
        case BLACK:
          fillCircle(SQUARE_LENGTH * (boardCoordinateX - 1 / 2) + 0.5, SQUARE_LENGTH * (boardCoordinateY - 1 / 2) + 0.5, 1 / 2 * SQUARE_LENGTH - 6, "black");
          break;
        case WHITE:
          fillCircle(SQUARE_LENGTH * (boardCoordinateX - 1 / 2) + 0.5, SQUARE_LENGTH * (boardCoordinateY - 1 / 2) + 0.5, 1 / 2 * SQUARE_LENGTH - 6, "white");
          break;
      }
}

Reversi.prototype.countFlippableDisksInEachDirection = function (directionX, directionY, boardCoordinateX, boardCoordinateY, turn) {
  if (this.board[boardCoordinateX][boardCoordinateY] == EMPTY) {
    var flippableDisksInEachDirection = 0;
    while (this.board[(flippableDisksInEachDirection + 1) * directionX + boardCoordinateX][(flippableDisksInEachDirection + 1) * directionY + boardCoordinateY] == -turn)
      flippableDisksInEachDirection++;
    if (flippableDisksInEachDirection >= 1 && this.board[(flippableDisksInEachDirection + 1) * directionX + boardCoordinateX][(flippableDisksInEachDirection + 1) * directionY + boardCoordinateY] == turn)
      return flippableDisksInEachDirection;
    return 0;
  }
}

Reversi.prototype.countFlippableDisks = function (boardCoordinateX, boardCoordinateY, turn) {
  return this.countFlippableDisksInEachDirection(0, -1, boardCoordinateX, boardCoordinateY, turn) + this.countFlippableDisksInEachDirection(1, -1, boardCoordinateX, boardCoordinateY, turn) + this.countFlippableDisksInEachDirection(1, 0, boardCoordinateX, boardCoordinateY, turn) + this.countFlippableDisksInEachDirection(1, 1, boardCoordinateX, boardCoordinateY, turn) + this.countFlippableDisksInEachDirection(0, 1, boardCoordinateX, boardCoordinateY, turn) + this.countFlippableDisksInEachDirection(-1, 1, boardCoordinateX, boardCoordinateY, turn) + this.countFlippableDisksInEachDirection(-1, 0, boardCoordinateX, boardCoordinateY, turn) + this.countFlippableDisksInEachDirection(-1, -1, boardCoordinateX, boardCoordinateY, turn);
}

Reversi.prototype.flipDisks = function (boardCoordinateX, boardCoordinateY) {
  for (directionX = -1; directionX <= 1; directionX++)
    for (directionY = -1; directionY <= 1; directionY++) {
      var flippableDisksInEachDirection = this.countFlippableDisksInEachDirection(directionX, directionY, boardCoordinateX, boardCoordinateY, this.turn);
      for (i = 1; i <= flippableDisksInEachDirection; i++)
        this.board[i * directionX + boardCoordinateX][i * directionY + boardCoordinateY] = this.turn;
    }
  this.board[boardCoordinateX][boardCoordinateY] = this.turn;
}

Reversi.prototype.countPuttablePositions = function (turn) {
  var puttablePositions = 0;
  for (boardCoordinateX = 1; boardCoordinateX <= BOARD_SIZE; boardCoordinateX++)
    for (boardCoordinateY = 1; boardCoordinateY <= BOARD_SIZE; boardCoordinateY++)
      if (this.countFlippableDisks(boardCoordinateX, boardCoordinateY, turn) > 0)
        puttablePositions++;
  return puttablePositions;
}

Reversi.prototype.countPuttablePositionsExceptAroundCorners = function (turn) {
  var puttablePositionsExceptAroundCorners = 0;
  for (boardCoordinateX = 1; boardCoordinateX <= BOARD_SIZE; boardCoordinateX++)
    for (boardCoordinateY = 1; boardCoordinateY <= BOARD_SIZE; boardCoordinateY++) {
      if ((boardCoordinateX == 1 && boardCoordinateY == 2) || (boardCoordinateX == 2 && boardCoordinateY == 1) || (boardCoordinateX == 1 && boardCoordinateY == 7) || (boardCoordinateX == 2 && boardCoordinateY == 8) || (boardCoordinateX == 7 && boardCoordinateY == 1) || (boardCoordinateX == 8 && boardCoordinateY == 2) || (boardCoordinateX == 7 && boardCoordinateY == 8) || (boardCoordinateX == 8 && boardCoordinateY == 7) || (boardCoordinateX == 2 && boardCoordinateY == 2) || (boardCoordinateX == 2 && boardCoordinateY == 7) || (boardCoordinateX == 7 && boardCoordinateY == 2) || (boardCoordinateX == 7 && boardCoordinateY == 7))
        continue;
      if (this.countFlippableDisks(boardCoordinateX, boardCoordinateY, turn) > 0)
        puttablePositionsExceptAroundCorners++;
    }
  return puttablePositionsExceptAroundCorners;
}

Reversi.prototype.pass = function () {
  if (this.countPuttablePositions(this.turn) == 0)
    this.turn = -this.turn
}

Reversi.prototype.alertPassMessage = function () {
  if (this.countPuttablePositions(this.turn) == 0 && this.countPuttablePositions(-this.turn) != 0)
    return alert("打てる場所がないのでパスされました。");
}

Reversi.prototype.countDisks = function (color) {
  var black = 0;
  var white = 0;
  for (boardCoordinateX = 1; boardCoordinateX <= BOARD_SIZE; boardCoordinateX++)
    for (boardCoordinateY = 1; boardCoordinateY <= BOARD_SIZE; boardCoordinateY++)
      switch (this.board[boardCoordinateX][boardCoordinateY]) {
        case BLACK:
          black++;
          break;
        case WHITE:
          white++;
          break;
      }
  switch (color) {
    case "black":
      return black;
    case "white":
      return white;
  }
}

Reversi.prototype.alertResultMessage = function () {
  if (this.countDisks("black") > this.countDisks("white"))
    return alert(String(this.countDisks("black")) + "対" + String(this.countDisks("white")) + "で黒の勝ちです！");
  if (this.countDisks("black") < this.countDisks("white"))
    return alert(String(this.countDisks("black")) + "対" + String(this.countDisks("white")) + "で白の勝ちです！");
  if (this.countDisks("black") == this.countDisks("white"))
    return alert(String(this.countDisks("white")) + "対" + String(this.countDisks("black")) + "の引き分けです！");
}

Reversi.prototype.moveByAi = function () {
  this.flipDisksByAi();
  this.drawDisks();
  this.turn = -this.turn;
  this.alertPassMessage();
  this.pass();
}

Reversi.prototype.flipDisksByAi = function () {
  var self = this;
  var flag = true;

  function flipDisksAccordingToPuttablePositionsByOpponent(boardCoordinateX, boardCoordinateY, puttablePositionsByOpponent) {
    var reversiVirtual = new Reversi(copyMultidimentionalArray(self.board), self.turn);
    if (flag && reversiVirtual.countFlippableDisks(boardCoordinateX, boardCoordinateY, reversiVirtual.turn) > 0) {
      reversiVirtual.flipDisks(boardCoordinateX, boardCoordinateY);
      reversiVirtual.turn = -reversiVirtual.turn;
      if (reversiVirtual.countPuttablePositionsExceptAroundCorners(reversiVirtual.turn) == puttablePositionsByOpponent && (reversiVirtual.countFlippableDisks(1, 1, reversiVirtual.turn) == 0 || reversiVirtual.board[1][1] != EMPTY) && (reversiVirtual.countFlippableDisks(1, 8, reversiVirtual.turn) == 0 || reversiVirtual.board[1][8] != EMPTY) && (reversiVirtual.countFlippableDisks(8, 1, reversiVirtual.turn) == 0 || reversiVirtual.board[8][1] != EMPTY) && (reversiVirtual.countFlippableDisks(8, 8, reversiVirtual.turn) == 0 || reversiVirtual.board[8][8] != EMPTY)) {
        self.flipDisks(boardCoordinateX, boardCoordinateY);
        flag = false;
      }
    }
  }

  function copyMultidimentionalArray(array) {
    var newArray = [];
    for (var i = 0; i < array.length; i++) {
      if (Array.isArray(array[i])) {
        newArray[i] = copyMultidimentionalArray(array[i]);
      } else {
        newArray[i] = array[i];
      }
    }
    return newArray;
  }

  function flipDisksIfCanPut(boardCoordinateX, boardCoordinateY) {
    if (flag && self.countFlippableDisks(boardCoordinateX, boardCoordinateY, self.turn) > 0) {
      self.flipDisks(boardCoordinateX, boardCoordinateY);
      flag = false;
    }
  }

  function setPriority(flipDisksByAi, flag, n) {
    if (self.board[1][1] != EMPTY) {
      flipDisksByAi(1, 2, n);
      flipDisksByAi(2, 1, n);
      flipDisksByAi(2, 2, n);
    }
    if (self.board[1][8] != EMPTY) {
      flipDisksByAi(1, 7, n);
      flipDisksByAi(2, 8, n);
      flipDisksByAi(2, 7, n);
    }
    if (self.board[8][1] != EMPTY) {
      flipDisksByAi(7, 1, n);
      flipDisksByAi(8, 2, n);
      flipDisksByAi(7, 2, n);
    }
    if (self.board[1][1] != EMPTY) {
      flipDisksByAi(7, 8, n);
      flipDisksByAi(8, 7, n);
      flipDisksByAi(7, 7, n);
    }
    flipDisksByAi(1, 1, n);
    flipDisksByAi(1, 8, n);
    flipDisksByAi(8, 1, n);
    flipDisksByAi(8, 8, n);
    flipDisksByAi(3, 3, n);
    flipDisksByAi(3, 6, n);
    flipDisksByAi(6, 3, n);
    flipDisksByAi(6, 6, n);
    flipDisksByAi(3, 4, n);
    flipDisksByAi(3, 5, n);
    flipDisksByAi(4, 3, n);
    flipDisksByAi(5, 3, n);
    flipDisksByAi(4, 6, n);
    flipDisksByAi(5, 6, n);
    flipDisksByAi(6, 4, n);
    flipDisksByAi(6, 5, n);
    flipDisksByAi(1, 3, n);
    flipDisksByAi(1, 6, n);
    flipDisksByAi(3, 1, n);
    flipDisksByAi(6, 1, n);
    flipDisksByAi(3, 8, n);
    flipDisksByAi(6, 8, n);
    flipDisksByAi(8, 3, n);
    flipDisksByAi(8, 6, n);
    flipDisksByAi(1, 4, n);
    flipDisksByAi(1, 5, n);
    flipDisksByAi(4, 1, n);
    flipDisksByAi(5, 1, n);
    flipDisksByAi(4, 8, n);
    flipDisksByAi(5, 8, n);
    flipDisksByAi(8, 4, n);
    flipDisksByAi(8, 5, n);
    flipDisksByAi(2, 3, n);
    flipDisksByAi(2, 4, n);
    flipDisksByAi(2, 5, n);
    flipDisksByAi(2, 6, n);
    flipDisksByAi(3, 2, n);
    flipDisksByAi(4, 2, n);
    flipDisksByAi(5, 2, n);
    flipDisksByAi(6, 2, n);
    flipDisksByAi(3, 7, n);
    flipDisksByAi(4, 7, n);
    flipDisksByAi(5, 7, n);
    flipDisksByAi(6, 7, n);
    flipDisksByAi(7, 3, n);
    flipDisksByAi(7, 4, n);
    flipDisksByAi(7, 5, n);
    flipDisksByAi(7, 6, n);
    if (flag) {
      flipDisksByAi(1, 2, n);
      flipDisksByAi(2, 1, n);
      flipDisksByAi(1, 7, n);
      flipDisksByAi(2, 8, n);
      flipDisksByAi(7, 1, n);
      flipDisksByAi(8, 2, n);
      flipDisksByAi(7, 8, n);
      flipDisksByAi(8, 7, n);
      flipDisksByAi(2, 2, n);
      flipDisksByAi(2, 7, n);
      flipDisksByAi(7, 2, n);
      flipDisksByAi(7, 7, n);
    }
  }

  setPriority(flipDisksAccordingToPuttablePositionsByOpponent, true, 0);
  for (puttablePositionsByOpponent = 1; puttablePositionsByOpponent <= 12; puttablePositionsByOpponent++) {
    setPriority(flipDisksAccordingToPuttablePositionsByOpponent, false, puttablePositionsByOpponent);
  }
  setPriority(flipDisksIfCanPut, true);
}

var canvas = document.getElementById("reversiCanvas");
var context = canvas.getContext("2d");

function newGame(aiTurn) {
  var reversi = new Reversi(getInitialBoard(), BLACK);
  context.fillStyle = "rgb(10, 160, 22)";
  context.fillRect(0, 0, 800.5, 800.5);
  context.beginPath();
  for (var i = 1; i < BOARD_SIZE; i++) {
    context.moveTo(SQUARE_LENGTH * i + 0.5, 0);
    context.lineTo(SQUARE_LENGTH * i + 0.5, SQUARE_LENGTH * BOARD_SIZE + 0.5);
    context.moveTo(0, SQUARE_LENGTH * i + 0.5);
    context.lineTo(SQUARE_LENGTH * BOARD_SIZE + 0.5, SQUARE_LENGTH * i + 0.5);
  }
  context.stroke();
  fillCircle(2 * SQUARE_LENGTH + 0.5, 2 * SQUARE_LENGTH + 0.5, 3, "black");
  fillCircle(2 * SQUARE_LENGTH + 0.5, 6 * SQUARE_LENGTH + 0.5, 3, "black");
  fillCircle(6 * SQUARE_LENGTH + 0.5, 2 * SQUARE_LENGTH + 0.5, 3, "black");
  fillCircle(6 * SQUARE_LENGTH + 0.5, 6 * SQUARE_LENGTH + 0.5, 3, "black");
  reversi.drawDisks();
  if (reversi.turn == aiTurn)
    setTimeout(function () {
      reversi.moveByAi();
    }, 200);

  canvas.onclick = function () {
    var boardCoordinateX_Clicked = getBoardCoordinate("x");
    var boardCoordinateY_Clicked = getBoardCoordinate("y");
    if (reversi.countFlippableDisks(boardCoordinateX_Clicked, boardCoordinateY_Clicked, reversi.turn) > 0) {
      reversi.flipDisks(boardCoordinateX_Clicked, boardCoordinateY_Clicked);
      reversi.drawDisks();
      reversi.turn = -reversi.turn
      reversi.alertPassMessage();
      reversi.pass();
      setTimeout(function () {
        while (reversi.turn == aiTurn && reversi.countPuttablePositions(reversi.turn) > 0)
          reversi.moveByAi();
        if (reversi.countPuttablePositions(reversi.turn) == 0)
          reversi.alertResultMessage();
      }, 200);
    }
  }
}

newGame(WHITE);
