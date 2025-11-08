

import React, { useState } from 'react';
import { AdminTab, UserData, Chapter, Quiz, ReportedMessage, Guild, AppSettings } from '../../types';
import { AdminSidebar } from './AdminSidebar';
import { AdminDashboardScreen } from './screens/AdminDashboardScreen';
import { AdminStudentsScreen } from './screens/AdminStudentsScreen';
import { AdminTeachersScreen } from './screens/AdminTeachersScreen';
import { AdminContentScreen } from './screens/AdminContentScreen';
import { AdminQuizzesScreen } from './screens/AdminQuizzesScreen';
import { AdminStatsScreen } from './screens/AdminStatsScreen';
import { AdminModerationScreen } from './screens/AdminModerationScreen';
import { AdminGuildsScreen } from './screens/AdminGuildsScreen';
import { AdminSettingsScreen } from './screens/AdminSettingsScreen';

interface AdminPanelProps {
    currentUser: UserData;
    allUsers: UserData[];
    chapters: Chapter[];
    quizzes: Quiz[];
    reportedMessages: ReportedMessage[];
    allGuilds: Guild[];
    appSettings: AppSettings;
    onCreateUser: (fullName: string, classe: string, teacherId: string) => UserData | null;
    onCreateTeacher: (fullName: string) => UserData | null;
    onResetPassword: (userId: string) => string | null;
    onUpdateUser: (userId: string, updates: { name?: string; classe?: string }) => boolean;
    onAddBonus: (userId: string, xp: number, coins: number) => boolean;
    onDeleteUser: (userId: string) => boolean;
    onAddChapter: (chapterData: Omit<Chapter, 'id'>) => void;
    onUpdateChapter: (chapterId: string, updates: Partial<Chapter>) => void;
    onDeleteChapter: (chapterId: string) => void;
    onAddQuiz: (quizData: Omit<Quiz, 'id'>) => void;
    onUpdateQuiz: (quizId: string, updates: Partial<Quiz>) => void;
    onDeleteQuiz: (quizId: string) => void;
    onResolveReport: (reportId: string) => void;
    onMuteUser: (userId: string, hours: number) => void;
    onUnmuteUser: (userId: string) => void;
    onAdminDisbandGuild: (guildId: string) => boolean;
    onUpdateAppSettings: (newSettings: AppSettings) => void;
    onResetAllStudentProgress: () => void;
    onReturnToStudentApp: () => void;
    onAdminLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = (props) => {
    const { 
        currentUser, onReturnToStudentApp, onAdminLogout, allUsers, chapters, quizzes, reportedMessages, allGuilds, appSettings,
        onCreateUser, onCreateTeacher, onResetPassword, onUpdateUser, onAddBonus, onDeleteUser,
        onAddChapter, onUpdateChapter, onDeleteChapter,
        onAddQuiz, onUpdateQuiz, onDeleteQuiz,
        onResolveReport, onMuteUser, onUnmuteUser, onAdminDisbandGuild,
        onUpdateAppSettings, onResetAllStudentProgress
    } = props;
    const [activeTab, setActiveTab] = useState<AdminTab>(AdminTab.Students);

    const renderContent = () => {
        switch(activeTab) {
            case AdminTab.Dashboard:
                return <AdminDashboardScreen />;
            case AdminTab.Students:
                const visibleStudents = currentUser.role === 'teacher' 
                    ? allUsers.filter(u => u.teacherId === currentUser.id && u.role === 'student') 
                    : allUsers.filter(u => u.role === 'student');
                return <AdminStudentsScreen 
                            students={visibleStudents} 
                            currentUser={currentUser}
                            onCreateUser={onCreateUser}
                            onResetPassword={onResetPassword}
                            onUpdateUser={onUpdateUser}
                            onAddBonus={onAddBonus}
                            onDeleteUser={onDeleteUser}
                        />;
            case AdminTab.Teachers:
                 if (currentUser.role !== 'super_admin') return null;
                 return <AdminTeachersScreen
                            teachers={allUsers.filter(u => u.role === 'teacher')}
                            onCreateTeacher={onCreateTeacher}
                            onResetPassword={onResetPassword}
                            onDeleteUser={onDeleteUser}
                        />
            case AdminTab.Content:
                const visibleChapters = currentUser.role === 'teacher'
                    ? chapters.filter(c => c.teacherId === currentUser.id)
                    : chapters;
                return <AdminContentScreen 
                            chapters={visibleChapters}
                            currentUser={currentUser}
                            onAddChapter={onAddChapter}
                            onUpdateChapter={onUpdateChapter}
                            onDeleteChapter={onDeleteChapter}
                        />;
            case AdminTab.Quizzes:
                return <AdminQuizzesScreen 
                            quizzes={quizzes}
                            chapters={chapters}
                            onAddQuiz={onAddQuiz}
                            onUpdateQuiz={onUpdateQuiz}
                            onDeleteQuiz={onDeleteQuiz}
                        />;
            case AdminTab.Stats:
                return <AdminStatsScreen
                            allUsers={allUsers}
                            chapters={chapters}
                            quizzes={quizzes}
                        />;
            case AdminTab.Moderation:
                return <AdminModerationScreen
                            reportedMessages={reportedMessages}
                            allUsers={allUsers}
                            onResolveReport={onResolveReport}
                            onMuteUser={onMuteUser}
                            onUnmuteUser={onUnmuteUser}
                        />;
            case AdminTab.Guilds:
                return <AdminGuildsScreen
                            allGuilds={allGuilds}
                            allUsers={allUsers}
                            onDisbandGuild={onAdminDisbandGuild}
                        />;
            case AdminTab.Settings:
                return <AdminSettingsScreen
                            initialSettings={appSettings}
                            onSave={onUpdateAppSettings}
                            onResetAllStudentProgress={onResetAllStudentProgress}
                        />;
            default:
                return (
                    <div className="p-8 text-center">
                        <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">Section en construction 🚧</h1>
                        <p className="mt-2 text-text-muted-light dark:text-text-muted-dark">
                            Cette partie du panel professeur est en cours de développement.
                        </p>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-background-dark text-text-light dark:text-text-dark">
            <AdminSidebar 
                currentUser={currentUser}
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                onReturnToStudentApp={onReturnToStudentApp}
                onAdminLogout={onAdminLogout}
            />
            <main className="lg:ml-64 flex-1 p-4 md:p-8">
                {renderContent()}
            </main>
        </div>
    );
};