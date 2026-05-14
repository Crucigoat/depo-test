'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check, ArrowLeft } from 'lucide-react';
import type {
  UserProfile, AgeRange, Goal, Level, TimeAvailable,
  Weakness, Rhythm, GameMode, Motivation,
} from '@/lib/profileTypes';

interface Props {
  onComplete: (profile: UserProfile) => void;
  initialProfile?: UserProfile | null;
}

// ── Step data ─────────────────────────────────────────────────────────────────

const AGE_OPTIONS: { value: AgeRange; label: string }[] = [
  { value: '16-20', label: '16 – 20' },
  { value: '21-25', label: '21 – 25' },
  { value: '26-30', label: '26 – 30' },
  { value: '31-35', label: '31 – 35' },
  { value: '36-45', label: '36 – 45' },
  { value: '46+',   label: '46 +' },
];

const GOAL_OPTIONS: { value: Goal; emoji: string; label: string }[] = [
  { value: 'muscle',       emoji: '💪', label: 'Prise de masse' },
  { value: 'weightloss',   emoji: '🔥', label: 'Perte de poids' },
  { value: 'cardio',       emoji: '🏃', label: 'Cardio & endurance' },
  { value: 'productivity', emoji: '⚡', label: 'Productivité' },
  { value: 'mental',       emoji: '🧠', label: 'Équilibre mental' },
  { value: 'sleep',        emoji: '😴', label: 'Améliorer le sommeil' },
  { value: 'nutrition',    emoji: '🥗', label: 'Nutrition' },
  { value: 'social',       emoji: '🤝', label: 'Développement social' },
  { value: 'career',       emoji: '🏆', label: 'Succès professionnel' },
  { value: 'discipline',   emoji: '🧲', label: 'Discipline de fer' },
];

const LEVEL_OPTIONS: { value: Level; emoji: string; label: string; desc: string }[] = [
  { value: 'sedentary',    emoji: '🛋️', label: 'Sédentaire',    desc: 'Peu ou pas d\'activité physique au quotidien.' },
  { value: 'beginner',     emoji: '🚶', label: 'Débutant',      desc: 'Quelques sorties ou séances par semaine.' },
  { value: 'intermediate', emoji: '🏋️', label: 'Intermédiaire', desc: 'Entraînement régulier, bonne discipline.' },
  { value: 'advanced',     emoji: '⚡', label: 'Avancé',        desc: 'Haute performance, mode excellence.' },
];

const TIME_OPTIONS: { value: TimeAvailable; emoji: string; label: string; desc: string }[] = [
  { value: 'short',     emoji: '⚡', label: '15 – 30 min', desc: 'Missions express, impact maximal.' },
  { value: 'medium',    emoji: '🕐', label: '30 – 60 min', desc: 'Routine équilibrée et efficace.' },
  { value: 'long',      emoji: '🔥', label: '1 – 2 heures', desc: 'Entraînement sérieux et profond.' },
  { value: 'unlimited', emoji: '💎', label: '2 h et plus',  desc: 'Mode tout ou rien. Tu donnes tout.' },
];

const WEAKNESS_OPTIONS: { value: Weakness; emoji: string; label: string }[] = [
  { value: 'screens',        emoji: '📱', label: 'Trop d\'écrans' },
  { value: 'food',           emoji: '🍕', label: 'Mauvaise alimentation' },
  { value: 'sleep',          emoji: '😴', label: 'Manque de sommeil' },
  { value: 'procrastination',emoji: '😩', label: 'Procrastination' },
  { value: 'stress',         emoji: '😰', label: 'Stress & anxiété' },
  { value: 'sedentary',      emoji: '🏃', label: 'Sédentarité' },
  { value: 'focus',          emoji: '🎯', label: 'Manque de focus' },
  { value: 'social',         emoji: '😶', label: 'Isolement / timidité' },
  { value: 'addictions',     emoji: '☕', label: 'Dépendances (sucre, caféine…)' },
  { value: 'finances',       emoji: '💸', label: 'Désorganisation financière' },
];

const RHYTHM_OPTIONS: { value: Rhythm; emoji: string; label: string; desc: string }[] = [
  { value: 'early',    emoji: '🌅', label: 'Lève-tôt',    desc: 'Debout entre 5h et 7h, pic de forme le matin.' },
  { value: 'morning',  emoji: '☀️', label: 'Matinal',     desc: 'Réveil entre 7h et 9h, actif la matinée.' },
  { value: 'night',    emoji: '🌙', label: 'Noctambule',  desc: 'Plus efficace le soir ou la nuit.' },
  { value: 'variable', emoji: '🔀', label: 'Variable',    desc: 'Pas de routine fixe, chaque jour est différent.' },
];

const GAMEMODE_OPTIONS: { value: GameMode; emoji: string; label: string; desc: string; color: string }[] = [
  {
    value: 'normal', emoji: '😊', label: 'Normal',
    desc: 'Progression régulière, missions accessibles. Idéal pour construire des bases solides.',
    color: '#00ff88',
  },
  {
    value: 'hard', emoji: '💪', label: 'Hard',
    desc: 'Missions exigeantes, peu de facilités. Pour ceux qui veulent être poussés.',
    color: '#f59e0b',
  },
  {
    value: 'extreme', emoji: '🔱', label: 'Extreme',
    desc: 'Mode guerrier. Missions maximales. Tout ou rien. Pour l\'élite seulement.',
    color: '#ef4444',
  },
];

const MOTIVATION_OPTIONS: { value: Motivation; emoji: string; label: string }[] = [
  { value: 'health',      emoji: '💊', label: 'Santé & longévité' },
  { value: 'appearance',  emoji: '🪞', label: 'Confiance & apparence' },
  { value: 'success',     emoji: '🏆', label: 'Succès & ambition' },
  { value: 'inspire',     emoji: '❤️', label: 'Inspirer mes proches' },
  { value: 'peace',       emoji: '🧘', label: 'Paix intérieure' },
  { value: 'prove',       emoji: '🎯', label: 'Me prouver que je peux' },
];

// ── Animation variants ────────────────────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({
    x: dir < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

// ── Sub-components ────────────────────────────────────────────────────────────

function OptionCard({
  selected, onClick, children, color,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      className="relative w-full text-left rounded-2xl border p-3 transition-all duration-200"
      style={{
        background: selected
          ? `${color ?? '#00f5ff'}18`
          : 'rgba(255,255,255,0.04)',
        borderColor: selected ? (color ?? '#00f5ff') : 'rgba(255,255,255,0.1)',
        boxShadow: selected ? `0 0 20px ${color ?? '#00f5ff'}30` : 'none',
      }}
    >
      {selected && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: color ?? '#00f5ff' }}
        >
          <Check size={12} className="text-black" />
        </motion.span>
      )}
      {children}
    </motion.button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

const TOTAL_STEPS = 9;

export default function OnboardingFlow({ onComplete, initialProfile }: Props) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const [firstName, setFirstName]           = useState(initialProfile?.firstName ?? '');
  const [ageRange, setAgeRange]             = useState<AgeRange>(initialProfile?.ageRange ?? '21-25');
  const [goals, setGoals]                   = useState<Goal[]>(initialProfile?.goals ?? []);
  const [level, setLevel]                   = useState<Level>(initialProfile?.level ?? 'beginner');
  const [timeAvailable, setTimeAvailable]   = useState<TimeAvailable>(initialProfile?.timeAvailable ?? 'medium');
  const [weaknesses, setWeaknesses]         = useState<Weakness[]>(initialProfile?.weaknesses ?? []);
  const [rhythm, setRhythm]                 = useState<Rhythm>(initialProfile?.rhythm ?? 'morning');
  const [gameMode, setGameMode]             = useState<GameMode>(initialProfile?.gameMode ?? 'normal');
  const [motivations, setMotivations]       = useState<Motivation[]>(initialProfile?.motivations ?? []);

  const go = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  const toggleArr = <T,>(arr: T[], val: T, max?: number): T[] => {
    if (arr.includes(val)) return arr.filter((v) => v !== val);
    if (max && arr.length >= max) return arr;
    return [...arr, val];
  };

  const canContinue = () => {
    if (step === 1) return firstName.trim().length > 0;
    if (step === 2) return goals.length > 0;
    if (step === 5) return weaknesses.length > 0;
    if (step === 8) return motivations.length > 0;
    return true;
  };

  const handleFinish = () => {
    const now = new Date().toISOString();
    const profile: UserProfile = {
      firstName: firstName.trim(),
      ageRange,
      goals,
      level,
      timeAvailable,
      weaknesses,
      rhythm,
      gameMode,
      motivations,
      createdAt: initialProfile?.createdAt ?? now,
      updatedAt: now,
    };
    onComplete(profile);
  };

  const progressPct = (step / (TOTAL_STEPS - 1)) * 100;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col overflow-hidden">
      {/* Progress bar */}
      <div className="h-0.5 bg-white/5 flex-shrink-0">
        <motion.div
          className="h-full"
          style={{ background: 'linear-gradient(90deg,#00f5ff,#7c3aed)' }}
          animate={{ width: `${progressPct}%` }}
          transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        />
      </div>

      {/* Back button */}
      <div className="px-4 pt-4 pb-0 flex-shrink-0 h-12 flex items-center">
        {step > 0 && step < TOTAL_STEPS - 1 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => go(step - 1)}
            className="flex items-center gap-1 text-white/40 hover:text-white/80 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Retour</span>
          </motion.button>
        )}
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
            className="absolute inset-0 overflow-y-auto px-5 pb-4"
          >
            {step === 0 && <StepWelcome onStart={() => go(1)} />}
            {step === 1 && (
              <StepName
                firstName={firstName}
                setFirstName={setFirstName}
                ageRange={ageRange}
                setAgeRange={setAgeRange}
              />
            )}
            {step === 2 && (
              <StepGoals
                goals={goals}
                toggle={(g) => setGoals(toggleArr(goals, g, 4))}
              />
            )}
            {step === 3 && (
              <StepLevel level={level} setLevel={setLevel} />
            )}
            {step === 4 && (
              <StepTime timeAvailable={timeAvailable} setTimeAvailable={setTimeAvailable} />
            )}
            {step === 5 && (
              <StepWeaknesses
                weaknesses={weaknesses}
                toggle={(w) => setWeaknesses(toggleArr(weaknesses, w, 5))}
              />
            )}
            {step === 6 && (
              <StepRhythm rhythm={rhythm} setRhythm={setRhythm} />
            )}
            {step === 7 && (
              <StepGameMode gameMode={gameMode} setGameMode={setGameMode} />
            )}
            {step === 8 && (
              <StepMotivations
                motivations={motivations}
                toggle={(m) => setMotivations(toggleArr(motivations, m, 4))}
              />
            )}
            {step === 9 && (
              <StepRecap
                firstName={firstName}
                goals={goals}
                level={level}
                gameMode={gameMode}
                onLaunch={handleFinish}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      {step > 0 && step < 9 && (
        <div className="px-5 pb-10 pt-3 flex-shrink-0">
          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={!canContinue()}
            onClick={() => go(step + 1)}
            className="w-full py-4 rounded-2xl font-black text-sm tracking-[0.15em] flex items-center justify-center gap-2 transition-all duration-300"
            style={{
              background: canContinue()
                ? 'linear-gradient(135deg,#00f5ff,#7c3aed)'
                : 'rgba(255,255,255,0.08)',
              color: canContinue() ? '#000' : 'rgba(255,255,255,0.3)',
              boxShadow: canContinue() ? '0 0 30px rgba(0,245,255,0.3)' : 'none',
            }}
          >
            CONTINUER <ChevronRight size={16} />
          </motion.button>
        </div>
      )}
    </div>
  );
}

// ── Individual steps ──────────────────────────────────────────────────────────

function StepWelcome({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center gap-6">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <h1
          className="text-5xl font-black tracking-[0.2em] mb-2"
          style={{
            background: 'linear-gradient(135deg,#00f5ff,#7c3aed)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          ASCEND
        </h1>
        <p className="text-white/30 text-xs font-bold tracking-[0.3em]">ÉLÈVE-TOI CHAQUE JOUR</p>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-white/60 text-base leading-relaxed max-w-xs"
      >
        Des missions personnalisées générées selon ton profil, ton niveau et tes objectifs.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col gap-3 w-full max-w-xs text-sm text-white/40"
      >
        {['🎯 Missions sur-mesure chaque jour', '⚡ Système XP & progression', '🔥 Streaks & achievements'].map((t) => (
          <div key={t} className="flex items-center gap-2">
            <span>{t}</span>
          </div>
        ))}
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        whileTap={{ scale: 0.97 }}
        onClick={onStart}
        className="w-full max-w-xs py-4 rounded-2xl font-black text-sm tracking-[0.15em] flex items-center justify-center gap-2"
        style={{
          background: 'linear-gradient(135deg,#00f5ff,#7c3aed)',
          color: '#000',
          boxShadow: '0 0 40px rgba(0,245,255,0.4)',
        }}
      >
        COMMENCER MON ASCENSION <ChevronRight size={16} />
      </motion.button>
    </div>
  );
}

function StepName({
  firstName, setFirstName, ageRange, setAgeRange,
}: {
  firstName: string;
  setFirstName: (v: string) => void;
  ageRange: AgeRange;
  setAgeRange: (v: AgeRange) => void;
}) {
  return (
    <div className="pt-6 flex flex-col gap-8">
      <div>
        <p className="text-white/40 text-xs font-bold tracking-[0.2em] uppercase mb-1">Étape 1 / 8</p>
        <h2 className="text-2xl font-black text-white mb-1">Qui es-tu ?</h2>
        <p className="text-white/40 text-sm">On va personnaliser ton expérience.</p>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-white/50 text-xs font-bold tracking-widest uppercase">Ton prénom</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Ex : Alexandre"
          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white text-base font-medium placeholder:text-white/20 focus:outline-none focus:border-neon-blue/50 transition-colors"
          style={{ caretColor: '#00f5ff' }}
        />
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-white/50 text-xs font-bold tracking-widest uppercase">Ta tranche d&apos;âge</label>
        <div className="grid grid-cols-3 gap-2">
          {AGE_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.value}
              selected={ageRange === opt.value}
              onClick={() => setAgeRange(opt.value)}
            >
              <span className="block text-center text-white font-bold text-sm py-1">{opt.label}</span>
            </OptionCard>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepGoals({ goals, toggle }: { goals: Goal[]; toggle: (g: Goal) => void }) {
  return (
    <div className="pt-6 flex flex-col gap-6">
      <div>
        <p className="text-white/40 text-xs font-bold tracking-[0.2em] uppercase mb-1">Étape 2 / 8</p>
        <h2 className="text-2xl font-black text-white mb-1">Tes objectifs</h2>
        <p className="text-white/40 text-sm">Sélectionne jusqu&apos;à 4 objectifs. Tes missions en dépendent.</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {GOAL_OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            selected={goals.includes(opt.value)}
            onClick={() => toggle(opt.value)}
            color="#00f5ff"
          >
            <span className="text-lg mb-1 block">{opt.emoji}</span>
            <span className="text-white font-semibold text-sm">{opt.label}</span>
          </OptionCard>
        ))}
      </div>

      <p className="text-white/30 text-xs text-center">
        {goals.length}/4 sélectionnés
      </p>
    </div>
  );
}

function StepLevel({ level, setLevel }: { level: Level; setLevel: (v: Level) => void }) {
  return (
    <div className="pt-6 flex flex-col gap-6">
      <div>
        <p className="text-white/40 text-xs font-bold tracking-[0.2em] uppercase mb-1">Étape 3 / 8</p>
        <h2 className="text-2xl font-black text-white mb-1">Ton niveau actuel</h2>
        <p className="text-white/40 text-sm">Sois honnête — c&apos;est pour calibrer tes missions.</p>
      </div>

      <div className="flex flex-col gap-3">
        {LEVEL_OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            selected={level === opt.value}
            onClick={() => setLevel(opt.value)}
            color="#7c3aed"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{opt.emoji}</span>
              <div>
                <p className="text-white font-bold">{opt.label}</p>
                <p className="text-white/40 text-xs mt-0.5">{opt.desc}</p>
              </div>
            </div>
          </OptionCard>
        ))}
      </div>
    </div>
  );
}

function StepTime({
  timeAvailable, setTimeAvailable,
}: {
  timeAvailable: TimeAvailable;
  setTimeAvailable: (v: TimeAvailable) => void;
}) {
  return (
    <div className="pt-6 flex flex-col gap-6">
      <div>
        <p className="text-white/40 text-xs font-bold tracking-[0.2em] uppercase mb-1">Étape 4 / 8</p>
        <h2 className="text-2xl font-black text-white mb-1">Ton temps par jour</h2>
        <p className="text-white/40 text-sm">On adapte la durée des missions à ta disponibilité.</p>
      </div>

      <div className="flex flex-col gap-3">
        {TIME_OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            selected={timeAvailable === opt.value}
            onClick={() => setTimeAvailable(opt.value)}
            color="#f59e0b"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{opt.emoji}</span>
              <div>
                <p className="text-white font-bold">{opt.label}</p>
                <p className="text-white/40 text-xs mt-0.5">{opt.desc}</p>
              </div>
            </div>
          </OptionCard>
        ))}
      </div>
    </div>
  );
}

function StepWeaknesses({
  weaknesses, toggle,
}: {
  weaknesses: Weakness[];
  toggle: (w: Weakness) => void;
}) {
  return (
    <div className="pt-6 flex flex-col gap-6">
      <div>
        <p className="text-white/40 text-xs font-bold tracking-[0.2em] uppercase mb-1">Étape 5 / 8</p>
        <h2 className="text-2xl font-black text-white mb-1">Tes points faibles</h2>
        <p className="text-white/40 text-sm">On cible exactement là où tu en as le plus besoin. Max 5.</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {WEAKNESS_OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            selected={weaknesses.includes(opt.value)}
            onClick={() => toggle(opt.value)}
            color="#ef4444"
          >
            <span className="text-lg mb-1 block">{opt.emoji}</span>
            <span className="text-white font-semibold text-xs">{opt.label}</span>
          </OptionCard>
        ))}
      </div>

      <p className="text-white/30 text-xs text-center">{weaknesses.length}/5 sélectionnés</p>
    </div>
  );
}

function StepRhythm({ rhythm, setRhythm }: { rhythm: Rhythm; setRhythm: (v: Rhythm) => void }) {
  return (
    <div className="pt-6 flex flex-col gap-6">
      <div>
        <p className="text-white/40 text-xs font-bold tracking-[0.2em] uppercase mb-1">Étape 6 / 8</p>
        <h2 className="text-2xl font-black text-white mb-1">Ton rythme de vie</h2>
        <p className="text-white/40 text-sm">À quel moment tu es le plus opérationnel ?</p>
      </div>

      <div className="flex flex-col gap-3">
        {RHYTHM_OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            selected={rhythm === opt.value}
            onClick={() => setRhythm(opt.value)}
            color="#00ff88"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{opt.emoji}</span>
              <div>
                <p className="text-white font-bold">{opt.label}</p>
                <p className="text-white/40 text-xs mt-0.5">{opt.desc}</p>
              </div>
            </div>
          </OptionCard>
        ))}
      </div>
    </div>
  );
}

function StepGameMode({ gameMode, setGameMode }: { gameMode: GameMode; setGameMode: (v: GameMode) => void }) {
  return (
    <div className="pt-6 flex flex-col gap-6">
      <div>
        <p className="text-white/40 text-xs font-bold tracking-[0.2em] uppercase mb-1">Étape 7 / 8</p>
        <h2 className="text-2xl font-black text-white mb-1">Ton mode de jeu</h2>
        <p className="text-white/40 text-sm">Définit l&apos;intensité et le nombre de tes missions quotidiennes.</p>
      </div>

      <div className="flex flex-col gap-3">
        {GAMEMODE_OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            selected={gameMode === opt.value}
            onClick={() => setGameMode(opt.value)}
            color={opt.color}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{opt.emoji}</span>
              <div>
                <p className="text-white font-bold">{opt.label}</p>
                <p className="text-white/40 text-xs mt-0.5">{opt.desc}</p>
              </div>
            </div>
          </OptionCard>
        ))}
      </div>
    </div>
  );
}

function StepMotivations({
  motivations, toggle,
}: {
  motivations: Motivation[];
  toggle: (m: Motivation) => void;
}) {
  return (
    <div className="pt-6 flex flex-col gap-6">
      <div>
        <p className="text-white/40 text-xs font-bold tracking-[0.2em] uppercase mb-1">Étape 8 / 8</p>
        <h2 className="text-2xl font-black text-white mb-1">Ce qui te motive</h2>
        <p className="text-white/40 text-sm">Ta raison profonde. Sélectionne ce qui résonne vraiment.</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {MOTIVATION_OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            selected={motivations.includes(opt.value)}
            onClick={() => toggle(opt.value)}
            color="#c084fc"
          >
            <span className="text-lg mb-1 block">{opt.emoji}</span>
            <span className="text-white font-semibold text-sm">{opt.label}</span>
          </OptionCard>
        ))}
      </div>

      <p className="text-white/30 text-xs text-center">{motivations.length} sélectionnée(s)</p>
    </div>
  );
}

function StepRecap({
  firstName, goals, level, gameMode, onLaunch,
}: {
  firstName: string;
  goals: Goal[];
  level: Level;
  gameMode: GameMode;
  onLaunch: () => void;
}) {
  const levelLabels: Record<Level, string> = {
    sedentary: 'Sédentaire', beginner: 'Débutant',
    intermediate: 'Intermédiaire', advanced: 'Avancé',
  };
  const gameModeLabels: Record<GameMode, string> = {
    normal: 'Normal', hard: 'Hard', extreme: 'Extreme',
  };
  const goalEmojis: Record<Goal, string> = {
    muscle: '💪', weightloss: '🔥', cardio: '🏃', productivity: '⚡',
    mental: '🧠', sleep: '😴', nutrition: '🥗', social: '🤝',
    career: '🏆', discipline: '🧲',
  };
  const goalLabels: Record<Goal, string> = {
    muscle: 'Masse', weightloss: 'Poids', cardio: 'Cardio',
    productivity: 'Productivité', mental: 'Mental', sleep: 'Sommeil',
    nutrition: 'Nutrition', social: 'Social', career: 'Carrière',
    discipline: 'Discipline',
  };

  return (
    <div className="pt-6 flex flex-col gap-8 items-center text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-4 mx-auto"
          style={{
            background: 'linear-gradient(135deg,rgba(0,245,255,0.2),rgba(124,58,237,0.2))',
            border: '2px solid rgba(0,245,255,0.4)',
            boxShadow: '0 0 40px rgba(0,245,255,0.3)',
          }}
        >
          <span className="text-3xl font-black text-neon-blue">
            {firstName.charAt(0).toUpperCase()}
          </span>
        </div>
        <h2 className="text-2xl font-black text-white">Prêt, {firstName} !</h2>
        <p className="text-white/40 text-sm mt-1">Ton profil ASCEND est configuré.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full glass rounded-2xl p-4 text-left flex flex-col gap-3"
      >
        <div className="flex justify-between items-center">
          <span className="text-white/40 text-xs">Niveau</span>
          <span className="text-white font-bold text-sm">{levelLabels[level]}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white/40 text-xs">Mode</span>
          <span className="text-white font-bold text-sm">{gameModeLabels[gameMode]}</span>
        </div>
        <div className="flex justify-between items-start">
          <span className="text-white/40 text-xs mt-1">Objectifs</span>
          <div className="flex flex-wrap gap-1 justify-end max-w-[70%]">
            {goals.map((g) => (
              <span
                key={g}
                className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ background: 'rgba(0,245,255,0.1)', color: '#00f5ff', border: '1px solid rgba(0,245,255,0.2)' }}
              >
                {goalEmojis[g]} {goalLabels[g]}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileTap={{ scale: 0.97 }}
        onClick={onLaunch}
        className="w-full py-5 rounded-2xl font-black text-sm tracking-[0.15em]"
        style={{
          background: 'linear-gradient(135deg,#00f5ff,#7c3aed)',
          color: '#000',
          boxShadow: '0 0 50px rgba(0,245,255,0.4)',
        }}
      >
        🚀 LANCER MON ASCENSION
      </motion.button>
    </div>
  );
}
