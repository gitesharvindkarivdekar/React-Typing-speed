import React from 'react';
import ContactForm from './ContactForm';
import { computeStats, GAME_SECONDS } from '../utils/stats';
import { LINKEDIN_URL } from '../config';

export default function EndGame({ score, playerName, rank, onGame, onShowLeaderboard }) {
  const s = computeStats(score);

  let rankLine;
  if (s.wpm === 0) rankLine = 'Score at least 1 WPM to enter the leaderboard.';
  else if (rank > 0) rankLine = `You’re #${rank} on the leaderboard!`;
  else rankLine = 'So close! You’re just outside the top 10 this time.';

  return (
    <div className='endGame'>
      <section className='card scorecard' aria-labelledby='score-title'>
        <p className='eyebrow'>Time’s up</p>
        <h2 id='score-title'>{playerName ? `Great run, ${playerName}!` : 'Great run!'}</h2>
        <p className='rankLine' role='status'>{rankLine}</p>

        <div className='heroStat'>
          <span className='label'>Typing Speed (WPM)</span>
          <span className='number'>{s.wpm}</span>
        </div>

        <div className='results'>
          <div className='stat'><span className='label'>Accuracy</span><span className='number'>{s.accuracy}%</span></div>
          <div className='stat'><span className='label'>Right Words</span><span className='number'>{s.right}</span></div>
          <div className='stat'><span className='label'>Wrong Words</span><span className='number'>{s.wrong}</span></div>
          <div className='stat'><span className='label'>Round Time</span><span className='number'>{GAME_SECONDS}s</span></div>
        </div>

        <div className='actions'>
          <button type='button' className='btnPlay' onClick={() => onGame('playgame')}>Play Again</button>
          <button type='button' className='btnSecondary' onClick={onShowLeaderboard}>View Leaderboard</button>
        </div>
        <button type='button' className='linkBtn' onClick={() => onGame(null)}>Change player name</button>
      </section>

      <section className='card connect' aria-labelledby='connect-title'>
        <h2 id='connect-title'>Enjoyed the challenge? Let’s connect!</h2>
        <p className='muted'>I love talking about web development, React and building fun projects. If you’d like to collaborate, have feedback on the game, or just want to say hi, send me a message or find me on LinkedIn.</p>
        <a className='linkedinLink' href={LINKEDIN_URL} target='_blank' rel='noopener noreferrer'>
          <svg width='20' height='20' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'><path d='M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM10 9.5h3.8v1.6h.1c.5-1 1.9-1.9 3.8-1.9 4 0 4.8 2.6 4.8 6V21h-4v-5.1c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21h-4z' /></svg>
          Connect on LinkedIn<span className='sr-only'> (opens in a new tab)</span>
        </a>
        <ContactForm defaultName={playerName} />
      </section>
    </div>
  );
}
