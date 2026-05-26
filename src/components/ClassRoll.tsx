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
            <div className="flex-none sm:w-[40%] bg-[#1a1a24] border-4 border-[#3b3b46] p-4 shadow-lg flex flex-col items-center justify-center shrink-0">
                <h2 className="text-lg font-bold uppercase text-orange-400 border-b-2 border-[#2b2b36] pb-2 mb-4 tracking-wider w-full text-center">
                    Evocação de Classes
                </h2>
                <div className="flex flex-col items-center gap-1 mb-8">
                    <div className="text-4xl font-black text-orange-300 drop-shadow-md">{state.classPoints}</div>
                    <div className="text-xs text-gray-400 uppercase font-bold text-center">Pontos de Classe</div>
                </div>

                <div className="w-full flex flex-col gap-2 relative">
                    <button 
                        onClick={handleRoll}
                        disabled={state.classPoints < 10 || isRolling}
                        className={`w-full py-6 text-sm font-black uppercase border-4 border-orange-500 transition-all transform active:scale-95
                                  ${state.classPoints >= 10 && !isRolling ? 'bg-orange-600 text-black shadow-[0_0_15px_rgba(249,115,22,0.5)] hover:bg-orange-500 hover:shadow-[0_0_25px_rgba(249,115,22,0.8)]' : 'bg-[#0a0a0f] border-[#2b2b36] text-gray-600'}`}
                    >
                        {isRolling ? 'Evocando...' : 'Evocar (10 Pts)'}
                    </button>
                    {lastRoll && !isRolling && (
                        <div className="absolute top-[110%] left-0 w-full animate-bounce bg-[#0a0a0f] border-2 border-orange-500 p-3 text-center shadow-[0_0_20px_rgba(0,0,0,0.8)] z-20">
                            <div className="text-[10px] text-gray-400 uppercase mb-1">Você Obteve</div>
                            <div className="font-bold text-lg text-white">[{lastRoll.cls.rank}] {lastRoll.cls.name}</div>
                            {lastRoll.isDuplicate ? (
                                <div className="text-xs text-yellow-500 mt-2 font-bold">+ {lastRoll.compensation} Ouro (Repetido)</div>
                            ) : (
                                <div className="text-xs text-green-500 mt-2 font-bold">NOVA CLASSE!</div>
                            )}
                        </div>
                    )}
                </div>

                <div className="mt-8 text-[8px] sm:text-[10px] text-gray-500 text-left border-t-2 border-[#2b2b36] pt-2 w-full grid grid-cols-3 gap-1">
                    <div className="text-center font-bold">E: 45%</div>
                    <div className="text-center font-bold">D: 30%</div>
                    <div className="text-center font-bold">C: 15%</div>
                    <div className="text-center font-bold">B: 7%</div>
                    <div className="text-center font-bold">A: 2.5%</div>
                    <div className="text-center font-bold">S: 0.5%</div>
                </div>
            </div>

            {/* Owned Classes Panel */}
            <div className="flex-1 bg-[#1a1a24] border-4 border-[#3b3b46] flex flex-col h-full overflow-hidden">
                <div className="p-3 border-b-4 border-[#3b3b46] bg-[#0a0a0f] shrink-0">
                    <h3 className="text-sm font-bold uppercase text-gray-300">Meu Arsenal de Classes</h3>
                </div>
                <div className="flex-grow overflow-y-auto custom-scrollbar p-2 grid grid-cols-1 md:grid-cols-2 gap-2 place-content-start">
                    {CLASSES.filter(c => state.unlockedClasses.includes(c.id)).map(cls => {
                        const isEquipped = state.playerClass?.id === cls.id;
                        
                        return (
                            <div key={cls.id} className={`p-3 border-2 flex flex-col justify-between items-start gap-2 transition-colors
                                ${isEquipped ? 'bg-orange-900/20 border-orange-500' : 'bg-[#0a0a0f] border-[#2b2b36]'}`}>
                                <div className="w-full">
                                    <div className="text-xs font-bold text-white uppercase flex items-center justify-between">
                                        <span>{cls.name}</span>
                                        <span className={`text-[10px] px-1 font-black ${isEquipped ? 'bg-orange-500 text-black' : 'bg-[#2b2b36] text-white'}`}>{cls.rank}</span>
                                    </div>
                                    <div className="text-[10px] text-gray-400 mt-1">Dano: <span className="uppercase text-orange-300">{cls.damageType}</span></div>
                                    <div className="text-[9px] text-gray-500 mt-1 line-clamp-2" title={cls.baseSkill.description}>
                                        {cls.baseSkill.name}: {cls.baseSkill.description}
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => !isEquipped && handleChangeClass(cls.id)}
                                    disabled={isEquipped}
                                    className={`w-full py-2 text-[10px] font-bold uppercase border-2 active:scale-95 transition-all outline-none mt-1
                                    ${isEquipped ? 'border-orange-500 bg-orange-600 text-black' : 'border-[#4b4b56] bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                                >
                                    {isEquipped ? 'Equipado' : 'Equipar'}
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
