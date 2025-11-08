
import React, { useState, useRef, useEffect } from 'react';
import { UserData, Guild, Message } from '../../types';
import { MOCK_GUILDS, MY_GUILD, MOCK_GUILD_MISSIONS, GUILD_CREATION_COST, SHOP_ITEMS } from '../../constants';

interface GuildsScreenProps {
  userData: UserData;
  onCreateGuild: () => void;
  onJoinGuild: (guildId: string) => void;
  onLeaveGuild: () => void;
  onViewProfile: (userId: string) => void;
}

const GuildDiscoveryView: React.FC<Omit<GuildsScreenProps, 'onLeaveGuild' | 'onViewProfile'>> = ({ userData, onCreateGuild, onJoinGuild }) => {
    const [guildName, setGuildName] = useState('');
    const [guildEmoji, setGuildEmoji] = useState('🧮');
    
    const canAfford = userData.coins >= GUILD_CREATION_COST;

    const handleCreate = () => {
        if (!guildName.trim() || !guildEmoji.trim()) {
            alert("Veuillez donner un nom et un emoji à votre guilde.");
            return;
        }
        if (window.confirm(`Créer la guilde "${guildName}" pour ${GUILD_CREATION_COST} 🪙 ?`)) {
            onCreateGuild();
        }
    };

    return (
        <div className="p-4 md:p-6 space-y-8">
            <div className="text-center">
                <h2 className="text-4xl font-bold text-text-light dark:text-text-dark">🏰 Guildes</h2>
                <p className="text-md text-text-muted-light dark:text-text-muted-dark mt-1">Rejoins ou crée une guilde avec tes camarades !</p>
            </div>

            {/* Create Guild Section */}
            <div className="max-w-3xl mx-auto bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-lg border border-border-light dark:border-border-dark space-y-4">
                <h3 className="text-2xl font-bold text-primary dark:text-primary-light">✨ Créer ta propre guilde</h3>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Deviens chef de guilde et invite jusqu'à 9 camarades.</p>
                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
                    <span className="font-bold">Coût de création : <span className="text-yellow-500">{GUILD_CREATION_COST} 🪙</span></span>
                    <span className={`font-bold ${canAfford ? 'text-green-500' : 'text-red-500'}`}>Ton solde : {userData.coins} 🪙</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Nom de ta guilde" value={guildName} onChange={e => setGuildName(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-background-light dark:bg-background-dark border-2 border-border-light dark:border-border-dark focus:ring-2 focus:ring-primary focus:outline-none text-text-light dark:text-text-dark"/>
                    <input type="text" placeholder="Emoji (ex: 🏆)" value={guildEmoji} onChange={e => setGuildEmoji(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-background-light dark:bg-background-dark border-2 border-border-light dark:border-border-dark focus:ring-2 focus:ring-primary focus:outline-none text-text-light dark:text-text-dark"/>
                </div>
                <button onClick={handleCreate} disabled={!canAfford || !guildName.trim()} className="w-full py-3 rounded-lg font-bold text-white bg-primary hover:bg-primary-hover disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg">
                    Créer ma guilde
                </button>
            </div>

            {/* Join Guild Section */}
            <div>
                <h3 className="text-2xl font-bold text-center mb-4">🏰 Guildes disponibles</h3>
                <div className="max-w-3xl mx-auto space-y-3">
                    {MOCK_GUILDS.map(guild => (
                        <div key={guild.id} className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-4 border border-border-light dark:border-border-dark flex items-center gap-4">
                            <div className="text-5xl">{guild.emoji}</div>
                            <div className="flex-grow">
                                <h4 className="font-bold text-lg">{guild.name}</h4>
                                <p className="text-xs text-text-muted-light dark:text-text-muted-dark">Chef : {guild.chef} • Niveau {guild.level}</p>
                                <p className="text-sm font-semibold">{guild.memberCount}/{guild.maxMembers} membres</p>
                            </div>
                            {guild.memberCount >= guild.maxMembers ? (
                                <div className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-text-muted-light dark:text-text-muted-dark font-semibold">Complète</div>
                            ) : (
                                <button onClick={() => onJoinGuild(guild.id)} className="px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-primary dark:text-primary-light font-bold hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors">Rejoindre</button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const GuildChat: React.FC<{ userData: UserData }> = ({ userData }) => {
    const [messages, setMessages] = useState<Message[]>([
        // FIX: Added missing 'authorId' property to initial mock messages.
        { id: 1, authorId: 'student_002', author: 'Emma Martin', text: 'Bien joué pour la mission des quiz tout le monde !', timestamp: new Date(), authorRole: 'Membre' },
        { id: 2, authorId: userData.id, author: 'Vous', text: 'Merci ! On est les meilleurs 🚀', timestamp: new Date(), authorRole: 'Chef'},
    ]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if(!newMessage.trim()) return;
        // FIX: Added missing 'authorId' property when creating a new message.
        setMessages(prev => [...prev, {id: Date.now(), authorId: userData.id, author: 'Vous', text: newMessage, timestamp: new Date(), authorRole: 'Chef' }]);
        setNewMessage('');
    };
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
         <div className="flex flex-col h-[500px] bg-slate-50 dark:bg-slate-900/50 rounded-lg overflow-hidden">
            <div className="flex-grow p-4 space-y-4 overflow-y-auto">
               {messages.map(msg => (
                   <div key={msg.id} className={`flex flex-col ${msg.author === 'Vous' ? 'items-end' : 'items-start'}`}>
                       <div className={`max-w-[80%] p-2 rounded-lg ${msg.author === 'Vous' ? 'bg-primary text-white' : 'bg-white dark:bg-slate-700'}`}>
                           <p className="text-xs font-bold text-primary-light">{msg.authorRole === 'Chef' && '👑'} {msg.author}</p>
                           <p>{msg.text}</p>
                       </div>
                   </div>
               ))}
               <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-2 border-t border-border-light dark:border-border-dark flex gap-2">
                <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Message pour la guilde..." className="flex-grow w-full px-3 py-2 rounded-full bg-background-light dark:bg-background-dark border-2 border-border-light dark:border-border-dark focus:ring-primary focus:outline-none text-text-light dark:text-text-dark"/>
                <button type="submit" className="w-10 h-10 rounded-full bg-primary text-white font-bold flex-shrink-0">📤</button>
            </form>
        </div>
    );
};

const GuildManagementView: React.FC<Omit<GuildsScreenProps, 'onCreateGuild' | 'onJoinGuild'>> = ({ userData, onLeaveGuild, onViewProfile }) => {
    const [activeTab, setActiveTab] = useState<'members' | 'missions' | 'chat'>('members');
    const guild = MY_GUILD; // Using mock data for the user's guild

    const handleLeave = () => {
        if (window.confirm("Es-tu sûr de vouloir quitter cette guilde ?")) {
            onLeaveGuild();
        }
    };
    

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-2xl shadow-xl text-center">
                <h2 className="text-5xl font-bold">{guild.emoji}</h2>
                <h3 className="text-3xl font-extrabold mt-2">{guild.name}</h3>
                <div className="flex justify-center gap-4 mt-2">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold">Niveau {guild.level}</span>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold">{guild.memberCount}/{guild.maxMembers} membres</span>
                </div>
            </div>
            
            <div className="flex justify-center gap-2 bg-card-light dark:bg-card-dark p-2 rounded-xl shadow-sm">
                <button onClick={() => setActiveTab('members')} className={`px-4 py-2 rounded-lg font-semibold w-1/3 ${activeTab === 'members' ? 'bg-primary text-white' : ''}`}>👥 Membres</button>
                <button onClick={() => setActiveTab('missions')} className={`px-4 py-2 rounded-lg font-semibold w-1/3 ${activeTab === 'missions' ? 'bg-primary text-white' : ''}`}>🎯 Missions</button>
                <button onClick={() => setActiveTab('chat')} className={`px-4 py-2 rounded-lg font-semibold w-1/3 ${activeTab === 'chat' ? 'bg-primary text-white' : ''}`}>💬 Chat</button>
            </div>

            <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-sm">
                {activeTab === 'members' && (
                    <div className="space-y-3">
                        {guild.members.map(member => {
                            const avatarItem = member.avatarId ? SHOP_ITEMS.find(item => item.id === member.avatarId) : null;
                            const isCurrentUser = member.userId === userData.id;
                            return (
                                <div key={member.userId} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <button onClick={() => onViewProfile(member.userId)} disabled={isCurrentUser} className="flex items-center gap-3 flex-grow text-left disabled:cursor-default">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-xl ${member.role === 'Chef' ? 'bg-yellow-500' : 'bg-primary'}`}>
                                            {avatarItem ? (
                                                <span className="text-3xl">{avatarItem.icon}</span>
                                            ) : (
                                                member.name.charAt(0)
                                            )}
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-bold">{member.name} {member.role === 'Chef' && '👑'} {isCurrentUser && '(Vous)'}</p>
                                            <p className="text-xs">{member.gradeIcon} {member.gradeName} - Nv. {member.level}</p>
                                        </div>
                                    </button>
                                    <div className="text-right">
                                        <p className="font-semibold text-green-500">{member.weeklyContribution} XP</p>
                                        <p className="text-xs text-text-muted-light dark:text-text-muted-dark">Cette semaine</p>
                                    </div>
                                </div>
                            );
                        })}
                         <button onClick={handleLeave} className="w-full mt-4 py-2 rounded-lg font-bold text-red-600 bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-900">Quitter la guilde</button>
                    </div>
                )}
                {activeTab === 'missions' && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg text-center">Missions Hebdomadaires</h3>
                        {MOCK_GUILD_MISSIONS.map(mission => (
                            <div key={mission.id} className={`p-4 rounded-lg border-l-4 ${mission.status === 'Terminée' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'}`}>
                                <h4 className="font-bold">{mission.title}</h4>
                                <p className="text-xs text-text-muted-light dark:text-text-muted-dark">{mission.reward}</p>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mt-2">
                                    <div className={`h-2.5 rounded-full ${mission.status === 'Terminée' ? 'bg-green-500' : 'bg-orange-500'}`} style={{width: `${(mission.currentProgress / mission.goal) * 100}%`}}></div>
                                </div>
                                <p className="text-right text-xs font-semibold mt-1">{mission.currentProgress}/{mission.goal}</p>
                            </div>
                        ))}
                    </div>
                )}
                {activeTab === 'chat' && <GuildChat userData={userData} />}
            </div>
        </div>
    );
};

export const GuildsScreen: React.FC<GuildsScreenProps> = (props) => {
  if (props.userData.guildId) {
    return <GuildManagementView {...props} />;
  }
  return <GuildDiscoveryView {...props} />;
};
