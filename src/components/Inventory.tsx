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
                <div className="bg-[#020d1a]/80 backdrop-blur-md border border-[#004080] p-3 shadow-[0_0_15px_rgba(0,20,40,0.5)] flex flex-col gap-3">
                    <h2 className="text-sm font-bold uppercase text-[#03dbfc] border-b border-[#004080] pb-1 text-center tracking-wider drop-shadow-[0_0_5px_rgba(3,219,252,0.5)]">Equipamento</h2>
                    
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col items-center bg-[#001732]/50 p-2 border border-[#004080]/50 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#03dbfc] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span className="text-[10px] text-[#03dbfc]/70 font-bold uppercase mb-1 tracking-widest">Arma</span>
                            <div className="text-xs text-white text-center break-words w-full font-bold">
                                {state.equipped.weapon ? state.equipped.weapon.name : 'VAZIO'}
                                {state.equipped.weapon && <div className="text-[10px] text-red-400 mt-1 drop-shadow-[0_0_2px_rgba(248,113,113,0.8)]">Dano: +{state.equipped.weapon.stats?.damage}</div>}
                            </div>
                        </div>
                        <div className="flex flex-col items-center bg-[#001732]/50 p-2 border border-[#004080]/50 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span className="text-[10px] text-[#03dbfc]/70 font-bold uppercase mb-1 tracking-widest">Armadura</span>
                            <div className="text-xs text-white text-center break-words w-full font-bold">
                                {state.equipped.armor ? state.equipped.armor.name : 'VAZIO'}
                                {state.equipped.armor && <div className="text-[10px] text-blue-400 mt-1 drop-shadow-[0_0_2px_rgba(96,165,250,0.8)]">Defesa: +{state.equipped.armor.stats?.defense}</div>}
                            </div>
                        </div>
                        <div className="flex flex-col items-center bg-[#001732]/50 p-2 border border-[#004080]/50 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span className="text-[10px] text-[#03dbfc]/70 font-bold uppercase mb-1 tracking-widest">Acessório</span>
                            <div className="text-xs text-white text-center break-words w-full font-bold">
                                {state.equipped.accessory ? state.equipped.accessory.name : 'VAZIO'}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center mt-2">
                        <span className="text-[10px] text-purple-400 font-bold uppercase mb-2 border-b border-purple-900/50 w-full text-center pb-1 tracking-widest">Passivas Ativas</span>
                        <div className="flex flex-col w-full gap-2 mt-1">
                            {[0,1,2].map(slot => (
                                <button 
                                    key={slot}
                                    onClick={() => state.equipped.passives[slot] ? handleUnequipPassive(slot) : null}
                                    className={`w-full h-10 text-[10px] md:text-xs flex items-center justify-center p-1 border font-bold text-center break-words overflow-hidden relative group transition-all skew-x-[-6deg]
                                    ${state.equipped.passives[slot] ? 'border-purple-500/50 bg-gradient-to-r from-purple-900/20 to-purple-900/40 text-purple-200 hover:border-red-500/50 hover:text-red-400' : 'border-[#004080]/50 bg-[#001732]/30 text-blue-300/30'}`}>
                                    <span className="transform skew-x-[6deg]">{state.equipped.passives[slot] ? state.equipped.passives[slot]!.name : 'LIVRE'}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Box: Inventory Tabs & List */}
            <div className="flex-1 flex flex-col bg-[#020d1a]/80 backdrop-blur-md border border-[#004080] h-full overflow-hidden shadow-[0_0_15px_rgba(0,20,40,0.5)]">
                <div className="flex overflow-x-auto custom-scrollbar shrink-0 border-b border-[#004080] bg-[#001732]/80">
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
                            className={`p-3 text-[10px] md:text-xs font-bold uppercase border-r border-[#004080] last:border-r-0 whitespace-nowrap flex-1 transition-all
                                      ${subTab === tab.id ? 'bg-[#03dbfc]/10 text-[#03dbfc] shadow-[inset_0_-2px_0_#03dbfc]' : 'text-blue-300/50 hover:text-blue-200 hover:bg-[#001c3d]'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* List */}
                <div className="flex-grow overflow-y-auto custom-scrollbar p-2 space-y-2">
                {subTab === 'weapons' && state.inventory.weapons.length === 0 && <span className="text-blue-300/50 text-sm block text-center mt-4 tracking-widest uppercase">Nenhuma arma</span>}
                {subTab === 'weapons' && state.inventory.weapons.map(w => (
                    <div key={w.id} className="bg-[#001732]/50 p-3 border border-[#004080]/50 flex justify-between items-center group hover:border-[#03dbfc]/50 transition-colors">
                        <div>
                            <div className="font-bold text-[#c9e0ff] uppercase tracking-wide">[{w.rank}] {w.name}</div>
                            <div className="text-xs text-red-400 font-bold drop-shadow-[0_0_2px_rgba(248,113,113,0.5)]">Dano: +{w.stats?.damage}</div>
                        </div>
                        {state.equipped.weapon?.id === w.id 
                            ? <span className="text-[10px] font-bold text-blue-300/50 border border-blue-500/30 px-3 py-1 uppercase tracking-widest skew-x-[-12deg]"><span className="block skew-x-[12deg]">Equipado</span></span>
                            : <button onClick={() => handleEquipWeapon(w)} className="text-[10px] font-bold text-[#03dbfc] border border-[#03dbfc]/50 bg-[#001c3d] hover:bg-[#03dbfc] hover:text-[#010915] px-4 py-2 uppercase active:scale-95 transition-all skew-x-[-12deg]"><span className="block skew-x-[12deg]">Equipar</span></button>
                        }
                    </div>
                ))}

                {subTab === 'armors' && state.inventory.armors.length === 0 && <span className="text-blue-300/50 text-sm block text-center mt-4 tracking-widest uppercase">Nenhuma armadura</span>}
                {subTab === 'armors' && state.inventory.armors.map(w => (
                    <div key={w.id} className="bg-[#001732]/50 p-3 border border-[#004080]/50 flex justify-between items-center group hover:border-[#03dbfc]/50 transition-colors">
                        <div>
                            <div className="font-bold text-[#c9e0ff] uppercase tracking-wide">[{w.rank}] {w.name}</div>
                            <div className="text-xs text-blue-400 font-bold drop-shadow-[0_0_2px_rgba(96,165,250,0.5)]">Defesa: +{w.stats?.defense}</div>
                        </div>
                         {state.equipped.armor?.id === w.id 
                            ? <span className="text-[10px] font-bold text-blue-300/50 border border-blue-500/30 px-3 py-1 uppercase tracking-widest skew-x-[-12deg]"><span className="block skew-x-[12deg]">Equipado</span></span>
                            : <button onClick={() => handleEquipArmor(w)} className="text-[10px] font-bold text-[#03dbfc] border border-[#03dbfc]/50 bg-[#001c3d] hover:bg-[#03dbfc] hover:text-[#010915] px-4 py-2 uppercase active:scale-95 transition-all skew-x-[-12deg]"><span className="block skew-x-[12deg]">Equipar</span></button>
                        }
                    </div>
                ))}

                {subTab === 'accessories' && state.inventory.accessories.length === 0 && <span className="text-blue-300/50 text-sm block text-center mt-4 tracking-widest uppercase">Nenhum acessório</span>}
                {subTab === 'accessories' && state.inventory.accessories.map(w => (
                    <div key={w.id} className="bg-[#001732]/50 p-3 border border-[#004080]/50 flex justify-between items-center group hover:border-[#03dbfc]/50 transition-colors">
                        <div className="max-w-[70%]">
                            <div className="font-bold text-[#c9e0ff] uppercase tracking-wide">[{w.rank}] {w.name}</div>
                            <div className="text-[10px] text-blue-200/70 leading-tight mt-1">{w.description}</div>
                        </div>
                         {state.equipped.accessory?.id === w.id 
                            ? <span className="text-[10px] font-bold text-blue-300/50 border border-blue-500/30 px-3 py-1 uppercase tracking-widest skew-x-[-12deg]"><span className="block skew-x-[12deg]">Equipado</span></span>
                            : <button onClick={() => handleEquipAcc(w)} className="text-[10px] font-bold text-[#03dbfc] border border-[#03dbfc]/50 bg-[#001c3d] hover:bg-[#03dbfc] hover:text-[#010915] px-4 py-2 uppercase active:scale-95 transition-all skew-x-[-12deg]"><span className="block skew-x-[12deg]">Equipar</span></button>
                        }
                    </div>
                ))}

                {subTab === 'consumables' && state.inventory.consumables.length === 0 && <span className="text-blue-300/50 text-sm block text-center mt-4 tracking-widest uppercase">Nenhum consumível</span>}
                {subTab === 'consumables' && state.inventory.consumables.map(c => (
                     <div key={c.item.id} className="bg-[#001732]/50 p-3 border border-[#004080]/50 flex justify-between items-center group hover:border-[#03dbfc]/50 transition-colors">
                        <div className="max-w-[70%]">
                            <div className="font-bold text-[#c9e0ff] uppercase tracking-wide">[{c.item.rank}] {c.item.name} <span className="text-yellow-400 drop-shadow-[0_0_2px_rgba(250,204,21,0.8)]">x{c.count}</span></div>
                            <div className="text-[10px] text-blue-200/70 leading-tight mt-1">{c.item.description}</div>
                        </div>
                        <button onClick={() => handleUseConsumable(c.item.id)} className="text-[10px] font-bold text-yellow-500 border border-yellow-500/50 bg-yellow-900/20 hover:bg-yellow-500 hover:text-[#010915] px-4 py-2 uppercase active:scale-95 transition-all skew-x-[-12deg]"><span className="block skew-x-[12deg]">Usar</span></button>
                    </div>
                ))}

                {subTab === 'passives' && state.inventory.skills.length === 0 && <span className="text-blue-300/50 text-sm block text-center mt-4 tracking-widest uppercase">Nenhuma passiva</span>}
                {subTab === 'passives' && state.inventory.skills.map(s => {
                    const isEquipped = state.equipped.passives.find(p => p?.id === s.id);
                    return (
                     <div key={s.id} className="bg-[#001732]/50 p-3 border border-purple-500/30 flex justify-between items-center group hover:border-purple-400/80 transition-colors">
                        <div className="max-w-[70%]">
                            <div className="font-bold text-purple-300 uppercase tracking-wide">[{s.rank}] {s.name}</div>
                            <div className="text-[10px] text-purple-200/50 leading-tight mt-1">{s.description}</div>
                        </div>
                        {isEquipped 
                            ? <span className="text-[10px] font-bold text-purple-500/50 border border-purple-500/30 px-3 py-1 uppercase tracking-widest skew-x-[-12deg]"><span className="block skew-x-[12deg]">Ativo</span></span>
                            : <button onClick={() => handleEquipPassive(s)} className="text-[10px] font-bold text-purple-400 border border-purple-500/50 bg-purple-900/20 hover:bg-purple-500 hover:text-[#010915] px-4 py-2 uppercase active:scale-95 transition-all skew-x-[-12deg]"><span className="block skew-x-[12deg]">Alocar</span></button>
                        }
                    </div>
                    )
                })}
            </div>
        </div>
        </div>
    )
}
