import Settings from './Settings';
import { useSelector } from 'react-redux';
import {useState} from 'react'

function MafiaContainer() {
  const curState = useSelector((state) => state.lobbyState.gameState)
  const [gameState, setGameState] = useState(curState);
  console.log("game state is marked as ", gameState)
  return (
    <>
      <Settings />

    </>
  );
}

export default MafiaContainer;