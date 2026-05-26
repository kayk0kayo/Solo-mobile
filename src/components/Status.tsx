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
        <div className="h-full flex flex-col sm:flex-row gap-4 max-w-5xl mx-auto w-full">
            {/* Main Stats Panel */}
            <div className="flex-1 bg-[#1a1a24] border-4 border-[#3b3b46] p-4 shadow-lg flex flex-col gap-3 overflow-y-auto custom-scrollbar">
                <h2 className="text-xl font-bold uppercase text-gray-300 border-b-2 border-[#2b2b36] pb-2 mb-2 tracking-wider shrink-0">Status do Jogador</h2>
                
                <div className="flex justify-between items-end mb-1 shrink-0">
                    <span className="text-gray-400 text-sm font-bold uppercase">Nível {state.level}</span>
                    <span className="text-gray-500 text-[10px] sm:text-xs">{levelsToNextRank(state.level)} níveis pro prox. rank</span>
                </div>
                {/* Exp Bar */}
                <div className="h-4 bg-[#0a0a0f] border-2 border-[#2b2b36] w-full relative shrink-0">
                    <div className="h-full bg-cyan-600" style={{ width: `${xpPercent}%` }}></div>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white drop-shadow-md">EXP {Math.floor(state.xp)}/{state.xpNeeded}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-2 shrink-0">
                    <div>
                        <div className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase">HP</div>
                        <div className="h-5 bg-[#0a0a0f] border-2 border-[#2b2b36] w-full relative">
                            <div className="h-full bg-red-600" style={{ width: `${hpPercent}%` }}></div>
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white drop-shadow-md">{Math.floor(state.currentHp)}/{combatStats.maxHp}</span>
                        </div>
                    </div>
                    <div>
                        <div className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase">Mana</div>
                        <div className="h-5 bg-[#0a0a0f] border-2 border-[#2b2b36] w-full relative">
                            <div className="h-full bg-blue-600" style={{ width: `${mpPercent}%` }}></div>
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white drop-shadow-md">{Math.floor(state.currentMana)}/{combatStats.maxMana}</span>
                        </div>
                    </div>
                    <div className="col-span-2">
                        <div className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase">Energia (Vigor)</div>
                        <div className="h-5 bg-[#0a0a0f] border-2 border-[#2b2b36] w-full relative">
                            <div className="h-full bg-yellow-600" style={{ width: `${enPercent}%` }}></div>
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white drop-shadow-md">{Math.floor(state.currentEnergy)}/{combatStats.maxEnergy}</span>
                        </div>
                    </div>
                </div>

                {/* Combat Power inside left panel for better space use */}
                <h2 className="text-sm font-bold uppercase text-gray-300 border-b-2 border-[#2b2b36] pb-2 mt-4 tracking-wider shrink-0">Poder de Combate</h2>
                <ul className="space-y-1 text-xs sm:text-sm text-gray-400 shrink-0">
                    <li className="flex justify-between"><span>Ataque Físico</span> <span className="font-bold text-white">{combatStats.attack}</span></li>
                    <li className="flex justify-between"><span>Ataque Mágico</span> <span className="font-bold text-white">{combatStats.magicAttack}</span></li>
                    <li className="flex justify-between"><span>Defesa</span> <span className="font-bold text-white">{combatStats.defense}</span></li>
                    <li className="flex justify-between"><span>Multiplicador</span> <span className="font-bold text-white">{state.playerClass ? state.playerClass.baseSkill.multiplier : 1}x</span></li>
                </ul>
            </div>

            {/* Right side: Attributes Container */}
            <div className="flex-1 bg-[#1a1a24] border-4 border-[#3b3b46] p-4 shadow-lg flex flex-col pt-4 overflow-y-auto custom-scrollbar">
                <div className="flex justify-between border-b-2 border-[#2b2b36] pb-2 mb-3 items-end shrink-0">
                    <h2 className="text-xl font-bold uppercase text-gray-300 tracking-wider">Atributos</h2>
                    <span className="text-xs sm:text-sm font-bold text-green-400">Pts: {state.statPoints}</span>
                </div>
                
                <ul className="space-y-3 text-xs sm:text-sm text-gray-400 shrink-0">
                    {(['strength', 'agility', 'vitality', 'intelligence', 'sense'] as const).map(attr => (
                        <li key={attr} className="flex justify-between items-center group">
                            <span className="capitalize">{attr === 'strength' ? 'Força' : attr === 'agility' ? 'Agilidade' : attr === 'vitality' ? 'Vitalidade' : attr === 'intelligence' ? 'Inteligência' : 'Sentido'}</span>
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-white min-w-[20px] text-right">{state.attributes[attr]}</span>
                                <button 
                                    onClick={() => handleAddStat(attr)}
                                    disabled={state.statPoints <= 0}
                                    className="w-6 h-6 sm:w-8 sm:h-8 bg-[#2b2b36] hover:bg-green-700 disabled:opacity-20 disabled:hover:bg-[#2b2b36] border-2 border-[#4b4b56] flex items-center justify-center font-bold text-white active:scale-95 transition-transform"
                                >+</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
