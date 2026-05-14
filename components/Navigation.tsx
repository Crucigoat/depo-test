'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Target, CheckSquare, User } from 'lucide-react';
import { motion } from 'framer-motion';

const tabs = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/missions', label: 'Missions', icon: Target },
  { href: '/habits', label: 'Habits', icon: CheckSquare },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/10">
      <div className="flex items-center justify-around px-2 py-2 pb-safe max-w-lg mx-auto">
        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href} className="flex-1">
              <motion.div
                whileTap={{ scale: 0.92 }}
                className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl relative"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-xl bg-neon-blue/10 border border-neon-blue/20"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon
                  size={20}
                  className={isActive ? 'text-neon-blue drop-shadow-[0_0_8px_rgba(0,245,255,0.8)]' : 'text-white/40'}
                />
                <span
                  className={`text-[10px] font-semibold tracking-wider ${
                    isActive ? 'text-neon-blue' : 'text-white/30'
                  }`}
                >
                  {label.toUpperCase()}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
