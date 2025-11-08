
import React, { useState } from 'react';
import { Guild, UserData, GuildMember } from '../../../types';
import { GRADES } from '../../../constants';

const MembersModal: React.FC<{ guild: Guild; onClose: () => void }> = ({ guild, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">Membres de "{guild.name}"</h2>
                <ul className="space-y-2 max-h-80 overflow-y-auto">
                    {guild.members.map(member => (
                        // FIX: Property 'id' does not exist on type 'GuildMember'. Used 'userId' instead.
                        <li key={member.userId} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            <div>
                                <p className="font-semibold">{member.name} {member.role === 'Chef' && '👑'}</p>
                                <p className="text-xs text-text-muted-light dark:text-text-muted-dark">{member.gradeIcon} {member.gradeName} - Nv. {member.level}</p>
                            </div>
                            <span className="text-sm font-bold text-green-500">{member.weeklyContribution} XP</span>
                        </li>
                    ))}
                </ul>
                <button onClick={onClose} className="w-full mt-6 py-3 rounded-lg font-bold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600">Fermer</button>
            </div>
        </div>
    );
};

const DisbandModal: React.FC<{ guild: Guild; onClose: () => void; onConfirm: () => void; confirmName: string; setConfirmName: (name: string) => void; }> = ({ guild, onClose, onConfirm, confirmName, setConfirmName }) => {
    const isConfirmButtonDisabled = confirmName !== guild.name;
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 w-full max-w-lg border-t-4 border-red-500">
                <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">⚠️ Dissoudre la guilde</h2>
                <p className="my-4 text-text-muted-light dark:text-text-muted-dark">
                    Cette action est irréversible. La guilde "{guild.name}" sera supprimée définitivement, et tous ses membres en seront exclus.
                </p>
                <label className="font-bold">Pour confirmer, tapez le nom de la guilde : <span className="font-mono text-primary dark:text-primary-light">{guild.name}</span></label>
                <input
                    type="text"
                    value={confirmName}
                    onChange={e => setConfirmName(e.target.value)}
                    className="w-full mt-2 px-3 py-2 rounded-md bg-background-light dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600"
                />
                <div className="flex gap-4 mt-6">
                    <button onClick={onClose} className="w-full py-3 rounded-lg font-bold bg-slate-200 dark:bg-slate-700">Annuler</button>
                    <button onClick={onConfirm} disabled={isConfirmButtonDisabled} className="w-full py-3 rounded-lg bg-red-600 text-white font-bold disabled:bg-slate-400 disabled:cursor-not-allowed">Dissoudre</button>
                </div>
            </div>
        </div>
    );
};

interface AdminGuildsScreenProps {
    allGuilds: Guild[];
    allUsers: UserData[];
    onDisbandGuild: (guildId: string) => boolean;
}

export const AdminGuildsScreen: React.FC<AdminGuildsScreenProps> = ({ allGuilds, allUsers, onDisbandGuild }) => {
    const [viewingGuild, setViewingGuild] = useState<Guild | null>(null);
    const [disbandingGuild, setDisbandingGuild] = useState<Guild | null>(null);
    const [confirmName, setConfirmName] = useState('');

    const handleConfirmDisband = () => {
        if (disbandingGuild) {
            onDisbandGuild(disbandingGuild.id);
            setDisbandingGuild(null);
            setConfirmName('');
        }
    };

    return (
        <div className="space-y-6">
            {viewingGuild && <MembersModal guild={viewingGuild} onClose={() => setViewingGuild(null)} />}
            {disbandingGuild && <DisbandModal guild={disbandingGuild} onClose={() => setDisbandingGuild(null)} onConfirm={handleConfirmDisband} confirmName={confirmName} setConfirmName={setConfirmName} />}

            <div>
                <h1 className="text-3xl font-extrabold">🏰 Gestion des guildes</h1>
                <p className="text-text-muted-light dark:text-text-muted-dark mt-1">Superviser les guildes créées par les élèves.</p>
            </div>

            <div className="bg-card-light dark:bg-card-dark p-4 rounded-lg shadow-sm text-center">
                <p className="text-2xl font-bold">🛡️ {allGuilds.length}</p>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Guildes actives</p>
            </div>

            <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-sm overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800">
                        <tr>
                            {['Guilde', 'Chef', 'Membres', 'Niveau', 'Actions'].map(h => <th key={h} className="p-4 font-semibold">{h}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {allGuilds.map(guild => (
                            <tr key={guild.id} className="border-t border-border-light dark:border-border-dark">
                                <td className="p-4 font-medium">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">{guild.emoji}</span>
                                        <span>{guild.name}</span>
                                    </div>
                                </td>
                                <td className="p-4">{guild.chef}</td>
                                <td className="p-4 font-bold">{guild.memberCount}/{guild.maxMembers}</td>
                                <td className="p-4 font-bold text-primary dark:text-primary-light">{guild.level}</td>
                                <td className="p-4 space-x-2">
                                    <button onClick={() => setViewingGuild(guild)} className="px-3 py-1 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 font-semibold hover:bg-blue-200">Voir membres</button>
                                    <button onClick={() => setDisbandingGuild(guild)} className="px-3 py-1 rounded bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 font-semibold hover:bg-red-200">Dissoudre</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {allGuilds.length === 0 && <p className="text-center p-8 text-text-muted-light dark:text-text-muted-dark">Aucune guilde n'a été créée pour le moment.</p>}
            </div>
        </div>
    );
};
