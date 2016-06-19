const BOARD_SIZE = 8;
const SQUARE_LENGTH = 100;
const ANTI_ANTI_ALIASING = 0.5;
//空白を0、黒（先手）を1、白（後手）を-1とする。-1をかけることによってターンの切り替えを表現する。
const EMPTY = 0;
const BLACK = 1;
const WHITE = -1;

/***********************************
 * Reversiオブジェクトのプロパティ・メソッド
 ***********************************/
//各マス目の状態を表す二次元配列boardと黒か白のターンを表すturnをプロパティとする。
var Reversi = function (board, turn) {
  this.board = board;
  this.turn = turn;
}

//配列boardの値に従って石を黒か白に描画する。
Reversi.prototype.drawDisks = function () {
  for (boardCoordinateX = 1; boardCoordinateX <= BOARD_SIZE; boardCoordinateX++)
    for (boardCoordinateY = 1; boardCoordinateY <= BOARD_SIZE; boardCoordinateY++)
      switch (this.board[boardCoordinateX][boardCoordinateY]) {
        case BLACK:
          fillCircle(SQUARE_LENGTH * (boardCoordinateX - 1 / 2) + ANTI_ANTI_ALIASING, SQUARE_LENGTH * (boardCoordinateY - 1 / 2) + ANTI_ANTI_ALIASING, 1 / 2 * SQUARE_LENGTH - 6, "black");
          break;
        case WHITE:
          fillCircle(SQUARE_LENGTH * (boardCoordinateX - 1 / 2) + ANTI_ANTI_ALIASING, SQUARE_LENGTH * (boardCoordinateY - 1 / 2) + ANTI_ANTI_ALIASING, 1 / 2 * SQUARE_LENGTH - 6, "white");
          break;
      }
}

//特定のマス目board[boardCoordinateX][boardCoordinateY]の周囲8方向のいずれかの方向についてひっくり返せる石がいくつあるか数える。directionX,directionYを-1から1の範囲で組み合せる（ただしdirectionX == 0 && directionY == 0を除く）ことによって、方向を指定する。
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

//特定のマス目board[boardCoordinateX][boardCoordinateY]に石を置いたときにひっくり返せる石がいくつあるか数える。ountFlippableDisksInEachDirectionの返り値を8方向について足し合せている。
Reversi.prototype.countFlippableDisks = function (boardCoordinateX, boardCoordinateY, turn) {
  return this.countFlippableDisksInEachDirection(0, -1, boardCoordinateX, boardCoordinateY, turn) + this.countFlippableDisksInEachDirection(1, -1, boardCoordinateX, boardCoordinateY, turn) + this.countFlippableDisksInEachDirection(1, 0, boardCoordinateX, boardCoordinateY, turn) + this.countFlippableDisksInEachDirection(1, 1, boardCoordinateX, boardCoordinateY, turn) + this.countFlippableDisksInEachDirection(0, 1, boardCoordinateX, boardCoordinateY, turn) + this.countFlippableDisksInEachDirection(-1, 1, boardCoordinateX, boardCoordinateY, turn) + this.countFlippableDisksInEachDirection(-1, 0, boardCoordinateX, boardCoordinateY, turn) + this.countFlippableDisksInEachDirection(-1, -1, boardCoordinateX, boardCoordinateY, turn);
}

//石をひっくり返す。特定のマス目board[boardCoordinateX][boardCoordinateY]の周囲8方向について、countFlippableDisksInEachDirectionの返り値の数だけ現在のターンを代入している。
Reversi.prototype.flipDisks = function (boardCoordinateX, boardCoordinateY) {
  for (directionX = -1; directionX <= 1; directionX++)
    for (directionY = -1; directionY <= 1; directionY++) {
      var flippableDisksInEachDirection = this.countFlippableDisksInEachDirection(directionX, directionY, boardCoordinateX, boardCoordinateY, this.turn);
      for (i = 1; i <= flippableDisksInEachDirection; i++)
        this.board[i * directionX + boardCoordinateX][i * directionY + boardCoordinateY] = this.turn;
    }
  this.board[boardCoordinateX][boardCoordinateY] = this.turn;
}

//石を置けるマス目がいくつあるか数える。ゲーム終了判定のために、現在と逆のターンについても調べられるようにしている。
Reversi.prototype.countPuttablePositions = function (turn) {
  var puttablePositions = 0;
  for (boardCoordinateX = 1; boardCoordinateX <= BOARD_SIZE; boardCoordinateX++)
    for (boardCoordinateY = 1; boardCoordinateY <= BOARD_SIZE; boardCoordinateY++)
      if (this.countFlippableDisks(boardCoordinateX, boardCoordinateY, turn) > 0)
        puttablePositions++;
  return puttablePositions;
}

//打てるマス目が無いときに、ターンを逆にする（パスする）。
Reversi.prototype.pass = function () {
  if (this.countPuttablePositions(this.turn) == 0)
    this.turn = -this.turn
}

//打てるマス目が無いときに、パスのメッセージを表示する。ただし、ゲーム終了時（逆のターンでもパスとなる時）には表示しない。
Reversi.prototype.alertPassMessage = function () {
  if (this.countPuttablePositions(this.turn) == 0 && this.countPuttablePositions(-this.turn) != 0)
    return alert("打てる場所がないのでパスされました。");
}

//黒か白について、盤面に石がいくつあるか数える。
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

//ゲーム終了時のメッセージを表示する。
Reversi.prototype.alertResultMessage = function () {
  if (this.countDisks("black") > this.countDisks("white"))
    return alert(String(this.countDisks("black")) + "対" + String(this.countDisks("white")) + "で黒の勝ちです！");
  if (this.countDisks("black") < this.countDisks("white"))
    return alert(String(this.countDisks("black")) + "対" + String(this.countDisks("white")) + "で白の勝ちです！");
  if (this.countDisks("black") == this.countDisks("white"))
    return alert(String(this.countDisks("white")) + "対" + String(this.countDisks("black")) + "の引き分けです！");
}

/***********************************
 * その他関数定義
 ***********************************/
//初期の盤面を二次元配列で表現する。マス目の座標と配列の座標の値を一致させるため、また、駒をひっくり返す関数を正しく機能させるために、8 * 8ではなく一辺ずつ余裕をもたせた10 * 10の配列としている。
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

//円を描画する。
function fillCircle(x, y, r, color) {
  context.beginPath();
  context.arc(x, y, r, 0, 2 * Math.PI, true);
  context.fillStyle = color;
  context.fill();
}

//マス目の座標を取得する。event.pageX/Yはブラウザの絶対座標のため、canvas要素の矩形オブジェクトの座標を基準とした総体座標をマス目の長さで割り、切り上げることにっよて、1から8までの整数の座標を取得している。
function getBoardCoordinate(axis) {
  var rect = canvas.getBoundingClientRect();
  switch (axis) {
    case "x":
      return Math.ceil((event.pageX - rect.left) / SQUARE_LENGTH);
    case "y":
      return Math.ceil((event.pageY - rect.top) / SQUARE_LENGTH);
  }
}

/***********************************
 * オセロ実行
 ***********************************/
//canvas要素を取得した後、その二次元の描画コンテクストを取得する。
var canvas = document.getElementById("reversiCanvas");
var context = canvas.getContext("2d");
//Reversiオブジェクトのインスタンスをゲーム開始時の状態で生成する。
var reversi = new Reversi(getInitialBoard(), BLACK);
//マス目を区切る線を描画する。アンチエイリアシングによって1pxの線が2pxの薄い線になってしまうのを避けるために+o.5（ANTI_ANTI_ALIASING）している。
context.beginPath();
for (var i = 1; i < BOARD_SIZE; i++) {
  context.moveTo(SQUARE_LENGTH * i + ANTI_ANTI_ALIASING, 0);
  context.lineTo(SQUARE_LENGTH * i + ANTI_ANTI_ALIASING, SQUARE_LENGTH * BOARD_SIZE + ANTI_ANTI_ALIASING);
  context.moveTo(0, SQUARE_LENGTH * i + ANTI_ANTI_ALIASING);
  context.lineTo(SQUARE_LENGTH * BOARD_SIZE + ANTI_ANTI_ALIASING, SQUARE_LENGTH * i + ANTI_ANTI_ALIASING);
}
context.stroke();
//オセロ盤面のボックスの範囲を示す4つの小さな黒点を描画する。
fillCircle(2 * SQUARE_LENGTH + ANTI_ANTI_ALIASING, 2 * SQUARE_LENGTH + ANTI_ANTI_ALIASING, 3, "black");
fillCircle(2 * SQUARE_LENGTH + ANTI_ANTI_ALIASING, 6 * SQUARE_LENGTH + ANTI_ANTI_ALIASING, 3, "black");
fillCircle(6 * SQUARE_LENGTH + ANTI_ANTI_ALIASING, 2 * SQUARE_LENGTH + ANTI_ANTI_ALIASING, 3, "black");
fillCircle(6 * SQUARE_LENGTH + ANTI_ANTI_ALIASING, 6 * SQUARE_LENGTH + ANTI_ANTI_ALIASING, 3, "black");
//初期配置の石を描画する。
reversi.drawDisks();
//canvas要素をクリックしたときに実行される関数。
canvas.onclick = function () {
  //クリックされたマス目の座標を表す変数。
  var boardCoordinateX_Clicked = getBoardCoordinate("x");
  var boardCoordinateY_Clicked = getBoardCoordinate("y");
  //クリックした場所に打てるとき
  if (reversi.countFlippableDisks(boardCoordinateX_Clicked, boardCoordinateY_Clicked, reversi.turn) > 0) {
    //石をひっくり返して描画してターンを切り替える。
    reversi.flipDisks(boardCoordinateX_Clicked, boardCoordinateY_Clicked);
    reversi.drawDisks();
    reversi.turn = -reversi.turn
    //切り替えたターンに打てるマス目が無いときは、パスのメッセージを表示して、更にターンを切り替える。
    reversi.alertPassMessage();
    reversi.pass();
    //2回連続でパスとなるとき、ゲーム終了のメッセージを表示する。
    if (reversi.countPuttablePositions(reversi.turn) == 0)
      reversi.alertResultMessage();
  }
};
