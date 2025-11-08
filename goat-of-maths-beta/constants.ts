import { Mission, ShopItem, UserData, Grade, DailyMission, DuelQuestion, Guild, GuildMission, LeaderboardEntry, FriendRequest, PrivateMessage, Achievement, Quiz, Chapter, QuizQuestion, ThemeStyle, WeeklyEvent, DuelChallenge } from './types';

export const GRADES: Grade[] = [
  { name: 'Novice', icon: '📚', levelsToComplete: 10, xpPerLevel: 100 },
  { name: 'Calculateur', icon: '✏️', levelsToComplete: 20, xpPerLevel: 150 },
  { name: 'Algébriste', icon: '📊', levelsToComplete: 35, xpPerLevel: 200 },
  { name: 'Géomètre', icon: '📐', levelsToComplete: 50, xpPerLevel: 250 },
  { name: 'Analyste', icon: '📈', levelsToComplete: 70, xpPerLevel: 300 },
  { name: 'Mathématicien', icon: '🧮', levelsToComplete: 100, xpPerLevel: 400 },
  { name: 'Professeur', icon: '🎓', levelsToComplete: 120, xpPerLevel: 500 },
  { name: 'GOAT', icon: '👑', levelsToComplete: 200, xpPerLevel: 1000 },
];

export const THEMES: ThemeStyle[] = [
    {
        id: 'theme_default',
        name: 'Défaut',
        isDark: false,
        previewBackground: 'bg-background-light',
        variables: {}
    },
    {
        id: 'theme_synthwave',
        name: 'Synthwave',
        isDark: true,
        previewBackground: 'bg-[#0d0221]',
        variables: {
            '--primary': '291 93% 62%',
            '--primary-hover': '291 90% 55%',
            '--primary-light': '300 100% 80%',
            '--background-light': '264 82% 6%',
            '--background-dark': '264 82% 6%',
            '--card-light': '261 71% 9%',
            '--card-dark': '261 71% 9%',
            '--header-light': '264 82% 4%',
            '--header-dark': '264 82% 4%',
            '--text-light': '#f0f2f5',
            '--text-dark': '#f0f2f5',
            '--text-muted-light': '#a8a2d2',
            '--text-muted-dark': '#a8a2d2',
            '--border-light': '#2a1a63',
            '--border-dark': '#2a1a63',
            '--badge-light': '#2a1a63',
            '--badge-dark': '#2a1a63',
        }
    },
    {
        id: 'theme_jungle',
        name: 'Jungle',
        isDark: false,
        previewBackground: 'bg-[#f0fff4]',
        variables: {
            '--primary': '141 73% 31%',
            '--primary-hover': '141 70% 25%',
            '--primary-light': '140 50% 55%',
            '--background-light': '144 100% 98%',
            '--background-dark': '144 20% 10%',
            '--card-light': '0 0% 100%',
            '--card-dark': '120 18% 21%',
            '--header-light': '0 0% 100%',
            '--header-dark': '141 33% 18%',
            '--text-light': '#042f1c',
            '--text-dark': '#e8f5e9',
            '--text-muted-light': '80 39% 34%',
            '--text-muted-dark': '124 28% 78%',
            '--border-light': '122 39% 88%',
            '--border-dark': '80 38% 28%',
            '--pattern': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cg fill='%23a5d6a7' fill-opacity='0.2'%3E%3Cpath d='M0 0h20L0 20z'/%3E%3C/g%3E%3C/svg%3E")`,
        }
    },
    {
        id: 'theme_shinobi',
        name: 'Shinobi',
        isDark: true,
        previewBackground: 'bg-[#1a202c]',
        variables: {
            '--primary': '30 96% 59%',
            '--primary-hover': '30 90% 50%',
            '--primary-light': '30 100% 70%',
            '--background-light': '220 20% 10%',
            '--background-dark': '220 20% 10%',
            '--card-light': '220 20% 15%',
            '--card-dark': '220 20% 15%',
            '--header-light': '220 20% 8%',
            '--header-dark': '220 20% 8%',
            '--text-light': '#e2e8f0',
            '--text-dark': '#e2e8f0',
            '--text-muted-light': '#94a3b8',
            '--text-muted-dark': '#94a3b8',
            '--border-light': '220 20% 25%',
            '--border-dark': '220 20% 25%',
            '--badge-light': '220 20% 25%',
            '--badge-dark': '220 20% 25%',
            '--pattern': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cg fill='%23FFA726' fill-opacity='0.1'%3E%3Cpath d='M10 0 L12.5 7.5 L20 10 L12.5 12.5 L10 20 L7.5 12.5 L0 10 L7.5 7.5 Z'/%3E%3C/g%3E%3C/svg%3E")`
        }
    },
    {
        id: 'theme_rainbow',
        name: 'Arc-en-ciel',
        isDark: false,
        previewBackground: 'bg-background-light',
        variables: {
            '--primary': '340 82% 52%',
            '--primary-hover': '340 80% 45%',
            '--primary-light': '340 90% 70%',
        }
    }
];

export const ACHIEVEMENTS: Achievement[] = [
    { id: 'ach_level_5', icon: '🎉', title: 'Bien parti', description: 'Atteindre le niveau 5', isSecret: false, condition: (u) => u.level >= 5 },
    { id: 'ach_level_10', icon: '🚀', title: 'Apprenti', description: 'Atteindre le niveau 10', isSecret: false, condition: (u) => u.level >= 10 },
    { id: 'ach_level_25', icon: '🌟', title: 'Expérimenté', description: 'Atteindre le niveau 25', isSecret: false, condition: (u) => u.level >= 25 },
    { id: 'ach_first_perfect', icon: '⭐', title: 'Perfectionniste', description: 'Obtenir un score parfait (100%) à un quiz', isSecret: false, condition: (u, {quizzes}) => u.completedQuizzes.some(cq => { const q = quizzes.find(qz => qz.id === cq.quizId); return q && cq.bestScore === q.questions.length; }) },
    { id: 'ach_5_perfect', icon: '🏆', title: 'Maître des Quiz', description: 'Obtenir 5 scores parfaits', isSecret: false, condition: (u, {quizzes}) => u.completedQuizzes.filter(cq => { const q = quizzes.find(qz => qz.id === cq.quizId); return q && cq.bestScore === q.questions.length; }).length >= 5 },
    { id: 'ach_first_duel_win', icon: '⚔️', title: 'Duelliste', description: 'Gagner son premier duel', isSecret: false, condition: (u) => u.duelWins >= 1 },
    { id: 'ach_10_duel_wins', icon: '👑', title: 'Roi du Duel', description: 'Gagner 10 duels', isSecret: false, condition: (u) => u.duelWins >= 10 },
    { id: 'ach_first_purchase', icon: '🛍️', title: 'Shopping', description: 'Acheter son premier article', isSecret: false, condition: (u) => u.ownedItems.length > 0 },
    { id: 'ach_5_avatars', icon: '🎭', title: 'Collectionneur', description: 'Posséder 5 avatars', isSecret: false, condition: (u) => u.ownedItems.filter(id => SHOP_ITEMS.find(i => i.id === id && i.type === 'Avatar')).length >= 5 },
    { id: 'ach_all_chapters', icon: '🎓', title: 'Savant', description: 'Consulter tous les chapitres disponibles', isSecret: false, condition: (u, {chapters}) => chapters.every(c => u.consultedChapters.includes(c.id)) },
    { id: 'ach_join_guild', icon: '🏰', title: 'Fraternité', description: 'Rejoindre ou créer une guilde', isSecret: false, condition: (u) => u.guildId !== null },
    { id: 'ach_secret_goat', icon: '👑', title: 'Le GOAT ?', description: '???', isSecret: true, condition: (u) => u.level >= 50 },
];


export const MISSIONS: Mission[] = [
  {
    id: 'mission1',
    title: 'Reach Level 2',
    description: 'Advance to the next level.',
    xp: 50,
    coins: 10,
    condition: (userData: UserData) => userData.gradeIndex >= 0 && userData.level >= 2,
  },
  {
    id: 'mission2',
    title: 'Complete 3 Chapters',
    description: 'Finish three learning chapters.',
    xp: 100,
    coins: 25,
    condition: (userData: UserData) => userData.consultedChapters.length >= 3,
  },
  {
    id: 'mission3',
    title: 'First Purchase',
    description: 'Buy your first item from the shop.',
    xp: 20,
    coins: 5,
    condition: (userData: UserData) => userData.ownedItems.length >= 1,
  },
   {
    id: 'mission4',
    title: 'Reach Level 5',
    description: 'Become a true math apprentice.',
    xp: 200,
    coins: 50,
    condition: (userData: UserData) => userData.gradeIndex >= 0 && userData.level >= 5,
  },
];

export const DAILY_MISSIONS: DailyMission[] = [
    { id: 'daily1', icon: '🎮', title: 'Première connexion', description: "Se connecter aujourd'hui", rewardXp: 10, rewardCoins: 10 },
    { id: 'daily2', icon: '📚', title: 'Étudiant assidu', description: 'Consulter un chapitre de cours', rewardXp: 20, rewardCoins: 10 },
    { id: 'daily3', icon: '📝', title: 'Quiz master', description: 'Terminer un quiz (peu importe le score)', rewardXp: 50, rewardCoins: 20 },
    { id: 'daily4', icon: '⭐', title: 'Perfectionniste', description: 'Obtenir 100% à un quiz', rewardXp: 100, rewardCoins: 50 },
    { id: 'daily5', icon: '🔥', title: 'Régularité', description: 'Maintenir sa série de connexion', rewardXp: 30, rewardCoins: 15 },
];


export const SHOP_ITEMS: ShopItem[] = [
  // Avatars
  { id: 'item1', name: 'Avatar Einstein', type: 'Avatar', description: 'Le génie de la physique', price: 100, icon: '👴' },
  { id: 'item2', name: 'Avatar Newton', type: 'Avatar', description: 'Le maître de la gravité', price: 100, icon: '🍎' },
  { id: 'item3', name: 'Avatar Pythagore', type: 'Avatar', description: 'Le roi de la géométrie', price: 150, icon: '📐' },
  // Boosts
  { id: 'item4', name: 'Double XP 24h', type: 'Boost', description: "Double tous tes gains d'XP pendant 24h", price: 200, icon: '⚡' },
  { id: 'item5', name: 'Bouclier 3 jours', type: 'Boost', description: 'Protège ta série de connexion pendant 3 jours', price: 150, icon: '🛡️' },
  // Thèmes
  { id: 'item12', name: 'Thème Arc-en-ciel', type: 'Theme', description: 'Thème coloré pour ton interface', price: 350, icon: '🌈', themeId: 'theme_rainbow' },
  { id: 'item13', name: 'Thème Synthwave', type: 'Theme', description: 'Ambiance rétro-futuriste pour tes sessions de maths.', price: 400, icon: '🌃', themeId: 'theme_synthwave' },
  { id: 'item14', name: 'Thème Jungle', type: 'Theme', description: 'Plonge dans une atmosphère naturelle et apaisante.', price: 300, icon: '🌿', themeId: 'theme_jungle' },
  { id: 'item15', name: 'Thème Shinobi', type: 'Theme', description: 'Déchaîne le ninja qui est en toi avec ce thème inspiré de Naruto.', price: 450, icon: '🥷', themeId: 'theme_shinobi' },
  // Bannières
  { id: 'banner1', name: 'Bannière Galaxie', type: 'ProfileBanner', description: 'Une bannière étoilée pour ton profil.', price: 500, icon: '🌌', value: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80' },
  { id: 'banner2', name: 'Bannière Forêt', type: 'ProfileBanner', description: 'Une touche de nature sur votre profil.', price: 400, icon: '🌲', value: 'https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
  // Cadres d'avatar
  { id: 'frame1', name: 'Cadre Doré', type: 'AvatarFrame', description: 'Un cadre en or pour montrer ton prestige.', price: 750, icon: '🌟', value: 'border-amber-400' },
  { id: 'frame2', name: 'Cadre Flamboyant', type: 'AvatarFrame', description: 'Mets le feu à ton profil !', price: 600, icon: '🔥', value: 'border-red-500' },
  // Event Reward
  { id: 'reward_algebra_king', name: 'Couronne Algébrique', type: 'Avatar', description: 'Récompense exclusive de la Semaine de l\'Algèbre.', price: 0, icon: '👑' },
];

export const DUEL_CONSTANTS = {
    MAX_DAILY_DUELS: 5,
    WIN_COINS: 50,
    LOSS_COINS: -20,
    TIE_COINS: 0,
};

export const BATTLE_ROYALE_SETTINGS = {
    INITIAL_HP: 100,
    QUICK_ATTACK_DAMAGE: 15,
    SPECIAL_ATTACK_DAMAGE: 30,
    HEAL_AMOUNT: 25,
    WRONG_ANSWER_DAMAGE: 10,
    QUESTION_TIME: 15, // seconds
};

export const DUEL_QUESTIONS: DuelQuestion[] = [
    { question: '5 + 7 = ?', options: ['11', '12', '13', '10'], correctAnswer: '12' },
    { question: '15 - 8 = ?', options: ['6', '7', '8', '5'], correctAnswer: '7' },
    { question: '6 × 4 = ?', options: ['20', '22', '24', '26'], correctAnswer: '24' },
    { question: '18 ÷ 3 = ?', options: ['5', '6', '7', '4'], correctAnswer: '6' },
    { question: 'Résous : x + 3 = 10', options: ['x = 6', 'x = 7', 'x = 13', 'x = 30'], correctAnswer: 'x = 7' },
    { question: '2x = 14, x = ?', options: ['6', '7', '12', '28'], correctAnswer: '7' },
    { question: '10% de 50 = ?', options: ['5', '10', '15', '50'], correctAnswer: '5' },
    { question: '√16 = ?', options: ['2', '3', '4', '8'], correctAnswer: '4' },
    { question: '3² = ?', options: ['6', '9', '12', '3'], correctAnswer: '9' },
    { question: 'Aire d\'un carré de côté 5 ?', options: ['10', '20', '25', '30'], correctAnswer: '25' },
];

export const GOAT_CHALLENGE_SETTINGS = {
    ENTRY_FEE: 100,
    DURATION_SECONDS: 300, // 5 minutes
    QUESTIONS_COUNT: 10,
    REWARDS: {
        PERFECT: { xp: 1000, coins: 500 },
        EXCELLENT: { xp: 500, coins: 250 }, // 8-9
        GOOD: { xp: 200, coins: 100 },      // 5-7
    }
};

export const GOAT_CHALLENGE_QUESTIONS: QuizQuestion[] = [
    { id: 'gc_q1', type: 'mcq', questionText: "Si f(x) = 3x² - 2x + 5, quelle est la valeur de f'(2) ?", options: ['8', '10', '12', '13'], correctOptionIndex: 1 },
    { id: 'gc_q2', type: 'mcq', questionText: 'Un triangle rectangle a des côtés de longueurs 6 et 8. Quelle est la longueur de l\'hypoténuse ?', options: ['9', '10', '12', '14'], correctOptionIndex: 1 },
    { id: 'gc_q3', type: 'mcq', questionText: 'Quelle est la solution de l\'équation 2(x + 3) = 4(x - 1) ?', options: ['x = 3', 'x = 4', 'x = 5', 'x = -5'], correctOptionIndex: 2 },
    { id: 'gc_q4', type: 'mcq', questionText: 'Un sac contient 5 billes rouges et 3 billes bleues. Quelle est la probabilité de tirer 2 billes rouges sans remise ?', options: ['5/14', '25/64', '5/28', '1/4'], correctOptionIndex: 0 },
    { id: 'gc_q5', type: 'mcq', questionText: "Quelle est l'aire d'un cercle avec un rayon de 5 cm ?", options: ['10π cm²', '20π cm²', '25π cm²', '50π cm²'], correctOptionIndex: 2 },
    { id: 'gc_q6', type: 'mcq', questionText: 'Résous : x² - 5x + 6 = 0', options: ['x=2, x=3', 'x=-2, x=-3', 'x=1, x=6', 'x=-1, x=-6'], correctOptionIndex: 0 },
    { id: 'gc_q7', type: 'mcq', questionText: 'Si log₂(x) = 4, que vaut x ?', options: ['8', '16', '32', '64'], correctOptionIndex: 1 },
    { id: 'gc_q8', type: 'mcq', questionText: 'Quel est le volume d\'une sphère de rayon 3 ?', options: ['9π', '12π', '27π', '36π'], correctOptionIndex: 3 },
    { id: 'gc_q9', type: 'mcq', questionText: "La somme des 10 premiers entiers positifs (1+2+...+10) est :", options: ['45', '50', '55', '60'], correctOptionIndex: 2 },
    { id: 'gc_q10', type: 'mcq', questionText: 'Quel est le prochain nombre dans la suite de Fibonacci : 1, 1, 2, 3, 5, 8, ... ?', options: ['11', '12', '13', '21'], correctOptionIndex: 2 },
    { id: 'gc_q11', type: 'mcq', questionText: 'Un train parcourt 150 km en 2 heures. Quelle est sa vitesse moyenne ?', options: ['60 km/h', '75 km/h', '80 km/h', '300 km/h'], correctOptionIndex: 1 },
    { id: 'gc_q12', type: 'mcq', questionText: "Si un article coûtant 80€ est soldé à 25%, quel est son nouveau prix ?", options: ['55€', '60€', '65€', '20€'], correctOptionIndex: 1 },
];


export const GUILD_CREATION_COST = 750;

export const MOCK_GUILDS: Omit<Guild, 'members'>[] = [
    { id: 'g1', name: 'Les Matheux', emoji: '🧮', chef: 'Sophie Laurent', memberCount: 8, maxMembers: 10, level: 5, description: "On s'entraide pour progresser ensemble." },
    { id: 'g2', name: 'Équipe Pythagore', emoji: '📐', chef: 'Antoine Moreau', memberCount: 6, maxMembers: 10, level: 3, description: 'La géométrie est notre passion.' },
    { id: 'g3', name: 'Génies des Maths', emoji: '🧠', chef: 'Emma Martin', memberCount: 10, maxMembers: 10, level: 7, description: 'Le top du top.' },
    { id: 'g4', name: 'Calculateurs Fous', emoji: '🤪', chef: 'Thomas Bernard', memberCount: 5, maxMembers: 10, level: 2, description: 'Rapides comme l\'éclair.' },
    { id: 'g5', name: 'Les Équations', emoji: '🔢', chef: 'Léa Dubois', memberCount: 9, maxMembers: 10, level: 4, description: 'Nous résolvons tous les problèmes.' },
    { id: 'g6', name: 'Algèbre Academy', emoji: '📊', chef: 'Hugo Petit', memberCount: 7, maxMembers: 10, level: 6, description: 'Pour les fans d\'algèbre.' },
];

export const MOCK_GUILD_MISSIONS: GuildMission[] = [
    { id: 'gm1', title: '100 chapitres consultés', description: 'Tous les membres doivent consulter des chapitres.', reward: '+200 XP pour chaque membre', currentProgress: 73, goal: 100, status: 'En cours' },
    { id: 'gm2', title: '50 quiz réussis', description: 'Le score doit être supérieur à 80%.', reward: '+100 MathCoins chacun', currentProgress: 38, goal: 50, status: 'En cours' },
    { id: 'gm3', title: '10 scores parfaits (100%)', description: 'Obtenez 100% dans n\'importe quel quiz.', reward: '+500 XP + Badge spécial', currentProgress: 6, goal: 10, status: 'En cours' },
    { id: 'gm4', title: '30 duels gagnés', description: 'Gagnez des duels classés.', reward: '+50 MathCoins chacun', currentProgress: 30, goal: 30, status: 'Terminée' },
];

export const MY_GUILD: Guild = {
    id: 'my-guild',
    name: "Les Matheux Fous",
    emoji: '🧮',
    chef: 'Vous',
    memberCount: 8,
    maxMembers: 10,
    level: 5,
    description: "La meilleure guilde de maths !",
    members: [
        { userId: 'student_001', name: 'Lucas Dubois', gradeName: 'Calculateur', gradeIcon: '✏️', level: 15, weeklyContribution: 350, role: 'Chef', isOnline: true, avatarId: null },
        { userId: 'student_002', name: 'Emma Martin', gradeName: 'Algébriste', gradeIcon: '📊', level: 22, weeklyContribution: 520, role: 'Membre', isOnline: true, avatarId: 'item1' },
        { userId: 'student_003', name: 'Thomas Bernard', gradeName: 'Novice', gradeIcon: '📚', level: 8, weeklyContribution: 150, role: 'Membre', isOnline: false, avatarId: null },
        { userId: 'student_004', name: 'Léa Dubois', gradeName: 'Géomètre', gradeIcon: '📐', level: 18, weeklyContribution: 310, role: 'Membre', isOnline: true, avatarId: 'item3' },
        { userId: 'student_005', name: 'Hugo Petit', gradeName: 'Calculateur', gradeIcon: '✏️', level: 12, weeklyContribution: 220, role: 'Membre', isOnline: false, avatarId: null },
        { userId: 'student_006', name: 'Chloé Rousseau', gradeName: 'Analyste', gradeIcon: '📈', level: 30, weeklyContribution: 680, role: 'Membre', isOnline: true, avatarId: null },
        { userId: 'student_007', name: 'Antoine Moreau', gradeName: 'Géomètre', gradeIcon: '📐', level: 25, weeklyContribution: 450, role: 'Membre', isOnline: false, avatarId: null },
        { userId: 'student_008', name: 'Sophie Laurent', gradeName: 'Mathématicien', gradeIcon: '🧮', level: 40, weeklyContribution: 800, role: 'Membre', isOnline: false, avatarId: 'item2' },
    ]
};

export const LEADERBOARD_DATA: LeaderboardEntry[] = [
    { userId: 'student_008', rank: 1, name: 'Sophie Laurent', gradeName: 'Analyste', gradeIcon: '📈', level: 45, xp: 18500, chapters: 6, quizzes: 5, duels: 25, trend: 'up', lastSeen: "Aujourd'hui", status: 'actif', avatarId: 'item2' },
    { userId: 'student_007', rank: 2, name: 'Antoine Moreau', gradeName: 'Analyste', gradeIcon: '📈', level: 42, xp: 17200, chapters: 6, quizzes: 4, duels: 22, trend: 'stable', lastSeen: "Aujourd'hui", status: 'actif', avatarId: null },
    { userId: 'student_020', rank: 3, name: 'Marie Fontaine', gradeName: 'Analyste', gradeIcon: '📈', level: 38, xp: 15800, chapters: 5, quizzes: 5, duels: 18, trend: 'down', lastSeen: "Hier", status: 'actif', avatarId: null },
    { userId: 'student_001', rank: 4, name: 'Lucas Dubois', gradeName: 'Calculateur', gradeIcon: '✏️', level: 15, xp: 8500, chapters: 4, quizzes: 3, duels: 12, trend: 'up', lastSeen: "Aujourd'hui", status: 'actif', avatarId: null }, // YOU
    { userId: 'student_009', rank: 5, name: 'Jules Girard', gradeName: 'Géomètre', gradeIcon: '📐', level: 30, xp: 12500, chapters: 5, quizzes: 3, duels: 15, trend: 'stable', lastSeen: "Aujourd'hui", status: 'actif', avatarId: null },
    { userId: 'student_006', rank: 6, name: 'Chloé Rousseau', gradeName: 'Géomètre', gradeIcon: '📐', level: 28, xp: 11800, chapters: 4, quizzes: 4, duels: 14, trend: 'up', lastSeen: "Hier", status: 'actif', avatarId: null },
    { userId: 'student_002', rank: 7, name: 'Emma Martin', gradeName: 'Algébriste', gradeIcon: '📊', level: 25, xp: 10200, chapters: 4, quizzes: 3, duels: 10, trend: 'stable', lastSeen: "Aujourd'hui", status: 'actif', avatarId: 'item1' },
    { userId: 'student_005', rank: 8, name: 'Hugo Petit', gradeName: 'Calculateur', gradeIcon: '✏️', level: 22, xp: 9100, chapters: 3, quizzes: 2, duels: 9, trend: 'stable', lastSeen: "Il y a 3 jours", status: 'actif', avatarId: null },
    { userId: 'student_004', rank: 9, name: 'Léa Dubois', gradeName: 'Calculateur', gradeIcon: '✏️', level: 20, xp: 8400, chapters: 3, quizzes: 2, duels: 8, trend: 'down', lastSeen: "Aujourd'hui", status: 'actif', avatarId: 'item3' },
    { userId: 'student_003', rank: 10, name: 'Thomas Bernard', gradeName: 'Calculateur', gradeIcon: '✏️', level: 18, xp: 7600, chapters: 3, quizzes: 1, duels: 7, trend: 'stable', lastSeen: "Il y a 2 jours", status: 'actif', avatarId: null },
    { userId: 'student_010', rank: 11, name: 'Camille Durand', gradeName: 'Novice', gradeIcon: '📚', level: 15, xp: 6900, chapters: 2, quizzes: 1, duels: 6, trend: 'up', lastSeen: "Hier", status: 'actif', avatarId: null },
    { userId: 'student_011', rank: 12, name: 'Noah Martin', gradeName: 'Novice', gradeIcon: '📚', level: 14, xp: 6200, chapters: 2, quizzes: 1, duels: 5, trend: 'stable', lastSeen: "Il y a 4 jours", status: 'actif', avatarId: null },
    { userId: 'student_012', rank: 13, name: 'Lina Rousseau', gradeName: 'Novice', gradeIcon: '📚', level: 12, xp: 5500, chapters: 2, quizzes: 1, duels: 4, trend: 'new', lastSeen: "Aujourd'hui", status: 'actif', avatarId: null },
    { userId: 'student_013', rank: 14, name: 'Gabriel Petit', gradeName: 'Novice', gradeIcon: '📚', level: 10, xp: 4800, chapters: 1, quizzes: 0, duels: 3, trend: 'stable', lastSeen: "Il y a 5 jours", status: 'actif', avatarId: null },
    { userId: 'student_014', rank: 15, name: 'Sarah Laurent', gradeName: 'Novice', gradeIcon: '📚', level: 9, xp: 4200, chapters: 1, quizzes: 0, duels: 2, trend: 'down', lastSeen: "Il y a 6 jours", status: 'actif', avatarId: null },
    { userId: 'student_015', rank: 16, name: 'Louis Bernard', gradeName: 'Novice', gradeIcon: '📚', level: 8, xp: 3600, chapters: 1, quizzes: 0, duels: 1, trend: 'stable', lastSeen: "Il y a 8 jours", status: 'inactif', avatarId: null },
    { userId: 'student_016', rank: 17, name: 'Manon Girard', gradeName: 'Novice', gradeIcon: '📚', level: 7, xp: 3000, chapters: 1, quizzes: 0, duels: 1, trend: 'stable', lastSeen: "Aujourd'hui", status: 'actif', avatarId: null },
    { userId: 'student_017', rank: 18, name: 'Tom Moreau', gradeName: 'Novice', gradeIcon: '📚', level: 6, xp: 2500, chapters: 0, quizzes: 0, duels: 0, trend: 'down', lastSeen: "Il y a 10 jours", status: 'inactif', avatarId: null },
    { userId: 'student_018', rank: 19, name: 'Zoé Fontaine', gradeName: 'Novice', gradeIcon: '📚', level: 5, xp: 2000, chapters: 0, quizzes: 0, duels: 0, trend: 'stable', lastSeen: "Il y a 12 jours", status: 'inactif', avatarId: null },
    { userId: 'student_019', rank: 20, name: 'Adam Durand', gradeName: 'Novice', gradeIcon: '📚', level: 4, xp: 1500, chapters: 0, quizzes: 0, duels: 0, trend: 'stable', lastSeen: "Aujourd'hui", status: 'actif', avatarId: null },
];

export const MOCK_TEACHER: UserData = {
    id: 'teacher_001',
    username: 'm.dupont',
    passwordHash: 'prof123',
    name: 'M. Dupont',
    classe: 'N/A',
    role: 'teacher',
    level: 1, xp: 0, coins: 0, hp: 100, streak: 0, gradeIndex: 0,
    consultedChapters: [], completedMissions: [], completedDailyMissionIds: [], ownedItems: [],
    avatarId: null, friendIds: [], duelWins: 0, duelLosses: 0, dailyDuelsPlayed: 0, duelHistory: [], guildId: null,
    completedQuizzes: [],
    quizPerformance: {},
    unlockedAchievements: [],
    activityHistory: [],
    goatChallengeAttempts: {},
    mindMaps: [],
    mustChangePassword: false, createdAt: new Date(),
};


const createStudent = (id: number, name: string, username: string, pass: string, classe: string, level: number, xp: number, coins: number, gradeIndex: number, lastLoginDaysAgo: number | null, mustChangePass: boolean, friendIds: string[] = [], avatarId: string | null = null, extraData: Partial<UserData> = {}): UserData => ({
    id: `student_${String(id).padStart(3, '0')}`,
    username, passwordHash: pass, name, classe, level, xp, coins, gradeIndex,
    role: 'student',
    teacherId: MOCK_TEACHER.id,
    lastLogin: lastLoginDaysAgo === null ? undefined : new Date(Date.now() - lastLoginDaysAgo * 24 * 60 * 60 * 1000),
    mustChangePassword: mustChangePass,
    hp: 100, streak: Math.floor(Math.random() * 10), consultedChapters: [], completedMissions: [],
    completedDailyMissionIds: [], ownedItems: [], friendIds, duelWins: 0, duelLosses: 0, dailyDuelsPlayed: 0, duelHistory: [],
    guildId: null, createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    completedQuizzes: [],
    quizPerformance: {},
    unlockedAchievements: [],
    activityHistory: [
        { id: 'act1', type: 'level_up', text: '🎉 A atteint le niveau 15.', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()},
        { id: 'act2', type: 'duel_win', text: '🏆 A gagné un duel contre Hugo Petit.', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()},
        { id: 'act3', type: 'quiz_perfect', text: '⭐ A obtenu un score parfait au quiz d\'algèbre.', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()}
    ],
    goatChallengeAttempts: {},
    mindMaps: [],
    avatarId,
    equippedThemeId: undefined,
    ...extraData,
});

export const MOCK_STUDENTS: UserData[] = [
    createStudent(1, 'Lucas Dubois', 'lucas.dubois', 'mdp123', '4ème A', 15, 120, 850, 1, 0.1, false, ['student_002', 'student_004'], null, {
        completedQuizzes: [
            { quizId: 'quiz1', bestScore: 2 },
            { quizId: 'quiz2', bestScore: 2 }
        ],
        quizPerformance: {
          "q1_1": { "correct": 1, "incorrect": 2 },
          "q1_2": { "correct": 0, "incorrect": 1 },
          "q1_3": { "correct": 2, "incorrect": 0 },
          "q2_1": { "correct": 3, "incorrect": 0 },
          "q2_2": { "correct": 2, "incorrect": 1 }
        }
    }),
    createStudent(2, 'Emma Martin', 'emma.martin', 'temp456', '4ème A', 25, 50, 1200, 2, 0.2, true, ['student_001'], 'item1'),
    createStudent(3, 'Thomas Bernard', 'thomas.bernard', 'pass789', '4ème B', 8, 80, 300, 0, 10, false, [], null),
    createStudent(4, 'Léa Dubois', 'lea.dubois', 'goatofmaths', '4ème A', 20, 100, 950, 1, 1, false, ['student_001'], 'item3'),
    createStudent(5, 'Hugo Petit', 'hugo.petit', 'azerty123', '4ème B', 22, 10, 400, 1, 2, false, [], null),
    createStudent(6, 'Chloé Rousseau', 'chloe.rousseau', 'chloe123', '3ème A', 18, 5, 1500, 2, 0.01, false, [], null),
    createStudent(7, 'Antoine Moreau', 'antoine.moreau', 'antoine456', '3ème A', 28, 140, 250, 2, 8, false, [], null),
    createStudent(8, 'Sophie Laurent', 'sophie.laurent', 'sophie789', '3ème B', 35, 200, 3000, 3, 0.5, false, [], 'item2'),
    createStudent(9, 'Jules Girard', 'jules.girard', 'jules123', '4ème B', 10, 0, 50, 0, 15, false, [], null),
    createStudent(10, 'Camille Durand', 'camille.durand', 'camille456', '4ème A', 12, 60, 200, 1, 3, false, [], null),
    createStudent(11, 'Noah Martin', 'noah.martin', 'noah789', '3ème A', 5, 20, 100, 0, 4, false, [], null),
    createStudent(12, 'Lina Rousseau', 'lina.rousseau', 'lina123', '3ème B', 7, 30, 150, 0, 20, false, [], null),
    createStudent(13, 'Gabriel Petit', 'gabriel.petit', 'gabriel456', '4ème A', 1, 0, 50, 0, null, true, [], null), // Jamais connecté
    createStudent(14, 'Sarah Laurent', 'sarah.laurent', 'sarah789', '4ème B', 9, 90, 450, 0, 6, false, [], null),
    createStudent(15, 'Louis Bernard', 'louis.bernard', 'louis123', '3ème A', 11, 10, 320, 1, 9, false, [], null),
    createStudent(16, 'Manon Girard', 'manon.girard', 'manon456', '3ème B', 14, 40, 600, 1, 1, false, [], null),
    createStudent(17, 'Tom Moreau', 'tom.moreau', 'tom789', '4ème A', 6, 70, 180, 0, 11, false, [], null),
    createStudent(18, 'Zoé Fontaine', 'zoe.fontaine', 'zoe123', '4ème B', 2, 10, 80, 0, 30, false, [], null),
    createStudent(19, 'Adam Durand', 'adam.durand', 'adam456', '3ème A', 19, 130, 1100, 1, 0.05, false, [], null), // 1h ago
    createStudent(20, 'Marie Fontaine', 'marie.fontaine', 'marie789', '3ème B', 30, 0, 2200, 3, 5, false, [], null),
];


export const MOCK_FRIEND_REQUESTS: FriendRequest[] = [
    { 
        id: 'fr1', 
        fromUserId: 'student_006', 
        fromUserName: 'Chloé Rousseau', 
        fromUserAvatarId: null,
        fromUserLevel: 18,
        toUserId: 'student_001', 
        timestamp: new Date().toISOString() 
    },
];

export const MOCK_CONVERSATIONS: { [key: string]: PrivateMessage[] } = {
    'student_002': [ // Conversation between student_001 (Lucas) and student_002 (Emma)
        { id: 'pm1', fromUserId: 'student_002', toUserId: 'student_001', text: 'Salut Lucas, bien joué pour le dernier quiz !', timestamp: new Date(Date.now() - 5 * 60000).toISOString(), isRead: true },
        { id: 'pm2', fromUserId: 'student_001', toUserId: 'student_002', text: 'Merci Emma ! Toi aussi :)', timestamp: new Date(Date.now() - 4 * 60000).toISOString(), isRead: true },
        { id: 'pm3', fromUserId: 'student_002', toUserId: 'student_001', text: 'Tu as commencé le chapitre sur la trigonométrie ?', timestamp: new Date(Date.now() - 2 * 60000).toISOString(), isRead: false },
    ]
};

const nextWeek = new Date();
nextWeek.setDate(nextWeek.getDate() + 7);

export const MOCK_WEEKLY_EVENT: WeeklyEvent = {
    id: 'event_algebra_1',
    title: "La Semaine de l'Algèbre",
    description: "Montrez votre maîtrise des équations et gagnez des récompenses exclusives !",
    icon: '📊',
    relatedChapterIds: ['chap1', 'chap6'],
    endDate: nextWeek.toISOString(),
    rewardItemId: 'reward_algebra_king',
};

export const MOCK_DUEL_CHALLENGES: DuelChallenge[] = [
    {
        id: 'dc1',
        fromUserId: 'student_005',
        fromUserName: 'Hugo Petit',
        toUserId: 'student_001',
        toUserName: 'Lucas Dubois',
        wager: 50,
        timestamp: new Date().toISOString(),
    }
];
