export type Rank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

export interface Attributes {
  strength: number;
  agility: number;
  vitality: number;
  intelligence: number;
  sense: number;
}

export type DamageType = 'physical' | 'magical' | 'mixed';

export interface Skill {
  id: string;
  name: string;
  rank: Rank;
  type: 'active' | 'passive';
  description: string;
  cost?: { type: 'mana' | 'energy' | 'both'; amount: number };
  multiplier?: number; // Damage multiplier for active
  cooldown?: number; // In game ticks or ms
  passiveEffects?: {
    damageMultiplier?: number;
    xpMultiplier?: number;
    goldMultiplier?: number;
    manaCrystalMultiplier?: number;
    secretMonsterChance?: number;
    extraShield?: number;
    regenSpeed?: number;
    extraMana?: number;
  };
}

export interface PlayerClass {
  id: string;
  name: string;
  rank: Rank;
  damageType: DamageType;
  baseSkill: Skill;
}

export interface Item {
  id: string;
  name: string;
  rank: Rank;
  type: 'weapon' | 'armor' | 'accessory' | 'consumable';
  description: string;
  stats?: Partial<Attributes> & { damage?: number; defense?: number; hpRestore?: number; mpRestore?: number; energyRestore?: number };
  cost: { gold: number; crystals: number };
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  maxLevel: number;
  baseCost: number;
  effectPerLevel: number;
}

export interface PlayerState {
  level: number;
  xp: number;
  xpNeeded: number;
  rank: Rank;
  
  playerClass: PlayerClass | null;
  unlockedClasses: string[];
  
  gold: number;
  manaCrystals: number;
  classPoints: number;
  resurrectionPoints: number;
  
  maxHp: number;
  currentHp: number;
  maxMana: number;
  currentMana: number;
  maxEnergy: number;
  currentEnergy: number;
  
  attributes: Attributes;
  statPoints: number;
  
  inventory: {
    weapons: Item[];
    armors: Item[];
    accessories: Item[];
    consumables: { item: Item; count: number }[];
    skills: Skill[];
  };
  
  equipped: {
    weapon: Item | null;
    armor: Item | null;
    accessory: Item | null;
    passives: (Skill | null)[]; // Max 3
  };
  
  upgrades: {
    [upgradeId: string]: number; // Level of the upgrade
  };
}

export interface Monster {
  id: string;
  name: string;
  rank: Rank;
  hp: number;
  maxHp: number;
  damage: number;
  defense: number;
  isBoss: boolean;
  isSecret: boolean;
  xpReward: number;
  goldReward: number;
  crystalReward: number;
  classPointReward?: number;
}

export interface Portal {
  id: string;
  name: string;
  rank: Rank;
  isRed: boolean;
  monsters: IterableIterator<Monster>; // Or a generator/list
}
