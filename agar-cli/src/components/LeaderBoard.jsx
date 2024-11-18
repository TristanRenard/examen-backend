import { useSocket } from "../context/socketContext"

const LeaderBoard = () => {

  const { localPlayer, players } = useSocket()

  return (
    <>{localPlayer &&
      <ul className="absolute left-2 top-2 bg-slate-900 text-white p-2 rounded-md z-50">
        {
          players && Object.values(players).sort((playerA, playerB) => playerB.score - playerA.score).map((player, index) => (
            <li key={player.id}>
              <div className="flex justify-between gap-4">
                <p>{index + 1}</p>
                <p className={localPlayer.id === player.id && "text-red-500"}>{player.id}</p>
                <p>{player.score}</p>
              </div>
            </li>
          ))
        }
      </ul>}
    </>
  )
}

export default LeaderBoard