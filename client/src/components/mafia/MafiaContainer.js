import Settings from './Settings';
import { useSelector } from 'react-redux';
import {useState} from 'react'

function MafiaContainer() {
  const curState = useSelector((state) => state.lobbyState)
  const [gameState, setGameState] = useState(curState);
  console.log("game state is marked as ", gameState)
  return (
    <>
    {gameState.lobbyCode}
      <Settings />

    </>
  );
}

export default MafiaContainer;