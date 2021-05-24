const GAME_PARAMS = {
  initialSpeed: 150,
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

function Block(board) {
  this.type = Math.floor(Math.random() * (Object.keys(GAME_PARAMS.colors).length) + 1)
  this.board = board
  this.y = null
  this.x = null
  this.erasable = false
}

function Column(board) {
  this.x = GAME_PARAMS.initialXPosition
  this.y = GAME_PARAMS.numberOfRows
  this.board = board
  this.blocks = [
    new Block(board),
    new Block(board),
    new Block(board)
  ]
}

Column.prototype.goDown = function () {
  this.y--
}

Column.prototype.goLeft = function () {
  if (this.x > 0 && this.board.columns[this.x - 1].length < this.y) {
    this.x--
  }
}

Column.prototype.goRight = function () {
  if (this.x < GAME_PARAMS.numberOfColumns - 1 && this.board.columns[this.x + 1].length < this.y) {
    this.x++
  }
}

Column.prototype.changeOrder = function () {
  console.log('Switch-order')
}

function Board(tableId, gameBoard) {
  this.element = document.getElementById(tableId)
  this.columns = [[], [], [], [], [], [], [], [], []]
  this.column = new Column(this)
  this.gameBoard = gameBoard
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

Board.prototype.prepareDelete = function () {
  let amount = 0
  this.columns.forEach(column => {
    column.forEach(block => {
      if (block.setErasable()) {
        amount++
      }
    })
  })
  console.log('prepareDelete', amount, this.columns.filter(block => { return block.erasable }))
  return amount
}

Board.prototype.deleteBlocks = function () {
  this.columns = this.columns.map(column => {
    return column.filter(block => { return !block.erasable })
  })
}

function GameBoard(tableId, player) {
  this.speed = GAME_PARAMS.initialSpeed
  this.player = player
  this.points = 0
  this.savedBlocks = 0
  this.level = 1
  this.timerId = null
  this.board = new Board(tableId, this)
}

GameBoard.prototype.run = function () {
  const self = this
  self.timerId = setInterval(function () {
    if (self.board.columns[self.board.column.x].length < self.board.column.y) {
      self.board.column.goDown()
    } else {
      const i = self.board.columns[self.board.column.x].length
      self.board.columns[self.board.column.x].push(...self.board.column.blocks)
      let j = 0
      for (const block of self.board.column.blocks) {
        block.columns = self.board.columns
        block.y = i + j
        block.x = self.board.column.x
        j++
      }

      if (self.board.columns[self.board.column.x].length >= GAME_PARAMS.numberOfRows) {
        clearInterval(self.timerId)
        window.alert('You lose')
      } else {
        self.board.column = new Column(self.board)
        self.prepareDeletions()
        self.board.deleteBlocks()
        self.board.drawBoard()
        /* if (amountDeletedBlocks > 0) {
          clearInterval(self.timerId)
          self.saveBlocks()
        } */
        // self.board.saveBlocks()
        // console.log(self.board.columns)
      }
    }
    self.board.drawBoard()
  }, self.speed, self)
}

GameBoard.prototype.pause = function () {
  clearInterval(this.timerId)
}

GameBoard.prototype.saveBlocks = function () {
  const self = this
  setTimeout(() => {
    self.board.deleteBlocks()
    self.board.drawBoard()
    self.run()
  }, GAME_PARAMS.initialSpeed)
}

GameBoard.prototype.prepareDeletions = function () {
  const columns = this.board.columns

  // Vertical
  for (let x = 0; x < columns.length; x++) {
    for (let y = 0; y < columns[x].length - 2; y++) {
      if (!columns[x][y] || !columns[x][y + 1] || !columns[x][y + 2]) {
        break
      } else if (columns[x][y].type === columns[x][y + 1].type && columns[x][y + 2].type === columns[x][y].type) {
        columns[x][y].erasable = true
        columns[x][y + 1].erasable = true
        columns[x][y + 2].erasable = true
      }
    }
  }

  // Horizontal
  for (let x = 0; x < columns.length - 2; x++) {
    for (let y = 0; y < columns[x].length; y++) {
      if (!columns[x][y] || !columns[x + 1][y] || !columns[x + 2][y]) {
        break
      } else if (columns[x][y].type === columns[x + 1][y].type && columns[x + 2][y].type === columns[x][y].type) {
        columns[x][y].erasable = true
        columns[x + 1][y].erasable = true
        columns[x + 2][y].erasable = true
      }
    }
  }

  // Diagonal
  for (let x = 0; x < columns.length - 2; x++) {
    for (let y = 0; y < columns[x].length; y++) {
      if (!columns[x][y] || !columns[x + 1][y + 1] || !columns[x + 2][y + 2]) {
        break
      } else if (columns[x][y].type === columns[x + 1][y + 1].type && columns[x + 2][y + 2].type === columns[x][y].type) {
        columns[x][y].erasable = true
        columns[x + 1][y + 1].erasable = true
        columns[x + 2][y + 2].erasable = true
      }
    }
  }

  // Diagonal Inversa
  for (let x = 0; x < columns.length - 2; x++) {
    for (let y = 0; y < columns[x].length; y++) {
      if (!columns[x][y] || !columns[x + 1][y - 1] || !columns[x + 2][y - 2]) {
        break
      } else if (columns[x][y].type === columns[x + 1][y - 1].type && columns[x + 2][y - 2].type === columns[x][y].type) {
        columns[x][y].erasable = true
        columns[x + 1][y - 1].erasable = true
        columns[x + 2][y - 2].erasable = true
      }
    }
  }
}

const gameBoard = new GameBoard('player1-board', 1)
let isStarted = false

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
  if (isStarted) {
    gameBoard.pause()
  } else {
    gameBoard.run()
  }
  isStarted = !isStarted
}
