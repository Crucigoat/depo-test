'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/context';
import { MISSIONS } from '@/lib/gameData';
import MissionCard from '@/components/MissionCard';
import { Calendar, Trophy } from 'lucide-react';

type Filter = 'all' | 'active' | 'completed';

export default function MissionsPage() {
  const { completedMissions, completeMission } = useApp();
  const [filter, setFilter] = useState<Filter>('all');

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  const earnedXP = MISSIONS
    .filter((m) => completedMissions.includes(m.id))
    .reduce((sum, m) => sum + m.xp, 0);

  const completionPct = Math.round((completedMissions.length / MISSIONS.length) * 100);

  const filtered = MISSIONS.filter((m) => {
    if (filter === 'active') return !completedMissions.includes(m.id);
    if (filter === 'completed') return completedMissions.includes(m.id);
    return true;
  });

  const allDone = completedMissions.length === MISSIONS.length;

  return (
    <div className="min-h-screen bg-black px-4 pt-6 pb-28">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
        <h1 className="text-2xl font-black tracking-[0.12em] text-gradient-blue mb-1">
          DAILY MISSIONS
        </h1>
        <div className="flex items-center gap-1.5 text-white/40">
          <Calendar size={12} />
          <p className="text-xs font-medium">{dateStr}</p>
        </div>
      </motion.div>

      {/* XP + Progress */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-4 border border-white/10 mb-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-white/40 text-xs font-bold tracking-widest">XP EARNED TODAY</p>
            <p className="text-neon-gold font-black text-2xl">+{earnedXP} XP</p>
          </div>
          <div className="flex items-center gap-2">
            <Trophy size={20} className="text-neon-gold" />
            <div className="text-right">
              <p className="text-white font-black text-xl">{completedMissions.length}/{MISSIONS.length}</p>
              <p className="text-white/30 text-xs">DONE</p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-neon-blue to-neon-violet"
            initial={{ width: 0 }}
            animate={{ width: `${completionPct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            style={{ boxShadow: '0 0 10px rgba(0,245,255,0.4)' }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <p className="text-white/20 text-xs">{completionPct}% complete</p>
          <p className="text-white/20 text-xs">{MISSIONS.length - completedMissions.length} remaining</p>
        </div>
      </motion.div>

      {/* Filter tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="flex gap-2 mb-4"
      >
        {(['all', 'active', 'completed'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold tracking-widest transition-all ${
              filter === f
                ? 'bg-neon-blue/20 border border-neon-blue/40 text-neon-blue'
                : 'bg-white/5 border border-white/10 text-white/30'
            }`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </motion.div>

      {/* Mission list */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 && allDone && (
          <motion.div
            key="empty-all"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-16 gap-3"
          >
            <span className="text-5xl">🏆</span>
            <p className="text-white font-black text-xl">ALL MISSIONS COMPLETE</p>
            <p className="text-white/30 text-sm">You&apos;re an absolute legend today.</p>
          </motion.div>
        )}

        {filtered.length === 0 && !allDone && filter !== 'all' && (
          <motion.div
            key="empty-filter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-16 gap-2"
          >
            <p className="text-white/40 text-sm">No {filter} missions.</p>
          </motion.div>
        )}

        <div className="space-y-3">
          {filtered.map((mission, i) => (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, type: 'spring', stiffness: 300, damping: 25 }}
            >
              <MissionCard
                mission={mission}
                completed={completedMissions.includes(mission.id)}
                onComplete={() => completeMission(mission.id, mission.xp)}
              />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}
