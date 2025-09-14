// services/formatStats.js
import { transformContestHistory } from "../utils/transformHistory";

export function formatStats(rawStats) {
  if (!rawStats || Object.keys(rawStats).length === 0) {
    return {
      overviewStats: {
        totalSolved: 0,
        currentStreak: 0,
        maxStreak: 0,
        contestsAttended: 0,
      },
      topicData: [],
      tagData: [],
      ratingTrend: [],
      leetcode_contest_data: [],
      codeforces_contest_data: [],
      rating: 0,
      badge: "",
      globalRank: 0,
      cal: "{}",
      codeforces: {},
    };
  }
  // console.log("-----------------formatter service------------------", rawStats)
  // --- Overview ---
  const overviewStats = {
    totalSolved: (rawStats.leetcode?.totalSolved || 0)  + (rawStats.codeforces?.totalAccepted || 0),
    currentStreak: rawStats.leetcode?.streak || 0,
    maxStreak: rawStats.leetcode?.maxStreak || 0,
    contestsAttended:
      (rawStats.leetcode?.contests?.attended || 0) +
      (rawStats.codeforces?.totalContests || 0) + // ✅ updated
      (rawStats.codechef?.contests?.attended || 0) +
      (rawStats.atcoder?.contests?.attended || 0),
  };

  // --- Topic wise ---
  const topicData = Object.entries(rawStats.leetcode?.topicWise || {}).map(
    ([topic, solved]) => ({ topic, solved })
  );

  // --- Tag wise ---
  const tagData = Object.entries(rawStats.leetcode?.tagWise || {}).map(
    ([tag, solved]) => ({ tag, solved })
  );

  // --- Individual Contest Histories ---
  const lcHistory = transformContestHistory(
    rawStats.leetcode?.contests?.history || [],
    "leetcode"
  );

  const cfHistory = transformContestHistory(
    rawStats.codeforces?.ratingHistory || [], // ✅ updated
    "codeforces"
  );

  // For combined rating trend → merge LC + CF by timestamp
  const allHistory = [...lcHistory, ...cfHistory].sort(
    (a, b) => a.timestamp - b.timestamp
  );
// Keep only entries with a numeric rating


const ratingTrend = allHistory
  .filter((c) => c.rating != null && !isNaN(Number(c.rating)) && (c.platform === "leetcode" ? c.rating>1500 : true))
  .map((c) => ({
    contest: c.contest,
    timestamp: c.timestamp,
    leetcode: c.platform === "leetcode" ? c.rating : null,
    codeforces: c.platform === "codeforces" ? c.rating : null,
  }));

const leetcode_contest_data = lcHistory
  .filter((c) => c.rating != null && !isNaN(Number(c.rating)) && c.rating > 1500)
  .map((c) => ({
    contest: c.contest,
    timestamp: c.timestamp,
    leetcode: c.rating,
  }));


  const codeforces_contest_data = cfHistory.map((c) => ({
    contest: c.contest,
    timestamp: c.timestamp,
    codeforces: c.rating,
  }));

  // --- Calendar (from submissionCalendar string if saved) ---
  // let cal = {};
  const cal = rawStats.leetcode?.submissionCalendar || "{}";

  // console.log(ratingTrend);
  return {
    overviewStats,
    topicData,
    tagData,
    ratingTrend,
    leetcode_contest_data,
    codeforces_contest_data,
    rating: rawStats.leetcode?.rating || 0,
    badge: rawStats.leetcode?.badge || "",
    globalRank: rawStats.leetcode?.globalRank || 0,
    cal,
    codeforces: rawStats.codeforces || {},
  };
}
