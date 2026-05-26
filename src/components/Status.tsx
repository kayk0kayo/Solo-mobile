import React from 'react';
import { useGame } from '../GameContext';
import { levelsToNextRank } from '../lib/gameData';

export const Status = () => {
    const { state, dispatch, combatStats } = useGame();

    const xpPercent = Math.min(100, (state.xp / state.xpNeeded) * 100);
    const hpPercent = Math.max(0, Math.min(100, (state.currentHp / combatStats.maxHp) * 100));
    const mpPercent = Math.max(0, Math.min(100, (state.currentMana / combatStats.maxMana) * 100));
    const enPercent = Math.max(0, Math.min(100, (state.currentEnergy / combatStats.maxEnergy) * 100));

    const handleAddStat = (stat: keyof typeof state.attributes) => {
        dispatch({ type: 'ADD_STAT', stat });
    }

    return (
        <div className="h-full flex flex-col sm:flex-row gap-4 max-w-5xl mx-auto w-full font-mono">
            {/* Main Stats Panel */}
            <div className="flex-1 bg-[#111] border-4 border-[#fff] p-4 pixel-box flex flex-col gap-3 overflow-y-auto custom-scrollbar">
                <h2 className="text-xl font-bold uppercase text-white border-b-4 border-white pb-2 mb-2 tracking-wider shrink-0 flex items-center gap-2">
                    <span className="w-3 h-3 bg-white inline-block"></span>
                    Status do Jogador
                </h2>
                
                <div className="flex justify-between items-end mb-1 shrink-0">
                    <span className="text-gray-200 text-sm font-bold uppercase tracking-wider">Nível {state.level}</span>
                    <span className="text-gray-400 text-[10px] sm:text-xs uppercase">{levelsToNextRank(state.level)} Níveis Próx. Rank</span>
                </div>
                {/* Exp Bar */}
                <div className="h-6 bg-[#333] border-4 border-white w-full relative shrink-0 pixel-box">
                    <div className="h-full bg-blue-600" style={{ width: `${xpPercent}%` }}></div>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">EXP {Math.floor(state.xp)}/{state.xpNeeded}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-2 shrink-0">
                    <div>
                        <div className="text-[10px] sm:text-xs text-white font-bold uppercase tracking-wide mb-1">HP</div>
                        <div className="h-6 bg-[#333] border-4 border-white w-full relative pixel-box">
                            <div className="h-full bg-red-600" style={{ width: `${hpPercent}%` }}></div>
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">{Math.floor(state.currentHp)}/{combatStats.maxHp}</span>
                        </div>
                    </div>
                    <div>
                        <div className="text-[10px] sm:text-xs text-white font-bold uppercase tracking-wide mb-1">Mana</div>
                        <div className="h-6 bg-[#333] border-4 border-white w-full relative pixel-box">
                            <div className="h-full bg-blue-500" style={{ width: `${mpPercent}%` }}></div>
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">{Math.floor(state.currentMana)}/{combatStats.maxMana}</span>
                        </div>
                    </div>
                    <div className="col-span-2">
                        <div className="text-[10px] sm:text-xs text-white font-bold uppercase tracking-wide mb-1">Energia (Vigor)</div>
                        <div className="h-6 bg-[#333] border-4 border-white w-full relative pixel-box">
                            <div className="h-full bg-yellow-500" style={{ width: `${enPercent}%` }}></div>
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">{Math.floor(state.currentEnergy)}/{combatStats.maxEnergy}</span>
                        </div>
                    </div>
                </div>

                {/* Combat Power inside left panel for better space use */}
                <h2 className="text-sm font-bold uppercase text-white border-b-4 border-[#fff] pb-2 mt-4 tracking-wider shrink-0 flex items-center gap-2">
                     <span className="w-2 h-2 bg-white inline-block"></span>
                     Poder de Combate
                </h2>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-300 shrink-0">
                    <li className="flex justify-between border-b-2 border-gray-600 pb-1"><span>Ataque Físico</span> <span className="font-bold text-white shadow-black drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">{combatStats.attack}</span></li>
                    <li className="flex justify-between border-b-2 border-gray-600 pb-1"><span>Ataque Mágico</span> <span className="font-bold text-white shadow-black drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">{combatStats.magicAttack}</span></li>
                    <li className="flex justify-between border-b-2 border-gray-600 pb-1"><span>Defesa</span> <span className="font-bold text-white shadow-black drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">{combatStats.defense}</span></li>
                    <li className="flex justify-between"><span>Multiplicador</span> <span className="font-bold text-yellow-400 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">{state.playerClass ? state.playerClass.baseSkill.multiplier : 1}x</span></li>
                </ul>
            </div>

            {/* Right side: Attributes Container */}
            <div className="flex-1 bg-[#111] border-4 border-[#fff] p-4 pixel-box flex flex-col pt-4 overflow-y-auto custom-scrollbar">
                <div className="flex justify-between border-b-4 border-white pb-2 mb-3 items-end shrink-0">
                    <h2 className="text-xl font-bold uppercase text-white tracking-wider flex items-center gap-2">
                        <span className="w-3 h-3 bg-white inline-block"></span>
                        Atributos
                    </h2>
                    <span className="text-xs sm:text-sm font-bold text-yellow-400 bg-black border-2 border-white px-2 py-0.5 pixel-box">Pts Ocultos: {state.statPoints}</span>
                </div>
                
                <ul className="space-y-4 text-xs sm:text-sm text-gray-300 shrink-0 mt-2 font-sans">
                    {(['strength', 'agility', 'vitality', 'intelligence', 'sense'] as const).map(attr => (
                        <li key={attr} className="flex justify-between items-center group bg-[#222] p-2 border-4 border-gray-600 hover:border-white transition-none pixel-box">
                            <span className="capitalize font-bold tracking-wider">{attr === 'strength' ? 'Força' : attr === 'agility' ? 'Agilidade' : attr === 'vitality' ? 'Vitalidade' : attr === 'intelligence' ? 'Inteligência' : 'Sentido'}</span>
                            <div className="flex items-center gap-4">
                                <span className="font-black text-white min-w-[20px] text-right drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">{state.attributes[attr]}</span>
                                <button 
                                    onClick={() => handleAddStat(attr)}
                                    disabled={state.statPoints <= 0}
                                    className="w-8 h-8 sm:w-10 sm:h-10 bg-[#333] hover:bg-white hover:text-black disabled:opacity-50 disabled:hover:bg-[#333] disabled:hover:text-white border-2 border-white flex items-center justify-center font-bold text-white transition-none pixel-box"
                                >
                                    <span>+</span>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
