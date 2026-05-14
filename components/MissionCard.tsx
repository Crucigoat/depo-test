'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Dumbbell, BookOpen, Droplets, Footprints, Zap, Shield, Brain, PenLine, Check, type LucideProps,
} from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

type LucideIcon = ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;

const iconMap: Record<string, LucideIcon> = {
  Dumbbell, BookOpen, Droplets, Footprints, Zap, Shield, Brain, PenLine,
};

const difficultyConfig = {
  easy: { label: 'EASY', color: 'text-neon-green', bg: 'bg-neon-green/10 border-neon-green/30' },
  medium: { label: 'MEDIUM', color: 'text-neon-gold', bg: 'bg-neon-gold/10 border-neon-gold/30' },
  hard: { label: 'HARD', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/30' },
};

interface Mission {
  id: string;
  title: string;
  description: string;
  category: string;
  xp: number;
  icon: string;
  difficulty: string;
}

interface MissionCardProps {
  mission: Mission;
  completed: boolean;
  onComplete: () => void;
}

export default function MissionCard({ mission, completed, onComplete }: MissionCardProps) {
  const IconComponent = iconMap[mission.icon] || Zap;
  const diff = difficultyConfig[mission.difficulty as keyof typeof difficultyConfig] || difficultyConfig.medium;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`glass rounded-2xl p-4 border transition-all duration-500 ${
        completed
          ? 'border-neon-green/20 bg-neon-green/5'
          : 'border-white/10 hover:border-neon-blue/30'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
            completed
              ? 'bg-neon-green/20 border border-neon-green/40'
              : 'bg-neon-blue/10 border border-neon-blue/20'
          }`}
        >
          <AnimatePresence mode="wait">
            {completed ? (
              <motion.div
                key="check"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              >
                <Check size={18} className="text-neon-green" />
              </motion.div>
            ) : (
              <motion.div key="icon" initial={{ scale: 1 }} animate={{ scale: 1 }}>
                <IconComponent size={18} className="text-neon-blue" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3
              className={`font-bold text-sm truncate transition-all duration-300 ${
                completed ? 'line-through text-white/30' : 'text-white'
              }`}
            >
              {mission.title}
            </h3>
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="text-neon-gold font-black text-xs">+{mission.xp}</span>
              <span className="text-neon-gold/60 text-xs">XP</span>
            </div>
          </div>

          <p className={`text-xs mb-2 transition-all duration-300 ${completed ? 'text-white/20' : 'text-white/50'}`}>
            {mission.description}
          </p>

          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${diff.bg} ${diff.color}`}>
              {diff.label}
            </span>

            {!completed ? (
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={onComplete}
                className="px-4 py-1.5 rounded-xl font-bold text-xs tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 text-black hover:opacity-90 transition-all"
              >
                COMPLETE
              </motion.button>
            ) : (
              <span className="text-neon-green text-xs font-bold tracking-wider">DONE ✓</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
