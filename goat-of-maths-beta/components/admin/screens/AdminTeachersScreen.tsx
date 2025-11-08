import React, { useState } from 'react';
import { UserData } from '../../../types';

// MODALS
const CreateTeacherModal: React.FC<{
    onClose: () => void;
    onCreate: (name: string) => UserData | null;
    onConfirm: (user: UserData, pass: string) => void;
}> = ({ onClose, onCreate, onConfirm }) => {
    const [name, setName] = useState('');

    const handleCreate = () => {
        if (!name.trim()) return;
        const newTeacher = onCreate(name);
        if (newTeacher) {
            onConfirm(newTeacher, newTeacher.passwordHash);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">Créer un nouveau compte professeur</h2>
                <div>
                    <label className="font-bold">Nom et prénom du professeur</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: M. Dupont" className="w-full mt-1 px-3 py-2 rounded-md bg-background-light dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600"/>
                </div>
                <div className="flex gap-4 mt-6">
                    <button onClick={onClose} className="w-full py-3 rounded-lg font-bold bg-slate-200 dark:bg-slate-700">Annuler</button>
                    <button onClick={handleCreate} disabled={!name.trim()} className="w-full py-3 rounded-lg bg-green-500 text-white font-bold disabled:bg-slate-400">✅ Créer le compte</button>
                </div>
            </div>
        </div>
    );
};

interface AdminTeachersScreenProps {
    teachers: UserData[];
    onCreateTeacher: (fullName: string) => UserData | null;
    onResetPassword: (userId: string) => string | null;
    onDeleteUser: (userId: string) => boolean;
}

export const AdminTeachersScreen: React.FC<AdminTeachersScreenProps> = ({ teachers, onCreateTeacher, onResetPassword, onDeleteUser }) => {
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);

    const handleCreateConfirm = (user: UserData, pass: string) => {
        setCreateModalOpen(false);
        alert(`COMPTE PROFESSEUR CRÉÉ\n\nIdentifiant: ${user.username}\nMot de passe: ${pass}\n\nLe professeur devra le changer à sa première connexion.`);
    };

    const handleResetPassword = (teacher: UserData) => {
        if(window.confirm(`Réinitialiser le mot de passe de ${teacher.name} ?`)) {
            const newPass = onResetPassword(teacher.id);
            if(newPass) {
                alert(`Nouveau mot de passe pour ${teacher.name} : ${newPass}`);
            }
        }
    };

    const handleDelete = (teacher: UserData) => {
        if(window.confirm(`⚠️ Voulez-vous vraiment supprimer le compte de ${teacher.name} ? Cette action supprimera un professeur mais PAS ses élèves.`)) {
            onDeleteUser(teacher.id);
        }
    };

    return (
        <div className="space-y-6">
            {isCreateModalOpen && <CreateTeacherModal onClose={() => setCreateModalOpen(false)} onCreate={onCreateTeacher} onConfirm={handleCreateConfirm} />}
            
            <div>
                <h1 className="text-3xl font-extrabold">🧑‍🏫 Gestion des Professeurs</h1>
                <p className="text-text-muted-light dark:text-text-muted-dark mt-1">Ajouter, modifier ou supprimer des comptes professeurs.</p>
            </div>

            <div className="bg-card-light dark:bg-card-dark p-4 rounded-lg shadow-sm">
                <button onClick={() => setCreateModalOpen(true)} className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover">+ Ajouter un professeur</button>
            </div>

            <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-sm overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800">
                        <tr>
                            <th className="p-4 font-semibold">Nom</th>
                            <th className="p-4 font-semibold">Identifiant</th>
                            <th className="p-4 font-semibold">Date de création</th>
                            <th className="p-4 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teachers.map(teacher => (
                            <tr key={teacher.id} className="border-t border-border-light dark:border-border-dark">
                                <td className="p-4 font-medium">{teacher.name}</td>
                                <td className="p-4 font-mono">{teacher.username}</td>
                                <td className="p-4">{new Date(teacher.createdAt).toLocaleDateString('fr-FR')}</td>
                                <td className="p-4 space-x-2">
                                    <button onClick={() => handleResetPassword(teacher)} title="Réinitialiser MDP" className="px-3 py-1 rounded bg-slate-200 dark:bg-slate-700 font-semibold hover:bg-slate-300 dark:hover:bg-slate-600">🔒 Réinitialiser MDP</button>
                                    <button onClick={() => handleDelete(teacher)} title="Supprimer" className="px-3 py-1 rounded bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 font-semibold hover:bg-red-200 dark:hover:bg-red-900">🗑️ Supprimer</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {teachers.length === 0 && <p className="text-center p-8 text-text-muted-light dark:text-text-muted-dark">Aucun professeur n'a été ajouté.</p>}
            </div>
        </div>
    );
};
