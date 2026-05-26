import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../GameContext';
import { Monster, Rank } from '../types';
import { generateMonster, getNextRank } from '../lib/gameData';

interface BattleProps {
    enemy: Monster;
    portalIsRed: boolean;
    onLeave: () => void;
}

export const Battle = ({ enemy: initialEnemy, portalIsRed, onLeave }: BattleProps) => {
    const { state, dispatch, combatStats } = useGame();
    
    const [enemy, setEnemy] = useState<Monster>(initialEnemy);
    const [enemyHp, setEnemyHp] = useState(initialEnemy.hp);
    
    // We can fight up to 3 monsters: Normal -> Boss -> (Secret)
    const [battleStage, setBattleStage] = useState<'normal' | 'boss' | 'secret'>('normal');
    
    const [logs, setLogs] = useState<{ id: number, text: string, type: 'dmg' | 'heal' | 'info' | 'reward' }[]>([]);
    
    // Red portal logic: Increases rank by 1 for monsters.
    const effectiveRank = portalIsRed ? getNextRank(initialEnemy.rank) : initialEnemy.rank;

    const logId = useRef(0);
    const addLog = (text: string, type: 'dmg' | 'heal' | 'info' | 'reward' = 'info') => {
        setLogs(prev => [...prev.slice(-10), { id: logId.current++, text, type }]);
    };

    // Auto-attack timer / Combat loop
    useEffect(() => {
        if (enemyHp <= 0 || state.currentHp <= 0) return;

        const interval = setInterval(() => {
            // Enemy attacks player (Tick based)
            let dmg = Math.max(1, enemy.damage - combatStats.defense);
            
            // Apply shields/passives if any here from combatStats or state.
            
            dispatch({ type: 'TAKE_DAMAGE', amount: dmg });
            addLog(`O ${enemy.name} te atacou dando $ {dmg} de dano!`, 'dmg');
            
            if (state.currentHp - dmg <= 0) {
                 dispatch({ type: 'DEATH' });
                 addLog(`Você morreu! Ressuscitando...`, 'dmg');
                 setTimeout(() => onLeave(), 2000);
            }
        }, 3000); // Enemy attacks every 3 seconds

        return () => clearInterval(interval);
    }, [enemy, enemyHp, state.currentHp, combatStats.defense]);

    const handleDefeatEnemy = () => {
        // Rewards
        let xpGained = enemy.xpReward;
        let goldGained = enemy.goldReward;
        let crystalGained = enemy.crystalReward;

        // Apply passives
        let xpMult = 1, goldMult = 1, crystalMult = 1, secretChance = 0;
        
        state.equipped.passives.forEach(p => {
            if (p?.passiveEffects) {
                if (p.passiveEffects.xpMultiplier) xpMult *= p.passiveEffects.xpMultiplier;
                if (p.passiveEffects.goldMultiplier) goldMult *= p.passiveEffects.goldMultiplier;
                if (p.passiveEffects.manaCrystalMultiplier) crystalMult *= p.passiveEffects.manaCrystalMultiplier;
                if (p.passiveEffects.secretMonsterChance) secretChance += p.passiveEffects.secretMonsterChance;
            }
        });

        // Apply upgrades
        if (state.upgrades['upg_xp']) xpMult *= (1 + state.upgrades['upg_xp'] * 0.05);
        if (state.upgrades['upg_gold']) goldMult *= (1 + state.upgrades['upg_gold'] * 0.05);
        if (state.upgrades['upg_crystals']) crystalMult *= (1 + state.upgrades['upg_crystals'] * 0.05);

        xpGained = Math.floor(xpGained * xpMult);
        goldGained = Math.floor(goldGained * goldMult);
        crystalGained = Math.floor(crystalGained * crystalMult);

        dispatch({ type: 'ADD_XP', amount: xpGained });
        dispatch({ type: 'ADD_GOLD', amount: goldGained });
        dispatch({ type: 'ADD_CRYSTALS', amount: crystalGained });
        
        addLog(`+ ${xpGained} XP | + ${goldGained} Ouro | + ${crystalGained} Cristais`, 'reward');

        if (enemy.classPointReward) {
            let cp = enemy.classPointReward;
            if (state.upgrades['upg_classpts']) cp *= (1 + state.upgrades['upg_classpts'] * 0.1);
            dispatch({ type: 'ADD_CLASS_POINTS', amount: Math.floor(cp) });
            addLog(`+ ${Math.floor(cp)} Pontos de Classe!`, 'reward');
        }

        // Next Stage logic
        if (battleStage === 'normal') {
            setBattleStage('boss');
            const newBoss = generateMonster(effectiveRank, 'boss', portalIsRed);
            setEnemy(newBoss);
            setEnemyHp(newBoss.hp);
            addLog(`O chefe da masmorra apareceu: ${newBoss.name}!`, 'info');
        } else if (battleStage === 'boss') {
            // Chance for secret monster
            const baseSecretChance = portalIsRed ? 0.3 : 0.05;
            if (Math.random() < baseSecretChance + secretChance) {
                 setBattleStage('secret');
                 const newSecret = generateMonster(effectiveRank, 'secret', portalIsRed);
                 setEnemy(newSecret);
                 setEnemyHp(newSecret.hp);
                 addLog(`Aviso! Uma presença aterrorizante se aproxima: ${newSecret.name}!`, 'info');
            } else {
                 addLog('Portal limpo!', 'info');
                 setTimeout(() => onLeave(), 2000);
            }
        } else {
            addLog('Portal secreto limpo!', 'info');
            setTimeout(() => onLeave(), 2000);
        }
    };

    const handleAttack = () => {
        if (enemyHp <= 0 || state.currentHp <= 0) return;
        
        let dmg = Math.max(1, combatStats.attack - enemy.defense);
        setEnemyHp(prev => {
            const next = prev - dmg;
            if (next <= 0) setTimeout(handleDefeatEnemy, 100);
            return next;
        });
        addLog(`Você atacou causando $ {dmg} de dano!`, 'info');
    };

    const handleSkill = () => {
         if (!state.playerClass) {
             addLog("Você não possui uma classe para usar habilidades!", "dmg");
             return;
         }
         
         const skill = state.playerClass.baseSkill;
         let canUse = true;

         // Check cost
         if (skill.cost) {
             if (skill.cost.type === 'mana' && state.currentMana < skill.cost.amount) canUse = false;
             if (skill.cost.type === 'energy' && state.currentEnergy < skill.cost.amount) canUse = false;
             if (skill.cost.type === 'both' && (state.currentMana < skill.cost.amount || state.currentEnergy < skill.cost.amount)) canUse = false;
         }
         
         if (!canUse) {
             addLog("Mana ou Energia insuficiente!", "dmg");
             return;
         }

         // Consume
         if (skill.cost) {
             if (skill.cost.type === 'mana' || skill.cost.type === 'both') dispatch({ type: 'SPEND_MANA', amount: skill.cost.amount });
             if (skill.cost.type === 'energy' || skill.cost.type === 'both') dispatch({ type: 'SPEND_ENERGY', amount: skill.cost.amount });
         }

         let baseDmg = state.playerClass.damageType === 'magical' ? combatStats.magicAttack : 
                       state.playerClass.damageType === 'physical' ? combatStats.attack : 
                       (combatStats.attack + combatStats.magicAttack);
                       
         let dmg = Math.max(1, Math.floor(baseDmg * (skill.multiplier || 1)) - enemy.defense);
         
         setEnemyHp(prev => {
            const next = prev - dmg;
            if (next <= 0) setTimeout(handleDefeatEnemy, 100);
            return next;
         });
         addLog(`Usou ${skill.name} causando $ {dmg} de dano!`, 'info');
    }

    const hpPercent = Math.max(0, (state.currentHp / combatStats.maxHp) * 100);
    const enemyHpPercent = Math.max(0, (enemyHp / enemy.maxHp) * 100);

    return (
        <div className={`h-[100dvh] w-full flex flex-col font-mono text-white ${portalIsRed ? 'bg-red-950/20' : 'bg-[#0a0a0f]'} transition-colors duration-1000 items-center justify-between p-4 relative`}>
             <div className="absolute inset-0 pointer-events-none opacity-10"
               style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px)' }}>
             </div>

             {/* Header */}
             <div className="w-full max-w-xl z-10 flex justify-between items-center shrink-0">
                  <div className="text-2xl font-black uppercase tracking-wider drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                      {portalIsRed ? <span className="text-red-500">PORTAL VERMELHO</span> : 'BATALHA'}
                  </div>
                  <button onClick={onLeave} className="px-4 py-2 border-2 border-[#2b2b36] bg-[#1a1a24] text-xs uppercase font-bold active:scale-95">Fugir</button>
             </div>
             
             {/* Battle Arena */}
             <div className="flex-grow w-full max-w-4xl flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-12 z-10 shrink-0">
                  
                  {/* Player Status (Left on desktop, Bottom on mobile) */}
                  <div className="w-full sm:w-[40%] order-3 sm:order-1 flex flex-col justify-end h-full">
                       <div className="text-xs text-gray-400 font-bold mb-1 uppercase hidden sm:block text-left">Você</div>
                       <div className="w-full h-5 sm:h-6 bg-[#0a0a0f] border-2 border-[#2b2b36] relative mb-1">
                            <div className="h-full bg-green-600 transition-all duration-300" style={{ width: `${hpPercent}%` }}></div>
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold drop-shadow-md">HP {Math.floor(state.currentHp)}/{combatStats.maxHp}</span>
                       </div>
                       <div className="flex gap-1 w-full">
                           <div className="flex-1 h-3 sm:h-4 bg-[#0a0a0f] border-2 border-[#2b2b36] relative">
                                <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${(state.currentMana / combatStats.maxMana) * 100}%` }}></div>
                           </div>
                           <div className="flex-1 h-3 sm:h-4 bg-[#0a0a0f] border-2 border-[#2b2b36] relative">
                                <div className="h-full bg-yellow-600 transition-all duration-300" style={{ width: `${(state.currentEnergy / combatStats.maxEnergy) * 100}%` }}></div>
                           </div>
                       </div>
                  </div>

                  <div className="text-2xl sm:text-4xl text-gray-700 font-black italic order-2 hidden sm:block">VS</div>

                  {/* Enemy Status (Right on desktop, Top on mobile) */}
                  <div className="w-full sm:w-[40%] order-1 sm:order-3 flex flex-col items-center sm:items-end">
                       <div className="text-center sm:text-right mb-2 w-full">
                           <div className={`text-lg sm:text-xl font-bold uppercase truncate ${enemy.isSecret ? 'text-purple-400' : enemy.isBoss ? 'text-orange-400' : 'text-gray-300'}`}>{enemy.name}</div>
                           <div className="text-[10px] text-gray-500">Lv {effectiveRank} {enemy.isBoss ? '| CHEFE' : ''} {enemy.isSecret ? '| SECRETO' : ''}</div>
                       </div>
                       {/* Pixel Art Placeholder for enemy */}
                       <div className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-[#2b2b36] bg-[#1a1a24] shadow-[0_0_30px_rgba(0,0,0,0.8)] mb-2 flex items-center justify-center animate-bounce">
                           <div className={`text-4xl sm:text-6xl ${enemy.isSecret ? 'text-purple-500' : 'text-red-500'}`}>👾</div>
                       </div>
                       
                       <div className="w-full max-w-[200px] sm:max-w-none h-4 sm:h-5 bg-[#0a0a0f] border-2 border-[#2b2b36] relative">
                            <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${enemyHpPercent}%` }}></div>
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold drop-shadow-md">{Math.floor(enemyHp)}/{enemy.maxHp}</span>
                       </div>
                  </div>
             </div>

             {/* Action UI */}
             <div className="w-full max-w-4xl flex gap-4 mt-2 h-[120px] shrink-0">
                  <div className="flex-1 bg-[#0a0a0f]/80 border-2 border-[#2b2b36] p-2 overflow-y-auto custom-scrollbar flex flex-col-reverse justify-start text-[10px] sm:text-xs">
                      {[...logs].reverse().map(l => (
                          <div key={l.id} className={`${l.type === 'reward' ? 'text-yellow-400 font-bold' : l.type === 'dmg' ? 'text-red-400' : 'text-gray-400'}`}>
                              {l.text}
                          </div>
                      ))}
                  </div>

                  <div className="w-[120px] sm:w-[200px] flex flex-col gap-2 shrink-0">
                      <button 
                        onClick={handleAttack}
                        className="flex-1 bg-[#1a1a24] border-2 border-[#4b4b56] font-bold uppercase active:scale-95 hover:bg-[#2b2b36] text-[10px] sm:text-xs">
                        Atacar
                      </button>
                      <button 
                        onClick={handleSkill}
                        className={`flex-1 border-2 font-bold uppercase active:scale-95 text-[10px] sm:text-xs overflow-hidden text-ellipsis px-1 ${state.playerClass ? 'bg-purple-900 border-purple-500 text-white hover:bg-purple-700' : 'bg-gray-800 border-gray-600 text-gray-500'}`}>
                        {state.playerClass ? state.playerClass.baseSkill.name : 'Sem Classe'}
                      </button>
                  </div>
             </div>
             
             {/* Passives bar */}
             <div className="w-full max-w-4xl flex gap-1 justify-center mt-1 shrink-0">
                 {state.equipped.passives.map((p, i) => (
                      <div key={i} className={`text-[8px] p-1 border uppercase text-center w-24 truncate ${p ? 'border-green-500 text-green-300 bg-green-900/40' : 'border-[#2b2b36] text-gray-600'}`}>
                          {p ? p.name : 'Vazio'}
                      </div>
                 ))}
             </div>
        </div>
    )
}
