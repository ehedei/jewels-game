const GAME_PARAMS = {
  initialSpeed: 10,
  initialXPosition: 4,
  numberOfColumns: 9,
  numberOfRows: 20
}

function Board(tableId) {
  this.element = document.getElementById(tableId)
  this.column = new Column()
  this.columns = [[], [], [], [], [], [], [], [], []]
}

Board.prototype.drawBoard = function () {
  this.clearBoard()
  const cell = this.element.querySelector(`.row${this.column.y} .col${this.column.x}`)
  cell?.classList.add('red')
  this.columns.forEach(function (col, i) {
    col.forEach(function (cell, j) {
      let block = board.element.querySelector(`.row${j} .col${i}`)
      block?.classList.add('red')
    })
  })

}

Board.prototype.clearBoard = function () {
  const cells = this.element.querySelectorAll('.cell')
  cells.forEach(function (cell) {
    cell.classList.remove('red')
  })
}

function GameBoard(board, player) {
  this.speed = GAME_PARAMS.initialSpeed
  this.player = player
  this.points = 0
  this.savedBlocks = 0
  this.level = 1
  this.timerId = null
  this.board = board
}

function Column() {
  this.x = GAME_PARAMS.initialXPosition
  this.y = GAME_PARAMS.numberOfRows
  this.boxes = []
}

Column.prototype.goDown = function () {
  this.y--
}

Column.prototype.goLeft = function () {
  if (this.x > 0) {
    this.x--
  }
}

Column.prototype.goRight = function () {
  if (this.x < GAME_PARAMS.numberOfColumns - 1) {
    this.x++
  }
}

Column.prototype.changeOrder = function () {
  console.log('Switch-order')
}

const board = new Board('player1-board')
const gameBoard = new GameBoard(board, 1)

gameBoard.timerId = setInterval(function () {

  if (gameBoard.board.columns[gameBoard.board.column.x].length < gameBoard.board.column.y) {
    gameBoard.board.column.goDown()
  } else {
    gameBoard.board.columns[gameBoard.board.column.x].push(gameBoard.board.column)
    if (gameBoard.board.columns[gameBoard.board.column.x].length >= GAME_PARAMS.numberOfRows) {
      clearInterval(gameBoard.timerId)
      window.alert('You lose')
    } else {
      gameBoard.board.column = new Column()
    }
  }


  gameBoard.board.drawBoard()
}, gameBoard.speed)


window.addEventListener('keydown', function (e) {
  let keyPressed = e.code
  if (keyPressed === 'ArrowLeft') {
    gameBoard.board.column.goLeft()
  } else if (keyPressed === 'ArrowRight') {
    gameBoard.board.column.goRight()
  }
})
