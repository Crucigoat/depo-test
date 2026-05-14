export type MissionCategory =
  | 'fitness'
  | 'cardio'
  | 'mind'
  | 'nutrition'
  | 'discipline'
  | 'social'
  | 'productivity'
  | 'sleep'
  | 'health';

export type MissionDifficulty = 'easy' | 'medium' | 'hard';
export type MissionDuration = 'short' | 'medium' | 'long';
export type MissionLevel = 'sedentary' | 'beginner' | 'intermediate' | 'advanced';

export interface Mission {
  id: string;
  title: string;
  description: string;
  category: MissionCategory;
  xp: number;
  icon: string;
  difficulty: MissionDifficulty;
  duration: MissionDuration;
  goals: string[];
  weaknesses: string[];
  minLevel: MissionLevel;
}

export const ALL_MISSIONS: Mission[] = [
  // ─── FITNESS ───────────────────────────────────────────────────────────────
  {
    id: 'f1', title: 'Pompes 50×', description: 'Enchaîne 50 pompes, en plusieurs séries si nécessaire.',
    category: 'fitness', xp: 80, icon: 'Dumbbell', difficulty: 'easy', duration: 'short',
    goals: ['muscle', 'weightloss', 'discipline'], weaknesses: ['sedentary'], minLevel: 'sedentary',
  },
  {
    id: 'f2', title: 'Pompes 100×', description: 'Cent pompes. Pas de négociation.',
    category: 'fitness', xp: 140, icon: 'Dumbbell', difficulty: 'medium', duration: 'medium',
    goals: ['muscle', 'discipline'], weaknesses: ['sedentary'], minLevel: 'beginner',
  },
  {
    id: 'f3', title: 'Squats 100×', description: 'Cent squats profonds, dos droit, muscles sous tension.',
    category: 'fitness', xp: 130, icon: 'Activity', difficulty: 'medium', duration: 'medium',
    goals: ['muscle', 'weightloss'], weaknesses: ['sedentary'], minLevel: 'beginner',
  },
  {
    id: 'f4', title: 'Séance muscu 45 min', description: 'Programme complet : poussée, tirage, jambes.',
    category: 'fitness', xp: 180, icon: 'Dumbbell', difficulty: 'hard', duration: 'long',
    goals: ['muscle', 'weightloss'], weaknesses: ['sedentary'], minLevel: 'beginner',
  },
  {
    id: 'f5', title: 'Séance muscu 1 h+', description: 'Session intense, progression sur les charges.',
    category: 'fitness', xp: 230, icon: 'Dumbbell', difficulty: 'hard', duration: 'long',
    goals: ['muscle'], weaknesses: ['sedentary'], minLevel: 'intermediate',
  },
  {
    id: 'f6', title: 'Gainage 10 min', description: 'Planche, planche latérale, hollow hold — minuteur en main.',
    category: 'fitness', xp: 60, icon: 'Flame', difficulty: 'easy', duration: 'short',
    goals: ['muscle', 'weightloss'], weaknesses: ['sedentary'], minLevel: 'sedentary',
  },
  {
    id: 'f7', title: 'Abdos 15 min', description: 'Circuit abdominaux complet, 0 pause entre les séries.',
    category: 'fitness', xp: 75, icon: 'Activity', difficulty: 'easy', duration: 'short',
    goals: ['muscle', 'weightloss'], weaknesses: ['sedentary'], minLevel: 'sedentary',
  },
  {
    id: 'f8', title: 'Mobilité 20 min', description: 'Étirements dynamiques et travail de mobilité articulaire.',
    category: 'fitness', xp: 55, icon: 'Wind', difficulty: 'easy', duration: 'medium',
    goals: ['sleep', 'mental'], weaknesses: ['stress', 'sleep'], minLevel: 'sedentary',
  },
  {
    id: 'f9', title: 'Yoga flow 30 min', description: 'Séquence vinyasa : force, flexibilité, respiration.',
    category: 'fitness', xp: 110, icon: 'Wind', difficulty: 'medium', duration: 'medium',
    goals: ['mental', 'sleep'], weaknesses: ['stress', 'sleep'], minLevel: 'beginner',
  },
  {
    id: 'f10', title: 'Calisthenics 45 min', description: 'Tractions, dips, L-sit, muscle-up — poids du corps.',
    category: 'fitness', xp: 200, icon: 'Dumbbell', difficulty: 'hard', duration: 'long',
    goals: ['muscle', 'discipline'], weaknesses: ['sedentary'], minLevel: 'intermediate',
  },

  // ─── CARDIO ────────────────────────────────────────────────────────────────
  {
    id: 'c1', title: 'Marche 20 min', description: 'Sortir dehors, respirer, avancer. Simple mais puissant.',
    category: 'cardio', xp: 50, icon: 'Footprints', difficulty: 'easy', duration: 'medium',
    goals: ['weightloss', 'cardio', 'mental'], weaknesses: ['sedentary', 'stress'], minLevel: 'sedentary',
  },
  {
    id: 'c2', title: '5 000 pas', description: 'Cinq mille pas dans la journée, peu importe le moment.',
    category: 'cardio', xp: 60, icon: 'Footprints', difficulty: 'easy', duration: 'medium',
    goals: ['weightloss', 'cardio'], weaknesses: ['sedentary'], minLevel: 'sedentary',
  },
  {
    id: 'c3', title: '10 000 pas', description: 'Le standard or. Dix mille pas, zéro excuse.',
    category: 'cardio', xp: 100, icon: 'Footprints', difficulty: 'medium', duration: 'long',
    goals: ['weightloss', 'cardio'], weaknesses: ['sedentary'], minLevel: 'beginner',
  },
  {
    id: 'c4', title: 'Footing 20 min', description: 'Allure modérée, respiration contrôlée.',
    category: 'cardio', xp: 110, icon: 'Activity', difficulty: 'medium', duration: 'medium',
    goals: ['cardio', 'weightloss', 'mental'], weaknesses: ['sedentary', 'stress'], minLevel: 'beginner',
  },
  {
    id: 'c5', title: 'Footing 40 min', description: 'Endurance : maintien l\'allure sur la durée.',
    category: 'cardio', xp: 170, icon: 'Activity', difficulty: 'hard', duration: 'long',
    goals: ['cardio', 'weightloss'], weaknesses: ['sedentary'], minLevel: 'intermediate',
  },
  {
    id: 'c6', title: 'Sprint HIIT 15 min', description: '8 × 20 sec sprint / 10 sec récup. Pousse-toi à fond.',
    category: 'cardio', xp: 160, icon: 'Flame', difficulty: 'hard', duration: 'short',
    goals: ['cardio', 'weightloss', 'discipline'], weaknesses: ['sedentary'], minLevel: 'intermediate',
  },
  {
    id: 'c7', title: 'Vélo 30 min', description: 'Cardio doux ou intensif selon l\'envie du jour.',
    category: 'cardio', xp: 90, icon: 'Bike', difficulty: 'medium', duration: 'medium',
    goals: ['cardio', 'weightloss'], weaknesses: ['sedentary'], minLevel: 'beginner',
  },
  {
    id: 'c8', title: 'Natation 45 min', description: 'Nage complète, alternance des nages.',
    category: 'cardio', xp: 180, icon: 'Waves', difficulty: 'hard', duration: 'long',
    goals: ['cardio', 'mental'], weaknesses: ['sedentary', 'stress'], minLevel: 'intermediate',
  },
  {
    id: 'c9', title: 'Corde à sauter 10 min', description: 'Double unders ou simple — 10 min non-stop.',
    category: 'cardio', xp: 120, icon: 'Flame', difficulty: 'medium', duration: 'short',
    goals: ['cardio', 'discipline'], weaknesses: ['sedentary'], minLevel: 'beginner',
  },
  {
    id: 'c10', title: 'Escaliers uniquement', description: 'Zéro ascenseur, zéro escalator dans la journée.',
    category: 'cardio', xp: 50, icon: 'TrendingUp', difficulty: 'easy', duration: 'short',
    goals: ['weightloss', 'discipline'], weaknesses: ['sedentary', 'procrastination'], minLevel: 'sedentary',
  },

  // ─── NUTRITION ─────────────────────────────────────────────────────────────
  {
    id: 'n1', title: 'Boire 3 L d\'eau', description: 'Hydrate chaque cellule de ton corps. Chaque jour.',
    category: 'nutrition', xp: 60, icon: 'Droplets', difficulty: 'easy', duration: 'short',
    goals: ['nutrition', 'weightloss', 'muscle'], weaknesses: ['food', 'addictions'], minLevel: 'sedentary',
  },
  {
    id: 'n2', title: '0 sucre ajouté', description: 'Pas de bonbons, sodas, gâteaux, ni sauce sucrée.',
    category: 'nutrition', xp: 150, icon: 'Shield', difficulty: 'hard', duration: 'short',
    goals: ['nutrition', 'weightloss', 'discipline'], weaknesses: ['food', 'addictions'], minLevel: 'beginner',
  },
  {
    id: 'n3', title: 'Petit-déj protéiné', description: 'Œufs, fromage blanc, shaker ou saumon. Lance la machine.',
    category: 'nutrition', xp: 65, icon: 'Apple', difficulty: 'easy', duration: 'short',
    goals: ['nutrition', 'muscle'], weaknesses: ['food'], minLevel: 'sedentary',
  },
  {
    id: 'n4', title: 'Préparer ses repas', description: 'Meal prep : cuisiner 3-4 repas d\'avance en une session.',
    category: 'nutrition', xp: 140, icon: 'Apple', difficulty: 'medium', duration: 'long',
    goals: ['nutrition', 'productivity'], weaknesses: ['food', 'procrastination'], minLevel: 'beginner',
  },
  {
    id: 'n5', title: '5 portions de légumes', description: 'Légumes à chaque repas. Pas de négociation.',
    category: 'nutrition', xp: 70, icon: 'Apple', difficulty: 'easy', duration: 'short',
    goals: ['nutrition', 'weightloss'], weaknesses: ['food'], minLevel: 'sedentary',
  },
  {
    id: 'n6', title: 'Zéro fast-food', description: 'Une journée sans malbouffe. C\'est tout ce qu\'on te demande.',
    category: 'nutrition', xp: 110, icon: 'Shield', difficulty: 'medium', duration: 'short',
    goals: ['nutrition', 'weightloss', 'discipline'], weaknesses: ['food', 'addictions'], minLevel: 'beginner',
  },
  {
    id: 'n7', title: 'Jeûne intermittent 16 h', description: 'Fenêtre d\'alimentation de 8h. Eau et thé autorisés.',
    category: 'nutrition', xp: 180, icon: 'Clock', difficulty: 'hard', duration: 'short',
    goals: ['nutrition', 'discipline', 'weightloss'], weaknesses: ['food', 'addictions'], minLevel: 'intermediate',
  },
  {
    id: 'n8', title: '0 alcool', description: 'Aucune goutte. Ton cerveau et tes muscles te remercient.',
    category: 'nutrition', xp: 130, icon: 'Shield', difficulty: 'hard', duration: 'short',
    goals: ['nutrition', 'discipline', 'mental'], weaknesses: ['addictions'], minLevel: 'beginner',
  },
  {
    id: 'n9', title: 'Pas de snacking', description: 'Repas uniquement. Stop aux grignotages entre les repas.',
    category: 'nutrition', xp: 90, icon: 'Shield', difficulty: 'medium', duration: 'short',
    goals: ['nutrition', 'weightloss', 'discipline'], weaknesses: ['food', 'addictions'], minLevel: 'beginner',
  },
  {
    id: 'n10', title: 'Cuisine maison', description: 'Tous tes repas de la journée préparés par toi.',
    category: 'nutrition', xp: 100, icon: 'Apple', difficulty: 'medium', duration: 'medium',
    goals: ['nutrition', 'productivity'], weaknesses: ['food'], minLevel: 'beginner',
  },

  // ─── MENTAL ────────────────────────────────────────────────────────────────
  {
    id: 'm1', title: 'Méditation 10 min', description: 'Assis, les yeux fermés, observe sans juger.',
    category: 'mind', xp: 80, icon: 'Brain', difficulty: 'easy', duration: 'short',
    goals: ['mental', 'sleep'], weaknesses: ['stress', 'focus', 'procrastination'], minLevel: 'sedentary',
  },
  {
    id: 'm2', title: 'Méditation 25 min', description: 'Session profonde. Corps immobile, esprit en observation.',
    category: 'mind', xp: 140, icon: 'Brain', difficulty: 'medium', duration: 'medium',
    goals: ['mental', 'sleep', 'discipline'], weaknesses: ['stress', 'focus'], minLevel: 'beginner',
  },
  {
    id: 'm3', title: 'Journaling 10 min', description: 'Vide ton esprit. Écris ce qui te pèse, ce que tu veux.',
    category: 'mind', xp: 70, icon: 'PenLine', difficulty: 'easy', duration: 'short',
    goals: ['mental', 'productivity'], weaknesses: ['stress', 'procrastination'], minLevel: 'sedentary',
  },
  {
    id: 'm4', title: 'Journaling profond 30 min', description: 'Réflexion sur tes objectifs, tes blocages, ta vision.',
    category: 'mind', xp: 130, icon: 'PenLine', difficulty: 'medium', duration: 'medium',
    goals: ['mental', 'career', 'productivity'], weaknesses: ['stress', 'procrastination'], minLevel: 'beginner',
  },
  {
    id: 'm5', title: 'Lire 20 pages', description: 'Un livre de croissance, d\'histoire ou de stratégie.',
    category: 'mind', xp: 90, icon: 'BookOpen', difficulty: 'medium', duration: 'medium',
    goals: ['mental', 'career', 'productivity'], weaknesses: ['screens', 'procrastination'], minLevel: 'sedentary',
  },
  {
    id: 'm6', title: 'Lire 50 pages', description: 'Session lecture intensive. Coupe les notifs, plonge dedans.',
    category: 'mind', xp: 160, icon: 'BookOpen', difficulty: 'hard', duration: 'long',
    goals: ['mental', 'career'], weaknesses: ['screens', 'procrastination'], minLevel: 'beginner',
  },
  {
    id: 'm7', title: 'Visualisation 10 min', description: 'Ferme les yeux. Projette ta version idéale. Ressens-la.',
    category: 'mind', xp: 75, icon: 'Eye', difficulty: 'easy', duration: 'short',
    goals: ['mental', 'career', 'muscle'], weaknesses: ['stress', 'focus'], minLevel: 'sedentary',
  },
  {
    id: 'm8', title: 'Affirmations matinales', description: 'Cinq affirmations puissantes à voix haute, debout.',
    category: 'mind', xp: 55, icon: 'Zap', difficulty: 'easy', duration: 'short',
    goals: ['mental', 'discipline'], weaknesses: ['stress', 'social'], minLevel: 'sedentary',
  },
  {
    id: 'm9', title: 'Podcast éducatif', description: 'Un épisode sur la psychologie, les affaires ou la santé.',
    category: 'mind', xp: 65, icon: 'BookOpen', difficulty: 'easy', duration: 'medium',
    goals: ['mental', 'career', 'productivity'], weaknesses: ['screens', 'procrastination'], minLevel: 'sedentary',
  },
  {
    id: 'm10', title: 'Mind dump 15 min', description: 'Écris tout ce qui occupe ton esprit sans filtre.',
    category: 'mind', xp: 60, icon: 'PenLine', difficulty: 'easy', duration: 'short',
    goals: ['mental', 'productivity'], weaknesses: ['stress', 'focus', 'procrastination'], minLevel: 'sedentary',
  },

  // ─── DISCIPLINE ────────────────────────────────────────────────────────────
  {
    id: 'd1', title: 'Douche froide', description: 'Eau froide dès la première seconde. Pas de transition.',
    category: 'discipline', xp: 160, icon: 'Zap', difficulty: 'hard', duration: 'short',
    goals: ['discipline', 'mental', 'cardio'], weaknesses: ['procrastination', 'stress'], minLevel: 'beginner',
  },
  {
    id: 'd2', title: 'Réveil sans snooze', description: 'Premier réveil = lever immédiat. Aucune négociation.',
    category: 'discipline', xp: 120, icon: 'Sun', difficulty: 'hard', duration: 'short',
    goals: ['discipline', 'sleep', 'productivity'], weaknesses: ['procrastination', 'sleep'], minLevel: 'beginner',
  },
  {
    id: 'd3', title: 'Lit fait avant 8 h', description: 'Première victoire de la journée. Ordre = discipline.',
    category: 'discipline', xp: 50, icon: 'Home', difficulty: 'easy', duration: 'short',
    goals: ['discipline', 'productivity'], weaknesses: ['procrastination'], minLevel: 'sedentary',
  },
  {
    id: 'd4', title: 'Coucher avant 23 h', description: 'Priorité absolue au sommeil. Écrans éteints à 22h30.',
    category: 'discipline', xp: 100, icon: 'Moon', difficulty: 'medium', duration: 'short',
    goals: ['sleep', 'discipline'], weaknesses: ['screens', 'sleep'], minLevel: 'sedentary',
  },
  {
    id: 'd5', title: 'Zéro réseaux sociaux', description: '24 h sans Instagram, TikTok, Twitter. Ressens la clarté.',
    category: 'discipline', xp: 200, icon: 'PhoneOff', difficulty: 'hard', duration: 'short',
    goals: ['discipline', 'productivity', 'mental'], weaknesses: ['screens', 'procrastination', 'focus'], minLevel: 'beginner',
  },
  {
    id: 'd6', title: 'Mode avion 2 h', description: 'Deux heures de déconnexion totale. Le monde peut attendre.',
    category: 'discipline', xp: 110, icon: 'PhoneOff', difficulty: 'medium', duration: 'medium',
    goals: ['discipline', 'productivity', 'mental'], weaknesses: ['screens', 'focus'], minLevel: 'beginner',
  },
  {
    id: 'd7', title: 'Planning de la journée la veille', description: 'Organise demain ce soir : 3 priorités max.',
    category: 'discipline', xp: 65, icon: 'ClipboardList', difficulty: 'easy', duration: 'short',
    goals: ['productivity', 'discipline'], weaknesses: ['procrastination', 'focus'], minLevel: 'sedentary',
  },
  {
    id: 'd8', title: '1 h sans écran avant dormir', description: 'Protège ta mélatonine. Livre, étirements, journaling.',
    category: 'discipline', xp: 95, icon: 'Moon', difficulty: 'medium', duration: 'short',
    goals: ['sleep', 'discipline'], weaknesses: ['screens', 'sleep', 'addictions'], minLevel: 'sedentary',
  },
  {
    id: 'd9', title: 'Silence 30 min', description: 'Seul avec toi-même. Pas de musique, pas de fond sonore.',
    category: 'discipline', xp: 85, icon: 'Brain', difficulty: 'medium', duration: 'medium',
    goals: ['mental', 'discipline'], weaknesses: ['stress', 'focus', 'screens'], minLevel: 'sedentary',
  },
  {
    id: 'd10', title: 'Espace organisé', description: 'Bureau, chambre ou cuisine : nettoie et range complètement.',
    category: 'discipline', xp: 60, icon: 'Home', difficulty: 'easy', duration: 'short',
    goals: ['productivity', 'discipline'], weaknesses: ['procrastination'], minLevel: 'sedentary',
  },

  // ─── PRODUCTIVITY ──────────────────────────────────────────────────────────
  {
    id: 'p1', title: 'Deep work 90 min', description: 'Bloc de travail focalisé. Téléphone retourné, porte fermée.',
    category: 'productivity', xp: 200, icon: 'Target', difficulty: 'hard', duration: 'long',
    goals: ['productivity', 'career', 'discipline'], weaknesses: ['procrastination', 'focus', 'screens'], minLevel: 'beginner',
  },
  {
    id: 'p2', title: 'Deep work 45 min', description: 'Une seule tâche, zéro distraction, minuteur en marche.',
    category: 'productivity', xp: 120, icon: 'Target', difficulty: 'medium', duration: 'medium',
    goals: ['productivity', 'career'], weaknesses: ['procrastination', 'focus'], minLevel: 'sedentary',
  },
  {
    id: 'p3', title: '3 tâches essentielles', description: 'Identifie et complète tes 3 priorités absolues du jour.',
    category: 'productivity', xp: 130, icon: 'ClipboardList', difficulty: 'medium', duration: 'short',
    goals: ['productivity', 'career'], weaknesses: ['procrastination', 'focus'], minLevel: 'sedentary',
  },
  {
    id: 'p4', title: 'Inbox zéro', description: 'Traite tous tes emails : réponds, archive ou supprime.',
    category: 'productivity', xp: 90, icon: 'Inbox', difficulty: 'medium', duration: 'medium',
    goals: ['productivity', 'career'], weaknesses: ['procrastination', 'focus'], minLevel: 'sedentary',
  },
  {
    id: 'p5', title: 'Pomodoro × 4', description: '4 sessions de 25 min avec pause de 5 min. Méthode validée.',
    category: 'productivity', xp: 170, icon: 'Timer', difficulty: 'hard', duration: 'long',
    goals: ['productivity', 'discipline'], weaknesses: ['procrastination', 'focus', 'screens'], minLevel: 'beginner',
  },
  {
    id: 'p6', title: 'Apprendre 30 min', description: 'Cours en ligne, langue étrangère ou nouvelle compétence.',
    category: 'productivity', xp: 100, icon: 'BookOpen', difficulty: 'medium', duration: 'medium',
    goals: ['career', 'productivity'], weaknesses: ['procrastination', 'screens'], minLevel: 'sedentary',
  },
  {
    id: 'p7', title: 'Gratitude 5 min', description: 'Trois choses pour lesquelles tu es sincèrement reconnaissant.',
    category: 'productivity', xp: 50, icon: 'Heart', difficulty: 'easy', duration: 'short',
    goals: ['mental', 'discipline'], weaknesses: ['stress', 'procrastination'], minLevel: 'sedentary',
  },
  {
    id: 'p8', title: 'Planifier la semaine', description: 'Vue globale de la semaine : objectifs, rendez-vous, priorités.',
    category: 'productivity', xp: 110, icon: 'ClipboardList', difficulty: 'medium', duration: 'medium',
    goals: ['productivity', 'career'], weaknesses: ['procrastination', 'focus', 'finances'], minLevel: 'sedentary',
  },

  // ─── SOCIAL ────────────────────────────────────────────────────────────────
  {
    id: 's1', title: 'Appeler un proche', description: 'Un vrai appel vocal — pas un message — à quelqu\'un qui compte.',
    category: 'social', xp: 70, icon: 'MessageCircle', difficulty: 'easy', duration: 'short',
    goals: ['social', 'mental'], weaknesses: ['social', 'stress'], minLevel: 'sedentary',
  },
  {
    id: 's2', title: 'Complimenter sincèrement', description: 'Dis quelque chose de vrai et positif à quelqu\'un aujourd\'hui.',
    category: 'social', xp: 60, icon: 'Heart', difficulty: 'easy', duration: 'short',
    goals: ['social', 'mental'], weaknesses: ['social'], minLevel: 'sedentary',
  },
  {
    id: 's3', title: 'Parler à un inconnu', description: 'Engage une vraie conversation avec quelqu\'un que tu ne connais pas.',
    category: 'social', xp: 160, icon: 'Users', difficulty: 'hard', duration: 'short',
    goals: ['social', 'discipline'], weaknesses: ['social'], minLevel: 'beginner',
  },
  {
    id: 's4', title: 'Rejoindre un événement', description: 'Meetup, cours collectif, soirée — sors de ta zone.',
    category: 'social', xp: 200, icon: 'Users', difficulty: 'hard', duration: 'long',
    goals: ['social', 'career'], weaknesses: ['social'], minLevel: 'intermediate',
  },
  {
    id: 's5', title: 'Rendre service', description: 'Aide quelqu\'un sans rien attendre en retour.',
    category: 'social', xp: 90, icon: 'Heart', difficulty: 'medium', duration: 'medium',
    goals: ['social', 'mental'], weaknesses: ['social', 'stress'], minLevel: 'sedentary',
  },
  {
    id: 's6', title: 'Message de soutien', description: 'Écris à quelqu\'un qui traverse une période difficile.',
    category: 'social', xp: 65, icon: 'MessageCircle', difficulty: 'easy', duration: 'short',
    goals: ['social', 'mental'], weaknesses: ['social'], minLevel: 'sedentary',
  },
  {
    id: 's7', title: 'Réseau pro 30 min', description: 'LinkedIn, email de suivi, ou coffee chat avec un contact.',
    category: 'social', xp: 130, icon: 'Users', difficulty: 'medium', duration: 'medium',
    goals: ['career', 'social'], weaknesses: ['social', 'procrastination'], minLevel: 'beginner',
  },

  // ─── SLEEP ─────────────────────────────────────────────────────────────────
  {
    id: 'sl1', title: 'Dormir 8 heures', description: 'Heure de coucher respectée, réveil naturel ou alarme douce.',
    category: 'sleep', xp: 110, icon: 'Moon', difficulty: 'medium', duration: 'short',
    goals: ['sleep', 'mental', 'muscle'], weaknesses: ['sleep', 'screens'], minLevel: 'sedentary',
  },
  {
    id: 'sl2', title: 'Sieste 20 min', description: 'Sieste courte, maximum 20 min. Recharge le cerveau.',
    category: 'sleep', xp: 55, icon: 'Moon', difficulty: 'easy', duration: 'short',
    goals: ['sleep', 'productivity'], weaknesses: ['sleep', 'stress'], minLevel: 'sedentary',
  },
  {
    id: 'sl3', title: 'Routine du soir 30 min', description: 'Lumière tamisée, lecture ou méditation. Prépare le sommeil.',
    category: 'sleep', xp: 90, icon: 'Moon', difficulty: 'medium', duration: 'medium',
    goals: ['sleep', 'discipline'], weaknesses: ['sleep', 'screens', 'stress'], minLevel: 'sedentary',
  },
];

export const MOTIVATIONAL_QUOTES = [
  { text: "La discipline que tu construis aujourd'hui est la liberté que tu vivras demain.", author: "ASCEND" },
  { text: "Ton futur toi te regarde en ce moment même à travers tes souvenirs.", author: "Inconnu" },
  { text: "Ne limite pas tes défis. Défie plutôt tes limites.", author: "Jerry Dunn" },
  { text: "La douleur d'aujourd'hui est la force de demain.", author: "Inconnu" },
  { text: "La discipline, c'est choisir entre ce que tu veux maintenant et ce que tu veux le plus.", author: "Abraham Lincoln" },
  { text: "Tu n'atteins pas le niveau de tes objectifs, tu tombes au niveau de tes systèmes.", author: "James Clear" },
  { text: "Le succès n'est pas donné à ceux qui veulent, mais à ceux qui agissent chaque jour.", author: "ASCEND" },
  { text: "Chaque répétition, chaque page, chaque minute — c'est toi qui bâtis ton empire.", author: "ASCEND" },
  { text: "L'homme qui déplace une montagne commence par déplacer de petites pierres.", author: "Confucius" },
  { text: "Sois celui que tu avais besoin quand tu étais plus jeune.", author: "Chadwick Boseman" },
];

export const HABITS = [
  { id: 'sleep', label: 'Sommeil 8h', icon: 'Moon', color: '#7c3aed' },
  { id: 'water', label: 'Eau 3L', icon: 'Droplets', color: '#00f5ff' },
  { id: 'workout', label: 'Sport', icon: 'Dumbbell', color: '#f59e0b' },
  { id: 'nutrition', label: 'Nutrition', icon: 'Apple', color: '#00ff88' },
  { id: 'focus', label: 'Deep Work', icon: 'Target', color: '#ff6b6b' },
  { id: 'meditation', label: 'Méditation', icon: 'Brain', color: '#c084fc' },
  { id: 'reading', label: 'Lecture', icon: 'BookOpen', color: '#60a5fa' },
  { id: 'noPhone', label: 'Sans Écran', icon: 'PhoneOff', color: '#fb923c' },
];

export const ACHIEVEMENTS = [
  { id: '1', title: 'Premier Sang', description: 'Complète ta première mission', icon: '⚡', unlocked: false, xpRequired: 0 },
  { id: '2', title: 'En Feu', description: 'Streak de 3 jours', icon: '🔥', unlocked: false, xpRequired: 300 },
  { id: '3', title: 'Volonté de Fer', description: 'Complète 10 missions difficiles', icon: '💎', unlocked: false, xpRequired: 1000 },
  { id: '4', title: 'Ascendant', description: 'Atteins le niveau 5', icon: '🌟', unlocked: false, xpRequired: 2000 },
];

export function calculateLevel(xp: number): { level: number; currentXP: number; requiredXP: number; progress: number } {
  const xpPerLevel = 500;
  const level = Math.floor(xp / xpPerLevel) + 1;
  const currentXP = xp % xpPerLevel;
  const requiredXP = xpPerLevel;
  const progress = (currentXP / requiredXP) * 100;
  return { level, currentXP, requiredXP, progress };
}
