import React from 'react';
import { Quiz, UserData, Chapter } from '../../types';

interface QuizListScreenProps {
  userData: UserData;
  quizzes: Quiz[];
  chapters: Chapter[];
  onStartQuiz: (quizId: string) => void;
}

const QuizCard: React.FC<{
  quiz: Quiz;
  chapter: Chapter | undefined;
  bestScoreData: { bestScore: number } | undefined;
  onStart: () => void;
}> = ({ quiz, chapter, bestScoreData, onStart }) => {
  const totalQuestions = quiz.questions.length;
  const isCompleted = bestScoreData !== undefined;
  const scorePercentage = isCompleted ? Math.round((bestScoreData.bestScore / totalQuestions) * 100) : 0;

  return (
    <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-md p-5 border-l-4 border-amber-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Left Part */}
        <div className="flex-grow flex items-center gap-4 w-full">
          <div className="text-5xl flex-shrink-0">{chapter?.icon || '📝'}</div>
          <div className="flex-grow">
            <h3 className="text-lg font-bold text-text-light dark:text-text-dark">{quiz.title}</h3>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Lié au chapitre : {chapter?.title || 'Inconnu'}</p>
            {isCompleted ? (
              <div className="flex items-center gap-2 mt-2">
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: `${scorePercentage}%` }}></div>
                </div>
                <span className="text-sm font-bold text-primary dark:text-primary-light whitespace-nowrap">
                  {bestScoreData.bestScore}/{totalQuestions}
                </span>
              </div>
            ) : (
              <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">
                Pas encore tenté
              </p>
            )}
          </div>
        </div>
        {/* Right Part */}
        <div className="w-full md:w-auto flex-shrink-0 mt-4 md:mt-0">
          <button
            onClick={onStart}
            className="w-full md:w-auto px-6 py-3 rounded-lg font-bold text-white transition-colors bg-primary hover:bg-primary-hover shadow-md"
          >
            {isCompleted ? 'Refaire' : 'Commencer'}
          </button>
        </div>
      </div>
    </div>
  );
};


export const QuizListScreen: React.FC<QuizListScreenProps> = ({ userData, quizzes, chapters, onStartQuiz }) => {
  return (
    <div className="p-4 md:p-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-text-light dark:text-text-dark">📝 Centre des Quiz</h2>
        <p className="text-md text-text-muted-light dark:text-text-muted-dark mt-1">Teste tes connaissances et gagne de l'XP !</p>
      </div>
      <div className="max-w-4xl mx-auto space-y-4">
        {quizzes.map((quiz) => {
          const chapter = chapters.find(c => c.id === quiz.chapterId);
          const bestScoreData = userData.completedQuizzes.find(cq => cq.quizId === quiz.id);
          return (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              chapter={chapter}
              bestScoreData={bestScoreData}
              onStart={() => onStartQuiz(quiz.id)}
            />
          );
        })}
         {quizzes.length === 0 && (
            <div className="text-center py-16">
                <p className="text-5xl mb-4">🤷</p>
                <h3 className="text-xl font-semibold">Aucun quiz disponible</h3>
                <p className="text-text-muted-light dark:text-text-muted-dark mt-1">Revenez plus tard, des quiz seront bientôt ajoutés !</p>
            </div>
        )}
      </div>
    </div>
  );
};