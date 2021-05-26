import {Column} from './column.js'
import {GAME_PARAMS} from './gameparams.js'

export function Board(playerName, gameBoard) {
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
  this.setSpecialToErasable()
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

Board.prototype.setSpecialToErasable = function () {
  this.columns.forEach((col, i) => {
    col.forEach((block, j) => {
      if (block.erasable) {
        const cell = this.element.querySelector(`.row${j} .col${i}`)
        cell?.classList.add('special')
      }
    })
  })
}