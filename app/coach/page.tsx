'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/context';
import { Send, X, Key, ArrowRight } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  id: string;
}

const STORAGE_KEY = 'ascend_coach_messages';
const MAX_MESSAGES = 40;

const GOAL_LABELS: Record<string, string> = {
  muscle: 'Prise de masse', weightloss: 'Perte de poids', cardio: 'Cardio',
  productivity: 'Productivité', mental: 'Mental', sleep: 'Sommeil',
  nutrition: 'Nutrition', social: 'Social', career: 'Carrière', discipline: 'Discipline',
};

const LEVEL_LABELS: Record<string, string> = {
  sedentary: 'Sédentaire', beginner: 'Débutant', intermediate: 'Intermédiaire', advanced: 'Avancé',
};

const GAMEMODE_LABELS: Record<string, string> = {
  normal: 'Normal', hard: 'Hard', extreme: 'Extreme',
};

export default function CoachPage() {
  const { profile, apiKey, setApiKey } = useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [localKey, setLocalKey] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: Message[] = JSON.parse(raw);
        setMessages(parsed.slice(-MAX_MESSAGES));
      }
    } catch {
      // ignore
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const systemPrompt = `Tu es NOVA, le coach IA d'ASCEND. Tu parles en français, tu es direct, motivant et exigeant comme un coach d'élite.
Profil: prénom ${profile?.firstName ?? 'Operator'}, niveau ${LEVEL_LABELS[profile?.level ?? ''] ?? profile?.level}, objectifs: ${profile?.goals?.map(g => GOAL_LABELS[g] ?? g).join(', ') ?? 'non définis'},
faiblesses: ${profile?.weaknesses?.join(', ') ?? 'inconnues'}, mode: ${GAMEMODE_LABELS[profile?.gameMode ?? ''] ?? profile?.gameMode}.
Réponds en 3-4 phrases max, percutantes. Utilise des emojis ponctuellement.
Connais le profil par cœur et y fais référence naturellement.`;

  const welcomeMessage = (): Message => ({
    id: 'welcome',
    role: 'assistant',
    content: `Bonjour ${profile?.firstName ?? 'Operator'} ! Je suis NOVA, ton coach IA personnel. Je connais tes objectifs — ${
      profile?.goals?.map(g => GOAL_LABELS[g] ?? g).join(', ') ?? 'non encore définis'
    }. Dis-moi comment tu vas aujourd'hui, ou demande-moi un conseil. 🔥`,
  });

  const displayMessages = messages.length === 0 ? [welcomeMessage()] : messages;

  const persistMessages = (msgs: Message[]) => {
    const trimmed = msgs.slice(-MAX_MESSAGES);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch {
      // ignore
    }
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    if (!apiKey) {
      setShowKeyInput(true);
      return;
    }

    const userMsg: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: text,
    };

    const baseMessages = messages.length === 0 ? [welcomeMessage()] : messages;
    const newMessages = [...baseMessages, userMsg];
    setMessages(newMessages);
    persistMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 400,
          system: systemPrompt,
          messages: apiMessages,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.error?.message ?? `Erreur HTTP ${res.status}`);
      }

      const data = await res.json();
      const assistantContent: string = data?.content?.[0]?.text ?? 'Désolé, je n\'ai pas pu répondre.';

      const assistantMsg: Message = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: assistantContent,
      };

      const finalMessages = [...newMessages, assistantMsg];
      setMessages(finalMessages);
      persistMessages(finalMessages);
    } catch (err) {
      const errorMsg: Message = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: `❌ Erreur : ${err instanceof Error ? err.message : 'Impossible de contacter l\'API Anthropic.'}`,
      };
      const withError = [...newMessages, errorMsg];
      setMessages(withError);
      persistMessages(withError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  const handleSaveKey = () => {
    const trimmed = localKey.trim();
    if (trimmed) {
      setApiKey(trimmed);
      setShowKeyInput(false);
      setLocalKey('');
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 px-4 pt-6 pb-4 border-b border-white/8"
        style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)' }}
      >
        {/* Avatar NOVA */}
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, rgba(192,132,252,0.4), rgba(59,130,246,0.4))',
            border: '1.5px solid rgba(192,132,252,0.5)',
            boxShadow: '0 0 20px rgba(192,132,252,0.3)',
          }}
        >
          <span className="text-xl font-black text-white">N</span>
        </div>

        <div className="flex-1">
          <h1 className="text-lg font-black tracking-[0.15em] text-white">NOVA</h1>
          <p className="text-white/40 text-xs font-medium">Coach IA Personnel</p>
        </div>

        {/* Online indicator */}
        <div className="flex items-center gap-1.5">
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-green-400"
            style={{ boxShadow: '0 0 6px rgba(74,222,128,0.8)' }}
          />
          <span className="text-green-400 text-[10px] font-bold">EN LIGNE</span>
        </div>
      </motion.div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-6 space-y-3" style={{ paddingBottom: apiKey ? '5rem' : '8rem' }}>
        <AnimatePresence initial={false}>
          {displayMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div
                  className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mr-2 mt-1"
                  style={{
                    background: 'linear-gradient(135deg, rgba(192,132,252,0.3), rgba(59,130,246,0.3))',
                    border: '1px solid rgba(192,132,252,0.3)',
                  }}
                >
                  <span className="text-xs font-black text-white">N</span>
                </div>
              )}
              <div
                className="max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
                style={
                  msg.role === 'user'
                    ? {
                        background: 'linear-gradient(135deg, rgba(0,245,255,0.2), rgba(59,130,246,0.2))',
                        border: '1px solid rgba(0,245,255,0.25)',
                        color: 'rgba(255,255,255,0.9)',
                      }
                    : {
                        background: 'rgba(192,132,252,0.1)',
                        border: '1px solid rgba(192,132,252,0.2)',
                        color: 'rgba(255,255,255,0.85)',
                      }
                }
              >
                {msg.content}
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-start items-end gap-2"
            >
              <div
                className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(192,132,252,0.3), rgba(59,130,246,0.3))',
                  border: '1px solid rgba(192,132,252,0.3)',
                }}
              >
                <span className="text-xs font-black text-white">N</span>
              </div>
              <div
                className="px-4 py-3 rounded-2xl"
                style={{
                  background: 'rgba(192,132,252,0.1)',
                  border: '1px solid rgba(192,132,252,0.2)',
                }}
              >
                <div className="flex gap-1 items-center h-4">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      className="w-1.5 h-1.5 rounded-full bg-violet-400"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* No API key banner */}
      {!apiKey && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-2"
        >
          <button
            onClick={() => setShowKeyInput(true)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold"
            style={{
              background: 'rgba(245,158,11,0.1)',
              border: '1px solid rgba(245,158,11,0.3)',
              color: '#f59e0b',
            }}
          >
            <span>🔑 Configure ta clé API Anthropic pour activer NOVA</span>
            <ArrowRight size={14} />
          </button>
        </motion.div>
      )}

      {/* Input bar */}
      <div
        className="px-4 pt-2 pb-24 border-t border-white/8"
        style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)' }}
      >
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Parle à NOVA..."
            disabled={isLoading}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-violet-400/40 transition-colors disabled:opacity-50"
          />
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 disabled:opacity-30"
            style={{
              background: 'linear-gradient(135deg, rgba(192,132,252,0.4), rgba(59,130,246,0.4))',
              border: '1px solid rgba(192,132,252,0.4)',
              boxShadow: '0 0 15px rgba(192,132,252,0.2)',
            }}
          >
            <Send size={16} className="text-violet-300" />
          </motion.button>
        </div>
      </div>

      {/* API Key Modal */}
      <AnimatePresence>
        {showKeyInput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowKeyInput(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="w-full max-w-sm rounded-2xl p-6"
              style={{
                background: 'rgba(10,10,20,0.98)',
                border: '1px solid rgba(192,132,252,0.25)',
                boxShadow: '0 0 40px rgba(192,132,252,0.15)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Key size={18} className="text-violet-400" />
                  <h2 className="font-black text-white tracking-wider">CLÉ API ANTHROPIC</h2>
                </div>
                <button onClick={() => setShowKeyInput(false)} className="text-white/30 hover:text-white/60">
                  <X size={18} />
                </button>
              </div>

              <p className="text-white/40 text-xs mb-4 leading-relaxed">
                Ta clé est stockée localement sur ton appareil. Elle n&apos;est jamais envoyée à nos serveurs.
              </p>

              <input
                type="password"
                value={localKey}
                onChange={(e) => setLocalKey(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSaveKey(); }}
                placeholder="sk-ant-..."
                autoFocus
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-violet-400/40 transition-colors mb-3"
              />

              <a
                href="https://console.anthropic.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-xs text-violet-400/70 hover:text-violet-400 mb-4 transition-colors"
              >
                Obtenir une clé sur console.anthropic.com ↗
              </a>

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleSaveKey}
                disabled={!localKey.trim()}
                className="w-full py-3 rounded-xl font-bold text-sm disabled:opacity-40"
                style={{
                  background: 'linear-gradient(135deg, rgba(192,132,252,0.4), rgba(59,130,246,0.4))',
                  border: '1px solid rgba(192,132,252,0.4)',
                  color: 'white',
                }}
              >
                SAUVEGARDER
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
