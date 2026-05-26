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
        <div className="h-full flex flex-col sm:flex-row gap-4 max-w-5xl mx-auto w-full">
            {/* Left Box: Info */}
            <div className="flex-none sm:w-[35%] bg-[#1a1a24] border-4 border-[#3b3b46] p-4 flex flex-col gap-4 shrink-0 overflow-y-auto custom-scrollbar">
                <h2 className="text-sm font-bold uppercase text-red-500 border-b-2 border-red-900 pb-2 tracking-wider text-center flex flex-col">
                    <span>Sistema de Ressurreição</span>
                    <span className="text-[10px] text-gray-400 mt-1">Roguelike Mode</span>
                </h2>
                
                <div className="bg-[#0a0a0f] border-2 border-[#2b2b36] p-3 text-center flex flex-col items-center">
                    <span className="text-[10px] text-gray-500 font-bold uppercase mb-1">Pontos de Ressurreição</span>
                    <div className="text-2xl font-black text-white flex items-center gap-2">
                        <span className="text-red-500">◆</span> {state.resurrectionPoints}
                    </div>
                </div>

                <p className="text-[10px] text-gray-400 leading-relaxed text-center mt-auto border-t-2 border-[#2b2b36] pt-4">
                    Ao morrer, você renasce mais forte. Seus pontos podem ser gastos para melhorar atributos permanentemente, e persistem após resetar o save.
                </p>
            </div>

            {/* Right Box: Catalog */}
            <div className="flex-1 flex flex-col bg-[#1a1a24] border-4 border-[#3b3b46] h-full overflow-hidden">
                <div className="flex overflow-x-auto custom-scrollbar shrink-0 border-b-4 border-[#3b3b46] bg-[#0a0a0f]">
                    {[
                        {id: 'economy', label: 'Economia'}, 
                        {id: 'combat', label: 'Combate'}
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setSubTab(tab.id as any)}
                            className={`p-3 text-[10px] md:text-xs font-bold uppercase border-r-2 border-[#2b2b36] last:border-r-0 whitespace-nowrap flex-1 transition-colors
                                      ${subTab === tab.id ? 'bg-[#2b2b36] text-white shadow-[inset_0_-3px_0_#ef4444]' : 'text-gray-500 hover:text-gray-300 hover:bg-[#1a1a24]'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex-grow overflow-y-auto custom-scrollbar p-2 space-y-2">
                    {UPGRADES.filter(upg => 
                        subTab === 'economy' ? economyNames.includes(upg.id) : combatNames.includes(upg.id)
                    ).map(upg => {
                        const currentLevel = state.upgrades[upg.id] || 0;
                        const isMax = currentLevel >= upg.maxLevel;
                        const cost = upg.baseCost + currentLevel; // simple scaling
                        const canAfford = state.resurrectionPoints >= cost && !isMax;

                        return (
                            <div key={upg.id} className="bg-[#1a1a24] border-l-4 border-red-800 p-3 shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center group gap-3 border-y-2 border-r-2 border-[#2b2b36]">
                                <div className="w-full sm:w-auto">
                                    <div className="font-bold text-gray-200 text-xs sm:text-sm uppercase flex items-center justify-between sm:justify-start gap-2">
                                        {upg.name}
                                        <span className="bg-[#0a0a0f] text-red-400 text-[10px] px-2 py-1 border border-red-900/50 whitespace-nowrap">NV {currentLevel}/{upg.maxLevel}</span>
                                    </div>
                                    <div className="text-[10px] sm:text-xs text-gray-400 mt-1 leading-relaxed">{upg.description}</div>
                                    <div className="text-[10px] text-green-400 mt-2">Efeito Atual: +{Math.round(currentLevel * upg.effectPerLevel * 100)}%</div>
                                </div>
                                
                                <button 
                                    onClick={() => handleBuyUpgrade(upg.id, cost)}
                                    disabled={!canAfford}
                                    className={`w-full sm:w-auto px-4 py-2 text-[10px] sm:text-xs font-bold uppercase border-2 transition-all active:scale-95 flex flex-col items-center justify-center shrink-0 min-w-[100px]
                                    ${isMax ? 'border-gray-700 bg-gray-900 text-gray-500' 
                                      : canAfford ? 'border-red-700 bg-[#3a0a0a] text-white hover:bg-red-900' : 'border-[#2b2b36] bg-[#0a0a0f] text-gray-600'}`}
                                >
                                    {isMax ? 'MÁXIMO' : 'MELHORAR'}
                                    {!isMax && <span className="text-[8px] opacity-70 mt-1">Custa: {cost} Pts</span>}
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
