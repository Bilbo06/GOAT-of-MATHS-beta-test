import React, { useState, useMemo } from 'react';
import { UserData, LeaderboardEntry } from '../../types';
import { LEADERBOARD_DATA, SHOP_ITEMS } from '../../constants';

interface TopScreenProps {
  userData: UserData;
  allUsers: UserData[];
  onViewProfile: (userId: string) => void;
  eventLeaderboard: LeaderboardEntry[];
  currentEvent: {id: string, title: string} | null;
}

type LeaderboardType = 'general' | 'chapters' | 'quizzes' | 'duels' | 'event';
type SocialFilterType = 'general' | 'classe' | 'guilde' | 'amis';

const PodiumCard: React.FC<{ player: LeaderboardEntry; rank: 1 | 2 | 3; value: string; onViewProfile: () => void }> = ({ player, rank, value, onViewProfile }) => {
    const rankStyles = {
        1: {
            bg: 'bg-gradient-to-t from-amber-400 to-yellow-300',
            border: 'border-yellow-400',
            text: 'text-yellow-600',
            icon: '🥇',
            size: 'scale-110 z-10 mx-2',
            avatarSize: 'w-24 h-24',
            badge: 'CHAMPION'
        },
        2: {
            bg: 'bg-gradient-to-t from-slate-400 to-slate-300',
            border: 'border-slate-400',
            text: 'text-slate-600',
            icon: '🥈',
            size: '',
            avatarSize: 'w-20 h-20',
            badge: ''
        },
        3: {
            bg: 'bg-gradient-to-t from-amber-600 to-orange-400',
            border: 'border-orange-500',
            text: 'text-orange-700',
            icon: '🥉',
            size: '',
            avatarSize: 'w-20 h-20',
            badge: ''
        },
    };
    const s = rankStyles[rank];
    const avatarItem = player.avatarId ? SHOP_ITEMS.find(item => item.id === player.avatarId) : null;
    const rankToSize = { 1: 'text-6xl', 2: 'text-5xl', 3: 'text-5xl' };

    return (
        <button onClick={onViewProfile} className={`relative p-4 rounded-t-2xl shadow-lg border-b-4 ${s.bg} ${s.border} ${s.size} transition-transform text-left w-full`}>
            <div className="flex flex-col items-center text-center">
                <span className="text-5xl">{s.icon}</span>
                <div className={`mt-2 ${s.avatarSize} rounded-full bg-white/50 flex items-center justify-center text-3xl font-bold ${s.text} border-4 ${s.border}`}>
                    {avatarItem ? (
                        <span className={rankToSize[rank]}>{avatarItem.icon}</span>
                    ) : (
                        player.name.charAt(0)
                    )}
                </div>
                <h3 className="mt-2 text-xl font-bold">{player.name}</h3>
                <p className={`text-sm font-semibold ${s.text}`}>{player.gradeIcon} {player.gradeName}</p>
                <p className="mt-2 text-2xl font-extrabold">{value}</p>
            </div>
        </button>
    );
};

export const TopScreen: React.FC<TopScreenProps> = ({ userData, allUsers, onViewProfile, eventLeaderboard, currentEvent }) => {
    const [activeTab, setActiveTab] = useState<LeaderboardType>('general');
    const [socialFilter, setSocialFilter] = useState<SocialFilterType>('general');
    
    const baseData = useMemo(() => {
        if (activeTab === 'event') {
            return eventLeaderboard;
        }
        return LEADERBOARD_DATA;
    }, [activeTab, eventLeaderboard]);
    
    const sociallyFilteredData = useMemo(() => {
        const myClasse = userData.classe;
        const myGuildId = userData.guildId;
        
        switch(socialFilter) {
            case 'classe':
                const userIdsInClass = allUsers.filter(u => u.classe === myClasse).map(u => u.id);
                return baseData.filter(p => userIdsInClass.includes(p.userId));
            case 'guilde':
                if (!myGuildId) return [];
                const userIdsInGuild = allUsers.filter(u => u.guildId === myGuildId).map(u => u.id);
                return baseData.filter(p => userIdsInGuild.includes(p.userId));
            case 'amis':
                const friendIdsWithMe = [...userData.friendIds, userData.id];
                return baseData.filter(p => friendIdsWithMe.includes(p.userId));
            default:
                return baseData;
        }
    }, [socialFilter, baseData, userData, allUsers]);

    const sortedData = useMemo(() => {
        const data = [...sociallyFilteredData];
        let sorted;
        switch(activeTab) {
            case 'chapters': sorted = data.sort((a,b) => b.chapters - a.chapters); break;
            case 'quizzes': sorted = data.sort((a,b) => b.quizzes - a.quizzes); break;
            case 'duels': sorted = data.sort((a,b) => b.duels - a.duels); break;
            case 'event': sorted = data.sort((a,b) => (b.eventScore || 0) - (a.eventScore || 0)); break;
            case 'general':
            default: sorted = data.sort((a,b) => b.xp - a.xp); break;
        }
        return sorted.map((player, index) => ({ ...player, rank: index + 1 }));
    }, [activeTab, sociallyFilteredData]);

    const getValue = (player: LeaderboardEntry) => {
        switch(activeTab) {
            case 'chapters': return `${player.chapters} chap.`;
            case 'quizzes': return `${player.quizzes} quiz`;
            case 'duels': return `${player.duels} vict.`;
            case 'event': return `${player.eventScore || 0} pts`;
            case 'general':
            default: return `${player.xp.toLocaleString('fr-FR')} XP`;
        }
    }

    const podium = sortedData.slice(0, 3);
    const rest = sortedData.slice(3);
    const userRankData = sortedData.find(p => p.userId === userData.id);
    const userRank = userRankData ? userRankData.rank : null;

    const renderTrend = (trend: 'up' | 'down' | 'stable' | 'new') => {
        if(trend === 'up') return <span className="text-green-500">⬆️</span>;
        if(trend === 'down') return <span className="text-red-500">⬇️</span>;
        if(trend === 'new') return <span className="text-blue-500">🆕</span>;
        return <span className="text-slate-400">➡️</span>;
    }

    return (
        <div className="p-4 md:p-6 pb-24">
            <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-text-light dark:text-text-dark">🏆 Classement</h2>
                <p className="text-md text-text-muted-light dark:text-text-muted-dark mt-1">Les meilleurs élèves de la classe</p>
            </div>
            
            <div className="space-y-4 mb-8">
                <div className="flex justify-center flex-wrap gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-full">
                    <button onClick={() => setSocialFilter('general')} className={`px-4 py-2 rounded-full font-semibold text-sm flex-1 ${socialFilter === 'general' ? 'bg-white dark:bg-slate-700 shadow' : ''}`}>Général</button>
                    <button onClick={() => setSocialFilter('classe')} className={`px-4 py-2 rounded-full font-semibold text-sm flex-1 ${socialFilter === 'classe' ? 'bg-white dark:bg-slate-700 shadow' : ''}`}>Ma Classe</button>
                    <button onClick={() => setSocialFilter('guilde')} disabled={!userData.guildId} className={`px-4 py-2 rounded-full font-semibold text-sm flex-1 ${socialFilter === 'guilde' ? 'bg-white dark:bg-slate-700 shadow' : ''} disabled:opacity-50`}>Ma Guilde</button>
                    <button onClick={() => setSocialFilter('amis')} className={`px-4 py-2 rounded-full font-semibold text-sm flex-1 ${socialFilter === 'amis' ? 'bg-white dark:bg-slate-700 shadow' : ''}`}>Mes Amis</button>
                </div>
                <div className="flex justify-center flex-wrap gap-2">
                    <button onClick={() => setActiveTab('general')} className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${activeTab === 'general' ? 'bg-primary text-white shadow-md' : 'bg-card-light dark:bg-card-dark hover:bg-slate-100 dark:hover:bg-slate-800'}`}>🏆 Général (XP)</button>
                    {currentEvent && <button onClick={() => setActiveTab('event')} className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${activeTab === 'event' ? 'bg-primary text-white shadow-md' : 'bg-card-light dark:bg-card-dark hover:bg-slate-100 dark:hover:bg-slate-800'}`}>🎉 Événement</button>}
                    <button onClick={() => setActiveTab('chapters')} className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${activeTab === 'chapters' ? 'bg-primary text-white shadow-md' : 'bg-card-light dark:bg-card-dark hover:bg-slate-100 dark:hover:bg-slate-800'}`}>📚 Chapitres</button>
                    <button onClick={() => setActiveTab('quizzes')} className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${activeTab === 'quizzes' ? 'bg-primary text-white shadow-md' : 'bg-card-light dark:bg-card-dark hover:bg-slate-100 dark:hover:bg-slate-800'}`}>⭐ Quiz</button>
                    <button onClick={() => setActiveTab('duels')} className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${activeTab === 'duels' ? 'bg-primary text-white shadow-md' : 'bg-card-light dark:bg-card-dark hover:bg-slate-100 dark:hover:bg-slate-800'}`}>⚔️ Duels</button>
                </div>
            </div>

            {/* Podium */}
            <div className="flex items-end justify-center h-80 mb-10">
                {podium[1] && <PodiumCard player={podium[1]} rank={2} value={getValue(podium[1])} onViewProfile={() => onViewProfile(podium[1].userId)} />}
                {podium[0] && <PodiumCard player={podium[0]} rank={1} value={getValue(podium[0])} onViewProfile={() => onViewProfile(podium[0].userId)} />}
                {podium[2] && <PodiumCard player={podium[2]} rank={3} value={getValue(podium[2])} onViewProfile={() => onViewProfile(podium[2].userId)} />}
            </div>

            {/* Rest of the list */}
            <div className="max-w-4xl mx-auto space-y-2">
                 <h3 className="text-xl font-bold text-center mb-4">Classement complet</h3>
                {rest.map((player) => {
                    const isCurrentUser = player.userId === userData.id;
                    const avatarItem = player.avatarId ? SHOP_ITEMS.find(item => item.id === player.avatarId) : null;
                    return (
                        <div key={player.rank} className={`flex items-center gap-4 p-3 rounded-lg ${isCurrentUser ? 'bg-blue-100 dark:bg-blue-900/50 border-2 border-primary' : 'bg-card-light dark:bg-card-dark'}`}>
                            <div className="w-12 text-center">
                                <span className="text-xl font-bold text-text-muted-light dark:text-text-muted-dark">{player.rank}</span>
                                {renderTrend(player.trend)}
                            </div>
                            <button onClick={() => onViewProfile(player.userId)} disabled={isCurrentUser} className="flex items-center gap-3 flex-grow text-left disabled:cursor-default">
                                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-lg flex-shrink-0">
                                    {avatarItem ? (
                                        <span className="text-3xl">{avatarItem.icon}</span>
                                    ) : (
                                        player.name.charAt(0)
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <p className="font-bold">{player.name} {isCurrentUser && <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-white">TOI</span>}</p>
                                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark">{player.gradeIcon} {player.gradeName} - Nv. {player.level}</p>
                                </div>
                            </button>
                            <div className="font-extrabold text-lg text-primary dark:text-primary-light whitespace-nowrap">{getValue(player)}</div>
                        </div>
                    );
                })}
                 {sortedData.length === 0 && <p className="text-center p-8 text-text-muted-light dark:text-text-muted-dark">Aucune donnée pour ce classement.</p>}
            </div>
             {userRank && userRankData && userRank > 10 && (
                <div className="fixed bottom-[70px] left-1/2 -translate-x-1/2 w-full max-w-md p-3 bg-card-light dark:bg-card-dark/80 backdrop-blur-sm shadow-lg rounded-xl border border-border-light dark:border-border-dark flex justify-between items-center z-20">
                    <p className="font-bold">Ta position : <span className="text-primary dark:text-primary-light">#{userRank}</span></p>
                    <p className="font-bold">{getValue(userRankData)}</p>
                </div>
            )}
        </div>
    );
};
