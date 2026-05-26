import React, { useState } from 'react';
import { useGame } from '../GameContext';
import { ITEMS, SHOP_SKILLS } from '../lib/gameData';
import { Item, Skill } from '../types';

export const Shop = () => {
    const { state, dispatch } = useGame();
    const [subTab, setSubTab] = useState<'weapons' | 'armors' | 'accessories' | 'consumables' | 'passives'>('weapons');

    const handleBuyItem = (item: Item) => {
        if (state.gold >= item.cost.gold && state.manaCrystals >= item.cost.crystals) {
            let itemType: any = 'weapons';
            if (item.type === 'armor') itemType = 'armors';
            if (item.type === 'accessory') itemType = 'accessories';
            if (item.type === 'consumable') itemType = 'consumables';
            dispatch({ type: 'BUY_ITEM', item, itemType });
        }
    }

    const handleBuySkill = (skillObj: { skill: Skill, cost: {gold: number, crystals: number} }) => {
        if (state.gold >= skillObj.cost.gold && state.manaCrystals >= skillObj.cost.crystals) {
            dispatch({ type: 'BUY_SKILL', skill: skillObj.skill, cost: skillObj.cost });
        }
    }

    // Filter items not to show already owned unique items (weapons, armors, accessories)
    const availableItems = ITEMS.filter(item => {
        if (item.type === 'consumable') return true;
        const typeKey = item.type === 'weapon' ? 'weapons' : item.type === 'armor' ? 'armors' : 'accessories';
        return !state.inventory[typeKey].find(i => i.id === item.id);
    });

    const availableSkills = SHOP_SKILLS.filter(s => {
        return !state.inventory.skills.find(sk => sk.id === s.skill.id);
    });

    const renderCost = (cost: { gold: number, crystals: number }) => (
        <div className="flex gap-2 text-[10px] sm:text-xs">
            {cost.gold > 0 && <span className="text-yellow-500 font-bold">{cost.gold} Ouro</span>}
            {cost.crystals > 0 && <span className="text-cyan-400 font-bold">{cost.crystals} Cristais</span>}
        </div>
    )

    return (
        <div className="h-full flex flex-col sm:flex-row gap-4 max-w-5xl mx-auto w-full">
            
            {/* Left Box: Wallet and Info */}
            <div className="flex-none sm:w-[35%] bg-[#020d1a]/80 backdrop-blur-md border border-[#004080] p-4 shadow-[0_0_15px_rgba(0,20,40,0.5)] flex flex-col gap-4 shrink-0 overflow-y-auto custom-scrollbar">
                <h2 className="text-sm font-bold uppercase text-[#03dbfc] border-b border-[#004080] pb-2 text-center tracking-wider shrink-0 drop-shadow-[0_0_5px_rgba(3,219,252,0.5)]">Bolsa do Jogador</h2>
                
                <div className="flex flex-col gap-3">
                    <div className="bg-[#001732]/50 border border-[#004080]/50 p-3 text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
                        <div className="text-[10px] text-[#03dbfc]/70 font-bold uppercase mb-1 tracking-widest">Ouro</div>
                        <div className="text-xl font-black text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]">{state.gold}</div>
                    </div>
                    <div className="bg-[#001732]/50 border border-[#004080]/50 p-3 text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#03dbfc] to-transparent"></div>
                        <div className="text-[10px] text-[#03dbfc]/70 font-bold uppercase mb-1 tracking-widest">Cristais de Mana</div>
                        <div className="text-xl font-black text-[#03dbfc] drop-shadow-[0_0_5px_rgba(3,219,252,0.5)]">{state.manaCrystals}</div>
                    </div>
                </div>
                
                <div className="mt-auto pt-4 border-t border-[#004080]">
                     <p className="text-[10px] text-blue-200/50 text-center uppercase tracking-widest">A Loja do Sistema oferece itens em troca de recursos adquiridos em combate.</p>
                </div>
            </div>

            {/* Right Box: Catalog */}
            <div className="flex-1 flex flex-col bg-[#020d1a]/80 backdrop-blur-md border border-[#004080] h-full overflow-hidden shadow-[0_0_15px_rgba(0,20,40,0.5)]">
                <div className="flex overflow-x-auto custom-scrollbar shrink-0 border-b border-[#004080] bg-[#001732]/80">
                    {[
                        {id: 'weapons', label: 'Armas'}, 
                        {id: 'armors', label: 'Armaduras'}, 
                        {id: 'accessories', label: 'Acessórios'},
                        {id: 'consumables', label: 'Poções'},
                        {id: 'passives', label: 'Passivas'}
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setSubTab(tab.id as any)}
                            className={`p-3 text-[10px] md:text-xs font-bold uppercase border-r border-[#004080] last:border-r-0 whitespace-nowrap flex-1 transition-all
                                      ${subTab === tab.id ? 'bg-[#03dbfc]/10 text-[#03dbfc] shadow-[inset_0_-2px_0_#03dbfc]' : 'text-blue-300/50 hover:text-blue-200 hover:bg-[#001c3d]'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex-grow overflow-y-auto custom-scrollbar p-2 space-y-2">
                    {subTab !== 'passives' && availableItems.filter(item => {
                        if (subTab === 'weapons') return item.type === 'weapon';
                        if (subTab === 'armors') return item.type === 'armor';
                        if (subTab === 'accessories') return item.type === 'accessory';
                        if (subTab === 'consumables') return item.type === 'consumable';
                        return false;
                    }).map(item => {
                        const canAfford = state.gold >= item.cost.gold && state.manaCrystals >= item.cost.crystals;
                        return (
                            <div key={item.id} className={`bg-[#001732]/50 p-3 border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-colors
                                ${canAfford ? 'border-[#004080]/50 hover:border-[#03dbfc]/50' : 'border-red-900/30 opacity-70'}`}>
                                <div>
                                    <div className="font-bold text-[#c9e0ff] text-xs uppercase tracking-wide">[{item.rank}] {item.name}</div>
                                    <div className="text-[10px] sm:text-xs text-blue-200/70 mt-1 leading-tight">{item.description}</div>
                                    <div className="mt-2">{renderCost(item.cost)}</div>
                                </div>
                                <button 
                                    onClick={() => handleBuyItem(item)}
                                    disabled={!canAfford}
                                    className={`px-4 py-2 text-[10px] font-bold uppercase border flex-shrink-0 active:scale-95 transition-all outline-none w-full sm:w-auto skew-x-[-12deg]
                                    ${canAfford ? 'border-[#03dbfc]/50 bg-[#001c3d] text-[#03dbfc] hover:bg-[#03dbfc] hover:text-[#010915]' : 'border-gray-700/50 bg-[#010915] text-gray-600'}`}
                                >
                                    <span className="block skew-x-[12deg]">Comprar</span>
                                </button>
                            </div>
                        )
                    })}

                    {subTab !== 'passives' && availableItems.filter(item => {
                        if (subTab === 'weapons') return item.type === 'weapon';
                        if (subTab === 'armors') return item.type === 'armor';
                        if (subTab === 'accessories') return item.type === 'accessory';
                        if (subTab === 'consumables') return item.type === 'consumable';
                        return false;
                    }).length === 0 && (
                        <div className="text-blue-300/50 text-sm p-4 text-center uppercase tracking-widest">Nenhum item disponível nesta categoria.</div>
                    )}

                    {subTab === 'passives' && availableSkills.map(s => {
                        const canAfford = state.gold >= s.cost.gold && state.manaCrystals >= s.cost.crystals;
                        return (
                            <div key={s.skill.id} className={`bg-[#001732]/50 p-3 border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-colors
                                ${canAfford ? 'border-purple-500/30 hover:border-purple-400' : 'border-red-900/30 opacity-70'}`}>
                                <div>
                                    <div className="font-bold text-purple-300 text-xs uppercase tracking-wide">[{s.skill.rank}] {s.skill.name}</div>
                                    <div className="text-[10px] sm:text-xs text-purple-200/50 mt-1 leading-tight">{s.skill.description}</div>
                                    <div className="mt-2">{renderCost(s.cost)}</div>
                                </div>
                                <button 
                                    onClick={() => handleBuySkill(s)}
                                    disabled={!canAfford}
                                    className={`px-4 py-2 text-[10px] font-bold uppercase border flex-shrink-0 active:scale-95 transition-all outline-none w-full sm:w-auto skew-x-[-12deg]
                                    ${canAfford ? 'border-purple-500/50 bg-purple-900/20 text-purple-400 hover:bg-purple-500 hover:text-[#010915]' : 'border-gray-700/50 bg-[#010915] text-gray-600'}`}
                                >
                                    <span className="block skew-x-[12deg]">Comprar</span>
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

