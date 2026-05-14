'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/context';
import type { TodoItem } from '@/lib/todoTypes';
import { X, Plus, ClipboardList } from 'lucide-react';

const CATEGORY_CONFIG: Record<TodoItem['category'], { label: string; emoji: string; color: string }> = {
  perso: { label: 'Perso', emoji: '🧑', color: '#00f5ff' },
  boulot: { label: 'Boulot', emoji: '💼', color: '#f59e0b' },
  sport: { label: 'Sport', emoji: '🏃', color: '#00ff88' },
  mental: { label: 'Mental', emoji: '🧠', color: '#c084fc' },
};

type FilterType = 'tout' | 'actives' | 'faites';

function getTomorrowDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function getTodayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatTomorrowLabel(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
}

export default function TodoPage() {
  const { todoItems, addTodo, toggleTodo, deleteTodo } = useApp();
  const [inputText, setInputText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TodoItem['category']>('perso');
  const [filter, setFilter] = useState<FilterType>('tout');
  const inputRef = useRef<HTMLInputElement>(null);

  const tomorrow = getTomorrowDate();
  const today = getTodayDate();

  // Show todos for today or tomorrow
  const relevantTodos = todoItems.filter(
    (item) => item.targetDate === tomorrow || item.targetDate === today,
  );

  const filteredTodos = relevantTodos.filter((item) => {
    if (filter === 'actives') return !item.completed;
    if (filter === 'faites') return item.completed;
    return true;
  });

  const completedCount = relevantTodos.filter((i) => i.completed).length;
  const totalCount = relevantTodos.length;

  const handleAdd = () => {
    const text = inputText.trim();
    if (!text) return;
    addTodo(text, selectedCategory, tomorrow);
    setInputText('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAdd();
  };

  const tomorrowLabel = formatTomorrowLabel();
  const capitalizedLabel = tomorrowLabel.charAt(0).toUpperCase() + tomorrowLabel.slice(1);

  return (
    <div className="min-h-screen bg-black px-4 pt-6 pb-28">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-2"
      >
        <h1 className="text-2xl font-black tracking-[0.12em] text-gradient-blue mb-0.5">
          PLAN DE DEMAIN
        </h1>
        <p className="text-white/40 text-xs font-medium">{capitalizedLabel}</p>
      </motion.div>

      {/* Stats sous-header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-5"
      >
        <p className="text-white/30 text-xs">
          <span className="text-neon-blue font-bold">{completedCount}</span>
          <span className="text-white/30">/{totalCount} tâches complétées</span>
        </p>
      </motion.div>

      {/* Input section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass rounded-2xl p-4 border border-white/10 mb-5"
        style={{ boxShadow: '0 0 30px rgba(0,245,255,0.05)' }}
      >
        {/* Text input */}
        <div className="flex gap-2 mb-3">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ajouter une tâche..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-neon-blue/40 transition-colors"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleAdd}
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(0,245,255,0.3), rgba(124,58,237,0.3))',
              border: '1px solid rgba(0,245,255,0.3)',
              boxShadow: '0 0 15px rgba(0,245,255,0.2)',
            }}
          >
            <Plus size={20} className="text-neon-blue" />
          </motion.button>
        </div>

        {/* Category selector */}
        <div className="flex gap-2">
          {(Object.entries(CATEGORY_CONFIG) as [TodoItem['category'], typeof CATEGORY_CONFIG.perso][]).map(
            ([key, cfg]) => (
              <motion.button
                key={key}
                whileTap={{ scale: 0.92 }}
                onClick={() => setSelectedCategory(key)}
                className="flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl text-[10px] font-bold transition-all"
                style={{
                  background:
                    selectedCategory === key
                      ? `${cfg.color}20`
                      : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${selectedCategory === key ? cfg.color + '60' : 'rgba(255,255,255,0.08)'}`,
                  color: selectedCategory === key ? cfg.color : 'rgba(255,255,255,0.3)',
                  boxShadow: selectedCategory === key ? `0 0 12px ${cfg.color}30` : 'none',
                }}
              >
                <span className="text-base">{cfg.emoji}</span>
                <span>{cfg.label}</span>
              </motion.button>
            ),
          )}
        </div>
      </motion.div>

      {/* Filter tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2 mb-4"
      >
        {(['tout', 'actives', 'faites'] as FilterType[]).map((f) => {
          const labels: Record<FilterType, string> = { tout: 'Tout', actives: 'Actives', faites: 'Faites' };
          const isActive = filter === f;
          return (
            <motion.button
              key={f}
              whileTap={{ scale: 0.94 }}
              onClick={() => setFilter(f)}
              className="flex-1 py-1.5 rounded-xl text-xs font-bold tracking-wider transition-all"
              style={{
                background: isActive ? 'rgba(0,245,255,0.1)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isActive ? 'rgba(0,245,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
                color: isActive ? '#00f5ff' : 'rgba(255,255,255,0.3)',
              }}
            >
              {labels[f].toUpperCase()}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Todo list */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="flex flex-col gap-2"
      >
        <AnimatePresence mode="popLayout">
          {filteredTodos.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 gap-3"
            >
              <ClipboardList size={40} className="text-white/10" />
              <p className="text-white/30 text-sm font-medium">Aucune tâche planifiée pour demain</p>
              <p className="text-white/15 text-xs">Commence à organiser ta victoire</p>
            </motion.div>
          ) : (
            filteredTodos.map((item) => {
              const cfg = CATEGORY_CONFIG[item.category];
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20, scale: 0.96 }}
                  animate={{ opacity: item.completed ? 0.55 : 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.94, transition: { duration: 0.2 } }}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  className="glass rounded-xl border border-white/10 px-3 py-3 flex items-center gap-3"
                  style={{
                    borderColor: item.completed ? 'rgba(255,255,255,0.06)' : `${cfg.color}20`,
                  }}
                >
                  {/* Checkbox */}
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={() => toggleTodo(item.id)}
                    className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
                    style={{
                      borderColor: item.completed ? cfg.color : 'rgba(255,255,255,0.2)',
                      background: item.completed ? cfg.color + '30' : 'transparent',
                      boxShadow: item.completed ? `0 0 8px ${cfg.color}50` : 'none',
                    }}
                  >
                    <AnimatePresence>
                      {item.completed && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                          className="w-3 h-3 rounded-full"
                          style={{ background: cfg.color }}
                        />
                      )}
                    </AnimatePresence>
                  </motion.button>

                  {/* Text */}
                  <p
                    className="flex-1 text-sm font-medium transition-all"
                    style={{
                      color: item.completed ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.85)',
                      textDecoration: item.completed ? 'line-through' : 'none',
                    }}
                  >
                    {item.text}
                  </p>

                  {/* Category badge */}
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{
                      background: cfg.color + '15',
                      color: cfg.color,
                      border: `1px solid ${cfg.color}30`,
                    }}
                  >
                    {cfg.emoji} {cfg.label}
                  </span>

                  {/* Delete button */}
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => deleteTodo(item.id)}
                    className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-white/20 hover:text-white/50 hover:bg-white/5 transition-all"
                  >
                    <X size={14} />
                  </motion.button>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
