'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp, useLevel } from '@/lib/context';
import { calculateLevel } from '@/lib/gameData';
import { decodeShareCode } from '@/lib/friendsUtils';
import { Copy, Share2, X, UserPlus, RefreshCw, Trophy, Zap } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 28 } },
};

function getAvatarColor(name: string): string {
  const colors = ['#00f5ff', '#7c3aed', '#f59e0b', '#00ff88', '#ef4444', '#c084fc'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function getRankLabel(rank: number): { text: string; color: string } {
  if (rank === 1) return { text: '🥇', color: '#f59e0b' };
  if (rank === 2) return { text: '🥈', color: '#9ca3af' };
  if (rank === 3) return { text: '🥉', color: '#b45309' };
  return { text: `#${rank}`, color: 'rgba(255,255,255,0.3)' };
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `il y a ${days}j`;
  if (hours > 0) return `il y a ${hours}h`;
  if (mins > 0) return `il y a ${mins}min`;
  return 'à l\'instant';
}

interface XPBarMiniProps { xp: number; color: string }
function XPBarMini({ xp, color }: XPBarMiniProps) {
  const { currentXP, requiredXP, level } = calculateLevel(xp);
  const pct = Math.min((currentXP / requiredXP) * 100, 100);
  return (
    <div className="flex items-center gap-2 mt-1.5">
      <span className="text-[10px] font-black" style={{ color }}>Niv.{level}</span>
      <div className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color, boxShadow: `0 0 6px ${color}80` }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <span className="text-[10px] text-white/30">{currentXP}/{requiredXP}</span>
    </div>
  );
}

export default function SocialPage() {
  const { profile, friends, addFriend, removeFriend, myShareCode, xp, streak } = useApp();
  const { level } = useLevel();

  const [addCode, setAddCode] = useState('');
  const [addStatus, setAddStatus] = useState<'idle' | 'ok' | 'invalid' | 'already' | 'updated'>('idle');
  const [copied, setCopied] = useState(false);
  const [refreshingCode, setRefreshingCode] = useState<string | null>(null);
  const [refreshInput, setRefreshInput] = useState('');

  const leaderboard = [
    { firstName: profile?.firstName ?? 'Toi', level, xp, streak, goals: profile?.goals ?? [], isMe: true, code: undefined as string | undefined, addedAt: '' },
    ...friends.map(f => ({ ...f, isMe: false })),
  ].sort((a, b) => b.xp - a.xp);

  const handleCopyCode = async () => {
    try { await navigator.clipboard.writeText(myShareCode); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* noop */ }
  };

  const handleShare = async () => {
    const text = `🚀 Rejoins-moi sur ASCEND ! Mon code : ${myShareCode}`;
    if (navigator.share) { try { await navigator.share({ title: 'ASCEND', text }); return; } catch { /* noop */ } }
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* noop */ }
  };

  const handleAdd = () => {
    const trimmed = addCode.trim();
    if (!trimmed) return;
    const result = addFriend(trimmed);
    setAddStatus(result === 'ok' ? 'ok' : result === 'already_added' ? 'already' : 'invalid');
    if (result === 'ok') setAddCode('');
    setTimeout(() => setAddStatus('idle'), 3000);
  };

  const handleRefresh = (oldCode: string) => {
    const trimmed = refreshInput.trim();
    if (!trimmed) return;
    const decoded = decodeShareCode(trimmed);
    if (!decoded) { setAddStatus('invalid'); setTimeout(() => setAddStatus('idle'), 3000); return; }
    removeFriend(oldCode);
    addFriend(trimmed);
    setRefreshingCode(null);
    setRefreshInput('');
    setAddStatus('updated');
    setTimeout(() => setAddStatus('idle'), 3000);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="min-h-screen bg-black px-4 pt-6 pb-28">

      {/* Header */}
      <motion.div variants={item} className="mb-5">
        <h1 className="text-3xl font-black tracking-[0.15em] text-white">CLASSEMENT</h1>
        <p className="text-white/30 text-xs font-bold tracking-widest mt-0.5">
          {friends.length} ami{friends.length !== 1 ? 's' : ''} • Stats en temps réel via code
        </p>
      </motion.div>

      {/* My card */}
      <motion.div variants={item} className="rounded-2xl p-4 mb-4 relative overflow-hidden"
        style={{ border: '1px solid rgba(0,245,255,0.35)', background: 'linear-gradient(135deg,rgba(0,245,255,0.06),rgba(124,58,237,0.06))', boxShadow: '0 0 30px rgba(0,245,255,0.1)' }}
      >
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-black" style={{ background: 'rgba(0,245,255,0.15)', color: '#00f5ff', border: '1px solid rgba(0,245,255,0.3)' }}>TOI • LIVE</div>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-xl text-black flex-shrink-0" style={{ background: getAvatarColor(profile?.firstName ?? 'A') }}>
            {(profile?.firstName ?? 'A').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="text-white font-black tracking-wider">{(profile?.firstName ?? 'MOI').toUpperCase()}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-neon-gold text-xs font-black flex items-center gap-1"><Zap size={10} />{xp} XP</span>
              <span className="text-white/30 text-xs">🔥 {streak}j</span>
            </div>
            <XPBarMini xp={xp} color="#00f5ff" />
          </div>
        </div>

        {/* Share code */}
        <div className="rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-white/30 text-[10px] font-bold tracking-widest uppercase mb-2">
            Ton code — partage-le pour que tes amis voient tes stats à jour
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-[11px] text-white/60 font-mono truncate">{myShareCode.slice(0, 24)}…</code>
            <motion.button whileTap={{ scale: 0.92 }} onClick={handleCopyCode}
              className="p-2 rounded-lg border text-xs font-bold"
              style={{ background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.2)', color: copied ? '#00ff88' : '#00f5ff' }}
            >
              {copied ? '✓' : <Copy size={13} />}
            </motion.button>
            <motion.button whileTap={{ scale: 0.92 }} onClick={handleShare}
              className="flex items-center gap-1 px-3 py-2 rounded-lg font-bold text-xs text-black"
              style={{ background: 'linear-gradient(135deg,#00f5ff,#7c3aed)' }}
            >
              <Share2 size={12} />Partager
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Leaderboard */}
      <motion.div variants={item} className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Trophy size={14} style={{ color: '#f59e0b' }} />
          <span className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase">Classement général</span>
        </div>

        {leaderboard.length <= 1 && friends.length === 0 ? (
          <div className="rounded-2xl p-6 text-center border border-white/8" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <p className="text-white/30 text-sm mb-1">Aucun ami encore</p>
            <p className="text-white/15 text-xs">Ajoute des amis via leur code ci-dessous</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {leaderboard.map((entry, idx) => {
              const rank = getRankLabel(idx + 1);
              const avatarColor = getAvatarColor(entry.firstName);
              const isRefreshing = !entry.isMe && entry.code === refreshingCode;
              return (
                <motion.div key={entry.isMe ? '__me__' : entry.code}
                  layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
                  className="rounded-2xl border overflow-hidden"
                  style={{ borderColor: entry.isMe ? 'rgba(0,245,255,0.25)' : 'rgba(255,255,255,0.07)', background: entry.isMe ? 'rgba(0,245,255,0.04)' : 'rgba(255,255,255,0.02)' }}
                >
                  <div className="flex items-center gap-3 p-3">
                    {/* Rank */}
                    <span className="text-lg w-8 text-center flex-shrink-0 font-black" style={{ color: rank.color }}>{rank.text}</span>

                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm text-black flex-shrink-0" style={{ background: avatarColor }}>
                      {entry.firstName.charAt(0).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-bold text-sm truncate">{entry.firstName}</p>
                        {entry.isMe && <span className="text-[9px] text-neon-blue font-bold border border-neon-blue/30 rounded-full px-1">LIVE</span>}
                        {!entry.isMe && entry.addedAt && (
                          <span className="text-[9px] text-white/20">sync {timeAgo(entry.addedAt)}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-neon-gold text-xs font-black">{entry.xp} XP</span>
                        <span className="text-white/30 text-xs">🔥 {entry.streak}j</span>
                      </div>
                      <XPBarMini xp={entry.xp} color={entry.isMe ? '#00f5ff' : avatarColor} />
                    </div>

                    {/* Actions for friends */}
                    {!entry.isMe && entry.code && (
                      <div className="flex flex-col gap-1 flex-shrink-0">
                        <motion.button whileTap={{ scale: 0.9 }}
                          onClick={() => { setRefreshingCode(isRefreshing ? null : entry.code!); setRefreshInput(''); }}
                          className="p-1.5 rounded-lg transition-colors"
                          style={{ color: isRefreshing ? '#00f5ff' : 'rgba(255,255,255,0.2)', background: isRefreshing ? 'rgba(0,245,255,0.1)' : 'transparent' }}
                          title="Mettre à jour"
                        >
                          <RefreshCw size={13} />
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.9 }}
                          onClick={() => removeFriend(entry.code!)}
                          className="p-1.5 rounded-lg text-white/15 hover:text-red-400 transition-colors"
                        >
                          <X size={13} />
                        </motion.button>
                      </div>
                    )}
                  </div>

                  {/* Refresh panel */}
                  <AnimatePresence>
                    {isRefreshing && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 pb-3 flex gap-2 border-t border-white/5 pt-2">
                          <input
                            type="text"
                            value={refreshInput}
                            onChange={(e) => setRefreshInput(e.target.value)}
                            placeholder="Colle le nouveau code de ton ami…"
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/20 outline-none focus:border-neon-blue/40"
                            onKeyDown={(e) => e.key === 'Enter' && handleRefresh(entry.code!)}
                          />
                          <motion.button whileTap={{ scale: 0.9 }}
                            onClick={() => handleRefresh(entry.code!)}
                            className="px-3 py-2 rounded-xl text-xs font-black text-black"
                            style={{ background: 'linear-gradient(135deg,#00f5ff,#7c3aed)' }}
                          >
                            SYNC
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Status toast */}
      <AnimatePresence>
        {addStatus !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl text-sm font-bold z-50"
            style={{
              background: addStatus === 'ok' || addStatus === 'updated' ? 'rgba(0,255,136,0.15)' : addStatus === 'already' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
              border: `1px solid ${addStatus === 'ok' || addStatus === 'updated' ? 'rgba(0,255,136,0.4)' : addStatus === 'already' ? 'rgba(245,158,11,0.4)' : 'rgba(239,68,68,0.4)'}`,
              color: addStatus === 'ok' || addStatus === 'updated' ? '#00ff88' : addStatus === 'already' ? '#f59e0b' : '#ef4444',
            }}
          >
            {addStatus === 'ok' && '✓ Ami ajouté !'}
            {addStatus === 'updated' && '✓ Stats mises à jour !'}
            {addStatus === 'invalid' && '❌ Code invalide'}
            {addStatus === 'already' && 'Déjà dans ta liste'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add friend */}
      <motion.div variants={item}>
        <div className="rounded-2xl p-4 border border-white/8" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <div className="flex items-center gap-2 mb-3">
            <UserPlus size={14} className="text-white/30" />
            <p className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase">Ajouter un ami</p>
          </div>
          <div className="flex gap-2">
            <input
              type="text" value={addCode} onChange={(e) => setAddCode(e.target.value)}
              placeholder="Coller le code d'un ami…"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-white/20 outline-none focus:border-neon-blue/40"
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
            <motion.button whileTap={{ scale: 0.95 }} onClick={handleAdd} disabled={!addCode.trim()}
              className="px-4 py-2.5 rounded-xl font-black text-xs text-black"
              style={{ background: addCode.trim() ? 'linear-gradient(135deg,#00f5ff,#7c3aed)' : 'rgba(255,255,255,0.08)', color: addCode.trim() ? '#000' : 'rgba(255,255,255,0.3)' }}
            >
              AJOUTER
            </motion.button>
          </div>
          <p className="text-white/20 text-xs mt-2">
            💡 Pour mettre à jour les stats d&apos;un ami, clique sur <RefreshCw size={10} className="inline" /> sur sa carte et colle son nouveau code.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
