import React from 'react';
import { Chapter, UserData, Difficulty, Quiz } from '../../types';

interface CoursesScreenProps {
  userData: UserData;
  chapters: Chapter[];
  quizzes: Quiz[];
  onViewChapter: (chapter: Chapter) => void;
  onStartQuiz: (quizId: string) => void;
}

const DifficultyBadge: React.FC<{ difficulty: Difficulty }> = ({ difficulty }) => {
  const styles: { [key in Difficulty]: string } = {
    Facile: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Moyen: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Difficile: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${styles[difficulty]}`}>
      {difficulty}
    </span>
  );
};

interface ChapterCardProps {
    chapter: Chapter;
    hasQuiz: boolean;
    isConsulted: boolean;
    bestScoreData: { bestScore: number; totalQuestions: number } | null;
    onView: () => void;
    onQuiz: () => void;
}

const ChapterCard: React.FC<ChapterCardProps> = ({ chapter, hasQuiz, isConsulted, bestScoreData, onView, onQuiz }) => {
  const statusBorderStyle = isConsulted ? 'border-primary' : 'border-slate-300 dark:border-slate-600';
  const isPerfect = bestScoreData && bestScoreData.bestScore === bestScoreData.totalQuestions;

  return (
    <div className={`relative bg-card-light dark:bg-card-dark rounded-2xl shadow-md p-5 border-l-4 transition-all duration-200 hover:shadow-xl hover:-translate-y-1 ${statusBorderStyle}`}>
      <div className="flex flex-col text-center h-full">
        {/* Top Part */}
        <div className="flex-grow">
          <div className="text-6xl mb-2">{chapter.icon}</div>
          <h3 className="text-lg font-bold text-text-light dark:text-text-dark">{chapter.title}</h3>
          <div className="my-3">
            <DifficultyBadge difficulty={chapter.difficulty} />
          </div>

          {bestScoreData && (
            <div className={`my-3 px-3 py-1.5 rounded-lg text-sm font-semibold inline-flex items-center gap-2 ${isPerfect ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' : 'bg-slate-100 dark:bg-slate-700'}`}>
               {isPerfect && '⭐'}
               <span>Meilleur score : {bestScoreData.bestScore}/{bestScoreData.totalQuestions}</span>
            </div>
          )}

          <p className="text-sm text-text-muted-light dark:text-text-muted-dark my-4">
            🎁 +{chapter.rewardXp} XP • +{chapter.rewardCoins} 🪙
          </p>
           <p className="text-xs text-text-muted-light dark:text-text-muted-dark -mt-3">
            Ajouté par {chapter.teacherName}
          </p>
        </div>

        {/* Bottom Part */}
        <div className="space-y-2 mt-auto pt-4">
           <button
              onClick={onView}
              className={`block w-full text-center px-4 py-3 rounded-lg text-white font-bold transition-colors ${
                  isConsulted 
                  ? 'bg-primary/70 hover:bg-primary/90'
                  : 'bg-primary hover:bg-primary-hover'
              }`}
            >
              {isConsulted ? '📖 Revoir le cours' : '📄 Consulter le cours'}
            </button>
          <button
            onClick={onQuiz}
            disabled={!hasQuiz}
            className={`w-full px-4 py-3 rounded-lg font-bold transition-colors ${
              hasQuiz
                ? 'bg-amber-400 hover:bg-amber-500 text-white shadow-md'
                : 'bg-transparent border-2 border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-500 cursor-not-allowed'
            }`}
          >
            {hasQuiz ? '📝 Faire le quiz' : '📝 Quiz à venir'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const CoursesScreen: React.FC<CoursesScreenProps> = ({ userData, chapters, quizzes, onViewChapter, onStartQuiz }) => {

    const getQuizDataForChapter = (chapterId: string): { quizId?: string; bestScoreData: { bestScore: number; totalQuestions: number } | null } => {
        const quiz = quizzes.find(q => q.chapterId === chapterId);
        if (!quiz) return { bestScoreData: null };

        const completionData = userData.completedQuizzes.find(cq => cq.quizId === quiz.id);
        if (!completionData) return { quizId: quiz.id, bestScoreData: null };
        
        return {
            quizId: quiz.id,
            bestScoreData: {
                bestScore: completionData.bestScore,
                totalQuestions: quiz.questions.length,
            }
        };
    };

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-4xl font-bold text-center mb-8 text-text-light dark:text-text-dark">📚 Mes Chapitres</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chapters.map((chapter) => {
            const { quizId, bestScoreData } = getQuizDataForChapter(chapter.id);
            return (
              <ChapterCard
                key={chapter.id}
                chapter={chapter}
                hasQuiz={!!quizId}
                isConsulted={userData.consultedChapters.includes(chapter.id)}
                bestScoreData={bestScoreData}
                onView={() => onViewChapter(chapter)}
                onQuiz={() => quizId && onStartQuiz(quizId)}
              />
            );
        })}
      </div>
    </div>
  );
};