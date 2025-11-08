import React from 'react';

const StatCard: React.FC<{ icon: string, title: string, value: string, subtitle: string, color: string }> = ({ icon, title, value, subtitle, color }) => (
    <div className={`bg-white dark:bg-card-dark rounded-xl shadow-lg p-6 border-l-4 ${color} transition-all duration-300 hover:shadow-2xl hover:-translate-y-1`}>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-text-muted-light dark:text-text-muted-dark text-sm font-semibold uppercase">{title}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
                <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">{subtitle}</p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full">
                <span className="text-3xl">{icon}</span>
            </div>
        </div>
    </div>
);

const AlertItem: React.FC<{ text: string; color: string; icon: string }> = ({ text, color, icon }) => (
    <li className={`flex items-center gap-3 p-3 rounded-lg bg-opacity-20 ${color}`}>
        <span className="font-bold">{icon}</span>
        <span className="text-sm">{text}</span>
    </li>
);

export const AdminDashboardScreen: React.FC = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">📊 Tableau de bord</h1>
                <p className="text-text-muted-light dark:text-text-muted-dark mt-1">Vue d'ensemble de votre classe</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon="👥" title="Élèves actifs" value="24" subtitle="18 connectés cette semaine" color="border-blue-500" />
                <StatCard icon="📈" title="Progression Moyenne" value="Niveau 12" subtitle="Grade: Calculateur" color="border-green-500" />
                <StatCard icon="✅" title="Taux de Complétion" value="68%" subtitle="Chapitres consultés" color="border-orange-500" />
                <StatCard icon="⭐" title="Quiz Réussis" value="156" subtitle="42 scores parfaits" color="border-purple-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Alerts */}
                <div className="bg-white dark:bg-card-dark p-6 rounded-xl shadow-lg">
                     <h3 className="font-bold text-lg mb-4">🔔 Alertes récentes</h3>
                     <ul className="space-y-2">
                        <AlertItem icon="⚠️" text="3 élèves inactifs depuis 7 jours" color="bg-yellow-400 text-yellow-800 dark:text-yellow-200" />
                        <AlertItem icon="🏰" text="Nouvelle guilde en attente de validation" color="bg-blue-400 text-blue-800 dark:text-blue-200" />
                        <AlertItem icon="💬" text="1 message signalé dans Le Foyer" color="bg-red-400 text-red-800 dark:text-red-200" />
                        <AlertItem icon="🎯" text="Mission hebdomadaire terminée par 15 élèves" color="bg-green-400 text-green-800 dark:text-green-200" />
                     </ul>
                </div>
                {/* Students to watch */}
                 <div className="bg-white dark:bg-card-dark p-6 rounded-xl shadow-lg">
                     <h3 className="font-bold text-lg mb-4">👁️ Élèves nécessitant attention</h3>
                     <table className="w-full text-left text-sm">
                        <thead className="border-b-2 border-border-light dark:border-border-dark">
                            <tr>
                                <th className="py-2 font-semibold">Nom</th>
                                <th className="py-2 font-semibold">Dernière connexion</th>
                                <th className="py-2 font-semibold">Alerte</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-border-light dark:border-border-dark"><td className="py-3">Tom Moreau</td><td className="py-3">Il y a 10 jours</td><td className="py-3 text-yellow-600 dark:text-yellow-400 font-semibold">Inactif</td></tr>
                            <tr className="border-b border-border-light dark:border-border-dark"><td className="py-3">Zoé Fontaine</td><td className="py-3">Il y a 12 jours</td><td className="py-3 text-yellow-600 dark:text-yellow-400 font-semibold">Inactive</td></tr>
                            <tr><td className="py-3">Louis Bernard</td><td className="py-3">Il y a 8 jours</td><td className="py-3 text-yellow-600 dark:text-yellow-400 font-semibold">Inactif</td></tr>
                        </tbody>
                     </table>
                </div>
            </div>
        </div>
    );
};