import { Jimp } from 'jimp';
import fs from 'fs';
import path from 'path';

// Helper drawings for pixel art style
function drawPixel(img: any, x: number, y: number, color: number) {
  if (x >= 0 && x < img.bitmap.width && y >= 0 && y < img.bitmap.height) {
    img.setPixelColor(color, x, y);
  }
}

function drawRect(img: any, x1: number, y1: number, w: number, h: number, color: number) {
  for (let dy = 0; dy < h; dy++) {
    for (let dx = 0; dx < w; dx++) {
      drawPixel(img, x1 + dx, y1 + dy, color);
    }
  }
}

function drawLine(img: any, x0: number, y0: number, x1: number, y1: number, color: number) {
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;
  while (true) {
    drawPixel(img, x0, y0, color);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }
}

function drawCircle(img: any, xc: number, yc: number, r: number, color: number, fill = false) {
  let x = 0;
  let y = r;
  let d = 3 - 2 * r;
  
  const drawCircleLines = (xc: number, yc: number, x: number, y: number, color: number, fill: boolean) => {
    if (fill) {
      drawLine(img, xc - x, yc + y, xc + x, yc + y, color);
      drawLine(img, xc - x, yc - y, xc + x, yc - y, color);
      drawLine(img, xc - y, yc + x, xc + y, yc + x, color);
      drawLine(img, xc - y, yc - x, xc + y, yc - x, color);
    } else {
      drawPixel(img, xc + x, yc + y, color);
      drawPixel(img, xc - x, yc + y, color);
      drawPixel(img, xc + x, yc - y, color);
      drawPixel(img, xc - x, yc - y, color);
      drawPixel(img, xc + y, yc + x, color);
      drawPixel(img, xc - y, yc + x, color);
      drawPixel(img, xc + y, yc - x, color);
      drawPixel(img, xc - y, yc - x, color);
    }
  };

  drawCircleLines(xc, yc, x, y, color, fill);
  while (y >= x) {
    x++;
    if (d > 0) {
      y--;
      d = d + 4 * (x - y) + 10;
    } else {
      d = d + 4 * x + 6;
    }
    drawCircleLines(xc, yc, x, y, color, fill);
  }
}

// Draw a shaded pixel block to give classic hand-drawn 3D volume
function drawShadedBlock(img: any, x: number, y: number, w: number, h: number, baseColor: number, shadowColor: number, highlightColor: number) {
  drawRect(img, x, y, w, h, baseColor);
  
  // Highlight top and left edge
  drawLine(img, x, y, x + w - 1, y, highlightColor);
  drawLine(img, x, y, x, y + h - 1, highlightColor);
  
  // Shadow bottom and right edge
  drawLine(img, x, y + h - 1, x + w - 1, y + h - 1, shadowColor);
  drawLine(img, x + w - 1, y, x + w - 1, y + h - 1, shadowColor);
}

// Retro pixel base colors
const COLORS = {
  black: 0x000000ff,
  slate: 0x475569ff,
  lightSlate: 0x94a3b8ff,
  darkSlate: 0x1e293bff,
  crimson: 0xef4444ff,
  ruby: 0x991b1bff,
  darkRuby: 0x450a0aff,
  flameOrange: 0xf97316ff,
  burntOrange: 0xc2410cff,
  gold: 0xeab308ff,
  lightGold: 0xfef08aff,
  darkGold: 0xa16207ff,
  emerald: 0x10b981ff,
  deepGreen: 0x065f46ff,
  darkGreen: 0x022c22ff,
  sapphire: 0x3b82f6ff,
  deepBlue: 0x1e3a8aff,
  royalBlue: 0x1d4ed8ff,
  purple: 0xa855f7ff,
  deepPurple: 0x581c87ff,
  darkPurple: 0x3b0764ff,
  copper: 0xb45309ff,
  wood: 0x78350fff,
  white: 0xffffffff,
  silver: 0xd1d5dbff,
  darkSilver: 0x6b7280ff,
  pink: 0xec4899ff,
  void: 0x111827ff
};

const dir = path.join(process.cwd(), 'src/assets/images');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

async function generateAll() {
  console.log("Starting Premium Game Assets Generation...");

  // 1. GENERATE PORTALS (128x128) - Upgraded to beautiful 128x128 size with solid black background
  const portals = [
    { rank: 'E', file: 'portal_rank_e_1780249307767.png', ringColor: COLORS.slate, coreColor: COLORS.lightSlate, outlineColor: COLORS.darkSlate },
    { rank: 'D', file: 'portal_rank_d_1780249351897.png', ringColor: COLORS.emerald, coreColor: COLORS.deepGreen, outlineColor: COLORS.darkGreen },
    { rank: 'C', file: 'portal_rank_c_1780249371862.png', ringColor: COLORS.sapphire, coreColor: COLORS.deepBlue, outlineColor: COLORS.void },
    { rank: 'B', file: 'portal_rank_b_1780249387468.png', ringColor: COLORS.purple, coreColor: COLORS.deepPurple, outlineColor: COLORS.darkPurple },
    { rank: 'A', file: 'portal_rank_a_1780249404412.png', ringColor: COLORS.flameOrange, coreColor: COLORS.ruby, outlineColor: COLORS.burntOrange },
    { rank: 'S', file: 'portal_rank_s_1780249422048.png', ringColor: COLORS.crimson, coreColor: COLORS.gold, outlineColor: COLORS.darkRuby }
  ];

  for (const p of portals) {
    console.log(`Generating Portal ${p.rank}...`);
    const img = new Jimp({ width: 128, height: 128, color: COLORS.black });
    
    // Draw majestic medieval runic stone ring
    drawCircle(img, 64, 64, 58, COLORS.darkSilver, false);
    drawCircle(img, 64, 64, 56, COLORS.silver, false);
    drawCircle(img, 64, 64, 52, COLORS.darkSilver, false);
    drawCircle(img, 64, 64, 48, p.outlineColor, true); // dimensional gate rim
    
    // Portal core swirl
    drawCircle(img, 64, 64, 42, p.ringColor, true);
    drawCircle(img, 64, 64, 30, p.coreColor, true);
    
    // Magic rune carvings radiating outwards
    for (let angle = 0; angle < 360; angle += 30) {
      const rad = (angle * Math.PI) / 180;
      const rx = Math.round(64 + Math.cos(rad) * 48);
      const ry = Math.round(64 + Math.sin(rad) * 48);
      drawCircle(img, rx, ry, 2, COLORS.white, true);
    }
    
    // Energy lightning ripples inside the vortex
    for (let i = 0; i < 8; i++) {
      const rx = 40 + Math.floor(Math.random() * 48);
      const ry = 40 + Math.floor(Math.random() * 48);
      drawLine(img, rx, ry, rx + Math.floor(Math.random() * 12 - 6), ry + Math.floor(Math.random() * 12 - 6), COLORS.white);
    }
    
    // Draw glowing stylized Rank Logo Letter inside the core
    const glyphColor = COLORS.white;
    // Drawing a large 24x36 pixels symbol in the center
    if (p.rank === 'E') {
      drawLine(img, 52, 44, 52, 84, glyphColor);
      drawLine(img, 52, 44, 76, 44, glyphColor);
      drawLine(img, 52, 64, 70, 64, glyphColor);
      drawLine(img, 52, 84, 76, 84, glyphColor);
    } else if (p.rank === 'D') {
      drawLine(img, 52, 44, 52, 84, glyphColor);
      drawLine(img, 52, 44, 68, 52, glyphColor);
      drawLine(img, 68, 52, 68, 76, glyphColor);
      drawLine(img, 68, 76, 52, 84, glyphColor);
    } else if (p.rank === 'C') {
      drawLine(img, 76, 44, 52, 44, glyphColor);
      drawLine(img, 52, 44, 52, 84, glyphColor);
      drawLine(img, 52, 84, 76, 84, glyphColor);
    } else if (p.rank === 'B') {
      drawLine(img, 52, 44, 52, 84, glyphColor);
      drawLine(img, 52, 44, 72, 44, glyphColor);
      drawLine(img, 72, 44, 72, 62, glyphColor);
      drawLine(img, 52, 62, 72, 62, glyphColor);
      drawLine(img, 72, 62, 72, 84, glyphColor);
      drawLine(img, 52, 84, 72, 84, glyphColor);
    } else if (p.rank === 'A') {
      drawLine(img, 64, 40, 50, 84, glyphColor);
      drawLine(img, 64, 40, 78, 84, glyphColor);
      drawLine(img, 56, 68, 72, 68, glyphColor);
    } else if (p.rank === 'S') {
      drawLine(img, 74, 44, 54, 44, glyphColor);
      drawLine(img, 54, 44, 54, 64, glyphColor);
      drawLine(img, 54, 64, 74, 64, glyphColor);
      drawLine(img, 74, 64, 74, 84, glyphColor);
      drawLine(img, 74, 84, 54, 84, glyphColor);
    }

    await img.write(path.join(dir, p.file) as any);
  }

  // 2. GENERATE WEAPONS (128x128) - Detailed pixel design as required
  const weapons = [
    { id: 'w_e', file: 'weapon_dagger_rusty_1780249699670.png', style: 'dagger', color1: COLORS.copper, color2: COLORS.wood },
    { id: 'w_d', file: 'weapon_staff_apprentice_1780249716582.png', style: 'staff', color1: COLORS.wood, color2: COLORS.sapphire },
    { id: 'w_c', file: 'weapon_sword_iron_1780249733505.png', style: 'sword', color1: COLORS.silver, color2: COLORS.sapphire },
    { id: 'w_b', file: 'weapon_blade_flaming_1780249750008.png', style: 'flame_sword', color1: COLORS.flameOrange, color2: COLORS.crimson },
    { id: 'w_a', file: 'weapon_bow_celestial_1780249769211.png', style: 'orbe', color1: COLORS.deepPurple, color2: COLORS.purple },
    { id: 'w_s', file: 'weapon_sword_demon_1780249785688.png', style: 'sword_s', color1: COLORS.ruby, color2: COLORS.gold }
  ];

  for (const w of weapons) {
    console.log(`Generating Weapon ${w.id}...`);
    const img = new Jimp({ width: 128, height: 128, color: COLORS.black });
    
    if (w.style === 'dagger') {
      // Intricate dagger
      drawLine(img, 30, 98, 45, 83, w.color2); // Leather wrap hilt
      drawCircle(img, 30, 98, 4, COLORS.gold, true); // Pommel skull
      drawRect(img, 42, 80, 8, 8, COLORS.gold); // Guard crest
      // Beautiful double-edged steel blade
      drawLine(img, 46, 80, 98, 28, w.color1);
      drawLine(img, 47, 79, 99, 27, COLORS.white); // Shiny blade edge
      drawLine(img, 45, 81, 97, 29, COLORS.darkSilver); // Shadow edge
    } else if (w.style === 'staff') {
      // Giant wizard staff
      drawLine(img, 24, 104, 88, 40, w.color1); // Wooden staff
      // Magical sapphire core wrapping
      drawCircle(img, 92, 36, 12, COLORS.gold, false); // Golden ring clasp
      drawCircle(img, 92, 36, 8, w.color2, true); // Celestial gemstone
      drawCircle(img, 92, 36, 4, COLORS.white, true); // Inner highlight glow
      // Floating runic sparkles
      drawPixel(img, 92, 20, COLORS.white);
      drawPixel(img, 108, 36, COLORS.white);
      drawPixel(img, 80, 48, COLORS.sapphire);
    } else if (w.style === 'sword') {
      // Heavy claymore knight sword
      drawLine(img, 24, 104, 40, 88, COLORS.wood); // Hilt
      drawLine(img, 32, 96, 48, 80, COLORS.gold); // Extended crossguard
      drawCircle(img, 24, 104, 5, COLORS.silver, true); // Pommel ring
      // Iron blade
      drawLine(img, 38, 88, 102, 24, w.color1);
      drawLine(img, 39, 87, 103, 23, COLORS.white); // Light flash reflection
      drawLine(img, 37, 89, 101, 25, COLORS.darkSilver);
    } else if (w.style === 'flame_sword') {
      // Fire sword of calamity
      drawLine(img, 24, 104, 40, 88, COLORS.darkSlate); // Hilt
      drawRect(img, 36, 84, 12, 12, COLORS.wood); // Guard
      // Magma blade core
      drawLine(img, 38, 88, 102, 24, w.color1);
      drawLine(img, 39, 87, 103, 23, COLORS.gold);
      // Floating particle fire embers
      for (let i = 0; i < 30; i++) {
        const x = 38 + Math.floor(Math.random() * 64);
        const y = 88 - (x - 38) + Math.floor(Math.random() * 16 - 8);
        drawPixel(img, x, y, COLORS.flameOrange);
        drawPixel(img, x + 1, y - 1, COLORS.gold);
      }
    } else if (w.style === 'orbe') {
      // Nebula void orb
      drawCircle(img, 64, 64, 24, w.color1, true); // Dark cosmic circle
      drawCircle(img, 64, 64, 16, w.color2, true); // Glowing violet essence
      drawCircle(img, 64, 64, 8, COLORS.pink, true); // Heart core
      // Astral rings orbiting
      drawCircle(img, 64, 64, 34, COLORS.white, false);
      drawLine(img, 20, 64, 108, 64, COLORS.white);
      drawLine(img, 64, 20, 64, 108, COLORS.purple);
    } else if (w.style === 'sword_s') {
      // Demon Monarch Fang (Sword of absolute sovereign)
      drawLine(img, 18, 110, 42, 86, COLORS.black); // Grip
      drawLine(img, 20, 108, 44, 84, COLORS.gold); // Gold decorations
      drawRect(img, 34, 76, 18, 18, COLORS.gold); // Giant wings guard
      drawCircle(img, 42, 86, 6, COLORS.ruby, true); // Inlaid heart eye
      // Bloody monarch blade
      drawLine(img, 42, 86, 112, 16, w.color1);
      drawLine(img, 43, 85, 113, 15, COLORS.white); // Divine white-hot edge line
      // Glowing ruby particles around blade
      for (let a = 0; a < 360; a += 45) {
        const rad = (a * Math.PI) / 180;
        const rx = Math.round(72 + Math.cos(rad) * 18);
        const ry = Math.round(58 + Math.sin(rad) * 18);
        drawPixel(img, rx, ry, COLORS.crimson);
      }
    }
    
    await img.write(path.join(dir, w.file) as any);
  }

  // 3. GENERATE ARMORS (128x128) - Upgraded size
  const armors = [
    { id: 'a_e', file: 'armor_leather_vest_1780249804337.png', color: COLORS.copper },
    { id: 'a_d', file: 'armor_copper_1780249820658.png', color: COLORS.wood },
    { id: 'a_c', file: 'armor_elven_chainmail_1780249839891.png', color: COLORS.silver },
    { id: 'a_b', file: 'armor_drake_scale_1780249857180.png', color: COLORS.flameOrange },
    { id: 'a_a', file: 'armor_shadow_mantle_1780249871372.png', color: COLORS.deepPurple },
    { id: 'a_s', file: 'armor_monarch_1780249886708.png', color: COLORS.gold }
  ];

  for (const a of armors) {
    console.log(`Generating Armor ${a.id}...`);
    const img = new Jimp({ width: 128, height: 128, color: COLORS.black });
    
    // Detailed Chestplate
    drawRect(img, 44, 44, 40, 52, a.color); // mainframe
    drawRect(img, 56, 44, 16, 8, COLORS.black); // collar check
    
    // Massive Pauldrons
    drawShadedBlock(img, 28, 38, 18, 18, COLORS.silver, COLORS.darkSilver, COLORS.white);
    drawShadedBlock(img, 82, 38, 18, 18, COLORS.silver, COLORS.darkSilver, COLORS.white);
    
    // Ribbing highlights
    drawLine(img, 48, 56, 80, 56, COLORS.white);
    drawLine(img, 48, 68, 80, 68, COLORS.darkSilver);
    drawLine(img, 48, 80, 80, 80, COLORS.black);
    
    // Inlaid Core Gem
    drawCircle(img, 64, 56, 6, COLORS.ruby, true);
    drawCircle(img, 64, 56, 3, COLORS.white, true);
    
    await img.write(path.join(dir, a.file) as any);
  }

  // 4. GENERATE ACCESSORIES (128x128) - Upgraded size
  const accessories = [
    { id: 'ac_e', file: 'accessory_goblin_ring_1780249908301.png', color: COLORS.copper },
    { id: 'ac_d', file: 'accessory_magic_necklace_1780249923616.png', color: COLORS.sapphire },
    { id: 'ac_c', file: 'accessory_silver_bracelet_1780249940843.png', color: COLORS.silver },
    { id: 'ac_b', file: 'accessory_flame_hunter_ring_1780249956483.png', color: COLORS.flameOrange },
    { id: 'ac_a', file: 'accessory_beast_eye_1780249974897.png', color: COLORS.emerald },
    { id: 'ac_s', file: 'accessory_ruler_heart_1780249992647.png', color: COLORS.crimson }
  ];

  for (const ac of accessories) {
    console.log(`Generating Accessory ${ac.id}...`);
    const img = new Jimp({ width: 128, height: 128, color: COLORS.black });
    
    if (ac.id === 'ac_e' || ac.id === 'ac_b') {
      // Detailed ancient ring of might
      drawCircle(img, 64, 64, 28, ac.color, false);
      drawCircle(img, 64, 64, 22, COLORS.black, true);
      // Large crystal mount
      drawShadedBlock(img, 56, 28, 16, 16, COLORS.ruby, COLORS.darkRuby, COLORS.white);
      drawCircle(img, 64, 36, 4, COLORS.white, true);
    } else if (ac.id === 'ac_d') {
      // High-priest magic medallion/necklace
      drawCircle(img, 64, 52, 28, COLORS.silver, false);
      drawCircle(img, 64, 52, 26, COLORS.black, true);
      // Detailed blue tears crystal pendant
      drawShadedBlock(img, 60, 80, 10, 16, ac.color, COLORS.deepBlue, COLORS.white);
    } else if (ac.id === 'ac_c') {
      // Silver metal wrist guard with diamonds
      drawRect(img, 36, 56, 56, 16, ac.color);
      drawShadedBlock(img, 42, 58, 8, 12, COLORS.ruby, COLORS.darkRuby, COLORS.white);
      drawShadedBlock(img, 78, 58, 8, 12, COLORS.sapphire, COLORS.deepBlue, COLORS.white);
    } else if (ac.id === 'ac_a') {
      // Beast Overlord's golden eye jewel
      drawCircle(img, 64, 64, 28, COLORS.gold, true);
      drawCircle(img, 64, 64, 20, COLORS.deepGreen, true);
      drawLine(img, 64, 44, 64, 84, COLORS.black); // Slit pupil of the dragon
      drawPixel(img, 60, 60, COLORS.white);
    } else if (ac.id === 'ac_s') {
      // Heart of the Monarch relic
      drawCircle(img, 64, 64, 32, COLORS.gold, false);
      drawLine(img, 64, 24, 64, 104, COLORS.ruby);
      drawLine(img, 24, 64, 104, 64, COLORS.ruby);
      // Beautiful central diamond crest
      drawLine(img, 64, 36, 92, 64, COLORS.white);
      drawLine(img, 92, 64, 64, 92, COLORS.white);
      drawLine(img, 64, 92, 36, 64, COLORS.white);
      drawLine(img, 36, 64, 64, 36, COLORS.white);
      drawCircle(img, 64, 64, 10, COLORS.crimson, true);
    }
    
    await img.write(path.join(dir, ac.file) as any);
  }

  // 5. GENERATE POTIONS (128x128) - Upgraded size
  const potions = [
    { file: 'potion_hp_small_1780250014790.png', liquidColor: COLORS.crimson },
    { file: 'potion_mana_small_1780250031073.png', liquidColor: COLORS.sapphire },
    { file: 'potion_energy_small_1780250047074.png', liquidColor: COLORS.gold },
    { file: 'potion_hp_medium_1780250060423.png', liquidColor: COLORS.crimson },
    { file: 'potion_mana_medium_1780250073808.png', liquidColor: COLORS.sapphire },
    { file: 'potion_energy_medium_1780250086533.png', liquidColor: COLORS.gold },
    { file: 'potion_hp_large_1780250103936.png', liquidColor: COLORS.crimson },
    { file: 'potion_mana_large_1780250121340.png', liquidColor: COLORS.sapphire },
    { file: 'potion_hp_elixir_b_1780319051507.png', liquidColor: COLORS.crimson },
    { file: 'potion_mana_elixir_b_1780319070962.png', liquidColor: COLORS.sapphire },
    { file: 'potion_hp_yggdrasil_a_1780319087583.png', liquidColor: COLORS.emerald },
    { file: 'potion_mana_star_a_1780319105637.png', liquidColor: COLORS.purple },
    { file: 'potion_hp_essencia_s_1780319121835.png', liquidColor: COLORS.pink },
    { file: 'potion_mana_essencia_s_1780319141836.png', liquidColor: COLORS.white }
  ];

  for (const p of potions) {
    console.log(`Generating Potion ${p.file}...`);
    const img = new Jimp({ width: 128, height: 128, color: COLORS.black });
    
    // Draw Glass Flask
    drawRect(img, 56, 24, 16, 20, COLORS.silver); // Thick neck
    drawRect(img, 54, 20, 20, 6, COLORS.wood); // Wooden cork stopper
    
    // Bulging science flask body
    drawCircle(img, 64, 76, 32, COLORS.silver, false);
    drawCircle(img, 64, 76, 30, p.liquidColor, true); // Bubbling liquid
    
    // Glass reflex shining line
    drawLine(img, 44, 60, 36, 76, COLORS.white);
    drawLine(img, 46, 60, 38, 76, COLORS.white);
    
    await img.write(path.join(dir, p.file) as any);
  }

  // 6. GENERATE ACTIVE SKILLS (128x128) - Upgraded size
  const activeSkills = [
    { file: 'skill_class_e.png', mainColor: COLORS.silver, glowColor: COLORS.slate },
    { file: 'skill_class_d.png', mainColor: COLORS.sapphire, glowColor: COLORS.deepBlue },
    { file: 'skill_class_c.png', mainColor: COLORS.silver, glowColor: COLORS.sapphire },
    { file: 'skill_class_b.png', mainColor: COLORS.flameOrange, glowColor: COLORS.crimson },
    { file: 'skill_class_a.png', mainColor: COLORS.emerald, glowColor: COLORS.deepGreen },
    { file: 'skill_class_s.png', mainColor: COLORS.crimson, glowColor: COLORS.gold }
  ];

  for (const s of activeSkills) {
    console.log(`Generating Skill ${s.file}...`);
    const img = new Jimp({ width: 128, height: 128, color: COLORS.black });
    
    // Runic border frame
    drawRect(img, 8, 8, 112, 112, s.glowColor);
    drawRect(img, 14, 14, 100, 100, COLORS.black);
    
    // Draw stylized pixel action graphics
    if (s.file.includes('class_e')) {
      // Double sword slash strike
      drawLine(img, 24, 24, 104, 104, COLORS.white);
      drawLine(img, 24, 36, 92, 104, COLORS.silver);
    } else if (s.file.includes('class_d')) {
      // Magic fire meteor blast
      drawCircle(img, 64, 64, 20, COLORS.white, true);
      drawCircle(img, 64, 64, 12, COLORS.sapphire, true);
      drawLine(img, 64, 64, 24, 24, COLORS.sapphire);
      drawLine(img, 64, 64, 104, 104, COLORS.sapphire);
    } else if (s.file.includes('class_c')) {
      // X-Slash critical
      drawLine(img, 24, 24, 104, 104, COLORS.white);
      drawLine(img, 104, 24, 24, 104, COLORS.silver);
    } else if (s.file.includes('class_b')) {
      // Flaming eruptions
      drawLine(img, 64, 20, 64, 108, COLORS.flameOrange);
      drawCircle(img, 64, 64, 16, COLORS.gold, true);
    } else if (s.file.includes('class_a')) {
      // Beast claw slashes
      drawLine(img, 32, 24, 32, 104, COLORS.emerald);
      drawLine(img, 64, 24, 64, 104, COLORS.emerald);
      drawLine(img, 96, 24, 96, 104, COLORS.emerald);
    } else if (s.file.includes('class_s')) {
      // Universe split nebula tear
      drawRect(img, 16, 60, 96, 8, COLORS.white);
      drawCircle(img, 64, 64, 28, COLORS.crimson, false);
    }
    
    await img.write(path.join(dir, s.file) as any);
  }

  // 7. GENERATE PASSIVE SKILLS (128x128) - Upgraded size
  const passiveSkills = [
    { file: 'skill_pass_e.png', mainColor: COLORS.slate, glowColor: COLORS.void },
    { file: 'skill_pass_d.png', mainColor: COLORS.gold, glowColor: COLORS.lightGold },
    { file: 'skill_pass_c.png', mainColor: COLORS.crimson, glowColor: COLORS.ruby },
    { file: 'skill_pass_b.png', mainColor: COLORS.purple, glowColor: COLORS.deepPurple },
    { file: 'skill_pass_a.png', mainColor: COLORS.emerald, glowColor: COLORS.deepGreen },
    { file: 'skill_pass_s.png', mainColor: COLORS.pink, glowColor: COLORS.sapphire }
  ];

  for (const s of passiveSkills) {
    console.log(`Generating Passive ${s.file}...`);
    const img = new Jimp({ width: 128, height: 128, color: COLORS.black });
    
    // Circular passive magical framework
    drawCircle(img, 64, 64, 52, s.mainColor, false);
    drawCircle(img, 64, 64, 48, COLORS.void, true);
    
    if (s.file.includes('pass_e')) {
      // XP tome of wisdom
      drawRect(img, 36, 40, 56, 48, COLORS.wood);
      drawRect(img, 40, 44, 22, 40, COLORS.white);
      drawRect(img, 66, 44, 22, 40, COLORS.white);
    } else if (s.file.includes('pass_d')) {
      // Treasure hunter gold sack
      drawCircle(img, 64, 68, 20, COLORS.gold, true);
      drawLine(img, 52, 48, 76, 48, COLORS.copper);
    } else if (s.file.includes('pass_c')) {
      // Skull threatening instinct
      drawCircle(img, 64, 60, 16, COLORS.white, true);
      drawRect(img, 56, 76, 16, 12, COLORS.white);
      drawPixel(img, 58, 60, COLORS.black); // Left eye
      drawPixel(img, 70, 60, COLORS.black); // Right eye
    } else if (s.file.includes('pass_b')) {
      // Oracle magical seeing eye
      drawLine(img, 32, 64, 64, 32, COLORS.purple);
      drawLine(img, 64, 32, 96, 64, COLORS.purple);
      drawLine(img, 96, 64, 64, 96, COLORS.purple);
      drawLine(img, 64, 96, 32, 64, COLORS.purple);
      drawCircle(img, 64, 64, 12, COLORS.white, true);
      drawCircle(img, 64, 64, 6, COLORS.sapphire, true);
    } else if (s.file.includes('pass_a')) {
      // troll health heart regeneration matrix
      drawCircle(img, 64, 64, 20, COLORS.emerald, true);
      drawCircle(img, 64, 64, 8, COLORS.white, true);
    } else if (s.file.includes('pass_s')) {
      // Mana core star matrices
      drawLine(img, 64, 32, 88, 64, COLORS.sapphire);
      drawLine(img, 88, 64, 64, 96, COLORS.sapphire);
      drawLine(img, 64, 96, 40, 64, COLORS.sapphire);
      drawLine(img, 40, 64, 64, 32, COLORS.sapphire);
      drawCircle(img, 64, 64, 12, COLORS.white, true);
    }
    
    await img.write(path.join(dir, s.file) as any);
  }

  // 8. GENERATE PORTAL MONSTERS (128x128) - IDEAL RE-RENDER (SOLID BLACK BACKGROUNDS)
  // Generating idle, attack, and death states for every single portal boss
  const monsters = [
    { name: 'Golem de Pedra (Idle)', file: 'golem_pedra_idle_1780318614464.png', color: COLORS.slate, type: 'golem' },
    { name: 'Golem de Pedra (Attack)', file: 'golem_pedra_attack_1780318638387.png', color: COLORS.slate, type: 'golem', attack: true },
    { name: 'Golem de Pedra (Death)', file: 'golem_pedra_death_1780318614464.png', color: COLORS.slate, type: 'golem', death: true },
    
    { name: 'Gigante de Aço (Idle)', file: 'gigante_aco_idle_1780318657036.png', color: COLORS.slate, type: 'giant' },
    { name: 'Gigante de Aço (Attack)', file: 'gigante_aco_attack_1780318674639.png', color: COLORS.slate, type: 'giant', attack: true },
    { name: 'Gigante de Aço (Death)', file: 'gigante_aco_death_1780318657036.png', color: COLORS.slate, type: 'giant', death: true },

    { name: 'Golem das Jóias (Idle)', file: 'golem_joias_idle_1780318689252.png', color: COLORS.gold, type: 'gem_golem' }, 
    { name: 'Golem das Jóias (Attack)', file: 'golem_joias_attack_1780318708000.png', color: COLORS.gold, type: 'gem_golem', attack: true },
    { name: 'Golem das Jóias (Death)', file: 'golem_joias_death_1780318689252.png', color: COLORS.gold, type: 'gem_golem', death: true },
    
    { name: 'Orc Guerreiro (Idle)', file: 'orc_guerreiro_idle_1780318725584.png', color: COLORS.emerald, type: 'orc' },
    { name: 'Orc Guerreiro (Attack)', file: 'orc_guerreiro_attack_1780318741939.png', color: COLORS.emerald, type: 'orc', attack: true },
    { name: 'Orc Guerreiro (Death)', file: 'orc_guerreiro_death_1780318725584.png', color: COLORS.emerald, type: 'orc', death: true },

    { name: 'Orque Supremo (Idle)', file: 'orque_supremo_idle_1780318760867.png', color: COLORS.void, type: 'overlord' },
    { name: 'Orque Supremo (Attack)', file: 'orque_supremo_attack_1780318777496.png', color: COLORS.void, type: 'overlord', attack: true },
    { name: 'Orque Supremo (Death)', file: 'orque_supremo_death_1780318760867.png', color: COLORS.void, type: 'overlord', death: true },

    { name: 'Assassino Sombrio (Idle)', file: 'assassino_sombrio_idle_1780318793728.png', color: COLORS.deepPurple, type: 'assassin' },
    { name: 'Assassino Sombrio (Attack)', file: 'assassino_sombrio_attack_1780318810121.png', color: COLORS.deepPurple, type: 'assassin', attack: true },
    { name: 'Assassino Sombrio (Death)', file: 'assassino_sombrio_death_1780318793728.png', color: COLORS.deepPurple, type: 'assassin', death: true },

    { name: 'Espectro Superior (Idle)', file: 'espectro_superior_idle_1780318827564.png', color: COLORS.sapphire, type: 'wraith' },
    { name: 'Espectro Superior (Attack)', file: 'espectro_superior_attack_1780318845628.png', color: COLORS.sapphire, type: 'wraith', attack: true },
    { name: 'Espectro Superior (Death)', file: 'espectro_superior_death_1780318827564.png', color: COLORS.sapphire, type: 'wraith', death: true },

    { name: 'Arquimago Lich (Idle)', file: 'arquimago_lich_idle_1780318862853.png', color: COLORS.ruby, type: 'lich' },
    { name: 'Arquimago Lich (Attack)', file: 'arquimago_lich_attack_1780318879583.png', color: COLORS.ruby, type: 'lich', attack: true },
    { name: 'Arquimago Lich (Death)', file: 'arquimago_lich_death_1780318862853.png', color: COLORS.ruby, type: 'lich', death: true },

    { name: 'Anjo Caído (Idle)', file: 'anjo_caido_idle_1780318899017.png', color: COLORS.crimson, type: 'angel' },
    { name: 'Anjo Caído (Attack)', file: 'anjo_caido_attack_1780318918232.png', color: COLORS.crimson, type: 'angel', attack: true },
    { name: 'Anjo Caído (Death)', file: 'anjo_caido_death_1780318899017.png', color: COLORS.crimson, type: 'angel', death: true },

    { name: 'Cavaleiro do Caos (Idle)', file: 'cavaleiro_caos_idle_1780318935174.png', color: COLORS.void, type: 'knight' },
    { name: 'Cavaleiro do Caos (Attack)', file: 'cavaleiro_caos_attack_1780318954886.png', color: COLORS.void, type: 'knight', attack: true },
    { name: 'Cavaleiro do Caos (Death)', file: 'cavaleiro_caos_death_1780318935174.png', color: COLORS.void, type: 'knight', death: true },

    { name: 'Lorde Dragão Antigo (Idle)', file: 'dragao_antigo_idle_1780318972517.png', color: COLORS.crimson, type: 'dragon' },
    { name: 'Lorde Dragão Antigo (Attack)', file: 'dragao_antigo_attack_1780318990107.png', color: COLORS.crimson, type: 'dragon', attack: true },
    { name: 'Lorde Dragão Antigo (Death)', file: 'dragao_antigo_death_1780318972517.png', color: COLORS.crimson, type: 'dragon', death: true },

    { name: 'Fragmento do Arquiteto (Idle)', file: 'fragmento_arquiteto_idle_1780319007009.png', color: COLORS.pink, type: 'architect' },
    { name: 'Fragmento do Arquiteto (Attack)', file: 'fragmento_arquiteto_attack_1780319026408.png', color: COLORS.pink, type: 'architect', attack: true },
    { name: 'Fragmento do Arquiteto (Death)', file: 'fragmento_arquiteto_death_1780319007009.png', color: COLORS.pink, type: 'architect', death: true }
  ];

  for (const m of monsters) {
    console.log(`Generating Boss Sprite: ${m.name}...`);
    const img = new Jimp({ width: 128, height: 128, color: COLORS.black });
    
    const attackOffset = m.attack ? 12 : 0;
    
    // Grey-scale filter / Soul Dissolving crumbling for the DEATH frame state
    const spriteColor = m.death ? COLORS.darkSilver : m.color;
    const bodyGlowColor = m.death ? COLORS.void : COLORS.ruby;
    
    if (m.type === 'golem') {
      // Rock Golem body
      drawRect(img, 44 - attackOffset, 42, 40, 48, spriteColor); 
      drawRect(img, 40 - attackOffset, 32, 48, 10, m.death ? COLORS.darkSilver : COLORS.slate); // Shoulder plates
      
      if (!m.death) {
        drawCircle(img, 64 - attackOffset, 37, 3, COLORS.crimson, true); // Glowing cyclopian eye
        // Cracked energy fractures on rocky surface
        drawLine(img, 46 - attackOffset, 46, 54 - attackOffset, 64, COLORS.black);
        drawLine(img, 72 - attackOffset, 56, 80 - attackOffset, 78, COLORS.black);
      } else {
        // Skull crack / fracture decay overlay
        drawLine(img, 44, 42, 84, 90, COLORS.black);
        drawLine(img, 84, 42, 44, 90, COLORS.black);
      }
    } else if (m.type === 'giant') {
      // Knight Titan
      drawRect(img, 38 - attackOffset, 44, 52, 58, spriteColor);
      drawCircle(img, 64 - attackOffset, 32, 12, m.death ? COLORS.darkSilver : COLORS.silver, true);
      
      if (!m.death) {
        drawRect(img, 62 - attackOffset, 30, 4, 4, COLORS.ruby); // helmet crown visor
        if (m.attack) {
          drawLine(img, 18, 18, 106, 106, COLORS.white); // Giant metal sword slash vector
        } else {
          drawLine(img, 94, 26, 94, 102, COLORS.gold); // Resting colossal sword
        }
      } else {
        // Crumbling head severed
        drawCircle(img, 78, 92, 10, COLORS.darkSilver, true);
      }
    } else if (m.type === 'gem_golem') {
      // Golden Golem encrusted with bright gems
      drawRect(img, 38 - attackOffset, 44, 52, 58, spriteColor);
      drawCircle(img, 64 - attackOffset, 32, 12, spriteColor, true);
      
      if (!m.death) {
        // Encrusted jewels (glistening)
        drawCircle(img, 52 - attackOffset, 58, 4, COLORS.ruby, true);
        drawCircle(img, 76 - attackOffset, 58, 4, COLORS.sapphire, true);
        drawCircle(img, 64 - attackOffset, 78, 4, COLORS.emerald, true);
        if (m.attack) {
          drawCircle(img, 64, 90, 16, COLORS.white, false); // Ground impact ripples
        }
      } else {
        // Scattered gems tattered on floor
        for (let i = 20; i < 110; i += 15) {
          drawCircle(img, i, 100, 3, COLORS.silver, true);
        }
      }
    } else if (m.type === 'orc') {
      // Orc combatant
      drawCircle(img, 64 - attackOffset, 42, 20, m.death ? COLORS.darkSilver : COLORS.emerald, true);
      drawRect(img, 34 - attackOffset, 60, 60, 46, m.death ? COLORS.darkSilver : COLORS.wood); // Chest hide
      
      if (!m.death) {
        drawRect(img, 52 - attackOffset, 38, 4, 4, COLORS.white); // tusks
        drawRect(img, 72 - attackOffset, 38, 4, 4, COLORS.white);
        if (m.attack) {
          drawLine(img, 14, 32, 52, 82, COLORS.crimson); // Swing blood trail
        } else {
          drawRect(img, 96, 46, 16, 16, COLORS.silver); // Massive metal iron axe
          drawLine(img, 104, 32, 104, 106, COLORS.wood);
        }
      } else {
        drawLine(img, 32, 102, 96, 102, COLORS.ruby); // Pool of monster defeat blood
      }
    } else if (m.type === 'overlord') {
      // Sovereign supreme orc king
      drawCircle(img, 64 - attackOffset, 42, 24, m.death ? COLORS.darkSilver : COLORS.void, true);
      drawRect(img, 30 - attackOffset, 62, 68, 46, spriteColor);
      
      if (!m.death) {
        // Crimson bone horns / crown
        drawLine(img, 48, 28, 32, 12, COLORS.gold);
        drawLine(img, 80, 28, 96, 12, COLORS.gold);
        if (m.attack) {
          drawCircle(img, 64, 84, 24, COLORS.purple, false); // Screaming purple magical shockwave ripples
        }
      } else {
        // Shattered horns lying on ground
        drawLine(img, 40, 104, 56, 104, COLORS.darkSilver);
      }
    } else if (m.type === 'assassin') {
      // Phantasmal assassin shroud
      drawCircle(img, 64 - attackOffset, 42, 16, m.death ? COLORS.darkSilver : COLORS.deepPurple, true);
      drawRect(img, 46 - attackOffset, 42, 36, 64, COLORS.black);
      
      if (!m.death) {
        drawCircle(img, 58 - attackOffset, 40, 2, COLORS.purple, true); // visor glowing dots
        drawCircle(img, 70 - attackOffset, 40, 2, COLORS.purple, true);
        // Dual violet energy daggers
        drawLine(img, 26, 72, 38, 60, COLORS.pink);
        drawLine(img, 102, 72, 90, 60, COLORS.pink);
      } else {
        // Disintegrating particles fading
        for (let i = 0; i < 25; i++) {
          const rx = 30 + Math.floor(Math.random() * 68);
          const ry = 40 + Math.floor(Math.random() * 60);
          drawPixel(img, rx, ry, COLORS.purple);
        }
      }
    } else if (m.type === 'wraith') {
      // Facehooded spectral specter
      drawCircle(img, 64 - attackOffset, 36, 14, COLORS.void, true);
      drawCircle(img, 64 - attackOffset, 36, 12, m.death ? COLORS.darkSilver : COLORS.deepBlue, true);
      drawRect(img, 44 - attackOffset, 36, 40, 50, m.death ? COLORS.darkSilver : COLORS.deepBlue);
      
      if (!m.death) {
        drawPixel(img, 60 - attackOffset, 34, COLORS.white); // Glistening soul eyes
        drawPixel(img, 68 - attackOffset, 34, COLORS.white);
        // Spectral steel scythe
        drawLine(img, 24, 24, 24, 104, COLORS.wood);
        drawLine(img, 24, 24, 84, 40, COLORS.silver);
      } else {
        // Fading dust dissolution vectors
        for (let i = 0; i < 20; i++) {
          const ry = 30 + Math.floor(Math.random() * 70);
          drawLine(img, 40, ry, 88, ry, COLORS.black);
        }
      }
    } else if (m.type === 'lich') {
      // Undead lich lord ruler
      drawCircle(img, 64 - attackOffset, 36, 16, m.death ? COLORS.darkSilver : COLORS.silver, true); // Bare skull
      drawRect(img, 56 - attackOffset, 20, 16, 6, COLORS.gold); // ancient crown
      drawRect(img, 38 - attackOffset, 52, 52, 56, m.death ? COLORS.void : COLORS.ruby); // decayed royal gown
      
      if (!m.death) {
        drawPixel(img, 60 - attackOffset, 36, COLORS.crimson); // burning sockets
        drawPixel(img, 68 - attackOffset, 36, COLORS.crimson);
        // Staff of power
        drawLine(img, 108, 18, 108, 110, COLORS.wood);
        drawCircle(img, 108, 18, 7, COLORS.pink, true);
      } else {
        // Skull broken in half
        drawLine(img, 52, 34, 76, 34, COLORS.black);
      }
    } else if (m.type === 'angel') {
      // Fallen Angel with dark halos
      drawCircle(img, 64 - attackOffset, 36, 12, m.death ? COLORS.darkSilver : COLORS.silver, true);
      drawCircle(img, 64 - attackOffset, 18, 9, COLORS.black, false); // inverted halo
      drawRect(img, 46 - attackOffset, 44, 36, 56, COLORS.void);
      
      // Six long angel wings
      drawLine(img, 42, 46, 14, 20, COLORS.black);
      drawLine(img, 42, 56, 10, 46, COLORS.black);
      drawLine(img, 86, 46, 114, 20, COLORS.black);
      drawLine(img, 86, 56, 118, 46, COLORS.black);
      
      if (m.death) {
        // Fallen broken wings
        drawLine(img, 14, 20, 14, 100, COLORS.ruby);
        drawLine(img, 114, 20, 114, 100, COLORS.ruby);
      }
    } else if (m.type === 'knight') {
      // Chaos Plate Knight
      drawRect(img, 38 - attackOffset, 40, 52, 66, COLORS.void);
      drawCircle(img, 64 - attackOffset, 26, 12, COLORS.void, true);
      
      if (!m.death) {
        drawLine(img, 56 - attackOffset, 26, 72 - attackOffset, 26, COLORS.crimson); // visor glow line
        if (m.attack) {
          drawLine(img, 14, 14, 102, 102, COLORS.crimson); // Flame sword splash trail
        } else {
          drawLine(img, 100, 16, 100, 110, COLORS.crimson);
        }
      } else {
        // Disorganized armor plates scattered
        drawRect(img, 38, 80, 24, 14, COLORS.darkSilver);
        drawRect(img, 72, 86, 20, 12, COLORS.darkSilver);
      }
    } else if (m.type === 'dragon') {
      // Ancient crimson dragon head
      drawCircle(img, 64, 58, 32, spriteColor, true); // Thick dragon skull
      
      // horns
      drawLine(img, 48, 30, 22, 14, COLORS.gold);
      drawLine(img, 80, 30, 106, 14, COLORS.gold);
      drawRect(img, 46, 54, 36, 28, m.death ? COLORS.darkSilver : COLORS.crimson); // Snout
      
      if (!m.death) {
        if (m.attack) {
          drawCircle(img, 64, 100, 22, COLORS.flameOrange, true); // Fire blast eruption
        }
      } else {
        // Severed dragon wing/teeth
        drawLine(img, 32, 90, 96, 90, COLORS.ruby);
      }
    } else if (m.type === 'architect') {
      // Glitching system architect monolith
      drawRect(img, 44 - attackOffset, 24, 40, 80, COLORS.void);
      drawRect(img, 46 - attackOffset, 26, 36, 76, m.death ? COLORS.darkSilver : COLORS.sapphire);
      
      if (!m.death) {
        // Neon glyph matrix lines glowing
        for (let y = 32; y < 96; y += 12) {
          drawPixel(img, 54 - attackOffset, y, COLORS.white);
          drawPixel(img, 74 - attackOffset, y + 4, COLORS.white);
        }
      } else {
        // Completely fractured / shattered glass effect
        drawLine(img, 44, 24, 84, 104, COLORS.black);
        drawLine(img, 84, 24, 44, 104, COLORS.black);
      }
    }
    
    await img.write(path.join(dir, m.file) as any);
  }
  
  console.log("Successfully generated all premium game assets!");
}

generateAll().catch(err => {
  console.error("Critical: Failed to generate assets:", err);
});
