import React from 'react';
import { useGame } from '../GameContext';
import { generateMonster, RANKS } from '../lib/gameData';
import { Monster, Rank } from '../types';
import { PixelImage } from './PixelImage';

import portalE from '../assets/images/portal_rank_e_1780249307767.png';
import portalD from '../assets/images/portal_rank_d_1780249351897.png';
import portalC from '../assets/images/portal_rank_c_1780249371862.png';
import portalB from '../assets/images/portal_rank_b_1780249387468.png';
import portalA from '../assets/images/portal_rank_a_1780249404412.png';
import portalS from '../assets/images/portal_rank_s_1780249422048.png';

const portalImages: Record<Rank, string> = {
    'E': portalE,
    'D': portalD,
    'C': portalC,
    'B': portalB,
    'A': portalA,
    'S': portalS
};

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
                            <div className="w-32 h-32 bg-black border-4 border-[#555] group-hover:border-white flex items-center justify-center pixel-box overflow-hidden shrink-0">
                                <PixelImage
                                    src={portalImages[rank]}
                                    alt={`Portal Rank ${rank}`}
                                    itemType="portal"
                                    rank={rank}
                                    zoomOnHover={true}
                                    className="w-full h-full object-cover scale-[1.7] group-hover:scale-[1.9]"
                                />
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}
