export type AgeRange = '16-20' | '21-25' | '26-30' | '31-35' | '36-45' | '46+';

export type Goal =
  | 'muscle'
  | 'weightloss'
  | 'cardio'
  | 'productivity'
  | 'mental'
  | 'sleep'
  | 'nutrition'
  | 'social'
  | 'career'
  | 'discipline';

export type Level = 'sedentary' | 'beginner' | 'intermediate' | 'advanced';

export type TimeAvailable = 'short' | 'medium' | 'long' | 'unlimited';

export type Weakness =
  | 'screens'
  | 'food'
  | 'sleep'
  | 'procrastination'
  | 'stress'
  | 'sedentary'
  | 'focus'
  | 'social'
  | 'addictions'
  | 'finances';

export type Rhythm = 'early' | 'morning' | 'night' | 'variable';

export type GameMode = 'normal' | 'hard' | 'extreme';

export type Motivation =
  | 'health'
  | 'appearance'
  | 'success'
  | 'inspire'
  | 'peace'
  | 'prove';

export interface UserProfile {
  firstName: string;
  ageRange: AgeRange;
  goals: Goal[];
  level: Level;
  timeAvailable: TimeAvailable;
  weaknesses: Weakness[];
  rhythm: Rhythm;
  gameMode: GameMode;
  motivations: Motivation[];
  createdAt: string;
  updatedAt: string;
}
