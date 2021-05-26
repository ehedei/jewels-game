import {Column} from './column.js'
import {Board} from './board.js'
import {GAME_PARAMS} from './gameparams.js'

export function GameBoard(playerName, player) {
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
      GAME_PARAMS.audios.fall.play()

      if (self.board.columns[self.board.column.x].length >= GAME_PARAMS.numberOfRows) {
        clearInterval(self.timerId)
        GAME_PARAMS.audios.main.pause()
        GAME_PARAMS.audios.gameover.play()
        // GAME OVER ******************************************************************************
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
    GAME_PARAMS.audios.success.play()
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
