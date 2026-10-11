import React, { useRef, useState } from 'react';
import ProfilePhoto from './ProfilePhoto';
import { validatePlayerName, MAX_NAME_LENGTH } from '../utils/validation';

export default function Home({ playerName = '', onStart, onShowLeaderboard }) {
  const [value, setValue] = useState(playerName);
  const [touched, setTouched] = useState(false);
  const inputRef = useRef(null);

  const result = validatePlayerName(value);
  const showError = touched && !result.valid;

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!result.valid) { // Start stays "disabled": explain why and move focus to the field
      inputRef.current?.focus();
      return;
    }
    onStart(result.name);
  };

  return (
    <div className='home'>
      <div className='homeLayout'>
        <ProfilePhoto />
        <div className='homeContent'>
          <h1 className='title'>Typing Game</h1>
          <p className='credit'>Coding &amp;<br />Design by <strong>Gitesh Karivdekar</strong></p>

          <form className='nameForm' onSubmit={handleSubmit} noValidate>
            <label htmlFor='playerName'>What should I call you?</label>
            <input
              id='playerName'
              ref={inputRef}
              type='text'
              value={value}
              maxLength={MAX_NAME_LENGTH}
              autoComplete='nickname'
              placeholder='Your name'
              onChange={(e) => setValue(e.target.value)}
              onBlur={() => value && setTouched(true)}
              aria-invalid={showError}
              aria-describedby='nameMsg'
              aria-required='true'
            />
            <p id='nameMsg' className={`fieldMsg ${showError ? 'error' : ''}`} role={showError ? 'alert' : undefined}>
              {showError ? result.message : `Shown on your scorecard and the leaderboard · up to ${MAX_NAME_LENGTH} characters`}
            </p>
            <button type='submit' className={`btnPlay ${result.valid ? '' : 'is-disabled'}`} aria-disabled={!result.valid}>
              Play Game
            </button>
          </form>

          <button type='button' className='linkBtn' onClick={onShowLeaderboard}>View leaderboard</button>
        </div>
      </div>
    </div>
  );
}
