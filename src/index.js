import {Block} from './block.js'
import {Column} from './column.js'
import {Board} from './board.js'
import {GAME_PARAMS} from './gameparams.js'
import {GameBoard} from './gameboard.js'

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
    GAME_PARAMS.audios.main.pause()
    btnStart.innerHTML = 'Start'
  } else {
    gameBoard.run()
    GAME_PARAMS.audios.main.loop = true
    GAME_PARAMS.audios.main.play()
    btnStart.innerHTML = 'Pause'
  }
  isStarted = !isStarted
}

const btnReset = document.getElementById('btn-reset')
btnReset.addEventListener('click', function () {
  gameBoard.destroy()
  gameBoard = new GameBoard('player1', 1)
  if (isStarted) {
    gameBoard.run()
    GAME_PARAMS.audios.main.play()
  }
})
