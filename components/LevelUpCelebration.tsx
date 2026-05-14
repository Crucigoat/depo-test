'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  level: number;
  onDismiss: () => void;
  profileName: string;
}

const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  color: ['#00f5ff', '#7c3aed', '#f59e0b', '#00ff88', '#ef4444', '#c084fc'][i % 6],
  x: Math.cos((i / 16) * Math.PI * 2) * (80 + (i % 3) * 30),
  y: Math.sin((i / 16) * Math.PI * 2) * (80 + (i % 3) * 30),
  size: 6 + (i % 3) * 4,
  delay: i * 0.05,
}));

export default function LevelUpCelebration({ level, onDismiss, profileName }: Props) {
  const [countdown, setCountdown] = useState(8);

  useEffect(() => {
    if (countdown <= 0) {
      onDismiss();
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, onDismiss]);

  const handleShare = async () => {
    const text = `🚀 ${profileName} vient d'atteindre le Niveau ${level} sur ASCEND ! Rejoins l'ascension.`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: 'ASCEND', text });
        return;
      } catch {
        // fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // silent fail
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
        onClick={onDismiss}
      >
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="relative flex flex-col items-center gap-4 px-8 py-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Particles */}
          {PARTICLES.map((p) => (
            <motion.div
              key={p.id}
              initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
              animate={{ scale: 1, x: p.x, y: p.y, opacity: 0 }}
              transition={{ duration: 1.2, delay: p.delay, ease: 'easeOut' }}
              className="absolute rounded-full"
              style={{
                width: p.size,
                height: p.size,
                background: p.color,
                top: '50%',
                left: '50%',
                marginTop: -p.size / 2,
                marginLeft: -p.size / 2,
                boxShadow: `0 0 8px ${p.color}`,
              }}
            />
          ))}

          {/* Level text */}
          <p className="text-white/40 text-sm tracking-[0.4em] uppercase font-bold">Niveau</p>

          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: [0.5, 1.1, 1] }}
            transition={{ duration: 0.6, times: [0, 0.7, 1] }}
          >
            <span
              className="text-8xl font-black leading-none"
              style={{
                background: 'linear-gradient(135deg,#00f5ff,#7c3aed)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 30px rgba(0,245,255,0.5))',
              }}
            >
              {level}
            </span>
          </motion.div>

          <p
            className="text-xl font-black tracking-[0.2em]"
            style={{ color: '#00f5ff', textShadow: '0 0 20px rgba(0,245,255,0.6)' }}
          >
            ATTEINT !
          </p>

          <p className="text-white/50 text-sm text-center">
            Incroyable {profileName}. Tu progresses.
          </p>

          {/* Countdown */}
          <p className="text-white/20 text-xs">
            Fermeture dans {countdown}s
          </p>

          {/* Buttons */}
          <div className="flex gap-3 mt-2 w-full max-w-xs">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="flex-1 py-3 rounded-2xl font-black text-xs tracking-widest border border-neon-blue/30 text-neon-blue"
              style={{ background: 'rgba(0,245,255,0.08)' }}
            >
              📤 PARTAGER
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onDismiss}
              className="flex-1 py-3 rounded-2xl font-black text-xs tracking-widest text-black"
              style={{
                background: 'linear-gradient(135deg,#00f5ff,#7c3aed)',
                boxShadow: '0 0 20px rgba(0,245,255,0.3)',
              }}
            >
              CONTINUER
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
