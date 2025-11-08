import React, { useMemo } from 'react';
import { UserData, Quiz, FriendRequest } from '../types';
import { GRADES, SHOP_ITEMS, ACHIEVEMENTS } from '../constants';

interface PublicProfileModalProps {
    userToView: UserData;
    currentUser: UserData;
    quizzes: Quiz[];
    friendRequests: FriendRequest[];
    onClose: () => void;
    onAddFriend: (userId: string) => void;
    onStartDuel: (userId: string) => void;
}

const StatCard: React.FC<{ icon: string; label: string; value: string | number; }> = ({ icon, label, value }) => (
    <div className="bg-background-light dark:bg-background-dark p-4 rounded-xl border border-border-light dark:border-border-dark text-center">
        <p className="text-3xl">{icon}</p>
        <p className="text-xl font-bold mt-1">{value}</p>
        <p className="text-xs text-text-muted-light dark:text-text-muted-dark">{label}</p>
    </div>
);

export const PublicProfileModal: React.FC<PublicProfileModalProps> = ({ userToView, currentUser, quizzes, friendRequests, onClose, onAddFriend, onStartDuel }) => {

    const grade = GRADES[userToView.gradeIndex];
    const avatar = SHOP_ITEMS.find(item => item.id === userToView.avatarId);

    const perfectQuizzes = useMemo(() => {
        return userToView.completedQuizzes.filter(cq => {
            const quiz = quizzes.find(q => q.id === cq.quizId);
            return quiz && cq.bestScore === quiz.questions.length;
        }).length;
    }, [userToView.completedQuizzes, quizzes]);
    
    const achievementsToShow = useMemo(() => {
        return ACHIEVEMENTS.filter(a => userToView.unlockedAchievements.includes(a.id)).slice(0, 5);
    }, [userToView.unlockedAchievements]);
    
    const friendshipStatus = useMemo(() => {
        if (currentUser.friendIds.includes(userToView.id)) return 'friends';
        if (friendRequests.some(r => (r.fromUserId === currentUser.id && r.toUserId === userToView.id))) return 'request_sent';
        if (friendRequests.some(r => (r.fromUserId === userToView.id && r.toUserId === currentUser.id))) return 'request_received';
        return 'none';
    }, [currentUser, userToView, friendRequests]);

    const renderFriendButton = () => {
        switch (friendshipStatus) {
            case 'friends':
                return <button disabled className="w-full py-3 rounded-lg font-bold bg-slate-200 dark:bg-slate-700 text-text-muted-light dark:text-text-muted-dark cursor-not-allowed">✓ Amis</button>;
            case 'request_sent':
                return <button disabled className="w-full py-3 rounded-lg font-bold bg-slate-200 dark:bg-slate-700 text-text-muted-light dark:text-text-muted-dark cursor-not-allowed">Demande envoyée</button>;
             case 'request_received':
                return <button disabled className="w-full py-3 rounded-lg font-bold bg-slate-200 dark:bg-slate-700 text-text-muted-light dark:text-text-muted-dark cursor-not-allowed">Demande reçue</button>;
            default:
                return <button onClick={() => onAddFriend(userToView.id)} className="w-full py-3 rounded-lg font-bold bg-green-500 text-white hover:bg-green-600">🤝 Ajouter en ami</button>;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 w-full max-w-md relative animate-scale-in" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-3 right-3 text-3xl font-bold text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark">&times;</button>

                {/* Header */}
                <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-white text-5xl font-bold ring-4 ring-white dark:ring-card-dark">
                        {avatar?.icon || userToView.name.charAt(0)}
                    </div>
                    <h2 className="text-3xl font-bold mt-3 text-text-light dark:text-text-dark">{userToView.name}</h2>
                    <p className="text-md text-primary dark:text-primary-light font-semibold">{grade.icon} {grade.name} - Niveau {userToView.level}</p>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mt-6">
                    <StatCard icon="📚" label="Chapitres lus" value={userToView.consultedChapters.length} />
                    <StatCard icon="⭐" label="Quiz parfaits" value={perfectQuizzes} />
                    <StatCard icon="⚔️" label="Duels gagnés" value={userToView.duelWins} />
                </div>
                
                {/* Achievements */}
                {achievementsToShow.length > 0 && (
                    <div className="mt-6">
                         <h3 className="font-bold text-center text-text-muted-light dark:text-text-muted-dark mb-2">Succès Récents</h3>
                         <div className="flex justify-center flex-wrap gap-2">
                             {achievementsToShow.map(ach => (
                                 <div key={ach.id} title={ach.title} className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/50 border border-amber-300 dark:border-amber-700">
                                     <span className="text-2xl">{ach.icon}</span>
                                 </div>
                             ))}
                         </div>
                    </div>
                )}
                
                {/* Actions */}
                <div className="flex gap-3 mt-6 pt-6 border-t border-border-light dark:border-border-dark">
                    {renderFriendButton()}
                    <button onClick={() => onStartDuel(userToView.id)} className="w-full py-3 rounded-lg font-bold bg-primary text-white hover:bg-primary-hover">⚔️ Lancer un duel</button>
                </div>

            </div>
        </div>
    );
};