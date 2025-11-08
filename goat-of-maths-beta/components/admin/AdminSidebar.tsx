import React from 'react';
import { AdminTab, UserData } from '../../types';

interface AdminSidebarProps {
    currentUser: UserData;
    activeTab: AdminTab;
    setActiveTab: (tab: AdminTab) => void;
    onReturnToStudentApp: () => void;
    onAdminLogout: () => void;
}

const navItems = [
    { id: AdminTab.Dashboard, label: 'Tableau de bord', icon: '📊' },
    { id: AdminTab.Students, label: 'Gestion des élèves', icon: '👥' },
    { id: AdminTab.Teachers, label: 'Gestion des profs', icon: '🧑‍🏫', role: 'super_admin' },
    { id: AdminTab.Content, label: 'Gestion du contenu', icon: '📚' },
    { id: AdminTab.Quizzes, label: 'Gestion des quiz', icon: '📝' },
    { id: AdminTab.Stats, label: 'Statistiques', icon: '📈' },
    { id: AdminTab.Moderation, label: 'Modération', icon: '💬' },
    { id: AdminTab.Guilds, label: 'Gestion des guildes', icon: '🏰' },
    { id: AdminTab.Settings, label: 'Paramètres', icon: '⚙️' },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentUser, activeTab, setActiveTab, onReturnToStudentApp, onAdminLogout }) => {
    return (
        <aside className="w-64 bg-white dark:bg-card-dark border-r border-border-light dark:border-border-dark fixed h-full flex flex-col">
            {/* Header */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-5 border-b border-border-light dark:border-border-dark">
                <div className="flex items-center space-x-3">
                    <span className="text-3xl">{currentUser.role === 'super_admin' ? '👑' : '👨‍🏫'}</span>
                    <div>
                        <h1 className="text-lg font-bold text-blue-600 dark:text-primary-light">
                           {currentUser.role === 'super_admin' ? 'Panel Admin' : 'Panel Prof'}
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-text-muted-dark">{currentUser.name}</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 overflow-y-auto">
                {navItems.map(item => {
                    if (item.role && item.role !== currentUser.role) {
                        return null;
                    }
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center space-x-3 px-5 py-3 transition-colors text-left ${
                                activeTab === item.id
                                    ? 'bg-blue-600 text-white border-l-4 border-blue-800 font-bold'
                                    : 'text-gray-700 dark:text-text-dark hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600'
                            }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-5 border-t border-border-light dark:border-border-dark bg-white dark:bg-card-dark space-y-2">
                 <button 
                    onClick={onReturnToStudentApp}
                    className="w-full text-center px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                >
                    ← Retour élève
                </button>
                <button 
                    onClick={onAdminLogout}
                    className="w-full text-center px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                >
                    Déconnexion
                </button>
            </div>
        </aside>
    );
};