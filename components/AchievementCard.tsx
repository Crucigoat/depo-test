'use client';

import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  xpRequired: number;
}

interface AchievementCardProps {
  achievement: Achievement;
  currentXP: number;
}

export default function AchievementCard({ achievement, currentXP }: AchievementCardProps) {
  const unlocked = currentXP >= achievement.xpRequired || achievement.id === '1' && currentXP > 0;

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`glass rounded-2xl p-4 border relative overflow-hidden transition-all duration-500 ${
        unlocked
          ? 'border-neon-gold/30 bg-neon-gold/5'
          : 'border-white/5 opacity-60'
      }`}
      style={unlocked ? { boxShadow: '0 0 20px rgba(245,158,11,0.15)' } : undefined}
    >
      {!unlocked && (
        <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-end justify-end p-2 z-10">
          <Lock size={14} className="text-white/20" />
        </div>
      )}

      <div className="text-3xl mb-2 filter" style={unlocked ? { filter: 'drop-shadow(0 0 8px rgba(245,158,11,0.6))' } : { filter: 'grayscale(1) opacity(0.4)' }}>
        {achievement.icon}
      </div>
      <p className={`font-bold text-sm mb-1 ${unlocked ? 'text-white' : 'text-white/40'}`}>
        {achievement.title}
      </p>
      <p className="text-white/30 text-xs leading-tight">{achievement.description}</p>

      {!unlocked && (
        <p className="text-white/20 text-[10px] mt-2 font-bold">{achievement.xpRequired} XP</p>
      )}
      {unlocked && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-2 text-neon-gold text-[10px] font-bold tracking-wider"
        >
          UNLOCKED ✓
        </motion.div>
      )}
    </motion.div>
  );
}
