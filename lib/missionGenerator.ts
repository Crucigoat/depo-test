import { type Mission, ALL_MISSIONS } from './gameData';
import type { UserProfile, Level, TimeAvailable, GameMode } from './profileTypes';

const LEVEL_ORDER: Level[] = ['sedentary', 'beginner', 'intermediate', 'advanced'];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function getTodaySeed(): number {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

function levelIndex(l: Level): number {
  return LEVEL_ORDER.indexOf(l);
}

function scoreMission(mission: Mission, profile: UserProfile): number {
  let score = 0;

  // Goal match (heavy weight)
  for (const goal of profile.goals) {
    if (mission.goals.includes(goal)) score += 40;
  }

  // Weakness match
  for (const weakness of profile.weaknesses) {
    if (mission.weaknesses.includes(weakness)) score += 20;
  }

  // Difficulty match per game mode
  if (profile.gameMode === 'normal') {
    if (mission.difficulty === 'easy') score += 10;
    if (mission.difficulty === 'medium') score += 15;
    if (mission.difficulty === 'hard') score += 5;
  } else if (profile.gameMode === 'hard') {
    if (mission.difficulty === 'medium') score += 15;
    if (mission.difficulty === 'hard') score += 25;
  } else {
    // extreme
    if (mission.difficulty === 'hard') score += 35;
    if (mission.difficulty === 'medium') score += 10;
  }

  return score;
}

function filterByLevel(missions: Mission[], userLevel: Level): Mission[] {
  const uIdx = levelIndex(userLevel);
  return missions.filter((m) => levelIndex(m.minLevel) <= uIdx);
}

function filterByTime(missions: Mission[], timeAvailable: TimeAvailable): Mission[] {
  if (timeAvailable === 'short') {
    return missions.filter((m) => m.duration === 'short');
  }
  if (timeAvailable === 'medium') {
    return missions.filter((m) => m.duration === 'short' || m.duration === 'medium');
  }
  // long or unlimited: all durations allowed
  return missions;
}

function missionCount(gameMode: GameMode, timeAvailable: TimeAvailable): number {
  const base = gameMode === 'normal' ? 5 : gameMode === 'hard' ? 6 : 8;
  // If time is short, limit to 4
  if (timeAvailable === 'short') return Math.min(base, 4);
  return base;
}

export function generateDailyMissions(profile: UserProfile): Mission[] {
  const rand = seededRandom(getTodaySeed() + profile.firstName.length * 31);

  let pool = filterByLevel(ALL_MISSIONS, profile.level);
  pool = filterByTime(pool, profile.timeAvailable);

  if (pool.length === 0) pool = ALL_MISSIONS;

  // Score and shuffle (add small random noise to break ties differently each day)
  const scored = pool.map((m) => ({
    mission: m,
    score: scoreMission(m, profile) + rand() * 15,
  }));

  scored.sort((a, b) => b.score - a.score);

  const count = missionCount(profile.gameMode, profile.timeAvailable);

  // Ensure category diversity: take top missions but limit 2 per category
  const selected: Mission[] = [];
  const categoryCounts: Record<string, number> = {};

  for (const { mission } of scored) {
    if (selected.length >= count) break;
    const cat = mission.category;
    if ((categoryCounts[cat] ?? 0) >= 2) continue;
    selected.push(mission);
    categoryCounts[cat] = (categoryCounts[cat] ?? 0) + 1;
  }

  // Fill up if needed (relax category constraint)
  if (selected.length < count) {
    for (const { mission } of scored) {
      if (selected.length >= count) break;
      if (!selected.find((m) => m.id === mission.id)) {
        selected.push(mission);
      }
    }
  }

  return selected;
}
