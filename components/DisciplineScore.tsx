'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface DisciplineScoreProps {
  score: number;
}

function getColor(score: number) {
  if (score < 50) return { stroke: '#ef4444', text: 'text-red-400', label: 'WEAK' };
  if (score < 75) return { stroke: '#f59e0b', text: 'text-neon-gold', label: 'SOLID' };
  return { stroke: '#00ff88', text: 'text-neon-green', label: 'ELITE' };
}

const SIZE = 90;
const STROKE = 6;
const R = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;

export default function DisciplineScore({ score }: DisciplineScoreProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const color = getColor(score);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedScore(score);
    }, 400);
    return () => clearTimeout(timeout);
  }, [score]);

  const offset = CIRCUMFERENCE - (animatedScore / 100) * CIRCUMFERENCE;

  return (
    <div className="glass rounded-2xl p-4 border border-white/10 h-full flex flex-col">
      <p className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase mb-3">DISCIPLINE</p>

      <div className="flex items-center gap-3 flex-1">
        <div className="relative flex-shrink-0" style={{ width: SIZE, height: SIZE }}>
          <svg width={SIZE} height={SIZE} className="-rotate-90">
            {/* Background ring */}
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={STROKE}
            />
            {/* Progress ring */}
            <motion.circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R}
              fill="none"
              stroke={color.stroke}
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              initial={{ strokeDashoffset: CIRCUMFERENCE }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
              style={{ filter: `drop-shadow(0 0 6px ${color.stroke}80)` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className={`text-xl font-black ${color.text}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {animatedScore}%
            </motion.span>
          </div>
        </div>

        <div>
          <p className={`text-lg font-black ${color.text}`}>{color.label}</p>
          <p className="text-white/30 text-xs leading-tight">DISCIPLINE<br />SCORE</p>
        </div>
      </div>
    </div>
  );
}
