import w_e from '../assets/images/weapon_dagger_rusty_1780249699670.png';
import w_d from '../assets/images/weapon_staff_apprentice_1780249716582.png';
import w_c from '../assets/images/weapon_sword_iron_1780249733505.png';
import w_b from '../assets/images/weapon_blade_flaming_1780249750008.png';
import w_a from '../assets/images/weapon_bow_celestial_1780249769211.png';
import w_s from '../assets/images/weapon_sword_demon_1780249785688.png';

import a_e from '../assets/images/armor_leather_vest_1780249804337.png';
import a_d from '../assets/images/armor_copper_1780249820658.png';
import a_c from '../assets/images/armor_elven_chainmail_1780249839891.png';
import a_b from '../assets/images/armor_drake_scale_1780249857180.png';
import a_a from '../assets/images/armor_shadow_mantle_1780249871372.png';
import a_s from '../assets/images/armor_monarch_1780249886708.png';

import ac_e from '../assets/images/accessory_goblin_ring_1780249908301.png';
import ac_d from '../assets/images/accessory_magic_necklace_1780249923616.png';
import ac_c from '../assets/images/accessory_silver_bracelet_1780249940843.png';
import ac_b from '../assets/images/accessory_flame_hunter_ring_1780249956483.png';
import ac_a from '../assets/images/accessory_beast_eye_1780249974897.png';
import ac_s from '../assets/images/accessory_ruler_heart_1780249992647.png';

import pot_hp_s from '../assets/images/potion_hp_small_1780250014790.png';
import pot_mana_s from '../assets/images/potion_mana_small_1780250031073.png';
import pot_energy_s from '../assets/images/potion_energy_small_1780250047074.png';
import pot_hp_m from '../assets/images/potion_hp_medium_1780250060423.png';
import pot_mana_m from '../assets/images/potion_mana_medium_1780250073808.png';
import pot_energy_m from '../assets/images/potion_energy_medium_1780250086533.png';
import pot_hp_l from '../assets/images/potion_hp_large_1780250103936.png';
import pot_mana_l from '../assets/images/potion_mana_large_1780250121340.png';

import pot_hp_b from '../assets/images/potion_hp_elixir_b_1780319051507.png';
import pot_mana_b_img from '../assets/images/potion_mana_elixir_b_1780319070962.png';
import pot_hp_a from '../assets/images/potion_hp_yggdrasil_a_1780319087583.png';
import pot_mana_a_img from '../assets/images/potion_mana_star_a_1780319105637.png';
import pot_hp_s_img from '../assets/images/potion_hp_essencia_s_1780319121835.png';
import pot_mana_s_img from '../assets/images/potion_mana_essencia_s_1780319141836.png';

// Active Skills
import skill_class_e from '../assets/images/skill_class_e.png';
import skill_class_d from '../assets/images/skill_class_d.png';
import skill_class_c from '../assets/images/skill_class_c.png';
import skill_class_b from '../assets/images/skill_class_b.png';
import skill_class_a from '../assets/images/skill_class_a.png';
import skill_class_s from '../assets/images/skill_class_s.png';

// Passive Skills
import skill_pass_e from '../assets/images/skill_pass_e.png';
import skill_pass_d from '../assets/images/skill_pass_d.png';
import skill_pass_c from '../assets/images/skill_pass_c.png';
import skill_pass_b from '../assets/images/skill_pass_b.png';
import skill_pass_a from '../assets/images/skill_pass_a.png';
import skill_pass_s from '../assets/images/skill_pass_s.png';

export const ITEM_ICONS: Record<string, string> = {
  // Weapons
  'w_e': w_e,
  'w_d': w_d,
  'w_c': w_c,
  'w_b': w_b,
  'w_a': w_a,
  'w_s': w_s,

  // Armors
  'a_e': a_e,
  'a_d': a_d,
  'a_c': a_c,
  'a_b': a_b,
  'a_a': a_a,
  'a_s': a_s,

  // Accessories
  'ac_e': ac_e,
  'ac_d': ac_d,
  'ac_c': ac_c,
  'ac_b': ac_b,
  'ac_a': ac_a,
  'ac_s': ac_s,

  // Consumables
  'pot_e': pot_hp_s,
  'pot_mana_e': pot_mana_s,
  'pot_energy_e': pot_energy_s,
  
  'pot_d': pot_hp_m,
  'pot_mana_d': pot_mana_m,
  'pot_energy_d': pot_energy_m,

  'pot_c': pot_hp_l,
  'pot_mana_c': pot_mana_l,
  'pot_energy_c': pot_energy_m, // Fallback

  'pot_b': pot_hp_b,
  'pot_mana_b': pot_mana_b_img,

  'pot_a': pot_hp_a,
  'pot_mana_a': pot_mana_a_img,

  'pot_s': pot_hp_s_img,
  'pot_mana_s': pot_mana_s_img,

  // Active Technique Skills
  'skill_class_e': skill_class_e,
  'skill_class_d': skill_class_d,
  'skill_class_c': skill_class_c,
  'skill_class_b': skill_class_b,
  'skill_class_a': skill_class_a,
  'skill_class_s': skill_class_s,

  // Passive Skills
  'pass_e_xp': skill_pass_e,
  'pass_d_gold': skill_pass_d,
  'pass_c_dmg': skill_pass_c,
  'pass_b_secret': skill_pass_b,
  'pass_a_regen': skill_pass_a,
  'pass_s_mana': skill_pass_s,
};

export const getIcon = (id: string, itemType: string) => {
    if (ITEM_ICONS[id]) return ITEM_ICONS[id];
    // Fallback if not mapped
    return '';
}
