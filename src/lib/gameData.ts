import { Rank, Item, Skill, PlayerClass, Monster } from '../types';

export const RANKS: Rank[] = ['E', 'D', 'C', 'B', 'A', 'S'];

export const CLASSES: PlayerClass[] = [
  {
    id: 'class_e',
    name: 'Caçador',
    rank: 'E',
    damageType: 'physical',
    baseSkill: {
      id: 'skill_class_e',
      name: 'Golpe Brutal',
      rank: 'E',
      type: 'active',
      description: 'Um golpe físico forte.',
      cost: { type: 'energy', amount: 10 },
      multiplier: 1.5,
      cooldown: 3
    }
  },
  {
    id: 'class_d',
    name: 'Mago',
    rank: 'D',
    damageType: 'magical',
    baseSkill: {
      id: 'skill_class_d',
      name: 'Míssil Mágico',
      rank: 'D',
      type: 'active',
      description: 'Dispara energia mágica pura.',
      cost: { type: 'mana', amount: 15 },
      multiplier: 2.0,
      cooldown: 4
    }
  },
  {
    id: 'class_c',
    name: 'Espadachim',
    rank: 'C',
    damageType: 'physical',
    baseSkill: {
      id: 'skill_class_c',
      name: 'Corte Rápido',
      rank: 'C',
      type: 'active',
      description: 'Um corte veloz que consome energia.',
      cost: { type: 'energy', amount: 20 },
      multiplier: 2.5,
      cooldown: 3
    }
  },
  {
    id: 'class_b',
    name: 'Caçador Flamejante',
    rank: 'B',
    damageType: 'mixed',
    baseSkill: {
      id: 'skill_class_b',
      name: 'Lâmina Ígnea',
      rank: 'B',
      type: 'active',
      description: 'Ataque físico imbuído com magia de fogo.',
      cost: { type: 'both', amount: 20 },
      multiplier: 3.5,
      cooldown: 5
    }
  },
  {
    id: 'class_a',
    name: 'Invocador',
    rank: 'A',
    damageType: 'magical',
    baseSkill: {
      id: 'skill_class_a',
      name: 'Espírito Bestial',
      rank: 'A',
      type: 'active',
      description: 'Invoca uma fera mágica para atacar.',
      cost: { type: 'mana', amount: 50 },
      multiplier: 5.0,
      cooldown: 6
    }
  },
  {
    id: 'class_s',
    name: 'Espadachim Mestre',
    rank: 'S',
    damageType: 'physical',
    baseSkill: {
      id: 'skill_class_s',
      name: 'Corte Divisor de Mundos',
      rank: 'S',
      type: 'active',
      description: 'Ataque ápice que corta tudo no caminho.',
      cost: { type: 'energy', amount: 80 },
      multiplier: 8.0,
      cooldown: 10
    }
  }
];

export const ITEMS: Item[] = [
  // Weapons
  { id: 'w_e', name: 'Adaga Enferrujada', rank: 'E', type: 'weapon', description: 'Arma básica de caçador.', stats: { damage: 5 }, cost: { gold: 100, crystals: 0 } },
  { id: 'w_d', name: 'Cajado de Aprendiz', rank: 'D', type: 'weapon', description: 'Canaliza mana básica.', stats: { damage: 15 }, cost: { gold: 500, crystals: 5 } },
  { id: 'w_c', name: 'Espada de Ferro Frio', rank: 'C', type: 'weapon', description: 'Uma espada bem feita.', stats: { damage: 40 }, cost: { gold: 2000, crystals: 20 } },
  { id: 'w_b', name: 'Lâmina Incandescente', rank: 'B', type: 'weapon', description: 'Emite um calor constante.', stats: { damage: 100 }, cost: { gold: 8000, crystals: 100 } },
  { id: 'w_a', name: 'Orbe das Sombras', rank: 'A', type: 'weapon', description: 'Reverbera poder mágico denso.', stats: { damage: 250 }, cost: { gold: 30000, crystals: 500 } },
  { id: 'w_s', name: 'Presa do Monarca', rank: 'S', type: 'weapon', description: 'Uma arma de poder indescritível.', stats: { damage: 800 }, cost: { gold: 100000, crystals: 2000 } },
  
  // Armors
  { id: 'a_e', name: 'Roupas Esfarrapadas', rank: 'E', type: 'armor', description: 'Melhor que nada.', stats: { defense: 2 }, cost: { gold: 100, crystals: 0 } },
  { id: 'a_d', name: 'Manto de Couro', rank: 'D', type: 'armor', description: 'Resistência leve.', stats: { defense: 8 }, cost: { gold: 500, crystals: 5 } },
  { id: 'a_c', name: 'Armadura de Ferro', rank: 'C', type: 'armor', description: 'Proteção sólida.', stats: { defense: 25 }, cost: { gold: 2000, crystals: 20 } },
  { id: 'a_b', name: 'Placa Dracônica Menor', rank: 'B', type: 'armor', description: 'Resiste ao calor.', stats: { defense: 60 }, cost: { gold: 8000, crystals: 100 } },
  { id: 'a_a', name: 'Manto das Estrelas', rank: 'A', type: 'armor', description: 'Desvia energia mágica.', stats: { defense: 150 }, cost: { gold: 30000, crystals: 500 } },
  { id: 'a_s', name: 'Égide do Soberano', rank: 'S', type: 'armor', description: 'Defesa absoluta.', stats: { defense: 400 }, cost: { gold: 100000, crystals: 2000 } },
  
  // Accessories
  { id: 'ac_e', name: 'Anel Cinza', rank: 'E', type: 'accessory', description: '+1 Força e Agilidade.', stats: { strength: 1, agility: 1 }, cost: { gold: 200, crystals: 2 } },
  { id: 'ac_d', name: 'Colar de Mana', rank: 'D', type: 'accessory', description: '+3 Inteligência.', stats: { intelligence: 3 }, cost: { gold: 1000, crystals: 10 } },
  { id: 'ac_c', name: 'Bracelete do Guerreiro', rank: 'C', type: 'accessory', description: '+5 Vitalidade, +5 Força.', stats: { vitality: 5, strength: 5 }, cost: { gold: 4000, crystals: 40 } },
  { id: 'ac_b', name: 'Anel do Caçador Chama', rank: 'B', type: 'accessory', description: '+15 Força e Inteligência.', stats: { strength: 15, intelligence: 15 }, cost: { gold: 15000, crystals: 200 } },
  { id: 'ac_a', name: 'Olho de Fera', rank: 'A', type: 'accessory', description: '+40 Sentido.', stats: { sense: 40 }, cost: { gold: 50000, crystals: 1000 } },
  { id: 'ac_s', name: 'Coração do Governante', rank: 'S', type: 'accessory', description: '+100 todos os atributos.', stats: { strength: 100, agility: 100, vitality: 100, intelligence: 100, sense: 100 }, cost: { gold: 500000, crystals: 5000 } },
];

export const CONSUMABLES: Item[] = [
  { id: 'pot_e', name: 'Poção Pequena de HP', rank: 'E', type: 'consumable', description: 'Recupera 50 HP.', stats: { hpRestore: 50 }, cost: { gold: 20, crystals: 0 } },
  { id: 'pot_mana_e', name: 'Poção Pequena de Mana', rank: 'E', type: 'consumable', description: 'Recupera 30 Mana.', stats: { mpRestore: 30 }, cost: { gold: 30, crystals: 0 } },
  { id: 'pot_energy_e', name: 'Bebida Energética', rank: 'E', type: 'consumable', description: 'Recupera 30 Energia.', stats: { energyRestore: 30 }, cost: { gold: 30, crystals: 0 } },
  
  { id: 'pot_d', name: 'Poção Média de HP', rank: 'D', type: 'consumable', description: 'Recupera 200 HP.', stats: { hpRestore: 200 }, cost: { gold: 100, crystals: 2 } },
  { id: 'pot_mana_d', name: 'Poção Média de Mana', rank: 'D', type: 'consumable', description: 'Recupera 100 Mana.', stats: { mpRestore: 100 }, cost: { gold: 150, crystals: 3 } },
];

export const SHOP_SKILLS: { skill: Skill; cost: { gold: number; crystals: number } }[] = [
  { skill: { id: 'pass_e_xp', name: 'Aprendiz Veloz', rank: 'E', type: 'passive', description: '+10% XP', passiveEffects: { xpMultiplier: 1.1 } }, cost: { gold: 1000, crystals: 5 } },
  { skill: { id: 'pass_d_gold', name: 'Vasculhador', rank: 'D', type: 'passive', description: '+20% Ouro', passiveEffects: { goldMultiplier: 1.2 } }, cost: { gold: 3000, crystals: 15 } },
  { skill: { id: 'pass_c_dmg', name: 'Instinto Assassino', rank: 'C', type: 'passive', description: '+25% Dano', passiveEffects: { damageMultiplier: 1.25 } }, cost: { gold: 10000, crystals: 50 } },
  { skill: { id: 'pass_b_secret', name: 'Olhos da Verdade', rank: 'B', type: 'passive', description: '+5% Chance Monstro Secreto', passiveEffects: { secretMonsterChance: 0.05 } }, cost: { gold: 40000, crystals: 200 } },
  { skill: { id: 'pass_a_regen', name: 'Regeneração Trolle', rank: 'A', type: 'passive', description: 'Duplica velocidade de regen', passiveEffects: { regenSpeed: 2.0 } }, cost: { gold: 150000, crystals: 800 } },
  { skill: { id: 'pass_s_mana', name: 'Coração de Mana', rank: 'S', type: 'passive', description: '+100% Mana e Cristais', passiveEffects: { extraMana: 2.0, manaCrystalMultiplier: 2.0 } }, cost: { gold: 1000000, crystals: 5000 } },
];

export const UPGRADES = [
  { id: 'upg_gold', name: 'Avareza', description: 'Aumenta ganho de ouro em 5% por nível.', maxLevel: 20, baseCost: 1, effectPerLevel: 0.05 },
  { id: 'upg_xp', name: 'Despertar Rápido', description: 'Aumenta ganho de xp em 5% por nível.', maxLevel: 20, baseCost: 1, effectPerLevel: 0.05 },
  { id: 'upg_crystals', name: 'Afinidade de Mana', description: 'Aumenta cristais em 5% por nível.', maxLevel: 20, baseCost: 2, effectPerLevel: 0.05 },
  { id: 'upg_dmg', name: 'Força Abissal', description: 'Multiplicador de dano +5%.', maxLevel: 10, baseCost: 5, effectPerLevel: 0.05 },
  { id: 'upg_classpts', name: 'Favor dos Governantes', description: 'Mais pontos de classe.', maxLevel: 10, baseCost: 10, effectPerLevel: 0.1 },
];

const BASE_MONSTERS: Record<Rank, { normal: Omit<Monster, 'id'>, boss: Omit<Monster, 'id'>, secret: Omit<Monster, 'id'> }> = {
  'E': {
    normal: { name: 'Goblin Trabalhador', rank: 'E', hp: 50, maxHp: 50, damage: 5, defense: 1, isBoss: false, isSecret: false, xpReward: 10, goldReward: 5, crystalReward: 0 },
    boss: { name: 'Hobgoblin Chefe', rank: 'E', hp: 200, maxHp: 200, damage: 15, defense: 5, isBoss: true, isSecret: false, xpReward: 50, goldReward: 30, crystalReward: 1 },
    secret: { name: 'Slime Dourado', rank: 'E', hp: 100, maxHp: 100, damage: 2, defense: 10, isBoss: false, isSecret: true, xpReward: 200, goldReward: 500, crystalReward: 5, classPointReward: 1 },
  },
  'D': {
    normal: { name: 'Lobo Mágico', rank: 'D', hp: 300, maxHp: 300, damage: 25, defense: 10, isBoss: false, isSecret: false, xpReward: 40, goldReward: 20, crystalReward: 2 },
    boss: { name: 'Lobo Alfa Chifrudo', rank: 'D', hp: 1000, maxHp: 1000, damage: 60, defense: 25, isBoss: true, isSecret: false, xpReward: 200, goldReward: 100, crystalReward: 10 },
    secret: { name: 'Aparição Sombria', rank: 'D', hp: 500, maxHp: 500, damage: 100, defense: 0, isBoss: false, isSecret: true, xpReward: 800, goldReward: 400, crystalReward: 20, classPointReward: 2 },
  },
  'C': {
    normal: { name: 'Golem de Pedra', rank: 'C', hp: 2000, maxHp: 2000, damage: 80, defense: 100, isBoss: false, isSecret: false, xpReward: 200, goldReward: 100, crystalReward: 10 },
    boss: { name: 'Gigante de Aço', rank: 'C', hp: 8000, maxHp: 8000, damage: 250, defense: 300, isBoss: true, isSecret: false, xpReward: 1000, goldReward: 500, crystalReward: 50 },
    secret: { name: 'Golem das Jóias', rank: 'C', hp: 4000, maxHp: 4000, damage: 150, defense: 200, isBoss: false, isSecret: true, xpReward: 3000, goldReward: 5000, crystalReward: 150, classPointReward: 5 },
  },
  'B': {
    normal: { name: 'Orc Guerreiro', rank: 'B', hp: 12000, maxHp: 12000, damage: 400, defense: 200, isBoss: false, isSecret: false, xpReward: 1000, goldReward: 500, crystalReward: 40 },
    boss: { name: 'Orque Supremo', rank: 'B', hp: 50000, maxHp: 50000, damage: 1200, defense: 800, isBoss: true, isSecret: false, xpReward: 5000, goldReward: 2500, crystalReward: 200 },
    secret: { name: 'Assassino Sombrio', rank: 'B', hp: 25000, maxHp: 25000, damage: 3000, defense: 100, isBoss: false, isSecret: true, xpReward: 15000, goldReward: 10000, crystalReward: 500, classPointReward: 10 },
  },
  'A': {
    normal: { name: 'Espectro Superior', rank: 'A', hp: 80000, maxHp: 80000, damage: 3000, defense: 1000, isBoss: false, isSecret: false, xpReward: 8000, goldReward: 3000, crystalReward: 300 },
    boss: { name: 'Arquimago Lich', rank: 'A', hp: 300000, maxHp: 300000, damage: 8000, defense: 4000, isBoss: true, isSecret: false, xpReward: 40000, goldReward: 15000, crystalReward: 1500 },
    secret: { name: 'Anjo Caído', rank: 'A', hp: 200000, maxHp: 200000, damage: 12000, defense: 3000, isBoss: false, isSecret: true, xpReward: 120000, goldReward: 80000, crystalReward: 5000, classPointReward: 25 },
  },
  'S': {
    normal: { name: 'Cavaleiro do Caos', rank: 'S', hp: 500000, maxHp: 500000, damage: 15000, defense: 8000, isBoss: false, isSecret: false, xpReward: 50000, goldReward: 20000, crystalReward: 2000 },
    boss: { name: 'Lorde Dragão Antigo', rank: 'S', hp: 2500000, maxHp: 2500000, damage: 50000, defense: 25000, isBoss: true, isSecret: false, xpReward: 300000, goldReward: 200000, crystalReward: 20000 },
    secret: { name: 'Fragmento do Arquiteto', rank: 'S', hp: 5000000, maxHp: 5000000, damage: 100000, defense: 50000, isBoss: false, isSecret: true, xpReward: 1000000, goldReward: 1000000, crystalReward: 100000, classPointReward: 100 },
  }
};

export const generateMonster = (rank: Rank, type: 'normal' | 'boss' | 'secret', portalIsRed: boolean): Monster => {
  const base = BASE_MONSTERS[rank][type];
  const multiplier = portalIsRed ? 1.5 : 1;
  return {
    ...base,
    id: `${base.name.toLowerCase().replace(/ /g, '_')}_${Date.now()}_${Math.random()}`,
    hp: Math.floor(base.hp * multiplier),
    maxHp: Math.floor(base.maxHp * multiplier),
    damage: Math.floor(base.damage * multiplier),
    defense: Math.floor(base.defense * multiplier),
    xpReward: Math.floor(base.xpReward * multiplier),
    goldReward: Math.floor(base.goldReward * multiplier),
    crystalReward: Math.floor(base.crystalReward * multiplier),
    classPointReward: base.classPointReward ? Math.floor(base.classPointReward * (portalIsRed ? 2 : 1)) : undefined,
  };
};

export const getNextRank = (currentRank: Rank): Rank => {
  const i = RANKS.indexOf(currentRank);
  return i < RANKS.length - 1 ? RANKS[i + 1] : 'S';
};

export const calculateRequiredXP = (level: number): number => {
  return Math.floor(100 * Math.pow(1.15, level - 1));
};

export const calculatePlayerStats = (state: any) => {
  let stats = {
    maxHp: 100 + (state.attributes.vitality * 20),
    maxMana: 50 + (state.attributes.intelligence * 10),
    maxEnergy: 50 + (state.attributes.agility * 5) + (state.attributes.strength * 5),
    attack: state.attributes.strength * 2 + state.attributes.agility * 1,
    magicAttack: state.attributes.intelligence * 3,
    defense: state.attributes.vitality * 1 + state.attributes.agility * 1,
  };
  
  if (state.equipped.weapon) {
    stats.attack += state.equipped.weapon.stats?.damage || 0;
    stats.magicAttack += state.equipped.weapon.stats?.damage || 0; // simplified
  }
  if (state.equipped.armor) {
    stats.defense += state.equipped.armor.stats?.defense || 0;
  }
  
  let hpMultiplier = 1;
  let damageMultiplier = 1 + (state.upgrades['upg_dmg'] || 0) * 0.05;
  let manaMultiplier = 1;
  
  state.equipped.passives.forEach((p: any) => {
    if (p && p.passiveEffects) {
      if (p.passiveEffects.damageMultiplier) damageMultiplier *= p.passiveEffects.damageMultiplier;
      if (p.passiveEffects.extraMana) manaMultiplier *= p.passiveEffects.extraMana;
    }
  });

  stats.maxHp = Math.floor(stats.maxHp * hpMultiplier);
  stats.maxMana = Math.floor(stats.maxMana * manaMultiplier);
  stats.attack = Math.floor(stats.attack * damageMultiplier);
  stats.magicAttack = Math.floor(stats.magicAttack * damageMultiplier);
  
  return stats;
};

export const getRankFromLevel = (level: number): Rank => {
  if (level < 20) return 'E';
  if (level < 40) return 'D';
  if (level < 60) return 'C';
  if (level < 80) return 'B';
  if (level < 100) return 'A';
  return 'S';
};

export const levelsToNextRank = (level: number): number => {
  if (level < 20) return 20 - level;
  if (level < 40) return 40 - level;
  if (level < 60) return 60 - level;
  if (level < 80) return 80 - level;
  if (level < 100) return 100 - level;
  return 0;
};
