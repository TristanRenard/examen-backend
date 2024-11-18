const resetGame = () => {
  players = {}
  initializeFoods()
  io.emit('gameReset', { players, foods })
}

module.exports = resetGame