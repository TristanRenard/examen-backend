const Food = ({ position, size, debug }) => (
  <mesh position={position}>
    <cylinderGeometry args={[0.5 * size, 0.5 * size, 0.1, 16]} />
    <meshToonMaterial color="green" wireframe={debug} />
  </mesh>
)

export default Food