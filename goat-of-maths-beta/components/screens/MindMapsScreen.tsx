import React from 'react';
import { UserData, MindMap } from '../../types';

interface MindMapsScreenProps {
  userData: UserData;
  onNewMindMap: () => void;
  onOpenMindMap: (id: string) => void;
  onDeleteMindMap: (id: string) => void;
}

const MindMapCard: React.FC<{ mindMap: MindMap; onOpen: () => void; onDelete: () => void; }> = ({ mindMap, onOpen, onDelete }) => {
    return (
        <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-md p-5 border-l-4 border-primary transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="flex flex-col h-full">
                <div className="flex-grow">
                    <h3 className="text-lg font-bold text-text-light dark:text-text-dark">{mindMap.title}</h3>
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">
                        {mindMap.nodes.length} concepts • {mindMap.connections.length} connexions
                    </p>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t border-border-light dark:border-border-dark">
                    <button onClick={onOpen} className="w-full py-2 rounded-md font-semibold bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light hover:bg-primary/20">
                        ✏️ Ouvrir
                    </button>
                    <button onClick={onDelete} className="w-full py-2 rounded-md font-semibold bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 hover:bg-red-200">
                        🗑️ Supprimer
                    </button>
                </div>
            </div>
        </div>
    );
};


export const MindMapsScreen: React.FC<MindMapsScreenProps> = ({ userData, onNewMindMap, onOpenMindMap, onDeleteMindMap }) => {
  return (
    <div className="p-4 md:p-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-text-light dark:text-text-dark">🗺️ Mes Cartes Mentales</h2>
        <p className="text-md text-text-muted-light dark:text-text-muted-dark mt-1">Organise tes idées et révise efficacement !</p>
      </div>

       <div className="text-center mb-8">
        <button 
            onClick={onNewMindMap}
            className="px-6 py-3 rounded-lg text-white font-bold bg-gradient-to-r from-primary to-blue-700 hover:from-primary-hover hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
        >
            + Créer une nouvelle carte mentale
        </button>
      </div>

      {userData.mindMaps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userData.mindMaps.map(mindMap => (
                <MindMapCard 
                    key={mindMap.id}
                    mindMap={mindMap}
                    onOpen={() => onOpenMindMap(mindMap.id)}
                    onDelete={() => onDeleteMindMap(mindMap.id)}
                />
            ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card-light dark:bg-card-dark rounded-xl shadow-sm">
            <p className="text-5xl mb-4">🗺️</p>
            <h3 className="text-xl font-semibold text-text-light dark:text-text-dark">Aucune carte mentale pour le moment</h3>
            <p className="text-text-muted-light dark:text-text-muted-dark mt-1">Crée ta première carte pour commencer à organiser tes idées !</p>
        </div>
      )}
    </div>
  );
};