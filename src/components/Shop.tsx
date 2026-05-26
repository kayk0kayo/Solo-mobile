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
            <div className="flex-none sm:w-[35%] bg-[#1a1a24] border-4 border-[#3b3b46] p-4 shadow-lg flex flex-col gap-4 shrink-0 overflow-y-auto custom-scrollbar">
                <h2 className="text-sm font-bold uppercase text-gray-300 border-b-2 border-[#2b2b36] pb-2 text-center tracking-wider shrink-0">Bolsa do Jogador</h2>
                
                <div className="flex flex-col gap-3">
                    <div className="bg-[#0a0a0f] border-2 border-[#2b2b36] p-3 text-center">
                        <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Ouro</div>
                        <div className="text-xl font-black text-yellow-500 drop-shadow-md">{state.gold}</div>
                    </div>
                    <div className="bg-[#0a0a0f] border-2 border-[#2b2b36] p-3 text-center">
                        <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Cristais de Mana</div>
                        <div className="text-xl font-black text-cyan-400 drop-shadow-md">{state.manaCrystals}</div>
                    </div>
                </div>
                
                <div className="mt-auto pt-4 border-t-2 border-[#2b2b36]">
                     <p className="text-[10px] text-gray-500 text-center">A Loja do Sistema oferece itens em troca de recursos obtidos nas batalhas.</p>
                </div>
            </div>

            {/* Right Box: Catalog */}
            <div className="flex-1 flex flex-col bg-[#1a1a24] border-4 border-[#3b3b46] h-full overflow-hidden">
                <div className="flex overflow-x-auto custom-scrollbar shrink-0 border-b-4 border-[#3b3b46] bg-[#0a0a0f]">
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
                            className={`p-3 text-[10px] md:text-xs font-bold uppercase border-r-2 border-[#2b2b36] last:border-r-0 whitespace-nowrap flex-1 transition-colors
                                      ${subTab === tab.id ? 'bg-[#2b2b36] text-white shadow-[inset_0_-3px_0_#eab308]' : 'text-gray-500 hover:text-gray-300 hover:bg-[#1a1a24]'}`}
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
                            <div key={item.id} className={`bg-[#1a1a24] p-3 border-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-colors
                                ${canAfford ? 'border-[#3b3b46] hover:border-yellow-700/50' : 'border-red-900/30 opacity-70'}`}>
                                <div>
                                    <div className="font-bold text-gray-200 text-xs uppercase">[{item.rank}] {item.name}</div>
                                    <div className="text-[10px] sm:text-xs text-gray-400 mt-1">{item.description}</div>
                                    <div className="mt-2">{renderCost(item.cost)}</div>
                                </div>
                                <button 
                                    onClick={() => handleBuyItem(item)}
                                    disabled={!canAfford}
                                    className={`px-4 py-2 text-[10px] font-bold uppercase border-2 flex-shrink-0 active:scale-95 transition-all outline-none w-full sm:w-auto
                                    ${canAfford ? 'border-yellow-700 bg-yellow-900/40 text-yellow-500 hover:bg-yellow-700 hover:text-white' : 'border-gray-700 bg-[#0a0a0f] text-gray-600'}`}
                                >
                                    Comprar
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
                        <div className="text-gray-500 text-sm p-4 text-center">Nenhum item disponível nesta categoria.</div>
                    )}

                    {subTab === 'passives' && availableSkills.map(s => {
                        const canAfford = state.gold >= s.cost.gold && state.manaCrystals >= s.cost.crystals;
                        return (
                            <div key={s.skill.id} className={`bg-[#1a1a24] p-3 border-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-colors
                                ${canAfford ? 'border-purple-900/50 hover:border-purple-500' : 'border-red-900/30 opacity-70'}`}>
                                <div>
                                    <div className="font-bold text-purple-300 text-xs uppercase">[{s.skill.rank}] {s.skill.name}</div>
                                    <div className="text-[10px] sm:text-xs text-purple-200/50 mt-1">{s.skill.description}</div>
                                    <div className="mt-2">{renderCost(s.cost)}</div>
                                </div>
                                <button 
                                    onClick={() => handleBuySkill(s)}
                                    disabled={!canAfford}
                                    className={`px-4 py-2 text-[10px] font-bold uppercase border-2 flex-shrink-0 active:scale-95 transition-all outline-none w-full sm:w-auto
                                    ${canAfford ? 'border-purple-700 bg-purple-900/40 text-purple-400 hover:bg-purple-700 hover:text-white' : 'border-gray-700 bg-[#0a0a0f] text-gray-600'}`}
                                >
                                    Comprar
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

