import { Jimp } from 'jimp';
import fs from 'fs';
import path from 'path';

// Rich color palette for crisp retro pixel art
const COLORS = {
  black: 0x000000ff,
  transparent: 0x00000000,
  
  // Stone Golem palette (deep stone blues, slate, neon cyan magic)
  stoneLight: 0xa1a8b9ff,
  stoneMid: 0x64748bff,
  stoneDark: 0x334155ff,
  stoneShadow: 0x1e293bff,
  stoneOutline: 0x0f172aff,
  runeNeon: 0x38bdf8ff,
  runeGlow: 0x0ea5e9ff,
  runeDark: 0x0369a1ff,

  // Steel Giant palette (metallic blues/purples, hot orange/crimson visor, silver)
  steelWhite: 0xf8fafcf1,
  steelLight: 0xcbcedeff,
  steelMid: 0x6e7c99ff,
  steelDark: 0x3b4461ff,
  steelShadow: 0x1d2130ff,
  steelOutline: 0x0c0d14ff,
  visorRed: 0xf43f5eff,
  visorGlow: 0xe11d48ff,
  goldTrim: 0xfacc15ff,
  goldShadow: 0xca8a04ff,

  // Jewel Golem palette (glistening gold base, rubies, amethysts, emeralds)
  goldLight: 0xfef08aff,
  goldMid: 0xeab308ff,
  goldDark: 0xa16207ff,
  jewelGoldShadow: 0x713f12ff,
  jewelBlue: 0x3b82f6ff,
  jewelBlueGlow: 0x60a5faff,
  jewelRed: 0xef4444ff,
  jewelRedGlow: 0xfca5a5ff,
  jewelGreen: 0x10b981ff,
  jewelGreenGlow: 0x34d399ff,
  jewelPurple: 0xa855f7ff,
  jewelPurpleGlow: 0xc084fcff,
  
  white: 0xffffffff,
  silver: 0xe2e8f0ff,
  darkRed: 0x991b1bff,
  slashWhite: 0xffffffdd,
  slashCyan: 0x38bdf888
};

const dir = path.join(process.cwd(), 'src/assets/images');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Draw a single physical pixel
function setPx(img: any, x: number, y: number, color: number) {
  if (x >= 0 && x < img.bitmap.width && y >= 0 && y < img.bitmap.height) {
    img.setPixelColor(color, x, y);
  }
}

// Draw a scaling square pixel block to preserve pixelation
function drawBlock(img: any, cx: number, cy: number, size: number, color: number) {
  for (let dy = 0; dy < size; dy++) {
    for (let dx = 0; dx < size; dx++) {
      setPx(img, cx + dx, cy + dy, color);
    }
  }
}

// Custom thick line drawing
function drawPixelLine(img: any, x0: number, y0: number, x1: number, y1: number, color: number, strokeWidth = 1) {
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  while (true) {
    for (let w = 0; w < strokeWidth; w++) {
      setPx(img, x0 + w, y0, color);
      setPx(img, x0, y0 + w, color);
    }
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

function drawPixelCircle(img: any, xc: number, yc: number, r: number, color: number, fill = false) {
  let x = 0;
  let y = r;
  let d = 3 - 2 * r;
  
  const drawSecs = (xc: number, yc: number, x: number, y: number, color: number, fill: boolean) => {
    if (fill) {
      drawPixelLine(img, xc - x, yc + y, xc + x, yc + y, color);
      drawPixelLine(img, xc - x, yc - y, xc + x, yc - y, color);
      drawPixelLine(img, xc - y, yc + x, xc + y, yc + x, color);
      drawPixelLine(img, xc - y, yc - x, xc + y, yc - x, color);
    } else {
      setPx(img, xc + x, yc + y, color);
      setPx(img, xc - x, yc + y, color);
      setPx(img, xc + x, yc - y, color);
      setPx(img, xc - x, yc - y, color);
      setPx(img, xc + y, yc + x, color);
      setPx(img, xc - y, yc + x, color);
      setPx(img, xc + y, yc - x, color);
      setPx(img, xc - y, yc - x, color);
    }
  };

  drawSecs(xc, yc, x, y, color, fill);
  while (y >= x) {
    x++;
    if (d > 0) {
      y--;
      d = d + 4 * (x - y) + 10;
    } else {
      d = d + 4 * x + 6;
    }
    drawSecs(xc, yc, x, y, color, fill);
  }
}

// Robust shaded polygons or banners for characters
function drawTexturedPlate(img: any, x: number, y: number, w: number, h: number, baseColor: number, shadowColor: number, highlightColor: number, outlineColor: number) {
  // Outline
  drawPixelLine(img, x - 1, y - 1, x + w, y - 1, outlineColor);
  drawPixelLine(img, x - 1, y + h, x + w, y + h, outlineColor);
  drawPixelLine(img, x - 1, y, x - 1, y + h - 1, outlineColor);
  drawPixelLine(img, x + w, y, x + w, y + h - 1, outlineColor);

  // Main rect fill
  for (let dy = 0; dy < h; dy++) {
    for (let dx = 0; dx < w; dx++) {
      setPx(img, x + dx, y + dy, baseColor);
    }
  }

  // Highlights top/left
  drawPixelLine(img, x, y, x + w - 2, y, highlightColor);
  drawPixelLine(img, x, y, x, y + h - 2, highlightColor);

  // Shadows bottom/right
  drawPixelLine(img, x, y + h - 1, x + w - 1, y + h - 1, shadowColor);
  drawPixelLine(img, x + w - 1, y, x + w - 1, y + h - 1, shadowColor);
}

// Generate the specific high-detail files for Portal C
async function generateStoneGolem() {
  // 1. GOLEM DE PEDRA - IDLE
  console.log("Generating Golem de Pedra - IDLE...");
  const imgIdle = new Jimp({ width: 128, height: 128, color: COLORS.black });
  
  // Draw glowing magical runic environment spikes
  drawPixelCircle(imgIdle, 64, 110, 36, COLORS.stoneShadow, true);
  
  // Golem Body Composition
  // Base outlines & structure
  // Torso
  drawTexturedPlate(imgIdle, 36, 48, 56, 44, COLORS.stoneMid, COLORS.stoneDark, COLORS.stoneLight, COLORS.stoneOutline);
  // Head Boulder
  drawTexturedPlate(imgIdle, 48, 22, 32, 26, COLORS.stoneMid, COLORS.stoneDark, COLORS.stoneLight, COLORS.stoneOutline);
  // Left Arm Boulder
  drawTexturedPlate(imgIdle, 14, 42, 22, 48, COLORS.stoneMid, COLORS.stoneDark, COLORS.stoneLight, COLORS.stoneOutline);
  // Right Arm Boulder
  drawTexturedPlate(imgIdle, 92, 42, 22, 48, COLORS.stoneMid, COLORS.stoneDark, COLORS.stoneLight, COLORS.stoneOutline);
  // Heavy legs
  drawTexturedPlate(imgIdle, 42, 92, 20, 22, COLORS.stoneDark, COLORS.stoneShadow, COLORS.stoneMid, COLORS.stoneOutline);
  drawTexturedPlate(imgIdle, 66, 92, 20, 22, COLORS.stoneDark, COLORS.stoneShadow, COLORS.stoneMid, COLORS.stoneOutline);

  // Stone details: cracks, runic carvings
  // Glowing blue magma core in chest cavity
  drawPixelCircle(imgIdle, 64, 70, 10, COLORS.runeDark, true);
  drawPixelCircle(imgIdle, 64, 70, 7, COLORS.runeGlow, true);
  drawPixelCircle(imgIdle, 64, 70, 3, COLORS.runeNeon, true);
  drawPixelCircle(imgIdle, 64, 70, 1, COLORS.white, true);

  // Glowing eyes
  drawBlock(imgIdle, 56, 32, 3, COLORS.runeNeon);
  drawBlock(imgIdle, 68, 32, 3, COLORS.runeNeon);
  
  // Runes on head & shoulders
  drawPixelLine(imgIdle, 50, 24, 78, 24, COLORS.runeGlow);
  drawPixelLine(imgIdle, 38, 54, 46, 54, COLORS.runeGlow);
  drawPixelLine(imgIdle, 82, 54, 90, 54, COLORS.runeGlow);

  // Surface texture / Cracks
  drawPixelLine(imgIdle, 20, 48, 20, 70, COLORS.stoneOutline);
  drawPixelLine(imgIdle, 106, 48, 106, 70, COLORS.stoneOutline);
  drawPixelLine(imgIdle, 50, 76, 78, 76, COLORS.stoneOutline);

  await imgIdle.write(path.join(dir, 'golem_pedra_idle_1780318614464.png') as any);

  // 2. GOLEM DE PEDRA - ATTACK
  console.log("Generating Golem de Pedra - ATTACK...");
  const imgAtk = new Jimp({ width: 128, height: 128, color: COLORS.black });
  
  // Giant wind pressure vectors & dust particles
  for (let i = 0; i < 20; i++) {
    const rx = 10 + Math.floor(Math.random() * 108);
    const ry = 80 + Math.floor(Math.random() * 30);
    drawBlock(imgAtk, rx, ry, 2, COLORS.stoneLight);
  }

  // Dynamic ground slam action pose (shifted arms)
  // Left arm raised high, right arm slamming down
  drawTexturedPlate(imgAtk, 30, 54, 56, 44, COLORS.stoneMid, COLORS.stoneDark, COLORS.stoneLight, COLORS.stoneOutline);
  drawTexturedPlate(imgAtk, 44, 28, 32, 26, COLORS.stoneMid, COLORS.stoneDark, COLORS.stoneLight, COLORS.stoneOutline);
  
  // Left Arm Raised
  drawTexturedPlate(imgAtk, 10, 16, 24, 44, COLORS.stoneMid, COLORS.stoneDark, COLORS.stoneLight, COLORS.stoneOutline);
  // Right Arm Slamming Down (Giant fist)
  drawTexturedPlate(imgAtk, 88, 56, 32, 48, COLORS.stoneMid, COLORS.runeDark, COLORS.stoneLight, COLORS.stoneOutline);
  
  // Legs
  drawTexturedPlate(imgAtk, 34, 98, 20, 18, COLORS.stoneDark, COLORS.stoneShadow, COLORS.stoneMid, COLORS.stoneOutline);
  drawTexturedPlate(imgAtk, 62, 98, 20, 18, COLORS.stoneDark, COLORS.stoneShadow, COLORS.stoneMid, COLORS.stoneOutline);

  // Slam crater shockwaves
  drawPixelCircle(imgAtk, 104, 104, 18, COLORS.runeNeon, false);
  drawPixelCircle(imgAtk, 104, 104, 12, COLORS.runeGlow, false);
  drawPixelCircle(imgAtk, 104, 104, 6, COLORS.white, true);

  // Furious Red/Orange flare inside the neon eye slit to symbolize rage
  drawBlock(imgAtk, 52, 38, 4, COLORS.runeNeon);
  drawBlock(imgAtk, 66, 38, 4, COLORS.runeNeon);

  // Glowing rune tracks discharging lightnings
  drawPixelLine(imgAtk, 10, 36, 30, 56, COLORS.runeNeon);
  drawPixelLine(imgAtk, 88, 70, 120, 70, COLORS.runeNeon);

  await imgAtk.write(path.join(dir, 'golem_pedra_attack_1780318638387.png') as any);

  // 3. GOLEM DE PEDRA - DEATH
  console.log("Generating Golem de Pedra - DEATH...");
  const imgDeath = new Jimp({ width: 128, height: 128, color: COLORS.black });
  
  // The Stone Giant shattered to debris!
  // Scattered crumbling stone parts across the ground
  drawTexturedPlate(imgDeath, 12, 102, 24, 16, COLORS.stoneDark, COLORS.stoneOutline, COLORS.stoneMid, COLORS.stoneOutline); // broken arm
  drawTexturedPlate(imgDeath, 92, 104, 26, 16, COLORS.stoneDark, COLORS.stoneOutline, COLORS.stoneMid, COLORS.stoneOutline); // broken grip
  
  // Ruptured, cracked torso lying flat
  drawTexturedPlate(imgDeath, 38, 86, 52, 28, COLORS.stoneDark, COLORS.stoneOutline, COLORS.stoneMid, COLORS.stoneOutline);
  
  // Head severed, rolls off, neon eyes turned completely dark/grey, runes cracked in half
  drawTexturedPlate(imgDeath, 50, 58, 26, 20, COLORS.stoneDark, COLORS.stoneOutline, COLORS.stoneMid, COLORS.stoneOutline);
  drawPixelLine(imgDeath, 52, 64, 74, 76, COLORS.stoneOutline, 2); // crack across head
  
  // Cyan sparks escaping the broken magic core (dissolving particles)
  for (let i = 0; i < 30; i++) {
    const px = 20 + Math.floor(Math.random() * 88);
    const py = 30 + Math.floor(Math.random() * 66);
    setPx(imgDeath, px, py, COLORS.runeGlow);
    setPx(imgDeath, px + 1, py + 1, COLORS.white);
  }

  await imgDeath.write(path.join(dir, 'golem_pedra_death_1780318614464.png') as any);
}

async function generateSteelGiant() {
  // 1. GIGANTE DE AÇO - IDLE
  console.log("Generating Gigante de Aço - IDLE...");
  const imgIdle = new Jimp({ width: 128, height: 128, color: COLORS.black });

  // Draw iron structure
  // Crown helmet
  drawTexturedPlate(imgIdle, 50, 18, 28, 28, COLORS.steelMid, COLORS.steelDark, COLORS.steelLight, COLORS.steelOutline);
  // Visor Slit
  drawPixelLine(imgIdle, 54, 32, 74, 32, COLORS.steelOutline, 3);
  drawPixelLine(imgIdle, 58, 32, 70, 32, COLORS.visorRed, 1); // glowing crimson eye
  
  // Shoulder Pauldrons (Gold rims!)
  drawTexturedPlate(imgIdle, 22, 42, 22, 22, COLORS.goldTrim, COLORS.goldShadow, COLORS.white, COLORS.steelOutline);
  drawTexturedPlate(imgIdle, 84, 42, 22, 22, COLORS.goldTrim, COLORS.goldShadow, COLORS.white, COLORS.steelOutline);
  
  // Breastplate Heavy Iron
  drawTexturedPlate(imgIdle, 40, 44, 48, 52, COLORS.steelMid, COLORS.steelDark, COLORS.steelLight, COLORS.steelOutline);
  
  // Giant arm guards
  drawTexturedPlate(imgIdle, 14, 60, 18, 40, COLORS.steelMid, COLORS.steelDark, COLORS.steelLight, COLORS.steelOutline);
  drawTexturedPlate(imgIdle, 96, 60, 18, 40, COLORS.steelMid, COLORS.steelDark, COLORS.steelLight, COLORS.steelOutline);
  
  // Standing legs
  drawTexturedPlate(imgIdle, 44, 96, 18, 24, COLORS.steelDark, COLORS.steelShadow, COLORS.steelMid, COLORS.steelOutline);
  drawTexturedPlate(imgIdle, 66, 96, 18, 24, COLORS.steelDark, COLORS.steelShadow, COLORS.steelMid, COLORS.steelOutline);

  // Colossal steel greatsword strapped to back or side
  drawPixelLine(imgIdle, 110, 14, 110, 100, COLORS.steelDark, 3);
  drawPixelLine(imgIdle, 109, 12, 111, 12, COLORS.goldTrim, 1); // Pommel

  await imgIdle.write(path.join(dir, 'gigante_aco_idle_1780318657036.png') as any);

  // 2. GIGANTE DE AÇO - ATTACK
  console.log("Generating Gigante de Aço - ATTACK...");
  const imgAtk = new Jimp({ width: 128, height: 128, color: COLORS.black });

  // Colossal swipe arc trail (epic action slash look)
  for (let r = 38; r < 58; r += 2) {
    drawPixelCircle(imgAtk, 60, 60, r, COLORS.slashWhite, false);
    drawPixelCircle(imgAtk, 60, 61, r - 3, COLORS.steelLight, false);
  }

  // Giant action body shifted forward (fast attack lunging)
  drawTexturedPlate(imgAtk, 18, 54, 48, 48, COLORS.steelMid, COLORS.steelDark, COLORS.steelLight, COLORS.steelOutline);
  drawTexturedPlate(imgAtk, 24, 28, 24, 26, COLORS.steelMid, COLORS.steelDark, COLORS.steelLight, COLORS.steelOutline);
  
  // Slanted crimson visor line for aggressive action
  drawPixelLine(imgAtk, 30, 40, 44, 40, COLORS.visorGlow, 2);
  
  // Arm swinging greatsword
  drawTexturedPlate(imgAtk, 28, 6, 22, 22, COLORS.goldTrim, COLORS.goldShadow, COLORS.white, COLORS.steelOutline); // gold shoulder
  drawPixelLine(imgAtk, 38, 20, 110, 92, COLORS.steelWhite, 4); // Glowing sword blade
  drawPixelLine(imgAtk, 32, 16, 38, 20, COLORS.goldTrim, 2); // crossguard

  // Legs stance wide
  drawTexturedPlate(imgAtk, 16, 102, 18, 16, COLORS.steelDark, COLORS.steelShadow, COLORS.steelMid, COLORS.steelOutline);
  drawTexturedPlate(imgAtk, 48, 102, 18, 16, COLORS.steelDark, COLORS.steelShadow, COLORS.steelMid, COLORS.steelOutline);

  await imgAtk.write(path.join(dir, 'gigante_aco_attack_1780318674639.png') as any);

  // 3. GIGANTE DE AÇO - DEATH
  console.log("Generating Gigante de Aço - DEATH...");
  const imgDeath = new Jimp({ width: 128, height: 128, color: COLORS.black });

  // Severed steel giant falling down
  // Pile of armor plates
  drawTexturedPlate(imgDeath, 36, 86, 56, 32, COLORS.steelDark, COLORS.steelShadow, COLORS.steelMid, COLORS.steelOutline);
  // Helmet fallen off, lying on floor, visor eye turned grey/dark
  drawTexturedPlate(imgDeath, 12, 94, 24, 24, COLORS.steelDark, COLORS.steelShadow, COLORS.steelMid, COLORS.steelOutline);
  drawPixelLine(imgDeath, 14, 106, 32, 106, COLORS.steelOutline, 3); // dark visor slit

  // Steel greatsword broken in two halves
  drawPixelLine(imgDeath, 96, 110, 120, 86, COLORS.steelDark, 3); // hilt half
  drawPixelLine(imgDeath, 78, 66, 102, 42, COLORS.steelDark, 3); // blade tip broken

  // Flying gears / loose mechanical sparks discharging
  for (let i = 0; i < 15; i++) {
    const rx = 40 + Math.floor(Math.random() * 60);
    const ry = 40 + Math.floor(Math.random() * 50);
    setPx(imgDeath, rx, ry, COLORS.goldTrim);
    setPx(imgDeath, rx + 1, ry, COLORS.visorRed);
  }

  await imgDeath.write(path.join(dir, 'gigante_aco_death_1780318657036.png') as any);
}

async function generateJewelGolem() {
  // 1. GOLEM DAS JÓIAS - IDLE
  console.log("Generating Golem das Jóias - IDLE...");
  const imgIdle = new Jimp({ width: 128, height: 128, color: COLORS.black });

  // Majestic heavy geometric shape made of chiseled gold metal plates
  drawTexturedPlate(imgIdle, 34, 46, 60, 52, COLORS.goldMid, COLORS.goldDark, COLORS.goldLight, COLORS.jewelGoldShadow);
  drawTexturedPlate(imgIdle, 48, 18, 32, 28, COLORS.goldMid, COLORS.goldDark, COLORS.goldLight, COLORS.jewelGoldShadow);
  
  // Left arm robust
  drawTexturedPlate(imgIdle, 10, 40, 24, 52, COLORS.goldMid, COLORS.goldDark, COLORS.goldLight, COLORS.jewelGoldShadow);
  // Right arm robust
  drawTexturedPlate(imgIdle, 94, 40, 24, 52, COLORS.goldMid, COLORS.goldDark, COLORS.goldLight, COLORS.jewelGoldShadow);
  
  // Legs
  drawTexturedPlate(imgIdle, 40, 98, 20, 20, COLORS.goldDark, COLORS.jewelGoldShadow, COLORS.goldMid, COLORS.stoneOutline);
  drawTexturedPlate(imgIdle, 68, 98, 20, 20, COLORS.goldDark, COLORS.jewelGoldShadow, COLORS.goldMid, COLORS.stoneOutline);

  // Sparkling jewels embedded (rich glowing rubies, diamonds, emeralds, amethysts)
  drawPixelCircle(imgIdle, 64, 72, 8, COLORS.jewelBlue, true); // giant chest sapphire
  drawPixelCircle(imgIdle, 64, 72, 4, COLORS.jewelBlueGlow, true);
  drawPixelCircle(imgIdle, 64, 72, 1, COLORS.white, true);

  // Glistening encrusted gem points
  drawBlock(imgIdle, 54, 32, 3, COLORS.jewelRedGlow); // Red jewel eyes
  drawBlock(imgIdle, 70, 32, 3, COLORS.jewelRedGlow);

  drawBlock(imgIdle, 20, 50, 4, COLORS.jewelGreen); // emerald studs
  drawBlock(imgIdle, 20, 70, 4, COLORS.jewelPurple); // amethyst studs
  drawBlock(imgIdle, 104, 50, 4, COLORS.jewelPurple);
  drawBlock(imgIdle, 104, 70, 4, COLORS.jewelGreen);

  // Sparkling shines (+) on gold corners to emphasize raw wealth & class
  drawPixelLine(imgIdle, 64, 10, 64, 16, COLORS.white);
  drawPixelLine(imgIdle, 61, 13, 67, 13, COLORS.white);

  await imgIdle.write(path.join(dir, 'golem_joias_idle_1780318689252.png') as any);

  // 2. GOLEM DAS JÓIAS - ATTACK
  console.log("Generating Golem das Jóias - ATTACK...");
  const imgAtk = new Jimp({ width: 128, height: 128, color: COLORS.black });

  // Prism light rays radiating forward (crystal beam)
  for (let i = 0; i < 15; i++) {
    const rx = 64 + i * 4;
    const ry = 64 + Math.floor(Math.sin(i) * 12);
    drawPixelCircle(imgAtk, rx, ry, 3, COLORS.jewelBlueGlow, false);
    drawPixelCircle(imgAtk, rx, ry, 1, COLORS.white, true);
  }

  // Slamming crystal force structure
  drawTexturedPlate(imgAtk, 24, 48, 56, 48, COLORS.goldMid, COLORS.goldDark, COLORS.goldLight, COLORS.jewelGoldShadow);
  drawTexturedPlate(imgAtk, 38, 22, 30, 26, COLORS.goldMid, COLORS.goldDark, COLORS.goldLight, COLORS.jewelGoldShadow);
  
  // Fists lunging (realigned gold arms)
  drawTexturedPlate(imgAtk, 88, 38, 28, 40, COLORS.goldMid, COLORS.goldDark, COLORS.goldLight, COLORS.jewelGoldShadow);
  // Large ruby gem on slamming knuckles
  drawPixelCircle(imgAtk, 102, 58, 8, COLORS.jewelRed, true);
  drawPixelCircle(imgAtk, 102, 58, 4, COLORS.jewelRedGlow, true);

  // Legs stance strong
  drawTexturedPlate(imgAtk, 26, 96, 20, 16, COLORS.goldDark, COLORS.jewelGoldShadow, COLORS.goldMid, COLORS.stoneOutline);
  drawTexturedPlate(imgAtk, 54, 96, 20, 16, COLORS.goldDark, COLORS.jewelGoldShadow, COLORS.goldMid, COLORS.stoneOutline);

  await imgAtk.write(path.join(dir, 'golem_joias_attack_1780318708000.png') as any);

  // 3. GOLEM DAS JÓIAS - DEATH
  console.log("Generating Golem das Jóias - DEATH...");
  const imgDeath = new Jimp({ width: 128, height: 128, color: COLORS.black });

  // Shaving off and scattering millions of colored glowing pixels
  // Torso ruptured in half, gold blocks split
  drawTexturedPlate(imgDeath, 24, 92, 32, 26, COLORS.goldDark, COLORS.jewelGoldShadow, COLORS.goldMid, COLORS.stoneOutline);
  drawTexturedPlate(imgDeath, 72, 94, 32, 24, COLORS.goldDark, COLORS.jewelGoldShadow, COLORS.goldMid, COLORS.stoneOutline);

  // Multi-colored gemstone chunks spilled all over the ground
  // Sapphires, Rubies, Emeralds, Amethysts
  drawPixelCircle(imgDeath, 20, 110, 4, COLORS.jewelBlue, true);
  drawPixelCircle(imgDeath, 46, 112, 3, COLORS.jewelRed, true);
  drawPixelCircle(imgDeath, 82, 110, 5, COLORS.jewelGreen, true);
  drawPixelCircle(imgDeath, 104, 112, 4, COLORS.jewelPurple, true);

  // Disintegrating golden/diamond particles falling like stars
  for (let i = 0; i < 40; i++) {
    const rx = 10 + Math.floor(Math.random() * 108);
    const ry = 20 + Math.floor(Math.random() * 80);
    const gemColor = [COLORS.jewelBlueGlow, COLORS.jewelRedGlow, COLORS.jewelGreenGlow, COLORS.jewelPurpleGlow, COLORS.white, COLORS.goldLight][i % 6];
    setPx(imgDeath, rx, ry, gemColor);
  }

  await imgDeath.write(path.join(dir, 'golem_joias_death_1780318689252.png') as any);
}

async function run() {
  console.log("Executing high-fidelity custom pixel art render...");
  await generateStoneGolem();
  await generateSteelGiant();
  await generateJewelGolem();
  console.log("High-fidelity custom pixel art replacements for Portal C completed successfully!");
}

run().catch(err => {
  console.error(err);
});
