import { hexToRgb, rgbToHex, hexToHsl, hslToHex } from "./colorMath.js";

export function watercolorMix(hex1, hex2, ratio = 0.5) {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);
  // Subtractive-ish mixing: multiply then blend
  const mr = Math.sqrt((1 - ratio) * (c1.r / 255) ** 2 + ratio * (c2.r / 255) ** 2) * 255;
  const mg = Math.sqrt((1 - ratio) * (c1.g / 255) ** 2 + ratio * (c2.g / 255) ** 2) * 255;
  const mb = Math.sqrt((1 - ratio) * (c1.b / 255) ** 2 + ratio * (c2.b / 255) ** 2) * 255;
  // Slight desaturation to mimic pigment dulling
  const hsl = hexToHsl(rgbToHex(mr, mg, mb));
  const desat = Math.max(0, hsl.s - 6);
  return hslToHex(hsl.h, desat, hsl.l);
}

export function isMuddy(hex1, hex2) {
  const mixed = watercolorMix(hex1, hex2);
  const hsl = hexToHsl(mixed);
  const h1 = hexToHsl(hex1);
  const h2 = hexToHsl(hex2);
  const hueDiff = Math.abs(h1.h - h2.h);
  const normalizedDiff = hueDiff > 180 ? 360 - hueDiff : hueDiff;
  if (hsl.s < 22 && normalizedDiff > 60 && normalizedDiff < 170) return true;
  if (hsl.l < 30 && hsl.s < 30 && normalizedDiff > 80) return true;
  return false;
}

// Returns the hex from `candidates` that mixes most beautifully with `hex`.
// Prefers split-complementary hue distances (120–160°), non-muddy results,
// and a vibrant mixed saturation.
export function findBestMix(hex, candidates) {
  const { h: h1, l: l1 } = hexToHsl(hex);
  let bestHex = null;
  let bestScore = -Infinity;

  for (const candidate of candidates) {
    if (candidate.hex.toLowerCase() === hex.toLowerCase()) continue;
    if (isMuddy(hex, candidate.hex)) continue;

    const { h: h2, l: l2 } = hexToHsl(candidate.hex);
    const hueDiff = Math.min(Math.abs(h1 - h2), 360 - Math.abs(h1 - h2));

    // Prefer split-complementary (120–160°); penalise near-identical or pure-opposite hues
    let hueScore;
    if (hueDiff < 30)        hueScore = 0;
    else if (hueDiff < 60)   hueScore = 20;
    else if (hueDiff < 120)  hueScore = 45;
    else if (hueDiff <= 160) hueScore = 80; // sweet spot
    else                     hueScore = 55; // near-complementary — fine but can muddy

    // Similar lightness blends more cleanly
    const lightnessScore = Math.max(0, 25 - Math.abs(l1 - l2));

    // Reward a vibrant result
    const mixResult = watercolorMix(hex, candidate.hex);
    const mixSat = hexToHsl(mixResult).s;

    const total = hueScore + lightnessScore + mixSat * 0.5;
    if (total > bestScore) { bestScore = total; bestHex = candidate.hex; }
  }

  // Fallback if every candidate is muddy: pick the widest hue separation
  if (!bestHex) {
    let fallback = -Infinity;
    for (const candidate of candidates) {
      if (candidate.hex.toLowerCase() === hex.toLowerCase()) continue;
      const { h: h2 } = hexToHsl(candidate.hex);
      const d = Math.min(Math.abs(h1 - h2), 360 - Math.abs(h1 - h2));
      if (d > fallback) { fallback = d; bestHex = candidate.hex; }
    }
  }

  return bestHex ?? candidates[0].hex;
}
