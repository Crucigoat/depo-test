'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellOff, AlertCircle, Check } from 'lucide-react';

interface Props {
  notifTime: string | null;
  onSave: (time: string | null) => void;
}

type PermissionState = 'default' | 'granted' | 'denied';

let globalTimeoutId: ReturnType<typeof setTimeout> | null = null;

function scheduleNotification(time: string) {
  if (globalTimeoutId !== null) {
    clearTimeout(globalTimeoutId);
    globalTimeoutId = null;
  }

  const [hours, minutes] = time.split(':').map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(hours, minutes, 0, 0);

  if (target <= now) {
    // Schedule for tomorrow
    target.setDate(target.getDate() + 1);
  }

  const delay = target.getTime() - now.getTime();

  globalTimeoutId = setTimeout(() => {
    if (Notification.permission === 'granted') {
      new Notification('ASCEND — Mission du jour 🔥', {
        body: 'Il est temps d\'ascend. Tes missions t\'attendent.',
        icon: '/depo-test/favicon.ico',
      });
    }
    // Reschedule for next day
    scheduleNotification(time);
  }, delay);
}

export default function NotificationSetup({ notifTime, onSave }: Props) {
  const [localTime, setLocalTime] = useState(notifTime ?? '08:00');
  const [enabled, setEnabled] = useState(notifTime !== null);
  const [permissionState, setPermissionState] = useState<PermissionState>('default');
  const [saved, setSaved] = useState(false);
  const isSupported = typeof window !== 'undefined' && 'Notification' in window;

  useEffect(() => {
    if (isSupported) {
      setPermissionState(Notification.permission as PermissionState);
    }
  }, [isSupported]);

  useEffect(() => {
    setEnabled(notifTime !== null);
    if (notifTime) setLocalTime(notifTime);
  }, [notifTime]);

  const handleSave = async () => {
    if (!isSupported) return;

    if (!enabled) {
      onSave(null);
      if (globalTimeoutId !== null) {
        clearTimeout(globalTimeoutId);
        globalTimeoutId = null;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      return;
    }

    // Request permission
    const permission = await Notification.requestPermission();
    setPermissionState(permission as PermissionState);

    if (permission === 'granted') {
      onSave(localTime);
      scheduleNotification(localTime);

      // Send a test notification
      new Notification('ASCEND — Rappels activés ✅', {
        body: `Tu recevras un rappel chaque jour à ${localTime}.`,
        icon: '/depo-test/favicon.ico',
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  if (!isSupported) {
    return (
      <div className="glass rounded-2xl p-4 border border-white/10">
        <div className="flex items-center gap-2 text-white/30">
          <BellOff size={16} />
          <p className="text-xs">Notifications non supportées sur ce navigateur.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-4 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-neon-blue" />
          <h3 className="text-sm font-bold text-white/80 tracking-wider">RAPPELS QUOTIDIENS</h3>
        </div>

        {/* Toggle */}
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => setEnabled((v) => !v)}
          className="w-12 h-6 rounded-full transition-all duration-300 flex items-center px-1"
          style={{
            background: enabled ? '#00f5ff' : 'rgba(255,255,255,0.1)',
            justifyContent: enabled ? 'flex-end' : 'flex-start',
            boxShadow: enabled ? '0 0 12px rgba(0,245,255,0.4)' : 'none',
          }}
        >
          <motion.div
            layout
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="w-4 h-4 rounded-full bg-white"
          />
        </motion.button>
      </div>

      {/* Denied state */}
      {permissionState === 'denied' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="flex items-start gap-2 mb-3 p-3 rounded-xl"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          <AlertCircle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-red-400/80 text-xs leading-relaxed">
            Les notifications sont bloquées. Active-les dans les paramètres de ton navigateur.
          </p>
        </motion.div>
      )}

      <AnimatePresence>
        {enabled && permissionState !== 'denied' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mb-3">
              <label className="text-white/40 text-xs font-medium block mb-2">HEURE DU RAPPEL</label>
              <input
                type="time"
                value={localTime}
                onChange={(e) => setLocalTime(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-neon-blue/40 transition-colors"
                style={{ colorScheme: 'dark' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={handleSave}
        disabled={permissionState === 'denied'}
        className="w-full py-2.5 rounded-xl text-xs font-bold tracking-wider disabled:opacity-30 flex items-center justify-center gap-2"
        style={{
          background: saved
            ? 'rgba(0,255,136,0.15)'
            : 'rgba(0,245,255,0.1)',
          border: `1px solid ${saved ? 'rgba(0,255,136,0.3)' : 'rgba(0,245,255,0.25)'}`,
          color: saved ? '#00ff88' : '#00f5ff',
        }}
      >
        <AnimatePresence mode="wait">
          {saved ? (
            <motion.span key="saved" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-1">
              <Check size={12} /> SAUVEGARDÉ
            </motion.span>
          ) : (
            <motion.span key="save" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              SAUVEGARDER
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
