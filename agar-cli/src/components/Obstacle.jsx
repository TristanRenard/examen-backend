import { RigidBody } from "@react-three/rapier"

const Obstacle = ({ position, size, debug }) => (
  <RigidBody type="fixed" colliders="hull" restitution={0.9}>
    <mesh position={position}>
      <cylinderGeometry args={[0.5 * size, 0.5 * size, 0.1, 32]} />
      <meshToonMaterial color="blue" wireframe={debug} />
    </mesh>
  </RigidBody>
)

export default Obstacle