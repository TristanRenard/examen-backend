const OtherPlayer = ({ position, size, color, debug }) => (
  <mesh position={position}>
    <cylinderGeometry args={[0.5 * size, 0.5 * size, (0.2 + (size * 0.003) + Math.random() * 0.001), 32]} />
    <meshToonMaterial color={color} wireframe={debug} />
  </mesh>
)

export default OtherPlayer