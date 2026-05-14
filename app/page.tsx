'use client';

import { motion } from 'framer-motion';
import { useApp, useLevel } from '@/lib/context';
import { HABITS, MOTIVATIONAL_QUOTES } from '@/lib/gameData';
import XPBar from '@/components/XPBar';
import StreakCard from '@/components/StreakCard';
import DisciplineScore from '@/components/DisciplineScore';
import MissionCard from '@/components/MissionCard';
import HabitDot from '@/components/HabitDot';
import StatsGrid from '@/components/StatsGrid';
import { Zap } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 28 } },
};

function getTodayQuote() {
  const day = new Date().getDate();
  return MOTIVATIONAL_QUOTES[day % MOTIVATIONAL_QUOTES.length];
}

export default function Dashboard() {
  const {
    profile, dailyMissions, completedMissions, completedHabits,
    xp, streak, disciplineScore, completeMission, toggleHabit,
  } = useApp();
  const { level } = useLevel();
  const quote = getTodayQuote();
  const preview = dailyMissions.slice(0, 4);

  return (
    <motion.div variants={container} initial="hidden" animate="show"
      className="min-h-screen bg-black px-4 pt-6 pb-28"
    >
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-3xl font-black tracking-[0.15em] text-gradient-blue">ASCEND</h1>
          <p className="text-white/30 text-xs font-bold tracking-widest mt-0.5">
            {profile ? `BIENVENUE, ${profile.firstName.toUpperCase()}` : 'ÉLÈVE-TOI CHAQUE JOUR'}
          </p>
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
      <motion.div variants={item}
        className="glass rounded-2xl p-4 mb-4 border border-white/10"
        style={{ background: 'linear-gradient(135deg,rgba(0,245,255,0.04),rgba(124,58,237,0.04))' }}
      >
        <p className="text-white/70 text-sm italic leading-relaxed">&ldquo;{quote.text}&rdquo;</p>
        <p className="text-white/30 text-xs mt-2">— {quote.author}</p>
      </motion.div>

      {/* XP Bar */}
      <motion.div variants={item} className="mb-4">
        <XPBar xp={xp} />
      </motion.div>

      {/* Streak + Discipline */}
      <motion.div variants={item} className="grid grid-cols-2 gap-3 mb-5">
        <StreakCard streak={streak} />
        <DisciplineScore score={disciplineScore} />
      </motion.div>

      {/* Missions du jour */}
      <motion.div variants={item} className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase">
            Missions du jour
            {dailyMissions.length > 0 && (
              <span className="ml-2 text-neon-blue/60">
                {completedMissions.length}/{dailyMissions.length}
              </span>
            )}
          </h2>
          <a href="/missions" className="text-neon-blue text-xs font-bold tracking-wider">TOUT VOIR →</a>
        </div>
        {preview.length === 0 ? (
          <div className="glass rounded-2xl p-6 text-center text-white/30 text-sm border border-white/10">
            Configure ton profil pour recevoir tes missions
          </div>
        ) : (
          <div className="space-y-3">
            {preview.map((m) => (
              <MissionCard
                key={m.id}
                mission={m}
                completed={completedMissions.includes(m.id)}
                onComplete={() => completeMission(m.id, m.xp)}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Habitudes */}
      <motion.div variants={item} className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase">Habitudes</h2>
          <a href="/habits" className="text-neon-violet text-xs font-bold tracking-wider">VOIR →</a>
        </div>
        <div className="glass rounded-2xl p-4 border border-white/10">
          <div className="grid grid-cols-4 gap-3">
            {HABITS.map((h) => (
              <HabitDot
                key={h.id}
                id={h.id}
                label={h.label}
                icon={h.icon}
                color={h.color}
                active={completedHabits.includes(h.id)}
                onToggle={() => toggleHabit(h.id)}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item}>
        <h2 className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase mb-3">Statistiques</h2>
        <StatsGrid xp={xp} completedMissions={completedMissions.length} completedHabits={completedHabits.length} />
      </motion.div>
    </motion.div>
  );
}
