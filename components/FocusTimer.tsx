'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';

const FOCUS_DURATION = 25 * 60;
const BREAK_DURATION = 5 * 60;
const SIZE = 160;
const STROKE = 8;
const R = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;

export default function FocusTimer() {
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION);
  const [running, setRunning] = useState(false);
  const [showReward, setShowReward] = useState(false);

  const total = mode === 'focus' ? FOCUS_DURATION : BREAK_DURATION;
  const progress = (timeLeft / total) * 100;
  const offset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setRunning(false);
          if (mode === 'focus') setShowReward(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, mode]);

  useEffect(() => {
    if (showReward) {
      const t = setTimeout(() => setShowReward(false), 3000);
      return () => clearTimeout(t);
    }
  }, [showReward]);

  const reset = useCallback(() => {
    setRunning(false);
    setTimeLeft(mode === 'focus' ? FOCUS_DURATION : BREAK_DURATION);
  }, [mode]);

  const switchMode = useCallback((m: 'focus' | 'break') => {
    setMode(m);
    setRunning(false);
    setTimeLeft(m === 'focus' ? FOCUS_DURATION : BREAK_DURATION);
  }, []);

  return (
    <div className="glass rounded-2xl p-5 border border-white/10 relative overflow-hidden">
      <p className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase mb-4">FOCUS TIMER</p>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-5">
        {(['focus', 'break'] as const).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold tracking-widest transition-all ${
              mode === m
                ? 'bg-neon-blue/20 border border-neon-blue/40 text-neon-blue'
                : 'bg-white/5 border border-white/10 text-white/30'
            }`}
          >
            {m === 'focus' ? 'FOCUS' : 'BREAK'}
          </button>
        ))}
      </div>

      {/* Timer ring */}
      <div className="flex justify-center mb-5">
        <div className="relative" style={{ width: SIZE, height: SIZE }}>
          <svg width={SIZE} height={SIZE} className="-rotate-90">
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={STROKE}
            />
            <motion.circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R}
              fill="none"
              stroke={mode === 'focus' ? '#00f5ff' : '#7c3aed'}
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 0.5 }}
              style={{
                filter: `drop-shadow(0 0 8px ${mode === 'focus' ? 'rgba(0,245,255,0.6)' : 'rgba(124,58,237,0.6)'})`,
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-4xl font-black text-white tabular-nums">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </p>
            <p className="text-white/30 text-xs font-bold tracking-widest mt-1">
              {mode === 'focus' ? 'FOCUS' : 'BREAK'}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={reset}
          className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"
        >
          <RotateCcw size={16} className="text-white/40" />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setRunning((r) => !r)}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-blue to-neon-violet border border-neon-blue/30 flex items-center justify-center"
          style={{ boxShadow: '0 0 20px rgba(0,245,255,0.3)' }}
        >
          {running ? <Pause size={24} className="text-black" /> : <Play size={24} className="text-black ml-0.5" />}
        </motion.button>

        <div className="w-11 h-11" />
      </div>

      {/* XP Reward notification */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="absolute top-4 right-4 bg-neon-gold/20 border border-neon-gold/40 rounded-xl px-3 py-2 flex items-center gap-2"
          >
            <Zap size={14} className="text-neon-gold" />
            <span className="text-neon-gold font-bold text-sm">+50 XP</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
