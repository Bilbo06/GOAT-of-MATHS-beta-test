import React from 'react';

type AcademieSubView = 'courses' | 'quizzes' | 'revisions' | 'mindmaps';

interface AcademieScreenProps {
  onNavigate: (view: AcademieSubView) => void;
}

const AcademieCard: React.FC<{ icon: string; title: string; description: string; onClick: () => void; }> = ({ icon, title, description, onClick }) => (
    <button onClick={onClick} className="bg-card-light dark:bg-card-dark rounded-2xl shadow-md p-6 border-l-4 border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-left w-full">
        <div className="flex items-center gap-5">
            <span className="text-6xl">{icon}</span>
            <div>
                <h3 className="text-xl font-bold text-text-light dark:text-text-dark">{title}</h3>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">{description}</p>
            </div>
        </div>
    </button>
);

export const AcademieScreen: React.FC<AcademieScreenProps> = ({ onNavigate }) => {
  return (
    <div className="p-4 md:p-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-text-light dark:text-text-dark">🎓 Académie des Maths</h2>
        <p className="text-md text-text-muted-light dark:text-text-muted-dark mt-1">Apprends, pratique, et maîtrise les mathématiques.</p>
      </div>
      <div className="max-w-3xl mx-auto space-y-4">
        <AcademieCard
            icon="📚"
            title="Cours"
            description="Apprends de nouveaux concepts et revois les bases."
            onClick={() => onNavigate('courses')}
        />
        <AcademieCard
            icon="📝"
            title="Quiz"
            description="Teste tes connaissances et gagne des récompenses."
            onClick={() => onNavigate('quizzes')}
        />
        <AcademieCard
            icon="🧠"
            title="Révision"
            description="Renforce tes points faibles avec des exercices ciblés."
            onClick={() => onNavigate('revisions')}
        />
        <AcademieCard
            icon="🗺️"
            title="Cartes Mentales"
            description="Organise tes idées et crée des fiches de révision."
            onClick={() => onNavigate('mindmaps')}
        />
      </div>
    </div>
  );
};