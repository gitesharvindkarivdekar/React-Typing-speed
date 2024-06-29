import React, { useEffect, useState } from 'react'
import Home from './Components/Home'
import PlayGame from './Components/PlayGame'
import EndGame from './Components/EndGame'
import './App.css'

function App() {

    // now create the state gameStatus to manage the game status -------------step 1

    const [statusGame, setStatusGame] = useState(null);

    // To calculate points when playing the game, I will create a score variable to store ---------------step 4
  const [score, setScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60); // Timer state


    //when the system detects that the value of game status has changed and it will check if the value is equal to play game---------step 5

  useEffect(() => {
    if (statusGame === 'playgame') { // //it means the game will be started
      setScore({
        right: 0,
        wrong: 0
      });

      const timeOutGame = setTimeout(() => {
        setStatusGame('endgame');
      }, 60000);

      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => {
        clearTimeout(timeOutGame);
        clearInterval(timer);
      };
    }
  }, [statusGame]);

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
    setStatusGame(status);
    setTimeLeft(60); // Reset timer
  }

    //use switch case to control which components are displayed -------------step 2

  let layout;
  switch (statusGame) {
    case 'playgame':
      layout = <PlayGame onChangeScore={handleChangeScore} timeLeft={timeLeft} />;
      break;
    case 'endgame':
      layout = <EndGame score={score} onGame={handleChangeStatusGame} />;
      break;
    default:
      layout = <Home onGame={handleChangeStatusGame} />;
      break;
  }

  return (
    <div className='App'>
      {layout}
    </div>
  )
}

export default App

