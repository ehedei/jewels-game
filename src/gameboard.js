import { Column } from './column.js'
import { Board } from './board.js'
import { GAME_PARAMS } from './gameparams.js'

export function GameBoard (playerName, player) {
  this.speed = GAME_PARAMS.initialSpeed
  this.player = player
  this.points = 0
  this.savedBlocks = 0
  this.level = 1
  this.timerId = null
  this.board = new Board(playerName, this)
  this.wrapper = document.getElementById(playerName + '-zone')
}

GameBoard.prototype.run = function (newSpeed = this.speed) {
  const self = this
  self.timerId = setInterval(function () {
    let special = null

    if (self.board.columns[self.board.column.x].length < self.board.column.y) {
      self.board.column.goDown()
    } else {
      GAME_PARAMS.audios.fall.play()
      const i = self.board.columns[self.board.column.x].length
      self.board.columns[self.board.column.x].push(...self.board.column.blocks)
      let j = 0
      for (const block of self.board.column.blocks) {
        block.columns = self.board.columns
        block.y = i + j
        block.x = self.board.column.x
        j++
      }

      // If Column is a special piece (and is not the only piece in the column), we get the type of the block below
      if (self.board.column.blocks[0].type === 0 && i > 0) {
        special = self.board.columns[self.board.column.x][i - 1].type
      }

      if (self.board.columns[self.board.column.x].length >= GAME_PARAMS.numberOfRows) {
        clearInterval(self.timerId)
        self.timerId = false
        GAME_PARAMS.audios.main.pause()
        GAME_PARAMS.audios.gameover.play()
        document.getElementById('final-score').innerText = self.points
        document.getElementById('gameover-screen').style.display = 'flex'
      } else {
        self.board.column = self.board.nextColumn
        self.board.nextColumn = new Column(self.board)
        clearInterval(self.timerId)
        self.timerId = false
        self.saveBlocks(special)
      }
    }
    self.board.drawBoard()
    self.board.drawData()
    self.board.nextColumn.drawNextPiece()
    self.increaseLevel()
  }, newSpeed, self)
}

GameBoard.prototype.prepareSpecialDeletions = function (type) {
  const columns = this.board.columns
  let existErasable = false
  for (const col of columns) {
    for (const cell of col) {
      if (cell.type === type) {
        cell.erasable = true
        existErasable = true
      }
    }
  }
  return existErasable
}

GameBoard.prototype.destroy = function () {
  clearInterval(this.timerId)
  this.timerId = false
  this.board.clearBoard()
}

GameBoard.prototype.pause = function () {
  clearInterval(this.timerId)
  this.timerId = false
  this.board.clearBoard()
}

GameBoard.prototype.nextLevel = function () {
  return this.level * GAME_PARAMS.nextLevel + (this.level - 1) * (GAME_PARAMS.nextLevel + GAME_PARAMS.nextLevel / 4)
}

GameBoard.prototype.increaseLevel = function () {
  if (this.nextLevel() <= this.points) {
    this.level++
    clearInterval(this.timerId)
    this.timerId = false
    this.speed = this.speed - (this.level - 1) * GAME_PARAMS.acceleration
    this.run()
    const label = this.wrapper.querySelector('.player-alert')
    label.classList.add('level-up')

    setTimeout(function () {
      label.classList.remove('level-up')
    }, 1500)

    GAME_PARAMS.audios.success.play()
  }
}

GameBoard.prototype.setPoints = function () {
  const blocksAmount = this.board.countErasableBlocks()
  this.savedBlocks += blocksAmount
  this.points += blocksAmount * (this.level + 1)
}

GameBoard.prototype.saveBlocks = function (special = null) {
  const self = this
  const needToDelete = special ? self.prepareSpecialDeletions(special) : self.prepareDeletions()
  clearInterval(this.timerId)
  this.timerId = false
  self.board.drawBoard()

  setTimeout(() => {
    if (needToDelete) {
      self.setPoints()
      self.board.deleteBlocks()
      self.board.drawBoard()
      GAME_PARAMS.audios.line.play()
      self.saveBlocks()
    } else {
      self.run()
    }
  }, GAME_PARAMS.initialSpeed * 1.5)
}

GameBoard.prototype.prepareDeletions = function () {
  // Vertical
  const verticalDelete = this.calculateVerticalDeletions()

  // Horizontal
  const horizontalDelete = this.calculateHorizontalDeletions()

  // Diagonal
  const diagonalDelete = this.calculateDiagonalDeletions()

  // Diagonal Inversa
  const inverseDiagonalDelete = this.calculateInverseDiagonalDeletions()

  return (verticalDelete || horizontalDelete || diagonalDelete || inverseDiagonalDelete)
}

GameBoard.prototype.calculateVerticalDeletions = function () {
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

  return needToDelete
}

GameBoard.prototype.calculateHorizontalDeletions = function () {
  const columns = this.board.columns
  let needToDelete = false

  // Horizontal
  for (let x = 0; x < columns.length - 2; x++) {
    for (let y = 0; y < columns[x].length; y++) {
      if (!columns[x][y] || !columns[x + 1][y] || !columns[x + 2][y]) {
        break
      } else if (columns[x][y].type === columns[x + 1][y].type && columns[x + 2][y].type === columns[x][y].type) {
        columns[x][y].erasable = true
        columns[x + 1][y].erasable = true
        columns[x + 2][y].erasable = true
        needToDelete = true
      }
    }
  }

  return needToDelete
}

GameBoard.prototype.calculateDiagonalDeletions = function () {
  const columns = this.board.columns
  let needToDelete = false

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

  return needToDelete
}

GameBoard.prototype.calculateInverseDiagonalDeletions = function () {
  const columns = this.board.columns
  let needToDelete = false

  // Inverse Diagonal
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
  for (let x = 0; x < columns.length - 2; x++) {
    for (let y = 0; y < columns[x].length; y++) {
      if (!columns[x][y] || !columns[x + 1][y] || !columns[x + 2][y]) {
        break
      } else if (columns[x][y].type === columns[x + 1][y].type && columns[x + 2][y].type === columns[x][y].type) {
        columns[x][y].erasable = true
        columns[x + 1][y].erasable = true
        columns[x + 2][y].erasable = true
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
*/