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
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(0,0,0,0.92)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex items-stretch justify-around max-w-lg mx-auto px-1">
        {tabs.map(({ href, label, icon: Icon, color }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href} className="flex-1">
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center justify-center gap-1 py-3 relative"
              >
                {/* Active indicator bar at top */}
                <motion.div
                  className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full"
                  animate={{
                    width: isActive ? 24 : 0,
                    opacity: isActive ? 1 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  style={{
                    height: 3,
                    background: color,
                    boxShadow: isActive ? `0 0 8px ${color}` : 'none',
                  }}
                />

                <Icon
                  size={20}
                  style={
                    isActive
                      ? { color, filter: `drop-shadow(0 0 6px ${color}bb)` }
                      : { color: 'rgba(255,255,255,0.3)' }
                  }
                />

                <span
                  className="text-[10px] font-bold tracking-wide"
                  style={{ color: isActive ? color : 'rgba(255,255,255,0.28)' }}
                >
                  {label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
