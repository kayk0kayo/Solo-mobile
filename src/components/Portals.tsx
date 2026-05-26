import React from 'react';
import { useGame } from '../GameContext';
import { generateMonster, RANKS } from '../lib/gameData';
import { Monster, Rank } from '../types';

export const Portals = ({ onEnterPortal }: { onEnterPortal: (m: Monster, isRed: boolean) => void }) => {
    
    const handleEnterPortal = (rank: Rank) => {
        // 15% chance to become a Red Portal
        const isRed = Math.random() < 0.15;
        
        // Spawn normal monster first. Battle component will handle boss/secret sequentially later.
        const firstMonster = generateMonster(rank, 'normal', isRed);
        
        onEnterPortal(firstMonster, isRed);
    }

    return (
        <div className="h-full flex flex-col gap-4 max-w-2xl mx-auto font-mono">
            <div className="bg-[#111] border-4 border-white p-4 text-center shrink-0 pixel-box">
                <h2 className="text-xl font-bold uppercase text-white tracking-widest drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">Masmorras Instanciadas</h2>
                <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest leading-relaxed">Escolha com cautela. A qualquer momento, um portal normal pode revelar sua verdadeira forma como um Portal Vermelho (Rank +1).</p>
            </div>

            <div className="flex-grow overflow-y-auto custom-scrollbar grid grid-cols-1 sm:grid-cols-2 gap-4 place-content-start pb-8">
                {RANKS.map(rank => (
                    <button
                        key={rank}
                        onClick={() => handleEnterPortal(rank)}
                        className="relative group bg-[#222] border-4 border-[#555] p-4 hover:border-white overflow-hidden text-left transition-none active:translate-y-1 pixel-box"
                    >
                        <div className="relative z-10 flex justify-between items-center">
                            <div>
                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Portal Gate</div>
                                <div className="text-2xl font-black text-white uppercase tracking-wider drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">Rank {rank}</div>
                            </div>
                            <div className="w-12 h-12 bg-blue-900 border-4 border-blue-400 flex items-center justify-center pixel-box">
                                <div className="w-4 h-full bg-blue-400"></div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}
