import React, { useState, useEffect } from 'react';
import { UserData } from '../../types';
import { GOAT_CHALLENGE_SETTINGS } from '../../constants';
import { getWeekId } from '../../utils/auth';

interface GoatChallengeScreenProps {
    userData: UserData;
    allUsers: UserData[];
    onStartChallenge: () => void;
}

export const GoatChallengeScreen: React.FC<GoatChallengeScreenProps> = ({ userData, allUsers, onStartChallenge }) => {
    const currentWeekId = getWeekId(new Date());
    const userAttempt = userData.goatChallengeAttempts?.[currentWeekId];

    const canPlay = !userAttempt && userData.coins >= GOAT_CHALLENGE_SETTINGS.ENTRY_FEE;

    const leaderboard = allUsers
        .filter(u => u.goatChallengeAttempts?.[currentWeekId])
        .map(u => ({
            id: u.id,
            name: u.name,
            score: u.goatChallengeAttempts[currentWeekId].score,
            time: u.goatChallengeAttempts[currentWeekId].time,
        }))
        .sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score;
            }
            return a.time - b.time;
        })
        .slice(0, 10);
    
    const userRank = userAttempt ? leaderboard.findIndex(u => u.id === userData.id) + 1 : null;

    const [countdown, setCountdown] = useState('');

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const endOfWeek = new Date(now);
            
            const dayOfWeek = now.getDay(); // Sunday = 0, Monday = 1, etc.
            const daysUntilSunday = 7 - dayOfWeek;
            
            endOfWeek.setDate(now.getDate() + daysUntilSunday);
            endOfWeek.setHours(23, 59, 59, 999);

            const difference = endOfWeek.getTime() - now.getTime();

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);
                
                let countdownString = '';
                if (days > 0) countdownString += `${days}j `;
                if (hours > 0 || days > 0) countdownString += `${hours}h `;
                countdownString += `${minutes}m ${seconds}s`;

                setCountdown(countdownString);
            } else {
                setCountdown("Nouveau défi bientôt !");
            }
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="text-center bg-gradient-to-r from-slate-900 to-slate-800 text-white p-8 rounded-2xl shadow-2xl border-2 border-amber-400">
                <h1 className="text-6xl font-extrabold">👑</h1>
                <h2 className="text-4xl font-bold mt-2 text-amber-300">Défi du GOAT</h2>
                <p className="text-md text-slate-300 mt-2">L'épreuve ultime. Une seule tentative par semaine.</p>
                <div className="mt-4 px-4 py-2 bg-white/10 rounded-full inline-block font-mono text-lg">
                    {userAttempt ? 'Prochain défi dans' : 'Se termine dans'} : <span className="font-bold">{countdown}</span>
                </div>
            </div>

            {/* Rules & Rewards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-md border border-border-light dark:border-border-dark">
                    <h3 className="font-bold text-lg mb-3">📜 Règles</h3>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                        <li><b>10 questions difficiles</b> sur tous les sujets.</li>
                        <li><b>Une seule tentative</b> par semaine (Lundi-Dimanche).</li>
                        <li><b>{GOAT_CHALLENGE_SETTINGS.DURATION_SECONDS / 60} minutes</b> pour tout terminer.</li>
                        <li>Coût de participation : <b>{GOAT_CHALLENGE_SETTINGS.ENTRY_FEE} 🪙</b>.</li>
                    </ul>
                </div>
                 <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-md border border-border-light dark:border-border-dark">
                    <h3 className="font-bold text-lg mb-3">🎁 Récompenses</h3>
                     <ul className="list-none space-y-2 text-sm">
                        <li>⭐ <b>10/10:</b> {GOAT_CHALLENGE_SETTINGS.REWARDS.PERFECT.xp} XP, {GOAT_CHALLENGE_SETTINGS.REWARDS.PERFECT.coins} 🪙</li>
                        <li>🏆 <b>8-9/10:</b> {GOAT_CHALLENGE_SETTINGS.REWARDS.EXCELLENT.xp} XP, {GOAT_CHALLENGE_SETTINGS.REWARDS.EXCELLENT.coins} 🪙</li>
                        <li>👍 <b>5-7/10:</b> {GOAT_CHALLENGE_SETTINGS.REWARDS.GOOD.xp} XP, {GOAT_CHALLENGE_SETTINGS.REWARDS.GOOD.coins} 🪙</li>
                    </ul>
                </div>
            </div>

             {/* Action / Result */}
            <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-lg text-center">
                {userAttempt ? (
                    <div>
                        <h3 className="text-xl font-bold">Tu as déjà participé cette semaine !</h3>
                        <p className="text-5xl font-extrabold my-4 text-primary dark:text-primary-light">{userAttempt.score}/{GOAT_CHALLENGE_SETTINGS.QUESTIONS_COUNT}</p>
                        <p className="text-text-muted-light dark:text-text-muted-dark">Temps: {(userAttempt.time / 1000).toFixed(2)}s</p>
                        {userRank && <p className="font-bold mt-2">Classement : <span className="text-amber-500">#{userRank}</span></p>}
                        <p className="mt-4 text-sm">Reviens la semaine prochaine pour un nouveau défi !</p>
                    </div>
                ) : (
                    <div>
                        <h3 className="text-xl font-bold">Prêt à relever le défi ?</h3>
                        <p className="text-text-muted-light dark:text-text-muted-dark my-2">Tu as <b>{userData.coins} 🪙</b>. Le défi coûte <b>{GOAT_CHALLENGE_SETTINGS.ENTRY_FEE} 🪙</b>.</p>
                        <button onClick={onStartChallenge} disabled={!canPlay} className="mt-4 px-8 py-4 rounded-lg text-white font-bold text-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
                            👑 Lancer le Défi !
                        </button>
                        {userData.coins < GOAT_CHALLENGE_SETTINGS.ENTRY_FEE && <p className="text-red-500 text-sm mt-2">Pas assez de MathCoins !</p>}
                    </div>
                )}
            </div>
            
            {/* Leaderboard */}
             <div>
                <h3 className="text-xl font-bold mb-3 text-center">🏆 Classement de la semaine</h3>
                <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-md space-y-2">
                    {leaderboard.length > 0 ? leaderboard.map((player, index) => (
                        <div key={player.id} className={`flex items-center gap-4 p-2 rounded-lg ${player.id === userData.id ? 'bg-blue-100 dark:bg-blue-900/50' : ''}`}>
                           <span className="font-bold text-lg w-8 text-center">{['🥇', '🥈', '🥉'][index] || index + 1}</span>
                           <p className="flex-grow font-semibold">{player.name}</p>
                           <p className="text-sm text-text-muted-light dark:text-text-muted-dark">{(player.time / 1000).toFixed(2)}s</p>
                           <p className="font-bold text-primary dark:text-primary-light text-lg">{player.score}/{GOAT_CHALLENGE_SETTINGS.QUESTIONS_COUNT}</p>
                        </div>
                    )) : (
                        <p className="text-center py-6 text-text-muted-light dark:text-text-muted-dark">Personne n'a encore relevé le défi cette semaine. Sois le premier !</p>
                    )}
                </div>
            </div>
        </div>
    );
};