import {GAME_PARAMS} from './gameparams.js'

export function Block(board) {
  this.type = Math.floor(Math.random() * (Object.keys(GAME_PARAMS.colors).length - 1)) + 1
  this.board = board
  this.y = null
  this.x = null
  this.erasable = false
  //setSpecial()
}

Block.prototype.setSpecial = function () {
  const lottery = Math.floor(Math.random() * (50 - 1)) + 1
  if (lottery === 1) {
    this.type = 0
  }
}