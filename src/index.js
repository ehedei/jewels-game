import { Game } from './game.js'

let game = null
const btnStart = document.getElementById('startgame-btn')
const btn1v1 = document.getElementById('one-v-one-btn')


btnStart.addEventListener('click', () => {
  game = new Game(1)
  game.run()
})

btn1v1.addEventListener('click', () => {
  game = new Game(3)
  game.run()
})
