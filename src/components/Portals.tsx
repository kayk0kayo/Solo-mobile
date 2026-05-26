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
        <div className="h-full flex flex-col gap-4 max-w-2xl mx-auto">
            <div className="bg-[#1a1a24] border-4 border-[#3b3b46] p-4 text-center shrink-0">
                <h2 className="text-xl font-bold uppercase text-blue-400 tracking-wider">Masmorras (Portais)</h2>
                <p className="text-[10px] text-gray-400 mt-2">Escolha com cautela. A qualquer momento, um portal normal pode revelar sua verdadeira forma como um Portal Vermelho (Rank +1).</p>
            </div>

            <div className="flex-grow overflow-y-auto custom-scrollbar grid grid-cols-1 sm:grid-cols-2 gap-4 place-content-start pb-8">
                {RANKS.map(rank => (
                    <button
                        key={rank}
                        onClick={() => handleEnterPortal(rank)}
                        className="relative group bg-[#0a0a0f] border-4 border-[#2b2b36] p-4 hover:border-blue-500 overflow-hidden text-left transition-colors active:scale-95"
                    >
                        <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-blue-900/20 transition-colors"></div>
                        <div className="relative z-10 flex justify-between items-center">
                            <div>
                                <div className="text-sm font-bold text-gray-500 uppercase">Portal Gate</div>
                                <div className="text-2xl font-black text-white uppercase drop-shadow-md">Rank {rank}</div>
                            </div>
                            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center animate-pulse border border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                                <div className="w-6 h-6 bg-blue-400 rounded-full blur-[2px]"></div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}
