import { PlayerState, Attributes, Rank, Item, Skill, PlayerClass } from '../types';
import { calculateRequiredXP, getRankFromLevel } from './gameData';

export const getInitialState = (): PlayerState => ({
  level: 1,
  xp: 0,
  xpNeeded: 100,
  rank: 'E',
  playerClass: null,
  unlockedClasses: [],
  
  gold: 0,
  manaCrystals: 0,
  classPoints: 0,
  resurrectionPoints: 0,
  
  maxHp: 120,
  currentHp: 120,
  maxMana: 60,
  currentMana: 60,
  maxEnergy: 60,
  currentEnergy: 60,
  
  attributes: {
    strength: 5,
    agility: 5,
    vitality: 5,
    intelligence: 5,
    sense: 5,
  },
  statPoints: 0,
  
  inventory: {
    weapons: [],
    armors: [],
    accessories: [],
    consumables: [],
    skills: [],
  },
  
  equipped: {
    weapon: null,
    armor: null,
    accessory: null,
    passives: [null, null, null],
  },
  
  upgrades: {},
});

export const saveGameState = (state: PlayerState) => {
  try {
    localStorage.setItem('sololevelling_roguelike_save', JSON.stringify(state));
  } catch (e) {}
};

export const loadGameState = (): PlayerState => {
  try {
    const saved = localStorage.getItem('sololevelling_roguelike_save');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return getInitialState();
};

export type GameAction = 
  | { type: 'ADD_XP'; amount: number }
  | { type: 'ADD_GOLD'; amount: number }
  | { type: 'ADD_CRYSTALS'; amount: number }
  | { type: 'ADD_CLASS_POINTS'; amount: number }
  | { type: 'HEAL_HP'; amount: number }
  | { type: 'HEAL_MANA'; amount: number }
  | { type: 'HEAL_ENERGY'; amount: number }
  | { type: 'TAKE_DAMAGE'; amount: number }
  | { type: 'SPEND_MANA'; amount: number }
  | { type: 'SPEND_ENERGY'; amount: number }
  | { type: 'ADD_STAT'; stat: keyof Attributes }
  | { type: 'EQUIP_WEAPON'; item: Item }
  | { type: 'EQUIP_ARMOR'; item: Item }
  | { type: 'EQUIP_ACCESSORY'; item: Item }
  | { type: 'EQUIP_PASSIVE'; skill: Skill; slot: number }
  | { type: 'BUY_ITEM'; item: Item; itemType: 'weapons' | 'armors' | 'accessories' | 'consumables' }
  | { type: 'BUY_SKILL'; skill: Skill; cost: { gold: number; crystals: number } }
  | { type: 'USE_CONSUMABLE'; itemId: string }
  | { type: 'DEATH' }
  | { type: 'UNLOCK_CLASS'; classId: string; cost: number }
  | { type: 'SET_CLASS'; playerClass: PlayerClass }
  | { type: 'BUY_UPGRADE'; upgradeId: string; cost: number }
  | { type: 'FULL_RESTORE' }
  | { type: 'ROLL_CLASS'; cost: number; resultClassId: string; isDuplicate: boolean; compensationGold: number }
  | { type: 'RESET_SAVE' };

export const gameReducer = (state: PlayerState, action: GameAction): PlayerState => {
  let newState = { ...state };
  switch (action.type) {
    case 'ADD_XP':
      newState.xp += action.amount;
      while (newState.xp >= newState.xpNeeded) {
        newState.xp -= newState.xpNeeded;
        newState.level++;
        newState.statPoints += 3;
        newState.xpNeeded = calculateRequiredXP(newState.level);
        newState.rank = getRankFromLevel(newState.level);
        // Heal full on pure level up conceptually
        newState.currentHp = newState.maxHp;
      }
      break;
    case 'ADD_GOLD': newState.gold += action.amount; break;
    case 'ADD_CRYSTALS': newState.manaCrystals += action.amount; break;
    case 'ADD_CLASS_POINTS': newState.classPoints += action.amount; break;
    
    case 'HEAL_HP': newState.currentHp = Math.min(newState.maxHp, newState.currentHp + action.amount); break;
    case 'HEAL_MANA': newState.currentMana = Math.min(newState.maxMana, newState.currentMana + action.amount); break;
    case 'HEAL_ENERGY': newState.currentEnergy = Math.min(newState.maxEnergy, newState.currentEnergy + action.amount); break;
    
    case 'TAKE_DAMAGE': newState.currentHp = Math.max(0, newState.currentHp - action.amount); break;
    case 'SPEND_MANA': newState.currentMana = Math.max(0, newState.currentMana - action.amount); break;
    case 'SPEND_ENERGY': newState.currentEnergy = Math.max(0, newState.currentEnergy - action.amount); break;
    
    case 'FULL_RESTORE':
      newState.currentHp = newState.maxHp;
      newState.currentMana = newState.maxMana;
      newState.currentEnergy = newState.maxEnergy;
      break;

    case 'ADD_STAT':
      if (newState.statPoints > 0) {
        newState.attributes = { ...newState.attributes, [action.stat]: newState.attributes[action.stat] + 1 };
        newState.statPoints--;
      }
      break;

    case 'EQUIP_WEAPON': newState.equipped.weapon = action.item; break;
    case 'EQUIP_ARMOR': newState.equipped.armor = action.item; break;
    case 'EQUIP_ACCESSORY': newState.equipped.accessory = action.item; break;
    case 'EQUIP_PASSIVE': 
      const newPassives = [...newState.equipped.passives];
      newPassives[action.slot] = action.skill;
      newState.equipped.passives = newPassives;
      break;

    case 'BUY_ITEM':
      if (newState.gold >= action.item.cost.gold && newState.manaCrystals >= action.item.cost.crystals) {
        newState.gold -= action.item.cost.gold;
        newState.manaCrystals -= action.item.cost.crystals;
        if (action.itemType === 'consumables') {
          const existing = newState.inventory.consumables.find(c => c.item.id === action.item.id);
          if (existing) {
             newState.inventory.consumables = newState.inventory.consumables.map(c => c.item.id === action.item.id ? { ...c, count: c.count + 1 } : c);
          } else {
             newState.inventory.consumables = [...newState.inventory.consumables, { item: action.item, count: 1 }];
          }
        } else {
           // @ts-ignore
           newState.inventory[action.itemType] = [...newState.inventory[action.itemType], action.item];
        }
      }
      break;

    case 'BUY_SKILL':
      if (newState.gold >= action.cost.gold && newState.manaCrystals >= action.cost.crystals) {
         newState.gold -= action.cost.gold;
         newState.manaCrystals -= action.cost.crystals;
         newState.inventory.skills = [...newState.inventory.skills, action.skill];
      }
      break;

    case 'USE_CONSUMABLE':
      const c = newState.inventory.consumables.find(c => c.item.id === action.itemId);
      if (c && c.count > 0) {
        c.count--;
        if (c.item.stats?.hpRestore) newState.currentHp = Math.min(newState.maxHp, newState.currentHp + c.item.stats.hpRestore);
        if (c.item.stats?.mpRestore) newState.currentMana = Math.min(newState.maxMana, newState.currentMana + c.item.stats.mpRestore);
        if (c.item.stats?.energyRestore) newState.currentEnergy = Math.min(newState.maxEnergy, newState.currentEnergy + c.item.stats.energyRestore);
      }
      newState.inventory.consumables = newState.inventory.consumables.filter(c => c.count > 0);
      break;

    case 'DEATH':
      // Roguelike rebirth: calculate resurrection points
      const gainedRP = newState.level * (['E','D','C','B','A','S'].indexOf(newState.rank) + 1);
      const totalRP = newState.resurrectionPoints + gainedRP;
      const upgrades = newState.upgrades; // Keep upgrades
      
      newState = getInitialState();
      newState.resurrectionPoints = totalRP;
      newState.upgrades = upgrades;
      break;
      
    case 'UNLOCK_CLASS':
      if (newState.classPoints >= action.cost && !newState.unlockedClasses.includes(action.classId)) {
        newState.classPoints -= action.cost;
        newState.unlockedClasses = [...newState.unlockedClasses, action.classId];
      }
      break;
      
    case 'ROLL_CLASS':
      if (newState.classPoints >= action.cost) {
        newState.classPoints -= action.cost;
        if (action.isDuplicate) {
          newState.gold += action.compensationGold;
        } else {
          newState.unlockedClasses = [...newState.unlockedClasses, action.resultClassId];
        }
      }
      break;
      
    case 'SET_CLASS':
      newState.playerClass = action.playerClass;
      break;

    case 'BUY_UPGRADE':
      if (newState.resurrectionPoints >= action.cost) {
        newState.resurrectionPoints -= action.cost;
        newState.upgrades[action.upgradeId] = (newState.upgrades[action.upgradeId] || 0) + 1;
      }
      break;
      
    case 'RESET_SAVE':
      newState = getInitialState();
      break;
  }
  
  saveGameState(newState);
  return newState;
};
