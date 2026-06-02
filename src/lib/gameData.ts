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
  
  // Consumables
  { id: 'pot_e', name: 'Poção Pequena de HP', rank: 'E', type: 'consumable', description: 'Recupera 50 HP.', stats: { hpRestore: 50 }, cost: { gold: 20, crystals: 0 } },
  { id: 'pot_mana_e', name: 'Poção Pequena de Mana', rank: 'E', type: 'consumable', description: 'Recupera 30 Mana.', stats: { mpRestore: 30 }, cost: { gold: 30, crystals: 0 } },
  { id: 'pot_energy_e', name: 'Bebida Energética', rank: 'E', type: 'consumable', description: 'Recupera 30 Energia.', stats: { energyRestore: 30 }, cost: { gold: 30, crystals: 0 } },
  
  { id: 'pot_d', name: 'Poção Média de HP', rank: 'D', type: 'consumable', description: 'Recupera 200 HP.', stats: { hpRestore: 200 }, cost: { gold: 100, crystals: 2 } },
  { id: 'pot_mana_d', name: 'Poção Média de Mana', rank: 'D', type: 'consumable', description: 'Recupera 100 Mana.', stats: { mpRestore: 100 }, cost: { gold: 150, crystals: 3 } },
  { id: 'pot_energy_d', name: 'Poção Média de Energia', rank: 'D', type: 'consumable', description: 'Recupera 100 Energia.', stats: { energyRestore: 100 }, cost: { gold: 150, crystals: 3 } },

  { id: 'pot_c', name: 'Poção Grande de HP', rank: 'C', type: 'consumable', description: 'Recupera 800 HP.', stats: { hpRestore: 800 }, cost: { gold: 500, crystals: 10 } },
  { id: 'pot_mana_c', name: 'Poção Grande de Mana', rank: 'C', type: 'consumable', description: 'Recupera 400 Mana.', stats: { mpRestore: 400 }, cost: { gold: 750, crystals: 15 } },
  { id: 'pot_energy_c', name: 'Poção Grande de Energia', rank: 'C', type: 'consumable', description: 'Recupera 400 Energia.', stats: { energyRestore: 400 }, cost: { gold: 750, crystals: 15 } },

  { id: 'pot_b', name: 'Elixir de Cura', rank: 'B', type: 'consumable', description: 'Recupera 2500 HP.', stats: { hpRestore: 2500 }, cost: { gold: 2500, crystals: 50 } },
  { id: 'pot_mana_b', name: 'Elixir de Mana', rank: 'B', type: 'consumable', description: 'Recupera 1200 Mana.', stats: { mpRestore: 1200 }, cost: { gold: 3500, crystals: 75 } },

  { id: 'pot_a', name: 'Gota de Yggdrasil', rank: 'A', type: 'consumable', description: 'Recupera 10000 HP.', stats: { hpRestore: 10000 }, cost: { gold: 12000, crystals: 250 } },
  { id: 'pot_mana_a', name: 'Lágrima Estelar', rank: 'A', type: 'consumable', description: 'Recupera 5000 Mana.', stats: { mpRestore: 5000 }, cost: { gold: 18000, crystals: 350 } },

  { id: 'pot_s', name: 'Essência da Vida', rank: 'S', type: 'consumable', description: 'Recupera 50000 HP.', stats: { hpRestore: 50000 }, cost: { gold: 50000, crystals: 1000 } },
  { id: 'pot_mana_s', name: 'Essência Mágica', rank: 'S', type: 'consumable', description: 'Recupera 20000 Mana.', stats: { mpRestore: 20000 }, cost: { gold: 75000, crystals: 1500 } },
];

export const CONSUMABLES: Item[] = ITEMS.filter(item => item.type === 'consumable');

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
    normal: { name: 'Goblin', rank: 'E', hp: 80, maxHp: 80, damage: 12, defense: 3, isBoss: false, isSecret: false, xpReward: 5, goldReward: 3, crystalReward: 0 },
    boss: { name: 'Hobgoblin Chefe', rank: 'E', hp: 350, maxHp: 350, damage: 30, defense: 10, isBoss: true, isSecret: false, xpReward: 25, goldReward: 15, crystalReward: 1 },
    secret: { name: 'Hobgoblin Enfurecido', rank: 'E', hp: 200, maxHp: 200, damage: 10, defense: 20, isBoss: false, isSecret: true, xpReward: 100, goldReward: 250, crystalReward: 5, classPointReward: 1 },
  },
  'D': {
    normal: { name: 'Lobo Mágico', rank: 'D', hp: 500, maxHp: 500, damage: 60, defense: 20, isBoss: false, isSecret: false, xpReward: 20, goldReward: 10, crystalReward: 1 },
    boss: { name: 'Lobo Alfa Chifrudo', rank: 'D', hp: 1500, maxHp: 1500, damage: 120, defense: 50, isBoss: true, isSecret: false, xpReward: 100, goldReward: 50, crystalReward: 5 },
    secret: { name: 'Lobo Espiritual', rank: 'D', hp: 800, maxHp: 800, damage: 200, defense: 0, isBoss: false, isSecret: true, xpReward: 400, goldReward: 200, crystalReward: 10, classPointReward: 2 },
  },
  'C': {
    normal: { name: 'Golem de Pedra', rank: 'C', hp: 3000, maxHp: 3000, damage: 200, defense: 200, isBoss: false, isSecret: false, xpReward: 100, goldReward: 50, crystalReward: 5 },
    boss: { name: 'Gigante de Aço', rank: 'C', hp: 12000, maxHp: 12000, damage: 500, defense: 500, isBoss: true, isSecret: false, xpReward: 500, goldReward: 250, crystalReward: 25 },
    secret: { name: 'Golem das Jóias', rank: 'C', hp: 6000, maxHp: 6000, damage: 300, defense: 400, isBoss: false, isSecret: true, xpReward: 1500, goldReward: 2500, crystalReward: 75, classPointReward: 5 },
  },
  'B': {
    normal: { name: 'Orc Guerreiro', rank: 'B', hp: 18000, maxHp: 18000, damage: 1000, defense: 400, isBoss: false, isSecret: false, xpReward: 500, goldReward: 250, crystalReward: 20 },
    boss: { name: 'Orque Supremo', rank: 'B', hp: 75000, maxHp: 75000, damage: 3000, defense: 1200, isBoss: true, isSecret: false, xpReward: 2500, goldReward: 1250, crystalReward: 100 },
    secret: { name: 'Assassino Sombrio', rank: 'B', hp: 35000, maxHp: 35000, damage: 6000, defense: 200, isBoss: false, isSecret: true, xpReward: 7500, goldReward: 5000, crystalReward: 250, classPointReward: 10 },
  },
  'A': {
    normal: { name: 'Espectro Superior', rank: 'A', hp: 120000, maxHp: 120000, damage: 8000, defense: 2000, isBoss: false, isSecret: false, xpReward: 4000, goldReward: 1500, crystalReward: 150 },
    boss: { name: 'Arquimago Lich', rank: 'A', hp: 450000, maxHp: 450000, damage: 20000, defense: 8000, isBoss: true, isSecret: false, xpReward: 20000, goldReward: 7500, crystalReward: 750 },
    secret: { name: 'Anjo Caído', rank: 'A', hp: 300000, maxHp: 300000, damage: 30000, defense: 5000, isBoss: false, isSecret: true, xpReward: 60000, goldReward: 40000, crystalReward: 2500, classPointReward: 25 },
  },
  'S': {
    normal: { name: 'Cavaleiro do Caos', rank: 'S', hp: 750000, maxHp: 750000, damage: 40000, defense: 15000, isBoss: false, isSecret: false, xpReward: 25000, goldReward: 10000, crystalReward: 1000 },
    boss: { name: 'Lorde Dragão Antigo', rank: 'S', hp: 4000000, maxHp: 4000000, damage: 150000, defense: 50000, isBoss: true, isSecret: false, xpReward: 150000, goldReward: 100000, crystalReward: 10000 },
    secret: { name: 'Fragmento do Arquiteto', rank: 'S', hp: 8000000, maxHp: 8000000, damage: 300000, defense: 100000, isBoss: false, isSecret: true, xpReward: 500000, goldReward: 500000, crystalReward: 50000, classPointReward: 100 },
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
  return Math.floor(100 * Math.pow(1.3, level - 1));
};

export const calculatePlayerStats = (state: any) => {
  const vit = state?.attributes?.vitality || 5;
  const int = state?.attributes?.intelligence || 5;
  const agi = state?.attributes?.agility || 5;
  const str = state?.attributes?.strength || 5;

  let stats = {
    maxHp: 50 + (vit * 10),
    maxMana: 30 + (int * 5),
    maxEnergy: 30 + (agi * 3) + (str * 2),
    attack: str * 1.5 + agi * 0.5,
    magicAttack: int * 2,
    defense: Math.floor(vit * 0.5 + agi * 0.2),
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
