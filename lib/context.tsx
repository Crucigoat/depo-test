'use client';

import React, {
  createContext, useContext, useState, useCallback, useEffect,
} from 'react';
import { HABITS, calculateLevel, type Mission } from './gameData';
import { generateDailyMissions } from './missionGenerator';
import type { UserProfile } from './profileTypes';

const STORAGE_KEYS = {
  PROFILE: 'ascend_profile',
  XP: 'ascend_xp',
  STREAK: 'ascend_streak',
  LAST_DATE: 'ascend_last_date',
  COMPLETED_MISSIONS: 'ascend_completed_missions',
  COMPLETED_HABITS: 'ascend_completed_habits',
  DAILY_MISSIONS: 'ascend_daily_missions',
};

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

interface AppState {
  profile: UserProfile | null;
  dailyMissions: Mission[];
  completedMissions: string[];
  completedHabits: string[];
  xp: number;
  streak: number;
  disciplineScore: number;
  isLoaded: boolean;
  saveProfile: (p: UserProfile) => void;
  completeMission: (id: string, missionXp: number) => void;
  toggleHabit: (id: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dailyMissions, setDailyMissions] = useState<Mission[]>([]);
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);

  // ── Bootstrap from localStorage ───────────────────────────────────────────
  useEffect(() => {
    try {
      const rawProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
      const storedProfile: UserProfile | null = rawProfile ? JSON.parse(rawProfile) : null;

      const storedXp = parseInt(localStorage.getItem(STORAGE_KEYS.XP) ?? '0', 10);
      const storedStreak = parseInt(localStorage.getItem(STORAGE_KEYS.STREAK) ?? '0', 10);
      const lastDate = localStorage.getItem(STORAGE_KEYS.LAST_DATE) ?? '';
      const today = todayStr();

      // Streak logic
      let currentStreak = storedStreak;
      if (lastDate) {
        const last = new Date(lastDate);
        const now = new Date(today);
        const diff = Math.round((now.getTime() - last.getTime()) / 86400000);
        if (diff > 1) currentStreak = 0; // missed a day
      }

      // Daily reset
      let completedM: string[] = [];
      let completedH: string[] = [];
      if (lastDate === today) {
        completedM = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMPLETED_MISSIONS) ?? '[]');
        completedH = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMPLETED_HABITS) ?? '[]');
      }

      // Daily missions
      let missions: Mission[] = [];
      if (storedProfile) {
        const raw = localStorage.getItem(STORAGE_KEYS.DAILY_MISSIONS);
        if (raw) {
          try {
            const parsed = JSON.parse(raw) as { date: string; missions: Mission[] };
            missions = parsed.date === today ? parsed.missions : generateDailyMissions(storedProfile);
          } catch {
            missions = generateDailyMissions(storedProfile);
          }
        } else {
          missions = generateDailyMissions(storedProfile);
        }
        localStorage.setItem(
          STORAGE_KEYS.DAILY_MISSIONS,
          JSON.stringify({ date: today, missions }),
        );
      }

      setProfile(storedProfile);
      setXp(storedXp);
      setStreak(currentStreak);
      setCompletedMissions(completedM);
      setCompletedHabits(completedH);
      setDailyMissions(missions);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // ── Persist xp / streak / completed on change ─────────────────────────────
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEYS.XP, String(xp));
  }, [xp, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEYS.STREAK, String(streak));
  }, [streak, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEYS.COMPLETED_MISSIONS, JSON.stringify(completedMissions));
    localStorage.setItem(STORAGE_KEYS.LAST_DATE, todayStr());
  }, [completedMissions, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEYS.COMPLETED_HABITS, JSON.stringify(completedHabits));
  }, [completedHabits, isLoaded]);

  const disciplineScore = Math.round(
    ((completedMissions.length + completedHabits.length) /
      Math.max(dailyMissions.length + HABITS.length, 1)) * 100,
  );

  // ── Actions ───────────────────────────────────────────────────────────────
  const saveProfile = useCallback((p: UserProfile) => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(p));
    const missions = generateDailyMissions(p);
    localStorage.setItem(
      STORAGE_KEYS.DAILY_MISSIONS,
      JSON.stringify({ date: todayStr(), missions }),
    );
    setProfile(p);
    setDailyMissions(missions);
    setCompletedMissions([]);
    // Give a small head-start XP only on first-time creation
    const existing = localStorage.getItem(STORAGE_KEYS.XP);
    if (!existing || existing === '0') {
      setXp(100);
      setStreak(0);
    }
  }, []);

  const completeMission = useCallback((id: string, missionXp: number) => {
    setCompletedMissions((prev) => {
      if (prev.includes(id)) return prev;
      setXp((x) => x + missionXp);
      setStreak((s) => {
        const last = localStorage.getItem(STORAGE_KEYS.LAST_DATE) ?? '';
        const today = todayStr();
        if (last !== today) return s + 1;
        return s;
      });
      return [...prev, id];
    });
  }, []);

  const toggleHabit = useCallback((id: string) => {
    setCompletedHabits((prev) =>
      prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id],
    );
  }, []);

  return (
    <AppContext.Provider value={{
      profile, dailyMissions, completedMissions, completedHabits,
      xp, streak, disciplineScore, isLoaded,
      saveProfile, completeMission, toggleHabit,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function useLevel() {
  const { xp } = useApp();
  return calculateLevel(xp);
}
