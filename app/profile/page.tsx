'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/lib/context';
import { ACHIEVEMENTS, calculateLevel } from '@/lib/gameData';
import AchievementCard from '@/components/AchievementCard';
import XPBar from '@/components/XPBar';
import DisciplineScore from '@/components/DisciplineScore';
import { Shield, Zap, Settings, ChevronRight, Moon, Bell, Lock } from 'lucide-react';

// Fake discipline score history
const HISTORY_DATA = [45, 52, 60, 48, 71, 80, 65, 90, 75, 88, 92, 78, 85, 95];

export default function ProfilePage() {
  const { xp, streak, disciplineScore, completedMissions } = useApp();
  const { level, currentXP, requiredXP } = calculateLevel(xp);
  const [dopamineDetox, setDopamineDetox] = useState(false);
  const [challengeMode, setChallengeMode] = useState(false);

  const username = 'OPERATOR';
  const ringPercent = (currentXP / requiredXP) * 100;
  const SIZE = 100;
  const STROKE = 5;
  const R = (SIZE - STROKE) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * R;
  const offset = CIRCUMFERENCE - (ringPercent / 100) * CIRCUMFERENCE;

  return (
    <div className="min-h-screen bg-black px-4 pt-6 pb-28">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-black tracking-[0.12em] text-gradient-blue mb-1">PROFILE</h1>
        <p className="text-white/40 text-xs font-medium">Your ascent stats</p>
      </motion.div>

      {/* Avatar + Name */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col items-center mb-6"
      >
        <div className="relative mb-3">
          <svg width={SIZE} height={SIZE} className="-rotate-90">
            <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={STROKE} />
            <motion.circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R}
              fill="none"
              stroke="#00f5ff"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              initial={{ strokeDashoffset: CIRCUMFERENCE }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
              style={{ filter: 'drop-shadow(0 0 8px rgba(0,245,255,0.6))' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-blue/20 to-neon-violet/20 border-2 border-neon-blue/40 flex items-center justify-center"
              style={{ boxShadow: '0 0 20px rgba(0,245,255,0.3)' }}
            >
              <span className="text-neon-blue font-black text-2xl">O</span>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-black text-white tracking-widest mb-1">{username}</h2>
        <div className="flex items-center gap-2">
          <span className="text-neon-gold text-xs font-bold">LEVEL {level}</span>
          <span className="text-white/20">•</span>
          <span className="text-white/40 text-xs font-medium">🔥 {streak} DAY STREAK</span>
        </div>
      </motion.div>

      {/* XP Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-4"
      >
        <XPBar xp={xp} />
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-2 mb-5"
      >
        {[
          { label: 'LEVEL', value: level, color: '#00f5ff' },
          { label: 'STREAK', value: `${streak}d`, color: '#fb923c' },
          { label: 'MISSIONS', value: completedMissions.length, color: '#00ff88' },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-xl p-3 border border-white/10 text-center">
            <p className="font-black text-2xl" style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p className="text-white/30 text-[10px] font-bold tracking-widest">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Discipline Score */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
        className="mb-5"
      >
        <h2 className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase mb-3">DISCIPLINE</h2>
        <DisciplineScore score={disciplineScore} />
      </motion.div>

      {/* Discipline History */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mb-5"
      >
        <h2 className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase mb-3">HISTORY</h2>
        <div className="glass rounded-2xl p-4 border border-white/10">
          <div className="flex items-end gap-1 h-14">
            {HISTORY_DATA.map((val, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-t-sm"
                style={{ backgroundColor: `rgba(0,245,255,${val / 100 * 0.8 + 0.1})` }}
                initial={{ height: 0 }}
                animate={{ height: `${val}%` }}
                transition={{ delay: i * 0.04, duration: 0.5, ease: 'easeOut' }}
              />
            ))}
          </div>
          <p className="text-white/20 text-[10px] font-bold mt-2">Last 14 days</p>
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
        className="mb-5"
      >
        <h2 className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase mb-3">ACHIEVEMENTS</h2>
        <div className="grid grid-cols-2 gap-3">
          {ACHIEVEMENTS.map((achievement, i) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07 }}
            >
              <AchievementCard achievement={achievement} currentXP={xp} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Dopamine Detox Mode */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32 }}
        className="mb-4"
      >
        <h2 className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase mb-3">MODES</h2>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setDopamineDetox((v) => !v)}
          className={`w-full rounded-2xl p-4 border transition-all duration-500 relative overflow-hidden ${
            dopamineDetox
              ? 'border-neon-violet/40 bg-neon-violet/10'
              : 'glass border-white/10'
          }`}
          style={dopamineDetox ? { boxShadow: '0 0 30px rgba(124,58,237,0.3)' } : undefined}
        >
          {dopamineDetox && (
            <motion.div
              className="absolute inset-0 shimmer opacity-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
            />
          )}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dopamineDetox ? 'bg-neon-violet/20' : 'bg-white/5'}`}>
                <Shield size={20} className={dopamineDetox ? 'text-neon-violet' : 'text-white/30'} />
              </div>
              <div className="text-left">
                <p className={`font-bold text-sm ${dopamineDetox ? 'text-neon-violet' : 'text-white/60'}`}>
                  DOPAMINE DETOX
                </p>
                <p className="text-white/30 text-xs">No distractions mode</p>
              </div>
            </div>
            <div
              className={`w-12 h-6 rounded-full transition-all duration-300 flex items-center px-1 ${
                dopamineDetox ? 'bg-neon-violet justify-end' : 'bg-white/10 justify-start'
              }`}
            >
              <motion.div
                layout
                className="w-4 h-4 rounded-full bg-white"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </div>
          </div>
          {dopamineDetox && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-neon-violet/70 text-xs mt-3 pt-3 border-t border-neon-violet/20 text-left"
            >
              🛡️ ACTIVATED — Your dopamine pathways are being reset. Stay the course.
            </motion.p>
          )}
        </motion.button>

        {/* Challenge Mode */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setChallengeMode((v) => !v)}
          className={`w-full rounded-2xl p-4 border transition-all duration-500 mt-3 ${
            challengeMode
              ? 'border-neon-gold/40 bg-neon-gold/10'
              : 'glass border-white/10'
          }`}
          style={challengeMode ? { boxShadow: '0 0 30px rgba(245,158,11,0.2)' } : undefined}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${challengeMode ? 'bg-neon-gold/20' : 'bg-white/5'}`}>
                <Zap size={20} className={challengeMode ? 'text-neon-gold' : 'text-white/30'} />
              </div>
              <div className="text-left">
                <p className={`font-bold text-sm ${challengeMode ? 'text-neon-gold' : 'text-white/60'}`}>
                  CHALLENGE MODE
                </p>
                <p className="text-white/30 text-xs">2x XP, harder missions</p>
              </div>
            </div>
            <div
              className={`w-12 h-6 rounded-full transition-all duration-300 flex items-center px-1 ${
                challengeMode ? 'bg-neon-gold justify-end' : 'bg-white/10 justify-start'
              }`}
            >
              <motion.div
                layout
                className="w-4 h-4 rounded-full bg-white"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </div>
          </div>
        </motion.button>
      </motion.div>

      {/* Settings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.36 }}
        className="mb-5"
      >
        <h2 className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase mb-3">SETTINGS</h2>
        <div className="glass rounded-2xl border border-white/10 overflow-hidden divide-y divide-white/5">
          {[
            { icon: Bell, label: 'Notifications', sub: 'Daily reminders' },
            { icon: Moon, label: 'Dark Mode', sub: 'Always on' },
            { icon: Lock, label: 'Privacy', sub: 'Manage data' },
            { icon: Settings, label: 'Preferences', sub: 'App settings' },
          ].map(({ icon: Icon, label, sub }) => (
            <button key={label} className="w-full flex items-center justify-between p-4 hover:bg-white/3 transition-all active:bg-white/5">
              <div className="flex items-center gap-3">
                <Icon size={16} className="text-white/40" />
                <div className="text-left">
                  <p className="text-white/80 text-sm font-medium">{label}</p>
                  <p className="text-white/30 text-xs">{sub}</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-white/20" />
            </button>
          ))}
        </div>
      </motion.div>

      {/* App version */}
      <div className="text-center py-2">
        <p className="text-white/10 text-xs">ASCEND v1.0.0 — Built for the relentless</p>
      </div>
    </div>
  );
}
