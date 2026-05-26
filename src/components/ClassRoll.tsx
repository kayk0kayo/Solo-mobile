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
        <div className="h-full flex flex-col sm:flex-row gap-4 max-w-5xl mx-auto w-full font-mono">
            {/* Gacha Panel */}
            <div className="flex-none sm:w-[40%] bg-[#111] border-4 border-white p-4 pixel-box flex flex-col items-center justify-center shrink-0">
                <h2 className="text-lg font-bold uppercase text-white border-b-4 border-white pb-2 mb-4 tracking-widest w-full text-center drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
                    Extração de Classe
                </h2>
                <div className="flex flex-col items-center gap-1 mb-8">
                    <div className="text-5xl font-black text-white drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">{state.classPoints}</div>
                    <div className="text-[10px] text-gray-400 uppercase font-bold text-center tracking-widest mt-2">Pontos de Extração</div>
                </div>

                <div className="w-full flex flex-col gap-2 relative">
                    <button 
                        onClick={handleRoll}
                        disabled={state.classPoints < 10 || isRolling}
                        className={`w-full py-6 text-sm font-black uppercase transition-none border-4
                                  ${state.classPoints >= 10 && !isRolling ? 'bg-white border-white text-black hover:bg-gray-200 pixel-box' : 'bg-[#333] border-gray-600 text-gray-500'}`}
                    >
                        <span className="block tracking-widest">{isRolling ? 'EXTRAINDO...' : 'EXTRAIR (10 PT)'}</span>
                    </button>
                    {lastRoll && !isRolling && (
                        <div className="absolute top-[110%] left-0 w-full animate-none bg-black border-4 border-yellow-500 p-3 text-center pixel-box z-20">
                            <div className="text-[10px] text-gray-400 uppercase mb-1 tracking-widest">Extração Concluída</div>
                            <div className="font-bold text-lg text-yellow-400 drop-shadow-[2px_2px_0_rgba(0,0,0,1)] tracking-wide">[{lastRoll.cls.rank}] {lastRoll.cls.name}</div>
                            {lastRoll.isDuplicate ? (
                                <div className="text-[10px] text-yellow-500 mt-2 font-bold uppercase tracking-widest">+ {lastRoll.compensation} Ouro (Fragmentado)</div>
                            ) : (
                                <div className="text-[10px] text-blue-400 mt-2 font-bold uppercase tracking-widest drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">NOVA CLASSE ADQUIRIDA!</div>
                            )}
                        </div>
                    )}
                </div>

                <div className="mt-8 text-[8px] sm:text-[10px] text-gray-500 text-left border-t-4 border-gray-600 pt-2 w-full grid grid-cols-3 gap-1">
                    <div className="text-center font-bold">E: 45%</div>
                    <div className="text-center font-bold">D: 30%</div>
                    <div className="text-center font-bold">C: 15%</div>
                    <div className="text-center font-bold">B: 7%</div>
                    <div className="text-center font-bold">A: 2.5%</div>
                    <div className="text-center font-bold text-yellow-500">S: 0.5%</div>
                </div>
            </div>

            {/* Owned Classes Panel */}
            <div className="flex-1 bg-[#111] border-4 border-white flex flex-col h-full overflow-hidden pixel-box">
                <div className="p-3 border-b-4 border-white bg-black shrink-0">
                    <h3 className="text-sm font-bold uppercase text-white tracking-widest text-center">Registro de Classes</h3>
                </div>
                <div className="flex-grow overflow-y-auto custom-scrollbar p-2 grid grid-cols-1 md:grid-cols-2 gap-2 place-content-start font-sans">
                    {CLASSES.filter(c => state.unlockedClasses.includes(c.id)).map(cls => {
                        const isEquipped = state.playerClass?.id === cls.id;
                        
                        return (
                            <div key={cls.id} className={`p-3 border-4 flex flex-col justify-between items-start gap-2 transition-none relative overflow-hidden group pixel-box
                                ${isEquipped ? 'bg-[#333] border-white' : 'bg-[#222] border-gray-600 hover:border-gray-400'}`}>
                                <div className="w-full relative z-10">
                                    <div className="text-xs font-bold text-white uppercase flex items-center justify-between tracking-wide">
                                        <span>{cls.name}</span>
                                        <span className={`text-[10px] px-2 py-0.5 font-black uppercase border-2 border-white ${isEquipped ? 'bg-white text-black' : 'bg-black text-white'}`}>{cls.rank}</span>
                                    </div>
                                    <div className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">Dano: <span className="text-red-500 font-bold">{cls.damageType}</span></div>
                                    <div className="text-[9px] text-gray-300 mt-1 line-clamp-2 leading-relaxed font-sans" title={cls.baseSkill.description}>
                                        <strong className="text-white">{cls.baseSkill.name}:</strong> {cls.baseSkill.description}
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => !isEquipped && handleChangeClass(cls.id)}
                                    disabled={isEquipped}
                                    className={`w-full py-2 text-[10px] font-bold uppercase border-2 active:translate-y-1 transition-none outline-none mt-1 relative z-10
                                    ${isEquipped ? 'border-white bg-white text-black shadow-none' : 'border-white bg-black text-white hover:bg-white hover:text-black'}`}
                                >
                                    <span className="block tracking-widest">{isEquipped ? 'ATIVO' : 'ATIVAR'}</span>
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
