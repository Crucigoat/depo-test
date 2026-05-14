'use client';

import { motion } from 'framer-motion';
import { MOTIVATIONAL_QUOTES } from '@/lib/gameData';
import { Quote } from 'lucide-react';

function getDailyIndex(total: number): number {
  const now = new Date();
  const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  return seed % total;
}

export default function QuoteCard() {
  const quote = MOTIVATIONAL_QUOTES[getDailyIndex(MOTIVATIONAL_QUOTES.length)];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative rounded-2xl p-4 overflow-hidden border border-white/8"
      style={{
        background: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(0,245,255,0.06) 100%)',
      }}
    >
      {/* Subtle shimmer overlay */}
      <div className="absolute inset-0 shimmer opacity-30 pointer-events-none" />

      <Quote size={16} className="text-neon-violet/50 mb-2" />
      <p className="text-white/80 text-sm font-medium italic leading-relaxed mb-2">
        &ldquo;{quote.text}&rdquo;
      </p>
      <p className="text-neon-blue/70 text-xs font-bold tracking-widest">
        — {quote.author.toUpperCase()}
      </p>
    </motion.div>
  );
}
