import { Canvas } from "@react-three/fiber"
import Experience from "./components/Experience"
import Guide from "./components/Guide"
import LeaderBoard from "./components/LeaderBoard"
import { SocketProvider } from "./context/socketContext"

const App = () => {

  return (
    <SocketProvider>
      <LeaderBoard />
      <Guide />
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