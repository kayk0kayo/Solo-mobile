import React, { useState } from 'react';
import { useGame } from '../GameContext';
import { UPGRADES } from '../lib/gameData';

export const Upgrades = () => {
    const { state, dispatch } = useGame();
    const [subTab, setSubTab] = useState<'economy' | 'combat'>('economy');

    const handleBuyUpgrade = (id: string, cost: number) => {
        dispatch({ type: 'BUY_UPGRADE', upgradeId: id, cost });
    }

    const economyNames = ['upg_gold', 'upg_xp', 'upg_crystals', 'upg_classpts'];
    const combatNames = ['upg_dmg'];

    return (
        <div className="h-full flex flex-col sm:flex-row gap-4 max-w-5xl mx-auto w-full font-mono">
            {/* Left Box: Info */}
            <div className="flex-none sm:w-[35%] bg-[#111] border-4 border-red-900 p-4 flex flex-col gap-4 shrink-0 overflow-y-auto custom-scrollbar pixel-box">
                <h2 className="text-sm font-bold uppercase text-red-500 border-b-4 border-red-900 pb-2 tracking-wider text-center flex flex-col drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
                    <span>Sistema de Ressurreição</span>
                    <span className="text-[10px] text-red-700 mt-1">Roguelike Mode</span>
                </h2>
                
                <div className="bg-[#2a0808] border-4 border-red-900 p-3 text-center flex flex-col items-center pixel-box">
                    <span className="text-[10px] text-red-400 font-bold uppercase mb-1 tracking-widest">Pontos de Ressurreição</span>
                    <div className="text-2xl font-black text-red-500 flex items-center gap-2 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
                        <span className="text-red-600">◆</span> {state.resurrectionPoints}
                    </div>
                </div>

                <p className="text-[10px] text-red-400 leading-relaxed text-center mt-auto border-t-4 border-red-900 pt-4 uppercase tracking-widest">
                    Ao morrer, você renasce mais forte. Seus pontos podem ser gastos para melhorar atributos permanentemente, e persistem após resetar o save.
                </p>
            </div>

            {/* Right Box: Catalog */}
            <div className="flex-1 flex flex-col bg-[#111] border-4 border-red-900 h-full overflow-hidden pixel-box">
                <div className="flex overflow-x-auto custom-scrollbar shrink-0 border-b-4 border-red-900 bg-black">
                    {[
                        {id: 'economy', label: 'Economia'}, 
                        {id: 'combat', label: 'Combate'}
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setSubTab(tab.id as any)}
                            className={`p-3 text-[10px] md:text-xs font-bold uppercase border-r-4 border-red-900 last:border-r-0 flex-1 transition-none
                                      ${subTab === tab.id ? 'bg-[#333] text-white shadow-none' : 'text-red-800 hover:text-red-500 hover:bg-[#222]'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex-grow overflow-y-auto custom-scrollbar p-2 space-y-2 font-sans">
                    {UPGRADES.filter(upg => 
                        subTab === 'economy' ? economyNames.includes(upg.id) : combatNames.includes(upg.id)
                    ).map(upg => {
                        const currentLevel = state.upgrades[upg.id] || 0;
                        const isMax = currentLevel >= upg.maxLevel;
                        const cost = upg.baseCost + currentLevel; // simple scaling
                        const canAfford = state.resurrectionPoints >= cost && !isMax;

                        return (
                            <div key={upg.id} className="bg-[#222] border-4 border-red-900 p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center group gap-3 hover:border-red-500 transition-none pixel-box">
                                <div className="w-full sm:w-auto">
                                    <div className="font-bold text-red-200 text-xs sm:text-sm uppercase flex items-center justify-between sm:justify-start gap-2 tracking-wide">
                                        {upg.name}
                                        <span className="bg-black text-red-400 text-[10px] px-2 py-0.5 border-2 border-red-900 whitespace-nowrap">NV {currentLevel}/{upg.maxLevel}</span>
                                    </div>
                                    <div className="text-[10px] sm:text-xs text-gray-400 mt-1 leading-relaxed">{upg.description}</div>
                                    <div className="text-[10px] text-blue-400 mt-2 font-bold drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">Efeito Atual: +{Math.round(currentLevel * upg.effectPerLevel * 100)}%</div>
                                </div>
                                
                                <button 
                                    onClick={() => handleBuyUpgrade(upg.id, cost)}
                                    disabled={!canAfford}
                                    className={`w-full sm:w-auto px-4 py-2 text-[10px] sm:text-xs font-bold uppercase border-2 transition-none active:translate-y-1 flex flex-col items-center justify-center shrink-0 min-w-[100px]
                                    ${isMax ? 'border-gray-700 bg-gray-900 text-gray-500' 
                                      : canAfford ? 'border-red-500 bg-black text-red-400 hover:bg-red-500 hover:text-white' : 'border-red-900 bg-black text-red-900'}`}
                                >
                                    <span className="block">{isMax ? 'MÁXIMO' : 'MELHORAR'}</span>
                                    {!isMax && <span className="text-[8px] opacity-70 mt-1 block">Custo: {cost} PT</span>}
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
