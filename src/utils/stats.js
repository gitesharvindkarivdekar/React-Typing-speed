// One place for the round length and scoring maths.
// If your original game calculated WPM / accuracy differently, change computeStats() only.
export const GAME_SECONDS = 60;

export function computeStats(score, seconds = GAME_SECONDS) {
  const right = score?.right ?? 0;
  const wrong = score?.wrong ?? 0;
  const total = right + wrong;
  return {
    right,
    wrong,
    total,
    wpm: Math.round((right * 60) / seconds), // right words per minute
    accuracy: total ? Math.round((right / total) * 100) : 0, // % of submitted words that were right
  };
}
