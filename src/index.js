const GAME_PARAMS = {
  initialSpeed: 100,
  initialXPosition: 4,
  numberOfColumns: 9,
  numberOfRows: 20,
  colors: {
    1: 'red',
    2: 'green',
    3: 'blue',
    4: 'yellow',
    5: 'violet',
    6: 'orange',
    7: 'pink'
  }
}


function Board(tableId) {
  this.element = document.getElementById(tableId)
  this.column = new Column()
  this.columns = [[], [], [], [], [], [], [], [], []]
}

Board.prototype.drawBoard = function () {
  this.clearBoard()
  const cells = [
    this.element.querySelector(`.row${this.column.y} .col${this.column.x}`),
    this.element.querySelector(`.row${this.column.y + 1} .col${this.column.x}`),
    this.element.querySelector(`.row${this.column.y + 2} .col${this.column.x}`)
  ]

  cells.forEach((cell, i) => {
    cell?.classList.add(GAME_PARAMS.colors[this.column.blocks[i]])
  })


  this.columns.forEach((col, i) => {
    col.forEach((cell, j) => {
      let block = this.element.querySelector(`.row${j} .col${i}`)
      block?.classList.add(GAME_PARAMS.colors[this.columns[i][j]])
    })
  })
}

Board.prototype.clearBoard = function () {
  const cells = this.element.querySelectorAll('.cell')
  cells.forEach(function (cell) {
    cell.classList.remove(...Object.values(GAME_PARAMS.colors))
  })
}

/*Board.prototype.saveBlocks = function () {
  this.columns.forEach((column, i) => {
    column.filter(cell, j) {
      return (
        cell === column[i][j + 1] && cell === column[i][j + 2]
        || cell === column[i][j + 1] && cell === column[i][j - 1]
        || cell === column[i][j - 1] && cell === column[i][j - 2]
        )

    }
  })
}*/

function GameBoard(board, player) {
  const self = this
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
  this.blocks = [
    Math.floor(Math.random() * (Object.keys(GAME_PARAMS.colors).length) + 1),
    Math.floor(Math.random() * (Object.keys(GAME_PARAMS.colors).length) + 1),
    Math.floor(Math.random() * (Object.keys(GAME_PARAMS.colors).length) + 1)
  ]
}

Column.prototype.goDown = function () {
  this.y--
}


Column.prototype.goLeft = function () {
  if (this.x > 0 && board.columns[this.x - 1].length < this.y) {
    this.x--
  }
}

Column.prototype.goRight = function () {
  if (this.x < GAME_PARAMS.numberOfColumns - 1 && board.columns[this.x + 1].length < this.y) {
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
    gameBoard.board.columns[gameBoard.board.column.x].push(...gameBoard.board.column.blocks)
    if (gameBoard.board.columns[gameBoard.board.column.x].length >= GAME_PARAMS.numberOfRows) {
      clearInterval(gameBoard.timerId)
      window.alert('You lose')
    } else {
      //gameBoard.board.saveBlocks()
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
