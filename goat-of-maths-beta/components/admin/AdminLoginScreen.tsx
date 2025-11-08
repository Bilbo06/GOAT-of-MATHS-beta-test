import React, { useState } from 'react';

interface AdminLoginScreenProps {
  onLogin: (username: string, password: string) => void;
  onReturnToStudentLogin: () => void;
}

export const AdminLoginScreen: React.FC<AdminLoginScreenProps> = ({ onLogin, onReturnToStudentLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // The actual validation is now done in the `useUserData` hook
    // This component just passes the credentials up.
    onLogin(username, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-900">
      <div className="bg-card-light dark:bg-card-dark p-6 md:p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h1 className="text-center text-6xl mb-4">👨‍🏫</h1>
        <h2 className="text-3xl font-extrabold text-center text-primary-light dark:text-primary-dark">Espace Professeur</h2>
        <p className="text-center text-slate-500 dark:text-slate-400 mb-8">Interface d'administration</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-text-light dark:text-text-dark">
              Identifiant
            </label>
            <div className="mt-1">
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full px-3 py-2 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark border-2 border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-light focus:border-primary-light sm:text-sm"
                placeholder="admin ou prof"
              />
            </div>
          </div>
          
           <div>
            <label htmlFor="password">
              Mot de passe
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3 py-2 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark border-2 border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-light focus:border-primary-light sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <p className="text-sm text-center text-red-500">{error}</p>}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 disabled:bg-slate-400 disabled:opacity-50 transition-all"
            >
              Connexion
            </button>
          </div>
        </form>
        
        <div className="mt-8 text-center">
          <button
            onClick={onReturnToStudentLogin}
            className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:text-primary dark:hover:text-primary-light transition-colors"
          >
            ← Espace Élève
          </button>
        </div>
      </div>
    </div>
  );
};