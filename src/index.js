const GAME_PARAMS = {
  initialSpeed: 250,
  initialXPosition: 4,
  numberOfColumns: 9,
  numberOfRows: 20,
  acceleration: 20,
  colors: {
    1: 'red',
    2: 'green',
    3: 'blue',
    4: 'yellow',
    5: 'silver',
    6: 'orange',
    7: 'pink',
    8: 'black'
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

Column.prototype.changeOrder = function () {
  const block = this.blocks.pop()
  this.blocks.unshift(block)
  this.board.drawBoard()
}

Column.prototype.goDown = function () {
  if (this.board.columns[this.x].length < this.y) {
    this.y--
  }
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


Column.prototype.drawNextPiece = function () {
  const cells = this.board.wrapper.querySelectorAll('.next-piece-cnt td')
  const blocks = this.blocks.slice().reverse()

  for (let i = 0; i < cells.length; i++) {
    cells[i].classList.remove(...Object.values(GAME_PARAMS.colors))
    cells[i].classList.add(GAME_PARAMS.colors[blocks[i].type])
  }
}


function Board(playerName, gameBoard) {
  this.element = document.getElementById(playerName + '-board')
  this.wrapper = document.getElementById(playerName + '-zone')
  this.columns = [[], [], [], [], [], [], [], [], []]
  this.column = new Column(this)
  this.nextColumn = new Column(this)
  this.gameBoard = gameBoard
}

Board.prototype.drawData = function () {
  const levelWrap = this.wrapper.querySelector('.level span')
  levelWrap.innerText = this.gameBoard.level

  const pointsWrap = this.wrapper.querySelector('.points span')
  pointsWrap.innerText = this.gameBoard.points

  const blocksWrap = this.wrapper.querySelector('.blocks span')
  blocksWrap.innerText = this.gameBoard.savedBlocks
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

Board.prototype.deleteBlocks = function () {
  this.columns = this.columns.map(column => {
    return column.filter(block => { return !block.erasable })
  })
}

Board.prototype.countErasableBlocks = function () {
  let amount = 0
  this.columns.forEach(function (column) {
    column.forEach(function (cell) {
      if (cell.erasable) {
        amount++
      }
    })
  })
  return amount
}

function GameBoard(playerName, player) {
  this.speed = GAME_PARAMS.initialSpeed
  this.player = player
  this.points = 0
  this.savedBlocks = 0
  this.level = 1
  this.timerId = null
  this.board = new Board(playerName, this)
}

GameBoard.prototype.run = function (newSpeed = this.speed) {
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
        self.board.column = self.board.nextColumn
        self.board.nextColumn = new Column(self.board)
        clearInterval(self.timerId)
        self.saveBlocks()
      }
    }
    self.board.drawBoard()
    self.board.drawData()
    self.board.nextColumn.drawNextPiece()
    self.increaseLevel()
  }, newSpeed, self)
}

GameBoard.prototype.destroy = function () {
  clearInterval(this.timerId)
  this.board.clearBoard()
}

GameBoard.prototype.pause = function () {
  clearInterval(this.timerId)
}

GameBoard.prototype.nextLevel = function () {
  return this.level * 100 + (this.level - 1) * 125
}

GameBoard.prototype.increaseLevel = function () {
  if (this.nextLevel() <= this.points) {
    this.level++
    clearInterval(this.timerId)
    this.speed = this.speed - (this.level - 1) * GAME_PARAMS.acceleration
    this.run()
  }
}

GameBoard.prototype.setPoints = function () {
  let blocksAmount = this.board.countErasableBlocks()
  this.savedBlocks += blocksAmount
  this.points += blocksAmount * (this.level + 1)
}

GameBoard.prototype.saveBlocks = function () {
  const self = this
  let needToDelete = self.prepareDeletions()
  clearInterval(this.timerId)

  setTimeout(() => {
    if (needToDelete) {
      self.setPoints()
      self.board.deleteBlocks()
      self.board.drawBoard()
      self.saveBlocks()
    } else {
      self.run()
    }
  }, GAME_PARAMS.initialSpeed * 1.7)
}

GameBoard.prototype.prepareDeletions = function () {
  const columns = this.board.columns
  let needToDelete = false

  // Vertical
  for (let x = 0; x < columns.length; x++) {
    for (let y = 0; y < columns[x].length - 2; y++) {
      if (!columns[x][y] || !columns[x][y + 1] || !columns[x][y + 2]) {
        break
      } else if (columns[x][y].type === columns[x][y + 1].type && columns[x][y].type === columns[x][y + 2].type) {
        columns[x][y].erasable = true
        columns[x][y + 1].erasable = true
        columns[x][y + 2].erasable = true
        needToDelete = true
      }
    }
  }

  // Horizontal
  for (let x = 1; x < columns.length - 1; x++) {
    for (let y = 0; y < columns[x].length; y++) {
      if (!columns[x][y] || !columns[x + 1][y] || !columns[x - 1][y]) {
        break
      } else if (columns[x][y].type === columns[x + 1][y].type && columns[x - 1][y].type === columns[x][y].type) {
        columns[x][y].erasable = true
        columns[x + 1][y].erasable = true
        columns[x - 1][y].erasable = true
        needToDelete = true
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
        needToDelete = true
      }
    }
  }

  // Diagonal Inversa
  for (let x = 2; x < columns.length; x++) {
    for (let y = 0; y < columns[x].length; y++) {
      if (!columns[x][y] || !columns[x - 1][y + 1] || !columns[x - 2][y + 2]) {
        break
      } else if (columns[x][y].type === columns[x - 1][y + 1].type && columns[x - 2][y + 2].type === columns[x][y].type) {
        columns[x][y].erasable = true
        columns[x - 1][y + 1].erasable = true
        columns[x - 2][y + 2].erasable = true
        needToDelete = true
      }
    }
  }
  return needToDelete
}

/*
GameBoard.prototype.calculateDeletions = function (baseX, baseY) {
  const columns = this.board.columns
  let needToDelete = false

  console.log(baseX)
  console.log(baseY)

  for (let x = 0; x < columns.length; x++) {
    for (let y = 0; y < columns[x].length; y++) {
      if (!columns[x][y] || !columns[x + baseX.a][y + baseY.a] || !columns[x + baseX.a][y + baseY.b]) {
        break
      } else if (columns[x][y].type === columns[x][y + a].type && columns[x][y + b].type === columns[x][y].type) {
        columns[x][y].erasable = true
        columns[x][y + a].erasable = true
        columns[x][y + b].erasable = true
        needToDelete = true
      }
    }
  }
  return needToDelete
}

GameBoard.prototype.prepareDeletions = function () {
  // Vertical
  const verticalDelete = this.calculateDeletions({ a: 1, b: 2 }, { a: 0, b: 0 })

  // Horizontal
  const horizontalDelete = this.calculateDeletions({ a: 1, b: -1 }, { a: 0, b: 0 })

  // Diagonal
  const diagonalDelete = this.calculateDeletions({ a: 1, b: 2 }, { a: 1, b: 2 })

  // Diagonal Inversa
  const inverseDiagonalDelete = this.calculateDeletions({ a: -1, b: -2 }, { a: 1, b: 2 })

  return (verticalDelete || horizontalDelete || diagonalDelete || inverseDiagonalDelete)
}

*/

let gameBoard = new GameBoard('player1', 1)
let isStarted = false

window.addEventListener('keydown', function (e) {
  const keyPressed = e.code
  if (keyPressed === 'ArrowLeft') {
    gameBoard.board.column.goLeft()
  } else if (keyPressed === 'ArrowRight') {
    gameBoard.board.column.goRight()
  } else if (keyPressed === 'ArrowDown') {
    gameBoard.board.column.goDown()
    gameBoard.board.drawBoard()
  } else if (keyPressed === 'ArrowUp' || keyPressed === 'Space') {
    gameBoard.board.column.changeOrder()
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

const btnReset = document.getElementById('btn-reset')
btnReset.addEventListener('click', function () {
  gameBoard.destroy()
  gameBoard = new GameBoard('player1', 1)
  if (isStarted) {
    gameBoard.run()
  }
})
