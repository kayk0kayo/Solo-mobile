import React, { useState } from 'react';
import { useGame } from '../GameContext';
import { Item, Skill } from '../types';

export const Inventory = () => {
    const { state, dispatch } = useGame();
    const [subTab, setSubTab] = useState<'weapons' | 'armors' | 'accessories' | 'consumables' | 'passives'>('weapons');

    const handleEquipWeapon = (item: Item) => dispatch({ type: 'EQUIP_WEAPON', item });
    const handleEquipArmor = (item: Item) => dispatch({ type: 'EQUIP_ARMOR', item });
    const handleEquipAcc = (item: Item) => dispatch({ type: 'EQUIP_ACCESSORY', item });
    const handleUseConsumable = (itemId: string) => dispatch({ type: 'USE_CONSUMABLE', itemId });

    const handleEquipPassive = (skill: Skill) => {
        // Find empty slot or swap first
        const emptySlot = state.equipped.passives.findIndex(p => p === null);
        if (emptySlot !== -1) {
            dispatch({ type: 'EQUIP_PASSIVE', skill, slot: emptySlot });
        } else {
            dispatch({ type: 'EQUIP_PASSIVE', skill, slot: 0 }); // Override first slot if full
        }
    }

    const handleUnequipPassive = (slotIndex: number) => {
        // We reuse EQUIP_PASSIVE but pass null. Oh wait, we need a small action or pass undefined? 
        // My engine types expects Skill. Let's cast null.
        dispatch({ type: 'EQUIP_PASSIVE', skill: null as any, slot: slotIndex });
    }

    const unequipBtn = (action: () => void) => (
        <button onClick={action} className="text-[10px] uppercase font-bold bg-red-900 border border-red-500 text-white px-2 py-1 mt-2 w-full hover:bg-red-700">Desequipar</button>
    )

    return (
        <div className="h-full flex flex-col sm:flex-row gap-4 max-w-5xl mx-auto w-full">
            
            {/* Left Box: Equipment Banner */}
            <div className="w-full sm:w-[35%] flex flex-col gap-2 shrink-0 h-full overflow-y-auto custom-scrollbar">
                <div className="bg-[#1a1a24] p-3 border-4 border-[#3b3b46] flex flex-col gap-3">
                    <h2 className="text-sm font-bold uppercase text-gray-300 border-b-2 border-[#2b2b36] pb-1 text-center tracking-wider">Equipado</h2>
                    
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col items-center bg-[#0a0a0f] p-2 border-2 border-[#2b2b36]">
                            <span className="text-[10px] text-gray-500 font-bold uppercase mb-1">Arma</span>
                            <div className="text-xs text-white text-center break-words w-full">
                                {state.equipped.weapon ? state.equipped.weapon.name : 'Vazio'}
                                {state.equipped.weapon && <div className="text-[10px] text-red-500 mt-1">Dano: +{state.equipped.weapon.stats?.damage}</div>}
                            </div>
                        </div>
                        <div className="flex flex-col items-center bg-[#0a0a0f] p-2 border-2 border-[#2b2b36]">
                            <span className="text-[10px] text-gray-500 font-bold uppercase mb-1">Armadura</span>
                            <div className="text-xs text-white text-center break-words w-full">
                                {state.equipped.armor ? state.equipped.armor.name : 'Vazio'}
                                {state.equipped.armor && <div className="text-[10px] text-blue-500 mt-1">Defesa: +{state.equipped.armor.stats?.defense}</div>}
                            </div>
                        </div>
                        <div className="flex flex-col items-center bg-[#0a0a0f] p-2 border-2 border-[#2b2b36]">
                            <span className="text-[10px] text-gray-500 font-bold uppercase mb-1">Acessório</span>
                            <div className="text-xs text-white text-center break-words w-full">
                                {state.equipped.accessory ? state.equipped.accessory.name : 'Vazio'}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center mt-2">
                        <span className="text-[10px] text-green-500 font-bold uppercase mb-2 border-b border-green-900 w-full text-center pb-1">Passivas Equipadas</span>
                        <div className="flex flex-col w-full gap-2 mt-1">
                            {[0,1,2].map(slot => (
                                <button 
                                    key={slot}
                                    onClick={() => state.equipped.passives[slot] ? handleUnequipPassive(slot) : null}
                                    className={`w-full h-10 text-[10px] md:text-xs flex items-center justify-center p-1 border-2 text-center break-words leading-tight transition-colors
                                    ${state.equipped.passives[slot] ? 'border-purple-600 bg-purple-900/30 text-purple-200 hover:bg-red-900/50' : 'border-[#2b2b36] bg-[#0a0a0f] text-gray-600'}`}>
                                    {state.equipped.passives[slot] ? state.equipped.passives[slot]!.name : 'Livre'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Box: Inventory Tabs & List */}
            <div className="flex-1 flex flex-col bg-[#1a1a24] border-4 border-[#3b3b46] h-full overflow-hidden">
                <div className="flex overflow-x-auto custom-scrollbar shrink-0 border-b-4 border-[#3b3b46] bg-[#0a0a0f]">
                    {[
                        {id: 'weapons', label: 'Armas'}, 
                        {id: 'armors', label: 'Armaduras'}, 
                        {id: 'accessories', label: 'Acessórios'},
                        {id: 'consumables', label: 'Mochila'},
                        {id: 'passives', label: 'Passivas'}
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setSubTab(tab.id as any)}
                            className={`p-3 text-[10px] md:text-xs font-bold uppercase border-r-2 border-[#2b2b36] last:border-r-0 whitespace-nowrap flex-1 transition-colors
                                      ${subTab === tab.id ? 'bg-[#2b2b36] text-white shadow-[inset_0_-3px_0_#8b5cf6]' : 'text-gray-500 hover:text-gray-300 hover:bg-[#1a1a24]'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* List */}
                <div className="flex-grow overflow-y-auto custom-scrollbar p-2 space-y-2">
                {subTab === 'weapons' && state.inventory.weapons.length === 0 && <span className="text-gray-500 text-sm">Nenhuma arma.</span>}
                {subTab === 'weapons' && state.inventory.weapons.map(w => (
                    <div key={w.id} className="bg-[#1a1a24] p-3 border-2 border-[#2b2b36] flex justify-between items-center group hover:border-[#4b4b56]">
                        <div>
                            <div className="font-bold text-gray-200">[{w.rank}] {w.name}</div>
                            <div className="text-xs text-red-400">Dano: +{w.stats?.damage}</div>
                        </div>
                        {state.equipped.weapon?.id === w.id 
                            ? <span className="text-xs font-bold text-gray-500 border border-gray-600 px-3 py-2 uppercase bg-[#0a0a0f]">Equipado</span>
                            : <button onClick={() => handleEquipWeapon(w)} className="text-xs font-bold text-white border-2 border-green-700 bg-green-900 px-3 py-2 uppercase active:scale-95 group-hover:bg-green-700">Equipar</button>
                        }
                    </div>
                ))}

                {subTab === 'armors' && state.inventory.armors.length === 0 && <span className="text-gray-500 text-sm">Nenhuma armadura.</span>}
                {subTab === 'armors' && state.inventory.armors.map(w => (
                    <div key={w.id} className="bg-[#1a1a24] p-3 border-2 border-[#2b2b36] flex justify-between items-center group hover:border-[#4b4b56]">
                        <div>
                            <div className="font-bold text-gray-200">[{w.rank}] {w.name}</div>
                            <div className="text-xs text-blue-400">Defesa: +{w.stats?.defense}</div>
                        </div>
                         {state.equipped.armor?.id === w.id 
                            ? <span className="text-xs font-bold text-gray-500 border border-gray-600 px-3 py-2 uppercase bg-[#0a0a0f]">Equipado</span>
                            : <button onClick={() => handleEquipArmor(w)} className="text-xs font-bold text-white border-2 border-green-700 bg-green-900 px-3 py-2 uppercase active:scale-95 group-hover:bg-green-700">Equipar</button>
                        }
                    </div>
                ))}

                {subTab === 'accessories' && state.inventory.accessories.length === 0 && <span className="text-gray-500 text-sm">Nenhum acessório.</span>}
                {subTab === 'accessories' && state.inventory.accessories.map(w => (
                    <div key={w.id} className="bg-[#1a1a24] p-3 border-2 border-[#2b2b36] flex justify-between items-center group hover:border-[#4b4b56]">
                        <div className="max-w-[70%]">
                            <div className="font-bold text-gray-200">[{w.rank}] {w.name}</div>
                            <div className="text-[10px] text-gray-400 leading-tight">{w.description}</div>
                        </div>
                         {state.equipped.accessory?.id === w.id 
                            ? <span className="text-xs font-bold text-gray-500 border border-gray-600 px-3 py-2 uppercase bg-[#0a0a0f]">Equipado</span>
                            : <button onClick={() => handleEquipAcc(w)} className="text-xs font-bold text-white border-2 border-green-700 bg-green-900 px-3 py-2 uppercase active:scale-95 group-hover:bg-green-700">Equipar</button>
                        }
                    </div>
                ))}

                {subTab === 'consumables' && state.inventory.consumables.length === 0 && <span className="text-gray-500 text-sm">Nenhum consumível.</span>}
                {subTab === 'consumables' && state.inventory.consumables.map(c => (
                     <div key={c.item.id} className="bg-[#1a1a24] p-3 border-2 border-[#2b2b36] flex justify-between items-center group hover:border-[#4b4b56]">
                        <div className="max-w-[70%]">
                            <div className="font-bold text-gray-200">[{c.item.rank}] {c.item.name} <span className="text-yellow-500">x{c.count}</span></div>
                            <div className="text-[10px] text-gray-400 leading-tight">{c.item.description}</div>
                        </div>
                        <button onClick={() => handleUseConsumable(c.item.id)} className="text-xs font-bold text-white border-2 border-blue-700 bg-blue-900 px-3 py-2 uppercase active:scale-95 group-hover:bg-blue-700">Usar</button>
                    </div>
                ))}

                {subTab === 'passives' && state.inventory.skills.length === 0 && <span className="text-gray-500 text-sm">Nenhuma habilidade passiva. Compre na Loja!</span>}
                {subTab === 'passives' && state.inventory.skills.map(s => {
                    const isEquipped = state.equipped.passives.find(p => p?.id === s.id);
                    return (
                     <div key={s.id} className="bg-[#1a1a24] p-3 border-2 border-purple-900/50 flex justify-between items-center group hover:border-purple-600">
                        <div className="max-w-[70%]">
                            <div className="font-bold text-purple-200">[{s.rank}] {s.name}</div>
                            <div className="text-[10px] text-gray-400 leading-tight">{s.description}</div>
                        </div>
                        {isEquipped 
                            ? <span className="text-[10px] font-bold text-purple-400 border border-purple-900 px-2 py-1 uppercase bg-[#0a0a0f]">Ativo</span>
                            : <button onClick={() => handleEquipPassive(s)} className="text-[10px] font-bold text-white border-2 border-purple-700 bg-purple-900 px-2 py-1 uppercase active:scale-95 hover:bg-purple-600">Alocar</button>
                        }
                    </div>
                    )
                })}
            </div>
        </div>
        </div>
    )
}
