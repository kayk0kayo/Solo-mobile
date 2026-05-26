import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../GameContext';
import { Monster, Rank } from '../types';
import { generateMonster, getNextRank } from '../lib/gameData';

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
                ctx.fillStyle = isSecret ? '#a855f7' : isBoss ? '#f97316' : portalIsRed ? '#991b1b' : '#03dbfc';
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
            className={`w-full h-full object-contain filter ${portalIsRed ? 'drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]' : 'drop-shadow-[0_0_15px_rgba(3,219,252,0.4)]'}`}
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
                 addLog(`A escuridão tomou conta. Iniciando fogueira de ressurreição...`, 'dmg');
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
        
        addLog(`+ ${xpGained} EXP | + ${goldGained} Ouro | + ${crystalGained} Cristal`, 'reward');

        if (enemy.classPointReward) {
            let cp = enemy.classPointReward;
            if (gameState.upgrades['upg_classpts']) cp *= (1 + gameState.upgrades['upg_classpts'] * 0.1);
            dispatch({ type: 'ADD_CLASS_POINTS', amount: Math.floor(cp) });
            addLog(`+ ${Math.floor(cp)} Essência de Classe obtida.`, 'reward');
        }

        if (battleStage === 'normal') {
            setBattleStage('boss');
            const newBoss = generateMonster(effectiveRank, 'boss', portalIsRed);
            setEnemy(newBoss);
            setEnemyHp(newBoss.hp);
            setEnemyAnimState('idle');
            addLog(`Um rugido ecoa. ${newBoss.name} quebra as pedras e surge!`, 'info');
        } else if (battleStage === 'boss') {
            const baseSecretChance = portalIsRed ? 0.3 : 0.05;
            if (Math.random() < baseSecretChance + secretChance) {
                 setBattleStage('secret');
                 const newSecret = generateMonster(effectiveRank, 'secret', portalIsRed);
                 setEnemy(newSecret);
                 setEnemyHp(newSecret.hp);
                 setEnemyAnimState('idle');
                 addLog(`Uma fenda oculta se abriu. ${newSecret.name} emergiu do abismo!`, 'info');
            } else {
                 addLog('A área está limpa. Retornando em segurança.', 'info');
                 setTimeout(() => onLeave(), 2000);
            }
        } else {
            addLog('Área oculta pacificada. Retornando.', 'info');
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
        addLog(`Corte severo! ${dmg} dano.`, 'info');
    };

    const handleSkill = () => {
         if (!gameState.playerClass) {
             addLog("Requer uma Classe para foca habilidade.", "dmg");
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
             addLog("Mana ou Vigor insuficientes para esta técnica.", "dmg");
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
         addLog(`A técnica [${skill.name}] esmagou o alvo causando ${dmg} dano!`, 'info');
    }

    const hpPercent = Math.max(0, (gameState.currentHp / combatStats.maxHp) * 100);
    const enemyHpPercent = Math.max(0, (enemyHp / enemy.maxHp) * 100);

    // Theme Variables - Rustic Dungeon RPG Style (Pixel Art Version)
    const frameBg = portalIsRed ? 'bg-[#210]' : 'bg-[#111]';
    const frameBorder = portalIsRed ? 'border-red-900 border-4' : 'border-gray-600 border-4';
    const textTitleColor = portalIsRed ? 'text-red-500' : 'text-white';
    const textSubtitleColor = portalIsRed ? 'text-red-400' : 'text-gray-400';
    
    // Heavy Button Styles
    const heavyButtonClasses = `transition-none active:translate-y-1 pixel-box font-bold uppercase text-center flex items-center justify-center border-4 h-full`;

    return (
        <div className="h-full flex flex-col items-center justify-between p-2 sm:p-4 max-w-5xl mx-auto w-full relative z-0 overflow-hidden text-gray-200 font-mono">
             
             {/* Deep Cavern Environment */}
             {/* Base Darkness */}
             <div className="absolute inset-0 z-[-5] bg-[#050505] pointer-events-none"></div>

             {/* Cavern Rock Texture with SVG Noise Filter */}
             <div className="absolute inset-0 z-[-4] opacity-20 mix-blend-overlay pointer-events-none filter contrast-150 grayscale" 
                  style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}>
             </div>

             {/* Ambient Light & Depth (Tunnel Effect) */}
             <div className={`absolute inset-0 z-[-3] pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,1)]
                 ${portalIsRed ? 'bg-[radial-gradient(ellipse_at_center,transparent_10%,#200000_70%,#000_100%)]' : 'bg-[radial-gradient(ellipse_at_center,transparent_20%,#000a14_70%,#000_100%)]'}`}>
             </div>

             {/* Stalactites (Ceiling Rock Formations) */}
             <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none z-[-2] opacity-90 drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]">
                 <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className={`w-full h-24 sm:h-32 ${portalIsRed ? 'fill-[#1a0505]' : 'fill-[#050b14]'}`}>
                     <path d="M0,0 L0,40 Q30,120 60,30 T150,80 T250,20 T350,110 T450,30 T550,120 T650,20 T750,90 T850,30 T950,100 T1000,40 L1000,0 Z" />
                 </svg>
                 <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className={`w-full h-16 sm:h-24 absolute top-0 left-0 ${portalIsRed ? 'fill-[#0a0000]' : 'fill-[#02050a]'}`}>
                     <path d="M0,0 L0,60 Q40,110 80,40 T200,80 T300,50 T400,120 T500,40 T600,110 T700,50 T800,100 T900,40 T1000,60 L1000,0 Z" />
                 </svg>
             </div>

             {/* Left & Right Cave Tunnel Walls */}
             <div className="absolute top-0 left-0 w-16 sm:w-24 md:w-32 h-full z-[-2] opacity-90 pointer-events-none drop-shadow-[10px_0_10px_rgba(0,0,0,0.8)]">
                 <svg viewBox="0 0 100 1000" preserveAspectRatio="none" className={`w-full h-full ${portalIsRed ? 'fill-[#110000]' : 'fill-[#030810]'}`}>
                     <path d="M0,0 L100,0 L85,100 L110,250 L60,350 L95,500 L50,650 L100,800 L40,900 L80,1000 L0,1000 Z" />
                 </svg>
             </div>
             <div className="absolute top-0 right-0 w-16 sm:w-24 md:w-32 h-full z-[-2] opacity-90 pointer-events-none drop-shadow-[-10px_0_10px_rgba(0,0,0,0.8)]">
                 <svg viewBox="0 0 100 1000" preserveAspectRatio="none" className={`w-full h-full ${portalIsRed ? 'fill-[#110000]' : 'fill-[#030810]'}`}>
                     <path d="M100,0 L0,0 L15,100 L-10,250 L40,350 L5,500 L50,650 L0,800 L60,900 L20,1000 L100,1000 Z" />
                 </svg>
             </div>

             {/* Floor Rocky Ground */}
             <div className={`absolute bottom-[-5%] left-0 w-full h-[30%] z-[-2]
                 ${portalIsRed 
                     ? 'bg-gradient-to-t from-[#110000] to-transparent border-t-[4px] border-[#3a0a0a]/50' 
                     : 'bg-gradient-to-t from-[#00050a] to-transparent border-t-[4px] border-[#102030]/50'}`}>
             </div>
             
             {/* Floor Stalagmites Frame */}
             <div className="absolute bottom-[20%] left-0 w-full overflow-hidden pointer-events-none z-[-3] opacity-80 drop-shadow-[0_-5px_10px_rgba(0,0,0,0.8)]">
                 <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className={`w-full h-24 sm:h-36 ${portalIsRed ? 'fill-[#150202]' : 'fill-[#050a12]'}`}>
                     <path d="M0,100 L0,50 Q40,10 80,70 T200,20 T320,60 T450,10 T550,80 T650,20 T780,90 T900,30 T1000,50 L1000,100 Z" />
                 </svg>
             </div>

             {/* Magical Lights / Fog / Crystals */}
             {portalIsRed ? (
                 <>
                    {/* Aggressive Red Fog Effect */}
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#ff0000]/10 to-transparent pointer-events-none z-[-1] mix-blend-screen opacity-60"></div>
                    {/* Pulsing Anomaly Source */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-red-600/10 blur-[80px] animate-pulse pointer-events-none z-[-1]"></div>
                 </>
             ) : (
                 <>
                    {/* Mystical Blue Fog Effect */}
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#03dbfc]/10 to-transparent pointer-events-none z-[-1] mix-blend-screen opacity-60"></div>
                    {/* Glowing Mana Crystals */}
                    <div className="absolute bottom-1/4 right-[5%] sm:right-1/4 w-[30vw] h-[30vw] bg-purple-700/20 rounded-full blur-[80px] pointer-events-none z-[-1]"></div>
                    <div className="absolute top-1/3 left-[5%] sm:left-[15%] w-[40vw] h-[40vw] bg-[#03dbfc]/10 rounded-full blur-[90px] pointer-events-none z-[-1]"></div>
                 </>
             )}

             {/* Header Stone Panel */}
             <div className={`w-full z-10 flex justify-between items-center shrink-0 p-3 mb-2 pixel-box ${portalIsRed ? 'bg-[#210] border-4 border-red-900' : 'bg-[#111] border-4 border-white'}`}>
                 <div className="flex flex-col">
                     <h1 className={`text-sm sm:text-lg font-black tracking-widest uppercase items-center gap-2 drop-shadow-[2px_2px_0_rgba(0,0,0,1)] ${textTitleColor}`}>
                         {portalIsRed ? 'DOMÍNIO DE SANGUE' : 'MASMORRA ESQUECIDA'}
                     </h1>
                     <div className={`text-[9px] sm:text-[10px] tracking-wide uppercase font-bold mt-0.5 ${textSubtitleColor}`}>
                         Área Isolada - Nenhum Retorno Falso
                     </div>
                 </div>
                 <button 
                    onClick={onLeave} 
                    className={`px-4 sm:px-6 py-2 sm:py-3 text-[10px] sm:text-xs z-20
                     ${heavyButtonClasses}
                     ${portalIsRed 
                         ? 'border-red-600 bg-black text-red-500 hover:bg-red-900 hover:text-white' 
                         : 'border-white bg-black text-white hover:bg-white hover:text-black'}`}>
                     Recuar
                 </button>
             </div>
             
             {/* Enemy Altar / Pedestal Block */}
             <div className={`w-full max-w-sm sm:max-w-md flex flex-col items-center p-6 mt-auto mb-auto relative pixel-box
                 ${frameBg} ${frameBorder}`}>
                     
                 {/* Decorative rustic corners (iron bolts) */}
                 <div className="absolute top-2 left-2 w-2.5 h-2.5 bg-black"></div>
                 <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-black"></div>
                 <div className="absolute bottom-2 left-2 w-2.5 h-2.5 bg-black"></div>
                 <div className="absolute bottom-2 right-2 w-2.5 h-2.5 bg-black"></div>

                 <div className={`text-center font-black text-lg sm:text-2xl uppercase tracking-widest drop-shadow-[2px_2px_0_rgba(0,0,0,1)] ${textTitleColor}`}>
                     {enemy.name}
                 </div>
                 <div className={`text-[10px] sm:text-xs uppercase tracking-widest mt-1 mb-2 font-bold ${textSubtitleColor}`}>
                     Nível {effectiveRank} {enemy.isBoss ? '| LÍDER' : ''} {enemy.isSecret ? '| ABERRAÇÃO' : ''}
                 </div>
                 
                 <div className={`w-40 h-40 sm:w-56 sm:h-56 relative transition-transform duration-300 my-2
                     ${enemyAnimState === 'attack' ? 'scale-110 mb-4' : enemyAnimState === 'hurt' ? 'scale-95 brightness-150' : 'scale-100'}
                 `}>
                     <MonsterCanvas isSecret={enemy.isSecret || false} isBoss={enemy.isBoss || false} state={enemyAnimState} portalIsRed={portalIsRed} />
                 </div>

                 {/* Enemy Heavy HP Bar */}
                 <div className="w-full mt-4 max-w-[280px]">
                     <div className={`h-6 bg-black border-4 w-full relative overflow-hidden pixel-box ${portalIsRed ? 'border-red-900' : 'border-gray-600'}`}>
                         <div className={`h-full transition-none bg-red-600`} style={{ width: `${enemyHpPercent}%` }}></div>
                         <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-[2px_2px_0_rgba(0,0,0,1)] tracking-widest">
                             {Math.floor(enemyHp)} / {enemy.maxHp}
                         </span>
                     </div>
                 </div>
             </div>

             {/* Bottom UI Block (Stats + Logs + Actions) - Stone Slabs */}
             <div className="w-full z-10 flex flex-col lg:flex-row gap-4 h-auto lg:h-[200px] shrink-0 mt-4">
                  
                  {/* Logs Panel */}
                  <div className={`flex-1 p-4 flex flex-col-reverse justify-start overflow-y-auto custom-scrollbar pixel-box font-sans
                      ${frameBg} ${frameBorder}`}>
                      <h3 className={`text-xs font-black uppercase border-b-4 pb-2 mb-2 tracking-wider flex items-center gap-2 sticky top-0 bg-black z-10 font-mono
                          ${textTitleColor} ${portalIsRed ? 'border-red-900' : 'border-gray-600'}`}>
                           Percepção de Combate
                      </h3>
                      {[...logs].reverse().map(l => (
                          <div key={l.id} className={`text-[10px] sm:text-xs mb-1.5 tracking-wide font-medium
                              ${l.type === 'reward' ? 'text-yellow-400 font-bold drop-shadow-[2px_2px_0_rgba(0,0,0,1)]' 
                              : l.type === 'dmg' ? 'text-red-500 font-bold' 
                              : (portalIsRed ? 'text-red-300' : 'text-white')}`}>
                              {l.text}
                          </div>
                      ))}
                  </div>

                  {/* Player Stats & Actions Container */}
                  <div className={`w-full lg:w-[350px] flex flex-col gap-3 shrink-0 p-4 pixel-box
                      ${frameBg} ${frameBorder}`}>
                      
                      <h3 className={`text-xs font-black uppercase border-b-4 pb-2 tracking-wider flex items-center gap-2
                          ${textTitleColor} ${portalIsRed ? 'border-red-900' : 'border-gray-600'}`}>
                          Corpo do Caçador
                      </h3>

                      <div className="space-y-3 mt-1">
                          {/* HP Heavy Bar */}
                          <div>
                              <div className={`h-6 bg-black border-4 w-full relative overflow-hidden pixel-box ${portalIsRed ? 'border-red-900' : 'border-gray-600'}`}>
                                  <div className="h-full transition-none bg-green-500" style={{ width: `${hpPercent}%` }}></div>
                                  <span className="absolute inset-0 flex items-center justify-between px-3 text-[10px] font-bold text-white drop-shadow-[2px_2px_0_rgba(0,0,0,1)] tracking-widest">
                                      <span>VITALIDADE</span>
                                      <span>{Math.floor(gameState.currentHp)}/{combatStats.maxHp}</span>
                                  </span>
                              </div>
                          </div>

                          {/* Mana & Energy Heavy Bars */}
                          <div className="flex gap-4">
                              <div className="flex-1">
                                  <div className={`h-5 bg-black border-2 w-full relative overflow-hidden pixel-box ${portalIsRed ? 'border-red-900' : 'border-gray-600'}`}>
                                      <div className="h-full bg-blue-500 transition-none" style={{ width: `${(gameState.currentMana / combatStats.maxMana) * 100}%` }}></div>
                                      <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white drop-shadow-[2px_2px_0_rgba(0,0,0,1)] tracking-widest">
                                          MANA {Math.floor(gameState.currentMana)}
                                      </span>
                                  </div>
                              </div>
                              <div className="flex-1">
                                  <div className={`h-5 bg-black border-2 w-full relative overflow-hidden pixel-box ${portalIsRed ? 'border-red-900' : 'border-gray-600'}`}>
                                      <div className="h-full bg-yellow-500 transition-none" style={{ width: `${(gameState.currentEnergy / combatStats.maxEnergy) * 100}%` }}></div>
                                      <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white drop-shadow-[2px_2px_0_rgba(0,0,0,1)] tracking-widest">
                                          VIGOR {Math.floor(gameState.currentEnergy)}
                                      </span>
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* Action Slabs */}
                      <div className="flex gap-3 mt-auto min-h-[45px]">
                          <button 
                              onClick={handleAttack}
                              className={`flex-1 py-1 px-1 ${heavyButtonClasses}
                              ${portalIsRed 
                                  ? 'border-red-600 bg-black text-red-500 hover:bg-red-500 hover:text-white' 
                                  : 'border-white bg-black text-white hover:bg-white hover:text-black'}`}>
                              Golpe Básico
                          </button>
                          <button 
                              onClick={handleSkill}
                              className={`flex-1 py-1 px-1 ${heavyButtonClasses} text-[10px]
                              ${gameState.playerClass 
                                  ? 'border-purple-500 bg-black text-purple-400 hover:bg-purple-500 hover:text-white' 
                                  : (portalIsRed
                                      ? 'bg-black border-red-900 text-red-900 opacity-50'
                                      : 'bg-black border-gray-600 text-gray-600 opacity-50')}`}>
                              <span className="w-full truncate px-1">
                                  {gameState.playerClass ? gameState.playerClass.baseSkill.name : 'Sem Classe'}
                              </span>
                          </button>
                      </div>
                  </div>
              </div>
         </div>
    )
}
