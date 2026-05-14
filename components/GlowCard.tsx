'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

type GlowColor = 'blue' | 'violet' | 'gold' | 'green';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: GlowColor;
  onClick?: () => void;
}

const glowMap: Record<GlowColor, string> = {
  blue: 'hover:shadow-[0_0_30px_rgba(0,245,255,0.25),0_0_60px_rgba(0,245,255,0.1)] hover:border-neon-blue/30',
  violet: 'hover:shadow-[0_0_30px_rgba(124,58,237,0.25),0_0_60px_rgba(124,58,237,0.1)] hover:border-neon-violet/30',
  gold: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.25),0_0_60px_rgba(245,158,11,0.1)] hover:border-neon-gold/30',
  green: 'hover:shadow-[0_0_30px_rgba(0,255,136,0.25),0_0_60px_rgba(0,255,136,0.1)] hover:border-neon-green/30',
};

export default function GlowCard({ children, className = '', glowColor = 'blue', onClick }: GlowCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={onClick}
      className={`glass rounded-2xl border border-white/10 transition-all duration-300 ${glowMap[glowColor]} ${className}`}
    >
      {children}
    </motion.div>
  );
}
