import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../GameContext';
import { Monster, Rank } from '../types';
import { generateMonster, getNextRank, ITEMS } from '../lib/gameData';
import { getIcon } from '../lib/itemIcons';
import { PixelImage } from './PixelImage';

import golemPedraIdle from '../assets/images/golem_pedra_idle_1780318614464.png';
import golemPedraAttack from '../assets/images/golem_pedra_attack_1780318638387.png';
import golemPedraDeath from '../assets/images/golem_pedra_death_1780318614464.png';
import giganteAcoIdle from '../assets/images/gigante_aco_idle_1780318657036.png';
import giganteAcoAttack from '../assets/images/gigante_aco_attack_1780318674639.png';
import giganteAcoDeath from '../assets/images/gigante_aco_death_1780318657036.png';
import golemJoiasIdle from '../assets/images/golem_joias_idle_1780318689252.png';
import golemJoiasAttack from '../assets/images/golem_joias_attack_1780318708000.png';
import golemJoiasDeath from '../assets/images/golem_joias_death_1780318689252.png';

import orcGuerreiroIdle from '../assets/images/orc_guerreiro_idle_1780318725584.png';
import orcGuerreiroAttack from '../assets/images/orc_guerreiro_attack_1780318741939.png';
import orcGuerreiroDeath from '../assets/images/orc_guerreiro_death_1780318725584.png';
import orqueSupremoIdle from '../assets/images/orque_supremo_idle_1780318760867.png';
import orqueSupremoAttack from '../assets/images/orque_supremo_attack_1780318777496.png';
import orqueSupremoDeath from '../assets/images/orque_supremo_death_1780318760867.png';
import assassinoSombrioIdle from '../assets/images/assassino_sombrio_idle_1780318793728.png';
import assassinoSombrioAttack from '../assets/images/assassino_sombrio_attack_1780318810121.png';
import assassinoSombrioDeath from '../assets/images/assassino_sombrio_death_1780318793728.png';

import espectroSuperiorIdle from '../assets/images/espectro_superior_idle_1780318827564.png';
import espectroSuperiorAttack from '../assets/images/espectro_superior_attack_1780318845628.png';
import espectroSuperiorDeath from '../assets/images/espectro_superior_death_1780318827564.png';
import arquimagoLichIdle from '../assets/images/arquimago_lich_idle_1780318862853.png';
import arquimagoLichAttack from '../assets/images/arquimago_lich_attack_1780318879583.png';
import arquimagoLichDeath from '../assets/images/arquimago_lich_death_1780318862853.png';
import anjoCaidoIdle from '../assets/images/anjo_caido_idle_1780318899017.png';
import anjoCaidoAttack from '../assets/images/anjo_caido_attack_1780318918232.png';
import anjoCaidoDeath from '../assets/images/anjo_caido_death_1780318899017.png';

import cavaleiroCaosIdle from '../assets/images/cavaleiro_caos_idle_1780318935174.png';
import cavaleiroCaosAttack from '../assets/images/cavaleiro_caos_attack_1780318954886.png';
import cavaleiroCaosDeath from '../assets/images/cavaleiro_caos_death_1780318935174.png';
import dragaoAntigoIdle from '../assets/images/dragao_antigo_idle_1780318972517.png';
import dragaoAntigoAttack from '../assets/images/dragao_antigo_attack_1780318990107.png';
import dragaoAntigoDeath from '../assets/images/dragao_antigo_death_1780318972517.png';
import fragmentoArquitetoIdle from '../assets/images/fragmento_arquiteto_idle_1780319007009.png';
import fragmentoArquitetoAttack from '../assets/images/fragmento_arquiteto_attack_1780319026408.png';
import fragmentoArquitetoDeath from '../assets/images/fragmento_arquiteto_death_1780319007009.png';

interface BattleProps {
    enemy: Monster;
    portalIsRed: boolean;
    onLeave: () => void;
    isTraining?: boolean;
}

const MonsterCanvas = ({ isSecret, isBoss, state, portalIsRed, enemyName }: { isSecret: boolean, isBoss: boolean, state: 'idle' | 'hurt' | 'attack' | 'dead', portalIsRed: boolean, enemyName: string }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const spriteRef = useRef<HTMLImageElement | null>(null);
    const [attackFrame, setAttackFrame] = useState(1);
    const [imgLoading, setImgLoading] = useState(false);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        setImgLoading(false);
        setImgError(false);
    }, [enemyName, state]);

    useEffect(() => {
        if (state === 'attack') {
            setAttackFrame(1);
            const intervalId = setInterval(() => {
                setAttackFrame(prev => prev === 1 ? 2 : 1);
            }, 200);
            return () => clearInterval(intervalId);
        }
    }, [state]);

    // If it's the specific goblin soldier or hobgoblin boss, use an img tag for full image/gif support.
    const isGoblin = enemyName === 'Goblin';
    const isHobgoblin = enemyName === 'Hobgoblin Chefe';
    const isHobgoblinEnfurecido = enemyName === 'Hobgoblin Enfurecido';
    const isLoboMagico = enemyName === 'Lobo Mágico';
    const isLoboAlfa = enemyName === 'Lobo Alfa Chifrudo';
    const isLoboEspiritual = enemyName === 'Lobo Espiritual';
    const isKoboltHologram = enemyName === 'Kobolt Holograma';
    
    let customImageSrc = null;
    if (isKoboltHologram) {
        if (state === 'dead') {
            customImageSrc = 'https://raw.githubusercontent.com/kayk0kayo/Solo-mobile/main/kobolt-holograma-morte.png';
        } else if (state === 'attack') {
            customImageSrc = 'https://raw.githubusercontent.com/kayk0kayo/Solo-mobile/main/kobolt-holograma-attack.png';
        } else {
            customImageSrc = 'https://raw.githubusercontent.com/kayk0kayo/Solo-mobile/main/kobolt-hologram.png';
        }
    } else if (isGoblin) {
        if (state === 'attack') {
            customImageSrc = attackFrame === 1 
                ? 'https://raw.githubusercontent.com/kayk0kayo/Solo-mobile/main/goblin%20attack.png'
                : 'https://raw.githubusercontent.com/kayk0kayo/Solo-mobile/main/goblin%20attack2.png';
        } else {
            customImageSrc = 'https://raw.githubusercontent.com/kayk0kayo/Solo-mobile/main/goblin%20idle.png';
        }
    } else if (isHobgoblin) {
        if (state === 'attack') {
             customImageSrc = 'https://raw.githubusercontent.com/kayk0kayo/Solo-mobile/main/Hobgoblin%20-%20attack.png';
        } else {
             customImageSrc = 'https://raw.githubusercontent.com/kayk0kayo/Solo-mobile/main/Hobgoblin%20-%20idle.png';
        }
    } else if (isHobgoblinEnfurecido) {
        if (state === 'attack') {
             customImageSrc = 'https://raw.githubusercontent.com/kayk0kayo/Solo-mobile/main/hobgoblin_secreto_attack.png';
        } else {
             customImageSrc = 'https://raw.githubusercontent.com/kayk0kayo/Solo-mobile/main/hobgoblin_secreto_idle.png';
        }
    } else if (isLoboMagico) {
        if (state === 'attack') {
             customImageSrc = 'https://raw.githubusercontent.com/kayk0kayo/Solo-mobile/main/lobo-attack.png';
        } else {
             customImageSrc = 'https://raw.githubusercontent.com/kayk0kayo/Solo-mobile/main/lobo-idle.png';
        }
    } else if (isLoboAlfa) {
        if (state === 'attack') {
            customImageSrc = attackFrame === 1 
                ? 'https://raw.githubusercontent.com/kayk0kayo/Solo-mobile/main/loboChifrudo-attack.png'
                : 'https://raw.githubusercontent.com/kayk0kayo/Solo-mobile/main/lobochifrudo2-attack.png';
        } else {
            customImageSrc = 'https://raw.githubusercontent.com/kayk0kayo/Solo-mobile/main/loboChifrudo-idle.png';
        }
    } else if (isLoboEspiritual) {
        if (state === 'attack') {
            customImageSrc = attackFrame === 1
                ? 'https://raw.githubusercontent.com/kayk0kayo/Solo-mobile/main/Lobo_Secreto_attack1.png'
                : 'https://raw.githubusercontent.com/kayk0kayo/Solo-mobile/main/Lobo_Secreto_attack2.png';
        } else {
            customImageSrc = 'https://raw.githubusercontent.com/kayk0kayo/Solo-mobile/main/Lobo_Secreto_idle.png';
        }
    } else if (enemyName === 'Golem de Pedra') {
        customImageSrc = state === 'dead' ? golemPedraDeath : (state === 'attack' ? golemPedraAttack : golemPedraIdle);
    } else if (enemyName === 'Gigante de Aço') {
        customImageSrc = state === 'dead' ? giganteAcoDeath : (state === 'attack' ? giganteAcoAttack : giganteAcoIdle);
    } else if (enemyName === 'Golem das Jóias') {
        customImageSrc = state === 'dead' ? golemJoiasDeath : (state === 'attack' ? golemJoiasAttack : golemJoiasIdle);
    } else if (enemyName === 'Orc Guerreiro') {
        customImageSrc = state === 'dead' ? orcGuerreiroDeath : (state === 'attack' ? orcGuerreiroAttack : orcGuerreiroIdle);
    } else if (enemyName === 'Orque Supremo') {
        customImageSrc = state === 'dead' ? orqueSupremoDeath : (state === 'attack' ? orqueSupremoAttack : orqueSupremoIdle);
    } else if (enemyName === 'Assassino Sombrio') {
        customImageSrc = state === 'dead' ? assassinoSombrioDeath : (state === 'attack' ? assassinoSombrioAttack : assassinoSombrioIdle);
    } else if (enemyName === 'Espectro Superior') {
        customImageSrc = state === 'dead' ? espectroSuperiorDeath : (state === 'attack' ? espectroSuperiorAttack : espectroSuperiorIdle);
    } else if (enemyName === 'Arquimago Lich') {
        customImageSrc = state === 'dead' ? arquimagoLichDeath : (state === 'attack' ? arquimagoLichAttack : arquimagoLichIdle);
    } else if (enemyName === 'Anjo Caído') {
        customImageSrc = state === 'dead' ? anjoCaidoDeath : (state === 'attack' ? anjoCaidoAttack : anjoCaidoIdle);
    } else if (enemyName === 'Cavaleiro do Caos') {
        customImageSrc = state === 'dead' ? cavaleiroCaosDeath : (state === 'attack' ? cavaleiroCaosAttack : cavaleiroCaosIdle);
    } else if (enemyName === 'Lorde Dragão Antigo') {
        customImageSrc = state === 'dead' ? dragaoAntigoDeath : (state === 'attack' ? dragaoAntigoAttack : dragaoAntigoIdle);
    } else if (enemyName === 'Fragmento do Arquiteto') {
        customImageSrc = state === 'dead' ? fragmentoArquitetoDeath : (state === 'attack' ? fragmentoArquitetoAttack : fragmentoArquitetoIdle);
    }

    useEffect(() => {
        if (customImageSrc) return; // Skip canvas logic if using custom img
        
        const image = new Image();
        image.src = `https://raw.githubusercontent.com/kayk0kayo/Solo-mobile/main/monster_placeholder.png`; 
        
        image.onload = () => {
            spriteRef.current = image;
        };
    }, [customImageSrc]);

    useEffect(() => {
        if (customImageSrc && !imgError) return;
        
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
    }, [state, isSecret, isBoss, portalIsRed, customImageSrc, imgError]);

    const shadowClass = portalIsRed ? 'drop-shadow-[2px_2px_0_rgba(255,0,0,1)]' : 'drop-shadow-[2px_2px_0_rgba(0,0,0,1)]';

    if (customImageSrc && !imgError) {
        return (
            <div className="relative w-full h-full flex items-center justify-center">
                <img 
                    src={customImageSrc} 
                    alt={enemyName}
                    onError={() => setImgError(true)}
                    style={{ imageRendering: 'pixelated' }}
                    className={`w-full h-full object-contain filter ${shadowClass} transition-all duration-150
                      ${state === 'attack' ? 'scale-110 -translate-y-2' : state === 'hurt' ? 'brightness-150 scale-95' : 'scale-100'}
                      opacity-100`}
                />
            </div>
        );
    }

    return (
        <canvas 
            ref={canvasRef} 
            width={160} 
            height={160} 
            className={`w-full h-full object-contain filter ${portalIsRed ? 'drop-shadow-[2px_2px_0_rgba(220,38,38,1)]' : 'drop-shadow-[2px_2px_0_rgba(255,255,255,0.4)]'}`}
        />
    );
};

export const Battle = ({ enemy: initialEnemy, portalIsRed, onLeave, isTraining }: BattleProps) => {
    const { state: gameState, dispatch, combatStats } = useGame();
    
    const [enemy, setEnemy] = useState<Monster>(initialEnemy);
    const [enemyHp, setEnemyHp] = useState(initialEnemy.hp);
    const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);
    
    const [battleStage, setBattleStage] = useState<'normal' | 'boss' | 'secret'>('normal');
    const [logs, setLogs] = useState<{ id: number, text: string, type: 'dmg' | 'heal' | 'info' | 'reward' | 'turn' }[]>([]);
    
    const [enemyAnimState, setEnemyAnimState] = useState<'idle' | 'hurt' | 'attack' | 'dead'>('idle');
    const [floaters, setFloaters] = useState<{ id: number, text: string, color: string }[]>([]);
    
    const effectiveRank = portalIsRed ? getNextRank(initialEnemy.rank) : initialEnemy.rank;

    const logId = useRef(0);
    const addLog = (text: string, type: 'dmg' | 'heal' | 'info' | 'reward' | 'turn' = 'info') => {
        setLogs(prev => [...prev.slice(-5), { id: logId.current++, text, type }]);
    };

    const enemyHpRef = useRef(enemyHp);
    const gameStateRef = useRef(gameState);
    useEffect(() => {
        enemyHpRef.current = enemyHp;
        gameStateRef.current = gameState;
    }, [enemyHp, gameState]);

    // Enemy Turn Logic
    useEffect(() => {
        if (!isPlayerTurn && enemyHp > 0 && gameState.currentHp > 0) {
            const timer = setTimeout(() => {
                let dmg = Math.max(1, enemy.damage - combatStats.defense);
                
                setEnemyAnimState('attack');
                
                setTimeout(() => {
                    if (enemyHp > 0 && gameState.currentHp > 0) {
                        dispatch({ type: 'TAKE_DAMAGE', amount: dmg });
                        addLog(`O ${enemy.name} desferiu um ataque de ${dmg} de dano!`, 'dmg');
                        
                        if (gameState.currentHp - dmg <= 0) {
                             dispatch({ type: 'DEATH' });
                             addLog(`A escuridão tomou conta. Iniciando fogueira de ressurreição...`, 'dmg');
                             setTimeout(() => onLeave(), 2500);
                        } else {
                             setIsPlayerTurn(true);
                             addLog(`--- SEU TURNO ---`, 'turn');
                        }
                    }
                }, 600);

                setTimeout(() => setEnemyAnimState(s => s === 'attack' ? 'idle' : s), 700);
            }, 1200);

            return () => clearTimeout(timer);
        }
    }, [isPlayerTurn, enemyHp, gameState.currentHp, combatStats.defense, enemy.damage, enemy.name, dispatch, onLeave]);

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
        if (crystalGained > 0) dispatch({ type: 'ADD_CRYSTALS', amount: crystalGained });
        
        const newFloaters = [
            { id: Date.now() + 1, text: `+ ${xpGained} EXP`, color: 'text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]' },
            { id: Date.now() + 2, text: `+ ${goldGained} Ouro`, color: 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]' }
        ];
        if (crystalGained > 0) {
            newFloaters.push({ id: Date.now() + 3, text: `+ ${crystalGained} Cristal`, color: 'text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]' });
        }
        
        let cp = 0;
        if (enemy.classPointReward) {
            cp = enemy.classPointReward;
            if (gameState.upgrades['upg_classpts']) cp *= (1 + gameState.upgrades['upg_classpts'] * 0.1);
            const finalCp = Math.floor(cp);
            dispatch({ type: 'ADD_CLASS_POINTS', amount: finalCp });
            addLog(`+ ${finalCp} Essência de Classe obtida.`, 'reward');
            newFloaters.push({ id: Date.now() + 4, text: `+ ${finalCp} Essência`, color: 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]' });
        }

        // Logic to drop potions
        const dropChance = 0.2; // 20% baseline chance to drop a consumable
        if (Math.random() < dropChance) {
            const possibleDrops = ITEMS.filter(i => i.type === 'consumable' && i.rank === effectiveRank);
            if (possibleDrops.length > 0) {
                const droppedItem = possibleDrops[Math.floor(Math.random() * possibleDrops.length)];
                dispatch({ type: 'OBTAIN_ITEM', item: droppedItem, itemType: 'consumables', amount: 1 });
                addLog(`Item encontrado: ${droppedItem.name}!`, 'reward');
                newFloaters.push({ id: Date.now() + 5, text: `+ ${droppedItem.name}`, color: 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]' });
            }
        }
        
        setFloaters(newFloaters);
        
        addLog(`+ ${xpGained} EXP | + ${goldGained} Ouro${crystalGained > 0 ? ` | + ${crystalGained} Cristal` : ''}`, 'reward');

        if (isTraining) {
            addLog('Treinamento concluído. Retornando ao teste...', 'info');
            setTimeout(() => onLeave(), 2000);
            return;
        }

        if (battleStage === 'normal') {
            setBattleStage('boss');
            const newBoss = generateMonster(effectiveRank, 'boss', portalIsRed);
            setEnemy(newBoss);
            setEnemyHp(newBoss.hp);
            setEnemyAnimState('idle');
            setIsPlayerTurn(true);
            addLog(`Um rugido ecoa. ${newBoss.name} quebra as pedras e surge!`, 'info');
        } else if (battleStage === 'boss') {
            const baseSecretChance = portalIsRed ? 0.3 : 0.05;
            if (Math.random() < baseSecretChance + secretChance) {
                 setBattleStage('secret');
                 const newSecret = generateMonster(effectiveRank, 'secret', portalIsRed);
                 setEnemy(newSecret);
                 setEnemyHp(newSecret.hp);
                 setEnemyAnimState('idle');
                 setIsPlayerTurn(true);
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

    const triggerHurtOrDeath = (dmg: number): boolean => {
        const nextHp = Math.max(0, enemyHp - Math.floor(dmg));
        if (nextHp <= 0) {
            setEnemyHp(nextHp);
            setEnemyAnimState('dead');
            // Allow animation to play fully before proceeding
            setTimeout(handleDefeatEnemy, 1500);
            return true;
        } else {
            setEnemyHp(nextHp);
            setEnemyAnimState(curr => curr === 'attack' ? 'attack' : 'hurt');
            setTimeout(() => {
                setEnemyAnimState(curr => curr === 'hurt' ? 'idle' : curr);
            }, 300);
            return false;
        }
    };

    const handleAttack = () => {
        if (!isPlayerTurn || enemyHp <= 0 || gameState.currentHp <= 0) return;
        
        let dmg = Math.max(1, combatStats.attack - enemy.defense);
        addLog(`Ataque Básico! ${Math.floor(dmg)} dano.`, 'info');
        const died = triggerHurtOrDeath(dmg);
        if (!died) setIsPlayerTurn(false);
    };

    const handleSkill = () => {
         if (!isPlayerTurn || enemyHp <= 0 || gameState.currentHp <= 0) return;
         if (!gameState.playerClass) {
             addLog("Requer uma Classe para usar habilidade.", "dmg");
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
         
         addLog(`Técnica [${skill.name}]: ${dmg} dano!`, 'info');
         const died = triggerHurtOrDeath(dmg);
         if (!died) setIsPlayerTurn(false);
    }

    const hpPercent = Math.max(0, (gameState.currentHp / combatStats.maxHp) * 100);
    const enemyHpPercent = Math.max(0, (enemyHp / enemy.maxHp) * 100);

    // Theme Variables - Rustic Dungeon RPG Style (Pixel Art Version)
    const frameBg = portalIsRed ? 'bg-[#210]' : 'bg-[#111]';
    const frameBorder = portalIsRed ? 'border-red-900 border-4' : 'border-gray-600 border-4';
    const textTitleColor = portalIsRed ? 'text-red-500' : 'text-white';
    const textSubtitleColor = portalIsRed ? 'text-red-400' : 'text-gray-400';
    
    // Heavy Button Styles
    const heavyButtonClasses = `transition-none active:translate-y-1 pixel-box font-bold uppercase text-center flex items-center justify-center border-4 h-full disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0`;

    const equippedPassives = gameState.equipped.passives.filter(p => p !== null);

    return (
        <div className="h-full flex flex-col items-center p-2 sm:p-4 max-w-7xl mx-auto w-full relative z-0 overflow-y-auto overflow-x-hidden custom-scrollbar text-gray-200 font-mono">
             
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
             <div className={`absolute bottom-[20%] left-0 w-full h-[30%] z-[-2]
                 ${portalIsRed 
                     ? 'bg-gradient-to-t from-[#110000] to-transparent border-t-[4px] border-[#3a0a0a]/50' 
                     : 'bg-gradient-to-t from-[#00050a] to-transparent border-t-[4px] border-[#102030]/50'}`}>
             </div>
             
             <div className="absolute bottom-[40%] left-0 w-full overflow-hidden pointer-events-none z-[-3] opacity-80 drop-shadow-[0_-5px_10px_rgba(0,0,0,0.8)]">
                 <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className={`w-full h-24 sm:h-36 ${portalIsRed ? 'fill-[#150202]' : 'fill-[#050a12]'}`}>
                     <path d="M0,100 L0,50 Q40,10 80,70 T200,20 T320,60 T450,10 T550,80 T650,20 T780,90 T900,30 T1000,50 L1000,100 Z" />
                 </svg>
             </div>

             {/* Magical Lights / Fog / Crystals */}
             {portalIsRed ? (
                 <>
                    {/* Aggressive Red Fog Effect */}
                    <div className="absolute top-[20%] left-0 w-full h-1/2 bg-gradient-to-t from-[#ff0000]/10 to-transparent pointer-events-none z-[-1] mix-blend-screen opacity-60"></div>
                    {/* Pulsing Anomaly Source */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-red-600/10 blur-[80px] animate-pulse pointer-events-none z-[-1]"></div>
                 </>
             ) : (
                 <>
                    {/* Mystical Blue Fog Effect */}
                    <div className="absolute top-[20%] left-0 w-full h-1/2 bg-gradient-to-t from-[#03dbfc]/10 to-transparent pointer-events-none z-[-1] mix-blend-screen opacity-60"></div>
                    {/* Glowing Mana Crystals */}
                    <div className="absolute bottom-1/2 right-[5%] sm:right-1/4 w-[30vw] h-[30vw] bg-purple-700/20 rounded-full blur-[80px] pointer-events-none z-[-1]"></div>
                    <div className="absolute top-1/3 left-[5%] sm:left-[15%] w-[40vw] h-[40vw] bg-[#03dbfc]/10 rounded-full blur-[90px] pointer-events-none z-[-1]"></div>
                 </>
             )}

             {/* Header Stone Panel */}
             <div className={`w-full z-10 flex justify-between items-center shrink-0 p-3 mb-2 pixel-box ${portalIsRed ? 'bg-[#210] border-4 border-red-900' : 'bg-[#111] border-4 border-white'}`}>
                 <div className="flex flex-col">
                     <h1 className={`text-sm sm:text-lg font-black tracking-widest uppercase items-center gap-2 drop-shadow-[2px_2px_0_rgba(0,0,0,1)] ${textTitleColor}`}>
                         {portalIsRed ? 'DOMÍNIO DE SANGUE' : 'MASMORRA ESQUECIDA'}
                     </h1>
                     <div className={`text-[9px] sm:text-[10px] tracking-wide uppercase font-bold mt-0.5 flex gap-4 ${textSubtitleColor}`}>
                         <span>Nenhum Retorno Falso</span>
                         <span className={`px-2 py-0.5 rounded-sm pixel-box border-2 ${isPlayerTurn ? 'bg-blue-900/50 text-blue-200 border-blue-500' : 'bg-red-900/50 text-red-200 border-red-500'}`}>
                             {isPlayerTurn ? 'SEU TURNO' : 'TURNO INIMIGO'}
                         </span>
                     </div>
                 </div>
                 <button 
                    onClick={onLeave} 
                    className={`px-4 sm:px-6 py-2 sm:py-3 text-[10px] sm:text-xs z-20 hover:scale-105 transition-transform
                     ${heavyButtonClasses}
                     ${portalIsRed 
                         ? 'border-red-600 bg-black text-red-500 hover:bg-red-900 hover:text-white' 
                         : 'border-white bg-black text-white hover:bg-white hover:text-black'}`}>
                     Recuar
                 </button>
             </div>
             
             {/* Enemy Area */}
             <div className="flex-1 w-full flex flex-col justify-center items-center py-2 sm:py-4 min-h-[150px]">
                 <div className={`w-full max-w-sm flex flex-col items-center p-4 sm:p-6 relative pixel-box shadow-xl
                     ${frameBg} ${frameBorder} ${!isPlayerTurn ? 'border-red-500 shadow-red-900/50' : ''}`}>
                         
                     {/* Decorative rustic corners */}
                     <div className="absolute top-2 left-2 w-2.5 h-2.5 bg-black"></div>
                     <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-black"></div>
                     <div className="absolute bottom-2 left-2 w-2.5 h-2.5 bg-black"></div>
                     <div className="absolute bottom-2 right-2 w-2.5 h-2.5 bg-black"></div>

                     <div className={`text-center font-black text-xl sm:text-2xl uppercase tracking-widest drop-shadow-[3px_3px_0_rgba(0,0,0,1)] ${textTitleColor}`}>
                         {enemy.name}
                     </div>
                     <div className={`text-[10px] sm:text-xs uppercase tracking-widest mt-1 mb-2 font-bold ${textSubtitleColor}`}>
                         Nível {effectiveRank} {enemy.isBoss ? '| LÍDER' : ''} {enemy.isSecret ? '| ABERRAÇÃO' : ''}
                     </div>
                     
                     {/* Floaters */}
                     {floaters.map((floater, idx) => (
                         <div 
                             key={floater.id} 
                             className={`absolute font-black text-xl sm:text-2xl uppercase tracking-widest z-50 animate-float-up pointer-events-none drop-shadow-[2px_2px_0_rgba(0,0,0,1)] ${floater.color}`}
                             style={{ left: '50%', top: '40%', transform: 'translate(-50%, -50%)', animationDelay: `${idx * 0.2}s` }}
                         >
                             {floater.text}
                         </div>
                     ))}
                     
                     <div className={`w-40 h-40 sm:w-48 sm:h-48 relative transition-transform duration-300 my-2
                         ${enemyAnimState === 'attack' ? 'scale-110 mb-4' : enemyAnimState === 'hurt' ? 'animate-intense-shake drop-shadow-[0_0_20px_rgba(255,0,0,0.8)]' : 'scale-100'}
                     `}>
                         <MonsterCanvas isSecret={enemy.isSecret || false} isBoss={enemy.isBoss || false} state={enemyAnimState} portalIsRed={portalIsRed} enemyName={enemy.name} />
                     </div>

                     {/* Enemy HP */}
                     <div className="w-full mt-4 max-w-[300px]">
                         <div className={`h-8 bg-black border-4 w-full relative overflow-hidden pixel-box ${portalIsRed ? 'border-red-900' : 'border-gray-600'}`}>
                             <div className={`h-full transition-none bg-red-600`} style={{ width: `${enemyHpPercent}%` }}></div>
                             <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow-[2px_2px_0_rgba(0,0,0,1)] tracking-widest">
                                 {Math.floor(enemyHp)} / {enemy.maxHp}
                             </span>
                         </div>
                     </div>
                 </div>
             </div>

             {/* Expanded Bottom UI Block (Stats + Actions + Logs) */}
             <div className="w-full z-10 grid grid-cols-1 gap-2 shrink-0 mt-auto pb-2 md:grid-cols-3">
                  
                  {/* Logs Panel - Col 1 */}
                  <div className={`col-span-1 md:col-span-1 p-3 flex flex-col-reverse justify-start overflow-hidden pixel-box font-sans
                      ${frameBg} ${frameBorder}`}>
                      <h3 className={`text-xs font-black uppercase border-b-4 pb-2 mb-2 tracking-wider flex items-center gap-2 sticky top-0 bg-black z-10 font-mono drop-shadow-[2px_2px_0_rgba(0,0,0,1)]
                          ${textTitleColor} ${portalIsRed ? 'border-red-900' : 'border-gray-600'}`}>
                           Percepção
                      </h3>
                      {[...logs].reverse().map(l => (
                          <div key={l.id} className={`text-[10px] sm:text-xs mb-1.5 tracking-wide font-medium
                              ${l.type === 'reward' ? 'text-yellow-400 font-bold drop-shadow-[2px_2px_0_rgba(0,0,0,1)]' 
                              : l.type === 'dmg' ? 'text-red-500 font-bold' 
                              : l.type === 'turn' ? 'text-blue-400 font-bold mt-2'
                              : (portalIsRed ? 'text-red-300' : 'text-gray-300')}`}>
                              {l.text}
                          </div>
                      ))}
                  </div>

                  {/* Player Stats Panel - Col 2 */}
                  <div className={`col-span-1 flex flex-col gap-2 p-3 pixel-box overflow-hidden
                      ${frameBg} ${frameBorder}`}>
                      
                      <h3 className={`text-xs font-black uppercase border-b-4 pb-2 tracking-wider flex items-center gap-2 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]
                          ${textTitleColor} ${portalIsRed ? 'border-red-900' : 'border-gray-600'}`}>
                          Corpo do Caçador
                      </h3>

                      <div className="space-y-4 mt-2">
                          <div>
                              <div className={`h-8 bg-black border-4 w-full relative overflow-hidden pixel-box ${portalIsRed ? 'border-red-900' : 'border-gray-600'}`}>
                                  <div className="h-full transition-none bg-gradient-to-r from-red-700 to-red-500" style={{ width: `${hpPercent}%` }}></div>
                                  <span className="absolute inset-0 flex items-center justify-between px-3 text-xs font-bold text-white drop-shadow-[2px_2px_0_rgba(0,0,0,1)] tracking-widest">
                                      <span>VITALIDADE</span>
                                      <span>{Math.floor(gameState.currentHp)}/{combatStats.maxHp}</span>
                                  </span>
                              </div>
                          </div>

                          <div className="flex gap-2">
                              <div className={`h-8 bg-black border-4 w-full relative overflow-hidden pixel-box ${portalIsRed ? 'border-red-900' : 'border-gray-600'}`}>
                                  <div className="h-full bg-gradient-to-r from-blue-700 to-blue-500 transition-none" style={{ width: `${(gameState.currentMana / combatStats.maxMana) * 100}%` }}></div>
                                  <span className="absolute inset-0 flex items-center justify-between px-2 text-[10px] font-bold text-white drop-shadow-[2px_2px_0_rgba(0,0,0,1)] tracking-widest">
                                      <span>MP</span>
                                      <span>{Math.floor(gameState.currentMana)}/{combatStats.maxMana}</span>
                                  </span>
                              </div>
                              <div className={`h-8 bg-black border-4 w-full relative overflow-hidden pixel-box ${portalIsRed ? 'border-red-900' : 'border-gray-600'}`}>
                                  <div className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-none" style={{ width: `${(gameState.currentEnergy / combatStats.maxEnergy) * 100}%` }}></div>
                                  <span className="absolute inset-0 flex items-center justify-between px-2 text-[10px] font-bold text-white drop-shadow-[2px_2px_0_rgba(0,0,0,1)] tracking-widest">
                                      <span>VG</span>
                                      <span>{Math.floor(gameState.currentEnergy)}/{combatStats.maxEnergy}</span>
                                  </span>
                              </div>
                          </div>
                          
                          {/* Buffs & Passives */}
                          {equippedPassives.length > 0 && (
                              <div className="mt-2 border-t-2 border-gray-700 pt-2">
                                  <div className="text-[10px] uppercase text-gray-500 font-bold mb-1">Efeitos Ativos (Passivas)</div>
                                  <div className="flex flex-wrap gap-2">
                                      {equippedPassives.map(p => (
                                          <div key={p!.id} className="text-[9px] bg-indigo-900/50 border border-indigo-500 text-indigo-200 px-2 py-1 rounded-sm pixel-box" title={p!.description}>
                                              {p!.name}
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          )}
                      </div>
                  </div>

                  {/* Actions & Skills Panel - Col 3 */}
                  <div className={`col-span-1 flex flex-col p-3 pixel-box overflow-hidden
                      ${frameBg} ${frameBorder} ${isPlayerTurn ? 'border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' : ''}`}>
                      
                      <h3 className={`text-xs font-black uppercase border-b-4 pb-2 tracking-wider flex items-center gap-2 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]
                          ${textTitleColor} ${portalIsRed ? 'border-red-900' : 'border-gray-600'}`}>
                          Opções de Combate
                      </h3>

                      <div className="flex-1 flex flex-col gap-3 justify-start mt-3">
                          <button 
                              onClick={handleAttack}
                              disabled={!isPlayerTurn}
                              className={`w-full py-3 px-2 ${heavyButtonClasses} text-sm transition-transform hover:scale-[1.02] active:scale-95
                              ${portalIsRed 
                                  ? 'border-red-600 bg-red-950 text-red-100 hover:bg-red-800' 
                                  : 'border-white bg-[#1a1a1a] text-white hover:bg-[#333]'}`}>
                              Atacar (Básico)
                          </button>
                          
                          <button 
                              onClick={handleSkill}
                              disabled={!isPlayerTurn || !gameState.playerClass}
                              className={`w-full py-2 px-3 ${heavyButtonClasses} text-xs transition-transform hover:scale-[1.02] active:scale-95 flex items-center gap-3 justify-center
                              ${gameState.playerClass 
                                  ? 'border-purple-500 bg-[#1a0f2e] text-purple-200 hover:bg-purple-900' 
                                  : 'bg-[#111] border-gray-800 text-gray-700'}`}>
                              {gameState.playerClass && (
                                  <div className="w-8 h-8 shrink-0 border border-purple-500 bg-black flex items-center justify-center overflow-hidden rounded-sm">
                                      <img 
                                          src={getIcon(gameState.playerClass.baseSkill.id, 'consumable')} 
                                          alt={gameState.playerClass.baseSkill.name}
                                          referrerPolicy="no-referrer"
                                          className="w-full h-full object-cover"
                                          style={{ imageRendering: 'pixelated' }}
                                      />
                                  </div>
                              )}
                              <span className="truncate font-bold text-center">
                                  {gameState.playerClass ? `Habilidade: ${gameState.playerClass.baseSkill.name}` : 'Nenhuma Classe Equipada'}
                              </span>
                          </button>
                          
                          <div className="mt-auto">
                              <h4 className="text-[10px] uppercase text-gray-500 font-bold mb-1 border-t-2 border-gray-700 pt-2">Suprimentos (Consome Turno)</h4>
                              {gameState.inventory.consumables.length > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                      {gameState.inventory.consumables.map((c, i) => (
                                          <button
                                              key={`${c.item.id}-${i}`}
                                              disabled={!isPlayerTurn}
                                              onClick={() => {
                                                  dispatch({ type: 'USE_CONSUMABLE', itemId: c.item.id });
                                                  addLog(`[Item] Usou ${c.item.name}!`, 'heal');
                                                  setIsPlayerTurn(false);
                                              }}
                                              className={`flex-1 min-w-[45%] py-2 px-1 text-[9px] hover:scale-105 active:scale-95 flex items-center justify-center gap-2 ${heavyButtonClasses}
                                                  ${portalIsRed ? 'border-red-800 bg-[#3a0a0a] text-red-200 hover:bg-red-800' : 'border-blue-800 bg-[rgba(20,40,60,0.8)] text-blue-200 hover:bg-blue-800'}`}
                                              title={c.item.name}
                                          >
                                              {getIcon(c.item.id, 'consumable') && (
                                                  <div className="w-10 h-10 shrink-0 bg-black border border-current pixel-box overflow-hidden">
                                                      <PixelImage
                                                          src={getIcon(c.item.id, 'consumable')}
                                                          alt={c.item.name}
                                                          itemType="consumable"
                                                          rank={c.item.rank}
                                                          className="w-full h-full object-cover"
                                                      />
                                                  </div>
                                              )}
                                              <span>{c.item.name} ({c.count})</span>
                                          </button>
                                      ))}
                                  </div>
                              ) : (
                                  <div className="text-[9px] text-gray-600 text-center py-2 bg-black border-2 border-gray-800 pixel-box">
                                      Nenhum consumível no inventário
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>
              </div>
         </div>
    )
}

