'use client';

import React, {
  createContext, useContext, useState, useCallback, useEffect, useMemo,
} from 'react';
import { HABITS, calculateLevel, type Mission } from './gameData';
import { generateDailyMissions } from './missionGenerator';
import type { UserProfile } from './profileTypes';
import type { TodoItem } from './todoTypes';
import { generateShareCode, decodeShareCode, type FriendData } from './friendsUtils';

export type { FriendData };

const STORAGE_KEYS = {
  PROFILE: 'ascend_profile',
  XP: 'ascend_xp',
  STREAK: 'ascend_streak',
  LAST_DATE: 'ascend_last_date',
  COMPLETED_MISSIONS: 'ascend_completed_missions',
  COMPLETED_HABITS: 'ascend_completed_habits',
  DAILY_MISSIONS: 'ascend_daily_missions',
  TODOS: 'ascend_todos',
  API_KEY: 'ascend_api_key',
  NOTIF_TIME: 'ascend_notif_time',
  FRIENDS: 'ascend_friends',
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
  // Todo list
  todoItems: TodoItem[];
  addTodo: (text: string, category: TodoItem['category'], targetDate: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  // API key
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
  // Notification time
  notifTime: string | null;
  setNotifTime: (time: string | null) => void;
  // Friends
  friends: FriendData[];
  addFriend: (code: string) => 'ok' | 'invalid' | 'already_added';
  removeFriend: (code: string) => void;
  myShareCode: string;
  // Level up
  justLeveledUp: boolean;
  clearLevelUp: () => void;
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
  const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
  const [apiKey, setApiKeyState] = useState<string | null>(null);
  const [notifTime, setNotifTimeState] = useState<string | null>(null);
  const [friends, setFriends] = useState<FriendData[]>([]);
  const [prevLevel, setPrevLevel] = useState(0);
  const [justLeveledUp, setJustLeveledUp] = useState(false);

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

      // Load todos
      const rawTodos = localStorage.getItem(STORAGE_KEYS.TODOS);
      const storedTodos: TodoItem[] = rawTodos ? JSON.parse(rawTodos) : [];

      // Load API key
      const storedApiKey = localStorage.getItem(STORAGE_KEYS.API_KEY);

      // Load notif time
      const storedNotifTime = localStorage.getItem(STORAGE_KEYS.NOTIF_TIME);

      // Load friends
      const rawFriends = localStorage.getItem(STORAGE_KEYS.FRIENDS);
      const storedFriends: FriendData[] = rawFriends ? JSON.parse(rawFriends) : [];

      setProfile(storedProfile);
      setXp(storedXp);
      setStreak(currentStreak);
      setCompletedMissions(completedM);
      setCompletedHabits(completedH);
      setDailyMissions(missions);
      setTodoItems(storedTodos);
      setApiKeyState(storedApiKey);
      setNotifTimeState(storedNotifTime);
      setFriends(storedFriends);
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

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todoItems));
  }, [todoItems, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    if (apiKey !== null) {
      localStorage.setItem(STORAGE_KEYS.API_KEY, apiKey);
    } else {
      localStorage.removeItem(STORAGE_KEYS.API_KEY);
    }
  }, [apiKey, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    if (notifTime !== null) {
      localStorage.setItem(STORAGE_KEYS.NOTIF_TIME, notifTime);
    } else {
      localStorage.removeItem(STORAGE_KEYS.NOTIF_TIME);
    }
  }, [notifTime, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEYS.FRIENDS, JSON.stringify(friends));
  }, [friends, isLoaded]);

  // Level up detection
  useEffect(() => {
    if (!isLoaded || xp === 0) return;
    const { level: newLevel } = calculateLevel(xp);
    if (prevLevel > 0 && newLevel > prevLevel) {
      setJustLeveledUp(true);
    }
    setPrevLevel(newLevel);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xp, isLoaded]);

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

  const addTodo = useCallback((text: string, category: TodoItem['category'], targetDate: string) => {
    const newItem: TodoItem = {
      id: `todo_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      text,
      completed: false,
      category,
      targetDate,
      createdAt: new Date().toISOString(),
    };
    setTodoItems((prev) => [...prev, newItem]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodoItems((prev) =>
      prev.map((item) => item.id === id ? { ...item, completed: !item.completed } : item),
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodoItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const setApiKey = useCallback((key: string | null) => {
    setApiKeyState(key);
  }, []);

  const setNotifTime = useCallback((time: string | null) => {
    setNotifTimeState(time);
  }, []);

  const myShareCode = useMemo(() => {
    if (!profile) return '';
    const { level } = calculateLevel(xp);
    return generateShareCode(profile.firstName, level, xp, streak, profile.goals, profile.gameMode);
  }, [profile, xp, streak]);

  const friendsRef = React.useRef<FriendData[]>(friends);
  useEffect(() => { friendsRef.current = friends; }, [friends]);

  const addFriend = useCallback((code: string): 'ok' | 'invalid' | 'already_added' => {
    const decoded = decodeShareCode(code);
    if (!decoded) return 'invalid';
    if (friendsRef.current.some((f) => f.code === code)) return 'already_added';
    setFriends((prev) => [...prev, decoded]);
    return 'ok';
  }, []);

  const removeFriend = useCallback((code: string) => {
    setFriends((prev) => prev.filter((f) => f.code !== code));
  }, []);

  const clearLevelUp = useCallback(() => {
    setJustLeveledUp(false);
  }, []);

  return (
    <AppContext.Provider value={{
      profile, dailyMissions, completedMissions, completedHabits,
      xp, streak, disciplineScore, isLoaded,
      saveProfile, completeMission, toggleHabit,
      todoItems, addTodo, toggleTodo, deleteTodo,
      apiKey, setApiKey,
      notifTime, setNotifTime,
      friends, addFriend, removeFriend, myShareCode,
      justLeveledUp, clearLevelUp,
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
