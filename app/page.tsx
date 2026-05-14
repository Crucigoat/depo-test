'use client';

import { motion } from 'framer-motion';
import { useApp } from '@/lib/context';
import { MISSIONS, HABITS, calculateLevel } from '@/lib/gameData';
import QuoteCard from '@/components/QuoteCard';
import XPBar from '@/components/XPBar';
import StreakCard from '@/components/StreakCard';
import DisciplineScore from '@/components/DisciplineScore';
import MissionCard from '@/components/MissionCard';
import HabitDot from '@/components/HabitDot';
import StatsGrid from '@/components/StatsGrid';
import { Zap } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 25 } },
};

export default function Dashboard() {
  const { completedMissions, completedHabits, xp, streak, disciplineScore, completeMission, toggleHabit } = useApp();
  const { level } = calculateLevel(xp);

  const topMissions = MISSIONS.slice(0, 4);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-black px-4 pt-6 pb-28"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-5">
        <div>
          <h1
            className="text-3xl font-black tracking-[0.15em] text-gradient-blue"
          >
            ASCEND
          </h1>
          <p className="text-white/30 text-xs font-bold tracking-widest mt-0.5">LEVEL UP YOUR LIFE</p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="px-3 py-1.5 rounded-xl bg-neon-gold/10 border border-neon-gold/30 flex items-center gap-1.5"
            style={{ boxShadow: '0 0 15px rgba(245,158,11,0.2)' }}
          >
            <Zap size={12} className="text-neon-gold" />
            <span className="text-neon-gold font-black text-sm">{xp} XP</span>
          </div>
          <div
            className="w-9 h-9 rounded-xl bg-neon-blue/10 border border-neon-blue/30 flex items-center justify-center"
            style={{ boxShadow: '0 0 15px rgba(0,245,255,0.2)' }}
          >
            <span className="text-neon-blue font-black text-sm">{level}</span>
          </div>
        </div>
      </motion.div>

      {/* Quote */}
      <motion.div variants={itemVariants} className="mb-4">
        <QuoteCard />
      </motion.div>

      {/* XP Bar */}
      <motion.div variants={itemVariants} className="mb-4">
        <XPBar xp={xp} />
      </motion.div>

      {/* Streak + Discipline */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-5">
        <StreakCard streak={streak} />
        <DisciplineScore score={disciplineScore} />
      </motion.div>

      {/* Today's Missions */}
      <motion.div variants={itemVariants} className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase">
            TODAY&apos;S MISSIONS
          </h2>
          <a href="/missions" className="text-neon-blue text-xs font-bold tracking-wider">SEE ALL →</a>
        </div>
        <div className="space-y-3">
          {topMissions.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              completed={completedMissions.includes(mission.id)}
              onComplete={() => completeMission(mission.id, mission.xp)}
            />
          ))}
        </div>
      </motion.div>

      {/* Habits Quick View */}
      <motion.div variants={itemVariants} className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase">HABITS</h2>
          <a href="/habits" className="text-neon-violet text-xs font-bold tracking-wider">SEE ALL →</a>
        </div>
        <div className="glass rounded-2xl p-4 border border-white/10">
          <div className="grid grid-cols-4 gap-3">
            {HABITS.slice(0, 8).map((habit) => (
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

      {/* Stats Grid */}
      <motion.div variants={itemVariants}>
        <h2 className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase mb-3">STATS</h2>
        <StatsGrid
          xp={xp}
          completedMissions={completedMissions.length}
          completedHabits={completedHabits.length}
        />
      </motion.div>
    </motion.div>
  );
}
