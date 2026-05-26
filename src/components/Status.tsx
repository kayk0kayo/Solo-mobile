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
            <div className="flex-1 bg-[#020d1a]/80 backdrop-blur-md border border-[#004080] p-4 shadow-[0_0_15px_rgba(0,20,40,0.5)] flex flex-col gap-3 overflow-y-auto custom-scrollbar transform transition-all">
                <h2 className="text-xl font-bold uppercase text-[#03dbfc] border-b border-[#004080] pb-2 mb-2 tracking-wider shrink-0 drop-shadow-[0_0_5px_rgba(3,219,252,0.5)] flex items-center gap-2">
                    <span className="w-2 h-6 bg-[#03dbfc] inline-block transform skew-x-12"></span>
                    Status do Jogador
                </h2>
                
                <div className="flex justify-between items-end mb-1 shrink-0">
                    <span className="text-blue-100/90 text-sm font-bold uppercase tracking-wider">Nível {state.level}</span>
                    <span className="text-[#03dbfc]/70 text-[10px] sm:text-xs uppercase">{levelsToNextRank(state.level)} Níveis Próx. Rank</span>
                </div>
                {/* Exp Bar */}
                <div className="h-4 bg-[#001732] border border-[#03dbfc]/30 w-full relative shrink-0 skew-x-[-12deg] overflow-hidden shadow-[0_0_10px_rgba(3,219,252,0.1)]">
                    <div className="h-full bg-gradient-to-r from-[#004080] to-[#03dbfc] transition-all duration-300" style={{ width: `${xpPercent}%` }}></div>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white drop-shadow-md font-bold skew-x-[12deg]">EXP {Math.floor(state.xp)}/{state.xpNeeded}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-2 shrink-0">
                    <div>
                        <div className="text-[10px] sm:text-xs text-[#03dbfc] font-bold uppercase tracking-wide mb-1">HP</div>
                        <div className="h-5 bg-[#001732] border border-red-500/30 w-full relative skew-x-[-12deg] overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-red-900 to-red-500 transition-all duration-300" style={{ width: `${hpPercent}%` }}></div>
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white drop-shadow-md font-bold skew-x-[12deg]">{Math.floor(state.currentHp)}/{combatStats.maxHp}</span>
                        </div>
                    </div>
                    <div>
                        <div className="text-[10px] sm:text-xs text-[#03dbfc] font-bold uppercase tracking-wide mb-1">Mana</div>
                        <div className="h-5 bg-[#001732] border border-blue-500/30 w-full relative skew-x-[-12deg] overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-900 to-blue-500 transition-all duration-300" style={{ width: `${mpPercent}%` }}></div>
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white drop-shadow-md font-bold skew-x-[12deg]">{Math.floor(state.currentMana)}/{combatStats.maxMana}</span>
                        </div>
                    </div>
                    <div className="col-span-2">
                        <div className="text-[10px] sm:text-xs text-[#03dbfc] font-bold uppercase tracking-wide mb-1">Energia (Vigor)</div>
                        <div className="h-5 bg-[#001732] border border-yellow-500/30 w-full relative skew-x-[-12deg] overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-yellow-900 to-yellow-500 transition-all duration-300" style={{ width: `${enPercent}%` }}></div>
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white drop-shadow-md font-bold skew-x-[12deg]">{Math.floor(state.currentEnergy)}/{combatStats.maxEnergy}</span>
                        </div>
                    </div>
                </div>

                {/* Combat Power inside left panel for better space use */}
                <h2 className="text-sm font-bold uppercase text-[#03dbfc] border-b border-[#004080] pb-2 mt-4 tracking-wider shrink-0 flex items-center gap-2">
                     <span className="w-1.5 h-4 bg-[#03dbfc] inline-block transform skew-x-12"></span>
                     Poder de Combate
                </h2>
                <ul className="space-y-2 text-xs sm:text-sm text-blue-200/80 shrink-0">
                    <li className="flex justify-between border-b border-[#004080]/30 pb-1"><span>Ataque Físico</span> <span className="font-bold text-white drop-shadow-[0_0_2px_rgba(255,255,255,0.8)]">{combatStats.attack}</span></li>
                    <li className="flex justify-between border-b border-[#004080]/30 pb-1"><span>Ataque Mágico</span> <span className="font-bold text-white drop-shadow-[0_0_2px_rgba(255,255,255,0.8)]">{combatStats.magicAttack}</span></li>
                    <li className="flex justify-between border-b border-[#004080]/30 pb-1"><span>Defesa</span> <span className="font-bold text-white drop-shadow-[0_0_2px_rgba(255,255,255,0.8)]">{combatStats.defense}</span></li>
                    <li className="flex justify-between"><span>Multiplicador</span> <span className="font-bold text-[#03dbfc] drop-shadow-[0_0_2px_rgba(3,219,252,0.8)]">{state.playerClass ? state.playerClass.baseSkill.multiplier : 1}x</span></li>
                </ul>
            </div>

            {/* Right side: Attributes Container */}
            <div className="flex-1 bg-[#020d1a]/80 backdrop-blur-md border border-[#004080] p-4 shadow-[0_0_15px_rgba(0,20,40,0.5)] flex flex-col pt-4 overflow-y-auto custom-scrollbar">
                <div className="flex justify-between border-b border-[#004080] pb-2 mb-3 items-end shrink-0">
                    <h2 className="text-xl font-bold uppercase text-[#03dbfc] tracking-wider drop-shadow-[0_0_5px_rgba(3,219,252,0.5)] flex items-center gap-2">
                        <span className="w-2 h-6 bg-[#03dbfc] inline-block transform skew-x-12"></span>
                        Atributos
                    </h2>
                    <span className="text-xs sm:text-sm font-bold text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)] border border-yellow-500/50 px-2 py-0.5 bg-yellow-900/20">Pts Ocultos: {state.statPoints}</span>
                </div>
                
                <ul className="space-y-4 text-xs sm:text-sm text-blue-200/80 shrink-0 mt-2">
                    {(['strength', 'agility', 'vitality', 'intelligence', 'sense'] as const).map(attr => (
                        <li key={attr} className="flex justify-between items-center group bg-[#001732]/50 p-2 border border-[#004080]/50 hover:border-[#03dbfc]/50 transition-colors">
                            <span className="capitalize font-bold tracking-wider">{attr === 'strength' ? 'Força' : attr === 'agility' ? 'Agilidade' : attr === 'vitality' ? 'Vitalidade' : attr === 'intelligence' ? 'Inteligência' : 'Sentido'}</span>
                            <div className="flex items-center gap-4">
                                <span className="font-black text-white min-w-[20px] text-right drop-shadow-[0_0_2px_rgba(255,255,255,0.8)]">{state.attributes[attr]}</span>
                                <button 
                                    onClick={() => handleAddStat(attr)}
                                    disabled={state.statPoints <= 0}
                                    className="w-6 h-6 sm:w-8 sm:h-8 bg-[#001c3d] hover:bg-[#03dbfc] hover:text-black disabled:opacity-30 disabled:hover:bg-[#001c3d] disabled:hover:text-[#c9e0ff] border border-[#03dbfc]/50 flex items-center justify-center font-bold text-[#c9e0ff] active:scale-95 transition-all skew-x-[-12deg]"
                                >
                                    <span className="skew-x-[12deg]">+</span>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
