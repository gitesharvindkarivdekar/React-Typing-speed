import React from 'react'

function EndGame({ score, onGame }) {
  const totalWordsTyped = score.right + score.wrong;
  const wpm = totalWordsTyped; // Since the game is for 1 minute, WPM is the total words typed

  return (
    <>
      <div className="endGame">
        <div className="result">
          <div>
            <div className='title'>
              Right Words
            </div>
            <div className="number">
              {score.right}
            </div>
          </div>
          <div>
            <div className="title">
              Wrong Words
            </div>
            <div className="number">
              {score.wrong}
            </div>
          </div>
          <div>
            <div className="title">
              Typing Speed (WPM)
            </div>
            <div className="number">
              {wpm}
            </div>
          </div>
        </div>
        <button className="btnPlay" onClick={() => onGame('playgame')}>Play Again</button>
      </div>
    </>
  )
}

export default EndGame
