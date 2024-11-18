const config = require('../config')

/**
 * 
 * @returns {number} random coordinate
 */
const randomCoordinate = () => (Math.random() - 0.5) * config.gridSize

module.exports = randomCoordinate