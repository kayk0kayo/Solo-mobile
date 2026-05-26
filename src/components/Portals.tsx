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
            <div className="bg-[#020d1a]/80 backdrop-blur-md border border-[#004080] p-4 text-center shrink-0 shadow-[0_0_15px_rgba(0,20,40,0.5)]">
                <h2 className="text-xl font-bold uppercase text-[#03dbfc] tracking-widest drop-shadow-[0_0_5px_rgba(3,219,252,0.8)]">Masmorras Instanciadas</h2>
                <p className="text-[10px] text-blue-200/50 mt-2 uppercase tracking-widest">Escolha com cautela. A qualquer momento, um portal normal pode revelar sua verdadeira forma como um Portal Vermelho (Rank +1).</p>
            </div>

            <div className="flex-grow overflow-y-auto custom-scrollbar grid grid-cols-1 sm:grid-cols-2 gap-4 place-content-start pb-8">
                {RANKS.map(rank => (
                    <button
                        key={rank}
                        onClick={() => handleEnterPortal(rank)}
                        className="relative group bg-[#001732]/80 border border-[#004080] p-4 hover:border-[#03dbfc]/80 overflow-hidden text-left transition-all active:scale-95 skew-x-[-4deg]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#03dbfc]/5 to-transparent group-hover:from-[#03dbfc]/20 transition-all"></div>
                        <div className="absolute top-0 right-0 w-16 h-1 bg-gradient-to-r from-transparent to-[#03dbfc] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-[#03dbfc] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        <div className="relative z-10 flex justify-between items-center transform skew-x-[4deg]">
                            <div>
                                <div className="text-[10px] font-bold text-[#03dbfc]/50 uppercase tracking-widest">Portal Gate</div>
                                <div className="text-2xl font-black text-[#c9e0ff] uppercase tracking-wider drop-shadow-md group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(3,219,252,0.8)] transition-all">Rank {rank}</div>
                            </div>
                            <div className="w-12 h-12 bg-[#03dbfc]/10 flex items-center justify-center animate-pulse border border-[#03dbfc]/50 shadow-[0_0_15px_rgba(3,219,252,0.3)] skew-x-[-12deg]">
                                <div className="w-4 h-full bg-[#03dbfc]/80 blur-[4px]"></div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}
