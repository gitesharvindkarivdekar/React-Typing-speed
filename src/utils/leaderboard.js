export const MAX_ENTRIES = 10;

// Ranking: WPM (desc) -> accuracy (desc) -> earlier result first.
const compare = (a, b) => b.wpm - a.wpm || b.accuracy - a.accuracy || a.playedAt - b.playedAt;

/** Returns a NEW list with the entry added, sorted, and cut to the top 10. Never mutates. */
export function addResult(list, entry) {
  return [...list, entry].sort(compare).slice(0, MAX_ENTRIES);
}
