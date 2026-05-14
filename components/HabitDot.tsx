'use client';

import { motion } from 'framer-motion';
import {
  Moon, Droplets, Dumbbell, Apple, Target, Brain, BookOpen, PhoneOff, type LucideProps,
} from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

type LucideIcon = ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;

const iconMap: Record<string, LucideIcon> = {
  Moon, Droplets, Dumbbell, Apple, Target, Brain, BookOpen, PhoneOff,
};

interface HabitDotProps {
  id: string;
  label: string;
  icon: string;
  color: string;
  active: boolean;
  onToggle: () => void;
}

export default function HabitDot({ label, icon, color, active, onToggle }: HabitDotProps) {
  const IconComponent = iconMap[icon] || Target;

  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      onClick={onToggle}
      className="flex flex-col items-center gap-2"
    >
      <motion.div
        animate={{
          boxShadow: active
            ? `0 0 20px ${color}60, 0 0 40px ${color}30`
            : '0 0 0px transparent',
          backgroundColor: active ? `${color}25` : 'rgba(255,255,255,0.05)',
          borderColor: active ? `${color}60` : 'rgba(255,255,255,0.1)',
          scale: active ? 1.08 : 1,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="w-14 h-14 rounded-2xl border flex items-center justify-center"
        style={{ borderWidth: 1 }}
      >
        <motion.div
          animate={{ color: active ? color : 'rgba(255,255,255,0.3)' }}
          transition={{ duration: 0.2 }}
        >
          <IconComponent size={22} />
        </motion.div>
      </motion.div>
      <span
        className="text-[10px] font-semibold tracking-wider"
        style={{ color: active ? color : 'rgba(255,255,255,0.3)' }}
      >
        {label.toUpperCase()}
      </span>
    </motion.button>
  );
}
