'use client';

import { useState, useEffect } from 'react';
import { useApp, useLevel } from '@/lib/context';
import OnboardingFlow from './OnboardingFlow';
import Navigation from './Navigation';
import LevelUpCelebration from './LevelUpCelebration';
import type { UserProfile } from '@/lib/profileTypes';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { profile, isLoaded, saveProfile, justLeveledUp, clearLevelUp } = useApp();
  const { level } = useLevel();
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Register service worker for PWA + offline support
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/depo-test/sw.js', { scope: '/depo-test/' })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (isLoaded && !profile) setShowOnboarding(true);
  }, [isLoaded, profile]);

  const handleComplete = (p: UserProfile) => {
    saveProfile(p);
    setShowOnboarding(false);
  };

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className="text-2xl font-black tracking-[0.2em]"
            style={{
              background: 'linear-gradient(135deg,#00f5ff,#7c3aed)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            ASCEND
          </div>
          <div className="w-32 h-0.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full animate-shimmer"
              style={{
                background: 'linear-gradient(90deg,transparent,#00f5ff,transparent)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s linear infinite',
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleComplete} />;
  }

  return (
    <>
      {justLeveledUp && (
        <LevelUpCelebration
          level={level}
          profileName={profile?.firstName ?? 'Warrior'}
          onDismiss={clearLevelUp}
        />
      )}
      <main className="max-w-lg mx-auto relative">{children}</main>
      <Navigation />
    </>
  );
}
