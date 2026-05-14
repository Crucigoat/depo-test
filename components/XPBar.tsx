'use client';

import { motion } from 'framer-motion';
import { calculateLevel } from '@/lib/gameData';

interface XPBarProps {
  xp: number;
}

export default function XPBar({ xp }: XPBarProps) {
  const { level, currentXP, requiredXP, progress } = calculateLevel(xp);

  return (
    <div className="glass rounded-2xl p-4 border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-neon-gold/30 to-neon-gold/10 border border-neon-gold/40 flex items-center justify-center glow-gold">
            <span className="text-neon-gold font-black text-sm">{level}</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm">LEVEL {level}</p>
            <p className="text-white/40 text-xs">{currentXP} / {requiredXP} XP</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-neon-gold font-black text-lg">{xp}</p>
          <p className="text-white/30 text-xs">TOTAL XP</p>
        </div>
      </div>

      <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-neon-blue to-neon-violet animate-pulse-glow-blue"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        />
        <div className="absolute inset-0 rounded-full shimmer opacity-50" />
      </div>

      <div className="flex justify-between mt-1">
        <p className="text-white/20 text-xs">0</p>
        <p className="text-white/20 text-xs">{requiredXP} XP to next level</p>
      </div>
    </div>
  );
}
