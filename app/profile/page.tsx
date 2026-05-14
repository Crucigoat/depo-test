'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp, useLevel } from '@/lib/context';
import { ACHIEVEMENTS } from '@/lib/gameData';
import AchievementCard from '@/components/AchievementCard';
import XPBar from '@/components/XPBar';
import DisciplineScore from '@/components/DisciplineScore';
import OnboardingFlow from '@/components/OnboardingFlow';
import {
  Shield, Zap, Settings, ChevronRight, Moon, Bell, Lock, Pencil,
} from 'lucide-react';
import type { UserProfile } from '@/lib/profileTypes';

const HISTORY_DATA = [45, 52, 60, 48, 71, 80, 65, 90, 75, 88, 92, 78, 85, 95];

const GOAL_LABELS: Record<string, string> = {
  muscle: '💪 Prise de masse', weightloss: '🔥 Perte de poids', cardio: '🏃 Cardio',
  productivity: '⚡ Productivité', mental: '🧠 Mental', sleep: '😴 Sommeil',
  nutrition: '🥗 Nutrition', social: '🤝 Social', career: '🏆 Carrière', discipline: '🧲 Discipline',
};

const LEVEL_LABELS: Record<string, string> = {
  sedentary: 'Sédentaire', beginner: 'Débutant', intermediate: 'Intermédiaire', advanced: 'Avancé',
};

const GAMEMODE_LABELS: Record<string, string> = {
  normal: 'Normal', hard: 'Hard', extreme: 'Extreme',
};

export default function ProfilePage() {
  const { profile, xp, streak, disciplineScore, completedMissions, saveProfile } = useApp();
  const { level, currentXP, requiredXP } = useLevel();
  const [dopamineDetox, setDopamineDetox] = useState(false);
  const [challengeMode, setChallengeMode] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);

  const ringPercent = (currentXP / requiredXP) * 100;
  const SIZE = 100;
  const STROKE = 5;
  const R = (SIZE - STROKE) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * R;
  const offset = CIRCUMFERENCE - (ringPercent / 100) * CIRCUMFERENCE;

  const handleSaveProfile = (p: UserProfile) => {
    saveProfile(p);
    setEditingProfile(false);
  };

  if (editingProfile) {
    return <OnboardingFlow onComplete={handleSaveProfile} initialProfile={profile} />;
  }

  return (
    <div className="min-h-screen bg-black px-4 pt-6 pb-28">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-[0.12em] text-gradient-blue mb-1">PROFIL</h1>
          <p className="text-white/40 text-xs font-medium">Ton ascension en chiffres</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => setEditingProfile(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass border border-white/10 text-white/50 text-xs font-bold hover:border-neon-blue/30 hover:text-neon-blue transition-all"
        >
          <Pencil size={12} />
          MODIFIER
        </motion.button>
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
              cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke="#00f5ff"
              strokeWidth={STROKE} strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              initial={{ strokeDashoffset: CIRCUMFERENCE }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
              style={{ filter: 'drop-shadow(0 0 8px rgba(0,245,255,0.6))' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg,rgba(0,245,255,0.2),rgba(124,58,237,0.2))',
                border: '2px solid rgba(0,245,255,0.4)',
                boxShadow: '0 0 20px rgba(0,245,255,0.3)',
              }}
            >
              <span className="text-neon-blue font-black text-2xl">
                {profile?.firstName?.charAt(0).toUpperCase() ?? 'A'}
              </span>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-black text-white tracking-widest mb-1">
          {profile?.firstName?.toUpperCase() ?? 'OPERATOR'}
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-neon-gold text-xs font-bold">NIVEAU {level}</span>
          <span className="text-white/20">•</span>
          <span className="text-white/40 text-xs font-medium">🔥 {streak} JOURS</span>
        </div>

        {/* Profile summary tags */}
        {profile && (
          <div className="flex flex-wrap gap-1.5 justify-center mt-3 max-w-xs">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border border-neon-violet/30 text-neon-violet/80">
              {LEVEL_LABELS[profile.level]}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border border-neon-gold/30 text-neon-gold/80">
              Mode {GAMEMODE_LABELS[profile.gameMode]}
            </span>
            {profile.goals.slice(0, 3).map((g) => (
              <span key={g} className="px-2 py-0.5 rounded-full text-[10px] font-bold border border-neon-blue/20 text-neon-blue/60">
                {GOAL_LABELS[g] ?? g}
              </span>
            ))}
          </div>
        )}
      </motion.div>

      {/* XP Bar */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-4">
        <XPBar xp={xp} />
      </motion.div>

      {/* Stats Row */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-2 mb-5"
      >
        {[
          { label: 'NIVEAU', value: level, color: '#00f5ff' },
          { label: 'STREAK', value: `${streak}j`, color: '#fb923c' },
          { label: 'MISSIONS', value: completedMissions.length, color: '#00ff88' },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-xl p-3 border border-white/10 text-center">
            <p className="font-black text-2xl" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-white/30 text-[10px] font-bold tracking-widest">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Discipline Score */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }} className="mb-5">
        <h2 className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase mb-3">DISCIPLINE</h2>
        <DisciplineScore score={disciplineScore} />
      </motion.div>

      {/* Discipline History */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-5">
        <h2 className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase mb-3">HISTORIQUE</h2>
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
          <p className="text-white/20 text-[10px] font-bold mt-2">14 derniers jours</p>
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }} className="mb-5">
        <h2 className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase mb-3">ACHIEVEMENTS</h2>
        <div className="grid grid-cols-2 gap-3">
          {ACHIEVEMENTS.map((achievement, i) => (
            <motion.div key={achievement.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}>
              <AchievementCard achievement={achievement} currentXP={xp} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Modes */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }} className="mb-4">
        <h2 className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase mb-3">MODES</h2>

        {/* Dopamine Detox */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setDopamineDetox((v) => !v)}
          className="w-full rounded-2xl p-4 border transition-all duration-500 relative overflow-hidden"
          style={{
            background: dopamineDetox ? 'rgba(124,58,237,0.1)' : 'rgba(255,255,255,0.04)',
            borderColor: dopamineDetox ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.1)',
            boxShadow: dopamineDetox ? '0 0 30px rgba(124,58,237,0.3)' : 'none',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: dopamineDetox ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.05)' }}>
                <Shield size={20} style={{ color: dopamineDetox ? '#7c3aed' : 'rgba(255,255,255,0.3)' }} />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm" style={{ color: dopamineDetox ? '#7c3aed' : 'rgba(255,255,255,0.6)' }}>DOPAMINE DETOX</p>
                <p className="text-white/30 text-xs">Mode zéro distraction</p>
              </div>
            </div>
            <div className="w-12 h-6 rounded-full transition-all duration-300 flex items-center px-1" style={{ background: dopamineDetox ? '#7c3aed' : 'rgba(255,255,255,0.1)', justifyContent: dopamineDetox ? 'flex-end' : 'flex-start' }}>
              <motion.div layout className="w-4 h-4 rounded-full bg-white" transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
            </div>
          </div>
          {dopamineDetox && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-xs mt-3 pt-3 border-t text-left"
              style={{ color: 'rgba(124,58,237,0.7)', borderColor: 'rgba(124,58,237,0.2)' }}
            >
              🛡️ ACTIVÉ — Tes circuits dopaminergiques se recalibrent. Tiens bon.
            </motion.p>
          )}
        </motion.button>

        {/* Challenge Mode */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setChallengeMode((v) => !v)}
          className="w-full rounded-2xl p-4 border transition-all duration-500 mt-3"
          style={{
            background: challengeMode ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.04)',
            borderColor: challengeMode ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.1)',
            boxShadow: challengeMode ? '0 0 30px rgba(245,158,11,0.2)' : 'none',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: challengeMode ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.05)' }}>
                <Zap size={20} style={{ color: challengeMode ? '#f59e0b' : 'rgba(255,255,255,0.3)' }} />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm" style={{ color: challengeMode ? '#f59e0b' : 'rgba(255,255,255,0.6)' }}>CHALLENGE MODE</p>
                <p className="text-white/30 text-xs">XP × 2, missions difficiles</p>
              </div>
            </div>
            <div className="w-12 h-6 rounded-full transition-all duration-300 flex items-center px-1" style={{ background: challengeMode ? '#f59e0b' : 'rgba(255,255,255,0.1)', justifyContent: challengeMode ? 'flex-end' : 'flex-start' }}>
              <motion.div layout className="w-4 h-4 rounded-full bg-white" transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
            </div>
          </div>
        </motion.button>
      </motion.div>

      {/* Settings */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }} className="mb-5">
        <h2 className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase mb-3">PARAMÈTRES</h2>
        <div className="glass rounded-2xl border border-white/10 overflow-hidden divide-y divide-white/5">
          {[
            { icon: Bell, label: 'Notifications', sub: 'Rappels quotidiens' },
            { icon: Moon, label: 'Mode sombre', sub: 'Toujours activé' },
            { icon: Lock, label: 'Confidentialité', sub: 'Gérer mes données' },
            { icon: Settings, label: 'Préférences', sub: 'Paramètres de l\'app' },
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

      <div className="text-center py-2">
        <p className="text-white/10 text-xs">ASCEND v1.0 — Pour les implacables</p>
      </div>
    </div>
  );
}
