import React from 'react';
import { MAX_ENTRIES } from '../utils/leaderboard';

function TrophyIcon() {
  return (
    <svg width='64' height='64' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
      <path d='M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3' />
    </svg>
  );
}

export default function Leaderboard({ entries, storageError, highlightId, onBack, backLabel = 'Back' }) {
  return (
    <div className='leaderboardPage'>
      <section className='card' aria-labelledby='lb-title'>
        <h2 id='lb-title'>Top {MAX_ENTRIES} Leaderboard</h2>
        <p className='muted'>Ranked by words per minute, then accuracy.</p>

        {entries.length === 0 ? (
          <div className='lbEmpty'>
            <TrophyIcon />
            <p><strong>No scores yet</strong></p>
            <p className='muted'>Finish a round and your name could be the first on the board.</p>
          </div>
        ) : (
          <div className='lbWrap'>
            <table className='lbTable'>
              <caption className='sr-only'>Top {MAX_ENTRIES} typing results saved in this browser</caption>
              <thead>
                <tr><th scope='col'>Rank</th><th scope='col'>Player</th><th scope='col'>WPM</th><th scope='col'>Accuracy</th><th scope='col' className='hideSm'>Right</th><th scope='col' className='hideSm'>Wrong</th></tr>
              </thead>
              <tbody>
                {entries.map((e, i) => (
                  <tr key={e.id} className={e.id === highlightId ? 'me' : ''} aria-current={e.id === highlightId ? 'true' : undefined}>
                    <td><span className={`rankBadge r${i + 1}`}>{i + 1}</span></td>
                    <th scope='row' className='lbName'>{e.name}{e.id === highlightId && <span className='youTag'> (you)</span>}</th>
                    <td className='num'>{e.wpm}</td>
                    <td className='num'>{e.accuracy}%</td>
                    <td className='num hideSm'>{e.right}</td>
                    <td className='num hideSm'>{e.wrong}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className='note'>Your top scores are saved in this browser and stay after refresh. They aren’t shared with other players or devices.</p>
        {storageError && <p className='formError' role='alert'>{storageError}</p>}
        <button type='button' className='btnSecondary' onClick={onBack}>{backLabel}</button>
      </section>
    </div>
  );
}
