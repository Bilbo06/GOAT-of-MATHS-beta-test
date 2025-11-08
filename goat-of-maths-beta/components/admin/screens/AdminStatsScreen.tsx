import React, { useMemo } from 'react';
import { UserData, Chapter, Quiz } from '../../../types';
import { GRADES } from '../../../constants';

interface AdminStatsScreenProps {
    allUsers: UserData[];
    chapters: Chapter[];
    quizzes: Quiz[];
}

const StatCard: React.FC<{ icon: string, title: string, value: string | number, subtitle?: string, color: string }> = ({ icon, title, value, subtitle, color }) => (
    <div className={`bg-card-light dark:bg-card-dark rounded-xl shadow-md p-5 border-l-4 ${color} transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-text-muted-light dark:text-text-muted-dark text-sm font-semibold uppercase">{title}</p>
                <p className="text-3xl font-bold text-text-light dark:text-text-dark">{value}</p>
                {subtitle && <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">{subtitle}</p>}
            </div>
            <div className="text-4xl">{icon}</div>
        </div>
    </div>
);

const DonutChart: React.FC<{ percentage: number, color: string }> = ({ percentage, color }) => {
    const strokeWidth = 10;
    const radius = 50 - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle className="text-slate-200 dark:text-slate-700" stroke="currentColor" cx="50" cy="50" r={radius} strokeWidth={strokeWidth} fill="transparent" />
                <circle
                    className={color}
                    stroke="currentColor"
                    cx="50"
                    cy="50"
                    r={radius}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                    style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{Math.round(percentage)}%</span>
            </div>
        </div>
    );
};


export const AdminStatsScreen: React.FC<AdminStatsScreenProps> = ({ allUsers, chapters, quizzes }) => {

    const stats = useMemo(() => {
        const totalStudents = allUsers.length;
        if (totalStudents === 0) return {
            totalStudents: 0, activeStudents: 0, inactiveStudents: 0, activePercentage: 0,
            averageLevel: 0, gradeDistribution: [], chapterPopularity: [], topStudents: []
        };
        
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const activeStudents = allUsers.filter(u => u.lastLogin && new Date(u.lastLogin) > weekAgo).length;
        
        const gradeDistribution = GRADES.map((grade, index) => ({
            name: grade.name,
            count: allUsers.filter(u => u.gradeIndex === index).length
        }));

        const chapterPopularity = chapters.map(chapter => ({
            ...chapter,
            consultations: allUsers.filter(u => u.consultedChapters.includes(chapter.id)).length
        })).sort((a, b) => b.consultations - a.consultations);

        const topStudents = [...allUsers].sort((a, b) => b.xp - a.xp).slice(0, 5);
        
        return {
            totalStudents,
            activeStudents,
            inactiveStudents: totalStudents - activeStudents,
            activePercentage: (activeStudents / totalStudents) * 100,
            averageLevel: Math.round(allUsers.reduce((acc, u) => acc + u.level, 0) / totalStudents),
            gradeDistribution,
            chapterPopularity,
            topStudents
        };
    }, [allUsers, chapters]);

    const maxGradeCount = Math.max(...stats.gradeDistribution.map(g => g.count), 0);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold">📈 Statistiques de la classe</h1>
                <p className="text-text-muted-light dark:text-text-muted-dark mt-1">Analyse de la progression et de l'engagement des élèves.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon="👥" title="Total Élèves" value={stats.totalStudents} color="border-blue-500" />
                <StatCard icon="✅" title="Élèves Actifs" value={stats.activeStudents} subtitle="Connectés cette semaine" color="border-green-500" />
                <StatCard icon="📊" title="Niveau Moyen" value={stats.averageLevel} color="border-purple-500" />
                <StatCard icon="📝" title="Quiz Créés" value={quizzes.length} color="border-orange-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Charts */}
                <div className="lg:col-span-2 bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-md">
                    <h3 className="font-bold text-lg mb-4">Taux d'activité</h3>
                    <div className="flex items-center justify-center gap-6">
                        <DonutChart percentage={stats.activePercentage} color="text-green-500" />
                        <div className="space-y-2">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div><div><strong>{stats.activeStudents} Actifs</strong></div></div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-300"></div><div><strong>{stats.inactiveStudents} Inactifs</strong></div></div>
                        </div>
                    </div>
                </div>
                 <div className="lg:col-span-3 bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-md">
                    <h3 className="font-bold text-lg mb-4">Répartition par grade</h3>
                    <div className="flex items-end gap-2 h-40">
                        {stats.gradeDistribution.map(grade => (
                            <div key={grade.name} className="flex-1 flex flex-col items-center justify-end" title={`${grade.name}: ${grade.count} élève(s)`}>
                                <div className="font-bold text-sm">{grade.count}</div>
                                <div className="w-full bg-blue-500 rounded-t-md hover:bg-blue-400" style={{ height: `${maxGradeCount > 0 ? (grade.count / maxGradeCount) * 90 : 0}%`, transition: 'height 0.5s ease-out' }}></div>
                                <div className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1 whitespace-nowrap overflow-hidden text-ellipsis">{grade.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chapter Popularity */}
                <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-md">
                     <h3 className="font-bold text-lg mb-4">📈 Chapitres les plus consultés</h3>
                     <ul className="space-y-2 max-h-80 overflow-y-auto">
                        {stats.chapterPopularity.map(chap => (
                            <li key={chap.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <span className="font-semibold">{chap.icon} {chap.title}</span>
                                <span className="font-bold text-primary dark:text-primary-light">{chap.consultations} consult.</span>
                            </li>
                        ))}
                     </ul>
                </div>
                {/* Top Students */}
                 <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-md">
                     <h3 className="font-bold text-lg mb-4">🏆 Top 5 des élèves (XP)</h3>
                     <table className="w-full text-left text-sm">
                        <tbody>
                            {stats.topStudents.map((student, index) => (
                                <tr key={student.id} className="border-b border-border-light dark:border-border-dark last:border-none">
                                    <td className="py-3 font-bold text-lg">{['🥇', '🥈', '🥉', '4', '5'][index]}</td>
                                    <td className="py-3 font-semibold">{student.name}</td>
                                    <td className="py-3 text-text-muted-light dark:text-text-muted-dark">{GRADES[student.gradeIndex].name}</td>
                                    <td className="py-3 font-bold text-right text-blue-500">{student.xp.toLocaleString('fr-FR')} XP</td>
                                </tr>
                            ))}
                        </tbody>
                     </table>
                </div>
            </div>
        </div>
    );
};
