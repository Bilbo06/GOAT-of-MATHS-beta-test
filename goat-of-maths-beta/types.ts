export enum Tab {
  Accueil = 'ACCUEIL',
  Academie = 'ACADEMIE',
  Missions = 'MISSIONS',
  Shop = 'SHOP',
  Community = 'COMMUNAUTE',

  // These are for sub-navigation or modals, accessible from other screens
  Top = 'TOP',
  Courses = 'COURS',
  Quiz = 'QUIZ',
  Friends = 'AMIS',
  Duels = 'DUELS',
  Guilds = 'GUILDES',
  GoatChallenge = 'DEFI',
  Revisions = 'REVISIONS',
  MindMaps = 'CARTES',
}

export enum AdminTab {
    Dashboard = 'DASHBOARD',
    Students = 'STUDENTS',
    Teachers = 'TEACHERS',
    Content = 'CONTENT',
    Quizzes = 'QUIZZES',
    Stats = 'STATS',
    Moderation = 'MODERATION',
    Guilds = 'GUILDS',
    Settings = 'SETTINGS',
}


export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

export interface MindMapNode {
  id: string;
  x: number;
  y: number;
  text: string;
  color?: string;
}

export interface MindMapConnection {
  from: string; // Node ID
  to: string;   // Node ID
}

export interface MindMap {
  id: string;
  title: string;
  nodes: MindMapNode[];
  connections: MindMapConnection[];
  background?: string;
}


export interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatarId: string | null;
  fromUserLevel: number;
  toUserId: string;
  timestamp: string; // ISO string
}

export interface PrivateMessage {
  id: string;
  fromUserId: string;
  toUserId: string;
  text: string;
  timestamp: string; // ISO string
  isRead: boolean;
}

export type ActivityType = 'level_up' | 'quiz_perfect' | 'quiz_completed' | 'duel_win' | 'item_bought' | 'chapter_consulted' | 'goat_challenge';

export interface Activity {
    id: string;
    type: ActivityType;
    text: string;
    timestamp: string; // ISO string
}

export interface UserData {
  id: string;
  username: string;
  passwordHash: string;
  name: string;
  classe: string;
  role: 'student' | 'teacher' | 'super_admin';
  teacherId?: string;
  
  level: number;
  xp: number;
  coins: number;
  hp: number;
  streak: number;
  gradeIndex: number;
  consultedChapters: string[];
  completedMissions: string[];
  completedDailyMissionIds: string[];
  ownedItems: string[];
  avatarId: string | null;
  // Friend List
  friendIds: string[];
  // Duel Stats
  duelWins: number;
  duelLosses: number;
  dailyDuelsPlayed: number;
  duelHistory: DuelHistoryItem[];
  // Guild
  guildId: string | null;
  completedQuizzes: Array<{
    quizId: string;
    bestScore: number; // Storing the score, not percentage. e.g. 2 out of 3.
  }>;
  // Revision System
  quizPerformance: {
      [questionId: string]: {
          correct: number;
          incorrect: number;
      }
  };
  // Achievements
  unlockedAchievements: string[]; // list of achievement IDs
  // Activity Feed
  activityHistory: Activity[];
  // GOAT Challenge
  goatChallengeAttempts: { [weekId: string]: { score: number; time: number } };
  // Mind Maps
  mindMaps: MindMap[];

  hasSeenWelcomeModal?: boolean;
  mustChangePassword: boolean;
  lastPasswordChange?: Date;
  createdAt: Date;
  lastLogin?: Date;
  
  // Moderation
  isMuted?: boolean;
  muteEndDate?: Date;

  // Customization
  equippedThemeId?: string;
  equippedAvatarFrameId?: string;
  equippedProfileBannerId?: string;
}

export type Difficulty = 'Facile' | 'Moyen' | 'Difficile';

export interface Chapter {
  id: string;
  title: string;
  icon: string;
  difficulty: Difficulty;
  rewardXp: number;
  rewardCoins: number;
  description: string;
  teacherId: string;
  teacherName: string;
  pdfUrl?: string;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  type: 'mcq' | 'fill-in-the-blank';
  // For MCQ
  options?: string[];
  correctOptionIndex?: number;
  // For Fill-in-the-blank
  correctAnswer?: string;
}


export interface Quiz {
  id: string;
  chapterId: string;
  title: string;
  questions: QuizQuestion[];
}


export interface Mission {
  id: string;
  title: string;
  description: string;
  xp: number;
  coins: number;
  condition: (userData: UserData, event?: { type: string; data?: any }) => boolean;
}

export type DailyMission = {
    id: string;
    icon: string;
    title: string;
    description: string;
    rewardXp: number;
    rewardCoins: number;
};


export type ShopItemType = 'Avatar' | 'Boost' | 'Décoration' | 'Theme' | 'AvatarFrame' | 'ProfileBanner';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string; // Emoji or URL
  type: ShopItemType;
  themeId?: string; // For themes
  value?: string; // For banners (URL) or frames (CSS class/color)
}


export interface Message {
  id: number;
  author: string;
  authorId: string;
  text: string;
  timestamp: Date;
  authorRole?: 'Chef' | 'Membre';
}

export interface ReportedMessage {
    id: string;
    message: Message;
    reporterId: string;
    reporterName: string;
    reason: string;
    timestamp: Date;
}

export interface ToastMessage {
  id: number;
  message: string;
}

export interface Grade {
  name: string;
  icon: string;
  levelsToComplete: number;
  xpPerLevel: number;
}

export interface Friend {
  id: number;
  name: string;
  level: number;
  gradeName: string;
  gradeIcon: string;
  xp: number;
  isOnline: boolean;
  lastSeen: string;
  gradeProgress: number; // Percentage 0-100
  avatarId: string | null;
}

export interface DuelQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface DuelHistoryItem {
  id: string;
  result: 'win' | 'loss' | 'tie';
  opponentName: string;
  myScore: number;
  opponentScore: number;
  coinChange: number;
  timestamp: string;
}

export interface GuildMember {
    userId: string;
    name: string;
    gradeName: string;
    gradeIcon: string;
    level: number;
    weeklyContribution: number;
    role: 'Chef' | 'Membre';
    isOnline: boolean;
    avatarId: string | null;
}

export interface Guild {
    id: string;
    name: string;
    emoji: string;
    chef: string;
    memberCount: number;
    maxMembers: number;
    level: number;
    description: string;
    members: GuildMember[];
}

export interface GuildMission {
    id: string;
    title: string;
    description: string;
    reward: string;
    currentProgress: number;
    goal: number;
    status: 'En cours' | 'Terminée';
}

export interface LeaderboardEntry {
    userId: string;
    rank: number;
    name: string;
    gradeName: string;
    gradeIcon: string;
    level: number;
    xp: number;
    chapters: number; // Chapters consulted
    quizzes: number; // Quizzes mastered
    duels: number; // Duels won
    trend: 'up' | 'down' | 'stable' | 'new';
    lastSeen: string;
    status: 'actif' | 'inactif';
    avatarId: string | null;
    eventScore?: number;
}

export interface AppSettings {
  appName: string;
  xpPerChapterConsultation: number;
  coinsPerQuizCompletion: number;
  maxDailyDuels: number;
  passwordResetFrequencyDays: number; // 0 for never
}

export interface Achievement {
    id: string;
    icon: string;
    title: string;
    description: string;
    isSecret: boolean;
    condition: (userData: UserData, allData: { quizzes: Quiz[], chapters: Chapter[] }) => boolean;
}

export interface ThemeStyle {
  id: string;
  name: string;
  isDark: boolean;
  previewBackground: string;
  variables: {
    [key: string]: string; // CSS variables
  };
}

export interface DuelChallenge {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  wager: number;
  timestamp: string; // ISO string
}

export interface WeeklyEvent {
    id: string;
    title: string;
    description: string;
    icon: string;
    relatedChapterIds: string[];
    endDate: string; // ISO string
    rewardItemId: string; 
}
export interface WeeklyEventProgress {
    [userId: string]: {
        score: number;
        userName: string;
        avatarId: string | null;
    };
}
