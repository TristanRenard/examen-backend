import { Canvas } from "@react-three/fiber"
import Experience from "./components/Experience"
import LeaderBoard from "./components/LeaderBoard"
import { SocketProvider } from "./context/socketContext"

const App = () => {

  return (
    <SocketProvider>
      <LeaderBoard />
      <Canvas
        className="flex-1"
        camera={{ position: [3, 0.5, 0] }}
      >
        <Experience />
      </Canvas>
    </SocketProvider>
  )
}

export default App