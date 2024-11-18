const config = require('../config')

const randomCoordinate = ({ obstacles, foods, players }) => {
  const halfGrid = config.gridSize / 2
  const maxAttempts = 100
  let x, y, attempts = 0
  let isValid = false

  while (!isValid && attempts < maxAttempts) {
    x = Math.random() * config.gridSize - halfGrid
    y = Math.random() * config.gridSize - halfGrid
    isValid = true

    // Vérifier les collisions avec les obstacles
    for (const obstacle of obstacles) {
      const distance = Math.hypot(obstacle.x - x, obstacle.y - y)
      if (distance < config.obstacleSize) {
        isValid = false
        break
      }
    }

    // Vérifier les collisions avec les joueurs
    if (isValid) {
      for (const player of Object.values(players)) {
        const distance = Math.hypot(player.x - x, player.y - y)
        if (distance < config.initialPlayerSize) {
          isValid = false
          break
        }
      }
    }

    // Vérifier les collisions avec la nourriture
    if (isValid) {
      for (const food of foods) {
        const distance = Math.hypot(food.x - x, food.y - y)
        if (distance < config.foodSize) {
          isValid = false
          break
        }
      }
    }

    attempts++
  }

  if (!isValid) {
    throw new Error("Impossible de générer une coordonnée valide après plusieurs tentatives.")
  }

  return { x, y }
}

module.exports = randomCoordinate