import { SquareArrowDown, SquareArrowLeft, SquareArrowRight, SquareArrowUp } from "lucide-react"

const Guide = () => (
  <div className="absolute grid grid-cols-3 grid-rows-2 bottom-4 left-4 z-50 gap-1">
    <div className="h-12 w-12 bg-gray-200 text-black border-2 border-gray-500 flex justify-center items-center row-start-1 col-start-2">
      <SquareArrowUp className="h-8 w-8" />
    </div>
    <div className="h-12 w-12 bg-gray-200 text-black border-2 border-gray-500 flex justify-center items-center row-start-2 col-start-1">
      <SquareArrowLeft className="h-8 w-8" />
    </div>
    <div className="h-12 w-12 bg-gray-200 text-black border-2 border-gray-500 flex justify-center items-center row-start-2 col-start-2">
      <SquareArrowDown className="h-8 w-8" />
    </div>
    <div className="h-12 w-12 bg-gray-200 text-black border-2 border-gray-500 flex justify-center items-center row-start-2 col-start-3">
      <SquareArrowRight className="h-8 w-8" />
    </div>

  </div>
)

export default Guide