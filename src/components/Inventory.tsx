import React, { useState } from 'react';
import { useGame } from '../GameContext';
import { Item, Skill } from '../types';
import { getIcon } from '../lib/itemIcons';
import { PixelImage } from './PixelImage';

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
        <div className="h-full flex flex-col sm:flex-row gap-4 max-w-5xl mx-auto w-full font-mono">
            
            {/* Left Box: Equipment Banner */}
            <div className="w-full sm:w-[35%] flex flex-col gap-2 shrink-0 h-full overflow-y-auto custom-scrollbar">
                <div className="bg-[#111] border-4 border-white p-3 pixel-box flex flex-col gap-3">
                    <h2 className="text-sm font-bold uppercase text-white border-b-4 border-white pb-1 justify-center tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 bg-white inline-block"></span>
                        Equipamento
                    </h2>
                    
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col items-center bg-[#222] p-2 border-4 border-gray-600 relative overflow-hidden group pixel-box">
                            <span className="text-[10px] text-gray-400 font-bold uppercase mb-1 tracking-widest">Arma</span>
                            <div className="flex flex-col items-center gap-2 w-full">
                                <div className="w-16 h-16 shrink-0 border-2 border-gray-600 bg-black flex items-center justify-center pixel-box overflow-hidden">
                                    <PixelImage
                                        src={state.equipped.weapon ? getIcon(state.equipped.weapon.id, 'weapon') : ''}
                                        alt={state.equipped.weapon ? state.equipped.weapon.name : 'Vazio'}
                                        itemType="weapon"
                                        rank={state.equipped.weapon ? state.equipped.weapon.rank : 'E'}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="text-xs text-white text-center break-words w-full font-bold flex flex-col items-center">
                                    {state.equipped.weapon ? state.equipped.weapon.name : 'VAZIO'}
                                    {state.equipped.weapon && <div className="text-[10px] text-red-500 mt-1">Dano: +{state.equipped.weapon.stats?.damage}</div>}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center bg-[#222] p-2 border-4 border-gray-600 relative overflow-hidden group pixel-box">
                            <span className="text-[10px] text-gray-400 font-bold uppercase mb-1 tracking-widest">Armadura</span>
                            <div className="flex flex-col items-center gap-2 w-full">
                                <div className="w-16 h-16 shrink-0 border-2 border-gray-600 bg-black flex items-center justify-center pixel-box overflow-hidden">
                                    <PixelImage
                                        src={state.equipped.armor ? getIcon(state.equipped.armor.id, 'armor') : ''}
                                        alt={state.equipped.armor ? state.equipped.armor.name : 'Vazio'}
                                        itemType="armor"
                                        rank={state.equipped.armor ? state.equipped.armor.rank : 'E'}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="text-xs text-white text-center break-words w-full font-bold flex flex-col items-center">
                                    {state.equipped.armor ? state.equipped.armor.name : 'VAZIO'}
                                    {state.equipped.armor && <div className="text-[10px] text-blue-400 mt-1">Defesa: +{state.equipped.armor.stats?.defense}</div>}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center bg-[#222] p-2 border-4 border-gray-600 relative overflow-hidden group group-hover:border-white group-active:translate-y-1 pixel-box">
                            <span className="text-[10px] text-gray-400 font-bold uppercase mb-1 tracking-widest">Acessório</span>
                            <div className="flex flex-col items-center gap-2 w-full">
                                <div className="w-16 h-16 shrink-0 border-2 border-gray-600 bg-black flex items-center justify-center pixel-box overflow-hidden">
                                    <PixelImage
                                        src={state.equipped.accessory ? getIcon(state.equipped.accessory.id, 'accessory') : ''}
                                        alt={state.equipped.accessory ? state.equipped.accessory.name : 'Vazio'}
                                        itemType="accessory"
                                        rank={state.equipped.accessory ? state.equipped.accessory.rank : 'E'}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="text-xs text-white text-center break-words w-full font-bold flex flex-col items-center">
                                    {state.equipped.accessory ? state.equipped.accessory.name : 'VAZIO'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center mt-2">
                        <span className="text-[10px] text-purple-400 font-bold uppercase mb-2 border-b-4 border-purple-900 w-full text-center pb-1 tracking-widest">Passivas Ativas</span>
                        <div className="flex flex-col w-full gap-2 mt-1">
                            {[0,1,2].map(slot => (
                                <button 
                                    key={slot}
                                    onClick={() => state.equipped.passives[slot] ? handleUnequipPassive(slot) : null}
                                    className={`w-full h-10 text-[10px] md:text-xs flex items-center justify-center p-1 border-4 font-bold text-center break-words overflow-hidden relative group transition-none pixel-box
                                    ${state.equipped.passives[slot] ? 'border-purple-500 bg-purple-900 text-white hover:border-red-500 hover:text-red-400 hover:bg-[#222]' : 'border-gray-600 bg-[#222] text-gray-500'}`}>
                                    <span>{state.equipped.passives[slot] ? state.equipped.passives[slot]!.name : 'LIVRE'}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Box: Inventory Tabs & List */}
            <div className="flex-1 flex flex-col bg-[#111] border-4 border-[#fff] h-full overflow-hidden pixel-box">
                <div className="flex overflow-x-auto custom-scrollbar shrink-0 border-b-4 border-white bg-black">
                    {[
                        {id: 'weapons', label: 'Armas'}, 
                        {id: 'armors', label: 'Armadura'}, 
                        {id: 'accessories', label: 'Acessórios'},
                        {id: 'consumables', label: 'Mochila'},
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

                {/* List */}
                <div className="flex-grow overflow-y-auto custom-scrollbar p-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-sans content-start">
                {subTab === 'weapons' && state.inventory.weapons.length === 0 && <span className="text-gray-500 text-sm block text-center col-span-full mt-4 tracking-widest uppercase">Nenhuma arma</span>}
                {subTab === 'weapons' && state.inventory.weapons.map(w => (
                    <div key={w.id} className="bg-[#222] p-3 border-4 border-gray-600 flex flex-col justify-between items-center group hover:border-white transition-none pixel-box relative h-full">
                        <div className="flex flex-col items-center gap-2 mb-3 text-center">
                            <div className="w-24 h-24 border-2 border-gray-600 bg-black flex items-center justify-center pixel-box overflow-hidden mb-1">
                                <PixelImage
                                    src={getIcon(w.id, 'weapon')}
                                    alt={w.name}
                                    itemType="weapon"
                                    rank={w.rank}
                                    zoomOnHover={true}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <div className="font-bold text-white uppercase tracking-wide">[{w.rank}] {w.name}</div>
                                <div className="text-xs text-red-500 font-bold mt-1 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">Dano: +{w.stats?.damage}</div>
                            </div>
                        </div>
                        {state.equipped.weapon?.id === w.id 
                            ? <span className="text-[10px] w-full text-center font-bold text-gray-400 border-2 border-gray-600 px-3 py-2 uppercase tracking-widest"><span>Equipado</span></span>
                            : <button onClick={() => handleEquipWeapon(w)} className="text-[10px] w-full font-bold text-white border-2 border-white bg-black hover:bg-white hover:text-black px-4 py-2 uppercase transition-none"><span>Equipar</span></button>
                        }
                    </div>
                ))}

                {subTab === 'armors' && state.inventory.armors.length === 0 && <span className="text-gray-500 text-sm block text-center col-span-full mt-4 tracking-widest uppercase">Nenhuma armadura</span>}
                {subTab === 'armors' && state.inventory.armors.map(w => (
                    <div key={w.id} className="bg-[#222] p-3 border-4 border-gray-600 flex flex-col justify-between items-center group hover:border-white transition-none pixel-box relative h-full">
                        <div className="flex flex-col items-center gap-2 mb-3 text-center">
                            <div className="w-24 h-24 border-2 border-gray-600 bg-black flex items-center justify-center pixel-box overflow-hidden mb-1">
                                <PixelImage
                                    src={getIcon(w.id, 'armor')}
                                    alt={w.name}
                                    itemType="armor"
                                    rank={w.rank}
                                    zoomOnHover={true}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <div className="font-bold text-white uppercase tracking-wide">[{w.rank}] {w.name}</div>
                                <div className="text-xs text-blue-400 font-bold mt-1 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">Defesa: +{w.stats?.defense}</div>
                            </div>
                        </div>
                         {state.equipped.armor?.id === w.id 
                            ? <span className="text-[10px] w-full text-center font-bold text-gray-400 border-2 border-gray-600 px-3 py-2 uppercase tracking-widest"><span>Equipado</span></span>
                            : <button onClick={() => handleEquipArmor(w)} className="text-[10px] w-full font-bold text-white border-2 border-white bg-black hover:bg-white hover:text-black px-4 py-2 uppercase transition-none"><span>Equipar</span></button>
                        }
                    </div>
                ))}

                {subTab === 'accessories' && state.inventory.accessories.length === 0 && <span className="text-gray-500 text-sm block text-center col-span-full mt-4 tracking-widest uppercase">Nenhum acessório</span>}
                {subTab === 'accessories' && state.inventory.accessories.map(w => (
                    <div key={w.id} className="bg-[#222] p-3 border-4 border-gray-600 flex flex-col justify-between items-center group hover:border-white transition-none pixel-box relative h-full">
                        <div className="flex flex-col items-center gap-2 mb-3 text-center">
                            <div className="w-24 h-24 shrink-0 border-2 border-gray-600 bg-black flex items-center justify-center pixel-box overflow-hidden mb-1">
                                <PixelImage
                                    src={getIcon(w.id, 'accessory')}
                                    alt={w.name}
                                    itemType="accessory"
                                    rank={w.rank}
                                    zoomOnHover={true}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <div className="font-bold text-white uppercase tracking-wide">[{w.rank}] {w.name}</div>
                                <div className="text-[10px] text-gray-400 leading-tight mt-1 px-1">{w.description}</div>
                            </div>
                        </div>
                         {state.equipped.accessory?.id === w.id 
                            ? <span className="text-[10px] w-full text-center font-bold text-gray-400 border-2 border-gray-600 px-3 py-2 uppercase tracking-widest"><span>Equipado</span></span>
                            : <button onClick={() => handleEquipAcc(w)} className="text-[10px] w-full font-bold text-white border-2 border-white bg-black hover:bg-white hover:text-black px-4 py-2 uppercase transition-none"><span>Equipar</span></button>
                        }
                    </div>
                ))}

                {subTab === 'consumables' && state.inventory.consumables.length === 0 && <span className="text-gray-500 text-sm block text-center col-span-full mt-4 tracking-widest uppercase">Nenhum consumível</span>}
                {subTab === 'consumables' && state.inventory.consumables.map(c => (
                     <div key={c.item.id} className="bg-[#222] p-3 border-4 border-gray-600 flex flex-col justify-between items-center group hover:border-white transition-none pixel-box relative h-full">
                        <div className="flex flex-col items-center gap-2 mb-3 text-center">
                            <div className="w-24 h-24 shrink-0 border-2 border-gray-600 bg-black flex items-center justify-center pixel-box overflow-hidden relative mb-1">
                                <PixelImage
                                    src={getIcon(c.item.id, 'consumable')}
                                    alt={c.item.name}
                                    itemType="consumable"
                                    rank={c.item.rank}
                                    zoomOnHover={true}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-1 right-1 bg-black border border-yellow-500 text-xs text-yellow-500 px-1.5 py-0.5 font-bold z-10 leading-none">x{c.count}</div>
                            </div>
                            <div>
                                <div className="font-bold text-white uppercase tracking-wide">[{c.item.rank}] {c.item.name}</div>
                                <div className="text-[10px] text-gray-400 leading-tight mt-1 px-1">{c.item.description}</div>
                            </div>
                        </div>
                        <button onClick={() => handleUseConsumable(c.item.id)} className="text-[10px] w-full font-bold text-yellow-500 border-2 border-yellow-500 bg-black hover:bg-yellow-500 hover:text-black px-4 py-2 uppercase transition-none"><span>Usar</span></button>
                    </div>
                ))}

                {subTab === 'passives' && state.inventory.skills.length === 0 && <span className="text-gray-500 text-sm block text-center col-span-full mt-4 tracking-widest uppercase">Nenhuma passiva</span>}
                {subTab === 'passives' && state.inventory.skills.map(s => {
                    const isEquipped = state.equipped.passives.find(p => p?.id === s.id);
                    return (
                     <div key={s.id} className="bg-[#222] p-3 border-4 border-purple-900 flex flex-col justify-between items-center group hover:border-purple-500 transition-none pixel-box h-full">
                        <div className="flex flex-col items-center gap-2 mb-3 text-center w-full">
                            <div className="w-20 h-20 shrink-0 border-2 border-purple-900 bg-black flex items-center justify-center pixel-box overflow-hidden mb-1">
                                <PixelImage
                                    src={getIcon(s.id, 'consumable')}
                                    alt={s.name}
                                    itemType="consumable"
                                    rank={s.rank}
                                    zoomOnHover={true}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <div className="font-bold text-purple-400 uppercase tracking-wide">[{s.rank}] {s.name}</div>
                                <div className="text-[10px] text-gray-400 leading-tight mt-1 px-1">{s.description}</div>
                            </div>
                        </div>
                        {isEquipped 
                            ? <span className="text-[10px] w-full text-center font-bold text-purple-700 border-2 border-purple-900 px-3 py-2 uppercase tracking-widest"><span>Ativo</span></span>
                            : <button onClick={() => handleEquipPassive(s)} className="text-[10px] w-full font-bold text-purple-400 border-2 border-purple-700 bg-black hover:bg-purple-500 hover:text-white px-4 py-2 uppercase transition-none"><span>Alocar</span></button>
                        }
                    </div>
                    )
                })}
            </div>
        </div>
        </div>
    )
}
