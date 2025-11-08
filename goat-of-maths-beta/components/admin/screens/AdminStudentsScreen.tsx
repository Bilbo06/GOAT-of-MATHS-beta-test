import React, { useState, useMemo, useEffect } from 'react';
import { UserData } from '../../../types';
import { GRADES, SHOP_ITEMS } from '../../../constants';

// MODALS (kept in the same file for simplicity)
const CreateStudentModal: React.FC<{ currentUser: UserData; onClose: () => void; onCreate: (name: string, classe: string, teacherId: string) => UserData | null; onConfirm: (user: UserData, pass: string) => void; }> = ({ currentUser, onClose, onCreate, onConfirm }) => {
    const [name, setName] = useState('');
    const [classe, setClasse] = useState('4ème A');

    const handleCreate = () => {
        if (!name.trim()) return;
        const newUser = onCreate(name, classe, currentUser.id);
        if (newUser) {
            onConfirm(newUser, newUser.passwordHash);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">Créer un nouveau compte élève</h2>
                <div className="space-y-4">
                     <div>
                        <label className="font-bold">Nom et prénom</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Lucas Dubois" className="w-full mt-1 px-3 py-2 rounded-md bg-background-light dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600"/>
                    </div>
                     <div>
                        <label className="font-bold">Classe</label>
                        <select value={classe} onChange={e => setClasse(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-md bg-background-light dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600">
                            <option>4ème A</option><option>4ème B</option><option>3ème A</option><option>3ème B</option>
                        </select>
                    </div>
                </div>
                <div className="flex gap-4 mt-6">
                    <button onClick={onClose} className="w-full py-3 rounded-lg font-bold bg-slate-200 dark:bg-slate-700">Annuler</button>
                    <button onClick={handleCreate} disabled={!name.trim()} className="w-full py-3 rounded-lg bg-green-500 text-white font-bold disabled:bg-slate-400">✅ Créer le compte</button>
                </div>
            </div>
        </div>
    );
};

// Other modals would follow a similar structure...
// For brevity and focus, some modals are simplified or combined in this example.

// UTILITY FUNCTIONS
const formatRelativeTime = (date: Date | undefined): { text: string; color: string } => {
    if (!date) return { text: 'Jamais', color: 'text-red-500' };
    const now = new Date();
    const seconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

    const days = seconds / 86400;
    if (days >= 7) return { text: `Il y a ${Math.floor(days)} jours`, color: 'text-red-500' };
    if (days >= 1) return { text: `Il y a ${Math.floor(days)} jours`, color: 'text-orange-500' };

    const hours = seconds / 3600;
    if (hours >= 1) return { text: `Il y a ${Math.floor(hours)} heures`, color: 'text-green-600' };
    
    const minutes = seconds / 60;
    if (minutes > 1) return { text: `Il y a ${Math.floor(minutes)} minutes`, color: 'text-green-600' };
    
    return { text: "À l'instant", color: 'text-green-600' };
};

const getStatus = (date: Date | undefined): { text: 'Actif' | 'Inactif'; color: string } => {
    if (!date) return { text: 'Inactif', color: 'bg-red-500' };
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return new Date(date) > weekAgo ? { text: 'Actif', color: 'bg-green-500' } : { text: 'Inactif', color: 'bg-red-500' };
};


interface AdminStudentsScreenProps {
    students: UserData[];
    currentUser: UserData;
    onCreateUser: (fullName: string, classe: string, teacherId: string) => UserData | null;
    onResetPassword: (userId: string) => string | null;
    onUpdateUser: (userId: string, updates: { name?: string; classe?: string }) => boolean;
    onAddBonus: (userId: string, xp: number, coins: number) => boolean;
    onDeleteUser: (userId: string) => boolean;
}

export const AdminStudentsScreen: React.FC<AdminStudentsScreenProps> = ({ students, currentUser, onCreateUser, onResetPassword, onUpdateUser, onAddBonus, onDeleteUser }) => {
    const [search, setSearch] = useState('');
    const [gradeFilter, setGradeFilter] = useState('Tous');
    const [statusFilter, setStatusFilter] = useState('Tous');
    
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    
    const stats = useMemo(() => {
        const activeCount = students.filter(s => getStatus(s.lastLogin).text === 'Actif').length;
        const inactiveCount = students.length - activeCount;
        const avgLevel = Math.round(students.reduce((acc, s) => acc + s.level, 0) / students.length) || 0;
        return { total: students.length, active: activeCount, inactive: inactiveCount, avgLevel };
    }, [students]);

    const filteredStudents = useMemo(() => {
        return students.filter(s => {
            const searchMatch = s.name.toLowerCase().includes(search.toLowerCase());
            const gradeMatch = gradeFilter === 'Tous' || GRADES[s.gradeIndex].name === gradeFilter;
            const statusMatch = statusFilter === 'Tous' ||
                (statusFilter === 'Actifs' && getStatus(s.lastLogin).text === 'Actif') ||
                (statusFilter === 'Inactifs' && getStatus(s.lastLogin).text === 'Inactif');
            return searchMatch && gradeMatch && statusMatch;
        });
    }, [search, gradeFilter, statusFilter, students]);

    const handleCreateConfirm = (user: UserData, pass: string) => {
        setCreateModalOpen(false);
        alert(`COMPTE CRÉÉ\n\nIdentifiant: ${user.username}\nMot de passe: ${pass}\n\nL'élève devra le changer à sa première connexion.`);
    };

    const handleResetPassword = (student: UserData) => {
        if(window.confirm(`Réinitialiser le mot de passe de ${student.name} ?`)) {
            const newPass = onResetPassword(student.id);
            if(newPass) {
                alert(`Nouveau mot de passe pour ${student.name} : ${newPass}`);
            }
        }
    };
    
    const handleDelete = (student: UserData) => {
        const confirmation = prompt(`⚠️ Pour supprimer définitivement le compte de "${student.name}", tapez son nom complet ci-dessous :`);
        if(confirmation === student.name) {
            onDeleteUser(student.id);
        } else if (confirmation !== null) {
            alert("Le nom ne correspond pas. Suppression annulée.");
        }
    }


    return (
        <div className="space-y-6">
            {isCreateModalOpen && <CreateStudentModal currentUser={currentUser} onClose={() => setCreateModalOpen(false)} onCreate={onCreateUser} onConfirm={handleCreateConfirm} />}
            
            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold">👥 Gestion des élèves</h1>
                <p className="text-text-muted-light dark:text-text-muted-dark mt-1">Créer, modifier et suivre vos élèves.</p>
            </div>
            
            {/* Stats */}
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-card-light dark:bg-card-dark p-4 rounded-lg shadow-sm text-center"> <p className="text-2xl font-bold">👥 {stats.total}</p> <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Élèves au total</p> </div>
                <div className="bg-card-light dark:bg-card-dark p-4 rounded-lg shadow-sm text-center"> <p className="text-2xl font-bold text-green-500">🟢 {stats.active}</p> <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Actifs</p> </div>
                <div className="bg-card-light dark:bg-card-dark p-4 rounded-lg shadow-sm text-center"> <p className="text-2xl font-bold text-red-500">🔴 {stats.inactive}</p> <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Inactifs</p> </div>
                <div className="bg-card-light dark:bg-card-dark p-4 rounded-lg shadow-sm text-center"> <p className="text-2xl font-bold text-blue-500">📊 {stats.avgLevel}</p> <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Niveau moyen</p> </div>
            </div>

            {/* Actions & Filters */}
            <div className="bg-card-light dark:bg-card-dark p-4 rounded-lg shadow-sm space-y-4">
                <div className="flex flex-wrap gap-2">
                    <button onClick={() => setCreateModalOpen(true)} className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover">+ Créer un compte</button>
                    <button className="px-4 py-2 rounded-lg border-2 border-primary text-primary font-semibold">📤 Importer CSV</button>
                    <button className="px-4 py-2 rounded-lg border border-border-light dark:border-border-dark font-semibold">📊 Exporter la liste</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" placeholder="🔍 Rechercher un élève..." value={search} onChange={e => setSearch(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-background-light dark:bg-slate-800 border border-border-light dark:border-border-dark"/>
                    <select value={gradeFilter} onChange={e => setGradeFilter(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-background-light dark:bg-slate-800 border border-border-light dark:border-border-dark">
                        <option>Tous les grades</option>
                        {GRADES.map(g => <option key={g.name}>{g.name}</option>)}
                    </select>
                     <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-background-light dark:bg-slate-800 border border-border-light dark:border-border-dark">
                        <option>Tous</option>
                        <option>Actifs</option>
                        <option>Inactifs</option>
                    </select>
                </div>
            </div>

            {/* Students Table */}
            <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-sm overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800">
                        <tr>
                            {['Nom Complet', 'Grade', 'XP Total', 'Dernière Connexion', 'Statut', 'Actions'].map(h => <th key={h} className="p-4 font-semibold">{h}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map(student => {
                            const grade = GRADES[student.gradeIndex];
                            const lastLogin = formatRelativeTime(student.lastLogin);
                            const status = getStatus(student.lastLogin);
                            const avatarItem = student.avatarId ? SHOP_ITEMS.find(item => item.id === student.avatarId) : null;
                            return (
                            <tr key={student.id} className="border-t border-border-light dark:border-border-dark hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <td className="p-4 font-medium">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center font-bold flex-shrink-0">
                                          {avatarItem ? (
                                              <span className="text-2xl">{avatarItem.icon}</span>
                                          ) : (
                                              student.name.charAt(0)
                                          )}
                                        </div>
                                        <div>
                                            {student.name}
                                            <p className="text-xs text-text-muted-light dark:text-text-muted-dark font-mono">{student.username}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">{grade.icon} {grade.name} (Nv. {student.level})</td>
                                <td className="p-4 font-bold text-primary dark:text-primary-light">{student.xp.toLocaleString('fr-FR')} XP</td>
                                <td className={`p-4 font-semibold ${lastLogin.color}`}>{lastLogin.text}</td>
                                <td className="p-4"><span className={`px-2 py-1 text-xs font-bold text-white rounded-full ${status.color}`}>{status.text}</span></td>
                                <td className="p-4 text-lg space-x-2">
                                    <button title="Voir profil" className="hover:text-primary">👁️</button>
                                    <button title="Modifier" className="hover:text-primary">✏️</button>
                                    <button onClick={() => handleResetPassword(student)} title="Réinitialiser MDP" className="hover:text-primary">🔒</button>
                                    <button title="Ajouter bonus" className="hover:text-primary">🎁</button>
                                    <button onClick={() => handleDelete(student)} title="Supprimer" className="hover:text-red-500">🗑️</button>
                                </td>
                            </tr>
                        )})}
                    </tbody>
                </table>
                 {filteredStudents.length === 0 && <p className="text-center p-8 text-text-muted-light dark:text-text-muted-dark">Aucun élève ne correspond à vos critères.</p>}
            </div>
        </div>
    );
};