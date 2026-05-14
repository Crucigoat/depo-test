'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Target, Users, MessageCircle, User } from 'lucide-react';
import { motion } from 'framer-motion';

const tabs = [
  { href: '/',         label: 'Home',     icon: Home,          color: '#00f5ff' },
  { href: '/missions', label: 'Missions', icon: Target,        color: '#f59e0b' },
  { href: '/social',   label: 'Social',   icon: Users,         color: '#00ff88' },
  { href: '/coach',    label: 'Coach',    icon: MessageCircle, color: '#c084fc' },
  { href: '/profile',  label: 'Profil',   icon: User,          color: '#fb923c' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/10">
      <div className="flex items-center justify-around px-2 py-2 pb-safe max-w-lg mx-auto">
        {tabs.map(({ href, label, icon: Icon, color }) => {
          const isActive = pathname === href;
          const rgb = color === '#00f5ff' ? '0,245,255'
            : color === '#f59e0b' ? '245,158,11'
            : color === '#00ff88' ? '0,255,136'
            : color === '#c084fc' ? '192,132,252'
            : '251,146,60';
          return (
            <Link key={href} href={href} className="flex-1">
              <motion.div
                whileTap={{ scale: 0.92 }}
                className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl relative"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: `rgba(${rgb},0.1)`,
                      border: `1px solid rgba(${rgb},0.25)`,
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon
                  size={18}
                  style={isActive ? { color, filter: `drop-shadow(0 0 8px ${color}cc)` } : { color: 'rgba(255,255,255,0.35)' }}
                />
                <span
                  className="text-[9px] font-semibold tracking-wider"
                  style={{ color: isActive ? color : 'rgba(255,255,255,0.3)' }}
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
