import React from 'react';
import { ReportedMessage, UserData } from '../../../types';

interface AdminModerationScreenProps {
    reportedMessages: ReportedMessage[];
    allUsers: UserData[];
    onResolveReport: (reportId: string) => void;
    onMuteUser: (userId: string, hours: number) => void;
    onUnmuteUser: (userId: string) => void;
}

const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const AdminModerationScreen: React.FC<AdminModerationScreenProps> = ({ reportedMessages, allUsers, onResolveReport, onMuteUser, onUnmuteUser }) => {
    
    const mutedUsers = allUsers.filter(u => u.isMuted && u.muteEndDate && new Date(u.muteEndDate) > new Date());

    const handleMute = (userId: string, userName: string) => {
        if (window.confirm(`Voulez-vous vraiment rendre ${userName} muet pendant 24 heures ?`)) {
            onMuteUser(userId, 24);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold">💬 Modération du Chat</h1>
                <p className="text-text-muted-light dark:text-text-muted-dark mt-1">Gérer les messages signalés et les sanctions des élèves.</p>
            </div>

            {/* Reported Messages */}
            <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-md">
                <h2 className="text-xl font-bold mb-4">Signalements en attente ({reportedMessages.length})</h2>
                {reportedMessages.length > 0 ? (
                    <div className="space-y-4">
                        {reportedMessages.map(report => (
                            <div key={report.id} className="border border-border-light dark:border-border-dark rounded-lg p-4 bg-slate-50 dark:bg-slate-900/50">
                                <div className="mb-2 p-3 rounded-md bg-white dark:bg-slate-800 shadow-sm">
                                    <p className="font-bold text-primary dark:text-primary-light">{report.message.author} a dit :</p>
                                    <p className="italic">"{report.message.text}"</p>
                                </div>
                                <div className="text-xs text-text-muted-light dark:text-text-muted-dark">
                                    Signalé par <strong>{report.reporterName}</strong> pour : <strong className="text-red-500">{report.reason}</strong>
                                    <br/>
                                    Le {formatDateTime(report.timestamp)}
                                </div>
                                <div className="flex gap-2 mt-3">
                                    <button onClick={() => onResolveReport(report.id)} className="px-3 py-1.5 rounded-md bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 font-semibold text-sm hover:bg-green-200 dark:hover:bg-green-900">
                                        ✅ Ignorer le signalement
                                    </button>
                                     <button onClick={() => handleMute(report.message.authorId, report.message.author)} className="px-3 py-1.5 rounded-md bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 font-semibold text-sm hover:bg-yellow-200 dark:hover:bg-yellow-900">
                                        🔇 Muter l'auteur (24h)
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center py-8 text-text-muted-light dark:text-text-muted-dark">🎉 Aucun signalement en attente. Tout est en ordre !</p>
                )}
            </div>

            {/* Muted Users */}
             <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-md">
                <h2 className="text-xl font-bold mb-4">Élèves actuellement muets ({mutedUsers.length})</h2>
                 {mutedUsers.length > 0 ? (
                    <div className="overflow-x-auto">
                         <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800">
                                <tr>
                                    <th className="p-3 font-semibold">Nom de l'élève</th>
                                    <th className="p-3 font-semibold">Fin de la sanction</th>
                                    <th className="p-3 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mutedUsers.map(user => (
                                    <tr key={user.id} className="border-t border-border-light dark:border-border-dark">
                                        <td className="p-3 font-medium">{user.name}</td>
                                        <td className="p-3">{user.muteEndDate ? formatDateTime(user.muteEndDate) : 'N/A'}</td>
                                        <td className="p-3">
                                            <button onClick={() => onUnmuteUser(user.id)} className="px-3 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 font-semibold text-xs hover:bg-blue-200 dark:hover:bg-blue-900">
                                                🔊 Réactiver
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                     <p className="text-center py-8 text-text-muted-light dark:text-text-muted-dark">Aucun élève n'est actuellement muet.</p>
                 )}
            </div>
        </div>
    );
};