
import { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react';
import { UserData, ToastMessage, DuelHistoryItem, Chapter, Quiz, ReportedMessage, Message, Guild, AppSettings, FriendRequest, PrivateMessage, Activity, ActivityType, MindMap, DuelChallenge, WeeklyEventProgress } from '../types';
import { GRADES, MISSIONS, DAILY_MISSIONS, DUEL_CONSTANTS, GUILD_CREATION_COST, MOCK_STUDENTS, MOCK_TEACHER, MOCK_FRIEND_REQUESTS, MOCK_CONVERSATIONS, ACHIEVEMENTS, GOAT_CHALLENGE_SETTINGS, SHOP_ITEMS, MOCK_DUEL_CHALLENGES } from '../constants';
import { generateUsername, generatePassword, getWeekId } from '../utils/auth';

const MOCK_SUPER_ADMIN: UserData = {
    id: 'super_admin_001',
    username: 'admin',
    passwordHash: 'admin123',
    name: 'Super Admin',
    classe: 'N/A',
    role: 'super_admin',
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


const INITIAL_CHAPTERS: Chapter[] = [
  { id: 'chap1', title: 'Algèbre - Niveau 1', icon: '📐', difficulty: 'Facile', rewardXp: 20, rewardCoins: 10, description: 'Équations du premier degré', teacherId: MOCK_TEACHER.id, teacherName: MOCK_TEACHER.name, pdfUrl: 'https://example.com/cours.pdf' },
  { id: 'chap2', title: 'Géométrie - Niveau 1', icon: '📏', difficulty: 'Facile', rewardXp: 25, rewardCoins: 10, description: 'Triangles et angles', teacherId: MOCK_TEACHER.id, teacherName: MOCK_TEACHER.name },
  { id: 'chap3', title: 'Fonctions affines', icon: '📈', difficulty: 'Moyen', rewardXp: 35, rewardCoins: 10, description: 'Fonctions linéaires et affines', teacherId: MOCK_TEACHER.id, teacherName: MOCK_TEACHER.name },
  { id: 'chap4', title: 'Probabilités', icon: '🎲', difficulty: 'Moyen', rewardXp: 30, rewardCoins: 10, description: 'Introduction aux probabilités', teacherId: MOCK_TEACHER.id, teacherName: MOCK_TEACHER.name },
  { id: 'chap5', title: 'Trigonométrie', icon: '📐', difficulty: 'Difficile', rewardXp: 50, rewardCoins: 10, description: 'Sinus, Cosinus, Tangente', teacherId: MOCK_TEACHER.id, teacherName: MOCK_TEACHER.name },
  { id: 'chap6', title: 'Équations 2nd degré', icon: '🔢', difficulty: 'Difficile', rewardXp: 45, rewardCoins: 10, description: 'Résolution et discriminant', teacherId: MOCK_TEACHER.id, teacherName: MOCK_TEACHER.name },
];

const INITIAL_QUIZZES: Quiz[] = [
    {
        id: 'quiz1',
        chapterId: 'chap1',
        title: 'Quiz sur les équations du premier degré',
        questions: [
            // FIX: Property 'type' is missing in type '{ id: string; questionText: string; options: string[]; correctOptionIndex: number; }' but required in type 'QuizQuestion'.
            { id: 'q1_1', type: 'mcq', questionText: 'Résous : 2x + 5 = 15', options: ['x = 5', 'x = 10', 'x = 2.5', 'x = 7.5'], correctOptionIndex: 0 },
            // FIX: Property 'type' is missing in type '{ id: string; questionText: string; options: string[]; correctOptionIndex: number; }' but required in type 'QuizQuestion'.
            { id: 'q1_2', type: 'mcq', questionText: 'Si 3y - 4 = 11, que vaut y ?', options: ['y = 3', 'y = 4', 'y = 5', 'y = 15'], correctOptionIndex: 2 },
            // FIX: Property 'type' is missing in type '{ id: string; questionText: string; options: string[]; correctOptionIndex: number; }' but required in type 'QuizQuestion'.
            { id: 'q1_3', type: 'mcq', questionText: 'Quelle est la valeur de z si 10 - z = 4 ?', options: ['z = 14', 'z = 6', 'z = -6', 'z = 4'], correctOptionIndex: 1 }
        ]
    },
    {
        id: 'quiz2',
        chapterId: 'chap2',
        title: 'Quiz sur les triangles et angles',
        questions: [
            // FIX: Property 'type' is missing in type '{ id: string; questionText: string; options: string[]; correctOptionIndex: number; }' but required in type 'QuizQuestion'.
            { id: 'q2_1', type: 'mcq', questionText: 'La somme des angles d\'un triangle est toujours de :', options: ['90°', '180°', '270°', '360°'], correctOptionIndex: 1 },
            // FIX: Property 'type' is missing in type '{ id: string; questionText: string; options: string[]; correctOptionIndex: number; }' but required in type 'QuizQuestion'.
            { id: 'q2_2', type: 'mcq', questionText: 'Comment appelle-t-on un triangle avec 3 côtés égaux ?', options: ['Isocèle', 'Scalène', 'Rectangle', 'Équilatéral'], correctOptionIndex: 3 }
        ]
    }
];

const INITIAL_REPORTED_MESSAGES: ReportedMessage[] = [
    {
        id: 'report1',
        message: { id: 101, author: 'Thomas Bernard', authorId: 'student_003', text: 'C\'est trop nul ce chapitre.', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
        reporterId: 'student_002',
        reporterName: 'Emma Martin',
        reason: 'Langage inapproprié',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
    },
    {
        id: 'report2',
        message: { id: 102, author: 'Hugo Petit', authorId: 'student_005', text: 'Quelqu\'un a les réponses du quiz de géo ? svp', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) },
        reporterId: 'student_001',
        reporterName: 'Lucas Dubois',
        reason: 'Triche',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
];

const INITIAL_GUILDS: Guild[] = [
    {
        id: 'g1', name: 'Les Matheux', emoji: '🧮', chef: 'Sophie Laurent', memberCount: 3, maxMembers: 10, level: 5, description: "On s'entraide pour progresser ensemble.",
        members: [
            { userId: 'student_008', name: 'Sophie Laurent', gradeName: 'Analyste', gradeIcon: '📈', level: 35, weeklyContribution: 350, role: 'Chef', isOnline: true, avatarId: 'item2' },
            { userId: 'student_001', name: 'Lucas Dubois', gradeName: 'Calculateur', gradeIcon: '✏️', level: 15, weeklyContribution: 220, role: 'Membre', isOnline: true, avatarId: null },
            { userId: 'student_010', name: 'Camille Durand', gradeName: 'Calculateur', gradeIcon: '✏️', level: 12, weeklyContribution: 150, role: 'Membre', isOnline: false, avatarId: null },
        ]
    },
    {
        id: 'g2', name: 'Équipe Pythagore', emoji: '📐', chef: 'Antoine Moreau', memberCount: 3, maxMembers: 10, level: 3, description: 'La géométrie est notre passion.',
        members: [
            { userId: 'student_007', name: 'Antoine Moreau', gradeName: 'Géomètre', gradeIcon: '📐', level: 28, weeklyContribution: 450, role: 'Chef', isOnline: false, avatarId: null },
            { userId: 'student_002', name: 'Emma Martin', gradeName: 'Algébriste', gradeIcon: '📊', level: 25, weeklyContribution: 520, role: 'Membre', isOnline: true, avatarId: 'item1' },
            { userId: 'student_004', name: 'Léa Dubois', gradeName: 'Calculateur', gradeIcon: '✏️', level: 20, weeklyContribution: 310, role: 'Membre', isOnline: true, avatarId: 'item3' },
        ]
    },
];

const processedStudents = MOCK_STUDENTS.map(s => {
    if (['Sophie Laurent', 'Lucas Dubois', 'Camille Durand'].includes(s.name)) {
        return { ...s, guildId: 'g1' };
    }
    if (['Antoine Moreau', 'Emma Martin', 'Léa Dubois'].includes(s.name)) {
        return { ...s, guildId: 'g2' };
    }
    return s;
});

const INITIAL_SETTINGS: AppSettings = {
    appName: "GOAT of Maths",
    xpPerChapterConsultation: 25,
    coinsPerQuizCompletion: 15,
    maxDailyDuels: 5,
    passwordResetFrequencyDays: 90,
};


const useLocalStorage = <T,>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue: Dispatch<SetStateAction<T>> = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};


export const useUserData = () => {
  const [allUsers, setAllUsers] = useLocalStorage<UserData[]>('goat-math-all-users', [MOCK_SUPER_ADMIN, MOCK_TEACHER, ...processedStudents]);
  const [userData, setUserData] = useLocalStorage<UserData | null>('goat-math-user', null);
  const [chapters, setChapters] = useLocalStorage<Chapter[]>('goat-math-chapters', INITIAL_CHAPTERS);
  const [quizzes, setQuizzes] = useLocalStorage<Quiz[]>('goat-math-quizzes', INITIAL_QUIZZES);
  const [reportedMessages, setReportedMessages] = useLocalStorage<ReportedMessage[]>('goat-math-reports', INITIAL_REPORTED_MESSAGES);
  const [allGuilds, setAllGuilds] = useLocalStorage<Guild[]>('goat-math-all-guilds', INITIAL_GUILDS);
  const [appSettings, setAppSettings] = useLocalStorage<AppSettings>('goat-math-settings', INITIAL_SETTINGS);
  const [friendRequests, setFriendRequests] = useLocalStorage<FriendRequest[]>('goat-math-friend-requests', MOCK_FRIEND_REQUESTS);
  const [conversations, setConversations] = useLocalStorage<{ [key: string]: PrivateMessage[] }>('goat-math-conversations', MOCK_CONVERSATIONS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  // FIX: Added missing state for duel challenges.
  const [duelChallenges, setDuelChallenges] = useLocalStorage<DuelChallenge[]>('goat-math-duel-challenges', MOCK_DUEL_CHALLENGES);
  // FIX: Added missing state for weekly event progress.
  const [weeklyEventProgress, setWeeklyEventProgress] = useLocalStorage<WeeklyEventProgress>('goat-math-event-progress', {
    'student_001': { score: 120, userName: 'Lucas Dubois', avatarId: null },
    'student_008': { score: 150, userName: 'Sophie Laurent', avatarId: 'item2' },
    'student_002': { score: 95, userName: 'Emma Martin', avatarId: 'item1' },
  });

  const addToast = useCallback((message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(p => p.filter(t => t.id !== id));
  }, []);

  const updateUserState = useCallback((updatedUserData: UserData) => {
      setUserData(updatedUserData);
      setAllUsers(prevAll => prevAll.map(u => u.id === updatedUserData.id ? updatedUserData : u));
  }, [setUserData, setAllUsers]);

  const markWelcomeAsSeen = useCallback(() => {
    if (!userData) return;
    updateUserState({ ...userData, hasSeenWelcomeModal: true });
  }, [userData, updateUserState]);


  const checkMissions = useCallback((currentUserData: UserData, event?: { type: string; data?: any }) => {
    let xpGained = 0;
    let coinsGained = 0;
    let missionsCompletedCount = 0;
    const newCompletedMissions = [...currentUserData.completedMissions];

    MISSIONS.forEach((mission) => {
      if (!currentUserData.completedMissions.includes(mission.id) && mission.condition(currentUserData, event)) {
        newCompletedMissions.push(mission.id);
        xpGained += mission.xp;
        coinsGained += mission.coins;
        missionsCompletedCount++;
        addToast(`Mission Accomplie: ${mission.title}! (+${mission.xp} XP, +${mission.coins} 🪙)`);
      }
    });

    if (missionsCompletedCount > 0) {
      const updatedUserData = {
          ...currentUserData,
          xp: currentUserData.xp + xpGained,
          coins: currentUserData.coins + coinsGained,
          completedMissions: newCompletedMissions
      };
      updateUserState(updatedUserData);
    }
  }, [addToast, updateUserState]);

  const logActivity = useCallback((user: UserData, type: ActivityType, text: string): UserData => {
    const newActivity: Activity = {
        id: `act_${Date.now()}`,
        type,
        text,
        timestamp: new Date().toISOString(),
    };
    const updatedHistory = [newActivity, ...user.activityHistory].slice(0, 5); // Keep last 5
    return { ...user, activityHistory: updatedHistory };
  }, []);

  const checkAchievements = useCallback((currentUserData: UserData) => {
    let didUnlock = false;
    let updatedUser = { ...currentUserData };

    ACHIEVEMENTS.forEach(ach => {
        if (!updatedUser.unlockedAchievements.includes(ach.id) && ach.condition(updatedUser, { quizzes, chapters })) {
            updatedUser.unlockedAchievements.push(ach.id);
            addToast(`🏆 Succès débloqué : ${ach.title} !`);
            didUnlock = true;
        }
    });

    if (didUnlock) {
      updateUserState(updatedUser);
    }
    
    return updatedUser;
  }, [addToast, quizzes, chapters, updateUserState]);


  const addXp = useCallback((amount: number, startingUserData?: UserData) => {
    const baseUser = startingUserData || userData;
    if (!baseUser) return;

    let newXp = baseUser.xp + amount;
    let newLevel = baseUser.level;
    let newGradeIndex = baseUser.gradeIndex;
    let userWithActivity = { ...baseUser };
    
    if (amount > 0) {
        addToast(`+${amount} XP!`);
    }

    let continueLeveling = true;
    while (continueLeveling) {
      const currentGrade = GRADES[newGradeIndex];
      if (!currentGrade) {
          continueLeveling = false;
          break;
      }
      
      const xpForNextLevel = currentGrade.xpPerLevel;

      if (newXp >= xpForNextLevel) {
        newXp -= xpForNextLevel;
        const oldLevel = newLevel;
        newLevel++;
        
        if (newLevel > currentGrade.levelsToComplete) {
          if (newGradeIndex < GRADES.length - 1) {
            newGradeIndex++;
            newLevel = 1;
            const newGrade = GRADES[newGradeIndex];
            addToast(`Promotion! Bienvenue au grade ${newGrade.name}! 🚀`);
          } else {
            newLevel = currentGrade.levelsToComplete;
            newXp = xpForNextLevel; // Cap XP at max for the final level
            continueLeveling = false;
          }
        }
        addToast(`Niveau ${newLevel} atteint! 🎉`);
        if (oldLevel !== newLevel) {
            userWithActivity = logActivity(userWithActivity, 'level_up', `🎉 A atteint le niveau ${newLevel}.`);
        }
      } else {
        continueLeveling = false;
      }
    }

    let updatedUserData = { ...userWithActivity, xp: newXp, level: newLevel, gradeIndex: newGradeIndex };
    updatedUserData = checkAchievements(updatedUserData);
    updateUserState(updatedUserData);
  }, [userData, addToast, updateUserState, logActivity, checkAchievements]);


  const completeDailyMission = useCallback((missionId: string, currentUserData?: UserData) => {
    const mission = DAILY_MISSIONS.find(m => m.id === missionId);
    const targetUser = currentUserData || userData;
    
    if (!targetUser || !mission || targetUser.completedDailyMissionIds.includes(missionId)) {
      return;
    }
    addToast(`✅ Mission accomplie ! +${mission.rewardXp} XP • +${mission.rewardCoins} 🪙`);

    const updatedUserData = {
        ...targetUser,
        coins: targetUser.coins + mission.rewardCoins,
        completedDailyMissionIds: [...targetUser.completedDailyMissionIds, missionId],
    };
    
    // Pass the updated user data to addXp to avoid race conditions.
    // addXp will handle the final state update.
    addXp(mission.rewardXp, updatedUserData);
    
  }, [addXp, addToast, userData]);

  const consultChapter = useCallback((chapterId: string, rewardXp: number, rewardCoins: number) => {
    if (!userData || userData.consultedChapters.includes(chapterId)) return;
    
    const chapterTitle = chapters.find(c => c.id === chapterId)?.title || "un chapitre";
    addToast(`✅ Chapitre consulté ! +${rewardXp} XP, +${rewardCoins} 🪙`);
    
    let updatedUserData: UserData = {
      ...userData,
      coins: userData.coins + rewardCoins,
      consultedChapters: [...userData.consultedChapters, chapterId],
    };
    updatedUserData = logActivity(updatedUserData, 'chapter_consulted', `📚 A consulté le chapitre "${chapterTitle}".`);


    // Check for 'consult chapter' daily mission
    const dailyMission = DAILY_MISSIONS.find(m => m.id === 'daily2');
    if (dailyMission && !updatedUserData.completedDailyMissionIds.includes(dailyMission.id)) {
        // Temporarily add rewards before calling completeDailyMission
        updatedUserData = { ...updatedUserData, xp: updatedUserData.xp + rewardXp };
        completeDailyMission(dailyMission.id, updatedUserData);
    } else {
       addXp(rewardXp, updatedUserData);
    }
  }, [addXp, addToast, userData, completeDailyMission, chapters, logActivity]);
  
  const QUIZ_COMPLETION_XP = 50;
  const QUIZ_COMPLETION_COINS = 20;
  const PERFECT_SCORE_BONUS_XP = 50;
  
  const completeQuiz = useCallback((quizId: string, results: { questionId: string, isCorrect: boolean }[]) => {
    if (!userData) return;

    const score = results.filter(r => r.isCorrect).length;
    const totalQuestions = results.length;
    let xpGained = QUIZ_COMPLETION_XP;
    let coinsGained = QUIZ_COMPLETION_COINS;
    const isPerfect = score === totalQuestions;
    const quizTitle = quizzes.find(q => q.id === quizId)?.title || "un quiz";

    let updatedUserData = { ...userData };

    // Update performance tracking
    const newPerformance = { ...updatedUserData.quizPerformance };
    results.forEach(result => {
        const current = newPerformance[result.questionId] || { correct: 0, incorrect: 0 };
        if (result.isCorrect) {
            current.correct += 1;
        } else {
            current.incorrect += 1;
        }
        newPerformance[result.questionId] = current;
    });
    updatedUserData.quizPerformance = newPerformance;


    if (isPerfect) {
      xpGained += PERFECT_SCORE_BONUS_XP;
      addToast(`⭐ Score parfait ! +${PERFECT_SCORE_BONUS_XP} XP bonus !`);
      updatedUserData = logActivity(updatedUserData, 'quiz_perfect', `⭐ A obtenu un score parfait au ${quizTitle}.`);
    } else {
      updatedUserData = logActivity(updatedUserData, 'quiz_completed', `📝 A terminé le ${quizTitle} avec ${score}/${totalQuestions}.`);
    }
    
    addToast(`Quiz terminé ! +${QUIZ_COMPLETION_XP} XP, +${coinsGained} 🪙`);

    const existingQuizCompletion = userData.completedQuizzes.find(c => c.quizId === quizId);
    let updatedCompletions = [...userData.completedQuizzes];

    if (existingQuizCompletion) {
        if (score > existingQuizCompletion.bestScore) {
            updatedCompletions = updatedCompletions.map(c => c.quizId === quizId ? { ...c, bestScore: score } : c);
             addToast(`Nouveau record personnel pour ce quiz !`);
        }
    } else {
        updatedCompletions.push({ quizId, bestScore: score });
    }

    updatedUserData = {
        ...updatedUserData,
        coins: updatedUserData.coins + coinsGained,
        completedQuizzes: updatedCompletions,
    };

    // Chain daily mission completions
    const completeQuizMission = DAILY_MISSIONS.find(m => m.id === 'daily3');
    if (completeQuizMission && !updatedUserData.completedDailyMissionIds.includes(completeQuizMission.id)) {
        updatedUserData = {
            ...updatedUserData,
            coins: updatedUserData.coins + completeQuizMission.rewardCoins,
            completedDailyMissionIds: [...updatedUserData.completedDailyMissionIds, completeQuizMission.id],
        };
        xpGained += completeQuizMission.rewardXp;
        addToast(`✅ Mission accomplie : ${completeQuizMission.title}`);
    }
    
    if (isPerfect) {
        const perfectScoreMission = DAILY_MISSIONS.find(m => m.id === 'daily4');
        if (perfectScoreMission && !updatedUserData.completedDailyMissionIds.includes(perfectScoreMission.id)) {
             updatedUserData = {
                ...updatedUserData,
                coins: updatedUserData.coins + perfectScoreMission.rewardCoins,
                completedDailyMissionIds: [...updatedUserData.completedDailyMissionIds, perfectScoreMission.id],
            };
            xpGained += perfectScoreMission.rewardXp;
            addToast(`✅ Mission accomplie : ${perfectScoreMission.title}`);
        }
    }

    addXp(xpGained, updatedUserData);

  }, [addXp, addToast, userData, quizzes, logActivity]);

  const buyItem = useCallback((itemId: string, price: number) => {
    if (!userData || userData.coins < price || userData.ownedItems.includes(itemId)) return;
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    let updatedUserData = {
      ...userData,
      coins: userData.coins - price,
      ownedItems: [...userData.ownedItems, itemId]
    };
    updatedUserData = logActivity(updatedUserData, 'item_bought', `🛍️ A acheté "${item?.name || 'un article'}".`);
    addToast(`Achat réussi!`);
    
    const userAfterAchievements = checkAchievements(updatedUserData);
    updateUserState(userAfterAchievements);
    
    checkMissions(userAfterAchievements, { type: 'buy_item' });
  }, [addToast, checkMissions, userData, updateUserState, logActivity, checkAchievements]);

  const equipAvatar = useCallback((avatarId: string) => {
    if (!userData || !userData.ownedItems.includes(avatarId)) {
        addToast("Vous ne possédez pas cet avatar.");
        return;
    }
    updateUserState({ ...userData, avatarId });
    addToast("Avatar équipé !");
  }, [addToast, userData, updateUserState]);

  const equipTheme = useCallback((themeId: string) => {
    if (!userData) return;
    const themeShopItem = SHOP_ITEMS.find(i => i.themeId === themeId);
    if (!themeShopItem || !userData.ownedItems.includes(themeShopItem.id)) {
        addToast("Vous ne possédez pas ce thème.");
        return;
    }
    updateUserState({ ...userData, equippedThemeId: themeId });
    addToast("Thème appliqué !");
  }, [addToast, userData, updateUserState]);
  
  // FIX: Implemented missing equip functions.
  const equipAvatarFrame = useCallback((frameId: string) => {
    if (!userData) return;
    const frameShopItem = SHOP_ITEMS.find(i => i.id === frameId && i.type === 'AvatarFrame');
    if (!frameShopItem || !userData.ownedItems.includes(frameShopItem.id)) {
        addToast("Vous ne possédez pas ce cadre.");
        return;
    }
    updateUserState({ ...userData, equippedAvatarFrameId: frameId });
    addToast("Cadre d'avatar appliqué !");
  }, [addToast, userData, updateUserState]);

  const equipProfileBanner = useCallback((bannerId: string) => {
    if (!userData) return;
    const bannerShopItem = SHOP_ITEMS.find(i => i.id === bannerId && i.type === 'ProfileBanner');
    if (!bannerShopItem || !userData.ownedItems.includes(bannerShopItem.id)) {
        addToast("Vous ne possédez pas cette bannière.");
        return;
    }
    updateUserState({ ...userData, equippedProfileBannerId: bannerId });
    addToast("Bannière de profil appliquée !");
  }, [addToast, userData, updateUserState]);

  const completeDuel = useCallback((result: 'win' | 'loss' | 'tie', myScore: number, opponentScore: number, opponentName: string) => {
    if (!userData) return;
    let { duelWins, duelLosses, coins, dailyDuelsPlayed, duelHistory } = userData;
    let coinChanges = 0;
    let updatedUserData = { ...userData };
    
    if (result === 'win') {
      duelWins++;
      coinChanges = DUEL_CONSTANTS.WIN_COINS;
      addToast(`🏆 Victoire! +${coinChanges} 🪙`);
      updatedUserData = logActivity(updatedUserData, 'duel_win', `⚔️ A gagné un duel contre ${opponentName}.`);
    } else if (result === 'loss') {
      duelLosses++;
      coinChanges = DUEL_CONSTANTS.LOSS_COINS;
      addToast(`😢 Défaite... ${coinChanges} 🪙`);
    } else {
      coinChanges = DUEL_CONSTANTS.TIE_COINS;
      addToast(`🤝 Égalité!`);
    }

    const newHistoryItem: DuelHistoryItem = {
      id: new Date().toISOString(), result, opponentName, myScore, opponentScore,
      coinChange: coinChanges, timestamp: new Date().toLocaleString('fr-FR')
    };

    updatedUserData = {
      ...updatedUserData,
      duelWins, duelLosses,
      dailyDuelsPlayed: dailyDuelsPlayed + 1,
      coins: coins + coinChanges,
      duelHistory: [newHistoryItem, ...duelHistory].slice(0, 5)
    };
    
    const userAfterAchievements = checkAchievements(updatedUserData);
    updateUserState(userAfterAchievements);
  }, [addToast, userData, updateUserState, logActivity, checkAchievements]);

  const completeGoatChallenge = useCallback((score: number, time: number, weekId: string) => {
    if (!userData) return;
    
    let xpGained = 0;
    let coinsGained = 0;
    const { PERFECT, EXCELLENT, GOOD } = GOAT_CHALLENGE_SETTINGS.REWARDS;
    const totalQuestions = GOAT_CHALLENGE_SETTINGS.QUESTIONS_COUNT;

    if (score === totalQuestions) {
        xpGained = PERFECT.xp;
        coinsGained = PERFECT.coins;
        addToast(`🐐 SCORE PARFAIT AU DÉFI ! +${xpGained} XP, +${coinsGained} 🪙`);
    } else if (score >= 8) {
        xpGained = EXCELLENT.xp;
        coinsGained = EXCELLENT.coins;
        addToast(`🏆 Excellent score ! +${xpGained} XP, +${coinsGained} 🪙`);
    } else if (score >= 5) {
        xpGained = GOOD.xp;
        coinsGained = GOOD.coins;
        addToast(`👍 Bon résultat ! +${xpGained} XP, +${coinsGained} 🪙`);
    } else {
        addToast(`Défi terminé. Entraîne-toi pour faire mieux la semaine prochaine !`);
    }
    
    let updatedUserData = {
        ...userData,
        coins: userData.coins + coinsGained,
        goatChallengeAttempts: {
            ...userData.goatChallengeAttempts,
            [weekId]: { score, time }
        }
    };

    updatedUserData = logActivity(updatedUserData, 'goat_challenge', `🐐 A terminé le Défi du GOAT avec un score de ${score}/${totalQuestions}.`);

    addXp(xpGained, updatedUserData);

  }, [userData, addToast, logActivity, addXp]);

  const startGoatChallenge = useCallback(() => {
    if (!userData) return false;
    
    const currentWeekId = getWeekId(new Date());
    if (userData.goatChallengeAttempts?.[currentWeekId]) {
        addToast("Tu as déjà participé cette semaine !");
        return false;
    }

    if (userData.coins < GOAT_CHALLENGE_SETTINGS.ENTRY_FEE) {
        addToast("Pas assez de MathCoins pour participer !");
        return false;
    }

    updateUserState({
        ...userData,
        coins: userData.coins - GOAT_CHALLENGE_SETTINGS.ENTRY_FEE
    });
    addToast(`-${GOAT_CHALLENGE_SETTINGS.ENTRY_FEE} 🪙 Frais d'entrée payés. Bonne chance !`);
    return true;
  }, [userData, updateUserState, addToast]);


  const createGuild = useCallback(() => {
    if (!userData || userData.coins < GUILD_CREATION_COST) {
      addToast("Pas assez de MathCoins pour créer une guilde !");
      return;
    }
    addToast(`Guilde créée ! -${GUILD_CREATION_COST} 🪙`);
    const updatedUserData = {
      ...userData,
      coins: userData.coins - GUILD_CREATION_COST,
      guildId: 'my-guild'
    };
    const userAfterAchievements = checkAchievements(updatedUserData);
    updateUserState(userAfterAchievements);
  }, [addToast, userData, updateUserState, checkAchievements]);

  const joinGuild = useCallback((guildId: string) => {
    if (!userData || userData.guildId) return;
    addToast("Vous avez rejoint une guilde !");
    const updatedUserData = { ...userData, guildId };
    const userAfterAchievements = checkAchievements(updatedUserData);
    updateUserState(userAfterAchievements);
  }, [addToast, userData, updateUserState, checkAchievements]);

  const leaveGuild = useCallback(() => {
    if (!userData || !userData.guildId) return;
    addToast("Vous avez quitté la guilde.");
    updateUserState({ ...userData, guildId: null });
  }, [addToast, userData, updateUserState]);
  
    // --- MIND MAPS ---
  const saveMindMap = useCallback((mindMap: MindMap) => {
      if (!userData) return;
      const existingMapIndex = userData.mindMaps.findIndex(m => m.id === mindMap.id);
      let newMindMaps;
      if (existingMapIndex > -1) {
          newMindMaps = [...userData.mindMaps];
          newMindMaps[existingMapIndex] = mindMap;
          addToast("🗺️ Carte mentale mise à jour !");
      } else {
          newMindMaps = [...userData.mindMaps, mindMap];
          addToast("🗺️ Nouvelle carte mentale sauvegardée !");
      }
      updateUserState({ ...userData, mindMaps: newMindMaps });
  }, [userData, updateUserState, addToast]);

  const deleteMindMap = useCallback((mindMapId: string) => {
      if (!userData) return;
      if (window.confirm("Voulez-vous vraiment supprimer cette carte mentale ?")) {
          const newMindMaps = userData.mindMaps.filter(m => m.id !== mindMapId);
          updateUserState({ ...userData, mindMaps: newMindMaps });
          addToast("🗑️ Carte mentale supprimée.");
      }
  }, [userData, updateUserState, addToast]);


  // --- FRIENDS & MESSAGING ---
  const sendFriendRequest = useCallback((toUserId: string) => {
      if (!userData) return;
      const alreadyFriends = userData.friendIds.includes(toUserId);
      const requestExists = friendRequests.some(r => (r.fromUserId === userData.id && r.toUserId === toUserId) || (r.fromUserId === toUserId && r.toUserId === userData.id));
      if (alreadyFriends || requestExists) {
          addToast("Vous êtes déjà amis ou une demande est en cours.");
          return;
      }
      const newRequest: FriendRequest = {
          id: `fr_${Date.now()}`,
          fromUserId: userData.id,
          fromUserName: userData.name,
          fromUserAvatarId: userData.avatarId,
          fromUserLevel: userData.level,
          toUserId: toUserId,
          timestamp: new Date().toISOString(),
      };
      setFriendRequests(prev => [...prev, newRequest]);
      addToast("🤝 Demande d'ami envoyée !");
  }, [userData, friendRequests, addToast, setFriendRequests]);

  const handleFriendRequest = useCallback((requestId: string, accept: boolean) => {
      const request = friendRequests.find(r => r.id === requestId);
      if (!request || !userData) return;

      if (accept) {
          setAllUsers(prevUsers => prevUsers.map(user => {
              if (user.id === request.fromUserId) {
                  return { ...user, friendIds: [...user.friendIds, request.toUserId] };
              }
              if (user.id === request.toUserId) {
                  return { ...user, friendIds: [...user.friendIds, request.fromUserId] };
              }
              return user;
          }));
          // Also update current user state if they are the one accepting
          if (userData.id === request.toUserId) {
              setUserData(prev => prev ? { ...prev, friendIds: [...prev.friendIds, request.fromUserId] } : null);
          }
          addToast(`Vous êtes maintenant ami avec ${request.fromUserName} !`);
      } else {
          addToast("Demande d'ami refusée.");
      }
      setFriendRequests(prev => prev.filter(r => r.id !== requestId));
  }, [friendRequests, setFriendRequests, setAllUsers, addToast, userData, setUserData]);

  const removeFriend = useCallback((friendId: string) => {
      if (!userData) return;
      if (window.confirm("Voulez-vous vraiment supprimer cet ami ?")) {
          const currentUserId = userData.id;
          setAllUsers(prevUsers => prevUsers.map(user => {
              if (user.id === currentUserId) {
                  return { ...user, friendIds: user.friendIds.filter(id => id !== friendId) };
              }
              if (user.id === friendId) {
                  return { ...user, friendIds: user.friendIds.filter(id => id !== currentUserId) };
              }
              return user;
          }));
          setUserData(prev => prev ? { ...prev, friendIds: prev.friendIds.filter(id => id !== friendId) } : null);
          addToast("Ami supprimé.");
      }
  }, [userData, addToast, setUserData, setAllUsers]);
  
  const sendPrivateMessage = useCallback((toUserId: string, text: string) => {
    if (!userData) return;
    const newMessage: PrivateMessage = {
        id: `pm_${Date.now()}`,
        fromUserId: userData.id,
        toUserId,
        text,
        timestamp: new Date().toISOString(),
        isRead: false
    };
    
    // In this mock, we add the message to the recipient's "inbox"
    // A real system would use a shared conversation ID
    setConversations(prev => {
        const newConvos = { ...prev };
        
        // Add message to recipient's conversation history
        const recipientConvo = newConvos[toUserId] || [];
        newConvos[toUserId] = [...recipientConvo, newMessage];
        
        // Also add message to sender's conversation history to see their own messages
        const senderConvo = newConvos[userData.id] || [];
        newConvos[userData.id] = [...senderConvo, newMessage];
        
        return newConvos;
    });
}, [userData, setConversations]);

  // FIX: Implemented missing duel challenge functions.
  const sendDuelChallenge = useCallback((toUserId: string, wager: number) => {
    if (!userData) return;
    const toUser = allUsers.find(u => u.id === toUserId);
    if (!toUser) return;

    if (userData.coins < wager) {
        addToast("Vous n'avez pas assez de MathCoins pour ce pari.");
        return;
    }

    const newChallenge: DuelChallenge = {
        id: `dc_${Date.now()}`,
        fromUserId: userData.id,
        fromUserName: userData.name,
        toUserId: toUserId,
        toUserName: toUser.name,
        wager: wager,
        timestamp: new Date().toISOString(),
    };

    setDuelChallenges(prev => [...prev, newChallenge]);
    addToast(`Défi de duel envoyé à ${toUser.name} !`);
}, [userData, allUsers, setDuelChallenges, addToast]);

const handleDuelChallenge = useCallback((challengeId: string, accept: boolean) => {
    const challenge = duelChallenges.find(c => c.id === challengeId);
    if (!challenge) return;

    if (accept) {
        const fromUser = allUsers.find(u => u.id === challenge.fromUserId);
        if (fromUser) {
            addToast(`Duel contre ${fromUser.name} accepté ! Préparez-vous.`);
        }
    } else {
        addToast("Défi refusé.");
    }
    setDuelChallenges(prev => prev.filter(c => c.id !== challengeId));
}, [duelChallenges, setDuelChallenges, allUsers, addToast]);


  // --- AUTH FUNCTIONS ---

  const login = (username: string, password: string, expectedRole?: 'student' | 'admin'): boolean => {
    const normalizedUsername = username.toLowerCase().trim();
    const user = allUsers.find(u => u.username === normalizedUsername);

    if (!user) {
      addToast('❌ Identifiant inconnu');
      return false;
    }
    if (user.passwordHash !== password) {
      addToast('❌ Mot de passe incorrect');
      return false;
    }

    if (expectedRole === 'student' && user.role !== 'student') {
        addToast('❌ Ce compte n\'est pas un compte élève.');
        return false;
    }
    
    if (expectedRole === 'admin' && user.role !== 'teacher' && user.role !== 'super_admin') {
        addToast('❌ Vous n\'avez pas les droits pour accéder à cette section.');
        return false;
    }

    const loggedInUser: UserData = { ...user, lastLogin: new Date() };
    setUserData(loggedInUser);
    
    // Also update the master list if it's a student
    if(loggedInUser.role === 'student') {
        setAllUsers(prev => prev.map(u => u.id === loggedInUser.id ? loggedInUser : u));
    }
    
    addToast(`👋 Bonjour, ${user.name} !`);
    return true;
  };
  
  const logout = () => {
    setUserData(null);
    localStorage.removeItem('goat-math-user');
  };
  
  const changePassword = (currentPassword: string, newPassword: string): boolean => {
      if (!userData) return false;
      if (userData.passwordHash !== currentPassword) {
          addToast('❌ Mot de passe actuel incorrect');
          return false;
      }
       if (newPassword === currentPassword) {
          addToast('❌ Le nouveau mot de passe doit être différent');
          return false;
      }

      const updatedUserData: UserData = {
          ...userData,
          passwordHash: newPassword,
          mustChangePassword: false,
          lastPasswordChange: new Date(),
      };
      updateUserState(updatedUserData);
      addToast('✅ Mot de passe changé avec succès !');
      return true;
  };

  const forceChangePassword = (newPassword: string): boolean => {
    if (!userData) return false;
     const updatedUserData: UserData = {
          ...userData,
          passwordHash: newPassword,
          mustChangePassword: false,
          lastPasswordChange: new Date(),
      };
      updateUserState(updatedUserData);
      addToast('✅ Mot de passe initialisé avec succès !');
      return true;
  };
  
  // --- ADMIN USER MANAGEMENT ---
  const adminCreateUser = (fullName: string, classe: string, teacherId: string): UserData | null => {
      const username = generateUsername(fullName, allUsers);
      const password = generatePassword();
      const newUser: UserData = {
        id: `student_${Date.now()}`,
        username,
        passwordHash: password,
        name: fullName,
        classe,
        role: 'student',
        teacherId,
        level: 1, xp: 0, coins: 50, hp: 100, streak: 0, gradeIndex: 0,
        consultedChapters: [], completedMissions: [], completedDailyMissionIds: [], ownedItems: [],
        avatarId: null,
        friendIds: [],
        duelWins: 0, duelLosses: 0, dailyDuelsPlayed: 0, duelHistory: [],
        guildId: null,
        completedQuizzes: [],
        quizPerformance: {},
        unlockedAchievements: [],
        activityHistory: [],
        goatChallengeAttempts: {},
        mindMaps: [],
        mustChangePassword: true,
        hasSeenWelcomeModal: false,
        createdAt: new Date(),
        equippedThemeId: undefined,
      };
      setAllUsers(prev => [...prev, newUser]);
      addToast(`✅ Compte élève pour ${fullName} créé !`);
      return newUser;
  };

  const adminCreateTeacher = (fullName: string): UserData | null => {
      const username = generateUsername(fullName, allUsers);
      const password = generatePassword();
      const newTeacher: UserData = {
        id: `teacher_${Date.now()}`,
        username,
        passwordHash: password,
        name: fullName,
        classe: 'N/A',
        role: 'teacher',
        level: 1, xp: 0, coins: 0, hp: 100, streak: 0, gradeIndex: 0,
        consultedChapters: [], completedMissions: [], completedDailyMissionIds: [], ownedItems: [],
        avatarId: null,
        friendIds: [],
        duelWins: 0, duelLosses: 0, dailyDuelsPlayed: 0, duelHistory: [],
        guildId: null,
        completedQuizzes: [],
        quizPerformance: {},
        unlockedAchievements: [],
        activityHistory: [],
        goatChallengeAttempts: {},
        mindMaps: [],
        mustChangePassword: true,
        createdAt: new Date(),
      };
      setAllUsers(prev => [...prev, newTeacher]);
      addToast(`✅ Compte professeur pour ${fullName} créé !`);
      return newTeacher;
  };

  const adminResetPassword = (userId: string): string | null => {
      const newPassword = generatePassword();
      let userFound = false;
      setAllUsers(prev => prev.map(u => {
          if (u.id === userId) {
              userFound = true;
              return { ...u, passwordHash: newPassword, mustChangePassword: true };
          }
          return u;
      }));
      if (userFound) {
          addToast(`✅ Mot de passe réinitialisé.`);
          return newPassword;
      }
      addToast(`❌ Utilisateur non trouvé.`);
      return null;
  };

  const adminUpdateUser = (userId: string, updates: { name?: string; classe?: string }): boolean => {
      let userFound = false;
      setAllUsers(prev => prev.map(u => {
          if (u.id === userId) {
              userFound = true;
              return { ...u, ...updates };
          }
          return u;
      }));
      if (userFound) {
          addToast(`✅ Profil de ${updates.name || 'l\'utilisateur'} mis à jour.`);
          if (userData?.id === userId) {
              setUserData(prev => prev ? ({ ...prev, ...updates }) : null);
          }
          return true;
      }
      addToast(`❌ Utilisateur non trouvé.`);
      return false;
  };

  const adminAddBonus = (userId: string, xp: number, coins: number): boolean => {
      let userFound = false;
      setAllUsers(prev => prev.map(u => {
          if (u.id === userId) {
              userFound = true;
              return { ...u, xp: u.xp + xp, coins: u.coins + coins };
          }
          return u;
      }));
      if (userFound) {
          addToast(`🎁 Bonus ajouté !`);
           if (userData?.id === userId) {
              setUserData(prev => prev ? ({ ...prev, xp: prev.xp + xp, coins: prev.coins + coins }) : null);
          }
          return true;
      }
      addToast(`❌ Élève non trouvé.`);
      return false;
  };
  
  const adminDeleteUser = (userId: string): boolean => {
      const userToDelete = allUsers.find(u => u.id === userId);
      if (userToDelete) {
          setAllUsers(prev => prev.filter(u => u.id !== userId));
          addToast(`🗑️ Compte de ${userToDelete.name} supprimé.`);
          if (userData?.id === userId) {
             logout();
          }
          return true;
      }
      addToast(`❌ Utilisateur non trouvé.`);
      return false;
  };
  
  // --- ADMIN CONTENT MANAGEMENT ---
  const addChapter = (chapterData: Omit<Chapter, 'id'>) => {
    const newChapter: Chapter = { ...chapterData, id: `chap_${Date.now()}` };
    setChapters(prev => [...prev, newChapter]);
    addToast("✅ Chapitre ajouté !");
  };

  const updateChapter = (chapterId: string, updates: Partial<Chapter>) => {
    setChapters(prev => prev.map(c => c.id === chapterId ? { ...c, ...updates } : c));
    addToast("✅ Chapitre mis à jour !");
  };

  const deleteChapter = (chapterId: string) => {
    setChapters(prev => prev.filter(c => c.id !== chapterId));
    addToast("🗑️ Chapitre supprimé.");
  };

  // --- ADMIN QUIZ MANAGEMENT ---
  const addQuiz = (quizData: Omit<Quiz, 'id'>) => {
    const newQuiz: Quiz = { ...quizData, id: `quiz_${Date.now()}` };
    setQuizzes(prev => [...prev, newQuiz]);
    addToast("✅ Quiz ajouté !");
  };

  const updateQuiz = (quizId: string, updates: Partial<Quiz>) => {
    // FIX: Replaced 'c' with 'q' to correctly return the unchanged quiz object.
    setQuizzes(prev => prev.map(q => q.id === quizId ? { ...q, ...updates } : q));
    addToast("✅ Quiz mis à jour !");
  };

  const deleteQuiz = (quizId: string) => {
    setQuizzes(prev => prev.filter(q => q.id !== quizId));
    addToast("🗑️ Quiz supprimé.");
  };

  // --- ADMIN MODERATION ---
  const resolveReport = (reportId: string) => {
    setReportedMessages(prev => prev.filter(r => r.id !== reportId));
    addToast("Signalement traité et archivé.");
  };

  const muteUser = (userId: string, hours: number) => {
    let userName = '';
    const muteEndDate = new Date(Date.now() + hours * 60 * 60 * 1000);
    setAllUsers(prev => prev.map(u => {
        if (u.id === userId) {
            userName = u.name;
            return { ...u, isMuted: true, muteEndDate };
        }
        return u;
    }));
    if (userName) {
        addToast(`🔇 ${userName} a été rendu muet pour ${hours}h.`);
    }
  };
  
  const unmuteUser = (userId: string) => {
    let userName = '';
    setAllUsers(prev => prev.map(u => {
        if (u.id === userId) {
            userName = u.name;
            return { ...u, isMuted: false, muteEndDate: new Date() };
        }
        return u;
    }));
    if (userName) {
        addToast(`🔊 ${userName} peut de nouveau parler.`);
    }
  };

  // --- ADMIN GUILD MANAGEMENT ---
  const adminDisbandGuild = (guildId: string): boolean => {
    const guildToDisband = allGuilds.find(g => g.id === guildId);
    if (!guildToDisband) {
        addToast("❌ Guilde non trouvée.");
        return false;
    }

    // Remove guildId from members
    const memberIds = allUsers.filter(u => u.guildId === guildId).map(u => u.id);
    setAllUsers(prev => prev.map(u => memberIds.includes(u.id) ? { ...u, guildId: null } : u));
    
    // Remove guild from list
    setAllGuilds(prev => prev.filter(g => g.id !== guildId));
    
    addToast(`🗑️ Guilde "${guildToDisband.name}" dissoute.`);
    return true;
};

  // --- ADMIN SETTINGS & DANGER ZONE ---
  const updateAppSettings = (newSettings: AppSettings) => {
      setAppSettings(newSettings);
      addToast("✅ Paramètres de l'application mis à jour !");
  };

  const adminResetAllStudentProgress = () => {
    setAllUsers(prevUsers => 
        prevUsers.map(user => {
            if (user.role === 'student') {
                return {
                    ...user,
                    level: 1, xp: 0, coins: 50, hp: 100, streak: 0, gradeIndex: 0,
                    consultedChapters: [], completedMissions: [], completedDailyMissionIds: [], ownedItems: [],
                    avatarId: null, duelWins: 0, duelLosses: 0, dailyDuelsPlayed: 0, duelHistory: [],
                    completedQuizzes: [],
                    quizPerformance: {},
                    unlockedAchievements: [],
                    activityHistory: [],
                    goatChallengeAttempts: {},
                    mindMaps: [],
                };
            }
            return user;
        })
    );
    addToast("💥 La progression de tous les élèves a été réinitialisée.");
};


  // Run mission check on userData changes that could trigger a mission
  useEffect(() => {
    if (userData && userData.role === 'student') {
      checkMissions(userData);
    }
  }, [userData, checkMissions]);


  // FIX: Exported missing states and functions.
  return { 
      userData, allUsers, toasts, chapters, quizzes, reportedMessages, allGuilds, appSettings,
      friendRequests, conversations, duelChallenges, weeklyEventProgress,
      login, logout, changePassword, forceChangePassword,
      adminCreateUser, adminResetPassword, adminUpdateUser, adminAddBonus, adminDeleteUser, adminCreateTeacher,
      addChapter, updateChapter, deleteChapter,
      addQuiz, updateQuiz, deleteQuiz,
      resolveReport, muteUser, unmuteUser, adminDisbandGuild,
      updateAppSettings, adminResetAllStudentProgress,
      addXp, addToast, consultChapter, buyItem, equipAvatar, equipTheme, completeDailyMission,
      equipAvatarFrame, equipProfileBanner, 
      completeDuel, createGuild, joinGuild, leaveGuild,
      completeQuiz, completeGoatChallenge, startGoatChallenge,
      sendFriendRequest, handleFriendRequest, removeFriend, sendPrivateMessage,
      sendDuelChallenge, handleDuelChallenge,
      saveMindMap, deleteMindMap,
      markWelcomeAsSeen,
      removeToast
  };
};
