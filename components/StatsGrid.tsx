'use client';

import { motion } from 'framer-motion';
import { Zap, Star, CheckCircle, Activity } from 'lucide-react';
import { calculateLevel } from '@/lib/gameData';

interface StatsGridProps {
  xp: number;
  completedMissions: number;
  completedHabits: number;
}

export default function StatsGrid({ xp, completedMissions, completedHabits }: StatsGridProps) {
  const { level } = calculateLevel(xp);

  const stats = [
    { icon: Zap, label: 'TOTAL XP', value: xp, color: '#f59e0b', glow: 'glow-gold' },
    { icon: Star, label: 'LEVEL', value: level, color: '#00f5ff', glow: 'glow-blue' },
    { icon: CheckCircle, label: 'MISSIONS', value: completedMissions, color: '#00ff88', glow: 'glow-green' },
    { icon: Activity, label: 'HABITS', value: completedHabits, color: '#7c3aed', glow: 'glow-violet' },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, type: 'spring', stiffness: 300, damping: 25 }}
          className="glass rounded-xl p-3 border border-white/10 flex flex-col items-center gap-1"
        >
          <stat.icon size={16} style={{ color: stat.color }} />
          <p className="text-white font-black text-lg leading-none">{stat.value}</p>
          <p className="text-white/30 text-[9px] font-bold tracking-wider text-center">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
