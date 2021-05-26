import {Block} from './block.js'
import {GAME_PARAMS} from './gameparams.js'

export function Column(board) {
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