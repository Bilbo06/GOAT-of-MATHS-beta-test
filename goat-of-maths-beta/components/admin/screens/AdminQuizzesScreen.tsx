
import React, { useState } from 'react';
import { Quiz, QuizQuestion, Chapter } from '../../../types';

const EMPTY_QUIZ: Omit<Quiz, 'id'> = {
    title: '',
    chapterId: '',
    questions: []
};

// FIX: Property 'type' is missing in type '{ questionText: string; options: string[]; correctOptionIndex: number; }' but required in type 'Omit<QuizQuestion, "id">'.
const EMPTY_QUESTION: Omit<QuizQuestion, 'id'> = {
    questionText: '',
    type: 'mcq',
    options: ['', '', '', ''],
    correctOptionIndex: 0
};

interface QuizEditorProps {
    chapters: Chapter[];
    initialQuiz: Omit<Quiz, 'id'> | Quiz | null;
    onSave: (quizData: Omit<Quiz, 'id'> | Quiz) => void;
    onCancel: () => void;
}

const QuizEditor: React.FC<QuizEditorProps> = ({ chapters, initialQuiz, onSave, onCancel }) => {
    const [quiz, setQuiz] = useState(initialQuiz || { ...EMPTY_QUIZ, chapterId: chapters[0]?.id || '' });
    const isEditing = initialQuiz && 'id' in initialQuiz;

    const handleQuizChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setQuiz(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleQuestionChange = (qIndex: number, text: string) => {
        const newQuestions = [...quiz.questions];
        newQuestions[qIndex].questionText = text;
        setQuiz(prev => ({ ...prev, questions: newQuestions }));
    };

    const handleOptionChange = (qIndex: number, optIndex: number, text: string) => {
        const newQuestions = [...quiz.questions];
        if (!newQuestions[qIndex].options) {
            newQuestions[qIndex].options = ['', '', '', ''];
        }
        newQuestions[qIndex].options![optIndex] = text;
        setQuiz(prev => ({ ...prev, questions: newQuestions }));
    };
    
    const handleCorrectOptionChange = (qIndex: number, optIndex: number) => {
        const newQuestions = [...quiz.questions];
        newQuestions[qIndex].correctOptionIndex = optIndex;
        setQuiz(prev => ({ ...prev, questions: newQuestions }));
    };

    const addQuestion = () => {
        const newQuestion: QuizQuestion = { ...EMPTY_QUESTION, id: `q_${Date.now()}`};
        setQuiz(prev => ({ ...prev, questions: [...prev.questions, newQuestion] }));
    };

    const removeQuestion = (qIndex: number) => {
        if (window.confirm("Supprimer cette question ?")) {
            const newQuestions = quiz.questions.filter((_, index) => index !== qIndex);
            setQuiz(prev => ({ ...prev, questions: newQuestions }));
        }
    };
    
    const handleSubmit = () => {
        if (!quiz.title || !quiz.chapterId || quiz.questions.length === 0) {
            alert("Veuillez donner un titre, choisir un chapitre et ajouter au moins une question.");
            return;
        }
        onSave(quiz);
    };

    return (
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-lg border border-border-light dark:border-border-dark space-y-6">
            <h2 className="text-2xl font-bold">{isEditing ? "Modifier le quiz" : "Créer un nouveau quiz"}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="font-bold">Titre du quiz</label>
                    <input type="text" name="title" value={quiz.title} onChange={handleQuizChange} className="w-full mt-1 px-3 py-2 rounded-md bg-background-light dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600"/>
                </div>
                <div>
                    <label className="font-bold">Chapitre associé</label>
                    <select name="chapterId" value={quiz.chapterId} onChange={handleQuizChange} className="w-full mt-1 px-3 py-2 rounded-md bg-background-light dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600">
                        {chapters.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-bold border-b border-border-light dark:border-border-dark pb-2">Questions</h3>
                {quiz.questions.map((q, qIndex) => (
                    <div key={q.id} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-border-light dark:border-border-dark">
                        <div className="flex justify-between items-center mb-2">
                            <label className="font-bold">Question {qIndex + 1}</label>
                            <button onClick={() => removeQuestion(qIndex)} className="text-red-500 hover:text-red-700">🗑️</button>
                        </div>
                        <textarea value={q.questionText} onChange={(e) => handleQuestionChange(qIndex, e.target.value)} className="w-full p-2 rounded-md bg-background-light dark:bg-slate-800" />
                        
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                            {(q.options || []).map((opt, optIndex) => (
                                <div key={optIndex} className="flex items-center gap-2">
                                    <input type="radio" name={`correct_${q.id}`} checked={q.correctOptionIndex === optIndex} onChange={() => handleCorrectOptionChange(qIndex, optIndex)} />
                                    <input type="text" value={opt} onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)} placeholder={`Option ${optIndex + 1}`} className="w-full p-2 rounded-md bg-background-light dark:bg-slate-800" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                <button onClick={addQuestion} className="w-full py-2 rounded-lg border-2 border-dashed border-primary text-primary font-semibold hover:bg-primary/10 transition-colors">+ Ajouter une question</button>
            </div>
            
            <div className="flex gap-4 mt-6">
                <button onClick={onCancel} className="w-full py-3 rounded-lg font-bold bg-slate-200 dark:bg-slate-700">Annuler</button>
                <button onClick={handleSubmit} className="w-full py-3 rounded-lg bg-green-500 text-white font-bold">💾 Sauvegarder le Quiz</button>
            </div>
        </div>
    );
};


interface AdminQuizzesScreenProps {
    quizzes: Quiz[];
    chapters: Chapter[];
    onAddQuiz: (quizData: Omit<Quiz, 'id'>) => void;
    onUpdateQuiz: (quizId: string, updates: Partial<Quiz>) => void;
    onDeleteQuiz: (quizId: string) => void;
}

export const AdminQuizzesScreen: React.FC<AdminQuizzesScreenProps> = ({ quizzes, chapters, onAddQuiz, onUpdateQuiz, onDeleteQuiz }) => {
    const [view, setView] = useState<'list' | 'editor'>('list');
    const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

    const handleCreateClick = () => {
        setEditingQuiz(null);
        setView('editor');
    };

    const handleEditClick = (quiz: Quiz) => {
        setEditingQuiz(quiz);
        setView('editor');
    };

    const handleCancel = () => {
        setView('list');
        setEditingQuiz(null);
    };

    const handleSave = (quizData: Omit<Quiz, 'id'> | Quiz) => {
        if ('id' in quizData) {
            onUpdateQuiz(quizData.id, quizData);
        } else {
            onAddQuiz(quizData);
        }
        setView('list');
    };
    
    const handleDelete = (quizId: string, quizTitle: string) => {
        if(window.confirm(`Supprimer le quiz "${quizTitle}" ?`)) {
            onDeleteQuiz(quizId);
        }
    };
    
    const getChapterTitle = (chapterId: string) => chapters.find(c => c.id === chapterId)?.title || "Chapitre inconnu";

    if (view === 'editor') {
        return <QuizEditor chapters={chapters} initialQuiz={editingQuiz} onSave={handleSave} onCancel={handleCancel} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold">📝 Gestion des quiz</h1>
                    <p className="text-text-muted-light dark:text-text-muted-dark mt-1">Créer et modifier les évaluations pour chaque chapitre.</p>
                </div>
                <button onClick={handleCreateClick} className="px-5 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover shadow-md transition-all">
                    + Créer un quiz
                </button>
            </div>

            <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-sm overflow-x-auto">
                 <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800">
                        <tr>
                            <th className="p-4 font-semibold">Titre du Quiz</th>
                            <th className="p-4 font-semibold">Chapitre Associé</th>
                            <th className="p-4 font-semibold">Nb. Questions</th>
                            <th className="p-4 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quizzes.map(quiz => (
                            <tr key={quiz.id} className="border-t border-border-light dark:border-border-dark">
                                <td className="p-4 font-medium">{quiz.title}</td>
                                <td className="p-4">{getChapterTitle(quiz.chapterId)}</td>
                                <td className="p-4 text-center font-bold">{quiz.questions.length}</td>
                                <td className="p-4 space-x-2">
                                    <button onClick={() => handleEditClick(quiz)} className="px-3 py-1 rounded bg-slate-200 dark:bg-slate-700 font-semibold hover:bg-slate-300 dark:hover:bg-slate-600">✏️ Modifier</button>
                                    <button onClick={() => handleDelete(quiz.id, quiz.title)} className="px-3 py-1 rounded bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 font-semibold hover:bg-red-200 dark:hover:bg-red-900">🗑️ Supprimer</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
                 {quizzes.length === 0 && <p className="text-center p-8 text-text-muted-light dark:text-text-muted-dark">Aucun quiz créé pour le moment.</p>}
            </div>
        </div>
    );
};
