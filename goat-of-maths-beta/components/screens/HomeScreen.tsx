import React, { useState, useMemo, useEffect } from 'react';
import { UserData, Quiz, Chapter, Tab, WeeklyEvent } from '../../types';
import { GRADES, SHOP_ITEMS, DAILY_MISSIONS, DUEL_CONSTANTS } from '../../constants';
import { getWeekId } from '../../utils/auth';

// --- Components from DashboardScreen.tsx ---

interface PasswordStrengthIndicatorProps {
  password?: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password = '' }) => {
  const getStrength = () => {
    if (password.length === 0) return { label: '', color: 'bg-transparent', width: '0%' };
    if (password.length < 6) return { label: 'Faible', color: 'bg-red-500', width: '33%' };
    if (password.length < 8) return { label: 'Moyen', color: 'bg-yellow-500', width: '66%' };
    return { label: 'Fort', color: 'bg-green-500', width: '100%' };
  };

  const { label, color, width } = getStrength();

  return (
    <div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
        <div className={`h-2 rounded-full transition-all ${color}`} style={{ width }} />
      </div>
      <p className={`text-xs text-right mt-1 ${
          label === 'Faible' ? 'text-red-500' 
        : label === 'Moyen' ? 'text-yellow-500' 
        : label === 'Fort' ? 'text-green-500' 
        : ''}`}>{label}</p>
    </div>
  );
};

interface ChangePasswordModalProps {
    onClose: () => void;
    onChangePassword: (current: string, newPass: string) => boolean;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ onClose, onChangePassword }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        setError('');
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('Tous les champs sont requis.');
            return;
        }
        if (newPassword.length < 6) {
            setError('Le nouveau mot de passe doit faire au moins 6 caractères.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Les nouveaux mots de passe ne correspondent pas.');
            return;
        }
        
        const success = onChangePassword(currentPassword, newPassword);
        if (success) {
            onClose();
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">🔒 Changer mon mot de passe</h2>
                <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-bold mb-1">Mot de passe actuel</label>
                        <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full px-3 py-2 rounded-md bg-background-light dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-text-light dark:text-text-dark" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Nouveau mot de passe</label>
                        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-3 py-2 rounded-md bg-background-light dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-text-light dark:text-text-dark" />
                        <PasswordStrengthIndicator password={newPassword} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Confirmer le nouveau mot de passe</label>
                        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 rounded-md bg-background-light dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-text-light dark:text-text-dark" />
                    </div>
                </div>
                {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
                <div className="flex gap-4 mt-6">
                    <button onClick={onClose} className="w-full py-3 rounded-lg font-bold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600">Annuler</button>
                    <button onClick={handleSubmit} className="w-full py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary-hover">Changer</button>
                </div>
            </div>
        </div>
    )
}

// --- Component from original HomeScreen.tsx ---

const NextStepCard: React.FC<{ nextStep: any }> = ({ nextStep }) => {
    if (!nextStep) return null;
    return (
        <div className="bg-gradient-to-r from-primary to-blue-700 text-white rounded-2xl shadow-xl p-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="text-6xl flex-shrink-0">🚀</div>
            <div className="flex-grow text-center sm:text-left">
                <h3 className="text-2xl font-bold">{nextStep.title}</h3>
                <p className="mt-1 text-blue-200">{nextStep.description}</p>
            </div>
            {nextStep.action && nextStep.buttonText && (
                <button
                    onClick={nextStep.action}
                    className="w-full sm:w-auto flex-shrink-0 px-6 py-3 mt-4 sm:mt-0 rounded-lg bg-white text-primary font-bold hover:bg-blue-100 transition-colors shadow-md"
                >
                    {nextStep.buttonText}
                </button>
            )}
        </div>
    );
};

const WeeklyEventCard: React.FC<{ event: WeeklyEvent, onNavigate: (tab: Tab) => void }> = ({ event, onNavigate }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const endDate = new Date(event.endDate).getTime();
            const distance = endDate - now;
            if (distance < 0) {
                setTimeLeft('Terminé');
                clearInterval(interval);
                return;
            }
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            setTimeLeft(`${days}j ${hours}h restants`);
        }, 1000);
        return () => clearInterval(interval);
    }, [event.endDate]);

    return (
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-2xl shadow-xl p-6 flex items-center gap-6">
            <div className="text-6xl flex-shrink-0">{event.icon}</div>
            <div className="flex-grow">
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold">{event.title}</h3>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold">{timeLeft}</span>
                </div>
                <p className="mt-1 text-indigo-200">{event.description}</p>
            </div>
            <button onClick={() => onNavigate(Tab.Top)} className="px-6 py-3 rounded-lg bg-white text-indigo-600 font-bold hover:bg-indigo-100 transition-colors shadow-md">
                Voir le classement
            </button>
        </div>
    );
};


// --- Merged HomeScreen Component ---

interface HomeScreenProps {
    userData: UserData;
    quizzes: Quiz[];
    chapters: Chapter[];
    allUsers: UserData[];
    weeklyEvent: WeeklyEvent | null;
    onNavigate: (tab: Tab) => void;
    onChangePassword: (current: string, newPass: string) => boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ userData, quizzes, chapters, allUsers, weeklyEvent, onNavigate, onChangePassword }) => {
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const currentGrade = GRADES[userData.gradeIndex];
    const xpForNextLevel = currentGrade.xpPerLevel;
    const xpPercentage = Math.min((userData.xp / xpForNextLevel) * 100, 100);

    const friends = useMemo(() => {
        return allUsers.filter(u => userData.friendIds.includes(u.id) && u.lastLogin && (new Date().getTime() - new Date(u.lastLogin).getTime()) < 300000); // Online in last 5 mins
    }, [allUsers, userData.friendIds]);

    const uncompletedDailyMissions = useMemo(() => {
        return DAILY_MISSIONS.filter(m => !userData.completedDailyMissionIds.includes(m.id)).slice(0, 2);
    }, [userData.completedDailyMissionIds]);

    const nextStep = useMemo(() => {
        const unreadChapter = chapters.find(c => !userData.consultedChapters.includes(c.id));
        if (unreadChapter) {
            return {
                title: 'Prochaine étape : Apprendre',
                description: `Le chapitre "${unreadChapter.title}" est disponible. Prêt à l'étudier ?`,
                buttonText: 'Aller à l\'Académie',
                action: () => onNavigate(Tab.Academie),
            };
        }

        const consultedChapterIds = new Set(userData.consultedChapters);
        const completedQuizIds = new Set(userData.completedQuizzes.map(cq => cq.quizId));
        const incompleteQuiz = quizzes.find(q => consultedChapterIds.has(q.chapterId) && !completedQuizIds.has(q.id));
        if (incompleteQuiz) {
            const chapterForQuiz = chapters.find(c => c.id === incompleteQuiz.chapterId);
            return {
                title: 'Prochaine étape : Pratiquer',
                description: `Tu as étudié "${chapterForQuiz?.title}". Teste tes connaissances avec le quiz !`,
                buttonText: 'Aller à l\'Académie',
                action: () => onNavigate(Tab.Academie),
            };
        }

        if (userData.dailyDuelsPlayed < DUEL_CONSTANTS.MAX_DAILY_DUELS) {
            return {
                title: 'Prochaine étape : Défier',
                description: 'Mesure-toi à tes camarades dans un duel rapide et gagne des récompenses !',
                buttonText: 'Lancer un duel',
                action: () => onNavigate(Tab.Duels),
            };
        }

        const currentWeekId = getWeekId(new Date());
        const hasAttemptedChallenge = !!userData.goatChallengeAttempts?.[currentWeekId];
        if (!hasAttemptedChallenge) {
            return {
                title: 'Prochaine étape : Le Défi Ultime',
                description: "Es-tu prêt à relever le Défi du GOAT de cette semaine ? Une seule tentative !",
                buttonText: 'Voir le défi',
                action: () => onNavigate(Tab.GoatChallenge),
            };
        }

        return {
            title: 'Mission accomplie !',
            description: "Tu es à jour sur tous les chapitres et quiz. Excellent travail, continue comme ça !",
            buttonText: null,
            action: null,
        };
    }, [userData, chapters, quizzes, onNavigate]);

    const avatarItem = userData.avatarId ? SHOP_ITEMS.find(item => item.id === userData.avatarId) : null;
    const frameItem = userData.equippedAvatarFrameId ? SHOP_ITEMS.find(item => item.id === userData.equippedAvatarFrameId) : null;
    const bannerItem = userData.equippedProfileBannerId ? SHOP_ITEMS.find(item => item.id === userData.equippedProfileBannerId) : null;
    const frameClass = frameItem?.value || 'border-transparent';

    return (
        <div className="p-4 md:p-6 space-y-6 animate-fade-in">
            {showPasswordModal && <ChangePasswordModal onChangePassword={onChangePassword} onClose={() => setShowPasswordModal(false)} />}
            
            {/* Profile Card */}
            <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow-lg overflow-hidden relative border border-border-light dark:border-border-dark">
                {bannerItem && (
                    <div className="absolute inset-0 h-32 bg-cover bg-center z-0" style={{ backgroundImage: `url(${bannerItem.value})` }}>
                        <div className="absolute inset-0 bg-black/30"></div>
                    </div>
                )}
                <div className="p-6 relative z-10">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-5">
                          <div className={`flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-white text-4xl font-bold ring-4 ring-card-light dark:ring-card-dark border-4 ${frameClass} transition-all`}>
                            {avatarItem ? (
                              <span className="text-5xl">{avatarItem.icon}</span>
                            ) : (
                              userData.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className={`flex-grow pt-2 ${bannerItem ? 'text-white' : ''}`}>
                            <h2 className={`text-2xl sm:text-3xl font-bold ${bannerItem ? 'text-white' : 'text-text-light dark:text-text-dark'}`}>{userData.name}</h2>
                            <p className={`text-md font-semibold mt-1 ${bannerItem ? 'text-blue-200' : 'text-primary dark:text-primary-light'}`}>
                              {currentGrade.icon} {currentGrade.name} - Niveau {userData.level}/{currentGrade.levelsToComplete}
                            </p>
                          </div>
                        </div>
                         <button onClick={() => setShowPasswordModal(true)} className={`flex-shrink-0 px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${bannerItem ? 'bg-black/30 text-white hover:bg-black/50' : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
                            🔒 Changer mdp
                        </button>
                    </div>
                    <div className="mt-5">
                        <div className={`flex justify-between items-center text-sm font-medium ${bannerItem ? 'text-slate-200' : 'text-text-muted-light dark:text-text-muted-dark'} mb-1`}>
                          <span>Progression vers niveau suivant</span>
                          <span className={`font-bold ${bannerItem ? 'text-white' : 'text-primary dark:text-primary-light'}`}>{userData.xp} / {xpForNextLevel} XP</span>
                        </div>
                        <div className={`w-full rounded-full h-3 overflow-hidden ${bannerItem ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700'}`}>
                          <div 
                            className="bg-gradient-to-r from-primary-light to-primary h-full rounded-full transition-all duration-500 ease-out" 
                            style={{ width: `${xpPercentage}%` }}>
                          </div>
                        </div>
                      </div>
                </div>
            </div>

            {/* Weekly Event */}
            {weeklyEvent && <WeeklyEventCard event={weeklyEvent} onNavigate={onNavigate} />}

            {/* Next Step */}
            <NextStepCard nextStep={nextStep} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Missions */}
                <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow p-5">
                   <h3 className="font-bold mb-3">🎯 Missions Rapides</h3>
                    <div className="space-y-3">
                        {uncompletedDailyMissions.length > 0 ? uncompletedDailyMissions.map(m => (
                            <div key={m.id} className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                              <span className="text-2xl">{m.icon}</span>
                              <div className="flex-grow"><p className="text-sm font-semibold">{m.title}</p><p className="text-xs text-text-muted-light dark:text-text-muted-dark">+ {m.rewardXp} XP</p></div>
                              <button onClick={() => onNavigate(Tab.Missions)} className="px-3 py-1.5 rounded-full bg-primary text-white text-xs font-bold">Go !</button>
                            </div>
                        )) : <p className="text-sm text-center text-text-muted-light dark:text-text-muted-dark py-4">Toutes les missions du jour sont terminées ! 🎉</p>}
                    </div>
                </div>
                
                {/* Active Friends */}
                <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow p-5">
                   <h3 className="font-bold mb-3">👥 Amis en ligne</h3>
                   {friends.length > 0 ? (
                        <div className="flex items-center gap-3">
                            {friends.slice(0, 5).map(friend => {
                                const friendAvatar = friend.avatarId ? SHOP_ITEMS.find(i => i.id === friend.avatarId) : null;
                                return (
                                    <div key={friend.id} className="flex flex-col items-center">
                                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-2xl" title={friend.name}>
                                            {friendAvatar ? friendAvatar.icon : friend.name.charAt(0)}
                                        </div>
                                        <p className="text-xs mt-1 truncate w-12 text-center">{friend.name}</p>
                                    </div>
                                );
                            })}
                            {friends.length > 5 && <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold">+{friends.length - 5}</div>}
                        </div>
                   ) : (
                       <p className="text-sm text-center text-text-muted-light dark:text-text-muted-dark py-4">Aucun ami en ligne en ce moment.</p>
                   )}
                </div>
            </div>
        </div>
    );
};
