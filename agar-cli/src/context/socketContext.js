import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import { io } from "socket.io-client"

// Créez un contexte pour le socket
const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const socket = useMemo(() => io("http://localhost:3001"), []) // Une seule instance de socket
  const [players, setPlayers] = useState({})
  const [foods, setFoods] = useState([])
  const [obstacles, setObstacles] = useState([])
  const [localPlayer, setLocalPlayer] = useState(null)
  const [isDead, setIsDead] = useState(false) // État pour gérer la mort du joueur local
  const [config, setConfig] = useState({})

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connecté au serveur avec l'ID :", socket.id)
    })


    socket.on("initialize", ({ players: initialPlayers, foods: initialFoods, config: serverConfig, obstacles: initialObstacles }) => {
      console.log("Données initiales reçues :", { initialPlayers, initialFoods, serverConfig })
      setPlayers(initialPlayers)
      setObstacles(initialObstacles)
      setFoods(initialFoods)
      setConfig(serverConfig)

      const player = initialPlayers[socket.id]
      setLocalPlayer(player)
      setIsDead(false)
    })

    socket.on("playerMoved", (updatedPlayer) => {
      setPlayers((prev) => ({
        ...prev,
        [updatedPlayer.id]: updatedPlayer,
      }))
    })

    socket.on("playerJoined", (newPlayer) => {
      setPlayers((prev) => ({
        ...prev,
        [newPlayer.id]: newPlayer,
      }))
    })

    socket.on("playerLeft", (playerId) => {
      setPlayers((prev) => {
        const updatedPlayers = { ...prev }
        delete updatedPlayers[playerId]
        return updatedPlayers
      })
    })

    // Mise à jour des nourritures
    socket.on("updateFoods", (updatedFoods) => {
      setFoods(updatedFoods)
    })

    socket.on("foodEaten", ({ foodId }) => {
      setFoods((prev) => prev.filter((food) => food.id !== foodId))
    })

    socket.on("playerEaten", ({ eaterId, eatenId }) => {
      console.log(
        {
          eaterId,
          eatenId,
          socketId: socket.id,
          self: eatenId === socket.id
        }
      )
      console.log(`Joueur mangé : ${eatenId}, Mangé par : ${eaterId}`)

      if (eatenId === socket.id) {
        setIsDead(true)
        setLocalPlayer(null)
        alert("Vous avez été mangé !")
        window.location.reload()
      } else {
        setPlayers((prev) => {
          const updatedPlayers = { ...prev }
          delete updatedPlayers[eatenId]
          return updatedPlayers
        })
      }
    })

    socket.on("playerUpdated", (updatedPlayer) => {
      if (updatedPlayer?.id === socket.id) {
        setLocalPlayer(updatedPlayer)
      }
    })

    return () => {
      socket.disconnect()
      socket.off("connect")
      socket.off("initialize")
      socket.off("playerMoved")
      socket.off("playerJoined")
      socket.off("playerLeft")
      socket.off("foodEaten")
      socket.off("playerEaten")
    }
  }, [socket])

  return (
    <SocketContext.Provider value={{ socket, players, foods, localPlayer, isDead, config, obstacles }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error("useSocket doit être utilisé dans un SocketProvider")
  }
  return context
}