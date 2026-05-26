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
        <div className="h-full flex flex-col sm:flex-row gap-4 max-w-5xl mx-auto w-full font-mono">
            
            {/* Left Box: Wallet and Info */}
            <div className="flex-none sm:w-[35%] bg-[#111] border-4 border-white p-4 pixel-box flex flex-col gap-4 shrink-0 overflow-y-auto custom-scrollbar">
                <h2 className="text-sm font-bold uppercase text-white border-b-4 border-white pb-2 text-center tracking-wider shrink-0 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">Bolsa do Jogador</h2>
                
                <div className="flex flex-col gap-3">
                    <div className="bg-[#222] border-4 border-gray-600 p-3 text-center relative overflow-hidden group pixel-box">
                        <div className="text-[10px] text-gray-400 font-bold uppercase mb-1 tracking-widest">Ouro</div>
                        <div className="text-xl font-black text-yellow-500 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">{state.gold}</div>
                    </div>
                    <div className="bg-[#222] border-4 border-gray-600 p-3 text-center relative overflow-hidden group pixel-box">
                        <div className="text-[10px] text-gray-400 font-bold uppercase mb-1 tracking-widest">Cristais de Mana</div>
                        <div className="text-xl font-black text-blue-400 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">{state.manaCrystals}</div>
                    </div>
                </div>
                
                <div className="mt-auto pt-4 border-t-4 border-gray-600">
                     <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest leading-relaxed">A Loja do Sistema oferece itens em troca de recursos adquiridos em combate.</p>
                </div>
            </div>

            {/* Right Box: Catalog */}
            <div className="flex-1 flex flex-col bg-[#111] border-4 border-[#fff] h-full overflow-hidden pixel-box">
                <div className="flex overflow-x-auto custom-scrollbar shrink-0 border-b-4 border-white bg-black">
                    {[
                        {id: 'weapons', label: 'Armas'}, 
                        {id: 'armors', label: 'Armadura'}, 
                        {id: 'accessories', label: 'Acessórios'},
                        {id: 'consumables', label: 'Poções'},
                        {id: 'passives', label: 'Passivas'}
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setSubTab(tab.id as any)}
                            className={`p-3 text-[10px] md:text-xs font-bold uppercase border-r-4 border-white last:border-r-0 flex-1 transition-none
                                      ${subTab === tab.id ? 'bg-[#333] text-white shadow-none' : 'text-gray-400 hover:text-white hover:bg-[#222]'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex-grow overflow-y-auto custom-scrollbar p-2 space-y-2 font-sans">
                    {subTab !== 'passives' && availableItems.filter(item => {
                        if (subTab === 'weapons') return item.type === 'weapon';
                        if (subTab === 'armors') return item.type === 'armor';
                        if (subTab === 'accessories') return item.type === 'accessory';
                        if (subTab === 'consumables') return item.type === 'consumable';
                        return false;
                    }).map(item => {
                        const canAfford = state.gold >= item.cost.gold && state.manaCrystals >= item.cost.crystals;
                        return (
                            <div key={item.id} className={`bg-[#222] p-3 border-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-none pixel-box
                                ${canAfford ? 'border-gray-600 hover:border-white' : 'border-[#333] opacity-70'}`}>
                                <div>
                                    <div className="font-bold text-white text-xs uppercase tracking-wide">[{item.rank}] {item.name}</div>
                                    <div className="text-[10px] sm:text-xs text-gray-400 mt-1 leading-tight">{item.description}</div>
                                    <div className="mt-2">{renderCost(item.cost)}</div>
                                </div>
                                <button 
                                    onClick={() => handleBuyItem(item)}
                                    disabled={!canAfford}
                                    className={`px-4 py-2 text-[10px] font-bold uppercase border-2 flex-shrink-0 active:translate-y-1 transition-none outline-none w-full sm:w-auto
                                    ${canAfford ? 'border-white bg-black text-white hover:bg-white hover:text-black' : 'border-gray-700 bg-black text-gray-600'}`}
                                >
                                    <span className="block">Comprar</span>
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
                        <div className="text-gray-500 text-sm p-4 text-center uppercase tracking-widest">Nenhum item disponível nesta categoria.</div>
                    )}

                    {subTab === 'passives' && availableSkills.map(s => {
                        const canAfford = state.gold >= s.cost.gold && state.manaCrystals >= s.cost.crystals;
                        return (
                            <div key={s.skill.id} className={`bg-[#222] p-3 border-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-none pixel-box
                                ${canAfford ? 'border-purple-900 hover:border-purple-500' : 'border-[#333] opacity-70'}`}>
                                <div>
                                    <div className="font-bold text-purple-400 text-xs uppercase tracking-wide">[{s.skill.rank}] {s.skill.name}</div>
                                    <div className="text-[10px] sm:text-xs text-gray-400 mt-1 leading-tight">{s.skill.description}</div>
                                    <div className="mt-2">{renderCost(s.cost)}</div>
                                </div>
                                <button 
                                    onClick={() => handleBuySkill(s)}
                                    disabled={!canAfford}
                                    className={`px-4 py-2 text-[10px] font-bold uppercase border-2 flex-shrink-0 active:translate-y-1 transition-none outline-none w-full sm:w-auto
                                    ${canAfford ? 'border-purple-700 bg-black text-purple-400 hover:bg-purple-500 hover:text-white' : 'border-gray-700 bg-black text-gray-600'}`}
                                >
                                    <span className="block">Comprar</span>
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

