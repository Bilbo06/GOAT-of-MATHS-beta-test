import React, { useState } from 'react';
import { UserData } from '../../types';
import { GRADES, SHOP_ITEMS } from '../../constants';

interface PasswordStrengthIndicatorProps {
  password?: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password = '' }) => {
  const getStrength = () => {
    if (password.length === 0) return { label: '', color: 'bg-transparent', width: '0%' };
    if (password.length < 6) return { label: 'Faible', color: 'bg-red-500', width: '33%' };
    if (password.length < 8) return { label: 'Moyen', color: 'bg-yellow-500', width: '66%' };
    return { label: 'Fort', color: 'bg-green-500', width: '100%' };
  };

  const { label, color, width } = getStrength();

  return (
    <div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
        <div className={`h-2 rounded-full transition-all ${color}`} style={{ width }} />
      </div>
      <p className={`text-xs text-right mt-1 ${
          label === 'Faible' ? 'text-red-500' 
        : label === 'Moyen' ? 'text-yellow-500' 
        : label === 'Fort' ? 'text-green-500' 
        : ''}`}>{label}</p>
    </div>
  );
};

interface ChangePasswordModalProps {
    onClose: () => void;
    onChangePassword: (current: string, newPass: string) => boolean;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ onClose, onChangePassword }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        setError('');
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('Tous les champs sont requis.');
            return;
        }
        if (newPassword.length < 6) {
            setError('Le nouveau mot de passe doit faire au moins 6 caractères.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Les nouveaux mots de passe ne correspondent pas.');
            return;
        }
        
        const success = onChangePassword(currentPassword, newPassword);
        if (success) {
            onClose();
        } else {
            // Error is set by the hook's toast
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">🔒 Changer mon mot de passe</h2>
                <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-bold mb-1">Mot de passe actuel</label>
                        <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full px-3 py-2 rounded-md bg-background-light dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-text-light dark:text-text-dark" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Nouveau mot de passe</label>
                        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-3 py-2 rounded-md bg-background-light dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-text-light dark:text-text-dark" />
                        <PasswordStrengthIndicator password={newPassword} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Confirmer le nouveau mot de passe</label>
                        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 rounded-md bg-background-light dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-text-light dark:text-text-dark" />
                    </div>
                </div>
                {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
                <div className="flex gap-4 mt-6">
                    <button onClick={onClose} className="w-full py-3 rounded-lg font-bold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600">Annuler</button>
                    <button onClick={handleSubmit} className="w-full py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary-hover">Changer</button>
                </div>
            </div>
        </div>
    )
}

interface DashboardScreenProps {
  userData: UserData;
  onChangePassword: (current: string, newPass: string) => boolean;
}

const StatCard: React.FC<{
  icon: string;
  label: string;
  value: string | number;
  progress?: number;
  progressColor?: string;
}> = ({ icon, label, value, progress, progressColor }) => {
  return (
    <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-5 text-center flex flex-col items-center justify-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="text-5xl mb-3">{icon}</div>
      <p className="text-sm font-semibold text-text-muted-light dark:text-text-muted-dark mb-1">{label}</p>
      <p className="text-3xl font-extrabold text-text-light dark:text-text-dark">{value}</p>
      {progress !== undefined && (
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-4">
          <div
            className={`${progressColor || 'bg-primary'} h-2 rounded-full transition-all duration-300`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};


export const DashboardScreen: React.FC<DashboardScreenProps> = ({ userData, onChangePassword }) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const currentGrade = GRADES[userData.gradeIndex];
  const xpForNextLevel = currentGrade.xpPerLevel;
  const xpPercentage = Math.min((userData.xp / xpForNextLevel) * 100, 100);

  const avatarItem = userData.avatarId ? SHOP_ITEMS.find(item => item.id === userData.avatarId) : null;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {showPasswordModal && <ChangePasswordModal onChangePassword={onChangePassword} onClose={() => setShowPasswordModal(false)} />}
      {/* Profile Card */}
      <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-2xl shadow-lg p-6">
        <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-5">
              <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-white text-4xl font-bold ring-2 ring-white/50">
                {avatarItem ? (
                  <span className="text-5xl">{avatarItem.icon}</span>
                ) : (
                  userData.name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex-grow">
                <h2 className="text-2xl sm:text-3xl font-bold text-text-light dark:text-text-dark">{userData.name}</h2>
                <p className="text-md text-primary dark:text-primary-light font-semibold mt-1">
                  {currentGrade.icon} {currentGrade.name} - Niveau {userData.level}/{currentGrade.levelsToComplete}
                </p>
              </div>
            </div>
             <button onClick={() => setShowPasswordModal(true)} className="flex-shrink-0 px-3 py-1.5 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                🔒 Changer mdp
            </button>
        </div>
        <div className="mt-5">
            <div className="flex justify-between items-center text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">
              <span>Progression vers niveau suivant</span>
              <span className="font-bold text-primary dark:text-primary-light">{userData.xp} / {xpForNextLevel} XP</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-primary-light to-primary h-full rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${xpPercentage}%` }}>
              </div>
            </div>
          </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          icon="❤️"
          label="Points de vie"
          value={`${userData.hp} / 100`}
          progress={userData.hp}
          progressColor="bg-red-500"
        />
        <StatCard
          icon="⭐"
          label="Expérience"
          value={`${userData.xp} / ${xpForNextLevel}`}
          progress={xpPercentage}
          progressColor="bg-blue-500"
        />
        <StatCard
          icon="🪙"
          label="MathCoins"
          value={userData.coins}
        />
        <StatCard
          icon="🔥"
          label="Série de jours"
          value={`${userData.streak} jours`}
        />
      </div>
    </div>
  );
};
