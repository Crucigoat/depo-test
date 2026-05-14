'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, Target, Users, MessageCircle, User } from 'lucide-react';
import { motion } from 'framer-motion';

const tabs = [
  { href: '/',         label: 'Home',     icon: Home,          color: '#00f5ff' },
  { href: '/missions', label: 'Missions', icon: Target,        color: '#f59e0b' },
  { href: '/social',   label: 'Social',   icon: Users,         color: '#00ff88' },
  { href: '/coach',    label: 'Coach',    icon: MessageCircle, color: '#c084fc' },
  { href: '/profile',  label: 'Profil',   icon: User,          color: '#fb923c' },
];

// Extrait le segment de path sans basePath ni trailing slash
function getSegment(): string {
  if (typeof window === 'undefined') return '/';
  const full = window.location.pathname; // ex: /depo-test/missions/
  const stripped = full.replace(/^\/depo-test/, '').replace(/\/$/, '') || '/';
  return stripped;
}

export default function Navigation() {
  const [active, setActive] = useState('/');

  useEffect(() => {
    setActive(getSegment());

    // Intercepte les navigations Next.js (pushState)
    const orig = history.pushState.bind(history);
    history.pushState = (...args) => {
      orig(...args);
      setActive(getSegment());
    };
    const origReplace = history.replaceState.bind(history);
    history.replaceState = (...args) => {
      origReplace(...args);
      setActive(getSegment());
    };
    window.addEventListener('popstate', () => setActive(getSegment()));

    return () => {
      history.pushState = orig;
      history.replaceState = origReplace;
    };
  }, []);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(0,0,0,0.95)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex items-center justify-around max-w-lg mx-auto px-3 py-2 gap-1">
        {tabs.map(({ href, label, icon: Icon, color }) => {
          const isActive = active === href;
          return (
            <Link key={href} href={href} className="flex-1" onClick={() => setActive(href)}>
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-2xl"
                style={
                  isActive
                    ? {
                        background: `${color}25`,
                        border: `2px solid ${color}70`,
                        boxShadow: `0 0 18px ${color}40`,
                      }
                    : {
                        background: 'transparent',
                        border: '2px solid transparent',
                      }
                }
              >
                <Icon
                  size={22}
                  style={
                    isActive
                      ? { color, filter: `drop-shadow(0 0 6px ${color})` }
                      : { color: 'rgba(255,255,255,0.3)' }
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
