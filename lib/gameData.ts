export const MISSIONS = [
  { id: '1', title: 'Morning Workout', description: '30 min intense training', category: 'fitness', xp: 150, icon: 'Dumbbell', difficulty: 'hard' },
  { id: '2', title: 'Read 20 Pages', description: 'Expand your knowledge', category: 'mind', xp: 80, icon: 'BookOpen', difficulty: 'medium' },
  { id: '3', title: 'Drink 3L Water', description: 'Hydrate your body', category: 'health', xp: 60, icon: 'Droplets', difficulty: 'easy' },
  { id: '4', title: '10K Steps', description: 'Walk and stay active', category: 'fitness', xp: 100, icon: 'Footprints', difficulty: 'medium' },
  { id: '5', title: 'Cold Shower', description: 'Build mental resilience', category: 'discipline', xp: 120, icon: 'Zap', difficulty: 'hard' },
  { id: '6', title: 'No Social Media', description: 'Dopamine reset', category: 'discipline', xp: 200, icon: 'Shield', difficulty: 'hard' },
  { id: '7', title: 'Meditate 10min', description: 'Clear your mind', category: 'mind', xp: 90, icon: 'Brain', difficulty: 'medium' },
  { id: '8', title: 'Journaling', description: 'Reflect and grow', category: 'mind', xp: 70, icon: 'PenLine', difficulty: 'easy' },
];

export const MOTIVATIONAL_QUOTES = [
  { text: "The discipline you build today is the freedom you enjoy tomorrow.", author: "ASCEND" },
  { text: "Your future self is watching you right now through your memories.", author: "Unknown" },
  { text: "Don't limit your challenges. Challenge your limits.", author: "Jerry Dunn" },
  { text: "The pain you feel today will be the strength you feel tomorrow.", author: "Unknown" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { text: "You don't rise to the level of your goals, you fall to the level of your systems.", author: "James Clear" },
];

export const HABITS = [
  { id: 'sleep', label: 'Sleep 8h', icon: 'Moon', color: '#7c3aed' },
  { id: 'water', label: 'Water 3L', icon: 'Droplets', color: '#00f5ff' },
  { id: 'workout', label: 'Workout', icon: 'Dumbbell', color: '#f59e0b' },
  { id: 'nutrition', label: 'Clean Eat', icon: 'Apple', color: '#00ff88' },
  { id: 'focus', label: 'Deep Work', icon: 'Target', color: '#ff6b6b' },
  { id: 'meditation', label: 'Meditate', icon: 'Brain', color: '#c084fc' },
  { id: 'reading', label: 'Reading', icon: 'BookOpen', color: '#60a5fa' },
  { id: 'noPhone', label: 'No Phone', icon: 'PhoneOff', color: '#fb923c' },
];

export const ACHIEVEMENTS = [
  { id: '1', title: 'First Blood', description: 'Complete your first mission', icon: '⚡', unlocked: false, xpRequired: 0 },
  { id: '2', title: 'On Fire', description: '3-day streak', icon: '🔥', unlocked: false, xpRequired: 300 },
  { id: '3', title: 'Iron Will', description: 'Complete 10 hard missions', icon: '💎', unlocked: false, xpRequired: 1000 },
  { id: '4', title: 'Ascendant', description: 'Reach level 5', icon: '🌟', unlocked: false, xpRequired: 2000 },
];

export function calculateLevel(xp: number): { level: number; currentXP: number; requiredXP: number; progress: number } {
  const xpPerLevel = 500;
  const level = Math.floor(xp / xpPerLevel) + 1;
  const currentXP = xp % xpPerLevel;
  const requiredXP = xpPerLevel;
  const progress = (currentXP / requiredXP) * 100;
  return { level, currentXP, requiredXP, progress };
}
