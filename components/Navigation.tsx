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
      <div className="flex items-center justify-around max-w-lg mx-auto px-3 py-2 gap-1">
        {tabs.map(({ href, label, icon: Icon, color }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href} className="flex-1">
              <motion.div
                whileTap={{ scale: 0.92 }}
                className="flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-2xl relative"
                style={
                  isActive
                    ? {
                        background: `${color}22`,
                        border: `1.5px solid ${color}55`,
                        boxShadow: `0 0 16px ${color}33`,
                      }
                    : {
                        background: 'transparent',
                        border: '1.5px solid transparent',
                      }
                }
              >
                <Icon
                  size={22}
                  style={
                    isActive
                      ? { color, filter: `drop-shadow(0 0 8px ${color})` }
                      : { color: 'rgba(255,255,255,0.28)' }
                  }
                />
                <span
                  className="text-[10px] font-black tracking-wide"
                  style={{ color: isActive ? color : 'rgba(255,255,255,0.25)' }}
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
