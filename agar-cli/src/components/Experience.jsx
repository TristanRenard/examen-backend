import { Grid, KeyboardControls } from "@react-three/drei"
import { CuboidCollider, Physics } from "@react-three/rapier"
import { useState } from "react"
import { useSocket } from "../context/socketContext"
import Food from "./Food"
import OtherPlayer from "./OtherPlayer"
import Player from "./Player"

const Experience = () => {
  const { localPlayer, players, foods, config, obstacles } = useSocket()
  const [debug, setDebug] = useState(window.location.hash === "#debug")

  // Map clavier
  const keyboardMap = [
    { name: "forward", keys: ["ArrowUp", "KeyW"] },
    { name: "backward", keys: ["ArrowDown", "KeyS"] },
    { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
    { name: "rightward", keys: ["ArrowRight", "KeyD"] },
    { name: "jump", keys: ["Space"] },
    { name: "run", keys: ["Shift"] },
  ]

  return (
    <Physics debug={debug}>
      <KeyboardControls map={keyboardMap}>
        {/* Sol et grille */}
        <CuboidCollider name="floor" args={[config.gridSize / 2, 1, config.gridSize / 2]} position={[0, -1, 0]} />
        <Grid args={[config.gridSize, config.gridSize]} position={[0, 0, 0]} cellColor={"#d0d0d0"} cellSize={0.25} cellThickness={1} sectionSize={1} sectionColor={"#000"} />

        {/* Murs */}
        <CuboidCollider args={[config.gridSize / 2 + 1, config.gridSize / 2 + 1, 1]} position={[0, 0, config.gridSize / 2 + 1]} />
        <CuboidCollider args={[config.gridSize / 2 + 1, config.gridSize / 2 + 1, 1]} position={[0, 0, -(config.gridSize / 2 + 1)]} />
        <CuboidCollider args={[1, config.gridSize / 2 + 1, config.gridSize / 2 + 1]} position={[-(config.gridSize / 2 + 1), 0, 0]} />
        <CuboidCollider args={[1, config.gridSize / 2 + 1, config.gridSize / 2 + 1]} position={[config.gridSize / 2 + 1, 0, 0]} />

        {/* Joueur principal */}
        {localPlayer && <Player debug={debug} position={[localPlayer.x, 0.1, localPlayer.y]} size={localPlayer.size} score={localPlayer.score} />}

        {/* Autres joueurs */}
        {players && Object.values(players).map((player) =>
          player.id !== localPlayer?.id ? (
            <OtherPlayer
              key={player.id}
              id={player.id}
              position={[player.x, 0.1, player.y]}
              size={player.size}
              color={player.color}
              debug={debug}
            />
          ) : null
        )}

        {/* Nourritures */}
        {foods.map((food) => (
          <Food key={food.id} position={[food.x, 0.05, food.y]} size={food.size} debug={debug} />
        ))}

        {/* Lumières */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 10, 0]} intensity={1} />
        <spotLight
          position={[0, 15, 0]}
          angle={0.3}
          penumbra={1}
          intensity={0.8}
          castShadow
        />
      </KeyboardControls>
    </Physics>
  )
}

export default Experience