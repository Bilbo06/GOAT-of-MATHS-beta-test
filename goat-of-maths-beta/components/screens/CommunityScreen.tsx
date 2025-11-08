
import React from 'react';
import { UserData, FriendRequest, DuelChallenge, WeeklyEvent, WeeklyEventProgress } from '../../types';
import { FriendsScreen } from './FriendsScreen';
import { DuelsScreen } from './DuelsScreen';
import { GuildsScreen } from './GuildsScreen';
import { TopScreen } from './TopScreen';
import { ChatScreen } from './ChatScreen';

export type CommunitySubView = 'chat' | 'friends' | 'duels' | 'guilds' | 'top';

// Combine all props for sub-screens
interface CommunityScreenProps {
    userData: UserData;
    allUsers: UserData[];
    friendRequests: FriendRequest[];
    duelChallenges: DuelChallenge[];
    weeklyEvent: WeeklyEvent | null;
    weeklyEventProgress: WeeklyEventProgress | null;
    onStartChat: (friendId: string) => void;
    onSendRequest: (toUserId: string) => void;
    onHandleRequest: (requestId: string, accept: boolean) => void;
    onRemoveFriend: (friendId: string) => void;
    onSendDuelChallenge: (toUserId: string, wager: number) => void;
    onHandleDuelChallenge: (challengeId: string, accept: boolean) => void;
    onCompleteDuel: (result: 'win' | 'loss' | 'tie', myScore: number, opponentScore: number, opponentName: string, wager?: number) => void;
    onViewProfile: (userId: string) => void;
    onEnterBattleRoyale: () => void;
    onEnterBattleRoyaleTraining: () => void;
    onCreateGuild: () => void;
    onJoinGuild: (guildId: string) => void;
    onLeaveGuild: () => void;
    activeSubView: CommunitySubView;
    setActiveSubView: (view: CommunitySubView) => void;
}

export const CommunityScreen: React.FC<CommunityScreenProps> = (props) => {
    const { activeSubView, setActiveSubView } = props;

    const subNavItems: { view: CommunitySubView; label: string; icon: string }[] = [
        { view: 'chat', label: 'Foyer', icon: '💬' },
        { view: 'friends', label: 'Amis', icon: '🧑‍🤝‍🧑' },
        { view: 'duels', label: 'Duels', icon: '⚔️' },
        { view: 'guilds', label: 'Guildes', icon: '🏰' },
        { view: 'top', label: 'Classement', icon: '🏆' },
    ];

    const renderSubView = () => {
        switch (activeSubView) {
            case 'chat':
                return <ChatScreen userData={props.userData} />;
            case 'friends':
                return <FriendsScreen 
                    userData={props.userData}
                    allUsers={props.allUsers}
                    friendRequests={props.friendRequests}
                    onStartChat={props.onStartChat}
                    onSendRequest={props.onSendRequest}
                    onHandleRequest={props.onHandleRequest}
                    onRemoveFriend={props.onRemoveFriend}
                    onSendDuelChallenge={props.onSendDuelChallenge}
                />;
            case 'duels':
                return <DuelsScreen 
                    userData={props.userData}
                    allUsers={props.allUsers}
                    duelChallenges={props.duelChallenges}
                    onCompleteDuel={props.onCompleteDuel}
                    onHandleDuelChallenge={props.onHandleDuelChallenge}
                    onViewProfile={props.onViewProfile}
                    onEnterBattleRoyale={props.onEnterBattleRoyale}
                    onEnterBattleRoyaleTraining={props.onEnterBattleRoyaleTraining}
                />;
            case 'guilds':
                return <GuildsScreen 
                    userData={props.userData}
                    onCreateGuild={props.onCreateGuild}
                    onJoinGuild={props.onJoinGuild}
                    onLeaveGuild={props.onLeaveGuild}
                    onViewProfile={props.onViewProfile}
                />;
            case 'top':
                 const eventLeaderboard = props.weeklyEventProgress 
                    ? Object.entries(props.weeklyEventProgress)
                        .map(([userId, data]) => {
                            // FIX: Added type assertion to resolve 'unknown' type error.
                            const progressData = data as { score: number; userName: string; avatarId: string | null; };
                            return {
                                userId,
                                name: progressData.userName,
                                avatarId: progressData.avatarId,
                                eventScore: progressData.score,
                                // Add dummy data for other LeaderboardEntry fields
                                rank: 0, gradeName: '', gradeIcon: '', level: 0, xp: 0, chapters: 0, quizzes: 0, duels: 0, trend: 'stable' as 'stable', lastSeen: '', status: 'actif' as 'actif'
                            };
                        })
                        .sort((a,b) => (b.eventScore || 0) - (a.eventScore || 0))
                    : [];

                return <TopScreen 
                    userData={props.userData}
                    allUsers={props.allUsers}
                    onViewProfile={props.onViewProfile}
                    eventLeaderboard={eventLeaderboard}
                    currentEvent={props.weeklyEvent ? { id: props.weeklyEvent.id, title: props.weeklyEvent.title } : null}
                />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-center gap-1 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mx-auto my-4 sticky top-[68px] z-10 max-w-lg w-full">
                {subNavItems.map(item => (
                    <button 
                        key={item.view}
                        onClick={() => setActiveSubView(item.view)}
                        className={`px-2 py-2 rounded-full font-semibold text-sm transition-colors text-center flex-1 ${
                            activeSubView === item.view
                                ? 'bg-white dark:bg-slate-700 shadow text-primary dark:text-primary-light'
                                : 'text-text-muted-light dark:text-text-muted-dark hover:bg-slate-200 dark:hover:bg-slate-700/50'
                        }`}
                    >
                        {item.icon} {item.label}
                    </button>
                ))}
            </div>
            <div className="flex-grow">
                {renderSubView()}
            </div>
        </div>
    );
};
