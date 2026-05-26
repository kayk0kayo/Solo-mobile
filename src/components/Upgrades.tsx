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
            <div className="flex-none sm:w-[35%] bg-[#020d1a]/80 backdrop-blur-md border border-red-900/50 p-4 flex flex-col gap-4 shrink-0 overflow-y-auto custom-scrollbar shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                <h2 className="text-sm font-bold uppercase text-red-500 border-b border-red-900/50 pb-2 tracking-wider text-center flex flex-col drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]">
                    <span>Sistema de Ressurreição</span>
                    <span className="text-[10px] text-red-300/50 mt-1">Roguelike Mode</span>
                </h2>
                
                <div className="bg-[#1a0505]/80 border border-red-900/50 p-3 text-center flex flex-col items-center shadow-[inset_0_0_10px_rgba(239,68,68,0.1)]">
                    <span className="text-[10px] text-red-400/80 font-bold uppercase mb-1 tracking-widest">Pontos de Ressurreição</span>
                    <div className="text-2xl font-black text-red-500 flex items-center gap-2 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]">
                        <span className="text-red-600">◆</span> {state.resurrectionPoints}
                    </div>
                </div>

                <p className="text-[10px] text-red-200/60 leading-relaxed text-center mt-auto border-t border-red-900/50 pt-4 uppercase tracking-widest">
                    Ao morrer, você renasce mais forte. Seus pontos podem ser gastos para melhorar atributos permanentemente, e persistem após resetar o save.
                </p>
            </div>

            {/* Right Box: Catalog */}
            <div className="flex-1 flex flex-col bg-[#020d1a]/80 backdrop-blur-md border border-red-900/50 h-full overflow-hidden shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                <div className="flex overflow-x-auto custom-scrollbar shrink-0 border-b border-red-900/50 bg-[#1a0505]/80">
                    {[
                        {id: 'economy', label: 'Economia'}, 
                        {id: 'combat', label: 'Combate'}
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setSubTab(tab.id as any)}
                            className={`p-3 text-[10px] md:text-xs font-bold uppercase border-r border-red-900/50 last:border-r-0 whitespace-nowrap flex-1 transition-all
                                      ${subTab === tab.id ? 'bg-red-900/20 text-red-400 shadow-[inset_0_-2px_0_#ef4444]' : 'text-red-300/50 hover:text-red-300 hover:bg-[#2a0808]/50'}`}
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
                            <div key={upg.id} className="bg-[#1a0505]/50 border border-red-900/30 p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center group gap-3 hover:border-red-500/50 transition-all">
                                <div className="w-full sm:w-auto">
                                    <div className="font-bold text-red-200 text-xs sm:text-sm uppercase flex items-center justify-between sm:justify-start gap-2 tracking-wide">
                                        {upg.name}
                                        <span className="bg-[#0a0a0f] text-red-400 text-[10px] px-2 py-0.5 border border-red-900/50 whitespace-nowrap">NV {currentLevel}/{upg.maxLevel}</span>
                                    </div>
                                    <div className="text-[10px] sm:text-xs text-red-200/50 mt-1 leading-relaxed">{upg.description}</div>
                                    <div className="text-[10px] text-[#03dbfc] mt-2 font-bold drop-shadow-[0_0_2px_rgba(3,219,252,0.8)]">Efeito Atual: +{Math.round(currentLevel * upg.effectPerLevel * 100)}%</div>
                                </div>
                                
                                <button 
                                    onClick={() => handleBuyUpgrade(upg.id, cost)}
                                    disabled={!canAfford}
                                    className={`w-full sm:w-auto px-4 py-2 text-[10px] sm:text-xs font-bold uppercase border transition-all active:scale-95 flex flex-col items-center justify-center shrink-0 min-w-[100px] skew-x-[-12deg]
                                    ${isMax ? 'border-gray-700/50 bg-gray-900/50 text-gray-500' 
                                      : canAfford ? 'border-red-500/50 bg-red-900/30 text-red-400 hover:bg-red-500 hover:text-[#010915]' : 'border-red-900/30 bg-[#0a0a0f] text-red-900/50'}`}
                                >
                                    <span className="block skew-x-[12deg]">{isMax ? 'MÁXIMO' : 'MELHORAR'}</span>
                                    {!isMax && <span className="text-[8px] opacity-70 mt-1 block skew-x-[12deg]">Custo: {cost} PT</span>}
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
