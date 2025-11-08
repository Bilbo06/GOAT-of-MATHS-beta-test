import React, { useMemo, useState } from 'react';
import { UserData, Chapter, Quiz, QuizQuestion } from '../../types';

interface RevisionsScreenProps {
  userData: UserData;
  chapters: Chapter[];
  quizzes: Quiz[];
  onStartReviewQuiz: () => void;
}

const FlashcardModal: React.FC<{ questions: QuizQuestion[]; onClose: () => void; }> = ({ questions, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const currentQuestion = questions[currentIndex];

    const handleNext = () => {
        setIsFlipped(false);
        setCurrentIndex(i => (i + 1) % questions.length);
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setCurrentIndex(i => (i - 1 + questions.length) % questions.length);
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 w-full max-w-lg relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-3 right-3 text-2xl font-bold">&times;</button>
                <h3 className="text-xl font-bold text-center mb-4">Flashcards de révision</h3>
                
                <div className="perspective-1000 h-64">
                    <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`} onClick={() => setIsFlipped(!isFlipped)}>
                        {/* Front */}
                        <div className="absolute w-full h-full backface-hidden bg-primary text-white flex items-center justify-center p-4 rounded-lg text-center text-xl font-semibold">
                            {currentQuestion.questionText}
                        </div>
                        {/* Back */}
                        <div className="absolute w-full h-full backface-hidden bg-green-500 text-white flex items-center justify-center p-4 rounded-lg text-center text-xl font-bold rotate-y-180">
                            {currentQuestion.options[currentQuestion.correctOptionIndex]}
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                    <button onClick={handlePrev} className="px-4 py-2 rounded-lg font-bold bg-slate-200 dark:bg-slate-700">← Précédent</button>
                    <p className="font-semibold">{currentIndex + 1} / {questions.length}</p>
                    <button onClick={handleNext} className="px-4 py-2 rounded-lg font-bold bg-slate-200 dark:bg-slate-700">Suivant →</button>
                </div>
            </div>
             <style>{`
                .perspective-1000 { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .rotate-y-180 { transform: rotateY(180deg); }
                .backface-hidden { backface-visibility: hidden; }
            `}</style>
        </div>
    );
};

export const RevisionsScreen: React.FC<RevisionsScreenProps> = ({ userData, chapters, quizzes, onStartReviewQuiz }) => {
    const [flashcardChapter, setFlashcardChapter] = useState<Chapter | null>(null);

    const chapterPerformance = useMemo(() => {
        const performance = userData.quizPerformance || {};
        const allQuestions = quizzes.flatMap(q => q.questions.map(question => ({ ...question, chapterId: q.chapterId })));
        
        const chapterStats = chapters.map(chapter => {
            const chapterQuestions = allQuestions.filter(q => q.chapterId === chapter.id);
            if (chapterQuestions.length === 0) {
                return { chapter, total: 0, correct: 0, incorrect: 0, mastery: -1 }; // -1 indicates no data
            }
            
            let totalCorrect = 0;
            let totalIncorrect = 0;

            chapterQuestions.forEach(q => {
                const stats = performance[q.id];
                if (stats) {
                    totalCorrect += stats.correct;
                    totalIncorrect += stats.incorrect;
                }
            });

            const totalAttempts = totalCorrect + totalIncorrect;
            const mastery = totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : -1;
            
            return { chapter, total: totalAttempts, correct: totalCorrect, incorrect: totalIncorrect, mastery };
        });

        return chapterStats.filter(s => s.mastery !== -1).sort((a, b) => a.mastery - b.mastery);

    }, [userData.quizPerformance, chapters, quizzes]);

    const weakChapters = chapterPerformance.slice(0, 3);

    const getFlashcardQuestions = (chapterId: string): QuizQuestion[] => {
        return quizzes.filter(q => q.chapterId === chapterId).flatMap(q => q.questions);
    };

    return (
        <div className="p-4 md:p-6 space-y-6">
            {flashcardChapter && <FlashcardModal questions={getFlashcardQuestions(flashcardChapter.id)} onClose={() => setFlashcardChapter(null)} />}

            <div className="text-center">
                <h2 className="text-4xl font-bold text-text-light dark:text-text-dark">🧠 Centre de Révision</h2>
                <p className="text-md text-text-muted-light dark:text-text-muted-dark mt-1">Identifie tes faiblesses et transforme-les en forces !</p>
            </div>
            
            <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-lg border border-primary/20 text-center">
                <h3 className="text-2xl font-bold text-primary dark:text-primary-light">Quiz de révision personnalisé</h3>
                <p className="my-2 max-w-2xl mx-auto text-text-muted-light dark:text-text-muted-dark">
                    Le système a analysé tes réponses passées pour créer un quiz sur mesure, contenant les 10 questions que tu as le plus ratées.
                    C'est le moyen le plus rapide de progresser !
                </p>
                <button 
                    onClick={onStartReviewQuiz}
                    className="mt-4 px-8 py-4 rounded-lg text-white font-bold text-lg bg-gradient-to-r from-primary to-blue-700 hover:from-primary-hover hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
                    🧠 Lancer mon quiz de révision
                </button>
            </div>

            <div>
                <h3 className="text-xl font-bold mb-3">Tes points faibles à travailler</h3>
                 {weakChapters.length > 0 ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         {weakChapters.map(({ chapter, mastery, incorrect }) => (
                             <div key={chapter.id} className="bg-card-light dark:bg-card-dark p-5 rounded-xl shadow-md border-l-4 border-red-500">
                                 <div className="flex items-start gap-4">
                                     <span className="text-4xl">{chapter.icon}</span>
                                     <div className="flex-grow">
                                         <h4 className="font-bold">{chapter.title}</h4>
                                         <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Maîtrise : <span className="font-bold text-red-500">{mastery.toFixed(0)}%</span></p>
                                         <p className="text-xs text-red-600 dark:text-red-400">{incorrect} {incorrect > 1 ? 'réponses incorrectes' : 'réponse incorrecte'}</p>
                                     </div>
                                 </div>
                                 <button
                                    onClick={() => setFlashcardChapter(chapter)}
                                    className="w-full mt-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 font-semibold text-sm hover:bg-red-200"
                                >
                                    Réviser en Flashcards
                                </button>
                             </div>
                         ))}
                     </div>
                 ) : (
                     <div className="text-center py-10 bg-card-light dark:bg-card-dark rounded-xl">
                         <p className="text-5xl mb-4">🎉</p>
                         <h3 className="text-xl font-semibold">Aucun point faible détecté !</h3>
                         <p className="text-text-muted-light dark:text-text-muted-dark mt-1">Continue de faire des quiz pour que le système puisse t'aider.</p>
                     </div>
                 )}
            </div>
        </div>
    );
};