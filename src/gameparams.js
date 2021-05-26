export const GAME_PARAMS = {
  initialSpeed: 250,
  initialXPosition: 4,
  frequencyOfSpecial: 1,
  numberOfColumns: 9,
  numberOfRows: 20,
  acceleration: 20,
  colors: {
    0: 'special',
    1: 'red',
    2: 'green',
    3: 'blue',
    4: 'yellow',
    5: 'silver',
    6: 'orange',
    7: 'pink',
    8: 'black'
  },
  audios: {
    fall: new Audio('./../assets/audio/fall.wav'),
    gameover: new Audio('./../assets/audio/gameover.wav'),
    line: new Audio('./../assets/audio/line.wav'),
    success: new Audio('./../assets/audio/success.wav'),
    clear: new Audio('./../assets/audio/clear.wav'),
    selection: new Audio('./../assets/audio/selection.wav'),
    main: new Audio('./../assets/audio/clear-skies.mp3')
  }
}