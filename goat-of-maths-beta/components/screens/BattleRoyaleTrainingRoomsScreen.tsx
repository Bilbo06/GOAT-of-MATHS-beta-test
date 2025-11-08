import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { UserData, DuelQuestion } from '../../types';
import { DUEL_QUESTIONS, BATTLE_ROYALE_SETTINGS, SHOP_ITEMS } from '../../constants';

// TYPES
interface BRPlayer { id: string; name: string; avatar: string; hp: number; maxHp: number; roomId: number; isPlayer: boolean; }
interface GameEvent { id: number; text: string; }
type GamePhase = 'map' | 'fight' | 'post_fight' | 'game_over';
interface FightState { opponent: BRPlayer; question: DuelQuestion; playerAnswer: number | null; result: 'correct' | 'incorrect' | null; }

// HELPERS
const getAvatarIcon = (user: UserData) => SHOP_ITEMS.find(i => i.id === user.avatarId)?.icon || user.name.charAt(0);
const shuffleArray = <T,>(array: T[]): T[] => array.sort(() => Math.random() - 0.5);

// SUB-COMPONENTS
const HealthBar: React.FC<{ hp: number; maxHp: number }> = ({ hp, maxHp }) => {
    const percentage = Math.max(0, (hp / maxHp) * 100);
    const color = percentage > 50 ? 'bg-green-500' : percentage > 20 ? 'bg-yellow-500' : 'bg-red-500';
    return <div className="w-full bg-slate-700 rounded-full h-2.5"><div className={`${color} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div></div>;
};

const FightModal: React.FC<{ player: BRPlayer, opponent: BRPlayer, question: DuelQuestion, onAnswer: (answer: string) => void, selectedAnswer: string | null }> = ({ player, opponent, question, onAnswer, selectedAnswer }) => (
    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 z-20">
        <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-2xl animate-scale-in">
            <div className="flex justify-around items-center text-center mb-6">
                <div><div className="text-5xl">{player.avatar}</div><p className="font-bold">{player.name}</p><HealthBar hp={player.hp} maxHp={player.maxHp} /></div>
                <div className="text-4xl font-bold text-red-500">VS</div>
                <div><div className="text-5xl">{opponent.avatar}</div><p className="font-bold">{opponent.name}</p><HealthBar hp={opponent.hp} maxHp={opponent.maxHp} /></div>
            </div>
            <div className="text-center">
                <p className="text-xl font-semibold mb-4">{question.question}</p>
                <div className="grid grid-cols-2 gap-3">
                    {question.options.map(opt => {
                        let style = "bg-slate-700 hover:bg-slate-600";
                        if(selectedAnswer) {
                            if(opt === question.correctAnswer) style = "bg-green-600";
                            else if (opt === selectedAnswer) style = "bg-red-600";
                            else style = "bg-slate-700 opacity-50";
                        }
                        return <button key={opt} onClick={() => onAnswer(opt)} disabled={!!selectedAnswer} className={`p-3 rounded-lg font-semibold ${style}`}>{opt}</button>
                    })}
                </div>
            </div>
        </div>
    </div>
);

// MAIN COMPONENT
export const BattleRoyaleTrainingRoomsScreen: React.FC<{ userData: UserData; allUsers: UserData[]; onEnd: () => void; }> = ({ userData, allUsers, onEnd }) => {
    const [phase, setPhase] = useState<GamePhase>('map');
    const [players, setPlayers] = useState<BRPlayer[]>([]);
    const [events, setEvents] = useState<GameEvent[]>([]);
    const [fight, setFight] = useState<FightState | null>(null);
    const [postFightTimer, setPostFightTimer] = useState<number | null>(null);
    const [canHeal, setCanHeal] = useState(true);

    const me = players.find(p => p.isPlayer);
    const livingBots = players.filter(p => !p.isPlayer && p.hp > 0);

    const addEvent = useCallback((text: string) => {
        setEvents(prev => [{ id: Date.now(), text }, ...prev].slice(0, 10));
    }, []);
    
    // Game Initialization
    useEffect(() => {
        addEvent("Bienvenue dans l'arène d'entraînement !");
        const initialBots = Array.from({ length: 9 }, (_, i) => ({
            id: `bot_${i}`, name: `Bot ${i+1}`, avatar: '🤖', hp: BATTLE_ROYALE_SETTINGS.INITIAL_HP, maxHp: BATTLE_ROYALE_SETTINGS.INITIAL_HP, roomId: 0, isPlayer: false,
        }));
        const initialPlayer = { id: userData.id, name: userData.name, avatar: getAvatarIcon(userData), hp: BATTLE_ROYALE_SETTINGS.INITIAL_HP, maxHp: BATTLE_ROYALE_SETTINGS.INITIAL_HP, roomId: 0, isPlayer: true };
        
        const allParticipants = shuffleArray([initialPlayer, ...initialBots]);
        allParticipants.forEach((p, i) => p.roomId = Math.floor(i / 2));
        
        setPlayers(allParticipants);
    }, [userData, addEvent]);

    const updatePlayer = useCallback((id: string, updates: Partial<BRPlayer>) => {
        setPlayers(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    }, []);

    // Phase transition logic
    useEffect(() => {
        if (phase !== 'map' || !me) return;

        const opponentsInRoom = players.filter(p => p.roomId === me.roomId && !p.isPlayer && p.hp > 0);
        if (opponentsInRoom.length > 0) {
            const opponent = opponentsInRoom[0];
            addEvent(`Vous rencontrez ${opponent.name} dans la salle ${me.roomId + 1} !`);
            setFight({
                opponent,
                question: shuffleArray(DUEL_QUESTIONS)[0],
                playerAnswer: null,
                result: null,
            });
            setPhase('fight');
        }
    }, [phase, players, me, addEvent]);
    
    // Post-fight timer logic
    useEffect(() => {
        if (postFightTimer === null) return;
        if (postFightTimer <= 0) {
            setPostFightTimer(null);
            const targetRoom = shuffleArray(players.filter(p => !p.isPlayer && p.hp > 0).map(p => p.roomId))[0];
            if (me && targetRoom !== undefined) {
                addEvent("Temps écoulé ! Déplacement automatique...");
                updatePlayer(me.id, { roomId: targetRoom });
            }
            return;
        }
        const timerId = setTimeout(() => setPostFightTimer(t => t! - 1), 1000);
        return () => clearTimeout(timerId);
    }, [postFightTimer, players, me, updatePlayer, addEvent]);

    // Bot movement AI
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (phase === 'map' || phase === 'post_fight') {
                setPlayers(prev => {
                    return prev.map(p => {
                        if (!p.isPlayer && p.hp > 0) {
                           const newRoomId = Math.floor(Math.random() * 5);
                           return {...p, roomId: newRoomId};
                        }
                        return p;
                    });
                });
            }
        }, 10000); // Bots move every 10 seconds
        return () => clearInterval(intervalId);
    }, [phase]);


    const handleAnswer = (answer: string) => {
        if (!fight) return;
        const isCorrect = answer === fight.question.correctAnswer;
        
        if (isCorrect) {
            addEvent(`✅ Bonne réponse ! Vous attaquez ${fight.opponent.name}.`);
            const newOpponentHp = Math.max(0, fight.opponent.hp - BATTLE_ROYALE_SETTINGS.SPECIAL_ATTACK_DAMAGE);
            updatePlayer(fight.opponent.id, { hp: newOpponentHp });
            if (newOpponentHp <= 0) {
                addEvent(`🎉 Vous avez vaincu ${fight.opponent.name} !`);
                setTimeout(endFight, 1500);
            }
        } else {
            addEvent(`❌ Mauvaise réponse ! Vous subissez des dégâts.`);
            updatePlayer(me!.id, { hp: Math.max(0, me!.hp - BATTLE_ROYALE_SETTINGS.WRONG_ANSWER_DAMAGE) });
        }
        
        // Opponent's turn (simple version)
        setTimeout(() => {
            if (fight.opponent.hp > 0 && me && me.hp > 0) {
                addEvent(`⚔️ ${fight.opponent.name} vous attaque !`);
                updatePlayer(me!.id, { hp: Math.max(0, me!.hp - BATTLE_ROYALE_SETTINGS.QUICK_ATTACK_DAMAGE) });
            }
        }, 1000);

        // Reset for next question
        if (fight.opponent.hp > 0) {
             setTimeout(() => setFight(f => f ? ({ ...f, question: shuffleArray(DUEL_QUESTIONS)[0] }) : null), 2000);
        }
    };
    
    const endFight = () => {
        setFight(null);
        const opponentsInRoom = players.filter(p => p.roomId === me?.roomId && !p.isPlayer && p.hp > 0);
        if (opponentsInRoom.length === 1) { // The one we just fought is now at 0hp
             setPhase('map'); // Immediately start next fight
        } else {
            setPhase('post_fight');
            setPostFightTimer(180);
            setCanHeal(true);
        }
    };
    
    const handleMoveRoom = (roomId: number) => {
        if (!me || postFightTimer === null) return;
        addEvent(`Vous vous déplacez vers la salle ${roomId+1}.`);
        updatePlayer(me.id, { roomId });
        setPostFightTimer(null);
        setPhase('map');
    };
    
    const handleHeal = () => {
        if (me && canHeal) {
            addEvent("Vous utilisez votre pause pour vous soigner.");
            updatePlayer(me.id, { hp: Math.min(me.maxHp, me.hp + BATTLE_ROYALE_SETTINGS.HEAL_AMOUNT) });
            setCanHeal(false);
        }
    };
    
    if (!me || (me.hp <= 0 && phase !== 'game_over')) setPhase('game_over');
    if (livingBots.length === 0 && phase !== 'game_over') setPhase('game_over');

    return (
        <div className="min-h-screen bg-slate-900 text-white p-4 flex flex-col md:flex-row gap-4 relative">
            {fight && <FightModal player={me!} opponent={fight.opponent} question={fight.question} onAnswer={handleAnswer} selectedAnswer={""} />}
            {phase === 'game_over' && (
                 <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 z-20">
                     <div className="text-center">
                        <h2 className="text-5xl font-extrabold">{livingBots.length === 0 ? "🏆 VICTOIRE !" : "💀 DÉFAITE"}</h2>
                        <p className="mt-2">{livingBots.length === 0 ? "Vous êtes le dernier survivant !" : "Vous avez été vaincu."}</p>
                        <button onClick={onEnd} className="mt-6 px-6 py-3 bg-primary rounded-lg font-bold">Retour aux duels</button>
                    </div>
                 </div>
            )}
            
            <div className="flex-grow flex flex-col gap-4">
                <h1 className="text-2xl font-bold text-center">Entraînement - Arène Royale <span className="text-sm font-normal text-slate-400">({livingBots.length + 1} survivants)</span></h1>
                <div className="grid grid-cols-5 gap-3 flex-grow">
                    {Array.from({ length: 5 }).map((_, i) => {
                        const roomPlayers = players.filter(p => p.roomId === i);
                        const isPlayerInRoom = me?.roomId === i;
                        return (
                            <div key={i} onClick={() => postFightTimer !== null && handleMoveRoom(i)}
                                className={`bg-slate-800 rounded-lg p-2 flex flex-col border-2 ${isPlayerInRoom ? 'border-yellow-400' : 'border-transparent'} ${postFightTimer !== null && !isPlayerInRoom ? 'cursor-pointer hover:border-blue-400' : ''}`}>
                                <h3 className="font-bold text-sm text-center border-b border-slate-700 pb-1 mb-2">Salle {i + 1}</h3>
                                <div className="flex-grow flex flex-wrap gap-1 content-start">
                                    {roomPlayers.map(p => <div key={p.id} title={p.name} className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${p.hp > 0 ? (p.isPlayer ? 'bg-blue-500' : 'bg-red-500') : 'bg-slate-600'}`}>{p.avatar}</div>)}
                                </div>
                            </div>
                        );
                    })}
                </div>
                 <div className="bg-slate-800 rounded-xl p-4 text-center">
                    <p className="font-bold">{me?.name}</p>
                    {me && <HealthBar hp={me.hp} maxHp={me.maxHp} />}
                 </div>
            </div>
            
             <div className="w-full md:w-72 flex-shrink-0 bg-slate-800 rounded-xl p-4 flex flex-col gap-4">
                <h3 className="font-bold border-b border-slate-700 pb-2">Actions et Journal</h3>
                 {postFightTimer !== null && (
                    <div className="bg-blue-900/50 p-3 rounded-lg text-center">
                        <p className="font-bold">Salle sécurisée !</p>
                        <p className="text-3xl font-mono my-2">{Math.floor(postFightTimer / 60)}:{String(postFightTimer % 60).padStart(2, '0')}</p>
                        <button onClick={handleHeal} disabled={!canHeal} className="w-full p-2 rounded bg-green-600 font-bold disabled:bg-slate-600">💚 Se soigner (+{BATTLE_ROYALE_SETTINGS.HEAL_AMOUNT} HP)</button>
                        <p className="text-xs text-slate-400 mt-2">Cliquez sur une salle pour vous déplacer.</p>
                    </div>
                )}
                <div className="flex-grow space-y-2 overflow-y-auto pr-2">
                    {events.map(e => <p key={e.id} className="text-sm bg-slate-700/50 p-2 rounded-md">{e.text}</p>)}
                </div>
             </div>
        </div>
    );
};
