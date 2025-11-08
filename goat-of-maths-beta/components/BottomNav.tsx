

import React from 'react';
import { Tab } from '../types';

interface BottomNavProps {
  activeTab: Tab;
  onNavigate: (tab: Tab) => void;
}

const navItems = [
  { screen: Tab.Accueil, icon: '🏠', label: 'Accueil' },
  { screen: Tab.Academie, icon: '🎓', label: 'Académie' },
  { screen: Tab.Missions, icon: '🎯', label: 'Missions' },
  { screen: Tab.Shop, icon: '🛍️', label: 'Boutique' },
  { screen: Tab.Community, icon: '👥', label: 'Communauté' },
];

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onNavigate }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-sm border-t border-border-light dark:border-border-dark">
      <div className="container mx-auto flex justify-around max-w-2xl">
        {navItems.map((item) => (
          <button
            key={item.screen}
            onClick={() => onNavigate(item.screen)}
            className={`flex flex-col items-center justify-center p-2 w-1/5 transition-colors duration-200 h-16 ${
              activeTab === item.screen
                ? 'text-primary dark:text-primary-light'
                : 'text-text-muted-light dark:text-text-muted-dark hover:text-primary dark:hover:text-primary-light'
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};