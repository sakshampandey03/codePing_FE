export function transformContestHistory(history, platform) {
  if (!history || !Array.isArray(history)) return [];

  return history
    .map((c, idx) => {
      const t = c.timestamp || c.time;
      const ts = t instanceof Date ? t.getTime() : new Date(t).getTime();
      return {
        contest: c.contestName || c.contest || `${platform}-${idx + 1}`,
        timestamp: isNaN(ts) ? null : ts,
        rating: Number(c.rating),
        rank: c.rank ?? null,
        platform,
      };
    })
    .filter(c => c.timestamp && !isNaN(c.rating)); // ✅ skip invalid entries
}
