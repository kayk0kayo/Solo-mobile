import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../GameContext';
import { Monster, Rank } from '../types';
import { generateMonster, getNextRank } from '../lib/gameData';
import { Sword, Zap } from 'lucide-react';

interface BattleProps {
    enemy: Monster;
    portalIsRed: boolean;
    onLeave: () => void;
}

const MonsterCanvas = ({ isSecret, isBoss, state, portalIsRed }: { isSecret: boolean, isBoss: boolean, state: 'idle' | 'hurt' | 'attack', portalIsRed: boolean }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const spriteRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        const image = new Image();
        image.src = `https://raw.githubusercontent.com/kayk0kayo/Solo-mobile/main/monster_placeholder.png`; 
        
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

        const spriteWidth = 160;
        const spriteHeight = 160;
        
        let frameX = 0;
        let frameY = 0; 

        if (state === 'idle') frameY = 0;
        else if (state === 'attack') frameY = 1;
        else if (state === 'hurt') frameY = 2;

        const maxFrames = 4; 

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
                ctx.fillStyle = isSecret ? '#7e22ce' : isBoss ? '#c2410c' : portalIsRed ? '#991b1b' : '#1e3a8a';
                ctx.globalAlpha = 0.6;
                ctx.beginPath();
                const bob = state === 'attack' ? -10 : state === 'hurt' ? 10 : Math.sin(timestamp/200) * 5;
                ctx.arc(canvas.width/2, canvas.height/2 + bob, canvas.width/3, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = state === 'hurt' ? '#000' : portalIsRed ? '#ff0000' : '#fff';
                ctx.globalAlpha = 1.0;
                ctx.beginPath();
                ctx.arc(canvas.width/2 - 15, canvas.height/2 + bob - 10, 5, 0, Math.PI * 2);
                ctx.arc(canvas.width/2 + 15, canvas.height/2 + bob - 10, 5, 0, Math.PI * 2);
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [state, isSecret, isBoss, portalIsRed]);

    return (
        <canvas 
            ref={canvasRef} 
            width={160} 
            height={160} 
            className={`w-full h-full object-contain filter ${portalIsRed ? 'drop-shadow-[0_0_15px_rgba(220,38,38,0.6)]' : 'drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]'}`}
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

    const systemWinClass = portalIsRed 
        ? "bg-[#0a0000]/80 backdrop-blur-md border border-red-900 shadow-[0_0_15px_rgba(153,27,27,0.3)]"
        : "bg-[#050b14]/80 backdrop-blur-md border border-[#1e3a8a] shadow-[0_0_15px_rgba(30,58,138,0.3)]";

    const systemTitleClass = portalIsRed
        ? "text-red-500 font-bold uppercase tracking-widest drop-shadow-[0_0_5px_rgba(239,68,68,0.8)] border-b border-red-900/50 pb-2 mb-2"
        : "text-blue-300 font-bold uppercase tracking-widest drop-shadow-[0_0_5px_rgba(147,197,253,0.8)] border-b border-blue-900/50 pb-2 mb-2";

    const systemBarBgClass = portalIsRed ? "bg-black border border-red-900/50" : "bg-[#010205] border border-blue-900/50";

    return (
        <div className={`h-[100dvh] w-full flex flex-col font-sans transition-colors duration-1000 items-center justify-between p-2 sm:p-4 md:px-8 relative z-0 overflow-hidden
            ${portalIsRed ? 'text-red-50' : 'text-slate-50'}`}>
             
             {/* Dungeon Atmosphere Layers */}
             <div className="absolute inset-0 z-[-3] bg-black"></div>
             {portalIsRed ? (
                 <>
                    {/* Deep red cavern vibe */}
                    <div className="absolute inset-0 z-[-2] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-950 via-[#1a0505] to-[#050000] opacity-90"></div>
                    {/* Pulsing anomaly effect */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vh] bg-red-600/10 blur-[150px] animate-pulse pointer-events-none z-[-1]"></div>
                 </>
             ) : (
                 <>
                    {/* Normal cavern vibe */}
                    <div className="absolute inset-0 z-[-2] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0f172a] via-[#020617] to-black opacity-90"></div>
                    {/* Mana crystals glow */}
                    <div className="absolute bottom-0 right-1/4 w-[50vw] h-[50vw] bg-cyan-800/10 rounded-full blur-[120px] pointer-events-none z-[-1]"></div>
                    <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-blue-800/10 rounded-full blur-[120px] pointer-events-none z-[-1]"></div>
                 </>
             )}
             
             {/* Stone/Grunge Texture overlay using CSS pattern */}
             <div className="absolute inset-0 z-[-1] opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 2px, transparent 2px)', backgroundSize: '64px 64px' }}></div>

             {/* Header System Notification */}
             <div className="w-full max-w-5xl z-10 flex justify-between items-start shrink-0 mt-2">
                 <div className={`inline-block px-6 py-2 border-y border-r rounded-r-sm backdrop-blur-md shadow-lg
                     ${portalIsRed ? 'border-red-600 bg-red-950/60 shadow-red-900/40' : 'border-[#1e3a8a] bg-[#050b14]/60 shadow-[0_0_15px_rgba(30,58,138,0.4)]'}`}>
                     <h1 className={`text-lg sm:text-xl font-bold tracking-[0.2em] uppercase ${portalIsRed ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'text-blue-300 drop-shadow-[0_0_8px_rgba(147,197,253,0.8)]'}`}>
                         {portalIsRed ? 'ZONA DE RISCO: PORTAL VERMELHO' : 'MASMORRA INSTANCIADA'}
                     </h1>
                     <div className={`text-[9px] tracking-widest uppercase mt-0.5 ${portalIsRed ? 'text-red-400' : 'text-cyan-400'}`}>
                         Sistema de Sobrevivência Ativo
                     </div>
                 </div>
                 
                 <button onClick={onLeave} className={`px-5 py-2 border rounded-sm font-bold uppercase text-xs tracking-widest transition-all active:scale-95 backdrop-blur-md shadow-lg
                     ${portalIsRed 
                         ? 'border-red-800 bg-red-950/50 text-red-300 hover:bg-red-900 hover:text-white hover:shadow-[0_0_10px_rgba(220,38,38,0.5)]' 
                         : 'border-slate-600 bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white hover:shadow-[0_0_10px_rgba(100,116,139,0.5)]'}`}>
                     Fugir
                 </button>
             </div>
             
             {/* Enemy Presentation Hologram */}
             <div className={`w-full max-w-sm sm:max-w-md flex flex-col items-center p-6 rounded-sm mt-auto mb-auto ${systemWinClass}`}>
                 {/* Hologram Corners */}
                 <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-inherit"></div>
                 <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-inherit"></div>
                 <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-inherit"></div>
                 <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-inherit"></div>

                 <div className={`text-center font-bold text-xl uppercase tracking-widest ${portalIsRed ? 'text-red-400 drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]' : 'text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]'}`}>
                     {enemy.name}
                 </div>
                 <div className={`text-[10px] uppercase tracking-widest mt-1 mb-4 ${portalIsRed ? 'text-red-500/70' : 'text-blue-300/70'}`}>
                     Level {effectiveRank} {enemy.isBoss ? '[BOSS]' : ''} {enemy.isSecret ? '[ANOMALIA]' : ''}
                 </div>
                 
                 <div className={`w-40 h-40 sm:w-56 sm:h-56 relative transition-all duration-300 my-2
                     ${enemyAnimState === 'attack' ? 'scale-110 mb-4' : enemyAnimState === 'hurt' ? 'scale-95 brightness-200' : 'scale-100'}
                 `}>
                     <MonsterCanvas isSecret={enemy.isSecret || false} isBoss={enemy.isBoss || false} state={enemyAnimState} portalIsRed={portalIsRed} />
                 </div>

                 {/* Enemy Boss/Normal HP Bar */}
                 <div className="w-full mt-4">
                     <div className={`w-full h-2 relative rounded-sm overflow-hidden ${systemBarBgClass}`}>
                         <div className={`h-full transition-all duration-300 ${portalIsRed ? 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`} style={{ width: `${enemyHpPercent}%` }}></div>
                     </div>
                     <div className={`text-center text-[10px] uppercase tracking-widest mt-1.5 font-bold ${portalIsRed ? 'text-red-400' : 'text-slate-400'}`}>
                         HP {Math.floor(enemyHp)} / {enemy.maxHp}
                     </div>
                 </div>
             </div>

             {/* Bottom UI Console */}
             <div className="w-full max-w-5xl z-10 flex flex-col sm:flex-row gap-4 h-auto sm:h-[180px] shrink-0 mt-4">
                  
                  {/* Logs Panel */}
                  <div className={`flex-1 p-3 rounded-sm flex flex-col-reverse justify-start overflow-y-auto custom-scrollbar font-sans text-[10px] sm:text-xs leading-relaxed ${systemWinClass}`}>
                      <h3 className={`${systemTitleClass} sticky top-0 bg-transparent z-10 font-mono`}>Registro do Sistema</h3>
                      {[...logs].reverse().map(l => (
                          <div key={l.id} className={`mb-1 tracking-wide font-medium
                              ${l.type === 'reward' ? 'text-yellow-400 font-bold drop-shadow-[0_0_2px_rgba(250,204,21,0.5)]' 
                              : l.type === 'dmg' ? (portalIsRed ? 'text-red-300 font-bold' : 'text-red-400 font-bold') 
                              : (portalIsRed ? 'text-red-100/70' : 'text-blue-100/80')}`}>
                              {l.text}
                          </div>
                      ))}
                  </div>

                  {/* State & Actions Container */}
                  <div className="w-full sm:w-[350px] flex flex-col gap-3 shrink-0">
                      
                      {/* Player Status Panel */}
                      <div className={`p-3 rounded-sm ${systemWinClass}`}>
                          <h3 className={`${systemTitleClass} font-mono`}>Status do Caçador</h3>
                          <div className="space-y-3 mt-2">
                              <div>
                                  <div className="flex justify-between text-[10px] font-bold uppercase mb-1 tracking-widest">
                                      <span className={portalIsRed ? 'text-red-300' : 'text-green-400'}>HP</span>
                                      <span className="text-white">{Math.floor(gameState.currentHp)} / {combatStats.maxHp}</span>
                                  </div>
                                  <div className={`w-full h-2 rounded-sm overflow-hidden ${systemBarBgClass}`}>
                                      <div className={`h-full transition-all duration-300 ${portalIsRed ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]'}`} style={{ width: `${hpPercent}%` }}></div>
                                  </div>
                              </div>
                              <div className="flex gap-4">
                                  <div className="flex-1">
                                      <div className={`text-[9px] font-bold uppercase mb-1 tracking-widest ${portalIsRed ? 'text-red-300/70' : 'text-blue-400'}`}>Mana</div>
                                      <div className={`w-full h-1.5 rounded-sm overflow-hidden ${systemBarBgClass}`}>
                                          <div className="h-full transition-all duration-300 bg-blue-500" style={{ width: `${(gameState.currentMana / combatStats.maxMana) * 100}%` }}></div>
                                      </div>
                                  </div>
                                  <div className="flex-1">
                                      <div className={`text-[9px] font-bold uppercase mb-1 tracking-widest ${portalIsRed ? 'text-red-300/70' : 'text-yellow-500'}`}>Vigor</div>
                                      <div className={`w-full h-1.5 rounded-sm overflow-hidden ${systemBarBgClass}`}>
                                          <div className="h-full transition-all duration-300 bg-yellow-500" style={{ width: `${(gameState.currentEnergy / combatStats.maxEnergy) * 100}%` }}></div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* Action Buttons Panel */}
                      <div className="flex gap-2 h-full min-h-[50px]">
                          <button 
                              onClick={handleAttack}
                              className={`flex-1 flex items-center justify-center gap-2 border rounded-sm font-bold uppercase transition-all active:scale-95 text-xs tracking-widest
                              ${portalIsRed 
                                  ? 'bg-red-950/80 border-red-700 text-red-200 hover:bg-red-900 hover:shadow-[0_0_15px_rgba(220,38,38,0.5)]' 
                                  : 'bg-slate-800/80 border-slate-600 text-slate-200 hover:bg-slate-700 hover:shadow-[0_0_15px_rgba(148,163,184,0.3)]'}`}>
                              <Sword size={16} className={portalIsRed ? "text-red-500" : "text-slate-400"} />
                              <span>Atacar</span>
                          </button>
                          <button 
                              onClick={handleSkill}
                              className={`flex-1 flex flex-col items-center justify-center gap-0.5 border rounded-sm font-bold uppercase transition-all active:scale-95 text-[10px] tracking-widest px-1
                              ${gameState.playerClass 
                                  ? (portalIsRed 
                                      ? 'bg-purple-950/80 border-purple-800 text-purple-200 hover:bg-purple-900 hover:shadow-[0_0_15px_rgba(147,51,234,0.5)]' 
                                      : 'bg-indigo-950/80 border-indigo-600 text-indigo-300 hover:bg-indigo-900 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]') 
                                  : (portalIsRed
                                      ? 'bg-red-950/40 border-red-900/50 text-red-900/50'
                                      : 'bg-black/40 border-slate-800 text-slate-600')}`}>
                              <div className="flex items-center gap-1">
                                  {gameState.playerClass && <Zap size={12} className={portalIsRed ? "text-purple-400" : "text-indigo-400"} />}
                                  <span className="w-full truncate text-center block">
                                      {gameState.playerClass ? gameState.playerClass.baseSkill.name : 'SEM CLASSE'}
                                  </span>
                              </div>
                          </button>
                      </div>
                  </div>
             </div>
        </div>
    )
}
