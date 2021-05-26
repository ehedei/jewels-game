import { GAME_PARAMS } from './gameparams.js'
import { GameBoard } from './gameboard.js'

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

function startGame () {
  const startScreen = document.getElementById('start-screen')
  startScreen.style.display = 'none'
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

function resetGame () {
  gameBoard.destroy()
  gameBoard = new GameBoard('player1', 1)
  if (isStarted) {
    gameBoard.run()
    GAME_PARAMS.audios.main.play()
  }
}

function restartGame () {
  const endScreen = document.getElementById('gameover-screen')
  endScreen.style.display = 'none'
  resetGame()
}

const btnStart = document.getElementById('btn-start')
btnStart.onclick = startGame

const startGameBtn = document.getElementById('startgame-btn')
startGameBtn.onclick = startGame

const gameOverBtn = document.getElementById('gameover-btn')
gameOverBtn.onclick = restartGame

const btnReset = document.getElementById('btn-reset')
btnReset.onclick = resetGame
