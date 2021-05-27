import { GameBoard } from './gameboard.js'
import { GAME_PARAMS } from './gameparams.js'

export function Game (type) {
  this.type = type
  this.player1GameBoard = new GameBoard('player1', 1, this)
  if (type !== 1) {
    this.player2GameBoard = new GameBoard('player2', 2, this)
  }
}


Game.prototype.setKeyListeners = function () {
  if (this.type === 1) {
    window.addEventListener('keydown', this.setKeyListenersOnePlayer.bind(this))
  } else {
    window.addEventListener('keydown', this.setKeyListenersTwoPlayers.bind(this))
  }
}

Game.prototype.setKeyListenersOnePlayer = function (e) {
  const keyPressed = e.code
  if (keyPressed === 'ArrowLeft') {
    this.player1GameBoard.board.column.goLeft()
  } else if (keyPressed === 'ArrowRight') {
    this.player1GameBoard.board.column.goRight()
  } else if (keyPressed === 'ArrowDown') {
    this.player1GameBoard.board.column.goDown()
    this.player1GameBoard.board.drawBoard()
  } else if (keyPressed === 'ArrowUp' || keyPressed === 'Space') {
    this.player1GameBoard.board.column.changeOrder()
  }
}

Game.prototype.setKeyListenersTwoPlayers = function (e) {
  const keyPressed = e.code
  if (keyPressed === 'ArrowLeft') {
    this.player2GameBoard.board.column.goLeft()
  } else if (keyPressed === 'ArrowRight') {
    this.player2GameBoard.board.column.goRight()
  } else if (keyPressed === 'ArrowDown') {
    this.player2GameBoard.board.column.goDown()
    this.player2GameBoard.board.drawBoard()
  } else if (keyPressed === 'ArrowUp') {
    this.player2GameBoard.board.column.changeOrder()
  } else if (keyPressed === 'KeyA') {
    this.player1GameBoard.board.column.goLeft()
  } else if (keyPressed === 'KeyD') {
    this.player1GameBoard.board.column.goRight()
  } else if (keyPressed === 'KeyS') {
    this.player1GameBoard.board.column.goDown()
    this.player1GameBoard.board.drawBoard()
  } else if (keyPressed === 'KeyW') {
    this.player1GameBoard.board.column.changeOrder()
  }
}


Game.prototype.prepareScreen = function () {
  const startScreen = document.getElementById('start-screen')
  startScreen.style.display = 'none'

  if (this.type === 1) {
    document.getElementById('player2-zone').style.display = 'none'
  } else if (this.type === 3) {
    document.getElementById('player2-zone').style.display = 'flex'
  } else {
    document.getElementById('player2-zone').style.display = 'flex'
    document.getElementById('player2-btn-cnt').style.display = 'flex'

    const buttons = document.querySelectorAll('.controllers-btns-cnt')
    buttons.forEach(btn => {
      btn.style.minWidth = '150px'
    })
  }
}


Game.prototype.run = function () {
  document.getElementById('btn-start').innerText = 'Pause'
  this.setKeyListeners()
  this.prepareScreen()
  this.setButtonListeners()
  this.player1GameBoard.run()
  this.player2GameBoard?.run()
  GAME_PARAMS.audios.main.play()
}


Game.prototype.resetPlayers = function (e) {
  const isOnFire = this.player1GameBoard.isStarted
  this.player1GameBoard.destroy()
  this.player2GameBoard?.destroy()

  this.player1GameBoard = new GameBoard('player1', 1, this)
  if (this.type !== 1) {
    this.player2GameBoard = new GameBoard('player2', 2, this)
  }
  const btn = document.querySelector('#btn-start')
  if (!isOnFire) {
    btn.innerText = 'Pause'
  }
  this.startPlayers(btn)
}

Game.prototype.startPlayers = function (e) {
  const btnStart = e.currentTarget
  this.start(btnStart)
}

Game.prototype.start = function (btnStart) {
  if (this.player1GameBoard.isStarted) {
    this.player1GameBoard.pause()
    this.player2GameBoard?.pause()
    GAME_PARAMS.audios.main.pause()
    btnStart.innerHTML = 'Start'
  } else {
    this.player1GameBoard.run()
    this.player2GameBoard?.run()
    GAME_PARAMS.audios.main.loop = true
    GAME_PARAMS.audios.main.play()
    btnStart.innerHTML = 'Pause'
  }
}

Game.prototype.setButtonListeners = function () {
  const btnStart = document.getElementById('btn-start')
  const btnReset = document.getElementById('btn-reset')
  const btnBack = document.getElementById('btn-back')
  const btnBackOnePlayer = document.getElementById('gameover-btn')
  const btnBackMultiPlayer = document.getElementById('results-btn')

  btnStart.addEventListener('click', this.startPlayers.bind(this))
  btnReset.addEventListener('click', this.resetPlayers.bind(this))
  btnBack.addEventListener('click', this.backToMenu)
  btnBackOnePlayer.addEventListener('click', this.backToMenu)
  btnBackMultiPlayer.addEventListener('click', this.backToMenu)
}


Game.prototype.backToMenu = function () {
  window.location.reload()
}

Game.prototype.setGameOver = function () {
  GAME_PARAMS.audios.main.pause()
  GAME_PARAMS.audios.gameover.play()
  if (this.type === 1) {
    document.getElementById('final-score').innerText = this.player1GameBoard.points
    document.getElementById('gameover-screen').style.display = 'flex'
  } else {
    document.getElementById('winner').innerText = (this.player1GameBoard.points >= this.player2GameBoard.points) ? 'Player 1' : 'Player 2'
    document.getElementById('results-screen').style.display = 'flex'
    document.getElementById('final-score-player-1').innerText = this.player1GameBoard.points

    document.getElementById('final-score-player-2').innerText = this.player2GameBoard.points
  }

  clearInterval(this.player1GameBoard.timerId)
  clearInterval(this.player2GameBoard?.timerId)
}