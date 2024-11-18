const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const config = require('./config')
const randomCoordinate = require('./utils/randomCoordinate')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

app.get('/', (req, res) => {
  res.send('Serveur en cours d\'exécution')
})

app.get('/move', (req, res) => {
  if (req.method === "OPTIONS") {
    res.json({ allowedParams: ["x", "y"] })
  } else {
    res.status(405).send("Method not allowed")
  }
})

const players = {}
const foods = []
const obstacles = []

const generateObstacle = () => ({
  id: Math.random().toString(36).substr(2, 9),
  ...randomCoordinate({ obstacles, foods, players }),
  size: config.obstacleSize,
})


const initializeObstacles = () => {
  for (let i = 0; i < config.obstacleCount; i++) {
    obstacles.push(generateObstacle())
  }
}

const generateFood = () => ({
  id: Math.random().toString(36).substr(2, 9),
  ...randomCoordinate({ obstacles, foods, players }),
  size: config.foodSize,
})

const initializeFoods = () => {
  for (let i = 0; i < config.foodCount; i++) {
    foods.push(generateFood())
  }
}


const updatePlayerPosition = (playerId, { x, y }) => {
  if (players[playerId]) {
    const halfGrid = config.gridSize / 2
    players[playerId].x = Math.max(-halfGrid, Math.min(x, halfGrid))
    players[playerId].y = Math.max(-halfGrid, Math.min(y, halfGrid))
  }
}


const checkFoodCollision = (socket) => {
  if (!players[socket.id]) return
  const player = players[socket.id]
  foods.forEach((food, index) => {
    const distance = Math.hypot(player.x - food.x, player.y - food.y)
    if (distance < player.size * 0.5 + food.size * 0.5) {
      if (player.size < config.maxplayerSize) {
        player.size += config.foodValue
      }
      player.score += config.foodValue
      foods.splice(index, 1)
      io.emit('foodEaten', { foodId: food.id, playerId: socket.id })
      foods.push(generateFood())
      io.emit('updateFoods', foods)
      socket.emit('playerUpdated', { id: socket.id, ...players[socket.id] })
    }
  })
}


const checkPlayerCollision = (socket) => {
  if (!players[socket.id]) return
  if (Object.keys(players).length <= 1) return
  const player = players[socket.id]
  Object.values(players).forEach((otherPlayer) => {
    const distance = Math.hypot(player.x - otherPlayer.x, player.y - otherPlayer.y)
    if (otherPlayer.id !== socket.id) {
      if (distance < player.size * 0.5 + otherPlayer.size * 0.5 && player.size > otherPlayer.size) {
        player.score += otherPlayer.score
        player.size = Math.min(player.size + otherPlayer.size, config.maxplayerSize)
        io.emit('playerEaten', { eaterId: socket.id, eatenId: otherPlayer.id })
        const eatenSocket = io.sockets.sockets.get(otherPlayer.id)
        eatenSocket.emit('playerUpdated', null)
        delete players[otherPlayer.id]
      }
    } else if (distance < player.size * 0.5 + otherPlayer.size * 0.5 && player.size < otherPlayer.size) {
      otherPlayer.score += player.score
      otherPlayer.size = Math.min(otherPlayer.size + player.size, config.maxplayerSize)
      delete players[socket.id]
      io.emit('playerEaten', { eaterId: otherPlayer.id, eatenId: socket.id })
      socket.emit('playerUpdated', null)
    }
  })
}

const addPlayer = (socket) => {
  players[socket.id] = {
    id: socket.id,
    ...randomCoordinate({ obstacles, foods, players }),
    size: config.initialPlayerSize,
    color: `hsl(${Math.random() * 360}, 100%, 50%)`,
    score: 1,
  }
}

io.on('connection', (socket) => {
  console.log(`Utilisateur connecté avec l'ID : ${socket.id}`)
  addPlayer(socket)

  socket.emit('initialize', { config, players, foods, obstacles })

  socket.broadcast.emit('playerJoined', players[socket.id])

  socket.on('move', (position) => {
    updatePlayerPosition(socket.id, position)
    checkFoodCollision(socket)
    checkPlayerCollision(socket)

    io.emit('playerMoved', { id: socket.id, ...players[socket.id] })
  })

  socket.on('disconnect', () => {
    console.log(`Utilisateur déconnecté avec l'ID : ${socket.id}`)
    delete players[socket.id]
    io.emit('playerLeft', socket.id)
  })
})




initializeObstacles()
initializeFoods()


server.listen(config.port, () => {
  console.log(`Serveur en écoute sur http://localhost:${config.port}`)
})
