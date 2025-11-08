import React, { useState, useMemo } from 'react';
import { Quiz, QuizQuestion } from '../../types';

interface QuizScreenProps {
  quiz: Quiz;
  onComplete: (results: { questionId: string, isCorrect: boolean }[]) => void;
}

const ResultsModal: React.FC<{ score: number; total: number; onExit: () => void; onReview: () => void; }> = ({ score, total, onExit, onReview }) => {
    const percentage = Math.round((score / total) * 100);
    const isPerfect = percentage === 100;

    const resultInfo = useMemo(() => {
        if (percentage >= 80) return { emoji: '🏆', title: 'Excellent !', message: 'Tu maîtrises le sujet !' };
        if (percentage >= 50) return { emoji: '👍', title: 'Pas mal !', message: 'Continue comme ça !' };
        return { emoji: '🤔', title: 'Oups...', message: "N'hésite pas à revoir le cours et à réessayer." };
    }, [percentage]);

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-card-light dark:bg-card-dark rounded-2xl p-8 w-full max-w-md text-center transform transition-all animate-scale-in">
                <span className="text-7xl">{isPerfect ? '⭐' : resultInfo.emoji}</span>
                <h2 className="text-3xl font-extrabold mt-4">{isPerfect ? 'Score Parfait !' : resultInfo.title}</h2>
                <p className="text-5xl font-bold my-4 text-primary dark:text-primary-light">{score} / {total}</p>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 mb-4">
                    <div className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full" style={{ width: `${percentage}%` }}></div>
                </div>
                <p className="text-text-muted-light dark:text-text-muted-dark">{resultInfo.message}</p>
                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                    <button 
                        onClick={onReview}
                        className="w-full py-3 rounded-lg bg-slate-200 dark:bg-slate-700 font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                    >
                        Revoir mes réponses
                    </button>
                    <button 
                        onClick={onExit}
                        className="w-full py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary-hover transition-colors"
                    >
                        Retour aux chapitres
                    </button>
                </div>
            </div>
        </div>
    );
};


export const QuizScreen: React.FC<QuizScreenProps> = ({ quiz, onComplete }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number | string | null>>({});
    const [isAnswered, setIsAnswered] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [isReviewMode, setReviewMode] = useState(false);

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const currentAnswer = answers[currentQuestion.id] ?? null;

    const handleAnswerChange = (questionId: string, answer: number | string) => {
        if (isAnswered) return;
        
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const handleSubmitAnswer = () => {
        if (currentAnswer === null) return;
        setIsAnswered(true);
    };

    const handleNext = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setIsAnswered(false);
        } else {
            setShowResults(true);
        }
    };
    
    const handleExit = () => {
        const results = quiz.questions.map((q) => {
            const userAnswer = answers[q.id];
            let isCorrect = false;
            if (q.type === 'mcq') {
                isCorrect = userAnswer === q.correctOptionIndex;
            } else if (q.type === 'fill-in-the-blank') {
                isCorrect = typeof userAnswer === 'string' && userAnswer.toLowerCase().trim() === q.correctAnswer?.toLowerCase().trim();
            }
            return { questionId: q.id, isCorrect };
        });
        onComplete(results);
    };

    const handleReview = () => {
        setShowResults(false);
        setReviewMode(true);
    };

    const score = useMemo(() => {
        return quiz.questions.reduce((acc, q) => {
            const userAnswer = answers[q.id];
            let isCorrect = false;
            if (q.type === 'mcq') {
                isCorrect = userAnswer === q.correctOptionIndex;
            } else if (q.type === 'fill-in-the-blank') {
                isCorrect = typeof userAnswer === 'string' && userAnswer.toLowerCase().trim() === q.correctAnswer?.toLowerCase().trim();
            }
            return acc + (isCorrect ? 1 : 0);
        }, 0);
    }, [answers, quiz.questions]);

    const progressPercentage = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
    
    if (isReviewMode) {
        return (
            <div className="p-4 md:p-6 flex flex-col h-full animate-fade-in">
                <h2 className="text-2xl font-bold text-center mb-4 text-primary dark:text-primary-light">🔍 Correction du Quiz</h2>
                <div className="flex-grow space-y-4 overflow-y-auto pr-2">
                    {quiz.questions.map((q, index) => {
                        const userAnswer = answers[q.id];
                        let isCorrect = false;
                        let correctAnswerText = '';

                        if (q.type === 'mcq') {
                            isCorrect = userAnswer === q.correctOptionIndex;
                            correctAnswerText = q.options?.[q.correctOptionIndex!] || '';
                        } else if (q.type === 'fill-in-the-blank') {
                            isCorrect = typeof userAnswer === 'string' && userAnswer.toLowerCase().trim() === q.correctAnswer?.toLowerCase().trim();
                            correctAnswerText = q.correctAnswer || '';
                        }

                        return (
                            <div key={q.id} className="bg-card-light dark:bg-card-dark p-4 rounded-lg border-l-4" style={{borderColor: isCorrect ? '#22c55e' : '#ef4444'}}>
                                <p className="font-bold">{index + 1}. {q.questionText}</p>
                                <div className="mt-2 space-y-1 text-sm">
                                    {q.type === 'mcq' && q.options?.map((opt, optIndex) => {
                                        const isUserChoice = optIndex === userAnswer;
                                        const isCorrectChoice = optIndex === q.correctOptionIndex;
                                        let textStyle = "text-text-muted-light dark:text-text-muted-dark";
                                        if (isCorrectChoice) textStyle = "font-bold text-green-600 dark:text-green-400";
                                        if (isUserChoice && !isCorrect) textStyle = "font-bold text-red-600 dark:text-red-400 line-through";
                                        
                                        return <p key={optIndex} className={textStyle}>{isUserChoice ? '●' : '○'} {opt}</p>
                                    })}
                                    {q.type === 'fill-in-the-blank' && (
                                        <>
                                            <p>Votre réponse : <span className={isCorrect ? "font-bold text-green-600" : "font-bold text-red-600 line-through"}>{String(userAnswer)}</span></p>
                                            {!isCorrect && <p>Bonne réponse : <span className="font-bold text-green-600">{correctAnswerText}</span></p>}
                                        </>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <button onClick={handleExit} className="w-full mt-6 py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary-hover">
                    Retour aux chapitres
                </button>
            </div>
        )
    }

    const renderQuestionBody = () => {
        if (currentQuestion.type === 'mcq') {
            return (
                <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQuestion.options!.map((option, index) => {
                        const isCorrect = index === currentQuestion.correctOptionIndex;
                        const isSelected = index === currentAnswer;
                        
                        let buttonClass = 'bg-card-light dark:bg-card-dark border-2 border-border-light dark:border-border-dark hover:bg-slate-100 dark:hover:bg-slate-800';
                        if (isAnswered) {
                            if (isCorrect) buttonClass = 'bg-green-500 text-white border-green-500 animate-pulse-once';
                            else if (isSelected && !isCorrect) buttonClass = 'bg-red-500 text-white border-red-500';
                            else buttonClass = 'bg-slate-200 dark:bg-slate-700 opacity-60';
                        } else if(isSelected) {
                            buttonClass = 'bg-blue-200 dark:bg-blue-900 border-primary';
                        }

                        return (
                            <button 
                                key={index} 
                                onClick={() => handleAnswerChange(currentQuestion.id, index)}
                                disabled={isAnswered}
                                className={`p-4 rounded-xl font-bold text-lg text-left transition-all duration-300 ${buttonClass}`}
                            >
                                <span className="mr-2">{['A', 'B', 'C', 'D'][index]}.</span> {option}
                            </button>
                        );
                    })}
                </div>
            );
        }
        if (currentQuestion.type === 'fill-in-the-blank') {
            return (
                <div className="w-full max-w-md">
                    <input 
                        type="text" 
                        value={typeof currentAnswer === 'string' ? currentAnswer : ''}
                        onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                        disabled={isAnswered}
                        placeholder="Votre réponse..."
                        className={`w-full text-center p-4 rounded-xl font-bold text-lg border-2 transition-all duration-300 ${
                            isAnswered 
                                ? (currentAnswer as string)?.toLowerCase().trim() === currentQuestion.correctAnswer?.toLowerCase().trim()
                                    ? 'bg-green-500 text-white border-green-500' 
                                    : 'bg-red-500 text-white border-red-500'
                                : 'bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark focus:border-primary focus:ring-2 focus:ring-primary'
                        }`}
                    />
                     {isAnswered && (currentAnswer as string)?.toLowerCase().trim() !== currentQuestion.correctAnswer?.toLowerCase().trim() && (
                        <p className="mt-4 text-center text-lg">La bonne réponse était : <span className="font-bold text-green-500">{currentQuestion.correctAnswer}</span></p>
                    )}
                </div>
            );
        }
        return null;
    }

    return (
        <div className="p-4 md:p-6 flex flex-col h-full">
            {showResults && <ResultsModal score={score} total={quiz.questions.length} onExit={handleExit} onReview={handleReview} />}

            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-center text-primary dark:text-primary-light">{quiz.title}</h2>
                <div className="mt-4">
                    <div className="flex justify-between text-sm font-bold text-text-muted-light dark:text-text-muted-dark mb-1">
                        <span>Progression</span>
                        <span>Question {currentQuestionIndex + 1}/{quiz.questions.length}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                        <div className="bg-primary h-3 rounded-full transition-all duration-300" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Question */}
            <div className="flex-grow flex flex-col items-center justify-center text-center bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-md">
                <p className="text-xl md:text-2xl font-semibold mb-8 text-text-light dark:text-text-dark">{currentQuestion.questionText}</p>
                {renderQuestionBody()}
            </div>

            {/* Footer */}
            <div className="mt-6 text-center h-14">
                {isAnswered ? (
                    <button 
                        onClick={handleNext} 
                        className="px-10 py-3 rounded-lg text-white font-bold bg-primary hover:bg-primary-hover shadow-lg animate-fade-in-up"
                    >
                        {currentQuestionIndex < quiz.questions.length - 1 ? 'Question suivante →' : 'Terminer le quiz ✨'}
                    </button>
                ) : (
                    <button
                        onClick={handleSubmitAnswer}
                        disabled={currentAnswer === null}
                        className="px-10 py-3 rounded-lg text-white font-bold bg-green-600 hover:bg-green-700 shadow-lg disabled:bg-slate-400 disabled:cursor-not-allowed"
                    >
                        Valider
                    </button>
                )}
            </div>
             <style>{`
                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
                @keyframes scale-in { 0% { opacity: 0; transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
                .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
                .animate-pulse-once { animation: pulse 0.5s ease-in-out; }
                @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
            `}</style>
        </div>
    );
};
