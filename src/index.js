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

function Block() {
  this.type = Math.floor(Math.random() * (Object.keys(GAME_PARAMS.colors).length) + 1)
  this.columns = null
  this.y = null
  this.x = null
  this.erasable = false
}

Block.prototype.setErasable = function () {
  let isAligned = false
  if (
    this.columns?.[this.x - 1]?.[this.y] &&
    this.columns?.[this.x - 2]?.[this.y] &&
    this.columns[this.x - 1][this.y].type === this.type &&
    this.columns[this.x - 2][this.y].type
  ) {
    isAligned = true
  } else if (
    this.columns?.[this.x + 1]?.[this.y] &&
    this.columns?.[this.x + 2]?.[this.y] &&
    this.columns[this.x + 1][this.y].type === this.type &&
    this.columns[this.x + 2][this.y].type === this.type
  ) {
    isAligned = true
  } else if (
    this.columns?.[this.x - 1]?.[this.y] &&
    this.columns?.[this.x + 1]?.[this.y] &&
    this.columns[this.x - 1][this.y].type === this.type &&
    this.columns[this.x + 1][this.y].type === this.type
  ) {
    isAligned = true
  }
  else if (
    this.columns?.[this.x]?.[this.y - 1] &&
    this.columns?.[this.x]?.[this.y - 2] &&
    this.columns[this.x][this.y - 1].type === this.type &&
    this.columns[this.x][this.y - 2].type === this.type
  ) {
    isAligned = true
  } else if (
    this.columns?.[this.x]?.[this.y + 1] &&
    this.columns?.[this.x]?.[this.y + 2] &&
    this.columns[this.x][this.y + 1].type === this.type &&
    this.columns[this.x][this.y + 2].type === this.type
  ) {
    isAligned = true
  } else if (
    this.columns?.[this.x]?.[this.y + 1] &&
    this.columns?.[this.x]?.[this.y - 1] &&
    this.columns[this.x][this.y + 1].type === this.type &&
    this.columns[this.x][this.y - 1].type === this.type
  ) {
    isAligned = true
  }
  this.erasable = isAligned
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
    cell?.classList.add(GAME_PARAMS.colors[this.column.blocks[i].type])
  })


  this.columns.forEach((col, i) => {
    col.forEach((cell, j) => {
      let block = this.element.querySelector(`.row${j} .col${i}`)
      block?.classList.add(GAME_PARAMS.colors[this.columns[i][j].type])
    })
  })
}

Board.prototype.clearBoard = function () {
  const cells = this.element.querySelectorAll('.cell')
  cells.forEach(function (cell) {
    cell.classList.remove(...Object.values(GAME_PARAMS.colors))
  })
}

Board.prototype.saveBlocks = function () {
  this.columns.forEach(column => {
    column.forEach(block => {
      block.setErasable()
    })
  })

  this.columns = this.columns.map(column => {
    return column.filter(block => {return !block.isErasable})
  })
}

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
    new Block(),
    new Block(),
    new Block()
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
    const i = gameBoard.board.columns[gameBoard.board.column.x].length
    gameBoard.board.columns[gameBoard.board.column.x].push(...gameBoard.board.column.blocks)
    let j = 0
    for (const block of gameBoard.board.column.blocks) {
      block.columns = gameBoard.board.columns
      block.y = i + j
      block.x = gameBoard.board.column.x
      j++
    }

    if (gameBoard.board.columns[gameBoard.board.column.x].length >= GAME_PARAMS.numberOfRows) {
      clearInterval(gameBoard.timerId)
      window.alert('You lose')
    } else {
      gameBoard.board.saveBlocks()
      console.log(gameBoard.board.columns)
      gameBoard.board.column = new Column()
    }
  }
  gameBoard.board.drawBoard()
}, gameBoard.speed)

window.addEventListener('keydown', function (e) {
  const keyPressed = e.code
  if (keyPressed === 'ArrowLeft') {
    gameBoard.board.column.goLeft()
  } else if (keyPressed === 'ArrowRight') {
    gameBoard.board.column.goRight()
  }
})

const btnStart = document.getElementById('btn-start')
btnStart.onclick = function () {

}
