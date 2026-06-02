import React, { useState } from 'react';
import { useGame } from '../GameContext';
import { Monster } from '../types';

export const Training = ({ onEnterBattle }: { onEnterBattle: (m: Monster, isRed: boolean) => void }) => {
    const { state } = useGame();
    const [isEntering, setIsEntering] = useState(false);

    const startTraining = () => {
        setIsEntering(true);
        setTimeout(() => {
            const hologram: Monster = {
                id: 'hologram',
                name: 'Kobolt Holograma',
                rank: 'E',
                hp: 20,
                maxHp: 20,
                damage: 2,
                defense: 1,
                isBoss: false,
                isSecret: false,
                xpReward: 30, // Generous XP to reach level 5 quickly
                goldReward: 5,
                crystalReward: 0
            };
            onEnterBattle(hologram, false);
        }, 1000);
    };

    return (
        <div className="h-full flex flex-col p-4">
            <h2 className="text-xl font-bold uppercase border-b-4 border-white pb-2 mb-4 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
                Treinamento Diário
            </h2>

            {state.level >= 5 ? (
                <div className="flex-1 flex flex-col items-center justify-center border-4 pixel-box border-green-500 bg-green-900/20 p-8 text-center">
                    <h3 className="text-2xl font-black text-green-400 mb-2 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
                        Você completou o tutorial!
                    </h3>
                    <p className="text-gray-300 font-mono text-sm max-w-md mt-4">
                        Seu corpo agora está pronto para enfrentar as verdadeiras Masmorras. Explore os portais vermelhos com cautela.
                    </p>
                </div>
            ) : (
                <div className={`flex-1 flex flex-col items-center justify-center border-4 pixel-box border-blue-500 bg-blue-900/20 p-8 text-center relative overflow-hidden transition-all duration-1000 ${isEntering ? 'scale-150 opacity-0' : 'scale-100 opacity-100'}`}>
                    <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay"></div>

                    <h3 className="text-xl font-black text-blue-400 mb-2 drop-shadow-[2px_2px_0_rgba(0,0,0,1)] z-10">
                        Simulação de Combate Inicial
                    </h3>
                    <p className="text-gray-300 font-mono text-sm max-w-md mt-2 z-10">
                        Seu nível atual é {state.level}. Derrote hologramas para ganhar experiência em um ambiente seguro até atingir o Nível 5.
                    </p>

                    <button 
                        onClick={startTraining}
                        disabled={isEntering}
                        className="mt-8 px-8 py-4 bg-blue-700 hover:bg-blue-600 text-white font-bold border-4 border-white hover:scale-105 transition-transform drop-shadow-[4px_4px_0_rgba(0,0,0,1)] z-10 pixel-box focus:outline-none"
                    >
                        INICIAR TREINO VIRTUAL
                    </button>
                    <div className="text-xs text-blue-300/50 mt-4 font-mono z-10">
                        Inimigo: Kobolt Holograma | Aviso: Apenas para testes.
                    </div>
                    {isEntering && (
                        <div className="fixed inset-0 bg-white z-50 animate-pulse transition-opacity duration-1000 opacity-100"></div>
                    )}
                </div>
            )}
        </div>
    );
};
