export const MAX_ENTRIES = 10;
const STORAGE_KEY = 'typinggame.leaderboard';

// Ranking: WPM (desc) -> accuracy (desc) -> earlier result first.
const compare = (a, b) => b.wpm - a.wpm || b.accuracy - a.accuracy || a.playedAt - b.playedAt;

/** Returns a NEW list with the entry added, sorted, and cut to the top 10. Never mutates. */
export function addResult(list, entry) {
  return [...list, entry].sort(compare).slice(0, MAX_ENTRIES);
}

function isLeaderboardEntry(entry) {
  return entry &&
    typeof entry.id === 'string' &&
    typeof entry.name === 'string' &&
    Number.isFinite(entry.wpm) &&
    Number.isFinite(entry.accuracy) &&
    Number.isFinite(entry.right) &&
    Number.isFinite(entry.wrong) &&
    Number.isFinite(entry.playedAt);
}

export function loadResults() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return { entries: [], error: '' };

    const entries = JSON.parse(saved);
    if (!Array.isArray(entries) || !entries.every(isLeaderboardEntry)) {
      throw new Error('Saved leaderboard data has an invalid format.');
    }
    return { entries: entries.sort(compare).slice(0, MAX_ENTRIES), error: '' };
  } catch (error) {
    console.error('Unable to load the saved leaderboard.', error);
    return {
      entries: [],
      error: 'Saved scores could not be loaded from this browser.'
    };
  }
}

export function saveResults(entries) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}
