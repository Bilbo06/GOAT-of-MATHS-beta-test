import React, { useState, useEffect } from 'react';
import { AppSettings } from '../../../types';

interface ResetProgressModalProps {
    onClose: () => void;
    onConfirm: () => void;
}

const ResetProgressModal: React.FC<ResetProgressModalProps> = ({ onClose, onConfirm }) => {
    const [confirmText, setConfirmText] = useState('');
    const requiredText = "RÉINITIALISER";

    const handleConfirm = () => {
        if (confirmText === requiredText) {
            onConfirm();
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 w-full max-w-lg border-t-4 border-red-500">
                <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">⚠️ Réinitialiser la progression</h2>
                <p className="my-4 text-text-muted-light dark:text-text-muted-dark">
                    Cette action est critique et irréversible. Elle réinitialisera le niveau, l'XP, les pièces, les chapitres consultés et l'historique de <strong>tous les élèves</strong> à zéro. Leurs comptes et mots de passe seront conservés.
                </p>
                <label className="font-bold">Pour confirmer, tapez "<span className="font-mono text-primary dark:text-primary-light">{requiredText}</span>" ci-dessous :</label>
                <input
                    type="text"
                    value={confirmText}
                    onChange={e => setConfirmText(e.target.value)}
                    className="w-full mt-2 px-3 py-2 rounded-md bg-background-light dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600"
                />
                <div className="flex gap-4 mt-6">
                    <button onClick={onClose} className="w-full py-3 rounded-lg font-bold bg-slate-200 dark:bg-slate-700">Annuler</button>
                    <button onClick={handleConfirm} disabled={confirmText !== requiredText} className="w-full py-3 rounded-lg bg-red-600 text-white font-bold disabled:bg-slate-400 disabled:cursor-not-allowed">Réinitialiser la progression</button>
                </div>
            </div>
        </div>
    );
};

interface AdminSettingsScreenProps {
    initialSettings: AppSettings;
    onSave: (newSettings: AppSettings) => void;
    onResetAllStudentProgress: () => void;
}

export const AdminSettingsScreen: React.FC<AdminSettingsScreenProps> = ({ initialSettings, onSave, onResetAllStudentProgress }) => {
    const [settings, setSettings] = useState<AppSettings>(initialSettings);
    const [isSaved, setIsSaved] = useState(false);
    const [isResetModalOpen, setResetModalOpen] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // Convert to number if the key suggests it should be numeric
        const isNumeric = ['xpPerChapterConsultation', 'coinsPerQuizCompletion', 'maxDailyDuels', 'passwordResetFrequencyDays'].includes(name);
        setSettings(prev => ({ ...prev, [name]: isNumeric ? Number(value) : value }));
    };

    const handleSave = () => {
        onSave(settings);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
             {isResetModalOpen && <ResetProgressModal onClose={() => setResetModalOpen(false)} onConfirm={onResetAllStudentProgress} />}
            <div>
                <h1 className="text-3xl font-extrabold">⚙️ Paramètres de l'application</h1>
                <p className="text-text-muted-light dark:text-text-muted-dark mt-1">Configurer les règles globales et les options de l'application.</p>
            </div>
            
            {/* Gamification Settings */}
            <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-md">
                <h2 className="text-xl font-bold border-b border-border-light dark:border-border-dark pb-3 mb-4">Paramètres de Gamification</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="font-bold text-text-light dark:text-text-dark">XP par chapitre consulté</label>
                        <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-1">XP gagné lors de la première consultation d'un chapitre.</p>
                        <input type="number" name="xpPerChapterConsultation" value={settings.xpPerChapterConsultation} onChange={handleChange} className="w-full px-3 py-2 rounded-md bg-background-light dark:bg-slate-800 border-2 border-border-light dark:border-border-dark"/>
                    </div>
                     <div>
                        <label className="font-bold text-text-light dark:text-text-dark">Pièces par quiz terminé</label>
                        <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-1">Pièces gagnées pour avoir terminé un quiz (score > 50%).</p>
                        <input type="number" name="coinsPerQuizCompletion" value={settings.coinsPerQuizCompletion} onChange={handleChange} className="w-full px-3 py-2 rounded-md bg-background-light dark:bg-slate-800 border-2 border-border-light dark:border-border-dark"/>
                    </div>
                     <div>
                        <label className="font-bold text-text-light dark:text-text-dark">Duels classés max / jour</label>
                        <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-1">Limite quotidienne de duels avec récompenses.</p>
                        <input type="number" name="maxDailyDuels" value={settings.maxDailyDuels} onChange={handleChange} className="w-full px-3 py-2 rounded-md bg-background-light dark:bg-slate-800 border-2 border-border-light dark:border-border-dark"/>
                    </div>
                </div>
            </div>

             {/* Security Settings */}
            <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-md">
                <h2 className="text-xl font-bold border-b border-border-light dark:border-border-dark pb-3 mb-4">Paramètres de Sécurité</h2>
                 <div>
                    <label className="font-bold text-text-light dark:text-text-dark">Forcer le changement de mot de passe</label>
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-1">Oblige les élèves à changer leur mot de passe périodiquement.</p>
                    <select name="passwordResetFrequencyDays" value={settings.passwordResetFrequencyDays} onChange={handleChange} className="w-full px-3 py-2 rounded-md bg-background-light dark:bg-slate-800 border-2 border-border-light dark:border-border-dark">
                        <option value={0}>Jamais</option>
                        <option value={90}>Tous les 90 jours</option>
                        <option value={180}>Tous les 180 jours</option>
                        <option value={365}>Tous les ans</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-end items-center gap-4">
                {isSaved && <span className="text-green-500 font-semibold animate-pulse">Enregistré !</span>}
                <button onClick={handleSave} className="px-6 py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary-hover shadow-lg transition-all">
                    Enregistrer les modifications
                </button>
            </div>
            
            {/* Danger Zone */}
            <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-md border-2 border-red-500/50 mt-12">
                <h2 className="text-xl font-bold text-red-600 dark:text-red-400">Zone de Danger</h2>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark my-2">Les actions ci-dessous sont irréversibles. Soyez prudent.</p>
                <div className="flex justify-between items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg mt-4">
                    <div>
                        <p className="font-bold">Réinitialiser la progression des élèves</p>
                        <p className="text-xs text-text-muted-light dark:text-text-muted-dark">Remet à zéro l'XP, le niveau et les pièces de tous les élèves.</p>
                    </div>
                    <button onClick={() => setResetModalOpen(true)} className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 whitespace-nowrap">
                        Réinitialiser la progression
                    </button>
                </div>
            </div>
        </div>
    );
};
