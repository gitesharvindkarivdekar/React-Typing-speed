import React, { useEffect, useRef, useState } from 'react'
import Home from './Components/Home'
import PlayGame from './Components/PlayGame'
import EndGame from './Components/EndGame'
import Leaderboard from './Components/Leaderboard'
import { GAME_SECONDS, computeStats } from './utils/stats'
import { addResult } from './utils/leaderboard'
import './App.css'

function App() {

    // now create the state gameStatus to manage the game status -------------step 1
    // null = landing page, 'playgame', 'endgame', 'leaderboard'

    const [statusGame, setStatusGame] = useState(null);

    // To calculate points when playing the game, I will create a score variable to store ---------------step 4
  const [score, setScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS); // Timer state

  // NEW: player name, session-only leaderboard (in-memory React state, max 10 entries)
  const [playerName, setPlayerName] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [lastEntryId, setLastEntryId] = useState(null); // the entry created by the round just played
  const [roundId, setRoundId] = useState(0);            // increments every time a round starts
  const recordedRound = useRef(0);                      // guards against recording one round twice
  const leaderboardReturn = useRef(null);               // which screen "Back" returns to


    //when the system detects that the value of game status has changed and it will check if the value is equal to play game---------step 5

  useEffect(() => {
    if (statusGame === 'playgame') { // //it means the game will be started
      setScore({
        right: 0,
        wrong: 0
      });

      const timeOutGame = setTimeout(() => {
        setStatusGame('endgame');
      }, GAME_SECONDS * 1000);

      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => {
        clearTimeout(timeOutGame);
        clearInterval(timer);
      };
    }
  }, [statusGame]);

  // NEW: when a round ends, add the result to the leaderboard exactly once
  useEffect(() => {
    if (statusGame !== 'endgame' || !score || recordedRound.current === roundId) return;
    recordedRound.current = roundId;
    const stats = computeStats(score);
    if (stats.wpm <= 0 || !playerName) return; // a 0 WPM round doesn't qualify
    const entry = {
      id: `${roundId}-${Date.now()}`,
      name: playerName,
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      right: stats.right,
      wrong: stats.wrong,
      playedAt: Date.now()
    };
    setLeaderboard((prev) => addResult(prev, entry)); // sorted + trimmed to the top 10
    setLastEntryId(entry.id);
  }, [statusGame, score, roundId, playerName]);

  // create a function  called handlechangessatusgame() that allows users to change the value of the status --------------------step 3

  const handleChangeScore = (type) => {
    if (type === 'right') {
      setScore((prevScore) => ({
        ...prevScore,
        right: prevScore.right + 1
      }));
    } else {
      setScore((prevScore) => ({
        ...prevScore,
        wrong: prevScore.wrong + 1
      }));
    }
  }

  const handleChangeStatusGame = (status) => {
    if (status === 'playgame') {
      setRoundId((id) => id + 1);
      setLastEntryId(null);
    }
    setStatusGame(status);
    setTimeLeft(GAME_SECONDS); // Reset timer
  }

  // NEW: called by the landing page once the name has been validated
  const handleStart = (name) => {
    setPlayerName(name);
    handleChangeStatusGame('playgame');
  }

  // NEW: leaderboard navigation (remembers where to go back to)
  const handleShowLeaderboard = () => {
    leaderboardReturn.current = statusGame;
    setStatusGame('leaderboard');
  }
  const handleBackFromLeaderboard = () => {
    setStatusGame(leaderboardReturn.current === 'endgame' ? 'endgame' : null);
  }

  const rank = lastEntryId ? leaderboard.findIndex((e) => e.id === lastEntryId) + 1 : 0; // 0 = not on the board

    //use switch case to control which components are displayed -------------step 2

  let layout;
  switch (statusGame) {
    case 'playgame':
      layout = <PlayGame onChangeScore={handleChangeScore} timeLeft={timeLeft} />;
      break;
    case 'endgame':
      layout = (
        <EndGame
          score={score}
          playerName={playerName}
          rank={rank}
          onGame={handleChangeStatusGame}
          onShowLeaderboard={handleShowLeaderboard}
        />
      );
      break;
    case 'leaderboard':
      layout = (
        <Leaderboard
          entries={leaderboard}
          highlightId={lastEntryId}
          onBack={handleBackFromLeaderboard}
          backLabel={leaderboardReturn.current === 'endgame' ? 'Back to my scorecard' : 'Back to start'}
        />
      );
      break;
    default:
      layout = <Home playerName={playerName} onStart={handleStart} onShowLeaderboard={handleShowLeaderboard} />;
      break;
  }

  return (
    <div className='App'>
      {layout}
    </div>
  )
}

export default App
