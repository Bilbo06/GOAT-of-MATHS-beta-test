import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { UserData, DuelQuestion } from '../../types';
import { DUEL_QUESTIONS, BATTLE_ROYALE_SETTINGS, SHOP_ITEMS } from '../../constants';

// TYPES
interface BRPlayer {
    id: string;
    name: string;
    avatarIcon: string;
    hp: number;
    maxHp: number;
    isPlayer: boolean;
    isTeammate: boolean;
}
interface GameEvent { id: number; text: string; }
type Action = 'quick_attack' | 'special_attack' | 'heal_self' | 'heal_teammate';
type GamePhase = 'question' | 'action' | 'resolution' | 'enemy_turn' | 'game_over';

// PROPS
interface BattleRoyaleGameScreenProps {
    userData: UserData;
    allUsers: UserData[];
    onEnd: () => void;
    mode: '2v2';
}

// HELPERS
const getAvatarIcon = (user: UserData) => SHOP_ITEMS.find(i => i.id === user.avatarId)?.icon || user.name.charAt(0);
const shuffleArray = <T,>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);

// SUB-COMPONENTS
const HPBar: React.FC<{ hp: number; maxHp: number; isAlly: boolean }> = ({ hp, maxHp, isAlly }) => {
    const percentage = Math.max(0, (hp / maxHp) * 100);
    const segments = 10;
    const filledSegments = Math.ceil(percentage / (100 / segments));
    
    const filledIcon = isAlly ? '💚' : '💔';
    const emptyIcon = isAlly ? '⬜' : '⬛';

    const getStatus = () => {
        if (percentage > 80) return 'PLEIN';
        if (percentage > 60) return 'FORT';
        if (percentage > 40) return 'MOYEN';
        if (percentage > 20) return 'FAIBLE';
        return 'CRITIQUE ⚠️';
    }

    return (
        <div className="mt-1">
            <div className="flex justify-center text-lg leading-none" aria-label={`Points de vie: ${hp} sur ${maxHp}`}>
                {Array.from({ length: segments }).map((_, i) => (
                    <span key={i}>{i < filledSegments ? filledIcon : emptyIcon}</span>
                ))}
            </div>
            {isAlly ? (
                <p className="text-center text-sm font-bold">{hp}/{maxHp}</p>
            ) : (
                <p className="text-center text-xs font-semibold">{getStatus()}</p>
            )}
        </div>
    );
};

const PlayerCard: React.FC<{ player: BRPlayer; }> = ({ player }) => {
    return (
        <div className="bg-slate-800/50 p-3 rounded-xl border-4 border-slate-600 w-full">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 text-2xl rounded-full bg-slate-700 flex items-center justify-center font-bold flex-shrink-0">{player.avatarIcon}</div>
                <div className="w-full">
                    <p className="font-bold text-white truncate">{player.name} {player.isPlayer && '(Vous)'}</p>
                    <HPBar hp={player.hp} maxHp={player.maxHp} isAlly={player.isPlayer || player.isTeammate} />
                </div>
            </div>
        </div>
    );
};


export const BattleRoyaleGameScreen: React.FC<BattleRoyaleGameScreenProps> = ({ userData, allUsers, onEnd, mode }) => {
    const [players, setPlayers] = useState<BRPlayer[]>([]);
    const [events, setEvents] = useState<GameEvent[]>([]);
    const [phase, setPhase] = useState<GamePhase>('question');
    const [currentQuestion, setCurrentQuestion] = useState<DuelQuestion | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [timer, setTimer] = useState(20);
    const [hasSpecial, setHasSpecial] = useState(false);
    const [turn, setTurn] = useState(1);
    const [result, setResult] = useState<'win' | 'loss' | null>(null);

    const me = useMemo(() => players.find(p => p.isPlayer), [players]);
    const teammate = useMemo(() => players.find(p => p.isTeammate), [players]);
    const opponents = useMemo(() => players.filter(p => !p.isPlayer && !p.isTeammate), [players]);

    const addEvent = useCallback((text: string) => {
        setEvents(prev => [{ id: Date.now(), text }, ...prev].slice(0, 5));
    }, []);

    const nextTurn = useCallback(() => {
        setTurn(t => t + 1);
        setCurrentQuestion(shuffleArray(DUEL_QUESTIONS)[0]);
        setSelectedAnswer(null);
        setHasSpecial(false);
        setPhase('question');
        setTimer(20);
    }, []);

    const damagePlayer = useCallback((targetId: string, amount: number) => {
        setPlayers(prev => prev.map(p => p.id === targetId ? { ...p, hp: Math.max(0, p.hp - amount) } : p));
    }, []);

    const healPlayer = useCallback((targetId: string, amount: number) => {
        setPlayers(prev => prev.map(p => p.id === targetId ? { ...p, hp: Math.min(p.maxHp, p.hp + amount) } : p));
    }, []);

    // Game Initialization
    useEffect(() => {
        const potentialTeammates = allUsers.filter(u => u.id !== userData.id && u.role === 'student');
        const teammateData = potentialTeammates.length > 0 ? shuffleArray(potentialTeammates)[0] : { ...userData, id: 'clone_teammate', name: 'Clone Allié' };

        const potentialOpponents = allUsers.filter(u => u.id !== userData.id && u.id !== teammateData.id && u.role === 'student');
        const opponent1Data = potentialOpponents.length > 0 ? shuffleArray(potentialOpponents)[0] : { ...userData, id: 'clone_opp1', name: 'Adversaire 1' };
        const opponent2Data = potentialOpponents.length > 1 ? shuffleArray(potentialOpponents.filter(u => u.id !== opponent1Data.id))[0] : { ...userData, id: 'clone_opp2', name: 'Adversaire 2' };

        setPlayers([
            { id: userData.id, name: userData.name, avatarIcon: getAvatarIcon(userData), hp: BATTLE_ROYALE_SETTINGS.INITIAL_HP, maxHp: BATTLE_ROYALE_SETTINGS.INITIAL_HP, isPlayer: true, isTeammate: false },
            { id: teammateData.id, name: teammateData.name, avatarIcon: getAvatarIcon(teammateData), hp: BATTLE_ROYALE_SETTINGS.INITIAL_HP, maxHp: BATTLE_ROYALE_SETTINGS.INITIAL_HP, isPlayer: false, isTeammate: true },
            { id: opponent1Data.id, name: opponent1Data.name, avatarIcon: getAvatarIcon(opponent1Data), hp: BATTLE_ROYALE_SETTINGS.INITIAL_HP, maxHp: BATTLE_ROYALE_SETTINGS.INITIAL_HP, isPlayer: false, isTeammate: false },
            { id: opponent2Data.id, name: opponent2Data.name, avatarIcon: getAvatarIcon(opponent2Data), hp: BATTLE_ROYALE_SETTINGS.INITIAL_HP, maxHp: BATTLE_ROYALE_SETTINGS.INITIAL_HP, isPlayer: false, isTeammate: false },
        ]);
        addEvent("Le combat commence !");
        nextTurn();
    }, [userData, allUsers, addEvent, nextTurn]);

    // Game Over Check
    useEffect(() => {
        const livingAllies = players.filter(p => (p.isPlayer || p.isTeammate) && p.hp > 0).length;
        const livingEnemies = players.filter(p => !p.isPlayer && !p.isTeammate && p.hp > 0).length;

        if (players.length > 0 && phase !== 'game_over') {
            if (livingAllies === 0) {
                setResult('loss');
                setPhase('game_over');
                addEvent("Votre équipe a été vaincue.");
            } else if (livingEnemies === 0) {
                setResult('win');
                setPhase('game_over');
                addEvent("Vous avez vaincu l'équipe adverse !");
            }
        }
    }, [players, phase, addEvent]);

    const handleAnswer = (answer: string) => {
        if (phase !== 'question' || selectedAnswer) return;

        setSelectedAnswer(answer);
        const isCorrect = answer === currentQuestion?.correctAnswer;
        
        // Simple logic: give user special on correct answer
        if (isCorrect) setHasSpecial(true);

        setTimeout(() => {
            if (isCorrect) {
                addEvent("✅ Bonne réponse ! Choisissez une action.");
                setPhase('action');
                setTimer(40);
            } else {
                addEvent("⚠️ Mauvaise réponse, vous passez votre tour.");
                setPhase('enemy_turn');
            }
        }, 1200);
    };
    
    // Timers
    useEffect(() => {
        if (phase === 'question' || phase === 'action') {
            if (timer > 0) {
                const interval = setInterval(() => setTimer(t => t - 1), 1000);
                return () => clearInterval(interval);
            } else {
                // Handle timeouts
                if (phase === 'question' && !selectedAnswer) {
                    addEvent(`⚠️ Inactivité détectée ! -${BATTLE_ROYALE_SETTINGS.WRONG_ANSWER_DAMAGE} HP`);
                    damagePlayer(userData.id, BATTLE_ROYALE_SETTINGS.WRONG_ANSWER_DAMAGE);
                    setPhase('enemy_turn');
                } else if (phase === 'action') {
                    addEvent(`⚠️ Inactivité détectée ! -10 HP. Action par défaut.`);
                    damagePlayer(userData.id, 10);
                    // Default action: attack strongest opponent
                    const target = opponents.filter(o => o.hp > 0).sort((a,b) => b.hp - a.hp)[0];
                    if(target) {
                        damagePlayer(target.id, BATTLE_ROYALE_SETTINGS.QUICK_ATTACK_DAMAGE);
                        addEvent(`⚔️ Vous attaquez ${target.name} (par défaut).`);
                    }
                    setPhase('enemy_turn');
                }
            }
        }
    }, [phase, timer, selectedAnswer, userData.id, damagePlayer, opponents, addEvent]);

    const executeAction = (action: Action, targetId?: string) => {
        const target = players.find(p => p.id === targetId);
        switch(action) {
            case 'quick_attack':
                if (!target) return;
                damagePlayer(target.id, 20);
                addEvent(`⚔️ Vous attaquez ${target.name} (-20 HP).`);
                break;
            case 'special_attack':
                if (!target) return;
                damagePlayer(target.id, 40);
                addEvent(`💥 Attaque spéciale sur ${target.name} (-40 HP) !`);
                break;
            case 'heal_self':
                healPlayer(userData.id, 25);
                addEvent(`💚 Vous vous soignez (+25 HP).`);
                break;
            case 'heal_teammate':
                if (!teammate) return;
                healPlayer(teammate.id, 25);
                addEvent(`💚 Vous soignez ${teammate.name} (+25 HP).`);
                break;
        }
        setPhase('enemy_turn');
    };
    
    // Enemy AI Turn
    useEffect(() => {
        if (phase === 'enemy_turn') {
            const livingAllies = players.filter(p => (p.isPlayer || p.isTeammate) && p.hp > 0);
            const livingEnemies = players.filter(p => !p.isPlayer && !p.isTeammate && p.hp > 0);

            let delay = 1000;

            // Teammate AI
            if (teammate && teammate.hp > 0) {
                setTimeout(() => {
                    if (Math.random() > 0.3) { // 70% correct
                        addEvent(`${teammate.name} a bien répondu.`);
                        const lowestAlly = livingAllies.sort((a,b) => a.hp - b.hp)[0];
                        if (lowestAlly.hp < 50 && Math.random() > 0.5) {
                            healPlayer(lowestAlly.id, 25);
                            addEvent(`💚 ${teammate.name} soigne ${lowestAlly.name}.`);
                        } else {
                            const target = livingEnemies.sort((a,b) => a.hp - b.hp)[0];
                            if(target) {
                                damagePlayer(target.id, 20);
                                addEvent(`⚔️ ${teammate.name} attaque ${target.name}.`);
                            }
                        }
                    } else {
                        addEvent(`${teammate.name} a mal répondu.`);
                    }
                }, delay);
                delay += 1500;
            }

            // Opponent AI
            livingEnemies.forEach(enemy => {
                 setTimeout(() => {
                     if (Math.random() > 0.4) { // 60% correct
                        addEvent(`${enemy.name} a bien répondu.`);
                        const target = livingAllies.sort((a,b) => a.hp - b.hp)[0];
                        if(target) {
                           damagePlayer(target.id, 20);
                           addEvent(`⚔️ ${enemy.name} attaque ${target.name}.`);
                        }
                     } else {
                         addEvent(`${enemy.name} a mal répondu.`);
                     }
                }, delay);
                delay += 1500;
            });
            
            setTimeout(() => {
                if(result === null) nextTurn();
            }, delay);
        }
    }, [phase, addEvent, damagePlayer, healPlayer, nextTurn, players, result, teammate]);

    if (players.length === 0 || !me || !teammate || opponents.length < 2) return <div className="bg-slate-900 text-white flex items-center justify-center h-full">Initialisation de l'arène...</div>;

    if (result) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-4 bg-slate-900 text-white">
                <span className="text-8xl">{result === 'win' ? '🏆' : '💀'}</span>
                <h2 className="text-5xl font-extrabold mt-4">{result === 'win' ? 'VICTOIRE !' : 'DÉFAITE'}</h2>
                <p className="mt-2 text-xl text-slate-300">Vous avez {result === 'win' ? 'triomphé' : 'été vaincu'}.</p>
                <button onClick={onEnd} className="mt-8 px-8 py-3 rounded-lg bg-primary font-bold text-white">Quitter l'arène</button>
            </div>
        );
    }
    
    return (
        <div className="h-full bg-gradient-to-b from-slate-900 to-purple-900 text-white p-4 flex flex-col gap-4 font-sans">
            {/* Header */}
            <header className="bg-black/20 p-2 rounded-lg flex justify-between items-center border border-slate-600">
                <h1 className="text-xl font-bold text-yellow-300">🏆 BATTLE ROYALE - TOUR {turn}</h1>
                <div className="font-bold">Survivants : {players.filter(p => p.hp > 0).length} / {players.length}</div>
            </header>

            {/* Arena */}
            <main className="flex-grow grid grid-cols-2 gap-4 items-center">
                {/* Your Team */}
                <div className="space-y-4">
                    <PlayerCard player={me} />
                    <PlayerCard player={teammate} />
                </div>
                {/* Enemy Team */}
                <div className="space-y-4">
                    <PlayerCard player={opponents[0]} />
                    <PlayerCard player={opponents[1]} />
                </div>
            </main>

            {/* Control Panel */}
            <footer className="bg-black/20 p-4 rounded-xl border-4 border-slate-700 min-h-[250px] flex flex-col justify-center">
                {phase === 'question' && currentQuestion && (
                    <div className="text-center animate-fade-in">
                        <p className="font-bold text-slate-400 mb-2">QUESTION (⏱️ {timer}s)</p>
                        <p className="text-lg font-semibold mb-3">{currentQuestion.question}</p>
                        <div className="grid grid-cols-2 gap-2 max-w-lg mx-auto">
                            {currentQuestion.options.map((opt, i) => {
                                let style = "bg-slate-700 hover:bg-slate-600";
                                if (selectedAnswer) {
                                    if (opt === currentQuestion.correctAnswer) style = "bg-green-600";
                                    else if (opt === selectedAnswer) style = "bg-red-600";
                                    else style = "bg-slate-700 opacity-50";
                                }
                                return <button key={i} onClick={() => handleAnswer(opt)} disabled={!!selectedAnswer} className={`p-3 rounded-lg font-semibold transition-all ${style}`}>{opt}</button>
                            })}
                        </div>
                    </div>
                )}
                 {phase === 'action' && (
                    <div className="text-center animate-fade-in">
                        <p className="font-bold text-green-400 mb-2">✅ BONNE RÉPONSE ! CHOISISSEZ UNE ACTION (⏱️ {timer}s)</p>
                        <div className="grid grid-cols-2 gap-3 max-w-xl mx-auto">
                            <button onClick={() => executeAction('quick_attack', opponents.filter(o=>o.hp > 0).sort((a,b) => a.hp-b.hp)[0]?.id)} className="p-3 rounded-lg bg-red-800 hover:bg-red-700">⚔️ Attaque (-20 HP)</button>
                            {hasSpecial && <button onClick={() => executeAction('special_attack', opponents.filter(o=>o.hp > 0).sort((a,b) => a.hp-b.hp)[0]?.id)} className="p-3 rounded-lg bg-purple-700 hover:bg-purple-600">💥 Attaque Spéciale (-40 HP)</button>}
                            <button onClick={() => executeAction('heal_self')} className="p-3 rounded-lg bg-green-800 hover:bg-green-700">💚 Me soigner (+25 HP)</button>
                            {teammate.hp > 0 && <button onClick={() => executeAction('heal_teammate')} className="p-3 rounded-lg bg-sky-800 hover:bg-sky-700">🤝 Soigner coéquipier (+25 HP)</button>}
                        </div>
                    </div>
                )}
                {phase === 'enemy_turn' && <p className="text-center text-2xl font-bold animate-pulse">Tour des adversaires...</p>}
            </footer>

            {/* Event Log */}
            <div className="absolute top-20 right-4 w-64 bg-black/50 p-2 rounded-lg backdrop-blur-sm hidden lg:block">
                 <h3 className="font-bold text-sm text-slate-300 mb-1">Journal :</h3>
                 <div className="space-y-1">
                     {events.map(e => <p key={e.id} className="text-xs bg-slate-800/80 p-1.5 rounded">{e.text}</p>)}
                 </div>
            </div>
        </div>
    );
};
