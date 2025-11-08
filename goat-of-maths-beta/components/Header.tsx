import React from 'react';
import { UserData, Theme } from '../types';

export const Header: React.FC<{ userData: UserData; theme: Theme; onToggleTheme: () => void; onLogout: () => void; }> = ({ userData, theme, onToggleTheme, onLogout }) => {
  return (
    <header className="sticky top-0 z-20 bg-header-light dark:bg-header-dark shadow-sm border-b border-border-light dark:border-border-dark">
      <div className="container mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-3">
          <span className="text-3xl">🧮</span>
          <h1 className="hidden sm:block text-xl font-bold text-primary dark:text-primary-light">GOAT OF MATHS</h1>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-4">
           <div className="bg-badge-light dark:bg-badge-dark px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2">
            <span>🔥</span>
            <span className="hidden sm:inline">Série</span>
            <span>{userData.streak}</span>
          </div>
          <div className="bg-badge-light dark:bg-badge-dark px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2">
            <span>⭐</span>
            <span className="hidden sm:inline">XP</span>
            <span>{userData.xp}</span>
          </div>
          <div className="bg-badge-light dark:bg-badge-dark px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2">
            <span>🪙</span>
             <span className="hidden sm:inline">MathCoins</span>
            <span>{userData.coins}</span>
          </div>
          <button
            onClick={onToggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-badge-light dark:bg-badge-dark text-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            aria-label="Toggle dark mode"
          >
            {theme === Theme.Light ? '🌙' : '☀️'}
          </button>
          <button
            onClick={onLogout}
            className="px-3 py-1.5 rounded-md text-sm font-bold transition-colors bg-danger-light text-danger-text-light dark:bg-danger-dark dark:text-danger-text-dark hover:bg-red-200 dark:hover:bg-red-900"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
};
