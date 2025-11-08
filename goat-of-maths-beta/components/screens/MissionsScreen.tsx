
import React from 'react';
import { DailyMission, UserData } from '../../types';
import { DAILY_MISSIONS } from '../../constants';

interface MissionsScreenProps {
  userData: UserData;
  onCompleteMission: (missionId: string) => void;
}

const MissionCard: React.FC<{ mission: DailyMission; isCompleted: boolean; onComplete: () => void }> = ({ mission, isCompleted, onComplete }) => {
  const statusBorderStyle = isCompleted ? 'border-green-500' : 'border-slate-300 dark:border-slate-600';

  // Mission 1 is auto-completed, Mission 2 is auto-completed on chapter consult
  const isManuallyCompletable = !['daily1', 'daily2'].includes(mission.id);

  return (
    <div className={`bg-card-light dark:bg-card-dark rounded-xl shadow-md p-5 border-l-4 transition-all duration-300 ${statusBorderStyle} ${isCompleted ? 'opacity-70' : ''}`}>
      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Left Part */}
        <div className="flex-grow flex items-center gap-4 w-full">
           <div className="text-5xl flex-shrink-0">{mission.icon}</div>
           <div className="flex-grow">
              <h3 className="text-lg font-bold text-text-light dark:text-text-dark">{mission.title}</h3>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark">{mission.description}</p>
              <p className="text-xs text-primary dark:text-primary-light font-semibold mt-1">
                🎁 +{mission.rewardXp} XP • +{mission.rewardCoins} 🪙
              </p>
           </div>
        </div>

        {/* Right Part */}
        <div className="w-full md:w-auto flex-shrink-0 mt-4 md:mt-0">
          {isCompleted ? (
            <div className="w-full md:w-auto text-center px-5 py-2.5 rounded-lg bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 font-bold">
              ✓ Terminé
            </div>
          ) : (
             <button
                onClick={onComplete}
                disabled={!isManuallyCompletable}
                className="w-full md:w-auto px-5 py-2.5 rounded-lg font-bold text-white transition-colors bg-primary hover:bg-primary-hover disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 dark:disabled:text-slate-400 disabled:cursor-not-allowed"
             >
                Compléter
             </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const MissionsScreen: React.FC<MissionsScreenProps> = ({ userData, onCompleteMission }) => {
    
  // Auto-complete first mission if not already done
  React.useEffect(() => {
    if (!userData.completedDailyMissionIds.includes('daily1')) {
      onCompleteMission('daily1');
    }
  }, [userData.completedDailyMissionIds, onCompleteMission]);

  return (
    <div className="p-4 md:p-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-text-light dark:text-text-dark">🎯 Missions Quotidiennes</h2>
        <p className="text-md text-text-muted-light dark:text-text-muted-dark mt-1">Se réinitialisent chaque jour à minuit</p>
      </div>
      <div className="max-w-3xl mx-auto space-y-4">
        {DAILY_MISSIONS.map((mission) => (
          <MissionCard
            key={mission.id}
            mission={mission}
            isCompleted={userData.completedDailyMissionIds.includes(mission.id)}
            onComplete={() => onCompleteMission(mission.id)}
          />
        ))}
      </div>
    </div>
  );
};
