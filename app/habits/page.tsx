'use client';

import { motion } from 'framer-motion';
import { useApp } from '@/lib/context';
import { HABITS } from '@/lib/gameData';
import HabitDot from '@/components/HabitDot';
import FocusTimer from '@/components/FocusTimer';

// Fake weekly data for display
const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
// Mock previous days completion (true/false per habit per day)
function getMockWeekData(habitIndex: number, dayIndex: number): boolean {
  const seed = (habitIndex * 7 + dayIndex * 3) % 10;
  return seed > 3;
}

export default function HabitsPage() {
  const { completedHabits, toggleHabit } = useApp();

  const completedCount = completedHabits.length;
  const totalHabits = HABITS.length;
  const consistencyPct = Math.round((completedCount / totalHabits) * 100);

  return (
    <div className="min-h-screen bg-black px-4 pt-6 pb-28">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
        <h1 className="text-2xl font-black tracking-[0.12em] text-gradient-blue mb-1">
          HABIT MATRIX
        </h1>
        <p className="text-white/40 text-xs font-medium">Track your daily disciplines</p>
      </motion.div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-4 border border-neon-violet/20 mb-4"
        style={{ boxShadow: '0 0 20px rgba(124,58,237,0.1)' }}
      >
        <div className="flex items-center justify-between mb-2">
          <p className="text-white/40 text-xs font-bold tracking-widest">TODAY&apos;S CONSISTENCY</p>
          <p className="text-neon-violet font-black">{completedCount}/{totalHabits}</p>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-neon-violet to-neon-blue"
            initial={{ width: 0 }}
            animate={{ width: `${consistencyPct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            style={{ boxShadow: '0 0 10px rgba(124,58,237,0.5)' }}
          />
        </div>
        <p className="text-white/20 text-xs mt-1">{consistencyPct}% consistency today</p>
      </motion.div>

      {/* Today's Habits */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-5"
      >
        <h2 className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase mb-3">TODAY&apos;S HABITS</h2>
        <div className="glass rounded-2xl p-4 border border-white/10">
          <div className="grid grid-cols-4 gap-4">
            {HABITS.map((habit) => (
              <HabitDot
                key={habit.id}
                id={habit.id}
                label={habit.label}
                icon={habit.icon}
                color={habit.color}
                active={completedHabits.includes(habit.id)}
                onToggle={() => toggleHabit(habit.id)}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Weekly Matrix */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-5"
      >
        <h2 className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase mb-3">WEEKLY GRID</h2>
        <div className="glass rounded-2xl p-4 border border-white/10 overflow-x-auto">
          <div className="min-w-0">
            {/* Day headers */}
            <div className="grid mb-2" style={{ gridTemplateColumns: '60px repeat(7, 1fr)' }}>
              <div />
              {WEEK_DAYS.map((d, i) => (
                <div key={i} className="text-center">
                  <span className="text-white/30 text-[10px] font-bold">{d}</span>
                </div>
              ))}
            </div>

            {/* Habit rows */}
            <div className="space-y-2">
              {HABITS.map((habit, habitIdx) => (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: habitIdx * 0.05 }}
                  className="grid items-center"
                  style={{ gridTemplateColumns: '60px repeat(7, 1fr)' }}
                >
                  <span className="text-white/40 text-[10px] font-bold truncate pr-2">{habit.label.split(' ')[0].toUpperCase()}</span>
                  {WEEK_DAYS.map((_, dayIdx) => {
                    const isToday = dayIdx === 3; // Wednesday as "today" for display
                    const filled = isToday
                      ? completedHabits.includes(habit.id)
                      : getMockWeekData(habitIdx, dayIdx);
                    return (
                      <div key={dayIdx} className="flex justify-center">
                        <div
                          className={`w-5 h-5 rounded-md transition-all ${
                            filled ? 'opacity-90' : 'bg-white/5 border border-white/8'
                          }`}
                          style={
                            filled
                              ? { backgroundColor: `${habit.color}40`, border: `1px solid ${habit.color}60` }
                              : undefined
                          }
                        />
                      </div>
                    );
                  })}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Habit Streaks */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mb-5"
      >
        <h2 className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase mb-3">HABIT STREAKS</h2>
        <div className="space-y-2">
          {HABITS.map((habit, i) => {
            const streak = [4, 7, 2, 12, 3, 6, 9, 1][i % 8];
            const active = completedHabits.includes(habit.id);
            return (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-xl p-3 border border-white/8 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: active ? habit.color : 'rgba(255,255,255,0.2)' }}
                  />
                  <span className="text-white/70 text-sm font-medium">{habit.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs">🔥</span>
                  <span className="text-white font-bold text-sm">{streak}d</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Focus Timer */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase mb-3">FOCUS MODE</h2>
        <FocusTimer />
      </motion.div>
    </div>
  );
}
