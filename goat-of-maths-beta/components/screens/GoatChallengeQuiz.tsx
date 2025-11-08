import React, { useState, useEffect, useRef } from 'react';
import { QuizQuestion } from '../../types';
import { GOAT_CHALLENGE_SETTINGS } from '../../constants';

interface GoatChallengeQuizProps {
  questions: QuizQuestion[];
  onComplete: (score: number, timeTaken: number) => void;
}

export const GoatChallengeQuiz: React.FC<GoatChallengeQuizProps> = ({ questions, onComplete }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
    const [timeLeft, setTimeLeft] = useState(GOAT_CHALLENGE_SETTINGS.DURATION_SECONDS);
    const [showResults, setShowResults] = useState(false);
    const startTime = useRef(Date.now());

    const currentQuestion = questions[currentQuestionIndex];

    // Timer logic
    useEffect(() => {
        if (timeLeft <= 0) {
            endQuiz();
            return;
        }
        const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleAnswerSelect = (optionIndex: number) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = optionIndex;
        setAnswers(newAnswers);
    };

    const endQuiz = () => {
        const timeTaken = Date.now() - startTime.current;
        let finalScore = 0;
        answers.forEach((answerIndex, questionIndex) => {
            if (answerIndex !== null && questions[questionIndex].correctOptionIndex === answerIndex) {
                finalScore++;
            }
        });
        setShowResults(true);
        setTimeout(() => onComplete(finalScore, timeTaken), 2000); // Wait 2s on results screen
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            endQuiz();
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };
    
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
    
    if(showResults) {
        return (
             <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <span className="text-7xl animate-pulse">👑</span>
                <h2 className="text-3xl font-extrabold mt-4">Défi terminé !</h2>
                <p className="text-xl text-text-muted-light dark:text-text-muted-dark">Calcul de tes résultats...</p>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-6 flex flex-col h-full bg-slate-900 text-white rounded-xl">
             {/* Header */}
            <div className="mb-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-amber-300">Défi du GOAT</h2>
                    <div className={`px-4 py-2 rounded-lg text-lg font-bold ${timeLeft < 30 ? 'bg-red-500 animate-pulse' : 'bg-slate-700'}`}>
                        ⏱️ {minutes}:{String(seconds).padStart(2, '0')}
                    </div>
                </div>
                 <div className="mt-4">
                    <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="bg-amber-400 h-2 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Question */}
             <div className="flex-grow flex flex-col items-center justify-center text-center">
                <p className="text-sm font-bold text-slate-400">Question {currentQuestionIndex + 1}/{questions.length}</p>
                <p className="text-xl md:text-2xl font-semibold my-6">{currentQuestion.questionText}</p>
                 <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQuestion.options.map((option, index) => {
                        const isSelected = answers[currentQuestionIndex] === index;
                        return (
                            <button 
                                key={index} 
                                onClick={() => handleAnswerSelect(index)}
                                className={`p-4 rounded-xl font-bold text-lg text-left transition-all duration-200 ${isSelected ? 'bg-amber-500 ring-2 ring-white' : 'bg-slate-800 hover:bg-slate-700'}`}
                            >
                                <span className="mr-2">{['A', 'B', 'C', 'D'][index]}.</span> {option}
                            </button>
                        );
                    })}
                 </div>
            </div>

            {/* Footer Navigation */}
            <div className="mt-6 flex justify-between items-center">
                <button onClick={handlePrev} disabled={currentQuestionIndex === 0} className="px-6 py-3 rounded-lg font-bold bg-slate-700 hover:bg-slate-600 disabled:opacity-50">
                    ← Précédent
                </button>
                 {currentQuestionIndex === questions.length - 1 ? (
                     <button onClick={endQuiz} className="px-6 py-3 rounded-lg font-bold bg-green-600 hover:bg-green-500 shadow-lg">
                        Terminer et voir mon score 🏁
                    </button>
                 ) : (
                    <button onClick={handleNext} className="px-6 py-3 rounded-lg font-bold bg-amber-500 hover:bg-amber-400">
                        Suivant →
                    </button>
                 )}
            </div>
        </div>
    );
};