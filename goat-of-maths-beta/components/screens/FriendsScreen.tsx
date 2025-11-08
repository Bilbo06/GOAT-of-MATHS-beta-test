import React, { useState, useMemo } from 'react';
import { UserData, FriendRequest } from '../../types';
import { SHOP_ITEMS, GRADES } from '../../constants';

type FriendView = 'list' | 'add' | 'requests';

interface DuelChallengeModalProps {
    friend: UserData;
    currentUser: UserData;
    onChallenge: (wager: number) => void;
    onClose: () => void;
}

const DuelChallengeModal: React.FC<DuelChallengeModalProps> = ({ friend, currentUser, onChallenge, onClose }) => {
    const [wager, setWager] = useState(20);
    const canAfford = currentUser.coins >= wager;

    const handleChallenge = () => {
        if (canAfford) {
            onChallenge(wager);
            onClose();
        } else {
            alert("Tu n'as pas assez de MathCoins pour ce pari !");
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 w-full max-w-sm text-center animate-scale-in" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-2">⚔️ Défier {friend.name}</h2>
                <p className="text-text-muted-light dark:text-text-muted-dark mb-6">Propose un pari en MathCoins. Le gagnant remporte tout !</p>
                
                <div className="mb-4">
                    <label className="font-bold">Montant du pari :</label>
                    <div className="flex items-center justify-center gap-2 mt-2">
                        <button onClick={() => setWager(w => Math.max(10, w - 10))} className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 font-bold">-</button>
                        <input 
                            type="number" 
                            value={wager} 
                            onChange={e => setWager(parseInt(e.target.value) || 0)} 
                            className="w-24 text-center text-2xl font-bold bg-transparent"
                        />
                        <button onClick={() => setWager(w => Math.min(1000, w + 10))} className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 font-bold">+</button>
                    </div>
                    <p className={`text-sm mt-2 ${canAfford ? 'text-green-500' : 'text-red-500'}`}>
                        Ton solde : {currentUser.coins} 🪙
                    </p>
                </div>

                <div className="flex gap-4 mt-6">
                    <button onClick={onClose} className="w-full py-3 rounded-lg font-bold bg-slate-200 dark:bg-slate-700">Annuler</button>
                    <button onClick={handleChallenge} disabled={!canAfford} className="w-full py-3 rounded-lg bg-primary text-white font-bold disabled:bg-slate-400">Envoyer le défi</button>
                </div>
            </div>
        </div>
    );
}


interface FriendsScreenProps {
  userData: UserData;
  allUsers: UserData[];
  friendRequests: FriendRequest[];
  onStartChat: (friendId: string) => void;
  onSendRequest: (toUserId: string) => void;
  onHandleRequest: (requestId: string, accept: boolean) => void;
  onRemoveFriend: (friendId: string) => void;
  onSendDuelChallenge: (toUserId: string, wager: number) => void;
}

const FriendCard: React.FC<{
    friendData: UserData; 
    hasUnreadMessages: boolean; 
    onChat: () => void;
    onRemove: () => void;
    onChallenge: () => void;
}> = ({ friendData, hasUnreadMessages, onChat, onRemove, onChallenge }) => {
    const avatarItem = friendData.avatarId ? SHOP_ITEMS.find(item => item.id === friendData.avatarId) : null;
    const grade = GRADES[friendData.gradeIndex];
    
    const lastLogin = useMemo(() => {
        if (!friendData.lastLogin) return { text: 'Hors ligne', color: 'bg-slate-500' };
        const seconds = Math.floor((new Date().getTime() - new Date(friendData.lastLogin).getTime()) / 1000);
        if (seconds < 300) return { text: 'En ligne', color: 'bg-green-500' };
        return { text: 'Hors ligne', color: 'bg-slate-500' };
    }, [friendData.lastLogin]);

    return (
        <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow-sm p-4 border border-border-light dark:border-border-dark flex items-center gap-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="relative flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-white text-2xl font-bold ring-2 ring-white/50 dark:ring-slate-900/50">
                   {avatarItem ? <span className="text-4xl">{avatarItem.icon}</span> : friendData.name.charAt(0)}
                </div>
                <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-card-light dark:border-card-dark ${lastLogin.color}`} />
            </div>
            <div className="flex-grow">
                <h3 className="text-lg font-bold text-text-light dark:text-text-dark">{friendData.name}</h3>
                <p className="text-sm text-primary dark:text-primary-light font-semibold">{grade.icon} {grade.name} - Nv. {friendData.level}</p>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={onChat} className="relative w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-2xl">
                    💬
                    {hasUnreadMessages && <div className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-card-light dark:border-card-dark" />}
                </button>
                 <button onClick={onChallenge} className="w-10 h-10 flex items-center justify-center rounded-lg bg-amber-400/10 text-amber-500 hover:bg-amber-400/20 transition-colors text-2xl">
                    ⚔️
                </button>
                 <button onClick={onRemove} className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors text-2xl">
                    🗑️
                </button>
            </div>
        </div>
    );
};

export const FriendsScreen: React.FC<FriendsScreenProps> = ({ userData, allUsers, friendRequests, onStartChat, onSendRequest, onHandleRequest, onRemoveFriend, onSendDuelChallenge }) => {
    const [view, setView] = useState<FriendView>('list');
    const [searchQuery, setSearchQuery] = useState('');
    const [challengingFriend, setChallengingFriend] = useState<UserData | null>(null);

    const friends = useMemo(() => {
        return allUsers.filter(u => userData.friendIds.includes(u.id));
    }, [allUsers, userData.friendIds]);

    const incomingRequests = useMemo(() => {
        return friendRequests.filter(r => r.toUserId === userData.id);
    }, [friendRequests, userData.id]);

    const outgoingRequests = useMemo(() => {
        return friendRequests.filter(r => r.fromUserId === userData.id);
    }, [friendRequests, userData.id]);

    const potentialFriends = useMemo(() => {
        if (searchQuery.trim().length < 2) return [];
        const allRequestUserIds = new Set(friendRequests.flatMap(r => [r.fromUserId, r.toUserId]));
        
        return allUsers.filter(u => 
            u.id !== userData.id &&
            !userData.friendIds.includes(u.id) &&
            !allRequestUserIds.has(u.id) &&
            u.role === 'student' &&
            u.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, allUsers, userData, friendRequests]);
    
    const renderView = () => {
        switch (view) {
            case 'list':
                return friends.length > 0 ? (
                     <div className="space-y-3">
                        {friends.map(friend => <FriendCard key={friend.id} friendData={friend} hasUnreadMessages={false} onChat={() => onStartChat(friend.id)} onRemove={() => onRemoveFriend(friend.id)} onChallenge={() => setChallengingFriend(friend)} />)}
                    </div>
                ) : (
                    <div className="text-center py-10 text-text-muted-light dark:text-text-muted-dark">
                        <p className="text-6xl mb-4">🤷</p>
                        <h3 className="text-xl font-semibold">Tu n'as pas encore d'amis</h3>
                        <p>Va dans l'onglet "Ajouter" pour trouver tes camarades !</p>
                    </div>
                );
            case 'add':
                return (
                    <div>
                        <div className="relative mb-6">
                             <input type="text" placeholder="Rechercher un élève..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-4 pr-4 py-3 text-base rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-border-light dark:border-border-dark focus:ring-2 focus:ring-primary focus:outline-none"/>
                        </div>
                        <div className="space-y-3">
                            {potentialFriends.map(user => (
                                <div key={user.id} className="bg-card-light dark:bg-card-dark p-3 rounded-lg flex items-center justify-between">
                                    <p className="font-bold">{user.name} <span className="font-normal text-text-muted-light dark:text-text-muted-dark">- Nv. {user.level}</span></p>
                                    <button onClick={() => onSendRequest(user.id)} className="px-4 py-2 rounded-lg bg-green-500 text-white font-bold text-sm">Ajouter</button>
                                </div>
                            ))}
                        </div>
                    </div>
                );
             case 'requests':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-bold text-lg mb-2">Demandes reçues ({incomingRequests.length})</h3>
                            {incomingRequests.length > 0 ? (
                                <div className="space-y-2">
                                    {incomingRequests.map(req => (
                                        <div key={req.id} className="bg-card-light dark:bg-card-dark p-3 rounded-lg flex items-center justify-between">
                                            <p><span className="font-bold">{req.fromUserName}</span> (Nv. {req.fromUserLevel})</p>
                                            <div className="flex gap-2">
                                                <button onClick={() => onHandleRequest(req.id, true)} className="px-3 py-1 bg-green-500 text-white rounded">Accepter</button>
                                                <button onClick={() => onHandleRequest(req.id, false)} className="px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded">Refuser</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Aucune nouvelle demande.</p>}
                        </div>
                         <div>
                            <h3 className="font-bold text-lg mb-2">Demandes envoyées ({outgoingRequests.length})</h3>
                             {outgoingRequests.length > 0 ? (
                                <div className="space-y-2">
                                    {outgoingRequests.map(req => (
                                        <div key={req.id} className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg flex items-center justify-between">
                                            <p>Demande envoyée à <span className="font-bold">{allUsers.find(u => u.id === req.toUserId)?.name}</span></p>
                                            <span className="text-sm text-text-muted-light dark:text-text-muted-dark">En attente...</span>
                                        </div>
                                    ))}
                                </div>
                            ) : <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Vous n'avez envoyé aucune demande.</p>}
                        </div>
                    </div>
                );
        }
    };
    
    return (
        <div className="p-4 md:p-6">
            {challengingFriend && (
                <DuelChallengeModal 
                    friend={challengingFriend} 
                    currentUser={userData} 
                    onClose={() => setChallengingFriend(null)} 
                    onChallenge={(wager) => onSendDuelChallenge(challengingFriend.id, wager)}
                />
            )}
            <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-text-light dark:text-text-dark">👥 Mes Amis</h2>
                <p className="text-md text-text-muted-light dark:text-text-muted-dark mt-1">Discute et suis la progression de tes camarades</p>
            </div>
            
            <div className="flex justify-center gap-2 mb-8 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-full">
                <button onClick={() => setView('list')} className={`w-1/3 py-2 rounded-full font-semibold ${view === 'list' ? 'bg-white dark:bg-slate-700 shadow' : ''}`}>Mes Amis ({friends.length})</button>
                <button onClick={() => setView('add')} className={`w-1/3 py-2 rounded-full font-semibold ${view === 'add' ? 'bg-white dark:bg-slate-700 shadow' : ''}`}>Ajouter</button>
                <button onClick={() => setView('requests')} className={`w-1/3 py-2 rounded-full font-semibold relative ${view === 'requests' ? 'bg-white dark:bg-slate-700 shadow' : ''}`}>
                    Demandes
                    {incomingRequests.length > 0 && <span className="absolute top-1 right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{incomingRequests.length}</span>}
                </button>
            </div>

            <div className="max-w-3xl mx-auto">
                {renderView()}
            </div>
        </div>
    );
};
