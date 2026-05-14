'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { MISSIONS, HABITS } from './gameData';

interface AppState {
  completedMissions: string[];
  completedHabits: string[];
  xp: number;
  streak: number;
  disciplineScore: number;
  completeMission: (id: string, missionXp: number) => void;
  toggleHabit: (id: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);
  const [xp, setXp] = useState(350);
  const streak = 7;

  const disciplineScore = Math.round(
    ((completedMissions.length + completedHabits.length) / (MISSIONS.length + HABITS.length)) * 100
  );

  const completeMission = useCallback((id: string, missionXp: number) => {
    setCompletedMissions((prev) => {
      if (prev.includes(id)) return prev;
      setXp((x) => x + missionXp);
      return [...prev, id];
    });
  }, []);

  const toggleHabit = useCallback((id: string) => {
    setCompletedHabits((prev) => {
      if (prev.includes(id)) {
        return prev.filter((h) => h !== id);
      }
      return [...prev, id];
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        completedMissions,
        completedHabits,
        xp,
        streak,
        disciplineScore,
        completeMission,
        toggleHabit,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
