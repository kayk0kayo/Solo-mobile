import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../GameContext';
import { Monster, Rank } from '../types';
import { generateMonster, getNextRank } from '../lib/gameData';

interface BattleProps {
    enemy: Monster;
    portalIsRed: boolean;
    onLeave: () => void;
}

const MonsterCanvas = ({ isSecret, isBoss, state }: { isSecret: boolean, isBoss: boolean, state: 'idle' | 'hurt' | 'attack' }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const spriteRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        const image = new Image();
        // Fallback placeholder with generic 160x160 frames. Provide the URL path from your assets if available.
        image.src = `https://raw.githubusercontent.com/kayk0kayo/Solo-mobile/main/monster_placeholder.png`; // Fallback image or a generic pixel square for now if URL fails
        
        image.onload = () => {
            spriteRef.current = image;
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 1. PIXEL ART RENDERING (ANTI-ALIASING DISABLED)
        ctx.imageSmoothingEnabled = false;
        (ctx as any).mozImageSmoothingEnabled = false;
        (ctx as any).webkitImageSmoothingEnabled = false;
        (ctx as any).msImageSmoothingEnabled = false;

        let animationFrameId: number;
        let lastTime = 0;
        let timer = 0;
        const frameInterval = 1000 / 12; // 12 FPS

        // Using user requested 160x160 size
        const spriteWidth = 160;
        const spriteHeight = 160;
        
        let frameX = 0;
        let frameY = 0; // Row 0: Idle, Row 1: Attack, Row 2: Hurt

        // State machine frame rows
        if (state === 'idle') frameY = 0;
        else if (state === 'attack') frameY = 1;
        else if (state === 'hurt') frameY = 2;

        const maxFrames = 4; // Assume 4 frames per animation

        const animate = (timestamp: number) => {
            const deltaTime = timestamp - lastTime;
            lastTime = timestamp;

            if (timer > frameInterval) {
                frameX = (frameX + 1) % maxFrames;
                timer = 0;
            } else {
                timer += deltaTime;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Optional glow effect based on type
            ctx.shadowColor = isSecret ? '#a855f7' : isBoss ? '#f97316' : '#ef4444';
            ctx.shadowBlur = 15;

            if (spriteRef.current) {
                // 3. SECURE CLIPPING AND RENDERING
                ctx.drawImage(
                    spriteRef.current,
                    frameX * spriteWidth,
                    frameY * spriteHeight,
                    spriteWidth,
                    spriteHeight,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
            } else {
                // Placeholder rectangle if image fails to load
                ctx.fillStyle = isSecret ? '#a855f7' : isBoss ? '#f97316' : '#ef4444';
                ctx.globalAlpha = 0.8;
                // Just draw a rectangle changing height slightly to 'animate'
                const bob = state === 'attack' ? -10 : state === 'hurt' ? 10 : Math.sin(timestamp/200) * 5;
                ctx.fillRect(20, 20 + bob, canvas.width - 40, canvas.height - 40);
                ctx.globalAlpha = 1.0;
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [state, isSecret, isBoss]);

    return (
        <canvas 
            ref={canvasRef} 
            width={160} 
            height={160} 
            className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]"
        />
    );
};

export const Battle = ({ enemy: initialEnemy, portalIsRed, onLeave }: BattleProps) => {
    const { state: gameState, dispatch, combatStats } = useGame();
    
    const [enemy, setEnemy] = useState<Monster>(initialEnemy);
    const [enemyHp, setEnemyHp] = useState(initialEnemy.hp);
    
    const [battleStage, setBattleStage] = useState<'normal' | 'boss' | 'secret'>('normal');
    const [logs, setLogs] = useState<{ id: number, text: string, type: 'dmg' | 'heal' | 'info' | 'reward' }[]>([]);
    
    const [enemyAnimState, setEnemyAnimState] = useState<'idle' | 'hurt' | 'attack'>('idle');
    
    const effectiveRank = portalIsRed ? getNextRank(initialEnemy.rank) : initialEnemy.rank;

    const logId = useRef(0);
    const addLog = (text: string, type: 'dmg' | 'heal' | 'info' | 'reward' = 'info') => {
        setLogs(prev => [...prev.slice(-10), { id: logId.current++, text, type }]);
    };

    useEffect(() => {
        if (enemyHp <= 0 || gameState.currentHp <= 0) return;

        const interval = setInterval(() => {
            let dmg = Math.max(1, enemy.damage - combatStats.defense);
            
            setEnemyAnimState('attack');
            setTimeout(() => setEnemyAnimState('idle'), 500);

            dispatch({ type: 'TAKE_DAMAGE', amount: dmg });
            addLog(`O ${enemy.name} desferiu um ataque de ${dmg} de dano!`, 'dmg');
            
            if (gameState.currentHp - dmg <= 0) {
                 dispatch({ type: 'DEATH' });
                 addLog(`[SISTEMA]: Jogador eliminado. Iniciando ressurreição...`, 'dmg');
                 setTimeout(() => onLeave(), 2000);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [enemy, enemyHp, gameState.currentHp, combatStats.defense]);

    const handleDefeatEnemy = () => {
        let xpGained = enemy.xpReward;
        let goldGained = enemy.goldReward;
        let crystalGained = enemy.crystalReward;
        let xpMult = 1, goldMult = 1, crystalMult = 1, secretChance = 0;
        
        gameState.equipped.passives.forEach(p => {
            if (p?.passiveEffects) {
                if (p.passiveEffects.xpMultiplier) xpMult *= p.passiveEffects.xpMultiplier;
                if (p.passiveEffects.goldMultiplier) goldMult *= p.passiveEffects.goldMultiplier;
                if (p.passiveEffects.manaCrystalMultiplier) crystalMult *= p.passiveEffects.manaCrystalMultiplier;
                if (p.passiveEffects.secretMonsterChance) secretChance += p.passiveEffects.secretMonsterChance;
            }
        });

        if (gameState.upgrades['upg_xp']) xpMult *= (1 + gameState.upgrades['upg_xp'] * 0.05);
        if (gameState.upgrades['upg_gold']) goldMult *= (1 + gameState.upgrades['upg_gold'] * 0.05);
        if (gameState.upgrades['upg_crystals']) crystalMult *= (1 + gameState.upgrades['upg_crystals'] * 0.05);

        xpGained = Math.floor(xpGained * xpMult);
        goldGained = Math.floor(goldGained * goldMult);
        crystalGained = Math.floor(crystalGained * crystalMult);

        dispatch({ type: 'ADD_XP', amount: xpGained });
        dispatch({ type: 'ADD_GOLD', amount: goldGained });
        dispatch({ type: 'ADD_CRYSTALS', amount: crystalGained });
        
        addLog(`+ ${xpGained} EXP | + ${goldGained} Ouro | + ${crystalGained} Cristal de Mana`, 'reward');

        if (enemy.classPointReward) {
            let cp = enemy.classPointReward;
            if (gameState.upgrades['upg_classpts']) cp *= (1 + gameState.upgrades['upg_classpts'] * 0.1);
            dispatch({ type: 'ADD_CLASS_POINTS', amount: Math.floor(cp) });
            addLog(`+ ${Math.floor(cp)} Pontos de Sistema!`, 'reward');
        }

        if (battleStage === 'normal') {
            setBattleStage('boss');
            const newBoss = generateMonster(effectiveRank, 'boss', portalIsRed);
            setEnemy(newBoss);
            setEnemyHp(newBoss.hp);
            setEnemyAnimState('idle');
            addLog(`[ALERTA]: O Chefe da Dungeon ${newBoss.name} apareceu!`, 'info');
        } else if (battleStage === 'boss') {
            const baseSecretChance = portalIsRed ? 0.3 : 0.05;
            if (Math.random() < baseSecretChance + secretChance) {
                 setBattleStage('secret');
                 const newSecret = generateMonster(effectiveRank, 'secret', portalIsRed);
                 setEnemy(newSecret);
                 setEnemyHp(newSecret.hp);
                 setEnemyAnimState('idle');
                 addLog(`[PERIGO]: Anomalia detectada. ${newSecret.name} surgiu!`, 'info');
            } else {
                 addLog('[SISTEMA]: Zona Limpa.', 'info');
                 setTimeout(() => onLeave(), 2000);
            }
        } else {
            addLog('[SISTEMA]: Portal Secreto Limpo.', 'info');
            setTimeout(() => onLeave(), 2000);
        }
    };

    const triggerHurtAnim = () => {
        setEnemyAnimState('hurt');
        setTimeout(() => {
            if (enemyHp > 0) setEnemyAnimState('idle');
        }, 300);
    };

    const handleAttack = () => {
        if (enemyHp <= 0 || gameState.currentHp <= 0) return;
        
        let dmg = Math.max(1, combatStats.attack - enemy.defense);
        triggerHurtAnim();
        setEnemyHp(prev => {
            const next = prev - dmg;
            if (next <= 0) setTimeout(handleDefeatEnemy, 100);
            return next;
        });
        addLog(`Você desferiu um ataque de ${dmg} dano.`, 'info');
    };

    const handleSkill = () => {
         if (!gameState.playerClass) {
             addLog("[SISTEMA]: Classe requerida para ativar Habilidade.", "dmg");
             return;
         }
         
         const skill = gameState.playerClass.baseSkill;
         let canUse = true;

         if (skill.cost) {
             if (skill.cost.type === 'mana' && gameState.currentMana < skill.cost.amount) canUse = false;
             if (skill.cost.type === 'energy' && gameState.currentEnergy < skill.cost.amount) canUse = false;
             if (skill.cost.type === 'both' && (gameState.currentMana < skill.cost.amount || gameState.currentEnergy < skill.cost.amount)) canUse = false;
         }
         
         if (!canUse) {
             addLog("[SISTEMA]: Mana/Energia insuficientes.", "dmg");
             return;
         }

         if (skill.cost) {
             if (skill.cost.type === 'mana' || skill.cost.type === 'both') dispatch({ type: 'SPEND_MANA', amount: skill.cost.amount });
             if (skill.cost.type === 'energy' || skill.cost.type === 'both') dispatch({ type: 'SPEND_ENERGY', amount: skill.cost.amount });
         }

         let baseDmg = gameState.playerClass.damageType === 'magical' ? combatStats.magicAttack : 
                       gameState.playerClass.damageType === 'physical' ? combatStats.attack : 
                       (combatStats.attack + combatStats.magicAttack);
                       
         let dmg = Math.max(1, Math.floor(baseDmg * (skill.multiplier || 1)) - enemy.defense);
         
         triggerHurtAnim();
         setEnemyHp(prev => {
            const next = prev - dmg;
            if (next <= 0) setTimeout(handleDefeatEnemy, 100);
            return next;
         });
         addLog(`[HABILIDADE] ${skill.name} obliterou o alvo por ${dmg} dano!`, 'info');
    }

    const hpPercent = Math.max(0, (gameState.currentHp / combatStats.maxHp) * 100);
    const enemyHpPercent = Math.max(0, (enemyHp / enemy.maxHp) * 100);

    return (
        <div className={`h-[100dvh] w-full flex flex-col font-sans text-white transition-colors duration-1000 items-center justify-between p-4 relative z-0
            ${portalIsRed ? 'bg-[#1a0505]' : 'bg-[#010915]'}`}>
             
             {/* Background Effects */}
             <div className={`absolute inset-0 z-[-1] pointer-events-none opacity-40`} style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'40\\' height=\\'40\\' viewBox=\\'0 0 40 40\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'%23133667\\' fill-opacity=\\'0.4\\' fill-rule=\\'evenodd\\'%3E%3Cpath d=\\'M0 40L40 0H20L0 20M40 40V20L20 40\\'/%3E%3C/g%3E%3C/svg%3E')"}}></div>
             <div className={`absolute inset-0 z-[-1] pointer-events-none bg-gradient-to-b from-transparent ${portalIsRed ? 'to-[#ef4444]/20' : 'to-[#03dbfc]/20'} opacity-50`}></div>

             {/* Header */}
             <div className="w-full max-w-5xl z-10 flex justify-between items-center shrink-0 border-b border-[#004080] pb-2">
                  <div className={`text-2xl font-black uppercase tracking-widest ${portalIsRed ? 'text-[#ef4444] drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'text-[#03dbfc] drop-shadow-[0_0_10px_rgba(3,219,252,0.8)]'}`}>
                      {portalIsRed ? 'PORTAL VERMELHO' : 'MASMORRA'}
                  </div>
                  <button onClick={onLeave} className="px-6 py-2 border border-[#03dbfc]/50 bg-[#001732]/80 text-[#03dbfc] text-xs uppercase font-bold active:scale-95 skew-x-[-12deg] group">
                      <span className="block skew-x-[12deg] group-hover:text-white transition-colors">Extracação Forçada</span>
                  </button>
             </div>
             
             {/* Battle Arena */}
             <div className="flex-grow w-full max-w-5xl flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-16 z-10 shrink-0">
                  
                  {/* Player Status */}
                  <div className="w-full sm:w-[40%] order-3 sm:order-1 flex flex-col justify-end h-full">
                       <div className="text-xs text-[#03dbfc]/70 font-bold mb-1 uppercase hidden sm:block text-left tracking-widest">Caçador [Rank {gameState.rank}]</div>
                       
                       <div className="w-full h-5 sm:h-6 bg-[#001c3d] border border-[#004080] relative mb-2 overflow-hidden shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                            <div className="h-full bg-gradient-to-r from-green-700 to-green-500 transition-all duration-300 relative" style={{ width: `${hpPercent}%` }}>
                                 <div className="absolute top-0 right-0 w-2 h-full bg-white/50 blur-[2px]"></div>
                            </div>
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,1)] tracking-widest">HP {Math.floor(gameState.currentHp)}/{combatStats.maxHp}</span>
                       </div>
                       
                       <div className="flex gap-2 w-full">
                           <div className="flex-1 h-3 sm:h-4 bg-[#001c3d] border border-[#004080] relative overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-blue-700 to-blue-400 transition-all duration-300" style={{ width: `${(gameState.currentMana / combatStats.maxMana) * 100}%` }}></div>
                           </div>
                           <div className="flex-1 h-3 sm:h-4 bg-[#001c3d] border border-[#004080] relative overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-yellow-700 to-yellow-400 transition-all duration-300" style={{ width: `${(gameState.currentEnergy / combatStats.maxEnergy) * 100}%` }}></div>
                           </div>
                       </div>
                  </div>

                  <div className={`text-4xl sm:text-5xl font-black italic order-2 hidden sm:block ${portalIsRed ? 'text-red-500/50' : 'text-[#03dbfc]/30'}`}>VS</div>

                  {/* Enemy Area */}
                  <div className="w-full sm:w-[40%] order-1 sm:order-3 flex flex-col items-center sm:items-center relative">
                       <div className="text-center sm:text-center w-full absolute -top-12">
                           <div className={`text-xl sm:text-2xl font-black uppercase tracking-wider truncate drop-shadow-[0_0_8px_rgba(0,0,0,0.8)] 
                               ${enemy.isSecret ? 'text-purple-400' : enemy.isBoss ? 'text-orange-400' : 'text-red-500'}`}>
                               {enemy.name}
                           </div>
                           <div className="text-[10px] text-white/50 uppercase tracking-widest font-bold">LV. {effectiveRank} {enemy.isBoss ? '| CHEFE' : ''} {enemy.isSecret ? '| ANOMALIA' : ''}</div>
                       </div>
                       
                       <div className={`w-32 h-32 sm:w-48 sm:h-48 relative transition-all duration-300
                           ${enemyAnimState === 'attack' ? 'scale-110 mb-4' : enemyAnimState === 'hurt' ? 'scale-95 brightness-200' : 'scale-100'}
                       `}>
                           <MonsterCanvas isSecret={enemy.isSecret || false} isBoss={enemy.isBoss || false} state={enemyAnimState} />
                       </div>
                       
                       <div className="w-full max-w-[200px] h-3 sm:h-4 bg-[#001c3d] border border-[#004080] relative mt-6 overflow-hidden">
                            <div className={`h-full transition-all duration-300 bg-gradient-to-r
                                ${enemy.isSecret ? 'from-purple-800 to-purple-500' : enemy.isBoss ? 'from-orange-700 to-orange-400' : 'from-red-800 to-red-500'}`} 
                                style={{ width: `${enemyHpPercent}%` }}>
                                <div className="absolute top-0 right-0 w-2 h-full bg-white/50 blur-[2px]"></div>
                            </div>
                       </div>
                  </div>
             </div>

             {/* Action UI */}
             <div className="w-full max-w-5xl flex gap-4 mt-2 h-[120px] shrink-0 mb-4">
                  <div className="flex-1 bg-[#001732]/80 backdrop-blur-md border border-[#004080] p-3 overflow-y-auto custom-scrollbar flex flex-col-reverse justify-start text-[10px] sm:text-xs shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] font-mono">
                      {[...logs].reverse().map(l => (
                          <div key={l.id} className={`leading-relaxed tracking-wide
                              ${l.type === 'reward' ? 'text-yellow-400 drop-shadow-[0_0_2px_rgba(250,204,21,0.5)] font-bold' 
                              : l.type === 'dmg' ? 'text-red-400 font-bold' 
                              : 'text-[#03dbfc]/80'}`}>
                              {l.text}
                          </div>
                      ))}
                  </div>

                  <div className="w-[120px] sm:w-[250px] grid grid-rows-2 gap-2 shrink-0">
                      <button 
                        onClick={handleAttack}
                        className="bg-[#001c3d] border border-[#03dbfc]/50 font-black uppercase text-[#03dbfc] tracking-widest active:scale-95 hover:bg-[#03dbfc] hover:text-[#010915] text-[10px] sm:text-sm skew-x-[-8deg] relative overflow-hidden group">
                        <span className="block transform skew-x-[8deg] transition-all group-hover:scale-110">ATACAR</span>
                      </button>
                      <button 
                        onClick={handleSkill}
                        className={`border font-black uppercase active:scale-95 text-[10px] sm:text-xs overflow-hidden text-ellipsis px-1 skew-x-[-8deg] relative group transition-all
                        ${gameState.playerClass ? 'bg-[#2a0b4d] border-purple-500 text-purple-300 hover:bg-purple-600 hover:text-white hover:shadow-[0_0_15px_rgba(168,85,247,0.8)]' : 'bg-[#010915] border-gray-700/50 text-gray-700'}`}>
                        <span className="block transform skew-x-[8deg] whitespace-nowrap px-2">
                             {gameState.playerClass ? gameState.playerClass.baseSkill.name : 'SEM CLASSE'}
                        </span>
                      </button>
                  </div>
             </div>
        </div>
    )
}
