
import React, { useState, useEffect, useMemo } from 'react';
import { Tab, Theme, UserData, Chapter, Quiz, ReportedMessage, Guild, AppSettings, QuizQuestion, MindMap, MindMapNode, WeeklyEvent, WeeklyEventProgress, DuelChallenge } from './types';
import { useUserData } from './hooks/useUserData';

import { LoginScreen } from './components/LoginScreen';
import { Header } from './components/Header';
import { ToastContainer } from './components/Toast';

import { CoursesScreen } from './components/screens/CoursesScreen';
import { MissionsScreen } from './components/screens/MissionsScreen';
import { ShopScreen } from './components/screens/ShopScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { PrivateChatScreen } from './components/screens/PrivateChatScreen';
import { QuizScreen } from './components/screens/QuizScreen';
import { QuizListScreen } from './components/screens/QuizListScreen';
import { GoatChallengeScreen } from './components/screens/GoatChallengeScreen';
import { GoatChallengeQuiz } from './components/screens/GoatChallengeQuiz';
import { RevisionsScreen } from './components/screens/RevisionsScreen';
import { MindMapsScreen } from './components/screens/MindMapsScreen';
import { MindMapEditor } from './components/screens/MindMapEditor';
import { AdminLoginScreen } from './components/admin/AdminLoginScreen';
import { AdminPanel } from './components/admin/AdminPanel';
import { GOAT_CHALLENGE_QUESTIONS, GOAT_CHALLENGE_SETTINGS, MOCK_WEEKLY_EVENT, THEMES } from './constants';
import { getWeekId } from './utils/auth';
import { BottomNav } from './components/BottomNav';
import { PublicProfileModal } from './components/PublicProfileModal';
import { AcademieScreen } from './components/screens/StatsScreen';
import { BattleRoyaleLobbyScreen } from './components/screens/BattleRoyaleLobbyScreen';
import { BattleRoyaleGameScreen } from './components/screens/BattleRoyaleGameScreen';
import { CommunityScreen, CommunitySubView } from './components/screens/CommunityScreen';
import { BattleRoyaleTrainingRoomsScreen } from './components/screens/BattleRoyaleTrainingRoomsScreen';

type ViewMode = 'student_app' | 'admin_login' | 'admin_panel';
type AcademieSubView = 'courses' | 'quizzes' | 'revisions' | 'mindmaps';
type DuelMode = '1v1' | 'br_lobby' | 'br_playing';

const ForcePasswordChangeModal: React.FC<{ onPasswordChanged: (newPassword: string) => boolean }> = ({ onPasswordChanged }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (newPassword.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }
        setError('');
        onPasswordChanged(newPassword);
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl w-full max-w-md text-center">
                <h2 className="text-2xl font-bold mb-2">🔒 Sécurise ton compte</h2>
                <p className="text-text-muted-light dark:text-text-muted-dark mb-6">Pour ta sécurité, tu dois changer ton mot de passe initial avant de continuer.</p>
                <div className="space-y-4 text-left">
                    <div>
                        <label className="block text-sm font-bold mb-1">Nouveau mot de passe</label>
                        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-3 py-2 rounded-md bg-background-light dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-text-light dark:text-text-dark" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Confirme le nouveau mot de passe</label>
                        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 rounded-md bg-background-light dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-text-light dark:text-text-dark" />
                    </div>
                </div>
                {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                <button onClick={handleSubmit} className="w-full mt-6 py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary-hover">Changer et continuer</button>
            </div>
        </div>
    );
};

const WelcomeModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl w-full max-w-lg text-center animate-scale-in">
                <h1 className="text-6xl mb-4">🎉</h1>
                <h2 className="text-3xl font-bold mb-2">Bienvenue sur GOAT of Maths !</h2>
                <p className="text-text-muted-light dark:text-text-muted-dark mb-6">Prêt à devenir le prochain GOAT des maths ? Voici comment ça marche :</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                    <div className="bg-background-light dark:bg-background-dark p-4 rounded-lg">
                        <p className="text-4xl">🎓</p><h3 className="font-bold mt-2">1. Apprends</h3><p className="text-sm">Explore les cours et les quiz dans l'<span className="font-bold text-primary">Académie</span>.</p>
                    </div>
                    <div className="bg-background-light dark:bg-background-dark p-4 rounded-lg">
                        <p className="text-4xl">🎯</p><h3 className="font-bold mt-2">2. Pratique</h3><p className="text-sm">Termine les <span className="font-bold text-primary">Missions</span> pour gagner de l'XP et des pièces.</p>
                    </div>
                    <div className="bg-background-light dark:bg-background-dark p-4 rounded-lg">
                        <p className="text-4xl">🛍️</p><h3 className="font-bold mt-2">3. Personnalise</h3><p className="text-sm">Dépense tes pièces dans la <span className="font-bold text-primary">Boutique</span> pour obtenir des avatars et des bonus !</p>
                    </div>
                </div>
                <button onClick={onClose} className="w-full max-w-xs mx-auto mt-8 py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary-hover">C'est parti !</button>
            </div>
        </div>
    );
};

const CourseViewerModal: React.FC<{ chapter: Chapter; isConsulted: boolean; onConsult: () => void; onClose: () => void; }> = ({ chapter, isConsulted, onConsult, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-scale-in">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{chapter.icon} {chapter.title}</h2>
                    <button onClick={onClose} className="text-3xl font-bold">&times;</button>
                </div>
                <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                    <p className="text-text-muted-light dark:text-text-muted-dark">{chapter.description}</p>
                    <p className="font-bold">Difficulté : {chapter.difficulty}</p>
                    <p className="font-bold">Récompenses : +{chapter.rewardXp} XP, +{chapter.rewardCoins} 🪙</p>
                    {chapter.pdfUrl ? (
                         <div className="text-center p-6 bg-slate-100 dark:bg-slate-800 rounded-lg">
                            <p className="text-5xl">📄</p>
                            <p className="font-bold mt-2">Support de cours disponible</p>
                            <a href={chapter.pdfUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block px-4 py-2 rounded-lg bg-red-500 text-white font-semibold">Ouvrir le PDF</a>
                        </div>
                    ) : (
                        <p className="text-center p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">Le contenu détaillé de ce cours sera bientôt disponible.</p>
                    )}
                </div>
                <button 
                    onClick={() => { if (!isConsulted) onConsult(); onClose(); }}
                    className={`w-full mt-6 py-3 rounded-lg font-bold text-white transition-colors ${isConsulted ? 'bg-green-600' : 'bg-primary hover:bg-primary-hover'}`}
                >
                    {isConsulted ? '✓ Marqué comme consulté' : 'Marquer comme consulté & Fermer'}
                </button>
            </div>
        </div>
    );
};


const App: React.FC = () => {
  // FIX: Destructured missing properties from useUserData hook.
  const { 
    userData, allUsers, toasts, chapters, quizzes, reportedMessages, allGuilds, appSettings,
    friendRequests, conversations, duelChallenges, weeklyEventProgress,
    login, logout, addXp, consultChapter, 
    buyItem, equipAvatar, equipTheme, equipAvatarFrame, equipProfileBanner, removeToast, completeDailyMission, 
    completeDuel, createGuild, joinGuild, leaveGuild,
    completeQuiz, completeGoatChallenge, startGoatChallenge,
    sendFriendRequest, handleFriendRequest, removeFriend, sendPrivateMessage,
    sendDuelChallenge, handleDuelChallenge,
    saveMindMap, deleteMindMap,
    changePassword, forceChangePassword,
    markWelcomeAsSeen,
    adminCreateUser, adminResetPassword, adminUpdateUser, adminAddBonus, adminDeleteUser, adminCreateTeacher,
    addChapter, updateChapter, deleteChapter,
    addQuiz, updateQuiz, deleteQuiz,
    resolveReport, muteUser, unmuteUser, adminDisbandGuild,
    updateAppSettings, adminResetAllStudentProgress
  } = useUserData();
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Accueil);
  const [communitySubView, setCommunitySubView] = useState<CommunitySubView>('friends');
  const [theme, setTheme] = useState<Theme>(
    (localStorage.getItem('goat-math-theme') as Theme) || Theme.Light
  );
  const [viewMode, setViewMode] = useState<ViewMode>('student_app');
  const [chattingWithId, setChattingWithId] = useState<string | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [goatChallengeQuiz, setGoatChallengeQuiz] = useState<QuizQuestion[] | null>(null);
  const [editingMindMap, setEditingMindMap] = useState<MindMap | null>(null);
  const [viewingChapter, setViewingChapter] = useState<Chapter | null>(null);
  const [viewingProfileId, setViewingProfileId] = useState<string | null>(null);
  const [previewedThemeId, setPreviewedThemeId] = useState<string | null>(null);
  const [academieSubView, setAcademieSubView] = useState<AcademieSubView | null>(null);
  const [duelMode, setDuelMode] = useState<DuelMode>('1v1');
  const [isBrTrainingRoomsActive, setBrTrainingRoomsActive] = useState(false);

  const handleNavigate = (tab: Tab) => {
    const communityTabs: Partial<Record<Tab, CommunitySubView>> = {
        [Tab.Friends]: 'friends',
        [Tab.Duels]: 'duels',
        [Tab.Guilds]: 'guilds',
        [Tab.Top]: 'top',
    };

    if (tab in communityTabs && communityTabs[tab]) {
        setActiveTab(Tab.Community);
        setCommunitySubView(communityTabs[tab]!);
    } else {
        setActiveTab(tab);
    }
  };

  useEffect(() => {
    const themeIdToApply = previewedThemeId || userData?.equippedThemeId;
    const root = document.documentElement;
    const allThemeKeys = new Set<string>();
    THEMES.forEach(t => Object.keys(t.variables).forEach(k => allThemeKeys.add(k)));
    allThemeKeys.forEach(key => root.style.removeProperty(key));
    
    const themeObject = THEMES.find(t => t.id === themeIdToApply);
    if (themeObject) {
        Object.entries(themeObject.variables).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });
    }
    
    if(themeObject && themeObject.isDark) {
        if (!document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.add('dark');
        }
    } else {
        if (theme === Theme.Dark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
    
    localStorage.setItem('goat-math-theme', theme);
}, [theme, previewedThemeId, userData?.equippedThemeId]);
  
  // Reset subviews if navigating away
  useEffect(() => {
    if (activeTab !== Tab.Community) {
        setChattingWithId(null);
        setDuelMode('1v1');
    }
    if (activeTab !== Tab.Academie) {
        setAcademieSubView(null);
    }
  }, [activeTab]);

  const toggleTheme = () => {
    setTheme(theme === Theme.Light ? Theme.Dark : Theme.Light);
  };
  
  const handleStudentLogin = (username: string, password: string) => {
    login(username, password, 'student');
  };
  
  const handleAdminLogin = (username: string, password: string) => {
    const success = login(username, password, 'admin');
    if (success) {
      setViewMode('admin_panel');
    }
  };

  const handleAdminLogout = () => {
    logout();
    setViewMode('admin_login');
  };

  const handleReturnToStudentApp = () => {
      logout();
      setViewMode('student_app');
  };

  const handleStartQuiz = (quizId: string) => {
    const quizToStart = quizzes.find(q => q.id === quizId);
    if (quizToStart) {
      setActiveQuiz(quizToStart);
    } else {
      alert("Erreur: Quiz non trouvé.");
    }
  };

  const handleQuizComplete = (results: { questionId: string, isCorrect: boolean }[]) => {
    if (!activeQuiz) return;
    completeQuiz(activeQuiz.id, results);
    setActiveQuiz(null);
  };
  
  const handleStartGoatChallenge = () => {
    const success = startGoatChallenge();
    if (success) {
        const shuffled = [...GOAT_CHALLENGE_QUESTIONS].sort(() => 0.5 - Math.random());
        setGoatChallengeQuiz(shuffled.slice(0, GOAT_CHALLENGE_SETTINGS.QUESTIONS_COUNT));
    }
  };

  const handleGoatChallengeComplete = (score: number, time: number) => {
      const weekId = getWeekId(new Date());
      completeGoatChallenge(score, time, weekId);
      setGoatChallengeQuiz(null);
  };

  const startReviewQuiz = () => {
    if (!userData) return;

    const performance = userData.quizPerformance || {};
    const allQuestions = quizzes.flatMap(q => q.questions);
    
    const weakQuestions = allQuestions
        .map(q => {
            const stats = performance[q.id] || { correct: 0, incorrect: 0 };
            const total = stats.correct + stats.incorrect;
            if (total === 0) return { ...q, weakness: 0.5 }; // Give unseen questions a chance
            const errorRate = stats.incorrect / total;
            return { ...q, weakness: errorRate };
        })
        .filter(q => q.weakness > 0)
        .sort((a, b) => b.weakness - a.weakness)
        .slice(0, 10);

    if (weakQuestions.length < 5) {
        alert("Fais plus de quiz pour identifier tes points faibles !");
        return;
    }
    
    const reviewQuiz: Quiz = {
        id: 'review_quiz',
        chapterId: 'review',
        title: 'Quiz de Révision Personnalisé',
        questions: weakQuestions,
    };

    setActiveQuiz(reviewQuiz);
};

  const handleNewMindMap = () => {
    const newMindMap: MindMap = {
        id: `mm_${Date.now()}`,
        title: 'Nouvelle carte mentale',
        nodes: [{ id: `node_${Date.now()}`, x: 150, y: 150, text: 'Idée centrale', color: '#ffffff' }],
        connections: [],
        background: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
    };
    setEditingMindMap(newMindMap);
  };
  
  const handleOpenMindMap = (mindMapId: string) => {
    const mindMap = userData?.mindMaps.find(m => m.id === mindMapId);
    if (mindMap) {
        setEditingMindMap(mindMap);
    }
  };
  
  const handleSaveMindMap = (mindMap: MindMap) => {
    saveMindMap(mindMap);
    setEditingMindMap(null);
  };
  
  const handleWelcomeClose = () => {
    if (userData) {
      markWelcomeAsSeen();
    }
  };

  const handleViewProfile = (userId: string) => {
      if (userId === userData?.id) {
          setActiveTab(Tab.Accueil);
          return;
      }
      setViewingProfileId(userId);
  };


  if (viewMode === 'admin_login') {
      return <AdminLoginScreen onLogin={handleAdminLogin} onReturnToStudentLogin={() => setViewMode('student_app')} />;
  }

  if (viewMode === 'admin_panel') {
      if (!userData || (userData.role !== 'teacher' && userData.role !== 'super_admin')) {
        // Not an admin, redirect to admin login
        return <AdminLoginScreen onLogin={handleAdminLogin} onReturnToStudentLogin={() => setViewMode('student_app')} />;
      }
      return <AdminPanel
                currentUser={userData}
                allUsers={allUsers}
                chapters={chapters}
                quizzes={quizzes}
                reportedMessages={reportedMessages}
                allGuilds={allGuilds}
                appSettings={appSettings}
                onCreateUser={adminCreateUser}
                onCreateTeacher={adminCreateTeacher}
                onResetPassword={adminResetPassword}
                onUpdateUser={adminUpdateUser}
                onAddBonus={adminAddBonus}
                onDeleteUser={adminDeleteUser}
                onAddChapter={addChapter}
                onUpdateChapter={updateChapter}
                onDeleteChapter={deleteChapter}
                onAddQuiz={addQuiz}
                onUpdateQuiz={updateQuiz}
                onDeleteQuiz={deleteQuiz}
                onResolveReport={resolveReport}
                onMuteUser={muteUser}
                // FIX: Corrected prop name from 'onUnmuteUser' to 'unmuteUser'.
                onUnmuteUser={unmuteUser}
                onAdminDisbandGuild={adminDisbandGuild}
                // FIX: Corrected prop name from 'onUpdateAppSettings' to 'updateAppSettings'.
                onUpdateAppSettings={updateAppSettings}
                // FIX: Pass the correct function 'adminResetAllStudentProgress' to the 'onResetAllStudentProgress' prop of AdminPanel.
                onResetAllStudentProgress={adminResetAllStudentProgress}
                onReturnToStudentApp={handleReturnToStudentApp} 
                onAdminLogout={handleAdminLogout}
             />;
  }

  // Default is student_app
  if (!userData || userData.role !== 'student') {
    return <LoginScreen onLogin={handleStudentLogin} onAdminClick={() => { logout(); setViewMode('admin_login'); }} />;
  }
  
  if (userData.mustChangePassword) {
      return <ForcePasswordChangeModal onPasswordChanged={forceChangePassword} />;
  }

  const chattingWith = useMemo(() => {
    if (!chattingWithId) return null;
    return allUsers.find(u => u.id === chattingWithId) || null;
  }, [chattingWithId, allUsers]);
  
  const currentConversation = useMemo(() => {
    if (!chattingWithId || !userData) return [];
    
    // Combine messages from both users' perspectives and filter for the current chat
    const allMessages = [
        ...(conversations[chattingWithId] || []),
        ...(conversations[userData.id] || [])
    ].filter(m => 
        (m.fromUserId === userData.id && m.toUserId === chattingWithId) || 
        (m.fromUserId === chattingWithId && m.toUserId === userData.id)
    );
    
    // Deduplicate and sort
    const uniqueMessages = Array.from(new Map(allMessages.map(item => [item.id, item])).values());
    return uniqueMessages.sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  }, [chattingWithId, conversations, userData]);

  const viewingProfileUser = useMemo(() => {
    if (!viewingProfileId) return null;
    return allUsers.find(u => u.id === viewingProfileId);
  }, [viewingProfileId, allUsers]);

  const AcademieWrapper: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
    <div>
        <div className="p-4 flex items-center gap-4 border-b border-border-light dark:border-border-dark">
            <button onClick={() => setAcademieSubView(null)} className="px-3 py-1 text-2xl rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                ←
            </button>
            <h2 className="text-2xl font-bold">{title}</h2>
        </div>
        {children}
    </div>
  );

  const renderActiveScreen = () => {
    // Full-screen views take priority
    if (activeQuiz) {
        return <QuizScreen quiz={activeQuiz} onComplete={handleQuizComplete} />;
    }
    if (goatChallengeQuiz) {
        return <GoatChallengeQuiz questions={goatChallengeQuiz} onComplete={handleGoatChallengeComplete} />;
    }
     if (isBrTrainingRoomsActive) {
        return <BattleRoyaleTrainingRoomsScreen userData={userData} allUsers={allUsers} onEnd={() => setBrTrainingRoomsActive(false)} />;
    }
    if (editingMindMap) {
        return (
            <main className="flex-grow container mx-auto max-w-6xl w-full p-2 h-[calc(100vh-128px)]">
                <MindMapEditor 
                    mindMap={editingMindMap} 
                    onSave={handleSaveMindMap} 
                    onBack={() => setEditingMindMap(null)}
                />
            </main>
        );
    }
     if (chattingWith) {
        return <PrivateChatScreen 
                    currentUser={userData} 
                    friend={chattingWith}
                    conversation={currentConversation}
                    onSendMessage={(text) => sendPrivateMessage(chattingWith.id, text)}
                    onBack={() => setChattingWithId(null)}
                />
    }
    if (duelMode === 'br_playing') {
        return <BattleRoyaleGameScreen mode="2v2" userData={userData} allUsers={allUsers} onEnd={() => setDuelMode('1v1')} />;
    }
    if (duelMode === 'br_lobby') {
        return <BattleRoyaleLobbyScreen onStartGame={() => setDuelMode('br_playing')} onBack={() => setDuelMode('1v1')} />;
    }
    
    // TAB-BASED RENDERING
    switch (activeTab) {
      case Tab.Accueil:
        return <HomeScreen
                    userData={userData}
                    quizzes={quizzes}
                    chapters={chapters}
                    allUsers={allUsers}
                    weeklyEvent={MOCK_WEEKLY_EVENT}
                    onNavigate={handleNavigate}
                    onChangePassword={changePassword}
                />;
      case Tab.Academie:
        switch(academieSubView) {
            case 'courses':
                return <AcademieWrapper title="📚 Cours"><CoursesScreen userData={userData} chapters={chapters} quizzes={quizzes} onViewChapter={setViewingChapter} onStartQuiz={handleStartQuiz} /></AcademieWrapper>;
            case 'quizzes':
                return <AcademieWrapper title="📝 Quiz"><QuizListScreen userData={userData} quizzes={quizzes} chapters={chapters} onStartQuiz={handleStartQuiz} /></AcademieWrapper>;
            case 'revisions':
                return <AcademieWrapper title="🧠 Révision"><RevisionsScreen userData={userData} chapters={chapters} quizzes={quizzes} onStartReviewQuiz={startReviewQuiz} /></AcademieWrapper>;
            case 'mindmaps':
                return <AcademieWrapper title="🗺️ Cartes Mentales"><MindMapsScreen userData={userData} onNewMindMap={handleNewMindMap} onOpenMindMap={handleOpenMindMap} onDeleteMindMap={deleteMindMap} /></AcademieWrapper>;
            default:
                return <AcademieScreen onNavigate={setAcademieSubView} />;
        }
      case Tab.Missions:
        return <MissionsScreen userData={userData} onCompleteMission={completeDailyMission} />;
      case Tab.Shop:
        return <ShopScreen userData={userData} onBuyItem={buyItem} onEquipAvatar={equipAvatar} onEquipTheme={equipTheme} onEquipAvatarFrame={equipAvatarFrame} onEquipProfileBanner={equipProfileBanner} onPreviewTheme={setPreviewedThemeId} />;
      case Tab.Community:
        return <CommunityScreen
            userData={userData}
            allUsers={allUsers}
            friendRequests={friendRequests}
            duelChallenges={duelChallenges}
            weeklyEvent={MOCK_WEEKLY_EVENT}
            weeklyEventProgress={weeklyEventProgress}
            onStartChat={setChattingWithId}
            onSendRequest={sendFriendRequest}
            onHandleRequest={handleFriendRequest}
            onRemoveFriend={removeFriend}
            onSendDuelChallenge={sendDuelChallenge}
            onHandleDuelChallenge={handleDuelChallenge}
            onCompleteDuel={completeDuel}
            onViewProfile={handleViewProfile}
            onEnterBattleRoyale={() => setDuelMode('br_lobby')}
            onEnterBattleRoyaleTraining={() => setBrTrainingRoomsActive(true)}
            onCreateGuild={createGuild}
            onJoinGuild={joinGuild}
            onLeaveGuild={leaveGuild}
            activeSubView={communitySubView}
            setActiveSubView={setCommunitySubView}
        />;
      case Tab.GoatChallenge:
        return <GoatChallengeScreen
                    userData={userData}
                    allUsers={allUsers}
                    onStartChallenge={handleStartGoatChallenge}
                />;
      default:
        return <HomeScreen
                    userData={userData}
                    quizzes={quizzes}
                    chapters={chapters}
                    allUsers={allUsers}
                    weeklyEvent={MOCK_WEEKLY_EVENT}
                    onNavigate={handleNavigate}
                    onChangePassword={changePassword}
                />;
    }
  };


  const mainContent = renderActiveScreen();
  // Don't render header/nav if in a special screen state (like quiz)
  const isFullScreen = !!(activeQuiz || goatChallengeQuiz || chattingWith || editingMindMap || duelMode === 'br_playing' || duelMode === 'br_lobby' || isBrTrainingRoomsActive);
  
  if (isFullScreen) {
      return (
         <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark font-sans text-text-light dark:text-text-dark">
            <main className="flex-grow container mx-auto max-w-6xl w-full h-full">
                {mainContent}
            </main>
            <ToastContainer toasts={toasts} removeToast={removeToast} />
         </div>
      );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-sans text-text-light dark:text-text-dark">
      {userData && !userData.hasSeenWelcomeModal && <WelcomeModal onClose={handleWelcomeClose} />}
      {viewingChapter && userData && (
        <CourseViewerModal 
          chapter={viewingChapter}
          isConsulted={userData.consultedChapters.includes(viewingChapter.id)}
          onConsult={() => consultChapter(viewingChapter.id, viewingChapter.rewardXp, viewingChapter.rewardCoins)}
          onClose={() => setViewingChapter(null)}
        />
      )}
      {viewingProfileUser && userData && (
          <PublicProfileModal 
              userToView={viewingProfileUser}
              currentUser={userData}
              quizzes={quizzes}
              friendRequests={friendRequests}
              onClose={() => setViewingProfileId(null)}
              onAddFriend={sendFriendRequest}
              onStartDuel={() => { /* Not implemented yet */ alert("Bientôt disponible !"); }}
          />
      )}

      <Header userData={userData} theme={theme} onToggleTheme={toggleTheme} onLogout={logout} />
      
      <main className="flex-grow container mx-auto max-w-6xl w-full pb-20 animate-fade-in">
         {mainContent}
      </main>

      <BottomNav activeTab={activeTab} onNavigate={handleNavigate} />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default App;
