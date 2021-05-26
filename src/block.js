import { GAME_PARAMS } from './gameparams.js'

export function Block(board) {
  this.type = Math.floor(Math.random() * (Object.keys(GAME_PARAMS.colors).length - 1)) + 1
  this.board = board
  this.y = null
  this.x = null
  this.erasable = false
}

Block.prototype.setSpecial = function () {
  this.type = 0
  this.erasable = true
}