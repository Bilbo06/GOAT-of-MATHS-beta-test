import React from 'react';

interface BattleRoyaleLobbyScreenProps {
    onStartGame: () => void;
    onBack: () => void;
}

const StatPill: React.FC<{ icon: string; label: string; value: string; }> = ({ icon, label, value }) => (
    <div className="bg-white/10 p-3 rounded-lg text-center">
        <p className="text-3xl">{icon}</p>
        <p className="font-bold text-lg">{value}</p>
        <p className="text-xs text-purple-200">{label}</p>
    </div>
);

export const BattleRoyaleLobbyScreen: React.FC<BattleRoyaleLobbyScreenProps> = ({ onStartGame, onBack }) => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-purple-900 text-white p-4 sm:p-6 flex flex-col">
            <header className="flex items-center justify-between">
                <button onClick={onBack} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 font-bold text-sm">
                    &larr; Retour aux Duels
                </button>
                <div className="px-4 py-2 bg-yellow-400/20 border border-yellow-400 text-yellow-300 rounded-full text-sm font-bold">
                    ÉVÉNEMENT SPÉCIAL
                </div>
            </header>

            <main className="flex-grow flex flex-col items-center justify-center text-center">
                <h1 className="text-8xl animate-pulse">👑</h1>
                <h2 className="text-4xl sm:text-5xl font-extrabold mt-2">Arène Royale 2v2</h2>
                <p className="text-lg text-purple-200 mt-2 max-w-2xl">
                    Faites équipe, répondez aux questions pour débloquer des actions et soyez la dernière équipe debout pour remporter la gloire !
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8 max-w-3xl w-full">
                    <StatPill icon="👥" label="Participants" value="40" />
                    <StatPill icon="🤝" label="Équipes" value="20" />
                    <StatPill icon="⚔️" label="Salles" value="10" />
                    <StatPill icon="🏆" label="Gagnants" value="1 Équipe" />
                </div>
                
                <div className="bg-white/5 p-6 rounded-xl border border-white/20 max-w-2xl w-full">
                    <h3 className="text-xl font-bold mb-3">Comment jouer ?</h3>
                    <ul className="text-sm space-y-2 text-purple-200">
                        <li><span>1.</span> Répondez correctement à la question pour débloquer vos actions.</li>
                        <li><span>2.</span> Choisissez une action : attaquer un ennemi, vous soigner ou aider votre coéquipier.</li>
                        <li><span>3.</span> Une mauvaise réponse vous fait perdre des points de vie. Ne tardez pas !</li>
                        <li><span>4.</span> Éliminez l'équipe adverse pour gagner la manche et avancer.</li>
                    </ul>
                </div>
                
                 <button 
                    onClick={onStartGame}
                    className="mt-8 px-12 py-5 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 font-bold text-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all"
                >
                    Lancer une partie (Simulation)
                </button>
            </main>
        </div>
    );
};