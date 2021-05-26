import { Block } from './block.js'
import { GAME_PARAMS } from './gameparams.js'

export function Column (board) {
  this.x = GAME_PARAMS.initialXPosition
  this.y = GAME_PARAMS.numberOfRows
  this.board = board
  this.blocks = [
    new Block(board),
    new Block(board),
    new Block(board)
  ]
  this.setSpecial()
}

Column.prototype.changeOrder = function () {
  if (this.board.gameBoard.timerId) {
    const block = this.blocks.pop()
    this.blocks.unshift(block)
    this.board.drawBoard()
  }
}

Column.prototype.goDown = function () {
  if (this.board.columns[this.x].length < this.y && this.board.gameBoard.timerId) {
    this.y--
  }
}

Column.prototype.goLeft = function () {
  if (this.x > 0 && this.board.columns[this.x - 1].length < this.y && this.board.gameBoard.timerId) {
    this.x--
  }
}

Column.prototype.goRight = function () {
  if (this.x < GAME_PARAMS.numberOfColumns - 1 && this.board.columns[this.x + 1].length < this.y && this.board.gameBoard.timerId) {
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

Column.prototype.setSpecial = function () {
  const lottery = Math.floor(Math.random() * (GAME_PARAMS.frequencyOfSpecial - 1)) + 1
  if (lottery === 1) {
    this.blocks.forEach(block => {
      block.setSpecial()
    })
  }
}
