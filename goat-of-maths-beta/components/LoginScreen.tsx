import React, { useState } from 'react';

interface LoginScreenProps {
  onLogin: (username: string, password: string) => void;
  onAdminClick: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onAdminClick }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      onLogin(username.trim(), password.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background-light dark:bg-background-dark">
      <div className="bg-card-light dark:bg-card-dark p-6 md:p-8 rounded-2xl shadow-lg w-full max-w-sm relative">
        <h1 className="text-center text-6xl mb-4">🧮</h1>
        <h2 className="text-3xl font-extrabold text-center text-primary dark:text-primary-light">GOAT OF MATHS</h2>
        <p className="text-center text-text-muted-light dark:text-text-muted-dark mb-8">Deviens le GOAT des maths !</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username-login" className="block text-sm font-medium text-text-light dark:text-text-dark">
              Identifiant
            </label>
            <div className="mt-1">
              <input
                id="username-login"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                className="block w-full px-3 py-2 bg-background-light dark:bg-slate-800 text-text-light dark:text-text-dark border-2 border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="ex: lucas.dubois"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="password-login" className="block text-sm font-medium text-text-light dark:text-text-dark">
              Mot de passe
            </label>
            <div className="mt-1 relative">
              <input
                id="password-login"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3 py-2 bg-background-light dark:bg-slate-800 text-text-light dark:text-text-dark border-2 border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-text-muted-light dark:text-text-muted-dark"
              >
                {showPassword ? ' masqué' : '👁️ affiché'}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={!username.trim() || !password.trim()}
              className="w-full flex justify-center py-3 px-4 mt-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-primary hover:bg-primary-hover disabled:bg-slate-400 dark:disabled:bg-slate-500 disabled:opacity-70 transition-all"
            >
              Se connecter
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm">
            <a href="#" onClick={(e) => { e.preventDefault(); alert("Veuillez contacter votre professeur pour réinitialiser votre mot de passe.")}} className="font-medium text-text-muted-light dark:text-text-muted-dark hover:text-primary dark:hover:text-primary-light">
                Mot de passe oublié ?
            </a>
        </div>
        
        <div className="mt-8 text-center">
          <button
            onClick={onAdminClick}
            className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:text-primary dark:hover:text-primary-light transition-colors"
          >
            👨‍🏫 Espace Professeur
          </button>
        </div>
      </div>
    </div>
  );
};