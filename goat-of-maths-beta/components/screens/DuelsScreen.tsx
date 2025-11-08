import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { UserData, DuelQuestion, DuelChallenge } from '../../types';
import { DUEL_CONSTANTS, DUEL_QUESTIONS, GRADES, SHOP_ITEMS } from '../../constants';
import { playSound } from '../../utils/sounds';

type GameState = 'idle' | 'searching' | 'found' | 'playing' | 'results';
type DuelType = 'ranked' | 'practice';

interface DuelsScreenProps {
  userData: UserData;
  allUsers: UserData[];
  duelChallenges: DuelChallenge[];
  onCompleteDuel: (result: 'win' | 'loss' | 'tie', myScore: number, opponentScore: number, opponentName: string, wager?: number) => void;
  onHandleDuelChallenge: (challengeId: string, accept: boolean) => void;
  onViewProfile: (userId: string) => void;
  onEnterBattleRoyale: () => void;
  onEnterBattleRoyaleTraining: () => void;
}

export const DuelsScreen: React.FC<DuelsScreenProps> = ({ userData, allUsers, duelChallenges, onCompleteDuel, onHandleDuelChallenge, onViewProfile, onEnterBattleRoyale, onEnterBattleRoyaleTraining }) => {
    const [gameState, setGameState] = useState<GameState>('idle');
    const [duelType, setDuelType] = useState<DuelType>('ranked');
    const [wager, setWager] = useState(0);
    
    // Game state
    const [opponent, setOpponent] = useState<UserData | null>(null);
    const [questions, setQuestions] = useState<DuelQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [myScore, setMyScore] = useState(0);
    const [opponentScore, setOpponentScore] = useState(0);
    const [lastResult, setLastResult] = useState<{ result: 'win' | 'loss' | 'tie'; myScore: number; opponentScore: number} | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isOpponentAnswering, setIsOpponentAnswering] = useState(false);
    const [timer, setTimer] = useState(10);
    
    const canPlayRanked = userData.dailyDuelsPlayed < DUEL_CONSTANTS.MAX_DAILY_DUELS;

    const incomingChallenges = duelChallenges.filter(c => c.toUserId === userData.id);

    const startSearch = (type: DuelType) => {
        if (type === 'ranked' && !canPlayRanked) {
            alert("Tu as atteint ta limite de duels classés pour aujourd'hui !");
            return;
        }
        const potentialOpponents = allUsers.filter(u => u.id !== userData.id && u.role === 'student');
        if (potentialOpponents.length > 0) {
            setOpponent(potentialOpponents[Math.floor(Math.random() * potentialOpponents.length)]);
        } else {
            setOpponent({ ...userData, name: "Clone d'entraînement" }); // Fallback for single user scenario
        }

        setDuelType(type);
        setWager(0);
        setGameState('searching');
        setTimeout(() => {
            setGameState('found');
        }, 2500);
    };

    const startDuel = () => {
        playSound('duel-start');
        const shuffledQuestions = [...DUEL_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 5); // 5 random questions
        setQuestions(shuffledQuestions);
        setCurrentQuestionIndex(0);
        setMyScore(0);
        setOpponentScore(0);
        setLastResult(null);
        setSelectedAnswer(null);
        setTimer(10);
        setGameState('playing');
    };
    
    const endDuel = (finalMyScore: number, finalOpponentScore: number) => {
        let result: 'win' | 'loss' | 'tie';
        if (finalMyScore > finalOpponentScore) {
            result = 'win';
            playSound('duel-win');
        } else if (finalMyScore < finalOpponentScore) {
            result = 'loss';
            playSound('duel-loss');
        } else {
            result = 'tie';
        }
        
        setLastResult({ result, myScore: finalMyScore, opponentScore: finalOpponentScore });

        if ((duelType === 'ranked' || wager > 0) && opponent) {
            onCompleteDuel(result, finalMyScore, finalOpponentScore, opponent.name, wager);
        }
        
        setGameState('results');
    };


    const handleAnswer = useCallback((answer: string) => {
        if (selectedAnswer !== null) return;
        
        setSelectedAnswer(answer);
        setIsOpponentAnswering(true);

        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = currentQuestion.correctAnswer === answer;
        
        let finalMyScore = myScore;
        if (isCorrect) {
            finalMyScore++;
            setMyScore(s => s + 1);
            playSound('correct-answer');
        } else {
            playSound('wrong-answer');
        }

        // Simulate opponent
        setTimeout(() => {
            let finalOpponentScore = opponentScore;
            if (Math.random() < 0.75) { // 75% chance to answer correctly
                finalOpponentScore++;
                setOpponentScore(s => s + 1);
            }
            setIsOpponentAnswering(false);
            
            // Move to next question or end duel
            setTimeout(() => {
                if (currentQuestionIndex < questions.length - 1) {
                    setCurrentQuestionIndex(i => i + 1);
                    setSelectedAnswer(null);
                    setTimer(10); // Reset timer
                } else {
                    endDuel(finalMyScore, finalOpponentScore);
                }
            }, 1200);
        }, 500 + Math.random() * 1500);
    }, [selectedAnswer, questions, currentQuestionIndex, myScore, opponentScore, endDuel]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (gameState === 'playing' && timer > 0 && selectedAnswer === null) {
            interval = setInterval(() => {
                setTimer(t => t - 1);
            }, 1000);
        } else if (gameState === 'playing' && timer === 0 && selectedAnswer === null) {
            handleAnswer(''); // Timeout is a wrong answer
        }
        return () => clearInterval(interval);
    }, [gameState, timer, selectedAnswer, handleAnswer]);


    const renderIdleScreen = () => (
        <div className="p-4 md:p-6 space-y-8">
            <div className="text-center">
                <h2 className="text-4xl font-bold text-text-light dark:text-text-dark">⚔️ Arène des Duels</h2>
                <p className="text-md text-text-muted-light dark:text-text-muted-dark mt-1">Affronte tes camarades en 1v1 ou dans l'Arène Royale !</p>
            </div>

            {incomingChallenges.length > 0 && (
                <div className="max-w-2xl mx-auto w-full">
                     <h3 className="text-2xl font-bold text-center mb-2">Défis en attente</h3>
                     {incomingChallenges.map(c => (
                         <div key={c.id} className="bg-amber-100 dark:bg-amber-900/50 p-4 rounded-lg flex items-center justify-between">
                             <div>
                                 <p><span className="font-bold">{c.fromUserName}</span> te défie !</p>
                                 <p className="text-sm font-bold text-amber-600 dark:text-amber-400">Enjeu : {c.wager} 🪙</p>
                             </div>
                             <div className="flex gap-2">
                                <button onClick={() => onHandleDuelChallenge(c.id, true)} className="px-3 py-1 bg-green-500 text-white rounded font-semibold">Accepter</button>
                                <button onClick={() => onHandleDuelChallenge(c.id, false)} className="px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded font-semibold">Refuser</button>
                             </div>
                         </div>
                     ))}
                </div>
            )}

            <div className="space-y-6">
                <h3 className="text-2xl font-bold text-center">Arène Battle Royale</h3>
                <div className="max-w-2xl mx-auto">
                    <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-xl border-2 border-purple-400/50 flex flex-col items-center gap-4 text-center">
                        <div className="text-6xl animate-pulse">👑</div>
                        <div className="flex-grow">
                            <h3 className="text-2xl font-extrabold">Événement : Arène Royale 2v2</h3>
                            <p className="mt-1 text-sm text-purple-200">Fais équipe avec un ami et soyez la dernière équipe debout pour remporter la gloire !</p>
                        </div>
                        <button 
                            onClick={onEnterBattleRoyale}
                            className="w-full px-6 py-3 rounded-xl bg-white text-purple-700 font-bold text-lg hover:bg-purple-100 transition-colors shadow-lg transform hover:scale-105"
                        >
                            Participer (Simulation)
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="space-y-6">
                 <h3 className="text-2xl font-bold text-center">Duels 1v1</h3>
                 <div className="max-w-2xl mx-auto">
                    <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl border border-border-light dark:border-border-dark space-y-4 text-center">
                        <h3 className="text-2xl font-bold text-primary dark:text-primary-light">⭐ Duels Classés</h3>
                        <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Affronte des élèves de ton niveau et gagne des MathCoins.</p>
                        <div className={`inline-block px-3 py-1 rounded-full font-semibold text-sm ${canPlayRanked ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'}`}>
                            {userData.dailyDuelsPlayed} / {DUEL_CONSTANTS.MAX_DAILY_DUELS} joués
                        </div>
                        <button onClick={() => startSearch('ranked')} disabled={!canPlayRanked} className="w-full max-w-xs mx-auto px-4 py-3 rounded-lg text-white font-bold bg-primary hover:bg-primary-hover shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
                            Trouver un adversaire
                        </button>
                    </div>
                 </div>
            </div>

             <div className="space-y-6">
                <h3 className="text-2xl font-bold text-center">Entraînements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl border border-border-light dark:border-border-dark flex flex-col items-center gap-4 text-center">
                        <div className="text-6xl">🤖</div>
                        <div className="flex-grow">
                            <h3 className="text-2xl font-bold text-teal-500">Battle Royale</h3>
                            <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">Affronte 9 bots dans une arène à 5 salles. Survis et sois le dernier debout !</p>
                        </div>
                        <button 
                            onClick={onEnterBattleRoyaleTraining}
                            className="w-full px-6 py-3 rounded-xl bg-teal-500 text-white font-bold text-lg hover:bg-teal-600 transition-colors shadow-lg transform hover:scale-105"
                        >
                            S'entraîner
                        </button>
                    </div>
                     <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl border border-border-light dark:border-border-dark flex flex-col items-center gap-4 text-center">
                        <div className="text-6xl">🎯</div>
                        <div className="flex-grow">
                            <h3 className="text-2xl font-bold text-green-500">Duel 1v1</h3>
                            <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">Entraîne-toi sans limite et sans enjeu, juste pour le plaisir.</p>
                        </div>
                        <button onClick={() => startSearch('practice')} className="w-full px-6 py-3 rounded-xl text-white font-bold text-lg bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                           S'entraîner
                        </button>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-bold mb-3">Historique Récent (1v1)</h3>
                <div className="space-y-2">
                    {userData.duelHistory.length > 0 ? userData.duelHistory.map(item => {
                        const opponentUser = allUsers.find(u => u.name === item.opponentName);
                        return (
                        <div key={item.id} className="bg-card-light dark:bg-card-dark p-3 rounded-lg flex items-center justify-between text-sm">
                            <span className="font-bold">{item.result === 'win' ? '🏆 Victoire' : item.result === 'loss' ? '😢 Défaite' : '🤝 Égalité'}</span>
                            <span>vs <button onClick={() => opponentUser && onViewProfile(opponentUser.id)} className="font-semibold hover:underline" disabled={!opponentUser}>{item.opponentName}</button> ({item.myScore} - {item.opponentScore})</span>
                            <span className={`font-bold ${item.coinChange > 0 ? 'text-green-500' : item.coinChange < 0 ? 'text-red-500' : ''}`}>{item.coinChange > 0 ? `+${item.coinChange}`: item.coinChange} 🪙</span>
                        </div>
                    )}) : <p className="text-center text-sm text-text-muted-light dark:text-text-muted-dark py-4">Aucun duel classé 1v1 joué récemment.</p>}
                </div>
            </div>
        </div>
    );
    
    const renderModal = (title: string, content: React.ReactNode) => (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow-2xl p-8 w-full max-w-md text-center animate-fade-in-up">
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                {content}
            </div>
        </div>
    );

    const renderSearchingScreen = () => renderModal("Recherche en cours...", 
        <div>
            <p className="text-text-muted-light dark:text-text-muted-dark">Nous cherchons un adversaire à ta hauteur...</p>
            <div className="text-5xl my-6 animate-pulse">⚔️</div>
        </div>
    );

    const renderFoundScreen = () => {
        if (!opponent) return null;
        const opponentGrade = GRADES[opponent.gradeIndex];
        return renderModal("Adversaire trouvé !", 
            <div className="space-y-4">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-white text-4xl font-bold ring-4 ring-white/50 dark:ring-slate-900/50">
                    {opponent.name.charAt(0)}
                </div>
                <h3 className="text-xl font-bold">{opponent.name}</h3>
                <p className="text-primary dark:text-primary-light font-semibold">{opponentGrade.icon} {opponentGrade.name} - Nv. {opponent.level}</p>
                <div className="flex gap-4">
                    <button onClick={() => setGameState('idle')} className="w-full py-3 rounded-lg font-bold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Annuler</button>
                    <button onClick={startDuel} className="w-full py-3 rounded-lg font-bold text-white bg-primary hover:bg-primary-hover transition-colors">⚔️ Commencer</button>
                </div>
            </div>
        );
    }
    
    const PlayerCard: React.FC<{player: UserData, score: number, isOpponent?: boolean}> = ({ player, score, isOpponent }) => {
        const avatar = player.avatarId ? SHOP_ITEMS.find(i => i.id === player.avatarId)?.icon : player.name.charAt(0);
        return (
             <div className="flex flex-col items-center space-y-2">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold ${isOpponent ? 'bg-red-200 text-red-700' : 'bg-blue-200 text-blue-700'}`}>{avatar}</div>
                <p className="font-bold text-sm truncate w-24 text-center">{player.name}</p>
                <p className="text-2xl font-extrabold">{score}</p>
            </div>
        );
    };

    const renderPlayingScreen = () => {
        if (!opponent || questions.length === 0) return null;
        const question = questions[currentQuestionIndex];
        const timerColor = timer <= 3 ? 'text-red-500' : 'text-text-light dark:text-text-dark';

        return (
            <div className="p-4 md:p-6 flex flex-col h-full">
                {/* Header */}
                <div className="grid grid-cols-3 items-center gap-2 mb-6">
                    <PlayerCard player={userData} score={myScore} />
                     <div className="text-center">
                         <div className={`relative w-20 h-20 mx-auto flex items-center justify-center text-3xl font-bold ${timerColor}`}>{timer}</div>
                        <p className="font-bold text-lg">Question {currentQuestionIndex + 1}/{questions.length}</p>
                    </div>
                    <PlayerCard player={opponent} score={opponentScore} isOpponent/>
                </div>

                {/* Question */}
                <div className="flex-grow flex flex-col items-center justify-center text-center">
                    <p className="text-2xl md:text-3xl font-semibold mb-8">{question.question}</p>
                    <div className="w-full max-w-xl grid grid-cols-2 gap-4">
                        {question.options.map(opt => {
                            let style = "bg-card-light dark:bg-card-dark hover:bg-slate-100 dark:hover:bg-slate-800";
                            if (selectedAnswer !== null) {
                                if (opt === question.correctAnswer) style = "bg-green-500 text-white";
                                else if (opt === selectedAnswer) style = "bg-red-500 text-white";
                                else style = "bg-slate-200 dark:bg-slate-700 opacity-50";
                            }
                            return (
                                <button key={opt} onClick={() => handleAnswer(opt)} disabled={selectedAnswer !== null} 
                                className={`p-4 rounded-lg font-bold text-lg border border-border-light dark:border-border-dark transition-all duration-300 ${style}`}>
                                    {opt}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        );
    };

    const renderResultsScreen = () => {
        if (!lastResult || !opponent) return null;
        const { result, myScore, opponentScore } = lastResult;
        
        let coinChanges = 0;
        if (wager > 0) {
            coinChanges = result === 'win' ? wager : result === 'loss' ? -wager : 0;
        } else if (duelType === 'ranked') {
            coinChanges = result === 'win' ? DUEL_CONSTANTS.WIN_COINS : result === 'loss' ? DUEL_CONSTANTS.LOSS_COINS : 0;
        }

        const resultData = {
            win: { icon: '🏆', title: 'VICTOIRE !', color: 'text-green-500', change: coinChanges },
            loss: { icon: '😢', title: 'DÉFAITE', color: 'text-red-500', change: coinChanges },
            tie: { icon: '🤝', title: 'ÉGALITÉ', color: 'text-orange-500', change: coinChanges },
        }[result];

        return renderModal(resultData.title, 
            <div className="space-y-4">
                <div className={`text-8xl ${resultData.color}`}>{resultData.icon}</div>
                <p className="text-2xl font-bold">Score final : {myScore} - {opponentScore}</p>
                {(duelType === 'ranked' || wager > 0) && (
                  <p className={`text-xl font-bold ${resultData.change > 0 ? 'text-green-500' : resultData.change < 0 ? 'text-red-500' : ''}`}>
                    {resultData.change > 0 ? `+${resultData.change}` : resultData.change} 🪙 MathCoins
                  </p>  
                )}
                {result === 'loss' && <p className="text-text-muted-light dark:text-text-muted-dark">Ne lâche rien, tu feras mieux la prochaine fois !</p>}
                <button onClick={() => setGameState('idle')} className="w-full py-3 rounded-lg font-bold text-white bg-primary hover:bg-primary-hover transition-colors">Retour aux duels</button>
            </div>
        );
    };

    switch (gameState) {
        case 'searching': return renderSearchingScreen();
        case 'found': return renderFoundScreen();
        case 'playing': return renderPlayingScreen();
        case 'results': return renderResultsScreen();
        case 'idle':
        default: return renderIdleScreen();
    }
};
