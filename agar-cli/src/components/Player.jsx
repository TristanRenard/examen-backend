import { Text } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { CylinderCollider } from "@react-three/rapier"
import Ecctrl from "ecctrl"
import { useControls } from "leva"
import { useRef, useState } from "react"
import { useSocket } from "../context/socketContext"

const Player = ({ position, size, score }) => {
  const ref = useRef()
  const meshRef = useRef()
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 })

  const [{ pos }, set] = useControls(() => ({ position: position }))

  const { socket } = useSocket()

  // État pour forcer la mise à jour du collider

  useFrame(() => {
    const position = ref?.current?.translation()
    if (position) {
      set({ position: [position.x, position.y, position.z] })
      const x = Math.round(position.x * 1000) / 1000
      const y = Math.round(position.z * 1000) / 1000
      if (lastPosition.x !== x || lastPosition.y !== y) {
        socket.emit("move", { x, y })
      }
      setLastPosition({ x, y })
    }
  })

  return (
    <Ecctrl
      ref={ref}
      mode="FixedCamera"
      camInitDir={{ x: 0.4 * Math.PI, y: 0 }}
      camTargetPos={{ x: 0, y: size, z: -2 }}
      position={position}
      capsuleRadius={0.001}
      capsuleHalfHeight={0.01}
      autoBalanceDampingC={0}
      autoBalanceSpringOnY={0}
      camCollision={false}
      maxVelLimit={5}
      mass={200}
      restitution={0}
      debug
    >
      {/* Utilisation de la clé pour forcer le remount du collider */}
      <CylinderCollider
        name="player"
        args={[0.1, Math.sqrt(((size * 0.5) ** 2) * 0.5)]}
        restitution={0}
        mass={2}
      />
      <Text rotation={[Math.PI * 0.5, 0, 0]} position-y={1}>
        {size}
      </Text>
      <mesh ref={meshRef} castShadow>
        <cylinderGeometry args={[0.5 * size, 0.5 * size, 0.3, 16]} />
        <meshToonMaterial color="red" wireframe />
      </mesh>
    </Ecctrl>
  )
}

export default Player