'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp, useLevel } from '@/lib/context';
import { Copy, Share2, X, UserPlus, Users, ChevronDown, ChevronUp } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 28 } },
};

const GOAL_EMOJIS: Record<string, string> = {
  muscle: '💪', weightloss: '🔥', cardio: '🏃', productivity: '⚡',
  mental: '🧠', sleep: '😴', nutrition: '🥗', social: '🤝',
  career: '🏆', discipline: '🧲',
};

function getRankColor(rank: number): string {
  if (rank === 1) return '#f59e0b';
  if (rank === 2) return '#9ca3af';
  if (rank === 3) return '#b45309';
  return '#ffffff40';
}

function getAvatarColor(name: string): string {
  const colors = ['#00f5ff', '#7c3aed', '#f59e0b', '#00ff88', '#ef4444', '#c084fc'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

interface RankedEntry {
  firstName: string;
  level: number;
  xp: number;
  streak: number;
  goals: string[];
  gameMode: string;
  isMe: boolean;
  code?: string;
}

export default function SocialPage() {
  const { profile, friends, addFriend, removeFriend, myShareCode, xp, streak } = useApp();
  const { level } = useLevel();

  const [addCode, setAddCode] = useState('');
  const [addStatus, setAddStatus] = useState<'idle' | 'ok' | 'invalid' | 'already'>('idle');
  const [showHowTo, setShowHowTo] = useState(false);
  const [copied, setCopied] = useState(false);

  // Build leaderboard: me + friends, sorted by xp desc
  const me: RankedEntry = {
    firstName: profile?.firstName ?? 'Toi',
    level,
    xp,
    streak,
    goals: profile?.goals ?? [],
    gameMode: profile?.gameMode ?? 'normal',
    isMe: true,
  };

  const friendEntries: RankedEntry[] = friends.map((f) => ({
    firstName: f.firstName,
    level: f.level,
    xp: f.xp,
    streak: f.streak,
    goals: f.goals,
    gameMode: f.gameMode,
    isMe: false,
    code: f.code,
  }));

  const leaderboard = [me, ...friendEntries].sort((a, b) => b.xp - a.xp);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(myShareCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // silent fail
    }
  };

  const handleShare = async () => {
    const text = `🚀 Rejoins-moi sur ASCEND ! Mon code : ${myShareCode}`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: 'ASCEND', text });
        return;
      } catch {
        // fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // silent fail
    }
  };

  const handleAddFriend = () => {
    const trimmed = addCode.trim();
    if (!trimmed) return;
    const result = addFriend(trimmed);
    setAddStatus(result === 'ok' ? 'ok' : result === 'already_added' ? 'already' : 'invalid');
    if (result === 'ok') {
      setAddCode('');
      setTimeout(() => setAddStatus('idle'), 3000);
    } else {
      setTimeout(() => setAddStatus('idle'), 3000);
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="min-h-screen bg-black px-4 pt-6 pb-28"
    >
      {/* Header */}
      <motion.div variants={item} className="mb-6">
        <h1 className="text-3xl font-black tracking-[0.15em] text-white">CLASSEMENT</h1>
        <p className="text-white/30 text-xs font-bold tracking-widest mt-0.5">Tes amis et toi</p>
      </motion.div>

      {/* My card */}
      <motion.div
        variants={item}
        className="glass rounded-2xl p-4 mb-4 relative overflow-hidden"
        style={{
          border: '1px solid rgba(0,245,255,0.3)',
          boxShadow: '0 0 30px rgba(0,245,255,0.1)',
          background: 'linear-gradient(135deg,rgba(0,245,255,0.05),rgba(124,58,237,0.05))',
        }}
      >
        {/* TOI badge */}
        <div
          className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider"
          style={{ background: 'rgba(0,245,255,0.15)', color: '#00f5ff', border: '1px solid rgba(0,245,255,0.3)' }}
        >
          TOI
        </div>

        <div className="flex items-center gap-3 mb-4">
          {/* Avatar */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center font-black text-xl text-black flex-shrink-0"
            style={{ background: getAvatarColor(me.firstName) }}
          >
            {me.firstName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-white font-black tracking-wider">{me.firstName.toUpperCase()}</p>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-neon-blue text-xs font-bold">Niv. {level}</span>
              <span className="text-neon-gold text-xs font-bold">{xp} XP</span>
              <span className="text-white/40 text-xs">🔥 {streak} jours</span>
            </div>
          </div>
        </div>

        {/* Share code */}
        <div className="flex flex-col gap-2">
          <p className="text-white/30 text-xs font-bold tracking-widest uppercase">Ton code d&apos;invitation</p>
          <div className="flex items-center gap-2">
            <div
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-mono text-xs text-white/70 truncate"
              style={{ maxWidth: '60%' }}
            >
              {myShareCode.slice(0, 20)}{myShareCode.length > 20 ? '…' : ''}
            </div>
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={handleCopyCode}
              className="p-2 rounded-xl border border-white/10 text-white/40 hover:text-white/70 transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)' }}
              title="Copier le code"
            >
              {copied ? (
                <span className="text-xs text-neon-green font-bold px-1">✓</span>
              ) : (
                <Copy size={14} />
              )}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs tracking-wider text-black"
              style={{
                background: 'linear-gradient(135deg,#00f5ff,#7c3aed)',
                boxShadow: '0 0 15px rgba(0,245,255,0.3)',
              }}
            >
              <Share2 size={12} />
              Partager
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Leaderboard */}
      <motion.div variants={item} className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Users size={14} className="text-white/30" />
          <span className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase">
            Amis — {friends.length} joueur{friends.length !== 1 ? 's' : ''}
          </span>
        </div>

        {friends.length === 0 ? (
          <div
            className="glass rounded-2xl p-6 text-center border border-white/10"
          >
            <p className="text-white/30 text-sm mb-1">Aucun ami encore</p>
            <p className="text-white/20 text-xs">Ajoute des amis via leur code d&apos;invitation ci-dessous</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {leaderboard.map((entry, index) => {
              const rank = index + 1;
              return (
                <motion.div
                  key={entry.isMe ? '__me__' : entry.code}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass rounded-2xl p-3 border border-white/10 flex items-center gap-3"
                  style={entry.isMe ? { borderColor: 'rgba(0,245,255,0.2)', background: 'rgba(0,245,255,0.03)' } : {}}
                >
                  {/* Rank */}
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0"
                    style={{ color: getRankColor(rank), border: `1px solid ${getRankColor(rank)}40`, background: `${getRankColor(rank)}10` }}
                  >
                    {rank}
                  </div>

                  {/* Avatar */}
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm text-black flex-shrink-0"
                    style={{ background: getAvatarColor(entry.firstName) }}
                  >
                    {entry.firstName.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-bold text-sm truncate">{entry.firstName}</p>
                      {entry.isMe && (
                        <span className="text-[9px] text-neon-blue font-bold">TOI</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-neon-blue text-xs">Niv. {entry.level}</span>
                      <span className="text-neon-gold text-xs">{entry.xp} XP</span>
                      <span className="text-white/30 text-xs">🔥 {entry.streak}</span>
                    </div>
                    {entry.goals.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {entry.goals.slice(0, 3).map((g) => (
                          <span key={g} className="text-xs" title={g}>
                            {GOAL_EMOJIS[g] ?? '🎯'}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Remove button for friends */}
                  {!entry.isMe && entry.code && (
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeFriend(entry.code!)}
                      className="p-1.5 rounded-lg text-white/20 hover:text-red-400 transition-colors flex-shrink-0"
                    >
                      <X size={14} />
                    </motion.button>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Add friend */}
      <motion.div variants={item} className="mb-4">
        <div className="glass rounded-2xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <UserPlus size={14} className="text-white/30" />
            <p className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase">Ajouter un ami</p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={addCode}
              onChange={(e) => setAddCode(e.target.value)}
              placeholder="Coller le code d'un ami..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-neon-blue/40 transition-colors"
              style={{ caretColor: '#00f5ff' }}
              onKeyDown={(e) => e.key === 'Enter' && handleAddFriend()}
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddFriend}
              disabled={!addCode.trim()}
              className="px-4 py-2.5 rounded-xl font-black text-xs tracking-widest text-black transition-all"
              style={{
                background: addCode.trim()
                  ? 'linear-gradient(135deg,#00f5ff,#7c3aed)'
                  : 'rgba(255,255,255,0.08)',
                color: addCode.trim() ? '#000' : 'rgba(255,255,255,0.3)',
                boxShadow: addCode.trim() ? '0 0 15px rgba(0,245,255,0.3)' : 'none',
              }}
            >
              AJOUTER
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            {addStatus !== 'idle' && (
              <motion.p
                key={addStatus}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs mt-2 font-semibold"
                style={{
                  color: addStatus === 'ok' ? '#00ff88'
                    : addStatus === 'already' ? '#f59e0b'
                    : '#ef4444',
                }}
              >
                {addStatus === 'ok' && '✓ Ami ajouté !'}
                {addStatus === 'invalid' && '❌ Code invalide'}
                {addStatus === 'already' && 'Déjà dans ta liste'}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* How it works */}
      <motion.div variants={item}>
        <button
          onClick={() => setShowHowTo((v) => !v)}
          className="w-full glass rounded-2xl p-4 border border-white/10 flex items-center justify-between text-left"
        >
          <span className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase">Comment ça marche ?</span>
          {showHowTo ? <ChevronUp size={14} className="text-white/30" /> : <ChevronDown size={14} className="text-white/30" />}
        </button>

        <AnimatePresence>
          {showHowTo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="glass rounded-b-2xl px-4 pb-4 pt-2 border border-t-0 border-white/10 flex flex-col gap-2">
                {[
                  '1. Partage ton code avec un ami',
                  '2. Ton ami l\'entre dans son app',
                  '3. Vous apparaissez dans vos classements respectifs',
                ].map((step) => (
                  <p key={step} className="text-white/40 text-xs">{step}</p>
                ))}
                <p className="text-white/20 text-xs mt-1">
                  Note : Les stats se mettent à jour quand l&apos;ami partage un nouveau code.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
