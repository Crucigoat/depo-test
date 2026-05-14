'use client';

import { motion } from 'framer-motion';

interface StreakCardProps {
  streak: number;
}

const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function StreakCard({ streak }: StreakCardProps) {
  const today = new Date().getDay();
  // Convert Sunday=0 to Mon=0 index
  const todayIdx = today === 0 ? 6 : today - 1;

  return (
    <div className="glass rounded-2xl p-4 border border-white/10 h-full">
      <p className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase mb-3">STREAK</p>

      <div className="flex items-center gap-2 mb-3">
        <motion.span
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="text-3xl animate-pulse-glow-fire"
          style={{ filter: 'drop-shadow(0 0 12px rgba(251,146,60,0.8))' }}
        >
          🔥
        </motion.span>
        <div>
          <motion.p
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
            className="text-4xl font-black text-white leading-none"
            style={{ textShadow: '0 0 20px rgba(251,146,60,0.5)' }}
          >
            {streak}
          </motion.p>
          <p className="text-white/30 text-[10px] font-bold tracking-widest">DAY STREAK</p>
        </div>
      </div>

      {/* Weekly dots */}
      <div className="flex items-center justify-between gap-1">
        {days.map((day, i) => {
          const isCompleted = i <= (todayIdx < streak - 1 ? todayIdx : streak - 1);
          const isToday = i === todayIdx;
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.07, type: 'spring', stiffness: 400 }}
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  isToday
                    ? 'bg-orange-500/30 border-2 border-orange-500'
                    : isCompleted
                    ? 'bg-orange-500/20 border border-orange-500/60'
                    : 'bg-white/5 border border-white/10'
                }`}
                style={
                  isCompleted
                    ? { boxShadow: '0 0 8px rgba(249,115,22,0.4)' }
                    : undefined
                }
              >
                {isCompleted && (
                  <div className="w-2 h-2 rounded-full bg-orange-400" />
                )}
              </motion.div>
              <span className={`text-[9px] font-bold ${isToday ? 'text-orange-400' : 'text-white/20'}`}>
                {day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
