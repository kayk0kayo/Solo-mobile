import React, { useState } from 'react';
import { useGame } from '../GameContext';
import { CLASSES } from '../lib/gameData';
import { PlayerClass } from '../types';

export const ClassRoll = () => {
    const { state, dispatch } = useGame();
    const [lastRoll, setLastRoll] = useState<{ cls: PlayerClass, isDuplicate: boolean, compensation: number } | null>(null);
    const [isRolling, setIsRolling] = useState(false);

    const handleRoll = () => {
        if (state.classPoints < 10 || isRolling) return;
        
        setIsRolling(true);
        setLastRoll(null);

        // Simulated roll delay for effect
        setTimeout(() => {
            let r = Math.random() * 100;
            let rank = 'E';
            if (r < 0.5) rank = 'S';
            else if (r < 3) rank = 'A';
            else if (r < 10) rank = 'B';
            else if (r < 25) rank = 'C';
            else if (r < 55) rank = 'D';

            const possibleClasses = CLASSES.filter(c => c.rank === rank);
            // Default to E if missing
            const rolledClass = possibleClasses.length > 0 
                ? possibleClasses[Math.floor(Math.random() * possibleClasses.length)]
                : CLASSES[0];
            
            const isDuplicate = state.unlockedClasses.includes(rolledClass.id);
            const compensation = 100 * (rank === 'S' ? 100 : rank === 'A' ? 50 : rank === 'B' ? 20 : rank === 'C' ? 10 : rank === 'D' ? 5 : 1);
            
            dispatch({ type: 'ROLL_CLASS', cost: 10, resultClassId: rolledClass.id, isDuplicate, compensationGold: compensation });
            setLastRoll({ cls: rolledClass, isDuplicate, compensation });
            setIsRolling(false);
        }, 800);
    }

    const handleChangeClass = (classId: string) => {
        const cls = CLASSES.find(c => c.id === classId);
        if (cls) {
            dispatch({ type: 'SET_CLASS', playerClass: cls });
        }
    }

    return (
        <div className="h-full flex flex-col sm:flex-row gap-4 max-w-5xl mx-auto w-full">
            {/* Gacha Panel */}
            <div className="flex-none sm:w-[40%] bg-[#020d1a]/80 backdrop-blur-md border border-[#03dbfc]/50 p-4 shadow-[0_0_15px_rgba(3,219,252,0.2)] flex flex-col items-center justify-center shrink-0">
                <h2 className="text-lg font-bold uppercase text-[#03dbfc] border-b border-[#03dbfc]/50 pb-2 mb-4 tracking-widest w-full text-center drop-shadow-[0_0_5px_rgba(3,219,252,0.8)]">
                    Extração de Classe
                </h2>
                <div className="flex flex-col items-center gap-1 mb-8">
                    <div className="text-5xl font-black text-[#c9e0ff] drop-shadow-[0_0_10px_rgba(3,219,252,0.8)]">{state.classPoints}</div>
                    <div className="text-[10px] text-[#03dbfc]/70 uppercase font-bold text-center tracking-widest">Pontos de Extração</div>
                </div>

                <div className="w-full flex flex-col gap-2 relative">
                    <button 
                        onClick={handleRoll}
                        disabled={state.classPoints < 10 || isRolling}
                        className={`w-full py-6 text-sm font-black uppercase transition-all transform active:scale-95 skew-x-[-12deg]
                                  ${state.classPoints >= 10 && !isRolling ? 'bg-[#03dbfc] text-[#010915] shadow-[0_0_15px_rgba(3,219,252,0.5)] hover:shadow-[0_0_25px_rgba(3,219,252,0.8)]' : 'bg-[#001732] border border-[#004080] text-blue-300/30'}`}
                    >
                        <span className="block skew-x-[12deg] tracking-widest">{isRolling ? 'EXTRAINDO...' : 'EXTRAIR (10 PT)'}</span>
                    </button>
                    {lastRoll && !isRolling && (
                        <div className="absolute top-[110%] left-0 w-full animate-bounce bg-[#001732]/90 backdrop-blur-md border border-[#03dbfc] p-3 text-center shadow-[0_0_20px_rgba(3,219,252,0.5)] z-20">
                            <div className="text-[10px] text-[#03dbfc]/70 uppercase mb-1 tracking-widest">Extração Concluída</div>
                            <div className="font-bold text-lg text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] tracking-wide">[{lastRoll.cls.rank}] {lastRoll.cls.name}</div>
                            {lastRoll.isDuplicate ? (
                                <div className="text-[10px] text-yellow-400 mt-2 font-bold uppercase tracking-widest">+ {lastRoll.compensation} Ouro (Fragmentado)</div>
                            ) : (
                                <div className="text-[10px] text-[#03dbfc] mt-2 font-bold uppercase tracking-widest drop-shadow-[0_0_5px_rgba(3,219,252,0.8)]">NOVA CLASSE ADQUIRIDA!</div>
                            )}
                        </div>
                    )}
                </div>

                <div className="mt-8 text-[8px] sm:text-[10px] text-[#03dbfc]/50 text-left border-t border-[#004080] pt-2 w-full grid grid-cols-3 gap-1">
                    <div className="text-center font-bold">E: 45%</div>
                    <div className="text-center font-bold">D: 30%</div>
                    <div className="text-center font-bold">C: 15%</div>
                    <div className="text-center font-bold">B: 7%</div>
                    <div className="text-center font-bold">A: 2.5%</div>
                    <div className="text-center font-bold text-[#03dbfc]">S: 0.5%</div>
                </div>
            </div>

            {/* Owned Classes Panel */}
            <div className="flex-1 bg-[#020d1a]/80 backdrop-blur-md border border-[#004080] flex flex-col h-full overflow-hidden shadow-[0_0_15px_rgba(0,20,40,0.5)]">
                <div className="p-3 border-b border-[#004080] bg-[#001732]/80 shrink-0">
                    <h3 className="text-sm font-bold uppercase text-[#03dbfc] tracking-widest text-center">Registro de Classes</h3>
                </div>
                <div className="flex-grow overflow-y-auto custom-scrollbar p-2 grid grid-cols-1 md:grid-cols-2 gap-2 place-content-start">
                    {CLASSES.filter(c => state.unlockedClasses.includes(c.id)).map(cls => {
                        const isEquipped = state.playerClass?.id === cls.id;
                        
                        return (
                            <div key={cls.id} className={`p-3 border flex flex-col justify-between items-start gap-2 transition-colors relative overflow-hidden group
                                ${isEquipped ? 'bg-[#03dbfc]/10 border-[#03dbfc]' : 'bg-[#001732]/50 border-[#004080]/50 hover:border-[#03dbfc]/50'}`}>
                                <div className="w-full relative z-10">
                                    <div className="text-xs font-bold text-[#c9e0ff] uppercase flex items-center justify-between tracking-wide">
                                        <span>{cls.name}</span>
                                        <span className={`text-[10px] px-2 py-0.5 font-black uppercase ${isEquipped ? 'bg-[#03dbfc] text-[#010915] shadow-[0_0_5px_rgba(3,219,252,0.8)]' : 'bg-[#001c3d] text-[#03dbfc] border border-[#03dbfc]/50'}`}>{cls.rank}</span>
                                    </div>
                                    <div className="text-[10px] text-blue-200/50 mt-1 uppercase tracking-widest">Dano: <span className="text-red-400 font-bold">{cls.damageType}</span></div>
                                    <div className="text-[9px] text-blue-200/70 mt-1 line-clamp-2 leading-relaxed" title={cls.baseSkill.description}>
                                        <strong className="text-[#03dbfc]">{cls.baseSkill.name}:</strong> {cls.baseSkill.description}
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => !isEquipped && handleChangeClass(cls.id)}
                                    disabled={isEquipped}
                                    className={`w-full py-2 text-[10px] font-bold uppercase border active:scale-95 transition-all outline-none mt-1 skew-x-[-12deg] relative z-10
                                    ${isEquipped ? 'border-[#03dbfc] bg-[#03dbfc] text-[#010915] shadow-[0_0_10px_rgba(3,219,252,0.5)]' : 'border-[#03dbfc]/50 bg-[#001c3d] text-[#03dbfc] hover:bg-[#03dbfc] hover:text-[#010915]'}`}
                                >
                                    <span className="block skew-x-[12deg] tracking-widest">{isEquipped ? 'ATIVO' : 'ATIVAR'}</span>
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
