import React, { useState, useEffect } from 'react';
import { Chapter, Difficulty, UserData } from '../../../types';

const EMPTY_CHAPTER: Omit<Chapter, 'id' | 'teacherId' | 'teacherName'> = {
    title: '',
    icon: '📚',
    difficulty: 'Facile',
    rewardXp: 20,
    rewardCoins: 10,
    description: '',
    pdfUrl: undefined,
};

interface ChapterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (chapterData: Omit<Chapter, 'id'> | Chapter) => void;
    initialData: Omit<Chapter, 'id'> | Chapter | null;
    currentUser: UserData;
}

const ChapterModal: React.FC<ChapterModalProps> = ({ isOpen, onClose, onSave, initialData, currentUser }) => {
    const [chapter, setChapter] = useState(initialData || EMPTY_CHAPTER);
    const isEditing = initialData && 'id' in initialData;

    useEffect(() => {
        setChapter(initialData || EMPTY_CHAPTER);
    }, [initialData]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const parsedValue = (name === 'rewardXp' || name === 'rewardCoins') ? parseInt(value, 10) || 0 : value;
        setChapter(prev => ({ ...prev, [name]: parsedValue }));
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                alert("Veuillez sélectionner un fichier PDF.");
                return;
            }
            if (file.size > 1 * 1024 * 1024) { // 1MB limit
                alert("Le fichier est trop volumineux (max 1MB).");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setChapter(prev => ({ ...prev, pdfUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };


    const handleSubmit = () => {
        // Basic validation
        if (!chapter.title || !chapter.icon || !chapter.description) {
            alert("Veuillez remplir tous les champs principaux.");
            return;
        }
        
        const chapterPayload = {
            ...chapter,
            teacherId: currentUser.id,
            teacherName: currentUser.name,
        };
        onSave(chapterPayload);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6">{isEditing ? "Modifier le chapitre" : "Créer un nouveau chapitre"}</h2>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                            <label className="font-bold">Titre du chapitre</label>
                            <input type="text" name="title" value={chapter.title} onChange={handleChange} placeholder="Ex: Algèbre - Niveau 1" className="w-full mt-1 px-3 py-2 rounded-md bg-background-light dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600"/>
                        </div>
                        <div>
                            <label className="font-bold">Icône</label>
                            <input type="text" name="icon" value={chapter.icon} onChange={handleChange} placeholder="Ex: 📐" className="w-full mt-1 px-3 py-2 rounded-md bg-background-light dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600"/>
                        </div>
                    </div>
                     <div>
                        <label className="font-bold">Description</label>
                        <textarea name="description" value={chapter.description} onChange={handleChange} placeholder="Contenu du chapitre..." className="w-full mt-1 px-3 py-2 rounded-md bg-background-light dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 h-24"/>
                    </div>

                    <div>
                        <label className="font-bold">Support de cours (PDF)</label>
                        <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                {chapter.pdfUrl ? (
                                    <div>
                                        <p className="text-green-500 font-semibold">✅ PDF chargé.</p>
                                        <button onClick={() => setChapter(prev => ({...prev, pdfUrl: undefined}))} className="text-sm text-red-500 hover:underline">Supprimer</button>
                                    </div>
                                ) : (
                                    <>
                                        <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        <div className="flex text-sm text-slate-600 dark:text-slate-400">
                                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-slate-800 rounded-md font-medium text-primary hover:text-primary-hover focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary px-1">
                                                <span>Télécharger un fichier</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="application/pdf" onChange={handleFileChange} />
                                            </label>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-500">PDF uniquement, 1MB max</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                           <label className="font-bold">Difficulté</label>
                            <select name="difficulty" value={chapter.difficulty} onChange={handleChange} className="w-full mt-1 px-3 py-2 rounded-md bg-background-light dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600">
                                <option>Facile</option><option>Moyen</option><option>Difficile</option>
                            </select>
                        </div>
                         <div>
                           <label className="font-bold">Récompense XP</label>
                           <input type="number" name="rewardXp" value={chapter.rewardXp} onChange={handleChange} className="w-full mt-1 px-3 py-2 rounded-md bg-background-light dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600"/>
                        </div>
                        <div>
                           <label className="font-bold">Récompense Coins</label>
                           <input type="number" name="rewardCoins" value={chapter.rewardCoins} onChange={handleChange} className="w-full mt-1 px-3 py-2 rounded-md bg-background-light dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600"/>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4 mt-8">
                    <button onClick={onClose} className="w-full py-3 rounded-lg font-bold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Annuler</button>
                    <button onClick={handleSubmit} className="w-full py-3 rounded-lg bg-green-500 text-white font-bold hover:bg-green-600 transition-colors">💾 Enregistrer</button>
                </div>
            </div>
        </div>
    );
};


interface AdminContentScreenProps {
    chapters: Chapter[];
    currentUser: UserData;
    onAddChapter: (chapterData: Omit<Chapter, 'id'>) => void;
    onUpdateChapter: (chapterId: string, updates: Partial<Chapter>) => void;
    onDeleteChapter: (chapterId: string) => void;
}

export const AdminContentScreen: React.FC<AdminContentScreenProps> = ({ chapters, currentUser, onAddChapter, onUpdateChapter, onDeleteChapter }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);

    const handleOpenCreateModal = () => {
        setEditingChapter(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (chapter: Chapter) => {
        setEditingChapter(chapter);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingChapter(null);
    };

    const handleSave = (chapterData: Omit<Chapter, 'id'> | Chapter) => {
        if ('id' in chapterData && chapterData.id) {
            onUpdateChapter(chapterData.id, chapterData);
        } else {
            onAddChapter(chapterData);
        }
    };

    const handleDelete = (chapterId: string, chapterTitle: string) => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer le chapitre "${chapterTitle}" ? Cette action est irréversible.`)) {
            onDeleteChapter(chapterId);
        }
    };

    return (
        <div className="space-y-6">
            <ChapterModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSave}
                initialData={editingChapter}
                currentUser={currentUser}
            />

            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold">📚 Gestion du contenu</h1>
                    <p className="text-text-muted-light dark:text-text-muted-dark mt-1">Gérer les chapitres de cours disponibles pour les élèves.</p>
                </div>
                <button onClick={handleOpenCreateModal} className="px-5 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover shadow-md transition-all">
                    + Créer un chapitre
                </button>
            </div>
            
            {/* Chapters Grid */}
            {chapters.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {chapters.map(chapter => (
                        <div key={chapter.id} className="bg-card-light dark:bg-card-dark rounded-xl shadow-md p-5 flex flex-col border-l-4 border-primary transition-all hover:shadow-lg">
                            <div className="flex-grow">
                                <div className="flex justify-between items-start">
                                    <span className="text-5xl">{chapter.icon}</span>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        chapter.difficulty === 'Facile' ? 'bg-green-100 text-green-800' :
                                        chapter.difficulty === 'Moyen' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                    }`}>{chapter.difficulty}</span>
                                </div>
                                <h3 className="font-bold text-lg mt-3 flex items-center gap-2">
                                    {chapter.title}
                                    {chapter.pdfUrl && <span title="Contient un PDF">📄</span>}
                                </h3>
                                <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1 h-10 overflow-hidden">{chapter.description}</p>
                                <p className="text-xs font-semibold text-primary dark:text-primary-light mt-3">
                                    🎁 +{chapter.rewardXp} XP • +{chapter.rewardCoins} 🪙
                                </p>
                            </div>
                            <div className="flex gap-2 mt-4 pt-4 border-t border-border-light dark:border-border-dark">
                                <button onClick={() => handleOpenEditModal(chapter)} className="w-full py-2 rounded-md font-semibold bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600">✏️ Modifier</button>
                                <button onClick={() => handleDelete(chapter.id, chapter.title)} className="w-full py-2 rounded-md font-semibold bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900">🗑️ Supprimer</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                 <div className="text-center py-16 bg-card-light dark:bg-card-dark rounded-xl shadow-sm">
                    <p className="text-5xl mb-4">📚</p>
                    <h3 className="text-xl font-semibold text-text-light dark:text-text-dark">Aucun chapitre trouvé</h3>
                    <p className="text-text-muted-light dark:text-text-muted-dark mt-1">Commencez par créer votre premier chapitre de cours !</p>
                    <button onClick={handleOpenCreateModal} className="mt-6 px-5 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover shadow-md transition-all">
                        + Créer mon premier chapitre
                    </button>
                </div>
            )}
        </div>
    );
};